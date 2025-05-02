<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Enums\WaitingStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Jobs\JoinWaitingList;
use App\Models\WaitingListEntry;
use Illuminate\Support\Facades\RateLimiter;

class WaitingListController extends Controller
{

    public function joinWaitingList($eventId)
    {
        $user = request()->user();
        $key = 'waiting-list-limiter:' . ($user?->id ?? request()->ip());

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = ceil($seconds / 60);
            return response()->json([
                'message' => "Too many attempts. Please try again in {$minutes} minute" . ($minutes > 1 ? 's' : '') . "."
            ]);
        }

        RateLimiter::hit($key, 1800);


        $event = Event::findOrFail($eventId);
        $avaialble = $event->availableSpots() > 0;

        if ($event->existingEntry(auth()->user())) {
            return response()->json(['message' => 'You are already on the waiting list'], 422);
        }

        if (!$avaialble) {
            return response()->json(['message' => 'No available spots'], 422);
        }

        JoinWaitingList::dispatch($event, auth()->user());

        return response()->json(
            [
                'success' => true,
                'status' => $avaialble > 0 ? WaitingStatus::OFFERED : WaitingStatus::WAITING,
                'message' => $avaialble > 0 ? "Ticket offered - you have 15 minutes to purchase" : "Added to waiting list - you'll be notified when a ticket becomes available",
            ]
        );
    }





}
