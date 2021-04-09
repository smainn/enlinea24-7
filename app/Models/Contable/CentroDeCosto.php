<?php

namespace App\Models\Contable;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CentroDeCosto extends Model
{
    use SoftDeletes;

    protected $table = 'centrodecosto';
    protected $primaryKey = 'idcentrodecosto';
    
}
