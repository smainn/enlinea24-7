<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIngresoproductoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ingresoproducto', function (Blueprint $table) {
            $table->increments('idingresoproducto');
            $table->string("codingresoprod",30)->nullable();
            $table->dateTime("fechahora");
            $table->dateTime("fechahoratransac");
            $table->text("notas")->nullable();
            $table->integer("idusuario");
            $table->integer("fkidingresosalidatrastipo")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidingresosalidatrastipo')->references('idingresosalidatrastipo')->on('ingresosalidatrastipo')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ingresoproducto');
    }
}
