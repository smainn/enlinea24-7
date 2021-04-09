<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Ventas\Cliente;
use App\Models\Comercio\Ventas\ClienteTipo;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ClienteTipoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;

            if($request->filled('buscar')) {
                $data = $clit->where('descripcion', 'ilike', '%'.$request->input('buscar').'%')
                    ->orderBy('idclientetipo', 'asc')
                    ->paginate($paginate);
            }else {
                $data = $clit->orderBy('idclientetipo', 'asc')
                    ->paginate($paginate);
            }

            $pagination = array(
                'total' => $data->total(),
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' =>   $data->lastItem()
            );

            $data = $data->getCollection();

            return response()->json([
                "response" => 1,
                "data" => $data,
                'pagination' => $pagination,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema al obtener los datos'
            ]);
        }
    }

    public function create()
    {
        return view('commerce::create');
    }

    public function getTipoClientes(Request $request) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $clit = new ClienteTipo();
            $clit->setConnection($connection);
            $tipoClientes = $clit->orderBy('idclientetipo', 'ASC')->paginate(10);
            $data = $tipoClientes->getCollection();
            $pagination = [
                "total" => $tipoClientes->total(),
                "current_page" => $tipoClientes->currentPage(),
                "per_page" => $tipoClientes->perPage(),
                "last_page" => $tipoClientes->lastPage(),
                "first" => $tipoClientes->firstItem(),
                "last" =>   $tipoClientes->lastItem()
            ];
            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data
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

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $nombre = $request->descripcion;
            $tipoDescripcion = new ClienteTipo();
            $tipoDescripcion->descripcion = $nombre;
            $tipoDescripcion->setConnection($connection);
            $tipoDescripcion->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el clientetipo ' . $tipoDescripcion->idclientetipo;
            $log->guardar($request, $accion);

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $data = $clit->orderBy('idclientetipo', 'asc')
                ->paginate(10);

            $pagination = array(
                'total' => $data->total(),
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' =>   $data->lastItem()
            );

            $data = $data->getCollection();

            DB::commit();

            return response()->json([
                "response" => 1,
                "data" => $data,
                'pagination' => $pagination,
            ]);
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $tipoCliente = $clit->find($id);

            if ($tipoCliente == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }

            return response()->json([
                'response' => 1,
                'data' => $tipoCliente
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

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $tipoCliente = $clit->find($id);

            if ($tipoCliente == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }

            $tipoCliente->descripcion = $request->get('descripcion');
            $tipoCliente->setConnection($connection);
            $tipoCliente->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Editar el clientetipo ' . $tipoCliente->idclientetipo;
            $log->guardar($request, $accion);

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $data = $clit->orderBy('idclientetipo', 'asc')
                ->paginate(10);

            $pagination = array(
                'total' => $data->total(),
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' =>   $data->lastItem()
            );

            $data = $data->getCollection();

            DB::commit();

            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data,
            ]);
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $tipoCliente = $clit->find($id);
            $cliente = $tipoCliente->clientes;

            if ($cliente->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar tipo de cliente porque ya se encuentra en uso"
                ]);
            }

            $tipoCliente->setConnection($connection);
            $tipoCliente->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el clientetipo ' . $tipoCliente->idclientetipo;
            $log->guardar($request, $accion);

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $data = $clit->orderBy('idclientetipo', 'asc')
                ->paginate(10);

            $pagination = array(
                'total' => $data->total(),
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'last_page' => $data->lastPage(),
                'from' => $data->firstItem(),
                'to' =>   $data->lastItem()
            );

            $data = $data->getCollection();

            DB::commit();

            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data,
            ]);
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function searchData(Request $request, $buscar){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $tipoClienteBuscar = $clit->where('idclientetipo','ilike','%'.$buscar.'%')
                                    ->orwhere('descripcion','ilike','%'.$buscar.'%')
                                    ->paginate(10);
            $data = $tipoClienteBuscar->getCollection();
            $pagination = array(
                'total' => $tipoClienteBuscar->total(),
                'current_page' => $tipoClienteBuscar->currentPage(),
                'per_page' => $tipoClienteBuscar->perPage(),
                'last_page' => $tipoClienteBuscar->lastPage(),
                'first' => $tipoClienteBuscar->firstItem(),
                'last' =>   $tipoClienteBuscar->lastItem()
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

            $clit = new ClienteTipo();
            $clit->setConnection($connection);

            $tipoClientes = $clit->orderBy('idclientetipo', 'ASC')->paginate($cantidadPagina);
            $data = $tipoClientes->getCollection();
            $pagination = array(
                'total' => $tipoClientes->total(),
                'current_page' => $tipoClientes->currentPage(),
                'per_page' => $tipoClientes->perPage(),
                'last_page' => $tipoClientes->lastPage(),
                'first' => $tipoClientes->firstItem(),
                'last' =>   $tipoClientes->lastItem()
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
}
