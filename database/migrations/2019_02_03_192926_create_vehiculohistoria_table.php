<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculohistoriaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculohistoria', function (Blueprint $table) {
            $table->increments('idvehiculohistoria');
            $table->date("fecha");
            $table->text("diagnosticoentrada")->nullable();
            $table->text("trabajoshechos")->nullable();
            $table->string("kmactual",40);
            $table->string("kmproximo",40);
            $table->date("fechaproxima");
            $table->dateTime("fechahoratransaccion");
            $table->float("precio")->nullable();
            $table->text("notas")->nullable();
            $table->integer('idusuario');
            $table->integer("fkidventa")->unsigned()->nullable();
            $table->integer("fkidvehiculo")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidventa')->references('idventa')->on('venta')->ondelete('cascade');
            $table->foreign('fkidvehiculo')->references('idvehiculo')->on('vehiculo')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehiculohistoria');
    }
}
