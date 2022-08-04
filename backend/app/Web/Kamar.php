<?php
/**
 * Created by IntelliJ IDEA.
 * User: Jasamedika
 * Date: 24/07/2017
 * Time: 16:58
 */

namespace App\Web;

class Kamar extends AdminModel
{
    protected $table = 'kamar_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}