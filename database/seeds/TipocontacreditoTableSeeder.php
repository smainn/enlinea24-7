<?php

use Illuminate\Database\Seeder;
use App\Models\Comercio\Ventas\TipoContaCredito;

class TipocontacreditoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $contacreditos = $this->_contacreditos();
        foreach ($contacreditos as $contacredito) {
            TipoContaCredito::create($contacredito);
        }
    }

    private function _contacreditos()
    {
        return [
            [
                'descripcion'           => 'Contado',
            ],
            [
                'descripcion'           => 'Crédito',
            ],

        ];
    }
}
