<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVentaplandepagoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ventaplandepago', function (Blueprint $table) {
            $table->increments('idventaplandepago');
            $table->string("descripcion");
            $table->date("fechaapagar");
            $table->float("montoapagar");
            $table->float("montopagado");
            $table->enum("estado",["I","P"])->default("I");
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
        Schema::dropIfExists('ventaplandepago');
    }
}
