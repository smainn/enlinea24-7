<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\AlmacenUbicacion;

class AlmacenubicacionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $almacenubicacions = $this->_almacenubicacions();
        foreach ($almacenubicacions as $almacenubicacion) {
            AlmacenUbicacion::create($almacenubicacion);
        }
    }

    private function _almacenubicacions()
    {
        return [

            [
                'descripcion'              => 'Pasillo A',
                'capacidad'                => '210',
                'notas'                    => 'ferreteria',
                'estado'                   => 'A',
                'fkidalmacen'              => '1',
            ],
            [
                'descripcion'              => 'Pasillo A.1',
                'capacidad'                => '112',
                'notas'                    => 'muebles',
                'idpadre'                  => '1',
                'estado'                   => 'A',
                'fkidalmacen'              => '1',
            ],
        ];
    }
}
