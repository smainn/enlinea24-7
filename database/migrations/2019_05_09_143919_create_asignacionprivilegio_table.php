<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAsignacionprivilegioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('asignacionprivilegio', function (Blueprint $table) {
            $table->increments('idasignacionprivilegio');

            $table->integer("fkidgrupousuario")->unsigned();
            $table->integer("fkidcomponente")->unsigned();

            /*$table->enum("habilitado",["A","N"])->default("A");
            $table->enum("visible",["A","N"])->default("A");
            $table->enum("editable",["A","N"])->default("A");
            $table->enum("novisible",["A","N"])->default("A");*/
            $table->enum("habilitado",["A","N"])->default("A");
            $table->text("visible");
            $table->text("editable");
            $table->text("novisible");

            $table->timestamps();

            $table->softDeletes();
            $table->foreign('fkidgrupousuario')->references('idgrupousuario')->on('grupousuario')->ondelete('cascade');
            $table->foreign('fkidcomponente')->references('idcomponente')->on('componente')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('asignacionprivilegio');
    }
}
