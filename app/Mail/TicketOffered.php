<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class TicketOffered extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $afterCommit = true;


    /**
     * Create a new message instance.
     */
    public function __construct(public User $user, public int $event_id, public Carbon $expires_at)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ticket Offered',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket_offer',
            with: [
                'user' => $this->user,
                'event' => Event::find($this->event_id),
                'expires' => Carbon::parse($this->expires_at)->format('F j, Y, g:i A'),
                'purchase_url' => '',
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
