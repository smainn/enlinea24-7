<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClienteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cliente', function (Blueprint $table) {
            $table->increments('idcliente');
            $table->string("codcliente",20)->nullable();
            $table->string("nombre",50);
            $table->string("apellido",50)->nullable();
            $table->string("nit",15)->nullable();
            $table->string("foto")->nullable();
            $table->enum("sexo",["M","F","N"])->default("N");
            $table->enum("tipopersoneria",["N","J", "S"])->default("S");
            $table->date("fechanac")->nullable();
            $table->text("notas")->nullable();
            $table->text("contacto")->nullable();
            $table->integer("fkidciudad")->unsigned();
            $table->integer("fkidclientetipo")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidciudad')->references('idciudad')->on('ciudad')->ondelete('cascade');
            $table->foreign('fkidclientetipo')->references('idclientetipo')->on('clientetipo')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cliente');
    }
}
