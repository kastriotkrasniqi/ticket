<?php

namespace App\Models;

use App\Enums\TicketStatus;
use App\Enums\WaitingStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

        /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_canceled' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'event_id');
    }

    public function waitingListEntries()
    {
        return $this->hasMany(WaitingListEntry::class, 'event_id');
    }


    public function purchasedCount(): int
    {
        return $this->tickets()
            ->whereIn('status',[TicketStatus::VALID, TicketStatus::USED])
            ->count();
    }

    public function activeOffers(): int
    {
        return $this->waitingListEntries()->where('status',WaitingStatus::OFFERED)
        ->where('expires_at' > now()->timestamp)
        ->count();
    }

    public function availableSpots(): int
    {
        return $this->total_tickets - ($this->purchasedCount() + $this->activeOffers());
    }

    public function isAvailable(): bool
    {
        return $this->availableSpots() > 0;
    }

    public function isEventOwner(): bool
    {
        return $this->user_id === auth()->user()?->id;
    }

    public function isSoldOut(): bool
    {
        return $this->purchasedCount() >= $this->total_tickets;
    }







}
