<?php

namespace App\Http\Controllers\Comercio\Reportes\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\Ventas\VentaPorCobrarExport;
use App\Models\Config\ConfigCliente;
use App\Models\Comercio\Ventas\Cobro;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use PDF;
use Illuminate\Support\Facades\DB;

class VentaPorCobrosController extends Controller
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
                array_push($consulta, ['vpdp.estado', '=', 'P']);
            }

            $venta = DB::connection($connection)
                ->table('venta as v')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->join('vendedor as ve', 'v.fkidvendedor', '=', 've.idvendedor')
                ->join('ventaplandepago as vpdp', 'v.idventa', '=', 'vpdp.fkidventa')
                ->join('cobroplanpagodetalle as cppd', 'vpdp.idventaplandepago', '=', 'cppd.fkidventaplandepago')
                ->join('cobro as co', 'cppd.fkidcobro', '=', 'co.idcobro')
                ->select('v.idventa', 'v.fecha', 
                    DB::raw("CONCAT(c.nombre, ' ', c.apellido) AS cliente"),
                    DB::raw("CONCAT(ve.nombre, ' ', ve.apellido) AS vendedor"), 
                    'vpdp.descripcion', 'vpdp.fechaapagar', 'vpdp.montoapagar',
                    'co.idcobro', 'co.fecha as fechacobro', 'cppd.montocobrado')
                ->where(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$cliente.'%')
                ->where(DB::raw("CONCAT(ve.nombre, ' ',ve.apellido)"), 'ilike', '%'.$vendedor.'%')
                ->where(
                    ($bandera == 1)?
                        $consulta:
                        [['vpdp.estado', '=', 'P']]
                    )
                ->where('v.fkidtipotransacventa', '=', '1')
                ->whereNull('v.deleted_at')
                ->whereNull('c.deleted_at')
                ->whereNull('cppd.deleted_at')
                ->groupBy('v.idventa', 'v.fecha', 'cliente', 'vendedor', 
                        'vpdp.descripcion', 'vpdp.fechaapagar', 'vpdp.montoapagar',
                        'co.idcobro', 'fechacobro', 'cppd.montocobrado')
                ->orderBy($order, 'asc')
                ->get();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $user = $request->usuario;
            /**config cliente */
            $confcli = new ConfigCliente();
            $confcli->setConnection($connection);
            $resp = $confcli->first();
            $resp->decrypt();

            $configTitleVend = 'Vendedor';
                
            $configTitleVend = $resp->clienteesabogado ? 'Abogado' : 'Vendedor';

            /** end config cliente */
            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.ventaporcobros', [
                'fecha' => $fecha,
                'venta' => $venta,
                'hora' => $hora,
                'titleVendedor' => $configTitleVend,
                'logo' => $resp->logoreporte
            ]);

            $pdf->setPaper('A4', 'landscape');
            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            $canvas = $dom_pdf ->get_canvas();
            $canvas->page_text(750, 570, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));
            $canvas->page_text(50, 570, $user, null, 8, array(0, 0, 0));

            if ($exportar == 1) {
                return $pdf->stream('ventaporcobros.pdf');
            }
            if ($exportar == 2) {
                return $pdf->download('ventaporcobros.pdf');
            }
            
            return  Excel::download(new VentaPorCobrarExport($venta), 'ventaporcobrar.xlsx');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }

    public function recibo(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $user = $request->usuario;
            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $cobro = DB::connection($connection)
                ->table('cobro as c')
                ->join('cobroplanpagodetalle as cppd', 'c.idcobro', '=', 'cppd.fkidcobro')
                ->join('ventaplandepago as vpp', 'cppd.fkidventaplandepago', '=', 'vpp.idventaplandepago')
                ->join('venta as v', 'vpp.fkidventa', '=', 'v.idventa')
                ->join('moneda as mon', 'v.fkidmoneda', '=', 'mon.idmoneda')
                ->join('cliente as cl', 'v.fkidcliente', '=', 'cl.idcliente')
                ->select('c.idcobro', 'c.fecha', 
                    DB::raw('SUM(cppd.montocobrado) as pago'),
                    DB::raw("CONCAT(cl.nombre, ' ',cl.apellido) as cliente"),
                    'v.mtototventa', 'v.mtototcobrado', 'mon.descripcion as moneda'
                )
                ->where('c.idcobro', '=', $id)
                ->whereNull('v.deleted_at')
                ->whereNull('c.deleted_at')
                ->whereNull('cppd.deleted_at')
                ->groupBy('c.idcobro', 'c.fecha', 'cliente', 'v.mtototventa', 'v.mtototcobrado', 'moneda')
                ->first();
            
            $concepto = DB::connection($connection)
                ->table('ventaplandepago as v')
                ->join('cobroplanpagodetalle as c', 'v.idventaplandepago', '=', 'c.fkidventaplandepago')
                ->select('v.fkidventa', 'v.descripcion')
                ->whereNull('v.deleted_at')
                ->whereNull('c.deleted_at')
                ->where('c.fkidcobro', '=', $id)
                ->get();
            
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.recibocobro', [
                'cobro' => $cobro,
                'concepto' => $concepto,
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'monto' => $this->convertir($cobro->pago),
                'logo' => $config->logoreporte
            ]);

            return $pdf->stream('recibocobro.pdf');
        } catch (\Throwable $th) {
            return "Error al generar reporte";
        }
        
    }

    function convertir($n) {
        switch (true) {
            case ( $n >= 1 && $n <= 29) : return $this->basico($n); break;
            case ( $n >= 30 && $n < 100) : return $this->decenas($n); break;
            case ( $n >= 100 && $n < 1000) : return $this->centenas($n); break;
            case ($n >= 1000 && $n <= 999999): return $this->miles($n); break;
            case ($n >= 1000000): return $this->millones($n);
        }
    }

    function basico($numero) {
        $valor = array ('uno','dos','tres','cuatro','cinco','seis','siete','ocho',
            'nueve','diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'decisiete ', 
            'dieciocho', 'diecinueve', 'veinte', 'veintiun', 'veintidos', 'veintitres',
            'veinticuatro','veinticinco',
            'veintiséis','veintisiete','veintiocho','veintinueve');
        
        return $valor[$numero - 1];
    }
    function decenas($n) {
        $decenas = array (30=>'treinta',40=>'cuarenta',50=>'cincuenta',60=>'sesenta',
            70=>'setenta',80=>'ochenta',90=>'noventa');
        
        if( $n <= 29) 
            return $this->basico($n);

        $x = $n % 10;

        if ( $x == 0 ) {
            return $decenas[$n];
        } 
        return $decenas[$n - $x].' y '. $this->basico($x);
    }

    function centenas($n) {
        $cientos = array (100 =>'cien',200 =>'doscientos',300=>'trecientos',
            400=>'cuatrocientos', 500=>'quinientos',600=>'seiscientos',
            700=>'setecientos',800=>'ochocientos', 900 =>'novecientos');

        if( $n >= 100) {
            if ( $n % 100 == 0 ) {
                return $cientos[$n];
            }

            $u = (int) substr($n,0,1);
            $d = (int) substr($n,1,2);
            return (($u == 1)?'ciento':$cientos[$u*100]).' '.$this->decenas($d);
        
        }
        return $this->decenas($n);
    }

    function miles($n) {
        if($n > 999) {
            if( $n == 1000) {
                return 'mil';
            }
            else {
                $l = strlen($n);
                $c = (int)substr($n,0, $l-3);
                $x = (int)substr($n, -3);
                if($c == 1) {
                    $cadena = 'mil '.$this->centenas($x);
                }
                else if($x != 0) {
                    $cadena = $this->centenas($c).' mil '.$this->centenas($x);
                }
                else 
                    $cadena = $this->centenas($c). ' mil';
                return $cadena;
            }
        } 
        return $this->centenas($n);
    }
    
    function millones($n) {
        if($n == 1000000) {
            return 'un millón';
        }
        else {
            $l = strlen($n);
            $c = (int)substr($n,0,$l-6);
            $x = (int)substr($n,-6);
            if($c == 1) {
                $cadena = ' millón ';
            } else {
                $cadena = ' millones ';
            }
            return $this->miles($c).$cadena.(($x > 0)?$this->miles($x):'');
        }
    }
}
