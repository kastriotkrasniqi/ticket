<?php

namespace App\Jobs;

use App\Enums\WaitingStatus;
use App\Models\Event;
use App\Models\User;
use App\Models\WaitingListEntry;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class JoinWaitingList implements ShouldQueue
{
    use Queueable;

    /**z
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
                'expires_at' => now()->addMinutes(config('tickets.offer_expire_minutes'))->timestamp,
                'status' => WaitingStatus::OFFERED,
            ]);

            // Schedule a job to expire this offer after the offer duration
            ExpireWaitingListOffer::dispatch($this->event, $this->user)
                ->delay(now()->addMinutes(config('tickets.offer_expire_minutes')->timestamp));

        } else {
            WaitingListEntry::create([
                'event_id' => $this->event->id,
                'user_id' => $this->user->id,
                'status' => WaitingStatus::WAITING,
            ]);
        }
    }
}
