<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\AlmacenUbicacion;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;

class AlmacenController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $almacenes = $alm->orderBy('idalmacen', 'ASC')->get();
            return response()->json([
                'response' => 1,
                'data' => $almacenes
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

    public function getProductos(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $productos = null;
            $almacen = $alm->find($request->idalmacen);
            if ($almacen == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El alamcen no existe'
                ]);
            }
            if ($request->cantidad == null) {
                $productos = $almacen->productos()->get();
            } else {
                $productos = $almacen->productos()->take($request->cantidad)->get();
            }
            return response()->json([
                'response' => 1,
                'data' => $productos
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

    public function create()
    {
        return view('commerce::create');
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function getAlmacenes(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $almacenes = $alm->orderBy('idalmacen', 'ASC')->paginate(10);
            $data = $almacenes->getCollection();
            $pagination = array(
                "total" => $almacenes->total(),
                "current_page" => $almacenes->currentPage(),
                "per_page" => $almacenes->perPage(),
                "last_page" => $almacenes->lastPage(),
                "first" => $almacenes->firstItem(),
                "last" =>   $almacenes->lastItem()
            );
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
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $descripcion = $request->descripcion;
            $direccion = $request->direccion;
            $notas = $request->notas;
            $sucursal = $request->idSucursal;
            $almacen = new Almacen();
            $almacen->descripcion = $descripcion;
            $almacen->direccion = $direccion;
            $almacen->notas = $notas;
            $almacen->fkidsucursal = $sucursal;
            $almacen->setConnection($connection);
            $almacen->save();
            $almacenes = $alm->orderBy('idalmacen', 'ASC')->paginate(10);
            $data = $almacenes->getCollection();
            $pagination = array(
                "total" => $almacenes->total(),
                "current_page" => $almacenes->currentPage(),
                "per_page" => $almacenes->perPage(),
                "last_page" => $almacenes->lastPage(),
                "first" => $almacenes->firstItem(),
                "last" =>   $almacenes->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto un almacen ' . $almacen->idalmacen;
            $log->guardar($request, $accion);

            DB::commit();
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
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $almacen = $alm->find($id);
            if ($almacen == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            return response()->json([
                'response' => 1,
                'data' => $almacen
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
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $almacen = $alm->find($id);

            if ($almacen == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            $almacen->descripcion = $request->descripcion;
            $almacen->direccion = $request->direccion;
            $almacen->notas = $request->notas;
            $almacen->fkidsucursal = $request->idSucursal;
            $almacen->setConnection($connection);
            $almacen->update();
            $almacenes = $alm->orderBy('idalmacen', 'ASC')->paginate(10);
            $data = $almacenes->getCollection();
            $pagination = array(
                "total" => $almacenes->total(),
                "current_page" => $almacenes->currentPage(),
                "per_page" => $almacenes->perPage(),
                "last_page" => $almacenes->lastPage(),
                "first" => $almacenes->firstItem(),
                "last" =>   $almacenes->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito un almacen ' . $almacen->idalmacen;
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
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $almacen = $alm->findOrfail($id);
            $traspasoEntrada = $almacen->traspasoEntradaProductos;
            if ($traspasoEntrada->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar el Almacen: Esta en un Traspaso de Entrada de Productos"
                ]);
            }
            $traspasoSalida = $almacen->traspasoSalidaProductos;
            if($traspasoSalida->count() > 0){
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar el Almacen: Esta en un Traspaso de Salida de Productos"
                ]);
            }
            $almacenUbicacion = $almacen->almacenUbicaciones;
            if ($almacenUbicacion->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar el Almacen: Tiene asignada una Ubicacion"
                ]);
            }
            $almacenProductoDetalle = $almacen->almacenProductoDetalles;
            if ($almacenProductoDetalle->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar el Almacen: Esta en un Detalle de Producto"
                ]);
            }
            $almacen->setConnection($connection);
            $almacen->delete();
            $almacenes = $alm->orderBy('idalmacen', 'ASC')->paginate(10);
            $data = $almacenes->getCollection();
            $pagination = array(
                "total" => $almacenes->total(),
                "current_page" => $almacenes->currentPage(),
                "per_page" => $almacenes->perPage(),
                "last_page" => $almacenes->lastPage(),
                "first" => $almacenes->firstItem(),
                "last" =>   $almacenes->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino un almacen ' . $almacen->idalmacen;
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
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function searchData(Request $request, $buscar){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $almacenBuscar = $alm->where('idalmacen','ilike','%'.$buscar.'%')
                                ->orwhere('descripcion','ilike','%'.$buscar.'%')
                                ->orwhere('direccion','ilike','%'.$buscar.'%')
                                ->orwhere('notas','ilike','%'.$buscar.'%')
                                ->paginate(10);
            $data = $almacenBuscar->getCollection();
            $pagination = array(
                'total' => $almacenBuscar->total(),
                'current_page' => $almacenBuscar->currentPage(),
                'per_page' => $almacenBuscar->perPage(),
                'last_page' => $almacenBuscar->lastPage(),
                'first' => $almacenBuscar->firstItem(),
                'last' =>   $almacenBuscar->lastItem()
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
            
            $alm = new Almacen();
            $alm->setConnection($connection);

            $almacenes = $alm->orderBy('idalmacen', 'ASC')->paginate($cantidadPagina);
            $data = $almacenes->getCollection();
            $pagination = array(
                'total' => $almacenes->total(),
                'current_page' => $almacenes->currentPage(),
                'per_page' => $almacenes->perPage(),
                'last_page' => $almacenes->lastPage(),
                'first' => $almacenes->firstItem(),
                'last' =>   $almacenes->lastItem()
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
