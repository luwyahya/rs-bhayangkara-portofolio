<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 03/12/2018
 * Time: 14:29
 */

namespace App\Transaksi;

class TempEdukasiPasien extends Transaksi
{
    protected $table = "tempedukasipasien_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}