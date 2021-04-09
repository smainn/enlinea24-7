<?php

namespace App\Models\Seguridad;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AsignacionPrivilegio extends Model
{
    use SoftDeletes;
    
    protected $table = 'asignacionprivilegio';
    protected $primaryKey = 'idasignacionprivilegio';
    protected $fillable = [
        'fkidgrupousuario',
        'fkidcomponente',
        'habilitado',
        'visible',
        'editable',
        'novisible',
    ];
}
