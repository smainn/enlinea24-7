<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFacdosificacionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('facdosificacion', function (Blueprint $table) {
            $table->increments('idfacdosificacion');
            $table->text("titulo");
            $table->text("subtitulo")->nullable();
            $table->text("descripcion")->nullable();
            $table->string("nit",50); 
            $table->text("numerotramite");
            $table->integer("numerocorrelativo");
            $table->text("numeroautorizacion");
            $table->text("leyenda1piefactura");
            $table->text("leyenda2piefactura");
            $table->text("llave");
            $table->date("fechaactivacion");
            $table->date("fechalimiteemision");
            $table->text("nombresfcmarca");
            $table->text("plantillafacturaurl");
            $table->integer("numfacturainicial");
            $table->integer("numfacturasiguiente");
            $table->text("notas")->nullable();
            $table->enum("tipofactura",["S","R"])->default("S");
            $table->enum("estado",["A","E","F"])->default("A");
            $table->integer("fkidsucursal")->unsigned();
            $table->integer("fkidfacactividadeconomica")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidsucursal')->references('idsucursal')->on('sucursal')->ondelete('cascade');
            $table->foreign('fkidfacactividadeconomica')->references('idfacactividadeconomica')->on('facactividadeconomica')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('facdosificacion');
    }
}
