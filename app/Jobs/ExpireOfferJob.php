<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Event;
use App\Enums\WaitingStatus;
use App\Models\WaitingListEntry;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ExpireOfferJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Event $event, public User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $entry = WaitingListEntry::where('event_id', $this->event->id)
            ->where('user_id', $this->user->id)
            ->where('status', WaitingStatus::OFFERED)
            ->first();

        if ($entry) {
            $entry->status = WaitingStatus::EXPIRED;
            $entry->save();
        }
    }
}
