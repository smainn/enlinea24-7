<?php

use Illuminate\Database\Seeder;
use App\Models\Seguridad\Usuario;
use Carbon\Carbon;

class UsuarioTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $usuarios = $this->_usuarios();
        foreach ($usuarios as $user) {
            Usuario::create($user);
        }
    }

    private function _usuarios()
    {
        $mytime = Carbon::now('America/La_paz');

        return [
            [
                'fkidgrupousuario'  => 1,
                'nombre'    => 'Rolando',
                'apellido'  => 'Martinez',
                'login'     => 'superadmin',
                'password'  => bcrypt('123456erp'),
                'fecha'     => $mytime->toDateString(),
                'hora'      => $mytime->toTimeString(),
            ],
            [
                'fkidgrupousuario'    => 2,
                'nombre'    => 'Liliana',
                'apellido'  => 'Ar',
                'login'     => 'admin',
                'password'  => bcrypt('123456erp'),
                'fecha'     => $mytime->toDateString(),
                'hora'      => $mytime->toTimeString(),
            ],
        ];
    }
}
