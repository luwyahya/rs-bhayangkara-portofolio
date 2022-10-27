<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 5/11/2021
 * Time: 1:12 AM
 */

namespace App\Transaksi;

class CPKegiatanUraian extends Transaksi
{
    protected $table ="cpkegiatanuraian_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;


}