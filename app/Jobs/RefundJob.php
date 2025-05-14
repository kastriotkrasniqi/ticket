<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Ticket;
use App\Enums\TicketStatus;
use App\Mail\TicketRefunded;
use Illuminate\Bus\Batchable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Services\StripeConnectService;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Laravel\Telescope\Telescope;

class RefundJob implements ShouldQueue
{
    use Queueable;
    use Batchable;

    public $tries = 5;
    public $backoff = [10, 30, 60]; // in seconds


    private $stripe;

    /**
     * Create a new job instance.
     */
    public function __construct(private Ticket $ticket, private string $stripe_account)
    {
        $this->stripe = app(StripeConnectService::class);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->batch()->canceled() || $this->stripe->wasRefunded($this->ticket)) {
            return;
        }

        DB::transaction(function () {

            $refund = $this->stripe->refund($this->ticket, $this->stripe_account);

            if (!$refund || $refund->status !== 'succeeded') {
                \Log::warning("Refund failed or incomplete for ticket {$this->ticket->id}");
                return;
            }

            $this->ticket->update([
                'status' => TicketStatus::REFUNDED,
                'refund_id' => $refund->id,
            ]);
        });

        Mail::to($this->ticket->user->email)->send(new TicketRefunded($this->ticket));
    }
}
