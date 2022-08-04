<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class RekananTransformer extends Transformer
{
    protected $list = [
        "id" => "id",
        "kdprofile" => "kdProfile",
        "statusenabled" => "statusEnabled",
        "kodeexternal" => "kodeExternal",
        "namaexternal" => "namaExternal",
        "norec" => "noRec",
        "reportdisplay" => "reportDisplay",
        "objectdesakelurahanfk" => "desakelurahanFk",
//        "desakelurahan.namadesakelurahan" => "namaDesakelurahan",
        "objectjenisrekananfk" => "jenisRekananFk",
//        "jenis_rekanan.jenisrekanan" => "jenisRekanan",
        "objectkecamatanfk" => "kecamatanFk",
//        "kecamatan.namakecamatan" => "namaKecamatan",
        "objectkotakabupatenfk" => "kotakabupatenFk",
//        "kotakabupaten.namakotakabupaten" => "namaKotakabupaten",
        "objectpropinsifk" => "propinsiFk",
//        "propinsi.namapropinsi" => "namaPropinsi",
        "objectrekananheadfk" => "rekananHeadFk",
//        "rekanan.namarekanan" => "namaRekanan",
        "alamatlengkap" => "alamatlengkap",
        "bankrekeningatasnama" => "bankRekeningAtasNama",
        "bankrekeningnama" => "bankRekeningNama",
        "bankrekeningnomor" => "bankRekeningNomor",
        "contactperson" => "contactperson",
        "desakelurahan" => "desakelurahan",
        "email" => "email",
        "faksimile" => "faksimile",
        "kdrekanan" => "kdRekanan",
        "kecamatan" => "kecamatan",
        "kodepos" => "kodePos",
        "kotakabupaten" => "kotakabupaten",
        "namarekanan" => "namaRekanan",
        "nopkp" => "noPkp",
        "npwp" => "npwp",
        "qrekanan" => "qRekanan",
        "rtrw" => "rtrw",
        "telepon" => "telepon",
        "website" => "website",
        "namadesakelurahan" => "namaDesakelurahan",
        "namakecamatan" => "namaKecamatan",
        "namakotakabupaten" => "namaKotakabupaten",
        "perjanjiankerjasama" => "perjanjiankerjasama",
        //        "objectaccountfk"     => "accountFk",
        //        "chart_of_account.chartofaccount"     => "chartOfAccount",
        //        "objectpegawaifk"     => "pegawaiFk",
        //        "pegawai.pegawai"     => "pegawai",

    ];
}
 