<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBancoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banco', function (Blueprint $table) {
            $table->increments('idbanco');
	        $table->text('nombre');
            $table->text('cuenta');	
            $table->enum('estado',['A','N'])->default('A');			
			$table->integer('fkidbancopadre')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('fkidbancopadre')->references('idbanco')->on('banco')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('banco');
    }
}
