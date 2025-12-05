<?php

namespace App\Models\Afiliados;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;

class Specific extends Model
{
    use HasFactory;

    protected $table = 'specifics_afiliados';
    protected $fillable = [
        'name',
        'consultation_id',
        'is_active',
    ];

    public function consultation()
    {
        return $this->belongsTo(\App\Models\Afiliados\Consultation::class, 'consultation_id');
    }


    public function payroll()
    {
        return $this->belongsToMany(Payroll::class, 'payroll_consultations_afiliados')
                    ->withTimestamps();
    }


    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
