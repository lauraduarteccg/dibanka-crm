<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeManagement extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_active']; 

    public function payrolls()
    {
        return $this->belongsToMany(Payroll::class, 'type_management_payroll')
                    ->withTimestamps();
    }

    // Extrae solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
