<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'nombre',
        'tipo_identificacion',
        'telefono',
        'numero_identificacion',
        'celular_actualizado',
        'correo'
    ];

    public function gestions()
    {
        return $this->hasMany(Gestion::class);
    }
    
}
