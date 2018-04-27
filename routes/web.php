<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'search')->name('index');

Route::get('/ingredient/{ingredient}', 'IngredientController@search')->name('ingredient.search');
Route::get('/recipe', 'RecipeController@search')->name('recipe.search');

Auth::routes();
