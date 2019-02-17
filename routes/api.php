<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/ingredients/{ingredient}', 'IngredientController@search')->name('ingredient.search');
Route::get('/ingredients', 'IngredientController@index')->name('ingredient.index');
Route::get('/recipe', 'RecipeController@search')->name('recipe.search');

Route::middleware('guest')->group(function() {
    Route::post('/login', 'UserController@login')->name('user.login');
    Route::post('/register', 'UserController@store')->name('user.store');
});

Route::middleware('auth:api')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/logout', 'UserController@logout');
});
