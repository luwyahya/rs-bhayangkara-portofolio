<?php

namespace App\Transaksi;

class SetoranPiutangJurnal extends Transaksi
{
    protected $table ="setoranpiutangjurnal_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
