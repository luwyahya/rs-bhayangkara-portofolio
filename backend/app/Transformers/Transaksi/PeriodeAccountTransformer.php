<?php
namespace App\Transformers\Transaksi;

use App\Transformers\Transformer;

class PeriodeAccountTransformer extends Transformer
{
    protected $list = [
        'norec' => 'noRec',
        'objectjenisaccountfk' => 'objectJenisAccountFk',
        'jenis_account.jenisaccount' => 'jenisAccount',
        'objectruanganfk' => 'objectRuanganFk',
        'ruangan.namaruangan' => 'namaRuangan',
        'keteranganlainnya' => 'keteranganLainnya',
        'periodeaccount' => 'periodeAccount',
        'tglawalperiode' => 'tglAwalPeriode',
        'tglakhirperiode' => 'tglAkhirPeriode',
    ];

}
