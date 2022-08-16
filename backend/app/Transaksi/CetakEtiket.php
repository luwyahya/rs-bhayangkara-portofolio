<?php
namespace App\Transaksi;

use App\Master\SettingDataFixed;
class CetakEtiket extends Transaksi
{
    protected $table ="cetaketiket_t";
    protected $fillable = ['norecpp'];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
