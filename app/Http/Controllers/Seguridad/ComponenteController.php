<?php

namespace App\Http\Controllers\Seguridad;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Seguridad\GrupoUsuario;
use App\Models\Seguridad\Componente;
use App\Models\Seguridad\AsignacionPrivilegio;
use App\Models\Seguridad\Log;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ComponenteController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $buscar = $request->buscar;
            $paginacion = $request->pagina;
            $idgrupo = $request->id;

            $grupo = new GrupoUsuario();
            $grupo->setConnection($connection);
            if ($buscar == ''){

                if ($idgrupo == '') {
                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre')
                                        ->where('estado', '=', 'A')
                                        ->orderBy('idgrupousuario', 'asc')
                                        ->paginate(10);
                } else {
                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre')
                                        ->where('nombre', 'ilike', '%'.$buscar.'%')
                                        ->where('estado', '=', 'A')
                                        ->where(
                                            ($idgrupo == 1)?
                                                [['estado', '=', 'A']]:
                                                [['idgrupousuario', '>', $idgrupo]]
                                        )
                                        ->orderBy('idgrupousuario', 'asc')
                                        ->paginate(10);
                }

            } else {
                if ($idgrupo == '') {
                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre')
                                        ->where('nombre', 'ilike', '%'.$buscar.'%')
                                        ->where('estado', '=', 'A')
                                        ->orderBy('idgrupousuario', 'asc')
                                        ->paginate(10);
                } else {
                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre')
                                        ->where('nombre', 'ilike', '%'.$buscar.'%')
                                        ->where('estado', '=', 'A')
                                        ->where(
                                            ($idgrupo == 1)?
                                                [['estado', '=', 'A']]:
                                                [['idgrupousuario', '>', $idgrupo]]
                                        )
                                        ->orderBy('idgrupousuario', 'asc')
                                        ->paginate(10);
                }
            }
            
            return response()->json([
                'response' => 1,
                'data' => $grupoUsuario,
                'pagination' => [
                    'total'        => $grupoUsuario->total(),
                    'current_page' => $grupoUsuario->currentPage(),
                    'per_page'     => $grupoUsuario->perPage(),
                    'last_page'    => $grupoUsuario->lastPage(),
                    'from'         => $grupoUsuario->firstItem(),
                    'to'           => $grupoUsuario->lastItem(),
                ],
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]); 
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     * @return Response
     */
    public function create()
    {
        return view('commerce::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $data = json_decode($request->permisos);
            $id = $request->idGrupo;

            $bandera = $request->bandera;

            $priv = new AsignacionPrivilegio();
            $priv->setConnection($connection);

            if ($bandera == 0) {

                foreach($data as $array) {

                    $asignacionPrivilegio = new AsignacionPrivilegio();
                    $asignacionPrivilegio->setConnection($connection);
                    $asignacionPrivilegio->fkidgrupousuario = $id;
                    $asignacionPrivilegio->fkidcomponente = $array->value;
                    $asignacionPrivilegio->habilitado = 'A';
                    $asignacionPrivilegio->visible = ($array->visible == true) ? Crypt::encrypt('A') : Crypt::encrypt('N');
                    $asignacionPrivilegio->editable = ($array->editable == true) ? Crypt::encrypt('A') : Crypt::encrypt('N');
                    $asignacionPrivilegio->novisible = ($array->noVisible == true) ? Crypt::encrypt('A') : Crypt::encrypt('N');

                    $asignacionPrivilegio->save();
                }
                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Asigno privilegios al grupo ' . $id;
                $log->guardar($request, $accion);

            }else {
                foreach($data as $array) {
                    $asignacionPrivilegio = $priv->find($array->asignacion);
                    $asignacionPrivilegio->setConnection($connection);
                    $asignacionPrivilegio->habilitado = 'A';
                    $asignacionPrivilegio->visible = ($array->visible == true) ? Crypt::encrypt('A') : Crypt::encrypt('N');
                    $asignacionPrivilegio->editable = ($array->editable == true) ? Crypt::encrypt('A') : Crypt::encrypt('N');
                    $asignacionPrivilegio->novisible = ($array->noVisible == true) ? Crypt::encrypt('A') : Crypt::encrypt('N');

                    $asignacionPrivilegio->update();

                }
                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito privilegios del grupo ' . $id;
                $log->guardar($request, $accion);
            }
            DB::commit();
            return response()->json([
                'response' => 1,
                'data' => $data,
                'accion' => $accion,
                'bandera' => $bandera,
            ]);

        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]); 
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function activar(Request $request) {

        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = json_decode($request->permisos);
            $id = $request->id;

            if ($id == 1) {
                $comp = new Componente();
                $comp->setConnection($connection);
                foreach($data as $array) {

                    $componente = $comp->find($array->value);
                    $componente->activo = ($array->active == true) ? Crypt::encrypt('S'): Crypt::encrypt('N');
                    $componente->setConnection($connection);
                    $componente->update();

                    $asig = new AsignacionPrivilegio();
                    $asig->setConnection($connection);
                    $permisosAdmin = $asig->where('fkidgrupousuario', '=', '2')
                        ->where('fkidcomponente', '=', $array->value)
                        ->get();

                    if ($array->active == true) {

                        if (sizeof($permisosAdmin) == 0) {

                            $asignacionPrivilegio = new AsignacionPrivilegio();
                            $asignacionPrivilegio->setConnection($connection);
                            $asignacionPrivilegio->fkidgrupousuario = 2;
                            $asignacionPrivilegio->fkidcomponente = $array->value;
                            $asignacionPrivilegio->habilitado = 'A';
                            $asignacionPrivilegio->visible = Crypt::encrypt('A');
                            $asignacionPrivilegio->editable = Crypt::encrypt('A');
                            $asignacionPrivilegio->novisible = Crypt::encrypt('N');
            
                            $asignacionPrivilegio->save();
                        } else {
                            
                            $asignacionPrivilegio = $asig->find($permisosAdmin[0]->idasignacionprivilegio);
                            $asignacionPrivilegio->habilitado = 'A';
                            $asignacionPrivilegio->setConnection($connection);
                            $asignacionPrivilegio->update();
                        }
                    }else {

                        if (sizeof($permisosAdmin) > 0) {

                            $asignacionPrivilegio =  $asig->find($permisosAdmin[0]->idasignacionprivilegio);
                            $asignacionPrivilegio->habilitado = 'N';
                            $asignacionPrivilegio->setConnection($connection);
                            $asignacionPrivilegio->update();
                        }                     
                    }

                }
                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Activo permisos al grupo ' . $id;
                $log->guardar($request, $accion);
                DB::commit();

                return response()->json([
                    'response' => 1,
                    'data' => $array,
                ]);
                
            }
            DB::commit();
            return response()->json([
                'response' => 0,
                'data' => 'exito',
            ]);

        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]); 
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Response
     */
    public function show(Request $request, $idgrupo)
    {
        
        try {
            DB::beginTransaction();
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $permisos = [];
            $comp = new Componente();
            $comp->setConnection($connection);
            if ($idgrupo == 1) {

                $consulta = DB::connection($connection)->select(
                    'select *
                     from componente as c 
                     where c.idcomponente not in 
                        (select a.fkidcomponente 
                         from asignacionprivilegio as a
                         where a.fkidgrupousuario = '.$idgrupo.' 
                        )'
                );

                if (sizeof($consulta) > 0) {
                
                    foreach ($consulta as $c) {
                        $asignacionPrivilegio = new AsignacionPrivilegio();
                        $asignacionPrivilegio->setConnection($connection);
                        $asignacionPrivilegio->fkidgrupousuario = $idgrupo;
                        $asignacionPrivilegio->fkidcomponente = $c->idcomponente;
                        $asignacionPrivilegio->habilitado = 'A';
                        $asignacionPrivilegio->visible = Crypt::encrypt('A');
                        $asignacionPrivilegio->editable = Crypt::encrypt('A');
                        $asignacionPrivilegio->novisible = Crypt::encrypt('N');
        
                        $asignacionPrivilegio->save();
                    }
                }
                
                $permisos = $comp->select('idcomponente', 'descripcion', 'tipo', 'idcomponentepadre', 'activo')
                        ->where('estado', '=', 'A')
                        ->orderBy('idcomponente', 'asc')
                        ->get();

            } else {
                if ($idgrupo == 2) {
                    $permisos = $comp->select('idcomponente', 'descripcion', 'tipo', 'idcomponentepadre', 'activo')
                            ->where('estado', '=', 'A')
                            ->orderBy('idcomponente', 'asc')
                            ->get();
                }
            }
            $arr = [];
            foreach ($permisos as $row) {
                if ($idgrupo == 1) {
                    $descripcion = Crypt::decrypt($row->descripcion);
                    $tipo = Crypt::decrypt($row->tipo);
                    $activo = Crypt::decrypt($row->activo);
                    array_push($arr, [
                        'idcomponente' => $row->idcomponente,
                        'descripcion' => $descripcion,
                        'tipo' => $tipo,
                        'idcomponentepadre' => $row->idcomponentepadre,
                        'activo' => $activo
                    ]);
                }
                if ($idgrupo == 2) {
                    $descripcion = Crypt::decrypt($row->descripcion);
                    $tipo = Crypt::decrypt($row->tipo);
                    $activo = Crypt::decrypt($row->activo);
                    if ($activo == 'S') {
                        array_push($arr, [
                            'idcomponente' => $row->idcomponente,
                            'descripcion' => $descripcion,
                            'tipo' => $tipo,
                            'idcomponentepadre' => $row->idcomponentepadre,
                            'activo' => $activo
                        ]);
                    }
                }
            }
            DB::commit();
            return response()->json([
                'response' => 1,
                'data' => $arr,
                'permisos' => $permisos,
                'idgrupo' => $idgrupo,
            ]);

        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]); 
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function getPermisos(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $idgrupo = $request->idgrupo;
            $permisos = [];

            if ($id == 1) { 

                $consulta = DB::connection($connection)->select(
                    'select *
                     from componente as c 
                     where c.idcomponente not in 
                        (select a.fkidcomponente 
                         from asignacionprivilegio as a
                         where a.fkidgrupousuario = '.$id.' 
                        )'
                );

                if (sizeof($consulta) > 0) {
                
                    foreach ($consulta as $c) {
                        $asignacionPrivilegio = new AsignacionPrivilegio();
                        $asignacionPrivilegio->setConnection($connection);
                        $asignacionPrivilegio->fkidgrupousuario = $id;
                        $asignacionPrivilegio->fkidcomponente = $c->idcomponente;
                        $asignacionPrivilegio->habilitado = 'A';
                        $asignacionPrivilegio->visible = Crypt::encrypt('A');
                        $asignacionPrivilegio->editable = Crypt::encrypt('A');
                        $asignacionPrivilegio->novisible = Crypt::encrypt('N');
        
                        $asignacionPrivilegio->save();
        
                    }
                }

                $permisos = DB::connection($connection)
                    ->table('asignacionprivilegio as a')
                    ->join('componente as c', 'a.fkidcomponente', '=', 'c.idcomponente')
                    ->select('a.idasignacionprivilegio' ,'c.idcomponente', 'c.descripcion', 'c.tipo', 
                        'c.idcomponentepadre', 'a.visible', 'a.editable', 'a.novisible', 'a.habilitado')
                    ->where('a.fkidgrupousuario', '=', $id)
                    ->orderBy('c.idcomponente', 'asc')
                    ->get();

            }else {

                $consulta = DB::connection($connection)->select(
                    'select *
                        from componente as c 
                        where c.idcomponente not in 
                        (select a.fkidcomponente 
                            from asignacionprivilegio as a
                            where a.fkidgrupousuario = '.$id.' 
                        )'
                );

                if (sizeof($consulta) > 0) {
                
                    foreach ($consulta as $c) {
                        $asignacionPrivilegio = new AsignacionPrivilegio();
                        $asignacionPrivilegio->setConnection($connection);
                        $asignacionPrivilegio->fkidgrupousuario = $id;
                        $asignacionPrivilegio->fkidcomponente = $c->idcomponente;
                        $asignacionPrivilegio->habilitado = 'A';
                        $asignacionPrivilegio->visible = Crypt::encrypt('N');
                        $asignacionPrivilegio->editable = Crypt::encrypt('N');
                        $asignacionPrivilegio->novisible = Crypt::encrypt('A');
        
                        $asignacionPrivilegio->save();
        
                    }
                }

                $permisos = DB::connection($connection)
                    ->table('asignacionprivilegio as a')
                    ->join('componente as c', 'a.fkidcomponente', '=', 'c.idcomponente')
                    ->select('a.idasignacionprivilegio' ,'c.idcomponente', 'c.descripcion', 'c.tipo', 'c.activo',
                        'c.idcomponentepadre', 'a.visible', 'a.editable', 'a.novisible', 'a.habilitado')
                    ->where('a.fkidgrupousuario', '=', $id)
                    ->orderBy('c.idcomponente', 'asc')
                    ->get();
                    
            }

            $arr = [];
            foreach ($permisos as $row) {
                if ($idgrupo == 1) {
                    $descripcion = Crypt::decrypt($row->descripcion);
                    $tipo = Crypt::decrypt($row->tipo);
                    $visible = Crypt::decrypt($row->visible);
                    $editable = Crypt::decrypt($row->editable);
                    $novisible = Crypt::decrypt($row->novisible);
                    $activo = Crypt::decrypt($row->activo);
                    array_push($arr, [
                        'idasignacionprivilegio' => $row->idasignacionprivilegio,
                        'idcomponente' => $row->idcomponente,
                        'descripcion' => $descripcion,
                        'tipo' => $tipo,
                        'idcomponentepadre' => $row->idcomponentepadre,
                        'visible' => $visible,
                        'editable' => $editable,
                        'novisible' => $novisible,
                        'habilitado' => $row->habilitado
                    ]);
                }else {

                    $descripcion = Crypt::decrypt($row->descripcion);
                    $tipo = Crypt::decrypt($row->tipo);
                    $visible = Crypt::decrypt($row->visible);
                    $editable = Crypt::decrypt($row->editable);
                    $novisible = Crypt::decrypt($row->novisible);
                    $activo = Crypt::decrypt($row->activo);

                    if ($activo == 'S') {
                        array_push($arr, [
                            'idasignacionprivilegio' => $row->idasignacionprivilegio,
                            'idcomponente' => $row->idcomponente,
                            'descripcion' => $descripcion,
                            'tipo' => $tipo,
                            'idcomponentepadre' => $row->idcomponentepadre,
                            'visible' => $visible,
                            'editable' => $editable,
                            'novisible' => $novisible,
                            'habilitado' => $row->habilitado
                        ]);
                    }
                    
                }
            }
            
            return response()->json([
                'response' => 1,
                'data' => $arr,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]); 
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Response
     */
    public function edit($id)
    {
        return view('commerce::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
