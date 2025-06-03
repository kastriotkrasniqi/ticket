<?php

namespace Database\Seeders;

use App\Models\Event;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create events factory with users
        Event::factory(10)->create([
            'user_id' => User::factory(),
        ]);

        // Ticket::factory(50)->create([
        //     'event_id' => Event::factory(),
        //     'user_id' => User::factory(),
        // ]);

        User::factory()->create([
            'email' => 'krasniqikastriot01@gmail.com',
            'password' => bcrypt('password'),
            'name' => 'Krasniqi Kastriot',
        ]);

    }
}
