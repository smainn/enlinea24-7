<?php

namespace App\Http\Controllers\Comercio\Compras;

use App\Functions;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Compras\Compra;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Comercio\Almacen\Sucursal;
use App\Models\Comercio\Compras\CompraDetalle;
use App\Models\Comercio\Compras\PagoDetaCompra;
use App\Models\Comercio\Compras\CompraPlanPagar;
use App\Models\Comercio\Compras\Pago;
use App\Models\Comercio\Compras\Proveedor;
use App\Models\Seguridad\Log;
use App\Models\Config\ConfigCliente;
use App\Models\Configuracion\LibroCompra;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Carbon\carbon;

use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    public function index(Request $request)
    {

        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $buscar = $request->filled('buscar') ? $request->get('buscar') : null;
            $buscar = $buscar == '' ? null : $buscar;

            $com = new Compra();
            $com->setConnection($connection);

            if ($buscar != null) {
                $compra = $com->leftJoin('proveedor as p', 'compra.fkidproveedor', '=', 'p.idproveedor')
                    ->select('compra.idcompra', 'compra.codcompra', 'compra.fecha', 'compra.hora',
                        'compra.anticipopagado', 'compra.mtototcompra', 'compra.mtototpagado',
                        'compra.tipo', 'compra.estado', 'compra.idusuario',
                        DB::raw("CONCAT(p.nombre, ' ', p.apellido) AS proveedor")
                    )
                    ->orWhere('compra.idcompra', 'LIKE', "%$request->buscar%")
                    ->orWhere('compra.codcompra', 'ILIKE', "%$request->buscar%")
                    ->orWhere(DB::raw("CONCAT(p.nombre, ' ', p.apellido)"), 'ILIKE', "%$request->buscar%")
                    ->orderBy('compra.idcompra', 'desc')
                    ->paginate($paginate);
            }else {
                $compra = $com->leftJoin('proveedor as p', 'compra.fkidproveedor', '=', 'p.idproveedor')
                    ->select('compra.idcompra', 'compra.codcompra', 'compra.fecha', 'compra.hora',
                        'compra.anticipopagado', 'compra.mtototcompra', 'compra.mtototpagado',
                        'compra.tipo', 'compra.estado', 'compra.idusuario',
                        DB::raw("CONCAT(p.nombre, ' ', p.apellido) AS proveedor")
                    )
                    ->orderBy('compra.idcompra', 'desc')
                    ->paginate($paginate);
            }

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();
            
            return [
                'pagination' => [
                    'total'        => $compra->total(),
                    'current_page' => $compra->currentPage(),
                    'per_page'     => $compra->perPage(),
                    'last_page'    => $compra->lastPage(),
                    'from'         => $compra->firstItem(),
                    'to'           => $compra->lastItem(),
                ],
                'data' => $compra, 'response' => 1, 'configcli' => $configCli,
            ];

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
                'response' => 0,
                'message' => 'Error hubo un problema, vuelva a intentarlo',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }


    }

    public function getCompras(Request $request){
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $compras = new Compra();
            $compras->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $compras->select('compra.idcompra', 'compra.codcompra', 'compra.fecha', 'compra.hora',
                             'compra.anticipopagado', 'compra.fechahoratransac', 'compra.mtototcompra', 'compra.mtototpagado',
                             'compra.notas', 'compra.tipo', 'compra.estado', 'compra.idusuario')
                    ->orWhere('compra.idcompra', 'LIKE', "%$request->buscar%")
                    ->orWhere('compra.codcompra', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.fecha', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.hora', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.anticipopagado', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.fechahoratransac', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.mtototcompra', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.mtototpagado', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.notas', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.tipo', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.estado', 'ILIKE', "%$request->buscar%")
                    ->orWhere('compra.idusuario', 'ILIKE', "%$request->buscar%")
                    ->orderBy('compra.idcompra', 'asc')
                    ->paginate($paginate);
            } else {
                $datos = $compras->select('compra.idcompra', 'compra.codcompra', 'compra.fecha', 'compra.hora',
                             'compra.anticipopagado', 'compra.fechahoratransac', 'compra.mtototcompra', 'compra.mtototpagado',
                             'compra.notas', 'compra.tipo', 'compra.estado', 'compra.idusuario')
                    ->orderBy('compra.idcompra', 'asc')
                    ->paginate($paginate);
            }
            $datosClientes = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            $data = array();
            foreach ($datosClientes as $row) {
                $row->proveedor;
                $row->sucursal = $row->getSucurcal();
                array_push($data, $row);
            }
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
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
                'response' => 0,
                'message' => 'Error hubo un problema, vuelva a intentarlo',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function changeSizePagination(Request $request, $cantidadPagina) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $compras = new Compra();
            $compras->setConnection($connection);

            $datosCompras = $compras->orderBy('idcompra', 'ASC')->paginate($cantidadPagina);
            $data = $datosCompras->getCollection();
            $pagination = array(
                'total' => $datosCompras->total(),
                'current_page' => $datosCompras->currentPage(),
                'per_page' => $datosCompras->perPage(),
                'last_page' => $datosCompras->lastPage(),
                'first' => $datosCompras->firstItem(),
                'last' =>   $datosCompras->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $data
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
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function reporte(Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configscliente = $conf->first();
            $configscliente->decrypt();

            $suc = new Sucursal();
            $suc->setConnection($connection);
            $sucursal = $suc->orderBy('idsucursal', 'asc')->get();

            $mon = new Moneda();
            $mon->setConnection($connection);
            $moneda = $mon->orderBy('idmoneda', 'asc')->get();

            return response()->json([
                'response' => 1,
                'configscliente' => $configscliente,
                'sucursal' => $sucursal,
                'moneda' => $moneda,
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
                'response' => 0,
                'message' => 'Error hubo un problema, vuelva a intentarlo',
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
    public function create(Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configscliente = $conf->first();
            $configscliente->decrypt();

            $suc = new Sucursal();
            $suc->setConnection($connection);
            $sucursal = $suc->orderBy('idsucursal', 'asc')->get();

            $almacen = [];

            if (sizeof($sucursal) > 0) {
                $alm = new Almacen();
                $alm->setConnection($connection);
                $almacen = $alm->where('fkidsucursal', '=', $sucursal[0]->idsucursal)
                    ->orderBy('idalmacen', 'asc')->get();
            }

            $producto = [];

            if (sizeof($almacen) > 0) {

                $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 'p.costo', 'p.tipo')
                    ->where('almproddet.fkidalmacen', '=', $almacen[0]->idalmacen)
                    // ->where('p.tipo', '=', 'P')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);

            }

            $mon = new Moneda();
            $mon->setConnection($connection);
            $moneda = $mon->orderBy('idmoneda', 'asc')->get();

            $tipocambio = DB::connection($connection)
                ->table('tipocambio')
                ->where('estado', '=', 'A')
                ->whereNull('deleted_at')
                ->get();

            $prov = new Proveedor();
            $prov->setConnection($connection);
            $proveedor = $prov->orderBy('idproveedor', 'desc')->get()->take(20);

            return response()->json([
                'response' => 1,
                'configscliente' => $configscliente,
                'almacen' => $almacen,
                'sucursal' => $sucursal,
                'moneda' => $moneda,
                'producto' => $producto,
                'proveedor' => $proveedor,
                'tipocambio' => $tipocambio,
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
                'response' => 0,
                'message' => 'Error hubo un problema, vuelva a intentarlo',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }

    }

    public function get_producto(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idproducto = $request->input('idproducto');
            $idalmacen = $request->input('idalmacen');

            $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 
                        'p.tipo', 'p.costo', 'almproddet.stock', 'almproddet.idalmacenproddetalle'
                    )
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    ->where('almproddet.fkidproducto', '=', $idproducto)
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->whereNull('u.deleted_at')
                    ->first();

            return response()->json([
                'response' => 1,
                'producto' => $producto,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function search_prodCodID(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $search = $request->input('search', null);
            $idalmacen = $request->input('idalmacen');

            if ($search == null) {
                $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 'p.costo', 'p.tipo')
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    // ->where('p.tipo', '=', 'P')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);
            }else {
                $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 'p.costo', 'p.tipo')
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    // ->where('p.tipo', '=', 'P')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('p.codproducto', 'ILIKE', '%'.$search.'%')
                            ->orWhere('p.idproducto', 'ILIKE', '%'.$search.'%');
                    })
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $producto,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function search_prodDesc(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $search = $request->input('search', null);
            $idalmacen = $request->input('idalmacen');

            if ($search == null) {
                $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 'p.costo', 'p.tipo')
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    // ->where('p.tipo', '=', 'P')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);
            }else {
                $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 'p.costo', 'p.tipo')
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    // ->where('p.tipo', '=', 'P')
                    ->where(function ($query) use ($search) {
                        return $query->orWhere('p.descripcion', 'ILIKE', '%'.$search.'%');
                    })
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $producto,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function get_sucursal(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idsucursal = $request->input('idsucursal');

            $alm = new Almacen();
            $alm->setConnection($connection);
            $almacen = $alm->where('fkidsucursal', '=', $idsucursal)
                ->orderBy('idalmacen', 'asc')->get();

            $producto = [];

            if (sizeof($almacen) > 0) {

                $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 'p.costo', 'p.tipo')
                    ->where('almproddet.fkidalmacen', '=', $almacen[0]->idalmacen)
                    // ->where('p.tipo', '=', 'P')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);

            }

            return response()->json([
                'response' => 1,
                'almacen'  => $almacen,
                'producto' => $producto,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function get_almacen(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idalmacen = $request->input('idalmacen');

            $producto = DB::connection($connection)
                ->table('producto as p')
                ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion', 'p.costo', 'p.tipo')
                ->where('almproddet.fkidalmacen', '=', $idalmacen)
                // ->where('p.tipo', '=', 'P')
                ->whereNull('p.deleted_at')
                ->whereNull('almproddet.deleted_at')
                ->orderBy('p.idproducto', 'desc')
                ->get()->take(20);


            return response()->json([
                'response' => 1,
                'producto' => $producto,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function searchProveedorByCodId(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $search = $request->input('search');

            $prov = new Proveedor();
            $prov->setConnection($connection);
            $proveedor = $prov->where(function ($query) use ($search) {
                    return $query->orWhere('codproveedor', 'ILIKE', '%'.$search.'%')
                        ->orWhere('idproveedor', 'ILIKE', '%'.$search.'%');
                })->orderBy('idproveedor', 'desc')->get()->take(20);

            return response()->json([
                'response' => 1,
                'proveedor' => $proveedor,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    public function searchProveedorByNom(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $search = $request->input('search');

            $prov = new Proveedor();
            $prov->setConnection($connection);
            $proveedor = $prov->where(DB::raw("CONCAT(nombre, ' ',apellido)"), 'ILIKE', '%'.$search.'%')
                ->orderBy('idproveedor', 'desc')->get()->take(20);

            return response()->json([
                'response' => 1,
                'proveedor' => $proveedor,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        if ($request->filled('fecha') && $request->filled('hora') && $request->filled('idproveedor')) {

            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $check_regfactura = $request->input('check_regfactura', null);

                $comp = new Compra();
                $comp->setConnection($connection);

                $compra = new Compra();
                $compra->codcompra = $request->get('codcompra');
                $compra->fecha = $request->get('fecha');
                $compra->hora = $request-> get('hora');
                $compra->anticipopagado = $request->input('anticipopagado', 0);
                $compra->notas = $request->get('notas');
                $compra->fechahoratransac = date('Y-m-d H:i:s');
                $compra->estado = 'V';
                $compra->idusuario = $request->get('x_idusuario');
                $compra->fkidproveedor = $request->get('idproveedor');
                $compra->tipo = $request->get('tipo');
                $compra->mtototcompra = round(floatval($request->get('costoTotal')), 2);
                $compra->mtototpagado = $request->input('anticipopagado', 0);
                $compra->fkidmoneda = $request->get('idmoneda');

                $compra->tc = $request->input('valor_cambio', 1);

                if ( $check_regfactura == 'A' ) {
                    $compra->nitproveedor = $request->input('nitproveedor');
                    $compra->nrofacturaprov = $request->input('nrofactura');
                    $compra->nroautorizacionprov = $request->input('nroautorizacion');
                    $compra->fechafacturaprov = $request->input('fechafactura');
                    $compra->montofactprov = $request->input('montototalfacturado');
                    $compra->codigocontrol = $request->input('codigocontrol');
                    $compra->nitclientefact = $request->input('nitcliente');
                    $compra->confactura = 'S';
                } else {
                    $compra->confactura = 'N';
                }

                $compra->sehizoasientautom = 'N';

                $compra->setConnection($connection);
                $compra->save();

                $idsProductos = json_decode($request->get('idsproductos'));
                $cantidades = json_decode($request->get('cantidades'));
                $costos = json_decode($request->get('costos'));
                $idalmacen = $request->get('idalmacen');
                $size = sizeof($idsProductos);

                $produ = new Producto();
                $produ->setConnection($connection);

                $almpd = new AlmacenProdDetalle();
                $almpd->setConnection($connection);
                for ($i = 0; $i < $size; $i++) {
                    $producto = $produ->find($idsProductos[$i]);
                    $producto->setConnection($connection);
                    $idalmacenprod = $producto->estaEnAlmacen($idalmacen);
                    $almacenProd = null;
                    if ($idalmacenprod == null) {
                        $almacenProd = new AlmacenProdDetalle();
                        if ($producto->tipo == 'P') {
                            $almacenProd->stock = $cantidades[$i];
                        }else {
                            $almacenProd->stock = 0;
                        }
                        $almacenProd->stockminimo = 0;
                        $almacenProd->stockmaximo = 0;
                        $almacenProd->fkidalmacen = $idalmacen;
                        $almacenProd->fkidproducto = $producto->idproducto;
                        $almacenProd->setConnection($connection);
                        $almacenProd->save();

                    } else {
                        $almacenProd = $almpd->find($idalmacenprod);
                        if ($producto->tipo == 'P') {
                            $almacenProd->stock = $almacenProd->stock + $cantidades[$i];
                        }
                        $almacenProd->setConnection($connection);
                        $almacenProd->update();
                    }
                    if ($producto->tipo == 'P') {
                        $producto->stock = $producto->stock + $cantidades[$i];
                    }
                    $producto->costo = $costos[$i];
                    $producto->setConnection($connection);
                    $producto->update();

                    $compradet = new CompraDetalle();
                    $compradet->cantidad = $cantidades[$i];
                    $compradet->costounit = $costos[$i];
                    $compradet->fkidalmacenproddetalle = $almacenProd->idalmacenproddetalle;
                    $compradet->fkidcompra = $compra->idcompra;
                    $compradet->setConnection($connection);
                    $compradet->save();
                }

                $compraplanporpagar = null;
                $idpagos = null;

                if ($compra->anticipopagado != 0) {
                    $compraPlanPagar = new CompraPlanPagar();
                    $compraPlanPagar->descripcion = 'Anticipo';
                    $compraPlanPagar->fechadepago = $compra->fecha;
                    $compraPlanPagar->montoapagar = $compra->anticipopagado;
                    $compraPlanPagar->montopagado = $compra->anticipopagado;
                    $compraPlanPagar->estado = 'P';
                    $compraPlanPagar->fkidcompra = $compra->idcompra;
                    $compraPlanPagar->sehizoasientautom = 'N';
                    $compraPlanPagar->setConnection($connection);
                    $compraPlanPagar->save();

                    $compraplanporpagar = $compraPlanPagar->idcompraplanporpagar;

                    $pago = new Pago();
                    $pago->setConnection($connection);
                    $pago->fecha = $compra->fecha;
                    $pago->hora = $compra->hora;
                    $pago->fechahoratransac = new Carbon();
                    $pago->idusuario = $request->get('x_idusuario');
                    $pago->sehizoasientautom = 'N';
                    $pago->save();

                    $idpagos = $pago->idpagos;

                    $pagoDet = new PagoDetaCompra();
                    $pagoDet->setConnection($connection);
                    $pagoDet->montopagado = $compra->anticipopagado;
                    $pagoDet->fkidpagos = $pago->idpagos;
                    $pagoDet->fkidcompraplanporpagar = $compraPlanPagar->idcompraplanporpagar;
                    $pagoDet->save();
                }

                $montos = json_decode($request->get('montos'));
                $fechas = json_decode($request->get('fechas'));
                $descripciones = json_decode($request->get('descripciones'));
                $size = sizeof($montos);

                for ($i = 0;$i < $size; $i++) {
                    $compraPlanPagar = new CompraPlanPagar();
                    $compraPlanPagar->descripcion = $descripciones[$i];
                    $compraPlanPagar->fechadepago = $fechas[$i];
                    $compraPlanPagar->montoapagar = $montos[$i];
                    $compraPlanPagar->montopagado = 0;
                    $compraPlanPagar->estado = 'I';
                    $compraPlanPagar->fkidcompra = $compra->idcompra;
                    $compraPlanPagar->sehizoasientautom = 'N';
                    $compraPlanPagar->setConnection($connection);
                    $compraPlanPagar->save();
                }

                $conf = new ConfigCliente();
                $conf->setConnection($connection);
                $config_cliente = $conf->first();
                $config_cliente->decrypt();

                if ($config_cliente->asientoautomdecomprob == 'N' || !$config_cliente->asientoautomdecomprob) {

                    if ($config_cliente->asientoautomaticosiempre == 'S' || $config_cliente->asientoautomaticosiempre) {
                        $function = new Functions();
                        $activo = $function->asienAutomCompraContadoCredito($compra->idcompra, $request->x_idusuario, $connection);
                        if ($activo > 0) {
                            $compra->sehizoasientautom = 'S';
                            $compra->update();

                            if ($compraplanporpagar != null) {
                                $obj = new CompraPlanPagar();
                                $obj->setConnection($connection);
                                $planPago = $obj->find($compraplanporpagar);

                                $planPago->sehizoasientautom = 'S';
                                $planPago->setConnection($connection);
                                $planPago->update();
                            }
                            if ($idpagos != null) {
                                $obj = new Pago();
                                $obj->setConnection($connection);
                                $pago = $obj->find($idpagos);
                                $pago->sehizoasientautom = 'S';
                                $pago->setConnection($connection);
                                $pago->update();
                            }
                        }
                    }
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto la compra ' . $compra->idcompra;
                $log->guardar($request, $accion);

                if ( $compra->confactura == 'S' ) {
                    $librocompra = new LibroCompra();
                    $librocompra->fkidcompra = $compra->idcompra;
                    $librocompra->especificacion = '3';
                    $librocompra->nro = sizeof(DB::connection($connection)->table('faclibrocompra')->get() ) + 1;
                    $librocompra->fechafactura_dui = $request->input('fechafactura');
                    $librocompra->nitproveedor = $request->input('nitproveedor');
                    $librocompra->nombrerazonsocial = null;
                    $librocompra->nrofactura = $request->input('nrofactura');
                    $librocompra->nrodui = null;
                    $librocompra->nrodeautorizacion = $request->input('nroautorizacion');
                    $librocompra->importetotalcompra = $compra->mtototcompra;
                    $librocompra->importenosujetocredito = 0;
                    $librocompra->subtotal = $compra->mtototcompra;
                    $librocompra->dctosbonifrebajassujetaslva = 0;
                    $librocompra->importebasecreditofiscal = 0;
                    $librocompra->creditofiscal = 0;
                    $librocompra->codigocontrol = $request->input('codigocontrol');
                    $librocompra->tipocompra = $compra->tipo;
                    $librocompra->fkidtipolibrocompra = null;
                    $librocompra->setConnection( $connection );
                    $librocompra->save();
                }

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'idcompra' => $compra->idcompra,
                    'message' => 'Se guardo correctamente la compra'
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
                    'response' => 0,
                    'message' => 'No se pudo registrar la compra',
                    'error' => [
                        'message' => $th->getMessage(),
                        'file' => $th->getFile(),
                        'line' => $th->getLine()
                    ]
                ]);
            }


        } else {
            return response()->json([
                'response' => -1,
                'message' => 'No se recibieron los datos requeridos'
            ]);
        }
    }

    public function store_factura(Request $request) {
        
        try {
            
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Compra();
            $obj->setConnection($connection);
            $compra = $obj->find( $request->input('idcompra') );

            $compra->nitproveedor = $request->input('nitproveedor');
            $compra->nrofacturaprov = $request->input('nrofactura');
            $compra->nroautorizacionprov = $request->input('nroautorizacion');
            $compra->fechafacturaprov = $request->input('fechafactura');
            $compra->montofactprov = $request->input('montototalfacturado');
            $compra->codigocontrol = $request->input('codigocontrol');
            $compra->nitclientefact = $request->input('nitcliente');
            $compra->confactura = 'S';

            $compra->setConnection($connection);
            $compra->update();

            $librocompra = new LibroCompra();
            $librocompra->fkidcompra = $compra->idcompra;
            $librocompra->especificacion = '3';
            $librocompra->nro = sizeof(DB::connection($connection)->table('faclibrocompra')->get() ) + 1;
            $librocompra->fechafactura_dui = $request->input('fechafactura');
            $librocompra->nitproveedor = $request->input('nitproveedor');
            $librocompra->nombrerazonsocial = null;
            $librocompra->nrofactura = $request->input('nrofactura');
            $librocompra->nrodui = null;
            $librocompra->nrodeautorizacion = $request->input('nroautorizacion');
            $librocompra->importetotalcompra = $compra->mtototcompra;
            $librocompra->importenosujetocredito = 0;
            $librocompra->subtotal = $compra->mtototcompra;
            $librocompra->dctosbonifrebajassujetaslva = 0;
            $librocompra->importebasecreditofiscal = 0;
            $librocompra->creditofiscal = 0;
            $librocompra->codigocontrol = $request->input('codigocontrol');
            $librocompra->tipocompra = $compra->tipo;
            $librocompra->fkidtipolibrocompra = null;
            $librocompra->setConnection( $connection );
            $librocompra->save();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Se genero la factura de la compra ' . $compra->idcompra;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'data' => $compra,
                'message' => 'Se guardo correctamente la compra'
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
                'response' => 0,
                'message' => 'No se pudo registrar la compra',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function generar_recibo(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idcompra = $request->input('idcompra');; //$request->input('idcompra');

            $compra = DB::connection($connection)
                ->table('compra as comp')
                ->leftJoin('proveedor as prov', 'comp.fkidproveedor', '=', 'prov.idproveedor')
                ->leftJoin('moneda as mon', 'comp.fkidmoneda', '=', 'mon.idmoneda')
                ->leftJoin('compradetalle as compdet', 'comp.idcompra', '=', 'compdet.fkidcompra')
                ->leftJoin('almacenproddetalle as almprodet', 'compdet.fkidalmacenproddetalle', '=', 'almprodet.idalmacenproddetalle')
                ->leftJoin('almacen as alm', 'almprodet.fkidalmacen', '=', 'alm.idalmacen')
                ->leftJoin('sucursal as suc', 'alm.fkidsucursal', '=', 'suc.idsucursal')
                ->select('comp.idcompra', 'comp.codcompra', 'comp.fecha', 'comp.tipo', 'comp.notas',
                    'comp.anticipopagado as anticipo', 'comp.mtototcompra', 'comp.mtototpagado',
                    DB::raw("CONCAT(prov.nombre, ' ',prov.apellido) as proveedor"), 'prov.nit', 'mon.descripcion as moneda',
                    'alm.descripcion as almacen', 'suc.razonsocial', 'suc.nombrecomercial', 'suc.tipoempresa'
                )
                ->where('comp.idcompra', '=', $idcompra)
                ->whereNull('comp.deleted_at')
                ->first();

            if ($compra == null) {
                return response()->json([
                    'response' => 0,
                ]);
            }

            $detalle_compra = DB::connection($connection)
                ->table('compradetalle as compdet')
                ->leftJoin('almacenproddetalle as almprodet', 'compdet.fkidalmacenproddetalle', '=', 'almprodet.idalmacenproddetalle')
                ->leftJoin('producto as prod', 'almprodet.fkidproducto', '=', 'prod.idproducto')
                ->leftJoin('unidadmedida as unidmed', 'prod.fkidunidadmedida', '=', 'unidmed.idunidadmedida')
                ->select('compdet.cantidad', 'compdet.costounit', 'prod.idproducto', 'prod.codproducto', 
                    'prod.descripcion', 'unidmed.descripcion as unidadmedida'
                )
                ->where('compdet.fkidcompra', '=', $idcompra)
                ->whereNull('compdet.deleted_at')
                ->get();

            $planpago = DB::connection($connection)
                ->table('compraplanporpagar as compplanpag')
                ->select('compplanpag.descripcion', 'compplanpag.fechadepago', 'compplanpag.montoapagar')
                ->where('compplanpag.fkidcompra', '=', $idcompra)
                ->where('compplanpag.descripcion', '<>', 'Anticipo')
                ->whereNull('compplanpag.deleted_at')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            return response()->json([
                'response' => 1,
                'compra' => $compra,
                'compradetalle' => $detalle_compra,
                'planpago' => $planpago,
                'config_cliente' => $config_cliente,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message'  => 'Vuelva a iniciar sesion',
                'error'    => [
                    'message' => $e->getMessage(),
                    'file'    => $e->getFile(),
                    'line'    => $e->getLine()
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message'  => 'Error hubo un problema, vuelva a intentarlo',
                'error'    => [
                    'message' => $th->getMessage(),
                    'file'    => $th->getFile(),
                    'line'    => $th->getLine(),
                ],
            ]);
        }
    }

    /**
     * Show the specified resource.
     * @return Response
     */
    public function show(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $comp = new Compra();
            $comp->setConnection($connection);

            $compra = $comp->find($id);

            if ($compra == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El producto no existe'
                ]);
            }

            $consulta = $comp->leftJoin('compraplanporpagar as cpp', 'cpp.fkidcompra', '=', 'compra.idcompra')
                ->leftJoin('pagodetacompra as pdc', 'pdc.fkidcompraplanporpagar', '=', 'cpp.idcompraplanporpagar')
                ->where([
                    'compra.idcompra' => $id
                ])
                ->orderBy('cpp.idcompraplanporpagar','asc')
                ->select('cpp.*','compra.mtototcompra','compra.mtototpagado', 'pdc.montopagado as mtopagado')
                ->get();

            $i = 0;
            $size = sizeof($consulta);
            $cuotas = [];

            while ($i < $size) {
                $idp = $consulta[$i]->idcompraplanporpagar;
                $sum = 0;
                while ($i < $size && $idp == $consulta[$i]->idcompraplanporpagar) {
                    $sum += $consulta[$i]->mtopagado;
                    $i++;
                }

                if ($compra->anticipopagado == 0) {
                    $consulta[$i-1]->sumtotalpagado = $sum;
                    array_push($cuotas, $consulta[$i-1]);
                } else if ($i > 1) {
                    $consulta[$i-1]->sumtotalpagado = $sum;
                    array_push($cuotas, $consulta[$i-1]);
                }
            }

            $compra->planpagos = $cuotas;
            $compra->proveedor;
            $compra->moneda;

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            return response()->json([
                'response' => 1,
                'data' => $compra,
                'config_cliente' => $config_cliente,
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
                'message' => 'Error al conectarse con la db',
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
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $comp = new Compra();
            $comp->setConnection($connection);

            $compra = $comp->find($id);
            if ($compra == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'La compra no existe'
                ]);
            }

            $planpagos = $compra->planpagos;
            foreach ($planpagos as $row) {
                if ($row->montopagado > 0) {
                    DB::rollback();
                    return response()->json([
                        'response' => 0,
                        'message' => 'No se pude eliminar por que ya se cancelo una cuota'
                    ]);
                }
                $row->setConnection($connection);
                $row->delete();
            }
            $compradetalles = $compra->compradetalles;

            $almpd = new AlmacenProdDetalle();
            $almpd->setConnection($connection);
            foreach ($compradetalles as $row) {
                $almacenprod = $almpd->find($row->fkidalmacenproddetalle);
                $producto = $almacenprod->producto;
                $resulAlmacen = $almacenprod->stock - $row->cantidad;
                if ($resulAlmacen < 0) {
                    DB::rollback();
                    return response()->json([
                        'response' => 0,
                        'message' => 'No se puede eliminar la compra, el stock da un valor negativo'
                    ]);
                }
                $almacenprod->stock = $resulAlmacen;
                $producto->stock = $producto->stock - $row->cantidad;

                $almacenprod->setConnection($connection);
                $almacenprod->update();

                $producto->setConnection($connection);
                $producto->update();

                $row->setConnection($connection);
                $row->delete();
            }
            $compra->setConnection($connection);
            $compra->delete();
            
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino la compra ' . $compra->idcompra;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                'response' => 1,
                'message' => 'Se elimino correctamente',
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
                'message' => 'Ocurrio un error al eliminar, vuelva a intentarlo',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }
    /** Funciones auxiliares */
    public function getProductos(Request $request, $idcompra) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $comp = new Compra();
            $comp->setConnection($connection);

            $compra = $comp->find($idcompra);
            if ($compra == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'La compra no existe'
                ]);
            }
            $productos = $compra->getProductos();
            return response()->json([
                'response' => 1,
                'data' => $productos
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
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function searchByIdCod(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $comp = new Compra();
            $comp->setConnection($connection);

            $result = $comp->SearchByIdCod($value)->get();
            $data = array();
            foreach ($result as $row) {
                $row->proveedor;
                array_push($data, $row);
            }
            return response()->json([
                'response' => 1,
                'data' => $data
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
                'message' => 'No se pudo concretar la busquedad',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    public function getCuotas(Request $request, $id) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $comp = new Compra();
            $comp->setConnection($connection);

            $compra = $comp->find($id);
            if ($compra == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'La compra no existe'
                ]);
            }

            $cuotas = $compra->getCuotas();
            return response()->json([
                'response' => 1,
                'cuotas' => $cuotas
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
                'message' => 'Ocurrio un problema al conectarse a la base de datos',
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

            $comp = new Compra();
            $comp->setConnection($connection);

            $count = $comp->where('codcompra', $value)->count();
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
}
