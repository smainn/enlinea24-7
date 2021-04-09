<?php

namespace App\Http\Controllers\Contable\Ajuste;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\Ajuste\CtbDefiCtasAsientAutom;
use App\Models\Contable\Ajuste\CtbDetalleComprobAutomat;
use App\Models\Contable\CuentaConfig;
use App\Models\Contable\CuentaPlan;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class CtbDefiCtasAsientAutomController extends Controller
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

            $obj = new CtbDefiCtasAsientAutom();
            $obj->setConnection($connection);

            $number = is_numeric($search) ? $search : -1;

            if ($search == '') {
                $data = $obj->select('idctbdefictasasientautom', 'clave', 'descripcion', 'codcuenta', 'valor',
                        DB::raw(' (SELECT cp.nombre FROM cuentaplan as cp 
                            WHERE cp.idcuentaplan = ctbdefictasasientautom.fkidcuentaplan)  AS nombrecuenta')
                    )
                    ->orderBy('idctbdefictasasientautom', 'asc')
                    ->paginate($nropaginacion);

            } else {
                $data = $obj->select('idctbdefictasasientautom', 'clave', 'descripcion', 'codcuenta', 'valor',
                        DB::raw(' (SELECT cp.nombre FROM cuentaplan as cp 
                        WHERE cp.idcuentaplan = ctbdefictasasientautom.fkidcuentaplan)  AS nombrecuenta')
                    )
                    ->where(function ($query) use ($search, $number) {
                        return $query
                            ->orWhere('clave', '=', $search)
                            ->orWhere('descripcion', 'ILIKE', '%'.$search.'%')
                            ->orWhere('codcuenta', 'ILIKE', '%'.$search.'%')
                            ->orWhere('valor', '=', $number);
                    })
                    ->orderBy('idctbdefictasasientautom', 'asc')
                    ->paginate($nropaginacion);
            }
            
            return response()->json([
                'response' => 1,
                'data' => $data,
                'pagination' => [
                    'total'        => $data->total(),
                    'current_page' => $data->currentPage(),
                    'per_page'     => $data->perPage(),
                    'last_page'    => $data->lastPage(),
                    'from'         => $data->firstItem(),
                    'to'           => $data->lastItem(),
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
                'message'   => 'No se pudo generar informacion!!!',
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
        //
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
    public function edit(Request $request)
    {
        try {
            
            $id = $request->id;
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new CtbDefiCtasAsientAutom();
            $obj->setConnection($connection);

            $data = $obj->select('idctbdefictasasientautom', 'clave', 'descripcion', 'codcuenta', 'valor',
                DB::raw(' (SELECT cp.nombre FROM cuentaplan as cp 
                    WHERE cp.idcuentaplan = ctbdefictasasientautom.fkidcuentaplan)  AS nombrecuenta'), 'fkidcuentaplan'
            )
            ->where('idctbdefictasasientautom', '=', $id)
            ->orderBy('idctbdefictasasientautom', 'asc')
            ->first();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuenta = $obj->where('estado', '=', 'A')->orderBy('idcuentaplan', 'asc')->get();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuentapadre = $obj->where('estado', '=', 'A')->whereNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')->get();

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $cuentaconfig = $obj->first();
            $cuentaconfig->decrypt();
            
            return response()->json([
                'response'     => 1,
                'cuenta'       => $cuenta,
                'cuentapadre'  => $cuentapadre,
                'data'         => $data,
                'cuentaconfig'      => $cuentaconfig,
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
                'message'   => 'No se pudo generar informacion!!!',
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
            $id = $request->id;
            $valor = $request->valor;
            $codcuenta = $request->codcuenta;
            $idcuentaplan = $request->idcuentaplan;

            $obj = new CtbDefiCtasAsientAutom();
            $obj->setConnection($connection);

            $data = $obj->find($id);
            $data->valor = $valor;
            $data->codcuenta = $codcuenta;
            $data->fkidcuentaplan = $idcuentaplan;
            $data->setConnection($connection);
            $data->update();

            $obj = new CtbDetalleComprobAutomat();
            $obj->setConnection($connection);

            $detalle = $obj->where('fkidctbdefictasasientautom', '=' , $data->idctbdefictasasientautom)->get();

            if ($data->fkidcuentaplan != null) {

                foreach ($detalle as $key => $value) {
                    $obj = new CtbDetalleComprobAutomat();
                    $obj->setConnection($connection);

                    $generar = $obj->find($value->idctbdetallecomprobautomat);
                    $generar->fkidcuentaplan = $data->fkidcuentaplan;
                    $generar->save();
                }
            }
            
            return response()->json([
                'response'     => 1,
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
                'message'   => 'No se pudo generar informacion!!!',
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
    public function destroy($id)
    {
        //
    }
}
