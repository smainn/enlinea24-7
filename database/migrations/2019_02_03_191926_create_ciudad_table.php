<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCiudadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ciudad', function (Blueprint $table) {
            $table->increments('idciudad');
            $table->string("descripcion");
            $table->integer("idpadreciudad")->nullable()->unsigned();
            $table->enum("estado",["A","N"])->default("A");
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('idpadreciudad')->references('idciudad')->on('ciudad')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ciudad');
    }
}
