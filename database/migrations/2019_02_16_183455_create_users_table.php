<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('username', 16)->unique();
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->unsignedBigInteger('facebook_id')->nullable();
            $table->enum('role', ['user', 'moderator', 'admin'])->default('user');
            $table->tinyInteger('active')->default(1);
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('id')->references('user_id')->on('recipes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
