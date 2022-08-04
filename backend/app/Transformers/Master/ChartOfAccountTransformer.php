<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class ChartOfAccountTransformer extends Transformer
{
    public $list = [
        "id" => "id",
        "kdprofile" => "kdProfile",
        "statusenabled" => "statusEnabled",
        "kodeexternal" => "kodeExternal",
        "namaexternal" => "namaExternal",
        "norec" => "noRec",
        "reportdisplay" => "reportDisplay",
        "objectjenisaccountfk" => "jenisAccountFk",
        "jenis_account.jenisaccount" => "jenisAccount",
        "objectkategoryaccountfk" => "kategoryAccountFk",
        "kategory_account.kategoryaccount" => "kategoryAccount",
        "objectstatusaccountfk" => "statusAccountFk",
        "status_account.statusaccount" => "statusAccount",
        "objectstrukturaccountfk" => "strukturAccountFk",
        "struktur_account.strukturaccount" => "strukturAccount",
        "kdaccount" => "kdAccount",
        "kdaccounteffectadd" => "kdAccountEffectAdd",
        "kdaccounteffectmin" => "kdAccountEffectMin",
        "namaaccount" => "namaAccount",
        "noaccount" => "noAccount",
        "qaccount" => "qAccount",
        "saldoakhirdtahunberjalan" => "saldoAkhirDTahunBerjalan",
        "saldoakhirktahunberjalan" => "saldoAkhirKTahunBerjalan",
        "saldoawaldtahunberjalan" => "saldoAwalDTahunBerjalan",
        "saldoawalktahunberjalan" => "saldoAwalKTahunBerjalan",
        "saldonormaladd" => "saldoNormalAdd",
        "saldonormaleffectadd" => "saldoNormalEffectAdd",
        "saldonormaleffectmin" => "saldoNormalEffectMin",
        "saldonormalmin" => "saldoNormalMin",
        "objectaccountheadfk"     => "accountHeadFk",
        "account_head.namaaccount"     => "accountHead",
        "hasChild" => "hasChild",
//        "allChildrenAccounts"     => "all_children_accounts",
    ];

    public $spesicalList = [
        "id" => "id",
        "noaccount" => "noAccount",
        "namaaccount" => "namaAccount",
        "saldonormaladd" => "saldoNormalAdd",
        "saldonormalmin" => "saldoNormalMin",
        "hasChild" => "hasChild",
        "reportDisplay" => "reportDisplay",
        "objectstrukturaccountfk" => "strukturAccountFk",
    ];

    public $periodeList = [
        "id" => "id",
        "noaccount" => "noAccount",
        "namaaccount" => "namaAccount",
        "saldonormaladd" => "saldoNormalAdd",
        "saldonormalmin" => "saldoNormalMin",
        "hasChild" => "hasChild",
        "reportDisplay" => "reportDisplay",
        "saldoAwalK" => "saldoAwalK",
        "saldoAwalD" => "saldoAwalD",
        "saldoAkhirD" => "saldoAkhirD",
        "saldoAkhirK" => "saldoAkhirK",
        "isEditable" => "isEditable",
        "objectstrukturaccountfk" => "strukturAccountFk",

    ];
}
 