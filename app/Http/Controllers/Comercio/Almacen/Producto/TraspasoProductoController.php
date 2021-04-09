<?php

namespace App\Http\Controllers\Comercio\Almacen\Producto;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\IngresoSalidaTraspasoTipo;
use App\Models\Comercio\Almacen\Producto\TraspasoProducto;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use Carbon\Carbon;
use App\Models\Comercio\Almacen\Producto\TraspasoProdDetalle;
use App\Models\Config\ConfigCliente;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;

class TraspasoProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $buscar = $request->buscar;
            $paginacion = $request->pagina;

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $data = new TraspasoProducto();
            $data->setConnection($connection); 

            if ($buscar == '') {
                $data = $data
                    ->join('ingresosalidatrastipo as i', 
                        'traspasoproducto.fkidingresosalidatrastipo', '=', 'i.idingresosalidatrastipo')
                    ->select('traspasoproducto.*', 'i.descripcion as tipo',
                        DB::raw('
                            (SELECT a.descripcion FROM almacen as a 
                                WHERE a.idalmacen = traspasoproducto.fkidalmacen_sale) 
                            AS almacen_salida'
                        ),
                        DB::raw('
                            (SELECT a.descripcion FROM almacen as a 
                                WHERE a.idalmacen = traspasoproducto.fkidalmacen_entra) 
                            AS almacen_entra'
                        )
                    )
                    ->whereNull('traspasoproducto.deleted_at')
                    ->orderBy('traspasoproducto.idtraspasoproducto', 'desc')
                    ->paginate($paginacion);
            }else{
                $data = $data
                        ->join('ingresosalidatrastipo as i', 
                            'traspasoproducto.fkidingresosalidatrastipo', '=', 'i.idingresosalidatrastipo')
                        ->select('traspasoproducto.*', 'i.descripcion as tipo',
                            DB::raw('
                                (SELECT a.descripcion FROM almacen as a 
                                    WHERE a.idalmacen = traspasoproducto.fkidalmacen_sale) 
                                AS almacen_salida'
                            ),
                            DB::raw('
                                (SELECT a.descripcion FROM almacen as a 
                                    WHERE a.idalmacen = traspasoproducto.fkidalmacen_entra) 
                                AS almacen_entra'
                            )
                        )
                        ->where(function ($query) use ($request) {
                            return $query->orWhere('traspasoproducto.idtraspasoproducto', 'ILIKE', "%$request->buscar%")
                                ->orWhere('traspasoproducto.codtraspaso', 'ILIKE', "%$request->buscar%")
                                ->orWhere(DB::raw('
                                        (SELECT a.descripcion FROM almacen as a 
                                            WHERE a.idalmacen = traspasoproducto.fkidalmacen_sale) '
                                    ), 'ILIKE', '%'.$request->buscar.'%' 
                                )
                                ->orWhere(DB::raw('
                                        (SELECT a.descripcion FROM almacen as a 
                                            WHERE a.idalmacen = traspasoproducto.fkidalmacen_entra) '
                                    ), 'ILIKE', '%'.$request->buscar.'%' 
                                )
                                ->orWhere('i.descripcion', 'ILIKE', "%$request->buscar%");
                        })
                        ->whereNull('traspasoproducto.deleted_at')
                        ->orderBy('traspasoproducto.idtraspasoproducto', 'desc')
                        ->paginate($paginacion);
            }

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->decrypt();

            return [
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
                ],
                'data' => $data, 'pagina' => $paginacion, 'buscar' => $buscar, 'config' => $configs,
            ];
            
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
     * Show the form for creating a new resource.
     * @return Response
     */
    public function create()
    {
        return view('commerce::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        try {
            
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $codigo = $request->codigo;
            $tipo = $request->filled('tipo') ? $request->tipo : '';
            $fecha = $request->filled('fecha') ? $request->fecha : '';
            $hora = $request->filled('hora') ? $request->hora : '';
            $almacen = $request->filled('almacen') ? json_decode($request->almacen) : [];
            $nota = $request->nota;
            $idusuario = $request->filled('idusuario') ? $request->idusuario : '';
            $producto = $request->filled('producto') ? json_decode($request->producto) : [];

            $mytime = Carbon::now('America/La_paz');

            $data = new TraspasoProducto();
            $data->codtraspaso = $codigo;
            $data->fechahora = $fecha.' '.$hora;
            $data->fechahoratransac = $mytime->toDateString().' '.$mytime->toTimeString();
            $data->notas = $nota;
            $data->fkidingresosalidatrastipo = $tipo;
            $data->fkidalmacen_sale = $almacen[1];
            $data->fkidalmacen_entra = $almacen[0];
            $data->idusuario = $idusuario;
            $data->setConnection($connection);
            $data->save();

            foreach ($producto as $p) {
                if (($p->id != '') && ($p->cantidad != '') && ($p->cantidad > 0)) {
                    $detalle = new TraspasoProdDetalle();

                    $almacenproducto = new AlmacenProdDetalle();
                    $almacenproducto->setConnection($connection);
                    
                    $almacenproductodetalle = $almacenproducto->where('fkidalmacen', '=', $almacen[1])
                        ->where('fkidproducto', '=', $p->id)
                        ->first();
                    
                    $detalle->fkidtraspasoproducto = $data->idtraspasoproducto;
                    $detalle->cantidad = $p->cantidad;
                    $detalle->fkidalmacenproddetalle = $almacenproductodetalle->idalmacenproddetalle;
                    $detalle->setConnection($connection);
                    $detalle->save();

                    $almacenproductodetalle->stock = $almacenproductodetalle->stock - $p->cantidad;
                    $almacenproductodetalle->setConnection($connection);
                    $almacenproductodetalle->update();

                    $almacenproductodetalle = $almacenproducto->where('fkidalmacen', '=', $almacen[0])
                        ->where('fkidproducto', '=', $p->id)
                        ->first();

                    $detalle = new TraspasoProdDetalle();
                    
                    $detalle->fkidtraspasoproducto = $data->idtraspasoproducto;
                    $detalle->cantidad = $p->cantidad;
                    $detalle->fkidalmacenproddetalle = $almacenproductodetalle->idalmacenproddetalle;
                    $detalle->setConnection($connection);
                    $detalle->save();
                    
                    $almacenproductodetalle->stock = $almacenproductodetalle->stock + $p->cantidad;
                    $almacenproductodetalle->setConnection($connection);
                    $almacenproductodetalle->update();
                }            
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto un traspaso de producto ' . $data->idtraspasoproducto;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
            ]);

        } catch (DecryptException $e) {
            DB::rollBack();
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
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
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
            $data = new TraspasoProducto();
            $data->setConnection($connection); 

            $data = $data
                ->join('ingresosalidatrastipo as i', 
                    'traspasoproducto.fkidingresosalidatrastipo', '=', 'i.idingresosalidatrastipo')
                ->select('traspasoproducto.*', 'i.descripcion as tipo',
                    DB::raw('
                        (SELECT a.descripcion FROM almacen as a 
                            WHERE a.idalmacen = traspasoproducto.fkidalmacen_sale) 
                        AS almacen_salida'
                    ),
                    DB::raw('
                        (SELECT a.descripcion FROM almacen as a 
                            WHERE a.idalmacen = traspasoproducto.fkidalmacen_entra) 
                        AS almacen_entra'
                    )
                )
                ->where('traspasoproducto.idtraspasoproducto', '=', $id)
                ->first();

            $detalle = new TraspasoProdDetalle();
            $detalle->setConnection($connection);
            
            $detalle = $detalle
                ->join('almacenproddetalle as a', 
                    'traspasoproddetalle.fkidalmacenproddetalle', '=', 'a.idalmacenproddetalle')
                ->join('producto as p', 'a.fkidproducto', '=', 'p.idproducto')
                ->select('traspasoproddetalle.*', 'p.codproducto', 'p.descripcion as producto', 
                    'a.stock', 'a.fkidalmacen'
                )
                ->where('traspasoproddetalle.fkidtraspasoproducto', '=', $id)
                ->orderBy('p.idproducto', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
                'detalle' => $detalle,
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
                'message' => 'No se pudo procesa la solicitud',
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
    public function edit($id)
    {
        return view('commerce::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request)
    {
        try {
            
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $fkidalmacen_entra = $request->fkidalmacen_entra;
            $fkidalmacen_sale = $request->fkidalmacen_sale;

            $obj = new TraspasoProducto();
            $obj->setConnection($connection);
            $traspasoproducto = $obj->find($id);
            
            $obj = new TraspasoProdDetalle();
            $obj->setConnection($connection);
            $detalle = $obj->where('fkidtraspasoproducto', '=', $id)->get();

            foreach ($detalle as $d) {

                $obj = new AlmacenProdDetalle();
                $obj->setConnection($connection);

                $almacenproducto = $obj->find($d->fkidalmacenproddetalle);

                if ($almacenproducto->fkidalmacen == $fkidalmacen_entra) {
                    $almacenproducto->stock = $almacenproducto->stock - $d->cantidad;
                }
                if ($almacenproducto->fkidalmacen == $fkidalmacen_sale) {
                    $almacenproducto->stock = $almacenproducto->stock + $d->cantidad;
                }
                $almacenproducto->update();
                $d->delete();
            }

            $traspasoproducto->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino un traspaso de producto ' . $id;
            $log->guardar($request, $accion);

            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $detalle,
                'traspasoproducto' => $traspasoproducto,
            ]);

        } catch (DecryptException $e) {
            DB::rollBack();
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
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function validar_codigo(Request $request, $value) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = new TraspasoProducto();
            $data->setConnection($connection);

            $count = $data->where(['codtraspaso' => $value])->get();

            if (sizeof($count) > 0) {
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
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
    public function get_tipo_traspaso(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = new IngresoSalidaTraspasoTipo();
            $data->setConnection($connection);

            $data = $data->where('estado', '=', 'A')->orderBy('idingresosalidatrastipo', 'asc')->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
    public function get_almacen(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = new Almacen();
            $data->setConnection($connection);

            $data = $data->orderBy('idalmacen', 'asc')->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
    public function get_productos_almacenes(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->filled('value') ? $request->value : '';
            $bandera = $request->filled('bandera') ? $request->bandera : 0;

            $data = new AlmacenProdDetalle();
            $data->setConnection($connection);

            $almacenes = json_decode($request->almacen);

            if ($bandera == 0) {
                $data = DB::connection($connection)
                    ->table('almacenproddetalle as ad')
                    ->join('producto as p', 'ad.fkidproducto', '=', 'p.idproducto')
                    ->select('ad.fkidproducto as id', 'p.descripcion as producto', 'p.codproducto as codigo',
                        DB::raw('COUNT(ad.fkidproducto) AS cantidad')
                    )
                    ->whereIn('ad.fkidalmacen', $almacenes)
                    ->where('p.tipo', '=', 'P')
                    ->whereNull('ad.deleted_at')
                    ->groupBy('ad.fkidproducto', 'p.descripcion', 'p.codproducto')
                    ->orderBy('ad.fkidproducto')
                    ->having(DB::raw('COUNT(ad.fkidproducto)'), '>=', sizeof($almacenes))
                    ->paginate(15);
            }

            if ($bandera == 1) {
                $data = DB::connection($connection)
                    ->table('almacenproddetalle as ad')
                    ->join('producto as p', 'ad.fkidproducto', '=', 'p.idproducto')
                    ->select('ad.fkidproducto as id', 'p.descripcion as producto', 'p.codproducto as codigo',
                        DB::raw('COUNT(ad.fkidproducto) AS cantidad')
                    )
                    ->where(
                        function ($query) use ($value) {
                            $query->where('p.codproducto', 'ilike', '%'.$value.'%')
                                ->orWhere('p.idproducto', 'ilike', '%'.$value.'%');
                        }
                    )
                    ->where('p.tipo', '=', 'P')
                    ->whereIn('ad.fkidalmacen', $almacenes)
                    ->whereNull('ad.deleted_at')
                    ->groupBy('ad.fkidproducto', 'p.descripcion', 'p.codproducto')
                    ->orderBy('ad.fkidproducto')
                    ->having(DB::raw('COUNT(ad.fkidproducto)'), '>=', sizeof($almacenes))
                    ->paginate(15);
            }
            
            if ($bandera == 2) {
                $data = DB::connection($connection)
                    ->table('almacenproddetalle as ad')
                    ->join('producto as p', 'ad.fkidproducto', '=', 'p.idproducto')
                    ->select('ad.fkidproducto as id', 'p.descripcion as producto', 'p.codproducto as codigo',
                        DB::raw('COUNT(ad.fkidproducto) AS cantidad')
                    )
                    ->where('p.tipo', '=', 'P')
                    ->where('p.descripcion', 'ilike', '%'.$value.'%')
                    ->whereIn('ad.fkidalmacen', $almacenes)
                    ->whereNull('ad.deleted_at')
                    ->groupBy('ad.fkidproducto', 'p.descripcion', 'p.codproducto')
                    ->orderBy('ad.fkidproducto')
                    ->having(DB::raw('COUNT(ad.fkidproducto)'), '>=', sizeof($almacenes))
                    ->paginate(15);
            }

            return response()->json([
                'response' => 1,
                'data' => $data,
                'almacen' => $bandera
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
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
    public function get_stock_almacen(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = new AlmacenProdDetalle();
            $data->setConnection($connection);

            $almacenes = json_decode($request->almacen);

            $data = DB::connection($connection)
                ->table('almacenproddetalle as ad')
                ->join('producto as p', 'ad.fkidproducto', '=', 'p.idproducto')
                ->select('ad.fkidproducto as id', 'ad.stock', 'ad.fkidalmacen as almacen')
                ->whereIn('ad.fkidalmacen', $almacenes)
                ->where('ad.fkidproducto', '=', $request->id)
                ->whereNull('ad.deleted_at')
                ->orderBy('ad.fkidproducto')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $data,
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
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
}
