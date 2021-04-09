<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Config\ConfigCliente;
use App\Models\Contable\GestionContable;
use App\Models\Contable\PeriodoContable;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

use PDF;

class GestionContableController extends Controller
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

            $data = DB::connection($connection)
                ->table('gestioncontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idgestioncontable')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->get();

            $detalle = DB::connection($connection)
                ->table('periodocontable')
                ->select('descripcion', 'fechaini', 'fechafin', 
                    'estado', 'fkidgestioncontable', 'idperiodocontable')
                ->whereNull('deleted_at')
                ->orderBy('fkidgestioncontable', 'asc')
                ->orderBy('fechaini', 'asc')
                ->get();

            return response()->json([
                'response'  => 1,
                'data' => $data,
                'detalle' => $detalle,
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
            $descripcion = $request->descripcion;
            $fechainicio = $request->fechainicio;
            $fechafin = $request->fechafin;

            $data = DB::connection($connection)
                ->table('gestioncontable')
                ->where('descripcion', '=', $descripcion)
                ->whereNull('deleted_at')
                ->get();

            if (sizeof($data)  > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite gestion repetido',
                ]);
            }

            $data = new GestionContable();
            $data->descripcion = $descripcion;
            $data->fechaini = $fechainicio;
            $data->fechafin = $fechafin;
            $data->estado = 'P';
            $data->setConnection($connection);

            $data->save();

            return response()->json([
                'response'  => 1,
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

    public function store_periodo(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $descripcion = $request->descripcion;
            $fechainicio = $request->fechainicio;
            $fechafin = $request->fechafin;
            $idgestion = $request->idgestion;

            $data = new PeriodoContable();
            $data->descripcion = $descripcion;
            $data->fechaini = $fechainicio;
            $data->fechafin = $fechafin;
            $data->fkidgestioncontable = $idgestion;
            $data->estado = 'A';
            $data->setConnection($connection);

            $data->save();

            return response()->json([
                'response'  => 1,
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
    public function show(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = DB::connection($connection)
                ->table('gestioncontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idgestioncontable')
                ->where('idgestioncontable', '=', $id)
                ->first();

            $detalle = DB::connection($connection)
                ->table('periodocontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idperiodocontable', 
                    'fkidgestioncontable'
                )
                ->where('fkidgestioncontable', '=', $id)
                ->whereNull('deleted_at')
                ->orderBy('idperiodocontable', 'desc')
                ->first();

            return response()->json([
                'response'  => 1,
                'data' => $data,
                'detalle' => $detalle,
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = DB::connection($connection)
                ->table('gestioncontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idgestioncontable')
                ->where('idgestioncontable', '=', $id)
                ->first();

            $periodo = DB::connection($connection)
                ->table('periodocontable')
                ->where('fkidgestioncontable', '=', $id)
                ->whereNull('deleted_at')
                ->get();

            $tipo = DB::connection($connection)
                ->table('comprobantetipo')
                ->where('fkidgestioncontable', '=', $id)
                ->whereNull('deleted_at')
                ->get();

            return response()->json([
                'response'  => 1,
                'data' => $data,
                'periodo' => sizeof($periodo),
                'tipo' => sizeof($tipo),
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


    public function editar_periodo(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = DB::connection($connection)
                ->table('periodocontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 
                    'idperiodocontable', 'fkidgestioncontable'
                )
                ->where('idperiodocontable', '=', $id)
                ->first();

            $comprobante = DB::connection($connection)
                ->table('comprobante')
                ->where('fkidperiodocontable', '=', $id)
                ->whereNull('deleted_at')
                ->get();

            $periodo = DB::connection($connection)
                ->table('periodocontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idperiodocontable')
                ->where('fkidgestioncontable', '=', $data->fkidgestioncontable)
                ->whereNull('deleted_at')
                ->orderBy('idperiodocontable', 'desc')
                ->first();

            return response()->json([
                'response'  => 1,
                'data' => $data,
                'comprobante' => sizeof($comprobante),
                'periodo' => $periodo,
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
            $descripcion = $request->descripcion;
            $fechainicio = $request->fechainicio;
            $fechafin = $request->fechafin;
            $id = $request->id;

            $obj = new GestionContable();
            $obj->setConnection($connection);
            $data = $obj->find($id);
            $data->descripcion = $descripcion;
            $data->fechaini = $fechainicio;
            $data->fechafin = $fechafin;
            $data->estado = $request->estado;

            $data->update();

            if ($request->estado == 'A') {
                $gestionperiodo = DB::connection($connection)
                    ->table('gestioncontable')
                    ->where('idgestioncontable', '!=', $data->idgestioncontable)
                    ->where('estado', '=', 'A')
                    ->whereNull('deleted_at')
                    ->get();

                foreach ($gestionperiodo as $gestion) {
                    $gest = new GestionContable();
                    $gest->setConnection($connection);
                    $dos = $gest->find($gestion->idgestioncontable);
                    $dos->estado = 'P';
                    $dos->setConnection($connection);
                    $dos->update();
                }
            }

            return response()->json([
                'response'  => 1,
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


    public function update_periodo(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $descripcion = $request->descripcion;
            $fechainicio = $request->fechainicio;
            $fechafin = $request->fechafin;
            $id = $request->id;

            $obj = new PeriodoContable();
            $obj->setConnection($connection);
            $data = $obj->find($id);
            $data->descripcion = $descripcion;
            $data->fechaini = $fechainicio;
            $data->fechafin = $fechafin;

            $data->update();

            return response()->json([
                'response'  => 1,
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
    public function delete_gestion(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $id = $request->id;

            $data = DB::connection($connection)
                ->table('gestioncontable as g')
                ->join('comprobantetipo as c', 'g.idgestioncontable', '=', 'c.fkidgestioncontable')
                ->where('g.idgestioncontable', '=', $id)
                ->whereNull('g.deleted_at')
                ->whereNull('c.deleted_at')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No permitido por tipo comprobante agregado!!!',
                ]);
            }

            $data = DB::connection($connection)
                ->table('gestioncontable as g')
                ->join('periodocontable as p', 'g.idgestioncontable', '=', 'p.fkidgestioncontable')
                ->where('g.idgestioncontable', '=', $id)
                ->whereNull('g.deleted_at')
                ->whereNull('p.deleted_at')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No permitido por periodo agregados!!!',
                ]);
            }

            $data = new GestionContable();
            $data->setConnection($connection);
            $gestion = $data->find($id);
            $gestion->delete();

            $data = DB::connection($connection)
                ->table('gestioncontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idgestioncontable')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->get();

            $detalle = DB::connection($connection)
                ->table('periodocontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'fkidgestioncontable')
                ->whereNull('deleted_at')
                ->orderBy('fkidgestioncontable', 'asc')
                ->orderBy('fechaini', 'asc')
                ->get();

            return response()->json([
                'response'  => 1,
                'data' => $data,
                'detalle' => $detalle,
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


    public function delete_periodo(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $id = $request->id;

            $data = DB::connection($connection)
                ->table('periodocontable as p')
                ->join('comprobante as c', 'p.idperiodocontable', '=', 'c.fkidperiodocontable')
                ->where('p.idperiodocontable', '=', $id)
                ->whereNull('p.deleted_at')
                ->whereNull('c.deleted_at')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No permitido por comprobante agregado!!!',
                ]);
            }

            $data = new PeriodoContable();
            $data->setConnection($connection);
            $periodo = $data->find($id);
            $periodo->delete();

            $data = DB::connection($connection)
                ->table('gestioncontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idgestioncontable')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->get();

            $detalle = DB::connection($connection)
                ->table('periodocontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'fkidgestioncontable')
                ->whereNull('deleted_at')
                ->orderBy('fkidgestioncontable', 'asc')
                ->orderBy('fechaini', 'asc')
                ->get();

            return response()->json([
                'response'  => 1,
                'data' => $data,
                'detalle' => $detalle,
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

    public function reporte(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
           
            $user = $request->usuario;

            $gestion = DB::connection($connection)
                ->table('gestioncontable')
                ->select('descripcion', 'fechaini', 'fechafin', 'estado', 'idgestioncontable')
                ->whereNull('deleted_at')
                ->orderBy('idgestioncontable', 'asc')
                ->get();

            $periodo = DB::connection($connection)
                ->table('periodocontable')
                ->select('descripcion', 'fechaini', 'fechafin', 
                    'estado', 'fkidgestioncontable', 'idperiodocontable')
                ->whereNull('deleted_at')
                ->orderBy('fkidgestioncontable', 'asc')
                ->orderBy('fechaini', 'asc')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $pdf = PDF::loadView('sistema.src.contable.reporte.pdf.gestion_periodo', [
                'gestion'  => $gestion,
                'periodo'  => $periodo,
                'logo'  => $config->logoreporte,
                'fecha' => $fecha,
                'hora'  => $hora,
            ]);

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(500, 800, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(40, 800, $user, null, 8, array(0, 0, 0));

            return $pdf->stream('gestion_periodo.pdf');

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
