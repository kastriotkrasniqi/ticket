<?php

namespace App\Jobs;

use App\Mail\TicketOffered;
use App\Enums\WaitingStatus;
use App\Models\WaitingListEntry;
use App\Events\WaitingStatusUpdate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class IssueOfferJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public $queue = 'offers';

    public function __construct(public WaitingListEntry $entry)
    {
    }

    public function handle(): void
    {
        try {
            if ($this->entry->status !== WaitingStatus::WAITING) {
                return;
            }

            $this->entry->status = WaitingStatus::OFFERED;
            $this->entry->expires_at = now()->addMinutes(config('tickets.offer_expire_minutes'));
            $this->entry->save();

            broadcast(new WaitingStatusUpdate(WaitingStatus::OFFERED, $this->entry->user_id));

            ExpireWaitingListOffer::dispatch($this->entry)
                ->delay(now()->addMinutes(config('tickets.offer_expire_minutes')));

            $user = $this->entry->user;

            Mail::to($user->email)->queue(
                new TicketOffered($user, $this->entry->event_id, $this->entry->expires_at)
            );
        } catch (\Throwable $e) {
            Log::channel('slack')->error('IssueOfferJob failed', [
                'entry_id' => $this->entry->id ?? null,
                'event_id' => $this->entry->event_id ?? null,
                'user_id' => $this->entry->user_id ?? null,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }
}
