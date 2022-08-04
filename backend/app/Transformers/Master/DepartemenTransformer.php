<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

use League\Fractal\Resource\Collection;

class DepartemenTransformer extends Transformer{

    protected $list = [
        'id' => 'id',
        'statusenabled' => 'statusEnabled',
        'kdprofile' => 'kdProfile',
        'namadepartemen' => 'namadepartemen',
        'reportdisplay' => 'reportDisplay',
        'kodeexternal' => 'kodeExternal',
        'namaexternal' => 'namaExternal',
    ];
}

