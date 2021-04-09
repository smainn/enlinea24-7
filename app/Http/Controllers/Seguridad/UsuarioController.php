<?php

namespace App\Http\Controllers\Seguridad;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Contracts\Encryption\DecryptException;

use App\Models\Seguridad\Usuario;
use App\Models\Seguridad\Log;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Image;
use Illuminate\Support\Facades\Storage;

use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use App\Mail\PasswordReceived;
use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Comercio\Almacen\Producto\Familia;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Almacen\Producto\UnidadMedida;
use Maatwebsite\Excel\Facades\Excel;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            //echo 'inicio';
            $buscar = $request->buscar;
            $paginacion = $request->pagina;
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $user = new Usuario();
            $user->setConnection($connection);
            $idgrupo = $request->iduser;

            if ($buscar == '') {
                if ($idgrupo == '') {
                    $usuario = $user->select('idusuario', 'estado', 'lastlogout', 'lastlogin',
                        DB::raw("CONCAT(nombre, ' ',apellido) as nombre"), 'email', 'login', 'telefono')
                        ->where('estado', '=', 'A')
                        ->orderBy('idusuario', 'asc')
                        ->paginate($paginacion);
                } else {
                    $usuario = $user->select('idusuario', 'estado', 'lastlogout', 'lastlogin',
                        DB::raw("CONCAT(nombre, ' ',apellido) as nombre"), 'email', 'login', 'telefono')
                        ->where('estado', '=', 'A')
                        ->where(
                            ($idgrupo == null)?
                                [['estado', '=', 'A']]:
                                    ($idgrupo == 1)?
                                        [['estado', '=', 'A']]:
                                        [['fkidgrupousuario', '!=', '1']]
                        )
                        ->orWhere('fkidgrupousuario', '=', null)
                        ->orderBy('idusuario', 'asc')
                        ->paginate($paginacion);
                }

            } else {
                if ($idgrupo == '') {
                    $usuario = $user->select('idusuario', 'estado', 'lastlogout', 'lastlogin',
                            DB::raw("CONCAT(nombre, ' ',apellido) as nombre"), 'email', 'login', 'telefono')
                        ->where('estado', '=', 'A')
                        ->where(function ($query) use ($buscar) {
                            return $query->orWhere(DB::raw("CONCAT(nombre, ' ',apellido)"), 'ILIKE', '%'.$buscar.'%')
                                ->orWhere('email', 'ILIKE', '%'.$buscar.'%')
                                ->orWhere('login', 'ILIKE', '%'.$buscar.'%');
                        })
                        ->orderBy('idusuario', 'asc')
                        ->paginate($paginacion);
                } else {
                    $usuario = $user->select('idusuario', 'estado', 'lastlogout', 'lastlogin',
                        DB::raw("CONCAT(nombre, ' ',apellido) as nombre"), 'email', 'login', 'telefono')
                        ->where('estado', '=', 'A')
                        ->where(
                            ($idgrupo == null)?
                                [['estado', '=', 'A']]:
                                    ($idgrupo == 1)?
                                        [['estado', '=', 'A']]:
                                        [['fkidgrupousuario', '!=', '1']]
                        )
                        ->where(function ($query) use ($buscar) {
                            return $query->orWhere(DB::raw("CONCAT(nombre, ' ',apellido)"), 'ILIKE', '%'.$buscar.'%')
                                ->orWhere('email', 'ILIKE', '%'.$buscar.'%')
                                ->orWhere('login', 'ILIKE', '%'.$buscar.'%');
                        })
                        ->orWhere('fkidgrupousuario', '=', null)
                        ->orderBy('idusuario', 'asc')
                        ->paginate($paginacion);
                }
            }
            
            return response()->json([
                'response' => 1,
                'data' => $usuario,
                'pagination' => [
                    'total'        => $usuario->total(),
                    'current_page' => $usuario->currentPage(),
                    'per_page'     => $usuario->perPage(),
                    'last_page'    => $usuario->lastPage(),
                    'from'         => $usuario->firstItem(),
                    'to'           => $usuario->lastItem(),
                ],
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a inicia sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function refresh() {
        return view('commerce::admin.template');
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
        
        try {
            DB::beginTransaction();
            
            $login = $request->login;
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $reglas = ['email' => 'required|email'];
	 
            $mensajes = ['email.email' => 'Solo se permite email'];

            $validator = Validator::make( $request->all(), $reglas, $mensajes );

            if($validator->fails() ){ 
                return response()->json([
                    'response' => -3,
                ]);   
            }
            
            $array = DB::connection($connection)->table('usuario')
                ->where('login', '=', $login)
                ->where('deleted_at', null)
                ->get();
    
            if(sizeof($array) > 0){ 
                return response()->json([
                    'response' => 0,
                ]);     
            }

            $foto = $request->imagen;
            
            if ($foto != '') {
                $image = Image::make($foto);
                $image->resize(700,null,function($constraint){
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                $imageData = (string)$image->encode('jpg',30);
                $name = time();
                $nameHash = md5($name);
                $path = "public/usuario/img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];
                Storage::put($path, $imageData);
                $pathabsoluto = "/storage/usuario/img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];;
                $foto = $pathabsoluto;
            }

            $nombre = $request->nombre;
            $apellido = $request->apellido;
            $genero = $request->sexo;
            $email = $request->email;
            $telefono = $request->telefono;
            $notas = $request->notas;

            $password = $request->newpassword;

            $usuario = new Usuario();
            $usuario->setConnection($connection);
            $usuario->nombre = $nombre;
            $usuario->apellido = $apellido;
            $usuario->sexo = $genero;
            $usuario->login = $login;
            $usuario->password = bcrypt($password);
            $usuario->email = $email;
            $usuario->telefono = $telefono;
            $usuario->estado = 'A';
            $usuario->notas = $notas;
            $usuario->foto = $foto;
            $mytime = Carbon::now('America/La_paz');
            $usuario->fecha = $mytime->toDateString();
            $usuario->hora = $mytime->toTimeString();
            $usuario->save();
            
            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Inserto el usuario ' . $usuario->idusuario;
            $log->guardar($request, $accion);
            

            $result = Mail::send('sistema.src.emails.password_received', ['user' => $request], 
                function ($message) use ($request) {
                    $message->from('contacto@spalhi.com', 'Enlinea24-7 Cuenta Nuevo Usuario');
                    $message->to($request->email)
                        ->subject('Usuario Nuevo: '.$request->nombre.' '.$request->apellido);
                }
            );

            DB::commit();
            return response()->json([
                'response' => 1,
                'data' => $result,
            ]);

        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuela a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        } 
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        return view('commerce::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Response
     */
    public function edit(Request $request, $id)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $usr = new Usuario();
            $usr->setConnection($connection);
            $data = $usr->find($id);
            
            return response()->json([
                'response' => 1,
                'data' => $data,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request)
    {
        try {
            DB::beginTransaction();

            $id = $request->id;
            $login = $request->login;
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $usr = new Usuario();
            $usr->setConnection($connection);
            $usuario = $usr->find($id);

            $reglas = ['email' => 'required|email'];
	 
            $mensajes = ['email.email' => 'Solo se permite email'];

            $validator = Validator::make( $request->all(), $reglas, $mensajes );

            if($validator->fails() ){ 
                return response()->json([
                    'response' => -3,
                ]);   
            }

            if ($login != $usuario->login) {
                
                $array = DB::connection($connection)
                            ->table('usuario')
                            ->where('login', '=', $login)
                            ->where('deleted_at', null)
                            ->get();
    
                if(sizeof($array) > 0){ 
                    return response()->json([
                        'response' => 0,
                    ]);     
                }
            }

            $foto = $request->imagen;
            $bandera = $request->bandera;

            if ($bandera == 1) {
                if($foto != '') {
                    $image = Image::make($foto);
                    $image->resize(700,null,function($constraint){
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    $imageData = (string)$image->encode('jpg',30);
                    $name = time();
                    $nameHash = md5($name);
                    $path = "public/usuario/img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];
                    Storage::put($path, $imageData);
                    $pathabsoluto = "/storage/usuario/img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];;
                    $foto = $pathabsoluto;
                }
            }

            $nombre = $request->nombre;
            $apellido = $request->apellido;
            $genero = $request->sexo;
            $email = $request->email;
            $telefono = $request->telefono;
            $notas = $request->notas;
            $estado = $request->estado;

            $password = $request->newpassword;
            
            $usuario->setConnection($connection);
            $usuario->nombre = $nombre;
            $usuario->apellido = $apellido;
            $usuario->sexo = $genero;
            $usuario->login = $login;

            if ($password != '') {
                $usuario->password = bcrypt($password);
            }
            $usuario->email = $email;
            $usuario->telefono = $telefono;
            $usuario->notas = $notas;
            $usuario->estado = $estado;
            
            if ($bandera == 1) {
                $usuario->foto = $foto;
            }

            $usuario->update();

            $user = [
                'idusuario' => $usuario->idusuario,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'email' => $usuario->email,
                'foto' => $usuario->foto,
                'is_file' => is_file(public_path().$usuario->foto),
                'telefono' => $usuario->telefono,
                'login' => $usuario->login,
                'fechanacimiento' => $usuario->fechanac,
                'genero' => $usuario->sexo,
                'idgrupousuario' => $usuario->fkidgrupousuario,
            ];

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Edito el usuario ' . $usuario->idusuario;
            $log->guardar($request, $accion);
            /*
            $result = Mail::send('commerce::admin.emails.password_recovered', ['user' => $request], 
                function ($message) use ($request) {
                    $message->from('contacto@spalhi.com', 'Enlinea24-7 Password Nuevo Usuario');
                    $message->to($request->email)
                        ->subject('Usuario: '.$request->nombre.' '.$request->apellido);
                }
            );
            */

            DB::commit();

            return response()->json([
                'response' => 1,
                'user' => $user
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -1,
                'message' => 'Vuelva a iniciar sesion'
            ]);   
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function perfil(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $id = $request->id;

            if ($id == '') {
                return response()->json([
                    'response' => 0,
                ]);     
            }

            $nombre = $request->nombre;
            $apellido = $request->apellido;
            $nacimiento = $request->fechanacimiento;
            $email = $request->email;
            $telefono = $request->telefono;
            $genero = $request->genero;

            $foto = $request->foto;
            $bandera = $request->bandera;

            if ($bandera == 1) {
                if($foto != '') {
                    $image = Image::make($foto);
                    $image->resize(700,null,function($constraint){
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    $imageData = (string)$image->encode('jpg',30);
                    $name = time();
                    $nameHash = md5($name);
                    $path = "public/perfil/img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];
                    Storage::put($path, $imageData);
                    $pathabsoluto = "/storage/perfil/img/".$nameHash.'.'.explode('/', explode(':', substr($foto, 0, strpos($foto, ';')))[1])[1];;
                    $foto = $pathabsoluto;
                }
            }

            $usr = new Usuario();
            $usr->setConnection($connection);

            $usuario = $usr->find($id);
            $usuario->setConnection($connection);
            $usuario->nombre = $nombre;
            $usuario->apellido = $apellido;
            $usuario->fechanac = $nacimiento;
            $usuario->email = $email;
            $usuario->telefono = $telefono;
            $usuario->sexo = $genero;

            if ($bandera == 1) {
                $usuario->foto = $foto;
            }

            $usuario->update();

            $user = [
                'idusuario' => $usuario->idusuario,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'telefono' => $usuario->telefono,
                'email' => $usuario->email,
                'foto' => $usuario->foto,
                'is_file' => is_file(public_path().$usuario->foto),
                'login' => $usuario->login,
                'fechanacimiento' => $usuario->fechanac,
                'genero' => $usuario->sexo,
                'idgrupousuario' => $usuario->fkidgrupousuario,
            ];

            return response()->json([
                'response' => 1,
                'user' => $user
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function update_password(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $id = $request->id;
            $login = $request->login;

            if ($id == '' || $login == '') {
                return response()->json([
                    'response' => 0,
                ]);     
            }
            
            $user = new Usuario();
            $user->setConnection($connection);
            $usuario = $user->find($id);

            $password = $request->password;
            $newpassword = $request->newpassword;
            $repeatpassword = $request->repeatpassword;

            if ($repeatpassword == '' || $newpassword == '') {
                return response()->json([
                    'response' => 0,
                ]); 
            }

            if (!Hash::check($password, $usuario->password)){
                return response()->json([
                    'response' => -1,
                ]);
            }
            $usuario->password = bcrypt($newpassword);
            $usuario->update();

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Se edito el password del usuario ' . $usuario->idusuario;
            $log->guardar($request, $accion);

            return response()->json([
                'response' => 1,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);  
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function generar_password(Request $request) {
        try {
            DB::beginTransaction();

            $id = $request->id;
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $usr = new Usuario();
            $usr->setConnection($connection);
            $usuario = $usr->find($id);

            $reglas = ['email' => 'required|email'];
	 
            $mensajes = ['email.email' => 'Solo se permite email'];

            $validator = Validator::make( $request->all(), $reglas, $mensajes );

            if($validator->fails() ){ 
                return response()->json([
                    'response' => -3,
                ]);   
            }

            $email = $request->email;
            $password = $request->newpassword;
            
            $usuario->setConnection($connection);

            if ($password != '') {
                $usuario->password = bcrypt($password);
                $usuario->update();

                $result = Mail::send('sistema.src.emails.password_recovered', ['user' => $usuario, 'password' => $password], 
                    function ($message) use ($request, $usuario) {
                        $message->from('contacto@spalhi.com', 'Enlinea24-7 Password Nuevo Usuario');
                        $message->to($request->email)
                            ->subject('Usuario: '.$usuario->nombre.' '.$usuario->apellido);
                    }
                );
            }

            $log = new Log();
            $log->setConnection($connection);
            $accion = 'Se genero un nuevo password ' . $usuario->idusuario;
            $log->guardar($request, $accion);

            DB::commit();

            return response()->json([
                'response' => 1,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -1,
                'message' => 'Vuelva a iniciar sesion'
            ]);   
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request)
    {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $id = $request->id;
            $usr = new Usuario();
            $usr->setConnection($connection);
            $usuario = $usr->find($id);

            if ($usuario->fkidgrupousuario == null) {

                $usuario->delete();

                $log = new Log();
                $log->setConnection($connection);
                $accion = 'Elimino el usuario ' . $usuario->idusuario;
                $log->guardar($request, $accion);
                
                return response()->json([
                    'response' => 1,
                    'data' => $id
                ]);
            }

            return response()->json([
                'response' => 2,
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);  
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    public function getPermisions($id) {
        //$this->middleware('auth');
        $data = Usuario::leftJoin('grupousuario as g', 'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                ->leftJoin('asignacionprivilegio as ap', 'ap.fkidgrupousuario', '=', 'g.idgrupousuario')
                ->leftJoin('componente as c', 'c.idcomponente', '=', 'ap.fkidcomponente')
                ->where('usuario.idusuario', '=', $id)
                ->select('usuario.nombre', 'usuario.apellido','c.idcomponente', 'c.idcomponentepadre', 'c.descripcion', 'ap.*')
                ->get();
        
        return response()->json([
            'response' => 1,
            'data' => $data
        ]);
    }

    public function searchUserId(Request $request, $value) {
        //$session = $request->session()->get('nombre');
        //$request->session()->put('nombre', 'ALEX');
        
        try {
            //$data = Usuario::where('idusuario')
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $data = DB::connection($connection)
                ->select("select u.idusuario, u.nombre, u.apellido, u.sexo, u.fechanac, u.email, u.foto
                    from usuario u, grupousuario g
                    where g.idgrupousuario = u.fkidgrupousuario and g.esv = 'S' and
                        g.deleted_at is null and u.deleted_at is null and TO_CHAR(u.idusuario, '99999') LIKE '%$value%' and
                        u.idusuario not in (
                            select fkidusuario as idusuario
                            from vendedor
                            where fkidusuario is not null and deleted_at is null
                        )"
                    );
            
            return response()->json([
                'response' => 1,
                'data' => $data,
                'bandera' => 10,
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

    public function searchUserNom(Request $request, $value) {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $data = DB::connection($connection)
                        ->select("select u.idusuario, u.nombre, u.apellido, u.sexo, u.fechanac, u.email, u.foto
                            from usuario u, grupousuario g
                            where g.idgrupousuario = u.fkidgrupousuario and g.esv = 'S' and
                                g.deleted_at is null and u.deleted_at is null and (u.nombre || ' ' || u.apellido) ILIKE '%$value%' and
                                u.idusuario not in (
                                            select fkidusuario as idusuario
                                            from vendedor 
                                            where fkidusuario is not null and deleted_at is null
                                            )"
                        );
            
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
                'message' => 'No se pudo procesar la solicitud'
            ]);
        }
    }

    public function getOnline(Request $request) {

        try {

            DB::beginTransaction();

            $connection = Crypt::decrypt($request->get('x_conexion'));


            // Excel::load( public_path().'/importar/ALM-CENTRAL.csv' , function($reader) {
            //     foreach ($reader->get() as $archivo) {
            //         $producto = [];
            //         array_push($producto, $archivo->codProd);
            //         array_push($array, $producto);
            //     }
            // });


            
            $usr = new Usuario();
            $usr->setConnection($connection);
            $users = $usr->where('api_token', '<>', null)
                ->get();
            $arr = [];

            foreach ($users as $user) {
                $tok = explode('.', $user->api_token);
                $payload = base64_decode($tok[1]);
                $payload = json_decode($payload);
                if ($payload->exp > time()) {
                    array_push($arr, $user);
                }
            }

            DB::commit();
            
            return response()->json([
                'response' => 1,
                'users' => $arr,
            ]);

        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
            ]);  
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se puede procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
    }
}
