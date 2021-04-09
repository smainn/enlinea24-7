<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCtbcomprobautomatTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ctbcomprobautomat', function (Blueprint $table) {
            $table->increments('idctbcomprobautomat');
            $table->text('codcomprobante')->nullable();
            $table->text('referidoa')->nullable();
            $table->date('fecha')->nullable();
            $table->text('nrodoc')->nullable();
            $table->text('nrochequetarjeta')->nullable();
            $table->text('glosa')->nullable();
            $table->text('tipocambio')->nullable();
            $table->integer('idususario')->nullable();
            $table->enum('contabilizar', ['S', 'N'])->default('S');
            $table->enum('estado', ['A', 'C'])->default('A');
            $table->enum('esasientoautomatico', ['S', 'N'])->default('S');
            $table->integer("fkidcomprobantetipo")->unsigned()->nullable();
            $table->integer("fkidbanco")->unsigned()->nullable();
            $table->integer("fkidtipopago")->unsigned()->nullable();
            $table->integer("fkidmoneda")->unsigned()->nullable();
            $table->integer("fkidctbtransacautomaticas")->unsigned()->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidctbtransacautomaticas')->references('idctbtransacautomaticas')->on('ctbtransacautomaticas')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ctbcomprobautomat');
    }
}
