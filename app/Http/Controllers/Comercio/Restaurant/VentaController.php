<?php

namespace App\Http\Controllers\Comercio\Restaurant;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\ListaPrecio;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Almacen\Sucursal;
use App\Models\Comercio\Ventas\Cliente;
use App\Models\Comercio\Ventas\Cobro;
use App\Models\Comercio\Ventas\CobroPlanPagoDet;
use App\Models\Comercio\Ventas\PlanDePago;
use App\Models\Comercio\Ventas\Vendedor;
use App\Models\Comercio\Ventas\Venta;
use App\Models\Comercio\Ventas\VentaDetalle;
use Carbon\Carbon;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Storage;
use Image;

class VentaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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

            $cli = new Cliente();
            $cli->setConnection($connection);
            $cliente = $cli->orderBy('idcliente', 'desc')->get()->take(20);

            $vend = new Vendedor();
            $vend->setConnection($connection);
            $mesero = $vend->leftJoin('comisionventa as co', 'co.idcomisionventa', 'vendedor.fkidcomisionventa')
                ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 'vendedor.apellido', 'co.valor')
                ->orderBy('vendedor.idvendedor', 'desc')->get()->take(20);

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

            $mon = new Moneda();
            $mon->setConnection($connection);
            $moneda  = $mon->orderBy('idmoneda', 'asc')->get();

            $lista_precio = [];

            if (sizeof($moneda) > 0) {
                $listap = new ListaPrecio();
                $listap->setConnection($connection);

                $lista_precio = $listap->where(['fkidmoneda' => $moneda[0]->idmoneda, 'estado' => 'A'])
                    ->orderBy('idlistaprecio', 'asc')->get();
            }

            $producto = [];

            if ((sizeof($lista_precio) > 0) && (sizeof($almacen) > 0)) {
                $producto = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion')
                    ->where('listproddet.fkidlistaprecio', '=', $lista_precio[0]->idlistaprecio)
                    ->where('almproddet.fkidalmacen', '=', $almacen[0]->idalmacen)
                    ->where('p.tipo', '=', 'P')
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);
            }

            $categoria = DB::connection($connection)
                ->table('familia')
                ->select('idfamilia', 'descripcion', 'idpadrefamilia', 'estado')
                ->where('estado', '=', 'A')
                ->where('idfamilia', '!=', '1')
                ->whereNull('deleted_at')
                ->whereNull('idpadrefamilia')
                ->orderBy('idfamilia', 'asc')
                ->get();

            $array_categoria = [];

            foreach ($categoria as $c) {

                $prod = new Producto();
                $prod->setConnection($connection);

                $categoria_children = DB::connection($connection)
                    ->table('familia')
                    ->select('idfamilia', 'descripcion', 'idpadrefamilia', 'estado')
                    ->where('idpadrefamilia', '=', $c->idfamilia)
                    ->where('estado', '=', 'A')
                    ->whereNull('deleted_at')
                    ->orderBy('idfamilia', 'asc')
                    ->get();

                $background_children = [];

                foreach ($categoria_children as $d) {
                    array_push($background_children, [
                        'background' => 'rgb('.rand(0, 254).','.rand(0, 254).','.rand(0, 254).')',
                        'loading' => false,
                    ]);
                }

                array_push($array_categoria, [
                    'idfamilia' => $c->idfamilia,
                    'descripcion' => $c->descripcion,
                    'idpadrefamilia' => $c->idpadrefamilia,
                    'estado' => $c->estado,
                    'background' => 'rgb('.rand(0, 254).','.rand(0, 254).','.rand(0, 254).')',
                    'loading' => false,

                    'producto' => [],
                    
                    // $prod
                    //     ->leftJoin('listapreproducdetalle as listproddet', 'producto.idproducto', '=', 'listproddet.fkidproducto')
                    //     ->leftJoin('almacenproddetalle as almproddet', 'producto.idproducto', '=', 'almproddet.fkidproducto')
                    //     ->leftJoin('productofoto as prodfoto', 'producto.idproducto', '=', 'prodfoto.fkidproducto')
                    //     ->select('producto.idproducto', 'producto.codproducto', 'producto.descripcion', 'prodfoto.foto')
                    //     ->where('listproddet.fkidlistaprecio', '=', $lista_precio[0]->idlistaprecio)
                    //     ->where('almproddet.fkidalmacen', '=', $almacen[0]->idalmacen)
                    //     ->where('producto.tipo', '=', 'P')
                    //     ->where('producto.fkidfamilia', '=', $c->idfamilia)
                    //     ->whereNull('listproddet.deleted_at')
                    //     ->whereNull('producto.deleted_at')
                    //     ->whereNull('almproddet.deleted_at')
                    //     ->whereNull('prodfoto.deleted_at')
                    //     ->orderBy('producto.idproducto', 'asc')
                    //     ->get(),
                    
                    'categoria' => $categoria_children,
                    'background_categoria' => $background_children,
                ]);

            }

            $tiposContaCredito = DB::connection($connection)
                ->table('tipocontacredito')
                ->whereNUll('deleted_at')
                ->orderBy('idtipocontacredito', 'asc')
                ->get();

            return response()->json([
                "response"=> 1 ,
                'data' => $connection,
                'cliente' => $cliente,
                'mesero' => $mesero,
                'producto' => $producto,

                'array_categoria' => $array_categoria,

                'sucursal' => $sucursal,
                'almacen' => $almacen,
                'moneda' => $moneda,
                'lista_precio' => $lista_precio,
                'tiposcontacredito' => $tiposContaCredito,
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            date_default_timezone_set("America/La_Paz");
            $fechatransacventa = date('Y-m-d H:i:s');

            $fecha = $request->fecha;
            $hora = $request->hora;

            $estado = $request->estado;
            $estadoproceso = $request->estadoproceso;

            $fkidcliente = $request->fkidcliente;
            $fkidvendedor = $request->fkidvendedor;
            $fkidmoneda = $request->fkidmoneda;
            $fkidsucursal = $request->fkidsucursal;
            $fkidtipocontacredito = $request->fkidtipocontacredito;
            $fkidtipotransacventa = $request->fkidtipotransacventa;

            $idusuario = $request->idusuario;

            $descuento = $request->descuento;
            $incremento = $request->incremento;

            $tipo_descuento = $request->tipo_descuento;
            $tipo_incremento = $request->tipo_incremento;
            $tipo_entrega = $request->tipo_entrega;

            $totalventa = $request->totalventa;

            $notas = $request->notas;

            $arrayventadetalle = json_decode($request->arrayventadetalle);

            $venta = new Venta();
            $venta->setConnection($connection);
            $venta->codventa = null;
            $venta->fecha = $fecha;
            $venta->hora = $hora;
            $venta->tomarcomisionvendedor = 0;
            $venta->anticipo = 0;

            $venta->descuentoporcentaje = $descuento;
            $venta->recargoporcentaje = $incremento;

            $venta->descuentotipo = $tipo_descuento;
            $venta->recargotipo = $tipo_incremento;
            $venta->tipoentrega = $tipo_entrega;

            $venta->fechahoratransac = $fechatransacventa;
            $venta->notas = $notas;

            $venta->estado = $estado;
            $venta->estadoproceso = $estadoproceso;

            $venta->fkidsucursal = $fkidsucursal;
            $venta->fkidcliente = $fkidcliente;
            $venta->fkidvendedor = $fkidvendedor;
            $venta->fkidtipocontacredito = $fkidtipocontacredito;
            $venta->fkidtipotransacventa = $fkidtipotransacventa;
            $venta->fkidmoneda = $fkidmoneda;
            $venta->fkidvehiculo = null;

            $venta->idusuario = $idusuario;

            $venta->mtototventa = $totalventa;
            $venta->mtototcobrado = $totalventa;

            $venta->save();

            $cantidadFichaEstimulado = DB::table('venta')
                ->where('fecha', '=', $fecha)
                ->where('idventa', '<>' , $venta->idventa)
                ->whereNull('deleted_at')
                ->get();

            $venta->nroficha = sizeof($cantidadFichaEstimulado) + 1;

            $venta->update();

            $almdet = new AlmacenProdDetalle();
            $almdet->setConnection($connection);
            $prodt = new Producto();
            $prodt->setConnection($connection);

            $array_detalle = [];

            foreach ($arrayventadetalle as $item => $valor) {

                $ventadetalle = new VentaDetalle();
                $ventadetalle->setConnection($connection);
                $ventadetalle->cantidad = $valor->cantidad;
                $ventadetalle->preciounit = $valor->preciounit;
                $ventadetalle->factor_desc_incre =  0;
                $ventadetalle->fkidalmacenproddetalle = $valor->fkidalmacenprodetalle;
                $ventadetalle->fkidventa = $venta->idventa;
                $ventadetalle->fkidlistapreproducdetalle =  $valor->fkidlistaproddetalle;
                $ventadetalle->nota =  $valor->nota;
                $ventadetalle->estadoproceso =  $valor->estadoproceso;
                $ventadetalle->tipoentrega =  $valor->orden_pedido;

                if ($ventadetalle->save()) {
                    array_push($array_detalle, [
                        'idventadetalle' => $ventadetalle->idventadetalle,
                        'cantidad' => $ventadetalle->cantidad,
                        'preciounit' => $ventadetalle->preciounit,
                        'producto' => $valor->producto,
                        'fkidventa' => $ventadetalle->fkidventa,
                        'nota' => $ventadetalle->nota,
                        'estadoproceso' => $ventadetalle->estadoproceso,
                        'tipoentrega' => $ventadetalle->tipoentrega,
                        'estado' => 'A',
                        'fechainicio' => $venta->fecha,
                        'fechafin' => '',
                        'horainicio' => $venta->hora,
                        'horafin' => '',
                    ]);
                }

                // $almacenprod = $almdet->find($valor->fkidalmacenprodetalle);
                // $newstock = $almacenprod->stock - $valor->cantidad;
                // $almacenprod->stock = $newstock;
                // $almacenprod->setConnection($connection);
                // $almacenprod->save();

                // $producto = $prodt->find($valor->idproducto);
                // $newstockproducto = $producto->stock - $valor->cantidad; 
                // $producto->stock = $newstockproducto;
                // $producto->setConnection($connection);
                // $producto->save();
                
            }
            
            // if ($fkidtipocontacredito == 1) {

            //     $plandepago = new PlanDePago();
            //     $plandepago->setConnection($connection);
            //     $plandepago->descripcion = 'Contado';
            //     $plandepago->fechaapagar = $venta->fecha;
            //     $plandepago->montoapagar = $totalventa;
            //     $plandepago->montopagado = $totalventa;
            //     $plandepago->estado = 'P';
            //     $plandepago->fkidventa = $venta->idventa;
            //     $plandepago->save();

            //     $cobro = new Cobro();
            //     $cobro->setConnection($connection);
            //     $cobro->fecha = $venta->fecha;
            //     $cobro->hora = $venta->hora;
            //     $cobro->fechahoratransac = new Carbon();
            //     $cobro->idusuario = $request->get('x_idusuario');
            //     $cobro->save();

            //     $cobrodet = new CobroPlanPagoDet();
            //     $cobrodet->setConnection($connection);
            //     $cobrodet->fkidventaplandepago = $plandepago->idventaplandepago;
            //     $cobrodet->fkidcobro = $cobro->idcobro;
            //     $cobrodet->montocobrado = $totalventa;
            //     $cobrodet->save();
                
            // }

            $venta_objeto = new \stdClass();
            $venta_objeto->idventa = $venta->idventa;
            $venta_objeto->nroficha = $venta->nroficha;
            $venta_objeto->fecha = $venta->fecha;
            $venta_objeto->fechafin = '';
            $venta_objeto->hora = $venta->hora;
            $venta_objeto->horafin = '';
            $venta_objeto->cliente = $request->nombrecliente;
            $venta_objeto->mesero = $request->nombremesero;
            $venta_objeto->notas = $venta->notas;
            $venta_objeto->estadoproceso = $venta->estadoproceso;
            $venta_objeto->tipoentrega = $venta->tipoentrega;
            $venta_objeto->estado = 'A';

            $nombre_archivo = $connection.'-'.$request->fecha.'.txt';

            $pathabsoluto = "/storage/pedido/".$nombre_archivo;
            $bandera = 0;

            if (file_exists(public_path().$pathabsoluto)) {

                $bandera = json_decode(file_get_contents(public_path().$pathabsoluto));

                $array = file_get_contents(public_path().$pathabsoluto);
                $array = json_decode($array);

                array_push($array, [
                    'venta' => $venta_objeto,
                    'venta_detalle' => $array_detalle,
                ]);
                
                Storage::put('public/pedido/'. $nombre_archivo, json_encode($array));
            }else {
                $array = [];
                array_push($array, [
                    'venta' => $venta_objeto,
                    'venta_detalle' => $array_detalle,
                ]);
                Storage::put('public/pedido/'. $nombre_archivo, json_encode($array));
            }

            DB::commit();

            return response()->json([
                "response" => 1,
                'bandera' => $bandera,
                //'venta' => $venta,
                //'data' => Venta::find(1),
            ]);
        } catch (DecryptException $e) {
            DB::rollBack();
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
            DB::rollBack();
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

    public function search_producto(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->filled('value') ? $request->get('value') : '';
            $idlista = $request->idlistaprecio;
            $idalmacen = $request->idalmacen;

            if ($value == '') {
                $productos = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion',
                        'listproddet.precio', 'p.tipo', 'almproddet.stock'
                    )
                    ->where('listproddet.fkidlistaprecio', '=', $idlista)
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    ->where('p.tipo', '=', 'P')
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);
            }else {
                $productos = DB::connection($connection)
                    ->table('producto as p')
                    ->join('listapreproducdetalle as listproddet', 'p.idproducto', '=', 'listproddet.fkidproducto')
                    ->join('almacenproddetalle as almproddet', 'p.idproducto', '=', 'almproddet.fkidproducto')
                    ->join('unidadmedida as u', 'p.fkidunidadmedida', '=', 'u.idunidadmedida')
                    ->select('p.idproducto', 'p.codproducto', 'p.descripcion', 'u.abreviacion')
                    ->where('listproddet.fkidlistaprecio', '=', $idlista)
                    ->where('almproddet.fkidalmacen', '=', $idalmacen)
                    ->where('p.descripcion', 'ILIKE', '%'.$value.'%')
                    ->where('p.tipo', '=', 'P')
                    ->whereNull('listproddet.deleted_at')
                    ->whereNull('p.deleted_at')
                    ->whereNull('almproddet.deleted_at')
                    ->orderBy('p.idproducto', 'desc')
                    ->get()->take(20);
            }

            return response()->json([
                "response" => 1,
                "data" => $productos,
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

    public function categoria_getproducto(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $idfamilia = $request->idfamilia;
            $idlista = $request->idlistaprecio;
            $idalmacen = $request->idalmacen;

            $array_idproductos = json_decode($request->idproductos);

            $prod = new Producto();
            $prod->setConnection($connection);

            $productos = $prod
                ->leftJoin('listapreproducdetalle as listproddet', 'producto.idproducto', '=', 'listproddet.fkidproducto')
                ->leftJoin('almacenproddetalle as almproddet', 'producto.idproducto', '=', 'almproddet.fkidproducto')
                ->select('producto.idproducto', 'producto.codproducto', 'producto.descripcion')
                ->where('listproddet.fkidlistaprecio', '=', $idlista)
                ->where('almproddet.fkidalmacen', '=', $idalmacen)
                ->where('producto.tipo', '=', 'P')
                ->where('producto.fkidfamilia', '=', $idfamilia)
                ->whereNull('listproddet.deleted_at')
                ->whereNull('producto.deleted_at')
                ->whereNull('almproddet.deleted_at')
                ->orderBy('producto.idproducto', 'asc')
                ->get();

            $array_producto = [];

            foreach ($productos as $p) {

                $checked = false;

                for ($i = 0; $i < sizeof($array_idproductos); $i++) {
                    $idproducto = $array_idproductos[$i]->idproducto;
                    if ($idproducto == $p->idproducto) {
                        $checked = true;
                        break;
                    }
                }

                array_push($array_producto, [
                    'idproducto' => $p->idproducto,
                    'codproducto' => $p->codproducto,
                    'descripcion' => $p->descripcion,

                    'imagen' => DB::connection($connection)
                        ->table('productofoto')
                        ->select('fkidproducto', 'foto')
                        ->where('fkidproducto', '=', $p->idproducto)
                        ->whereNull('deleted_at')
                        ->orderBy('idproductofoto', 'asc')
                        ->get(),

                    'checked' => $checked,
                    
                ]);

            }

            return response()->json([
                "response" => 1,
                'producto' => $array_producto,
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
}
