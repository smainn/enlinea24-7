<?php

namespace App\Models\Comercio\Utils\Exports\Almacen;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class ProductoExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($producto, $esabogado)
    {
        $this->producto = $producto;
        $this->esabogado = $esabogado;
    }

    public function view(): View
    {
        //return view('commerce::admin.Reporte.Excel.GestionarAlmacen.producto', [
        return view('sistema.src.comercio.reportes.excel.almacen.producto', [
            'producto' =>  $this->producto,
            'esabogado' =>  $this->esabogado,
        ]);
    }


}
