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
        return $this->hasMany(Ticket::class, 'event_id');
    }

    public function hasEnoughTickets(): bool
    {
        return $this->tickets()->count() < $this->total_tickets;
    }

    public function purchasedCount(): int
    {
        return $this->tickets()
            ->where(function ($query) {
                $query->where('status', 'valid')
                    ->orWhere('status', 'used');
            })
            ->count();
    }


    public function activeOffers(): int
    {
        return $this->tickets()->where('status', 'offered')->count();
    }

    public function availableSpots(): int
    {
        return $this->total_tickets - ($this->purchasedCount() + $this->activeOffers());
    }

}
