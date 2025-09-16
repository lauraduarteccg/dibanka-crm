<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeManagement extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_active', 'payroll_id']; 

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id');
    }

    // Extrae solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
