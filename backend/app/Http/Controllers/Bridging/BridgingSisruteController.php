<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 15/08/2019
 * Time: 10.26
 * SISRUTE (Sistem Informasi Rujukan Terintegrasi)
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\Pegawai;
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

class BridgingSisruteController extends  ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

    protected  function userSisrute (){
       return $this->settingDataFixed('userIdSisrute');
    }
    protected  function passwordSisrute (){
        return $this->settingDataFixed('passwordSisrute');
    }
    protected  function userSirsonline (){
        return $this->settingDataFixed('userIdSirsOnline');
     }
     protected  function passwordSirsonline (){
         return $this->settingDataFixed('passwordSirsOnline');
     }
    public function getFaskes(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $param = '';
        if(isset($request['query']) && $request['query']!=''){
            $param = "?query=".$request['query'];
        }
        if(isset($request['kode']) && $request['kode']!=''){
            $param = "/".$request['kode'];
        }
        $urlSetting = $this->getUrlSisrute();
        $url = $urlSetting."/referensi/faskes".$param;
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);


    }
    public function getAlasanRujukan(Request $request) {
        // id & pass dari kemkes
        $id = 3174260;
        $pass = md5("12345");

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $param = '';
        if(isset($request['query']) && $request['query'] != ''){
            $param = "?query=".$request['query'];
        }
        if(isset($request['kode']) && $request['kode']!=''){
            $param = "/".$request['kode'];
        }
        $urlSetting = $this->getUrlSisrute();
        $url = $urlSetting."/referensi/alasanrujukan".$param;
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getDiagnosa(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $param = '';
        if(isset($request['query']) && $request['query']!=''){
            $param = "?query=".$request['query'];
        }
        if(isset($request['kode']) && $request['kode']!=''){
            $param = "/".$request['kode'];
        }

        $url =  $this->getUrlSisrute()."/referensi/diagnosa".$param;
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getDiagnosaPaging(Request $request) {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSisrute()."/referensi/diagnosa?query=".$dataReq;
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $res = $result['data'];
        return $this->respond($res);

    }
    public function getFaskesPaging(Request $request) {
        $req = $request->all();
        if(isset($req['filter']['filters'][0]['value'])){
            $dataReq = $req['filter']['filters'][0]['value'];
        }else{
            $dataReq = '';
        }
        
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = $this->passwordSisrute();
        // $pass = md5( $this->passwordSisrute());
        $pass = hash('sha256', $id . $pass);
        // return($id);
        // die();
        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSisrute()."/referensi/faskes?query=".$dataReq;
        
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        // $res = $result['data'];
        return $this->respond($result);

    }
    //region Get data Rujukan
    /** untuk menampilkan rujukan dari luar
     * jika ingin menampilkan rujukan yg telah di buat tambahkan parameter create= true
     */
    public function getRujukan(Request $request) {

        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $param1 = '';
        $param2 = '';
        $param3 = '';
        if(isset($request['create']) && $request['create']!=''){
            $param1 ='create='. $request['create'];
        }
        if(isset($request['nomor']) && $request['nomor']!=''){
            $param2 ='&nomor='.$request['nomor'];
        }
        if(isset($request['tanggal']) && $request['tanggal']!=''){
            $param3 = '&tanggal='.$request['tanggal'];
        }


        $url = $this->getUrlSisrute()."/rujukan?".$param1.$param2.$param3;
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    //endregion

    //region Insert data Rujukan
    public function postRujukan(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSisrute()."/rujukan";
        $method = "POST"; // POST / PUT / DELETE

        $postdata = json_encode($request['data']);
//        return $this->respond($postdata);
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-type: application/vnd.rujukan.v1+json",
//            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $transMessage = $result['detail'];
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    //endregion

    //region Update data Rujukan
    public function putRujukan(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $nomor = '';
        if(isset($request['nomor']) && $request['nomor']!= ''){
            $nomor = "/".$request['nomor'];
        }
        $url = $this->getUrlSisrute()."/rujukan".$nomor;
        $method = "PUT"; // POST / PUT / DELETE
        //region Format Data Send
//        {
//            "PASIEN": {
//            "NORM": 11223345,
//              "NIK": "7371140101010003",
//              "NO_KARTU_JKN": "0000001234501",
//              "NAMA": "Rahmat Hidayat",
//              "JENIS_KELAMIN": "1",
//              "TANGGAL_LAHIR": "1980-01-03",
//              "TEMPAT_LAHIR": "Makassar",
//              "ALAMAT": "Pettarani",
//              "KONTAK": "085123123122"
//           },
//           "RUJUKAN": {
//                    "JENIS_RUJUKAN": "2",
//              "TANGGAL": "2018-08-29 10:00:00",
//              "FASKES_TUJUAN": "3404015",
//              "ALASAN": "1",
//              "ALASAN_LAINNYA": "Pusing",
//              "DIAGNOSA": "I10",
//              "DOKTER": {
//                        "NIK": "7371140101010111",
//                 "NAMA": "Dr. Raffi"
//              },
//              "PETUGAS": {
//                        "NIK": "7371140101010112",
//                 "NAMA": "Enal"
//              }
//           },
//           "KONDISI_UMUM": {
//                    "KESADARAN": "1",
//              "TEKANAN_DARAH": "120/90",
//              "FREKUENSI_NADI": "50",
//              "SUHU": "37",
//              "PERNAPASAN": "25",
//              "KEADAAN_UMUM": "sesak, gelisah",
//              "NYERI": 0,
//              "ALERGI": "-"
//           },
//           "PENUNJANG": {
//                    "LABORATORIUM": "WBC:11,2;HB:15,6;PLT:215;",
//              "RADIOLOGI": "EKG:Sinus Takikardi;Foto Thorax:Cor dan pulmo normal;",
//              "TERAPI_ATAU_TINDAKAN": "TRP:LOADING NACL 0.9% 500 CC;INJ. RANITIDIN 50 MG;#TDK:TERPASANG INTUBASI ET NO 8 BATAS BIBIR 21CM;"
//           }
//        }

        //endregion
        $postdata = json_encode($request['data']);
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-type: application/vnd.rujukan.v1+json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    //endregion

    //region Jawab/ Respon Rujukan yang di terima dari faskes perujuk
    public function jawabRujukan(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());
        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $nomor = '';
        if(isset($request['nomor']) && $request['nomor']!= ''){
            $nomor = "/".$request['nomor'];
        }
        $url = $this->getUrlSisrute()."/rujukan/jawab".$nomor;
        $method = "PUT"; // POST / PUT / DELETE

        //region Format Data Send
//        {
//            "DITERIMA": 1, # Status Jawaban Rujukan 1. Diterima, 0. Tidak Diterima
//           "KETERANGAN": "Silahkan rujuk pasien tersebut", # Keterangan Diterima / Tidak Diterima
//           "PETUGAS": {
//                    "NIK": "7371140101010015", # Nomor Induk Kependudukan Petugas
//              "NAMA": "Sultan"           # Nama Petugas
//           }
//        }

        //endregion

        $postdata = json_encode($request['data']);
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $transMessage = $result['detail'];
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    //endregion

    //region Pembatalan Rujukan
    public function batalRujukan(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $nomor = '';
        if(isset($request['nomor']) && $request['nomor']!= ''){
            $nomor = "/".$request['nomor'];
        }
        $url = $this->getUrlSisrute()."/rujukan/batal".$nomor;
        $method = "PUT"; // POST / PUT / DELETE

        //region Format Data Send
//        {
//            "PETUGAS": {
//            "NIK": "7371140101010015", # Nomor Induk Kependudukan Petugas
//              "NAMA": "Sultan"           # Nama Petugas
//           }
//        }

        //endregion

        $postdata = json_encode($request['data']);

        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $transMessage = $result['detail'];
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    //endregion

    //region Notif Rujukan
    public function notifRujukan(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSisrute();
        $pass = md5( $this->passwordSisrute());

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $nomor = '';
        if(isset($request['nomor']) && $request['nomor']!= ''){
            $nomor = "/".$request['nomor'];
        }
        $url = $this->getUrlSisrute()."/rujukan/notif".$nomor;
        $method = "PUT"; // POST / PUT / DELETE

        //region Format Data Send
        //endregion

        $postdata = json_encode($request['data']);
        $headers = [
            "X-cons-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-signature: ".$signature,
            "Content-type: application/json",
            "Content-type: 	application/vnd.rujukan.v1+json",
            "Content-length: ".strlen($postdata)
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    //endregion

    public function getPasienByNoCMSisrute(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->leftJOIN ('alamat_m as alm','alm.nocmfk','=','ps.id')
            ->leftjoin ('pendidikan_m as pdd','ps.objectpendidikanfk','=','pdd.id')
            ->leftjoin ('pekerjaan_m as pk','ps.objectpekerjaanfk','=','pk.id')
            ->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
//            ->leftjoin ('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
            ->select('ps.nocm','ps.id as nocmfk','ps.namapasien','ps.objectjeniskelaminfk','jk.jeniskelamin','ps.tgllahir',
                    'alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.noidentitas','ps.notelepon','ps.nobpjs',
                'ps.tempatlahir','ps.nohp')
            ->where('ps.nocm', $request['nocm'])
            ->first();

        $result = array(
            'data'=> $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getComboSisrute(Request $request) {
        $dokter = Pegawai::where('objectjenispegawaifk',1)
            ->orderBy('namalengkap')
            ->where('statusenabled',true)->get();
        $pegawai = Pegawai::where('statusenabled',true)
            ->orderBy('namalengkap')->get();
        $result = array(
            'dokter'=> $dokter,
            'pegawai'=> $pegawai,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getPasienMasukCovid(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/LapV2/PasienMasuk";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getRefTempatTidur(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/Referensi/tempat_tidur";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getDataTempatTidur(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/Fasyankes";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getDataPasienKomorbid(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/LapV2/PasienDirawatKomorbid";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getComboSdm(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/Referensi/kebutuhan_sdm";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getDataSdm(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/Fasyankes/sdm";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }

    public function postSdm(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/Fasyankes/sdm";
        $method = "POST"; // POST / PUT / DELETE
        $postdata = json_encode($request['data']);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }
    public function putSdm(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/Fasyankes/sdm";
        $method = "PUT"; // POST / PUT / DELETE
        $postdata = json_encode($request['data']);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }
    public function getComboAlkes(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/Referensi/kebutuhan_apd";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function getDataAlkes(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url =  $this->getUrlSirsOnline()."/Fasyankes/apd";
        $method = "GET"; // POST / PUT / DELETE
        $postdata = "";
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);

    }
    public function postAlkes(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/Fasyankes/apd";
        $method = "POST"; // POST / PUT / DELETE
        $postdata = json_encode($request['data']);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }
    public function putAlkes(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/Fasyankes/apd";
        $method = "PUT"; // POST / PUT / DELETE
        $postdata = json_encode($request['data']);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }

    public function pushPasienMasuk(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/LapV2/PasienMasuk";
        $method = "POST"; // POST / PUT / DELETE
        $tglAwal = Carbon::now()->format('Y-m-d 00:00');
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $tglKirim = Carbon::now()->format('Y-m-d');
        $dataALL = DB::select(DB::raw("select 
                sum(x.igd_suspect_l) igd_suspect_l,
                sum(x.igd_suspect_p) igd_suspect_p,
                sum(x.igd_confirm_l) igd_confirm_l,
                sum(x.igd_confirm_p) igd_confirm_p,
                sum(x.rj_suspect_l) rj_suspect_l,
                sum(x.rj_suspect_p) rj_suspect_p,
                sum(x.rj_confirm_l) rj_confirm_l,
                sum(x.rj_confirm_p) rj_confirm_p,
                sum(x.ri_suspect_l) ri_suspect_l,
                sum(x.ri_suspect_p) ri_suspect_p,
                sum(x.ri_confirm_l) ri_confirm_l,
                sum(x.ri_confirm_p) ri_confirm_p from
                (
                SELECT
                    CASE
                WHEN ru.objectdepartemenfk = 24
                AND pd.objectkasuspenyakitlastfk = 56
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS igd_suspect_l,
                CASE
                WHEN ru.objectdepartemenfk = 24
                AND pd.objectkasuspenyakitlastfk = 56
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS igd_suspect_p,
                CASE
                WHEN ru.objectdepartemenfk = 24
                AND pd.objectkasuspenyakitlastfk = 57
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS igd_confirm_l,
                CASE
                WHEN ru.objectdepartemenfk = 24
                AND pd.objectkasuspenyakitlastfk = 57
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS igd_confirm_p,
                CASE
                WHEN ru.objectdepartemenfk = 18
                AND pd.objectkasuspenyakitlastfk = 56
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS rj_suspect_l,
                CASE
                WHEN ru.objectdepartemenfk = 18
                AND pd.objectkasuspenyakitlastfk = 56
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS rj_suspect_p,
                CASE
                WHEN ru.objectdepartemenfk = 18
                AND pd.objectkasuspenyakitlastfk = 57
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS rj_confirm_l,
                CASE
                WHEN ru.objectdepartemenfk = 18
                AND pd.objectkasuspenyakitlastfk = 57
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS rj_confirm_p,
                CASE
                WHEN ru.objectdepartemenfk = 16
                AND pd.objectkasuspenyakitlastfk = 56
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS ri_suspect_l,
                CASE
                WHEN ru.objectdepartemenfk = 16
                AND pd.objectkasuspenyakitlastfk = 56
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS ri_suspect_p,
                CASE
                WHEN ru.objectdepartemenfk = 16
                AND pd.objectkasuspenyakitlastfk = 57
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS ri_confirm_l,
                CASE
                WHEN ru.objectdepartemenfk = 16
                AND pd.objectkasuspenyakitlastfk = 57
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS ri_confirm_p
                FROM
                    pasiendaftar_t pd
                INNER JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                INNER JOIN pasien_m ps ON ps.id = pd.nocmfk
                WHERE
                    pd.tglregistrasi BETWEEN '$tglAwal'
                AND '$tglAkhir'
                AND pd.objectkasuspenyakitlastfk <> 1
                and ru.objectdepartemenfk in (24,16,18)
                and pd.statusenabled=1
                ) as x"));
                foreach ($dataALL as $item){
                    $dataTTDetail =array(
                        'tanggal'=> $tglKirim,
                        'igd_suspect_l'=> $item->igd_suspect_l,
                        'igd_suspect_p'=> $item->igd_suspect_p,
                        'igd_confirm_l'=> $item->igd_confirm_l,
                        'igd_confirm_p'=> $item->igd_confirm_p,
                        'rj_suspect_l'=> $item->rj_suspect_l,
                        'rj_suspect_p'=> $item->rj_suspect_p,
                        'rj_confirm_l'=> $item->rj_confirm_l,
                        'rj_confirm_p'=> $item->rj_confirm_p,
                        'ri_suspect_l'=> $item->ri_suspect_l,
                        'ri_suspect_p'=> $item->ri_suspect_p,
                        'ri_confirm_l'=> $item->ri_confirm_l,
                        'ri_confirm_p'=> $item->ri_confirm_p
                    );
                }

               
        
        $postdata = json_encode($dataTTDetail);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }
    public function pushPasienKomorbid(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/LapV2/PasienDirawatKomorbid";
        $method = "POST"; // POST / PUT / DELETE
        $tglAwal = Carbon::now()->format('Y-m-d 00:00');
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $tglKirim = Carbon::now()->format('Y-m-d');
        $dataALL = DB::select(DB::raw("SELECT
                    SUM (
                        x.icu_dengan_ventilator_suspect_l
                    ) icu_dengan_ventilator_suspect_l,
                    SUM (
                        x.icu_dengan_ventilator_suspect_p
                    ) icu_dengan_ventilator_suspect_p,
                    SUM (
                        x.icu_dengan_ventilator_confirm_l
                    ) icu_dengan_ventilator_confirm_l,
                    SUM (
                        x.icu_dengan_ventilator_confirm_p
                    ) icu_dengan_ventilator_confirm_p,
                    SUM (
                        x.icu_tanpa_ventilator_suspect_l
                    ) icu_tanpa_ventilator_suspect_l,
                    SUM (
                        x.icu_tanpa_ventilator_suspect_p
                    ) icu_tanpa_ventilator_suspect_p,
                    SUM (
                        x.icu_tanpa_ventilator_confirm_l
                    ) icu_tanpa_ventilator_confirm_l,
                    SUM (
                        x.icu_tanpa_ventilator_confirm_p
                    ) icu_tanpa_ventilator_confirm_p,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_suspect_l
                    ) icu_tekanan_negatif_dengan_ventilator_suspect_l,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_suspect_p
                    ) icu_tekanan_negatif_dengan_ventilator_suspect_p,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_confim_l
                    ) icu_tekanan_negatif_dengan_ventilator_confim_l,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_confim_p
                    ) icu_tekanan_negatif_dengan_ventilator_confim_p,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_suspect_l
                    ) icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_suspect_p
                    ) icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_confirm_l
                    ) icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_confirm_p
                    ) icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                    SUM (
                        x.isolasi_tekanan_negatif_suspect_l
                    ) isolasi_tekanan_negatif_suspect_l,
                    SUM (
                        x.isolasi_tekanan_negatif_suspect_p
                    ) isolasi_tekanan_negatif_suspect_p,
                    SUM (
                        x.isolasi_tekanan_negatif_confirm_l
                    ) isolasi_tekanan_negatif_confirm_l,
                    SUM (
                        x.isolasi_tekanan_negatif_confirm_p
                    ) isolasi_tekanan_negatif_confirm_p,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_suspect_l
                    ) isolasi_tanpa_tekanan_negatif_suspect_l,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_suspect_p
                    ) isolasi_tanpa_tekanan_negatif_suspect_p,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_confirm_l
                    ) isolasi_tanpa_tekanan_negatif_confirm_l,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_confirm_p
                    ) isolasi_tanpa_tekanan_negatif_confirm_p,
                    SUM (
                        x.nicu_khusus_covid_suspect_l
                    ) nicu_khusus_covid_suspect_l,
                    SUM (
                        x.nicu_khusus_covid_suspect_p
                    ) nicu_khusus_covid_suspect_p,
                    SUM (
                        x.nicu_khusus_covid_confirm_l
                    ) nicu_khusus_covid_confirm_l,
                    SUM (
                        x.nicu_khusus_covid_confirm_p
                    ) nicu_khusus_covid_confirm_p,
                    SUM (
                        x.picu_khusus_covid_suspect_l
                    ) picu_khusus_covid_suspect_l,
                    SUM (
                        x.picu_khusus_covid_suspect_p
                    ) picu_khusus_covid_suspect_p,
                    SUM (
                        x.picu_khusus_covid_confirm_l
                    ) picu_khusus_covid_confirm_l,
                    SUM (
                        x.picu_khusus_covid_confirm_p
                    ) picu_khusus_covid_confirm_p
                FROM
                    (
                        SELECT
                            CASE
                        WHEN pd.objectkomorbidfk = 1
                        AND pd.objectkomorbiddetailfk = 1
                        AND ps.objectjeniskelaminfk = 1 THEN
                            1
                        ELSE
                            0
                        END AS icu_dengan_ventilator_suspect_l,
                        CASE
                    WHEN pd.objectkomorbidfk = 1
                    AND pd.objectkomorbiddetailfk = 1
                    AND ps.objectjeniskelaminfk = 2 THEN
                        1
                    ELSE
                        0
                    END AS icu_dengan_ventilator_suspect_p,
                    CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 2
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_dengan_ventilator_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 2
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_dengan_ventilator_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 3
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 3
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 4
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 4
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 5
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 5
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 6
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_confim_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 6
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_confim_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 7
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 7
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 8
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 8
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 9
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 9
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 10
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 10
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 11
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 11
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 12
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 12
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 13
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 13
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 14
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 14
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 15
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 15
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 16
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 1
                AND pd.objectkomorbiddetailfk = 16
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_confirm_p
                FROM
                    pasiendaftar_t pd
                INNER JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                INNER JOIN pasien_m ps ON ps.id = pd.nocmfk
                WHERE
                    pd.tglpulang IS NULL
                AND pd.objectkasuspenyakitlastfk <> 1
                AND ru.objectdepartemenfk = 16
                AND pd.statusenabled = 1
                    ) AS x"));
                foreach ($dataALL as $item){
                    $dataTTDetail =array(
                        'tanggal'=> $tglKirim,
                        'icu_dengan_ventilator_suspect_l'=> $item->icu_dengan_ventilator_suspect_l,
                        'icu_dengan_ventilator_suspect_p'=> $item->icu_dengan_ventilator_suspect_p,
                        'icu_dengan_ventilator_confirm_l'=> $item->icu_dengan_ventilator_confirm_l,
                        'icu_dengan_ventilator_confirm_p'=> $item->icu_dengan_ventilator_confirm_p,
                        'icu_tanpa_ventilator_suspect_l'=> $item->icu_tanpa_ventilator_suspect_l,
                        'icu_tanpa_ventilator_suspect_p'=> $item->icu_tanpa_ventilator_suspect_p,
                        'icu_tanpa_ventilator_confirm_l'=> $item->icu_tanpa_ventilator_confirm_l,
                        'icu_tanpa_ventilator_confirm_p'=> $item->icu_tanpa_ventilator_confirm_p,
                        'icu_tekanan_negatif_dengan_ventilator_suspect_l'=> $item->icu_tekanan_negatif_dengan_ventilator_suspect_l,
                        'icu_tekanan_negatif_dengan_ventilator_suspect_p'=> $item->icu_tekanan_negatif_dengan_ventilator_suspect_p,
                        'icu_tekanan_negatif_dengan_ventilator_confirm_l'=> $item->icu_tekanan_negatif_dengan_ventilator_confim_l,
                        'icu_tekanan_negatif_dengan_ventilator_confirm_p'=> $item->icu_tekanan_negatif_dengan_ventilator_confim_p,
                        'icu_tekanan_negatif_tanpa_ventilator_suspect_l'=> $item->icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                        'icu_tekanan_negatif_tanpa_ventilator_suspect_p'=> $item->icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                        'icu_tekanan_negatif_tanpa_ventilator_confirm_l'=> $item->icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                        'icu_tekanan_negatif_tanpa_ventilator_confirm_p'=> $item->icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                        'isolasi_tekanan_negatif_suspect_l'=> $item->isolasi_tekanan_negatif_suspect_l,
                        'isolasi_tekanan_negatif_suspect_p'=> $item->isolasi_tekanan_negatif_suspect_p,
                        'isolasi_tekanan_negatif_confirm_l'=> $item->isolasi_tekanan_negatif_confirm_l,
                        'isolasi_tekanan_negatif_confirm_p'=> $item->isolasi_tekanan_negatif_confirm_p,
                        'isolasi_tanpa_tekanan_negatif_suspect_l'=> $item->isolasi_tanpa_tekanan_negatif_suspect_l,
                        'isolasi_tanpa_tekanan_negatif_suspect_p'=> $item->isolasi_tanpa_tekanan_negatif_suspect_p,
                        'isolasi_tanpa_tekanan_negatif_confirm_l'=> $item->isolasi_tanpa_tekanan_negatif_confirm_l,
                        'isolasi_tanpa_tekanan_negatif_confirm_p'=> $item->isolasi_tanpa_tekanan_negatif_confirm_p,
                        'nicu_khusus_covid_suspect_l'=> $item->nicu_khusus_covid_suspect_l,
                        'nicu_khusus_covid_suspect_p'=> $item->nicu_khusus_covid_suspect_p,
                        'nicu_khusus_covid_confirm_l'=> $item->nicu_khusus_covid_confirm_l,
                        'nicu_khusus_covid_confirm_p'=> $item->nicu_khusus_covid_confirm_p,
                        'picu_khusus_covid_suspect_l'=> $item->picu_khusus_covid_suspect_l,
                        'picu_khusus_covid_suspect_p'=> $item->picu_khusus_covid_suspect_p,
                        'picu_khusus_covid_confirm_l'=> $item->picu_khusus_covid_confirm_l,
                        'picu_khusus_covid_confirm_p'=> $item->picu_khusus_covid_confirm_p,
                    );
                }

            //    return($dataTTDetail);
            //    die();
        
        $postdata = json_encode($dataTTDetail);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }

    public function pushPasienNonKomorbid(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/LapV2/PasienDirawatTanpaKomorbid";
        $method = "POST"; // POST / PUT / DELETE
        $tglAwal = Carbon::now()->format('Y-m-d 00:00');
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $tglKirim = Carbon::now()->format('Y-m-d');
        $dataALL = DB::select(DB::raw("SELECT
                    SUM (
                        x.icu_dengan_ventilator_suspect_l
                    ) icu_dengan_ventilator_suspect_l,
                    SUM (
                        x.icu_dengan_ventilator_suspect_p
                    ) icu_dengan_ventilator_suspect_p,
                    SUM (
                        x.icu_dengan_ventilator_confirm_l
                    ) icu_dengan_ventilator_confirm_l,
                    SUM (
                        x.icu_dengan_ventilator_confirm_p
                    ) icu_dengan_ventilator_confirm_p,
                    SUM (
                        x.icu_tanpa_ventilator_suspect_l
                    ) icu_tanpa_ventilator_suspect_l,
                    SUM (
                        x.icu_tanpa_ventilator_suspect_p
                    ) icu_tanpa_ventilator_suspect_p,
                    SUM (
                        x.icu_tanpa_ventilator_confirm_l
                    ) icu_tanpa_ventilator_confirm_l,
                    SUM (
                        x.icu_tanpa_ventilator_confirm_p
                    ) icu_tanpa_ventilator_confirm_p,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_suspect_l
                    ) icu_tekanan_negatif_dengan_ventilator_suspect_l,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_suspect_p
                    ) icu_tekanan_negatif_dengan_ventilator_suspect_p,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_confim_l
                    ) icu_tekanan_negatif_dengan_ventilator_confim_l,
                    SUM (
                        x.icu_tekanan_negatif_dengan_ventilator_confim_p
                    ) icu_tekanan_negatif_dengan_ventilator_confim_p,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_suspect_l
                    ) icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_suspect_p
                    ) icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_confirm_l
                    ) icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                    SUM (
                        x.icu_tekanan_negatif_tanpa_ventilator_confirm_p
                    ) icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                    SUM (
                        x.isolasi_tekanan_negatif_suspect_l
                    ) isolasi_tekanan_negatif_suspect_l,
                    SUM (
                        x.isolasi_tekanan_negatif_suspect_p
                    ) isolasi_tekanan_negatif_suspect_p,
                    SUM (
                        x.isolasi_tekanan_negatif_confirm_l
                    ) isolasi_tekanan_negatif_confirm_l,
                    SUM (
                        x.isolasi_tekanan_negatif_confirm_p
                    ) isolasi_tekanan_negatif_confirm_p,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_suspect_l
                    ) isolasi_tanpa_tekanan_negatif_suspect_l,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_suspect_p
                    ) isolasi_tanpa_tekanan_negatif_suspect_p,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_confirm_l
                    ) isolasi_tanpa_tekanan_negatif_confirm_l,
                    SUM (
                        x.isolasi_tanpa_tekanan_negatif_confirm_p
                    ) isolasi_tanpa_tekanan_negatif_confirm_p,
                    SUM (
                        x.nicu_khusus_covid_suspect_l
                    ) nicu_khusus_covid_suspect_l,
                    SUM (
                        x.nicu_khusus_covid_suspect_p
                    ) nicu_khusus_covid_suspect_p,
                    SUM (
                        x.nicu_khusus_covid_confirm_l
                    ) nicu_khusus_covid_confirm_l,
                    SUM (
                        x.nicu_khusus_covid_confirm_p
                    ) nicu_khusus_covid_confirm_p,
                    SUM (
                        x.picu_khusus_covid_suspect_l
                    ) picu_khusus_covid_suspect_l,
                    SUM (
                        x.picu_khusus_covid_suspect_p
                    ) picu_khusus_covid_suspect_p,
                    SUM (
                        x.picu_khusus_covid_confirm_l
                    ) picu_khusus_covid_confirm_l,
                    SUM (
                        x.picu_khusus_covid_confirm_p
                    ) picu_khusus_covid_confirm_p
                FROM
                    (
                        SELECT
                            CASE
                        WHEN pd.objectkomorbidfk = 2
                        AND pd.objectkomorbiddetailfk = 1
                        AND ps.objectjeniskelaminfk = 1 THEN
                            1
                        ELSE
                            0
                        END AS icu_dengan_ventilator_suspect_l,
                        CASE
                    WHEN pd.objectkomorbidfk = 2
                    AND pd.objectkomorbiddetailfk = 1
                    AND ps.objectjeniskelaminfk = 2 THEN
                        1
                    ELSE
                        0
                    END AS icu_dengan_ventilator_suspect_p,
                    CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 2
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_dengan_ventilator_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 2
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_dengan_ventilator_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 3
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 3
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 4
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 4
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tanpa_ventilator_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 5
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 5
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 6
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_confim_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 6
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_dengan_ventilator_confim_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 7
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 7
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 8
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 8
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 9
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 9
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 10
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 10
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tekanan_negatif_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 11
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 11
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 12
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 12
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS isolasi_tanpa_tekanan_negatif_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 13
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 13
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 14
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 14
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS nicu_khusus_covid_confirm_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 15
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_suspect_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 15
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_suspect_p,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 16
                AND ps.objectjeniskelaminfk = 1 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_confirm_l,
                CASE
                WHEN pd.objectkomorbidfk = 2
                AND pd.objectkomorbiddetailfk = 16
                AND ps.objectjeniskelaminfk = 2 THEN
                    1
                ELSE
                    0
                END AS picu_khusus_covid_confirm_p
                FROM
                    pasiendaftar_t pd
                INNER JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                INNER JOIN pasien_m ps ON ps.id = pd.nocmfk
                WHERE
                    pd.tglpulang IS NULL
                AND pd.objectkasuspenyakitlastfk <> 1
                AND ru.objectdepartemenfk = 16
                AND pd.statusenabled = 1
                    ) AS x"));
                foreach ($dataALL as $item){
                    $dataTTDetail =array(
                        'tanggal'=> $tglKirim,
                        'icu_dengan_ventilator_suspect_l'=> $item->icu_dengan_ventilator_suspect_l,
                        'icu_dengan_ventilator_suspect_p'=> $item->icu_dengan_ventilator_suspect_p,
                        'icu_dengan_ventilator_confirm_l'=> $item->icu_dengan_ventilator_confirm_l,
                        'icu_dengan_ventilator_confirm_p'=> $item->icu_dengan_ventilator_confirm_p,
                        'icu_tanpa_ventilator_suspect_l'=> $item->icu_tanpa_ventilator_suspect_l,
                        'icu_tanpa_ventilator_suspect_p'=> $item->icu_tanpa_ventilator_suspect_p,
                        'icu_tanpa_ventilator_confirm_l'=> $item->icu_tanpa_ventilator_confirm_l,
                        'icu_tanpa_ventilator_confirm_p'=> $item->icu_tanpa_ventilator_confirm_p,
                        'icu_tekanan_negatif_dengan_ventilator_suspect_l'=> $item->icu_tekanan_negatif_dengan_ventilator_suspect_l,
                        'icu_tekanan_negatif_dengan_ventilator_suspect_p'=> $item->icu_tekanan_negatif_dengan_ventilator_suspect_p,
                        'icu_tekanan_negatif_dengan_ventilator_confirm_l'=> $item->icu_tekanan_negatif_dengan_ventilator_confim_l,
                        'icu_tekanan_negatif_dengan_ventilator_confirm_p'=> $item->icu_tekanan_negatif_dengan_ventilator_confim_p,
                        'icu_tekanan_negatif_tanpa_ventilator_suspect_l'=> $item->icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                        'icu_tekanan_negatif_tanpa_ventilator_suspect_p'=> $item->icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                        'icu_tekanan_negatif_tanpa_ventilator_confirm_l'=> $item->icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                        'icu_tekanan_negatif_tanpa_ventilator_confirm_p'=> $item->icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                        'isolasi_tekanan_negatif_suspect_l'=> $item->isolasi_tekanan_negatif_suspect_l,
                        'isolasi_tekanan_negatif_suspect_p'=> $item->isolasi_tekanan_negatif_suspect_p,
                        'isolasi_tekanan_negatif_confirm_l'=> $item->isolasi_tekanan_negatif_confirm_l,
                        'isolasi_tekanan_negatif_confirm_p'=> $item->isolasi_tekanan_negatif_confirm_p,
                        'isolasi_tanpa_tekanan_negatif_suspect_l'=> $item->isolasi_tanpa_tekanan_negatif_suspect_l,
                        'isolasi_tanpa_tekanan_negatif_suspect_p'=> $item->isolasi_tanpa_tekanan_negatif_suspect_p,
                        'isolasi_tanpa_tekanan_negatif_confirm_l'=> $item->isolasi_tanpa_tekanan_negatif_confirm_l,
                        'isolasi_tanpa_tekanan_negatif_confirm_p'=> $item->isolasi_tanpa_tekanan_negatif_confirm_p,
                        'nicu_khusus_covid_suspect_l'=> $item->nicu_khusus_covid_suspect_l,
                        'nicu_khusus_covid_suspect_p'=> $item->nicu_khusus_covid_suspect_p,
                        'nicu_khusus_covid_confirm_l'=> $item->nicu_khusus_covid_confirm_l,
                        'nicu_khusus_covid_confirm_p'=> $item->nicu_khusus_covid_confirm_p,
                        'picu_khusus_covid_suspect_l'=> $item->picu_khusus_covid_suspect_l,
                        'picu_khusus_covid_suspect_p'=> $item->picu_khusus_covid_suspect_p,
                        'picu_khusus_covid_confirm_l'=> $item->picu_khusus_covid_confirm_l,
                        'picu_khusus_covid_confirm_p'=> $item->picu_khusus_covid_confirm_p,
                    );
                }

            //    return($dataTTDetail);
            //    die();
        
        $postdata = json_encode($dataTTDetail);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }

    public function pushPasienPulang(Request $request) {
        // id & pass dari kemkes
        $id = $this->userSirsonline();
        $pass = $this->passwordSirsonline();

        // get Timestamp
        $dt = new \DateTime(null,new \DateTimeZone("UTC"));
        $timeStamp = $dt->getTimestamp();

        // generate signature
        $key = $id."&".$timeStamp;
        $signature = base64_encode(hash_hmac("sha256",utf8_encode($key), utf8_encode($pass),true));

        $url = $this->getUrlSirsOnline()."/LapV2/PasienKeluar";
        $method = "POST"; // POST / PUT / DELETE
        $tglAwal = Carbon::now()->format('Y-m-d 00:00');
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $tglKirim = Carbon::now()->format('Y-m-d');
        $dataALL = DB::select(DB::raw("SELECT
                    SUM (
                        x.sembuh
                    ) sembuh,
                    SUM (
                        x.discarded
                    ) discarded,
                    SUM (
                        x.meninggal_komorbid
                    ) meninggal_komorbid,
                    SUM (
                        x.meninggal_tanpa_komorbid
                    ) meninggal_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_pre_komorbid
                    ) meninggal_prob_pre_komorbid,
                    SUM (
                        x.meninggal_prob_neo_komorbid
                    ) meninggal_prob_neo_komorbid,
                    SUM (
                        x.meninggal_prob_bayi_komorbid
                    ) meninggal_prob_bayi_komorbid,
                    SUM (
                        x.meninggal_prob_balita_komorbid
                    ) meninggal_prob_balita_komorbid,
                    SUM (
                        x.meninggal_prob_anak_komorbid
                    ) meninggal_prob_anak_komorbid,
                    SUM (
                        x.meninggal_prob_remaja_komorbid
                    ) meninggal_prob_remaja_komorbid,
                    SUM (
                        x.meninggal_prob_dws_komorbid
                    ) meninggal_prob_dws_komorbid,
                    SUM (
                        x.meninggal_prob_lansia_komorbid
                    ) meninggal_prob_lansia_komorbid,
                    SUM (
                        x.meninggal_prob_pre_tanpa_komorbid
                    ) meninggal_prob_pre_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_neo_tanpa_komorbid
                    ) meninggal_prob_neo_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_bayi_tanpa_komorbid
                    ) meninggal_prob_bayi_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_balita_tanpa_komorbid
                    ) meninggal_prob_balita_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_anak_tanpa_komorbid
                    ) meninggal_prob_anak_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_remaja_tanpa_komorbid
                    ) meninggal_prob_remaja_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_dws_tanpa_komorbid
                    ) meninggal_prob_dws_tanpa_komorbid,
                    SUM (
                        x.meninggal_prob_lansia_tanpa_komorbid
                    ) meninggal_prob_lansia_tanpa_komorbid,
                    SUM (
                        x.meninggal_disarded_komorbid
                    ) meninggal_disarded_komorbid,
                    SUM (
                        x.meninggal_discarded_tanpa_komorbid
                    ) meninggal_discarded_tanpa_komorbid,
                    SUM (
                        x.dirujuk
                    ) dirujuk,
                    SUM (
                        x.isman
                    ) isman,
                    SUM (
                        x.aps
                    ) aps
                FROM
                    (
                        SELECT
                            CASE
                        WHEN pd.objectpulangcovidfk = 1
                        THEN
                            1
                        ELSE
                            0
                        END AS sembuh,
                                                CASE
                        WHEN pd.objectpulangcovidfk = 2
                        THEN
                            1
                        ELSE
                            0
                        END AS discarded,
            CASE
                        WHEN pd.objectpulangcovidfk = 3
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 4
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 5
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_pre_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 6
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_neo_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 7
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_bayi_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 8
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_balita_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 9
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_anak_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 10
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_remaja_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 11
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_dws_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 12
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_lansia_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 13
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_pre_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 14
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_neo_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 15
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_bayi_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 16
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_balita_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 17
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_anak_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 18
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_remaja_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 19
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_dws_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 20
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_prob_lansia_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 21
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_disarded_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 22
                        THEN
                            1
                        ELSE
                            0
                        END AS meninggal_discarded_tanpa_komorbid,
            CASE
                        WHEN pd.objectpulangcovidfk = 23
                        THEN
                            1
                        ELSE
                            0
                        END AS dirujuk,
            CASE
                        WHEN pd.objectpulangcovidfk = 24
                        THEN
                            1
                        ELSE
                            0
                        END AS isman,
            CASE
                        WHEN pd.objectpulangcovidfk = 25
                        THEN
                            1
                        ELSE
                            0
                        END AS aps
                    
                FROM
                    pasiendaftar_t pd
                INNER JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                INNER JOIN pasien_m ps ON ps.id = pd.nocmfk
                WHERE
                    pd.tglpulang BETWEEN '$tglAwal' and '$tglAkhir' and pd.objectpulangcovidfk is not null
                AND pd.statusenabled = 1
                    ) AS x"));
                foreach ($dataALL as $item){
                    $dataTTDetail =array(
                        'tanggal'=> $tglKirim,
                        'sembuh'=> $item->sembuh,
                        'discarded'=> $item->discarded,
                        'meninggal_komorbid'=> $item->meninggal_komorbid,
                        'meninggal_tanpa_komorbid'=> $item->meninggal_tanpa_komorbid,
                        'meninggal_prob_pre_komorbid'=> $item->meninggal_prob_pre_komorbid,
                        'meninggal_prob_neo_komorbid'=> $item->meninggal_prob_neo_komorbid,
                        'meninggal_prob_bayi_komorbid'=> $item->meninggal_prob_bayi_komorbid,
                        'meninggal_prob_balita_komorbid'=> $item->meninggal_prob_balita_komorbid,
                        'meninggal_prob_anak_komorbid'=> $item->meninggal_prob_anak_komorbid,
                        'meninggal_prob_remaja_komorbid'=> $item->meninggal_prob_remaja_komorbid,
                        'meninggal_prob_dws_komorbid'=> $item->meninggal_prob_dws_komorbid,
                        'meninggal_prob_lansia_komorbid'=> $item->meninggal_prob_lansia_komorbid,
                        'meninggal_prob_pre_tanpa_komorbid'=> $item->meninggal_prob_pre_tanpa_komorbid,
                        'meninggal_prob_neo_tanpa_komorbid'=> $item->meninggal_prob_neo_tanpa_komorbid,
                        'meninggal_prob_bayi_tanpa_komorbid'=> $item->meninggal_prob_bayi_tanpa_komorbid,
                        'meninggal_prob_balita_tanpa_komorbid'=> $item->meninggal_prob_balita_tanpa_komorbid,
                        'meninggal_prob_anak_tanpa_komorbid'=> $item->meninggal_prob_anak_tanpa_komorbid,
                        'meninggal_prob_remaja_tanpa_komorbid'=> $item->meninggal_prob_remaja_tanpa_komorbid,
                        'meninggal_prob_dws_tanpa_komorbid'=> $item->meninggal_prob_dws_tanpa_komorbid,
                        'meninggal_prob_lansia_tanpa_komorbid'=> $item->meninggal_prob_lansia_tanpa_komorbid,
                        'meninggal_disarded_komorbid'=> $item->meninggal_disarded_komorbid,
                        'meninggal_discarded_tanpa_komorbid'=> $item->meninggal_discarded_tanpa_komorbid,
                        'dirujuk'=> $item->dirujuk,
                        'isman'=> $item->isman,
                        'aps'=> $item->aps

                    );
                }

               
        
        $postdata = json_encode($dataTTDetail);
        
//        return $this->respond($postdata);
        $headers = [
            "X-rs-id: ".$id,
            "X-Timestamp: ".$timeStamp,
            "X-pass: ".$pass,
            "Content-type: application/json"
        ];

        // Gunakan curl untuk mengakses/merequest alamat api
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postdata);

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);

    }
}