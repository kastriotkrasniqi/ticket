<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\Account;
use App\Models\Event;
use Stripe\AccountLink;
use Stripe\PaymentIntent;
use Stripe\Checkout\Session;

class StripeConnectService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createExpressAccount(string $email): Account
    {
        return Account::create(
            [
                'controller' => [
                    'stripe_dashboard' => [
                        'type' => 'express',
                    ],
                    'fees' => [
                        'payer' => 'application'
                    ],
                    'losses' => [
                        'payments' => 'application'
                    ],
                ],
            ]
        );
    }

    public function createOnboardingLink(string $accountId): string
    {
        $accountLink = AccountLink::create([
            'account' => $accountId,
            'refresh_url' => route('stripe.onboarding.refresh'),
            'return_url' => route('stripe.onboarding.return'),
            'type' => 'account_onboarding',
        ]);

        return $accountLink->url;

    }

    public function isAccountFullyEnabled(string $accountId): bool
    {
        $account = Account::retrieve($accountId);
        return $account->charges_enabled && $account->payouts_enabled;
    }

    public function createPaymentIntent(Event $event)
    {
         $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $event->name,
                            'description' => $event->description,
                        ],
                        'unit_amount' => $event->price * 100,
                    ],
                    'quantity' => 1,
                ]
            ],
            'expires_at' => now()->addMinutes(30)->timestamp,
            'payment_intent_data' => [
                'application_fee_amount' => round($event->price * 100 * 0.01),
            ],
            'mode' => 'payment',
            'success_url' => route('home'),
            'cancel_url' => route('home'),
            'metadata' => [
                'event_id' => $event->id,
                'user_id' => auth()->id(),
            ],
        ], [
            'stripe_account' => $event->user->stripe_id, // ✅ connect to seller's account
        ]);

        return response()->json([
            'url' => $session->url,
        ]);
    }


    public function getAccount(string $accountId): Account
    {
        return Account::retrieve($accountId);
    }

}
