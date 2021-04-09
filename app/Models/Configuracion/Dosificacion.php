<?php

namespace App\Models\Configuracion;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dosificacion extends Model
{
    use SoftDeletes;

    protected $table = 'facdosificacion';

    protected $primaryKey = 'idfacdosificacion';

    protected $fillable = [
        "titulo", "subtitulo", "descripcion", "nit", "numerotramite", "numerocorrelativo", "numeroautorizacion",
        "leyenda1piefactura", "leyenda2piefactura", "llave", "fechaactivacion", "fechalimiteemision", "nombresfcmarca",
        "plantillafacturaurl", "numfacturainicial", "numfacturasiguiente", "notas", "tipofactura", "estado",
        "fkidsucursal", "fkidfacactividadeconomica",
    ];
}
