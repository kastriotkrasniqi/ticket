<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Event;
use App\Enums\WaitingStatus;
use App\Models\WaitingListEntry;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ExpireWaitingListOffer implements ShouldQueue
{
    use Queueable;

    public $queue = 'offers';

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

        $this->entry->update(['status' => WaitingStatus::EXPIRED]);

        IssueNextWaitingListOffer::dispatch($this->entry->event_id);
    }
}
