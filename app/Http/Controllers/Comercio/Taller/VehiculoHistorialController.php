<?php

namespace App\Http\Controllers\Comercio\Taller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Taller\VehiculoHistorial;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\DB;

use Carbon\Carbon;

class VehiculoHistorialController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) {
            return view('commerce::admin.template');
        }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $buscar = $request->buscar;
            $paginacion = $request->pagina;
            
            $veh = new VehiculoHistorial();
            $veh->setConnection($connection);
            if ($buscar == '') {

                $vehiculoHistorial = $veh->leftJoin('vehiculo as v', 'vehiculohistoria.fkidvehiculo', 'v.idvehiculo')
                    ->leftJoin('cliente as c', 'v.fkidcliente', 'c.idcliente')
                    ->leftJoin('vehiculotipo as vt', 'v.fkidvehiculotipo', 'vt.idvehiculotipo')
                    ->select('vehiculohistoria.idvehiculohistoria', 'vehiculohistoria.fecha', 'vehiculohistoria.diagnosticoentrada', 
                        'vehiculohistoria.trabajoshechos', 'vehiculohistoria.kmactual', 'vehiculohistoria.kmproximo', 
                        'vehiculohistoria.fechaproxima', 'vehiculohistoria.fechahoratransaccion', 'vehiculohistoria.precio', 
                        'vehiculohistoria.notas', 'vehiculohistoria.fkidventa', 'v.placa', 'c.nombre', 'c.apellido', 'vt.descripcion', 
                        'c.idcliente', 'v.idvehiculo')
                    ->orderBy('vehiculohistoria.idvehiculohistoria', 'desc')
                    ->paginate($paginacion);

            } else {
                $vehiculoHistorial = $veh->leftJoin('vehiculo as v', 'vehiculohistoria.fkidvehiculo', 'v.idvehiculo')
                    ->leftJoin('cliente as c', 'v.fkidcliente', 'c.idcliente')
                    ->leftJoin('vehiculotipo as vt', 'v.fkidvehiculotipo', 'vt.idvehiculotipo')
                    ->select('vehiculohistoria.idvehiculohistoria', 'vehiculohistoria.fecha', 'vehiculohistoria.diagnosticoentrada', 
                        'vehiculohistoria.trabajoshechos', 'vehiculohistoria.kmactual', 'vehiculohistoria.kmproximo', 
                        'vehiculohistoria.fechaproxima', 'vehiculohistoria.fechahoratransaccion', 'vehiculohistoria.precio', 
                        'vehiculohistoria.notas', 'v.placa', 'c.nombre', 'c.apellido', 'vt.descripcion',
                        'c.idcliente', 'v.idvehiculo')
                    ->where('vehiculohistoria.idvehiculohistoria', 'ilike', '%'.$buscar.'%')
                    ->orwhere(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$buscar.'%')
                    ->orwhere('v.placa', 'ilike', '%'.$buscar.'%')
                    ->orwhere('vt.descripcion', 'ilike', '%'.$buscar.'%')
                    ->orderBy('vehiculohistoria.idvehiculohistoria', 'desc')
                    ->paginate($paginacion);         
            }

            return response()->json([
                'pagination' => [
                    'total'        => $vehiculoHistorial->total(),
                    'current_page' => $vehiculoHistorial->currentPage(),
                    'per_page'     => $vehiculoHistorial->perPage(),
                    'last_page'    => $vehiculoHistorial->lastPage(),
                    'from'         => $vehiculoHistorial->firstItem(),
                    'to'           => $vehiculoHistorial->lastItem(),
                ],
                'vehiculoHistoria' => $vehiculoHistorial, 'pagina' => $paginacion, 'buscar' => $buscar
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

    public function getHistoriaVehiculos(Request $request){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $veh = new VehiculoHistorial();
            $veh->setConnection($connection);
            $vehiculoHistorial = $veh->leftJoin('vehiculo as v', 'vehiculohistoria.fkidvehiculo', 'v.idvehiculo')
                ->leftJoin('cliente as c', 'v.fkidcliente', 'c.idcliente')
                ->leftJoin('vehiculotipo as vt', 'v.fkidvehiculotipo', 'vt.idvehiculotipo')
                ->select('vehiculohistoria.idvehiculohistoria', 'vehiculohistoria.fecha', 'vehiculohistoria.diagnosticoentrada', 
                    'vehiculohistoria.trabajoshechos', 'vehiculohistoria.kmactual', 'vehiculohistoria.kmproximo', 
                    'vehiculohistoria.fechaproxima', 'vehiculohistoria.fechahoratransaccion', 'vehiculohistoria.precio', 
                    'vehiculohistoria.notas', 'vehiculohistoria.fkidventa', 'v.placa', 'c.nombre', 'c.apellido', 'vt.descripcion', 
                    'c.idcliente', 'v.idvehiculo')
                ->orderBy('vehiculohistoria.idvehiculohistoria', 'desc')
                ->paginate(10);
            $data = $vehiculoHistorial->getCollection();
            $pagination = array(
                "total" => $vehiculoHistorial->total(),
                "current_page" => $vehiculoHistorial->currentPage(),
                "per_page" => $vehiculoHistorial->perPage(),
                "last_page" => $vehiculoHistorial->lastPage(),
                "first" => $vehiculoHistorial->firstItem(),
                "last" =>   $vehiculoHistorial->lastItem()
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

    public function searchData(Request $request, $buscar){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $veh = new VehiculoHistorial();
            $veh->setConnection($connection);
            $vehiculoHistorialBuscar = $veh->leftJoin('vehiculo as v', 'vehiculohistoria.fkidvehiculo', 'v.idvehiculo')
                ->leftJoin('cliente as c', 'v.fkidcliente', 'c.idcliente')
                ->leftJoin('vehiculotipo as vt', 'v.fkidvehiculotipo', 'vt.idvehiculotipo')
                ->select('vehiculohistoria.idvehiculohistoria', 'vehiculohistoria.fecha', 'vehiculohistoria.diagnosticoentrada', 
                    'vehiculohistoria.trabajoshechos', 'vehiculohistoria.kmactual', 'vehiculohistoria.kmproximo', 
                    'vehiculohistoria.fechaproxima', 'vehiculohistoria.fechahoratransaccion', 'vehiculohistoria.precio', 
                    'vehiculohistoria.notas', 'v.placa', 'c.nombre', 'c.apellido', 'vt.descripcion',
                    'c.idcliente', 'v.idvehiculo')
                ->where('vehiculohistoria.idvehiculohistoria', 'ilike', '%'.$buscar.'%')
                ->orwhere(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$buscar.'%')
                ->orwhere('v.placa', 'ilike', '%'.$buscar.'%')
                ->orwhere('vt.descripcion', 'ilike', '%'.$buscar.'%')
                // ->orWhereDate('vehiculohistoria.fecha', 'ilike', '%'.$buscar.'%')
                ->orderBy('vehiculohistoria.idvehiculohistoria', 'desc')
                ->paginate(10);
            $data = $vehiculoHistorialBuscar->getCollection();
            $pagination = array(
                'total' => $vehiculoHistorialBuscar->total(),
                'current_page' => $vehiculoHistorialBuscar->currentPage(),
                'per_page' => $vehiculoHistorialBuscar->perPage(),
                'last_page' => $vehiculoHistorialBuscar->lastPage(),
                'first' => $vehiculoHistorialBuscar->firstItem(),
                'last' =>   $vehiculoHistorialBuscar->lastItem()
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
            $veh = new VehiculoHistorial();
            $veh->setConnection($connection);
            $vehiculoHistorial = $veh->leftJoin('vehiculo as v', 'vehiculohistoria.fkidvehiculo', 'v.idvehiculo')
                ->leftJoin('cliente as c', 'v.fkidcliente', 'c.idcliente')
                ->leftJoin('vehiculotipo as vt', 'v.fkidvehiculotipo', 'vt.idvehiculotipo')
                ->select('vehiculohistoria.idvehiculohistoria', 'vehiculohistoria.fecha', 'vehiculohistoria.diagnosticoentrada', 
                    'vehiculohistoria.trabajoshechos', 'vehiculohistoria.kmactual', 'vehiculohistoria.kmproximo', 
                    'vehiculohistoria.fechaproxima', 'vehiculohistoria.fechahoratransaccion', 'vehiculohistoria.precio', 
                    'vehiculohistoria.notas', 'v.placa', 'c.nombre', 'c.apellido', 'vt.descripcion',
                    'c.idcliente', 'v.idvehiculo')
                ->orderBy('vehiculohistoria.idvehiculohistoria', 'desc')
                ->paginate(10);
            $data = $vehiculoHistorial->getCollection();
            $pagination = array(
                'total' => $vehiculoHistorial->total(),
                'current_page' => $vehiculoHistorial->currentPage(),
                'per_page' => $vehiculoHistorial->perPage(),
                'last_page' => $vehiculoHistorial->lastPage(),
                'first' => $vehiculoHistorial->firstItem(),
                'last' =>   $vehiculoHistorial->lastItem()
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

    public function create(Request $request)
    {
        if (!$request->ajax()) {
            return view('commerce::admin.template');
        }
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cliente = DB::connection($connection)->table('cliente')
                ->select('codcliente', 'idcliente', 
                    DB::raw("CONCAT(nombre, ' ', apellido) AS cliente"))
                ->whereNull('deleted_at')
                ->orderBy('idcliente', 'desc')
                ->paginate(5);

            $vehiculoHistoria = DB::connection($connection)
                                ->table('vehiculohistoria')
                                ->whereNull('deleted_at')
                                ->get();

            return response()->json([
                'pagination' => [
                    'total'        => $cliente->total(),
                    'current_page' => $cliente->currentPage(),
                    'per_page'     => $cliente->perPage(),
                    'last_page'    => $cliente->lastPage(),
                    'from'         => $cliente->firstItem(),
                    'to'           => $cliente->lastItem(),
                ],
                'data' => sizeof($vehiculoHistoria),
                'cliente' => $cliente,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
        
    }

    public function mostrarCliente(Request $request) {

        $buscar = $request->buscar;
        $paginacion = $request->pagina;

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            if ($buscar == '') {
                $cliente = DB::connection($connection)
                    ->table('cliente')
                    ->select('codcliente', 'idcliente', 
                        DB::raw("CONCAT(nombre, ' ', apellido) AS cliente"))
                    ->whereNull('deleted_at')
                    ->orderBy('idcliente', 'desc')
                    ->paginate($paginacion);
            } else {
                $cliente = DB::table('cliente')
                    ->select('codcliente', 'idcliente', 
                        DB::raw("CONCAT(nombre, ' ', apellido) AS cliente"))
                    ->where(DB::raw("CONCAT(nombre, ' ',apellido)"), 'ilike', '%'.$buscar.'%')
                    ->whereNull('deleted_at')
                    ->orderBy('idcliente', 'desc')
                    ->paginate($paginacion);
            }
            
            return response()->json([
                'pagination' => [
                    'total'        => $cliente->total(),
                    'current_page' => $cliente->currentPage(),
                    'per_page'     => $cliente->perPage(),
                    'last_page'    => $cliente->lastPage(),
                    'from'         => $cliente->firstItem(),
                    'to'           => $cliente->lastItem(),
                ],
                'cliente' => $cliente,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
        
    }

    public function mostrarCodigoCliente(Request $request) {

        $buscar = $request->buscar;
        $paginacion = $request->pagina;

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            if ($buscar == '') {
                $cliente = DB::connection($connection)
                    ->table('cliente')
                    ->select('codcliente', 'idcliente', 
                        DB::raw("CONCAT(nombre, ' ', apellido) AS cliente"))
                    ->whereNull('deleted_at')
                    ->orderBy('idcliente', 'desc')
                    ->paginate($paginacion);
            }else {
                $cliente = DB::connection($connection)
                    ->table('cliente')
                    ->select('codcliente', 'idcliente', 
                        DB::raw("CONCAT(nombre, ' ', apellido) AS cliente"))
                    ->where('codcliente', 'ilike', '%'.$buscar.'%')
                    ->whereNull('deleted_at')
                    ->orderBy('idcliente', 'desc')
                    ->paginate($paginacion);
            }
            
            return response()->json([
                'pagination' => [
                    'total'        => $cliente->total(),
                    'current_page' => $cliente->currentPage(),
                    'per_page'     => $cliente->perPage(),
                    'last_page'    => $cliente->lastPage(),
                    'from'         => $cliente->firstItem(),
                    'to'           => $cliente->lastItem(),
                ],
                'cliente' => $cliente,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
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
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $diagnosticoEntrada = $request->input('diagnosticoEntrada');
            $trabajoHecho = $request->input('trabajoHecho');
            $kmActual = $request->input('kmActual');
            $kmProximo = $request->input('kmProximo');
            $fechaProxima = $request->input('fechaProxima');
            $nota = $request->input('nota');

            $idVehiculo = $request->input('idVehiculo');
            $precio = $request->input('precio');

            if ($diagnosticoEntrada == '') {
                $diagnosticoEntrada = null;
            }
            if ($trabajoHecho == '') {
                $trabajoHecho = null;
            }
            if ($kmActual == '') {
                $kmActual = '0';
            }
            if ($kmProximo == '') {
                $kmProximo = '0';
            }
            
            if ($nota == '') {
                $nota = null;
            }

            $tiempo = Carbon::now('America/La_paz');

            $fecha = $tiempo->toDateString();
            $hora = $tiempo->toTimeString();

            if ($fechaProxima == '') {
                $fechaProxima = $fecha;
            }

            $vehiculoHistoria = new VehiculoHistorial();
            $vehiculoHistoria->setConnection($connection);
            $vehiculoHistoria->fecha = $fecha;
            $vehiculoHistoria->diagnosticoentrada = $diagnosticoEntrada;
            $vehiculoHistoria->trabajoshechos = $trabajoHecho;
            $vehiculoHistoria->kmactual = $kmActual;
            $vehiculoHistoria->kmproximo = $kmProximo;
            $vehiculoHistoria->fechaproxima = $fechaProxima;

            $vehiculoHistoria->fechahoratransaccion = $fecha.' '.$hora;

            $vehiculoHistoria->precio = $precio;
            $vehiculoHistoria->notas = $nota;
            $vehiculoHistoria->idusuario = 1;
            $vehiculoHistoria->fkidvehiculo = $idVehiculo;

            $vehiculoHistoria->save();
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el vehiculohistoria ' . $vehiculoHistoria->idvehiculohistoria;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1, 
                'data' => 'exito'
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

    public function show(Request $request)
    {
        $id = $request->input('idVehiculoHistoria');
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vehis = new VehiculoHistorial();
            $vehis->setConnection($connection);

            $vehiculoHistoria = $vehis->leftJoin('vehiculo as v', 'vehiculohistoria.fkidvehiculo', 'v.idvehiculo')
            ->leftJoin('cliente as c', 'v.fkidcliente', 'c.idcliente')
            ->leftJoin('vehiculotipo as vt', 'v.fkidvehiculotipo', 'vt.idvehiculotipo')
            ->select('vehiculohistoria.idvehiculohistoria', 'vehiculohistoria.fecha', 'vehiculohistoria.diagnosticoentrada', 
                'vehiculohistoria.trabajoshechos', 'vehiculohistoria.kmactual', 'vehiculohistoria.kmproximo', 
                'vehiculohistoria.fechaproxima', 'vehiculohistoria.fechahoratransaccion', 'vehiculohistoria.precio', 
                'vehiculohistoria.notas', 'v.placa','c.idcliente', 'c.nombre', 'c.apellido', 'vt.descripcion',
                'v.idvehiculo')
            ->where('vehiculohistoria.idvehiculohistoria', '=', $id)
            ->first();

            return response()->json([
                'response' => 1, 
                'data' => $vehiculoHistoria
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar con la base de datos'
            ]);
        }
        
    }

    public function edit(Request $request, $id)
    {

        if (!$request->ajax()) {
            return view('commerce::admin.plantilla');
        }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehis = new VehiculoHistorial();
            $vehis->setConnection($connection);

            $vehiculoHistoria = $vehis->leftJoin('vehiculo as v', 'vehiculohistoria.fkidvehiculo', 'v.idvehiculo')
                ->leftJoin('cliente as c', 'v.fkidcliente', 'c.idcliente')
                ->leftJoin('vehiculotipo as vt', 'v.fkidvehiculotipo', 'vt.idvehiculotipo')
                ->select('vehiculohistoria.idvehiculohistoria', 'vehiculohistoria.fecha', 'vehiculohistoria.diagnosticoentrada', 
                    'vehiculohistoria.trabajoshechos', 'vehiculohistoria.kmactual', 'vehiculohistoria.kmproximo', 
                    'vehiculohistoria.fechaproxima', 'vehiculohistoria.fechahoratransaccion', 'vehiculohistoria.precio', 
                    'vehiculohistoria.notas', 'v.placa','c.idcliente', 'c.codcliente', 
                    DB::raw("CONCAT(c.nombre, ' ', c.apellido) AS cliente"), 'vt.descripcion',
                    'v.idvehiculo')
                ->where('vehiculohistoria.idvehiculohistoria', '=', $id)
                ->first();

                $detalleVehiculo = DB::connection($connection)
                    ->table('vehiculo as v')
                    ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                    ->join('cliente as c', 'c.idcliente', '=', 'v.fkidcliente')
                    ->Select('v.idvehiculo', 'v.placa', 'v.codvehiculo', 'vt.descripcion as vehiculotipo', 
                            'v.fkidvehiculotipo', 'c.idcliente', 'c.codcliente', 'c.nombre', 'c.apellido')
                    ->where([
                        'v.fkidcliente' => $vehiculoHistoria->idcliente,
                        'v.deleted_at' => null,
                        'vt.deleted_at' => null,
                        'c.deleted_at' => null,
                    ])
                    ->get();

            return response()->json([
                'response' => 1, 
                'data' => $vehiculoHistoria,
                'vehiculo' => $detalleVehiculo,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar con la base de datos'
            ]);
        }
        
    }

    public function update(Request $request)
    {

        //try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idVehiculoHistoria = $request->input('idVehiculoHistoria');

            $diagnosticoEntrada = $request->input('diagnosticoEntrada');
            $trabajoHecho = $request->input('trabajoHecho');
            $kmActual = $request->input('kmActual');
            $kmProximo = $request->input('kmProximo');
            $fechaProxima = $request->input('fechaProxima');
            $nota = $request->input('nota');
    
            $idVehiculo = $request->input('idVehiculo');
            $precio = $request->input('precio');
    
            if ($diagnosticoEntrada == '') {
                $diagnosticoEntrada = null;
            }
            if ($trabajoHecho == '') {
                $trabajoHecho = null;
            }
            if ($kmActual == '') {
                $kmActual = '0';
            }
            if ($kmProximo == '') {
                $kmProximo = '0';
            }
            
            if ($nota == '') {
                $nota = null;
            }
    
            $tiempo = Carbon::now('America/La_paz');
            
    
            $fecha = $tiempo->toDateString();
            $hora = $tiempo->toTimeString();
    
            if ($fechaProxima == '') {
                $fechaProxima = $fecha;
            }
            
            $vehis = new VehiculoHistorial();
            $vehis->setConnection($connection);
            $vehiculoHistoria = $vehis->find($idVehiculoHistoria);
    
            $vehiculoHistoria->fecha = $fecha;
            $vehiculoHistoria->diagnosticoentrada = $diagnosticoEntrada;
            $vehiculoHistoria->trabajoshechos = $trabajoHecho;
            $vehiculoHistoria->kmactual = $kmActual;
            $vehiculoHistoria->kmproximo = $kmProximo;
            $vehiculoHistoria->fechaproxima = $fechaProxima;
    
            $vehiculoHistoria->fechahoratransaccion = $fecha.' '.$hora;
    
            $vehiculoHistoria->precio = $precio;
            $vehiculoHistoria->notas = $nota;
            $vehiculoHistoria->idusuario = 1;
            $vehiculoHistoria->fkidvehiculo = $idVehiculo;
            $vehiculoHistoria->setConnection($connection);
            $vehiculoHistoria->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el vehiculohistoria ' . $vehiculoHistoria->idvehiculohistoria;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1, 
                'data' => 'Exito'
            ]);
        /*} catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar con la base de datos'
            ]);
        }*/
        
    }

    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->input('id');
            $vehis = new VehiculoHistorial();
            $vehis->setConnection($connection);
            $vehiculoHistoria = $vehis->find($id);

            if ($vehiculoHistoria->fkidventa != null){
                return response()->json(array('response' => 0, 'data' => 'exito'));
            }
            $vehiculoHistoria->setConnection($connection);
            $vehiculoHistoria->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el vehiculohistoria ' . $vehiculoHistoria->idvehiculohistoria;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1, 
                'data' => 'Exito'
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar con la base de datos'
            ]);
        }
        
    }

    
    public function getNroHistorico() {

        try {

            $data = VehiculoHistorial::all();
            $nro_historico = $data->count() + 1;

            return response()->json([
                'response' => 1,
                'nro_historico' => $nro_historico
            ]);
            
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar con la base de datos'
            ]);
        }
    }
    
}
