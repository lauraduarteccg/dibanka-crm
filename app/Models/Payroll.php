<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Payroll extends Model
{
    use HasFactory;

    protected $table = 'payrolls';
    protected $fillable = [
        'name',
        'description',
        'img_payroll',
        'i_title',
        'i_description',
        'i_email',
        'i_phone',
        'is_active'
    ];

    public function typemanagement()
    {
        return $this->hasMany(TypeManagement::class, 'payroll_id');
    }

    // Extrae solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

}
