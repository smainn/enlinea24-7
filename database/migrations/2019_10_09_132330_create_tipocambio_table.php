<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTipocambioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipocambio', function (Blueprint $table) {
            $table->increments('idtipocambio');
            $table->float('valor');
            $table->date('fecha');
            $table->integer('fkidmonedauno')->unsigned();
            $table->integer('fkidmonedados')->unsigned();
            $table->enum("estado",["A","N"])->default("A");
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidmonedauno')->references('idmoneda')->on('moneda')->ondelete('cascade');
            $table->foreign('fkidmonedados')->references('idmoneda')->on('moneda')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipocambio');
    }
}
