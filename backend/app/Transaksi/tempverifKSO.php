<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 3/27/2018
 * Time: 17:18
 */

///MapRuanganToAkomodasi

namespace App\Transaksi;
class tempVerifKSO extends Transaksi
{
    protected $table ="tempverifKSO_t";
    protected $primaryKey = 'id';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;


}