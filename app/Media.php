<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'name',
        'url'
    ];

    public function mediaable()
    {
        return $this->morphTo();
    }
}
