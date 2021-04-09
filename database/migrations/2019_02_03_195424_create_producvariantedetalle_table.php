<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProducvariantedetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('producvariantedetalle', function (Blueprint $table) {
            $table->increments('idproducvariantedetalle');
            $table->float('stock');
            $table->integer("fkidvarianteuno")->unsigned()->nullable();
            $table->integer("fkidvariantedos")->unsigned()->nullable();
            $table->integer("fkidvariantetres")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidvarianteuno')->references('idvarianteuno')->on('varianteuno')->ondelete('cascade');
            $table->foreign('fkidvariantedos')->references('idvariantedos')->on('variantedos')->ondelete('cascade');
            $table->foreign('fkidvariantetres')->references('idvariantetres')->on('variantetres')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('producvariantedetalle');
    }
}
