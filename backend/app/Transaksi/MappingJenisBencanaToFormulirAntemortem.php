<?php

/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 24/01/2019
 * Time: 13.37
 */

namespace App\Transaksi;

class MappingJenisBencanaToFormulirAntemortem extends Transaksi
{
    protected $table = "mappingjenisbencanatoformulirantemortem_t";
    protected $primaryKey = 'id';
    protected $fillable = [];
    public $timestamps = false;
}
