<?php

/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 24/01/2019
 * Time: 13.37
 */

namespace App\Transaksi;

class Postmortem extends Transaksi
{
    protected $table = "postmortem_t";
    protected $fillable = [];
    public $timestamps = false;
}
