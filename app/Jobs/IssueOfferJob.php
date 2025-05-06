<?php

namespace App\Jobs;

use App\Enums\WaitingStatus;
use App\Mail\TicketOffered;
use App\Models\WaitingListEntry;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class IssueOfferJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public $queue = 'offers';

    public function __construct(public WaitingListEntry $entry) {}

    public function handle(): void
    {
        if ($this->entry->status !== WaitingStatus::WAITING) {
            return;
        }

        $this->entry->status = WaitingStatus::OFFERED;
        $this->entry->expires_at = now()->addMinutes(config('tickets.offer_expire_minutes'));
        $this->entry->save();

        ExpireWaitingListOffer::dispatch($this->entry)
            ->delay(now()->addMinutes(config('tickets.offer_expire_minutes')));

        $user = $this->entry->user;

        Mail::to($user->email)->queue(
            new TicketOffered($user, $this->entry->event_id, $this->entry->expires_at)
        );
    }
}
