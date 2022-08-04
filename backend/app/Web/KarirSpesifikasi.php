<?php

namespace App\Web;

class KarirSpesifikasi extends AdminModel
{
    protected $table = 'spesifikasi_m';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }
}

