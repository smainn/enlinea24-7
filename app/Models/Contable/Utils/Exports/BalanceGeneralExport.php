<?php

namespace App\Models\Contable\Utils\Exports;

use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Contracts\View\View;

class BalanceGeneralExport implements FromView
{
    //use Exportable;
    /**
    * @return \Illuminate\Support\Collection
    */

    public function __construct($balance, $subtitulo, $nivelmax, $showcod)
    {
        $this->balance = $balance;
        $this->subtitulo = $subtitulo;
        $this->nivelmax = $nivelmax;
        $this->showcod = $showcod;
    }

    public function view(): View
    {
        return view('sistema.src.contable.reporte.excel.balance_general', [
            'data' =>  $this->balance,
            'subtitulo'     => $this->subtitulo,
            'nivelmax' => $this->nivelmax,
            'showcod' => $this->showcod
        ]);
    }


}