<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCtbdefictasasientautomTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ctbdefictasasientautom', function (Blueprint $table) {
            $table->increments('idctbdefictasasientautom');
            $table->string('clave', 5);
            $table->text('descripcion')->nullable();
            $table->text('codcuenta')->nullable();
            $table->float('valor');
            $table->integer("fkidcuentaplan")->unsigned()->nullable();
            $table->softDeletes();
            $table->timestamps();
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
        Schema::dropIfExists('ctbdefictasasientautom');
    }
}
