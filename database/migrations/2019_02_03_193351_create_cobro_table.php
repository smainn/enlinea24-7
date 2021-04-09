<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCobroTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cobro', function (Blueprint $table) {
            $table->increments('idcobro');
            $table->string('codcobro',30)->nullable();
            $table->date('fecha');
            $table->time('hora');
            $table->datetime('fechahoratransac');
            $table->text('notas')->nullable();
            $table->integer('idusuario');
            $table->text('segenerofactura')->default('N')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cobro');
    }
}
