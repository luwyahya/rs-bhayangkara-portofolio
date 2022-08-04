<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class ProdukTransformer extends Transformer{
    protected $list = [
      'id' => 'id',
      'statusenabled' => 'statusEnabled',
      'kdproduk' => 'kdProduk',
      'namaproduk' => 'namaProduk',
      // 'buat generik' => 'master',
      'kodeexternal' => 'kodeExternal',
      'kdproduk_intern' => 'kdProdukIntern',
      'detail_jenis_produk.detailjenisproduk' => 'detailJenisProduk',
      'objectdetailjenisprodukfk' => 'detailJenisProdukFk',
      'kategory_produk.kategoryproduk' => 'kategoryProduk',
      'objectkategoryprodukfk' => 'kategoryProdukId',
      'golongan_produk.golonganproduk' => 'golonganProduk',
      'objectgolonganprodukfk' => 'golonganProdukId',
      'status_produk.statusproduk' => 'statusProduk',
      'objectstatusprodukfk' => 'statusProdukId',
      // 'rekanan relasinya blum ada' => 'rekanan = pabrik',
      'satuan_besar.satuanbesar' => 'satuanBesar',
      'objectsatuanbesarfk' => 'satuanBesarId',
      'satuan_kecil.satuankecil' => 'satuanKecil',
      'objectsatuankecilfk' => 'satuanKecilId',
      'qtysatukemasan' => 'qtySatuKemasan',
      'qtyterkecil' => 'qtyTerkecil',
        'kekuatan' => 'kekuatan',
        'ishavingprice' => 'isHavingPrice',
      'deskripsiproduk' => 'deskripsiProduk'
    ];

}
