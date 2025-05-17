<?php

use App\Http\Controllers\Api\TicketScanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/tickets/{ticket_id}/qr', TicketScanController::class)->middleware(['auth:sanctum', 'abilities:scan-ticket', 'throttle:3,1']);
