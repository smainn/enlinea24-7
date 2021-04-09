<?php

namespace App\Http\Controllers\Contable;

use App\Functions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\Comprobante;
use App\Models\Contable\TipoPago;
use App\Models\Contable\Banco;
use App\Models\Contable\ComprobanteTipo;
use App\Models\Contable\PeriodoContable;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Comercio\Compras\Compra;
use App\Models\Comercio\Compras\CompraPlanPagar;
use App\Models\Comercio\Ventas\PlanDePago;
use App\Models\Comercio\Ventas\Venta;
use App\Models\Contable\GestionContable;
use App\Models\Contable\CuentaPlan;
use App\Models\Contable\CentroDeCosto;
use App\Models\Contable\ComprobanteCuentaDetalle;
use App\Models\Contable\CuentaConfig;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use App\Models\Config\ConfigCliente;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Encryption\DecryptException;
use PDF;

class ComprobanteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $comp = new Comprobante();
            $comp->setConnection($connection);

            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $search = $request->filled('busqueda') ? $request->get('busqueda') : null;

            $datos = null;

            if ($search != null) {
                $datos = $comp->leftJoin('comprobantetipo as ct', 'ct.idcomprobantetipo', 'comprobante.fkidcomprobantetipo')
                    ->select('comprobante.fecha', 'comprobante.referidoa', 'comprobante.glosa',
                            'comprobante.idcomprobante', 'comprobante.codcomprobante', 'comprobante.estado',
                            'ct.descripcion as comprobantetipo', 'comprobante.contabilizar')
                    ->where(function ($query) use ($search) {
                        return $query
                            ->orWhere('comprobante.fecha', 'ILIKE', "%$search%")
                            ->orWhere('comprobante.referidoa', 'ILIKE', "%$search%")
                            ->orWhere('comprobante.glosa', 'ILIKE', "%$search%")
                            ->orWhere('comprobante.codcomprobante', 'ILIKE', "%$search%")
                            ->orWhere('ct.descripcion', 'ILIKE', "%$search%");
                    })
                    ->orderBy('comprobante.idcomprobante', 'DESC')
                    ->paginate($paginate);
            } else {
                $datos = $comp->leftJoin('comprobantetipo as ct', 'ct.idcomprobantetipo', 'comprobante.fkidcomprobantetipo')
                    ->select('comprobante.fecha', 'comprobante.referidoa', 'comprobante.glosa', 
                            'comprobante.idcomprobante', 'comprobante.codcomprobante', 'comprobante.estado',
                            'ct.descripcion as comprobantetipo', 'comprobante.contabilizar')
                    ->orderBy('comprobante.idcomprobante', 'DESC')
                    ->paginate($paginate);
            }

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configcliente = $obj->first();
            $configcliente->decrypt();
            
            $comprobantes = $datos->getCollection();
            
            $pagination = array(
                'total'         => $datos->total(),
                'current_page'  => $datos->currentPage(),
                'per_page'      => $datos->perPage(),
                'last_page'     => $datos->lastPage(),
                'first'         => $datos->firstItem(),
                'last'          => $datos->lastItem(),
                'url_next'      => $datos->nextPageUrl()
            );

            return response()->json([
                'response'      => 1,
                'pagination'    => $pagination,
                'data'          => $comprobantes,
                'configcliente' => $configcliente,
            ]);
            
            
        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los comprobantes',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $tiposcomprobantes = $obj->orderBy('idcomprobantetipo', 'ASC')->get();


            $obj = new PeriodoContable();
            $obj->setConnection($connection);
            $periodos = $obj->leftJoin('gestioncontable as g', 'periodocontable.fkidgestioncontable', '=', 'g.idgestioncontable')
                ->select('periodocontable.idperiodocontable', 'periodocontable.descripcion', 'periodocontable.fechaini', 'periodocontable.fechafin')
                ->where('g.estado', 'A')
                ->where('periodocontable.estado', 'A')
                ->get();

            
            $obj = new Moneda();
            $obj->setConnection($connection);
            $monedas = $obj->leftJoin('tipocambio as tc', 'tc.fkidmonedauno', 'moneda.idmoneda')
                ->select('moneda.*', 'tc.valor')
                ->where('tc.estado', '=', 'A')
                ->orderBy('moneda.idmoneda', 'ASC')
                ->get();

            
            $obj = new TipoPago();
            $obj->setConnection($connection);
            $tipospagos = $obj->orderBy('idtipopago', 'ASC')->get();

            $obj = new Banco();
            $obj->setConnection($connection);
            $bancos = $obj->where('estado', '=', 'A')->orderBy('idbanco', 'ASC')->get();

            
            $obj = new Banco();
            $obj->setConnection($connection);
            $bancopadre = $obj->where('estado', '=', 'A')->whereNull('fkidbancopadre')->orderBy('idbanco', 'ASC')->get();

            $obj = new CentroDeCosto();
            $obj->setConnection($connection);
            $centrocosto = $obj->where('estado', '=', 'A')->orderBy('idcentrodecosto', 'asc')->get();

            $obj = new CentroDeCosto();
            $obj->setConnection($connection);
            $centrocostopadre = $obj->where('estado', '=', 'A')->whereNull('fkidcentrodecostopadre')->orderBy('idcentrodecosto', 'asc')->get();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuenta = $obj->where('estado', '=', 'A')->orderBy('idcuentaplan', 'asc')->get();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuentapadre = $obj->where('estado', '=', 'A')->whereNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')->get();


            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $cuentaconfig = $obj->first();
            $cuentaconfig->decrypt();

            return response()->json([
                'response'          => 1,
                'tiposcomprobantes' => $tiposcomprobantes,
                'periodos'          => $periodos,
                'monedas'           => $monedas,
                'tipospagos'        => $tipospagos,
                'bancos'            => $bancos,
                // 'bancos2'           => $bancos2,
                'bancopadre'        => $bancopadre,

                'centrocosto'       => $centrocosto,
                'centrocostopadre'  => $centrocostopadre,

                'cuenta'            => $cuenta,
                'cuentapadre'       => $cuentapadre,
                
                'cuentaconfig'      => $cuentaconfig
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los datos necesarios',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new PeriodoContable();
            $obj->setConnection($connection);
            $periodo = $obj->where('fechaini', '<=', $request->fecha)->where('fechafin', '>=', $request->fecha)
                ->where('estado', 'A')->first();            

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $comptipo = $obj->find($request->idtipo);
            $numero = $comptipo->numeroactual + 1;

            $obj = new Comprobante();
            $obj->setConnection($connection);
            $comp = $obj->where('codcomprobante', $numero)
                ->where('fkidcomprobantetipo', '=', $request->idtipo)->get();

            if (sizeof($comp) > 0) {
                DB::rollBack();
                return response()->json([
                    'response' => 2,
                    'message'   => 'El codigo o numero ya esta siendo usado por un comprobante'
                ]);
            }

            $comptipo->numeroactual = $numero;
            $comptipo->update();

            $compr = new Comprobante();
            $compr->codcomprobante = $numero;
            $compr->referidoa = $request->referidoa;
            $compr->fecha = $request->fecha;
            $compr->nrodoc = $request->nrodoc;
            //$compr->tipo = 'NADA';
            $compr->nrochequetarjeta = $request->nrocheque;
            $compr->glosa = $request->glosa;
            $compr->tipocambio = $request->tipocambio;
            $compr->idusuario = $request->get('x_idusuario');
            $compr->estado = 'A';
            $compr->contabilizar = $request->contabilizar ? 'S' : 'N';
            $compr->fkidperiodocontable = $periodo->idperiodocontable;       
            $compr->fkidcomprobantetipo = $request->idtipo;
            $compr->fkidbanco = $request->idbanco;
            $compr->fkidtipopago = $request->idtipopago;
            $compr->fkidmoneda = $request->idmoneda;
            $compr->esautomatico = 'N';
            $compr->setConnection($connection);
            $compr->save();

            $idscuentas = json_decode($request->idscuentas);
            $glosas = json_decode($request->glosas);
            $debes = json_decode($request->debes);
            $haberes = json_decode($request->haberes);
            $idscentrocostos = json_decode($request->idscentrocostos);
            $size = sizeof($idscuentas);
            for ($i = 0; $i < $size; $i++) {
                if ($idscuentas[$i]!= null) {
                    $comcd = new ComprobanteCuentaDetalle();
                    $comcd->glosamenor = $glosas[$i];
                    $comcd->debe = $debes[$i] == null ? 0 : $debes[$i];
                    $comcd->haber = $haberes[$i] == null ? 0 : $haberes[$i];
                    $comcd->fkidcomprobante = $compr->idcomprobante;
                    $comcd->fkidcentrodecosto = $idscentrocostos[$i] == -1 ? null : $idscentrocostos[$i];
                    $comcd->fkidcuentaplan = $idscuentas[$i];
                    $comcd->setConnection($connection);
                    $comcd->save();
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Registro el comprobante ' . $compr->idcomprobante;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response'      => 1,
                'message'       => 'Se guardo corectamente el comprobante',
                'idcomprobante' => $compr->idcomprobante
            ]);

        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $obj = new Comprobante();
            $obj->setConnection($connection);
            $datos = $obj->leftJoin('comprobantecuentadetalle as ccd', 'ccd.fkidcomprobante', 'comprobante.idcomprobante')
                ->leftJoin('cuentaplan as cp', 'cp.idcuentaplan', 'ccd.fkidcuentaplan')
                ->leftJoin('centrodecosto as cc', 'cc.idcentrodecosto', 'ccd.fkidcentrodecosto')
                ->leftJoin('banco as b', 'b.idbanco', 'comprobante.fkidbanco')
                ->leftJoin('tipopago as tp', 'tp.idtipopago', 'comprobante.fkidtipopago')
                ->leftJoin('comprobantetipo as ct', 'ct.idcomprobantetipo', 'comprobante.fkidcomprobantetipo')
                ->leftJoin('periodocontable as pc', 'pc.idperiodocontable', 'comprobante.fkidperiodocontable')
                ->leftJoin('moneda as m', 'm.idmoneda', 'comprobante.fkidmoneda')
                ->select('comprobante.*', 'ccd.*', 'cp.idcuentaplan', 'cp.codcuenta', 'tp.descripcion as tipopago',
                        'cp.nombre', 'cp.codcuenta', 'cp.nombre', 'cc.nombre as centrocosto', 'm.descripcion as moneda',
                        'b.nombre as banco', 'ct.descripcion as comprobantetipo', 'cp.nombre as cuenta',
                        'pc.descripcion as periodocontable', 'cc.nombre as centrocosto')
                ->where('comprobante.idcomprobante', $id)
                ->whereNull('ccd.deleted_at')
                ->whereNull('cp.deleted_at')
                ->whereNull('cc.deleted_at')
                ->whereNull('b.deleted_at')
                ->whereNull('tp.deleted_at')
                ->whereNull('ct.deleted_at')
                ->whereNull('pc.deleted_at')
                ->whereNull('m.deleted_at')
                ->where('comprobante.estado', 'A')
                ->orderBy('ccd.idcomprobantecuentadetalle')
                ->distinct('ccd.idcomprobantecuentadetalle')
                ->get();
            
            $comprobante = new Comprobante();
            $detalle = [];
            $totaldebe = 0;
            $totalhaber = 0;
            foreach ($datos as $key => $row) {
                if ($key == 0) {
                    $comprobante->idcomprobante = $row->idcomprobante;
                    $comprobante->codcomprobante = $row->codcomprobante;
                    $comprobante->referidoa = $row->referidoa;
                    $comprobante->contabilizar = $row->contabilizar;
                    $comprobante->fecha = $row->fecha;
                    $comprobante->nrodoc = $row->nrodoc;
                    $comprobante->glosa = $row->glosa;
                    $comprobante->tipocambio = $row->tipocambio;
                    $comprobante->estado = $row->estado;
                    $comprobante->periodo = $row->periodocontable;
                    $comprobante->tipo = $row->comprobantetipo;
                    $comprobante->banco = $row->banco;
                    $comprobante->tipopago = $row->tipopago;
                    $comprobante->idtipopago = $row->fkidtipopago;
                    $comprobante->nrochequetarjeta = $row->nrochequetarjeta;
                    $comprobante->moneda = $row->moneda;
                    $comprobante->nrochequetarjeta = $comprobante->nrochequetarjeta;
                }
                array_push($detalle, [
                    'codigo'        => $row->codcuenta,
                    'cuenta'        => $row->cuenta,
                    'glosa'         => $row->glosamenor,
                    'debe'          => $row->debe,
                    'haber'         => $row->haber,
                    'centrocosto'   => $row->centrocosto
                ]);
                $totaldebe += $row->debe;
                $totalhaber += $row->haber;
            }
            $comprobante->totaldebe = $totaldebe;
            $comprobante->totalhaber = $totalhaber;
            return response()->json([
                'response'      => 1,
                'comprobante'   => $comprobante,
                'detalle'       => $detalle
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id, Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Comprobante();
            $obj->setConnection($connection);
            $comprobante = $obj->select('idcomprobante', 'codcomprobante', 'referidoa', 'fecha', 'nrodoc', 'nrochequetarjeta',
                    'glosa', 'tipocambio', 'estado', 'fkidperiodocontable', 'fkidcomprobantetipo', 'fkidbanco',
                    'fkidtipopago', 'fkidmoneda', 'contabilizar', 
                    DB::raw('(SELECT b.nombre FROM banco as b WHERE b.idbanco = comprobante.fkidbanco)  AS namebanco')
                )
                ->where('idcomprobante', $id)
                ->where('estado', 'A')
                ->first();

            $obj = new Comprobante();
            $obj->setConnection($connection);
            $comprobantedetalle = $obj->leftJoin('comprobantecuentadetalle as ccd', 'ccd.fkidcomprobante', 'comprobante.idcomprobante')
                        ->leftJoin('cuentaplan as cp', 'cp.idcuentaplan', 'ccd.fkidcuentaplan')
                        ->leftJoin('centrodecosto as cc', 'cc.idcentrodecosto', 'ccd.fkidcentrodecosto')
                        ->select('ccd.*', 
                            'cp.idcuentaplan', DB::raw("CONCAT(cp.codcuenta, ' ', cp.nombre) as cuenta"),
                            'cc.idcentrodecosto', 'cc.nombre as centrodecosto')
                        ->where('comprobante.idcomprobante', $id)
                        ->where('comprobante.estado', 'A')
                        ->whereNull('ccd.deleted_at')
                        ->orderBy('ccd.idcomprobantecuentadetalle')
                        ->get();

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $tiposcomprobantes = $obj->orderBy('idcomprobantetipo', 'ASC')->get();


            $obj = new PeriodoContable();
            $obj->setConnection($connection);
            $periodos = $obj->leftJoin('gestioncontable as g', 'periodocontable.fkidgestioncontable', '=', 'g.idgestioncontable')
                ->select('periodocontable.idperiodocontable', 'periodocontable.descripcion', 'periodocontable.fechaini', 'periodocontable.fechafin')
                ->where('g.estado', 'A')
                ->where('periodocontable.estado', 'A')
                ->get();

            
            $obj = new Moneda();
            $obj->setConnection($connection);
            $monedas = $obj->leftJoin('tipocambio as tc', 'tc.fkidmonedauno', 'moneda.idmoneda')
                ->select('moneda.*', 'tc.valor')
                ->where('tc.estado', '=', 'A')
                ->orderBy('moneda.idmoneda', 'ASC')
                ->get();

            
            $obj = new TipoPago();
            $obj->setConnection($connection);
            $tipospagos = $obj->orderBy('idtipopago', 'ASC')->get();

            $obj = new Banco();
            $obj->setConnection($connection);
            $bancos = $obj->where('estado', '=', 'A')->orderBy('idbanco', 'ASC')->get();

            
            $obj = new Banco();
            $obj->setConnection($connection);
            $bancopadre = $obj->where('estado', '=', 'A')->whereNull('fkidbancopadre')->orderBy('idbanco', 'ASC')->get();

            $obj = new CentroDeCosto();
            $obj->setConnection($connection);
            $centrocosto = $obj->where('estado', '=', 'A')->orderBy('idcentrodecosto', 'asc')->get();

            $obj = new CentroDeCosto();
            $obj->setConnection($connection);
            $centrocostopadre = $obj->where('estado', '=', 'A')->whereNull('fkidcentrodecostopadre')->orderBy('idcentrodecosto', 'asc')->get();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuenta = $obj->where('estado', '=', 'A')->orderBy('idcuentaplan', 'asc')->get();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuentapadre = $obj->where('estado', '=', 'A')->whereNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')->get();


            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $cuentaconfig = $obj->first();
            $cuentaconfig->decrypt();

            return response()->json([
                'response'          => 1,

                'comprobante' => $comprobante,
                'comprobantedetalle' => $comprobantedetalle,

                'tiposcomprobantes' => $tiposcomprobantes,
                'periodos'          => $periodos,
                'monedas'           => $monedas,
                'tipospagos'        => $tipospagos,
                'bancos'            => $bancos,
                // 'bancos2'           => $bancos2,
                'bancopadre'        => $bancopadre,

                'centrocosto'       => $centrocosto,
                'centrocostopadre'  => $centrocostopadre,

                'cuenta'            => $cuenta,
                'cuentapadre'       => $cuentapadre,
                
                'cuentaconfig'      => $cuentaconfig
            ]);

            // $obj = new Comprobante();
            // $obj->setConnection($connection);
            // $datos = $obj->leftJoin('comprobantecuentadetalle as ccd', 'ccd.fkidcomprobante', 'comprobante.idcomprobante')
            //             ->leftJoin('cuentaplan as cp', 'cp.idcuentaplan', 'ccd.fkidcuentaplan')
            //             ->leftJoin('centrodecosto as cc', 'cc.idcentrodecosto', 'ccd.fkidcentrodecosto')
            //             ->select('comprobante.*', 'ccd.*', 'cp.idcuentaplan',
            //                     'cp.nombre', 'cp.codcuenta', 'cp.nombre', 'cc.nombre as centrocosto')
            //             ->where('comprobante.idcomprobante', $id)
            //             ->whereNull('ccd.deleted_at')
            //             ->whereNull('cp.deleted_at')
            //             ->whereNull('cc.deleted_at')
            //             ->where('comprobante.estado', 'A')
            //             ->orderBy('ccd.idcomprobantecuentadetalle')
            //             ->distinct('ccd.idcomprobantecuentadetalle')
            //             ->get();

            // if ($datos->count() == 0) {
            //     return response()->json([
            //         'response'  => 0,
            //         'message'   => 'El comprobante no existe'
            //     ]);
            // }
            // $comprobante = new Comprobante();
            // $idscuentas = [];
            // //$codscuentas = [];
            // $nomcuentas = [];
            // $glosas = [];
            // $debes = [];
            // $haberes = [];
            // $idscentrocostos = [];
            // $nomscentrocostos = [];
            // foreach ($datos as $key => $row) {
            //     if ($key == 0) {
            //         $comprobante->idcomprobante = $row->idcomprobante;
            //         $comprobante->codcomprobante = $row->codcomprobante;
            //         $comprobante->fecha = $row->fecha;
            //         $comprobante->nrodoc = $row->nrodoc;
            //         $comprobante->nrochequetarjeta = $row->nrochequetarjeta;
            //         $comprobante->referidoa = $row->referidoa;
            //         $comprobante->glosa = $row->glosa;
            //         $comprobante->tipocambio = $row->tipocambio;
            //         $comprobante->contabilizar = $row->contabilizar;
            //         $comprobante->fkidcomprobantetipo = $row->fkidcomprobantetipo;
            //         $comprobante->fkidbanco = $row->fkidbanco;
            //         $comprobante->fkidtipopago = $row->fkidtipopago;
            //         $comprobante->fkidmoneda = $row->fkidmoneda;
            //     }

            //     array_push($idscuentas, [
            //         'id' => $row->fkidcuentaplan,
            //         'iddet' => $row->idcomprobantecuentadetalle
            //     ]);
            //     //array_push($codscuentas, $row->codcuenta);
            //     array_push($nomcuentas, $row->codcuenta . ' ' . $row->nombre);
            //     array_push($glosas, $row->glosamenor);
            //     array_push($debes, $row->debe);
            //     array_push($haberes, $row->haber);
            //     array_push($idscentrocostos, $row->fkidcentrodecosto);
            //     array_push($nomscentrocostos, $row->centrocosto);
            // }

            // $obj = new TipoPago();
            // $obj->setConnection($connection);
            // $tipospagos = $obj->orderBy('idtipopago', 'ASC')->get();

            // $obj = new Banco();
            // $obj->setConnection($connection);
            // $bancos = $obj->where('estado', 'A')
            //                 ->orderBy('idbanco', 'ASC')
            //                 ->get();
            // $bancos2 = [];
            // $nombanco = null;
            // foreach($bancos as $row) {
            //     if ($row->fkidbancopadre == null) {
            //         array_push($bancos2, [
            //             'title' => $row->nombre,
            //             'value' => $row->nombre,
            //             'key'   => $row->idbanco
            //         ]);
            //     }
            //     if ($row->idbanco == $comprobante->fkidbanco) {
            //         $nombanco = $row->nombre;
            //     }
            // }

            // $obj = new ComprobanteTipo();
            // $obj->setConnection($connection);
            // $tiposcomprobantes = $obj->orderBy('idcomprobantetipo', 'ASC')->get();

            // $obj = new PeriodoContable();
            // $obj->setConnection($connection);
            // $periodos = $obj->where('estado', 'A')
            //                 ->get();

            // $obj = new Moneda();
            // $obj->setConnection($connection);
            // $monedas = $obj->leftJoin('tipocambio as tc', 'tc.fkidmonedauno', 'moneda.idmoneda')
            //     ->select('moneda.*', 'tc.valor')
            //     ->where('tc.estado', '=', 'A')
            //     ->orderBy('moneda.idmoneda', 'ASC')
            //     ->get();

            // $obj = new CuentaPlan();
            // $obj->setConnection($connection);
            // $cuentas = $obj->where('estado', 'A')->orderBy('idcuentaplan', 'asc')->get();

            // //$cuentascod = [];
            // $cuentasnom = [];
            // foreach ($cuentas as $row) {
            //     if ($row->fkidcuentaplanpadre == null) {
            //         array_push($cuentasnom, [
            //             'title' => $row->codcuenta . ' ' . $row->nombre,
            //             'value' => $row->codcuenta . ' ' . $row->nombre,
            //             'key'   => $row->idcuentaplan,
            //         ]);
            //     }
            // }

            // $obj = new CentroDeCosto();
            // $obj->setConnection($connection);
            // $centrocostos = $obj->where('estado', 'A')->orderBy('idcentrodecosto', 'asc')->get();
            // $centrocostos2 = [];
            // foreach($centrocostos as $row) {
            //     if ($row->fkidcentrodecostopadre == null) {
            //         array_push($centrocostos2, [
            //             'title' => $row->nombre,
            //             'value' => $row->nombre,
            //             'key'   => $row->idcentrodecosto
            //         ]);
            //     }
            // }

            // $obj = new CuentaConfig();
            // $obj->setConnection($connection);
            // $cuentaconfig = $obj->first();
            // $cuentaconfig->decrypt();

            // return response()->json([
            //     'response'          => 1,
            //     'tipospagos'        => $tipospagos,
            //     'bancos'            => $bancos,
            //     'bancos2'           => $bancos2,
            //     'nombanco'          => $nombanco,
            //     'tiposcomprobantes' => $tiposcomprobantes,
            //     'periodos'          => $periodos,
            //     'monedas'           => $monedas,
            //     //'gestion'           => $gestionActual,
            //     'cuentas'           => $cuentas,
            //     //'cuentascod'        => $cuentascod,
            //     'cuentasnom'        => $cuentasnom,
            //     'centrocostos'      => $centrocostos,
            //     'centrocostos2'     => $centrocostos2,
            //     'cuentaconfig'      => $cuentaconfig,
            //     'comprobante'       => $comprobante,//<====
            //     'detalles'          => [
            //         'idscuentas'        => $idscuentas,
            //         //'codscuentas'       => $codscuentas,
            //         'nomcuentas'        => $nomcuentas,
            //         'glosas'            => $glosas,
            //         'debes'             => $debes,
            //         'haberes'           => $haberes,
            //         'idscentrocostos'   => $idscentrocostos,
            //         'nomscentrocostos'  => $nomscentrocostos
            //     ],
            //     'datos' => $datos
            // ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Comprobante();
            $obj->setConnection($connection);
            $comprobante = $obj->find($id);

            if ($comprobante == null) {
                return response()->json([
                    'response'  => 0,
                    'message'   => 'El comprobante no existe',
                ]);
            }

            $obj = new PeriodoContable();
            $obj->setConnection($connection);
            $periodo = $obj->where('fechaini', '<=', $request->fecha)->where('fechafin', '>=', $request->fecha)
                ->where('estado', 'A')->first();   

            $comprobante->referidoa = $request->referidoa;
            $comprobante->fecha = $request->fecha;
            $comprobante->nrodoc = $request->nrodoc;
            $comprobante->nrochequetarjeta = $request->nrocheque;
            $comprobante->glosa = $request->glosa;
            $comprobante->tipocambio = $request->tipocambio;
            $comprobante->contabilizar = $request->contabilizar == true ? 'S' : 'N';
            $comprobante->fkidcomprobantetipo = $request->idtipo;
            $comprobante->fkidbanco = $request->idbanco;
            $comprobante->fkidtipopago = $request->idtipopago;
            $comprobante->fkidmoneda = $request->idmoneda;
            $comprobante->fkidperiodocontable = $periodo->idperiodocontable;
            $comprobante->update();

            $idscuentasdel = json_decode($request->idscuentasdel);
            $idscuentas = json_decode($request->idscuentas);
            $glosas = json_decode($request->glosas);
            $debes = json_decode($request->debes);
            $haberes = json_decode($request->haberes);
            $idscentrocostos = json_decode($request->idscentrocostos);
            $idcomprobantecuentadetalle = json_decode($request->idcomprobantecuentadetalle);

            for ($i = 0; $i < sizeof($idscuentas); $i++) {
                if ($idcomprobantecuentadetalle[$i] == null) {
                    $comcd = new ComprobanteCuentaDetalle();
                    $comcd->glosamenor = $glosas[$i];
                    $comcd->debe = $debes[$i] == null ? 0 : $debes[$i];
                    $comcd->haber = $haberes[$i] == null ? 0 : $haberes[$i];
                    $comcd->fkidcomprobante = $comprobante->idcomprobante;
                    $comcd->fkidcentrodecosto = $idscentrocostos[$i];
                    $comcd->fkidcuentaplan = $idscuentas[$i];
                    $comcd->setConnection($connection);
                    $comcd->save();
                } else {
                    $obj = new ComprobanteCuentaDetalle();
                    $obj->setConnection($connection);
                    $comcd = $obj->find($idcomprobantecuentadetalle[$i]);
                    $comcd->glosamenor = $glosas[$i];
                    $comcd->debe = $debes[$i] == null ? 0 : $debes[$i];
                    $comcd->haber = $haberes[$i] == null ? 0 : $haberes[$i];
                    $comcd->fkidcomprobante = $comprobante->idcomprobante;
                    $comcd->fkidcentrodecosto = $idscentrocostos[$i];
                    $comcd->fkidcuentaplan = $idscuentas[$i];
                    $comcd->setConnection($connection);
                    $comcd->update();
                }
            }

            for ($i=0; $i < sizeof($idscuentasdel); $i++) { 
                $obj = new ComprobanteCuentaDetalle();
                $obj->setConnection($connection);
                $cuentadetalle = $obj->find($idscuentasdel[$i]);
                $cuentadetalle->delete();
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el comprobante ' . $comprobante->idcomprobante;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'message'  => 'Se actualizo corectamente el comprobante',
                'idcomprobante' => $comprobante->idcomprobante
            ]);

        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Comprobante();
            $obj->setConnection($connection);
            $comprobante = $obj->find($id);
            if ($comprobante == null) {
                return response()->json([
                    'response'  => 0,
                    'message'   => 'El comprobante no exsite'
                ]);
            }

            if ($comprobante->estado == 'C') {
                return response()->json([
                    'response'  => 0,
                    'message'   => 'El comprobante no se puede eliminar, ya se encuentra cerrado'
                ]);
            }

            $obj = new ComprobanteCuentaDetalle();
            $obj->setConnection($connection);
            $detalles = $obj->where('fkidcomprobante', $id)->get();
            foreach ($detalles as $row) {
                $row->delete();
            }
            $comprobante->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el comprobante ' . $comprobante->idcomprobante;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response'      => 1,
                'message'       => 'Se elimino corectamente el comprobante',
            ]);

        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function get_sistemacomercial(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $selected = $request->input('selected');
            $data = [];

            if ($selected == 1) {
                $data = DB::connection($connection)
                    ->table('venta')
                    ->select('idventa as id', 'codventa as codigo')
                    ->where(function ($query) {
                        return $query
                            ->orWhere('sehizoasientautom', '=', 'N')
                            ->orWhereNull('sehizoasientautom');
                    })
                    ->whereNull('deleted_at')
                    ->orderBy('idventa', 'desc')
                    ->get()->take(20);
            }

            if ($selected == 2) {

                $data = DB::connection($connection)
                    ->table('cobro as co')
                    ->select('co.idcobro as id', 'co.codcobro as codigo')
                    ->where(DB::raw("(
                        SELECT COUNT(*) FROM cobroplanpagodetalle as copagdet, ventaplandepago vtapag 
                        WHERE copagdet.fkidcobro=co.idcobro AND copagdet.fkidventaplandepago=vtapag.idventaplandepago AND 
                            copagdet.deleted_at IS NULL AND vtapag.deleted_at IS NULL AND vtapag.descripcion<>'Anticipo' AND 
                            vtapag.descripcion<>'Contado' AND vtapag.estado='P' AND 
                            (vtapag.sehizoasientautom='N' OR vtapag.sehizoasientautom IS NULL)
                        )"), '>', '0'
                    )
                    ->whereNull('co.deleted_at')
                    ->orderBy('co.idcobro', 'desc')
                    ->get()->take(20);

            }

            if ($selected == 3) {
                $data = DB::connection($connection)
                    ->table('compra')
                    ->select('idcompra as id', 'codcompra as codigo')
                    ->where(function ($query) {
                        return $query
                            ->orWhere('sehizoasientautom', '=', 'N')
                            ->orWhereNull('sehizoasientautom');
                    })
                    ->whereNull('deleted_at')
                    ->orderBy('idcompra', 'desc')
                    ->get()->take(20);
            }

            if ($selected == 4) {


                $data = DB::connection($connection)
                    ->table('pagos as pag')
                    ->select('pag.idpagos as id', 'pag.codpago as codigo')
                    ->where(DB::raw("(
                        SELECT COUNT(*) FROM pagodetacompra as pagdetcomp, compraplanporpagar compplan 
                        WHERE pagdetcomp.fkidpagos=pag.idpagos AND pagdetcomp.fkidcompraplanporpagar=compplan.idcompraplanporpagar AND 
                            pagdetcomp.deleted_at IS NULL AND compplan.deleted_at IS NULL AND compplan.descripcion<>'Anticipo' AND 
                            compplan.estado='P' AND (compplan.sehizoasientautom='N' OR compplan.sehizoasientautom IS NULL)
                        )"), '>', '0'
                    )
                    ->whereNull('pag.deleted_at')
                    ->orderBy('pag.idpagos', 'desc')
                    ->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'selected' => $selected,
                'data'     => $data,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los datos necesarios',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function searchsistemacomercialByIdCod(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $selected = $request->input('selected');
            $searchByIdCod = $request->input('searchByIdCod');
            $data = [];

            if ($selected == 1) {
                $data = DB::connection($connection)
                    ->table('venta')
                    ->select('idventa as id', 'codventa as codigo')
                    ->where(function ($query) {
                        return $query
                            ->orWhere('sehizoasientautom', '=', 'N')
                            ->orWhereNull('sehizoasientautom');
                    })
                    ->where(function ($query) use ($searchByIdCod) {
                        if ($searchByIdCod == null) return;
                        return $query
                            ->orWhere('idventa', 'ILIKE', '%'.$searchByIdCod.'%')
                            ->orWhere('codventa', 'ILIKE', '%'.$searchByIdCod.'%');
                    })
                    ->whereNull('deleted_at')
                    ->orderBy('idventa', 'desc')
                    ->get()->take(20);
            }

            if ($selected == 2) {

                $data = DB::connection($connection)
                    ->table('cobro as co')
                    ->select('co.idcobro as id', 'co.codcobro as codigo')
                    ->where(DB::raw("(
                        SELECT COUNT(*) FROM cobroplanpagodetalle as copagdet, ventaplandepago vtapag 
                        WHERE copagdet.fkidcobro=co.idcobro AND copagdet.fkidventaplandepago=vtapag.idventaplandepago AND 
                            copagdet.deleted_at IS NULL AND vtapag.deleted_at IS NULL AND vtapag.descripcion<>'Anticipo' AND 
                            vtapag.descripcion<>'Contado' AND vtapag.estado='P' AND 
                            (vtapag.sehizoasientautom='N' OR vtapag.sehizoasientautom IS NULL)
                        )"), '>', '0'
                    )
                    ->where(function ($query) use ($searchByIdCod) {
                        if ($searchByIdCod == null) return;
                        return $query
                            ->orWhere('co.idcobro', 'ILIKE', '%'.$searchByIdCod.'%')
                            ->orWhere('co.codcobro', 'ILIKE', '%'.$searchByIdCod.'%');
                    })
                    ->whereNull('co.deleted_at')
                    ->orderBy('co.idcobro', 'desc')
                    ->get()->take(20);

            }

            if ($selected == 3) {
                $data = DB::connection($connection)
                    ->table('compra')
                    ->select('idcompra as id', 'codcompra as codigo')
                    ->where(function ($query) {
                        return $query
                            ->orWhere('sehizoasientautom', '=', 'N')
                            ->orWhereNull('sehizoasientautom');
                    })
                    ->where(function ($query) use ($searchByIdCod) {
                        if ($searchByIdCod == null) return;
                        return $query
                            ->orWhere('idcompra', 'ILIKE', '%'.$searchByIdCod.'%')
                            ->orWhere('codcompra', 'ILIKE', '%'.$searchByIdCod.'%');
                    })
                    ->whereNull('deleted_at')
                    ->orderBy('idcompra', 'desc')
                    ->get()->take(20);
            }

            if ($selected == 4) {


                $data = DB::connection($connection)
                    ->table('pagos as pag')
                    ->select('pag.idpagos as id', 'pag.codpago as codigo')
                    ->where(DB::raw("(
                        SELECT COUNT(*) FROM pagodetacompra as pagdetcomp, compraplanporpagar compplan 
                        WHERE pagdetcomp.fkidpagos=pag.idpagos AND pagdetcomp.fkidcompraplanporpagar=compplan.idcompraplanporpagar AND 
                            pagdetcomp.deleted_at IS NULL AND compplan.deleted_at IS NULL AND compplan.descripcion<>'Anticipo' AND 
                            compplan.estado='P' AND (compplan.sehizoasientautom='N' OR compplan.sehizoasientautom IS NULL)
                        )"), '>', '0'
                    )
                    ->where(function ($query) use ($searchByIdCod) {
                        if ($searchByIdCod == null) return;
                        return $query
                            ->orWhere('pag.idpagos', 'ILIKE', '%'.$searchByIdCod.'%')
                            ->orWhere('pag.codpago', 'ILIKE', '%'.$searchByIdCod.'%');
                    })
                    ->whereNull('pag.deleted_at')
                    ->orderBy('pag.idpagos', 'desc')
                    ->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'selected' => $selected,
                'data'     => $data,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los datos necesarios',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function generar_comprobante(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $selected = $request->input('selected');
            $id = $request->input('id');

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $idcomprobante = 0;
            $function = new Functions();

            if ($config_cliente->asientoautomdecomprob == 'S') {

                if ($selected == 1) {
                    $obj = new Venta();
                    $obj->setConnection($connection);
                    $venta = $obj->find($id);

                    if ($venta->sehizoasientautom == 'N' || $venta->sehizoasientautom == null || $venta->sehizoasientautom == '') {
                        $idcomprobante = $function->asienAutomVentaContadoCredito($venta->idventa, $request->x_idusuario, $connection);

                        if ($idcomprobante > 0) {
                            $venta->sehizoasientautom = 'S';
                            $venta->update();
                        }
                    }
                    
                }
                if ($selected == 2) {

                    $cobro = DB::connection($connection)
                        ->table('ventaplandepago as vtapag')
                        ->leftJoin('cobroplanpagodetalle as copagdet', 'vtapag.idventaplandepago', '=', 'copagdet.fkidventaplandepago')
                        ->leftJoin('cobro as co', 'copagdet.fkidcobro', '=', 'co.idcobro')
                        ->select('vtapag.idventaplandepago', 'vtapag.fkidventa', 'vtapag.descripcion', 'copagdet.montocobrado', 'co.fecha')
                        ->where('copagdet.fkidcobro', '=', $id)
                        ->where(function ($query) {
                            return $query
                                ->orWhere('vtapag.sehizoasientautom', '=', 'N')
                                ->orWhereNull('vtapag.sehizoasientautom');
                        })
                        ->whereNull('vtapag.deleted_at')
                        ->whereNull('copagdet.deleted_at')
                        ->whereNull('co.deleted_at')
                        ->get();
                    
                    if (sizeof($cobro) > 0) {
                        $montocobro = 0;
                        $descripcioncobro = '';
                        foreach ($cobro as $key => $value) {
                            $montocobro = $montocobro + $value->montocobrado;
                            $descripcioncobro = $descripcioncobro . $value->descripcion . ' ';
                        }
                        $idcomprobante = $function->cobroCuotaVtaCred($cobro[0]->fkidventa, $id, $descripcioncobro, 
                                $cobro[0]->fecha, $montocobro, $request->x_idusuario, $connection);

                        if ($idcomprobante > 0) {
                            foreach ($cobro as $key => $value) {

                                $obj = new PlanDePago();
                                $obj->setConnection($connection);
                                $planPago = $obj->find($value->idventaplandepago);
        
                                $planPago->sehizoasientautom = 'S';
                                $planPago->setConnection($connection);
                                $planPago->update();
                            }
                        }
                    }
                    
                }
                if ($selected == 3) {
                    $obj = new Compra();
                    $obj->setConnection($connection);
                    $compra = $obj->find($id);

                    if ($compra->sehizoasientautom == 'N' || $compra->sehizoasientautom == null || $compra->sehizoasientautom == '') {
                        $idcomprobante = $function->asienAutomCompraContadoCredito($compra->idcompra, $request->x_idusuario, $connection);
                        if ($idcomprobante > 0) {
                            $compra->sehizoasientautom = 'S';
                            $compra->update();
                        }
                    }
                }
                if ($selected == 4) {
                    $pago = DB::connection($connection)
                        ->table('pagos as pag')
                        ->leftJoin('pagodetacompra as pagdetcomp', 'pag.idpagos', '=', 'pagdetcomp.fkidpagos')
                        ->leftJoin('compraplanporpagar as compplan', 'pagdetcomp.fkidcompraplanporpagar', '=', 'compplan.idcompraplanporpagar')
                        ->select('pag.idpagos', 'pag.fecha', 'compplan.idcompraplanporpagar', 'compplan.fkidcompra', 
                            'pagdetcomp.montopagado', 'compplan.descripcion'
                        )
                        ->where('pag.idpagos', '=', $id)
                        ->where(function ($query) {
                            return $query
                                ->orWhere('compplan.sehizoasientautom', '=', 'N')
                                ->orWhereNull('compplan.sehizoasientautom');
                        })
                        ->whereNull('pag.deleted_at')
                        ->whereNull('pagdetcomp.deleted_at')
                        ->whereNull('compplan.deleted_at')
                        ->get();

                    if (sizeof($pago) > 0) {
                        $montopagado = 0;
                        $descripcionpago = '';
                        foreach ($pago as $key => $value) {
                            $montopagado = $montopagado + $value->montopagado;
                            $descripcionpago = $descripcionpago . $value->descripcion . ' ';
                        }
                        $idcomprobante = $function->pagosComprasCredito($pago[0]->fkidcompra, $pago[0]->idpagos, 
                            $descripcionpago, $pago[0]->fecha, $montopagado, $request->x_idusuario, $connection);

                        if ($idcomprobante > 0) {
                            foreach ($pago as $key => $value) {

                                $obj = new CompraPlanPagar();
                                $obj->setConnection($connection);

                                $planPago = $obj->find($value->idcompraplanporpagar);

                                $planPago->sehizoasientautom = 'S';
                                $planPago->setConnection($connection);
                                $planPago->update();
                            }
                        }
                    }
                }

            }

            return response()->json([
                'response' => 1,
                'selected' => $selected,
                'idcomprobante' => $idcomprobante,
                'config_cliente' => $config_cliente,
                'id' => $id,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los datos necesarios',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function imprimir(Request $request) {
        try {
            //dd($request->all());
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Comprobante();
            $obj->setConnection($connection);

            $comprobante = $obj->leftJoin('comprobantecuentadetalle as ccd', 'ccd.fkidcomprobante', 'comprobante.idcomprobante')
                            ->leftJoin('cuentaplan as cp', 'cp.idcuentaplan', 'ccd.fkidcuentaplan')
                            ->leftJoin('centrodecosto as cdc', 'cdc.idcentrodecosto', 'ccd.fkidcentrodecosto')
                            ->leftJoin('comprobantetipo as ct', 'ct.idcomprobantetipo', 'comprobante.fkidcomprobantetipo')
                            ->leftJoin('moneda as m', 'm.idmoneda', 'comprobante.fkidmoneda')
                            ->leftJoin('banco as b', 'b.idbanco', 'comprobante.fkidbanco')
                            ->select('cp.codcuenta as codigo', 'cp.nombre as cuenta', 'ct.descripcion as tipocomprobante',
                                    'comprobante.codcomprobante as numero', 'comprobante.fecha', 'm.descripcion as moneda',
                                    'comprobante.glosa', 'comprobante.referidoa', 'comprobante.idcomprobante', 'm.idmoneda',
                                    'comprobante.tipocambio', 'ccd.glosamenor', 'ccd.debe', 'ccd.haber', 'cdc.nombre as centrocosto',
                                    'ct.firmaa', 'ct.firmab', 'ct.firmac', 'ct.firmad', 'comprobante.fkidtipopago', 
                                    'comprobante.nrochequetarjeta', 'b.nombre as banco')
                            ->orderBy('ccd.idcomprobantecuentadetalle', 'ASC')
                            ->whereNull('ccd.deleted_at')
                            ->whereNull('cp.deleted_at')
                            ->whereNull('cdc.deleted_at')
                            ->whereNull('ct.deleted_at')
                            ->whereNull('m.deleted_at')
                            ->whereNull('b.deleted_at')
                            ->where('comprobante.idcomprobante', $request->idcomprobante)
                            //->distinct('comprobante.idcomprobante')
                            ->get();
            //dd($comprobante);
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $pdf = PDF::loadView('sistema.src.contable.reporte.pdf.comprobante', [
                'logo'          => $config->logoreporte,
                'fecha'         => $fecha,
                'hora'          => $hora,
                'comprobante'   => $comprobante
            ]);

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(500, 800, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(40, 800, $request->usuario, null, 8, array(0, 0, 0));

            return $pdf->stream('comprobante.pdf');

        } catch (\Throwable $th) {

            dd($th);
            return "Error al imprimir el comprobante";
        }
    }
}
