<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 06/06/2018
 * Time: 09.42
 */

namespace App\Transaksi;

class HasilPemeriksaanMcu extends Transaksi
{
    protected $table ="hasilpemeriksaanmcu_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";


}
