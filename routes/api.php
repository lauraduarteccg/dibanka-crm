<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TypeManagementController;

// Ruta de autenticación
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas con autenticación
Route::middleware('auth:sanctum')->group(function () {
    // 🔹 Rutas de conteo de registros
    Route::get('/management/count', [ManagementController::class, 'count']);
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

    // 🔹 CRUD para Gestiones
    Route::get('/management', [ManagementController::class, 'index']); // Listar gestiones
    Route::post('/management', [ManagementController::class, 'store']); // Crear gestion
    Route::get('/management/{id}', [ManagementController::class, 'show']); // Mostrar una gestion específica
    Route::put('/management/{id}', [ManagementController::class, 'update']); // Actualizar gestion
    Route::delete('/management/{id}', [ManagementController::class, 'destroy']); // Eliminar gestion
 
    // 🔹 CRUD para Consultas
    Route::get('/consultations', [ConsultationController::class, 'index']); // Listar consultas
    Route::post('/consultations', [ConsultationController::class, 'store']); // Crear consulta
    Route::get('/consultations/{consultation}', [ConsultationController::class, 'show']); // Mostrar una consulta específica
    Route::put('/consultations/{consultation}', [ConsultationController::class, 'update']); // Actualizar consulta
    Route::delete('/consultations/{consultation}', [ConsultationController::class, 'destroy']); // Eliminar consulta

    // 🔹 CRUD para Contactos
    Route::get('/contacts', [ContactController::class, 'index']); // Listar contacto
    Route::post('/contacts', [ContactController::class, 'store']); // Crear contacto
    Route::get('/contacts/{contact}', [ContactController::class, 'show']); // Mostrar un contacto específica
    Route::put('/contacts/{contact}', [ContactController::class, 'update']); // Actualizar contacto
    Route::delete('/contacts/{contacts}', [ContactController::class, 'destroy']); // Eliminar contacto

    // 🔹 CRUD para Tipo de Gestiones
    Route::get('/typemanagements', [TypeManagementController::class, 'index']); // Listar tipo de gestiones
    Route::post('/typemanagements', [TypeManagementController::class, 'store']); // Crear tipo de gestion
    Route::get('/typemanagements/{typemanagement}', [TypeManagementController::class, 'show']); // Mostrar un tipo de gestion específica
    Route::put('/typemanagements/{typemanagement}', [TypeManagementController::class, 'update']); // Actualizar tipo de gestion
    Route::delete('/typemanagements/{typemanagement}', [TypeManagementController::class, 'destroy']); // Eliminar tipo de gestion

    // Rutas de autenticación protegidas
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
