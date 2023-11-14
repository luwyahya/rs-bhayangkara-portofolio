<?php
//“Great men are not born great, they grow great . . .”
//― Mario Puzo, The Godfather
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 08/08/2017
 * Time: 12:48
 */

/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 09/08/2019
 * Time: 10:19
 */

namespace App\Http\Controllers\Farmasi;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\StrukResep;
use App\Transaksi\OrderPelayanan;
use App\Master\LoginUser;



class FarmasiController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataComboDaftarPasien(Request $request) {
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id',array(3,14,16,17,18,19,24,25,26,27,28,35))
            ->where('dp.statusenabled',true)
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled',true)
            ->get();
        foreach ($dataInstalasi as $item){
            $detail=[];
            foreach ($dataRuangan  as $item2){
                if ($item->id == $item2->objectdepartemenfk){
                    $detail[] =array(
                        'id' =>   $item2->id,
                        'ruangan' =>   $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[]=array(
                'id' =>   $item->id,
                'departemen' =>   $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id','kp.kelompokpasien')
            ->where('kp.statusenabled',true)
            ->get();
        $dataRuanganInap = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16,25])
            ->orderBy('ru.namaruangan')
            ->get();
        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();
        $dataRuanganFarmasi = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [14])
            ->orderBy('ru.namaruangan')
            ->get();

        $list = explode(',',$this->settingDataFixed('KdDepartemenPelayanan'));
        $kdDepartemenPelayanan = [];
        foreach ($list as $otem){
            $kdDepartemenPelayanan [] = (int)$otem;
        }
        $dataRuanganPelayanan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', $kdDepartemenPelayanan)
            ->orderBy('ru.namaruangan')
            ->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' =>   $dataKelompok,
            'ruangan' => $dataRuangan,
            'jeniskelamin' => $dataJenisKelamin,
            'ruanganinap' => $dataRuanganInap,
            'ruanganfarmasi' => $dataRuanganFarmasi,
            'ruanganpelayanan' => $dataRuanganPelayanan,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarPasien(Request $request) {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->leftjoin('registrasipelayananpasien_t as rpp','pd.norec','=','rpp.noregistrasifk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','apd.norec','rpp.noregistrasifk as rpp',
                'pd.nostruklastfk','pd.norec as norec_pd','ps.id','pd.statusschedule','pd.istaskantrol','ru.objectdepartemenfk','apd.objectruanganfk')
            ->whereNull('br.pasiendaftarfk')
            ->orderBy('pd.noregistrasi',"desc");

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('pd.tglregistrasi','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->where('pd.tglregistrasi','<=', $tgl);
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id', $request['ruid']);
        }
        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
            $data = $data->where('dp.id', $request['dpid']);
        }
        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
            $data = $data->where('kp.id', $request['kpid']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }

        $data = $data->groupBy('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
            'kp.id','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id',
            'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','apd.norec','rpp.noregistrasifk','pd.nostruklastfk','pd.norec','ps.id','pd.statusschedule',
        'ru.objectdepartemenfk');

        $data = $data->take(15);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarPasienAntrian(Request $request) {
        $data = \DB::table('antrianpasienregistrasi_t as ap')
            // ->join('antrianpasienregistrasi_t as apd','apd.norec','=','ap.norecapd')
            // ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->join('pasien_m as ps','ap.nocmfk','=','ps.id')
            ->join('ruangan_m as ru','ap.objectruanganfk','=','ru.id')
            ->select('ru.namaruangan','ps.nocm','ps.namapasien','ap.statuspanggil','ap.jenis','ap.noantrian','ap.statuspanggil','ap.norec')
            // ->whereNull('br.pasiendaftarfk')
            ->orderBy('ap.noantrian',"asc");
        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('ap.tanggalreservasi','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->where('ap.tanggalreservasi','<=', $tgl);
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id', $request['ruid']);
        }

        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }
        if(isset($request['jenis']) && $request['jenis']!="" && $request['jenis']!="undefined"){
            $data = $data->where('ap.jenis', $request['jenis']);
        }

        if(isset($request['statusdipanggil']) && $request['statusdipanggil']!="" && $request['statusdipanggil']!="undefined"){
            $data = $data->where('ap.statuspanggil','=', $request['statusdipanggil']);
        }
         // $data = $data->orWhere('ap.statuspanggil','=', 3);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarPasienRI(Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('registrasipelayananpasien_t as rpp','pd.norec','=','rpp.noregistrasifk')
            ->leftjoin('antrianpasiendiperiksa_t as apd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk as rpp','pd.nostruklastfk','apd.norec','pd.norec as norec_pd')
            ->whereNull('br.pasiendaftarfk')
            ->orderBy('pd.noregistrasi');

//        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
//            $data = $data->where('pd.tglregistrasi','>=', $request['tglAwal']);
//        }
//        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
//            $tgl= $request['tglAkhir']." 23:59:59";
//            $data = $data->where('pd.tglregistrasi','<=', $tgl);
//        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id', $request['ruid']);
        }
//        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
//            $data = $data->where('dp.id', $request['dpid']);
//        }
//        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
//            $data = $data->where('kp.id', $request['kpid']);
//        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }

        $data = $data->groupBy('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
            'kp.id','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id',
            'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk','pd.nostruklastfk','apd.norec','pd.norec');
        $data = $data->where('dp.id','=',16);
        $data = $data->whereNull('pd.tglpulang');
        $data = $data->whereNull('apd.tglkeluar');
        $data = $data->where('pd.tglregistrasi','>','2019-05-25 00:00');
        $data = $data->take(50);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarResep(Request $request) {
        $dataLogin = $request->all();
        $data = \DB::table('strukresep_t as sr')
            ->leftJoin('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
            ->leftJoin('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->leftJoin('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJOIN('pegawai_m as pg','pg.id','=','sr.penulisresepfk')
            ->leftJOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->leftJOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->leftJOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk')
            ->leftJOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftJOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->leftJoin('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJoin('ruangan_m as ru1','ru1.id','=','sr.ruanganfk')
            ->select('sr.norec','sr.statusenabled','sr.noresep','sr.tglresep','ps.id as psid','pd.noregistrasi','ps.nocm','ps.namapasien','ru.id as ruid',
                'ru.namaruangan','pg.id as pgid','pg.namalengkap as dokter','ru2.id as ruapotikid',
                'ru2.namaruangan as namaruanganapotik','jk.jeniskelamin','ps.tgllahir','kl.id as klid','kl.namakelas',
                'pd.tglregistrasi','apd.norec as norec_apd','kp.kelompokpasien', 'isreseppulang');
//            ->where('sr.statusenabled' != 'f');
        //where('sr.statusenabled' != 'f');

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sr.tglresep','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sr.tglresep','<=', $tgl);
        }
        if(isset($request['noresep']) && $request['noresep']!="" && $request['noresep']!="undefined"){
            $data = $data->where('sr.noresep','ilike','%'. $request['noresep']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noregistrasi']);
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id', $request['ruid']);
        }
        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
            $data = $data->where('dp.id', $request['dpid']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }
        if(isset($request['status']) && $request['status']!="" && $request['status']!="undefined"){
            $data = $data->where('sr.status', $request['status']);
        }
        if ($request['noresep']!="" && $request['noregistrasi']!="" && $request['ruid']!="" && $request['dpid']!=""
            && $request['noresep']!="" && $request['namapasien']!="" && $request['status']!=""){
        }
        if(isset($request['IdFarmasi']) && $request['IdFarmasi']!="" && $request['IdFarmasi']!="undefined"){
            $data = $data->where('sr.ruanganfk', $request['IdFarmasi']);
        }
//        if(isset($request['jenisobatfk']) && $request['jenisobatfk']!="" && $request['jenisobatfk']!="undefined"){
//            $data = $data->where('pp.jenisobatfk', $request['jenisobatfk']);
//        }
//        $data = $data->where('sr.statusenabled',t);
//        $data = $data->orwhere('sr.statusenabled',null);
        $data = $data->where(function($q) {
            $q->where('sr.statusenabled', true)
                ->orWhere('sr.statusenabled', null);
        });
        $data = $data->take($request['jmlRows']);
        $data = $data->orderby('sr.tglresep');
        $data = $data->get();
//        foreach ($data as $item){
//
//            $pelayananpasien = \DB::table('strukresep_t as sr')
//                ->JOIN('pelayananpasien_t as pp','pp.strukresepfk','=','sr.norec')
//                ->JOIN('jeniskemasan_m as jk','jk.id','=','pp.jeniskemasanfk')
//                ->select('sr.noresep','jk.id as jkid','jk.jeniskemasan')
//                ->where('sr.norec',$item->norec )
//                ->where('jk.id',1 )//racikan
//                ->first();
//            if(!empty($pelayananpasien)){
//                $item->jenis = 'Racikan';
//            }else{
//                $item->jenis = 'Non Racikan';
//            }
//        }
        $result = array(
            'daftar' => $data,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarReturObat(Request $request) {
        $dataLogin = $request->all();
        $data = \DB::table('strukretur_t as srt')
            ->LEFTJOIN('strukresep_t as sr','sr.norec','=','srt.strukresepfk')
            ->LEFTJOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
            ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','srt.objectpegawaifk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','srt.objectruanganfk')
            ->LEFTJOIN('strukpelayanan_t as sp','sp.norec','=','srt.strukresepfk')
            ->select('srt.tglretur','srt.noretur','pd.noregistrasi','ps.nocm','ps.namapasien','pg.namalengkap','sr.noresep','sr.tglresep',
                'ru.namaruangan','srt.norec','srt.keteranganlainnya','sp.nostruk_intern as nocm_sp','sp.namapasien_klien as namapasien_sp'
            );

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('srt.tglretur','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('srt.tglretur','<=', $tgl);
        }
        if(isset($request['nostruk']) && $request['nostruk']!="" && $request['nostruk']!="undefined"){
            $data = $data->where('srt.noretur','ilike','%'. $request['nostruk']);
        }
//        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
//            $data = $data->where('sp.nostruk_intern','ilike','%'. $request['nocm'].'%');
//        }
//        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
//            $data = $data->where('sp.namapasien_klien','ilike','%'. $request['namapasien'].'%');
//        }
        $data = $data->where('srt.statusenabled',true);
        $data = $data->orderBy('srt.noretur');
        $data = $data->get();
        $results = [];
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                select spd.tglpelayanan, spd.rke,jkm.jeniskemasan,pr.namaproduk,
                ss.satuanstandar,spd.jumlah,spd.hargasatuan,spd.hargadiscount,
                spd.jasa,((spd.hargasatuan-spd.hargadiscount)*spd.jumlah)+spd.jasa as total from pelayananpasienretur_t as spd
                INNER JOIN produk_m as pr on pr.id=spd.produkfk
                INNER JOIN jeniskemasan_m as jkm on jkm.id=spd.jeniskemasanfk
                INNER JOIN satuanstandar_m as ss on ss.id=spd.satuanviewfk
                where strukreturfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $namapasien = $item->namapasien;
            $nocm = $item->nocm;
            $noregistrasi = $item->noregistrasi;
            if( is_null($item->noregistrasi )){
                $namapasien =  $item->namapasien_sp;
                $nocm = $item->nocm_sp;
                $noregistrasi = '-';
            }

            $results[] = array(
                'tglresep' => $item->tglresep,
                'noresep' => $item->noresep,
                'tglretur' => $item->tglretur,
                'noretur' => $item->noretur,
                'noregistrasi' => $noregistrasi,
                'nocm' =>$nocm,
                'namapasien' => $namapasien,
                'namalengkap' => $item->namalengkap,
                'namaruangan' => $item->namaruangan,
                'norec' => $item->norec,
                'keteranganlainnya' => $item->keteranganlainnya,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarPaketObatPasien(Request $request) {
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk',$dataLogin['userData']['id'])
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic){
            $strRuangan[] = $epic->id;
        }
        $data = [];
        $data = \DB::table('strukkirim_t as sp')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','sp.objectpegawaipengirimfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','sp.objectruanganasalfk')
            ->LEFTJOIN('ruangan_m as ru2','ru2.id','=','sp.objectruangantujuanfk')
            ->LEFTJOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','sp.noregistrasifk')
            ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->select('sp.norec','sp.tglkirim','sp.nokirim','sp.jenispermintaanfk','pg.namalengkap',
                'ru.namaruangan as ruanganasal','ru2.namaruangan as ruangantujuan','sp.keteranganlainnyakirim','ps.namapasien',
                'pd.noregistrasi','sp.noregistrasifk'
            );

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sp.tglkirim','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sp.tglkirim','<=', $tgl);
        }
        if(isset($request['nokirim']) && $request['nokirim']!="" && $request['nokirim']!="undefined"){
            $data = $data->where('sp.nokirim','ilike','%'. $request['nokirim']);
        }
        if(isset($request['ruangantujuanfk']) && $request['ruangantujuanfk']!="" && $request['ruangantujuanfk']!="undefined"){
            $data = $data->where('ru2.id','=', $request['ruangantujuanfk']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noregistrasi']);
        }
        $data = $data->where('sp.statusenabled',true);
        $data = $data->where('sp.objectkelompoktransaksifk',34);
//        $data = $data->wherein('sp.objectruanganasalfk',$strRuangan);
        $data = $data->wherenotnull('sp.noregistrasifk');
        $data = $data->where('sp.noregistrasifk','<>','0');
        $data = $data->orderBy('sp.nokirim');
        $data = $data->get();

        $results =array();
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                     select  pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk
                     from kirimproduk_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where nokirimfk=:norec and spd.qtyproduk <> 0"),
                array(
                    'norec' => $item->norec,
                )
            );
            $jeniskirim ='';
            if ($item->jenispermintaanfk == 1){
                $jeniskirim ='Amprahan';
            }
            if ($item->jenispermintaanfk == 2){
                $jeniskirim ='Transfer';
            }
            $results[] = array(
                'status' => 'Kirim Barang',
                'tglstruk' => $item->tglkirim,
                'nostruk' => $item->nokirim,
                'jeniskirim' => $jeniskirim,
                'norec' => $item->norec,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'petugas' => $item->namalengkap,
                'keterangan' => $item->keteranganlainnyakirim,
                'namapasien' => $item->namapasien,
                'noregistrasi' => $item->noregistrasi,
                'norec_apd' => $item->noregistrasifk,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
            'str' => $strRuangan,
        );

        return $this->respond($result);
    }
     public function getDaftarReturObatDetail(Request $request) {
        $data = \DB::table('strukretur_t as srt')
            ->leftJoin('strukresep_t as sr','sr.norec','=','srt.strukresepfk')
            ->leftJoin('antrianpasiendiperiksa_t as apd','apd.norec','=','sr.pasienfk')
            ->leftJoin('strukpelayanan_t as sp','sp.norec','=','srt.strukresepfk')
            ->leftJoin('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->leftJoin('pelayananpasienretur_t as spd','spd.strukreturfk','=', 'srt.norec')
            ->join('produk_m as pr','pr.id','=','spd.produkfk')
            ->join('jeniskemasan_m as jkm','jkm.id','=','spd.jeniskemasanfk')
            ->join('satuanstandar_m as ss','ss.id','=','spd.satuanviewfk')
            ->leftJoin('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','srt.objectpegawaifk')
            ->leftJoin('ruangan_m as ru','ru.id','=','srt.objectruanganfk')
            ->leftJoin('ruangan_m as ru1','ru1.id','=','apd.objectruanganfk')
            ->select(DB::raw("srt.tglretur,srt.noretur,CASE WHEN pd.noregistrasi IS NULL THEN '-' ELSE pd.noregistrasi END AS noregistrasi,
                    sr.tglresep,sr.noresep,
                    CASE WHEN ps.nocm IS NULL THEN sp.nostruk_intern ELSE ps.nocm END AS nocm,
                    CASE WHEN ps.namapasien IS NULL THEN sp.namapasien_klien ELSE ps.namapasien END AS namapasien,
                    CASE WHEN ru1.namaruangan IS NULL THEN '-' ELSE ru1.namaruangan END as unitlayanan,
                    ps.namapasien,pg.namalengkap,ru.namaruangan AS depo,srt.norec,srt.keteranganlainnya,
                    spd.tglpelayanan, spd.rke,jkm.jeniskemasan,pr.namaproduk,ss.satuanstandar,spd.jumlah,spd.hargasatuan,
                    spd.hargadiscount,spd.jasa,((spd.hargasatuan-spd.hargadiscount)*spd.jumlah)+spd.jasa as total"));

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('srt.tglretur','>=', $request['tglAwal']);
        }

        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('srt.tglretur','<=', $tgl);
        }

        if(isset($request['nostruk']) && $request['nostruk']!="" && $request['nostruk']!="undefined"){
            $data = $data->where('srt.noretur','ilike','%'. $request['nostruk']);
        }

        if(isset($request['idDepo']) && $request['idDepo']!="" && $request['idDepo']!="undefined"){
            $data = $data->where('ru.id','=', $request['idDepo']);
        }

        if(isset($request['idRuangLayanan']) && $request['idRuangLayanan']!="" && $request['idRuangLayanan']!="undefined"){
            $data = $data->where('ru1.id','=', $request['idRuangLayanan']);
        }

        $data = $data->where('srt.statusenabled',true);
        $data = $data->orderBy('srt.noretur');
        $data = $data->get();

        $result = array(
            'daftar' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getLapPemakaianObat(Request $request) {
        $dataLogin = $request->all();
        // return($dataLogin);
        // die();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $result = DB::select(
                DB::raw("SELECT ROW_NUMBER() OVER (ORDER BY  pp.norec) as no,pp.tglpelayanan,pro.namaproduk,ps.namapasien,
                    rk.namarekanan,pp.hargasatuan,pp.jumlah,pp.jumlah*pp.hargasatuan as total,
                    pro.kodeexternal, pg.nama,pg2.nama as userlogin,ap.reportdisplay from pasiendaftar_t as pd
                    join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    join produk_m as pro on pro.id=pp.produkfk
                    join pasien_m as ps on ps.id=pd.nocmfk
                    left join rekanan_m as rk on rk.id=pd.objectrekananfk
                    INNER JOIN strukresep_t as sr on sr.norec=pp.strukresepfk
                    left join pegawai_m as pg on pg.id=sr.penulisresepfk
                    left join pegawai_m as pg2 on pg2.id=pp.objectpegawailoginfk
                    join stokprodukdetail_t as spd on spd.objectprodukfk=pro.id
                    join asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                    where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pp.aturanpakai is not null
                    GROUP BY  pp.norec,pp.tglpelayanan,pro.namaproduk,ps.namapasien,
                    rk.namarekanan,pp.hargasatuan,pp.jumlah,
                    pro.kodeexternal, pg.nama,pg2.nama,ap.reportdisplay")
            );

        $result = array(
            'daftar' => $result,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarOrderProduksiSteril(Request $request){
        $data = \DB::table('strukorder_t as so')
            ->JOIN('pasien_m as ps','ps.id','=','so.nocmfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('ruangan_m as ru','ru.id','=','so.objectruanganfk')
            ->JOIN('ruangan_m as ru2','ru2.id','=','so.objectruangantujuanfk')
            ->leftJOIN('pegawai_m as pg','pg.id','=','so.objectpegawaiorderfk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','so.noregistrasifk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJOIN('antrianpasiendiperiksa_t as apd', function($join){
                $join->on('apd.noregistrasifk','=','pd.norec')
                    ->on('apd.objectruanganfk', '=', 'so.objectruanganfk')
                    ->on('apd.objectpegawaifk', '=', 'so.objectpegawaiorderfk');
            })
            ->leftJOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select('so.noorder','ps.nocm','ps.namapasien','jk.jeniskelamin','ru.namaruangan as namaruanganrawat',
                'so.tglorder','pg.namalengkap','ru2.namaruangan',
                'so.statusorder','so.namapengambilorder','so.noregistrasifk',
                'pd.noregistrasi','kp.kelompokpasien',
                'apd.norec as norec_apd',
                'pd.tglregistrasi','ps.tgllahir','kl.namakelas','kl.id as klid','so.tglambilorder');

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('so.tglorder','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->where('so.tglorder','<=', $tgl);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['norec_apd']) && $request['norec_apd']!="" && $request['norec_apd']!="undefined"){
            $data = $data->where('apd.norec', $request['norec_apd']);
        }
        $data = $data->where('so.keteranganorder','=', 'Order Produksi Steril');
        $data = $data->where('so.objectkelompoktransaksifk', 4);
        $data = $data->get();
        $status ='';

        $result=[];
        foreach ($data as $item){
            if ($item->statusorder == 0){$status='Menunggu';};
            if ($item->statusorder == 5){$status='Verifikasi';};
            if ($item->statusorder == 1){$status='Produksi';};
            if ($item->statusorder == 2){$status='Packaging';};
            if ($item->statusorder == 3){$status='Selesai';};
            if ($item->statusorder == 4){$status='Penyerahan Obat';};
            if ($item->tglambilorder != null){$status='Sudah Di Ambil';};
            $result[] = array(
                'noregistrasi' => $item->noregistrasi,
                'norec' => $item->noregistrasifk,
                'tglregistrasi' => $item->tglregistrasi,
                'norec_apd' => $item->norec_apd,
                'noorder' => $item->noorder,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'namaruanganrawat' => $item->namaruanganrawat,
                'tglorder' => $item->tglorder,
                'namalengkap' => $item->namalengkap,
                'kelompokpasien' => $item->kelompokpasien,
                'namaruangan' => $item->namaruangan,
                'statusorder' => $status,
                'namapengambilorder' => $item->namapengambilorder,
                'tgllahir' => $item->tgllahir,
                'klid' => $item->klid,
                'namakelas' => $item->namakelas,
            );
        }

        return $this->respond($result);
    }
    public function getDaftarPasienAntrianBelum(Request $request) {
        $data = \DB::table('antrianpasienregistrasi_t as ap')
            // ->join('antrianpasienregistrasi_t as apd','apd.norec','=','ap.norecapd')
            // ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->join('pasien_m as ps','ap.nocmfk','=','ps.id')
            ->join('ruangan_m as ru','ap.objectruanganfk','=','ru.id')
            ->select('ru.namaruangan','ps.nocm','ps.namapasien','ap.statuspanggil','ap.jenis','ap.noantrian','ap.statuspanggil','ap.norec')
            // ->whereNull('br.pasiendaftarfk')
            ->orderBy('ap.noantrian',"asc");
        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('ap.tanggalreservasi','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->where('ap.tanggalreservasi','<=', $tgl);
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id', $request['ruid']);
        }

        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }
        if(isset($request['jenis']) && $request['jenis']!="" && $request['jenis']!="undefined"){
            $data = $data->where('ap.jenis', $request['jenis']);
        }

        if(isset($request['statusdipanggil']) && $request['statusdipanggil']!="" && $request['statusdipanggil']!="undefined"){
            $data = $data->where('ap.statuspanggil','=', $request['statusdipanggil']);
        }
         $data = $data->whereRaw('ap.statuspanggil::int != 5 ');

         //$data = $data->where('ap.statuspanggil','=', 1); 
        $data = $data->get();
        return $this->respond($data);
    }
}