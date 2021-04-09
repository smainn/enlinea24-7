<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVentaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('venta', function (Blueprint $table) {
            $table->increments('idventa');
            $table->string("codventa",30)->nullable();
            $table->integer("nroficha")->nullable();
            $table->date("fecha");
            $table->time("hora");
            $table->float("tomarcomisionvendedor");
            $table->float("anticipo");
            $table->float("descuentoporcentaje");
            $table->float("recargoporcentaje");
            $table->datetime("fechahorafinestimada")->nullable();
            $table->datetime("fechahoratransac");
            $table->float("mtototventa");
            $table->float("mtototcobrado");
            $table->text("notas")->nullable();
            $table->integer("idusuario");
            $table->enum("estado",["V","A"])->default("V");
            $table->text("estadoproceso")->default('F');
            $table->integer("fkidsucursal")->unsigned();
            $table->integer("fkidcliente")->unsigned();
            $table->integer("fkidvendedor")->unsigned();
            $table->integer("fkidvehiculo")->unsigned()->nullable();
            $table->integer("fkidtipocontacredito")->unsigned();
            $table->integer("fkidtipotransacventa")->unsigned();
            $table->integer("fkidmoneda")->unsigned();
            $table->string('descuentotipo')->nullable();
            $table->string('recargotipo')->nullable();
            $table->string('tipoentrega')->nullable();
            $table->text('segenerofactura')->default('N');
            $table->float('mtototdescuento');
            $table->float('mtototincremento');
            $table->float('impuestoiva');
            $table->float('tc');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidsucursal')->references('idsucursal')->on('sucursal')->ondelete('cascade');
            $table->foreign('fkidcliente')->references('idcliente')->on('cliente')->ondelete('cascade');
            $table->foreign('fkidvendedor')->references('idvendedor')->on('vendedor')->ondelete('cascade');
            $table->foreign('fkidvehiculo')->references('idvehiculo')->on('vehiculo')->ondelete('cascade');
            $table->foreign('fkidtipocontacredito')->references('idtipocontacredito')->on('tipocontacredito')->ondelete('cascade');
            $table->foreign('fkidtipotransacventa')->references('idtipotransacventa')->on('tipotransacventa')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('venta');
    }
}
