<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\Moneda;

class MonedaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $monedas = $this->_monedas();
        foreach ($monedas as $moneda) {
            Moneda::create($moneda);
        }
    }

    private function _monedas()
    {
        return [

            [
                'descripcion'        => 'Bolivianos',
                'predeterminada'     => 'V',
                'tipocambio'         => '1',
                'simbolo'            => 'Bs',
            ],
            [
                'descripcion'        => 'Dolares',
                'predeterminada'     => 'F',
                'tipocambio'         => '6.96',
                'simbolo'            => '$',
            ],
        ];
    }
}
