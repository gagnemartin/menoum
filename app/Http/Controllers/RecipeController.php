<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Recipe;
use App\Ingredient;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class RecipeController extends Controller
{
    public function search(Request $request)
    {
        $data = Recipe::whereHas('ingredients', function ($q) use ($request) {
            $q->whereIn('ingredients.id', $request->ingredients);
        })->with('media')->get();

        return $data;
    }

    public function destroy(int $id)
    {
        $recipe = Recipe::where('id', $id)->with('ingredients')->first();
        $ingredients = $recipe['ingredients'];
        if ($recipe) {
            $recipe->ingredients()->detach();
            $recipe->delete();
            $this->updateIngredientCount($ingredients, true);

            return 'Deleted';
        }

        return 'Dont exist';
    }

    public function updateIngredientCount($ingredients, $type = false)
    {
        if ($type) {
            foreach ($ingredients as $ingredient) {
                $query = Ingredient::withCount('recipes')->where('id', $ingredient->id)->first();
                Ingredient::where('id', $query->id)
                    ->update(['recipe_count' => $query->recipes_count]);
            }
        } else {
            foreach ($ingredients as $id => $data) {
                $query = Ingredient::withCount('recipes')->where('id', $id)->first();
                Ingredient::where('id', $query->id)
                    ->update(['recipe_count' => $query->recipes_count]);
            }
        }
    }
}
