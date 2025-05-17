<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use Inertia\Inertia;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Resources\TicketResource;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = Ticket::with('event')->paginate(10);

        return Inertia::render('Tickets/Index', [
            'tickets' => TicketResource::collection($tickets),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }

    public function userTicket(Request $request)
    {
        $user = auth()->user();
        $ticket = Ticket::where('user_id', $user->id)
            ->where('event_id', $request->event_id)->first();

        return response()->json($ticket);
    }


    public function downloadTicket($id)
    {
        $ticket = Ticket::where('id',$id)->firstOrFail();
            // Generate QR code as base64 PNG
            $qrCode = QrCode::format('png')->size(150)->generate(url('/tickets/'.$ticket->id.'/qr'));

        $pdf = Pdf::loadView('pdf.ticket', [
            'ticket' => $ticket,
            'qrCode' => $qrCode,
        ]);

        return $pdf->download("ticket-{$ticket->id}.pdf");
    }


    public function scanTicket($ticket_id)
    {
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
