<?php

namespace App\Http\Controllers\Seguridad;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Seguridad\Usuario;
use App\Models\Seguridad\Log;
use App\Models\Config\ConfigCliente;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use tymon\JWTAuth\Facades\JWTFactory;
use Tymom\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\PayloadFactory;
use Tymon\JWTAuth\JWTManager as JWT;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LoginController extends Controller
{
    public function login(Request $request) {
        
        DB::beginTransaction();

        try {
            //echo 'hola';

            $empresa = DB::connection('principal')
                            ->table('clientes')
                            ->where('nombre', $request->get('empresa'))
                            ->first();

            // return response()->json(['empresa' => $request->get('empresa'), 'result'=> $empresa], 500);
            //$empresa = null;
            if ($empresa != null) {
                $connection = $empresa->nombre_db;
                //$connection = 'server';
                //
                //$connection = 'pgsql';
                $credenciales = $request->only('login', 'password');
                $usr = new Usuario();
                $usr->setConnection($connection);
                $user = $usr->where(['login'=> $request->login])->first();

                // return response()->json([
                //     'empresa' => $request->get('empresa'),
                //     'login' => $request->get('login'),
                //     'password' => $request->get('password'),
                //     'getempresa' => DB::connection('principal')->table('clientes')->get(),
                //     'usuario' => $user,
                // ], );
                
                if ($user != null) {
                    
                    $now = time();
                    $fec = $user->timewait == null ? (time() - 60) : $user->timewait;
                    if ($fec > $now) {
                        return response()->json([
                            'response'  => -4,
                            'message'   => 'Debe esperar un momento para volver a intentarlo',
                            'segundos'  => ($user->timewait - $now)
                        ]);
                    }

                    $log = new Log();
                    $log->setConnection($connection);
                    $log->fechacliente = $request->get('x_fecha');
                    $log->horacliente = $request->get('x_hora');
                    $log->ipcliente = $request->ip();
                    
                    //$user = $result->first();
                    if ($user->login == null) {
                        return response()->json([
                            'response' => 0,
                            'message' => 'Error, -usuario, contraseña o empresa incorrectos'
                        ]);
                    } else if (!Hash::check($request->password, $user->password)) {

                        $log->idusr = $user->idusuario;
                        $log->loginusr = $user->login;
                        $log->accionhecha = 'Fallo al iniciar sesion';
                        $log->guardar();

                        $user->intentos = $user->intentos + 1;
                        $user->timewait = null;
                        $codrespuesta = 0;
                        $segundos = 0;
                        if ($user->intentos >= 3 && $user->intentos % 3 === 0) {
                            //$user->intentos = 0;
                            $segundos = ($user->intentos / 3) * 60;
                            $user->timewait = time() + $segundos;
                            $codrespuesta = -4;
                        }
                        $user->update();
                        DB::commit();
                        return response()->json([
                            'response' => $codrespuesta,
                            'error' => 'Error, usuario o -contraseña incorrectos',
                            'segundos' => $segundos,
                        ]);
                    }

                    $permisions = $this->getPermisions($connection, $user->idusuario);
                    try {
                        
                        $token = JWTAuth::fromUser($user);
                        
                        if (!$token) {
                            return response()->json([
                                'response' => 0,
                                'error' => 'invalid_credentials'
                            ]);//400
                        }
                    } catch (JWTException $e) {
                        return response()->json([
                            'response' => -1,
                            'error' => 'could_not_create_token'
                        ]);//500
                    } catch (ErrorException $e) {
                        return response()->json([
                            'response' => -1,
                            'message' => 'Error usuario contraseña incorrectos',
                            'error' => $e
                        ]);
                    }

                    $conf = new ConfigCliente();
                    $conf->setConnection($connection);
                    $configCli = $conf->first();
                    $configCli->decrypt();
                    
                    $date = Carbon::now();

                    $user->api_token = $token;
                    $user->lastlogin = $date->toDateTimeString();
                    $user->lastlogout = null;
                    $user->ip = $request->ip();
                    $user->setConnection($connection);
                    $user->intentos = 0;
                    $user->timewait = null;
                    $user->update();
                    $newUser = [
                        'idusuario' => $user->idusuario,
                        'nombre' => $user->nombre,
                        'apellido' => $user->apellido,
                        'telefono' => $user->telefono,
                        'email' => $user->email,
                        'foto' => $user->foto,
                        'is_file' => is_file(public_path().$user->foto),
                        'login' => $user->login,
                        'fechanacimiento' => $user->fechanac,
                        'genero' => $user->sexo,
                        'idgrupousuario' => $user->fkidgrupousuario,
                    ];
                    $log->idusr = $user->idusuario;
                    $log->loginusr = $user->login;
                    $log->accionhecha = 'Inicio sesion';
                    $log->guardar();
                    
                    DB::commit();
                    return response()->json([
                        'response' => 1,
                        'token' => $token,
                        'user' => $newUser,
                        'permisions' => $permisions,
                        'connection' => Crypt::encrypt($connection),
                        'logo' => $configCli->logo,
                        'logonombre' => $configCli->logonombre,
                        'logoreporte' => $configCli->logoreporte,
                        'colors' => $configCli->colors,
                        'isabogado' => $configCli->clienteesabogado
                    ]);

                } else {
                    return response()->json([
                        'response' => 0,
                        'message' => 'Error, usuario-, contraseña o empresa incorrectos'
                    ]);
                }

            } else {
                return response()->json([
                    'response' => 0,
                    'message' => 'Error, usuario, contraseña o -empresa incorrectos'
                ]);
            }
            
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'response' => -1,
                'message' => 'Error, No se pudo procesar la solictud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
        
    }

    public function getAuthenticatedUser() {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        }catch(Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        
        }catch(Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        
        }catch(Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        return response()->json(compact('user'));
    }

    public function getPermisions($connection, $id) {
        
        $usr = new Usuario();
        $usr->setConnection($connection);
        $data = $usr->leftJoin('grupousuario as g', 'g.idgrupousuario', '=', 'usuario.fkidgrupousuario')
                    ->leftJoin('asignacionprivilegio as ap', 'ap.fkidgrupousuario', '=', 'g.idgrupousuario')
                    ->leftJoin('componente as c', 'c.idcomponente', '=', 'ap.fkidcomponente')
                    ->where([
                        'usuario.idusuario' => $id,
                        'ap.habilitado' => 'A'
                    ])
                    ->select('usuario.nombre', 'usuario.apellido','c.idcomponente as id', 
                            'c.idcomponentepadre', 'c.descripcion', 'ap.visible', 'ap.editable', 'ap.novisible'
                        )
                    ->get();
        $arr = [];
        foreach ($data as $row) {
            try {
                $descripcion = /*$row->descripcion;*/ Crypt::decrypt($row->descripcion);
                $visible = /*$row->visible;*/ Crypt::decrypt($row->visible);
                $editable = /*$row->editable;*/ Crypt::decrypt($row->editable);
                $novisible = /*$row->novisible;*/ Crypt::decrypt($row->novisible);
                array_push($arr, [
                    'id' => $row->id,
                    'idcomponentepadre' => $row->idcomponentepadre,
                    'descripcion' => $descripcion,
                    'visible' => $visible,
                    'editable' => $editable,
                    'novisible' => $novisible
                ]);
            } catch (DecryptException $e) {
                return [];
            }
        }
        return $arr;
    }

    public function logout(Request $request) {
        
        try {
            $connection = Crypt::decrypt($request->x_conexion);
            
            $id  = $request->id;
            $usr = new Usuario();
            $usr->setConnection($connection);
            $user = $usr->find($id);
            if ($user == null) {
                return response()->json([
                    "response" => 0,
                    "message" => "El usuario no existe"
                ]);
            }

            $log = new Log();
            $log->setConnection($connection);
            $log->fechacliente = $request->get('x_fecha');
            $log->horacliente = $request->get('x_hora');
            $log->idusr = $id;
            $log->loginusr = $user->login;
            $log->accionhecha = 'Cerror sesion';
            $log->ipcliente = $request->ip();
            $log->guardar();

            $user->api_token = null;
            $user->lastlogout = new Carbon();
            $user->update();
            return response()->json([
                'response' => 1,
                'message' => 'Se cerro session correctamente'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Ocurrio un error al cerrar session'
            ]);
        }
    }

    public function inSesion(Request $request) {

        try {
            if ($request->filled('id') && $request->filled('token')) {
                $id = $request->id;
                $token = $request->token;
                $connection = Crypt::decrypt($request->x_conexion);
                
                $usr = new Usuario();
                $usr->setConnection($connection);
                $user = $usr->find($id);
                if ($user == null) {
                    return response()->json([
                        'response' => 0,
                        'message' =>  'El usuario no existe'
                    ]);
                }
    
                if ($user->api_token == $token) {
                    return response()->json([
                        'response' => 1,
                        'message' => 'Esta logueado'
                    ]);
                } else {
                    return response()->json([
                        'response' => -2,
                        'message' => 'No esta logueado'
                    ]);
                }
            } else {
                return response()->json([
                    'response' => -2,
                    'message' => 'No sesion'
                ]);
            }
            
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        } catch (Illuminate\Contracts\Encryption\DecryptException $e) {
            return response()->json([
                'response' => -2,
                'message' => 'No se pudo conectar con la bd'
            ]);
        }
    }
}
