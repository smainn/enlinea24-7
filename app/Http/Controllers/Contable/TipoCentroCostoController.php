<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\CentroCostoTipo;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\Seguridad\Log;

class TipoCentroCostoController extends Controller
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

            return response()->json([
                'response'  => 1,
                'data'   => $data,

                'pagination' => [
                    'total'         => $data->total(),
                    'current_page'  => $data->currentPage(),
                    'per_page'      => $data->perPage(),
                    'last_page'     => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'          => $data->lastItem(),
                ],
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
                'message'   => 'No se pudo crear banco!!!',
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
            ->table('centrocostotipo')
            ->select('idcentrocostotipo', 'descripcion', 'nombreinterno')
            ->whereNull('deleted_at')
            ->orderBy('idcentrocostotipo')
            ->paginate(10);
        
        return $data;
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

            $nombreinterno = $request->input('nombreinterno');
            $descripcion = $request->input('descripcion');
            $id = $request->input('id');

            $log = new Log();
            $log->setConnection($connection);

            if ($id == null) {
                $data = new CentroCostoTipo();
                $data->descripcion = $descripcion;
                $data->nombreinterno = $nombreinterno;
                $data->setConnection($connection);
                $data->save();
                
                $accion = 'Inserto CentroCostoTipo ' . $data->idcentrodecosto;

            } else {
                $data = CentroCostoTipo::find($id);
                $data->descripcion = $descripcion;
                $data->nombreinterno = $nombreinterno;
                $data->setConnection($connection);
                $data->update();

                $accion = 'Edito CentroCostoTipo ' . $data->idcentrodecosto;
            }

            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en crear Tipo Costo!!!',

                'data'   => $data,

                'pagination' => [
                    'total'         => $data->total(),
                    'current_page'  => $data->currentPage(),
                    'per_page'      => $data->perPage(),
                    'last_page'     => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'          => $data->lastItem(),
                ],
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
                'message'   => 'No se pudo crear banco!!!',
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
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = DB::connection($connection)
                ->table('centrocostotipo')
                ->select('idcentrocostotipo', 'descripcion', 'nombreinterno')
                ->where('idcentrocostotipo', '=', $id)
                ->whereNull('deleted_at')
                ->first();

            return response()->json([
                'response'  => 1,
                'data'   => $data,
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
                'message'   => 'No se pudo crear banco!!!',
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
    public function update(Request $request, $id)
    {
        //
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

            $id = $request->input('id');

            $centrodecosto = DB::connection($connection)
                ->table('centrodecosto')
                ->where('fkidcentrocostotipo', '=', $id)
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->get();

            if (sizeof($centrodecosto) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite eliminar por que esta en una transaccion!!!'
                ]);
            }

            $data = new CentroCostoTipo();
            $data->setConnection($connection);
            $centrodecostotipo = $data->find($id);
            $centrodecostotipo->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el CentroCostoTipo' . $centrodecostotipo->idcentrodecosto;
            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en crear Tipo Costo!!!',

                'data'   => $data,

                'pagination' => [
                    'total'         => $data->total(),
                    'current_page'  => $data->currentPage(),
                    'per_page'      => $data->perPage(),
                    'last_page'     => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'          => $data->lastItem(),
                ],
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
                'message'   => 'No se pudo crear banco!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }
}
