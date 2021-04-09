<?php

namespace App\Http\Controllers\Comercio\Almacen\Producto;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\Producto\IngresoProducto;
use App\Models\Comercio\Almacen\Producto\IngresoProdDetalle;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;

class IngresoProductoController extends Controller
{
    public function index(Request $request)
    {
        //return view('commerce::index');
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));
        //     $ing = new IngresoProducto();
        //     $ing->setConnection($connection);

        //     $collection = $ing->orderBy('idingresoproducto', 'DESC')->paginate(10);
        //     $data = $collection->getCollection();
        //     $pagination = array(
        //         "total" => $collection->total(),
        //         "current_page" => $collection->currentPage(),
        //         "per_page" => $collection->perPage(),
        //         "last_page" => $collection->lastPage(),
        //         "first" => $collection->firstItem(),
        //         "last" =>   $collection->lastItem()
        //     );
        //     $datos = array();
        //     foreach ($data as $row) {
        //         $row->tipo;
        //         array_push($datos, $row);
        //     }
        //     return response()->json([
        //         "response" => 1,
        //         "data" => $datos,
        //         "pagination" => $pagination
        //     ]);
        // } catch (DecryptException $e) {
        //     return response()->json([
        //         'response' => -3,
        //         'message' => 'Vuelva a iniciar sesion'
        //     ]);
        // } catch (\Throwable $th) {
        //     return response()->json([
        //         'response' => 0,
        //         'message' => 'Ocurrio un error al conectarse a la base de datos'
        //     ]);
        // }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $ingresoProductos = new IngresoProducto();
            $ingresoProductos->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $ingresoProductos->leftJoin('ingresosalidatrastipo as ingSalTrasTipo', 'ingSalTrasTipo.idingresosalidatrastipo', 'ingresoproducto.fkidingresosalidatrastipo')
                    ->select('ingresoproducto.idingresoproducto', 'ingresoproducto.codingresoprod', 'ingresoproducto.fechahora', 'ingresoproducto.fechahoratransac',
                             'ingresoproducto.notas', 'ingresoproducto.idusuario', 'ingSalTrasTipo.descripcion as ingsaltrastipo')
                    ->orWhere('ingresoproducto.idingresoproducto', 'LIKE', "%$request->buscar%")
                    ->orWhere('ingresoproducto.codingresoprod', 'ILIKE', "%$request->buscar%")
                    ->orWhere('ingresoproducto.fechahora', 'ILIKE', "%$request->buscar%")
                    ->orWhere('ingresoproducto.fechahoratransac', 'ILIKE', "%$request->buscar%")
                    ->orWhere('ingresoproducto.notas', 'ILIKE', "%$request->buscar%")
                    ->orWhere('ingresoproducto.idusuario', 'ILIKE', "%$request->buscar%")
                    ->orderBy('ingresoproducto.idingresoproducto', 'desc')
                    ->paginate($paginate);
            } else {
                $datos = $ingresoProductos->leftJoin('ingresosalidatrastipo as ingSalTrasTipo', 'ingSalTrasTipo.idingresosalidatrastipo', 'ingresoproducto.fkidingresosalidatrastipo')
                    ->select('ingresoproducto.idingresoproducto', 'ingresoproducto.codingresoprod', 'ingresoproducto.fechahora', 'ingresoproducto.fechahoratransac',
                             'ingresoproducto.notas', 'ingresoproducto.idusuario', 'ingSalTrasTipo.descripcion as ingsaltrastipo')
                    ->orderBy('ingresoproducto.idingresoproducto', 'desc')
                    ->paginate($paginate);
            }
            $datosIngresoProductos = $datos->getCollection();
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
                'data' => $datosIngresoProductos
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

    public function create()
    {
        return view('commerce::create');
    }

    public function store(Request $request)
    {
        if ($request->filled('idtipo') && $request->filled('fechahora')) {
            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));
                $ing = new IngresoProducto();
                $ing->setConnection($connection);

                $ingresoProd = new IngresoProducto();
                $ingresoProd->setConnection($connection);
                $ingresoProd->codingresoprod = $request->get('codingresoprod');
                $ingresoProd->fechahora = $request->get('fechahora');
                $ingresoProd->notas = $request->get('notas');
                $ingresoProd->idusuario = 1;
                $ingresoProd->fechahoratransac = date('Y-m-d H:i:s');
                $ingresoProd->fkidingresosalidatrastipo = $request->get('idtipo');
                $ingresoProd->save();

                //echo 'hola';
                $idsProductos = json_decode($request->get('idsProductos'));
                $cantidades = json_decode($request->get('cantidades'));
                $idsAlmacenProd = json_decode($request->get('idsAlmacenProd'));
                $size = sizeof($idsAlmacenProd);

                $almpd = new AlmacenProdDetalle();
                $almpd->setConnection($connection);

                $produ = new Producto();
                $produ->setConnection($connection);

                for ($i = 0; $i < $size; $i++) {
                    $ingresoDetalle = new IngresoProdDetalle();
                    $ingresoDetalle->setConnection($connection);
                    $ingresoDetalle->cantidad = $cantidades[$i];
                    $ingresoDetalle->fkidalmacenproddetalle = $idsAlmacenProd[$i];
                    $ingresoDetalle->fkidingresoproducto = $ingresoProd->idingresoproducto;
                    $ingresoDetalle->save();

                    $almacenProd = $almpd->find($idsAlmacenProd[$i]);
                    $almacenProd->stock = $almacenProd->stock + $cantidades[$i];
                    $almacenProd->setConnection($connection);
                    $almacenProd->update();

                    $producto = $produ->find($idsProductos[$i]);
                    $producto->stock = $producto->stock + $cantidades[$i];
                    $producto->setConnection($connection);
                    $producto->update();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto el ingreso producto ' . $ingresoProd->idingresoproducto;
                $log->guardar($request, $accion);
                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se guardo correctamente'
                ]);
            } catch (DecryptException $e) {
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelva a iniciar sesion'
                ]);
            } catch (\Throwable $th) {
                DB::rollback();
                return response()->json([
                    'response' => 0,
                    'message' => 'Error al guardar, ocurrio un problema al regisrtar'
                ]);
            }

        } else {
            return response()->json([
                'response' => -1,
                'message' => 'Hubo problemas al procesar la solicitud'
            ]);
        }
    }

    public function show(Request $request, $id)
    {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $ing = new IngresoProducto();
            $ing->setConnection($connection);

            $ingresoProd = $ing->find($id);
            if ($ingresoProd == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El elemento que busca no existe'
                ]);
            }
            $ingresoDetalle = $ing->find($id)->ingresodetalles;
            $ingresoProd->tipo;

            $data = array();

            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);
            foreach ($ingresoDetalle as $row) {
                $almacenProd = $almpd->find($row->fkidalmacenproddetalle);
                $almacen = $almacenProd->almacen;
                $producto = $almacenProd->producto;
                array_push($data,
                    [
                        'idproducto' => $producto->idproducto,
                        'descripcion' => $producto->descripcion,
                        'almacen' => $almacen->descripcion,
                        'cantidad' => $row->cantidad
                    ]
                );
            }
            return response()->json([
                'response' => 1,
                'ingresoprod' => $ingresoProd,
                'data' => $data
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => $e->getMessage()
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ourrio un problema',
                'error' => $th->getMessage()
            ]);
        }

    }

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $ing = new IngresoProducto();
            $ing->setConnection($connection);

            $ingresProd = $ing->find($id);
            if ($ingresProd == null) {
                return repsonse()->json([
                    'response' => 0,
                    'message' => 'El elemento que busca no existe'
                ]);
            }
            $ingresoDetalle = $ing->find($id)->ingresodetalles;
            $data = array();

            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);
            foreach ($ingresoDetalle as $row) {
                $almacenProd = $almpd->find($row->fkidalmacenproddetalle);
                $almacenProd->almacen;
                $producto = $almpd->find($row->fkidalmacenproddetalle)->producto;
                //$procucto->setConnection($connection);
                $almacenes = $producto->getAlmacenes();
                array_push(
                    $data,
                    [
                        'idingresodetalle' => $row->idingresoproddetalle,
                        'cantidad' => $row->cantidad,
                        'idalmacenprod' => $row->fkidalmacenproddetalle,
                        'almacenprod' => $almacenProd,
                        'producto' => $producto,
                        'almacenes' => $almacenes
                    ]
                );
            }

            return response()->json([
                'response' => 1,
                'ingresoprod' => $ingresProd,
                'data' => $data
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => $e->getMessage()
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema',
                'error' => $th->getMessage()
            ]);
        }

    }

    public function update($id, Request $request)
    {
        if ($request->filled('idtipo') && $request->filled('fechahora')) {
            //echo 'NNNN';
            DB::beginTransaction();
            //try {
                $connection = Crypt::decrypt($request->get('x_conexion'));
                $ing = new IngresoProducto();
                $ing->setConnection($connection);

                $ingresProd = $ing->find($id);
                if ($ingresProd == null) {
                    return response()->json([
                        'response' => 0,
                        'message' => 'El elemento que busca no existe'
                    ]);
                }
                $ingresProd->codingresoprod = $request->get('codingresoprod');
                $ingresProd->fechahora = $request->get('fechahora');
                $ingresProd->notas = $request->get('notas');
                $ingresProd->fechahoratransac = date('Y-m-d H:i:s');
                $ingresProd->fkidingresosalidatrastipo = $request->get('idtipo');
                $ingresProd->setConnection($connection);
                $ingresProd->update();

                $idsAlmacenProd = json_decode($request->get('idsAlmacenProd'));
                $cantidades = json_decode($request->get('cantidades'));
                $idsIngresoDetalle = json_decode($request->get('idsIngresoDet'));
                $idsProductos = json_decode($request->get('idsProductos'));

                $longitud = sizeof($idsAlmacenProd);

                $ingpd = new IngresoProdDetalle();
                $ingpd->setConnection($connection);

                $almpd = new AlmacenProdDetalle();
                $almpd->setConnection($connection);

                $produ = new Producto();
                $produ->setConnection($connection);

                for ($i = 0; $i < $longitud; $i++) {

                    $ingresoDetalle = $ingpd->find($idsIngresoDetalle[$i]);
                    //echo 'CANTIDAD ACT ' . $cantidades[$i]

                    if ($idsAlmacenProd[$i] == $ingresoDetalle->fkidalmacenproddetalle) {
                        $result = $cantidades[$i] - $ingresoDetalle->cantidad;
                        if ($result != 0) {
                            $almacenProd = $almpd->find($idsAlmacenProd[$i]);
                            $resultAlmacen = $almacenProd->stock + $result;
                            $producto = $produ->find($idsProductos[$i]);
                            $resultProducto = $producto->stock + $result;
                            if ($resultAlmacen < 0 || $resultProducto < 0) {
                                DB::rollback();
                                return response()->json([
                                    'response' => 0,
                                    'message' => 'No se pudo actulizar la cantidad del producto'
                                ]);
                            }

                            $almacenProd->stock = $resultAlmacen;
                            $almacenProd->update();
                            $producto->stock = $resultProducto;
                            $producto->update();

                        }
                    } else {

                        $almacenProd = $almpd->find($ingresoDetalle->fkidalmacenproddetalle);
                        $resultAlmacen = $almacenProd->stock - $ingresoDetalle->cantidad;
                        if ($resultAlmacen < 0) {
                            DB::rollback();
                            return response()->json([
                                'response' => 0,
                                'message' => 'No se pudo actulizar la cantidad del producto'
                            ]);
                        }
                        $almacenProd->stock = $resultAlmacen;
                        $almacenProd->setConnection($connection);
                        $almacenProd->update();
                        $almacenProd = $almpd->find($idsAlmacenProd[$i]);
                        $almacenProd->stock = $almacenProd->stock + $cantidades[$i];
                        $almacenProd->setConnection($connection);
                        $almacenProd->update();
                        $ingresoDetalle->fkidalmacenproddetalle = $idsAlmacenProd[$i];
                    }

                    $ingresoDetalle->cantidad = $cantidades[$i];
                    $ingresoDetalle->setConnection($connection);
                    $ingresoDetalle->update();

                }
                $idsAlmacenProdNew = json_decode($request->get('idsAlmacenProdNew'));
                $idsProductosNew = json_decode($request->get('idsProductosNew'));
                $cantidadesNew = json_decode($request->get('cantidadesNew'));
                $longitud = sizeof($idsAlmacenProdNew);

                for ($i = 0; $i < $longitud; $i++) {
                    $ingresoProDet = new IngresoProdDetalle();
                    $ingresoProDet->cantidad = $cantidadesNew[$i];
                    $ingresoProDet->fkidalmacenproddetalle = $idsAlmacenProdNew[$i];
                    $ingresoProDet->fkidingresoproducto = $id;
                    $ingresoProDet->setConnection($connection);
                    $ingresoProDet->save();

                    $almacenProd = $almpd->find($idsAlmacenProdNew[$i]);
                    $almacenProd->stock = $almacenProd->stock + $cantidadesNew[$i];
                    $almacenProd->update();

                    $producto = $produ->find($idsProductosNew[$i]);
                    $producto->stock = $producto->stock + $cantidadesNew[$i];
                    //$producto->setConnection($connection);
                    $producto->update();
                }

                $idsEliminados = json_decode($request->get('idsEliminados'));
                $longitud = sizeof($idsEliminados);
                for ($i = 0; $i < $longitud; $i++) {
                    $ingresoDetalle = $ingpd->find($idsEliminados[$i]);
                    $result = $ingresoDetalle->cantidad;
                    $almacenProd = $almpd->find($ingresoDetalle->fkidalmacenproddetalle);
                    $resultAlmacen = $almacenProd->stock - $result;
                    $producto = $produ->find($almacenProd->fkidproducto);
                    $resultProducto = $producto->stock - $result;
                    if ($resultAlmacen < 0 || $resultProducto < 0) {
                        DB::rollback();
                        return response()->json([
                            'response' => 0,
                            'message' => 'No se pudo actulizar la cantidad del producto'
                        ]);
                    }
                    $almacenProd->stock = $resultAlmacen;
                    $almacenProd->update();
                    $producto->stock = $resultProducto;
                    $producto->update();
                    $ingresoDetalle->delete();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito el ingreso producto ' . $ingresProd->idingresoproducto;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se actualizo correctamente'
                ]);
            /*} catch (DecryptException $e) {
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelva a iniciar sesion'
                ]);
            } catch (\Throwable $th) {
                DB::rollback();
                return response()->json([
                    'response' => 0,
                    'message' => 'No se pudo actualizar correctamente'
                ]);
            }*/


        } else {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud parametros no recibidos'
            ]);
        }
    }

    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $ing = new IngresoProducto();
            $ing->setConnection($connection);

            $ingresoProd = $ing->find($id);
            if ($ingresoProd == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El elemento a eliminar no existe'
                ]);
            }
            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);

            $produ = new Producto();
            $produ->setConnection($connection);
            $ingresoDetalle = $ingresoProd->ingresodetalles;
            foreach ($ingresoDetalle as $row) {
                $almacenProd = $almpd->find($row->fkidalmacenproddetalle);
                $resultAlmacen = $almacenProd->stock - $row->cantidad;
                $producto = $produ->find($almacenProd->fkidproducto);
                $resultProducto = $producto->stock - $row->cantidad;
                if ($resultAlmacen < 0 || $resultProducto < 0) {
                    DB::rollback();
                    return response()->json([
                        'response' => 0,
                        'message' => 'No se pudo eliminiar, un stock da negativo'
                    ]);
                }
                $producto->stock = $resultProducto;
                $producto->setConnection($connection);
                $producto->update();
                $almacenProd->stock = $resultAlmacen;
                $almacenProd->setConnection($connection);
                $almacenProd->update();
                $row->setConnection($connection);
                $row->delete();
            }
            $ingresoProd->setConnection($connection);
            $ingresoProd->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el ingreso producto ' . $id;
            $log->guardar($request, $accion);

            $collection = $ing->orderBy('idingresoproducto', 'ASC')->paginate(10);
            $data = $collection->getCollection();
            $pagination = array(
                "total" => $collection->total(),
                "current_page" => $collection->currentPage(),
                "per_page" => $collection->perPage(),
                "last_page" => $collection->lastPage(),
                "first" => $collection->firstItem(),
                "last" =>   $collection->lastItem()
            );
            $datos = array();
            foreach ($data as $row) {
                $row->tipo;
                array_push($datos, $row);
            }

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'El registro fue eliminado correctamente',
                'data' => $data,
                'pagination' => $pagination
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un error al intentar eliminar'
            ]);
        }
    }

    public function validarCodigo(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $ing = new IngresoProducto();
            $ing->setConnection($connection);

            $count = $ing->where('codingresoprod', $value)->count();
            if ($count > 0) {
                return response()->json([
                    'response' => 1,
                    'valido' => false
                ]);
            }
            return response()->json([
                'response' => 1,
                'valido' => true
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesa la solicitud'
            ]);
        }
    }
}
