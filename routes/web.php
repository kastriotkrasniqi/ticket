<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WaitingListController;

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

Route::get('/search/{query}', [EventController::class, 'search'])->name('events.search');

Route::resource('tickets', TicketController::class);


Route::prefix('/stripe')->middleware(['auth'])->group(function () {

    Route::get('/setup', [StripeController::class, 'index'])->name('settings.stripe');
    Route::get('/onboard', [StripeController::class, 'onboard'])->name('stripe.onboard');
    Route::get('/onboarding/return', function () {
        return redirect()->route('settings.stripe')->with('success', 'Stripe onboarding complete!');
    })->name('stripe.onboarding.return');
    Route::get('/onboarding/refresh', function () {
        return redirect()->route('stripe.onboard')->with('error', 'Please try onboarding again.');
    })->name('stripe.onboarding.refresh');
    Route::post('/stripe/account-link', [StripeController::class, 'generateAccountLink'])->name('stripe.account-link');
    Route::post('/disconnect', [StripeController::class, 'disconnect'])->name('stripe.disconnect');

});






require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
