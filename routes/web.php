<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TicketController;

Route::get('/', function () {
    return redirect('events');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::resource('events', EventController::class);
Route::post('events/{event}/join-waiting-list', [EventController::class, 'joinWaitingList'])
    ->name('events.join-waiting-list')
    ->middleware('throttle:waiting-list-limiter');

Route::post('/user-ticket', [TicketController::class, 'userTicket']);

Route::post('/queue-position', [EventController::class, 'queuePosition']);



Route::resource('tickets', TicketController::class);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
