<?php

use Illuminate\Database\Seeder;
use App\Models\Seguridad\GrupoUsuario;
use Carbon\Carbon;

class GrupoUsuarioTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $grupousuarios = $this->_grupousuarios();
        foreach ($grupousuarios as $grupo) {
            GrupoUsuario::create($grupo);
        }
    }

    private function _grupousuarios()
    {
        $mytime = Carbon::now('America/La_paz');

        return [
            [
                'nombre'    => 'SUPERADMIN',
                'fecha'     => $mytime->toDateString(),
                'hora'      => $mytime->toTimeString(),
                'estado'    => 'A',
                'ess'       => 'S',
                'esa'       => 'N',
                'esv'       => 'N',
                'del'       => 'N',
            ],
            [
                'nombre'    => 'ADMINISTRADOR',
                'fecha'     => $mytime->toDateString(),
                'hora'      => $mytime->toTimeString(),
                'estado'    => 'A',
                'ess'       => 'N',
                'esa'       => 'S',
                'esv'       => 'N',
                'del'       => 'N',
            ],
            [
                'nombre'    => 'ABOGADO/VENDEDOR',
                'fecha'     => $mytime->toDateString(),
                'hora'      => $mytime->toTimeString(),
                'estado'    => 'A',
                'ess'       => 'N',
                'esa'       => 'N',
                'esv'       => 'S',
                'del'       => 'N',
            ],
        ];
    }
}
