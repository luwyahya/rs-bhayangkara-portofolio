<?php

namespace App\Transaksi;


class MappingVicToPegawai extends Transaksi
{
    protected $table = 'mappingvictodatapegawai_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
