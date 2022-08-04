<?php

namespace App\Web;

class KarirKualifikasiJurusan extends AdminModel
{
    protected $table = 'kualifikasijurusan_m';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }
}


