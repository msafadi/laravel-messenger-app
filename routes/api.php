<?php

use App\Http\Controllers\ConversationsController;
use App\Http\Controllers\MessagesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function() {

    Route::get('conversations', [ConversationsController::class, 'index']);
    Route::get('conversations/{conversation}', [ConversationsController::class, 'show']);
    Route::post('conversations/{conversation}/participants', [ConversationsController::class, 'addParticipant']);
    Route::delete('conversations/{conversation}/participants', [ConversationsController::class, 'removeParticipant']);

    Route::put('conversations/{conversation}/read', [ConversationsController::class, 'markAsRead']);


    Route::get('conversations/{id}/messages', [MessagesController::class, 'index']);
    Route::post('messages', [MessagesController::class, 'store'])
        ->name('api.messages.store');
    Route::delete('messages/{id}', [MessagesController::class, 'destroy']);
});


