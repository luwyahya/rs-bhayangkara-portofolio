<?php
namespace App\Transformers;
class KelasTransformer extends Transformer{


    public function transform($kelas)
    {
        return [
            'kelas_id' => $kelas['id'],
            'namaexternal' => $kelas['namaexternal'],
            'reportdisplay' => $kelas['reportdisplay']
        ];
    }
}
