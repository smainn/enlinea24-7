<?php

namespace App\Http\Controllers\Contable;

use App\Functions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Config\ConfigCliente;
use App\Models\Contable\Utils\Exports\EstadoResultadoExport;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use App\Models\Contable\CuentaConfig;
use Illuminate\Support\Facades\DB;

use PDF;
use Maatwebsite\Excel\Facades\Excel;

class EstadoResultadoController extends Controller
{
    

    public function create(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $moneda = DB::connection($connection)
                ->table('moneda')
                ->select('idmoneda', 'descripcion', 'tipocambio')
                ->whereNull('deleted_at')
                ->orderBy('idmoneda', 'asc')
                ->get();

            $gestion = DB::connection($connection)
                ->table('gestioncontable')
                ->select('idgestioncontable', 'descripcion', 'fechaini', 'fechafin')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->first();

            /*$config = DB::connection($connection)
                ->table('cuentaconfig')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idcuentaconfig', 'asc')
                ->first();
            */

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();

            return response()->json([
                'response'  => 1,
                'moneda' => $moneda,
                'config' => $config,
                'gestion' => $gestion,
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
                'message'   => 'No se pudo obtener los comprobantes',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function generar(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $value = $request->exportar;
            $user = $request->usuario;

            $fechainicio = $request->fechainicio;
            $fechafin = $request->fechafin;
            $idmoneda = $request->idmoneda;
            $name_moneda = $request->name_moneda;

            $show_codigo = ($request->checked_show_codigo == 'false')?false:true;

            $login = $request->x_login;

            $archivo_temporal_cuentaPlan = '';
            $archivo_temporal_EERR = '';

            $functions = new Functions();
            $archivo_temporal_cuentaPlan = $functions->obtener_Archivo_Temporal_PlanCuenta($login, $connection);
            $archivo_temporal_EERR = $functions->obtener_Archivo_Temporal_EERR($login, $connection);

            $functions->estado_Resultados($fechainicio, $fechafin, $idmoneda, $archivo_temporal_cuentaPlan, $archivo_temporal_EERR, $connection);

            $cuenta_plan = DB::connection($connection)
                ->table($archivo_temporal_cuentaPlan)
                ->whereNull('deleted_at')
                ->orderBy('idcuentaplantemp')
                ->get();

            $temporal_eerr = DB::connection($connection)
                ->table($archivo_temporal_EERR)
                ->whereNull('deleted_at')
                ->orderBy('ideerrtemporal')
                ->get();

            $functions->borrar_Archivo_temporal($archivo_temporal_cuentaPlan, $connection);
            $functions->borrar_Archivo_temporal($archivo_temporal_EERR, $connection);
                
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $pdf = PDF::loadView('sistema.src.contable.reporte.pdf.estado_resultado', [
                'logo'  => $config->logoreporte,
                'fecha' => $fecha,
                'hora'  => $hora,
                'temporal_eerr'  => $temporal_eerr,
                'show_codigo' => $show_codigo,

                'fechainicio'  => $fechainicio,
                'fechafin'  => $fechafin,
                'name_moneda'  => $name_moneda,
            ]);

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(500, 800, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(40, 800, $user, null, 8, array(0, 0, 0));

            if ($value == 'N') {
                return $pdf->stream('estado_resultado.pdf');
            }

            if ($value == 'P') {
                return $pdf->download('estado_resultado.pdf');
            }

            return Excel::download(new EstadoResultadoExport($temporal_eerr, $show_codigo), 'estado_resultado.xlsx');

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
                'message'   => 'No se pudo obtener el reporte de libro mayor',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

}
