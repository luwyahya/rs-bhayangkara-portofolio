<?php

namespace App\Transaksi;


class RiwayatSpkk extends Transaksi
{
    protected $table = 'riwayatspkk_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
