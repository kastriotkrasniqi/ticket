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
    public function __construct(public WaitingListEntry $entry)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->entry) {

            $this->entry->status = WaitingStatus::EXPIRED;
            $this->entry->save();

            OfferNextInQueueJob::dispatch($this->entry->event_id);
        }
    }
}
