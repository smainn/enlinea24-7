<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Ventas\Ciudad;

class CiudadTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $ciudades = $this->_getCiudades();
        foreach ($ciudades as $ciudad) {
            Ciudad::create($ciudad);
        }
    }

    private function _getCiudades()
    {
        return [
            [
                'descripcion'           => 'Ninguno',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Bolivia',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Santa Cruz',
                'idpadreciudad'=>2,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'La Paz',
                'idpadreciudad'=>2,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Cochabamba',
                'idpadreciudad'=>2,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Brasil',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Corumba',
                'idpadreciudad'=>6,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Brasilia',
                'idpadreciudad'=>6,
                'estado' => 'A'
            ],
        ];
    }
}
