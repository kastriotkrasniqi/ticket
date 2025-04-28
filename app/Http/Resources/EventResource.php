<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'date' => $this->date,
            'humanDate' => Carbon::createFromTimestamp($this->date)->format('F j, Y'),
            'location' => $this->location,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'price' => $this->price,
            'total_tickets' => $this->total_tickets,
            'user_id' => $this->user_id,
            'image' => 'https://placehold.co/600',
            'is_canceled' => $this->is_canceled,
            'available' => $this->availableSpots() > 0,
            'available_spots' => $this->availableSpots(),
            'purchased_count' => $this->purchasedCount(),
            'active_offers' => $this->activeOffers(),
            'is_event_owner' => $this->isEventOwner(),
            // 'queue_position' => $this->queuePosition(),
            'is_past_event' => $this->date < now()->timestamp,

        ];
    }
}
