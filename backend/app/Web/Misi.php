<?php

namespace App\Web;

class Misi extends AdminModel
{
    protected $table = 'profilehistorimisi_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}
