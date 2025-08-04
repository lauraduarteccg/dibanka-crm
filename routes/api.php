<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\GestionController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\UserController;

// Ruta de autenticación
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas con autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Rutas de conteo de registros
    Route::get('/gestions/count', [GestionController::class, 'count']);
    Route::get('/campaigns/count', [CampaignController::class, 'count']);
    Route::get('/consultations/count', [ConsultationController::class, 'count']);
    Route::get('/contacts/count', [ContactController::class, 'count']);

    // Rutas de usuarios
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // 🔹 CRUD para Campañas
    Route::get('/campaigns', [CampaignController::class, 'index']); // Listar campañas
    Route::post('/campaigns', [CampaignController::class, 'store']); // Crear campaña
    Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']); // Mostrar una campaña específica
    Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']); // Actualizar campaña
    Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy']); // Eliminar campaña

    // Rutas de autenticación protegidas
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
