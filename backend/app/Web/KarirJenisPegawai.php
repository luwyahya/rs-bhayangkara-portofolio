<?php

namespace App\Web;

class KarirJenisPegawai extends AdminModel
{
    protected $table = 'jenispegawai_m';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }
}
