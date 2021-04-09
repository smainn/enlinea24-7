<?php

namespace App\Http\Controllers\Config;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Config\ConfigCliente;
use App\Models\Config\ConfigFabrica;
use App\Models\Contable\CuentaConfig;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Image;

class ConfigClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->decrypt();
            $configs->nlogo = null;
            $configs->nlogonombre = null;
            $configs->nlogoreporte = null;

            $conf2 = new ConfigFabrica();
            $conf2->setConnection($connection);
            $configs2 = $conf2->first();
            $res = $configs2->decrypt();

            $obj = new CuentaConfig();
            $obj->setConnection($connection);
            $cuentaConfig = $obj->first();
            $cuentaConfig->decrypt();

            return response()->json([
                'response' => 1,
                'configcliente' => $configs,
                'configfabrica' => $configs2,
                'cuentaconfig' => $cuentaConfig
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

    public function colors(Request $request) {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            
            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $configs = $conf->first();
            $configs->colors = $request->color;
            $configs->update();

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
                'response' => -1,
                'message' => 'Error al procesar la solicitud'
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     * @return Response
     */
    public function create()
    {
        return view('commerce::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $configc = $request->configCliente;

            $obj = new ConfigCliente();
            $obj->setConnection($connection);
            $configCli = $obj->first();
            $configCli->decrypt();

            

            $dir =  public_path() . '/' . 'img/' . $connection;
            if (!file_exists($dir)) {
                mkdir($dir);
            }

            $path_logo = null;
            if ($configc['nlogo'] != null) {
                $arr_logo = explode(".",$configc['nlogo']);
                $logo_ext = $arr_logo[sizeof($arr_logo)-1];
                $name_logo = md5($arr_logo[0])  . '_' . time();
                $img_logo = Image::make($configc['logo']);
                $imgData = (string)$img_logo->encode('png',30);
                
                $path_store_logo = $dir . '/' . $name_logo . '.' . $logo_ext;
                file_put_contents($path_store_logo, $imgData);
                $path_logo = '/img/' . $connection . '/' . $name_logo . '.' . $logo_ext;

                $pathdelete = public_path() . $configCli->logo;
                if (file_exists($pathdelete)) {
                    try {
                        unlink($pathdelete);
                    } catch (\Throwable $th) {
                        //
                    }
                }
            }
            $path_logonombre = null;
            if ($configc['nlogonombre'] != null) {
                $arr_logo = explode(".",$configc['nlogonombre']);
                $logo_ext = $arr_logo[sizeof($arr_logo)-1];
                $name_logo = md5($arr_logo[0])  . '_' . time();
                $img_logo = Image::make($configc['logonombre']);
                $imgData = (string)$img_logo->encode('png',30);
                
                $path_store_logonombre = $dir . '/' . $name_logo . '.' . $logo_ext;
                file_put_contents($path_store_logonombre, $imgData);
                $path_logonombre = '/img/' . $connection . '/' . $name_logo . '.' . $logo_ext;

                $pathdelete = public_path() . $configCli->logonombre;
                if (file_exists($pathdelete)) {
                    try {
                        unlink($pathdelete);
                    } catch (\Throwable $th) {
                        //
                    }
                }
            }

            $path_logoreporte = null;

            if ($configc['nlogoreporte'] != null) {
                $arr_logo = explode(".",$configc['nlogoreporte']);
                $logo_ext = $arr_logo[sizeof($arr_logo)-1];
                $name_logo = md5($arr_logo[0]) . '_' . time();
                $img_logo = Image::make($configc['logoreporte']);
                $imgData = (string)$img_logo->encode('png',30);
                
                $path_store_logoreporte = $dir . '/' . $name_logo . '.' . $logo_ext;
                file_put_contents($path_store_logoreporte, $imgData);
                $path_logoreporte = '/img/' . $connection . '/' . $name_logo . '.' . $logo_ext;

                $pathdelete = public_path() . $configCli->logoreporte;
                if (file_exists($pathdelete)) {
                    try {
                        unlink($pathdelete);
                    } catch (\Throwable $th) {
                        //
                    }
                }
            }
             
            $configCli->codigospropios = Crypt::encrypt($configc['codigospropios']);
            $configCli->otroscodigos = Crypt::encrypt($configc['otroscodigos']);
            $configCli->monedapordefecto = Crypt::encrypt($configc['monedapordefecto']);
            $configCli->editprecunitenventa = Crypt::encrypt($configc['editprecunitenventa']);
            $configCli->editcostoproducto = Crypt::encrypt($configc['editcostoproducto']);
            $configCli->masdeuncosto = Crypt::encrypt($configc['masdeuncosto']);
            $configCli->masdeunalmacen = Crypt::encrypt($configc['masdeunalmacen']);
            $configCli->editarstockproducto = Crypt::encrypt($configc['editarstockproducto']);
            $configCli->clienteesabogado = Crypt::encrypt($configc['clienteesabogado']);
            $configCli->facturarsiempre = Crypt::encrypt($configc['facturarsiempre']);
            $configCli->ventaendospasos = Crypt::encrypt($configc['ventaendospasos']);

            $configCli->logo = $configc['nlogo'] != null ? Crypt::encrypt($path_logo) :  Crypt::encrypt($configCli->logo);
            $configCli->logonombre = $configc['nlogonombre'] != null ? Crypt::encrypt($path_logonombre) :  Crypt::encrypt($configCli->logonombre);
            $configCli->logoreporte = $configc['nlogoreporte'] != null ? Crypt::encrypt($path_logoreporte) :  Crypt::encrypt($configCli->logoreporte);

            $value = $configc['asientoautomaticosiempre'] ? 'S' : 'N';
            $configCli->asientoautomaticosiempre = $value;

            $value = $configc['asientoautomdecomprob'] ? 'S' : 'N';
            $configCli->asientoautomdecomprob = $value;
            
            $configCli->setConnection($connection);

            $configCli->update();

            $configCli->decrypt();

            return response()->json([
                'response' => 1,
                'message' => 'se guardo correctamente',
                'configCli' => $configCli
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
    public function edit($id)
    {
        return view('commerce::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
