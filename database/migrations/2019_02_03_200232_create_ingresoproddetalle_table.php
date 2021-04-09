<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIngresoproddetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ingresoproddetalle', function (Blueprint $table) {
            $table->increments('idingresoproddetalle');
            $table->float('cantidad');
            $table->integer("fkidalmacenproddetalle")->unsigned();
            $table->integer("fkidingresoproducto")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidalmacenproddetalle')->references('idalmacenproddetalle')->on('almacenproddetalle')->ondelete('cascade');
            $table->foreign('fkidingresoproducto')->references('idingresoproducto')->on('ingresoproducto')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ingresoproddetalle');
    }
}
