<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 11/22/2019
 * Time: 12:23 PM
 */

 
namespace App\Http\Controllers\PMKP;

use App\Http\Controllers\ApiController;
use App\Master\PegawaiJadwalKerja;
use App\Master\Ruangan;
use App\Traits\Valet;
use App\Transaksi\AnalisaSasaranMutu;
use App\Transaksi\IdentifikasiRisiko;
use App\Transaksi\IdentifikasiRisikoDetail;
use App\Transaksi\InsidenKeselamatanPasien;
use App\Transaksi\LaporanInsidenInternal;
use App\Transaksi\LembarKerjaInvestigasi;
use App\Transaksi\RiskRegister;
use App\Transaksi\RiwayatPMKP;
use App\Transaksi\SasaranMutu;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\PelayananPasien;
use App\Transaksi\StrukAgendaDetail;
use App\Transaksi\StrukPlanningDetail;
use App\Transaksi\PasienDaftar;
use App\Transaksi\IndikatorRensar;
use App\Transaksi\IndikatorPelayananPasien;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;

class PMKPController extends ApiController
{

    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function  saveRiwayat (Request $request){
        DB::beginTransaction();
        try {
            if($request['norec'] == '') {
                $data = new RiwayatPMKP();
                $data->norec = $data->generateNewId();
                $data->kdprofile = 12;
                $data->statusenabled = true;
            }else{
                $data = RiwayatPMKP::where('norec',$request['norec'])->first();
            }
            $data->judul = $request['judul'];
            $data->isi = $request['isi'];
            $data->tgl = date('Y-m-d H:i');
            $data->pegawaifk = $this->getCurrentUserID();
            $data->keterangan = $request['keterangan'];
            $data->save();
            $norecs = $data->norec;
            if(isset($request['image']) && $request['image']!=null){
//                egi
                $img = $request['image'];
                $datas = unpack("H*hex", $img);
                $datas = '0x'.$datas['hex'];
                RiwayatPMKP::where('norec',$norecs)->update(
                    ['image' =>  \DB::raw("CONVERT(VARBINARY(MAX), $datas) ") ]
                );
                #egi

            }
            $transStatus = 'true';
          } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "norec" => $data,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "norec" => $data,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function  hapusRiwayat (Request $request){
        DB::beginTransaction();
        try {

            $data = RiwayatPMKP::where('norec',$request['norec'])->update([
                'statusenabled' => false
            ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                "norec" => $data,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "norec" => $data,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRiwayat(Request $request)
    {

        $data = \DB::table('riwayatpmkp_t as tt')
            ->leftJoin('pegawai_m as pg','pg.id','=','tt.pegawaifk')
            ->select('tt.*','pg.namalengkap')
            ->where('tt.statusenabled', true);

        if (isset($request['isi']) && $request['isi'] != "" && $request['isi'] != "undefined") {
            $data = $data->where('tt.isi', 'like', '%' . $request['isi'] . '%');
        };
        if (isset($request['judul']) && $request['judul'] != "" && $request['judul'] != "undefined") {
            $data = $data->where('tt.judul', 'like', '%' . $request['judul'] . '%');
        };
        $data = $data->get();


        return $this->respond($data);
    }

    public function getDataLaporanDokterPelayananPoliklinik(Request $request) {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $idDokter = $request['idDokter'];
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramDokter = ' ';
        if (isset($idDokter) && $idDokter != "" && $idDokter != "undefined") {
            $paramDokter = ' and pg.id = '.$idDokter;
        }

        $data = DB::select(DB::raw("SELECT x.namaruangan,x.namalengkap,SUM(x.jumlah) as jumlah
                FROM (SELECT pp.tglpelayanan,ru.namaruangan,ppp.objectpegawaifk,pg.namalengkap,COUNT(pg.namalengkap) as jumlah
                FROM pasiendaftar_t as pd 
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id
                LEFT JOIN pegawai_m as pg on pg.id = ppp.objectpegawaifk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                WHERE ppp.objectjenispetugaspefk = 4 AND ppp.objectpegawaifk <> 1
                AND ru.objectdepartemenfk in (18,24,26,27,3,28,29,30) 
                AND pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'                
                $paramRuangan
                $paramDokter
                GROUP BY pp.tglpelayanan,namaruangan,ppp.objectpegawaifk,pg.namalengkap)as x
                GROUP BY x.namaruangan,x.namalengkap"));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataLaporanDokterPelayananRanap(Request $request) {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $idDokter = $request['idDokter'];
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramDokter = ' ';
        if (isset($idDokter) && $idDokter != "" && $idDokter != "undefined") {
            $paramDokter = ' and pg.id = '.$idDokter;
        }

        $data = DB::select(DB::raw("SELECT x.namaruangan,x.namalengkap,SUM(x.jumlah) as jumlah
                FROM (SELECT pp.tglpelayanan,ru.namaruangan,ppp.objectpegawaifk,pg.namalengkap,COUNT(pg.namalengkap) as jumlah
                FROM pasiendaftar_t as pd 
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk = apd.norec
                INNER JOIN pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id
                LEFT JOIN pegawai_m as pg on pg.id = ppp.objectpegawaifk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                WHERE ppp.objectjenispetugaspefk = 4 AND ppp.objectpegawaifk <> 1
                AND ru.objectdepartemenfk in (16,36,25) 
                AND pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'                
                $paramRuangan
                $paramDokter
                GROUP BY pp.tglpelayanan,namaruangan,ppp.objectpegawaifk,pg.namalengkap)as x
                GROUP BY x.namaruangan,x.namalengkap"));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataCombo(Request $request)
    {
        $ruangan= \DB::table('ruangan_m')
            ->select('id','namaruangan')
            ->where('statusenabled',true)
            ->get();
        $dokter= \DB::table('pegawai_m')
            ->select('id','namalengkap')
            ->where('statusenabled',true)
            ->where('objectjenispegawaifk',true)
            ->get();
        $ruanganrajal=\DB::table('ruangan_m')
            ->select('id','namaruangan')
            ->where('statusenabled',true)
            ->whereIn('objectdepartemenfk', [18,24,26,27,3,28,29,30])
            ->get();
        $ruanganranap=\DB::table('ruangan_m')
            ->select('id','namaruangan')
            ->where('statusenabled',true)
            ->whereIn('objectdepartemenfk', [16,36,25])
            ->get();
        $JenisKeselamatan = \DB::table('jeniskeselamatan_m')
            ->select('id','jeniskeselamatan')
            ->where('statusenabled',true)
            ->get();
        $Keselamatan = \DB::table('insidenkeselamatan_m')
            ->select('id','namakeselamatan','jeniskesalamatanfk','namakeselamatan as keselamatan')
            ->where('statusenabled',true)
            ->get();
        $dataInstalasi = \DB::table('departemen_m as dp')
//            ->whereIn('dp.id',[3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35])
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataKeselamatanInsidenPasien = \DB::table('jeniskeselamatan_m as jk')
            ->join('insidenkeselamatan_m as ik','ik.jeniskesalamatanfk','=','jk.id')
            ->selectRaw("ik.id,ik.jeniskesalamatanfk,ik.namakeselamatan as keselamatan,jk.jeniskeselamatan")
            ->where('jk.statusenabled', true)
            ->where('ik.statusenabled', true)
            ->orderBy('ik.id', 'ASC')
            ->get();

        $dataMapBeckend = \DB::table('jenisbeckendindikator_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaexternal')
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

        foreach ($JenisKeselamatan as $item) {
            $detail = [];
            foreach ($Keselamatan as $item2) {
                if ($item->id == $item2->jeniskesalamatanfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'keselamatan' => $item2->namakeselamatan,
                    );
                }
            }

            $dataJenisKeselamatan[] = array(
                'id' => $item->id,
                'jeniskesalamatan' => $item->jeniskeselamatan,
                'keselamatan' => $detail,
            );
        }

        $DimensiMutu = \DB::table('dimensimutu_m')
            ->select('id','demensimutu')
            ->where('statusenabled',true)
            ->get();
        $FrekuensiData = \DB::table('frekuensidata_m')
            ->select('id','frekuensi')
            ->where('statusenabled',true)
            ->get();
        $dataWaktuLaporan = \DB::table('waktulaporan_m')
            ->select('id','waktulaporan')
            ->where('statusenabled', true)
            ->orderBy('waktulaporan')
            ->get();
        $dataPeriodeAnalis = \DB::table('periodeanalis_m')
            ->select('id','periode')
            ->where('statusenabled', true)
            ->orderBy('periode')
            ->get();
        $dataMetologi = \DB::table('metologi_m')
            ->selectRaw("id,metologi || ': ' || keterangan as metologi")
            ->where('statusenabled', true)
            ->orderBy('id')
            ->get();
        $dataMetologiAna = \DB::table('metologianalisisdata_m')
            ->selectRaw("id,analisisdata")
            ->where('statusenabled', true)
            ->orderBy('id')
            ->get();
        $dataCakupan = \DB::table('cakupandata_m')
            ->selectRaw("id,cakupandata")
            ->where('statusenabled', true)
            ->orderBy('id')
            ->get();
        $dataPublikasi = \DB::table('publikasidata_m')
            ->selectRaw("id,publikasidata")
            ->where('statusenabled', true)
            ->orderBy('id')
            ->get();
        $dataKategoryIndikator = \DB::table('kategoryindikator_m')
            ->selectRaw("id,kategoryindikator")
            ->where('statusenabled', true)
            ->orderBy('id')
            ->get();
        $dataRegrading = \DB::table('regrading_m')
            ->selectRaw("id,regrading")
            ->where('statusenabled', true)
            ->orderBy('id')
            ->get();

        $kdUserPmkp = $this->settingDataFixed('KdKelompokUserPmkp',null);
        $dataKategoryRisiko = \DB::table('kategoryrisiko_m')
            ->selectRaw("id,kategoryrisiko")
            ->where('statusenabled', true)
            ->orderBy('id')
            ->get();

        $result = array(
            'ruangan' => $ruangan,
            'ruanganrajal' => $ruanganrajal,
            'ruanganranap' => $ruanganranap,
            'dokter' => $dokter,
            'jeniskeselamatan' => $dataJenisKeselamatan,
            'departemen' => $dataInstalasi,
            'datakeselamatan' => $Keselamatan,
            'insidenkeselamtanpasien' => $dataKeselamatanInsidenPasien,
            'dimensimutu' => $DimensiMutu,
            'frekuensidata' => $FrekuensiData,
            'waktulaporan' => $dataWaktuLaporan,
            'periodeanalis' => $dataPeriodeAnalis,
            'metologi' => $dataMetologi,
            'metologiana' => $dataMetologiAna,
            'cakupandata' => $dataCakupan,
            'publikasidata' => $dataPublikasi,
            'kategory' => $dataKategoryIndikator,
            'regrading' => $dataRegrading,
            'kdUser' => $kdUserPmkp,
            'kategoryrisiko' => $dataKategoryRisiko,
            'listdept' => $dataDepartemen,
            'datamapbeckend'=>$dataMapBeckend,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getDataLaporanDokterPenanggungJawabRanap(Request $request) {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $idDokter = $request['idDokter'];
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramDokter = ' ';
        if (isset($idDokter) && $idDokter != "" && $idDokter != "undefined") {
            $paramDokter = ' and pg.id = '.$idDokter;
        }

        $data = DB::select(DB::raw("SELECT x.namaruangan,x.namalengkap,SUM(x.jumlah) as jumlah
                FROM (SELECT apd.tglmasuk,ru.namaruangan,apd.objectpegawaifk,
                            CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,
                            COUNT(pg.namalengkap) as jumlah
                FROM pasiendaftar_t as pd 
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id
                LEFT JOIN pegawai_m as pg on pg.id = apd.objectpegawaifk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                WHERE ru.objectdepartemenfk in (16,36,25)
                AND apd.tglmasuk BETWEEN '$tglAwal' and '$tglAkhir'                
                $paramRuangan
                $paramDokter
                GROUP BY apd.tglmasuk,namaruangan,apd.objectpegawaifk,pg.namalengkap)as x
                GROUP BY x.namaruangan,x.namalengkap"));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanJamVisiteDokter(Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->JOIN ('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->JOIN ('pelayananpasienpetugas_t as ppp','ppp.pelayananpasien','=','pp.norec')
            ->JOIN ('pasien_m as pm','pm.id','=','pd.nocmfk')
            ->JOIN ('jeniskelamin_m as jk','jk.id', '=','pm.objectjeniskelaminfk')
            ->LEFTJOIN ('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->LEFTJOIN ('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
            ->JOIN ('ruangan_m as ru','ru.id','=', 'apd.objectruanganfk')
            ->JOIN ('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->JOIN ('produk_m as pro','pro.id','=','pp.produkfk')
            ->select(DB::raw("pm.nocm,pd.noregistrasi,pm.namapasien,CONVERT(DATETIME, pp.tglpelayanan, 0) AS tglpelayanan,pro.namaproduk,
			                        CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,ru.namaruangan"))
            ->where('ppp.objectpegawaifk', '<>', 1)
            ->where('ppp.objectjenispetugaspefk',4)
            ->whereIn('ru.objectdepartemenfk', [16,36,25])
            ->whereIn('pp.produkfk', [404047,4040475,4041191]);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '<=', $request['tglAkhir']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $data = $data->Where('pg.id', '=', $request['idDokter'])	;
        }
        $data =  $data ->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanKematianPasienRanap(Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('pasien_m as pm','pm.id','=','pd.nocmfk')
            ->JOIN ('jeniskelamin_m as jk','jk.id', '=','pm.objectjeniskelaminfk')
            ->LEFTJOIN ('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->JOIN ('ruangan_m as ru','ru.id','=', 'pd.objectruanganlastfk')
            ->JOIN ('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select(DB::raw("pm.nocm,pd.noregistrasi,pm.namapasien,CONVERT(varchar,pm.tgllahir,105) as tgllahir,
			                 CONVERT(varchar,pd.tglregistrasi,105) as tglregistrasi,ru.namaruangan,pd.tglmeninggal"))
            ->whereRaw(" DATEDIFF( hour, pd.tglregistrasi, pd.tglmeninggal ) > 48")
            ->whereIn('ru.objectdepartemenfk', [16,36,25]);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
//        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//            $data = $data->Where('pg.id', '=', $request['idDokter'])	;
//        }
        $data =  $data ->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanPasienPulangPaksa(Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('pasien_m as pm','pm.id','=','pd.nocmfk')
            ->JOIN ('jeniskelamin_m as jk','jk.id', '=','pm.objectjeniskelaminfk')
            ->LEFTJOIN ('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->JOIN ('ruangan_m as ru','ru.id','=', 'pd.objectruanganlastfk')
            ->JOIN ('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select(DB::raw("pm.nocm,pd.noregistrasi,pm.namapasien,CONVERT(varchar,pm.tgllahir,105) as tgllahir,
			         CONVERT(varchar,pd.tglregistrasi,105) as tglregistrasi,ru.namaruangan,CONVERT(varchar,pd.tglpulang,105) as tglpulang"))
            ->whereNotNull('pd.tglpulang')
            ->where('pd.objectstatuspulangfk',12)
            ->whereIn('ru.objectdepartemenfk', [16,36,25]);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
//        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//            $data = $data->Where('pg.id', '=', $request['idDokter'])	;
//        }
        $data =  $data ->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanLamaHariPerawatanPasien(Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('pasien_m as pm','pm.id','=','pd.nocmfk')
            ->JOIN ('jeniskelamin_m as jk','jk.id', '=','pm.objectjeniskelaminfk')
            ->LEFTJOIN ('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->JOIN ('ruangan_m as ru','ru.id','=', 'pd.objectruanganlastfk')
            ->JOIN ('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select(DB::raw("pm.nocm,pd.noregistrasi,pm.namapasien,CONVERT(varchar,pm.tgllahir,105) as tgllahir,
                                     CONVERT(varchar,pd.tglregistrasi,105) as tglregistrasi,ru.namaruangan,
                                     CONVERT(varchar,pd.tglpulang,105) as tglpulang,
                                     CASE WHEN DATEDIFF(day, pd.tglregistrasi, pd.tglpulang ) = 0 THEN DATEDIFF(hour, pd.tglregistrasi, pd.tglpulang) ELSE
                                     DATEDIFF( day, pd.tglregistrasi, pd.tglpulang) END AS lamadirawat"))
            ->whereNotNull('pd.tglpulang')
            ->whereIn('ru.objectdepartemenfk', [16,36,25]);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
//        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//            $data = $data->Where('pg.id', '=', $request['idDokter'])	;
//        }
        $data =  $data ->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getPerawatMinimalD3(Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->LEFTJOIN ('jenispegawai_m as jp','jp.id','=','pg.objectjenispegawaifk')
            ->LEFTJOIN ('pendidikan_m as pend','pend.id','=','pg.objectpendidikanterakhirfk')
            ->select(DB::raw("pg.nippns,pg.namalengkap,jp.jenispegawai,pend.pendidikan"))
            ->where('pg.id', '<>', 1)
            ->where('pg.kdprofile', 12)
            ->where('pg.objectjenispegawaifk','=',2)
            ->whereNotIn('pg.objectjenispegawaifk',[0,1,2,3,4,5,6]);

//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
//        }
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
//        }
//        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
//            $data = $data->where('ru.id', '=', $request['idRuangan']);
//        }
//        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//            $data = $data->Where('pg.id', '=', $request['idDokter'])	;
//        }
        $data =  $data ->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanKematianPasienIgd(Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN ('pasien_m as pm','pm.id','=','pd.nocmfk')
            ->JOIN ('jeniskelamin_m as jk','jk.id', '=','pm.objectjeniskelaminfk')
            ->LEFTJOIN ('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->JOIN ('ruangan_m as ru','ru.id','=', 'pd.objectruanganlastfk')
            ->JOIN ('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select(DB::raw("pm.nocm,pd.noregistrasi,pm.namapasien,CONVERT(varchar,pm.tgllahir,105) as tgllahir,
			                 CONVERT(varchar,pd.tglregistrasi,105) as tglregistrasi,ru.namaruangan,pd.tglmeninggal"))
            ->whereRaw(" DATEDIFF( hour, pd.tglregistrasi, pd.tglmeninggal ) < 24");
//            ->whereIn('ru.objectdepartemenfk', [16,36,25]);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
//        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//            $data = $data->Where('pg.id', '=', $request['idDokter'])	;
//        }
        $data =  $data ->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getComboIndikatorMutu(Request $request){
        $req = $request->all();
        $data = \DB::table('indikatorrensar_m')
            ->select('id','indikator','numerator','denominator')
            ->where('statusenabled', true)
            ->orderBy('indikator');

        if(isset($req['indikator']) &&
            $req['indikator']!="" &&
            $req['indikator']!="undefined"){
            $data = $data->where('indikator','like','%'. $req['indikator'] .'%' );
        };
        if(isset($req['idpegawai']) &&
            $req['idpegawai']!="" &&
            $req['idpegawai']!="undefined"){
            $data = $data->where('id', $req['idpegawai'] );
        };
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $data = $data
                ->where('indikator','like','%'.$req['filter']['filters'][0]['value'].'%' );
        }

        $data = $data->get();
        return $this->respond($data);
    }

    public function verif(Request $request){
        \DB::beginTransaction();
        try {
            
            $departemenfk = $request['departemenfk'];
            $ruanganfk = $request['ruanganfk'];
            $tgl  = $request['tgl'];
           
           if($request['status'] == 1)
           {
           
            $dele =SasaranMutu::where('departemenfk',$departemenfk)
            ->whereRaw("format(tglnilai,'yyyy-MM') ='$tgl' " )
            ->where('ruanganfk' ,$request['ruanganfk'])
            ->update([
                'statusVerif' => 1
            ]
            );
            
            
           }else
           {
                    $dele =SasaranMutu::where('departemenfk',$departemenfk)
                    ->whereRaw("format(tglnilai,'yyyy-MM') ='$tgl' " )
                    ->where('ruanganfk' ,$request['ruanganfk'])
                    ->update([
                        'statusVerif' => 0
                    ]
                    );
           }
                       
            $transStatus ='true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSasaranMutu(Request $request) {
        \DB::beginTransaction();
        try {
            $tgl = [];
            $id = [];
            $ket = [];
            $rFk = [];
            $departemenfk = $request['departemenfk'];
            foreach ($request['data'] as $item) {
                $tgl []= $item['tgl'];
                $id []= $item['indikatorfk'];
                $ket []= $item['keterangan'];
            }
            $statusVerif ="";
            $cekDataAh =SasaranMutu::whereIn('tgl',$tgl)
                         ->get();
            if(!empty($cekDataAh))
            {
              
            
                foreach($cekDataAh as $aya){
                    // return($cekDataAh);
                    // die;
                            $statusVerif =$aya['statusVerif'];
                            if($statusVerif != 0 || $statusVerif !='' || $statusVerif != null)
                            {
                                
                                    $transMessage = "data telah diverif sebelumnya";
                                    DB::rollBack();
                                    $result = array(
                                        "status" => 400,
                                        "message"  => $transMessage,
                                        "as" => 'ramdanegie@epic',
                                    );
                               
                                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                            }
                }
            }
           
            $dele =SasaranMutu::where('departemenfk',$departemenfk)
                ->whereIn('tgl',$tgl)
                ->whereIn('indikatorfk',$id)
                ->whereIn('keterangan',$ket)
                ->where('ruanganfk' ,$request['ruanganfk'])
                 ->delete();
        //    return $this->respond($dele);
            // return($request['ruanganfk']);
            // die;
            foreach ($request['data'] as $item) {
//                return $this->respond($item['norecSasaran']);
                $gtData =SasaranMutu::where('departemenfk',$departemenfk)
                ->where('tgl',$item['tgl'])
                ->where('indikatorfk',$item['indikatorfk'])
                ->where('keterangan',$item['keterangan'])
                ->where('ruanganfk' ,$request['ruanganfk'])
                ->get();
               
                if(count($gtData) == 0)
                {
                    if ($item['norecSasaran'] == '') {
                        $dataJadwal = new SasaranMutu();
                        $dataJadwal->norec = $dataJadwal->generateNewId();
                        $dataJadwal->kdprofile = 0;
                        $dataJadwal->statusenabled = true;
                    } else {
                        $dataJadwal = SasaranMutu::where('norec', $item['norecSasaran'])->first();
                    }
                    $dataJadwal->indikatorfk = $item['indikatorfk'];
                    $dataJadwal->tglnilai = $item['tgl'];
                    $dataJadwal->tgl = $item['tgl'];
                    $dataJadwal->departemenfk = $request['departemenfk'];
                    $dataJadwal->ruanganfk = $request['ruanganfk'];
                    $dataJadwal->nilai = $item['isi'];
                    $dataJadwal->num = $request['numerator'];
                    $dataJadwal->denum = $request['denumerator'];
                    $dataJadwal->capaian = $request['capaian'];
                    $dataJadwal->keterangan = $item['keterangan'];
                    $dataJadwal->save();
                }
              

            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarIndikator(Request $request)
    {
        $tahun = Carbon::now()->format('Y');
        $data1 = DB::table('indikatorrensar_m as head')
        ->leftjoin('ruanganindikatorrensar_t as ri', 'ri.indikatorrensarfk', '=', 'head.id')
        ->select(DB::raw("head.id,head.indikator,head.denominator,head.numerator,'NUM' as numeratordenominator, head.numerator as keterangan,head.nourut,0 AS nilai,'' as tgl,ri.objctruanganfk"))
        ->where('head.statusenabled',1)
        ->whereNotNull('head.nourut')
        ->where('head.objectdepartemenfk',$request['idDept'])
        ->groupby('head.id', 'head.indikator', 'head.denominator', 'head.numerator', 'head.nourut','ri.objctruanganfk');

        if(isset($request['idRuangan']) && $request['idRuangan']!= ''){
            $data1 = $data1->where('ri.objctruanganfk',$request['idRuangan']);
        }
        $dataSatu1 = DB::table('indikatorrensar_m as head')
            ->leftjoin('ruanganindikatorrensar_t as ri', 'ri.indikatorrensarfk', '=', 'head.id')
            ->select(DB::raw("head.id,head.indikator,head.denominator,head.numerator,'DENUM' as numeratordenominator, head.denominator as keterangan,head.nourut,0 AS nilai,'' as tgl,ri.objctruanganfk"))
            ->where('head.statusenabled',1)
            ->where('head.objectdepartemenfk',$request['idDept'])
            ->whereNotNull('head.nourut')
//            ->orderBy('head.id','asc')
            ->groupby('head.id', 'head.indikator', 'head.denominator', 'head.numerator', 'head.nourut','ri.objctruanganfk')
            ->union($data1);
            if(isset($request['idRuangan']) && $request['idRuangan']!= ''){
                $dataSatu1 = $dataSatu1->where('ri.objctruanganfk',$request['idRuangan']);
            }
    
        $data = DB::table('indikatorrensar_m as head')
            ->leftjoin('ruanganindikatorrensar_t as ri', 'ri.indikatorrensarfk', '=', 'head.id')
            ->leftjoin('sasaranmutu_t as sm','sm.indikatorfk','=','head.id')
            ->select(DB::raw("head.id,head.indikator,head.denominator,head.numerator,'NUM' as numeratordenominator, head.numerator as keterangan,head.nourut,CASE WHEN sm.keterangan = 'NUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS nilai,sm.tgl,ri.objctruanganfk"))
            ->where('head.statusenabled',1)
            ->whereNotNull('head.nourut')
            ->where('head.objectdepartemenfk',$request['idDept'])
            ->groupby('head.id', 'head.indikator', 'head.denominator', 'head.numerator', 'head.nourut','sm.keterangan','sm.tgl','ri.objctruanganfk')
            ->union($dataSatu1);
            if(isset($request['idRuangan']) && $request['idRuangan']!= ''){
                $data = $data->where('sm.ruanganfk',$request['idRuangan']);
            }
            if(isset($request['bln']) &&
            $request['bln']!="" &&
            $request['bln']!="undefined"){
            $tgl = $request['bln']  ;
            $data=  $data->whereRaw("format(sm.tglnilai,'yyyy-MM') ='$tgl' " );
             };
            //    $data =$data->goupby('head.id', 'head.indikator', 'head.denominator', 'head.numerator', 'head.nourut','sm.keterangan');
//            ->orderBy('head.id','asc');

        $dataSatu = DB::table('indikatorrensar_m as head')
            ->leftjoin('ruanganindikatorrensar_t as ri', 'ri.indikatorrensarfk', '=', 'head.id')
            ->leftjoin('sasaranmutu_t as sm','sm.indikatorfk','=','head.id')
            ->select(DB::raw("head.id,head.indikator,head.denominator,head.numerator,'DENUM' as numeratordenominator, head.denominator as keterangan,head.nourut,CASE WHEN sm.keterangan = 'DENUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS nilai,sm.tgl,ri.objctruanganfk"))
            ->where('head.statusenabled',1)
            ->where('head.objectdepartemenfk',$request['idDept'])
            ->whereNotNull('head.nourut')
//            ->orderBy('head.id','asc')
            ->groupby('head.id', 'head.indikator', 'head.denominator', 'head.numerator', 'head.nourut','sm.keterangan','sm.tgl','ri.objctruanganfk')
            ->union($data);
            if(isset($request['idRuangan']) && $request['idRuangan']!= ''){
                $dataSatu = $dataSatu->where('sm.ruanganfk',$request['idRuangan']);
            }
            if(isset($request['bln']) &&
            $request['bln']!="" &&
            $request['bln']!="undefined"){
            $tgl = $request['bln']  ;
            $dataSatu = $dataSatu->whereRaw("format(sm.tglnilai,'yyyy-MM') ='$tgl' " );
             };
            // $data =$data->goupby('head.id', 'head.indikator','head.denominator', 'head.numerator', 'head.nourut','sm.keterangan');
//        if(isset($request['idDept']) && $request['idDept']!= ''){
//            $data = $data->where('head.objectdepartemenfk',$request['idDept']);
//            $dataSatu = $dataSatu->where('head.objectdepartemenfk',$request['idDept']);
//        }
        $dataSatu = $dataSatu->orderBy('head.nourut', 'asc');
        $dataSatu = $dataSatu->orderByRaw('head.id,numeratordenominator desc');
        // $dataSatu = $dataSatu->orderBy('keterangan', 'DESC');
        $dataSatu = $dataSatu->get();
        $dataAnyar = [];
        $result = array(
            'data' => $dataSatu,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }


    public function getDaftarIndikatorPMKP(Request $request)
    {
        $tahun = Carbon::now()->format('Y');
        $data = DB::table('indikatorrensar_m as head')
            ->leftjoin('ruanganindikatorrensar_t as ri', 'ri.indikatorrensarfk', '=', 'head.id')
            ->select(DB::raw("head.id,head.indikator,head.denominator,head.numerator,'NUM' as numeratordenominator, head.numerator as keterangan,head.nourut,head.keteranganinput"))
            ->where('head.statusenabled',1)
            ->whereNotNull('head.nourut')
            ->where('head.keteranganmaster','=',2)
            ->where('head.objectdepartemenfk',$request['idDept']);
            if(isset($request['idRuangan']) && $request['idRuangan']!= ''){
                $data = $data->where('ri.objctruanganfk',$request['idRuangan']);
            }
//            ->orderBy('head.id','asc');

        $dataSatu = DB::table('indikatorrensar_m as head')
            ->leftjoin('ruanganindikatorrensar_t as ri', 'ri.indikatorrensarfk', '=', 'head.id')
            ->select(DB::raw("head.id,head.indikator,head.denominator,head.numerator,'DENUM' as numeratordenominator, head.denominator as keterangan,head.nourut,head.keteranganinput"))
            ->where('head.statusenabled',1)
            ->where('head.objectdepartemenfk',$request['idDept'])
            ->whereNotNull('head.nourut')
            ->where('head.keteranganmaster','=',2)
//            ->orderBy('head.id','asc')
            ->union($data);
            if(isset($request['idRuangan']) && $request['idRuangan']!= ''){
                $dataSatu = $dataSatu->where('ri.objctruanganfk',$request['idRuangan']);
            }
//        if(isset($request['idDept']) && $request['idDept']!= ''){
//            $data = $data->where('head.objectdepartemenfk',$request['idDept']);
//            $dataSatu = $dataSatu->where('head.objectdepartemenfk',$request['idDept']);
//        }
        $dataSatu = $dataSatu->orderBy('head.nourut', 'asc');
        $dataSatu = $dataSatu->orderByRaw('head.id,numeratordenominator desc');
        // $dataSatu = $dataSatu->orderBy('keterangan', 'DESC');
        $dataSatu = $dataSatu->get();
        $dataAnyar = [];
        $result = array(
            'data' => $dataSatu,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getPPI(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minutes
        $now = date('Y-m-d');
        // // return( date('Y-m-d'));
        // // die();

        // foreach($indikator as $itemindikator) {
        $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenisbeckendindikatorfk', '=','3')
            ->orderBy('ru.namaexternal')
            ->get();

        foreach ($dataMapBeckend as $item) {
            $datadenum = \DB::table('indikatorpelayananpasien_t as ipp')
                ->select(DB::raw("distinct COUNT(ipp.norec) as denum, ipp.ruanganfk"))
                ->join('mappingindikatortoproduk_m as mipp', 'mipp.id', '=', 'ipp.objectmappingindikatortoprodukfk')
                ->where('ipp.flag', true)
                ->where('mipp.objectindikatorrensarfk', '=', $item->id)
                // ->where('mipp.objectindikatorrensarfk', '=', $itemindikator->id)
                ->where('ipp.statusenabled', true)
                ->whereRaw("(to_char(ipp.tgl_indikator, 'yyyy-MM-dd')='$now')")
                ->where('ipp.ruanganfk', '=', 770)
                ->groupBy('ipp.ruanganfk')
                ->get();
                // return($datadenum);
                // die();

            
            foreach($datadenum as $itemdenum) {
                $data = \DB::table('indikatorpelayananpasien_t as ipp')
                    ->select(DB::raw("CASE WHEN SUM(dis.bobot)>=50 THEN 1 ELSE 0 END AS nilai_num , ipp.norec, ipp.ruanganfk"))
                    ->join('detail_ipp_t as dipp', 'dipp.ippfk', '=', 'ipp.norec')
                    ->join('mappingindikatortoproduk_m as mipp', 'mipp.id', '=', 'ipp.objectmappingindikatortoprodukfk')
                    ->join('detailindikatorrensar_m as dis', 'dis.id', '=', 'dipp.dirfk')
                    ->whereRaw("(to_char(ipp.tgl_indikator, 'yyyy-MM-dd')='$now')")
                    ->where('mipp.objectindikatorrensarfk', '=', $item->id)
                    // ->where('mipp.objectindikatorrensarfk', '=', $itemindikator->id)
                    ->where('ipp.ruanganfk', '=', $itemdenum->ruanganfk)
                    ->where('ipp.statusenabled', true)
                    ->where('ipp.flag', true)
                    ->where('dis.flag', 1)
                    ->where('dipp.num', '=', 1)
                    ->groupBy('ipp.norec', 'ipp.ruanganfk')
                    ->get();

                    $num = 0;
                    foreach($data as $item) {
                        if($item->nilai_num == 1) {
                            $num += 1;
                        }
                    }
                    // return($data);
                    // die();
                    $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                        ->where('tgl',$request['tgl'])
                        ->where('indikatorfk', '=', $item->id)
                        ->where('ruanganfk', '=', $itemdenum->ruanganfk)
                        ->get();
        
                    if(count($gtData) > 1) {
                        foreach($gtData as $gtItem) {
                            // return($gtItem->keterangan);
                            // die();
                            if($gtItem->keterangan == 'NUM') {
                                    $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                                    ->update([
                                        'nilai' => $num
                                    ]);
                            } else {
                                $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                                ->update([
                                    'nilai' => $itemdenum->denum
                                ]);
            
                            }
                        }
                    } else {
                        $dataNum = new SasaranMutu();
                        $dataNum->norec = $dataNum->generateNewId();
                        $dataNum->kdprofile = 0;
                        $dataNum->statusenabled = true;
                        $dataNum->indikatorfk = $item->id;
                        $dataNum->tglnilai = $request['tgl'];
                        $dataNum->tgl = $request['tgl'];
                        $dataNum->departemenfk = $request['idDept'];
                        $dataNum->ruanganfk = $itemdenum->ruanganfk;
                        $dataNum->nilai = $num;
                        $dataNum->num = 0;
                        $dataNum->denum = 0;
                        $dataNum->capaian = 1;
                        $dataNum->keterangan = 'NUM';
                        $dataNum->save();
                        
                        $dataDenum = new SasaranMutu();
                        $dataDenum->norec = $dataDenum->generateNewId();
                        $dataDenum->kdprofile = 0;
                        $dataDenum->statusenabled = true;
                        $dataDenum->indikatorfk = $item->id;
                        $dataDenum->tglnilai = $request['tgl'];
                        $dataDenum->tgl = $request['tgl'];
                        $dataDenum->departemenfk = $request['idDept'];
                        $dataDenum->ruanganfk = $itemdenum->ruanganfk;
                        $dataDenum->nilai = $itemdenum->denum;
                        $dataDenum->num = 0;
                        $dataDenum->denum = 0;
                        $dataDenum->capaian = 1;
                        $dataDenum->keterangan = 'DENUM';
                        $dataDenum->save();
                    }
                }
                

            $result = array(
                'indikator' => $item->id,
                'message' => 'ea@epic',
            );
        }
        
        return $this->respond($result);
    }

    public function getKepatuhanJamVisitDokterSpesialis(Request $request)
    {
            $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
                ->select('id', 'namaruangan')
                ->where('statusenabled',true)
                ->get();

        // return($satu);
        // die();
            // $indikatorfk = 13;
                          
            foreach($satu as $itemsatu) {
                $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                    ->where('ru.statusenabled', true)
                    ->where('ru.objectjenisbeckendindikatorfk', '=','2')
                    ->orderBy('ru.namaexternal')
                    ->get();
                foreach ($dataMapBeckend as $item) {
                    $datadenum = DB::table('pelayananpasien_t as pp')
                        ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                        ->select(DB::raw("count('norec') as totaldenum, apd.objectruanganfk"))
                        ->where('apd.objectruanganfk', '=', $itemsatu->id)
                        ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                        ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                        ->whereIn('pp.produkfk', ['5090252', '5090253'])
                        ->where('pp.statusenabled',true)
                        ->where('apd.statusenabled',true)
                        ->groupBy('apd.objectruanganfk')
                        ->get();
        
                        // return($datadenum);
                        // die();
        
                        if(isset($datadenum[0]->totaldenum) && $datadenum[0]->totaldenum!="" && $datadenum[0]->totaldenum!="undefined"){ 
                            $denum = $datadenum[0]->totaldenum;
                        } else {
                            $denum = 0;
                        }
                    // foreach($datadenum as $itemdenum) {
                        $gtData =SasaranMutu::where('departemenfk',$request['idDept'])
                        ->where('tgl',$request['tgl'])
                        ->where('indikatorfk', '=', $item->id)
                        ->where('ruanganfk', '=', $itemsatu->id)
                        ->where('keterangan', '=', 'DENUM')
                        ->get();
                        
                        // return(count($gtData));
                        // die();

                    
                        if(count($gtData) == 0) {
                            $dataDenum = new SasaranMutu();
                            $dataDenum->norec = $dataDenum->generateNewId();
                            $dataDenum->kdprofile = 0;
                            $dataDenum->statusenabled = true;
                            $dataDenum->indikatorfk = $item->id;
                            $dataDenum->tglnilai = $request['tgl'];
                            $dataDenum->tgl = $request['tgl'];
                            $dataDenum->departemenfk = $request['idDept'];
                            $dataDenum->ruanganfk = $itemsatu->id;
                            $dataDenum->nilai = $denum;
                            // if(isset($datadenum[0]->totaldenum) && $datadenum[0]->totaldenum!="" && $datadenum[0]->totaldenum!="undefined"){ 
                            // } else {
                            //     $dataDenum->nilai = 0;
                            // }
                            $dataDenum->num = 0;
                            $dataDenum->denum = 0;
                            $dataDenum->capaian = 1;
                            $dataDenum->keterangan = 'DENUM';
                            $dataDenum->save();
                        } else {
                            
                            // if(isset($datadenum[0]->totaldenum) && $datadenum[0]->totaldenum!="" && $datadenum[0]->totaldenum!="undefined"){ 
                            //     $x = $datadenum[0]->totaldenum;
                            // } else {
                            //     $x = 0;
                            // }

                            $norecDenum = $gtData[0]->norec;
                            $dataDenum = SasaranMutu::where('norec', $norecDenum)
                            ->update([
                                'nilai' => $denum
                            ]);
                        }
                    // }
                    
                    $tglmax =  $request['tgl'] . ' 14:00:00';
                    // return($tglmax);
                    // die();
                    $datanum = DB::table('pelayananpasien_t as pp')
                        ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                        ->select(DB::raw("count('norec') as totalnum, apd.objectruanganfk"))
                        ->where('apd.objectruanganfk', '=', $itemsatu->id)
                        ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                        ->where('pp.tglpelayanan', '<=', $tglmax)
                        ->whereIn('pp.produkfk', ['5090252', '5090253'])
                        ->where('pp.statusenabled',true)
                        ->where('apd.statusenabled',true)
                        ->groupBy('apd.objectruanganfk')
                        ->get();
        
                        // return($datanum);
                        // die();
                        
                        if(isset($datadenum[0]->totaldenum) && $datadenum[0]->totaldenum!="" && $datadenum[0]->totaldenum!="undefined"){ 
                            $num = $datadenum[0]->totaldenum;
                        } else {
                            $num = 0;
                        }

                    // foreach($datanum as $itemnum) {
                        $gtDataNum =SasaranMutu::where('departemenfk',$request['idDept'])
                        ->where('tgl',$request['tgl'])
                        ->where('indikatorfk', '=', $item->id)
                        ->where('ruanganfk', '=', $itemsatu->id)
                        ->where('keterangan', '=', 'NUM')
                        ->get();
                        // return($datanum);
                        // die();
                        if(count($gtDataNum) == 0) {
                            $dataNum = new SasaranMutu();
                            $dataNum->norec = $dataNum->generateNewId();
                            $dataNum->kdprofile = 0;
                            $dataNum->statusenabled = true;
                            $dataNum->indikatorfk = $item->id;
                            $dataNum->tglnilai = $request['tgl'];
                            $dataNum->tgl = $request['tgl'];
                            $dataNum->departemenfk = $request['idDept'];
                            $dataNum->ruanganfk = $itemsatu->id;
                            $dataNum->nilai = $num;
                            $dataNum->num = 0;
                            $dataNum->denum = 0;
                            $dataNum->capaian = 1;
                            $dataNum->keterangan = 'NUM';
                            $dataNum->save();
                        } else {
                            $norecNum = $gtDataNum[0]->norec;
                            $dataNum = SasaranMutu::where('norec', $norecNum)
                            ->update([
                                'nilai' => $num
                            ]);
                        }
                }  
                
                // }
            }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getAngkaPerawatanUlang(Request $request)
    {
        $indikatorfk = 106;
        // $satu = DB::table('pasiendaftar_t as pd')
        //     ->select('pd.objectruanganlastfk')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        //     ->where('pd.tglregistrasi', '>=', $request['tglawal'])
        //     ->where('pd.tglregistrasi', '<=', $request['tglakhir'])
        //     ->where('pd.statusenabled',true)
        //     ->where('ru.objectdepartemenfk', '=', 16)
        //     ->groupBy('pd.objectruanganlastfk')
        //     ->get();

        $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
            ->select('id as objectruanganlastfk', 'namaruangan')
            ->where('statusenabled',true)
            ->get();
            // return($satu);
            // die();
            // ->select(DB::raw("count('pd.objectruanganlastfk') as objectruanganlastfk"))

            foreach($satu as $itemsatu) {

                $num = 0;
                $data = DB::table('pasiendaftar_t as pd')
                    ->select('pd.noregistrasi', 'pd.tglregistrasi', 'pd.nocmfk')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                    ->where('pd.tglregistrasi', '>=', $request['tglawal'])
                    ->where('pd.tglregistrasi', '<=', $request['tglakhir'])
                    ->where('pd.objectruanganlastfk', '=', $itemsatu->objectruanganlastfk)
                    ->where('pd.statusenabled',true)
                    ->where('ru.objectdepartemenfk', '=', 16)
                    ->get();
                    
                    foreach ($data as $item){
                        $tglaw = time(date_format(date_create($item->tglregistrasi),'Y-m-d'));
                        $tglakh = $tglaw - (3600 * 24 * 30);
                        $tglakhir = date("Y-m-d 23:59:59", $tglakh);
        
                        $datanum = DB::table('pasiendaftar_t as pd')
                            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                            ->select('pd.tglregistrasi')
                            ->where('pd.nocmfk', '=', $item->nocmfk)
                            ->where('pd.tglregistrasi', '<=', $item->tglregistrasi)
                            ->where('pd.tglregistrasi', '>=', $tglakhir)
                            ->where('pd.statusenabled',true)
                            ->where('ru.objectdepartemenfk', '=', 16)
                            ->get();
        
                        if(count($datanum) < 1) {
                            $num += 1;
                        }
                    }
        
                    
                $gtData =SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=', $indikatorfk)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganlastfk)
                    // ->where('keterangan', '=', 'DENUM')
                    ->get();
                    
                // return(count($gtData));
                // die();
                if(count($gtData) > 1) {
                    foreach($gtData as $gtItem) {
                        // return($gtItem->keterangan);
                        // die();
                        if($gtItem->keterangan == 'NUM') {
                                $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                                ->update([
                                    'nilai' => $num
                                ]);
                        } else {
                            $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                            ->update([
                                'nilai' => count($data)
                            ]);
        
                        }
                    }
                } else {
                    $dataNum = new SasaranMutu();
                    $dataNum->norec = $dataNum->generateNewId();
                    $dataNum->kdprofile = 0;
                    $dataNum->statusenabled = true;
                    $dataNum->indikatorfk = $indikatorfk;
                    $dataNum->tglnilai = $request['tgl'];
                    $dataNum->tgl = $request['tgl'];
                    $dataNum->departemenfk = $request['idDept'];
                    $dataNum->ruanganfk = $itemsatu->objectruanganlastfk;
                    $dataNum->nilai = $num;
                    $dataNum->num = 0;
                    $dataNum->denum = 0;
                    $dataNum->capaian = 1;
                    $dataNum->keterangan = 'NUM';
                    $dataNum->save();
                    
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $indikatorfk;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganlastfk;
                    $dataDenum->nilai = count($data);
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                }
            }

        $result = array(
            // 'denum' => count($data),
            'indikator' => $indikatorfk,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getKesalahanDiitPasien(Request $request)
    {
        // $satu = OrderPelayanan::where('keteranganlainnya_quo', 'Order Gizi')
        //     ->select('objectruanganfk')
        //     ->where('tglpelayanan', '>=', $request['tglawal'])
        //     ->where('tglpelayanan', '<=', $request['tglakhir'])
        //     ->where('statusenabled',true)
        //     ->groupBy('objectruanganfk')
        //     ->get();

        $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
        ->select('id as objectruanganfk', 'namaruangan')
        ->where('statusenabled',true)
        ->get();
            // return($satu);
            // die();

        // $indikatorfk = 113;
        foreach($satu as $itemsatu){
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','5')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $data0 = OrderPelayanan::where('keteranganlainnya_quo', 'Order Gizi')
                    ->select(DB::raw("count('norec') as totalordergizi"))
                    ->where('objectjeniswaktufk', '=', 0)
                    ->where('tglpelayanan', '>=', $request['tglawal'])
                    ->where('tglpelayanan', '<=', $request['tglakhir'])
                    ->where('statusenabled',true)
                    ->where('objectruanganfk', '=', $itemsatu->objectruanganfk)
                    ->get();
        
                $data1 =OrderPelayanan::where('keteranganlainnya_quo', 'Order Gizi')
                    ->select(DB::raw("count('norec') as totalordergizi"))
                    ->where('objectjeniswaktufk', '=', 1)
                    ->where('tglpelayanan', '>=', $request['tglawal'])
                    ->where('tglpelayanan', '<=', $request['tglakhir'])
                    ->where('statusenabled',true)
                    ->where('objectruanganfk', '=', $itemsatu->objectruanganfk)
                    ->get();
        
                $denum = ($data0[0]->totalordergizi * 2) + ($data1[0]->totalordergizi * 2);
                // return($denum);
                // die();
                
                $gtData =SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=', $item->id)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganfk)
                    ->where('keterangan', '=', 'DENUM')
                    ->get();
                    
                if(count($gtData) == 0) {
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $item->id;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganfk;
                    $dataDenum->nilai = $denum;
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                } else {
                    $norecNum = $gtData[0]->norec;
                    $dataNum = SasaranMutu::where('norec', $norecNum)
                    ->update([
                        'nilai' => $denum
                    ]);
                }
            }
        }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getKejadianReaksiTranfusi(Request $request)
    {
        // $satu = DB::table('pelayananpasien_t as pp')
        //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //     ->select('apd.objectruanganasalfk')
        //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
        //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
        //     ->whereIn('pp.produkfk', [4057110, 4057111, 4057112, 4057113, 4057114, 4057115, 4075585, 4075586, 4075587, 4075588, 4075589, 4075590, 4075591, 4075592, 4075593, 4075594, 4075597, 4075598, 4075599, 4075600])
        //     ->where('apd.statusenabled',true)
        //     ->where('ru.objectdepartemenfk', '=', 71)
        //     ->groupBy('apd.objectruanganasalfk')
        //     ->get();

        $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
        ->select('id as objectruanganasalfk', 'namaruangan')
        ->where('statusenabled',true)
        ->get();
            // return($satu);
            // die();
        
        // $indikatorfk = 112;
        
        foreach($satu as $itemsatu) {
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','1')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $datadenum = DB::table('pelayananpasien_t as pp')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->select(DB::raw("sum(pp.jumlah) as denum"))
                    ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                    ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                    ->whereIn('pp.produkfk', [4057110, 4057111, 4057112, 4057113, 4057114, 4057115, 4075585, 4075586, 4075587, 4075588, 4075589, 4075590, 4075591, 4075592, 4075593, 4075594, 4075597, 4075598, 4075599, 4075600])
                    ->where('apd.objectruanganasalfk', '=', $itemsatu->objectruanganasalfk)
                    ->where('apd.statusenabled',true)
                    ->get();

                    // return($datadenum);
                    // die();
        
                $gtData =SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=', $indikatorfk)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganasalfk)
                    ->where('keterangan', '=', 'DENUM')
                    ->get();
                    
                if(count($gtData) == 0) {
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $indikatorfk;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganasalfk;
                    $dataDenum->nilai = (int)$datadenum[0]->denum;
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                } else {
                    $norecNum = $gtData[0]->norec;
                    $dataNum = SasaranMutu::where('norec', $norecNum)
                    ->update([
                        'nilai' => (int)$datadenum[0]->denum
                    ]);
                }
            }
        }

        $result = array(
            'indikator' => (int)$indikatorfk,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getKetidakLengkapanLaporanAnestesi(Request $request)
    {
        // $satu = DB::table('antrianpasiendiperiksa_t as apd')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //     ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
        //     ->join('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
        //     ->join('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
        //     // ->select('pd.noregistrasi')
        //     ->select('apd.objectruanganasalfk')
        //     // ->where(function($x) {
        //     //     $x->orwhere('ppp.objectjenispetugaspefk', 6);
        //     //     $x->orWhere('ppp.objectjenispetugaspefk', 21);
        //     // })
        //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
        //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
        //     ->where('ppp.objectjenispetugaspefk', 6)
        //     ->where('ru.objectdepartemenfk', 25)
        //     ->where('apd.statusenabled',true)
        //     ->where('pp.statusenabled',true)
        //     ->where('ppp.statusenabled',true)
        //     ->groupBy('apd.objectruanganasalfk')
        //     // ->distinct()
        //     ->get();
            
        $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
        ->select('id as objectruanganasalfk', 'namaruangan')
        ->where('statusenabled',true)
        ->get();

        // $indikatorfk = 110;
        
        foreach($satu as $itemsatu) {
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','6')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $datadenum = DB::table('antrianpasiendiperiksa_t as apd')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                    ->join('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
                    ->join('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
                    // ->select('pd.noregistrasi')
                    ->select('apd.norec')
                    // ->where(function($x) {
                    //     $x->orwhere('ppp.objectjenispetugaspefk', 6);
                    //     $x->orWhere('ppp.objectjenispetugaspefk', 21);
                    // })
                    ->where('apd.objectruanganasalfk', '=', $itemsatu->objectruanganasalfk)
                    ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                    ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                    ->where('ppp.objectjenispetugaspefk', 6)
                    ->where('ru.objectdepartemenfk', 25)
                    ->where('apd.statusenabled',true)
                    ->where('pp.statusenabled',true)
                    ->where('ppp.statusenabled',true)
                    ->groupBy('apd.norec')
                    // ->distinct()
                    ->get();
        
                // return(count($data));
                // die();
        
                
                $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('ruanganfk', '=', $itemsatu->objectruanganasalfk)
                    ->where('indikatorfk', '=', $item->id)
                    ->where('keterangan', '=', 'DENUM')
                    ->get();
                    
                if(count($gtData) == 0) {
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $item->id;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganasalfk;
                    $dataDenum->nilai = count($datadenum);
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                } else {
                    $norecNum = $gtData[0]->norec;
                    $dataNum = SasaranMutu::where('norec', $norecNum)
                    ->update([
                        'nilai' => count($datadenum)
                    ]);
                }
            }
        }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getKetidakLengkapanLaporanOperasi(Request $request)
    {
        // $satu = DB::table('antrianpasiendiperiksa_t as apd')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //     ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
        //     ->join('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
        //     ->join('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
        //     // ->select('pd.noregistrasi')
        //     ->select('apd.objectruanganasalfk')
        //     // ->where(function($x) {
        //     //     $x->orwhere('ppp.objectjenispetugaspefk', 6);
        //     //     $x->orWhere('ppp.objectjenispetugaspefk', 21);
        //     // })
        //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
        //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
        //     // ->where('ppp.objectjenispetugaspefk', 6)
        //     ->where('ru.objectdepartemenfk', 25)
        //     ->where('apd.statusenabled',true)
        //     ->where('pp.statusenabled',true)
        //     ->where('ppp.statusenabled',true)
        //     ->groupBy('apd.objectruanganasalfk')
        //     // ->distinct()
        //     ->get();

            $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
            ->select('id as objectruanganasalfk', 'namaruangan')
            ->where('statusenabled',true)
            ->get();
            // return($satu);
            // die();

        // $indikatorfk = 109;
        
        foreach($satu as $itemsatu) {
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','7')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $datadenum = DB::table('antrianpasiendiperiksa_t as apd')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                    ->join('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
                    ->join('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
                    // ->select('pd.noregistrasi')
                    ->select('apd.norec')
                    // ->where(function($x) {
                    //     $x->orwhere('ppp.objectjenispetugaspefk', 6);
                    //     $x->orWhere('ppp.objectjenispetugaspefk', 21);
                    // })
                    ->where('apd.objectruanganasalfk', '=', $itemsatu->objectruanganasalfk)
                    ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                    ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                    // ->where('ppp.objectjenispetugaspefk', 6)
                    ->where('ru.objectdepartemenfk', 25)
                    ->where('apd.statusenabled',true)
                    ->where('pp.statusenabled',true)
                    ->where('ppp.statusenabled',true)
                    ->groupBy('apd.norec')
                    // ->distinct()
                    ->get();
        
                // return(count($datadenum));
                // die();
        
                
                $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=', $item->id)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganasalfk)
                    ->where('keterangan', '=', 'DENUM')
                    ->get();
                    
                if(count($gtData) == 0) {
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $item->id;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganasalfk;
                    $dataDenum->nilai = count($datadenum);
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                } else {
                    $norecNum = $gtData[0]->norec;
                    $dataNum = SasaranMutu::where('norec', $norecNum)
                    ->update([
                        'nilai' => count($datadenum)
                    ]);
                }
            }
        }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getKejadianPulangAtasPermintaanSendiri(Request $request)
    {
        
        $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
            ->select('id as objectruanganlastfk', 'namaruangan')
            ->where('statusenabled',true)
            ->get();

        // $satu = DB::table('pasiendaftar_t as pd')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        //     ->select('pd.objectruanganlastfk')
        //     ->where('pd.tglpulang', '>=', $request['tglawal'])
        //     ->where('pd.tglpulang', '<=', $request['tglakhir'])
        //     ->where('pd.statusenabled',true)
        //     ->where('ru.objectdepartemenfk', '=', 16)
        //     ->groupBy('pd.objectruanganlastfk')
        //     ->get();

            // return($satu);
            // die();

        // $indikatorfk = 107;

        foreach($satu as $itemsatu) {
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','4')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $num = 0;
                $data = DB::table('pasiendaftar_t as pd')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                    ->select('pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'pd.nocmfk')
                    ->where('pd.tglpulang', '>=', $request['tglawal'])
                    ->where('pd.tglpulang', '<=', $request['tglakhir'])
                    ->where('pd.statusenabled',true)
                    ->where('ru.objectdepartemenfk', '=', 16)
                    ->where('pd.objectruanganlastfk', '=', $itemsatu->objectruanganlastfk)
                    ->get();
                    
                $datanum = DB::table('pasiendaftar_t as pd')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                    ->select('pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'pd.nocmfk')
                    ->where('pd.tglpulang', '>=', $request['tglawal'])
                    ->where('pd.tglpulang', '<=', $request['tglakhir'])
                    ->where('pd.statusenabled',true)
                    ->where('pd.objectstatuspulangfk', '=', 2)
                    ->where('ru.objectdepartemenfk', '=', 16)
                    ->where('pd.objectruanganlastfk', '=', $itemsatu->objectruanganlastfk)
                    ->get();
        
                    
                $gtData =SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=', $item->id)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganlastfk)
                    ->get();
                    
                if(count($gtData) > 1) {
                    foreach($gtData as $gtItem) {
                        // return($gtItem->norec);
                        // die();
                        if($gtItem->keterangan == 'NUM') {
                                $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                                ->update([
                                    'nilai' => count($datanum)
                                ]);
                        } else {
                            $dataDenum = SasaranMutu::where('norec', $gtItem->norec)
                            ->update([
                                'nilai' => count($data)
                            ]);
        
                        }
                    }
                } else {
                    $dataNum = new SasaranMutu();
                    $dataNum->norec = $dataNum->generateNewId();
                    $dataNum->kdprofile = 0;
                    $dataNum->statusenabled = true;
                    $dataNum->indikatorfk = $item->id;
                    $dataNum->tglnilai = $request['tgl'];
                    $dataNum->tgl = $request['tgl'];
                    $dataNum->departemenfk = $request['idDept'];
                    $dataNum->ruanganfk = $itemsatu->objectruanganlastfk;
                    $dataNum->nilai = count($datanum);
                    $dataNum->num = 0;
                    $dataNum->denum = 0;
                    $dataNum->capaian = 1;
                    $dataNum->keterangan = 'NUM';
                    $dataNum->save();
                    
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $item->id;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganlastfk;
                    $dataDenum->nilai = count($data);
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                }
            }
        }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getSisaMakananSiangNonDiit(Request $request)
    {
        // $satu = DB::table('orderpelayanan_t as op')
        //     ->select('op.objectruanganfk')
        //     ->where('op.tglpelayanan', '>=', $request['tglawal'])
        //     ->where('op.tglpelayanan', '<=', $request['tglakhir'])
        //     ->where('op.statusenabled',true)
        //     ->where('op.keteranganlainnya_quo', '=', 'Order Gizi')
        //     ->where('op.objectjeniswaktufk', 1)
        //     ->whereIn('op.objectjenisdietfk', [0,1])
        //     ->whereIn('op.objectjenisdietfk1', [0,1])
        //     ->whereIn('op.objectjenisdietfk2', [0,1])
        //     ->groupBy('op.objectruanganfk')
        //     ->get();
            
        $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
            ->select('id as objectruanganfk', 'namaruangan')
            ->where('statusenabled',true)
            ->get();
        // $indikatorfk = 108;

        foreach($satu as $itemsatu) {
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','8')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $data = DB::table('orderpelayanan_t as op')
                    ->select('op.noregistrasifk', 'op.norec as norec_op')
                    ->where('op.objectruanganfk', '=', $itemsatu->objectruanganfk)
                    ->where('op.tglpelayanan', '>=', $request['tglawal'])
                    ->where('op.tglpelayanan', '<=', $request['tglakhir'])
                    ->where('op.statusenabled',true)
                    ->where('op.keteranganlainnya_quo', '=', 'Order Gizi')
                    ->where('op.objectjeniswaktufk', 1)
                    ->whereIn('op.objectjenisdietfk', [0,1])
                    ->whereIn('op.objectjenisdietfk1', [0,1])
                    ->whereIn('op.objectjenisdietfk2', [0,1])
                    ->get();
                    
                $datanum = DB::table('orderpelayanan_t as op')
                    ->select('op.noregistrasifk', 'op.norec as norec_op')
                    ->where('op.objectruanganfk', '=', $itemsatu->objectruanganfk)
                    ->where('op.tglpelayanan', '>=', $request['tglawal'])
                    ->where('op.tglpelayanan', '<=', $request['tglakhir'])
                    ->where('op.statusenabled',true)
                    ->where('op.keteranganlainnya_quo', '=', 'Order Gizi')
                    ->where('op.objectjeniswaktufk', 1)
                    ->where('op.ispmkp', 0)
                    ->whereIn('op.objectjenisdietfk', [0,1])
                    ->whereIn('op.objectjenisdietfk1', [0,1])
                    ->whereIn('op.objectjenisdietfk2', [0,1])
                    ->get();
                    
                $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=', $item->id)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganfk)
                    ->get();
                    
                if(count($gtData) > 1) {
                    foreach($gtData as $gtItem) {
                        if($gtItem->keterangan == 'NUM') {
                                $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                                ->update([
                                    'nilai' => count($datanum)
                                ]);
                        } else {
                            $dataDenum = SasaranMutu::where('norec', $gtItem->norec)
                            ->update([
                                'nilai' => count($data)
                            ]);
                        }
                    }
                } else {
                    $dataNum = new SasaranMutu();
                    $dataNum->norec = $dataNum->generateNewId();
                    $dataNum->kdprofile = 0;
                    $dataNum->statusenabled = true;
                    $dataNum->indikatorfk = $item->id;
                    $dataNum->tglnilai = $request['tgl'];
                    $dataNum->tgl = $request['tgl'];
                    $dataNum->departemenfk = $request['idDept'];
                    $dataNum->ruanganfk = $itemsatu->objectruanganfk;
                    $dataNum->nilai = count($datanum);
                    $dataNum->num = 0;
                    $dataNum->denum = 0;
                    $dataNum->capaian = 1;
                    $dataNum->keterangan = 'NUM';
                    $dataNum->save();
                    
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $item->id;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganfk;
                    $dataDenum->nilai = count($data);
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                }
            }
        }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getProporsiPasienTBParuTerkonfirmasiBakteriologis(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minutes
        // $satu = DB::table('pelayananpasien_t as pp')
        //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
        //     ->select('apd.objectruanganasalfk')
        //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
        //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
        //     ->where('apd.statusenabled',true)
        //     ->where('pp.statusenabled',true)
        //     ->where('ru.objectdepartemenfk', '=', 16)
        //     ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
        //     ->groupBy('apd.objectruanganasalfk')
        //     ->get();

            $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
                ->select('id as objectruanganasalfk', 'namaruangan')
                ->where('statusenabled',true)
                ->get();
            // return($satu);
            // die();
        // $indikatorfk = 105;

        foreach($satu as $itemsatu) {
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','1')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $data = DB::table('pelayananpasien_t as pp')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
                    ->select('pp.norec')
                    ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
                    ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                    ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                    ->where('apd.statusenabled',true)
                    ->where('pp.statusenabled',true)
                    ->where('ru.objectdepartemenfk', '=', 16)
                    ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
                    ->groupBy('pp.norec')
                    ->get();
                    
                $datanum = DB::table('pelayananpasien_t as pp')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
                    ->join('hasillaboratorium_t as hl', 'hl.norecpelayanan', '=', 'pp.norec')
                    ->select('pp.norec')
                    ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
                    ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                    ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                    ->where('apd.statusenabled',true)
                    ->where('pp.statusenabled',true)
                    ->where('ru.objectdepartemenfk', '=', 16)
                    ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
                    ->where('hl.flag', 'Y')
                    ->groupBy('pp.norec')
                    // ->distinct()
                    ->get();
                    
                $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=', $item->id)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganasalfk)
                    ->get();
                    
                if(count($gtData) > 1) {
                    foreach($gtData as $gtItem) {
                        if($gtItem->keterangan == 'NUM') {
                                $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                                ->update([
                                    'nilai' => count($datanum)
                                ]);
                        } else {
                            $dataDenum = SasaranMutu::where('norec', $gtItem->norec)
                            ->update([
                                'nilai' => count($data)
                            ]);
                        }
                    }
                } else {
                    $dataNum = new SasaranMutu();
                    $dataNum->norec = $dataNum->generateNewId();
                    $dataNum->kdprofile = 0;
                    $dataNum->statusenabled = true;
                    $dataNum->indikatorfk = $item->id;
                    $dataNum->tglnilai = $request['tgl'];
                    $dataNum->tgl = $request['tgl'];
                    $dataNum->departemenfk = $request['idDept'];
                    $dataNum->ruanganfk = $itemsatu->objectruanganasalfk;
                    $dataNum->nilai = count($datanum);
                    $dataNum->num = 0;
                    $dataNum->denum = 0;
                    $dataNum->capaian = 1;
                    $dataNum->keterangan = 'NUM';
                    $dataNum->save();
                    
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $item->id;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganasalfk;
                    $dataDenum->nilai = count($data);
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                }
            }
        }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getIADP(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minutes

            $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
                ->select('id as objectruanganasalfk', 'namaruangan')
                ->where('statusenabled',true)
                ->get();
            // return($satu);
            // die();
        $indikatorfk = 92;

        foreach($satu as $itemsatu) {
            $data = DB::table('pelayananpasien_t as pp')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
                ->select('pp.norec')
                ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
                ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                ->where('apd.statusenabled',true)
                ->where('pp.statusenabled',true)
                ->where('ru.objectdepartemenfk', '=', 16)
                ->whereIn('pp.produkfk', [4057120, 4057121, 4057122, 4057123, 4057124, 4057125, 4057126, 4057127, 4074774])
                ->groupBy('pp.norec')
                ->get();
                
            $datanum = DB::table('pelayananpasien_t as pp')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
                ->join('hasillaboratorium_t as hl', 'hl.norecpelayanan', '=', 'pp.norec')
                ->select('pp.norec')
                ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
                ->where('pp.tglpelayanan', '>=', $request['tglawal'])
                ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
                ->where('apd.statusenabled',true)
                ->where('pp.statusenabled',true)
                ->where('ru.objectdepartemenfk', '=', 16)
                ->whereIn('pp.produkfk', [4057120, 4057121, 4057122, 4057123, 4057124, 4057125, 4057126, 4057127, 4074774])
                ->where('hl.flag', 'Y')
                ->groupBy('pp.norec')
                // ->distinct()
                ->get();
                
            $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                ->where('tgl',$request['tgl'])
                ->where('indikatorfk', '=', $indikatorfk)
                ->where('ruanganfk', '=', $itemsatu->objectruanganasalfk)
                ->get();
                
            if(count($gtData) > 1) {
                foreach($gtData as $gtItem) {
                    if($gtItem->keterangan == 'NUM') {
                            $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                            ->update([
                                'nilai' => count($datanum)
                            ]);
                    } else {
                        $dataDenum = SasaranMutu::where('norec', $gtItem->norec)
                        ->update([
                            'nilai' => count($data)
                        ]);
                    }
                }
            } else {
                $dataNum = new SasaranMutu();
                $dataNum->norec = $dataNum->generateNewId();
                $dataNum->kdprofile = 0;
                $dataNum->statusenabled = true;
                $dataNum->indikatorfk = $indikatorfk;
                $dataNum->tglnilai = $request['tgl'];
                $dataNum->tgl = $request['tgl'];
                $dataNum->departemenfk = $request['idDept'];
                $dataNum->ruanganfk = $itemsatu->objectruanganasalfk;
                $dataNum->nilai = count($datanum);
                $dataNum->num = 0;
                $dataNum->denum = 0;
                $dataNum->capaian = 1;
                $dataNum->keterangan = 'NUM';
                $dataNum->save();
                
                $dataDenum = new SasaranMutu();
                $dataDenum->norec = $dataDenum->generateNewId();
                $dataDenum->kdprofile = 0;
                $dataDenum->statusenabled = true;
                $dataDenum->indikatorfk = $indikatorfk;
                $dataDenum->tglnilai = $request['tgl'];
                $dataDenum->tgl = $request['tgl'];
                $dataDenum->departemenfk = $request['idDept'];
                $dataDenum->ruanganfk = $itemsatu->objectruanganasalfk;
                $dataDenum->nilai = count($data);
                $dataDenum->num = 0;
                $dataDenum->denum = 0;
                $dataDenum->capaian = 1;
                $dataDenum->keterangan = 'DENUM';
                $dataDenum->save();
            }
        }

        $result = array(
            'indikator' => $indikatorfk,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getHapAndDekubitus(Request $request)
    {
        // ini_set('max_execution_time', 500); //6 minutes
        // $satu = DB::table('pelayananpasien_t as pp')

        $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
            ->select('id as objectruanganasalfk', 'namaruangan')
            ->where('statusenabled',true)
            ->get();
        $indikatorfk = $request['indikator'];

        foreach($satu as $itemsatu) {
            $data = DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi')
                ->where('pd.objectruanganlastfk' , '=', $itemsatu->objectruanganasalfk)
                ->where('pd.tglpulang', '>=', $request['tglawal'])
                ->where('pd.tglpulang', '<=', $request['tglakhir'])
                ->where('pd.statusenabled',true)
                ->get();

                
            if($indikatorfk == 94) {
                $datanum = DB::table('pasiendaftar_t as pd')
                    ->select('pd.noregistrasi')
                    ->where('pd.objectruanganlastfk' , '=', $itemsatu->objectruanganasalfk)
                    ->where('pd.tglpulang', '>=', $request['tglawal'])
                    ->where('pd.tglpulang', '<=', $request['tglakhir'])
                    ->where('pd.statusenabled',true)
                    ->where('pd.ishap',true)
                    ->get();
            } else {
                $datanum = DB::table('pasiendaftar_t as pd')
                    ->select('pd.noregistrasi')
                    ->where('pd.objectruanganlastfk' , '=', $itemsatu->objectruanganasalfk)
                    ->where('pd.tglpulang', '>=', $request['tglawal'])
                    ->where('pd.tglpulang', '<=', $request['tglakhir'])
                    ->where('pd.statusenabled',true)
                    ->where('pd.isdekubitus',true)
                    ->get();
            }

            // $data = DB::table('pelayananpasien_t as pp')
            //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            //     ->select('pp.norec')
            //     ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
            //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
            //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
            //     ->where('apd.statusenabled',true)
            //     ->where('pp.statusenabled',true)
            //     ->where('ru.objectdepartemenfk', '=', 16)
            //     ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
            //     ->groupBy('pp.norec')
            //     ->get();
                
            // $datanum = DB::table('pelayananpasien_t as pp')
            //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            //     ->join('hasillaboratorium_t as hl', 'hl.norecpelayanan', '=', 'pp.norec')
            //     ->select('pp.norec')
            //     ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
            //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
            //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
            //     ->where('apd.statusenabled',true)
            //     ->where('pp.statusenabled',true)
            //     ->where('ru.objectdepartemenfk', '=', 16)
            //     ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
            //     ->where('hl.flag', 'Y')
            //     ->groupBy('pp.norec')
            //     // ->distinct()
            //     ->get();
                
            $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                ->where('tgl',$request['tgl'])
                ->where('indikatorfk', '=', $indikatorfk)
                ->where('ruanganfk', '=', $itemsatu->objectruanganasalfk)
                ->get();
                
            if(count($gtData) > 1) {
                foreach($gtData as $gtItem) {
                    if($gtItem->keterangan == 'NUM') {
                            $dataNum = SasaranMutu::where('norec', $gtItem->norec)
                            ->update([
                                'nilai' => count($datanum)
                            ]);
                    } else {
                        $dataDenum = SasaranMutu::where('norec', $gtItem->norec)
                        ->update([
                            'nilai' => count($data)
                        ]);
                    }
                }
            } else {
                $dataNum = new SasaranMutu();
                $dataNum->norec = $dataNum->generateNewId();
                $dataNum->kdprofile = 0;
                $dataNum->statusenabled = true;
                $dataNum->indikatorfk = $indikatorfk;
                $dataNum->tglnilai = $request['tgl'];
                $dataNum->tgl = $request['tgl'];
                $dataNum->departemenfk = $request['idDept'];
                $dataNum->ruanganfk = $itemsatu->objectruanganasalfk;
                $dataNum->nilai = count($datanum);
                $dataNum->num = 0;
                $dataNum->denum = 0;
                $dataNum->capaian = 1;
                $dataNum->keterangan = 'NUM';
                $dataNum->save();
                
                $dataDenum = new SasaranMutu();
                $dataDenum->norec = $dataDenum->generateNewId();
                $dataDenum->kdprofile = 0;
                $dataDenum->statusenabled = true;
                $dataDenum->indikatorfk = $indikatorfk;
                $dataDenum->tglnilai = $request['tgl'];
                $dataDenum->tgl = $request['tgl'];
                $dataDenum->departemenfk = $request['idDept'];
                $dataDenum->ruanganfk = $itemsatu->objectruanganasalfk;
                $dataDenum->nilai = count($data);
                $dataDenum->num = 0;
                $dataDenum->denum = 0;
                $dataDenum->capaian = 1;
                $dataDenum->keterangan = 'DENUM';
                $dataDenum->save();
            }
        }

        $result = array(
            'indikator' => $indikatorfk,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    
    public function getIndikatorManual(Request $request)
    {
        // $satu = DB::table('pelayananpasien_t as pp')
        //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
        //     ->select('apd.objectruanganasalfk')
        //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
        //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
        //     ->where('apd.statusenabled',true)
        //     ->where('pp.statusenabled',true)
        //     ->where('ru.objectdepartemenfk', '=', 16)
        //     ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
        //     ->groupBy('apd.objectruanganasalfk')
        //     ->get();

            $satu = Ruangan::where('objectdepartemenfk', $request['idDept'])
                ->select('id as objectruanganlastfk', 'namaruangan')
                ->where('statusenabled',true)
                ->get();
            // return($satu);
            // die();
        $indikatorfk = 105;

        foreach($satu as $itemsatu) {
            // $data = DB::table('pelayananpasien_t as pp')
            //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            //     ->select('pp.norec')
            //     ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
            //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
            //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
            //     ->where('apd.statusenabled',true)
            //     ->where('pp.statusenabled',true)
            //     ->where('ru.objectdepartemenfk', '=', 16)
            //     ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
            //     ->groupBy('pp.norec')
            //     ->get();
                
            // $datanum = DB::table('pelayananpasien_t as pp')
            //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            //     ->join('hasillaboratorium_t as hl', 'hl.norecpelayanan', '=', 'pp.norec')
            //     ->select('pp.norec')
            //     ->where('apd.objectruanganasalfk' , '=', $itemsatu->objectruanganasalfk)
            //     ->where('pp.tglpelayanan', '>=', $request['tglawal'])
            //     ->where('pp.tglpelayanan', '<=', $request['tglakhir'])
            //     ->where('apd.statusenabled',true)
            //     ->where('pp.statusenabled',true)
            //     ->where('ru.objectdepartemenfk', '=', 16)
            //     ->whereIn('pp.produkfk', [4056819, 4041421, 4056812, 4056813])
            //     ->where('hl.flag', 'Y')
            //     ->groupBy('pp.norec')
            //     // ->distinct()
            //     ->get();
            $dataMapBeckend = \DB::table('indikatorrensar_m as ru')
                ->where('ru.statusenabled', true)
                ->where('ru.objectjenisbeckendindikatorfk', '=','1')
                ->orderBy('ru.namaexternal')
                ->get();
            foreach ($dataMapBeckend as $item) {
                $gtData = SasaranMutu::where('departemenfk',$request['idDept'])
                    ->where('tgl',$request['tgl'])
                    ->where('indikatorfk', '=',  $item->id)
                    ->where('ruanganfk', '=', $itemsatu->objectruanganlastfk)
                    ->get();

                if(count($gtData) > 1) {
              
                } else {
                    $dataNum = new SasaranMutu();
                    $dataNum->norec = $dataNum->generateNewId();
                    $dataNum->kdprofile = 0;
                    $dataNum->statusenabled = true;
                    $dataNum->indikatorfk = $item->id;
                    $dataNum->tglnilai = $request['tgl'];
                    $dataNum->tgl = $request['tgl'];
                    $dataNum->departemenfk = $request['idDept'];
                    $dataNum->ruanganfk = $itemsatu->objectruanganlastfk;
                    $dataNum->nilai = 0;
                    $dataNum->num = 0;
                    $dataNum->denum = 0;
                    $dataNum->capaian = 1;
                    $dataNum->keterangan = 'NUM';
                    $dataNum->save();
                    
                    $dataDenum = new SasaranMutu();
                    $dataDenum->norec = $dataDenum->generateNewId();
                    $dataDenum->kdprofile = 0;
                    $dataDenum->statusenabled = true;
                    $dataDenum->indikatorfk = $item->id;
                    $dataDenum->tglnilai = $request['tgl'];
                    $dataDenum->tgl = $request['tgl'];
                    $dataDenum->departemenfk = $request['idDept'];
                    $dataDenum->ruanganfk = $itemsatu->objectruanganlastfk;
                    $dataDenum->nilai = 0;
                    $dataDenum->num = 0;
                    $dataDenum->denum = 0;
                    $dataDenum->capaian = 1;
                    $dataDenum->keterangan = 'DENUM';
                    $dataDenum->save();
                }
            }
                
            
                
            
        }

        $result = array(
            'indikator' => 'map',
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataSasaranMutu(Request $request){

        $data = \DB::table('sasaranmutu_t as sm')
            ->join('indikatorrensar_m as ir','ir.id','=','sm.indikatorfk')
            ->select(DB::raw("sm.tglnilai,sm.tgl,sm.nilai,sm.num,sm.denum,sm.capaian,sm.keterangan,ir.indikator,ir.denominator,ir.numerator"))
            ->where('ir.statusenabled', true);
//            ->orderByRaw('pg.namalengkap,pjk.tgljadwal desc');

        if(isset($request['bulan']) &&
            $request['bulan']!="" &&
            $request['bulan']!="undefined"){
            $tgl = $request['bulan']  ;
            $data = $data->whereRaw("STUFF(CONVERT(varchar(10), sm.tglnilai,104),1,3,'')  ='$tgl' " );
        };
//        if(isset($request['namalengkap']) &&
//            $request['namalengkap']!="" &&
//            $request['namalengkap']!="undefined"){
//            $data = $data->where('ei.objectpegawaifk','=',$request['namalengkap']);
//        };
        if(isset($request['idDept']) &&
            $request['idDept']!="" &&
            $request['idDept']!="undefined"){
            $data = $data->where('sm.departemenfk','=', $request['idDept'] );
        };
        $data = $data->distinct();
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDataSasaranMutuPMKP(Request $request){

        $data = \DB::table('sasaranmutu_t as sm')
            ->join('indikatorrensar_m as ir','ir.id','=','sm.indikatorfk')
            ->select(DB::raw("sm.tglnilai,sm.tgl,sm.nilai,sm.num,sm.denum,sm.capaian,sm.keterangan,ir.indikator,ir.denominator,ir.numerator"))
            ->where('ir.statusenabled', true);
//            ->orderByRaw('pg.namalengkap,pjk.tgljadwal desc');

        if(isset($request['bulan']) &&
            $request['bulan']!="" &&
            $request['bulan']!="undefined"){
            $tgl = $request['bulan']  ;
            $data = $data->whereRaw("STUFF(CONVERT(varchar(10), sm.tglnilai,104),1,3,'')  ='$tgl' " );
        };
//        if(isset($request['namalengkap']) &&
//            $request['namalengkap']!="" &&
//            $request['namalengkap']!="undefined"){
//            $data = $data->where('ei.objectpegawaifk','=',$request['namalengkap']);
//        };
        if(isset($request['idDept']) &&
            $request['idDept']!="" &&
            $request['idDept']!="undefined"){
            $data = $data->where('sm.departemenfk','=', $request['idDept'] );
        };
        $data = $data->distinct();
        $data = $data->get();
        return $this->respond($data);
    }

    public function saveLembarKerjaInvestigasi(Request $request) {
        \DB::beginTransaction();
        try {
                if ($request['data']['norec'] == '') {
                    $data = new LembarKerjaInvestigasi();
                    $data->norec = $data->generateNewId();
                    $data->kdprofile = 0;
                    $data->statusenabled = true;
                } else {
                    $data = LembarKerjaInvestigasi::where('norec', $request['data']['norec'])->first();
                }
                    if (isset( $request['data']['insidenfk'])){
                        $data->laporaninsidenfk = $request['data']['insidenfk'];
                    }
                     $data->penyebabinsidenlangsung =  $request['data']['penyebabinsidenlangsung'];
                     $data->latarbelakanginsiden =  $request['data']['latarbelakanginsiden'];
                     $data->rekomendasi =  $request['data']['rekomendasi'];
                     $data-> penanggungjawabfk =  $request['data']['penanggungjawabfk'];
                     $data->tanggalrekomendasi =  $request['data']['tanggalrekomendasi'];
                     $data->tindakan =  $request['data']['tindakan'];
                     $data->pegawaifk =  $request['data']['pegawaifk'];
                     $data->namakepalafk =  $request['data']['namakepalafk'];
                     $data->tanggalmulai =  $request['data']['tanggalmulai'];
                     $data->tanggalakhir =  $request['data']['tanggalakhir'];
                     $data->tanggaltindakan =  $request['data']['tanggaltindakan'];
                     $data->investigasilengkap =  $request['data']['investigasilengkap'];
                     $data->investigasilanjutan =  $request['data']['investigasilanjutan'];
                     $data->regrading =  $request['data']['regrading'];
                     $data->regradingfk =  $request['data']['regradingfk'];
                     $data->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function GetDaftarLembarInvestigasiSederhana(Request $request) {
        $data = \DB::table('lembarkerjainvestigasi_t as lki')
            ->JOIN('laporaninsideninternal_t as lii','lii.norec','=','lki.laporaninsidenfk')
            ->LEFTJOIN ('pegawai_m as pg','pg.id', '=','lki.penanggungjawabfk')
            ->LEFTJOIN ('pegawai_m as pg1','pg1.id','=','lki.pegawaifk')
            ->LEFTJOIN ('insidenkeselamatan_m as ik','ik.id', '=','lki.insidenkeselamatanfk')
            ->LEFTJOIN ('jeniskeselamatan_m as jkn','jkn.id', '=','ik.jeniskesalamatanfk')
            ->select(DB::raw("lki.*,pg.namalengkap as penanggungjawab, pg1.namalengkap as pegawai,ik.namakeselamatan as keselamatan,
                                     ik.jeniskesalamatanfk,jkn.jeniskeselamatan"));

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('lki.tanggalmulai', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('lki.tanggalmulai', '<=', $request['tglAkhir']);
        }
        if (isset($request['Norec']) && $request['Norec'] != "" && $request['Norec'] != "undefined") {
            $data = $data->where('lki.norec', '=', $request['Norec']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('lii.ruanganfk', '<=', $request['idRuangan']);
        }
        if (isset($request['idPelapor']) && $request['idPelapor'] != "" && $request['idPelapor'] != "undefined") {
            $data = $data->where('lii.pembuatlaporanfk', '=', $request['idPelapor']);
        }

        $data = $data->where('lki.statusenabled', 1);
        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function  hapusDataLembarInvestigasi (Request $request){
        DB::beginTransaction();
        try {
            $data = LembarKerjaInvestigasi::where('norec',$request['norec'])->update([
                'statusenabled' => 0
            ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveLaporanInsidenInternal(Request $request) {
        \DB::beginTransaction();
        try {
            if ($request['data']['norec'] == '') {
                $data = new LaporanInsidenInternal();
                $data->norec = $data->generateNewId();
                $data->kdprofile = 0;
                $data->statusenabled = true;
            } else {
                $data = LaporanInsidenInternal::where('norec', $request['data']['norec'])->first();
            }
                $data->nocm = $request['data']['nocm'];
                $data->namapasien = $request['data']['namapasien'];
                $data->tglahir = $request['data']['tglahir'];
                $data->ruanganfk = $request['data']['ruanganfk'];
                $data->umur = $request['data']['umur'];
                $data->jeniskelaminfk = $request['data']['jeniskelaminfk'];
                $data->penanggungbiayapasienfk = $request['data']['penanggungbiayapasienfk'];
                $data->tglmasuk = $request['data']['tglmasuk'];
                $data->tglinsiden = $request['data']['tglinsiden'];
                $data->insiden = $request['data']['insiden'];
                $data->kronologisinsiden = $request['data']['kronologisinsiden'];
                $data->jenisinsiden = $request['data']['jenisinsiden'];
                $data->pelaporinsiden = $request['data']['pelaporinsiden'];
                $data->insidenpenyangkut = $request['data']['insidenpenyangkut'];
                $data->tempatinsiden = $request['data']['tempatinsiden'];
                $data->insidenterjadipada = $request['data']['insidenterjadipada'];
                $data->insidenterjadi = $request['data']['insidenterjadi'];
                $data->jiwa = $request['data']['jiwa'];
                $data->unitterkait = $request['data']['unitterkait'];
                $data->akibatinsiden = $request['data']['akibatinsiden'];
                $data->penanganan = $request['data']['penanganan'];
                $data->dilakukanoleh = $request['data']['dilakukanoleh'];
                $data->kejadiansama = $request['data']['kejadiansama'];
                $data->langkahpenanganan = $request['data']['langkahpenanganan'];
                $data->pembuatlaporan = $request['data']['pembuatlaporan'];
                $data->tgllapor = $request['data']['tgllapor'];
                $data->penerimalaporan = $request['data']['penerimalaporan'];
                $data->tglterima = $request['data']['tglterima'];
                $data->grading = $request['data']['grading'];
                $data->insidenkeselamatanfk = $request['data']['insidenkeselamatanfk'];
                $data->noregistrasifk = $request['data']['noregistrasifk'];
                $data->lain5 = $request['data']['lain5'];
                $data->lain6 = $request['data']['lain6'];
                $data->lain7 = $request['data']['lain7'];
                $data->lain9 = $request['data']['lain9'];
                $data->tim13 = $request['data']['tim13'];
                $data->petugas13 = $request['data']['petugas13'];
                $data->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                "res" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function  hapusDataLaporanInsidenInternal (Request $request){
        DB::beginTransaction();
        try {
            $data = LaporanInsidenInternal::where('norec',$request['norec'])->update([
                'statusenabled' => 0
            ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function GetDaftarLaporanInsidenInternal(Request $request) {
        $data = \DB::table('laporaninsideninternal_t as lki')
            ->LEFTJOIN ('ruangan_m as ru','ru.id', '=','lki.ruanganfk')
            ->LEFTJOIN ('kelompokpasien_m as kp','kp.id', '=','lki.penanggungbiayapasienfk')
            ->LEFTJOIN ('jeniskelamin_m as jk','jk.id', '=','lki.jeniskelaminfk')
            ->LEFTJOIN ('lembarkerjainvestigasi_t as lk','lk.laporaninsidenfk', '=','lki.norec')
            ->LEFTJOIN ('insidenkeselamatan_m as ik','ik.id', '=','lki.insidenkeselamatanfk')
            ->LEFTJOIN ('jeniskeselamatan_m as jkn','jkn.id', '=','ik.jeniskesalamatanfk')
            ->LEFTJOIN ('lembarkerjainvestigasi_t AS lkt','lkt.laporaninsidenfk','=','lki.norec')
            ->select(DB::raw("lki.*,ru.namaruangan,kp.kelompokpasien,lk.norec as lk_norec,ik.namakeselamatan as keselamatan,
                                     ik.jeniskesalamatanfk,jkn.jeniskeselamatan,lkt.norec as norec_lk,jk.jeniskelamin"));

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('lki.tglinsiden', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('lki.tglinsiden', '<=', $request['tglAkhir']);
        }
        if (isset($request['Norec']) && $request['Norec'] != "" && $request['Norec'] != "undefined") {
            $data = $data->where('lki.norec', '=', $request['Norec']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('lki.ruanganfk', '=', $request['idRuangan']);
        }
        if (isset($request['idPelapor']) && $request['idPelapor'] != "" && $request['idPelapor'] != "undefined") {
            $data = $data->where('lki.pembuatlaporanfk', '=', $request['idPelapor']);
        }

        $data = $data->where('lki.statusenabled', true);
        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function saveInsidenKeselamatan(Request $request) {
        \DB::beginTransaction();
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try {
            if ($request['norec'] == '') {
                $data = new InsidenKeselamatanPasien();
                $data->norec = $data->generateNewId();
                $data->kdprofile = 0;
                $data->statusenabled = true;
            } else {
                $data = InsidenKeselamatanPasien::where('norec', $request['norec'])->first();
            }
            $data->tanggal = $request['tanggal'];
            $data->departemenfk = $request['departemenfk'];
            $data->keselamatanfk = $request['keselamatanfk'];
            $data->pegawaifk = $dataPegawai->objectpegawaifk;
            $data->jumlah = $request['jumlah'];
            $data->tgl = $request['tgl'];
            $data->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function  hapusInsidenKeselamatan (Request $request){
        DB::beginTransaction();
        try {
            $data = InsidenKeselamatanPasien::where('norec',$request['norec'])->update([
                'statusenabled' => 0
            ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function GetDaftarInsidenKeselamatanPasien(Request $request) {
        $data = \DB::table('insidenkeselamatanpasien_t as lki')
            ->LEFTJOIN ('insidenkeselamatan_m as ik','ik.id', '=','lki.keselamatanfk')
            ->LEFTJOIN ('jeniskeselamatan_m as jk','jk.id', '=','ik.jeniskesalamatanfk')
            ->LEFTJOIN ('departemen_m as dept','dept.id', '=','lki.departemenfk')
            ->select(DB::raw("lki.*, dept.namadepartemen as departemen, ik.namakeselamatan as keselamatan,ik.jeniskesalamatanfk,jk.jeniskeselamatan,DATENAME(month, lki.tanggal) as bulan"));

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('lki.tanggal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('lki.tanggal', '<=', $request['tglAkhir']);
        }
        if (isset($request['idJenisKeselamatan']) && $request['idJenisKeselamatan'] != "" && $request['idJenisKeselamatan'] != "undefined") {
            $data = $data->where('ik.jeniskesalamatanfk', '=', $request['idJenisKeselamatan']);
        }
        if (isset($request['idKeselamatan']) && $request['idKeselamatan'] != "" && $request['idKeselamatan'] != "undefined") {
            $data = $data->where('lki.keselamatanfk', '=', $request['idKeselamatan']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('lki.departemenfk', '=', $request['idDept']);
        }
        if(isset($request['bulan']) &&
            $request['bulan']!="" &&
            $request['bulan']!="undefined"){
            $tgl = $request['bulan']  ;
            $data = $data->whereRaw("STUFF(CONVERT(varchar(10), lki.tanggal,104),1,3,'')  ='$tgl' " );
        };

        $data = $data->where('lki.statusenabled', true);
        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataRekapSasaranMutu(Request $request){
        $Bulan = $request['tahun'];
        $idDept = $request['idDept'];

        $data = DB::select(DB::raw("SELECT x.bulan,x.indikator,x.target,SUM(x.num) as numerator,SUM(x.denum) as denumerator,((SUM(x.num) / SUM(x.denum))* 100) / 100 as capaian
                FROM (SELECT DISTINCT
                    sm.tglnilai,sm.tgl,CASE WHEN sm.keterangan = 'DENUM' THEN CAST(sm.nilai AS int) ELSE 0 END AS denum,
                    CASE WHEN sm.keterangan = 'NUM' THEN CAST(sm.nilai AS int) ELSE 0 END AS num,
                    CASE WHEN ir.targetpencapaian IS NULL THEN 0 ELSE ir.targetpencapaian END AS target,
                    CAST(sm.capaian AS int) as capaian,sm.keterangan,
                    ir.indikator,ir.denominator,ir.numerator,DATENAME(month, sm.tgl) as bulan
                FROM
                    [sasaranmutu_t] AS [sm]
                INNER JOIN [indikatorrensar_m] AS [ir] ON [ir].[id] = [sm].[indikatorfk]
                WHERE
                    [ir].[statusenabled] = 1
                AND YEAR(sm.tglnilai) = $Bulan
                AND [sm].[departemenfk] = $idDept) as x
                GROUP BY x.bulan,x.indikator,x.target"));
        $dataAnalisa = DB::select(DB::raw("SELECT ass.norec,ass.departemenfk,ass.tahun,ass.analisa,ass.tindaklanjut
                       FROM analisasasaranmutu_t AS ass
                       INNER JOIN departemen_m as dept on dept.id = ass.departemenfk
                       WHERE ass.tahun = $Bulan and ass.departemenfk = $idDept"));
        $result= array(
            'data' => $data,
            'analisa' => $dataAnalisa,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function saveAnalisaSasaranMutu(Request $request) {
        \DB::beginTransaction();
        try {
                if ($request['norec'] == '') {
                    $dataJadwal = new AnalisaSasaranMutu();
                    $dataJadwal->norec = $dataJadwal->generateNewId();
                    $dataJadwal->kdprofile = 0;
                    $dataJadwal->statusenabled = true;
                } else {
                    $dataJadwal = AnalisaSasaranMutu::where('norec', $request['norec'])->first();
                }
                $dataJadwal->departemenfk = $request['departemenfk'];
                $dataJadwal->tahun = $request['tahun'];
                $dataJadwal->analisa = $request['analisa'];
                $dataJadwal->tindaklanjut = $request['tindaklanjut'];
                $dataJadwal->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataPasienRegistrasi(Request $request){
        $dataNorec = $request['Norec'];

        $data = DB::select(DB::raw("SELECT pm.nocm,pd.noregistrasi,pm.namapasien,pm.tgllahir,ru.id,ru.namaruangan,
                pm.objectjeniskelaminfk,jk.jeniskelamin,pd.objectkelompokpasienlastfk,kp.kelompokpasien,pd.tglregistrasi
                FROM pasiendaftar_t as pd 
                INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                WHERE pd.norec = :norec"),
            array(
                'norec' => $request['Norec'],
            ));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function saveIdentifikasiRisiko(Request $request) {
        \DB::beginTransaction();
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try {
                if ($request['norec'] == '') {
                    $data = new IdentifikasiRisiko();
                    $data->norec = $data->generateNewId();
                    $data->kdprofile = 0;
                    $data->statusenabled = true;
                } else {
                    $data = IdentifikasiRisiko::where('norec', $request['norec'])->first();
                    $dataD = IdentifikasiRisikoDetail::where('identifikasirisikofk',$request['norec'])->delete();
                }
                    $data->departemenfk = $request['departemenfk'];
                    $data->kategoririsikofk = $request['kategoririsikofk'];
                    $data->kainstalasifk = $request['instalasi'];
                    $data->kepalabidangfk = $request['kplabidang'];
                    $data->direkturfk = $request['direktur'];
                    $data->pegawaifk = $dataPegawai->objectpegawaifk;
                    $data->tanggal = $request['tanggal'];
                    $data->save();
                    $dataNorec = $data->norec;

            foreach ($request['details'] as $item) {
                $dataOP = new IdentifikasiRisikoDetail();
                $dataOP->norec = $dataOP->generateNewId();
                $dataOP->kdprofile = 0;
                $dataOP->statusenabled = true;
                $dataOP->jenisrisiko = $item['jenisrisiko'];
                $dataOP->identifikasirisikofk = $dataNorec;
                $dataOP->keparahan = $item['keparahan'];
                $dataOP->kemungkinan = $item['kemungkinan'];
                $dataOP->skor = $item['skor'];
                $dataOP->rangkingrisiko = $item['rangkingrisiko'];
                $dataOP->pengendalian = $item['pengendalian'];
                $dataOP->rangkingaction = $item['rangkingaction'];
                $dataOP->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function GetDaftarLaporanIdentifikasiRisiko(Request $request) {
        $data = \DB::table('identifikasirisiko_t as ir')
            ->LEFTJOIN ('kategoryrisiko_m as kr','kr.id', '=','ir.kategoririsikofk')
            ->LEFTJOIN ('departemen_m as dept','dept.id', '=','ir.departemenfk')
            ->LEFTJOIN ('pegawai_m as pg','pg.id', '=','ir.kainstalasifk')
            ->LEFTJOIN ('pegawai_m as pg1','pg1.id', '=','ir.kepalabidangfk')
            ->LEFTJOIN ('pegawai_m as pg2','pg2.id', '=','ir.direkturfk')
            ->SELECT(DB::raw("ir.*,dept.namadepartemen,kr.kategoryrisiko,pg.namalengkap as kainstalasi,
                                     pg1.namalengkap as kabidang,pg2.namalengkap as direktur"));

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('ir.tanggal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('ir.tanggal', '<=', $request['tglAkhir']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ir.departemenfk', '=', $request['idDept']);
        }
        if (isset($request['Norec']) && $request['Norec'] != "" && $request['Norec'] != "undefined") {
            $data = $data->where('ir.norec', '=', $request['Norec']);
        }
        $data = $data->where('ir.statusenabled', true);
        $data = $data->get();

        foreach ($data as $item) {
            $details = \DB::select(DB::raw("select ird.norec,ird.identifikasirisikofk,ird.jenisrisiko,ird.keparahan,
                                                   ird.kemungkinan,ird.skor,rangkingrisiko,ird.pengendalian,ird.rangkingaction
                                    from identifikasirisikodetail_t as ird
                                    where ird.identifikasirisikofk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $result[] = array(
                'tanggal' => $item->tanggal,
                'norec' => $item->norec,
                'kategoririsikofk' => $item->kategoririsikofk,
                'kategoryrisiko' => $item->kategoryrisiko,
                'departemenfk' => $item->departemenfk,
                'namadepartemen' => $item->namadepartemen,
                'kainstalasifk' => $item->kainstalasifk,
                'kainstalasi' => $item->kainstalasi,
                'kepalabidangfk' => $item->kepalabidangfk,
                'kabidang' => $item->kabidang,
                'direkturfk' => $item->direkturfk,
                'direktur' => $item->direktur,
                'details' => $details,
            );
        }
        if (count($data) == 0) {
            $result = [];
        }

        $result = array(
            'data' => $result,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function  hapusIdentifikasiRisiko (Request $request){
        DB::beginTransaction();
        try {
            $data = IdentifikasiRisiko::where('norec',$request['norec'])->update([
                'statusenabled' => 0
            ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveRiskRegister(Request $request) {
          DB::beginTransaction();
        try {
                if ($request['data']['norec'] == '') {
                    $data = new RiskRegister();
                    $data->norec = $data->generateNewId();
                    $data->kdprofile = 0;
                    $data->statusenabled = true;
                    $data->identifikasiresikodetailfk = $request['data']['identifikasiresikodetailfk'];
                    $data->identifikasiresikofk = $request['data']['identifikasiresikofk'];
                } else {
                    $data = RiskRegister::where('norec', $request['data']['norec'])->first();
                }
                        $data->tglpenilaian = $request['data']['tglpenilaian'];
                        $data->tglevaluasi = $request['data']['tglevaluasi'];
                        $data->tglsetujui = $request['data']['tglsetujui'];
                        $data->tanggal = $request['data']['tanggal'];
                        $data->tujuan = $request['data']['tujuan'];
                        $data->lokasi = $request['data']['lokasi'];
                        $data->pemilikrisiko = $request['data']['pemilikrisiko'];
                        $data->penilaifk = $request['data']['penilaifk'];
                        $data->pengevaluasifk = $request['data']['pengevaluasifk'];
                        $data->penyetujuifk = $request['data']['penyetujuifk'];
                        $data->deskripsirisiko = $request['data']['deskripsirisiko'];
                        $data->dampak = $request['data']['dampak'];
                        $data->penyebab = $request['data']['penyebab'];
                        $data->upayakontrol = $request['data']['upayakontrol'];
                        $data->efektifitas = $request['data']['efektifitas'];
                        $data->dampakrisiko = $request['data']['dampakrisiko'];
                        $data->kemungkinan = $request['data']['kemungkinan'];
                        $data->level = $request['data']['level'];
                        $data->evaluasirisiko = $request['data']['evaluasirisiko'];
                        $data->tujuansasaran = $request['data']['tujuansasaran'];
                        $data->rencanakegiatan = $request['data']['rencanakegiatan'];
                        $data->penanggungjwabfk = $request['data']['penanggungjwabfk'];
                        $data->jadwal = $request['data']['jadwal'];
                        $data->statusjaminan = $request['data']['statusjaminan'];
                        $data->laporansingkat = $request['data']['laporansingkat'];
                        $data->ketlevel = $request['data']['ketlevel'];
                        $data->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function GetDaftarLaporanRiskRegister(Request $request) {
        $data = \DB::table('riskregister_t as rr')
            ->JOIN('identifikasirisikodetail_t AS ir','ir.norec','=','rr.identifikasiresikodetailfk')
            ->LEFTJOIN('identifikasirisiko_t AS irr','irr.norec','=','rr.identifikasiresikofk')
            ->LEFTJOIN('kategoryrisiko_m AS kr','kr.id','=','irr.kategoririsikofk')
            ->LEFTJOIN ('pegawai_m as pg','pg.id', '=','rr.penilaifk')
            ->LEFTJOIN ('pegawai_m as pg1','pg1.id', '=','rr.pengevaluasifk')
            ->LEFTJOIN ('pegawai_m as pg2','pg2.id', '=','rr.penyetujuifk')
            ->LEFTJOIN ('pegawai_m as pg3','pg3.id', '=','rr.penanggungjwabfk')
            ->SELECT(DB::raw("irr.kategoririsikofk,kr.kategoryrisiko,
                                     ir.jenisrisiko,rr.*, pg.namalengkap AS penilai,
                                     pg1.namalengkap AS pengevaluasi,
                                     pg2.namalengkap AS penyetujui,
                                     pg3.namalengkap AS penanggungjawab"));

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('irr.tanggal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('irr.tanggal', '<=', $request['tglAkhir']);
        }
//        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
//            $data = $data->where('irr.departemenfk', '=', $request['idDept']);
//        }
        if (isset($request['Norec']) && $request['Norec'] != "" && $request['Norec'] != "undefined") {
            $data = $data->where('rr.norec', '=', $request['Norec']);
        }
        $data = $data->where('rr.statusenabled', true);
        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function  hapusRiskRegister (Request $request){
        DB::beginTransaction();
        try {
            $data = RiskRegister::where('norec',$request['norec'])->update([
                'statusenabled' => 0
            ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Hapus Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getLaporanSensusKeselamatanPasienBulanan(Request $request) {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $data = DB::select(DB::raw("SELECT x.namapasien,x.noregistrasi,x.namaruangan,x.tglinsiden,x.insiden,SUM(x.sentinel) AS sentinel,SUM(x.ktd) AS ktd,SUM(x.ktc) AS ktc,
			                               SUM(x.knc) as knc,SUM(x.kpc) as kpc,x.regrading,x.bulan
                            FROM (SELECT CASE WHEN pm.namapasien IS NULL THEN ii.namapasien ELSE pm.namapasien + ' (' + pm.nocm + ')' END AS namapasien,
                                 ii.tglinsiden,pd.noregistrasi,ru.namaruangan,ii.insiden,CASE WHEN ikn.jeniskesalamatanfk = 1 THEN 1 ELSE 0 END AS sentinel,
                                 CASE WHEN ikn.jeniskesalamatanfk = 2 THEN 1 ELSE 0 END AS ktd,
                                 CASE WHEN ikn.jeniskesalamatanfk = 3 THEN 1 ELSE 0 END AS ktc,
                                 CASE WHEN ikn.jeniskesalamatanfk = 4 THEN 1 ELSE 0 END AS knc,
                                 CASE WHEN ikn.jeniskesalamatanfk = 5 THEN 1 ELSE 0 END AS kpc,
                                 lk.regrading,CASE WHEN MONTH(ii.tglinsiden) = 1 THEN 'Januari ' + CONVERT(varchar, YEAR(ii.tglinsiden)) 
                                 WHEN MONTH(ii.tglinsiden) = 2 THEN 'Februari ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 3 THEN 'Maret ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 4 THEN 'April ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 5 THEN 'Mei ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 6 THEN 'Juni ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 7 THEN 'Juli ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 8 THEN 'Agustus ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 9 THEN 'September ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 10 THEN 'Oktober ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 11 THEN 'November ' + CONVERT(varchar, YEAR(ii.tglinsiden))
                                 WHEN MONTH(ii.tglinsiden) = 12 THEN 'Desember ' + CONVERT(varchar, YEAR(ii.tglinsiden)) END AS bulan
                            FROM laporaninsideninternal_t as ii
                            LEFT JOIN pasiendaftar_t as pd on pd.norec = ii.noregistrasifk
                            INNER JOIN lembarkerjainvestigasi_t as lk on lk.laporaninsidenfk = ii.norec
                            INNER JOIN insidenkeselamatan_m as ikn on ikn.id = ii.insidenkeselamatanfk
                            INNER JOIN jeniskeselamatan_m as jk on jk.id = ikn.jeniskesalamatanfk
                            LEFT JOIN pasien_m as pm on pm.id = pd.nocmfk
                            LEFT JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                            WHERE ii.tglinsiden BETWEEN '$tglAwal'  AND  '$tglAkhir'
                            $paramRuangan ) as x
                            GROUP BY x.namapasien,x.noregistrasi,x.namaruangan,x.tglinsiden,x.insiden,x.regrading,x.bulan"));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function GetDetailLaporanIdentifikasiRisiko(Request $request) {

        $details = \DB::select(DB::raw("select ird.norec,ird.identifikasirisikofk,ird.jenisrisiko,ird.keparahan,
                                ird.kemungkinan,ird.skor,rangkingrisiko,ird.pengendalian,ird.rangkingaction,ir.departemenfk,
                                dept.namadepartemen
                                from identifikasirisikodetail_t as ird
                                inner join identifikasirisiko_t as ir on ir.norec = ird.identifikasirisikofk
                                left join departemen_m as dept on dept.id = ir.departemenfk
                                where ird.norec=:norec"),
            array(
                'norec' => $request['Norec'],
            )
        );
        return $this->respond($details);
    }

    public function getLapIndikatorMutu(Request $request){
        $dataSatu = \DB::table('sasaranmutu_t as sm')
            ->join('indikatorrensar_m as ir','ir.id','=','sm.indikatorfk')
            ->join('ruanganindikatorrensar_t as ri','ri.indikatorrensarfk','=','ir.id')
            ->select(DB::raw("distinct sm.tglnilai, sm.tgl, CASE WHEN sm.keterangan = 'DENUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS nilai, sm.num, sm.denum, sm.capaian, ir.denominator as keterangan, ir.indikator, ir.denominator, ir.numerator,'DENUM' as ND,ir.nourut, CASE WHEN ir.otomatisdenum::integer=1 THEN 'Y' ELSE 'N' END AS flag, ir.id as ind_id"))
            ->where('ir.statusenabled', true)
            ->whereNotNull('sm.ruanganfk')
            ->whereNotNull('ir.nourut');
        if(isset($request['bln']) &&
            $request['bln']!="" &&
            $request['bln']!="undefined"){
            $tgl = $request['bln']  ;
            $dataSatu = $dataSatu->whereRaw("to_char(sm.tglnilai,'yyyy-MM') ='$tgl' " );
        };
        if(isset($request['departemenfk']) &&
            $request['departemenfk']!="" &&
            $request['departemenfk']!="undefined"){
            $dataSatu = $dataSatu->where('sm.departemenfk','=', $request['departemenfk'] );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $dataSatu = $dataSatu->where('sm.ruanganfk','=', $request['idRuangan'] );
            $dataSatu = $dataSatu->where('ri.objctruanganfk','=', $request['idRuangan'] );
        };

        if(isset($request['idJenisIndikator']) &&
            $request['idJenisIndikator']!="" &&
            $request['idJenisIndikator']!="undefined"){
            $dataSatu = $dataSatu->where('ir.jenisindikatorfk','=', $request['idJenisIndikator'] );
        };

        if($request['isPPI'] == 'true' && $request['isPMKP'] == 'false') {
            $dataSatu = $dataSatu->where('ir.keteranganmaster','=', 1);
        } else if($request['isPPI'] == 'false' && $request['isPMKP'] == 'true'){
            $dataSatu = $dataSatu->where('ir.keteranganmaster','=', 2);
        }

        $dataSatu = $dataSatu->groupBy('sm.tglnilai', 'sm.tgl', 'sm.keterangan', 'sm.num', 'sm.denum', 'sm.capaian', 'ir.numerator', 'ir.indikator', 'ir.denominator', 'ir.numerator', 'ir.nourut', 'ir.otomatisdenum', 'ir.id');
        // $dataSatu = $dataSatu->groupby('sm.tglnilai', 'sm.tgl', 'sm.num', 'sm.denum', 'sm.capaian', 'sm.keterangan', 'ir.indikator', 'ir.denominator', 'ir.numerator','ir.nourut');
        $data = \DB::table('sasaranmutu_t as sm')
            ->join('indikatorrensar_m as ir','ir.id','=','sm.indikatorfk')
            ->join('ruanganindikatorrensar_t as ri','ri.indikatorrensarfk','=','ir.id')
            ->select(DB::raw("distinct sm.tglnilai, sm.tgl, CASE WHEN sm.keterangan = 'NUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS nilai, sm.num, sm.denum, sm.capaian, ir.numerator as keterangan, ir.indikator, ir.denominator, ir.numerator,'NUM' as ND,ir.nourut, CASE WHEN ir.otomatisnum::integer =1 THEN 'Y' ELSE 'N' END AS flag, ir.id as ind_id"))
            ->where('ir.statusenabled', true)
            ->whereNotNull('sm.ruanganfk')
            ->whereNotNull('ir.nourut')
            ->union($dataSatu);
//            ->orderByRaw('pg.namalengkap,pjk.tgljadwal desc');

        if(isset($request['bln']) &&
            $request['bln']!="" &&
            $request['bln']!="undefined"){
            $tgl = $request['bln']  ;
            $data = $data->whereRaw("to_char(sm.tglnilai,'yyyy-MM') ='$tgl' " );
        };
        
//        if(isset($request['namalengkap']) &&
//            $request['namalengkap']!="" &&
//            $request['namalengkap']!="undefined"){
//            $data = $data->where('ei.objectpegawaifk','=',$request['namalengkap']);
//        };
        if(isset($request['departemenfk']) &&
            $request['departemenfk']!="" &&
            $request['departemenfk']!="undefined"){
            $data = $data->where('sm.departemenfk','=', $request['departemenfk'] );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
                $data = $data->where('sm.ruanganfk','=', $request['idRuangan'] );
                $data = $data->where('ri.objctruanganfk','=', $request['idRuangan'] );
        };
        if(isset($request['idJenisIndikator']) &&
            $request['idJenisIndikator']!="" &&
            $request['idJenisIndikator']!="undefined"){
            $data = $data->where('ir.jenisindikatorfk','=', $request['idJenisIndikator'] );
        };

        if($request['isPPI'] == 'true' && $request['isPMKP'] == 'false') {
            $data = $data->where('ir.keteranganmaster','=', 1);
        } else if($request['isPPI'] == 'false' && $request['isPMKP'] == 'true'){
            $data = $data->where('ir.keteranganmaster','=', 2);
        }

        $data = $data->groupBy('sm.tglnilai', 'sm.tgl', 'sm.keterangan', 'sm.num', 'sm.denum', 'sm.capaian', 'ir.numerator', 'ir.indikator', 'ir.denominator', 'ir.numerator', 'ir.nourut', 'ir.otomatisnum', 'ir.id');
        // $data = $data->groupby('sm.tglnilai', 'sm.tgl', 'sm.num', 'sm.denum', 'sm.capaian', 'sm.keterangan', 'ir.indikator', 'ir.denominator', 'ir.numerator','ir.nourut');
        $data = $data->orderBy('nourut','asc');
        // $data = $data->orderBy('ND','desc');
        //        $data = $data->distinct();
        // $data = $data->orderBy('sm.indikatorfk' ,'asc');
        // $data = $data->orderBy('sm.keterangan' ,'desc');
        // $data = $data->distinct();
        $data = $data->get();
        return $this->respond($data);
    }
    
    public function getLapIndikatorMutuForChart(Request $request){
        $departemenfk = $request['departemenfk'];
        $bln = $request['bln'];
        $idRuangan = $request['idRuangan'];
        // $isPPI = $request['isPPI'];
        // $isPMKP = $request['isPMKP'];
        


        $isCI = '';
        if($request['isPPI'] == 'true' && $request['isPMKP'] == 'false') {
            $isCI = ' and ir.keteranganmaster = 1 ';
        } else if($request['isPPI'] == 'false' && $request['isPMKP'] == 'true'){
            $isCI = ' and ir.keteranganmaster = 2 ';
        }
        
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }
        $data = DB::select(DB::raw("SELECT y.tgl,cast(y.numPLEBITIS as float)/cast(y.denumPLEBITIS as float) * 100 as capaianPLEBITIS, 
        cast(y.numISK as float)/cast(y.denumISK as float) * 100 as capaianISK, 
        cast(y.numIDO as float)/cast(y.denumIDO as float) * 100 as capaianIDO, 
        cast(y.numVAP as float)/cast(y.denumVAP as float) * 100 as capaianVAP, 
        cast(y.numIADP as float)/cast(y.denumIADP as float) * 100 as capaianIADP, 
        cast(y.numDEKUBITUS as float)/cast(y.denumDEKUBITUS as float) * 100 as capaianDEKUBITUS, 
        cast(y.numHAP as float)/cast(y.denumHAP as float) * 100 as capaianHAP, 
        y.keteranganmaster
        FROM
        (SELECT x.tgl,
        SUM(x.numPLEBITIS) AS numPLEBITIS, SUM(x.denumPLEBITIS) AS denumPLEBITIS, 
        SUM(x.numISK) AS numISK, SUM(x.denumISK) AS denumISK, 
        SUM(x.numIDO) AS numIDO, SUM(x.denumIDO) AS denumIDO, 
        SUM(x.numVAP) AS numVAP, SUM(x.denumVAP) AS denumVAP, 
        SUM(x.numIADP) AS numIADP, SUM(x.denumIADP) AS denumIADP, 
        SUM(x.numDEKUBITUS) AS numDEKUBITUS, SUM(x.denumDEKUBITUS) AS denumDEKUBITUS, 
        SUM(x.numHAP) AS numHAP, SUM(x.denumHAP) AS denumHAP, 
        x.keteranganmaster
        FROM
        (SELECT distinct  format(sm.tglnilai, 'dd') as tgl, sm.ruanganfk, ir.indikator, ir.id, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=88 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numPLEBITIS, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=89 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numISK, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=90 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numIDO, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=91 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numVAP, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=92 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numIADP,  
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=93 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numDEKUBITUS, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=94 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numHAP,
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=88 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumPLEBITIS, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=89 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumISK, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=90 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumIDO, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=91 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumVAP, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=92 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumIADP,  
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=93 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumDEKUBITUS, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=94 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumHAP,
        CASE WHEN sm.keterangan = 'DENUM' THEN CAST(sm.nilai AS INT) ELSE 0 END AS totaldenum, 
        ir.keteranganmaster
        FROM sasaranmutu_t AS sm INNER JOIN
        indikatorrensar_m AS ir ON ir.id = sm.indikatorfk LEFT OUTER JOIN
        ruanganindikatorrensar_t ON ir.id = ruanganindikatorrensar_t.indikatorrensarfk
        
        where (format(sm.tglnilai,  'yyyy-MM') = '$bln') AND (sm.departemenfk = $departemenfk) AND sm.ruanganfk IS NOT NULL and sm.ruanganfk like '%$idRuangan%' $isCI
        ) AS x
        GROUP BY x.keteranganmaster, x.tgl) AS y
        WHERE y.denumPLEBITIS > 0 AND y.denumISK > 0 AND y.denumIDO > 0 AND y.denumVAP > 0 AND y.denumIADP > 0 AND y.denumDEKUBITUS > 0 AND y.denumHAP > 0
        "));
        return $this->respond($data);
    }
    
    public function getLapIndikatorMutuForChartPMKP(Request $request){
        $departemenfk = $request['departemenfk'];
        $bln = $request['bln'];
        // return($bln);
        $idRuangan = $request['idRuangan'];

        $isCI = '';
        if($request['isPPI'] == 'true' && $request['isPMKP'] == 'false') {
            $isCI = ' and ir.keteranganmaster = 1 ';
        } else if($request['isPPI'] == 'false' && $request['isPMKP'] == 'true'){
            $isCI = ' and ir.keteranganmaster = 2 ';
        }
        $paramRuangan="";
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }
        $data = DB::select(DB::raw("SELECT y.tgl,
        cast(y.numAngkakesembuhan as float)/cast(y.denumAngkakesembuhan as float) * 100 as capaianAngkakesembuhan, 
        cast(y.numAngkaperawatanulang as float)/cast(y.denumAngkaperawatanulang as float) * 100 as capaianAngkaperawatanulang, 
        cast(y.numInsidenkeamananobatyangperludiwaspadai as float)/cast(y.denumInsidenkeamananobatyangperludiwaspadai as float) * 100 as capaianInsidenkeamananobatyangperludiwaspadai, 
        cast(y.numKejadianpulangataspermintaansendiri as float)/cast(y.denumKejadianpulangataspermintaansendiri as float) * 100 as capaianKejadianpulangataspermintaansendiri, 
        cast(y.numkejadianreaksitransfusi as float)/cast(y.denumkejadianreaksitransfusi as float) * 100 as capaiankejadianreaksitransfusi, 
        cast(y.numKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap as float)/cast(y.denumKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap as float) * 100 as capaianKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap, 
        cast(y.numKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB as float)/cast(y.denumKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB as float) * 100 as capaianKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB, 
        cast(y.numKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap as float)/cast(y.denumKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap as float) * 100 as capaianKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap, 
        cast(y.numKesalahandiitpasien as float)/cast(y.denumKesalahandiitpasien as float) * 100 as capaianKesalahandiitpasien, 
        cast(y.numKetidaklengkapancatatanmedispasien as float)/cast(y.denumKetidaklengkapancatatanmedispasien as float) * 100 as capaianKetidaklengkapancatatanmedispasien, 
        cast(y.numKetidaklengkapanlaporananestesi as float)/cast(y.denumKetidaklengkapanlaporananestesi as float) * 100 as capaianKetidaklengkapanlaporananestesi, 
        cast(y.numKetidaklengkapanlaporanoperasi as float)/cast(y.denumKetidaklengkapanlaporanoperasi as float) * 100 as capaianKetidaklengkapanlaporanoperasi, 
        cast(y.numKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien as float)/cast(y.denumKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien as float) * 100 as capaianKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien, 
        cast(y.numKetidakpatuhanpendokumentasianasesmennyeri as float)/cast(y.denumKetidakpatuhanpendokumentasianasesmennyeri as float) * 100 as capaianKetidakpatuhanpendokumentasianasesmennyeri, 
        cast(y.numPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS as float)/cast(y.denumPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS as float) * 100 as capaianPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS, 
        cast(y.numProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB as float)/cast(y.denumProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB as float) * 100 as capaianProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB, 
        cast(y.numSisamakanansiangnondiit as float)/cast(y.denumSisamakanansiangnondiit as float) * 100 as capaianSisamakanansiangnondiit, 
        y.keteranganmaster
        FROM
        (SELECT x.tgl,
        SUM(x.numAngkakesembuhan) AS numAngkakesembuhan, SUM(x.denumAngkakesembuhan) AS denumAngkakesembuhan, 
        SUM(x.numAngkaperawatanulang) AS numAngkaperawatanulang, SUM(x.denumAngkaperawatanulang) AS denumAngkaperawatanulang, 
        SUM(x.numInsidenkeamananobatyangperludiwaspadai) AS numInsidenkeamananobatyangperludiwaspadai, SUM(x.denumInsidenkeamananobatyangperludiwaspadai) AS denumInsidenkeamananobatyangperludiwaspadai, 
        SUM(x.numKejadianpulangataspermintaansendiri) AS numKejadianpulangataspermintaansendiri, SUM(x.denumKejadianpulangataspermintaansendiri) AS denumKejadianpulangataspermintaansendiri, 
        SUM(x.numkejadianreaksitransfusi) AS numkejadianreaksitransfusi, SUM(x.denumkejadianreaksitransfusi) AS denumkejadianreaksitransfusi, 
        SUM(x.numKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap) AS numKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap, SUM(x.denumKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap) AS denumKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap, 
        SUM(x.numKepatuhanIdentifikasiPasien) AS numKepatuhanIdentifikasiPasien, SUM(x.denumKepatuhanIdentifikasiPasien) AS denumKepatuhanIdentifikasiPasien, 
        SUM(x.numKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB) AS numKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB, SUM(x.denumKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB) AS denumKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB, 
        SUM(x.numKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap) AS numKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap, SUM(x.denumKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap) AS denumKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap, 
        SUM(x.numKesalahandiitpasien) AS numKesalahandiitpasien, SUM(x.denumKesalahandiitpasien) AS denumKesalahandiitpasien, 
        SUM(x.numKetidaklengkapancatatanmedispasien) AS numKetidaklengkapancatatanmedispasien, SUM(x.denumKetidaklengkapancatatanmedispasien) AS denumKetidaklengkapancatatanmedispasien, 
        SUM(x.numKetidaklengkapanlaporananestesi) AS numKetidaklengkapanlaporananestesi, SUM(x.denumKetidaklengkapanlaporananestesi) AS denumKetidaklengkapanlaporananestesi, 
        SUM(x.numKetidaklengkapanlaporanoperasi) AS numKetidaklengkapanlaporanoperasi, SUM(x.denumKetidaklengkapanlaporanoperasi) AS denumKetidaklengkapanlaporanoperasi, 
        SUM(x.numKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien) AS numKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien, SUM(x.denumKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien) AS denumKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien, 
        SUM(x.numKetidakpatuhanpendokumentasianasesmennyeri) AS numKetidakpatuhanpendokumentasianasesmennyeri, SUM(x.denumKetidakpatuhanpendokumentasianasesmennyeri) AS denumKetidakpatuhanpendokumentasianasesmennyeri, 
        SUM(x.numPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS) AS numPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS, SUM(x.denumPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS) AS denumPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS, 
        SUM(x.numProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB) AS numProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB, SUM(x.denumProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB) AS denumProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB, 
        SUM(x.numSisamakanansiangnondiit) AS numSisamakanansiangnondiit, SUM(x.denumSisamakanansiangnondiit) AS denumSisamakanansiangnondiit, 
        x.keteranganmaster
        FROM
        (SELECT distinct  to_char(sm.tglnilai, 'dd') as tgl, sm.ruanganfk, ir.indikator, ir.id, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=115 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numAngkakesembuhan, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=106 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numAngkaperawatanulang, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=101 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numInsidenkeamananobatyangperludiwaspadai, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=107 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKejadianpulangataspermintaansendiri, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=112 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numkejadianreaksitransfusi, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=97 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=20 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKepatuhanIdentifikasiPasien, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=13 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=96 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=113 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKesalahandiitpasien, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=102 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKetidaklengkapancatatanmedispasien, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=110 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKetidaklengkapanlaporananestesi, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=109 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKetidaklengkapanlaporanoperasi, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=98 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=111 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numKetidakpatuhanpendokumentasianasesmennyeri, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=104 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=105 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB, 
        CASE WHEN sm.keterangan = 'NUM' AND ir.id=108 THEN CAST(sm.nilai AS INT) ELSE 0 END AS numSisamakanansiangnondiit, 

        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=115 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumAngkakesembuhan, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=106 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumAngkaperawatanulang, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=101 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumInsidenkeamananobatyangperludiwaspadai, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=107 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKejadianpulangataspermintaansendiri, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=112 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumkejadianreaksitransfusi, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=97 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=20 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKepatuhanIdentifikasiPasien, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=13 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=96 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=113 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKesalahandiitpasien, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=102 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKetidaklengkapancatatanmedispasien, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=110 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKetidaklengkapanlaporananestesi, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=109 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKetidaklengkapanlaporanoperasi, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=98 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=111 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumKetidakpatuhanpendokumentasianasesmennyeri, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=104 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=105 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumProporsipasienTBparuterkonfirmasibakteriologisdiantaraterdugaTB, 
        CASE WHEN sm.keterangan = 'DENUM' AND ir.id=108 THEN CAST(sm.nilai AS INT) ELSE 0 END AS denumSisamakanansiangnondiit, 
        CASE WHEN sm.keterangan = 'DENUM' THEN CAST(sm.nilai AS INT) ELSE 0 END AS totaldenum, 
        ir.keteranganmaster
        FROM sasaranmutu_t AS sm INNER JOIN
        indikatorrensar_m AS ir ON ir.id = sm.indikatorfk LEFT OUTER JOIN
        ruanganindikatorrensar_t ON ir.id = ruanganindikatorrensar_t.indikatorrensarfk
        
        where (to_char(sm.tglnilai, 'yyyy-MM') = '$bln') AND (sm.departemenfk = $departemenfk) AND sm.ruanganfk IS NOT NULL $paramRuangan $isCI
        ) AS x
        GROUP BY x.keteranganmaster, x.tgl) AS y
        WHERE y.denumAngkakesembuhan > 0 AND y.denumAngkaperawatanulang > 0 AND y.denumInsidenkeamananobatyangperludiwaspadai > 0 AND y.denumKejadianpulangataspermintaansendiri > 0 AND y.denumkejadianreaksitransfusi > 0 AND y.denumKelengkapanasesmenmedisdalamwaktu24jamsetelahpasienmasukrawatinap > 0 AND y.denumKepatuhanIdentifikasiPasien > 0 AND y.denumKepatuhanJamVisiteDokterSpesialisKurangDariJam14WIB > 0 AND y.denumKepatuhanUpayaPencegahRisikoCederaAkibatPasienJatuhpadaPasienRawatInap > 0 AND y.denumKesalahandiitpasien > 0 AND y.denumKetidaklengkapancatatanmedispasien > 0 AND y.denumKetidaklengkapanlaporananestesi > 0 AND y.denumKetidaklengkapanlaporanoperasi > 0 AND y.denumKetidakpatuanpendokumentasianasesmennyerisecarakontinyudistatuspasien > 0 AND y.denumKetidakpatuhanpendokumentasianasesmennyeri > 0 AND y.denumPenangananpasientuberkolosisyangtidaksesuaistrategiDOTS > 0 AND y.denumSisamakanansiangnondiit > 0 
        "));
        return $this->respond($data);
    }

    public function getLapIndikatorMutuPMKP(Request $request){
        $dataSatu = \DB::table('sasaranmutu_t as sm')
            ->join('indikatorrensar_m as ir','ir.id','=','sm.indikatorfk')
            ->leftjoin('ruanganindikatorrensar_t as ri','ri.indikatorrensarfk','=','ir.id')
            ->select(DB::raw("sm.tglnilai, sm.tgl, CASE WHEN sm.keterangan = 'DENUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS nilai, sm.num, sm.denum, sm.capaian, ir.denominator as keterangan, ir.indikator, ir.denominator, ir.numerator,'DENUM' as ND,ir.nourut,ir.keteranganinput"))
            ->where('ir.statusenabled', true)
            ->where('ir.keteranganmaster', 2)
            ->whereNotNull('ir.nourut');
        if(isset($request['bln']) &&
            $request['bln']!="" &&
            $request['bln']!="undefined"){
            $tgl = $request['bln']  ;
            $dataSatu = $dataSatu->whereRaw("format(sm.tglnilai,'yyyy-MM') ='$tgl' " );
        };
        if(isset($request['departemenfk']) &&
            $request['departemenfk']!="" &&
            $request['departemenfk']!="undefined"){
            $dataSatu = $dataSatu->where('sm.departemenfk','=', $request['departemenfk'] );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $dataSatu = $dataSatu->where('ri.objctruanganfk','=', $request['idRuangan'] );
        };
        $dataSatu = $dataSatu->groupby('sm.tglnilai', 'sm.tgl', 'sm.num', 'sm.denum', 'sm.capaian', 'sm.keterangan', 'ir.indikator', 'ir.denominator', 'ir.numerator','ir.nourut','ir.keteranganinput');
        $data = \DB::table('sasaranmutu_t as sm')
            ->join('indikatorrensar_m as ir','ir.id','=','sm.indikatorfk')
            ->leftjoin('ruanganindikatorrensar_t as ri','ri.indikatorrensarfk','=','ir.id')
            ->select(DB::raw("sm.tglnilai, sm.tgl, CASE WHEN sm.keterangan = 'NUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS nilai, sm.num, sm.denum, sm.capaian, ir.numerator as keterangan, ir.indikator, ir.denominator, ir.numerator,'NUM' as ND,ir.nourut,ir.keteranganinput"))
            ->where('ir.statusenabled', true)
            ->where('ir.keteranganmaster',2)
            ->whereNotNull('ir.nourut')
            ->union($dataSatu);
//            ->orderByRaw('pg.namalengkap,pjk.tgljadwal desc');

        if(isset($request['bln']) &&
            $request['bln']!="" &&
            $request['bln']!="undefined"){
            $tgl = $request['bln']  ;
            $data = $data->whereRaw("format(sm.tglnilai,'yyyy-MM') ='$tgl' " );
        };
        
//        if(isset($request['namalengkap']) &&
//            $request['namalengkap']!="" &&
//            $request['namalengkap']!="undefined"){
//            $data = $data->where('ei.objectpegawaifk','=',$request['namalengkap']);
//        };
        if(isset($request['departemenfk']) &&
            $request['departemenfk']!="" &&
            $request['departemenfk']!="undefined"){
            $data = $data->where('sm.departemenfk','=', $request['departemenfk'] );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
                $data = $data->where('ri.objctruanganfk','=', $request['idRuangan'] );
        };
        $data = $data->groupby('sm.tglnilai', 'sm.tgl', 'sm.num', 'sm.denum', 'sm.capaian', 'sm.keterangan', 'ir.indikator', 'ir.denominator', 'ir.numerator','ir.nourut','ir.keteranganinput');
        $data = $data->orderBy('ir.nourut','asc');
        $data = $data->orderBy('ND','desc');
        //        $data = $data->distinct();
        // $data = $data->orderBy('sm.indikatorfk' ,'asc');
        // $data = $data->orderBy('sm.keterangan' ,'desc');
        $data = $data->get();
        return $this->respond($data);
    }
    public function getChartJenisKeselamatan(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = DB::select(DB::raw("SELECT
                    *
                FROM
                    (
                        SELECT
                            COUNT (x.jeniskeselamatan) AS jumlah,
                            x.jeniskeselamatan as name
                        FROM
                            (
                                SELECT
                                    lap.namapasien,
                                    lap.nocm,
                                    lap.tglinsiden,
                                    isn.namakeselamatan,
                                    jk.jeniskeselamatan
                                FROM
                                    laporaninsideninternal_t AS lap
                                JOIN insidenkeselamatan_m AS isn ON lap.jenisinsiden = isn.id
                                JOIN jeniskeselamatan_m AS jk ON jk.id = isn.jeniskesalamatanfk
                                WHERE
                                    lap.tglinsiden BETWEEN '$tglAwal'
                                AND '$tglAkhir'
                            ) AS x
                        GROUP BY
                            x.jeniskeselamatan
                    ) AS z
                ORDER BY
                    z.jumlah DESC
         "));
       
        return $this->respond($data);
    }
     public function getChartGrading(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = DB::select(DB::raw("SELECT
                    *
                FROM
                    (
                        SELECT
                            COUNT (x.regrading) AS jumlah,
                            x.regrading as name
                        FROM
                            (
                                SELECT
                                    lap.namapasien,
                                    lap.nocm,
                                    lap.tglinsiden,
                                    gd.regrading
                                FROM
                                    dbo.laporaninsideninternal_t AS lap
                                JOIN regrading_m AS gd ON gd.id = lap.grading
                                WHERE
                                    lap.tglinsiden BETWEEN '$tglAwal'
                                AND '$tglAkhir'
                            ) AS x
                        GROUP BY
                            x.regrading
                    ) AS z
                ORDER BY
                    z.jumlah DESC 
         "));
       

      
        return $this->respond($data);
    }

    public function getLembarKerjaInvestigasi(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];



        $data = \DB::table('lembarkerjainvestigasi_t AS lki')
                ->leftJoin('laporaninsideninternal_t AS lii', 'lii.norec', '=', 'lki.laporaninsidenfk')
                ->whereBetween('lki.tanggalmulai',[$tglAwal,$tglAkhir])
                ->where('lki.statusenabled', 1)
                ->select('lki.*', 'lii.*', 'lki.norec AS noreclki')
                ->get();

        return $this->respond($data);
    }

    public function getFormLembarKerjaInvestigasi(Request $request)
    {
        $laporaninsidenfk = $request['laporaninsidenfk'];

        $data = \DB::table('lembarkerjainvestigasi_t AS lki')
            ->leftJoin('laporaninsideninternal_t AS lii', 'lii.norec', '=', 'lki.laporaninsidenfk')
            ->leftJoin('pegawai_m AS pg', 'pg.id', '=', 'lki.penanggungjawabfk')
            ->leftJoin('pegawai_m AS pg2', 'pg2.id', '=', 'lki.pegawaifk')
            ->leftJoin('pegawai_m AS pg3', 'pg3.id', '=', 'lki.namakepalafk')
            ->where('lki.laporaninsidenfk', $laporaninsidenfk)
            ->select('lki.*', 'lii.*', 'pg.namalengkap AS penanggungjawab', 'pg2.namalengkap AS pegawai', 'pg3.namalengkap AS namakepalaa', 'lki.norec AS noreclki')
            ->get();

        return $this->respond($data);
    }

    public function GetDaftarLaporanInsidenInternalBaru(Request $request) {
        $data = \DB::table('laporaninsideninternal_t as lki')
            ->LEFTJOIN ('ruangan_m as ru','ru.id', '=','lki.ruanganfk')
            ->LEFTJOIN ('kelompokpasien_m as kp','kp.id', '=','lki.penanggungbiayapasienfk')
            ->LEFTJOIN ('jeniskelamin_m as jk','jk.id', '=','lki.jeniskelaminfk')
            ->LEFTJOIN ('lembarkerjainvestigasi_t as lk','lk.laporaninsidenfk', '=','lki.norec')
            ->LEFTJOIN ('insidenkeselamatan_m as ik','ik.id', '=','lki.insidenkeselamatanfk')
            ->LEFTJOIN ('jeniskeselamatan_m as jkn','jkn.id', '=','ik.jeniskesalamatanfk')
            ->LEFTJOIN ('lembarkerjainvestigasi_t AS lkt','lkt.laporaninsidenfk','=','lki.norec')
            ->select(DB::raw("lki.*,ru.namaruangan,kp.kelompokpasien,lk.norec as lk_norec,ik.namakeselamatan as keselamatan,
                                     ik.jeniskesalamatanfk,jkn.jeniskeselamatan,lkt.norec as norec_lk,jk.jeniskelamin"));

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('lki.tglinsiden', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('lki.tglinsiden', '<=', $request['tglAkhir']);
        }
        if (isset($request['Norec']) && $request['Norec'] != "" && $request['Norec'] != "undefined") {
            $data = $data->where('lki.norec', '=', $request['Norec']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('lki.ruanganfk', '=', $request['idRuangan']);
        }
        if (isset($request['idPelapor']) && $request['idPelapor'] != "" && $request['idPelapor'] != "undefined") {
            $data = $data->where('lki.pembuatlaporanfk', '=', $request['idPelapor']);
        }

        $data = $data->where('lki.statusenabled', true);
        $data = $data->where('lk.norec', null);
        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getCapaianIndikator(Request $request)
    {
//        $tglAwal = $request['tglAwal'];
//        $tglAkhir = $request['tglAkhir'];
        $bulantahun='';
        $departemen='';
        if(isset($request['bln']) &&
            $request['bln']!="" &&
            $request['bln']!="undefined"){
            $tgl = $request['bln']  ;
            $bulantahun = "where  to_char(sm.tglnilai,'yyyy-MM') ='".$tgl."' ";
        };
        
        if($request['isPPI'] == 'true' && $request['isPMKP'] == 'false') {
            $dataP = " and ir.keteranganmaster = 1 ";
        } else if($request['isPPI'] == 'false' && $request['isPMKP'] == 'true'){
            $dataP = " and ir.keteranganmaster = 2 ";
        } else {
            $dataP = "";
        }

        if(isset($request['departemenfk']) &&
            $request['departemenfk']!="" &&
            $request['departemenfk']!="undefined"){
            $dep= $request['departemenfk'];
            $departemen= "and sm.departemenfk=".$dep." ";
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $dep= $request['idRuangan'];
            $departemen=$departemen." "."AND sm.ruanganfk=".$dep." ";
        };
        if(isset($request['idJenisIndikator']) &&
            $request['idJenisIndikator']!="" &&
            $request['idJenisIndikator']!="undefined"){
            $idJenisIndikator= $request['idJenisIndikator'];
            $departemen=$departemen." "."AND ir.jenisindikatorfk=".$idJenisIndikator." ";
        };

        $data = DB::select(DB::raw("SELECT y.indikator, y.id,y.totalnum, y.totaldenum, cast(y.totalnum as float)/cast(y.totaldenum as float) * 100 as capaian, cast(y.totalnum as float)/cast(y.totaldenum as float) * 1000 as capaianmil, y.keteranganmaster
        FROM
                (SELECT x.indikator, x.id, SUM(x.totalnum) AS totalnum, SUM(x.totaldenum) AS totaldenum, x.keteranganmaster
                FROM 
                    (SELECT    sm.tgl, ir.indikator, ir.id, CASE WHEN sm.keterangan = 'NUM' THEN (CAST(sm.nilai AS INT)) ELSE 0 END AS totalnum, CASE WHEN sm.keterangan = 'DENUM' THEN CAST(sm.nilai AS INT) ELSE 0 END AS totaldenum, ir.keteranganmaster
                        FROM            sasaranmutu_t AS sm INNER JOIN
                                                indikatorrensar_m AS ir ON ir.id = sm.indikatorfk LEFT OUTER JOIN
                                                ruanganindikatorrensar_t ON ir.id = ruanganindikatorrensar_t.indikatorrensarfk
                               
                    $bulantahun
                    $departemen $dataP AND sm.ruanganfk IS NOT NULL
                    -- GROUP BY ir.indikator, sm.keterangan, ir.id
                    ) AS x
                GROUP BY x.indikator, x.id, x.keteranganmaster) AS y
            WHERE y.totaldenum > 0
            ORDER BY y.id ASC
         "));

        return $this->respond($data);
    }


    public function getCapaianIndikatorPMKP(Request $request)
{
//        $tglAwal = $request['tglAwal'];
//        $tglAkhir = $request['tglAkhir'];
    $bulantahun='';
    $departemen='';
    if(isset($request['bln']) &&
        $request['bln']!="" &&
        $request['bln']!="undefined"){
        $tgl = $request['bln']  ;
        $bulantahun = "and  format(sm.tglnilai,'yyyy-MM') ='".$tgl."' ";
    };

    if(isset($request['departemenfk']) &&
        $request['departemenfk']!="" &&
        $request['departemenfk']!="undefined"){
        $dep= $request['departemenfk'];
        $departemen= "AND sm.departemenfk=".$dep." ";
    };
    if(isset($request['idRuangan']) &&
    $request['idRuangan']!="" &&
    $request['idRuangan']!="undefined"){
    $dep= $request['idRuangan'];
    $departemen= "AND ruanganindikatorrensar_t.objctruanganfk=".$dep." ";
};

    $data = DB::select(DB::raw("SELECT y.indikator, ((case when y.totalnum = 0 then 1 else y.totalnum end)/(case when y.totaldenum = 0 then 1 else  y.totaldenum  end )*100 )AS capaian FROM
            (SELECT x.indikator, x.id, SUM(x.totalnum) AS totalnum, SUM(x.totaldenum) AS totaldenum
            FROM 
                (SELECT        ir.indikator, ir.id, CASE WHEN sm.keterangan = 'NUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS totalnum, CASE WHEN sm.keterangan = 'DENUM' THEN SUM(CAST(sm.nilai AS INT)) ELSE 0 END AS totaldenum
                    FROM            sasaranmutu_t AS sm INNER JOIN
                                            indikatorrensar_m AS ir ON ir.id = sm.indikatorfk LEFT OUTER JOIN
                                            ruanganindikatorrensar_t ON ir.id = ruanganindikatorrensar_t.indikatorrensarfk
                    WHERE        (ir.keteranganmaster = 2)
                $bulantahun
                $departemen
                GROUP BY ir.indikator, sm.keterangan, ir.id) AS x
            GROUP BY x.indikator, x.id) AS y
        ORDER BY y.id ASC
     "));

    return $this->respond($data);
}
}
