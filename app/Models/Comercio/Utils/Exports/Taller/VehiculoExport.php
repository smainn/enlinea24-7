<?php

namespace App\Models\Comercio\Utils\Exports\Taller;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class VehiculoExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($vehiculo)
    {
        $this->vehiculo = $vehiculo;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.taller.vehiculo', [
            'vehiculo' =>  $this->vehiculo
        ]);
    }

}
