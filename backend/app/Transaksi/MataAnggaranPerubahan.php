<?php
/**
 * Created by VsCode.
 * User: Dwiyan Yogaswara
 * Date: 22/07/2020
 * Time: 13.33
 */

namespace App\Transaksi;

class MataAnggaranPerubahan extends Transaksi
{
    protected $table ="mataanggaranperubahan_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
