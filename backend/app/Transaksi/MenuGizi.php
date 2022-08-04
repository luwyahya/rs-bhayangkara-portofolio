<?php
namespace App\Transaksi;

class MenuGizi extends Transaksi
{
    protected $table = "menugizi_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

   
}