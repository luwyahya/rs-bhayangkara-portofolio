<?php
namespace App\Transaksi;

class PapAlergi extends Transaksi
{
    protected $table = "papalergi_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

 
}