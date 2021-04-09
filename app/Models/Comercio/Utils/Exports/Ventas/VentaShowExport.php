<?php

namespace App\Models\Comercio\Utils\Exports\Ventas;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class VentaShowExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($venta, $esabogado)
    {
        $this->venta = $venta;
        $this->esabogado = $esabogado;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.ventas.ventashow', [
            'venta' =>  $this->venta,
            'esabogado' =>  $this->esabogado,
        ]);
    }


}
