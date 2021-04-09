<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGestioncontableTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gestioncontable', function (Blueprint $table) {
            $table->increments('idgestioncontable');
	        $table->text('descripcion');
            $table->date('fechaini');	
			$table->date('fechafin');
            $table->enum('estado',['A','P','C'])->default('A');	
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
        Schema::dropIfExists('gestioncontable');
    }
}
