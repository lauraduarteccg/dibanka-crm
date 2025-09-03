<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollsConsultationSpecific extends Model
{
    protected $table = 'payrolls_consultation_specific';

    protected $fillable = [
        'consultation_specific_id',
        'payroll_id',
        'is_active'
    ];
    
    protected $attributes = [
        'is_active' => 1, // valor por defecto
    ];

    // Relación con Pagaduria
    public function payroll()
    {
        return $this->belongsTo(Payroll::class);
    
    }

    // Relacion con Consulta
    public function consultation_specific()
    {
        return $this->belongsTo(ConsultationSpecific::class); 
    }
}
