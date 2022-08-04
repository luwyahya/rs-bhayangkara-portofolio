<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class JenisKartuTransformer extends Transformer{
    protected $list = [
        "id"       => "id",
                "kdprofile"       => "kdProfile",
                "statusenabled"       => "statusEnabled",
                "kodeexternal"       => "kodeExternal",
                "namaexternal"       => "namaExternal",
                "norec"       => "noRec",
                "reportdisplay"       => "reportDisplay",
                "jeniskartu"       => "jenisKartu",
                "kdjeniskartu"       => "kdJenisKartu",
                "qjeniskartu"       => "qJenisKartu",
        
    ];
 }
 