<?php

namespace App\Models;

use App\Enums\TicketStatus;
use App\Enums\WaitingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Laravel\Scout\Searchable;

class Event extends Model
{
    use HasFactory;
    use Searchable;

    protected ?int $purchasedCountCache = null;

    protected ?int $activeOffersCache = null;

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

    protected function casts(): array
    {
        return [
            'is_canceled' => 'boolean',
            'date' => 'datetime',
        ];
    }


    public function toSearchableArray()
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'location' => $this->location,
            'date' => (int) $this->date->timestamp,
            'price' => (float) $this->price,
            'created_at' => $this->created_at->timestamp,
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
        return $this->purchasedCountCache ??= $this->tickets()
            ->whereIn('status', [TicketStatus::VALID, TicketStatus::USED])
            ->count();
    }

    public function activeOffers(): int
    {
        return $this->activeOffersCache ??= $this->waitingListEntries()
            ->where('status', WaitingStatus::OFFERED)
            ->where('expires_at', '>', now()->timestamp)
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

    public function isEventOwner(?User $user = null): bool
    {
        $user ??= Auth::user();

        return $this->user_id === $user?->id;
    }

    public function isSoldOut(): bool
    {
        return $this->purchasedCount() >= $this->total_tickets;
    }

    public function existingEntry(User $user): ?WaitingListEntry
    {
        return $this->waitingListEntries()
            ->where('user_id', $user->id)
            ->whereNot('status', WaitingStatus::EXPIRED)
            ->first();
    }

    public function userTicket(?User $user = null): ?Ticket
    {
        $user ??= Auth::user();

        return $this->tickets()
            ->where('user_id', $user?->id)
            ->first();
    }

    public function queuePosition(?User $user = null): ?WaitingListEntry
    {
        $user ??= Auth::user();
        if (! $user) {
            return null;
        }

        $entry = $this->waitingListEntries()
            ->where('status', '!=', WaitingStatus::EXPIRED)
            ->where('user_id', $user->id)
            ->first();

        if ($entry) {
            $peopleAhead = $this->waitingListEntries()
                ->where('created_at', '<', $entry->created_at)
                ->whereIn('status', [WaitingStatus::WAITING, WaitingStatus::OFFERED])
                ->count();

            $entry->position = $peopleAhead + 1;
        }

        return $entry;
    }
}
