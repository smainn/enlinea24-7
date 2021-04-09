<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIngresosalidatrastipoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ingresosalidatrastipo', function (Blueprint $table) {
            $table->increments('idingresosalidatrastipo');
            $table->string('descripcion');
            $table->enum("estado",["A","D"])->default("A");
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
        Schema::dropIfExists('ingresosalidatrastipo');
    }
}
