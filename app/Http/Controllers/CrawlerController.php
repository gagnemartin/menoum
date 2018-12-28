<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use App\Url;
use App\Recipe;
use App\Ingredient;

class CrawlerController extends Controller
{
    public function getUrls()
    {
        $process = new Process('python3 ' . app_path('Http/Crawler/urls.py'));
        $process->setTimeout(null);
        $process->run();

        // executes after the command finishes
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $output = $process->getOutput();
        $output = json_decode($output, true);
        $output = array_unique($output);
        $data = [];
        $now = Carbon::now();

        $urls = Url::pluck('url')->toArray();


        foreach ($output as $url) {

            if (!in_array($url, $urls)) {
                $data[] = [
                    'url' => $url,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'crawled' => false
                ];
            }
        }

        // Insert records if any
        if (count($data) > 0) {
            Url::insert($data);
        }
    }

    public function crawl()
    {

//        $command = escapeshellcmd('E:\Wamp\www\menoum\app\Http\Crawler\crawler.py');
//        $output = shell_exec($command);

        $process = new Process('python3 ' . app_path('Http/Crawler/Recipes.py'));
        $process->setTimeout(null);
        $process->run();

        // executes after the command finishes
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $output = $process->getOutput();
        $output = json_decode($output, true);
//        dump($output);
//
//        foreach ($output as $recipe) {
//            $recipe['user_id'] = 11;
//            $recipe['ingredients'] = array_unique($recipe['ingredients'], SORT_REGULAR);
//            $recipe['ingredient_count'] = count($recipe['ingredients']);
//
//
//            $ingredientsIds = [];
//            $newIngredients = [];
//
//            echo '<h2>' . $recipe['name'] . '</h2>';
//            echo '<a href="' . $recipe['source'] .'" target="_BLANK"><img width="400px" src="' . $recipe['media']['url'] . '"' . '/></a>';
//
//            echo '<ul>';
//            foreach ($recipe['ingredients'] as $ingredient) {
//                // Find if the ingredient already exists in the table
//                $query = Ingredient::select('id')->where('name', 'like', '%' . str_singular($ingredient['name']) . '%')
//                    ->first();
//
//                if ($query === null) {
//                    $newIngredients[] = [
//                        'name' => strtolower($ingredient['name']),
//                        'slug' => strtolower($ingredient['slug'])
//                    ];
//                } else {
//                    $ingredientsIds[$query['id']] = $ingredient['quantity'];
//                }
//
//                //dump($ingredient);
//                echo '<li>';
//                if (isset($ingredient['quantity']['amount'])) {
//                    echo $ingredient['quantity']['amount'] . ' ' . $ingredient['quantity']['unit'] .' of <b>' . $ingredient['name'] . '</b>';
//                } else {
//                    dump($ingredient);
//                }
//                echo '</li>';
//            }
//            echo '</ul>';
//
//            dump($recipe['instructions']);
//
//            //dump($ingredientsIds, $newIngredients);
//        }
//
//
//        die();


        foreach ($output as $recipe) {
            $recipe['user_id'] = 11;
            $recipe['ingredients'] = array_unique($recipe['ingredients'], SORT_REGULAR);
            $recipe['ingredient_count'] = count($recipe['ingredients']);


            $ingredientsIds = [];
            $newIngredients = [];
            $newIngredientsName = [];
            foreach ($recipe['ingredients'] as $ingredient) {
                $ingredientName = str_singular($ingredient['name']);
                $ingredientSlug = str_singular($ingredient['slug']);

                $query = Ingredient::select('id')->where('name', $ingredientName)
                    ->first();

                if ($query === null) {
                    if (!in_array($ingredientName, $newIngredientsName)) {
                        array_push($newIngredientsName, $ingredientName);
                        $newIngredients[] = [
                            'name' => strtolower($ingredientName),
                            'slug' => strtolower($ingredientSlug)
                        ];
                    }
                } else {
                    $ingredientsIds[$query['id']] = $ingredient['quantity'];
                }
            }

            if (count($newIngredients) > 0) {
                Ingredient::insert($newIngredients);

                foreach ($recipe['ingredients'] as $ingredient) {
                    $ingredientName = str_singular($ingredient['name']);

                    $query = Ingredient::select('id')->where('name', $ingredientName)
                        ->first();

                    $ingredientsIds[$query['id']] = $ingredient['quantity'];
                }

            }

            try {
                $savedRecipe = Recipe::create($recipe);
                $savedRecipe->ingredients()->sync($ingredientsIds);
                $savedRecipe->media()->create($recipe['media']);

                $this->updateIngredientCount($ingredientsIds);
            } catch (\Illuminate\Database\QueryException $e) {
                dd($e);
            } catch (\Exception $e) {
                dd($e);
            }

            //return response()->json($recipe);
        }
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
