<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\ConfigEERR;
use App\Models\Contable\CuentaPlan;
use App\Models\Seguridad\Componente;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ConfigEERRController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            
            $search = $request->search;
            $nropaginacion = $request->nropaginacion;
            $connection = Crypt::decrypt($request->get('x_conexion'));


            /*$componente = new Componente();
            $componente->setConnection($connection);
            $componente->estado = 'A';
            $componente->activo = Crypt::encrypt('N');
            $componente->tipo = Crypt::encrypt('label+componente');
            $componente->descripcion = Crypt::encrypt('Codigo Accion');
            $componente->idcomponentepadre = 473;
            $componente->save();*/

            $config = new ConfigEERR();
            $config->setConnection($connection);

            $number = is_numeric($search) ? $search : -1;

            if ($search == '') {
                $config_eerr = $config->leftJoin('cuentaplan as cp', 'configeerr.idcuentaplan', '=', 'cp.idcuentaplan')
                    ->select('configeerr.idconfigeerr', 'configeerr.numaccion', 'configeerr.operacion', 
                        'configeerr.descripcion', 'configeerr.formula', 'configeerr.valorporcentaje',
                        'cp.codcuenta', 'cp.nombre as cuenta'
                    )
                    ->orderBy('configeerr.numaccion', 'asc')
                    ->paginate($nropaginacion);

            } else {
                $config_eerr = $config->leftJoin('cuentaplan as cp', 'configeerr.idcuentaplan', '=', 'cp.idcuentaplan')
                    ->select('configeerr.idconfigeerr', 'configeerr.numaccion', 'configeerr.operacion', 
                        'configeerr.descripcion', 'configeerr.formula', 'configeerr.valorporcentaje',
                        'cp.codcuenta', 'cp.nombre as cuenta'
                    )
                    ->where(function ($query) use ($search, $number) {
                        return $query
                            ->orWhere('configeerr.numaccion', '=', $search)
                            ->orWhere('configeerr.valorporcentaje', '=', $number)
                            ->orWhere('configeerr.formula', 'ILIKE', '%'.$search.'%')
                            ->orWhere('configeerr.descripcion', 'ILIKE', '%'.$search.'%')
                            ->orWhere('cp.nombre', 'ILIKE', '%'.$search.'%')
                            ->orWhere('cp.codcuenta', 'ILIKE', '%'.$search.'%')
                            ->orWhere('configeerr.operacion', '=', $search);
                    })
                    ->orderBy('configeerr.numaccion', 'asc')
                    ->paginate($nropaginacion);
            }
            
            return response()->json([
                'response' => 1,
                'data' => $config_eerr,
                'pagination' => [
                    'total'        => $config_eerr->total(),
                    'current_page' => $config_eerr->currentPage(),
                    'per_page'     => $config_eerr->perPage(),
                    'last_page'    => $config_eerr->lastPage(),
                    'from'         => $config_eerr->firstItem(),
                    'to'           => $config_eerr->lastItem(),
                ],
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
    public function create(Request $request)
    {
        try {
            
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $cuen = new CuentaPlan();
            $cuen->setConnection($connection);
            $cuentaplan = $cuen->where('estado', '=', 'A')
                ->whereNotNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')
                ->get();

            $cuen = new CuentaPlan();
            $cuen->setConnection($connection);
            $cuentapadre = $cuen->where('estado', '=', 'A')
                ->whereNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')
                ->get();
            
            return response()->json([
                'response' => 1,
                'cuentaplan' => $cuentaplan,
                'cuentapadre' => $cuentapadre,
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $numaccion = $request->input('numaccion', null);
            $operacion = $request->input('operacion', null);
            $formula = $request->input('formula', null);
            $valorporcentual = $request->input('valorporcentual', null);
            $descripcion = $request->input('descripcion', null);
            $idcuentaplan = $request->input('idcuentaplan', null);

            $count = DB::connection($connection)
                ->table('configeerr')
                ->where('numaccion', '=', $numaccion)
                ->whereNull('deleted_at')
                ->get();

            if (sizeof($count) > 0) {
                return response()->json([
                    'response' => 0,
                ]);
            }

            $data = new ConfigEERR();
            $data->numaccion = $numaccion;
            $data->operacion = $operacion;
            $data->formula = $formula;
            $data->valorporcentaje = $valorporcentual;
            $data->descripcion = $descripcion;
            $data->esctaresult = 'N';
            $data->idcuentaplan = $idcuentaplan;
            $data->setConnection($connection);

            $data->save();
            
            return response()->json([
                'response' => 1,
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

            $data = new ConfigEERR();
            $data->setConnection($connection);
            $config_eerr = $data->find($id);

            $cuen = new CuentaPlan();
            $cuen->setConnection($connection);
            $cuentaplan = $cuen->where('estado', '=', 'A')->whereNotNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')->get();

            $cuen = new CuentaPlan();
            $cuen->setConnection($connection);
            $cuentapadre = $cuen->where('estado', '=', 'A')->whereNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')->get();
            
            return response()->json([
                'response' => 1,
                'data' => $config_eerr,
                'cuentaplan' => $cuentaplan,
                'cuentapadre' => $cuentapadre,
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

            $numaccion = $request->input('numaccion', null);
            $operacion = $request->input('operacion', null);
            $formula = $request->input('formula', null);
            $valorporcentual = $request->input('valorporcentual', null);
            $descripcion = $request->input('descripcion', null);
            $idcuentaplan = $request->input('idcuentaplan', null);
            $id = $request->input('id', null);

            $count = DB::connection($connection)
                ->table('configeerr')
                ->where('numaccion', '=', $numaccion)
                ->where('idconfigeerr', '<>', $id)
                ->whereNull('deleted_at')
                ->get();

            if (sizeof($count) > 0) {
                return response()->json([
                    'response' => 0,
                ]);
            }

            $data = new ConfigEERR();
            $data->setConnection($connection);
            $config_eerr = $data->find($id);

            $config_eerr->numaccion = $numaccion;
            $config_eerr->operacion = $operacion;
            $config_eerr->formula = $formula;
            $config_eerr->valorporcentaje = $valorporcentual;
            $config_eerr->descripcion = $descripcion;
            $config_eerr->idcuentaplan = $idcuentaplan;
            $config_eerr->setConnection($connection);

            $config_eerr->update();
            
            return response()->json([
                'response' => 1,
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

            $id = $request->input('id', null);

            $data = new ConfigEERR();
            $data->setConnection($connection);
            $config_eerr = $data->find($id);
            $config_eerr->delete();
            
            return response()->json([
                'response' => 1,
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
