<?php

namespace App\Models\Contable\Ajuste;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CtbTransacAutomaticas extends Model
{
    use SoftDeletes;

    protected $table = 'ctbtransacautomaticas';
    protected $primaryKey = 'idctbtransacautomaticas';
    protected $fillable = [
        'nombre', 'tipotransac', 'estado', 
    ];
}
