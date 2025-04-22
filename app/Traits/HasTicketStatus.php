<?php

namespace App\Traits;

trait HasTicketStatus
{
    public function isValid()
    {
        return $this->status === 'valid';
    }

    public function isUsed()
    {
        return $this->status === 'used';
    }

    public function isRefunded()
    {
        return $this->status === 'refunded';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    public function markAsUsed()
    {
        $this->status = 'used';
        $this->save();
    }

    public function markAsRefunded()
    {
        $this->status = 'refunded';
        $this->save();
    }

    public function markAsCancelled()
    {
        $this->status = 'cancelled';
        $this->save();
    }

    public function markAsValid()
    {
        $this->status = 'valid';
        $this->save();
    }

    public function markAsRefundedAndUpdateAmount($amount)
    {
        $this->status = 'refunded';
        $this->amount = $amount;
        $this->save();
    }

    public function markAsCancelledAndUpdateAmount($amount)
    {
        $this->status = 'cancelled';
        $this->amount = $amount;
        $this->save();
    }

    public function markAsValidAndUpdateAmount($amount)
    {
        $this->status = 'valid';
        $this->amount = $amount;
        $this->save();
    }

    public function markAsUsedAndUpdateAmount($amount)
    {
        $this->status = 'used';
        $this->amount = $amount;
        $this->save();
    }

    public function markAsValidAndUpdatePaymentIntentId($paymentIntentId)
    {
        $this->status = 'valid';
        $this->payment_intent_id = $paymentIntentId;
        $this->save();
    }

    public function markAsUsedAndUpdatePaymentIntentId($paymentIntentId)
    {
        $this->status = 'used';
        $this->payment_intent_id = $paymentIntentId;
        $this->save();
    }

    public function markAsRefundedAndUpdatePaymentIntentId($paymentIntentId)
    {
        $this->status = 'refunded';
        $this->payment_intent_id = $paymentIntentId;
        $this->save();
    }
}
