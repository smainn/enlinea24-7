<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Ventas\Cliente;
use App\Models\Comercio\Ventas\ClienteContactarlo;
use App\Models\Comercio\Ventas\Ciudad;
use App\Models\Comercio\Ventas\ClienteTipo;
use App\Models\Comercio\Ventas\ReferenciaDeContacto;
use App\Models\Seguridad\Usuario;
use App\Models\Seguridad\Log;
use App\Models\Config\ConfigCliente;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

use Image;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

use PDF;

use Maatwebsite\Excel\Facades\Excel;

class ClienteController extends Controller
{
    public function index(Request $request){
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $clientes = new Cliente();
            $clientes->setConnection($connection);

            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $buscar = $request->filled('buscar') ? $request->get('buscar') : '';

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->decrypt();

            if($buscar != ''){
                $datos = $clientes->leftJoin('ciudad as c', 'c.idciudad', 'cliente.fkidciudad')
                    ->leftJoin('clientetipo as ct', 'ct.idclientetipo', 'cliente.fkidclientetipo')
                    ->select('cliente.idcliente', 'cliente.codcliente', 'cliente.nombre', 'cliente.apellido',
                             'cliente.nit', 'cliente.sexo', 'cliente.tipopersoneria', 'cliente.fechanac',
                             'cliente.notas', 'cliente.contacto', 'c.descripcion as ciudad',
                             'ct.descripcion as tipocliente')
                    ->orWhere('cliente.idcliente', 'LIKE', "%$request->buscar%")
                    ->orWhere('cliente.codcliente', 'ILIKE', "%$request->buscar%")
                    ->orWhere('cliente.nombre', 'ILIKE', "%$request->buscar%")
                    ->orWhere('cliente.apellido', 'ILIKE', "%$request->buscar%")
                    ->orWhere('cliente.nit', 'ILIKE', "%$request->buscar%")
                    ->orWhere('c.descripcion', 'ILIKE', "%$request->buscar%")
                    ->orWhere('ct.descripcion', 'ILIKE', "%$request->buscar%")
                    ->orderBy('cliente.idcliente', 'desc')
                    ->paginate($paginate);
            }else{
                $datos = $clientes->leftJoin('ciudad as c', 'c.idciudad', 'cliente.fkidciudad')
                    ->leftJoin('clientetipo as ct', 'ct.idclientetipo', 'cliente.fkidclientetipo')
                    ->select('cliente.idcliente', 'cliente.codcliente', 'cliente.nombre', 'cliente.apellido',
                             'cliente.nit', 'cliente.sexo', 'cliente.tipopersoneria', 'cliente.fechanac',
                             'cliente.notas', 'cliente.contacto', 'c.descripcion as ciudad',
                             'ct.descripcion as tipocliente')
                    ->orderBy('cliente.idcliente', 'desc')
                    ->paginate($paginate);
            }

            $datosClientes = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'from' => $datos->firstItem(),
                'to' =>   $datos->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $datosClientes,
                'config' => $configs
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

    public function getClientes(Request $request, $paginate) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $datos = $cli->orderBy('idcliente', 'ASC')->paginate($paginate);
            $clientes = $datos->getCollection();

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
                'data' => $clientes
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo obtener los clientes'
            ]);
        }
    }


    public function getBusqueda(Request $request, $buscar){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $clienteBusqueda = $cli->where('idcliente', 'ilike', '%'.$buscar.'$')
                                ->orwhere('codcliente', 'ilike', '%'.$buscar.'%')
                                ->orwhere(DB::raw("CONCAT(nombre, ' ', apellido)"), 'ilike', '%'.$buscar.'%')
                                ->orwhere('nit', 'ilike', '%'.$buscar.'%')
                                ->paginate(10);
            $clientes = $clienteBusqueda->getCollection();
            $pagination = array(
                'total' => $clienteBusqueda->total(),
                'current_page' => $clienteBusqueda->currentPage(),
                'per_page' => $clienteBusqueda->perPage(),
                'last_page' => $clienteBusqueda->lastPage(),
                'first' => $clienteBusqueda->firstItem(),
                'last' =>   $clienteBusqueda->lastItem()
            );
            return [
                'response' => 1,
                'buscar' => $buscar,
                'pagination' => $pagination,
                'cliente' => $clientes
            ];
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function changeSizePagination(Request $request, $cantPagina) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $datos = $cli->orderBy('idcliente', 'ASC')->paginate($cantPagina);
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
            return view('sistema.index');
        }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $tipo_cliente = DB::connection($connection)
                ->table('clientetipo')
                ->whereNull('deleted_at')
                ->orderBy('idclientetipo', 'asc')
                ->get();

            $ciudad = DB::connection($connection)
                ->table('ciudad')
                ->whereNull('deleted_at')
                ->orderBy('idciudad', 'asc')
                ->get();

            $referencia_contacto = DB::connection($connection)
                ->table('referenciadecontacto')
                ->select('idreferenciadecontacto as id', 'descripcion as title')
                ->whereNull('deleted_at')
                ->orderBy('idreferenciadecontacto', 'asc')
                ->get();
                

            /*$config = DB::connection($connection)
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
                "response" => 1,
                'tipo_cliente' => $tipo_cliente,
                'ciudad' => $ciudad,
                'referencia_contacto' => $referencia_contacto,
                'config' => $config,
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

        try {
            DB::beginTransaction();
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $codigo = $request->input('codigoCliente');
            $nombre = $request->input('nombreCliente');
            $apellido = $request->input('apellidoCliente');
            $nit = $request->input('nitCliente');
            $foto = $request->input('fotoCliente');
            $sexo = $request->input('sexoCliente');
            $tipopersoneria = $request->input('tipoPersoneriaCliente');
            $fechanac = $request->input('fechaNacimientoCliente');
            $notas = $request->input('notasCliente');
            $contacto = $request->input('contactoCliente');
            $fkidciudad = $request->input('fkidciudad');
            $fkidtipocliente = $request->input('fkidtipocliente');
            $datosParaContactarlo = json_decode($request->input('datosTablaIntermedia'));


            if ($nit === "") {
                $nit = null;
            } else if($fechanac === "") {
                $fechanac = null;
            } else if($notas === "") {
                $notas = null;
            } else if($contacto === "") {
                $contacto = null;
            }
            //try{
                if ($foto != '' && $foto != null) {
                    // $imagenes = explode(',',$request->input('fotoCliente'));
                    $image = Image::make($foto);
                    $image->resize(700,null,function($constraint){
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    $imageData = (string)$image->encode('jpg',30);
                    $name = time();
                    $nameHash = md5($name);
                    $path = "public/Cliente/Img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];
                    Storage::put($path, $imageData);
                    $pathabsoluto = "/storage/Cliente/Img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];;
                    $foto = $pathabsoluto;
                } else {
                    $foto = null;
                }

                $cliente = new Cliente();
                $cliente->setConnection($connection);
                $cliente->codcliente = $codigo;
                $cliente->nombre = $nombre;
                $cliente->apellido = $apellido;
                $cliente->nit = $nit;
                $cliente->foto = $foto;
                $cliente->sexo = $sexo;
                $cliente->tipopersoneria = $tipopersoneria;
                $cliente->fechanac = $fechanac;
                $cliente->notas = $notas;
                $cliente->contacto = $contacto;
                $cliente->fkidciudad = $fkidciudad;
                $cliente->fkidclientetipo = $fkidtipocliente;

                if ($cliente->save()) {
                    if(is_array($datosParaContactarlo) && count($datosParaContactarlo) > 0){
                        foreach ($datosParaContactarlo as $item => $valor) {
                            $clienteContacto = new ClienteContactarlo();
                            $clienteContacto->setConnection($connection);
                            $clienteContacto->valor = $valor->valor;
                            $clienteContacto->fkidcliente = $cliente->idcliente;
                            $clienteContacto->fkidreferenciadecontacto =  $valor->fkidreferenciacontacto;
                            $clienteContacto->save();
                        }
                    }

                    $log = new Log();
                    $log->setConnection($connection);
                    $accion = 'Inserto el cliente ' . $cliente->idcliente;
                    $log->guardar($request, $accion);

                    DB::commit();

                    return response()->json([
                        "response" => 1,
                        'cliente' => $cliente
                    ]);

                } else {
                    DB::rollBack();
                    return response()->json(array("response" => 0,"data" => "no se registro correctamente"));

                }
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(array("response" => -1,"data" => "ocurrio un error en el servidor intentelo nuevamente"));
        }

    }

    public function show(Request $request, $id)
    {
        // parece que no hace nada
        /*$clienteContacto = ClienteContactarlo::where('fkidcliente',$id)->get();
        return $request;
        */
        return null;
    }
    public function showCliente(Request $request){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->input('idCliente');

            $cliente = DB::connection($connection)
                ->table('cliente as cli')
                ->join('ciudad as ciu', 'cli.fkidciudad', '=', 'ciu.idciudad')
                ->join('clientetipo as ct', 'cli.fkidclientetipo', '=', 'ct.idclientetipo')
                ->select('cli.codcliente', 'cli.nombre', 'cli.apellido', 'cli.nit', 'cli.foto',
                    'cli.sexo', 'cli.tipopersoneria', 'cli.fechanac', 'cli.notas', 'cli.contacto',
                    'ciu.descripcion as ciudad', 'ct.descripcion as tipo', 'cli.idcliente', 'cli.created_at')
                ->where('cli.idcliente', '=', $id)
                ->first();

            $clienteContactarlo = DB::connection($connection)
                ->table('clientecontactarlo as clicont')
                ->join('referenciadecontacto as refcont', 'clicont.fkidreferenciadecontacto', '=', 'refcont.idreferenciadecontacto')
                ->select('clicont.valor', 'refcont.descripcion')
                ->where('clicont.fkidcliente', '=', $id)
                ->whereNull('clicont.deleted_at')
                ->whereNull('refcont.deleted_at')
                ->get();

            return response()->json(array(
                'response' => 1,
                'cliente' => $cliente,
                'clientecontacto' => $clienteContactarlo
            ));
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }

    }

    public function refresh(Request $request) {
        if (!$request->ajax()) {
            return view('commerce::admin.template');
        }
    }

     public function edit(Request $request, $id)
    {
        if (!$request->ajax()) {
            return view('sistema.index');
        }
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $cliente = $cli->find($id);

            $clic = new ClienteContactarlo();
            $clic->setConnection($connection);
            $clienteContacto = $clic->where('fkidcliente',$id)->get();

            $tipo_cliente = DB::connection($connection)
                ->table('clientetipo')
                ->whereNull('deleted_at')
                ->orderBy('idclientetipo', 'asc')
                ->get();

            $ciudad = DB::connection($connection)
                ->table('ciudad')
                ->whereNull('deleted_at')
                ->orderBy('idciudad', 'asc')
                ->get();

            $referencia_contacto = DB::connection($connection)
                ->table('referenciadecontacto')
                ->select('idreferenciadecontacto as id', 'descripcion as title')
                ->whereNull('deleted_at')
                ->orderBy('idreferenciadecontacto', 'asc')
                ->get();
                
            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();

            /*
                $config = DB::connection($connection)
                ->table('configcliente')
                ->whereNull('deleted_at')
                ->orderBy('idconfigcliente', 'asc')
                ->first();
            */
            
            return response()->json([
                "response" => 1,
                "data" => $cliente,
                "cliente_contacto" => $clienteContacto,
                'tipo_cliente' => $tipo_cliente,
                'ciudad' => $ciudad,
                'referencia_contacto' => $referencia_contacto,
                'config' => $config,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }

    }

    public function update($id,Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $codigo = $request->input('codigoCliente');
            $nombre = $request->input('nombreCliente');
            $apellido = $request->input('apellidoCliente');
            $nit = $request->input('nitCliente');
            $foto = $request->input('fotoCliente');
            $sexo = $request->input('sexoCliente');
            $tipopersoneria = $request->input('tipoPersoneriaCliente');
            $fechanac = $request->input('fechaNacimientoCliente');
            $notas = $request->input('notasCliente');
            $contacto = $request->input('contactoCliente');
            $fkidciudad = $request->input('fkidciudad');
            $fkidtipocliente = $request->input('fkidtipocliente');
            $datosParaContactarlo = json_decode($request->input('datosTablaIntermedia'));
            $idParaContactarlo = json_decode($request->input('idParaContactarlo'));
            $idParaContactarloEliminar = json_decode($request->input('idParaContactarloEliminar'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $cliente =  $cli->find($id);

            $clic = new ClienteContactarlo();
            $clic->setConnection($connection);
            $clienteContacto = $clic->where('fkidcliente',$id)->get();

            if ($nit === "") {
                $nit = null;
            } else if ($fechanac === "") {
                $fechanac = null;
            } else if ($notas === "") {
                $notas = null;
            } else if ($contacto === "") {
                $contacto = null;
            }

            if ($foto !== '' && $foto !== null &&  $cliente->foto !== $foto) {
                
                $image = Image::make($foto);
                $image->resize(700,null,function($constraint){
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                $imageData = (string)$image->encode('jpg',30);
                $name = time();
                $nameHash = md5($name);
                $path = "public/Cliente/Img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];

                Storage::put($path, $imageData);

                $pathabsoluto = "/storage/Cliente/Img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];
                $foto = $pathabsoluto;
            }

            $cliente->codcliente = $codigo;
            $cliente->nombre = $nombre;
            $cliente->apellido = $apellido;
            $cliente->nit = $nit;
            $cliente->foto = $foto;
            $cliente->sexo = $sexo;
            $cliente->tipopersoneria = $tipopersoneria;
            $cliente->fechanac = $fechanac;
            $cliente->notas = $notas;
            $cliente->contacto = $contacto;
            $cliente->fkidciudad = $fkidciudad;
            $cliente->fkidclientetipo = $fkidtipocliente;
            $cliente->setConnection($connection);

            if($cliente->save()) {
                $i = 0;
                $j = 0;
                $k = 0;
                if(count($datosParaContactarlo) > 0){

                    foreach ($datosParaContactarlo as $item => $valor) {


                        if ($i < count($idParaContactarlo)) {
                            $clienteContacto = $clic->find($idParaContactarlo[$i]);
                            $clienteContacto->valor = $valor->valor;
                            $clienteContacto->fkidcliente = $cliente->idcliente;
                            $clienteContacto->fkidreferenciadecontacto = $valor->fkidreferenciacontacto;
                            $clienteContacto->setConnection($connection);
                            $clienteContacto->save();
                            $j++;
                        } else {
                            $clienteContacto = new ClienteContactarlo();
                            $clienteContacto->valor = $valor->valor;
                            $clienteContacto->fkidcliente = $cliente->idcliente;
                            $clienteContacto->fkidreferenciadecontacto = $valor->fkidreferenciacontacto;
                            $clienteContacto->setConnection($connection);
                            $clienteContacto->save();
                            $k++;
                        }
                        $i++;
                    }
                }

                for ($i =0 ; $i < count($idParaContactarloEliminar); $i++) {
                    $clic->find($idParaContactarloEliminar[$i])->delete();
                }
                
                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito el cliente ' . $cliente->idcliente;
                $log->guardar($request, $accion);
                
                return response()->json(array("response" => 1,"data" => "se Registro Correctamente"));
            }else{
                return response()->json(array("response" => 0,"data" => "no se registro correctamente"));
            }
            //return $foto;
            //return response()->json(array("response" => 1,"data" => $clienteContacto,"data2" => $datosParaContactarlo,"data3" => $idParaContactarlo,"J"=>$j,"K"=> $k));
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'message' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $cliente = $cli->find($id);
            
            if ($cliente == null ) {
                return response()->json([
                    'response' => -1,
                    'message' => 'No existe el cliente'
                ]);
            }

            $vehiculo = DB::connection($connection)
                            ->table('cliente as c')
                            ->join('vehiculo as v', 'c.idcliente', '=', 'v.fkidcliente')
                            ->where('c.idcliente', '=', $id)
                            ->whereNull('v.deleted_at')
                            ->whereNull('c.deleted_at')
                            ->get();

            if (sizeof($vehiculo) > 0) {
                return response()->json(array("response" => 0, "data" => 'no se puede eliminar'));
            }

            $venta = DB::connection($connection)
                            ->table('cliente as c')
                            ->join('venta as v', 'c.idcliente', '=', 'v.fkidcliente')
                            ->where('c.idcliente', '=', $id)
                            ->whereNull('v.deleted_at')
                            ->whereNull('c.deleted_at')
                            ->get();

            if (sizeof($venta) > 0) {
                return response()->json(array("response" => 0, "data" => 'no se puede eliminar'));
            }

            $cliente->setConnection($connection);
            $cliente->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el cliente ' . $cliente->idcliente;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'message' => 'Se elimino correcta',
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }

    }

    /** METODOS AUXILIARES BY ALEX */

    public function SearchByIdCod(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;

            $cli = new Cliente();
            $cli->setConnection($connection);

            if ($value == '') {
                $cliente = $cli
                    ->select('idcliente', 'codcliente', 'nombre', 'apellido', 'nit')
                    ->orderBy('idcliente', 'desc')->get()->take(20);
            }else {
                $cliente = $cli
                    ->select('idcliente', 'codcliente', 'nombre', 'apellido', 'nit')
                    ->where('idcliente', 'ILIKE', '%'.$value.'%')
                    ->orWhere('codcliente', 'ILIKE', '%'.$value.'%')
                    ->orderBy('idcliente', 'asc')->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $cliente
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }

    }

    public function SearchByNombre(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;
            $cli = new Cliente();
            $cli->setConnection($connection);

            if ($value == '') {
                $cliente = $cli->select('idcliente', 'codcliente', 'nombre', 'apellido', 'nit')
                    ->orderBy('idcliente', 'desc')->get()->take(20);
            }else {
                $cliente = $cli
                    ->select('idcliente', 'codcliente', 'nombre', 'apellido', 'nit')
                    ->where(DB::raw("CONCAT(nombre, ' ' ,apellido)"), 'ILIKE', '%'.$value.'%')
                    ->orderBy('idcliente', 'asc')->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $cliente
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }

    }

    public function SearchByNit(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;
            $cli = new Cliente();
            $cli->setConnection($connection);

            if ($value == '') {
                $cliente = $cli->select('idcliente', 'codcliente', 'nombre', 'apellido', 'nit')
                    ->orderBy('idcliente', 'desc')->get()->take(20);
            }else {
                $cliente = $cli
                    ->select('idcliente', 'codcliente', 'nombre', 'apellido', 'nit')
                    ->where('nit', 'ILIKE', '%'.$value.'%')
                    ->orderBy('idcliente', 'asc')->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $cliente,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }

    }

    public function reporte(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $clientetipo = DB::connection($connection)
                            ->table('clientetipo')
                            ->whereNull('deleted_at')
                            ->orderBy('idclientetipo', 'desc')
                            ->get();

            $ciudad = DB::connection($connection)
                            ->table('ciudad')
                            ->whereNull('deleted_at')
                            ->orderBy('idciudad', 'desc')
                            ->get();

            $contacto = DB::connection($connection)
                            ->table('referenciadecontacto')
                            ->whereNull('deleted_at')
                            ->orderBy('idreferenciadecontacto', 'desc')
                            ->get();

            return response()->json([
                'response' => 1,
                'clientetipo' => $clientetipo,
                'ciudad' => $ciudad,
                'data' => $contacto,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo realizar la busquedad'
            ]);
        }

    }

    public function validarCodigo(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);
            $count = $cli->where('codcliente', $value)->count();
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

    public function getVentasCliente(Request $request, $idcliente) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();

            $condicion = [];
            
            if ($configCli->clienteesabogado == true) {
                $user = new Usuario();
                $user->setConnection($connection);
                $resp = $user->join('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                            ->join('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                            ->where('usuario.idusuario', $request->get('x_idusuario'))
                            ->where('g.esv', 'S')
                            ->first();
                if ($resp != null) {
                    $condicion['v.fkidvendedor'] = $resp->idvendedor;
                }
            }

            $cli = new Cliente();
            $cli->setConnection($connection);
            
            $result = $cli->leftJoin('venta as v', 'v.fkidcliente', '=', 'cliente.idcliente')
                            ->leftJoin('vendedor as ve', 've.idvendedor', '=', 'v.fkidvendedor')
                            ->leftJoin('ventadetalle as vd', 'vd.fkidventa', '=', 'v.idventa')
                            ->leftJoin('almacenproddetalle as apd', 'apd.idalmacenproddetalle', '=', 'vd.fkidalmacenproddetalle')
                            ->leftJoin('producto as p', 'p.idproducto', '=', 'apd.fkidproducto')
                            ->where('v.mtototventa', '<>', 0)
                            ->where('cliente.idcliente', $idcliente)
                            ->where('v.fkidtipocontacredito', 2)
                            ->where('v.fkidtipotransacventa', 1) // tipo venta
                            ->where($condicion)
                            ->orderBy('v.idventa', 'ASC')
                            ->select('v.idventa', 'v.codventa', 'v.mtototventa', 'v.mtototcobrado', 'v.fecha',
                                    'p.idproducto', 'p.descripcion', 'p.codproducto', 've.idvendedor', 've.codvendedor',
                                    've.nombre as nombreve', 've.apellido as apellidove')
                            ->get();
            $ventas = [];
            $vendedores = [];
            $productos = [];
            $i = 0;
            $size = sizeof($result);
            while ($i < $size) {

                if ($result[$i]->mtototventa != $result[$i]->mtototcobrado) {
                    $piv = $result[$i]->idventa;
                    $prods = ''; $coma = '';
                    while ($i < $size && $piv == $result[$i]->idventa) {
                        $prods = $prods . $coma . $result[$i]->descripcion;
                        $coma = ', ';
                        $i++;
                    }

                    array_push($ventas, [
                        'idventa' => $result[$i-1]->idventa,
                        'codventa' => $result[$i-1]->codventa,
                        'fecha' => $result[$i-1]->fecha,
                        'montototal' => $result[$i-1]->mtototventa,
                        'montocobrado' => $result[$i-1]->mtototcobrado,
                        'saldopagar' => round(((float)$result[$i-1]->mtototventa) - ((float)$result[$i-1]->mtototcobrado), 2)
                    ]);
                    array_push($vendedores, [
                        'idvendedor' => $result[$i-1]->idvendedor,
                        'codvendedor' => $result[$i-1]->codvendedor,
                        'nombre' => $result[$i-1]->nombreve,
                        'apellido' => $result[$i-1]->apellidove
                    ]);
                    array_push($productos,[
                        'cadena' => $prods
                    ]);
                } else {
                    $i++;
                }

            }

            return response()->json([
                'response' => 1,
                'ventas' => $ventas,
                'vendedores' => $vendedores,
                'productos' => $productos
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

    public function searchClienteVentas(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();

            $condicion = [
                'v.fkidtipocontacredito' => 2,
                'v.fkidtipotransacventa' => 1,
                'v.deleted_at' => null
            ];
            if ($configCli->clienteesabogado == true) {
                $user = new Usuario();
                $user->setConnection($connection);
                $resp = $user->join('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                            ->join('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                            ->where('usuario.idusuario', $request->get('x_idusuario'))
                            ->where('g.esv', 'S')
                            ->first();
                if ($resp != null) {
                    $condicion['v.fkidvendedor'] = $resp->idvendedor;
                }
            }

            $cli = new Cliente();
            $cli->setConnection($connection);
            $result = $cli->leftJoin('venta as v', 'v.fkidcliente', '=', 'cliente.idcliente')
                ->where(DB::raw("CONCAT(cliente.nombre, ' ' , cliente.apellido)"), 'ILIKE', "%$value%")
                ->where('v.mtototventa', '>', 0)
                ->where($condicion)
                ->select('cliente.*')
                ->distinct('cliente.id')
                ->get();

            return response()->json([
                'response' => 1,
                'data' => $result,
                'condicion' => $condicion
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
    
    public function getProformasCliente(Request $request, $idcliente) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cli = new Cliente();
            $cli->setConnection($connection);

            $result = $cli->leftJoin('venta as v', 'v.fkidcliente', '=', 'cliente.idcliente')
                ->leftJoin('vendedor as ve', 've.idvendedor', '=', 'v.fkidvendedor')
                ->leftJoin('comisionventa as co', 've.fkidcomisionventa', '=', 'co.idcomisionventa')
                ->leftJoin('ventadetalle as vd', 'vd.fkidventa', '=', 'v.idventa')
                ->leftJoin('almacenproddetalle as apd', 'apd.idalmacenproddetalle', '=', 'vd.fkidalmacenproddetalle')
                ->leftJoin('producto as p', 'p.idproducto', '=', 'apd.fkidproducto')
                ->where('v.mtototventa', '<>', 0)
                ->where('cliente.idcliente', $idcliente)
                ->where('v.fkidtipocontacredito', 1)
                ->where('v.fkidtipotransacventa', 2)
                ->whereNull('v.deleted_at')
                ->whereNull('ve.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('apd.deleted_at')
                ->whereNull('vd.deleted_at')
                ->orderBy('v.idventa', 'ASC')
                ->select('v.idventa', 'v.codventa', 'v.mtototventa', 'v.mtototcobrado', 'v.fecha', 'co.valor',
                        'p.idproducto', 'p.descripcion', 'p.codproducto', 've.idvendedor', 've.codvendedor',
                        've.nombre as nombreve', 've.apellido as apellidove')
                ->get();

            $ventas = [];
            $vendedores = [];
            $productos = [];
            $i = 0;
            $size = sizeof($result);
            while ($i < $size) {

                if ($result[$i]->mtototventa != $result[$i]->mtototcobrado) {
                    $piv = $result[$i]->idventa;
                    $prods = ''; $coma = '';
                    while ($i < $size && $piv == $result[$i]->idventa) {
                        $prods = $prods . $coma . $result[$i]->descripcion;
                        $coma = ', ';
                        $i++;
                    }

                    array_push($ventas, [
                        'idventa' => $result[$i-1]->idventa,
                        'codventa' => $result[$i-1]->codventa,
                        'fecha' => $result[$i-1]->fecha,
                        'montototal' => $result[$i-1]->mtototventa,
                        'montocobrado' => $result[$i-1]->mtototcobrado,
                        'saldopagar' => round(((float)$result[$i-1]->mtototventa) - ((float)$result[$i-1]->mtototcobrado), 2)
                    ]);
                    array_push($vendedores, [
                        'idvendedor' => $result[$i-1]->idvendedor,
                        'codvendedor' => $result[$i-1]->codvendedor,
                        'nombre' => $result[$i-1]->nombreve,
                        'apellido' => $result[$i-1]->apellidove,
                        'valor' => $result[$i-1]->valor,
                    ]);
                    array_push($productos,[
                        'cadena' => $prods
                    ]);
                } else {
                    $i++;
                }
                
            }

            return response()->json([
                'response' => 1,
                'ventas' => $ventas,
                'vendedores' => $vendedores,
                'productos' => $productos
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

    public function searchClienteProformas(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();
            
            $condicion = [
                'v.fkidtipocontacredito' => 1,
                'v.fkidtipotransacventa' => 2,
                'v.deleted_at' => null
            ];
            if ($configCli->clienteesabogado) {
                $user = new Usuario();
                $user->setConnection($connection);
                $resp = $user->leftJoin('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                            ->leftJoin('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                            ->where('usuario.idusuario', $request->get('x_idusuario'))
                            ->where('g.esv', 'S')
                            ->first();
                if ($resp != null) {
                    $condicion['v.fkidvendedor'] = $resp->idvendedor;
                }
            }

            $cli = new Cliente();
            $cli->setConnection($connection);
            $result = $cli->leftJoin('venta as v', 'v.fkidcliente', '=', 'cliente.idcliente')
                        ->where(DB::raw("CONCAT(cliente.nombre, ' ' , cliente.apellido)"), 'ILIKE', "%$value%")
                        ->where('v.mtototventa', '>', 0)
                        ->where($condicion)
                        ->select('cliente.*')
                        ->distinct('cliente.id')
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
                'message' => 'No se pudo procesa la solicitud'
            ]);
        }
    }
}
