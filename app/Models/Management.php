<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Management extends Model
{
    use HasFactory;
    
    protected $table = 'management';

    protected $fillable = [
        'user_id', 'payroll_id', 'contact_id', 'solution', 'consultation_id', 'specific_id', 'comments',
        'solution_date', 'monitoring_id', 'sms', 'wsp', 'type_management_id', 'wolkvox_id'
    ];

    public function monitoring()
    {
        return $this->belongsTo(Monitoring::class, 'monitoring_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id');
    }

    public function consultation()
    {
        return $this->belongsTo(Consultation::class, 'consultation_id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function specific()
    {
        return $this->belongsTo(ConsultationSpecific::class, 'specific_id');
    }

    public function type_management()
    {
        return $this->belongsTo(TypeManagement::class, 'type_management_id');
    }
}
