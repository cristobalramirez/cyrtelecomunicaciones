<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre')->unique();
            $table->string('codigo')->unique(); //Identificador único para este producto.
            $table->string('marca')->nullable();
            $table->string('modelo')->nullable();
            $table->string('descripcion')->nullable();
            $table->boolean('estado');
            $table->text('image')->nullable();
            $table->decimal('stock',10,2)->default(0);
            $table->decimal('stockAlmacen',10,2)->default(0);
            $table->decimal('stockTecnico',10,2)->default(0);
            $table->integer('category_id')->unsigned();
            
            $table->foreign('category_id')->references('id')->on('categories');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('products');
    }
}
