<?php

namespace App\Transaksi;


class RiwayatDikjur extends Transaksi
{
    protected $table = 'riwayatdikjur_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
