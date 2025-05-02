<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\WaitingListEntry;
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

        // Ticket::factory(1)->create([
        //     'event_id' => 21,
        //     'user_id' => 28,
        // ]);

        WaitingListEntry::factory(1)->create([
            'event_id' => 21,
            'user_id' => 28,
            'status'=> 'expired',
            'expires_at' => now()->subMinutes(30),
        ]);
    }
}
