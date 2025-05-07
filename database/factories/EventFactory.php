<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'description' => fake()->text(),
            'location' => fake()->address(),
            'date' => fake()->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'price' => fake()->randomFloat(2, 0, 100),
            'total_tickets' => fake()->numberBetween(1, 100),
            'user_id' => fake()->numberBetween(1, 10),
            'image' => fake()->imageUrl(),
            'is_canceled' => fake()->boolean(),
        ];
    }
}
