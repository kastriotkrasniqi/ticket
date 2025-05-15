<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\WaitingListController;



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('/', HomeController::class)->only('index')->name('index', 'home');
Route::post('/stripe/webhook', [StripeController::class, 'webhook'])->name('stripe.webhook');
Route::get('/search/{query}', [EventController::class, 'search'])->name('events.search');

Route::prefix('/events')->middleware(['auth'])->group(function () {
    Route::resource('/', EventController::class);
    Route::post('/{event}/join-waiting-list', [WaitingListController::class, 'joinWaitingList'])
        ->name('events.join-waiting-list');
    Route::post('/{event}/release-offer', [WaitingListController::class, 'releaseOffer'])->name('events.release-offer');
    Route::post('/{id}/cancel-event', [EventController::class, 'cancelEvent'])->name('event.cancel');
});


Route::get('/payment-stats', function () {
    return Inertia::render('Dashboard/PaymentStats');
})->name('payments.stats');

Route::prefix('/tickets')->middleware(['auth'])->group(function () {
Route::resource('/', TicketController::class);
Route::get('/tickets/{id}/pdf', [TicketController::class, 'downloadTicket'])->name('ticket.pdf');
Route::post('/tickets/purchase-ticket', \App\Http\Controllers\PurchaseTicketController::class)->name('events.purchase-ticket');
});


Route::prefix('/stripe')->middleware(['auth'])->group(function () {

    Route::get('/setup', [StripeController::class, 'index'])->name('settings.stripe');
    Route::get('/onboard', [StripeController::class, 'onboard'])->name('stripe.onboard');
    Route::get('/onboarding/return', function () {
        return redirect()->route('settings.stripe')->with('success', 'Stripe onboarding complete!');
    })->name('stripe.onboarding.return');
    Route::get('/onboarding/refresh', function () {
        return redirect()->route('stripe.onboard')->with('error', 'Please try onboarding again.');
    })->name('stripe.onboarding.refresh');

    Route::post('/disconnect', [StripeController::class, 'disconnect'])->name('stripe.disconnect');

    Route::post('/account-session', [StripeController::class, 'accountSession'])->name('stripe.account-session');

});







require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
