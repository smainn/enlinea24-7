<?php

namespace App\Http\Controllers\Contable;

use App\Functions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Config\ConfigCliente;
use App\Models\Contable\Utils\Exports\LibroMayorExport;
use Illuminate\Support\Facades\Crypt;
use App\Models\Contable\CuentaConfig;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\DB;

use PDF;

use Maatwebsite\Excel\Facades\Excel;

class LibroMayorController extends Controller
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

            $cuenta = DB::connection($connection)
                ->table('cuentaplan')
                ->select('idcuentaplan', 'codcuenta', 'nombre', 'fkidcuentaplanpadre')
                ->whereNull('deleted_at')
                ->orderBy('idcuentaplan', 'asc')
                ->get();

            $gestion = DB::connection($connection)
                ->table('gestioncontable')
                ->select('idgestioncontable', 'descripcion', 'fechaini', 'fechafin')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->get();
            
            $periodo = [];
            $idperiodo = '';
            $idgestion = '';

            if (sizeof($gestion) > 0) {
                $idgestion = $gestion[0]->idgestioncontable;

                $periodo = DB::connection($connection)
                    ->table('periodocontable')
                    ->select('idperiodocontable', 'descripcion', 'fechaini', 
                        'fechafin', 'fkidgestioncontable'
                    )
                    ->where('fkidgestioncontable', '=', $gestion[0]->idgestioncontable)
                    ->whereNull('deleted_at')
                    ->orderBy('idperiodocontable', 'asc')
                    ->get();
                
                if (sizeof($periodo) > 0) {
                    $idperiodo = $periodo[0]->idperiodocontable;
                }
            }

            $proceso = DB::connection($connection)
                ->table('gestioncontable')
                ->select('idgestioncontable', 'descripcion', 'fechaini', 'fechafin')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->get();

            $data = Array();

            foreach ($proceso as $reg) {
                $data[] = Array(
                    'idgestioncontable' => $reg->idgestioncontable,
                    'descripcion'       => $reg->descripcion,
                    'fechaini'          => $reg->fechaini,
                    'fechafin'          => $reg->fechafin,
                    'periodo'           => DB::connection($connection)
                        ->table('periodocontable')
                        ->select('idperiodocontable', 'descripcion', 'fechaini', 
                            'fechafin', 'fkidgestioncontable'
                        )
                        ->where('fkidgestioncontable', '=', $reg->idgestioncontable)
                        ->whereNull('deleted_at')
                        ->orderBy('idperiodocontable', 'asc')
                        ->get(),
                );
            }

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();

            return response()->json([
                'response'  => 1,

                'data' => $data,

                'moneda' => $moneda,
                'cuenta' => $cuenta,
                'gestion' => $gestion,
                'periodo' => $periodo,

                'idperiodo' => $idperiodo,
                'idgestion' => $idgestion,

                'config'    => $config,
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

    public function get_gestion(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $gestion = DB::connection($connection)
                ->table('gestioncontable')
                ->select('idgestioncontable', 'descripcion', 'fechaini', 'fechafin')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->get();
            
            $periodo = [];
            $idperiodo = '';
            $idgestion = $id;

            $periodo = DB::connection($connection)
                ->table('periodocontable')
                ->select('idperiodocontable', 'descripcion', 'fechaini', 
                    'fechafin', 'fkidgestioncontable'
                )
                ->where('fkidgestioncontable', '=', $idgestion)
                ->whereNull('deleted_at')
                ->orderBy('idperiodocontable', 'asc')
                ->get();
            
            if (sizeof($periodo) > 0) {
                $idperiodo = $periodo[0]->idperiodocontable;
            }

            return response()->json([
                'response'  => 1,
                'gestion' => $gestion,
                'periodo' => $periodo,

                'idperiodo' => $idperiodo,
                'idgestion' => $idgestion,
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

    public function generar(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $value = $request->exportar;
            $user = $request->usuario;

            $fechainicio = $request->fechainicio;
            $fechafin = $request->fechafin;
            $idmoneda = $request->idmoneda;

            $name_moneda = $request->name_moneda;

            $saldo_mayor = ($request->saldo_mayor == 'false')?false:true;

            $array_idcuenta = json_decode($request->idcuenta);
            
            $login = $request->x_login;

            $archivo_temporal= '';
            
            $functions = new Functions();
            $archivo_temporal = $functions->obtener_Archivo_Temporal_LibroMayor($login, $connection);

            $saldo = $functions->libroMayorVarias($array_idcuenta, $fechainicio, $fechafin, $idmoneda, $saldo_mayor, $connection, $archivo_temporal);

            $libro_mayor = DB::connection($connection)
                ->table($archivo_temporal)
                ->whereNull('deleted_at')
                ->orderBy('idlibmay')
                ->get();
                
            $functions->borrar_Archivo_temporal($archivo_temporal, $connection);

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $pdf = PDF::loadView('sistema.src.contable.reporte.pdf.libro_mayor', [
                'logo'  => $config->logoreporte,
                'fecha' => $fecha,
                'hora'  => $hora,

                'libro_mayor'  => $libro_mayor,

                'fechainicio'  => $fechainicio,
                'fechafin'  => $fechafin,
                'saldo_mayor'  => $saldo,
                'name_moneda'  => $name_moneda,
            ]);

            $pdf->setPaper('A4', 'landscape');

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(750, 570, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(40, 570, $user, null, 8, array(0, 0, 0));

            if ($value == 'N') {
                return $pdf->stream('libro_mayor.pdf');
            }

            if ($value == 'P') {
                return $pdf->download('libro_mayor.pdf');
            }

            return Excel::download(new LibroMayorExport($libro_mayor), 'libro_mayor.xlsx');

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
