<?php

namespace App\Models\Comercio\Ventas;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanDePago extends Model
{
    use SoftDeletes;
    protected $table = 'ventaplandepago';
    protected $primaryKey = 'idventaplandepago';
    protected $fillable = [];
}
