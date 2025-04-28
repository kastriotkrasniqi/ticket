<?php

namespace App\Traits;

use App\Enums\TicketStatus;

trait HasTicketStatus
{
    public function isValid()
    {
        return $this->status === TicketStatus::VALID;
    }

    public function isUsed()
    {
        return $this->status === TicketStatus::USED;;
    }

    public function isRefunded()
    {
        return $this->status === TicketStatus::REFUNDED;;
    }

    public function isCancelled()
    {
        return $this->status === TicketStatus::CANCELLED;
    }

    public function markAsUsed()
    {
        $this->status =  TicketStatus::USED;
        $this->save();
    }

    public function markAsRefunded()
    {
        $this->status =  TicketStatus::REFUNDED;
        $this->save();
    }

    public function markAsCancelled()
    {
        $this->status =  TicketStatus::CANCELLED;
        $this->save();
    }

    public function markAsValid()
    {
        $this->status =  TicketStatus::VALID;
        $this->save();
    }

    public function markAsRefundedAndUpdateAmount($amount)
    {
        $this->status =  TicketStatus::REFUNDED;
        $this->amount = $amount;
        $this->save();
    }

    public function markAsCancelledAndUpdateAmount($amount)
    {
        $this->status = TicketStatus::CANCELLED;
        $this->amount = $amount;
        $this->save();
    }

    public function markAsValidAndUpdateAmount($amount)
    {
        $this->status = TicketStatus::VALID;
        $this->amount = $amount;
        $this->save();
    }

    public function markAsUsedAndUpdateAmount($amount)
    {
        $this->status = TicketStatus::USED;
        $this->amount = $amount;
        $this->save();
    }

    public function markAsValidAndUpdatePaymentIntentId($paymentIntentId)
    {
        $this->status = TicketStatus::VALID;
        $this->payment_intent_id = $paymentIntentId;
        $this->save();
    }

    public function markAsUsedAndUpdatePaymentIntentId($paymentIntentId)
    {
        $this->status = TicketStatus::USED;
        $this->payment_intent_id = $paymentIntentId;
        $this->save();
    }

    public function markAsRefundedAndUpdatePaymentIntentId($paymentIntentId)
    {
        $this->status = TicketStatus::REFUNDED;
        $this->payment_intent_id = $paymentIntentId;
        $this->save();
    }
}
