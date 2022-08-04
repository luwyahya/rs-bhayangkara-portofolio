<?php

namespace App\Transaksi;


class KecakapanBahasa extends Transaksi
{
    protected $table = 'kecakapanbahasa_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
