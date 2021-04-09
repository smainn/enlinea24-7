<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComprobanteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comprobante', function (Blueprint $table) {
            $table->increments('idcomprobante');
            $table->text('codcomprobante');
			//$table->text('recibide');
			$table->text('referidoa')->nullable();
            $table->datetime('fecha');
			$table->text('nrodoc')->nullable();
			//$table->text('banco');
			$table->text('nrochequetarjeta')->nullable();
			//$table->enum('tipo',['I','E','T'])->default('I');
			$table->text('glosa')->nullable();
			$table->float('tipocambio');
            $table->integer('idusuario');
            $table->enum('contabilizar',['S','N'])->default('S');
            $table->enum('estado',['A','C'])->default('A');
            $table->integer('fkidperiodocontable')->unsigned();
			$table->integer('fkidcomprobantetipo')->unsigned();
			$table->integer('fkidbanco')->unsigned()->nullable();
			$table->integer('fkidtipopago')->unsigned();
			$table->integer('fkidmoneda')->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidperiodocontable')->references('idperiodocontable')->on('periodocontable')->ondelete('cascade');
			$table->foreign('fkidcomprobantetipo')->references('idcomprobantetipo')->on('comprobantetipo')->ondelete('cascade');
			$table->foreign('fkidbanco')->references('idbanco')->on('banco')->ondelete('cascade');
			$table->foreign('fkidtipopago')->references('idtipopago')->on('tipopago')->ondelete('cascade');
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
        Schema::dropIfExists('comprobante');
    }
}
