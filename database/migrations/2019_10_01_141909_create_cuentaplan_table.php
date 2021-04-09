<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCuentaplanTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuentaplan', function (Blueprint $table) {
            $table->increments('idcuentaplan');
            $table->text("codcuenta");
			$table->text("nombre");
            $table->enum("estado",["A","N"])->default("A");
            $table->enum("esctadetalle",["N","S"])->default("N");
			$table->integer("fkidcuentaplanpadre")->unsigned()->nullable();
			$table->integer("fkidcuentaplantipo")->unsigned();
			$table->integer("fkidcuentasautomconfigasignacion")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcuentaplanpadre')->references('idcuentaplan')->on('cuentaplan')->ondelete('cascade');
			$table->foreign('fkidcuentaplantipo')->references('idcuentaplantipo')->on('cuentaplantipo')->ondelete('cascade');
			$table->foreign('fkidcuentasautomconfigasignacion')->references('idcuentasautomconfigasignacion')->on('cuentasautomconfigasignacion')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cuentaplan');
    }
}
