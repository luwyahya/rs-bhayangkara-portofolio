<?php
/**
 * Created by PhpStorm.
 * User: agus.sustian@epic01
 * Date: 09/08/2017
 * Time: 20.45
 */
namespace App\Transaksi;
class KartuStok extends Transaksi
{
    protected $table ="kartustok_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = true;
    public $incrementing = false;

    protected $dateFormat = 'Y-m-d H:i:s.u';


//    public function ruangan(){
//        return $this->belongsTo('App\Master\Ruangan', 'objectruanganfk');
//    }
//
//    public function produk(){
//        return $this->belongsTo('App\Master\Produk', 'objectruanganfk');
//    }

}