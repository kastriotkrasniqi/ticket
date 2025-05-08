<?php

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\SearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $events = Event::orderBy('date', 'DESC')->paginate(10);

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'date' => 'required|date',
            'price' => 'required|numeric|min:0',
            'total_tickets' => 'required|integer|min:1',
            'image' => 'required|image|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = Storage::url($path);
        }

        $validated['user_id'] = auth()->user()->id;

        // Create the event
        $event = Event::create($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Event created successfully!');
    }

    public function create()
    {
        return Inertia::render('Events/Create');
    }

    public function edit(Event $event)
    {
        return Inertia::render('Events/Create', [
            'event' => new EventResource($event),
        ]);
    }

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
    public function update(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'date' => 'required|date',
            'price' => 'required|numeric|min:0',
            'total_tickets' => 'required|integer|min:1',
            // 'image' => 'nullable|image|max:2048', // Uncomment if you want to validate a new image
        ]);

        // Handle image upload if a new image is provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = Storage::url($path);
        }

        $event->update($validated);

        return redirect()->route('events.show', $event)
            ->with('message', 'Event updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
    }

    public function search($query, SearchService $searchService)
    {
        return $searchService->search($query);
    }
}
