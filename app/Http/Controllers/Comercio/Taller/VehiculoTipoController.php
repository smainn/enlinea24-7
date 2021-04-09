<?php

namespace App\Http\Controllers\Comercio\Taller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Taller\VehiculoTipo;
use App\Models\Comercio\Taller\Vehiculo;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;


class VehiculoTipoController extends Controller
{
    public function index(Request $request)
    {
        //return view('commerce::index');
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $veht = new VehiculoTipo();
            $veht->setConnection($connection);
            $data = $veht->get();
            return response()->json([
                'response' => 1,
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
                'message' => 'Error en el servidor'
            ]);
        }
    }

    public function getTipo(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $veht = new VehiculoTipo();
            $veht->setConnection($connection);
            $vehiculoTipo = $veht->orderBy('idvehiculotipo', 'asc')->get();

            return \response()->json([
                'ok'=> true, 
                'data'=>$vehiculoTipo
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor'
            ]);
        }
        
    }

    public function create()
    {
        return view('commerce::create');
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function getTipoVehiculos(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $veht = new VehiculoTipo();
            $veht->setConnection($connection);

            $tipoVehiculos = $veht->where('estado', '=', 'A')
                                ->orderBy('idvehiculotipo', 'asc')
                                ->get();

            return response()->json([
                "ok" => true,
                "data" => $tipoVehiculos
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor'
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $bandera = $request->input('banderaFamilia');
            $idPadre = $request->input('idPadre');
            $descripcion = $request->input('descripcionFamilia');

            $log = new Log();
            $log->setConnection($connection);

            if ($bandera == 1) {
                $familia = new VehiculoTipo();
                $familia->descripcion = $descripcion;
                $familia->setConnection($connection);
                $familia->save();

                $accion = 'Inserto un padre en vehiculotipo ' . $familia->idvehiculotipo;
                $log->guardar($request, $accion);
            }else {
                if ($bandera == 2) {
                    $familia = new VehiculoTipo();
                    $familia->descripcion = $descripcion;
                    $familia->idpadrevehiculo = $idPadre;
                    $familia->setConnection($connection);
                    $familia->save();

                    $accion = 'Inserto un hijo en vehiculotipo ' . $familia->idvehiculotipo;
                    $log->guardar($request, $accion);
                }else {
                    if ($bandera == 3) {
                        $vet = new VehiculoTipo();
                        $vet->setConnection($connection);
                        $familia = $vet->find($idPadre);
                        $familia->descripcion = $descripcion;
                        $familia->setConnection($connection);
                        $familia->update();

                        $accion = 'Edito en vehiculotipo ' . $familia->idvehiculotipo;
                        $log->guardar($request, $accion);
                    }
                }
            }

            $veht = new VehiculoTipo();
            $veht->setConnection($connection);
            $nuevaFamilia = $veht->where('estado', '=', 'A')
                                ->orderBy('idvehiculotipo', 'asc')
                                ->get();

            return response()->json([
                'response' => 1, 
                'data' => $nuevaFamilia
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor'
            ]);
        }
    }

    public function edit()
    {
        return view('commerce::edit');
    }

    public function update(Request $request)
    {

    }

    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idFamilia = $request->input('idPadre');
            $veht = new VehiculoTipo();
            $veht->setConnection($connection);
            $cantidadHijo = $veht->where('idpadrevehiculo', '=', $idFamilia)
                                ->where('estado', '=', 'A')
                                ->get();
            
            if (sizeof($cantidadHijo) > 0) {
                return response()->json([
                    'response'=> 2,
                    'data' => 'No se pudo anular por que tiene hijos'
                ]);
            }
            $veh = new Vehiculo();
            $veh->setConnection($connection);
            $productoFamilia = $veh->leftJoin('vehiculotipo', 'vehiculo.fkidvehiculotipo', 'vehiculotipo.idvehiculotipo')
                                    ->where('vehiculo.fkidvehiculotipo', '=', $idFamilia)
                                    ->get();
            if (sizeof($productoFamilia) > 0) {
                return response()->json(['response'=> 3, 'data' => 'No se pudo anular por que esta relacionado con un vehiculo']);
            }

            $familia = $veht->find($idFamilia);
            $familia->estado = 'N';
            $familia->setConnection($connection);
            $familia->update();
            $familia->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino en vehiculotipo ' . $familia->idvehiculotipo;
            $log->guardar($request, $accion);

            $nuevaFamilia = $veht->where('estado', '=', 'A')->orderBy('idvehiculotipo', 'asc')->get();

            return response()->json([
                'response'=> 1,
                'data' => $nuevaFamilia
            ]);
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor'
            ]);
        }
        
    }
}
