<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create events factory with users
        // \App\Models\Event::factory(10)->create([
        //     'user_id' => User::factory(),
        // ]);

        Ticket::factory(10)->create([
            'event_id' => Event::factory(),
            'user_id' => User::factory(),
        ]);
    }
}
