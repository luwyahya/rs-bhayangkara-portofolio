<?php

namespace App\Transaksi;


class MappingKalakToAnggota extends Transaksi
{
    protected $table = 'mappingkalaktoanggota_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
