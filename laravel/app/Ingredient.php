<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{

    public $timestamps = false;

    protected $collection = 'ingredients';

    protected $fillable = [
        'name',
        'slug',
        'recipe_count'
    ];

    /**
     * Get all of the recipe's ingredients.
     */
    public function recipes()
    {
        return $this->belongsToMany('App\Recipe');
    }
}
