<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateListaprecioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('listaprecio', function (Blueprint $table) {
            $table->increments('idlistaprecio');
            $table->string('descripcion', 150);
            $table->float('valor');
            $table->date('fechainicio');
            $table->date('fechafin');
            $table->dateTime('fechahoratransac');
            $table->text('notas')->nullable();
            $table->enum("fijoporcentaje",["F","P"])->default("F");
            $table->enum("accion",["D","I"])->default("D");
            $table->enum("estado",["A","D"])->default("A");
            $table->integer('idusuario');
            $table->integer("fkidmoneda")->unsigned();
            $table->timestamps();
            $table->softDeletes();
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
        Schema::dropIfExists('listaprecio');
    }
}
