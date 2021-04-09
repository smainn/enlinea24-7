<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompraplanporpagarTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('compraplanporpagar', function (Blueprint $table) {
            $table->increments('idcompraplanporpagar');
            $table->string('descripcion');
            $table->date('fechadepago');
            $table->float('montoapagar');
            $table->float('montopagado');
            $table->enum("estado",["I","P"])->default("I");
            $table->integer("fkidcompra")->unsigned();
            $table->timestamps();
            $table->softDeletes();
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
        Schema::dropIfExists('compraplanporpagar');
    }
}
