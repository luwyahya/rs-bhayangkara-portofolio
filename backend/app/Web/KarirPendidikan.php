<?php

namespace App\Web;

class KarirPendidikan extends AdminModel
{
    protected $table = 'pendidikan_m';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }
}

