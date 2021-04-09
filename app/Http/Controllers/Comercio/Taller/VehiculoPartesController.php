<?php

namespace App\Http\Controllers\Comercio\Taller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use App\Models\Comercio\Taller\VehiculoPartes;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;


class VehiculoPartesController extends Controller
{
    public function index(Request $request)
    {

        if (!$request->ajax()) {
            return view('commerce::admin.template');
        }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $buscar = $request->buscar;
            $paginacion = $request->pagina;

            $vehp = new VehiculoPartes();
            $vehp->setConnection($connection);
            if ($buscar == ''){

                $vehiculoPartes = $vehp->orderBy('idvehiculopartes', 'desc')
                                        ->paginate($paginacion);

            } else{
                $vehiculoPartes = $vehp->where('idvehiculopartes', 'ilike', '%'.$buscar.'%')
                                        ->orWhere('nombre', 'ilike', '%'.$buscar.'%')
                                        ->orWhere('estado', 'ilike', '%'.$buscar.'%')
                                        ->orderBy('idvehiculopartes', 'desc')
                                        ->paginate($paginacion);
            }

            return response()->json([
                'pagination' => [
                    'total'        => $vehiculoPartes->total(),
                    'current_page' => $vehiculoPartes->currentPage(),
                    'per_page'     => $vehiculoPartes->perPage(),
                    'last_page'    => $vehiculoPartes->lastPage(),
                    'from'         => $vehiculoPartes->firstItem(),
                    'to'           => $vehiculoPartes->lastItem(),
                ],
                'vehiculoPartes' => $vehiculoPartes, 'pagina' => $paginacion, 'buscar' => $buscar
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

    public function getVehiculoPartes(Request $request){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehp = new VehiculoPartes();
            $vehp->setConnection($connection);
            $vehiculoPartes = $vehp->orderBy('idvehiculopartes', 'desc')->paginate(10);
            $data = $vehiculoPartes->getCollection();
            $pagination = array(
                'total' => $vehiculoPartes->total(),
                'current_page' => $vehiculoPartes->currentPage(),
                'per_page' => $vehiculoPartes->perPage(),
                'last_page' => $vehiculoPartes->lastPage(),
                'first' => $vehiculoPartes->firstItem(),
                'last' =>   $vehiculoPartes->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
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

    public function searchData(Request $request, $buscar){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehiculoParte = new VehiculoPartes();
            $vehiculoParte->setConnection($connection);

            $vehiculoParteBuscar = $vehiculoParte->where('idvehiculopartes','ilike','%'.$buscar.'%')
                                    ->orwhere('nombre','ilike','%'.$buscar.'%')
                                    ->paginate(10);
            $data = $vehiculoParteBuscar->getCollection();
            $pagination = array(
                'total' => $vehiculoParteBuscar->total(),
                'current_page' => $vehiculoParteBuscar->currentPage(),
                'per_page' => $vehiculoParteBuscar->perPage(),
                'last_page' => $vehiculoParteBuscar->lastPage(),
                'first' => $vehiculoParteBuscar->firstItem(),
                'last' =>   $vehiculoParteBuscar->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
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

    public function changeSizePagination(Request $request, $cantidadPagina){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehiculoParte = new VehiculoPartes();
            $vehiculoParte->setConnection($connection);

            $vehiculoPartes = $vehiculoParte->orderBy('idvehiculopartes', 'desc')->paginate($cantidadPagina);
            $data = $vehiculoPartes->getCollection();
            $pagination = array(
                'total' => $vehiculoPartes->total(),
                'current_page' => $vehiculoPartes->currentPage(),
                'per_page' => $vehiculoPartes->perPage(),
                'last_page' => $vehiculoPartes->lastPage(),
                'first' => $vehiculoPartes->firstItem(),
                'last' =>   $vehiculoPartes->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
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

    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $descripcion = $request->input('descripcion');

            $vehiculoParte = new VehiculoPartes();
            $vehiculoParte->setConnection($connection);
            $vehiculoParte->nombre = $descripcion;
            // $vehiculoParte->estado = 'A';

            $vehiculoParte->save();
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el vehiculoparte ' . $vehiculoParte->idvehiculopartes;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'data' =>  $vehiculoParte
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

    public function show(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vehp = new VehiculoPartes();
            $vehp->setConnection($connection);
            $vehiculoParte = $vehp->orderBy('idvehiculopartes', 'asc')->get();

            return response()->json([
                'ok' => true,
                'data' => $vehiculoParte
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

    public function get_data(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vehp = new VehiculoPartes();
            $vehp->setConnection($connection);
            $vehiculoParte = $vehp->orderBy('idvehiculopartes', 'asc')->get();

            return response()->json([
                'response' => 1,
                'data' => $vehiculoParte,
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

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehp = new VehiculoPartes();
            $vehp->setConnection($connection);

            $vehiculoParte = $vehp->find($id);
            if ($vehiculoParte == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            return response()->json([
                'response' => 1,
                'data' => $vehiculoParte
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

    public function update(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehp = new VehiculoPartes();
            $vehp->setConnection($connection);
            $vehiculoParte = $vehp->find($id);
            if ($vehiculoParte == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            $vehiculoParte->nombre = $request->descripcion;
            $vehiculoParte->estado = $request->estado;
            $vehiculoParte->setConnection($connection);
            $vehiculoParte->update();
            $vehiculoPartes = $vehp->orderBy('idvehiculopartes', 'ASC')->paginate(10);
            $data = $vehiculoPartes->getCollection();
            $pagination = array(
                "total" => $vehiculoPartes->total(),
                "current_page" => $vehiculoPartes->currentPage(),
                "per_page" => $vehiculoPartes->perPage(),
                "last_page" => $vehiculoPartes->lastPage(),
                "first" => $vehiculoPartes->firstItem(),
                "last" =>   $vehiculoPartes->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el vehiculoparte ' . $vehiculoParte->idvehiculopartes;
            $log->guardar($request, $accion);

            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data
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

    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->id;

            $vehiculoParte = DB::connection($connection)
                                ->table('vehiculopartes as vp')
                                ->join('vehicpartesventadetalle as vpvd', 'vpvd.fkidvehiculopartes', '=', 'vp.idvehiculopartes')
                                ->where('vp.idvehiculopartes', '=', $id)
                                ->get();

            if (sizeof($vehiculoParte) > 0) {
                return response()->json(array('response' => 0, 'data' => $id));
            }

            $vehp = new VehiculoPartes();
            $vehp->setConnection($connection);
            $vehp->find($id)->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el vehiculoparte ' . $id;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'data' => $id
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
}
