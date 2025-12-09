<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\MemberDashboardController;
use App\Http\Controllers\MemberPlanController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TrainerController;
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
    Route::get('member/dashboard', [MemberDashboardController::class, 'index'])->name('member.dashboard');
    Route::get('member/attendance', [MemberDashboardController::class, 'attendance'])->name('member.attendance');
    Route::get('member/plans', [MemberPlanController::class, 'index'])->name('member.plans');
    Route::get('member/checkout/{plan}', [MemberPlanController::class, 'checkout'])->name('member.checkout');
    Route::post('member/payment/initiate', [MemberPlanController::class, 'initiatePayment'])->name('member.payment.initiate');
    Route::get('member/payment/simulate', [MemberPlanController::class, 'simulatePayment'])->name('member.payment.simulate');
    Route::any('member/payment/callback', [MemberPlanController::class, 'paymentCallback'])->name('member.payment.callback')->withoutMiddleware([
        \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class,
    ]);

    Route::resource('members', MemberController::class)->except(['show', 'create', 'edit']);
    Route::resource('plans', PlanController::class)->except(['show', 'create', 'edit']);
    Route::resource('subscriptions', SubscriptionController::class)->except(['show', 'create', 'edit']);
    Route::resource('attendances', AttendanceController::class)->except(['show', 'create', 'edit']);
    Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
    Route::resource('trainers', TrainerController::class)->except(['show', 'create', 'edit']);
    Route::resource('payments', PaymentController::class)->except(['show', 'create', 'edit']);
    Route::get('payments/{payment}/invoice', [PaymentController::class, 'invoice'])->name('payments.invoice');
    
    // PhonePe Payment Routes
    Route::post('phonepe/initiate', [PaymentController::class, 'initiatePayment'])->name('phonepe.initiate');
    Route::any('phonepe/callback', [PaymentController::class, 'callback'])->name('payment.callback');
    Route::post('phonepe/webhook', [PaymentController::class, 'webhook'])->name('phonepe.webhook');
    Route::post('phonepe/status', [PaymentController::class, 'checkStatus'])->name('phonepe.status');
    Route::post('phonepe/refund', [PaymentController::class, 'refund'])->name('phonepe.refund');
    Route::get('payment/success', fn() => Inertia::render('Payment/Success'))->name('payment.success');
    Route::get('payment/failed', fn() => Inertia::render('Payment/Failed'))->name('payment.failed');
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    
    Route::middleware('can:view_roles')->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    });
    
    Route::middleware('can:create_roles')->post('roles', [RoleController::class, 'store'])->name('roles.store');
    Route::middleware('can:edit_roles')->put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::middleware('can:delete_roles')->delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
});

require __DIR__.'/settings.php';
