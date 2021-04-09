<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Ventas\ComisionVenta;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt; 
use DB;

class ComisionVentaController extends Controller
{
    public function index(Request $request)
    {
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));

        //     $com = new ComisionVenta();
        //     $com->setConnection($connection);
        //     $data = $com->all();
        //     $usuarios = DB::connection($connection)
        //                     ->select("select u.idusuario, u.nombre, u.apellido, u.sexo, u.fechanac, u.email, u.foto
        //                             from usuario u, grupousuario g
        //                             where g.idgrupousuario = u.fkidgrupousuario and g.esv = 'S' and
        //                                 g.deleted_at is null and u.deleted_at is null and
        //                                 u.idusuario not in (
        //                                                 select fkidusuario as idusuario
        //                                                 from vendedor
        //                                                 where fkidusuario is not null and deleted_at is null
        //                                             )"
        //                             );
        //     return response()->json([
        //         "response" => 1,
        //         "data" => $data,
        //         "usuarios" => $usuarios // para disminuir la carga de peticiones
        //     ]);
        // } catch (DecryptException $e) {
        //     return response()->json([
        //         'response' => -3,
        //         'message' => 'Vuelva a iniciar sesion'
        //     ]);
        // } catch (\Throwable $th) {
        //     return response()->json([
        //         'response' => 0,
        //         'message' => 'Ocurrio un problema al obtener los datos'
        //     ]);
        // }
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $comisiones = new ComisionVenta();
            $comisiones->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $comisiones->select('comisionventa.idcomisionventa', 'comisionventa.descripcion', 'comisionventa.valor',
                                             'comisionventa.tipo')
                ->orWhere('comisionventa.idcomisionventa', 'LIKE', "%$request->buscar%")
                ->orWhere('comisionventa.descripcion', 'ILIKE', "%$request->buscar%")
                ->orWhere('comisionventa.valor', 'ILIKE', "%$request->buscar%")
                ->orWhere('comisionventa.tipo', 'ILIKE', "%$request->buscar%")
                ->orderBy('comisionventa.idcomisionventa', 'ASC')
                ->paginate($paginate);
            } else {
                $datos = $comisiones->select('comisionventa.idcomisionventa', 'comisionventa.descripcion', 'comisionventa.valor',
                                             'comisionventa.tipo')
                ->orderBy('comisionventa.idcomisionventa', 'ASC')
                ->paginate($paginate);
            }
            $datosComisiones = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            $usuarios = DB::connection($connection)
                ->select("select u.idusuario, u.nombre, u.apellido, u.sexo, u.fechanac, u.email, u.foto
                        from usuario u, grupousuario g
                        where g.idgrupousuario = u.fkidgrupousuario and g.esv = 'S' and
                            g.deleted_at is null and u.deleted_at is null and
                            u.idusuario not in (
                                            select fkidusuario as idusuario
                                            from vendedor
                                            where fkidusuario is not null and deleted_at is null
                                        )"
                        );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'usuarios' => $usuarios,
                'data' => $datosComisiones
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema al obtener los datos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    public function lista(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $buscar = $request->buscar;
            $paginacion = $request->pagina;

            $com = new ComisionVenta();
            $com->setConnection($connection);
            if ($buscar == ''){

                $comision = $com->orderBy('idcomisionventa', 'desc')
                                ->paginate($paginacion);
    
            }else{
                $comision = $com->where('descripcion', 'ilike', '%'.$buscar.'%')
                                ->orWhere('idcomisionventa', 'ilike', '%'.$buscar.'%')
                                ->orWhere('valor', 'ilike', '%'.$buscar.'%')
                                ->orderBy('idcomisionventa', 'desc')
                                ->paginate($paginacion);
                
            }
            
            return response()->json([
                'response' => 1,
                'data' => $comision,
                'pagination' => [
                    'total'        => $comision->total(),
                    'current_page' => $comision->currentPage(),
                    'per_page'     => $comision->perPage(),
                    'last_page'    => $comision->lastPage(),
                    'from'         => $comision->firstItem(),
                    'to'           => $comision->lastItem(),
                ],
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
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
            
            $com = new ComisionVenta();
            $com->setConnection($connection);
            $count = count($com->all()) + 1;
            
            return response()->json([
                'response' => 1,
                'data' => $count,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }

    }

    /**
     * Store a newly created resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $com = new ComisionVenta();
            $com->setConnection($connection);


            $descripcion = $request->descripcion;
            $valor = $request->valor;
            $tipo = $request->tipo;

            $comision = new ComisionVenta();
            $comision->descripcion = $descripcion;
            $comision->valor = $valor;
            $comision->tipo = $tipo;
            $comision->setConnection($connection);
            $comision->save();
            
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto la comisionventa ' . $comision->idcomisionventa;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'data' => $descripcion
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {

            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    /**
     * Show the specified resource.
     * @return Response
     */
    public function show()
    {
        return view('commerce::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @return Response
     */
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $com = new ComisionVenta();
            $com->setConnection($connection);
            $comision = $com->find($id);
            
            return response()->json([
                'response' => 1,
                'data' => $comision
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function update(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $descripcion = $request->descripcion;
            $valor = $request->valor;
            $tipo = $request->tipo;
            $id = $request->id;

            $com = new ComisionVenta();
            $com->setConnection($connection);
            $comision = $com->find($id);
            $comision->descripcion = $descripcion;
            $comision->valor = $valor;
            $comision->tipo = $tipo;
            $comision->setConnection($connection);
            $comision->update();
            
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito la comisionventa ' . $comision->idcomisionventa;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'data' => $descripcion
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @return Response
     */
    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            
            $comision = DB::connection($connection)
                            ->table('comisionventa as c')
                            ->join('vendedor as v', 'c.idcomisionventa', '=', 'v.fkidcomisionventa')
                            ->where('c.idcomisionventa', '=', $id)
                            ->where('c.deleted_at', null)
                            ->where('v.deleted_at', null)
                            ->get();

            if (sizeof($comision) > 0) {
                return response()->json([
                    'response' => 2,
                ]);
            }
            $com = new ComisionVenta();
            $com->setConnection($connection);
            $comision = $com->find($id);
            $comision->setConnection($connection);
            $comision->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la comisionventa ' . $comision->idcomisionventa;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }
}
