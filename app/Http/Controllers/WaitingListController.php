<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Enums\WaitingStatus;
use Illuminate\Http\Request;
use App\Jobs\JoinWaitingList;
use App\Models\WaitingListEntry;

class WaitingListController extends Controller
{

    public function waitingUsers($eventId)
    {
        $event = Event::findorFail($eventId);
        if($event->availableSpots() <= 0) {
            return response()->json(0);
        }

        $waitingUsers = WaitingListEntry::where('event_id', $eventId)
            ->whereIn('status', [WaitingStatus::WAITING])
            ->take($event->availableSpots())
            ->count();

        return response()->json($waitingUsers);
    }


    public function activeOffers($eventId)
    {
        $activeOffers = WaitingListEntry::where('event_id', $eventId)
            ->whereIn('status', [WaitingStatus::OFFERED])
            ->where('expires_at', '>', now()->timestamp)
            ->count();

        return response()->json($activeOffers);
    }



    public function queuePosition(Request $request)
    {
        $event = Event::findOrFail($request->event_id);
        $entry = WaitingListEntry::where('user_id', auth()->user()->id)
            ->where('event_id', $event->id)
            ->whereNot('status', WaitingStatus::EXPIRED)
            ->first();

        if(!$entry) {
            $peopleAhead = WaitingListEntry::where('event_id', $event->id)
            ->where('created_at', '<', $entry->created_at)
            ->whereIn('status', [WaitingStatus::WAITING, WaitingStatus::OFFERED])
            ->count();
        }

        $entry->position = $peopleAhead + 1;

        return response()->json($entry);
    }


    public function joinWaitingList($eventId)
    {
        $event = Event::findOrFail($eventId);
        $avaialble = $event->availableSpots() > 0;

        if($event->existingEntry(auth()->user())) {
            return response()->json(['message' => 'You are already on the waiting list'], 422);
        }

        if(!$avaialble) {
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
