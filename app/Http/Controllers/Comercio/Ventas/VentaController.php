<?php

namespace App\Http\Controllers\Comercio\Ventas;

use App\Functions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Comercio\Almacen\Producto\ListaPreProducDetalle;
use App\Models\Comercio\Ventas\ComisionVenta;
use App\Models\Comercio\Ventas\Venta;
use App\Models\Comercio\Ventas\VentaDetalle;
use App\Models\Comercio\Ventas\PlanDePago;
use App\Models\Comercio\Ventas\Cobro;
use App\Models\Comercio\Ventas\CobroPlanPagoDet;
use App\Models\Comercio\Almacen\Producto\UnidadMedida;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Taller\VehiculoHistorial;
use App\Models\Comercio\Taller\VehiculoPartesVentaDetalle;
use App\Models\Comercio\Taller\VehiculoParteDetalleFoto;
use App\Models\Seguridad\Usuario;
use App\Models\Seguridad\GrupoUsuario;
use App\Models\Config\ConfigCliente;
use App\Models\Config\ConfigFabrica;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\ListaPrecio;
use App\Models\Comercio\Almacen\Sucursal;
use App\Models\Comercio\Ventas\Cliente;
use App\Models\Comercio\Ventas\Vendedor;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\VentaExport;
use App\Models\Configuracion\Dosificacion;
use App\Models\Facturacion\Factura;
use Carbon\Carbon;
use Image;
use PDF;


use App\Http\Controllers\Comercio\Facturacion\SoapController;
use App\Models\Configuracion\LibroVenta;
use App\Models\Contable\PeriodoContable;
use App\Models\Facturacion\ControlCode;
use Illuminate\Support\Facades\DB;


class VentaController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */

    public function refresh(Request $request) {
        if (!$request->ajax()) {
            return view('commerce::admin.template');
        }
    }

    public function index(Request $request)
    {
        
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();

            $condicion = [
                'tipotransacventa.nombre' => 'Venta',
                'cliente.deleted_at' => null,
                'vendedor.deleted_at' => null,
                'sucursal.deleted_at' => null,
                'tipotransacventa.deleted_at' => null,
                'tipocontacredito.deleted_at' => null
            ];

            if ($configCli->clienteesabogado) {
                $user = new Usuario();
                $user->setConnection($connection);
                $resp = $user->leftJoin('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                            ->leftJoin('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                            ->where('usuario.idusuario', $request->get('x_idusuario'))
                            ->where('g.esv', 'S')
                            ->first();
                if ($resp != null && $configCli->clienteesabogado) {
                    $condicion['vendedor.idvendedor'] = $resp->idvendedor;
                }
            }
            
            $vent = new Venta();
            $vent->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $datos = null;
            if ($request->filled('busqueda')) {
                $datos = $vent->select('venta.idventa','venta.codventa','cliente.nombre as nombreCliente','tipocontacredito.descripcion as tipo',
                        'cliente.apellido as apellidoCliente','vendedor.nombre as nombreVendedor', 'venta.mtototventa',
                        'vendedor.apellido as apellidoVendedor','sucursal.nombre as nombreSucursal','venta.fecha', 'factura.idfactura')
                    ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                    ->leftJoin('vendedor','vendedor.idvendedor','=','venta.fkidvendedor')
                    ->leftJoin('sucursal','sucursal.idsucursal','=','venta.fkidsucursal')
                    ->leftJoin('tipotransacventa', 'tipotransacventa.idtipotransacventa','=','venta.fkidtipotransacventa')
                    ->leftJoin('factura', 'factura.fkidventa','=','venta.idventa')
                    ->where($condicion)
                    ->where(function ($query) use ($request) {
                        return $query->orWhere('venta.idventa', 'ILIKE', "%$request->busqueda%")
                                    ->orWhere('venta.codventa', 'ILIKE', "%$request->busqueda%")
                                    ->orWhere(DB::raw("CONCAT(cliente.nombre, ' ' , cliente.apellido)"), 'ILIKE', "%$request->busqueda%")
                                    ->orWhere(DB::raw("CONCAT(vendedor.nombre, ' ' , vendedor.apellido)"), 'ILIKE', "%$request->busqueda%")
                                    ->orWhere('sucursal.nombre', 'ILIKE', "%$request->busqueda%");
                    })
                    ->leftJoin('tipocontacredito', 'tipocontacredito.idtipocontacredito','=','venta.fkidtipocontacredito')
                    ->orderBy('idventa','desc')
                    ->paginate($paginate);
            } else {
                $datos = $vent->select('venta.idventa','venta.codventa','cliente.nombre as nombreCliente','tipocontacredito.descripcion as tipo',
                        'cliente.apellido as apellidoCliente','vendedor.nombre as nombreVendedor', 'venta.mtototventa',
                        'vendedor.apellido as apellidoVendedor','sucursal.nombre as nombreSucursal','venta.fecha', 'factura.idfactura')
                    ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                    ->leftJoin('vendedor','vendedor.idvendedor','=','venta.fkidvendedor')
                    ->leftJoin('sucursal','sucursal.idsucursal','=','venta.fkidsucursal')
                    ->leftJoin('tipotransacventa', 'tipotransacventa.idtipotransacventa','=','venta.fkidtipotransacventa')
                    ->leftJoin('factura', 'factura.fkidventa','=','venta.idventa')
                    ->where($condicion)
                    ->leftJoin('tipocontacredito', 'tipocontacredito.idtipocontacredito','=','venta.fkidtipocontacredito')
                    ->orderBy('idventa','desc')
                    ->paginate($paginate);
            }
            
            $ventas = $datos->getCollection();
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
                'data' => $ventas,
                'pagination' => $pagination,
                'datos' => $datos
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
            $tipocambio = null;

            $fecha_final = date("Y").'-'.date("m").'-'.date("d");

            if (sizeof($monedas) > 0) {

                $tipocambio = DB::connection($connection)
                    ->table('tipocambio')
                    ->where('estado', '=', 'A')
                    ->where('fkidmonedauno', '=', $monedas[0]->idmoneda)
                    ->whereNull('deleted_at')
                    ->first();

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
                    ->get()->take(20);
            }

            $cli = new Cliente();
            $cli->setConnection($connection);
            $clientes = $cli->orderBy('idcliente', 'desc')->get()->take(20);

            $vend = new Vendedor();
            $vend->setConnection($connection);
            $vendedores = $vend->leftJoin('comisionventa as co', 'co.idcomisionventa', 'vendedor.fkidcomisionventa')
                ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 'vendedor.apellido', 'co.valor')
                ->orderBy('vendedor.idvendedor', 'desc')->get()->take(20);

            $tiposContaCredito = DB::connection($connection)
                ->table('tipocontacredito')
                ->whereNUll('deleted_at')
                ->orderBy('idtipocontacredito', 'asc')
                ->get();

            $conf = new ConfigFabrica();
            $conf->setConnection($connection);
            $configFabrica = $conf->first();
            $configFabrica->decrypt();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configsCliente = $conf->first();
            $configsCliente->decrypt();

            $bandera = 0;

            if ($configsCliente->facturarsiempre == 'P' || $configsCliente->facturarsiempre == 'S') {

                $dosificacion = DB::connection($connection)
                    ->table('facdosificacion')
                    ->where('estado', '=', 'A')
                    ->where('fechalimiteemision', '>=', $request->x_fecha)
                    ->whereNull('deleted_at')
                    ->orderBy('idfacdosificacion', 'asc')
                    ->first();

                if ($dosificacion == null) {
                    $bandera = 1;
                }
            }

            $obj = new PeriodoContable();
            $obj->setConnection($connection);
            $periodos = $obj->leftJoin('gestioncontable as g', 'periodocontable.fkidgestioncontable', '=', 'g.idgestioncontable')
                ->select('periodocontable.idperiodocontable', 'periodocontable.descripcion', 'periodocontable.fechaini', 'periodocontable.fechafin')
                ->where('g.estado', 'A')
                ->where('periodocontable.estado', 'A')
                ->whereNull('periodocontable.deleted_at')
                ->get();

            return response()->json([
                'response' => 1,
                'monedas' => $monedas,
                'sucursales' => $sucursales,
                'almacenes' => $almacenes,
                'listaprecios' => $lista_precios,
                'configscliente' => $configsCliente,
                'configsfabrica' => $configFabrica,
                'tiposcontacredito' => $tiposContaCredito,
                'clientes' => $clientes,
                'vendedores' => $vendedores,
                'productos' => $productos,
                'bandera' => $bandera,
                'tipocambio' => $tipocambio,
                'periodos' => $periodos,
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
     * Store a newly created resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function store(Request $request)
    {

        date_default_timezone_set("America/La_Paz");
        $fechatran = date('Y-m-d H:i:s');
        DB::beginTransaction();
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            //echo 'inicio';
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $codventa = $request->codigoventa;
            $fecha = $request->fechaventa;
            $hora = $request->hora;
            $tomarcomision = $request->comision;
            
            $descuentoporcentaje = $request->descuentoVenta;
            $recargoporcentaje = $request->recargoVenta;
            $fechahorafin = null;
            $fechatransacventa = $fechatran;
            $notas = $request->nota;
            $idusuario = $request->idusuario;
            $estado = $request->estado;
            $estadoproceso = $request->estadoProceso;
            $fkidsucursal = $request->fkidsucursal;
            $fkidcliente = $request->fkidcliente;
            $fkidvendedor = $request->fkidvendedor;
            $fkidvehiculo = $request->fkidvehiculo;
            $fkidtipocontacredito = $request->fkidtipocontacredito;
            $fkidtipotransacventa = $request->fkidtipotransacventa;
            $condicion = $request->condicion;
            $totalventa = $request->totalventa;
            $montocobrado = $request->montocobrado;

            $facturarsiempre = $request->facturarsiempre;
            $nitcliente = $request->nitcliente;
            $namecliente = $request->namecliente;

            $client = new Cliente();
            $client->setConnection($connection);
            $cliente =  $client->find($fkidcliente);
            $cliente->nit = $nitcliente;
            $cliente->setConnection($connection);
            $cliente->update();

            $arrayidproducto = json_decode($request->arrayidproducto);
            $arraycantidad = json_decode($request->arraycantidad);
            $arraypreciounit = json_decode($request->arraypreciounit);
            $arraydescuento = json_decode($request->arraydescuento);
            //$arrayidalmacenproddetalle = json_decode($request->arrayIdAlmacenProdDetalle);
            $arraylistapreproducdetalle = json_decode($request->arrayListaPreProdDetalle);

            $arrayventaDetalle = json_decode($request->arrayventadetalle);
        
            $anticipo = $request->anticipo;
            if($anticipo == null){
                $anticipo = 0;
            }

            $venta = new Venta();
            $venta->setConnection($connection);

            $estadopro = 'F';
            if ($config_cliente->ventaendospasos) {
                if ($condicion == 'contado') {
                    $estadopro = 'E';
                } else if ($condicion == 'credito') {
                    if ($anticipo == 0)
                        $estadopro = 'C';
                    else
                        $estadopro = 'E';
                }
            }
            
            
            $venta->codventa = $codventa;
            $venta->fecha = $fecha;
            $venta->hora = $hora;
            $venta->tomarcomisionvendedor = $tomarcomision;
            $venta->anticipo = $anticipo;
            $venta->descuentoporcentaje = $descuentoporcentaje;
            $venta->recargoporcentaje = $recargoporcentaje;
            $venta->fechahoratransac = $fechatransacventa;
            $venta->notas = $notas;
            $venta->idusuario = $request->x_idusuario;
            $venta->estado = $estado;
            $venta->estadoproceso = $estadopro;
            $venta->fkidsucursal = $fkidsucursal;
            $venta->fkidcliente = $fkidcliente;
            $venta->fkidvendedor = $fkidvendedor;
            $venta->mtototventa = $totalventa;
            $venta->mtototcobrado = ($fkidtipocontacredito == 1 && !$config_cliente->ventaendospasos) ? $totalventa : $montocobrado;
            $venta->fkidvehiculo = $fkidvehiculo;
            $venta->fkidtipocontacredito = $fkidtipocontacredito;
            $venta->fkidtipotransacventa = $fkidtipotransacventa;
            $venta->fkidmoneda = $request->idmoneda;
            $venta->segenerofactura = 'N';
            $venta->mtototdescuento = 0;
            $venta->mtototincremento = 0;
            $venta->impuestoiva = 0;
            $venta->tc = $request->valor_cambio;

            $venta->sehizoasientautom = 'N';
            $venta->mtovtabruta = $request->subtotal;

            $venta->save();

            $almdet = new AlmacenProdDetalle();
            $almdet->setConnection($connection);
            $prodt = new Producto();
            $prodt->setConnection($connection);

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

                if ($valor->tipo == "P") {
                    $almacenprod = $almdet->find($valor->fkidalmacenprodetalle);
                    $newstock = $almacenprod->stock - $valor->cantidad;
                    $almacenprod->stock = $newstock;
                    $almacenprod->setConnection($connection);
                    $almacenprod->save();

                    $producto = $prodt->find($valor->idProducto);
                    $newstockproducto = $producto->stock - $valor->cantidad; 
                    $producto->stock = $newstockproducto;
                    $producto->setConnection($connection);
                    $producto->save();
                }
            }

            $ventaplandepago = null;
            $idcobro = null;
    
            ///Plan de Pago
            if ($condicion === "credito") {

                if ($venta->anticipo != 0) {

                    $plandepago = new PlanDePago();
                    $plandepago->setConnection($connection);
                    $plandepago->descripcion = 'Anticipo';
                    $plandepago->fechaapagar = $venta->fecha;
                    $plandepago->montoapagar = $venta->anticipo;
                    $plandepago->montopagado = $config_cliente->ventaendospasos ? 0 : $venta->anticipo;
                    $plandepago->estado = $config_cliente->ventaendospasos ? 'I' : 'P';
                    $plandepago->sehizoasientautom = 'N';
                    $plandepago->fkidventa = $venta->idventa;
                    $plandepago->save();

                    $ventaplandepago = $plandepago->idventaplandepago;

                    if (!$config_cliente->ventaendospasos) {
                        $cobro = new Cobro();
                        $cobro->setConnection($connection);
                        $cobro->fecha = $venta->fecha;
                        $cobro->hora = $venta->hora;
                        $cobro->fechahoratransac = new Carbon();
                        $cobro->sehizoasientautom = 'N';
                        $cobro->idusuario = $request->get('x_idusuario');
                        $cobro->save();

                        $idcobro = $cobro->idcobro;
    
                        $cobrodet = new CobroPlanPagoDet();
                        $cobrodet->setConnection($connection);
                        $cobrodet->fkidventaplandepago = $plandepago->idventaplandepago;
                        $cobrodet->fkidcobro = $cobro->idcobro;
                        $cobrodet->montocobrado = $venta->anticipo;
                        $cobrodet->save();
                    }

                }

                $estadoPlan = $request->estadoPlan;
                $planpago = json_decode($request->planPago);
                foreach($planpago as $item => $valor) {
                    $plandepago = new PlanDePago();
                    $plandepago->setConnection($connection);
                    $plandepago->descripcion = $valor->descripcion;
                    //$plandepago->fechaapagar = $valor->FechaApagar;
                    $plandepago->fechaapagar = $valor->fechastore;
                    $plandepago->montoapagar = $valor->montoPagar;
                    $plandepago->montopagado = 0;
                    $plandepago->estado = $estadoPlan;
                    $plandepago->fkidventa = $venta->idventa;
                    $plandepago->sehizoasientautom = 'N';
                    $plandepago->save();
                }
            } else {
                $plandepago = new PlanDePago();
                $plandepago->setConnection($connection);
                $plandepago->descripcion = 'Contado';
                $plandepago->fechaapagar = $venta->fecha;
                $plandepago->montoapagar = $totalventa;
                $plandepago->montopagado = $config_cliente->ventaendospasos ? 0 : $venta->anticipo;
                $plandepago->estado = $config_cliente->ventaendospasos ? 'I' : 'P';
                $plandepago->fkidventa = $venta->idventa;
                $plandepago->sehizoasientautom = 'N';
                $plandepago->save();

                $ventaplandepago = $plandepago->idventaplandepago;

                if (!$config_cliente->ventaendospasos) {
                    $cobro = new Cobro();
                    $cobro->setConnection($connection);
                    $cobro->fecha = $venta->fecha;
                    $cobro->hora = $venta->hora;
                    $cobro->fechahoratransac = new Carbon();
                    $cobro->sehizoasientautom = 'N';
                    $cobro->idusuario = $request->get('x_idusuario');
                    $cobro->save();

                    $idcobro = $cobro->idcobro;

                    $cobrodet = new CobroPlanPagoDet();
                    $cobrodet->setConnection($connection);
                    $cobrodet->fkidventaplandepago = $plandepago->idventaplandepago;
                    $cobrodet->fkidcobro = $cobro->idcobro;
                    $cobrodet->montocobrado = $totalventa;
                    $cobrodet->save();
                }
                
            }

            $historialVehiculo = json_decode($request->historialVehiculo);
            if ($historialVehiculo->fecha != '') {
                $historial = new VehiculoHistorial();
                $historial->setConnection($connection);
                $historial->fecha = $historialVehiculo->fecha;
                $historial->diagnosticoentrada = $historialVehiculo->diagnostico_entrada;
                $historial->trabajoshechos = $historialVehiculo->trabajo_hecho;
                $historial->kmactual = $historialVehiculo->km_actual;
                $historial->kmproximo = $historialVehiculo->km_proximo;
                $historial->precio = $venta->mtototventa;
                $historial->notas = $historialVehiculo->nota;
                $historial->fechaproxima = $historialVehiculo->fecha_proxima;
                $historial->idusuario = 1;
                $historial->fkidventa = $venta->idventa;
                $historial->fkidvehiculo = $venta->fkidvehiculo;
                $historial->fechahoratransaccion = $fechatran;
                $historial->save();
            }

            $vehiculoParte = json_decode($request->vehiculoParte);
            $cantidadParteVehiculo = json_decode($request->cantidadParteVehiculo);
            $estadoParteVehiculo = json_decode($request->estadoParteVehiculo);
            $observacionParteVehiculo = json_decode($request->observacionParteVehiculo);
            $imagenParteVehiculo = json_decode($request->imagenParteVehiculo);
            $indiceParteVehiculo = json_decode($request->indiceParteVehiculo);

            $length = sizeof($vehiculoParte);
            for ($i = 0; $i < $length; $i++) {
                if ($cantidadParteVehiculo[$i] > 0) {

                    $vehiculoParteDetalle = new VehiculoPartesVentaDetalle();
                    $vehiculoParteDetalle->setConnection($connection);
                    $vehiculoParteDetalle->cantidad = $cantidadParteVehiculo[$i];
                    $vehiculoParteDetalle->estado = $estadoParteVehiculo[$i];
                    $vehiculoParteDetalle->observaciones = $observacionParteVehiculo[$i];
                    $vehiculoParteDetalle->fkidventa = $venta->idventa;
                    $vehiculoParteDetalle->fkidvehiculopartes = $vehiculoParte[$i];
                    $vehiculoParteDetalle->save();
                    
                    $arrayImages = $imagenParteVehiculo[$i];
                    $size = sizeof($arrayImages);
                    for ($j = 0; $j < $size; $j++) {
                        try {
                            if ($arrayImages[$j]->path) {
                                $arr = explode('.', $arrayImages[$j]->foto);
                                $milisegundos = round(microtime(true) * 1000);
                                $name = md5($milisegundos);
                                $extension = $arr[sizeof($arr)-1];
                                $path = str_replace('/storage', 'public', $arrayImages[$j]->foto);

                                $resource = Storage::get($path);
                                $image = Image::make($resource);
                                $image->resize(700, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                    $constraint->upsize();
                                });
                                $imgData = (string)$image->encode('jpg', 30);
                                $pathStore = "public/img/vehiculo/partes/" . $name . "." . $extension;
                                Storage::put($pathStore, $imgData);
                                $pathAbosobulte = "/storage/img/vehiculo/partes/" . $name . "." . $extension;
                                $vehiculoParteFotoDet = new VehiculoParteDetalleFoto();
                                $vehiculoParteFotoDet->setConnection($connection);
                                $vehiculoParteFotoDet->foto = $pathAbosobulte;
                                $vehiculoParteFotoDet->fkidvehicpartesventadetalle = $vehiculoParteDetalle->idvehicpartesventadetalle;
                                $vehiculoParteFotoDet->save();

                            } else {
                                $foto = $arrayImages[$j]->foto;
                                $extension = explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];
                                $milisegundos = round(microtime(true) * 1000);
                                $name = md5($milisegundos);
                                $image = Image::make($foto);
                                $image->resize(700, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                    $constraint->upsize();
                                });
                                $imgData = (string)$image->encode('jpg',30);
                                $pathStore = "public/img/vehiculo/partes/" . $name . "." . $extension;
                                Storage::put($pathStore, $imgData);
                                $pathAbosobulte = "/storage/img/vehiculo/partes/" . $name . "." . $extension;
                                $vehiculoParteFotoDet = new VehiculoParteDetalleFoto();
                                $vehiculoParteFotoDet->setConnection($connection);
                                $vehiculoParteFotoDet->foto = $pathAbosobulte;
                                $vehiculoParteFotoDet->fkidvehicpartesventadetalle = $vehiculoParteDetalle->idvehicpartesventadetalle;
                                $vehiculoParteFotoDet->save();

                            }
                        } catch (\Throwable $th) {
                            DB::rollback();
                            return response()->json([
                                "response" => 0,
                                "message" => "Ocurrio un problema al guardar la imagen",
                                'error' => [
                                    'message' => $th->getMessage(),
                                    'file' => $th->getFile(),
                                    'line' => $th->getLine()
                                ]
                            ]);
                        }
                    }
                }
            }

           // $factura= new SoapController($request);
            $bandera = 0;
            $factura = null;
            $codigoControl = '';
            $codigoqr = '';
            $date = explode('-', $venta->fecha);
            $fecha = $date[0].$date[1].$date[2];

            $dosificacion = DB::connection($connection)
                ->table('facdosificacion')
                ->where('estado', '=', 'A')
                ->where('fechalimiteemision', '>=', $venta->fecha)
                ->whereNull('deleted_at')
                ->orderBy('idfacdosificacion', 'asc')
                ->first();

            if ($facturarsiempre == 'P' || $facturarsiempre == 'S') {
                if ($dosificacion == null) {
                    $bandera = 1;
                }else {
                    $suc = new Sucursal();
                    $suc->setConnection($connection);
                    $sucursal = $suc->find($dosificacion->fkidsucursal);

                    if ($sucursal != null) {
                        $venta->impuestoiva = $sucursal->impuestoiva == null ? 0 : $sucursal->impuestoiva;
                    }
                }
            }


           // $factura= new SoapController($request);
           // $bandera = 0;
            if ($facturarsiempre == 'S' && $fkidtipocontacredito == 1  && !$config_cliente->ventaendospasos) {

                if ($dosificacion != null) {

                    $controlCode = new ControlCode();

                    $codigoControl = $controlCode->generate(
                        $dosificacion->numeroautorizacion,
                        $dosificacion->numfacturasiguiente,
                        ($nitcliente == '') ? 0: $nitcliente,
                        $fecha,
                        $venta->mtototventa,
                        $dosificacion->llave,
                        $connection
                    );

                    $facturajson = new \stdClass();
                    $facturajson->nitemisor = $dosificacion->nit;
                    $facturajson->nrofactura = $dosificacion->numfacturasiguiente;
                    $facturajson->nroautorizacion = $dosificacion->numeroautorizacion;
                    $facturajson->fecha = $date[2].'/'.$date[1].'/'.$date[0];
                    $facturajson->total = $venta->mtototventa;
                    $facturajson->codigocontrol = $codigoControl;
                    $facturajson->nitcliente = ($nitcliente == '') ? 0: $nitcliente;
                    $facturajson->connection = $connection;

                    $codigoqr = $controlCode->generarqr($facturajson);

                    $factura  = new Factura();
                    $factura->setConnection($connection);
                    $factura->numero = $dosificacion->numfacturasiguiente;
                    $factura->nombre = $namecliente;
                    $factura->nit = ($nitcliente == '') ? 0: $nitcliente;
                    $factura->fecha = $venta->fecha;
                    $factura->estado = 'V';
                    $factura->notas = '';
                    $factura->idusuario = $request->x_idusuario;
                    $factura->fechahoratransac = $request->x_fecha . ' ' . $request->x_hora;
                    $factura->codigoqr = $codigoqr;
                    $factura->codigodecontrol = $codigoControl;
                    $factura->mtototalventa = $venta->mtototventa*1;
                    $factura->mtodescuento = $venta->mtototdescuento*1;
                    $factura->mtoincremento = $venta->mtototincremento*1;
                    $factura->mtototnetoventa = $venta->mtototventa - $venta->mtototdescuento + $venta->mtototincremento;
                    $factura->contadordelimpresion = 0;
                    $factura->fkidventa = $venta->idventa;
                    $factura->setConnection($connection);
                    $factura->save();

                    $dosif = new Dosificacion();
                    $dosif->setConnection($connection);
                    $facdosificacion =  $dosif->find($dosificacion->idfacdosificacion);
                    $facdosificacion->numfacturasiguiente = $dosificacion->numfacturasiguiente + 1;
                    $facdosificacion->setConnection($connection);
                    $facdosificacion->update();

                    $libroventa = new LibroVenta();
                    $libroventa->setConnection($connection);
                    $libroventa->especificacion = "3";
                    $libroventa->nro = sizeof(DB::connection($connection)->table('faclibroventa')->get() ) + 1;
                    $libroventa->fechafactura = $factura->fecha;
                    $libroventa->nrofactura = $factura->numero;
                    $libroventa->nroautorizacion = $dosificacion->numeroautorizacion;
                    $libroventa->estado = 'V';
                    $libroventa->nitcliente = $factura->nit;
                    $libroventa->nombrerazonsocial = $factura->nombre;
                    $libroventa->importetotalventa = $factura->mtototalventa;
                    $libroventa->importeice_ie_otronoiva = 0;
                    $libroventa->exportoperacionextensas = 0;
                    $libroventa->ventagrabadatasacero = 0;
                    $libroventa->subtotal = $factura->mtototalventa - $libroventa->importeice_ie_otronoiva - $libroventa->exportoperacionextensas - $libroventa->ventagrabadatasacero;
                    $libroventa->descuentosbonificarebajasujetaiva = $factura->mtodescuento;
                    $libroventa->importebasecreditofiscal = $libroventa->subtotal - $libroventa->descuentosbonificarebajasujetaiva;
                    $libroventa->debitofiscal = ($libroventa->importebasecreditofiscal*13)/100;
                    $libroventa->codigocontrol = $factura->codigodecontrol;
                    $libroventa->fkidfactura = $factura->idfactura;
                    $libroventa->fkidfactipolibroventa = 1;
                    $libroventa->setConnection($connection);
                    $libroventa->save();

                    $venta->segenerofactura = 'S';

                }else {
                    $bandera = 1;
                }
            }

            $activo = 0;

            if ($config_cliente->asientoautomdecomprob == 'N') {

                if ($config_cliente->asientoautomaticosiempre == 'S') {
                    $function = new Functions();
                    $activo = $function->asienAutomVentaContadoCredito($venta->idventa, $request->x_idusuario, $connection);
                    if ($activo > 0) {

                        $venta->sehizoasientautom = 'S';

                        if ($ventaplandepago != null) {
                            $obj = new PlanDePago();
                            $obj->setConnection($connection);
                            $planPago = $obj->find($ventaplandepago);

                            $planPago->sehizoasientautom = 'S';
                            $planPago->setConnection($connection);
                            $planPago->update();
                        }

                        if ($idcobro != null) {
                            $obj = new Cobro();
                            $obj->setConnection($connection);
                            $cobro = $obj->find($idcobro);
                            $cobro->sehizoasientautom = 'S';
                            $cobro->update();
                        }

                    }
                }
            }

            $venta->setConnection($connection);
            $venta->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto la venta ' . $venta->idventa;
            $log->guardar($request, $accion);
         

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'Se guardo correctamente',
                'idventa' => $venta->idventa,
                //'resultadoFactura'=>$factura->crearFactura(),
                'facturarsiempre' => $facturarsiempre,
                'bandera' => $bandera,
                'activo' => $activo,
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
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
     }
     public function recibo_venta(Request $request)
    {
        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $facturarsiempre = $request->facturarsiempre;
            $generarfactura = $request->generarfactura;
            $nitcliente = $request->nitcliente;
            $namecliente = $request->namecliente;
            $fkidtipocontacredito = $request->fkidtipocontacredito;
            $idventa = $request->idventa;

            $factura = null;
            $codigoControl = '';
            $codigoqr = '';

            $bandera = 0;

            $vent = new Venta();
            $vent->setConnection($connection);
            $venta =  $vent->find($idventa);

            $date = explode('-', $venta->fecha);
            $fecha = $date[0].$date[1].$date[2];

            if (($facturarsiempre == 'P' || $facturarsiempre == 'S') && $generarfactura == 'A') {

                $dosificacion = DB::connection($connection)
                    ->table('facdosificacion')
                    ->where('estado', '=', 'A')
                    ->where('fechalimiteemision', '>=', $venta->fecha)
                    ->whereNull('deleted_at')
                    ->orderBy('idfacdosificacion', 'asc')
                    ->first();

                if ($dosificacion != null) {

                    $facturafirst = DB::connection($connection)
                        ->table('factura')
                        ->where('fkidventa', '=', $idventa)
                        ->whereNull('deleted_at')
                        ->orderBy('idfactura', 'desc')
                        ->first();

                    if ($facturafirst == null) {

                        $vent = new Venta();
                        $vent->setConnection($connection);
                        $venta =  $vent->find($idventa);

                        $controlCode = new ControlCode();

                        $codigoControl = $controlCode->generate(
                            $dosificacion->numeroautorizacion,
                            $dosificacion->numfacturasiguiente,
                            ($nitcliente == '') ? 0: $nitcliente,
                            $fecha,
                            $venta->mtototventa,
                            $dosificacion->llave,
                            $connection
                        );

                        $facturajson = new \stdClass();
                        $facturajson->nitemisor = $dosificacion->nit;
                        $facturajson->nrofactura = $dosificacion->numfacturasiguiente;
                        $facturajson->nroautorizacion = $dosificacion->numeroautorizacion;
                        $facturajson->fecha = $date[2].'/'.$date[1].'/'.$date[0];
                        $facturajson->total = $venta->mtototventa;
                        $facturajson->codigocontrol = $codigoControl;
                        $facturajson->nitcliente = ($nitcliente == '') ? 0: $nitcliente;
                        $facturajson->connection = $connection;

                        $codigoqr = $controlCode->generarqr($facturajson);

                        $factura  = new Factura();
                        $factura->setConnection($connection);
                        $factura->numero = $dosificacion->numfacturasiguiente;
                        $factura->nombre = $namecliente;
                        $factura->nit = ($nitcliente == '') ? 0: $nitcliente;
                        $factura->fecha = $venta->fecha;
                        $factura->estado = 'V';
                        $factura->notas = '';
                        $factura->idusuario = $request->x_idusuario;

                        $factura->fechahoratransac = $request->x_fecha.' '.$request->x_hora;
                        $factura->codigoqr = $codigoqr;
                        $factura->codigodecontrol = $codigoControl;
                        $factura->mtototalventa = $venta->mtototventa*1;
                        $factura->mtodescuento = $venta->mtototdescuento*1;
                        $factura->mtoincremento = $venta->mtototincremento*1;
                        $factura->mtototnetoventa = $venta->mtototventa - $venta->mtototdescuento + $venta->mtototincremento;
                        $factura->contadordelimpresion = 1;
                        $factura->fkidventa = $venta->idventa;
                        $factura->setConnection($connection);
                        $factura->save();

                        $dosif = new Dosificacion();
                        $dosif->setConnection($connection);
                        $facdosificacion =  $dosif->find($dosificacion->idfacdosificacion);
                        $facdosificacion->numfacturasiguiente = $dosificacion->numfacturasiguiente + 1;
                        $facdosificacion->setConnection($connection);
                        $facdosificacion->update();

                        $libroventa = new LibroVenta();
                        $libroventa->setConnection($connection);
                        $libroventa->especificacion = "3";
                        $libroventa->nro = sizeof(DB::connection($connection)->table('faclibroventa')->get() ) + 1;
                        $libroventa->fechafactura = $factura->fecha;
                        $libroventa->nrofactura = $factura->numero;
                        $libroventa->nroautorizacion = $dosificacion->numeroautorizacion;
                        $libroventa->estado = 'V';
                        $libroventa->nitcliente = $factura->nit;
                        $libroventa->nombrerazonsocial = $factura->nombre;
                        $libroventa->importetotalventa = $factura->mtototalventa;
                        $libroventa->importeice_ie_otronoiva = 0;
                        $libroventa->exportoperacionextensas = 0;
                        $libroventa->ventagrabadatasacero = 0;
                        $libroventa->subtotal = $factura->mtototalventa - $libroventa->importeice_ie_otronoiva - $libroventa->exportoperacionextensas - $libroventa->ventagrabadatasacero;
                        $libroventa->descuentosbonificarebajasujetaiva = $factura->mtodescuento;
                        $libroventa->importebasecreditofiscal = $libroventa->subtotal - $libroventa->descuentosbonificarebajasujetaiva;
                        $libroventa->debitofiscal = ($libroventa->importebasecreditofiscal*13)/100;
                        $libroventa->codigocontrol = $factura->codigodecontrol;
                        $libroventa->fkidfactura = $factura->idfactura;
                        $libroventa->fkidfactipolibroventa = 1;
                        $libroventa->setConnection($connection);
                        $libroventa->save();

                        $venta->segenerofactura = 'S';
                        $venta->setConnection($connection);
                        $venta->update();

                    }else {
                        $fact = new Factura();
                        $fact->setConnection($connection);
                        $factu = $fact->find($facturafirst->idfactura);
                        $factu->contadordelimpresion = $factu->contadordelimpresion + 1;
                        $factu->setConnection($connection);
                        $factu->update();
                    }

                }else {
                    $bandera = 1;
                }
            }

            $venta_first = DB::connection($connection)
                ->table('venta as v')
                ->join('sucursal as s', 'v.fkidsucursal', '=', 's.idsucursal')
                ->join('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                ->join('almacenproddetalle as apd', 'vd.fkidalmacenproddetalle', '=', 'apd.idalmacenproddetalle')
                ->join('almacen as a', 'apd.fkidalmacen', '=', 'a.idalmacen')
                ->join('producto as p', 'apd.fkidproducto', '=', 'p.idproducto')
                ->join('moneda as m', 'v.fkidmoneda', '=', 'm.idmoneda')
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
                    'v.tomarcomisionvendedor as comision', 'v.fkidtipocontacredito', 'v.tc'
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

            if ($config_cliente->facturarsiempre == 'P' || $config_cliente->facturarsiempre == 'S') {

                $dosificacion = DB::connection($connection)
                    ->table('facdosificacion')
                    ->where('estado', '=', 'A')
                    ->where('fechalimiteemision', '>=', $venta->fecha)
                    ->whereNull('deleted_at')
                    ->orderBy('idfacdosificacion', 'asc')
                    ->first();

                if ($dosificacion == null) {
                    $bandera = 1;
                }
            }

            DB::commit();
            
            return response()->json(array(
                "response" => 1,
                'configcliente' => $config_cliente,
                'venta' => $venta_first,
                'venta_detalle' => $venta_detalle,
                'planpago' => $planpago,
                'bandera' => $bandera,
                'codigocontrol' => $codigoControl,
                'codigoqr' => $codigoqr,

                'factura' => $factura,
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
    public function recibo_venta_show(Request $request) {
        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idventa = $request->idventa;

            $fecha = explode('-', $request->x_fecha);
            $fecha = $fecha[0].$fecha[1].$fecha[2];

            $factura = null;
            $codigoControl = '';
            $codigoqr = '';

            $bandera = 0;

            $facturafirst = DB::connection($connection)
                ->table('factura')
                ->where('fkidventa', '=', $idventa)
                ->whereNull('deleted_at')
                ->orderBy('idfactura', 'desc')
                ->first();


            if ($facturafirst != null && $request->bandera == 1) {

                $fact = new Factura();
                $fact->setConnection($connection);
                $factu = $fact->find($facturafirst->idfactura);
                $factu->contadordelimpresion = $factu->contadordelimpresion + 1;
                $factu->setConnection($connection);
                $factu->update();


                $libroventa = DB::connection($connection)
                    ->table('faclibroventa')
                    ->where('fkidfactura', '=', $facturafirst->idfactura)
                    ->whereNull('deleted_at')
                    ->first();

                if ($libroventa == null) {

                    $vent = new Venta();
                    $vent->setConnection($connection);
                    $venta =  $vent->find($idventa);

                    $venta->segenerofactura = 'S';
                    $venta->setConnection($connection);
                    $venta->update();

                    $dosificacion = DB::connection($connection)
                        ->table('facdosificacion')
                        ->where('estado', '=', 'A')
                        ->where('fechalimiteemision', '>=', $request->x_fecha)
                        ->whereNull('deleted_at')
                        ->orderBy('idfacdosificacion', 'asc')
                        ->first();
                    
                    $libroventa = new LibroVenta();
                    $libroventa->setConnection($connection);
                    $libroventa->especificacion = "3";
                    $libroventa->nro = sizeof(DB::connection($connection)->table('faclibroventa')->get() ) + 1;
                    $libroventa->fechafactura = $facturafirst->fecha;
                    $libroventa->nrofactura = $facturafirst->numero;
                    $libroventa->nroautorizacion = $dosificacion->numeroautorizacion;
                    $libroventa->estado = 'V';
                    $libroventa->nitcliente = $facturafirst->nit;
                    $libroventa->nombrerazonsocial = $facturafirst->nombre;
                    $libroventa->importetotalventa = $facturafirst->mtototalventa;
                    $libroventa->importeice_ie_otronoiva = 0;
                    $libroventa->exportoperacionextensas = 0;
                    $libroventa->ventagrabadatasacero = 0;
                    $libroventa->subtotal = $facturafirst->mtototalventa - $libroventa->importeice_ie_otronoiva - $libroventa->exportoperacionextensas - $libroventa->ventagrabadatasacero;
                    $libroventa->descuentosbonificarebajasujetaiva = $facturafirst->mtodescuento;
                    $libroventa->importebasecreditofiscal = $libroventa->subtotal - $libroventa->descuentosbonificarebajasujetaiva;
                    $libroventa->debitofiscal = ($libroventa->importebasecreditofiscal*13)/100;
                    $libroventa->codigocontrol = $facturafirst->codigodecontrol;
                    $libroventa->fkidfactura = $facturafirst->idfactura;
                    $libroventa->fkidfactipolibroventa = 1;
                    $libroventa->setConnection($connection);
                    $libroventa->save();

                }
            }

            $venta_first = DB::connection($connection)
                ->table('venta as v')
                ->join('sucursal as s', 'v.fkidsucursal', '=', 's.idsucursal')
                ->join('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                ->join('almacenproddetalle as apd', 'vd.fkidalmacenproddetalle', '=', 'apd.idalmacenproddetalle')
                ->join('almacen as a', 'apd.fkidalmacen', '=', 'a.idalmacen')
                ->join('producto as p', 'apd.fkidproducto', '=', 'p.idproducto')
                ->join('moneda as m', 'v.fkidmoneda', '=', 'm.idmoneda')
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
                    'v.tomarcomisionvendedor as comision', 'v.fkidtipocontacredito', 'v.tc'
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
                'bandera' => $bandera,
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
    /**
     * Show the specified resource.
     * @return Response
     */
    public function show()
    {
        return view('commerce::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @return Response
     */
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Venta();
            $obj->setConnection($connection);

            $venta = $obj->select('venta.idventa', 'venta.sehizoasientautom', 'venta.mtovtabruta',
                    DB::raw('(SELECT SUM(vd.cantidad*vd.preciounit) as subtotal FROM ventadetalle vd 
                        WHERE vd.fkidventa=venta.idventa AND vd.deleted_at is null) as subtotal'),
                    DB::raw('(SELECT SUM(vd.factor_desc_incre) as descuento FROM ventadetalle vd 
                        WHERE vd.fkidventa=venta.idventa AND vd.deleted_at is null) as descuento')
                )
                ->where('idventa', '=', $id)
                ->first();

            if ($venta != null) {
                if ($venta->sehizoasientautom == null || $venta->mtovtabruta == null || $venta->mtovtabruta = 0) {
                    $obj = new Venta();
                    $obj->setConnection($connection);

                    $data = $obj->find($venta->idventa);
                    $data->sehizoasientautom = 'N';
                    $data->mtovtabruta = $venta->subtotal * 1 - ($venta->subtotal * ($venta->descuento * 1 / 100));
                    $data->update();
                }
            }
            

            $datosPersonal = DB::connection($connection)->select(
                'select v.idventa, v.fkidtipocontacredito, v.codventa,v.fecha, v.hora,v.anticipo, c.nombre as nombreCliente,
                    c.apellido as apellidoCliente, c.idcliente,ve.idvendedor,s.idsucursal,c.nit,
                    c.codcliente,ve.codvendedor,ve.nombre as nombreVendedor,ve.apellido as apellidoVendedor,
                    s.nombre as nombreSucursal,v.descuentoporcentaje,v.recargoporcentaje, cv.valor as valorcomision, 
                    v.tomarcomisionvendedor, s.tipoempresa, s.nombrecomercial, s.razonsocial, v.tc
                from venta v,cliente c,vendedor ve,sucursal s, comisionventa cv
                where v.idventa=:id and v.fkidcliente = c.idcliente and v.fkidvendedor=ve.idvendedor and 
                        v.fkidsucursal=s.idsucursal and cv.idcomisionventa = ve.fkidcomisionventa',['id' => $id]);
            
            $datosDePlanPago1 = DB::connection($connection)->select('select v.idventa,vp.*
                from venta v,ventaplandepago vp
                where v.idventa=:id and v.idventa=vp.fkidventa
                order by vp.idventaplandepago asc', //order by vp.fechaapagar asc
                ["id" => $id]);

            $venta_detalle = DB::connection($connection)
                ->table('venta as v')
                ->leftJoin('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                ->leftJoin('almacenproddetalle as ad', 'vd.fkidalmacenproddetalle', '=', 'ad.idalmacenproddetalle')
                ->leftJoin('almacen as a', 'ad.fkidalmacen', '=', 'a.idalmacen')
                ->leftJoin('producto as p', 'ad.fkidproducto', '=', 'p.idproducto')
                ->leftJoin('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->leftJoin('listapreproducdetalle as lpd', 'vd.fkidlistapreproducdetalle', '=', 'lpd.idlistapreproducdetalle')
                ->leftJoin('listaprecio as lp', 'lpd.fkidlistaprecio', '=', 'lp.idlistaprecio')
                ->select('v.idventa', 'vd.cantidad', 'vd.preciounit', 'vd.factor_desc_incre', 'p.idproducto', 'p.descripcion', 'p.codproducto',
                    'u.abreviacion', 'u.descripcion as unidadmedida', 'a.descripcion as almacen', 'a.idalmacen', 'p.tipo', 'v.notas',
                    'v.fkidtipocontacredito', 'lp.descripcion as listadescripcion'
                )
                ->where('v.idventa', '=', $id)
                ->whereNull('v.deleted_at')
                ->whereNull('vd.deleted_at')
                ->whereNull('ad.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('u.deleted_at')
                ->whereNull('lpd.deleted_at')
                ->whereNull('lp.deleted_at')
                ->whereNull('a.deleted_at')
                ->orderBy('vd.idventadetalle', 'asc')
                ->get();
            
            $datosDetallePrecio = DB::connection($connection)->select('select *,lp.descripcion as listadescripcion
                from venta v,ventadetalle vd,listapreproducdetalle lpd,listaprecio lp,moneda m
                    where v.idventa = :id and v.idventa=vd.fkidventa and lpd.idlistapreproducdetalle=vd.fkidlistapreproducdetalle
                and lp.idlistaprecio=lpd.fkidlistaprecio and v.fkidmoneda=m.idmoneda',["id"=>$id]);
            
            $vet = new Venta();
            $vet->setConnection($connection);
            $cobros1 = DB::connection($connection)
                        ->table('venta as v')
                        ->join('ventaplandepago as vp', 'vp.fkidventa', '=', 'v.idventa')
                        ->join('cobroplanpagodetalle as cpd', 'cpd.fkidventaplandepago', '=', 'vp.idventaplandepago')
                        ->where('v.idventa', '=', $id)
                        ->whereNull('v.deleted_at')
                        ->whereNull('vp.deleted_at')
                        ->whereNull('cpd.deleted_at')
                        ->orderBy('cpd.idcobroplanpagodetalle')
                        ->get();
            
            $cobros = $cobros1;
            $datosDePlanPago = $datosDePlanPago1;
            if (sizeof($cobros1) > 0 && $cobros1[0]->anticipo !== 0) {
                $i = 0;
                $cobros = [];
                while ($i < sizeof($cobros1)) {
                    if ($i > 0) {
                        array_push($cobros, $cobros1[$i]);
                    }
                    $i++;
                }

                $i = 0;
                $datosDePlanPago = [];
                while ($i < sizeof($datosDePlanPago1)) {
                    if ($i > 0) {
                        array_push($datosDePlanPago, $datosDePlanPago1[$i]);
                    }
                    $i++;
                }
            }
            $arr = [];
            $size1 = sizeof($datosDePlanPago);

            $i = 0; $j = 0;
            while ($i < $size1) {
                $idpd = $datosDePlanPago[$i]->idventaplandepago;
                $sum = 0;
                $size2 = sizeof($cobros);
                while ($j < $size2 && $idpd == $cobros[$j]->fkidventaplandepago) {
                    $sum = $sum + (float)$cobros[$j]->montocobrado;
                    $j++;
                }
                $i++;
                $datosDePlanPago[$i-1]->montocobrado = $sum;
                array_push($arr, $datosDePlanPago[$i-1]);
            }

            $vent = new Venta();
            $vent->setConnection($connection);
            $vehiculo = $vent->leftJoin('vehiculo as v', 'v.idvehiculo', 'venta.fkidvehiculo')
                ->leftJoin('vehiculotipo as vt', 'vt.idvehiculotipo', 'v.fkidvehiculotipo')
                ->select('v.idvehiculo', 'v.descripcion', 'v.codvehiculo', 'v.placa', 'vt.descripcion as tipo')
                ->where('venta.idventa', '=', $id)
                ->first();


            $facturafirst = DB::connection($connection)
                ->table('factura')
                ->where('fkidventa', '=', $id)
                ->whereNull('deleted_at')
                ->orderBy('idfactura', 'desc')
                ->first();
            
            return response()->json(array(
                "response" => 1,
                "data" => $datosPersonal,
                "datosPlan" => $arr,
                "datosDetalle" => $venta_detalle,
                "datosDetallePrecio" => $datosDetallePrecio,
                "vehiculo" => $vehiculo,
                'factura' => $facturafirst,

                'venta' => $venta,
            ));
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
                'message' => 'Ocurrio un problema al procesar la solicitud',
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
    public function update(Request $request)
    {
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

            $vet = new Venta();
            $vet->setConnection($connection);
            $venta = $vet->find($id);
            if ($venta == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'La venta no existe'
                ]);
            }

            if ($venta->fkidtipocontacredito == 2) {
                $planp = new PlanDePago();
                $planp->setConnection($connection);
                $plan = $planp->where('fkidventa', $id)->get();
                //return response()->json(['plan' => $plan], 500);
                if ($venta->anticipo != 0 && count($plan) > 1) {
                    foreach ($plan as $key => $row) {
                        if ($key > 0 && $row['montopagado'] > 0) {
                            DB::rollback();
                            return response()->json([
                                'response' => 0,
                                'message' => 'No se puede eliminar, la venta ya cuenta con una cuota cancelada'
                            ]);
                        }
                        $row->setConnection($connection);
                        $row->delete();
                    }
                } else if (count($plan) > 0) {
                    foreach ($plan as $row) {
                        if ($row['montopagado'] > 0 && $venta->fkidtipocontacredito != 1) {
                            DB::rollback();
                            return response()->json([
                                'response' => 0,
                                'message' => 'No se puede eliminar, la venta ya cuenta con una cuota cancelada'
                            ]);
                        }
                        $row->setConnection($connection);
                        $row->delete();
                    }
                }
                
                $veh = new VehiculoHistorial();
                $veh->setConnection($connection);
                $vehiculohistoria = $veh->where('fkidventa', $id)->first();
                if ($vehiculohistoria != null) {
                    $vehiculohistoria->setConnection($connection);
                    $vehiculohistoria->delete();
                }
    
                $vehpartes = $vet->leftJoin('vehicpartesventadetalle as vpvd', 'vpvd.fkidventa', 'venta.idventa')
                                ->leftJoin('vehiculopartedetafoto as vpdf', 'vpdf.fkidvehicpartesventadetalle', 'vpvd.idvehicpartesventadetalle')
                                ->where('venta.idventa', $id)                         
                                ->whereNull('vpvd.deleted_at')
                                ->whereNull('vpdf.deleted_at')
                                ->distinct('vpdf.idvehiculopartedetafoto')
                                ->get();
                $idsvehpartes = [];
                $idsfotos = [];
                $i = 0;
                $size = sizeof($vehpartes);
                while ($i < $size) {
                    $id = $vehpartes[$i]->idvehicpartesventadetalle;
                    while ($i < $size && $id == $vehpartes[$i]->idvehicpartesventadetalle) {
                        array_push($idsfotos, $vehpartes[$i]->idvehiculopartedetafoto);
                        $path = $vehpartes[$i]->foto;
                        //$path = str_replace("/storage", "/app/public", $path);
                        $path = str_replace("/storage", "", $path);
                        //$path = storage_path() . $path;
                        Storage::delete($path);
                        //unlink($path); //eliminar sin verificar si lo hace bien
                        $i++;
                    }
                    array_push($idsvehpartes, $vehpartes[$i-1]->idvehicpartesventadetalle);
                }
    
                if ($i != 0) {
                    $vpvd = new VehiculoPartesVentaDetalle();
                    $vpvd->setConnection($connection);
                    $vpvd->destroy($idsvehpartes);
                    
                    $vpdf = new VehiculoParteDetalleFoto();
                    $vpdf->setConnection($connection);
                    $vpdf->destroy($idsfotos);
                }
            } else {
                $vent = $vet->leftJoin('ventaplandepago as vp', 'vp.fkidventa', 'venta.idventa')
                            ->leftJoin('cobroplanpagodetalle as cpd', 'cpd.fkidventaplandepago', 'vp.idventaplandepago')
                            ->leftJoin('cobro as c', 'c.idcobro', 'cpd.fkidcobro')
                            ->where('venta.idventa', $venta->idventa)
                            ->whereNull('cpd.deleted_at')
                            ->whereNull('vp.deleted_at')
                            ->whereNull('c.deleted_at')
                            ->select('venta.idventa', 'cpd.idcobroplanpagodetalle', 'vp.idventaplandepago', 'c.idcobro')
                            ->first();

                if ( !is_null($vent) ) {

                    $vp = new PlanDePago();
                    $vp->setConnection($connection);
                    $elem = $vp->find($vent->idventaplandepago);
                    if ($elem != null) {
                        $elem->delete();
                    }
                    $cob = new Cobro();
                    $cob->setConnection($connection);
                    $elem = $cob->find($vent->idcobro);
                    if ($elem != null) {
                        $elem->delete();
                    }

                    $cpd = new CobroPlanPagoDet();
                    $cpd->setConnection($connection);
                    $elem = $cpd->find($vent->idcobroplanpagodetalle);
                    if ($elem != null) {
                        $elem->delete();
                    }

                }

            }

            $obj = new VentaDetalle();
            $obj->setConnection($connection);
            $ventadetalle = $obj
                ->leftJoin('almacenproddetalle as almdet', 'ventadetalle.fkidalmacenproddetalle', 'almdet.idalmacenproddetalle')
                ->select('ventadetalle.*', 'almdet.fkidproducto')
                ->where('ventadetalle.fkidventa', $venta->idventa)
                ->get();

            foreach ($ventadetalle as $detalle) {

                $obj = new AlmacenProdDetalle();
                $obj->setConnection($connection);
                $value = $obj->find($detalle->fkidalmacenproddetalle);
                $value->stock = $value->stock * 1 + $detalle->cantidad * 1;
                $value->setConnection($connection);
                $value->update();

                $obj = new Producto();
                $obj->setConnection($connection);
                $value = $obj->find($detalle->fkidproducto);
                $value->stock = $value->stock * 1 + $detalle->cantidad * 1;
                $value->setConnection($connection);
                $value->update();

                $obj = new VentaDetalle();
                $obj->setConnection($connection);
                $value = $obj->find($detalle->idventadetalle);
                $value->setConnection($connection);
                $value->delete();

            }

            
            $venta->delete();

            $factura = DB::connection($connection)
                ->table('factura')
                ->where('fkidventa', '=', $id)
                ->whereNull('deleted_at')
                ->first();

            if ($factura != null) {

                $fact = new Factura();
                $fact->setConnection($connection);
                $factura = $fact->find($factura->idfactura);
                $factura->estado = 'A';
                $factura->setConnection($connection);
                $factura->update();
                $factura->delete();

                $libroventa = DB::connection($connection)
                    ->table('faclibroventa')
                    ->where('fkidfactura', '=', $factura->idfactura)
                    ->whereNull('deleted_at')
                    ->first();

                if ($libroventa != null) {
                    $lib = new LibroVenta();
                    $lib->setConnection($connection);
                    $libroventa = $lib->find($libroventa->idfaclibroventa);
                    $libroventa->estado = 'A';
                    $libroventa->setConnection($connection);
                    $libroventa->update();
                    $libroventa->delete();
                }

            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la venta ' . $venta->idventa;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'Se elimino correctamente'
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
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    public function proforma(Request $request) {
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
                ->where('v.mtototventa', '>', 0)
                ->where($condicion)
                ->select('cliente.*')
                ->distinct('cliente.id')
                ->get();

            return response()->json([
                "response"=> 1 ,
                'data' => $result,
                'configCli' => $configCli,
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

    public function proforma_searchcliente(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;

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
                ->where('v.mtototventa', '>', 0)
                ->where($condicion)
                ->where(DB::raw("CONCAT(cliente.nombre, ' ' , cliente.apellido)"), 'ILIKE', "%$value%")
                ->select('cliente.*')
                ->distinct('cliente.id')
                ->get();

            return response()->json([
                "response"=> 1 ,
                'data' => $result,
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

    public function get_vehiculo(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idcliente = $request->idcliente;

            $vehiculos = DB::connection($connection)
                ->table('vehiculo as v')
                ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                ->Select('v.idvehiculo', 'v.placa', 'v.codvehiculo', 'vt.descripcion as vehiculotipo')
                ->where('v.fkidcliente', '=', $idcliente)
                ->whereNull('v.deleted_at')
                ->whereNull('vt.deleted_at')
                ->orderBy('v.idvehiculo', 'asc')
                ->get();

            return response()->json([
                "response"=> 1 ,
                "data"=> $vehiculos ,
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
                ->orderBy('p.idproducto', 'desc')
                ->paginate(20);
            
            return response()->json([
                "response"=> 1 ,
                "almacen"=> $almacen ,
                "data"=> $productos ,
                "idalmacen"=> $idalmacen ,
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

    public function traerUnidadMedida(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fkidunidadmedida = $request->fkidunidadmedida;

            $unid = new UnidadMedida();
            $unid->setConnection($connection);
            $unidadmedidad = $unid->where('idunidadmedida',$fkidunidadmedida)->get();

            return response()->json([
                "response" => 1,
                "data" => $unidadmedidad
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

    public function get_almacen(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idlistaprecio = $request->idlistaprecio;
            $idalmacen = $request->idalmacen;
            $idsucursal = $request->idsucursal;
            $idmoneda = $request->idmoneda;

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
                ->orderBy('p.idproducto', 'desc')
                ->paginate(20);

            return response()->json([
                "response"=> 1 ,
                "data"=> $productos ,
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

    public function get_moneda(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idalmacen = $request->idalmacen;
            $idsucursal = $request->idsucursal;
            $idmoneda = $request->idmoneda;

            $tipocambio = DB::connection($connection)
                ->table('tipocambio')
                ->where('estado', '=', 'A')
                ->where('fkidmonedauno', '=', $idmoneda)
                ->whereNull('deleted_at')
                ->first();

            $listap = new ListaPrecio();
            $listap->setConnection($connection);

            $lista_precios = $listap->where(['fkidmoneda' => $idmoneda, 'estado' => 'A'])
                ->orderBy('idlistaprecio', 'asc')->get();

            $idlistaprecio = (sizeof($lista_precios) > 0)?$lista_precios[0]->idlistaprecio:null;

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
                ->orderBy('p.idproducto', 'desc')
                ->paginate(20);

            return response()->json([
                "response"=> 1 ,
                "lista_precio"=> $lista_precios ,
                "data"=> $productos ,
                "idlistaprecio"=> $idlistaprecio ,
                'tipocambio' => $tipocambio,
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

    public function getProductos(Request $request){
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idalmacen = $request->idalmacen;
            
            $almdet = new AlmacenProdDetalle();
            $almdet->setConnection($connection);
            $productos = $almdet->leftJoin('producto','almacenproddetalle.fkidproducto','producto.idproducto')
                ->select('almacenproddetalle.stock','almacenproddetalle.idalmacenproddetalle','producto.idproducto','producto.codproducto',
                    'producto.descripcion','producto.precio','producto.tipo','producto.fkidunidadmedida')
                ->where('almacenproddetalle.fkidalmacen','=',$idalmacen)
                ->get();

            return response()->json([
                "response"=>1 , 
                "data" => $productos
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

    public function verificarStock(Request $request){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idalmacen = $request->idalmacen;
            $idproducto = $request->idproducto;

            $almdet = new AlmacenProdDetalle();
            $almdet->setConnection($connection);
            $stock = $almdet->where('fkidalmacen', $idalmacen)
                ->where('fkidproducto', $idproducto)
                ->first();

            return response()->json([
                "response" => 1,
                "data" => $stock
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

    public function get_listaprecio(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idlista = $request->idlistaprecio;
            $idalmacen = $request->idalmacen;
            $idproducto = $request->idproducto;

            $get_producto = null;

            if ($idproducto == '') {

                $productos = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion',
                        'listproddet.precio', 'p.tipo', 'almproddet.stock'
                    )
                    ->where('listproddet.fkidlistaprecio', '=', $idlista)
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->paginate(20);
            
            }else {
                $productos = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion',
                        'listproddet.precio', 'p.tipo', 'almproddet.stock'
                    )
                    ->where('listproddet.fkidlistaprecio', '=', $idlista)
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    ->where('p.idproducto', '!=', $idproducto)
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->paginate(20);

                $get_producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 
                        'listproddet.precio', 'p.tipo', 'almproddet.stock', 'listproddet.idlistapreproducdetalle'
                    )
                    ->where('listproddet.fkidlistaprecio', '=', $idlista)
                    ->where('listproddet.fkidproducto', '=', $idproducto)
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->whereNull('u.deleted_at')
                    ->first();
            }


            return response()->json([
                "response" => 1,
                "data" => $productos,
                "get_producto" => $get_producto,
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

    public function searchProducto(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->filled('value') ? $request->get('value') : '';
            $idlista = $request->idlistaprecio;
            $idalmacen = $request->idalmacen;
            $bandera = $request->bandera;

            if ($value == '') {
                $productos = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion',
                        'listproddet.precio', 'p.tipo', 'almproddet.stock'
                    )
                    ->where('listproddet.fkidlistaprecio', '=', $idlista)
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->paginate(20);
            }else {
                if ($bandera == 1) {
                    $productos = DB::connection($connection)
                        ->table('producto as p')
                        ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                        ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                        ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                        ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 
                            'listproddet.precio', 'p.tipo', 'almproddet.stock'
                        )
                        ->where('listproddet.fkidlistaprecio', '=', $idlista)
                        ->where('almproddet.fkidalmacen', '=', $idalmacen)
                        ->where('p.idproducto', 'ILIKE', '%'.$value.'%')
                        ->orWhere('p.codproducto', 'ILIKE', '%'.$value.'%')
                        ->whereNull('listproddet.deleted_at')
                        ->whereNull('p.deleted_at')
                        ->whereNull('almproddet.deleted_at')
                        ->orderBy('p.idproducto', 'desc')
                        ->paginate(20);
                }
                if ($bandera == 2) {
                    $productos = DB::connection($connection)
                        ->table('producto as p')
                        ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                        ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                        ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                        ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion')
                        ->where('listproddet.fkidlistaprecio', '=', $idlista)
                        ->where('almproddet.fkidalmacen', '=', $idalmacen)
                        ->where('p.descripcion', 'ILIKE', '%'.$value.'%')
                        ->whereNull('listproddet.deleted_at')
                        ->whereNull('p.deleted_at')
                        ->whereNull('almproddet.deleted_at')
                        ->orderBy('p.idproducto', 'desc')
                        ->paginate(20);
                }
            }

            return response()->json([
                "response" => 1,
                "data" => $productos,
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

    public function traerProductoPrecio(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idproducto = $request->idproducto;
            $idlista = $request->idlistaprecio;

            $listp = new ListaPreProducDetalle();
            $listp->setConnection($connection);
            $precio = $listp->where('fkidproducto',$idproducto)
                            ->where('fkidlistaprecio',$idlista)
                            ->get();

            return response()->json([
                "response" => 1,
                "data" => $precio
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

    public function traerPrecioProducto(Request $request){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idproducto = $request->idproducto;
            $idlista = $request->idlistaprecio;
            $idalmacen = $request->idalmacen;
            
            $productos = DB::connection($connection)
                ->table('producto as p')
                ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 
                    'listproddet.precio', 'p.tipo', 'almproddet.stock', 'almproddet.stockminimo', 'almproddet.idalmacenproddetalle',
                    'listproddet.idlistapreproducdetalle'
                )
                ->where('listproddet.fkidlistaprecio', '=', $idlista)
                ->where('listproddet.fkidproducto', '=', $idproducto)
                ->where('almproddet.fkidalmacen', '=', $idalmacen)
                ->whereNull('listproddet.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('almproddet.deleted_at')
                ->whereNull('u.deleted_at')
                ->first();

            return response()->json([
                "response" => 1,
                "data" => $productos,
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
    public function traeComisionVendedor(Request $request){
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fkidcomisionventa = $request->fkidcomisionventa;

            $com = new ComisionVenta();
            $com->setConnection($connection);
            $valorcomision = $com->where('idcomisionventa',$fkidcomisionventa)->get();

            return response()->json([
                "response" => 1,
                "data" => $valorcomision
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

    public function showVentaRegisto(Request $request){
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idventa = $request->idventa;
        
            $datosPersonal = DB::connection($connection)->select('select v.idventa,v.codventa,v.fecha,c.nombre as nombreCliente,c.apellido as apellidoCliente,
                    ve.nombre as nombreVendedor,ve.apellido as apellidoVendedor,s.nombre as nombreSucursal
                from venta v,cliente c,vendedor ve,sucursal s
                where v.idventa=:id and v.fkidcliente = c.idcliente and v.fkidvendedor=ve.idvendedor and v.fkidsucursal=s.idsucursal',['id' => $idventa]);
            
            $datosDePlanPago = DB::connection($connection)->select(' select v.idventa,vp.*
                from venta v,ventaplandepago vp
                where v.idventa=:id and v.idventa=vp.fkidventa',["id" => $idventa]);
            
            $datosDetalleVenta = DB::connection($connection)->select('select v.idventa,vd.cantidad,vd.preciounit,vd.factor_desc_incre,p.descripcion,p.codproducto,
                    u.abreviacion,a.descripcion as almacen
                from venta v,ventadetalle vd,almacenproddetalle ad,producto p,unidadmedida u,almacen a
                where v.idventa = :id and v.idventa=vd.fkidventa and vd.fkidalmacenproddetalle=ad.idalmacenproddetalle and 
                ad.fkidalmacen = a.idalmacen and ad.fkidproducto = p.idproducto and p.fkidunidadmedida=u.idunidadmedida',["id"=>$idventa]);
            
            $datosDetallePrecio = DB::connection($connection)->select('select *
                from venta v,ventadetalle vd,listapreproducdetalle lpd,listaprecio lp,moneda m
                where v.idventa = :id and v.idventa=vd.fkidventa and lpd.idlistapreproducdetalle=vd.fkidlistapreproducdetalle
                    and lp.idlistaprecio=lpd.fkidlistaprecio and lp.fkidmoneda=m.idmoneda',["id"=>$idventa]);


            return response()->json([
                "response" => 1,
                "data" => $datosPersonal,
                "datosPlan" => $datosDePlanPago,
                "datosDetalle" => $datosDetalleVenta,
                "datosDetallePrecio" => $datosDetallePrecio,
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

    /**ALEX */
    public function searchByIdCod(Request $request, $value) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();

            $vendedor = null;
            if ($configCli->clienteesabogado) {
                $user = new Usuario();
                $user->setConnection($connection);
                $vendedor = $user->leftJoin('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                    ->leftJoin('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                    ->where('usuario.idusuario', $request->get('x_idusuario'))
                    ->where('g.esv', 'S')
                    ->select('v.*')
                    ->first();
            }
            
            //return response()->json(['ven' => $vendedor]);
            $venta = new Venta();
            $venta->setConnection($connection);
            $result = $venta->SearchByIdCod($value, $vendedor)->get();
            //$result = Venta::SearchByIdCod($value, $vendedor)->get();
            $data = array();
            foreach ($result as $row) {
                $row->cliente;
                array_push($data, $row);
            }
            return response()->json([
                'response' => 1,
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
                'response' => -1,
                'message' => 'No se pudo concretar la busquedad',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
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

            $moneda = DB::connection($connection)->table('moneda')
                        ->whereNull('deleted_at')
                        ->orderBy('idmoneda', 'asc')
                        ->get();

            $almacen = DB::connection($connection)->table('almacen')
                        ->whereNull('deleted_at')
                        ->orderBy('idalmacen', 'asc')
                        ->get();

            $sucursal = DB::connection($connection)->table('sucursal')
                        ->whereNull('deleted_at')
                        ->orderBy('idsucursal', 'asc')
                        ->get();

            $tipo = DB::connection($connection)
                        ->table('tipocontacredito')
                        ->whereNull('deleted_at')
                        ->orderBy('idtipocontacredito', 'asc')
                        ->get();

            $conff = new ConfigFabrica();
            $conff->setConnection($connection);
            $confi = $conff->orderBy('idconfigfabrica', 'asc')->first();
            $confi->decrypt();

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();
            return [
                    'response'=> 1, 
                    'data' => $moneda, 
                    'vehiculoTipo' => 4,
                    'almacen' => $almacen,
                    'sucursal' => $sucursal,
                    'tipo' => $tipo,
                    'configuracion' => $confi,
                    'config' => $config,
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
                'message' => 'No se pudo concretar la busquedad',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }
    
    public function getCuotas(Request $request, $id) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $vet = new Venta();
            $vet->setConnection($connection);
            $venta = $vet->find($id);
            if ($venta == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'La venta no existe'
                ]);
            }

            $cuotas = $venta->getCuotas();
            return response()->json([
                'response' => 1,
                'cuotas' => $cuotas
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
                'message' => 'Ocurrio un problema al conectarse a la base de datos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }

    }

    public function getNroVenta(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vet = new Venta();
            $vet->setConnection($connection);
            $data = $vet->where('fkidtipotransacventa', 1)->get();
            $nro_venta = $data->count() + 1;
            return response()->json([
                'response' => 1,
                'nro_venta' => $nro_venta
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
                'message' => 'Ocurrio un problema al conectarse a la base de datos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);

        }

    }

    public function getNroProforma(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vet = new Venta();
            $vet->setConnection($connection);
            $data = $vet->where('fkidtipotransacventa', 2)->get();
            $nro_proforma = $data->count() + 1;
            return response()->json([
                'response' => 1,
                'nro_proforma' => $nro_proforma
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
                'message' => 'Ocurrio un problema al conectarse a la base de datos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);

        }
    }

    public function getHistorialVehiculo(Request $request, $id) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vet = new Venta();
            $vet->setConnection($connection);

            $historialVehiculo = $vet->leftJoin('vehiculohistoria', 'vehiculohistoria.fkidventa', '=', 'venta.idventa')
                                        ->leftJoin('cliente', 'cliente.idcliente', '=', 'venta.fkidcliente')
                                        ->leftJoin('vehiculo', 'vehiculo.idvehiculo', '=', 'venta.fkidvehiculo')
                                        ->leftJoin('vehiculotipo', 'vehiculo.fkidvehiculotipo', 'vehiculotipo.idvehiculotipo')
                                        ->where('vehiculohistoria.fkidventa', $id)
                                        ->select('vehiculohistoria.*', 'cliente.nombre', 'cliente.apellido',
                                                'vehiculotipo.descripcion', 'vehiculo.placa')
                                        ->first();
            return response()->json([
                'response' => 1,
                'data' => $historialVehiculo
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
                'message' => 'Ocurrio un problema al conectarse a la base de datos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    public function getPartesVehiculo(Request $request, $id) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vet = new Venta();
            $vet->setConnection($connection);
            $partesVehiculo = $vet->leftJoin(
                                        'vehicpartesventadetalle as vpd', 
                                        'vpd.fkidventa', 
                                        '=', 'venta.idventa'
                                    )
                                    ->leftJoin(
                                        'vehiculopartes as vp', 
                                        'vp.idvehiculopartes', 
                                        '=', 'vpd.fkidvehiculopartes')
                                    ->leftJoin(
                                        'cliente as c', 'c.idcliente', 
                                        '=', 'venta.fkidcliente'
                                    )
                                    ->leftJoin(
                                        'vehiculopartedetafoto as vpdf', 
                                        'vpdf.fkidvehicpartesventadetalle', 
                                        '=', 'vpd.idvehicpartesventadetalle'
                                    )
                                    ->leftJoin(
                                        'vehiculo as v', 
                                        'v.idvehiculo', 
                                        '=', 'venta.fkidvehiculo'
                                    )
                                    ->where('vpd.fkidventa', $id)
                                    ->select(
                                        'vpd.idvehicpartesventadetalle', 'vpd.cantidad', 'vpd.estado', 'vpd.observaciones',
                                        'c.nombre as nombreCliente', 'c.apellido as apellidoCliente',
                                        'vp.nombre as nombrePartes', 'vp.idvehiculopartes',
                                        'vpdf.foto', 'v.placa', 'venta.idventa'
                                    )
                                    ->orderBy('vpd.idvehicpartesventadetalle')
                                    ->get()
                                    ->toArray();
            $data = array();
            $length = sizeof($partesVehiculo);
            $i = 0;
            while ($i < $length) {
                $piv = $partesVehiculo[$i]['idvehicpartesventadetalle'];
                $fotos = array();
                while ($i < $length && $piv == $partesVehiculo[$i]['idvehicpartesventadetalle']) {
                    array_push($fotos, [
                        'foto' => $partesVehiculo[$i]['foto']
                    ]);
                    $i++;
                }
                array_push($data, [
                    'idvpd' => $partesVehiculo[$i-1]['idvehicpartesventadetalle'],
                    'idvp' => $partesVehiculo[$i-1]['idvehiculopartes'],
                    'cantidad' => $partesVehiculo[$i-1]['cantidad'],
                    'estado' => $partesVehiculo[$i-1]['estado'],
                    'observaciones' => $partesVehiculo[$i-1]['observaciones'],
                    'nombreCliente' => $partesVehiculo[$i-1]['nombreCliente'],
                    'apellidoCliente' => $partesVehiculo[$i-1]['apellidoCliente'],
                    'nombrePartes' => $partesVehiculo[$i-1]['nombrePartes'],
                    'placa' => $partesVehiculo[$i-1]['placa'],
                    'nroVenta' => $partesVehiculo[$i-1]['idventa'],
                    'fotos' => $fotos
                ]);
            }
            return response()->json([
                'response' => 1,
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
                'response' => -1,
                'message' => 'Ocurrio un problema al conectarse a la base de datos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function validarCodigoVenta(Request $request, $value) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vet = new Venta();
            $vet->setConnection($connection);

            $count = $vet->where(['codventa' => $value, 'fkidtipotransacventa' => 1])->count();

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

    public function validarCodigoProforma(Request $request, $value) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vet = new Venta();
            $vet->setConnection($connection);

            $count = $vet->where(['codventa' => $value, 'fkidtipotransacventa' => 2])->count();
            
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
