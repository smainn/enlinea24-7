<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\IngresoSalidaTraspasoTipo;
use App\Models\Comercio\Almacen\Producto\IngresoProducto;
use App\Models\Comercio\Almacen\Producto\SalidaProducto;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;

class IngrSalTrasTipoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $data = $instipo->where('estado', 'A')->get();
            $ing = new IngresoProducto();
            $ing->setConnection($connection);
            $cant = $ing->all();

            $sal = new SalidaProducto();
            $sal->setConnection($connection);
            $salidas = $sal->all();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'cantidad' => sizeof($cant) + 1,
                'salidas' => sizeof($salidas) + 1
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
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    public function create()
    {
        return view('commerce::create');
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function getTipoTraspasos(Request $request){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $tipoTraspasos = $instipo->orderBy('idingresosalidatrastipo', 'ASC')->paginate(10);
            $data = $tipoTraspasos->getCollection();
            $pagination = array(
                "total" => $tipoTraspasos->total(),
                "current_page" => $tipoTraspasos->currentPage(),
                "per_page" => $tipoTraspasos->perPage(),
                "last_page" => $tipoTraspasos->lastPage(),
                "first" => $tipoTraspasos->firstItem(),
                "last" =>   $tipoTraspasos->lastItem()
            );
            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data
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

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $descripcion = $request->descripcion;
            $tipoTraspaso = new IngresoSalidaTraspasoTipo();
            $tipoTraspaso->descripcion = $descripcion;
            $tipoTraspaso->setConnection($connection);
            $tipoTraspaso->save();
            $tipoTraspasos = $instipo->orderBy('idingresosalidatrastipo', 'ASC')->where('estado', 'A')->paginate(10);
            $data = $tipoTraspasos->getCollection();
            $pagination = array(
                "total" => $tipoTraspasos->total(),
                "current_page" => $tipoTraspasos->currentPage(),
                "per_page" => $tipoTraspasos->perPage(),
                "last_page" => $tipoTraspasos->lastPage(),
                "first" => $tipoTraspasos->firstItem(),
                "last" =>   $tipoTraspasos->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto un tipo de salida transapaso ' . $tipoTraspaso->idingresosalidatrastipo;
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

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $tipoTraspaso = $instipo->find($id);
            if ($tipoTraspaso == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            return response()->json([
                'response' => 1,
                'data' => $tipoTraspaso
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

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $tipoTraspaso = $instipo->find($id);
            if ($tipoTraspaso == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            $tipoTraspaso->descripcion = $request->descripcion;
            $tipoTraspaso->estado = $request->estado;
            $tipoTraspaso->setConnection($connection);
            $tipoTraspaso->update();
            $tipoTraspasos = $instipo->orderBy('idingresosalidatrastipo', 'ASC')->paginate(10);
            $data = $tipoTraspasos->getCollection();
            $pagination = array(
                "total" => $tipoTraspasos->total(),
                "current_page" => $tipoTraspasos->currentPage(),
                "per_page" => $tipoTraspasos->perPage(),
                "last_page" => $tipoTraspasos->lastPage(),
                "first" => $tipoTraspasos->firstItem(),
                "last" =>   $tipoTraspasos->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito un tipo de salida transapaso ' . $tipoTraspaso->idingresosalidatrastipo;
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

    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $tipoTraspaso = $instipo->findOrfail($id);
            $salidaProducto = $tipoTraspaso->salidaProductos;
            if ($salidaProducto->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar el tipo de traspaso porque ya se encuentra en uso"
                ]);
            }
            $ingresoProducto = $tipoTraspaso->ingresoProductos;
            if($ingresoProducto->count() > 0){
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar el tipo de traspaso porque ya se encuentra en uso"
                ]);
            }
            $traspasoProducto = $tipoTraspaso->traspasoProductos;
            if($traspasoProducto->count() > 0){
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar el tipo de traspaso porque ya se encuentra en uso"
                ]);
            }
            $tipoTraspaso->delete();
            $tipoTraspasos = $instipo->orderBy('idingresosalidatrastipo', 'ASC')->paginate(10);
            $data = $tipoTraspasos->getCollection();
            $pagination = array(
                "total" => $tipoTraspasos->total(),
                "current_page" => $tipoTraspasos->currentPage(),
                "per_page" => $tipoTraspasos->perPage(),
                "last_page" => $tipoTraspasos->lastPage(),
                "first" => $tipoTraspasos->firstItem(),
                "last" =>   $tipoTraspasos->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino un tipo de salida transapaso ' . $tipoTraspaso->idingresosalidatrastipo;
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

    public function searchData(Request $request, $buscar) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $tipoTraspasoBuscar = $instipo->where('idingresosalidatrastipo','ilike','%'.$buscar.'%')
                                        ->orwhere('descripcion','ilike','%'.$buscar.'%')
                                        ->paginate(10);
            $data = $tipoTraspasoBuscar->getCollection();
            $pagination = array(
                'total' => $tipoTraspasoBuscar->total(),
                'current_page' => $tipoTraspasoBuscar->currentPage(),
                'per_page' => $tipoTraspasoBuscar->perPage(),
                'last_page' => $tipoTraspasoBuscar->lastPage(),
                'first' => $tipoTraspasoBuscar->firstItem(),
                'last' =>   $tipoTraspasoBuscar->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
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

    public function changeSizePagination(Request $request, $cantidadPagina){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $instipo = new IngresoSalidaTraspasoTipo();
            $instipo->setConnection($connection);

            $tipoTraspasos = $instipo->orderBy('idingresosalidatrastipo', 'ASC')->paginate($cantidadPagina);
            $data = $tipoTraspasos->getCollection();
            $pagination = array(
                'total' => $tipoTraspasos->total(),
                'current_page' => $tipoTraspasos->currentPage(),
                'per_page' => $tipoTraspasos->perPage(),
                'last_page' => $tipoTraspasos->lastPage(),
                'first' => $tipoTraspasos->firstItem(),
                'last' =>   $tipoTraspasos->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
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
}
