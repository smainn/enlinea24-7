<?php

namespace App\Models\Contable\Utils\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class LibroDiarioExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */
    
    public $reporte;
    public $criterios;

    public function __construct($reporte, $criterios)
    {
        $this->reporte = $reporte;
        $this->criterios = $criterios;
    }

    public function view(): View
    {
        return view('sistema.src.contable.reporte.excel.libro_diario', [
            'reporte' =>  $this->reporte,
            'criterios' =>  $this->criterios
        ]);
    }


}
