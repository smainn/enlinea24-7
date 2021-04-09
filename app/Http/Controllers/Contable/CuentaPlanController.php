<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Config\ConfigCliente;
use App\Models\Contable\CuentaPlan;
use App\Models\Contable\Utils\Exports\CuentaPlanExport;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Models\Contable\CuentaConfig;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\Seguridad\Log;

use PDF;
use Maatwebsite\Excel\Facades\Excel;

class CuentaPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $data = $this->get_data($connection);

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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

    public function get_data($connection) {

        $data = DB::connection($connection)
            ->table('cuentaplan')
            ->select('idcuentaplan', 'codcuenta', 'nombre', 
                'fkidcuentaplanpadre', 'fkidcuentaplantipo', 
                DB::raw('
                    (SELECT COUNT(c.fkidcuentaplan) FROM comprobantecuentadetalle as c
                        WHERE c.fkidcuentaplan = cuentaplan.idcuentaplan) 
                    AS cuenta
                ')
            )
            ->where('estado', '=', 'A')
            ->whereNull('deleted_at')
            ->orderBy('idcuentaplan', 'asc')
            ->get();

        $obj = new CuentaConfig();
        $obj->setConnection($connection);
        $config = $obj->first();
        $config->decrypt();

        for ($i = 0; $i < sizeof($data); $i++) {
            $c = $data[$i];
            $cuentaplan = new CuentaPlan();
            $cuentaplan->setConnection($connection);
            $cuenta = $cuentaplan->find($c->idcuentaplan);
            $cuenta->codcuenta = $this->generarCodigo($cuenta->codcuenta, $config->formato);
            $cuenta->update();
        }

        $data = DB::connection($connection)
            ->table('cuentaplan as c')
            ->leftJoin('cuentaplantipo as cp', 'c.fkidcuentaplantipo', '=', 'cp.idcuentaplantipo')
            ->select('c.idcuentaplan', 'c.codcuenta', 'c.nombre', 
                'c.fkidcuentaplanpadre', 'c.fkidcuentaplantipo', 
                DB::raw('
                    (SELECT COUNT(compcuent.fkidcuentaplan) FROM comprobantecuentadetalle as compcuent
                        WHERE compcuent.fkidcuentaplan = c.idcuentaplan) 
                    AS cuenta
                '), 'cp.descripcion as tipocuenta'
            )
            ->where('c.estado', '=', 'A')
            ->whereNull('c.deleted_at')
            ->orderBy('c.idcuentaplan', 'asc')
            ->get();
        
        return $data;
    }

    public function get_tipo_cuenta(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $data = DB::connection($connection)
                ->table('cuentaplantipo')
                ->whereNull('deleted_at')
                ->orderBy('idcuentaplantipo', 'asc')
                ->get();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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

    public function vaciar(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cuenta = DB::connection($connection)
                ->table('cuentaplan as c')
                ->join('comprobantecuentadetalle as cd', 'c.idcuentaplan', '=', 'cd.fkidcuentaplan')
                ->where('c.estado', '=', 'A')
                ->whereNull('c.deleted_at')
                ->orderBy('c.idcuentaplan', 'asc')
                ->get();

            if (sizeof($cuenta) > 0) {
                return response()->json([
                    'response'  => 0,
                ]);
            }
            
            $cuenta = DB::connection($connection)
                ->table('cuentaplan')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idcuentaplan', 'asc')
                ->get();

            foreach($cuenta as $c) {
                $data = new CuentaPlan();
                $data->setConnection($connection);
                $data->find($c->idcuentaplan)->delete();
            }

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'data' => $data,
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

    public function por_defecto(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cuenta = DB::connection($connection)
                ->table('cuentaplan as c')
                ->join('comprobantecuentadetalle as cd', 'c.idcuentaplan', '=', 'cd.fkidcuentaplan')
                ->where('c.estado', '=', 'A')
                ->whereNull('c.deleted_at')
                ->orderBy('c.idcuentaplan', 'asc')
                ->get();

            if (sizeof($cuenta) > 0) {
                return response()->json([
                    'response'  => 0,
                ]);
            }

            $cuenta = DB::connection($connection)
                ->table('cuentaplan')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idcuentaplan', 'asc')
                ->get();

            foreach($cuenta as $c) {
                $data = new CuentaPlan();
                $data->setConnection($connection);
                $data->find($c->idcuentaplan)->delete();
            }
            
            $cuenta = DB::connection($connection)
                ->table('cuentaplanejemplo')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idcuentaplanejemplo', 'asc')
                ->get();

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();

            $idorigen = 0;

            for ($i = 0; $i < sizeof($cuenta); $i++) {
                $c = $cuenta[$i];
                $fkidpadre = $c->fkidcuentaplanejemplopadre;
                if ($fkidpadre != null) {
                    $fkidpadre = (int)$fkidpadre + (int)$idorigen - 1;
                }
                $data = new CuentaPlan();
                $data->setConnection($connection);
                $data->codcuenta = $this->generarCodigo($c->codcuenta, $config->formato);
                $data->nombre = $c->nombre;
                $data->estado = $c->estado;
                $data->fkidcuentaplanpadre = $fkidpadre;
                $data->fkidcuentaplantipo = $c->fkidcuentaplantipo;
                $data->save();

                if ($i == 0) {
                    $idorigen = $data->idcuentaplan;
                }
            }

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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

    public function generarCodigo($codigo, $formato) {
        $arrayformato = explode('.', $formato);
        $arraycodigo = explode('.', $codigo);
        $contador = 0;
        $nuevocodigo = '';

        while ($contador < sizeof($arrayformato)) {
            $cantform = sizeof(str_split($arrayformato[$contador], 1));
            $cantcod  = sizeof(str_split($arraycodigo[$contador], 1));
            for ($i = $cantcod; $i < $cantform; $i++) {
                $nuevocodigo = $nuevocodigo.'0';
            }
            $limite = 0;
            $bandera = 0;
            if ($cantform < $cantcod) {
                $limite = $cantform;
                $bandera = 1;
            }else {
                if ($cantform > $cantcod) {
                    $limite = $cantcod;
                    $bandera = 0;
                }else {
                    $limite = $cantform;
                    $bandera = 2;
                }
            }
            if ($contador == sizeof($arraycodigo) - 1) {
                if ($bandera == 0) {
                    for ($j = 0; $j < $limite; $j++) {
                        $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$j];
                    }
                }else {
                    if ($bandera == 1) {
                        for ($j = 0; $j < $limite; $j++) {
                            $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$cantcod - 1 - $j];
                        }
                    }else {
                        for ($j = 0; $j < $limite; $j++) {
                            $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$j];
                        }
                    }
                }

            }else {
                if ($bandera == 0) {
                    for ($j = 0; $j < $limite; $j++) {
                        $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$j];
                    }
                }else {
                    if ($bandera == 1) {
                        for ($j = 0; $j < $limite; $j++) {
                            $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$cantcod - 1 - $j];
                        }
                    }else {
                        for ($j = 0; $j < $limite; $j++) {
                            $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$j];
                        }
                    }
                }
                $nuevocodigo = $nuevocodigo.'.';
            }
            $contador = $contador + 1;
        }

        while ($contador < sizeof($arraycodigo)) {
            
            $cantcod  = sizeof(str_split($arraycodigo[$contador], 1));

            if ($contador == sizeof($arraycodigo) - 1) {
                for ($j = 0; $j < $cantcod; $j++) {
                    $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$j];
                }
            }else {
                for ($j = 0; $j < $cantcod; $j++) {
                    $nuevocodigo = $nuevocodigo.str_split($arraycodigo[$contador], 1)[$j];
                }
                $nuevocodigo = $nuevocodigo.$arraycodigo[$contador].'.';
            }
            $contador = $contador + 1;
        }

        return $nuevocodigo;
    }

    public function reporte(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $value = $request->value;
            $user = $request->usuario;

            $data = DB::connection($connection)
                ->table('cuentaplan as c')
                ->join('cuentaplantipo as cp', 'c.fkidcuentaplantipo', '=', 'cp.idcuentaplantipo')
                ->select('c.idcuentaplan', 'c.codcuenta', 'c.nombre', 'cp.descripcion as tipo', 
                    'c.fkidcuentaplanpadre'
                )
                ->where('c.estado', '=', 'A')
                ->whereNull('c.deleted_at')
                ->orderBy('c.idcuentaplan', 'asc')
                ->get();

            $cuenta = json_decode($request->cuenta);

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $pdf = PDF::loadView('sistema.src.contable.reporte.pdf.cuenta_plan', [
                'data'  => $data,
                'logo'  => $config->logoreporte,
                'fecha' => $fecha,
                'hora'  => $hora,
                'cuenta'=> $cuenta,
            ]);

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(500, 810, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(40, 810, $user, null, 8, array(0, 0, 0));

            if ($value == 'P') {
                return $pdf->stream('cuenta_plan.pdf');
            }

            return Excel::download(new CuentaPlanExport($data), 'cuenta_plan.xlsx');

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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idpadre = $request->idpadre;
            $idcuentatipo = $request->idcuentatipo;
            $nombre = $request->nombre;
            $codigo = $request->codigo;
            $esctadetalle = $request->esctadetalle;

            $validar = DB::connection($connection)
                ->table('cuentaplan')
                ->where('codcuenta', '=', $codigo)
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->orderBy('idcuentaplan', 'asc')
                ->get();

            if (sizeof($validar) > 0) {
                return response()->json([
                    'response'  => 0,
                ]);
            }

            $data = new CuentaPlan();
            $data->codcuenta = $codigo;
            $data->nombre = $nombre;
            $data->fkidcuentaplanpadre = $idpadre;
            $data->fkidcuentaplantipo = $idcuentatipo;
            $data->esctadetalle = $esctadetalle;
            $data->estado = 'A';
            $data->setConnection($connection);
            $data->save();
            
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Guardo Plan de Cuenta ' . $data->idcuentaplan;
            $log->guardar($request, $accion);

            $cuentaplan = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'data'      => $cuentaplan,
                'cuenta'    => $data,
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;
            $nombre = $request->nombre;
            $codigo = $request->codigo;
            $codigooriginal = $request->codigooriginal;

            if ($codigooriginal != $codigo) {
                $validar = DB::connection($connection)
                    ->table('cuentaplan')
                    ->where('codcuenta', '=', $codigo)
                    ->where('estado', '=', 'A')
                    ->whereNull('deleted_at')
                    ->orderBy('idcuentaplan', 'asc')
                    ->get();

                if (sizeof($validar) > 0) {
                    return response()->json([
                        'response'  => 0,
                    ]);
                }
            }

            $data = new CuentaPlan();
            $data->setConnection($connection);
            $cuenta = $data->find($id);
            $cuenta->codcuenta = $codigo;
            $cuenta->nombre = $nombre;
            $cuenta->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito Plan de Cuenta ' . $cuenta->idcuentaplan;
            $log->guardar($request, $accion);
            
            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;

            $cuenta = DB::connection($connection)
                ->table('cuentaplan as c')
                ->where('c.fkidcuentaplanpadre', '=', $id)
                ->where('c.estado', '=', 'A')
                ->whereNull('c.deleted_at')
                ->get();

            if (sizeof($cuenta) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite eliminar por que tiene sub cuenta!!!'
                ]);
            }

            $cuenta = DB::connection($connection)
                ->table('cuentaplan as c')
                ->join('comprobantecuentadetalle as cd', 'c.idcuentaplan', '=', 'cd.fkidcuentaplan')
                ->where('c.idcuentaplan', '=', $id)
                ->where('c.estado', '=', 'A')
                ->whereNull('c.deleted_at')
                ->whereNull('cd.deleted_at')
                ->get();

            if (sizeof($cuenta) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite eliminar por que tiene transacciones!!!'
                ]);
            }

            $data = new CuentaPlan();
            $data->setConnection($connection);
            $cuenta = $data->find($id);
            $cuenta->delete();
            
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino Plan de Cuenta ' . $cuenta->idcuentaplan;
            $log->guardar($request, $accion);

            $data =$this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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

    public function get_codigo(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $codigo = $request->codigo;

            $data = DB::connection($connection)
                ->table('cuentaplan as c')
                ->select('c.idcuentaplan', 'c.codcuenta', 'c.nombre', 'c.fkidcuentaplanpadre')
                ->where('c.codcuenta', 'ilike', '%'.$codigo.'%')
                ->where('c.estado', '=', 'A')
                ->whereNull('c.deleted_at')
                ->orderBy('c.idcuentaplan', 'asc')
                ->get();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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

    public function get_cuenta(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $nombre = $request->nombre;

            $data = DB::connection($connection)
                ->table('cuentaplan as c')
                ->select('c.idcuentaplan', 'c.codcuenta', 'c.nombre', 'c.fkidcuentaplanpadre')
                ->where('c.nombre', 'ilike', '%'.$nombre.'%')
                ->orWhere('c.codcuenta', 'ilike', '%'.$nombre.'%')
                ->where('c.estado', '=', 'A')
                ->whereNull('c.deleted_at')
                ->orderBy('c.idcuentaplan', 'asc')
                ->get();

            return response()->json([
                'response'  => 1,
                'data'      => $data,
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
}
