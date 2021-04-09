<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\Sucursal;

class SucursalTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sucursals = $this->_sucursals();
        foreach ($sucursals as $sucursal) {
            Sucursal::create($sucursal);
        }
    }

    private function _sucursals()
    {
        return [
            [
                'nombre'            => 'Rolando',
                'apellido'          => 'martinez',
                'nombrecomercial'   => 'Smainn',
                'razonsocial'       => null,
                'nit'               => '4698512017',
                'direccion'         => 'Av banzer 5to anillo',
                'zona'              => 'barrio los angeles',
                'fkidciudad'        => 3,
                'fkidpais'          => 2,
                'telefono'          => '73140480',
                'tipoempresa'       => 'N',
                'tiposucursal'      => 'M',
                'logotipourl'       => null,
                'impuestoiva'       => 13,

            ],

        ];
    }
}
