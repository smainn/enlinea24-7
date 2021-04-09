<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Taller\VehiculoCaracteristica;

class VehiculocaracteristicaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $caracteristicas = $this->_caracteristicas();
        foreach ($caracteristicas as $caracteristica) {
            VehiculoCaracteristica::create($caracteristica);
        }
    }

    private function _caracteristicas()
    {
        return [
            [
                'caracteristica'           => 'Marca',
            ],
            [
                'caracteristica'           => 'Modelo',
            ],
            [
                'caracteristica'           => 'Año',
            ],
            [
                'caracteristica'           => 'Color',
            ],
        ];
    }
}
