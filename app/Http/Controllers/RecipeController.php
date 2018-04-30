<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Recipe;
use App\Ingredient;

class RecipeController extends Controller
{
    public function search(Request $request)
    {
        $data = Recipe::whereHas('ingredients', function ($q) use ($request) {
            $q->whereIn('name', $request->ingredients);
        })->with('media')->get();

        return $data;
    }

    public function crawl()
    {
        $command = escapeshellcmd('C:\wamp\www\menoum\app\Http\Crawler\crawler.py');
        $output = shell_exec($command);
        $output = json_decode($output, true);
        $output['user_id'] = 11;
        $output['ingredients'] = array_unique($output['ingredients'], SORT_REGULAR);
        $output['ingredient_count'] = count($output['ingredients']);

        $ingredientsIds = [];
        $newIngredients = [];
        foreach ($output['ingredients'] as $ingredient) {
            $query = Ingredient::select('id')->where('name', 'like', '%' . str_singular($ingredient['name']) . '%')
                ->first();

            if ($query === null) {
                $newIngredients[] = [
                    'name' => strtolower($ingredient['name']),
                    'slug' => strtolower($ingredient['slug'])
                ];
            } else {
                $ingredientsIds[$query['id']] = $ingredient['quantity'];
            }
        }

        if (count($newIngredients) > 0) {
            Ingredient::insert($newIngredients);

            foreach ($output['ingredients'] as $ingredient) {
                $query = Ingredient::select('id')->where('name', 'like', '%' . str_singular($ingredient['name']) . '%')
                    ->first();

                $ingredientsIds[$query['id']] = $ingredient['quantity'];
            }

        }

        //dd($output);
        $recipe = Recipe::create($output);
        $recipe->ingredients()->sync($ingredientsIds);
        $recipe->media()->create($output['media']);

        $this->updateIngredientCount($ingredientsIds);

        //dd($ingredientsIds);
        return response()->json($recipe);
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
