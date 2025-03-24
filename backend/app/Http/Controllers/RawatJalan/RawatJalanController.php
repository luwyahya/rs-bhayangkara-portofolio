<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 08/08/2018
 * Time: 16.17
 */
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 9/19/2017
 * Time: 11:44 PM
 */
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 08/08/2019
 * Time: 14:04
 */

namespace App\Http\Controllers\RawatJalan;

use App\Http\Controllers\ApiController;
use App\Master\KelompokTransaksi;
use App\Master\Pasien;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\AntrianPasienDiperiksaDelete;
use App\Transaksi\IndikatorPasienJatuh;
use App\Transaksi\LoggingUser;
use App\Transaksi\SuratKeterangan;
use App\Transaksi\DiagnosaPasien;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPengeluaran;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\PasienDaftar;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\StrukPelayananPenjamin;
use App\Transaksi\StrukOrder;
use App\Transaksi\TempBilling;
use App\Master\JenisPetugasPelaksana;
use App\Master\Pegawai;
use App\Master\Ruangan;
use App\Master\Departemen;

//use App\Transaksi\StrukPelayananDetailK;
use App\Transaksi\HistoriCetakDokumen;
use App\Traits\Valet;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Transaksi\PostingJurnalTransaksi;
use App\Transaksi\LogAcc;
use App\Traits\SettingDataFixedTrait;
use Carbon\Carbon;

class RawatJalanController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getDaftarRegistrasiDokterRajalDataDokumen(Request $request)
    {
        ini_set('max_execution_time', 500);
        $filter = $request->all();
        $dataDokumen = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            //            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
            //            ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.norec','=','pd.nosbmlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            // ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                //                'ps.foto',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'asu.objectkelasdijaminfk',
                'pd.diagnosafretext',
                'skd.id as idstatusberkas',
                'ksp.kasuspenyakit',
                'pa.nosep',
                'pd.statusschedule',
                'pd.istaskantrol'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit,
                apd.namahafis || \'-\' || apd.noantrian as noantrianhafis')
            )
            // ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->where('skd.id', 9)
            ->whereNull('apd.ispelayananpasien')
            ->whereNull('apd.objectruanganasalfk');


        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataDokumen = $dataDokumen->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataDokumen = $dataDokumen->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataDokumen = $dataDokumen->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataDokumen = $dataDokumen->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataDokumen = $dataDokumen->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataDokumen = $dataDokumen->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataDokumen = $dataDokumen->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataDokumen = $dataDokumen->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataDokumen = $dataDokumen->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataDokumen = $dataDokumen->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataDokumen = $dataDokumen->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataDokumen = $dataDokumen->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataDokumen = $dataDokumen->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataDokumen = $dataDokumen->take($filter['jmlRow']);
        }
        $dataDokumen = $dataDokumen->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34,73,74,75]);
        $dataDokumen = $dataDokumen->orderBy('apd.noantrian');
        $dataDokumen = $dataDokumen->distinct();
        $dataDokumen = $dataDokumen->get();

        $result = array(
            'dataDokumen' => $dataDokumen
        );
        return $this->respond($result);
    }

    public function getDaftarRegistrasiDokterRajalDatas(Request $request)
    {
        ini_set('max_execution_time', 500);
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            //            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
            //            ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.norec','=','pd.nosbmlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'apr.ismobilejkn',
                'asu.objectkelasdijaminfk',
                //                'ps.foto',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext',
                'skd.id as idstatusberkas',
                'pa.nosep',
                'pd.statusschedule',
                'pd.istaskantrol'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa,case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit,
                apd.namahafis || \'-\' || apd.noantrian as noantrianhafis')
            )
            // ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNull('apd.ispelayananpasien')
            ->whereNull('apd.objectruanganasalfk');
       

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $data = $data->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $data = $data->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $data = $data->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $data = $data->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        $data = $data->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34,73,74,75]);
        //        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->orderBy('apd.noantrian');
        $data = $data->distinct();
        $data = $data->get();
        $data10 = [];
        foreach ($data as $x) {
            if ($x->idstatusberkas != 9) {
                if($x->noreservasi != null){
                    if( $x->istaskantrol!=null){
                        $data10[] = array(
                        'diagnosa' => $x->diagnosa,
                        'alamatlengkap' => $x->alamatlengkap,
                        'diagnosafretext' => $x->diagnosafretext,
                        'idkelas' => $x->idkelas,
                        'ipaddress' => $x->ipaddress,
                        'iskompleks' => $x->iskompleks,
                        'istelemedicine' => $x->istelemedicine,
                        'jeniskelamin' => $x->jeniskelamin,
                        'kelasdijamin' => $x->kelasdijamin,
                        'kelompokpasien' => $x->kelompokpasien,
                        'objectkelasdijaminfk' => $x->objectkelasdijaminfk,
                        'namadokter' => $x->namadokter,
                        'iddokter' => $x->iddokter,
                        'namakelas' => $x->namakelas,
                        'namapasien' => $x->namapasien,
                        'namarekanan' => $x->namarekanan,
                        'namaruangan' => $x->namaruangan,
                        'namekendali' => $x->namekendali,
                        'noantrian' => $x->noantrian,
                        'nocm' => $x->nocm,
                        'nobpjs' => $x->nobpjs,
                        'nocmfk' => $x->nocmfk,
                        'norec_apd' => $x->norec_apd,
                        'norec_pd' => $x->norec_pd,
                        'noregistrasi' => $x->noregistrasi,
                        'noreservasi' => $x->noreservasi,
                        'notelepon' => $x->notelepon,
                        'objectasalrujukanfk' => $x->objectasalrujukanfk,
                        'objectkelompokpasienfk' => $x->objectkelompokpasienfk,
                        'objectkelompokpasienlastfk' => $x->objectkelompokpasienlastfk,
                        'objectpegawaifk' => $x->objectpegawaifk,
                        'objectruanganfk' => $x->objectruanganfk,
                        'residence' => $x->residence,
                        'residencefk' => $x->residencefk,
                        'statuslayanan' => $x->statuslayanan,
                        'statuspanggil' => $x->statuspanggil,
                        'statuspasien' => $x->statuspasien,
                        'statuspulang' => $x->statuspulang,
                        'tanggalreservasi' => $x->tanggalreservasi,
                        'tgldipanggildokter' => $x->tgldipanggildokter,
                        'tgldipanggilsuster' => $x->tgldipanggilsuster,
                        'tgllahir' => $x->tgllahir,
                        'tglregistrasi' => $x->tglregistrasi,
                        'tglselesaiperiksa' => $x->tglselesaiperiksa,
                        'tipepasien' => $x->tipepasien,
                        'kasuspenyakit' => $x->kasuspenyakit,
                        'ismobilejkn'=>$x->ismobilejkn,
                        'nosep'=>$x->nosep,
                        'statusschedule'=> $x->statusschedule,
                        'noantrianhafis'=>$x->noantrianhafis,
                        'istaskantrol'=>$x->istaskantrol
                    );
                    }
                }else{
                    $data10[] = array(
                        'diagnosa' => $x->diagnosa,
                        'alamatlengkap' => $x->alamatlengkap,
                        'diagnosafretext' => $x->diagnosafretext,
                        'idkelas' => $x->idkelas,
                        'ipaddress' => $x->ipaddress,
                        'iskompleks' => $x->iskompleks,
                        'istelemedicine' => $x->istelemedicine,
                        'jeniskelamin' => $x->jeniskelamin,
                        'kelasdijamin' => $x->kelasdijamin,
                        'kelompokpasien' => $x->kelompokpasien,
                        'objectkelasdijaminfk' => $x->objectkelasdijaminfk,
                        'namadokter' => $x->namadokter,
                        'iddokter' => $x->iddokter,
                        'namakelas' => $x->namakelas,
                        'namapasien' => $x->namapasien,
                        'namarekanan' => $x->namarekanan,
                        'namaruangan' => $x->namaruangan,
                        'namekendali' => $x->namekendali,
                        'noantrian' => $x->noantrian,
                        'nocm' => $x->nocm,
                        'nobpjs' => $x->nobpjs,
                        'nocmfk' => $x->nocmfk,
                        'norec_apd' => $x->norec_apd,
                        'norec_pd' => $x->norec_pd,
                        'noregistrasi' => $x->noregistrasi,
                        'noreservasi' => $x->noreservasi,
                        'notelepon' => $x->notelepon,
                        'objectasalrujukanfk' => $x->objectasalrujukanfk,
                        'objectkelompokpasienfk' => $x->objectkelompokpasienfk,
                        'objectkelompokpasienlastfk' => $x->objectkelompokpasienlastfk,
                        'objectpegawaifk' => $x->objectpegawaifk,
                        'objectruanganfk' => $x->objectruanganfk,
                        'residence' => $x->residence,
                        'residencefk' => $x->residencefk,
                        'statuslayanan' => $x->statuslayanan,
                        'statuspanggil' => $x->statuspanggil,
                        'statuspasien' => $x->statuspasien,
                        'statuspulang' => $x->statuspulang,
                        'tanggalreservasi' => $x->tanggalreservasi,
                        'tgldipanggildokter' => $x->tgldipanggildokter,
                        'tgldipanggilsuster' => $x->tgldipanggilsuster,
                        'tgllahir' => $x->tgllahir,
                        'tglregistrasi' => $x->tglregistrasi,
                        'tglselesaiperiksa' => $x->tglselesaiperiksa,
                        'tipepasien' => $x->tipepasien,
                        'kasuspenyakit' => $x->kasuspenyakit,
                        'ismobilejkn'=>$x->ismobilejkn,
                        'nosep'=>$x->nosep,
                        'statusschedule'=> $x->statusschedule,
                        'noantrianhafis'=>$x->noantrianhafis,
                        'istaskantrol'=>$x->istaskantrol
                    );
                }
            }
        }
        $result = array(
            'data' => $data10
        );
        return $this->respond($result);
    }

    public function getDaftarRegistrasiDokterRajalDataTindak(Request $request)
    {
        ini_set('max_execution_time', 500);
        $filter = $request->all();


        $dataTindak = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'asu.objectkelasdijaminfk',
                //                'ps.foto',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext',
                'pa.nosep',
                'pd.statusschedule',
                'pd.istaskantrol'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit,
                apd.namahafis || \'-\' || apd.noantrian as noantrianhafis')
            )
            //case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa
            // ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.ispelayananpasien')
            ->whereNull('apd.objectruanganasalfk');


        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataTindak = $dataTindak->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataTindak = $dataTindak->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataTindak = $dataTindak->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataTindak = $dataTindak->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataTindak = $dataTindak->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataTindak = $dataTindak->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataTindak = $dataTindak->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataTindak = $dataTindak->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataTindak = $dataTindak->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataTindak = $dataTindak->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataTindak = $dataTindak->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataTindak = $dataTindak->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataTindak = $dataTindak->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataTindak = $dataTindak->take($filter['jmlRow']);
        }
        $dataTindak = $dataTindak->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34,73,74,75]);

        $dataTindak = $dataTindak->orderBy('apd.noantrian');
        $dataTindak = $dataTindak->distinct();
        $dataTindak = $dataTindak->get();

        $data2 = [];
        foreach ($dataTindak as $key => $value) {
            $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
                ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
                ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                ->where('ddp.objectjenisdiagnosafk', 1)
                ->where('apd.noregistrasifk', $value->norec_pd)
                ->select('dg.namadiagnosa')
                ->first();
            if (!empty($diagnosa)) {
                foreach ($diagnosa as $key2) {
                    // return($key2);
                    $value->diagnosa = $key2;
                }
            } else {
                $value->diagnosa = '-';
            }
            $data2[] =  $value;

            // $i = $i+1;
        }

        $result = array(
            'dataTindak' => $data2
        );
        return $this->respond($result);
    }

    public function getDaftarRegistrasiDokterRajalDataKonsul(Request $request)
    {
        ini_set('max_execution_time', 500);
        $filter = $request->all();
        $dataKonsul = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'ru2.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'asu.objectkelasdijaminfk',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext',
                'pa.nosep',
                'pd.statusschedule',
                'pd.istaskantrol',
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                \'batal\' as batalkonsul,
                case when dp.noregistrasifk is not null then dg.namadiagnosa else \'-\' end as diagnosa,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
            )
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.objectruanganasalfk');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataKonsul = $dataKonsul->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataKonsul = $dataKonsul->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataKonsul = $dataKonsul->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataKonsul = $dataKonsul->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataKonsul = $dataKonsul->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataKonsul = $dataKonsul->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataKonsul = $dataKonsul->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataKonsul = $dataKonsul->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataKonsul = $dataKonsul->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataKonsul = $dataKonsul->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataKonsul = $dataKonsul->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataKonsul = $dataKonsul->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataKonsul = $dataKonsul->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataKonsul = $dataKonsul->take($filter['jmlRow']);
        }
        $dataKonsul = $dataKonsul->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34,73,74,75]);
        $dataKonsul = $dataKonsul->orderBy('apd.noantrian');
        $dataKonsul = $dataKonsul->distinct();
        $dataKonsul = $dataKonsul->get();

        $result = array(
            'dataKonsul' => $dataKonsul
        );
        return $this->respond($result);
    }

    public function getDaftarRegistrasiDokterRajalDatadiKonsul(Request $request)
    {
        ini_set('max_execution_time', 500);
        $filter = $request->all();

        $dataDiKonsul = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru2.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'asu.objectkelasdijaminfk',
                'pd.diagnosafretext',
                'pa.nosep',
                'pd.istaskantrol',
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                \'batal\' as batalkonsul,
                case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
            )
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.objectruanganasalfk');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataDiKonsul = $dataDiKonsul->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataDiKonsul = $dataDiKonsul->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataDiKonsul = $dataDiKonsul->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataDiKonsul = $dataDiKonsul->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataDiKonsul = $dataDiKonsul->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->take($filter['jmlRow']);
        }
        $dataDiKonsul = $dataDiKonsul->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34,73,74,75]);
        $dataDiKonsul = $dataDiKonsul->orderBy('apd.noantrian');
        $dataDiKonsul = $dataDiKonsul->distinct();
        $dataDiKonsul = $dataDiKonsul->get();

        $result = array(
            'dataDiKonsul' => $dataDiKonsul
        );
        return $this->respond($result);
    }

    public function getDataComboDokter(Request $request)
    {
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35, 6))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [16, 17, 35])
            ->orderBy('dept.namadepartemen')
            ->get();
        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix'));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }
        $ruanganRajal = \DB::table('ruangan_m as ru')
            ->where('statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();

        $ruanganRanap = \DB::table('ruangan_m as ru')
            ->where('statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [16, 17, 35])
            ->orderBy('ru.namaruangan')
            ->get();

        $ruanganKiosk = \DB::table('ruangankiosk_m')
			->select('ruangankiosk_m.kodeexternal as id','ruangankiosk_m.namaruangan',
                    'ruangankiosk_m.kdinternal','ruangankiosk_m.objectdepartemenfk')
			->where('statusenabled', true)
			->get();
        
        $dataDokter = \DB::table('pegawai_m as ru')
           ->where('ru.statusenabled', true)
           ->where('ru.objectjenispegawaifk', 1)
           ->orderBy('ru.namalengkap')
           ->get();

        $result = array(
            //            'departemen' => $dataDepartemen,
            //            'kelompokpasien' => $dataKelompok,
                       'dokter' => $dataDokter,
            //            'datalogin' => $dataLogin,
            //            'kelas' => $dataKelas,
            'ruanganKiosk' => $ruanganKiosk,
            'dept' => $dept,
            'ruanganRajal' => $ruanganRajal,
            'ruanganRanap' => $ruanganRanap,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            //            'pembatalan' => $pembatalan,
            //            'jenisdiagnosa'=> $jenisDiagnosa,
            //            'diagnosa'=> $Diagnosa,
            //            'kddiagnosa'=> $kdeDiagnosa,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDokterKesehatanJiwa(Request $request)
    {
        $dokter = \DB::table('pegawai_m as pg')
            ->select('pg.id', 'pg.namalengkap as DokterPemeriksa')
            ->whereIn('pg.id', [27689, 25111, 25105, 25688])
            ->orderBy('pg.namalengkap')
            ->get();

        return $this->respond($dokter);
    }
    public function getDokterMCU(Request $request)
    {
        $dokter = \DB::table('pegawai_m as pg')
            ->select('pg.id', 'pg.namalengkap as DokterPemeriksa')
            // ->whereIn('pg.id', [25040, 25141, 25394, 25647, 25662, 25683])
            ->orderBy('pg.namalengkap')
            ->get();

        return $this->respond($dokter);
    }
    public function getDokters(Request $request)
    {
        $dataLogin = $request->all();
        $dataDokters = \DB::table('pegawai_m as p')
            ->select('p.id', 'p.namalengkap')
            ->where('p.statusenabled', true)
            ->where('p.objectjenispegawaifk', 1)
            ->orderBy('p.namalengkap')
            ->get();

        $result = array(
            'dokter' => $dataDokters,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function getDataComboSurat(Request $request)
    {
        $js = \DB::table('jenissurat_m')
            ->select('*')
            ->where('statusenabled', true)
            ->get();
        $pegawai = \DB::table('pegawai_m as pg ')
            ->select('pg.namalengkap', 'pg.id')
            ->where('statusenabled', true)
            ->get();
        $result = array(
            'jenisSurat' => $js,
            'listPegawai' => $pegawai,
            'message' => 'ridwan',
        );
        return $this->respond($result);
    }
    public function getDataComboOperator(Request $request)
    {

        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        $dataInstalasi = \DB::table('departemen_m as dp')
            //            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [18, 16])
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();
        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.reportdisplay')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.reportdisplay')
            ->get();

        $pembatalan = \DB::table('pembatal_m as p')
            ->select('p.id', 'p.name')
            ->where('p.statusenabled', true)
            ->orderBy('p.name')
            ->get();

        $jenisDiagnosa = \DB::table('jenisdiagnosa_m as jd')
            ->select('jd.id', 'jd.jenisdiagnosa')
            //            ->where('jd.id',5)
            ->where('jd.statusenabled', true)
            ->orderBy('jd.jenisdiagnosa')
            ->get();

        //        $kdeDiagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.kddiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();
        //
        //        $Diagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.namadiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();

        $KelompokKerjaHead = \DB::table('kelompokkerjahead_m as dm')
            ->select('dm.id', 'dm.kelompokkerjahead')
            ->where('dm.statusenabled', true)
            ->orderBy('dm.id')
            ->get();

        $KelompokKerja = \DB::table('kelompokkerja_m as dm')
            ->select('dm.id', 'dm.kelompokkerja')
            ->where('dm.statusenabled', true)
            ->orderBy('dm.id')
            ->get();

        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'dept' => $dept,
            'ruanganRi' => $ruanganRi,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'pembatalan' => $pembatalan,
            'jenisdiagnosa' => $jenisDiagnosa,
            //            'diagnosa' => $Diagnosa,
            //            'kddiagnosa' => $kdeDiagnosa,
            'kelompokkerjahead' => $KelompokKerjaHead,
            'kelompokkerja' => $KelompokKerja,
            'pegawaiLogin' => $dataPegawai->namalengkap,
            'jeniskelamin' => $dataJenisKelamin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarRegistrasiDokterRajal(Request $request)
    {
        ini_set('max_execution_time', 500);
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            //            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
            //            ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.norec','=','pd.nosbmlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'apr.ismobilejkn',
                'asu.objectkelasdijaminfk',
                //                'ps.foto',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext',
                'skd.id as idstatusberkas',
                'pa.nosep'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa,case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
            )
            // ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNull('apd.ispelayananpasien')
            ->whereNull('apd.objectruanganasalfk');
        //            ->whereNotIn('ru.objectdepartemenfk',[27,3]);
        // ->groupBy('pd.tglregistrasi','ps.nocm','pd.noregistrasi','ps.namapasien','ps.tgllahir','jk.jeniskelamin','apd.objectruanganfk','ru.namaruangan','kls.id','kls.namakelas',
        //           'kp.kelompokpasien','rek.namarekanan','apd.objectpegawaifk','pg.namalengkap','br.norec','pd.norec','apd.norec','apd.objectasalrujukanfk',
        //           'apd.tgldipanggildokter','apd.statuspasien','pd.statuspasien','apd.tgldipanggildokter','apd.tgldipanggilsuster','apr.noreservasi',
        //           'apr.tanggalreservasi','pp.noregistrasifk','apd.noantrian','alm.alamatlengkap');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $data = $data->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $data = $data->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $data = $data->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $data = $data->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        $data = $data->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);
        //        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->orderBy('apd.noantrian');
        $data = $data->distinct();
        $data = $data->get();
        $data10 = [];
        foreach ($data as $x) {
            if ($x->idstatusberkas != 9) {
                $data10[] = array(
                    'diagnosa' => $x->diagnosa,
                    'alamatlengkap' => $x->alamatlengkap,
                    'diagnosafretext' => $x->diagnosafretext,
                    'idkelas' => $x->idkelas,
                    'ipaddress' => $x->ipaddress,
                    'iskompleks' => $x->iskompleks,
                    'istelemedicine' => $x->istelemedicine,
                    'jeniskelamin' => $x->jeniskelamin,
                    'kelasdijamin' => $x->kelasdijamin,
                    'kelompokpasien' => $x->kelompokpasien,
                    'objectkelasdijaminfk' => $x->objectkelasdijaminfk,
                    'namadokter' => $x->namadokter,
                    'iddokter' => $x->iddokter,
                    'namakelas' => $x->namakelas,
                    'namapasien' => $x->namapasien,
                    'namarekanan' => $x->namarekanan,
                    'namaruangan' => $x->namaruangan,
                    'namekendali' => $x->namekendali,
                    'noantrian' => $x->noantrian,
                    'nocm' => $x->nocm,
                    'nobpjs' => $x->nobpjs,
                    'nocmfk' => $x->nocmfk,
                    'norec_apd' => $x->norec_apd,
                    'norec_pd' => $x->norec_pd,
                    'noregistrasi' => $x->noregistrasi,
                    'noreservasi' => $x->noreservasi,
                    'notelepon' => $x->notelepon,
                    'objectasalrujukanfk' => $x->objectasalrujukanfk,
                    'objectkelompokpasienfk' => $x->objectkelompokpasienfk,
                    'objectkelompokpasienlastfk' => $x->objectkelompokpasienlastfk,
                    'objectpegawaifk' => $x->objectpegawaifk,
                    'objectruanganfk' => $x->objectruanganfk,
                    'residence' => $x->residence,
                    'residencefk' => $x->residencefk,
                    'statuslayanan' => $x->statuslayanan,
                    'statuspanggil' => $x->statuspanggil,
                    'statuspasien' => $x->statuspasien,
                    'statuspulang' => $x->statuspulang,
                    'tanggalreservasi' => $x->tanggalreservasi,
                    'tgldipanggildokter' => $x->tgldipanggildokter,
                    'tgldipanggilsuster' => $x->tgldipanggilsuster,
                    'tgllahir' => $x->tgllahir,
                    'tglregistrasi' => $x->tglregistrasi,
                    'tglselesaiperiksa' => $x->tglselesaiperiksa,
                    'tipepasien' => $x->tipepasien,
                    'kasuspenyakit' => $x->kasuspenyakit,
                    'ismobilejkn'=>$x->ismobilejkn,
                    'nosep'=>$x->nosep
                );
            }
        }
        // return($data10);
        // die();
        //        if(count($data) > 0){
        //            foreach ($data as $item){
        //                if($item->foto != null ){
        //                    $item->foto = "data:image/jpeg;base64," . base64_encode($item->foto);
        //                }
        //            }
        //        }

        $dataDokumen = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            //            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
            //            ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.norec','=','pd.nosbmlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                //                'ps.foto',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'asu.objectkelasdijaminfk',
                'pd.diagnosafretext',
                'skd.id as idstatusberkas',
                'ksp.kasuspenyakit'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
            )
            // ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->where('skd.id', 9)
            ->whereNull('apd.ispelayananpasien')
            ->whereNull('apd.objectruanganasalfk');
        //            ->whereNotIn('ru.objectdepartemenfk',[27,3]);
        // ->groupBy('pd.tglregistrasi','ps.nocm','pd.noregistrasi','ps.namapasien','ps.tgllahir','jk.jeniskelamin','apd.objectruanganfk','ru.namaruangan','kls.id','kls.namakelas',
        //           'kp.kelompokpasien','rek.namarekanan','apd.objectpegawaifk','pg.namalengkap','br.norec','pd.norec','apd.norec','apd.objectasalrujukanfk',
        //           'apd.tgldipanggildokter','apd.statuspasien','pd.statuspasien','apd.tgldipanggildokter','apd.tgldipanggilsuster','apr.noreservasi',
        //           'apr.tanggalreservasi','pp.noregistrasifk','apd.noantrian','alm.alamatlengkap');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataDokumen = $dataDokumen->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataDokumen = $dataDokumen->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataDokumen = $dataDokumen->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataDokumen = $dataDokumen->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataDokumen = $dataDokumen->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataDokumen = $dataDokumen->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataDokumen = $dataDokumen->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataDokumen = $dataDokumen->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataDokumen = $dataDokumen->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataDokumen = $dataDokumen->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataDokumen = $dataDokumen->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataDokumen = $dataDokumen->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataDokumen = $dataDokumen->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataDokumen = $dataDokumen->take($filter['jmlRow']);
        }
        $dataDokumen = $dataDokumen->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);
        //        $dataDokumen = $dataDokumen->orderBy('pd.tglregistrasi');
        $dataDokumen = $dataDokumen->orderBy('apd.noantrian');
        $dataDokumen = $dataDokumen->distinct();
        $dataDokumen = $dataDokumen->get();


        $dataTindak = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'asu.objectkelasdijaminfk',
                //                'ps.foto',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
            )
            //case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa
            // ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.ispelayananpasien')
            ->whereNull('apd.objectruanganasalfk');


        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataTindak = $dataTindak->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataTindak = $dataTindak->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataTindak = $dataTindak->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataTindak = $dataTindak->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataTindak = $dataTindak->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataTindak = $dataTindak->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataTindak = $dataTindak->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataTindak = $dataTindak->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataTindak = $dataTindak->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataTindak = $dataTindak->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataTindak = $dataTindak->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataTindak = $dataTindak->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataTindak = $dataTindak->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataTindak = $dataTindak->take($filter['jmlRow']);
        }
        $dataTindak = $dataTindak->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);

        $dataTindak = $dataTindak->orderBy('apd.noantrian');
        $dataTindak = $dataTindak->distinct();
        $dataTindak = $dataTindak->get();

        $data2 = [];
        foreach ($dataTindak as $key => $value) {
            $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
                ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
                ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                ->where('ddp.objectjenisdiagnosafk', 1)
                ->where('apd.noregistrasifk', $value->norec_pd)
                ->select('dg.namadiagnosa')
                ->first();
            if (!empty($diagnosa)) {
                foreach ($diagnosa as $key2) {
                    // return($key2);
                    $value->isdiagnosis = $key2;
                }
            } else {
                $value->isdiagnosis = false;
            }
            $data2[] =  $value;

            // $i = $i+1;
        }
        // for ($i = count($data2) - 1; $i >= 0; $i--) {
        //     if ($data2[$i]->isdiagnosis == true){
        //          array_splice($data2,$i,1);

        //     }
        // }
        // return($data2);
        // die();

        $dataKonsul = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'ru2.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'asu.objectkelasdijaminfk',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext',
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                \'batal\' as batalkonsul,
                case when dp.noregistrasifk is not null then dg.namadiagnosa else \'-\' end as diagnosa,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
            )
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.objectruanganasalfk');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataKonsul = $dataKonsul->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataKonsul = $dataKonsul->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataKonsul = $dataKonsul->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataKonsul = $dataKonsul->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataKonsul = $dataKonsul->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataKonsul = $dataKonsul->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataKonsul = $dataKonsul->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataKonsul = $dataKonsul->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataKonsul = $dataKonsul->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataKonsul = $dataKonsul->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataKonsul = $dataKonsul->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataKonsul = $dataKonsul->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataKonsul = $dataKonsul->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataKonsul = $dataKonsul->take($filter['jmlRow']);
        }
        $dataKonsul = $dataKonsul->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);
        $dataKonsul = $dataKonsul->orderBy('apd.noantrian');
        $dataKonsul = $dataKonsul->distinct();
        $dataKonsul = $dataKonsul->get();


        $dataDiKonsul = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.nobpjs',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru2.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pg.id as iddokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'pd.objectkelompokpasienlastfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'asu.objectkelasdijaminfk',
                'pd.diagnosafretext',
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                \'batal\' as batalkonsul,
                case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa,
                case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
            )
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.objectruanganasalfk');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $dataDiKonsul = $dataDiKonsul->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $dataDiKonsul = $dataDiKonsul->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $dataDiKonsul = $dataDiKonsul->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $dataDiKonsul = $dataDiKonsul->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $dataDiKonsul = $dataDiKonsul->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $dataDiKonsul = $dataDiKonsul->take($filter['jmlRow']);
        }
        $dataDiKonsul = $dataDiKonsul->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);
        $dataDiKonsul = $dataDiKonsul->orderBy('apd.noantrian');
        $dataDiKonsul = $dataDiKonsul->distinct();
        $dataDiKonsul = $dataDiKonsul->get();

        $result = array(
            'data' => $data10,
            'dataTindak' => $data2,
            'dataKonsul' => $dataKonsul,
            'dataDiKonsul' => $dataDiKonsul,
            'dataDokumen' => $dataDokumen
        );
        return $this->respond($result);
    }
    public function getDaftarRegistrasiDokterRajalTindak(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            //            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
            //            ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.norec','=','pd.nosbmlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                //                'ps.foto',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext'
                // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                ,
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang')
            )
            // ->whereNull('br.norec')
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.ispelayananpasien')
            ->whereNull('apd.objectruanganasalfk');


        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $data = $data->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $data = $data->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $data = $data->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $data = $data->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        $data = $data->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);

        $data = $data->orderBy('apd.noantrian');
        $data = $data->distinct();
        $data = $data->get();

        return $this->respond($data);
    }
    public function getDaftarRegistrasiDokterRajalKonsul(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext',
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                \'batal\' as batalkonsul')
            )
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.objectruanganasalfk');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $data = $data->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $data = $data->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $data = $data->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $data = $data->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        $data = $data->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);
        $data = $data->orderBy('apd.noantrian');
        $data = $data->distinct();
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarRegistrasiDokterRajalDiKonsul(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.id as nocmfk',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru2.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.id as objectkelompokpasienfk',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'apd.tglselesaiperiksa',
                'apr.tipepasien',
                'apr.notelepon',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'pd.istelemedicine',
                'pd.diagnosafretext',
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali,
                case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                \'batal\' as batalkonsul')
            )
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->where('ps.statusenabled', true)
            ->whereNotNull('apd.objectruanganasalfk');

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id', $kodeRuang);
        }

        if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
            $data = $data->where('pd.istelemedicine', '1');
        }

        if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
            if ($request['statusPeriksa'] == 1) {
                $data = $data->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 2) {
                $data = $data->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
            } elseif ($request['statusPeriksa'] == 3) {
                $data = $data->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
            }
        }

        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        $data = $data->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34]);
        $data = $data->orderBy('apd.noantrian');
        $data = $data->distinct();
        $data = $data->get();
        return $this->respond($data);
    }
    public function updateStatusPulang(Request $request)
    {
        $data = DB::select(DB::raw("
        SELECT ru.objectdepartemenfk,TO_CHAR(pd.tglregistrasi,'YYYY-MM-DD') as tglregistrasi
        FROM pasiendaftar_t as pd
        left outer join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        left outer join ruangan_m as ru on ru.id=apd.objectruanganfk
        WHERE pd.norec='" . $request['noregistrasifk'] . "'
        "));
        $sudahmasukinap = '0';
        $tglregistrasi = '';
        foreach ($data as $item) {
            if ($request['objectruanganfk'] != '569') {
                $tglregistrasi = $item->tglregistrasi . ' ' . date('H:i:s');
                if ($item->objectdepartemenfk === '16') {
                    $sudahmasukinap = '1';
                }
            } else {
                $tglregistrasi = date('Y-m-d H:i:s');
            }
        }

        // return($tglregistrasi);
        // die();


        DB::beginTransaction();
        try {
            if ($request['objectstatuspulangfk'] == 13) {
                if ($sudahmasukinap === '0') {
                    if ($request['noregistrasifk'] != null) {
                        // return($request['tanggalpulang']);
                        // die();
                        $ddddd = PasienDaftar::where('norec', $request['noregistrasifk'])
                            ->whereNotNull('tglpulang')
                            ->update(
                                [
                                    'objectstatuspulangfk' => $request['objectstatuspulangfk'],
                                    'tglpulang' =>  $request['tanggalpulang'] //date('Y-m-d H:i:s')
                                ]

                            );

                        $ddddd = PasienDaftar::where('norec', $request['noregistrasifk'])
                        // ->whereNotNull('tglpulang')
                        ->update(
                            [
                                'objectstatuspulangfk' => $request['objectstatuspulangfk'],
                                // 'tglpulang' =>  $request['tanggalpulang'],//date('Y-m-d H:i:s')
                                'tanggalrawat' => $request['tanggalRencakaKontrol'],
                                'dpjp'=> $request['dpjp'],
                                'keterangan' => $request['keterangan'],
                                
                                
                            ]

                        );
                    }
                }
                if ($request['noregistrasifkapd'] != null) {
                    $ddddd = AntrianPasienDiperiksa::where('norec', $request['noregistrasifkapd'])
                        ->update(
                            [
                                'objectstatuspulangfk' => $request['objectstatuspulangfk'],
                                'tglkeluar' =>  $request['tanggalpulang'] //date('Y-m-d H:i:s')
                            ]

                        );
                }
            } else {
                if ($sudahmasukinap === '0') {
                    if ($request['noregistrasifk'] != null) {
                        $ddddd = PasienDaftar::where('norec', $request['noregistrasifk'])
                            ->whereNotNull('tglpulang')
                            ->update(
                                [
                                    'objectstatuspulangfk' => $request['objectstatuspulangfk'],
                                    'tglpulang' =>  $tglregistrasi //date('Y-m-d H:i:s')
                                ]

                            );
                        $ddddd = PasienDaftar::where('norec', $request['noregistrasifk'])
                            // ->whereNotNull('tglpulang')
                            ->update(
                                [
                                    'objectstatuspulangfk' => $request['objectstatuspulangfk'],
                                    // 'tglpulang' =>  $tglregistrasi, //date('Y-m-d H:i:s')
                                    'tanggalrawat'=> $request['tanggalRencakaKontrol'],
                                    'dpjp'=> $request['dpjp'],
                                    'keterangan' => $request['keterangan'],


                                    
                                ]

                            );
                    }
                }
                if ($request['noregistrasifkapd'] != null) {
                    $ddddd = AntrianPasienDiperiksa::where('norec', $request['noregistrasifkapd'])
                        ->update(
                            [
                                'objectstatuspulangfk' => $request['objectstatuspulangfk'],
                                'tglkeluar' =>  $tglregistrasi //date('Y-m-d H:i:s')
                            ]

                        );
                }
            }

            if ($request['objectstatuspulangfk'] == 18) {
                $x = PasienDaftar::where('norec', $request['noregistrasifk'])
                    ->get();
                foreach ($x as $item) {
                    $nocmfk = $item->nocmfk;
                }
                // return($nocmfk);
                // die();
                $ddddd = Pasien::where('id', $nocmfk)
                    ->update(
                        [
                            'tglmeninggal' =>  date('Y-m-d H:i:s')
                        ]

                    );
                $ddddd = PasienDaftar::where('norec', $request['noregistrasifk'])
                    ->whereNotNull('tglpulang')
                    ->update(
                        [
                            'objectstatuskeluarfk' => 5,
                            'objectkondisipasienfk' => $request['objectkondisipasienfk'],
                            'objectpenyebabkematianfk' => $request['objectpenyebabkematianfk'],
                            'objectstatuspulangfk' => 18,
                            'tglmeninggal' => $request['tglmeninggal'],
                        ]

                    );
            }
            $transMessage = "Sukses";


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan  Status Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateDiagnosaFreText(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['noregistrasifk'] != null) {
                $ddddd = PasienDaftar::where('norec', $request['noregistrasifk'])
                    ->update(
                        [
                            'diagnosafretext' => $request['diagnosa']
                        ]

                    );
            }
            $transMessage = "Sukses";


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Diagnosa Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateBatalKonsul(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        // try {
        $getAPD = AntrianPasienDiperiksa::where('norec', $request['noregistrasifk'])->first();
        $dataAPD = new AntrianPasienDiperiksaDelete();
        $dataAPD->norec = $dataAPD->generateNewId();
        $dataAPD->kdprofile = 1;
        $dataAPD->statusenabled = true;
        $dataAPD->objectasalrujukanfk = $getAPD->objectasalarujukanfk;
        $dataAPD->objectkelasfk = $getAPD->objectkelasfk;
        $dataAPD->noantrian = $getAPD->noantrian;
        $dataAPD->noregistrasifk = $getAPD->noregistrasifk;
        $dataAPD->objectpegawaifk =  $getAPD->objectpegawaifk;
        $dataAPD->objectruanganfk =  $getAPD->objectruanganfk;
        $dataAPD->statusantrian =  $getAPD->statusantrian;
        $dataAPD->statuspasien = $getAPD->statuspasien;
        $dataAPD->statuskunjungan =  $getAPD->statuskunjungan;
        $dataAPD->statuspenyakit = $getAPD->statuspenyakit;
        $dataAPD->objectruanganasalfk =  $getAPD->objectruanganasalfk;
        $dataAPD->tglregistrasi = $getAPD->tglregistrasi; //date('Y-m-d H:i:s');
        $dataAPD->tglkeluar = $getAPD->tglkeluar;
        $dataAPD->tglmasuk = $getAPD->tglmasuk;
        $dataAPD->objectstrukorderfk = $getAPD->objectstrukorderfk;
        $dataAPD->norec_apd = $getAPD->norec;
        $dataAPD->save();

        // $delApd = AntrianPasienDiperiksa::where('norec', $request['noregistrasifk'])->delete();
        // diagnti untuk keperluan laporan
        $updateApd = AntrianPasienDiperiksa::where('norec', $request['noregistrasifk'])
            ->update(
                [
                    'statusenabled' => false
                ]

            );

        $HapusPPD = PelayananPasienDetail::where('noregistrasifk', $request['noregistrasifk'])->delete();
        $HapusPP = PelayananPasien::where('noregistrasifk', $request['noregistrasifk'])->delete();

        $dataAPDnorec = $getAPD->norec;

        /*Logging User*/
        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Update Id Finger Print Pegawai';
        $logUser->noreff = $request['norec_so'];
        $logUser->referensi = 'id pegawai';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $tglAyeuna;
        $logUser->save();
        /*End Logging User*/

        $transStatus = 'true';
        $transMessage = "Batal Konsultasi Berhasil";
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = "Tidak bisa Batal Konsultasi, Pasien Sudah Memiliki Layanan";
        // }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPDnorec,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function pasienBatalPanggil(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['norec_apd'] != null) {
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'statusantrian' => 0
                        ]

                    );
            }
            $transMessage = "Sukses";


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                //                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateDokterAntrian(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['norec_apd'] != null) {
                $apd =  AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->first();
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'objectpegawaifk' => $request['iddokter']
                        ]

                    );

                $pasienDaftar = PasienDaftar::where('norec', $apd->noregistrasifk)->update([
                    'objectpegawaifk' => $request['iddokter']
                ]);
            }
            $transMessage = "Sukses";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            $result = array(
                "status" => 201,
                //                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd, //$noResep,,//$noResep,
                "as" => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveIndikatorPasienJatuh(Request $request)
    {
        DB::beginTransaction();
        try {
            if ($request['norec'] == '') {
                $new = new IndikatorPasienJatuh();
                $new->kdprofile = 1;
                $new->norec = $new->generateNewId();
            } else {
                $new = IndikatorPasienJatuh::where('norec', $request['norec'])->first();
            }

            $new->statusenabled = $request['statusenabled'];
            $pasien = Pasien::where('nocm', $request['nocm'])->first();
            if (isset($request['nocmfk'])) {
                $new->nocmfk = $request['nocmfk'];
            } else {
                $new->nocmfk = $pasien->id;
            }

            $new->noregistrasifk = $request['noregistrasifk'];
            $new->tgljatuh = $request['tgljatuh'];
            $new->keterangan = $request['keterangan'];
            $new->jumlah = $request['jumlah'];
            $new->save();

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'result' => $new,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function savePanggilDokter(Request $request)
    {
        DB::beginTransaction();
        try {
            $apd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->first();
            if (isset($request['kelompokUser']) && $request['kelompokUser'] != 'suster') {

                if ($apd->tgldipanggildokter == null) {
                    AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->update([
                            'tgldipanggildokter' => date('Y-m-d H:i:s'),
                        ]);
                }
            } else {
                if ($apd->tgldipanggilsuster == null && isset($request['vitalsign'])) {
                    AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->update([
                            'tgldipanggilsuster' => date('Y-m-d H:i:s'),
                        ]);
                }
            }
            $transStatus = 'true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveDaftarSurat(Request $request)
    {
        DB::beginTransaction();
        try {
            $jenisSurat = DB::table('jenissurat_m')
                ->select('*')
                ->where('id', $request['jenissuratID'])
                ->first();
            $kodeSurat = '';
            if (!empty($jenisSurat)) {
                $kodeSurat = $jenisSurat->kodeexternal;
            }

            $bln = date('m');
            $romawi = $this->KonDecRomawi($bln);
            $pre = '/RSM/' . $kodeSurat . '/' . $romawi . '/' . date('Y');
            $pre2 = date('Y') . '/' . $bln . '/';
            //        $nosurat= $this->genCode(new SuratKeterangan(),'nosint',21,$pre);
            $nosint = $pre2 . $this->genCode2(new SuratKeterangan(), 'nosint', 3) . '/RSM/' . $kodeSurat;
            $nosurat = substr(trim($nosint), 8, 3) . $pre;

            //        return $nosint;

            if ($request['norec'] == '') {
                $newptp = new SuratKeterangan();
                $newptp->norec = $newptp->generateNewId();
                $newptp->statusenabled = true;
                $newptp->kdprofile = 11;
                $newptp->pasiendaftarfk = $request['pasiendaftarfk'];
            } else {
                $newptp = SuratKeterangan::where('norec', $request['norec'])->first();
                $nosint = str_replace(substr(trim($newptp->nosint), 16), $kodeSurat, $newptp->nosint);
                $nosurat = str_replace(substr(trim($newptp->nosint), 16), $kodeSurat, $newptp->nosurat);
            }


            $newptp->tglsurat =  $request['tglsurat'];
            $newptp->pegawaifk =  $request['namapegID'];
            $newptp->dokterfk =  $request['dokterID'];
            $newptp->jenissuratfk =  $request['jenissuratID'];
            $newptp->keterangan =  $request['keterangan'];
            $newptp->nosurat =  $nosurat;
            $newptp->nosint = $nosint;
            $newptp->isi =   $request['isi'];

            $newptp->save();

            $transMessage = "Simpan Surat Keterangan Berhasil";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Surat Keterangan gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "data" => $newptp,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                //				"noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDetailpasienSurat(Request $request)
    {
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pendidikan_m as pdd', 'pas.objectpendidikanfk', '=', 'pdd.id')
            ->leftjoin('alamat_m as al', 'al.nocmfk', '=', 'pas.id')
            ->leftjoin('pekerjaan_m as pk', 'pas.objectpekerjaanfk', '=', 'pk.id')

            ->select(
                'apd.norec as norec_apd',
                'pd.nocmfk',
                'al.alamatlengkap',
                'pdd.pendidikan',
                'pk.pekerjaan',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien as jenisPasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm as noCm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jenisKelamin',
                'pd.noregistrasi as noRegistrasi',
                'pas.namapasien as namaPasien',
                'pd.tglregistrasi as tglMasuk',
                'pd.norec as norec_pd',
                'pd.tglpulang as tglPulang',
                'pas.notelepon',
                'pd.objectrekananfk as rekananid',
                'kls2.id as klsid2',
                'kls2.namakelas as kelasRawat',
                'rk.namarekanan as namaPenjamin',
                'ru2.namaruangan as lastRuangan',
                'sp.nostruk',
                'sp.norec as strukfk',
                'pd.statuspasien as StatusPasien'
            )
            ->take(1)
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->get();


        $result = array(
            'data' => $pelayanan,
            'message' => 'as@epic',
        );

        return $this->respond($pelayanan);
    }
    public function getDaftarSurat(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('suratketerangan_t as sk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'sk.pasiendaftarfk')
            ->leftJoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //            ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sk.pegawaifk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'sk.dokterfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('golongandarah_m as gol', 'gol.id', '=', 'ps.objectgolongandarahfk')
            ->leftJoin('jenissurat_m as js', 'js.id', '=', 'sk.jenissuratfk')
            ->select(
                'sk.*',
                'pd.tglregistrasi',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.nocm',
                'ps.tgllahir',
                'pg2.namalengkap as namadokter',
                'pg.namalengkap as namapegawai',
                'jk.jeniskelamin',
                'alm.alamatlengkap',
                'gol.golongandarah',
                'js.name as namasurat'
            )
            ->where('sk.statusenabled', true);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('sk.tglsurat', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('sk.tglsurat', '<=', $filter['tglAkhir']);
        }

        //       if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
        //           $data = $data->where('dept.id', '=', $filter['deptId']);
        //       }
        //       if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
        //           $data = $data->where('ru.id', '=', $filter['ruangId']);
        //       }
        //       if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
        //           $data = $data->where('kp.id', '=', $filter['kelId']);
        //       }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg2.id', '=', $filter['dokId']);
        }
        //       if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
        //           $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        //       }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        $data = $data->orderBy('sk.tglsurat');
        //       $data = $data->groupBy('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi',
        //           'ru.namaruangan', 'ps.namapasien',
        //           'kp.kelompokpasien', 'rek.namarekanan', 'pg.namalengkap', 'pd.tglpulang', 'pd.statuspasien',
        //           'pa.nosep', 'br.norec', 'pa.norec', 'pa.objectasuransipasienfk', 'pd.objectpegawaifk', 'pd.objectruanganlastfk',
        //           'pd.nostruklastfk', 'ps.tgllahir','pd.objectkelasfk','kls.namakelas','ps.objectjeniskelaminfk','jk.jeniskelamin',
        //           'alm.alamatlengkap','pd.jenispelayanan','jp.jenispelayanan','gol.golongandarah');
        //        $data = $data->take($filter['jmlRows']);
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ridwan',
        );
        return $this->respond($result);
    }
    public function getDaftarPasienByDiagnosa(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('diagnosatindakanpasien_t as dtp', 'dtp.objectpasienfk', '=', 'apd.norec')
            ->leftjoin('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('detaildiagnosatindakanpasien_t as ddtp', 'ddtp.objectdiagnosatindakanpasienfk', '=', 'dtp.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftjoin('diagnosatindakan_m as dt', 'dt.id', '=', 'ddtp.objectdiagnosatindakanfk')
            ->select(
                'pd.norec',
                'pd.statusenabled',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.nocmfk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'pg.namalengkap as namadokter',
                'pd.tglpulang',
                'pd.statuspasien',
                'pa.norec as norec_pa',
                'pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid',
                'pd.objectruanganlastfk',
                'pa.nosep as nosep',
                'br.norec as norec_br',
                'pd.nostruklastfk',
                'ddp.objectdiagnosafk',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'ddp.objectjenisdiagnosafk',
                'ddtp.objectdiagnosatindakanfk',
                'dt.kddiagnosatindakan',
                'dt.namadiagnosatindakan'
            )
            ->whereNull('br.norec')
            ->where('ddp.objectjenisdiagnosafk', 1);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
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
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['objectdiagnosafk']) && $filter['objectdiagnosafk'] != "" && $filter['objectdiagnosafk'] != "undefined") {
            $data = $data->where('ddp.objectdiagnosafk', '=', $filter['objectdiagnosafk']);
        }
        if (isset($filter['objectdiagnosatindakanfk']) && $filter['objectdiagnosatindakanfk'] != "" && $filter['objectdiagnosatindakanfk'] != "undefined") {
            $data = $data->where('ddtp.objectdiagnosatindakanfk', '=', $filter['objectdiagnosatindakanfk']);
        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy(
            'pd.norec',
            'pd.statusenabled',
            'pd.tglregistrasi',
            'ps.nocm',
            'pd.nocmfk',
            'pd.noregistrasi',
            'ru.namaruangan',
            'ps.namapasien',
            'kp.kelompokpasien',
            'rek.namarekanan',
            'pg.namalengkap',
            'pd.tglpulang',
            'pd.statuspasien',
            'pa.nosep',
            'br.norec',
            'pa.norec',
            'pa.objectasuransipasienfk',
            'pd.objectpegawaifk',
            'pd.objectruanganlastfk',
            'pd.nostruklastfk',
            'dg.kddiagnosa',
            'dg.namadiagnosa',
            'dt.kddiagnosatindakan',
            'ddtp.objectdiagnosatindakanfk',
            'dt.namadiagnosatindakan',
            'dg.kddiagnosa',
            'dt.kddiagnosatindakan',
            'ddp.objectdiagnosafk',
            'ddp.objectjenisdiagnosafk'
        );
        //        $data = $data->take(50);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }
    public function getOrderKonsul(Request $request)
    {
        $arrRuangId = [];
        if (isset($request['perawatId']) && $request['perawatId'] != '') {
            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->join('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
                ->select('ru.id', 'ru.namaruangan')
                ->where('mlu.objectloginuserfk', $request['perawatId'])
                ->get();

            if (count($dataruangan) > 0) {
                foreach ($dataruangan as $item) {
                    $arrRuangId[]  = $item->id;
                }
            }
        }



        // $kelTrans = KelompokTransaksi::where('kelompoktransaksi','KONSULTASI DOKTER')->first();
        $data = \DB::table('strukorder_t as so')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->leftJoin('ruangan_m as rutuju', 'rutuju.id', '=', 'so.objectruangantujuanfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->leftJoin('pegawai_m as pet', 'pet.id', '=', 'so.objectpetugasfk')
            // ->leftJoin('antrianpasiendiperiksa_t as apd','apd.objectstrukorderfk','=','so.norec')
            ->select(
                'so.norec',
                'so.noorder',
                'so.tglorder',
                'ru.namaruangan as ruanganasal',
                'pg.namalengkap',
                'rutuju.namaruangan as ruangantujuan',
                'pet.namalengkap as pengonsul',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'so.keteranganorder',
                'pd.norec as norec_pd',
                'ps.namapasien',
                'pg.id as pegawaifk',
                'so.objectruangantujuanfk',
                'so.objectruanganfk',
                'so.statusorder'
                // ,'apd.norec as norec_apd'
            )
            ->where('so.statusenabled', true)
            // ->wherenull('apd.norec')
            ->whereNull('so.statusorder')
            ->where('so.objectkelompoktransaksifk', 108) //$kelTrans->id)
            ->where(function ($q) {
                $q->wherenull('so.istolak')
                    ->orwhere('so.istolak', 0);
            });

        if (isset($request['norecpd']) && $request['norecpd'] != '') {
            $data = $data->where('pd.norec', $request['norecpd']);
        }
        if (isset($request['dokterid']) && $request['dokterid'] != '') {
            $data = $data->where('pg.id', $request['dokterid']);
        }
        if (isset($request['perawatId']) && $request['perawatId'] != '') {
            $data = $data->whereIn('rutuju.id', $arrRuangId);
        }
        $data = $data->orderBy('so.tglorder', 'desc');
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }
    public function saveKonsulFromOrder(Request $request)
    {
        DB::beginTransaction();
        try {
            $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
            $apd = AntrianPasienDiperiksa::where('noregistrasifk', $request['norec_pd'])->first();
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = 1;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $apd->objectasalarujukanfk;
            $dataAPD->objectkelasfk = $request['kelasfk'];
            $dataAPD->noantrian = $request['noantrian'];
            $dataAPD->noregistrasifk = $request['norec_pd'];
            $dataAPD->objectpegawaifk = $request['dokterfk'];
            $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuspasien = 1;
            $dataAPD->statuskunjungan = 'LAMA';
            $dataAPD->statuspenyakit = 'BARU';
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];;
            $dataAPD->tglregistrasi = $pd->tglregistrasi; //date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = date('Y-m-d H:i:s');
            $dataAPD->tglmasuk = date('Y-m-d H:i:s');
            $dataAPD->objectstrukorderfk = $request['norec_so'];
            $dataAPD->save();

            // $strukOrder = StrukOrder::where('norec',$request['norec_so'])->update([
            //         'keteranganlainnya' =>$request['jawaban'] 
            //     ]);
            $dataSO = StrukOrder::where('norec', $request['norec_so'])->update([
                'keteranganlainnya' =>  'Terverif',
                'statusorder' =>  1
            ]);

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboS(Request $request)
    {

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();



        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();
        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();


        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,

            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getPemeriksaanKeluarLab(Request $request)
    {

        $data = \DB::table('pelayananpasien_t as pp ')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->LEFTJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->LEFTJOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'apd.objectpegawaifk')
            ->LEFTJOIN('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->select(
                'pp.norec',
                'pd.norec as norecpd',
                'pd.noregistrasi',
                'pp.tglpelayanan',
                'ru.namaruangan',
                'p.namalengkap',
                'ps.nocm',
                'ps.namapasien',
                'kps.kelompokpasien',
                'prd.namaproduk',
                'pp.jumlah',
                'pp.keteranganlain',
                'pd.tglregistrasi',
                'ru2.namaruangan as ruanganlast'
            );
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '<=', $request['tglAkhir']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        //        if(isset($request['noOrder']) && $request['noOrder']!="" && $request['noOrder']!="undefined"){
        //            $data = $data->where('so.noorder','ilike','%'.$request['noOrder'].'%');
        //        }
        if (isset($request['kelPasienId']) && $request['kelPasienId'] != "" && $request['kelPasienId'] != "undefined") {
            $data = $data->where('kps.id', '=', $request['kelPasienId']);
        }
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $data = $data->where('ru2.id', '=', $request['ruangId']);
        }
        if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['deptId']);
        }
        if (isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined") {
            $data = $data->take($request['jmlRows']);
        }
        $data = $data->where('pp.keteranganlain', 'Pemeriksaan Keluar');
        //        $data = $data->where('apd.objectruanganfk',276);
        $data = $data->orderBy('pp.tglpelayanan');
        //        $data = $data->distinct();
        $data = $data->get();

        //        //$results =array();
        //        foreach ($data as $item){
        //            $details = DB::select(DB::raw("
        //                            select so.tglorder,so.noorder,
        //                            pr.id,pr.namaproduk,op.qtyproduk
        //                            from strukorder_t as so
        //                            left join orderpelayanan_t as op on op.noorderfk = so.norec
        //                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
        //                            left join produk_m as pr on pr.id=op.objectprodukfk
        //                            left join ruangan_m as ru on ru.id=so.objectruanganfk
        //                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
        //                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
        //                            where so.noorder=:noorder
        //                            and op.keteranganlainnya = 'isPemeriksaanKeluar'"),
        //                array(
        //                    'noorder' => $item->noorder,
        //                )
        //            );
        //            $results[] = array(
        //                'tglorder' => $item->tglorder,
        //                'noorder' => $item->noorder,
        //                'norec' => $item->norec,
        //                'nocm' => $item->nocm,
        //                'namapasien' => $item->namapasien,
        //                'noregistrasi' => $item->noregistrasi,
        //                'kelompokpasien' => $item->kelompokpasien,
        //                'norecpd' => $item->norecpd,
        ////                'norecapd' => $item->norecapd,
        //                'namaruanganasal' => $item->ruanganasal,
        //                'namaruangantujuan' => $item->ruangantujuan,
        //                'dokter' => $item->namalengkap,
        //                'statusorder'=>$item->statusorder,
        //                'details' => $details,
        //            );
        //        }

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function savePasienKompleks(Request $request)
    {
        DB::beginTransaction();
        try {
            $pasien = Pasien::where('nocm', $request['nocm'])->update(
                [
                    'iskompleks' => $request['iskompleks']
                ]
            );

            $transStatus = 'true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,

            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePasienMPP(Request $request)
    {
        DB::beginTransaction();
        //        try {
        $pasien = Pasien::where('nocm', $request['nocm'])->update(
            [
                'isMPP' => $request['isMPP']
            ]
        );

        $transStatus = 'true';
        $transMessage = "Sukses";
        //        } catch (\Exception $e) {
        //            $transStatus = 'false';
        //            $transMessage = "simpan Gagal";
        //        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,

            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveResidence(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['norec_apd'] != null) {
                $apd =  AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->first();
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'residencefk' => $request['iddokter']
                        ]
                    );

                $pasienDaftar = PasienDaftar::where('norec', $apd->noregistrasifk)->update([
                    'residencefk' => $request['iddokter']
                ]);
            }
            $transMessage = "Sukses";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            $result = array(
                "status" => 201,
                //                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd, //$noResep,,//$noResep,
                "as" => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarKonsulFromOrder(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->Join('strukorder_t as so', 'so.norec', '=', 'apd.objectstrukorderfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                $join->on('apr.nocmfk', '=', 'pd.nocmfk');
            })
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
            ->select(
                'apd.tglmasuk as tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ps.namapasien',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'kls.id as idkelas',
                'kls.namakelas',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'apd.objectpegawaifk',
                'pg.namalengkap as namadokter',
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'apd.objectasalrujukanfk',
                'apd.tgldipanggildokter',
                'apd.statuspasien as statuspanggil',
                'pd.statuspasien',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'apr.noreservasi',
                'apd.noantrian',
                'apr.tanggalreservasi',
                'alm.alamatlengkap',
                'klstg.namakelas as kelasdijamin',
                'ru.ipaddress',
                'ps.iskompleks',
                'apd.residencefk',
                'pg2.namalengkap as residence',
                'apd.objectstrukorderfk',
                DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan')
            )
            ->where('pd.statusenabled', true)
            ->where('ps.statusenabled', true);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('apd.tglmasuk', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
            $data = $data->where('apd.norec',  $filter['norecApd']);
        }
        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('ru.id', $kodeRuang);
        }
        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }
        //$data = $data->whereIn('ru.objectdepartemenfk',[18,24,28,26,30,34]);
        //        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->orderBy('apd.noantrian');
        $data = $data->get();
        //        if(count($data) > 0){
        //            foreach ($data as $item){
        //                if($item->foto != null ){
        //                    $item->foto = "data:image/jpeg;base64," . base64_encode($item->foto);
        //                }
        //            }
        //        }
        return $this->respond($data);
    }

    public function saveSelesaiPeriksa(Request $request)
    {
        DB::beginTransaction();
        try {
            $apd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->first();
            if (isset($request['kelompokUser']) && $request['kelompokUser'] == 'dokter') {

                if ($apd->tglselesaiperiksa == null) {
                    AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->update([
                            'tglselesaiperiksa' => date('Y-m-d H:i:s'),
                        ]);
                }
            }
            $transStatus = 'true';
            $transMessage = "Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updateDokterAntrianKonsul(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['norec_apd'] != null) {
                $apd =  AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->first();
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'objectpegawaifk' => $request['iddokter']
                        ]

                    );
            }
            $transMessage = "Sukses";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            $result = array(
                "status" => 201,
                //                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd, //$noResep,,//$noResep,
                "as" => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function declineKonsul(Request $request)
    {
        DB::beginTransaction();
        try {
            $so = StrukOrder::where('norec', $request['norec'])->update(['istolak' => 1]);
            $transMessage = 'Sukses';
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            $result = [
                "status" => 201,
                "message" => $transMessage,
                "data" => $so,
                "by" => "dy"
            ];
        } else {
            $transMessage = 'Tolak konsul gagal!!';
            $result = [
                "status" => 400,
                "message" => $transMessage,
                "data" => $so,
                "by" => "dy"
            ];
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveBatalKonsulFromOrder(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        try {
            $getAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->first();
            $dataAPD = new AntrianPasienDiperiksaDelete();
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = 1;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $getAPD->objectasalarujukanfk;
            $dataAPD->objectkelasfk = $getAPD->objectkelasfk;
            $dataAPD->noantrian = $getAPD->noantrian;
            $dataAPD->noregistrasifk = $getAPD->noregistrasifk;
            $dataAPD->objectpegawaifk =  $getAPD->objectpegawaifk;
            $dataAPD->objectruanganfk =  $getAPD->objectruanganfk;
            $dataAPD->statusantrian =  $getAPD->statusantrian;
            $dataAPD->statuspasien = $getAPD->statuspasien;
            $dataAPD->statuskunjungan =  $getAPD->statuskunjungan;
            $dataAPD->statuspenyakit = $getAPD->statuspenyakit;
            $dataAPD->objectruanganasalfk =  $getAPD->objectruanganasalfk;
            $dataAPD->tglregistrasi = $getAPD->tglregistrasi; //date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = $getAPD->tglkeluar;
            $dataAPD->tglmasuk = $getAPD->tglmasuk;
            $dataAPD->objectstrukorderfk = $getAPD->objectstrukorderfk;
            $dataAPD->norec_apd = $getAPD->norec;
            $dataAPD->save();

            $delApd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->delete();
            $dataSO = StrukOrder::where('norec', $request['norec_so'])->update([
                'keteranganlainnya' =>  null,
            ]);

            $dataAPDnorec = $getAPD->norec;

            /*Logging User*/
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 0;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Update Id Finger Print Pegawai';
            $logUser->noreff = $request['norec_so'];
            $logUser->referensi = 'id pegawai';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();
            /*End Logging User*/

            $transStatus = 'true';
            $transMessage = "Batal Konsultasi Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Tidak bisa Batal Konsultasi, Pasien Sudah Memiliki Layanan";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPDnorec,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboKonsul(Request $request)
    {

        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix'));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] =  (int)$item;
        }
        $ruanganRajal = \DB::table('ruangan_m as ru')
            ->where('statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataRuangan = [];
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id', 'ru.namaruangan')
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->where('mlu.objectloginuserfk', $request['userData']['id'])
            ->orderBy('ru.namaruangan')
            ->get();
        $kelas = \DB::table('kelas_m as kls')
            ->select('kls.id', 'kls.namakelas')
            ->where('kls.statusenabled', true)
            ->orderBy('kls.namakelas')
            ->get();
        $result = array(

            'ruanganRajal' => $ruanganRajal,
            'dataRuangan' => $dataRuangan,
            'kelas' => $kelas,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getOrderKonsulCount(Request $request)
    {
        $arrRuangId = [];
        if (isset($request['perawatId']) && $request['perawatId'] != '') {
            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->join('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
                ->select('ru.id', 'ru.namaruangan')
                ->where('mlu.objectloginuserfk', $request['perawatId'])
                ->get();

            if (count($dataruangan) > 0) {
                foreach ($dataruangan as $item) {
                    $arrRuangId[]  = $item->id;
                }
            }
        }



        // $kelTrans = KelompokTransaksi::where('kelompoktransaksi','KONSULTASI DOKTER')->first();
        $data = \DB::table('strukorder_t as so')
            // ->Join ('pasiendaftar_t as pd','pd.norec','=','so.noregistrasifk')
            // ->Join('pasien_m as ps','ps.id','=','pd.nocmfk')
            // ->leftJoin('ruangan_m as ru','ru.id','=','so.objectruanganfk')
            // ->leftJoin('ruangan_m as rutuju','rutuju.id','=','so.objectruangantujuanfk')
            // ->leftJoin('pegawai_m as pg','pg.id','=','so.objectpegawaiorderfk')
            // ->leftJoin('pegawai_m as pet','pet.id','=','so.objectpetugasfk')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.objectstrukorderfk', '=', 'so.norec')
            ->select('so.norec', 'so.noorder')
            ->where('so.statusenabled', true)
            ->wherenull('apd.norec')
            ->wherenull('so.statusorder')
            ->where('so.objectkelompoktransaksifk', 108) //$kelTrans->id)
            ->where(function ($q) {
                $q->wherenull('so.istolak')
                    ->orwhere('so.istolak', 0);
            });
        // ->orderBy('so.tglorder','desc');
        if (isset($request['norecpd']) && $request['norecpd'] != '') {
            $data = $data->where('so.noregistrasifk', $request['norecpd']);
        }
        if (isset($request['dokterid']) && $request['dokterid'] != '') {
            $data = $data->where('so.objectpegawaiorderfk', $request['dokterid']);
        }
        if (isset($request['perawatId']) && $request['perawatId'] != '') {
            $data = $data->whereIn('so.objectruangantujuanfk', $arrRuangId);
        }

        $data = $data->count();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }
    public function saveDipanggilSusterRajal(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
            ->update([
                'tgldipanggilsuster' => $this->getDateTime()->format('Y-m-d H:i:s'),
                'statusantrian' => 2
            ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Gagal';
        }
        if ($transStatus == 'true') {
            $transMessage = '';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => "in@human"
            );
        } else {
            $transMessage = '';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => "in@human"
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getLaporanPersediaan(Request $request)
    {

        $filter = $request->all();

        // return($filter);

        $tglAwal = "";
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $tglAwal =  $filter['tglAwal'];
        }
        $tglAkhir = "";
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tglAkhir = $filter['tglAkhir'];
        }

        $ruanganId = '';
        if (isset($filter['idRuangan']) && $filter['idRuangan'] != " " && $filter['idRuangan'] != "undefined") {
            $ruanganId = ' AND ru.id = ' . $filter['idRuangan'];
        }

        $idDept = '';
        if (isset($filter['idDept']) && $filter['idDept'] != "" && $filter['idDept'] != "undefined") {
            $idDept = ' AND departemen_m.id = ' . $filter['idDept'];
        }

        $idRuangan = '';
        if (isset($filter['idRuangan']) && $filter['idRuangan'] != " " && $filter['idRuangan'] != "undefined") {
            $idRuangan = ' AND sp.objectruanganfk = ' . $filter['idRuangan'];
        }

        $idPenjamin = '';
        if (isset($filter['idPenjamin']) && $filter['idPenjamin'] != "" && $filter['idPenjamin'] != "undefined") {
          $idPenjamin = ' AND pd.objectkelompokpasienlastfk = '. $filter['idPenjamin'];
        }

        $data = DB::select(DB::raw("SELECT
                sr.norec,
                to_char( sr.tglresep, 'YYYY-MM-DD' ) AS tglresep,
                sr.noresep,
                UPPER ( ps.namapasien ) AS namapasien,
                ps.nocm,
                ru.namaruangan AS ruangan,
                pr.namaproduk,
                pp.jumlah,
                pp.hargajual,
                ( pp.jumlah * pp.hargajual + pp.jasa ) AS total,
                pg.namalengkap,
                CASE
                    
                    WHEN pp.hargadiscount IS NULL THEN
                    0 ELSE pp.hargadiscount
                END AS diskon,
                CASE
                    
                    WHEN pp.jasa IS NULL THEN
                    0 ELSE pp.jasa
                END AS jasa,
                0 AS ppn,
                departemen_m.namadepartemen
                FROM
                departemen_m
                INNER JOIN ruangan_m ON departemen_m.ID = ruangan_m.objectdepartemenfk
                RIGHT OUTER JOIN strukresep_t AS sr
                INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec
                INNER JOIN ruangan_m AS ru ON ru.ID = sr.ruanganfk
                INNER JOIN produk_m AS pr ON pr.ID = pp.produkfk
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                INNER JOIN pasien_m AS ps ON ps.ID = pd.nocmfk ON ruangan_m.ID = apd.objectruanganfk
                LEFT OUTER JOIN pegawai_m AS pg ON pg.ID = sr.penulisresepfk
                WHERE
                sr.tglresep BETWEEN '$tglAwal' AND '$tglAkhir'
                $ruanganId $idDept $idPenjamin
                GROUP BY
                sr.norec,
                sr.tglresep,
                sr.noresep,
                ps.namapasien,
                ps.nocm,
                ru.namaruangan,
                pr.namaproduk,
                pp.jumlah,
                pp.hargajual,
                pp.jasa,
                pg.namalengkap,
                pp.hargadiscount,
                departemen_m.namadepartemen UNION ALL
                SELECT
                sp.norec,
                to_char( sp.tglstruk, 'YYYY-MM-DD' ) AS tglresep,
                sp.nostruk AS noresep,
                UPPER ( sp.namapasien_klien ) AS namapasien,
                '-' AS nocm,
                ru.namaruangan AS ruangan,
                pr.namaproduk,
                spd.qtyproduk,
                spd.hargasatuan,
                ( spd.qtyproduk * spd.hargasatuan + spd.hargatambahan ) AS total,
                pg.namalengkap,
                CASE
                    
                    WHEN spd.hargadiscount IS NULL THEN
                    0 ELSE spd.hargadiscount
                END AS diskon,
                CASE
                    
                    WHEN spd.hargatambahan IS NULL THEN
                    0 ELSE spd.hargatambahan
                END AS jasa,
                0 AS ppn,
                'Penujualan Bebas' AS namadepartemen
                FROM
                strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m AS pr ON pr.ID = spd.objectprodukfk
                INNER JOIN pegawai_m AS pg ON pg.ID = sp.objectpegawaipenanggungjawabfk
                INNER JOIN ruangan_m AS ru ON ru.ID = sp.objectruanganfk
            WHERE
                sp.tglstruk BETWEEN '$tglAwal' AND '$tglAkhir'
                AND ( SUBSTRING ( sp.nostruk, 1, 2 ) = 'OB' )
               $idRuangan
            GROUP BY
                sp.norec,
                sp.tglstruk,
                sp.nostruk,
                sp.namapasien_klien,
                nocm,
                ru.namaruangan,
                pr.namaproduk,
                spd.qtyproduk,
                spd.hargasatuan,
                spd.hargatambahan,
                pg.namalengkap,
                spd.hargadiscount
            ORDER BY
                namadepartemen,
                noresep"));

        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getPasienEksekutifHalu(Request $request)
    {
        $dataDokumen2 = [];
        $cek = \DB::table('antrianpasiendiperiksa_t as apd')
            ->select('norec');

        if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
            $arrRuang = explode(',', $request['ruanganArr']);
            $kodeRuang = [];
            foreach ($arrRuang as $item) {
                $kodeRuang[] = (int) $item;
            }
            if ($kodeRuang[0] == 132) {
                $cek = $cek->where('apd.kdprofile', 99);
            } else {
                $cek = $cek->whereIn('apd.objectruanganfk', $kodeRuang);
            }
        }
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $cek = $cek->where('tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $cek = $cek->where('tglregistrasi', '<=', $filter['tglAkhir']);
        }
        $cek = $cek->where('statusenabled', true);
        $cek = $cek->where('apd.kdprofile', 99);
        $cek = $cek->get();

        if (count($cek) > 0) {

            ini_set('max_execution_time', 500);
            $filter = $request->all();
            $dataDokumen = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                // ->leftjoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
                //            ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pd.nostruklastfk')
                //            ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.norec','=','pd.nosbmlastfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('alamat_m as alm', 'ps.id', '=', 'alm.nocmfk')
                ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                // ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'apd.residencefk')
                ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
                ->leftjoin('antrianpasienregistrasi_t as apr', function ($join) {
                    $join->on('apr.noreservasi', '=', 'pd.statusschedule');
                    $join->on('apr.nocmfk', '=', 'pd.nocmfk');
                })
                // ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
                ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')
                ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
                ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
                ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'apd.objectstatuspulangfk')
                ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
                ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
                ->leftJoin('kasuspenyakit_m as ksp', 'ksp.id', '=', 'pd.objectkasuspenyakitlastfk')
                // ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
                ->select(
                    'pd.tglregistrasi',
                    'ps.nocm',
                    'ps.nobpjs',
                    'ps.id as nocmfk',
                    'pd.noregistrasi',
                    'ps.namapasien',
                    'ps.noidentitas',
                    'ps.tgllahir',
                    'jk.jeniskelamin',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'kls.id as idkelas',
                    'kls.namakelas',
                    'kp.id as objectkelompokpasienfk',
                    'kp.kelompokpasien',
                    'rek.namarekanan',
                    'apd.objectpegawaifk',
                    'pg.namalengkap as namadokter',
                    'pg.id as iddokter',
                    'pg.idhafis',
                    'pd.norec as norec_pd',
                    'apd.norec as norec_apd',
                    'apd.objectasalrujukanfk',
                    'pd.objectkelompokpasienlastfk',
                    'apd.tgldipanggildokter',
                    'apd.statuspasien as statuspanggil',
                    'pd.statuspasien',
                    'apd.tgldipanggildokter',
                    'apd.tgldipanggilsuster',
                    'apr.noreservasi',
                    'apd.noantrian',
                    'apr.tanggalreservasi',
                    'alm.alamatlengkap',
                    'klstg.namakelas as kelasdijamin',
                    'apd.tglselesaiperiksa',
                    'apr.tipepasien',
                    'apr.notelepon',
                    //                'ps.foto',
                    'ru.ipaddress',
                    'ps.iskompleks',
                    'apd.residencefk',
                    'pg2.namalengkap as residence',
                    'pd.istelemedicine',
                    'asu.objectkelasdijaminfk',
                    'pd.diagnosafretext',
                    'skd.id as idstatusberkas',
                    'ksp.kasuspenyakit',
                    'pa.nosep',
                    'pd.kodebookingantrol',
                    'pd.istaskantrol'
                    // ,DB::raw('case when pp.noregistrasifk is null then \'false\' else \'true\' end as statuslayanan'))
                    ,
                    DB::raw('case when apd.ispelayananpasien is null then \'false\' else \'true\' end as statuslayanan,
                    case when apd.kdprofile = 99 then \'Pasien Poli Eksekutif\' else skd.namaexternal end as namekendali,
                    case when sp.namaexternal is null then \'Belum Pulang\' else sp.namaexternal end as statuspulang,
                    case when jd.id=1 then dg.namadiagnosa else \'-\' end as diagnosa,
                    case when pd.objectkasuspenyakitlastfk=1 then \'Non Covid\' else ksp.kasuspenyakit end as kasuspenyakit')
                )
                // ->whereNull('br.norec')
                ->where('pd.statusenabled', true)
                ->take(50)
                // ->where('apd.statusenabled', true)
                ->where('apd.kdprofile', 99);
            // ->where('ps.statusenabled', true)
            // ->where('skd.id', 9);
            // ->whereNull('apd.ispelayananpasien');
            // ->whereNull('apd.objectruanganasalfk');
            //            ->whereNotIn('ru.objectdepartemenfk',[27,3]);
            // ->groupBy('pd.tglregistrasi','ps.nocm','pd.noregistrasi','ps.namapasien','ps.tgllahir','jk.jeniskelamin','apd.objectruanganfk','ru.namaruangan','kls.id','kls.namakelas',
            //           'kp.kelompokpasien','rek.namarekanan','apd.objectpegawaifk','pg.namalengkap','br.norec','pd.norec','apd.norec','apd.objectasalrujukanfk',
            //           'apd.tgldipanggildokter','apd.statuspasien','pd.statuspasien','apd.tgldipanggildokter','apd.tgldipanggilsuster','apr.noreservasi',
            //           'apr.tanggalreservasi','pp.noregistrasifk','apd.noantrian','alm.alamatlengkap');

            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $dataDokumen = $dataDokumen->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $dataDokumen = $dataDokumen->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
            }
            if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
                $dataDokumen = $dataDokumen->where('ru.id', '=', $filter['ruangId']);
            }
            if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
                $dataDokumen = $dataDokumen->where('pg.id', '=', $filter['dokId']);
            }
            if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
                $dataDokumen = $dataDokumen->where('pd.noregistrasi', '=', $filter['noreg']);
            }
            if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
                $dataDokumen = $dataDokumen->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
            }
            if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
                $dataDokumen = $dataDokumen->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
            }
            if (isset($filter['norecApd']) && $filter['norecApd'] != "" && $filter['norecApd'] != "undefined") {
                $dataDokumen = $dataDokumen->where('apd.norec',  $filter['norecApd']);
            }
            if (isset($request['ruanganArr']) && $request['ruanganArr'] != "" && $request['ruanganArr'] != "undefined") {
                $arrRuang = explode(',', $request['ruanganArr']);
                $kodeRuang = [];
                foreach ($arrRuang as $item) {
                    $kodeRuang[] = (int) $item;
                }
                if ($kodeRuang[0] == 132) {
                    $dataDokumen = $dataDokumen->where('apd.kdprofile', 99);
                } else {
                    $dataDokumen = $dataDokumen->whereIn('ru.id', $kodeRuang);
                }
            }

            if (isset($filter['istelemedicine']) && $filter['istelemedicine'] == "true") {
                $dataDokumen = $dataDokumen->where('pd.istelemedicine', '1');
            }

            if (isset($request['statusPeriksa']) && $request['statusPeriksa'] != "" && $request['statusPeriksa'] != "undefined") {
                if ($request['statusPeriksa'] == 1) {
                    $dataDokumen = $dataDokumen->whereRaw(" apd.tgldipanggilsuster IS NOT NULL AND apd.tgldipanggildokter IS NULL AND apd.tglselesaiperiksa IS NULL");
                } elseif ($request['statusPeriksa'] == 2) {
                    $dataDokumen = $dataDokumen->whereRaw(" apd.tgldipanggildokter IS NOT NULL AND apd.tglselesaiperiksa IS NULL");
                } elseif ($request['statusPeriksa'] == 3) {
                    $dataDokumen = $dataDokumen->whereRaw(" apd.tglselesaiperiksa IS NOT NULL ");
                }
            }

            if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
                $dataDokumen = $dataDokumen->take($filter['jmlRow']);
            }
            $dataDokumen = $dataDokumen->whereIn('ru.objectdepartemenfk', [18, 24, 28, 26, 30, 34, 79]);
            //        $dataDokumen = $dataDokumen->orderBy('pd.tglregistrasi');
            $dataDokumen = $dataDokumen->orderBy('apd.noantrian');
            $dataDokumen = $dataDokumen->distinct();
            $dataDokumen = $dataDokumen->get();

            $dataDokumen2 = $dataDokumen;
        }

        $result = array(
            'dataEksekutif' => $dataDokumen2
        );
        return $this->respond($result);
    }
    public function getPemeriksaanRujukLab(Request $request)
    {

        $data = \DB::table('pemeriksaanluarlab_t as pp ')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.noregistrasi', '=', 'pp.noregistrasifk')
            ->LEFTJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->LEFTJOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('pelayananluar_m as prd', 'prd.id', '=', 'pp.jenispelayananfk')
            ->select(
                'pp.norec',
                'pd.norec as norecpd',
                'pd.noregistrasi',
                'pp.tglpelayanan',
                'ps.nocm',
                'ps.namapasien',
                'kps.kelompokpasien',
                'prd.jenispelayanan',
                'pp.tarifluar',
                'pd.tglregistrasi',
                'pp.tglkirimsample',
                'ru2.namaruangan as ruanganlast'
            );
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '<=', $request['tglAkhir']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        //        if(isset($request['noOrder']) && $request['noOrder']!="" && $request['noOrder']!="undefined"){
        //            $data = $data->where('so.noorder','ilike','%'.$request['noOrder'].'%');
        //        }
        if (isset($request['kelPasienId']) && $request['kelPasienId'] != "" && $request['kelPasienId'] != "undefined") {
            $data = $data->where('kps.id', '=', $request['kelPasienId']);
        }
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $data = $data->where('ru2.id', '=', $request['ruangId']);
        }
        if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
            $data = $data->where('ru2.objectdepartemenfk', '=', $request['deptId']);
        }
        if (isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined") {
            $data = $data->take($request['jmlRows']);
        }
        $data = $data->orderBy('pp.tglpelayanan');
        //        $data = $data->distinct();
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
}
