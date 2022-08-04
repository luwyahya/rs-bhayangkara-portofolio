<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class CaraBayarTransformer extends Transformer{
    protected $list = [
        "id"       => "id",
                "kdprofile"       => "kdProfile",
                "statusenabled"       => "statusEnabled",
                "kodeexternal"       => "kodeExternal",
                "namaexternal"       => "namaExternal",
                "norec"       => "noRec",
                "reportdisplay"       => "reportDisplay",
                "carabayar"       => "carabaYaR",
                "kdcarabayar"       => "kdCarabaYaR",
                "qcarabayar"       => "qcarabaYaR",
        
    ];
 }
 