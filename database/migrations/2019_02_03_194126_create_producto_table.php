<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('producto', function (Blueprint $table) {
            $table->increments('idproducto');
            $table->string('codproducto', '30')->nullable();
            $table->string('descripcion');
            $table->float('costo');
            $table->float('precio');
            $table->float('stock');
            $table->float('stockminimo');
            $table->float('stockmaximo');
            $table->text('palabrasclaves')->nullable();
            $table->text('notas')->nullable();
            $table->float('comision');
            $table->float('costodos');
            $table->float('costotres');
            $table->float('costocuatro');
            $table->enum("tipo",["P","S","C","D"])->default("P");
            $table->enum("tipocomision",["V","F","P","N"])->default("V");
            $table->integer("fkidfamilia")->unsigned();
            $table->integer("fkidunidadmedida")->unsigned();
            $table->integer("fkidmoneda")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidfamilia')->references('idfamilia')->on('familia')->ondelete('cascade');
            $table->foreign('fkidunidadmedida')->references('idunidadmedida')->on('unidadmedida')->ondelete('cascade');
            $table->foreign('fkidmoneda')->references('idmoneda')->on('moneda')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('producto');
    }
}
