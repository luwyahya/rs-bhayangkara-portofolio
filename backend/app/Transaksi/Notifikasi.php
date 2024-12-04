<?php
namespace App\Transaksi;

class Notifikasi extends Transaksi
{
    protected $table ="notifikasi";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec"; 
}
