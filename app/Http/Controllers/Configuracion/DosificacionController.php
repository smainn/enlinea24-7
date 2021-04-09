<?php

namespace App\Http\Controllers\Configuracion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\Sucursal;
use App\Models\Configuracion\ActividadEconomica;
use App\Models\Configuracion\Dosificacion;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class DosificacionController extends Controller
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

            $buscar = $request->buscar;
            $paginacion = $request->pagina;

            $activ = new Dosificacion();
            $activ->setConnection($connection);

            if ($buscar == '') {

                $dosificacion = $activ->leftJoin('sucursal as s', 's.idsucursal', '=', 'facdosificacion.fkidsucursal')
                    ->select('facdosificacion.idfacdosificacion', 's.nombrecomercial', 's.razonsocial', 'facdosificacion.numerotramite',
                        'facdosificacion.fechaactivacion', 'facdosificacion.numeroautorizacion', 
                        'facdosificacion.nombresfcmarca', 'facdosificacion.fechalimiteemision', 'facdosificacion.estado'
                    )
                    ->orderBy('facdosificacion.idfacdosificacion', 'desc')
                    ->paginate($paginacion);

            } else {
                $dosificacion = $activ->leftJoin('sucursal as s', 's.idsucursal', '=', 'facdosificacion.fkidsucursal')
                    ->select('facdosificacion.idfacdosificacion', 's.nombrecomercial', 's.razonsocial', 'facdosificacion.numerotramite',
                        'facdosificacion.fechaactivacion', 'facdosificacion.numeroautorizacion', 
                        'facdosificacion.nombresfcmarca', 'facdosificacion.fechalimiteemision', 'facdosificacion.estado'
                    )
                    ->where('facdosificacion.numerotramite', 'ilike', '%'.$buscar.'%')
                    ->orWhere('facdosificacion.numeroautorizacion', 'ilike', '%'.$buscar.'%')
                    ->orWhere('s.nombrecomercial', 'ilike', '%'.$buscar.'%')
                    ->orWhere('s.razonsocial', 'ilike', '%'.$buscar.'%')
                    ->orderBy('facdosificacion.idfacdosificacion', 'desc')
                    ->paginate($paginacion);
                
            }

            return [
                'pagination' => [
                    'total'        => $dosificacion->total(),
                    'current_page' => $dosificacion->currentPage(),
                    'per_page'     => $dosificacion->perPage(),
                    'last_page'    => $dosificacion->lastPage(),
                    'from'         => $dosificacion->firstItem(),
                    'to'           => $dosificacion->lastItem(),
                ],
                'data' => $dosificacion, 'response' => 1,
            ];
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = new Sucursal();
            $data->setConnection($connection);
            $sucursal = $data->orderBy('idsucursal', 'asc')->get();

            $act = new ActividadEconomica();
            $act->setConnection($connection);
            $actividad_economica = $act->orderBy('idfacactividadeconomica', 'asc')->get();

            return [
                'response' => 1,
                'sucursal' => $sucursal,
                'actividadeconomica' => $actividad_economica,
            ];
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
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

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $estado = $request->estado;

            $data = new Dosificacion();

            $data->titulo = $request->titulo;
            $data->subtitulo = $request->subtitulo;
            $data->descripcion = $request->descripcion;
            $data->nit = $request->nit;
            $data->numerotramite = $request->numerotramite;
            $data->numerocorrelativo = 1;
            $data->numeroautorizacion = $request->numeroautorizacion;
            $data->leyenda1piefactura = $request->leyenda1piefactura;
            $data->leyenda2piefactura = $request->leyenda2piefactura;
            $data->llave = $request->llave;
            $data->fechaactivacion = $request->fechaactivacion;
            $data->fechalimiteemision = $request->fechalimiteemision;
            $data->nombresfcmarca = $request->nombresfcmarca;
            $data->plantillafacturaurl = $request->plantillafacturaurl;
            $data->numfacturainicial = $request->numfacturainicial;
            $data->numfacturasiguiente = $request->numfacturasiguiente;
            $data->notas = null;
            $data->tipofactura = $request->tipofactura;
            $data->fkidsucursal = $request->fkidsucursal;
            $data->fkidfacactividadeconomica = $request->fkidfacactividadeconomica;
            $data->estado = $estado;

            $data->setConnection($connection);
            $data->save();

            if ($estado == 'A') {
                $getdosificacion = DB::connection($connection)
                    ->table('facdosificacion')
                    ->where('estado', '=', 'A')
                    ->where('idfacdosificacion', '!=', $data->idfacdosificacion)
                    ->whereNull('deleted_at')
                    ->get();

                foreach ($getdosificacion as $d) {
                    $dosif = new Dosificacion();
                    $dosif->setConnection($connection);
                    $dos = $dosif->find($d->idfacdosificacion);
                    $dos->estado = 'F';
                    $dos->setConnection($connection);
                    $dos->update();
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Registro una dosificacion ' . $data->idfacdosificacion;;
            $log->guardar($request, $accion);

            DB::commit();

            return [
                'response' => 1,
            ];
            
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion',
                'error' => [
                    'line' => $e->getLine(),
                    'file' => $e->getFile(),
                    'message' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'line' => $th->getLine(),
                    'file' => $th->getFile(),
                    'message' => $th->getMessage()
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
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = new Sucursal();
            $data->setConnection($connection);
            $sucursal = $data->get();

            $act = new ActividadEconomica();
            $act->setConnection($connection);
            $actividad_economica = $act->get();

            $data = new Dosificacion();
            $data->setConnection($connection);
            $dosificacion = $data->find($id);

            return [
                'response' => 1,
                'sucursal' => $sucursal,
                'actividadeconomica' => $actividad_economica,
                'dosificacion' => $dosificacion,
            ];
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
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

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $estado = $request->estado;

            $data = new Dosificacion();
            $data->setConnection($connection);
            $dosificacion = $data->find($request->id);

            $dosificacion->titulo = $request->titulo;
            $dosificacion->subtitulo = $request->subtitulo;
            $dosificacion->descripcion = $request->descripcion;
            $dosificacion->nit = $request->nit;
            $dosificacion->numerotramite = $request->numerotramite;
            $dosificacion->numerocorrelativo = 1;
            $dosificacion->numeroautorizacion = $request->numeroautorizacion;
            $dosificacion->leyenda1piefactura = $request->leyenda1piefactura;
            $dosificacion->leyenda2piefactura = $request->leyenda2piefactura;
            $dosificacion->llave = $request->llave;
            $dosificacion->fechaactivacion = $request->fechaactivacion;
            $dosificacion->fechalimiteemision = $request->fechalimiteemision;
            $dosificacion->nombresfcmarca = $request->nombresfcmarca;
            $dosificacion->plantillafacturaurl = $request->plantillafacturaurl;
            $dosificacion->numfacturainicial = $request->numfacturainicial;
            $dosificacion->numfacturasiguiente = $request->numfacturasiguiente;
            $dosificacion->notas = null;
            $dosificacion->tipofactura = $request->tipofactura;
            $dosificacion->fkidsucursal = $request->fkidsucursal;
            $dosificacion->fkidfacactividadeconomica = $request->fkidfacactividadeconomica;
            $dosificacion->estado = $request->estado;

            $dosificacion->setConnection($connection);
            $dosificacion->update();

            if ($estado == 'A') {
                $getdosificacion = DB::connection($connection)
                    ->table('facdosificacion')
                    ->where('estado', '=', 'A')
                    ->where('idfacdosificacion', '!=', $dosificacion->idfacdosificacion)
                    ->whereNull('deleted_at')
                    ->get();

                foreach ($getdosificacion as $d) {
                    $dosif = new Dosificacion();
                    $dosif->setConnection($connection);
                    $dos = $dosif->find($d->idfacdosificacion);
                    $dos->estado = 'F';
                    $dos->setConnection($connection);
                    $dos->update();
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Actualizo una dosificacion ' . $dosificacion->idfacdosificacion;;
            $log->guardar($request, $accion);

            DB::commit();

            return [
                'response' => 1,
            ];
            
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
