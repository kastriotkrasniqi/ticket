<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'event_id' => Event::factory(),
            'user_id' => User::factory(),
            'purchased_at' => now(),
            'status' => $this->faker->randomElement(['valid', 'used', 'refunded', 'cancelled']),
            'payment_intent_id' => $this->faker->uuid(),
            'amount' => $this->faker->numberBetween(1, 5),
        ];
    }
}
