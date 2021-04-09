<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTraspasoproddetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('traspasoproddetalle', function (Blueprint $table) {
            $table->increments('idtraspasoproddetalle');
            $table->float('cantidad');
            $table->integer("fkidalmacenproddetalle")->unsigned();
            $table->integer("fkidtraspasoproducto")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidalmacenproddetalle')->references('idalmacenproddetalle')->on('almacenproddetalle')->ondelete('cascade');
            $table->foreign('fkidtraspasoproducto')->references('idtraspasoproducto')->on('traspasoproducto')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('traspasoproddetalle');
    }
}
