<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    ActivityLogController,
    AuthController,
    ContactController,
    ManagementController,
    PayrollController,
    ConsultationController,
    ConsultationSpecificController,
    UserController,
    TypeManagementController,
    SpecialCasesController,
    MonitoringController,
    RoleController,
    PasswordResetController
};

// ==========================================================
//  RUTAS PÚBLICAS
// ==========================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->middleware('web')->name('password.request');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// ==========================================================
//  RUTAS PROTEGIDAS (auth:sanctum)
// ==========================================================
Route::middleware(['auth:sanctum'])->group(function () {

    // ==========================================================
    //  CONFIGURACIÓN DEL SISTEMA (config.*)
    // ==========================================================
    Route::prefix('config')->group(function () {

        // ------------------- Usuarios -------------------
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware('permission:config.user.view');
            Route::post('/', [UserController::class, 'store'])->middleware('permission:config.user.create');
            Route::get('{id}', [UserController::class, 'show'])->middleware('permission:config.user.view');
            Route::put('{id}', [UserController::class, 'update'])->middleware('permission:config.user.edit');
            Route::delete('{id}', [UserController::class, 'destroy'])->middleware('permission:config.user.delete');
        });

        // ------------------- Pagadurías -------------------
        Route::prefix('payrolls')->group(function () {
            Route::get('/', [PayrollController::class, 'index'])->middleware('permission:payroll.view');
            Route::post('/', [PayrollController::class, 'store'])->middleware('permission:config.payroll.create');
            Route::put('{payroll}', [PayrollController::class, 'update'])->middleware('permission:config.payroll.edit');
            Route::delete('{payroll}', [PayrollController::class, 'destroy'])->middleware('permission:config.payroll.delete');
        });

        // ------------------- Consultas -------------------
        Route::prefix('consultations')->group(function () {
            Route::get('/', [ConsultationController::class, 'index'])->middleware('permission:consultation.view');
            Route::get('/active', [ConsultationController::class, 'active'])->middleware('permission:consultation.view');
            Route::post('/', [ConsultationController::class, 'store'])->middleware('permission:config.consultation.create');
            Route::put('{consultation}', [ConsultationController::class, 'update'])->middleware('permission:config.consultation.edit');
            Route::delete('{consultation}', [ConsultationController::class, 'destroy'])->middleware('permission:config.consultation.delete');
        });

        // ------------------- Consultas Específicas -------------------
        Route::prefix('consultationspecifics')->group(function () {
            Route::get('/', [ConsultationSpecificController::class, 'index'])->middleware('permission:specific.view');
            Route::get('/active', [ConsultationSpecificController::class, 'active'])->middleware('permission:specific.view');
            Route::post('/', [ConsultationSpecificController::class, 'store'])->middleware('permission:config.specific.create');
            Route::put('{consultationspecific}', [ConsultationSpecificController::class, 'update'])->middleware('permission:config.specific.edit');
            Route::delete('{consultationspecific}', [ConsultationSpecificController::class, 'destroy'])->middleware('permission:config.specific.delete');
        });

        // ------------------- Tipos de Gestiones -------------------
        Route::prefix('typemanagements')->group(function () {
            Route::get('/', [TypeManagementController::class, 'index'])->middleware('permission:typeManagement.view');
            Route::get('/active', [TypeManagementController::class, 'active'])->middleware('permission:typeManagement.view');
            Route::post('/', [TypeManagementController::class, 'store'])->middleware('permission:config.typeManagement.create');
            Route::put('{typemanagement}', [TypeManagementController::class, 'update'])->middleware('permission:config.typeManagement.edit');
            Route::delete('{typemanagement}', [TypeManagementController::class, 'destroy'])->middleware('permission:config.typeManagement.delete');
        });

        // ------------------- Seguimientos -------------------
        Route::prefix('monitorings')->group(function () {
            Route::get('/', [MonitoringController::class, 'index'])->middleware('permission:monitoring.view');
            Route::post('/', [MonitoringController::class, 'store'])->middleware('permission:config.monitoring.create');
            Route::put('{id}', [MonitoringController::class, 'update'])->middleware('permission:config.monitoring.edit');
            Route::delete('{id}', [MonitoringController::class, 'destroy'])->middleware('permission:config.monitoring.delete');
        });

        // ------------------- Roles y Permisos -------------------
        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->middleware('permission:config.role.view');
            Route::get('{id}', [RoleController::class, 'show'])->middleware('permission:config.role.view');
            Route::post('/', [RoleController::class, 'store'])->middleware('permission:config.role.create');
            Route::put('{role}', [RoleController::class, 'update'])->middleware('permission:config.role.edit');
            Route::delete('{role}', [RoleController::class, 'destroy'])->middleware('permission:config.role.delete');
        });
        
        // ------------------- Actividad y logs -------------------
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->middleware('permission:config.role.view');
        
        // ------------------- Lista de permisos -------------------
        Route::get('/permissions', [RoleController::class, 'getPermissions'])
            ->middleware('permission:config.role.view');
    });

    // ==========================================================
    //  MÓDULOS OPERATIVOS
    // ==========================================================

    // ------------------- Contactos -------------------
    Route::get('/contacts', [ContactController::class, 'index'])->middleware('permission:contact.view');
    Route::post('/contacts', [ContactController::class, 'store'])->middleware('permission:contact.create');
    Route::put('/contacts/{contact}', [ContactController::class, 'update'])->middleware('permission:contact.edit');
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->middleware('permission:contact.delete');

    // ------------------- Pagadurías -------------------
    Route::get('/payrolls', [PayrollController::class, 'index'])->middleware('permission:payroll.view');
    Route::get('/payrolls-all', [PayrollController::class, 'all'])->middleware('permission:payroll.view');
    Route::get('/payrolls/active', [PayrollController::class, 'active'])->middleware('permission:payroll.view');

    // ------------------- Seguimientos -------------------
    Route::get('/monitorings/active', [MonitoringController::class, 'active'])->middleware('permission:monitoring.view');

    // ------------------- Gestiones -------------------
    Route::get('/management', [ManagementController::class, 'index'])->middleware('permission:management.view');
    Route::post('/management', [ManagementController::class, 'store'])->middleware('permission:management.create');
    Route::put('/management/{id}', [ManagementController::class, 'update'])->middleware('permission:management.edit');
    Route::put('/managementmonitoring/{id}', [ManagementController::class, 'updateMonitoring'])->middleware('permission:management.edit');
    Route::delete('/management/{id}', [ManagementController::class, 'destroy'])->middleware('permission:management.delete');

    // ------------------- Casos Especiales -------------------
    Route::get('/specialcases', [SpecialCasesController::class, 'index'])->middleware('permission:special_cases.view');
    Route::post('/specialcases', [SpecialCasesController::class, 'store'])->middleware('permission:special_cases.create');
    Route::put('/specialcases/{id}', [SpecialCasesController::class, 'update'])->middleware('permission:special_cases.edit');
    Route::delete('/specialcases/{id}', [SpecialCasesController::class, 'destroy'])->middleware('permission:special_cases.delete');

    // ------------------- Conteos -------------------
    Route::get('/management/count', [ManagementController::class, 'count'])->middleware('permission:management.view');
    Route::get('/contacts/count', [ContactController::class, 'count'])->middleware('permission:contact.view');
    Route::get('/payrolls/count', [PayrollController::class, 'count'])->middleware('permission:payroll.view');
    Route::get('/consultations/count', [ConsultationController::class, 'count'])->middleware('permission:consultation.view');

    // ------------------- Sesión / Perfil -------------------
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
});