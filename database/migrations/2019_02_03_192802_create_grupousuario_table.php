<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGrupousuarioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grupousuario', function (Blueprint $table) {
            $table->increments('idgrupousuario');

            $table->string('nombre', 150);
            $table->string('notas')->nullable();
            $table->date('fecha');
            $table->time('hora');
            $table->enum('estado', ['A', 'N'])->default('A');

            $table->enum('esa', ['N', 'S'])->default('N');
            $table->enum('ess', ['N', 'S'])->default('N');
            $table->enum('esv', ['N', 'S'])->default('N');
            
            $table->enum('del', ['S', 'N'])->default('S');

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
        Schema::dropIfExists('grupousuario');
    }
}
