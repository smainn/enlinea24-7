<!DOCTYPE html>
<style>
  .primerCuadro {
    margin: auto;
    position: relative;
    left: 17%;
    width: 66%;
    min-height: 800px;

    height: auto;
    border: 1px solid;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 90%;

  }

  .primerCuadro>.imagen {
    position: relative;
    top: 20px;
    left: 10%;
    width: 15%;
    height: 80px;
  }

  .primerCuadro>.cuadroNit {
    position: relative;
    top: -65px;
    left: 65%;
    border: 1px solid;
    border-radius: 5px;
    width: 28%;
    height: 80px;
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
    top: -5px;
    left: 5%;
    font-weight: bold;

  }

  .cuadroNit>.espacioNit {
    position: relative;
    top: -35px;
    left: 55%;
    font-weight: bold;
  }

  .cuadroNit>.palabraNumFact {
    position: relative;
    top: -40px;
    left: 5%;
    font-size: 80%;
    font-weight: bold;
    letter-spacing: -0.5px;
  }

  .cuadroNit>.espacioNumFact {
    position: relative;
    top: -65px;
    left: 55%;
    font-size: 90%;
  }

  .cuadroNit>.palabraNumAutorizacion {
    position: relative;
    top: -70px;
    left: 5%;
    font-size: 80%;
    font-weight: bold;
    letter-spacing: -0.5px;
  }

  .cuadroNit>.espacioNumAutorizacion {
    position: relative;
    top: -95px;
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

    border: 1px solid #dddddd;
    text-align: left;
    width: 10%;
    border: 1px solid black;
    text-align: center;
  }

  .td12 {

    border: 1px solid #dddddd;
    text-indent: 5%;
    width: 75%;
    border: 1px solid black;
  }

  .td13 {

    border: 1px solid #dddddd;
    text-align: left;
    width: 15%;
    border: 1px solid black;
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
    height: 90px;
  }

  .encabezado>.palabralugaryFecha {
    position: relative;
    left: 3%;
    top: -5px;
  }

  .encabezado>.espaciolugaryFecha {
    position: absolute;
    left: 17%;
    top: -5px;
  }

  .encabezado>.palabrasenor {
    position: relative;
    left: 3%;
    top: -10px;
  }

  .encabezado>.espaciosenor {
    position: absolute;
    left: 17%;
    top: 22px;
  }

  .encabezado>.palabraalumno {
    position: relative;
    left: 3%;
    top: -15px;
  }

  .encabezado>.espacioalumno {
    position: absolute;
    left: 17%;
    top: 47px;
  }

  .encabezado>.palabranit {
    position: absolute;
    left: 70%;
    top: -5px;
  }

  .encabezado>.espacionit {
    position: absolute;
    left: 78%;
    top: -5px;
  }

  .primerCuadro>.total {
    position: relative;
    left: 5%;
    border: 1px solid black;
    bottom: 111px;
    width: 90%;
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
    bottom: 90px;
    left: 5%;
    border: 1px solid black;
    width: 62.5%;
    height: 20px;
    padding: 2px;
  }
  .cuadrocodigoControl > .palabraCodigoControl{
    position: relative;
    bottom: 63%;
  }
  .cuadrocodigoControl > .espacioCodigoControl{
    position: relative;
    bottom: 210%;
    left: 25%;
  }
  .primerCuadro > .cuadrofechalimite{
    position: relative;
    bottom: 70px;
    left: 5%;
    border: 1px solid black;
    width: 62.5%;
    height: 20px;
    padding: 2px;
  }
  .primerCuadro > .palabraleyenda1{
    position: relative;
    bottom: 50px;
    margin-left: 7%;
    margin-right: 7%;
    align-content: center;
    font-size: 12px;
    text-align: center;
    
  }
  .primerCuadro > .palabraleyenda2{
    position: relative;
    bottom: 58px;
    margin-left: 15%;
    margin-right: 15%;
    align-content: center;
    font-size: 10px;
    text-align: center;
    
  }
  .primerCuadro > .cuadroQr{
    position: relative;
    bottom: 220px;
    left: 82%;

    width: 4%;
    height: 10px;
   
  }
</style>


<div class="primerCuadro">
  <img class="imagen" name="imagen" alt="imagen" id="imagen" src="2"/>
  <div class="cuadroNit">
    
    <p class="palabraNit">NIT:</p>
    <p class="espacioNit">232234244242</p>
    <p class="palabraNumFact">Nº FACTURA:</p>
    <p class="espacioNumFact">3445</p>
    <p class="palabraNumAutorizacion">Nº AUTORIZACION:</p>
    <p class="espacioNumAutorizacion">234</p>

  </div>
  <div class="palabraOriginal">ORIGINAL</div>
  <div class="palabraEnsenanza">Enseñanza de adultos y otros tipos de Enseñanza</div>
  <div class="palabraFactura">FACTURA</div>
  
  <div class="encabezado">
    <p class="palabralugaryFecha">Lugar y Fecha:</p>
    <p class="espaciolugaryFecha">La Paz, 15 de Marzo de 2019 dddddd</p>
    <p class="palabrasenor">Señor(es):</p>
    <p class="espaciosenor">Gabriel Rosales</p>
    <p class="palabraalumno">Alumno(a):</p>
    <p class="espacioalumno">Diego Cabrera</p>
    <p class="palabranit">NIT/CI:</p>
    <p class="espacionit">234324</p>
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
    <tr>
      <td class="td11">
        <p>100</p>
        <p>100</p>
        <p>100</p>
        <p>100</p>
        <p>100</p>
        <p>100</p>
        <p>100</p>
        <p>100</p>
      </td>
      <td class="td12">
        <p>Matricula 1</p>
        <p>Matricula 2</p>
        <p>Matricula 3</p>
        <p>Matricula 4</p>
      </td>
      <td class="td13">
        <p>100</p>
        <p>100</p>
        <p>100</p>
        <p>100</p>
      </td>
    </tr>
  </table>
  <table class="total">
    <tr>
      <th class="thtotal1">Son: Seiscientos Bolivianos</th>
      <th style="background-color: black;color: white;" class="thtotal2">TOTAL Bs.</th>
      <th class="thtotal3">600Bs</th>
    </tr>


  </table>
  <div class="cuadrocodigoControl">
    <p class="palabraCodigoControl">Codigo de control:</p>
    <p class="espacioCodigoControl">2342424</p>
  </div>
  <div class="cuadrofechalimite">

  </div>
  <p class="palabraleyenda1">"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO DE ESTA
      SERA SANCIONADO DEACUERDO A LA LEY."</p>
      <p class="palabraleyenda2">"Ley N: EL proveedor debe brindar atencion sin discriminacion 
        con respeto, calidez y comodidad a los usuarios y consumidores"
      </p>
      <div class="cuadroQr">
        {!! $name !!}
      </div>
</div>