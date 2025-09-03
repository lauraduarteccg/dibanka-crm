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
            'reason_consultation'   => 'Consulta de saldo',
            'created_at'            => now(),
            'updated_at'            => now(),
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
                'usuario_id'        => 1,
                'payroll_id'       => $payrollIds[0],
                'consultation_id'   => $consultationId,
                'contact_id'        => $contactId,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'usuario_id'        => 2,
                'payroll_id'       => $payrollIds[1],
                'consultation_id'   => $consultationId,
                'contact_id'        => $contactId,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);

        // Crear un tipo de gestión
        $type = TypeManagement::create([
            'name' => 'LLAMADA ENTRANTE',
            'is_active' => 1,
        ]);

        // Asignar pagadurias al tipo de gestión
        $type->payroll()->sync($payrollIds);

        $specificId = DB::table('consultation_specifics')->insert([
            [
                'specific_reason' => 'Consulta bancaria',
                'consultation_id' => $consultationId,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]   
         ]);

         DB::table('payrolls_consultation_specific')->insert([
            [
                'payroll_id' => $payrollIds[0],
                'consultation_specific_id' => $specificId,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'payroll_id' => $payrollIds[1],
                'consultation_specific_id' => $specificId,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
         ]);

        DB::table('payrolls_consultations')->insert([
            [
                'payroll_id' => $payrollIds[0],
                'consultation_id' => $consultationId,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'payroll_id' => $payrollIds[1],
                'consultation_id' => $consultationId,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
         ]);
    }
}
