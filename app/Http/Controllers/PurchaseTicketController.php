<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Stripe\StripeClient;
use Illuminate\Http\Request;
use App\Services\StripeConnectService;

class PurchaseTicketController extends Controller
{
    public function __invoke(Request $request, StripeConnectService $stripe)
    {

        $request->validate([
            'event_id' => ['required', 'exists:events,id'],
        ]);

        $event = Event::with('user')->findorFail($request->event_id);

        return $stripe->createPaymentIntent($event);
    }
}
