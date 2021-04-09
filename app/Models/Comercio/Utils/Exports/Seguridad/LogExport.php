<?php

namespace App\Models\Comercio\Utils\Exports\Seguridad;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class LogExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($log)
    {
        $this->log = $log;
    }

    public function view(): View
    {
        return view('sistema.src.comercio.reportes.excel.seguridad.log', [
            'log' =>  $this->log
        ]);
    }

}
