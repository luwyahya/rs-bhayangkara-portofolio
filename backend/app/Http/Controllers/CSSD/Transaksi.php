<?php
namespace App\Http\Controllers\Transaksi\CSSD;


use App\Http\Controllers\Transaksi\TransaksiMobilisasiDanaController;
use App\Traits\PostingJurnalTrait;
class Transaksi extends TransaksiMobilisasiDanaController
{
    use PostingJurnalTrait;
    public function __construct()
    {
        parent::__construct();
    }
}