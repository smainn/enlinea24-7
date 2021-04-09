<?php

use App\Models\Contable\TipoPago;
use Illuminate\Database\Seeder;

class TipoPagoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tipopagos = $this->_tipopagos();
        foreach ($tipopagos as $tipopago) {
            TipoPago::create($tipopago);
        }
    }
    private function _tipopagos()
    {
        return [
            [
                'descripcion' => 'En Efectivo',
            ],
            [
                'descripcion' => 'Cheque',
            ],
            [
                'descripcion' => 'Tarjeta de Credito',
            ],
        ];
    }
}
