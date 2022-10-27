<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 24/01/2019
 * Time: 13.54
 */


namespace App\Transaksi;

class CPPasienD extends Transaksi
{
    protected $table ="cppasiend_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;


}