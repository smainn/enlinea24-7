<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCuentaplanejemploTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuentaplanejemplo', function (Blueprint $table) {
            $table->increments('idcuentaplanejemplo');
            $table->text("codcuenta");
			$table->text("nombre");
			$table->enum("estado",["A","N"])->default("A");
			$table->integer("fkidcuentaplanejemplopadre")->unsigned()->nullable();
			$table->integer("fkidcuentaplantipo")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcuentaplanejemplopadre')->references('idcuentaplanejemplo')->on('cuentaplanejemplo')->ondelete('cascade');
			$table->foreign('fkidcuentaplantipo')->references('idcuentaplantipo')->on('cuentaplantipo')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cuentaplanejemplo');
    }
}
