<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\ConsultationSpecificController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TypeManagementController;
use App\Http\Controllers\SpecialCasesController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\RolePermissionController;

// 🔹 Ruta de autenticación
Route::post('/login', [AuthController::class, 'login']);

// 🔹 Gesiton de roles
Route::get('/roles', [RolesController::class, 'index']);

// Rutas protegidas con autenticación
Route::middleware('auth:sanctum')->group(function () {

    // 🔹 Obtener la lista de permisos
    Route::get('/permissions', [RolePermissionController::class, 'index']);

    // 🔹 Obtener todos los roles con sus permisos
    Route::get('/roles-permissions', [RolePermissionController::class, 'roles']);

    // 🔹 Asignar o quitar un permiso a un rol
    Route::put('/roles-permissions/toggle', [RolePermissionController::class, 'togglePermission']);

    // 🔹 Rutas de conteo de registros
    Route::get('/management/count', [ManagementController::class, 'count']);
    Route::get('/payrolls/count', [PayrollController::class, 'count']);
    Route::get('/consultations/count', [ConsultationController::class, 'count']);
    Route::get('/contacts/count', [ContactController::class, 'count']);

    // 🔹 Rutas de usuarios
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // 🔹 CRUD para Pagadurías
    Route::get('/payrolls', [PayrollController::class, 'index']);      // Listar pagadurías
    Route::get('/payrolls/active', [PayrollController::class, 'active']); // Listar unicamente pagadurias activas
    Route::post('/payrolls', [PayrollController::class, 'store']);     // Crear pagaduría
    Route::get('/payrolls/{payroll}', [PayrollController::class, 'show']);   // Mostrar una pagaduría específica
    Route::put('/payrolls/{payroll}', [PayrollController::class, 'update']); // Actualizar pagaduría
    Route::delete('/payrolls/{payroll}', [PayrollController::class, 'destroy']); // Activar/Desactivar pagaduría

    // 🔹 CRUD para Gestiones
    Route::get('/management', [ManagementController::class, 'index']); // Listar gestiones
    Route::post('/management', [ManagementController::class, 'store']); // Crear gestion
    Route::get('/management/{id}', [ManagementController::class, 'show']); // Mostrar una gestion específica
    Route::put('/management/{id}', [ManagementController::class, 'update']); // Actualizar gestion
    Route::put('/managementmonitoring/{id}', [ManagementController::class, 'updateMonitoring']); // Actualizar gestion
    Route::delete('/management/{id}', [ManagementController::class, 'destroy']); // Eliminar gestion
 
    // 🔹 CRUD para Consultas
    Route::get('/consultations', [ConsultationController::class, 'index']); // Listar consultas
    Route::get('/consultations/active', [ConsultationController::class, 'active']); // Listar unicamente consultas activas
    Route::post('/consultations', [ConsultationController::class, 'store']); // Crear consulta
    Route::get('/consultations/{consultation}', [ConsultationController::class, 'show']); // Mostrar una consulta específica
    Route::put('/consultations/{consultation}', [ConsultationController::class, 'update']); // Actualizar consulta
    Route::delete('/consultations/{consultation}', [ConsultationController::class, 'destroy']); // Eliminar consulta
    
    // 🔹 CRUD para Consultas Especificas
    Route::get('/consultationspecifics', [ConsultationSpecificController::class, 'index']); // Listar consultas especificas
    Route::get('/consultationspecifics/active', [ConsultationSpecificController::class, 'active']); // Listar unicamente consultas especificas activas
    Route::post('/consultationspecifics', [ConsultationSpecificController::class, 'store']); // Crear consulta especifica
    Route::get('/consultationspecifics/{consultationspecific}', [ConsultationSpecificController::class, 'show']); // Mostrar una consulta específica especifica
    Route::put('/consultationspecifics/{consultationspecific}', [ConsultationSpecificController::class, 'update']); // Actualizar consulta especifica
    Route::delete('/consultationspecifics/{consultationspecific}', [ConsultationSpecificController::class, 'destroy']); // Eliminar consulta especifica
    
    // 🔹 CRUD para Seguimientos
    Route::get('/monitorings', [MonitoringController::class, 'index']); // Listar seguimiento
    Route::get('/monitorings/active', [MonitoringController::class, 'active']); // Listar unicamente seguimiento activas
    Route::post('/monitorings', [MonitoringController::class, 'store']); // Crear seguimiento
    Route::get('/monitorings/{id}', [MonitoringController::class, 'show']); // Mostrar una seguimiento especifica
    Route::put('/monitorings/{id}', [MonitoringController::class, 'update']); // Actualizar seguimiento
    Route::delete('/monitorings/{id}', [MonitoringController::class, 'destroy']); // Eliminar seguimiento

    // 🔹 CRUD para Contactos
    Route::get('/contacts', [ContactController::class, 'index']); // Listar contacto
    Route::post('/contacts', [ContactController::class, 'store']); // Crear contacto
    Route::get('/contacts/{contact}', [ContactController::class, 'show']); // Mostrar un contacto específica
    Route::put('/contacts/{contact}', [ContactController::class, 'update']); // Actualizar contacto
    Route::delete('/contacts/{contacts}', [ContactController::class, 'destroy']); // Eliminar contacto

    // 🔹 CRUD para Tipo de Gestiones
    Route::get('/typemanagements', [TypeManagementController::class, 'index']); // Listar tipo de gestiones
    Route::post('/typemanagements', [TypeManagementController::class, 'store']); // Crear tipo de gestion
    Route::get('/typemanagements/active', [TypeManagementController::class, 'active']); // Listar gestiones
    Route::get('/typemanagements/{typemanagement}', [TypeManagementController::class, 'show']); // Mostrar un tipo de gestion específica
    Route::put('/typemanagements/{typemanagement}', [TypeManagementController::class, 'update']); // Actualizar tipo de gestion
    Route::delete('/typemanagements/{typemanagement}', [TypeManagementController::class, 'destroy']); // Eliminar tipo de gestion

    
    // 🔹 CRUD para los casos especiales
    Route::get('/specialcases', [SpecialCasesController::class, 'index']); // Listar casos especiales
    Route::post('/specialcases', [SpecialCasesController::class, 'store']); // Crear caso especial
    Route::get('/specialcases/{id}', [SpecialCasesController::class, 'show']); // Mostrar una caso especial
    Route::put('/specialcases/{id}', [SpecialCasesController::class, 'update']); // Actualizar caso especial
    Route::delete('/specialcases/{id}', [SpecialCasesController::class, 'destroy']); // Eliminar caso especial    
    
    // Rutas de autenticación protegidas
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
