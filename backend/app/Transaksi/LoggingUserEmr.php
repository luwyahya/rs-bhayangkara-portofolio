<?php
namespace App\Transaksi;

class LoggingUserEmr extends Transaksi
{
    protected $table ="logginguseremr_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";
}
