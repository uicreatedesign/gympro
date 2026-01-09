<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    
    // API endpoints for real-time notifications
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
    Route::get('/api/notifications/recent', [NotificationController::class, 'getRecent'])->name('notifications.recent');
    Route::patch('/api/notifications/{id}/read', [NotificationController::class, 'markAsReadApi'])->name('notifications.api.read');
    Route::patch('/api/notifications/mark-all-read', [NotificationController::class, 'markAllAsReadApi'])->name('notifications.api.mark-all-read');
    Route::delete('/api/notifications/{id}', [NotificationController::class, 'destroyApi'])->name('notifications.api.destroy');
});
