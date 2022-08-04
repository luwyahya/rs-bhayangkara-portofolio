<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 23/04/2018
 * Time: 15.45
 */

namespace App\Transaksi;

class Realisasi extends Transaksi
{
    protected $table ="realisasianggaran_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

//    public function pelayanan_pasien(){
//        return $this->belongsTo('App\Master\LoginUser',  'id','objectloginuserfk');
//    }
}
