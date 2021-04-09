<?php

namespace App\Http\Controllers\Configuracion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Configuracion\TipoCambio;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class TipoCambioController extends Controller
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

            $tipcamb = new TipoCambio();
            $tipcamb->setConnection($connection);

            if ($buscar == '') {

                $tipocambio = $tipcamb->leftJoin('moneda as moning', 'tipocambio.fkidmonedauno', '=', 'moning.idmoneda')
                    ->leftJoin('moneda as moncamb', 'tipocambio.fkidmonedados', '=', 'moncamb.idmoneda')
                    ->select('tipocambio.idtipocambio', 'tipocambio.valor', 'tipocambio.fecha', 'tipocambio.estado',
                        'moning.descripcion as monedaingresada', 'moncamb.descripcion as monedacambio'
                    )
                    ->orderBy('tipocambio.idtipocambio', 'desc')
                    ->paginate($paginacion);

            } else {
                $tipocambio = $tipcamb->leftJoin('moneda as moning', 'tipocambio.fkidmonedauno', '=', 'moning.idmoneda')
                    ->leftJoin('moneda as moncamb', 'tipocambio.fkidmonedados', '=', 'moncamb.idmoneda')
                    ->select('tipocambio.idtipocambio', 'tipocambio.valor', 'tipocambio.fecha', 'tipocambio.estado',
                        'moning.descripcion as monedaingresada', 'moncamb.descripcion as monedacambio'
                    )
                    ->where('tipocambio.valor', 'ilike', '%'.$buscar.'%')
                    ->orWhere('moning.descripcion', 'ilike', '%'.$buscar.'%')
                    ->orWhere('moncamb.descripcion', 'ilike', '%'.$buscar.'%')
                    ->orderBy('tipocambio.idtipocambio', 'desc')
                    ->paginate($paginacion);
                
            }

            return [
                'pagination' => [
                    'total'        => $tipocambio->total(),
                    'current_page' => $tipocambio->currentPage(),
                    'per_page'     => $tipocambio->perPage(),
                    'last_page'    => $tipocambio->lastPage(),
                    'from'         => $tipocambio->firstItem(),
                    'to'           => $tipocambio->lastItem(),
                ],
                'data' => $tipocambio, 'response' => 1,
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

            $data = new Moneda();
            $data->setConnection($connection);
            $moneda = $data->orderBy('idmoneda', 'asc')->get();

            return [
                'response' => 1,
                'moneda' => $moneda,
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

            $data = new TipoCambio();
            $data->setConnection($connection);
            $data->valor = $request->valor;
            $data->fecha = $request->fecha;
            $data->fkidmonedauno = $request->idmonedaingresado;
            $data->fkidmonedados = $request->idmonedacambio;
            $data->estado = $request->estado;
            $data->setConnection($connection);
            $data->save();

            if ($request->estado == 'A') {
                $gettipocambio = DB::connection($connection)
                    ->table('tipocambio')
                    ->where('estado', '=', 'A')
                    ->where('idtipocambio', '<>', $data->idtipocambio)
                    ->where('fkidmonedauno', '=', $request->idmonedaingresado)
                    ->where('fkidmonedados', '=', $request->idmonedacambio)
                    ->whereNull('deleted_at')
                    ->get();

                foreach ($gettipocambio as $tipocambio) {
                    if ($tipocambio->idtipocambio != $data->idtipocambio) {
                        $tipcamb = new TipoCambio();
                        $tipcamb->setConnection($connection);
                        $dos = $tipcamb->find($tipocambio->idtipocambio);
                        $dos->estado = 'N';
                        $dos->setConnection($connection);
                        $dos->update();
                    }
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Registro un tipo de cambio ' . $data->idtipocambio;;
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

            $data = new Moneda();
            $data->setConnection($connection);
            $moneda = $data->orderBy('idmoneda', 'asc')->get();

            $data = new TipoCambio();
            $data->setConnection($connection);
            $tipocambio = $data->find($id);

            return [
                'response' => 1,
                'moneda' => $moneda,
                'tipocambio' => $tipocambio,
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

            $data = TipoCambio::find($request->id);
            $data->setConnection($connection);
            $data->valor = $request->valor;
            $data->fecha = $request->fecha;
            $data->fkidmonedauno = $request->idmonedaingresado;
            $data->fkidmonedados = $request->idmonedacambio;
            $data->estado = $request->estado;
            $data->setConnection($connection);
            $data->update();

            if ($request->estado == 'A') {
                $gettipocambio = DB::connection($connection)
                    ->table('tipocambio')
                    ->where('estado', '=', 'A')
                    ->where('idtipocambio', '<>', $data->idtipocambio)
                    ->where('fkidmonedauno', '=', $request->idmonedaingresado)
                    ->where('fkidmonedados', '=', $request->idmonedacambio)
                    ->whereNull('deleted_at')
                    ->get();

                foreach ($gettipocambio as $tipocambio) {
                    if ($tipocambio->idtipocambio != $request->id) {
                        $tipcamb = new TipoCambio();
                        $tipcamb->setConnection($connection);
                        $dos = $tipcamb->find($tipocambio->idtipocambio);
                        $dos->estado = 'N';
                        $dos->setConnection($connection);
                        $dos->update();
                    }
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito un tipo de cambio ' . $data->idtipocambio;;
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
    public function destroy(Request $request)
    {
        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = TipoCambio::find($request->id);
            $data->setConnection($connection);
            $data->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino un tipo de cambio ' . $data->idtipocambio;;
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
