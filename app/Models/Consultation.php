<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'payroll_id',
        'is_active',
    ];
    
    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id');
    }
    
    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
