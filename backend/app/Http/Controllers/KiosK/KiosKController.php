<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 10/3/2019
 * Time: 4:26 PM
 */
namespace App\Http\Controllers\KiosK;

use App\Http\Controllers\ApiController;
use App\Master\Alamat;
use App\Master\Pasien;
use App\Master\SlottingOnline;
use Carbon\Carbon;
//use Faker\Provider\DateTime;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use App\Traits\PelayananPasienTrait;
use App\Traits\Valet;
use DB;
use App\Transaksi\AntrianPasienRegistrasi;
use Webpatser\Uuid\Uuid;

class KiosKController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
    public function saveAntrianTouchscreen(Request $request)
    {

        $dataLogin = $request->all();
        DB::beginTransaction();
        $noRec = '';
        try {
        $tglAyeuna = date('Y-m-d H:i:s');
        $tglAwal = date('Y-m-d 00:00:00');
        $tglAkhir = date('Y-m-d 23:59:59');
        $kdRuanganTPP = $this->settingDataFixed('idRuanganTPP1');

            $newptp = new AntrianPasienRegistrasi();
            $norec = $newptp->generateNewId();
            $nontrian = AntrianPasienRegistrasi::where('jenis', $request['jenis'])
                    ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
                    ->max('noantrian') + 1;
            $newptp->norec = $norec;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $request['idRuanganTPP'];//$kdRuanganTPP;
            $newptp->objectjeniskelaminfk = 0;
            $newptp->noantrian = $nontrian;
            $newptp->noreservasi = "-";
            $newptp->objectpendidikanfk = 0;
            $newptp->tanggalreservasi = $tglAyeuna;
            $newptp->tipepasien = "BARU";
            $newptp->norujukan = $request['poli'];
            $newptp->type = "BARU";
            $newptp->jenis = $request['jenis'];
            $newptp->statuspanggil = 0;
            $newptp->save();
            $noRec = $newptp->norec;


            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {

            DB::commit();
            $result = array(
                "noRec" => $noRec,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "noRec" => $noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function saveAntrianTouchscreenAntrol(Request $request)
    {

        $dataLogin = $request->all();
        DB::beginTransaction();
        $noRec = '';
        try {
        $tglAyeuna = date('Y-m-d H:i:s');
        $tglAwal = date('Y-m-d 00:00:00');
        $tglAkhir = date('Y-m-d 23:59:59');
        $tglRegistrasi = Carbon::now()->format('Y-m-d');
        $timewaktu = strtotime($tglRegistrasi) * 1000;
        $kdRuanganTPP = $this->settingDataFixed('idRuanganTPP1');

            $newptp = new AntrianPasienRegistrasi();
            $norec = $newptp->generateNewId();
            $nontrian = AntrianPasienRegistrasi::where('jenis', $request['jenis'])
                    ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
                    ->max('noantrian') + 1;
            $newptp->norec = $norec;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $request['idRuanganTPP'];//$kdRuanganTPP;
            $newptp->objectjeniskelaminfk = 0;
            $newptp->noantrian = $nontrian;
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->objectpendidikanfk = 0;
            $newptp->tanggalreservasi = $tglAyeuna;
            $newptp->tipepasien = "BARU";
            $newptp->norujukan = $request['poli'];
            $newptp->type = "BARU";
            $newptp->jenis = $request['jenis'];
            $newptp->statuspanggil = 0;
            $newptp->istaskantrol = 1;
            $newptp->save();
            $noRec = $newptp->norec;

            $kirim = array(
                    "data" => array(
                        "kodebooking"=> $noreservasi,
                        "jenispasien"=> "NON JKN",
                        "nomorkartu"=> '',
                        "nik"=> '',
                        "nohp"=> '',
                        "kodepoli"=> $request['kodepoli'],
                        "namapoli"=> $request['namapoli'],
                        "pasienbaru"=> 1,
                        "norm"=> 'BARU',
                        "tanggalperiksa"=> $tglRegistrasi,
                        "kodedokter"=> $request['kodedokter'],
                        "namadokter"=> $request['namadokter'],
                        "jampraktek"=> "08:00-16:00",
                        "jeniskunjungan"=> 1,
                        "nomorreferensi"=> '',
                        "nomorantrean"=> 'A-'. $nontrian,
                        "angkaantrean"=> $nontrian,
                        "estimasidilayani"=> $timewaktu,
                        "sisakuotajkn"=> 100,
                        "kuotajkn"=> 100,
                        "sisakuotanonjkn"=> 100,
                        "kuotanonjkn"=> 100,
                        "keterangan"=> "Peserta harap 30 menit lebih awal guna pencatatan administrasi."
                    )
                );
                // return($kirim);
                // die();
            $kirimMjk = $this->addAntrianMJKN($kirim);
            $update = array(
                    "data" => array(
                        "kodebooking"=> $noreservasi,
                        "taskid"=> 1,
                        "waktu"=> $timewaktu
                    )
                );
            $updateWaktuTask = $this->updateWaktuTask($update);

            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {

            DB::commit();
            $result = array(
                "noRec" => $noRec,
                "status" => 201,
                "message" => $transMessage,
                "antrian" => $kirimMjk,
                "noreservasi" => $noreservasi,
                "task" =>$updateWaktuTask
            );
        } else {
            DB::rollBack();
            $result = array(
                "noRec" => $noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function saveAntrianTouchscreenAntrolJKN(Request $request)
    {

        $dataLogin = $request->all();
        DB::beginTransaction();
        $noRec = '';
        try {
        $tglAyeuna = date('Y-m-d H:i:s');
        $tglAwal = date('Y-m-d 00:00:00');
        $tglAkhir = date('Y-m-d 23:59:59');
        $tglRegistrasi = Carbon::now()->format('Y-m-d');
        $timewaktu = strtotime($tglRegistrasi) * 1000;
        $kdRuanganTPP = $this->settingDataFixed('idRuanganTPP1');

            $newptp = new AntrianPasienRegistrasi();
            $norec = $newptp->generateNewId();
            $nontrian = AntrianPasienRegistrasi::where('jenis', $request['jenis'])
                    ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
                    ->max('noantrian') + 1;
            $newptp->norec = $norec;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $request['idRuanganTPP'];//$kdRuanganTPP;
            $newptp->objectjeniskelaminfk = 0;
            $newptp->noantrian = $nontrian;
            $newptp->noreservasi =substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->objectpendidikanfk = 0;
            $newptp->tanggalreservasi = $tglAyeuna;
            $newptp->tipepasien = "BARU";
            $newptp->norujukan = $request['poli'];
            $newptp->type = "BARU";
            $newptp->jenis = $request['jenis'];
            $newptp->statuspanggil = 0;
            $newptp->istaskantrol = 1;
            $newptp->save();
            $noRec = $newptp->norec;

            $kirim = array(
                    "data" => array(
                        "kodebooking"=> $noreservasi,
                        "jenispasien"=> "JKN",
                        "nomorkartu"=> $request['nomorkartu'],
                        "nik"=> $request['nik'],
                        "nohp"=> $request['nohp'],
                        "kodepoli"=> $request['kodepoli'],
                        "namapoli"=> $request['namapoli'],
                        "pasienbaru"=> 1,
                        "norm"=> 'BARU',
                        "tanggalperiksa"=> $tglRegistrasi,
                        "kodedokter"=> $request['kodedokter'],
                        "namadokter"=> $request['namadokter'],
                        "jampraktek"=> "08:00-16:00",
                        "jeniskunjungan"=> 1,
                        "nomorreferensi"=> $request['nomorreferensi'],
                        "nomorantrean"=> 'B-'. $nontrian,
                        "angkaantrean"=> $nontrian,
                        "estimasidilayani"=> $timewaktu,
                        "sisakuotajkn"=> 100,
                        "kuotajkn"=> 100,
                        "sisakuotanonjkn"=> 100,
                        "kuotanonjkn"=> 100,
                        "keterangan"=> "Peserta harap 30 menit lebih awal guna pencatatan administrasi."
                    )
                );
                // return($kirim);
                // die();
            $kirimMjk = $this->addAntrianMJKN($kirim);
            $update = array(
                    "data" => array(
                        "kodebooking"=> $noreservasi,
                        "taskid"=> 1,
                        "waktu"=> $timewaktu
                    )
                );
            $updateWaktuTask = $this->updateWaktuTask($update);

            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {

            DB::commit();
            $result = array(
                "noRec" => $noRec,
                "status" => 201,
                "message" => $transMessage,
                "antrian" => $kirimMjk,
                "noreservasi" => $noreservasi,
                "task" =>$updateWaktuTask
            );
        } else {
            DB::rollBack();
            $result = array(
                "noRec" => $noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    function addAntrianMJKN($request){
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);
        // return($request['data']);
        // die();
        // base64 encode…
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            $dataJsonSend = json_encode($request['data']);
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
                CURLOPT_URL => $this->getUrlBrigdingAntrol()."antrean/add",
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
                    "Content-Type: Application/x-www-form-urlencoded",
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp,
                    "user_key:".$userKey
                ),
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                $result= "cURL Error #:" . $err;
            } else {
                $result = (array) json_decode($response);
            }
        return($result);
    }
    function updateWaktuTask($request){
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);
        // return($request['data']);
        // die();
        // base64 encode…
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            $dataJsonSend = json_encode($request['data']);
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
                CURLOPT_URL => $this->getUrlBrigdingAntrol()."antrean/updatewaktu",
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
                    "Content-Type: Application/x-www-form-urlencoded",
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp,
                    "user_key:".$userKey
                ),
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                $result= "cURL Error #:" . $err;
            } else {
                $result = (array) json_decode($response);
            }
        return($result);
    }
    public function getRuanganByKodeInternal($kode)
    {
        // $data = \DB::table('ruangan_m')
        //     ->where('statusenabled',true)
        //     ->where('kdinternal', '=',$kode)
        //     ->first();
        $data = \DB::table('ruangankiosk_m')
			->select('ruangankiosk_m.kodeexternal as id','ruangankiosk_m.namaruangan',
                    'ruangankiosk_m.kdinternal','ruangankiosk_m.objectdepartemenfk')
			->where('statusenabled', true)
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
    public function getKetersediaanTempatTidurView (Request $request)
    {
        $namaruangan= $request['namaruangan'];
        $idkelas= $request['idkelas'];
        $dataLogin = $request->all();
        if($namaruangan == "" && $idkelas == ""){
            $data = DB::select(DB::raw("select top 1 COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and ru.statusenabled=1
				 and km.statusenabled=1 and tt.statusenabled=1)as x "),
                array(
//                    'namaruangan' => $namaruangan,
//                    'idkelas' => $idkelas,
                )
            );
        } elseif ($namaruangan != "" && $idkelas == ""){
            $data = DB::select(DB::raw("select COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and ru.namaruangan=:namaruangan)as x"),
                array(
                    'namaruangan' => $namaruangan,
//                    'idkelas' => $idkelas,
                )
            );
        } elseif ($namaruangan == "" && $idkelas != ""){
            $data = DB::select(DB::raw("select COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and kl.id=:idkelas)as x"),
                array(
//                    'namaruangan' => $namaruangan,
                    'idkelas' => $idkelas,
                )
            );
        } else {
            $data = DB::select(DB::raw("select COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and ru.namaruangan=:namaruangan and kl.id=:idkelas)as x"),
                array(
                    'namaruangan' => $namaruangan,
                    'idkelas' => $idkelas,
                )
            );
        }
        return $this->respond($data);
    }
    public function viewBed(Request $request)
    {
        $data= \DB::table('tempattidur_m as tt')
            ->leftjoin('kamar_m as km', 'km.id', '=', 'tt.objectkamarfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'km.objectruanganfk')
            ->leftjoin('statusbed_m as sb', 'sb.id', '=', 'tt.objectstatusbedfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'km.objectkelasfk')
            ->select('ru.id as idruangan','ru.namaruangan','km.id as idkamar','km.namakamar','tt.id as idtempattidur',
                'tt.reportdisplay','tt.nomorbed','sb.id as idstatusbed','sb.statusbed','kl.id as idkelas','kl.namakelas')
            ->whereIn('ru.objectdepartemenfk',array(16,35))
            ->where('ru.statusenabled',true)
            ->where('km.statusenabled',true)
            ->where('tt.statusenabled',true);

        if(isset($request['namaruangan']) && $request['namaruangan']!="" && $request['namaruangan']!="undefined"){
            $data = $data->where('ru.namaruangan','like','%'. $request['namaruangan'] .'%');
        };
        if(isset($request['namakamar']) && $request['namakamar']!="" && $request['namakamar']!="undefined"){
            $data = $data->where('km.namakamar','like','%'. $request['namakamar'] .'%');
        };
        if(isset($request['idkelas']) && $request['idkelas']!="" && $request['idkelas']!="undefined"){
            $data = $data->where('kl.id', $request['idkelas']);
        };
        if(isset($request['namabed']) && $request['namabed']!="" && $request['namabed']!="undefined"){
            $data = $data->where('tt.reportdisplay','like','%'. $request['namabed'] .'%');
        };
        if(isset($request['idstatusbed']) && $request['idstatusbed']!="" && $request['idstatusbed']!="undefined"){
            $data = $data->where('sb.id', $request['idstatusbed']);
        };
        $data = $data->get();


        return $this->respond($data);
    }
    public function getDataCombo(Request $request)
    {
        $dataLogin = $request->all();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $result = array(
            'ruangan' => $dataRuangan,

            'kelas' => $dataKelas,

            'message' => 'ramdan',
        );

        return $this->respond($result);
    }
    public function getDaftarTarif(Request $request)
    {
        $filter = $request->all();
        $produkid= '';
        if  ($filter['produkId'] != ''){
            $produkid= 'AND pr.id = ' . $filter['produkId'];
        }
        $ruanganid = '';
        if ($filter['ruanganId'] != ''){
            $ruanganid ='AND mprtp.objectruanganfk =' . $filter['ruanganId'];
        }
        $kelasid = '';
        if ($filter['kelasId'] != ''){
            $kelasid ='AND kls.id =' . $filter['kelasId'];
        }
        $jenispelid = '';
        if ($filter['jenispelayananId'] != ''){
            $jenispelid ='AND jnsp.id =' . $filter['jenispelayananId'];
        }
        $namaproduk = '';
        if ($filter['namaproduk'] != ''){
            $namaproduk ="AND pr.namaproduk like '%" . $filter['namaproduk'] . "%'";
        }

//        $jenispelid =$filter['jenispelid'];
        $data =DB::select(DB::raw("
               SELECT 
                distinct top 50  pr.id,
                pr.namaproduk,
                hrpk.harganetto1 AS hargalayanan,kls.id as idkelas,kls.namakelas ,jnsp.id as jenispelayananid,jnsp.jenispelayanan,mprtp.objectruanganfk as ruid,
                  ru.id as ruid,ru.namaruangan
                FROM
                produk_m AS pr
                INNER JOIN mapruangantoproduk_m AS mprtp ON mprtp.objectprodukfk = pr.id
             
               
                LEFT JOIN harganettoprodukbykelas_m AS hrpk ON hrpk.objectprodukfk = pr.id
                INNER JOIN kelas_m as kls on kls.id=hrpk.objectkelasfk
                INNER JOIN jenispelayanan_m as jnsp on jnsp.id=hrpk.objectjenispelayananfk
                INNER JOIN ruangan_m as ru on ru.id=mprtp.objectruanganfk
                WHERE
                hrpk.statusenabled = 1
                AND pr.statusenabled = 1
          
            
                $produkid
                 $ruanganid 
                 $kelasid $jenispelid $namaproduk
                  ")
        );

        $results =array();

        $produkid= '';
        if  ($filter['produkId'] != ''){
            $produkid= 'AND pr.id = ' . $filter['produkId'];
        }
        $ruanganid = '';
        if ($filter['ruanganId'] != ''){
            $ruanganid ='AND mprtp.objectruanganfk =' . $filter['ruanganId'];
        }
        $kelasid =$filter['kelasId'];
//        $jenispelid =$filter['jenispelid'];
//        $details =DB::select(DB::raw("
//                select  pr.id as kdeproduk,pr.namaproduk,kls.id as klsid,kh.id as idkomponen,kh.komponenharga,hrpkd.harganetto1,
//                hrpkd.harganetto2,hrpkd.hargasatuan,jnspel.id as jnspelid
//                from produk_m as pr
//                INNER JOIN mapruangantoproduk_m AS mprtp ON mprtp.objectprodukfk = pr.id
//                left join detailjenisproduk_m as djp on djp.id = pr.objectdetailjenisprodukfk
//                left join jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
//                left join kelompokproduk_m as kp on kp.id = jp.objectkelompokprodukfk
//                left join harganettoprodukbykelasd_m as hrpkd on hrpkd.objectprodukfk = pr.id
//                inner join kelas_m as kls on kls.id = hrpkd.objectkelasfk
//                inner join komponenharga_m as kh on kh.id = hrpkd.objectkomponenhargafk
//                INNER JOIN jenispelayanan_m as jnspel on jnspel.id=hrpkd.objectjenispelayananfk
//                where pr.statusenabled=1 and hrpkd.statusenabled = 1
//                --and pr.id =1002120383
//                --and kls.id=1 and jnspel.id=1
//                $produkid $ruanganid ")
//        );
//        foreach ($data as $item){
//            foreach ($details as $dtl){
//                if  ($item->id == $dtl->kdeproduk){
//                    $results[] = array(
//                        'kodeproduk' => $item->id,
//                        'namaproduk' => $item->namaproduk,
//                        'kdruangan' => $item->koderuangan,
//                        'namaruangan' => $item->namaruangan,
//                        'idkelas' => $item->idkelas,
//                        'namakelas' => $item->namakelas,
//                        'hargalayanan' => $item->hargalayanan,
//                        'details' => $dtl,
//                    );
//                }
//            }
//
//
//        }
        $result = array(
            'data'=>$data,
//            'detail'=> $details,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }
    public function getDataViewBed(Request $request){

        $data= \DB::table('tempattidur_m as tt')
            ->leftjoin('kamar_m as km', 'km.id', '=', 'tt.objectkamarfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'km.objectruanganfk')
            ->leftjoin('statusbed_m as sb', 'sb.id', '=', 'tt.objectstatusbedfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'km.objectkelasfk')
            ->select('ru.id as idruangan','ru.namaruangan','km.id as idkamar','km.namakamar','tt.id as idtempattidur',
                'tt.reportdisplay','tt.nomorbed','sb.id as idstatusbed','sb.statusbed','kl.id as idkelas','kl.namakelas')
            ->whereIn('ru.objectdepartemenfk',array(16,35))
            ->where('ru.statusenabled',true)
            ->where('km.statusenabled',true)
            ->where('tt.statusenabled',true);

        if(isset($request['namaruangan']) && $request['namaruangan']!="" && $request['namaruangan']!="undefined"){
            $data = $data->where('ru.namaruangan','like','%'. $request['namaruangan'] .'%');
        };
        if(isset($request['namakamar']) && $request['namakamar']!="" && $request['namakamar']!="undefined"){
            $data = $data->where('km.namakamar','like','%'. $request['namakamar'] .'%');
        };
        if(isset($request['idkelas']) && $request['idkelas']!="" && $request['idkelas']!="undefined"){
            $data = $data->where('kl.id', $request['idkelas']);
        };
        if(isset($request['namabed']) && $request['namabed']!="" && $request['namabed']!="undefined"){
            $data = $data->where('tt.reportdisplay','like','%'. $request['namabed'] .'%');
        };
        if(isset($request['idstatusbed']) && $request['idstatusbed']!="" && $request['idstatusbed']!="undefined"){
            $data = $data->where('sb.id', $request['idstatusbed']);
        };
        $data = $data->get();


        return $this->respond($data);
    }

    public function getJumlahBedTerisi(Request $request){
        $data = DB::select(DB::raw("SELECT
                    ru.id AS idruangan,
                    ru.namaruangan,
	                COUNT(tt.id) AS isi
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN antrianpasiendiperiksa_t AS apd ON pd.norec = apd.noregistrasifk
                AND apd.tglkeluar IS NULL --inner join registrasipelayananpasien_t as rpp on rpp.noregistrasifk=pd.norec
                INNER JOIN pasien_m AS p ON p.id = pd.nocmfk
                INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                LEFT JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk --LEFT JOIN batalregistrasi_t AS br ON pd.norec = br.pasiendaftarfk
                LEFT JOIN kamar_m AS kmr ON kmr.id = apd.objectkamarfk
                LEFT JOIN tempattidur_m AS tt ON tt.id = apd.nobed
                WHERE
                    pd.statusenabled = 1
                AND ru.objectdepartemenfk = 16
                --AND ru.id = 582
                AND pd.tglpulang IS NULL
                GROUP BY ru.id, ru.namaruangan"));

        $result = [
            "data" => $data,
            "by" => "dy"
        ];

        return $this->respond($result);
    }

    public function viewDpjp(Request $request)
    {
        $data =DB::select(DB::raw("
                 select pd.objectpegawaifk as iddpjp,(select namalengkap from pegawai_m p where p.id = pd.objectpegawaifk) as namalengkap,         
                  COUNT(pdt.nocmfk) AS pasien from pasiendaftar_t pd 
                  INNER JOIN pasiendaftar_t pdt ON pdt.norec = pd.norec          
                  where pd.statusenabled = 1 and pd.tglpulang is null
                  GROUP BY pd.objectpegawaifk"));

        //$data = $data->get();

        return $this->respond($data);
    }

    public function viewDpjpRuangan(Request $request)
    {
        $data =DB::select(DB::raw("
                  select count(pdt.objectruanganlastfk) as jumlah,pd.objectruanganlastfk ,pd.objectpegawaifk,
									(select namaruangan from ruangan_m r where r.id = pd.objectruanganlastfk) as namaruangan  from pasiendaftar_t pd
                   INNER JOIN pasiendaftar_t pdt ON pdt.norec = pd.norec    
  								 where pd.statusenabled = 1 and pd.tglpulang is null  group by pd.objectruanganlastfk,pd.objectpegawaifk "));

        //$data = $data->get();

        return $this->respond($data);
    }
}