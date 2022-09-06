<?php
namespace App\Transaksi;

use App\Master\SettingDataFixed;
class DiagnosaInacbg extends Transaksi
{
    protected $table ="diagnosainacbg_t";
    protected $fillable = ['noregistrasifk'];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
