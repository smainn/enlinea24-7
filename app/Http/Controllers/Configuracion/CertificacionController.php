<?php

namespace App\Http\Controllers\Configuracion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Facturacion\CodigoControl;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

class CertificacionController extends Controller
{
    public function generar(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));
            $certificacion = json_decode($request->certificacion);

            $codigo_control = new CodigoControl();
            $array_codigo = $codigo_control->generarCodigo($certificacion);

            return [
                'response' => 1,
                'certificacion' => $array_codigo,
            ];
            
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelvav a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud'.$th
            ]);
        }
    }
}
