<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ingredient;

class IngredientController extends Controller
{
    public function Search(string $value)
    {
        $data = Ingredient::
            where('name', 'like', $value . '%')
            ->where('approved', true)
            ->limit(10)
            ->orderBy('name', 'asc')
            ->get();
        return $data;
    }
}
