<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class DetailJenisProdukTransformer extends Transformer{
    protected $list = [
      'id' => 'id',
      'statusenabled' => 'statusEnabled',
      'kddetailjenisproduk' => 'kdDetailJenisProduk',
      'detailjenisproduk' => 'detailJenisPproduk',
      'kodeexternal' => 'kodeExternal',
      'namaexternal' => 'namaExternal',
    ];
}
