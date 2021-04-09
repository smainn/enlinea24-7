<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Contable\GestionContable;
use App\Models\Contable\CuentaConfig;
use App\Models\Contable\CuentaPlan;
use App\Models\Config\ConfigCliente;
use Illuminate\Support\Facades\Crypt;
use App\Models\Contable\Utils\Exports\BalanceGeneralExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Seguridad\Log;
use App\Functions;
use Illuminate\Support\Facades\DB;
use PDF;

class BalanceGeneralController extends Controller
{
    public function create(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Moneda();
            $obj->setConnection($connection);
            $monedas = $obj->orderBy('moneda.idmoneda', 'ASC')->get();

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();

            $obj = new GestionContable();
            $obj->setConnection($connection);
            $gestion = $obj->where('estado', 'A')->first();

            return response()->json([
                'response'  => 1,
                'monedas'   => $monedas,
                'config'    => $config,
                'gestion'   => $gestion
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
            $utils = new Functions();
            $utils->setConnection($connection);
            $archPlanCuentaTemp = $utils->obtnerArchTempoPlanCuenta($request->x_login, $connection);
            $archTempBG = $utils->obtnerArchTempoBG($request->x_login, $connection);

            $esctaresult = 'S';

            $utils->balanceGeneral2($request->fechadesde, $request->fechahasta, $request->idmoneda, $archPlanCuentaTemp,$archTempBG, $esctaresult);
            //return;
            $datos = DB::connection($connection)
                        ->table($archTempBG)
                        ->where('valor', '<>', '0')
                        ->get();
            $utils->borrarTempo($archPlanCuentaTemp, $connection);
            $utils->borrarTempo($archTempBG, $connection);
            //$arr = $this->sumarPorNivel($datos, 4);
           
            //dd($datos);
            
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();
            
            $obj = new Moneda();
            $obj->setConnection($connection);
            $moneda = $obj->where('idmoneda', $request->idmoneda)->first();
            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
           
            $yesNo = $request->mostrarcodigo == "true" ? "Si" : "No";
            $arr1 = explode('-', $request->fechadesde);
            $arr2 = explode('-', $request->fechahasta);
            $fecaIni = $arr1[2] . '-' . $arr1[1] . '-' . $arr1[0];
            $fecaFin = $arr2[2] . '-' . $arr2[1] . '-' . $arr2[0];
            $subtitulo = $this->labelCriterio('Desde', $fecaIni) . 
                         $this->labelCriterio('Hasta', $fecaFin) .
                         $this->labelCriterio('Moneda', $moneda->descripcion) .
                         $this->labelCriterio('Nivel', $request->nivel) . 
                         $this->labelCriterio('MostrarCodigo', $yesNo);

            $pdf = PDF::loadView('sistema.src.contable.reporte.pdf.balance_general', [
                'logo'      => $config->logoreporte,
                'fecha'     => $fecha,
                'hora'      => $hora,
                'subtitulo' => $subtitulo,
                'data'      => $datos,
                'nivelmax'  => $request->nivel,
                'showcod'   => $request->mostrarcodigo
            ]);

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Genereo Balance general';
            $log->guardar($request, $accion);

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(500, 800, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(40, 800, $request->usuario, null, 8, array(0, 0, 0));
            
            //return $pdf->stream('balance_general.pdf'); 
            if ($request->doctype == 'E') {
                return Excel::download(new BalanceGeneralExport($datos, $subtitulo, $request->nivel, $request->mostrarcodigo), 'balance_general.xlsx');
            }
            return $pdf->stream('libro_diario.pdf');
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

    private function labelCriterio($titulo, $criterio) {
        return ' <label style="font-size: 14px; font-weight: bold;">' .
                    $titulo .
                ': </label>' .
                '<label style="font-size: 14px; font-weight: normal;">' .
                    $criterio . ', ' .
                '</label>'
                ;
    }
    
}
