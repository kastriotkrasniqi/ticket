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

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'date' => $this->date->timestamp,
            'isoDate' => Carbon::createFromTimestamp($this->date->timestamp)->toIso8601String(),
            'humanDate' => Carbon::createFromTimestamp($this->date->timestamp)->format('F j, Y'),
            'location' => $this->location,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'price' => $this->price,
            'total_tickets' => $this->total_tickets,
            'user_id' => $this->user_id,
            'image' => 'https://placehold.co/600',
            'is_canceled' => $this->is_canceled,
            'available' => $this->isAvailable(),
            'available_spots' => $this->availableSpots(),
            'purchased_count' => $this->purchasedCount(),
            'active_offers' => $this->activeOffers(),
            'is_owner' => $this->isEventOwner($user),
            'is_past_event' => $this->date->timestamp < now()->timestamp,
            'is_sold_out' => $this->isSoldOut(),
            'user_ticket' => $this->userTicket($user),
            'queue_position' => $this->queuePosition($user),
        ];
    }
}
