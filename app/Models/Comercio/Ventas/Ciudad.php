<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ciudad extends Model
{
    use SoftDeletes;
    protected $table = 'ciudad';
    protected $primaryKey = 'idciudad';
    protected $fillable = [];
}
