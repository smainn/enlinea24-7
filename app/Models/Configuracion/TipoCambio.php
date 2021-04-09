<?php

namespace App\Models\Configuracion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoCambio extends Model
{
    use SoftDeletes;

    protected $table = 'tipocambio';

    protected $primaryKey = 'idtipocambio';

    protected $fillable = [];
}
