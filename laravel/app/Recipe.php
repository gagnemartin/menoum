<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $collection = 'recipes';

    protected $fillable = [
        'name',
        'slug',
        'cooking',
        'preparation',
        'instructions',
        'total_time',
        'ingredient_count',
        'user_id',
        'source'
    ];

    /**
     * Get all of the recipe's ingredients.
     */
    public function ingredients()
    {
        return $this->belongsToMany('App\Ingredient');
    }

    /**
     * Get all of the recipe's media.
     */
    public function media()
    {
        return $this->morphMany('App\Media', 'mediaable');
    }
}
