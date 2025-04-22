<?php

namespace App\Models;

use App\Traits\HasTicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory, HasTicketStatus;

    protected $fillable = [
        'event_id',
        'user_id',
        'purchased_at',
        'status',
        'payment_intent_id',
        'amount',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
