<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 3/27/2018
 * Time: 17:18
 */

///MapRuanganToAkomodasi

namespace App\Transaksi;
class VerifKSO extends Transaksi
{
    protected $table ="verifKSO_t";
    protected $primaryKey = 'id';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;


}