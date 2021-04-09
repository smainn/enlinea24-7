<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProveedorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proveedor', function (Blueprint $table) {
            $table->increments('idproveedor');
            $table->string("codproveedor",30)->nullable();
            $table->string("nombre",50);
            $table->string("apellido",50)->nullable();
            $table->string("nit",20)->nullable();
            $table->string("foto")->nullable();
            $table->text("notas")->nullable();
            $table->text("contactos")->nullable();
            $table->enum("estado",["A","N"])->default("A");
            $table->integer("fkidciudad")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidciudad')->references('idciudad')->on('ciudad')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proveedor');
    }
}
