<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFamiliaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('familia', function (Blueprint $table) {
            $table->increments('idfamilia');
            $table->string('descripcion');
            $table->integer("idpadrefamilia")->unsigned()->nullable();
            $table->enum("estado",["A","N"])->default("A");
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('idpadrefamilia')->references('idfamilia')->on('familia')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('familia');
    }
}
