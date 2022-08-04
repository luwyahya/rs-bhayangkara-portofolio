<?php

namespace App\Web;

class KarirDokumen extends AdminModel
{
    protected $table = 'dokumen_m';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }
}

