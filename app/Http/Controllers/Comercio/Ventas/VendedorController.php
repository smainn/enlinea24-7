<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\Comercio\Ventas\Vendedor;
use App\Models\Comercio\Ventas\VendedorContactarlo;
use App\Models\Config\ConfigCliente;
use App\Models\Seguridad\Log;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

use Image;
use Illuminate\Support\Facades\DB;

class VendedorController extends Controller
{
    public function index(Request $request)
    {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $vendedores = new Vendedor();

            $vendedores->setConnection($connection);

            $paginate = $request->filled('paginate') ? $request->get('paginate') : 10;
            $buscar = $request->filled('buscar') ? $request->get('buscar') : '';

            if ($buscar != '') {
                $datos = $vendedores->leftJoin('comisionventa as cv', 'cv.idcomisionventa', 'vendedor.fkidcomisionventa')
                    ->leftJoin('usuario as us', 'us.idusuario', 'vendedor.fkidusuario')
                    ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre',
                            DB::raw("CASE WHEN vendedor.apellido is null THEN '' ELSE vendedor.apellido END"),
                             'vendedor.foto', 'vendedor.nit', 'vendedor.sexo', 'vendedor.fechanac',
                             'vendedor.estado', 'vendedor.notas', 'cv.descripcion as comision',
                             'us.nombre as usuario')
                    ->orWhere('vendedor.idvendedor', 'LIKE', "%$request->buscar%")
                    ->orWhere('vendedor.codvendedor', 'ILIKE', "%$request->buscar%")
                    ->orWhere('vendedor.nombre', 'ILIKE', "%$request->buscar%")
                    ->orWhere('vendedor.apellido', 'ILIKE', "%$request->buscar%")
                    ->orWhere('vendedor.nit', 'ILIKE', "%$request->buscar%")
                    ->orWhere('cv.descripcion', 'ILIKE', "%$request->buscar%")
                    ->orderBy('vendedor.idvendedor', 'desc')
                    ->paginate($paginate);

            } else {
                
                $datos = $vendedores->leftJoin('comisionventa as cv', 'cv.idcomisionventa', 'vendedor.fkidcomisionventa')
                    ->leftJoin('usuario as us', 'us.idusuario', 'vendedor.fkidusuario')
                    ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 
                              DB::raw("(CASE WHEN vendedor.apellido is null THEN '' ELSE vendedor.apellido END) AS apellido"),
                             'vendedor.foto', 'vendedor.nit', 'vendedor.sexo', 'vendedor.fechanac',
                             'vendedor.estado', 'vendedor.notas', 'cv.descripcion as comision',
                             'us.nombre as usuario')
                    ->orderBy('vendedor.idvendedor', 'desc')
                    ->paginate($paginate);
            }

            $datosVendedores = $datos->getCollection();

            $pagination = array(
                'total' => $datos->total(),
                'current_page' => $datos->currentPage(),
                'per_page' => $datos->perPage(),
                'last_page' => $datos->lastPage(),
                'first' => $datos->firstItem(),
                'last' =>   $datos->lastItem()
            );

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->decrypt();

            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $datosVendedores,
                'config' => $configs
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo obtener los productos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    public function getVendedores(Request $request, $paginate) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vend = new Vendedor();
            $vend->setConnection($connection);

            $data = $vend->orderBy('idvendedor','DESC')->paginate($paginate);
            $vendedores = $data->getCollection();
            $dataVendedores = array();
            foreach ($vendedores as $row) {
                $row->comisionventa;
                array_push($dataVendedores, $row);
            }

            $pagination = array(
                'total' => $data->total(),
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'last_page' => $data->lastPage(),
                'first' => $data->firstItem(),
                'last' =>   $data->lastItem()
            );

            return response()->json([
                'response' => 1,
                'pagination' => $pagination,
                'data' => $dataVendedores
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo conectar a la base de datos',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
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

            $comision = DB::connection($connection)
                ->table('comisionventa')
                ->whereNull('deleted_at')
                ->orderBy('idcomisionventa', 'asc')
                ->get();

            $referencia_contacto = DB::connection($connection)
                ->table('referenciadecontacto')
                ->select('idreferenciadecontacto as id', 'descripcion as title')
                ->whereNull('deleted_at')
                ->orderBy('idreferenciadecontacto', 'asc')
                ->get();

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $config = $obj->first();
            $config->decrypt();
            /*
            $config = DB::connection($connection)
                ->table('configcliente')
                ->whereNull('deleted_at')
                ->orderBy('idconfigcliente', 'asc')
                ->first();
                */

            $usuarios = DB::connection($connection)
                ->select("select u.idusuario, u.nombre, u.apellido, u.sexo, u.fechanac, u.email, u.foto
                    from usuario u, grupousuario g
                    where g.idgrupousuario = u.fkidgrupousuario and g.esv = 'S' and
                        g.deleted_at is null and u.deleted_at is null and
                        u.idusuario not in (
                            select fkidusuario as idusuario
                            from vendedor
                            where fkidusuario is not null and deleted_at is null
                        )"
                );

            return response()->json([
                'response' => 1,
                'referencia_contacto' => $referencia_contacto,
                'config' => $config,
                'comision' => $comision,
                'usuarios' => $usuarios,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
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
        if ($request->filled('nombre') && $request->filled('sexo') && $request->filled('idcomision')) {
            
            try {
                DB::beginTransaction();
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $pathAbosobulte = 'N';

                if ($request->filled('foto')) {
                    if ($request->isusuario) {
                        if ($request->filled('namefoto')) {
                            try {
                                $array = explode(".",$request->get('namefoto'));
                                $extension = $array[sizeof($array)-1];
                                $name = md5($array[0]);
                                $image = Image::make($request->get('foto'));
                                $image->resize(700, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                    $constraint->upsize();
                                });
                                $imgData = (string)$image->encode('jpg',30);
                                $pathStore = "public/vendedor/img/" . $name . "." . $extension;
                                Storage::put($pathStore, $imgData);
                                $pathAbosobulte = "/storage/vendedor/img/" . $name . "." . $extension;
                            } catch (\Throwable $th) {
                                DB::rollback();
                                return response()->json([
                                    "response" => -1,
                                    "message" => "Ocurrio un problema al guardar la imagen",
                                    'error' => [
                                        'message' => $th->getMessage(),
                                        'file' => $th->getFile(),
                                        'linea' => $th->getLine()
                                    ]
                                ]);
                            }
                        } else {
                            $pathAbosobulte = $request->foto;
                        }
                    } else {
                        try {
                            $array = explode(".",$request->get('namefoto'));
                            $extension = $array[sizeof($array)-1];
                            $name = md5($array[0]);
                            $image = Image::make($request->get('foto'));
                            $image->resize(700, null, function ($constraint) {
                                $constraint->aspectRatio();
                                $constraint->upsize();
                            });
                            $imgData = (string)$image->encode('jpg',30);
                            $pathStore = "public/vendedor/img/" . $name . "." . $extension;

                            Storage::put($pathStore, $imgData);

                            $pathAbosobulte = "/storage/vendedor/img/" . $name . "." . $extension;
                        } catch (\Throwable $th) {
                            DB::rollback();
                            return response()->json([
                                "response" => -1,
                                "message" => "Ocurrio un problema al guardar la imagen",
                                'error' => [
                                    'message' => $th->getMessage(),
                                    'file' => $th->getFile(),
                                    'linea' => $th->getLine()
                                ]
                            ]);
                        }
                    }

                }

                $vendedor = new Vendedor();
                $vendedor->setConnection($connection);
                $vendedor->codvendedor = $request->get('codvendedor');
                $vendedor->nit = $request->get('nit');
                $vendedor->nombre = $request->get('nombre');
                $vendedor->apellido = $request->get('apellido');
                $vendedor->sexo = $request->get('sexo');
                $vendedor->estado = "A";
                $vendedor->notas = $request->get('notas');
                $vendedor->fechanac = $request->get('fechanac');
                $vendedor->fkidcomisionventa = $request->get('idcomision');
                $vendedor->fkidusuario = $request->get('isusuario') ? $request->get('idusuario') : null;
                if ($pathAbosobulte !== 'N') {
                    $vendedor->foto = $pathAbosobulte;
                }
                $vendedor->save();

                $dataRefencias = json_decode($request->input('dataReferencias'));
                $dataValues = json_decode($request->input('dataValues'));

                $longitud = sizeof($dataRefencias);
                for ($i = 0; $i < $longitud; $i++) {
                    $vendedorContactarlo = new VendedorContactarlo();
                    $vendedorContactarlo->setConnection($connection);
                    $vendedorContactarlo->valor = $dataValues[$i];
                    $vendedorContactarlo->fkidreferenciadecontacto = $dataRefencias[$i];
                    $vendedorContactarlo->fkidvendedor = $vendedor->idvendedor;
                    $vendedorContactarlo->save();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Inserto el vendedor ' . $vendedor->idvendedor;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    "response" => 1,
                    "message" => "Se registro correctamente el vendedor",
                    "vendedor" => $vendedor,
                ]);
            } catch (DecryptException $e) {
                DB::rollback();
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelva a iniciar sesion',
                    'error' => [
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'linea' => $e->getLine()
                    ]
                ]);
            } catch (\Throwable $th) {
                DB::rollback();
                return response()->json([
                    'response' => -1,
                    'message' => 'No se pudo registrar el vendedor',
                    'error' => [
                        'message' => $th->getMessage(),
                        'file' => $th->getFile(),
                        'linea' => $th->getLine()
                    ]
                ]);
            }

        } else {
            return response()->json([
                "response" => p,
                "message" => "No se pudo procesar la solicitur no se resivieron los parametros"
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

            $vend = new Vendedor();
            $vend->setConnection($connection);
            $vendedor = $vend->findOrFail($id);
            $vendedor->comisionventa;

            $vendContacto= $vend->findOrFail($id)->contactarlo;
            $referenciasVendedor = array();
            $i = 0;

            $venc = new VendedorContactarlo();
            $venc->setConnection($connection);
            foreach ($vendContacto as $row) {
                $referencia = $venc->find($row["idvendedorcontactarlo"])->referenciacontacto;
                $referenciasVendedor[$i]["referencia"] = $referencia->descripcion;
                $referenciasVendedor[$i]["dato"] = $row["valor"];
                $i++;
            }

            return response()->json([
                "response" => 1,
                "vendedor" => $vendedor,
                "referencias" => $referenciasVendedor,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al buscara al vendedor',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
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
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vend = new Vendedor();
            $vend->setConnection($connection);

            $vendedor = $vend->findOrFail($id);
            $vendedor->comisionventa;

            $dataReferencias = $vendedor->contactarlo;
            $data = array();
            $i = 0;

            $vendc = new VendedorContactarlo();
            $vendc->setConnection($connection);
            foreach ($dataReferencias as $key => $row) {
                $referencia  = $vendc->find($row["idvendedorcontactarlo"])->referenciacontacto;
                $data[$i]["idvendedorcontactarlo"] = $row["idvendedorcontactarlo"];
                $data[$i]["idrefcontacto"] = $row["fkidreferenciadecontacto"];
                $data[$i]["valor"] = $row["valor"];
                $data[$i]["referencia"] = $referencia->descripcion;
                $i++;
            }

            $usuarios = DB::connection($connection)
                            ->select("select u.idusuario, u.nombre, u.apellido, u.sexo, u.fechanac, u.email, u.foto
                                from usuario u, grupousuario g
                                where g.idgrupousuario = u.fkidgrupousuario and g.esv = 'S' and
                                    g.deleted_at is null and u.deleted_at is null and
                                    u.idusuario not in (
                                                select fkidusuario as idusuario
                                                from vendedor
                                                where fkidusuario is not null and deleted_at is null
                                                )"
                                );
            $user = DB::connection($connection)
                        ->table('usuario as u')
                        ->where('u.idusuario', $vendedor->fkidusuario)
                        ->where('u.deleted_at', null)
                        ->select('u.idusuario', 'u.nombre', 'u.apellido', 'u.sexo', 'u.fechanac', 'u.email', 'u.foto')
                        ->first();
            if ($user != null) {
                array_push($usuarios, $user);
            }
            return response()->json([
                "response" => 1,
                "vendedor" => $vendedor,
                "referencias" => $data,
                "usuarios" => $usuarios
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
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
        if ($request->filled('nombre')) {
            DB::beginTransaction();
            try {
                $connection = Crypt::decrypt($request->get('x_conexion'));

                $vend = new Vendedor();
                $vend->setConnection($connection);
                $vendedor = $vend->find($id);
                if ($vendedor == null) {
                    return response()->json([
                        'response' => 0,
                        'message' => 'El vendedor no existe'
                    ]);
                }

                $pathAbosobulte = $vendedor->foto;
                //echo "Inicio";
                $eliminar = $request->input('eliminarImagen', false);

                if ($eliminar) {
                    $path = $vendedor->foto;
                    if ($path !== null) {
                        $path = str_replace("/storage","/app/public",$path);
                        $path = storage_path() . $path;
                        unlink($path);
                        $pathAbosobulte = null;
                    }
                }

                $namefoto = $request->input('namefoto', '');
                //if (strlen($namefoto) > 0 && $request->filled('foto')) {
                if ($request->filled('foto')) {
                    if ($request->isusuario) {
                        if (strlen($namefoto) > 0) {
                            try {
                                $array = explode(".",$request->get('namefoto'));
                                $extension = $array[sizeof($array)-1];
                                $name = md5($array[0]);
                                $image = Image::make($request->get('foto'));
                                $image->resize(700, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                    $constraint->upsize();
                                });
                                $imgData = (string)$image->encode('jpg',30);
                                $pathStore = "public/vendedor/img/" . $name . "." . $extension;

                                Storage::put($pathStore, $imgData);

                                $pathAbosobulte = "/storage/vendedor/img/" . $name . "." . $extension;
                            } catch (\Throwable $th) {
                                DB::rollback();
                                return response()->json([
                                    "response" => 0,
                                    "message" => "Ocurrio un problema al guardar la imagen 1",
                                    'error' => [
                                        'message' => $th->getMessage(),
                                        'file' => $th->getFile(),
                                        'linea' => $th->getLine()
                                    ]
                                ]);
                            }
                        } else {
                            $pathAbosobulte = $request->get('foto');
                        }
                    } else if (strlen($namefoto) > 0) {
                        try {
                            $array = explode(".",$request->get('namefoto'));
                            $extension = $array[sizeof($array)-1];
                            $name = md5($array[0]);
                            $image = Image::make($request->get('foto'));
                            $image->resize(700, null, function ($constraint) {
                                $constraint->aspectRatio();
                                $constraint->upsize();
                            });
                            $imgData = (string)$image->encode('jpg',30);
                            $pathStore = "public/vendedor/img/" . $name . "." . $extension;

                            Storage::put($pathStore, $imgData);

                            $pathAbosobulte = "/storage/vendedor/img/" . $name . "." . $extension;
                        } catch (\Throwable $th) {
                            DB::rollback();
                            return response()->json([
                                "response" => 0,
                                "message" => "Ocurrio un problema al guardar la imagen 2",
                                'error' => [
                                    'message' => $th->getMessage(),
                                    'file' => $th->getFile(),
                                    'linea' => $th->getLine()
                                ]
                            ]);
                        }
                    }
                }


                $vendedor->nombre = $request->get('nombre');
                $vendedor->apellido = $request->get('apellido');
                $vendedor->fechanac = $request->get('fechanac');
                $vendedor->fkidcomisionventa = $request->get('idcomision');
                $vendedor->nit = $request->get('nit');
                $vendedor->notas = $request->get('notas');
                $vendedor->sexo = $request->get('sexo');
                $vendedor->estado = $request->get('estado');
                $vendedor->foto = $pathAbosobulte;
                $vendedor->fkidusuario = $request->get('isusuario') ? $request->get('idusuario') : null;
                $vendedor->setConnection($connection);
                $vendedor->update();

                $dataValues = json_decode($request->input('dataValues','[]'));
                $dataReferencias = json_decode($request->input('dataReferencias','[]'));
                $idsActualizar = json_decode($request->input('idsActualizar','[]'));

                $longitud = sizeof($idsActualizar);
                $vendc = new VendedorContactarlo();
                $vendc->setConnection($connection);
                for ($i = 0; $i < $longitud; $i++) {
                    $vendContactarlo = $vendc->find($idsActualizar[$i]);
                    $vendContactarlo->fkidreferenciadecontacto = $dataReferencias[$i];
                    $vendContactarlo->valor = $dataValues[$i];
                    $vendContactarlo->fkidvendedor = $id;
                    $vendContactarlo->setConnection($connection);
                    $vendContactarlo->update();
                }

                $dataValuesNew = json_decode($request->input('dataValuesNew','[]'));
                $dataReferenciasNew = json_decode($request->input('dataReferenciasNew','[]'));

                $longitud = sizeof($dataReferenciasNew);
                for ($i = 0; $i < $longitud; $i++) {
                    $vendContactarlo = new VendedorContactarlo();
                    $vendContactarlo->valor = $dataValuesNew[$i];
                    $vendContactarlo->fkidreferenciadecontacto = $dataReferenciasNew[$i];
                    $vendContactarlo->fkidvendedor = $vendedor->idvendedor;
                    $vendContactarlo->setConnection($connection);
                    $vendContactarlo->save();
                }

                $idsEliminados = json_decode($request->input('idsEliminados','[]'));
                $longitud = sizeof($idsEliminados);

                for ($i = 0; $i < $longitud; $i++) {
                    $vendContactarlo = $vendc->find($idsEliminados[$i]);
                    $vendContactarlo->delete();
                }

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Edito el vendedor ' . $vendedor->idvendedor;
                $log->guardar($request, $accion);

                DB::commit();
                return response()->json([
                    "response" => 1,
                    "message" => "Se acualizo correctamente la informacion",
                    "vendedor" => $vendedor
                ]);
            } catch (DecryptException $e) {
                DB::rollback();
                return response()->json([
                    'response' => -3,
                    'message' => 'Vuelva a iniciar sesion',
                    'error' => [
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'linea' => $e->getLine()
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
                        'linea' => $th->getLine()
                    ]
                ]);
            }


        } else {
            return response()->json([
                "response" => -1,
                "message" => "Ocurrio un problema, vuelva a cargar la pagina de nuevo Por favor"
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        
        try {
            DB::beginTransaction();
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vend = new Vendedor();
            $vend->setConnection($connection);

            $vendedor = $vend->findOrFail($id);
            $ventas = $vendedor->venta;

            if ($ventas->count() > 0) {
                return response()->json([
                    "response" => 0,
                    "message" => "No se puede eliminar al vendedor, ya tiene ventas realizadas"
                ]);
            }

            $path = $vendedor->foto;
            if ($path !== null) {
                $path = str_replace("/storage","/app/public",$path);
                $path = storage_path() . $path;
                unlink($path);
            }

            $vendedorReferencias = $vendedor->contactarlo;

            foreach ($vendedorReferencias as $row) {
                $row->setConnection($connection);
                $row->delete();
            }
            $vendedor->setConnection($connection);
            $vendedor->delete();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Elimino el vendedor ' . $vendedor->idvendedor;
            $log->guardar($request, $accion);

            DB::commit();
            return response()->json([
                "response" => 1,
                "message" => "El vendedor ha sido eliminado correctamente"
            ]);
        } catch (DecryptException $e) {
            DB::rollback();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
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
                    'linea' => $th->getLine()
                ]
            ]);
        }

    }

    /**FUNCIONES AUXILIARES BY ALEX */

    public function SearchByIdCod(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;
            $vend = new Vendedor();
            $vend->setConnection($connection);

            if ($value == '') {
                $vendedores = $vend->leftJoin('comisionventa as co', 'co.idcomisionventa', 'vendedor.fkidcomisionventa')
                    ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 'vendedor.apellido', 'co.valor')
                    ->orderBy('vendedor.idvendedor', 'desc')->get()->take(20);
            }else {
                $vendedores = $vend->leftJoin('comisionventa as co', 'co.idcomisionventa', 'vendedor.fkidcomisionventa')
                    ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 'vendedor.apellido', 'co.valor')
                    ->where('vendedor.idvendedor', 'ILIKE', '%'.$value.'%')
                    ->orWhere('vendedor.codvendedor', 'ILIKE', '%'.$value.'%')
                    ->orderBy('vendedor.idvendedor', 'asc')->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $vendedores,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    public function SearchByNombre(Request $request, $value) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vend = new Vendedor();
            $vend->setConnection($connection);
            $result = $vend->SearchByNombre($value)->get();
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
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un problema al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    public function searchByFullName(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $value = $request->value;
            $vend = new Vendedor();
            $vend->setConnection($connection);

            if ($value == '') {
                $vendedores = $vend->leftJoin('comisionventa as co', 'co.idcomisionventa', 'vendedor.fkidcomisionventa')
                    ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 'vendedor.apellido', 'co.valor')
                    ->orderBy('vendedor.idvendedor', 'desc')->get()->take(20);
            }else {
                $vendedores = $vend->leftJoin('comisionventa as co', 'co.idcomisionventa', 'vendedor.fkidcomisionventa')
                    ->select('vendedor.idvendedor', 'vendedor.codvendedor', 'vendedor.nombre', 'vendedor.apellido', 'co.valor')
                    ->where(DB::raw("CONCAT(vendedor.nombre, ' ' , vendedor.apellido)"), 'ILIKE', "%$value%")
                    ->orderBy('vendedor.idvendedor', 'asc')->get()->take(20);
            }

            return response()->json([
                'response' => 1,
                'data' => $vendedores,
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }

    }

    public function validarCodigo(Request $request, $value) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $vend = new Vendedor();
            $vend->setConnection($connection);

            $count = $vend->where('codvendedor', $value)->count();
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
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'No se pudo procesa la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }

    public function get_usuario(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $usuarios = DB::connection($connection)
                ->select("select u.idusuario, u.nombre, u.apellido, u.sexo, u.fechanac, u.email, u.foto
                    from usuario u, grupousuario g
                    where g.idgrupousuario = u.fkidgrupousuario and g.esv = 'S' and
                        g.deleted_at is null and u.deleted_at is null and
                        u.idusuario not in (
                            select fkidusuario as idusuario
                            from vendedor
                            where fkidusuario is not null and deleted_at is null
                        )"
                );

            return response()->json([
                'response' => 1,
                'data' => $usuarios,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'linea' => $e->getLine()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'message' => $th->getMessage(),
                    'file' => $th->getFile(),
                    'linea' => $th->getLine()
                ]
            ]);
        }
    }
}
