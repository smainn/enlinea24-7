<?php

namespace App\Models\Comercio\Utils\Exports\Ventas;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class VentaHistoricoVehiculoExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($data, $placa, $cliente)
    {
        $this->data = $data;
        $this->placa = $placa;
        $this->cliente = $cliente;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.ventas.ventahistoricovehiculo', [
            'data' =>  $this->data,
            'placa' => $this->placa,
            'cliente' => $this->cliente,
        ]);
    }


}
