<?php

namespace Modules\Commerce\Http\Controllers\Admin\Seguridad;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

use Modules\Commerce\Entities\Admin\Seguridad\GrupoUsuario;
use Modules\Commerce\Entities\Admin\Seguridad\Componente;
use Modules\Commerce\Entities\Admin\Seguridad\AsignacionPrivilegio;
use Modules\Commerce\Entities\Admin\Log;

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
                    $asignacionPrivilegio->visible = ($array->visible == true)?'A':'N';
                    $asignacionPrivilegio->editable = ($array->editable == true)?'A':'N';
                    $asignacionPrivilegio->novisible = ($array->noVisible == true)?'A':'N';

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
                    $asignacionPrivilegio->visible = ($array->visible == true)?'A':'N';
                    $asignacionPrivilegio->editable = ($array->editable == true)?'A':'N';
                    $asignacionPrivilegio->novisible = ($array->noVisible == true)?'A':'N';

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
                    $componente->activo = ($array->active == true)?'S':'N';
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
                            $asignacionPrivilegio->visible = 'A';
                            $asignacionPrivilegio->editable = 'A';
                            $asignacionPrivilegio->novisible = 'N';
            
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
        DB::beginTransaction();
        try {
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
                        $asignacionPrivilegio->visible = 'A';
                        $asignacionPrivilegio->editable = 'A';
                        $asignacionPrivilegio->novisible = 'N';
        
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
                            ->where('activo', '=', 'S')
                            ->orderBy('idcomponente', 'asc')
                            ->get();
                }
            }
            
            DB::commit();
            return response()->json([
                'response' => 1,
                'data' => $permisos
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

            if ($idgrupo == 1) { 

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
                        $asignacionPrivilegio->visible = 'N';
                        $asignacionPrivilegio->editable = 'N';
                        $asignacionPrivilegio->novisible = 'A';
        
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
                if ($idgrupo == 2) {

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
                            $asignacionPrivilegio->visible = 'N';
                            $asignacionPrivilegio->editable = 'N';
                            $asignacionPrivilegio->novisible = 'A';
            
                            $asignacionPrivilegio->save();
            
                        }
                    }

                    $permisos = DB::connection($connection)
                        ->table('asignacionprivilegio as a')
                        ->join('componente as c', 'a.fkidcomponente', '=', 'c.idcomponente')
                        ->select('a.idasignacionprivilegio' ,'c.idcomponente', 'c.descripcion', 'c.tipo', 
                            'c.idcomponentepadre', 'a.visible', 'a.editable', 'a.novisible', 'a.habilitado')
                        ->where('a.fkidgrupousuario', '=', $id)
                        ->where('c.activo', '=', 'S')
                        ->where('a.habilitado', '=', 'A')
                        ->orderBy('c.idcomponente', 'asc')
                        ->get();
                }
            }
            
            return response()->json([
                'response' => 1,
                'data' => $permisos,
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
