<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Ventas\Venta;
use App\Models\Comercio\Ventas\VentaDetalle;
use App\Models\Comercio\Ventas\Vendedor;
use App\Models\Comercio\Ventas\Cliente;
use App\Models\Comercio\Taller\VehiculoHistorial;
use App\Models\Comercio\Taller\VehiculoPartesVentaDetalle;
use App\Models\Comercio\Taller\VehiculoParteDetalleFoto;
use App\Models\Seguridad\Log;
use App\Models\Config\ConfigCliente;
use App\Models\Config\ConfigFabrica;
use App\Models\Comercio\Almacen\Sucursal;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\ListaPrecio;
use App\Models\Comercio\Almacen\Moneda;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Image;
use Illuminate\Support\Facades\DB;

class ProformaController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vent = new Venta();
            $vent->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('busqueda')) {
                $datos = $vent->select('venta.idventa','venta.codventa','cliente.nombre as nombreCliente', 'venta.mtototventa',
                        'cliente.apellido as apellidoCliente','vendedor.nombre as nombreVendedor', 'tipotransacventa.nombre as tipotransac',
                        'vendedor.apellido as apellidoVendedor','sucursal.nombre as nombreSucursal','venta.fecha')
                    ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                    ->leftJoin('vendedor','vendedor.idvendedor','=','venta.fkidvendedor')
                    ->leftJoin('sucursal','sucursal.idsucursal','=','venta.fkidsucursal')
                    ->leftJoin('tipotransacventa', 'tipotransacventa.idtipotransacventa','=','venta.fkidtipotransacventa')
                    ->where([
                        'tipotransacventa.nombre' => 'Proforma'
                    ])
                    ->where(function ($query) use ($request) {
                        return $query->orWhere('venta.idventa', 'ILIKE', "%$request->busqueda%")
                                    ->orWhere('venta.codventa', 'ILIKE', "%$request->busqueda%")
                                    ->orWhere(DB::raw("CONCAT(cliente.nombre, ' ' , cliente.apellido)"), 'ILIKE', "%$request->busqueda%")
                                    ->orWhere(DB::raw("CONCAT(vendedor.nombre, ' ' , vendedor.apellido)"), 'ILIKE', "%$request->busqueda%")
                                    ->orWhere('sucursal.nombre', 'ILIKE', "%$request->busqueda%");
                    })
                    ->orderBy('idventa','desc')
                    ->paginate($paginate);
            } else {
                $datos = $vent->select('venta.idventa','venta.codventa','cliente.nombre as nombreCliente', 'venta.mtototventa',
                        'cliente.apellido as apellidoCliente','vendedor.nombre as nombreVendedor', 'tipotransacventa.nombre as tipotransac',
                        'vendedor.apellido as apellidoVendedor','sucursal.nombre as nombreSucursal','venta.fecha')
                    ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                    ->leftJoin('vendedor','vendedor.idvendedor','=','venta.fkidvendedor')
                    ->leftJoin('sucursal','sucursal.idsucursal','=','venta.fkidsucursal')
                    ->leftJoin('tipotransacventa', 'tipotransacventa.idtipotransacventa','=','venta.fkidtipotransacventa')
                    ->where([
                        'tipotransacventa.nombre' => 'Proforma'
                    ])
                    ->orderBy('idventa','desc')
                    ->paginate($paginate);
            }
            
            $proformas = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' => $datos->lastItem()
            );
            return response()->json([
                'response' => 1,
                'data' => $proformas,
                'pagination' => $pagination
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al obtener los datos'
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

            $mon = new Moneda();
            $mon->setConnection($connection);
            $monedas  = $mon->orderBy('idmoneda', 'asc')->get();

            $suc = new Sucursal();
            $suc->setConnection($connection);
            $sucursales = $suc->orderBy('idsucursal', 'asc')->get();

            $almacenes = [];

            if (sizeof($sucursales) > 0) {
                $alm = new Almacen();
                $alm->setConnection($connection);
                $almacenes = $alm->where('fkidsucursal', '=', $sucursales[0]->idsucursal)
                    ->orderBy('idalmacen', 'asc')->get();
            }

            $lista_precios = [];

            $fecha_final = date("Y").'-'.date("m").'-'.date("d");

            if (sizeof($monedas) > 0) {
                $listap = new ListaPrecio();
                $listap->setConnection($connection);

                $lista_precios = $listap->where(['fkidmoneda' => $monedas[0]->idmoneda, 'estado' => 'A'])
                    ->where('fechafin', '>=', $fecha_final)
                    ->orWhere('idlistaprecio', '=', '1')
                    ->orderBy('idlistaprecio', 'asc')->get();
            }

            $productos = [];

            if ((sizeof($lista_precios) > 0) && (sizeof($almacenes) > 0)) {
                $productos = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion')
                    ->where('listproddet.fkidlistaprecio', '=', $lista_precios[0]->idlistaprecio)
                    ->where('almproddet.fkidalmacen', '=', $almacenes[0]->idalmacen)
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);;
            }

            $conf = new ConfigFabrica();
            $conf->setConnection($connection);
            $configFabrica = $conf->first();
            $configFabrica->decrypt();

            $cli = new Cliente();
            $cli->setConnection($connection);
            $clientes = $cli->orderBy('idcliente', 'asc')->get()->take(20);

            $vend = new Vendedor();
            $vend->setConnection($connection);
            $vendedores = $vend->leftJoin('comisionventa as co', 'co.idcomisionventa', 'vendedor.fkidcomisionventa')
                ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 'vendedor.apellido', 'co.valor')
                ->orderBy('vendedor.idvendedor', 'asc')->get()->take(20);

            $tiposContaCredito = DB::connection($connection)
                ->table('tipocontacredito')
                ->whereNUll('deleted_at')
                ->orderBy('idtipocontacredito', 'asc')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configsCliente = $conf->first();
            $configsCliente->decrypt();
            
            return response()->json([
                'response'          => 1,
                'monedas'           => $monedas,
                'configscliente'    => $configsCliente,
                'configsfabrica'    => $configFabrica,
                'sucursales'        => $sucursales,
                'almacenes'         => $almacenes,
                'tiposcontacredito' => $tiposContaCredito,
                'clientes'          => $clientes,
                'vendedores'        => $vendedores,
                'listaprecios'      => $lista_precios,
                'productos'         => $productos,
            ]);
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
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
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

            date_default_timezone_set("America/La_Paz");
            $fechatran = date('Y-m-d H:i:s');
            
            $codventa = $request->codigoventa;
            $fecha = $request->fechaventa;
            $hora = $request->hora;
            $tomarcomision = $request->comision;
            
            $descuentoporcentaje = $request->descuentoVenta;
            $recargoporcentaje = $request->recargoVenta;
            
            $fechatransacventa = $fechatran;
            $notas = $request->nota;
            
            $estado = $request->estado;
            $estadoproceso = $request->estadoProceso;
            $fkidsucursal = $request->fkidsucursal;
            $fkidcliente = $request->fkidcliente;
            $fkidvendedor = $request->fkidvendedor;
            $fkidvehiculo = $request->fkidvehiculo;
            
            $totalventa = $request->totalventa;
        
            $venta = new Venta();
            $venta->setConnection($connection);
            $venta->codventa = $codventa;
            $venta->fecha = $fecha;
            $venta->hora = $hora;
            $venta->tomarcomisionvendedor = $tomarcomision;
            $venta->anticipo = 0;
            $venta->descuentoporcentaje = $descuentoporcentaje;
            $venta->recargoporcentaje = $recargoporcentaje;
            $venta->fechahoratransac = $fechatransacventa;
            $venta->notas = $notas;
            $venta->idusuario = 1;
            $venta->estado = $estado;
            $venta->estadoproceso = $estadoproceso;
            $venta->fkidsucursal = $fkidsucursal;
            $venta->fkidcliente = $fkidcliente;
            $venta->fkidvendedor = $fkidvendedor;
            $venta->mtototventa = $totalventa;
            $venta->mtototcobrado = 0;
            $venta->fkidvehiculo = $fkidvehiculo;
            $venta->fkidmoneda = $request->idmoneda;
            $venta->fkidtipocontacredito = 1;
            $venta->fkidtipotransacventa = 2;

            $venta->segenerofactura = 'N';
            $venta->mtototdescuento = 0;
            $venta->mtototincremento = 0;
            $venta->impuestoiva = 0;
            $venta->tc = 0;
            
            $venta->save();

            $arrayventaDetalle = json_decode($request->arrayventadetalle);
        
            foreach ($arrayventaDetalle as $item => $valor) {
                $ventadetalle = new VentaDetalle();
                $ventadetalle->setConnection($connection);
                $ventadetalle->cantidad = $valor->cantidad;
                $ventadetalle->preciounit = $valor->precioUnit;
                $ventadetalle->factor_desc_incre =  $valor->factor;
                $ventadetalle->fkidalmacenproddetalle = $valor->fkidalmacenprodetalle;
                $ventadetalle->fkidventa = $venta->idventa;
                $ventadetalle->fkidlistapreproducdetalle =  $valor->fkidlistaproddetalle;
                $ventadetalle->save();
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto la Proforma ' . $venta->idventa;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'Se guardo correctamente',
                'idventa' => $venta->idventa,
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
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
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al intentar guardar',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    public function recibo_proforma(Request $request) {
        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idventa = $request->idventa;

            $venta_first = DB::connection($connection)
                ->table('venta as v')
                ->join('sucursal as s', 'v.fkidsucursal', '=', 's.idsucursal')
                ->join('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                ->join('almacenproddetalle as apd', 'vd.fkidalmacenproddetalle', '=', 'apd.idalmacenproddetalle')
                ->join('almacen as a', 'apd.fkidalmacen', '=', 'a.idalmacen')
                ->join('producto as p', 'apd.fkidproducto', '=', 'p.idproducto')
                ->join('moneda as m', 'p.fkidmoneda', '=', 'm.idmoneda')
                ->join('listaprecio as lp', 'm.idmoneda', '=', 'lp.fkidmoneda')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->join('tipocontacredito as tcc', 'v.fkidtipocontacredito', '=', 'tcc.idtipocontacredito')
                ->join('vendedor as ve', 'v.fkidvendedor', '=', 've.idvendedor')
                ->join('comisionventa as co', 've.fkidcomisionventa', '=', 'co.idcomisionventa')
                ->select('v.idventa', 'v.fecha', 's.nombre as sucursal', 'c.idcliente',
                    DB::raw("CONCAT(c.nombre, ' ',c.apellido) as cliente"), 'c.nit',
                    DB::raw("CONCAT(ve.nombre, ' ',ve.apellido) as vendedor"), 've.idvendedor',
                    'co.valor', 'tcc.descripcion as tipoventa', 'v.mtototventa as total',
                    'v.descuentoporcentaje as descuento', 'v.recargoporcentaje as recargo', 'v.notas',
                    DB::raw('
                            (SELECT ve.idvehiculo FROM vehiculo as ve 
                                WHERE ve.idvehiculo = v.fkidvehiculo) 
                            AS idvehiculo'
                    ),
                    DB::raw('
                            (SELECT ve.placa FROM vehiculo as ve 
                                WHERE ve.idvehiculo = v.fkidvehiculo) 
                            AS placa'
                    ),
                    DB::raw('
                            (SELECT vt.descripcion FROM vehiculo as ve, vehiculotipo as vt 
                                WHERE vt.idvehiculotipo = ve.fkidvehiculotipo and 
                                ve.idvehiculo = v.fkidvehiculo) 
                            AS vehiculo'
                    ), DB::raw('SUM(vd.cantidad*vd.preciounit) as subtotal'), 'a.descripcion as almacen',
                    'm.descripcion as moneda', 'lp.descripcion as listaprecio', 'v.anticipo', 
                    'v.tomarcomisionvendedor as comision', 'v.fkidtipocontacredito'
                )
                ->where('v.idventa', '=', $idventa)
                ->whereNull('v.deleted_at')
                ->whereNull('s.deleted_at')
                ->whereNull('vd.deleted_at')
                ->whereNull('apd.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('m.deleted_at')
                ->whereNull('lp.deleted_at')
                ->whereNull('c.deleted_at')
                ->whereNull('tcc.deleted_at')
                ->whereNull('ve.deleted_at')
                ->whereNull('co.deleted_at')
                ->groupBy('v.idventa', 'v.fecha', 'sucursal', 'c.idcliente', 'cliente', 'c.nit', 
                    'vendedor', 've.idvendedor', 'co.valor', 'tipoventa', 'total', 'descuento', 
                    'recargo', 'v.notas', 'idvehiculo', 'placa', 'vehiculo', 'almacen', 'moneda', 
                    'listaprecio', 'v.anticipo', 'comision', 'v.fkidtipocontacredito'
                )
                ->first();

            $venta_detalle = DB::connection($connection)
                ->table('ventadetalle as v')
                ->join('almacenproddetalle as a', 'v.fkidalmacenproddetalle', '=', 'a.idalmacenproddetalle')
                ->join('producto as p', 'a.fkidproducto', '=', 'p.idproducto')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->select('p.idproducto as codigo', 'p.descripcion as producto', 'v.cantidad',
                    'v.preciounit as precio', 'v.factor_desc_incre as descuento', 'u.descripcion as medida'
                )
                ->where('v.fkidventa', '=', $idventa)
                ->whereNull('v.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('u.deleted_at')
                ->get();

            $planpago = DB::connection($connection)
                ->table('venta as v')
                ->join('ventaplandepago as vp', 'v.idventa', '=', 'vp.fkidventa')
                ->select('vp.descripcion', 'vp.fechaapagar', 'vp.montoapagar')
                ->where('v.idventa', '=', $idventa)
                ->where('vp.descripcion', '<>', 'Anticipo')
                ->whereNull('v.deleted_at')
                ->whereNull('vp.deleted_at')
                ->orderBy('vp.descripcion', 'asc')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            DB::commit();
            
            return response()->json(array(
                "response" => 1,
                'configcliente' => $config_cliente,
                'venta' => $venta_first,
                'venta_detalle' => $venta_detalle,
                'planpago' => $planpago,
            ));

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
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
 
    public function get_sucursal(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idsucursal = $request->idsucursal;
            $idmoneda = $request->idmoneda;
            $idlistaprecio = $request->idlistaprecio;

            $alm = new Almacen();
            $alm->setConnection($connection);
            $almacen = $alm->where('fkidsucursal', '=', $idsucursal)
                ->orderBy('idalmacen', 'asc')->get();

            $idalmacen = (sizeof($almacen) > 0)?$almacen[0]->idalmacen:null;

            $productos = DB::connection($connection)
                ->table('producto as p')
                ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                ->join('listaprecio as list', 'listproddet.fkidlistaprecio', '=', 'list.idlistaprecio')
                ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                ->join('almacen as a', 'almproddet.fkidalmacen', '=', 'a.idalmacen')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion')
                ->where('listproddet.fkidlistaprecio', '=', $idlistaprecio)
                ->where('almproddet.fkidalmacen', '=', $idalmacen)
                ->where('a.fkidsucursal', '=', $idsucursal)
                ->where('list.fkidmoneda', '=', $idmoneda)
                ->whereNull('listproddet.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('almproddet.deleted_at')
                ->whereNull('u.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('list.deleted_at')
                ->orderBy('p.idproducto', 'asc')
                ->get()->take(20);
            
            return response()->json([
                'response'    => 1,
                "almacenes"   => $almacen ,
                "productos"   => $productos,
            ]);
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
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    public function get_almacen(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idsucursal = $request->idsucursal;
            $idmoneda = $request->idmoneda;
            $idlistaprecio = $request->idlistaprecio;
            $idalmacen = $request->idalmacen;

            $productos = DB::connection($connection)
                ->table('producto as p')
                ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                ->join('listaprecio as list', 'listproddet.fkidlistaprecio', '=', 'list.idlistaprecio')
                ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                ->join('almacen as a', 'almproddet.fkidalmacen', '=', 'a.idalmacen')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion')
                ->where('listproddet.fkidlistaprecio', '=', $idlistaprecio)
                ->where('almproddet.fkidalmacen', '=', $idalmacen)
                ->where('a.fkidsucursal', '=', $idsucursal)
                ->where('list.fkidmoneda', '=', $idmoneda)
                ->whereNull('listproddet.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('almproddet.deleted_at')
                ->whereNull('u.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('list.deleted_at')
                ->orderBy('p.idproducto', 'asc')
                ->get()->take(20);
            
            return response()->json([
                'response'    => 1,
                "data"   => $productos,
            ]);
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
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        return view('commerce::show');
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
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vent = new Venta();
            $vent->setConnection($connection);
            $venta = $vent->find($id);
            if ($venta == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'La proforma a eliminar no existe'
                ]);
            }

            $vehiculofotos = $venta->vehiculofotos;
            foreach ($vehiculofotos as $row) {
                $row->setConnection($connection);
                $row->delete();
            }
            $ventadetalle = $venta->ventadetalles;
            foreach ($ventadetalle as $row) {
                $row->setConnection($connection);
                $row->delete();
            }
            $venta->setConnection($connection);
            $venta->delete();

            $datos = $vent->select('venta.idventa','venta.codventa','cliente.nombre as nombreCliente', 'venta.mtototventa',
                            'cliente.apellido as apellidoCliente','vendedor.nombre as nombreVendedor', 'tipotransacventa.nombre as tipotransac',
                            'vendedor.apellido as apellidoVendedor','sucursal.nombre as nombreSucursal','venta.fecha')
                        ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                        ->leftJoin('vendedor','vendedor.idvendedor','=','venta.fkidvendedor')
                        ->leftJoin('sucursal','sucursal.idsucursal','=','venta.fkidsucursal')
                        ->leftJoin('tipotransacventa', 'tipotransacventa.idtipotransacventa','=','venta.fkidtipotransacventa')
                        ->where([
                            'tipotransacventa.nombre' => 'Proforma'
                        ])
                        ->orderBy('idventa','desc')
                        ->paginate(10);
            $proformas = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' => $datos->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la Proforma ' . $venta->idventa;
            $log->guardar($request, $accion);  

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'Se elimino correctamente',
                'data' => $proformas,
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
                'response' => -1,
                'message' => 'Ocurrio un problema al eliminar'
            ]);
        }
        
    }

    public function getPorformaCompleta(Request $request, $value) {

        DB::beginTransaction();
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $prof = new Venta();
            $prof->setConnection($connection);

            $proforma = $prof->leftJoin('vendedor as ve', 've.idvendedor', 'venta.fkidvendedor')
                ->leftJoin('vehiculo as veh', 'veh.idvehiculo', 'venta.fkidvehiculo')
                ->leftJoin('vehiculotipo as vt', 'vt.idvehiculotipo', 'veh.fkidvehiculotipo')
                ->leftJoin('cliente as c', 'c.idcliente', 'venta.fkidcliente')
                ->leftJoin('ventadetalle as vd', 'vd.fkidventa', 'venta.idventa')
                ->leftJoin('almacenproddetalle as apd', 'apd.idalmacenproddetalle', 'vd.fkidalmacenproddetalle')
                ->leftJoin('producto as p', 'p.idproducto', 'apd.fkidproducto')
                ->leftJoin('unidadmedida as um', 'um.idunidadmedida', 'p.fkidunidadmedida')
                ->leftJoin('almacen as a', 'a.idalmacen', 'apd.fkidalmacen')
                ->leftJoin('sucursal as s', 's.idsucursal', 'a.fkidsucursal')
                ->leftJoin('vehiculohistoria as vh', 'vh.fkidventa', 'venta.idventa')
                ->leftJoin('listapreproducdetalle as lpd', 'lpd.idlistapreproducdetalle', 'vd.fkidlistapreproducdetalle')
                ->whereNull('veh.deleted_at')
                ->whereNull('vt.deleted_at')
                ->whereNull('c.deleted_at')
                ->whereNull('vd.deleted_at')
                ->whereNull('apd.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('s.deleted_at')
                ->whereNull('vh.deleted_at')
                ->whereNull('lpd.deleted_at')
                ->where('venta.idventa', $value)
                ->where('venta.fkidtipotransacventa', 2)
                ->select('venta.*', 'c.idcliente', 'c.codcliente', 'c.nombre as nomc', 'c.apellido as apec', 'c.nit',
                        've.idvendedor', 've.codvendedor', 've.nombre as nomv', 've.apellido as apev',
                        'a.idalmacen', 'a.descripcion as almacen', 's.idsucursal', 's.nombre as sucursal',
                        'veh.idvehiculo', 'veh.codvehiculo', 'veh.placa', 'vt.descripcion as tipovehiculo',
                        'apd.stock', 'apd.idalmacenproddetalle', 'vd.cantidad', 'vd.preciounit', 'vd.factor_desc_incre as desc',
                        'vh.fecha as fechah', 'vh.diagnosticoentrada', 'vh.trabajoshechos', 'vh.kmactual', 'vh.kmproximo',
                        'vh.fechaproxima', 'vh.precio as precioh', 'vh.notas as notash', 'p.idproducto', 
                        'p.codproducto', 'p.descripcion as producto', 'p.stock as totalstock', 'p.tipo', 'lpd.idlistapreproducdetalle',
                        'lpd.fkidlistaprecio as idlistaprecio', 'lpd.precio as preciolist', 'um.descripcion as unidadmedida', 'um.abreviacion')
                //->distinct('venta.idventa')
                ->orderBy('vd.idventadetalle')
                ->get();
            
            $vehiculoPartes = $prof->join('vehicpartesventadetalle as vpv', 'vpv.fkidventa', 'venta.idventa')
                ->join('vehiculopartes as vp', 'vp.idvehiculopartes', 'vpv.fkidvehiculopartes')
                ->join('vehiculopartedetafoto as vpdf', 'vpdf.fkidvehicpartesventadetalle', 'vpv.idvehicpartesventadetalle')
                ->whereNull('vpv.deleted_at')
                ->whereNull('vp.deleted_at')
                ->whereNull('vpdf.deleted_at')
                ->where('venta.idventa', $value)
                ->select('vpv.*', 'vpdf.*')
                ->get();

            $tipos = [];
            $abreviaciones = [];
            $idsalmacenprod = [];
            $productos = [];
            $cantidades = [];
            $listaprecios = [];
            $precios = [];
            $descuentos = [];

            $venta = new \stdClass();
            $vehiculoHistorial = new \stdClass();

            foreach ($proforma as $key => $row) {
                if ($key == 0) {
                    $venta->fecha = $row->fecha;
                    $venta->hora = $row->hora;
                    $venta->tomarcomisionvendedor = $row->tomarcomisionvendedor;
                    $venta->descuentoporcentaje = $row->descuentoporcentaje;
                    $venta->recargoporcentaje = $row->recargoporcentaje;
                    $venta->observaciones = $row->notas;
                    $venta->anticipo = $row->anticipo;
                    $venta->mtototventa = $row->mtototventa;
                    $venta->mtototcobrado = $row->mtototcobrado;
                    $venta->idalmacen = $row->idalmacen;
                    $venta->idsucursal = $row->idsucursal;
                    $venta->idcliente = $row->idcliente;
                    $venta->codcliente = $row->codcliente;
                    $venta->nomc = $row->nomc;
                    $venta->apec = $row->apec;
                    $venta->nit = $row->nit;
                    $venta->idvehiculo = $row->idvehiculo;
                    $venta->codvehiculo = $row->codvehiculo;
                    $venta->placa = $row->placa;
                    $venta->tipovehiculo = $row->tipovehiculo;
                    $venta->idvendedor = $row->idvendedor;
                    $venta->codvendedor = $row->codvendedor;
                    $venta->nomv = $row->nomv;
                    $venta->apev = $row->apev;
                    $venta->idlistaprecio = $row->idlistaprecio;
                    $venta->idmoneda = $row->fkidmoneda;

                    $vehiculoHistorial->fecha = $row->fechah;
                    $vehiculoHistorial->precio = $row->precioh;
                    $vehiculoHistorial->kmActual = $row->kmactual;
                    $vehiculoHistorial->kmProximo = $row->kmproximo;
                    $vehiculoHistorial->diagnosticoEntrada = $row->diagnosticoentrada;
                    $vehiculoHistorial->trabajosHechos = $row->trabajoshechos;
                    $vehiculoHistorial->fechaProxima = $row->fechaproxima;
                    $vehiculoHistorial->notas = $row->notash;
                }

                array_push($abreviaciones, $row->abreviacion);
                array_push($tipos, $row->tipo);
                array_push($idsalmacenprod, $row->idalmacenproddetalle);
                array_push($productos, [
                    'id' => $row->idproducto,
                    'descripcion' => $row->producto,
                    'codproducto' => $row->codproducto,
                    'abreviacion' => $row->abreviacion,
                    'stock' => $row->stock,
                    'precio' => $row->preciounit,
                    'tipo' => $row->tipo,
                    'idlistapreproducdetalle' => $row->idlistapreproducdetalle,
                    'valido' => true //REVISAR ESTO LUEGO
                ]);

                array_push($cantidades, $row->cantidad);
                array_push($listaprecios, $row->idlistaprecio);
                array_push($precios, $row->preciounit);
                array_push($descuentos, $row->desc);
            }
            
            $idsvpd = [];
            $vpcantidades = [];
            $vpestados = [];
            $vpobservaciones = [];
            $vpfotos = []; //array de arrays
            $indices = []; 
            $i = 0;
            $size = sizeof($vehiculoPartes);
            while ($i < $size) {
                $idvpvd = $vehiculoPartes[$i]->idvehicpartesventadetalle;
                $fotos = [];
                while ($i < $size && $idvpvd == $vehiculoPartes[$i]->idvehicpartesventadetalle) {
                    //array_push($fotos, $vehiculoPartes[$i]->foto);
                    array_push($fotos, [
                        'foto' => $vehiculoPartes[$i]->foto,
                        'path' => true
                    ]);
                    $i++;
                }
                array_push($vpfotos, $fotos);
                array_push($vpcantidades, $vehiculoPartes[$i-1]->cantidad);
                array_push($vpestados, $vehiculoPartes[$i-1]->estado);
                array_push($vpobservaciones, $vehiculoPartes[$i-1]->observaciones);
                array_push($idsvpd, $vehiculoPartes[$i-1]->fkidvehiculopartes);
                array_push($indices, 0);
            }
            
            DB::commit();

            return response()->json([
                'response' => 1,
                'proforma' => $venta,
                'idsalmacenprod' => $idsalmacenprod,
                'tipos' => $tipos,
                'abreviaciones' => $abreviaciones,
                'productos' => $productos,
                'cantidades' => $cantidades,
                'listaprecios' => $listaprecios,
                'precios' => $precios,
                'descuentos' => $descuentos,
                //'vehiculopartes' => $vehiculoPartes,
                'vehiculopartes' => [
                                    'vpcantidades' => $vpcantidades,
                                    'vpestados' => $vpestados,
                                    'vpobservaciones' => $vpobservaciones,
                                    'vpfotos' => $vpfotos,
                                    'idsvpartes' => $idsvpd,
                                    'indicesfotos' => $indices,
                                ],
                'vehiculohistoria' => $vehiculoHistorial,
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
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => $th
            ]);
        }
    }
}
