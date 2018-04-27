<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Recipe;

class RecipeController extends Controller
{
    public function search(Request $request)
    {
        $data = Recipe::whereHas('ingredients', function($q) use($request) {
            $q->whereIn('name', $request->ingredients);
        })->get();

        return $data;
    }
}
