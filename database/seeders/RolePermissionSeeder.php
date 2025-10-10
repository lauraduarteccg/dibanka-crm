<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the role and permission seeder.
     */
    public function run(): void
    {
        DB::transaction(function () {

            $permissions = [
                // Gestión de usuarios
                'user.view',
                'user.edit',
                'user.delete',
                'user.create',

                // Gestion de contactos
                'contact.view',
                'contact.edit',
                'contact.delete',
                'contact.create',

                // Gestion de pagadurias
                'payroll.view',
                'payroll.edit',
                'payroll.delete',
                'payroll.create',

                // Gestion de consultas
                'consultation.view',
                'consultation.edit',
                'consultation.delete',
                'consultation.create',

                // Gestion de consultas especificas
                'specific.view',
                'specific.edit',
                'specific.delete',
                'specific.create',

                //Gestion de gestiones
                'management.view',
                'management.edit',
                'management.delete',
                'management.create',

                //Gestion de tipos de gestiones
                'typeManagement.view',
                'typeManagement.edit',
                'typeManagement.delete',
                'typeManagement.create',

                // Casos especiales
                'special_cases.view',
                'special_cases.edit',
                'special_cases.delete',
                'special_cases.create',

                // Seguimientos
                'monitoring.view',
                'monitoring.edit',
                'monitoring.delete',
                'monitoring.create',
                //configuracion 
                // Permisos de configuración
                'config.user.view',
                'config.user.create',
                'config.user.edit',
                'config.user.delete',
                'config.payroll.view',
                'config.payroll.create',
                'config.payroll.edit',
                'config.payroll.delete',
                'config.consultation.view',
                'config.consultation.create',
                'config.consultation.edit',
                'config.consultation.delete',
                'config.typeManagement.view',
                'config.typeManagement.create',
                'config.typeManagement.edit',
                'config.typeManagement.delete',
                'config.monitoring.view',
                'config.monitoring.create',
                'config.monitoring.edit',
                'config.monitoring.delete',
                'config.role.view',
                'config.role.create',
                'config.role.edit',
                'config.role.delete',

            ];

            // ✅ Crear permisos si no existen
            foreach ($permissions as $perm) {
                Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
            }

            // ✅ Asignación de permisos a roles
            $rolesWithPermissions = [
                'Administrador' => Permission::pluck('name')->toArray(),

                'Lider de campaña' => Permission::whereNotIn('name', [
                    'user.delete',
                    'contact.delete',
                    'payroll.delete',
                    'consultation.delete',
                    'specific.delete',
                    'monitoring.delete',
                ])->pluck('name')->toArray(),

                'Agente' => [
                    'contact.view',
                    'contact.edit',
                    'management.view',
                    'management.edit',
                    'management.create',
                    'special_cases.view',
                    'special_cases.edit',
                    'special_cases.create',
                ],

            ];

            // ✅ Asignación de roles y permisos
            foreach ($rolesWithPermissions as $role => $permissions) {
                $roleInstance = Role::firstOrCreate(['name' => $role]);
                $roleInstance->syncPermissions($permissions);
            }
        });

        $this->command->info('✅ Roles, permisos y usuario de prueba creados correctamente.');
    }
}
