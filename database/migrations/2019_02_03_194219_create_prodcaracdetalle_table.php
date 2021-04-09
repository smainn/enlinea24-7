<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProdcaracdetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prodcaracdetalle', function (Blueprint $table) {
            $table->increments('idprodcaracdetalle');
            $table->string('descripcion', 150);
            $table->integer("fkidproducto")->unsigned();
            $table->integer("fkidproduccaracteristica")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidproducto')->references('idproducto')->on('producto')->ondelete('cascade');
            $table->foreign('fkidproduccaracteristica')->references('idproduccaracteristica')->on('produccaracteristica')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prodcaracdetalle');
    }
}
