<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Event;
use App\Enums\WaitingStatus;
use App\Jobs\ExpireOfferJob;
use App\Models\WaitingListEntry;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class JoinWaitingList implements ShouldQueue
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
        if ($this->event->availableSpots() > 0) {
            WaitingListEntry::create([
                'event_id' => $this->event->id,
                'user_id' => $this->user->id,
                'expires_at' => now()->addMinutes(WaitingListEntry::OFFER_EXPIRE_MINUTES),
                'status' => WaitingStatus::OFFERED,
            ]);

            // Schedule a job to expire this offer after the offer duration
            ExpireOfferJob::dispatch($this->event, $this->user)
                ->delay(now()->addMinutes(WaitingListEntry::OFFER_EXPIRE_MINUTES));

        } else {
            WaitingListEntry::create([
                'event_id' => $this->event->id,
                'user_id' => $this->user->id,
                'status' => WaitingStatus::WAITING,
            ]);
        }
    }

}
