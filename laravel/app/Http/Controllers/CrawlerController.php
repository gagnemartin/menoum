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
