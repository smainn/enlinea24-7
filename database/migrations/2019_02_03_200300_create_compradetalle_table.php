<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompradetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('compradetalle', function (Blueprint $table) {
            $table->increments('idcompradetalle');
            $table->integer('cantidad');
            $table->float('costounit');
            $table->integer("fkidalmacenproddetalle")->unsigned();
            $table->integer("fkidcompra")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidalmacenproddetalle')->references('idalmacenproddetalle')->on('almacenproddetalle')->ondelete('cascade');
            $table->foreign('fkidcompra')->references('idcompra')->on('compra')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('compradetalle');
    }
}
