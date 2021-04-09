<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculo', function (Blueprint $table) {
            $table->increments('idvehiculo');
            $table->string("codvehiculo",20)->nullable();
            $table->string("placa",10)->unique();
            $table->enum("tipopartpublic",["R","P"])->default("R");
            $table->string("chasis",50)->nullable();
            $table->string("descripcion")->nullable();
            $table->string("notas")->nullable();
            $table->integer("fkidcliente")->unsigned();
            $table->integer("fkidvehiculotipo")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcliente')->references('idcliente')->on('cliente')->ondelete('cascade');
            $table->foreign('fkidvehiculotipo')->references('idvehiculotipo')->on('vehiculotipo')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehiculo');
    }
}
