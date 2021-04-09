<?php

namespace App\Http\Controllers\Comercio\Almacen\Producto;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

use App\Models\Comercio\Almacen\Producto\Familia;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Seguridad\Log;

class FamiliaController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fam = new Familia();
            $fam->setConnection($connection);
            $familia = $fam->where('estado', '=', 'A')->orderBy('idfamilia', 'asc')->get();
        
            return response()->json([
                'ok'=> true, 
                'data' => $familia
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    /**
     * Show the form for creating a new resource.
     * @return Response
     */
    public function create()
    {
        return view('commerce::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $bandera = $request->input('banderaFamilia');
            $idPadre = $request->input('idPadre');

            $descripcion = $request->input('descripcionFamilia');

            $familia = new Familia();
            $familia->setConnection($connection);
            
            $log = new Log();
            $log->setConnection($connection);
            if ($bandera == 1) {
                
                $familia->descripcion = $descripcion;
                $familia->save();

                $accion = 'Inserto un padre en familia ' . $familia->idfamilia;
                $log->guardar($request, $accion);
            } else {

                if ($bandera == 2) {
                    $familia->descripcion = $descripcion;
                    $familia->idpadrefamilia = $idPadre;
                    $familia->save();

                    $accion = 'Inserto un hijo en familia ' . $familia->idfamilia;
                    $log->guardar($request, $accion);

                } else {
                    if ($bandera == 3) {
                        $familia = $familia->find($idPadre);
                        $familia->descripcion = $descripcion;
                        $familia->setConnection($connection);
                        $familia->update();

                        $accion = 'Edito la familia ' . $familia->idfamilia;
                        $log->guardar($request, $accion);
                    }
                }
            }

            $nuevaFamilia = $familia->where('estado', '=', 'A')->orderBy('idfamilia', 'asc')->get();

            return response()->json([
                'response' => 1, 
                'data' => $nuevaFamilia
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }

    /**
     * Show the specified resource.
     * @return Response
     */
    public function show()
    {
        return view('commerce::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @return Response
     */
    public function edit()
    {
        return view('commerce::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function update(Request $request)
    {
    }

    /**
     * Remove the specified resource from storage.
     * @return Response
     */
    public function destroy(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fam = new Familia();
            $fam->setConnection($connection);
            $idFamilia = $request->input('idPadre');

            $cantidadHijo = $fam->where('idpadrefamilia', '=', $idFamilia)
                ->where('estado', '=', 'A')
                ->where('deleted_at', null)
                ->get();
            
            if (sizeof($cantidadHijo) > 0) {
                return response()->json(['response'=> 2, 'data' => 'No se pudo anular por que tiene hijos']);
            }

            $prod = new Producto();
            $prod->setConnection($connection);
            $productoFamilia = $prod->leftJoin('familia', 'producto.fkidfamilia', 'familia.idfamilia')
                ->where('producto.fkidfamilia', '=', $idFamilia)
                ->get();

            if (sizeof($productoFamilia) > 0) {
                return response()->json([
                    'response'=> 3, 
                    'data' => 'No se pudo anular por que esta relacionado con un producto'
                ]);
            }

            $familia = $fam->find($idFamilia);
            $familia->estado = 'N';
            $familia->setConnection($connection);
            $familia->update();
            $familia->delete();

            $nuevaFamilia = $fam->where('estado', '=', 'A')->orderBy('idfamilia', 'asc')->get();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la familia ' . $familia->idfamilia;
            $log->guardar($request, $accion);

            return response()->json([
                'response'=> 1, 
                'data' => $nuevaFamilia
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error en el servidor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
        
    }
}
