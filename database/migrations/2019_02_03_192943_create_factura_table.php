<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFacturaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('factura', function (Blueprint $table) {
            $table->increments('idfactura');
            $table->string("numero");
            $table->string("nombre",50);
            //$table->integer("numeroautorizacion");
            //$table->string("nitemisor",50);
            $table->string("nit",50); 
            $table->date("fecha");
            $table->enum("estado",["V","A"])->default("V");
            $table->text("notas")->nullable();
            $table->integer("idusuario");
            $table->dateTime("fechahoratransac");
            $table->string('codigoqr')->nullable();
            $table->text('codigodecontrol')->nullable();
            $table->float('mtototalventa');
            $table->float('mtodescuento');
            $table->float('mtoincremento');
            $table->float('mtototnetoventa');
            $table->integer('contadordelimpresion'); //revisar nombre
            $table->integer("fkidventa")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidventa')->references('idventa')->on('venta')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('factura');
    }
}
