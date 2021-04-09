<?php

use App\Models\Configuracion\TipoLibroVenta;
use Illuminate\Database\Seeder;

class TipoLibroVentaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $libroventas = $this->_tipolibroventa();
        foreach ($libroventas as $libroventa) {
            TipoLibroVenta::create($libroventa);
        }
    }
    private function _tipolibroventa()
    {
        return [
            [
                'nombre' => 'Standar',
                'abrev'  => 'STD',
            ],

        ];
    }
}
