<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\UnidadMedida;

class UnidadmedidaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $unidadmedidas = $this->_unidadmedidas();
        foreach ($unidadmedidas as $unidadmedida) {
            UnidadMedida::create($unidadmedida);
        }
    }

    private function _unidadmedidas()
    {
        return [
            [
                'descripcion'           => 'Ninguno',
                'abreviacion'           => 'n',
            ],
            [
                'descripcion'           => 'Unidad',
                'abreviacion'           => 'u',
            ],
            [
                'descripcion'           => 'Metro',
                'abreviacion'           => 'm',
            ],
            [
                'descripcion'           => 'Litro',
                'abreviacion'           => 'l',
            ],
        ];
    }
}
