<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the role and permission seeder.
     */
    public function run(): void
    {
        DB::transaction(function () {

            $permissions = [
                //  Gestión de usuarios
                'config.user.view',
                'config.user.create',
                'config.user.edit',
                'config.user.delete',

                //  Gestión de contactos
                'contact.view',
                'contact.create',
                'contact.edit',
                'contact.delete',

                //  Pagadurías (view sin config)
                'payroll.view',
                'config.payroll.create',
                'config.payroll.edit',
                'config.payroll.delete',

                //  Consultas (view sin config)
                'consultation.view',
                'config.consultation.create',
                'config.consultation.edit',
                'config.consultation.delete',

                //  Consultas específicas (view sin config)
                'specific.view',
                'config.specific.create',
                'config.specific.edit',
                'config.specific.delete',

                //  Gestiones
                'management.viewFiltred',
                'management.view',
                'management.create',
                'management.edit',
                'management.delete',

                //  Tipos de gestiones (view sin config)
                'typeManagement.view',
                'config.typeManagement.create',
                'config.typeManagement.edit',
                'config.typeManagement.delete',

                //  Casos especiales
                'special_cases.view',
                'special_cases.create',
                'special_cases.edit',
                'special_cases.delete',

                //  Seguimientos (view sin config)
                'monitoring.view',
                'config.monitoring.create',
                'config.monitoring.edit',
                'config.monitoring.delete',

                //  Roles y permisos (siempre en config)
                'config.role.view',
                'config.role.create',
                'config.role.edit',
                'config.role.delete',
            ];

            //  Crear permisos si no existen
            foreach ($permissions as $perm) {
                Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
            }

          
            // Asignación de permisos a roles
            // ==========================================================
            $rolesWithPermissions = [
                //  Administrador — todos los permisos
                'Administrador' => Permission::pluck('name')->toArray(),

                //  Líder de campaña — sin permisos de eliminación
                'Lider de campaña' => Permission::whereNotIn('name', [
                    'contact.delete',
                    'management.delete',
                    'special_cases.delete',
                    'config.user.delete',
                    'config.role.delete',
                    'config.payroll.delete',
                    'config.consultation.delete',
                    'config.specific.delete',
                    'config.typeManagement.delete',
                    'config.monitoring.delete',
                ])->pluck('name')->toArray(),

                //  Agente — permisos operativos básicos
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

            //  Crear roles y asignar permisos
            foreach ($rolesWithPermissions as $role => $perms) {
                $roleInstance = Role::firstOrCreate(['name' => $role]);
                $roleInstance->syncPermissions($perms);
            }
        });

        $this->command->info('✅ Roles y permisos creados correctamente con la nueva estructura.');
    }
}
