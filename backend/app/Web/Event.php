<?php

namespace App\Web\Admin;
use DB;
class Event extends AdminModel
{
    protected $table = 'event_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

	public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\ProfilTransformer');
    }
}
