<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use App\Url;

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
}
