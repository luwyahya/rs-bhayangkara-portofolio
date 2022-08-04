<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 3/27/2018
 * Time: 17:18
 */

///MapRuanganToAkomodasi

namespace App\Transaksi;
class MapPetugasPelaksanaBpjs extends Transaksi
{
    protected $table ="mappetugaspelaksanabpjs_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'id';

}