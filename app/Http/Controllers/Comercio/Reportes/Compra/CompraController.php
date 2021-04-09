<?php

namespace App\Http\Controllers\Comercio\Reportes\Compra;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Config\ConfigCliente;
use Dompdf\Dompdf;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use PDF;

class CompraController extends Controller
{
    public function recibo(Request $request)
    {
        
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $user = $request->usuario;

            $permisos = json_decode($request->permisos);

            $compra_first = json_decode($request->compra_first);
            $compra_detalle = json_decode($request->compra_detalle);
            $planpago = json_decode($request->planpago);

            $config = json_decode($request->config_cliente);

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.compra.recibocompra', [
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'compra' => $compra_first,
                'detalle' => $compra_detalle,
                'pago' => $planpago,
                'permisos' => $permisos,
                'logo' => $config->logoreporte,
            ]);

            return $pdf->stream('recibocompra.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }

    public function generar(Request $request)
    {
        
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $user = $request->usuario;

            $idcompra = $request->idcompra;
            $tipocompra = $request->tipocompra;
            $fechainicio = $request->fechainicio;
            $fechafin = $request->fechafin;
            $idsucursal = $request->idsucursal;
            $idalmacen = $request->idalmacen;
            $idmoneda = $request->idmoneda;
            $proveedor = $request->proveedor;
            $config_codigo = $request->config_codigo;
            $ordenar = $request->ordenar;
            $exportar = $request->exportar;

            $order = '';
            if ($ordenar == '1') {
                $order = 'comp.idcompra';
            }
            if ($ordenar == '2') {
                $order = 'comp.tipo';
            }
            if ($ordenar == '3') {
                $order = 'comp.fecha';
            }
            if ($ordenar == '4') {
                $order = 'prov.nombre';
            }

            $consulta = [];
            $bandera = 0;

            if ($idcompra != '') {
                if ($config_codigo == 'A') {
                    array_push($consulta, ['comp.codcompra', 'ILIKE', '%'.$idcompra.'%']);
                } else {
                    array_push($consulta, ['comp.idcompra', '=', $idcompra]);
                }
                $bandera = 1;
            }
            if ($tipocompra != '') {
                array_push($consulta, ['comp.tipo', '=', $tipocompra]);
                $bandera = 1;
            }
            if ($fechainicio != '') {
                if ($fechafin == '') {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                    $bandera = 1;
                }else {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                    array_push($consulta, ['comp.fecha', '<=', $fechafin]);
                    $bandera = 1;
                }
            }
            if ($idmoneda != '') {
                array_push($consulta, ['mon.idmoneda', '=', $idmoneda]);
                $bandera = 1;
            }
            if ($idsucursal != '') {
                array_push($consulta, ['suc.idsucursal',  '=', $idsucursal]);
                $bandera = 1;
            }
            if ($idalmacen != '') {
                array_push($consulta, ['alm.idalmacen',  '=', $idalmacen]);
                $bandera = 1;
            }
            if ($bandera == 1) {
                array_push($consulta, [DB::raw("CONCAT(prov.nombre, ' ',prov.apellido)"), 'ILIKE', '%'.$proveedor.'%']);
            }

            $compra = DB::connection($connection)
                ->table('compra as comp')
                ->leftJoin('proveedor as prov', 'comp.fkidproveedor', '=', 'prov.idproveedor')
                ->leftJoin('moneda as mon', 'comp.fkidmoneda', '=', 'mon.idmoneda')
                ->leftJoin('compradetalle as compdet', 'comp.idcompra', '=', 'compdet.fkidcompra')
                ->leftJoin('almacenproddetalle as almprodet', 'compdet.fkidalmacenproddetalle', '=', 'almprodet.idalmacenproddetalle')
                ->leftJoin('producto as prod', 'almprodet.fkidproducto', '=', 'prod.idproducto')
                ->leftJoin('unidadmedida as unid', 'prod.fkidunidadmedida', '=', 'unid.idunidadmedida')
                ->leftJoin('almacen as alm', 'almprodet.fkidalmacen', '=', 'alm.idalmacen')
                ->leftJoin('sucursal as suc', 'alm.fkidsucursal', '=', 'suc.idsucursal')
                ->select('comp.idcompra', 'comp.codcompra', 'comp.fecha', 'comp.tipo', 'comp.notas',
                    'comp.anticipopagado as anticipo', 'comp.mtototcompra', 'comp.mtototpagado', 'unid.descripcion as unidadmedida',
                    'compdet.cantidad', 'compdet.costounit', 'prod.idproducto', 'prod.codproducto', 'prod.descripcion as producto',
                    DB::raw("CONCAT(prov.nombre, ' ',prov.apellido) as proveedor"), 'prov.nit', 'mon.descripcion as moneda',
                    'alm.descripcion as almacen', 'suc.razonsocial', 'suc.nombrecomercial', 'suc.tipoempresa'
                )
                ->where(($bandera == 1)?
                    $consulta:
                    [[DB::raw("CONCAT(prov.nombre, ' ',prov.apellido)"), 'ILIKE', '%'.$proveedor.'%']]
                )
                ->whereNull('comp.deleted_at')
                ->whereNull('compdet.deleted_at')
                ->orderBy('comp.idcompra')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.compra.compradetalle', [
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'compra' => $compra,
                'codigospropios' => $config_cliente->codigospropios,
                'logo' => $config_cliente->logoreporte,
            ]);

            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(40, 820, $user, null, 8, array(0, 0, 0));
            
            $canvas->page_text(450, 820, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            // $usuario = $user;
            // $fecha = $fecha;
            // $hora = $hora;
            // $compra = $compra;
            // $codigospropios = $config_cliente->codigospropios;
            // $logo = $config_cliente->logoreporte;
            // $pdf = \App::make('dompdf.wrapper');
            // $view = \View::make('sistema.src.comercio.reportes.pdf.compra.compra', compact('usuario', 'fecha', 'hora', 'compra', 'codigospropios', 'logo'))->render();
            // $pdf->loadHtml($view);

            if ($exportar == 'P') { 
                return $pdf->download('compradetalle.pdf');
            }

            return $pdf->stream('compradetalle.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
    }

    public function generar_compra(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $usuario = $request->input('usuario', '');

            $idcompra      = $request->input('idcompra');
            $tipocompra    = $request->input('tipocompra');
            $fechainicio   = $request->input('fechainicio');
            $fechafin      = $request->input('fechafin');
            $idsucursal    = $request->input('idsucursal');
            $idalmacen     = $request->input('idalmacen');
            $idmoneda      = $request->input('idmoneda');
            $proveedor     = $request->input('proveedor');
            $config_codigo = $request->input('config_codigo');
            $ordenar       = $request->input('ordenar');
            $exportar      = $request->input('exportar');

            $order = '';
            if ($ordenar == '1') {
                $order = 'comp.idcompra';
            }
            if ($ordenar == '2') {
                $order = 'comp.tipo';
            }
            if ($ordenar == '3') {
                $order = 'comp.fecha';
            }
            if ($ordenar == '4') {
                $order = 'prov.nombre';
            }

            $consulta = [];

            if (!is_null($idcompra)) {
                if ($config_codigo == 'A') {
                    array_push($consulta, ['comp.codcompra', 'ILIKE', '%'.$idcompra.'%']);
                } else {
                    array_push($consulta, ['comp.idcompra', '=', $idcompra]);
                }
            }
            if (!is_null($tipocompra)) {
                array_push($consulta, ['comp.tipo', '=', $tipocompra]);
            }
            if (!is_null($fechainicio)) {
                if (is_null($fechafin)) {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                }else {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                    array_push($consulta, ['comp.fecha', '<=', $fechafin]);
                }
            }
            if (!is_null($idsucursal)) {
                // $almacen = '';
                // if (!is_null($idalmacen)) {
                //     $almacen = ' AND almproddet.fkidalmacen = '. $idalmacen;
                // }
                array_push($consulta, [ 
                    DB::raw("( SELECT COUNT(*) AS cantidad 
                        FROM compradetalle compdet, almacenproddetalle almproddet, almacen alm  
                        WHERE comp.idcompra = compdet.fkidcompra AND compdet.fkidalmacenproddetalle = almproddet.idalmacenproddetalle 
                            AND alm.idalmacen = almproddet.fkidalmacen  
                            AND alm.fkidsucursal = '$idsucursal' AND compdet.deleted_at IS NULL )" . ""
                    ),  '>', '0' ]);
            }
            if (!is_null($idalmacen)) {
                array_push($consulta, [ 
                    DB::raw("( SELECT COUNT(*) AS cantidad 
                        FROM compradetalle compdet, almacenproddetalle almproddet 
                        WHERE comp.idcompra = compdet.fkidcompra AND compdet.fkidalmacenproddetalle = almproddet.idalmacenproddetalle 
                            AND almproddet.fkidalmacen = '$idalmacen' AND compdet.deleted_at IS NULL )"
                    ),  '>', '0' ]);
            }
            if (!is_null($idmoneda)) {
                array_push($consulta, ['comp.fkidmoneda', '=', $idmoneda]);
            }
            if (!is_null($proveedor)) {
                array_push($consulta, [DB::raw("CONCAT(prov.nombre, ' ',prov.apellido)"), 'ILIKE', '%'.$proveedor.'%']);
            }


            $compra = DB::connection($connection)
                ->table('compra as comp')
                ->leftJoin('proveedor as prov', 'comp.fkidproveedor', '=', 'prov.idproveedor')
                ->leftJoin('moneda as mon', 'comp.fkidmoneda', '=', 'mon.idmoneda')
                ->select('comp.idcompra', 'comp.codcompra', 'comp.fecha', 'comp.tipo', 'comp.notas',
                    'comp.anticipopagado as anticipo', 'comp.mtototcompra', 'comp.mtototpagado', 
                    DB::raw("CONCAT(prov.nombre, ' ',prov.apellido) as proveedor"), 'prov.nit', 'mon.descripcion as moneda',
                    DB::raw("( SELECT alm.descripcion 
                        FROM compradetalle compdet, almacenproddetalle almproddet, almacen alm  
                        WHERE comp.idcompra = compdet.fkidcompra AND compdet.fkidalmacenproddetalle = almproddet.idalmacenproddetalle 
                            AND alm.idalmacen = almproddet.fkidalmacen AND compdet.deleted_at IS NULL LIMIT 1) AS almacen"
                    )
                )
                ->where( $consulta )
                ->whereNull('comp.deleted_at')
                ->orderBy('comp.idcompra')
                ->get();

            // dd($compra);

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.compra.compra', [
                'usuario' => $usuario,
                'fecha' => $fecha,
                'hora' => $hora,
                'compra' => $compra,
                'codigospropios' => $config_cliente->codigospropios,
                'logo' => $config_cliente->logoreporte,
            ]);

            //$pdf->setPaper('A4', 'landscape');

            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(40, 820, $usuario, null, 8, array(0, 0, 0));
            
            $canvas->page_text(450, 820, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            if ($exportar == 'P') { 
                return $pdf->download('compra.pdf');
            }

            return $pdf->stream('compra.pdf');

            
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function generar_cuentaporpagar(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $usuario = $request->input('usuario', '');

            $fechainicio    = $request->input('fechainicio');
            $fechafin       = $request->input('fechafin');
            $fechainiciocuota = $request->input('fechainiciocuota');
            $fechafincuota    = $request->input('fechafincuota');
            $proveedor      = $request->input('proveedor');
            $codidproveedor = $request->input('codidproveedor');
            $ordenar        = $request->input('ordenar');
            $exportar       = $request->input('exportar');

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $order = '';
            if ($ordenar == '1') {
                $order = 'comp.idcompra';
            }
            if ($ordenar == '2') {
                $order = 'comp.tipo';
            }
            if ($ordenar == '3') {
                $order = 'comp.fecha';
            }
            if ($ordenar == '4') {
                $order = 'prov.nombre';
            }

            $consulta = [];
            if (!is_null($fechainicio)) {
                if (is_null($fechafin)) {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                }else {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                    array_push($consulta, ['comp.fecha', '<=', $fechafin]);
                }
            }
            if (!is_null($fechainiciocuota)) {
                if (is_null($fechafincuota)) {
                    array_push($consulta, ['comppag.fechadepago', '>=', $fechainiciocuota]);
                }else {
                    array_push($consulta, ['comppag.fechadepago', '>=', $fechainiciocuota]);
                    array_push($consulta, ['comppag.fechadepago', '<=', $fechafincuota]);
                }
            }
            if (!is_null($codidproveedor)) {
                if ($config_cliente->codigospropios) {
                    array_push($consulta, ['prov.codproveedor', 'ILIKE', '%'.$codidproveedor.'%']);
                }else {
                    array_push($consulta, ['prov.idproveedor', '=', $codidproveedor]);
                }
            }
            if (!is_null($proveedor)) {
                array_push($consulta, [DB::raw("CONCAT(prov.nombre, ' ',prov.apellido)"), 'ILIKE', '%'.$proveedor.'%']);
            }

            $compra = DB::connection($connection)
                ->table('compra as comp')
                ->leftJoin('proveedor as prov', 'comp.fkidproveedor', '=', 'prov.idproveedor')
                ->leftJoin('moneda as mon', 'comp.fkidmoneda', '=', 'mon.idmoneda')
                ->join('compraplanporpagar as comppag', 'comp.idcompra', '=', 'comppag.fkidcompra')
                ->select('comp.idcompra', 'comp.codcompra', 'comp.fecha', 'comp.tipo', 'comp.notas',
                    'comp.anticipopagado as anticipo', 'comp.mtototcompra', 'comp.mtototpagado', 
                    DB::raw("CONCAT(prov.nombre, ' ',prov.apellido) as proveedor"), 'mon.descripcion as moneda',
                    'comppag.fechadepago', 'comppag.montoapagar', 'comppag.montopagado', 'comppag.descripcion'
                )
                ->where( $consulta )
                ->whereNull('comp.deleted_at')
                ->whereNull('comppag.deleted_at')
                ->orderBy('comppag.idcompraplanporpagar')
                ->get();

            // dd($compra);

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.compra.cuentapago', [
                'usuario' => $usuario,
                'fecha' => $fecha,
                'hora' => $hora,
                'compra' => $compra,
                'codigospropios' => $config_cliente->codigospropios,
                'logo' => $config_cliente->logoreporte,
            ]);

            //$pdf->setPaper('A4', 'landscape');

            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(40, 820, $usuario, null, 8, array(0, 0, 0));
            
            $canvas->page_text(450, 820, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            if ($exportar == 'P') { 
                return $pdf->download('cuentapago.pdf');
            }

            return $pdf->stream('cuentapago.pdf');
            
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function generar_pagorealizado(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $usuario = $request->input('usuario', '');

            $fechainicio    = $request->input('fechainicio');
            $fechafin       = $request->input('fechafin');
            $fechainiciopago = $request->input('fechainiciopago');
            $fechafinpago    = $request->input('fechafinpago');
            $proveedor      = $request->input('proveedor');
            $codidproveedor = $request->input('codidproveedor');

            $opcion = $request->input('opcion');
            $montoinicio = $request->input('montoinicio');
            $montofin = $request->input('montofin');

            $ordenar        = $request->input('ordenar');
            $exportar       = $request->input('exportar');

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $order = '';
            if ($ordenar == '1') {
                $order = 'comp.idcompra';
            }
            if ($ordenar == '2') {
                $order = 'comp.tipo';
            }
            if ($ordenar == '3') {
                $order = 'comp.fecha';
            }
            if ($ordenar == '4') {
                $order = 'prov.nombre';
            }

            $consulta = [];
            if (!is_null($fechainicio)) {
                if (is_null($fechafin)) {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                }else {
                    array_push($consulta, ['comp.fecha', '>=', $fechainicio]);
                    array_push($consulta, ['comp.fecha', '<=', $fechafin]);
                }
            }
            if (!is_null($fechainiciopago)) {
                if (is_null($fechafinpago)) {
                    array_push($consulta, ['pag.fecha', '>=', $fechainiciopago]);
                }else {
                    array_push($consulta, ['pag.fecha', '>=', $fechainiciopago]);
                    array_push($consulta, ['pag.fecha', '<=', $fechafinpago]);
                }
            }
            if (!is_null($codidproveedor)) {
                if ($config_cliente->codigospropios) {
                    array_push($consulta, ['prov.codproveedor', 'ILIKE', '%'.$codidproveedor.'%']);
                }else {
                    array_push($consulta, ['prov.idproveedor', '=', $codidproveedor]);
                }
            }
            if (!is_null($proveedor)) {
                array_push($consulta, [DB::raw("CONCAT(prov.nombre, ' ',prov.apellido)"), 'ILIKE', '%'.$proveedor.'%']);
            }

            if (!is_null($opcion)) {
                if ($opcion == '!') {
                    if (!is_null($montoinicio)) {
                        if (is_null($montofin)) {
                            array_push($consulta, ['comppag.montopagado', '>=', $montoinicio]);
                        }else {
                            array_push($consulta, ['comppag.montopagado', '>=', $montoinicio]);
                            array_push($consulta, ['comppag.montopagado', '<=', $montofin]);
                        }
                    }
                }else {
                    if (!is_null($montoinicio)) {
                        array_push($consulta, ['comppag.montopagado', $opcion, $montoinicio]);
                    } 
                }
            }

            $pago = DB::connection($connection)
                ->table('pagos as pag')
                ->leftJoin('pagodetacompra as pagdet', 'pag.idpagos', '=', 'pagdet.fkidpagos')
                ->leftJoin('compraplanporpagar as comppag', 'pagdet.fkidcompraplanporpagar', '=', 'comppag.idcompraplanporpagar')
                ->leftJoin('compra as comp', 'comppag.fkidcompra', '=', 'comp.idcompra')
                ->leftJoin('proveedor as prov', 'comp.fkidproveedor', '=', 'prov.idproveedor')
                ->select(
                    'pag.idpagos', 'pag.fecha as fechapago', 'pag.codpago', 'comp.idcompra', 'comp.fecha as fechacompra',
                    DB::raw("CONCAT(prov.nombre, ' ',prov.apellido) as proveedor"), 'comppag.descripcion', 'comppag.montopagado',
                    'comppag.montoapagar', 'comppag.fechadepago'
                )
                ->where( $consulta )
                ->whereNull('pag.deleted_at')
                ->whereNull('prov.deleted_at')
                ->whereNull('comp.deleted_at')
                ->whereNull('comppag.deleted_at')
                ->orderBy('pag.idpagos', 'asc')
                ->get();

            // dd($pago);

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.compra.pagorealizado', [
                'usuario' => $usuario,
                'fecha' => $fecha,
                'hora' => $hora,
                'pago' => $pago,
                'codigospropios' => $config_cliente->codigospropios,
                'logo' => $config_cliente->logoreporte,
            ]);

            $pdf->setPaper('A4', 'landscape');

            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(40, 820, $usuario, null, 8, array(0, 0, 0));
            
            $canvas->page_text(450, 820, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            if ($exportar == 'P') { 
                return $pdf->download('pagorealizado.pdf');
            }

            return $pdf->stream('pagorealizado.pdf');
            
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function generar_proveedor(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $usuario = $request->input('usuario', '');

            $codidproveedor = $request->input('codidproveedor');
            $idciudad = $request->input('idciudad');
            $nombre = $request->input('nombre');
            $apellido = $request->input('apellido');
            $nit = $request->input('nit');

            $fkidcontacto = json_decode($request->input('fkidcontacto', '[]'));
            $arraydetcontacto = json_decode($request->input('arraydetcontacto', '[]'));
            
            $ordenar        = $request->input('ordenar');
            $exportar       = $request->input('exportar');

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $order = '';
            if ($ordenar == '1') {
                $order = 'comp.idcompra';
            }
            if ($ordenar == '2') {
                $order = 'comp.tipo';
            }
            if ($ordenar == '3') {
                $order = 'comp.fecha';
            }
            if ($ordenar == '4') {
                $order = 'prov.nombre';
            }

            $consulta = [];
            if (!is_null($codidproveedor)) {
                if ($config_cliente->codigospropios) {
                    array_push($consulta, ['prov.codproveedor', 'ILIKE', '%'.$codidproveedor.'%']);
                }else {
                    array_push($consulta, ['prov.idproveedor', '=', $codidproveedor]);
                }
            }
            if (!is_null($idciudad)) {
                array_push($consulta, ['prov.fkidciudad', 'ILIKE', '%'.$idciudad.'%']);
            }
            if (!is_null($nombre)) {
                array_push($consulta, ['prov.nombre', 'ILIKE', '%'.$nombre.'%']);
            }
            if (!is_null($apellido)) {
                array_push($consulta, ['prov.apellido', 'ILIKE', '%'.$apellido.'%']);
            }
            if (!is_null($nit)) {
                array_push($consulta, ['prov.nit', 'ILIKE', '%'.$nit.'%']);
            }

            $referenciacontacto = DB::connection($connection)
                ->table('referenciadecontacto')
                ->whereNull('deleted_at')
                ->orderBy('idreferenciadecontacto', 'asc')
                ->get();

            $select = ['prov.idproveedor', 'prov.codproveedor', 'prov.nit', 'ciu.descripcion as ciudad',
                    DB::raw("CONCAT(prov.nombre, ' ',prov.apellido) as proveedor")
                ];

            if (sizeof($referenciacontacto) > 0) {
                array_push($select, 
                    DB::raw('(SELECT provcont.valor FROM proveedorcontactarlo provcont 
                        WHERE prov.idproveedor = provcont.fkidproveedor AND provcont.deleted_at IS NULL AND
                            provcont.fkidreferenciadecontacto = '.$referenciacontacto[0]->idreferenciadecontacto.' LIMIT 1) AS valor1'
                ) );
            }
            if (sizeof($referenciacontacto) > 1) {
                array_push($select, 
                    DB::raw('(SELECT provcont.valor FROM proveedorcontactarlo provcont 
                        WHERE prov.idproveedor = provcont.fkidproveedor AND provcont.deleted_at IS NULL AND
                            provcont.fkidreferenciadecontacto = '.$referenciacontacto[1]->idreferenciadecontacto.' LIMIT 1) AS valor2'
                ) );
            }
            if (sizeof($referenciacontacto) > 2) {
                array_push($select, 
                    DB::raw('(SELECT provcont.valor FROM proveedorcontactarlo provcont 
                        WHERE prov.idproveedor = provcont.fkidproveedor AND provcont.deleted_at IS NULL AND
                            provcont.fkidreferenciadecontacto = '.$referenciacontacto[2]->idreferenciadecontacto.' LIMIT 1) AS valor3'
                ) );
            }

            for ($index = 0; $index < sizeof($fkidcontacto); $index++) { 
                $idcontacto = $fkidcontacto[$index];
                $detcontacto = $arraydetcontacto[$index];
                if (!is_null($idcontacto) && $idcontacto != '') {
                    if (!is_null($detcontacto) && $detcontacto != '') {
                        array_push($consulta, [
                            DB::raw("(SELECT COUNT(*) AS cantidad FROM proveedorcontactarlo provcont 
                                WHERE prov.idproveedor = provcont.fkidproveedor AND provcont.deleted_at IS NULL AND
                                    provcont.fkidreferenciadecontacto = '$idcontacto' AND provcont.valor ILIKE '%$detcontacto%')"
                            ), '>', '0' ]
                        );
                    }
                }
            }

            $proveedor = DB::connection($connection)
                ->table('proveedor as prov')
                ->leftJoin('ciudad as ciu', 'prov.fkidciudad', '=', 'ciu.idciudad')
                ->select( $select )
                ->where( $consulta )
                ->whereNull('ciu.deleted_at')
                ->whereNull('prov.deleted_at')
                ->orderBy('prov.idproveedor')
                ->get();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.compra.proveedor', [
                'usuario' => $usuario,
                'fecha' => $fecha,
                'hora' => $hora,
                'proveedor' => $proveedor,
                'referenciacontacto' => $referenciacontacto,
                'codigospropios' => $config_cliente->codigospropios,
                'logo' => $config_cliente->logoreporte,
            ]);

            //$pdf->setPaper('A4', 'landscape');

            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(40, 820, $usuario, null, 8, array(0, 0, 0));
            
            $canvas->page_text(450, 820, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            if ($exportar == 'P') { 
                return $pdf->download('proveedor.pdf');
            }

            return $pdf->stream('proveedor.pdf');
            
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function htmlcompra($compra, $codigospropios, $logo, $fecha, $hora) {

        $html = '';
        $html .= '<div style="width: 100%; height: 30px;">';
        $html .=    '<div style="float: left;">';
        $html .=        '<img src="'.$logo.'" alt="none"  style="width: 90px; height: 40px; display: block; margin-top: -15px;" />';
        $html .=    '</div>';
        $html .=    '<div style="float: right; display: block; width: 40px; margin-top: -15px; text-align: center;">';
        $html .=        '<div style="font-size: 10px;">'.$fecha.'</div>';
        $html .=        '<div style="font-size: 10px;">'.$hora.'</div>';
        $html .=    '</div>';
        $html .= '</div>';

        $html .= '<div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 10px; border-bottom: 1px dashed black;">
                    <label style="font-size: 15px; font-weight: bold;">
                        ** REPORTE DE COMPRAS DETALLADA **
                    </label>
                </div>';

        $html .= '<div style="width: 100%; min-width: 100%; max-width: 100%;">';
            $subtotal = 0;
            $total= 0;

            foreach ($compra as $key => $value) {
                if ($key == 0) {}
            }

        $html .= '</div>';

        return $html;
    }
}
