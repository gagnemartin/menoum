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
            $q->whereIn('name', $request->ingredients);
        })->with('media')->get();

        return $data;
    }

    public function crawl()
    {

//        $command = escapeshellcmd('E:\Wamp\www\menoum\app\Http\Crawler\crawler.py');
//        $output = shell_exec($command);

        $process = new Process('python3 ' . app_path('Http/Crawler/crawler.py'));
        $process->setTimeout(null);
        $process->run();

        // executes after the command finishes
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $output = $process->getOutput();
        $output = json_decode($output, true);
        dump($output);

        foreach ($output as $recipe) {
            $recipe['user_id'] = 11;
            $recipe['ingredients'] = array_unique($recipe['ingredients'], SORT_REGULAR);
            $recipe['ingredient_count'] = count($recipe['ingredients']);


            $ingredientsIds = [];
            $newIngredients = [];

            echo '<h2>' . $recipe['name'] . '</h2>';
            echo '<img width="400px" src="' . $recipe['media']['url'] . '"' . '/>';

            echo '<ul>';
            foreach ($recipe['ingredients'] as $ingredient) {
                // Find if the ingredient already exists in the table
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

                //dump($ingredient);
                echo '<li>';
                if (isset($ingredient['quantity']['amount'])) {
                    echo $ingredient['quantity']['amount'] . ' ' . $ingredient['quantity']['unit'] .' of <b>' . $ingredient['name'] . '</b>';
                } else {
                    dump($ingredient);
                }
                echo '</li>';
            }
            echo '</ul>';

            //dump($ingredientsIds, $newIngredients);
        }


        die();


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

        dd($output['ingredients']);
        if (count($newIngredients) > 0) {
            Ingredient::insert($newIngredients);

            foreach ($output['ingredients'] as $ingredient) {
                $query = Ingredient::select('id')->where('name', 'like', '%' . str_singular($ingredient['name']) . '%')
                    ->first();

                $ingredientsIds[$query['id']] = $ingredient['quantity'];
            }

        }

        dd($output);
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
