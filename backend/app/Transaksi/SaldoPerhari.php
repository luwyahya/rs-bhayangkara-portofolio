<?php
/**
 * Created by PhpStorm.
 * User: epic01
 * Date: 09/08/2017
 * Time: 23.04
 */

namespace App\Transaksi;

class SaldoPerhari extends Transaksi
{
    protected $table ="temp_saldoperhari_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}