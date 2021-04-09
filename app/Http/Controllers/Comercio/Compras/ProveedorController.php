<?php

namespace App\Http\Controllers\Comercio\Compras;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use App\Models\Comercio\Compras\ProveedorContactarlo;
use App\Models\Comercio\Compras\Proveedor;
use App\Models\Comercio\Compras\Compra;
use App\Models\Comercio\Ventas\Ciudad;
use App\Models\Comercio\Ventas\ReferenciaDeContacto;
use App\Models\Config\ConfigCliente;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Image;
use Storage;

class ProveedorController extends Controller
{
    public function index(Request $request)
    {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $proveedores = new Proveedor();
            $proveedores->setConnection($connection);
            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            if ($request->filled('buscar')) {
                $datos = $proveedores->select('proveedor.idproveedor', 'proveedor.codproveedor', 'proveedor.nombre', 'proveedor.apellido',
                             'proveedor.nit', 'proveedor.notas', 'proveedor.contactos', 'proveedor.estado')
                    ->orWhere('proveedor.idproveedor', 'LIKE', "%$request->buscar%")
                    ->orWhere('proveedor.codproveedor', 'ILIKE', "%$request->buscar%")
                    ->orWhere('proveedor.nombre', 'ILIKE', "%$request->buscar%")
                    ->orWhere('proveedor.apellido', 'ILIKE', "%$request->buscar%")
                    ->orWhere('proveedor.nit', 'ILIKE', "%$request->buscar%")
                    ->orWhere('proveedor.notas', 'ILIKE', "%$request->buscar%")
                    ->orWhere('proveedor.contactos', 'ILIKE', "%$request->buscar%")
                    ->orWhere('proveedor.estado', 'ILIKE', "%$request->buscar%")
                    ->orderBy('proveedor.idproveedor', 'asc')
                    ->paginate($paginate);
            } else {
                $datos = $proveedores->select('proveedor.idproveedor', 'proveedor.codproveedor', 'proveedor.nombre', 'proveedor.apellido',
                                              'proveedor.nit', 'proveedor.notas', 'proveedor.contactos', 'proveedor.estado')
                    ->orderBy('proveedor.idproveedor', 'asc')
                    ->paginate($paginate);
            }
            $datosProveedores = $datos->getCollection();
            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );
            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $datosProveedores
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

    public function create(Request $request)
    {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $prov = new Proveedor();
            $prov->setConnection($connection);

            $ciu = new Ciudad();
            $ciu->setConnection($connection);

            $ciudad = $ciu->all();

            $refc = new ReferenciaDeContacto();
            $refc->setConnection($connection);
            $referenciaContacto = $refc->orderBy('idreferenciadecontacto', 'desc')
                                        ->get();


            $nro = sizeof($prov->all()) + 1;

            return response()->json([
                "response" => 1,
                "data" => $ciudad,
                'referenciaContacto' => $referenciaContacto,
                'nro' => $nro,
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
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }

    }

    public function refresh() {
        return view('commerce::admin.plantilla');
    }

    /**
     * Store a newly created resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $codigo = $request->input('codigoProveedor');
        $nit = $request->input('nitProveedor');
        $nombre = $request->input('nombreProveedor');
        $apellido = $request->input('apellidoProveedor');
        $ciudad = $request->input('ciudadProveedor');

        $nota = $request->input('notaProveedor');
        $descripcion = $request->input('descripcionProveedor');

        $imagen = $request->input('imagenProveedor');

        $arrayReferencia = json_decode($request->input('arrayReferencia'));
        $arrayContactarlo = json_decode($request->input('arrayContactarlo'));

        if ($nit == '') {
            $nit = null;
        }
        if ($imagen == '') {
            $imagen = null;
        }
        if ($nota == '') {
            $nota = null;
        }
        if ($descripcion == '') {
            $descripcion = null;
        }

        if ($ciudad == 0) {
            $ciudad = null;
        }

        try {
            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);

            $proveedor = new Proveedor();
            $proveedor->setConnection($connection);
            $proveedor->codproveedor = $codigo;
            $proveedor->nombre = $nombre;
            $proveedor->apellido = $apellido;
            $proveedor->nit = $nit;

            $proveedor->notas = $nota;
            $proveedor->contactos = $descripcion;
            $proveedor->estado = 'A';

            $proveedor->fkidciudad = $ciudad;

            if ($imagen != null) {
                $image = Image::make($imagen);

                $image->resize(700, null, function($constraint){
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                $imageData = (string)$image->encode('jpg',30);
                $name = time();
                $nameHash = md5($name);
                $path = "public/proveedor/img/".$nameHash.'.'.explode('/', explode(':', substr($imagen, 0, strpos($imagen, ';')))[1])[1];
                Storage::put($path, $imageData);
                $pathabsoluto = "/storage/proveedor/img/".$nameHash.'.'.explode('/', explode(':', substr($imagen, 0, strpos($imagen, ';')))[1])[1];;
                $imagen = $pathabsoluto;

            }

            $proveedor->foto = $imagen;

            if ($proveedor->save()) {
                $contador = 0;

                while ($contador < sizeof($arrayContactarlo)) {
                    if ($arrayContactarlo[$contador] != '' and $arrayReferencia[$contador] != '') {

                        $proveedorContacto = new ProveedorContactarlo();
                        $proveedorContacto->valor = $arrayContactarlo[$contador];
                        $proveedorContacto->fkidproveedor = $proveedor->idproveedor;
                        $proveedorContacto->fkidreferenciadecontacto = $arrayReferencia[$contador];
                        $proveedorContacto->setConnection($connection);
                        $proveedorContacto->save();
                    }
                    $contador = $contador + 1;
                }
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el proveedor ' . $proveedor->idproveedor;
            $log->guardar($request, $accion);

            DB::commit();

            return response()->json(array("response" => 1,"data" => 'exito', 'proveedor' => $proveedor));

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
        } catch (\Exception $e){
            DB::rollBack();
            return response()->json([
                'response' => 0,
                'data' => 'hubo un problema',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        }
    }

    /**
     * Show the specified resource.
     * @return Response
     */
    public function show(Request $request)
    {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $id = $request->input('idProveedor', null);

            $proveedor = DB::connection($connection)
                ->table('proveedor as p')
                ->leftJoin('ciudad as c', 'p.fkidciudad', '=', 'c.idciudad')
                ->select('c.descripcion as ciudad', 'p.codproveedor', 'p.idproveedor',
                    'p.nombre', 'p.apellido', 'p.nit', 'p.fkidciudad',
                    'p.foto', 'p.notas', 'p.contactos', 'p.estado', 'p.created_at')
                ->where('p.idproveedor', '=', $id)
                ->first();

            $proveedorContacto = DB::connection($connection)
                ->table('proveedorcontactarlo as pc')
                ->join('referenciadecontacto as rc', 'pc.fkidreferenciadecontacto', '=', 'rc.idreferenciadecontacto')
                ->select('pc.valor', 'rc.descripcion')
                ->where('pc.fkidproveedor', '=', $id)
                ->orderBy('pc.idproveedorcontactarlo', 'asc')
                ->get();

            return response()->json(array(
                "response" => 0,
                "proveedor" => $proveedor,
                "contacto" => $proveedorContacto,
            ));
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
        } catch (\Exception $e){
            return response()->json([
                'response' => 0,
                'data' => 'hubo un problema',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        }


    }

    /**
     * Show the form for editing the specified resource.
     * @return Response
     */
    public function edit(Request $request, $id)
    {
        if (!$request->ajax()) {
            return view('commerce::admin.plantilla');
        }

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);

            $proveedor = $prov->where('idproveedor', '=', $id)->first();

            $ciu = new Ciudad();
            $ciu->setConnection($connection);
            $ciudad = $ciu->all();

            $refc = new ReferenciaDeContacto();
            $refc->setConnection($connection);

            $provc = new ProveedorContactarlo();
            $provc->setConnection($connection);
            $referenciaContacto = $refc->orderBy('idreferenciadecontacto', 'desc')->get();
            $proveedorContacto = $provc->where('fkidproveedor', '=', $id)
                                        ->orderBy('idproveedorcontactarlo', 'asc')->get();

            return response()->json([
                "response" => 1,
                'data' => $proveedor,
                'ciudad' => $ciudad,
                'referenciaContacto' => $referenciaContacto,
                'proveedorContacto' => $proveedorContacto
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
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function update(Request $request)
    {
        DB::beginTransaction();
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);

            $idProveedor = $request->input('idProveedor');

            $bandera = $request->input('bandera');

            $codigo = $request->input('codigoProveedor');
            $nit = $request->input('nitProveedor');
            $nombre = $request->input('nombreProveedor');
            $apellido = $request->input('apellidoProveedor');
            $ciudad = $request->input('ciudadProveedor');
            $estado = $request->input('estadoProveedor');

            $nota = $request->input('notaProveedor');
            $descripcion = $request->input('descripcionProveedor');

            $imagen = $request->input('imagenProveedor');

            $arrayReferencia = json_decode($request->input('arrayReferencia'));
            $arrayContactarlo = json_decode($request->input('arrayContactarlo'));

            $array = json_decode($request->input('array'));

            $arrayDelete = json_decode($request->input('arrayEliminadoContacto'));

            if ($nit == '') {
                $nit = null;
            }
            if ($imagen == '') {
                $imagen = null;
            }
            if ($nota == '') {
                $nota = null;
            }
            if ($descripcion == '') {
                $descripcion = null;
            }

            if ($ciudad == 0) {
                $ciudad = null;
            }

            $proveedor = $prov->find($idProveedor);
            $proveedor->setConnection($connection);

            $proveedor->codproveedor = $codigo;
            $proveedor->nombre = $nombre;
            $proveedor->apellido = $apellido;
            $proveedor->nit = $nit;

            $proveedor->notas = $nota;
            $proveedor->contactos = $descripcion;

            $proveedor->fkidciudad = $ciudad;
            $proveedor->estado = $estado;

            if ($bandera == 1){

                if ($imagen != null) {
                    $image = Image::make($imagen);

                    $image->resize(700, null, function($constraint){
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });

                    $imageData = (string)$image->encode('jpg',30);
                    $name = time();
                    $nameHash = md5($name);
                    $path = "public/proveedor/img/".$nameHash.'.'.explode('/', explode(':', substr($imagen, 0, strpos($imagen, ';')))[1])[1];
                    Storage::put($path, $imageData);
                    $pathabsoluto = "/storage/proveedor/img/".$nameHash.'.'.explode('/', explode(':', substr($imagen, 0, strpos($imagen, ';')))[1])[1];;
                    $imagen = $pathabsoluto;

                }
            }

            $proveedor->foto = $imagen;

            if ($proveedor->update()) {

                $contador = 0;

                $provc = new ProveedorContactarlo();
                $provc->setConnection($connection);
                while ($contador < sizeof($array)) {

                    if ($array[$contador] == '') {

                        if ($arrayContactarlo[$contador] != '' and $arrayReferencia[$contador] != '') {

                            $proveedorContacto = new ProveedorContactarlo();
                            $proveedorContacto->valor = $arrayContactarlo[$contador];
                            $proveedorContacto->fkidproveedor = $proveedor->idproveedor;
                            $proveedorContacto->fkidreferenciadecontacto = $arrayReferencia[$contador];
                            $proveedorContacto->setConnection($connection);
                            $proveedorContacto->save();
                        }

                    }else {

                        if ($arrayContactarlo[$contador] != '' and $arrayReferencia[$contador] != '') {

                            $proveedorContacto = $provc->find($array[$contador]);
                            $proveedorContacto->valor = $arrayContactarlo[$contador];
                            $proveedorContacto->fkidproveedor = $proveedor->idproveedor;
                            $proveedorContacto->fkidreferenciadecontacto = $arrayReferencia[$contador];
                            $proveedorContacto->update();
                        }
                    }

                    $contador = $contador + 1;
                }

                $contador = 0;

                $provc = new ProveedorContactarlo();
                $provc->setConnection($connection);
                while ($contador < sizeof($arrayDelete)) {
                    $provc->find($arrayDelete[$contador])->delete();
                    $contador = $contador + 1;
                }

            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el proveedor ' . $proveedor->idproveedor;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json(array("response" => 1,"data" => 'exito'));
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
     * Remove the specified resource from storage.
     * @return Response
     */
    public function destroy(Request $request)
    {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);

            $idProveedor = $request->input('id');
            $result = DB::connection($connection)
                            ->table('proveedor as p')
                            ->join('compra as c', 'c.fkidproveedor', '=', 'p.idproveedor')
                            ->where([
                                'p.idproveedor' => $idProveedor,
                                'p.deleted_at' => null,
                                'c.deleted_at' => null
                            ])
                            ->get();
            if ($result->count() > 0) {
                return response()->json([
                    'response' => 0,
                    'message' => 'No se puede eliminar al proveedor, este se encuentra en una compra'
                ]);
            }
            $prov->find($idProveedor)->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el proveedor ' . $idProveedor;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
                'data' => 'exito'
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
                'message' => 'Error al eliminar proveedor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }

    }

    /** By Alex */
    public function searchCodId(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);

            $result = $prov->SearchCodId($value)->get();
            return response()->json([
                'response' => 1,
                'data' => $result
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
                'message' => 'Ocurrio un problema',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'line' => $th->getLine()
                ]
            ]);
        }

    }

    public function searchNombre(Request $request, $value) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);

            $result = $prov->SearchNombre($value)->get();
            return response()->json([
                'response' => 1,
                'data' => $result
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
                'message' => 'Ocurrio un problema',
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

            $prov = new Proveedor();
            $prov->setConnection($connection);

            $count = $prov->where('codproveedor', $value)->count();
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

    public function getComprasProveedor(Request $request, $idproveedor) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);
            $datos = $prov->leftJoin('compra as c', 'c.fkidproveedor', 'proveedor.idproveedor')
                            ->leftJoin('compradetalle as cd', 'cd.fkidcompra', 'c.idcompra')
                            ->leftJoin('almacenproddetalle as apd', 'apd.idalmacenproddetalle', 'cd.fkidalmacenproddetalle')
                            ->leftJoin('producto as p', 'p.idproducto', 'apd.fkidproducto')
                            ->where(DB::raw('c.mtototcompra - c.mtototpagado'), '>', 0)
                            ->where('proveedor.idproveedor', $idproveedor)
                            ->select('proveedor.idproveedor', 'proveedor.codproveedor',
                                    'proveedor.nombre as nomp', 'proveedor.apellido as apep',
                                    'c.idcompra', 'c.codcompra', 'c.mtototcompra', 'c.mtototpagado',
                                    'p.idproducto', 'p.codproducto', 'p.descripcion as descp', 'c.fecha')
                            ->get();
            $compras = [];
            $productos = [];
            $proveedores = [];
            $i = 0;
            $size = sizeof($datos);
            while ($i < $size) {
                $idc = $datos[$i]->idcompra;
                $cadproductos = '';
                $coma = '';
                while ($i < $size && $idc == $datos[$i]->idcompra) {
                    $cadproductos = $cadproductos . $coma . $datos[$i]->descp;
                    $coma = ', ';
                    $i++;
                }
                array_push($compras, [
                    'idcompra' => $datos[$i-1]->idcompra,
                    'codcompra' => $datos[$i-1]->codcompra,
                    'fecha' => $datos[$i-1]->fecha,
                    'montototal' => $datos[$i-1]->mtototcompra,
                    'montocobrado' => $datos[$i-1]->mtototpagado,
                    'saldopagar' => round($datos[$i-1]->mtototcompra - $datos[$i-1]->mtototpagado, 2)
                ]);

                array_push($productos, [
                    'cadena' => $cadproductos
                ]);

                array_push($proveedores, [
                    'idproveedor' => $datos[$i-1]->idproveedor,
                    'codproveedor' => $datos[$i-1]->codproveedor,
                    'nombre' => $datos[$i-1]->nomp,
                    'apellido' => $datos[$i-1]->apep
                ]);
            }

            return response()->json([
                'response' => 1,
                'compras' => $compras,
                'productos' => $productos,
                'proveedores' => $proveedores
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

    public function searchProvCompras(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $prov = new Proveedor();
            $prov->setConnection($connection);
            $proveedores = $prov->leftJoin('compra as c', 'c.fkidproveedor', '=', 'proveedor.idproveedor')
                                ->where(DB::raw("CONCAT(proveedor.nombre, ' ' , proveedor.apellido)"), 'ILIKE', "%$value%")
                                ->where(DB::raw('c.mtototcompra - c.mtototpagado'), '>', 0)
                                ->select('proveedor.*')
                                ->distinct('proveedor.idproveedor')
                                ->get();
            return response()->json([
                'response' => 1,
                'data' => $proveedores
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

    public function reporte(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configscliente = $obj->first();
            $configscliente->decrypt();

            $obj = new Ciudad();
            $obj->setConnection($connection);
            $ciudad = $obj->where('estado', '=', 'A')->orderBy('idciudad', 'asc')->get();

            $obj = new Ciudad();
            $obj->setConnection($connection);
            $ciudadpadre = $obj->where('estado', '=', 'A')->whereNull('idpadreciudad')
                ->orderBy('idciudad', 'asc')->get();

            $obj = new ReferenciaDeContacto();
            $obj->setConnection($connection);
            $referenciacontacto = $obj->select('idreferenciadecontacto as id', 'descripcion as title')
                ->orderBy('idreferenciadecontacto', 'asc')->get();

            return response()->json([
                'response' => 1,
                'configscliente' => $configscliente,
                'ciudad' => $ciudad,
                'ciudadpadre' => $ciudadpadre,
                'referenciacontacto' => $referenciacontacto,
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
}
