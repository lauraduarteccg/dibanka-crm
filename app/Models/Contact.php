<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'campaign_id',
        'payroll_id',
        'name',
        'identification_type',
        'phone',
        'identification_number',
        'update_phone',
        'email',
        'is_active',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
    
    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id');
    }
}