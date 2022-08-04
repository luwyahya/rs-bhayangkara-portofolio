<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

use League\Fractal\Resource\Collection;

class AgamaTransformer extends Transformer{

  protected $list = [
    'id' => 'id',
    'statusenabled' => 'statusEnabled',
    'kdprofile' => 'kdProfile',
    'norec' => 'noRec',
    'reportdisplay' => 'reportDisplay',
    'kodeexternal' => 'kodeExternal',
    'namaexternal' => 'namaExternal',
    'agama' => 'agama',
    'kdagama' => 'kdAgama',
    'qagama' => 'qAgama'
  ];        
}
