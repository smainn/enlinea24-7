<?php

namespace App\Http\Controllers\Contable;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Models\Contable\CuentaConfig;

class CuentaConfigController extends Controller
{
    public function store(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $configr = $request->config;

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $config = $obj->first();

            $config->fecha = Crypt::encrypt($configr['fecha']);
            $config->numniveles = Crypt::encrypt($configr['numniveles']);
            $config->formato = Crypt::encrypt($configr['formato']);
            $config->impuestoanualieerr = Crypt::encrypt($configr['impuestoanualieerr']);
            $config->update();
            $config->decrypt();
            
            return response()->json([
                'response' => 1,
                'message' => 'Se actualizo correctamente',
                'config' => $config
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response'  => -1,
                'message'   => 'No se pudo obtener los comprobantes',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }
}
