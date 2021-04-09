<?php

namespace App\Http\Controllers\Comercio\Taller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Image;
use App\Models\Comercio\Ventas\Cliente;

use Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\Comercio\Taller\DetalleVehiculoCaracteristica;
use App\Models\Comercio\Taller\VehiculoCaracteristica;
use App\Models\Comercio\Taller\Vehiculo;
use App\Models\Comercio\Taller\VehiculoFoto;
use App\Models\Comercio\Taller\VehiculoTipo;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Models\Config\ConfigCliente;

class VehiculoController extends Controller
{
    public function index(Request $request)
    {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $buscar = $request->buscar;
            $paginacion = $request->pagina;

            $veh = new Vehiculo();
            $veh->setConnection($connection);
            if ($buscar == '') {

                $vehiculo = $veh->leftJoin('cliente', 'vehiculo.fkidcliente', 'cliente.idcliente')
                    ->select('vehiculo.placa', 'vehiculo.codvehiculo', 'vehiculo.tipopartpublic',
                        'vehiculo.chasis', 'cliente.nombre', 'cliente.apellido', 'vehiculo.idvehiculo')
                    ->orderBy('vehiculo.idvehiculo', 'desc')
                    ->paginate($paginacion);

            } else {
                $vehiculo = $veh->leftJoin('cliente', 'vehiculo.fkidcliente', 'cliente.idcliente')
                    ->select('vehiculo.placa', 'vehiculo.codvehiculo', 'vehiculo.tipopartpublic',
                        'vehiculo.chasis', 'cliente.nombre', 'cliente.apellido', 'vehiculo.idvehiculo')
                    ->where('vehiculo.placa', 'ilike', '%'.$buscar.'%')
                    ->orWhere('vehiculo.idvehiculo', 'ilike', '%'.$buscar.'%')
                    ->orWhere('vehiculo.codvehiculo', 'ilike', '%'.$buscar.'%')
                    ->orwhere(DB::raw("CONCAT(cliente.nombre, ' ',cliente.apellido)"), 'ilike', '%'.$buscar.'%')
                    ->orderBy('vehiculo.idvehiculo', 'desc')
                    ->paginate($paginacion);
                
            }

            return [
                'pagination' => [
                    'total'        => $vehiculo->total(),
                    'current_page' => $vehiculo->currentPage(),
                    'per_page'     => $vehiculo->perPage(),
                    'last_page'    => $vehiculo->lastPage(),
                    'from'         => $vehiculo->firstItem(),
                    'to'           => $vehiculo->lastItem(),
                ],
                'vehiculo' => $vehiculo, 'pagina' => $paginacion, 'buscar' => $buscar
            ];
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
        
    }

    public function getVehiculos(Request $request){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $veh = new Vehiculo();
            $veh->setConnection($connection);

            // $vehiculos = $veh->orderBy('idvehiculo', 'ASC')->paginate(10);

            $vehiculos = $veh->leftJoin('cliente', 'vehiculo.fkidcliente', 'cliente.idcliente')
                            ->select('vehiculo.placa', 'vehiculo.codvehiculo', 'vehiculo.tipopartpublic',
                                    'vehiculo.chasis', 'cliente.nombre', 'cliente.apellido', 'vehiculo.idvehiculo')
                            ->orderBy('vehiculo.idvehiculo', 'desc')
                            ->paginate(10);
            $data = $vehiculos->getCollection();
            $pagination = array(
                "total" => $vehiculos->total(),
                "current_page" => $vehiculos->currentPage(),
                "per_page" => $vehiculos->perPage(),
                "last_page" => $vehiculos->lastPage(),
                "first" => $vehiculos->firstItem(),
                "last" =>   $vehiculos->lastItem()
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
            $veh = new Vehiculo();
            $veh->setConnection($connection);

            $vehiculoBuscar = $veh->leftJoin('cliente', 'vehiculo.fkidcliente', 'cliente.idcliente')
                    ->select('vehiculo.placa', 'vehiculo.codvehiculo', 'vehiculo.tipopartpublic',
                        'vehiculo.chasis', 'cliente.nombre', 'cliente.apellido', 'vehiculo.idvehiculo')
                    ->where('vehiculo.placa', 'ilike', '%'.$buscar.'%')
                    ->orWhere('vehiculo.idvehiculo', 'ilike', '%'.$buscar.'%')
                    ->orWhere('vehiculo.codvehiculo', 'ilike', '%'.$buscar.'%')
                    ->orWhere('vehiculo.tipopartpublic', 'ilike', '%'.$buscar.'%')
                    ->orwhere(DB::raw("CONCAT(cliente.nombre, ' ',cliente.apellido)"), 'ilike', '%'.$buscar.'%')
                    ->orderBy('vehiculo.idvehiculo', 'desc')
                    ->paginate(10);
            $data = $vehiculoBuscar->getCollection();
            $pagination = array(
                'total' => $vehiculoBuscar->total(),
                'current_page' => $vehiculoBuscar->currentPage(),
                'per_page' => $vehiculoBuscar->perPage(),
                'last_page' => $vehiculoBuscar->lastPage(),
                'first' => $vehiculoBuscar->firstItem(),
                'last' =>   $vehiculoBuscar->lastItem()
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
            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $vehiculos = $veh->leftJoin('cliente', 'vehiculo.fkidcliente', 'cliente.idcliente')
                                ->select('vehiculo.placa', 'vehiculo.codvehiculo', 'vehiculo.tipopartpublic',
                                        'vehiculo.chasis', 'cliente.nombre', 'cliente.apellido', 'vehiculo.idvehiculo')
                                ->orderBy('vehiculo.idvehiculo', 'desc')
                                ->paginate($cantidadPagina);
            $data = $vehiculos->getCollection();
            $pagination = array(
                'total' => $vehiculos->total(),
                'current_page' => $vehiculos->currentPage(),
                'per_page' => $vehiculos->perPage(),
                'last_page' => $vehiculos->lastPage(),
                'first' => $vehiculos->firstItem(),
                'last' =>   $vehiculos->lastItem()
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

    public function showCliente(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $cli = new Clientes();
            $cli->setConnection($connection);

            $cliente = $cli->orderBy('idcliente', 'desc')->get();
            return response()->json([
                'ok' => true,
                'cliente' => $cliente
            ]);
            //return ['ok'=> true, 'cliente'=>$cliente];
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
        

    }

    public function getCliente(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $cli = new Clientes();
            $cli->setConnection($connection);
            $buscar = $request->buscar;
            if ($buscar == ''){

                $cliente = $cli->orderBy('idcliente', 'desc')
                    ->paginate(20);

            } else {

                $cliente = $cli->where('codcliente', 'ilike', '%'.$buscar.'%')
                    ->orWhere('nombre', 'ilike', '%'.$buscar.'%')
                    ->orWhere('apellido', 'ilike', '%'.$buscar.'%')
                    ->orderBy('idcliente', 'desc')
                    ->paginate(30);

            }

            return [
                'pagination' => [
                    'total'        => $cliente->total(),
                    'current_page' => $cliente->currentPage(),
                    'per_page'     => $cliente->perPage(),
                    'last_page'    => $cliente->lastPage(),
                    'from'         => $cliente->firstItem(),
                    'to'           => $cliente->lastItem(),
                ],
                'cliente' => $cliente
            ];
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
        

    }

    public function create(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $cliente = $cli->orderBy('idcliente', 'desc')->paginate(20);

            $veh = new VehiculoTipo();
            $veh->setConnection($connection);
            $vehiculoTipo = $veh->orderBy('idvehiculotipo', 'asc')->get();

            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);
            $caracteristica = $vehc->select('idvehiculocaracteristica as id', 'caracteristica as title')
                ->orderBy('idvehiculocaracteristica', 'asc')->get();

            /*
            $config = DB::connection($connection)
                ->table('configcliente')
                ->whereNull('deleted_at')
                ->orderBy('idconfigcliente', 'asc')
                ->first();
            */
            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();

            return response()->json([
                'response' => 1, 
                'vehiculo_caracteristica' => $caracteristica, 
                'cliente' => $cliente,
                'vehiculo_tipo' => $vehiculoTipo,
                'config' => $config,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion',
                'error' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'message' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }

    }

    public function reporte(Request $request) {

        if (!$request->ajax()) {
            return view('commerce::admin.template');
        }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);
            $caracteristica = $vehc->orderBy('idvehiculocaracteristica', 'desc')->get();

            $veht = new VehiculoTipo();
            $veht->setConnection($connection);
            $vehiculoTipo = $veht->orderBy('idvehiculotipo', 'asc')->get();

            return response()->json([
                'response' => 1,
                'data' => $caracteristica,
                'vehiculoTipo' => $vehiculoTipo
            ]);
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }

        
    }

    public function store(Request $request)
    {

        if ($request->input('chasisVehiculo') != '') {
            $reglas = [
                'chasisVehiculo' => 'required|unique:vehiculo,chasis'
            ];
    
            $mensajes = [
                'chasisVehiculo.unique' => 'El campo existe'
            ];
    
            $validacion = Validator::make($request->all(), $reglas, $mensajes);
    
            if ($validacion->fails()) {
                return response()->json(array('response' => 2, 'data' => 'Ya existe'));
            }
        }

        if (($request->filled('placaVehiculo')) &&
            ($request->filled('idCliente')) &&
            ($request->filled('tipoVehiculo')) && ($request->filled('tipo')))
        {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            try {

                DB::beginTransaction();

                $codigo = $request->input('codigoVehiculo');
                $placa = $request->input('placaVehiculo');
                $chasis = $request->input('chasisVehiculo');
                $idCliente = $request->input('idCliente');
                $tipoPartPublic = $request->input('tipoVehiculo');
                $tipoVehiculo = $request->input('tipo');

                $nota = $request->input('notaVehiculo');
                $descripcion = $request->input('descripcionVehiculo');

                $imagen = json_decode($request->input('imagenVehiculo'));

                $caracteristica = json_decode($request->input('caracteristica'));
                $detalleCaracteristica = json_decode($request->input('detalleCaracteristica'));

                $vehiculo = new Vehiculo();

                $vehiculo->placa = $placa;
                $vehiculo->codvehiculo = $codigo;
                $vehiculo->tipopartpublic = $tipoPartPublic;
                $vehiculo->chasis = $chasis;
                $vehiculo->descripcion = $descripcion;
                $vehiculo->notas = $nota;
                $vehiculo->fkidcliente = $idCliente;
                $vehiculo->fkidvehiculotipo = $tipoVehiculo;

                $vehiculo->setConnection($connection);
                $vehiculo->save();

                $contador = 0;

                while ($contador < sizeof($caracteristica)){
                    if (($caracteristica[$contador] != '') and ($detalleCaracteristica[$contador] != '')){
                        $detalle = new DetalleVehiculoCaracteristica();

                        $detalle->descripcion = $detalleCaracteristica[$contador];
                        $detalle->fkidvehiculo = $vehiculo->idvehiculo;
                        $detalle->fkidvehiculocaracteristica = $caracteristica[$contador];
                        $detalle->setConnection($connection);
                        $detalle->save();
                    }
                    $contador = $contador + 1;
                }
                
                $contador = 0;

                while ($contador < sizeof($imagen)){

                    $image = Image::make($imagen[$contador]);
                    $image->resize(700,null,function($constraint){
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    }); 
                    $imageData = (string)$image->encode('jpg',30);
                    $name = time().$contador;
                    $nameHash = md5($name);
                    $path = "public/vehiculo/Img/".$nameHash.'.'.explode('/', explode(':', substr($imagen[$contador], 0, strpos($imagen[$contador], ';')))[1])[1];
                    Storage::put($path, $imageData); 
                    $pathAbsolute = "/storage/vehiculo/Img/".$nameHash.'.'.explode('/', explode(':', substr($imagen[$contador], 0, strpos($imagen[$contador], ';')))[1])[1];

                    $vehiculoFoto = new VehiculoFoto();
                    $vehiculoFoto->fkidvehiculo = $vehiculo->idvehiculo;
                    $vehiculoFoto->foto = $pathAbsolute;
                    $vehiculoFoto->setConnection($connection);
                    $vehiculoFoto->save();

                    $contador = $contador + 1;
                }
                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto el vehiculo ' . $vehiculo->idvehiculo;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1, 
                    'data' => 'Insertado correctamente'
                ]);

            } catch (DecryptException $e) {
                DB::rollBack();
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelvav a iniciar sesion'
                ]);
            } catch (\Throwable $th) {
                DB::rollBack();
                return response()->json(array('response' => 0, 'data' => 'Hubo un error al registrar datos'));
            }

        }
    }

    public function show(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $vehiculo = $veh->leftJoin('cliente', 'vehiculo.fkidcliente', 'cliente.idcliente')
                ->leftJoin('vehiculotipo', 'vehiculo.fkidvehiculotipo', 'vehiculotipo.idvehiculotipo')
                ->select('vehiculo.placa', 'vehiculo.codvehiculo', 'vehiculo.tipopartpublic', 'vehiculotipo.descripcion',
                    'vehiculo.chasis', 'cliente.idcliente','cliente.nombre', 'cliente.apellido', 'vehiculo.idvehiculo', 'vehiculo.notas', 
                    'vehiculo.descripcion as detalle', 'cliente.codcliente', 'vehiculo.created_at')
                ->where('vehiculo.idvehiculo', '=', $id)
                ->first();

            $vehf = new VehiculoFoto();
            $vehf->setConnection($connection);
            $vehiculoFoto = $vehf->where('fkidvehiculo', '=', $id)
                ->orderBy('idvehiculofoto', 'desc')->get();

            $det = new DetalleVehiculoCaracteristica();
            $det->setConnection($connection);
            $vehiculoCracteristica = $det->leftJoin('vehiculocaracteristica', 'vehiculocaracdetalle.fkidvehiculocaracteristica', 'vehiculocaracteristica.idvehiculocaracteristica')
                ->select('vehiculocaracteristica.caracteristica', 'vehiculocaracdetalle.descripcion')
                ->where('vehiculocaracdetalle.fkidvehiculo', '=', $id)->get();

            return response()->json([
                'response' => 1, 
                'data' => $vehiculo, 
                'foto' => $vehiculoFoto, 
                'caracteristica' => $vehiculoCracteristica
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json(array('response' => 0, 'data' => 'Hubo un error al registrar datos'));
        }
        
    }

    public function getDetalle(Request $request, $id) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $det = new DetalleVehiculoCaracteristica();
            $det->setConnection($connection);
            $detalle = $det->where('fkidvehiculo', '=', $id)
                        ->orderBy('idvehiculocaracdetalle', 'asc')
                        ->get();

            return response()->json([
                'ok' => true,
                'data' => $detalle
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0, 
                'data' => 'Hubo un error al registrar datos'
            ]);
        }
    }

    public function getVehiculo(Request $request) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            
            $detalleVehiculo = DB::connection($connection)
                ->table('vehiculo as v')
                ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                ->join('cliente as c', 'c.idcliente', '=', 'v.fkidcliente')
                ->Select('v.idvehiculo', 'v.placa', 'v.codvehiculo', 'vt.descripcion as vehiculotipo', 
                        'v.fkidvehiculotipo', 'c.idcliente', 'c.codcliente', 'c.nombre', 'c.apellido')
                ->where([
                    'v.fkidcliente' => $id,
                    'v.deleted_at' => null,
                    'vt.deleted_at' => null,
                    'c.deleted_at' => null,
                ])
                ->get();
            
            return response()->json([
                'response' => 1,
                'data' => $detalleVehiculo
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion',
                'error' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'message' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0, 
                'message' => 'Ocurrio un poblema al procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
        
    }

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $vehiculo = $veh->leftJoin('cliente', 'vehiculo.fkidcliente', 'cliente.idcliente')
                ->select('vehiculo.placa', 'vehiculo.codvehiculo', 'vehiculo.tipopartpublic',
                    'vehiculo.chasis', 'cliente.idcliente' ,'cliente.codcliente' , 'cliente.nombre', 'cliente.apellido',
                    'vehiculo.idvehiculo', 'vehiculo.descripcion', 'vehiculo.notas', 'vehiculo.fkidcliente',
                    'vehiculo.fkidvehiculotipo')
                ->where('vehiculo.idvehiculo', '=', $id)
                ->first();

            $vehf = new VehiculoFoto();
            $vehf->setConnection($connection);
            $vehiculoFoto = $vehf->where('fkidvehiculo', '=', $id)->get();

            $veht = new VehiculoTipo();
            $veht->setConnection($connection);
            $vehiculoTipo = $veht->orderBy('idvehiculotipo', 'asc')->get();

            $cli = new Cliente();
            $cli->setConnection($connection);
            $cliente = $cli->orderBy('idcliente', 'asc')->paginate(30);

            $det = new DetalleVehiculoCaracteristica();
            $det->setConnection($connection);
            $detalle = $det->where('fkidvehiculo', '=', $id)
                            ->orderBy('idvehiculocaracdetalle', 'asc')
                            ->get();

            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);
            $caracteristica = $vehc->orderBy('idvehiculocaracteristica', 'desc')
                                    ->get();
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->decrypt();

            return response()->json([
                'ok'=> true, 
                'data'=> $vehiculo, 
                'foto' => $vehiculoFoto,
                'vehiculoTipo' => $vehiculoTipo,
                'caracteristica' => $caracteristica, 
                'cliente' => $cliente,
                'detalle' => $detalle,
                'config' => $configs,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1, 
                'data' => 'Hubo un error al registrar datos'
            ]);
        }
        
    }

    public function update(Request $request)
    {
        DB::beginTransaction();

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->input('idvehiculo');
            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $vehiculoPrueba = $veh->find($id);

            if ($vehiculoPrueba->chasis != $request->input('chasisVehiculo')){
                
                $reglas = [
                    'chasisVehiculo' => 'required|unique:vehiculo,chasis'
                ];
        
                $mensajes = [
                    'chasisVehiculo.unique' => 'El campo existe'
                ];
        
                $validacion = Validator::make($request->all(), $reglas, $mensajes);
        
                if ($validacion->fails()){
                    return response()->json(array('response' => 2, 'data' => 'Ya existe'));
                }
            
            } 


            $codigo = $request->input('codigoVehiculo');
            $placa = $request->input('placaVehiculo');
            $chasis = $request->input('chasisVehiculo');
            $idCliente = $request->input('idCliente');
            $tipoPartPublic = $request->input('tipoVehiculo');
            $tipoVehiculo = $request->input('tipo');

            $nota = $request->input('notaVehiculo');
            $descripcion = $request->input('descripcionVehiculo');

            $caracteristica = json_decode($request->input('caracteristica'));
            $detalleCaracteristica = json_decode($request->input('detalleCaracteristica'));

            $idVehiculo = $request->input('idvehiculo');

            $detalleCaracteristicaOrigin = json_decode($request->input('items'));

            $arrayDelete = json_decode($request->input('arrayDelete'));

            $array = json_decode($request->input('array'));

            $imageDelete = json_decode($request->input('ImageDelete'));

            $imagen = json_decode($request->input('imagenVehiculo'));

            $vehiculo = $veh->find($idVehiculo);

            $vehiculo->placa = $placa;
            $vehiculo->codvehiculo = $codigo;
            $vehiculo->tipopartpublic = $tipoPartPublic;
            $vehiculo->chasis = $chasis;
            $vehiculo->descripcion = $descripcion;
            $vehiculo->notas = $nota;
            $vehiculo->fkidcliente = $idCliente;
            $vehiculo->fkidvehiculotipo = $tipoVehiculo;
            $vehiculo->setConnection($connection);
            $vehiculo->update();

            $contador = 0;

            $detveh = new DetalleVehiculoCaracteristica();
            $detveh->setConnection($connection);
            while ($contador < sizeof($caracteristica)){
                if (($caracteristica[$contador] != '') and ($detalleCaracteristica[$contador] != '')){

                    if ($detalleCaracteristicaOrigin[$contador] != ''){
                        $detalle = $detveh->find($detalleCaracteristicaOrigin[$contador]);
                        $detalle->descripcion = $detalleCaracteristica[$contador];
                        $detalle->fkidvehiculo = $idVehiculo;
                        $detalle->setConnection($connection);
                        $detalle->update();

                    }else{
                        $detalle = new DetalleVehiculoCaracteristica();

                        $detalle->descripcion = $detalleCaracteristica[$contador];
                        $detalle->fkidvehiculo = $idVehiculo;
                        $detalle->fkidvehiculocaracteristica = $caracteristica[$contador];
                        $detalle->setConnection($connection);
                        $detalle->save();
                    }
                }

                $contador = $contador + 1;
            }

            $contador = 0;
            $detveh = new DetalleVehiculoCaracteristica();
            $detveh->setConnection($connection);
            while ($contador < sizeof($arrayDelete)) {
                $detveh->find($arrayDelete[$contador])->delete();
                $contador = $contador + 1;
            }

            $contador = 0;
            $vehf = new VehiculoFoto();
            $vehf->setConnection($connection);
            while ($contador < sizeof($imageDelete)) {
                $vehf->find($imageDelete[$contador])->delete();
                $contador = $contador + 1;
            }

            $contador = 0;

            while($contador < sizeof($imagen)) {

                if ($imagen[$contador]->idvehiculofoto == 0) {

                    $image = Image::make($imagen[$contador]->foto);
                    
                    $image->resize(700,null,function($constraint){
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    }); 

                    $imageData = (string)$image->encode('jpg',30);
                    $name = time().$contador;
                    $nameHash = md5($name);
                    $path = "public/vehiculo/Img/".$nameHash.'.'.explode('/', explode(':', substr($imagen[$contador]->foto, 0, strpos($imagen[$contador]->foto, ';')))[1])[1];
                    Storage::put($path, $imageData); 
                    $pathAbsolute = "/storage/vehiculo/Img/".$nameHash.'.'.explode('/', explode(':', substr($imagen[$contador]->foto, 0, strpos($imagen[$contador]->foto, ';')))[1])[1];

                    $vehiculoFoto = new VehiculoFoto();
                    $vehiculoFoto->fkidvehiculo = $idVehiculo;
                    $vehiculoFoto->foto = $pathAbsolute;
                    $vehiculoFoto->setConnection($connection);
                    $vehiculoFoto->save();
                }
                $contador = $contador + 1;
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el vehiculo ' . $vehiculo->idvehiculo;
            $log->guardar($request, $accion);
            
            DB::commit();
            return response()->json(array('response' => 1, 'data' => 'Insertado correctamente'));

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => 0, 
                'data' => 'Hubo un error al registrar datos'
            ]);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $result = DB::connection($connection)->table('vehiculo as v')
                            ->join('venta as ve', 've.fkidvehiculo', '=', 'v.idvehiculo')
                            ->where([
                                'v.idvehiculo' => $id,
                                'v.deleted_at' => null,
                                've.deleted_at' => null
                            ])
                            ->get();
            if ($result->count() > 0) {
                return response()->json([
                    'response' => 0,
                    'message' => 'No se puede eliminar el vehiculo, ya se encuentra en una venta',
                    'data' => $result
                ]);
            }

            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $veh->find($id)->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el vehiculo ' . $id;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1, 
                'data' => 'Se eleimino correctamente'
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor al eliminar'
            ]);
        }
        
    }
    /**METODOS IMPLEMENTADOS POR ALEX */

    public function SearchByIdCod(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $result = $veh->SearchByIdCod($value)->get();

            return response()->json([
                'response' => 1,
                'data' => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelve a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al conectarse'
            ]);
        }
    }

    public function SearchByPlaca(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $result = $veh->SearchByPlaca($value)->get();
            return response()->json([
                'response' => 1,
                'data' => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelve a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al conectarse'
            ]);
        }
    }

    public function SearchByIdCodCli(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;
            $idcliente = $request->idcliente;

            if ($value == '') {
                $vehiculos = DB::connection($connection)
                    ->table('vehiculo as v')
                    ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                    ->Select('v.idvehiculo', 'v.placa', 'v.codvehiculo', 'vt.descripcion as vehiculotipo')
                    ->where('v.fkidcliente', '=', $idcliente)
                    ->whereNull('v.deleted_at')
                    ->whereNull('vt.deleted_at')
                    ->orderBy('v.idvehiculo', 'asc')
                    ->get();
            }else {
                $vehiculos = DB::connection($connection)
                    ->table('vehiculo as v')
                    ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                    ->Select('v.idvehiculo', 'v.placa', 'v.codvehiculo', 'vt.descripcion as vehiculotipo')
                    ->where('v.fkidcliente', '=', $idcliente)
                    ->where(function($query) use ($value) {
                        return $query->orWhere('v.codvehiculo', 'ILIKE', '%'.$value.'%')
                                    ->orWhere('v.idvehiculo', 'ILIKE', '%'.$value.'%');
                    })
                    ->whereNull('v.deleted_at')
                    ->whereNull('vt.deleted_at')
                    ->orderBy('v.idvehiculo', 'asc')
                    ->get();
            }

            return response()->json([
                'response' => 1,
                'data' => $vehiculos,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelve a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al conectarse'
            ]);
        }
    }

    public function SearchByPlacaCli(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;
            $idcliente = $request->idcliente;

            if ($value == '') {
                $vehiculos = DB::connection($connection)
                    ->table('vehiculo as v')
                    ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                    ->Select('v.idvehiculo', 'v.placa', 'v.codvehiculo', 'vt.descripcion as vehiculotipo')
                    ->where('v.fkidcliente', '=', $idcliente)
                    ->whereNull('v.deleted_at')
                    ->whereNull('vt.deleted_at')
                    ->orderBy('v.idvehiculo', 'asc')
                    ->get();
            }else {
                $vehiculos = DB::connection($connection)
                    ->table('vehiculo as v')
                    ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                    ->Select('v.idvehiculo', 'v.placa', 'v.codvehiculo', 'vt.descripcion as vehiculotipo')
                    ->where('v.fkidcliente', '=', $idcliente)
                    ->where('v.placa', 'ILIKE', '%'.$value.'%')
                    ->whereNull('v.deleted_at')
                    ->whereNull('vt.deleted_at')
                    ->orderBy('v.idvehiculo', 'asc')
                    ->get();
            }

            return response()->json([
                'response' => 1,
                'data' => $vehiculos
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelve a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al conectarse'
            ]);
        }
    }

    public function codigoValido(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $count = $veh->where('codvehiculo', $value)->count();
            if ($count > 0) {
                return response()->json([
                    'response' => 1,
                    'valido' => false
                ]);
            } else {
                return response()->json([
                    'response' => 1,
                    'valido' => true
                ]);
            }
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelve a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }
}
