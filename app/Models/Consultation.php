<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reason_consultation',
        'is_active',
    ];

    // Relación many-to-many con ConsultationSpecific
    public function specifics()
    {
        return $this->belongsToMany(
            ConsultationSpecific::class,
            'consultations_and_specific',      // nombre tabla pivote
            'consultation_id',                 // FK de este modelo en pivote
            'consultation_specific_id'         // FK del otro modelo en pivote
        )->withTimestamps();
    }
}
