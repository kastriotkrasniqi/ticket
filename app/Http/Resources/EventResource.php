<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $start = Carbon::parse($this->start_date);
        $end = Carbon::parse($this->end_date);

        $sameDay = $start->isSameDay($end);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'date' => $this->start_date,
            'isoDate' => Carbon::parse($this->start_date)->toIso8601String(),
            'humanDate' => Carbon::parse($this->start_date)->format('F j, g:i A'),
            'endHumanDate' => Carbon::parse($this->end_date)->format('F j, Y g:i A'),
            'humanDateRange' => $sameDay
                ? $start->format('F j, Y') . ' • ' . $start->format('g:i A') . ' – ' . $end->format('g:i A')
                : $start->format('F j,') . ' • ' . $start->format('g:i A') . ' – ' . $end->format('F j, Y') . ' • ' . $end->format('g:i A'),
            'location' => $this->location,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'price' => $this->price,
            'total_tickets' => $this->total_tickets,
            'user_id' => $this->user_id,
            'image' => $this->image ?? 'https://placehold.co/600',
            'is_canceled' => $this->is_canceled,
            'available' => $this->isAvailable(),
            'available_spots' => $this->availableSpots(),
            'purchased_count' => $this->purchasedCount(),
            'active_offers' => $this->activeOffers(),
            'is_owner' => $this->isEventOwner($user),
            'is_past_event' => $this->end_date < now(),
            'is_sold_out' => $this->isSoldOut(),
            'user_ticket' => $this->userTicket($user),
            'queue_position' => $this->queuePosition($user),
        ];
    }
}
