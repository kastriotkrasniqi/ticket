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
        $start = fake()->dateTimeBetween('now', '+1 year');
        $end = fake()->dateTimeBetween($start, (clone $start)->modify('+3 days'));

        return [
            'name' => fake()->name(),
            'description' => fake()->text(),
            'location' => fake()->address(),
            'start_date' => $start->format('Y-m-d'),
            'end_date' => $end->format('Y-m-d'),
            'price' => fake()->randomFloat(2, 0, 100),
            'total_tickets' => fake()->numberBetween(1, 100),
            'user_id' => fake()->numberBetween(1, 10),
            'image' => 'https://placehold.co/600',
            'is_canceled' => fake()->boolean(),
        ];
    }
}
