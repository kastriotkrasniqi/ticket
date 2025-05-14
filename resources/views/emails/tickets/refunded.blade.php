<x-mail::message>
# 🎟️ Ticket Refunded Successfully

Hi {{ $ticket->user->name ?? 'there' }},

We're letting you know that your ticket for the event **“{{ $ticket->event->name }}”** has been **successfully refunded**.

---

**Event:** {{ $ticket->event->name }}
**Date:** {{ $ticket->event->date->format('F j, Y') }}
**Location:** {{ $ticket->event->location ?? 'Online' }}
**Amount Refunded:** ${{ number_format($ticket->amount / 100, 2) }}

<x-mail::button :url="route('tickets.show', $ticket->id)">
View Ticket Details
</x-mail::button>

If you have any questions, feel free to reach out to our support team.

Thanks for being with us!
{{ config('app.name') }} Team
</x-mail::message>
