<?php

namespace App\Http\Controllers\Comercio\Reportes\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comercio\Almacen\Sucursal;
use App\Models\Comercio\Utils\Exports\Ventas\FacturaExport;
use App\Models\Comercio\Ventas\Cliente;
use App\Models\Config\ConfigCliente;
use App\Models\Configuracion\Dosificacion;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

use Maatwebsite\Excel\Facades\Excel;

use PDF;

class FacturaController extends Controller
{
    public function create(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $obj = new Sucursal();
            $obj->setConnection($connection);

            $sucursal = $obj->
                select('idsucursal', 'razonsocial', 'nombrecomercial', 'tipoempresa')
                ->orderBy('idsucursal', 'asc')->get();

            $obj = new Dosificacion();
            $obj->setConnection($connection);

            $dosificacion = $obj->
                select('idfacdosificacion', 'numeroautorizacion')
                ->orderBy('idfacdosificacion', 'asc')->get();

            $obj = new Cliente();
            $obj->setConnection($connection);

            $cliente = $obj->
                select('idcliente', 'nombre', 'apellido', 'codcliente')
                ->orderBy('idcliente', 'asc')
                ->get()->take(20);

            return response()->json([
                'response'  => 1,
                'sucursal' => $sucursal,
                'dosificacion' => $dosificacion,
                'cliente' => $cliente,
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }
    public function generar(Request $request) {
        try {

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $connection = Crypt::decrypt($request->get('x_conexion'));

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');
            $usuario = $request->input('usuario', '');

            $idsucursal = $request->input('idsucursal', null);
            $idalmacen = $request->input('idalmacen', null);
            $numeroautorizacion = $request->input('iddosificacion', null);
            $estado = $request->input('estado', null);
            $nitcliente = $request->input('nitcliente', null);
            $cliente = $request->input('cliente', null);
            $fechainicio = $request->input('fechainicio', null);
            $fechafin = $request->input('fechafin', null);
            $ordenar = $request->input('ordenar', null);
            $exportar = $request->input('exportar', null);

            $consulta = [];

            if (!is_null($idsucursal)) {
                array_push($consulta, ['vent.fkidsucursal', '=', $idsucursal]);
            }

            if (!is_null($idalmacen)) {
                array_push($consulta, [ 
                    DB::raw("(SELECT COUNT(*) AS cantidad 
                        FROM ventadetalle vtadet, almacenproddetalle almdet 
                        WHERE vent.idventa = vtadet.fkidventa AND vtadet.fkidalmacenproddetalle = almdet.idalmacenproddetalle 
                            AND almdet.fkidalmacen = '$idalmacen' )"
                    ),  '>', '0' ]);
            }

            if (!is_null($numeroautorizacion)) {
                array_push($consulta, ['libventa.nroautorizacion', '=', $numeroautorizacion]);
            }

            array_push($consulta, ['fact.estado', '=', $estado]);

            if (!is_null($nitcliente)) {
                array_push($consulta, ['fact.nit', 'ILIKE', '%'.$nitcliente.'%' ]);
            }

            if (!is_null($cliente)) {
                array_push($consulta, ['fact.nombre', 'ILIKE', '%'.$cliente.'%' ]);
            }

            if (!is_null($fechainicio)) {
                if (is_null($fechafin)) {
                    array_push($consulta, ['fact.fecha', '>=', $fechainicio]);
                }else {
                    array_push($consulta, ['fact.fecha', '>=', $fechainicio]);
                    array_push($consulta, ['fact.fecha', '<=', $fechafin]);
                }
            }

            $factura = DB::connection($connection)
                ->table('factura as fact')
                ->select('libventa.nroautorizacion', 'fact.codigodecontrol', 'fact.numero', 'fact.fecha', 'vent.idventa',
                    'fact.nombre', 'fact.nit', 'fact.mtototalventa', 'fact.estado', 'fact.contadordelimpresion'
                )
                ->leftJoin('faclibroventa as libventa', 'fact.idfactura', '=', 'libventa.fkidfactura')
                ->leftJoin('venta as vent', 'fact.fkidventa', '=', 'vent.idventa')
                ->where( $consulta )
                ->whereNotNull('libventa.nroautorizacion')
                // ->whereNull('fact.deleted_at')
                ->orderBy('fact.idfactura', 'asc')
                ->get();

            // dd($factura);

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config_cliente = $conf->first();
            $config_cliente->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.ventafactura', [
                'usuario' => $usuario,
                'fecha' => $fecha,
                'hora' => $hora,
                'factura' => $factura,
                'codigospropios' => $config_cliente->codigospropios,
                'logo' => $config_cliente->logoreporte,
            ]);

            $pdf->setPaper('A4', 'landscape');

            $pdf->output();
            
            $dom_pdf = $pdf->getDomPDF();
            
            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(40, 820, $usuario, null, 8, array(0, 0, 0));
            
            $canvas->page_text(450, 820, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            if ($exportar == 'P') { 
                return $pdf->download('ventafactura.pdf');
            }

            if ($exportar == 'E') { 
                $factura->codigospropios = $config_cliente->codigospropios;
                $factura->logoreporte = $config_cliente->logoreporte;
                return Excel::download(new FacturaExport($factura), 'ventafactura.xlsx');
            }

            return $pdf->stream('ventafactura.pdf');
            
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
                'message'   => 'NO SE PUDO GENERAR INFORMACION!!!',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }
}
