<?php
/**
 * Created by PhpStorm.
 * User: egie ramdan
 * Date: 31/01/2018
 * Time: 10.05
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\BPJSRujukan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\BPJSKlaimTxt;
use App\Transaksi\BPJSGagalKlaimTxt;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\TempBilling;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Traits\Valet;
use Carbon\Carbon;

class BridgingMabesPolri extends ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

    public function getStatusBed(Request $request)
    { 
        DB::beginTransaction();
        $data = \DB::table('V_Statusbed')
            ->select('NamaKelas','NamaRuangan', 'Kosong as KosongLP', 'Terpakai as IsiLP', 'KapasitasTempatTidur', 'IdKelas', 'IdRuangan', 'covid', 
            (DB::raw("'0' as KosongL, '0' as KosongP, '0' as IsiL, '0' as IsiP,  '0' as Rusak, '0' as Dibersihakan")))
            ->orderBy('NamaRuangan');
        $data = $data->get();

        // $result = array(
        //     'data' => 400,
        //     'kodeprofile' => '0903R004',
        //     'namaprofile' => 'RS PUSAT POLRI SAID SUKANTO ',
        //     'by' => '@transmdic'
        // );
        $result = array(
            'data' => $data,
            'kodeprofile' => '0903R004',
            'namaprofile' => 'RS PUSAT POLRI SAID SUKANTO',
            'by' => '@transmdic'
        );

        return $this->respond($result);
    }
}