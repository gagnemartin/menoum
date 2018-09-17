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

/**
 * Admin Routes
 */
Route::prefix('admin')->middleware('auth', 'can:view,create,update,delete')->group(function() {
    Route::view('ingredients', 'admin.ingredients')->name('admin.ingredients');

    Route::get('ingredients/list', 'IngredientController@list')->name('admin.ingredients.list');
    Route::post('ingredients/{ingredient}/visibility', 'IngredientController@visibility')->name('admin.ingredients.list');

    Route::get('crawl', 'RecipeController@crawl')->name('admin.recipe.crawl');
    Route::get('urls', 'CrawlerController@getUrls')->name('admin.recipe.urls');
    Route::get('destroy/{recipeId}', 'RecipeController@destroy')->name('admin.recipe.destroy');
});

Auth::routes();
