<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProduccodigoadicionalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('produccodigoadicional', function (Blueprint $table) {
            $table->increments('idproduccodigoadicional');
            $table->string("codproduadi",30)->nullable();
            $table->string("descripcion",50);
            $table->integer("fkidproducto")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidproducto')->references('idproducto')->on('producto')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('produccodigoadicional');
    }
}
