<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 06/06/2018
 * Time: 09.42
 */

namespace App\Transaksi;

class JadwalOperasiBpjs extends Transaksi
{
    protected $table ="jadwaloperasijkn_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}
