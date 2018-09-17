<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use App\Ingredient;
use Illuminate\Support\Facades\DB;

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

    public function List()
    {
        $data = Ingredient::orderBy('approved', 'asc')
            ->get();

        return $data;
    }

    public function Visibility(Ingredient $ingredient, Request $request)
    {
        $ingredient = Ingredient::where('id', $ingredient->id)->first();

        $ingredient->approved = $request->get('approved');

        $ingredient->save();


        return
            response()->json([
                'data' => $ingredient,
                'status' => 'success'
            ]);
    }
}
