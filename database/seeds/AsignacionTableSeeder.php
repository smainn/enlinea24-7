<?php

use Illuminate\Database\Seeder;
use App\Models\Seguridad\Componente;
use App\Models\Seguridad\AsignacionPrivilegio;
use Illuminate\Support\Facades\Crypt;

class AsignacionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permisos = Componente::where('estado', 'A')->orderBy('idcomponente', 'asc')->get();
        if (sizeof($permisos) > 0) {
            foreach ($permisos as $c) {
                $asignacionPrivilegio = new AsignacionPrivilegio();
                $asignacionPrivilegio->fkidgrupousuario = 1;
                $asignacionPrivilegio->fkidcomponente = $c->idcomponente;
                $asignacionPrivilegio->habilitado = 'A';
                $asignacionPrivilegio->visible = Crypt::encrypt('A');
                $asignacionPrivilegio->editable = Crypt::encrypt('A');
                $asignacionPrivilegio->novisible = Crypt::encrypt('N');
                $asignacionPrivilegio->save();
            }
        }
    }
}
