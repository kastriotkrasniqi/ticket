<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Enums\WaitingStatus;
use Illuminate\Http\Request;
use App\Models\WaitingListEntry;

class WaitingListController extends Controller
{

    public function getQueuePosition($eventId, $userId)
    {
        $entry = WaitingListEntry::where('event_id', $eventId)
            ->where('user_id', $userId)
            ->where('status','!=' , WaitingStatus::EXPIRED)
            ->first();

        if ($entry) {
            $peopleAhead = WaitingListEntry::where('event_id', $eventId)
                ->where('created_at', '<', $entry->created_at)
                ->whereIn('status', [WaitingStatus::WAITING, WaitingStatus::OFFERED])
                ->count();

            return response()->json([
                'people_ahead' => $peopleAhead + 1,
                'entry' => $entry,
            ]);
        }

        return NULL;
    }


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


    public function processQueue($eventId)
    {
        $event = Event::findorFail($eventId);
        if($event->availableSpots() <= 0) {
            return response()->json(0);
        }

        $waitingUsers = WaitingListEntry::where('event_id', $eventId)
            ->whereIn('status', [WaitingStatus::WAITING])
            ->take($event->availableSpots())
            ->get();

        foreach ($waitingUsers as $user) {
            $user->status = WaitingStatus::OFFERED;
            $user->expires_at = now()->addMinutes(WaitingListEntry::OFFER_EXPIRE_MINUTES);
            $user->save();
        }

        return response()->json($waitingUsers);

    }




}
