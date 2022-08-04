<?php

namespace App\Web;

class KarirJabatan extends AdminModel
{
    protected $table = 'jabatan_m';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }
}
