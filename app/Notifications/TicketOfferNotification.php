<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TicketOfferNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Event $event,
        protected $expiresAt
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Tickets Available for ' . $this->event->name)
            ->line('Good news! Tickets are now available for ' . $this->event->name)
            ->line('You have 30 minutes to purchase your tickets before this offer expires.')
            ->action('Purchase Tickets', route('tickets.purchase', $this->event))
            ->line('Offer expires at: ' . $this->expiresAt->format('Y-m-d H:i:s'));
    }
}