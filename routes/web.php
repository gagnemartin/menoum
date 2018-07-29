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

Route::get('/ingredients/{ingredient}', 'IngredientController@search')->name('ingredient.search');
Route::get('/ingredients', 'IngredientController@index')->name('ingredient.index');
Route::get('/recipe', 'RecipeController@search')->name('recipe.search');
Route::get('/crawl', 'RecipeController@crawl')->name('recipe.crawl');
Route::get('/destroy/{recipeId}', 'RecipeController@destroy')->name('recipe.destroy');

Auth::routes();
