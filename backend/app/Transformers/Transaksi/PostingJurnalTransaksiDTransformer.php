<?php
namespace App\Transformers\Transaksi;

use App\Transformers\Transformer;

class PostingJurnalTransaksiDTransformer extends Transformer
{
    protected $list = [
        'norec' => 'noRec',
        'noposting' => 'noPosting',
        'kdprofile' => 'kdProfile',
        'nojurnal' => 'noJurnal',
        'objectaccountfk' => 'objectAccountFk',
        'account.namaaccount' => 'namaAccount',
        'account.noaccount' => 'kodeAccount',
        'hargasatuand' => 'hargaSatuanD',
        'hargasatuank' => 'hargaSatuanK',
        'norecrelated' => 'noRecRelated',
        'noreturn' => 'noReturn',
        'noclosing' => 'noClosing',
    ];
    
}
