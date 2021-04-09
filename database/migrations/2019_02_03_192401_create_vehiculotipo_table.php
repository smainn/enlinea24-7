<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVehiculotipoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehiculotipo', function (Blueprint $table) {
            $table->increments('idvehiculotipo');
            $table->string("descripcion");
            $table->integer("idpadrevehiculo")->nullable()->unsigned();
            $table->enum("estado",["A","N"])->default("A");
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('idpadrevehiculo')->references('idvehiculotipo')->on('vehiculotipo')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehiculotipo');
    }
}
