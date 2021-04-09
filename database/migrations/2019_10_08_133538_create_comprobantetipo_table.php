<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComprobantetipoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comprobantetipo', function (Blueprint $table) {
            $table->increments('idcomprobantetipo');
	        $table->text('descripcion');
            $table->integer('numeradoinicial');	
			$table->integer('numeroactual');
	        $table->text('firmaa')->nullable();
	        $table->text('firmab')->nullable();
	        $table->text('firmac')->nullable();
            $table->text('firmad')->nullable();	
            $table->text('abreviacion');	
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
        Schema::dropIfExists('comprobantetipo');
    }
}
