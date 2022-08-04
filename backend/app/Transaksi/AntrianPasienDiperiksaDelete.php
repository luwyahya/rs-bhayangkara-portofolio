<?php
namespace App\Transaksi;

class AntrianPasienDiperiksaDelete extends Transaksi
{
    protected $table ="antrianpasiendiperiksadelete_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
