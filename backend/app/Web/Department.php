<?php
/**
 * Created by IntelliJ IDEA.
 * User: Jasamedika
 * Date: 24/07/2017
 * Time: 14:27
 */

namespace App\Web;

class Department extends AdminModel
{
    protected $table = 'departemen_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}