<?php

namespace App\Models;

use App\Enums\WaitingStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaitingListEntry extends Model
{
    use HasFactory;

    protected $table = 'waiting_list';

    protected $fillable = [
        'event_id',
        'user_id',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'status' => WaitingStatus::class,
        'expires_at' => 'datetime',
    ];

    protected function expiresAt(): Attribute
    {
        return Attribute::make(
            get: fn (string $value): ?int => (int) $value,
            set: fn (string $value): ?int => Carbon::parse($value)->timestamp,
        );
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
