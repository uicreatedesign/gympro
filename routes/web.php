<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('members', MemberController::class)->except(['show', 'create', 'edit']);
    Route::resource('plans', PlanController::class)->except(['show', 'create', 'edit']);
    Route::resource('subscriptions', SubscriptionController::class)->except(['show', 'create', 'edit']);
    Route::resource('attendances', AttendanceController::class)->except(['show', 'create', 'edit']);
    Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
    
    Route::middleware('can:view_roles')->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    });
    
    Route::middleware('can:create_roles')->post('roles', [RoleController::class, 'store'])->name('roles.store');
    Route::middleware('can:edit_roles')->put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::middleware('can:delete_roles')->delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
});

require __DIR__.'/settings.php';
