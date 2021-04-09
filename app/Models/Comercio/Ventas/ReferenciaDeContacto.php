<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReferenciaDeContacto extends Model
{
    use SoftDeletes;
    protected $table = 'referenciadecontacto';
    protected $primaryKey = 'idreferenciadecontacto';
    protected $fillable = [];
}
