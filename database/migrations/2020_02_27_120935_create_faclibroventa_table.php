<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFaclibroventaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faclibroventa', function (Blueprint $table) {
            $table->increments('idfaclibroventa');
            $table->string('especificacion');
            $table->integer('nro');
            $table->date('fechafactura');
            $table->integer('nrofactura');
            $table->text('nroautorizacion');
            $table->string('estado');
            $table->string('nitcliente')->nullable();
            $table->string('nombrerazonsocial');
            $table->float('importetotalventa');
            $table->float('importeice_ie_otronoiva');
            $table->float('exportoperacionextensas');
            $table->float('ventagrabadatasacero');
            $table->float('subtotal');
            $table->float('descuentosbonificarebajasujetaiva');
            $table->float('importebasecreditofiscal');
            $table->float('debitofiscal');
            $table->string('codigocontrol')->nullable();
            $table->integer("fkidfactura")->unsigned();
            $table->integer("fkidfactipolibroventa")->unsigned();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidfactura')->references('idfactura')->on('factura')->ondelete('cascade');
            $table->foreign('fkidfactipolibroventa')->references('idfactipolibroventa')->on('factipolibroventa')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faclibroventa');
    }
}
