<?php

namespace App\Jobs;

use App\Enums\WaitingStatus;
use App\Models\WaitingListEntry;
use App\Events\WaitingStatusUpdate;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ExpireWaitingListOffer implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public WaitingListEntry $entry)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (! $this->entry || $this->entry->status !== WaitingStatus::OFFERED) {
            return;
        }

        $this->entry->status = WaitingStatus::EXPIRED;
        $this->entry->save();

        broadcast(new WaitingStatusUpdate(WaitingStatus::EXPIRED, $this->entry->user_id));

        IssueNextWaitingListOffer::dispatch($this->entry->event_id);
    }



}
