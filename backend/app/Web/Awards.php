<?php

namespace App\Web\Admin;

use Illuminate\Database\Eloquent\Model;

class Awards extends Model
{
    protected $table = 'awards_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}
