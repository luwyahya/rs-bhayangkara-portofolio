<?php

namespace App\Transaksi;


class FotoPegawai extends Transaksi
{
    protected $table = 'fotopegawai_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
