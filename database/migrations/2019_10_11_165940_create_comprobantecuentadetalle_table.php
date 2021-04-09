<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComprobantecuentadetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comprobantecuentadetalle', function (Blueprint $table) {
            $table->increments('idcomprobantecuentadetalle');
            //$table->text('codcuenta');
			$table->text('glosamenor')->nullable();
			$table->double('debe');
			$table->double('haber');
			$table->integer('fkidcomprobante')->unsigned();
			$table->integer('fkidcentrodecosto')->unsigned()->nullable();
			$table->integer('fkidcuentaplan')->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcomprobante')->references('idcomprobante')->on('comprobante')->ondelete('cascade');
			$table->foreign('fkidcentrodecosto')->references('idcentrodecosto')->on('centrodecosto')->ondelete('cascade');
			$table->foreign('fkidcuentaplan')->references('idcuentaplan')->on('cuentaplan')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comprobantecuentadetalle');
    }
}
