<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('variants', function (Blueprint $table) {
            $table->increments('id');
            //$table->string('nombre');
            $table->integer('sku'); //en base de datos poner inicio a 1000, true de increments
            $table->decimal('suppPri',10,2);
            $table->decimal('markup',10,2); //porcentaje %
            $table->decimal('price',10,2);
            $table->boolean('track'); //si está trackeado para el stock
            $table->integer('product_id')->unsigned();
            $table->foreign('product_id')->references('id')->on('products');
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
        //Schema::drop('variants');
    }
}
