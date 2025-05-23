<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WaitingListEntry>
 */
class WaitingListEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['waiting', 'offered', 'accepted', 'expired']),
            'expires_at' => $this->faker->dateTimeBetween('now', '+15 minutes'),

        ];
    }
}
