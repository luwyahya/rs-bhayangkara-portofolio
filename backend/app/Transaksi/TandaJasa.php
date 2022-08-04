<?php

namespace App\Transaksi;


class TandaJasa extends Transaksi
{
    protected $table = 'tandajasa_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
