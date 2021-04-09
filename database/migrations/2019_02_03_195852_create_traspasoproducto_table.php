<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTraspasoproductoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('traspasoproducto', function (Blueprint $table) {
            $table->increments('idtraspasoproducto');
            $table->string("codtraspaso",30)->nullable();
            $table->dateTime("fechahora");
            $table->dateTime("fechahoratransac");
            $table->text("notas")->nullable();
            $table->integer("idusuario");
            $table->integer("fkidingresosalidatrastipo")->unsigned();
            $table->integer("fkidalmacen_sale")->unsigned();
            $table->integer("fkidalmacen_entra")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidingresosalidatrastipo')->references('idingresosalidatrastipo')->on('ingresosalidatrastipo')->ondelete('cascade');
            $table->foreign('fkidalmacen_sale')->references('idalmacen')->on('almacen')->ondelete('cascade');
            $table->foreign('fkidalmacen_entra')->references('idalmacen')->on('almacen')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('traspasoproducto');
    }
}
