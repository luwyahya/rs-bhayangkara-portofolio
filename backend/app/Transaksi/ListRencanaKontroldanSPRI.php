<?php

namespace App\Transaksi;

class ListRencanaKontroldanSPRI extends Transaksi
{
    protected $table = "listrencanakontroldanspri_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
