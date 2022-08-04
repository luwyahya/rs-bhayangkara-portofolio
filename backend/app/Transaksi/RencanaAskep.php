<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 24/01/2019
 * Time: 13.37
 */

namespace App\Transaksi;

class RencanaAskep extends Transaksi
{
    protected $table ="rencanaaskep_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;


}