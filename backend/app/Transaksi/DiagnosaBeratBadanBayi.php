<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 12/9/2019
 * Time: 4:25 PM
 */
namespace App\Transaksi;

class DiagnosaBeratBadanBayi extends Transaksi
{
    protected $table = "diagnosaberatbadanbayi_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}