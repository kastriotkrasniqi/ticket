<?php

namespace App\Services;

use Exception;
use Stripe\StripeClient;
use App\Models\Event;
use Stripe\Account;
use Stripe\AccountLink;
use Stripe\Checkout\Session;

class StripeConnectService
{
    protected StripeClient $client;

    public function __construct()
    {
        $this->client = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Create a new Stripe Express account.
     *
     * @param string $email
     * @return Account|null
     */
    public function createExpressAccount(string $email): ?Account
    {
        try {
            return $this->client->accounts->create([
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
            ]);
        } catch (Exception $e) {
            report($e);
            return null;
        }
    }

    /**
     * Generate a Stripe onboarding link for a connected account.
     *
     * @param string $accountId
     * @return string|null
     */
    public function createOnboardingLink(string $accountId): ?string
    {
        try {
            $accountLink = $this->client->accountLinks->create([
                'account' => $accountId,
                'refresh_url' => route('stripe.onboarding.refresh'),
                'return_url' => route('stripe.onboarding.return'),
                'type' => 'account_onboarding',
            ]);

            return $accountLink->url;
        } catch (Exception $e) {
            report($e);
            return null;
        }
    }

    /**
     * Check if a connected account is fully enabled.
     *
     * @param string $accountId
     * @return bool
     */
    public function isAccountFullyEnabled(string $accountId): bool
    {
        try {
            $account = $this->client->accounts->retrieve($accountId);
            return $account->charges_enabled && $account->payouts_enabled;
        } catch (Exception $e) {
            report($e);
            return false;
        }
    }

    /**
     * Create a Stripe Checkout session for a ticket purchase.
     *
     * @param Event $event
     * @return Session|null
     */
    public function createPaymentIntent(Event $event): ?Session
    {
        try {
            if (!$event->user || !$event->user->stripe_id) {
                throw new Exception('Event creator does not have a connected Stripe account.');
            }

            $applicationFeePercentage = config('services.stripe.fees.application_percentage');

            return $this->client->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $event->name,
                                'description' => $event->description,
                            ],
                            'unit_amount' => (int) ($event->price * 100),
                        ],
                        'quantity' => 1,
                    ]
                ],
                'expires_at' => now()->addMinutes(30)->timestamp,
                'payment_intent_data' => [
                    'application_fee_amount' => (int) round($event->price * 100 * $applicationFeePercentage),
                ],
                'mode' => 'payment',
                'success_url' => route('home'),
                'cancel_url' => route('home'),
                'metadata' => [
                    'event_id' => $event->id,
                    'user_id' => auth()->id(),
                ],
            ], [
                'stripe_account' => $event->user->stripe_id,
            ]);
        } catch (Exception $e) {
            report($e);
            return null;
        }
    }

    /**
     * Retrieve Stripe account details.
     *
     * @param string $accountId
     * @return Account|null
     */
    public function getAccount(string $accountId): ?Account
    {
        try {
            return $this->client->accounts->retrieve($accountId);
        } catch (Exception $e) {
            report($e);
            return null;
        }
    }

    /**
     * Create a Stripe account session for account dashboard access.
     *
     * @param string $stripeId
     * @return string|null
     */
    public function createAccountSession(string $stripeId): ?string
    {
        try {
            $accountSession = $this->client->accountSessions->create([
                'account' => $stripeId,
                'components' => [
                    'payments' => [
                        'enabled' => true,
                        'features' => [
                            'refund_management' => true,
                            'dispute_management' => true,
                            'capture_payments' => true,
                        ],
                    ],
                ],
            ]);

            return $accountSession->client_secret;
        } catch (Exception $e) {
            report($e);
            return null;
        }
    }
}
