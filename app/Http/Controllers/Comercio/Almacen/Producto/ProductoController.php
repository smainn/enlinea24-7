<?php

namespace App\Http\Controllers\Comercio\Almacen\Producto;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Almacen\Producto\ProductoFoto;
use App\Models\Comercio\Almacen\Producto\ProductoCaracteristica;
use App\Models\Comercio\Almacen\Producto\ProdCaractDetalle;
use App\Models\Comercio\Almacen\AlmacenUbicacion;
use App\Models\Comercio\Almacen\Producto\Familia;
use App\Models\Comercio\Almacen\Moneda;
use App\Models\Comercio\Almacen\UnidadMedida;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Comercio\Almacen\Producto\ProducCodigoAdicional;
use App\Models\Comercio\Almacen\Producto\ListaPreProducDetalle;
use App\Models\Comercio\Almacen\ListaPrecio;
use App\Models\Config\ConfigFabrica;
use App\Models\Config\ConfigCliente;
use App\Models\Seguridad\Log;

use App\CustomCollection;
use App\Models\Comercio\Almacen\Sucursal;
use Illuminate\Support\Facades\DB;
use Image;
use PDF;


class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $produ = new Producto();
            $produ->setConnection($connection);

            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $buscar = $request->filled('value') ? $request->get('value') : '';

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->decrypt();

            if ($buscar != '') {

                $datos = $produ->leftJoin('familia as f', 'f.idfamilia', 'producto.fkidfamilia')
                    ->leftJoin('unidadmedida as um', 'um.idunidadmedida', 'producto.fkidunidadmedida')
                    ->leftJoin('moneda as m', 'm.idmoneda', 'producto.fkidmoneda')
                    ->select('producto.idproducto', 'producto.codproducto', 'producto.descripcion',
                            'producto.precio', 'producto.tipo', 'f.descripcion as familia', 'producto.stock',
                            'um.descripcion as unidadmedida', 'm.descripcion as moneda')
                    ->orWhere('producto.idproducto', 'LIKE', "%$request->value%")
                    ->orWhere('producto.codproducto', 'ILIKE', "%$request->value%")
                    ->orWhere('producto.descripcion', 'ILIKE', "%$request->value%")
                    ->orWhere('producto.precio', 'ILIKE', "%$request->value%")
                    ->orWhere('producto.stock', 'ILIKE', "%$request->value%")
                    ->orWhere('f.descripcion', 'ILIKE', "%$request->value%")
                    ->orderBy('producto.idproducto', 'desc')
                    ->paginate($paginate);

            } else {

                $datos = $produ->leftJoin('familia as f', 'f.idfamilia', 'producto.fkidfamilia')
                    ->leftJoin('unidadmedida as um', 'um.idunidadmedida', 'producto.fkidunidadmedida')
                    ->leftJoin('moneda as m', 'm.idmoneda', 'producto.fkidmoneda')
                    ->select('producto.idproducto', 'producto.codproducto', 'producto.descripcion',
                            'producto.precio', 'producto.tipo', 'f.descripcion as familia', 'producto.stock',
                            'um.descripcion as unidadmedida', 'm.descripcion as moneda')
                    ->orderBy('producto.idproducto', 'desc')
                    ->paginate($paginate);
            }
            
            $productos = $datos->getCollection();
            
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'from' => $datos->firstItem(),
                'to' =>   $datos->lastItem(),
            );

            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $productos,
                'config' => $configs,
            ]);
            
            
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo obtener los productos'
            ]);
        }
        
    }

    public function getProductos(Request $request, $paginate) {
        //return response()->json([ 'response' => 1, 'data' => $request ]);
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $produ = new Producto();
            $produ->setConnection($connection);

            $datos = $produ->orderBy('idproducto','DESC')->paginate($paginate);
            $productos = $datos->getCollection();
            $data = array();
            $index = 0;
            foreach ($productos as $producto) {
                $id = $producto->idproducto;
                $familia = $produ->find($id)->familia->descripcion;
                $unidadmedida = $produ->find($id)->unidadmedida->descripcion;
                $moneda = $produ->find($id)->moneda->descripcion;
                $producto->familia = $familia;
                $producto->unidadmedida = $unidadmedida;
                $producto->moneda = $moneda;
                $data[$index] = $producto;
                $index++;
            }

            $pagination = array(
                "total" => $datos->total(),
                "current_page" => $datos->currentPage(),
                "per_page" => $datos->perPage(),
                "last_page" => $datos->lastPage(),
                "first" => $datos->firstItem(),
                "last" =>   $datos->lastItem()
            );

            return response()->json([
                "response" => 1,
                "pagination" => $pagination,
                "data" => $data,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo obtener los productos'
            ]);
        }
    }

    public function existenciaalmacen(Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $idproducto = $request->idproducto;

            $obj = new Producto();
            $obj->setConnection($connection);
            $producto = $obj
                ->leftJoin('almacenproddetalle as almdet', 'producto.idproducto', '=', 'almdet.fkidproducto')
                ->leftJoin('almacen as alm', 'almdet.fkidalmacen', '=', 'alm.idalmacen')
                ->leftJoin('sucursal as suc', 'alm.fkidsucursal', '=', 'suc.idsucursal')
                ->leftJoin('almacenubicacion as almubic', 'almdet.fkidalmacenubicacion', '=', 'almubic.idalmacenubicacion')
                ->select(
                    'producto.idproducto', 'producto.codproducto', 'producto.descripcion',
                    'almdet.stock', 'almdet.stockminimo', 'almdet.stockmaximo',
                    'alm.idalmacen', 'alm.descripcion as almacen', 'alm.direccion as almacendireccion',
                    'suc.idsucursal', 'suc.nombre as sucursal', 'suc.direccion as sucursaldireccion',
                    'almubic.descripcion as ubicacion'
                )
                ->where('producto.idproducto', '=', $idproducto)
                ->whereNull('producto.deleted_at')
                ->orderBy('almdet.idalmacenproddetalle', 'asc')
                ->get();
            
            return response()->json([
                "response" => 1,
                'data' => $producto,
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
    public function create(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configCli = $conf->first();
            $configCli->decrypt();

            $conf = new ConfigFabrica();
            $conf->setConnection($connection);
            $configFab = $conf->first();
            $configFab->decrypt();
            
            $almu = new AlmacenUbicacion();
            $almu->setConnection($connection);
            $ubicaciones = $almu->orderBy('idalmacenubicacion', 'asc')->get();

            $car = new ProductoCaracteristica();
            $car->setConnection($connection);
            $caracteristicas = $car->orderBy('idproduccaracteristica', 'asc')->get();

            $fam = new Familia();
            $fam->setConnection($connection);
            $familias = $fam->orderBy('idfamilia', 'asc')->get();

            $mon = new Moneda();
            $mon->setConnection($connection);
            $monedas = $mon->orderBy('idmoneda', 'asc')->get();

            $um = new UnidadMedida();
            $um->setConnection($connection);
            $unidades = $um->orderBy('idunidadmedida', 'asc')->get();

            $alm = new Almacen();
            $alm->setConnection($connection);
            $almacenes = $alm->orderBy('idalmacen', 'asc')->get();

            $lp = new ListaPrecio();
            $lp->setConnection($connection);
            $listap = $lp->orderBy('idlistaprecio', 'asc')->get();

            return response()->json([
                'response'          => 1,
                'configcli'         => $configCli,
                'configfab'         => $configFab,
                'ubicaciones'       => $ubicaciones,
                'caracteristicas'   => $caracteristicas,
                'familias'          => $familias,
                'monedas'           => $monedas,
                'unidades'          => $unidades,
                'almacenes'         => $almacenes,
                'listaprecios'      => $listap
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'error' => $th
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
    
        if ($request->filled('descripcion') && $request->filled('tipo')) {
            
            DB::beginTransaction();
            //echo "inicio";
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $descripcion = $request->input('descripcion');
                $codproducto = $request->input('codproducto');
                $costo = $request->input('costo', 0);
                $precio = $request->input('precio', 0);
                $tipo = $request->input('tipo');
                $stock = $request->input('stock', 0);
                $stockmax = $request->input('stockmax',0);
                $stockmin = $request->input('stockmin',0);
                $palclaves = $request->get('palclaves');
                $notas = $request->get('notas');
                $tipocomision = $request->input('tipocomision','V');//no
                $comision = $request->input('comision',0);//no
                $costodos = $request->input('costodos', 0); //
                $costotres = $request->input('costotres', 0);//
                $costocuatro = $request->input('costocuatro', 0);//

                //$id_producto = $request->input('id_producto',null);
                $idMoneda = $request->input('idMoneda',1);
                $idFamilia = $request->input('idFamilia',1);
                $idClasificacion = $request->input('idClasificacion',1);
                $idUnidad = $request->input('idUnidad',1);
                //$descripcionClasif = $request->input('descripcionClasifi');
                $arrayImgs = json_decode($request->input('images','[]'));
                $arrayNames = json_decode($request->input('nameImages','[]'));
                $idsCaracteristicas = json_decode($request->input('idsCaracteristicas','[]'));
                $valuesCaracteristicas = json_decode($request->input('valuesCaracteristicas','[]'));
                $dataIdsAlmacen = json_decode($request->input('dataIdsAlmacen','[]'));
                $dataStocks = json_decode($request->input('dataStocks','[]'));
                $dataStocksMax = json_decode($request->input('dataStocksMax','[]'));
                $dataStocksmin = json_decode($request->input('dataStocksmin','[]'));
                $dataUbicaciones = json_decode($request->input('dataUbicaciones','[]'));

                $codigosAdicionales = json_decode($request->input('codigosprod','[]'));
                $descCodigos = json_decode($request->input('descodigos','[]'));

                $producto = new Producto();
                $producto->codproducto = $codproducto;
                $producto->descripcion = $descripcion;
                $producto->costo = $costo;
                $producto->precio = $precio;
                $producto->tipo = $tipo;
                $producto->stock = $stock;
                $producto->stockminimo = $stockmin;
                $producto->stockmaximo = $stockmax;
                $producto->palabrasclaves = $palclaves;
                $producto->notas = $notas;
                $producto->tipocomision = $tipocomision;
                $producto->comision = $comision;
                $producto->costodos = $costodos;
                $producto->costotres = $costotres;
                $producto->costocuatro = $costocuatro;

                //$producto->id_producto = $idProducto;
                $producto->fkidmoneda = $idMoneda;
                $producto->fkidfamilia = $idFamilia;
                //$producto->fkidclasificacion = $idClasificacion;
                $producto->fkidunidadmedida = $idUnidad;
                $producto->setConnection($connection);
                $producto->save();

                //guardando las imagenes

                $longitudN = sizeof($arrayNames);
                for ($i = 0; $i < $longitudN; $i++) {
                    try {
                        $newString = explode(".",$arrayNames[$i]);
                        $extension = $newString[sizeof($newString)-1];
                        $name = md5($newString[0]);
                        $image = Image::make($arrayImgs[$i]);
                        $image->resize(700, null, function ($constraint) {
                            $constraint->aspectRatio();
                            $constraint->upsize();
                        });
                        $imgData = (string)$image->encode('jpg',30);
                        $pathStore = "public/producto/img/" . $name . "." . $extension;
                        Storage::put($pathStore, $imgData);
                        $pathAbosobulte = "/storage/producto/img/" . $name . "." . $extension;
                        $productoFoto = new ProductoFoto();
                        $productoFoto->foto = $pathAbosobulte;
                        $productoFoto->fkidproducto = $producto->idproducto;
                        $productoFoto->save();

                    } catch (\Throwable $th) {
                        //echo "ERROR AL GUARDAR IMG";
                        return response()->json([
                            "response" => 0,
                            "message" => 'Error al guardar las imagenes',
                            'error' => [
                                'file' => $th->getFile(),
                                'line' => $th->getLine(),
                                'message' => $th->getMessage()
                            ]
                        ]);
                    }

                }

                $longitudCodigos = sizeof($codigosAdicionales);
                for ($i = 0; $i < $longitudCodigos; $i++) {

                    $prodcodAdicional = new ProducCodigoAdicional();
                    $prodcodAdicional->codproduadi = $codigosAdicionales[$i];
                    $prodcodAdicional->descripcion = $descCodigos[$i];
                    $prodcodAdicional->fkidproducto = $producto->idproducto;
                    $prodcodAdicional->setConnection($connection);
                    $prodcodAdicional->save();

                }

                $longitudC = sizeof($idsCaracteristicas);
                for ($i = 0; $i < $longitudC; $i++) {

                    $prodCarDet = new ProdCaractDetalle();
                    $prodCarDet->descripcion = $valuesCaracteristicas[$i];
                    $prodCarDet->fkidproducto = $producto->idproducto;
                    $prodCarDet->fkidproduccaracteristica = $idsCaracteristicas[$i];
                    $prodCarDet->setConnection($connection);
                    $prodCarDet->save();

                }

                if ($tipo == "P") {

                    $longitudA = sizeof($dataIdsAlmacen);
                    for ($i = 0; $i < $longitudA; $i++) {

                        $almprodDet = new AlmacenProdDetalle();
                        $almprodDet->stock = $dataStocks[$i];
                        $almprodDet->stockminimo = $dataStocksmin[$i];
                        $almprodDet->stockmaximo = $dataStocksMax[$i];
                        $ubicacion = $dataUbicaciones[$i] == 0 ? null : $dataUbicaciones[$i];
                        $almprodDet->fkidalmacenubicacion = $ubicacion;
                        $almprodDet->fkidalmacen = $dataIdsAlmacen[$i];
                        $almprodDet->fkidproducto = $producto->idproducto;
                        $almprodDet->setConnection($connection);
                        $almprodDet->save();

                    }
                } else {
                    $dataIdsAlmacen = json_decode($request->input('dataIdsAlmacen','[]'));
                    $longitud = sizeof($dataIdsAlmacen);
                    for ($i = 0; $i < $longitud; $i++) {
                        $almprodDet = new AlmacenProdDetalle();
                        $almprodDet->stock = 0;
                        $almprodDet->stockminimo = 0;
                        $almprodDet->stockmaximo = 0;
                        $almprodDet->fkidalmacenubicacion = null;
                        $almprodDet->fkidalmacen = $dataIdsAlmacen[$i];
                        $almprodDet->fkidproducto = $producto->idproducto;
                        $almprodDet->setConnection($connection);
                        $almprodDet->save();
                    }
                }

                /*$conf = new ConfigFabrica(); //SIEMPRE INSETAR A LA PRIMERA LISTA DE PRECIOS
                $conf->setConnection($connection);
                $configs = $conf->first();
                */
                $listp = new ListaPrecio();
                $listp->setConnection($connection);
                $listaPrecio = $listp->orderBy('idlistaprecio', 'ASC')->first();
                $listaDetalle = new ListaPreProducDetalle();
                $listaDetalle->precio = $producto->precio;
                $listaDetalle->fkidproducto = $producto->idproducto;
                $listaDetalle->fkidlistaprecio = $listaPrecio->idlistaprecio;
                $listaDetalle->setConnection($connection);
                $listaDetalle->save();

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto el producto ' . $producto->idproducto;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'producto' => $producto
                ]);
            } catch (DecryptException $e) {
                DB::rollback();
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelva a iniciar sesion',
                    'error' => $e
                ]);
            } catch (\Throwable $th) {
                DB::rollback();
                return response()->json([
                    'response' => -1,
                    'message' => 'No se pudo procesar la solicitud',
                    'error' => $th
                ]);
            }

        } else {

            return response()->json([
                'response' => -1,
                'message' => 'No se recibieron los paramtros necesarios'
            ]);

        }
    }

    public function search(Request $request, $value) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $result = $produ->Search($value)->get();
            return response()->json([
                "response" => 1,
                "data" => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema'
            ]);
        }
        
    }

    public function searchId(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $result = $produ->SearchId($value)->get();
            $data = array();
            foreach ($result as $row) {
                $row->unidadmedida;
                array_push($data, $row);
            }
            return response()->json([
                'response' => 1,
                'data' => $data
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema'
            ]);
        }
    }

    public function searchDesc(Request $request, $value) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $result = $produ->SearchDesc($value)->get();
            $data = array();
            foreach ($result as $row) {
                $row->unidadmedida;
                array_push($data, $row);
            }
            return response()->json([
                'response' => 1,
                'data' => $data
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema'
            ]);
        }
    }

    public function getAlmacenProd(Request $request, $id) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $almacenProd = $produ->findOrFail($id)->detallealamcenprod;
            $data = array();
            
            $almp = new AlmacenProdDetalle();
            $almp->setConnection($connection);
            foreach ($almacenProd as $row) {
                $iddet = $row->idalmacenproddetalle;
                $almacen = $almp->find($iddet)->almacen;
                array_push($data, [
                    'descripcion' => $almacen->descripcion,
                    'idalmacen' => $almacen->idalmacen,
                    'idalmacenprod' => $iddet
                ]);
            }
            
            return response()->json([
                'response' => 1,
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
                'message' => 'El producot no existe'
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

            $produ = new Producto();
            $produ->setConnection($connection);

            $producto = $produ->find($id);

            $producto_caracteristica = DB::connection($connection)
                ->table('produccaracteristica as prodcarac')
                ->join('prodcaracdetalle as prodcaracdet', 'prodcarac.idproduccaracteristica', '=', 'prodcaracdet.fkidproduccaracteristica')
                ->select('prodcaracdet.descripcion', 'prodcarac.caracteristica')
                ->where('prodcaracdet.fkidproducto', '=', $id)
                ->whereNull('prodcaracdet.deleted_at')
                ->whereNull('prodcarac.deleted_at')
                ->orderBy('prodcarac.idproduccaracteristica', 'asc')
                ->get();


            $datadetalle = $produ->find($id)->detalleprodcaract;

            $detalleCaracteristicas = array();
            $i = 0;

            $prodd = new ProdCaractDetalle();

            $prodd->setConnection($connection);
            foreach ($datadetalle as $row) {
                $iddet = $row->idprodcaracdetalle;
                $caract = $prodd->find($iddet)->prodcaracteristicas->caracteristica;
                $detalleCaracteristicas[$i]["caracteristica"] =  $caract;
                $detalleCaracteristicas[$i]["descripcion"] = $row->descripcion;
                $i++;
            }

            $detalleAlmacen = $produ->find($id)->detallealamcenprod;
            $dataAlmacen = array();
            $i = 0;

            $almacen_producto = DB::connection($connection)
                ->table('almacenproddetalle as almproddet')
                ->select('almproddet.stock', 'almproddet.stockminimo', 'almproddet.stockmaximo', 
                    DB::raw('
                        (SELECT a.descripcion FROM almacen as a 
                            WHERE a.idalmacen = almproddet.fkidalmacen) 
                        AS almacen
                    '),
                    DB::raw('
                        (SELECT almubic.descripcion FROM almacenubicacion as almubic 
                            WHERE almubic.idalmacenubicacion = almproddet.fkidalmacenubicacion) 
                        AS ubicacion
                    ')
                )
                ->where('almproddet.fkidproducto', '=', $id)
                ->whereNull('almproddet.deleted_at')
                ->orderBy('almproddet.idalmacenproddetalle', 'asc')
                ->get();

            $almd = new AlmacenProdDetalle();
            $almd->setConnection($connection);
            foreach ($detalleAlmacen as $row) {
                $iddet = $row->idalmacenproddetalle;
                $almacenProdDetalle = $almd->find($iddet);
                $almacen = $almacenProdDetalle->almacen;
                $ubicacion = $almacenProdDetalle->ubicacion;

                $dataAlmacen[$i]["stock"] = $row->stock;
                $dataAlmacen[$i]["stockminimo"] = $row->stockminimo;
                $dataAlmacen[$i]["stockmaximo"] = $row->stockmaximo;
                $dataAlmacen[$i]["ubicacion"] = $ubicacion;
                $dataAlmacen[$i]["almacen"] = $almacen->descripcion;

                $i++;
            }

            $producto->codigos;
            $producto->foto;
            $producto->familia;
            $producto->moneda;
            $producto->unidadmedida;

            $respuesta = array(
                "response" => 1,
                "producto" => $producto,
                "almacenes" => $almacen_producto,
                "caracteristicas" => $producto_caracteristica
                
            );

            return response()->json($respuesta);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error' => $th
            ]);
        }
        
    }

    /**
     * Show the form for editing the specified resource.
     * @return Response
     */
    public function edit(Request $request, $id)
    {   
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $productoCopia = $produ->findOrFail($id);
            $producto = $productoCopia;
            $datadetalle = $productoCopia->detalleprodcaract;
            $detalleCaracteristicas = array();
            $i = 0;

            $prodd = new ProdCaractDetalle();
            $prodd->setConnection($connection);
            foreach ($datadetalle as $row) {
                $iddet = $row->idprodcaracdetalle;
                $caract = $prodd->find($iddet)->prodcaracteristicas;
                $detalleCaracteristicas[$i]["iddetallecaract"] = $row->idprodcaracdetalle;
                $detalleCaracteristicas[$i]["idprodcaracteristica"] = $caract->idproduccaracteristica;
                $detalleCaracteristicas[$i]["caracteristica"] =  $caract->caracteristica;
                $detalleCaracteristicas[$i]["descripcion"] = $row->descripcion;
                $i++;
            }
            
            $almacenDetalle = $productoCopia->detallealamcenprod;
            $dataAlmacen = array();
            $i = 0;
            $almd = new AlmacenProdDetalle();
            $almd->setConnection($connection);
            foreach ($almacenDetalle as $row) {
                $iddet = $row->idalmacenproddetalle;
                $almacenProdDetalle = $almd->find($iddet);
                $eliminar = 1;
                if ($almacenProdDetalle->compradetalle->count() > 0 || $almacenProdDetalle->ventadetalle->count() > 0 || 
                    $almacenProdDetalle->invetariocortedetalle->count() > 0 || $almacenProdDetalle->traspasoproddetalle->count() > 0 ||
                    $almacenProdDetalle->ingresoproddetalle->count() > 0 || $almacenProdDetalle->salidaproddetalle->count() > 0) {
                        
                    $eliminar = 0;
                }
                $almacen = $almacenProdDetalle->almacen;
                $ubicacion = $almacenProdDetalle->ubicacion;
                
                $dataAlmacen[$i]["idalmacenprod"] = $row->idalmacenproddetalle;
                $dataAlmacen[$i]["idalmacen"] = $almacen->idalmacen;
                $dataAlmacen[$i]["stock"] = $row->stock;
                $dataAlmacen[$i]["stockminimo"] = $row->stockminimo;
                $dataAlmacen[$i]["stockmaximo"] = $row->stockmaximo;
                $dataAlmacen[$i]["ubicacion"] = $ubicacion;
                $dataAlmacen[$i]["almacen"] = $almacen->descripcion;
                $dataAlmacen[$i]["eliminar"] = $eliminar;
                $i++;
            }
            $fotos = $producto->foto;
            //$producto->foto;
            $images = array();
            $idsImages = array();
            foreach ($fotos as $row) {
                array_push($images, $row->foto);
                array_push($idsImages, $row->idproductofoto);
            }
            $producto->codigos;

            //datos requeridos
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configCli = $conf->first();
            $configCli->decrypt();

            $conf = new ConfigFabrica();
            $conf->setConnection($connection);
            $configFab = $conf->first();
            $configFab->decrypt();
            
            $almu = new AlmacenUbicacion();
            $almu->setConnection($connection);
            $ubicaciones = $almu->orderBy('idalmacenubicacion', 'asc')->get();

            $car = new ProductoCaracteristica();
            $car->setConnection($connection);
            $caracteristicas = $car->orderBy('idproduccaracteristica', 'asc')->get();

            $fam = new Familia();
            $fam->setConnection($connection);
            $familias = $fam->orderBy('idfamilia', 'asc')->get();

            $mon = new Moneda();
            $mon->setConnection($connection);
            $monedas = $mon->orderBy('idmoneda', 'asc')->get();

            $um = new UnidadMedida();
            $um->setConnection($connection);
            $unidades = $um->orderBy('idunidadmedida', 'asc')->get();

            $alm = new Almacen();
            $alm->setConnection($connection);
            $almacenes = $alm->orderBy('idalmacen', 'asc')->get();

            $lp = new ListaPrecio();
            $lp->setConnection($connection);
            $listap = $lp->orderBy('idlistaprecio', 'asc')->get();

            $respuesta = array(
                'response' => 1,
                'producto' => $producto,
                'caracteristicas' => $detalleCaracteristicas,
                'almacenes' => $dataAlmacen,
                'images' => $images,
                'idsImages' => $idsImages,
                
                'configcli' => $configCli,
                'configfab' => $configFab,
                'ubicaciones' => $ubicaciones,
                'caracteristicas2' => $caracteristicas,
                'familias' => $familias,
                'monedas' => $monedas,
                'unidades' => $unidades,
                'almacenes2' => $almacenes,
                'listaprecios' => $listap
            );

            return response()->json($respuesta);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => $e
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => $th
            ]);
        }
        
    }

    /**
     * Update the specified resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function update($id, Request $request)
    {
        //return response()->json(["datos" => $request->all(), 'id' => $id]);
        if ($request->filled('tipo')) {
            
            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $produ = new Producto();
                $produ->setConnection($connection);

                $tipo = $request->get('tipo');
                //$idproducto = $request->input('idproducto');
                $producto = $produ->findOrFail($id);

                $producto->tipo = $tipo;
                $producto->fkidmoneda = $request->get('idMoneda');
                $producto->fkidfamilia = $request->get('idFamilia');
                $producto->fkidunidadmedida = $request->get('idUnidad');
                $producto->descripcion = $request->get('descripcion');
                $producto->stock = $request->input('stock', 0);
                $producto->stockmaximo = $request->input('stockmax', 0);
                $producto->stockminimo = $request->input('stockmin', 0);
                $producto->costo = $request->get('costo');
                $producto->costodos = $request->get('costodos');
                $producto->costotres = $request->get('costotres');
                $producto->costocuatro = $request->get('costocuatro');
                $producto->precio = $request->get('precio');
                $producto->notas = $request->get('notas');
                $producto->palabrasclaves = $request->get('palclaves');

                $producto->setConnection($connection);
                $producto->update();

                if ($request->filled('idsCaracteristicas')) {

                    $idsCaracteristicas = json_decode($request->get('idsCaracteristicas'));
                    $valuesCaracteristicas = json_decode($request->get('valuesCaracteristicas'));
                    $idsActualizar = json_decode($request->get('idsCaracteristicasAct'));

                    //$data = $producto->detalleprodcaract;
                    $prodd = new ProdCaractDetalle();
                    $prodd->setConnection($connection);
                    $longitudA = sizeof($idsActualizar);
                    for ($i = 0; $i < $longitudA; $i++) {
                        $det = $prodd->find($idsActualizar[$i]);
                        $det->descripcion = $valuesCaracteristicas[$i];
                        $det->fkidproducto = $producto->idproducto;
                        $det->fkidproduccaracteristica = $idsCaracteristicas[$i];
                        $det->setConnection($connection);
                        $det->update();

                    }

                    $idsCaracteristicasNew = json_decode($request->get('idsCaracteristicasNew'));
                    $valuesCaracteristicasNew = json_decode($request->get('valuesCaracteristicasNew'));

                    $longitudNew = sizeof($idsCaracteristicasNew);
                    for ($i = 0; $i < $longitudNew; $i++) {

                        $detallepc = new ProdCaractDetalle();
                        $detallepc->descripcion = $valuesCaracteristicasNew[$i];
                        $detallepc->fkidproducto = $producto->idproducto;
                        $detallepc->fkidproduccaracteristica = $idsCaracteristicasNew[$i];
                        $detallepc->setConnection($connection);
                        $detallepc->save();
                    }

                    $pcd = new ProdCaractDetalle();
                    $pcd->setConnection($connection);
                    $idsEliminar = json_decode($request->get('idsEliminarDet'));
                    $longitudE = sizeof($idsEliminar);
                    for ($i = 0; $i < $longitudE; $i++) {
                        $detalleProdCa = $pcd->find($idsEliminar[$i]);
                        $detalleProdCa->delete();
                    }
                }

                
                if ($tipo == 'P') {

                    $dataIdsAlmacen = json_decode($request->get('dataIdsAlmacen'));
                    $dataStocks = json_decode($request->get('dataStocks'));
                    $dataStocksMax = json_decode($request->get('dataStocksMax'));
                    $dataStocksMin = json_decode($request->get('dataStocksMin'));
                    $dataUbicaciones = json_decode($request->get('dataUbicaciones'));
                    $auxiliar = json_decode($request->get('auxiliar'));

                    $longitudA = sizeof($dataIdsAlmacen);
                    for ($i = 0; $i < $longitudA; $i++) {

                        if ($auxiliar[$i] == 0) {
                            $almprodDet = new AlmacenProdDetalle();
                            $almprodDet->stock = $dataStocks[$i];
                            $almprodDet->stockminimo = $dataStocksMin[$i];
                            $almprodDet->stockmaximo = $dataStocksMax[$i];
                            $ubicacion = $dataUbicaciones[$i] == 0 ? null : $dataUbicaciones[$i];
                            $almprodDet->fkidalmacenubicacion = $ubicacion;
                            $almprodDet->fkidalmacen = $dataIdsAlmacen[$i];
                            $almprodDet->fkidproducto = $producto->idproducto;
                            $almprodDet->setConnection($connection);
                            $almprodDet->save();
                        } else {
                            $ald = new AlmacenProdDetalle();
                            $ald->setConnection($connection);
                            $almprodDet =  $ald->find($auxiliar[$i]);
                            $almprodDet->stock = $dataStocks[$i];
                            $almprodDet->stockminimo = $dataStocksMin[$i];
                            $almprodDet->stockmaximo = $dataStocksMax[$i];
                            $ubicacion = $dataUbicaciones[$i] == 0 ? null : $dataUbicaciones[$i];
                            $almprodDet->fkidalmacenubicacion = $ubicacion;
                            $almprodDet->fkidalmacen = $dataIdsAlmacen[$i];
                            $almprodDet->fkidproducto = $producto->idproducto;
                            $almprodDet->setConnection($connection);
                            $almprodDet->update();
                        }
        
                    }
                } else {
                    $dataIdsAlmacen = json_decode($request->get('dataIdsAlmacen'));
                    $auxiliar = json_decode($request->get('auxiliar'));
                    $longitudA = sizeof($dataIdsAlmacen);
                    for ($i = 0; $i < $longitudA; $i++) {

                        if ($auxiliar[$i] == 0) {
                            $almprodDet = new AlmacenProdDetalle();
                            $almprodDet->stock = 0;
                            $almprodDet->stockminimo = 0;
                            $almprodDet->stockmaximo = 0;
                            $almprodDet->fkidalmacenubicacion = null;
                            $almprodDet->fkidalmacen = $dataIdsAlmacen[$i];
                            $almprodDet->fkidproducto = $producto->idproducto;
                            $almprodDet->setConnection($connection);
                            $almprodDet->save();
                        } else {
                            $almpd = new AlmacenProdDetalle();
                            $almpd->setConnection($connection);
                            $almprodDet =  $almpd->find($auxiliar[$i]);
                            $almprodDet->fkidalmacen = $dataIdsAlmacen[$i];
                            $almprodDet->setConnection($connection);
                            $almprodDet->update();
                        }
                    }
                }
                /* cambios de develop no tocar by alex
                    }
                    //echo "ERROR AL GUARDAR IMG";
                    if ($request->filled('fotosEliminados')) {
                        $dataIds = json_decode($request->get('fotosEliminados'));
                */


                if ($request->filled('idsAlmaprodEli')) {
                    
                    $idsEliminados = json_decode($request->get('idsAlmaprodEli'));
                    $longitud = sizeof($idsEliminados);
                    for ($i = 0; $i < $longitud; $i++) {
                        $alpd = new AlmacenProdDetalle();
                        $alpd->setConnection($connection);
                        $almprodDet =  $alpd->find($idsEliminados[$i]);
                        if ($almprodDet->compradetalle->count() > 0 || $almprodDet->ventadetalle->count() > 0 || 
                            $almprodDet->invetariocortedetalle->count() > 0 || $almprodDet->traspasoproddetalle->count() > 0 ||
                            $almprodDet->ingresoproddetalle->count() > 0 || $almprodDet->salidaproddetalle->count() > 0) {
                                //no se puede eliminar 
                                //rollback();
                                DB::rollback();
                                return response()->json([
                                    'response' => -1,
                                    'message' => 'no se pudo procesar la solicitud'
                                ]);
                        }
                        $almprodDet->setConnection($connection);
                        $almprodDet->delete();

                    }
                }

                if ($request->filled('fotosEliminados')) {
                    $dataIds = json_decode($request->get('fotosEliminados'));

                    $longitud = sizeof($dataIds);
                    $prodf = new ProductoFoto();
                    $prodf->setConnection($connection);
                    for ($i = 0; $i < $longitud; $i++) {
                        $foto = $prodf->find($dataIds[$i]);

                        $path = $foto->foto;
                        $path = str_replace("/storage", "/app/public", $path);
                        $path = storage_path() . $path;
                        unlink($path); //elimina la imagen, pero no verifica si la logra eliminar
                        $foto->setConnection($connection);
                        $foto->delete();
                    }
                }

                $codigos = json_decode($request->get('codigos'));
                $descripciones = json_decode($request->get('descripciones'));
                $idsCodigos = json_decode($request->get('idscodigos'));

                $prodco = new ProducCodigoAdicional();
                $prodco->setConnection($connection);
                for ($i = 0; $i < sizeof($codigos); $i++) {
                    $codigoAdcional =  $prodco->find($idsCodigos[$i]);
                    $codigoAdcional->codproduadi = $codigos[$i];
                    $codigoAdcional->descripcion = $descripciones[$i];
                    $codigoAdcional->setConnection($connection);
                    $codigoAdcional->update();
                }
                $newsCodigos = json_decode($request->get('newscodigos'));
                $newsDesc = json_decode($request->get('newsdesc'));
                for ($i = 0; $i < sizeof($newsCodigos); $i++) {
                    $codigoAdcional = new ProducCodigoAdicional();
                    $codigoAdcional->codproduadi = $newsCodigos[$i];
                    $codigoAdcional->descripcion = $newsDesc[$i];
                    $codigoAdcional->fkidproducto = $id;
                    $codigoAdcional->setConnection($connection);
                    $codigoAdcional->save();
                }

                $codEliminados = json_decode($request->get('codeliminados'));
                for ($i = 0; $i < sizeof($codEliminados); $i++) {
                    $codigoAdcional =  $prodco->find($codEliminados[$i]);
                    $codigoAdcional->delete();
                }
                if ($request->filled('nameImages')) {
                    $names = json_decode($request->get('nameImages'));
                    $images = json_decode($request->get('images'));

                    $longitud = sizeof($images);
                    for ($i = 0; $i < $longitud; $i++) {

                        try {
                            $newString = explode(".",$names[$i]);
                            $extension = $newString[sizeof($newString)-1];
                            $name = md5($newString[0]);

                            $image = Image::make($images[$i]);
                            $image->resize(700, null, function ($constraint) {
                                $constraint->aspectRatio();
                                $constraint->upsize();
                            });

                            $imgData = (string)$image->encode('jpg',30);
                            $pathStore = "public/producto/img/" . $name . "." . $extension;
                            Storage::put($pathStore, $imgData);
                            $pathAbosobulte = "/storage/producto/img/" . $name . "." . $extension;

                            $productoFoto = new ProductoFoto();
                            $productoFoto->foto = $pathAbosobulte;
                            $productoFoto->fkidproducto = $producto->idproducto;
                            $productoFoto->setConnection($connection);
                            $productoFoto->save();

                        } catch (\Throwable $th) {
                            DB::rollback();
                            return response()->json([
                                'response' => 0,
                                'message' => 'Error al guardar la imagen'
                            ]);
                        }

                        /*cambios de develop no tocar by alex
                            } catch (\Throwable $th) {
                            echo "ERROR AL GUARDAR IMG";
                            return response()->json([
                                "response" => 0,
                                "error" => $th
                            ]);
                        */

                    }
                }
                $conf = new ConfigFabrica();
                $conf->setConnection($connection);
                $configs = $conf->first();
                $configs->decrypt();

                $listpre = new ListaPreProducDetalle();
                $listpre->setConnection($connection);
                //if (!$configs->comalmacenlistadeprecios) {
                    $listaDetalle = $listpre->where('fkidproducto', $id)->first();
                    $listaDetalle->precio = $producto->precio;
                    $listaDetalle->setConnection($connection);
                    $listaDetalle->update();
                //}

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito el producto ' . $producto->idproducto;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    'response' => 1,
                    'message' => 'Se actualizo correctamente'
                ]);
            } catch (DecryptException $e) {
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

        } else {
            return response()->json([
                'response' => -1,
                'message' => 'Error al prodecer con la solicitud'
            ]);
        }
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

            $produ = new Producto();
            $produ->setConnection($connection);

            $conff = new ConfigFabrica();
            $conff->setConnection($connection);
            $configFabrica = $conff->first();
            $configFabrica->decrypt();

            $producto = $produ->find($id);
            if ($producto == null) {
                return response()->json([
                    'response' => 0,
                    'message' => 'El produto no existe'
                ]);
            }
            $dataAlmacenProd = $producto->detallealamcenprod;
            
            foreach ($dataAlmacenProd as $row) {
                if ($row->compradetalle->count() > 0 || $row->ventadetalle->count() > 0 || 
                    $row->invetariocortedetalle->count() > 0 || $row->traspasoproddetalle->count() > 0 ||
                    $row->ingresoproddetalle->count() > 0 || $row->salidaproddetalle->count() > 0) {
                    return response()->json([
                        "response" => 0,
                        "message" => "No se puede eliminar el producto por que este ya esta siendo usado"
                    ]);
                }
            }
            $dataListaPrecio = $producto->listaprod;
            if ($configFabrica->comalmacenlistadeprecios && $dataListaPrecio->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede elimiar el Producto por que se encuentra en Lista de Precio"
                ]);
            }

            foreach ($dataListaPrecio as $row) {
                $row->setConnection($connection);
                $row->delete();
            }

            foreach ($dataAlmacenProd as $row) {
                $row->setConnection($connection);
                $row->delete();
            }

            $datadetalle = $producto->detalleprodcaract;
            foreach ($datadetalle as $row) {
                $row->setConnection($connection);
                $row->delete();
            }

            $codigos = $producto->codigos;
            foreach ($codigos as $row) {
                $row->setConnection($connection);
                $row->delete();
            }

            $fotos = $producto->foto;
            foreach ($fotos as $row) {
                $path = $row->foto;
                $path = str_replace("/storage", "/app/public", $path);
                $path = storage_path() . $path;
                unlink($path); //elimina la imagen, pero no verifico si la logra eliminar - si la eliminar bien sino nimodo :v
                $row->setConnection($connection);
                $row->delete();
            }

            $producto->setConnection($connection);
            $producto->delete();
            //$productos = Producto::orderBy('idproducto','DESC')->paginate(10);
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el producto ' . $producto->idproducto;
            $log->guardar($request, $accion);
            
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('busqueda')) {
                $datos = $produ->leftJoin('familia as f', 'f.idfamilia', 'producto.fkidfamilia')
                            ->leftJoin('unidadmedida as um', 'um.idunidadmedida', 'producto.fkidunidadmedida')
                            ->leftJoin('moneda as m', 'm.idmoneda', 'producto.fkidmoneda')
                            ->select('producto.idproducto', 'producto.codproducto', 'producto.descripcion',
                                    'producto.precio', 'producto.tipo', 'f.descripcion as familia', 
                                    'um.descripcion as unidadmedida', 'm.descripcion as moneda')
                            ->orWhere('producto.idproducto', 'LIKE', "%$request->busqueda%")
                            ->orWhere('producto.codproducto', 'ILIKE', "%$request->busqueda%")
                            ->orWhere('producto.descripcion', 'ILIKE', "%$request->busqueda%")
                            ->orWhere('producto.precio', 'ILIKE', "%$request->busqueda%")
                            ->orWhere('f.descripcion', 'ILIKE', "%$request->busqueda%")
                            ->orWhere('um.descripcion', 'ILIKE', "%$request->busqueda%")
                            ->orderBy('producto.idproducto', 'ASC')
                            ->paginate($paginate);
            } else {
                $datos = $produ->leftJoin('familia as f', 'f.idfamilia', 'producto.fkidfamilia')
                ->leftJoin('unidadmedida as um', 'um.idunidadmedida', 'producto.fkidunidadmedida')
                ->leftJoin('moneda as m', 'm.idmoneda', 'producto.fkidmoneda')
                ->select('producto.idproducto', 'producto.codproducto', 'producto.descripcion',
                        'producto.precio', 'producto.tipo', 'f.descripcion as familia', 
                        'um.descripcion as unidadmedida', 'm.descripcion as moneda')
                ->orderBy('producto.idproducto', 'ASC')
                ->paginate($paginate);
            }
            
            $productos = $datos->getCollection();
            
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem(),
                'url_next' => $datos->nextPageUrl()
            );

            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $productos
            ]);

            DB::commit();
            return response()->json([
                "response" => 1,
                "message" => "El Producto ha sido eliminado correctamente"
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

    public function SearchIdAlmacen(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);
            //echo 'inicio';
            $result = $produ->SearchIdAlmacen($request->value, $request->idalmacen)->get();
            return response()->json([
                'response' => 1,
                'data' => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procresar la solicitud'
            ]);
        }
        
    }

    public function SearchDescAlmacen(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $result = $produ->SearchDescAlmacen($request->value, $request->idalmacen)->get();
            return response()->json([
                'response' => 1,
                'data' => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procresar la solicitud'
            ]);
        }
        
    }

    public function searchProducto(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $almacenes = json_decode($request->almacenes);
            $result = $produ->searchProducto($request->value, $almacenes);
            return response()->json([
                'response' => 1,
                'data' => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'messsage' => 'No se pudo procesar la solicitud'
            ]);
        }
        
    }
    /***------ */
    public function getProductosByAlmacenes(Request $request) {
    
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $almacenes = json_decode($request->almacenes);
            $productos = $produ->where('tipo', 'P')->orderBy('idproducto', 'DESC')->get();
            $data = array();
            foreach ($productos as $row) {
                $elem = $produ->getAlmacenesStocks($row->idproducto, $almacenes);
                array_push($data, $elem);
            }

            return response()->json([
                'response' => 1,
                'productos' => $productos,
                'almacenes' => $data
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar con la base de datos'
            ]);
        }
    }

    public function getProductosByFamilia(Request $request) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            if ($request->filled('idfamilia')) {
                $idfamilia = $request->idfamilia;
                $almacenes = json_decode($request->almacenes);

                $productos = $produ->where([
                                            'producto.fkidfamilia' => $idfamilia,
                                            'producto.tipo' => 'P'
                                        ])->get();
                $data = array();
                foreach ($productos as $row) {
                    $elem = $produ->getAlmacenesStocks($row->idproducto, $almacenes);
                    array_push($data, $elem);
                }

                return response()->json([
                    'response' => 1,
                    'productos' => $productos,
                    'almacenes' => $data
                ]);
            }
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar con la base de datos'
            ]);
        }
        
    }

    public function getAlmacenesProds(Request $request) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $almacenes = json_decode($request->almacenes);
            $almacenesprods = $produ->getAlmacenesStocks($request->idproducto, $almacenes);
            return response()->json([
                'response' => 1,
                'almacenes' => $almacenesprods
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

    public function searchOnlyProduct(Request $request, $value) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $result = $produ->SearchOnlyProduct($value)->get();
            return response()->json([
                "response" => 1,
                "data" => $result
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema'
            ]);
        }
        
    }
    /****--------- */

    public function reporte(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $familia = DB::connection($connection)
                        ->table('familia')
                        ->whereNull('deleted_at')
                        ->get();

            $medida = DB::connection($connection)
                        ->table('unidadmedida')
                        ->whereNull('deleted_at')
                        ->orderBy('idunidadmedida', 'desc')
                        ->get();

            $moneda = DB::connection($connection)
                        ->table('moneda')
                        ->whereNull('deleted_at')
                        ->orderBy('idmoneda', 'desc')
                        ->get();

            $data = DB::connection($connection)
                        ->table('produccaracteristica')
                        ->whereNull('deleted_at')
                        ->orderBy('idproduccaracteristica', 'desc')
                        ->get();

            $config = DB::connection($connection)
                ->table('configcliente')
                ->orderBy('idconfigcliente', 'asc')
                ->first();

            return response()->json([
                "response" => 1,
                'familia' => $familia,
                'unidad' => $medida,
                'moneda' => $moneda,
                'data' => $data,
                'config' => $config,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema'
            ]);
        }
    }

    public function searchByIdCod(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $searchByIdCod = $request->input('searchByIdCod');

            $producto = DB::connection($connection)
                ->table('producto as prod')
                ->select('prod.idproducto', 'prod.codproducto', 'prod.descripcion')
                ->where('prod.tipo', '=', 'P')
                ->where(function ($query) use ($searchByIdCod) {
                    if ( is_null( $searchByIdCod ) || $searchByIdCod == "" ) return;
                    return $query->orWhere('prod.idproducto', 'ILIKE', "%$searchByIdCod%")
                        ->orWhere('prod.codproducto', 'ILIKE', "%$searchByIdCod%");
                })
                ->whereNull('prod.deleted_at')
                ->orderBy('prod.idproducto', 'desc')
                ->get()->take(20);
            
            return response()->json([
                "response" => 1,
                "producto" => $producto,
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

    public function searchByDescripcion(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $searchByDescripcion = $request->input('searchByDescripcion');

            $producto = DB::connection($connection)
                ->table('producto as prod')
                ->select('prod.idproducto', 'prod.codproducto', 'prod.descripcion')
                ->where('prod.tipo', '=', 'P')
                ->where(function ($query) use ($searchByDescripcion) {
                    if ( is_null( $searchByDescripcion ) || $searchByDescripcion == "" ) return;
                    return $query->orWhere('prod.descripcion', 'ILIKE', "%$searchByDescripcion%");
                })
                ->whereNull('prod.deleted_at')
                ->orderBy('prod.idproducto', 'desc')
                ->get()->take(20);
            
            return response()->json([
                "response" => 1,
                "producto" => $producto,
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

    public function reportekardexproducto(Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Sucursal();
            $obj->setConnection($connection);
            $sucursal = $obj->orderBy('idsucursal', 'asc')->get();

            $almacen = [];

            if ( sizeof( $sucursal ) > 0 ) {
                $obj = new Almacen();
                $obj->setConnection($connection);
                $almacen = $obj->where('fkidsucursal', '=', $sucursal[0]->idsucursal)
                    ->orderBy('idalmacen', 'asc')->get();
            }

            $producto = DB::connection($connection)
                ->table('producto as prod')
                ->select('prod.idproducto', 'prod.codproducto', 'prod.descripcion')
                ->where('prod.tipo', '=', 'P')
                ->whereNull('prod.deleted_at')
                ->orderBy('prod.idproducto', 'desc')
                ->get()->take(20);

            $idsucursal = sizeof( $sucursal ) > 0 ? $sucursal[0]->idsucursal : "";
            
            return response()->json([
                "response" => 1,
                "sucursal" => $sucursal,
                "almacen" => $almacen,
                "producto" => $producto,
                "idsucursal" => $idsucursal,
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
    
    public function validarCodigo(Request $request, $value) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $produ = new Producto();
            $produ->setConnection($connection);

            $count = $produ->where('codproducto', $value)->count();
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
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesa la solicitud'
            ]);
        }
    }
}
