<?php

namespace Database\Seeders;

use App\Models\Event;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Ticket;
use App\Models\User;
use App\Models\WaitingListEntry;
use Carbon\Carbon;
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

        WaitingListEntry::factory(25)->create([
            'event_id' => 21,
            'user_id' => User::factory(),
            'status' => 'offered',
            'expires_at' => Carbon::now()->addMinutes(30)->timestamp,
        ]);
    }
}
