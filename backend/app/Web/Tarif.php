<?php
namespace App\Web;

class Tarif extends AdminModel
{
    protected $table = 'harganettoprodukbykelas_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}