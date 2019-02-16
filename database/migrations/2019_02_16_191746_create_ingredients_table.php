<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIngredientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 45);
            $table->string('slug', 45);
            $table->unsignedInteger('recipe_count')->default(0);
            $table->unsignedTinyInteger('approved')->default(0);
            $table->string('food_group', 45)->nullable();
            $table->timestamps();

            $table->foreign('id')->references('ingredient_id')->on('ingredient_recipe');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ingredients');
    }
}
