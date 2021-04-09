<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePeriodocontableTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('periodocontable', function (Blueprint $table) {
            $table->increments('idperiodocontable');
	        $table->text('descripcion');
            $table->date('fechaini');	
			$table->date('fechafin');
            $table->enum('estado',['A','P','C'])->default('A');
			$table->integer('fkidgestioncontable')->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidgestioncontable')->references('idgestioncontable')->on('gestioncontable')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('periodocontable');
    }
}
