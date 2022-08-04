<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class KelompokUserTransformer extends Transformer
{
    protected $list = [
        "id" => "id",
        "kelompokuser" => "kelompokUser",
    ];
}
