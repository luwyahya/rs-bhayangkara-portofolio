<?php
/**
 * Created by PhpStorm.
 * User: ASH
 * Date: 12/9/2019
 * Time: 4:25 PM
 */
namespace App\Transaksi;

class AsuhanGiziDetail extends Transaksi
{
    protected $table = "asuhan_gizi_detail_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}