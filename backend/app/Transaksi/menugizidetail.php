<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 12/12/2018
 * Time: 11.36
 */
namespace App\Transaksi;

class menugizidetail extends Transaksi
{
    protected $table = "menugizidetail_m";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";
}

