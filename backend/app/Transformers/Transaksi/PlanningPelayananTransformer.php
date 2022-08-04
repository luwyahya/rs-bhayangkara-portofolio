<?php
namespace App\Transformers\Transaksi;

use App\Transformers\Transformer;

class PlanningPelayananTransformer extends Transformer
{
    protected $list = [
        'id' => 'id',
        'kdprodukaset' => 'kdProduk',
        'noregisteraset' => 'noregisteraset',
        'nopolisiaset' => 'nopolisiaset',
        'tglpemeliharaan' => 'tglpemeliharaan',
        'tglkontrakservice' => 'tglkontrakservice',
        'tglkalibrasi' => 'tglkalibrasi',
        'objectrekananfk' => 'objectrekananfk',
        'rekanan.namarekanan' => 'namaRekanan',
        'objectpegawaifk' => 'objectpegawaifk',
        'pegawai.namalengkap' => 'namaLengkap',
    ];

}
