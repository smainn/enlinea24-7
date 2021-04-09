<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehicpartesventadetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicpartesventadetalle', function (Blueprint $table) {
            $table->increments('idvehicpartesventadetalle');
            $table->integer('cantidad');
            $table->enum("estado",["S","N","E","M","D","O"])->default("S");
            $table->string("observaciones", 150)->nullable();
            $table->integer("fkidventa")->unsigned();
            $table->integer("fkidvehiculopartes")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidventa')->references('idventa')->on('venta')->ondelete('cascade');
            $table->foreign('fkidvehiculopartes')->references('idvehiculopartes')->on('vehiculopartes')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehicpartesventadetalle');
    }
}
