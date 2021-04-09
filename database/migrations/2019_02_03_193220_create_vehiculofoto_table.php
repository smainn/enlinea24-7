<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculofotoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculofoto', function (Blueprint $table) {
            $table->increments('idvehiculofoto');
            $table->string('foto');
            $table->integer("fkidvehiculo")->unsigned()->nullable();
            $table->integer("fkidventa")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidvehiculo')->references('idvehiculo')->on('vehiculo')->ondelete('cascade');
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
        Schema::dropIfExists('vehiculofoto');
    }
}
