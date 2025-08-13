<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DataBaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

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
        
        $campaignId = DB::table('campaigns')->first()->id ?? DB::table('campaigns')->insertGetId([
            'name'          => 'Pagaduría Bogotá',
            'type'          => 'Marketing',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        // Obtener una consulta existente o crear una nueva
        $consultationId = DB::table('consultations')->first()->id ?? DB::table('consultations')->insertGetId([
            'reason_consultation'   => 'Consulta de saldo',
            'specific_reason'       => 'Cuenta bancaria',
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);

        // Obtener un contacto existente o crear uno nuevo
        $contactId = DB::table('contacts')->first()->id ?? DB::table('contacts')->insertGetId([
            'name'                  => 'Juan Pérez',
            'identification_type'   => 'Cédula',
            'phone'                 => '3123456789',
            'identification_number' => '12345678',
            'update_phone'          => '3123456789',
            'email'                 => 'juan@example.com',
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);

        // Insertar registros en la tabla gestions
        DB::table('management')->insert([
            [
                'usuario_id'        => 1,
                'campaign_id'       => $campaignId,
                'consultation_id'   => $consultationId,
                'contact_id'        => $contactId,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'usuario_id'        => 2,
                'campaign_id'       => $campaignId,
                'consultation_id'   => $consultationId,
                'contact_id'        => $contactId,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);        
    }
}
