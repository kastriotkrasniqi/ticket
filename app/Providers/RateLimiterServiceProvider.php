<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class RateLimiterServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // RateLimiter::for('waiting-list-limiter', function (Request $request) {
        //     return Limit::perMinutes(30, 3)->by(optional($request->user())->id ?: $request->ip());
        // });
    }
}
