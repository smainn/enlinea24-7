<?php

namespace App\Http\Controllers\Comercio\Almacen;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use DB;

class MonedaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $mon = new Moneda();
            $mon->setConnection($connection);

            $monedas = $mon->orderBy('idmoneda', 'ASC')->get();
            return response()->json(['response' => 1,'data' => $monedas]);
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

    public function show()
    {
        return view('commerce::show');
    }

    public function getTipoMonedas(Request $request){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $mon = new Moneda();
            $mon->setConnection($connection);

            $tipoMonedas = $mon->orderBy('idmoneda', 'ASC')->paginate(10);
            $data = $tipoMonedas->getCollection();
            $pagination = array(
                "total" => $tipoMonedas->total(),
                "current_page" => $tipoMonedas->currentPage(),
                "per_page" => $tipoMonedas->perPage(),
                "last_page" => $tipoMonedas->lastPage(),
                "first" => $tipoMonedas->firstItem(),
                "last" =>   $tipoMonedas->lastItem()
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

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $mon = new Moneda();
            $mon->setConnection($connection);

            $descripcion = $request->descripcion;
            $tipoCambio = $request->tipoCambio;
            $tipoMoneda = new Moneda();
            $tipoMoneda->descripcion = $descripcion;
            $tipoMoneda->tipocambio = $tipoCambio;
            $tipoMoneda->setConnection($connection);
            $tipoMoneda->save();
            $tipoMonedas = $mon->orderBy('idmoneda', 'ASC')->paginate(10);
            $data = $tipoMonedas->getCollection();
            $pagination = array(
                "total" => $tipoMonedas->total(),
                "current_page" => $tipoMonedas->currentPage(),
                "per_page" => $tipoMonedas->perPage(),
                "last_page" => $tipoMonedas->lastPage(),
                "first" => $tipoMonedas->firstItem(),
                "last" =>   $tipoMonedas->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto un tipo de moneda ' . $tipoMoneda->idmoneda;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data
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
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $mon = new Moneda();
            $mon->setConnection($connection);

            $tipoMoneda = $mon->find($id);
            if ($tipoMoneda == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            return response()->json([
                'response' => 1,
                'data' => $tipoMoneda
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
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $mon = new Moneda();
            $mon->setConnection($connection);

            $tipoMoneda = $mon->find($id);
            if ($tipoMoneda == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, el dato no existe'
                ]);
            }
            $tipoMoneda->descripcion = $request->descripcion;
            $tipoMoneda->predeterminada = $request->predeterminada;
            $tipoMoneda->tipocambio = $request->tipoCambio;
            $tipoMoneda->setConnection($connection);
            $tipoMoneda->update();
            $tipoMonedas = $mon->orderBy('idmoneda', 'ASC')->paginate(10);
            $data = $tipoMonedas->getCollection();
            $pagination = array(
                "total" => $tipoMonedas->total(),
                "current_page" => $tipoMonedas->currentPage(),
                "per_page" => $tipoMonedas->perPage(),
                "last_page" => $tipoMonedas->lastPage(),
                "first" => $tipoMonedas->firstItem(),
                "last" =>   $tipoMonedas->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito un tipo de moneda ' . $tipoMoneda->idmoneda;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data
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
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $mon = new Moneda();
            $mon->setConnection($connection);

            $tipoMoneda = $mon->findOrfail($id);
            $producto = $tipoMoneda->productos;
            if ($producto->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar la unidad de medida porque ya se encuentra en uso"
                ]);
            }
            $listaPrecio = $tipoMoneda->listaPrecios;
            if($listaPrecio->count() > 0){
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar la unidad de medida porque ya se encuentra en uso"
                ]);
            }
            $tipoMoneda->delete();
            $tipoMonedas = $mon->orderBy('idmoneda', 'ASC')->paginate(10);
            $data = $tipoMonedas->getCollection();
            $pagination = array(
                "total" => $tipoMonedas->total(),
                "current_page" => $tipoMonedas->currentPage(),
                "per_page" => $tipoMonedas->perPage(),
                "last_page" => $tipoMonedas->lastPage(),
                "first" => $tipoMonedas->firstItem(),
                "last" =>   $tipoMonedas->lastItem()
            );

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino un tipo de moneda ' . $tipoMoneda->idmoneda;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data
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
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function searchData(Request $request, $buscar){

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $mon = new Moneda();
            $mon->setConnection($connection);

            $tipoMonedaBuscar = $mon->where('idmoneda','ilike','%'.$buscar.'%')
                                    ->orwhere('descripcion','ilike','%'.$buscar.'%')
                                    ->orwhere('tipocambio','ilike','%'.$buscar.'%')
                                    ->paginate(10);
            $data = $tipoMonedaBuscar->getCollection();
            $pagination = array(
                'total' => $tipoMonedaBuscar->total(),
                'current_page' => $tipoMonedaBuscar->currentPage(),
                'per_page' => $tipoMonedaBuscar->perPage(),
                'last_page' => $tipoMonedaBuscar->lastPage(),
                'first' => $tipoMonedaBuscar->firstItem(),
                'last' =>   $tipoMonedaBuscar->lastItem()
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
            $mon = new Moneda();
            $mon->setConnection($connection);

            $tipoMonedas = $mon->orderBy('idmoneda', 'ASC')->paginate($cantidadPagina);
            $data = $tipoMonedas->getCollection();
            $pagination = array(
                'total' => $tipoMonedas->total(),
                'current_page' => $tipoMonedas->currentPage(),
                'per_page' => $tipoMonedas->perPage(),
                'last_page' => $tipoMonedas->lastPage(),
                'first' => $tipoMonedas->firstItem(),
                'last' =>   $tipoMonedas->lastItem()
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
}
