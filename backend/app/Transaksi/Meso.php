<?php
/**
 * Created by PhpStorm.
 * User: ASH
 * Date: 12/9/2019
 * Time: 4:25 PM
 */
namespace App\Transaksi;

class Meso extends Transaksi
{
    protected $table = "meso_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}