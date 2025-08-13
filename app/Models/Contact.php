<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'identification_type',
        'phone',
        'identification_number',
        'update_phone',
        'email',
        'is_active',
    ];

    public function gestions()
    {
        return $this->hasMany(Gestion::class);
    }
    
}