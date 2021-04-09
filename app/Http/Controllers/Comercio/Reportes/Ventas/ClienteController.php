<?php

namespace App\Http\Controllers\Comercio\Reportes\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use App\Models\Config\ConfigCliente;

use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Utils\Exports\Ventas\ClienteExport;

use Illuminate\Support\Facades\DB;
use PDF;

class ClienteController extends Controller
{
    public function generar(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $tipopersoneria = $request->tipopersoneria;
            $tipocliente = $request->tipocliente;
            $ciudad = $request->ciudad;
            $genero = $request->genero;
            $nombre = $request->nombre;
            $apellido = $request->apellido;
            $nit = $request->nit;
            $nacimientoinicio = $request->nacimientoinicio;
            $nacimientofin = $request->nacimientofin;
            $ordenacion = $request->ordenacion;
            $reporte = $request->exportar;

            $arrayObjeto = [];

            if ($nacimientoinicio != '') {
                $count = DB::connection($connection)
                            ->table('cliente')
                            ->where('fechanac', '>=', $nacimientoinicio)
                            ->whereNull('deleted_at')
                            ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Fecha Nacimiento desde: ';
                    $objeto->value = date("d/m/Y", strtotime($nacimientoinicio));
                    array_push($arrayObjeto, $objeto);
                }
            }

            if (($nacimientofin != '') and ($nacimientoinicio != '')) {
                $count = DB::connection($connection)
                            ->table('cliente')
                            ->where('fechanac', '>=', $nacimientoinicio)
                            ->where('fechanac', '<=', $nacimientofin)
                            ->whereNull('deleted_at')
                            ->get();
                
                if (sizeof($count) > 0) {
                    $objeto = new \stdClass();
                    $objeto->title = 'Fecha Nacimiento hasta: ';
                    $objeto->value = date("d/m/Y", strtotime($nacimientofin));
                    array_push($arrayObjeto, $objeto);
                }
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

            $order = '';

            if ($ordenacion == 1) {
                $order = 'c.idcliente';
            } 
            if ($ordenacion == 2) {
                $order = 'c.nombre';
            } 
            if ($ordenacion == 3) {
                $order = 'c.apellido';
            }
            if ($ordenacion == 4) {
                $order = 'c.fkidclientetipo';
            } 
            if ($ordenacion == 5) {
                $order = 'c.tipopersoneria';
            }
            if ($ordenacion == 6) {
                $order = 'c.nit';
            }

            $consulta = [];
            $bandera = 0;

            if ($apellido != '') {
                array_push($consulta, ['c.apellido', 'ilike', '%'.$apellido.'%']);
                $bandera = 1;
            }
            if ($tipocliente != '') {
                array_push($consulta, ['c.fkidclientetipo', '=', $tipocliente]);
                $bandera = 1;
            }
            if ($tipopersoneria != '') {
                array_push($consulta, ['c.tipopersoneria', '=', $tipopersoneria]);
                $bandera = 1;
            }
            if ($ciudad != '') {
                array_push($consulta, ['c.fkidciudad', '=', $ciudad]);
                $bandera = 1;
            }
            if ($genero != '') {
                array_push($consulta, ['c.sexo', '=', $genero]);
                $bandera = 1;
            }
            if ($nit != '') {
                array_push($consulta, ['c.nit', 'ilike', '%'.$nit.'%']);
                $bandera = 1;
            }
            if ($nacimientoinicio != '') {
                array_push($consulta, ['c.fechanac', '>=', $nacimientoinicio]);
                $bandera = 1;
            }
            if ($nacimientofin != '') {
                if ($nacimientofin >= $nacimientoinicio) {
                    array_push($consulta, ['c.fechanac', '<=', $nacimientofin]);
                    $bandera = 1;
                }
            }
            if ($bandera == 1) {
                array_push($consulta, ['c.nombre', 'ilike', '%'.$nombre.'%']);
            }

            $cliente = DB::connection($connection)
                        ->table('cliente as c')
                        ->join('clientetipo as ct', 'c.fkidclientetipo', '=', 'ct.idclientetipo')
                        ->join('ciudad as ciu', 'c.fkidciudad', '=', 'ciu.idciudad')
                        ->select('c.idcliente', 'c.nit', 'c.tipopersoneria', 'ct.descripcion as tipocliente',
                            DB::raw("CONCAT(c.nombre, ' ', c.apellido) AS nombre"))
                        ->where(($bandera == 1)?$consulta:[['c.nombre', 'ilike', '%'.$nombre.'%']])
                        ->whereNull('c.deleted_at')
                        ->orderBy($order, 'asc')
                        ->get();

            $arrayCliente = [];

            $referenciacontacto = DB::connection($connection)
                                    ->table('referenciadecontacto')
                                    ->whereNull('deleted_at')
                                    ->orderBy('idreferenciadecontacto', 'asc')
                                    ->get();

            $contactos = [];
            $contactosEncontrados = [];

            foreach ($cliente as $c) {

                $detalle = DB::connection($connection)
                            ->table('clientecontactarlo')
                            ->where('fkidcliente', '=', $c->idcliente)
                            ->whereNull('deleted_at')
                            ->orderBy('idclientecontactarlo', 'desc')
                            ->get();

                $clientecontactarlo = [];

                for ($i = 0; $i < sizeof($referenciacontacto); $i++) {
                    $descripion = $referenciacontacto[$i]->descripcion;
                    
                    $detallereferenciacontacto = DB::connection($connection)
                            ->table('clientecontactarlo')
                            ->where('fkidcliente', '=', $c->idcliente)
                            ->where('fkidreferenciadecontacto', '=', $referenciacontacto[$i]->idreferenciadecontacto)
                            ->whereNull('deleted_at')
                            ->orderBy('idclientecontactarlo', 'asc')
                            ->get();

                    $objeto = new \stdClass();

                    if (sizeof($detallereferenciacontacto) > 0) {
                        
                        $objeto->descripcion = $descripion;
                        $objeto->detalle = $detallereferenciacontacto[0]->valor;
                    }else {
                        $objeto->descripcion = $descripion;
                        $objeto->detalle = '';
                    }
                    array_push($clientecontactarlo, $objeto);
                }
                array_push($contactos ,$clientecontactarlo);

                $bandera = 0;
                $control = [];

                if (sizeof($detalle) < 1) {
                    $bandera = 2;
                }else {

                    for($i = 0; $i < sizeof($caracteristica); $i++) {

                        foreach($detalle as $d) {
                            if ($d->fkidreferenciadecontacto == $caracteristica[$i]) {
                                $pos = strpos(strtolower($d->valor), strtolower($detalleCaracteristica[$i]));
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
                        array_push($arrayCliente, $c);
                        array_push($contactosEncontrados ,$clientecontactarlo);
                    }
                }
            }
            if (sizeof($caracteristica) > 0) {
                $cliente = $arrayCliente;
            }

            $year = date('Y');
            $mes = date('m');
            $dia = date('d');

            $hora = date('H');
            $minuto = date('i');
            $segundo = date('s');

            $fecha = $dia.'/'.$mes.'/'.$year;
            $hora = $hora.':'.$minuto.':'.$segundo;

            $user = $request->usuario;

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.cliente', [
                'fecha' => $fecha,
                'cliente' => $cliente,
                'contactos' => (sizeof($contactosEncontrados) > 0) ? $contactosEncontrados : $contactos,
                'hora' => $hora,
                'referencia' => $referenciacontacto,
                'objeto' => $arrayObjeto,
                'logo' => $config->logoreporte
            ]);
            //$pdf->setPaper('A4', 'landscape');

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(450, 825, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(50, 825, $user, null, 8, array(0, 0, 0));

            if ($reporte == 'P') { //pdf download
                return $pdf->download('clientes.pdf');
            }
            if ($reporte == 'E') { 
                return Excel::download(new ClienteExport($cliente, $contactos), 'cliente.xlsx');
            }
            
            return $pdf->stream('cliente.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }
}
