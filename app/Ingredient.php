<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $collection = 'ingredients';

    protected $fillable = [
        'name'
    ];
}
