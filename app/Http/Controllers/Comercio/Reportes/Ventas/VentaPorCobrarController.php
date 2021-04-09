<?php

namespace App\Http\Controllers\Comercio\Reportes\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\Ventas\VentaPorCobrarExport;
use App\Models\Config\ConfigCliente;
use PDF;
use DB;

class VentaPorCobrarController extends Controller
{
    public function index() {
        return response()->json([
            'data' => 5
        ]);
    }

    public function generar(Request $request) {

        try {
            
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fechainicioVenta = $request->fechainicioVenta;
            $fechafinventa = $request->fechafinventa;
            $fechainiciocuota = $request->fechainiciocuota;
            $fechafincuota = $request->fechafincuota;
            $cliente = $request->cliente;
            $vendedor = $request->vendedor;
            $opcion = $request->opcion;
            $montoinicial = $request->montoinicial;
            $montofinal = $request->montofinal;
            $ordenar = $request->ordenar;
            $exportar = $request->exportar;
    
            $order = '';
    
            if ($ordenar == 1) {
                $order = 'v.idventa';
            }
            if ($ordenar == 2) {
                $order = 'v.fecha';
            }
            if ($ordenar == 3) {
                $order = 'cliente';
            }
            if ($ordenar == 4) {
                $order = 'vendedor';
            }
            if ($ordenar == 5) {
                $order = 'vpdp.fechaapagar';
            }
            if ($ordenar == 6) {
                $order = 'vpdp.montoapagar';
            }
    
            $consulta = [];
            $bandera = 0;
    
            if ($fechainicioVenta != '') {
                if ($fechafinventa == '') {
                    array_push($consulta, ['v.fecha', '>=', $fechainicioVenta]);
                    $bandera = 1;
                }else {
                    array_push($consulta, ['v.fecha', '>=', $fechainicioVenta]);
                    array_push($consulta, ['v.fecha', '<=', $fechafinventa]);
                    $bandera = 1;
                }
            }
            if ($fechainiciocuota != '') {
                if ($fechafincuota == '') {
                    array_push($consulta, ['vpdp.fechaapagar', '>=', $fechainiciocuota]);
                    $bandera = 1;
                }else {
                    array_push($consulta, ['vpdp.fechaapagar', '>=', $fechainiciocuota]);
                    array_push($consulta, ['vpdp.fechaapagar', '<=', $fechafincuota]);
                    $bandera = 1;
                }
            }
            if ($opcion != '') {
                if ($opcion != '!') {
                    if ($montoinicial != '') {
                        array_push($consulta, ['vpdp.montoapagar', $opcion, $montoinicial]);
                        $bandera = 1;
                    }
                }else {
                    if (($montoinicial != '') and ($montofinal >= $montoinicial)) {
                        array_push($consulta, ['vpdp.montoapagar', '>=', $montoinicial]);
                        array_push($consulta, ['vpdp.montoapagar', '<=', $montofinal]);
                        $bandera = 1;
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
                array_push($consulta, ['vpdp.estado', '=', 'I']);
            }
    
            $venta = DB::connection($connection)
                        ->table('venta as v')
                        ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                        ->join('vendedor as ve', 'v.fkidvendedor', '=', 've.idvendedor')
                        ->join('ventaplandepago as vpdp', 'v.idventa', '=', 'vpdp.fkidventa')
                        ->select('v.idventa', 'v.fecha', 
                            DB::raw("CONCAT(c.nombre, ' ', c.apellido) AS cliente"),
                            DB::raw("CONCAT(ve.nombre, ' ', ve.apellido) AS vendedor"), 
                            'vpdp.descripcion', 'vpdp.fechaapagar', 'vpdp.montoapagar')
                        ->where(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$cliente.'%')
                        ->where(DB::raw("CONCAT(ve.nombre, ' ',ve.apellido)"), 'ilike', '%'.$vendedor.'%')
                        ->where(
                            ($bandera == 1)?
                                $consulta:
                                [['vpdp.estado', '=', 'I']]
                            )
                        ->where('v.fkidtipotransacventa', '=', '1')
                        ->whereNull('v.deleted_at')
                        ->groupBy('v.idventa', 'v.fecha', 'cliente', 'vendedor', 
                                'vpdp.descripcion', 'vpdp.fechaapagar', 'vpdp.montoapagar')
                        ->orderBy($order, 'asc')
                        ->get();
    
            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $user = $request->usuario;
            /**config cliente */
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $resp = $conf->orderBy('idconfigcliente', 'asc')->first();
            
            $config2 = $conf->first();
            $config2->decrypt();
            $configTitleVend = 'Vendedor';
    
            if ($resp != null) {
                $resp->decrypt();    
                $configTitleVend = $resp->clienteesabogado ? 'Abogado' : 'Vendedor';
            }
            /** end config cliente */
            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.ventaporcobrar', [
                'fecha' => $fecha,
                'venta' => $venta,
                'hora' => $hora,
                'titleVendedor' => $configTitleVend,
                'logo' => $config2->logoreporte
            ]);
    
            //$pdf->setPaper('A4', 'landscape');
            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            $canvas = $dom_pdf ->get_canvas();
            $canvas->page_text(450, 825, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));
            $canvas->page_text(50, 825, $user, null, 8, array(0, 0, 0));
    
            if ($exportar == 1) {
                return $pdf->stream('ventaporcobrar.pdf');
            }
            if ($exportar == 2) {
                return $pdf->download('ventaporcobrar.pdf');
            }
        
            return  Excel::download(new VentaPorCobrarExport($venta), 'ventaporcobrar.xlsx');
            
        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }
}
