<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class StatusProdukTransformer extends Transformer{
    protected $list = [
      'id' => 'id',
      'statusenabled' => 'statusEnabled',
      'kdstatusproduk' => 'kdStatusProduk',
      'statusproduk' => 'statusProduk',
      'kodeexternal' => 'kodeExternal',
      'namaexternal' => 'namaExternal',
    ];
}
