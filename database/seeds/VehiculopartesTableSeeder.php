<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Taller\VehiculoPartes;

class VehiculopartesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $vehiculopartes = $this->_vehiculopartes();
        foreach ($vehiculopartes as $vehiculoparte) {
            VehiculoPartes::create($vehiculoparte);
        }
    }

    private function _vehiculopartes()
    {
        return [
            [
                'nombre'           => 'Radio',
            ],
            [
                'nombre'           => 'Aire Acond',
            ],
            [
                'nombre'           => 'Antena',
            ],
            [
                'nombre'           => 'Llantas',
            ],
            [
                'nombre'           => 'Puertas',
            ],
            [
                'nombre'           => 'Asientos',
            ],
        ];
    }
}
