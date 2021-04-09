<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Ventas\Ciudad;
use App\Models\Comercio\Ventas\Cliente;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class CiudadController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            $ciudad = $ciu->where('estado', '=', 'A')
                ->orderBy('idciudad', 'asc')
                ->get();

            return response()->json([
                "response" => 1, 
                "data" => $ciudad,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
        
    }

    public function create()
    {
        return view('commerce::create');
    }

    public function getCiudades(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            $ciudades = $ciu->where('estado', '=', 'A')
                            ->orderBy('idciudad', 'asc')
                            ->get();
            return response()->json([
                "ok" => true,
                "data" => $ciudades
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function store(Request $request)
    {
        try {

            DB::beginTransaction();
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id_padre = $request->input('id_padre');
            $descripcion = $request->input('descripcion');

            $familia = new Ciudad();

            $familia->descripcion = $descripcion;
            $familia->idpadreciudad = $id_padre;
            $familia->setConnection($connection);
            $familia->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserta la ciudad ' . $familia->idciudad;
            $log->guardar($request, $accion);

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            $ciudad = $ciu->where('estado', '=', 'A')
                ->orderBy('idciudad', 'asc')
                ->get();
                
            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $ciudad,
            ]);
            
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function edit()
    {
        return view('commerce::edit');
    }

    public function update(Request $request)
    {
        try {

            DB::beginTransaction();
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->input('id');
            $descripcion = $request->input('descripcion');

            $ciu = new Ciudad();
            $familia = $ciu->find($id);
            $familia->descripcion = $descripcion;
            $familia->setConnection($connection);
            $familia->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Actualizo la ciudad ' . $familia->idciudad;
            $log->guardar($request, $accion);

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            $ciudad = $ciu->where('estado', '=', 'A')
                ->orderBy('idciudad', 'asc')
                ->get();
        
            DB::commit();

            return response()->json([
                'response' => 1,
                'data' => $ciudad,
            ]);
            
        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function destroy(Request $request)
    {
        try {
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idFamilia = $request->input('id');

            $ciu = new Ciudad();
            $ciu->setConnection($connection);

            $cantidadHijo = $ciu->where('idpadreciudad', '=', $idFamilia)
                ->where('estado', '=', 'A')
                ->get();

            if (sizeof($cantidadHijo) > 0) {
                DB::commit();
                return response()->json([
                    'response'=> 0, 
                    'message' => 'No se pudo eliminar por que tiene sub ciudades'
                ]);
            }

            $cli = new Cliente();
            $cli->setConnection($connection);
            $productoFamilia = $cli->leftJoin('ciudad', 'cliente.fkidciudad', 'ciudad.idciudad')
                ->where('cliente.fkidciudad', '=', $idFamilia)
                ->get();

            if (sizeof($productoFamilia) > 0) {
                DB::commit();
                return response()->json([
                    'response'=> 0, 
                    'message' => 'No se pudo eliminar por que esta relacionado con clientes'
                ]);
            }

            $familia = $ciu->find($idFamilia);
            $familia->setConnection($connection);
            $familia->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la ciudad ' . $familia->idciudad;
            $log->guardar($request, $accion);

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            $ciudad = $ciu->where('estado', '=', 'A')
                ->orderBy('idciudad', 'asc')
                ->get();

            DB::commit();

            return response()->json([
                'response'=> 1,
                'data' => $ciudad,
            ]);

        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
        
    }
}
