<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\Producto\ProductoCaracteristica;

class ProduccaracteristicaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pcaracteristicas = $this->_pcaracteristicas();
        foreach ($pcaracteristicas as $pcaracteristica) {
           ProductoCaracteristica::create($pcaracteristica);
        }
    }

    private function _pcaracteristicas()
    {
        return [
            [
                'caracteristica'           => 'Marca',
            ],
            [
                'caracteristica'           => 'Año',
            ],
            [
                'caracteristica'           => 'Color',
            ],
            [
                'caracteristica'           => 'Medida',
            ],
        ];
    }
}
