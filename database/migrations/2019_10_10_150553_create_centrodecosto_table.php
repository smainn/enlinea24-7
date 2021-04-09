<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCentrodecostoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('centrodecosto', function (Blueprint $table) {
            $table->increments('idcentrodecosto');
            $table->text('codcentrocosto');
			$table->text('nombre');
			$table->enum('estado', ['A','N'])->default('A');
			$table->integer('fkidcentrocostotipo')->unsigned();
			$table->integer('fkidcentrodecostopadre')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcentrocostotipo')->references('idcentrocostotipo')->on('centrocostotipo')->ondelete('cascade');
			$table->foreign('fkidcentrodecostopadre')->references('idcentrodecosto')->on('centrodecosto')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('centrodecosto');
    }
}
