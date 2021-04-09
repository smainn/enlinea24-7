<?php

namespace App\Http\Controllers\Comercio\Reportes\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\DB;
use App\Models\Config\ConfigCliente;

use PDF;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\Almacen\ProductoExport;

class ProductoController extends Controller
{
    public function generar(Request $request) {

        try {
            //$connection = Crypt::decrypt($request->get('x_conexion'));
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $tipoproducto = $request->tipoproducto;
            $descripcion = $request->descripcion;
            $familia = $request->familia;
            $medida = $request->medida;
            $moneda = $request->moneda;

            $operacioncosto = $request->operacioncosto;
            $costoinicio = $request->costoinicio;
            $costofin = $request->costofin;

            $operacionprecio = $request->operacionprecio;
            $precioinicio = $request->precioinicio;
            $preciofin = $request->preciofin;

            $operacionstock = $request->operacionstock;
            $stockinicio = $request->stockinicio;
            $stockfin = $request->stockfin;

            $palabraclave = $request->palabraclave;
            $observacion = $request->observacion;

            $arrayObjeto = [];

            if (($costoinicio != '') and ($operacioncosto != '!')) {
                $count = DB::connection($connection)
                    ->table('producto')
                    ->where('costo', $operacioncosto, $costoinicio)
                    ->whereNull('deleted_at')
                    ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Costo: ';
                    $objeto->value = $operacioncosto;
                    array_push($arrayObjeto, $objeto);

                    $objeto = new \stdClass();
                    $objeto->title = '';
                    $objeto->value = $costoinicio;
                    array_push($arrayObjeto, $objeto);
                }
            } else {
                if (($costoinicio != '') and ($costofin != '') and ($operacioncosto == '!')) {
                    $count = DB::connection($connection)
                        ->table('producto')
                        ->where('costo', '>=', $costoinicio)
                        ->where('costo', '<=', $costofin)
                        ->whereNull('deleted_at')
                        ->get();

                    if (sizeof($count) > 0) {
                        $objeto = new \stdClass();
                        $objeto->title = 'Costo desde: ';
                        $objeto->value = $costoinicio;
                        array_push($arrayObjeto, $objeto);
        
                        $objeto = new \stdClass();
                        $objeto->title = 'Costo hasta: ';
                        $objeto->value = $costofin;
                        array_push($arrayObjeto, $objeto);
                    }
                }
            }

            $ordenacion = $request->ordenacion;

            $order = '';

            if ($ordenacion == 1) {
                $order = 'p.idproducto';
            }
            if ($ordenacion == 2) {
                $order = 'p.descripcion';
            }
            if ($ordenacion == 3) {
                $order = 'f.descripcion';
            }
            if ($ordenacion == 4) {
                $order = 'u.descripcion';
            }
            if ($ordenacion == 5) {
                $order = 'p.stock';
            }
            if ($ordenacion == 6) {
                $order = 'p.precio';
            }

            $arrayCaracteristica = explode(',', $request->arrayCaracteristica);
            $arrayDetalleCaracteristica = explode(',', $request->arrayDetalleCaracteristica);
            

            $caracteristica = [];
            $detalleCaracteristica = [];

            for($i = 0; $i < sizeof($arrayCaracteristica); $i++) {
                if ($arrayCaracteristica[$i] != '') {
                    if ($arrayCaracteristica[$i] != '0') {
                        if ($arrayDetalleCaracteristica[$i] != '') {
                            array_push($caracteristica, $arrayCaracteristica[$i]);
                            array_push($detalleCaracteristica, $arrayDetalleCaracteristica[$i]);
                        }
                    }
                }
            }

            $consulta = [];
            $bandera = 0;

            if ($operacioncosto != '') {
                if ($operacioncosto != '!') {
                    if ($costoinicio != '') {
                        array_push($consulta, ['p.costo', $operacioncosto, $costoinicio]);
                        $bandera = 1;
                    }
                }else {
                    if (($costoinicio != '') and ($costofin >= $costoinicio)) {
                        array_push($consulta, ['p.costo', '>=', $costoinicio]);
                        array_push($consulta, ['p.costo', '<=', $costofin]);
                        $bandera = 1;
                    }
                }
            }

            if ($operacionprecio != '') {
                if ($operacionprecio != '!') {
                    if ($precioinicio != '') {
                        array_push($consulta, ['p.precio', $operacionprecio, $precioinicio]);
                        $bandera = 1;
                    }
                }else {
                    if (($precioinicio != '') and ($preciofin >= $precioinicio)) {
                        array_push($consulta, ['p.precio', '>=', $precioinicio]);
                        array_push($consulta, ['p.precio', '<=', $preciofin]);
                        $bandera = 1;
                    }
                }
            }

            if ($operacionstock != '') {
                if ($operacionstock != '!') {
                    if ($stockinicio != '') {
                        array_push($consulta, ['p.stock', $operacionstock, $stockinicio]);
                        $bandera = 1;
                    }
                }else {
                    if (($stockinicio != '') and ($stockfin >= $stockinicio)) {
                        array_push($consulta, ['p.stock', '>=', $stockinicio]);
                        array_push($consulta, ['p.stock', '<=', $stockfin]);
                        $bandera = 1;
                    }
                }
            }

            if ($tipoproducto != '') {
                array_push($consulta, ['p.tipo', '=', $tipoproducto]);
                $bandera = 1;
            }

            if ($familia != '') {
                array_push($consulta, ['f.idfamilia', '=', $familia]);
                $bandera = 1;
            }

            if ($medida != '') {
                array_push($consulta, ['u.idunidadmedida', '=', $medida]);
                $bandera = 1;
            }

            if ($moneda != '') {
                array_push($consulta, ['m.idmoneda', '=', $moneda]);
                $bandera = 1;
            }

            if ($palabraclave != '') {
                array_push($consulta, ['p.palabrasclaves', 'ilike', '%'.$palabraclave.'%']);
                $bandera = 1;
            }

            if ($observacion != '') {
                array_push($consulta, ['p.notas', 'ilike', '%'.$observacion.'%']);
                $bandera = 1;
            }

            if ($bandera == 1) {
                array_push($consulta, ['p.descripcion', 'ilike', '%'.$descripcion.'%']);
            }

            $producto = DB::connection($connection)
                ->table('producto as p')
                ->join('familia as f', 'p.fkidfamilia', '=', 'f.idfamilia')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->join('moneda as m', 'p.fkidmoneda', '=', 'm.idmoneda')
                ->select('p.idproducto', 'p.descripcion as producto', 'f.descripcion as familia', 'p.costo',
                    'u.descripcion as medida', 'p.stock', 'p.stockminimo', 'p.stockmaximo', 'p.precio')
                ->where(($bandera == 1)?$consulta:[['p.descripcion', 'ilike', '%'.$descripcion.'%']])
                ->whereNull('p.deleted_at')
                ->orderBy($order, 'asc')
                ->get();

            $arrayProducto = [];

            foreach ($producto as $p) {

                $detalle = DB::connection($connection)
                            ->table('prodcaracdetalle')
                            ->where('fkidproducto', '=', $p->idproducto)
                            ->whereNull('deleted_at')
                            ->orderBy('idprodcaracdetalle', 'asc')
                            ->get();

                $bandera = 0;
                $control = [];

                if (sizeof($detalle) < 1) {
                    $bandera = 2;
                }else {

                    for($i = 0; $i < sizeof($caracteristica); $i++) {

                        foreach($detalle as $d) {
                            if ($d->fkidproduccaracteristica == $caracteristica[$i]) {
                                $pos = strpos(strtolower($d->descripcion), strtolower($detalleCaracteristica[$i]));
                                if ($pos === false) {
                                    $bandera = 1;
                                }else {
                                    array_push($control, $d);
                                }
                            }
                        }
                        if ($bandera == 1) {
                            $i = sizeof($caracteristica);
                        }
                    }
                }
                if ($bandera == 0) {
                    if (sizeof($control) > 0) {
                        array_push($arrayProducto, $p);
                    }
                }

            }

            if (sizeof($caracteristica) > 0) {
                $producto = $arrayProducto;
            }
            $year = date('Y');
            $mes = date('m');
            $dia = date('d');

            $hora = date('H');
            $minuto = date('i');
            $segundo = date('s');

            $fecha = $dia.'/'.$mes.'/'.$year;
            $hora = $hora.':'.$minuto.':'.$segundo;

            $reporte = $request->exportar;

            $user = $request->usuario;

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.almacen.producto', [
                'fecha' => $fecha,
                'producto' => $producto,
                'hora' => $hora,
                'esabogado' => $config->clienteesabogago,
                'logo' => $config->logoreporte
            ]);

            //$pdf->setPaper('A4', 'landscape');

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(50, 825, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(450, 825, $user, null, 8, array(0, 0, 0));

            if ($reporte == 'P') { //pdf download
                return $pdf->download('productos.pdf');
            }

            if ($reporte == 'E') { 
                return Excel::download(new ProductoExport($producto, $request->esabogado), 'producto.xlsx');
            }
            
            return $pdf->stream('productos.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        } 
    }


    public function generarproducto(Request $request) {
        try {
            //$connection = Crypt::decrypt($request->get('x_conexion'));
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $tipoproducto = $request->tipoproducto;
            $descripcion = $request->descripcion;
            $familia = $request->familia;
            $medida = $request->medida;
            $moneda = $request->moneda;

            $operacioncosto = $request->operacioncosto;
            $costoinicio = $request->costoinicio;
            $costofin = $request->costofin;

            $operacionprecio = $request->operacionprecio;
            $precioinicio = $request->precioinicio;
            $preciofin = $request->preciofin;

            $operacionstock = $request->operacionstock;
            $stockinicio = $request->stockinicio;
            $stockfin = $request->stockfin;

            $palabraclave = $request->palabraclave;
            $observacion = $request->observacion;

            $arrayObjeto = [];

            if (($costoinicio != '') and ($operacioncosto != '!')) {
                $count = DB::connection($connection)
                    ->table('producto')
                    ->where('costo', $operacioncosto, $costoinicio)
                    ->whereNull('deleted_at')
                    ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Costo: ';
                    $objeto->value = $operacioncosto;
                    array_push($arrayObjeto, $objeto);

                    $objeto = new \stdClass();
                    $objeto->title = '';
                    $objeto->value = $costoinicio;
                    array_push($arrayObjeto, $objeto);
                }
            } else {
                if (($costoinicio != '') and ($costofin != '') and ($operacioncosto == '!')) {
                    $count = DB::connection($connection)
                        ->table('producto')
                        ->where('costo', '>=', $costoinicio)
                        ->where('costo', '<=', $costofin)
                        ->whereNull('deleted_at')
                        ->get();

                    if (sizeof($count) > 0) {
                        $objeto = new \stdClass();
                        $objeto->title = 'Costo desde: ';
                        $objeto->value = $costoinicio;
                        array_push($arrayObjeto, $objeto);
        
                        $objeto = new \stdClass();
                        $objeto->title = 'Costo hasta: ';
                        $objeto->value = $costofin;
                        array_push($arrayObjeto, $objeto);
                    }
                }
            }

            $ordenacion = $request->ordenacion;

            $order = '';

            if ($ordenacion == 1) {
                $order = 'p.idproducto';
            }
            if ($ordenacion == 2) {
                $order = 'p.descripcion';
            }
            if ($ordenacion == 3) {
                $order = 'f.descripcion';
            }
            if ($ordenacion == 4) {
                $order = 'u.descripcion';
            }
            if ($ordenacion == 5) {
                $order = 'p.stock';
            }
            if ($ordenacion == 6) {
                $order = 'p.precio';
            }

            $arrayCaracteristica = json_decode($request->arrayCaracteristica) ;
            $arrayDetalleCaracteristica = json_decode($request->arrayDetalleCaracteristica) ;
            

            $caracteristica = [];
            $detalleCaracteristica = [];

            for($i = 0; $i < sizeof($arrayCaracteristica); $i++) {
                if ($arrayCaracteristica[$i] != '') {
                    if ($arrayCaracteristica[$i] != '0') {
                        if ($arrayDetalleCaracteristica[$i] != '') {
                            array_push($caracteristica, $arrayCaracteristica[$i]);
                            array_push($detalleCaracteristica, $arrayDetalleCaracteristica[$i]);
                        }
                    }
                }
            }

            $consulta = [];
            $bandera = 0;

            if ($operacioncosto != '') {
                if ($operacioncosto != '!') {
                    if ($costoinicio != '') {
                        array_push($consulta, ['p.costo', $operacioncosto, $costoinicio]);
                        $bandera = 1;
                    }
                }else {
                    if (($costoinicio != '') and ($costofin >= $costoinicio)) {
                        array_push($consulta, ['p.costo', '>=', $costoinicio]);
                        array_push($consulta, ['p.costo', '<=', $costofin]);
                        $bandera = 1;
                    }
                }
            }

            if ($operacionprecio != '') {
                if ($operacionprecio != '!') {
                    if ($precioinicio != '') {
                        array_push($consulta, ['p.precio', $operacionprecio, $precioinicio]);
                        $bandera = 1;
                    }
                }else {
                    if (($precioinicio != '') and ($preciofin >= $precioinicio)) {
                        array_push($consulta, ['p.precio', '>=', $precioinicio]);
                        array_push($consulta, ['p.precio', '<=', $preciofin]);
                        $bandera = 1;
                    }
                }
            }

            if ($operacionstock != '') {
                if ($operacionstock != '!') {
                    if ($stockinicio != '') {
                        array_push($consulta, ['p.stock', $operacionstock, $stockinicio]);
                        $bandera = 1;
                    }
                }else {
                    if (($stockinicio != '') and ($stockfin >= $stockinicio)) {
                        array_push($consulta, ['p.stock', '>=', $stockinicio]);
                        array_push($consulta, ['p.stock', '<=', $stockfin]);
                        $bandera = 1;
                    }
                }
            }

            if ($tipoproducto != '') {
                array_push($consulta, ['p.tipo', '=', $tipoproducto]);
                $bandera = 1;
            }

            if ($familia != '') {
                array_push($consulta, ['f.idfamilia', '=', $familia]);
                $bandera = 1;
            }

            if ($medida != '') {
                array_push($consulta, ['u.idunidadmedida', '=', $medida]);
                $bandera = 1;
            }

            if ($moneda != '') {
                array_push($consulta, ['m.idmoneda', '=', $moneda]);
                $bandera = 1;
            }

            if ($palabraclave != '') {
                array_push($consulta, ['p.palabrasclaves', 'ilike', '%'.$palabraclave.'%']);
                $bandera = 1;
            }

            if ($observacion != '') {
                array_push($consulta, ['p.notas', 'ilike', '%'.$observacion.'%']);
                $bandera = 1;
            }

            if ($bandera == 1) {
                array_push($consulta, ['p.descripcion', 'ilike', '%'.$descripcion.'%']);
            }

            $producto = DB::connection($connection)
                ->table('producto as p')
                ->join('familia as f', 'p.fkidfamilia', '=', 'f.idfamilia')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->join('moneda as m', 'p.fkidmoneda', '=', 'm.idmoneda')
                ->select('p.idproducto', 'p.codproducto as codigo', 'p.descripcion as producto', 'f.descripcion as familia', 'p.costo',
                    'u.descripcion as medida', 'p.stock', 'p.stockminimo', 'p.stockmaximo', 'p.precio')
                ->where(($bandera == 1)?$consulta:[['p.descripcion', 'ilike', '%'.$descripcion.'%']])
                ->whereNull('p.deleted_at')
                ->orderBy($order, 'asc')
                ->get();

            $arrayProducto = [];

            foreach ($producto as $p) {

                $detalle = DB::connection($connection)
                            ->table('prodcaracdetalle')
                            ->where('fkidproducto', '=', $p->idproducto)
                            ->whereNull('deleted_at')
                            ->orderBy('idprodcaracdetalle', 'asc')
                            ->get();

                $bandera = 0;
                $control = [];

                if (sizeof($detalle) < 1) {
                    $bandera = 2;
                }else {

                    for($i = 0; $i < sizeof($caracteristica); $i++) {

                        foreach($detalle as $d) {
                            if ($d->fkidproduccaracteristica == $caracteristica[$i]) {
                                $pos = strpos(strtolower($d->descripcion), strtolower($detalleCaracteristica[$i]));
                                if ($pos === false) {
                                    $bandera = 1;
                                }else {
                                    array_push($control, $d);
                                }
                            }
                        }
                        if ($bandera == 1) {
                            $i = sizeof($caracteristica);
                        }
                    }
                }
                if ($bandera == 0) {
                    if (sizeof($control) > 0) {
                        array_push($arrayProducto, $p);
                    }
                }

            }

            if (sizeof($caracteristica) > 0) {
                $producto = $arrayProducto;
            }
            $year = date('Y');
            $mes = date('m');
            $dia = date('d');

            $hora = date('H');
            $minuto = date('i');
            $segundo = date('s');

            $fecha = $dia.'/'.$mes.'/'.$year;
            $hora = $hora.':'.$minuto.':'.$segundo;

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            return response()->json([
                'response' => 1,
                'fecha' => $fecha,
                'producto' => $producto,
                'hora' => $hora,
                'esabogado' => $config->clienteesabogado,
                'logo' => $config->logoreporte,
                'configcliente' => $config,
                'codigospropios' => $config->codigospropios,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo obtener los productos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    public function generarkardexproducto(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idsucursal = $request->input('idsucursal');
            $idalmacen = $request->input('idalmacen');
            $idproducto = $request->input('idproducto');
            $fechainicio = $request->input('fechainicio');
            $fechafinal = $request->input('fechafinal');

            $usuario = $request->usuario;

            $consulta = [];
            $consultaingsalitrasp = [];

            if ( !is_null($idsucursal) ) {
                array_push( $consulta, [ 'alm.fkidsucursal', '=', $idsucursal ] );
                array_push( $consultaingsalitrasp, [ 'alm.fkidsucursal', '=', $idsucursal ] );
            }
            if ( !is_null($idalmacen) ) {
                array_push( $consulta, [ 'alm.idalmacen', '=', $idalmacen ] );
                array_push( $consultaingsalitrasp, [ 'alm.idalmacen', '=', $idalmacen ] );
            }
            if ( !is_null($idproducto) ) {
                array_push( $consulta, [ 'prod.idproducto', '=', $idproducto ] );
                array_push( $consultaingsalitrasp, [ 'prod.idproducto', '=', $idproducto ] );
            }
            if ( !is_null($fechainicio) ) {
                if ( !is_null($fechafinal) ) {
                    array_push( $consulta, [ 'transac.fecha', '>=', $fechainicio ] );
                    array_push( $consulta, [ 'transac.fecha', '<=', $fechafinal ] );

                    array_push( $consultaingsalitrasp, [ 'transac.fechahora', '>=', $fechainicio.' 00:00:00' ] );
                    array_push( $consultaingsalitrasp, [ 'transac.fechahora', '<=', $fechafinal.' 23:59:59' ] );
                } else {
                    array_push( $consulta, [ 'transac.fecha', '>=', $fechainicio ] );

                    array_push( $consultaingsalitrasp, [ 'transac.fechahora', '>=', $fechainicio.' 00:00:00' ] );
                }
            }

            $venta = DB::connection($connection)
                ->table('venta as transac')
                ->join('ventadetalle as vtadet', 'transac.idventa', '=', 'vtadet.fkidventa')
                ->join('almacenproddetalle as almproddet', 'vtadet.fkidalmacenproddetalle', '=', 'almproddet.idalmacenproddetalle')
                ->join('almacen as alm', 'almproddet.fkidalmacen', '=', 'alm.idalmacen')
                ->join('producto as prod', 'almproddet.fkidproducto', '=', 'prod.idproducto')
                ->select(
                    'transac.idventa as idtransac', 'transac.fecha', 'transac.mtototventa',
                    'vtadet.cantidad', 'vtadet.preciounit',
                    'alm.descripcion as almacen',
                    DB::raw("COALESCE(NULL, 'Venta') as tipotransac"),
                    DB::raw("COALESCE(NULL, '0') as costounit"),
                    DB::raw("to_char(transac.fecha,'DD/MM/YYYY') as fechatransac"),
                    DB::raw("to_char(transac.fecha,'YYYY-MM-DD') as datetransac")
                )
                ->where( $consulta )
                ->whereNull('transac.deleted_at')
                ->whereNull('vtadet.deleted_at')
                ->orderBy('transac.idventa', 'desc')
                ->get()->toArray();

            $compra = DB::connection($connection)
                ->table('compra as transac')
                ->join('compradetalle as compdet', 'transac.idcompra', '=', 'compdet.fkidcompra')
                ->join('almacenproddetalle as almproddet', 'compdet.fkidalmacenproddetalle', '=', 'almproddet.idalmacenproddetalle')
                ->join('almacen as alm', 'almproddet.fkidalmacen', '=', 'alm.idalmacen')
                ->join('producto as prod', 'almproddet.fkidproducto', '=', 'prod.idproducto')   
                ->select(
                    'transac.idcompra as idtransac', 'transac.fecha', 'transac.mtototcompra',
                    'compdet.cantidad', 'compdet.costounit',
                    'alm.descripcion as almacen',
                    DB::raw("COALESCE(NULL, 'Compra') as tipotransac"),
                    DB::raw("COALESCE(NULL, '0') as preciounit"),
                    DB::raw("to_char(transac.fecha,'DD/MM/YYYY') as fechatransac"),
                    DB::raw("to_char(transac.fecha,'YYYY-MM-DD') as datetransac")
                )
                ->where( $consulta )
                ->whereNull('transac.deleted_at')
                ->whereNull('compdet.deleted_at')
                ->orderBy('transac.idcompra', 'desc')
                ->get()->toArray();

            $ingresoproducto = DB::connection($connection)
                ->table('ingresoproducto as transac')
                ->join('ingresoproddetalle as ingproddet', 'transac.idingresoproducto', '=', 'ingproddet.fkidingresoproducto')
                ->join('almacenproddetalle as almproddet', 'ingproddet.fkidalmacenproddetalle', '=', 'almproddet.idalmacenproddetalle')
                ->join('almacen as alm', 'almproddet.fkidalmacen', '=', 'alm.idalmacen')
                ->join('producto as prod', 'almproddet.fkidproducto', '=', 'prod.idproducto')   
                ->select(
                    'transac.idingresoproducto as idtransac', 'transac.fechahora', 'ingproddet.cantidad',
                    'alm.descripcion as almacen',
                    DB::raw("COALESCE(NULL, 'Ingreso') as tipotransac"),
                    DB::raw("COALESCE(NULL, '0') as costounit"),
                    DB::raw("COALESCE(NULL, '0') as preciounit"),
                    DB::raw("to_char(transac.fechahora,'DD/MM/YYYY') as fechatransac"),
                    DB::raw("to_char(transac.fechahora,'YYYY-MM-DD') as datetransac")
                )
                ->where( $consultaingsalitrasp )
                ->whereNull('transac.deleted_at')
                ->whereNull('ingproddet.deleted_at')
                ->orderBy('transac.idingresoproducto', 'desc')
                ->get()->toArray();

            $salidaproducto = DB::connection($connection)
                ->table('salidaproducto as transac')
                ->join('salidaproddetalle as saliproddet', 'transac.idsalidaproducto', '=', 'saliproddet.fkidsalidaproducto')
                ->join('almacenproddetalle as almproddet', 'saliproddet.fkidalmacenproddetalle', '=', 'almproddet.idalmacenproddetalle')
                ->join('almacen as alm', 'almproddet.fkidalmacen', '=', 'alm.idalmacen')
                ->join('producto as prod', 'almproddet.fkidproducto', '=', 'prod.idproducto')   
                ->select(
                    'transac.idsalidaproducto as idtransac', 'transac.fechahora', 'saliproddet.cantidad',
                    'alm.descripcion as almacen',
                    DB::raw("COALESCE(NULL, 'Salida') as tipotransac"),
                    DB::raw("COALESCE(NULL, '0') as costounit"),
                    DB::raw("COALESCE(NULL, '0') as preciounit"),
                    DB::raw("to_char(transac.fechahora,'DD/MM/YYYY') as fechatransac"),
                    DB::raw("to_char(transac.fechahora,'YYYY-MM-DD') as datetransac")
                )
                ->where( $consultaingsalitrasp )
                ->whereNull('transac.deleted_at')
                ->whereNull('saliproddet.deleted_at')
                ->orderBy('transac.idsalidaproducto', 'desc')
                ->get()->toArray();

            $traspasoproducto = DB::connection($connection)
                ->table('traspasoproducto as transac')
                ->join('traspasoproddetalle as traspproddet', 'transac.idtraspasoproducto', '=', 'traspproddet.fkidtraspasoproducto')
                ->join('almacenproddetalle as almproddet', 'traspproddet.fkidalmacenproddetalle', '=', 'almproddet.idalmacenproddetalle')
                ->join('almacen as alm', 'almproddet.fkidalmacen', '=', 'alm.idalmacen')
                ->join('producto as prod', 'almproddet.fkidproducto', '=', 'prod.idproducto')   
                ->select(
                    'transac.idtraspasoproducto as idtransac', 'transac.fechahora', 'traspproddet.cantidad',
                    'alm.descripcion as almacen', 'alm.idalmacen', 'transac.fkidalmacen_sale', 'transac.fkidalmacen_entra',
                    DB::raw("COALESCE(NULL, 'Traspaso') as tipotransac"),
                    DB::raw("COALESCE(NULL, '0') as costounit"),
                    DB::raw("COALESCE(NULL, '0') as preciounit"),
                    DB::raw("to_char(transac.fechahora,'DD/MM/YYYY') as fechatransac"),
                    DB::raw("to_char(transac.fechahora,'YYYY-MM-DD') as datetransac")
                )
                ->where( $consultaingsalitrasp )
                ->whereNull('transac.deleted_at')
                ->whereNull('traspproddet.deleted_at')
                ->orderBy('transac.idtraspasoproducto', 'desc')
                ->get()->toArray();

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configCliente = $obj->first();
            $configCliente->decrypt();

            $fecha = date('d') . '/'. date('m') . '/' . date('Y');
            $hora = date('H') . ':'. date('i') . ':' . date('s');

            $detalle = array_merge($venta, $compra, $ingresoproducto, $salidaproducto, $traspasoproducto);
            usort($detalle, $this->build_sorter('datetransac'));
            
            return response()->json([
                "response" => 1,
                'venta' => $venta,
                'compra' => $compra,
                'ingresoproducto' => $ingresoproducto,
                'salidaproducto' => $salidaproducto,
                'traspasoproducto' => $traspasoproducto,
                'fecha' => $fecha,
                'hora' => $hora,
                'usuario' => $usuario,
                'configCliente' => $configCliente,
                'detalle' => $detalle,
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
                'message' => 'Error en el servidor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function build_sorter($clave)
    {
        return function ($a, $b) use ($clave) {
            return strnatcmp($a->$clave, $b->$clave);
        };
    }

}
