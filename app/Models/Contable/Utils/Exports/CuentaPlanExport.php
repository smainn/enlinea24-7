<?php

namespace App\Models\Contable\Utils\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class CuentaPlanExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($cuenta_plan)
    {
        $this->cuenta_plan = $cuenta_plan;
    }

    public function view(): View
    {
        return view('sistema.src.contable.reporte.excel.cuenta_plan', [
            'data' =>  $this->cuenta_plan,
        ]);
    }


}
