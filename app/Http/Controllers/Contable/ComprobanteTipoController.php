<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\ComprobanteTipo;
use App\Models\Contable\Comprobante;
use App\Models\Contable\GestionContable;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ComprobanteTipoController extends Controller
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
            $comp = new ComprobanteTipo();
            $comp->setConnection($connection);

            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $datos = null;
            if ($request->filled('busqueda')) {
                $datos = $comp->select('comprobantetipo.descripcion', 'comprobantetipo.numeradoinicial',
                            'comprobantetipo.numeroactual', 'comprobantetipo.firmaa',
                            'comprobantetipo.firmab', 'comprobantetipo.firmac', 'comprobantetipo.firmad')
                    ->orWhere('comprobantetipo.descripcion', 'ILIKE', "%$request->busqueda%")
                    ->orWhere('comprobantetipo.numeradoinicial', 'LIKE', "%$request->busqueda%")
                    ->orWhere('comprobantetipo.numeroactual', 'LIKE', "%$request->busqueda%")
                    ->orWhere('comprobantetipo.firmaa', 'ILIKE', "%$request->busqueda%")
                    ->orWhere('comprobantetipo.firmab', 'ILIKE', "%$request->busqueda%")
                    ->orWhere('comprobantetipo.firmac', 'ILIKE', "%$request->busqueda%")
                    ->orWhere('comprobantetipo.firmad', 'ILIKE', "%$request->busqueda%")
                    ->orderBy('comprobantetipo.idcomprobantetipo', 'ASC')
                    ->paginate($paginate);
            } else {
                $datos = $comp->select('comprobantetipo.*')
                    ->orderBy('comprobantetipo.idcomprobantetipo', 'ASC')
                    ->paginate($paginate);
            }
            
            $comprobantes = $datos->getCollection();
            
            $pagination = array(
                'total'         => $datos->total(),
                'current_page'  => $datos->currentPage(),
                'per_page'      => $datos->perPage(),
                'last_page'     => $datos->lastPage(),
                'first'         => $datos->firstItem(),
                'last'          => $datos->lastItem(),
                'url_next'      => $datos->nextPageUrl()
            );

            return response()->json([
                'response'      => 1,
                'pagination'    => $pagination,
                'data'          => $comprobantes
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
                'message'   => 'No se pudo obtener los comprobantes',
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
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            
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
                'message'   => 'No se pudo obtener los comprobantes',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new GestionContable();
            $obj->setConnection($connection);
            $gestion = $obj->where('estado', 'A')->first();

            if ($gestion == null) {
                return response()->json([
                    'response'   => 0,
                ]);
            }

            $comp = new ComprobanteTipo();
            $comp->setConnection($connection);
            $comp->descripcion = $request->descripcion;
            $comp->numeradoinicial = $request->nroinicial;
            $comp->numeroactual = $request->nroactual;
            $comp->abreviacion = $request->abreviacion;
            $comp->firmaa = $request->firmaa;
            $comp->firmab = $request->firmab;
            $comp->firmac = $request->firmac;
            $comp->firmad = $request->firmad;
            $comp->fkidgestioncontable = $gestion->idgestioncontable;
            $comp->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Guardo el tipo de comprobante ' . $comp->idcomprobantetipo;
            $log->guardar($request, $accion);

            $datos = $comp->select('comprobantetipo.*')
                ->orderBy('comprobantetipo.idcomprobantetipo', 'ASC')
                ->paginate(10);

            $tiposcomp = $datos->getCollection();
            
            $pagination = array(
                'total'         => $datos->total(),
                'current_page'  => $datos->currentPage(),
                'per_page'      => $datos->perPage(),
                'last_page'     => $datos->lastPage(),
                'first'         => $datos->firstItem(),
                'last'          => $datos->lastItem(),
                'url_next'      => $datos->nextPageUrl()
            );

            DB::commit();
            return response()->json([
                'response'   => 1,
                'message'    => 'Se guardo correctamente',
                'data'       => $tiposcomp,
                'pagination' => $pagination
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
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
            DB::rollback();
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los comprobantes',
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
    public function show(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $tipocomp = $obj->find($id);
            if ($tipocomp == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El tipo de comprobante no existe'
                ]);
            }

            return response()->json([
                'response' => 1,
                'tipocomp'   => $tipocomp,
                'na' => 'ac'
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
                'message'   => 'No se pudo obtener los comprobantes',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
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

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $tipocomp = $obj->find($id);
            if ($tipocomp == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El tipo de comprobante no existe'
                ]);
            }

            return response()->json([
                'response' => 1,
                'data'   => $tipocomp
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
                'message'   => 'No se pudo obtener los comprobantes',
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
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $comp = $obj->find($id);
            if ($comp == null) {
                return response()->json([
                    'response'  => 0,
                    'message'   => 'El tipo de comprobante no existe'
                ]);
            }

            $comp->descripcion = $request->descripcion;
            $comp->numeradoinicial = $request->nroinicial;
            $comp->numeroactual = $request->nroactual;
            $comp->abreviacion = $request->abreviacion;
            $comp->firmaa = $request->firmaa;
            $comp->firmab = $request->firmab;
            $comp->firmac = $request->firmac;
            $comp->firmad = $request->firmad;
            $comp->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el tipo de comprobante ' . $comp->idcomprobantetipo;
            $log->guardar($request, $accion);

            $datos = $comp->select('comprobantetipo.*')
                            ->orderBy('comprobantetipo.idcomprobantetipo', 'ASC')
                            ->paginate(10);

            $tiposcomp = $datos->getCollection();
            
            $pagination = array(
                'total'         => $datos->total(),
                'current_page'  => $datos->currentPage(),
                'per_page'      => $datos->perPage(),
                'last_page'     => $datos->lastPage(),
                'first'         => $datos->firstItem(),
                'last'          => $datos->lastItem(),
                'url_next'      => $datos->nextPageUrl()
            );

            DB::commit();
            return response()->json([
                'response'   => 1,
                'message'    => 'Se guardo correctamente',
                'data'       => $tiposcomp,
                'pagination' => $pagination
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
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
            DB::rollback();
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los comprobantes',
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
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $comp = $obj->find($id);
            if ($comp == null) {
                return response()->json([
                    'response'  => 0,
                    'message'   => 'El tipo de comprobante no existe'
                ]);
            }

            $obj = new Comprobante();
            $obj->setConnection($connection);
            $result = $obj->where('fkidcomprobantetipo', $id)->get();
            if ($result->count() > 0) {
                return response()->json([
                    'response' => 0,
                    'message'  => 'No se puede eliminar, ya esta suendo usado por un comprobante'
                ]);
            }
            $comp->delete();
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el tipo de comprobante ' . $comp->idcomprobantetipo;
            $log->guardar($request, $accion);

            $datos = $comp->select('comprobantetipo.*')
                            ->orderBy('comprobantetipo.idcomprobantetipo', 'ASC')
                            ->paginate(10);

            $tiposcomp = $datos->getCollection();
            
            $pagination = array(
                'total'         => $datos->total(),
                'current_page'  => $datos->currentPage(),
                'per_page'      => $datos->perPage(),
                'last_page'     => $datos->lastPage(),
                'first'         => $datos->firstItem(),
                'last'          => $datos->lastItem(),
                'url_next'      => $datos->nextPageUrl()
            );

            DB::commit();
            return response()->json([
                'response'   => 1,
                'message'    => 'Se guardo correctamente',
                'data'       => $tiposcomp,
                'pagination' => $pagination
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
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
            DB::rollback();
            return response()->json([
                'response'  => -1,
                'message'   => 'Error al procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }
}
