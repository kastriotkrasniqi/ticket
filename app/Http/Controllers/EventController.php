<?php

namespace App\Http\Controllers;

use App\Enums\WaitingStatus;
use App\Http\Resources\EventResource;
use App\Jobs\JoinWaitingList;
use App\Models\Event;
use App\Models\WaitingListEntry;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 5);
        $events = EventResource::collection(Event::paginate(perPage: $perPage));

        return Inertia::render('Events/Index', [
            'events' => Inertia::merge(fn() => $events),
            'perPage' => $perPage,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $event = Event::findOrFail($id);

        return Inertia::render('Events/Show', [
            'event' => new EventResource($event),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
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
