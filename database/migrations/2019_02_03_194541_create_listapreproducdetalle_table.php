<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateListapreproducdetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('listapreproducdetalle', function (Blueprint $table) {
            $table->increments('idlistapreproducdetalle');
            $table->float('precio');
            $table->integer("fkidproducto")->unsigned();
            $table->integer("fkidlistaprecio")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidproducto')->references('idproducto')->on('producto')->ondelete('cascade');
            $table->foreign('fkidlistaprecio')->references('idlistaprecio')->on('listaprecio')->ondelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('listapreproducdetalle');
    }
}
