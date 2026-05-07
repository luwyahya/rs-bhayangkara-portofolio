<?php
namespace App\Transaksi;

class PAPJ extends Transaksi
{
    protected $table = "papjstatus_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}