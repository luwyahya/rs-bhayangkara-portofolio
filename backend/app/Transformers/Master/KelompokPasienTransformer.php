<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class KelompokPasienTransformer extends Transformer{
    protected $list = [
        'id' => 'id',
        'kelompokpasien' => 'kelompokPasien',
        'namaexternal' => 'namaExternal',
    ];
}
