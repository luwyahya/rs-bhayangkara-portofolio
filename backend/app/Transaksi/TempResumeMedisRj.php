<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 03/12/2018
 * Time: 14:29
 */

namespace App\Transaksi;

class TempResumeMedisRj extends Transaksi
{
    protected $table = "tempresumerj_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}