<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<?php
 function conexBD(){
     $host = "localhost"; 
     $port = "5432";
     $user = "postgres";
     $pass = "smainn2328";
     $dbname = "enlinea247";
     $connect = pg_connect("host=$host port=$port user=$user password=$pass dbname=$dbname");
     return($connect);
 } 

 
 function obtnerArchTempoPlanCuenta($usuarLogin) {
    //se debe crear una copia de cuentaplantemporal con un nombre aleatorioe unico puede ser
    $hoy = date("Y-m-d H:i:s");
    $hoy = str_replace(' ', '_', $hoy);
    $hoy = str_replace('-', '_', $hoy);
    $hoy = str_replace(':', '_', $hoy);
    $archTempoCtaPlanTemp = "cuentaPlanTemp_".$usuarLogin.$hoy;
    echo "Creando tenporal de plan de cuenta...->".$archTempoCtaPlanTemp."<-<br />";
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
    $result = pg_query($query);
    
    $query = "INSERT INTO $archTempoCtaPlanTemp(idcuentaplantemp,codcuenta,nombre,esctadetalle,fkidcuentaplantemppadre,fkidcuentaplantipo )  SELECT idcuentaplan,codcuenta,nombre,esctadetalle,fkidcuentaplanpadre,fkidcuentaplantipo FROM cuentaplan ORDER BY idcuentaplan;";
    $result = pg_query($query);
    return ($archTempoCtaPlanTemp);
}

 

 function obtnerArchTempoBG($usuarLogin){
     //se debe crear una copia de "EerrTemporal" con un nombre aleatorioe unico puede ser]}
     //temPlcCtaUsrFechaHora
     $hoy = date("Y-m-d H:i:s");
    $hoy = str_replace(' ', '_', $hoy);
    $hoy = str_replace('-', '_', $hoy);
    $hoy = str_replace(':', '_', $hoy);
    $archTempoBG = "balgentemp_" . $usuarLogin . $hoy;
    echo "Creando tenporal para Balance Gral...->" .$archTempoBG. "<-<br />";
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
    $result = pg_query($query);
    return ($archTempoBG);
 }

 function borrarTempo($tabla){
     $query = "DROP TABLE $tabla;";
     $result = pg_query($query);
 }
 
 
 function escribirEnTempoBalGeneral($tipo,$codcuenta,$descripcion,$valor,$tipocuenta,$nivelCodCuenta,$archTemp){
     //echo "Procesando escribir<br/>";
     $query = "INSERT INTO $archTemp (tipo,codcuenta,descripcion,valor,tipocuenta,nivelcod) VALUES  ('$tipo','$codcuenta','$descripcion','$valor','$tipocuenta','$nivelCodCuenta')";
     $result = pg_query($query);
     return;
 }
 
 function obtDigiNivel($cad, $niv) {//obtiene los digitos de un nivel 1.1.11.11.000
    $difResult = $cadNiv = "";
    $band=$contNiv=$i=$c=0;
    $n = strlen($cad);
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
 
 function obtenerNivelCeros($codCuenta){// formato 1.0.0.00.00
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
 
 function sumasAcumCtasDetalle_BG_EERR($fechaIni,$fechaFin,$idMoneda,$para,$archTempoCtaPlanTemp){
     //actualiza tabla cuentaplantemporal con debe,hbaer,saldo $para=1 Balance general $para = 2 es EERR para las cuenta de detalle
    //************************   order by   Y   COSTO  S en eerr 16/11/2019 17:00 
    if($para==1){//balnace general
        $queryCtaPlanDeta = "select idcuentaplan from cuentaplan where esctadetalle='S' and fkidcuentaplantipo IN (select idcuentaplantipo from cuentaplantipo where abreviacion = 'A' or abreviacion = 'P' or abreviacion = 'C') order by codcuenta;"; //Act.Pasv,CapPat
    }else{//EERR
        $queryCtaPlanDeta = "select idcuentaplan from cuentaplan where esctadetalle='S' and fkidcuentaplantipo IN (select idcuentaplantipo from cuentaplantipo where abreviacion = 'I' or abreviacion = 'S' or abreviacion = 'G') order by codcuenta;"; //Ing.Costo,Gasto
    }
    $resultCtaPlanDeta = pg_query($queryCtaPlanDeta);
    $archTempoLibMay="";
    $saldoAnt=0;
    $escribirTempoLM=false;
    $paraBG_EERR = true;
    $i = 0;
    $arr = [];
    while($filaCtaPlanDeta = pg_fetch_row($resultCtaPlanDeta)){//para cada cuendta detalle de olan de cuenta A,P,C obtener su libro mayor
        $i++;
        $saldo = libroMayorUnaCuenta($filaCtaPlanDeta[0], $fechaIni, $fechaFin, $idMoneda, $archTempoLibMay, $saldoAnt,$escribirTempoLM,$paraBG_EERR,$archTempoCtaPlanTemp);
        array_push($arr, [$filaCtaPlanDeta[0], $saldo]);
    }
 }//funcion lm
 
 function sumarPorNivelessCuentasPrincipales($archTempo){
     //Obtener debe, haber y saldo para todas las cuentas padres en el architempo
     echo "<p><i>Procesando suma de cuentas principales</i></p>";
     $cont=0;
     $idCuentaN1 = $idCuentaN2 = $idCuentaN3 = $idCuentaN4 = 0;
     $queryPlanCta = "select idcuentaplantemp,codcuenta,debe,haber,saldo from $archTempo order by codcuenta;";
     $resultPlancuenta = pg_query($queryPlanCta);
     $cantReg = pg_num_rows($resultPlancuenta);
     $filaCtaPlanDeta = pg_fetch_row($resultPlancuenta); //obtiene 1er registro del cursor
     $codigoCuenta = $filaCtaPlanDeta[1];
     $niv1ant = obtDigiNivel($codigoCuenta,1);//obtiene los digitos del 1er nivel   
     $sumDebe1  = $sumHaber1 = 0;
     while($cont < $cantReg){//para cada cuendta del olan de cuenta        
         $sumDebe1  = $sumHaber1  = $sumSaldo1 = 0;
         $niv1ant1 = obtDigiNivel($codigoCuenta,1);//obtiene los digitos del 1er nivel
         $idCuentaN1 = $filaCtaPlanDeta[0];
         echo "antes  de n1 ... codigoCuenta ".$codigoCuenta."---<br />";
         while($niv1ant1 == obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
            $sumDebe2  = $sumHaber2 =  $sumSaldo2 =0;
            $niv1ant2 = obtDigiNivel($codigoCuenta,2);//obtiene los digitos del 1er nivel
            $idCuentaN2 = $filaCtaPlanDeta[0];
            echo "antes  de n2 ... codigoCuenta ".$codigoCuenta."---<br />";
            while($niv1ant2 == obtDigiNivel($codigoCuenta,2) and $niv1ant1 == obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                $sumDebe3  = $sumHaber3 =  $sumSaldo3 = 0;
                $niv1ant3 = obtDigiNivel($codigoCuenta,3);//obtiene los digitos del 1er nivel
                $idCuentaN3 = $filaCtaPlanDeta[0];
                echo "antes  de n3 ... codigoCuenta ".$codigoCuenta."---<br />";
                while($niv1ant3 == obtDigiNivel($codigoCuenta,3) and $niv1ant2 == obtDigiNivel($codigoCuenta,2) and $niv1ant1 == obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                    $sumDebe4  = $sumHaber4 = $sumSaldo4 = 0;
                    $niv1ant4 = obtDigiNivel($codigoCuenta,4);//obtiene los digitos del 1er nivel
                    $idCuentaN4 = $filaCtaPlanDeta[0];
                    echo "antes  de n4 ... codigoCuenta ".$codigoCuenta."---<br />";
                    while($niv1ant4 == obtDigiNivel($codigoCuenta,4) and $niv1ant3 == obtDigiNivel($codigoCuenta,3) and $niv1ant2 == obtDigiNivel($codigoCuenta,2) and $niv1ant1 == obtDigiNivel($codigoCuenta,1) and $cont < $cantReg ){
                            echo "dentro  de n5 ... codigoCuenta ".$codigoCuenta."---<br />";
                            $sumDebe4  += $filaCtaPlanDeta[2];
                            $sumHaber4 += $filaCtaPlanDeta[3];
                            $sumSaldo4 += $filaCtaPlanDeta[4];
                            $filaCtaPlanDeta = pg_fetch_row($resultPlancuenta); //obtiene el siguiente regisyto ene el cursor
                            $codigoCuenta = $filaCtaPlanDeta[1];
                            $cont++;
                    }
                    $queryAct="UPDATE $archTempo SET debe = $sumDebe4, haber = $sumHaber4, saldo = $sumSaldo4 WHERE idCuentaPlanTemp=$idCuentaN4;";
                    $resultAct = pg_query($queryAct);  
                    $sumDebe3  += $sumDebe4;
                    $sumHaber3 += $sumHaber4;
                    $sumSaldo3 += $sumSaldo4;
                }
                $queryAct="UPDATE $archTempo SET debe = $sumDebe3, haber = $sumHaber3, saldo = $sumSaldo3 WHERE idCuentaPlanTemp=$idCuentaN3;";
                $resultAct = pg_query($queryAct);  
                $sumDebe2  += $sumDebe3;
                $sumHaber2 += $sumHaber3;
                $sumSaldo2 += $sumSaldo3;
            }
            $queryAct="UPDATE $archTempo SET debe = $sumDebe2, haber = $sumHaber2, saldo = $sumSaldo2 WHERE idCuentaPlanTemp=$idCuentaN2;";
            $resultAct = pg_query($queryAct);  
            $sumDebe1  += $sumDebe2;
            $sumHaber1 += $sumHaber2;
            $sumSaldo1 += $sumSaldo2;
         }
         //hacer algo con nivel 1
         $queryAct="UPDATE $archTempo SET debe = $sumDebe1, haber = $sumHaber1, saldo = $sumSaldo1 WHERE idCuentaPlanTemp=$idCuentaN1;";
         $resultAct = pg_query($queryAct);  
     }//fin contador de registros
 }//fin funcion
 
 
function balanceGeneral($fechaIni,$fechaFin,$moneda,$archPlanCuentaTemp,$archTempBG){
     //escribe en un artchivo temporal el resultado de EERR en un determinado periodo de fecha
     //echo "Procesando BALANCE GENERAL y...<br />";
     
     $archTempoCuentaPlan = $archPlanCuentaTemp;//obtnerArchTempoPlanCuenta();
     sumasAcumCtasDetalle_BG_EERR($fechaIni,$fechaFin,$moneda,1,$archTempoCuentaPlan);
     //echo 'FIN';
     //return;
     sumarPorNivelessCuentasPrincipales($archTempoCuentaPlan);
     $queryCtaPlanTempo  = "select idcuentaplantemp,codcuenta,nombre,saldo from  $archTempoCuentaPlan  where fkidcuentaplantipo IN (select idcuentaplantipo from cuentaplantipo where abreviacion = 'A' or abreviacion = 'P' or abreviacion = 'C') order by codcuenta;"; //Act.Pasv,CapPat
     $resultCtaPlanTempo = pg_query($queryCtaPlanTempo);
     $sumTotal = 0;
     
     while($filaCtaPlanTempo = pg_fetch_row($resultCtaPlanTempo)){
         $tipo          = "X";
         $idCuentaBusc  = $filaCtaPlanTempo[0];
         $codcuenta     = $filaCtaPlanTempo[1];
         $descripción   = $filaCtaPlanTempo[2];
         $valor         = $filaCtaPlanTempo[3];
         
         $nivelCodCuenta= obtenerNivelCeros($codcuenta);

         $queryAbrev  = "select abreviacion  from cuentaPlanTipo where idcuentaplantipo = (select fkidcuentaplantipo from cuentaplan where idcuentaplan = $idCuentaBusc)";
         $resultAbrev = pg_query($queryAbrev);
         $filaAbrev   = pg_fetch_array($resultAbrev);
         $tipocuenta  = $filaAbrev[0];
         escribirEnTempoBalGeneral($tipo,$codcuenta,$descripción,$valor,$tipocuenta,$nivelCodCuenta,$archTempBG);
     }//while
   
 }//fin balancd

 function libroMayorUnaCuenta($idCuentaBusc, $fechaIni, $fechaFin, $idMonedaLM, $archTempoLibMay, $saldoAnt, $escribirTempoLM, $paraBG_EERR, $archTempoCtaPlanTemp) {
    //escribe en archivo temporal los movimeintos de una cuenta en los comprobante en un determinado periodo de fechas
    //idMoneda si es 1 es por defecto moneda oficial
    echo "Procesa libro mayor de una cuenta...<br />";
    // $idCuentaPlan="";
    $saldoCuenta = $saldoAnt;
    $queryComp = "select idcomprobante, fecha,glosa,nrochequetarjeta,fkidmoneda,tipocambio from comprobante where fecha>='$fechaIni' and fecha<= '$fechaFin' and contabilizar='S' and deleted_at is null order by fecha ";
    $resultComp = pg_query($queryComp);
    //dd($resultDetaComp);
    $arr = [];
    $k_saldo = 0;
    echo '<p>ARC LIBRO MAY ' . $archTempoLibMay . '</p>' . '<br>';
    echo '<p>CUENTA BAL ' . $archTempoCtaPlanTemp . '</p>' . '<br>';
    $i = 0;
    while ($filaComp = pg_fetch_row($resultComp)) {//busca en cada comrpobante la cuenta del usr elije
        $i++;
        if ($paraBG_EERR == true) {//si se requiere LM para BG o EERR
            $queryDetaComp = "select sum(debe), sum(haber) from comprobantecuentadetalle where fkidcomprobante = $filaComp[0] and fkidcuentaplan=$idCuentaBusc and deleted_at is null";
        } else { //solo LM
            $queryDetaComp = "select debe, haber, fkidcuentaplan,glosamenor  from comprobantecuentadetalle where fkidcomprobante = $filaComp[0] and fkidcuentaplan=$idCuentaBusc and deleted_at is null";
        }
        $resultDetaComp = pg_query($queryDetaComp);
        $cantRegs = pg_num_rows($resultDetaComp);
        //echo "cuenta ".$idCuentaBusc." NUM REGISTROS -->>>> : ".$cantRegs."<br />";
        if ($cantRegs > 0) {// si hay registros de cuenta solicitada en detalle de comprobantes
           // echo "PROCESA idcuentabus -->>>> : ".$idCuentaBusc."<br />";
            $idcomprobanteVar = $filaComp[0];       //datos de encabezado de comprobantes
            $fechaCompVar = $filaComp[1];
            $glosaCompVar = $filaComp[2];
            $chequeCompVar = $filaComp[3];
            $idMonedaVar = $filaComp[4];
            $tipoCambioVar = $filaComp[5];

            $filaDetaComp = pg_fetch_array($resultDetaComp);
            if ($paraBG_EERR == false) {//solo para libro mayor y no para BG y EERR
                $debeVar = $filaDetaComp[0];   //datos de detalle de comprobante
                $haberVar = $filaDetaComp[1];
                $idCuentaPlan = $filaDetaComp[2];
                $glosaMenor = $filaDetaComp[3];

                $queryPlan = "select codcuenta, nombre from cuentaPlan where idcuentaplan =  $idCuentaPlan";
                $resultPlan = pg_query($queryPlan);
                $filaPlan = pg_fetch_array($resultPlan);
                $codCuentaPlan = $filaPlan[0];
                $nombreVar = $filaPlan[1];
            } else { //para BG o EERR
                //dd($filaDetaComp);
                if (is_null($filaDetaComp[0]))
                    $debeVar = 0;
                else
                    $debeVar = $filaDetaComp[0];
                if (is_null($filaDetaComp[1]))
                    $haberVar = 0;
                else
                    $haberVar = $filaDetaComp[1];
            }

            if ($k_saldo == 0 && $escribirTempoLM == true) {//indserta una sola vex el saldo anterior para cada cuenta
                $queryIns = "INSERT INTO $archTempoLibMay(idcuenta,codcuenta,nombre,saldo) VALUES ('$idCuentaPlan','$codCuentaPlan','$nombreVar','$saldoCuenta');";
                $resultIns = pg_query($queryIns);
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
            $queryAbrev = "select abreviacion  from cuentaPlanTipo where idcuentaplantipo = (select fkidcuentaplantipo from cuentaplan where idcuentaplan = $idCuentaBusc)";
            $resultAbrev = pg_query($queryAbrev);
            $filaAbrev = pg_fetch_array($resultAbrev);
            array_push($arr, $filaAbrev[0]);
            if ($filaAbrev[0] == 'A' || $filaAbrev[0] == 'S' || $filaAbrev[0] == 'G') { //Activo,Costos,Gastos
                $saldoCuenta = $saldoCuenta + ($debeVar - $haberVar);
            } //debe - haber
            if ($filaAbrev[0] == "P" || $filaAbrev[0] == "I" || $filaAbrev[0] == "C") { //Pasivo,Ingresos,CapitalPatru
                $saldoCuenta = $saldoCuenta + ($haberVar - $debeVar); //haber - debe
            }
            $queryTipoComp = "select descripcion from comprobantetipo where idcomprobantetipo = (select fkidcomprobantetipo from comprobante where idcomprobante = $idcomprobanteVar);";
            $resultTipoComp = pg_query($queryTipoComp);
            $filaTipoComp = pg_fetch_array($resultTipoComp);
            $tipoCompVar = $filaTipoComp[0];
            
         //   echo "id " . $idCuentaBusc . " idCuenta " . $idCuentaPlan . " cuenta " . $codCuentaPlan . " nombre " . $nombreVar . " SalAnt " . $saldoAnt . " fecha " . $fechaCompVar . " Tipo " . $tipoCompVar
        // //  . " Glosa " . $glosaCompVar . " concepto " . $glosaMenor . " cheque " . $chequeCompVar . " debe " . $debeVar .
        //   " haber " . $haberVar . " saldo " . $saldoCuenta . " monedaComp " . $idMonedaVar . " moneLM " . $idMonedaLM . " TC " . $tipoCambioVar . " escrTemLM " . $escribirTempoLM . "<br />";
            if ($escribirTempoLM == true) {
                $queryIns = "INSERT INTO $archTempoLibMay(idcuenta,codcuenta,nombre,saldoanterior,fecha,tipo,glosa,concepto,cheque,debe,haber,saldo) VALUES ('$idCuentaPlan','$codCuentaPlan','$nombreVar','$saldoAnt','$fechaCompVar','$tipoCompVar','$glosaCompVar','$glosaMenor','$chequeCompVar','$debeVar','$haberVar','$saldoCuenta');";
                $resultIns = pg_query($queryIns);
            }
            if ($paraBG_EERR == true) {//actualizar plan de cuenta temporal
                $queryAct = "UPDATE $archTempoCtaPlanTemp SET debe = $debeVar, haber = $haberVar, saldo = $saldoCuenta WHERE idCuentaplantemp=$idCuentaBusc;";
                $resultAct = pg_query($queryAct);
            }
        }//si hay datos
    }//while
    //echo 'INDICE =?=> ' . $i;
    //dd(['arr' => $arr, 'saldo' => $saldoCuenta]);
    return($saldoCuenta);
}//funcion libro  mayor


?>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <?php
        // put your code here
        set_time_limit(0);
        $connectX = conexBD();
        if (!$connectX) {
            echo "<p><i>No me conecte a BD en balace...!!!! </i></p>";
            return 0;
        }
        echo "Me conecte a BD Principal...<br />";
        
        
        //balance general
        $archPlanCuentaTemp = obtnerArchTempoPlanCuenta("roly");
        $archTempBG=obtnerArchTempoBG("rolyB");
        balanceGeneral("2018-01-01 00:00:00","2019-12-31 00:00:00",1,$archPlanCuentaTemp,$archTempBG);
        //borrarTempo($archPlanCuentaTemp);
        //borrarTempo($archTempBG);
        //echo 'Termino....';
        
        pg_close($connectX);
        ?>
    </body>
</html>
