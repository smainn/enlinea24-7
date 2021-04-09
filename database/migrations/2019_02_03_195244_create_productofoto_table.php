<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductofotoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productofoto', function (Blueprint $table) {
            $table->increments('idproductofoto');
            $table->text('foto');
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
        Schema::dropIfExists('productofoto');
    }
}
