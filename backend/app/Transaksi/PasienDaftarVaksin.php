<?php
namespace App\Transaksi;

use App\Master\SettingDataFixed;
class PasienDaftarVaksin extends Transaksi
{
    protected $table ="pasiendaftarvaksin_t";
    protected $fillable = ['objectjkfk'];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
