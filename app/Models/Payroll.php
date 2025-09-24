<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'img_payroll',
        'is_active'
    ];

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'payroll_id');
    }

    public function typemanagement()
    {
        return $this->hasMany(TypeManagement::class, 'payroll_id');
    }

    // Cuando una pagaduria se desactiva esta funcion desactiva la consulta relacionada a esta pagaduria
    protected static function booted()
    {
        static::updated(function ($payroll) {
            if ($payroll->isDirty('is_active')) {
                DB::transaction(function () use ($payroll) {
                    // Actualizar consultas en bloque (rápido)
                    $payroll->consultations()->update([
                        'is_active' => $payroll->is_active
                    ]);

                    // Actualizar los specifics directamente en bloque
                    $consultationIds = $payroll->consultations()->pluck('id')->toArray();
                    if (!empty($consultationIds)) {
                        ConsultationSpecific::whereIn('consultation_id', $consultationIds)
                            ->update(['is_active' => $payroll->is_active]);
                    }

                    // Tipos de gestión
                    $payroll->typemanagement()->update([
                        'is_active' => $payroll->is_active
                    ]);
                });
            }
        });
    }

    // Extrae solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

}
