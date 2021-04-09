<?php

namespace App\Models\Contable\Ajuste;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CtbDetalleComprobAutomat extends Model
{

    use SoftDeletes;

    protected $table = 'ctbdetallecomprobautomat';
    protected $primaryKey = 'idctbdetallecomprobautomat';
    protected $fillable = [
        'glosamenor', 'debe', 'haber', 'fkidctbcomprobautomat', 
        'fkidctbdefictasasientautom', 'fkidcuentaplan', 'fkidcentrodecosto', 
    ];

}
