<?php

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
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
    public function store(Request $request) {}

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $event = Event::with(['tickets', 'waitingListEntries'])->findOrFail($id);

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


    public function search($query)
    {

        if (empty($query)) {
            return response()->json([]);
        }

        try {
            $events = Event::search($query)->options([
                'query_by' => 'name, description'
            ])->get();

            return response()->json(EventResource::collection($events));
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Error occurred while searching.'], 500);

        }

    }

}
