<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlmacenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('almacen', function (Blueprint $table) {
            $table->increments('idalmacen');
            $table->string('descripcion');
            $table->string('direccion', 50)->nullable();
            $table->text('notas')->nullable();
            $table->integer("fkidsucursal")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidsucursal')->references('idsucursal')->on('sucursal')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('almacen');
    }
}
