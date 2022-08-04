<?php
namespace App\Transaksi;

class AntrianPasienRegistrasiPasienBaruMjkn extends Transaksi
{
    protected $table ="antrianpasienregistrasipasienbarumjkn_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
