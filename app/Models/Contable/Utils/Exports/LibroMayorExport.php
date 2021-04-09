<?php

namespace App\Models\Contable\Utils\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class LibroMayorExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($libro_mayor)
    {
        $this->libro_mayor = $libro_mayor;
    }

    public function view(): View
    {
        return view('sistema.src.contable.reporte.excel.libro_mayor', [
            'libro_mayor' =>  $this->libro_mayor,
        ]);
    }


}
