<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\Almacen;

class AlmacenTableSeeder extends Seeder
{
    public function run()
    {
        $almacens = $this->_almacens();
        foreach ($almacens as $almacen) {
            Almacen::create($almacen);
        }
    }

    private function _almacens()
    {
        return [
            [
                'descripcion'           => 'Almacen 1',
                'direccion'             => 'av beni',
                'notas'                 => 'almacen de prueba',  
                'fkidsucursal'          => '1',
            ],
        ];
    }
}
