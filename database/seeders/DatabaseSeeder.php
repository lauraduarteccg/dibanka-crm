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

        // Crear campañas (pagadurías)
        $campaigns = [
            [
                'name'       => 'Pagaduría Bogotá',
                'type'       => 'Marketing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'EDUCAME',
                'type'       => 'Medellín',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insertar campañas y obtener IDs
        $campaignIds = [];
        foreach ($campaigns as $campaign) {
            $existing = DB::table('campaigns')->where('name', $campaign['name'])->first();
            if ($existing) {
                $campaignIds[] = $existing->id;
            } else {
                $campaignIds[] = DB::table('campaigns')->insertGetId($campaign);
            }
        }

        // Crear o tomar consulta
        $consultationId = DB::table('consultations')->first()->id ?? DB::table('consultations')->insertGetId([
            'reason_consultation'   => 'Consulta de saldo',
            'specific_reason'       => 'Cuenta bancaria',
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);

        // Crear o tomar contacto
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

        // Insertar gestiones de ejemplo
        DB::table('management')->insert([
            [
                'usuario_id'        => 1,
                'campaign_id'       => $campaignIds[0],
                'consultation_id'   => $consultationId,
                'contact_id'        => $contactId,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'usuario_id'        => 2,
                'campaign_id'       => $campaignIds[1],
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

        // Asignar campañas al tipo de gestión
        $type->campaigns()->sync($campaignIds);
    }
}
