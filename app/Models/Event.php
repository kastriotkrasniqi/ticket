<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'location',
        'date',
        'price',
        'total_tickets',
        'user_id',
        'image',
        'is_canceled',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function hasEnoughTickets(): bool
    {
        return $this->tickets()->count() < $this->total_tickets;
    }
}
