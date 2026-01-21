<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', App\Http\Controllers\CategoryController::class);
    Route::resource('books', App\Http\Controllers\BookController::class);
    Route::resource('members', App\Http\Controllers\MemberController::class);
    
    Route::resource('borrowings', App\Http\Controllers\BorrowingController::class)->except(['edit', 'update']);
    Route::post('borrowings/{borrowing}/return', [App\Http\Controllers\BorrowingController::class, 'return'])->name('borrowings.return');
    Route::get('borrowings/member/{member}/history', [App\Http\Controllers\BorrowingController::class, 'history'])->name('borrowings.history');
    Route::get('borrowings-dashboard', [App\Http\Controllers\BorrowingController::class, 'dashboard'])->name('borrowings.dashboard');
});

require __DIR__.'/settings.php';
