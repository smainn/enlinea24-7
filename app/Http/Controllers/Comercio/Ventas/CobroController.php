<?php

namespace App\Http\Controllers\Comercio\Ventas;

use App\Functions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Ventas\Cobro;
use App\Models\Comercio\Ventas\CobroPlanPagoDet;
use App\Models\Comercio\Ventas\PlanDePago;
use App\Models\Comercio\Ventas\Cliente;
use App\Models\Comercio\Ventas\Venta;
use App\Models\Seguridad\Usuario;
use App\Models\Seguridad\Log;
use App\Models\Config\ConfigCliente;
use App\Models\Configuracion\Dosificacion;
use App\Models\Configuracion\LibroVenta;
use App\Models\Facturacion\ControlCode;
use App\Models\Facturacion\Factura;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt; 
use Illuminate\Support\Facades\DB;

class CobroController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();

            $user = new Usuario();
            $user->setConnection($connection);
            $resp = $user->leftJoin('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                        ->leftJoin('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                        ->where('usuario.idusuario', $request->get('x_idusuario'))
                        ->where('g.esv', 'S')
                        ->first();
            $condicion = [];
            if ($resp != null && $configCli->clienteesabogado) {
                $condicion['venta.fkidvendedor'] = $resp->idvendedor;
            }
            $cobro = new Cobro();
            $cobro->setConnection($connection);
            $datos = $cobro->leftJoin('cobroplanpagodetalle','cobroplanpagodetalle.fkidcobro','=','cobro.idcobro')
                            ->leftJoin('ventaplandepago','ventaplandepago.idventaplandepago','=','cobroplanpagodetalle.fkidventaplandepago')
                            ->leftJoin('venta','venta.idventa','=','ventaplandepago.fkidventa')
                            ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                            ->select(
                                'cobro.*',
                                'cliente.nombre as nombreCliente',
                                'cliente.apellido as apellidoCliente',
                                'venta.idventa', 'venta.codventa'
                            )
                            ->where($condicion)
                            ->whereNull('venta.deleted_at')
                            ->distinct('cobro.idcobro')
                            ->orderBy('cobro.idcobro', 'desc')
                            ->paginate(10);
            //$datos = Cobro::orderBy('idcobro','DESC')->paginate(10);
            $cobros = $datos->getCollection();
            
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
                'data' => $cobros,
                'pagination' => $pagination
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
                'message' => 'Ocurrio un problema al conectarse con la base de datos',
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

            $vendedor = null;
            if ($configsCliente->clienteesabogado) {
                $user = new Usuario();
                $user->setConnection($connection);

                $vendedor = $user->leftJoin('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                    ->leftJoin('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                    ->where('usuario.idusuario', $request->get('x_idusuario'))
                    ->where('g.esv', 'S')
                    ->select('v.*')
                    ->first();

            }

            $venta = DB::connection($connection)
                ->table('venta as v')
                ->join('ventaplandepago as vpp', 'v.idventa', '=', 'vpp.fkidventa')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->select('v.idventa', 'v.codventa', 'c.idcliente', 'c.codcliente', 'c.nombre',
                    'c.apellido', 'v.mtototventa', 'v.mtototcobrado',
                    DB::raw("COUNT(*) as cantpagos")
                )
                ->where('vpp.estado', '=', 'I')
                ->where('vpp.descripcion', '<>', 'Contado')
                ->where(
                    ($vendedor != null) ? [['v.fkidvendedor', '=', $vendedor->idvendedor]] : []
                )
                ->whereNull('v.deleted_at')
                ->whereNull('vpp.deleted_at')
                ->groupBy('v.idventa', 'v.codventa', 'c.idcliente', 'c.codcliente', 'c.nombre', 'c.apellido', 'v.mtototventa', 'v.mtototcobrado')
                ->orderBy('v.idventa', 'desc')
                ->get()->take(20);

            return response()->json([
                'response' => 1,
                'configscliente' => $configsCliente,
                'bandera' => $bandera,
                'venta' => $venta,
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
                'message' => 'No se proceso correctamente la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function searchByIdCod(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configsCliente = $conf->first();
            $configsCliente->decrypt();

            $vendedor = null;
            if ($configsCliente->clienteesabogado) {
                $user = new Usuario();
                $user->setConnection($connection);

                $vendedor = $user->leftJoin('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                    ->leftJoin('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                    ->where('usuario.idusuario', $request->get('x_idusuario'))
                    ->where('g.esv', 'S')
                    ->select('v.*')
                    ->first();

            }

            if ($value == '') {
                $venta = DB::connection($connection)
                    ->table('venta as v')
                    ->join('ventaplandepago as vpp', 'v.idventa', '=', 'vpp.fkidventa')
                    ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                    ->select('v.idventa', 'v.codventa', 'c.idcliente', 'c.codcliente', 'c.nombre',
                        'c.apellido', 'v.mtototventa', 'v.mtototcobrado',
                        DB::raw("COUNT(*) as cantpagos")
                    )
                    ->where('vpp.estado', '=', 'I')
                    ->where('vpp.descripcion', '<>', 'Contado')
                    ->where(
                        ($vendedor != null) ? [['v.fkidvendedor', '=', $vendedor->idvendedor]] : []
                    )
                    ->whereNull('v.deleted_at')
                    ->whereNull('vpp.deleted_at')
                    ->groupBy('v.idventa', 'v.codventa', 'c.idcliente', 'c.codcliente', 'c.nombre', 'c.apellido', 'v.mtototventa', 'v.mtototcobrado')
                    ->orderBy('v.idventa', 'desc')
                    ->get()->take(20);
            }else {
                $venta = DB::connection($connection)
                    ->table('venta as v')
                    ->join('ventaplandepago as vpp', 'v.idventa', '=', 'vpp.fkidventa')
                    ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                    ->select('v.idventa', 'v.codventa', 'c.idcliente', 'c.codcliente', 'c.nombre',
                        'c.apellido', 'v.mtototventa', 'v.mtototcobrado',
                        DB::raw("COUNT(*) as cantpagos")
                    )
                    ->where('vpp.estado', '=', 'I')
                    ->where('vpp.descripcion', '<>', 'Contado')
                    ->where(
                        ($vendedor != null) ? [['v.fkidvendedor', '=', $vendedor->idvendedor]] : []
                    )
                    ->where( function($query) use ($value) {
                        return $query->where('v.idventa', 'LIKE', "%".$value."%")
                                    ->orWhere('v.codventa', 'ILIKE', "%".$value."%");
                    })
                    ->whereNull('v.deleted_at')
                    ->whereNull('vpp.deleted_at')
                    ->groupBy('v.idventa', 'v.codventa', 'c.idcliente', 'c.codcliente', 'c.nombre', 'c.apellido', 'v.mtototventa', 'v.mtototcobrado')
                    ->orderBy('v.idventa', 'desc')
                    ->get()->take(20);
            }


            return response()->json([
                'response' => 1,
                'data' => $venta,
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
                'message' => 'No se proceso correctamente la solicitud',
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
        
        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            if ($request->filled('fecha')) {
                date_default_timezone_set('America/La_Paz');
                $date = explode(' ', $request->get('fecha'));
                $fecha = $date[0];
                $hora = $date[1];
                $cobro = new Cobro();
                $cobro->setConnection($connection);
                $cobro->codcobro = $request->get('codcobro');
                $cobro->fecha = $fecha;
                $cobro->hora = $hora;
                $cobro->notas = $request->get('notas');
                $cobro->idusuario = $request->get('x_idusuario');
                $cobro->fechahoratransac = date('Y-m-d H:i:s');
                $cobro->sehizoasientautom = 'N';
                //$cobro->segenerofactura =  'N';
                $cobro->save();
                
                $vent = new Venta();
                $vent->setConnection($connection);
                $venta = $vent->find($request->get('idventa'));

                $idsPlanPago = json_decode($request->get('idsplanpago'));
                $montos = json_decode($request->get('montos'));

                $montocobro = 0;
                $descripcioncobro = '';

                $idventaplanpago = [];
                
                if ($request->get('montoPagar') == '' || $request->get('montoPagar') == 0) {
                    $planp = new PlanDePago();
                    $planp->setConnection($connection);
                    for ($i = 0; $i < sizeof($idsPlanPago); $i++) {
                        $cobroDet = new CobroPlanPagoDet();
                        $cobroDet->setConnection($connection);
                        $cobroDet->fkidcobro = $cobro->idcobro;
                        $cobroDet->fkidventaplandepago = $idsPlanPago[$i];
                        $cobroDet->montocobrado = $montos[$i];
                        $cobroDet->save();

                        $montocobro = $montocobro + $cobroDet->montocobrado;
            
                        $planPago = $planp->find($idsPlanPago[$i]);
                        $planPago->estado = 'P';
                        $planPago->montopagado = $montos[$i] + $planPago->montopagado;
                        $planPago->setConnection($connection);
                        $planPago->update();

                        array_push($idventaplanpago, $idsPlanPago[$i]);

                        $descripcioncobro = $descripcioncobro . $planPago->descripcion . ' ';

                    }
                } else {
                    $total = (float)$venta->mtototventa;

                    $planp = new PlanDePago();
                    $planp->setConnection($connection);

                    $cuotas = $venta->getCuotas();
                    $montoPagar = (float)$request->get('montoPagar');
                    $i = 0;
                    while ($montoPagar > 0) {

                        $planPago = $planp->find($cuotas[$i]->idventaplandepago);
                        
                        $saldo = $planPago->montoapagar - $planPago->montopagado;
                        $saldo = round($saldo, 2);

                        $cobroDet = new CobroPlanPagoDet();
                        $cobroDet->setConnection($connection);
                        $cobroDet->fkidcobro = $cobro->idcobro;
                        $cobroDet->fkidventaplandepago = $planPago->idventaplandepago;

                        if ($montoPagar >= $saldo) {
                            
                            //$cobroDet->montocobrado = $planPago->montoapagar;
                            $cobroDet->montocobrado = $saldo;
                            $cobroDet->save();

                            $montocobro = $montocobro + $cobroDet->montocobrado;

                            $planPago->estado = 'P';
                            $planPago->montopagado = $planPago->montoapagar;
                            $planPago->setConnection($connection);
                            $planPago->update();

                            array_push($idventaplanpago, $cuotas[$i]->idventaplandepago);

                            $montoPagar = $montoPagar - $saldo;
                        } else {

                            $cobroDet->montocobrado = $montoPagar;
                            $cobroDet->save();

                            $planPago->estado = 'I';
                            $planPago->montopagado = $planPago->montopagado + $montoPagar;
                            $planPago->setConnection($connection);
                            $planPago->update();

                            $montoPagar = 0;
                        }

                        $i++;
                    }
                }

                $conf = new ConfigCliente();
                $conf->setConnection($connection);
                $config_cliente = $conf->first();
                $config_cliente->decrypt();

                $bandera = 0;
                $date = explode('-', $venta->fecha);
                $fecha = $date[0].$date[1].$date[2];

                $dosificacion = DB::connection($connection)
                    ->table('facdosificacion')
                    ->where('estado', '=', 'A')
                    ->where('fechalimiteemision', '>=', $venta->fecha)
                    ->whereNull('deleted_at')
                    ->orderBy('idfacdosificacion', 'asc')
                    ->first();

                if ($config_cliente->facturarsiempre == 'S' && $venta->fkidtipocontacredito == 1  && $config_cliente->ventaendospasos) {

                    $venta_cobro = DB::connection($connection)
                        ->table('cobro as c')
                        ->join('cobroplanpagodetalle as cppd', 'c.idcobro', '=', 'cppd.fkidcobro')
                        ->join('ventaplandepago as vpp', 'cppd.fkidventaplandepago', '=', 'vpp.idventaplandepago')
                        ->join('venta as v', 'vpp.fkidventa', '=', 'v.idventa')
                        ->join('cliente as cl', 'v.fkidcliente', '=', 'cl.idcliente')
                        ->select('c.idcobro', 'c.fecha',
                            DB::raw("CONCAT(cl.nombre, ' ',cl.apellido) as cliente"),
                            'cl.nit', 'v.idventa',
                            DB::raw('SUM(cppd.montocobrado) as pago')
                        )
                        ->where('c.idcobro', '=', $cobro->idcobro)
                        ->whereNull('v.deleted_at')
                        ->whereNull('c.deleted_at')
                        ->whereNull('cppd.deleted_at')
                        ->groupBy('c.idcobro', 'c.fecha', 'cliente', 'cl.nit', 'v.idventa')
                        ->first();

                    if ($dosificacion != null) {

                        $controlCode = new ControlCode();
    
                        $codigoControl = $controlCode->generate(
                            $dosificacion->numeroautorizacion,
                            $dosificacion->numfacturasiguiente,
                            ($venta_cobro->nit == null || $venta_cobro->nit == '') ? 0: $venta_cobro->nit,
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
                        $facturajson->nitcliente = ($venta_cobro->nit == null || $venta_cobro->nit == '') ? 0: $venta_cobro->nit;
                        $facturajson->connection = $connection;
    
                        $codigoqr = $controlCode->generarqr($facturajson);
    
                        $factura  = new Factura();
                        $factura->setConnection($connection);
                        $factura->numero = $dosificacion->numfacturasiguiente;
                        $factura->nombre = $venta_cobro->cliente;
                        $factura->nit = ($venta_cobro->nit == null || $venta_cobro->nit == '') ? 0: $venta_cobro->nit;
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
                        $libroventa->debitofiscal = ($libroventa->importebasecreditofiscal*$factura->mtototalventa*13)/100;
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
                
                $venta->mtototcobrado = $venta->mtototcobrado + $request->get('mtotocobrado');
                $venta->estadoproceso = 'C';
                $venta->setConnection($connection);
                $venta->update();

                if ($config_cliente->asientoautomdecomprob == 'N') {

                    if ($config_cliente->asientoautomaticosiempre == 'S') {

                        $function = new Functions();
                        $activo = $function->cobroCuotaVtaCred($venta->idventa, $cobro->idcobro, $descripcioncobro, 
                                $cobro->fecha, $montocobro, $request->x_idusuario, $connection);

                        if ($activo > 0) {
                            foreach ($idventaplanpago as $key => $value) {

                                $obj = new PlanDePago();
                                $obj->setConnection($connection);
        
                                $planPago = $obj->find($value);
        
                                $planPago->sehizoasientautom = 'S';
                                $planPago->setConnection($connection);
                                $planPago->update();
                            }
                            $cobro->sehizoasientautom = 'S';
                            $cobro->setConnection($connection);
                            $cobro->update();
                        }
                    }
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto el cobro ' . $cobro->idcobro;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se guardo correctamente',
                    'idcobro' => $cobro->idcobro,
                    'fkidtipocontacredito' => $venta->fkidtipocontacredito,
                    'bandera' => $bandera,
                ]);

            } else {
                DB::rollBack();
                return response()->json([
                    'response' => -1,
                    'message' => 'No se puede procesar la solicitud'
                ]);
            }

           
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
    public function show(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cob = new Cobro();
            $cob->setConnection($connection);
            $cobro = $cob->find($id);

            if ($cobro == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'No existe el cobro'
                ]);
            }
            $cuotas = $cobro->getCuotas();
            
            $vent = new Venta();
            $vent->setConnection($connection);
            $venta = $vent->find($cuotas->first()->fkidventa);
            $venta->cliente;

            $facturafirst = DB::connection($connection)
                ->table('factura')
                ->where('fkidventa', '=', $venta->idventa)
                ->whereNull('deleted_at')
                ->orderBy('idfactura', 'desc')
                ->first();

            return response()->json([
                'response' => 1,
                'cobro' => $cobro,
                'cuotas' => $cuotas,
                'venta' => $venta,
                'factura' => $facturafirst,
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
                'message' => 'No se proceso correctamente la solicitud',
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
    public function edit()
    {
        return view('commerce::edit');
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

            $cob = new Cobro();
            $cob->setConnection($connection);
            $cobro = $cob->find($id);
            if ($cobro == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El cobro ha eliminar no existe'
                ]);
            }
            //$cobro->setConnection($connection);
            $cobrodet = $cobro->cobroplanpagodets;
            /*return response()->json([
                'response' => -1,
                'data' => $cobrodet
            ]);
            */
            $totalDescontar = 0;
            $idventa = 0;
            $planp = new PlanDePago();
            $planp->setConnection($connection);
            foreach ($cobrodet as $row) {
                $planpago = $planp->find($row->fkidventaplandepago);
                $idventa = $planpago->fkidventa;
                $totalDescontar = $totalDescontar + $planpago->montoapagar;
                $planpago->montopagado = 0;
                $planpago->estado = 'I';
                $planpago->setConnection($connection);
                $planpago->update();
                $row->setConnection($connection);
                $row->delete();
            }

            $vent = new Venta();
            $vent->setConnection($connection);
            $venta = $vent->find($idventa);
            $venta->mtototcobrado = $venta->mtototcobrado - $totalDescontar;
            $vent->setConnection($connection);
            $venta->update();
            
            $cobro->setConnection($connection);
            $cobro->delete();
         
            $datos = $cob->leftJoin('cobroplanpagodetalle','cobroplanpagodetalle.fkidcobro','=','cobro.idcobro')
                            ->leftJoin('ventaplandepago','ventaplandepago.idventaplandepago','=','cobroplanpagodetalle.fkidventaplandepago')
                            ->leftJoin('venta','venta.idventa','=','ventaplandepago.fkidventa')
                            ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                            ->select(
                                'cobro.*',
                                'cliente.nombre as nombreCliente',
                                'cliente.apellido as apellidoCliente',
                                'venta.idventa', 'venta.codventa'
                            )
                            //->where($condicion)
                            ->distinct('cobro.idcobro')
                            ->orderBy('cobro.idcobro', 'ASC')
                            ->paginate(10);
            //$datos = Cobro::orderBy('idcobro','DESC')->paginate(10);
            $cobros = $datos->getCollection();
            
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
            $accion = 'Elimino el cobro ' . $id;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'Se Elimino correctamente',
                'data' => $cobros,
                'pagination' => $pagination
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

    public function validarCodigo(Request $request, $value) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cob = new Cobro();
            $cob->setConnection($connection);
            $count = $cob->where('codcobro', $value)->count();
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

    public function show_data_factura(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idcobro = $request->idcobro;

            $cobro = DB::connection($connection)
                ->table('cobro as c')
                ->join('cobroplanpagodetalle as cppd', 'c.idcobro', '=', 'cppd.fkidcobro')
                ->join('ventaplandepago as vpp', 'cppd.fkidventaplandepago', '=', 'vpp.idventaplandepago')
                ->join('venta as v', 'vpp.fkidventa', '=', 'v.idventa')
                ->join('cliente as cl', 'v.fkidcliente', '=', 'cl.idcliente')
                ->select('c.idcobro', 'c.fecha',
                    DB::raw("CONCAT(cl.nombre, ' ',cl.apellido) as cliente"),
                    'cl.nit', 'v.idventa',
                    DB::raw('SUM(cppd.montocobrado) as pago')
                )
                ->where('c.idcobro', '=', $idcobro)
                ->whereNull('v.deleted_at')
                ->whereNull('c.deleted_at')
                ->whereNull('cppd.deleted_at')
                ->groupBy('c.idcobro', 'c.fecha', 'cliente', 'cl.nit', 'v.idventa')
                ->first();

            $facturafirst = DB::connection($connection)
                ->table('factura')
                ->where('fkidventa', '=', $cobro->idventa)
                ->whereNull('deleted_at')
                ->orderBy('idfactura', 'desc')
                ->first();

            if ($facturafirst != null) {
                $fact = new Factura();
                $fact->setConnection($connection);
                $factu = $fact->find($facturafirst->idfactura);
                $factu->contadordelimpresion = $factu->contadordelimpresion + 1;
                $factu->setConnection($connection);
                $factu->update();
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
                ->where('v.idventa', '=', $cobro->idventa)
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
                ->where('v.fkidventa', '=', $cobro->idventa)
                ->whereNull('v.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('u.deleted_at')
                ->get();

            $planpago = DB::connection($connection)
                ->table('venta as v')
                ->join('ventaplandepago as vp', 'v.idventa', '=', 'vp.fkidventa')
                ->select('vp.descripcion', 'vp.fechaapagar', 'vp.montoapagar')
                ->where('v.idventa', '=', $cobro->idventa)
                ->where('vp.descripcion', '<>', 'Anticipo')
                ->whereNull('v.deleted_at')
                ->whereNull('vp.deleted_at')
                ->orderBy('vp.descripcion', 'asc')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            return response()->json([
                'response' => 1,
                'idventa' => $cobro->idventa,
                'configcliente' => $config_cliente,
                'venta' => $venta_first,
                'venta_detalle' => $venta_detalle,
                'planpago' => $planpago,
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
                'message' => 'No se proceso correctamente la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function factura(Request $request) {

        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idcobro = $request->idcobro;
            $facturarsiempre = $request->facturarsiempre;
            $generarfactura = $request->generarfactura;
            $ventaendospasos = $request->ventaendospasos;

            $cobro = DB::connection($connection)
                ->table('cobro as c')
                ->join('cobroplanpagodetalle as cppd', 'c.idcobro', '=', 'cppd.fkidcobro')
                ->join('ventaplandepago as vpp', 'cppd.fkidventaplandepago', '=', 'vpp.idventaplandepago')
                ->join('venta as v', 'vpp.fkidventa', '=', 'v.idventa')
                ->join('cliente as cl', 'v.fkidcliente', '=', 'cl.idcliente')
                ->select('c.idcobro', 'v.fecha',
                    DB::raw("CONCAT(cl.nombre, ' ',cl.apellido) as cliente"),
                    'cl.nit', 'v.idventa',
                    DB::raw('SUM(cppd.montocobrado) as pago')
                )
                ->where('c.idcobro', '=', $idcobro)
                ->whereNull('v.deleted_at')
                ->whereNull('c.deleted_at')
                ->whereNull('cppd.deleted_at')
                ->groupBy('c.idcobro', 'c.fecha', 'cliente', 'cl.nit', 'v.idventa')
                ->first();

            $dosificacion = DB::connection($connection)
                ->table('facdosificacion')
                ->where('estado', '=', 'A')
                ->where('fechalimiteemision', '>=', $cobro->fecha)
                ->whereNull('deleted_at')
                ->orderBy('idfacdosificacion', 'asc')
                ->first();

            $bandera = 0;
            $codigoControl = null;

            $config_cliente = null;
            $venta_first = null;
            $venta_detalle = [];
            $planpago = [];
            $factura = null;

            if ($facturarsiempre != 'N' && $ventaendospasos == 'A' && $generarfactura == 'A' && $dosificacion != null) {

                $facturafirst = DB::connection($connection)
                    ->table('factura')
                    ->where('fkidventa', '=', $cobro->idventa)
                    ->whereNull('deleted_at')
                    ->orderBy('idfactura', 'desc')
                    ->first();

                $date = explode('-', $cobro->fecha);
                $fecha = $date[0].$date[1].$date[2];

                if ($facturafirst == null) {
                
                    $controlCode = new ControlCode();

                    $codigoControl = $controlCode->generate(
                        $dosificacion->numeroautorizacion,
                        $dosificacion->numfacturasiguiente,
                        ($cobro->nit == '' || $cobro->nit == null) ? 0: $cobro->nit,
                        $fecha,
                        $cobro->pago,
                        $dosificacion->llave,
                        $connection
                    );

                    $facturajson = new \stdClass();
                    $facturajson->nitemisor = $dosificacion->nit;
                    $facturajson->nrofactura = $dosificacion->numfacturasiguiente;
                    $facturajson->nroautorizacion = $dosificacion->numeroautorizacion;
                    $facturajson->fecha = $date[2].'/'.$date[1].'/'.$date[0];
                    $facturajson->total = $cobro->pago;
                    $facturajson->codigocontrol = $codigoControl;
                    $facturajson->nitcliente = ($cobro->nit == '' || $cobro->nit == null) ? 0: $cobro->nit;
                    $facturajson->connection = $connection;

                    $codigoqr = $controlCode->generarqr($facturajson);

                    $factura  = new Factura();
                    $factura->setConnection($connection);
                    $factura->numero = $dosificacion->numfacturasiguiente;
                    $factura->nombre = $cobro->cliente;
                    $factura->nit = ($cobro->nit == '' || $cobro->nit == null) ? 0: $cobro->nit;
                    $factura->fecha = $cobro->fecha;
                    $factura->estado = 'V';
                    $factura->notas = '';
                    $factura->idusuario = $request->x_idusuario;
                    $factura->fechahoratransac = $request->x_fecha . ' ' . $request->x_hora;
                    $factura->codigoqr = $codigoqr;
                    $factura->codigodecontrol = $codigoControl;
                    $factura->mtototalventa = $cobro->pago*1;
                    $factura->mtodescuento = 0;
                    $factura->mtoincremento = 0;
                    $factura->mtototnetoventa = $cobro->pago - $factura->mtodescuento + $factura->mtoincremento;
                    $factura->contadordelimpresion = 1;
                    $factura->fkidventa = $cobro->idventa;
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
                    $libroventa->debitofiscal = ($libroventa->importebasecreditofiscal*$factura->mtototalventa*13)/100;
                    $libroventa->codigocontrol = $factura->codigodecontrol;
                    $libroventa->fkidfactura = $factura->idfactura;
                    $libroventa->fkidfactipolibroventa = 1;
                    $libroventa->setConnection($connection);
                    $libroventa->save();

                    $vent = new Venta();
                    $vent->setConnection($connection);
                    $venta =  $vent->find($cobro->idventa);
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
                    ->where('v.idventa', '=', $cobro->idventa)
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
                    ->where('v.fkidventa', '=', $cobro->idventa)
                    ->whereNull('v.deleted_at')
                    ->whereNull('a.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('u.deleted_at')
                    ->get();

                $planpago = DB::connection($connection)
                    ->table('venta as v')
                    ->join('ventaplandepago as vp', 'v.idventa', '=', 'vp.fkidventa')
                    ->select('vp.descripcion', 'vp.fechaapagar', 'vp.montoapagar')
                    ->where('v.idventa', '=', $cobro->idventa)
                    ->where('vp.descripcion', '<>', 'Anticipo')
                    ->whereNull('v.deleted_at')
                    ->whereNull('vp.deleted_at')
                    ->orderBy('vp.descripcion', 'asc')
                    ->get();

                $conf = new ConfigCliente();
                $conf->setConnection($connection);
                $config_cliente = $conf->first();
                $config_cliente->decrypt();

            }else {
                $bandera = 1;
            }

            DB::commit();

            return response()->json([
                'response' => 1,
                'idventa' => $cobro->idventa,
                'configcliente' => $config_cliente,
                'venta' => $venta_first,
                'venta_detalle' => $venta_detalle,
                'planpago' => $planpago,
                'cobro' => $cobro,
                'dosificacion' => $dosificacion,
                'bandera' => $bandera,
                'factura' => $factura,
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
                'message' => 'No se proceso correctamente la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

}
