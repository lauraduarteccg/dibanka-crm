<?php

namespace App\Models\Afiliados;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use App\Models\Payroll;
use App\Models\Afiliados\Consultation;

class PayrollConsultation extends Model
{
    protected $table = 'payroll_consultation_afiliados';

    protected $fillable = [
        'id',
        'consultation_id',
        'payroll_id',
        'is_active',
    ];

    public function consultation()
    {
        return $this->belongsTo(onsultation::class, 'consultation_id');
    }

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id');
    }
}
