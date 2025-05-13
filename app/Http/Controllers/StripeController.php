<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use Stripe\Webhook;
use Inertia\Inertia;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\StripeConnectService;

class StripeController extends Controller
{
    /**
     * Show the Stripe setup page.
     *
     * @return \Inertia\Response
     */
    public function index(StripeConnectService $stripe)
    {
        $user = auth()->user();
        $isConnected = !empty($user->stripe_id);
        $stripeAccount = null;

        if ($isConnected) {
            try {
                $stripeAccount = $stripe->getAccount($user->stripe_id);
            } catch (\Exception $e) {
                $isConnected = false;
                $stripeAccount = null;
            }
        }


        return Inertia::render('settings/stripe', [
            'isConnected' => $isConnected,
            'stripeAccount' => $stripeAccount,
        ]);
    }


    /**
     * Redirect the user to Stripe onboarding flow.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\StripeConnectService  $stripe
     */
    public function onboard(Request $request, StripeConnectService $stripe)
    {
        try {
            $user = auth()->user();

            if (!$user->stripe_id) {
                $account = $stripe->createExpressAccount($user->email);
                $user->stripe_id = $account->id;
                $user->save();
            }

            $url = $stripe->createOnboardingLink($user->stripe_id);
            return Inertia::location($url);
        } catch (\Throwable $th) {
            session()->flash('message', $th->getMessage());
            return Inertia::location(route('stripe.onboard'));
        }
    }



    public function disconnect()
    {

    }





    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook.secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        try {
            if ($event->type === 'checkout.session.completed') {
                $session = $event->data->object;

                $eventId = $session->metadata->event_id ?? null;
                $userId = $session->metadata->user_id ?? null;

                if ($eventId && $userId) {

                    Ticket::create([
                        'event_id' => $eventId,
                        'user_id' => $userId,
                        'status' => TicketStatus::VALID,
                        'payment_intent_id' => $session->payment_intent,
                        'amount' => $session->amount_total / 100,
                        'purchased_at' => now()
                    ]);
                }
            }

        } catch (\Throwable $th) {
            Log::error('Stripe webhook error: ' . $th->getMessage());
        }
        return response()->json(['status' => 'success'], 200);
    }


    public function accountSession(StripeConnectService $stripe){
        $client_secret = $stripe->createAccountSession(auth()->user()->stripe_id);

        return response()->json([
            'client_secret' => $client_secret
        ]);
    }
}
