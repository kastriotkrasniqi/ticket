<?php

namespace App\Http\Controllers\Api;

use App\Enums\TicketStatus;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class TicketScanController extends Controller
{
    public function __invoke($ticket_id){

        $ticket = Ticket::find($ticket_id);
        if (!$ticket) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }

        if ($ticket->status === TicketStatus::USED) {
            return response()->json(['error' => 'Ticket already used'], 400);
        }

         if ($ticket->status === TicketStatus::REFUNDED) {
            return response()->json(['error' => 'Ticket already refunded'], 400);
        }

        if ($ticket->status === TicketStatus::VALID) {
            $ticket->status = TicketStatus::USED;
            $ticket->save();

            return response()->json(['message' => 'Ticket validated successfully']);
        }

        return response()->json(['error' => 'Ticket not valid'], 400);

    }
}
