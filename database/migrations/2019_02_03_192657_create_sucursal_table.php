<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSucursalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sucursal', function (Blueprint $table) {
            $table->increments('idsucursal');
            $table->string("nombre",50)->nullable();
            $table->string("apellido",50)->nullable();
            $table->string("nombrecomercial",70)->nullable();
            $table->string("razonsocial",70)->nullable();
            $table->string("nit",50)->nullable();
            $table->string("zona",60)->nullable();
            $table->string("direccion",60)->nullable();
            $table->string("telefono",30)->nullable();
            $table->enum("tipoempresa",["N","J"])->default("N");
            $table->enum("tiposucursal",["S","M"])->default("S");
            $table->text("logotipourl")->nullable();
            $table->float('impuestoiva');
            $table->integer("fkidpais")->unsigned();
            $table->integer("fkidciudad")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidpais')->references('idciudad')->on('ciudad')->ondelete('cascade');
            $table->foreign('fkidciudad')->references('idciudad')->on('ciudad')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sucursal');
    }
}
