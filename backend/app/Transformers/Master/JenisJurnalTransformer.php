<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class JenisJurnalTransformer extends Transformer
{
    protected $list = [
        "id" => "id",
        "jenisjurnal" => "jenisJurnal",
    ];
}
