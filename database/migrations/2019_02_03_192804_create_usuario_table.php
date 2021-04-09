<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsuarioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->increments('idusuario');
            $table->integer('fkidgrupousuario')->unsigned()->nullable();
            $table->string('nombre');
            $table->string('apellido')->nullable();
            $table->enum('sexo', ['N' ,'M', 'F'])->default('N');
            $table->date('fechanac')->nullable();
            $table->string('login')->unique();
            $table->text('password');
            $table->string('email')->nullable();
            $table->integer('telefono')->nullable();
            $table->string('foto')->nullable();
            $table->enum('estado', ['A', 'N'])->default('A');
            $table->string('notas')->nullable();
            $table->text('api_token')->nullable();
            $table->date('fecha');
            $table->time('hora');
            $table->rememberToken();
            $table->dateTime('lastlogin')->nullable();
            $table->dateTime('lastlogout')->nullable();
            $table->string('ip')->nullable();
            $table->integer('intentos')->nullable();
            $table->bigInteger('timewait')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidgrupousuario')->references('idgrupousuario')->on('grupousuario')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usuario');
    }
}
