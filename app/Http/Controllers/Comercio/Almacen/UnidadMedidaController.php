<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\UnidadMedida;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;

class UnidadMedidaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $uni = new UnidadMedida();
            $uni->setConnection($connection);

            $data = $uni->get();
            return response()->json(['response' => 1, 'data' => $data]);
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

    public function create()
    {
        return view('commerce::create');
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function getUnidadesMedida(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $uni = new UnidadMedida();
            $uni->setConnection($connection);

            $unidadesMedida = $uni->orderBy('idunidadmedida', 'ASC')->paginate(10);
            $data = $unidadesMedida->getCollection();
            $pagination = array(
                "total" => $unidadesMedida->total(),
                "current_page" => $unidadesMedida->currentPage(),
                "per_page" => $unidadesMedida->perPage(),
                "last_page" => $unidadesMedida->lastPage(),
                "first" => $unidadesMedida->firstItem(),
                "last" =>   $unidadesMedida->lastItem()
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
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $uni = new UnidadMedida();
            $uni->setConnection($connection);

            $descripcion = $request->descripcion;
            $abreviacion = $request->abreviacion;
            $unidadMedida = new UnidadMedida();
            $unidadMedida->descripcion = $descripcion;
            $unidadMedida->abreviacion = $abreviacion;
            $unidadMedida->setConnection($connection);
            $unidadMedida->save();

            $unidadesMedida = $uni->orderBy('idunidadmedida', 'ASC')->paginate(10);
            $data = $unidadesMedida->getCollection();
            $pagination = array(
                "total" => $unidadesMedida->total(),
                "current_page" => $unidadesMedida->currentPage(),
                "per_page" => $unidadesMedida->perPage(),
                "last_page" => $unidadesMedida->lastPage(),
                "first" => $unidadesMedida->firstItem(),
                "last" =>   $unidadesMedida->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto una unidad de medida ' . $unidadMedida->idunidadmedida;
            $log->guardar($request, $accion);

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

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $uni = new UnidadMedida();
            $uni->setConnection($connection);

            $unidadMedida = $uni->find($id);
            if ($unidadMedida == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            return response()->json([
                'response' => 1,
                'data' => $unidadMedida
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
            $uni = new UnidadMedida();
            $uni->setConnection($connection);

            $unidadMedida = $uni->find($id);
            if ($unidadMedida == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            $unidadMedida->descripcion = $request->descripcion;
            $unidadMedida->abreviacion = $request->abreviacion;
            $unidadMedida->setConnection($connection);
            $unidadMedida->update();
            $unidadesMedida = $uni->orderBy('idunidadmedida', 'ASC')->paginate(10);
            $data = $unidadesMedida->getCollection();
            $pagination = array(
                "total" => $unidadesMedida->total(),
                "current_page" => $unidadesMedida->currentPage(),
                "per_page" => $unidadesMedida->perPage(),
                "last_page" => $unidadesMedida->lastPage(),
                "first" => $unidadesMedida->firstItem(),
                "last" =>   $unidadesMedida->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito una unidad de medida ' . $unidadMedida->idunidadmedida;
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
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $uni = new UnidadMedida();
            $uni->setConnection($connection);
            $unidadMedida = $uni->find($id);
            if ($unidadMedida == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'La unidad de medida no existe'
                ]);
            }
            //$producto = $unidadMedida->productos;
            $prod = new Producto();
            $prod->setConnection($connection);
            $producto = $prod->where('fkidunidadmedida', $id)->get();
            if ($producto->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar la unidad de medida porque ya se encuentra en uso"
                ]);
            }
            $unidadMedida->delete();
            $unidadesMedida = $uni->orderBy('idunidadmedida', 'ASC')->paginate(10);
            $data = $unidadesMedida->getCollection();
            $pagination = array(
                "total" => $unidadesMedida->total(),
                "current_page" => $unidadesMedida->currentPage(),
                "per_page" => $unidadesMedida->perPage(),
                "last_page" => $unidadesMedida->lastPage(),
                "first" => $unidadesMedida->firstItem(),
                "last" =>   $unidadesMedida->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino una unidad de medida ' . $unidadMedida->idunidadmedida;
            $log->guardar($request, $accion);
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

    public function searchData(Request $request, $buscar) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $uni = new UnidadMedida();
            $uni->setConnection($connection);

            $unidadMedidaBuscar = $uni->where('idunidadmedida','ilike','%'.$buscar.'%')
                                    ->orwhere('descripcion','ilike','%'.$buscar.'%')
                                    ->orwhere('abreviacion','ilike','%'.$buscar.'%')
                                    ->paginate(10);
            $data = $unidadMedidaBuscar->getCollection();
            $pagination = array(
                'total' => $unidadMedidaBuscar->total(),
                'current_page' => $unidadMedidaBuscar->currentPage(),
                'per_page' => $unidadMedidaBuscar->perPage(),
                'last_page' => $unidadMedidaBuscar->lastPage(),
                'first' => $unidadMedidaBuscar->firstItem(),
                'last' =>   $unidadMedidaBuscar->lastItem()
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

    public function changeSizePagination(Request $request, $cantidadPagina) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $uni = new UnidadMedida();
            $uni->setConnection($connection);

            $unidadesMedida = $uni->orderBy('idunidadmedida', 'ASC')->paginate($cantidadPagina);
            $data = $unidadesMedida->getCollection();
            $pagination = array(
                'total' => $unidadesMedida->total(),
                'current_page' => $unidadesMedida->currentPage(),
                'per_page' => $unidadesMedida->perPage(),
                'last_page' => $unidadesMedida->lastPage(),
                'first' => $unidadesMedida->firstItem(),
                'last' =>   $unidadesMedida->lastItem()
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
