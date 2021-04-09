<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\ListaPrecio;

class ListaprecioTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $listaprecios = $this->_listaprecios();
        foreach ($listaprecios as $listaprecio) {
            ListaPrecio::create($listaprecio);
        }
    }

    private function _listaprecios()
    {
        return [
            [
                'descripcion'           => 'Precios Oficiales',
                'valor'                 => '10',
                'fechainicio'            => '2020-01-01',
                'fechafin'               => '2020-12-30',
                'idusuario'              => '1',
                'fechahoratransac'       => '2020-01-01 10:00:00',
                'estado'                 => 'A',
                'fijoporcentaje'         => 'F',
                'accion'                 => 'D',
                'fkidmoneda'              => '1',
            ],
        ];
    }
}
