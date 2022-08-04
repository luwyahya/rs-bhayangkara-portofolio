<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class KategoryAccountTransformer extends Transformer
{
    protected $list = [
        "id" => "id",
        "kdprofile" => "kdProfile",
        "statusenabled" => "statusEnabled",
        "kodeexternal" => "kodeExternal",
        "namaexternal" => "namaExternal",
        "norec" => "noRec",
        "reportdisplay" => "reportDisplay",
        "objectjenisaccountfk" => "jenisAccountFk",
        "jenis_account.jenisaccount" => "jenisAccount",
        "kategoryaccount" => "kategoryAccount",
        "kdkategoryaccount" => "kdKategoryAccount",
        "qkategoryaccount" => "qKategoryAccount",

    ];
}
 