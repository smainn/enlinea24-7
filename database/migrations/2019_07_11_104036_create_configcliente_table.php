<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfigclienteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configcliente', function (Blueprint $table) {
            $table->increments('idconfigcliente');
            /*$table->boolean('codigospropios');
            $table->boolean('otroscodigos');
            $table->integer('monedapordefecto');
            $table->boolean('editprecunitenventa');
            $table->boolean('editcostoproducto');
            $table->boolean('masdeuncosto');
            $table->boolean('masdeunalmacen');
            $table->boolean('editarstockproducto');
            $table->boolean('clienteesabogado');
            $table->string('logo')->nullable();
            $table->string('logonombre')->nullable();
            $table->string('logoreporte')->nullable();
            $table->string('colors')->nullable();
            */
            $table->text('codigospropios');
            $table->text('otroscodigos');
            $table->text('monedapordefecto');
            $table->text('editprecunitenventa');
            $table->text('editcostoproducto');
            $table->text('masdeuncosto');
            $table->text('masdeunalmacen');
            $table->text('editarstockproducto');
            $table->text('clienteesabogado');
            $table->text('ventaendospasos');// true or false
            $table->text('facturarsiempre');// [S, P, N]
            $table->text('logo')->nullable();
            $table->text('logonombre')->nullable();
            $table->text('logoreporte')->nullable();
            $table->text('colors')->nullable();
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
        Schema::dropIfExists('configcliente');
    }
}
