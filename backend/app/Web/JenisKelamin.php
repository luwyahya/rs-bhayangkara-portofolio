<?php

namespace App\Web\Admin;

class JenisKelamin extends AdminModel
{
    protected $table = 'jeniskelamin_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}
