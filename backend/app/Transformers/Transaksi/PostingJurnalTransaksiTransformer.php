<?php
namespace App\Transformers\Transaksi;

use App\Transformers\Transformer;

class PostingJurnalTransaksiTransformer extends Transformer
{
    public $list = [
        'norec' => 'noRec',
        'noposting' => 'noPosting',
        'nojurnal' => 'noJurnal',
        'nojurnal_intern' => 'noJurnalIntern',
        // 'objectjenisjurnalfk' => 'objectJenisJurnalFK',
        // 'jenis_jurnal.jenisjurnal' => 'jenisJurnal', //relationnya belum ada..
        'nobuktitransaksi' => 'noBuktiTransaksi',
        'tglbuktitransaksi' => 'tglBuktiTransaksi',
        'keteranganlainnya' => 'keteranganLainnya',
        'noverifikasi' => 'noVerifikasi',
        'noreturn' => 'noReturn',
        'noclosing' => 'noClosing',
        'IsVerified' => 'is_verified'
    ];

    public $list_master_from_import_excel = array(
        'noposting' => 'noPosting',
        'nobuktitransaksi' => 'noBuktiTransaksi',
        'tglbuktitransaksi' => 'tglBuktiTransaksi',
        'keteranganlainnya' => 'keteranganLainnya',
    );

    public $list_detail_from_import_excel = array(
        'noaccount' => 'noAccount',
        'hargasatuand' => 'hargaSatuanD',
        'hargasatuank' => 'hargaSatuanK',
    );
}