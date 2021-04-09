<?php

namespace App\Http\Controllers\Seguridad;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Seguridad\GrupoUsuario;
use App\Models\Seguridad\Log;

use App\Models\Seguridad\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

use Carbon\Carbon;
use function GuzzleHttp\json_decode;

class GrupoUsuarioController extends Controller
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
            $iduser = $request->iduser;

            $grupo = new GrupoUsuario();
            $grupo->setConnection($connection);
            if ($buscar == ''){

                if ($iduser == '') {

                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre', 'estado')
                                        ->where('estado', '=', 'A')
                                        ->orderBy('idgrupousuario', 'asc')
                                        ->paginate(10);
                }else {
                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre', 'estado')
                                        ->where('estado', '=', 'A')
                                        ->where(
                                            (DB::raw("(select fkidgrupousuario from usuario  where idusuario = $iduser)") == null)?
                                            [['estado', '=', 'A']]:
                                            [['idgrupousuario', '>=', DB::raw("(select fkidgrupousuario from usuario  where idusuario = $iduser)")]]
                                        )
                                        ->orderBy('idgrupousuario', 'asc')
                                        ->paginate(10);
                }

            }else{
                if ($iduser == '') {
                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre', 'estado')
                                        ->where('estado', '=', 'A')
                                        ->where('nombre', 'ilike', '%'.$buscar.'%')
                                        ->orderBy('idgrupousuario', 'asc')
                                        ->paginate(10);
                }else {
                    $grupoUsuario = $grupo->select('idgrupousuario', 'nombre', 'estado')
                                        ->where('estado', '=', 'A')
                                        ->where('nombre', 'ilike', '%'.$buscar.'%')
                                        ->where(
                                            (DB::raw("(select fkidgrupousuario from usuario  where fkidgrupousuario = $iduser)") == null)?
                                            [['estado', '=', 'A']]:
                                            [['idgrupousuario', '>=', DB::raw("(select fkidgrupousuario from usuario  where fkidgrupousuario = $iduser)")]]
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
    public function create(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $usr = new Usuario();
            $usr->setConnection($connection);
            $usuarios = $usr->where('estado', '=', 'A')
                ->whereNull('fkidgrupousuario')
                ->get();
            
            return response()->json([
                'response' => 1,
                'usuario' => $usuarios,
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
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $nombre = $request->nombre;
            $notas = $request->notas;
            $usuarios = json_decode($request->usuarios);
            $iduser = $request->idusuario;
            $bandera = 0;
            $user = [];

            $array = DB::connection($connection)
                        ->table('grupousuario')
                        ->where('nombre', '=', $nombre)
                        ->where('deleted_at', null)
                        ->get();

    
            if(sizeof($array) > 0){ 
                return response()->json([
                    'response' => 0,
                ]);     
            }

            $grupoUsuario = new GrupoUsuario();
            $grupoUsuario->setConnection($connection);
            $grupoUsuario->nombre = $nombre;
            $grupoUsuario->notas = $notas;
            $grupoUsuario->estado = 'A';

            $mytime = Carbon::now('America/La_paz');

            $grupoUsuario->fecha = $mytime->toDateString();
            $grupoUsuario->hora = $mytime->toTimeString();

            $grupoUsuario->save();

            $usr = new Usuario();
            $usr->setConnection($connection);
            for ($pos = 0; $pos < sizeof($usuarios); $pos++) {
                
                $usuario = $usr->find($usuarios[$pos]->idusuario);
                $usuario->fkidgrupousuario = $grupoUsuario->idgrupousuario;
                $usuario->update();

                if ($iduser == $usuario->idusuario) {
                    $user = [
                        'idusuario' => $usuario->idusuario,
                        'nombre' => $usuario->nombre,
                        'apellido' => $usuario->apellido,
                        'email' => $usuario->email,
                        'telefono' => $usuario->telefono,
                        'foto' => $usuario->foto,
                        'is_file' => is_file(public_path().$usuario->foto),
                        'login' => $usuario->login,
                        'fechanacimiento' => $usuario->fechanac,
                        'genero' => $usuario->sexo,
                        'idgrupousuario' => $usuario->fkidgrupousuario,
                    ];
                    $bandera = 1;
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el grupo ' . $grupoUsuario->idgrupousuario;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'data' => 'Exito',
                'bandera' => $bandera,
                'user' => $user
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]); 
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        return view('commerce::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Response
     */
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $grupo = new GrupoUsuario();
            $grupo->setConnection($connection);
            $data = $grupo->find($id);

            $usr = new Usuario();
            $usr->setConnection($connection);
            $usuarios = $usr->select('idusuario', 'nombre', 'apellido', 'login')
                            ->where('estado', '=', 'A')
                            ->whereNull('fkidgrupousuario')
                            ->orderBy('idusuario', 'desc')
                            ->get();

            $usuariocongrupo = $usr->select('idusuario', 'nombre', 'apellido', 'login')
                                    ->where('fkidgrupousuario', '=', $id)
                                    ->orderBy('idusuario', 'desc')
                                    ->get();
            
            return response()->json([
                'response' => 1,
                'usuario' => $usuarios,
                'data' => $data,
                'usuariogrupo' => $usuariocongrupo,
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
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $iduser = $request->idusuario;
            $bandera = 0;
            $user = [];

            $grupo = new GrupoUsuario();
            $grupo->setConnection($connection);
            $grupoUsuario = $grupo->find($id);
            $nombre = $request->nombre;

            if ($nombre != $grupoUsuario->nombre) {

                $array = DB::connection($connection)
                            ->table('grupousuario')
                            ->where('nombre', '=', $nombre)
                            ->where('deleted_at', null)
                            ->get();

    
                if(sizeof($array) > 0){ 
                    return response()->json([
                        'response' => 0,
                        'message' => 'No se permite campo vacio',
                        'control' => 0,
                    ]);     
                }
            }

            $notas = $request->notas;
            $usuarioscongrupo = json_decode($request->usuarios);
            $usuariossingrupo = json_decode($request->usuariossingrupo);

            $grupoUsuario->nombre = $nombre;
            $grupoUsuario->notas = $notas;

            if (($id == 1) || ($id == 2)) {
                if (sizeof($usuarioscongrupo) == 0) {
                    return response()->json([
                        'response' => 0,
                        'message' => 'No se permite grupo sin usuarios',
                        'control' => 1
                    ]);
                }
            }
            $grupoUsuario->setConnection($connection);
            $grupoUsuario->update();
            
            $usr = new Usuario();
            $usr->setConnection($connection);
            for ($pos = 0; $pos < sizeof($usuarioscongrupo); $pos++) {
                
                $usuario = $usr->find($usuarioscongrupo[$pos]->idusuario);
                $usuario->fkidgrupousuario = $grupoUsuario->idgrupousuario;
                $usuario->setConnection($connection);
                $usuario->update();

                if ($iduser == $usuario->idusuario) {
                    $user = [
                        'idusuario' => $usuario->idusuario,
                        'nombre' => $usuario->nombre,
                        'apellido' => $usuario->apellido,
                        'email' => $usuario->email,
                        'telefono' => $usuario->telefono,
                        'foto' => $usuario->foto,
                        'is_file' => is_file(public_path().$usuario->foto),
                        'login' => $usuario->login,
                        'fechanacimiento' => $usuario->fechanac,
                        'genero' => $usuario->sexo,
                        'idgrupousuario' => $usuario->fkidgrupousuario,
                    ];
                    $bandera = 1;
                }
            }

            for ($pos = 0; $pos < sizeof($usuariossingrupo); $pos++) {
                $usuario = $usr->find($usuariossingrupo[$pos]->idusuario);
                $usuario->fkidgrupousuario = null;
                $usuario->update();
                if ($iduser == $usuario->idusuario) {
                    $user = [
                        'idusuario' => $usuario->idusuario,
                        'nombre' => $usuario->nombre,
                        'apellido' => $usuario->apellido,
                        'email' => $usuario->email,
                        'telefono' => $usuario->telefono,
                        'foto' => $usuario->foto,
                        'is_file' => is_file(public_path().$usuario->foto),
                        'login' => $usuario->login,
                        'fechanacimiento' => $usuario->fechanac,
                        'genero' => $usuario->sexo,
                        'idgrupousuario' => $usuario->fkidgrupousuario,
                    ];
                    $bandera = 1;
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el grupo ' . $grupoUsuario->idgrupousuario;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'bandera' => $bandera,
                'user' => $user
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]); 
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $data = DB::connection($connection)
                        ->table('grupousuario as g')
                        ->join('usuario as u', 'g.idgrupousuario', '=', 'u.fkidgrupousuario')
                        ->where('g.idgrupousuario', '=', $id)
                        ->where('g.deleted_at', null)
                        ->where('u.deleted_at', null)
                        ->get();

            if (sizeof($data) == 0) {
                $grupo = new GrupoUsuario();
                $grupo->setConnection($connection);
                $data = $grupo->find($id);

                if ($data->del == 'N') {
                    return response()->json([
                        'response' => 1,
                        'message' => 'No permitido eliminar',
                    ]);
                }

                $data->estado = 'N';
                $data->setConnection($connection);
                $data->update();

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Elimino el grupo ' . $id;
                $log->guardar($request, $accion);

                return response()->json([
                    'response' => 2,
                    'message' => 'Exito en eliminar',
                ]);
            }
            
            return response()->json([
                'response' => 1,
                'message' => 'No se puede eliminar por que tiene usuarios',
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
}
