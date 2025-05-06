<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WaitingListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('events');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('events', EventController::class);

Route::post('events/{event}/join-waiting-list', [WaitingListController::class, 'joinWaitingList'])
    ->name('events.join-waiting-list');

Route::post('/events/{event}/release-offer', [WaitingListController::class, 'releaseOffer'])->name('events.release-offer');

Route::resource('tickets', TicketController::class);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
