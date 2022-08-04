<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class StrukturAccountTransformer extends Transformer
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
        "formataccount" => "formatAccount",
        "kdstrukturaccount" => "kdStrukturAccount",
        "levelaccount" => "levelAccount",
        "nourutakhir" => "noUrutAkhir",
        "nourutawal" => "noUrutAwal",
        "strukturaccount" => "strukturAccount",
        //        "objecthistoryloginifk"     => "historyloginiFk",
        //        "historyloginmodulaplikasi.historyloginmodulaplikasi"     => "historyloginmodulaplikasi",
        //        "objecthistoryloginsfk"     => "historyloginsFk",
        //        "objecthistoryloginufk"     => "historyloginuFk",

    ];
}
 