<?php

namespace App\Web;

class Visi extends AdminModel
{
    protected $table = 'profilehistorivisi_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}
