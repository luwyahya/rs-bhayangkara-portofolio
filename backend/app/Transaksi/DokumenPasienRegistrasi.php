<?php
namespace App\Transaksi;

use App\Master\SettingDataFixed;
class DokumenPasienRegistrasi extends Transaksi
{
    protected $table ="dokumenpasienregistrasi_t";
    protected $fillable = ['objectjenisdokumencasemix'];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
