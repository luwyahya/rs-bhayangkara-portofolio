<?php
/**
 * Created by PhpStorm.
 * User: Noname
 * Date: 02/07/2021
 * Time: 12:41
 */


namespace App\Transaksi;

class pasienisoman extends Transaksi
{
    protected $table = "pasienisoman_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";
}