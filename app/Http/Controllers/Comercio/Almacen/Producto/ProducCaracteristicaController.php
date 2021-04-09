<?php

namespace App\Http\Controllers\Comercio\Almacen\Producto;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\Producto\ProductoCaracteristica;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class ProducCaracteristicaController extends Controller
{
    public function index(Request $request)
    {
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));

        //     $prodc = new ProductoCaracteristica();
        //     $prodc->setConnection($connection);
        //     $data = $prodc->get();
        //     return response()->json([
        //         "response" => 1,
        //         "data" => $data
        //     ]);
        // } catch (DecryptException $e) {
        //     return response()->json([
        //         'response' => -3,
        //         'message' => 'Vuelva a iniciar sesion'
        //     ]);
        // } catch (\Throwable $th) {
        //     return response()->json([
        //         'response' => -1,
        //         'message' => 'Error en el servidor'
        //     ]);
        // }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $productoCaracteristicas = new ProductoCaracteristica();
            $productoCaracteristicas->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $productoCaracteristicas->select('produccaracteristica.idproduccaracteristica', 'produccaracteristica.caracteristica')
                    ->orWhere('produccaracteristica.idproduccaracteristica', 'LIKE', "%$request->buscar%")
                    ->orWhere('produccaracteristica.caracteristica', 'ILIKE', "%$request->buscar%")
                    ->orderBy('produccaracteristica.idproduccaracteristica', 'asc')
                    ->paginate($paginate);
            } else {
                $datos = $productoCaracteristicas->select('produccaracteristica.idproduccaracteristica', 'produccaracteristica.caracteristica')
                    ->orderBy('produccaracteristica.idproduccaracteristica', 'asc')
                    ->paginate($paginate);
            }
            $datosCaracteristicaProductos = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $datosCaracteristicaProductos
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
                'message' => 'No se pudo obtener los productos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function get_data(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $buscar = $request->buscar;
            $paginacion = $request->pagina;

            $prodc = new ProductoCaracteristica();
            $prodc->setConnection($connection);
            if ($buscar == '') {

                $data = $prodc->orderBy('idproduccaracteristica', 'desc')
                            ->paginate($paginacion);

            } else {
                $data = $prodc->where('caracteristica', 'ilike', '%'.$buscar.'%')
                            ->orderBy('idproduccaracteristica', 'desc')
                            ->paginate($paginacion);

            }

            return [
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],
                'data' => $data, 'pagina' => $paginacion, 'buscar' => $buscar
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

    public function create()
    {
        return view('commerce::create');
    }

    public function store(Request $request)
    {
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));

        //     $caracteristica = $request->descripcion;
        //     $data = new ProductoCaracteristica();
        //     $data->caracteristica = $caracteristica;
        //     $data->setConnection($connection);
        //     $data->save();

        //     $log = new Log();
        //     $log->setConnection($connection);
        //     $accion = 'Inserto el produccaracteristica ' . $data->idproduccaracteristica;
        //     $log->guardar($request, $accion);

        //     return response()->json([
        //         'response' => 1,
        //     ]);

        // } catch (DecryptException $e) {
        //     return response()->json([
        //         'response' => -3,
        //         'message' => 'Vuelva a iniciar sesion'
        //     ]);
        // } catch (\Throwable $th) {
        //     return response()->json([
        //         'response' => -1,
        //         'message' => 'Error en el servidor'
        //     ]);
        // }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $caracProd = new ProductoCaracteristica();
            $caracProd->setConnection($connection);
            $caracteristica = $request->caracteristica;
            $caracteristicaProducto = new ProductoCaracteristica();
            $caracteristicaProducto->caracteristica = $caracteristica;
            $caracteristicaProducto->setConnection($connection);
            $caracteristicaProducto->save();
            $caracteristicasProdcutos = $caracProd->orderBy('idproduccaracteristica', 'ASC')->paginate(10);
            $data = $caracteristicasProdcutos->getCollection();
            $pagination = array(
                "total" => $caracteristicasProdcutos->total(),
                "current_page" => $caracteristicasProdcutos->currentPage(),
                "per_page" => $caracteristicasProdcutos->perPage(),
                "last_page" => $caracteristicasProdcutos->lastPage(),
                "first" => $caracteristicasProdcutos->firstItem(),
                "last" =>   $caracteristicasProdcutos->lastItem()
            );
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto una nueva caracteristica de producto ' . $caracteristicaProducto->idproduccaracteristica;
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

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $caracProd = new ProductoCaracteristica();
            $caracProd->setConnection($connection);
            $caracteristicaProducto = $caracProd->find($id);
            if ($caracteristicaProducto == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            return response()->json([
                'response' => 1,
                'data' => $caracteristicaProducto
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
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));

        //     $prodc = new ProductoCaracteristica();
        //     $prodc->setConnection($connection);

        //     $caracteristica = $request->descripcion;
        //     $id = $request->id;

        //     $data = $prodc->find($id);
        //     $data->caracteristica = $caracteristica;
        //     $data->setConnection($connection);
        //     $data->update();

        //     $log = new Log();
        //     $log->setConnection($connection);
        //     $accion = 'Edito el produccaracteristica ' . $data->idproduccaracteristica;
        //     $log->guardar($request, $accion);

        //     return response()->json([
        //         'response' => 1,
        //     ]);

        // } catch (DecryptException $e) {
        //     return response()->json([
        //         'response' => -3,
        //         'message' => 'Vuelva a iniciar sesion'
        //     ]);
        // } catch (\Throwable $th) {
        //     return response()->json([
        //         'response' => -1,
        //         'message' => 'Error al procesar la solicitud'
        //     ]);
        // }

        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $caracProd = new ProductoCaracteristica();
            $caracProd->setConnection($connection);
            $caracteristicaProducto = $caracProd->find($id);
            if ($caracteristicaProducto == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            $caracteristicaProducto->caracteristica = $request->caracteristica;
            $caracteristicaProducto->setConnection($connection);
            $caracteristicaProducto->update();
            $caracteristicasProdcutos = $caracProd->orderBy('idproduccaracteristica', 'ASC')->paginate(10);
            $data = $caracteristicasProdcutos->getCollection();
            $pagination = array(
                "total" => $caracteristicasProdcutos->total(),
                "current_page" => $caracteristicasProdcutos->currentPage(),
                "per_page" => $caracteristicasProdcutos->perPage(),
                "last_page" => $caracteristicasProdcutos->lastPage(),
                "first" => $caracteristicasProdcutos->firstItem(),
                "last" =>   $caracteristicasProdcutos->lastItem()
            );
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito una unidad de medida ' . $caracteristicaProducto->idproduccaracteristica;
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

    public function destroy(Request $request, $id)
    {
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));

        //     $prodc = new ProductoCaracteristica();
        //     $prodc->setConnection($connection);

        //     $id = $request->id;

        //     $count = DB::connection($connection)
        //                 ->table('produccaracteristica as p')
        //                 ->join('prodcaracdetalle as d', 'p.idproduccaracteristica', '=', 'd.fkidproduccaracteristica')
        //                 ->where('p.idproduccaracteristica', '=', $id)
        //                 ->whereNull('p.deleted_at')
        //                 ->whereNull('d.deleted_at')
        //                 ->get();

        //     if (sizeof($count) > 0) {
        //         return response()->json([
        //             'response' => 0,
        //         ]);
        //     }

        //     $data = $prodc->find($id);
        //     $data->setConnection($connection);
        //     $data->delete();

        //     $log = new Log();
        //     $log->setConnection($connection);
        //     $accion = 'Elimino el produccaracteristica ' . $data->idproduccaracteristica;
        //     $log->guardar($request, $accion);

        //     return response()->json([
        //         'response' => 1,
        //     ]);

        // } catch (DecryptException $e) {
        //     return response()->json([
        //         'response' => -3,
        //         'message' => 'Vuelva a iniciar sesion'
        //     ]);
        // } catch (\Throwable $th) {
        //     return response()->json([
        //         'response' => -1,
        //         'message' => 'Error al procesar la solicitud'
        //     ]);
        // }        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $caracProd = new ProductoCaracteristica();
            $caracProd->setConnection($connection);
            $caracteristicaProducto = $caracProd->findOrfail($id);
            $id = $request->id;
            $count = DB::connection($connection)
                ->table('produccaracteristica as p')
                ->join('prodcaracdetalle as d', 'p.idproduccaracteristica', '=', 'd.fkidproduccaracteristica')
                ->where('p.idproduccaracteristica', '=', $id)
                ->whereNull('p.deleted_at')
                ->whereNull('d.deleted_at')
                ->get();
            if (sizeof($count) > 0) {
                return response()->json([
                    'response' => 0,
                ]);
            }
            $caracteristicaProducto->delete();
            $caracteristicasProdcutos = $caracProd->orderBy('idproduccaracteristica', 'ASC')->paginate(10);
            $data = $caracteristicasProdcutos->getCollection();
            $pagination = array(
                "total" => $caracteristicasProdcutos->total(),
                "current_page" => $caracteristicasProdcutos->currentPage(),
                "per_page" => $caracteristicasProdcutos->perPage(),
                "last_page" => $caracteristicasProdcutos->lastPage(),
                "first" => $caracteristicasProdcutos->firstItem(),
                "last" =>   $caracteristicasProdcutos->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la caracteristica del producto ' . $caracteristicaProducto->idproduccaracteristica;
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
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
}
