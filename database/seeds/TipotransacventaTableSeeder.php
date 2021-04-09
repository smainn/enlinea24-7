<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Ventas\TipoTransacVenta;

class TipotransacventaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $transaventas = $this->_transaventas();
        foreach ($transaventas as $transaventa) {
            TipoTransacVenta::create($transaventa);
        }
    }

    private function _transaventas()
    {
        return [
            [
                'nombre'           => 'Venta'
            ],
            [
                'nombre'           => 'Proforma'
            ],
            [
                'nombre'           => 'Orden de trabajo'
            ]
        ];
    }
}
