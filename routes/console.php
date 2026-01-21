<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule dashboard cache refresh every 5 minutes
Schedule::command('dashboard:refresh-cache')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->runInBackground();
