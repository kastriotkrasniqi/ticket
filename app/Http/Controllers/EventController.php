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
        $events = Event::paginate(5);

        return Inertia::render('Events/Index', [
            'events' => Inertia::merge(function () use ($events) {
                sleep(2);
                return EventResource::collection($events->items());
            }),
            'current' => $events->currentPage(),
            'last' => $events->lastPage(),
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




}
