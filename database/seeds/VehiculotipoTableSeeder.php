<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Taller\VehiculoTipo;

class VehiculotipoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $vehiculos = $this->_getVehiculos();
        foreach ($vehiculos as $vehiculo) {
            VehiculoTipo::create($vehiculo);
        }
    }

    private function _getVehiculos()
    {
        return [
            [
                'descripcion'           => 'Ninguno',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Vehiculos',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Auto',
                'idpadrevehiculo'=>2,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Vagoneta',
                'idpadrevehiculo'=>2,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Camioneta',
                'idpadrevehiculo'=>2,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Motos',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Moto',
                'idpadrevehiculo'=>6,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Cuadratrac',
                'idpadrevehiculo'=>6,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Otros',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Camión',
                'idpadrevehiculo'=>9,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Buses',
                'idpadrevehiculo'=>9,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Micros',
                'idpadrevehiculo'=>9,
                'estado' => 'A'
            ],
        ];
    }
}
