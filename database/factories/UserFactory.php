<?php

use App\User;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {
    return [
        'username' => $faker->userName,
        'email' => $faker->unique()->safeEmail,
        'password' => bcrypt('fake-user'), // secret
        'remember_token' => str_random(10),
        'created_at' => now(),
        'updated_at' => now(),
        'active' => true,
        'role' => 'user'
    ];
});

$factory->state(User::class, 'admin', [
    'role' => 'admin'
]);

$factory->state(User::class, 'inactive', [
    'active' => false
]);
