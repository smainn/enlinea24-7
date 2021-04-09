<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompraTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('compra', function (Blueprint $table) {
            $table->increments('idcompra');
            $table->string("codcompra",30)->nullable();
            $table->date("fecha");
            $table->time("hora");
            $table->float("anticipopagado");
            $table->datetime("fechahoratransac");
            $table->float("mtototcompra");
            $table->float("mtototpagado");
            $table->text("notas")->nullable();
            $table->enum("tipo",["C","R"])->default("C");
            $table->enum("estado",["V","A"])->default("V");
            $table->integer("idusuario");
            $table->integer("fkidproveedor")->unsigned();
            $table->integer("fkidmoneda")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidproveedor')->references('idproveedor')->on('proveedor')->ondelete('cascade');
            $table->foreign('fkidmoneda')->references('idmoneda')->on('moneda')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('compra');
    }
}
