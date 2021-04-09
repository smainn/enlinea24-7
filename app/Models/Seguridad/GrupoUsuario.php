<?php

namespace App\Models\Seguridad;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrupoUsuario extends Model
{
    use SoftDeletes;
    
    protected $table = 'grupousuario';
    protected $primaryKey = 'idgrupousuario';
    protected $fillable = [
        'nombre',
        'notas',
        'estado',
        'fecha',
        'hora',
    ];
}
