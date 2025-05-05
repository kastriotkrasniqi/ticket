<?php

namespace App\Models;

use App\Enums\WaitingStatus;
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
        'status' => WaitingStatus::class
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }



}
