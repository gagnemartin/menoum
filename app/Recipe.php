<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $collection = 'recipes';

    protected $fillable = [
        'name'
    ];

    public function ingredients()
    {
        return $this->belongsToMany('App\Ingredient');
    }
}
