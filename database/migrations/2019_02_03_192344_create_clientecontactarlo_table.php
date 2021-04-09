<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientecontactarloTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientecontactarlo', function (Blueprint $table) {
            $table->increments('idclientecontactarlo');
            $table->string("valor",50);
            $table->integer("fkidcliente")->unsigned();
            $table->integer("fkidreferenciadecontacto")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcliente')->references('idcliente')->on('cliente')->ondelete('cascade');
            $table->foreign('fkidreferenciadecontacto')->references('idreferenciadecontacto')->on('referenciadecontacto')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clientecontactarlo');
    }
}
