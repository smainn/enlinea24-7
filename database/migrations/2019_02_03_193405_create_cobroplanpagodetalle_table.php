<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCobroplanpagodetalleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cobroplanpagodetalle', function (Blueprint $table) {
            $table->increments('idcobroplanpagodetalle');
            $table->float('montocobrado');
            $table->integer("fkidventaplandepago")->unsigned();
            $table->integer("fkidcobro")->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidventaplandepago')->references('idventaplandepago')->on('ventaplandepago')->ondelete('cascade');
            $table->foreign('fkidcobro')->references('idcobro')->on('cobro')->ondelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cobroplanpagodetalle');
    }
}
