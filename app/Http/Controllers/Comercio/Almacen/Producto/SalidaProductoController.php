<?php

namespace App\Http\Controllers\Comercio\Almacen\Producto;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\Producto\SalidaProducto;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Almacen\Producto\SalidaProdDetalle;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;

class SalidaProductoController extends Controller
{
    public function index(Request $request)
    {
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));
        //     $sal = new SalidaProducto();
        //     $sal->setConnection($connection);

        //     $datos = $sal->orderBy('idsalidaproducto', 'DESC')->paginate(10);
        //     $salidas = $datos->getCollection();
        //     $pagination = array(
        //         'total' => $datos->total(),
        //         'current_page' => $datos->currentPage(),
        //         'per_page' => $datos->perPage(),
        //         'last_page' => $datos->lastPage(),
        //         'first' => $datos->firstItem(),
        //         'last' =>   $datos->lastItem()
        //     );
        //     $data = array();
        //     foreach ($salidas as $row) {
        //         $row->tipo;
        //         array_push($data, $row);
        //     }

        //     return response()->json([
        //         'response' => 1,
        //         'data' => $data,
        //         'pagination' => $pagination
        //     ]);

        // } catch (DecryptException $e) {
        //     return response()->json([
        //         'response' => -3,
        //         'message' => 'Vuelva a iniciar sesion'
        //     ]);
        // } catch (\Throwable $th) {
        //     return response()->json([
        //         'response' => -1,
        //         'message' => 'No se pudo procesar la solicitud'
        //     ]);
        // }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $salidaProductos = new SalidaProducto();
            $salidaProductos->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $salidaProductos->leftJoin('ingresosalidatrastipo as ingSalTrasTipo', 'ingSalTrasTipo.idingresosalidatrastipo', 'salidaproducto.fkidingresosalidatrastipo')
                    ->select('salidaproducto.idsalidaproducto', 'salidaproducto.codsalidaprod', 'salidaproducto.fechahora', 'salidaproducto.fechahoratransac',
                             'salidaproducto.notas', 'salidaproducto.idusuario', 'ingSalTrasTipo.descripcion as ingsaltrastipo')
                    ->orWhere('salidaproducto.idsalidaproducto', 'LIKE', "%$request->buscar%")
                    ->orWhere('salidaproducto.codsalidaprod', 'ILIKE', "%$request->buscar%")
                    ->orWhere('salidaproducto.fechahora', 'ILIKE', "%$request->buscar%")
                    ->orWhere('salidaproducto.fechahoratransac', 'ILIKE', "%$request->buscar%")
                    ->orWhere('salidaproducto.notas', 'ILIKE', "%$request->buscar%")
                    ->orWhere('salidaproducto.idusuario', 'ILIKE', "%$request->buscar%")
                    ->orderBy('salidaproducto.idsalidaproducto', 'desc')
                    ->paginate($paginate);
            } else {
                $datos = $salidaProductos->leftJoin('ingresosalidatrastipo as ingSalTrasTipo', 'ingSalTrasTipo.idingresosalidatrastipo', 'salidaproducto.fkidingresosalidatrastipo')
                    ->select('salidaproducto.idsalidaproducto', 'salidaproducto.codsalidaprod', 'salidaproducto.fechahora', 'salidaproducto.fechahoratransac',
                             'salidaproducto.notas', 'salidaproducto.idusuario', 'ingSalTrasTipo.descripcion as ingsaltrastipo')
                    ->orderBy('salidaproducto.idsalidaproducto', 'desc')
                    ->paginate($paginate);
            }
            $salidaProductos = $datos->getCollection();
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
                'data' => $salidaProductos
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
        //return view('commerce::create');
    }

    public function store(Request $request)
    {
        if ($request->filled('idtipo') && $request->filled('fechahora')) {
            
            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));
                $sal = new SalidaProducto();
                $sal->setConnection($connection);

                //echo 'aaAAAA';
                $salidaProd = new SalidaProducto();
                $salidaProd->codsalidaprod = $request->get('codsalidaprod');
                $salidaProd->fechahora = $request->get('fechahora');
                $salidaProd->notas = $request->get('notas');
                $salidaProd->idusuario = 1;
                $salidaProd->fechahoratransac = date('Y-m-d H:i:s');
                $salidaProd->fkidingresosalidatrastipo = $request->get('idtipo');
                $salidaProd->setConnection($connection);
                $salidaProd->save();
  
                $idsProductos = json_decode($request->get('idsProductos'));
                $cantidades = json_decode($request->get('cantidades'));
                $idsAlmacenProd = json_decode($request->get('idsAlmacenProd'));
                $size = sizeof($idsAlmacenProd);

                $almpd = new AlmacenProdDetalle();
                $almpd->setConnection($connection);

                $produ = new Producto();
                $produ->setConnection($connection);
                for ($i = 0; $i < $size; $i++) {
                    $salidaDetalle = new SalidaProdDetalle();
                    $salidaDetalle->cantidad = $cantidades[$i];
                    $salidaDetalle->fkidalmacenproddetalle = $idsAlmacenProd[$i];
                    $salidaDetalle->fkidsalidaproducto = $salidaProd->idsalidaproducto;
                    $salidaDetalle->setConnection($connection);
                    $salidaDetalle->save();
                    
                    $almacenProd = $almpd->find($idsAlmacenProd[$i]);
                    $resultAlmacen = $almacenProd->stock - $cantidades[$i];
                    $producto = $produ->find($idsProductos[$i]);
                    $resultProducto = $producto->stock - $cantidades[$i];

                    if ($resultAlmacen < 0 || $resultProducto < 0) {
                        return response()->json([
                            'response' => 0,
                            'message' => 'El producto esta en cantidad cero, no se puede hacer la salida'
                        ]);
                    }
                    $producto->stock = $resultProducto;
                    $almacenProd->stock = $resultAlmacen;
                    $almacenProd->setConnection($connection);
                    $almacenProd->update();
                    $producto->setConnection($connection);
                    $producto->update();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto la salida producto ' . $salidaProd->idsalidaproducto;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se guardo correctamente'
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
                    'response' => –1,
                    'message' => 'Error al insertar',
                    'error' => [
                        'message' => $th->getMessage(),
                        'file' => $th->getFile(),
                        'line' => $th->getLine()
                    ]
                ]);
            }

        } else {
            return response()->json([
                'response' => -1,
                'message' => 'Hubo problemas al procesar la solicitud'
            ]);
        }
    }

    /**
     * Show the specified resource.
     * @return Response
     */
    public function show(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $sal = new SalidaProducto();
            $sal->setConnection($connection);

            $salidaProd = $sal->find($id);
            if ($salidaProd == null) {
                return response()->Json([
                    'response' => 0,
                    'message' => 'El elemento no existe'
                ]);
            }
            $salidaDetalle = $sal->find($id)->salidadetalles;
            $salidaProd->tipo;
            
            $data = array();
            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);
            foreach ($salidaDetalle as $row) {
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
                'salidaprod' => $salidaProd,
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
                'response' => 0,
                'message' => 'Ocurrio un problema al realizar la operacion',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    /**
     * Show the form for editing the specified resource.
     * @return Response
     */
    public function edit(Request $request, $id)
    {
        //return view('commerce::edit');
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $sal = new SalidaProducto();
            $sal->setConnection($connection);

            $salidaProd = $sal->findOrFail($id);
            $salidaDetalle = $sal->find($id)->salidadetalles;
            $data = array();

            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);
            foreach ($salidaDetalle as $row) {
                $almacenProd = $almpd->find($row->fkidalmacenproddetalle);
                $almacenProd->almacen;
                $producto = $almpd->find($row->fkidalmacenproddetalle)->producto;
                $almacenes = $producto->getAlmacenes();
                array_push(
                    $data,
                    [
                        'idsalidadetalle' => $row->idsalidaproddetalle,
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
                'salidaprod' => $salidaProd,
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
                'response' => 0,
                'message' => 'Ocurrio un problema, vuelta a intentarlo',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    /**
     * Update the specified resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function update($id, Request $request)
    {
        if ($request->filled('idtipo') && $request->filled('fechahora')) {
            //echo 'NNNN';
            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));
                $sal = new SalidaProducto();
                $sal->setConnection($connection);

                $salidaProd = $sal->findOrFail($id);
                $salidaProd->codsalidaprod = $request->get('codsalidaprod');
                $salidaProd->fechahora = $request->get('fechahora');
                $salidaProd->notas = $request->get('notas');
                $salidaProd->fechahoratransac = date('Y-m-d H:i:s');
                $salidaProd->fkidingresosalidatrastipo = $request->get('idtipo');
                $salidaProd->setConnection($connection);
                $salidaProd->update();

                $idsAlmacenProd = json_decode($request->get('idsAlmacenProd'));
                $cantidades = json_decode($request->get('cantidades'));
                $idsSalidaDetalle = json_decode($request->get('idsSalidaDet'));
                $idsProductos = json_decode($request->get('idsProductos'));

                $longitud = sizeof($idsAlmacenProd);

                $salpd = new SalidaProdDetalle();
                $salpd->setConnection($connection);

                $almpd = new AlmacenProdDetalle();
                $almpd->setConnection($connection);

                $produ = new Producto();
                $produ->setConnection($connection);
                for ($i = 0; $i < $longitud; $i++) {

                    $salidaDetalle = $salpd->find($idsSalidaDetalle[$i]);
                    //echo 'CANTIDAD ACT ' . $cantidades[$i] 
                    
                    if ($idsAlmacenProd[$i] == $salidaDetalle->fkidalmacenproddetalle) {
                        $result = $cantidades[$i] - $salidaDetalle->cantidad;
                        if ($result != 0) {
                            $almacenProd = $almpd->find($idsAlmacenProd[$i]);
                            $resultAlmacen = $almacenProd->stock - $result;
                            $producto = $produ->find($idsProductos[$i]);
                            $resultProducto = $producto->stock - $result;
                            if ($resultAlmacen < 0 || $resultProducto < 0) {
                                DB::rollback();
                                return response()->json([
                                    'response' => 0,
                                    'message' => 'El producto esta en cantidad cero, no se puede hacer la salida'
                                ]);
                            }
                            
                            $almacenProd->stock = $resultAlmacen;
                            $almacenProd->setConnection($connection);
                            $almacenProd->update();
                            $producto->stock = $resultProducto;
                            $producto->setConnection($connection);
                            $producto->update();
                        }
                    } else {

                        $almacenProd = $almpd->find($salidaDetalle->fkidalmacenproddetalle);                        
                        $almacenProd->stock = $almacenProd->stock + $salidaDetalle->cantidad;
                        $almacenProd->setConnection($connection);
                        $almacenProd->update();
                        $almacenProd = $almpd->find($idsAlmacenProd[$i]);
                        $resultAlmacen = $almacenProd->stock - $cantidades[$i];
                        if ($resultAlmacen < 0) {
                            DB::rollback();
                            return response()->json([
                                'response' => 0,
                                'message' => 'El producto esta en cantidad cero, no se puede hacer la salida'
                            ]);
                        }
                        $almacenProd->stock = $resultAlmacen;
                        $almacenProd->setConnection($connection);
                        $almacenProd->update();
                        $salidaDetalle->fkidalmacenproddetalle = $idsAlmacenProd[$i];
                    }
                    
                    $salidaDetalle->cantidad = $cantidades[$i];
                    $salidaDetalle->setConnection($connection);
                    $salidaDetalle->update();

                }
                $idsAlmacenProdNew = json_decode($request->get('idsAlmacenProdNew'));
                $idsProductosNew = json_decode($request->get('idsProductosNew'));
                $cantidadesNew = json_decode($request->get('cantidadesNew'));
                $longitud = sizeof($idsAlmacenProdNew);

                $almpd = new AlmacenProdDetalle();
                $almpd->setConnection($connection);

                $produ = new Producto();
                $produ->setConnection($connection);
                for ($i = 0; $i < $longitud; $i++) {
                    $salidaProDet = new SalidaProdDetalle();
                    $salidaProDet->cantidad = $cantidadesNew[$i];
                    $salidaProDet->fkidalmacenproddetalle = $idsAlmacenProdNew[$i];
                    $salidaProDet->fkidsalidaproducto = $id;
                    $salidaProDet->setConnection($connection);
                    $salidaProDet->save();

                    $almacenProd = $almpd->find($idsAlmacenProdNew[$i]);
                    $resultAlmacen = $almacenProd->stock - $cantidadesNew[$i];
                    

                    if ($resultAlmacen < 0) {
                        DB::rollback();
                        return response()->json([
                            'response' => 0,
                            'message' => 'No se pudo actulizar la cantidad del Almacen'
                        ]);
                    }
                    $almacenProd->stock = $resultAlmacen;
                    $almacenProd->setConnection($connection);
                    $almacenProd->update();

                    $producto = $produ->find($idsProductosNew[$i]);
                    $resultProducto = $producto->stock - $cantidadesNew[$i];
                    if ($resultProducto < 0) {
                        DB::rollback();
                        return response()->json([
                            'response' => 0,
                            'message' => 'No se pudo actulizar la cantidad del producto'
                        ]);
                    }
                    $producto->stock = $resultProducto;
                    $producto->setConnection($connection);
                    $producto->update();
                }

                $idsEliminados = json_decode($request->get('idsEliminados'));
                $longitud = sizeof($idsEliminados);

                $salpd = new SalidaProdDetalle();
                $salpd->setConnection($connection);

                for ($i = 0; $i < $longitud; $i++) {
                    $salidaDetalle = $salpd->find($idsEliminados[$i]);
                    $result = $salidaDetalle->cantidad;
                    $almacenProd = $almpd->find($salidaDetalle->fkidalmacenproddetalle);
                    $almacenProd->stock = $almacenProd->stock + $result;
                    $almacenProd->update();
                    $producto = $produ->find($almacenProd->fkidproducto);
                    $producto->stock = $producto->stock + $result;
                    $producto->setConnection($connection);
                    $producto->update();
                    $salidaDetalle->setConnection($connection);
                    $salidaDetalle->delete();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito la salida producto ' . $id;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se actualizo correctamente'
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
                    'message' => 'Ocurrio un problema al actualizar'
                ]);
            }
            

        } else {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @return Response
     */
    public function destroy(Request $request, $id)
    {   
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $sal = new SalidaProducto();
            $sal->setConnection($connection);

            $salidaProd = $sal->find($id);
            if ($salidaProd == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El elemento no existe'
                ]);
            }
            $salidaDetalle = $salidaProd->salidadetalles;
            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);

            $produ = new Producto();
            $produ->setConnection($connection);
            foreach ($salidaDetalle as $row) {
                $almacenProd = $almpd->find($row->fkidalmacenproddetalle);
                $almacenProd->stock = $almacenProd->stock +  $row->cantidad;
                $almacenProd->update();
                $producto = $produ->find($almacenProd->fkidproducto);
                $producto->stock = $producto->stock + $row->cantidad;
                $producto->setConnection($connection);
                $producto->update();
                $row->setConnection($connection);
                $row->delete();
            }
            $salidaProd->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la salida producto ' . $salidaProd->idsalidaproducto;
            $log->guardar($request, $accion);

            $datos = $sal->orderBy('idsalidaproducto', 'ASC')->paginate(10);
            $salidas = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            $data = array();
            foreach ($salidas as $row) {
                $row->tipo;
                array_push($data, $row);
            }

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'Se elimino correctamente',
                'data' => $data,
                'pagination' => $pagination
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
                'message' => 'No se pudo eliminar'
            ]);
        }
        
    }

    public function validarCodigo(Request $request, $value) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $sal = new SalidaProducto();
            $sal->setConnection($connection);

            $count = $sal->where('codsalidaprod', $value)->count();
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
