<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendedorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vendedor', function (Blueprint $table) {
            $table->increments('idvendedor');
            $table->string("codvendedor",20)->nullable();
            $table->string("nombre",50);
            $table->string("apellido",50)->nullable();
            $table->string("foto")->nullable();
            $table->string('nit', '15')->nullable();
            $table->enum("sexo",["M","F","N"])->default("N");
            $table->date("fechanac")->nullable();
            $table->enum("estado",["A","N"])->default("A");
            $table->text('notas')->nullable();
            $table->integer("fkidcomisionventa")->unsigned();
            $table->integer("fkidusuario")->nullable()->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidcomisionventa')->references('idcomisionventa')->on('comisionventa')->ondelete('cascade');
            $table->foreign('fkidusuario')->references('idusuario')->on('usuario')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vendedor');
    }
}
