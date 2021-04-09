<?php

namespace App\Models\Comercio\Utils\Exports\Ventas;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class VentaPorCobrarExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($venta)
    {
        $this->venta = $venta;
    }

    public function view(): View
    {
        //return $this->vehiculo;
        //dd($this->venta);
        return view('sistema.src.comercio.reportes.excel.ventas.ventaporcobrar', [
            'venta' =>  $this->venta
        ]);
    }


}
