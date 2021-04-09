<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCtbdetallecomprobautomatTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ctbdetallecomprobautomat', function (Blueprint $table) {
            $table->increments('idctbdetallecomprobautomat');
            $table->text('glosamenor')->nullable();
            $table->enum('debe', ['N', 'S'])->default('N');
            $table->enum('haber', ['N', 'S'])->default('N');
            $table->integer("fkidctbcomprobautomat")->unsigned();
            $table->integer("fkidctbdefictasasientautom")->unsigned();
            $table->integer("fkidcuentaplan")->unsigned()->nullable();
            $table->integer("fkidcentrodecosto")->unsigned()->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('fkidctbcomprobautomat')->references('idctbcomprobautomat')->on('ctbcomprobautomat')->ondelete('cascade');
            $table->foreign('fkidctbdefictasasientautom')->references('idctbdefictasasientautom')->on('ctbdefictasasientautom')->ondelete('cascade');
            $table->foreign('fkidcuentaplan')->references('idcuentaplan')->on('cuentaplan')->ondelete('cascade');
            $table->foreign('fkidcentrodecosto')->references('idcentrodecosto')->on('centrodecosto')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ctbdetallecomprobautomat');
    }
}
