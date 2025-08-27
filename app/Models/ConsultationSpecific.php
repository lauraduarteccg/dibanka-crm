<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationSpecific extends Model
{
    use HasFactory;

    protected $fillable = [
        'specific_reason',
        'is_active'
    ];
}