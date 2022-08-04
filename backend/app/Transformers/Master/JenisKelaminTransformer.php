<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class JenisKelaminTransformer extends Transformer{
    protected $list = [
        "id"       => "id",
                "kdprofile"       => "kdProfile",
                "statusenabled"       => "statusEnabled",
                "kodeexternal"       => "kodeExternal",
                "namaexternal"       => "namaExternal",
                "norec"       => "noRec",
                "reportdisplay"       => "reportDisplay",
                "jeniskelamin"       => "jenisKelamin",
                "kdjeniskelamin"       => "kdJenisKelamin",
                "qjeniskelamin"       => "qJenisKelamin",
        
    ];
 }
 