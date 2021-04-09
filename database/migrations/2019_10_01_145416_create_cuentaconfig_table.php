<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCuentaconfigTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuentaconfig', function (Blueprint $table) {
            $table->increments('idcuentaconfig');
            /*$table->date("fecha");
            $table->integer("numniveles");
			$table->text("formato");
            $table->enum("estado",["A","N"])->default("A"); 
            $table->double("impuestoanualieerr")->nullable();*/
            $table->text('fecha');
            $table->text('numniveles');
			$table->text('formato');
            $table->enum('estado',['A','N'])->default('A'); 
            $table->text('impuestoanualieerr')->nullable();

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
        Schema::dropIfExists('cuentaconfig');
    }
}
