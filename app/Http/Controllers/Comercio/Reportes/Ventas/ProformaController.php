<?php

namespace App\Http\Controllers\Comercio\Reportes\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Config\ConfigCliente;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;

use PDF;

class ProformaController extends Controller
{
    public function recibo(Request $request)
    {
        
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $user = $request->usuario;

            $fecha = date('d').'/'.date('m').'/'.date('Y');
            $hora = date('H').':'.date('i').':'.date('s');

            $permisos = json_decode($request->permisos);

            $pdf = PDF::loadView('sistema.src.comercio.reportes.pdf.ventas.reciboproforma', [
                'usuario' => $user,
                'fecha' => $fecha,
                'hora' => $hora,
                'venta' => json_decode($request->venta_first),
                'detalle' => json_decode($request->venta_detalle),
                'pago' => json_decode($request->planpago),
                'permisos' => $permisos,
                'logo' => json_decode($request->config_cliente)->logoreporte,
                'clienteesabogado' => json_decode($request->config_cliente)->clienteesabogado?'A':'V',
            ]);

            return $pdf->stream('reciboproforma.pdf');

        } catch (DecryptException $e) {
            return "Error al generar reporte";
        }
        
    }
}
