<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\TypeManagement;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios
        $users = [];

        for ($i = 1; $i <= 10; $i++) {
            $users[] = [
                'name'          => 'User ' . $i,
                'email'         => 'user' . $i . '@example.com',
                'password'      => Hash::make('password'),
                'created_at'    => now(),
                'updated_at'    => now(),
            ];
        }

        DB::table('users')->insert($users);

        $usersIds = DB::table('users')->pluck('id')->toArray();

        // Crear pagadurías
        $payroll = [
            [
                'name'       => 'Casur',
                'type'       => 'Pagaduria',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Educame',
                'type'       => 'Medellín',
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

        // Insertar gestiones de ejemplo
        DB::table('management')->insert([
            [
                'user_id'        => 1,
                'payroll_id'       => $payrollIds[0],
                'contact_id'        => $contactId,
                'solution'          => 'Si',
                'consultation_id'   => $consultationId,
                'specific_id'       => $specificId,
                'comments'          => 'Afiliado se comunica para conocer por qué aún su crédito se encuentra en estado de en revisión, esperando una autorización de Dibanka, se validan datos y se informa que es la entidad Financiera ',
                'sms'               => 'Si',
                'wsp'               => 'No',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'user_id'        => 2,
                'payroll_id'       => $payrollIds[1],
                'contact_id'        => $contactId,
                'solution'          => 'Si',
                'consultation_id'   => $consultationId,
                'specific_id'       => $specificId,
                'comments'          => 'Aliado se comunica informa que necesita firmar la libranza pero no le llega el codigo otp, se validan datos se le indica que no tiene numero actualizado pero que valide todas las bandejas de entrada confirma que no hay nada se le solicita esperar un lapso de tiempo por si es un error de conexión',
                'sms'               => 'Si',
                'wsp'               => 'No',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
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
                'user_id'           => $usersIds[0],
                'contact_id'        => $contactId,
                'management_messi'  => 'Nota Creada',
                'id_call'           => '68b871ae742f0866f0010a1d',
                'id_messi'          => 'CTR-881585',
                'created_at'        => now(),
                'updated_at'        => now()
            ]
            ]);
    }
}
