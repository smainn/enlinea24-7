<?php

namespace App\Models\Comercio\Utils\Exports\Ventas;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class VentaExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($venta, $comventasventaalcredito)
    {
        $this->venta = $venta;
        $this->comventasventaalcredito = $comventasventaalcredito;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.ventas.venta', [
            'venta' =>  $this->venta,
            'comventasventaalcredito' =>  $this->comventasventaalcredito,
        ]);
    }


}
