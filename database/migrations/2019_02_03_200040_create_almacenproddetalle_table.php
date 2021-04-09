<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlmacenproddetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('almacenproddetalle', function (Blueprint $table) {
            $table->increments('idalmacenproddetalle');
            $table->float('stock');
            $table->float('stockminimo');
            $table->float('stockmaximo');
            $table->integer("fkidalmacen")->unsigned();
            $table->integer("fkidproducto")->unsigned();
            $table->integer("fkidalmacenubicacion")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidalmacen')->references('idalmacen')->on('almacen')->ondelete('cascade');
            $table->foreign('fkidproducto')->references('idproducto')->on('producto')->ondelete('cascade');
            $table->foreign('fkidalmacenubicacion')->references('idalmacenubicacion')->on('almacenubicacion')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('almacenproddetalle');
    }
}
