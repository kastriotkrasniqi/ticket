<?php

namespace App\Http\Controllers;

use Throwable;
use Inertia\Inertia;
use App\Models\Event;
use App\Jobs\RefundJob;
use Illuminate\Bus\Batch;
use App\Enums\TicketStatus;
use Illuminate\Http\Request;
use App\Services\SearchService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
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
        $events = Event::where('user_id', auth()->user()->id)->paginate(10);
        return Inertia::render('Events/MyEvents', [
            'events' => EventResource::collection($events)
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
            // 'lat' => 'required|numeric',
            // 'lng' => 'required|numeric',
            'date' => 'required|date',
            'price' => 'required|numeric|min:0',
            'total_tickets' => 'required|integer|min:1',
            'image' => 'required|max:2048',
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

        return Inertia::render('Events/Create', [
            'stripeReady' => $stripeReady
        ]);
    }

    public function edit(Event $event, StripeConnectService $stripe)
    {
        $acc = $stripe->getAccount(auth()->user()->stripe_id);
        $stripeReady = $acc && $acc->charges_enabled && $acc->payouts_enabled;

        return Inertia::render('Events/Create', [
            'event' => new EventResource($event),
            'stripeReady' => $stripeReady
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
            'image' => 'nullable|max:2048',
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


    public function cancelEvent($id)
    {
        DB::transaction(function () use ($id) {
            $event = Event::with('tickets.user')->findOrFail($id);

            $jobs = $event->tickets->map(function ($ticket) use ($event) {
                return new RefundJob($ticket, auth()->user()->stripe_id);
            })->toArray();

            $batch = Bus::batch($jobs)
                ->name('Cancel Event ' . $event->id)
                ->catch(function (Batch $batch, Throwable $e) use ($event) {
                    Log::error("Batch refund for event {$event->id} failed: " . $e->getMessage());
                    // optionally notify or flag the event as partially refunded
                })
                ->finally(function (Batch $batch) use ($event) {
                    Log::info("Refund batch {$batch->id} completed for event {$event->id}");
                })->onQueue('refunds')
                ->dispatch();


            $event->update([
                'refunds_batch' => $batch->id
            ]);
        });

        return redirect()->back();
    }



    public function refunds()
    {
        $events = Event::whereNotNull('refunds_batch')->get();
        return Inertia::render('Events/Refunds', [
            'events' => EventResource::collection($events)
        ]);
    }





}
