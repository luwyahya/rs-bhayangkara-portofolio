<?php
namespace App\Transaksi;

use App\Master\SettingDataFixed;
class DokumenPasienMaster extends Transaksi
{
    protected $table ="dokumenpasienmaster_t";
    protected $fillable = ['objectjenisdokumencasemix'];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
