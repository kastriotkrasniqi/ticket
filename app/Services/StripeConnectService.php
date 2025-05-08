<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\Account;
use Stripe\AccountLink;
use Stripe\PaymentIntent;

class StripeConnectService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createExpressAccount(string $email): Account
    {
        return Account::create([
            'type' => 'express',
            'country' => 'US',
            'email' => $email,
            'capabilities' => [
                'card_payments' => ['requested' => true],
                'transfers' => ['requested' => true],
            ],
        ]);
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

    public function createPaymentIntent(int $amount, int $fee, string $destinationAccountId): PaymentIntent
    {
        return PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'usd',
            'payment_method_types' => ['card'],
            'application_fee_amount' => $fee,
            'transfer_data' => [
                'destination' => $destinationAccountId,
            ],
        ]);
    }


    public function getAccount(string $accountId): Account
{
    return Account::retrieve($accountId);
}

}
