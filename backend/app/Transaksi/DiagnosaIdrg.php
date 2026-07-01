<?php

namespace App\Transaksi;

use App\Master\SettingDataFixed;

class DiagnosaIdrg extends Transaksi
{
    protected $table = "diagnosaidrg_t";
    protected $fillable = ['noregistrasifk'];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
