<?php

namespace App\Models\Comercio\Utils\Exports\Ventas;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class FacturaExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($factura)
    {
        $this->factura = $factura;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.ventas.facturaventa', [
            'factura' =>  $this->factura,
        ]);
    }


}
