<?php
namespace App\Transaksi;

class MjknLog extends Transaksi
{
    protected $table ="mjknlog_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

}
