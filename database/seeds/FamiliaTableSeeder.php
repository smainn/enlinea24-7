<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\Producto\Familia;

class FamiliaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $familias = $this->_getfamilias();
        foreach ($familias as $familia) {
            Familia::create($familia);
        }
    }

    private function _getfamilias()
    {
        return [
            [
                'descripcion'           => 'Ninguno',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Vestimenta',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Electrónicos',
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Heladeras',
                'idpadrefamilia'=>3,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Lavadoras',
                'idpadrefamilia'=>3,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Computadoras',
                'idpadrefamilia'=>3,
                'estado' => 'A'
            ],
            [
                'descripcion'           => 'Ferreteria',
                'estado' => 'A'
            ],


        ];
    }
}
