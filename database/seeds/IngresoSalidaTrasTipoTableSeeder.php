<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Almacen\IngresoSalidaTraspasoTipo;

class IngresoSalidaTrasTipoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $datos = $this->_getIngresoSalidaTranspasoTipo();
        foreach ($datos as $row) {
            IngresoSalidaTraspasoTipo::create($row);
        }
    }

    private function _getIngresoSalidaTranspasoTipo()
    {
        return [
            [
                'descripcion' => 'Nuevo',
                'estado' => 'A'
            ],
            [
                'descripcion' => 'De Baja',
                'estado' => 'A'
            ],
            [
                'descripcion' => 'Traspaso',
                'estado' => 'A'
            ],
            [
                'descripcion' => 'Armado',
                'estado' => 'A'
            ],
            [
                'descripcion' => 'En consignación',
                'estado' => 'A'
            ]
        ];
    }
}
