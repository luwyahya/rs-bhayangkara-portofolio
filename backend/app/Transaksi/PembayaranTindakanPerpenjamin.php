<?php
namespace App\Transaksi;

class PembayaranTindakanPerpenjamin extends Transaksi
{
    protected $table = "pembayarantindakanperpenjamin_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec"; 
}