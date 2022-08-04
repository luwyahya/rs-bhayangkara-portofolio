<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class BankTransformer extends Transformer{
    protected $list = [
        "id"       => "id",
                "kdprofile"       => "kdProfile",
                "statusenabled"       => "statusEnabled",
                "kodeexternal"       => "kodeExternal",
                "namaexternal"       => "namaExternal",
                "norec"       => "noRec",
                "reportdisplay"       => "reportDisplay",
                "kdbank"       => "kdBank",
                "nama"       => "nama",
        
    ];
 }
 