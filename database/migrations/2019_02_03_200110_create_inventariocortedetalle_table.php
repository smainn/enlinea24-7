<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInventariocortedetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventariocortedetalle', function (Blueprint $table) {
            $table->increments('idinventariocortedetalle');
            $table->float('stockanterior');
            $table->float('stocknuevo');
            $table->integer("fkidalmacenproddetalle")->unsigned();
            $table->integer("fkidinventariocorte")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidalmacenproddetalle')->references('idalmacenproddetalle')->on('almacenproddetalle')->ondelete('cascade');
            $table->foreign('fkidinventariocorte')->references('idinventariocorte')->on('inventariocorte')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventariocortedetalle');
    }
}
