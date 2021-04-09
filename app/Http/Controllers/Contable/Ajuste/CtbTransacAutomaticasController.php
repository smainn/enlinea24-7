<?php

namespace App\Http\Controllers\Contable\Ajuste;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contable\Ajuste\CtbComprobAutomat;
use App\Models\Contable\Ajuste\CtbDetalleComprobAutomat;
use App\Models\Contable\Ajuste\CtbTransacAutomaticas;
use App\Models\Contable\CentroDeCosto;
use App\Models\Contable\ComprobanteTipo;
use App\Models\Contable\CuentaConfig;
use App\Models\Contable\CuentaPlan;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

class CtbTransacAutomaticasController extends Controller
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

            $obj = new CtbTransacAutomaticas();
            $obj->setConnection($connection);

            $number = is_numeric($search) ? $search : -1;

            if ($search == '') {
                $data = $obj->select('idctbtransacautomaticas', 'nombre', 'tipotransac', 'estado')
                    ->orderBy('idctbtransacautomaticas', 'asc')
                    ->paginate($nropaginacion);

            } else {
                $data = $obj->select('idctbtransacautomaticas', 'nombre', 'tipotransac', 'estado')
                    ->where(function ($query) use ($search, $number) {
                        return $query
                            ->orWhere('nombre', 'ILIKE', '%'.$search.'%')
                            ->orWhere('tipotransac', '=', $search);
                    })
                    ->orderBy('idctbtransacautomaticas', 'asc')
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
                'message'   => 'No se pudo crear banco!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }


    public function get_data(Request $request)
    {
        try {
            
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new CtbTransacAutomaticas();
            $obj->setConnection($connection);

            $data = $obj->select('idctbtransacautomaticas', 'nombre', 'tipotransac', 'estado')
                ->orderBy('idctbtransacautomaticas', 'asc')
                ->get();

            
            return response()->json([
                'response' => 1,
                'data' => $data,
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
            
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->input('id', null);

            $obj = new CtbTransacAutomaticas();
            $obj->setConnection($connection);

            $data = $obj->leftJoin('ctbcomprobautomat as ctbcomprob', 'ctbtransacautomaticas.idctbtransacautomaticas', '=', 'ctbcomprob.fkidctbtransacautomaticas')
                ->select('ctbtransacautomaticas.idctbtransacautomaticas', 'ctbtransacautomaticas.nombre', 
                    'ctbtransacautomaticas.tipotransac', 'ctbtransacautomaticas.estado', 'ctbcomprob.codcomprobante', 'ctbcomprob.referidoa', 
                    'ctbcomprob.fecha', 'ctbcomprob.nrodoc', 'ctbcomprob.nrochequetarjeta', 'ctbcomprob.glosa', 'ctbcomprob.tipocambio', 
                    'ctbcomprob.idctbcomprobautomat', 'ctbcomprob.contabilizar', 'ctbcomprob.fkidcomprobantetipo', 'ctbcomprob.fkidmoneda',
                    'ctbcomprob.fkidtipopago'
                )
                ->where('ctbtransacautomaticas.idctbtransacautomaticas', '=', $id)
                ->orderBy('ctbtransacautomaticas.idctbtransacautomaticas', 'asc')
                ->first();

            $obj = new CtbDetalleComprobAutomat();
            $obj->setConnection($connection);

            $detalle = $obj->leftJoin('ctbdefictasasientautom as asientautom', 'ctbdetallecomprobautomat.fkidctbdefictasasientautom', '=', 'asientautom.idctbdefictasasientautom')
                ->leftJoin('cuentaplan as cp', 'ctbdetallecomprobautomat.fkidcuentaplan', '=', 'cp.idcuentaplan')
                ->leftJoin('centrodecosto as cc', 'ctbdetallecomprobautomat.fkidcentrodecosto', '=', 'cc.idcentrodecosto')
                ->select('asientautom.clave', 'asientautom.descripcion', 'asientautom.valor', 
                    'ctbdetallecomprobautomat.glosamenor', 'ctbdetallecomprobautomat.debe', 'ctbdetallecomprobautomat.haber', 
                    'ctbdetallecomprobautomat.fkidctbcomprobautomat', 'ctbdetallecomprobautomat.idctbdetallecomprobautomat',
                    'ctbdetallecomprobautomat.fkidcentrodecosto', 'cp.idcuentaplan', 'cp.codcuenta', 'cp.nombre as cuenta', 
                    'cc.idcentrodecosto', 'cc.nombre as centrodecosto'
                )
                ->where('ctbdetallecomprobautomat.fkidctbcomprobautomat', '=', $data->idctbcomprobautomat)
                ->whereNull('cp.deleted_at')
                ->whereNull('cc.deleted_at')
                ->orderBy('ctbdetallecomprobautomat.idctbdetallecomprobautomat', 'asc')
                ->get();


            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuenta = $obj->where('estado', '=', 'A')->orderBy('idcuentaplan', 'asc')->get();

            $obj = new CuentaPlan();
            $obj->setConnection($connection);
            $cuentapadre = $obj->where('estado', '=', 'A')->whereNull('fkidcuentaplanpadre')->orderBy('idcuentaplan', 'asc')->get();

            $obj = new CentroDeCosto();
            $obj->setConnection($connection);
            $centrocosto = $obj->where('estado', '=', 'A')->orderBy('idcentrodecosto', 'asc')->get();

            $obj = new CentroDeCosto();
            $obj->setConnection($connection);
            $centrocostopadre = $obj->where('estado', '=', 'A')->whereNull('fkidcentrodecostopadre')->orderBy('idcentrodecosto', 'asc')->get();

            $obj = new ComprobanteTipo();
            $obj->setConnection($connection);
            $comprobantetipo = $obj->orderBy('idcomprobantetipo', 'ASC')->get();

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $cuentaconfig = $obj->first();
            $cuentaconfig->decrypt();
            
            return response()->json([
                'response'    => 1,
                'data'        => $data,
                'detalle'     => $detalle,

                'cuenta'      => $cuenta,
                'cuentapadre' => $cuentapadre,

                'comprobantetipo' => $comprobantetipo,

                'centrocosto'       => $centrocosto,
                'centrocostopadre'  => $centrocostopadre,

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

            $idctbcomprobautomat = $request->input('idctbcomprobautomat');
            $idctbtransacautomaticas = $request->input('idctbtransacautomaticas');
            $contabilizar = $request->input('contabilizar');
            $idcomprobantetipo = $request->input('idcomprobantetipo');
            $comprobantedetalle = json_decode($request->input('comprobantedetalle'));

            $obj = new CtbComprobAutomat();
            $obj->setConnection($connection);

            $ctbcomprobautomat = $obj->find($idctbcomprobautomat);
            $ctbcomprobautomat->fkidcomprobantetipo = $idcomprobantetipo;
            $ctbcomprobautomat->contabilizar = $contabilizar;
            $ctbcomprobautomat->setConnection($connection);
            $ctbcomprobautomat->update();

            foreach ($comprobantedetalle as $key => $data) {

                $obj = new CtbDetalleComprobAutomat();
                $obj->setConnection($connection);

                $ctbdetallecomprobautomat = $obj->find($data->idctbdetallecomprobautomat);
                $ctbdetallecomprobautomat->fkidcuentaplan = $data->idcuentaplan;
                $ctbdetallecomprobautomat->fkidcentrodecosto = $data->idcentrodecosto;

                $ctbdetallecomprobautomat->setConnection($connection);
                $ctbdetallecomprobautomat->update();

            }
            
            return response()->json([
                'response'  => 1,
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
    public function destroy($id)
    {
        //
    }
}
