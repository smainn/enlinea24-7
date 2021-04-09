<?php

namespace App\Models\Comercio\Utils\Exports\Ventas;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class ClienteExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($cliente, $contactos)
    {
        $this->cliente = $cliente;
        $this->contactos = $contactos;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.ventas.cliente', [
            'cliente' =>  $this->cliente,
            'contactos' => $this->contactos,
        ]);
    }


}
