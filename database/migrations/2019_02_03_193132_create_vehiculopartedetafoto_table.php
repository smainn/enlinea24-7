<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculopartedetafotoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculopartedetafoto', function (Blueprint $table) {
            $table->increments('idvehiculopartedetafoto');
            $table->string('foto')->nullable();
            $table->integer("fkidvehicpartesventadetalle")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidvehicpartesventadetalle')->references('idvehicpartesventadetalle')->on('vehicpartesventadetalle')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehiculopartedetafoto');
    }
}
