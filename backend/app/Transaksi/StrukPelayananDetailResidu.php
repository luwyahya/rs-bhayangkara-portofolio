<?php

namespace App\Transaksi;

class StrukPelayananDetailResidu extends Transaksi
{
    protected $table ="strukpelayanandetailresidu_t";
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

//    public function __construct(){$this->setTransformerPath('App\Transformers\Transaksi\StrukPostingTransformer');}

    public function produk(){
        return $this->belongsTo('App\Master\Produk', 'objectprodukfk');
    }

    public function getPelayananSebelumReturnAttribute(){
        $spdr = StrukPelayananDetailResidu::where('norec',$this->norectriger)->first();
        return $spdr;
    }

    public function ruangan(){
        return $this->belongsTo('App\Master\Ruangan','objectruanganfk');
    }

}
