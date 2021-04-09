<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\ComisionVenta;

class ComisionventaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $comisions = $this->_comisions();
        foreach ($comisions as $comision) {
            ComisionVenta::create($comision);
        }
    }

    private function _comisions()
    {
        return [

            [
                'descripcion'           => 'Venta',
                'valor'           => '5',
                'tipo'           => 'V',
            ],
            [
                'descripcion'           => 'Ganancia',
                'valor'           => '10',
                'tipo'           => 'V',
            ],
            [
                'descripcion'           => 'Fijo',
                'valor'           => '10',
                'tipo'           => 'V',
            ],
            [
                'descripcion'           => 'Otro',
                'valor'           => '10',
                'tipo'           => 'V',
            ],
        ];
    }
}
