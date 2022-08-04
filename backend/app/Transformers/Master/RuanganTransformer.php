<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;
class RuanganTransformer extends Transformer{
    protected $list = [
        'id' => 'id',
        'kdruangan' => 'kdRuangan',
        'noruangan' => 'noRuangan',
        'lokasiruangan' => 'lokasiRuangan',
        'namaruangan' => 'namaRuangan',
        'namaexternal' => 'namaExternal',
        'reportdisplay' => 'reportDisplay',

    ];

}
