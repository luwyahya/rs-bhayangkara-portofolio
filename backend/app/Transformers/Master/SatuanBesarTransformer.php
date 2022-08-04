<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class SatuanBesarTransformer extends Transformer{
    protected $list = [
      'id' => 'id',
      'statusenabled' => 'statusEnabled',
      'kdsatuanbesar' => 'kdSatuanBesar',
      'satuanbesar' => 'satuanBesar',
      'kodeexternal' => 'kodeExternal',
      'namaexternal' => 'namaExternal',
    ];
}
