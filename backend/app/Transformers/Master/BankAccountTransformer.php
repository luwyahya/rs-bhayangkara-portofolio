<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class BankAccountTransformer extends Transformer{
    protected $list = [
        "id"       => "id",
                "kdprofile"       => "kdProfile",
                "statusenabled"       => "statusEnabled",
                "kodeexternal"       => "kodeExternal",
                "namaexternal"       => "namaExternal",
                "norec"       => "noRec",
                "reportdisplay"       => "reportDisplay",
                "bankaccountkantor"       => "bankAccountKantor",
                "bankaccountnama"       => "bankAccountNama",
                "bankaccountnomor"       => "bankAccountNomor",
                "kdbankaccount"       => "kdBankAccount",
                "kdcarabayarfk"       => "kdCarabaYaRFk",
                "caraba_ya_r.carabayar"       => "carabaYaR",
                "kdrekananfk"       => "kdRekananFk",
                "rekanan.namarekanan"       => "namaRekanan",
                "keteranganlainnya"       => "keteranganlainnYa",
                "nocmfk"       => "noCmFk",
                "pasien.namapasien"       => "namaPasien",
                "qbankaccount"       => "qBankAccount",
        //        "kdaccountfk"     => "kdAccountFk",
        //        "chart_of_account.chartofaccount"     => "chartOfAccount",
        //        "kdpegawaifk"     => "kdPegawaiFk",
        //        "pegawai.pegawai"     => "pegawai",
        
    ];
 }
 