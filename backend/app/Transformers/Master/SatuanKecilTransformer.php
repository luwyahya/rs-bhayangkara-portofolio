<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class SatuanKecilTransformer extends Transformer{
    protected $list = [
      'id' => 'id',
      'statusenabled' => 'statusEnabled',
      'kdsatuankecil' => 'kdSatuanKecil',
      'satuankecil' => 'satuanKecil',
      'kodeexternal' => 'kodeExternal',
      'namaexternal' => 'namaExternal',
    ];
}
