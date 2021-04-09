<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProveedorcontactarloTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proveedorcontactarlo', function (Blueprint $table) {
            $table->increments('idproveedorcontactarlo');
            $table->string('valor',50);
            $table->integer("fkidproveedor")->unsigned();
            $table->integer("fkidreferenciadecontacto")->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidproveedor')->references('idproveedor')->on('proveedor')->ondelete('cascade');
            $table->foreign('fkidreferenciadecontacto')->references('idreferenciadecontacto')->on('referenciadecontacto')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proveedorcontactarlo');
    }
}
