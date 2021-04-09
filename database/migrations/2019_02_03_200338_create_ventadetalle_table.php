<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVentadetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ventadetalle', function (Blueprint $table) {
            $table->increments('idventadetalle');
            $table->integer('cantidad');
            $table->float('preciounit');
            $table->float('factor_desc_incre');
            $table->integer("fkidalmacenproddetalle")->unsigned();
            $table->integer("fkidventa")->unsigned();
            $table->integer("fkidlistapreproducdetalle")->unsigned();
            $table->enum("estadoproceso",["P","E","F"])->default("P");
            $table->text('nota')->nullable();
            $table->string('tipoentrega')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidalmacenproddetalle')->references('idalmacenproddetalle')->on('almacenproddetalle')->ondelete('cascade');
            $table->foreign('fkidventa')->references('idventa')->on('venta')->ondelete('cascade');
            $table->foreign('fkidlistapreproducdetalle')->references('idlistapreproducdetalle')->on('listapreproducdetalle')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ventadetalle');
    }
}
