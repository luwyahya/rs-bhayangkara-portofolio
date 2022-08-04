<?php
namespace App\Transaksi;

class DviPelapor extends Transaksi
{
    protected $table ="dvipelapor_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
