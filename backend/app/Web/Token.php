<?php

namespace App\Web;
use DB;
class Token extends AdminModel
{
    protected $table ="token";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    // public function pegawai(){
    //     return $this->belongsTo('App\Master\Pegawai', 'objectpegawaifk');
    // }
}
