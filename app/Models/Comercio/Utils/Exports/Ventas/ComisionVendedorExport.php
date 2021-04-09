<?php

namespace App\Models\Comercio\Utils\Exports\Ventas;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class ComisionVendedorExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($comision)
    {
        $this->comision = $comision;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.ventas.comisionvendedor', [
            'comision' =>  $this->comision
        ]);
    }


}
