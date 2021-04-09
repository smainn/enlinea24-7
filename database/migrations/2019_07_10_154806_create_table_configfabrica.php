<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableConfigfabrica extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configfabrica', function (Blueprint $table) {
            $table->increments('idconfigfabrica');
            $table->text('comalmaceninventariocorte');
            $table->text('comalmaceningresoprod');
            $table->text('comalmacensalidaprod');
            $table->text('comalmacenlistadeprecios');
            $table->text('comventasventaalcredito');
            $table->text('comventasventaproforma');
            $table->text('comventascobranza');
            $table->text('comcompras');
            $table->text('comtaller');
            $table->text('comtallervehiculoparte');
            $table->text('comtallervehiculohistoria');
            $table->text('seguridad');
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
        Schema::dropIfExists('configfabrica');
    }
}
