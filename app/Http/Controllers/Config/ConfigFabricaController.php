<?php

namespace App\Http\Controllers\Config;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Config\ConfigFabrica;
use App\Models\Config\ConfigCliente;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class ConfigFabricaController extends Controller
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
            $conf = new ConfigFabrica();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->decrypt();

            return response()->json([
                'response' => 1,
                'data' => $configs
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'message' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
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
            $configf = $request->configFabrica;

            $obj = new ConfigFabrica();
            $obj->setConnection($connection);
            $configFab = $obj->first();
            $configFab->comalmaceninventariocorte = Crypt::encrypt($configf['comalmaceninventariocorte']);
            $configFab->comalmaceningresoprod = Crypt::encrypt($configf['comalmaceningresoprod']);
            $configFab->comalmacensalidaprod = Crypt::encrypt($configf['comalmacensalidaprod']);
            $configFab->comalmacenlistadeprecios = Crypt::encrypt($configf['comalmacenlistadeprecios']);
            $configFab->comventasventaalcredito = Crypt::encrypt($configf['comventasventaalcredito']);
            $configFab->comventasventaproforma = Crypt::encrypt($configf['comventasventaproforma']);
            $configFab->comventascobranza = Crypt::encrypt($configf['comventascobranza']);
            $configFab->comcompras = Crypt::encrypt($configf['comcompras']);
            $configFab->comtaller = Crypt::encrypt($configf['comtaller']);
            $configFab->comtallervehiculoparte = Crypt::encrypt($configf['comtallervehiculoparte']);
            $configFab->comtallervehiculohistoria = Crypt::encrypt($configf['comtallervehiculohistoria']);
            $configFab->seguridad = Crypt::encrypt($configf['seguridad']);
            $configFab->update();
            $configFab->decrypt();
            return response()->json([
                'response' => 1,
                'message' => 'Se guardo correctamente',
                'configFab' => $configFab
            ]);
        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
                'error' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'message' => $e->getMessage()
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
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
}
