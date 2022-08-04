<?php

namespace App\Master;

// use Illuminate\Database\Eloquent\Model;
//use DB;

class ResepMaster extends MasterModel
{
    protected $table = 'resepmaster_m';
    protected $fillable = [];
    public $timestamps = false;

    public $incrementing = false;
    protected $primaryKey = "norec";


}


