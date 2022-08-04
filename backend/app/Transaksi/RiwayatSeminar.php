<?php

namespace App\Transaksi;


class RiwayatSeminar extends Transaksi
{
    protected $table = 'riwayatseminar_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
