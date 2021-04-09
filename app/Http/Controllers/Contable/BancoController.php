<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\Banco;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\Seguridad\Log;

class BancoController extends Controller
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
            ->table('banco')
            ->select('idbanco', 'nombre', 'cuenta', 'estado', 'fkidbancopadre')
            ->where('estado', '=', 'A')
            ->whereNull('deleted_at')
            ->orderBy('idbanco')
            ->get();
        
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

            $nombre = $request->input('nombre');
            $cuenta = $request->input('cuenta');
            $idbanco = $request->input('idbanco');

            $get_data = DB::connection($connection)
                ->table('banco')
                ->where('nombre', '=', $nombre)
                ->whereNull('deleted_at')
                ->get();
            
            if (sizeof($get_data) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message'   => 'No se permite nombre repetido!!!',
                ]);
            }

            $data = new Banco();
            $data->nombre = $nombre;
            $data->cuenta = $cuenta;
            $data->estado = 'A';
            $data->fkidbancopadre = $idbanco;
            $data->setConnection($connection);
            $data->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Registro en Banco ' . $data->idbanco;;
            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en crear banco!!!',
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

            

            $get_data = DB::connection($connection)
                            ->table('banco as b')
                            ->join('comprobante as c', 'b.idbanco', '=', 'c.fkidbanco')
                            ->where('b.idbanco', '=', $id)
                            ->where('b.estado', '=', 'A')
                            ->whereNull('b.deleted_at')
                            ->whereNull('c.deleted_at')
                            ->get();
            
            if (sizeof($get_data) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message'   => 'No se permite editar por que tiene transacciones!!!',
                ]);
            }

            $data = new Banco();
            $data->setConnection($connection);
            $banco = $data->find($id);

            return response()->json([
                'response'  => 1,
                'data'      => $banco,
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
    public function update(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $nombre = $request->input('nombre');
            $cuenta = $request->input('cuenta');
            $id = $request->input('id');

            $data = new Banco();
            $data->setConnection($connection);
            $banco = $data->find($id);

            if ($nombre != $banco->nombre) {
                $get_data = DB::connection($connection)
                    ->table('banco')
                    ->where('nombre', '=', $nombre)
                    ->whereNull('deleted_at')
                    ->get();
                
                if (sizeof($get_data) > 0) {
                    return response()->json([
                        'response'  => 0,
                        'message'   => 'No se permite nombre repetido!!!',
                    ]);
                }
            }
            $banco->nombre = $nombre;
            $banco->cuenta = $cuenta;
            $banco->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el Banco ' . $banco->idbanco;
            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en actualizar banco!!!',
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

            $idbanco = $request->input('idbanco');

            $banco = DB::connection($connection)
                ->table('banco as b')
                ->where('b.fkidbancopadre', '=', $idbanco)
                ->where('b.estado', '=', 'A')
                ->whereNull('b.deleted_at')
                ->get();

            if (sizeof($banco) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite eliminar por que tiene sub banco!!!'
                ]);
            }

            $cuenta = DB::connection($connection)
                ->table('banco as b')
                ->join('comprobante as c', 'b.idbanco', '=', 'c.fkidbanco')
                ->where('b.idbanco', '=', $idbanco)
                ->where('b.estado', '=', 'A')
                ->whereNull('b.deleted_at')
                ->whereNull('c.deleted_at')
                ->get();

            if (sizeof($cuenta) > 0) {
                return response()->json([
                    'response'  => 0,
                    'message' => 'No se permite eliminar por que tiene transacciones!!!'
                ]);
            }


            $data = new Banco();
            $data->setConnection($connection);
            $banco = $data->find($idbanco);
            $banco->delete();
            
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el Banco ' . $banco->idbanco;
            $log->guardar($request, $accion);

            $data = $this->get_data($connection);

            return response()->json([
                'response'  => 1,
                'message'   => 'Exito en eliminar banco!!!',
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
