<?php
namespace App\Http\Controllers;

use App\Models\Event;
use App\Enums\WaitingStatus;
use App\Jobs\ExpireOfferJob;
use Illuminate\Http\Request;
use App\Models\WaitingListEntry;
use App\Jobs\OfferNextInQueueJob;
use App\Events\QueueStatusUpdated;
use Illuminate\Support\Facades\DB;
use App\Events\WaitingStatusUpdate;
use Illuminate\Support\Facades\RateLimiter;

class WaitingListController extends Controller
{
    public function joinWaitingList($eventId)
    {
        $user = auth()->user();

        // $key = 'waiting-list-limiter:' . $eventId . ':' . ($user?->id ?? request()->ip());
        // if (RateLimiter::tooManyAttempts($key, 3)) {
        //     $seconds = RateLimiter::availableIn($key);
        //     return response()->json([
        //         'message' => "Too many attempts. Try again in " . ceil($seconds / 60) . " min."
        //     ], 429);
        // }
        // RateLimiter::hit($key, 1800);

        $event = Event::where('id', operator: $eventId)->lockForUpdate()->firstOrFail();

        $existing = WaitingListEntry::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->whereIn('status', [WaitingStatus::WAITING, WaitingStatus::OFFERED])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You are already on the waiting list'], 422);
        }

        DB::transaction(function () use ($event, $user) {

            if ($event->availableSpots() <= 0) {

                WaitingListEntry::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'status' => WaitingStatus::WAITING,
                ]);

                return response()->json(['message' => 'You have been added to the waiting list for purchasing the ticket','status' => WaitingStatus::WAITING], 200);

            } else {

                 $entry = WaitingListEntry::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'expires_at' => now()->addMinutes(config('tickets.offer_expire_minutes'))->timestamp,
                    'status' => WaitingStatus::OFFERED,
                ]);

                ExpireOfferJob::dispatch($entry)
                    ->delay(now()->addMinutes(config('tickets.offer_expire_minutes')));
            }
        });

        return response()->json([
            'success' => true,
            'status' => WaitingStatus::OFFERED,
            'message' => "Ticket reserved – you have " . config('tickets.offer_expire_minutes') . " minutes to purchase it",
        ]);
    }


    public function releaseOffer($eventId,Request $request)
    {

        $entry = WaitingListEntry::where('event_id', $eventId)
            ->where('user_id', auth()->id())
            ->where('status', $request->status)
            ->first();

        if (! $entry) {
            return response()->json(['message' => 'No active offer to release'], 422);
        }

        if ($entry->status === WaitingStatus::OFFERED) {
            $entry->update(['status' => WaitingStatus::EXPIRED]);
            OfferNextInQueueJob::dispatch($eventId);
        } else {
            $entry->delete();
        }

        return response()->json(['message' => 'Offer released']);
    }


}
