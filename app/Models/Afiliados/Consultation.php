<?php

namespace App\Models\Afiliados;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;

class Consultation extends Model
{
    use HasFactory;

    protected $table = 'consultations_afiliados';
    protected $fillable = [
        'name',
        'is_active',
    ];
    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    public function payrolls()
    {
        return $this->belongsToMany(Payroll::class, 'payroll_consultations_afiliados')
                    ->withTimestamps();
    }

}
