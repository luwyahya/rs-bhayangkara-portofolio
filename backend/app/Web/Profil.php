<?php

namespace App\Web\Admin;
use DB;
class Profil extends AdminModel
{
    protected $table = 'profile_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\ProfilTransformer');
    }

    public static function getData(){
        //$query = DB::table('profile_m')->select('*');
        //$data = $query->get();
        return 'Test';//$data;
    }

}
