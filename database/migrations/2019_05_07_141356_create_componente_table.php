<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComponenteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('componente', function (Blueprint $table) {
            $table->increments('idcomponente');
            /*$table->string('descripcion');
            $table->string('tipo')->nullable();
            $table->enum('estado', ['A', 'D'])->default('A');
            $table->enum('activo', ['N', 'S'])->default('N');*/
            $table->text('descripcion');
            $table->text('tipo')->nullable();
            $table->enum('estado', ['A', 'D'])->default('A');
            $table->text('activo');
            $table->integer("idcomponentepadre")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('idcomponentepadre')->references('idcomponente')->on('componente')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('componente');
    }
}
