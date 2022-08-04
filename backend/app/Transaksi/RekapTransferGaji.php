<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 3/27/2018
 * Time: 17:18
 */

///MapRuanganToAkomodasi

namespace App\Transaksi;
class RekapTransferGaji extends Transaksi
{
    protected $table ="rekaptransfergaji_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;


}