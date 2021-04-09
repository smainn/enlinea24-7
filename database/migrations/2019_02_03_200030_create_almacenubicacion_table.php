<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlmacenubicacionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('almacenubicacion', function (Blueprint $table) {
            $table->increments('idalmacenubicacion');
            $table->string('descripcion');
            $table->integer('capacidad');
            $table->text('notas')->nullable();
            $table->integer("idpadre")->unsigned()->nullable();
            $table->enum("estado",["A","N"])->default("A");
            $table->integer("fkidalmacen")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('idpadre')->references('idalmacenubicacion')->on('almacenubicacion')->ondelete('cascade');
            $table->foreign('fkidalmacen')->references('idalmacen')->on('almacen')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('almacenubicacion');
    }
}
