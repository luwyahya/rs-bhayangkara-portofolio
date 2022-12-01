<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 8/15/2019
 * Time: 3:47 PM
 */

namespace App\Http\Controllers\Registrasi;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
use Webpatser\Uuid\Uuid;
class LaporanRekamMedisTestingController extends   ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getTesting(Request $request)
    { 
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.statuspasien',
                'sp.nostruk',
                'sbm.nosbm',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir',
                'pd.objectruanganlastfk as ruanganid',
                'pas.nosep',
                'pas.norec as norec_pa',
                'br.norec as norec_br',
                'pd.totalplapon'
            )
            ->whereNull('br.norec');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'];
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }


        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }

        

        $data = $data->orderBy('pd.noregistrasi');

        $data = $data->get();

        return $this->respond($data);
    }
}
