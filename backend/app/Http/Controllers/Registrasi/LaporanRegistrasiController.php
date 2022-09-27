<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 8/14/2019
 * Time: 10:30 AM
 */

namespace App\Http\Controllers\Registrasi;

use App\Traits\Holiday;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\PasienDaftar;
use App\Transaksi\RisOrder;
use App\Transaksi\TempLaporanLayanan;
use App\Transaksi\TempLaporanPasienPulang;
use App\Transaksi\TempRiwayatPersediaan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
//use App\Pegawai\ModulAplikasi;
//use App\Pegawai\MapObjekModulToKelompokUser;
//use App\Pegawai\MapObjekModulAplikasiToModulAplikasi;
//use App\Pegawai\ObjekModulAplikasi;
//use App\Master\KelompokUser;

use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\OrderProduk;
use App\Master\Pegawai;
use App\Traits\Valet;
use PHPExcel;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;
use PHPExcel_IOFactory;
use PHPExcel_Style_Border;
use PHPExcel_Style_Fill;
use PHPExcel_Settings;
use App;
use Dompdf\Dompdf;
use Dompdf\Options;

class LaporanRegistrasiController extends  App\Http\Controllers\ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataCombo(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawaiLogin = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', [3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35, 34, 30, 45, 71])
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataStatusPulang = \DB::table('statuspulang_m as sp')
            ->where('sp.statusenabled', true)
            ->orderBy('sp.statuspulang')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            // ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();

        $dataDokters = \DB::table('pegawai_m as ru')
            ->select('ru.id', 'ru.namalengkap as namaLengkap')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();

        $dataDiagnosa = \DB::table('diagnosa_m as dgm')
            ->select('dgm.id', 'dgm.kddiagnosa', 'dgm.namadiagnosa')
            ->where('dgm.statusenabled', true)
            //            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('dgm.kddiagnosa')
            ->take(100)
            ->get();

        $dataJenisDiagnosa = \DB::table('jenisdiagnosa_m as jd')
            ->select('jd.id', 'jd.jenisdiagnosa')
            ->where('jd.statusenabled', true)
            //            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('jd.jenisdiagnosa')
            ->get();
        // $tipePasien  = \DB::table('kelompokpasien_m as kp')
        // ->select('kp.id', 'kp.kelompokpasien')
        // ->where('kp.statusenabled', true)
        // //            ->where('ru.objectjenispegawaifk', 1)
        // ->orderBy('kp.kelompokpasien')
        // ->get();

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
        foreach ($dataDokters as $item) {
            $datadokterruangan[] = array(
                'id' => $item->id,
                'dokterruangan' => $item->namaLengkap
            );
        }
        foreach ($dataRuangan as $item) {
            $datadokterruangan[] = array(
                'id' => $item->id,
                'dokterruangan' => $item->namaruangan
            );
        }

        // return($datadokterruangan);
        // die();

        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataJenisKelompok = \DB::table('jeniskelompokpasien_m as jkm')
            ->select('jkm.id', 'jkm.jeniskelompokpasien')
            ->where('jkm.statusenabled', true)
            ->orderBy('jkm.jeniskelompokpasien')
            ->get();

        $dataRekanan2 = \DB::table('rekanan_m as rk')
            ->select('rk.id', 'rk.namarekanan')
            ->where('rk.statusenabled', true)
            ->orderBy('rk.namarekanan')
            ->get();
        $dataRekanan = DB::select(
            DB::raw("select distinct rk.reportdisplay as id,rk.reportdisplay as namarekanan from rekanan_m as rk")
        );

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $dataKamar = \DB::table('kamar_m as kmr')
            ->select('kmr.id', 'kmr.namakamar')
            ->where('kmr.statusenabled', true)
            ->orderBy('kmr.namakamar')
            ->get();

        $dataRuanganInap = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            //            ->where('ru.objectdepartemenfk', '16')
            ->whereIn('ru.objectdepartemenfk', [16, 25, 5])
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [18, 28, 24, 3, 27])
            ->orderBy('ru.namaruangan')
            ->get();

        $dataPegawai = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            //            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();

        $dataPetugasPe = \DB::table('jenispetugaspelaksana_m as ru')
            ->select('ru.jenispetugaspe', 'ru.id')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.jenispetugaspe')
            ->get();

        $datajaminankhusus = DB::table('jaminankhusus_m as jkm')
            ->where('jkm.statusenabled', true)
            ->orderBy('jkm.namaexternal')
            ->get();

        $dataKasir = DB::select(
            DB::raw("select pg.id,pg.namalengkap,lu.id as luid from loginuser_s lu
                INNER JOIN pegawai_m pg on lu.objectpegawaifk=pg.id
                where objectkelompokuserfk=:id;"),
            array(
                'id' => 20,
            )
        );
        $dataTglsetor = DB::select(
            DB::raw("select distinct tglsetor from setorjasa_t"),
            array()
        );
        $zona = [
            0 => ["id" => "1", "zona" => "Hijau"],
            1 => ["id" => "2", "zona" => "Merah"]
        ];




        $result = array(
            'tglsetor' => $dataTglsetor,
            'departemen' => $dataDepartemen,
            'ruangan' => $dataRuangan,
            'ruanganinap' => $dataRuanganInap,
            'kelompokpasien' => $dataKelompok,
            'statuspulang' => $dataStatusPulang,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'kamar' => $dataKamar,
            'dataDokters' => $dataDokters,
            'rekanan' => $dataRekanan,
            'rekanan2' => $dataRekanan2,
            'pegawai' => $dataPegawai,
            'jeniskelompokpasien' => $dataJenisKelompok,
            'jaminankhusus' => $datajaminankhusus,
            'kasir' => $dataKasir,
            'diagonsa' => $dataDiagnosa,
            'jenisdiagnosa' => $dataJenisDiagnosa,
            'petugaspe' => $dataPetugasPe,
            'ruanganjalan' => $dataRuanganJalan,
            'user' => $dataPegawaiLogin,
            'datadokterruangan' => $datadokterruangan,
            'zona' => $zona,
            'message' => 'as@egieramdan',
        );

        return $this->respond($result);
    }
    public function getTindakan(Request $requst)
    {
        $dataproduk = \DB::table('produk_m as pr')
            ->join('detailjenisproduk_m as djp', 'pr.objectdetailjenisprodukfk', '=', 'djp.id')
            ->select('pr.id', 'pr.namaproduk')
            ->whereNotIn('djp.objectjenisprodukfk', array(97, 44))
            ->where('pr.namaproduk', 'like', '%pemeriksaan dokter%')
            ->where('pr.statusenabled', true)
            ->orderBy('pr.namaproduk')
            ->get();

        $result = array(
            'produk' => $dataproduk,
            // 'departemen' => $dataDepartemen,
            // 'message' => 'as@egieramdan',
        );

        return $this->respond($result);
    }
    public function getTindakanAll(Request $requst)
    {
        $dataproduk = \DB::table('produk_m as pr')
            ->join('detailjenisproduk_m as djp', 'pr.objectdetailjenisprodukfk', '=', 'djp.id')
            ->select('pr.id', 'pr.namaproduk')
            ->where('pr.statusenabled', true)
            ->orderBy('pr.namaproduk')
            ->get();

        $komponenharga = \DB::table('komponenharga_m as kh')
            ->select('kh.id', 'kh.komponenharga')
            ->where('kh.statusenabled', true)
            ->orderBy('kh.id')
            ->get();

        $result = array(
            'produk' => $dataproduk,
            'komponenharga' => $komponenharga,
            // 'departemen' => $dataDepartemen,
            // 'message' => 'as@egieramdan',
        );

        return $this->respond($result);
    }
    public function getHargaKomponen(Request $request) {
        $data = \DB::table('jasapelayanan_t as jp')
            ->select(DB::raw('
            jp.produkfk, convert(varchar, jp.bruto, 5) as bruto
            '))
            ->where('jp.produkfk', $request['objectprodukfk'])
            ->where('jp.jeniskomponen', $request['jeniskomponenfk']);

            if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                $data = $data->where('jp.tglverif', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                $data = $data->where('jp.tglverif', '<=', $request['tglAkhir']);
            }
            $data = $data->distinct();
            $data = $data->get();

        return $this->respond($data);
    }
    public function getComboPolda(Request $request)
    {
        $dataKesatuan = \DB::table('kesatuanpasien_m as kp')
            ->select('kp.id', 'kp.kesatuanpasien')
            ->where('kp.statusenabled', true)
            ->get();

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen')
            ->whereIn('dp.id', array(3, 24, 27, 18, 16, 28, 5))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
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
        $result = array(
            'departemen' => $dataDepartemen,
            'kesatuan' => $dataKesatuan,
        );
        return $this->respond($result);
    }
    public function getDataLaporanPasienDaftar(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $idDept =  ' ';
        $paramsTgl = 'pd.tglregistrasi';

        if (isset($request['isTglPulang']) && $request['isTglPulang'] != "" && $request['isTglPulang'] != "undefined") {
            if ($request['isTglPulang'] == true) {
                $paramsTgl = 'pd.tglpulang';
            }
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan =  ' ';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idKelompok = ' ';
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            if ($idKelompok == 135 || $idKelompok == '135') {
                $idKelompok = 'and pd.objectkelompokpasienlastfk in (1,5,3)';
            } else {
                $idKelompok = 'and pd.objectkelompokpasienlastfk = ' . $request['kelompokPasien'];
            }
        }
        $idDokter = ' ';
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $idDokter = 'and pg.id  = ' . $request['idDokter'];
        }
        $tindakan = ' ';
        if (isset($request['tindakan']) && $request['tindakan'] != "" && $request['tindakan'] != "undefined") {
            $tindakan = ' and pr.id = ' . $request['tindakan'];
        }
        $kelas = ' ';
        if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
            $kelas = ' and kl.id = ' . $request['kelas'];
        }
        $PetugasPe = ' ';
        if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
            $PetugasPe = ' and ppp.objectjenispetugaspefk =' . $request['PetugasPe'];
        }
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("select x.noregistrasi,x.nocm,x.namapasien,x.tgllahir,x.jk,x.namakelas,x.dokterpj,x.tglregistrasi,
                        x.tglpulang,x.namarekanan,x.ruangandaftar,x.iddepartementdaftar,x.idkelompokpasien,x.kelompokpasien,
                        x.alamatlengkap,x.namadepartemen,x.norec,x.dokterapd
                        from(SELECT pd.noregistrasi,pm.nocm,pm.namapasien,pm.tgllahir,jk.reportdisplay as jk,
                                     kl.namakelas,pg.namalengkap as dokterpj,pd.tglregistrasi,pd.tglpulang,rk.namarekanan,
                                     ru.namaruangan as ruangandaftar,ru.id as idruangandaftar,ru.objectdepartemenfk as iddepartementdaftar,
                                     klp.id as idkelompokpasien,klp.kelompokpasien,ar.asalrujukan,
                                     case when apd.statuskunjungan='BARU' then 'y' else 'n' end as statuskunjungan,
                                     alm.alamatlengkap,kdp.kondisipasien,dpt.namadepartemen,pg2.id as apddokterid, pg.namalengkap as dokterapd,
                                     br.norec
                        from pasiendaftar_t as pd
                        inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                        inner join pasien_m as pm on pm.id = pd.nocmfk
                        inner join jeniskelamin_m as jk on jk.id=pm.objectjeniskelaminfk
                        inner join ruangan_m  as ru on ru.id=apd.objectruanganfk
                        left join kelas_m as kl on kl.id=apd.objectkelasfk
                        left join pegawai_m  as pg on pg.id=pd.objectpegawaifk
                        left join pegawai_m as pg2 on pg2.id=apd.objectpegawaifk
                        left join rekanan_m  as rk on rk.id=pd.objectrekananfk
                        left join kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk
                        left join asalrujukan_m as ar on ar.id=apd.objectasalrujukanfk
                        left join alamat_m as alm on alm.nocmfk = pm.id
                        left join kondisipasien_m as kdp on kdp.id=pd.objectkondisipasienfk
                        left join departemen_m as dpt on dpt.id=ru.objectdepartemenfk
                        left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                        LEFT JOIN diagnosapasien_t as dp on dp.noregistrasifk = apd.norec
                        LEFT JOIN detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                        LEFT JOIN diagnosa_m as dg on dg.id = ddp.objectdiagnosafk
                        WHERE  $paramsTgl between '$tglAwal' and '$tglAkhir' and br.norec is null AND (ddp.objectjenisdiagnosafk IS NULL OR ddp.objectjenisdiagnosafk IN (1,5)) 
                        $idDept
                        $idRuangan
                        $idKelompok
                        ) as x
                        GROUP BY x.noregistrasi,x.nocm,x.namapasien,x.tgllahir,x.jk,x.namakelas,x.dokterpj,x.tglregistrasi,
			                     x.tglpulang,x.namarekanan,x.ruangandaftar,x.iddepartementdaftar,x.idkelompokpasien,x.kelompokpasien,
			                     x.alamatlengkap,x.namadepartemen,x.norec,x.dokterapd
                        order by x.tglregistrasi"));

        return $this->respond($data);
    }
    public function getDataLaporanPelayananPasien(Request $request)
    {
        //ciri pelayanan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $bulan=date_create($tglAwal);
        $cekBulan=date_format($bulan,"m");
        $cekTahun=date_format($bulan,"Y");
        $bulan=date_format($bulan,"Y-m");
        $sumTTs =DB::select(DB::raw("SELECT sum (x.jmlbed) AS tt FROM 
            (select to_char (tglaktif,'yyyy-MM') AS bulanregis,jmlbed from skbeddinamis_m ) as x where x.bulanregis='$bulan'
        "));
        $dataTTD =DB::select(DB::raw("SELECT * FROM 
           (SELECT to_char(skbeddinamis_m.tglaktif, 'yyyy-MM') AS bulanregis, to_char(skbeddinamis_m.tglnonaktif, 'yyyy-MM') AS bulannonaktip, skbeddinamis_m.jmlbed, skbeddinamis_m.koderuangan, ruangan_m.namaruangan
            FROM skbeddinamis_m INNER JOIN ruangan_m ON skbeddinamis_m.koderuangan = ruangan_m.id::VARCHAR) as x where x.bulanregis='$bulan'
       "));
        $jumHari = cal_days_in_month(CAL_GREGORIAN, $cekBulan, $cekTahun);

        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->leftjoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select(DB::raw('ROW_NUMBER() OVER (ORDER BY ru.namaruangan) AS nomor,ru.id as idruangan,
                        ru.namaruangan,ru2.namaruangan as ruanganasal,apd.statuskunjungan,apd.objectruanganasalfk,pd.objectrekananfk,apd.objectasalrujukanfk,
                        apd.objectstatuspulangfk,pd.statusenabled,apd.statusenabled as batalkonsul,ps.objectjeniskelaminfk,ps.namapasien'))
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk ', '=', $request['idDept']);
        }
       
        $data = $data->whereIn('apd.objectruanganfk', [3, 4, 6, 7, 8, 9, 12, 13, 14, 17, 19, 20, 25, 26, 27, 31, 33, 70, 89, 97, 130, 132, 247, 248, 250, 253, 268, 319, 322, 446, 447, 448, 459, 456, 461, 543, 552, 564, 784, 788, 790, 792, 569, 786, 796, 787])
            ->where(function ($data) {
                $data->whereNull('apd.objectruanganasalfk')
                    ->orWhereIn('apd.objectruanganasalfk', [3, 4, 6, 7, 8, 9, 12, 13, 14, 17, 19, 20, 25, 26, 27, 31, 33, 70, 89, 97, 130, 132, 247, 248, 250, 253, 268, 319, 322, 446, 447, 448, 459, 456, 461, 543, 552, 564, 784, 788, 790, 792, 569, 786, 796, 787]);
            });
        $data = $data->orderby('ru.namaruangan');
        $data = $data->get();
        $kunjL=0;
        $datakunjL=[];
        $kunjP=0;
        $kunjLP=0;
        $kunjLjiwa=0;
        $kunjPjiwa=0;
        $kunjLPjiwa=0;
        foreach ($data as $item) {
            if($item->objectjeniskelaminfk==1){
              $kunjL= $kunjL+1;
              $datakunjL[] = array(
                'nama'=>$item->namapasien,
                'namaruangan'=>$item->namaruangan
              );
            }else{
                $kunjP=$kunjP+1;
            }
            $kunjLP=$kunjL+$kunjP;

            if($item->objectjeniskelaminfk==1 && $item->idruangan==250 || $item->idruangan==786){
              $kunjLjiwa= $kunjLjiwa+1;  
            }else if($item->objectjeniskelaminfk==2 && $item->idruangan==250 || $item->idruangan==786){
                $kunjPjiwa=$kunjPjiwa+1;
            }
            $kunjLPjiwa=$kunjLjiwa+$kunjPjiwa;
        }

        $dataRI = \DB::table('antrianpasiendiperiksa_t as apd')
            ->leftjoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select(DB::raw('ROW_NUMBER() OVER (ORDER BY ru.namaruangan) AS nomor,ru.id as idruangan,
                        ru.namaruangan,ru2.namaruangan as ruanganasal,apd.statuskunjungan,apd.objectruanganasalfk,pd.objectrekananfk,apd.objectasalrujukanfk,
                        apd.objectstatuspulangfk,pd.statusenabled,apd.statusenabled as batalkonsul,ps.objectjeniskelaminfk'))
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $dataRI = $dataRI->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $dataRI = $dataRI->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        $dataRI = $dataRI->where('ru.objectdepartemenfk', '=', 16);
       
        $dataRI = $dataRI->orderby('ru.namaruangan');
        $dataRI = $dataRI->get();
        $kunjLRI=0;
        $kunjPRI=0;
        $kunjLPRI=0;
        foreach ($dataRI as $itemRI) {
            if($itemRI->objectjeniskelaminfk==1){
              $kunjLRI= $kunjLRI+1;  
            }else{
                $kunjPRI=$kunjPRI+1;
            }
            $kunjLPRI=$kunjLRI+$kunjPRI;
        }

        $jumlahhariperawatan = 0;
        $x = [];
        $tgl = 0;
        // $jumlahhariperawatan = DB::select(DB::raw("select * from  (
        //               SELECT        jkp.jeniskelompokpasien,pd.tglregistrasi,case when rekanan_m.namarekanan is null then 'Umum' else rekanan_m.namarekanan end as namarekanan, pd.tglpulang, apd.tglkeluar, apd.tglmasuk, pm.nocm, pd.noregistrasi, pm.namapasien, kp.kelompokpasien, kls.namakelas, ru.namaruangan, '-' AS smf, sk1.statuskeluar, 
        //                 row_number() over (partition by pd.norec order by ddp.tglinputdiagnosa asc) as rownum,                   CASE WHEN ddp.noregistrasifk IS NOT NULL THEN dm.kddiagnosa || ', ' || dm.namadiagnosa ELSE '-' END AS namadiagnosa
        //                  FROM pasiendaftar_t AS pd LEFT OUTER JOIN
        //                 rekanan_m ON pd.objectrekananfk = rekanan_m.id LEFT OUTER JOIN
        //                 kelompokpasien_m AS kp ON rekanan_m.objectkelompokpasienfk = kp.id AND kp.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
        //                 ruangan_m AS ru ON ru.id = pd.objectruanganlastfk LEFT OUTER JOIN
        //                 kelas_m AS kls ON kls.id = pd.objectkelasfk LEFT OUTER JOIN
        //                 pasien_m AS pm ON pm.id = pd.nocmfk LEFT OUTER JOIN
        //                 statuskeluar_m AS sk1 ON sk1.id = pd.objectstatuskeluarfk LEFT OUTER JOIN
        //                 antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec AND apd.objectruanganfk = pd.objectruanganlastfk LEFT OUTER JOIN
        //                 detaildiagnosapasien_t AS ddp ON ddp.noregistrasifk = apd.norec LEFT OUTER JOIN
        //                 diagnosapasien_t AS dp ON dp.norec = ddp.objectdiagnosapasienfk LEFT OUTER JOIN
        //                 diagnosa_m AS dm ON dm.id = ddp.objectdiagnosafk
        //                 left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk
        //                 WHERE pd.tglpulang BETWEEN '$tglAwal' and '$tglAkhir' 
        //                 AND pd.statusenabled = true
        //                 AND (ru.objectdepartemenfk = '16')
        //                 --and noregistrasi='2204000515'
        //                 ) as x where x.rownum = 1
                                    
        //                  "));

        // for($m=1; $m<=$jumHari; $m++){
        //     $tglregistrasi =$bulan.'-'.$m.' 00:00:00';
        //     $tglpulang =$bulan.'-'.$m.' 23:59:59';
        //     $hariPerawatan = DB::select(DB::raw("
        //     SELECT   COUNT (x.noregistrasi) AS jumlahhariperawatan
        //                             FROM
        //                                 (
        //                                     SELECT
        //                                         pd.noregistrasi,
        //                                         pd.tglpulang,
        //                                         to_char ( pd.tglregistrasi,'MM') AS bulanregis
        //                                     FROM
        //                                         pasiendaftar_t AS pd
        //                                     INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
        //                                     WHERE
        //                                         ru.objectdepartemenfk = 16
        //                                     and pd.statusenabled=true
        //                                     AND pd.tglpulang > '$tglpulang'
        //                                     AND pd.tglregistrasi < '$tglregistrasi'
        //                                 ) AS x"
        //     ));

        //     foreach ($hariPerawatan as $item) {
        //         $jumlahhariperawatan = $jumlahhariperawatan + (int)$item->jumlahhariperawatan;              
        //     }
        // }
        $tglregistrasi =$bulan.'-'.'01 00:00:00';
        $tglpulang =$bulan.'-'.$jumHari.' 23:59:59';
        $hariPerawatan = DB::select(DB::raw("
                        select  count(x.noregistrasi)as jumlahhariperawatan from (
                            select pds.noregistrasi,pd.tglregistrasi,pd.tglpulang,pds.tglinsertsensus from pasiendaftarsensus_t as pds 
                            JOIN pasiendaftar_t as pd on pd.norec=pds.noregistrasifk where 
                            pds.tglinsertsensus BETWEEN '$tglregistrasi' and '$tglpulang' and 
                            pds.tglinsertsensus BETWEEN pd.tglregistrasi and pd.tglpulang
                            ORDER BY pds.noregistrasi,pds.tglinsertsensus
                            ) as x       
                "));
        foreach ($hariPerawatan as $item) {
            $jumlahhariperawatan = $jumlahhariperawatan + (int)$item->jumlahhariperawatan;
        }
        $hariPerawatan = DB::select(DB::raw("
                        select  count(x.noregistrasi)as jumlahhariperawatan from (
                            select pds.noregistrasi,pd.tglregistrasi,pd.tglpulang,pds.tglinsertsensus from pasiendaftarsensus_t as pds 
                            JOIN pasiendaftar_t as pd on pd.norec=pds.noregistrasifk where 
                            pds.tglinsertsensus BETWEEN '$tglregistrasi' and '$tglpulang' and 
                            pd.tglpulang is null
                            ORDER BY pds.noregistrasi,pds.tglinsertsensus
                            ) as x       
                "));
        foreach ($hariPerawatan as $item) {
            $jumlahhariperawatan = $jumlahhariperawatan + (int)$item->jumlahhariperawatan;
        }
        // return($dataTTDetail);
        //atas 17(LD) kuduna 18
        $lamaRawat = DB::select(DB::raw("
                        select sum(x.hari) as lamarawat, count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT 
                            case when to_char(tglpulang, 'YYYY-MM-DD')::TIMESTAMP=to_char(tglregistrasi, 'YYYY-MM-DD')::TIMESTAMP then 1
                             else date_part('DAY', to_char(tglpulang, 'YYYY-MM-DD')::TIMESTAMP- to_char(tglregistrasi, 'YYYY-MM-DD')::TIMESTAMP) end as hari,
                             pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        -- 	INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            WHERE
                                            pd.tglpulang BETWEEN '$tglAwal'
                            AND '$tglAkhir' and
                            ru.objectdepartemenfk = 16 
                            and pd.tglpulang is not null
                            and pd.statusenabled=true
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                         -- order by pd.noregistrasi 
                            ) as x          
                "));
        // return($lamaRawat);
        //atas 16(LD) kuduna 17
        $pasienPulangL = DB::select(DB::raw("
                        select count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT 
                            date_part('day', pd.tglregistrasi)-date_part('day',pd.tglpulang) as hari ,pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            inner join pasien_m as ps on ps.id=pd.nocmfk
                            WHERE
                                            pd.tglpulang BETWEEN '$tglAwal'
                        AND '$tglAkhir' and
                            ru.objectdepartemenfk = 16 
                            and pd.tglpulang is not null
                            and pd.statusenabled=true
                            and ps.objectjeniskelaminfk=1
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                         -- order by pd.noregistrasi 
                            ) as x       
                "));

        $pasienPulangP = DB::select(DB::raw("
                        select count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT 
                            date_part('day', pd.tglregistrasi)-date_part('day',pd.tglpulang) as hari ,pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            inner join pasien_m as ps on ps.id=pd.nocmfk
                            WHERE
                                            pd.tglpulang BETWEEN '$tglAwal'
                        AND '$tglAkhir' and
                            ru.objectdepartemenfk = 16 
                            and pd.tglpulang is not null
                            and pd.statusenabled=true
                            and ps.objectjeniskelaminfk=2
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                         -- order by pd.noregistrasi 
                            ) as x       
                "));

        $dataMeninggal = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal, 
                count(case when x.objectkondisipasienfk = '6' then 1 end ) AS jumlahlebih48,
                count(case when x.objectkondisipasienfk <> '6' then 1 end ) AS jumlahkurang48,
                count(case when x.objectjeniskelaminfk=1 then 1 end ) as jumlahmeninggall,
                count(case when x.objectjeniskelaminfk=2 then 1 end ) as jumlahmeninggalp,
                count(case when x.objectkondisipasienfk = '6' and x.objectjeniskelaminfk=1 then 1 end ) AS jumlahlebih48l,
                count(case when x.objectkondisipasienfk = '6' and x.objectjeniskelaminfk=2 then 1 end ) AS jumlahlebih48p FROM
                (
                select noregistrasi ,statuskeluar,kondisipasien,objectkondisipasienfk,ps.objectjeniskelaminfk
                from pasiendaftar_t 
                join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                join pasien_m as ps on ps.id=pasiendaftar_t.nocmfk
                LEFT JOIN ruangan_m AS ru ON ru.id = pasiendaftar_t.objectruanganlastfk
                where objectstatuskeluarfk =5
                AND ( ru.objectdepartemenfk = '16' )
                and pasiendaftar_t.tglpulang BETWEEN '$tglAwal' and '$tglAkhir'
                and pasiendaftar_t.statusenabled=true
                ) as x ;"));

        // return($dataMeninggal);
        // die();
        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $jumlahTT=(int)$sumTTs[0]->tt;
        foreach ($lamaRawat as $itemLamaRawat){
                foreach ($dataMeninggal as $itemDead) {
//                         if ($item->bulanregis == $itemLamaRawat->bulanpulang &&
//                             $itemLamaRawat->bulanpulang == $itemDead->bulanregis ) {
                    /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    if((int) $itemDead->jumlahmeninggal > 0 && (int) $itemLamaRawat->jumlahpasienpulang > 0){
                        $gdr = (int) $itemDead->jumlahmeninggal * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;
                    }
                    /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    if((int) $itemDead->jumlahlebih48 > 0 && (int) $itemLamaRawat->jumlahpasienpulang > 0){
                        $ndr = (int) $itemDead->jumlahlebih48 * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;
                    }
                    

                    $jmlMeninggal = (int) $itemDead->jumlahmeninggal ;
                    $jmlMatilebih48= (int) $itemDead->jumlahlebih48;
                    $jmlMatikurang48= (int) $itemDead->jumlahkurang48;
//                         }
                }
//                if ($item->bulanregis == $itemLamaRawat->bulanpulang ) {
                /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
//                return $this->respond($itemLamaRawat->jumlahpasienpulang );
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $alos = (int)$itemLamaRawat->lamarawat / (int)$itemLamaRawat->jumlahpasienpulang;
                }

                /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
                // $jumlahTT=1;
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $bto = (int)$itemLamaRawat->jumlahpasienpulang / $jumlahTT;
                }
//                }
            
                    /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
                    if ( (int)$jumlahhariperawatan > 0){
                        $bor = ( (int)$jumlahhariperawatan * 100 / ($jumlahTT * $jumHari));
                    }
                    /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
    //                        $toi = ( ( $jumlahTT * $numday['jumlahhari'] )- (int)$item->jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                    if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                        $toi = ( ( $jumlahTT * $jumHari)- (int)$jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                    }
                    $hariPerawatanJml = (int)$jumlahhariperawatan;
                    $jmlPasienPlg = (int)$itemLamaRawat->jumlahpasienpulang-$jmlMeninggal;
            }

        $dataTTDetail [] =array(
            'no'=> 1,
            'rumahsakit'=>'RS BHAYANGKARA TK IV CIANJUR',
            'tempattidur'=>(int)$sumTTs[0]->tt,
            'hari'=>$jumHari,
            'kunjL'=>$kunjL,
            'kunjP'=>$kunjP,
            'kunjLP'=>$kunjLP,
            'kunjLRI'=>$kunjLRI,
            'kunjPRI'=>$kunjPRI,
            'kunjLPRI'=>$kunjLPRI,
            'kunjLjiwa'=>$kunjLjiwa,
            'kunjPjiwa'=>$kunjPjiwa,
            'kunjLPjiwa'=>$kunjLPjiwa,
            'jumlahhariperawatan'=>$jumlahhariperawatan,
            'lamaRawat' =>(int)$lamaRawat[0]->lamarawat,
            'jumlahpasienpulang' =>(int)$lamaRawat[0]->jumlahpasienpulang,
            'pasienPulangL'=>(int)$pasienPulangL[0]->jumlahpasienpulang,
            'pasienPulangP'=>(int)$pasienPulangP[0]->jumlahpasienpulang,
            'pasienPulangMatiL'=>(int)$dataMeninggal[0]->jumlahmeninggall,
            'pasienPulangMatiP'=>(int)$dataMeninggal[0]->jumlahmeninggalp,
            'jumlahmeninggal'=>(int)$dataMeninggal[0]->jumlahmeninggal,
            'jumlahlebih48l'=>(int)$dataMeninggal[0]->jumlahlebih48l,
            'jumlahlebih48p'=>(int)$dataMeninggal[0]->jumlahlebih48p,
            'jumlahlebih48'=>(int)$dataMeninggal[0]->jumlahlebih48,
            'bor' =>(float) number_format($bor,2),
            'alos' =>(float) number_format($alos,2),
            'bto' =>(float) number_format($bto,2),
            'toi' => (float)number_format($toi,2),
            'gdr' => (float)number_format($gdr,2),
            'ndr' => (float) number_format($ndr,2),
            'dataTTD'=>$dataTTD,
            'datakunjL'=>$datakunjL
        );
        $result = array(
            'data' => $dataTTDetail,
            'message' => 'tukangkomputer',
        );
        return $this->respond($result);
    }
    public function getDataLaporanPasienDaftarUnand(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $idDept =  ' ';
        $paramsTgl = 'pd.tglregistrasi';

        if (isset($request['isTglPulang']) && $request['isTglPulang'] != "" && $request['isTglPulang'] != "undefined") {
            if ($request['isTglPulang'] == true) {
                $paramsTgl = 'pd.tglpulang';
            }
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan =  ' ';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idKelompok = ' ';
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            if ($idKelompok == 135 || $idKelompok == '135') {
                $idKelompok = 'and pd.objectkelompokpasienlastfk in (1,5,3)';
            } else {
                $idKelompok = 'and pd.objectkelompokpasienlastfk = ' . $request['kelompokPasien'];
            }
        }
        $idDokter = ' ';
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $idDokter = 'and pg.id  = ' . $request['idDokter'];
        }
        $tindakan = ' ';
        if (isset($request['tindakan']) && $request['tindakan'] != "" && $request['tindakan'] != "undefined") {
            $tindakan = ' and pr.id = ' . $request['tindakan'];
        }
        $kelas = ' ';
        if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
            $kelas = ' and kl.id = ' . $request['kelas'];
        }
        $PetugasPe = ' ';
        if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
            $PetugasPe = ' and ppp.objectjenispetugaspefk =' . $request['PetugasPe'];
        }
        $userinput = '';
        if (isset($request['userinput']) && $request['userinput'] != "" && $request['userinput'] != "undefined") {
            $userinput = " and pg3.namalengkap like " .  "'%" . $request['userinput'] . "%'";
        }

        $nocm = '';
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $nocm = " and pm.nocm like " .  "'%" . $request['nocm'] . "%'";
        }
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("select x.noregistrasi,x.nocm,x.namapasien,x.tgllahir,x.jk,x.namakelas,x.dokterpj,x.tglregistrasi,
                        x.tglpulang,x.namarekanan,x.ruangandaftar,x.iddepartementdaftar,x.idkelompokpasien,x.kelompokpasien,
                        x.alamatlengkap,x.namadepartemen,x.norec,x.dokterapd
                        from(SELECT pd.noregistrasi,pm.nocm,pm.namapasien,pm.tgllahir,jk.reportdisplay as jk,
                                     kl.namakelas,pg.namalengkap as dokterpj,pd.tglregistrasi,pd.tglpulang,rk.namarekanan,
                                     ru.namaruangan as ruangandaftar,ru.id as idruangandaftar,ru.objectdepartemenfk as iddepartementdaftar,
                                     klp.id as idkelompokpasien,klp.kelompokpasien,ar.asalrujukan,
                                     case when apd.statuskunjungan='BARU' then 'y' else 'n' end as statuskunjungan,
                                     alm.alamatlengkap,kdp.kondisipasien,dpt.namadepartemen,pg2.id as apddokterid, pg.namalengkap as dokterapd,
                                     br.norec
                        from pasiendaftar_t as pd
                        inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                        inner join pasien_m as pm on pm.id = pd.nocmfk
                        inner join jeniskelamin_m as jk on jk.id=pm.objectjeniskelaminfk
                        inner join ruangan_m  as ru on ru.id=apd.objectruanganfk
                        left join kelas_m as kl on kl.id=apd.objectkelasfk
                        left join pegawai_m  as pg on pg.id=pd.objectpegawaifk
                        left join pegawai_m as pg2 on pg2.id=apd.objectpegawaifk
                        left join rekanan_m  as rk on rk.id=pd.objectrekananfk
                        left join kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk
                        left join asalrujukan_m as ar on ar.id=apd.objectasalrujukanfk
                        left join alamat_m as alm on alm.nocmfk = pm.id
                        left join kondisipasien_m as kdp on kdp.id=pd.objectkondisipasienfk
                        left join departemen_m as dpt on dpt.id=ru.objectdepartemenfk
                        left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                        LEFT JOIN diagnosapasien_t as dp on dp.noregistrasifk = apd.norec
                        LEFT JOIN detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                        LEFT JOIN diagnosa_m as dg on dg.id = ddp.objectdiagnosafk
                        inner join logginguser_t as loguser on loguser.noreff = pd.norec
                        inner join loginuser_s as loginuser on loginuser.id =  loguser.objectloginuserfk
                        inner join pegawai_m as pg3 on loginuser.objectpegawaifk = pg3.id
                        WHERE  $paramsTgl between '$tglAwal' and '$tglAkhir' and br.norec is null 
                        AND (ddp.objectjenisdiagnosafk IS NULL OR ddp.objectjenisdiagnosafk IN (1,5)) 
                        $idDept
                        $idRuangan
                        $idKelompok
                        $userinput
                        $nocm
                        ) as x
                        GROUP BY x.noregistrasi,x.nocm,x.namapasien,x.tgllahir,x.jk,x.namakelas,x.dokterpj,x.tglregistrasi,
			                     x.tglpulang,x.namarekanan,x.ruangandaftar,x.iddepartementdaftar,x.idkelompokpasien,x.kelompokpasien,
			                     x.alamatlengkap,x.namadepartemen,x.norec,x.dokterapd
                        order by x.tglregistrasi"));

        return $this->respond($data);
    }
    public function getDataLaporanPasienDaftarUser(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $idDept =  ' ';
        $paramsTgl = 'pd.tglregistrasi';

        if (isset($request['isTglPulang']) && $request['isTglPulang'] != "" && $request['isTglPulang'] != "undefined") {
            if ($request['isTglPulang'] == true) {
                $paramsTgl = 'pd.tglpulang';
            }
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan =  ' ';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idKelompok = ' ';
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            if ($idKelompok == 135 || $idKelompok == '135') {
                $idKelompok = 'and pd.objectkelompokpasienlastfk in (1,5,3)';
            } else {
                $idKelompok = 'and pd.objectkelompokpasienlastfk = ' . $request['kelompokPasien'];
            }
        }
        $idDokter = ' ';
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $idDokter = 'and pg.id  = ' . $request['idDokter'];
        }
        $tindakan = ' ';
        if (isset($request['tindakan']) && $request['tindakan'] != "" && $request['tindakan'] != "undefined") {
            $tindakan = ' and pr.id = ' . $request['tindakan'];
        }
        $kelas = ' ';
        if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
            $kelas = ' and kl.id = ' . $request['kelas'];
        }
        $PetugasPe = ' ';
        if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
            $PetugasPe = ' and ppp.objectjenispetugaspefk =' . $request['PetugasPe'];
        }
        $userinput = '';
        if (isset($request['userinput']) && $request['userinput'] != "" && $request['userinput'] != "undefined") {
            $userinput = " and pg3.namalengkap like " .  "'%" . $request['userinput'] . "%'";
        }

        $nocm = '';
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $nocm = " and pm.nocm like " .  "'%" . $request['nocm'] . "%'";
        }
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("select x.namalengkap as userdaftar,x.noregistrasi,x.nocm,x.namapasien,x.tgllahir,x.jk,x.namakelas,x.noreservasi,x.tanggalreservasi,x.notelepon,x.istelemedicine,x.dokterpj,x.tglregistrasi,
                        x.tglpulang,x.namarekanan,x.ruangandaftar,x.iddepartementdaftar,x.idkelompokpasien,x.kelompokpasien,
                        x.alamatlengkap,x.namadepartemen,x.norec,x.dokterapd
                        from(SELECT pg3.namalengkap,pd.noregistrasi,pm.nocm,apr.noreservasi,apr.tanggalreservasi,apr.notelepon,pd.istelemedicine,pm.namapasien,pm.tgllahir,jk.reportdisplay as jk,
                                     kl.namakelas,pg.namalengkap as dokterpj,pd.tglregistrasi,pd.tglpulang,rk.namarekanan,
                                     ru.namaruangan as ruangandaftar,ru.id as idruangandaftar,ru.objectdepartemenfk as iddepartementdaftar,
                                     klp.id as idkelompokpasien,klp.kelompokpasien,ar.asalrujukan,
                                     case when apd.statuskunjungan='BARU' then 'y' else 'n' end as statuskunjungan,
                                     alm.alamatlengkap,kdp.kondisipasien,dpt.namadepartemen,pg2.id as apddokterid, pg.namalengkap as dokterapd,
                                     br.norec
                        from pasiendaftar_t as pd
                        inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                        inner join pasien_m as pm on pm.id = pd.nocmfk
                        inner join jeniskelamin_m as jk on jk.id=pm.objectjeniskelaminfk
                        inner join ruangan_m  as ru on ru.id=apd.objectruanganfk
                        left join kelas_m as kl on kl.id=apd.objectkelasfk
                        left join pegawai_m  as pg on pg.id=pd.objectpegawaifk
                        left join pegawai_m as pg2 on pg2.id=apd.objectpegawaifk
                        left join rekanan_m  as rk on rk.id=pd.objectrekananfk
                        left join kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk
                        left join asalrujukan_m as ar on ar.id=apd.objectasalrujukanfk
                        left join alamat_m as alm on alm.nocmfk = pm.id
                        left join kondisipasien_m as kdp on kdp.id=pd.objectkondisipasienfk
                        left join departemen_m as dpt on dpt.id=ru.objectdepartemenfk
                        left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                        LEFT JOIN diagnosapasien_t as dp on dp.noregistrasifk = apd.norec
                        LEFT JOIN detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                        left join antrianpasienregistrasi_t as apr on apr.noreservasi =pd.statusschedule and apr.nocmfk = pd.nocmfk
                        LEFT JOIN diagnosa_m as dg on dg.id = ddp.objectdiagnosafk
                        inner join logginguser_t as loguser on loguser.noreff = pd.norec
                        inner join loginuser_s as loginuser on loginuser.id =  loguser.objectloginuserfk
                        inner join pegawai_m as pg3 on loginuser.objectpegawaifk = pg3.id
                        WHERE  $paramsTgl between '$tglAwal' and '$tglAkhir' and br.norec is null 
                        AND (ddp.objectjenisdiagnosafk IS NULL OR ddp.objectjenisdiagnosafk IN (1,5)) 
                        $idDept
                        $idRuangan
                        $idKelompok
                        $userinput
                        $nocm
                        ) as x
                        GROUP BY x.namalengkap,x.noregistrasi,x.nocm,x.noreservasi,x.tanggalreservasi,x.notelepon,x.istelemedicine,x.namapasien,x.tgllahir,x.jk,x.namakelas,x.dokterpj,x.tglregistrasi,
                                 x.tglpulang,x.namarekanan,x.ruangandaftar,x.iddepartementdaftar,x.idkelompokpasien,x.kelompokpasien,
                                 x.alamatlengkap,x.namadepartemen,x.norec,x.dokterapd
                        order by x.tglregistrasi"));

        return $this->respond($data);
    }

    public function getDataLaporanPasienMasukRawatInap(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];
        $idKelompok = $request['tipe'];
        $idNamaRekanan = $request['rekanan'];
        $NotSensus = $request['isNotSensus'];
        $paramRuangan = ' ';
        $paramRuanganSatu = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and rpp.objectruanganfk = ' . $ruanganId;
        }

        $paramKelas = ' ';
        if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
            $paramKelas = ' rpp.objectkelasfk = ' . $kelasId;
        }
        $Rekanan = ' ';
        if (isset($idNamaRekanan) && $idNamaRekanan != "" && $idNamaRekanan != "undefined") {
            $Rekanan = ' and pd.objectrekananfk  = ' . $idNamaRekanan;
        }
        $Kelompok = ' ';
        if (isset($idKelompok) && $idKelompok != "" && $idKelompok != "undefined") {
            $Kelompok = ' and pd.objectkelompokpasienlastfk  = ' . $idKelompok;
        }
        if ($NotSensus == true) {

            $data = DB::select(DB::raw("
            select * from (select *,row_number() over (partition by x.noregistrasi order by x.noregistrasi asc) as rownums from(
                select loguser.jenislog,pg3.namalengkap as userdaftar,rk.namarekanan,ru1.namaruangan as ruanganasal,jkp.jeniskelompokpasien,pd.tglregistrasi,apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,
                case when apd.objectruanganasalfk is null then ru.namaruangan when ru2.objectdepartemenfk in (18,24) then ru.namaruangan else ru.namaruangan end as namaruangan,'-' as smf,apd.norec,pm.tgllahir,
                                                       -- case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa
                                                       case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,loguser.tanggal,
                                                        row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum,
                                                        case when pd.sensus = true then 'Ya' else 'Tidak' end as issensus                                           
                                                FROM pasiendaftar_t as pd
                                                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                                                --INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec 
                                                           --and rpp.objectruanganfk = apd.objectruanganfk					
                                                           --and rpp.tglmasuk = apd.tglmasuk
                                                           --and rpp.objectstatuskeluarfk is null
                                                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
                                                LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                                                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                                                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                                                left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk
                                                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                                INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk 
                                                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                                                LEFT JOIN ruangan_m as ru1 on ru1.id = pd.objectruanganasalfk 
                                                LEFT JOIN ruangan_m as ru2 on ru2.id = apd.objectruanganasalfk
                                                --and ru1.objectdepartemenfk NOT IN (18,25,28)
                                                LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                                                left join rekanan_m as rk on rk.id = pd.objectrekananfk
                                                left join logginguser_t as loguser on loguser.noreff = pd.norec 
                                                left join loginuser_s as loginuser on loginuser.id =  loguser.objectloginuserfk
                                                left join pegawai_m as pg3 on loginuser.objectpegawaifk = pg3.id
                                                where pd.tglregistrasi  BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null and ru.objectdepartemenfk = 16 and (pd.sensus != true or pd.sensus is null) and 
                                                loguser.jenislog = 'Pendaftaran Pasien' 

                                                $Rekanan
                                                $Kelompok
                                                $paramRuangan
                                                $paramKelas
                                                ) as x where x.rownum =1) as z where z.rownums =1
                                                UNION ALL 
                                                select * ,1 as rownums from  (
                                                select loguser.jenislog,pg3.namalengkap as userdaftar,rk.namarekanan,ru1.namaruangan as ruanganasal,jkp.jeniskelompokpasien,pd.tglregistrasi,apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,
                case when apd.objectruanganasalfk is null then ru.namaruangan when ru2.objectdepartemenfk in (18,24) then ru.namaruangan else ru.namaruangan end as namaruangan,'-' as smf,apd.norec,pm.tgllahir,
                                                       -- case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa
                                                       case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,loguser.tanggal,
                                                        row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum,
                                                        case when pd.sensus = true then 'Ya' else 'Tidak' end as issensus                                           
                                                FROM pasiendaftar_t as pd
                                                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                                                --INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec 
                                                           --and rpp.objectruanganfk = apd.objectruanganfk					
                                                           --and rpp.tglmasuk = apd.tglmasuk
                                                           --and rpp.objectstatuskeluarfk is null
                                                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
                                                LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                                                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                                                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                                                left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk
                                                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                                INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk 
                                                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                                                LEFT JOIN ruangan_m as ru1 on ru1.id = pd.objectruanganasalfk 
                                                LEFT JOIN ruangan_m as ru2 on ru2.id = apd.objectruanganasalfk
                                                --and ru1.objectdepartemenfk NOT IN (18,25,28)
                                                LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                                                left join rekanan_m as rk on rk.id = pd.objectrekananfk
                                                left join logginguser_t as loguser on loguser.noreff = pd.norec 
                                                left join loginuser_s as loginuser on loginuser.id =  loguser.objectloginuserfk
                                                left join pegawai_m as pg3 on loginuser.objectpegawaifk = pg3.id
                                                where pd.tglregistrasi  BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null and ru.objectdepartemenfk = 16 and (pd.sensus != true or pd.sensus is null) and 
                                                loguser.jenislog = 'Mutasi Rawat Inap' 

                                                $Rekanan
                                                $Kelompok
                                                $paramRuangan
                                                $paramKelas
                                                 ) as x where x.rownum =1 order by noregistrasi,tanggal desc"));
        } else {
            $data = DB::select(DB::raw("
            select * from (select *,row_number() over (partition by x.noregistrasi order by x.noregistrasi asc) as rownums from(
                select loguser.jenislog,pg3.namalengkap as userdaftar,rk.namarekanan,ru1.namaruangan as ruanganasal,jkp.jeniskelompokpasien,pd.tglregistrasi,apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,
                case when apd.objectruanganasalfk is null then ru.namaruangan when ru2.objectdepartemenfk in (18,24) then ru.namaruangan else ru.namaruangan end as namaruangan,'-' as smf,apd.norec,pm.tgllahir,
                                                       -- case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa
                                                       case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,loguser.tanggal,
                                                        row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum,
                                                        case when pd.sensus = true then 'Ya' else 'Tidak' end as issensus                                           
                                                FROM pasiendaftar_t as pd
                                                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                                                --INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec 
                                                           --and rpp.objectruanganfk = apd.objectruanganfk					
                                                           --and rpp.tglmasuk = apd.tglmasuk
                                                           --and rpp.objectstatuskeluarfk is null
                                                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
                                                LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                                                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                                                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                                                left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk
                                                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                                INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk 
                                                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                                                LEFT JOIN ruangan_m as ru1 on ru1.id = pd.objectruanganasalfk 
                                                LEFT JOIN ruangan_m as ru2 on ru2.id = apd.objectruanganasalfk
                                                LEFT JOIN ruangan_m as ru3 on ru3.id = pd.objectruanganlastfk
                                                --and ru1.objectdepartemenfk NOT IN (18,25,28)
                                                LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                                                left join rekanan_m as rk on rk.id = pd.objectrekananfk
                                                left join logginguser_t as loguser on loguser.noreff = pd.norec 
                                                left join loginuser_s as loginuser on loginuser.id =  loguser.objectloginuserfk
                                                left join pegawai_m as pg3 on loginuser.objectpegawaifk = pg3.id
                                                where pd.tglregistrasi  BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null and ru3.objectdepartemenfk = 16 and pd.sensus = true and 
                                                loguser.jenislog = 'Pendaftaran Pasien'  
                                                $Rekanan
                                                $Kelompok
                                                $paramRuangan
                                                $paramKelas
                                                ) as x where x.rownum =1) as z where z.rownums =1
                                                UNION ALL 
                                                select * ,1 as rownums from  (
                                                select loguser.jenislog,pg3.namalengkap as userdaftar,rk.namarekanan,ru1.namaruangan as ruanganasal,jkp.jeniskelompokpasien,pd.tglregistrasi,apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,
                case when apd.objectruanganasalfk is null then ru.namaruangan when ru2.objectdepartemenfk in (18,24) then ru.namaruangan else ru.namaruangan end as namaruangan,'-' as smf,apd.norec,pm.tgllahir,
                                                       -- case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa
                                                       case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,loguser.tanggal,
                                                        row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum,
                                                        case when pd.sensus = true then 'Ya' else 'Tidak' end as issensus                                           
                                                FROM pasiendaftar_t as pd
                                                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                                                --INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec 
                                                           --and rpp.objectruanganfk = apd.objectruanganfk					
                                                           --and rpp.tglmasuk = apd.tglmasuk
                                                           --and rpp.objectstatuskeluarfk is null
                                                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
                                                LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                                                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                                                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                                                left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk
                                                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                                INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk 
                                                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                                                LEFT JOIN ruangan_m as ru1 on ru1.id = pd.objectruanganasalfk 
                                                LEFT JOIN ruangan_m as ru2 on ru2.id = apd.objectruanganasalfk
                                                LEFT JOIN ruangan_m as ru3 on ru3.id = pd.objectruanganlastfk
                                                --and ru1.objectdepartemenfk NOT IN (18,25,28)
                                                LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                                                left join rekanan_m as rk on rk.id = pd.objectrekananfk
                                                left join logginguser_t as loguser on loguser.noreff = pd.norec 
                                                left join loginuser_s as loginuser on loginuser.id =  loguser.objectloginuserfk
                                                left join pegawai_m as pg3 on loginuser.objectpegawaifk = pg3.id
                                                where pd.tglregistrasi  BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null and ru3.objectdepartemenfk = 16 and pd.sensus = true and 
                                                loguser.jenislog = 'Mutasi Rawat Inap'  
                                                $Rekanan
                                                $Kelompok
                                                $paramRuangan
                                                $paramKelas
                                                 ) as x where x.rownum =1 order by noregistrasi,tglmasuk asc"));
        }
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataLaporanPasienMasukRawatInapri(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];
        $idKelompok = $request['tipe'];
        $idNamaRekanan = $request['rekanan'];
     
  
       
        $dataRI = \DB::table('antrianpasiendiperiksa_t as apd')
        ->leftjoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
        ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
        ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
        ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->leftjoin('kelas_m as kls','kls.id','=','apd.objectkelasfk')
        ->select(DB::raw('ROW_NUMBER() OVER (ORDER BY ru.namaruangan) AS nomor,ru.id as idruangan,pd.noregistrasi,ps.nocm,ps.namapasien,
                        ru.namaruangan,ru2.namaruangan as ruanganasal,apd.statuskunjungan,apd.objectruanganasalfk,pd.objectrekananfk,apd.objectasalrujukanfk,
                        apd.objectstatuspulangfk,pd.statusenabled,apd.statusenabled as batalkonsul,ps.objectjeniskelaminfk,rk.namarekanan,
	apd.tglmasuk,kls.namakelas'))
        ->where('pd.statusenabled', true)
        ->where('apd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $dataRI = $dataRI->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $dataRI = $dataRI->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($idNamaRekanan) && $idNamaRekanan != "" && $idNamaRekanan != "undefined") {
            $dataRI = $dataRI->where ('pd.objectrekananfk' ,'=', $idNamaRekanan);
        }
        if (isset($idKelompok) && $idKelompok != "" && $idKelompok != "undefined") {
            $dataRI = $dataRI->where ('pd.objectkelompokpasienlastfk','=',$idKelompok);
        }
        $dataRI = $dataRI->where('ru.objectdepartemenfk', '=', 16);

        $dataRI = $dataRI->orderby('ru.namaruangan');
        $dataRI = $dataRI->get();
        $result = array(
            'data' => $dataRI,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataLaporanPasienKeluarRuanganRawatInap(Request $request)
    {
        $data = [];
        $tglAyeuna = date('Y-m-d H:i:s');
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];
        $idKelompok = $request['tipe'];
        $idNamaRekanan = $request['rekanan'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and apd.objectruanganfk = ' . $ruanganId;
        }

        $paramKelas = ' ';
        if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
            $paramKelas = ' and pd.objectkelasfk  = ' . $kelasId;
        }
        $Rekanan = ' ';
        if (isset($idNamaRekanan) && $idNamaRekanan != "" && $idNamaRekanan != "undefined") {
            $Rekanan = ' and pd.objectrekananfk  = ' . $idNamaRekanan;
        }
        $Kelompok = ' ';
        if (isset($idKelompok) && $idKelompok != "" && $idKelompok != "undefined") {
            $Kelompok = ' and pd.objectkelompokpasienlastfk  = ' . $idKelompok;
        }

        // $data = DB::select(DB::raw("select * from  (
        //                 select pd.tglregistrasi,pd.tglpulang,apd.tglkeluar,apd.tglmasuk,pm.nocm,pd.noregistrasi,
        //                 pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,sk1.statuskeluar,
        //                 -- case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa
        //                 case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,
        //                    row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum      
        //                 FROM pasiendaftar_t as pd
        //                 INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        //                 and apd.objectruanganfk = pd.objectruanganlastfk
        //                 and apd.tglkeluar = pd.tglpulang
        //                 LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec 
        //                 LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                 INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                 INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                 INNER JOIN kelas_m as kls on kls.id = pd.objectkelasfk
        //                 LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                 JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //                 INNER JOIN statuskeluar_m as sk1 on sk1.id = pd.objectstatuskeluarfk
        //                 WHERE pd.tglpulang BETWEEN '$tglAwal' and '$tglAkhir' 
        //                 and pd.tglmeninggal is null
        //                 and pd.statusenabled =1
        //                 $paramRuangan
        //                 $paramKelas
        //                 ) as x where x.rownum=1

        //                  "));
        //ciri sensus
        $data = DB::select(DB::raw("select * from  (
                      SELECT        jkp.jeniskelompokpasien,pd.tglregistrasi,case when rekanan_m.namarekanan is null then 'Umum' else rekanan_m.namarekanan end as namarekanan, pd.tglpulang, apd.tglkeluar, apd.tglmasuk, pm.nocm, pd.noregistrasi, pm.namapasien, kp.kelompokpasien, kls.namakelas, ru.namaruangan, '-' AS smf, sk1.statuskeluar, 
                        row_number() over (partition by pd.norec order by ddp.tglinputdiagnosa asc) as rownum,                   CASE WHEN ddp.noregistrasifk IS NOT NULL THEN dm.kddiagnosa || ', ' || dm.namadiagnosa ELSE '-' END AS namadiagnosa
                         FROM pasiendaftar_t AS pd LEFT OUTER JOIN
                        rekanan_m ON pd.objectrekananfk = rekanan_m.id LEFT OUTER JOIN
                        kelompokpasien_m AS kp ON rekanan_m.objectkelompokpasienfk = kp.id AND kp.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
                        ruangan_m AS ru ON ru.id = pd.objectruanganlastfk LEFT OUTER JOIN
                        kelas_m AS kls ON kls.id = pd.objectkelasfk LEFT OUTER JOIN
                        pasien_m AS pm ON pm.id = pd.nocmfk LEFT OUTER JOIN
                        statuskeluar_m AS sk1 ON sk1.id = pd.objectstatuskeluarfk LEFT OUTER JOIN
                        antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec AND apd.objectruanganfk = pd.objectruanganlastfk LEFT OUTER JOIN
                        detaildiagnosapasien_t AS ddp ON ddp.noregistrasifk = apd.norec LEFT OUTER JOIN
                        diagnosapasien_t AS dp ON dp.norec = ddp.objectdiagnosapasienfk LEFT OUTER JOIN
                        diagnosa_m AS dm ON dm.id = ddp.objectdiagnosafk
                        left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk
                        WHERE pd.tglpulang BETWEEN '$tglAwal' and '$tglAkhir' 
                        AND pd.statusenabled = true
                        AND (ru.objectdepartemenfk = '16')
                        --and noregistrasi='2204000515'
                        $Kelompok
                        $Rekanan
                        $paramRuangan
                        $paramKelas
                        ) as x where x.rownum = 1
                                    
                         "));


        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
        //pulang sensus
    }
    public function getDataLaporanPasienPindahan(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];
        $idKelompok = $request['tipe'];
        $idNamaRekanan = $request['rekanan'];
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and rpp.objectruanganfk = ' . $ruanganId;
        }

        $paramKelas = ' ';
        if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
            $paramKelas = ' and rpp.objectkelasfk  = ' . $kelasId;
        }

        $data = DB::select(DB::raw("select * from (
  select jkp.jeniskelompokpasien,pd.tglregistrasi,apd.tglkeluar,apd.tglmasuk,rpp.tglpindah,pm.nocm,pd.noregistrasi,
                                           pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan as ruanganskrng,'-' as smf,
                                           -- case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,
                                           case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,
                                           rpp.objectruanganasalfk,rpp.objectruanganfk,ru1.namaruangan as ruangansblm,
                                           row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum,
                                           row_number() over (partition by apd.objectruanganfk ,pd.noregistrasi order by apd.tglmasuk asc) as rownum_ru
                                          FROM pasiendaftar_t as pd
                                          INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                                          INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec 
                                                   and apd.objectruanganfk = rpp.objectruanganfk
                                                   and apd.tglmasuk = rpp.tglpindah
                                                   and rpp.objectstatuskeluarfk = 2
                                          LEFT  JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
                                          LEFT  JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                                          LEFT  JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                                          INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                                          INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                          INNER JOIN kelas_m as kls on kls.id = rpp.objectkelasfk
                                          LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                                          LEFT JOIN ruangan_m as ru on ru.id = rpp.objectruanganfk
                                          LEFT JOIN ruangan_m as ru1 on ru1.id = rpp.objectruanganasalfk
                                          INNER JOIN statuskeluar_m as sk1 on sk1.id = rpp.objectstatuskeluarfk
                                          left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk
                                          WHERE rpp.tglpindah BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null 
                                          $paramRuangan
                                          $paramKelas
                                          ) as x where x.rownum =1
                                          --and x.rownum_ru =1
                                          "));
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataLaporanPasienMeninggalRuangan(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and apd.objectruanganfk = ' . $ruanganId;
        }

        $paramKelas = ' ';
        if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
            $paramKelas = ' and apd.objectkelasfk  = ' . $kelasId;
        }

        // $data = DB::select(DB::raw("select apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,
        //                                          -- case when dm.namadiagnosa = '-' then '-, ' || ddp.keterangan when dm.namadiagnosa = '-' and ddp.keterangan is null then '-' else dm.kddiagnosa || ', ' || dm.namadiagnosa end as namadiagnosa,
        //                                          case when dm.namadiagnosa = '-' then '-, ' + ddp.keterangan when dm.namadiagnosa = '-' and ddp.keterangan is null then '-' else dm.kddiagnosa || ', ' || dm.namadiagnosa end as namadiagnosa,
        //                                          pd.tglregistrasi,pd.tglpulang,pd.tglmeninggal
        //                             FROM pasiendaftar_t as pd
        //                             INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        //                             LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1
        //                             LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                             LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                             INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                             INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                             INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk
        //                             INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
        //                             LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                             where pd.tglmeninggal BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null                                   
        //                             and pd.objectstatuskeluarfk = 5
        //                             $paramRuangan
        //                             $paramKelas"));

        // $data = DB::select(DB::raw("SELECT jkp.jeniskelompokpasien,pd.norec AS norec_pd,pd.tglregistrasi,kp.kesatuanpasien,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,rk.namarekanan,
        //                     CASE
        //                 WHEN pd.objectpenyebabkematianfk = 4 THEN
        //                     pd.keteranganpenyebabkematian
        //                 ELSE
        //                     pk.penyebabkematian
        //                 END AS penyebabkematian,
        //                 pd.tglmeninggal,
        //                 ru.namaruangan
        //                 FROM
        //                     [pasiendaftar_t] AS [pd]
        //                 INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
        //                 INNER JOIN [jeniskelamin_m] AS [jk] ON [jk].[id] = [ps].[objectjeniskelaminfk]
        //                 LEFT JOIN [rekanan_m] AS [rk] ON [rk].[id] = [pd].[objectrekananfk]
        //                 LEFT JOIN [statuskeluar_m] AS [sk] ON [sk].[id] = [pd].[objectstatuskeluarfk]
        //                 LEFT JOIN [kesatuanpasien_m] AS [kp] ON [kp].[id] = [ps].[objectkesatuanfk]
        //                 LEFT JOIN [statuspulang_m] AS [sp] ON [sp].[id] = [pd].[objectstatuspulangfk]
        //                 LEFT JOIN [penyebabkematian_m] AS [pk] ON [pk].[id] = [pd].[objectpenyebabkematianfk]
        //                 LEFT JOIN [ruangan_m] AS [ru] ON [ru].[id] = [pd].[objectruanganlastfk]
        //                 left join [jeniskelompokpasien_m] as [jkp] on [jkp].[id] = [ps].[objectjeniskelompokpasienfk]
        //                 --LEFT JOIN [antrianpasiendiperiksa_t] AS [apd] ON [apd].[noregistrasifk] = [pd].[norec]
        //                 WHERE
        //                     [pd].[objectstatuskeluarfk] = 5 and ru.objectdepartemenfk<>5
        //                     AND pd.tglmeninggal BETWEEN '$tglAwal' and '$tglAkhir'
        //                     AND pd.objectpenyebabkematianfk NOT IN (7)"));

                            
        $data = DB::select(DB::raw("select * from
            (SELECT jkp.jeniskelompokpasien,pd.norec AS norec_pd,pd.tglregistrasi,kp.kesatuanpasien,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,
            sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,rk.namarekanan,
            CASE
            WHEN pd.objectpenyebabkematianfk = 4 THEN
            pd.keteranganpenyebabkematian
            ELSE
            pk.penyebabkematian
            END AS penyebabkematian,
            pd.tglmeninggal,
            ru.namaruangan, row_number() over (partition by pd.noregistrasi order by pd.noregistrasi asc) AS rownum,
            CASE WHEN ddp.noregistrasifk IS NOT NULL THEN dm.kddiagnosa || ', ' || dm.namadiagnosa ELSE '-' END AS namadiagnosa
            FROM
            pasiendaftar_t AS pd
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
            INNER JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
            LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
            LEFT JOIN statuskeluar_m AS sk ON sk.id = pd.objectstatuskeluarfk
            LEFT JOIN kesatuanpasien_m AS kp ON kp.id = ps.objectkesatuanfk
            LEFT JOIN statuspulang_m AS sp ON sp.id = pd.objectstatuspulangfk
            LEFT JOIN penyebabkematian_m AS pk ON pk.id = pd.objectpenyebabkematianfk
            LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            left join jeniskelompokpasien_m as jkp on jkp.id = ps.objectjeniskelompokpasienfk
            LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1
            LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
            WHERE
            pd.objectstatuskeluarfk = 5 and  ( ru.objectdepartemenfk = '16' )
            AND pd.tglmeninggal BETWEEN '$tglAwal' and '$tglAkhir'
            -- AND pd.objectpenyebabkematianfk NOT IN (7)
            ) as x where x.rownum = 1
            "));
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataLaporanPasienMeninggalDOA(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and apd.objectruanganfk = ' . $ruanganId;
        }

        $paramKelas = ' ';
        if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
            $paramKelas = ' and apd.objectkelasfk  = ' . $kelasId;
        }

        // $data = DB::select(DB::raw("select apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,
        //                                          -- case when dm.namadiagnosa = '-' then '-, ' || ddp.keterangan when dm.namadiagnosa = '-' and ddp.keterangan is null then '-' else dm.kddiagnosa || ', ' || dm.namadiagnosa end as namadiagnosa,
        //                                          case when dm.namadiagnosa = '-' then '-, ' + ddp.keterangan when dm.namadiagnosa = '-' and ddp.keterangan is null then '-' else dm.kddiagnosa || ', ' || dm.namadiagnosa end as namadiagnosa,
        //                                          pd.tglregistrasi,pd.tglpulang,pd.tglmeninggal
        //                             FROM pasiendaftar_t as pd
        //                             INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        //                             LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1
        //                             LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                             LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                             INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                             INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                             INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk
        //                             INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
        //                             LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                             where pd.tglmeninggal BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null                                   
        //                             and pd.objectstatuskeluarfk = 5
        //                             $paramRuangan
        //                             $paramKelas"));
        $data = DB::select(DB::raw("SELECT jkp.jeniskelompokpasien,pd.norec AS norec_pd,pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,rk.namarekanan,
                        pk.penyebabkematian,
                        pd.tglmeninggal,
                        ru.namaruangan
                        FROM
                            pasiendaftar_t AS pd
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                        LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                        LEFT JOIN statuskeluar_m AS sk ON sk.id = pd.objectstatuskeluarfk
                        LEFT JOIN statuspulang_m AS sp ON sp.id = pd.objectstatuspulangfk
                        LEFT JOIN penyebabkematian_m AS pk ON pk.id = pd.objectpenyebabkematianfk
                        LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                        left join jeniskelompokpasien_m as jkp on jkp.id = ps.objectjeniskelompokpasienfk
                        --LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        WHERE
                            pd.objectstatuskeluarfk = 5 and ru.objectdepartemenfk<>5
                            AND pd.tglmeninggal BETWEEN '$tglAwal' and '$tglAkhir'
                            AND pd.objectpenyebabkematianfk IN (7)"));
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataLaporanInformasiRuangan(Request $request)
    {
        //         $data = [];
        //         $tglAwal = $request['tglAwal'];
        //         $tglAkhir = $request['tglAkhir'];
        //         $tglKamariAwal =$request['kamari'].' 00:00';
        //            $tglKamariAkhir=$request['kamari'].' 23:59';
        //         $date = $request['tglAkhirKemarin'];
        //         $tglAwalKemarin = Carbon::parse($tglAwal)->subDays(1);
        //         $tglAkhirKemarin = Carbon::parse($date)->subDays(1);
        //         $ruanganId = $request['idRuangan'];
        //         $kelasId = $request['idkelas'];

        //         $paramRuangan = '';
        //         $paramRuanganSatu = '';
        //         $paramRuanganKeluar = '';
        //         $paramRuanganPindah = '';
        //         $paramRuanganDiPindah = '';
        //         if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
        //             $paramRuangan = ' and apd.objectruanganfk = ' . $ruanganId;
        //             $paramRuanganSatu = ' and pd.objectruanganlastfk = ' . $ruanganId;
        //             $paramRuanganKeluar = ' and apd.objectruanganfk = ' . $ruanganId;
        //             $paramRuanganPindah = ' and rpp.objectruanganfk = ' . $ruanganId;
        //             $paramRuanganDiPindah = ' and rpp.objectruanganasalfk = ' . $ruanganId;
        //         }

        //         $paramKelas = ' ';
        //         $paramKelasApd = '';
        //              $paramKelaspd = '';
        //         if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
        //             $paramKelas = ' and rpp.objectkelasfk  = ' . $kelasId;
        //             $paramKelasApd = ' and apd.objectkelasfk  = ' . $kelasId;
        //               $paramKelaspd = ' and pd.objectkelasfk  = ' . $kelasId;
        //         }
        //         $data = DB::select(DB::raw("

        //                   select * from (select *,row_number() over (partition by x.noregistrasi order by x.tglmasuk desc) as rownums from(select pd.tglregistrasi,apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,
        //                                            case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,apd.norec,
        //                                            row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum
        //                                     FROM pasiendaftar_t as pd
        //                                     INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
        //                                     INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec
        //                                                and rpp.objectruanganfk = apd.objectruanganfk					
        //                                                and rpp.tglmasuk = apd.tglmasuk
        //                                                and rpp.objectstatuskeluarfk is null
        //                                     LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
        //                                     LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                                     LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                                     INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                                     INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                                     INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk 
        //                                     INNER JOIN ruangan_m as ru on ru.id = rpp.objectruanganfk
        //                                     LEFT JOIN ruangan_m as ru1 on ru1.id = rpp.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (18,25,28)
        //                                     LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                                     where apd.tglmasuk BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null                                                                           
        //                                     $paramRuanganPindah
        //                                     $paramKelas
        //                                     ) as x where  x.rownum =1 ) as z where z.rownums =1
        //                                     UNION ALL 
        //                                       select *,1 as rownums  from  (
        //                                     select pd.tglregistrasi,apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,
        //                                            case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa,apd.norec,
        //                                                  row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum
        //                                     FROM pasiendaftar_t as pd
        //                                     INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
        //                                     INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec
        //                                                and rpp.objectruanganfk = apd.objectruanganfk					
        //                                                and rpp.tglmasuk = apd.tglmasuk
        //                                                and rpp.objectstatuskeluarfk <> 2
        //                                     LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
        //                                     LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                                     LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                                     INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                                     INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                                     INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk 
        //                                     INNER JOIN ruangan_m as ru on ru.id = rpp.objectruanganfk
        //                                     LEFT JOIN ruangan_m as ru1 on ru1.id = rpp.objectruanganasalfk and ru1.objectdepartemenfk NOT IN (18,25,28)
        //                                     LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                                     where apd.tglmasuk  BETWEEN'$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null                                                                           
        //                                     $paramRuanganPindah
        //                                     $paramKelas

        //                                     ) as x where  x.rownum =1 "));
        // //        $dataKemarin = DB::select(DB::raw("select apd.tglmasuk,apd.tglkeluar,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien
        // //                                    FROM pasiendaftar_t as pd
        // //                                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        // //                                    LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        // //                                    INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        // //                                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        // //                                    INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk
        // //                                    INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
        // //                                    where apd.tglkeluar > '$tglAkhirKemarin' and apd.tglmasuk < '$tglAwal' and br.pasiendaftarfk is null
        // //                                    $paramRuangan
        // //                                    $paramKelasApd"));
        //             $dateFirst = date('Y-m-d').' 00:00';
        //             $dateLast = date('Y-m-d').' 23:59';
        //             $dataKemarin = DB::select(DB::raw("  SELECT
        //                         pd.noregistrasi,
        //                         pd.tglpulang
        //                     FROM
        //                         pasiendaftar_t AS pd
        //                     INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
        //                     WHERE
        //                         ru.objectdepartemenfk = 16  and(
        //                      pd.tglregistrasi  < '$dateFirst' 
        //                     and pd.tglpulang  >= '$dateLast' 
        //                     )
        //                  OR (pd.tglpulang IS NULL and pd.tglregistrasi < '$dateLast') 
        //                     and pd.statusenabled = true 
        //                                        $paramRuangan
        //                                     $paramKelaspd "));
        //         // $dataKemarin = DB::select(DB::raw("select apd.tglmasuk,apd.tglkeluar,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien
        //         //                             FROM pasiendaftar_t as pd
        //         //                             INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        //         //                             LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //         //                             INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //         //                             INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //         //                             INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk
        //         //                             INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
        //         //                             where
        //         //                             -- ru.objectdepartemenfk=16 
        //         //                             --and  (  pd.tglregistrasi < '$tglKamariAwal' AND pd.tglpulang >= '$tglKamariAwal' 
        //         //                             --)
        //         //                             --or pd.tglpulang is null
        //         //                             --and pd.statusenabled = true 
        //         //                             apd.tglmasuk < '$tglAkhirKemarin' and br.pasiendaftarfk is null 
        //         //                            -and apd.tglkeluar is null                                   
        //         //                             $paramRuangan
        //         //                             $paramKelasApd"));
        //         $dataAskes = DB::select(DB::raw("select apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien
        //                                     FROM pasiendaftar_t as pd
        //                                     INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec                                                                      
        //                                     LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                                     INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                                     INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk                                    
        //                                     INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk                                    
        //                                     where apd.tglmasuk BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null
        //                                     and kp.id in (2,4)
        //                                     $paramRuanganSatu
        //                                     $paramKelasApd"));
        //         $dataKeluar = DB::select(DB::raw("select * from (
        // select pd.tglregistrasi,pd.tglpulang,apd.tglkeluar,apd.tglmasuk,pm.nocm,pd.noregistrasi,
        //                                            pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,
        //                                            case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa
        //                                            else '-' end as namadiagnosa,sk1.statuskeluar,
        //                                                  row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum
        //                                     FROM pasiendaftar_t as pd
        //                                     INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
        //                                                and apd.objectruanganfk = pd.objectruanganlastfk
        //                                                and apd.tglkeluar = pd.tglpulang
        //                                     LEFT  JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
        //                                     LEFT  JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                                     LEFT  JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                                     INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                                     INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                                     INNER JOIN kelas_m as kls on kls.id = pd.objectkelasfk
        //                                     LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                                     JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //                                     INNER JOIN statuskeluar_m as sk1 on sk1.id = pd.objectstatuskeluarfk
        //                                     WHERE pd.tglpulang BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk IS NULL 
        //                                           and pd.tglmeninggal is null
        //                                     $paramRuanganKeluar
        //                                     $paramKelas
        //                                     ) as x where x.rownum=1"));
        //         $dataPindah = DB::select(DB::raw("select * from (
        // select pd.tglregistrasi,apd.tglkeluar,apd.tglmasuk,rpp.tglpindah,pm.nocm,pd.noregistrasi,
        //                                            pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,
        //                                            case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa
        //                                            else '-' end as namadiagnosa,rpp.objectruanganasalfk,rpp.objectruanganfk,
        //                                                  row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum
        //                                            FROM pasiendaftar_t as pd
        //                                           INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
        //                                           INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec 
        //                                                    and apd.objectruanganfk = rpp.objectruanganfk
        //                                                    and apd.tglmasuk = rpp.tglpindah		
        //                                                    and rpp.objectstatuskeluarfk = 2
        //                                           LEFT  JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
        //                                           LEFT  JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                                           LEFT  JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                                           INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                                           INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                                           INNER JOIN kelas_m as kls on kls.id = rpp.objectkelasfk
        //                                           LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                                           LEFT JOIN ruangan_m as ru on ru.id = rpp.objectruanganfk
        //                                           INNER JOIN statuskeluar_m as sk1 on sk1.id = rpp.objectstatuskeluarfk
        //                                           WHERE rpp.tglpindah BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null                                          
        //                                           $paramRuangan
        //                                           $paramKelas
        //                                           ) as x where x.rownum=1"));
        //       
        //         $dataMinggal = DB::select(DB::raw("select * from (select apd.tglmasuk,pm.nocm,pd.noregistrasi,pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan,'-' as smf,
        //                                                  case when dm.namadiagnosa = '-' then '-, ' + ddp.keterangan 
        //                                                  when dm.namadiagnosa = '-' and ddp.keterangan is null then '-'
        //                                                  else dm.kddiagnosa || ', ' || dm.namadiagnosa end as namadiagnosa,
        //                                                  pd.tglregistrasi,pd.tglpulang,pd.tglmeninggal,
        //                                                        row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum
        //                                     FROM pasiendaftar_t as pd
        //                                     INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        //                                     LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1
        //                                     LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        //                                     LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //                                     INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        //                                     INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //                                     INNER JOIN kelas_m as kls on kls.id = apd.objectkelasfk
        //                                     INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
        //                                     LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        //                                     where pd.tglmeninggal BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null                                   
        //                                     and pd.objectstatuskeluarfk = 5
        //                                     $paramRuangan
        //                                     $paramKelasApd) as x where x.rownum=1"));
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];
        $paramRuangan = '';
        $paramRuanganSatu = '';
        $paramRuanganKeluar = '';
        $paramRuanganPindah = '';
        $paramRuanganDiPindah = '';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and apd.objectruanganfk = ' . $ruanganId;
            $paramRuanganSatu = ' and pd.objectruanganlastfk = ' . $ruanganId;
            $paramRuanganKeluar = ' and apd.objectruanganfk = ' . $ruanganId;
            $paramRuanganPindah = ' and rpp.objectruanganfk = ' . $ruanganId;
            $paramRuanganDiPindah = ' and rpp.objectruanganasalfk = ' . $ruanganId;
        }

        $paramKelas = ' ';
        $paramKelasApd = '';
        $paramKelaspd = '';
        if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
            $paramKelas = ' and rpp.objectkelasfk  = ' . $kelasId;
            $paramKelasApd = ' and apd.objectkelasfk  = ' . $kelasId;
            $paramKelaspd = ' and pd.objectkelasfk  = ' . $kelasId;
        }
        $yesterday = Carbon::now()->subDays(1)->format('Y-m-d');

        $tglAwalKemarin = $yesterday . ' 00:00';
        $tglAkhirKemarin = $yesterday . ' 23:59';
        $dateFirst = date('Y-m-d') . ' 00:00';
        $dateLast = date('Y-m-d') . ' 23:59';
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $dataKemarin = DB::select(DB::raw("  SELECT
                        pd.noregistrasi,
                        pd.tglpulang
                    FROM
                        pasiendaftar_t AS pd
                    INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                    WHERE
                    ru.objectdepartemenfk = 16  and(
                    pd.tglregistrasi  < '$tglAwalKemarin' 
                    and pd.tglpulang  >= '$tglAkhirKemarin' 
                    )
                    OR (pd.tglpulang IS NULL and pd.tglregistrasi < '$tglAkhirKemarin') 
                    and pd.statusenabled = true 
                    $paramKelaspd
                    $paramRuanganSatu "));
        //    $hariini = DB::select(DB::raw("SELECT
        //             pd.noregistrasi,
        //             pd.tglpulang,
        //             pd.objectkelompokpasienlastfk,
        //             pd.objectstatuskeluarfk
        //         FROM
        //             pasiendaftar_t AS pd
        //         INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
        //         WHERE
        //         ru.objectdepartemenfk = 16 
        //         and pd.tglpulang  is null

        //         and pd.statusenabled = true 
        //         $paramRuanganSatu
        //         $paramKelaspd "));
        $hariini = DB::select(DB::raw("SELECT
                        *
                FROM
                    (
                        SELECT
                            pd.tglregistrasi,
                            p.nocm,
                            pd.noregistrasi,
                            ru.namaruangan,
                            p.namapasien,
                            kp.kelompokpasien,
                            rk.namarekanan,
                            kls.namakelas,
                            alm.alamatlengkap,
                            jk.jeniskelamin,
                            pg.namalengkap AS namadokter,
                            pd.norec AS norec_pd,
                            pd.tglpulang,
                            pd.statuspasien,
                            p.tgllahir,
                            pd.objectruanganlastfk,
                            pd.objectkelasfk,
                            apd.objectkamarfk,
                            kmr.namakamar,
                            apd.nobed,
                            tt.reportdisplay AS namabed,
                            pd.objectkelompokpasienlastfk,
                        row_number () OVER (
                            partition BY pd.noregistrasi
                            ORDER BY
                                apd.tglmasuk DESC
                        ) AS rownum
                    FROM
                        pasiendaftar_t AS pd
                    INNER JOIN antrianpasiendiperiksa_t AS apd ON pd.norec = apd.noregistrasifk AND pd.objectruanganlastfk = apd.objectruanganfk--inner join registrasipelayananpasien_t as rpp on rpp.noregistrasifk=pd.norec
                    INNER JOIN pasien_m AS p ON p.id = pd.nocmfk
                    INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                    INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                    INNER JOIN jeniskelamin_m AS jk ON jk.id = p.objectjeniskelaminfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                    LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                    LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                    LEFT JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk --LEFT JOIN batalregistrasi_t AS br ON pd.norec = br.pasiendaftarfk
                    LEFT JOIN kamar_m AS kmr ON kmr.id = apd.objectkamarfk
                    LEFT JOIN tempattidur_m AS tt ON tt.id = apd.nobed
                    LEFT JOIN alamat_m AS alm ON alm.nocmfk = p.id
                    WHERE
                        pd.statusenabled = true
                    
                    AND pd.tglpulang IS NULL
                    AND ru.objectdepartemenfk = 16
                    
                    ) AS x
                WHERE
                    x.rownum = 1       
                $paramRuanganSatu
                $paramKelaspd "));
        $pulang = DB::select(DB::raw("SELECT
                    pd.noregistrasi,
                    pd.tglpulang,
                    pd.objectkelompokpasienlastfk,
                    pd.objectstatuskeluarfk
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                ru.objectdepartemenfk = 16 
                and pd.tglpulang between '$dateFirst' and '$dateLast'
                
                and pd.statusenabled = true 
                $paramRuanganSatu
                $paramKelaspd "));
        $pulangMeninggal = DB::select(DB::raw("SELECT
                pd.noregistrasi,
                pd.tglpulang,
                pd.objectkelompokpasienlastfk,
                pd.objectstatuskeluarfk
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                ru.objectdepartemenfk = 16 
                and pd.tglmeninggal between '$tglAwal' and '$tglAkhir'
                
                and pd.statusenabled = true 
                $paramRuanganSatu
                $paramKelaspd "));
        $masuk = DB::select(DB::raw("  SELECT
                    pd.noregistrasi,
                    pd.tglpulang
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                ru.objectdepartemenfk = 16 
                and pd.tglregistrasi  between '$dateFirst' and '$dateLast'
                
                and pd.statusenabled = true 
                $paramRuanganSatu
                $paramKelaspd "));


        $dataDipindahkan = DB::select(DB::raw("
               SELECT
                pd.tglregistrasi,pd.noregistrasi,rpp.tglpindah,apd.tglkeluar,
                sk1.statuskeluar,rpp.objectruanganfk,
                rpp.objectruanganasalfk ,ru2.namaruangan as asal,ru.namaruangan
                FROM
                    pasiendaftar_t AS pd
                  INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                INNER JOIN registrasipelayananpasien_t AS rpp ON rpp.noregistrasifk = pd.norec
                AND apd.tglkeluar = rpp.tglpindah
                AND rpp.objectstatuskeluarfk = 2
                  INNER JOIN statuskeluar_m as sk1 on sk1.id = rpp.objectstatuskeluarfk
                inner join ruangan_m as ru on ru.id=rpp.objectruanganfk
                inner join ruangan_m as ru2 on ru2.id=rpp.objectruanganasalfk
                WHERE
                    rpp.tglpindah BETWEEN '$dateFirst'
                   AND '$dateLast'
                AND pd.statusenabled = true
                $paramKelas 
                $paramRuanganDiPindah"));
        $datapindah = DB::select(DB::raw("
                 SELECT
                   pd.tglregistrasi,pd.noregistrasi,rpp.tglpindah,apd.tglkeluar,
                sk1.statuskeluar,rpp.objectruanganfk,
                rpp.objectruanganasalfk ,ru2.namaruangan as asal,ru.namaruangan
                FROM
                pasiendaftar_t AS pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                INNER JOIN registrasipelayananpasien_t AS rpp ON rpp.noregistrasifk = pd.norec
                AND apd.tglmasuk = rpp.tglpindah
                AND rpp.objectstatuskeluarfk = 2
                INNER JOIN statuskeluar_m as sk1 on sk1.id = rpp.objectstatuskeluarfk
                inner join ruangan_m as ru on ru.id=rpp.objectruanganfk
                inner join ruangan_m as ru2 on ru2.id=rpp.objectruanganasalfk
                WHERE
                    rpp.tglpindah BETWEEN '$dateFirst'
                AND '$dateLast'
                AND pd.statusenabled = true
                    $paramKelas 
                $paramRuanganPindah"));
        $pasenBPJS = 0;
        $meninggal = 0;
        foreach ($hariini as $key => $value) {
            if (
                $value->objectkelompokpasienlastfk == 2 || $value->objectkelompokpasienlastfk == 4 ||
                $value->objectkelompokpasienlastfk == 10
            ) {
                $pasenBPJS = $pasenBPJS + 1;
            }
            // if($value->objectstatuskeluarfk == 5){
            //     $meninggal =$meninggal +1;
            // }
        }
        foreach ($pulangMeninggal as $key => $values) {
            if ($values->objectstatuskeluarfk == 5) {
                $meninggal = $meninggal + 1;
            }
        }
        $result = array(
            'datamasuk' => count($masuk),
            'datakemarin' => count($dataKemarin),
            'datahariini' => count($hariini),
            'dataaskes' => $pasenBPJS,
            'pulang' => count($pulang),
            'datapindahan' => count($datapindah),
            'datadipindahkan' => count($dataDipindahkan),
            'datameninggal' => $meninggal, //count( $dataMeninggal),
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataLaporanPasienDipindahankan(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['idRuangan'];
        $kelasId = $request['idkelas'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and rpp.objectruanganasalfk = ' . $ruanganId;
        }

        $paramKelas = ' ';
        if (isset($kelasId) && $kelasId != "" && $kelasId != "undefined") {
            $paramKelas = ' and rpp.objectkelasfk  = ' . $kelasId;
        }

        $data = DB::select(DB::raw("select * from (
              select  
                        jkp.jeniskelompokpasien,pd.tglregistrasi,apd.tglkeluar,apd.tglmasuk,pm.nocm,pd.noregistrasi,
                                            pm.namapasien,kp.kelompokpasien,kls.namakelas,ru.namaruangan as ruangansblm,'-' as smf,
                                            case when ddp.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa
                                            else '-' end as namadiagnosa,rpp.objectstatuskeluarfk,ru1.namaruangan as ruanganskrng,
                                             row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum
                                    FROM pasiendaftar_t as pd
                                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                                    LEFT JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec  					 
                                                    and apd.tglkeluar = rpp.tglpindah
                                                    and rpp.objectstatuskeluarfk = 2					                                 
                                    LEFT  JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec and ddp.objectjenisdiagnosafk = 1 
                                    LEFT  JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                                    LEFT  JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                                    INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                    INNER JOIN kelas_m as kls on kls.id = pd.objectkelasfk
                                    LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                                    LEFT JOIN ruangan_m as ru on ru.id = rpp.objectruanganasalfk
                                    LEFT JOIN ruangan_m as ru1 on ru1.id = rpp.objectruanganfk
                                    LEFT JOIN statuskeluar_m as sk1 on sk1.id = pd.objectstatuskeluarfk    
                                    left join jeniskelompokpasien_m as jkp on jkp.id = pm.objectjeniskelompokpasienfk                                
                                    WHERE rpp.tglpindah BETWEEN '$tglAwal' and '$tglAkhir' and br.pasiendaftarfk is null                                                                       
                                    $paramRuangan
                                    $paramKelas
        ) as x where  x.rownum =1 "));
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataLaporanPasienPulang(Request $request)
    {
        $data10 = [];

        $dataLogin = $request->all();
        $data = \DB::table('v_pasienpulang as pp');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pp.tglpulang', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            if ($request['idDept'] == '18') {
                $data = $data->wherein('pp.objectdepartemenfk', [18, 3, 24, 27, 28]);
            } else {
                $data = $data->where('pp.objectdepartemenfk', '=', $request['idDept']);
            }
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('pp.ruanganid', '=', $request['idRuangan']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $data = $data->where('pp.idkelompokpasien', '=', $request['kelompokPasien']);
        }
        if (isset($request['institusiAsalPasien']) && $request['institusiAsalPasien'] != "" && $request['institusiAsalPasien'] != "undefined") {
            $data = $data->where('pp.objectrekananfk', '=', $request['institusiAsalPasien']);
        }
        $data = $data->orderBy('pp.nosep')
            ->select(DB::raw('ROW_NUMBER() OVER (ORDER BY tglregistrasi) AS nomor,tglregistrasi, tglpulang,nodaftar, nobilling, namapasien, objectdepartemenfk, objectruanganfk, namaruangan, namakelas, 
                        sum(totalresep) as totalresep, sum(jumlahbiaya) as jumlahbiaya, sum(diskon) as diskon, namarekanan,sum(totalharusdibayar) as totalharusdibayar, sum(totalppenjamin) as totalppenjamin, sum(pendapatanlainlain) as pendapatanlainlain, objectrekananfk, idkelompokpasien, kelompokpasien,  inap, ruanganid,tgllahir,nobilling'));
        $data = $data->groupBy('tglregistrasi', 'tglpulang',  'nodaftar', 'nobilling', 'namapasien', 'objectdepartemenfk', 'objectruanganfk', 'namaruangan', 'namakelas', 'namarekanan', 'objectrekananfk', 'idkelompokpasien', 'kelompokpasien', 'inap', 'ruanganid', 'nosep', 'tgllahir', 'umur', 'nobilling');
        $data = $data->get();

        // return($request['statP']);
        // die(); 

        foreach ($data as $item) {
            $asd = '';
            if ($item->tglregistrasi != null) {
                $noregistrasi = substr($item->nodaftar, 11);
                // $ruanganid = $
                $data1 = \DB::table('pasiendaftar_t as pd')
                    ->select('dg.kddiagnosa', 'pd.noregistrasi', 'dg.namadiagnosa', 'ddp.objectjenisdiagnosafk', 'sp.kdstatuspulang', 'sp.statuspulang', 'apd.objectruanganfk')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
                    ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
                    ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                    ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                    ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk');
                // $data1=$data1->where('pd.noregistrasi','=',$noregistrasi);
                $data1 = $data1->where('apd.objectruanganfk', '=', $item->ruanganid);
                // $data1=$data1->where('pd.objectruanganlastfk','=',$item->ruanganid);
                // $data1=$data1->where('pd.objectruanganlastfk','=','apd.objectruanganfk');
                // $data1=$data1->where('dg.id','<>', null);
                $data1 = $data1->where('pd.statusenabled', '=', true);
                // $data1=$data1->where('pd')
                $data1 = $data1->whereNotNull('pd.tglpulang');
                // $data1=$data1->where('ddp.objectjenisdiagnosafk','=', 5);

                if (isset($item->nobilling) && $item->nobilling != "" && $item->nobilling != "undefined") {
                    $data1 = $data1->where('pd.noregistrasi', '=', $item->nobilling);
                }
                if (isset($request['statP']) && $request['statP'] != "" && $request['statP'] != "undefined") {
                    $data1 = $data1->where('sp.id', '=', $request['statP']);
                };
                $data1 = $data1->orderBy('jd.id');
                $data1 = $data1->get();

                $diag = '';
                $statp = '';
                // return($data1);
                // die();
                foreach ($data1 as $item1) {
                    if ($asd == $item1->noregistrasi) {
                        // return($asd);
                        // die();

                        // if($item1->objectjenisdiagnosafk != 1 and $diag ){
                        //     $diag = $item1->namadiagnosa;
                        // } else {
                        //     $diag = $item1->objectjenisdiagnosafk;
                        // }

                        // $statp = $item1->statuspulang;
                        // return($item1->noregistrasi);
                        //     return($asd);
                        // die();
                        // if($item1->objectruanganfk == $item->ruanganid){

                        // }
                        // return($diag);
                        // return($statp);
                        // die();
                        $asd = $item1->noregistrasi;
                    } else {

                        if ($diag == '') {
                            $diag = $item1->kddiagnosa . '-' . $item1->namadiagnosa;
                        } else {
                            $diag =  $diag . '-' . $item1->kddiagnosa . '-' . $item1->namadiagnosa;
                        }

                        if ($statp == NULL || $statp == '') {
                            $statp =  $item1->statuspulang;
                        } else {
                            $statp =  $statp . '-' . $item1->statuspulang;
                        }
                        $data10[] = array(
                            // 'nomor'=>$item->nomor,
                            'tglregistrasi' => $item->tglregistrasi,
                            'tglpulang' => $item->tglpulang,
                            'nodaftar' => $item->nodaftar,
                            'nobilling' => $item->nobilling,
                            'namapasien' => $item->namapasien,
                            'objectdepartemenfk' => $item->objectdepartemenfk,
                            'objectruanganfk' => $item->objectruanganfk,
                            'namaruangan' => $item->namaruangan,
                            'namakelas' => $item->namakelas,
                            'totalresep' => $item->totalresep,
                            'jumlahbiaya' => $item->jumlahbiaya,
                            'diskon' => $item->diskon,
                            'namarekanan' => $item->namarekanan,
                            'totalharusdibayar' => $item->diskon,
                            'totalppenjamin' => $item->totalharusdibayar,
                            'pendapatanlainlain' => $item->pendapatanlainlain,
                            'objectrekananfk' => $item->objectrekananfk,
                            'idkelompokpasien' => $item->idkelompokpasien,
                            'kelompokpasien' => $item->kelompokpasien,
                            'ruanganid' => $item->ruanganid,
                            'tgllahir' => $item->tgllahir,
                            'inap' => $item->inap,
                            'statuspulang' => $statp,
                            'dpjp'=>$item1->dpjp,
                            'tanggalrawat'=>$item1->tanggalrawat,
                            'keterangan'=>$item1->keterangan,
                            // 'statuspulang'=>$data1->statuspulang,
                            'diagnosa' => $diag,
                        );
                        $asd = $item1->noregistrasi;
                    }
                }

                //     foreach ($data10 as $key => $row) {
                //         $count[$key] = $row['nomor'];
                //     }

                // array_multisort($count, SORT_DESC, $data10);
            }
        }
        $result = array(
            'data' => $data10,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }

    public function CetakLaporanPasienPulang(Request $request)
    {
        DB::beginTransaction();
        try {
            $IdLaporan = $this->generateCode(new TempLaporanPasienPulang(), 'idlappulang', 10, 'PP' . $this->getDateTime()->format('ym'));
            foreach ($request['details'] as $item) {
                if ($IdLaporan != '') {
                    $data = new TempLaporanPasienPulang();
                    $str = $data->generateNewId();
                    $data->idlappulang = $IdLaporan;
                    $data->norec = $str;
                    $data->tglregistrasi = $item['tglregistrasi'];
                    $data->tglpulang = $item['tglpulang'];
                    $data->nosep = $item['nosep'];
                    $data->tglstruk = $item['tglstruk'];
                    $data->nodaftar = $item['nodaftar'];
                    $data->namapasien = $item['namapasien'];
                    $data->objectruanganfk = $item['ruanganid'];
                    $data->namaruangan = $item['namaruangan'];
                    $data->namakelas = $item['namakelas'];
                    $data->nobilling = $item['nobilling'];
                    $data->nokwitansi = $item['nokwitansi'];
                    $data->totalresep = $item['totalresep'];
                    $data->jumlahbiaya = $item['jumlahbiaya'];
                    $data->diskon = $item['diskon'];
                    $data->namarekanan = $item['namarekanan'];
                    $data->jumlahdeposit = $item['jumlahdeposit'];
                    $data->totalharusbayar = $item['totalharusdibayar'];
                    $data->totalppenjamin = $item['totalppenjamin'];
                    $data->pendapatanlainlain = $item['pendapatanlainlain'];
                    $data->idkelompokpasien = $item['idkelompokpasien'];
                    $data->kelompokpasien = $item['kelompokpasien'];
                    $data->keteranganlainnya = $item['keteranganlainnya'];
                    $data->inap = $item['inap'];
                    $data->save();
                    //                    $norec=$data->norec;
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Cetak Laporan Pulang!!!";
        }

        if ($transStatus == 'true') {
            $transMessage = "";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noId" => $IdLaporan,
                "norec" => $data->norec,
                "as" => 'cepotTea',
            );
        } else {
            $transMessage = "Cetak Laporan Pulang!!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noId" => $IdLaporan,
                "norec" => $data->norec,
                "as" => 'cepotTea',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataLaporanPendapatanPoli(Request $request)
    {
        $dataLogin = $request->all();

        $data = \DB::table('pelayananpasien_t as pp')
            ->LEFTJOIN('strukpelayanan_t as sp', 'pp.strukfk', '=', 'sp.norec')
            ->LEFTJOIN('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->LEFTJOIN('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->LEFTJOIN('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->LEFTJOIN('jaminankhusus_m as jkm', 'jkm.id', '=', 'pd.objectjaminankhusus')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->JOIN('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('jeniskelompokpasien_m as jkp', 'jkp.id', '=', 'ps.objectjeniskelompokpasienfk')
            ->JOIN('kelompokpasien_m as klp', 'klp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->JOIN('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->JOIN('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->select(
                'apd.objectruanganfk',
                'ru.namaruangan',
                'ru.objectdepartemenfk',
                'jkm.namaexternal',
                'jkp.jeniskelompokpasien',
                'apd.statuskunjungan',
                'pg.namalengkap',
                'pd.objectkelompokpasienlastfk',
                'klp.kelompokpasien',
                'rk.namarekanan',
                'pd.objectjaminankhusus',
                'pd.tglregistrasi',
                'pd.noregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'ps.tgllahir',
                'ru2.namaruangan as ruanganterakhir',
                DB::raw('sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end) as karcis,
                sum(case when pr.id =10013116 then pp.jumlah else 0 end) as jmlembos,
                sum(case when pr.id =10013116 then pp.hargajual* pp.jumlah else 0 end) as embos,
                sum(case when kp.id = 26 then pp.jumlah else 0 end) as jmlkonsul,
                sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end) as konsul,
                --sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.jumlah else 0 end) as jmltindakan,
                SUM(CASE WHEN pp.isobat is null THEN pp.jumlah ELSE 0 END) AS jmltindakan, 
                --sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end) as tindakan,
                SUM(CASE WHEN pp.isobat is null and pp.jasa is not null THEN (pp.hargajual * pp.jumlah) + pp.jasa when pp.isobat is null and pp.jasa is null then (pp.hargajual * pp.jumlah) ELSE 0 END) AS tindakan, 
                --sum(case when pp.aturanpakai is not null then pp.jumlah else 0 end) as jmlresep,
                SUM(CASE WHEN pp.isobat IS NOT NULL THEN pp.jumlah ELSE 0 END) AS jmlresep, 
                --sum(case when pp.aturanpakai is not null then pp.hargajual* pp.jumlah+ pp.jasa else 0 end) as resep,
                SUM(CASE WHEN pp.isobat IS NOT NULL THEN (pp.hargajual * pp.jumlah) + pp.jasa ELSE 0 END) AS resep, 
                sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,
                sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end)
                +sum(case when pr.id =10013116 then pp.hargajual* pp.jumlah else 0 end)
                +sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end)
                --sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end)
                +SUM(CASE WHEN pp.isobat is null and pp.jasa is not null THEN (pp.hargajual * pp.jumlah) + pp.jasa when pp.isobat is null and pp.jasa is null then (pp.hargajual * pp.jumlah) ELSE 0 END)
                --sum(case when pp.aturanpakai is not null then pp.hargajual* pp.jumlah+ pp.jasa else 0 end)
                +SUM(CASE WHEN pp.isobat IS NOT NULL THEN (pp.hargajual * pp.jumlah) + pp.jasa ELSE 0 END)
                -sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as total')
                //                        '(CASE WHEN pp.strukfk is null then "Belum" WHEN sp.nosbmlastfk is null then "Belum" else "Sudah" END )as statusbayar')
            )
            ->where('pp.produkfk', '!=', 402611);

        //             ->whereNull('apd.statusenabled');
        //            ->Where('apd.statusenabled','=',true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $data = $data->where('pg.id', '=', $request['idDokter']);
        }
        // if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
        //     $data = $data->where('apd.objectruanganfk', '=', $request['idRuangan']);
        // }
        // if (isset($request['idDepartemen']) && $request['idDepartemen'] != "" && $request['idDepartemen'] != "undefined") {
        //     $data = $data->where('ru.objectdepartemenfk', '=', $request['idDepartemen']);
        // }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('pd.objectruanganlastfk', '=', $request['idRuangan']);
        }
        if (isset($request['idDepartemen']) && $request['idDepartemen'] != "" && $request['idDepartemen'] != "undefined") {
            $data = $data->where('ru2.objectdepartemenfk', '=', $request['idDepartemen']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $data = $data->where('klp.id', '=', $request['kelompokPasien']);
        }
        if (isset($request['rekanan']) && $request['rekanan'] != "" && $request['rekanan'] != "undefined") {
            $data = $data->where('pd.objectrekananfk', '=', $request['rekanan']);
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $request['nocm'] . '%');
        };
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $request['namapasien'] . '%');
        };
        if (isset($request['jaminankhusus']) && $request['jaminankhusus'] != "" && $request['jaminankhusus'] != "undefined") {
            $data = $data->where('jkm.id', '=', $request['jaminankhusus']);
        }
        if (isset($request['jeniskelompokpasien']) && $request['jeniskelompokpasien'] != "" && $request['jeniskelompokpasien'] != "undefined") {
            $data = $data->where('jkp.id', '=', $request['jeniskelompokpasien']);
        }

        $data = $data->groupBy(
            'apd.objectruanganfk',
            'jkm.namaexternal',
            'jkp.jeniskelompokpasien',
            'ru.objectdepartemenfk',
            'pd.objectjaminankhusus',
            'ru.namaruangan',
            'pd.objectkelompokpasienlastfk',
            'klp.kelompokpasien',
            'rk.namarekanan',
            'pd.tglregistrasi',
            'pd.noregistrasi',
            'ps.nocm',
            'ps.namapasien',
            'ps.tgllahir',
            'pg.namalengkap',
            'apd.statuskunjungan',
            'pp.strukfk',
            'sp.nosbmlastfk',
            'ru2.namaruangan'
        );
        $data = $data->distinct();
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->get();
        $data10 = [];
        foreach ($data as $x) {
            $data10[] = array(
                'tglregistrasi' => $x->tglregistrasi,
                'noregistrasi' => $x->noregistrasi,
                'nocm' => $x->nocm,
                'namapasien' => $x->namapasien,
                'tgllahir' => $x->tgllahir,
                'statuskunjungan' => $x->statuskunjungan,
                'namaruangan' => $x->namaruangan,
                'kelompokpasien' => $x->kelompokpasien,
                'namarekanan' => $x->namarekanan,
                'namalengkap' => $x->namalengkap,
                'jaminankhusus' => $x->namaexternal,
                'jeniskelompokpasien' => $x->jeniskelompokpasien,
                // 'jmlkarcis' => $x->jmlkarcis,
                'karcis' => $x->karcis,
                'jmlembos' => $x->jmlembos,
                'embos' => $x->embos,
                'jmlkonsul' => $x->jmlkonsul,
                'konsul' => $x->konsul,
                'jmltindakan' => $x->jmltindakan,
                'tindakan' => $x->tindakan,
                'jmlresep' => $x->jmlresep,
                'resep' => $x->resep,
                'diskon' => $x->diskon,
                'total' => (int)$x->total,
                'ruanganterakhir' => $x->ruanganterakhir,
            );
        }

        // $data = $data->get();
        $result = array(
            'data' => $data10,
            'message' => 'egie@',
        );
        return $this->respond($result);
    }
    public function getLaporanJaspelCianjur(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minuts
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        if ($request['tglSbm'] == 'true') {
            $where = " sbm.tglsbm ";
        } else {
            $where = " pp.tglpelayanan ";
        }
        $idDept =  ' ';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan =  ' ';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idKelompok = ' ';
        if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
            if ($idKelompok == 135 || $idKelompok == '135') {
                $idKelompok = 'and pd.objectkelompokpasienlastfk in (1,5,3)';
            } else {
                $idKelompok = 'and pd.objectkelompokpasienlastfk = ' . $request['idKelompok'];
            }
        }
        $idDokter = ' ';
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $idDokter = 'and pg.id  = ' . $request['idDokter'];
        }
        $tindakan = ' ';
        if (isset($request['tindakan']) && $request['tindakan'] != "" && $request['tindakan'] != "undefined") {
            $tindakan = ' and pr.id = ' . $request['tindakan'];
        }
        $kelas = ' ';
        if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
            $kelas = ' and kl.id = ' . $request['kelas'];
        }
        $PetugasPe = ' ';
        if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
            $PetugasPe = ' and ppp.objectjenispetugaspefk =' . $request['PetugasPe'];
        }
        $data = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->JOIN('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
                ->JOIN('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ppp.objectjenispetugaspefk')
                ->JOIN('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
                ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->leftJOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJOIN('ruangan_m as ruasal', 'ruasal.id', '=', 'apd.objectruanganasalfk')
                ->JOIN('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
                ->leftJOIN('strukpelayanan_t as sp', 'sp.noregistrasifk', '=', 'pd.norec')
                ->leftJOIN('strukpelayanan_t as sp1', 'sp1.norec', '=', 'pp.strukfk')
                ->leftJOIN('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'sp.nosbmlastfk')
                ->leftJOIN('strukbuktipenerimaan_t as sbm1', 'sbm1.nostrukfk', '=', 'sp1.norec')
                ->leftJOIN('loginuser_s as lgn', 'lgn.id', '=', 'sbm.objectpegawaipenerimafk')
                ->leftjoin('mapruangantoproduk_m as mrtp', function ($join) {
                    $join->on('mrtp.objectprodukfk', '=', 'pr.id');
                    $join->on('mrtp.objectruanganfk', '=', 'apd.objectruanganfk');
                })
                ->leftjoin('ruangan_m as ru1', 'ru1.id', '=', 'mrtp.objectruanganfk')
                ->leftJOIN('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                ->select(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'kl.namakelas',
                    'pg.id as iddokter',
                    'pg.namalengkap',
                    'pd.noregistrasi',
                    'ps.nocm',
                    'ps.namapasien',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kps.kelompokpasien',
                    'pp.hargadiscount',
                    'jpp.jenispetugaspe',
                    DB::raw(
                        'case when ru.objectdepartemenfk in (16,35) then \'Y\' ELSE \'N\' END as inap,
                           case when rk.namarekanan is not null then rk.namarekanan else \' - \' end as namarekanan,
                           case when pp.hargajual is not null then pp.hargajual else 0 end as harga,
                           case when pp.strukfk is null then \'n\' else \'y\' end as sbm'
                        
                    )
                )
                ->whereNotIn('djp.objectjenisprodukfk', [97, 283])
                ->whereNotIn('pr.id', [395])
                ->where('mrtp.statusenabled', '=', true)
                ->wherenull('pp.isobat')
                ->groupBy(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'kl.namakelas',
                    'pg.id',
                    'pg.namalengkap',
                    'pd.noregistrasi',
                    'ps.nocm',
                    'ps.namapasien',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kps.kelompokpasien',
                    'ru.objectdepartemenfk',
                    'rk.namarekanan',
                    'pp.hargajual',
                    'pd.nosbmlastfk',
                    'pp.hargadiscount',
                    'jpp.jenispetugaspe'
                );

         
            if($request['semua']=="false"){
                $data = $data->wherenotnull('pd.nosbmlastfk');
                $data = $data->wherenotnull('pp.strukfk');
            }
            if ($request['tglSbm'] == 'true') {
                if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                    $data = $data->where('sbm1.tglsbm', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                    $tgl = $request['tglAkhir']; //." 23:59:59";
                    $data = $data->where('sbm1.tglsbm', '<=', $tgl);
                }
            } else {
                if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                    $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                    $tgl = $request['tglAkhir']; //." 23:59:59";
                    $data = $data->where('pp.tglpelayanan', '<=', $tgl);
                }
            }
            if ($request['onlyDok'] == 'true') {
                $data = $data->Where('pg.objectjenispegawaifk', '=', 1);
            } else {
            }
            if ($request['jaskep'] == 'true') {
                $data = $data->Where('pg.objectjenispegawaifk', '!=', 1);
                $data = $data->where('pr.namaproduk', 'not like', '%akomodasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%administrasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%administrasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%EKG%');
                $data = $data->whereNotIn('pg.id', [27678, 27703]);
            } else {
            }
            if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
                $data = $data->where('ru.id', '=', $request['idRuangan']);
            }
            if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
                if ($request['idKelompok'] == 135 || $request['idKelompok'] == '135') {
                    $data = $data->whereIn('pd.objectkelompokpasienlastfk', [1, 5, 3]);
                } else {
                    $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['idKelompok']);
                }
            }
            if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
                $data = $data->where('pg.id', '=', $request['idDokter']);
            }
            if (isset($request['listDokter']) && $request['listDokter'] != "" && $request['listDokter'] != "undefined") {
                $dok = $request['listDokter'];
                $data = $data->whereRaw("pg.id IN ($dok)");
            }
            if ($request['notInTindakan'] == 'true') {

                if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
                    $asu = $request['listProduk'];
                    $data = $data->whereRaw("pr.id NOT IN ($asu)");
                }
            } else {

                if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
                    $asu = $request['listProduk'];
                    $data = $data->whereRaw("pr.id IN ($asu)");
                }
            }
            if ($request['toPenunjang'] == 'true') {
                if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                    $data = $data->where('ruasal.objectdepartemenfk', '=', $request['idDept']);
                }
                if (isset($request['listDepartemen']) && $request['listDepartemen'] != "" && $request['listDepartemen'] != "undefined") {
                    $dep = $request['listDepartemen'];
                    $data = $data->whereRaw("ruasal.objectdepartemenfk IN ($dep)");
                }
                if (isset($request['Penunjang']) && $request['Penunjang'] != "" && $request['Penunjang'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['Penunjang']);
                }
            } else {
                if (isset($request['listDepartemen']) && $request['listDepartemen'] != "" && $request['listDepartemen'] != "undefined") {
                    $dep = $request['listDepartemen'];
                    $data = $data->whereRaw("ru.objectdepartemenfk IN ($dep)");
                }
                if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
                }
            }
        
            if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
                $data = $data->where('kl.id', '=', $request['kelas']);
            }
            if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
                $data = $data->where('ppp.objectjenispetugaspefk', '=', $request['PetugasPe']);
            }
            if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
                $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noReg'] . '%');
            }
            $data = $data->distinct();
            $data = $data->get();

            $results = array();
            foreach ($data as $item) {
                $dataKomponen = DB::select(
                DB::raw("select kh.komponenharga,kh.id,ppd.hargajual 
                    from pelayananpasiendetail_t as ppd 
                    join komponenharga_m as kh on kh.id=ppd.komponenhargafk 
                    where ppd.pelayananpasien='$item->norec'"));
                    $analis=0;
                    $jasaRs=0;
                    $penunjang=0;
                    $jasaMedis=0;
                    $bhp=0;
                    $jasaDokLab=0;
                    $anestesi=0;
                    $jasaPerawat=0;
                    $perawatAnestesi=0;
                    $radiografer=0;
                    $jasaUmum=0;
                    $perawatBedah=0;
                    $jasaDokterUmum=0;
                    $ahliGizi=0;
                    $pramusaji=0;
                    $jasa=0;
                    $dokterOperator=0;
                    $sopir=0;
                    $penunjangMedis=0;
                    $perawatIgd=0;
                    $perawatRj=0;
                    $jasaDokterPenunjang=0;
                    $jasaDokterAnak=0;
                    foreach($dataKomponen as $itemKomponen){
                        if($itemKomponen->id==40){
                            $analis=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==6){
                            $jasaRs=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==30){
                            $penunjang=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==94){
                            $jasaMedis=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==97){
                            $bhp=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==14){
                            $jasaDokLab=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==21){
                            $anestesi=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==25){
                            $jasaPerawat=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==26){
                            $perawatAnestesi=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==27){
                            $radiografer=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==29){
                            $perawatBedah=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==30){
                            $jasaUmum=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==35){
                            $jasaDokterUmum=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==42){
                            $ahliGizi=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==55){
                            $pramusaji=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==108){
                            $jasa=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==83){
                            $dokterOperator=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==91){
                            $sopir=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==92){
                            $penunjangMedis=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==95){
                            $perawatIgd=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==99){
                            $perawatRj=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==102){
                            $jasaDokterPenunjang=$itemKomponen->hargajual;
                        }else if($itemKomponen->id==117){
                            $jasaDokterAnak=$itemKomponen->hargajual;
                        }
                    }
                $results[] = array(
                    'tglpelayanan' => $item->tglpelayanan,
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namakelas' => $item->namakelas,
                    'kelompokpasien' => $item->kelompokpasien,
                    'rekanan' => $item->namarekanan,
                    'inap' => $item->inap,
                    'ruangan' => $item->namaruangan,
                    'layanan' => $item->namaproduk,
                    'tarif' => $item->harga,
                    'jumlah' => $item->jumlah,
                    'statusbayar' => $item->sbm,
                    'iddokter' => $item->iddokter,
                    'dokter' => $item->namalengkap,
                    'hargadiscount' => $item->hargadiscount,
                    'jenispetugaspe'=> $item->jenispetugaspe,
                    'analis' => (float)$analis,
                    'jasars' => (float)$jasaRs,
                    'penunjangumum' => (float)$penunjang,
                    'jasamedis' => (float)$jasaMedis,
                    'bhp' => (float)$bhp,
                    'jasadoklab' =>(float)$jasaDokLab,
                    'anestesi' =>(float)$anestesi,
                    'jasaPerawat' =>(float)$jasaPerawat,
                    'perawatAnestesi' =>(float)$perawatAnestesi,
                    'radiografer' =>(float)$radiografer,
                    'jasaUmum' =>(float)$jasaUmum,
                    'perawatBedah' =>(float)$perawatBedah,
                    'jasaDokterUmum' =>(float)$jasaDokterUmum,
                    'ahliGizi' =>(float)$ahliGizi,
                    'pramusaji' =>(float)$pramusaji,
                    'jasa' =>(float)$jasa,
                    'dokterOperator' =>(float)$dokterOperator,
                    'sopir' =>(float)$sopir,
                    'penunjangMedis' =>(float)$penunjangMedis,
                    'perawatIgd' =>(float)$perawatIgd,
                    'perawatRj' =>(float)$perawatRj,
                    'jasaDokterPenunjang' =>(float)$jasaDokterPenunjang,
                    'jasaDokterAnak' =>(float)$jasaDokterAnak,
                );
            }
            $result = array(
                'data' => $results,
                'message' => 'tuk@com',
            );
        return $this->respond($result);
    }

    public function getLaporanLayanan(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minuts

        // return($request['kondisi']);
        // die();
        //        $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        if ($request['tglSbm'] == 'true') {
            $where = " sbm.tglsbm ";
        } else {
            $where = " pp.tglpelayanan ";
        }
        $idDept =  ' ';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan =  ' ';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idKelompok = ' ';
        if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
            if ($idKelompok == 135 || $idKelompok == '135') {
                $idKelompok = 'and pd.objectkelompokpasienlastfk in (1,5,3)';
            } else {
                $idKelompok = 'and pd.objectkelompokpasienlastfk = ' . $request['idKelompok'];
            }
        }
        $idDokter = ' ';
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $idDokter = 'and pg.id  = ' . $request['idDokter'];
        }
        $tindakan = ' ';
        if (isset($request['tindakan']) && $request['tindakan'] != "" && $request['tindakan'] != "undefined") {
            $tindakan = ' and pr.id = ' . $request['tindakan'];
        }
        $kelas = ' ';
        if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
            $kelas = ' and kl.id = ' . $request['kelas'];
        }
        $PetugasPe = ' ';
        if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
            $PetugasPe = ' and ppp.objectjenispetugaspefk =' . $request['PetugasPe'];
        }
        

        if ($request['kondisi'] == '') {

            $data = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->JOIN('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
                ->JOIN('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ppp.objectjenispetugaspefk')
                ->JOIN('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
                ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->leftJOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJOIN('ruangan_m as ruasal', 'ruasal.id', '=', 'apd.objectruanganasalfk')
                ->JOIN('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
                ->leftJOIN('strukpelayanan_t as sp', 'sp.noregistrasifk', '=', 'pd.norec')
                ->leftJOIN('strukpelayanan_t as sp1', 'sp1.norec', '=', 'pp.strukfk')
                ->leftJOIN('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'sp.nosbmlastfk')
                ->leftJOIN('strukbuktipenerimaan_t as sbm1', 'sbm1.nostrukfk', '=', 'sp1.norec')
                // ->JOIN('loginuser_s as lu', 'lu.id', '=', 'sbm1.objectpegawaipenerimafk')
                // ->JOIN('pegawai_m as pgxxx', 'pgxxx.id', '=', 'lu.objectpegawaifk')
                ->leftJOIN('loginuser_s as lgn', 'lgn.id', '=', 'sbm.objectpegawaipenerimafk')
                ->leftjoin('mapruangantoproduk_m as mrtp', function ($join) {
                    $join->on('mrtp.objectprodukfk', '=', 'pr.id');
                    $join->on('mrtp.objectruanganfk', '=', 'apd.objectruanganfk');
                })
                // ->join('login_s', function ($joinx) {
                //     $joinx->on('login_s.objectprodukfk', '=', 'sbm.id');
                //     $joinx->on('login_s.objectruanganfk', '=', 'pg.objectruanganfk');
                // })
                ->leftjoin('ruangan_m as ru1', 'ru1.id', '=', 'mrtp.objectruanganfk')
                // ->JOIN('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
                // ->JOIN('strukbuktipenerimaan_t as sbm1', 'sbm1.objectpegawaipenerimafk', '=', 'sbm.objectpegawaipenerimafk')
                // ->JOIN('pegawai_m as pg1', function ($join) {
                //     $join->on('pg1.id', '=', 'lu.objectpegawaifk');
                //     $join->on('sp.norec', '=', 'sbm.nostrukfk');
                // })
                ->leftJOIN('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                ->select(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'kl.namakelas',
                    'pg.id as iddokter',
                    'pg.namalengkap',
                    'pd.noregistrasi',
                    'ps.nocm',
                    'ps.namapasien',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kps.kelompokpasien',
                    'pp.hargadiscount',
                    'jpp.jenispetugaspe',
                    DB::raw(
                        'case when ru.objectdepartemenfk in (16,35) then \'Y\' ELSE \'N\' END as inap,
                           case when rk.namarekanan is not null then rk.namarekanan else \' - \' end as namarekanan,
                           case when pp.hargajual is not null then pp.hargajual else 0 end as harga,
                           case when pp.strukfk is null then \'n\' else \'y\' end as sbm'
                        
                    )
                )
                // case when pp.strukfk is null then \'n\' else \'y\' end as sbm'
                //            ->whereNull('sp.statusenabled')
                // ->Where('pg.objectjenispegawaifk', '=', 1)
                ->whereNotIn('djp.objectjenisprodukfk', [97, 283])
                //                ->whereNotIn('djp.id',[58,155,161,167,476,477,149,1435,1440])
                // ->whereIn('pr.id', $ListProduk)
                ->whereNotIn('pr.id', [395])
                ->where('mrtp.statusenabled', '=', true)
                ->wherenull('pp.isobat')
                // ->wherenotnull('pd.nosbmlastfk')
                // ->wherenotnull('pp.strukfk')
                //                ->whereNotIn('ru1.objectdepartemenfk',[3,27])
                ->groupBy(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'kl.namakelas',
                    'pg.id',
                    'pg.namalengkap',
                    'pd.noregistrasi',
                    'ps.nocm',
                    'ps.namapasien',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kps.kelompokpasien',
                    'ru.objectdepartemenfk',
                    'rk.namarekanan',
                    'pp.hargajual',
                    'pd.nosbmlastfk',
                    'pp.hargadiscount',
                    'jpp.jenispetugaspe'
                );

            // return($request['tglSbm']);
            // die();
            if($request['semua']=="false"){
                $data = $data->wherenotnull('pd.nosbmlastfk');
                $data = $data->wherenotnull('pp.strukfk');
            }
            if ($request['tglSbm'] == 'true') {
                if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                    $data = $data->where('sbm1.tglsbm', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                    $tgl = $request['tglAkhir']; //." 23:59:59";
                    $data = $data->where('sbm1.tglsbm', '<=', $tgl);
                }
                // return($request['tglAwal']);
                // die();
                // if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined" && isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                //     $data = $data->whereBetween('sbm.tglsbm', [$request['tglAwal'],$request['tglAkhir']]);
                //     // $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
                // }
            } else {
                if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                    $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                    $tgl = $request['tglAkhir']; //." 23:59:59";
                    $data = $data->where('pp.tglpelayanan', '<=', $tgl);
                }
            }
            // return($request['onlyDok']);
            // die();
            if ($request['onlyDok'] == 'true') {
                $data = $data->Where('pg.objectjenispegawaifk', '=', 1);
            } else {
            }
            if ($request['jaskep'] == 'true') {
                $data = $data->Where('pg.objectjenispegawaifk', '!=', 1);
                $data = $data->where('pr.namaproduk', 'not like', '%akomodasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%administrasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%administrasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%EKG%');
                $data = $data->whereNotIn('pg.id', [27678, 27703]);
            } else {
            }
            if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
                $data = $data->where('ru.id', '=', $request['idRuangan']);
            }
            if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
                if ($request['idKelompok'] == 135 || $request['idKelompok'] == '135') {
                    $data = $data->whereIn('pd.objectkelompokpasienlastfk', [1, 5, 3]);
                } else {
                    $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['idKelompok']);
                }
            }
            if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
                $data = $data->where('pg.id', '=', $request['idDokter']);
            }
            if (isset($request['listDokter']) && $request['listDokter'] != "" && $request['listDokter'] != "undefined") {
                $dok = $request['listDokter'];
                $data = $data->whereRaw("pg.id IN ($dok)");
            }
            if ($request['notInTindakan'] == 'true') {

                if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
                    $asu = $request['listProduk'];
                    $data = $data->whereRaw("pr.id NOT IN ($asu)");
                }
            } else {

                if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
                    $asu = $request['listProduk'];
                    $data = $data->whereRaw("pr.id IN ($asu)");
                }
            }
            if ($request['toPenunjang'] == 'true') {
                // return($request['Penunjang']);
                // die();
                if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                    $data = $data->where('ruasal.objectdepartemenfk', '=', $request['idDept']);
                }
                if (isset($request['listDepartemen']) && $request['listDepartemen'] != "" && $request['listDepartemen'] != "undefined") {
                    $dep = $request['listDepartemen'];
                    $data = $data->whereRaw("ruasal.objectdepartemenfk IN ($dep)");
                }
                if (isset($request['Penunjang']) && $request['Penunjang'] != "" && $request['Penunjang'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['Penunjang']);
                }
            } else {
                if (isset($request['listDepartemen']) && $request['listDepartemen'] != "" && $request['listDepartemen'] != "undefined") {
                    $dep = $request['listDepartemen'];
                    $data = $data->whereRaw("ru.objectdepartemenfk IN ($dep)");
                }
                if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
                }
            }
            // if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
            //     $asu = $request['listProduk'];
            //     $data = $data->whereRaw("pr.id IN ($asu)");
            // }
            if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
                $data = $data->where('kl.id', '=', $request['kelas']);
            }
            if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
                $data = $data->where('ppp.objectjenispetugaspefk', '=', $request['PetugasPe']);
            }
            if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
                $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noReg'] . '%');
            }
            $data = $data->distinct();
            $data = $data->get();

            $results = array();
            foreach ($data as $item) {
                $results[] = array(
                    'tglpelayanan' => $item->tglpelayanan,
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namakelas' => $item->namakelas,
                    'kelompokpasien' => $item->kelompokpasien,
                    'rekanan' => $item->namarekanan,
                    'inap' => $item->inap,
                    'ruangan' => $item->namaruangan,
                    'layanan' => $item->namaproduk,
                    'tarif' => $item->harga,
                    'jumlah' => $item->jumlah,
                    'statusbayar' => $item->sbm,
                    'iddokter' => $item->iddokter,
                    'dokter' => $item->namalengkap,
                    'hargadiscount' => $item->hargadiscount,
                    'jenispetugaspe' => $item->jenispetugaspe
                );
            }
        } elseif ($request['kondisi'] == 1) {

            $data = DB::select(
                DB::raw("select pp.norec,pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,kl.namakelas,pg.id as iddokter,pg.namalengkap, 
                 pd.noregistrasi,ps.nocm,upper(ps.namapasien) as namapasien,case when ru.objectdepartemenfk in (16,35) then 'y' else 'n' end as inap,  
                 pr.namaproduk,pp.jumlah,case when pp.hargajual is not null then pp.hargajual else 0 end as harga, 
                 case when pp.strukfk is null then 'n' else 'y' end as sbm,sf.jammasuk,
                 case when rk.namarekanan is not null then rk.namarekanan else ' - ' end as namarekanan,kps.kelompokpasien
                 from pasiendaftar_t as pd
                 inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                 left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                 left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
                 left join pegawai_m as pg on pg.id=ppp.objectpegawaifk
                 inner join produk_m as pr on pr.id=pp.produkfk
                 inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk
                 inner join pasien_m as ps on ps.id=pd.nocmfk
                 left join strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec
                 left join strukbuktipenerimaan_t as sbm  on sbm.norec=sp.nosbmlastfk
                 left join ruangan_m as ru on ru.id=apd.objectruanganfk
                 left join kelas_m as kl on kl.id = apd.objectkelasfk
                 left join mapruangantoproduk_m as mrtp on mrtp.objectprodukfk = pr.id and mrtp.objectruanganfk=apd.objectruanganfk
                 left join ruangan_m as ru1 on ru1.id = mrtp.objectruanganfk
                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk
                left join  rekanan_m as rk on rk.id = pd.objectrekananfk
                left join kelompokpasien_m as kps on kps.id = pd.objectkelompokpasienlastfk
                where pg.objectjenispegawaifk = 1 and djp.objectjenisprodukfk not in  (97,283) 
                --and ru1.objectdepartemenfk not in (3,27)
                
                and pr.id not in (395) and mrtp.statusenabled =true
                and pp.tglpelayanan >= '$tglAwal' and pp.tglpelayanan <= '$tglAkhir' 
                $idDept 
                $idKelompok 
                $idRuangan 
                $idDokter 
                $tindakan
                $kelas
                $PetugasPe
                and (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')  
                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI') )
                GROUP BY pp.norec,pp.tglpelayanan, 
                 apd.objectruanganfk, 
                 ru.namaruangan, 
                 kl.namakelas, 
                 pg.id, 
                 pg.namalengkap, 
                 pd.noregistrasi, 
                 ps.nocm, 
                 ps.namapasien, 
                 pr.namaproduk, 
                 pp.jumlah, 
                 kps.kelompokpasien,ru.objectdepartemenfk,
                rk.namarekanan,pp.hargajual,
                pd.nosbmlastfk,
                sf.jammasuk,
                order by pp.tglpelayanan")
            );
            $results = array();
            foreach ($data as $item) {
                $results[] = array(
                    'tglpelayanan' => $item->tglpelayanan,
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namakelas' => $item->namakelas,
                    'kelompokpasien' => $item->kelompokpasien,
                    'rekanan' => $item->namarekanan,
                    'inap' => $item->inap,
                    'ruangan' => $item->namaruangan,
                    'layanan' => $item->namaproduk,
                    'tarif' => $item->harga,
                    'jumlah' => $item->jumlah,
                    'statusbayar' => $item->sbm,
                    'iddokter' => $item->iddokter,
                    'dokter' => $item->namalengkap,
                );
            }
        } elseif ($request['kondisi'] == 2) {

            $data = DB::select(
                DB::raw("select pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,kl.namakelas,pg.id as iddokter,pg.namalengkap, 
                 pd.noregistrasi,ps.nocm,upper(ps.namapasien) as namapasien,case when ru.objectdepartemenfk in (16,35) then 'y' else 'n' end as inap,  
                 pr.namaproduk,pp.jumlah,case when pp.hargajual is not null then pp.hargajual else 0 end as harga, 
                 case when pd.nosbmlastfk is null then 'n' else 'y' end as sbm,sf.jammasuk,
                  case when rk.namarekanan is not null then rk.namarekanan else ' - ' end as namarekanan,kps.kelompokpasien
                 from pasiendaftar_t as pd
                 inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                 left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                 left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
                 left join pegawai_m as pg on pg.id=ppp.objectpegawaifk
                 inner join produk_m as pr on pr.id=pp.produkfk
                 inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk
                 inner join pasien_m as ps on ps.id=pd.nocmfk
                 left join strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec
                 left join strukbuktipenerimaan_t as sbm  on sbm.norec=sp.nosbmlastfk
                 left join ruangan_m as ru on ru.id=apd.objectruanganfk
                 left join kelas_m as kl on kl.id = apd.objectkelasfk
                 left join mapruangantoproduk_m as mrtp on mrtp.objectprodukfk = pr.id and mrtp.objectruanganfk=apd.objectruanganfk
                 left join ruangan_m as ru1 on ru1.id = mrtp.objectruanganfk
                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk 
                 left join  rekanan_m as rk on rk.id = pd.objectrekananfk
                 left join kelompokpasien_m as kps on kps.id = pd.objectkelompokpasienlastfk
                where pg.objectjenispegawaifk = 1 and djp.objectjenisprodukfk not in (97,283)
                 --and ru1.objectdepartemenfk not in (3,27)
                
                and pr.id not in (395) and mrtp.statusenabled =true
                and pp.tglpelayanan >= '$tglAwal' and pp.tglpelayanan <= '$tglAkhir' 
                $idDept 
                $idKelompok 
                $idRuangan 
                $idDokter 
                $tindakan
                $kelas
                $PetugasPe
                and ((pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 00:00','YYYY-MM-DD HH24:MI')  
                        and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')- interval '1' minute  )
                or (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI') + interval '1' minute
                        and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 23:59:59','YYYY-MM-DD HH24:MI') ))
                GROUP BY pp.norec,pp.tglpelayanan, 
                 apd.objectruanganfk, 
                 ru.namaruangan, 
                 kl.namakelas, 
                 pg.id, 
                 pg.namalengkap, 
                 pd.noregistrasi, 
                 ps.nocm, 
                 ps.namapasien, 
                 pr.namaproduk, 
                 pp.jumlah, 
                 kps.kelompokpasien,ru.objectdepartemenfk,
                rk.namarekanan,pp.hargajual,
                pd.nosbmlastfk,
                sf.jammasuk
                order by pp.tglpelayanan")
            );
            $results = array();
            foreach ($data as $item) {
                $results[] = array(
                    'tglpelayanan' => $item->tglpelayanan,
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namakelas' => $item->namakelas,
                    'kelompokpasien' => $item->kelompokpasien,
                    'rekanan' => $item->namarekanan,
                    'inap' => $item->inap,
                    'ruangan' => $item->namaruangan,
                    'layanan' => $item->namaproduk,
                    'tarif' => $item->harga,
                    'jumlah' => $item->jumlah,
                    'statusbayar' => $item->sbm,
                    'iddokter' => $item->iddokter,
                    'dokter' => $item->namalengkap,
                );
            }
        } elseif ($request['kondisi'] == 3) {
            $data = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->JOIN('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
                ->JOIN('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ppp.objectjenispetugaspefk')
                ->JOIN('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
                ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->leftJOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJOIN('ruangan_m as ruasal', 'ruasal.id', '=', 'apd.objectruanganasalfk')
                ->JOIN('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
                // ->JOIN('strukpelayanan_t as sp', 'sp.noregistrasifk', '=', 'pd.norec')
                // ->JOIN('strukpelayanan_t as sp1', 'sp1.norec', '=', 'pp.strukfk')
                // ->JOIN('loginuser_s as lu', 'lu.id', '=', 'sbm1.objectpegawaipenerimafk')
                // ->JOIN('pegawai_m as pgxxx', 'pgxxx.id', '=', 'lu.objectpegawaifk')
                // ->JOIN('loginuser_s as lgn', 'lgn.id', '=', 'sbm.objectpegawaipenerimafk')
                ->leftjoin('mapruangantoproduk_m as mrtp', function ($join) {
                    $join->on('mrtp.objectprodukfk', '=', 'pr.id');
                    $join->on('mrtp.objectruanganfk', '=', 'apd.objectruanganfk');
                })
                // ->join('login_s', function ($joinx) {
                //     $joinx->on('login_s.objectprodukfk', '=', 'sbm.id');
                //     $joinx->on('login_s.objectruanganfk', '=', 'pg.objectruanganfk');
                // })
                ->leftjoin('ruangan_m as ru1', 'ru1.id', '=', 'mrtp.objectruanganfk')
                // ->JOIN('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
                // ->JOIN('strukbuktipenerimaan_t as sbm1', 'sbm1.objectpegawaipenerimafk', '=', 'sbm.objectpegawaipenerimafk')
                // ->JOIN('pegawai_m as pg1', function ($join) {
                //     $join->on('pg1.id', '=', 'lu.objectpegawaifk');
                //     $join->on('sp.norec', '=', 'sbm.nostrukfk');
                // })
                ->leftJOIN('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                ->select(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'kl.namakelas',
                    'pg.id as iddokter',
                    'pg.namalengkap',
                    'pd.noregistrasi',
                    'ps.nocm',
                    'ps.namapasien',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kps.kelompokpasien',
                    'pp.hargadiscount',
                    'jpp.jenispetugaspe',
                    DB::raw(
                        'case when ru.objectdepartemenfk in (16,35) then \'Y\' ELSE \'N\' END as inap,
                        case when rk.namarekanan is not null then rk.namarekanan else \' - \' end as namarekanan,
                        case when pp.hargajual is not null then pp.hargajual else 0 end as harga,
                        case when pp.strukfk is null then \'n\' else \'y\' end as sbm'
                    )
                )
                //            ->whereNull('sp.statusenabled')
                // ->Where('pg.objectjenispegawaifk', '=', 1)
                ->whereNotIn('djp.objectjenisprodukfk', [97, 283])
                //                ->whereNotIn('djp.id',[58,155,161,167,476,477,149,1435,1440])
                // ->whereIn('pr.id', $ListProduk)
                ->whereNotIn('pr.id', [395])
                ->where('mrtp.statusenabled', '=', true)
                ->wherenull('pp.isobat')
                ->wherenotnull('pd.tglpulang')
                // ->wherenotnull('pd.nosbmlastfk')
                // ->wherenotnull('pp.strukfk')
                //                ->whereNotIn('ru1.objectdepartemenfk',[3,27])
                ->groupBy(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'kl.namakelas',
                    'pg.id',
                    'pg.namalengkap',
                    'pd.noregistrasi',
                    'ps.nocm',
                    'ps.namapasien',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kps.kelompokpasien',
                    'ru.objectdepartemenfk',
                    'rk.namarekanan',
                    'pp.hargajual',
                    'pd.nosbmlastfk',
                    'pp.hargadiscount',
                    'jpp.jenispetugaspe'
                );

            // return($request['tglSbm']);
            // die();
            if ($request['tglSbm'] == 'true') {
                if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                    $data = $data->where('sbm1.tglsbm', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                    $tgl = $request['tglAkhir']; //." 23:59:59";
                    $data = $data->where('sbm1.tglsbm', '<=', $tgl);
                }
                // return($request['tglAwal']);
                // die();
                // if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined" && isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                //     $data = $data->whereBetween('sbm.tglsbm', [$request['tglAwal'],$request['tglAkhir']]);
                //     // $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
                // }
            } else {
                if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                    $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                    $tgl = $request['tglAkhir']; //." 23:59:59";
                    $data = $data->where('pp.tglpelayanan', '<=', $tgl);
                }
            }
            // return($request['onlyDok']);
            // die();
            if ($request['onlyDok'] == 'true') {
                $data = $data->Where('pg.objectjenispegawaifk', '=', 1);
            } else {
            }
            if ($request['jaskep'] == 'true') {
                $data = $data->Where('pg.objectjenispegawaifk', '!=', 1);
                $data = $data->where('pr.namaproduk', 'not like', '%akomodasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%administrasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%administrasi%');
                $data = $data->where('pr.namaproduk', 'not like', '%EKG%');
                $data = $data->whereNotIn('pg.id', [27678, 27703]);
            } else {
            }
            if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
                $data = $data->where('ru.id', '=', $request['idRuangan']);
            }
            if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
                if ($request['idKelompok'] == 135 || $request['idKelompok'] == '135') {
                    $data = $data->whereIn('pd.objectkelompokpasienlastfk', [1, 5, 3]);
                } else {
                    $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['idKelompok']);
                }
            }
            if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
                $data = $data->where('pg.id', '=', $request['idDokter']);
            }
            if (isset($request['listDokter']) && $request['listDokter'] != "" && $request['listDokter'] != "undefined") {
                $dok = $request['listDokter'];
                $data = $data->whereRaw("pg.id IN ($dok)");
            }
            if ($request['notInTindakan'] == 'true') {

                if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
                    $asu = $request['listProduk'];
                    $data = $data->whereRaw("pr.id NOT IN ($asu)");
                }
            } else {

                if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
                    $asu = $request['listProduk'];
                    $data = $data->whereRaw("pr.id IN ($asu)");
                }
            }
            if ($request['toPenunjang'] == 'true') {
                // return($request['Penunjang']);
                // die();
                if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                    $data = $data->where('ruasal.objectdepartemenfk', '=', $request['idDept']);
                }
                if (isset($request['listDepartemen']) && $request['listDepartemen'] != "" && $request['listDepartemen'] != "undefined") {
                    $dep = $request['listDepartemen'];
                    $data = $data->whereRaw("ruasal.objectdepartemenfk IN ($dep)");
                }
                if (isset($request['Penunjang']) && $request['Penunjang'] != "" && $request['Penunjang'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['Penunjang']);
                }
            } else {
                if (isset($request['listDepartemen']) && $request['listDepartemen'] != "" && $request['listDepartemen'] != "undefined") {
                    $dep = $request['listDepartemen'];
                    $data = $data->whereRaw("ru.objectdepartemenfk IN ($dep)");
                }
                if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
                }
            }
            // if (isset($request['listProduk']) && $request['listProduk'] != "" && $request['listProduk'] != "undefined") {
            //     $asu = $request['listProduk'];
            //     $data = $data->whereRaw("pr.id IN ($asu)");
            // }
            if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
                $data = $data->where('kl.id', '=', $request['kelas']);
            }
            if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
                $data = $data->where('ppp.objectjenispetugaspefk', '=', $request['PetugasPe']);
            }
            if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
                $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noReg'] . '%');
            }
            $data = $data->distinct();
            $data = $data->get();

            $results = array();
            foreach ($data as $item) {
                $results[] = array(
                    'tglpelayanan' => $item->tglpelayanan,
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namakelas' => $item->namakelas,
                    'kelompokpasien' => $item->kelompokpasien,
                    'rekanan' => $item->namarekanan,
                    'inap' => $item->inap,
                    'ruangan' => $item->namaruangan,
                    'layanan' => $item->namaproduk,
                    'tarif' => $item->harga,
                    'jumlah' => $item->jumlah,
                    'statusbayar' => $item->sbm,
                    'iddokter' => $item->iddokter,
                    'dokter' => $item->namalengkap,
                    'hargadiscount' => $item->hargadiscount,
                    'jenispetugaspe'=> $item->jenispetugaspe
                );
            }
        }
        $result = array(
            'data' => $results,
            'message' => 'mn@epic',
        );

        return $this->respond($result);
    }
    public function getJadwalDokter(Request $request)
    {
        $data = \DB::table('pegawai_m as pg')
            ->JOIN('pegawaijadwalkerja_m as jdw', 'jdw.objectpegawaifk', '=', 'pg.id')
            ->JOIN('kalender_s as kld', 'kld.id', '=', 'jdw.objecttanggalfk')
            ->JOIN('shiftkerja_m as sf', 'sf.id', '=', 'jdw.objectshiftfk')
            ->select('pg.id as iddokter', 'pg.namalengkap as namadokter', 'kld.tanggal', 'kld.namahari', 'kld.namabulan', 'sf.jammasuk', 'sf.jampulang')
            ->Where('pg.objectjenispegawaifk', '=', 1)
            ->Where('pg.objecttypepegawaifk', '=', 1);

        if (isset($request['namabulan']) && $request['namabulan'] != "" && $request['namabulan'] != "undefined") {
            //            $data = $data->where('kld.namabulan', 'like', '%' . $request['namabulan'] . '%');
            $data = $data->where('kld.namabulan', '=', $request['namabulan']);
        }
        //        if (isset($request['tanggal']) && $request['tanggal'] != "" && $request['tanggal'] != "undefined") {
        //            $data = $data->where('pp.tglpelayanan', '<=');
        //        }
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $data = $data->where('pg.id', $request['idDokter']);
        }
        //        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
        //            $data = $data->where('ru.id',$request['idRuangan']);
        //        }
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );

        return $this->respond($result);
    }
    public function CetakLaporanLayanan(Request $request)
    {
        DB::beginTransaction();
        try {
            $IdLaporan = $this->generateCode(new TempLaporanLayanan(), 'idlaplayanan', 10, 'LL' . $this->getDateTime()->format('ym'));
            foreach ($request['details'] as $item) {
                if ($IdLaporan != '') {
                    $data = new TempLaporanLayanan();
                    $str = $data->generateNewId();
                    $data->idlaplayanan = $IdLaporan;
                    $data->norec = $str;
                    $data->tgllayanan = $item['tglpelayanan'];
                    $data->nocm = $item['nocm'];
                    $data->namapasien = $item['namapasien'];
                    $data->statusinap = $item['inap'];
                    $data->rekanan = $item['rekanan'];
                    $data->unit = $item['ruangan'];
                    $data->kelas = $item['namakelas'];
                    $data->layanan = $item['layanan'];
                    $data->tarif = $item['tarif'];
                    $data->jumlah = $item['jumlah'];
                    $data->paid = $item['statusbayar'];
                    //                    $data->tglawal = $item['tglawal'];
                    //                    $data->tglakhir = $item['tglakhir'];
                    $data->iddokter = $item['iddokter'];
                    $data->namadokter = $item['dokter'];
                    $data->kelompokpasien = $item['kelompokpasien'];
                    $data->save();
                    //                    $norec=$data->norec;
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Cetak Laporan Layanan!!!";
        }

        if ($transStatus == 'true') {
            $transMessage = "";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noId" => $IdLaporan,
                "norec" => $data->norec,
                "as" => 'cepotTea',
            );
        } else {
            $transMessage = "Cetak Laporan Layanan!!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noId" => $IdLaporan,
                "norec" => $data->norec,
                "as" => 'cepotTea',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataProduk(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->select('pr.id', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar', 'pr.kdproduk')
            ->where('pr.statusenabled', true)
            //            ->where('jp.id',97)
            ->orderBy('pr.namaproduk');
        //            ->take($req['take'])
        //            ->get();
        if (
            isset($req['namaproduk']) &&
            $req['namaproduk'] != "" &&
            $req['namaproduk'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('pr.namaproduk', 'like', '%' . $req['namaproduk'] . '%');
        };

        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('pr.namaproduk', 'like', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(20);
        $dataProduk = $dataProduk->get();

        $dataKonversiProduk = \DB::table('konversisatuan_t as ks')
            ->JOIN('satuanstandar_m as ss', 'ss.id', '=', 'ks.satuanstandar_asal')
            ->JOIN('satuanstandar_m as ss2', 'ss2.id', '=', 'ks.satuanstandar_tujuan')
            ->select(
                'ks.objekprodukfk',
                'ks.satuanstandar_asal',
                'ss.satuanstandar',
                'ks.satuanstandar_tujuan',
                'ss2.satuanstandar as satuanstandar2',
                'ks.nilaikonversi'
            )
            ->where('ks.statusenabled', true)
            ->get();


        $dataProdukResult = [];
        foreach ($dataProduk as $item) {
            $satuanKonversi = [];
            foreach ($dataKonversiProduk  as $item2) {
                if ($item->id == $item2->objekprodukfk) {
                    $satuanKonversi[] = array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult[] = array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
                'kdproduk' => $item->kdproduk,
            );
        }

        return $this->respond($dataProdukResult);
    }

    public function GetLaporanPasienBaruLama(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //            ->leftjoin ('alamat_m as alm','alm.nocmfk','=','ps.id')
            ->join('ruangan_m as rg', 'rg.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('batalregistrasi_t as btl', 'btl.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->select(
                'ps.namapasien',
                'ps.nocm',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.statuspasien',
                'rg.namaruangan',
                'kp.kelompokpasien',
                DB::raw("CASE WHEN rk.namarekanan is null then '-' ELSE rk.namarekanan end as penjaminpasien,
                case when 
                SUBSTRING( ps.nocm, 1, 3) = '016' or SUBSTRING( ps.nocm, 1, 3) = '008' 
                then 'BARU' else 'LAMA' end as statuspatok")
            );

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
            $data = $data->where('rg.objectdepartemenfk', '=', $request['deptId']);
        }
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $data = $data->where('pd.objectruanganlastfk', '=', $request['ruangId']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['kelompokPasien']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != "" && $request['StatusPasien'] != "undefined") {
            $data = $data->where('pd.statuspasien', 'like', '%' . $request['StatusPasien'] . '%');
        }
        //        if (isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined") {
        //            $data = $data->take($request['jmlRows']);
        //        }
        $data = $data->whereNull('btl.pasiendaftarfk');
        $data = $data->whereNotIn('rg.objectdepartemenfk', [3, 27]);
        $data = $data->orderBy('pd.tglregistrasi', 'Asc');
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }
    public function GetLaporanCetakKartu(Request $request)
    {
        $data = \DB::table('identifikasipasien_t as ip')
            ->leftjoin('loginuser_s as log', 'log.id', '=', 'ip.objectloginuserfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'log.objectpegawaifk')
            ->leftjoin('pasien_m as pm', 'pm.id', '=', 'ip.nocmfk')
            ->select(
                'pg.namalengkap',
                'pm.namapasien',
                'pm.nocm',
                'ip.tanggal'
             );

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('ip.tanggal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('ip.tanggal', '<=', $tgl);
        }
        // if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
        //     $data = $data->where('rg.objectdepartemenfk', '=', $request['deptId']);
        // }
        // if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
        //     $data = $data->where('pd.objectruanganlastfk', '=', $request['ruangId']);
        // }
        // if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
        //     $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['kelompokPasien']);
        // }
        // if (isset($request['StatusPasien']) && $request['StatusPasien'] != "" && $request['StatusPasien'] != "undefined") {
        //     $data = $data->where('pd.statuspasien', 'like', '%' . $request['StatusPasien'] . '%');
        // }
        //        if (isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined") {
        //            $data = $data->take($request['jmlRows']);
        //        }
        // $data = $data->whereNull('btl.pasiendaftarfk');
        // $data = $data->whereNotIn('rg.objectdepartemenfk', [3, 27]);
        $data = $data->orderBy('ip.tanggal', 'Asc');
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }

    public function getDataLaporanRincianPelayanan(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $idDept =  ' ';
        $paramsTgl = 'pd.tglregistrasi';
        $data = [];
        if (isset($request['isTglPulang']) && $request['isTglPulang'] != "" && $request['isTglPulang'] != "undefined") {
            if ($request['isTglPulang'] == true) {
                $paramsTgl = 'pd.tglpulang';
            }
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan =  ' ';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }

        if ($request['idDept'] == 16 || $request['idDept'] == '16') {
            $data = DB::select(DB::raw("
                                 select * from ( SELECT convert(varchar, apd.tglmasuk,105) as tglregistrasi,convert(varchar,apd.tglkeluar,105) as tglpulang,
                             convert(varchar,apd.tglmasuk,8) as jamperiksa,ru.namaruangan,pg.namalengkap as dokter,
                             --kp.kelompokpasien as tipepasien,
                             pd.noregistrasi,pm.nocm,pm.namapasien,pm.nohp,convert(varchar, pm.tgllahir, 105) as tgllahir,
                             jk.jeniskelamin,ag.agama,pend.pendidikan,pkr.pekerjaan,sp.statusperkawinan,
                             CASE WHEN pc.ALAMAT IS NULL THEN pm.alamatrmh ELSE REPLACE(REPLACE(pc.ALAMAT, CHAR(13), ''), CHAR(10), '') END AS alamat,
                             CASE WHEN kel.KELURAHANI IS NULL THEN dsk.namadesakelurahan ELSE LTRIM(RTRIM(kel.KELURAHANI)) END AS kelurahan,
                             CASE WHEN kec.KECAMATANI IS NULL THEN kcm.namakecamatan ELSE LTRIM(RTRIM(kec.KECAMATANI)) END AS kecamatan,
                             CASE WHEN kab.KABUPATENI IS NULL THEN kb.namakotakabupaten ELSE LTRIM(RTRIM(kab.KABUPATENI)) END AS kabupaten,
                             pd.tglregistrasi as tglregistrasiReal,pm.tgllahir as tgllahirReal,pd.statuspasien as jenispasien,
                             CASE WHEN ddp.noregistrasifk IS NULL THEN '-' ELSE dg.kddiagnosa + '-' + dg.namadiagnosa END as kodepenyakit,
                             CASE WHEN cus.NAME IS NULL THEN kp.kelompokpasien ELSE cus.NAME END as carabayar,ru2.namaruangan as ruanganakhir,
                                  CASE WHEN ap.jenispeserta IS NULL OR ap.jenispeserta = '' THEN kp.kelompokpasien ELSE ap.jenispeserta END AS tipepasien,
                             row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum,
                              row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum_ru

                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                INNER JOIN ruangan_m as ru2 on ru2.id = pd.objectruanganlastfk
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk 
                LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id
                LEFT JOIN desakelurahan_m as dsk on dsk.id = alm.objectdesakelurahanfk
                LEFT JOIN kecamatan_m as kcm on kcm.id = alm.objectkecamatanfk
                LEFT JOIN kotakabupaten_m as kb on kb.id = alm.objectkotakabupatenfk
                LEFT JOIN statusperkawinan_m as sp on sp.id = pm.objectstatusperkawinanfk
                LEFT JOIN pendidikan_m as pend on pend.id = pm.objectpendidikanfk
                LEFT JOIN pekerjaan_m as pkr on pkr.id = pm.objectpekerjaanfk
                INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                LEFT JOIN agama_m as ag on ag.id = pm.objectagamafk
                LEFT JOIN pegawai_m as pg on pg.id = pd.objectpegawaifk
                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                LEFT JOIN pelayananpasien_t as pp on pp.noregistrasifk = apd.norec
                LEFT JOIN PASIEN_copy as pc on pc.nocmfk = pm.id
                LEFT JOIN KELURAHANI as kel on kel.KD_KELURAHANI = pc.KD_KELURAHAN
                LEFT JOIN KECAMATANI as kec on kec.KD_KECAMATANI = kel.KD_KECAMATAN
                LEFT JOIN KABUPATENI as kab on kab.KD_KABUPATENI = kec.KD_KABUPATEN
                LEFT JOIN CUSTOMERI as cus on cus.KELOMPOK_ID = pc.KD_ASURANSI
                LEFT JOIN diagnosapasien_t as dp on dp.noregistrasifk = apd.norec
                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                LEFT JOIN diagnosa_m as dg on dg.id = ddp.objectdiagnosafk 
                LEFT JOIN asuransipasien_m as ap on ap.nocmfk = pm.id
                WHERE br.pasiendaftarfk IS NULL AND pp.noregistrasifk IS NOT NULL AND (ddp.objectjenisdiagnosafk IS NULL OR ddp.objectjenisdiagnosafk = 1)    
			    AND  $paramsTgl BETWEEN '$tglAwal' and '$tglAkhir'
                $idDept 
                $idRuangan		
                GROUP BY pd.tglregistrasi, apd.tglmasuk,apd.tglkeluar,apd.tglmasuk,ru.namaruangan,pg.namalengkap,
                         kp.kelompokpasien,cus.NAME,pd.noregistrasi,pm.nocm,pm.namapasien,pm.nohp,pm.tgllahir,
                         jk.jeniskelamin,ag.agama,pend.pendidikan,pkr.pekerjaan,sp.statusperkawinan,
                         pc.ALAMAT,kel.KELURAHANI,kec.KECAMATANI,kab.KABUPATENI,pd.statuspasien,ddp.noregistrasifk,
                         dg.kddiagnosa,dg.namadiagnosa,pm.alamatrmh,dsk.namadesakelurahan,kcm.namakecamatan,
                         kb.namakotakabupaten,ru.namaruangan,ru2.namaruangan,ap.jenispeserta,apd.norec,ddp.tglinputdiagnosa) 
                         as x where  rownum =1 and rownum_ru = 1"));
        } else {
            $data = DB::select(DB::raw("select * from (SELECT convert(varchar, apd.tglmasuk,105) as tglregistrasi,convert(varchar,apd.tglkeluar,105) as tglpulang,
						 convert(varchar,apd.tglmasuk,8) as jamperiksa,ru.namaruangan,pg.namalengkap as dokter,
						 pd.noregistrasi,pm.nocm,pm.namapasien,pm.nohp,convert(varchar, pm.tgllahir, 105) as tgllahir,
						 jk.jeniskelamin,ag.agama,pend.pendidikan,pkr.pekerjaan,sp.statusperkawinan,
						 CASE WHEN pc.ALAMAT IS NULL THEN pm.alamatrmh ELSE REPLACE(REPLACE(pc.ALAMAT, CHAR(13), ''), CHAR(10), '') END AS alamat,
						 CASE WHEN kel.KELURAHANI IS NULL THEN dsk.namadesakelurahan ELSE LTRIM(RTRIM(kel.KELURAHANI)) END AS kelurahan,
						 CASE WHEN kec.KECAMATANI IS NULL THEN kcm.namakecamatan ELSE LTRIM(RTRIM(kec.KECAMATANI)) END AS kecamatan,
						 CASE WHEN kab.KABUPATENI IS NULL THEN kb.namakotakabupaten ELSE LTRIM(RTRIM(kab.KABUPATENI)) END AS kabupaten,
						 pd.tglregistrasi as tglregistrasiReal,pm.tgllahir as tgllahirReal,pd.statuspasien as jenispasien,
						 CASE WHEN ddp.noregistrasifk IS NULL THEN '-' ELSE dg.kddiagnosa + '-' + dg.namadiagnosa END as kodepenyakit,
						 ru2.namaruangan as ruanganakhir,
						 CASE WHEN ap.jenispeserta IS NULL OR ap.jenispeserta = '' THEN kp.kelompokpasien ELSE ap.jenispeserta END AS tipepasien,
						       row_number() over (partition by apd.norec order by ddp.tglinputdiagnosa asc) as rownum 
                FROM pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk                
                LEFT JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                INNER JOIN ruangan_m as ru2 on ru2.id = pd.objectruanganlastfk
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk 
                LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id
                LEFT JOIN desakelurahan_m as dsk on dsk.id = alm.objectdesakelurahanfk
                LEFT JOIN kecamatan_m as kcm on kcm.id = alm.objectkecamatanfk
                LEFT JOIN kotakabupaten_m as kb on kb.id = alm.objectkotakabupatenfk
                LEFT JOIN statusperkawinan_m as sp on sp.id = pm.objectstatusperkawinanfk
                LEFT JOIN pendidikan_m as pend on pend.id = pm.objectpendidikanfk
                LEFT JOIN pekerjaan_m as pkr on pkr.id = pm.objectpekerjaanfk
                INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                LEFT JOIN agama_m as ag on ag.id = pm.objectagamafk
                LEFT JOIN pegawai_m as pg on pg.id = pd.objectpegawaifk
                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                LEFT JOIN pelayananpasien_t as pp on pp.noregistrasifk = apd.norec
                LEFT JOIN PASIEN_copy as pc on pc.nocmfk = pm.id
                LEFT JOIN KELURAHANI as kel on kel.KD_KELURAHANI = pc.KD_KELURAHAN
                LEFT JOIN KECAMATANI as kec on kec.KD_KECAMATANI = kel.KD_KECAMATAN
                LEFT JOIN KABUPATENI as kab on kab.KD_KABUPATENI = kec.KD_KABUPATEN
                LEFT JOIN CUSTOMERI as cus on cus.KELOMPOK_ID = pc.KD_ASURANSI
                LEFT JOIN diagnosapasien_t as dp on dp.noregistrasifk = apd.norec
                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                LEFT JOIN diagnosa_m as dg on dg.id = ddp.objectdiagnosafk 
                LEFT JOIN asuransipasien_m as ap on ap.nocmfk = pm.id
                WHERE br.pasiendaftarfk IS NULL AND pp.noregistrasifk IS NOT NULL AND (ddp.objectjenisdiagnosafk IS NULL OR ddp.objectjenisdiagnosafk IN (1,5))
			    AND  $paramsTgl BETWEEN '$tglAwal' and '$tglAkhir'
                $idDept 
                $idRuangan		
                GROUP BY pd.tglregistrasi, apd.tglmasuk, apd.tglkeluar,apd.tglmasuk,ru.namaruangan,pg.namalengkap,
                         kp.kelompokpasien,cus.NAME,pd.noregistrasi,pm.nocm,pm.namapasien,pm.nohp,pm.tgllahir,
                         jk.jeniskelamin,ag.agama,pend.pendidikan,pkr.pekerjaan,sp.statusperkawinan,
                         pc.ALAMAT,kel.KELURAHANI,kec.KECAMATANI,kab.KABUPATENI,pd.statuspasien,ddp.noregistrasifk,
                         dg.kddiagnosa,dg.namadiagnosa,pm.alamatrmh,dsk.namadesakelurahan,kcm.namakecamatan,
                         kb.namakotakabupaten,ru.namaruangan,ru2.namaruangan,ap.jenispeserta,apd.norec,ddp.tglinputdiagnosa,apd.norec,ddp.tglinputdiagnosa) as x where  rownum =1 "));
        }

        return $this->respond($data);
    }

    public function getSensusPasienRawatInap(Request $request)
    {

        $filter = $request->all();

        $tglAwal = $filter['tglAwal'];

        $tglAkhir = $filter['tglAkhir'];

        $kelas = ' ';
        if (isset($filter['idkelas']) && $filter['idkelas'] != "" && $filter['idkelas'] != "undefined") {
            $kelas = ' AND pd.objectkelasfk = ' . $filter['idkelas'];
        }

        $ruId = '';
        if (isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
            $ruId = ' AND ru.id = ' . $filter['idRuangan'];
        }
        //        $jmlRow='';
        //        if(isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
        //            $jmlRow = ' top ' . $filter['jmlRow'];
        //        }
        $data =  DB::select(DB::raw("
        select * from 
			                (
			select pd.tglregistrasi,
				p.nocm,
				pd.noregistrasi,
				ru.namaruangan,
				p.namapasien,
				kp.kelompokpasien,
				kls.namakelas,
				alm.alamatlengkap,
				jk.jeniskelamin,
				pg.namalengkap AS namadokter,
				pd.norec AS norec_pd,
				pd.tglpulang,
				pd.statuspasien,
				p.tgllahir,
				pd.objectruanganlastfk,
				pd.objectkelasfk, apd.objectkamarfk,
				kmr.namakamar,apd.nobed,
				tt.reportdisplay as namabed,
				case when apd.noregistrasifk is not null THEN dm.kddiagnosa || ', ' || dm.namadiagnosa else '-' end as namadiagnosa
				--,
			--row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum 
			FROM
				pasiendaftar_t AS pd
			INNER JOIN antrianpasiendiperiksa_t AS apd ON pd.norec = apd.noregistrasifk and apd.tglkeluar is null
			--inner join registrasipelayananpasien_t as rpp on rpp.noregistrasifk=pd.norec
			INNER JOIN pasien_m AS p ON p.id = pd.nocmfk
			INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
			INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
			INNER JOIN jeniskelamin_m AS jk ON jk.id = p.objectjeniskelaminfk
			LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
			LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
			LEFT JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk
			LEFT JOIN batalregistrasi_t AS br ON pd.norec = br.pasiendaftarfk
			LEFT JOIN kamar_m as kmr on kmr.id =apd.objectkamarfk
			LEFT JOIN tempattidur_m as tt on tt.id =apd.nobed
			LEFT JOIN alamat_m as alm on alm.nocmfk = p.id
			LEFT JOIN diagnosapasien_t as dt on dt.norec = pd.norec
			LEFT JOIN detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dt.norec
			LEFT JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
			LEFT JOIN jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
			where br.norec is null 
			$ruId
			$kelas
			and pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
			and pd.tglpulang is null 			
			) as x 
			--where x.rownum=1
			order by x.tglregistrasi descph
		"));
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getLaporanRekapPasienOnline(Request $request) {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $kelompokPasien = "";
        $ruangan = "";
        $departemen = "";
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $kelompokPasien = "and pd.objectkelompokpasienlastfk=" . $request['kelompokPasien'];
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $ruangan = "and ru.id=" . $request['idRuangan'];
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $departemen = "and ru.objectdepartemenfk=" . $request['idDept'];
        }
        if ($departemen == "") {
            $departemen = "and ru.id != 322";
        }
        if ($request['idDept'] == "18" && $ruangan == "") {
            $departemen = "and ru.objectdepartemenfk in (28, " . $request['idDept'] . ") and ru.id != 322";
        }

        $data = DB::select(DB::raw("
        select kp.kelompokpasien, 
        sum(case when day(pd.tglregistrasi) = 1 then 1 else 0 end) as 'tanggal1',
        sum(case when day(pd.tglregistrasi) = 2 then 1 else 0 end) as 'tanggal2',
        sum(case when day(pd.tglregistrasi) = 3 then 1 else 0 end) as 'tanggal3',
        sum(case when day(pd.tglregistrasi) = 4 then 1 else 0 end) as 'tanggal4',
        sum(case when day(pd.tglregistrasi) = 5 then 1 else 0 end) as 'tanggal5',
        sum(case when day(pd.tglregistrasi) = 6 then 1 else 0 end) as 'tanggal6',
        sum(case when day(pd.tglregistrasi) = 7 then 1 else 0 end) as 'tanggal7',
        sum(case when day(pd.tglregistrasi) = 8 then 1 else 0 end) as 'tanggal8',
        sum(case when day(pd.tglregistrasi) = 9 then 1 else 0 end) as 'tanggal9',
        sum(case when day(pd.tglregistrasi) = 10 then 1 else 0 end) as 'tanggal10',
        sum(case when day(pd.tglregistrasi) = 11 then 1 else 0 end) as 'tanggal11',
        sum(case when day(pd.tglregistrasi) = 12 then 1 else 0 end) as 'tanggal12',
        sum(case when day(pd.tglregistrasi) = 13 then 1 else 0 end) as 'tanggal13',
        sum(case when day(pd.tglregistrasi) = 14 then 1 else 0 end) as 'tanggal14',
        sum(case when day(pd.tglregistrasi) = 15 then 1 else 0 end) as 'tanggal15',
        sum(case when day(pd.tglregistrasi) = 16 then 1 else 0 end) as 'tanggal16',
        sum(case when day(pd.tglregistrasi) = 17 then 1 else 0 end) as 'tanggal17',
        sum(case when day(pd.tglregistrasi) = 18 then 1 else 0 end) as 'tanggal18',
        sum(case when day(pd.tglregistrasi) = 19 then 1 else 0 end) as 'tanggal19',
        sum(case when day(pd.tglregistrasi) = 20 then 1 else 0 end) as 'tanggal20',
        sum(case when day(pd.tglregistrasi) = 21 then 1 else 0 end) as 'tanggal21',
        sum(case when day(pd.tglregistrasi) = 22 then 1 else 0 end) as 'tanggal22',
        sum(case when day(pd.tglregistrasi) = 23 then 1 else 0 end) as 'tanggal23',
        sum(case when day(pd.tglregistrasi) = 24 then 1 else 0 end) as 'tanggal24',
        sum(case when day(pd.tglregistrasi) = 25 then 1 else 0 end) as 'tanggal25',
        sum(case when day(pd.tglregistrasi) = 26 then 1 else 0 end) as 'tanggal26',
        sum(case when day(pd.tglregistrasi) = 27 then 1 else 0 end) as 'tanggal27',
        sum(case when day(pd.tglregistrasi) = 28 then 1 else 0 end) as 'tanggal28',
        sum(case when day(pd.tglregistrasi) = 29 then 1 else 0 end) as 'tanggal29',
        sum(case when day(pd.tglregistrasi) = 30 then 1 else 0 end) as 'tanggal30',
        sum(case when day(pd.tglregistrasi) = 31 then 1 else 0 end) as 'tanggal31'
        from antrianpasienregistrasi_t as apr left join
        pasiendaftar_t as pd on pd.statusschedule = apr.noreservasi and pd.nocmfk = apr.nocmfk left join
        kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk left join
        ruangan_m as ru on ru.id = apr.objectruanganfk
        where pd.tglregistrasi between '$tglAwal' and '$tglAkhir' and apr.statusenabled = 1 $kelompokPasien $ruangan $departemen
        group by kp.kelompokpasien order by kp.kelompokpasien 
        "));

        $datafix = [];
        foreach ($data as $item) {
            $datafix[] = array (
                'kelompokpasien' => $item->kelompokpasien,
                'tanggal1' => (float)$item->tanggal1,
                'tanggal2' => (float)$item->tanggal2,
                'tanggal3' => (float)$item->tanggal3,
                'tanggal4' => (float)$item->tanggal4,
                'tanggal5' => (float)$item->tanggal5,
                'tanggal6' => (float)$item->tanggal6,
                'tanggal7' => (float)$item->tanggal7,
                'tanggal8' => (float)$item->tanggal8,
                'tanggal9' => (float)$item->tanggal9,
                'tanggal10' => (float)$item->tanggal10,
                'tanggal11' => (float)$item->tanggal11,
                'tanggal12' => (float)$item->tanggal12,
                'tanggal13' => (float)$item->tanggal13,
                'tanggal14' => (float)$item->tanggal14,
                'tanggal15' => (float)$item->tanggal15,
                'tanggal16' => (float)$item->tanggal16,
                'tanggal17' => (float)$item->tanggal17,
                'tanggal18' => (float)$item->tanggal18,
                'tanggal19' => (float)$item->tanggal19,
                'tanggal20' => (float)$item->tanggal20,
                'tanggal21' => (float)$item->tanggal21,
                'tanggal22' => (float)$item->tanggal22,
                'tanggal23' => (float)$item->tanggal23,
                'tanggal24' => (float)$item->tanggal24,
                'tanggal25' => (float)$item->tanggal25,
                'tanggal26' => (float)$item->tanggal26,
                'tanggal27' => (float)$item->tanggal27,
                'tanggal28' => (float)$item->tanggal28,
                'tanggal29' => (float)$item->tanggal29,
                'tanggal30' => (float)$item->tanggal30,
                'tanggal31' => (float)$item->tanggal31,
            );
        }

        return $this->respond($datafix);
    }
    public function getRekapPasienOnlinePoli(Request $request) {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruangan = "";
        $departemen = "";
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $ruangan = "and ru.id=" . $request['idRuangan'];
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $departemen = "and ru.objectdepartemenfk=" . $request['idDept'];
        }
        if ($departemen == "") {
            $departemen = "and ru.id != 322";
        }
        if ($request['idDept'] == "18" && $ruangan == "") {
            $departemen = "and ru.objectdepartemenfk in (28, " . $request['idDept'] . ") and ru.id != 322";
        }

        $data = DB::select(DB::raw("
        select x.*, 
        (x.tanggal1 + x.tanggal2 + x.tanggal3 + x.tanggal4 + x.tanggal5 + x.tanggal6 + x.tanggal7 + x.tanggal8 + x.tanggal9 + x.tanggal10 + x.tanggal11 + x.tanggal12 + x.tanggal13 + x.tanggal14 + x.tanggal15 + x.tanggal16 + x.tanggal17 + x.tanggal18 + x.tanggal19 + x.tanggal20 + x.tanggal21 + x.tanggal22 + x.tanggal23 + x.tanggal24 + x.tanggal25 + x.tanggal26 + x.tanggal27 + x.tanggal28 + x.tanggal29 + x.tanggal30 + x.tanggal31 )as jumlahpasien  
        from (
		select ru.namaruangan,
        sum(case when day(pd.tglregistrasi) = 1 then 1 else 0 end) as 'tanggal1',
        sum(case when day(pd.tglregistrasi) = 2 then 1 else 0 end) as 'tanggal2',
        sum(case when day(pd.tglregistrasi) = 3 then 1 else 0 end) as 'tanggal3',
        sum(case when day(pd.tglregistrasi) = 4 then 1 else 0 end) as 'tanggal4',
        sum(case when day(pd.tglregistrasi) = 5 then 1 else 0 end) as 'tanggal5',
        sum(case when day(pd.tglregistrasi) = 6 then 1 else 0 end) as 'tanggal6',
        sum(case when day(pd.tglregistrasi) = 7 then 1 else 0 end) as 'tanggal7',
        sum(case when day(pd.tglregistrasi) = 8 then 1 else 0 end) as 'tanggal8',
        sum(case when day(pd.tglregistrasi) = 9 then 1 else 0 end) as 'tanggal9',
        sum(case when day(pd.tglregistrasi) = 10 then 1 else 0 end) as 'tanggal10',
        sum(case when day(pd.tglregistrasi) = 11 then 1 else 0 end) as 'tanggal11',
        sum(case when day(pd.tglregistrasi) = 12 then 1 else 0 end) as 'tanggal12',
        sum(case when day(pd.tglregistrasi) = 13 then 1 else 0 end) as 'tanggal13',
        sum(case when day(pd.tglregistrasi) = 14 then 1 else 0 end) as 'tanggal14',
        sum(case when day(pd.tglregistrasi) = 15 then 1 else 0 end) as 'tanggal15',
        sum(case when day(pd.tglregistrasi) = 16 then 1 else 0 end) as 'tanggal16',
        sum(case when day(pd.tglregistrasi) = 17 then 1 else 0 end) as 'tanggal17',
        sum(case when day(pd.tglregistrasi) = 18 then 1 else 0 end) as 'tanggal18',
        sum(case when day(pd.tglregistrasi) = 19 then 1 else 0 end) as 'tanggal19',
        sum(case when day(pd.tglregistrasi) = 20 then 1 else 0 end) as 'tanggal20',
        sum(case when day(pd.tglregistrasi) = 21 then 1 else 0 end) as 'tanggal21',
        sum(case when day(pd.tglregistrasi) = 22 then 1 else 0 end) as 'tanggal22',
        sum(case when day(pd.tglregistrasi) = 23 then 1 else 0 end) as 'tanggal23',
        sum(case when day(pd.tglregistrasi) = 24 then 1 else 0 end) as 'tanggal24',
        sum(case when day(pd.tglregistrasi) = 25 then 1 else 0 end) as 'tanggal25',
        sum(case when day(pd.tglregistrasi) = 26 then 1 else 0 end) as 'tanggal26',
        sum(case when day(pd.tglregistrasi) = 27 then 1 else 0 end) as 'tanggal27',
        sum(case when day(pd.tglregistrasi) = 28 then 1 else 0 end) as 'tanggal28',
        sum(case when day(pd.tglregistrasi) = 29 then 1 else 0 end) as 'tanggal29',
        sum(case when day(pd.tglregistrasi) = 30 then 1 else 0 end) as 'tanggal30',
        sum(case when day(pd.tglregistrasi) = 31 then 1 else 0 end) as 'tanggal31'
        from antrianpasienregistrasi_t as apr left join
        pasiendaftar_t as pd on pd.statusschedule = apr.noreservasi and pd.nocmfk = apr.nocmfk left join
        ruangan_m as ru on ru.id = apr.objectruanganfk
        where pd.tglregistrasi between '$tglAwal' and '$tglAkhir' and apr.statusenabled = 1 $ruangan $departemen
        group by ru.namaruangan) as x order by x.namaruangan
        "));

        $datafix = [];
        foreach ($data as $item) {
            $datafix[] = array (
                'namaruangan' => $item->namaruangan,
                'tanggal1' => (float)$item->tanggal1,
                'tanggal2' => (float)$item->tanggal2,
                'tanggal3' => (float)$item->tanggal3,
                'tanggal4' => (float)$item->tanggal4,
                'tanggal5' => (float)$item->tanggal5,
                'tanggal6' => (float)$item->tanggal6,
                'tanggal7' => (float)$item->tanggal7,
                'tanggal8' => (float)$item->tanggal8,
                'tanggal9' => (float)$item->tanggal9,
                'tanggal10' => (float)$item->tanggal10,
                'tanggal11' => (float)$item->tanggal11,
                'tanggal12' => (float)$item->tanggal12,
                'tanggal13' => (float)$item->tanggal13,
                'tanggal14' => (float)$item->tanggal14,
                'tanggal15' => (float)$item->tanggal15,
                'tanggal16' => (float)$item->tanggal16,
                'tanggal17' => (float)$item->tanggal17,
                'tanggal18' => (float)$item->tanggal18,
                'tanggal19' => (float)$item->tanggal19,
                'tanggal20' => (float)$item->tanggal20,
                'tanggal21' => (float)$item->tanggal21,
                'tanggal22' => (float)$item->tanggal22,
                'tanggal23' => (float)$item->tanggal23,
                'tanggal24' => (float)$item->tanggal24,
                'tanggal25' => (float)$item->tanggal25,
                'tanggal26' => (float)$item->tanggal26,
                'tanggal27' => (float)$item->tanggal27,
                'tanggal28' => (float)$item->tanggal28,
                'tanggal29' => (float)$item->tanggal29,
                'tanggal30' => (float)$item->tanggal30,
                'tanggal31' => (float)$item->tanggal31,
                'jumlahpasien' => (float)$item->jumlahpasien
            );
        }

        return $this->respond($datafix);
    }

    public function getDataLaporanPasienPulangCsr(Request $request) {
        $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $kelompokPasien = "";
        $jaminanKhusus = "";
        $isRajal = "";
        $isRM = "";
        $ruangan = "";
        $depart = "";
        $data10 = [];
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $kelompokPasien = $request['kelompokPasien'];
            $kelompokPasien = "and pd.objectkelompokpasienlastfk='$kelompokPasien'";
        }
        if (isset($request['jaminanKhusus']) && $request['jaminanKhusus'] != "" && $request['jaminanKhusus'] != "undefined") {
            $jaminanKhusus = $request['jaminanKhusus'];
            $jaminanKhusus = "and pd.objectjaminankhusus='$jaminanKhusus'";
        }
        if (isset($request['isRJ']) && $request['isRJ'] != "" && $request['isRJ'] != "undefined") {
            $isRajal = "and pd.objectruanganlastfk in (3,4,6,7,8,9,12,13,14,17,19,25,26,27,20,31,33,37,70,89,97,98,130,132,198,230,241,243,245,247,248,249,250,253,255,268,319,322,446,448,456,459,461,462,535,543,552,564)";
        } else if (isset($request['isRM']) && $request['isRM'] != "" && $request['isRM'] != "undefined") {
            $isRM = "and pd.objectruanganlastfk in (3,4,6,7,8,9,12,13,14,17,19,20,25,26,27,31,33,70,89,97,130,132,247,248,250,253,268,319,322,446,447,448,453,456,543,552,564,575,576,784,788,790,792) 
            ";
        } else {

            if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
                $ruangan = "and pd.objectruanganlastfk ='$request[idRuangan]'";
            }

            if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                $depart = "and ru.objectdepartemenfk ='$request[idDept]'";
            }
        }
        $data = \DB::select(DB::raw("
        select distinct [ru].[namaruangan], [ru].[objectdepartemenfk], [jkm].[namaexternal], [jkp].[jeniskelompokpasien], [pd].[objectkelompokpasienlastfk], [klp].[kelompokpasien], [rk].[namarekanan], [pd].[objectjaminankhusus], [pd].[tglregistrasi], [pd].[noregistrasi], [ps].[nocm], [ps].[namapasien], sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end) as karcis,[pd].[tglcsr],
        sum(case when pr.id =10013116 then pp.jumlah else 0 end) as jmlembos,
        sum(case when pr.id =10013116 then pp.hargajual* pp.jumlah else 0 end) as embos,
        sum(case when kp.id = 26 then pp.jumlah else 0 end) as jmlkonsul,
        sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end) as konsul,
        sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.jumlah else 0 end) as jmltindakan,
        sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end) as tindakan,
        sum(case when pp.aturanpakai is not null then pp.jumlah else 0 end) as jmlresep,
        sum(case when pp.aturanpakai is not null then pp.hargajual* pp.jumlah+ pp.jasa else 0 end) as obat,
        sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,
        sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when pr.id =10013116 then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when pp.aturanpakai is not null then pp.hargajual* pp.jumlah+ pp.jasa else 0 end)
        -sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as total 
        from [pelayananpasien_t] as [pp] left join 
        [strukpelayanan_t] as [sp] on [pp].[strukfk] = [sp].[norec] left join 
        [strukbuktipenerimaan_t] as [sbm] on [sp].[nosbmlastfk] = [sbm].[norec] left join 
        [strukpelayananpenjamin_t] as [sppj] on [sp].[norec] = [sppj].[nostrukfk] inner join
        [antrianpasiendiperiksa_t] as [apd] on [apd].[norec] = [pp].[noregistrasifk] inner join 
        [pasiendaftar_t] as [pd] on [pd].[norec] = [apd].[noregistrasifk] left join 
        [pegawai_m] as [pg] on [pg].[id] = [apd].[objectpegawaifk] inner join
        [ruangan_m] as [ru] on [ru].[id] = [pd].[objectruanganlastfk] inner join
        [produk_m] as [pr] on [pr].[id] = [pp].[produkfk] left join
        [jaminankhusus_m] as [jkm] on [jkm].[id] = [pd].[objectjaminankhusus] inner join 
        [detailjenisproduk_m] as [djp] on [djp].[id] = [pr].[objectdetailjenisprodukfk] inner join 
        [jenisproduk_m] as [jp] on [jp].[id] = [djp].[objectjenisprodukfk] inner join
        [kelompokproduk_m] as [kp] on [kp].[id] = [jp].[objectkelompokprodukfk] inner join 
        [pasien_m] as [ps] on [ps].[id] = [pd].[nocmfk] left join 
        [jeniskelompokpasien_m] as [jkp] on [jkp].[id] = [ps].[objectjeniskelompokpasienfk] inner join 
        [kelompokpasien_m] as [klp] on [klp].[id] = [pd].[objectkelompokpasienlastfk] inner join 
        [rekanan_m] as [rk] on [rk].[id] = [pd].[objectrekananfk]
        where pd.objectjaminankhusus is not null and pd.objectjaminankhusus != 0 and pd.statusenabled=1 and pd.tglcsr BETWEEN '$tglAwal' and '$tglAkhir' $kelompokPasien $ruangan $depart $isRajal $isRM $jaminanKhusus
        --where [pp].[tglpelayanan] >= '2021-11-08 00:00' and [pp].[tglpelayanan] <= '2021-11-08 23:59' and [ps].[nocm] like '%00673669%' 
        group by [jkm].[namaexternal], [jkp].[jeniskelompokpasien], [ru].[objectdepartemenfk], [pd].[objectjaminankhusus], [ru].[namaruangan], [pd].[objectkelompokpasienlastfk], 
        [klp].[kelompokpasien], [rk].[namarekanan], [pd].[tglregistrasi], [pd].[noregistrasi], [ps].[nocm], [ps].[namapasien],[pd].[tglcsr]
        order by [pd].[noregistrasi] asc
        "));

        foreach($data as $item) {
            $data10[] = array(
                'noregistrasi' => $item->noregistrasi,
                'tindakan' => (float)$item->tindakan,
                'obat' => (float)$item->obat,
                'tglregistrasi' => $item->tglregistrasi,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'namaruangan' => $item->namaruangan,
                'kelompokpasien' => $item->kelompokpasien,
                'namarekanan' => $item->namarekanan,
                'namaexternal' => $item->namaexternal,
                'tglcsr' => $item->tglcsr,
                            );
        }

        return $this->respond($data10);
    }

    // public function getDataLaporanPasienPulangCsr(Request $request)
    // {
    //     $dataLogin = $request->all();
    //     $tglAwal = $request['tglAwal'];
    //     $tglAkhir = $request['tglAkhir'];
    //     $kelompokPasien = "";
    //     $jaminanKhusus = "";
    //     $isRajal = "";
    //     $isRM = "";
    //     $ruangan = "";
    //     $depart = "";
    //     if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
    //         $kelompokPasien = $request['kelompokPasien'];
    //         $kelompokPasien = "and pd.objectkelompokpasienlastfk='$kelompokPasien'";
    //     }
    //     if (isset($request['jaminanKhusus']) && $request['jaminanKhusus'] != "" && $request['jaminanKhusus'] != "undefined") {
    //         $jaminanKhusus = $request['jaminanKhusus'];
    //         $jaminanKhusus = "and pd.objectjaminankhusus='$jaminanKhusus'";
    //     }
    //     if (isset($request['isRJ']) && $request['isRJ'] != "" && $request['isRJ'] != "undefined") {
    //         $isRajal = "and pd.objectruanganlastfk in (3,4,6,7,8,9,12,13,14,17,19,25,26,27,20,31,33,37,70,89,97,98,130,132,198,230,241,243,245,247,248,249,250,253,255,268,319,322,446,448,456,459,461,462,535,543,552,564)";
    //     } else if (isset($request['isRM']) && $request['isRM'] != "" && $request['isRM'] != "undefined") {
    //         $isRM = "and pd.objectruanganlastfk in (3,4,6,7,8,9,12,13,14,17,19,20,25,26,27,31,33,70,89,97,130,132,247,248,250,253,268,319,322,446,447,448,453,456,543,552,564,575,576,784,788,790,792) 
    //         ";
    //     } else {

    //         if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
    //             $ruangan = "and pd.objectruanganlastfk ='$request[idRuangan]'";
    //         }

    //         if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
    //             $depart = "and ru.objectdepartemenfk ='$request[idDept]'";
    //         }
    //     }


    //     $data =  DB::select(DB::raw("
    //     select pd.tglregistrasi,pd.tglpulang,pd.noregistrasi,ps.nocm,ps.namapasien,jk.namaexternal, kp.kelompokpasien,rk.namarekanan,ru.namaruangan, case when pp.isobat is null then sum(pp.hargajual) else (0) end as tindakan, case when pp.isobat is not null then sum(pp.hargajual* pp.jumlah+ pp.jasa) else (0) end as obat, case when pd.tglcsr is null then '-' else pd.tglcsr end as tglcsr 
    //     from pasiendaftar_t as pd
    //     left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
    //     left join pasien_m as ps on ps.id = pd.nocmfk
    //     left join jaminankhusus_m as jk on jk.id = pd.objectjaminankhusus
    //     left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
    //     left join rekanan_m as rk on rk.id = pd.objectrekananfk
    //     left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
    //     left join pelayananpasien_t as pp on pp.noregistrasifk = apd.norec
    //     where pd.objectjaminankhusus is not null and pd.objectjaminankhusus != 0 and pd.statusenabled=1 and pd.tglcsr BETWEEN '$tglAwal' and '$tglAkhir' $kelompokPasien $ruangan $depart $isRajal $isRM $jaminanKhusus
    //     group by pd.tglregistrasi,pd.tglpulang,pd.noregistrasi,ps.nocm,ps.namapasien,jk.namaexternal, kp.kelompokpasien,rk.namarekanan,ru.namaruangan,pp.isobat,pd.tglcsr
    //     order by pd.noregistrasi"));



    //     $data10 = [];
    //     $sama = false;
    //     $tindakan = 0;
    //     $obat = 0;
    //     foreach ($data as $item) {
    //         $sama = false;
    //         $i = 0;
    //         $o = 0;
    //         // return($item->noregistrasi);
    //         // die();
    //         foreach ($data10 as $hideung) {
    //             if ($item->noregistrasi == $data10[$i]['noregistrasi']) {
    //                 $sama = true;
    //                 if ($item->tindakan != 0) {
    //                     $data10[$i]['tindakan'] = $tindakan;
    //                 } else if ($item->obat != 0) {
    //                     $data10[$i]['obat'] = $obat;
    //                 }
    //             }
    //             $i = $i + 1;
    //         }
    //         if ($sama == false) {
    //             $tindakan = 0;
    //             $obat = 0;
    //             if ($item->tindakan != 0) {
    //                 $tindakan = $item->tindakan;
    //             } else if ($item->obat != 0) {
    //                 $obat = $item->obat;
    //             }
    //             $data10[] = array(
    //                 'noregistrasi' => $item->noregistrasi,
    //                 'tindakan' => ceil($tindakan),
    //                 'obat' => ceil($obat),
    //                 'tglregistrasi' => $item->tglregistrasi,
    //                 'nocm' => $item->nocm,
    //                 'namapasien' => $item->namapasien,
    //                 'namaruangan' => $item->namaruangan,
    //                 'kelompokpasien' => $item->kelompokpasien,
    //                 'namarekanan' => $item->namarekanan,
    //                 'namaexternal' => $item->namaexternal,
    //                 'tglcsr' => $item->tglcsr,
    //             );
    //             // return($data10);
    //             // die();
    //         }
    //         foreach ($data10 as $key => $row) {
    //             $count[$key] = $row['noregistrasi'];
    //         }

    //         array_multisort($count, SORT_ASC, $data10);
    //     }


    //     $result = array(
    //         'data' => $data10,
    //         'message' => 'Cepot',
    //     );
    //     return $this->respond($result);
    // }
    public function getRekapCsr(Request $request) {
        $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $kelompokPasien = "";
        $jaminanKhusus = "";
        $isRajal = "";
        $isRM = "";
        $ruangan = "";
        $depart = "";
        $data10 = [];

        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $kelompokPasien = $request['kelompokPasien'];
            $kelompokPasien = "and pd.objectkelompokpasienlastfk='$kelompokPasien'";
        }
        if (isset($request['jaminanKhusus']) && $request['jaminanKhusus'] != "" && $request['jaminanKhusus'] != "undefined") {
            $jaminanKhusus = $request['jaminanKhusus'];
            $jaminanKhusus = "and pd.objectjaminankhusus='$jaminanKhusus'";
        }
        if (isset($request['isRJ']) && $request['isRJ'] != "" && $request['isRJ'] != "undefined") {
            $isRajal = "and pd.objectruanganlastfk in (3,4,6,7,8,9,12,13,14,17,19,25,26,27,20,31,33,37,70,89,97,98,130,132,198,230,241,243,245,247,248,249,250,253,255,268,319,322,446,448,456,459,461,462,535,543,552,564)";
        } else if (isset($request['isRM']) && $request['isRM'] != "" && $request['isRM'] != "undefined") {
            $isRM = "and pd.objectruanganlastfk in (3,4,6,7,8,9,12,13,14,17,19,20,25,26,27,31,33,70,89,97,130,132,247,248,250,253,268,319,322,446,447,448,453,456,543,552,564,575,576,784,788,790,792) 
            ";
        } else {

            if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
                $ruangan = "and pd.objectruanganlastfk ='$request[idRuangan]'";
            }

            if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
                $depart = "and ru.objectdepartemenfk ='$request[idDept]'";
            }
        }

        $data = DB::select(DB::raw("
        select x.namarekanan, x.jeniskelompokpasien, x.namaexternal, sum(x.pasien) as jumlahpasien, sum(x.tindakan + x.resep) as jumlahbiaya from (select distinct [ru].[namaruangan], [ru].[objectdepartemenfk], [jkm].[namaexternal], [jkp].[jeniskelompokpasien], [pd].[objectkelompokpasienlastfk], [klp].[kelompokpasien], [rk].[namarekanan], [pd].[objectjaminankhusus], [pd].[tglregistrasi], [pd].[noregistrasi], [ps].[nocm], [ps].[namapasien], sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end) as karcis,
        sum(case when pr.id =10013116 then pp.jumlah else 0 end) as jmlembos,
        sum(case when pr.id =10013116 then pp.hargajual* pp.jumlah else 0 end) as embos,
        sum(case when kp.id = 26 then pp.jumlah else 0 end) as jmlkonsul,
        sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end) as konsul,
        sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.jumlah else 0 end) as jmltindakan,
        sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end) as tindakan,
        sum(case when pp.aturanpakai is not null then pp.jumlah else 0 end) as jmlresep,
        sum(case when pp.aturanpakai is not null then pp.hargajual* pp.jumlah+ pp.jasa else 0 end) as resep,
        sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,
        sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when pr.id =10013116 then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end)
        +sum(case when pp.aturanpakai is not null then pp.hargajual* pp.jumlah+ pp.jasa else 0 end)
        -sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as total , case when pd.noregistrasi is not null then 1 else 0 end as pasien
        from [pelayananpasien_t] as [pp] left join 
        [strukpelayanan_t] as [sp] on [pp].[strukfk] = [sp].[norec] left join 
        [strukbuktipenerimaan_t] as [sbm] on [sp].[nosbmlastfk] = [sbm].[norec] left join 
        [strukpelayananpenjamin_t] as [sppj] on [sp].[norec] = [sppj].[nostrukfk] inner join
        [antrianpasiendiperiksa_t] as [apd] on [apd].[norec] = [pp].[noregistrasifk] inner join 
        [pasiendaftar_t] as [pd] on [pd].[norec] = [apd].[noregistrasifk] left join 
        [pegawai_m] as [pg] on [pg].[id] = [apd].[objectpegawaifk] inner join
        [ruangan_m] as [ru] on [ru].[id] = [pd].[objectruanganlastfk] inner join
        [produk_m] as [pr] on [pr].[id] = [pp].[produkfk] left join
        [jaminankhusus_m] as [jkm] on [jkm].[id] = [pd].[objectjaminankhusus] inner join 
        [detailjenisproduk_m] as [djp] on [djp].[id] = [pr].[objectdetailjenisprodukfk] inner join 
        [jenisproduk_m] as [jp] on [jp].[id] = [djp].[objectjenisprodukfk] inner join
        [kelompokproduk_m] as [kp] on [kp].[id] = [jp].[objectkelompokprodukfk] inner join 
        [pasien_m] as [ps] on [ps].[id] = [pd].[nocmfk] left join 
        [jeniskelompokpasien_m] as [jkp] on [jkp].[id] = [ps].[objectjeniskelompokpasienfk] inner join 
        [kelompokpasien_m] as [klp] on [klp].[id] = [pd].[objectkelompokpasienlastfk] inner join 
        [rekanan_m] as [rk] on [rk].[id] = [pd].[objectrekananfk]
        where pd.objectjaminankhusus is not null and pd.objectjaminankhusus != 0 and pd.statusenabled=1 and pd.tglcsr BETWEEN '$tglAwal' and '$tglAkhir' $kelompokPasien $ruangan $depart $isRajal $isRM $jaminanKhusus
        group by [jkm].[namaexternal], [jkp].[jeniskelompokpasien], [ru].[objectdepartemenfk], [pd].[objectjaminankhusus], [ru].[namaruangan], [pd].[objectkelompokpasienlastfk], 
        [klp].[kelompokpasien], [rk].[namarekanan], [pd].[tglregistrasi], [pd].[noregistrasi], [ps].[nocm], [ps].[namapasien]) as x group by x.namarekanan,x.namaexternal, x.jeniskelompokpasien
        "));

        foreach ($data as $item) 
            $data10[] = array (
                'namarekanan' => $item->namarekanan,
                'jaminankhusus' => $item->namaexternal,
                'jeniskelompokpasien' => $item->jeniskelompokpasien,
                'jumlahpasien' => (float)$item->jumlahpasien,
                'jumlahbiaya' => (float)$item->jumlahbiaya
            );
        

        return $this->respond($data10);
    }

    public function getDataLaporanPasienPulangNew(Request $request)
    {
        $dataLogin = $request->all();
        //        $data = \DB::table('v_pasienpulang as pp')
        $data =  DB::select(DB::raw("
                        SELECT        TOP (100) PERCENT pd.tglregistrasi, pd.tglpulang, CASE WHEN (pa.nosep IS NULL) THEN '-' ELSE pa.nosep END AS nosep, pp.strukfk, sp.tglstruk, ps.nocm + ' / ' + pd.noregistrasi AS nodaftar, ps.namapasien, 
                                        ru.objectdepartemenfk, sp.objectruanganfk, ru.namaruangan, kl.namakelas, pd.noregistrasi AS nobilling, sbm.nosbm AS nokwitansi, SUM(CASE WHEN (djp.objectjenisprodukfk = 97) 
                                        THEN (((pp.hargajual - CASE WHEN (pp.hargadiscount IS NULL) THEN (0) ELSE pp.hargadiscount END) * pp.jumlah) + CASE WHEN (pp.jasa IS NULL) THEN (0) ELSE pp.jasa END) ELSE (0) END) AS totalresep, 
                                        SUM(CASE WHEN (pp.produkfk <> 402611) THEN ((pp.jumlah * (pp.hargajual - CASE WHEN (pp.hargadiscount IS NULL) THEN (0) ELSE pp.hargadiscount END)) + CASE WHEN (pp.jasa IS NULL) THEN (0) ELSE pp.jasa END) 
                                        ELSE (0) END) AS jumlahbiaya, SUM(CASE WHEN (pp.hargadiscount IS NULL) THEN (0) ELSE pp.hargadiscount END * pp.jumlah) AS diskon, CASE WHEN (rk.namarekanan IS NULL) 
                                        THEN '-' ELSE rk.namarekanan END AS namarekanan, SUM(CASE WHEN (pp.produkfk = 402611) THEN ((pp.jumlah * (pp.hargajual - CASE WHEN (pp.hargadiscount IS NULL) THEN (0) ELSE pp.hargadiscount END)) 
                                        + CASE WHEN (pp.jasa IS NULL) THEN (0) ELSE pp.jasa END) ELSE (0) END) AS jumlahdeposit, sp.totalharusdibayar, CASE WHEN (sp.totalprekanan IS NULL) THEN (0) ELSE sp.totalprekanan END AS totalppenjamin, 
                                        CASE WHEN (sp.totalbiayatambahan IS NULL) THEN (0) ELSE sp.totalbiayatambahan END AS pendapatanlainlain, rk.id AS objectrekananfk, pd.objectkelompokpasienlastfk AS idkelompokpasien, klp.kelompokpasien, 
                                        sbm.keteranganlainnya, CASE WHEN ru.objectdepartemenfk IN (16, 35) THEN 'y' ELSE 'n' END AS inap, ru.id AS ruanganid,ps.tgllahir,'' as umur
                FROM            dbo.pasiendaftar_t AS pd LEFT OUTER JOIN
                                        dbo.antrianpasiendiperiksa_t AS apd ON apd.norec = pd.norec LEFT OUTER JOIN
                                        dbo.strukpelayanan_t AS sp ON sp.noregistrasifk = pd.norec LEFT OUTER JOIN
                                        dbo.pelayananpasien_t AS pp ON pp.strukfk = sp.norec LEFT OUTER JOIN
                                        dbo.strukbuktipenerimaan_t AS sbm ON sp.nosbmlastfk = sbm.norec LEFT OUTER JOIN
                                        dbo.pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec LEFT OUTER JOIN
                                        dbo.pegawai_m AS pg ON pg.id = apd.objectpegawaifk LEFT OUTER JOIN
                                        dbo.ruangan_m AS ru ON ru.id = pd.objectruanganlastfk LEFT OUTER JOIN
                                        dbo.produk_m AS pr ON pr.id = pp.produkfk INNER JOIN
                                        dbo.detailjenisproduk_m AS djp ON djp.id = pr.objectdetailjenisprodukfk LEFT OUTER JOIN
                                        dbo.pasien_m AS ps ON ps.id = pd.nocmfk LEFT OUTER JOIN
                                        dbo.kelompokpasien_m AS klp ON klp.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
                                        dbo.kelas_m AS kl ON kl.id = pd.objectkelasfk LEFT OUTER JOIN
                                        dbo.rekanan_m AS rk ON rk.id = pd.objectrekananfk
                GROUP BY pp.strukfk, pd.tglregistrasi, pa.nosep, pd.tglpulang, sp.tglstruk, ps.nocm, pd.noregistrasi, ps.namapasien, sp.objectruanganfk, ru.namaruangan, kl.namakelas, sp.nostruk, sbm.nosbm, rk.id, rk.namarekanan, sp.totalharusdibayar,
                                        sp.totalprekanan, sp.totalbiayatambahan, pd.objectkelompokpasienlastfk, klp.kelompokpasien, sbm.keteranganlainnya, ru.objectdepartemenfk, ru.id
                ORDER BY nosep
        "));


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pp.tglpulang', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            if ($request['idDept'] == '18') {
                $data = $data->wherein('pp.objectdepartemenfk', [18, 3, 24, 27, 28]);
            } else {
                $data = $data->where('pp.objectdepartemenfk', '=', $request['idDept']);
            }
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('pp.ruanganid', '=', $request['idRuangan']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $data = $data->where('pp.idkelompokpasien', '=', $request['kelompokPasien']);
        }
        if (isset($request['institusiAsalPasien']) && $request['institusiAsalPasien'] != "" && $request['institusiAsalPasien'] != "undefined") {
            $data = $data->where('pp.objectrekananfk', '=', $request['institusiAsalPasien']);
        }
        $data = $data->orderBy('pp.nosep');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'Cepot',
        );
        return $this->respond($result);
    }
    public function getKinerjaPelayananRanap(Request $request)
    {

        $bulan = $request['bulan'];
        $dateStart = Carbon::now();
        $dayInMonth = array();
        $type = CAL_GREGORIAN;
        $month = Carbon::parse($bulan)->format('m'); // Month ID, 1 through to 12.

        $year = Carbon::parse($bulan)->format('Y'); //date('Y'); // Year in 4 digit 2009 format.
        $day_count = cal_days_in_month($type, $month, $year); // Get the amount of days\

        for ($i = 1; $i <= $day_count; $i++) {
            $date = $year . '/' . $month . '/' . $i; //format date
            $get_name = date('l', strtotime($date)); //get week day
            $day_name = substr($get_name, 0, 3); // Trim day name to 3 chars

            //if not a weekend add day to array
            //            if($day_name != 'Sun' && $day_name != 'Sat'){
            $strLength = strlen($i);
            if ($strLength  == 1) {
                $i = '0' . $i;
            }
            //            return $this->respond($countDay);
            $dayInMonth[] = Carbon::parse($bulan)->format('Y') . '-' . $month . '-' . $i; // date ('Y-'.$month.'-'.$i);
            //            }
        }

        $kamar =  DB::select(DB::raw("select count(x.idkelas) as tt,x.namakelas ,x.idkelas,
            0 as ld,0 as hp,0 as jmlpasienkeluar,0 as bor,0 as los ,0 as toi, 0 as bto, 0 as ndr,0 as gdr
          from (
            SELECT
                ru.id AS idruangan,  ru.namaruangan,
                km.id AS idkamar,
                km.namakamar,
                kl.id AS idkelas,
                kl.namakelas
            FROM
                tempattidur_m AS tt
            LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
            LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
            LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk
            WHERE 	ru.objectdepartemenfk IN (16, 35)
            AND ru.statusenabled = 1
            AND km.statusenabled = 1
            AND tt.statusenabled = 1
            ) as x
            group by x.namakelas,x.idkelas"));

        $firstDay = $bulan . '-01';
        $lastDay = $bulan . '-' . $day_count;
        //        return $this->respond($firstDay);
        $pasien = DB::select(DB::raw(" SELECT
                pd.noregistrasi,
                pd.tglregistrasi,
                pd.tglpulang,
                 pd.objectkelasfk,
                    DATEDIFF(DAY, pd.tglregistrasi, pd.tglpulang) as hari 
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                    ru.objectdepartemenfk = 16
               -- AND pd.tglpulang BETWEEN '$firstDay' and '$lastDay'
                order by pd.tglpulang asc
                "));
        $LD = DB::select(DB::raw(" SELECT
                pd.noregistrasi,
                pd.tglregistrasi,
                pd.tglpulang,
                 pd.objectkelasfk,
                    DATEDIFF(DAY, pd.tglregistrasi, pd.tglpulang) as hari 
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                WHERE
                    ru.objectdepartemenfk = 16
              AND pd.tglregistrasi BETWEEN '$firstDay' and '$lastDay'
                order by pd.tglpulang asc
                "));

        $dataMeninggal = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal, x.bulanregis,  
                count(case when x.objectkondisipasienfk = '6' then 1 end ) AS jumlahlebih48 FROM
                (
                select noregistrasi,Format(tglregistrasi , 'mm')  as bulanregis ,statuskeluar,kondisipasien,objectkondisipasienfk
                from pasiendaftar_t 
                join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                where objectstatuskeluarfk =5
                and  tglregistrasi BETWEEN '$firstDay' and '$lastDay'
                ) as x
                GROUP BY x.bulanregis;"));
        //        $dayInMonth = [ '2019-12-30'];
        $jmlHP = 0;
        $i = 0;
        $data = [];
        foreach ($dayInMonth as $day) {
            foreach ($pasien as $item) {
                foreach ($kamar as $kamarss) {
                    if ($item->tglpulang != null) {
                        if (
                            Carbon::parse($item->tglregistrasi)->format('Y-m-d') <= date($dayInMonth[$i])
                            && date($dayInMonth[$i]) <= Carbon::parse($item->tglpulang)->format('Y-m-d')
                            && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                        ) {
                            $kamarss->hp = (int)  $kamarss->hp + 1;
                        }
                    } else {
                        if (
                            Carbon::parse($item->tglregistrasi)->format('Y-m-d') <= date($dayInMonth[$i])
                            && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                        ) {
                            $kamarss->hp = (int)  $kamarss->hp + 1;
                        }
                    }
                }
            }
            $i = $i + 1;
        }
        foreach ($kamar as $kamarss) {
            foreach ($LD as $item) {
                if ((int) $item->objectkelasfk == (int) $kamarss->idkelas) {
                    $kamarss->ld = (int)$kamarss->ld  + (int)$item->hari;
                    $kamarss->jmlpasienkeluar = (int) $kamarss->jmlpasienkeluar  + 1;
                }
            }
        }
        foreach ($kamar as $item) {
            /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
            $item->bor = ((int)$item->hp / ((float)$item->tt * (float)$day_count)) * 100; //$numday['jumlahhari']));

            /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
            if ((int)$item->jmlpasienkeluar > 0) {
                $item->los = (int)$item->ld / (int)$item->jmlpasienkeluar;
            }

            /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
            if ((int)$item->jmlpasienkeluar > 0) {
                $item->toi =  (((float)$item->tt  *  (float)$day_count) - (int)$item->hp)  / (int)$item->jmlpasienkeluar;
            }

            /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
            $item->bto = (int)$item->jmlpasienkeluar / (float)$item->tt;

            if (count($dataMeninggal) > 0) {
                foreach ($dataMeninggal as $itemDead) {
                    /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $item->gdr = (int)$itemDead->jumlahmeninggal * 1000 / (int)$item->jmlpasienkeluar;

                    /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $item->ndr = (int)$itemDead->jumlahlebih48 * 1000 / (int)$item->jmlpasienkeluar;
                }
            }
        }
        foreach ($kamar as $key => $row) {
            $count[$key] = $row->namakelas;
        }
        array_multisort($count, SORT_ASC, $kamar);
        $result = array(
            'data' => $kamar,
            'by' => 'er@epic'
        );

        return $this->respond($result);
    }
    public function getKinerjaPelayananRanapTahunan(Request $request)
    {

        $tahun = $request['tahun'];
        $year = [];
        for ($m = 1; $m <= 12; ++$m) {
            $year[] = $m; //date('F', mktime(0, 0, 0, $m, 1));
        }
        //        $stat = false;
        //        if('Desember' <= 'February'&& 'February' <='January' ){
        //            $stat =true;
        //        }
        //        return $this->respond($year);
        //        return $this->respond($stat);
        $kamar =  DB::select(DB::raw("select count(x.idkelas) as tt,x.namakelas ,x.idkelas,
          0 as januari_hp, 0 as januari_bor,
          0 as februari_hp, 0 as februari_bor,
          0 as maret_hp, 0 as maret_bor,
          0 as april_hp, 0 as april_bor,
          0 as mei_hp, 0 as mei_bor,
          0 as juni_hp, 0 as juni_bor,
          0 as juli_hp, 0 as juli_bor,
          0 as agustus_hp, 0 as agustus_bor,
          0 as september_hp, 0 as september_bor,
          0 as oktober_hp, 0 as oktober_bor,
          0 as november_hp, 0 as november_bor,
          0 as desember_hp, 0 as desember_bor
          from (
            SELECT
                ru.id AS idruangan,  ru.namaruangan,
                km.id AS idkamar,
                km.namakamar,
                kl.id AS idkelas,
                kl.namakelas
            FROM
                tempattidur_m AS tt
            LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
            LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
            LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk
            WHERE 	ru.objectdepartemenfk IN (16, 35)
            AND ru.statusenabled = 1
            AND km.statusenabled = 1
            AND tt.statusenabled = 1
            ) as x
            group by x.namakelas,x.idkelas"));


        $pasien = DB::select(DB::raw("
		    SELECT
                    pd.objectkelasfk,
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    pd.tglpulang,
           Format ( pd.tglpulang,'MM') AS bulan,
                    DATEDIFF(
                        DAY,
                        pd.tglregistrasi,
                        pd.tglpulang
                    ) AS hari,
                    kls.namakelas
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                WHERE
                    ru.objectdepartemenfk = 16
--              AND format(pd.tglpulang,'yyyy') ='$tahun'
	
                "));
        $data = [];
        foreach ($pasien as $item) {
            foreach ($kamar as $kamarss) {
                $tglRegis = (int)  Carbon::parse($item->tglregistrasi)->format('m');
                $tglPulang = (int)  Carbon::parse($item->tglpulang)->format('m');

                if (
                    $tglRegis <=   $year[0]
                    && $year[0] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->januari_hp = (int)  $kamarss->januari_hp + 1;
                }

                if (
                    $tglRegis <=   $year[1]
                    && $year[1] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->februari_hp = (int)  $kamarss->februari_hp + 1;
                }
                if (
                    $tglRegis <=   $year[2]
                    && $year[2] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->maret_hp = (int)  $kamarss->maret_hp + 1;
                }
                if (
                    $tglRegis <=   $year[3]
                    && $year[3] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->april_hp = (int)  $kamarss->april_hp + 1;
                }
                if (
                    $tglRegis <=   $year[4]
                    && $year[4] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->mei_hp = (int)  $kamarss->mei_hp + 1;
                }
                if (
                    $tglRegis <=   $year[5]
                    && $year[5] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->juni_hp = (int)  $kamarss->juni_hp + 1;
                }
                if (
                    $tglRegis <=   $year[6]
                    && $year[6] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->juli_hp = (int)  $kamarss->juli_hp + 1;
                }
                if (
                    $tglRegis <=   $year[7]
                    && $year[7] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->agustus_hp = (int)  $kamarss->agustus_hp + 1;
                }
                if (
                    $tglRegis <=   $year[8]
                    && $year[8] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->september_hp = (int)  $kamarss->september_hp + 1;
                }
                if (
                    $tglRegis <=   $year[9]
                    && $year[9] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->oktober_hp = (int)  $kamarss->oktober_hp + 1;
                }
                if (
                    $tglRegis <=   $year[10]
                    && $year[10] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->november_hp = (int)  $kamarss->november_hp + 1;
                    //                    return $this->respond( $kamarss->november_hp );

                }
                if (
                    $tglRegis <=   $year[11]
                    && $year[11] <= $tglPulang
                    && (int)  $kamarss->idkelas == (int) $item->objectkelasfk
                ) {
                    $kamarss->desember_hp = (int)  $kamarss->desember_hp + 1;
                }
            }
        }


        //        return $this->respond($kamarss);
        $lamaRawat = 0;
        //        foreach ($kamar as $kamarss) {
        //            foreach ($pasien as $item) {
        //                if( (int) $item->objectkelasfk == (int) $kamarss->idkelas){
        //                    $kamarss->ld = (int)$kamarss->ld  + (int)$item->hari;
        //                    $kamarss->jmlpasienkeluar = (int) $kamarss->jmlpasienkeluar  +1;
        //                }
        //            }
        //        }
        foreach ($kamar as $item) {
            /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
            //            $item->bor = ((int)$item->hp / ((float)$item->tt * 12)) * 100;//$numday['jumlahhari']));

            /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
            //            if ((int)$item->jmlpasienkeluar > 0){
            //                $item->los = (int)$item->ld / (int)$item->jmlpasienkeluar;
            //            }
            //
            //            /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
            //            if ( (int)$item->jmlpasienkeluar > 0){
            //                $item->toi =  (( (float)$item->tt  *  (float)$day_count) - (int)$item->hp)  /(int)$item->jmlpasienkeluar ;
            //            }
            //
            //            /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
            //            $item->bto = (int)$item->jmlpasienkeluar / (float)$item->tt;
            //
            //            if(count($dataMeninggal)> 0 ) {
            //                foreach ($dataMeninggal as $itemDead) {
            //                    /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
            //                    $item->gdr = (int)$itemDead->jumlahmeninggal * 1000 / (int)$item->jmlpasienkeluar;
            //
            //                    /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
            //                    $item->ndr = (int)$itemDead->jumlahlebih48 * 1000 / (int)$item->jmlpasienkeluar;
            //                }
            //            }
        }
        foreach ($kamar as $key => $row) {
            $count[$key] = $row->namakelas;
        }
        array_multisort($count, SORT_ASC, $kamar);
        $result = array(
            'data' => $kamar,
            'by' => 'er@epic'
        );

        return $this->respond($result);
    }

    public function getDataLaporanPasienDaftar2(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $paramsTgl = 'apd.tglregistrasi';

        if (isset($request['isTglPulang']) && $request['isTglPulang'] != "" && $request['isTglPulang'] != "undefined") {
            if ($request['isTglPulang'] == true) {
                $paramsTgl = 'pd.tglpulang';
            }
        }

        $idDept =  ' ';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            if ($request['idDept'] == 24) {
                $idDept =  ' and convert(varchar, pd.tglregistrasi,105) = convert(varchar, apd.tglmasuk,105) and ru.objectdepartemenfk =  ' . $request['idDept'];
            } else {
                $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
            }
        }
        $idRuangan =  ' ';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idNamaRekanan = ' ';
        if (isset($request['idNamaRekanan']) && $request['idNamaRekanan'] != "" && $request['idNamaRekanan'] != "undefined") {
            $idNamaRekanan = ' and rk.id = ' . $request['idNamaRekanan'];
        }
        $idKelompokPasien = ' ';
        if (isset($request['idKelompokPasien']) && $request['idKelompokPasien'] != "" && $request['idKelompokPasien'] != "undefined") {
            $idKelompokPasien = ' and kp.id = ' . $request['idKelompokPasien'];
        }

        $idJenisKelompokPasien = ' ';
        if (isset($request['idJenisKelompokPasien']) && $request['idJenisKelompokPasien'] != "" && $request['idJenisKelompokPasien'] != "undefined") {
            $idJenisKelompokPasien = ' and jkp.id = ' . $request['idJenisKelompokPasien'];
        }

        $idJenisPelayanan = ' ';
        if (isset($request['idJenisPelayanan']) && $request['idJenisPelayanan'] != "" && $request['idJenisPelayanan'] != "undefined") {
            if ($request['idJenisPelayanan'] == 18) {
                $idJenisPelayanan = 'and ru2.objectdepartemenfk NOT IN (16, 24)';
            } else {
                $idJenisPelayanan = ' and ru2.objectdepartemenfk =  ' . $request['idJenisPelayanan'];
            }
        }

        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT 
                apd.norec as norec_apd,
                CAST (pd.tglregistrasi AS VARCHAR) AS tglregistrasi,
                CAST (apd.tglmasuk AS VARCHAR) AS tglmasuk,
                CAST (apd.tglkeluar AS VARCHAR) AS tglkeluar,
                CAST (apd.tglkeluar AS time) AS jamkeluar,
                CAST (apd.tglmasuk AS time)AS jamperiksa,
                CAST (pd.tglpulang AS VARCHAR)AS tglpulang,
                pd.noregistrasi,
                ps.nocm,
                ps.namapasien,
                ru.namaruangan,
                ru2.namaruangan AS ruanganlast,
                dpt.namadepartemen,
                CASE 
                    WHEN dpt2.id = 16 THEN 'Rawat Inap' 
                  WHEN dpt2.id = 24 THEN 'Gawat Darurat'
                    ELSE 'Rawat Jalan' 
                END AS jenispelayanan,
                pg.namalengkap AS dokter,
                kp.kelompokpasien AS tipepasien,
                rk.namarekanan AS tiperekananpasien,
                jkp.jeniskelompokpasien,
                pd.statuspasien as jenispasien,
                ps.nohp,
                CAST (ps.tgllahir AS VARCHAR)AS tgllahir,
                jk.jeniskelamin,
                ag.agama,
                pend.pendidikan,
                pkr.pekerjaan,
                sp.statusperkawinan,
                kl.namakelas,
                CASE
                        WHEN pc.ALAMAT IS NULL THEN
                        ps.alamatrmh ELSE REPLACE ( pc.ALAMAT, '\n',' ' ) 
                        END AS alamat,
                CASE
                        WHEN kel.KELURAHANI IS NULL THEN
                        dsk.namadesakelurahan ELSE LTRIM( RTRIM( kel.KELURAHANI ) ) 
                        END AS kelurahan,
                CASE
                        WHEN kec.KECAMATANI IS NULL THEN
                        kcm.namakecamatan ELSE LTRIM( RTRIM( kec.KECAMATANI ) ) 
                        END AS kecamatan,
                        
                CASE
                        WHEN kab.KABUPATENI IS NULL THEN
                        kb.namakotakabupaten ELSE LTRIM( RTRIM( kab.KABUPATENI ) ) 
                        END AS kabupaten,
                CASE	
                    WHEN ps.penanggungjawab IS NULL THEN '' ELSE ps.penanggungjawab END AS penanggungjawab,
                ddp.objectjenisdiagnosafk AS idjenisdiagnosa,
                ps.noidentitas,

                CASE
                    WHEN ru.namaruangan = ru2.namaruangan AND ddp.objectjenisdiagnosafk = 1 THEN  CONCAT(dg.kddiagnosa, '-',  dg.namadiagnosa)
                    WHEN ru.objectdepartemenfk = 24 AND ddp.objectjenisdiagnosafk = 5 THEN CONCAT(dg.kddiagnosa, '-',  dg.namadiagnosa)
                    WHEN ru.objectdepartemenfk NOT IN ( 16, 24 ) AND ddp.objectjenisdiagnosafk IN ( 1, 2 ) THEN CONCAT(dg.kddiagnosa, '-',  dg.namadiagnosa) ELSE'-' 
                    END AS kodepenyakit,
                    
                CASE WHEN dpt.id = 16 THEN '-' ELSE 
                    (SELECT string_agg(pr2.namaproduk, ', ')
                    FROM antrianpasiendiperiksa_t AS apd2
                    LEFT JOIN pelayananpasien_t AS pp2 ON pp2.noregistrasifk = apd2.norec
                    LEFT JOIN produk_m AS pr2 ON pr2.id = pp2.produkfk
                    WHERE apd2.norec = apd.norec
                    AND pp2.aturanpakai IS NULL) 
                    END AS tindakan,
                ps.tgllahir,
                ar.asalrujukan 
        FROM antrianpasiendiperiksa_t AS apd
                LEFT JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                LEFT JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                LEFT JOIN departemen_m AS dpt ON dpt.id = ru.objectdepartemenfk
                LEFT JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                LEFT JOIN departemen_m AS dpt2 ON dpt2.id = ru2.objectdepartemenfk 
                
                LEFT JOIN pegawai_m AS pg ON pg.id = apd.objectpegawaifk
                LEFT JOIN asuransipasien_m as ap on ap.nocmfk = ps.id
                LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                LEFT JOIN rekanan_m as rk on rk.id = pd.objectrekananfk
                LEFT JOIN jeniskelompokpasien_m as jkp on jkp.id = ps.objectjeniskelompokpasienfk
                LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk
                LEFT JOIN pendidikan_m as pend on pend.id = ps.objectpendidikanfk   
                LEFT JOIN pekerjaan_m as pkr on pkr.id = ps.objectpekerjaanfk
                LEFT JOIN statusperkawinan_m as sp on sp.id = ps.objectstatusperkawinanfk
                LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id
                LEFT JOIN desakelurahan_m as dsk on dsk.id = alm.objectdesakelurahanfk
                LEFT JOIN kecamatan_m as kcm on kcm.id = alm.objectkecamatanfk
                LEFT JOIN kotakabupaten_m as kb on kb.id = alm.objectkotakabupatenfk
                LEFT JOIN PASIEN_copy as pc on pc.nocmfk = ps.id
                LEFT JOIN KELURAHANI as kel on kel.KD_KELURAHANI = pc.KD_KELURAHAN
                LEFT JOIN KECAMATANI as kec on kec.KD_KECAMATANI = kel.KD_KECAMATAN
                LEFT JOIN KABUPATENI as kab on kab.KD_KABUPATENI = kec.KD_KABUPATEN
                LEFT JOIN diagnosapasien_t as dp on dp.noregistrasifk = apd.norec
                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                LEFT JOIN diagnosa_m as dg on dg.id = ddp.objectdiagnosafk
                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
		        LEFT JOIN pelayananpasien_t as pp on pp.noregistrasifk = apd.norec
                LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk
                LEFT JOIN kelas_m AS kl ON kl.id = pd.objectkelasfk
                LEFT JOIN asalrujukan_m AS ar ON ar.id = apd.objectasalrujukanfk
                WHERE $paramsTgl BETWEEN '$tglAwal' AND '$tglAkhir'
                AND br.pasiendaftarfk IS NULL 
                AND pd.statusenabled = true
                AND apd.statusenabled = true
                -- AND (ddp.objectjenisdiagnosafk IS NULL OR ddp.objectjenisdiagnosafk IN (1,5))
                $idDept
                $idRuangan
                $idJenisPelayanan
                $idNamaRekanan
                $idKelompokPasien
                $idJenisKelompokPasien
                GROUP BY 
                    pd.tglregistrasi,
                    apd.tglregistrasi,
                    apd.tglmasuk,
                    apd.tglkeluar,
                    pd.tglpulang,
                    pd.noregistrasi,
                    ps.nocm,
                    ps.namapasien,
                    ru.namaruangan,
                    ru2.namaruangan,
                    dpt.namadepartemen,
                    dpt2.id,
                    pg.namalengkap,
                    kp.kelompokpasien,
                    rk.namarekanan,
                    jkp.jeniskelompokpasien,
                    pd.statuspasien,
                    ps.nohp,
                    ps.tgllahir,
                    jk.jeniskelamin,
                    ag.agama,
                    pend.pendidikan,
                    pkr.pekerjaan,
                    sp.statusperkawinan,
                    pc.ALAMAT,
                    kel.KELURAHANI,
                    kec.KECAMATANI,
                    kab.KABUPATENI,
                    ps.alamatrmh,
                    dsk.namadesakelurahan,
                    kcm.namakecamatan,
                    kb.namakotakabupaten,
                    ddp.noregistrasifk,
                    dg.kddiagnosa,
                    dg.namadiagnosa,
                    ps.tgllahir,
                    ddp.objectjenisdiagnosafk,
                    ru.objectdepartemenfk,
                    apd.norec,
                    dpt.id,
                    pr.namaproduk,
                    ps.penanggungjawab,
                    kl.namakelas,
                    ps.noidentitas,
                    ar.asalrujukan
        ORDER BY apd.tglregistrasi ASC"));

        return $this->respond($data);
    }



    public function getDataLaporanPasienDaftarBkesatuan(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $data = DB::select(DB::raw("
        SELECT        SUM(jml) AS Jumlah, kesatuanpasien,0 as no,0 as persen
        FROM            v_laporanPerKesatuan
        where        (tglregistrasi  BETWEEN '$tglAwal' AND '$tglAkhir')
        GROUP BY kesatuanpasien
                "));

        return $this->respond($data);
    }

    public function getDataBridgingDinkes(Request $request)
    {

        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $tahun = date('Y', strtotime($tglAwal));
        $bulan = date('m', strtotime($tglAwal));
        //tgl mutasi
        $pasien_awal_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND (pd.tglpulang IS NULL OR pd.tglpulang >= '$tglAwal')
                            AND pd.tglregistrasi < '$tglAwal'
                            "));

        $pasien_awal_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND (pd.tglpulang IS NULL OR pd.tglpulang >= '$tglAwal')
                            AND pd.tglregistrasi < '$tglAwal'"));

        $pasien_masuk_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pasien_masuk_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2  
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pasien_keluar_hidup_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.objectkondisipasienfk IN (1, 2, 3, 4)
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pasien_keluar_hidup_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.objectkondisipasienfk IN (1, 2, 3, 4)
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $keluar_mati_kurang48_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.objectkondisipasienfk = 5
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $keluar_mati_kurang48_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.objectkondisipasienfk = 5
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $keluar_mati_lebih48_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.objectkondisipasienfk = 6
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $keluar_mati_lebih48_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.objectkondisipasienfk = 6
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));
        //tgl mutasi
        $lama_dirawat_0 = DB::select(DB::raw("SELECT SUM(x.lamadirawat) AS jumlah FROM (
                            SELECT DATEDIFF(day, pd.tglregistrasi, pd.tglpulang) AS lamadirawat
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir') AS x"));

        $lama_dirawat_1 = DB::select(DB::raw("SELECT SUM(x.lamadirawat) AS jumlah FROM (
                            SELECT DATEDIFF(day, pd.tglregistrasi, pd.tglpulang) AS lamadirawat
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir') AS x"));

        $pasien_akhir_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND (pd.tglpulang IS NULL OR pd.tglpulang >= '$tglAkhir')  
                            AND pd.tglregistrasi < '$tglAkhir'"));

        $pasien_akhir_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND (pd.tglpulang IS NULL OR pd.tglpulang >= '$tglAkhir')  
                            AND pd.tglregistrasi < '$tglAkhir'"));

        $period = new \DatePeriod(
            new \DateTime($tglAwal),
            new \DateInterval('P1D'),
            new \DateTime($tglAkhir)
        );
        $totalhp_0 = 0;
        foreach ($period as $key => $value) {
            $ar = $value->format('Y-m-d');
            $hari_perawatan_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND (pd.tglpulang IS NULL OR pd.tglpulang >= '$ar')
                            AND pd.tglregistrasi < '$ar'"));

            $totalhp_0 = $totalhp_0 + (float)$hari_perawatan_0[0]->jumlah;
        }

        $totalhp_1 = 0;
        foreach ($period as $key => $value) {
            $ar = $value->format('Y-m-d');
            $hari_perawatan_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 16
                            AND (pd.tglpulang IS NULL OR pd.tglpulang >= '$ar')
                            AND pd.tglregistrasi < '$ar'"));

            $totalhp_1 = $totalhp_1 + (float)$hari_perawatan_1[0]->jumlah;
        }
        //jenis pelayanan rawat jalan dan igd
        $pengunjung_baru_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND LEN(ps.nocm) = 8
                            AND pd.statuspasien = 'BARU'
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pengunjung_baru_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND LEN(ps.nocm) = 8
                            AND pd.statuspasien = 'BARU'
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pengunjung_lama_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND (LEN(ps.nocm) = 6
                            OR (LEN(ps.nocm) = 8 AND pd.statuspasien = 'LAMA'))
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pengunjung_lama_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND (LEN(ps.nocm) = 6
                            OR (LEN(ps.nocm) = 8 AND pd.statuspasien = 'LAMA'))
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $kunj_baru_0 = DB::select(DB::raw("SELECT COUNT(apd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND LEN(ps.nocm) = 8
                            AND pd.statuspasien = 'BARU'
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $kunj_baru_1 = DB::select(DB::raw("SELECT COUNT(apd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND LEN(ps.nocm) = 8
                            AND pd.statuspasien = 'BARU'
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $kunj_lama_0 = DB::select(DB::raw("SELECT COUNT(apd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 1
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND (LEN(ps.nocm) = 6
                            OR (LEN(ps.nocm) = 8 AND pd.statuspasien = 'LAMA'))
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $kunj_lama_1 = DB::select(DB::raw("SELECT COUNT(apd.norec) AS jumlah
                            FROM pasiendaftar_t AS pd
                            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                            WHERE ps.objectjeniskelaminfk = 2
                            AND pd.statusenabled = true
                            AND ru.objectdepartemenfk = 18
                            AND (LEN(ps.nocm) = 6
                            OR (LEN(ps.nocm) = 8 AND pd.statuspasien = 'LAMA'))
                            AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pasien_ranap_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                        WHERE ps.objectjeniskelaminfk = 1
                        AND pd.statusenabled = true
                        AND ru.objectdepartemenfk = 16
                        AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pasien_ranap_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                        WHERE ps.objectjeniskelaminfk = 2
                        AND pd.statusenabled = true
                        AND ru.objectdepartemenfk = 16
                        AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        //pelayanan rajal
        $pasien_rajal_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                        WHERE ps.objectjeniskelaminfk = 1
                        AND pd.statusenabled = true
                        AND ru.objectdepartemenfk = 18
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pasien_rajal_1 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                        WHERE ps.objectjeniskelaminfk = 2
                        AND pd.statusenabled = true
                        AND ru.objectdepartemenfk = 18
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $dari_pkm_0 = DB::select(DB::raw("SELECT COUNT(apd.noregistrasifk) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        WHERE ps.objectjeniskelaminfk = 1
                        AND pd.statusenabled = true
                        AND apd.objectasalrujukanfk = 1
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $dari_pkm_1 = DB::select(DB::raw("SELECT COUNT(apd.noregistrasifk) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        WHERE ps.objectjeniskelaminfk = 2
                        AND pd.statusenabled = true
                        AND apd.objectasalrujukanfk = 1
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $dari_faskes_0 = DB::select(DB::raw("SELECT COUNT(apd.noregistrasifk) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        WHERE ps.objectjeniskelaminfk = 1
                        AND pd.statusenabled = true
                        AND apd.objectasalrujukanfk = 3
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $dari_faskes_1 = DB::select(DB::raw("SELECT COUNT(apd.noregistrasifk) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        WHERE ps.objectjeniskelaminfk = 2
                        AND pd.statusenabled = true
                        AND apd.objectasalrujukanfk = 3
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $dari_rs_0 = DB::select(DB::raw("SELECT COUNT(apd.noregistrasifk) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        WHERE ps.objectjeniskelaminfk = 1
                        AND pd.statusenabled = true
                        AND apd.objectasalrujukanfk = 2
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $dari_rs_1 = DB::select(DB::raw("SELECT COUNT(apd.noregistrasifk) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        WHERE ps.objectjeniskelaminfk = 2
                        AND pd.statusenabled = true
                        AND apd.objectasalrujukanfk = 2
                        AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'"));
        //tumnbang
        $pel_kes_jiwa_0 = DB::select(DB::raw("SELECT COUNT(pd.norec) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                        WHERE ps.objectjeniskelaminfk = 1
                        AND pd.statusenabled = true
                        AND ru.id IN (573,566)
                        AND ru.objectdepartemenfk = 18
                        AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $pel_kes_jiwa_1 = DB::select(DB::raw("SELECT COUNT(apd.norec) AS jumlah
                        FROM pasiendaftar_t AS pd
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                        WHERE ps.objectjeniskelaminfk = 2
                        AND pd.statusenabled = true
                        AND ru.id IN (573,566)
                        AND ru.objectdepartemenfk = 18
                        AND pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'"));

        $result = [
            'kd_hospital' => '3372052',
            'tahun' => $tahun,
            'bulan' => $bulan,
            'pasien_awal_0' => $pasien_awal_0,
            'pasien_awal_1' => $pasien_awal_1,
            'pasien_masuk_0' => $pasien_masuk_0,
            'pasien_masuk_1' => $pasien_masuk_1,
            'pasien_keluar_hidup_0' => $pasien_keluar_hidup_0,
            'pasien_keluar_hidup_1' => $pasien_keluar_hidup_1,
            'keluar_mati_kurang48_0' => $keluar_mati_kurang48_0,
            'keluar_mati_kurang48_1' => $keluar_mati_kurang48_1,
            'keluar_mati_lebih48_0' => $keluar_mati_lebih48_0,
            'keluar_mati_lebih48_1' => $keluar_mati_lebih48_1,
            'lama_dirawat_0' => $lama_dirawat_0,
            'lama_dirawat_1' => $lama_dirawat_1,
            'pasien_akhir_0' => $pasien_akhir_0,
            'pasien_akhir_1' => $pasien_akhir_1,
            'hari_perawatan_0' => $totalhp_0,
            'hari_perawatan_1' => $totalhp_1,
            'pengunjung_baru_0' => $pengunjung_baru_0,
            'pengunjung_baru_1' => $pengunjung_baru_1,
            'pengunjung_lama_0' => $pengunjung_lama_0,
            'pengunjung_lama_1' => $pengunjung_lama_1,
            'kunj_baru_0' => $kunj_baru_0,
            'kunj_baru_1' => $kunj_baru_1,
            'kunj_lama_0' => $kunj_lama_0,
            'kunj_lama_1' => $kunj_lama_1,
            'pasien_ranap_0' => $pasien_ranap_0,
            'pasien_ranap_1' => $pasien_ranap_1,
            'pasien_rajal_0' => $pasien_rajal_0,
            'pasien_rajal_1' => $pasien_rajal_1,
            'dari_pkm_0' => $dari_pkm_0,
            'dari_pkm_1' => $dari_pkm_1,
            'dari_faskes_0' => $dari_faskes_0,
            'dari_faskes_1' => $dari_faskes_1,
            'dari_rs_0' => $dari_rs_0,
            'dari_rs_1' => $dari_rs_1,
            'pel_kes_jiwa_0' => $pel_kes_jiwa_0,
            'pel_kes_jiwa_1' => $pel_kes_jiwa_1,
            'by' => 'dy'
        ];

        return $this->respond($result);
    }

    public function sendDataBridgingDinkes(Request $request)
    {
        $data = $request;
        $url = "https://api-sik.dinkes.surakarta.go.id/rs/kegiatan/add";
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        $password = base64_encode('rsjdska:rsjdska');
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,

            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "Authorization: Basic " . $password
            ),
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
            $transMessage = "Pengiriman Data ke Dinkes Gagal!";
        } else {
            $result = (array) json_decode($response);
            $transMessage = "Pengiriman Data ke Dinkes Berhasil!";
        }

        return $this->setStatusCode($result['code'])->respond($result, $transMessage);
    }

    public function getDataDiagnosaBridging(Request $request)
    {
        // $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $tahun = date('Y', strtotime($tglAwal));
        $bulan = date('m', strtotime($tglAwal));
        $deptId = '';
        $jenispelayanan = '';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            if ($request['idDept'] == 16) {
                // $deptId = ' and ru.objectdepartemenfk = 16';
                $jenispelayanan = 'ranap';
                $data = DB::select(DB::raw("select * from (
                    select x.kddiagnosa,x.namadiagnosa,count(x.kddiagnosa)as jumlah,
                    CASE WHEN x.objectdepartemenfk = 16 THEN 'ranap' ELSE 'rajal' END AS jenis
                    from (select pd.noregistrasi, dm.kddiagnosa,
                    dm.namadiagnosa, ru.objectdepartemenfk,ru.namaruangan,jd.jenisdiagnosa
                    from antrianpasiendiperiksa_t as app
                    left join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                    left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                    left join jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
                    inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                    inner join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
                    inner join pasien_m as ps on ps.id = pd.nocmfk
                    left join alamat_m as alm on alm.nocmfk = ps.id
                    left join kecamatan_m as kec on kec.id = alm.objectkecamatanfk
                    left join kotakabupaten_m as kot on kot.id = alm.objectkotakabupatenfk
                    left join propinsi_m as pro on pro.id = alm.objectpropinsifk
                    left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    where --dm.kddiagnosa <> '-' and
                    jd.id = 1 and
                    pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'
                    and ru.objectdepartemenfk = 16
                    GROUP BY pd.noregistrasi,dm.kddiagnosa,
                    dm.namadiagnosa, ru.objectdepartemenfk,ru.namaruangan,jd.jenisdiagnosa
                    )as x GROUP BY x.namadiagnosa ,x.kddiagnosa, x.objectdepartemenfk
                    ) as z
                    ORDER BY z.jumlah desc
    
                "));
            } else {
                // $deptId = ' and ru.objectdepartemenfk != 16';
                $jenispelayanan = 'rajal';
                $data = DB::select(DB::raw("select * from (
                    select x.kddiagnosa,x.namadiagnosa,count(x.kddiagnosa)as jumlah,
                    CASE WHEN x.objectdepartemenfk = 16 THEN 'ranap' ELSE 'rajal' END AS jenis
                    from (select pd.noregistrasi, dm.kddiagnosa,
                    dm.namadiagnosa, ru.objectdepartemenfk,ru.namaruangan,jd.jenisdiagnosa
                    from antrianpasiendiperiksa_t as app
                    left join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                    left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                    left join jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
                    inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                    inner join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
                    inner join pasien_m as ps on ps.id = pd.nocmfk
                    left join alamat_m as alm on alm.nocmfk = ps.id
                    left join kecamatan_m as kec on kec.id = alm.objectkecamatanfk
                    left join kotakabupaten_m as kot on kot.id = alm.objectkotakabupatenfk
                    left join propinsi_m as pro on pro.id = alm.objectpropinsifk
                    left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    where --dm.kddiagnosa <> '-' and
                    jd.id = 1 and
                    pd.tglpulang BETWEEN '$tglAwal' AND '$tglAkhir'
                    and ru.objectdepartemenfk NOT IN (16,24)
                    GROUP BY pd.noregistrasi,dm.kddiagnosa,
                    dm.namadiagnosa, ru.objectdepartemenfk,ru.namaruangan,jd.jenisdiagnosa
                    )as x GROUP BY x.namadiagnosa ,x.kddiagnosa, x.objectdepartemenfk
                    ) as z
                    ORDER BY z.jumlah desc
    
                "));
                // $data = DB::select(DB::raw("select * from (
                //     select x.kddiagnosa,x.namadiagnosa,count(x.kddiagnosa)as jumlah, 
                //     CASE WHEN x.objectdepartemenfk = 16 THEN 'ranap' ELSE 'rajal' END AS jenis
                //     from (select dm.kddiagnosa, 
                //     dm.namadiagnosa, ru.objectdepartemenfk
                //     from antrianpasiendiperiksa_t as app
                //     left join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                //     left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                //     inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                //     inner join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
                //     inner join pasien_m as ps on ps.id = pd.nocmfk
                //     left join alamat_m as alm on alm.nocmfk = ps.id
                //     left join kecamatan_m as kec on kec.id = alm.objectkecamatanfk
                //     left join kotakabupaten_m as kot on kot.id = alm.objectkotakabupatenfk
                //     left join propinsi_m as pro on pro.id = alm.objectpropinsifk
                //     left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                //     where dm.kddiagnosa <> '-'  and
                //     pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                //     $deptId
                //     )as x GROUP BY x.namadiagnosa ,x.kddiagnosa, x.objectdepartemenfk 
                //     ) as z
                //     ORDER BY z.jumlah desc

                // "));
            }
        }

        // $data = DB::select(DB::raw("select * from (
        //         select x.kddiagnosa,x.namadiagnosa,count(x.kddiagnosa)as jumlah, 
        //         CASE WHEN x.objectdepartemenfk = 16 THEN 'ranap' ELSE 'rajal' END AS jenis
        //         from (select dm.kddiagnosa, 
        //         dm.namadiagnosa, ru.objectdepartemenfk
        //         from antrianpasiendiperiksa_t as app
        //         left join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
        //         left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
        //         inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
        //         inner join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
        //         inner join pasien_m as ps on ps.id = pd.nocmfk
        //         left join alamat_m as alm on alm.nocmfk = ps.id
        //         left join kecamatan_m as kec on kec.id = alm.objectkecamatanfk
        //         left join kotakabupaten_m as kot on kot.id = alm.objectkotakabupatenfk
        //         left join propinsi_m as pro on pro.id = alm.objectpropinsifk
        //         left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //         where dm.kddiagnosa <> '-'  and
        //         pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
        //         $deptId
        //         )as x GROUP BY x.namadiagnosa ,x.kddiagnosa, x.objectdepartemenfk 
        //         ) as z
        //         ORDER BY z.jumlah desc

        //     "));
        if (count($data) > 0) {
            foreach ($data as $item) {
                $result[] = array(
                    'jumlah' => $item->jumlah,
                    'kddiagnosa' => $item->kddiagnosa,
                    'namadiagnosa' => $item->namadiagnosa,
                    'jenis' => $item->jenis
                );
            }
        } else {
            $result[] = array(
                'jumlah' => 0,
                'kddiagnosa' => null,
                'namadiagnosa' => null,
                'jenis' => null
            );
        }

        $results = array(
            'kd_hospital' => '3372052',
            'tahun' => $tahun,
            'bulan' => $bulan,
            'result' => $result,
            'jenis' => $jenispelayanan,
            'message' => 'dy',
        );
        return $this->respond($results);
    }

    public function sendDataDiagnosaBridgingDinkes(Request $request)
    {
        $data = $request;
        $url = "https://api-sik.dinkes.surakarta.go.id/rs/penyakit/add";
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        $password = base64_encode('rsjdska:rsjdska');
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,

            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "Authorization: Basic " . $password
            ),
        ));
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
            $transMessage = "Pengiriman Data Penyakit ke Dinkes Gagal!";
        } else {
            $result = (array) json_decode($response);
            $transMessage = "Pengiriman Data Penyakit ke Dinkes Berhasil!";
        }

        return $this->setStatusCode($result['code'])->respond($result, $transMessage);
    }
}
