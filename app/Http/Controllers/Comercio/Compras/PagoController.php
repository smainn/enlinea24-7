<?php

namespace App\Http\Controllers\Comercio\Compras;

use App\Functions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Compras\Pago;
use App\Models\Comercio\Compras\Compra;
use App\Models\Comercio\Compras\PagoDetaCompra;
use App\Models\Comercio\Compras\CompraPlanPagar;
use App\Models\Config\ConfigCliente;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt; 
use Illuminate\Support\Facades\DB;

class PagoController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $buscar = $request->filled('buscar') ? $request->get('buscar') : null;
            $buscar = $buscar == '' ? null : $buscar;

            $pag = new Pago();
            $pag->setConnection($connection);

            if ($buscar != null) {
                $pagos = $pag->leftJoin('pagodetacompra','pagodetacompra.fkidpagos','=','pagos.idpagos')
                    ->leftJoin(
                        'compraplanporpagar',
                        'compraplanporpagar.idcompraplanporpagar',
                        '=','pagodetacompra.fkidcompraplanporpagar'
                        )
                    ->leftJoin('compra','compra.idcompra','=','compraplanporpagar.fkidcompra')
                    ->leftJoin('proveedor','proveedor.idproveedor','=','compra.fkidproveedor')
                    ->select(
                        'pagos.*','compra.codcompra', 'compra.idcompra',
                        'proveedor.nombre as nombreProveedor',
                        'proveedor.apellido as apellidoProveedor'
                    )
                    ->where( function($query) use ($buscar) {
                        return $query->where('pagos.idpagos', 'LIKE', "%$buscar%")
                            ->orWhere('pagos.codpago', 'ILIKE', "%$buscar%")
                            ->orWhere('compra.codcompra', 'ILIKE', "%$buscar%")
                            ->orWhere(DB::raw("CONCAT(proveedor.nombre, ' ', proveedor.apellido)"), 'ILIKE', "%$buscar%")
                            ->orWhere('compra.idcompra', 'LIKE', "%$buscar%");
                    })
                    ->distinct('pagos.idpagos')
                    ->orderBy('idpagos','ASC') 
                    ->paginate($paginate);
            }else {
                $pagos = $pag->leftJoin('pagodetacompra','pagodetacompra.fkidpagos','=','pagos.idpagos')
                    ->leftJoin(
                        'compraplanporpagar',
                        'compraplanporpagar.idcompraplanporpagar',
                        '=','pagodetacompra.fkidcompraplanporpagar'
                        )
                    ->leftJoin('compra','compra.idcompra','=','compraplanporpagar.fkidcompra')
                    ->leftJoin('proveedor','proveedor.idproveedor','=','compra.fkidproveedor')
                    ->select(
                        'pagos.*','compra.codcompra', 'compra.idcompra',
                        'proveedor.nombre as nombreProveedor',
                        'proveedor.apellido as apellidoProveedor'
                    )
                    ->distinct('pagos.idpagos')
                    ->orderBy('idpagos','ASC') 
                    ->paginate($paginate);
            }
            
            $pagination = array(
                'total'        => $pagos->total(),
                'current_page' => $pagos->currentPage(),
                'per_page'     => $pagos->perPage(),
                'last_page'    => $pagos->lastPage(),
                'from'         => $pagos->firstItem(),
                'to'           => $pagos->lastItem(),
            );

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();

            return response()->json([
                'response' => 1,
                'data' => $pagos,
                'pagination' => $pagination,
                'ban' =>54,
                'configcli' => $configCli,
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
                'message' => 'Ocurrio un problema al conectarse con la base de datos',
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
       
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            date_default_timezone_set('America/La_Paz');
            $date = explode(' ', $request->get('fecha'));
            $fecha = $date[0];
            $hora = $date[1];

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $pago = new Pago();
            $pago->setConnection($connection);
            $pago->codpago = $request->get('codpago');
            $pago->fecha = $fecha;
            $pago->hora = $hora;
            $pago->notas = $request->get('notas');
            $pago->idusuario = $request->get('x_idusuario');
            $pago->fechahoratransac = date('Y-m-d H:i:s');
            $pago->sehizoasientautom = 'N';
            $pago->save();
            
            $comp = new Compra();
            $comp->setConnection($connection);
            $compra = $comp->find($request->get('idcompra'));

            $montopag = 0;
            $descripcionpag = '';

            $idcompraplanporpagar = [];

            if ($request->get('montoPagar') == 0 || $request->get('montoPagar') == '') {
                $idsPlanPago = json_decode($request->get('idsplanpago'));
                $montos = json_decode($request->get('montos'));
                
                $complan = new CompraPlanPagar();
                $complan->setConnection($connection);
                for ($i = 0; $i < sizeof($idsPlanPago); $i++) {
                    $pagoDet = new PagoDetaCompra();
                    $pagoDet->fkidpagos = $pago->idpagos;
                    $pagoDet->fkidcompraplanporpagar = $idsPlanPago[$i];
                    $pagoDet->montopagado = $montos[$i];
                    $pagoDet->setConnection($connection);
                    $pagoDet->save();

                    $montopag = $montopag + $pagoDet->montopagado;
        
                    $planPago = $complan->find($idsPlanPago[$i]);
                    
                    array_push($idcompraplanporpagar, $idsPlanPago[$i]);

                    $planPago->estado = 'P';
                    $planPago->montopagado = $montos[$i] + $planPago->montopagado;
                    $planPago->setConnection($connection);
                    $planPago->update();

                    $descripcionpag = $descripcionpag . $planPago->descripcion . ' ';
                }

            } else {

                $complan = new CompraPlanPagar();
                $complan->setConnection($connection);

                $cuotas = $compra->getCuotasImp();
                $montoPagar = (float)$request->get('montoPagar');
                $i = 0;
                while ($montoPagar > 0) {
                    $compPlanPago = $complan->find($cuotas[$i]->idcompraplanporpagar);
                        
                    $saldo = $compPlanPago->montoapagar - $compPlanPago->montopagado;
                    $saldo = round($saldo, 2);

                    $pagoDet = new PagoDetaCompra();
                    $pagoDet->setConnection($connection);
                    $pagoDet->fkidcompraplanporpagar = $compPlanPago->idcompraplanporpagar;
                    $pagoDet->fkidpagos = $pago->idpagos;

                    if ($montoPagar >= $saldo) {

                        $pagoDet->montopagado = $saldo;
                        $pagoDet->save();

                        $montopag = $montopag + $pagoDet->montopagado;

                        $compPlanPago->estado = 'P';
                        $compPlanPago->montopagado = $compPlanPago->montoapagar;
                        $compPlanPago->setConnection($connection);
                        $compPlanPago->update();

                        $descripcionpag = $descripcionpag . $compPlanPago->descripcion . ' ';

                        array_push($idcompraplanporpagar, $cuotas[$i]->idcompraplanporpagar);

                        $montoPagar -= $saldo;

                    } else {
                        $pagoDet->montopagado = $montoPagar;
                        $pagoDet->save();

                        $compPlanPago->estado = 'I';
                        $compPlanPago->montopagado = $compPlanPago->montopagado + $montoPagar;
                        $compPlanPago->setConnection($connection);
                        $compPlanPago->update();

                        $montoPagar = 0;
                    }

                    $i++;
                }
            }
            
            $compra->mtototpagado = $compra->mtototpagado + $request->get('mtotocobrado');
            $compra->setConnection($connection);
            $compra->update();

            $activo = 2;

            if ($config_cliente->asientoautomdecomprob == 'N') {

                if ($config_cliente->asientoautomaticosiempre == 'S') {

                    $function = new Functions();
                    $activo = $function->pagosComprasCredito($compra->idcompra, $pago->idpagos, 
                        $descripcionpag, $pago->fecha, $montopag, $request->x_idusuario, $connection);

                    if ($activo > 0) {
                        foreach ($idcompraplanporpagar as $key => $value) {
                            $complan = new CompraPlanPagar();
                            $complan->setConnection($connection);

                            $planPago = $complan->find($value);

                            $planPago->sehizoasientautom = 'S';
                            $planPago->setConnection($connection);
                            $planPago->update();
                        }
                        $pago->setConnection($connection);
                        $pago->sehizoasientautom = 'S';
                        $pago->update();
                    }
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el pago ' . $pago->idpagos;
            $log->guardar($request, $accion);

            DB::commit();
            
            return response()->json([
                'response' => 1,
                'idcompraplanporpagar' => $idcompraplanporpagar,
                'activo' => $activo,
                'message' => 'Se guardo correctamente'
            ]);
            
        } catch (DecryptException $e) {
            DB::rollback();
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
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al procesar la solicitud',
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
     * @param int $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $pag = new Pago();
            $pag->setConnection($connection);
            $pago = $pag->find($id);
            if ($pago == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'No existe el pago'
                ]);
            }
            $cuotas = $pago->getCuotas();
            $comp = new Compra();
            $comp->setConnection($connection);
            $compra = $comp->find($cuotas->first()->fkidcompra);
            $compra->proveedor;
            return response()->json([
                'response' => 1,
                'pago' => $pago,
                'cuotas' => $cuotas,
                'compra' => $compra
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
                'message' => 'No se proceso correctamente la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Response
     */
    public function edit($id)
    {
        return view('commerce::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $pag = new Pago();
            $pag->setConnection($connection);
            $pago = $pag->find($id);
            if ($pago == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El pago ha eliminar no existe'
                ]);
            }
            $pagodet = $pago->pagodetacompra;
            $totalDescontar = 0;
            $idcompra = 0;

            $complan = new CompraPlanPagar();
            $complan->setConnection($connection);
            foreach ($pagodet as $row) {
                $planpago = $complan->find($row->fkidcompraplanporpagar);
                $idcompra = $planpago->fkidcompra;
                $totalDescontar = $totalDescontar + $planpago->montopagado;
                $planpago->montopagado = 0;
                $planpago->estado = 'I';
                $planpago->setConnection($connection);
                $planpago->update();
                $row->setConnection($connection);
                $row->delete();
            }

            $comp = new Compra();
            $comp->setConnection($connection);
            $compra = $comp->find($idcompra);
            $compra->mtototpagado = ($compra->mtototpagado - $totalDescontar) < 0 ? 0 : ($compra->mtototpagado - $totalDescontar);
            $compra->setConnection($connection);
            $compra->update();
            
            $pago->setConnection($connection);
            $pago->delete();
            
            $pag->setConnection($connection);
            $datos = $pag->leftJoin('pagodetacompra','pagodetacompra.fkidpagos','=','pagos.idpagos')
                            ->leftJoin(
                                'compraplanporpagar',
                                'compraplanporpagar.idcompraplanporpagar',
                                '=','pagodetacompra.fkidcompraplanporpagar'
                                )
                            ->leftJoin('compra','compra.idcompra','=','compraplanporpagar.fkidcompra')
                            ->leftJoin('proveedor','proveedor.idproveedor','=','compra.fkidproveedor')
                            ->select(
                                'pagos.*','compra.codcompra', 'compra.idcompra',
                                'proveedor.nombre as nombreProveedor',
                                'proveedor.apellido as apellidoProveedor'
                            )
                            ->distinct('pagos.idpagos')
                            ->orderBy('idpagos','ASC') 
                            ->paginate(10);
            //$datos = Pago::orderBy('idpagos','DESC')->paginate(10);
            $pagos = $datos->getCollection();
            
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
            $accion = 'Elimino el pago ' . $pago->idpagos;
            $log->guardar($request, $accion);
            
            DB::rollback();
            return response()->json([
                'response' => 1,
                'message' => 'Se Elimino correctamente',
                'data' => $pagos,
                'pagination' => $pagination
            ]);

        } catch (DecryptException $e) {
            DB::rollback();
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
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function validarCodigo(Request $request, $value) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $pag = new Pago();
            $pag->setConnection($connection);
            $count = $pag->where('codpago', $value)->count();
            if ($count > 0) {
                return response()->json([
                    'response' => 1,
                    'valido' => false
                ]);
            }
            return response()->json([
                'response' => 1,
                'valido' => true
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
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function reporte_cuentaporpagar(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configscliente = $obj->first();
            $configscliente->decrypt();

            return response()->json([
                'response'  => 1,
                'configscliente'  => $configscliente,
                // 'pago'  => $pago,
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

    public function reporte_pagorealizado(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configscliente = $obj->first();
            $configscliente->decrypt();

            return response()->json([
                'response'  => 1,
                'configscliente'  => $configscliente,
                // 'pago'  => $pago,
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }

}
