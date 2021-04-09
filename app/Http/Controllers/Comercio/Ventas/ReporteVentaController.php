<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use PDF;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\Ventas\VentaExport;
use App\Models\Config\ConfigCliente;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

class ReporteVentaController extends Controller
{
    public function generar(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $tipoVenta = $request->tipoVenta;
            $fechaInicio = $request->fechaInicio;
            $fechaFinal = $request->fechaFinal;

            $sucursal = $request->sucursal;
            $almacen = $request->almacen;
            $moneda = $request->moneda;

            $cliente = $request->cliente;
            $vendedor = $request->vendedor;

            $operacionMontoTotal = $request->operacionMontoTotal;
            $montoTotal = $request->montoTotal;
            $montoTotalFin = $request->montoTotalFin;

            $operacionMontoCobrado = $request->operacionMontoTotalCobrado;
            $montoCobrado = $request->montoTotalCobrado;
            $montoCobradoFin = $request->montoTotalCobradoHasta;

            $operacionMontoPorCobrar = $request->operacionMontoTotalPorCobrar;
            $montoPorCobrar = $request->montoTotalPorCobrar;
            $montoPorCobrarFin = $request->montoTotalPorCobrarHasta;

            $arrayObjeto = [];

            if ($fechaInicio != '') {
                $count = DB::connection($connection)
                            ->table('venta')
                            ->where('fecha', '>=', $fechaInicio)
                            ->whereNull('deleted_at')
                            ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Fecha venta desde: ';
                    $objeto->value = date("d/m/Y", strtotime($fechaInicio));
                    array_push($arrayObjeto, $objeto);
                }
            }

            if (($fechaInicio != '') and ($fechaFinal != '')) {
                $count = DB::connection($connection)
                            ->table('venta')
                            ->where('fecha', '>=', $fechaInicio)
                            ->where('fecha', '<=', $fechaFinal)
                            ->whereNull('deleted_at')
                            ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Fecha venta hasta: ';
                    $objeto->value = date("d/m/Y", strtotime($fechaFinal));
                    array_push($arrayObjeto, $objeto);
                }
            }    

            if (($montoTotal != '') and ($operacionMontoTotal != '!')) {
                $count = DB::connection($connection)
                            ->table('venta')
                            ->where('mtototventa', $operacionMontoTotal, $montoTotal)
                            ->whereNull('deleted_at')
                            ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'MontoTotal: ';
                    $objeto->value = $operacionMontoTotal;
                    array_push($arrayObjeto, $objeto);

                    $objeto = new \stdClass();
                    $objeto->title = '';
                    $objeto->value = $montoTotal;
                    array_push($arrayObjeto, $objeto);
                }
            }else {
                if (($montoTotal != '') and ($montoTotalFin != '') and ($operacionMontoTotal == '!')) {
                    $count = DB::connection($connection)
                                ->table('venta')
                                ->where('mtototventa', '>=', $montoTotal)
                                ->where('mtototventa', '<=', $montoTotalFin)
                                ->whereNull('deleted_at')
                                ->get();

                    if (sizeof($count) > 0) {
                        $objeto = new \stdClass();
                        $objeto->title = 'MontoTotal desde: ';
                        $objeto->value = $montoTotal;
                        array_push($arrayObjeto, $objeto);
        
                        $objeto = new \stdClass();
                        $objeto->title = 'MontoTotal hasta: ';
                        $objeto->value = $montoTotalFin;
                        array_push($arrayObjeto, $objeto);
                    }
                }
            }

            $orden = $request->order;
            $reporte = $request->reporte;

            $order = '';
            
            if ($orden == '1') {
                $order = 'v.idventa';
            }
            if ($orden == '2') {
                $order = 'v.fecha';
            }
            if ($orden == '3') {
                $order = 'c.nombre';
            }
            if ($orden == '4') {
                $order = 've.nombre';
            }
            if ($orden == '5') {
                $order = 'v.estadoproceso';
            }
            if ($orden == '6') {
                $order = 'v.mtototventa';
            }
            if ($orden == '7') {
                $order = 'v.mtototcobrado';
            }

            $consulta = [];
            $bandera = 0;

            if ($tipoVenta != '') {
                array_push($consulta, ['v.fkidtipocontacredito', '=', $tipoVenta]);
                $bandera = 1;
            }
            if ($id != '') {
                array_push($consulta, ['v.idventa', '=', $id]);
                $bandera = 1;
            }
            if ($sucursal != '') {
                array_push($consulta, ['s.idsucursal', '=', $sucursal]);
                $bandera = 1;
            }
            if ($almacen != '') {
                array_push($consulta, ['a.idalmacen', '=', $almacen]);
                $bandera = 1;
            }
            if ($moneda != '') {
                array_push($consulta, ['p.fkidmoneda', '=', $moneda]);
                $bandera = 1;
            }
            if ($fechaInicio != '') {
                if ($fechaFinal == '') {
                    array_push($consulta, ['v.fecha', '>=', $fechaInicio]);
                    $bandera = 1;
                }else {
                    array_push($consulta, ['v.fecha', '>=', $fechaInicio]);
                    array_push($consulta, ['v.fecha', '<=', $fechaFinal]);
                    $bandera = 1;
                }
            }
            if ($operacionMontoTotal != '') {
                if ($operacionMontoTotal != '!') {
                    if ($montoTotal != '') {
                        array_push($consulta, ['v.mtototventa', $operacionMontoTotal, $montoTotal]);
                        $bandera = 1;
                    }
                }else {
                    if (($montoTotal != '') and ($montoTotalFin >= $montoTotal)) {
                        array_push($consulta, ['v.mtototventa', '>=', $montoTotal]);
                        array_push($consulta, ['v.mtototventa', '<=', $montoTotalFin]);
                        $bandera = 1;
                    }
                }
            }
            $cadena = 'v.fkidtipotransacventa = 1';
            if ($operacionMontoPorCobrar != '') {
                if ($operacionMontoPorCobrar != '!') {
                    if ($montoPorCobrar != '') {
                        $cadena = $cadena.' and (v.mtototventa - v.mtototcobrado) '.$operacionMontoPorCobrar.' '.$montoPorCobrar;
                        $cadena = $cadena.' and v.fkidtipocontacredito = 2';
                    }
                }else {
                    if (($montoPorCobrar != '') and ($montoPorCobrarFin >= $montoPorCobrar)) {
                        $cadena = $cadena.' and (v.mtototventa - v.mtototcobrado) >= '.$montoPorCobrar;
                        $cadena = $cadena.' and (v.mtototventa - v.mtototcobrado) <= '.$montoPorCobrarFin;
                        $cadena = $cadena.' and v.fkidtipocontacredito = 2';
                    }
                }
            }
            if ($operacionMontoCobrado != '') {
                if ($operacionMontoCobrado != '!') {
                    if ($montoCobrado != '') {
                        $cadena = $cadena.' and (v.mtototventa - v.mtototcobrado) '.$operacionMontoCobrado.' '.$montoCobrado;
                    }
                }else {
                    if (($montoCobrado != '') and ($montoCobradoFin >= $montoCobrado)) {
                        $cadena = $cadena.' and (v.mtototventa - v.mtototcobrado) >= '.$montoCobrado;
                        $cadena = $cadena.' and (v.mtototventa - v.mtototcobrado) <= '.$montoCobradoFin;
                    }
                }
            }
            $fkidgrupo = $request->fkidgrupo;
            $idusuario = $request->idusuario;

            if ($fkidgrupo == 0 || $fkidgrupo == 3) {
                array_push($consulta, ['ve.fkidusuario', '=', $idusuario]);
                $bandera = 1;
            }

            if ($bandera == 1) {
                array_push($consulta, ['v.fkidtipotransacventa', '=', '1']);
            }


            $venta = DB::connection($connection)->table('venta as v')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->join('vendedor as ve', 'v.fkidvendedor', '=', 've.idvendedor')
                ->join('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                ->join('almacenproddetalle as apd', 'vd.fkidalmacenproddetalle', '=', 'apd.idalmacenproddetalle')
                ->join('almacen as a', 'apd.fkidalmacen', '=', 'a.idalmacen')
                ->join('producto as p', 'apd.fkidproducto', '=', 'p.idproducto')
                ->join('sucursal as s', 'a.fkidsucursal', '=', 's.idsucursal')
                ->select('v.idventa', 'v.fecha', 'v.fkidtipocontacredito',
                    DB::raw("CONCAT(c.nombre, ' ', c.apellido) AS cliente"), 'v.estadoproceso',
                    DB::raw("CONCAT(ve.nombre, ' ', ve.apellido) AS vendedor"), 
                    'v.mtototventa as total', 'v.mtototcobrado')
                ->where(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$cliente.'%')
                ->where(DB::raw("CONCAT(ve.nombre, ' ',ve.apellido)"), 'ilike', '%'.$vendedor.'%')
                ->where(($bandera == 1)?$consulta:[['v.fkidtipotransacventa', '=', '1']])
                ->whereRaw($cadena)
                ->whereNull('v.deleted_at')
                ->groupBy('v.idventa', 'v.fecha', 'cliente', 'v.estadoproceso', 
                    'vendedor', 'v.mtototcobrado', 'v.fkidtipocontacredito')
                ->orderBy($order, 'asc')
                ->get();
            
            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $user = $request->usuario;
            
            /**configs */
            $confgcli = new ConfigCliente();
            $confgcli->setConnection($connection);
            $resp = $confgcli->first();

            $configTitleVend = 'Vendedor';
            if ($resp != null) {
                $resp->decrypt();
                $configTitleVend = $resp->clienteesabogado ? 'Abogado' : 'Vendedor';
            }
            /** end configs */
            //$conf2 = $confgcli->first();
            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.venta', [
                'fecha' => $fecha,
                'venta' => $venta,
                'hora' => $hora,
                'titleVendedor' => $configTitleVend,
                'objeto' => $arrayObjeto,
                'esabogado' => $request->esabogado,
                'logo' => $resp->logoreporte,
                'comventasventaalcredito' => $request->comventasventaalcredito,
            ]);
            
            $pdf->setPaper('A4', 'landscape');
            
            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf ->get_canvas();
            $canvas->page_text(750, 570, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));
            
            $canvas->page_text(50, 570, $user, null, 8, array(0, 0, 0));
            
            if ($reporte == 'N') {
                return $pdf->stream('venta.pdf');
            }
            
            if ($reporte == 'P') { 
                return $pdf->download('venta.pdf');
            }
            
            if ($reporte == 'E') { 

                $comventasventaalcredito = $request->comventasventaalcredito;

                return  Excel::download(new VentaExport($venta, $comventasventaalcredito), 'venta.xlsx');
            }
        } catch (DecryptException $e) {
            return "Error no se pudo generar el reporte";
        }
        
    }
}
