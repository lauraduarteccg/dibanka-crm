<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollsConsultations extends Model
{
    protected $fillable = [
        'consultation_id',
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
    public function consultation()
    {
        return $this->belongsTo(Consultation::class); 
    }
}
