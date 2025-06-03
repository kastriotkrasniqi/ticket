<?php

namespace App\Models;

use App\Enums\TicketStatus;
use App\Enums\WaitingStatus;
use Cviebrock\EloquentSluggable\Sluggable;
use Laravel\Scout\Searchable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Event extends Model
{
    use HasFactory;
    use Searchable;
    use Sluggable;

    protected ?int $purchasedCountCache = null;

    protected ?int $activeOffersCache = null;

    protected $fillable = [
        'name',
        'description',
        'location',
        'start_date',
        'end_date',
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
            'start_date' => 'datetime',
            'end_date' => 'datetime',
        ];
    }

     /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

     /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }



    public function toSearchableArray()
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'location' => $this->location,
            'date' => (int) $this->start_date->timestamp,
            'price' => (float) $this->price,
            'created_at' => $this->created_at->timestamp,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
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
