<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 24/01/2019
 * Time: 13.37
 */

namespace App\Transaksi;

class CPPasien extends Transaksi
{
    protected $table ="cppasien_t";
    protected $primaryKey = 'norec';
    protected $fillable = [];
    public $timestamps = false;


}