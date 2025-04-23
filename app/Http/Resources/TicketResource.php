<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
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
            'event_id' => $this->event_id,
            'user_id' => $this->user_id,
            'purchased_at' => $this->purchased_at,
            'status' => $this->status,
            'payment_intent_id' => $this->payment_intent_id,
            'amount' => $this->amount,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // 'event' => new EventResource($this->whenLoaded('event')),
            // 'user' => new UserResource($this->whenLoaded('user')),
            // 'is_user_ticket' => $this->whenLoaded('isUserTicket', function () {
            //     return $this->isUserTicket();
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
