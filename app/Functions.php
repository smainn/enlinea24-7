<?php

namespace App;

use App\Models\Contable\Comprobante;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Functions extends Model
{
    public function obtener_Archivo_Temporal_PlanCuenta($login, $connection)
    {
        $hoy = date("Y-m-d H:i:s");
        $hoy = str_replace(' ', '_', $hoy);
        $hoy = str_replace('-', '_', $hoy);
        $hoy = str_replace(':', '_', $hoy);

        $archivo_temporal = "archivo_temporal_" . $login . '_' . $hoy;

        $query = "CREATE TABLE $archivo_temporal (
            idcuentaplantemp serial NOT NULL,
            codcuenta text NOT NULL,
            nombre text NOT NULL,
            debe double precision DEFAULT 0,
            haber double precision DEFAULT 0,
            saldo double precision DEFAULT 0,
            esctadetalle character(1) DEFAULT 'N'::bpchar NOT NULL,
            fkidcuentaplantipo integer NOT NULL,
            fkidcuentaplantemppadre integer,
            created_at timestamp(0) without time zone,
            updated_at timestamp(0) without time zone,
            deleted_at timestamp(0) without time zone
        );";

        DB::connection($connection)->statement($query);

        $query = "INSERT INTO $archivo_temporal(idcuentaplantemp,codcuenta,nombre,esctadetalle,fkidcuentaplantemppadre,fkidcuentaplantipo)  
            SELECT idcuentaplan,codcuenta,nombre,esctadetalle,fkidcuentaplanpadre,fkidcuentaplantipo 
            FROM cuentaplan 
            ORDER BY idcuentaplan;";

        DB::connection($connection)->statement($query);

        return $archivo_temporal;
    }

    public function obtener_Archivo_Temporal_EERR($login, $connection)
    {
        $hoy = date("Y-m-d H:i:s");
        $hoy = str_replace(' ', '_', $hoy);
        $hoy = str_replace('-', '_', $hoy);
        $hoy = str_replace(':', '_', $hoy);

        $archivo_temporal = "eerrtemp_" . $login . $hoy;

        $query = "CREATE TABLE public.$archivo_temporal (
            ideerrtemporal serial NOT NULL,
            codcuenta text,
            descripcion text NOT NULL,
            valor double precision DEFAULT 0,
            created_at timestamp(0) without time zone,
            updated_at timestamp(0) without time zone,
            deleted_at timestamp(0) without time zone
        );";

        DB::connection($connection)->statement($query);

        return $archivo_temporal;
    }

    public function obtener_Archivo_Temporal_LibroMayor($login, $connection)
    {
        $hoy = date("Y-m-d H:i:s");
        $hoy = str_replace(' ', '_', $hoy);
        $hoy = str_replace('-', '_', $hoy);
        $hoy = str_replace(':', '_', $hoy);

        $archivo_temporal = "archivo_temporal_libro_mayor_" . $login . '_' . $hoy;

        $query = "CREATE TABLE $archivo_temporal(
            idlibmay serial NOT NULL,
            idcuenta integer NOT NULL,
            codcuenta text NOT NULL,
            nombre text NOT NULL,
            saldoAnterior double precision DEFAULT 0,
            fecha date,
            tipo text,
            numero int,
            glosa text,
            concepto text,
            cheque text,
            debe double precision DEFAULT 0,
            haber double precision DEFAULT 0,
            saldo double precision DEFAULT 0,
            created_at timestamp(0) without time zone,
            updated_at timestamp(0) without time zone,
            deleted_at timestamp(0) without time zone
        );";

        DB::connection($connection)->statement($query);

        return $archivo_temporal;
    }

    public function borrar_Archivo_temporal($tabla, $connection)
    {
        $query = "DROP TABLE IF EXISTS $tabla;";
        DB::connection($connection)->statement($query);
    }

    public function libroMayorVarias($array_idcuenta, $fechainicio, $fechafin, $idmoneda, $saldo_mayor, $connection, $archivo_temporal_libroMayor)
    {
        $saldoTotal = 0;
        $saldoAnt = 0;

        foreach ($array_idcuenta as $cuenta) {
            if ($saldo_mayor == true) {

                $gestion = DB::connection($connection)
                    ->table('gestioncontable')
                    ->select('fechaini')
                    ->where('estado', '>=', 'A')
                    ->whereNull('deleted_at')
                    ->first();

                if ($gestion != null) {
                    $fechaFinSaldo = date("Y-m-d", strtotime($gestion->fechaini . "- 1 days")); //resta un dia

                    $saldoAnt = $this->libroMayorUnaCuenta($cuenta, $gestion->fechaini, $fechaFinSaldo, $idmoneda, 0, false, false, '', $connection, $archivo_temporal_libroMayor);
                }
            }
            $saldo = $this->libroMayorUnaCuenta($cuenta, $fechainicio, $fechafin, $idmoneda, $saldoAnt, true, false, '', $connection, $archivo_temporal_libroMayor);

            $saldoTotal += $saldo;
        }

        return $saldoTotal;
    }

    public function libroMayorUnaCuenta($idcuenta, $fechainicio, $fechafin, $idmoneda, $saldoAnt, $escribirTiempo, $paraBG_EERR, $archTempoCtaPlanTemp, $connection, $archivo_temporal_libroMayor)
    {
        $saldoCuenta = $saldoAnt;

        $comprobante = DB::connection($connection)
            ->table('comprobante as c')
            ->join('comprobantetipo as ct', 'c.fkidcomprobantetipo', '=', 'ct.idcomprobantetipo')
            ->select(
                'c.idcomprobante',
                'c.fecha',
                'c.glosa',
                'c.nrochequetarjeta',
                'c.fkidmoneda',
                'c.tipocambio',
                'ct.descripcion as tipocomprobante',
                'c.codcomprobante'
            )
            ->where('c.fecha', '>=', $fechainicio)
            ->where('c.fecha', '<=', $fechafin)
            ->where('c.contabilizar', 'S')
            ->whereNull('c.deleted_at')
            ->whereNull('ct.deleted_at')
            ->orderBy('c.fecha', 'asc')
            //->distinct('c.idcomprobante')
            ->get();        
        $k_saldo = 0;

        foreach ($comprobante as $c) {

            if ($paraBG_EERR == true) { //si se requiere LM para BG o EERR

                $det_comp = DB::connection($connection)
                    ->table('comprobantecuentadetalle as compdet')
                    ->join('cuentaplan as cp', 'compdet.fkidcuentaplan', '=', 'cp.idcuentaplan')
                    ->join('cuentaplantipo as cpt', 'cp.fkidcuentaplantipo', '=', 'cpt.idcuentaplantipo')
                    ->select(
                        DB::raw('SUM(compdet.debe) as debe'),
                        DB::raw('SUM(compdet.haber) as haber'),
                        'cp.idcuentaplan',
                        'compdet.glosamenor',
                        'cp.codcuenta',
                        'cp.nombre',
                        'cpt.abreviacion'
                    )
                    ->where('compdet.fkidcomprobante', '=', $c->idcomprobante)
                    ->where('compdet.fkidcuentaplan', '=', $idcuenta)
                    ->whereNull('compdet.deleted_at')
                    ->groupBy('cp.idcuentaplan', 'compdet.glosamenor', 'cp.codcuenta', 'cp.nombre', 'cpt.abreviacion')
                    ->get();
            } else { //solo LM
                $det_comp = DB::connection($connection)
                    ->table('comprobantecuentadetalle as compdet')
                    ->join('cuentaplan as cp', 'compdet.fkidcuentaplan', '=', 'cp.idcuentaplan')
                    ->join('cuentaplantipo as cpt', 'cp.fkidcuentaplantipo', '=', 'cpt.idcuentaplantipo')
                    ->select(
                        'compdet.debe',
                        'compdet.haber',
                        'cp.idcuentaplan',
                        'compdet.glosamenor',
                        'cp.codcuenta',
                        'cp.nombre',
                        'cpt.abreviacion'
                    )
                    ->where('compdet.fkidcomprobante', '=', $c->idcomprobante)
                    ->where('compdet.fkidcuentaplan', '=', $idcuenta)
                    ->whereNull('compdet.deleted_at')
                    ->get();
            }

            // if ($det_comp != null) { // si hay registros de cuenta solicitada en detalle de comprobantes
            //     $detalle_comprobante = $det_comp;

            foreach ($det_comp as $detalle_comprobante) {

                $idcomprobante = $c->idcomprobante;
                $fechacomprobante = $c->fecha;
                $glosacomprobante = $c->glosa;
                $nrochequecomprobante = $c->nrochequetarjeta;
                $idmonedacomprobante = $c->fkidmoneda;
                $tipocambio = $c->tipocambio;
                $tipocomprobante = $c->tipocomprobante;
                $numerocomprobante = $c->codcomprobante;

                if ($paraBG_EERR == false) { //solo para libro mayor y no para BG y EERR
                    $debe = $detalle_comprobante->debe;
                    $haber = $detalle_comprobante->haber;
                    $idcuentaplan = $detalle_comprobante->idcuentaplan;
                    $glosamenor = $detalle_comprobante->glosamenor;

                    $codcuenta = $detalle_comprobante->codcuenta;
                    $namecuenta = $detalle_comprobante->nombre;
                } else { //para BG o EERR

                    if (is_null($detalle_comprobante->debe))
                        $debe = 0;
                    else
                        $debe = $detalle_comprobante->debe;

                    if (is_null($detalle_comprobante->haber))
                        $haber = 0;
                    else
                        $haber = $detalle_comprobante->haber;
                }

                if (($k_saldo == 0) && ($escribirTiempo == true)) { //inserta una sola vez el saldo anterior para cada cuenta

                    $query = "INSERT INTO $archivo_temporal_libroMayor(idcuenta,codcuenta,nombre,saldo) VALUES ('$idcuentaplan','$codcuenta','$namecuenta','$saldoCuenta');";
                    DB::connection($connection)->statement($query);
                    $k_saldo = 1;
                }

                if ($tipocambio == 0) $tipocambio = 1;

                if ($idmoneda != $idmonedacomprobante) { //si comprobante esta en la misma moneda solcitada
                    if (($idmonedacomprobante == 1) && ($idmoneda == 2)) { //de BS a $us
                        $debe = $debe / $tipocambio;
                        $haber = $haber / $tipocambio;
                    }
                    if (($idmonedacomprobante == 2) && ($idmoneda == 1)) { //de $us a Bs
                        $debe = $debe * $tipocambio;
                        $haber = $haber * $tipocambio;
                    }
                }

                $abreviacion = $detalle_comprobante->abreviacion;

                if (($abreviacion == 'A') || ($abreviacion == 'S') || ($abreviacion == 'G')) { //Activo,Costos,Gastos
                    $saldoCuenta = $saldoCuenta + ($debe - $haber);
                }

                if (($abreviacion == "P") || ($abreviacion == "I") || ($abreviacion == "C")) { //Pasivo,Ingresos,CapitalPatru
                    $saldoCuenta = $saldoCuenta + ($haber - $debe); //haber - debe
                }

                if ($escribirTiempo == true) {

                    $query = "INSERT INTO $archivo_temporal_libroMayor(idcuenta,codcuenta,nombre,saldoanterior,fecha,tipo,glosa,concepto,cheque,debe,haber,saldo, numero) 
                        VALUES ('$idcuentaplan','$codcuenta','$namecuenta','$saldoAnt','$fechacomprobante','$tipocomprobante',
                            '$glosacomprobante','$glosamenor','$nrochequecomprobante','$debe','$haber','$saldoCuenta', '$numerocomprobante');";

                    DB::connection($connection)->statement($query);
                }
                if ($paraBG_EERR == true) { //actualizar plan de cuenta temporal

                    $query = "UPDATE $archTempoCtaPlanTemp 
                        SET debe = $debe, haber = $haber, saldo = $saldoCuenta 
                        WHERE idCuentaplantemp=$idcuenta;";

                    DB::connection($connection)->statement($query);
                }
            }
        }
        return $saldoCuenta;
    }

    public function escribir_En_Temporal_ERR($cod_cuenta, $descripcion, $suma_total, $archivo_temporal, $connection)
    {
        $query = "INSERT INTO $archivo_temporal (codcuenta,descripcion,valor) 
            VALUES ('$cod_cuenta','$descripcion','$suma_total')";

        DB::connection($connection)->statement($query);

        return;
    }

    public function obtener_Saldo_De_Una_Cuenta($idcuenta, $archivo_temporal, $connection)
    {
        $saldo = 0;
        $tabla_temporal = DB::connection($connection)
            ->table($archivo_temporal)
            ->select('saldo')
            ->where('idcuentaplantemp', '=', $idcuenta)
            ->first();

        $saldo = ($tabla_temporal == null) ? 0 : $tabla_temporal->saldo;

        return $saldo;
    }

    public function estado_Resultados($fecha_inicio, $fecha_fin, $id_moneda, $archivo_temporal_cuentaPlan, $archivo_temporal_EERR, $connection)
    {
        $this->sumasAcumCtasDetalle_BG_EERR($fecha_inicio, $fecha_fin, $id_moneda, 2, $archivo_temporal_cuentaPlan, $connection);
        $this->sumarPorNivelessCuentasPrincipales($archivo_temporal_cuentaPlan, $connection);

        $queryEerr = "SELECT idconfigeerr,numaccion,operacion,descripcion,idcuentaplan,formula,valorporcentaje, esctaresult 
            FROM configeerr 
            ORDER BY idconfigeerr";

        $resultEerr = DB::connection($connection)->select($queryEerr);

        $sumTotal = 0;

        $resultAntesImp = 0; // BBB 19/05/2020

        foreach ($resultEerr as $eerr) {

            $idConfigEerrVar     = $eerr->idconfigeerr;
            $numAccionVar        = trim($eerr->numaccion);
            $operacionVar        = trim($eerr->operacion);
            $descripcionVar      = trim($eerr->descripcion);
            $idCuentaPlanVar     = $eerr->idcuentaplan;
            $formulaVar          = trim($eerr->formula);
            $valorPorcentajeVar  = $eerr->valorporcentaje;

            $varSiUtilAntImp     = $eerr->esctaresult;// BBB 19/05/2020

            $coddCuentaVar       = "";
            if ($idCuentaPlanVar > 0) {
                $queryPlan = "SELECT codcuenta FROM cuentaPlan WHERE idcuentaplan =  $idCuentaPlanVar ";
                
                $resultPlan = DB::connection($connection)->select($queryPlan);
                if (sizeof($resultPlan) > 0) {
                    $coddCuentaVar = trim($resultPlan[0]->codcuenta);
                }
            }

            if ($operacionVar == "+" || $operacionVar == "-") { //operacion
                if ($idCuentaPlanVar > 0) { //idPlanCuenta obtener libro mayor de cuenta
                    $saldoCta = $this->obtener_Saldo_De_Una_Cuenta($idCuentaPlanVar, $archivo_temporal_cuentaPlan, $connection);
                    //sumasAcumuladasDeUnaCuentaDetalle($filaEerr[4],$fechaIni,$fechaFin,$moneda,$archTempoCuentaPlan,0);    
                }
                if ($valorPorcentajeVar > 0) { //impuesto calcula porcentaje
                    $saldoCta = ($sumTotal * $valorPorcentajeVar) / 100;
                }
                $this->escribir_En_Temporal_ERR($coddCuentaVar, $descripcionVar, $saldoCta, $archivo_temporal_EERR, $connection);
                if ($operacionVar == "+") $sumTotal += $saldoCta;
                if ($operacionVar == "-") $sumTotal -= $saldoCta;
            }
            if ($operacionVar == "=") { //resultado operacion
                $this->escribir_En_Temporal_ERR($coddCuentaVar, $descripcionVar, $sumTotal, $archivo_temporal_EERR, $connection);

                if($varSiUtilAntImp == 'S'){ // BBB 19/05/2020
                    $resultAntesImp = $sumTotal;
                }

            }
        } //while
        return $resultAntesImp; // BBB 19/05/2020
    }


    public function sumasAcumCtasDetalle_BG_EERR($fecha_inicio, $fecha_fin, $idmoneda, $para, $archivo_temporal_cuentaPlan, $connection)
    {
        $idscuentas = [];
        if ($para == 1) {
            $queryCtaPlanDeta = "SELECT idcuentaplan 
                FROM cuentaplan 
                WHERE esctadetalle='S' and deleted_at is null and fkidcuentaplantipo IN 
                    (SELECT idcuentaplantipo 
                     FROM cuentaplantipo 
                     WHERE (abreviacion = 'A' or abreviacion = 'P' or abreviacion = 'C') and deleted_at is null) 
                ORDER BY codcuenta;"; //Act.Pasv,CapPat

            $idscuentas = DB::connection($connection)->select($queryCtaPlanDeta);
        } else {
            $queryCtaPlanDeta = "SELECT idcuentaplan 
                FROM cuentaplan 
                WHERE esctadetalle='S' and deleted_at is null and fkidcuentaplantipo IN 
                    (SELECT idcuentaplantipo 
                     FROM cuentaplantipo 
                     WHERE (abreviacion = 'I' or abreviacion = 'S' or abreviacion = 'G') and deleted_at is null) 
                ORDER BY codcuenta;"; //Ing.Costo,Gasto

            $idscuentas = DB::connection($connection)->select($queryCtaPlanDeta);
        }
        //dd($idscuentas);
        $archTempoLibMay = "";
        $saldoAnt = 0;
        $escribirTempoLM = false;
        $paraBG_EERR = true;

        foreach ($idscuentas as $row) {
            $this->libroMayorUnaCuenta($row->idcuentaplan, $fecha_inicio, $fecha_fin, $idmoneda, $saldoAnt, $escribirTempoLM, $paraBG_EERR, $archivo_temporal_cuentaPlan, $connection, $archTempoLibMay);
        }
    }

    public function sumarPorNivel($array, $nivel) {
        $count = count($array);
        $i = 0;
        $arr = [];
        while ($i < $count) {
            while ($i < $count && $array[$i]->nivelcod != $nivel) {
                array_push($arr, $array[$i]);
                $i++;
            }

            if ($i < $count) {
                $index = $i;
                array_push($arr, $array[$i]);
                $i++;
                $sum = 0;
                $niv = $nivel + 1;
                while ($i < $count && $array[$i]->nivelcod == $niv) {
                    $sum += $array[$i]->valor;
                    $i++;
                }
                $array[$index]->valor = $sum;
            }
        }
        return $arr;
    }

    public function obtnerArchTempoPlanCuenta($usuarLogin, $connection) {
        //se debe crear una copia de cuentaplantemporal con un nombre aleatorioe unico puede ser
        $hoy = date("Y-m-d H:i:s");
        $hoy = str_replace(' ', '_', $hoy);
        $hoy = str_replace('-', '_', $hoy);
        $hoy = str_replace(':', '_', $hoy);
        
        
        $archTempoCtaPlanTemp = "cuentaplantemp_" . $usuarLogin;//.$hoy;
        $query = "DROP TABLE IF EXISTS $archTempoCtaPlanTemp";
        DB::connection($connection)->select($query);
        //echo "Creando tenporal de plan de cuenta...->".$archTempoCtaPlanTemp."<-<br />";
        $query = "CREATE TABLE $archTempoCtaPlanTemp (
                    idcuentaplantemp serial NOT NULL,
                    codcuenta text NOT NULL,
                    nombre text NOT NULL,
                    debe double precision DEFAULT 0,
                    haber double precision DEFAULT 0,
                    saldo double precision DEFAULT 0,
                    esctadetalle character(1) DEFAULT 'N'::bpchar NOT NULL,
                    fkidcuentaplantipo integer NOT NULL,
                    fkidcuentaplantemppadre integer,
                    created_at timestamp(0) without time zone,
                    updated_at timestamp(0) without time zone,
                    deleted_at timestamp(0) without time zone
                    );";
        //$result = pg_query($query);
        $result = DB::connection($connection)->select($query);
        
        $query = "INSERT INTO $archTempoCtaPlanTemp(idcuentaplantemp,codcuenta,nombre,esctadetalle,fkidcuentaplantemppadre,fkidcuentaplantipo )  SELECT idcuentaplan,codcuenta,nombre,esctadetalle,fkidcuentaplanpadre,fkidcuentaplantipo FROM cuentaplan WHERE deleted_at is null ORDER BY idcuentaplan;";
        $result = DB::connection($connection)->statement($query);
        //$result = pg_query($query);
        return ($archTempoCtaPlanTemp);
    }

    public function obtnerArchTempoBG($usuarLogin, $connection){
        //se debe crear una copia de "EerrTemporal" con un nombre aleatorioe unico puede ser]}
        //temPlcCtaUsrFechaHora
        $hoy = date("Y-m-d H:i:s");
        $hoy = str_replace(' ', '_', $hoy);
        $hoy = str_replace('-', '_', $hoy);
        $hoy = str_replace(':', '_', $hoy);
        $archTempoBG = "balgentemp_" . $usuarLogin;// . $hoy;
        $query = "DROP TABLE IF EXISTS $archTempoBG";
        DB::connection($connection)->select($query);
        //echo "Creando tenporal para Balance Gral...->" .$archTempoBG. "<-<br />";
        $query = "CREATE TABLE public.$archTempoBG (
                    idbalgentemporal serial NOT NULL,
                    tipo character(1) NOT NULL,
                    codcuenta character(30),
                    descripcion text,
                    valor double precision,
                    tipocuenta character(1),
                    nivelcod integer NOT NULL,
                    created_at timestamp(0) without time zone,
                    updated_at timestamp(0) without time zone,
                    deleted_at timestamp(0) without time zone
                    );";
        //$result = pg_query($query);
        $result = DB::connection($connection)->statement($query);
        return ($archTempoBG);
    }

    public function borrarTempo($tabla, $connection){
        $query = "DROP TABLE IF EXISTS $tabla;";
        $result = DB::connection($connection)->statement($query);
        //$result = pg_query($query);
    }
     
     
    public function escribirEnTempoBalGeneral($tipo,$codcuenta,$descripcion,$valor,$tipocuenta,$nivelCodCuenta,$archTemp, $connection){
        //echo "Procesando escribir<br/>";
        $query = "INSERT INTO $archTemp (tipo,codcuenta,descripcion,valor,tipocuenta,nivelcod) VALUES  ('$tipo','$codcuenta','$descripcion','$valor','$tipocuenta','$nivelCodCuenta')";
        $result = DB::connection($connection)->statement($query);
        //$result = pg_query($query);
        return;
    }
     
    public function obtDigiNivel($cad, $niv) {//obtiene los digitos de un nivel 1.1.11.11.000
        $difResult = $cadNiv = "";
        $band=$contNiv=$i=$c=0;
        $n = strlen($cad);
        //echo 'CAD '
        while ($i < $n) {
            $cadNiv[$c] = $cad[$i];
            $c++;
            if ($cad[$i] == ".") {
                $contNiv++;
            }
            if($contNiv == $niv){
                $k = 0;$band=1;
                while($k < strlen($cadNiv)-1){
                    $difResult[$k]  = $cadNiv[$k];
                    $k++;
                }
                $i=$n;
            }else{
                if($cad[$i] == "."){
                    $cadNiv="";
                    $c=0;
                }
            }
            $i++;
        }//while
        if($band==0){
            $difResult  = $cadNiv;
        }
        return($difResult);
    }//fin obtener digitos
     
    public function obtenerNivelCeros($codCuenta){// formato 1.0.0.00.00
        $n =strlen($codCuenta);
        $niv = 0;
        $i=0;
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d1 = intval($dat);  
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d2 = intval($dat); 
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d3 = intval($dat); 
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d4 = intval($dat); 
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d5 = intval($dat); 
        if($d5==0 && $d4==0 && $d3==0 && $d2==0)  $niv = 1;
        elseif($d5==0 && $d4==0 && $d3==0)  $niv = 2;
        elseif($d5==0 && $d4==0 )  $niv = 3;
        elseif($d5==0 )  $niv = 4;
        else $niv=5;
        return($niv);
    }

    public function sumarPorNivelessCuentasPrincipales($archTempo, $connection){
        //Obtener debe, haber y saldo para todas las cuentas padres en el architempo
       //echo "<p><i>Procesando suma de cuentas principales</i></p>";
       $cont=0;
       $idCuentaN1 = $idCuentaN2 = $idCuentaN3 = $idCuentaN4 = 0;
       $queryPlanCta = "select idcuentaplantemp,codcuenta,debe,haber,saldo from $archTempo order by codcuenta;";
       //$resultPlancuenta = DB::connection($connection)->select($queryPlanCta);
       //echo '<p>TABLA ' . $archTempo . '</p>';
       $tabla = $archTempo . '';
       $resultPlancuenta = DB::connection($connection)->select($queryPlanCta);
       //dd($resultPlancuenta);
       //$resultPlancuenta = pg_query($queryPlanCta);
       $cantReg = count($resultPlancuenta);
       //$filaCtaPlanDeta = $cantReg > 0 ? $resultPlancuenta->first() : []; //obtiene 1er registro del cursor
       $codigoCuenta = $resultPlancuenta[0]->codcuenta;
       $niv1ant = $this->obtDigiNivel($codigoCuenta,1);//obtiene los digitos del 1er nivel   
       $sumDebe1  = $sumHaber1 = 0;
       while($cont < $cantReg){//para cada cuendta del olan de cuenta        
           $sumDebe1  = $sumHaber1  = $sumSaldo1 = 0;
           $niv1ant1 = $this->obtDigiNivel($codigoCuenta,1);//obtiene los digitos del 1er nivel
           $idCuentaN1 = $resultPlancuenta[$cont]->idcuentaplantemp;
           //echo "antes  de n1 ... codigoCuenta ".$codigoCuenta."---<br />";
           while($niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
               $sumDebe2  = $sumHaber2 =  $sumSaldo2 =0;
               $niv1ant2 = $this->obtDigiNivel($codigoCuenta,2);//obtiene los digitos del 1er nivel
               $idCuentaN2 = $resultPlancuenta[$cont]->idcuentaplantemp;
               //echo "antes  de n2 ... codigoCuenta ".$codigoCuenta."---<br />";
               while($niv1ant2 == $this->obtDigiNivel($codigoCuenta,2) and $niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                   $sumDebe3  = $sumHaber3 =  $sumSaldo3 = 0;
                   $niv1ant3 = $this->obtDigiNivel($codigoCuenta,3);//obtiene los digitos del 1er nivel
                   $idCuentaN3 = $resultPlancuenta[$cont]->idcuentaplantemp;
                   //echo "antes  de n3 ... codigoCuenta ".$codigoCuenta."---<br />";
                   while($niv1ant3 == $this->obtDigiNivel($codigoCuenta,3) and $niv1ant2 == $this->obtDigiNivel($codigoCuenta,2) and $niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                       $sumDebe4  = $sumHaber4 = $sumSaldo4 = 0;
                       $niv1ant4 = $this->obtDigiNivel($codigoCuenta,4);//obtiene los digitos del 1er nivel
                       $idCuentaN4 = $resultPlancuenta[$cont]->idcuentaplantemp;
                       //echo "antes  de n4 ... codigoCuenta ".$codigoCuenta."---<br />";
                       while($niv1ant4 == $this->obtDigiNivel($codigoCuenta,4) and $niv1ant3 == $this->obtDigiNivel($codigoCuenta,3) and $niv1ant2 == $this->obtDigiNivel($codigoCuenta,2) and $niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                               //echo "dentro  de n5 ... codigoCuenta ".$codigoCuenta."---<br />";
                               $sumDebe4  += $resultPlancuenta[$cont]->debe;
                               $sumHaber4 += $resultPlancuenta[$cont]->haber;
                               $sumSaldo4 += $resultPlancuenta[$cont]->saldo;
                               //$filaCtaPlanDeta = pg_fetch_row($resultPlancuenta); //obtiene el siguiente regisyto ene el cursor
                               $cont++;
                               $codigoCuenta = $cont < $cantReg ? $resultPlancuenta[$cont]->codcuenta : $resultPlancuenta[$cont-1]->codcuenta;
                       }
                       $queryAct="UPDATE $archTempo SET debe = $sumDebe4, haber = $sumHaber4, saldo = $sumSaldo4 WHERE idCuentaPlanTemp=$idCuentaN4;";
                       $resultAct = DB::connection($connection)->statement($queryAct);
                       //$resultAct = pg_query($queryAct);  
                       $sumDebe3  += $sumDebe4;
                       $sumHaber3 += $sumHaber4;
                       $sumSaldo3 += $sumSaldo4;
                   }
                   $queryAct="UPDATE $archTempo SET debe = $sumDebe3, haber = $sumHaber3, saldo = $sumSaldo3 WHERE idCuentaPlanTemp=$idCuentaN3;";
                   $resultAct = DB::connection($connection)->statement($queryAct);
                   //$resultAct = pg_query($queryAct);  
                   $sumDebe2  += $sumDebe3;
                   $sumHaber2 += $sumHaber3;
                   $sumSaldo2 += $sumSaldo3;
               }
               $queryAct="UPDATE $archTempo SET debe = $sumDebe2, haber = $sumHaber2, saldo = $sumSaldo2 WHERE idCuentaPlanTemp=$idCuentaN2;";
               $resultAct = DB::connection($connection)->statement($queryAct);
               //$resultAct = pg_query($queryAct);  
               $sumDebe1  += $sumDebe2;
               $sumHaber1 += $sumHaber2;
               $sumSaldo1 += $sumSaldo2;
           }
           //hacer algo con nivel 1
           $queryAct="UPDATE $archTempo SET debe = $sumDebe1, haber = $sumHaber1, saldo = $sumSaldo1 WHERE idCuentaPlanTemp=$idCuentaN1;";
           $resultAct = DB::connection($connection)->statement($queryAct);
            //$resultAct = pg_query($queryAct);  
       }//fin contador de registros
   }//fin funcion

    public function balanceGeneral($fechaIni,$fechaFin,$moneda,$archPlanCuentaTemp,$archTempBG, $connection){
        //escribe en un artchivo temporal el resultado de EERR en un determinado periodo de fecha
        //echo "Procesando BALANCE GENERAL y...<br />";

        $archTempoCuentaPlan = $archPlanCuentaTemp;//obtnerArchTempoPlanCuenta();
        $this->sumasAcumCtasDetalle_BG_EERR($fechaIni, $fechaFin, $moneda, 1, $archTempoCuentaPlan, $connection);
        $this->sumarPorNivelessCuentasPrincipales($archTempoCuentaPlan, $connection);
        //echo "<p>Termino la suma por niveles</p>";

        $queryCtaPlanTempo= "SELECT idcuentaplantemp,codcuenta,nombre,saldo 
                                from  $archTempoCuentaPlan  
                                where fkidcuentaplantipo IN 
                                    (select idcuentaplantipo 
                                     from cuentaplantipo 
                                     where abreviacion = 'A' or abreviacion = 'P' or abreviacion = 'C') 
                            order by codcuenta;"; //Act.Pasv,CapPat

        $resultCtaPlanTempo = DB::connection($connection)->select($queryCtaPlanTempo);
        //echo "<p>Termino la suma 1</p>";
        //$resultCtaPlanTempo = pg_query($queryCtaPlanTempo);
        //if (sizeof($resultCtaPlanTempo) === 0) return;
        $sumTotal = 0;
        //while($filaCtaPlanTempo = pg_fetch_row($resultCtaPlanTempo)){
        foreach ($resultCtaPlanTempo as $row) {
            $tipo          = "X";
            $idCuentaBusc  = $row->idcuentaplantemp;
            $codcuenta     = $row->codcuenta;
            $descripción   = $row->nombre;
            $valor         = $row->saldo;
            
            $nivelCodCuenta= $this->obtenerNivelCeros($codcuenta);

            //$queryAbrev  = "select abreviacion  from cuentaPlanTipo where idcuentaplantipo = (select fkidcuentaplantipo from cuentaplan where idcuentaplan = $idCuentaBusc)";
            //$resultAbrev = DB::connection($connection)->select($queryAbrev);
            $resultAbrev = DB::connection($connection)
                ->table('cuentaplan as cp')
                ->join('cuentaplantipo as cpt', 'cpt.idcuentaplantipo', 'cp.fkidcuentaplantipo')
                ->where('cp.idcuentaplan', $idCuentaBusc)
                ->whereNull('cp.deleted_at')
                ->whereNull('cpt.deleted_at')
                ->select('abreviacion')
                ->first();
            //$resultAbrev = pg_query($queryAbrev);
            //$filaAbrev   = pg_fetch_array($resultAbrev);
            $tipocuenta  = $resultAbrev->abreviacion;
            $this->escribirEnTempoBalGeneral($tipo,$codcuenta,$descripción,$valor,$tipocuenta,$nivelCodCuenta,$archTempBG, $connection);
        }//while
    
    }//fin balance

        //*********++ */

    function actualizaCtaEERR($valorEERR, $archTempCuentaPlan) {//BBB 19/05/2020 
        //actualiza la cuenta de resultados de la gestion antes de impuesto
        //echo "Actualiza BBB registro de cuenta de RESULYADO antes de impuesto valor es : ".$valorEERR."  ..<br />";

        $queryEerr = "SELECT idcuentaplan from configeerr where esctaresult = 'S' ";

        $resultEerr = DB::connection($this->connection)->select($queryEerr);
        // $resultEerr = pg_query($queryEerr);
        
        //if (pg_num_rows($resultEerr) > 0) {
        if (count($resultEerr) > 0) {

            //$filaPlanEerr = pg_fetch_array($resultEerr);

            $idCtaPlanEerr = trim($resultEerr[0]->idcuentaplan);
            $queryPlanXX = "SELECT codcuenta from cuentaplan where idcuentaplan =  $idCtaPlanEerr ";
            // $resultPlanXX = pg_query($queryPlanXX);
            $resultPlanXX = DB::connection($this->connection)->select($queryPlanXX);

            if (count($resultPlanXX) > 0) {
                //$filaPlanXX = pg_fetch_array($resultPlanXX);
                $coddCuentaVarXX = trim($resultPlanXX[0]->codcuenta);

                //echo "Actualiza BBB arch: ".$archTempCuentaPlan." Valor: ".$valorEERR." CodCta: ".$coddCuentaVarXX."  ..<br />";

                $queryAct = "UPDATE $archTempCuentaPlan SET saldo = $valorEERR WHERE codcuenta='$coddCuentaVarXX';";

                // $resultAct = pg_query($queryAct);
                $resultAct = DB::connection($this->connection)->select($queryAct);

            }
        }// si hay fila
    }


    function balanceGeneral2($fechaIni,$fechaFin,$moneda,$archPlanCuentaTemp,$archTempBG, $incluirEERR){
        //escribe en un artchivo temporal el resultado de EERR en un determinado periodo de fecha


        $valorEERR = 0; //BBB 19/05/2020

        if ($incluirEERR == 'S') {//BBB 19/05/2020 para obtemer resultado de ejercicio ants de impuestos
            //echo "Procesando BBB ANTES EERR para BG...<br />";

            $archPlanCuentaTemp_yyy = $this->obtnerArchTempoPlanCuenta($archPlanCuentaTemp, $this->connection);
            $archTempEERR_yyy = $this->obtener_Archivo_Temporal_EERR($archTempBG, $this->connection);

            // $archPlanCuentaTemp_yyy = obtnerArchTempoPlanCuenta("roly");
            // $archTempEERR_yyy = obtnerArchTempoEERR("roly");

            //$valorEERR = estadoResulados($fechaIni, $fechaFin, $moneda, $archPlanCuentaTemp_yyy, $archTempEERR_yyy);
            $valorEERR = $this->estado_Resultados($fechaIni, $fechaFin, $moneda, $archPlanCuentaTemp_yyy, $archTempEERR_yyy, $this->connection);
            
            $this->borrarTempo($archPlanCuentaTemp_yyy, $this->connection);
            $this->borrarTempo($archTempEERR_yyy, $this->connection);
        }//BBB 19/05/2020


        $archTempoCuentaPlan = $archPlanCuentaTemp;//obtnerArchTempoPlanCuenta();
        //echo 'LLEGO ACA';
        $this->sumasAcumCtasDetalle_BG_EERR2($fechaIni,$fechaFin,$moneda,1,$archTempoCuentaPlan);
        //return;
        //echo 'PASO SUMA';

        if ($incluirEERR == 'S') {//BBB 19/05/2020 escribir en BG el valor de EERR
            $this->actualizaCtaEERR($valorEERR, $archTempoCuentaPlan); //BBB 19/05/2020 
        }

        $this->sumarPorNivelessCuentasPrincipales2($archTempoCuentaPlan);
        //echo 'PASO SUMA NIVELES';
        //============================ ACA ME QUEDE ================================ ALEX

        $queryCtaPlanTempo  = "SELECT idcuentaplantemp,codcuenta,nombre,saldo 
                                from  $archTempoCuentaPlan  
                                where fkidcuentaplantipo IN 
                                    (select idcuentaplantipo 
                                     from cuentaplantipo 
                                     where abreviacion = 'A' or abreviacion = 'P' or abreviacion = 'C') 
                                order by codcuenta;"; //Act.Pasv,CapPat

        //$resultCtaPlanTempo = pg_query($queryCtaPlanTempo);
        $resultCtaPlanTempo = DB::connection($this->connection)->select($queryCtaPlanTempo);
        $sumTotal = 0;
        
        //while($filaCtaPlanTempo = pg_fetch_row($resultCtaPlanTempo)){
        //*dd($resultCtaPlanTempo);
        $i = 0;
        $count = count($resultCtaPlanTempo);
        for ($i = 0; $i < $count; $i++) {
            $tipo          = "X";
            $idCuentaBusc  = $resultCtaPlanTempo[$i]->idcuentaplantemp;
            $codcuenta     = $resultCtaPlanTempo[$i]->codcuenta;
            $descripción   = $resultCtaPlanTempo[$i]->nombre;
            $valor         = $resultCtaPlanTempo[$i]->saldo;
            
            $nivelCodCuenta = $this->obtenerNivelCeros2($codcuenta);

            $queryAbrev  = "select abreviacion  from cuentaplantipo where idcuentaplantipo = (select fkidcuentaplantipo from cuentaplan where idcuentaplan = $idCuentaBusc)";
            //$resultAbrev = pg_query($queryAbrev);
            $resp = DB::connection($this->connection)->select($queryAbrev);
            //$filaAbrev   = pg_fetch_array($resultAbrev);
            $tipocuenta  = $resp[0]->abreviacion;
            $this->escribirEnTempoBalGeneral2($tipo,$codcuenta,$descripción,$valor,$tipocuenta,$nivelCodCuenta,$archTempBG);
        }//while
    
    }//fin balancd

    function sumasAcumCtasDetalle_BG_EERR2($fechaIni,$fechaFin,$idMoneda,$para,$archTempoCtaPlanTemp){
        //actualiza tabla cuentaplantemporal con debe,hbaer,saldo $para=1 Balance general $para = 2 es EERR para las cuenta de detalle
        //************************   order by   Y   COSTO  S en eerr 16/11/2019 17:00 
        //echo "<p><i>procesando sumas acumulads para cuentas de detalle para balance/EERR</i></p>";
        if($para==1){//balnace general

        $queryCtaPlanDeta = "SELECT idcuentaplan 
                            from cuentaplan 
                            where esctadetalle='S' and fkidcuentaplantipo IN 
                                (select idcuentaplantipo 
                                 from cuentaplantipo 
                                 where deleted_at is null and (abreviacion = 'A' or abreviacion = 'P' or abreviacion = 'C') and deleted_at is null) 
                                order by codcuenta;"; //Act.Pasv,CapPat
        
        }else{//EERR
            $queryCtaPlanDeta = "select idcuentaplan from cuentaplan where deleted_at is null and esctadetalle='S' and fkidcuentaplantipo IN (select idcuentaplantipo from cuentaplantipo where (abreviacion = 'I' or abreviacion = 'S' or abreviacion = 'G') and deleted_at is null) order by codcuenta;"; //Ing.Costo,Gasto
        }
            //$resultCtaPlanDeta = pg_query($queryCtaPlanDeta);
            $resultCtaPlanDeta = DB::connection($this->connection)->select($queryCtaPlanDeta);
            //dd($resultCtaPlanDeta);
            $archTempoLibMay="";
            $saldoAnt=0;
            $escribirTempoLM=false;
            $paraBG_EERR = true;
            //while($filaCtaPlanDeta = pg_fetch_row($resultCtaPlanDeta)){//para cada cuendta detalle de olan de cuenta A,P,C obtener su libro mayor
            $i = 0;
            $arr = [];
            //dd($resultCtaPlanDeta);
            foreach ($resultCtaPlanDeta as $row) {
                $i++;
                $saldo = $this->libroMayorUnaCuenta2($row->idcuentaplan, $fechaIni, $fechaFin, $idMoneda, $archTempoLibMay, $saldoAnt,$escribirTempoLM,$paraBG_EERR,$archTempoCtaPlanTemp);
                array_push($arr, [$row->idcuentaplan, $saldo]);
            }
            //echo '<p>VALOR FINAL I ==> ' . $i . '</p> <br>' ;
            //dd($arr);
    }//funcion lm

    function sumarPorNivelessCuentasPrincipales2($archTempo){
        //Obtener debe, haber y saldo para todas las cuentas padres en el architempo
        //echo "<p><i>Procesando suma de cuentas principales</i></p>";
        $cont=0;
        $idCuentaN1 = $idCuentaN2 = $idCuentaN3 = $idCuentaN4 = 0;
        //$queryPlanCta = "select idcuentaplantemp,codcuenta,debe,haber,saldo from $archTempo order by codcuenta;";
        //echo 'ANTES DE LA QUERY....';
        $resultPlancuenta = DB::connection($this->connection)
                    ->table($archTempo)
                    ->select('idcuentaplantemp', 'codcuenta', 
                            'debe', 'haber', 'saldo')
                    ->orderBy('codcuenta', 'ASC')
                    ->get();
        //echo 'PASO......';
        //$resultPlancuenta = pg_query($queryPlanCta);
        //$cantReg = pg_num_rows($resultPlancuenta);
        $cantReg = count($resultPlancuenta);
        $filaCtaPlanDeta = $resultPlancuenta[0]; //obtiene 1er registro del cursor
        $codigoCuenta = $filaCtaPlanDeta->codcuenta;
        $niv1ant = $this->obtDigiNivel($codigoCuenta,1);//obtiene los digitos del 1er nivel   
        $sumDebe1  = $sumHaber1 = 0;
        while($cont < $cantReg){//para cada cuendta del olan de cuenta        
            $sumDebe1  = $sumHaber1  = $sumSaldo1 = 0;
            $niv1ant1 = $this->obtDigiNivel($codigoCuenta,1);//obtiene los digitos del 1er nivel
            $idCuentaN1 = $resultPlancuenta[$cont]->idcuentaplantemp;
            //echo "antes  de n1 ... codigoCuenta ".$codigoCuenta."---<br />";
            while($niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                $sumDebe2  = $sumHaber2 =  $sumSaldo2 =0;
                $niv1ant2 = $this->obtDigiNivel($codigoCuenta,2);//obtiene los digitos del 1er nivel
                $idCuentaN2 = $resultPlancuenta[$cont]->idcuentaplantemp;
                //echo "antes  de n2 ... codigoCuenta ".$codigoCuenta."---<br />";
                while($niv1ant2 == $this->obtDigiNivel($codigoCuenta,2) and $niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                    $sumDebe3  = $sumHaber3 =  $sumSaldo3 = 0;
                    $niv1ant3 = $this->obtDigiNivel($codigoCuenta,3);//obtiene los digitos del 1er nivel
                    $idCuentaN3 = $resultPlancuenta[$cont]->idcuentaplantemp;
                    //echo "antes  de n3 ... codigoCuenta ".$codigoCuenta."---<br />";
                    while($niv1ant3 == $this->obtDigiNivel($codigoCuenta,3) and $niv1ant2 == $this->obtDigiNivel($codigoCuenta,2) and $niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                        $sumDebe4  = $sumHaber4 = $sumSaldo4 = 0;
                        $niv1ant4 = $this->obtDigiNivel($codigoCuenta,4);//obtiene los digitos del 1er nivel
                        $idCuentaN4 = $resultPlancuenta[$cont]->idcuentaplantemp;
                        //echo "antes  de n4 ... codigoCuenta ".$codigoCuenta."---<br />";
                        while($niv1ant4 == $this->obtDigiNivel($codigoCuenta,4) and $niv1ant3 == $this->obtDigiNivel($codigoCuenta,3) and $niv1ant2 == $this->obtDigiNivel($codigoCuenta,2) and $niv1ant1 == $this->obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                                //echo "dentro  de n5 ... codigoCuenta ".$codigoCuenta."---<br />";
                                $sumDebe4  += $resultPlancuenta[$cont]->debe;
                                $sumHaber4 += $resultPlancuenta[$cont]->haber;
                                $sumSaldo4 += $resultPlancuenta[$cont]->saldo;
                                //$resultPlancuenta = pg_fetch_row($resultPlancuenta); //obtiene el siguiente regisyto ene el cursor
                                $cont++;
                                $codigoCuenta = $cont < $cantReg ? $resultPlancuenta[$cont]->codcuenta : $resultPlancuenta[$cont-1]->codcuenta;
                        }
                        $queryAct="UPDATE $archTempo SET debe = $sumDebe4, haber = $sumHaber4, saldo = $sumSaldo4 WHERE idCuentaPlanTemp=$idCuentaN4;";
                        //$resultAct = pg_query($queryAct);  
                        DB::connection($this->connection)->select($queryAct);
                        $sumDebe3  += $sumDebe4;
                        $sumHaber3 += $sumHaber4;
                        $sumSaldo3 += $sumSaldo4;
                    }
                    $queryAct="UPDATE $archTempo SET debe = $sumDebe3, haber = $sumHaber3, saldo = $sumSaldo3 WHERE idCuentaPlanTemp=$idCuentaN3;";
                    //$resultAct = pg_query($queryAct);  
                    DB::connection($this->connection)->select($queryAct);
                    $sumDebe2  += $sumDebe3;
                    $sumHaber2 += $sumHaber3;
                    $sumSaldo2 += $sumSaldo3;
                }
                $queryAct="UPDATE $archTempo SET debe = $sumDebe2, haber = $sumHaber2, saldo = $sumSaldo2 WHERE idCuentaPlanTemp=$idCuentaN2;";
                //$resultAct = pg_query($queryAct);  
                DB::connection($this->connection)->select($queryAct);
                $sumDebe1  += $sumDebe2;
                $sumHaber1 += $sumHaber2;
                $sumSaldo1 += $sumSaldo2;
            }
            //hacer algo con nivel 1
            $queryAct="UPDATE $archTempo SET debe = $sumDebe1, haber = $sumHaber1, saldo = $sumSaldo1 WHERE idCuentaPlanTemp=$idCuentaN1;";
            //$resultAct = pg_query($queryAct);  
            DB::connection($this->connection)->select($queryAct);
        }//fin contador de registros
    }//fin funcion

    function obtenerNivelCeros2($codCuenta){// formato 1.0.0.00.00
        $n =strlen($codCuenta);
        $niv = 0;
        $i=0;
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d1 = intval($dat);  
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d2 = intval($dat); 
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d3 = intval($dat); 
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d4 = intval($dat); 
        
        $dat="";
        while ($i<$n and $codCuenta[$i] != "."){
            $dat = $dat . $codCuenta[$i];
            $i++;
        }
        $i++;
        $d5 = intval($dat); 
        if($d5==0 && $d4==0 && $d3==0 && $d2==0)  $niv = 1;
        elseif($d5==0 && $d4==0 && $d3==0)  $niv = 2;
        elseif($d5==0 && $d4==0 )  $niv = 3;
        elseif($d5==0 )  $niv = 4;
        else $niv=5;
        return($niv);
    }

    function escribirEnTempoBalGeneral2($tipo,$codcuenta,$descripcion,$valor,$tipocuenta,$nivelCodCuenta,$archTemp){
        //echo "Procesando escribir<br/>";
        $query = "INSERT INTO $archTemp (tipo,codcuenta,descripcion,valor,tipocuenta,nivelcod) VALUES  ('$tipo','$codcuenta','$descripcion','$valor','$tipocuenta','$nivelCodCuenta')";
        //$result = pg_query($query);
        DB::connection($this->connection)->select($query);
        return;
    }

    function libroMayorUnaCuenta2($idCuentaBusc, $fechaIni, $fechaFin, $idMonedaLM, $archTempoLibMay, $saldoAnt, $escribirTempoLM, $paraBG_EERR, $archTempoCtaPlanTemp) {
        //escribe en archivo temporal los movimeintos de una cuenta en los comprobante en un determinado periodo de fechas
        //idMoneda si es 1 es por defecto moneda oficial
        //$idCuentaPlan="";
        $saldoCuenta = $saldoAnt;
        //$queryComp = "select idcomprobante, fecha,glosa,nrochequetarjeta,fkidmoneda,tipocambio from comprobante where fecha>='$fechaIni' and fecha<= '$fechaFin' and contabilizar='S' and deleted_at is null order by fecha ";
        $resultComp = DB::connection($this->connection)
                        ->table('comprobante as c')
                        //->join('comprobantetipo as ct', 'ct.idcomprobantetipo', 'c.fkidcomprobantetipo')
                        ->select('c.idcomprobante', 'c.fecha', 'c.glosa', 'c.nrochequetarjeta',
                                'c.fkidmoneda', 'c.tipocambio')
                        ->where('c.fecha', '>=', $fechaIni)
                        ->where('c.fecha', '<=', $fechaFin)
                        ->where('c.contabilizar', 'S')
                        ->whereNull('c.deleted_at')
                        ->orderBy('c.fecha', 'ASC')
                        ->get();
        $k_saldo = 0;
        //while ($filaComp = pg_fetch_row($resultComp)) {//busca en cada comrpobante la cuenta del usr elije
        foreach ($resultComp as $row) {
            if ($paraBG_EERR == true) {//si se requiere LM para BG o EERR
                //$queryDetaComp = "select sum(debe), sum(haber) from comprobantecuentadetalle where fkidcomprobante = $filaComp[0] and fkidcuentaplan=$idCuentaBusc and deleted_at is null";
                $resp = DB::connection($this->connection)
                                    ->table('comprobantecuentadetalle as ccd')
                                    //->join('cuentaplan as cp', 'cp.idcuentaplan', 'ccd.fkidcuentaplan')
                                    //->join('cuentaplantipo as cpt', 'cpt.idcuentaplantipo', 'cp.fkidcuentaplantipo')
                                    ->where('ccd.fkidcomprobante', $row->idcomprobante)
                                    ->where('ccd.fkidcuentaplan', $idCuentaBusc)
                                    ->whereNull('ccd.deleted_at')
                                    //->whereNull('cp.deleted_at')
                                    //->whereNull('cpt.deleted_at')
                                    ->select(DB::raw('SUM(ccd.debe) as debe'), DB::raw('SUM(ccd.haber) as haber'))
                                    ->get();
            } else { //solo LM
                //$queryDetaComp = "select debe, haber, fkidcuentaplan,glosamenor  from comprobantecuentadetalle where fkidcomprobante = $filaComp[0] and fkidcuentaplan=$idCuentaBusc and deleted_at is null";
                $resp = DB::connection($this->connection)
                                    ->table('comprobantecuentadetalle as ccd')
                                    ->join('cuentaplan as cp', 'cp.idcuentaplan', 'ccd.fkidcuentaplan')
                                    ->where('ccd.fkidcomprobante', $row->idcomprobante)
                                    ->where('ccd.fkidcuentaplan', $idCuentaBusc)
                                    ->whereNull('ccd.deleted_at')
                                    ->whereNull('cp.deleted_at')
                                    ->select('ccd.debe', 'ccd.haber', 'ccd.fkidcuentaplan', 'ccd.glosamenor',
                                            'cp.codcuenta', 'cp.nombre')
                                    ->get();            
            }
            $resultDetaComp = $resp[0];
            if ($resultDetaComp != null) {
            // echo "PROCESA idcuentabus -->>>> : ".$idCuentaBusc."<br />";
                $idcomprobanteVar = $row->idcomprobante;       //datos de encabezado de comprobantes
                $fechaCompVar = $row->fecha;
                $glosaCompVar = $row->glosa;
                $chequeCompVar = $row->nrochequetarjeta;
                $idMonedaVar = $row->fkidmoneda;
                $tipoCambioVar = $row->tipocambio;

                //$filaDetaComp = pg_fetch_array($resultDetaComp);
                if ($paraBG_EERR == false) {//solo para libro mayor y no para BG y EERR
                    $debeVar = $resultDetaComp->debe;   //datos de detalle de comprobante
                    $haberVar = $resultDetaComp->haber;
                    $idCuentaPlan = $resultDetaComp->fkidcuentaplan;
                    $glosaMenor = $resultDetaComp->glosamenor;

                    //$queryPlan = "select codcuenta, nombre from cuentaPlan where idcuentaplan =  $idCuentaPlan";
                    //$resultPlan = pg_query($queryPlan);
                    //$filaPlan = pg_fetch_array($resultPlan);
                    $codCuentaPlan = $resultDetaComp->codcuenta;
                    $nombreVar = $resultDetaComp->nombre;
                } else { //para BG o EERR
                    //dd($resultDetaComp->debe);
                    if (is_null($resultDetaComp->debe))
                        $debeVar = 0;
                    else
                        $debeVar = $resultDetaComp->debe;
                    if (is_null($resultDetaComp->haber))
                        $haberVar = 0;
                    else
                        $haberVar = $resultDetaComp->haber;
                }
                if ($k_saldo == 0 && $escribirTempoLM == true) {//indserta una sola vex el saldo anterior para cada cuenta
                    $queryIns = "INSERT INTO $archTempoLibMay(idcuenta,codcuenta,nombre,saldo) VALUES ('$idCuentaPlan','$codCuentaPlan','$nombreVar','$saldoCuenta');";
                    //  $resultIns = pg_query($queryIns);
                    DB::connection($this->connection)->select($queryIns);
                    $k_saldo = 1;
                }
                if ($tipoCambioVar == 0)
                    $tipoCambioVar = 1; //tipo de cambio diferente entre LM y comprobantes
                if ($idMonedaLM != $idMonedaVar) { //si NO comprobante esta en la misma moneda solcitada
                    if ($idMonedaVar == 1 && $idMonedaLM == 2) { //de BS a $us
                        $debeVar = $debeVar / $tipoCambioVar;
                        $haberVar = $haberVar / $tipoCambioVar;
                    }
                    if ($idMonedaVar == 2 && $idMonedaLM == 1) { //de $us a Bs
                        $debeVar = $debeVar * $tipoCambioVar;
                        $haberVar = $haberVar * $tipoCambioVar;
                    }
                }//ifmoneda
                //$queryAbrev = "select abreviacion  from cuentaPlanTipo where idcuentaplantipo = (select fkidcuentaplantipo from cuentaplan where idcuentaplan = $idCuentaBusc)";
                //$resultAbrev = pg_query($queryAbrev);
                //$filaAbrev = pg_fetch_array($resultAbrev);
                $resp = DB::connection($this->connection)
                            ->table('cuentaplan as cp')
                            ->join('cuentaplantipo as cpt', 'cpt.idcuentaplantipo', 'cp.fkidcuentaplantipo')
                            ->where('cp.idcuentaplan', $idCuentaBusc)
                            ->select('cpt.abreviacion')
                            ->whereNull('cp.deleted_at')
                            ->whereNull('cpt.deleted_at')
                            ->first();
                if ($resp->abreviacion == 'A' || $resp->abreviacion == 'S' || $resp->abreviacion == 'G') { //Activo,Costos,Gastos
                    $saldoCuenta = $saldoCuenta + ($debeVar - $haberVar);
                } //debe - haber
                if ($resp->abreviacion == "P" || $resp->abreviacion == "I" || $resp->abreviacion == "C") { //Pasivo,Ingresos,CapitalPatru
                    $saldoCuenta = $saldoCuenta + ($haberVar - $debeVar); //haber - debe
                }
                //$queryTipoComp = "select descripcion from comprobantetipo where idcomprobantetipo = (select fkidcomprobantetipo from comprobante where idcomprobante = $idcomprobanteVar);";
                
                //$resultTipoComp = pg_query($queryTipoComp);
                //$filaTipoComp = pg_fetch_array($resultTipoComp);
                $res = DB::connection($this->connection)
                            ->table('comprobante as c')
                            ->join('comprobantetipo as ct', 'ct.idcomprobantetipo', 'c.fkidcomprobantetipo')
                            ->select('ct.descripcion')
                            ->where('c.idcomprobante', $idcomprobanteVar)
                            ->whereNull('c.deleted_at')
                            ->whereNull('ct.deleted_at')
                            ->first();
                $tipoCompVar = $res->descripcion; //==================
                //array_push($arr, $tipoCompVar);
                //   echo "id " . $idCuentaBusc . " idCuenta " . $idCuentaPlan . " cuenta " . $codCuentaPlan . " nombre " . $nombreVar . " SalAnt " . $saldoAnt . " fecha " . $fechaCompVar . " Tipo " . $tipoCompVar
                // //  . " Glosa " . $glosaCompVar . " concepto " . $glosaMenor . " cheque " . $chequeCompVar . " debe " . $debeVar .
                //   " haber " . $haberVar . " saldo " . $saldoCuenta . " monedaComp " . $idMonedaVar . " moneLM " . $idMonedaLM . " TC " . $tipoCambioVar . " escrTemLM " . $escribirTempoLM . "<br />";
                if ($escribirTempoLM == true) {
                    $queryIns = "INSERT INTO $archTempoLibMay(idcuenta,codcuenta,nombre,saldoanterior,fecha,tipo,glosa,concepto,cheque,debe,haber,saldo) VALUES ('$idCuentaPlan','$codCuentaPlan','$nombreVar','$saldoAnt','$fechaCompVar','$tipoCompVar','$glosaCompVar','$glosaMenor','$chequeCompVar','$debeVar','$haberVar','$saldoCuenta');";
                    //$resultIns = pg_query($queryIns);
                    DB::connection($this->connection)->select($queryIns);
                }
                if ($paraBG_EERR == true) {//actualizar plan de cuenta temporal
                    $queryAct = "UPDATE $archTempoCtaPlanTemp SET debe = $debeVar, haber = $haberVar, saldo = $saldoCuenta WHERE idCuentaplantemp=$idCuentaBusc;";
                    //$resultAct = pg_query($queryAct);
                    DB::connection($this->connection)->select($queryAct);
                }
            }//si hay datos
        }//while
        return($saldoCuenta);
    }//funcion libro  mayor








    function asienAutomVentaContadoCredito($nroVenta, $idUsuarioActual, $connection) {//nroVenta es el idVenta

        $queryVta = "SELECT fecha,fkidcliente,fkidmoneda,tc,mtovtabruta,mtototventa,descuentoporcentaje,recargoporcentaje,fkidtipocontacredito,anticipo 
            FROM venta WHERE idventa = '$nroVenta' ";

        //$resultVta = pg_query($queryVta); pg_num_rows($resultVta) <= 0
        $resultVta = DB::connection($connection)->select($queryVta);

        if (sizeof($resultVta) <= 0) {
            //echo " No hay registro en venta :" . $nroVenta . "<br />";
            return -1;
        }

        // $filaVta        = pg_fetch_array($resultVta);
        $filaVta        = $resultVta[0];

        $fechaVta       = $filaVta->fecha; //"2020-03-23 19:12:50";
        $idCliente      = $filaVta->fkidcliente; //1;
        $idMonetaVta    = $filaVta->fkidmoneda; //1;
        $TipoCambioVta  = $filaVta->tc; //6.96;
        $mtoVtaBruto    = $filaVta->mtovtabruta; //11860.40;
        $mtoVtaNeto     = $filaVta->mtototventa; //10081.34;
        $porcenDescto   = $filaVta->descuentoporcentaje; //20;
        $porcenIncremen = $filaVta->recargoporcentaje; //5;
        $tipoContaCred  = $filaVta->fkidtipocontacredito; //5; 1 es contado y 2 es credito
        $mtoAnticipo    = $filaVta->anticipo;
    
        if($tipoContaCred == 1)  $claveTransac = "VC"; else $claveTransac = "VCR";
        
        $queryClient = "SELECT nombre, apellido FROM cliente WHERE idcliente = '$idCliente' ";

        // $resultClient = pg_query($queryClient);
        $resultClient = DB::connection($connection)->select($queryClient);

        if (sizeof($resultClient) <= 0) {
            //echo " No hay registro en cliente :" . $idCliente . "<br />";
            return -2;
        }
        $filaClient = $resultClient[0];
        $apellido = $filaClient->apellido == null ? '' : $filaClient->apellido;
        $varNombCliente = $filaClient->nombre.' '.$apellido;
    
        $queryTransac = "SELECT idctbtransacautomaticas FROM ctbtransacautomaticas WHERE tipotransac = '$claveTransac' AND estado= 'A' ";
        // $resultTransac = pg_query($queryTransac);
        $resultTransac = DB::connection($connection)->select($queryTransac);

        if (sizeof($resultTransac) <= 0) {
            //echo " No hay registro en ctbtransacautomaticas :" . $claveTransac . "<br />";
            return -3;
        }
        $filaTran = $resultTransac[0];
        $idTransAutom = $filaTran->idctbtransacautomaticas;
    
        $queryComp = "SELECT idctbcomprobautomat,fkidcomprobantetipo,contabilizar FROM ctbcomprobautomat  WHERE fkidctbtransacautomaticas ='$idTransAutom'";
        // $resultComp = pg_query($queryComp);
        $resultComp = DB::connection($connection)->select($queryComp);

        if (sizeof($resultComp) <= 0) {
            //echo " No hay registro en  ctbcomprobautomat...<br />";
            return -4;
        }
        $filaComp = $resultComp[0];
        $idctbComprobAutom = $filaComp->idctbcomprobautomat;
        $fkidComptipo = $filaComp->fkidcomprobantetipo;
        $contabilizar = $filaComp->contabilizar;
    
        $varCodComprobante = $this->obtNumComprobanteYactNro($fkidComptipo == null ? -1 : $fkidComptipo, $connection); //obtiene el numero de comprobante segun el tipo
        $varTipoPago = 1; //???? ventas debe decir tipo de pago por lo pronto se asume en efectivo
    
        if($tipoContaCred == 1){ //si es al contado
            $varGlosa = "Venta al contado Nro. " . $nroVenta . " Monto total neto: " . $mtoVtaNeto . "  Fecha: " . $fechaVta;
        }else{
            $varGlosa = "Venta al credito Nro. " . $nroVenta . " Monto total neto: " . $mtoVtaNeto . "  Fecha: " . $fechaVta. " Anticipo: ".$mtoAnticipo;
        }
        
        $varFkidperiodocontable = -1; // ????? obtPeriodoContable($fechaVta); Ver Henry haer una funcion para saber el id del periodo a cual corresponde el comprobane automatico

        $resultperiodo = DB::connection($connection)
            ->table('periodocontable as p')
            ->leftJoin('gestioncontable as g', 'p.fkidgestioncontable','=', 'g.idgestioncontable')
            ->select('p.idperiodocontable')
            ->where([['p.estado', '=', 'A'], ['g.estado', '=', 'A'], ['p.fechaini', '<=', $fechaVta], ['p.fechafin', '>=', $fechaVta]])
            ->whereNull('p.deleted_at')
            ->whereNull('g.deleted_at')
            ->get();

        if (sizeof($resultperiodo) <= 0) return -5;

        $varFkidperiodocontable = $resultperiodo[0]->idperiodocontable;
    
        $queryDefCta = "SELECT  valor FROM ctbdefictasasientautom  WHERE clave ='B'";
        // $resultDefCta = pg_query($queryDefCta);
        $resultDefCta = DB::connection($connection)->select($queryDefCta);

        if (sizeof($resultDefCta) <= 0) {
            //echo " No hay reg en ctbdefuctasasientautom...<br />";
            return -6;
        }
        $filaDefCta = $resultDefCta[0];
        $varIT = intval($filaDefCta->valor);
    
        $queryDefCta = "SELECT valor FROM ctbdefictasasientautom  WHERE clave ='E'";
        // $resultDefCta = pg_query($queryDefCta);
        $resultDefCta = DB::connection($connection)->select($queryDefCta);

        if (sizeof($resultDefCta) <= 0) {
            //echo " No hay reg en ctbdefuctasasientautom...<br />";
            return -7;
        }
        $filaDefCta = $resultDefCta[0];
        $varDebFisc = intval($filaDefCta->valor);
    
        $queryDefCta = "SELECT valor FROM ctbdefictasasientautom  WHERE clave ='F'";
        // $resultDefCta = pg_query($queryDefCta);
        $resultDefCta = DB::connection($connection)->select($queryDefCta);

        if (sizeof($resultDefCta) <= 0) {
            //echo " No hay reg en ctbdefuctasasientautom...<br />";
            return -8;
        }
        $filaDefCta = $resultDefCta[0];
        $varITxPagar = intval($filaDefCta->valor);
    
        $calBanco       = round($mtoVtaNeto, 2); //banco en contad o ctas por cobrar en cred
        $calImpTran     = round(($mtoVtaBruto * $varIT) / 100, 2); //%;
        $calMtoDcto     = round(($mtoVtaBruto * $porcenDescto) / 100, 2);
        $calDebitFisc   = round(($mtoVtaBruto * $varDebFisc) / 100, 2); //%
        $calIngrVenta   = round($mtoVtaBruto - $calDebitFisc, 2);
        $calMtoIncrem   = round(($mtoVtaBruto * $porcenIncremen) / 100, 2);
        $calImpTrnPag   = round(($mtoVtaBruto * $varITxPagar) / 100, 2); //%%
        
        $varNroVenta = "Vta : " . $nroVenta;

        $comprobante = new Comprobante();
        $comprobante->setConnection($connection);

        $comprobante->codcomprobante = $varCodComprobante;
        $comprobante->referidoa = $varNombCliente;
        $comprobante->fecha = $fechaVta;
        $comprobante->nrodoc = $varNroVenta;
        $comprobante->glosa = $varGlosa;
        $comprobante->tipocambio = $TipoCambioVta;
        $comprobante->idusuario = $idUsuarioActual;
        $comprobante->estado = 'A';
        $comprobante->fkidcomprobantetipo = $fkidComptipo;
        $comprobante->fkidtipopago = $varTipoPago;
        $comprobante->fkidmoneda = $idMonetaVta;
        $comprobante->contabilizar = $contabilizar;
        $comprobante->esautomatico = 'S';
        $comprobante->fkidperiodocontable = $varFkidperiodocontable;
        
        $comprobante->save();
    
        $varFkIdComprobante = $comprobante->idcomprobante;
    
    
        $queryDetaComp = "SELECT idctbdetallecomprobautomat,glosamenor, debe,haber,fkidctbcomprobautomat,fkidctbdefictasasientautom,fkidcuentaplan,fkidcentrodecosto 
            FROM ctbdetallecomprobautomat  WHERE fkidctbcomprobautomat ='$idctbComprobAutom'";

        // $resultDetaComp = pg_query($queryDetaComp);
        $resultDetaComp = DB::connection($connection)->select($queryDetaComp);

        if (sizeof($resultDetaComp) <= 0) {
            return -9;
        }
        $i = 1;
        foreach ($resultDetaComp as $key => $filaDetaComp)  {
            
            $detIdctbdetallecomprobautomat  = $filaDetaComp->idctbdetallecomprobautomat;
            $detGlosaMenor                  = $filaDetaComp->glosamenor;
            $detDebe                        = $filaDetaComp->debe;
            $detHaber                       = $filaDetaComp->haber;
            $detfkidctbcomprobautomat       = intval($filaDetaComp->fkidctbcomprobautomat);
            $detfkidctbdefictasasientautom  = intval($filaDetaComp->fkidctbdefictasasientautom);
            $detfkidcuentaplan              = intval($filaDetaComp->fkidcuentaplan);
            $detfkidcentrodecosto           = intval($filaDetaComp->fkidcentrodecosto);
    
            $detGlosaMenor = "Venta Nro. " . $nroVenta;
            $debe = $haber = 0;
            if ($i == 1) { //A 1. Banco ( valor de venta neta después de dectos/incre)	X1
                $debe = $calBanco;
            }
            if ($i == 2) {//B 2. IT Impuesto transacciones (3% de la venta total antes de desc/incrmentos)	X2
                $debe = $calImpTran;
            }
            if ($i == 3) {//C 3.	Descuento sobre ventas (% del total bruto venta)	X3
                $debe = $calMtoDcto;
            }
            if ($i == 4) {//D 4. Ingreso por ventas  (venta bruta – DF impuesto)
                $haber = $calIngrVenta;
            }
            if ($i == 5) {//E 5. Debito Fiscal  impuesto  (13% del total venta bruta)
                $haber = $calDebitFisc;
            }
            if ($i == 6) {//F 6. IT por pagar   (3%  de venta bruta) Y3
                $haber = $calImpTrnPag;
            }
            if ($i == 7) {//G 7. Recargo sobre venta (% sobre la venta bruta) Y4
                $haber = $calMtoIncrem;
            }
            $k = 0; //pa saber sei agrega detalle
            if ($debe != 0 || $haber != 0) {
                if ($detfkidcuentaplan > 0 and $detfkidcentrodecosto > 0) {//si cuenta plan y cuenta cemtro de costo
                    $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan,fkidcentrodecosto) VALUES  
                        ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan','$detfkidcentrodecosto')";

                    // $resultInsDeta = pg_query($queryInsDeta);
                    $resultInsDeta = DB::connection($connection)->select($queryInsDeta);
                    $k = 1;
                    //echo "<p><i> insero DETALLE con id plan y c. costo.. </i></p>";
                } else {
    
                    //$detfkidcuentaplan = 5; // ??????????????    sacar            
    
                    if ($detfkidcuentaplan > 0) {
                        $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan) VALUES  
                            ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan')";
                        // $resultInsDeta = pg_query($queryInsDeta);
                        $resultInsDeta = DB::connection($connection)->select($queryInsDeta);
                        $k = 1;
                        //echo "<p><i> insero DETALLE con SOLO id plan y SIN c. costo.. </i></p>";
                    }
                }
            }//si hay movimieto
            //if ($k == 0)
                //echo "<p><i> NO SE AGREGO DETALLE i -->> " . $i . " </i></p>";
            $i++;
        }//while

        return $comprobante->idcomprobante;

    }//funcion asiento venta contado


    function obtNumComprobanteYactNro($fkidComptipo, $connection) {
        
        $numCompSgte = 0;
        $queryTransac = "SELECT numeroactual FROM comprobantetipo WHERE idcomprobantetipo = '$fkidComptipo' ";
        
        $resultTransac = DB::connection($connection)->select($queryTransac);

        if (sizeof($resultTransac) <= 0) {
            return 0;
        }
        $filaTran = $resultTransac[0];
        $numCompActual = $filaTran->numeroactual;
        $numCompSgte = $numCompActual + 1;
        
        $queryAct = "UPDATE comprobantetipo SET numeroactual = $numCompSgte WHERE idcomprobantetipo=$fkidComptipo;";
        $resultAct = DB::connection($connection)->select($queryAct);
        
        return $numCompSgte;
    }


    function cobroCuotaVtaCred($idVentaCob,$idCobro, $descripCuota, $fechaCobro,$mtoCobro, $idUsuarioActual, $connection) {

        $queryVta = "SELECT fecha,fkidcliente,fkidmoneda,tc,mtovtabruta,mtototventa,descuentoporcentaje,recargoporcentaje,fkidtipocontacredito,anticipo 
            FROM venta WHERE idventa = '$idVentaCob' ";

        // $resultVta = pg_query($queryVta);
        $resultVta = DB::connection($connection)->select($queryVta);

        if (sizeof($resultVta) <= 0) {
            return -1;
        }
        $filaVta        = $resultVta[0];
        $fechaVta       = $filaVta->fecha; //"2020-03-23 19:12:50";
        $idCliente      = $filaVta->fkidcliente; //1;
        $idMonetaVta    = $filaVta->fkidmoneda; //1;
        $TipoCambioVta  = $filaVta->tc; //6.96;
        $mtoVtaBruto    = $filaVta->mtovtabruta; //11860.40;
        $mtoVtaNeto     = $filaVta->mtototventa; //10081.34;
        $porcenDescto   = $filaVta->descuentoporcentaje; //20;
        $porcenIncremen = $filaVta->recargoporcentaje; //5;
        $tipoContaCred  = $filaVta->fkidtipocontacredito; //5; 1 es contado y 2 es credito
        $mtoAnticipo    = $filaVta->anticipo;
    
        $claveTransac = "CV"; //cobro cuota por venta
        
        $queryClient = "SELECT nombre,apellido FROM cliente WHERE idcliente = '$idCliente' ";
        // $resultClient = pg_query($queryClient);
        $resultClient = DB::connection($connection)->select($queryClient);

        if (sizeof($resultClient) <= 0) {
            return -2;
        }
        $filaClient = $resultClient[0];
        $apellido = $filaClient->apellido == null ? '' : $filaClient->apellido;
        $varNombCliente = $filaClient->nombre." ".$apellido;
        
    
        $queryTransac = "SELECT idctbtransacautomaticas FROM ctbtransacautomaticas WHERE tipotransac = '$claveTransac' and estado= 'A' ";
        // $resultTransac = pg_query($queryTransac);
        $resultTransac = DB::connection($connection)->select($queryTransac);

        if (sizeof($resultTransac) <= 0) {
            return -3;
        }
        $filaTran = $resultTransac[0];
        $idTransAutom = $filaTran->idctbtransacautomaticas;
    
        $queryComp = "SELECT idctbcomprobautomat,fkidcomprobantetipo,contabilizar FROM ctbcomprobautomat  WHERE fkidctbtransacautomaticas ='$idTransAutom'";
        // $resultComp = pg_query($queryComp);
        $resultComp = DB::connection($connection)->select($queryComp);

        if (sizeof($resultComp) <= 0) {
            return -4;
        }
        $filaComp = $resultComp[0];
        $idctbComprobAutom = $filaComp->idctbcomprobautomat;
        $fkidComptipo = $filaComp->fkidcomprobantetipo;
        $contabilizar = $filaComp->contabilizar;
    
        $varCodComprobante = $this->obtNumComprobanteYactNro($fkidComptipo, $connection); //obtiene el numero de comprobante segun el tipo
        $varTipoPago = 1; //???? ventas debe decir tipo de pago por lo pronto se asume en efectivo
       
        $varGlosa = "Cobro por venta al credito Nro. " . $idVentaCob." Por: ".$descripCuota." IdCobro: ".$idCobro." Monto: " . $mtoCobro . "  Fecha: " . $fechaCobro;
        
        $varFkidperiodocontable = -1; // ????? obtPeriodoContable($fechaCobro); Ver Henry

        $queryperiodo = "SELECT p.idperiodocontable 
            FROM periodocontable p, gestioncontable g  
            WHERE p.fkidgestioncontable = g.idgestioncontable AND p.estado = 'A' AND g.estado = 'A' AND p.fechaini <= '$fechaCobro' AND p.fechafin >= '$fechaCobro'";

        $resultperiodo = DB::connection($connection)->select($queryperiodo);

        if (sizeof($resultperiodo) <= 0) return -5;

        $varFkidperiodocontable = $resultperiodo[0]->idperiodocontable;
    
        //echo "<p><i> insertando cabecera en comprobante </i></p>";
        $varNroVenta = "Cobro: " . $idCobro;
    
        $queryIns = "INSERT INTO comprobante (codcomprobante,referidoa,fecha,nrodoc,glosa,tipocambio,idusuario,estado,fkidcomprobantetipo,fkidtipopago,fkidmoneda,contabilizar,esautomatico,fkidperiodocontable) 
            VALUES  ('$varCodComprobante','$varNombCliente','$fechaCobro','$varNroVenta','$varGlosa','$TipoCambioVta','$idUsuarioActual','A','$fkidComptipo','$varTipoPago','$idMonetaVta','$contabilizar','S','$varFkidperiodocontable' ) RETURNING idcomprobante";

        // $resultIns = pg_query($queryIns);
        $resultIns = DB::connection($connection)->select($queryIns);

        $filaIms = $resultIns[0];
        $varFkIdComprobante = $filaIms->idcomprobante;
    
        $queryDetaComp = "SELECT idctbdetallecomprobautomat,glosamenor, debe,haber,fkidctbcomprobautomat,fkidctbdefictasasientautom,fkidcuentaplan,fkidcentrodecosto 
            FROM ctbdetallecomprobautomat  WHERE fkidctbcomprobautomat ='$idctbComprobAutom'";

        // $resultDetaComp = pg_query($queryDetaComp);
        $resultDetaComp = DB::connection($connection)->select($queryDetaComp);

        if (sizeof($resultDetaComp) <= 0) {
            return -6;
        }
        $i = 1;
        // while ($filaDetaComp = pg_fetch_row($resultDetaComp)) {
        foreach ($resultDetaComp as $key => $filaDetaComp) {
            //echo "<p><i> Dentro de while -->> " . $i . " </i></p>";
            $detIdctbdetallecomprobautomat  = $filaDetaComp->idctbdetallecomprobautomat;
            $detGlosaMenor                  = $filaDetaComp->glosamenor;
            $detDebe                        = $filaDetaComp->debe;
            $detHaber                       = $filaDetaComp->haber;
            $detfkidctbcomprobautomat       = intval($filaDetaComp->fkidctbcomprobautomat);
            $detfkidctbdefictasasientautom  = intval($filaDetaComp->fkidctbdefictasasientautom);
            $detfkidcuentaplan              = intval($filaDetaComp->fkidcuentaplan);
            $detfkidcentrodecosto           = intval($filaDetaComp->fkidcentrodecosto);
    
            $detGlosaMenor = "Cobro Nro. " . $idCobro;
            $debe = $haber = 0;

            if ($i == 1) { 
                $debe = $mtoCobro;
            }
            if ($i == 2) {
                $haber = $mtoCobro;
            }
          
            $k = 0; //pa saber sei agrega detalle
            if ($debe != 0 || $haber != 0) {
                if ($detfkidcuentaplan > 0 and $detfkidcentrodecosto > 0) {//si cuenta plan y cuenta cemtro de costo
                    $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan,fkidcentrodecosto) VALUES  
                        ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan','$detfkidcentrodecosto')";

                    // $resultInsDeta = pg_query($queryInsDeta);
                    $resultInsDeta = DB::connection($connection)->select($queryInsDeta);
                    $k = 1;
                } else {
    
                    //$detfkidcuentaplan = 5; // ??????????????    sacar            
    
                    if ($detfkidcuentaplan > 0) {
                        $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan) VALUES  
                            ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan')";

                        // $resultInsDeta = pg_query($queryInsDeta);
                        $resultInsDeta = DB::connection($connection)->select($queryInsDeta);
                        $k = 1;
                    }
                }
            }//si hay movimieto
            //if ($k == 0)
                //echo "<p><i> NO SE AGREGO DETALLE i -->> " . $i . " </i></p>";
            $i++;
        }//while
        return $varFkIdComprobante;
    }//funcion cobro cuota/anticipo venta al credito




    function asienAutomCompraContadoCredito($idCompra, $idUsuarioActual, $connection) {
        
        $queryVta = "SELECT fecha,fkidproveedor,fkidmoneda,mtototcompra,anticipopagado,tipo,tc FROM compra WHERE idcompra = '$idCompra' ";
        // $resultVta = pg_query($queryVta);
        $resultVta = DB::connection($connection)->select($queryVta);

        if (sizeof($resultVta) <= 0) {
            return -1;
        }
        $filaVta        = $resultVta[0];
        
        $fechaCompra     = $filaVta->fecha; 
        $idProveedor     = $filaVta->fkidproveedor; 
        $idMonetaCompra  = $filaVta->fkidmoneda; 
        $mtocompra       = $filaVta->mtototcompra;
        $anticipoCompra  = $filaVta->anticipopagado;
        $tipoCompra      = $filaVta->tipo;    
        $TipoCambioComp  = $filaVta->tc;// 6.96;
        
        if($tipoCompra == 'C')  $claveTransac = "CC"; else $claveTransac = "CCR";
        
        $queryClient = "SELECT nombre,apellido FROM proveedor WHERE idproveedor = '$idProveedor' ";
        // $resultClient = pg_query($queryClient);
        $resultClient = DB::connection($connection)->select($queryClient);

        if (sizeof($resultClient) <= 0) {
            return -2;
        }
        $filaClient = $resultClient[0];
        $apellido = $filaClient->apellido == null ? '' : $filaClient->apellido;
        $varNombCliente = $filaClient->nombre." ".$apellido;       
    
        $queryTransac = "SELECT idctbtransacautomaticas FROM ctbtransacautomaticas WHERE tipotransac = '$claveTransac' AND estado= 'A' ";
        // $resultTransac = pg_query($queryTransac);
        $resultTransac = DB::connection($connection)->select($queryTransac);

        if (sizeof($resultTransac) <= 0) {
            return -3;
        }
        $filaTran = $resultTransac[0];
        $idTransAutom = $filaTran->idctbtransacautomaticas;
    
        $queryComp = "SELECT idctbcomprobautomat,fkidcomprobantetipo,contabilizar FROM ctbcomprobautomat  WHERE fkidctbtransacautomaticas ='$idTransAutom'";
        // $resultComp = pg_query($queryComp);
        $resultComp = DB::connection($connection)->select($queryComp);

        if (sizeof($resultComp) <= 0) {
            return -4;
        }
        $filaComp = $resultComp[0];
        $idctbComprobAutom = $filaComp->idctbcomprobautomat;
        $fkidComptipo = $filaComp->fkidcomprobantetipo;
        $contabilizar = $filaComp->contabilizar;
    
        $varCodComprobante = $this->obtNumComprobanteYactNro($fkidComptipo, $connection); //obtiene el numero de comprobante segun el tipo
        $varTipoPago = 1; //???? ventas debe decir tipo de pago por lo pronto se asume en efectivo
    
        if($tipoCompra == 'C'){ //si es al contado
            $varGlosa = "Compra al contado Nro. " . $idCompra . " Monto total neto: " . $mtocompra . "  Fecha: " . $fechaCompra;
        }else{
            $varGlosa = "Compra al credito Nro. " . $idCompra . " Monto total neto: " . $mtocompra . "  Fecha: " . $fechaCompra. " Anticipo: ".$anticipoCompra;
        }
        
        $varFkidperiodocontable = 1; // ????? obtPeriodoContable($fechaVta); Ver Henry 


        $queryperiodo = "SELECT p.idperiodocontable 
            FROM periodocontable p, gestioncontable g  
            WHERE p.fkidgestioncontable = g.idgestioncontable AND p.estado = 'A' AND g.estado = 'A' AND p.fechaini <= '$fechaCompra' AND p.fechafin >= '$fechaCompra'";

        $resultperiodo = DB::connection($connection)->select($queryperiodo);

        if (sizeof($resultperiodo) <= 0) return -5;

        $varFkidperiodocontable = $resultperiodo[0]->idperiodocontable;


    
        $queryDefCta = "SELECT  valor FROM ctbdefictasasientautom  WHERE clave ='L'";
        $resultDefCta = DB::connection($connection)->select($queryDefCta);

        if (sizeof($resultDefCta) <= 0) {
            return -6;
        }
        $filaDefCta  = $resultDefCta[0];
        $varCredFisc = intval($filaDefCta->valor);    
        
        $calCredFisc   = round(($mtocompra * $varCredFisc) / 100, 2);
        $calProducto   = $mtocompra - $calCredFisc;
        $calBanco      = round($mtocompra, 2); 
    
        $varNroVenta = "Comp : " . $idCompra;

        $comprobante = new Comprobante();
        $comprobante->setConnection($connection);

        $comprobante->codcomprobante = $varCodComprobante;
        $comprobante->referidoa = $varNombCliente;
        $comprobante->fecha = $fechaCompra;
        $comprobante->nrodoc = $varNroVenta;
        $comprobante->glosa = $varGlosa;
        $comprobante->tipocambio = $TipoCambioComp;
        $comprobante->idusuario = $idUsuarioActual;
        $comprobante->estado = 'A';
        $comprobante->fkidcomprobantetipo = $fkidComptipo;
        $comprobante->fkidtipopago = $varTipoPago;
        $comprobante->fkidmoneda = $idMonetaCompra;
        $comprobante->contabilizar = $contabilizar;
        $comprobante->esautomatico = 'S';
        $comprobante->fkidperiodocontable = $varFkidperiodocontable;
        
        $comprobante->save();
    
        $varFkIdComprobante = $comprobante->idcomprobante;
    
    
        $queryDetaComp = "SELECT idctbdetallecomprobautomat,glosamenor, debe,haber,fkidctbcomprobautomat,fkidctbdefictasasientautom,fkidcuentaplan,fkidcentrodecosto 
            FROM ctbdetallecomprobautomat  WHERE fkidctbcomprobautomat ='$idctbComprobAutom'";

        // $resultDetaComp = pg_query($queryDetaComp);
        $resultDetaComp = DB::connection($connection)->select($queryDetaComp);

        if (sizeof($resultDetaComp) <= 0) {
            return -7;
        }
        $i = 1;
        // while ($filaDetaComp = pg_fetch_row($resultDetaComp)) {
        foreach ($resultDetaComp as $key => $filaDetaComp) {
            //echo "<p><i> Dentro de while -->> " . $i . " </i></p>";
            $detIdctbdetallecomprobautomat  = $filaDetaComp->idctbdetallecomprobautomat;
            $detGlosaMenor                  = $filaDetaComp->glosamenor;
            $detDebe                        = $filaDetaComp->debe;
            $detHaber                       = $filaDetaComp->haber;
            $detfkidctbcomprobautomat       = intval($filaDetaComp->fkidctbcomprobautomat);
            $detfkidctbdefictasasientautom  = intval($filaDetaComp->fkidctbdefictasasientautom);
            $detfkidcuentaplan              = intval($filaDetaComp->fkidcuentaplan);
            $detfkidcentrodecosto           = intval($filaDetaComp->fkidcentrodecosto);
    
            $detGlosaMenor = "Compra Nro. " . $idCompra;
            $debe = $haber = 0;
            if ($i == 1) { 
                $debe = $calProducto;
            }
            if ($i == 2) {
                $debe = $calCredFisc;
            }
            if ($i == 3){ 
                $haber = $calBanco;
            }
            
            $k = 0; //pa saber sei agrega detalle
            if ($debe != 0 || $haber != 0) {
                if ($detfkidcuentaplan > 0 and $detfkidcentrodecosto > 0) {//si cuenta plan y cuenta cemtro de costo
                    $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan,fkidcentrodecosto) 
                        VALUES  ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan','$detfkidcentrodecosto')";

                    // $resultInsDeta = pg_query($queryInsDeta);
                    $resultInsDeta = DB::connection($connection)->select($queryInsDeta);
                    $k = 1;
                    //echo "<p><i> insero DETALLE con id plan y c. costo.. </i></p>";
                } else {
    
                   // $detfkidcuentaplan = 5; // ??????????????    sacar            
    
                    if ($detfkidcuentaplan > 0) {
                        $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan) 
                            VALUES  ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan')";

                        // $resultInsDeta = pg_query($queryInsDeta);
                        $resultInsDeta = DB::connection($connection)->select($queryInsDeta);
                        $k = 1;
                        //echo "<p><i> insero DETALLE con SOLO id plan y SIN c. costo.. </i></p>";
                    }
                }
            }//si hay movimieto
            //if ($k == 0)
                //echo "<p><i> NO SE AGREGO DETALLE i -->> " . $i . " </i></p>";
            $i++;
        }//while
        return $varFkIdComprobante;
    }//funcion compras al contado y al credito




    function pagosComprasCredito($idCompra,$idPago,$descripCuota, $fechaPago,$mtoPago, $idUsuarioActual, $connection) {
        
        $queryVta = "SELECT fecha,fkidproveedor,fkidmoneda,mtototcompra,anticipopagado,tipo,tc FROM compra WHERE idcompra = '$idCompra' ";

        $resultVta = DB::connection($connection)->select($queryVta);

        if (sizeof($resultVta) <= 0) {
            return -1;
        }
        $filaVta        = $resultVta[0];
        
        $fechaCompra     = $filaVta->fecha; 
        $idProveedor     = $filaVta->fkidproveedor; 
        $idMonetaCompra  = $filaVta->fkidmoneda; 
        $mtocompra       = $filaVta->mtototcompra;
        $anticipoCompra  = $filaVta->anticipopagado;
        $tipoCompra      = $filaVta->tipo;    
        $TipoCambioComp  = $filaVta->tc;// 6.96;
        
        $claveTransac = "PC";
        
        $queryClient = "SELECT nombre,apellido FROM proveedor WHERE idproveedor = '$idProveedor' ";
        $resultClient = DB::connection($connection)->select($queryClient);

        if (sizeof($resultClient) <= 0) {
            return -2;
        }
        $filaClient = $resultClient[0];

        $apellido = $filaClient->apellido == null ? '' : $filaClient->apellido;
        $varNombCliente = $filaClient->nombre." ".$apellido;       
    
        $queryTransac = "SELECT idctbtransacautomaticas FROM ctbtransacautomaticas WHERE tipotransac = '$claveTransac' and estado= 'A' ";
        $resultTransac = DB::connection($connection)->select($queryTransac);

        if (sizeof($resultTransac) <= 0) {
            return -3;
        }
        $filaTran = $resultTransac[0];
        $idTransAutom = $filaTran->idctbtransacautomaticas;
    
        $queryComp = "SELECT idctbcomprobautomat,fkidcomprobantetipo,contabilizar FROM ctbcomprobautomat  WHERE fkidctbtransacautomaticas ='$idTransAutom'";
        $resultComp = DB::connection($connection)->select($queryComp);

        if (sizeof($resultComp) <= 0) {
            return -4;
        }
        $filaComp = $resultComp[0];
        $idctbComprobAutom  = $filaComp->idctbcomprobautomat;
        $fkidComptipo       = $filaComp->fkidcomprobantetipo;
        $contabilizar       = $filaComp->contabilizar;
    
        $varCodComprobante = $this->obtNumComprobanteYactNro($fkidComptipo, $connection); //obtiene el numero de comprobante segun el tipo
        $varTipoPago = 1; //???? ventas debe decir tipo de pago por lo pronto se asume en efectivo
        
     
        $varGlosa = "Pago por compra al credito Nro. " . $idCompra." Por: ".$descripCuota." idPago: ".$idPago." Monto: " . $mtoPago . "  Fecha: " . $fechaPago;
               
        $varFkidperiodocontable = 1; // ????? obtPeriodoContable($fechaVta); Ver Henry 


        $queryperiodo = "SELECT p.idperiodocontable 
            FROM periodocontable p, gestioncontable g  
            WHERE p.fkidgestioncontable = g.idgestioncontable AND p.estado = 'A' AND g.estado = 'A' AND p.fechaini <= '$fechaPago' AND p.fechafin >= '$fechaPago'";

        $resultperiodo = DB::connection($connection)->select($queryperiodo);

        if (sizeof($resultperiodo) <= 0) return -5;

        $varFkidperiodocontable = $resultperiodo[0]->idperiodocontable;



        $varNroVenta = "Pago : " . $idPago;
    
        $queryIns = "INSERT INTO comprobante (codcomprobante,referidoa,fecha,nrodoc,glosa,tipocambio,idusuario,estado,fkidcomprobantetipo,fkidtipopago,fkidmoneda,contabilizar,esautomatico,fkidperiodocontable) 
            VALUES  ('$varCodComprobante','$varNombCliente','$fechaPago','$varNroVenta','$varGlosa','$TipoCambioComp','$idUsuarioActual','A','$fkidComptipo','$varTipoPago','$idMonetaCompra','$contabilizar','S','$varFkidperiodocontable' ) RETURNING idcomprobante";
        
        $resultIns = DB::connection($connection)->select($queryIns);

        $filaIms = $resultIns[0];
        $varFkIdComprobante = $filaIms->idcomprobante;
    
    
        $queryDetaComp = "SELECT idctbdetallecomprobautomat,glosamenor, debe,haber,fkidctbcomprobautomat,fkidctbdefictasasientautom,fkidcuentaplan,fkidcentrodecosto 
            FROM ctbdetallecomprobautomat  WHERE fkidctbcomprobautomat ='$idctbComprobAutom'";

        $resultDetaComp = DB::connection($connection)->select($queryDetaComp);

        if (sizeof($resultDetaComp) <= 0) {
            return -6;
        }
        $i = 1;
        // while ($filaDetaComp = pg_fetch_row($resultDetaComp)) {
        foreach ($resultDetaComp as $key => $filaDetaComp) {
            $detIdctbdetallecomprobautomat  = $filaDetaComp->idctbdetallecomprobautomat;
            $detGlosaMenor                  = $filaDetaComp->glosamenor;
            $detDebe                        = $filaDetaComp->debe;
            $detHaber                       = $filaDetaComp->haber;
            $detfkidctbcomprobautomat       = intval($filaDetaComp->fkidctbcomprobautomat);
            $detfkidctbdefictasasientautom  = intval($filaDetaComp->fkidctbdefictasasientautom);
            $detfkidcuentaplan              = intval($filaDetaComp->fkidcuentaplan);
            $detfkidcentrodecosto           = intval($filaDetaComp->fkidcentrodecosto);
    
            $detGlosaMenor = "Pago Nro. " . $idPago;
            $debe = $haber = 0;
            if ($i == 1) { 
                $debe = $mtoPago;
            }
            if ($i == 2) {
                $haber = $mtoPago;
            }
         
            
            $k = 0; //pa saber sei agrega detalle
            if ($debe != 0 || $haber != 0) {
                if ($detfkidcuentaplan > 0 and $detfkidcentrodecosto > 0) {//si cuenta plan y cuenta cemtro de costo
                    $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan,fkidcentrodecosto) 
                        VALUES  ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan','$detfkidcentrodecosto')";

                    $resultInsDeta = DB::connection($connection)->select($queryInsDeta);

                    $k = 1;
                } else {
                    if ($detfkidcuentaplan > 0) {
                        $queryInsDeta = "INSERT INTO comprobantecuentadetalle (glosamenor, debe, haber,fkidcomprobante,fkidcuentaplan) 
                            VALUES  ('$detGlosaMenor','$debe','$haber','$varFkIdComprobante','$detfkidcuentaplan')";

                        $resultInsDeta = DB::connection($connection)->select($queryInsDeta);
                        $k = 1;
                        //echo "<p><i> insero DETALLE con SOLO id plan y SIN c. costo.. </i></p>";
                    }
                }
            }//si hay movimieto
            $i++;
        }//while
        return $varFkIdComprobante;
    }//funcion pagos por compras al credito
    

}



