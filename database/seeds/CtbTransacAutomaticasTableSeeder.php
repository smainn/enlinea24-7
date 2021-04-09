<?php

use App\Models\Contable\Ajuste\CtbTransacAutomaticas;
use Illuminate\Database\Seeder;

class CtbTransacAutomaticasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = $this->_getdata();
        foreach ($data as $value) {
            CtbTransacAutomaticas::create($value);
        }
    }
    public function _getdata() {
        return [
            [
                'nombre'       => 'Venta al contado',
                'tipotransac'  => 'VC',
            ],
            [
                'nombre'       => 'Venta al crédito',
                'tipotransac'  => 'VCR',
            ],
            [
                'nombre'       => 'Cobro cuota por venta al crédito',
                'tipotransac'  => 'CV',
            ],
            [
                'nombre'       => 'Compra al contado',
                'tipotransac'  => 'CC',
            ],
            [
                'nombre'       => 'Compra al crédito',
                'tipotransac'  => 'CCR',
            ],
            [
                'nombre'       => 'Pago cuota por compra al crédito',
                'tipotransac'  => 'PC',
            ],
        ];
    }
}
