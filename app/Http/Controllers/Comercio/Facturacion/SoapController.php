<?php

namespace App\Http\Controllers\Comercio\Facturacion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Artisaninweb\SoapWrapper\SoapWrapper;
use Spatie\ArrayToXml\ArrayToXml;
use Carbon\Carbon;
use DOMDocument;
use SimpleXMLElement;
use PharData;
use Phar;
use DirectoryIterator;
use Iterator;
use stdClass;


class SoapController extends Controller
{


    protected $soapWrapper;
    protected $sincc;
    protected $servicioFacturaOperacionesComp;
    protected $servicioFacturaCompEstandar;
    protected $tiposFactura;
    protected $operacionesGenerarCUF;
    protected $operacionesSincronizacion;
    protected $servicioFacturaSolicitudCufd;
    protected $servicioSincronizacionFechaHora;
    protected $servicioFacturaElectronicaEstandar;
    protected $servicioEventosSignificativos;
    protected $operacionesEnvioPaquete;
    protected $operacionesEnvioFactura;
    protected $request;

    public function __construct(Request $request)
    {
        $soapWrapper = new SoapWrapper();
        $this->soapWrapper = $soapWrapper;
        $this->request=$request;
        $this->sincc = new ServicioFacturaSincronizacion($soapWrapper);
        $this->servicioFacturaOperacionesComp = new ServicioFacturaOperacionesComp($soapWrapper);
        $this->servicioFacturaCompEstandar = new ServicioFacturaCompEstandar($soapWrapper);
        $this->tiposFactura = new TiposFactura();
        $this->operacionesGenerarCUF = new OperacionesGenerarCUF();
        $this->operacionesSincronizacion = new OperacionesSincronizacion($soapWrapper);
        $this->servicioFacturaSolicitudCufd = new ServicioFacturaSolicitudCufd($soapWrapper);
        $this->servicioSincronizacionFechaHora = new ServicioSincronizacionFechaHora($soapWrapper);
        $this->servicioFacturaElectronicaEstandar = new ServicioFacturaElectronicaEstandar($soapWrapper);
        $this->operacionesEnvioPaquete = new OperacionesEnvioPaquete($soapWrapper);
        $this->operacionesEnvioFactura = new OperacionesEnvioFactura($soapWrapper);
    }
    /*public function generarCuf(
        $nit,
        $fechahora,
        $sucursal,
        $modalidad,
        $tipoemision,
        $codigodocfiscal,
        $tipodocsector,
        $nrofactura,
        $pos
    ) {

        $nit = $this->operacionesPersonales->rellenarCerosIzquierda($nit, 13);
        //$fechahora = $this->dateToString();
        $fechahora = $this->operacionesPersonales->dateToString2($fechahora);
        $sucursal = $this->operacionesPersonales->rellenarCerosIzquierda($sucursal, 4);
        $modalidad = $this->operacionesPersonales->rellenarCerosIzquierda($modalidad, 1);
        $tipoemision = $this->operacionesPersonales->rellenarCerosIzquierda($tipoemision, 1);
        $codigodocfiscal = $this->operacionesPersonales->rellenarCerosIzquierda($codigodocfiscal, 1);
        $tipodocsector = $this->operacionesPersonales->rellenarCerosIzquierda($tipodocsector, 2);
        $nrofactura = $this->operacionesPersonales->rellenarCerosIzquierda($nrofactura, 8);
        $pos = $this->operacionesPersonales->rellenarCerosIzquierda($pos, 4);
        $result = $nit . $fechahora . $sucursal . $modalidad . $tipoemision . $codigodocfiscal . $tipodocsector . $nrofactura . $pos;
        $result2 = $this->operacionesPersonales->calculaDigitoMod11($result, 1, 9, false);
        $result3 = $result . $result2;
        return $this->operacionesPersonales->dec2hex($result3);
    }*/
    ///////////////////////////////Cargar todos los servicios///////////////////////////////////
    public function cargarServicio()
    {
        $this->soapWrapper->add('operaciones', function ($service) {
            $service
                ->wsdl('https://presiatservicios.impuestos.gob.bo:39117/FacturacionOperaciones?wsdl')
                ->trace(true)
                ->options(['user_agent' => 'PHPSoapClient']);
        });


        $this->soapWrapper->add('sincronizar', function ($service) {
            $service
                ->wsdl('https://presiatservicios.impuestos.gob.bo:39266/FacturacionSincronizacionFechaHora?wsdl')
                ->trace(true)
                ->options(['user_agent' => 'PHPSoapClient']);
        });


        $this->soapWrapper->add('solicitar', function ($service) {
            $service
                ->wsdl('https://presiatservicios.impuestos.gob.bo:39268/FacturacionSolicitudCufd?wsdl')
                ->trace(true)
                ->options(['user_agent' => 'PHPSoapClient']);
        });
        $this->soapWrapper->add('computarizadaEstandar', function ($service) {
            $service
                ->wsdl('https://presiatservicios.impuestos.gob.bo:39112/FacturaComputarizadaEstandar?wsdl')
                ->trace(true)
                ->options(['user_agent' => 'PHPSoapClient']);
        });
        $this->soapWrapper->add('electronicaEstandar', function ($service) {
            $service
                ->wsdl('https://presiatservicios.impuestos.gob.bo:39113/FacturaElectronicaEstandar?wsdl')
                ->trace(true)
                ->options(['user_agent' => 'PHPSoapClient']);
        });
        $this->soapWrapper->add('sincronizacion', function ($service) {
            $service
                ->wsdl('https://presiatservicios.impuestos.gob.bo:39118/FacturacionSincronizacion?wsdl')
                ->trace(true)
                ->options(['user_agent' => 'PHPSoapClient']);
        });
    }

    //////////////////////sincronizacion fecha y hora////////////
    /*
    ////////////////////////////CUFD/////////////////////////////////////
    }*/

    public function  index()
    {
        //phpinfo();

        $this->cargarServicio();
        if ($this->verificarConexion() == true) {
            //$date = date("Y-m-d H:m:s:v");
            //dd($date);
            $codigoAmbiente = 2;
            $codigoDocumentoFiscal = 1;
            $codigoDocumentoSector = 1;
            $codigoEmision = 2;
            $codigoPuntoVenta = 0;
            $cuis = '9182DF66';
            $nit = 4698512017;
            $codigoSistema = "93CD76A8B1F";
            $codigoModalidad = 2;
            $codigoSucursal = 0;
            $codigoPuntoVenta = 0;
            $numeroFactura = 20;
            //return $this->request->arrayventadetalle;

            $asd = $this->servicioSincronizacionFechaHora->sincronizarFechaHora($codigoAmbiente, $codigoPuntoVenta, $codigoSistema, $codigoSucursal, $cuis, $nit);
            $horaFechaSinc = $asd;
            $fechaModificada = $this->servicioSincronizacionFechaHora->sincronizarFechaHora1($codigoAmbiente, $codigoPuntoVenta, $codigoSistema, $codigoSucursal, $cuis, $nit);
            //dd($horaFechaSinc);
            $consultaPuntoVenta = $this->servicioFacturaOperacionesComp->consultaPuntoVenta(
                $codigoAmbiente,
                $codigoSistema,
                $codigoSucursal,
                $cuis,
                $nit
            );
            //dd($consultaPuntoVenta);


            /* $consultaPV = json_decode(json_encode($consultaPuntoVenta), true);
            $consultaPV1 = $consultaPV['RespuestaConsultaPuntoVenta']['listaPuntosVentas'];
            $consultaPV2 = count($consultaPV['RespuestaConsultaPuntoVenta']['listaPuntosVentas']);
            */


            //dd($consultaPV);


            $cufd = $this->servicioFacturaSolicitudCufd->solicitarCufd(
                $codigoAmbiente,
                $codigoModalidad,
                $codigoPuntoVenta,
                $codigoSistema,
                $codigoSucursal,
                $cuis,
                $nit
            );

            //dd($cufd);
            $cufd = json_decode(json_encode($cufd), true);
            $cufd = $cufd['RespuestaCufd']['codigo'];
            //dd($cufd);
            //$cufd = "QUHCoUJNLsK/QTM2NDYzOUVGQ2dRS0pCVVVBRUE=MDAwMDcz";



            //dd($horaFechaSinc);


            /*//registrar punto venta
            $registroPuntoVenta = $this->servicioFacturaOperacionesComp->registroPuntoVenta(
            $codigoAmbiente,
            $codigoModalidad,
            $codigoSistema,
            $codigoSucursal,
            1,
            $cuis,
            "En el campo",
            $nit,
            "Punto 200"
        );
        dd($registroPuntoVenta);*/

            ///cierre///
            /*$cierrePuntoVenta = $this->servicioFacturaOperacionesComp->cierrePuntoVenta(
            $codigoAmbiente,
            156,
            $codigoSistema,
            $codigoSucursal,
            $cuis,
            $nit
        );*/
            //$sincActividades=$this->sincc->sincronizarActividades($codigoAmbiente)
            /*$descripcion = "nuevo aire";
        $recepcionSolicitudNuevoValorProducto = $this->sincc->recepcionSolicitudNuevoValorProducto(
            $codigoAmbiente,
            $codigoSistema,
            $codigoSucursal,
            $descripcion,
            $cuis,
            $nit
        );*/
            /*$codigoSolicitud = json_decode(json_encode($recepcionSolicitudNuevoValorProducto), true);
        $codigoSolicitud = $codigoSolicitud['RespuestaSolicitudNuevoValor']['codigoSolicitud'];
        $validacionSolicitudNuevoValor = $this->sincc->validacionSolicitudNuevoValorProducto(
            $codigoAmbiente,
            $codigoSistema,
            $codigoSolicitud,
            $codigoSucursal,
            $cuis,
            $nit
        );
        dd($validacionSolicitudNuevoValor);*/
            ////Agregar un nuevo producto////
            /*$recepcionProducto=$this->sincc->recepcionSolicitudNuevoValorProducto($codigoAmbiente,$codigoSistema,
        $codigoSucursal,"Heladera 2343",$cuis,$nit);
        $codigoRecepcionProducto=json_decode(json_encode($recepcionProducto),true);
        $codigoRecepcionProducto=$codigoRecepcionProducto['RespuestaSolicitudNuevoValor']['codigoSolicitud'];
        $validacionSolicitudProducto=$this->sincc->validacionSolicitudNuevoValorProducto($codigoAmbiente,$codigoSistema,
        $codigoRecepcionProducto,$codigoSucursal,$cuis,$nit);
        dd($validacionSolicitudProducto);*/
            /////////////////Sincrinozacion//////////////
            /*$sincronizarListaLeyendas = $this->sincc->sincronizarListaLeyendasFactura(
            $codigoAmbiente,
            0,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cuis,
            $nit
        );
        //dd($sincronizarListaLeyendas);

        $sincronizarParametricaEventos = $this->sincc->sincronizarParametricaEventosSignificativos(
            $codigoAmbiente,
            0,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cuis,
            $nit
        );
        dd($sincronizarParametricaEventos);
        $sincronizarParametricaMotivoAnulacion=$this->sincc->sincronizarParametricaMotivoAnulacion(
            $codigoAmbiente,
            0,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cuis,
            $nit
        );
        dd($sincronizarParametricaMotivoAnulacion);
        //sincronizar lista ed productos y servicios
        $sincronizarListProductosServicios = $this->sincc->sincronizarListaProductosServicios(
            $codigoAmbiente,
            0,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cuis,
            $nit
        );
        //dd($sincronizarListProductosServicios);

        $sincronizarActividades = $this->sincc->sincronizarActividades(
            $codigoAmbiente,
            0,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cuis,
            $nit
        );
        $sincronizarTipoMoneda = $this->sincc->sincronizarParametricaTipoMoneda(
            $codigoAmbiente,
            0,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cuis,
            $nit
        );*/
            //dd($sincronizarTipoMoneda);
            $sincronizarActividades = $this->operacionesSincronizacion->seleccionar(
                $codigoAmbiente,
                0,
                $codigoPuntoVenta,
                $codigoSistema,
                $codigoSucursal,
                $cuis,
                $nit,
                "sincronizarActividades"
            );

            //dd($sincronizarActividades);        
       
            for ($i=0; $i < 2; $i++) { 
                $asd = $this->servicioSincronizacionFechaHora->sincronizarFechaHora($codigoAmbiente, $codigoPuntoVenta, $codigoSistema, $codigoSucursal, $cuis, $nit);
            $horaFechaSinc = $asd;
            $numeroFactura++;

           

         
          
            $cuf = $this->operacionesGenerarCUF->generarCuf(
                $nit,
                $horaFechaSinc,
                $codigoSucursal,
                $codigoModalidad,
                $codigoEmision,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $numeroFactura,
                0
            );
            if($cuf==0){
                dd($this->operacionesGenerarCUF->probarcufmalo($nit,
                $horaFechaSinc,
                $codigoSucursal,
                $codigoModalidad,
                $codigoEmision,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $numeroFactura,
                0));
            }
           
           

           
            //dd($cuf);
            $this->objeto = new stdClass();
            $this->objeto->codigoProductoSin = 7596328;
            $this->objeto->codigoProducto = "SLD-34";
            $this->objeto->descripcion = "Aplicacion 1";
            $this->objeto->cantidad =3;
            $this->objeto->unidadMedida =22;
            $this->objeto->precioUnitario =5;
            $this->objeto->subTotal =15;

            $this->objeto1 = new stdClass();
            $this->objeto1->codigoProductoSin = 7596328;//83141
            $this->objeto1->codigoProducto = "SLD-35";
            $this->objeto1->descripcion = "Aplicacion 2";
            $this->objeto1->cantidad = 4;
            $this->objeto1->unidadMedida =6;
            $this->objeto1->precioUnitario =6;
            $this->objeto1->subTotal =24;


            $listaProductos = array($this->objeto, $this->objeto1);
            //dd(json_encode($array1));
           
           
            
               
                /*$factura = $this->operacionesEnvioFactura->crearFacturaEstandaryEnviar(
                    $listaProductos,
                    $codigoAmbiente,
                    $codigoDocumentoFiscal,
                    $codigoEmision,
                    $codigoModalidad,
                    $codigoSistema,
                    $cuis,
                    $horaFechaSinc,
                    $nit,
                    $numeroFactura,
                    $cuf,
                    $cufd,
                    $codigoSucursal,
                    "El deber23",
                    $codigoPuntoVenta,
                    $horaFechaSinc,
                    "Control Tributario",
                    5,
                    99004,
                    "PMamani4",
                    1,
                    39,
                    688,
                    1,
                    39,
                    "Ley N° 453: Tienes derecho a recibir información sobre las características y contenidos de los servicios que utilices.",
                    "pperez",
                    1,
                    620100,
                    83141,
                    "SLD-34",
                    "Vaso",
                    10,
                    58,
                    2.5,
                    25
                );
              
            dd($factura);
           */
              
            
           
            
            
            $xmlfinal2 = $this->tiposFactura->facturaEstandar(
                $listaProductos,
                $nit,
                $numeroFactura,
                $cuf,
                $cufd,
                $codigoSucursal,
                "El deber23",
                $codigoPuntoVenta,
                $horaFechaSinc,
                "Control Tributario",
                5,
                99004,
                "PMamani4",
                1,
                39,
                688,//688
                1,
                39,
                "Ley N° 453: Tienes derecho a recibir información sobre las características y contenidos de los servicios que utilices.",
                "pperez",
                1,
                620100,//620100
                83141,
                "SLD-34",
                "Vaso",
                10,
                58,
                2.5,
                25
            );
            $codificado = base64_encode($xmlfinal2);

            $gzdata = gzencode($codificado);

            $archivofinal = base64_encode($gzdata);
            $hashArchivo = hash('sha256', $archivofinal);

            /*$recepcionFactura = $this->servicioFacturaCompEstandar->recepcionFacturaComputarizadaEstandar(
                    $archivofinal,
                    $codigoAmbiente,
                    $codigoDocumentoFiscal,
                    $codigoDocumentoSector,
                    $codigoEmision,
                    $codigoModalidad,
                    $codigoPuntoVenta,
                    $codigoSistema,
                    $codigoSucursal,
                    $cufd,
                    $cuis,
                    $horaFechaSinc,
                    $hashArchivo,
                    $nit
                );

                //dd($recepcionFactura);
                $codigoRecepcionFactura = json_decode(json_encode($recepcionFactura), true);
                $codigoRecepcionFactura1 = $codigoRecepcionFactura['RespuestaServicioFacturacion']['codigoRecepcion'];
                //dd($codigoRecepcionFactura);
                sleep(1);
                $validarFactura = $this->servicioFacturaCompEstandar->validacionRecepcionFacturaComputarizadaEstandar(
                    $codigoAmbiente,
                    $codigoDocumentoFiscal,
                    $codigoDocumentoSector,
                    $codigoEmision,
                    $codigoModalidad,
                    $codigoPuntoVenta,
                    $codigoRecepcionFactura1,
                    $codigoSistema,
                    $codigoSucursal,
                    $cufd,
                    $cuis,
                    $nit
                );
                dd($validarFactura);
            }
            dd($validarFactura);

            $codigoRecepcionFacturaValida = json_decode(json_encode($validarFactura), true);
            $codigoRecepcionFacturaValida = $codigoRecepcionFacturaValida['RespuestaServicioFacturacion']['codigoRecepcion'];
            //dd($codigoRecepcionFacturaValida."cuf-".$cuf);
            $anulacion = $this->servicioFacturaCompEstandar->anulacionFacturaCompEstandar(
                $codigoAmbiente,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $codigoEmision,
                $codigoModalidad,
                912,
                $codigoPuntoVenta,
                $codigoSistema,
                $codigoSucursal,
                $cuf,
                $cufd,
                $cuis,
                $nit,
                $numeroFactura
            );
            //dd($anulacion);
            $codigoAnulacionFactura = json_decode(json_encode($anulacion), true);
            $codigoAnulacionFactura = $codigoAnulacionFactura['RespuestaServicioFacturacion']['codigoRecepcion'];
            //dd($codigoAnulacionFactura);
            //validacion anulacion
            $validarFacturaAnulacion = $this->servicioFacturaCompEstandar->validacionAnulacionFacturaComputarizadaEstandar(
                $codigoAmbiente,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $codigoEmision,
                $codigoModalidad,
                912,
                $codigoPuntoVenta,
                $codigoAnulacionFactura,
                $codigoSistema,
                $codigoSucursal,
                $cuf,
                $cufd,
                $cuis,
                $nit,
                $numeroFactura
            );

            dd($validarFacturaAnulacion);*/

            //dd("fin");
            $this->operacionesEnvioPaquete->creacionFacturaOffline($codificado);
           
        }
        //dd("asd");
        $operacionFinal=$this->operacionesEnvioPaquete->envioPaquetes(
            $codigoAmbiente,
            $codigoDocumentoFiscal,
            $codigoDocumentoSector,
            $codigoEmision,
            $codigoModalidad,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cufd,
            $cuis,
            $horaFechaSinc,
            $nit
        );
        dd($operacionFinal);
        
         

            /*$this->operacionesEnvioPaquete->crearFacturaOffline($this->operacionesEnvioPaquete->numeroFactura(), $codificado);
            $numeroPaquete = $this->operacionesEnvioPaquete->agregarFacturasTAR($this->operacionesEnvioPaquete->numeroPaquete());


            dd($this->operacionesEnvioPaquete->sendGZtoSIN(
                $codigoAmbiente,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $codigoEmision,
                $codigoModalidad,
                $codigoPuntoVenta,
                $codigoSistema,
                $codigoSucursal,
                $cufd,
                $cuis,
                $horaFechaSinc,
                $nit
            ));*/


            /*$codificadoPaquete = base64_encode(file_get_contents("facturas/" . $numeroPaquete . ".tar.gz"));
            $hashPaquete = hash('sha256', $codificadoPaquete);
            $recepcionPaquete = $this->servicioFacturaCompEstandar->recepcionPaqueteFacturaComputarizadaEstandar(
                $codificadoPaquete,
                $codigoAmbiente,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $codigoEmision,
                $codigoModalidad,
                $codigoPuntoVenta,
                $codigoSistema,
                $codigoSucursal,
                $cufd,
                $cuis,
                $horaFechaSinc,
                $hashPaquete,
                $nit
            );
            $recepcionPaquete = json_decode(json_encode($recepcionPaquete), true);
            $codigorecepcionPaquete = $recepcionPaquete['RespuestaServicioFacturacion']['codigoRecepcion'];
            sleep(1);
            $validacionRecepcionPaquete = $this->servicioFacturaCompEstandar->validacionRecepcionPaqueteFacturaComputarizadaEstandar(
                $codigoAmbiente,
                $codigoDocumentoFiscal,
                $codigoDocumentoSector,
                $codigoEmision,
                $codigoModalidad,
                $codigoPuntoVenta,
                $codigorecepcionPaquete,
                $codigoSistema,
                $codigoSucursal,
                $cufd,
                $cuis,
                $nit
            );
            //$this->eliminarFacturasF();
            dd($validacionRecepcionPaquete);*/
        } else {
            dd("problemas de conexion");
        }
    }
    /*public function creacionFacturaOffline($codificado){
        $this->operacionesEnvioPaquete->crearFacturaOffline($this->operacionesEnvioPaquete->numeroFactura(), $codificado);
    }
    public function envioPaquetes(
        $codigoAmbiente,
        $codigoDocumentoFiscal,
        $codigoDocumentoSector,
        $codigoEmision,
        $codigoModalidad,
        $codigoPuntoVenta,
        $codigoSistema,
        $codigoSucursal,
        $cufd,
        $cuis,
        $horaFechaSinc,
        $nit
    ) {  
        //$this->operacionesEnvioPaquete->crearFacturaOffline($this->operacionesEnvioPaquete->numeroFactura(), $codificado);
        $numeroPaquete = $this->operacionesEnvioPaquete->agregarFacturasTAR($this->operacionesEnvioPaquete->numeroPaquete());
        return $this->operacionesEnvioPaquete->sendGZtoSIN(
            $codigoAmbiente,
            $codigoDocumentoFiscal,
            $codigoDocumentoSector,
            $codigoEmision,
            $codigoModalidad,
            $codigoPuntoVenta,
            $codigoSistema,
            $codigoSucursal,
            $cufd,
            $cuis,
            $horaFechaSinc,
            $nit
        );
    }*/
    public function crearFactura(){
        $numeroFactura=$this->request->codigoVenta;
        $fechaVenta=$this->request->fechaVenta;
        
        return $this->request->all();
    }


    public function verificarConexion()
    {
        try {
            $this->servicioSincronizacionFechaHora->verificarComunicacion1();
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }


    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
    //////////CUF///////
    public function rellenarCerosIzquierda($numero, $longitud)
    {

        return str_pad($numero, $longitud, "0", STR_PAD_LEFT);
    }

    public function calculardigitoMod11V2($numeros)
    {
        $array = str_split($numeros);

        $reversa = array_reverse($array);
        $newArray = [];
        $mult = 1;
        foreach ($reversa as $num) {
            switch ($mult) {
                case 7:
                    $mult = 2;
                    break;
                default:
                    $mult++;
                    break;
            }
            array_push($newArray, $num * $mult);
        }
        $suma = 0;
        foreach ($newArray as $dato) {
            $suma = $dato + $suma;
        }

        $suma = $suma % 11;
        $suma = 11 - $suma;
        return $suma;
    }

    public function calculaDigitoMod11($numDado, $numDig, $limMult, $x10)
    {
        if (!$x10) {
            $numDig = 1;
        }
        $dado = $numDado;
        for ($n = 1; $n <= $numDig; $n++) {
            $soma = 0;
            $mult = 2;
            for ($i = strlen($dado) - 1; $i >= 0; $i--) {
                $soma += $mult * intval(substr($dado, $i, 1));
                if (++$mult > $limMult) {
                    $mult = 2;
                }
            }
            if ($x10) {
                $dig = fmod(fmod(($soma * 10), 11), 10);
            } else {
                $dig = fmod($soma, 11);
                if ($dig == 10) {
                    $dig = "X";
                }
            }
            $dado .= strval($dig);
        }
        return substr($dado, strlen($dado) - $numDig);
    }

    public function getModulo11($cadena)
    {
        $mod11 = $this->calculaDigitoMod11($cadena, 1, 9, false);
        return $mod11;
    }

    public function dateToString()
    {
        $date = date("Y-m-d H:m:s:v");
        $date = str_replace(" ", "", $date);
        $date = str_replace("-", "", $date);
        $date = str_replace(":", "", $date);
        return $date;
    }
    public function dateToString2($date)
    {
        $date = str_replace(" ", "", $date);
        $date = str_replace("-", "", $date);
        $date = str_replace("T", "", $date);
        $date = str_replace(":", "", $date);
        $date = str_replace(".", "", $date);
        return $date;
    }
    public function dec2hex($number)
    {
        $hexvalues = array(
            '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'
        );
        $hexval = '';
        while ($number != '0') {
            $hexval = $hexvalues[bcmod($number, '16')] . $hexval;
            $number = bcdiv($number, '16', 0);
        }
        return $hexval;
    }
    public function generarCuf(
        $nit,
        $fechahora,
        $sucursal,
        $modalidad,
        $tipoemision,
        $codigodocfiscal,
        $tipodocsector,
        $nrofactura,
        $pos
    ) {
        $nit = $this->rellenarCerosIzquierda($nit, 13);
        //$fechahora = $this->dateToString();
        $fechahora = $this->dateToString2($fechahora);
        $sucursal = $this->rellenarCerosIzquierda($sucursal, 4);
        $modalidad = $this->rellenarCerosIzquierda($modalidad, 1);
        $tipoemision = $this->rellenarCerosIzquierda($tipoemision, 1);
        $codigodocfiscal = $this->rellenarCerosIzquierda($codigodocfiscal, 1);
        $tipodocsector = $this->rellenarCerosIzquierda($tipodocsector, 2);
        $nrofactura = $this->rellenarCerosIzquierda($nrofactura, 8);
        $pos = $this->rellenarCerosIzquierda($pos, 4);
        $result = $nit . $fechahora . $sucursal . $modalidad . $tipoemision . $codigodocfiscal . $tipodocsector . $nrofactura . $pos;
        $result2 = $this->calculaDigitoMod11($result, 1, 9, false);
        $result3 = $result . $result2;
        return $this->dec2hex($result3);

    }
}
