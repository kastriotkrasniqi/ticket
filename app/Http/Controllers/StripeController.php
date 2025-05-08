<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Stripe\StripeClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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
        $user = Auth::user();
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
        $user = auth()->user();

        if (!$user->stripe_id) {
            $account = $stripe->createExpressAccount($user->email);
            $user->stripe_id = $account->id;
            $user->save();
        }

        $url = $stripe->createOnboardingLink($user->stripe_id);
        return Inertia::location($url);
    }



    public function disconnect()
    {

    }


    public function generateAccountLink(StripeConnectService $stripe)
    {
        $user = auth()->user();

        if ($user->stripe_id) {
            $url = $stripe->createOnboardingLink($user->stripe_id);
            return Inertia::location($url);
        } else {
            return Inertia::location(route('stripe.onboard'));
        }


    }

}
