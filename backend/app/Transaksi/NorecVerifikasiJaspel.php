<?php

namespace App\Transaksi;

class NorecVerifikasiJaspel extends Transaksi
{
    protected $table ="norecverifikasijaspel_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
