<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\CentroDeCosto;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\Seguridad\Log;

class CentroDeCostoController extends Controller
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
            ->table('centrodecosto')
            ->select('idcentrodecosto', 'codcentrocosto', 'nombre', 'estado', 
                'fkidcentrocostotipo', 'fkidcentrodecostopadre'
            )
            ->where('estado', '=', 'A')
            ->whereNull('deleted_at')
            ->orderBy('idcentrodecosto')
            ->get();
        
        return $data;
    }

    public function get_tipo_costo(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = DB::connection($connection)
                ->table('centrocostotipo')
                ->select('idcentrocostotipo', 'descripcion', 'nombreinterno')
                ->whereNull('deleted_at')
                ->orderBy('idcentrocostotipo')
                ->get();

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

            $nombre = $request->input('nombre');
            $codigo = $request->input('codigo');
            $idcentrocostotipo = $request->input('idcentrocostotipo');
            $id_padre = $request->input('id_padre');

            $data = new CentroDeCosto();
            $data->nombre = $nombre;
            $data->codcentrocosto = $codigo;
            $data->fkidcentrocostotipo = $idcentrocostotipo;
            $data->fkidcentrodecostopadre = $id_padre;
            $data->estado = 'A';
            $data->setConnection($connection);
            $data->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Guardo el Centro de costo ' . $data->idcentrodecosto;
            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en crear Centro Costo!!!',
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

            $nombre = $request->input('nombre');
            $codigo = $request->input('codigo');
            $idcentrocostotipo = $request->input('idcentrocostotipo');
            $id = $request->input('id');

            $centro_costo = new CentroDeCosto();
            $centro_costo->setConnection($connection);
            $data = $centro_costo->find($id);

            $data->nombre = $nombre;
            $data->codcentrocosto = $codigo;
            $data->fkidcentrocostotipo = $idcentrocostotipo;
            $data->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el Centro de costo ' . $data->idcentrodecosto;
            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en actualizar Centro Costo!!!',
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
            
            $data = DB::connection($connection)
                ->table('centrodecosto')
                ->where('estado', '=', 'A')
                ->where('fkidcentrodecostopadre', '=', $id)
                ->whereNull('deleted_at')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite eliminar por que tiene sub centro costo!!!'
                ]);
            }

            $data = DB::connection($connection)
                ->table('centrodecosto as c')
                ->join('comprobantecuentadetalle as co', 'c.idcentrodecosto', '=', 'co.fkidcentrodecosto')
                ->where('c.idcentrodecosto', '=', $id)
                ->where('c.estado', '=', 'A')
                ->whereNull('co.deleted_at')
                ->whereNull('c.deleted_at')
                ->get();

            if (sizeof($data) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite eliminar por que tiene transacciones!!!'
                ]);
            }


            $centro_costo = new CentroDeCosto();
            $centro_costo->setConnection($connection);
            $data = $centro_costo->find($id);
            $data->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el Centro de costo ' . $data->idcentrodecosto;
            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en eliminar centro de costo!!!',
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
