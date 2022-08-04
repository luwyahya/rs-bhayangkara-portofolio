<?php
namespace App\Transaksi;

use App\Master\SettingDataFixed;
class PasienDaftarSensus extends Transaksi
{
    protected $table ="pasiendaftarsensus_t";
    protected $fillable = ['objectkelompokpasienlastfk'];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
