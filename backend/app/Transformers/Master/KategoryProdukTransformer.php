<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class KategoryProdukTransformer extends Transformer{
    protected $list = [
      'id' => 'id',
      'statusenabled' => 'statusEnabled',
      'kdkategoryproduk' => 'kdKategoryProduk',
      'kategoryProduk' => 'kategoryProduk',
      'kodeexternal' => 'kodeExternal',
      'namaexternal' => 'namaExternal',
    ];
}
