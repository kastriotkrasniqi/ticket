<?php
namespace App\Http\Controllers;

use App\Models\Event;
use App\Enums\WaitingStatus;
use App\Jobs\ExpireOfferJob;
use App\Models\WaitingListEntry;
use Illuminate\Support\Facades\RateLimiter;

class WaitingListController extends Controller
{
    public function joinWaitingList($eventId)
    {
        $user = auth()->user();

        // Optional: Rate limiting (can be toggled via config)
        $key = 'waiting-list-limiter:' . ($user?->id ?? request()->ip());
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Too many attempts. Try again in " . ceil($seconds / 60) . " min."
            ], 429);
        }
        RateLimiter::hit($key, 1800); // 30 minutes

        $event = Event::findOrFail($eventId);

        if ($event->existingEntry($user)) {
            return response()->json(['message' => 'You are already on the waiting list'], 422);
        }

        if ($event->availableSpots() <= 0) {
            // No immediate offers, add to waiting list
            WaitingListEntry::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'status' => WaitingStatus::WAITING,
            ]);

            return response()->json([
                'success' => true,
                'status' => WaitingStatus::WAITING,
                'message' => "Added to waiting list – you'll be notified when a ticket becomes available",
            ]);
        }

        WaitingListEntry::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'expires_at' => now()->addMinutes(config('tickets.offer_expire_minutes'))->timestamp,
            'status' => WaitingStatus::OFFERED,
        ]);

        ExpireOfferJob::dispatch($event, $user)
            ->delay(now()->addMinutes(config('tickets.offer_expire_minutes')));

        return response()->json([
            'success' => true,
            'status' => WaitingStatus::OFFERED,
            'message' => "Ticket reserved – you have 15 minutes to purchase it",
        ]);
    }


    public function releaseOffer($eventId)
    {
        $event = Event::findOrFail($eventId);
        $entry = $event->waitingListEntries()
            ->where('user_id', auth()->id())
            ->where('status', WaitingStatus::OFFERED)
            ->first();

        if ($entry) {
            $entry->delete();
            return response()->json(['message' => 'Offer released']);
        }

        return response()->json(['message' => 'No active offer to release'], 422);
    }
}
