<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Almacen\AlmacenUbicacion;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class AlmacenUbicacionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $almu = new AlmacenUbicacion();
            $almu->setConnection($connection);

            $data = $almu->get();

            return response()->json([
                "response" => 1,
                "data" => $data
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error en el servidor'
            ]);
        }
        
    }

    public function create()
    {
        return view('commerce::create');
    }

    public function getUbicacionAlmacenes(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $almu = new AlmacenUbicacion();
            $almu->setConnection($connection);

            //$ubicacionAlmacenes = AlmacenUbicacion::where('estado', '=', 'A')->orderBy('idalmacenubicacion', 'asc')->get();
            $almacenubicacion = $almu->leftJoin('almacen', 'almacenubicacion.fkidalmacen', 'almacen.idalmacen')
                                    ->select('almacen.descripcion as almacen', 'almacenubicacion.*')
                                    ->where('almacenubicacion.estado', '=', 'A')
                                    ->orderBy('almacen.idalmacen', 'ASC')
                                    ->get();
            return response()->json([
                "ok" => true,
                "data" => $almacenubicacion
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
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $almu = new AlmacenUbicacion();
            $almu->setConnection($connection);

            $bandera = $request->input('banderaFamilia');
            $idPadre = $request->input('idPadre');
            $descripcion = $request->input('descripcionFamilia');
            $capacidad = $request->input('capacidadFamilia');
            $notas = $request->input('notas');
            $idAlmacen = $request->input('idAlmacen');
            if ($bandera == 1) {
                $familia = new AlmacenUbicacion();
                $familia->setConnection($connection);
                $familia->descripcion = $descripcion;
                $familia->capacidad = $capacidad;
                $familia->notas = $notas;
                $familia->fkidalmacen = $idAlmacen;
                $familia->save();

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto un padre en almacen ubicacion ' . $familia->idalmacenubicacion;
                $log->guardar($request, $accion);

            } else {
                if ($bandera == 2) {
                    $familia = new AlmacenUbicacion();
                    $familia->idpadre = $idPadre;
                    $familia->descripcion = $descripcion;
                    $familia->capacidad = $capacidad;
                    $familia->notas = $notas;
                    $familia->fkidalmacen = $idAlmacen;
                    $familia->setConnection($connection);
                    $familia->save();

                    $log = new Log();
                    $log->setConnection($connection);
                    $accion = 'Inserto un hijo en almacen ubicacion ' . $familia->idalmacenubicacion;
                    $log->guardar($request, $accion);

                }else {
                    if ($bandera == 3) {
                        $familia = $almu->find($idPadre);
                        $familia->descripcion = $descripcion;
                        $familia->capacidad = $capacidad;
                        $familia->notas = $notas;
                        $familia->fkidalmacen = $idAlmacen;
                        $familia->setConnection($connection);
                        $familia->update();

                        $log = new Log();
                        $log->setConnection($connection);
                        $accion = 'Edito en almacen ubicacion ' . $familia->idalmacenubicacion;
                        $log->guardar($request, $accion);
                    }
                }
            }

            $nuevaFamilia = $almu->where('estado', '=', 'A')
                                ->orderBy('idalmacenubicacion', 'asc')
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
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function show()
    {
        return view('commerce::show');
    }

    public function edit($idFamilia)
    {
        
    }

    public function update(Request $request)
    {

    }

    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $almu = new AlmacenUbicacion();
            $almu->setConnection($connection);

            $idFamilia = $request->input('idPadre');
            $cantidadHijo = $almu->where('idpadre', '=', $idFamilia)
                                ->where('estado', '=', 'A')
                                ->get();
            if (sizeof($cantidadHijo) > 0) {
                return response()->json([
                    'response'=> 2, 
                    'data' => 'No se pudo anular por que tiene hijos'
                ]);
            }
            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);
            $productoFamilia = $almpd->leftJoin('almacenubicacion', 'almacenproddetalle.fkidalmacenubicacion', 'almacenubicacion.idalmacenubicacion')
                                    ->where('almacenproddetalle.fkidalmacenubicacion', '=', $idFamilia)
                                    ->get();
            if (sizeof($productoFamilia) > 0) {
                return response()->json([
                    'response'=> 3, 
                    'data' => 'No se pudo anular por que esta relacionado con un detalle de producto'
                ]);
            }
            $familia = $almu->find($idFamilia);
            $familia->estado = 'N';
            $familia->setConnection($connection);
            $familia->update();
            $familia->delete();
            $nuevaFamilia = $almu->where('estado', '=', 'A')->orderBy('idalmacenubicacion', 'asc')->get();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito en almacen ubicacion ' . $familia->idalmacenubicacion;
            $log->guardar($request, $accion);

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
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
        
    }

    public function getUbicaciones(Request $request, $id){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $almu = new AlmacenUbicacion();
            $almu->setConnection($connection);

            $data = $almu->leftJoin('almacen', 'almacenubicacion.fkidalmacen', 'almacen.idalmacen')
                        ->select('almacen.descripcion as almacen', 'almacenubicacion.*')
                        ->where('almacenubicacion.estado', '=', 'A')
                        ->where('almacen.idalmacen', '=', $id)
                        ->get();
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
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }
}
