<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class KelompokTransaksiTransformer extends Transformer{
    protected $list = [
        "id"       => "id",
                "kdprofile"       => "kdProfile",
                "statusenabled"       => "statusEnabled",
                "kodeexternal"       => "kodeExternal",
                "namaexternal"       => "namaExternal",
                "norec"       => "noRec",
                "reportdisplay"       => "reportDisplay",
                "iscostinout"       => "iscostiNoUt",
                "kdkelompoktransaksi"       => "kdKelompoktransaksi",
                "kelompoktransaksi"       => "kelompoktransaksi",
                "qkelompoktransaksi"       => "qkelompoktransaksi",
        
    ];
 }
 