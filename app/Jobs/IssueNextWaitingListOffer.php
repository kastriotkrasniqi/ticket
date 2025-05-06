<?php

namespace App\Jobs;

use App\Enums\WaitingStatus;
use App\Models\WaitingListEntry;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class IssueNextWaitingListOffer implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public $queue = 'offers';

    public function __construct(public int $event_id) {}

    public function handle(): void
    {
        $next = WaitingListEntry::where('event_id', $this->event_id)
            ->where('status', WaitingStatus::WAITING)
            ->orderBy('created_at')
            ->lockForUpdate()
            ->first();

        if ($next) {
            IssueOfferJob::dispatch($next);
        }
    }
}
