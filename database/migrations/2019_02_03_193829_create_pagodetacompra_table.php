<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagodetacompraTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagodetacompra', function (Blueprint $table) {
            $table->increments('idpagodetacompra');
            $table->float('montopagado');
            $table->integer("fkidcompraplanporpagar")->unsigned();
            $table->integer("fkidpagos")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcompraplanporpagar')->references('idcompraplanporpagar')->on('compraplanporpagar')->ondelete('cascade');
            $table->foreign('fkidpagos')->references('idpagos')->on('pagos')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pagodetacompra');
    }
}
