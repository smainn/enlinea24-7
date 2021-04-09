<?php

namespace App\Http\Middleware;
use App\Models\Seguridad\Usuario;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;
use Closure;

class VerifSesionWeb
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $token = $request->get('authorization');
            //$token = substr($data, 7);
            $arr = explode('.', $token);
            if (sizeof($arr) != 3)
                //return response()->json(['data' => 'Numero no valido']);
                abort(401, 'Acceso no autorizado');
            $usr = new Usuario();
            $usr->setConnection($connection);
            $user = $usr->find($request->get('x_idusuario'));
            if ($user == null || $user->api_token != $token) 
                //return response()->json(['data' => 'No hay user', 'token' => $token, 'user' => $user, 'connection'=> $connection]);
                abort(401, 'Acceso no autorizado');


            $dat = Carbon::now();
            $dat2 = $user->updated_at;
            $dat2->addHour();
            if ($dat >= $dat2) {
                $user->api_token = null;
                $user->update();
                abort(401, 'Acceso no autorizado');
            }
            $user->updated_at = $dat;
            $user->update();
            
            return $next($request);

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
}
