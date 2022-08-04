<?php

namespace App\Web;

class KarirKategoriPegawai extends AdminModel
{
    protected $table = 'kategorypegawai_m';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }
}
