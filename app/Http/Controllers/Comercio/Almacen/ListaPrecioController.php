<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\ListaPrecio;
use App\Models\Comercio\Almacen\Producto\ListaPreProducDetalle;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use App\CustomCollection;
use DB;

class ListaPrecioController extends Controller
{
    public function index(Request $request)
    {
        // try {
        //     $connection = Crypt::decrypt($request->get('x_conexion'));
        //     $listap = new ListaPrecio();
        //     $listap->setConnection($connection);
        //     $data = $listap->orderBy('idlistaprecio','desc')->get();
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
        //         'message' => 'No se pudo procesar la solicitud'
        //     ]);
        // }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $listaPrecios = new ListaPrecio();
            $listaPrecios->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $listaPrecios->leftJoin('moneda as m', 'm.idmoneda', 'listaprecio.fkidmoneda')
                    ->select('listaprecio.idlistaprecio', 'listaprecio.descripcion', 'listaprecio.valor', 'listaprecio.fechainicio',
                             'listaprecio.fechafin', 'listaprecio.fechahoratransac', 'listaprecio.notas', 'listaprecio.fijoporcentaje',
                             'listaprecio.accion', 'listaprecio.estado', 'listaprecio.idusuario', 'm.descripcion as moneda')
                    ->orWhere('listaprecio.idlistaprecio', 'LIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.descripcion', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.valor', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.fechainicio', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.fechafin', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.fechahoratransac', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.notas', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.fijoporcentaje', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.accion', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.estado', 'ILIKE', "%$request->buscar%")
                    ->orWhere('listaprecio.idusuario', 'ILIKE', "%$request->buscar%")
                    ->orWhere('m.descripcion', 'ILIKE', "%$request->buscar%")
                    ->orderBy('listaprecio.idlistaprecio', 'asc')
                    ->paginate($paginate);
            } else {
                $datos = $listaPrecios->leftJoin('moneda as m', 'm.idmoneda', 'listaprecio.fkidmoneda')
                    ->select('listaprecio.idlistaprecio', 'listaprecio.descripcion', 'listaprecio.valor', 'listaprecio.fechainicio',
                             'listaprecio.fechafin', 'listaprecio.fechahoratransac', 'listaprecio.notas', 'listaprecio.fijoporcentaje',
                             'listaprecio.accion', 'listaprecio.estado', 'listaprecio.idusuario', 'm.descripcion as moneda')
                    ->orderBy('listaprecio.idlistaprecio', 'asc')
                    ->paginate($paginate);
            }
            $datosListaPrecios = $datos->getCollection();
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
                'data' => $datosListaPrecios
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo obtener los productos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
                ]
            ]);
        }
    }

    public function getListaPrecios(Request $request, $paginate) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $datos = $listap->orderBy('idlistaprecio', 'DESC')->paginate($paginate);
            $data = $datos->getCollection();

            $pagination = array(
                "total" => $datos->total(),
                "current_page" => $datos->currentPage(),
                "per_page" => $datos->perPage(),
                "last_page" => $datos->lastPage(),
                "first" => $datos->firstItem(),
                "last" =>   $datos->lastItem()
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
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
                ]
            ]);
        }

    }

    public function getProductosListaPrecios(Request $request) {

        try {
            if ($request->filled('idsLista')) {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $listap = new ListaPrecio();
                $listap->setConnection($connection);

                $idsLista = json_decode($request->get('idsLista'));
                $productos = array();
                $longitud = sizeof($idsLista);
                for ($i = 0; $i < $longitud; $i++) {
                    $listaprod = $listap->find($idsLista[$i])->listaproddet;
    
                    foreach ($listaprod as $row) {
                        array_push($productos, $row->producto);
                    }
                }
        
                return response()->json([
                    "response" => 1,
                    "data" => $productos
                ]);
            }
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error, no se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
                ]
            ]);
        }
        
        
    }

    public function getProductos(Request $request, $id) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $listaPrecioProd = $listap->find($id)->listaproddet;
            $productos = array();
            foreach ($listaPrecioProd as $row) {
                array_push($productos, $row->producto);
            }

            return response()->json([
                "response" => 1,
                "data" => $productos
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "response" => -1,
                "message" => 'Error, la solicitud no se pudo procesar',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
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

            $produ = new Producto();
            $produ->setConnection($connection);

            $productos = $produ->latest()->orderBy('idproducto', 'desc')->take(30)->get();

            return response()->json([
                'response' => 1,
                'productos' => $productos
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al cargar los productos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
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
        if ($request->filled('descripcion') && $request->filled('fijoporcentaje') &&
            $request->filled('accion') && $request->filled('fechaini') && $request->filled('fechafin') &&
            $request->filled('idmoneda') && $request->filled('idsProductos') && $request->filled('preciosProd')) {
            
            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $listap = new ListaPrecio();
                $listap->setConnection($connection);

                $listaPrecio = new ListaPrecio();
                $listaPrecio->descripcion = $request->get('descripcion');
                $listaPrecio->fijoporcentaje = $request->get('fijoporcentaje');
                $listaPrecio->accion = $request->get('accion');
                $listaPrecio->valor = $request->get('valor') == null ? 0 : $request->get('valor');
                $listaPrecio->fechainicio = $request->get('fechaini');
                $listaPrecio->fechafin = $request->get('fechafin');
                $listaPrecio->idusuario = 0;
                $listaPrecio->fkidmoneda = $request->get('idmoneda');
                $listaPrecio->notas = $request->get('notas');
                $listaPrecio->fechahoratransac = date('Y-m-d H:i:s');
                $listaPrecio->setConnection($connection);
                $listaPrecio->save();

                $idsProductos = json_decode($request->get('idsProductos'));
                $preciosProd = json_decode($request->get('preciosProd'));
                $longitud = sizeof($idsProductos);
                for ($i = 0; $i < $longitud; $i++) {

                    $listaProdDetalle = new ListaPreProducDetalle();
                    $listaProdDetalle->precio = $preciosProd[$i];
                    $listaProdDetalle->fkidlistaprecio = $listaPrecio->idlistaprecio;
                    $listaProdDetalle->fkidproducto = $idsProductos[$i];
                    $listaProdDetalle->setConnection($connection);
                    $listaProdDetalle->save();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto la lista de precios ' . $listaPrecio->idlistaprecio;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se registro la lista de precio correctamente'
                ]);
            } catch (DecryptException $e) {
                DB::rollback();
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelva a iniciar sesion',
                    'error' => [
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getMessage()
                    ]
                ]);
            } catch (\Throwable $th) {
                DB::rollback();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se registro la lista de precio correctamente',
                    'error' => [
                        'message' => $th->getMessage(),
                        'file' => $th->getFile(),
                        'line' => $th->getMessage()
                    ]
                ]);
            }
            
        } else {
            return response()->json([
                "response" => -1,
                "message" => "-1 Problemas al procesar la solicitud"
            ]);
        }
        

    }

    /**
     * Show the specified resource.
     * @return Response
     */
    public function show(Request $request, $id)
    {
        //return view('commerce::show');
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $listaPrecio = $listap->find($id);
            if ($listaPrecio == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, la lista de precio no existe'
                ]);
            }
            $listaPrecio->moneda;
            $listaDetalle = $listap->find($id)->listaproddet;

            $listaProductos = array();
            foreach ($listaDetalle as $row) {
                $producto = $row->producto;
                $producto->preciomod = $row->precio;
                array_push($listaProductos, $producto);
            }

            return response()->json([
                "response" => 1,
                "listaprecio" => $listaPrecio,
                "listaproductos" => $listaProductos
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
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

            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $listaPrecio = $listap->find($id);
            if ($listaPrecio == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, la lista de precio no existe'
                ]);
            }
            $listaDetalle = $listap->find($id)->listaproddet;

            $listaProductos = array();
            $listaProdDetalle = array();
            $preciosOriginales = array();
            foreach ($listaDetalle as $row) {
                $producto = $row->producto;
                array_push($listaProdDetalle, $row);
                array_push($preciosOriginales, $producto->precio);
            }

            return response()->json([
                "response" => 1,
                "listaprecio" => $listaPrecio,
                "listaproddet" => $listaProdDetalle,
                "preciosorig" => $preciosOriginales
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error, la solicitud no se pudo procesar',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
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
        if ($request->filled('idsActuales') && $request->filled('descripcion') &&
            $request->filled('productosEliminados') && $request->filled('idsProductosNuevos') && 
            $request->filled('preciosProd') && $request->filled('preciosProdNuevos')) {
            //echo "Inico";
            DB::BeginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $listap = new ListaPrecio();
                $listap->setConnection($connection);

                $listaPrecio = $listap->find($id);
                if ($listaPrecio == null) {
                    return response()->json([
                        'response' => 0,
                        'message' => 'Error, la lista de precios no existe'
                    ]);
                }
                $listaPrecio->descripcion = $request->get('descripcion');
                $listaPrecio->fijoporcentaje = $request->get('fijoporcentaje');
                $listaPrecio->accion = $request->get('accion');
                $listaPrecio->fkidmoneda = $request->get('idmoneda');
                $listaPrecio->valor = $request->get('valor') == null ? 0 : $request->get('valor');
                $listaPrecio->fechahoratransac = date('Y-m-d H:i:s');
                $listaPrecio->notas = $request->get('notas');
                $listaPrecio->estado = $request->get('estado');
                $listaPrecio->fechainicio = $request->get('fechaini');
                $listaPrecio->fechafin = $request->get('fechafin');
                $listaPrecio->setConnection($connection);
                $listaPrecio->update();

                $actuales = json_decode($request->get('idsActuales'));
                $preciosProd = json_decode($request->get('preciosProd'));
                $longitud = sizeof($actuales);
                $listpd = new ListaPreProducDetalle();
                $listpd->setConnection($connection);
                for ($i = 0; $i < $longitud; $i++) {
                    $listaprodet  = $listpd->find($actuales[$i]);
                    $listaprodet->precio = $preciosProd[$i];
                    $listaprodet->setConnection($connection);
                    $listaprodet->update();
                }

                $productosNuevos = json_decode($request->get('idsProductosNuevos'));
                $preciosNuevos = json_decode($request->get('preciosProdNuevos'));
                $longitud = sizeof($productosNuevos);
                for ($i = 0; $i < $longitud; $i++) {
                    $listaprodet = new ListaPreProducDetalle();
                    $listaprodet->precio = $preciosNuevos[$i];
                    $listaprodet->fkidproducto = $productosNuevos[$i];
                    $listaprodet->fkidlistaprecio = $listaPrecio->idlistaprecio;
                    $listaprodet->setConnection($connection);
                    $listaprodet->save();
                }
                
                $productosEliminados = json_decode($request->get('productosEliminados'));
                $longitud = sizeof($productosEliminados);
                for ($i = 0; $i < $longitud; $i++) {
                    $listaprodet = $listpd->findOrFail($productosEliminados[$i]);
                    $listaprodet->delete();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito la lista de precios ' . $listaPrecio->idlistaprecio;
                $log->guardar($request, $accion);

                DB::rollback();
                return response()->json([
                    "response" => 1,
                    "message" => "Se actualizo correctamente"
                ]);
                
            } catch (DecryptException $e) {
                DB::rollback();
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelva a iniciar sesion',
                    'error' => [
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getMessage()
                    ]
                ]);
            } catch (\Throwable $th) {
                DB::rollback();
                return response()->json([
                    'response' => -1,
                    'message' => 'Error, no se pudo procesar la solicitud',
                    'error' => [
                        'message' => $th->getMessage(),
                        'file' => $th->getFile(),
                        'line' => $th->getMessage()
                    ]
                ]);
            }
            
        } else {
            return response()->json([
                "response" => -1,
                "message" => "No se pudo procesar la solicitud"
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        DB::BeginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $listaPrecio = $listap->find($id);
            if ($listaPrecio == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, la lista de precio no existe'
                ]);
            }
            $listaProdDet = $listaPrecio->listaproddet;
            $listpd = new ListaPreProducDetalle();
            $listpd->setConnection($connection);
            foreach ($listaProdDet as $row) {
                $data = $listpd->find($row['idlistapreproducdetalle'])->ventadetalle;
                if ($data->count() > 0) {
                    return response()->json([
                        "response" => 0,
                        "message" => "No se puede eliminar la lista de precios, por que ya esta en una detalle de venta"
                    ]);
                }
            }

            foreach ($listaProdDet as $row) {
                $row->setConnection($connection);
                $row->delete();
            }
            $listaPrecio->setConnection($connection);
            $listaPrecio->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la lista de precios ' . $id;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
                "message" => "La lista de precios fue eliminada correctamente"
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'Error, no se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getMessage()
                ]
            ]);
        }
        
    }

    public function getproductosall(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);
            $productos = $produ->orderBy('idproducto', 'desc')->get();

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
                'message' => 'No se pudo obtener los productos'
            ]);
        }
        
    }

    public function Search(Request $request) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $fecha_final = date("Y").'-'.date("m").'-'.date("d");

            $result = $listap->where('estado', 'A')
                ->where('descripcion', 'ILIKE', "%".$request->descripcion."%")
                ->where('fkidmoneda', '=', $request->idmoneda)
                ->where('fechafin', '>=', $fecha_final)
                ->orWhere('idlistaprecio', '=', '1')
                ->orderBy('idlistaprecio', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al procesar la solicitud'
            ]);
        }
        
    }

    public function getListasActivas(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $data = $listap->where(['fkidmoneda' => $request->idmoneda, 'estado' => 'A'])->get();

            return response()->json([
                "response" => 1,
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
}
