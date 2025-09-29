<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

    // Crear roles y obtener sus IDs
    $adminRole = Role::firstOrCreate(['name' => 'Administrador']);
    $liderRole = Role::firstOrCreate(['name' => 'Lider de Campaña']);
    $agenteRole = Role::firstOrCreate(['name' => 'Agente']);

    $users = [
        [
            'name' => 'Administrador',
            'email' => 'administrator@example.com',
            'password' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'name' => 'Lider de campaña',
            'email' => 'campaing_manager@example.com',
            'password' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'name' => 'Agente',
            'email' => 'agent@example.com',
            'password' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ];

    // Insertar usuarios
    $userIds = [];
    foreach ($users as $userData) {
        $user = User::create($userData);
        $userIds[] = $user->id;
    }

// Asignar roles usando syncRoles o assignRole
User::find($userIds[0])->syncRoles([$adminRole->id]);
User::find($userIds[1])->syncRoles([$liderRole->id]);
User::find($userIds[2])->syncRoles([$agenteRole->id]);

        // Crear pagadurías
        $payroll = [
            [
                'name'          => 'Casur',
                'description'   => 'Le recuerdo que puede encontrar nuestro botón de asesoría en la página web del portal DiBanka.
                
                Recuerde que habló con {{agente}}. Muchas gracias por comunicarse con nosotros.',
                'img_payroll' => "public/img/u19f0v08so2lsps9f8777",
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'name'       => 'Educame',
                'description'   => 'Le recuerdo que puede encontrar nuestro botón de asesoría en la página web del portal DiBanka.
                
                Recuerde que habló con {{agente}}. Muchas gracias por comunicarse con nosotros.',
                'img_payroll' => "public/img/u19f0v08so2lsps9f8777",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insertar campañas y obtener IDs
        $payrollIds = [];
        foreach ($payroll as $payroll) {
            $existing = DB::table('payrolls')->where('name', $payroll['name'])->first();
            if ($existing) {
                $payrollIds[] = $existing->id;
            } else {
                $payrollIds[] = DB::table('payrolls')->insertGetId($payroll);
            }
        }

        // Crear o tomar consulta
        $consultationId = DB::table('consultations')->first()->id ?? DB::table('consultations')->insertGetId([
            'payroll_id' => $payrollIds[1],
            'name'   => 'Consulta de saldo',
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);
        
        $specificId = DB::table('consultation_specifics')->insert([
            [
                'name' => 'Consulta bancaria',
                'consultation_id' => $consultationId,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]   
         ]);

        // Crear o tomar contacto
        $contactId = DB::table('contacts')->first()->id ?? DB::table('contacts')->insertGetId([
            'campaign'              => 'Aliados',
            'payroll_id'            => $payrollIds[1],
            'name'                  => 'Juan Pérez',
            'identification_type'   => 'Cédula',
            'phone'                 => '3123456789',
            'identification_number' => '12345678',
            'update_phone'          => '3123456789',
            'email'                 => 'juan@example.com',
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);

        DB::table('type_management')->insert([
            [
                'name' => 'LLAMADA ENTRANTE',
                'payroll_id' => $payrollIds[1],
                'is_active' => 1,
            ],
            [
                'name' => 'LLAMADA SALIENTE',
                'payroll_id' => $payrollIds[0],
                'is_active' => 1,
            ]
        ]);

        
        DB::table('special_cases')->insert([
            [
                'user_id'           => 1,
                'contact_id'        => $contactId,
                'management_messi'  => 'Nota Creada',
                'id_call'           => '68b871ae742f0866f0010a1d',
                'id_messi'          => 'CTR-881585',
                'created_at'        => now(),
                'updated_at'        => now()
            ]
            ]);

        DB::table('monitoring')->insert([
            'name'          => 'Solucion sin contacto',
            'created_at'    => now(),
            'updated_at'    => now()
        ]);

        // Insertar gestiones de ejemplo
        DB::table('management')->insert([
            [
                'user_id'           => 1,
                'wolkvox_id'        => '68d44d8b6f25ca6591073f43a33', 
                'payroll_id'        => $payrollIds[0],
                'contact_id'        => $contactId,
                'solution'          => 2,
                'consultation_id'   => $consultationId,
                'specific_id'       => $specificId,
                'type_management_id'=> 1,
                'comments'          => 'Afiliado se comunica para conocer por qué aún su crédito se encuentra en estado de en revisión, esperando una autorización de Dibanka, se validan datos y se informa que es la entidad Financiera ',
                'sms'               => 1,
                'wsp'               => 1,
                'solution_date' => '2025-09-23',
                'monitoring_id'     => 1,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'user_id'        => 2,
                'wolkvox_id'        => '68d44d8b6f25ca6591073f43as',
                'payroll_id'        => $payrollIds[1],
                'contact_id'        => $contactId,
                'solution'          => 1,
                'consultation_id'   => $consultationId,
                'specific_id'       => $specificId,
                'type_management_id'=> 1,
                'comments'          => 'Aliado se comunica informa que necesita firmar la libranza pero no le llega el codigo otp, se validan datos se le indica que no tiene numero actualizado pero que valide todas las bandejas de entrada confirma que no hay nada se le solicita esperar un lapso de tiempo por si es un error de conexión',
                'sms'               => 1,
                'wsp'               => 1,
                'solution_date' => '2026-09-23',
                'monitoring_id'     => 1,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);
    }
}
