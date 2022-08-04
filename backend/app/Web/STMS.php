<?php

namespace App\Web;

class STMS extends AdminModel
{
    protected $table = 'profilehistoristms_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}
