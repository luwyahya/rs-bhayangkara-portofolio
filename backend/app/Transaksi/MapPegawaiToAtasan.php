<?php

namespace App\Transaksi;


class MapPegawaiToAtasan extends Transaksi
{
    protected $table = 'mappegawaitoatasan_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}