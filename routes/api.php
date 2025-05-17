<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/tickets/{ticket_id}/qr', [App\Http\Controllers\TicketController::class, 'scanTicket'])->middleware(['api','auth:sanctum','abilities:scan-ticket']);
