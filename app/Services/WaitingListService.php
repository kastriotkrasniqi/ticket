<?php

namespace App\Services;

use App\Enums\WaitingStatus;
use App\Jobs\ExpireWaitingListOffer;
use App\Jobs\IssueNextWaitingListOffer;
use App\Models\Event;
use App\Models\User;
use App\Models\WaitingListEntry;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WaitingListService
{
    public static function join(Event $event, User $user): array
    {
        // Check if already on the waiting list
        $existing = $event->waitingListEntries()
            ->where('user_id', $user->id)
            ->whereIn('status', [WaitingStatus::WAITING, WaitingStatus::OFFERED])
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'waiting_list' => 'You are already on the waiting list.',
            ]);
        }

        return DB::transaction(function () use ($event, $user) {
            if ($event->availableSpots() <= 0) {
                $entry = WaitingListEntry::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'status' => WaitingStatus::WAITING,
                ]);

                return [
                    'entry' => $entry,
                    'status' => WaitingStatus::WAITING,
                    'message' => 'You have been added to the waiting list for purchasing the ticket.',
                ];
            }

            // Offer immediately
            $entry = WaitingListEntry::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'expires_at' => now()->addMinutes(config('tickets.offer_expire_minutes')),
                'status' => WaitingStatus::OFFERED,
            ]);

            ExpireWaitingListOffer::dispatch($entry)
                ->delay(now()->addMinutes(config('tickets.offer_expire_minutes')));

            return [
                'entry' => $entry,
                'status' => WaitingStatus::OFFERED,
                'message' => 'Ticket reserved – you have '.config('tickets.offer_expire_minutes').' minutes to purchase it.',
            ];
        });
    }

    public static function release(Event $event, User $user, string $status): array
    {
        $entry = $event->waitingListEntries()
            ->where('user_id', $user->id)
            ->where('status', $status)
            ->first();

        if (! $entry) {
            throw ValidationException::withMessages([
                'waiting_list' => 'No active offer to release.',
            ]);
        }

        if ($entry->status === WaitingStatus::OFFERED) {
            $entry->update(['status' => WaitingStatus::EXPIRED]);

            // If releasing the offer creates availability, trigger next offer
            if ($event->availableSpots() > 0) {
                IssueNextWaitingListOffer::dispatch($event->id);
            }
        } else {
            $entry->delete(); // remove WAITING entries on release
        }

        return ['message' => 'Offer released'];
    }
}
