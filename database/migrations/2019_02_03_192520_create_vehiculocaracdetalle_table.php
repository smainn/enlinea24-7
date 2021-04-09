<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculocaracdetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculocaracdetalle', function (Blueprint $table) {
            $table->increments('idvehiculocaracdetalle');
            $table->string("descripcion");
            $table->integer("fkidvehiculo")->unsigned()->nullable();
            $table->integer("fkidvehiculocaracteristica")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidvehiculo')->references('idvehiculo')->on('vehiculo')->ondelete('cascade');
            $table->foreign('fkidvehiculocaracteristica')->references('idvehiculocaracteristica')->on('vehiculocaracteristica')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehiculocaracdetalle');
    }
}
