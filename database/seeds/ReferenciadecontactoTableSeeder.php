<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Ventas\ReferenciaDeContacto;

class ReferenciadecontactoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $referenciadecontactos = $this->_referenciadecontactos();
        foreach ($referenciadecontactos as $referenciadecontacto) {
            ReferenciaDeContacto::create($referenciadecontacto);
        }
    }

    private function _referenciadecontactos()
    {
        return [
            [
                'descripcion'           => 'Telefóno',
            ],
            [
                'descripcion'           => 'Celular',
            ],
            [
                'descripcion'           => 'Dirección',
            ],
            [
                'descripcion'           => 'Mail',
            ],
            [
                'descripcion'           => 'Telefono casa',
            ],
        ];
    }
}
