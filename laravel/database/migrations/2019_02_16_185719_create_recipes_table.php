<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecipesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->integer('preparation')->default(0)->unsigned();
            $table->unsignedInteger('cooking')->default(0);
            $table->unsignedInteger('total_time')->default(0);
            $table->text('instructions');
            $table->string('source', 191)->nullable();
            $table->string('slug', 100);
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('ingredient_count')->default(0);
            $table->text('comment')->nullable();
            $table->unsignedTinyInteger('visible')->default(0);
            $table->timestamps();

//            $table->foreign('user_id')->references('id')->on('users');
//            $table->foreign('id')->references('recipe_id')->on('urls');
//            $table->foreign('id')->references('recipe_id')->on('ingredient_recipe');
//            $table->foreign('id')->references('recipe_id')->on('category_recipe');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('recipes');
    }
}
