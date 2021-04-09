<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Ventas\ClienteTipo;

class ClientetipoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $clientetipos = $this->_clientetipos();
        foreach ($clientetipos as $clientetipo) {
            ClienteTipo::create($clientetipo);
        }
    }

    private function _clientetipos()
    {
        return [
            [
                'descripcion'           => 'Ninguno',
            ],
            [
                'descripcion'           => 'Empresario',
            ],
            [
                'descripcion'           => 'Abogados',
            ],
            [
                'descripcion'           => 'Panadero',
            ],
            [
                'descripcion'           => 'Doctores',
            ],
            [
                'descripcion'           => 'Taxistas',
            ],
        ];
    }
}
