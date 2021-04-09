<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCuentaplantemporalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuentaplantemporal', function (Blueprint $table) {
            $table->increments('idcuentaplantemp');
            $table->text("codcuenta");
			$table->text("nombre");
            $table->double('debe')->default(0)->nullable();
            $table->double('haber')->default(0)->nullable();  
            $table->double('saldo')->default(0)->nullable();        
            $table->enum("esctadetalle",["N","S"])->default("N");
			$table->integer("fkidcuentaplantemppadre")->unsigned()->nullable();
			$table->integer("fkidcuentaplantipo")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcuentaplantemppadre')->references('idcuentaplantemp')->on('cuentaplantemporal')->ondelete('cascade');
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
        Schema::dropIfExists('cuentaplantemporal');
    }
}
