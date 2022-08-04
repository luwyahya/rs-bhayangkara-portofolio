<?php
namespace App\Transaksi;

class suratjalanambulance extends Transaksi
{
    protected $table = "suratjalanambulance";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    // public function order_pelayanan(){
    //     return $this->hasMany('App\Transaksi\OrderPelayanan', 'noorderfk');
    // }
}