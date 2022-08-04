<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class GolonganProdukTransformer extends Transformer{
    protected $list = [
      'id' => 'id',
      'statusenabled' => 'statusEnabled',
      'kdgolonganproduk' => 'kdGolonganProduk',
      'golonganproduk' => 'golonganProduk',
      'kodeexternal' => 'kodeExternal',
      'namaexternal' => 'namaExternal',
    ];
}
