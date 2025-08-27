<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeManagement extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_active']; 

    public function payroll()
    {
        return $this->belongsToMany(
            Payroll::class,
            'payrolls_type_management',
            'type_management_id',
            'payroll_id'
        )->withTimestamps()->withPivot('is_active');
    }
}
