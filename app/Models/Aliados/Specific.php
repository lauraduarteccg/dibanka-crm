<?php

namespace App\Models\Aliados;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;

class Specific extends Model
{
    use HasFactory;

    protected $table = 'specifics_aliados';
    protected $fillable = [
        'name',
        'consultation_id',
        'is_active',
    ];

    public function consultation()
    {
        return $this->belongsTo(\App\Models\Aliados\Consultation::class, 'consultation_id');
    }


    public function payrolls()
    {
        return $this->belongsToMany(Payroll::class, 'payroll_consultations_aliados')
                    ->withTimestamps();
    }


    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
