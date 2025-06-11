<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Event;
use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;

class HomeController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('start_date', 'DESC')
        ->whereNot('is_canceled', true)
        ->paginate(10);

        return Inertia::render('Events/Index', [
            'events' => Inertia::merge(function () use ($events) {
                sleep(2);
                return EventResource::collection($events->items());
            }),
            'current' => $events->currentPage(),
            'last' => $events->lastPage(),
        ]);
    }
}
