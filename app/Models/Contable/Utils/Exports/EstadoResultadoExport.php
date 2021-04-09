<?php

namespace App\Models\Contable\Utils\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class EstadoResultadoExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($estado_resultado, $show_codigo)
    {
        $this->estado_resultado = $estado_resultado;
        $this->show_codigo = $show_codigo;
    }

    public function view(): View
    {
        return view('sistema.src.contable.reporte.excel.estado_resultado', [
            'data' =>  $this->estado_resultado,
            'show_codigo' =>  $this->show_codigo,
        ]);
    }


}
