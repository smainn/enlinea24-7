<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\InventarioCorte;
use App\Models\Comercio\Almacen\InventarioCorteDetalle;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;

class InventarioCorteController extends Controller
{
    public function index(Request $request)
    {
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));
        //     $inv = new InventarioCorte();
        //     $inv->setConnection($connection);

        //     $datos = $inv->orderBy('idinventariocorte', 'DESC')->paginate(10);
        //     $data = $datos->getCollection();
        //     $pagination = array(
        //         'total' => $datos->total(),
        //         'current_page' => $datos->currentPage(),
        //         'per_page' => $datos->perPage(),
        //         'last_page' => $datos->lastPage(),
        //         'first' => $datos->firstItem(),
        //         'last' =>   $datos->lastItem()
        //     );
        //     return response()->json([
        //         'response' => 1,
        //         'pagination' => $pagination,
        //         'data' => $data
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
            $inventarios = new InventarioCorte();
            $inventarios->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $inventarios->select('inventariocorte.idinventariocorte', 'inventariocorte.descripcion', 'inventariocorte.fecha', 'inventariocorte.idusuario',
                    'inventariocorte.fechahoratransac', 'inventariocorte.estado', 'inventariocorte.notas')
                    ->orWhere('inventariocorte.idinventariocorte', 'LIKE', "%$request->buscar%")
                    ->orWhere('inventariocorte.descripcion', 'ILIKE', "%$request->buscar%")
                    ->orWhere('inventariocorte.fecha', 'ILIKE', "%$request->buscar%")
                    ->orWhere('inventariocorte.idusuario', 'ILIKE', "%$request->buscar%")
                    ->orWhere('inventariocorte.fechahoratransac', 'ILIKE', "%$request->buscar%")
                    ->orWhere('inventariocorte.estado', 'ILIKE', "%$request->buscar%")
                    ->orWhere('inventariocorte.notas', 'ILIKE', "%$request->buscar%")
                    ->orderBy('inventariocorte.idinventariocorte', 'asc')
                    ->paginate($paginate);
            } else {
                $datos = $inventarios->select('inventariocorte.idinventariocorte', 'inventariocorte.descripcion', 'inventariocorte.fecha', 'inventariocorte.idusuario',
                    'inventariocorte.fechahoratransac', 'inventariocorte.estado', 'inventariocorte.notas')
                ->orderBy('inventariocorte.idinventariocorte', 'asc')
                ->paginate($paginate);
            }
            $datosInventarios = $datos->getCollection();
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
                'data' => $datosInventarios
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

    private function getAlmacenProd($idalmacen, $almacenesprod) {
        $size = sizeof($almacenesprod);
        for ($i = 0; $i < $size; $i++) {
            if ($idalmacen == $almacenesprod[$i]->idalmacen) {
                return $almacenesprod[$i];
            }
        }
        return null;
    }

    private function getPos($idalmacen, $almacenesprod) {
        $size = sizeof($almacenesprod);
        for ($i = 0; $i < $size; $i++) {
            if ($idalmacen == $almacenesprod[$i]->idalmacen) {
                return $i;
            }
        }
        return -1;
    }

    public function store(Request $request) {
        if ($request->filled('descripcion') && $request->filled('fecha')) {

            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $inv = new InventarioCorte();
                $inv->setConnection($connection);

                //echo 'Inicio';
                date_default_timezone_set("America/La_Paz");
                $inventarioCorte = new InventarioCorte();
                //$inventarioCorte->codinventario = $request->codinventario;
                $inventarioCorte->descripcion = $request->descripcion;
                $inventarioCorte->fecha = $request->fecha;
                $inventarioCorte->notas = $request->notas;
                $inventarioCorte->fechahoratransac = date('Y-m-d H:i:s');
                $inventarioCorte->idusuario = 1;
                $inventarioCorte->estado = $request->estado;
                $inventarioCorte->setConnection($connection);
                $inventarioCorte->save();

                $arrayStockNuevos = json_decode($request->arrayStockNuevos);
                $arrayStocksTotales = json_decode($request->arrayStocksTotales);
                $arrayAlmacenes = json_decode($request->arrayAlmacenes);
                $productos = json_decode($request->productos);
                $selectAlmacenes = json_decode($request->selectAlmacenes);

                $size = sizeof($productos);
                for ($i = 0; $i < $size; $i++) {
                    
                    $stockNuevos = $arrayStockNuevos[$i];
                    $almacenes = $arrayAlmacenes[$i];
                    //$length = sizeof($stockNuevos);
                    $length = sizeof($selectAlmacenes);

                    $almpd = new AlmacenProdDetalle();
                    $almpd->setConnection($connection);

                    $produ = new Producto();
                    $produ->setConnection($connection);
                    for ($j = 0; $j < $length; $j++) {
                        $almacenprod = $this->getAlmacenProd($selectAlmacenes[$j], $almacenes);
                        $posAlamcen = $this->getPos($selectAlmacenes[$j], $almacenes);
                        if ($almacenprod != null) {
                            $invCorteDet = new InventarioCorteDetalle();
                            $invCorteDet->stockanterior = $almacenprod->stock;
                            $invCorteDet->stocknuevo = $stockNuevos[$posAlamcen];
                            $invCorteDet->fkidalmacenproddetalle = $almacenprod->idapd;
                            $invCorteDet->fkidinventariocorte = $inventarioCorte->idinventariocorte;
                            $invCorteDet->setConnection($connection);
                            $invCorteDet->save();
                            if ($request->estado == 'F') {
                                $idapd = $almacenprod->idapd;
                                $almacenprod = $almpd->find($idapd);
                                //$almacenprod->stock = $stockNuevos[$j];
                                $almacenprod->stock = $stockNuevos[$posAlamcen];
                                $almacenprod->setConnection($connection);
                                $almacenprod->update();
                            }   
                        } 
                    }
                    if ($request->estado == 'F') {
                        $producto = $produ->find($productos[$i]->idproducto);
                        $producto->stock = $arrayStocksTotales[$i]->nuevo;
                        $producto->setConnection($connection);
                        $producto->update();
                    }
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto el inventario corte ' . $inventarioCorte->idinventariocorte;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se guardo correctamente el corte de inventario'
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

        return response()->json([
            'response' => -1,
            'message' => 'No se recibieron los parametros necesarios'
        ]);
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Response
     */
    public function show(Request $request, $id)
    {          
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
                
            $inv = new InventarioCorte();
            $inv->setConnection($connection);

            $inventarioCorte = $inv->find($id);
            if ($inventarioCorte == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'No existe el inventario corte'
                ]);
            }

            //obtengo todos los productos que fueron seleccionados al crear el inventarioCorte
            $productos = $inv->join(
                    'inventariocortedetalle as icd', 
                    'icd.fkidinventariocorte', '=', 
                    'inventariocorte.idinventariocorte'
                )
                ->join(
                    'almacenproddetalle as apd',
                    'apd.idalmacenproddetalle', '=',
                    'icd.fkidalmacenproddetalle'
                )
                ->join(
                    'producto as p',
                    'p.idproducto', '=',
                    'apd.fkidproducto'
                )
                ->select(
                    'p.idproducto', 'p.descripcion', 'p.stock',
                    'p.codproducto', 'inventariocorte.idinventariocorte',
                    'inventariocorte.descripcion as descp', 'inventariocorte.fecha',
                    'inventariocorte.estado', 'inventariocorte.notas'
                )
                ->distinct('idproducto')
                ->where([
                    'inventariocorte.idinventariocorte' => $id
                ])
                ->get();

            $arrayAlmacenes = array();
            $descripcion = '';
            $fecha = '';
            $estado = '';
            $notas = '';                    
            foreach ($productos as $row) {
                $producto = new Producto();
                $producto->idproducto = $row['idproducto'];
                $producto->setConnection($connection);

                $almacenes = $producto->getAlmacenes(); //obtengo todos los almacenes el que se encuentra el producto
                array_push($arrayAlmacenes, $almacenes); //los coloco en un array de de arrays de almacenes de los productos
                
                //Datos del inventario corte
                $descripcion = $row['descp']; 
                $fecha = $row['fecha'];
                $estado = $row['estado'];
                $notas = $row['notas'];
            }

            //Este array contendra solos los ids de los alamcenes que fueron seleccionados en el invetario corte
            //Es para el componente multiselect
            $almacenesSelect = array(); 
            $size1 = sizeof($arrayAlmacenes);
            for ($i = 0; $i < $size1; $i++) {

                $almacenes = $arrayAlmacenes[$i];
                $size2 = sizeof($almacenes);
                for ($j = 0; $j < $size2; $j++) {
                    $result =   $inv->join(
                                    'inventariocortedetalle as icd', 
                                    'icd.fkidinventariocorte', '=', 
                                    'inventariocorte.idinventariocorte'
                                )
                                ->join(
                                    'almacenproddetalle as apd',
                                    'apd.idalmacenproddetalle', '=',
                                    'icd.fkidalmacenproddetalle'
                                )
                                ->where([
                                    'apd.idalmacenproddetalle' => $almacenes[$j]->idalmacenproddetalle,
                                    'inventariocorte.idinventariocorte' => $id 
                                ])
                                ->select(
                                    'icd.idinventariocortedetalle',
                                    'icd.stockanterior', 
                                    'icd.stocknuevo'
                                )
                                ->first();

                    if ($result != null) {
                        $almacenes[$j]->idicd = $result['idinventariocortedetalle'];
                        $almacenes[$j]->stockanterior = $result['stockanterior'];
                        $almacenes[$j]->stocknuevo = $result['stocknuevo'];
                        if (!in_array($almacenes[$j]->idalmacen, $almacenesSelect)) {
                            array_push($almacenesSelect, $almacenes[$j]->idalmacen);
                        }
                    } else {
                        $almacenes[$j]->idicd = -1;
                        $almacenes[$j]->stockanterior = 0;
                        $almacenes[$j]->stocknuevo = 0;
                    }
                    $almacenes[$j]->idapd = $almacenes[$j]->idalmacenproddetalle;

                }
                $arrayAlmacenes[$i] = $almacenes;
            }
            $obj = new Almacen();
            $obj->setConnection($connection);
            $almacenes = $obj->orderBy('idalmacen', 'ASC')->get();

            return response()->json([
                'response' => 1,
                'productos' => $productos,
                'almacenes' => $arrayAlmacenes,
                'selectAlmacenes' => $almacenesSelect,
                'descripcion' => $descripcion,
                'fecha' => $fecha,
                'estado' => $estado,
                'notas' => $notas,
                'almacenesAll' => $almacenes
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

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Response
     */
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
                
            $inv = new InventarioCorte();
            $inv->setConnection($connection);

            $productos = $inv->join(
                            'inventariocortedetalle as icd', 
                            'icd.fkidinventariocorte', '=', 
                            'inventariocorte.idinventariocorte'
                        )
                        ->join(
                            'almacenproddetalle as apd',
                            'apd.idalmacenproddetalle', '=',
                            'icd.fkidalmacenproddetalle'
                        )
                        ->join(
                            'producto as p',
                            'p.idproducto', '=',
                            'apd.fkidproducto'
                        )
                        ->select(
                            'p.idproducto', 'p.descripcion', 'p.stock',
                            'p.codproducto', 'inventariocorte.idinventariocorte',
                            'inventariocorte.descripcion as descp', 'inventariocorte.fecha',
                            'inventariocorte.estado', 'inventariocorte.notas'
                        )
                        ->distinct('idproducto')
                        ->where([
                            'inventariocorte.idinventariocorte' => $id
                        ])
                        ->get();
            if (sizeof($productos) == 0) {
                return response()->json([
                    'response' => 0,
                    'message' => 'No existe el inventario corte'
                ]);
            }

            $arrayAlmacenes = array();
            $descripcion = '';
            $fecha = '';
            $estado = ''; 
            $notas = '';                   
            foreach ($productos as $row) {
                $producto = new Producto();
                $producto->idproducto = $row['idproducto'];
                $producto->setConnection($connection);

                $almacenes = $producto->getAlmacenes();
                array_push($arrayAlmacenes, $almacenes);
                $descripcion = $row['descp'];
                $fecha = $row['fecha'];
                $estado = $row['estado'];
                $notas = $row['notas'];
            }  

            $almacenesSelect = array();
            $size1 = sizeof($arrayAlmacenes);
            for ($i = 0; $i < $size1; $i++) {

                $almacenes = $arrayAlmacenes[$i];
                $size2 = sizeof($almacenes);
                for ($j = 0; $j < $size2; $j++) {
                    $result =   $inv->join(
                                    'inventariocortedetalle as icd', 
                                    'icd.fkidinventariocorte', '=', 
                                    'inventariocorte.idinventariocorte'
                                )
                                ->join(
                                    'almacenproddetalle as apd',
                                    'apd.idalmacenproddetalle', '=',
                                    'icd.fkidalmacenproddetalle'
                                )
                                ->where([
                                    'apd.idalmacenproddetalle' => $almacenes[$j]->idalmacenproddetalle,
                                    'inventariocorte.idinventariocorte' => $id 
                                ])
                                ->select(
                                    'icd.idinventariocortedetalle',
                                    'icd.stockanterior', 
                                    'icd.stocknuevo'
                                )
                                ->first();

                    if ($result != null) {
                        $almacenes[$j]->idicd = $result['idinventariocortedetalle'];
                        $almacenes[$j]->stockanterior = $result['stockanterior'];
                        $almacenes[$j]->stocknuevo = $result['stocknuevo'];
                    } else {
                        $almacenes[$j]->idicd = -1;
                        $almacenes[$j]->stockanterior = 0;
                        $almacenes[$j]->stocknuevo = 0;
                    }
                    $almacenes[$j]->idapd = $almacenes[$j]->idalmacenproddetalle;

                    if (!in_array($almacenes[$j]->idalmacen, $almacenesSelect) && $result != null) { //ADD RESULT != NULL
                        array_push($almacenesSelect, $almacenes[$j]->idalmacen);
                    }
                }
                $arrayAlmacenes[$i] = $almacenes;
            }

            return response()->json([
                'response' => 1,
                'productos' => $productos,
                'almacenes' => $arrayAlmacenes,
                'selectAlmacenes' => $almacenesSelect,
                'descripcion' => $descripcion,
                'notas' => $notas,
                'fecha' => $fecha,
                'estado' => $estado
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

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        if ($request->filled('descripcion') && $request->filled('fecha') && $request->filled('estado')) {
            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));
                
                $inv = new InventarioCorte();
                $inv->setConnection($connection);

                $inventarioCorte = $inv->find($id);
                if ($inventarioCorte == null) {
                    return response()->json([
                        'response' => 0,
                        'message' => 'El invetario no existe'
                    ]);
                }
                date_default_timezone_set("America/La_Paz");
                $inventarioCorte->descripcion = $request->descripcion;
                $inventarioCorte->fecha = $request->fecha;
                $inventarioCorte->notas = $request->notas;
                $inventarioCorte->fechahoratransac = date('Y-m-d H:i:s');
                $inventarioCorte->estado = $request->estado;
                $inventarioCorte->setConnection($connection);
                $inventarioCorte->update();

                $arrayStocksTotales = json_decode($request->arrayStocksTotales);
                $arrayAlmacenes = json_decode($request->arrayAlmacenes);
                $productos = json_decode($request->productos);
                $eliminados = json_decode($request->arrayEliminados);
                $selectAlmacenes = json_decode($request->selectAlmacenes);
                
                $size = sizeof($productos);
                for ($i = 0; $i < $size; $i++) {
                    
                    $almacenes = $arrayAlmacenes[$i];
                    $length = sizeof($almacenes);

                    $almpd = new AlmacenProdDetalle();
                    $almpd->setConnection($connection);

                    $invcd = new InventarioCorteDetalle();
                    $invcd->setConnection($connection);
                    
                    for ($j = 0; $j < $length; $j++) {
                        if ($almacenes[$j]->idicd == '' || $almacenes[$j]->idicd == -1) {
                            if (in_array($almacenes[$j]->idalmacen, $selectAlmacenes)) {
                                $invCorteDet = new InventarioCorteDetalle();
                                $invCorteDet->stockanterior = $almacenes[$j]->stockanterior;
                                $invCorteDet->stocknuevo = $almacenes[$j]->stocknuevo;
                                $invCorteDet->fkidalmacenproddetalle = $almacenes[$j]->idapd;
                                $invCorteDet->fkidinventariocorte = $inventarioCorte->idinventariocorte;
                                $invCorteDet->setConnection($connection);
                                $invCorteDet->save();
                            }
                        } else {
                            $invCorteDet = $invcd->find($almacenes[$j]->idicd);
                            $invCorteDet->stockanterior = $almacenes[$j]->stockanterior;
                            $invCorteDet->stocknuevo = $almacenes[$j]->stocknuevo;
                            $invCorteDet->update();
                        }
                        
                        if ($request->estado == 'F' && in_array($almacenes[$j]->idalmacen, $selectAlmacenes)) {
                            $idapd = $almacenes[$j]->idapd;
                            $almacenprod = $almpd->find($idapd);
                            $almacenprod->stock = $almacenes[$j]->stocknuevo;
                            $almacenprod->setConnection($connection);
                            $almacenprod->update();
                        }
                    }
                    
                    if ($request->estado == 'F') {
                        $produ = new Producto();
                        $produ->setConnection($connection);
                        $producto = $produ->find($productos[$i]->idproducto);
                        $producto->stock = $arrayStocksTotales[$i]->nuevo;
                        $producto->setConnection($connection);
                        $producto->update();
                    }
                }
                $invcd = new InventarioCorteDetalle();
                $invcd->setConnection($connection);
                $invcd->destroy($eliminados);

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito el inventario corte ' . $inventarioCorte->idinventariocorte;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se actualizo correctamente el inventario corte'
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
                    'message' => 'No se pudo procesar la solicitud, ocurrio un problema',
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
                'message' => 'No se recibieron los parametros correctamente'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
                
            $inv = new InventarioCorte();
            $inv->setConnection($connection);

            $inventarioCorte = $inv->find($id);
            if ($inventarioCorte == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El corte de inventario no existe'
                ]);
            }

            $detalles = $inventarioCorte->detalles;

            if ($inventarioCorte->estado == 'P') {
                foreach($detalles as $row) {
                    $row->delete();
                }
            } else {
                //$sum = 0;
                //$idproducto = null;
                $idsProductos = [];
                $almpd = new AlmacenProdDetalle();
                $almpd->setConnection($connection);
                foreach ($detalles as $row) {
                    $almacenprod = $almpd->find($row->fkidalmacenproddetalle);
                    $almacenprod->stock = $row->stockanterior;
                    $almacenprod->setConnection($connection);
                    $almacenprod->update();
                    //$sum = $sum + $row->stockanterior;
                    $idproducto = $almacenprod->fkidproducto;
                    if (!in_array($idproducto, $idsProductos)) {
                        array_push($idsProductos, $almacenprod->fkidproducto);
                    }
                }
                
                $obj = new Producto();
                $obj->setConnection($connection);
                foreach($idsProductos as $id) {
                    $producto = $obj->find($id);
                    $almacenprods = $producto->detallealamcenprod;
                    $sum = 0;
                    foreach ($almacenprods as $row) {
                        $sum += $row->stock;
                    }
                    $producto->stock = $sum;
                    $producto->setConnection($connection);
                    $producto->update();
                }
                /*
                $produ = new Producto();
                $produ->setConnection($connection);
                $producto = $produ->find($idproducto);
                $producto->stock = $sum;
                $producto->setConnection($connection);
                $producto->update();
                */
            }

            $inventarioCorte->delete();

            $datos = $inv->orderBy('idinventariocorte', 'ASC')->paginate(10);
            $data = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el inventario corte ' . $inventarioCorte->idinventariocorte;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'El inventario corte fue elimanado correctamente',
                'pagination' => $pagination,
                'data' => $data
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
                'message' => 'No se pudo eliminar el inventario corte',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    public function searchByIdCod(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
                
            $inv = new InventarioCorte();
            $inv->setConnection($connection);

            $result = $inv->SearchByIdCod($value)->get();
            return response()->json([
                'response' => 1,
                'data' => $result
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
                'message' => 'No se pudo procesar la busqueda',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }
}
