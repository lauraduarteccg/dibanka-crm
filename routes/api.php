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
    // 🔹 Rutas de conteo de registros
    Route::get('/gestions/count', [GestionController::class, 'count']);
    Route::get('/campaigns/count', [CampaignController::class, 'count']);
    Route::get('/consultations/count', [ConsultationController::class, 'count']);
    Route::get('/contacts/count', [ContactController::class, 'count']);

    // 🔹 Rutas de usuarios
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
    /* 
    // 🔹 CRUD para Gestiones
    Route::get('/gestions', [GestionController::class, 'index']); // Listar gestiones
    Route::post('/gestions', [GestionController::class, 'store']); // Crear gestion
    Route::get('/gestions/{id}', [GestionController::class, 'show']); // Mostrar una gestion específica
    Route::put('/gestions/{id}', [GestionController::class, 'update']); // Actualizar gestion
    Route::delete('/gestions/{id}', [GestionController::class, 'destroy']); // Eliminar gestion
 */
    // 🔹 CRUD para Consultas
    Route::get('/consultations', [ConsultationController::class, 'index']); // Listar consultas
    Route::post('/consultations', [ConsultationController::class, 'store']); // Crear consulta
    Route::get('/consultations/{consultation}', [ConsultationController::class, 'show']); // Mostrar una consulta específica
    Route::put('/consultations/{consultation}', [ConsultationController::class, 'update']); // Actualizar consulta
    Route::delete('/consultations/{consultation}', [ConsultationController::class, 'destroy']); // Eliminar consulta

    // Rutas de autenticación protegidas
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
