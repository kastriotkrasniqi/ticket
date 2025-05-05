<?php

namespace App\Jobs;

use App\Events\WaitingStatusUpdate;
use App\Models\Event;
use App\Enums\WaitingStatus;
use App\Jobs\ExpireOfferJob;
use App\Events\QueueStatusUpdated;
use App\Models\WaitingListEntry;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class OfferNextInQueueJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $event_id
    ) {
    }


    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $next = WaitingListEntry::where('event_id', $this->event_id)
            ->where('status', WaitingStatus::WAITING)
            ->orderBy('created_at')
            ->first();

        if ($next) {

            $next->status = WaitingStatus::OFFERED;
            $next->expires_at = now()->addMinutes(config('tickets.offer_expire_minutes'))->timestamp;
            $next->save();

            ExpireOfferJob::dispatch($next)
            ->delay(now()->addMinutes(config('tickets.offer_expire_minutes')));

            broadcast(new WaitingStatusUpdate($this->event_id, $next->user_id));

        }
    }
}
