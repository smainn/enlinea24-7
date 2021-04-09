<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfigeerrTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configeerr', function (Blueprint $table) {
            $table->increments('idconfigeerr');
            $table->text("numaccion");
            $table->text("operacion");
            $table->text("descripcion");
            $table->integer("idcuentaplan")->default(0);
            $table->text("formula");
            $table->double("valorporcentaje");
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
        Schema::dropIfExists('configeerr');
    }
}
