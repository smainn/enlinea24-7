<?php

namespace App\Http\Controllers\Comercio\Reportes\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use App\Models\Config\ConfigCliente;
use App\Models\Comercio\Taller\Vehiculo;

use Maatwebsite\Excel\Facades\Excel;
use App\Comercio\Utils\Exports\Ventas\VentaHistoricoVehiculoExport;
use DB;
use PDF;

class VentaHistoricoVehiculoController extends Controller
{
    public function reporte(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $buscar = $request->buscar;
            $data = [];

            $veh = new Vehiculo();
            $veh->setConnection($connection);
            if ($buscar == '') {
                $data = $veh->leftJoin('cliente as c', 'vehiculo.fkidcliente', 'c.idcliente')
                            ->select('vehiculo.placa','c.nombre', 'c.apellido', 'vehiculo.idvehiculo')
                            ->orderBy('vehiculo.idvehiculo', 'asc')
                            ->paginate(15);
            }else {
                $data = $veh->leftJoin('cliente as c', 'vehiculo.fkidcliente', 'c.idcliente')
                            ->select('vehiculo.placa','c.nombre', 'c.apellido', 'vehiculo.idvehiculo')
                            ->where('vehiculo.placa', 'ilike', '%'.$buscar.'%')
                            ->orderBy('vehiculo.idvehiculo', 'asc')
                            ->paginate(15);
            }

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

    public function generar(Request $request) {

        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $placa = $request->placa;
            $cliente = $request->cliente;

            $idvehiculo = $request->idvehiculo;
            $fechainicio = $request->fechaInicio;
            $fechafinal = $request->fechaFinal;

            $ordenar = $request->ordenar;
            $exportar = $request->exportar;

            $user = $request->usuario;

            $order = '';

            if ($ordenar == '0') {
                $order = 'v.idventa';
            }
            if ($ordenar == '1') {
                $order = 'v.fecha';
            }
            if ($ordenar == '2') {
                $order = 'p.idproducto';
            }
            if ($ordenar == '3') {
                $order = 'p.descripcion';
            }
            if ($ordenar == '4') {
                $order = 'vd.cantidad';
            }
            if ($ordenar == '5') {
                $order = 'vd.preciounit';
            }

            $consulta = [];
            $bandera = 0;

            if ($fechainicio != '') {
                array_push($consulta, ['v.fecha', '>=', $fechainicio]);
                $bandera = 1;
            }
            if ($fechafinal != '') {
                if ($fechafinal >= $fechainicio) {
                    array_push($consulta, ['v.fecha', '<=', $fechafinal]);
                    $bandera = 1;
                }
            }
            $fkidgrupo = $request->fkidgrupo;
            $idusuario = $request->idusuario;
            
            if ($fkidgrupo == 0 || $fkidgrupo == 3) {
                array_push($consulta, ['ve.fkidusuario', '=', $idusuario]);
                $bandera = 1;
            }
            
            if ($bandera == 1) {
                array_push($consulta, ['v.fkidvehiculo', '=', $idvehiculo]);
            }

            $data = DB::connection($connection)
                    ->table('venta as v')
                    ->join('vendedor as ve', 'v.fkidvendedor', '=', 've.idvendedor')
                    ->join('ventadetalle as vd', 'v.idventa', '=', 'vd.fkidventa')
                    ->join('almacenproddetalle as apd', 'vd.fkidalmacenproddetalle', '=', 'apd.idalmacenproddetalle')
                    ->join('producto as p', 'apd.fkidproducto', '=', 'p.idproducto')
                    ->select('v.idventa', 'v.fecha', 'v.mtototventa as total',
                            'p.idproducto', 'p.descripcion as producto',
                            'vd.cantidad', 'vd.preciounit as precio', 'vd.factor_desc_incre as descuento'
                        )
                    ->where(($bandera == 1)?$consulta:[['v.fkidvehiculo', '=', $idvehiculo]])
                    ->whereNull('v.deleted_at')
                    ->orderBy($order, 'asc')
                    ->get();

            $fecha = date('d').'/'.date('m').'/'.date('Y').' '.date('H').':'.date('i');

            $conf = new ConfigCliente();
            $conf->setConnection($connection);
            $config = $conf->first();
            $config->decrypt();

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.ventahistoricovehiculo', [
                'fecha' => $fecha,
                'cliente' => $cliente,
                'placa' => $placa,
                'data' => $data,
                'logo' => $config->logoreporte
            ]);
            
            //$pdf->setPaper('A4', 'landscape');

            $pdf->output();
            $dom_pdf = $pdf->getDomPDF();

            $canvas = $dom_pdf->get_canvas();
            $canvas->page_text(450, 825, "Pag. {PAGE_NUM} de {PAGE_COUNT}", null, 8, array(0, 0, 0));

            $canvas->page_text(50, 825, $user, null, 8, array(0, 0, 0));

            if ($exportar == 'P') { 
                return $pdf->download('ventahistoricovehiculo.pdf');
            }

            if ($exportar == 'E') { 
                return Excel::download(new VentaHistoricoVehiculoExport($data, $placa, $cliente), 'venta_historico_vehiculo.xlsx');
            }

            return $pdf->stream('ventahistoricovehiculo.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }
}
