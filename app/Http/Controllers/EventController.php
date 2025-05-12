<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Http\Request;
use App\Services\SearchService;
use App\Http\Resources\EventResource;
use App\Services\StripeConnectService;
use Illuminate\Support\Facades\Storage;

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
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'date' => 'required|date',
            'price' => 'required|numeric|min:0',
            'total_tickets' => 'required|integer|min:1',
            'image' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = Storage::url($path);
        }

        $validated['user_id'] = auth()->user()->id;

        $event = Event::create($validated);

        return redirect()->route('events.show', $event)
            ->with('success', 'Event created successfully!');
    }

    public function create(StripeConnectService $stripe)
    {
        $acc = $stripe->getAccount(auth()->user()->stripe_id);
        $stripeReady = $acc && $acc->charges_enabled && $acc->payouts_enabled;

        return Inertia::render('Events/Create',['stripeReady' => $stripeReady
        ]);
    }

    public function edit(Event $event,)
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
