<?php

namespace App\Http\Controllers\Configuracion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Configuracion\ActividadEconomica;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ActividadEconomicaController extends Controller
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

            $activ = new ActividadEconomica();
            $activ->setConnection($connection);

            if ($buscar == '') {

                $actividad_economica = $activ->select('idfacactividadeconomica', 'descripcion')
                    ->orderBy('idfacactividadeconomica', 'desc')
                    ->paginate($paginacion);

            } else {
                $actividad_economica = $activ->select('idfacactividadeconomica', 'descripcion')
                    ->where('descripcion', 'ilike', '%'.$buscar.'%')
                    ->orderBy('idfacactividadeconomica', 'desc')
                    ->paginate($paginacion);
                
            }

            return [
                'pagination' => [
                    'total'        => $actividad_economica->total(),
                    'current_page' => $actividad_economica->currentPage(),
                    'per_page'     => $actividad_economica->perPage(),
                    'last_page'    => $actividad_economica->lastPage(),
                    'from'         => $actividad_economica->firstItem(),
                    'to'           => $actividad_economica->lastItem(),
                ],
                'data' => $actividad_economica, 'response' => 1,
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
            DB::beginTransaction();
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $descripcion = $request->descripcion;

            $data = new ActividadEconomica();
            $data->descripcion = $descripcion;
            $data->setConnection($connection);
            $data->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Registro una actividad economica ' . $data->idfacactividadeconomica;;
            $log->guardar($request, $accion);

            $activ = new ActividadEconomica();
            $activ->setConnection($connection);

            $actividad_economica = $activ->select('idfacactividadeconomica', 'descripcion')
                ->orderBy('idfacactividadeconomica', 'desc')
                ->paginate(10);

            DB::commit();

            return [
                'pagination' => [
                    'total'        => $actividad_economica->total(),
                    'current_page' => $actividad_economica->currentPage(),
                    'per_page'     => $actividad_economica->perPage(),
                    'last_page'    => $actividad_economica->lastPage(),
                    'from'         => $actividad_economica->firstItem(),
                    'to'           => $actividad_economica->lastItem(),
                ],
                'data' => $actividad_economica, 'response' => 1,
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

            $data = new ActividadEconomica();
            $data->setConnection($connection);
            $actividad_economica = $data->find($id);

            return [
                'response' => 1,
                'data' => $actividad_economica,
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

            $descripcion = $request->descripcion;
            $id = $request->id;

            $actividad = new ActividadEconomica();
            $actividad->setConnection($connection);

            $data = $actividad->find($id);
            $data->descripcion = $descripcion;
            $data->setConnection($connection);
            $data->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Actualizo una actividad economica ' . $data->idfacactividadeconomica;;
            $log->guardar($request, $accion);

            $activ = new ActividadEconomica();
            $activ->setConnection($connection);

            $actividad_economica = $activ->select('idfacactividadeconomica', 'descripcion')
                ->orderBy('idfacactividadeconomica', 'desc')
                ->paginate(10);

            DB::commit();

            return [
                'pagination' => [
                    'total'        => $actividad_economica->total(),
                    'current_page' => $actividad_economica->currentPage(),
                    'per_page'     => $actividad_economica->perPage(),
                    'last_page'    => $actividad_economica->lastPage(),
                    'from'         => $actividad_economica->firstItem(),
                    'to'           => $actividad_economica->lastItem(),
                ],
                'data' => $actividad_economica, 'response' => 1,
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
    public function destroy(Request $request)
    {
        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = ActividadEconomica::find($request->id);
            $data->setConnection($connection);

            $getdosificacion = DB::connection($connection)
                ->table('facdosificacion')
                ->where('estado', '=', 'A')
                ->where('fkidfacactividadeconomica', '=', $data->idfacactividadeconomica)
                ->whereNull('deleted_at')
                ->get();

            if (sizeof($getdosificacion) > 0 ) {
                DB::rollBack();
                return [
                    'response' => 0,
                ];
            }

            $data->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino una actividad economica ' . $data->idfacactividadeconomica;
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
}
