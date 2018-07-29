<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ingredient;

class IngredientController extends Controller
{
    public function Search(string $value)
    {
        $data = Ingredient::
            where(function ($query) use ($value) {
                if (strlen($value) >= 2) {
                    $query->where('name', 'like', $value . '%')
                        ->orWhere('name', 'like', '%' . $value . '%');
                } else {
                    $query->where('name', 'like', $value . '%');
                }
        })
            ->where('approved', true)
            ->limit(5)
            ->orderBy('recipe_count', 'desc')
            ->get();

        return $data;
    }

    public function Index()
    {
        $data = Ingredient::where('approved', true)
            ->orderBy('recipe_count', 'desc')
            ->get();

        return $data;
    }
}
