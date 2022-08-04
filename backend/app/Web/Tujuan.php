<?php
namespace App\Web;

class Tujuan extends AdminModel
{
    protected $table = 'profilehistoritujuan_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}