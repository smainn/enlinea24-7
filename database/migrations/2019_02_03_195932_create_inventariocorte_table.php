<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInventariocorteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventariocorte', function (Blueprint $table) {
            $table->increments('idinventariocorte');
            $table->string('descripcion');
            $table->date('fecha');
            $table->integer("idusuario");
            $table->datetime("fechahoratransac");
            $table->enum("estado",["P","F"])->default("P");
            $table->string('notas')->nullable();
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
        Schema::dropIfExists('inventariocorte');
    }
}
