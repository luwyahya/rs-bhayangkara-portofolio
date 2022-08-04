<?php
namespace App\Transformers\Transaksi;

use App\Transformers\Transformer;

class PeriodeAccountSaldoTransformer extends Transformer
{
    protected $list = [
        'norec' => 'noRec',
        'objectaccountfk' => 'id',
        'account.namaaccount' => 'namaAccount',
        'keteranganlainnya' => 'keterangan',
        'saldoakhirdperiode' => 'saldoAkhirD',
        'saldoakhirkperiode' => 'saldoAkhirK',
        'saldoawaldperiode' => 'saldoAwalD',
        'saldoawalkperiode' => 'saldoAwalK',
        'objectperiodeaccountfk' => 'objectPeriodeAccountFk',
        'periode_account.periodeaccount' => 'periodeaAccount',
    ];

}
