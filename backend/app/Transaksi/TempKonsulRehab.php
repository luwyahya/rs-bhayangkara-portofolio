<?php

namespace App\Transaksi;

class TempKonsulRehab extends Transaksi
{
    protected $table = "tempkonsulrehab_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
