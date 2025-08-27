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
                'contacts.view',
                'contacts.edit',
                'contacts.delete',
                'contacts.create',

                // Gestion de pagadurias
                'payrolls.view',
                'payrolls.edit',
                'payrolls.delete',
                'payrolls.create',

                // Gestion de consultas
                'consults.view',
                'consults.edit',
                'consults.delete', 
                'consults.create',

                // Gestion de consultas especificas
                'consultSpecifics.view',
                'consultSpecifics.edit',
                'consultSpecifics.delete',
                'consultSpecifics.create',

                //Gestion de gestiones
                'managements.view',
                'managements.edit',
                'managements.delete',  
                'managements.create',

                //Gestion de tipos de gestiones
                'typeManagements.view',
                'typeManagements.edit',
                'typeManagements.delete',  
                'typeManagements.create',
            ];

            // ✅ Crear permisos si no existen
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission]);
            }

            // ✅ Asignación de permisos a roles
            $rolesWithPermissions = [
                'Administrator' => Permission::pluck('name')->toArray(),

                'Viewer' => [
                    'employees.view',
                    'history.view',
                ],

                'User Manager' => [
                    'user.view',
                    'user.edit',
                    'user.delete',
                    'user.create',
                ],

            ];

            // ✅ Asignación de roles y permisos
            foreach ($rolesWithPermissions as $role => $permissions) {
                $roleInstance = Role::firstOrCreate(['name' => $role]);
                $roleInstance->syncPermissions($permissions);
            }

            // ✅ Creación de usuario de prueba con rol de Administrador
            $user = User::firstOrCreate(
                ['email' => 'test@example.com'],
                ['name' => 'Test User', 'password' => bcrypt('password')]
            );
            $user->assignRole('Administrator');
        });

        $this->command->info('✅ Roles, permisos y usuario de prueba creados correctamente.');
    }
}
