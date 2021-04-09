<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSalidaproddetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('salidaproddetalle', function (Blueprint $table) {
            $table->increments('idsalidaproddetalle');
            $table->float('cantidad');
            $table->integer("fkidalmacenproddetalle")->unsigned();
            $table->integer("fkidsalidaproducto")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidalmacenproddetalle')->references('idalmacenproddetalle')->on('almacenproddetalle')->ondelete('cascade');
            $table->foreign('fkidsalidaproducto')->references('idsalidaproducto')->on('salidaproducto')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('salidaproddetalle');
    }
}
