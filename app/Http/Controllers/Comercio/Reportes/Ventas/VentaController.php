<?php

namespace App\Http\Controllers\Comercio\Reportes\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use App\Models\Config\ConfigCliente;
use App\Models\Comercio\Ventas\CobroPlanPagoDet;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\Ventas\ComisionVendedorExport;
use App\Models\Comercio\Ventas\Venta;
use App\Models\Config\ConfigFabrica;
use App\Models\Configuracion\Dosificacion;
use App\Models\Facturacion\Factura;
use Illuminate\Support\Facades\DB;
use PDF;

class VentaController extends Controller
{
    public function get_producto(Request $request) {
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

            $producto = DB::connection($connection)
                ->table('producto')
                ->whereNull('deleted_at')
                ->orderBy('idproducto', 'desc')
                ->get()->take(20);

            $obj = new ConfigFabrica();
            $obj->setConnection($connection);
            $confi = $obj->first();
            $confi = $confi->decrypt();

            $array =  [];

            $confi = array_push($array, $confi);

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configcliente = $obj->first();
            $configcliente->decrypt();
            
            return response()->json([
                'response' => 1, 
                'moneda' => $moneda, 
                // 'vehiculoTipo' => 4,
                'almacen' => $almacen,
                'sucursal' => $sucursal,
                'tipo' => $tipo,
                'configuracion' => $confi,
                'configcliente' => $configcliente,
                'producto' => $producto,
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function get_codigo_producto(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $codigo = $request->codigo;
            $codigospropios = $request->codigospropios;

            if ($codigospropios == true) {

                $producto = DB::connection($connection)
                    ->table('producto')
                    ->where('codproducto', 'ilike', '%'.$codigo.'%')
                    ->whereNull('deleted_at')
                    ->orderBy('idproducto', 'asc')
                    ->paginate(15);
            }else {
                if ($codigo == '') {
                    $producto = DB::connection($connection)
                        ->table('producto')
                        ->whereNull('deleted_at')
                        ->orderBy('idproducto', 'asc')
                        ->paginate(15);
                }else {
                    $producto = DB::connection($connection)
                        ->table('producto')
                        ->where('idproducto', '=', $codigo)
                        ->whereNull('deleted_at')
                        ->orderBy('idproducto', 'asc')
                        ->paginate(15);
                }
            }

            return [
                'response'=> 1, 
                'data' => $producto,
            ];
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo concretar la busquedad',
                'data' => []
            ]);
        }
    }

    public function get_descripcion_producto(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $descripcion = $request->producto;

            $producto = DB::connection($connection)
                ->table('producto')
                ->where('descripcion', 'ilike', '%'.$descripcion.'%')
                ->whereNull('deleted_at')
                ->orderBy('idproducto', 'asc')
                ->paginate(15);

            return [
                'response'=> 1, 
                'data' => $producto,
            ];
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo concretar la busquedad',
                'data' => []
            ]);
        }
    }

    public function recibo(Request $request)
    {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $user = $request->usuario;

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $permisos = json_decode($request->permisos);

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.reciboventa', [
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'venta' => json_decode($request->venta_first),
                'detalle' => json_decode($request->venta_detalle),
                'pago' => json_decode($request->planpago),
                'permisos' => $permisos,
                //'logo' => json_decode($request->config_cliente)->logoreporte,
                'logo' => json_decode($request->config_cliente)->logoreporte,
                'clienteesabogado' => $request->clienteesabogado,
            ]);

            return $pdf->stream('reciboventa.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }

    public function factura(Request $request)
    {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $user = $request->usuario;

            $idventa = $request->idventa;

            $factura = DB::connection($connection)
                ->table('factura')
                ->where('fkidventa', '=', $idventa)
                ->first();

            $dosificacion = DB::connection($connection)
                ->table('facdosificacion as dos')
                ->leftJoin('sucursal as s', 'dos.fkidsucursal', '=', 's.idsucursal')
                ->leftJoin('facactividadeconomica as activ', 'dos.fkidfacactividadeconomica', '=', 'activ.idfacactividadeconomica')
                ->leftJoin('ciudad as p', 's.fkidpais', '=', 'p.idciudad')
                ->leftJoin('ciudad as c', 's.fkidciudad', '=', 'c.idciudad')
                ->select('dos.nit', 'dos.numeroautorizacion', 'dos.fechalimiteemision', 'dos.leyenda1piefactura', 
                    'dos.leyenda2piefactura', 'activ.descripcion', 's.nombrecomercial', 's.razonsocial', 's.nit', 's.zona',
                    's.tiposucursal', 's.telefono', 'p.descripcion as pais', 'c.descripcion as ciudad', 's.direccion',
                    'dos.tipofactura'
                )
                ->where('dos.estado', '=', 'A')
                ->whereNull('dos.deleted_at')
                ->whereNull('s.deleted_at')
                ->whereNull('activ.deleted_at')
                ->orderBy('dos.idfacdosificacion', 'asc')
                ->first();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $permisos = json_decode($request->permisos);

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $dir = 'facturaventa';

            if ( $dosificacion->tipofactura == 'R' ) {
                $dir = 'facturaventa_rollo';
            }

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.' . $dir, [
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'venta' => json_decode($request->venta_first),
                'detalle' => json_decode($request->venta_detalle),
                'pago' => json_decode($request->planpago),
                'permisos' => $permisos,
                'logo' => $config->logoreporte,
                //'logo' => json_decode($request->config_cliente)->logoreporte,
                'clienteesabogado' => $request->clienteesabogado,
                'factura' => $factura,
                'dosificacion' => $dosificacion,
                'monto' => $this->convertir(intval(json_decode($request->venta_first)->total)),
            ]);

            if ( $dosificacion->tipofactura == 'R' ) {
                $pdf->setPaper( array(0, 0, 160, ( sizeof( json_decode($request->venta_detalle) ) * 20 + 290 ) ) );
            }

            return $pdf->stream('facturaventa.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }

    public function comision(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $user = $request->usuario;
            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $fechaInicio = $request->fechainicio;
            $fechaFinal = $request->fechafinal;

            $cliente = $request->cliente;
            $vendedor = $request->vendedor;

            $codorid = $request->codorid;

            $idvendedor = $request->idvendedor;
            $idcliente = $request->idcliente;

            $consulta = [];
            $bandera = 0;

            if ($codorid == '1') {
                if ($idvendedor != '') {
                    array_push($consulta, ['ve.codvendedor', 'ilike', '%'.$idvendedor.'%']);
                    $bandera = 1;
                }
                if ($idcliente != '') {
                    array_push($consulta, ['c.codcliente', 'ilike', '%'.$idcliente.'%']);
                    $bandera = 1;
                }
            }else {
                if ($idvendedor != '') {
                    array_push($consulta, ['ve.idvendedor', '=', $idvendedor]);
                    $bandera = 1;
                }
                if ($idcliente != '') {
                    array_push($consulta, ['c.idcliente', '=', $idcliente]);
                    $bandera = 1;
                }
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

            $fkidgrupo = $request->fkidgrupo;
            $idusuario = $request->idusuario;
            
            if ($fkidgrupo == 0 || $fkidgrupo == 3) {
                array_push($consulta, ['ve.fkidusuario', '=', $idusuario]);
                $bandera = 1;
            }
    
            if ($bandera == 1) {
                array_push($consulta, ['v.fkidtipotransacventa', '=', '1']);
            }

            $orden = $request->order;
    
            $order = '';
            if ($orden == '1') {
                $order = 've.idvendedor';
            }
            if ($orden == '2') {
                $order = 've.codvendedor';
            }
            if ($orden == '3') {
                $order = 've.nombre';
            }
            if ($orden == '4') {
                $order = 'c.nombre';
            }
            if ($orden == '5') {
                $order = 'v.mtototventa';
            }

            $comision = DB::connection($connection)
                ->table('vendedor as ve')
                ->join('venta as v', 've.idvendedor', '=', 'v.fkidvendedor')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->select('ve.idvendedor', 'v.idventa', 'v.fecha',
                    DB::raw("CONCAT(ve.nombre, ' ',ve.apellido) as vendedor"),
                    DB::raw("CONCAT(c.nombre, ' ',c.apellido) as cliente"), 
                    'v.tomarcomisionvendedor as comision', 'v.mtototventa as total', 
                    'v.mtototcobrado as cobrado', 'v.fkidtipocontacredito as tipo',
                    DB::raw("COUNT(ve.idvendedor) as cantidad")
                )
                ->where(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$cliente.'%')
                ->where(DB::raw("CONCAT(ve.nombre, ' ',ve.apellido)"), 'ilike', '%'.$vendedor.'%')
                ->where(
                    ($bandera == 1)?
                        $consulta:
                        [['v.fkidtipotransacventa', '=', '1']]
                    )
                ->whereNull('ve.deleted_at')
                ->whereNull('v.deleted_at')
                ->whereNull('c.deleted_at')
                ->orderBy($order)
                ->groupBy('ve.idvendedor', 'v.idventa', 'v.fecha', 'vendedor', 
                    'cliente', 'comision', 'total', 'cobrado', 'tipo', 'c.nombre',
                    've.codvendedor', 've.nombre'
                )
                ->get();
            
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();
            
            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.comisionventa', [
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'comision' => $comision,
                'logo' => $config->logoreporte,
                'idgrupo' => $fkidgrupo,
                'cliente_abogado' => $request->cliente_abogado,
            ]);

            $pdf->setPaper('A4', 'landscape');
            
            $pdf->output();

            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf ->get_canvas();
            $canvas->page_text(750, 550, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));
            
            $canvas->page_text(50, 550, $user, null, 8, array(0, 0, 0));

            $reporte = $request->reporte;

            if ($reporte == 'P') {
                return $pdf->download('comision_por_vendedor.pdf');
            }

            if ($reporte == 'E') { 
                return Excel::download(new ComisionVendedorExport($comision), 'comision_por_vendedor.xlsx');
            }

            return $pdf->stream('comision_por_vendedor.pdf');
            
        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
    }

    public function venta_por_producto(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $user = $request->usuario;

            $cliente = $request->cliente;
            $vendedor = $request->vendedor;
            $fechainicio = $request->fechainicio;
            $fechafinal = $request->fechafinal;
            $tipoventa = $request->tipoventa;
            $sucursal = $request->sucursal;
            $almacen = $request->almacen;
            $moneda = $request->moneda;
            $idproducto = $request->idproducto;

            $consulta = [];
            $bandera = 0;

            if ($fechainicio != '') {
                if ($fechafinal == '') {
                    array_push($consulta, ['v.fecha', '>=', $fechainicio]);
                    $bandera = 1;
                }else {
                    array_push($consulta, ['v.fecha', '>=', $fechainicio]);
                    array_push($consulta, ['v.fecha', '<=', $fechafinal]);
                    $bandera = 1;
                }
            }
            if ($tipoventa != '') {
                array_push($consulta, ['v.fkidtipocontacredito', '=', $tipoventa]);
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

            array_push($consulta, ['v.fkidtipotransacventa', '=', '1']);
            array_push($consulta, ['p.idproducto', '=', $idproducto]);

            $producto = '';

            if ($idproducto != '') {
                $producto = DB::connection($connection)
                    ->table('producto')
                    ->where('idproducto', '=', $idproducto)
                    ->first();
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
                $order = 'v.fkidtipocontacredito';
            }

            $venta = DB::connection($connection)
                ->table('venta as v')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->join('vendedor as ve', 'v.fkidvendedor', '=', 've.idvendedor')
                ->join('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                ->join('almacenproddetalle as apd', 'vd.fkidalmacenproddetalle', '=', 'apd.idalmacenproddetalle')
                ->join('almacen as a', 'apd.fkidalmacen', '=', 'a.idalmacen')
                ->join('producto as p', 'apd.fkidproducto', '=', 'p.idproducto')
                ->join('sucursal as s', 'a.fkidsucursal', '=', 's.idsucursal')
                ->join('tipocontacredito as tcc', 'v.fkidtipocontacredito', '=', 'tcc.idtipocontacredito')
                ->select('v.idventa', 'v.fecha', 'tcc.descripcion as tipo', 
                    'p.idproducto', 'p.descripcion as producto', 'vd.cantidad', 'vd.preciounit as precio',
                    'vd.factor_desc_incre as descuento'
                )
                ->where(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$cliente.'%')
                ->where(DB::raw("CONCAT(ve.nombre, ' ',ve.apellido)"), 'ilike', '%'.$vendedor.'%')
                ->where($consulta)
                ->whereNull('v.deleted_at')
                ->orderBy($order, 'asc')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.ventaporproducto', [
                'venta' => $venta,
                'logo' => $config->logoreporte,
                'fecha' => $fecha,
                'hora' => $hora,
                'producto' => $producto,
            ]);

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf ->get_canvas();
            $canvas->page_text(50, 825, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));
            $canvas->page_text(450, 825, $user, null, 8, array(0, 0, 0));

            if ($reporte == 'P') { 
                return $pdf->download('venta_por_producto.pdf');
            }

            return $pdf->stream('venta_por_producto.pdf');
            
            
        } catch (DecryptException $e) {
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
                    $cadena = 'un mil '.$this->centenas($x);
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

    public function libroventagenerar(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fechainicio = $request->input('fechainicio');
            $fechafinal = $request->input('fechafinal');
            $ordenar = $request->input('ordenar');
            $exportar = $request->input('exportar');

            $order = "";
            if ( $ordenar == 1 ) $order = "libroventa.idfaclibroventa";
            if ( $ordenar == 2 ) $order = "libroventa.fechafactura";
            if ( $ordenar == 3 ) $order = "libroventa.nitcliente";
            if ( $ordenar == 4 ) $order = "libroventa.nombrerazonsocial";
            if ( $ordenar == 5 ) $order = "libroventa.nroautorizacion";
            if ( $ordenar == 6 ) $order = "libroventa.importetotalventa";

            $usuario = $request->usuario;

            $data = DB::connection($connection)
                ->table('faclibroventa as libroventa')
                ->select(
                    'libroventa.idfaclibroventa', 'libroventa.especificacion', 'libroventa.nro', 'libroventa.fechafactura', 'libroventa.nrofactura',
                    'libroventa.nroautorizacion', 'libroventa.estado', 'libroventa.nitcliente', 'libroventa.nombrerazonsocial',
                    'libroventa.importetotalventa', 'libroventa.importeice_ie_otronoiva', 'libroventa.exportoperacionextensas',
                    'libroventa.ventagrabadatasacero', 'libroventa.subtotal', 'libroventa.descuentosbonificarebajasujetaiva',
                    'libroventa.importebasecreditofiscal', 'libroventa.debitofiscal', 'libroventa.codigocontrol'
                )
                ->where( [ ['libroventa.fechafactura', '>=', $fechainicio], ['libroventa.fechafactura', '<=', $fechafinal] ] )
                ->orderBy( $order )
                ->get();

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configCliente = $obj->first();
            $configCliente->decrypt();

            $fecha = date('d') . '/'. date('m') . '/' . date('Y');
            $hora = date('H') . ':'. date('i') . ':' . date('s');
            
            return response()->json([
                'response' => 1,
                'libroventa' => $data,
                'fecha' => $fecha,
                'hora' => $hora,
                'usuario' => $usuario,
                'configCliente' => $configCliente,
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }
}
