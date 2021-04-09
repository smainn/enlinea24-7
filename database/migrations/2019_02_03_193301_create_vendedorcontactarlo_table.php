<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendedorcontactarloTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vendedorcontactarlo', function (Blueprint $table) {
            $table->increments('idvendedorcontactarlo');
            $table->string('valor');
            $table->integer("fkidreferenciadecontacto")->unsigned();
            $table->integer("fkidvendedor")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidreferenciadecontacto')->references('idreferenciadecontacto')->on('referenciadecontacto')->ondelete('cascade');
            $table->foreign('fkidvendedor')->references('idvendedor')->on('vendedor')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vendedorcontactarlo');
    }
}
