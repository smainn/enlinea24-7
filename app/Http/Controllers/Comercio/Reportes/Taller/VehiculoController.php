<?php

namespace App\Http\Controllers\Comercio\Reportes\Taller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\Taller\VehiculoExport;
use App\Models\Config\ConfigCliente;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use DB;
use PDF;

class VehiculoController extends Controller
{
    public function generar(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->input('idppp');
            $codigo = $request->input('codigoppp');
            $placa = $request->input('placappp');
            $chasis = $request->input('chasisppp');
            $idCliente = $request->input('idClienteppp');
            $idVehiculoTipo = $request->input('idVehiculoTipoppp');
            $tipoPartPublic = $request->input('tipopartprivppp');
            $nombreCliente = $request->input('nombreCliente');

            $arrayObjeto = [];

            if ($nombreCliente != '') {
                $count = DB::connection($connection)
                        ->table('cliente')
                        ->where('nombre', 'ilike', $nombreCliente)
                        ->orWhere('apellido', 'ilike', $nombreCliente)
                        ->orWhere(DB::raw("CONCAT(nombre, ' ',apellido)"), 'ilike', $nombreCliente)
                        ->whereNull('deleted_at')
                        ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Cliente: ';
                    $objeto->value = $nombreCliente;
                    array_push($arrayObjeto, $objeto);
                }
            }

            if ($placa != '') {
                $count = DB::connection($connection)
                        ->table('vehiculo')
                        ->where('placa', 'ilike', $placa)
                        ->whereNull('deleted_at')
                        ->get();

                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Placa: ';
                    $objeto->value = $placa;
                    array_push($arrayObjeto, $objeto);
                }
            }

            $count = DB::connection($connection)
                        ->table('vehiculo')
                        ->where('tipopartpublic', '=', $tipoPartPublic)
                        ->whereNull('deleted_at')
                        ->get();

            if (sizeof($count) > 0) {
                $objeto = new \stdClass();
                $objeto->title = 'Tipo Uso: ';
                $objeto->value = ($tipoPartPublic == 'R')?'Privado':'Publico';
                array_push($arrayObjeto, $objeto);
            }

            $count = DB::connection($connection)
                        ->table('vehiculotipo')
                        ->where('idvehiculotipo', '=', $idVehiculoTipo)
                        ->whereNull('deleted_at')
                        ->get();

            if (sizeof($count) > 0) {
                $objeto = new \stdClass();
                $objeto->title = 'Tipo Vehiculo: ';
                $objeto->value = $count[0]->descripcion;
                array_push($arrayObjeto, $objeto);
            }

            $ordenacion = $request->input('ordenacion');

            $reporte = $request->input('reporte');

            $arrayCaracteristica = $request->input('arrayCaracteristica');

            $arrayCaracteristica = explode(',', $arrayCaracteristica);

            $arrayDetalleCaracteristica = $request->input('arrayDetalleCaracteristica');

            $arrayDetalleCaracteristica = explode(',', $arrayDetalleCaracteristica);

            $order = '';

            if ($ordenacion == 1) {
                $order = 'v.idvehiculo';
            }

            if ($ordenacion == 2) {
                $order = 'v.codvehiculo';
            }

            if ($ordenacion == 3) {
                $order = 'v.placa';
            }

            if ($ordenacion == 4) {
                $order = 'v.chasis';
            }

            if ($ordenacion == 5) {
                $order = 'c.idcliente';
            }

            if ($ordenacion == 6) {
                $order = 'c.nombre';
            }

            if ($ordenacion == 7) {
                $order = 'vt.idvehiculotipo';
            }

            if ($ordenacion == 8) {
                $order = 'v.tipopartpublic';
            }

            if ($idVehiculoTipo == 0) {
                $idVehiculoTipo = '';
            }

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
            $sw = 0;
            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configC = $obj->first();
            $configC->decrypt();
            //dd($configC->codigospropios);
            if ($codigo != '') {
                if (!$configC->codigospropios) {
                    array_push($consulta, ['v.idvehiculo', '=', $codigo]);
                } else {
                    array_push($consulta, ['v.codvehiculo', 'ilike', '%'.$codigo.'%']);
                }
                $sw = 1;
            }
            if ($chasis != '') {
                array_push($consulta, ['v.chasis', 'ilike', '%'.$chasis.'%']);
                $sw = 1;
            }
            if ($idCliente != '') {
                array_push($consulta, ['v.fkidcliente', '=', $idCliente]);
                $sw = 1;
            }
            if ($idVehiculoTipo != '') {
                array_push($consulta, ['v.fkidvehiculotipo', '=', $idVehiculoTipo]);
                $sw = 1;
            }
            if ($tipoPartPublic != '') {
                array_push($consulta, ['v.tipopartpublic', '=', $tipoPartPublic]);
                $sw = 1;
            }
            if ($id != '') {
                array_push($consulta, ['v.idvehiculo', '=', $id]);
                $sw = 1;
            }

            if ($sw == 1) {
                array_push($consulta, ['v.placa', 'ilike', '%'.$placa.'%']);
            }


            $vehiculo = DB::connection($connection)
                ->table('vehiculo as v')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->join('vehiculotipo as vt', 'v.fkidvehiculotipo', '=', 'vt.idvehiculotipo')
                ->select('v.idvehiculo', 'v.placa', 'vt.descripcion', 'v.tipopartpublic',
                    DB::raw("CONCAT(c.nombre, ' ', c.apellido) AS nombre"))
                ->where(($sw == 1)?$consulta:[['v.placa', 'ilike', '%'.$placa.'%']])
                ->where(DB::raw("CONCAT(c.nombre, ' ',c.apellido)"), 'ilike', '%'.$nombreCliente.'%')
                ->whereNull('v.deleted_at')
                ->orderBy($order, 'asc')
                ->get();

            if (sizeof($caracteristica) > 0) {

                $arrayVehiculo = [];

                foreach($vehiculo as $v) {
                    
                    $detalle = DB::connection($connection)
                                ->table('vehiculocaracdetalle')
                                ->where('fkidvehiculo', '=', $v->idvehiculo)
                                ->whereNull('deleted_at')
                                ->orderBy('idvehiculocaracdetalle', 'desc')
                                ->get();

                    $bandera = 0;
                    $control = [];

                    if ((sizeof($detalle) < 1) or (sizeof($detalle) < sizeof($caracteristica))) {
                        $bandera = 2;
                    }else {
                        for($i = 0; $i < sizeof($caracteristica); $i++) {
                            foreach($detalle as $d) {
                                if ($d->fkidvehiculocaracteristica == $caracteristica[$i]) {
                                    $pos = strpos(strtolower($d->descripcion), strtolower($detalleCaracteristica[$i]));
                                    if ($pos === false) {
                                        $bandera = 1;
                                    }else {
                                        array_push($control, 1);
                                    }
                                }
                            }
                            if ($bandera == 1) {
                                $i = sizeof($caracteristica);
                            }
                        }
                    }
                    if ($bandera == 0) {
                        if (sizeof($control) >= sizeof($caracteristica)) {
                            array_push($arrayVehiculo, $v);
                        }
                    }
                }
                $vehiculo = $arrayVehiculo;
            }

            $year = date('Y');
            $mes = date('m');
            $dia = date('d');

            $hora = date('H');
            $minuto = date('i');
            $segundo = date('s');

            $fecha = $dia.'/'.$mes.'/'.$year.' '.$hora.':'.$minuto.':'.$segundo;


            //$conf2 = $confcli->first();
            //$conf2->decrypt();
            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.taller.vehiculo', [
                'fecha' => $fecha,
                'vehiculo' => $vehiculo,
                'objeto' => $arrayObjeto,
                'logo' => $configC->logoreporte
            ]);

            $user = $request->usuario;

            //$pdf->setPaper('A4', 'landscape');

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf ->get_canvas();
            $canvas->page_text(50, 825, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(450, 825, $user, null, 8, array(0, 0, 0));

            if ($reporte == 'N') { //hoja pdf
                return $pdf->stream('vehiculo.pdf');
            }

            if ($reporte == 'P') { //pdf download
                return $pdf->download('vehiculo.pdf');
            }

            if ($reporte == 'E') { //excel
                return  Excel::download(new VehiculoExport($vehiculo), 'vehiculo.xlsx');
            }
        } catch (DecryptException $e) {
            return "Error al generar reporte";
        } 
        

    }
}
