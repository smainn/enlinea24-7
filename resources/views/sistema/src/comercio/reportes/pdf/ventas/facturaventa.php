<!DOCTYPE html>
<style>
  .primerCuadro {
    
    position: relative;
    top:-5%;
    left: -8%;
    width: 115%;
    min-height: 105px;

    height: auto;
    
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
  }

  .primerCuadro>.imagen {
    position: relative;
    margin-top: 20px;
    margin-left: 6%;
    top: 150px;
    left: 15%;
    width: 250px;
    height: 90px;
  }

  .primerCuadro>.cuadroNit {
    position: relative;
    top: -65px;
    left: 65%;
    border: 1px solid;
    border-radius: 5px;
    width: 28%;
    height: 65px;
  }

  .primerCuadro>.palabraOriginal {
    position: relative;
    top: -60px;
    left: 73%;
    font-size: 150%;
    font-weight: bold;
  }

  .primerCuadro>.palabraEnsenanza {
    position: relative;
    top: -60px;
    left: 67%;
    font-size: 70%;

  }

  .primerCuadro>.palabraFactura {
    position: relative;
    top: -50px;
    left: 40%;
    font-size: 250%;
    font-weight: bold;
  }

  .cuadroNit>.palabraNit {
    position: relative;
    top: -12px;
    left: 5%;
    font-weight: bold;

  }

  .cuadroNit>.espacioNit {
    position: relative;
    top: -43px;
    left: 55%;
    font-weight: bold;
  }

  .cuadroNit>.palabraNumFact {
    position: relative;
    top: -53px;
    left: 5%;
    font-size: 80%;
    font-weight: bold;
    letter-spacing: -0.5px;
  }

  .cuadroNit>.espacioNumFact {
    position: relative;
    top: -82px;
    left: 55%;
    font-size: 90%;
  }

  .cuadroNit>.palabraNumAutorizacion {
    position: relative;
    top: -91px;
    left: 5%;
    font-size: 80%;
    font-weight: bold;
    letter-spacing: -0.5px;
  }

  .cuadroNit>.espacioNumAutorizacion {
    position: relative;
    top: -121px;
    left: 55%;
    font-size: 90%;
  }

  .primerCuadro>.detalle {
    position: relative;
    border: 1px solid black;
    margin-top: -35px;
    left: 5%;
    width: 90%;
    height: auto;
    
    margin-bottom: 110px;
    border-collapse: collapse;
  }

  .th1 {
    background-color: black;
    padding: 2px;
    text-align: 5px;

    border: 1px solid black;
    color: white;
  }

  .td11 {
    border-right: 1px solid black;
    text-align: left;
    width: 10%;
    text-align: center;
    height: 10px;
  }

  .td12 {
    border-right: 1px solid black;
    text-indent: 5%;
    width: 75%;
  }

  .td13 {

    text-align: left;
    width: 15%;
    text-align: center;
  }

  .detalle>.cuadroArriba {
    position: relative;
    border: 1px solid;
    width: 100%;
    top: 0px;
    height: 15px;
    background-color: black;
  }

  .cuadroArriba>.palabracodigo {
    position: relative;
    left: 3%;
    top: -15px;
    color: white;
  }

  .cuadroArriba>.palabradescripcion {
    position: relative;
    left: 43%;
    top: -45px;
    color: white;
  }

  .cuadroArriba>.palabrasubtotal {
    position: relative;
    left: 83%;
    top: -75px;
    color: white;
  }

  .primerCuadro>.encabezado {
    position: relative;
    border: 1px solid;
    border-radius: 5px;
    left: 5%;
    top: -40px;
    width: 90%;
    height: 60px;
  }

  .encabezado>.palabralugaryFecha {
    position: relative;
    left: 3%;
    top: -5px;
  }

  .encabezado>.espaciolugaryFecha {
    position: absolute;
    left: 17%;
    top: 13px;
  }

  .encabezado>.palabrasenor {
    position: relative;
    left: 3%;
    top: -30px;
  }

  .encabezado>.espaciosenor {
    position: absolute;
    left: 17%;
    top: 36px;
  }

  .encabezado>.palabraalumno {
    position: relative;
    left: 3%;
    top: -55px;
  }

  .encabezado>.espacioalumno {
    position: absolute;
    left: 17%;
    top: 57px;
  }

  .encabezado>.palabranit {
    position: absolute;
    left: 70%;
    top: 20px;
  }

  .encabezado>.espacionit {
    position: absolute;
    left: 78%;
    top: 20px;
  }

  .primerCuadro>.total {
    position: relative;
    left: 5%;
    border: 1px solid black;
    bottom: 111px;
    width: 90%;
    margin-top: -112px;
    border-collapse: collapse;
    
  }

  .thtotal1 {
    border: 1px solid black;
    width: 70%;
    text-align: left;
    text-indent: 5%;
    padding: 4px;
  }

  .thtotal2 {
    border: 1px solid black;
    width: 15%;
  }

  .thtotal3 {
    border: 1px solid black;
    width: 15%;
  }
  .primerCuadro > .cuadrocodigoControl{
    position: relative;
    margin-top: 2%;
    bottom: 30px;
    left: 5%;
    border: 1px solid black;
    width: 62.5%;
    height: 20px;
    padding: 2px;
  }
  .cuadrocodigoControl > .palabraCodigoControl{
    position: relative;
    bottom: 63%;
    top: -15px;
  }
  .cuadrocodigoControl > .espacioCodigoControl{
    position: relative;
    bottom: 210%;
    left: 25%;
    top: -47px;
  }
  .primerCuadro > .cuadrofechalimite{
    position: relative;
    bottom: 70px;
    left: 5%;
    border: 1px solid black;
    width: 62.5%;
    height: 20px;
    padding: 2px;
    margin-top: 2%;
  }
  .primerCuadro > .palabrafechalimite {
    position: relative;
    top: -40px;
  }
  .primerCuadro > .palabraleyenda1{
    position: relative;
    bottom: 50px;
    margin-left: 7%;
    margin-right: 7%;
    align-content: center;
    font-size: 10px;
    text-align: center;
    font-weight: 600;
    
  }
  .primerCuadro > .palabraleyenda2{
    position: relative;
    bottom: 58px;
    margin-left: 15%;
    margin-right: 15%;
    align-content: center;
    font-size: 9px;
    text-align: center;
    top: -12px;
  }
  .primerCuadro > .cuadroQr{
    position: relative;
    margin-left: 16%;
    top: -160px;
    left: 67%;
    width: 100px;
    height: 90px;
  }
</style>

<?php 
    $name_mes_inicio = '';
    $meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    $years_inicio = date('Y', strtotime($factura->fecha));
    $dia_inicio = date("d", strtotime($factura->fecha));
    $mes_inicio = $meses[date("n", strtotime($factura->fecha)) - 1];
    
?>

<div class="primerCuadro" style="position: relative;">
  <img class="imagen" name="imagen" alt="imagen" id="imagen" src=<?php echo '.' . $logo ?>  />
  <div class="cuadroNit">
    
    <p class="palabraNit">NIT:</p>
    <p class="espacioNit"> <?= $dosificacion->nit ?> </p>
    <p class="palabraNumFact">Nº FACTURA:</p>
    <p class="espacioNumFact"> <?= $factura->numero ?> </p>
    <p class="palabraNumAutorizacion">Nº AUTORIZACION:</p>
    <p class="espacioNumAutorizacion"> <?= $dosificacion->numeroautorizacion ?> </p>

    <div style="position: absolute; width: 250px; height: auto; padding: 2px; top: 60px; left: -485px; text-align: center;">
      
      <p style="position: relative; top: -15px; font-weight: bold; font-size: 12px"> 
        <?= ($dosificacion->nombrecomercial == null ? $dosificacion->razonsocial : $dosificacion->nombrecomercial) ?> 
      </p>
      <p style="position: relative; top: -30px; font-weight: 400; font-size: 11px;"> 
        <?= ($dosificacion->tiposucursal == 'M' ? 'Casa Matriz' : 'Sucursal') ?> 
      </p>
      <p style="position: relative; top: -45px; font-weight: 400; font-size: 11px;"> 
        <?= ucwords($dosificacion->direccion) ?> 
      </p>
      <p style="position: relative; top: -60px; font-weight: 400; font-size: 11px;"> 
        <?= ucwords($dosificacion->zona) ?> 
      </p>
      <p style="position: relative; top: -75px; font-weight: 400; font-size: 10px;"> 
        <?= $dosificacion->telefono == null ? 'Telf.: '.'S/Telf.': 'Telf.: '.$dosificacion->telefono ?> 
      </p>
      <p style="position: relative; top: -90px; font-weight: 400; font-size: 10px;"> 
        <?= $dosificacion->ciudad.' - '.$dosificacion->pais ?> 
      </p>
    </div>


    

  </div>
  <div class="palabraOriginal">ORIGINAL</div>
  <div class="palabraEnsenanza" style="position: relative; width: 200px; height: auto; text-align: center;"> 
    <?= $dosificacion->descripcion ?> 
    
  </div>
  <div class="palabraFactura" style="position: relative;">
    FACTURA
  </div>
  
  <div class="encabezado">
    <p class="palabralugaryFecha">Lugar y Fecha:</p>
    <p class="espaciolugaryFecha"> <?= $dosificacion->ciudad ?>, <?= $dia_inicio.' de '.$mes_inicio.' de '.$years_inicio ?></p>
    <p class="palabrasenor">Señor(es):</p>
    <p class="espaciosenor"> <?= ucwords($factura->nombre) ?> </p>
    <!-- <p class="palabraalumno">Alumno(a):</p>
    <p class="espacioalumno">Diego Cabrera</p> -->
    <p class="palabranit">NIT/CI:</p>
    <p class="espacionit"><?php echo ($factura->nit == 0 || $factura->nit == null) ? 'S/N' : $factura->nit ?></p>
  </div>
  <!--<div class="detalle">      
        <div class="cuadroArriba">
          <p class="palabracodigo">CODIGO</p>
          <p class="palabradescripcion">DESCRIPCION</p>
          <p class="palabrasubtotal">SUBTOTAL</p>
        </div>
        <p>hola</p>
      </div>-->
  <table class="detalle">
    <tr>
      <th class="th1">CODIGO</th>
      <th class="th1">DESCRIPCION</th>
      <th class="th1">SUBTOTAL</th>
    </tr>

    <?php foreach ($detalle as $key => $value) { ?>
    
      <tr>
          <td class="td11">
              <p><?= $value->codigo ?></p>
          </td>
          <td class="td12">
            <p><?= ucwords($value->producto) ?></p>
          </td>
          <td class="td13">
            <?php $subtotal = $value->cantidad*$value->precio*($value->descuento/100); ?>
            <p>
              <?= number_format((float)round( $value->cantidad*$value->precio -  $value->cantidad*$value->precio*($value->descuento/100) ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?>
            </p>
          </td>
      </tr>
    <?php } ?>
    <?php if ($venta->notas != null) { ?>
      <tr>
        <td class="td11" >
          
        </td>
        <td class="td12" style=" padding-left: 29px; text-align: left; text-indent: 0%; padding-top: -12px; padding-bottom: 5px;">
          
          <?= $venta->notas ?>
        </td>
        <td class="td13">
          
        </td>
      </tr>
    <?php } ?>
    
  </table>
  <table class="total">
    <tr>
      <?php $decimal = (number_format($venta->total, 2, '.', '') * 100) % 100 ?>
      <th class="thtotal1">Son: <?= ucwords($monto) ?> &nbsp; <?= ($decimal < 10)?'0'.$decimal:$decimal ?>/100 Bolivianos </th>
      <th style="background-color: black;color: white;" class="thtotal2">TOTAL Bs.</th>
      <th class="thtotal3"> <?= number_format((float)round( $venta->total ,2, PHP_ROUND_HALF_DOWN),2,'.',',') ?> </th>
    </tr>


  </table>
  <div class="cuadrocodigoControl">
    <p class="palabraCodigoControl">Codigo de control:</p>
    <p class="espacioCodigoControl"> <?= $factura->codigodecontrol ?> </p>
  </div>
  <?php $date = explode('-', $dosificacion->fechalimiteemision);?>
  <div class="cuadrofechalimite">
    <p style="position: relative; top: -15px;">Fecha Limite Emision:</p>
    <p style="position: relative; left: 30%; top: -45px;"> <?= $date[2].'/'.$date[1].'/'.$date[0] ?> </p>
  </div>
  <p class="palabraleyenda1">
    "<?= $dosificacion->leyenda1piefactura ?>"
    </p>
    <p class="palabraleyenda2">
      "<?= $dosificacion->leyenda2piefactura ?>"
    </p>
    <div class="cuadroQr">
      <img src=<?= '.'.$factura->codigoqr ?> style='width: 100%; height: 100%' alt="Sin QR">
    </div>
</div>