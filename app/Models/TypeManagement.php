<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeManagement extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_active']; // quitar campaign_id

    // relación many-to-many con Campaign
    public function campaigns()
    {
        return $this->belongsToMany(
            Campaign::class,
            'campaign_type_management',
            'type_management_id',
            'campaign_id'
        )->withTimestamps()->withPivot('is_active');
    }
}
