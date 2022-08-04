<?php

namespace App\Transaksi;


class OrganisasiProfesi extends Transaksi
{
    protected $table = 'organisasiprofesi_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
