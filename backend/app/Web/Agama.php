<?php

namespace App\Web\Admin;

class Agama extends AdminModel
{
    protected $table = 'agama_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}
