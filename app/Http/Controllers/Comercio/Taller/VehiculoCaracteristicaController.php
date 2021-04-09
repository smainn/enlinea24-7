<?php

namespace App\Http\Controllers\Comercio\Taller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use App\Models\Comercio\Taller\DetalleVehiculoCaracteristica;
use App\Models\Comercio\Taller\VehiculoCaracteristica;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use App\CustomCollection;

class VehiculoCaracteristicaController extends Controller
{
    public function index(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);

            $datos = $vehc->orderBy('idvehiculocaracteristica', 'ASC')->paginate(10);
            $vehiculoCaracteristicas = $datos->getCollection();
            $data = array();
            $index = 0;
            foreach ($vehiculoCaracteristicas as $vehiculoCaracteristica) {
                $id = $vehiculoCaracteristica->idvehiculocaracteristica;
                $nombreCaracteristica = $vehiculoCaracteristica->caracteristica;
                $data[$index] = $vehiculoCaracteristica;
                $index++;
            }
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
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

    public function getBusqueda(Request $request, $buscar) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);

            $caracteristicaBusqueda = $vehc->where('idvehiculocaracteristica','ilike','%'.$buscar.'%')
                                        ->orwhere('caracteristica','ilike','%'.$buscar.'%')->paginate(10);
            $caracteristicas = $caracteristicaBusqueda->getCollection();
            $pagination = array(
                'total' => $caracteristicaBusqueda->total(),
                'current_page' => $caracteristicaBusqueda->currentPage(),
                'per_page' => $caracteristicaBusqueda->perPage(),
                'last_page' => $caracteristicaBusqueda->lastPage(),
                'first' => $caracteristicaBusqueda->firstItem(),
                'last' =>   $caracteristicaBusqueda->lastItem()
            );
            return [
                'response' => 1,
                'buscar' => $buscar,
                'pagination' => $pagination,
                'data' => $caracteristicas
            ];
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function changeSizePagination(Request $request, $cantidadPagina) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);

            $datos = $vehc->orderBy('idvehiculocaracteristica', 'ASC')->paginate($cantidadPagina);
            $data = $datos->getCollection();
            $pagination = array(
                "total" => $datos->total(),
                "current_page" => $datos->currentPage(),
                "per_page" => $datos->perPage(),
                "last_page" => $datos->lastPage(),
                "first" => $datos->firstItem(),
                "last" =>   $datos->lastItem()
            );
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

    public function create(Request $request)
    {
        if (!$request->ajax()) {
            return view('commerce::admin.template');
        }
    }

    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);

            $nombre = $request->caracteristica;
            $vehiculoCaracteristica = new VehiculoCaracteristica();
            $vehiculoCaracteristica->caracteristica = $nombre;
            $vehiculoCaracteristica->setConnection($connection);
            $vehiculoCaracteristica->save();

            $datos = $vehc->orderBy('idvehiculocaracteristica', 'DESC')->paginate(10);
            $vehiculoCaracteristicas = $datos->getCollection();
            $data = array();
            $index = 0;
            foreach ($vehiculoCaracteristicas as $vehiculoCaracteristica) {
                $id = $vehiculoCaracteristica->idvehiculocaracteristica;
                $nombreCaracteristica = $vehiculoCaracteristica->caracteristica;
                $data[$index] = $vehiculoCaracteristica;
                $index++;
            }
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el vehiculocaracteristica ' . $vehiculoCaracteristica->idvehiculocaracteristica;
            $log->guardar($request, $accion);
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data,
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

    public function show()
    {
        return view('commerce::show');
    }

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);

            $caracteristica = $vehc->find($id);
            if ($caracteristica == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            return response()->json([
                'response' => 1,
                'data' => $caracteristica
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
            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);

            $vehiculoCaracteristica = $vehc->find($id);
            if ($vehiculoCaracteristica == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }

            $vehiculoCaracteristica->caracteristica = $request->get('caracteristica');
            $vehiculoCaracteristica->update();

            $datos = $vehc->orderBy('idvehiculocaracteristica', 'DESC')->paginate(10);
            $vehiculoCaracteristicas = $datos->getCollection();
            $data = array();
            $index = 0;
            foreach ($vehiculoCaracteristicas as $vehiculoCaracteristica) {
                $id = $vehiculoCaracteristica->idvehiculocaracteristica;
                $nombreCaracteristica = $vehiculoCaracteristica->caracteristica;
                $data[$index] = $vehiculoCaracteristica;
                $index++;
            }
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el vehiculocaracteristica ' . $vehiculoCaracteristica->idvehiculocaracteristica;
            $log->guardar($request, $accion);
            return response()->json([
                'response' => 1,
                'message' => 'se actualizo correctamente',
                'pagination' => $pagination,
                'data' => $data,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error, no se pudo procesar la solicitud'
            ]);
        }
    }

    public function destroy(Request $request, $id){
        
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vehc = new VehiculoCaracteristica();
            $vehc->setConnection($connection);

            $vehiculoCaracteristica = DB::connection($connection)
                                        ->table('vehiculocaracteristica as vc')
                                        ->join('vehiculocaracdetalle as vcd', 'vcd.fkidvehiculocaracteristica', '=', 'vc.idvehiculocaracteristica')
                                        ->where('vc.idvehiculocaracteristica', $id)
                                        ->get();
            
            if (sizeof($vehiculoCaracteristica) > 0){
                return response()->json(array('response' => 0, 'data' => $id));
            }
            $vehc->find($id)->delete();
            $datos = $vehc->orderBy('idvehiculocaracteristica', 'DESC')->paginate(10);
            $vehiculoCaracteristicas = $datos->getCollection();

            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el vehiculocaracteristica ' . $id;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $vehiculoCaracteristicas
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'Error, no se pudo procesar la solicitud'
            ]);
        }
    }
}
