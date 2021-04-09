<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCtbtransacautomaticasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ctbtransacautomaticas', function (Blueprint $table) {
            $table->increments('idctbtransacautomaticas');
            $table->text('nombre');
            $table->string('tipotransac', 10);
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ctbtransacautomaticas');
    }
}
