<?php

namespace App\Models\Seguridad;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Componente extends Model
{
    use SoftDeletes;
    protected $table = 'componente';
    protected $primaryKey = 'idcomponente';
    protected $fillable = [
        'descripcion',
        'tipo',
        'estado',
        'idcomponentepadre',
        'activo',
    ];
}
