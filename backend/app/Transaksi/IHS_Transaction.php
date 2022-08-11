<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 08/07/2022
 * Time: 10:40
 */

namespace App\Transaksi;

class IHS_Transaction extends Transaksi
{
    protected $table = "ihs_transaction";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}