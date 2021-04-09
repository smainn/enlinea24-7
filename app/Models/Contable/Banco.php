<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banco extends Model
{
    use SoftDeletes;

    protected $table = 'banco';
    protected $primaryKey = 'idbanco';
    protected $fillable = [
        'nombre', 'cuenta', 'estado', 'fkidbancopadre',
    ];

}
