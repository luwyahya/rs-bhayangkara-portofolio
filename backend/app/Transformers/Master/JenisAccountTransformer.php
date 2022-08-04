<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class JenisAccountTransformer extends Transformer
{
    protected $list = [
        "id" => "id",
        "kdprofile" => "kdProfile",
        "statusenabled" => "statusEnabled",
        "kodeexternal" => "kodeExternal",
        "namaexternal" => "namaExternal",
        "norec" => "noRec",
        "reportdisplay" => "reportDisplay",
        "jenisaccount" => "jenisAccount",
        "kdjenisaccount" => "kdJenisAccount",
        "qjenisaccount" => "qJenisAccount",
    ];
}
 