<?php
namespace App\Transaksi;

class DokumenTransaksi extends Transaksi
{
    protected $table ="dokumen_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
