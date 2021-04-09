<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\Contable\CuentaConfig;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Contable\ComprobanteTipo;
use App\Models\Contable\Comprobante;
use App\Models\Contable\GestionContable;
use App\Models\Contable\PeriodoContable;
use App\Models\Contable\CuentaPlan;
use App\Models\Config\ConfigCliente;

use App\Models\Contable\Utils\Exports\LibroDiarioExport;
use Maatwebsite\Excel\Facades\Excel;

use PDF;

class LibroDiarioController extends Controller
{
    
    public function create(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $tiposcomprobantes = $obj->orderBy('idcomprobantetipo', 'ASC')->get();

            // $obj = new Moneda();
            // $obj->setConnection($connection);
            // $monedas = $obj->leftJoin('tipocambio as tc', 'tc.fkidmonedauno', 'moneda.idmoneda')
            //     ->select('moneda.*', 'tc.valor')
            //     ->where('tc.estado', '=', 'A')
            //     ->whereNull('tc.deleted_at')
            //     ->orderBy('moneda.idmoneda', 'ASC')
            //     ->get();

            $monedas = DB::connection($connection)
                ->table('moneda')
                ->select('idmoneda', 'descripcion', 'tipocambio')
                ->whereNull('deleted_at')
                ->orderBy('idmoneda', 'asc')
                ->get();

            $obj = new GestionContable();
            $obj->setConnection($connection);
            $periodos = $obj->leftJoin('periodocontable as pc', 'pc.fkidgestioncontable', 'gestioncontable.idgestioncontable')
                ->select('gestioncontable.idgestioncontable', 'gestioncontable.descripcion as gestion', 'gestioncontable.fechaini as inicio', 
                    'gestioncontable.fechafin as fin', 'pc.idperiodocontable', 'pc.descripcion', 'pc.fechaini', 'pc.fechafin'
                )
                ->where('gestioncontable.estado', 'A')
                ->orderBy('pc.fechaini', 'ASC')
                ->get();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuentas = $obj->where('estado', 'A')->get();

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $cuentaconfig = $obj->first();
            $cuentaconfig->decrypt();

            $cuentascodnom = [];
            foreach ($cuentas as $row) {
                if ($row->fkidcuentaplanpadre == null) {
                    array_push($cuentascodnom, [
                        'title' => $row->codcuenta . ' ' . $row->nombre,
                        'value' => $row->codcuenta . ' ' . $row->nombre,
                        'key'   => $row->idcuentaplan
                    ]);
                }
            }

            return response()->json([
                'response'          => 1,
                'tiposcomprobantes' => $tiposcomprobantes,
                'monedas'           => $monedas,
                'cuentascodnom'     => $cuentascodnom,
                'cuentas'           => $cuentas,
                'cuentaconfig'      => $cuentaconfig,
                'periodos'          => $periodos
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
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function generar(Request $request) {
        //dd($request->all());
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $criterios = '';
            $condiciones = [
                ['comprobante.contabilizar', '=', 'S'], 
            ];

            if ($request->idtipo > 0) {
                array_push($condiciones, ['ct.idcomprobantetipo', '=', $request->idtipo]);
            }

            if ($request->idcuenta > 0) {
                array_push($condiciones, ['cp.idcuentaplan', '=', $request->idcuenta]);
            }

            if ($request->gestion == "true") {
                $obj = new GestionContable();
                $obj->setConnection($connection);
                $gestion = $obj->where('estado', 'A')->first();
                array_push($condiciones, ['comprobante.fecha', '>=', $gestion->fechaini]);
                array_push($condiciones, ['comprobante.fecha', '<=', $gestion->fechafin]);
                
                $fechaini = date("d-m-Y", strtotime($gestion->fechaini));
                $fechafin = date("d-m-Y", strtotime($gestion->fechafin));
                
                $criterios = $criterios . $this->labelCriterio('Gestion', $gestion->descripcion) . 
                                        $this->labelCriterio('Desde', $fechaini) . 
                                        $this->labelCriterio('Hasta', $fechafin);

            } else if ($request->periodo == "true") {
                $obj = new PeriodoContable();
                $obj->setConnection($connection);
                $periodo = $obj->where('idperiodocontable', $request->idperiodo)->first();
                array_push($condiciones, ['comprobante.fecha', '>=', $periodo->fechaini]);
                array_push($condiciones, ['comprobante.fecha', '<=', $periodo->fechafin]);

                $fechaini = date("d-m-Y", strtotime($periodo->fechaini));
                $fechafin = date("d-m-Y", strtotime($periodo->fechafin));

                $criterios = $criterios . $this->labelCriterio('Periodo', $periodo->descripcion) . 
                                        $this->labelCriterio('Desde', $fechaini) . 
                                        $this->labelCriterio('Hasta', $fechafin);

            } else if ($request->fechadesde != null && $request->fechahasta != null) {
                array_push($condiciones, ['comprobante.fecha', '>=', $request->fechadesde]);
                array_push($condiciones, ['comprobante.fecha', '<=', $request->fechahasta]);

                $fechadesde = date("d-m-Y", strtotime($request->fechadesde));
                $fechahasta = date("d-m-Y", strtotime($request->fechahasta));

                $criterios = $criterios . $this->labelCriterio('Desde', $fechadesde) . 
                                        $this->labelCriterio('Hasta', $fechahasta);
            }

            if ($request->referidoa != null) {
                array_push($condiciones, ['comprobante.referidoa', '=', $request->referidoa]);
                $criterios = $criterios . $this->labelCriterio('Referido A', $request->referidoa);
            }

            if ($request->glosa != null) {
                array_push($condiciones, ['comprobante.glosa', '=', $request->glosa]);
                $criterios = $criterios . $this->labelCriterio('Glosa', $request->glosa);
            }

            if ($request->idmoneda == 1) {
                $criterios = $criterios . $this->labelCriterio('Moneda', 'Bolivianos');
            } else if ($request->idmoneda == 2) {
                $criterios = $criterios . $this->labelCriterio('Moneda', 'Dolares');
            }

            $obj = new Comprobante();
            $obj->setConnection($connection);

            $reporte = $obj->leftJoin('comprobantecuentadetalle as ccd', 'ccd.fkidcomprobante', 'comprobante.idcomprobante')
                            ->leftJoin('cuentaplan as cp', 'cp.idcuentaplan', 'ccd.fkidcuentaplan')
                            ->leftJoin('centrodecosto as cdc', 'cdc.idcentrodecosto', 'ccd.fkidcentrodecosto')
                            ->leftJoin('comprobantetipo as ct', 'ct.idcomprobantetipo', 'comprobante.fkidcomprobantetipo')
                            ->leftJoin('moneda as m', 'm.idmoneda', 'comprobante.fkidmoneda')
                            ->leftJoin('banco as b', 'b.idbanco', 'comprobante.fkidbanco')
                            ->select('cp.codcuenta as codigo', 'cp.nombre as cuenta', 'ct.descripcion as tipocomprobante',
                                    'comprobante.codcomprobante as numero', 'comprobante.fecha', 'm.descripcion as moneda',
                                    'comprobante.glosa', 'comprobante.referidoa', 'comprobante.idcomprobante', 'm.idmoneda',
                                    'comprobante.tipocambio', 'ccd.glosamenor', 'ccd.debe', 'ccd.haber', 'cdc.nombre as centrocosto',
                                    'comprobante.fkidtipopago', 'comprobante.nrochequetarjeta', 'b.nombre as banco')
                            ->orderBy('comprobante.idcomprobante', 'ASC')
                            ->orderBy('comprobante.fecha', 'ASC')
                            ->whereNull('ccd.deleted_at')
                            ->whereNull('cp.deleted_at')
                            ->whereNull('cdc.deleted_at')
                            ->whereNull('ct.deleted_at')
                            ->whereNull('m.deleted_at')
                            ->where($condiciones)
                            ->where(function ($query) use ($request) {
                                if ($request->asientoautomatico == 'N') {
                                    return $query
                                        ->orWhere('comprobante.esautomatico', '=', 'N')
                                        ->orWhere('comprobante.esautomatico', '=', 'S')
                                        ->orWhereNull('comprobante.esautomatico');
                                }
                                return $query
                                    ->orWhere('comprobante.esautomatico', '=', 'S');
                            })
                            //->distinct('comprobante.idcomprobante')
                            ->get();
            //dd($reporte);
            $i = 0;
            $size = $reporte->count();
            while ($i < $size) {

                if ($i == 0) {
                    if ($request->idtipo > 0) {
                        $criterios = $criterios . $this->labelCriterio('Tipo Comprobante', $reporte[$i]->tipocomprobante);
                    }
                    if ($request->idcuenta > 0) {
                        $criterios = $criterios . $this->labelCriterio('Cuenta', $reporte[$i]->cuenta);
                    }
                }
                
                $piv = $reporte[$i]->idcomprobante;
                while ($i < $size && $piv == $reporte[$i]->idcomprobante) {
                    $i++;
                }  

                if ($reporte[$i-1]->idmoneda != $request->idmoneda) {
                    if ($request->idmoneda == 1) { //SI LO QUIERE EN BOLIVIANOS
                        $reporte[$i-1]->debe = round($reporte[$i-1]->debe * floatval($reporte[$i-1]->tipocambio), 2);
                        $reporte[$i-1]->haber = round($reporte[$i-1]->haber * floatval($reporte[$i-1]->tipocambio), 2);

                    } else if ($request->idmoneda == 2) { //SI LO QUIERE EN DOLARES
                        $reporte[$i-1]->debe = round($reporte[$i-1]->debe / floatval($reporte[$i-1]->tipocambio), 2);
                        $reporte[$i-1]->haber = round($reporte[$i-1]->haber / floatval($reporte[$i-1]->tipocambio), 2);
                    }
                    
                }
            }
            //dd($reporte);
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $pdf = PDF::loadView('sistema.src.contable.reporte.pdf.libro_diario', [
                'logo'      => $config->logoreporte,
                'fecha'     => $fecha,
                'hora'      => $hora,
                'criterios' => $criterios,
                'reporte'   => $reporte
            ]);

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(500, 800, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(40, 800, $request->usuario, null, 8, array(0, 0, 0));
            
            if ($request->doctype == 'E') {
                return Excel::download(new LibroDiarioExport($reporte, $criterios), 'libro_diario.xlsx');
            } else {
                return $pdf->stream('libro_diario.pdf');
            }

        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
            //dd($th);
        }
    }

    private function labelCriterio($titulo, $criterio) {
        return ' <label style="font-size: 12px; font-weight: bold;">' .
                    $titulo .
                ': </label>' .
                '<label style="font-size: 12px; font-weight: normal;">' .
                    $criterio . ', ' .
                '</label>'
                ;
    }
}
