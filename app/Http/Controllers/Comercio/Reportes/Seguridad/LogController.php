<?php

namespace App\Http\Controllers\Comercio\Reportes\Seguridad;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\Config\ConfigCliente;
use PDF;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Comercio\Exports\Seguridad\LogExport;
use App\Models\Seguridad\Usuario;
use Illuminate\Contracts\Encryption\DecryptException;

class LogController extends Controller
{
    public function __construct()
    {
        // set_time_limit(360);
    }

    public function create(Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Usuario();
            $obj->setConnection($connection);

            $usuario = $obj->select('idusuario', 'login', DB::raw("CONCAT(nombre, ' ', apellido) as usuario") )
                ->where('estado', '=', 'A')
                ->orderBy('idusuario', 'asc')
                ->get()->take(20);

            $obj = new ConfigCliente();
            $obj->setConnection($connection);

            $config = $obj->first();
            $config->decrypt();

            return response()->json([
                'response'  => 1,
                'data'      => $usuario,
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function searchUserByLogin(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $search = $request->input('search', null);

            $obj = new Usuario();
            $obj->setConnection($connection);

            if ($search == null) {

                $usuario = $obj->select('idusuario', 'login', DB::raw("CONCAT(nombre, ' ', apellido) as usuario") )
                    ->where('estado', '=', 'A')
                    ->orderBy('idusuario', 'asc')
                    ->get()->take(20);

            }else {

                $usuario = $obj->select('idusuario', 'login', DB::raw("CONCAT(nombre, ' ', apellido) as usuario") )
                    ->where('estado', '=', 'A')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('login', 'ILIKE', '%'.$search.'%');
                    })
                    ->orderBy('idusuario', 'asc')
                    ->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $usuario,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function searchUserByUsuario(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $search = $request->input('search', null);

            $obj = new Usuario();
            $obj->setConnection($connection);

            if ($search == null) {

                $usuario = $obj->select('idusuario', 'login', DB::raw("CONCAT(nombre, ' ', apellido) as usuario") )
                    ->where('estado', '=', 'A')
                    ->orderBy('idusuario', 'asc')
                    ->get()->take(20);

            }else {

                $usuario = $obj->select('idusuario', 'login', DB::raw("CONCAT(nombre, ' ', apellido) as usuario") )
                    ->where('estado', '=', 'A')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere(DB::raw("CONCAT(nombre, ' ', apellido)"), 'ILIKE', '%'.$search.'%');
                    })
                    ->orderBy('idusuario', 'asc')
                    ->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $usuario,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function generar_data(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idusuario   = $request->input('idusuario', null);
            $fechainicio = $request->input('fechainicio', null);
            $fechafinal  = $request->input('fechafinal', null);
            $ordenar     = $request->input('ordenar', null);
            $exportar    = $request->input('exportar', null);

            $consulta = [];

            if (!is_null($fechainicio)) {
                if (is_null($fechafinal)) {
                    array_push($consulta, ['fechacliente', '>=', $fechainicio]);
                }else {
                    array_push($consulta, ['fechacliente', '>=', $fechainicio]);
                    array_push($consulta, ['fechacliente', '<=', $fechafinal]);
                }
            }

            if (!is_null($idusuario)) {
                array_push($consulta, ['idusr', '=', $idusuario]);
            }

            $log = DB::connection($connection)
                ->table('log')
                ->where($consulta)
                ->whereNull('deleted_at')
                ->orderBy('idlog', 'asc')
                ->get();

            return response()->json([
                'response' => 1,
                'consulta' => $consulta,
                'data'     => $log,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function generar_reporte(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $idusuario   = $request->input('idusuario', null);
            $fechainicio = $request->input('fechainicio', null);
            $fechafinal  = $request->input('fechafinal', null);
            $usuario     = $request->input('usuario', null);
            $ordenar     = $request->input('ordenar', null);
            $exportar    = $request->input('exportar', null);

            $consulta = [];

            if (!is_null($fechainicio)) {
                if (is_null($fechafinal)) {
                    array_push($consulta, ['fechacliente', '>=', $fechainicio]);
                }else {
                    array_push($consulta, ['fechacliente', '>=', $fechainicio]);
                    array_push($consulta, ['fechacliente', '<=', $fechafinal]);
                }
            }

            if (!is_null($idusuario)) {
                array_push($consulta, ['idusr', '=', $idusuario]);
            }

            $log = DB::connection($connection)
                ->table('log')
                ->select('idlog', 'idusr', 'ipcliente', 'loginusr', 'horacliente', 'fechacliente', 'accionhecha')
                ->where($consulta)
                ->whereNull('deleted_at')
                ->orderBy('idlog', 'asc')
                ->get();

            // return response()->json([
            //     'response' => 1,
            //     'data'     => $log,
            // ]);

            $confgcli = new ConfigCliente();
            $confgcli->setConnection($connection);
            $conf = $confgcli->first();
            $conf->decrypt();
            
            return view('sistema.reporte', [
                'response' => 1,   'data' => $log, 'usuario' => $usuario,
                'fecha' => $fecha, 'hora' => $hora,
                'title' => '** LOG DEL SISTEMA **', 'logo' => $conf->logoreporte, 
            ] );

            //response()->download(public_path().'/img/bolivia.png', 'file'); response()->file(public_path().'/img/bolivia.png');

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function log(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $user = $request->user;

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $fechainicio = $request->fechainicio;
            $fechafinal = $request->fechafinal;

            $login = $request->login;
            $usuario = $request->usuario;

            $ordenar = $request->ordenar;
            $order = '';
            if ($ordenar == '1') {
                $order = 'idlog';
            }
            if ($ordenar == '2') {
                $order = 'idusr';
            }
            if ($ordenar == '3') {
                $order = 'loginusr';
            }
            if ($ordenar == '4') {
                $order = 'idusr';
            }
            if ($ordenar == '5') {
                $order = 'fechacliente';
            }

            $consulta = [];
            $bandera = 0;

            if ($fechainicio != '') {
                if ($fechafinal == '') {
                    array_push($consulta, ['fechacliente', '>=', $fechainicio]);
                    $bandera = 1;
                }else {
                    array_push($consulta, ['fechacliente', '>=', $fechainicio]);
                    array_push($consulta, ['fechacliente', '<=', $fechafinal]);
                    $bandera = 1;
                }
            }

            if ($bandera == 1) {
                array_push($consulta, ['loginusr', 'ilike', '%'.$login.'%']);
            }
    

            $log = DB::connection($connection)
                ->table('log')
                ->where(
                    ($bandera == 1)?
                        $consulta:
                        [['loginusr', 'ilike', '%'.$login.'%']]
                )
                ->whereNull('deleted_at')
                ->orderBy($order, 'asc')
                ->get();

            //dd($log);
            
            $confgcli = new ConfigCliente();
            $confgcli->setConnection($connection);
            $conf = $confgcli->first();
            $conf->decrypt();
            
            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.seguridad.log', [
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'log' => $log,
                'logo' => $conf->logoreporte
            ]);

            $pdf->setPaper('A4', 'landscape');
            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();
            $canvas = $dom_pdf ->get_canvas();

            $canvas->page_text(750, 550, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));
            $canvas->page_text(50, 550, $user, null, 8, array(0, 0, 0));

            if ($request->exportar == 'P') {
                return $pdf->download('log.pdf');
            }

            if ($request->exportar == 'E') {
                return  Excel::download(new LogExport($log), 'log.xlsx');
            }

            return $pdf->stream('log.pdf');
            
        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
    }
}
