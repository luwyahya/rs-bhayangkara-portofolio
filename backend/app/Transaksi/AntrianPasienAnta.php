<?php

namespace App\Transaksi;

class AntrianPasienAnta extends Transaksi
{
    protected $table = "antrianpasienanta_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
