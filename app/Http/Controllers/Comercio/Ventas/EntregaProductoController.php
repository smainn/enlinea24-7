<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Ventas\Venta;
use App\Models\Config\ConfigCliente;
use App\Models\Seguridad\Usuario;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class EntregaProductoController extends Controller
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

            $buscar = $request->buscar;
            $paginacion = $request->pagina;

            $confc = new ConfigCliente();
            $confc->setConnection($connection);
            $configCli = $confc->first();
            $configCli->decrypt();

            $condicion = [
                'tipotransacventa.nombre' => 'Venta',
                'cliente.deleted_at' => null,
                'vendedor.deleted_at' => null,
                'sucursal.deleted_at' => null,
                'tipotransacventa.deleted_at' => null,
                'tipocontacredito.deleted_at' => null,
                'venta.estadoproceso' => 'C',
            ];

            if ($configCli->clienteesabogado) {

                $user = new Usuario();
                $user->setConnection($connection);

                $resp = $user->leftJoin('grupousuario as g',  'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                    ->leftJoin('vendedor as v', 'v.fkidusuario', '=', 'usuario.idusuario')
                    ->where('usuario.idusuario', $request->get('x_idusuario'))
                    ->where('g.esv', 'S')
                    ->first();

                if ($resp != null && $configCli->clienteesabogado) {
                    $condicion['vendedor.idvendedor'] = $resp->idvendedor;
                }

            }

            $vent = new Venta();
            $vent->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $buscar = $request->filled('buscar') ? $request->get('buscar') : '';

            if ($buscar != '') {
                
                $datos = $vent->select('venta.idventa','venta.codventa','cliente.nombre as nombreCliente','tipocontacredito.descripcion as tipo',
                        'cliente.apellido as apellidoCliente','vendedor.nombre as nombreVendedor', 'venta.mtototventa',
                        'vendedor.apellido as apellidoVendedor','sucursal.nombre as nombreSucursal','venta.fecha', 'factura.idfactura')
                    ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                    ->leftJoin('vendedor','vendedor.idvendedor','=','venta.fkidvendedor')
                    ->leftJoin('sucursal','sucursal.idsucursal','=','venta.fkidsucursal')
                    ->leftJoin('tipotransacventa', 'tipotransacventa.idtipotransacventa','=','venta.fkidtipotransacventa')
                    ->leftJoin('factura', 'factura.fkidventa','=','venta.idventa')
                    ->where($condicion)
                    ->where(function ($query) use ($request) {
                        return $query->orWhere('venta.idventa', 'ILIKE', "%$request->buscar%")
                                    ->orWhere('venta.codventa', 'ILIKE', "%$request->buscar%")
                                    ->orWhere(DB::raw("CONCAT(cliente.nombre, ' ' , cliente.apellido)"), 'ILIKE', "%$request->buscar%")
                                    ->orWhere(DB::raw("CONCAT(vendedor.nombre, ' ' , vendedor.apellido)"), 'ILIKE', "%$request->buscar%");
                    })
                    ->leftJoin('tipocontacredito', 'tipocontacredito.idtipocontacredito','=','venta.fkidtipocontacredito')
                    ->orderBy('idventa','desc')
                    ->paginate($paginate);

            }else {
                $datos = $vent->select('venta.idventa','venta.codventa','cliente.nombre as nombreCliente','tipocontacredito.descripcion as tipo',
                        'cliente.apellido as apellidoCliente','vendedor.nombre as nombreVendedor', 'venta.mtototventa',
                        'vendedor.apellido as apellidoVendedor','sucursal.nombre as nombreSucursal','venta.fecha', 'factura.idfactura')
                    ->leftJoin('cliente','cliente.idcliente','=','venta.fkidcliente')
                    ->leftJoin('vendedor','vendedor.idvendedor','=','venta.fkidvendedor')
                    ->leftJoin('sucursal','sucursal.idsucursal','=','venta.fkidsucursal')
                    ->leftJoin('tipotransacventa', 'tipotransacventa.idtipotransacventa','=','venta.fkidtipotransacventa')
                    ->leftJoin('factura', 'factura.fkidventa','=','venta.idventa')
                    ->where($condicion)
                    ->leftJoin('tipocontacredito', 'tipocontacredito.idtipocontacredito','=','venta.fkidtipocontacredito')
                    ->orderBy('idventa','desc')
                    ->paginate($paginate);
            }

            $ventas = $datos->getCollection();

            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'from' => $datos->firstItem(),
                'to' => $datos->lastItem()
            );

            return response()->json([
                'response' => 1,
                'data' => $ventas,
                'pagination' => $pagination,
                'configcliente' => $configCli,
            ]);
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
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
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idventa = $request->idventa;
            $notas = $request->nota;

            $data = new Venta();
            $data->setConnection($connection);

            $venta = $data->find($idventa);
            $venta->estadoproceso = 'F';
            $venta->notas = $request->nota;
            $venta->setConnection($connection);
            $venta->save();

            $venta_first = DB::connection($connection)
                ->table('venta as v')
                ->join('sucursal as s', 'v.fkidsucursal', '=', 's.idsucursal')
                ->join('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                ->join('almacenproddetalle as apd', 'vd.fkidalmacenproddetalle', '=', 'apd.idalmacenproddetalle')
                ->join('almacen as a', 'apd.fkidalmacen', '=', 'a.idalmacen')
                ->join('producto as p', 'apd.fkidproducto', '=', 'p.idproducto')
                ->join('moneda as m', 'p.fkidmoneda', '=', 'm.idmoneda')
                ->join('listaprecio as lp', 'm.idmoneda', '=', 'lp.fkidmoneda')
                ->join('cliente as c', 'v.fkidcliente', '=', 'c.idcliente')
                ->join('tipocontacredito as tcc', 'v.fkidtipocontacredito', '=', 'tcc.idtipocontacredito')
                ->join('vendedor as ve', 'v.fkidvendedor', '=', 've.idvendedor')
                ->join('comisionventa as co', 've.fkidcomisionventa', '=', 'co.idcomisionventa')
                ->select('v.idventa', 'v.fecha', 's.nombre as sucursal', 'c.idcliente',
                    DB::raw("CONCAT(c.nombre, ' ',c.apellido) as cliente"), 'c.nit',
                    DB::raw("CONCAT(ve.nombre, ' ',ve.apellido) as vendedor"), 've.idvendedor',
                    'co.valor', 'tcc.descripcion as tipoventa', 'v.mtototventa as total',
                    'v.descuentoporcentaje as descuento', 'v.recargoporcentaje as recargo', 'v.notas',
                    DB::raw('
                            (SELECT ve.idvehiculo FROM vehiculo as ve 
                                WHERE ve.idvehiculo = v.fkidvehiculo) 
                            AS idvehiculo'
                    ),
                    DB::raw('
                            (SELECT ve.placa FROM vehiculo as ve 
                                WHERE ve.idvehiculo = v.fkidvehiculo) 
                            AS placa'
                    ),
                    DB::raw('
                            (SELECT vt.descripcion FROM vehiculo as ve, vehiculotipo as vt 
                                WHERE vt.idvehiculotipo = ve.fkidvehiculotipo and 
                                ve.idvehiculo = v.fkidvehiculo) 
                            AS vehiculo'
                    ), DB::raw('SUM(vd.cantidad*vd.preciounit) as subtotal'), 'a.descripcion as almacen',
                    'm.descripcion as moneda', 'lp.descripcion as listaprecio', 'v.anticipo', 
                    'v.tomarcomisionvendedor as comision', 'v.fkidtipocontacredito', 'v.tc'
                )
                ->where('v.idventa', '=', $venta->idventa)
                ->whereNull('v.deleted_at')
                ->whereNull('s.deleted_at')
                ->whereNull('vd.deleted_at')
                ->whereNull('apd.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('m.deleted_at')
                ->whereNull('lp.deleted_at')
                ->whereNull('c.deleted_at')
                ->whereNull('tcc.deleted_at')
                ->whereNull('ve.deleted_at')
                ->whereNull('co.deleted_at')
                ->groupBy('v.idventa', 'v.fecha', 'sucursal', 'c.idcliente', 'cliente', 'c.nit', 
                    'vendedor', 've.idvendedor', 'co.valor', 'tipoventa', 'total', 'descuento', 
                    'recargo', 'v.notas', 'idvehiculo', 'placa', 'vehiculo', 'almacen', 'moneda', 
                    'listaprecio', 'v.anticipo', 'comision', 'v.fkidtipocontacredito'
                )
                ->first();

            $venta_detalle = DB::connection($connection)
                ->table('ventadetalle as v')
                ->join('almacenproddetalle as a', 'v.fkidalmacenproddetalle', '=', 'a.idalmacenproddetalle')
                ->join('producto as p', 'a.fkidproducto', '=', 'p.idproducto')
                ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                ->select('p.idproducto as codigo', 'p.descripcion as producto', 'v.cantidad',
                    'v.preciounit as precio', 'v.factor_desc_incre as descuento', 'u.descripcion as medida'
                )
                ->where('v.fkidventa', '=', $venta->idventa)
                ->whereNull('v.deleted_at')
                ->whereNull('a.deleted_at')
                ->whereNull('p.deleted_at')
                ->whereNull('u.deleted_at')
                ->get();

            $planpago = DB::connection($connection)
                ->table('venta as v')
                ->join('ventaplandepago as vp', 'v.idventa', '=', 'vp.fkidventa')
                ->select('vp.descripcion', 'vp.fechaapagar', 'vp.montoapagar')
                ->where('v.idventa', '=', $venta->idventa)
                ->where('vp.descripcion', '<>', 'Anticipo')
                ->whereNull('v.deleted_at')
                ->whereNull('vp.deleted_at')
                ->orderBy('vp.descripcion', 'asc')
                ->get();

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            return response()->json([
                'response' => 1,
                'idventa' => $venta->idventa,
                'configcliente' => $config_cliente,
                'venta' => $venta_first,
                'venta_detalle' => $venta_detalle,
                'planpago' => $planpago,
            ]);
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
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
    public function edit($id)
    {
        //
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
        //
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
