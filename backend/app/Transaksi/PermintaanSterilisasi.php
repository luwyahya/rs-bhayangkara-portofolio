<?php

namespace App\Transaksi;

// use Illuminate\Database\Eloquent\Model;
//use DB;
class PermintaanSterilisasi extends Transaksi
{
    protected $table ="cssdpermintaansterilisasi_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}



