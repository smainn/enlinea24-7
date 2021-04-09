<?php

use Illuminate\Database\Seeder;
use App\Models\Contable\CuentaPlanTipo;

class CuentaPlanTipoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cuentaplantipos = $this->_cuentaplantipos();
        foreach ($cuentaplantipos as $tipo) {
            CuentaPlanTipo::create($tipo);
        }
    }
    
    private function _cuentaplantipos()
    {

        return [
            [
                'descripcion'    => 'Activo',
                'nombreinterno'  => 'Activo',
                'abreviacion'    => 'A'
            ],
            [
                'descripcion'    => 'Pasivo',
                'nombreinterno'  => 'Pasivo',
                'abreviacion'    => 'P'
            ],
            [
                'descripcion'    => 'Capital',
                'nombreinterno'  => 'Capital',
                'abreviacion'    => 'C'
            ],
            [
                'descripcion'    => 'Ingresos',
                'nombreinterno'  => 'Ingresos',
                'abreviacion'    => 'I'
            ],
            [
                'descripcion'    => 'Costos',
                'nombreinterno'  => 'Costos',
                'abreviacion'    => 'S'
            ],
            [
                'descripcion'    => 'Gastos',
                'nombreinterno'  => 'Gastos',
                'abreviacion'    => 'G'
            ],
        ];
    }
}
