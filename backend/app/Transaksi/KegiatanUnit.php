<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 23/04/2018
 * Time: 15.45
 */

namespace App\Transaksi;

class KegiatanUnit extends Transaksi
{
    protected $table = "kegiatanunit_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

//    public function pelayanan_pasien(){
//        return $this->belongsTo('App\Master\LoginUser',  'id','objectloginuserfk');
//    }
}
