<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFaclibrocompraTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faclibrocompra', function (Blueprint $table) {
            $table->increments('idfaclibrocompra');
            $table->string('especificacion');
            $table->integer('nro');
            $table->date('fechafactura');
            $table->text('nitproveedor');
            $table->string('nombrerazonsocial');
            $table->integer('nrofactura');
            $table->text('nrodui');
            $table->integer('nroautorizacion');
            $table->float('importetotalcompra');
            $table->float('importenosujetocredito');
            $table->float('subtotal');
            $table->float('descuentosbonificarebajasujetaiva');
            $table->float('importebasecreditofiscal');
            $table->float('creditofiscal');
            $table->integer('codigocontrol');
            $table->string('tipocompra');
        
            $table->integer("fkidcompra")->unsigned();
            $table->integer("fkidfactipolibrocompra")->unsigned();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidcompra')->references('idcompra')->on('compra')->ondelete('cascade');
            $table->foreign('fkidfactipolibrocompra')->references('idfactipolibrocompra')->on('factipolibrocompra')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faclibrocompra');
    }
}
