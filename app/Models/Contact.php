<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'campaign',
        'payroll_id',
        'name',
        'identification_type',
        'phone',
        'identification_number',
        'update_phone',
        'email',
        'is_active',
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
    
    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id');
    }
}