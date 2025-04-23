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
            'humanDate' => Carbon::createFromTimestamp($this->date)->format('d/m/Y'),
            'location' => $this->location,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'price' => $this->price,
            'total_tickets' => $this->total_tickets,
            'user_id' => $this->user_id,
            'image' => 'https://placehold.co/400',
            'is_canceled' => $this->is_canceled,
            'remaining_tickets' => $this->availableSpots(),
            // 'user' => new UserResource($this->whenLoaded('user')),
            // 'tickets' => TicketResource::collection($this->whenLoaded('tickets')),
            // 'has_enough_tickets' => $this->whenLoaded('hasEnoughTickets', function () {
            //     return $this->hasEnoughTickets();
            // }),
            // 'is_user_event' => $this->whenLoaded('isUserEvent', function () {
            //     return $this->isUserEvent();
            // }),
            // 'is_user_ticket' => $this->whenLoaded('isUserTicket', function () {
            //     return $this->isUserTicket();
            // }),
        ];
    }
}
