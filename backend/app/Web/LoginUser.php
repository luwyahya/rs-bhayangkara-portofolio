<?php

namespace App\Web;
use DB;
class LoginUser extends AdminModel
{
    protected $table ="loginuser_s";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    // public function pegawai(){
    //     return $this->belongsTo('App\Master\Pegawai', 'objectpegawaifk');
    // }
}
