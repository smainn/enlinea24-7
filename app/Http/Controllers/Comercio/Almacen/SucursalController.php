<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\Sucursal;
use App\Models\Comercio\Ventas\Ciudad;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class SucursalController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $buscar = $request->buscar;
            $paginate = $request->paginate;

            $suc = new Sucursal();
            $suc->setConnection($connection);

            if ($buscar == '') {

                $sucursal = $suc
                    ->orderBy('idsucursal', 'desc')
                    ->paginate($paginate);

            } else {
                $sucursal = $suc
                    ->where('nombre', 'ilike', '%'.$buscar.'%')
                    ->orWhere('nombrecomercial', 'ilike', '%'.$buscar.'%')
                    ->orWhere('razonsocial', 'ilike', '%'.$buscar.'%')
                    ->orWhere('nit', 'ilike', '%'.$buscar.'%')
                    ->orderBy('idsucursal', 'desc')
                    ->paginate($paginate);
                
            }

            return [
                'pagination' => [
                    'total'        => $sucursal->total(),
                    'current_page' => $sucursal->currentPage(),
                    'per_page'     => $sucursal->perPage(),
                    'last_page'    => $sucursal->lastPage(),
                    'from'         => $sucursal->firstItem(),
                    'to'           => $sucursal->lastItem(),
                ],
                'data' => $sucursal, 'response' => 1,
            ];

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function create(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            
            $ciudad = $ciu->where('idciudad', '<>', '1')->orderBy('idciudad', 'ASC')->get();
            
            return response()->json([
                "response" => 1,
                'ciudad' => $ciudad,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function getSucursales(Request $request){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $buscar = $request->buscar;
            $paginate = $request->paginate;

            $suc = new Sucursal();
            $suc->setConnection($connection);

            if ($buscar == '') {

                $sucursal = $suc
                    ->orderBy('idsucursal', 'desc')
                    ->paginate($paginate);

            } else {
                $sucursal = $suc
                    ->where('nombre', 'ilike', '%'.$buscar.'%')
                    ->orWhere('nombrecomercial', 'ilike', '%'.$buscar.'%')
                    ->orWhere('razonsocial', 'ilike', '%'.$buscar.'%')
                    ->orWhere('direccion', 'ilike', '%'.$buscar.'%')
                    ->orWhere('zona', 'ilike', '%'.$buscar.'%')
                    ->orderBy('idsucursal', 'desc')
                    ->paginate($paginate);
                
            }

            return [
                'pagination' => [
                    'total'        => $sucursal->total(),
                    'current_page' => $sucursal->currentPage(),
                    'per_page'     => $sucursal->perPage(),
                    'last_page'    => $sucursal->lastPage(),
                    'from'         => $sucursal->firstItem(),
                    'to'           => $sucursal->lastItem(),
                ],
                'data' => $sucursal, 'response' => 1,
            ];

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $tipoempresa = $request->tipoempresa;
            $tiposucursal = $request->tiposucursal;
            $nombrecomercial = $request->nombrecomercial;
            $razonsocial = $request->razonsocial;
            $nit = $request->nit;
            $nombre = $request->nombre;
            $apellido = $request->apellido;
            $idpais = $request->idpais;
            $idciudad = $request->idciudad;
            $zona = $request->zona;
            $direccion = $request->direccion;
            $telefono = $request->telefono;
            $logotipo = $request->logotipo;

            $sucursal = new Sucursal();

            $sucursal->nombre = $nombre;
            $sucursal->apellido = $apellido;
            $sucursal->nombrecomercial = $nombrecomercial;
            $sucursal->razonsocial = $razonsocial;
            $sucursal->nit = $nit;
            $sucursal->zona = $zona;
            $sucursal->direccion = $direccion;
            $sucursal->telefono = $telefono;
            $sucursal->tipoempresa = $tipoempresa;
            $sucursal->tiposucursal = $tiposucursal;
            $sucursal->logotipourl = $logotipo;
            $sucursal->fkidpais = $idpais;
            $sucursal->fkidciudad = $idciudad;

            $sucursal->impuestoiva = 0;

            $sucursal->setConnection($connection);
            $sucursal->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto una sucursal ' . $sucursal->idsucursal;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $suc = new Sucursal();
            $suc->setConnection($connection);
            $sucursal = $suc->find($id);

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            
            $ciudad = $ciu->where('idciudad', '<>', '1')->orderBy('idciudad', 'ASC')->get();

            return response()->json([
                'response' => 1,
                'sucursal' => $sucursal,
                'ciudad' => $ciudad,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function update(Request $request)
    {
        
        try {
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $tipoempresa = $request->tipoempresa;
            $tiposucursal = $request->tiposucursal;
            $nombrecomercial = $request->nombrecomercial;
            $razonsocial = $request->razonsocial;
            $nit = $request->nit;
            $nombre = $request->nombre;
            $apellido = $request->apellido;
            $idpais = $request->idpais;
            $idciudad = $request->idciudad;
            $zona = $request->zona;
            $direccion = $request->direccion;
            $telefono = $request->telefono;
            $logotipo = $request->logotipo;
            $id = $request->id;

            $suc = new Sucursal();
            $suc->setConnection($connection);
            $sucursal = $suc->find($id);

            $sucursal->nombre = $nombre;
            $sucursal->apellido = $apellido;
            $sucursal->nombrecomercial = $nombrecomercial;
            $sucursal->razonsocial = $razonsocial;
            $sucursal->nit = $nit;
            $sucursal->zona = $zona;
            $sucursal->direccion = $direccion;
            $sucursal->telefono = $telefono;
            $sucursal->tipoempresa = $tipoempresa;
            $sucursal->tiposucursal = $tiposucursal;
            $sucursal->logotipourl = $logotipo;
            $sucursal->fkidpais = $idpais;
            $sucursal->fkidciudad = $idciudad;

            $sucursal->setConnection($connection);
            $sucursal->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito una sucursal ' . $sucursal->idsucursal;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $suc = new Sucursal();
            $suc->setConnection($connection);
            $sucursal = $suc->findOrfail($id);
            $almacen = $sucursal->almacenes;
            if ($almacen->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar la sucursal porque ya se encuentra en un almacen"
                ]);
            }
            $venta = $sucursal->ventas;
            if($venta->count() > 0){
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar la sucursal porque ya se encuentra en una venta"
                ]);
            }
            $sucursal->setConnection($connection);
            $sucursal->delete();

            $sucursales = $suc->orderBy('idsucursal', 'ASC')->paginate(10);
            $data = $sucursales->getCollection();
            $pagination = array(
                "total" => $sucursales->total(),
                "current_page" => $sucursales->currentPage(),
                "per_page" => $sucursales->perPage(),
                "last_page" => $sucursales->lastPage(),
                "first" => $sucursales->firstItem(),
                "last" =>   $sucursales->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino una sucursal ' . $sucursal->idsucursal;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function searchData(Request $request, $buscar){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $suc = new Sucursal();
            $suc->setConnection($connection);
            $sucursalBuscar = $suc->where('idsucursal','ilike','%'.$buscar.'%')
                                ->orwhere('nombre','ilike','%'.$buscar.'%')
                                ->orwhere('direccion','ilike','%'.$buscar.'%')
                                ->paginate(10);
            $data = $sucursalBuscar->getCollection();
            $pagination = array(
                'total' => $sucursalBuscar->total(),
                'current_page' => $sucursalBuscar->currentPage(),
                'per_page' => $sucursalBuscar->perPage(),
                'last_page' => $sucursalBuscar->lastPage(),
                'first' => $sucursalBuscar->firstItem(),
                'last' =>   $sucursalBuscar->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function changeSizePagination(Request $request, $cantidadPagina){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $suc = new Sucursal();
            $suc->setConnection($connection);

            $sucursales = $suc->orderBy('idsucursal', 'ASC')->paginate($cantidadPagina);
            $data = $sucursales->getCollection();
            $pagination = array(
                'total' => $sucursales->total(),
                'current_page' => $sucursales->currentPage(),
                'per_page' => $sucursales->perPage(),
                'last_page' => $sucursales->lastPage(),
                'first' => $sucursales->firstItem(),
                'last' =>   $sucursales->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function get_almacen(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $idsucursal = $request->input('idsucursal');

            $alm = new Almacen();
            $alm->setConnection($connection);
            $almacen = $alm->where('fkidsucursal', '=', $idsucursal)
                ->orderBy('idalmacen', 'asc')->get();

            return [
                'response' => 1,
                'almacen' => $almacen,
            ];

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
}
