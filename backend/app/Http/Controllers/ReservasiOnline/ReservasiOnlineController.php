<?php
/**
 * Created by IntelliJ IDEA.
 * User: Egie Ramdan
 * Date: 02/04/2019
 * Time: 10:14
 */
namespace App\Http\Controllers\ReservasiOnline;

use App\Http\Controllers\ApiController;
use App\Master\Alamat;
use App\Master\Agama;
use App\Master\Pasien;
use App\Master\SlottingOnline;
use App\Master\SlottingLibur;
use App\Master\StatusPerkawinan;
use App\Master\Pendidikan;
use Carbon\Carbon;
//use Faker\Provider\DateTime;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use App\Transaksi\PasienDaftarVaksin;
use App\Transaksi\PasienDaftar;
use App\Master\Tracer;
use App\Transaksi\KendaliDokumenRekamMedis;
use App\Master\Ruangan;
use App\Transaksi\RegistrasiPelayananPasien;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\BatalRegistrasi;
use App\Transaksi\PelayananPasienPetugas;
use App\Traits\Valet;
use DB;
use App\Transaksi\AntrianPasienRegistrasi;
use App\Transaksi\DviPelapor;
use Webpatser\Uuid\Uuid;

class ReservasiOnlineController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

	public function getComboReservasi(Request $request)
	{

		$deptJalan = explode (',',$this->settingDataFixed('kdDepartemenReservasiOnline'));
		$kdDepartemenRawatJalan = [];
		foreach ($deptJalan as $item){
			$kdDepartemenRawatJalan []=  (int)$item;
		}

		$dataRuanganJalan = \DB::table('ruangan_m as ru')
			->select('ru.id','ru.namaruangan','ru.objectdepartemenfk','ru.photo')
			->where('ru.statusenabled', true)
			->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->wherenotin('ru.id', array(12,448,535,243,255,322,251,544,249))
			->orderBy('ru.namaruangan')
			->get();
        $dataRuanganJalanKiosk = \DB::table('ruangankiosk_m as ru')
			->select('ru.kodeexternal as id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal')
			->where('ru.statusenabled', true)
			->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->wherenotin('ru.id', array(12,448,535,243,255,322,251,544,249))
			->orderBy('ru.namaruangan')
			->get();
		$jk = \DB::table('jeniskelamin_m')
			->select('id','jeniskelamin')
			->where('statusenabled', true)
			->orderBy('jeniskelamin')
			->get();
		$kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter');

		$dkoter = \DB::table('pegawai_m')
			->select('*')
			->where('statusenabled', true)
			->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
			->orderBy('namalengkap')
			->get();

		$kelompokPasien = \DB::table('kelompokpasien_m')
			->select('id','kelompokpasien')
			->where('statusenabled', true)
            ->whereIn('id', array(1,2,3,12))
			->orderBy('kelompokpasien')
			->get();

        $kelompokPasienTelemedicine = \DB::table('kelompokpasien_m')
            ->select('id','kelompokpasien')
            ->where('statusenabled', true)
            ->where('id', '1')
            ->orderBy('kelompokpasien')
            ->get();

        $dataAsalRujukan = \DB::table('asalrujukan_m as as')
            ->select('as.id','as.asalrujukan')
            ->where('as.statusenabled', true)
            ->orderBy('as.asalrujukan')
            ->get();

        $pekerjaan = DB::table('pekerjaan_m')
            ->select(DB::raw("id, UPPER(pekerjaan) as pekerjaan,namaexternal as namadukcapil"))
            ->where('statusenabled',true)
            ->get();

        $namavaksin = DB::table('namavaksin_m')
            ->select(DB::raw("id, UPPER(namavaksin) as namavaksin"))
            ->where('statusenabled',true)
            ->get();

		$result = array(
			'ruanganrajal' => $dataRuanganJalan,
            'ruanganrajalKiosk' => $dataRuanganJalanKiosk,
			'jeniskelamin' => $jk,
			'dokter' => $dkoter,
			'kelompokpasien' => $kelompokPasien,
            'kelompokpasientelemedicine' => $kelompokPasienTelemedicine,
            'asalrujukan' => $dataAsalRujukan,
            'pekerjaan' => $pekerjaan,
            'namavaksin' => $namavaksin,
			'message' => 'ramdan@epic',
		);

		return $this->respond($result);
	}
    public function getPaketMcu(Request $request)
	{

		$deptJalan = explode (',',$this->settingDataFixed('kdDepartemenReservasiOnline'));
		$kdDepartemenRawatJalan = [];
		foreach ($deptJalan as $item){
			$kdDepartemenRawatJalan []=  (int)$item;
		}

		$dataPaket = \DB::table('paketmcu_m as pm')
			->select('pm.id','pm.namapaket','pm.hargajual')
			->where('pm.statusenabled', true)
			->orderBy('pm.namapaket')
			->get();

        $jk = \DB::table('jeniskelamin_m')
			->select('id','jeniskelamin')
			->where('statusenabled', true)
			->orderBy('jeniskelamin')
			->get();

        $agama = Agama::where('statusenabled', true)
            ->select(DB::raw("id, UPPER(agama) as agama"))
            ->get();
        
        $gd = DB::table('golongandarah_m')
            ->select(DB::raw("id, UPPER(golongandarah) as golongandarah,namaexternal as namadukcapil"))
            ->where('statusenabled', true)
            ->get();

        $kebangsaan = DB::table('kebangsaan_m')
            ->select(DB::raw("id, UPPER(name) as name"))
            ->where('statusenabled', true)
            ->get();

        $negara = DB::table('negara_m')
            ->select(DB::raw("id, UPPER(namanegara) as namanegara"))
            ->where('statusenabled', true)
            ->orderBy('namanegara')
            ->get();

        $statusPerkawinan = StatusPerkawinan::where('statusenabled', true)
            ->select(DB::raw("id, UPPER(statusperkawinan) as statusperkawinan,namaexternal as namadukcapil"))
            ->get();

        $pendidikan = Pendidikan::where('statusenabled', true)
            ->select(DB::raw("id, UPPER(pendidikan) as pendidikan,namaexternal as namadukcapil"))
            ->get();

        $pekerjaan = DB::table('pekerjaan_m')
            ->select(DB::raw("id, UPPER(pekerjaan) as pekerjaan,namaexternal as namadukcapil"))
            ->where('statusenabled', true)
            ->get();

        $suku = DB::table('suku_m')
            ->select(DB::raw("id, UPPER(suku) as suku"))
            ->where('statusenabled', true)
            ->get();

        $propinsi = DB::table('propinsi_m')
            ->select(DB::raw("id, UPPER(namapropinsi) as namapropinsi"))
            ->where('statusenabled', true)
            ->orderBy('namapropinsi')
            ->get();

        $kotakabupaten = DB::table('kotakabupaten_m')
            ->select(DB::raw("id, UPPER(namakotakabupaten) as namakotakabupaten,objectpropinsifk"))
            ->where('statusenabled', true)
            ->orderBy('namakotakabupaten')
            ->get();
        
        $kecamatan = DB::table('kecamatan_m')
            ->select(DB::raw("id, UPPER(namakecamatan) as namakecamatan, objectkotakabupatenfk"))
            ->where('statusenabled', true)
            ->orderBy('namakecamatan')
            ->get();

        $desa = DB::table('desakelurahan_m')
            ->select(DB::raw("id, UPPER(namadesakelurahan) as namadesakelurahan,kodepos, objectkecamatanfk"))
            ->where('statusenabled', true)
            ->orderBy('namadesakelurahan')
            ->get();

		$result = array(
			'dataPaket' => $dataPaket,
            'jeniskelamin' => $jk,
            'agama' => $agama,
            'golongandarah' => $gd,
            'kebangsaan' => $kebangsaan,
            'negara' => $negara,
            'statusPerkawinan' => $statusPerkawinan,
            'pendidikan' => $pendidikan,
            'pekerjaan' => $pekerjaan,
            'suku' => $suku,
            'propinsi' => $propinsi,
            'kotakabupaten' => $kotakabupaten,
            'kecamatan' => $kecamatan,
            'desa' => $desa,
			'message' => 'polri',
		);

		return $this->respond($result);
	}
    public function getNewsReservasi(Request $request)
	{

		$dataNews = \DB::table('news_t as nw')
			->select('nw.id','nw.judul','nw.news','nw.photo')
			->where('nw.statusenabled', true)
			->orderBy('nw.judul')
			->get();
		

		$result = array(
			'dataNews' => $dataNews,
			'message' => 'snaps@squad',
		);

		return $this->respond($result);
	}
    public function getJadwalDokter(Request $request)
	{
        $data = \DB::table('jadwalpraktekmingguan_m as jd')
        ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
        ->join('ruangan_m as ru','ru.id','=','jd.objectruanganfk')
        ->select('jd.objectpegawaifk','pg.namalengkap','ru.namaruangan','pg.photo',
        (DB::raw("to_char(jd.tglmulai, 'dddd') as day")))
        ->where('jd.statusenabled', true)
        // ->where('pg.id','<>',1)
        ->orderByRaw('pg.namalengkap,jd.tglmulai desc');


        if(isset($request['namalengkap']) &&
            $request['namalengkap']!="" &&
            $request['namalengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','like','%'. $request['namalengkap'] .'%' );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['idRuangan'] );
        };
        if(isset($request['idPegawai']) &&
            $request['idPegawai']!="" &&
            $request['idPegawai']!="undefined"){
            $idPegawai =$request['idPegawai'];
            $data = $data->whereRaw("pg.id in ( $idPegawai )");
        };

        $data = $data->get();
        $hariini = date("l");
        
        $data10 = [];
        $sama = false;
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            if($item->day==$hariini){
                if($sama == false){
                    
                    $data10[] = array(
                        'id'=>$item->objectpegawaifk,
                        'namalengkap'=>$item->namalengkap,
                        // 'photo'=>$item->photo,
                        // 'namaruangan'=>$item->namaruangan,
                        // 'day'=>$hariini
                    );
                }
                foreach ($data10 as $key => $row) {
                    $count[$key] = $row['id'];
                }
                array_multisort($count, SORT_ASC, $data10);
            }            
        }
		return $this->respond($data10);
	}
    public function getJadwalDokterHariIni(Request $request)
	{
        $data = \DB::table('jadwalpraktekmingguan_m as jd')
        ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
        ->join('ruangan_m as ru','ru.id','=','jd.objectruanganfk')
        ->select('jd.objectpegawaifk','pg.namalengkap','ru.namaruangan','pg.photo',
        (DB::raw("FORMAT(jd.tglmulai, 'dddd') as day")))
        ->where('jd.statusenabled', true)
        ->where('pg.id','<>',1)
        ->orderByRaw('pg.namalengkap,jd.tglmulai desc');


        if(isset($request['namalengkap']) &&
            $request['namalengkap']!="" &&
            $request['namalengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','like','%'. $request['namalengkap'] .'%' );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['idRuangan'] );
        };
        if(isset($request['idPegawai']) &&
            $request['idPegawai']!="" &&
            $request['idPegawai']!="undefined"){
            $idPegawai =$request['idPegawai'];
            $data = $data->whereRaw("pg.id in ( $idPegawai )");
        };

        $data = $data->get();
        $hariini = date("l");
        
        $data10 = [];
        $sama = false;
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            if($item->day==$hariini){
                if($sama == false){
                    
                    $data10[] = array(
                        'id'=>$item->objectpegawaifk,
                        'namalengkap'=>$item->namalengkap,
                        'photo'=>$item->photo,
                        'namaruangan'=>$item->namaruangan,
                        'day'=>$hariini
                    );
                }
                foreach ($data10 as $key => $row) {
                    $count[$key] = $row['id'];
                }
                array_multisort($count, SORT_ASC, $data10);
            }            
        }
		return $this->respond($data10);
	}
    public function getJadwalMingguanDokter(Request $request){

        $data = \DB::table('jadwalpraktekmingguan_m as jd')
            ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
            ->join('ruangan_m as ru','ru.id','=','jd.objectruanganfk')
            ->select('jd.objectpegawaifk','pg.namalengkap','ru.namaruangan','pg.photo',
            (DB::raw("FORMAT(jd.tglmulai, 'dddd') as day")))
            ->where('jd.statusenabled', true)
            ->where('pg.id', '<>',1)
            ->orderByRaw('pg.namalengkap,jd.tglmulai desc');


        if(isset($request['namalengkap']) &&
            $request['namalengkap']!="" &&
            $request['namalengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','like','%'. $request['namalengkap'] .'%' );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['idRuangan'] );
        };
        if(isset($request['idPegawai']) &&
            $request['idPegawai']!="" &&
            $request['idPegawai']!="undefined"){
            $idPegawai =$request['idPegawai'];
            $data = $data->whereRaw("pg.id in ( $idPegawai )");
        };

        $data = $data->get();
        $data10 = [];
        $data11 = [];
        $sama = false;
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            if($item->day=="Monday"){
                $item->day="Senin";
            }else if($item->day=="Tuesday"){
                $item->day="Selasa";
            }else if($item->day=="Wednesday"){
                $item->day="Rabu";
            }else if($item->day=="Thursday"){
                $item->day="Kamis";
            }else if($item->day=="Friday"){
                $item->day="Jumat";
            }else if($item->day=="Saturday"){
                $item->day="Sabtu";
            }else if($item->day=="Sunday"){
                $item->day="Minggu";
            }
            foreach ($data10 as $hideung){
                if($item->objectpegawaifk == $data10[$i]['objectpegawaifk']){
                    $sama = true;
                    // $data10[$i]['day'] = $data10[$i]['day'].','.$item->day;
                    $data11[] = array(
                        'day'=>$item->day,
                    );
                    $data10[$i]['day'] = $data11;
                }
                $i = $i + 1;
            }
            if($sama == false){
                $data11 = [];
                $data11[] = array(
                    'day'=>$item->day,
                );
                $data10[] = array(
                    'objectpegawaifk'=>$item->objectpegawaifk,
                    'namalengkap'=>$item->namalengkap,
                    'day'=>$data11,
                    'photo'=>$item->photo
                );
            }
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['objectpegawaifk'];
            }

            array_multisort($count, SORT_ASC, $data10);
        }
        return $this->respond($data10);
    }
	public function getPasienByNoCmTglLahir($nocm,$tgllahir) {
    //     if(ctype_alpha($nocm)){
    //         $result = array(
    //             'data'=> [],
    //             'message' => 'ramdanegie',
    //         );
    //         return $this->respond($result);
       
    //    }
		$data = \DB::table('pasien_m as ps')
			->leftJOIN ('alamat_m as alm','alm.nocmfk','=','ps.id')
			->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
			->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
			->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
			->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.objectjeniskelaminfk','jk.jeniskelamin',
				'alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.noidentitas','ps.notelepon','ps.tempatlahir',
                'ps.nobpjs','alm.objectdesakelurahanfk','ps.nohp',
				DB::raw("to_char(ps.tgllahir,'yyyy-MM-dd') as tgllahir"))
            ->where('ps.statusenabled',true);
			// ->where('ps.nocm', $nocm);
        // if(isset($tgllahir) &&$tgllahir != "" && $tgllahir != "undefined" && $tgllahir != "null") {
        //     $data = $data ->whereRaw("CONVERT(varchar, ps.tgllahir, 105)  ='$tgllahir' " );
        // }
        if(isset($nocm) &&$nocm != "" && $nocm != "undefined" && $nocm != "null") {
            if(strlen($nocm)>8){
                $data = $data->where('ps.noidentitas','=',$nocm);
            }else{
                $data = $data->where('ps.nocm','=',$nocm);
            }
            // ->Orwhere('ps.noidentitas','=',$nocm);
        }
		$data = $data->get();
        $tglAyeuna = date('Y-m-d');

		$result = array(
            'status' => 201,
			'data'=> $data,
			'message' => 'ramdanegie',
		);
		return $this->respond($result);
	}
    public function getPasienByNoCmTglLahirKiosk($nocm,$tgllahir) {
    //     if(ctype_alpha($nocm)){
    //         $result = array(
    //             'data'=> [],
    //             'message' => 'ramdanegie',
    //         );
    //         return $this->respond($result);
       
    //    }
		$data = \DB::table('pasien_m as ps')
			->leftJOIN ('alamat_m as alm','alm.nocmfk','=','ps.id')
			->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
			->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
			->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
			->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.objectjeniskelaminfk','jk.jeniskelamin',
				'alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.noidentitas','ps.notelepon','ps.tempatlahir',
                'ps.nobpjs','alm.objectdesakelurahanfk','ps.nohp',
				DB::raw(" to_char( ps.tgllahir,'yyyy-MM-dd') as tgllahir"))
            ->where('ps.statusenabled',true);
			// ->where('ps.nocm', $nocm);
        // if(isset($tgllahir) &&$tgllahir != "" && $tgllahir != "undefined" && $tgllahir != "null") {
        //     $data = $data ->whereRaw("CONVERT(varchar, ps.tgllahir, 105)  ='$tgllahir' " );
        // }
        if(isset($nocm) &&$nocm != "" && $nocm != "undefined" && $nocm != "null") {
            if(strlen($nocm)>8){
                $data = $data->where('ps.noidentitas','=',$nocm);
            }else{
                $data = $data->where('ps.nocm','=',$nocm);
            }
            // ->Orwhere('ps.noidentitas','=',$nocm);
        }
		$data = $data->get();
        $tglAyeuna = date('Y-m-d');
        $dataCekDaftar = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select('pd.norec', 'pd.noregistrasi', 'ru.namaruangan', 'ru.id')
            ->where('ps.nocm', $nocm)
            ->whereRaw("to_char(pd.tglregistrasi,'yyyy-MM-dd') = '$tglAyeuna'")
            ->where('pd.statusenabled', true)
            ->where('pd.objectkelompokpasienlastfk', 2)
            ->where('ru.objectdepartemenfk', 18)
            ->orderBy('ru.id', 'ASC')
            ->get();
            if(count($dataCekDaftar) > 0){
                $transMessage = 'Pasien Sudah Pernah Daftar Hari Ini Di '.$dataCekDaftar[0]->namaruangan;
                $result = array(
                    "status" => 400,
                    "message"  => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->respond($result);
            }

		$result = array(
            'status' => 201,
			'data'=> $data,
			'message' => 'ramdanegie',
		);
		return $this->respond($result);
	}
    public function getSlottingByRuanganNewpoli($kode, $tgl)
    {
        $apd = DB::select(
            DB::raw("select count(norec) as kuntul from pasiendaftar_t where objectruanganlastfk =:ruangan
                 and to_char(pasiendaftar_t.tglregistrasi,'yyyy-MM-dd') =:tgl
            "),
            array(
                'ruangan' => $kode,
                'tgl' => $tgl,
            )
        );
        $totalpasien = 0;
        foreach ($apd as $item) {
            $totalpasien = $item->kuntul;
        }

        $ruangan = \DB::table('ruangan_m as ru')
        ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
        ->select(
            'ru.id',
            'ru.namaruangan',
            'ru.objectdepartemenfk',
            'slot.jambuka',
            'slot.jamtutup',
            'slot.quota',
            DB::raw("(EXTRACT(EPOCH FROM slot.jamtutup) - EXTRACT(EPOCH FROM slot.jambuka))/3600 as totaljam")
        )
        //                DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam"))
        ->where('ru.statusenabled', true)
            ->where('ru.id', $kode)
            ->where('slot.statusenabled', true)
            ->first();
        if (empty($ruangan)) {
            $result = array(
                'tanggal' => null,
                'slot' => 'Belum Maping Sloting',
                'reservasi' => null,
                'message' => 'Slot belum tersedia di Poli ini',
            );
            return $this->respond($result);
        }

       
        $quota = (float)$ruangan->quota;
        // return($totalpasien);
        if($totalpasien >= $quota){
            $result = array(
                'tanggal' => null,
                'slot' => null,
                'reservasi' => null,
                'message' => 'Slot Penuh',
            );
            return $this->respond($result);
        }
        
        $result = array(
            'tanggal' => $tgl,
            'slot' => $quota- $totalpasien,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getPasienByNoCmTglLahirAndroid($nocm,$tgllahir) {
		$data = \DB::table('pasien_m as ps')
			->leftJOIN ('alamat_m as alm','alm.nocmfk','=','ps.id')
			->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
			->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
			->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
			->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.objectjeniskelaminfk','jk.jeniskelamin',
				'alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.noidentitas','ps.notelepon','ps.tempatlahir',
                'ps.nobpjs','ps.photo',
				DB::raw(" format ( ps.tgllahir,'yyyy-MM-dd') as tgllahir"))
            ->where('ps.statusenabled',true);
			// ->where('ps.nocm', $nocm);
        // if(isset($tgllahir) &&$tgllahir != "" && $tgllahir != "undefined" && $tgllahir != "null") {
        //     $data = $data ->whereRaw("CONVERT(varchar, ps.tgllahir, 105)  ='$tgllahir' " );
        // }
        if(isset($nocm) &&$nocm != "" && $nocm != "undefined" && $nocm != "null") {
            // $data = $data->where('ps.nocm','=',$nocm);
            
            if(strlen($nocm)>8){
                $data = $data->where('ps.noidentitas','=',$nocm);
            }else{
                $data = $data->where('ps.nocm','=',$nocm);
            }
        }
		$data = $data->get();

		$result = array(
			'data'=> $data,
            'versi'=>'v.1',
			'message' => 'ramdanegie',
		);
		return $this->respond($result);
	}

    public function getVersi() {
		
		$result = array(
            'versi'=>'v.1',
			'message' => 'JDS',
		);
		return $this->respond($result);
	}

    public function saveReservasi(Request $request)
    {
        DB::beginTransaction();
        try {
            // $tglNow = Carbon::now()->format('H');
            // $tglNextDay = Carbon::now()->format('d');
            // $tglNextDay = $tglNextDay+1;
            // if($tglNow>20){
            //     DB::rollBack();
            //     $transStatus = 'false';
            //     $transMessage = "Gagal Reservasi";
            //     $result = array(
            //         "status" => 400,
            //         "message" => "Pasien hanya bisa melakukan pendaftaran sebelum jam 12 siang",
            //     );
            //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            // }
            // return($tglNextDay);
            // die();
            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $tglsekarang =  date('Y-m-d');
            if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // return('test');
            // die();
            
            if($request['tipePembayaran']){
                $tipepembayaran = $request['tipePembayaran']['id'];
                // $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                //     ->select('apr.norec','apr.tanggalreservasi')
                //     ->whereRaw("apr.tanggalreservasi = '$tgl'")
                //     ->where('apr.objectruanganfk', $request['poliKlinik']['id'])
                //     ->where('apr.noreservasi','!=','-')
                //     ->whereNotNull('apr.noreservasi')
                //     ->where('apr.statusenabled',true)
                //     ->get();
                // if(count($dataReservasi) > 0){
                //     $result = array(
                //         "status" => 400,
                //         "message" => 'Tidak bisa Reservasi, Coba di jadwal yang lain',
                //     );
                //     return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                // }
            }else{
                $tipepembayaran = $request['tipePembayaranTelemedicine']['id'];
                Pasien::where('nocm', $request['noCm'])->update(['notelepon'=>$request['noTelpon'],'alamatdomisili'=>$request['domisili']]);
            }
           


            if($request ['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            }
            if(isset($pasien) && !empty($pasien)){
                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.nocmfk',$pasien->id)
                ->where('apr.statusenabled',true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAkhir);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if(count($ceksudahdaftar) > 0){
                    $result = array(
                        "status" => 400,
                        "message" => 'Tidak bisa Reservasi di Tgl yang sama, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                }
            }
           
            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik']['id'];
            $newptp->objectjeniskelaminfk =$request ['jenisKelamin']['id'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request ['tglReservasiFix'];
            $newptp->tgllahir= $request ['tglLahir'];
            $newptp->objectkelompokpasienfk= $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk= $request['asalRujukan']['id'];
            if($tipepembayaran == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
            }
            $newptp->notelepon= $request['noTelpon'];
            $newptp->objectpegawaifk=  ($request['dokter']?$request['dokter']['id']:null);

            if( $request ['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            }else{
                if( $request ['isTelemedicine'] == true) {
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                    $newptp->istelemedicine = 1;
                }else{
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                }
            }
//            $newptp->objectasalrujukanfk = 0;
//            $newptp->objectstrukreturfk= 0;
//            $newptp->objecttitlefk= 0;
//            $newptp->isconfirm= 0;
//            $newptp->jenis = $request['datas']['norecpap'];
//            $newptp->statuspanggil = 0;
            if(isset($pasien) && !empty($pasien)){
                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }   
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;
        
                $newptp->noaditional= $pasien->noaditional;
//                $newptp->noantrian= 0;
                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;
            }
            if(isset($request['namaPenjamin']) && $request['namaPenjamin'] != "" && $request['namaPenjamin'] != "undefined" && $request['namaPenjamin'] != "null") {
                $newptp->objectrekananfk=  $request['namaPenjamin']['id'];
            }
            $newptp->save();
            $transStatus = 'true';

            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveReservasiMcu(Request $request)
    {
        DB::beginTransaction();
        try {
            

            // if($tglA==$tglsekarang){
                // DB::rollBack();
                // $transStatus = 'false';
                // $transMessage = "Gagal Reservasi";
                // $result = array(
                //     "status" => 400,
                //     "message" => "Reservasi di Tutup Dulu.",
                // );
                // return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            // }


            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $tglsekarang =  date('Y-m-d');
            if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

             $countKuota = \DB::table('antrianpasienregistrasi_t as pdv')
                ->select('pdv.norec')
                ->where('pdv.tanggalreservasi', 'like', '%'. $tglA .'%')
                ->where('pdv.statusenabled',true)
                ->where('pdv.objectruanganfk',322)
                ->whereNotNull('pdv.nocmfk')
                ->get();
    
          
                if (count($countKuota) > 240) {
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Slot MCU sudah Penuh di Tanggal ini, Coba dihari lain.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            // return('test');
            // die();
            
            if($request['tipePembayaran']){
                $tipepembayaran = $request['tipePembayaran'];
                // $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                //     ->select('apr.norec','apr.tanggalreservasi')
                //     ->whereRaw("apr.tanggalreservasi = '$tgl'")
                //     ->where('apr.objectruanganfk', $request['poliKlinik']['id'])
                //     ->where('apr.noreservasi','!=','-')
                //     ->whereNotNull('apr.noreservasi')
                //     ->where('apr.statusenabled',true)
                //     ->get();
                // if(count($dataReservasi) > 0){
                //     $result = array(
                //         "status" => 400,
                //         "message" => 'Tidak bisa Reservasi, Coba di jadwal yang lain',
                //     );
                //     return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                // }
            }else{
                $tipepembayaran = $request['tipePembayaranTelemedicine']['id'];
                Pasien::where('nocm', $request['noCm'])->update(['notelepon'=>$request['noTelpon'],'alamatdomisili'=>$request['domisili']]);
            }
           


            if($request ['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            }
            if(isset($pasien) && !empty($pasien)){
                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.nocmfk',$pasien->id)
                ->where('apr.statusenabled',true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAkhir);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if(count($ceksudahdaftar) > 0){
                    $result = array(
                        "status" => 400,
                        "message" => 'Tidak bisa Reservasi di Tgl yang sama, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                }
            }
           
            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik'];
            $newptp->objectjeniskelaminfk =$request ['jenisKelamin'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request ['tglReservasiFix'];
            $newptp->tgllahir= $request ['tglLahir'];
            $newptp->objectkelompokpasienfk= $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk= $request['asalRujukan'];
            if($tipepembayaran == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
            }
            $newptp->notelepon= $request['noTelpon'];
            $newptp->objectpegawaifk=  ($request['dokter']?$request['dokter']['id']:null);

            if( $request ['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            }else{
                if( $request ['isTelemedicine'] == true) {
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                    $newptp->istelemedicine = 1;
                }else{
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                }
            }
//            $newptp->objectasalrujukanfk = 0;
//            $newptp->objectstrukreturfk= 0;
//            $newptp->objecttitlefk= 0;
//            $newptp->isconfirm= 0;
//            $newptp->jenis = $request['datas']['norecpap'];
//            $newptp->statuspanggil = 0;
            if(isset($pasien) && !empty($pasien)){
                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }   
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;
        
                $newptp->noaditional= $pasien->noaditional;
//                $newptp->noantrian= 0;
                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;
            }
            if(isset($request['namaPenjamin']) && $request['namaPenjamin'] != "" && $request['namaPenjamin'] != "undefined" && $request['namaPenjamin'] != "null") {
                $newptp->objectrekananfk=  $request['namaPenjamin'];
            }
            $newptp->paketmcufk =$request['paketMcu']['id'];
            $newptp->save();
            $transStatus = 'true';

            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveReservasiMcuPasienBaru(Request $request)
    {
        DB::beginTransaction();
        try {

            // DB::rollBack();
            //     $transStatus = 'false';
            //     $transMessage = "Gagal Reservasi";
            //     $result = array(
            //         "status" => 400,
            //         "message" => "Reservasi di Tutup Dulu.",
            //     );
            //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);

                
            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $tglsekarang =  date('Y-m-d');
            if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

             $countKuota = \DB::table('antrianpasienregistrasi_t as pdv')
                ->select('pdv.norec')
                ->where('pdv.tanggalreservasi', 'like', '%'. $tglA .'%')
                ->where('pdv.statusenabled',true)
                ->where('pdv.objectruanganfk',322)
                ->whereNull('pdv.nocmfk')
                ->get();
    
          
                if (count($countKuota) > 240) {
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Slot MCU sudah Penuh di Tanggal ini, Coba dihari lain.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            // return('test');
            // die();
            
            if($request['tipePembayaran']){
                $tipepembayaran = $request['tipePembayaran'];
            }else{
                // $tipepembayaran = $request['tipePembayaranTelemedicine']['id'];
                // Pasien::where('nocm', $request['noCm'])->update(['notelepon'=>$request['noTelpon'],'alamatdomisili'=>$request['domisili']]);
            }
           


            // if($request ['isBaru'] == false){
            //     $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            // }
            // if(isset($pasien) && !empty($pasien)){
                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.noidentitas',$request['nik'])
                ->where('apr.statusenabled',true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAkhir);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if(count($ceksudahdaftar) > 0){
                    $result = array(
                        "status" => 400,
                        "message" => 'Tidak bisa Reservasi di Tgl yang sama, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                }
            // }
            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik'];
            $newptp->objectjeniskelaminfk =$request ['jenisKelamin']['id'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request ['tglReservasiFix'];
            $newptp->tgllahir= $request ['tglLahir'];
            $newptp->objectkelompokpasienfk= $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk= $request['asalRujukan'];
            if($tipepembayaran == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
            }
            $newptp->notelepon= $request['noTelpon'];
            $newptp->objectpegawaifk=  ($request['dokter']?$request['dokter']['id']:null);
            $newptp->tipepasien = "BARU";
            $newptp->type = "BARU";
            $newptp->objectagamafk= $request['agama']['id'];
            $newptp->alamatlengkap= $request['alamat'];
            $newptp->objectdesakelurahanfk = $request['desa']['id'];
            $newptp->negara= $request['negara']['id'];
            $newptp->objectgolongandarahfk=  $request['golongandarah']['id'];
            $newptp->kebangsaan= $request['kebangsaan']['id'];
            $newptp->noidentitas= $request['nik'];
            $newptp->objectpekerjaanfk=  $request['pekerjaan']['id'];
            $newptp->objectpendidikanfk= $request['pendidikan']['id'];
            $newptp->objectstatusperkawinanfk=  $request['status']['id'];
            $newptp->tempatlahir= $request['tempatlahir'];
            if(isset($request['namaPenjamin']) && $request['namaPenjamin'] != "" && $request['namaPenjamin'] != "undefined" && $request['namaPenjamin'] != "null") {
                $newptp->objectrekananfk=  $request['namaPenjamin'];
            }
            $newptp->paketmcufk =$request['paketMcu']['id'];
            $newptp->kodepos =$request['kodepos'];
            $newptp->sukufk =$request['suku']['id'];
            $newptp->save();
            $transStatus = 'true';

            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePelapor(Request $request)
    {
        DB::beginTransaction();
        try {
            
            if($request['namaPelapor']=="null" || $request['namaPelapor']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Nama pelapor harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['domisili']=="null" || $request['domisili']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Domisili pelapor harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['hubungan']=="null" || $request['hubungan']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Hubungan pelapor harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['email']=="null" || $request['email']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "email pelapor harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['nohp']=="null" || $request['nohp']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "nohp pelapor harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['namaLengkap']=="null" || $request['namaLengkap']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Nama Lengkap Korban harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['namaAlias']=="null" || $request['namaAlias']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Nama Alias Korban harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['tglLahirHide']=="null" || $request['tglLahirHide']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Tanggal Lahir Korban harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['jenisKelamin']=="null" || $request['jenisKelamin']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Jenis Kelamin Korban harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['kebangsaan']=="null" || $request['kebangsaan']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Kebangsaan Korban harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['suku']=="null" || $request['suku']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Suku Korban harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['domisiliKorban']=="null" || $request['domisiliKorban']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Domisili Korban harus diisi",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['uploadFile']=="null" || $request['uploadFile']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "Upload Surat Keterangan RT/RW",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }else if($request['nameuploadFile']=="null" || $request['nameuploadFile']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Simpan";
                        $result = array(
                            "status" => 400,
                            "message" => "Upload Surat Keterangan RT/RW",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
//          return($request);
//          die();
            $newptp = new DviPelapor();
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = false;
            $newptp->nootp =substr(Uuid::generate(), 0, 13);
            $nootp = $newptp->nootp;
            $newptp->namapelapor=  $request['namaPelapor'];
            $newptp->domisili=  $request['domisili'];
            $newptp->objecthubunganfk=  $request['hubungan']['id'];
            $newptp->email=  $request['email'];
            $newptp->nohp=  $request['nohp'];
            $newptp->namakorban=  $request['namaLengkap'];
            $newptp->namaalias=  $request['namaAlias'];
            $newptp->tgllahir=  $request['tglLahirHide'];
            $newptp->objectjeniskelaminfk=  $request['jenisKelamin']['id'];
            $newptp->objectsukufk=  $request['suku']['id'];
            $newptp->objectkebangsaanfk=  $request['kebangsaan'];
            $newptp->domisilikorban=  $request['domisiliKorban'];
            $newptp->uploadfile=  $request['uploadFile'];
            $newptp->nameuploadfile=  $request['nameuploadFile'];
            $newptp->tglinput= $this->getDateTime()->format('Y-m-d H:i:s');
            $newptp->save();

            $transStatus = 'true';
            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "nootp" => $nootp,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
	public function saveRo(Request $request)
    {
        DB::beginTransaction();
        try {
           
            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $tglsekarang =  date('Y-m-d');

            if($request['noCm']=="null" || $request['noCm']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "NoRM Anda Tidak Terdaftar",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            
            if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // return('test');
            // die();
            
            if($request['tipePembayaran']){
                $tipepembayaran = $request['tipePembayaran']['id'];
            }else{
                $tipepembayaran = $request['tipePembayaranTelemedicine']['id'];
                Pasien::where('nocm', $request['noCm'])->update(['notelepon'=>$request['noTelpon'],'alamatdomisili'=>$request['domisili']]);
            }
 
            if($request ['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            }
            if(isset($pasien) && !empty($pasien)){
                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.nocmfk',$pasien->id)
                ->where('apr.statusenabled',true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAkhir);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if(count($ceksudahdaftar) > 0){
                    $result = array(
                        "status" => 400,
                        "message" => 'Tidak bisa Reservasi di Tgl yang sama, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                }
            }
           
            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik']['id'];
            $newptp->objectjeniskelaminfk =$request ['jenisKelamin']['id'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request ['tglReservasiFix'];
            $newptp->tgllahir= $request ['tglLahir'];
            $newptp->objectkelompokpasienfk= $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk= $request['asalRujukan']['id'];
            if($tipepembayaran == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
                // $objectrekananfk = 581367;
                $objectrekananfk = $request['namaPenjamin']['id'];
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
                $objectrekananfk = 0;
            }
            $newptp->notelepon= $request['noTelpon'];
            $newptp->objectpegawaifk=  ($request['dokter']?$request['dokter']['id']:null);

            if( $request ['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            }else{
                if( $request ['isTelemedicine'] == true) {
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                    $newptp->istelemedicine = 1;
                }else{
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                }
            }
//            $newptp->objectasalrujukanfk = 0;
//            $newptp->objectstrukreturfk= 0;
//            $newptp->objecttitlefk= 0;
           $newptp->isconfirm= 1;
//            $newptp->jenis = $request['datas']['norecpap'];
//            $newptp->statuspanggil = 0;
            if(isset($pasien) && !empty($pasien)){
                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }   
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;
        
                $newptp->noaditional= $pasien->noaditional;
//                $newptp->noantrian= 0;
                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;
            }
            
            // $tanggalDate = date('Y-m-d', strtotime($request['tglReservasiFix']));
            // return($tanggalDate);
            // die();
             $pasiendaftar = array(
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'tglregistrasidate'=> date('Y-m-d', strtotime($request['tglReservasiFix'])),
                'nocmfk'=> $pasien->id,
                'objectruanganfk'=> $request['poliKlinik']['id'],
                'objectdepartemenfk'=> 18,
                'objectkelasfk'=> 6,//nonkelas
                'objectkelompokpasienlastfk'=> $tipepembayaran,//umum
                'objectrekananfk'=> $objectrekananfk,
                'tipelayanan'=> 1,//reguler
                'objectpegawaifk'=> 1,
                'noregistrasi'=> '',
                'norec_pd'=> '',
                'israwatinap'=> 'false',
                'statusschedule'=> $noreservasi,
                'istelemedicine'=>'false',
                'jaminankhusus'=>'',
                'catatan'=>null,
                'objectruanganasalfk'=>$request['poliKlinik']['id'],
                'statuspasien'=>'LAMA',
                'objectkasuspenyakitlastfk'=> '1',
                'sensus'=>null
             );
             $antrianpasiendiperiksa = array(
                'norec_apd'=> '',
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'objectruanganfk'=> $request['poliKlinik']['id'],
                'objectkelasfk'=> 6,//nonkelas
                'objectpegawaifk'=> 1,
                'objectkamarfk'=> null,
                'nobed'=> null,
                'objectdepartemenfk'=> 18,
                'objectasalrujukanfk'=> 5,//Datang Sendiri
                'israwatgabung'=> 0,
             );
             $objSave = array(
                'pasiendaftar'=> $pasiendaftar,
                'antrianpasiendiperiksa'=> $antrianpasiendiperiksa
             );
            $Parsing = $this->saveRegistrasiPasien($objSave);
            // return($Parsing['status']);
            // die();
            if($Parsing['status']==400){
                $transStatus = 'false';
                $transMessage = $Parsing['message'];
                $e="";
            }else{
                $newptp->save();
                $push = array(
                    'noregistrasi'=> $Parsing['dataPD']['noregistrasi'],
                    'jenispasien'=> $tipepembayaran,
                    'idruangan'=> $request['poliKlinik']['id'],
                    'norec_apd'=> $Parsing['dataAPD']['norec'],
                    'idpegawai'=> 1,
                    'isDaftarKeDua'=> false
                );
                $karcis = $this->saveBiayaKarcis($push);
                $transStatus = 'true';
                $transMessage = "Simpan Reservasi";
            }
            
            
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRoTest(Request $request)
    {
        DB::beginTransaction();
        try {
           
            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $tglsekarang =  date('Y-m-d');

            $jamsekarang =  date('H');
            
            if($jamsekarang>'19'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Pendaftaran Bisa Dilakukan Mulai Pukul 00.00 - 20.00 !",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            if($tglA=='2021-07-20' || $tglA=='2021-08-10' || $tglA=='2021-08-11'
                || $tglA=='2021-08-17' || $tglA=='2021-08-21' || $tglA=='2021-08-22' || $tglA=='2021-08-28'
                || $tglA=='2021-08-29' || $tglA=='2021-10-20'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Tanggal ini hari libur.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            if($request['poliKlinik']['id']==253){
                if($tglA=='2021-12-13' || $tglA=='2021-12-14' || $tglA=='2021-12-20'
                    || $tglA=='2021-12-21'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            
            if($request['poliKlinik']['id']==543){
                if($tglA=='2021-12-31'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }

            $dataRuanganTutup = [];
            for ($i = 9 - 1; $i >= 0; $i--) {
                if($i==1){
                    $idruanganLibur = 33;
                }else if($i==2){
                    $idruanganLibur = 132;
                }else if($i==3){
                    $idruanganLibur = 198;
                }else if($i==4){
                    $idruanganLibur = 97;
                }else if($i==5){
                    $idruanganLibur = 7;
                }else if($i==6){
                    $idruanganLibur = 552;
                }else if($i==7){
                    $idruanganLibur = 446;
                }else if($i==8){
                    $idruanganLibur = 19;
                }else if($i==9){
                    $idruanganLibur = 19;
                }
                $dataRuanganTutup[] = array(
                    'idruangan' => $idruanganLibur
                );
            };
            $buka = 'false';
            foreach ($dataRuanganTutup as $itemd) {
                if($itemd['idruangan'] == $request['poliKlinik']['id']){
                    $buka = 'true';
                }
            }
             if($tglA=='2021-12-24'){
                if($buka=='false'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }

            $cekMapKelompok = \DB::table('mapkelompokpasientopenjamin_m as mkp')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'mkp.objectkelompokpasienfk')
            ->join('rekanan_m as rk', 'rk.id', '=', 'mkp.kdpenjaminpasien')
            ->select('rk.id', 'rk.namarekanan', 'kp.id as id_kelompokpasien', 'kp.kelompokpasien')
            //            ->where('mkp.objectkelompokpasienfk', $request['kdKelompokPasien'])
            ->where('mkp.statusenabled', true);
            if (isset($request['tipePembayaran']['id']) && $request['tipePembayaran']['id'] != "" && $request['tipePembayaran']['id'] != "undefined") {
                $cekMapKelompok = $cekMapKelompok->where('mkp.objectkelompokpasienfk', '=', $request['tipePembayaran']['id']);
                $cekMapKelompok = $cekMapKelompok->where('rk.id', '=', $request['namaPenjamin']['id']);
            };
            $cekMapKelompok = $cekMapKelompok->get();

            if (count($cekMapKelompok) == 0) {
                    $transMessage = "Silahkan Pilih Nama Penjamin Dengan Benar ";
                    DB::rollBack();
                    $result = array(
                        'status' => 400,
                        'as' => 'tukangKomputer',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            // return($cekMapKelompok);
            // die();

            // $tgl1 = new \DateTime("2021-07-07");
            // $tgl2 = new \DateTime($tglsekarang);
            // $d = $tgl2->diff($tgl1)->days + 1;
            //             return($d);
            //             die();

            if($request['noCm']=="null" || $request['noCm']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "NoRM Anda Tidak Terdaftar",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            
            if($request['tipePembayaran']['id']==2 && $request['asalRujukan']['id']!=7){
                $cekKepesertaan = $this->getNoPeserta($request['noKartuPeserta']);
                // return($cekKepesertaan);
                // die();
                if($cekKepesertaan['status']=='tidakada'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "No Peserta Tidak Ditemukan",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else if($cekKepesertaan['statusPeserta']=='25'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "USIA ANAK PPU > 21 TH DAN 25 TH, Silahkan Update Kepesertaan",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else{
                    if($request['asalRujukan']['id']==2){
                        $cekRujukan = $this->getNoRujukanRs($request['noRujukan']);
                        // return($cekRujukan);
                        // die();
                        if($cekRujukan['status']=='tidakada'){
                            DB::rollBack();
                            $transStatus = 'false';
                            $transMessage = "Gagal Reservasi";
                            $result = array(
                                "status" => 400,
                                "message" => "Data Rujukan Tidak Ditemukan",
                            );
                            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                        }else{
                            $tgl1 = new \DateTime($cekRujukan['tglKunjungan']);
                            $tgl2 = new \DateTime($tglA);
                            $d = $tgl2->diff($tgl1)->days + 1;
                            if($d>89){
                                DB::rollBack();
                                $transStatus = 'false';
                                $transMessage = "Gagal Reservasi";
                                $result = array(
                                    "status" => 400,
                                    "message" => "Nomor Rujukan Anda Sudah Habis",
                                );
                                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                            }
                        }
                    }else if($request['asalRujukan']['id']!=2){
                        $cekRujukan = $this->getNoRujukanPcare($request['noRujukan']);
                        // return($cekRujukan);
                        // die();
                        if($cekRujukan['status']=='tidakada'){
                            DB::rollBack();
                            $transStatus = 'false';
                            $transMessage = "Gagal Reservasi";
                            $result = array(
                                "status" => 400,
                                "message" => "Data Rujukan Tidak Ditemukan",
                            );
                            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                        }else{
                            $tgl1 = new \DateTime($cekRujukan['tglKunjungan']);
                            $tgl2 = new \DateTime($tglA);
                            $d = $tgl2->diff($tgl1)->days + 1;
                            if($d>90){
                                DB::rollBack();
                                $transStatus = 'false';
                                $transMessage = "Gagal Reservasi";
                                $result = array(
                                    "status" => 400,
                                    "message" => "Nomor Rujukan Anda Sudah Habis",
                                );
                                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                            }
                        }
                    }
                }
            }else if($request['tipePembayaran']['id']==2 && $request['asalRujukan']['id']==7){
                $cekKepesertaan = $this->getMonitoringHistori($request['noKartuPeserta']);
                return($cekKepesertaan);
                die();
                if($cekKepesertaan['status']=='tidakada'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "Sep Pasca Ranap Tidak Ada",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else{
                    $request['noRujukan'] = $request['noRujukan']." ".$cekKepesertaan['sepRanap'];
                }
            }
            // return($cekKepesertaan['status']);
            //     die();
            // return($d);
            // die();
            if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // return('test');
            // die();
            
            if($request['tipePembayaran']){
                $tipepembayaran = $request['tipePembayaran']['id'];
            }else{
                $tipepembayaran = $request['tipePembayaranTelemedicine']['id'];
                Pasien::where('nocm', $request['noCm'])->update(['notelepon'=>$request['noTelpon'],'alamatdomisili'=>$request['domisili']]);
            }
 
            if($request ['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            }
            if(isset($pasien) && !empty($pasien)){
                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.nocmfk',$pasien->id)
                ->where('apr.statusenabled',true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAkhir);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if(count($ceksudahdaftar) > 0){
                    $result = array(
                        "status" => 400,
                        "message" => 'Tidak bisa Reservasi di Tgl yang sama, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                }
            }

            

            $countNoAntrianJam = AntrianPasienDiperiksa::where('objectruanganfk', $request['poliKlinik']['id'])
                    ->where('tglregistrasi', '>=', $tglAwal)
                    ->where('tglregistrasi', '<=', $tglAkhir)
                    ->where('statusenabled', true)
                    ->max('noantrian');
            
            $noAntrianJam = $countNoAntrianJam;

            if($request['poliKlinik']['id']==253){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 15:30");
                $request['tglReservasiFix'] = $x;
            }else if($request['poliKlinik']['id']==543){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 15:30");
                $request['tglReservasiFix'] = $x;
            }else{
                if($noAntrianJam<2){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 08:00");
                $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<4){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:05");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<6){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:10");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<8){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:15");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<10){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:20");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<12){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:25");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<14){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:30");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<16){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:35");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<18){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:40");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<20){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:45");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<22){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:50");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<24){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:55");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<26){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:00");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<28){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:05");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<30){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:10");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<32){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:15");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<34){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:20");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<36){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:25");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<38){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:30");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<40){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:35");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<42){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:40");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<44){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:45");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<46){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:50");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<48){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:55");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<50){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 10:00");
                    $request['tglReservasiFix'] = $x;
                }else{
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 10:10");
                    $request['tglReservasiFix'] = $x;
                }
            }

            // return($request['tglReservasiFix']);
            // die();
           
            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik']['id'];
            $newptp->objectjeniskelaminfk =$request ['jenisKelamin']['id'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request ['tglReservasiFix'];
            $newptp->tgllahir= $request ['tglLahir'];
            $newptp->objectkelompokpasienfk= $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk= $request['asalRujukan']['id'];
            if($tipepembayaran == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
                // $objectrekananfk = 581367;
                $objectrekananfk = $request['namaPenjamin']['id'];
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
                $objectrekananfk = $request['namaPenjamin']['id'];
            }
            $newptp->notelepon= $request['noTelpon'];
            $newptp->objectpegawaifk=  ($request['dokter']?$request['dokter']['id']:null);

            if( $request ['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            }else{
                if( $request ['isTelemedicine'] == true) {
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                    $newptp->istelemedicine = 1;
                }else{
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                }
            }
//            $newptp->objectasalrujukanfk = 0;
//            $newptp->objectstrukreturfk= 0;
//            $newptp->objecttitlefk= 0;
           $newptp->isconfirm= 1;
//            $newptp->jenis = $request['datas']['norecpap'];
//            $newptp->statuspanggil = 0;
            if(isset($pasien) && !empty($pasien)){
                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }   
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;
        
                $newptp->noaditional= $pasien->noaditional;
//                $newptp->noantrian= 0;
                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;
            }
            
            // $tanggalDate = date('Y-m-d', strtotime($request['tglReservasiFix']));
            // return($tanggalDate);
            // die();
             $pasiendaftar = array(
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'tglregistrasidate'=> date('Y-m-d', strtotime($request['tglReservasiFix'])),
                'nocmfk'=> $pasien->id,
                'objectruanganfk'=> $request['poliKlinik']['id'],
                'objectdepartemenfk'=> 18,
                'objectkelasfk'=> 6,//nonkelas
                'objectkelompokpasienlastfk'=> $tipepembayaran,//umum
                'objectrekananfk'=> $objectrekananfk,
                'tipelayanan'=> 1,//reguler
                'objectpegawaifk'=> 1,
                'noregistrasi'=> '',
                'norec_pd'=> '',
                'israwatinap'=> 'false',
                'statusschedule'=> $noreservasi,
                'istelemedicine'=>'false',
                'jaminankhusus'=>'',
                'catatan'=>null,
                'objectruanganasalfk'=>$request['poliKlinik']['id'],
                'statuspasien'=>'LAMA',
                'objectkasuspenyakitlastfk'=> '1',
                'sensus'=>null
             );
             $antrianpasiendiperiksa = array(
                'norec_apd'=> '',
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'objectruanganfk'=> $request['poliKlinik']['id'],
                'objectkelasfk'=> 6,//nonkelas
                'objectpegawaifk'=> 1,
                'objectkamarfk'=> null,
                'nobed'=> null,
                'objectdepartemenfk'=> 18,
                'objectasalrujukanfk'=> 5,//Datang Sendiri
                'israwatgabung'=> 0,
             );
             $objSave = array(
                'pasiendaftar'=> $pasiendaftar,
                'antrianpasiendiperiksa'=> $antrianpasiendiperiksa
             );
            $Parsing = $this->saveRegistrasiPasien($objSave);
            // return($Parsing['status']);
            // die();
            if($Parsing['status']==400){
                $transStatus = 'false';
                $transMessage = $Parsing['message'];
                $e="";
            }else{
                $newptp->save();
                $push = array(
                    'noregistrasi'=> $Parsing['dataPD']['noregistrasi'],
                    'jenispasien'=> $tipepembayaran,
                    'idruangan'=> $request['poliKlinik']['id'],
                    'norec_apd'=> $Parsing['dataAPD']['norec'],
                    'idpegawai'=> 1,
                    'isDaftarKeDua'=> false
                );
                $karcis = $this->saveBiayaKarcis($push);
                $transStatus = 'true';
                $transMessage = "Simpan Reservasi";
            }
            
            
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRoPenjagaan(Request $request)
    {
        DB::beginTransaction();
        try {

           if($request['version']=="null" || $request['version']=="" || $request['version']!="V.20"){
            //    if($request['version']=="null" || $request['version']=="" || $request['version']!="V.20"){
            //     DB::rollBack();
            //             $transStatus = 'false';
            //             $transMessage = "Gagal Reservasi";
            //             $result = array(
            //                 "status" => 400,
            //                 "message" => "VERSI APLIKASI ANDA BELUM DI UPDATE, SILAHKAN UNINSTAL/HAPUS APLIKASI INI. SILAHKAN INSTAL ULANG APLIKASI TERBARU DI PLYSTORE (PENDAFTARAN ONLINE RS POLRI)",
            //             );
            //             return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            // }
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "VERSI APLIKASI ANDA BELUM DI UPDATE, SILAHKAN UNINSTAL/HAPUS APLIKASI INI. SILAHKAN INSTAL ULANG APLIKASI TERBARU DI PLYSTORE (PENDAFTARAN ONLINE RS POLRI)",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // return($request);
            // die();
            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $tglsekarang =  date('Y-m-d');

            $jamsekarang =  date('H');
            
            if($jamsekarang>'19'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Pendaftaran Bisa Dilakukan Mulai Pukul 00.00 - 20.00 !",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // return($jamsekarang);
            // die();

            if($tglA=='2021-07-20' || $tglA=='2021-08-10' || $tglA=='2021-08-11'
                || $tglA=='2021-08-17' || $tglA=='2021-08-21' || $tglA=='2021-08-22' || $tglA=='2021-08-28'
                || $tglA=='2021-08-29' || $tglA=='2021-10-20'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Tanggal ini hari libur.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            if($request['poliKlinik']['id']==253){
                if($tglA=='2021-12-13' || $tglA=='2021-12-14' || $tglA=='2021-12-15' || $tglA=='2021-12-16'
                    || $tglA=='2021-12-17' || $tglA=='2021-12-18' || $tglA=='2021-12-19' || $tglA=='2021-12-20'
                    || $tglA=='2021-12-21'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            
            if($request['poliKlinik']['id']==543){
                if($tglA=='2021-12-31'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            $dataRuanganTutup = [];
            for ($i = 9 - 1; $i >= 0; $i--) {
                if($i==1){
                    $idruanganLibur = 33;
                }else if($i==2){
                    $idruanganLibur = 132;
                }else if($i==3){
                    $idruanganLibur = 198;
                }else if($i==4){
                    $idruanganLibur = 97;
                }else if($i==5){
                    $idruanganLibur = 7;
                }else if($i==6){
                    $idruanganLibur = 552;
                }else if($i==7){
                    $idruanganLibur = 446;
                }else if($i==8){
                    $idruanganLibur = 19;
                }else if($i==9){
                    $idruanganLibur = 19;
                }
                $dataRuanganTutup[] = array(
                    'idruangan' => $idruanganLibur
                );
            };
            $buka = 'false';
            foreach ($dataRuanganTutup as $itemd) {
                if($itemd['idruangan'] == $request['poliKlinik']['id']){
                    $buka = 'true';
                }
            }
             if($tglA=='2021-12-24'){
                if($buka=='false'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }

            $cekMapKelompok = \DB::table('mapkelompokpasientopenjamin_m as mkp')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'mkp.objectkelompokpasienfk')
            ->join('rekanan_m as rk', 'rk.id', '=', 'mkp.kdpenjaminpasien')
            ->select('rk.id', 'rk.namarekanan', 'kp.id as id_kelompokpasien', 'kp.kelompokpasien')
            //            ->where('mkp.objectkelompokpasienfk', $request['kdKelompokPasien'])
            ->where('mkp.statusenabled', true);
            if (isset($request['tipePembayaran']['id']) && $request['tipePembayaran']['id'] != "" && $request['tipePembayaran']['id'] != "undefined") {
                $cekMapKelompok = $cekMapKelompok->where('mkp.objectkelompokpasienfk', '=', $request['tipePembayaran']['id']);
                $cekMapKelompok = $cekMapKelompok->where('rk.id', '=', $request['namaPenjamin']['id']);
            };
            $cekMapKelompok = $cekMapKelompok->get();

            if (count($cekMapKelompok) == 0) {
                    $transMessage = "Silahkan Pilih Nama Penjamin Dengan Benar ";
                    DB::rollBack();
                    $result = array(
                        'status' => 400,
                        'as' => 'tukangKomputer',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            // return($buka);
            // die();
            if($request['poliKlinik']['id']==543){
                if($tglA=='2021-12-15' || $tglA=='2021-12-17'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }

            // $tgl1 = new \DateTime("2021-07-07");
            // $tgl2 = new \DateTime($tglsekarang);
            // $d = $tgl2->diff($tgl1)->days + 1;
            //             return($d);
            //             die();

            if($request['noCm']=="null" || $request['noCm']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "NoRM Anda Tidak Terdaftar",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            
            if($request['tipePembayaran']['id']==2 && $request['asalRujukan']['id']!=7){
                $cekKepesertaan = $this->getNoPeserta($request['noKartuPeserta']);
                if($cekKepesertaan['status']=='tidakada'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "No Peserta Tidak Ditemukan",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else if($cekKepesertaan['statusPeserta']=='25'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "USIA ANAK PPU > 21 TH DAN 25 TH, Silahkan Update Kepesertaan",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else{
                    if($request['asalRujukan']['id']==2){
                        $cekRujukan = $this->getNoRujukanRs($request['noRujukan']);
                        // return($cekRujukan);
                        // die();
                        if($cekRujukan['status']=='tidakada'){
                            DB::rollBack();
                            $transStatus = 'false';
                            $transMessage = "Gagal Reservasi";
                            $result = array(
                                "status" => 400,
                                "message" => "Data Rujukan Tidak Ditemukan",
                            );
                            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                        }else{
                            $tgl1 = new \DateTime($cekRujukan['tglKunjungan']);
                            $tgl2 = new \DateTime($tglA);
                            $d = $tgl2->diff($tgl1)->days + 1;
                            if($d>89){
                                DB::rollBack();
                                $transStatus = 'false';
                                $transMessage = "Gagal Reservasi";
                                $result = array(
                                    "status" => 400,
                                    "message" => "Nomor Rujukan Anda Sudah Habis",
                                );
                                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                            }
                        }
                    }else if($request['asalRujukan']['id']!=2){
                        $cekRujukan = $this->getNoRujukanPcare($request['noRujukan']);
                        // return($cekRujukan);
                        // die();
                        if($cekRujukan['status']=='tidakada'){
                            DB::rollBack();
                            $transStatus = 'false';
                            $transMessage = "Gagal Reservasi";
                            $result = array(
                                "status" => 400,
                                "message" => "Data Rujukan Tidak Ditemukan",
                            );
                            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                        }else{
                            $tgl1 = new \DateTime($cekRujukan['tglKunjungan']);
                            $tgl2 = new \DateTime($tglA);
                            $d = $tgl2->diff($tgl1)->days + 1;
                            if($d>90){
                                DB::rollBack();
                                $transStatus = 'false';
                                $transMessage = "Gagal Reservasi";
                                $result = array(
                                    "status" => 400,
                                    "message" => "Nomor Rujukan Anda Sudah Habis",
                                );
                                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                            }
                        }
                    }
                }
            }else if($request['tipePembayaran']['id']==2 && $request['asalRujukan']['id']==7){
                $cekKepesertaan = $this->getMonitoringHistori($request['noKartuPeserta']);
                // return($cekKepesertaan['sepRanap']);
                // die();
                if($cekKepesertaan['status']=='tidakada'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "Sep Pasca Ranap Tidak Ada",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else{
                    $request['noRujukan'] = $request['noRujukan']." ".$cekKepesertaan['sepRanap'];
                }
            }
            // return($request['noRujukan']);
            // die();
            if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // return('test');
            // die();
            
            if($request['tipePembayaran']){
                $tipepembayaran = $request['tipePembayaran']['id'];
            }else{
                $tipepembayaran = $request['tipePembayaranTelemedicine']['id'];
                Pasien::where('nocm', $request['noCm'])->update(['notelepon'=>$request['noTelpon'],'alamatdomisili'=>$request['domisili']]);
            }
 
            if($request ['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            }
            if(isset($pasien) && !empty($pasien)){
                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.nocmfk',$pasien->id)
                ->where('apr.statusenabled',true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAkhir);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if(count($ceksudahdaftar) > 0){
                    $result = array(
                        "status" => 400,
                        "message" => 'Tidak bisa Reservasi di Tgl yang sama, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                }
            }

            $countNoAntrianJam = AntrianPasienDiperiksa::where('objectruanganfk', $request['poliKlinik']['id'])
                    ->where('tglregistrasi', '>=', $tglAwal)
                    ->where('tglregistrasi', '<=', $tglAkhir)
                    ->where('statusenabled', true)
                    ->max('noantrian');
            
            $noAntrianJam = $countNoAntrianJam;

            if($request['poliKlinik']['id']==253){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 15:30");
                $request['tglReservasiFix'] = $x;
            }else if($request['poliKlinik']['id']==543){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 15:30");
                $request['tglReservasiFix'] = $x;
            }else{
                if($noAntrianJam<2){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 08:00");
                $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<4){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:05");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<6){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:10");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<8){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:15");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<10){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:20");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<12){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:25");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<14){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:30");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<16){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:35");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<18){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:40");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<20){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:45");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<22){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:50");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<24){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:55");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<26){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:00");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<28){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:05");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<30){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:10");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<32){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:15");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<34){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:20");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<36){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:25");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<38){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:30");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<40){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:35");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<42){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:40");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<44){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:45");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<46){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:50");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<48){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:55");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<50){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 10:00");
                    $request['tglReservasiFix'] = $x;
                }else{
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 10:10");
                    $request['tglReservasiFix'] = $x;
                }
            }

            // return($request['tglReservasiFix']);
            // die();
            
           
            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik']['id'];
            $newptp->objectjeniskelaminfk =$request ['jenisKelamin']['id'];
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request ['tglReservasiFix'];
            $newptp->tgllahir= $request ['tglLahir'];
            $newptp->objectkelompokpasienfk= $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $request['namaPasien'];
            $newptp->noidentitas=  $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk= $request['asalRujukan']['id'];
            if($tipepembayaran == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
                // $objectrekananfk = 581367;
                $objectrekananfk = $request['namaPenjamin']['id'];
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
                $objectrekananfk = $request['namaPenjamin']['id'];
            }
            $newptp->notelepon= $request['noTelpon'];
            $newptp->objectpegawaifk=  ($request['dokter']?$request['dokter']['id']:null);

            if( $request ['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            }else{
                if( $request ['isTelemedicine'] == true) {
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                    $newptp->istelemedicine = 1;
                }else{
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                }
            }
//            $newptp->objectasalrujukanfk = 0;
//            $newptp->objectstrukreturfk= 0;
//            $newptp->objecttitlefk= 0;
           $newptp->isconfirm= 1;
//            $newptp->jenis = $request['datas']['norecpap'];
//            $newptp->statuspanggil = 0;
            if(isset($pasien) && !empty($pasien)){
                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }   
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;
        
                $newptp->noaditional= $pasien->noaditional;
//                $newptp->noantrian= 0;
                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;
            }
            
            // $tanggalDate = date('Y-m-d', strtotime($request['tglReservasiFix']));
            // return($tanggalDate);
            // die();
             $pasiendaftar = array(
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'tglregistrasidate'=> date('Y-m-d', strtotime($request['tglReservasiFix'])),
                'nocmfk'=> $pasien->id,
                'objectruanganfk'=> $request['poliKlinik']['id'],
                'objectdepartemenfk'=> 18,
                'objectkelasfk'=> 6,//nonkelas
                'objectkelompokpasienlastfk'=> $tipepembayaran,//umum
                'objectrekananfk'=> $objectrekananfk,
                'tipelayanan'=> 1,//reguler
                'objectpegawaifk'=> 1,
                'noregistrasi'=> '',
                'norec_pd'=> '',
                'israwatinap'=> 'false',
                'statusschedule'=> $noreservasi,
                'istelemedicine'=>'false',
                'jaminankhusus'=>'',
                'catatan'=>null,
                'objectruanganasalfk'=>$request['poliKlinik']['id'],
                'statuspasien'=>'LAMA',
                'objectkasuspenyakitlastfk'=> '1',
                'sensus'=>null
             );
             $antrianpasiendiperiksa = array(
                'norec_apd'=> '',
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'objectruanganfk'=> $request['poliKlinik']['id'],
                'objectkelasfk'=> 6,//nonkelas
                'objectpegawaifk'=> 1,
                'objectkamarfk'=> null,
                'nobed'=> null,
                'objectdepartemenfk'=> 18,
                'objectasalrujukanfk'=> 5,//Datang Sendiri
                'israwatgabung'=> 0,
             );
             $objSave = array(
                'pasiendaftar'=> $pasiendaftar,
                'antrianpasiendiperiksa'=> $antrianpasiendiperiksa
             );
            $Parsing = $this->saveRegistrasiPasien($objSave);
            // return($Parsing['status']);
            // die();
            if($Parsing['status']==400){
                $transStatus = 'false';
                $transMessage = $Parsing['message'];
                $e="";
            }else{
                $newptp->save();
                $push = array(
                    'noregistrasi'=> $Parsing['dataPD']['noregistrasi'],
                    'jenispasien'=> $tipepembayaran,
                    'idruangan'=> $request['poliKlinik']['id'],
                    'norec_apd'=> $Parsing['dataAPD']['norec'],
                    'idpegawai'=> 1,
                    'isDaftarKeDua'=> false
                );
                $karcis = $this->saveBiayaKarcis($push);
                $transStatus = 'true';
                $transMessage = "Simpan Reservasi";
            }
            
            
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function getNoPeserta($request) {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $tglAyeuna =  date('Y-m-d');

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."Peserta/nokartu/".$request."/tglSEP/".$tglAyeuna,
//            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nik/".$request['nik']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp,
                "user_key:".$userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        // return($result);
        // die();
        $key=$data.$secretKey.(string)$tStamp;
        $x=$this->stringDecryptVclaimStausPeserta($key,$result);
        // return $this->respond($this->stringDecryptVclaim($key,$result));
        if($x['metaData']->code=='201'){
            $result = array(
                "status" => "tidakada",
            );
        }else{
            $result = array(
                "status" => "ada",
                "statusPeserta" => $x['response'],
            );
        }
        return($result);
    }
    function stringDecryptVclaimStausPeserta($key,$string)
    {   
       
        $bahan=$string['response'];
        $metadata=$string['metaData'];
    //    return($bahan);
    //    die();
        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));
  
        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        $x= \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = (array) json_decode($x);
        // return($metadata);
        // die();
        if($metadata->code!=200){
            $result=null;
        }
        $data2 = array(
            'metaData'=>$metadata, 
            'response'=>$result['peserta']->statusPeserta->kode,
        );
        return $data2;
    }
    function getMonitoringHistori($noKartu) {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $tglMulai = Carbon::now()->subMonth(5)->format('Y-m-d');
//        return $this->respond($tglMulai);
        $tglAkhir = Carbon::now()->format('Y-m-d');

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL =>$this->getUrlBrigdingBPJSV2()."monitoring/HistoriPelayanan/NoKartu/".$noKartu."/tglMulai/".$tglMulai."/tglAkhir/".$tglAkhir,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp,
                "user_key:".$userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        if($result['metaData']->code=='201'){
            $result = array(
                "status" => "tidakada",
            );
        }else{
            $key=$data.$secretKey.(string)$tStamp;
            $bahan=$result['response'];
            // $metadata=$string['metaData'];
        //    return($bahan);
        //    die();
            $encrypt_method = 'AES-256-CBC';

            // hash
            $key_hash = hex2bin(hash('sha256', $key));
    
            // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
            $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

            $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

            $x= \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
            $result = (array) json_decode($x);
            
            $sepRanap="";
            // return($result['histori']);
            // die();
            foreach ($result['histori'] as $item) {
                if($sepRanap==""){
                    if($item->jnsPelayanan=="2" && $item->ppkPelayanan=="Rumah Sakit Unand"){
                        $result = array(
                            "status" => "tidakada",
                        );
                        return($result);
                    }
                    if($item->jnsPelayanan=="1" && $item->ppkPelayanan=="Rumah Sakit Unand"){
                        $sepRanap=$item->noSep;
                    }
                }
            }
            if($sepRanap==""){
                $result = array(
                    "status" => "tidakada",
                );
            }else{
                 $result = array(
                    "status" => "ada",
                    "sepRanap" => $sepRanap,
                );   
            }
        }
        return($result);
    }
    function stringDecryptVclaimNoRujukan($key,$string)
    {   
       
        $bahan=$string['response'];
        $metadata=$string['metaData'];
    //    return($bahan);
    //    die();
        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));
  
        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        $x= \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = (array) json_decode($x);
        // return($metadata);
        // die();
        if($metadata->code!=200){
            $result=null;
        }
        $data2 = array(
            'metaData'=>$metadata, 
            "tglKunjungan" => $result['rujukan']->tglKunjungan,
            "poliRujukan" => $result['rujukan']->poliRujukan->kode,
        );
        return $data2;
    }
    function getNoRujukanRs($request) {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."Rujukan/RS/".$request,
//            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nik/".$request['nik']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp,
                "user_key:".$userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        // return($result['metaData']);
        // die();
        $key=$data.$secretKey.(string)$tStamp;
        $x=$this->stringDecryptVclaimNoRujukan($key,$result);
        if($x['metaData']->code=='201'){
            $result = array(
                "status" => "tidakada",
            );
        }else{
            $result = array(
                "status" => "ada",
                "tglKunjungan" => $x['tglKunjungan'],
                "poliRujukan" => $x['poliRujukan'],
            );
        }
        return($result);
        // return $this->respond($result);
    }
    function getNoRujukanPcare($request) {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."Rujukan/".$request,
//            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nik/".$request['nik']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp,
                "user_key:".$userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        // return($result);
        // die();
        $key=$data.$secretKey.(string)$tStamp;
        $x=$this->stringDecryptVclaimNoRujukan($key,$result);
        if($x['metaData']->code=='201'){
            $result = array(
                "status" => "tidakada",
            );
        }else{
            $result = array(
                "status" => "ada",
                "tglKunjungan" => $x['tglKunjungan'],
                "poliRujukan" => $x['poliRujukan'],
            );
        }
        return($result);
        // return $this->respond($result);
    }
    function saveRegistrasiPasien($request)
    {
        // return($request['pasiendaftar']);
        // die();
        $noRegistrasiSeq = $this->generateCodeBySeqTable(new PasienDaftar, 'noregistrasi', 10, date('ym'));
        $noAntrian = 0;
        if ($noRegistrasiSeq == '') {
            $transMessage = 400;
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return ($result);
        }

        $r_NewPD = $request['pasiendaftar'];
        $r_NewAPD = $request['antrianpasiendiperiksa'];
        // return($r_NewPD);
        // die();
        // Penjagaan Tidak Bisa Edit Beda Departemen
        if ($r_NewPD['norec_pd'] != '' && $r_NewAPD['norec_apd'] != '') {

            $apdDepar = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                // ->leftjoin('diagnosapasien_t as dg','dg.noregistrasifk','=','apd.norec')
                ->select('ru.objectdepartemenfk', 'apd.norec', 'apd.objectruanganfk')
                ->where('apd.norec', $r_NewAPD['norec_apd'])
                //                ->where('apd.objectruanganfk', $request['data']['objectruanganlastfk'])
                //                ->wherenull('apd.tglkeluar')
                ->where('apd.statusenabled', true)
                ->get();

            
            if ($apdDepar[0]->objectdepartemenfk != $r_NewAPD['objectdepartemenfk']) {
                $transMessage = 'Patienten können nicht mit verschiedenen Abteilungen bearbeitet werden.';
                $result = array(
                    "status" => 400,
                    "message"  => $transMessage,
                    "as" => 'as@epic',
                );
                return ($result);
            }
        }


        $catatan = $r_NewPD['catatan'];
        if ($r_NewPD['israwatinap'] == 'true') {
            $isRawatInap = 'true';
        } else {
            $isRawatInap = 'false';
        }
        DB::beginTransaction();


        if ($r_NewPD['objectruanganfk'] == 251) {
            $cekUdahDaftar = 0;
        } else {
            $cekUdahDaftar = PasienDaftar::where('nocmfk', $r_NewPD['nocmfk'])
                ->wherenull('tglpulang')
                ->count();
            $cekKelompok = PasienDaftar::where('noregistrasi', $r_NewPD['noregistrasi'])
                ->select('objectkelompokpasienlastfk')
                ->get();
        }
        if ($cekUdahDaftar > 0 && $r_NewPD['norec_pd'] == '') {
            $transStatus = 'belumdipulangkan';
        } else {
            // try{
            //region Save PasienDaftar
            $DianNgimpi = \DB::table('pasiendaftar_t as pd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->select('ru.namaruangan')
                ->where('pd.nocmfk', $r_NewPD['nocmfk'])
                ->where('ru.objectdepartemenfk', 18)
                ->where('pd.statusenabled', 1)
                ->get();
            if (count($DianNgimpi) == 0) {
                $DianNgimpi = \DB::table('pasiendaftar_t as pd')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                    ->select('ru.namaruangan')
                    ->where('pd.nocmfk', $r_NewPD['nocmfk'])
                    ->where('ru.objectdepartemenfk', '<>', 18)
                    ->orderBy('pd.noregistrasi', 'desc')
                    ->where('pd.statusenabled', 1)
                    ->take(1)
                    ->get();
                if (count($DianNgimpi) > 0) {
                    foreach ($DianNgimpi as $itemDian) {
                        $catatan = $catatan . ' Pasien ini belum pernah daftar ke Poli, baru ke ' . $itemDian->namaruangan;
                    }
                } else {
                    $catatan = $catatan . ' Pasien ini belum pernah daftar di aplikasi TM';
                }
            }

            if ($r_NewPD['norec_pd'] == '') {
                $dataPD = new PasienDaftar();
                $dataPD->norec = $dataPD->generateNewId();
                $dataPD->kdprofile = 1;
                $dataPD->statusenabled = true;
                $noRegistrasi = $noRegistrasiSeq; //$this->generateNoReg(new PasienDaftar, 'noregistrasi', 10, date('ym'));//$this->getMaxNoregistrasi();
                $dataPD->objectruanganasalfk = $r_NewPD['objectruanganasalfk'];
                $dataPD->nocmfk = $r_NewPD['nocmfk'];
                $dataPD->statuskirimdokumen = NULL;
            } else {
                $apd = \DB::table('antrianpasiendiperiksa_t as apd')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    // ->leftjoin('diagnosapasien_t as dg','dg.noregistrasifk','=','apd.norec')
                    ->select('ru.objectdepartemenfk', 'apd.norec', 'apd.objectruanganfk')
                    ->where('apd.noregistrasifk', $r_NewPD['norec_pd'])
                    //                ->where('apd.objectruanganfk', $request['data']['objectruanganlastfk'])
                    //                ->wherenull('apd.tglkeluar')
                    ->where('ru.objectdepartemenfk', 16)
                    ->get();

                if ($cekKelompok[0]->objectkelompokpasienlastfk == $r_NewPD['objectkelompokpasienlastfk']) {
                    if (count($apd) > 2) {
                        $transMessage = 'Tidak Bisa Edit Registrasi , pasien sudah mendapatkan lebih dari 1 ruangan Rawat !';
                        $result = array(
                            "status" => 400,
                            "message"  => $transMessage,
                            "as" => 'as@epic',
                        );
                        return ($result);
                    }
                }
                $dataPD =  PasienDaftar::where('norec', $r_NewPD['norec_pd'])->first();
                if ($r_NewPD['nocmfk'] != $dataPD->nocmfk) {
                    $transStatus = 'false';
                }
                $noRegistrasi = $dataPD->noregistrasi;
                //          $delAntrian = AntrianPasienDiperiksa::where('noregistrasifk', $r_NewPD['norec_pd'])
                //                ->delete();
                if ($dataPD->objectruanganlastfk != $r_NewPD['objectruanganfk']) {
                    $deltracer = Tracer::where('noregistrasi', $noRegistrasi)
                        ->delete();
                    $delkendali = KendaliDokumenRekamMedis::where('noregistrasifk', $r_NewAPD['norec_apd'])
                        ->delete();

                    $ru =  Ruangan::where('id', $dataPD->objectruanganlastfk)->first();
                    $catatan = 'Poli Sebelummnya ' . $ru->namaruangan;
                    $dataPD->statuskirimdokumen = NULL;
                }

                if ($isRawatInap == 'true') {
                    $delRegistrasiPelPasien = RegistrasiPelayananPasien::where('noregistrasifk', $r_NewPD['norec_pd'])
                        ->where('objectruanganfk', $r_NewPD['objectruanganfk'])
                        ->delete();
                }
            }
            if ($r_NewPD['istelemedicine'] == 'true') {
                $dataPD->istelemedicine = 1;
            }
            $dataPD->objectruanganlastfk = $r_NewPD['objectruanganfk'];
            $dataPD->objectdokterpemeriksafk =  $r_NewPD['objectpegawaifk'];
            $dataPD->objectpegawaifk = $r_NewPD['objectpegawaifk'];
            $dataPD->iskajianawal = false;
            $dataPD->isonsiteservice = 0;
            $dataPD->isregistrasilengkap = 0;
            $dataPD->jenispelayanan = $r_NewPD['tipelayanan'];
            // $dataPD->objectkasuspenyakitlastfk = 1;
            $dataPD->objectkasuspenyakitlastfk = null; //$r_NewPD['objectkasuspenyakitlastfk'];
            if ($isRawatInap == 'true') {
                $dataPD->objectkelasfk = $r_NewPD['objectkelasfk'];
                $dataPD->tglpulang = null;
            } else {
                $dataPD->objectkelasfk = (int)$this->settingDataFixed('kdKelasNonKelasRegistrasi');
                $dataPD->tglpulang =  $r_NewPD['tglregistrasi'];
            }
            $dataPD->objectkelompokpasienlastfk = $r_NewPD['objectkelompokpasienlastfk'];
            $dataPD->objectrekananfk = $r_NewPD['objectrekananfk'];
            $dataPD->statuskasuspenyakit = false;
            
            if (isset($r_NewPD['statuspasien'])) {
                $dataPD->statuspasien = $r_NewPD['statuspasien']; //$statusPasien;
            } else {
                $dataPD->statuspasien = 'BARU';
            }

            if (isset($r_NewPD['statusschedule'])) {
                $dataPD->statusschedule = $r_NewPD['statusschedule'];
            }
            $dataPD->tglregistrasi =  $r_NewPD['tglregistrasi'];
            // $dataPD->objectjaminankhusus =  $r_NewPD['jaminankhusus'];
            // $dataPD->sensus =  $r_NewPD['sensus'];
            // $dataPD->catatan =  $catatan;


            $dataPD->noregistrasi = $noRegistrasi;
            $dataPD->save();
            $dataPDnorec = $dataPD->norec;
            $dataStatusPasien = $dataPD->statuspasien;
            //endregion
            //region Save AntrianPasienDiperiksa


            if ($r_NewAPD['norec_apd'] == '') {
                $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                    ->where('tglregistrasi', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00')
                    ->where('tglregistrasi', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59')
                    ->where('statusenabled', true)
                    ->max('noantrian');
                $noAntrian = $countNoAntrian + 1;
                //                    return $noAntrian;
                $dataAPD = new AntrianPasienDiperiksa;
                $dataAPD->norec = $dataAPD->generateNewId();
                $dataAPD->kdprofile = 1;
                $dataAPD->statusenabled = true;
                $dataAPD->noantrian = $noAntrian;
                //                    $dataAPD->objectruanganfk = $r_NewAPD['objectruanganfk'];
            } else {
                $dataAPD =  AntrianPasienDiperiksa::where('norec', $r_NewAPD['norec_apd'])->first();
                if ($r_NewPD['objectruanganfk'] != $dataAPD->objectruanganfk) {
                    $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                        ->where('tglregistrasi', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00')
                        ->where('tglregistrasi', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59')
                        ->where('statusenabled', true)
                        ->max('noantrian');
                    $noAntrian = $countNoAntrian + 1;
                    $dataAPD->noantrian = $noAntrian;
                } else if ($r_NewAPD['tglregistrasi'] != $dataAPD->tglregistrasi) {
                    $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $r_NewPD['objectruanganfk'])
                        ->where('tglregistrasi', '>=', $r_NewPD['tglregistrasidate'] . ' 00:00')
                        ->where('tglregistrasi', '<=', $r_NewPD['tglregistrasidate'] . ' 23:59')
                        ->where('statusenabled', true)
                        ->max('noantrian');
                    $noAntrian = $countNoAntrian + 1;
                    $dataAPD->noantrian = $noAntrian;
                }
                AntrianPasienDiperiksa::where('noregistrasifk', $dataPD->norec)
                    ->where('norec', '<>', $r_NewAPD['norec_apd'])
                    ->whereNotNull('objectruanganasalfk')
                    ->update(['objectruanganasalfk' => $r_NewPD['objectruanganfk']]);
                //kosongkan
                if ($isRawatInap == 'true') {
                    TempatTidur::where('id', $dataAPD->nobed)->update(['objectstatusbedfk' => 2]);
                }
            }
            //count tgl pasien perruanga
            $dataAPD->objectasalrujukanfk =  $r_NewAPD['objectasalrujukanfk'];
            $dataAPD->objectkamarfk = $r_NewAPD['objectkamarfk'];
            $dataAPD->objectkasuspenyakitfk = null;
            $dataAPD->objectruanganfk = $r_NewPD['objectruanganfk'];
            if ($isRawatInap == 'true') {
                $dataAPD->objectkelasfk = $r_NewAPD['objectkelasfk'];
                $dataAPD->tglkeluar = null;
                $ru =  Ruangan::where('id', $r_NewPD['objectruanganfk'])->first();
                if ($ru->objectruanganfk == '19') {
                    $dataAPD->objectkasuspenyakitfk = '19';
                }
            } else {
                $dataAPD->objectkelasfk = (int)$this->settingDataFixed('kdKelasNonKelasRegistrasi');
                $dataAPD->tglkeluar = $r_NewPD['tglregistrasi'];
            }
            $dataAPD->nobed = $r_NewAPD['nobed'];
            $dataAPD->noregistrasifk = $dataPDnorec;
            $dataAPD->objectpegawaifk = $r_NewAPD['objectpegawaifk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuskunjungan = $dataStatusPasien;
            $dataAPD->statuspasien = 1;
            $dataAPD->tglregistrasi =  $r_NewAPD['tglregistrasi'];
            $dataAPD->tglmasuk = $r_NewAPD['tglregistrasi'];
            $dataAPD->israwatgabung = $r_NewAPD['israwatgabung'];
            //region Dibuang Sayang Oge
          
            //endregion
            $dataAPD->save();
           
            //endregion
            $transStatus = 'true';
            // } catch (\Exception $e) {
            //     $transStatus = 'false';
            // }
        }

        if ($transStatus == 'belumdipulangkan') {
            $transMessage = 'Pasien Belum Dipulangkan';
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ramdanegie',
            );
        } else if ($transStatus == 'true') {
            $transMessage = 'SUKSES';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPD' => $dataPD,
                'dataAPD' => $dataAPD,
                //                "double" => count($cek),
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = 'Simpan Registrasi Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'dataPD' => $dataPD,
                'as' => 'ramdanegie',
            );
        }
        return($result);
        // return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function saveBiayaKarcis($request)
    {
        DB::beginTransaction();

        $noregistrasi = $request['noregistrasi'];
        $jenispasien = $request['jenispasien'];
        $idruangan = $request['idruangan'];
        $idpegawai = $request['idpegawai'];
        $statuspasien = 'LAMA';
        try {
            if ($idruangan == '322222' ) {
                $transStatus = 'true';
            } else {       
                    if ($statuspasien == 'LAMA'){
                        if ($idruangan == '27' || $idruangan == '31'  ) {
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090231,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090789,
                                'pegawaifk'=>$idpegawai,
                                'objectjenispetugaspefk'=>4
                            );
                        }else if ($idruangan == '462' || $idruangan == '12'|| $idruangan == '20'
                                || $idruangan == '796'|| $idruangan == '255'|| $idruangan == '447'){
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090231,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                        }else if ($idruangan == '569'){
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090233,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090237,
                                'pegawaifk'=>$idpegawai,
                                'objectjenispetugaspefk'=>4
                            );
                        }else{
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090231,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090251,
                                'pegawaifk'=>$idpegawai,
                                'objectjenispetugaspefk'=>4
                            );
                        }
                    }else{
                        if ($idruangan == '27' || $idruangan == '31'  ) {
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090230,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090789,
                                'pegawaifk'=>$idpegawai,
                                'objectjenispetugaspefk'=>4
                            );
                        }else if ($idruangan == '462' || $idruangan == '12'|| $idruangan == '20'
                                || $idruangan == '796'|| $idruangan == '255'|| $idruangan == '447'){
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090230,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                        }else if ($idruangan == '569'){
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090232,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090237,
                                'pegawaifk'=>$idpegawai,
                                'objectjenispetugaspefk'=>4
                            );
                        }else{
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090230,
                                'pegawaifk'=>4000442,
                                'objectjenispetugaspefk'=>2
                            );
                            $arrayProdukPegawai[]= array(
                                'produkfk'=>5090251,
                                'pegawaifk'=>$idpegawai,
                                'objectjenispetugaspefk'=>4
                            );
                        }
                    }
                   
                    // return($arrayProdukPegawai);
                    // die();
                    foreach ($arrayProdukPegawai as $itemsave) {
                    //     return($itemsave['produkfk']);
                    // die();
                        $komponenHarga = \DB::table('harganettoprodukbykelasd_m as hnp')
                            ->join('mapruangantoproduk_m as mpr ', 'mpr.objectprodukfk', '=', 'hnp.objectprodukfk')
                            ->join('produk_m as prd', 'prd.id', '=', 'mpr.objectprodukfk')
                            ->join('komponenharga_m as kh', 'kh.id', '=', 'hnp.objectkomponenhargafk')
                            ->join('kelas_m as kls', 'kls.id', '=', 'hnp.objectkelasfk')
                            ->join('ruangan_m as ru', 'ru.id', '=', 'mpr.objectruanganfk')
                            ->select('hnp.objectkomponenhargafk', 'kh.komponenharga', 'hnp.hargasatuan', 'mpr.objectprodukfk', 'kh.iscito')
                            ->where('mpr.objectruanganfk', $request['idruangan'])
                            ->where('hnp.objectkelasfk', '6')
                            ->where('mpr.objectprodukfk', $itemsave['produkfk'])
                            ->where('hnp.objectjenispelayananfk', '1')
                            ->where('mpr.statusenabled', true)
                            ->where('hnp.statusenabled', true)
                            ->where('prd.statusenabled', true)
                            ->get();
                        //dd($komponenHarga);


                        $totalHargaSatuan = 0;
                        foreach ($komponenHarga as $itemHarga) {
                            $totalHargaSatuan = $totalHargaSatuan + (float) $itemHarga->hargasatuan;
                        }
                        if ($idruangan == '9') {
                            $antrian = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                                ->update([
                                    'ispelayananpasien' => true
                                ]);
                        }

                        $PelPasien = new PelayananPasien();
                        $PelPasien->norec = $PelPasien->generateNewId();
                        $PelPasien->kdprofile = 0;
                        $PelPasien->statusenabled = true;
                        $PelPasien->noregistrasifk = $request['norec_apd'];
                        $PelPasien->tglregistrasi = date('Y-m-d H:i:s');
                        $PelPasien->hargadiscount = 0;
                        $PelPasien->hargajual =   $totalHargaSatuan;
                        $PelPasien->hargasatuan =     $totalHargaSatuan;
                        $PelPasien->jumlah = 1;
                        $PelPasien->kelasfk = '6';
                        $PelPasien->kdkelompoktransaksi =  1;
                        $PelPasien->keteranganlain =  'Karcis Otomatis';
                        $PelPasien->piutangpenjamin =  0;
                        $PelPasien->piutangrumahsakit = 0;
                        $PelPasien->produkfk = $itemsave['produkfk'];
                        $PelPasien->stock =  1;
                        $PelPasien->tglpelayanan =  date('Y-m-d H:i:s');
                        $PelPasien->harganetto = $totalHargaSatuan;
                        $PelPasien->jenispelayananfk = '1';
                        $PelPasien->save();
                        $PPnorec = $PelPasien->norec;

                        foreach ($komponenHarga as $itemKomponen) {
                            $PelPasienDetail = new PelayananPasienDetail();
                            $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                            $PelPasienDetail->kdprofile = 0;
                            $PelPasienDetail->statusenabled = true;
                            $PelPasienDetail->noregistrasifk = $request['norec_apd'];
                            $PelPasienDetail->aturanpakai = '-';
                            $PelPasienDetail->hargadiscount = 0;
                            $PelPasienDetail->hargajual = $itemKomponen->hargasatuan;
                            $PelPasienDetail->hargasatuan = $itemKomponen->hargasatuan;
                            $PelPasienDetail->jumlah = 1;
                            $PelPasienDetail->keteranganlain = '-';
                            $PelPasienDetail->keteranganpakai2 = '-';
                            $PelPasienDetail->komponenhargafk = $itemKomponen->objectkomponenhargafk;
                            $PelPasienDetail->pelayananpasien = $PPnorec;
                            $PelPasienDetail->piutangpenjamin = 0;
                            $PelPasienDetail->piutangrumahsakit = 0;
                            $PelPasienDetail->produkfk = $itemsave['produkfk'];
                            $PelPasienDetail->stock = 1;
                            $PelPasienDetail->tglpelayanan =  date('Y-m-d H:i:s');
                            $PelPasienDetail->harganetto = $itemKomponen->hargasatuan;
                            $PelPasienDetail->save();
                            $PPDnorec = $PelPasienDetail->norec;
                            $transStatus = 'true';
                        }

                        $PelPasienPetugas = new PelayananPasienPetugas();
                        $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                        $PelPasienPetugas->kdprofile = 0;
                        $PelPasienPetugas->statusenabled = true;
                        $PelPasienPetugas->nomasukfk = $request['norec_apd'];
                        $PelPasienPetugas->objectjenispetugaspefk = $itemsave['objectjenispetugaspefk'];
                        $PelPasienPetugas->objectpegawaifk = $itemsave['pegawaifk'];
                        $PelPasienPetugas->pelayananpasien = $PPnorec;
                        $PelPasienPetugas->save();
                    }


                //pemisah
                
            }

            $transStatus = 'true';
            $transMessage = "Karcis Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Karcis Gagal";
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

        return($result);
    }
    public function editReservasi(Request $request)
    {
        DB::beginTransaction();
        try {
            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            // $tglA=='2021-10-18' || 
            if($tglA=='2021-07-10' || $tglA=='2021-07-11' || $tglA=='2021-07-12'
                || $tglA=='2021-07-13' || $tglA=='2021-07-20' || $tglA=='2021-08-10' || $tglA=='2021-08-11'
                || $tglA=='2021-08-17' || $tglA=='2021-10-20'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Slot sudah Penuh di Tanggal ini, Coba dihari lain.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
           

            // $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $noreservasi = $request['noreservasi'];
            AntrianPasienRegistrasi::where('noreservasi',$request['noreservasi'])->update([
                'tanggalreservasi'=>$request ['tglReservasiFix'],
                'objectruanganfk'=>$request['poliKlinik']['id'],
                'keterangan'=>$request ['alasan'],
             ]);
            $transStatus = 'true';

            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editReservasiRo(Request $request)
    {
        DB::beginTransaction();
        try {

            DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Silahkan Batalkan Registrasi Anda Dan Ulangi Registrasi Sesuai Jadwal Dan Rujukan Anda",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);

            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            // $tglA=='2021-10-18' || 
            if($tglA=='2021-07-10' || $tglA=='2021-07-11' || $tglA=='2021-07-12'
                || $tglA=='2021-07-13' || $tglA=='2021-07-20' || $tglA=='2021-08-10' || $tglA=='2021-08-11'
                || $tglA=='2021-08-17' || $tglA=='2021-10-20'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Slot sudah Penuh di Tanggal ini, Coba dihari lain.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
           

            // $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $noreservasi = $request['noreservasi'];
            AntrianPasienRegistrasi::where('noreservasi',$request['noreservasi'])->update([
                'tanggalreservasi'=>$request ['tglReservasiFix'],
                'objectruanganfk'=>$request['poliKlinik']['id'],
                'keterangan'=>$request ['alasan'],
             ]);
             PasienDaftar::where('statusschedule',$request['noreservasi'])->update([
                'tglregistrasi'=>$request ['tglReservasiFix'],
                'objectruanganlastfk'=>$request['poliKlinik']['id']
             ]);
             $pasienDaftar  = PasienDaftar::where('statusschedule',$request['noreservasi'])->first();
             AntrianPasienDiperiksa::where('noregistrasifk',$pasienDaftar->norec)->update([
                'tglregistrasi'=>$request ['tglReservasiFix'],
                'tglmasuk'=>$request ['tglReservasiFix'],
                'objectruanganfk'=>$request['poliKlinik']['id']
             ]);
            $transStatus = 'true';

            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveVaksin(Request $request)
    {
        DB::beginTransaction();
        try {
            // return($request['jawab3']);
            // die();
            
            
            $noRegistrasiSeq = $this->generateCodeBySeqTable(new PasienDaftarVaksin, 'noregVaksin', 12, date('ym').'VC19');
            if ($noRegistrasiSeq == ''){
                $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message"  => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            $noAntrian=0;
            $tglinsertvaksin =  date('Y-m-d 00:00');
            $tglAwal = $request['tglvaksinasi'];
            $tglAkhir = $request['tglvaksinasi'];
            $tglA = $request['tglvaksinasi'];
            $tglAkhir=date_create($tglAkhir);
            $tglAkhir=date_format($tglAkhir,"Y-m-d 23:59");
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $hari   = date('l', strtotime($tglA)); 
            if($hari == 'Saturday' || $hari == 'Sunday'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Hari libur tutup Bos.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            $tglsekarang =  date('Y-m-d');
            if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            // return('test');
            // die();
            
            if($tglA=='2021-07-20' || $tglA=='2021-08-10' || $tglA=='2021-08-11'
                || $tglA=='2021-08-17' || $tglA=='2021-08-21' || $tglA=='2021-08-22' || $tglA=='2021-08-28'
                || $tglA=='2021-08-29' || $tglA=='2021-10-20'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Slot sudah Penuh di Tanggal ini, Coba dihari lain.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            if(substr($tglA,0,4)>2021){
                $result = array(
                    'status' => 400,
                    'message' => 'pendaftaran vaksin sudah di tutup, menunggu informasi selanjutnya.',
                );
                return $this->respond($result);
            }
            // else if(substr($tglA,5,2)>7){
                
            //     if(substr($tglA,5,2)>8){
            //         $result = array(
            //             'status' => 400,
            //             'message' => 'pendaftaran vaksin sudah di tutup, menunggu informasi selanjutnya.',
            //         );
            //         return $this->respond($result);
            //     }else if(substr($tglA,8,2)>31){
            //     // }else if(substr($tgl,8,2)!=19){
            //         $result = array(
            //             'status' => 400,
            //             'message' => 'pendaftaran vaksin sudah di tutup, menunggu informasi selanjutnya.',
            //         );
            //         return $this->respond($result);
            //     }
            // }

            if($request['jawab17']=='pertama' && $request['objectnvfk']==2){
                DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Vaksin AstraZeneca hanya untuk vaksin ke dua.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            if($request['jawab17']=='pertama' && $request['objectnvfk']==3){
                DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Vaksin Moderna hanya untuk vaksin ke dua.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // return('test');
            // die();

            if($request['objectnvfk']==2){
                $dataVaksin = \DB::table('pasiendaftarvaksin_t as pdv')
                ->select('pdv.norec','pdv.tglvaksin','pdv.nohp','pdv.alamat','pdv.tgllahir')
                ->where('pdv.tglvaksin', 'like', '%'. $tglA .'%')
                ->where('pdv.statusenabled',true)
                ->where('pdv.objectnvfk',2)
                ->get();
    
                if (count($dataVaksin) > 99) {
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Slot vaksin AstraZeneca sudah Penuh di Tanggal ini, Coba dihari lain.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }else if($request['objectnvfk']==3){
                $dataVaksin = \DB::table('pasiendaftarvaksin_t as pdv')
                ->select('pdv.norec','pdv.tglvaksin','pdv.nohp','pdv.alamat','pdv.tgllahir')
                ->where('pdv.tglvaksin', 'like', '%'. $tglA .'%')
                ->where('pdv.statusenabled',true)
                ->where('pdv.objectnvfk',3)
                ->get();
    
          
                if (count($dataVaksin) > 49) {
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Slot vaksin Moderna sudah Penuh di Tanggal ini, Coba dihari lain.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            $dataVaksin = \DB::table('pasiendaftarvaksin_t as pdv')
            ->select('pdv.norec','pdv.tglvaksin','pdv.nohp','pdv.alamat','pdv.tgllahir')
            ->where('pdv.tglvaksin', 'like', '%'. $tglA .'%')
            ->where('pdv.statusenabled',true)
            ->get();

      
            if (count($dataVaksin) > 149) {
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Slot sudah Penuh di Tanggal ini, Coba dihari lain.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
                
            if($request['objectnvfk']==3){
                if($request['jawab19']=='false'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Anda tidak memiliki KTP DKI Jakarta.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else if($request['jawab20']=='false'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Anda tidak berdomisili di DKI Jakarta.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else if($request['jawab21']=='false'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Anda tidak memiliki surat keterangan dari dokter untuk melakukam Vaksin.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            
            $dataPD = new PasienDaftarVaksin();
                    $dataPD->norec = $dataPD->generateNewId();
                    $dataPD->kdprofile = 1;
                    $dataPD->statusenabled = true;
                    $noRegistrasi = $noRegistrasiSeq;
                    $dataPD->noregistrasi = $noRegistrasi;
                    $dataPD->nik = $request['nik'];
                    $dataPD->namapasien = $request['nama'];
                    $dataPD->objectjkfk = $request['jeniskelaminHide'];
                    $dataPD->tgllahir = $request['tglLahir'];
                    $dataPD->objectpkfk = $request['pekerjaan'];
                    $dataPD->nohp = $request['nohp'];
                    // $dataPD->tglvaksin = $request['tglvaksinasi'];
                    $dataPD->tglinsertvaksin = $tglinsertvaksin;
                    $dataPD->alamat = $request['alamat'];
                    $dataPD->pertanyaan1 = $request['pertanyaan1'];
                    $dataPD->jawab1 = $request['jawab1'];
                    $dataPD->pertanyaan2 = $request['pertanyaan2'];
                    $dataPD->jawab2 = $request['jawab2'];
                    $dataPD->pertanyaan3 = $request['pertanyaan3'];
                    $dataPD->jawab3 = $request['jawab3'];
                    $dataPD->pertanyaan4 = $request['pertanyaan4'];
                    $dataPD->jawab4 = $request['jawab4'];
                    $dataPD->pertanyaan5 = $request['pertanyaan5'];
                    $dataPD->jawab5 = $request['jawab5'];
                    $dataPD->pertanyaan6 = $request['pertanyaan6'];
                    $dataPD->jawab6 = $request['jawab6'];
                    $dataPD->pertanyaan7 = $request['pertanyaan7'];
                    $dataPD->jawab7 = $request['jawab7'];
                    $dataPD->pertanyaan8 = $request['pertanyaan8'];
                    $dataPD->jawab8 = $request['jawab8'];
                    $dataPD->pertanyaan9 = $request['pertanyaan9'];
                    $dataPD->jawab9 = $request['jawab9'];
                    $dataPD->pertanyaan10 = $request['pertanyaan10'];
                    $dataPD->jawab10 = $request['jawab10'];
                    $dataPD->pertanyaan11 = $request['pertanyaan11'];
                    $dataPD->jawab11 = $request['jawab11'];
                    $dataPD->pertanyaan12 = $request['pertanyaan12'];
                    $dataPD->jawab12 = $request['jawab12'];
                    $dataPD->pertanyaan13 = $request['pertanyaan13'];
                    $dataPD->jawab13 = $request['jawab13'];
                    $dataPD->pertanyaan14 = $request['pertanyaan14'];
                    $dataPD->jawab14 = $request['jawab14'];
                    $dataPD->pertanyaan15 = $request['pertanyaan15'];
                    $dataPD->jawab15 = $request['jawab15'];
                    $dataPD->pertanyaan16 = $request['pertanyaan16'];
                    $dataPD->jawab16 = $request['jawab16'];
                    $dataPD->kodefaskes = '0903R004';
                    $dataPD->namafaskes = 'RS BHAYANGKARA TK.I R. SAID SUKANTO';
                    $dataPD->pertanyaan17 = $request['pertanyaan17'];
                    if($request['jawab17']=='pertama'){
                        $dataPD->pertama = true;
                    }else{
                        $dataPD->kedua = true;
                    }
                    $dataPD->objectnvfk = $request['objectnvfk'];
                    $dataPD->pertanyaan19 = $request['pertanyaan19'];
                    $dataPD->jawab19 = $request['jawab19'];
                    $dataPD->pertanyaan20 = $request['pertanyaan20'];
                    $dataPD->jawab20 = $request['jawab20'];
                    $dataPD->pertanyaan21 = $request['pertanyaan21'];
                    $dataPD->jawab21 = $request['jawab21'];
                    $countNoAntrian= PasienDaftarVaksin::whereBetween('tglvaksin',[$tglAwal,$tglAkhir])
                    ->max('noantrian')+1;
                    $noAntrian = $countNoAntrian;
                    // return($noAntrian);
                    // die();
                    $dataPD->noantrian = $noAntrian;
                    if($noAntrian<50){
                        $x = $request['tglvaksinasi'];
                        $x=date_create($x);
                        $x=date_format($x,"Y-m-d 08:00");
                        $dataPD->tglvaksin = $x;
                    }else if($noAntrian<100){
                        $x = $request['tglvaksinasi'];
                        $x=date_create($x);
                        $x=date_format($x,"Y-m-d 09:00");
                        $dataPD->tglvaksin = $x;
                    }else if($noAntrian<150){
                        $x = $request['tglvaksinasi'];
                        $x=date_create($x);
                        $x=date_format($x,"Y-m-d 10:00");
                        $dataPD->tglvaksin = $x;
                    }else if($noAntrian<200){
                        $x = $request['tglvaksinasi'];
                        $x=date_create($x);
                        $x=date_format($x,"Y-m-d 11:00");
                        $dataPD->tglvaksin = $x;
                    }
                    
                    
            $dataPD->save();
            $transStatus = 'true';

            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noRegistrasi,
                "noAntrian" => $noAntrian,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getStatusBed(Request $request)
    { 
        DB::beginTransaction();
        $data = DB::select(DB::raw("
            select x.namakelas,sum(x.siappakai) as siappakai,sum(x.kosong) as tersedia,
            sum(x.terisi)as terisi from (
            select ks.namakelas,case when tt.objectstatusbedfktriger=5 then 1 else 0 end as siappakai,
            case when tt.objectstatusbedfk=2 then 1 else 0 end as kosong,
            case when tt.objectstatusbedfk=1 then 1 else 0 end as terisi from tempattidur_m as tt
            left join statusbed_m as sb on sb.id=tt.objectstatusbedfktriger
            left join kamar_m as km on km.id=tt.objectkamarfk
            left join kelas_m as ks on ks.id=km.objectkelasfk
            where tt.statusenabled=1
            ) as x
            GROUP BY x.namakelas
            ")
        );
        $result = array(
            'data' => $data,
            'kodeprofile' => '0903R004',
            'namaprofile' => 'RS PUSAT POLRI SAID SUKANTO',
            'by' => '@transmdic'
        );

        return $this->respond($result);
    }

    public function saveFoto(Request $request)
    {
        DB::beginTransaction();
        try {
            // return($request['nocmfk']);
            // die();
            $photo=$request['foto'];
            Pasien::where('id', $request['nocmfk'])->update(['photo'=>$photo]);
            
            $data = \DB::table('pasien_M as ps')
			->leftJOIN ('alamat_m as alm','alm.nocmfk','=','ps.id')
			->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
			->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
			->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
			->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.objectjeniskelaminfk','jk.jeniskelamin',
				'alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.noidentitas','ps.notelepon','ps.tempatlahir',
                'ps.nobpjs','ps.photo',
				DB::raw(" format ( ps.tgllahir,'yyyy-MM-dd') as tgllahir"))
            ->where('ps.statusenabled',true);
			// ->where('ps.nocm', $nocm);
            if(isset($request['nocmfk']) &&$request['nocmfk'] != "" && $request['nocmfk'] != "undefined" && $request['nocmfk'] != "null") {
                $data = $data->where('ps.id','=',$request['nocmfk']);
                // ->Orwhere('ps.noidentitas','=',$nocm);
            }
            $data = $data->get();
            $transStatus = 'true';

            $transMessage = "Simpan Foto";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Foto".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "photo" =>$photo,
                "data" =>$data,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getHistoryReservasi(Request $request)
    {
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm','pm.id','=','apr.nocmfk')
            ->leftJoin('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
            ->leftJoin('jeniskelamin_m as jks','jks.id','=','apr.objectjeniskelaminfk')
            ->leftJoin('pekerjaan_m as pk','pk.id','=','pm.objectpekerjaanfk')
            ->leftJoin('pendidikan_m as pdd','pdd.id','=','pm.objectpendidikanfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps','kps.id','=','apr.objectkelompokpasienfk')
            ->leftJoin('pasiendaftar_t as pd','pd.statusschedule','=','apr.noreservasi')
            ->leftJoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->select('apr.norec','pm.nocm','apr.noreservasi','apr.tanggalreservasi','apr.objectruanganfk',
                'apr.objectpegawaifk','ru.namaruangan','apr.isconfirm','pg.namalengkap as dokter','pm.id as nocmfk',
               'pm.namapasien','apr.namapasien','alm.alamatlengkap','pk.pekerjaan','pm.noasuransilain','pm.noidentitas',
                'apr.nobpjs','pm.nohp','pdd.pendidikan','apr.type','kps.kelompokpasien','apr.objectkelompokpasienfk','ru.objectdepartemenfk',
                'ru.prefixnoantrian', 'apr.norujukan', 'apr.notelepon as notelemedicine','apr.istelemedicine','apr.keterangan','apd.noantrian',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien,
                (case when apr.isconfirm=true then \'Confirmed\' when apr.isconfirm is null then \'Menunggu Confirm\' else \'Di Tolak\' end) as status,case when pm.tempatlahir is null then apr.tempatlahir else pm.tempatlahir end as tempatlahir,
                case when jk.jeniskelamin is null then jks.jeniskelamin else jk.jeniskelamin end as jeniskelamin,
                case when apr.tgllahir is null then pm.tgllahir else apr.tgllahir end as tgllahir,
                case when apr.tipepasien = \'LAMA\' then pm.nohp else  apr.notelepon end as notelepon' )
            )
            // ->whereNull('apr.isconfirm')
            ->where('apr.noreservasi','!=','-')
            ->whereNotNull('apr.noreservasi');
            
            // ->where('apr.statusenabled',true);


        if(isset($request['nocmNama']) && $request['nocmNama'] != "" && $request['nocmNama'] != "undefined" && $request['nocmNama'] != "null") {
            $data =
                 $data->where('pm.nocm', $request['nocmNama'])
//                     ->Orwhere('pm.noidentitas', $request['nocmNama'])
                 -> Orwhere('apr.namapasien', 'like','%'.$request['nocmNama'].'%');

        }
        if(isset($request['tgllahir']) && $request['tgllahir'] != "" && $request['tgllahir'] != "undefined" && $request['tgllahir'] != "null" &&  $request['tgllahir'] !='Invaliddate') {
            $tgllahir= $request['tgllahir'];
            $data =
//                $data->whereRaw("CONVERT(varchar, pm.tgllahir, 105)  ='$tgllahir' " )
                $data->whereRaw("to_char(apr.tgllahir, 'dd-MM-yy')  ='$tgllahir' " );
        }

        if(isset($request['noReservasi']) && $request['noReservasi'] != "" && $request['noReservasi'] != "undefined" && $request['noReservasi'] != "null") {
            $data =
                 $data->where('apr.noreservasi', $request['noReservasi']);
            
        }
       
        $data = $data->orderBy('apr.tanggalreservasi','desc');
        $data = $data->take(10);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
     public function getPasienByNoCmTglLahirKioskCekin($nocm, $tgllahir)
    {  
        $data = \DB::table('pasien_m as ps')
        ->leftJOIN('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
        ->leftjoin('pendidikan_m as pdd', 'ps.objectpendidikanfk', '=', 'pdd.id')
        ->leftjoin('pekerjaan_m as pk', 'ps.objectpekerjaanfk', '=', 'pk.id')
        ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        ->select(
            'ps.nocm',
            'ps.id as nocmfk',
            'ps.namapasien',
            'ps.objectjeniskelaminfk',
            'jk.jeniskelamin',
            'alm.alamatlengkap',
            'pdd.pendidikan',
            'pk.pekerjaan',
            'ps.noidentitas',
            'ps.notelepon',
            'ps.tempatlahir',
            'ps.nobpjs',
            'alm.objectdesakelurahanfk',
            'ps.nohp',
            DB::raw(" to_char( ps.tgllahir,'yyyy-MM-dd') as tgllahir")
        )
        ->where('ps.statusenabled', true); 
        if (isset($nocm) && $nocm != "" && $nocm != "undefined" && $nocm != "null") {
            if (strlen($nocm) == 9) {
                $data = $data->where('ps.nocm', '=', $nocm);
            } else { 
                // $data = $data->where('ps.nocm','=',$nocm);
                if (strlen($nocm) < 9) {
                    $data = $data->where('ps.nocmlama', 'ilike', '%' . $nocm . '%');
                } else {
                    $data = $data->where('ps.noidentitas', '=', $nocm);
                }
            } 
        }
        $data = $data->get();
        foreach ($data as $itemx) {
            $nocm = $itemx->nocm;
        }

        $tglAyeuna = date('Y-m-d');
        $dataCekDaftar = \DB::table('pasiendaftar_t as pd')
        ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select('pd.norec', 'pd.noregistrasi', 'ru.namaruangan', 'ru.id')
        ->where('ps.nocm', $nocm)
            ->whereRaw("to_char(pd.tglregistrasi,'yyyy-MM-dd') = '$tglAyeuna'")
            ->where('pd.statusenabled', true)
            ->where('pd.objectkelompokpasienlastfk', 2)
            ->where('ru.objectdepartemenfk', 18)
            ->orderBy('ru.id', 'ASC')
            ->get();
       

        $result = array(
            'status' => 201,
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function  getKelurahan(Request $request){
            
        $desa = \DB::table('desakelurahan_m as ds')
            ->join('kecamatan_m as kc', 'ds.objectkecamatanfk', '=', 'kc.id')
            ->join('kotakabupaten_m as kk', 'ds.objectkotakabupatenfk', '=', 'kk.id')
            ->join('propinsi_m as pp', 'ds.objectpropinsifk', '=', 'pp.id')
            ->select(DB::raw("ds.id,UPPER(ds.namadesakelurahan) as kelurahan,
                            ds.objectkecamatanfk,ds.objectkotakabupatenfk,ds.objectpropinsifk,
                            kc.namakecamatan,kk.namakotakabupaten,pp.namapropinsi,CONCAT(UPPER(ds.namadesakelurahan),', ', UPPER(kc.namakecamatan), ', ', UPPER(pp.namapropinsi)) AS datakelurahan"))
            ->where('ds.statusenabled', true)
            //->whereLike('ds.namadesakelurahan', $request['namakelurahan'])
            ->where('ds.namadesakelurahan', 'ilike',$request['namakelurahan'].'%')
            ->orderBy('ds.namadesakelurahan')
            ->limit('100')
            ->get();

        $result = array(
            'kelurahan'=> $desa,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function geCekPemakaianAsuransi(Request $request)
    {
        $data = \DB::table('pemakaianasuransi_t as pa')
                    // ->select('apr.norec','apr.tanggalreservasi')
                    // ->whereRaw("apr.tanggalreservasi = '$tgl'")
                    ->where('pa.noregistrasifk', $request['norecpd'])
                    // ->where('apr.noreservasi','!=','-')
                    // ->whereNotNull('apr.noreservasi')
                    // ->where('apr.statusenabled',true)
                    ->get();
         

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getHistoryReservasiMCU(Request $request)
    {
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm','pm.id','=','apr.nocmfk')
            ->leftJoin('alamat_m as alm','alm.nocmfk','=','pm.id')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
            ->leftJoin('jeniskelamin_m as jks','jks.id','=','apr.objectjeniskelaminfk')
            ->leftJoin('pekerjaan_m as pk','pk.id','=','pm.objectpekerjaanfk')
            ->leftJoin('pendidikan_m as pdd','pdd.id','=','pm.objectpendidikanfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps','kps.id','=','apr.objectkelompokpasienfk')
            ->leftJoin('pasiendaftar_t as pd','pd.statusschedule','=','apr.noreservasi')
            ->leftJoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->select('apr.norec','pm.nocm','apr.noreservasi','apr.tanggalreservasi','apr.objectruanganfk',
                'apr.objectpegawaifk','ru.namaruangan','apr.isconfirm','pg.namalengkap as dokter','pm.id as nocmfk',
               'pm.namapasien','apr.namapasien','alm.alamatlengkap','pk.pekerjaan','pm.noasuransilain','pm.noidentitas',
                'apr.nobpjs','pm.nohp','pdd.pendidikan','apr.type','kps.kelompokpasien','apr.objectkelompokpasienfk','ru.objectdepartemenfk',
                'ru.prefixnoantrian', 'apr.norujukan', 'apr.notelepon as notelemedicine','apr.istelemedicine','apr.keterangan','apd.noantrian',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien,
                (case when apr.isconfirm=1 then \'Confirm\' when apr.isconfirm is null then \'Menunggu Confirm\' else \'Di Tolak\' end) as status,case when pm.tempatlahir is null then apr.tempatlahir else pm.tempatlahir end as tempatlahir,
                case when jk.jeniskelamin is null then jks.jeniskelamin else jk.jeniskelamin end as jeniskelamin,
                case when apr.tgllahir is null then pm.tgllahir else apr.tgllahir end as tgllahir,
                case when apr.tipepasien = \'LAMA\' then pm.nohp else  apr.notelepon end as notelepon' )
            )
            ->where('apr.objectruanganfk','=','322')
            ->where('apr.noreservasi','!=','-')
            ->whereNotNull('apr.noreservasi');
            


        if(isset($request['nocmNama']) && $request['nocmNama'] != "" && $request['nocmNama'] != "undefined" && $request['nocmNama'] != "null") {
            $data =
                 $data->where('pm.nocm', $request['nocmNama'])
                 -> Orwhere('apr.namapasien', 'like','%'.$request['nocmNama'].'%');

        }
        if(isset($request['tgllahir']) && $request['tgllahir'] != "" && $request['tgllahir'] != "undefined" && $request['tgllahir'] != "null" &&  $request['tgllahir'] !='Invaliddate') {
            $tgllahir= $request['tgllahir'];
            $data =
                $data->whereRaw("CONVERT(varchar, apr.tgllahir, 105)  ='$tgllahir' " );
        }

        if(isset($request['noReservasi']) && $request['noReservasi'] != "" && $request['noReservasi'] != "undefined" && $request['noReservasi'] != "null") {
            $data =
                 $data->where('apr.noreservasi', $request['noReservasi']);
            
        }
        if(isset($request['noidentitas']) && $request['noidentitas'] != "" && $request['noidentitas'] != "undefined" && $request['noidentitas'] != "null") {
            $data =
                 $data->where('apr.noidentitas', $request['noidentitas']);
            
        }
        $data = $data->orderBy('apr.tanggalreservasi','desc');
        $data = $data->take(5);
        $data = $data->get();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function saveRoAndroidBaru(Request $request)
    {
        DB::beginTransaction();
        try {

            // DB::commit();
            // $result = array(
            //     "status" => 201,
            //     "message" => 'Simpan Reservasi',
            //     "noreservasi" => '22d78df',
            //     "as" => 'ramdan@epic',
            // );
            // return $this->setStatusCode($result['status'])->respond($result, $result['message']);

           if($request['version']=="null" || $request['version']=="" || $request['version']!="V.24"){
            
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "VERSI APLIKASI ANDA BELUM DI UPDATE, SILAHKAN UNINSTAL/HAPUS APLIKASI INI. SILAHKAN INSTAL ULANG APLIKASI TERBARU DI PLYSTORE (PENDAFTARAN ONLINE RS POLRI)",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
           
            
            $tipepembayaran = "";
            $tgl =$request ['tglReservasiFix'];
            $bulanregis=date_create($tgl);
            $tglAwal=date_format($bulanregis,"Y-m-d 00:00:00");
            $tglAkhir=date_format($bulanregis,"Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA=date_create($tglA);
            $tglA=date_format($tglA,"Y-m-d");
            
            $tglsekarang =  date('Y-m-d');

            $jamsekarang =  date('H');
            
            if($tglA=='2021-07-20' || $tglA=='2021-08-10' || $tglA=='2021-08-11'
                || $tglA=='2021-08-17' || $tglA=='2021-08-21' || $tglA=='2021-08-22' || $tglA=='2021-08-28'
                || $tglA=='2021-08-29' || $tglA=='2021-10-20'){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Tanggal ini hari libur.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            
            if($request['poliKlinik']==253){
                if($tglA=='2021-12-13' || $tglA=='2021-12-14' || $tglA=='2021-12-15' || $tglA=='2021-12-16'
                    || $tglA=='2021-12-17' || $tglA=='2021-12-18' || $tglA=='2021-12-19' || $tglA=='2021-12-20'
                    || $tglA=='2021-12-21'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            
            if($request['poliKlinik']==543){
                if($tglA=='2021-12-31'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            $dataRuanganTutup = [];
            for ($i = 9 - 1; $i >= 0; $i--) {
                if($i==1){
                    $idruanganLibur = 33;
                }else if($i==2){
                    $idruanganLibur = 132;
                }else if($i==3){
                    $idruanganLibur = 198;
                }else if($i==4){
                    $idruanganLibur = 97;
                }else if($i==5){
                    $idruanganLibur = 7;
                }else if($i==6){
                    $idruanganLibur = 552;
                }else if($i==7){
                    $idruanganLibur = 446;
                }else if($i==8){
                    $idruanganLibur = 19;
                }else if($i==9){
                    $idruanganLibur = 19;
                }
                $dataRuanganTutup[] = array(
                    'idruangan' => $idruanganLibur
                );
            };
            
            $buka = 'false';
            foreach ($dataRuanganTutup as $itemd) {
                if($itemd['idruangan'] == $request['poliKlinik']){
                    $buka = 'true';
                }
            }
             if($tglA=='2021-12-24'){
                if($buka=='false'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            
            $cekMapKelompok = \DB::table('mapkelompokpasientopenjamin_m as mkp')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'mkp.objectkelompokpasienfk')
            ->join('rekanan_m as rk', 'rk.id', '=', 'mkp.kdpenjaminpasien')
            ->select('rk.id', 'rk.namarekanan', 'kp.id as id_kelompokpasien', 'kp.kelompokpasien')
            //            ->where('mkp.objectkelompokpasienfk', $request['kdKelompokPasien'])
            ->where('mkp.statusenabled', true);
            if (isset($request['tipePembayaran']) && $request['tipePembayaran'] != "" && $request['tipePembayaran'] != "undefined") {
                $cekMapKelompok = $cekMapKelompok->where('mkp.objectkelompokpasienfk', '=', $request['tipePembayaran']);
                $cekMapKelompok = $cekMapKelompok->where('rk.id', '=', $request['namaPenjamin']);
            };
            $cekMapKelompok = $cekMapKelompok->get();
            
            if (count($cekMapKelompok) == 0) {
                    $transMessage = "Silahkan Pilih Nama Penjamin Dengan Benar ";
                    DB::rollBack();
                    $result = array(
                        'status' => 400,
                        'as' => 'tukangKomputer',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
           
            if($request['poliKlinik']==543){
                if($tglA=='2021-12-15' || $tglA=='2021-12-17'){
                    DB::rollBack();
                    $transStatus = 'false';
                    $transMessage = "Gagal Reservasi";
                    $result = array(
                        "status" => 400,
                        "message" => "Tanggal ini hari libur.",
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            
            
            if($request['noCm']=="null" || $request['noCm']==""){
                DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "NoRM Anda Tidak Terdaftar",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            
            if($request['tipePembayaran']==2 && $request['asalRujukan']!=7){
                $cekKepesertaan = $this->getNoPeserta($request['noKartuPeserta']);
                if($cekKepesertaan['status']=='tidakada'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "No Peserta Tidak Ditemukan",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else if($cekKepesertaan['statusPeserta']=='25'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "USIA ANAK PPU > 21 TH DAN 25 TH, Silahkan Update Kepesertaan",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else{
                    if($request['asalRujukan']==2){
                        $cekRujukan = $this->getNoRujukanRs($request['noRujukan']);
                      
                        if($cekRujukan['status']=='tidakada'){
                            DB::rollBack();
                            $transStatus = 'false';
                            $transMessage = "Gagal Reservasi";
                            $result = array(
                                "status" => 400,
                                "message" => "Data Rujukan Tidak Ditemukan",
                            );
                            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                        }else{
                            $tgl1 = new \DateTime($cekRujukan['tglKunjungan']);
                            $tgl2 = new \DateTime($tglA);
                            $d = $tgl2->diff($tgl1)->days + 1;
                            if($d>89){
                                DB::rollBack();
                                $transStatus = 'false';
                                $transMessage = "Gagal Reservasi";
                                $result = array(
                                    "status" => 400,
                                    "message" => "Nomor Rujukan Anda Sudah Habis",
                                );
                                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                            }
                        }
                    }else if($request['asalRujukan']['id']!=2){
                        $cekRujukan = $this->getNoRujukanPcare($request['noRujukan']);
                       
                        if($cekRujukan['status']=='tidakada'){
                            DB::rollBack();
                            $transStatus = 'false';
                            $transMessage = "Gagal Reservasi";
                            $result = array(
                                "status" => 400,
                                "message" => "Data Rujukan Tidak Ditemukan",
                            );
                            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                        }else{
                            $tgl1 = new \DateTime($cekRujukan['tglKunjungan']);
                            $tgl2 = new \DateTime($tglA);
                            $d = $tgl2->diff($tgl1)->days + 1;
                            if($d>90){
                                DB::rollBack();
                                $transStatus = 'false';
                                $transMessage = "Gagal Reservasi";
                                $result = array(
                                    "status" => 400,
                                    "message" => "Nomor Rujukan Anda Sudah Habis",
                                );
                                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                            }
                        }
                    }
                }
            }else if($request['tipePembayaran']==2 && $request['asalRujukan']==7){
                $cekKepesertaan = $this->getMonitoringHistori($request['noKartuPeserta']);
              
                if($cekKepesertaan['status']=='tidakada'){
                    DB::rollBack();
                        $transStatus = 'false';
                        $transMessage = "Gagal Reservasi";
                        $result = array(
                            "status" => 400,
                            "message" => "Sep Pasca Ranap Tidak Ada",
                        );
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else{
                    $request['noRujukan'] = $request['noRujukan']." ".$cekKepesertaan['sepRanap'];
                }
            }
           
            //ash
            /*if($tglA==$tglsekarang){
                DB::rollBack();
                $transStatus = 'false';
                $transMessage = "Gagal Reservasi";
                $result = array(
                    "status" => 400,
                    "message" => "Reservasi di hari yang sama tidak bisa dilakukan.",
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }*/
           
            if($request['tipePembayaran']){
                $tipepembayaran = $request['tipePembayaran'];
            }else{
                $tipepembayaran = $request['tipePembayaranTelemedicine'];
                Pasien::where('nocm', $request['noCm'])->update(['notelepon'=>$request['noTelpon'],'alamatdomisili'=>$request['domisili']]);
            }
            
            if($request ['isBaru'] == false){
                $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            }
            if(isset($pasien) && !empty($pasien)){
                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                ->select('apr.norec','apr.tanggalreservasi')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.nocmfk',$pasien->id)
                ->where('apr.statusenabled',true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAkhir);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if(count($ceksudahdaftar) > 0){
                    $result = array(
                        "status" => 400,
                        "message" => 'Tidak bisa Reservasi di Tgl yang sama, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, 'Mohon maaf dijam tersebut sudah ada yang reservasi, Coba di jadwal yang lain');
                }
            }
           
            $countNoAntrianJam = AntrianPasienDiperiksa::where('objectruanganfk', $request['poliKlinik'])
                    ->where('tglregistrasi', '>=', $tglAwal)
                    ->where('tglregistrasi', '<=', $tglAkhir)
                    ->where('statusenabled', true)
                    ->max('noantrian');
            
            $noAntrianJam = $countNoAntrianJam;

            if($request['poliKlinik']==253){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 15:30");
                $request['tglReservasiFix'] = $x;
            }else if($request['poliKlinik']==543){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 15:30");
                $request['tglReservasiFix'] = $x;
            }else{
                if($noAntrianJam<2){
                $x = $request['tglReservasiFix'];
                $x=date_create($x);
                $x=date_format($x,"Y-m-d 08:00");
                $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<4){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:05");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<6){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:10");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<8){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:15");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<10){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:20");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<12){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:25");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<14){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:30");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<16){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:35");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<18){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:40");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<20){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:45");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<22){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:50");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<24){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 08:55");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<26){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:00");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<28){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:05");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<30){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:10");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<32){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:15");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<34){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:20");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<36){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:25");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<38){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:30");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<40){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:35");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<42){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:40");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<44){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:45");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<46){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:50");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<48){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 09:55");
                    $request['tglReservasiFix'] = $x;
                }else if($noAntrianJam<50){
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 10:00");
                    $request['tglReservasiFix'] = $x;
                }else{
                    $x = $request['tglReservasiFix'];
                    $x=date_create($x);
                    $x=date_format($x,"Y-m-d 10:10");
                    $request['tglReservasiFix'] = $x;
                }
            }

         
           
            $newptp = new AntrianPasienRegistrasi();
            $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk =$request['poliKlinik'];
            $newptp->objectjeniskelaminfk =$pasien->objectjeniskelaminfk;
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request ['tglReservasiFix'];
            $newptp->tgllahir= $pasien->tgllahir;
            $newptp->objectkelompokpasienfk= $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien=  $pasien->namapasien;
            $newptp->noidentitas=  $pasien->noidentitas;
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk= $request['asalRujukan'];
            if($tipepembayaran == 2){
                $newptp->nobpjs= $request['noKartuPeserta'];
                $newptp->norujukan= $request['noRujukan'];
              
                $objectrekananfk = $request['namaPenjamin'];
            }else{
                $newptp->noasuransilain= $request['noKartuPeserta'];
                $objectrekananfk = $request['namaPenjamin'];
            }
            $newptp->notelepon= $request['noTelpon'];
            $newptp->objectpegawaifk=  ($request['dokter']?$request['dokter']:null);

            if( $request ['isBaru'] == true){
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            }else{
                if( $request ['isTelemedicine'] == true) {
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                    $newptp->istelemedicine = 1;
                }else{
                    $newptp->tipepasien = "LAMA";
                    $newptp->type = "LAMA";
                }
            }

           $newptp->isconfirm= 1;

            if(isset($pasien) && !empty($pasien)){
                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }   
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;
        
                $newptp->noaditional= $pasien->noaditional;

                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;
            }
            
            
             $pasiendaftar = array(
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'tglregistrasidate'=> date('Y-m-d', strtotime($request['tglReservasiFix'])),
                'nocmfk'=> $pasien->id,
                'objectruanganfk'=> $request['poliKlinik'],
                'objectdepartemenfk'=> 18,
                'objectkelasfk'=> 6,//nonkelas
                'objectkelompokpasienlastfk'=> $tipepembayaran,//umum
                'objectrekananfk'=> $objectrekananfk,
                'tipelayanan'=> 1,//reguler
                'objectpegawaifk'=> 1,
                'noregistrasi'=> '',
                'norec_pd'=> '',
                'israwatinap'=> 'false',
                'statusschedule'=> $noreservasi,
                'istelemedicine'=>'false',
                'jaminankhusus'=>'',
                'catatan'=>null,
                'objectruanganasalfk'=>$request['poliKlinik'],
                'statuspasien'=>'LAMA',
                'objectkasuspenyakitlastfk'=> '1',
                'sensus'=>null,
                'namahafis'=>$request['namahafis']
             );
             $antrianpasiendiperiksa = array(
                'norec_apd'=> '',
                'tglregistrasi'=> $request ['tglReservasiFix'],
                'objectruanganfk'=> $request['poliKlinik'],
                'objectkelasfk'=> 6,//nonkelas
                'objectpegawaifk'=> 1,
                'objectkamarfk'=> null,
                'nobed'=> null,
                'objectdepartemenfk'=> 18,
                'objectasalrujukanfk'=> 5,//Datang Sendiri
                'israwatgabung'=> 0,
                'namahafis'=>$request['namahafis']
             );
             $objSave = array(
                'pasiendaftar'=> $pasiendaftar,
                'antrianpasiendiperiksa'=> $antrianpasiendiperiksa
             );
            //  DB::commit();
            // $result = array(
            //     "status" => 201,
            //     "message" => 'Simpan Reservasi',
            //     "noreservasi" => '22d78df',
            //     "as" => 'ramdan@epic',
            // );
            // return $this->setStatusCode($result['status'])->respond($result, $result['message']);
            $Parsing = $this->saveRegistrasiPasien($objSave);
          
            if($Parsing['status']==400){
                $transStatus = 'false';
                $transMessage = $Parsing['message'];
                $e="";
            }else{
                $newptp->save();
                $push = array(
                    'noregistrasi'=> $Parsing['dataPD']['noregistrasi'],
                    'jenispasien'=> $tipepembayaran,
                    'idruangan'=> $request['poliKlinik'],
                    'norec_apd'=> $Parsing['dataAPD']['norec'],
                    'idpegawai'=> 1,
                    'isDaftarKeDua'=> false
                );
                $karcis = $this->saveBiayaKarcis($push);
                $transStatus = 'true';
                $transMessage = "Simpan Reservasi";
            }
            
            
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh".$e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage." ".$e,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteReservasi(Request $request)
    {
        DB::beginTransaction();
        try {
            AntrianPasienRegistrasi::where('norec',$request['norec'])->update([
               'statusenabled'=>false,
               'isconfirm'=>false,
               'keterangan'=>$request['keterangan']
            ]);
            $transStatus = 'true';

            $transMessage = "Hapus Reservasi Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Reservasi Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdan@epic',
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
    public function batalReservasi(Request $request)
    {
        DB::beginTransaction();
        try {
            AntrianPasienRegistrasi::where('noreservasi',$request['noreservasi'])->update([
               'statusenabled'=>false,
               'isconfirm'=>false,
               'keterangan'=>$request['alasan']
            ]);
            $transStatus = 'true';

            $transMessage = "Hapus Reservasi Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Reservasi Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdan@epic',
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
    public function batalReservasiRo(Request $request)
    {
        DB::beginTransaction();
        try {
            $tglAyeuna = date('Y-m-d H:i:s');
            AntrianPasienRegistrasi::where('noreservasi',$request['noreservasi'])->update([
               'statusenabled'=>false,
               'isconfirm'=>false,
               'keterangan'=>$request['alasan']
            ]);
            PasienDaftar::where('statusschedule', $request['noreservasi'])
                    ->update([
                        'kdprofile' => 0,
                        'statusenabled' => false,
                        'tglpulang' => $tglAyeuna
                    ]);
            $dataaa = PasienDaftar::where('statusschedule', $request['noreservasi'])->first();
            AntrianPasienDiperiksa::where('noregistrasifk', $dataaa->norec)
                ->update([
                    'statusenabled' => false,
                    'tglkeluar' => $tglAyeuna,
                ]);
            $dataApd = AntrianPasienDiperiksa::where('noregistrasifk', $dataaa->norec)->first();
            PelayananPasien::where('noregistrasifk', $dataApd->norec)
                ->update([
                    'statusenabled' => false,
                ]);
            $newBR = new BatalRegistrasi();
            $norec = $newBR->generateNewId();
            $newBR->norec = $norec;
            $newBR->kdprofile = 0;
            $newBR->statusenabled = true;
            $newBR->alasanpembatalan = $request['alasan'];
            $newBR->pasiendaftarfk = $dataaa->norec;
            $newBR->pembatalanfk = '1';
            $newBR->tanggalpembatalan = $tglAyeuna;
            $newBR->save();
            $transStatus = 'true';

            $transMessage = "Hapus Reservasi Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Reservasi Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdan@epic',
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
    public function deleteReservasiVaksin(Request $request)
    {
        DB::beginTransaction();
        try {
            PasienDaftarVaksin::where('noregistrasi',$request['noregistrasi'])->update([
               'statusenabled'=>false,
               'keterangan'=>$request['keterangan']
            ]);
            $transStatus = 'true';

            $transMessage = "Hapus Reservasi Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Reservasi Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdan@epic',
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
    public function sudahSelesaiVaksin(Request $request)
    {
        DB::beginTransaction();
        try {
            PasienDaftarVaksin::where('noregistrasi',$request['noregistrasi'])->update([
               'objectstatuspulangfk'=>$request['statuspulang']
            ]);
            $transStatus = 'true';

            $transMessage = "Simpan Sudah Vaksin Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Sudah Vaksin Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdan@epic',
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
    public function simpanVaksin(Request $request)
    {
        DB::beginTransaction();
        try {
           
            PasienDaftarVaksin::where('noregistrasi',$request['noregistrasi'])->update([
               'pertama'=>$request['pertama'],
               'kedua'=>$request['kedua']
            ]);
            $transStatus = 'true';

            $transMessage = "Simpan Vaksin Sukses";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Vaksin Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdan@epic',
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
    public function saveAntrianTouchscreen(Request $request){

        $dataLogin = $request->all();
        DB::beginTransaction();
        $noRec='';
        $tglAyeuna = date('Y-m-d H:i:s');
        $tglAwal = date('Y-m-d 00:00:00');
        $tglAkhir = date('Y-m-d 23:59:59');
        $kdRuanganTPP = $this->settingDataFixed('idRuanganTPP1');
        try {
            $newptp = new AntrianPasienRegistrasi();
            $norec = $newptp->generateNewId();
            $nontrian= AntrianPasienRegistrasi::where('jenis',$request['jenis'])
                    ->whereBetween('tanggalreservasi',[$tglAwal,$tglAkhir])
                    ->max('noantrian')+1;
            $newptp->norec = $norec;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $kdRuanganTPP;
            $newptp->objectjeniskelaminfk = 0;
            $newptp->noantrian = $nontrian;
            $newptp->noreservasi = "-";
            $newptp->objectpendidikanfk = 0;
            $newptp->tanggalreservasi = $tglAyeuna;
            $newptp->tipepasien = "BARU";
            $newptp->type = "BARU";
            $newptp->jenis = $request['jenis'];
            $newptp->statuspanggil = 0;
            $newptp->save();
            $noRec=$newptp->norec;


            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {
         
            DB::commit();
            $result = array(
                "noRec" =>$noRec,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
  public function getRuanganByKodeInternal($kode)
    {
        $data = \DB::table('ruangan_m')
            ->where('statusenabled',true)
            ->where('kdinternal', '=',$kode)
            ->first();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getDiagnosaByKode($kode)
    {
        $data = \DB::table('diagnosa_m')
            ->where('statusenabled',true)
            ->where('kddiagnosa', '=',$kode)
            ->first();

        $result = array(
            'data' => $data,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
	public function getSlottingByRuangan($kode,$tgl)
	{
		$dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
			->select('apr.norec','apr.tanggalreservasi')
			->whereRaw(" format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
			->where('apr.objectruanganfk', $kode)
			->where('apr.noreservasi','!=','-')
			->whereNotNull('apr.noreservasi')
			->where('apr.statusenabled',true)
			->get();

		$ruangan = \DB::table('ruangan_m as ru')
			->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
			->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
				'slot.quota',
				DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam"))
			->where('ru.statusenabled', true)
			->where('ru.id', $kode)
			->where('slot.statusenabled', true)
			->first();
		$begin = new Carbon($ruangan->jambuka);
//		return $this->respond($begin);
		$end = new Carbon($ruangan->jamtutup);
		$waktuPerorang = ((float)$ruangan->totaljam / (float)$ruangan->quota) * 60;
		$waktuPerorang = $waktuPerorang . ' min';
		$interval = \DateInterval::createFromDateString($waktuPerorang . ' min');
		$times = new \DatePeriod($begin, $interval, $end);
//		return $dataReservasi;
		$jamArr = [];
		foreach ($times as $time) {
			$jamArr []= array(
				'jam' => $time->format('H:i'),
//				'disable' => true,
			);
		}

		$i =0;
		$reservasi = [];
		foreach ($dataReservasi as $items){
			$jamUse =  new Carbon($items->tanggalreservasi);
			$reservasi [] = array(
				'jamreservasi' => $jamUse->format('H:i')
			);
		}
//		foreach ($jamArr as $itemJam) {
//				foreach ($dataReservasi as $items){
//					$jamUse = new \DateTime( $items->tanggalreservasi);
//					if ($jamUse->format('H:i') == $itemJam['jam']) {
//						array_splice( $jamArr,$i,count($jamArr));
//					}
//			}
//			$i = $i +1;
//
//		}
//			if(count($dataReservasi) > 0){
//				foreach ($dataReservasi as $items){
//					$jamUse = new \DateTime( $items->tanggalreservasi);
//					$jamUse2 = $time->format('H:i');
//					if ($jamUse->format('H:i') == $time->format('H:i')) {
//						$jam []= array(
//							'jam' => $time->format('H:i'),
//							'disable' => false,
//						);
////						break;
//					}
//
////					else{
////						$jam []= array(
////							'jam' => $time->format('H:i'),
////							'disable' => true,
////						);
////					}
//				}
//			}
//			else{
//				$jam [] =array(
//					'jamaktif' =>$time->format('H:i'),
//					'disable' => false,
//				);
//			}

//		}
		$slot  = array(
			'id' => $ruangan->id,
			'namaruangan' => $ruangan->namaruangan,
			'objectdepartemenfk' => $ruangan->objectdepartemenfk,
			'jambuka' => $ruangan->jambuka,
			'jamtutup' => $ruangan->jamtutup,
			'totaljam' => $ruangan->totaljam,
			'quota' => $ruangan->quota,
			'waktu' => $waktuPerorang,
			'listjam' => $jamArr
		);
		$result = array(
			'slot' => $slot,
			'reservasi' => $reservasi,
//			'$jamUse' => $jamUse->format('H:i'),
//			'$jamUse2' => $jamUse2,
			'as' => 'ramdan@epic',
		);
		return $this->respond($result);
	}
	public function getDaftarSlotting(Request $request){

		$ruangan = \DB::table('ruangan_m as ru')
			->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
			->select('ru.id as idruangan','slot.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
				'slot.quota',
				DB::raw("date_part('hour',slot.jamtutup) -date_part('hour', slot.jambuka)as totaljam"))
			->where('ru.statusenabled', true)
			->where('slot.statusenabled', true);
//			->where('ru.id', $kode)
		if(isset($request['namaRuangan']) && $request['namaRuangan']!='undefined' && $request['namaRuangan']!=''){
			$ruangan =$ruangan->where('ru.namaruangan','like','%'.$request['namaRuangan'].'%');
		}
		if(isset($request['quota']) && $request['quota']!='undefined' && $request['quota']!=''){
			$ruangan =$ruangan->where('slot.quota','=',$request['quota']);
		}
        if(isset($request['id']) && $request['id']!='undefined' && $request['id']!=''){
			$ruangan =$ruangan->where('slot.id','=',$request['id']);
		}
		$ruangan=$ruangan->get();

		$result = array(
			'data' => $ruangan,
			'as' => 'ramdan@epic',
		);
		return $this->respond($result);
	}
	public function saveSlotting(Request $request){

		DB::beginTransaction();
		try {
			if($request['id'] == ''){
				$newptp = new SlottingOnline();
				$newptp->id = SlottingOnline::max('id')+1;
				$newptp->statusenabled = true;
				$newptp->kdprofile = 11;
			}else{
				$newptp = SlottingOnline::where('id',$request['id'])->first();
			}

			$newptp->objectruanganfk = $request['objectruanganfk'];
			$newptp->jambuka = $request['jambuka'];
			$newptp->jamtutup =  $request['jamtutup'];
			$newptp->quota =  $request['quota'];
			$newptp->save();

			$transMessage = "Simpan Slotting";
			$transStatus = 'true';
		} catch (\Exception $e) {
			$transStatus = 'false';
			$transMessage = "Simpan Slotting Gagal";
		}

		if ($transStatus != 'false') {
			DB::commit();
			$result = array(
				"data" =>$newptp,
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
	public function deleteSlotting(Request $request){

		try {
			SlottingOnline::where('id',$request['id'])->delete();
			$transMessage = "Sukses ";
			$transStatus = 'true';
		} catch (\Exception $e) {
			$transStatus = 'false';
			$transMessage = "Hapus slotting Gagal";
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
    public function getSlottingByRuanganNew($kode,$tgl)
    {
        $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
            ->select('apr.norec','apr.tanggalreservasi')
            ->whereRaw(" to_char(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
            ->where('apr.objectruanganfk', $kode)
            ->where('apr.noreservasi','!=','-')
            ->whereNotNull('apr.noreservasi')
            ->where('apr.statusenabled',true)
            ->get();

        $ruangan = \DB::table('ruangan_m as ru')
            ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
                'slot.quota',
                DB::raw("(EXTRACT(EPOCH FROM slot.jamtutup) - EXTRACT(EPOCH FROM slot.jambuka))/3600 as totaljam"))
//                DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam"))
            ->where('ru.statusenabled', true)
            ->where('ru.id', $kode)
            ->where('slot.statusenabled', true)
            ->first();
        if(empty($ruangan)){
            $result = array(
                'tanggal'=> null,
                'slot' => null,
                'reservasi' => null,
                'message' => 'Slot belum tersedia di Poli ini',
            );
            return $this->respond($result);
        }

	    $begin = new Carbon($ruangan->jambuka);
	    $jamBuka = $begin->format('H:i');
	    $end = new Carbon($ruangan->jamtutup);
	    $jamTutup = $end->format('H:i');
	    $quota =(float)$ruangan->quota;
        $waktuPerorang = ((float)$ruangan->totaljam / (float)$ruangan->quota) * 60;

        $i =0;
        $reservasi = [];
        foreach ($dataReservasi as $items){
            $jamUse =  new Carbon($items->tanggalreservasi);
            $reservasi [] = array(
                'jamreservasi' => $jamUse->format('H:i')
            );
        }

        $slot  = array(
            'id' => $ruangan->id,
            'namaruangan' => $ruangan->namaruangan,
            'objectdepartemenfk' => $ruangan->objectdepartemenfk,
            'jambuka' => $jamBuka,
            'jamtutup' => $jamTutup,
            'totaljam' =>(float) $ruangan->totaljam,
            'quota' => (float)$quota,
            'interval' => $waktuPerorang,
//            'listjam' => $jamArr
        );
        $result = array(
        	'tanggal'=> $tgl,
            'slot' => $slot,
            'reservasi' => $reservasi,
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
     public function getListDataAndroid(Request $request)
    {

        $deptJalan = explode (',',$this->settingDataFixed('kdDepartemenReservasiOnline'));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item){
            $kdDepartemenRawatJalan []=  (int)$item;
        }

        $dataRuanganJalanKiosk = \DB::table('ruangankiosk_m as ru')
            // ->join('ruangan_m as ru2', 'ru2.id', '=', 'ru.kodeexternal')
            ->select('ru.kodeexternal as id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal','ru.id as idruangankiosk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->wherenotin('ru.id', array(12,448,535,243,255,322,251,544,249))
            ->orderBy('ru.namaruangan')
            ->get();

        $kelompokPasien = \DB::table('kelompokpasien_m')
            ->select('id','kelompokpasien')
            ->where('statusenabled', true)
            ->whereIn('id', array(1,2,3,12))
            ->orderBy('kelompokpasien')
            ->get();

        $dataAsalRujukan = \DB::table('asalrujukan_m as as')
            ->select('as.id','as.asalrujukan')
            ->where('as.statusenabled', true)
            ->orderBy('as.asalrujukan')
            ->get();
        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter');
        $dkoter = \DB::table('pegawai_m')
            ->select('idhafis','namahafis','id')
            ->where('statusenabled', true)
            ->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
            ->orderBy('namalengkap')
            ->get();
        

        $result = array(
            'ruanganrajal' => $dataRuanganJalanKiosk,
            'kelompokpasien' => $kelompokPasien,
            'asalrujukan' => $dataAsalRujukan,
            'dokter' => $dkoter,
            'message' => 'snap',
        );

        return $this->respond($result);
    }
    public function getJadwalDokterall(Request $request)
    {
        $data = \DB::table('pegawai_m as pg')
        ->select(
            'pg.id',
            'pg.namalengkap',
            'pg.photo',
            'pg.namahafis',
            'pg.idhafis'
        )

            ->where('pg.id', '<>', 1)
            ->where('pg.objectjenispegawaifk', '1')
            ->orderByRaw('pg.namalengkap');

        if (
            isset($request['namalengkap']) &&
            $request['namalengkap'] != "" &&
            $request['namalengkap'] != "undefined"
        ) {
            $data = $data->where('pg.namalengkap', 'like', '%' . $request['namalengkap'] . '%');
        };

        if (
            isset($request['idPegawai']) &&
            $request['idPegawai'] != "" &&
            $request['idPegawai'] != "undefined"
        ) {
            $idPegawai = $request['idPegawai'];
            $data = $data->whereRaw("pg.id in ( $idPegawai )");
        };

        $data = $data->get();
        $data10 = [];
        $data11 = [];
        $sama = false;
        foreach ($data as $item) {


            $data10[] = array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
                'namahafis' => $item->namahafis,
                'idhafis' => $item->idhafis,
            );

            foreach ($data10 as $key => $row) {
                $count[$key] = $row['id'];
            }
            array_multisort($count, SORT_ASC, $data10);
        }
        return $this->respond($data10);
    }
    public function getSlottingVaksin($tgl)
    {
        // return(substr($tgl,5,2));
        // die();
        if($tgl=='2021-07-10' || $tgl=='2021-07-11' || $tgl=='2021-07-12'
        || $tgl=='2021-07-13' || $tgl=='2021-07-20' || $tgl=='2021-08-10' || $tgl=='2021-08-11'
        || $tgl=='2021-08-17' || $tgl=='2021-10-20'){
            $result = array(
                'status' => 400,
                'message' => 'Slot sudah Penuh di Tanggal ini, Coba dihari lain.',
            );
            return $this->respond($result);
        }
        if(substr($tgl,0,4)>2021){
            $result = array(
                'status' => 400,
                'message' => 'pendaftaran vaksin sudah di tutup, menunggu informasi selanjutnya.',
            );
            return $this->respond($result);
        }
        // else if(substr($tgl,5,2)>7){
            
        //     if(substr($tgl,5,2)>8){
        //         $result = array(
        //             'status' => 400,
        //             'message' => 'pendaftaran vaksin sudah di tutup, menunggu informasi selanjutnya.',
        //         );
        //         return $this->respond($result);
        //     }else if(substr($tgl,8,2)>31){
        //     // }else if(substr($tgl,8,2)!=19){
        //         $result = array(
        //             'status' => 400,
        //             'message' => 'pendaftaran vaksin sudah di tutup, menunggu informasi selanjutnya.',
        //         );
        //         return $this->respond($result);
        //     }
        // }
        $dataVaksin = \DB::table('pasiendaftarvaksin_t as pdv')
            ->select('pdv.norec','pdv.tglvaksin','pdv.nohp','pdv.alamat','pdv.tgllahir')
            ->where('pdv.tglvaksin', 'like', '%'. $tgl .'%')
            ->where('pdv.statusenabled',true)
            ->get();

        if($tgl=='2021-07-14'){
            if (count($dataVaksin) > 149) {
                $result = array(
                    'status' => 400,
                    'message' => 'Slot sudah Penuh di Tanggal ini, Coba dihari lain.',
                );
                return $this->respond($result);
            }    
        }else{
            if (count($dataVaksin) > 149) {
                $result = array(
                    'status' => 400,
                    'message' => 'Slot sudah Penuh di Tanggal ini, Coba dihari lain.',
                );
                return $this->respond($result);
            }
        }

	    
        $result = array(
            'status' => 200,
        	'message' => 'Slot Masih Tersedia ',
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getHistoryVaksin($nik)
    {
        $dataVaksin = \DB::table('pasiendaftarvaksin_t as pdv')
            ->select('pdv.norec','pdv.noregistrasi','pdv.nohp','pdv.alamat','pdv.tgllahir',
            'jk.id','jk.jeniskelamin','pdv.objectpkfk','pk.pekerjaan','pdv.namapasien',
            DB::raw("convert(varchar,pdv.tglvaksin,105) as tglvaksin"))
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'pdv.objectjkfk')
            ->join('pekerjaan_m as pk', 'pk.id', '=', 'pdv.objectpkfk')
            ->where('pdv.nik', $nik)
            ->where('pdv.statusenabled',true)
            ->orderBy('pdv.tglvaksin')
            ->get();

	    
        $result = array(
            'data' => $dataVaksin,
            'status' => 200,
        	'message' => 'Slot Masih Tersedia ',
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getHistoryVaksinnoreservasi($noreservasi)
    {
        $dataVaksin = \DB::table('pasiendaftarvaksin_t as pdv')
            ->select('pdv.norec','pdv.noregistrasi','pdv.nohp','pdv.alamat','pdv.tgllahir',
            'jk.id','jk.jeniskelamin','pdv.objectpkfk','pk.pekerjaan','pdv.namapasien','pdv.nik','pdv.noantrian',
            DB::raw("convert(varchar,pdv.tglvaksin,20) as tglvaksin,convert(varchar,pdv.tglvaksin,108) as jamvaksin"))
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'pdv.objectjkfk')
            ->join('pekerjaan_m as pk', 'pk.id', '=', 'pdv.objectpkfk')
            ->where('pdv.noregistrasi', $noreservasi)
            ->where('pdv.statusenabled',true)
            ->orderBy('pdv.tglvaksin')
            ->get();

	    
        $result = array(
            'data' => $dataVaksin,
            'status' => 200,
        	'message' => 'Slot Masih Tersedia ',
            'as' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
	public function getDaftarSlottingAktif(Request $request)
	{
		$tglAwal = $request['tglAwal'].' 00:00';
		$tglAkhir = $request['tglAkhir']. ' 23:59';
		$ruangan = \DB::table('ruangan_m as ru')
			->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
			->select('ru.id as idruangan','slot.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
				'slot.quota',
				DB::raw("datepart(hour,slot.jamtutup) -datepart(hour, slot.jambuka)as totaljam
				"))
			->where('ru.statusenabled', true)
			->where('slot.statusenabled', true)
			->get();
		$slot = [];
		if(count($ruangan)> 0){
			foreach ($ruangan as $item){
				$waktuPerorang = ((float)$item->totaljam / (float)$item->quota) * 60;
				$slot [] = array(
					'id' => $item->id,
					'idruangan' => $item->idruangan,
					'namaruangan' => $item->namaruangan,
					'jambuka' => $item->jambuka,
					'jamtutup' => $item->jamtutup,
					'quota' =>(float) $item->quota,
					'totaljam' => (float) $item->totaljam,
					'interval' => $waktuPerorang,
					);

			}
		}

		$dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
			->select('apr.norec','apr.tanggalreservasi')
			->whereRaw("format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tglAwal'")
//			->where(" format(apr.tanggalreservasi,'yyyy-MM-dd') <= '$tglAkhir'")
//			->where('apr.objectruanganfk', $kode)
			->where('apr.noreservasi','!=','-')
			->whereNotNull('apr.noreservasi')
			->where('apr.statusenabled',true)
			->get();


		$result = array(
			'slotting' => $slot,
			'reservasi' => $dataReservasi,
			'as' => 'ramdan@epic',
		);
		return $this->respond($result);
	}
    public function getLiburSlotting(Request $request)
    {

     
        $data = \DB::table('slottinglibur_m')
            ->select(DB::raw("to_char(tgllibur,'yyyy-MM-dd') as tgllibur,id,statusenabled"))
            ->where('statusenabled', true)
            ->orderBy('tgllibur');
        if(isset($request['tgllibur']) && $request['tgllibur']!=''){
            $tgl = $request['tgllibur'];
            $data = $data->whereRaw("to_char(tgllibur,'yyyy-MM-dd') ='$tgl'");
        }    

        $data=$data->get();
   
        $result = array(
           
            'libur' => $data,
            'message' => 'ramdan@epic',
        );

        return $this->respond($result);
    }
      public function getRincianPelayanan($noRegister)
    {
//        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();

//        $pelayanan = $this->getPelayananPasienByNoRegistrasi($noRegister);
        $pelayanan = DB::select(DB::raw("select pd.objectruanganlastfk,pd.nostruklastfk,ps.id as psid,ps.nocm,
            ps.namapasien,pd.tglpulang,kps.kelompokpasien,kl.namakelas,
            pd.objectruanganlastfk,ru.objectdepartemenfk,
            pd.noregistrasi,pd.tglregistrasi,ru.namaruangan,
            pp.* 

            from pasiendaftar_t pd
            left JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec
            left JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec
            left JOIN pasien_m ps on ps.id=pd.nocmfk
            left JOIN kelas_m kl on kl.id=pd.objectkelasfk
            left JOIN kelompokpasien_m kps on kps.id=pd.objectkelompokpasienlastfk
            left JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk
            where pd.noregistrasi=:noregistrasi 
            --and pp.strukfk is null;
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );

        $pelayanantidakterklaim = DB::select(DB::raw("select pd.objectruanganlastfk,pd.nostruklastfk,ps.id as psid,ps.nocm,
            ps.namapasien,pd.tglpulang,kps.kelompokpasien,kl.namakelas,
            pd.objectruanganlastfk,ru.objectdepartemenfk,
            pd.noregistrasi,pp.* from pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasientidakterklaim_t pp on pp.noregistrasifk=apd.norec
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            INNER JOIN kelas_m kl on kl.id=pd.objectkelasfk
            INNER JOIN kelompokpasien_m kps on kps.id=pd.objectkelompokpasienlastfk
            INNER JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk
            where pd.noregistrasi=:noregistrasi 
            --and pp.strukfk is null;
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
//        $pelayanan=$pelayanan[0];
//        $billing = $this->getBillingFromPelayananPasien($pelayanan);
        $totalBilling = 0;
        $totalKlaim = 0;
        $totalDeposit = 0;
        $totaltakterklaim =0;

        foreach ($pelayanantidakterklaim as $values) {
//            if ($values->produkfk == $this->getProdukIdDeposit()) {
//                $totalDeposit = $totalDeposit + $values->hargajual;
//            } else {
                $totaltakterklaim = $totaltakterklaim + (($values->hargajual - $values->hargadiscount) * $values->jumlah) + $values->jasa;
//            }
        }

        foreach ($pelayanan as $value) {
            if ($value->produkfk == $this->getProdukIdDeposit()) {
                $totalDeposit = $totalDeposit + $value->hargajual;
            } else {
                $totalBilling = $totalBilling + (($value->hargajual - $value->hargadiscount) * $value->jumlah) + $value->jasa;
            }

        }

//        $billing = new \stdClass();
//        $billing->totalBilling = $totalBilling;
//        $billing->totalKlaim= $totalKlaim;
//        $billing->totalDeposit = $totalDeposit;

        $totalBilling = $totalBilling;
//        $isRawatInap  = $this->isPasienRawatInap2($pelayanan);
        $pelayanan = $pelayanan[0];
        $isRawatInap = false;
        if ($pelayanan->objectruanganlastfk != null) {
            if ((int)$pelayanan->objectdepartemenfk == 16) {
                $isRawatInap = true;
            }
        }


        $dataTotaldibayar = DB::select(DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                where  pd.noregistrasi=:noregistrasi and sp.nosbmlastfk is not null and pp.produkfk not in (402611);
            "),
            array(
                'noregistrasi' => $noRegister ,
            )
        );
        $dibayar=0;
        $dibayar = $dataTotaldibayar[0]->total;

        $totalDeposit = $totalDeposit;
        $totalKlaim = 0;
        $result = array(
            'pasienID' => $pelayanan->psid,
            'noCm' => $pelayanan->nocm,
            'noRegistrasi' => $pelayanan->noregistrasi,
            'namaPasien' => $pelayanan->namapasien,
            'tglPulang' => $pelayanan->tglpulang,
            'jenisPasien' => $pelayanan->kelompokpasien,
            'kelasRawat' => $pelayanan->namakelas,
            'tglRegistrasi' => $pelayanan->tglregistrasi,
            'ruangan' => $pelayanan->namaruangan,
            'noAsuransi' => '-', //ambil dari asuransi pasien -m tapi datanya blum ada brooo..
            'kelasPenjamin' => '-', //ini blum ada datanya gimana mau munculin,, gila yaa ?
            'billing' => $totalBilling,
            'penjamin' => '',//$penjamin=$this->getPenjamin($pelayanan)->namarekanan,
            'deposit' => $totalDeposit, //ngambil dari mana
            'totalKlaim' => $totalKlaim, //ngambil dari mana? dihitunga gak
            'jumlahBayar' => $dibayar,//$totalBilling - $totalDeposit - $totalKlaim, //jumlah bayar ini perlu gak
            'jumlahBayarNew' =>  $totalBilling - $totalDeposit - $totalKlaim - $totaltakterklaim, //jumlah bayar dengan tindakan yang tidak d klaim
            'jumlahPiutang' => 0, //ini ngambil dari pembayaran gak ?
            'needDokument' => true, //ini ngambil ddokument dari mana ? pake datafixed
            'dokuments' => [], // sama ini juga ngambilnya dari mana ..
            'totaltakterklaim' => $totaltakterklaim,
            'isRawatInap' => $isRawatInap,
        );
        return $this->respond($result);
    }
    public function getSetting(Request $request){
        $data = \DB::table('settingdatafixed_m')
            ->select('nilaifield')
            ->where('statusenabled', true)
            ->where('namafield', $request['namaField'])
            ->first();
   
        return $this->respond($data->nilaifield);
    }   
    public  function cekReservasiDipoliYangSama(Request $request)
    {       
            $tgl =$request['tglReservasi'];
           if($request['tipePasien']=='baru' ){
               $tglLahir =$request['tglLahir'];
               $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                    ->select('apr.norec','apr.tanggalreservasi')
                    ->whereRaw("format(apr.tanggalreservasi,'yyyy-MM-dd' )= '$tgl'")
//                    ->where('apr.objectruanganfk', $request['ruanganId'])
                    ->where('apr.noreservasi','!=','-')
                    ->where('apr.namapasien',$request['namaPasien'])
                    ->whereRaw("format(apr.tgllahir,'yyyy-MM-dd') = '$tglLahir'")
                    ->whereNotNull('apr.noreservasi')
                    ->where('apr.statusenabled',true)
                    ->where('apr.objectkelompokpasienfk',2)
                    ->get();
           }else{
             $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                    ->join('pasien_m as ps','ps.id','=','apr.nocmfk')
                    ->select('apr.norec','apr.tanggalreservasi','ps.nocm')
                    ->whereRaw("format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
//                    ->where('apr.objectruanganfk', $request['ruanganId'])
                    ->where('apr.noreservasi','!=','-')
                    ->where('ps.nocm',$request['noCm'])
                    ->whereNotNull('apr.noreservasi')
                    ->where('apr.statusenabled',true)
                    // ->where('apr.objectkelompokpasienfk',2)
                    ->get();
           }

           $result = array(
                'data' =>  $dataReservasi,
                'msg' => 'er@epic'
             );
           return $this->respond($result);
           
    }
    public function getTagihanEbilling($noregistasi)
    {
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('strukresep_t as sre', 'sre.norec', '=', 'pp.strukresepfk')
            ->select('pp.norec', 'pp.tglpelayanan', 'pp.rke', 'pr.id as prid', 'pr.namaproduk', 'pp.jumlah', 'kl.id as klid', 'kl.namakelas',
                'ru.id as ruid', 'ru.namaruangan', 'pp.produkfk', 'pp.hargajual', 'pp.hargadiscount', 'sp.nostruk', 'sp.tglstruk', 'apd.norec as norec_apd',
                'sbm.nosbm', 'sp.norec as norec_sp', 'pp.jasa', 'pd.nocmfk',
                'pd.nostruklastfk','pd.noregistrasi',
                'pd.tglregistrasi', 'pd.norec as norec_pd', 'pd.tglpulang',
                'pd.objectrekananfk as rekananid',
                'pp.jasa',  'sp.totalharusdibayar', 'sp.totalprekanan',
                'sp.totalbiayatambahan','pp.aturanpakai','pp.iscito','pd.statuspasien','pp.isparamedis','pp.strukresepfk'
            )
            ->where('pd.noregistrasi', $noregistasi);
//          ->orderBy('pp.tglpelayanan', 'pp.rke');

        $pelayanan = $pelayanan->get();

        if (count($pelayanan) > 0) {
            $details = array();
            foreach ($pelayanan as $value) {
                if($value->prid != $this->getProdukIdDeposit()){
                    $jasa = 0;
                    if (isset($value->jasa) && $value->jasa != "" && $value->jasa != null) {
                        $jasa =(float) $value->jasa;
                    }

                    $harga = (float)$value->hargajual;
                    $diskon = (float)$value->hargadiscount;
                    $detail = array(
                        'norec' => $value->norec,
                        'tglPelayanan' => $value->tglpelayanan,
                        'namaPelayanan' => $value->namaproduk,
                        'jumlah' => (float)$value->jumlah,
                        'kelasTindakan' => @$value->namakelas,
                        'ruanganTindakan' => @$value->namaruangan,
                        'harga' => $harga,
                        'diskon' => $diskon,
                        'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'strukfk' => $value->nostruk ,
                        'sbmfk' => $value->nosbm,
                        'pgid' => '',
                        'ruid' => $value->ruid,
                        'prid' => $value->prid,
                        'klid' => $value->klid,
                        'norec_apd' => $value->norec_apd,
                        'norec_pd' => $value->norec_pd,
                        'norec_sp' => $value->norec_sp,
                        'jasa' => $jasa,
                        'aturanpakai' => $value->aturanpakai,
                        'iscito' => $value->iscito,
                        'isparamedis' => $value->isparamedis,
                        'strukresepfk' => $value->strukresepfk
                    );

                    $details[] = $detail;
                }
                

            }
        }

        $arrHsil = array(
            'details' => $details,
            'deposit' =>  $this->getDepositPasien($noregistasi),
            'totalklaim' =>  $this->getTotalKlaim($noregistasi),
            'bayar' =>  $this->getTotolBayar($noregistasi),
        );
        return $this->respond($arrHsil);
    }

    public  function getTotalKlaim($noregistrasi)
    {
       $pelayanan =collect(\DB::select("select sum(x.totalppenjamin) as totalklaim
         from (select spp.norec,spp.totalppenjamin
         from pasiendaftar_t as pd
            join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            join pelayananpasien_t as pp on pp.noregistrasifk =apd.norec
            join strukpelayanan_t as sp on sp.norec= pp.strukfk
            join strukpelayananpenjamin_t as spp on spp.nostrukfk=sp.norec
            where pd.noregistrasi ='$noregistrasi'
        and spp.statusenabled is null 
        GROUP BY spp.norec,spp.totalppenjamin

        ) as x"))->first();
        if(!empty($pelayanan) && $pelayanan->totalklaim!= null){
             return (float) $pelayanan->totalklaim;
         }else{
            return 0;
         }
       

    }
    public function getTotolBayar($noregistrasi)
    {
      $pelayanan =collect(\DB::select("select sum(x.totaldibayar) as totaldibayar
         from (select sbm.norec,sbm.totaldibayar
         from pasiendaftar_t as pd
        join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        join pelayananpasien_t as pp on pp.noregistrasifk =apd.norec
        join strukpelayanan_t as sp on sp.norec= pp.strukfk
        join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
        where pd.noregistrasi ='$noregistrasi'
        and sp.statusenabled is null 
        and sbm.statusenabled =1
        GROUP BY sbm.norec,sbm.totaldibayar

        ) as x"))->first();
        if(!empty($pelayanan) && $pelayanan->totaldibayar!= null){
             return (float) $pelayanan->totaldibayar;
         }else{
            return 0;
         }
       
        
    }
    public function getNomorRekening(Request $request){
        $data = \DB::table('bankaccount_m')
            ->select('*')
            ->where('statusenabled', true)
            ->get();
    
        $result  = array('data' => $data,
                    'as'=> 'er@epic' );
        return $this->respond($result);
    }

    public function UpdateStatConfirm(Request $request)
    {
//        $data=$request['data'];
//        return $this->respond($data);
        try {
//            foreach ($data as $item) {
            $dataApr = AntrianPasienRegistrasi::where('noreservasi', $request['noreservasi'])
                ->update([
                    'isconfirm' => true,
//                        'objectstatusbarang'=> 2
                ]);
//            }

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Status Gagal";
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Status Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                    "as" => 'cepot',
            );
        } else {
            $transMessage = "Update Status Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                    "as" => 'Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateNoCmInAntrianRegistrasi(Request $request)
    {
        try {

            $dataApr = AntrianPasienRegistrasi::where('norec', $request['norec'])
                ->update([
                    'nocmfk' => $request['nocmfk'],
                ]);

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Reconfirm";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Reconfirm Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function  getPasienByNoRegistrasi($noregistrasi){
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftjoin ('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin ('kelas_m as kls','kls.id','=','pd.objectkelasfk')
            ->leftjoin ('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->leftjoin ('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin ('alamat_m as alm','alm.id','=','pd.nocmfk')
            ->leftjoin ('agama_m as agm','agm.id','=','ps.objectagamafk')
            ->select('pd.norec as norec_pd','pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien',
                'ps.tgllahir','ps.namakeluarga','ru.namaruangan','kls.namakelas','kps.kelompokpasien','rk.namarekanan','alm.alamatlengkap',
                'jk.jeniskelamin','agm.agama','ps.nohp','pd.statuspasien','pd.tglpulang')
            ->where('pd.noregistrasi', $noregistrasi)
            ->first();

        $result = array(
            'data'=> $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDaftarRiwayatRegistrasi( Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            ->select(DB::raw("pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pd.objectruanganlastfk,ru.namaruangan,
			                  pd.objectpegawaifk,pg.namalengkap as namadokter,pd.tglpulang,ru.objectdepartemenfk,
			                  CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap,ps.tgllahir"))
            ->whereNull('br.pasiendaftarfk');

//        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
//            $data = $data->where('ps.tgllahir','>=', $request['tglLahir'].' 00:00');
//        };
//        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
//            $data = $data->where('ps.tgllahir','<=', $request['tglLahir'].' 23:59');
//        };
        if(isset($request['norm']) && $request['norm']!="" && $request['norm']!="undefined") {
            $data = $data->where('ps.nocm', 'like', '%'. $request['norm'] .'%');
        };
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined") {
            $data = $data->where('ps.namapasien', 'like', '%'. $request['namaPasien'] .'%');
        };
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        };
        if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
            $data = $data->where('pd.objectruanganlastfk','=', $request['idRuangan']);
        };

        $data = $data->where('ps.statusenabled',true);
        $data = $data->orderBy('pd.tglregistrasi');
        $data=$data->get();
        $result = array(
            'daftar' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function cekPasienByNik($nik) {
        $data =  Pasien::where('noidentitas',$nik)
            ->where('statusenabled',true)->get();

         foreach ($data as $item){
                if($item->foto != null){
                    $item->foto = "data:image/jpeg;base64," . base64_encode($item->foto);
                }
            }
        $result = array(
            'data'=> $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveLibur(Request $request){

        DB::beginTransaction();
        try {
            $tgl =[];
              foreach ($request['listtanggal'] as $key => $value) {
                $tgl [] = $value['tgl'];
              }
            $del = SlottingLibur::whereIn('tgllibur',$tgl)->delete();
            foreach ($request['listtanggal'] as $key => $value) {

                $newptp = new SlottingLibur();
                $newptp->id = SlottingLibur::max('id')+1;
                $newptp->statusenabled = true;
                $newptp->kdprofile = 11;
                $newptp->tgllibur = $value['tgl'];
                $newptp->save();
            }
            

            $transMessage = "Simpan Libur";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Libur Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "data" =>$newptp,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
//              "noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
      public function deleteLibur(Request $request){

        DB::beginTransaction();
        try {
            
            $newptp= SlottingLibur::where('id',$request['id'])->update(
                ['statusenabled' => false ]
            );            

            $transMessage = "Hapus Libur";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Libur Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                // "data" =>$newptp,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
//              "noRec" =>$noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
      public function getLibur( Request $request) {
        $data = \DB::table('slottinglibur_m as ps')
            ->select('ps.*')
            ->where('ps.statusenabled',true);

        if(isset($request['tgllibur']) && $request['tgllibur']!="" && $request['tgllibur']!="undefined") {
            $tgls= $request['tgllibur'];
            $data = $data->whereRaw("format(ps.tgllibur,'yyyy-MM-dd')= 'tgls'");
        };
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined") {
            $data = $data->where('ps.namapasien', 'like', '%'. $request['namaPasien'] .'%');
        };
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        };
        if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
            $data = $data->where('pd.objectruanganlastfk','=', $request['idRuangan']);
        };


        $data = $data->orderBy('ps.id');
        $data= $data->get();
        $result = array(
            'daftar' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function GetJamKosong($kode,$tgl){
        $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
            ->select('apr.norec','apr.tanggalreservasi')
            ->whereRaw(" format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
            ->where('apr.objectruanganfk', $kode)
            ->where('apr.noreservasi','!=','-')
            ->whereNotNull('apr.noreservasi')
            ->where('apr.statusenabled',true)
            ->orderBy('apr.tanggalreservasi')
            ->get();

        $ruangan = \DB::table('ruangan_m as ru')
            ->join('slottingonline_m as slot', 'slot.objectruanganfk', '=', 'ru.id')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk', 'slot.jambuka', 'slot.jamtutup',
                'slot.quota',
                DB::raw("DATEDIFF(second,  	[slot].[jambuka],	[slot].[jamtutup]) / 3600.0 AS totaljam "))
            ->where('ru.statusenabled', true)
            ->where('ru.id', $kode)
            ->where('slot.statusenabled', true)
            ->first();

        $begin = new Carbon($ruangan->jambuka);
        $jamBuka = $begin->format('H:i');
        $end = new Carbon($ruangan->jamtutup);
        $jamTutup = $end->format('H:i');
        $quota =(float)$ruangan->quota;
        $waktuPerorang = ((float)$ruangan->totaljam / (float)$ruangan->quota) * 60;

        $i =0;
        $slotterisi = 0;
        $jamakhir = '00:00';
        foreach ($dataReservasi as $items){
            $jamUse =  new Carbon($items->tanggalreservasi);
            $slotterisi += 1;
            $reservasi [] = array(
                'jamreservasi' => $jamUse->format('H:i')
            );
            $jamakhir = $jamUse->format('H:i');
        }

        $slotakhir = $quota-$slotterisi;
        if($slotakhir > 0){
            //$cenvertedTime = date('Y-m-d H:i:s',strtotime('+1 hour +30 minutes +45 seconds',strtotime($startTime)));

            $jamkosongpre = date('H:i',strtotime('+'.floor($waktuPerorang)." minutes",strtotime($jamakhir)));
            $jamkosongfix = new Carbon($jamkosongpre);
            $jamkosongfix = $jamkosongfix->format("H:i");
            return array("antrian"=>$slotterisi+1,"jamkosong"=>$jamkosongfix);
        }else{
            return array("antrian"=>0,"jamkosong"=>"00:00");
        }


    }


    public function GetNoAntrianMobileJKN(Request $request)
    {

//       $request =  array(
//           "nomorkartu" => "0000172381691",
//           "nik" => "3372051109800010",
//           "notelp" => "085642649135",
//           "tanggalperiksa" => "2020-10-09",
//           "kodepoli" => "JIW",
//           "nomorreferensi" => "0001R0040116A000001",
//           "jenisreferensi" => "1",
//           "jenisrequest" => "2",
//           "polieksekutif" => "0"
//       );

        $request = $request->json()->all();
//        print_r($request);
//        exit();

        if(empty($request['nomorkartu']) ) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Nomor Kartu BPJS tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['tanggalperiksa'])) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Tanggal Periksa tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$request['tanggalperiksa'])) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Format Tanggal Periksa salah"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if($request['tanggalperiksa'] >= date('Y-m-d',strtotime('+90 days',strtotime(date('Y-m-d'))))){
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Tanggal periksa maksimal 90 hari dari hari ini"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['nik']) ) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "NIK tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
        if(empty($request['kodepoli']) ) {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Kodepoli tidak boleh kosong"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['kodepoli'] != "JIW" ) {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Kodepoli tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }

        if(empty($request['jenisreferensi']) ) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Jenis Referensi tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['jenisreferensi'] < "1" || $request['jenisreferensi'] > "2") {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Jenis Referensi tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }

        if(empty($request['jenisrequest']) ) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Jenis Request tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['jenisrequest'] < "1" || $request['jenisrequest'] > "2") {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Jenis Request tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }

        if(empty($request['polieksekutif']) && $request['polieksekutif'] != "0") {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['polieksekutif'] < "0" || $request['polieksekutif'] > "1") {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }


        $antrian = $this->GetJamKosong(566,$request['tanggalperiksa']);

        try {
            DB::beginTransaction();
            $pasien = \DB::table('pasien_m')
                ->whereRaw("nobpjs = '". $request['nomorkartu']."'")
                ->where('statusenabled',true)
                ->first();
            if(isset($pasien) && !empty($pasien)){
                $tipepembayaran = '2';
                $tgl =$request['tanggalperiksa'];

                $dataReservasi = \DB::table('antrianpasienregistrasi_t as apr')
                    ->select('apr.noantrian','apr.noreservasi','ru.namaexternal','apr.tanggalreservasi')
                    ->join('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
                    ->whereRaw("apr.tanggalreservasi BETWEEN '$tgl' AND '".date('Y-m-d',strtotime('+1 day',strtotime($tgl)))."'")
                    ->where('apr.objectruanganfk','=', 566)
                    ->where('apr.noreservasi','!=','-')
                    ->where('apr.noidentitas','=',$request['nik'])
                    ->where('apr.nobpjs','=',$request['nomorkartu'])
                    ->whereNotNull('apr.noreservasi')
                    ->where('apr.statusenabled',true)
                    ->first();
                if(isset($dataReservasi) && !empty($dataReservasi)){
                    $result = array(
                        "code" => 400,
                        "message" => 'Tidak bisa Reservasi, Coba di jadwal yang lain',
                    );
                    return $this->setStatusCode($result['code'])->respond($result, 'Mohon maaf anda sudah mendaftar pada tanggal '.$tgl);
                }

                $newptp = new AntrianPasienRegistrasi();
                $nontrian=AntrianPasienRegistrasi::max('noantrian')+ 1;
                $newptp->norec = $newptp->generateNewId();;
                $newptp->kdprofile = 0;
                $newptp->statusenabled = true;
                $newptp->objectruanganfk =566;
                $newptp->objectjeniskelaminfk = $pasien->objectjeniskelaminfk;
                $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
                $newptp->tanggalreservasi = $request['tanggalperiksa']." ".$antrian['jamkosong'];
                $newptp->tgllahir= $pasien->tgllahir;
                $newptp->objectkelompokpasienfk= $tipepembayaran;
                $newptp->objectpendidikanfk = 0;
                $newptp->namapasien=  $pasien->namapasien;
                $newptp->noidentitas=  $request['nik'];
                $newptp->tglinput = date('Y-m-d H:i:s');


                $newptp->nobpjs= $request['nomorkartu'];
                $newptp->norujukan= $request['nomorreferensi'];

                $newptp->notelepon= $pasien->notelepon;
                $newptp->objectpegawaifk=  null;
                $newptp->tipepasien = "LAMA";
                $newptp->ismobilejkn = 1;
                $newptp->type = "LAMA";

                $newptp->objectagamafk= $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk',$pasien->id)->first();
                if(!empty($alamat)){
                    $newptp->alamatlengkap= $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara= $alamat->objectnegarafk;
                }
                $newptp->objectgolongandarahfk=  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan= $pasien->objectkebangsaanfk;
                $newptp->namaayah=$pasien->namaayah;
                $newptp->namaibu=$pasien->namaibu;
                $newptp->namasuamiistri= $pasien->namasuamiistri;

                $newptp->noaditional= $pasien->noaditional;
                $newptp->noantrian= $antrian['antrian'];
                $newptp->noidentitas= $pasien->noidentitas;
                $newptp->nocmfk=  $pasien->id;
                $newptp->paspor=  $pasien->paspor;
                $newptp->objectpekerjaanfk=  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk= $pasien->objectpendidikanfk != null? $pasien->objectpendidikanfk  : 0 ;
                $newptp->objectstatusperkawinanfk=  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir= $pasien->tempatlahir;

                $newptp->save();
                $transStatus = 'true';

                $transMessage = "Ok";


                if ($transStatus != 'false') {
                    DB::commit();
                    $dataHasil = \DB::table('antrianpasienregistrasi_t as apr')
                        ->select('apr.noantrian','apr.noreservasi','ru.namaexternal','apr.tanggalreservasi')
                        ->join('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
                        ->whereRaw("apr.tanggalreservasi BETWEEN '$tgl' AND '".date('Y-m-d',strtotime('+1 day',strtotime($tgl)))."'")
                        ->where('apr.objectruanganfk','=', 566)
                        ->where('apr.noreservasi','!=','-')
                        ->where('apr.noidentitas','=',$request['nik'])
                        ->where('apr.nobpjs','=',$request['nomorkartu'])
                        ->whereNotNull('apr.noreservasi')
                        ->where('apr.statusenabled',true)
                        ->first();

                    $estimasidilayani = strtotime($dataHasil->tanggalreservasi) * 1000;
                    $result = array(
                            "response"=>array(
                                "nomorantrean"=>$dataHasil->noantrian,
                                "kodebooking"=>$dataHasil->noreservasi,
                                "jenisantrean"=>'2',
                                "estimasidilayani"=>$estimasidilayani,
                                "namapoli"=>$dataHasil->namaexternal,
                                "namadokter"=>'',

                            ),
                            "metadata"=>array(
                                "code" => "200",
                                "message" => $transMessage)
                    );
                } else {
                    DB::rollBack();
                    $result = array(
                            "response"=>array(),
                            "metadata"=>array(
                                "code" => "200",
                                "message" => $transMessage)
                    );

                }

                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }else{
                $result = array(
                    "response"=>array(),
                    "metadata"=>array("code" => "400","message" => "Belum terdaftar sebagai pasien RSJD Surakarta")
                );
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }

        } catch (Exception $e) {
            $result = array(
                "response"=>array(),
                "metadata"=>array("code" => "400","message" => "Gagal Reservasi")
            );
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }
    }

    public function GetRekapMobileJKN(Request $request)
    {

//        $request =  array(
//            "tanggalperiksa" => "2020-10-09",
//            "kodepoli" => "JIW",
//            "polieksekutif" => "0"
//        );

        $request = $request->json()->all();


        if(empty($request['tanggalperiksa']) ) {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Tanggal Periksa tidak boleh kosong"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$request['tanggalperiksa'])) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Format Tanggal Periksa salah"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if($request['tanggalperiksa'] >= date('Y-m-d',strtotime('+90 days',strtotime(date('Y-m-d'))))){
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Tanggal periksa maksimal 90 hari dari hari ini"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if(empty($request['kodepoli']) ) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Kodepoli tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['kodepoli'] != "JIW" ) {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Kodepoli tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }

        if(empty($request['polieksekutif']) && $request['polieksekutif'] != "0") {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }else{
            if($request['polieksekutif'] < "0" || $request['polieksekutif'] > "1") {
                $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Poli Eksekutif tidak sesuai"));
                return $this->setStatusCode($result['metadata']['code'])->respond($result);
            }
        }

        try {
            $tgl = $request['tanggalperiksa'];
            $data = \DB::table('antrianpasienregistrasi_t as apr')
                ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
                ->select('ru.namaexternal','apr.norec','apr.noreservasi')
                ->where('apr.objectruanganfk','=','566')
                ->whereRaw(" format(apr.tanggalreservasi,'yyyy-MM-dd') = '$tgl'")
                ->where('apr.noreservasi','!=','-')
                ->where('apr.ismobilejkn','=','1')
                ->whereNotNull('apr.noreservasi')
                ->where('apr.statusenabled',true)
                ->get();

            if(count($data) > 0){
                $result = array(
                    "response" =>
                        array(
                            "namapoli" => $data[0]->namaexternal,
                            "totalantrean" => count($data),
                            "jumlahterlayani" => "0",
                            "lastupdate" => $milliseconds = round(microtime(true) * 1000)
                        ),
                    "metadata"=>
                        array(
                            'message' => "OK",
                            'code' => '200',
                        )
                );
            }else{
                $result = array(
                    "response" =>
                        array(),
                    "metadata"=>
                        array(
                            'message' => "Belum ada data yang bisa ditampilkan",
                            'code' => '400',
                        )
                );
            }


        } catch (Exception $e) {
            $result = array(
                "response" =>
                    array(),
                "metadata"=>
                    array(
                        'message' => "Gagal menampilkan data",
                        'code' => '400',
                    )
            );
        }
        return $this->respond($result);
    }


    public function GetKodeBookingOperasi(Request $request)
    {

        $request = $request->json()->all();

        if(empty($request['nopeserta']) ) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Nomer Peserta tidak boleh kosong"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        $result = array(
            "response" =>
                array(
                    "list" => array()
                ),
            "metadata"=>
                array(
                    'message' => "OK",
                    'code' => '200',
                )
        );
           return $this->respond($result);
    }

    public function GetListOperasi(Request $request)
    {
        $request = $request->json()->all();

        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$request['tanggalawal'])) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Format Tanggal Awal salah"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/",$request['tanggalakhir'])) {
            $result = array("response"=>array(),"metadata"=>array("code" => "400","message" => "Format Tanggal Akhir salah"));
            return $this->setStatusCode($result['metadata']['code'])->respond($result);
        }

        $result = array(
            "response" =>
                array(
                    "list" => array()
                ),
            "metadata"=>
                array(
                    'message' => "OK",
                    'code' => '200',
                )
        );
        return $this->respond($result);
    }



}