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
use App\Transaksi\AntrianPasienRegistrasi;
use App\Transaksi\AntrianPasienRegistrasiPasienBaruMjkn;
use App\Master\Pasien;
use App\Master\Alamat;
use App\Master\RunningNumber;
use App\Transaksi\BatalRegistrasi;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\SendTaskAntrol;
use App\Transaksi\MjknLog;
use Webpatser\Uuid\Uuid;
use DB;
use App\Traits\Valet;
use Carbon\Carbon;

class BridgingBPJSV2Controller extends ApiController
{

    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    protected function getJadwalDokterMjkn($request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        $encodedSignature = base64_encode($signature);
        // return($request['tanggal']);
        // die();
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            // CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."RencanaKontrol/ListRencanaKontrol/tglAwal/".$request['tglAwal']."/tglAkhir/".$request['tglAkhir']."/filter/".$request['jenis'],
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "jadwaldokter/kodepoli/" . $request['kodepoli'] . "/tanggal/" . $request['tanggal'],
            // CURLOPT_URL => $this->getUrlBrigdingAntrol()."jadwaldokter/kodepoli/INT/tanggal/2022-03-18",
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
                "X-cons-id: " .  $data,
                "X-timestamp: " . (string)$tStamp,
                "X-signature: " . (string)$encodedSignature,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        if ($result['metadata']->code == '201') {
            $result = array(
                "status" => "tidakada",
            );
            return $result;
        } else {
            return $this->stringDecrypt($key, $result);
        }
    }
    public function getPasien(Request $request)
    {
        $data = \DB::table('pasien_m as ps')
            ->select('ps.*', 'jk.jeniskelamin')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->where('ps.statusenabled', true)
            ->where('ps.nocm', $request["rm"])
            ->first();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }
    public function getAsalRujukanBPJS(Request $request)
    {
        $data = \DB::table('asalrujukanbpjs_m as ar')
            ->select('ar.id', 'ar.kdasalrujukan', 'ar.asalrujukan')
            ->where('ar.statusenabled', true)
            ->orderBy('ar.id')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }
    public function getSignature(Request $request)
    {
        $data = $request['consid'];
        $secretKey = $request['secretkey'];
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        // urlencode…
        // $encodedSignature = urlencode($encodedSignature);

        //        echo "X-cons-id: " .$data ." ";
        //        echo "X-timestamp:" .$tStamp ." ";
        //        echo "X-signature: " .$encodedSignature;

        $result = array(
            "X-cons-id" =>  $data,
            "X-timestamp" => $tStamp,
            "X-signature" => $encodedSignature,
        );



        return $this->respond($result);
    }

    public function getV2(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . $request['path'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function getNoPeserta(Request $request)
    {
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Peserta/nokartu/" . $request['nokartu'] . "/tglSEP/" . $request['tglsep'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }


    public function getNIK(Request $request)
    {
        $userKey = $this->getUserKeyVclaimV2();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();

        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Peserta/nik/" . $request['nik'] . "/tglSEP/" . $request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }

    public function insertSEP(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/insert",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS =>
            "{\r\n\"request\": 
                         {\r\n\"t_sep\": 
                            {
                            \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
                            \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
                            \r\n\"ppkPelayanan\": \"0904R004\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"klsRawat\": {\r\n\"klsRawatHak\": \"" . $request['kelasrawathak'] . "\",
                                            \r\n\"klsRawatNaik\": \"" . $request['kelasrawatnaik'] . "\",
                                            \r\n\"pembiayaan\": \"" . $request['pembiayaan'] . "\",
                                            \r\n\"penanggungJawab\": \"" . $request['penanggungjawab'] . "\"\r\n},
                            \r\n\"noMR\": \"" . $request['nomr'] . "\",
                            \r\n\"rujukan\": {\r\n\"asalRujukan\": \"" . $request['asalrujukan'] . "\",
                                            \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
                                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                                            \r\n\"ppkRujukan\": \"" . $request['ppkrujukan'] . "\"\r\n},
                            \r\n\"catatan\": \"" . $request['catatan'] . "\",
                            \r\n\"diagAwal\": \"" . $request['diagnosaawal'] . "\",
                            \r\n\"poli\": {\r\n\"tujuan\": \"" . $request['politujuan'] . "\",
                                         \r\n\"eksekutif\": \"" . $request['eksekutif'] . "\"\r\n},
                            \r\n\"cob\": 
                                        {\r\n\"cob\": \"" . $request['cob'] . "\"\r\n},
                            \r\n\"katarak\": 
                                        {\r\n\"katarak\": \"" . $request['katarak'] . "\"\r\n},
                            \r\n\"jaminan\": {\r\n\"lakaLantas\": \"" . $request['lakalantas'] . "\",
                                                \r\n\"penjamin\":
                                                    {\r\n\"tglKejadian\": \"" . $request['tglkejadian'] . "\",
                                                    \r\n\"keterangan\": \"" . $request['keterangan'] . "\"
                                                    \r\n\"suplesi\":
                                                        {\r\n\"kdPropinsi\": \"" . $request['kdpropinsi'] . "\",
                                                        \r\n\"kdKabupaten\": \"" . $request['kdkabupaten'] . "\"
                                                        \r\n\"kdKecamatan\": \"" . $request['kdkecamatan'] . "\"\r\n}
                                                    \r\n}
                                            \r\n},
                            \r\n\"tujuanKunj\": \"" . $request['tujuankunj'] . "\",
                            \r\n\"flagProcedure\": \"" . $request['flagprocedure'] . "\",
                            \r\n\"kdPenunjang\": \"" . $request['kdpenunjang'] . "\",
                            \r\n\"assesmentPel\": \"" . $request['assesmentpel'] . "\",
                            \r\n\"skdp\": {\r\n\"noSurat\": \"" . $request['nosurat'] . "\",
                                        \r\n\"kodeDPJP\": \"" . $request['kodedpjp'] . "\"\r\n},
                            \r\n\"dpjpLayan\": \"" . $request['dpjplayan'] . "\",
                            \r\n\"noTelp\": \"" . $request['notelp'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n,
                            
                      }",

            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function cekSep(Request $request)
    {
        // $data = '12098';//$this->getIdConsumerBPJSV2();
        // $secretKey = '8pX68721CC';//$this->getPasswordConsumerBPJSV2();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        // return($this->getUrlBrigdingBPJSV2());
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/" . $request['nosep'],
            //    CURLOPT_URL => "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/SEP/".$request['nosep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: 07c605ad-c672-6e5b-562e-7cee1f9cd0ea",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }

    public function deleteSEP(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/2.0/delete",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/Delete",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_POSTFIELDS => "{\r\n\"request\": 
                                       {\r\n\"t_sep\": 
                                         {
                                            \r\n\"noSep\": \"" . $request['nosep'] . "\",
                                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                                    }",
            CURLOPT_HTTPHEADER => array(
                //                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: 161b9dda-e007-dea4-1f53-75f393715c1e",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }

    public function Icare(Request $request)
    {
        // return($request['data']);
        // die();
        $req = $request->all();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        // return($dataJsonSend);
        // die();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL =>  "https://apijkn.bpjs-kesehatan.go.id/wsihs/api/rs/validate",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;

        // die();
        $result = $this->stringDecryptVclaim($key, $result);
        // $res=$result['response']['poli'];
        return $this->respond($result);
    }
    public function updateSEP(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/Update",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/Update",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS =>
            "{\r\n\"request\": 
                        {\r\n\"t_sep\": 
                            {\r\n\"noSep\": \"" . $request['nosep'] . "\",
                                \r\n\"klsRawat\": {\r\n\"klsRawatHak\": \"" . $request['kelasrawathak'] . "\",
                                                \r\n\"klsRawatNaik\": \"" . $request['kelasrawatnaik'] . "\",
                                                \r\n\"pembiayaan\": \"" . $request['pembiayaan'] . "\",
                                                \r\n\"penanggungJawab\": \"" . $request['penanggungjawab'] . "\"\r\n},
                            \r\n\"noMR\": \"" . $request['nomr'] . "\",
                            \r\n\"rujukan\": {\r\n\"asalRujukan\": \"" . $request['asalrujukan'] . "\",
                            \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                            \r\n\"ppkRujukan\": \"" . $request['ppkrujukan'] . "\"\r\n},
                            \r\n\"catatan\": \"" . $request['catatan'] . "\",
                            \r\n\"diagAwal\": \"" . $request['kddiagnosaawal'] . "\",
                            \r\n\"poli\": {\r\n\"tujuan\": \"" . $request['politujuan'] . "\",
                                         \r\n\"eksekutif\": \"" . $request['eksekutif'] . "\"\r\n},
                            \r\n\"cob\": 
                                        {\r\n\"cob\": \"" . $request['cob'] . "\"\r\n},
                            \r\n\"katarak\": 
                                        {\r\n\"katarak\": \"" . $request['katarak'] . "\"\r\n},
                            \r\n\"jaminan\": 
                                {\r\n\"lakaLantas\": \"" . $request['lakalantas'] . "\",
                                    \r\n\"penjamin\":
                                        {\r\n\"tglKejadian\": \"" . $request['tglkejadian'] . "\",
                                        \r\n\"keterangan\": \"" . $request['keterangan'] . "\"
                                        \r\n\"suplesi\":
                                            {\r\n\"kdPropinsi\": \"" . $request['kdpropinsi'] . "\",
                                            \r\n\"kdKabupaten\": \"" . $request['kdkabupaten'] . "\"
                                            \r\n\"kdKecamatan\": \"" . $request['kdkecamatan'] . "\"\r\n}
                                        \r\n}
                                \r\n},
                            \r\n\"tujuanKunj\": \"" . $request['tujuankunj'] . "\",
                            \r\n\"flagProcedure\": \"" . $request['flagprocedure'] . "\",
                            \r\n\"kdPenunjang\": \"" . $request['kdpenunjang'] . "\",
                            \r\n\"assesmentPel\": \"" . $request['assesmentpel'] . "\",
                            \r\n\"skdp\": {\r\n\"noSurat\": \"" . $request['nosurat'] . "\",
                                        \r\n\"kodeDPJP\": \"" . $request['kodedpjp'] . "\"\r\n},
                            \r\n\"dpjpLayan\": \"" . $request['dpjplayan'] . "\",
                            \r\n\"noTelp\": \"" . $request['notelp'] . "\",
                            \r\n\"user\": \"ramdanegie\"\r\n
                          }\r\n}
                      \r\n}",
            CURLOPT_HTTPHEADER => array(
                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: c359f488-f523-6279-b14f-64a1dab17772",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "Services Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function getPoli(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/poli/" . $request['kodeNamaPoli'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/referensi/poli/".$request['kodePoli'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getNoRujukanRs(Request $request)
    {
        // return($request);
        // die();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/RS/" . $request['norujukan'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }
    public function getNoRujukanPcare(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/" . $request['norujukan'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function updateTglPulang(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $dataJsonSend = json_encode($request['data']);
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/2.0/updtglplg",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/Update",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS => $dataJsonSend,

            CURLOPT_HTTPHEADER => array(
                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: c359f488-f523-6279-b14f-64a1dab17772",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "Services Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function getDiagnosa(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),

            //         CURLOPT_URL=> "https://vclaim.bpjs-kesehatan.go.id/tot/Referensi/getDiagnosa".$request['nama'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/diagnosa/" . $request['kdNamaDiagnosa'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function getFaskes(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/faskes/" . $request['kdNamaFaskes'] . "/" . $request['jenisFakses'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function getProcedureDiagnosaTindakan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/procedure/" . $request['kdNamaDiagnosa'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function getKelasRawat(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/kelasrawat",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function getDokter(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/dokter/" . $request['namaDokter'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function getSpesialistik(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaim();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/spesialistik",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function getRuangRawat(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/ruangrawat",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function getCaraKeluar(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/carakeluar",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function getPascaPulang(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/pascapulang",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function postPengajuan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Sep/pengajuanSEP",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS =>
            "{\r\n\"request\": 
                         {\r\n\"t_sep\": 
                            {
                            \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
                            \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"jnsPengajuan\": \"" . $request['postjenisPengajuan'] . "\",
                            \r\n\"keterangan\": \"" . $request['keterangan'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }
    public function postApprovalPengajuanSep(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Sep/aprovalSEP",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS =>
            "{\r\n\"request\": 
                         {\r\n\"t_sep\": 
                            {
                            \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
                            \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"jnsPengajuan\": \"" . $request['postjenisPengajuan'] . "\",
                            \r\n\"keterangan\": \"" . $request['keterangan'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }
    public function getIntegrasiSepInaCbg(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "sep/cbg/" . $request['noSEP'],
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function getNoRujukanRsNoKartu(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/RS/Peserta/" . $request['nokartu'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function getNoRujukanPcareNoKartu(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/Peserta/" . $request['nokartu'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function insertRujukan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/2.0/insert",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS =>
            //            {
            //       "request": {
            //            "t_rujukan": {
            //                "noSep": "{nomor sep}",
            //             "tglRujukan": "{tanggal rujukan format : yyyy-mm-dd}",
            //             "ppkDirujuk": "{faskes dirujuk -> data di referensi faskes}",
            //             "jnsPelayanan": "{jenis pelayanan -> 1.R.Inap 2.R.Jalan}",
            //             "catatan": "{catatan rujukan}",
            //             "diagRujukan": "{kode diagnosa rujukan -> data di referensi diagnosa}",
            //             "tipeRujukan": "{tipe rujukan -> 0.penuh, 1.Partial 2.rujuk balik}",
            //             "poliRujukan": "{kode poli rujukan -> data di referensi poli}",
            //             "user": "{user pemakai}"
            //          }
            //       }
            //    }
            "{\r\n\"request\":
                        {\r\n\"t_rujukan\":
                           {
                           \r\n\"noSep\": \"" . $request['nosep'] . "\",
                           \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
                           \r\n\"tglRencanaKunjungan\": \"" . $request['tglRencanaKunjungan'] . "\",
                           \r\n\"ppkDirujuk\": \"" . $request['ppkdirujuk'] . "\",
                           \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                           \r\n\"catatan\": \"" . $request['catatan'] . "\",
                            \r\n\"diagRujukan\": \"" . $request['diagnosarujukan'] . "\",
                           \r\n\"tipeRujukan\": \"" . $request['tiperujukan'] . "\",
                           \r\n\"poliRujukan\": \"" . $request['polirujukan'] . "\",
                           \r\n\"user\": \"" . $request['user'] . "\"\r\n}\r\n}\r\n

                     }",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
        // return $this->respond($result);
    }
    public function updateRujukan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/update",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS =>
            //            {
            //       "request": {
            //            "t_rujukan": {
            //                "noRujukan": "{nomor rujukan}",
            //             "ppkDirujuk": "{faskes dirujuk -> data di referensi faskes}",
            //             "tipe": "{tipe rujukan -> 0.penuh, 1.Partial 2.rujuk balik}",
            //             "jnsPelayanan": "{jenis pelayanan -> 1.R.Inap 2.R.Jalan}",
            //             "catatan": "{catatan rujukan}",
            //             "diagRujukan": "{kode diagnosa rujukan -> data di referensi diagnosa}",
            //             "tipeRujukan": "{tipe rujukan -> 0.penuh, 1.Partial 2.rujuk balik}",
            //             "poliRujukan": "{kode poli rujukan -> data di referensi poli}",
            //             "user": "{user pemakai}"
            //          }
            //       }
            //    }
            "{\r\n\"request\": 
                         {\r\n\"t_rujukan\": 
                            {
                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                            \r\n\"tipe\": \"" . $request['tipe'] . "\",
                            \r\n\"ppkDirujuk\": \"" . $request['ppkdirujuk'] . "\",
                            \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
                            \r\n\"catatan\": \"" . $request['catatan'] . "\",
                             \r\n\"diagRujukan\": \"" . $request['diagnosarujukan'] . "\",
                            \r\n\"tipeRujukan\": \"" . $request['tiperujukan'] . "\",
                            \r\n\"poliRujukan\": \"" . $request['polirujukan'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function deleteRujukan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/Delete",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/Delete",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_POSTFIELDS => "{\r\n\"request\": 
                                       {\r\n\"t_rujukan\": 
                                         {
                                            \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
                                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                                    }",
            CURLOPT_HTTPHEADER => array(
                //                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: 161b9dda-e007-dea4-1f53-75f393715c1e",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function insertLPK(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "LPK/insert",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS =>
            "{\r\n\"request\": 
                         {\r\n\"t_lpk\": 
                            {
                            \r\n\"noSep\": \"" . $request['nosep'] . "\",
                            \r\n\"tglMasuk\": \"" . $request['tglmasuk'] . "\",
                            \r\n\"tglKeluar\":  \"" . $request['tglkeluar'] . "\",
                            \r\n\"jaminan\": \"" . $request['jaminan'] . "\",
                            \r\n\"poli\": 
                                        {\r\n\"poli\": \"" . $request['poli'] . "\"\r\n},
                            \r\n\"perawatan\": 
                                         {\r\n\"ruangRawat\": \"" . $request['ruangrawat'] . "\",
                                         \r\n\"kelasRawat\": \"" . $request['kelasrawat'] . "\",
                                         \r\n\"spesialistik\": \"" . $request['spesialistik'] . "\",
                                          \r\n\"caraKeluar\": \"" . $request['carakeluar'] . "\",
                                         \r\n\"kondisiPulang\": \"" . $request['kondisipulang'] . "\"\r\n},
                           \r\n\"diagnosa\": 
                                     [\r\n 
                                         {\r\n\"kode\": \"" . $request['kodeprimer'] . "\",
                                         \r\n\"level\": \"" . $request['levelprimer'] . "\"\r\n},
                                         {\r\n\"kode\": \"" . $request['kodesekunder'] . "\",
                                         \r\n\"level\": \"" . $request['levelsekunder'] . "\"\r\n},
                                      \r\n],
                           \r\n\"procedure\": 
                                     [\r\n 
                                         {\r\n\"kode\": \"" . $request['kodediagtindakanprimer'] . "\"\r\n},
                                         {\r\n\"kode\": \"" . $request['kodediagtindakansekunder'] . "\"\r\n},
                                      \r\n],
                           \r\n\"rencanaTL\": 
                                         {\r\n\"tindakLanjut\": \"" . $request['tindaklanjut'] . "\",
                                         \r\n\"dirujukKe\": 
                                                        {\r\n\"kodePPK\": \"" . $request['kodeppk'] . "\"\r\n},
                                          \r\n\"kontrolKembali\": 
                                                        {\r\n\"tglKontrol\": \"" . $request['tglkontrol'] . "\",
                                                        \r\n\"poli\": \"" . $request['polikontrol'] . "\",
                                                        \r\n},
                                         \r\n}, 
                            \r\n\"DPJP\": \"" . $request['dpjp'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }",
            //             {
            //       "request": {
            //            "t_lpk": {
            //                "noSep": "{nomor sep}",
            //             "tglMasuk": "{tanggal masuk format yyyy-mm-dd}",
            //             "tglKeluar": "{tanggal keluar format yyyy-mm-dd}",
            //             "jaminan": "{penjamin -> 1. JKN}",
            //             "poli": {
            //                    "poli": "{kode poli -> data di referensi poli}"
            //             },
            //             "perawatan": {
            //                    "ruangRawat": "{ruang rawat -> data di referensi ruang rawat}",
            //                "kelasRawat": "{kelas rawat -> data di referensi kelas rawat}",
            //                "spesialistik": "{spesialistik -> data di referensi spesialistik}",
            //                "caraKeluar": "{cara keluar -> data di referensi cara keluar}",
            //                "kondisiPulang": "{kondisi pulang -> data di referensi kondisi pulang}"
            //             },
            //             "diagnosa": [
            //                {
            //                    "kode": "{kode diagnosa  -> data di referensi diagnosa}",
            //                   "level": "{level diagnosa -> 1.Primer 2.Sekunder}"
            //                },
            //                {
            //                    "kode": "{kode diagnosa  -> data di referensi diagnosa}",
            //                   "level": "{level diagnosa -> 1.Primer 2.Sekunder}"
            //                }
            //             ],
            //             "procedure": [
            //                {
            //                    "kode": "{kode procedure -> data di referensi procedure/tindakan}"
            //                },
            //                {
            //                    "kode": "{kode procedure -> data di referensi procedure/tindakan}"
            //                }
            //             ],
            //             "rencanaTL": {
            //                    "tindakLanjut": "{tindak lanjut -> 1:Diperbolehkan Pulang, 2:Pemeriksaan Penunjang, 3:Dirujuk Ke, 4:Kontrol Kembali}",
            //                "dirujukKe": {
            //                        "kodePPK": "{kode faskes -> data di referensi faskes}"
            //                },
            //                "kontrolKembali": {
            //                        "tglKontrol": "{tanggal kontrol kembali format : yyyy-mm-dd}",
            //                   "poli": "{kode poli -> data di referensi poli}"
            //                }
            //             },
            //             "DPJP": "{kode dokter dpjp -> data di referensi dokter}",
            //             "user": "{user pemakai}"
            //          }
            //       }
            //    }
            //
            //
            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function updateLPK(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "LPK/update",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS =>
            "{\r\n\"request\": 
                         {\r\n\"t_lpk\": 
                            {
                            \r\n\"noSep\": \"" . $request['nosep'] . "\",
                            \r\n\"tglMasuk\": \"" . $request['tglmasuk'] . "\",
                            \r\n\"tglKeluar\":  \"" . $request['tglkeluar'] . "\",
                            \r\n\"jaminan\": \"" . $request['jaminan'] . "\",
                            \r\n\"poli\": 
                                        {\r\n\"poli\": \"" . $request['poli'] . "\"\r\n},
                            \r\n\"perawatan\": 
                                         {\r\n\"ruangRawat\": \"" . $request['ruangrawat'] . "\",
                                         \r\n\"kelasRawat\": \"" . $request['kelasrawat'] . "\",
                                         \r\n\"spesialistik\": \"" . $request['spesialistik'] . "\",
                                          \r\n\"caraKeluar\": \"" . $request['carakeluar'] . "\",
                                         \r\n\"kondisiPulang\": \"" . $request['kondisipulang'] . "\"\r\n},
                           \r\n\"diagnosa\": 
                                     [\r\n 
                                         {\r\n\"kode\": \"" . $request['kodeprimer'] . "\",
                                         \r\n\"level\": \"" . $request['levelprimer'] . "\"\r\n},
                                         {\r\n\"kode\": \"" . $request['kodesekunder'] . "\",
                                         \r\n\"level\": \"" . $request['levelsekunder'] . "\"\r\n},
                                      \r\n],
                           \r\n\"procedure\": 
                                     [\r\n 
                                         {\r\n\"kode\": \"" . $request['kodediagtindakanprimer'] . "\"\r\n},
                                         {\r\n\"kode\": \"" . $request['kodediagtindakansekunder'] . "\"\r\n},
                                      \r\n],
                           \r\n\"rencanaTL\": 
                                         {\r\n\"tindakLanjut\": \"" . $request['tindaklanjut'] . "\",
                                         \r\n\"dirujukKe\": 
                                                        {\r\n\"kodePPK\": \"" . $request['kodeppk'] . "\"\r\n},
                                          \r\n\"kontrolKembali\": 
                                                        {\r\n\"tglKontrol\": \"" . $request['tglkontrol'] . "\",
                                                        \r\n\"poli\": \"" . $request['polikontrol'] . "\",
                                                        \r\n},
                                         \r\n}, 
                            \r\n\"DPJP\": \"" . $request['dpjp'] . "\",
                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                            
                      }",

            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function deleteLPK(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "LPK/Delete",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/Delete",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_POSTFIELDS => "{\r\n\"request\": 
                                       {\r\n\"t_lpk\": 
                                         {
                                            \r\n\"noSep\": \"" . $request['nosep'] . "\"\r\n}\r\n
                                            }\r\n
                                    }",
            CURLOPT_HTTPHEADER => array(
                //                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: 161b9dda-e007-dea4-1f53-75f393715c1e",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function dataLPK(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi : Pencarian data peserta berdasarkan NIK Kependudukan
        //Method : GET
        //Format : Json
        //Content-Type: application/json; charset=utf-8
        //Parameter 1 : Tanggal Masuk - format : yyyy-MM-dd
        //Parameter 2 : Jenis Pelayanan 1. Inap 2.Jalan

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "LPK/TglMasuk/" . $request['tglmasuk'] . "/JnsPelayanan/" . $request['jenispelayanan'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function getMonitoringKunjungan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi : data Kunjungan
        //Method : GET
        //Format : Json
        //Content-Type: Tanggal SEP format: yyyy-mm-dd
        //Parameter 1 : Tanggal Masuk - format : yyyy-MM-dd
        //Parameter 2 : Jenis Pelayanan 1. Inap 2.Jalan

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Monitoring/Kunjungan/Tanggal/" . $request['tglsep'] . "/JnsPelayanan/" . $request['jenispelayanan'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }
    public function getMonitoringKlaim(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi :Data Kunjungan
        //Method : GET
        //Format : Json
        //Content-Type: application/json; charset=utf-8
        //Parameter 1 : Tanggal Pulang format: yyyy-mm-dd
        // Parameter 2 : Jenis Pelayanan (1. Inap 2. Jalan)
        // Parameter 3 : Status Klaim (1. Proses Verifikasi 2. Pending Verifikasi 3. Klaim)
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),

            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Monitoring/Klaim/Tanggal/"
                . $request['tglsep'] . "/JnsPelayanan/" . $request['jenispelayanan'] . "/Status/" . $request['status'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getDiagnosaTindakanSaeutik(Request $request)
    {
        $req = $request->all();
        $datRek = \DB::table('diagnosatindakan_m as dg')
            ->select('dg.id', 'dg.kddiagnosatindakan', 'dg.namadiagnosatindakan')
            ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosatindakan');

        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $datRek = $datRek
                ->where('dg.kddiagnosatindakan', 'like', '%' . $req['filter']['filters'][0]['value'] . '%');
            //                ->orWhere('dg.kddiagnosatindakan','ilike',$req['filter']['filters'][0]['value'].'%' )  ;
        }


        $datRek = $datRek->take(10);
        $datRek = $datRek->get();

        return $this->respond($datRek);
    }
    public function getDiagnosaSaeutik(Request $request)
    {

        $req = $request->all();
        $datRek = \DB::table('diagnosa_m as dg')
            ->select('dg.id', 'dg.kddiagnosa', 'dg.namadiagnosa')
            ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosa');
        if (
            isset($req['kdDiagnosa']) &&
            $req['kdDiagnosa'] != "" &&
            $req['kdDiagnosa'] != "undefined"
        ) {
            $datRek = $datRek->where('dg.kddiagnosa', 'ilike', '%' . $req['kdDiagnosa'] . '%');
        }
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $datRek = $datRek
                ->where('dg.kddiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            //                ->orWhere('dg.kddiagnosatindakan','ilike',$req['filter']['filters'][0]['value'].'%' )  ;
        }


        $datRek = $datRek->take(10);
        $datRek = $datRek->get();

        return $this->respond($datRek);
    }
    public function getRuanganRI(Request $request)
    {
        $data = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.kdinternal', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [26, 16, 35])
            ->orderBy('ru.namaruangan')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }
    public function getRuanganRJ(Request $request)
    {
        $data = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.kdinternal', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [24, 18, 28])
            ->orderBy('ru.namaruangan')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'niaramdanegie',
        );

        return $this->respond($result);
    }

    public function getSepByNoregistrasi(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as aps', 'aps.id', '=', 'pas.objectasuransipasienfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'aps.objectkelasdijaminfk')
            ->leftjoin('diagnosa_m as dg', 'dg.id', '=', 'pas.objectdiagnosafk')
            ->leftjoin('jenispelayanan_m as jp', 'jp.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'pd.noregistrasi',
                'ps.nocm',
                'pas.nokepesertaan',
                'pd.objectruanganlastfk',
                'ru.namaruangan',
                'ru.kdinternal',
                'aps.objectkelasdijaminfk',
                'kls.namakelas',
                'pas.tglrujukan',
                'pas.norujukan',
                'aps.kdprovider',
                'aps.nmprovider',
                'pas.catatan',
                'pas.diagnosisfk',
                'dg.kddiagnosa',
                'pd.jenispelayanan as objectjenispelayananfk',
                'jp.jenispelayanan',
                'pas.lakalantas',
                'ps.notelepon',
                'pas.nosep',
                DB::raw('case when ru.objectdepartemenfk in (26,16,35) then \'true\' 
               when ru.objectdepartemenfk in (24,18,28) then \'false\' end as israwatinap')
            )
            ->where('pd.objectruanganasalfk', null)
            ->where('pd.noregistrasi', $request['noRegistrasi'])
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }


    public function  getDiagnosaReferen(Request $request)
    {
        $data = \DB::table('diagnosa_m as ru')
            ->select('ru.id', 'ru.kddiagnosa', 'ru.namadiagnosa')
            ->where('ru.statusenabled', true)
            ->where('ru.namadiagnosa', 'like', '%' . $request['nama'] . '%')
            ->orderBy('ru.namadiagnosa')
            ->get();
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function getFaskesSaeutik(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        //        return $this->respond($dataReq);

        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),

            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/faskes/" . $dataReq . "/" . $req['jenisFaskes'], //.$request['jenisFakses'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        //        if(isset($req['filter']['filters'][0]['value']) &&
        //            $req['filter']['filters'][0]['value']!="" &&
        //            $req['filter']['filters'][0]['value']!="undefined"){
        //            $result = $result
        //                ->where('ru.namalengkap','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        //        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['faskes'];
        return $this->respond($res);
    }
    public function getDiagnosaPart(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),

            //         CURLOPT_URL=> "https://vclaim.bpjs-kesehatan.go.id/tot/Referensi/getDiagnosa".$request['nama'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/diagnosa/" . $dataReq,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['diagnosa'];
        return $this->respond($res);
    }
    public function getProcedureDiagnosaTindakanPart(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/procedure/" . $dataReq,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['procedure'];
        return $this->respond($res);
    }
    public function getDokterSaeutik(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/dokter/" . $dataReq,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $res = $result['response']->list;
        return $this->respond($res);
        //        return $this->respond($result);
    }
    public function getPoliSaeutik(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/poli/" . $dataReq,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/referensi/poli/".$request['kodePoli'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['poli'];
        return $this->respond($res);
    }
    public function getobatPRB(Request $request)
    {
        $req = $request->all();
        $dataReq = $req['filter']['filters'][0]['value'];
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/obatprb/" . $dataReq,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/referensi/poli/".$request['kodePoli'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['list'];
        return $this->respond($res);
    }
    public function getprogramPRB(Request $request)
    {
        $req = $request->all();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/diagnosaprb",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/referensi/poli/".$request['kodePoli'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        // $res=$result['response']['poli'];
        return $this->respond($result);
    }

    public function insertRujukanKhususV2(Request $request)
    {
        $req = $request->all();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        // return($dataJsonSend);
        // die();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/Khusus/insert",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        // return($result);
        // die();
        $result = $this->stringDecryptVclaim($key, $result);
        // $res=$result['response']['poli'];
        return $this->respond($result);
    }

    public function insertRencanaKontrolV2(Request $request)
    {
        // return($request['data']);
        // die();
        $req = $request->all();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        // return($dataJsonSend);
        // die();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/insert",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        // return($result);
        // die();
        $result = $this->stringDecryptVclaim($key, $result);
        // $res=$result['response']['poli'];
        return $this->respond($result);
    }

    public function updateRencanaKontrolV2(Request $request)
    {
        // return($request['data']);
        // die();
        $req = $request->all();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        // return($dataJsonSend);
        // die();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/Update",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS => $dataJsonSend,

            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        // return($result);
        // die();
        $result = $this->stringDecryptVclaim($key, $result);
        // $res=$result['response']['poli'];
        return $this->respond($result);
    }

    public function insertSPRIV2(Request $request)
    {
        // return($request['data']);
        // die();
        $req = $request->all();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        // return($dataJsonSend);
        // die();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/InsertSPRI",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        // return($result);
        // die();
        $result = $this->stringDecryptVclaim($key, $result);
        // $res=$result['response']['poli'];
        return $this->respond($result);
    }


    public function updateSPRIV2(Request $request)
    {
        // return($request['data']);
        // die();
        $req = $request->all();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        // return($dataJsonSend);
        // die();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/UpdateSPRI",
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS => $dataJsonSend,

            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        // return($result);
        // die();
        $result = $this->stringDecryptVclaim($key, $result);
        // $res=$result['response']['poli'];
        return $this->respond($result);
    }

    public function getDataIndukKecelakaan(Request $request)
    {
        return ($request['noKartu']);
        die();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."sep/RS/JasaRaharja/Suplesi/".$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "sep/KllInduk/List/" . $request['noKartu'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function getDataSEPInternal(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/Internal/" . $request['noSEP'],
            //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }

    public function deleteSEPInternalV2(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/Delete",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/Delete",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_POSTFIELDS => "{\r\n\"request\": 
                                       {\r\n\"t_sep\": 
                                         {
                                            \r\n\"noSep\": \"" . $request['nosep'] . "\",
                                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                                    }",
            CURLOPT_HTTPHEADER => array(
                //                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: 161b9dda-e007-dea4-1f53-75f393715c1e",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function simpanBpjsKlaim(Request $request)
    {
        //        ini_set('max_execution_time', 100);
        DB::beginTransaction();
        try {
            $data2 = BPJSKlaimTxt::where('txtfilename', $request['filename'])->delete();
            foreach ($request['data'] as $item) {
                $data1 = new BPJSKlaimTxt();
                $data1->norec = $data1->generateNewId();
                $data1->kdprofile = 0;
                $data1->statusenabled = true;


                $data1->KODE_RS = $item['KODE_RS'];
                $data1->KELAS_RS = $item['KELAS_RS'];
                $data1->KELAS_RAWAT = $item['KELAS_RAWAT'];
                $data1->KODE_TARIF = $item['KODE_TARIF'];
                $data1->PTD = $item['PTD'];
                $data1->ADMISSION_DATE = $item['ADMISSION_DATE'];
                $data1->DISCHARGE_DATE = $item['DISCHARGE_DATE'];
                $data1->BIRTH_DATE = $item['BIRTH_DATE'];
                $data1->BIRTH_WEIGHT = $item['BIRTH_WEIGHT'];
                $data1->SEX = $item['SEX'];
                $data1->DISCHARGE_STATUS = $item['DISCHARGE_STATUS'];
                $data1->DIAGLIST = $item['DIAGLIST'];
                $data1->PROCLIST = $item['PROCLIST'];
                $data1->ADL1 = $item['ADL1'];
                $data1->ADL2 = $item['ADL2'];
                $data1->IN_SP = $item['IN_SP'];
                $data1->IN_SR = $item['IN_SR'];
                $data1->IN_SI = $item['IN_SI'];
                $data1->IN_SD = $item['IN_SD'];
                $data1->INACBG = $item['INACBG'];
                $data1->SUBACUTE = $item['SUBACUTE'];
                $data1->CHRONIC = $item['CHRONIC'];
                $data1->SP = $item['SP'];
                $data1->SR = $item['SR'];
                $data1->SI = $item['SI'];
                $data1->SD = $item['SD'];
                $data1->DESKRIPSI_INACBG = $item['DESKRIPSI_INACBG'];
                $data1->TARIF_INACBG = $item['TARIF_INACBG'];
                $data1->TARIF_SUBACUTE = $item['TARIF_SUBACUTE'];
                $data1->TARIF_CHRONIC = $item['TARIF_CHRONIC'];
                $data1->DESKRIPSI_SP = $item['DESKRIPSI_SP'];
                $data1->TARIF_SP = $item['TARIF_SP'];
                $data1->DESKRIPSI_SR = $item['DESKRIPSI_SR'];
                $data1->TARIF_SR = $item['TARIF_SR'];
                $data1->DESKRIPSI_SI = $item['DESKRIPSI_SI'];
                $data1->TARIF_SI = $item['TARIF_SI'];
                $data1->DESKRIPSI_SD = $item['DESKRIPSI_SD'];
                $data1->TARIF_SD = $item['TARIF_SD'];
                $data1->TOTAL_TARIF = $item['TOTAL_TARIF'];
                $data1->TARIF_RS = $item['TARIF_RS'];
                $data1->TARIF_POLI_EKS = $item['TARIF_POLI_EKS'];
                $data1->LOS = $item['LOS'];
                $data1->ICU_INDIKATOR = $item['ICU_INDIKATOR'];
                $data1->ICU_LOS = $item['ICU_LOS'];
                $data1->VENT_HOUR = $item['VENT_HOUR'];
                $data1->NAMA_PASIEN = $item['NAMA_PASIEN'];
                $data1->MRN = $item['MRN'];
                $data1->UMUR_TAHUN = $item['UMUR_TAHUN'];
                $data1->UMUR_HARI = $item['UMUR_HARI'];
                $data1->DPJP = $item['DPJP'];
                $data1->sep = $item['SEP'];
                $data1->NOKARTU = $item['NOKARTU'];
                $data1->PAYOR_ID = $item['PAYOR_ID'];
                $data1->CODER_ID = $item['CODER_ID'];
                $data1->VERSI_INACBG = $item['VERSI_INACBG'];
                $data1->VERSI_GROUPER = $item['VERSI_GROUPER'];
                $data1->C1 = $item['C1'];
                $data1->C2 = $item['C2'];
                $data1->C3 = $item['C3'];
                $data1->C4 = $item['C4'];
                $data1->txtfilename = $request['filename'];
                $data1->save();
            }
            //            $strFileName = $request['filename'];
            //            $dataClaim = DB::select(DB::raw("select pd.norec,pd.noregistrasi,pd.tglregistrasi,bpjs.\"TARIF_RS\" as tarif from bpjsklaimtxt_t as bpjs
            //                    INNER JOIN pemakaianasuransi_t as pa on pa.nosep=bpjs.sep
            //                    INNER JOIN pasiendaftar_t as pd on pd.norec=pa.noregistrasifk
            //                    where txtfilename='$strFileName';")
            //            );
            //            foreach ($dataClaim as $item){
            //                $dataSP = StrukPelayanan::where('noregistrasifk',$item->norec)
            //                    ->where('statusenabled',null)
            //                    ->update(array('totalselisihklaim' => $item->tarif));
            //            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Simpan BPJS Klaim";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage . ' Berhasil',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage . ' Gagal',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getChecklistKlaim(Request $request)
    {
        //        $aingMacan = DB::select(DB::raw("select tgl,
        //                sum(case when objectdepartemenfk <> 16 then  BPJS else 0 end) as bpjs_rajal,
        //                sum(case when objectdepartemenfk <> 16 then  dokumen else 0 end) as berkas_rajal,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  dokumen else 0 end) as berkas_kls1,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  dokumen else 0 end) as berkas_kls2,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  dokumen else 0 end) as berkas_kls3,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  BPJS else 0 end) as bpjs_kls1,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  BPJS else 0 end) as bpjs_kls2,
        //                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  BPJS else 0 end) as bpjs_kls3
        //                 from
        //                (select to_char(pa.tglregistrasi, 'YYYY-MM-DD') as tgl, ru.objectdepartemenfk,pd.objectkelasfk,kls.namakelas,ap.objectkelasdijaminfk,
        //                case when bpjs.norec is null then 0 else 1 end as BPJS,case when pa.norec is null then 0 else 1 end as dokumen
        //                from pemakaianasuransi_t as pa
        //                INNER JOIN asuransipasien_m as ap on ap.id=pa.objectasuransipasienfk
        //                inner JOIN bpjsklaimtxt_t as bpjs  on pa.nosep=bpjs.sep
        //                INNER JOIN pasiendaftar_t as pd on pd.norec=pa.noregistrasifk
        //                INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is null
        //                INNER JOIN strukpelayananpenjamin_t as spp on spp.nostrukfk=sp.norec and spp.noverifikasi is not null
        //                INNER JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk
        //                INNER JOIN kelas_m as kls on kls.id=ap.objectkelasdijaminfk
        //                where pd.tglpulang between :tglAwal and :tglAkhir
        //                and pd.objectkelompokpasienlastfk=2) as x group by tgl order by tgl;
        //            "),
        //            array(
        //                'tglAwal' => $request['tglAwal'] ,
        //                'tglAkhir' => $request['tglAkhir']
        //            )
        //        );
        $aingMacan = DB::select(
            DB::raw("select tgl,
                sum(case when objectdepartemenfk <> 16 then  BPJS else 0 end) as bpjs_rajal,
                sum(case when objectdepartemenfk <> 16 then  dokumen else 0 end) as berkas_rajal,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  dokumen else 0 end) as berkas_kls1,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  dokumen else 0 end) as berkas_kls2,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  dokumen else 0 end) as berkas_kls3,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=3 then  BPJS else 0 end) as bpjs_kls1,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=2 then  BPJS else 0 end) as bpjs_kls2,
                sum(case when objectdepartemenfk=16 and objectkelasdijaminfk=1 then  BPJS else 0 end) as bpjs_kls3
                 from
                (select to_char(pd.tglpulang, 'YYYY-MM-DD') as tgl, ru.objectdepartemenfk,pd.objectkelasfk,kls.namakelas,ap.objectkelasdijaminfk,
                case when bpjs.norec is null then 0 else 1 end as BPJS,case when pa.norec is null then 0 else 1 end as dokumen
                from pemakaianasuransi_t as pa
                INNER JOIN asuransipasien_m as ap on ap.id=pa.objectasuransipasienfk
                inner JOIN bpjsklaimtxt_t as bpjs  on pa.nosep=bpjs.sep
                INNER JOIN pasiendaftar_t as pd on pd.norec=pa.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk
                INNER JOIN kelas_m as kls on kls.id=ap.objectkelasdijaminfk
                where pd.tglpulang between :tglAwal and :tglAkhir
                and pd.objectkelompokpasienlastfk=2) as x group by tgl order by tgl;
            "),
            array(
                'tglAwal' => $request['tglAwal'],
                'tglAkhir' => $request['tglAkhir']
            )
        );
        $result = array(
            'dat' => $aingMacan,
            'by' => 'as@epic'
        );
        return $this->respond($result);
    }
    public function simpanGagalHitungBpjsKlaim(Request $request)
    {
        //        ini_set('max_execution_time', 100);
        DB::beginTransaction();
        try {
            $data2 = BPJSGagalKlaimTxt::where('txtfilename', $request['filename'])->delete();
            foreach ($request['data'] as $item) {
                $data1 = new BPJSGagalKlaimTxt();
                $data1->norec = $data1->generateNewId();
                $data1->kdprofile = 0;
                $data1->statusenabled = true;

                $data1->nosep = $item['NOSEP'];
                $data1->tglsep = $item['TGLSEP'];
                $data1->nokartu = $item['NOKARTU'];
                $data1->nmpeserta = $item['NMPESERTA'];
                $data1->rirj = $item['RIRJ'];
                $data1->kdinacbg = $item['KDINACBG'];
                $data1->bypengajuan = $item['BYPENGAJUAN'];
                $data1->keterangan = $item['KETERANGAN'];
                $data1->txtfilename = $request['filename'];
                $data1->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Simpan BPJS Gagal Klaim";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage . ' Berhasil',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage . ' Gagal',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDokterDPJP(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/dokter/pelayanan/" . $request['jenisPelayanan'] . "/tglPelayanan/"
                . $request['tglPelayanan'] . "/Spesialis/" . $request['kodeSpesialis'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nik/".$request['nik']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }

    public function listRujukanKhususV2(Request $request)
    {
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/Khusus/List/Bulan/" . $request['month'] . "/Tahun/" . $request['year'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function listSpesialistikRujukanKhususV2(Request $request)
    {
        // return($request['objectrujukanfk']);
        // die();
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/ListSpesialistik/PPKRujukan/" . $request['objectrujukanfk'] . "/TglRujukan/" . $request['date'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function listSasaranV2(Request $request)
    {
        // return($request['objectrujukanfk']);
        // die();
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/ListSarana/PPKRujukan/" . $request['objectrujukanfk'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function cariRencanaKontrolV2Private($request)
    {
        // return($request['noRujukanKontrol']);
        // die();
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/noSuratKontrol/" . $request['noRujukanKontrol'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return  $result;
    }
    public function cariRencanaKontrolV2(Request $request)
    {
        // return($request['noRujukanKontrol']);
        // die();
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/noSuratKontrol/" . $request['noRujukanKontrol'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }


    public function cariRencanaKontrolV2All(Request $request)
    {
        // return($request['noRujukanKontrol']);
        // die();
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/ListRencanaKontrol/tglAwal/" . $request['tglAwal'] . "/tglAkhir/" . $request['tglAkhir'] . "/filter/" . $request['filter'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }

    public function cariRencanaKontrolSEPV2(Request $request)
    {
        // return($request['noSEP']);
        // die();
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/nosep/" . $request['noSEP'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: 07c605ad-c672-6e5b-562e-7cee1f9cd0ea",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }

    public function hapusRencanaKontrolV2(Request $request)
    {
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/Delete",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/Delete",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_POSTFIELDS => "{\r\n\"request\": 
                                       {\r\n\"t_suratkontrol\": 
                                         {
                                            \r\n\"noSuratKontrol\": \"" . $request['noRujukanKontrol'] . "\",
                                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
                                    }",
            CURLOPT_HTTPHEADER => array(
                //                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: 161b9dda-e007-dea4-1f53-75f393715c1e",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function getPropinsi(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/propinsi",
            //            CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/referensi/propinsi",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['list'];
        return $this->respond($res);
    }
    public function getKabupaten(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/kabupaten/propinsi/" . $request['kodePropinsi'],
            //            CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/referensi/kabupaten/propinsi/".$request['kodePropinsi'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['list'];
        return $this->respond($res);
    }
    public function getKecamatan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "referensi/kecamatan/kabupaten/" . $request['kodeKabupaten'],
            //            CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/referensi/kecamatan/kabupaten/".$request['kodeKabupaten'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        $res = $result['response']['list'];
        return $this->respond($res);
    }
    public function getMonitoringHistori($noKartu)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi :Data Kunjungan
        //Method : GET
        //Format : Json
        //Content-Type: application/json; charset=utf-8
        //Parameter 1 : Tanggal Pulang format: yyyy-mm-dd
        // Parameter 2 : Jenis Pelayanan (1. Inap 2. Jalan)
        // Parameter 3 : Status Klaim (1. Proses Verifikasi 2. Pending Verifikasi 3. Klaim)
        // URL : http://localhost:8000/service/transaksi/bpjs/monitoring/HistoriPelayanan/NoKartu/0002235322484/tglAwal/2018-10-01/tglAkhir/2018-10-21
        // $tglMulai = Carbon::now()->subMonth(5)->format('Y-m-d');
        $tglMulai = Carbon::now()->subDays(30)->format('Y-m-d');
        //        return $this->respond($tglMulai);
        $tglAkhir = Carbon::now()->format('Y-m-d');

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "monitoring/HistoriPelayanan/NoKartu/" . $noKartu . "/tglMulai/" . $tglMulai . "/tglAkhir/" . $tglAkhir,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }
    public function getListRencanaKontrolBerdasarkanNoKartu($noKartu)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        $tahun = Carbon::now()->format('Y');
        // $bulan = Carbon::now()->format('m');
        $bulan = Carbon::now()->startOfMonth()->subMonth(0)->format('m');
        // return($bulan);
        // die();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/ListRencanaKontrol/Bulan/" . $bulan . "/Tahun/" . $tahun . "/Nokartu/" . $noKartu . "/filter/2",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }
    public function cariListHistoriSuratKontrol($noKartu)
    {

        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['noKartu'] = $noKartu;
        $objetoRequest['bulan'] = 0;
        $response = $this->getListRencanaKontrolBerdasarkanNoKartuCustom($objetoRequest, true);
        if ($response['metaData']->code == 200) {
            $x = $response['response']['list'];
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noKartu'] = $noKartu;
            $objetoRequest['bulan'] = 1;
            $response2 = $this->getListRencanaKontrolBerdasarkanNoKartuCustom($objetoRequest, true);
            if ($response2['metaData']->code == 200) {
                $r = array_merge($x, $response2['response']['list']);
            } else {
                $r = $x;
            }
        } else {
            $r = [];
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noKartu'] = $noKartu;
            $objetoRequest['bulan'] = 1;
            $response2 = $this->getListRencanaKontrolBerdasarkanNoKartuCustom($objetoRequest, true);
            if ($response2['metaData']->code == 200) {
                $r = $response2['response']['list'];
            }
        }
        $result = array(
            'metaData' => $response['metaData'],
            'response' => array('list' => $r),
        );
        return response()->json($result);
    }
    public function getMonitoringHistoriCustom(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi :Data Kunjungan
        //Method : GET
        //Format : Json
        //Content-Type: application/json; charset=utf-8
        //Parameter 1 : Tanggal Pulang format: yyyy-mm-dd
        // Parameter 2 : Jenis Pelayanan (1. Inap 2. Jalan)
        // Parameter 3 : Status Klaim (1. Proses Verifikasi 2. Pending Verifikasi 3. Klaim)
        // URL : http://localhost:8000/service/transaksi/bpjs/monitoring/HistoriPelayanan/NoKartu/0002235322484/tglAwal/2018-10-01/tglAkhir/2018-10-21
        // $tglMulai = Carbon::now()->subMonth(5)->format('Y-m-d');
        $tglMulai = Carbon::now()->subDays($request['awal'])->format('Y-m-d');
        // return($tglMulai);
        // die();
        //        return $this->respond($tglMulai);
        $tglAkhir = Carbon::now()->subDays($request['akhir'])->format('Y-m-d');

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "monitoring/HistoriPelayanan/NoKartu/" . $request['noKartu'] . "/tglMulai/" . $tglMulai . "/tglAkhir/" . $tglAkhir,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return ($result);
    }
    public function getMonitoringHistoriDuaBulan($noKartu)
    {
        // $objetoRequest = new \Illuminate\Http\Request();
        //             $objetoRequest['noKartu'] = $noKartu;
        //             $objetoRequest['awal'] = 90;
        //             $objetoRequest['akhir'] = 0;
        //             $response3 = $this->getListRencanaKontrolBerdasarkanNoKartuCustom($objetoRequest, true);
        //             return($response3);
        //             die();
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['noKartu'] = $noKartu;
        $objetoRequest['awal'] = 90;
        $objetoRequest['akhir'] = 0;
        $response = $this->getMonitoringHistoriCustom($objetoRequest, true);
        return response()->json($response);

        if ($response['metaData']->code == 200) {
            $x = $response['response']['histori'];
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noKartu'] = $noKartu;
            $objetoRequest['awal'] = 60;
            $objetoRequest['akhir'] = 30;
            $resultMetaData = array(
                'code' => 200,
                'message' => 'Sukses'
            );
            $response2 = $this->getMonitoringHistoriCustom($objetoRequest, true);
            if ($response2['metaData']->code == 200) {
                $r = array_merge($x, $response2['response']['histori']);
            } else {
                $r = $x;
            }
        } else {
            $r = [];
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noKartu'] = $noKartu;
            $objetoRequest['awal'] = 60;
            $objetoRequest['akhir'] = 30;
            $response2 = $this->getMonitoringHistoriCustom($objetoRequest, true);
            if ($response2['metaData']->code == 200) {
                $r = $response2['response']['histori'];
                $resultMetaData = array(
                    'code' => 200,
                    'message' => 'Sukses'
                );
            } else {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['noKartu'] = $noKartu;
                $objetoRequest['awal'] = 90;
                $objetoRequest['akhir'] = 30;
                $response3 = $this->getMonitoringHistoriCustom($objetoRequest, true);
                // dd($response3);
                if ($response3['metaData']->code == 200) {
                    $r = $response3['response']['histori'];
                    $resultMetaData = array(
                        'code' => 200,
                        'message' => 'Sukses'
                    );
                } else {
                    $resultMetaData = array(
                        'code' => 201,
                        'message' => 'Data Tidak Ada'
                    );
                }
            }
        }
        $result = array(
            'metaData' => $resultMetaData,
            'response' => array('histori' => $r),
        );
        return response()->json($result);
    }
    public function kirimNoSEP(Request $request)
    {


        \DB::beginTransaction();
        try {

            $data = PemakaianAsuransi::where('noregistrasifk', $request['norec'])
                ->update([
                    'nosep' => $request['nosep'],
                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil!";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getListRencanaKontrolBerdasarkanNoKartuCustom(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        $tahun = Carbon::now()->format('Y');
        // $bulan = Carbon::now()->format('m');
        $bulan = Carbon::now()->startOfMonth()->subMonth($request['bulan'])->format('m');
        $kartu = $request['noKartu'];


        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/ListRencanaKontrol/Bulan/" . $bulan . "/Tahun/" . $tahun . "/Nokartu/" . $kartu . "/filter/2",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return ($result);
    }

    public function getMonitoringJasaRaharja(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi :Data Kunjungan
        //Method : GET
        //Format : Json
        //Content-Type: application/json; charset=utf-8
        //Parameter 1 : Tanggal Pulang format: yyyy-mm-dd
        // Parameter 2 : Jenis Pelayanan (1. Inap 2. Jalan)
        // Parameter 3 : Status Klaim (1. Proses Verifikasi 2. Pending Verifikasi 3. Klaim)
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."monitoring/JasaRaharja/tglMulai/".$request['tglMulai']."/tglAkhir/".$request['tglAkhir'],

            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "monitoring/JasaRaharja/tglMulai/"
                . $request['tglMulai'] . "/tglAkhir/" . $request['tglAkhir'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function getRujukanNoKartuMulti(Request $request)
    {
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."Rujukan/List/Peserta/".$request['nokartu'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/List/Peserta/" . $request['nokartu'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function getRujukanNoKartuMultiRS(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            //            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."Rujukan/RS/Peserta/".$request['nokartu'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/RS/List/Peserta/" . $request['nokartu'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function getRujukanByTglRujukan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."Rujukan/List/Peserta/".$request['tglRujukan'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/List/TglRujukan/" . $request['tglRujukan'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getRujukanByTglRujukanRS(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."Rujukan/RS/TglRujukan/".$request['tglRujukan'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/RS/List/TglRujukan/" . $request['tglRujukan'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getSuplesiJasaRaharja(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."sep/RS/JasaRaharja/Suplesi/".$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "sep/JasaRaharja/Suplesi/"
                . $request['noKartu'] . "/tglPelayanan/" . $request['tglPelayanan'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getFingerPrint(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."sep/RS/JasaRaharja/Suplesi/".$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/FingerPrint/Peserta/"
                . $request['noKartu'] . "/tglPelayanan/" . $request['tglPelayanan'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getFingerPrintList(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            //            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."sep/RS/JasaRaharja/Suplesi/".$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/FingerPrint/Peserta/tglPelayanan/" . $request['tglPelayanan'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function insertSepV11(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/1.1/insert",
            //                CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/SEP/1.1/insert",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,

            //                 "{\r\n\"request\":
            //                         {\r\n\"t_sep\":
            //                            {
            //                            \r\n\"noKartu\": \"".$request['nokartu']."\",
            //                            \r\n\"tglSep\": \"".$request['tglsep']."\",
            //                            \r\n\"ppkPelayanan\": \"0904R004\",
            //                            \r\n\"jnsPelayanan\": \"".$request['jenispelayanan']."\",
            //                            \r\n\"klsRawat\": \"".$request['kelasrawat']."\",
            //                            \r\n\"noMR\": \"".$request['nomr']."\",
            //                            \r\n\"rujukan\": {\r\n\"asalRujukan\": \"".$request['asalrujukan']."\",
            //                                            \r\n\"tglRujukan\": \"".$request['tglrujukan']."\",
            //                                            \r\n\"noRujukan\": \"".$request['norujukan']."\",
            //                                            \r\n\"ppkRujukan\": \"".$request['ppkrujukan']."\"\r\n},
            //                            \r\n\"catatan\": \"".$request['catatan']."\",
            //                            \r\n\"diagAwal\": \"".$request['diagnosaawal']."\",
            //                            \r\n\"poli\": {\r\n\"tujuan\": \"".$request['politujuan']."\",
            //                                         \r\n\"eksekutif\": \"".$request['eksekutif']."\"\r\n},
            //                            \r\n\"cob\":
            //                                        {\r\n\"cob\": \"".$request['cob']."\"\r\n},
            //                            \r\n\"katarak\":
            //                                        {\r\n\"katarak\": \"".$request['katarak']."\"\r\n},
            //                            \r\n\"jaminan\": {\r\n\"lakaLantas\": \"".$request['lakalantas']."\",
            //                                            \r\n\"penjamin\": { \r\n\"penjamin\"  : \"".$request['penjamin']."\",
            //                                                                \r\n\"tglKejadian\": \"".$request['tglKejadian']."\",
            //                                                                \r\n\"keterangan\"  : \"".$request['keterangan']."\",
            //                                                                \r\n\"suplesi\": { \r\n\"suplesi\"  : \"".$request['suplesi']."\",
            //                                                                                   \r\n\"noSepSuplesi\": \"".$request['noSepSuplesi']."\",
            //                                                                                    \r\n\"lokasiLaka\":
            //                                                                                    { \r\n\"kdPropinsi\"  : \"".$request['kdPropinsi']."\",
            //                                                                                      \r\n\"kdKabupaten\": \"".$request['kdKabupaten']."\",
            //                                                                                      \r\n\"kdKecamatan\"  : \"".$request['kdKecamatan']."\"\r\n}\r\n}\r\n}\r\n},
            //                            \r\n\"skdp\":
            //                                        {\r\n\"noSurat\": \"".$request['noSurat']."\",
            //                                        \r\n\"kodeDPJP\": \"".$request['kodeDPJP']."\" \r\n},
            //                            \r\n\"noTelp\": \"".$request['notelp']."\",
            //                            \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n
            //
            //                      }",

            CURLOPT_HTTPHEADER => array(
                "Content-Type: Application/x-www-form-urlencoded",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function insertSepV2(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/2.0/insert",
            //                CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/SEP/1.1/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
        // return $this->respond($result);

    }
    public function insertPRB(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "PRB/insert",
            //                CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/SEP/1.1/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
        // return $this->respond($result);

    }
    public function insertSuratKontrol(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/insert",
            //                CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/SEP/1.1/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
        // return $this->respond($result);

    }
    public function getSuratRujukanKeluar(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/Keluar/" . $request['noRujukan'],
            //            CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/referensi/kecamatan/kabupaten/".$request['kodeKabupaten'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function getSuratKontrol(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/noSuratKontrol/" . $request['noSuratKontrol'],
            //            CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/referensi/kecamatan/kabupaten/".$request['kodeKabupaten'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function insertSpri(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/InsertSPRI",
            //                CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/SEP/1.1/insert",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
        // return $this->respond($result);

    }
    public function updateSepV11(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $dataJsonSend = json_encode($request['data']);
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/1.1/Update",
            //    CURLOPT_URL => "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/SEP/1.1/Update",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            // new Vclaim v.1.1

            CURLOPT_HTTPHEADER => array(
                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
                //                "Postman-Token: c359f488-f523-6279-b14f-64a1dab17772",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "Services Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getHasCode(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha1', 'JASAMEDIKA', true);
        $sting = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi5vcGVyYXRvciJ9.2yCoQiRKSoXJhCzSdbLxvLWPPx02jzPgkUpT2f0uDLeKKPIK00xLbLlUeTlS7eNq6cLOE7XM03sOWgmQ5TLvVA';
        // base64 encode…
        $encodedSignature = base64_decode($sting);
        // $encodedSignature = urlencode($encodedSignature);

        $result = array(
            "X-cons-id" =>  $data,
            "X-timestamp" => $tStamp,
            "X-signature" => $encodedSignature,
        );

        return $this->respond($encodedSignature);
    }

    public function deleteSiranap(Request $request)
    {
        # seting koneksi webservices #
        $xrsid = "kode_rumah_sakit";  # ID Rumah Sakit #
        $xpass = md5("password_rumah_sakit"); # Password #
        $kode_tipe_pasien = "0004"; #kode tipe pasien
        $kode_kelas_ruang = "0003"; # kode kelas ruang

        $strURLSiranap = "http://sirs.yankes.kemkes.go.id/sirsservice/sisrute/hapusdata/$xrsid/$kode_tipe_pasien/$kode_kelas_ruang";

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $strURLSiranap);
        curl_setopt(
            $curl,
            CURLOPT_HTTPHEADER,
            array(
                "X-rs-id: $xrsid",
                "X-pass:$xpass",
                "Content-Type:application/xml; charset=ISO-8859-1",
                "User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.15) Gecko/20080623 Firefox/2.0.0.15"
            )
        );
        curl_setopt($curl, CURLOPT_NOBODY, false);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $str = curl_exec($curl);
        curl_close($curl);
        //        echo $str;
        return $this->respond($str);
        //        $data = $this->getIdConsumerBPJSV2();
        //        $secretKey = $this->getPasswordConsumerBPJSV2();
        //        // Computes the timestamp
        //        date_default_timezone_set('UTC');
        //        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        //        // Computes the signature by hashing the salt with the secret key as the key
        //        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);
        //
        //        // base64 encode…
        //        $encodedSignature = base64_encode($signature);
        //
        //        $curl = curl_init();
        //
        //        curl_setopt_array($curl, array(
        ////            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
        ////            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."sep/RS/JasaRaharja/Suplesi/".$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
        //            CURLOPT_URL => $this->getUrlBrigdingBPJSV2()."sep/RS/JasaRaharja/Suplesi/"
        //                .$request['noKartu']."/tglPelayanan/".$request['tglPelayanan'],
        //            CURLOPT_RETURNTRANSFER => true,
        //            CURLOPT_ENCODING => "",
        //            CURLOPT_SSL_VERIFYHOST => 0,
        //            CURLOPT_SSL_VERIFYPEER => 0,
        //            CURLOPT_MAXREDIRS => 10,
        //            CURLOPT_TIMEOUT => 30,
        //            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        //            CURLOPT_CUSTOMREQUEST => "GET",
        //            CURLOPT_HTTPHEADER => array(
        //                "Content-Type: application/json; charset=utf-8",
        //                "X-cons-id: ".  (string)$data,
        //                "X-signature: ". (string)$encodedSignature,
        //                "X-timestamp: ". (string)$tStamp
        //            ),
        //        ));
        //
        //        $response = curl_exec($curl);
        //        $err = curl_error($curl);
        //
        //        curl_close($curl);
        //
        //        if ($err) {
        //            $result= "cURL Error #:" . $err;
        //        } else {
        //            $result = (array) json_decode($response);
        //        }
        //
        //        return $this->respond($result);
    }
    public function getNoPesertaV1(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Peserta/nokartu/" . $request['nokartu'] . "/tglSEP/" . $request['tglsep'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function simpanLokalRujukan(Request $request)
    {
        //        ini_set('max_execution_time', 100);
        DB::beginTransaction();
        try {
            $data1 = new BPJSRujukan();
            $data1->norec = $data1->generateNewId();
            $data1->kdprofile = 0;
            $data1->statusenabled = true;
            $data1->nosep = $request['nosep'];
            $data1->diagnosarujukan = $request['diagnosarujukan'];
            $data1->jenispelayanan = $request['jenispelayanan'];
            $data1->polirujukan  = $request['polirujukan'];
            $data1->ppkdirujuk = $request['ppkdirujuk'];
            $data1->kdppkdirujuk = $request['kdppkdirujuk'];
            $data1->tglrujukan = $request['tglrujukan'];
            $data1->tiperujukan = $request['tiperujukan'];
            $data1->nama = $request['nama'];
            $data1->nokartu = $request['nokartu'];
            $data1->catatan = $request['catatan'];
            $data1->tglsep = $request['tglsep'];
            $data1->sex = $request['sex'];
            $data1->norujukan = $request['norujukan'];
            $data1->nocm = $request['nocm'];
            $data1->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Simpan Rujukan";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage . ' Berhasil',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage . ' Gagal',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }
    public function getLokalRujukan(Request $request)
    {
        $data = \DB::table('bpjsrujukan_t as br')
            ->leftjoin('ruangan_m as ru', 'ru.kdinternal', '=', 'br.polirujukan')
            ->select('br.*', 'ru.namaruangan')
            ->where('br.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('br.tglrujukan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('br.tglrujukan', '<=', $tgl);
        }
        if (isset($request['norujukan']) && $request['norujukan'] != "" && $request['norujukan'] != "undefined") {
            $data = $data->where('br.norujukan', 'like', '%' . $request['norujukan'] . '%');
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('br.nocm', 'like', '%' . $request['nocm'] . '%');
        }

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman'
        );
        return $this->respond($result);
    }
    public function generateNoSKDP(Request $request)
    {
        $noSKDP = $this->generateCodeBySeqTable(new PemakaianAsuransi, 'nosuratskdp', 6);
        if ($noSKDP == '') {
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        $data = $this->genRandStr();
        //        $noSKDP = $this->generateCode(new PemakaianAsuransi, 'nosuratskdp', 6, $this->getDateTime()->format('ym'));
        $result = array(
            'noskdp' => $noSKDP,
            'message' => 'Inhuman'
        );
        return $this->respond($result);
    }
    function genRandStr()
    {
        $a = $b = '';

        for ($i = 0; $i < 3; $i++) {
            $a .= chr(mt_rand(65, 90)); // see the ascii table why 65 to 90.
            $b .= mt_rand(0, 9);
        }

        return $a . $b;
    }
    public function getReferensiKamar(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // return $this->respond( $this->getUrlBrigingAplicare());
        curl_setopt_array($curl, array(
            // CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigingAplicare() . "aplicaresws/rest/ref/kelas",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function updateKetersediaanTT($kodeppk, Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        //        {
        //            "kodekelas":"VIP",
        //            "koderuang":"RG01",
        //            "namaruang":"Ruang Anggrek VIP",
        //            "kapasitas":"20",
        //            "tersedia":"10",
        //            "tersediapria":"0",
        //            "tersediawanita":"0",
        //            "tersediapriawanita":"0"
        //           }
        $dataJsonSend = json_encode($request['json']);
        curl_setopt_array($curl, array(
            // CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigingAplicare() . "aplicaresws/rest/bed/update/" . $kodeppk,
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
                "Content-Type: Application/json",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function postRuanganBaru($kodeppk, Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        //        { "kodekelas":"VIP",
        //    "koderuang":"RG01",
        //    "namaruang":"Ruang Anggrek VIP",
        //    "kapasitas":"20",
        //    "tersedia":"10",
        //     "tersediapria":"0",
        //    "tersediawanita":"0",
        //    "tersediapriawanita":"0"
        //   }

        $dataJsonSend = json_encode($request['json']);
        curl_setopt_array($curl, array(
            // CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigingAplicare() . "aplicaresws/rest/bed/create/" . $kodeppk,
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
                "Content-Type: Application/json",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }


    public function getKetersedianKamarRS($kodeppk, $start, $limit)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            // CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigingAplicare() . "aplicaresws/rest/bed/read/" . $kodeppk . "/" . $start . "/" . $limit,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function hapusRuangan($kodeppk, Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        //        { "kodekelas":"VIP",
        //            "koderuang":"RG01"
        //          }


        $dataJsonSend = json_encode($request['json']);
        curl_setopt_array($curl, array(
            // CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigingAplicare() . "aplicaresws/rest/bed/delete/" . $kodeppk,
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
                "Content-Type: Application/json",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function getInformasiDukcapilFromNIK(Request $request)
    {

        $nik = $request['nik'];
        $user_id = $request['user_id'];
        $password = $request['password'];
        $ip_user = $request['ip_user'];

        $dataJsonSend = json_encode($request['data']);
        // return $dataJsonSend;
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $request['port'],
            CURLOPT_URL => $request['url'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/json",
                // "postman-token: f5103086-f421-0f8f-5270-f7e11de81651"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $status['status'] = 400;
            $result = array(
                'error' => $err
            );
        } else {
            $status['status'] = 200;
            $result = (array) json_decode($response);
        }
        return $this->respond($result,  $status);
    }
    public function getRuanganBPJSInternal(Request $request)
    {

        // $data = \DB::table('ruangan_m')
        // 	->select('*')
        // 	->where('statusenabled', true)
        // 	->whereNotNull('kdinternal')
        // 	->orderBy('namaruangan');
        $data = \DB::table('ruangankiosk_m')
            ->select(
                'ruangankiosk_m.kodeexternal as id',
                'ruangankiosk_m.namaruangan',
                'ruangankiosk_m.kdinternal',
                'ruangankiosk_m.objectdepartemenfk'
            )
            ->where('statusenabled', true)
            ->whereNotNull('kdinternal')
            ->orderBy('namaruangan');

        $data = $data->get();

        return $this->respond($data);
    }

    public function getNoSEPByNorecPd($norec_pd)
    {

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pemakaianasuransi_t as pem', 'pem.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('rencanakontrol_t as rk', 'rk.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('spri_t as spri', 'spri.noregistrasifk', '=', 'pd.norec')
            ->select('pd.noregistrasi', 'pem.nosep', 'spri.nospri', 'rk.norencanakontrol')
            ->where('pd.norec', $norec_pd);

        $data = $data->first();

        return $this->respond($data);
    }
    public function getHistoryPelayananPeserta(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi :Data Kunjungan
        //Method : GET
        //Format : Json
        //Content-Type: application/json; charset=utf-8
        //Parameter 1 : Tanggal Pulang format: yyyy-mm-dd
        // Parameter 2 : Jenis Pelayanan (1. Inap 2. Jalan)
        // Parameter 3 : Status Klaim (1. Proses Verifikasi 2. Pending Verifikasi 3. Klaim)
        // URL : http://localhost:8000/service/transaksi/bpjs/monitoring/HistoriPelayanan/NoKartu/0002235322484/tglAwal/2018-10-01/tglAkhir/2018-10-21
        // $tglMulai =Carbon::now()->startOfMonth()->subMonth(5)->format('Y-m-d');
        $tglAkhir = Carbon::now()->format('Y-m-d');
        $tglMulai = Carbon::now()->subDays(30)->format('Y-m-d');

        $noKartu = $request['noKartu'];
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "monitoring/HistoriPelayanan/NoKartu/" . $noKartu . "/tglMulai/" . $tglMulai . "/tglAkhir/" . $tglAkhir,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function getKetersediaanTT(Request $request)
    {
        $paramRuangan = '';
        if (isset($request['namaruangan'])  && $request['namaruangan'] != 'undefined' && $request['namaruangan'] != '') {
            $paramRuangan = " and ru.namaruangan like '%" . $request['namaruangan'] . "%'";
        }
        $paramKelas = '';
        if (isset($request['kelas'])  && $request['kelas'] != 'undefined' && $request['kelas'] != '') {
            $paramKelas = " and kl.namakelas like '%" . $request['kelas'] . "%'";
        }

        $data =  DB::select(DB::raw("select  z.kodekelas,z.koderuang,z.namaruang,sum(z.kapasitas) as kapasitas,
                sum(z.tersedia) as tersedia ,
                z.tersediapria, z.tersediawanita, z.tersediapriawanita ,z.namakelas
                from (
                SELECT x.kodekelas,x.koderuang,x.namaruang,count(x.kodekelas) as kapasitas,
                COUNT(CASE WHEN     x.objectstatusbedfk=2   THEN 1 END) as tersedia ,
                0 as tersediapria, 0 as tersediawanita, 0 as tersediapriawanita,x.namakelas
                from    (
                SELECT
                ru.id AS koderuang, ru.namaruangan AS namaruang,kl.namaexternal AS kodekelas,
                kl.namakelas,   tt.objectstatusbedfk        
                FROM tempattidur_m AS tt
                LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
                LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
                LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk
                WHERE
                ru.objectdepartemenfk IN (16, 35)
                $paramRuangan
                $paramKelas
                AND ru.statusenabled = 1
                AND km.statusenabled = 1
                AND tt.statusenabled = 1
                ) AS x group by x.koderuang ,
                x.namaruang,x.kodekelas ,x.namakelas,x.objectstatusbedfk,x.namakelas
                ) as z group by  z.kodekelas,z.koderuang,z.namaruang,z.tersediapria, z.tersediawanita, z.tersediapriawanita ,z.namakelas"));

        $result = array(
            'data' => $data,
            'as' => 'er@epic'
        );
        return $this->respond($result);
    }
    public function getUrlBrigingAplicare()
    {
        return $this->settingDataFixed('urlBridgingAplicare');
    }
    function is_decimal($val)
    {
        return is_numeric($val) && floor($val) != $val;
    }
    public function getKetersediaanTTNewPush(Request $request, $lokal = null)
    {
        $data = DB::select(DB::raw("SELECT
            x.kodekelas,
                x.koderuang,
                x.namaruang,
                COUNT (x.id) AS kapasitas,
        -- SUM (tersediapriawanita) + SUM (tersediawanita)+   SUM (tersediapria)
                0 AS tersedia,
                SUM (tersediapria) AS tersediapria,
                SUM (tersediawanita) AS tersediawanita,
                SUM (tersediapriawanita) AS tersediapriawanita,
           
                x.namakelas
            FROM
                (
                    SELECT
                        ru.id AS koderuang,
                    
                        kmr.id,
                        kmr.namakamar,
                        -- kl.[namaexternal] AS [kodekelas],
                        case when ru.id=717 then 'NIC' when ru.id=722 then 'ICU' 
                        when ru.id=724 and kl.namakelas='Intensive' then 'ICU' when ru.id=758 then 'ICU' 
                        when ru.id=759 then 'ICU' when ru.id=760 and kl.namakelas='Intensive' then 'ICU'
                        when ru.id=761 then 'ICU' when ru.id=762 then 'ICU'
                        when ru.id=763 and kl.namakelas='Intensive' then 'ICU' when ru.id=764 then 'NIC' when ru.id=798 then 'NIC'
                        when ru.id=781 then 'ICU' when ru.id=797 then 'ICU' when ru.id=865 then 'ICU' when ru.id=740 then 'HCU'
                        when ru.id=741 then 'HCU' when ru.id=742 then 'HCU'
                        when ru.id=757 then 'ICC' when ru.id=756 then 'ICU' else kl.namaexternal END AS kodekelas,
                        kl.namakelas,
                        ru.id AS id_ruangan,
                        ru.namaruangan AS namaruang,
                      ru.jenis,
                        CASE
                    WHEN ru.jenis = 'male' THEN
                        1
                    ELSE
                        0
                    END AS tersediapria,
                    CASE
                WHEN ru.jenis = 'female' THEN
                    1
                ELSE
                    0
                END AS tersediawanita,
                     CASE
                WHEN ru.jenis = 'mix' THEN
                    1
                ELSE
                    0
                END AS tersediapriawanita
                FROM
                    tempattidur_m AS tt
                LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                LEFT JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
                LEFT JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
                LEFT JOIN kelas_m AS kl ON kl.id = kmr.objectkelasfk
                WHERE
                    tt.statusenabled = true
                    and kmr.statusenabled=true
              and  ru.objectdepartemenfk IN (16, 35)
              and ru.id=906
                ) AS x
            GROUP BY
                x.kodekelas,
                x.koderuang,
                x.namaruang,
                x.namakelas
            ORDER BY
                x.kodekelas"));
        foreach ($data as $key) {
            // $data10 = [];
            $data10 = array(
                'kodekelas' => $key->kodekelas,
                'koderuang' => $key->koderuang,
                'namaruang' => $key->namaruang,
                'kapasitas' => $key->kapasitas,
                'tersedia' => $key->tersedia,
                'tersediapria' => $key->tersediapria,
                'tersediawanita' => $key->tersediawanita,
                'tersediapriawanita' => $key->tersediapriawanita,
            );
            // $dataJson[]=array($data10);
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['method'] = 'POST';
            $objetoRequest['data'] = $data10;
            $ihs = $this->updateKetersediaanTTPush($objetoRequest, true);
        }
        return $this->respond($ihs);
    }
    public function updateKetersediaanTTPush(Request $request, $lokal = null)
    {
        // return($request['data']);
        // die();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();

        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            // CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigingAplicare() . "aplicaresws/rest/bed/update/0119R004",
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
                "Content-Type: Application/json",
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $result;
    }
    public function getKetersediaanTTNew(Request $request)
    {
        // return($request['kelas']);
        // die();
        $paramRuangan = '';
        if (isset($request['namaruangan'])  && $request['namaruangan'] != 'undefined' && $request['namaruangan'] != '') {
            $paramRuangan = " and ru.namaruangan like '%" . $request['namaruangan'] . "%'";
        }
        $paramKelas = '';
        if (isset($request['kelas'])  && $request['kelas'] != 'undefined' && $request['kelas'] != '') {
            $paramKelas = " and kl.namakelas like '%" . $request['kelas'] . "%'";
        }
        $data = DB::select(DB::raw("SELECT
            x.kodekelas,
                x.koderuang,
                x.namaruang,
                COUNT (x.id) AS kapasitas,
        -- SUM (tersediapriawanita) + SUM (tersediawanita)+   SUM (tersediapria)
                0 AS tersedia,
                SUM (tersediapria) AS tersediapria,
                SUM (tersediawanita) AS tersediawanita,
                SUM (tersediapriawanita) AS tersediapriawanita,
           
                x.namakelas
            FROM
                (
                    SELECT
                        ru.id AS koderuang,
                    
                        kmr.id,
                        kmr.namakamar,
                        -- kl.[namaexternal] AS [kodekelas],
                        case when ru.id=717 then 'NIC' when ru.id=722 then 'ICU' 
                        when ru.id=724 and kl.namakelas='Intensive' then 'ICU' when ru.id=758 then 'ICU' 
                        when ru.id=759 then 'ICU' when ru.id=760 and kl.namakelas='Intensive' then 'ICU'
                        when ru.id=761 then 'ICU' when ru.id=762 then 'ICU'
                        when ru.id=763 and kl.namakelas='Intensive' then 'ICU' when ru.id=764 then 'NIC' when ru.id=798 then 'NIC'
                        when ru.id=781 then 'ICU' when ru.id=797 then 'ICU' when ru.id=865 then 'ICU' when ru.id=740 then 'HCU'
                        when ru.id=741 then 'HCU' when ru.id=742 then 'HCU'
                        when ru.id=757 then 'ICC' when ru.id=756 then 'ICU' else kl.namaexternal END AS kodekelas,
                        kl.namakelas,
                        ru.id AS id_ruangan,
                        ru.namaruangan AS namaruang,
                      ru.jenis,
                        CASE
                    WHEN ru.jenis = 'male' THEN
                        1
                    ELSE
                        0
                    END AS tersediapria,
                    CASE
                WHEN ru.jenis = 'female' THEN
                    1
                ELSE
                    0
                END AS tersediawanita,
                     CASE
                WHEN ru.jenis = 'mix' THEN
                    1
                ELSE
                    0
                END AS tersediapriawanita
                FROM
                    tempattidur_m AS tt
                LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                LEFT JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
                LEFT JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
                LEFT JOIN kelas_m AS kl ON kl.id = kmr.objectkelasfk
                WHERE
                    tt.statusenabled = true
                    and kmr.statusenabled=true
              and  ru.objectdepartemenfk IN (16, 35)
                $paramRuangan
                  $paramKelas
                ) AS x
            GROUP BY
                x.kodekelas,
                x.koderuang,
                x.namaruang,
                x.namakelas
            ORDER BY
                x.kodekelas"));
        // return $this->respond(  $data );

        // foreach ($data as $key => $values) {
        // $dat = 0;
        // if($values->tersediawanita == '0' && $values->tersediapria == '0' ){
        //     $dat =(float) $values->kapasitas /2;
        //     // return    $dat;
        //     if($this->is_decimal($dat)){
        //         $values->tersediawanita =$values->kapasitas ;
        //     }else{
        //         $values->tersediapria = $dat;
        //         $values->tersediawanita = $dat;
        //     }               
        // }

        // if(( $values->tersediawanita != '0' && $values->tersediapria != '0'  )&&(
        //     (float) $values->tersediawanita +(float) $values->tersediapria  != (float) $values->kapasitas) ){
        //     $tot  = 0;
        //     $tot2  = 0;
        //     $totakhir =0;
        //     $tot = (float) $values->tersediawanita +(float) $values->tersediapria  ;
        //     $tot2 = (float) $values->kapasitas - $tot ;

        //     $totakhir = $tot2 /2;

        //     if($this->is_decimal($totakhir)){
        //         $values->tersediapria =(float)$values->tersediapria +$tot2  ;
        //     }else{
        // $values->tersedia = (float)$values->tersediapria+ $totakhir ;
        //         $values->tersediawanita = (float)$values->tersediawanita+$totakhir ;
        //     }   
        // }
        # code...
        // }
        // return $data;


        $pasien = DB::select(DB::raw("SELECT
                pd.noregistrasi,
                    pd.tglregistrasi,
                    pd.tglpulang,
                    -- kl.namaexternal AS kodekelas,
                    case when ru.id=717 then 'NIC' when ru.id=722 then 'ICU' 
                        when ru.id=724 and kl.namakelas='Intensive' then 'ICU' when ru.id=758 then 'ICU' 
                        when ru.id=759 then 'ICU' when ru.id=760 and kl.namakelas='Intensive' then 'ICU'
                        when ru.id=761 then 'ICU' when ru.id=762 then 'ICU'
                        when ru.id=763 and kl.namakelas='Intensive' then 'ICU' when ru.id=764 then 'NIC' when ru.id=798 then 'NIC'
                        when ru.id=781 then 'ICU' when ru.id=797 then 'ICU' when ru.id=865 then 'ICU' when ru.id=740 then 'HCU'
                        when ru.id=741 then 'HCU' when ru.id=742 then 'HCU'
                        when ru.id=757 then 'ICC' when ru.id=756 then 'ICU' else kl.namaexternal END AS kodekelas,
                    ru.id AS koderuang,
                    -- DATEDIFF(
                    --     DAY,
                    --     pd.tglregistrasi,
                    --     CASE
                    -- WHEN pd.tglpulang IS NULL THEN
                    --     getdate()
                    -- ELSE
                    --     pd.tglpulang
                    -- END
                    -- ) AS hari,
                    case when ps.objectjeniskelaminfk =1 then 'male' else 'female' end as jenis
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                INNER JOIN kelas_m AS kl ON kl.ID = pd.objectkelasfk
                INNER JOIN pasien_m AS ps ON ps.id= pd.nocmfk
                WHERE
                    ru.objectdepartemenfk = 16
                AND pd.tglpulang IS NULL
                 $paramRuangan
                    $paramKelas
                ORDER BY
                    pd.tglregistrasi ASC
                "));
        $total_tt = 0;
        foreach ($data as $key => $ruang) {
            $total_tt = (float)$ruang->kapasitas + $total_tt;
            foreach ($pasien as $key => $psn) {
                # code...
                // if( $ruang->tersediapria ==0){
                // $psn->tersedia      ='female';
                // }

                if ($psn->jenis == 'male' &&  $ruang->tersediapria != 0) {
                    if (
                        $ruang->koderuang  ==  $psn->koderuang && $ruang->kodekelas  ==  $psn->kodekelas
                    ) {
                        $ruang->tersediapria  = (float)$ruang->tersediapria - 1;
                    }
                }
                if ($psn->jenis == 'male' &&  $ruang->tersediapria == 0) {
                    if (
                        $ruang->koderuang  ==  $psn->koderuang && $ruang->kodekelas  ==  $psn->kodekelas
                    ) {
                        $ruang->tersediapriawanita  = (float)$ruang->tersediapriawanita - 1;
                    }
                }
                if ($psn->jenis == 'female' &&  $ruang->tersediawanita != 0) {
                    if (
                        $ruang->koderuang  ==  $psn->koderuang && $ruang->kodekelas  ==  $psn->kodekelas
                    ) {
                        $ruang->tersediawanita  = (float)$ruang->tersediawanita    - 1;
                    }
                }
                if ($psn->jenis == 'female' &&  $ruang->tersediawanita == 0) {
                    if (
                        $ruang->koderuang  ==  $psn->koderuang && $ruang->kodekelas  ==  $psn->kodekelas
                    ) {
                        $ruang->tersediapriawanita  = (float)$ruang->tersediapriawanita - 1;
                    }
                }
            }
            # code...
        }
        // return $datas = array('da' => $data, 'psn' => $pasien );
        // $terpakai = 0;
        // $kosong = 0;
        // foreach ( $data as $key => $value) {
        //    if( (float)$value->kosongMale!=0){
        //         $value->kosongMale =(float) $value->kosongMale -(float) $value->terpakaiMale;
        //    }
        //    if( (float)$value->tersediawanita!=0){
        //         $value->kosongFemale =(float) $value->kosongFemale -(float) $value->terpakaiFemale;
        //    }


        //    // if(((float) $value->total_tt !=)) 
        //    # code...
        // }
        foreach ($data as $key) {
            $key->tersedia = ($key->tersediapriawanita + $key->tersediawanita    + $key->tersediapria);
        }
        // $res =  array(
        //             'total_tt' => $total_tt, 
        //          'totalPakai' => $terpakai, 
        //          'kosong' => $kosong, 
        //      'data' => $data
        //  );
        return $this->respond($data);
    }

    public function getMonitoringKlaimPerBulan(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        //Fungsi :Data Kunjungan
        //Method : GET
        //Format : Json
        //Content-Type: application/json; charset=utf-8
        //Parameter 1 : Tanggal Pulang format: yyyy-mm-dd
        // Parameter 2 : Jenis Pelayanan (1. Inap 2. Jalan)
        // Parameter 3 : Status Klaim (1. Proses Verifikasi 2. Pending Verifikasi 3. Klaim)
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),

            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Monitoring/Klaim/Tanggal/"
                . $request['tglsep'] . "/JnsPelayanan/" . $request['jenispelayanan'] . "/Status/" . $request['status'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return $this->respond($result);
    }

    public function getCariPRBbyTanggal(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        $tglMulai = Carbon::now()->subMonth(4)->format('Y-m-d');
        //        return $this->respond($tglMulai);
        $tglAkhir = Carbon::now()->format('Y-m-d');

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "prb/tglMulai/" . $tglMulai . "/tglAkhir/" . $tglAkhir,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }

    public function dataDokter(Request $request)
    {
        $data = $this->getIdConsumerBPJSV2(); //'24338';//
        $secretKey = $this->getPasswordConsumerBPJSV2(); //'1bOB8816DE';//
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $tglAkhir = Carbon::now()->format('Y-m-d');
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "RencanaKontrol/JadwalPraktekDokter/JnsKontrol/1/KdPoli/INT/TglRencanaKontrol/" . $tglAkhir,
            //    CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/vclaim-rest-1.1/RencanaKontrol/JadwalPraktekDokter/JnsKontrol/1/KdPoli/INT/TglRencanaKontrol/2021-08-09",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecryptVclaim($key, $result));
        // return $this->respond($result['response']);


    }
    public function StatusAntrianMjkn(Request $request)
    {

        $dataAntrianPost = [];
        $kodePoli = $request['kodepoli'];
        $kodeDokter = $request['kodedokter'];
        $tanggal = $request['tanggalperiksa'];
        // $user = $request->header('x-username');

        $status = false;
        $tglFormat = $this->date_extract_format($tanggal);
        // return(date('Y-m-d'));
        // die;
        if ($tanggal > date('Y-m-d')) {
            if ($tglFormat == 'Y-m-d') {

                if ($tanggal == $request['tanggalperiksa'])
                    $koderuangan = '';
                $dataRuangan = DB::select(DB::raw(" 
                    select namaruangan,kodeexternal from ruangankiosk_m where kdinternal ='$kodePoli' limit 1
                            "));
                foreach ($dataRuangan as $paramRuangan) {
                    $dataRuangan = $paramRuangan->namaruangan;
                    $koderuangan = $paramRuangan->kodeexternal;
                }
                $dokter = DB::select(DB::raw(" 
                    SELECT  namahafis  FROM pegawai_m where idhafis='$kodeDokter'
                            "));
                foreach ($dokter as $paramRuangan) {
                    $dokter = $paramRuangan->namahafis;
                }
                if (!empty($dataRuangan)) {
                    $dataSlotingJkn = DB::select(DB::raw("SELECT slottingonline_m.quota
                                                                FROM            slottingonline_m INNER JOIN
                                                                                            ruangan_m ON slottingonline_m.objectruanganfk = ruangan_m.id
                                                                where ruangan_m.kodeexternal ='$kodePoli' and slottingonline_m.status='1' and slottingonline_m.statusenabled=true limit 1"));

                    if (!empty($dataSlotingJkn)) {
                        foreach ($dataSlotingJkn as $paramSlot) {
                            $dataSlotingJkn = $paramSlot->quota;
                        }
                    } else {

                        $dataSlotingJkn = 50;
                    }
                    $dataSlotingNonJkn = DB::select(DB::raw("SELECT slottingonline_m.quota
                            FROM            slottingonline_m INNER JOIN
                                                        ruangan_m ON slottingonline_m.objectruanganfk = ruangan_m.id
                            where ruangan_m.kodeexternal ='$kodePoli' and slottingonline_m.status='2' and slottingonline_m.statusenabled=true limit 1"));
                    if (!empty($dataSlotingNonJkn)) {
                        foreach ($dataSlotingNonJkn as $paramSlot) {
                            $dataSlotingNonJkn = $paramSlot->quota;
                        }
                    } else {
                        $dataSlotingNonJkn = 100;
                    }
                    // $dataAntrianDipanggil = DB::select(DB::raw("select jenis || '-' ||  noantrian  as antreanpanggil from antrianpasienregistrasi_t WHERE jenis ='B' and tanggalreservasi='$tanggal' order by noantrian desc limit 1"));
                    $dataAntrianDipanggil = DB::select(DB::raw("select 'B-'||apd.noantrian as antreanpanggil from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                                    pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                                    apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                                    where pd.objectruanganlastfk='$koderuangan' and pd.statusschedule is not null and pd.statusenabled=true
                                    and apr.istaskantrol=3 and apr.tanggalreservasi='$tanggal' order by apd.noantrian desc limit 1"));
                    if (!empty($dataAntrianDipanggil)) {
                        foreach ($dataAntrianDipanggil as $paramSlot) {
                            // if($paramSlot->jml != 0){
                            $dataAntrianDipanggil = $paramSlot->antreanpanggil;
                            // }
                            // else{
                            //     $dataAntrianDipanggil =1;  
                            // }
                        }
                    } else {
                        $dataAntrianDipanggil = "B-1";
                    }
                    $dataJmlSisaAntrianDipanggil = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                                    pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                                    apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                                    where pd.objectruanganlastfk='$koderuangan' and pd.statusschedule is not null and pd.statusenabled=true
                                    and apr.istaskantrol is null and apr.tanggalreservasi='$tanggal'"));
                    if (!empty($dataJmlSisaAntrianDipanggil)) {

                        foreach ($dataJmlSisaAntrianDipanggil as $paramSlot) {

                            $dataJmlSisaAntrianDipanggil = $paramSlot->jml;
                        }
                        // return($dataJmlSisaAntrianDipanggil);
                        // die;
                    } else {
                        $dataJmlSisaAntrianDipanggil = 0;
                    }

                    $dataJmlAntrianDipanggil = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                                    pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                                    apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                                    where pd.objectruanganlastfk='$koderuangan' and pd.statusschedule is not null and pd.statusenabled=true
                                    and apr.tanggalreservasi='$tanggal'"));
                    if (!empty($dataJmlAntrianDipanggil)) {
                        foreach ($dataJmlAntrianDipanggil as $paramSlot) {
                            if ($paramSlot->jml != 0) {
                                $dataJmlAntrianDipanggil = $paramSlot->jml;
                            } else {
                                $dataJmlAntrianDipanggil = 0;
                            }
                        }
                    } else {
                        $dataJmlAntrianDipanggil = 0;
                    }

                    $dataJmlAntrianDipanggilNonJkn = DB::select(DB::raw("select count(*) as jml from antrianpasienregistrasi_t WHERE jenis ='B' and tanggalreservasi='$tanggal'  "));
                    foreach ($dataJmlAntrianDipanggilNonJkn as $paramSlot) {
                        $dataJmlAntrianDipanggilNonJkn = $paramSlot->jml;
                    }

                    $dataAntrianPost = array(
                        'namapoli' => $dataRuangan,
                        'namadokter' => $dokter,
                        'totalantrean' =>  $dataJmlAntrianDipanggil,
                        'sisaantrean' =>  $dataJmlSisaAntrianDipanggil,
                        'antreanpanggil' => $dataAntrianDipanggil,
                        'sisakuotajkn' => (int)$dataSlotingJkn - (int)$dataJmlAntrianDipanggil,
                        'kuotajkn' => $dataSlotingJkn,
                        'sisakuotanonjkn' => (int)$dataSlotingNonJkn,
                        'kuotanonjkn' => $dataSlotingNonJkn,
                        'keterangan' => "status antrian",
                    );


                    $status = true;
                    $respon  = $dataAntrianPost;
                    $message = array(
                        'message' => 'ok',
                        'code' => '200',
                    );
                } else {
                    $message = array(
                        'message' => 'Poli Tidak Ditemukan',
                        'code' => 201,
                    );
                }

                if ($status == false) {
                    $result = array(

                        'metadata' => $message,
                    );
                } else {
                    $result = array(
                        'response' => $respon,
                        'metadata' => $message,
                    );
                }
            } else {
                $message = array(
                    'message' => 'Format Tanggal Tidak Sesuai, format yang benar adalah yyyy-mm-dd',
                    'code' => 201,
                );
                $result = array(

                    'metadata' => $message,
                );
            }
        } else {
            $message = array(
                'message' => 'Tanggal Periksa Tidak Berlaku',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message,
            );
        }
        return $this->respond($result);
        // $encodedSignature = base64_encode($signature);
        // return $this->respond($result);

    }
    public function StatusAntrianMjknAles(Request $request)
    {

        $dataAntrianPost = [];
        $kodePoli = $request['kodepoli'];
        $kodeDokter = $request['kodedokter'];
        $tanggal = $request['tanggalperiksa'];
        // $user = $request->header('x-username');

        $status = false;
        $tglFormat = $this->date_extract_format($tanggal);
        // return(date('Y-m-d'));
        // die;
        //  if($tanggal > date('Y-m-d')){
        if ($tglFormat == 'Y-m-d') {

            if ($tanggal == $request['tanggalperiksa'])
                $koderuangan = '';
            $dataRuangan = DB::select(DB::raw(" 
                    select namaruangan,kodeexternal from ruangankiosk_m where kdinternal ='$kodePoli' limit 1
                            "));
            foreach ($dataRuangan as $paramRuangan) {
                $dataRuangan = $paramRuangan->namaruangan;
                $koderuangan = $paramRuangan->kodeexternal;
            }
            $dokter = DB::select(DB::raw("SELECT  nama,namahafis,id  FROM pegawai_m where idhafis='$kodeDokter'"));
            if (!empty($dokter)) {
                foreach ($dokter as $paramRuangan) {
                    $dokter = $paramRuangan->namahafis;
                    $idDokter = $paramRuangan->id;
                    $namaDokter = $paramRuangan->nama;
                }
            } else {
                $message = array(
                    'message' => 'Dokter Tidak Ditemukan',
                    'code' => 201,
                );
                $result = array(
                    'metadata' => $message,
                );
                return $this->respond($result);
            }
            $jmlSudahDaftar = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                        pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                        apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                        where pd.objectruanganlastfk='$koderuangan' and pd.statusschedule is not null and pd.statusenabled=true
                        and apd.namahafis='$dokter' and apr.tanggalreservasi='$tanggal' and pd.objectkelompokpasienlastfk=2 and apr.ismobilejkn=true"));
            if (!empty($jmlSudahDaftar)) {
                foreach ($jmlSudahDaftar as $paramSlot) {
                    $jmlSudahDaftar = $paramSlot->jml;
                }
            } else {
                $jmlSudahDaftar = 0;
            }

            $jmlSudahDaftarNonJKN = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                            pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                            apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                            where pd.objectruanganlastfk='$koderuangan' and pd.statusschedule is not null and pd.statusenabled=true
                            and apd.namahafis='$dokter' and apr.tanggalreservasi='$tanggal'  and pd.objectkelompokpasienlastfk != 2"));
            if (!empty($jmlSudahDaftarNonJKN)) {
                foreach ($jmlSudahDaftarNonJKN as $paramSlot) {
                    $jmlSudahDaftarNonJKN = $paramSlot->jml;
                }
                $dataSlotingNonJkn = DB::select(DB::raw("SELECT slottingonline_m.quota
                            FROM            slottingonline_m INNER JOIN
                                                        ruangan_m ON slottingonline_m.objectruanganfk = ruangan_m.id
                            where ruangan_m.kodeexternal ='$kodePoli' and slottingonline_m.status='2' and slottingonline_m.statusenabled=true limit 1"));
                if (!empty($dataSlotingNonJkn)) {
                    foreach ($dataSlotingNonJkn as $paramSlot) {
                        $dataSlotingNonJkn = $paramSlot->quota;
                    }
                } else {
                    $dataSlotingNonJkn = 100;
                }
                if ($jmlSudahDaftarNonJKN > $dataSlotingNonJkn) {
                    $message = array(
                        'message' => 'Slotting Sudah Penuh',
                        'code' => 201,
                    );
                    $result = array(
                        'metadata' => $message,
                    );
                    return $this->respond($result);
                }
            } else {
                $jmlSudahDaftarNonJKN = 0;
            }

            $objSave = array(
                'kodepoli' => $kodePoli,
                'tanggal' => $tanggal
            );
            $Parsing = $this->getJadwalDokterMjkn($objSave);
            if ($Parsing['status'] == 'tidakada') {
                $message = array(
                    'message' => 'Jadwal Di Hari Ini Tidak ada, Silahkan Pilih Jadwal Lain',
                    'code' => 201,
                );
                $result = array(
                    'metadata' => $message,
                );
                return $this->respond($result);
            }
            $y = $Parsing['response'];
            $cekDokter = "false";
            $kapasitaspasien = 0;
            $namadokter = '';
            foreach ($y as $x) {
                if ($x->kodedokter == $kodeDokter) {
                    $cekDokter = "true";
                    $kapasitaspasien = $x->kapasitaspasien;
                    $namadokter = $x->namadokter;
                    break;
                }
            }

            if ($cekDokter == "false") {
                $message = array(
                    'message' => 'Dokter Tidak Ditemukan',
                    'code' => 201,
                );
                $result = array(
                    'metadata' => $message,
                );
                return $this->respond($result);
            }
            $dataTask3 = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd 
                        join antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk and pd.objectruanganlastfk=apd.objectruanganfk
                        join ruangankiosk_m as rk on apd.objectruanganfk::varchar=rk.kodeexternal
                        join pegawai_m as pg on pg.namahafis=apd.namahafis
                        join antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule
                        where apd.namahafis='$dokter' and apr.tglcekinjkn is not null 
                        and pd.statusenabled = true limit 1"));
            foreach ($dataTask3 as $paramSlot) {
                $dataTask3 = $paramSlot->jml;
            }
            $dataTask4 = DB::select(DB::raw("select apd.namahafis || '-' || apd.noantrian as noantrianpoli,
                        apd.noantrian from pasiendaftar_t as pd 
                        join antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk and pd.objectruanganlastfk=apd.objectruanganfk
                        join ruangankiosk_m as rk on apd.objectruanganfk::varchar=rk.kodeexternal
                        join pegawai_m as pg on pg.namahafis=apd.namahafis
                        join antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule
                        where apd.namahafis='$dokter' and apr.tglcekinjkn is not null and pd.istaskantrol=4
                        and pd.statusenabled = true order by apd.noantrian desc limit 1"));
            if (!empty($dataTask4)) {
                foreach ($dataTask4 as $paramSlot) {
                    $dataTask4 = $paramSlot->noantrianpoli;
                    $estimasidilayani = 1800 * ((int)$paramSlot->noantrian - 1);
                }
            } else {
                $dataTask4 = 0;
                $estimasidilayani = 1800 * 1;
            }

            if (!empty($dataRuangan)) {

                $dataAntrianPost = array(
                    'namapoli' => $dataRuangan,
                    'namadokter' => $namaDokter,
                    'totalantrean' =>  $jmlSudahDaftar,
                    'sisaantrean' =>  (float)$dataTask3,
                    'antreanpanggil' => (string)$dataTask4,
                    'sisakuotajkn' => (int)$kapasitaspasien - (int)$jmlSudahDaftar,
                    'kuotajkn' => $kapasitaspasien,
                    'sisakuotanonjkn' => (int)$dataSlotingNonJkn - (int)$jmlSudahDaftarNonJKN,
                    'kuotanonjkn' => $dataSlotingNonJkn,
                    'keterangan' => "status antrian",
                );


                $status = true;
                $respon  = $dataAntrianPost;
                $message = array(
                    'message' => 'Ok',
                    'code' => 200,
                );
            } else {
                $message = array(
                    'message' => 'Poli Tidak Ditemukan',
                    'code' => 201,
                );
            }

            if ($status == false) {
                $result = array(

                    'metadata' => $message,
                );
            } else {
                $result = array(
                    'response' => $respon,
                    'metadata' => $message,
                );
            }
        } else {
            $message = array(
                'message' => 'Format Tanggal Tidak Sesuai, format yang benar adalah yyyy-mm-dd',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message,
            );
        }
        // }else{
        //     $message = array(
        //         'message' => 'Tanggal Periksa Tidak Berlaku',
        //         'code' => 201,
        //     );
        //     $result = array(

        //         'metadata' => $message,
        //     );
        // }      
        return $this->respond($result);
        // $encodedSignature = base64_encode($signature);
        // return $this->respond($result);

    }
    public function getNoPesertaPrivate($request)
    {
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Peserta/nokartu/" . $request['nokartu'] . "/tglSEP/" . $request['tglsep'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return  $result;
        // return $this->respond($this->stringDecryptVclaim($key, $result));
    }
    public function GetAntrianMjknAlesNew(Request $request)
    {
        //save log mjkn
        $logmjkn = new MjknLog();
        $logmjkn->norec = $logmjkn->generateNewId();
        $logmjkn->type = 'getantrian';
        $logmjkn->data = $request;
        $logmjkn->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
        $logmjkn->save();
        //-----------------------

        $kodePoli = $request['kodepoli'];
        $kodeDokter = $request['kodedokter'];
        $tanggal = $request['tanggalperiksa'];
        $nomorkartu = $request['nomorkartu'];
        $nomorreferensi = $request['nomorreferensi'];
        $norm = $request['norm'];
        $nik = $request['nik'];
        $nohp = $request['nohp'];
        $jeniskunjungan = $request['jeniskunjungan'];
        $datakartu = array('nokartu' => $nomorkartu, 'tglsep' => $tanggal);

       
        $cekKepersertaan = $this->getNoPesertaPrivate($datakartu);


        $datax2 = array(
            $cekKepersertaan
        );
        //  return($cekKepersertaan); 
        $nama = $datax2[0]['response']['peserta']->nama;
        $sex = $datax2[0]['response']['peserta']->sex;
        $tglLahir = $datax2[0]['response']['peserta']->tglLahir;
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // $timewaktu = time('08:00')."000"; 
        $timewaktu = strtotime($tanggal) * 1000;
        // $timewaktu = $tStamp."000"; 
        $status = false;
        $tglFormat = $this->date_extract_format($tanggal);
        $iddataRuangan = "";
        $noreservasi = "";
        $idDokter = "";
        $jampraktek = $request['jampraktek'];
        $jamawal = substr($jampraktek, 0, 2);
        $menitawal = substr($jampraktek, 3, 2);

        // if($tanggal > date('Y-m-d')){
        $objSave = array(
            'kodepoli' => $kodePoli,
            'tanggal' => $tanggal
        );
        $Parsing = $this->getJadwalDokterMjkn($objSave);
        if ($Parsing['status'] == 'tidakada') {
            $message = array(
                'message' => 'Jadwal Di Hari Ini Tidak ada, Silahkan Pilih Jadwal Lain',
                'code' => 201,
            );
            $result = array(
                'metadata' => $message,
            );
            return $this->respond($result);
        }
        $y = $Parsing['response'];

        $cekDokter = "false";
        $kapasitaspasien = 0;
        $namadokter = '';
        foreach ($y as $x) {
            if ($x->kodedokter == $kodeDokter) {
                $cekDokter = "true";
                $kapasitaspasien = $x->kapasitaspasien;
                $namadokter = $x->namadokter;
                break;
            }
        }

        if ($cekDokter == "false") {
            $message = array(
                'message' => 'Dokter Tidak Ditemukan',
                'code' => 201,
            );
            $result = array(
                'metadata' => $message,
            );
            return $this->respond($result);
        }
        $statuspasien = 'lama';
        $dataPasienUse = DB::select(DB::raw(" 
                            select * from pasien_m where noidentitas='$nik' 
                                        "));
        if (empty($dataPasienUse)) {
            $dataPasienUse = DB::select(DB::raw(" 
                        select * from pasien_m where nobpjs='$nomorkartu' 
                                    "));
        }
        if (empty($dataPasienUse)) {
            $dataPasienUse = DB::select(DB::raw(" 
                            select * from antrianpasienregistrasipasienbarumjkn_t where nobpjs='$nomorkartu' 
                                        "));
            $statuspasien = 'baru';
        }
      
        if (!empty($dataPasienUse)) {
            if ($statuspasien == 'lama') {
                foreach ($dataPasienUse as $x) {
                    $nik = $x->noidentitas;
                }
            } else {
                foreach ($dataPasienUse as $x) {
                    $nik = $x->nik;
                }
            }

            $dataRuangan = DB::select(DB::raw(" 
                select namaruangan,kodeexternal from ruangankiosk_m where kdinternal ='$kodePoli' limit 1
                        "));
            foreach ($dataRuangan as $paramRuangan) {
                $dataRuangan = $paramRuangan->namaruangan;
                $iddataRuangan = $paramRuangan->kodeexternal;
            }


            $datakartu = array('nokartu' => $nomorkartu, 'tglsep' => $tanggal);

            if (date('H') >= 22) {
                $message = array(
                    'message' => 'Pendaftaran ke Poli' . $dataRuangan . ' Tidak Boleh Diatas Jam  12:00',
                    'code' => 201,
                );
                $result = array(
                    'metadata' => $message,
                );
                return $this->respond($result);
            }
            $dokter = DB::select(DB::raw("SELECT  namahafis,id  FROM pegawai_m where idhafis='$kodeDokter'"));
            if (!empty($dokter)) {
                foreach ($dokter as $paramRuangan) {
                    $dokter = $paramRuangan->namahafis;
                    $idDokter = $paramRuangan->id;
                }
            } else {
                $message = array(
                    'message' => 'Dokter Tidak Ditemukan',
                    'code' => 201,
                );
                $result = array(
                    'metadata' => $message,
                );
                return $this->respond($result);
            }
            $jmlSudahDaftar = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                            pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                            apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                            where pd.objectruanganlastfk='$iddataRuangan' and pd.statusschedule is not null and pd.statusenabled=true
                            and apd.namahafis='$dokter' and apr.tanggalreservasi='$tanggal' and pd.objectkelompokpasienlastfk=2 and apr.ismobilejkn=true"));
            if (!empty($jmlSudahDaftar)) {
                foreach ($jmlSudahDaftar as $paramSlot) {
                    $jmlSudahDaftar = $paramSlot->jml;
                }
                if ($jmlSudahDaftar > $kapasitaspasien) {
                    $message = array(
                        'message' => 'Slotting Sudah Penuh',
                        'code' => 201,
                    );
                    $result = array(
                        'metadata' => $message,
                    );
                    return $this->respond($result);
                }
            } else {
                $jmlSudahDaftar = 0;
            }

            $jmlSudahDaftarNonJKN = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                            pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                            apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                            where pd.objectruanganlastfk='$iddataRuangan' and pd.statusschedule is not null and pd.statusenabled=true
                            and apd.namahafis='$dokter' and apr.tanggalreservasi='$tanggal'  and pd.objectkelompokpasienlastfk != 2"));
            if (!empty($jmlSudahDaftarNonJKN)) {
                foreach ($jmlSudahDaftarNonJKN as $paramSlot) {
                    $jmlSudahDaftarNonJKN = $paramSlot->jml;
                }
                $dataSlotingNonJkn = DB::select(DB::raw("SELECT slottingonline_m.quota
                                FROM            slottingonline_m INNER JOIN
                                                            ruangan_m ON slottingonline_m.objectruanganfk = ruangan_m.id
                                where ruangan_m.kodeexternal ='$kodePoli' and slottingonline_m.status='2' and slottingonline_m.statusenabled=true limit 1"));
                if (!empty($dataSlotingNonJkn)) {
                    foreach ($dataSlotingNonJkn as $paramSlot) {
                        $dataSlotingNonJkn = $paramSlot->quota;
                    }
                } else {
                    $dataSlotingNonJkn = 100;
                }
                if ($jmlSudahDaftarNonJKN > $dataSlotingNonJkn) {
                    $message = array(
                        'message' => 'Slotting Sudah Penuh',
                        'code' => 201,
                    );
                    $result = array(
                        'metadata' => $message,
                    );
                    return $this->respond($result);
                }
            } else {
                $jmlSudahDaftarNonJKN = 0;
            }
            //    $menitawal = $menitawal+'10';
            // return($menitawal);
            // die();
            if (!empty($dataRuangan)) {

                if ($jeniskunjungan == 3) {
                    $jeniskunjungan = 1;
                }

                $datakintil = array('noRujukanKontrol' => $nomorreferensi);
                $data = $this->cariRencanaKontrolV2Private($datakintil);
                $str = var_export($data, true);
                $token = strtok($str, ",");
                while ($token !== false) {
                    if (str_contains($token, "noRujukan")) {
                        $data = explode("'", $token);
                        $nomorreferensi = $data[3];
                    }
                    $token = strtok(",");
                }
                $gotoSimpan = array(
                    'tglReservasiFix' => $tanggal,
                    'poliKlinik' => $iddataRuangan,
                    'nomorkartu' => $nomorkartu,
                    'nomorreferensi' => $nomorreferensi,
                    'nik' => $nik,
                    'noCm' => $norm,
                    'noTelpon' => $nohp,
                    'asalRujukan' => $jeniskunjungan,
                    'dokter' => $idDokter,
                    'namahafis' => $dokter,
                    'nama' => $nama,
                    'sex' => $sex,
                    'tgllahir' => $tglLahir,
                    'nohp' => $nohp

                );
                $dataDisimpan = $this->saveReservasi($gotoSimpan);
                // return($dataDisimpan);
                // die();
                if ($dataDisimpan['status'] == 201) {
                    $message = array(
                        'message' => $dataDisimpan['message'],
                        'code' => 201,
                    );
                    $result = array(

                        'metadata' => $message,
                    );
                    return $this->respond($result);
                }

                $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $iddataRuangan)
                    ->where('tglregistrasi', '>=', $tanggal . ' 00:00')
                    ->where('tglregistrasi', '<=', $tanggal . ' 23:59')
                    ->where('statusenabled', true)
                    ->where('namahafis', $dokter)
                    ->count('noantrian');

                if ((int)$countNoAntrian == 1) {
                    $menitawal = $menitawal;
                } else if ((int)$countNoAntrian == 2) {
                    $menitawal = $menitawal + '10';
                } else if ((int)$countNoAntrian == 3) {
                    $menitawal = $menitawal + '20';
                } else if ((int)$countNoAntrian == 4) {
                    $menitawal = $menitawal + '30';
                } else if ((int)$countNoAntrian == 5) {
                    $menitawal = $menitawal + '40';
                } else if ((int)$countNoAntrian == 6) {
                    $menitawal = $menitawal + '50';
                } else if ((int)$countNoAntrian == 7) {
                    $menitawal = $menitawal + '61';
                } else if ((int)$countNoAntrian == 8) {
                    $menitawal = $menitawal + '70';
                } else if ((int)$countNoAntrian == 9) {
                    $menitawal = $menitawal + '80';
                } else if ((int)$countNoAntrian == 10) {
                    $menitawal = $menitawal + '90';
                } else if ((int)$countNoAntrian == 11) {
                    $menitawal = $menitawal + '100';
                } else if ((int)$countNoAntrian == 12) {
                    $menitawal = $menitawal + '110';
                } else if ((int)$countNoAntrian == 13) {
                    $menitawal = $menitawal + '121';
                } else if ((int)$countNoAntrian == 14) {
                    $menitawal = $menitawal + '130';
                } else if ((int)$countNoAntrian == 15) {
                    $menitawal = $menitawal + '140';
                } else if ((int)$countNoAntrian == 16) {
                    $menitawal = $menitawal + '150';
                } else if ((int)$countNoAntrian == 17) {
                    $menitawal = $menitawal + '160';
                } else if ((int)$countNoAntrian == 18) {
                    $menitawal = $menitawal + '170';
                } else if ((int)$countNoAntrian == 19) {
                    $menitawal = $menitawal + '181';
                } else if ((int)$countNoAntrian == 20) {
                    $menitawal = $menitawal + '190';
                } else if ((int)$countNoAntrian == 21) {
                    $menitawal = $menitawal + '200';
                } else if ((int)$countNoAntrian == 22) {
                    $menitawal = $menitawal + '210';
                } else if ((int)$countNoAntrian == 23) {
                    $menitawal = $menitawal + '220';
                } else if ((int)$countNoAntrian == 23) {
                    $menitawal = $menitawal + '230';
                } else if ((int)$countNoAntrian == 24) {
                    $menitawal = $menitawal + '241';
                } else if ((int)$countNoAntrian == 25) {
                    $menitawal = $menitawal + '250';
                } else if ((int)$countNoAntrian == 26) {
                    $menitawal = $menitawal + '260';
                } else if ((int)$countNoAntrian == 27) {
                    $menitawal = $menitawal + '270';
                } else if ((int)$countNoAntrian == 28) {
                    $menitawal = $menitawal + '280';
                } else if ((int)$countNoAntrian == 29) {
                    $menitawal = $menitawal + '290';
                } else if ((int)$countNoAntrian == 30) {
                    $menitawal = $menitawal + '301';
                } else {
                    $menitawal = $menitawal + '310';
                }

                if ($menitawal > 60) {
                    if ($menitawal > 120) {
                        if ($menitawal > 180) {
                            if ($menitawal > 240) {
                                if ($menitawal > 300) {
                                    $menitawal = $menitawal - 300;
                                    $jamawal = $jamawal + 5;
                                } else {
                                    $menitawal = $menitawal - 240;
                                    $jamawal = $jamawal + 4;
                                }
                            } else {
                                $menitawal = $menitawal - 180;
                                $jamawal = $jamawal + 3;
                            }
                        } else {
                            $menitawal = $menitawal - 120;
                            $jamawal = $jamawal + 2;
                        }
                    } else {
                        $menitawal = $menitawal - 60;
                        $jamawal = $jamawal + 1;
                    }
                }

                date_default_timezone_set("Asia/Jakarta");
                $timewaktu = strtotime(date($tanggal . ' ' . $jamawal . ':' . $menitawal)) * 1000;
                // $timewaktu2=$tanggal.' '.$jamawal.':'.$menitawal;
                // $timewaktu3=strtotime(date($tanggal.' '.$jamawal.':'.$menitawal));
                // $timewaktu4=strtotime($timewaktu2);
                // return($timewaktu);
                // die();
                $dataAntrianPost = array(
                    'nomorantrean' => $dokter . '-' . $dataDisimpan['noAntrianJam'], //$dataAntrianDipanggil,
                    'angkaantrean' => (int)$dataDisimpan['noAntrianJam'], //(int)$dataAntrianDipanggilAngka,
                    'kodebooking' =>  $dataDisimpan['noreservasi'], // $noreservasi,
                    'norm' => (string)$dataDisimpan['nocm'],
                    'namapoli' => $dataRuangan,
                    'namadokter' => $namadokter,
                    'estimasidilayani' =>  (int)$timewaktu, //$dataJmlSisaAntrianDipanggil ,
                    'sisakuotajkn' => (int)$kapasitaspasien -  (int)$countNoAntrian, //(int)$dataAntrianDipanggilAngka,
                    'kuotajkn' => (int)$kapasitaspasien,
                    'sisakuotanonjkn' => (int)$dataSlotingNonJkn - (int)$jmlSudahDaftarNonJKN,
                    'kuotanonjkn' => $dataSlotingNonJkn,
                    'keterangan' => "Datang Minimal 30 menit sebelum estimasi dilayani"
                );


                $status = true;
                $respon  = $dataAntrianPost;
                $message = array(
                    'message' => 'Ok',
                    'code' => 200,
                );
            } else {
                $message = array(
                    'message' => 'Poli Tidak Ditemukan',
                    'code' => 201,
                );
            }
            if ($status == false) {
                $result = array(
                    'metadata' => $message,
                );
            } else {
                $result = array(
                    'response' => $respon,
                    'metadata' => $message,
                );
            }
        } else {
            //pasien baru jkn
            $dokter = DB::select(DB::raw("SELECT  namahafis,id  FROM pegawai_m where idhafis='$kodeDokter'"));
            if (!empty($dokter)) {
                foreach ($dokter as $paramRuangan) {
                    $dokter = $paramRuangan->namahafis;
                    $idDokter = $paramRuangan->id;
                }
            } else {
                $message = array(
                    'message' => 'Dokter Tidak Ditemukan',
                    'code' => 201,
                );
                $result = array(
                    'metadata' => $message,
                );
                return $this->respond($result);
            }
            $dataRuangan = DB::select(DB::raw(" 
                        select namaruangan,kodeexternal from ruangankiosk_m where kdinternal ='$kodePoli' limit 1
                                "));
            foreach ($dataRuangan as $paramRuangan) {
                $dataRuangan = $paramRuangan->namaruangan;
                $iddataRuangan = $paramRuangan->kodeexternal;
            }
            $jmlSudahDaftarNonJKN = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                                    pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                                    apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                                    where pd.objectruanganlastfk='$iddataRuangan' and pd.statusschedule is not null and pd.statusenabled=true
                                    and apd.namahafis='$dokter' and apr.tanggalreservasi='$tanggal'  and pd.objectkelompokpasienlastfk != 2"));
            if (!empty($jmlSudahDaftarNonJKN)) {
                foreach ($jmlSudahDaftarNonJKN as $paramSlot) {
                    $jmlSudahDaftarNonJKN = $paramSlot->jml;
                }
                $dataSlotingNonJkn = DB::select(DB::raw("SELECT slottingonline_m.quota
                                        FROM            slottingonline_m INNER JOIN
                                                                    ruangan_m ON slottingonline_m.objectruanganfk = ruangan_m.id
                                        where ruangan_m.kodeexternal ='$kodePoli' and slottingonline_m.status='2' and slottingonline_m.statusenabled=true limit 1"));
                if (!empty($dataSlotingNonJkn)) {
                    foreach ($dataSlotingNonJkn as $paramSlot) {
                        $dataSlotingNonJkn = $paramSlot->quota;
                    }
                } else {
                    $dataSlotingNonJkn = 100;
                }
                if ($jmlSudahDaftarNonJKN > $dataSlotingNonJkn) {
                    $message = array(
                        'message' => 'Slotting Sudah Penuh',
                        'code' => 201,
                    );
                    $result = array(
                        'metadata' => $message,
                    );
                    return $this->respond($result);
                }
            } else {
                $jmlSudahDaftarNonJKN = 0;
            }


            $gotoSimpan = array(
                'tglReservasiFix' => $tanggal,
                'poliKlinik' => $iddataRuangan,
                'nomorkartu' => $nomorkartu,
                'nomorreferensi' => $nomorreferensi,
                'nik' => $nik,
                'noCm' => $norm,
                'noTelpon' => $nohp,
                'asalRujukan' => $jeniskunjungan,
                'dokter' => $idDokter,
                'namahafis' => $dokter,
                'nama' => $nama,
                'sex' => $sex,
                'tgllahir' => $tglLahir,
                'nohp' => $nohp

            );
            $dataDisimpan = $this->saveReservasi($gotoSimpan);
            
            if ($dataDisimpan['status'] == 201) {
                $message = array(
                    'message' => $dataDisimpan['message'],
                    'code' => 201,
                );
                $result = array(

                    'metadata' => $message,
                );
                return $this->respond($result);
            }

            $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $iddataRuangan)
                ->where('tglregistrasi', '>=', $tanggal . ' 00:00')
                ->where('tglregistrasi', '<=', $tanggal . ' 23:59')
                ->where('statusenabled', true)
                ->where('namahafis', $dokter)
                ->count('noantrian');

            if ((int)$countNoAntrian == 1) {
                $menitawal = $menitawal;
            } else if ((int)$countNoAntrian == 2) {
                $menitawal = $menitawal + '10';
            } else if ((int)$countNoAntrian == 3) {
                $menitawal = $menitawal + '20';
            } else if ((int)$countNoAntrian == 4) {
                $menitawal = $menitawal + '30';
            } else if ((int)$countNoAntrian == 5) {
                $menitawal = $menitawal + '40';
            } else if ((int)$countNoAntrian == 6) {
                $menitawal = $menitawal + '50';
            } else if ((int)$countNoAntrian == 7) {
                $menitawal = $menitawal + '61';
            } else if ((int)$countNoAntrian == 8) {
                $menitawal = $menitawal + '70';
            } else if ((int)$countNoAntrian == 9) {
                $menitawal = $menitawal + '80';
            } else if ((int)$countNoAntrian == 10) {
                $menitawal = $menitawal + '90';
            } else if ((int)$countNoAntrian == 11) {
                $menitawal = $menitawal + '100';
            } else if ((int)$countNoAntrian == 12) {
                $menitawal = $menitawal + '110';
            } else if ((int)$countNoAntrian == 13) {
                $menitawal = $menitawal + '121';
            } else if ((int)$countNoAntrian == 14) {
                $menitawal = $menitawal + '130';
            } else if ((int)$countNoAntrian == 15) {
                $menitawal = $menitawal + '140';
            } else if ((int)$countNoAntrian == 16) {
                $menitawal = $menitawal + '150';
            } else if ((int)$countNoAntrian == 17) {
                $menitawal = $menitawal + '160';
            } else if ((int)$countNoAntrian == 18) {
                $menitawal = $menitawal + '170';
            } else if ((int)$countNoAntrian == 19) {
                $menitawal = $menitawal + '181';
            } else if ((int)$countNoAntrian == 20) {
                $menitawal = $menitawal + '190';
            } else if ((int)$countNoAntrian == 21) {
                $menitawal = $menitawal + '200';
            } else if ((int)$countNoAntrian == 22) {
                $menitawal = $menitawal + '210';
            } else if ((int)$countNoAntrian == 23) {
                $menitawal = $menitawal + '220';
            } else if ((int)$countNoAntrian == 23) {
                $menitawal = $menitawal + '230';
            } else if ((int)$countNoAntrian == 24) {
                $menitawal = $menitawal + '241';
            } else if ((int)$countNoAntrian == 25) {
                $menitawal = $menitawal + '250';
            } else if ((int)$countNoAntrian == 26) {
                $menitawal = $menitawal + '260';
            } else if ((int)$countNoAntrian == 27) {
                $menitawal = $menitawal + '270';
            } else if ((int)$countNoAntrian == 28) {
                $menitawal = $menitawal + '280';
            } else if ((int)$countNoAntrian == 29) {
                $menitawal = $menitawal + '290';
            } else if ((int)$countNoAntrian == 30) {
                $menitawal = $menitawal + '301';
            } else {
                $menitawal = $menitawal + '310';
            }

            if ($menitawal > 60) {
                if ($menitawal > 120) {
                    if ($menitawal > 180) {
                        if ($menitawal > 240) {
                            if ($menitawal > 300) {
                                $menitawal = $menitawal - 300;
                                $jamawal = $jamawal + 5;
                            } else {
                                $menitawal = $menitawal - 240;
                                $jamawal = $jamawal + 4;
                            }
                        } else {
                            $menitawal = $menitawal - 180;
                            $jamawal = $jamawal + 3;
                        }
                    } else {
                        $menitawal = $menitawal - 120;
                        $jamawal = $jamawal + 2;
                    }
                } else {
                    $menitawal = $menitawal - 60;
                    $jamawal = $jamawal + 1;
                }
            }

            date_default_timezone_set("Asia/Jakarta");
            $timewaktu = strtotime(date($tanggal . ' ' . $jamawal . ':' . $menitawal)) * 1000;
            $dataAntrianPost = array(
                'nomorantrean' => $dokter . '-' . $dataDisimpan['noAntrianJam'], //$dataAntrianDipanggil,
                'angkaantrean' => (int)$dataDisimpan['noAntrianJam'], //(int)$dataAntrianDipanggilAngka,
                'kodebooking' =>  $dataDisimpan['noreservasi'], // $noreservasi,
                'norm' => (string)$dataDisimpan['nocm'],
                'namapoli' => $dataRuangan,
                'namadokter' => $namadokter,
                'estimasidilayani' =>  (int)$timewaktu, //$dataJmlSisaAntrianDipanggil ,
                'sisakuotajkn' => (int)$kapasitaspasien -  (int)$countNoAntrian, //(int)$dataAntrianDipanggilAngka,
                'kuotajkn' => (int)$kapasitaspasien,
                'sisakuotanonjkn' => (int)$dataSlotingNonJkn - (int)$jmlSudahDaftarNonJKN,
                'kuotanonjkn' => $dataSlotingNonJkn,
                'keterangan' => "Datang Minimal 30 menit sebelum estimasi dilayani"
            );


            $status = true;
            $respon  = $dataAntrianPost;
            $message = array(
                'message' => 'Ok',
                'code' => 202,
            );
            if ($status == false) {
                $result = array(
                    'metadata' => $message,
                );
            } else {
                $result = array(
                    'response' => $respon,
                    'metadata' => $message,
                );
            }
            $result = array( 
                'metadata' => $message,
            );
        }

        return $this->respond($result);
    }

    public function GetAntrianMjkn(Request $request)
    {
        $kodePoli = $request['kodepoli'];
        $kodeDokter = $request['kodedokter'];
        $tanggal = $request['tanggalperiksa'];
        $nomorkartu = $request['nomorkartu'];
        $nomorreferensi = $request['nomorreferensi'];
        $norm = $request['norm'];
        $nik = $request['nik'];
        $nohp = $request['nohp'];
        $jeniskunjungan = $request['jeniskunjungan'];
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $timewaktu = time('08:00') . "000";
        // $timewaktu = $tStamp."000"; 
        // return((int)$timewaktu);
        // die();
        Pasien::where('id', 2)->update(
            [
                'alamatdokterpengirim' => $nomorkartu
            ]
        );

        $status = false;
        $tglFormat = $this->date_extract_format($tanggal);
        $iddataRuangan = "";
        $noreservasi = "";
        $idDokter = "";
        $jampraktek = $request['jampraktek'];


        if ($tanggal > date('Y-m-d')) {

            if ($tglFormat == 'Y-m-d') {
                $tglLibur = DB::select(DB::raw(" 
                SELECT         (CASE WHEN DATENAME(dw, '$tanggal') = 'Sunday' THEN 'Minggu' WHEN DATENAME(dw,'$tanggal') 
                            = 'Monday' THEN 'Senin' WHEN DATENAME(dw, '$tanggal') = 'Tuesday' THEN 'Selasa' WHEN DATENAME(dw, '$tanggal') = 'Wednesday' THEN 'Rabu' WHEN DATENAME(dw, '$tanggal') 
                            = 'Thursday' THEN 'Kamis' WHEN DATENAME(dw, '$tanggal') = 'Friday' THEN 'Jumat' ELSE 'Sabtu' END) AS namahari, (CASE WHEN DATENAME(dw, '$tanggal') = 'Sunday' THEN '8' WHEN DATENAME(dw, '$tanggal') 
                            = 'Monday' THEN '1' WHEN DATENAME(dw, '$tanggal') = 'Tuesday' THEN '2' WHEN DATENAME(dw, '$tanggal') = 'Wednesday' THEN '3' WHEN DATENAME(dw, '$tanggal') 
                            = 'Thursday' THEN '4' WHEN DATENAME(dw, '$tanggal') = 'Friday' THEN '5' ELSE '6' END) AS hari
                            "));
                // return($tglLibur);
                // die;
                foreach ($tglLibur as $tglLibur1) {
                    // return($tglLibur1->hari);
                    // die;
                    if ($tglLibur1->hari > 5) {
                        $message = array(
                            'message' => 'Pendaftaran ke Poli Ini Sedang Tutup',
                            'code' => 201,
                        );
                        $result = array(

                            'metadata' => $message,
                        );


                        return $this->respond($result);
                    }
                }
                Pasien::where('id', 2)->update(
                    [
                        'alamatdokterpengirim' => $norm
                    ]
                );
                $dataPasienUse = DB::select(DB::raw(" 
                            select * from pasien_m where nocm='$norm' 
                                        "));
                if (!empty($dataPasienUse)) {
                    if ($tanggal == $request['tanggalperiksa'])
                        // if(!empty($datalogin)){
                        $dataRuangan = DB::select(DB::raw(" 
                            select top 1 namaruangan,kodeexternal from ruangankiosk_m where kdinternal ='$kodePoli'
                                    "));
                    foreach ($dataRuangan as $paramRuangan) {
                        $dataRuangan = $paramRuangan->namaruangan;
                        $iddataRuangan = $paramRuangan->kodeexternal;
                    }
                    $datakartu = array('nokartu' => $nomorkartu, 'tglsep' => $tanggal);
                    // $cekKepersertaan=$this->getNoPesertaPrivate($datakartu); 

                    // return( $cekKepersertaan);
                    // die;
                    // foreach(json_encode($cekKepersertaan) as $itil){
                    //     return( $itil);
                    //     die;
                    // }

                    // if($cekKepersertaan['status'] == 400)
                    // {
                    //     $message = array(
                    //         'message' => $dataDisimpan['message'],
                    //         'code' => 201,
                    //     );
                    //     $result = array(

                    //         'metadata' => $message,
                    //     );


                    //     return $this->respond($result);
                    // }

                    // if((int)strpbrk($jampraktek,15) >= 11)
                    if (date('H') >= 22) {

                        $message = array(
                            'message' => 'Pendaftaran ke Poli' . $dataRuangan . ' Tidak Boleh Diatas Jam  12:00',
                            'code' => 201,
                        );
                        $result = array(

                            'metadata' => $message,
                        );


                        return $this->respond($result);
                    }
                    $dokter = DB::select(DB::raw(" 
                            SELECT  namahafis,id  FROM pegawai_m where idhafis='$kodeDokter'
                                    "));
                    if (!empty($dokter)) {
                        foreach ($dokter as $paramRuangan) {
                            $dokter = $paramRuangan->namahafis;
                            $idDokter = $paramRuangan->id;
                        }
                    } else {
                        $message = array(
                            'message' => 'Dokter Tidak Ditemukan',
                            'code' => 201,
                        );
                        $result = array(

                            'metadata' => $message,
                        );


                        return $this->respond($result);
                    }
                    $dataJdwDokter = DB::select(DB::raw("select * from v_jadwalDokterApiJkn where idhafis=' $kodeDokter' and format(tanggaljadwal,'yyyy-MM-dd') ='$tanggal'
                            "));
                    // return( $dataJdwDokter);
                    // die;
                    // if(empty($dataJdwDokter))
                    // {   
                    //     $message = array(
                    //         'message' => 'Jadwal Dokter  '.$dokter.'    Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya',
                    //         'code' => 201,
                    //     );
                    //     $result = array(

                    //         'metadata' => $message,
                    //     );


                    //     return $this->respond($result);

                    // }
                    // ini di komen jadwal dokternya


                    if (!empty($dataRuangan)) {
                        $gotoSimpan = array(
                            'tglReservasiFix' => $tanggal,
                            'poliKlinik' => $iddataRuangan,
                            'nomorkartu' => $nomorkartu,
                            'nomorreferensi' => $nomorreferensi,
                            'nik' => $nik,
                            'noCm' => $norm,
                            'noTelpon' => $nohp,
                            'asalRujukan' => $jeniskunjungan,
                            'dokter' => $idDokter
                        );
                        // return($gotoSimpan );
                        // die;
                        // $dataDisimpan=[];

                        $dataDisimpan = $this->saveReservasi($gotoSimpan);

                        // $a = $dataDisimpan;
                        // $dataDisimpan = json_encode($dataDisimpan);
                        // return($dataDisimpan);
                        // die;
                        if ($dataDisimpan['status'] == 400) {
                            $message = array(
                                'message' => $dataDisimpan['message'],
                                'code' => 201,
                            );
                            $result = array(

                                'metadata' => $message,
                            );


                            return $this->respond($result);
                        }
                        // foreach($dataDisimpan as $a){
                        //     return($a);
                        //     die();
                        // }


                        $dataSlotingJkn = DB::select(DB::raw("SELECT slottingonline_m.quota
                                                                        FROM            slottingonline_m INNER JOIN
                                                                                                    ruangan_m ON slottingonline_m.objectruanganfk = ruangan_m.id
                                                                        where ruangan_m.kodeexternal ='$kodePoli' and slottingonline_m.status='1' and slottingonline_m.statusenabled=true limit 1"));

                        if (!empty($dataSlotingJkn)) {
                            foreach ($dataSlotingJkn as $paramSlot) {
                                $dataSlotingJkn = $paramSlot->quota;
                            }
                        } else {

                            $dataSlotingJkn = 50;
                        }
                        $dataSlotingNonJkn = DB::select(DB::raw("SELECT slottingonline_m.quota
                                    FROM            slottingonline_m INNER JOIN
                                                                ruangan_m ON slottingonline_m.objectruanganfk = ruangan_m.id
                                    where ruangan_m.kodeexternal ='$kodePoli' and slottingonline_m.status='2' and slottingonline_m.statusenabled=true limit 1"));
                        if (!empty($dataSlotingNonJkn)) {
                            foreach ($dataSlotingNonJkn as $paramSlot) {
                                $dataSlotingNonJkn = $paramSlot->quota;
                            }
                        } else {
                            $dataSlotingNonJkn = 100;
                        }
                        $dataAntrianDipanggil = DB::select(DB::raw("select jenis + '-' +  noantrian as antreanpanggil,noantrian,noreservasi from antrianpasienregistrasi_t WHERE jenis ='B' and format(tanggalreservasi,'yyyy-MM-dd')='$tanggal' limit 1  order by noantrian desc"));
                        if (!empty($dataAntrianDipanggil)) {
                            foreach ($dataAntrianDipanggil as $paramSlot) {
                                if ($paramSlot->noantrian != 0) {
                                    $dataAntrianDipanggil = $paramSlot->antreanpanggil;
                                    $dataAntrianDipanggilAngka = $paramSlot->noantrian;
                                    $noreservasi = $paramSlot->noreservasi;
                                } else {
                                    $dataAntrianDipanggil = 1;
                                    $dataAntrianDipanggilAngka = 1;
                                }
                            }
                        } else {
                            $dataAntrianDipanggil = "B-01";
                            $dataAntrianDipanggilAngka = 1;
                        }
                        $dataJmlSisaAntrianDipanggil = DB::select(DB::raw("select count(*) as jml from antrianpasienregistrasi_t WHERE jenis ='B' and tanggalreservasi='$tanggal' and statuspanggil=2 "));
                        if (!empty($dataJmlSisaAntrianDipanggil)) {

                            foreach ($dataJmlSisaAntrianDipanggil as $paramSlot) {

                                $dataJmlSisaAntrianDipanggil = $paramSlot->jml;
                            }
                        } else {
                            $dataJmlSisaAntrianDipanggil = 1;
                        }

                        $dataJmlAntrianDipanggil = DB::select(DB::raw("select count(*) as jml from antrianpasienregistrasi_t WHERE jenis ='B' and tanggalreservasi='$tanggal'  "));
                        if (!empty($dataJmlAntrianDipanggil)) {
                            foreach ($dataJmlAntrianDipanggil as $paramSlot) {
                                if ($paramSlot->jml != 0) {
                                    $dataJmlAntrianDipanggil = $paramSlot->jml;
                                } else {
                                    $dataJmlAntrianDipanggil = 1;
                                }
                            }
                        } else {
                            $dataJmlAntrianDipanggil = 1;
                        }

                        $dataJmlAntrianDipanggilNonJkn = DB::select(DB::raw("select count(*) as jml from antrianpasienregistrasi_t WHERE jenis ='A' and tanggalreservasi='$tanggal'  "));
                        foreach ($dataJmlAntrianDipanggilNonJkn as $paramSlot) {
                            $dataJmlAntrianDipanggilNonJkn = $paramSlot->jml;
                        }
                        // return($dataAntrianDipanggilAngka);
                        // die;
                        $dataAntrianPost = array(
                            'nomorantrean' => $dataAntrianDipanggil,
                            'angkaantrean' => (int)$dataAntrianDipanggilAngka,
                            'kodebooking' =>   $noreservasi,
                            'norm' => $norm,
                            'namapoli' => $dataRuangan,
                            'namadokter' =>    $dokter,
                            'estimasidilayani' =>  (int)$timewaktu, //$dataJmlSisaAntrianDipanggil ,
                            'sisakuotajkn' => (int)$dataSlotingJkn -  (int)$dataAntrianDipanggilAngka,
                            'kuotajkn' => (int)$dataSlotingJkn,
                            'sisakuotanonjkn' => (int)$dataSlotingNonJkn,
                            'kuotanonjkn' => $dataSlotingNonJkn,
                            'keterangan' => "Datang Minimal 30 menit sebelum estimasi dilayani",
                        );


                        $status = true;
                        $respon  = $dataAntrianPost;
                        $message = array(
                            'message' => 'ok',
                            'code' => 200,
                        );
                    } else {
                        $message = array(
                            'message' => 'Poli Tidak Ditemukan',
                            'code' => 201,
                        );
                    }
                    // }else
                    // {
                    //     $message = array(
                    //         'message' => 'User Tidak Ditemukan',
                    //         'code' => 201,
                    //     );
                    // }
                    if ($status == false) {
                        $result = array(

                            'metadata' => $message,
                        );
                    } else {
                        $result = array(
                            'response' => $respon,
                            'metadata' => $message,
                        );
                    }
                } else {
                    $message = array(
                        'message' => 'Data pasien ini tidak ditemukan, silahkan Melakukan Registrasi Pasien Baru',
                        'code' => 202,
                    );
                    $result = array(

                        'metadata' => $message,
                    );
                }
            } else {
                $message = array(
                    'message' => 'Format Tanggal Tidak Sesuai, format yang benar adalah yyyy-mm-dd',
                    'code' => 201,
                );
                $result = array(

                    'metadata' => $message,
                );
            }
        } else {
            // $message = array(
            //     'message' => 'Tanggal Periksa Tidak Berlaku  minimal + 1 hari dari tanggal sekarang',
            //     'code' => 201,
            // );
            $result = array(

                'metadata' => $message,
            );
        }

        return $this->respond($result);
    }
    public function UpdateAntrianRSjadwaldokter(Request $request)
    {
        // return( json_encode($request['data']));
        // die;
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "jadwaldokter/updatejadwaldokter",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function TambahAntreanApiJkn(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        // return($request['data']);
        // die();
        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "antrean/add",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        // $key=$data.$secretKey.(string)$tStamp;
        // return $this->respond($this->stringDecrypt($key,$result));
        return $this->respond($result);
    }
    public function UpdateAntreanApiJkn(Request $request)
    {

        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…


        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "antrean/updatewaktu",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecrypt($key, $result));
        return $this->respond($result);
    }
    public function BatalAntreanApiJkn(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "antrean/batal",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function WaktuTaskId(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "antrean/getlisttask",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        return($response);
        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecrypt($key, $result));
        return $this->respond($result);
    }
    public function UpdateWaktuTaskId(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        $curl = curl_init();
        $dataJsonSend = json_encode($request['data']);
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "antrean/updatewaktu",
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $statusCode = json_decode(json_encode($result["metadata"]->code), true);
        if ($request['data']['taskid'] == 3) {
            PasienDaftar::where('statusschedule', $request['data']['kodebooking'])
                ->whereNull('istaskantrol')
                ->update([
                    'istaskantrol' => $request['data']['taskid']
                ]);
        } else {
            PasienDaftar::where('statusschedule', $request['data']['kodebooking'])
                ->where('istaskantrol', '<', $request['data']['taskid'])
                ->update([
                    'istaskantrol' => $request['data']['taskid']
                ]);
        }

        if ($statusCode == 200) {
            $statusMessage = json_decode(json_encode($result["metadata"]->message), true);
            // PasienDaftar::where('statusschedule',$request['data']['kodebooking'])
            // ->where('istaskantrol','<',$request['data']['taskid'])
            // ->update([
            //           'istaskantrol' => $request['data']['taskid']]);
            $new = new SendTaskAntrol();
            $new->norec =  $new->generateNewId();
            $new->noreservasi = $request['data']['kodebooking'];
            $new->taskid = $request['data']['taskid'];
            date_default_timezone_set("Asia/Jakarta");
            $new->tglinsert = date('Y-m-d H:i:s');
            $new->response = $statusMessage;
            $new->save();
        } else {
            $new = new SendTaskAntrol();
            $new->norec =  $new->generateNewId();
            $new->noreservasi = $request['data']['kodebooking'];
            $new->taskid = $request['data']['taskid'];
            date_default_timezone_set("Asia/Jakarta");
            $new->tglinsert = date('Y-m-d H:i:s');
            $new->response = $response;
            $new->save();
        }


        return $this->respond($result);
    }
    public function mjknRefPoli(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            // CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."RencanaKontrol/ListRencanaKontrol/tglAwal/".$request['tglAwal']."/tglAkhir/".$request['tglAkhir']."/filter/".$request['jenis'],
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "ref/poli",
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
                "X-cons-id: " .  $data,
                "X-timestamp: " . (string)$tStamp,
                "X-signature: " . (string)$encodedSignature,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecrypt($key, $result));
        return $this->respond($result);
    }
    public function mjknRefDokter(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            // CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."RencanaKontrol/ListRencanaKontrol/tglAwal/".$request['tglAwal']."/tglAkhir/".$request['tglAkhir']."/filter/".$request['jenis'],
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "ref/dokter",
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
                "X-cons-id: " .  $data,
                "X-timestamp: " . (string)$tStamp,
                "X-signature: " . (string)$encodedSignature,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecrypt($key, $result));
        return $this->respond($result);
    }
    public function AntrianRSjadwaldokter(Request $request)
    {
        // return($request['kodepoli']);
        // die();
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            // CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."RencanaKontrol/ListRencanaKontrol/tglAwal/".$request['tglAwal']."/tglAkhir/".$request['tglAkhir']."/filter/".$request['jenis'],
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "jadwaldokter/kodepoli/" . $request['kodepoli'] . "/tanggal/" . $request['tanggal'],
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
                "X-cons-id: " .  $data,
                "X-timestamp: " . (string)$tStamp,
                "X-signature: " . (string)$encodedSignature,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        if ($result['metadata']->code == 201) {
            $data2 = array(
                'status' => 'ok',
                'metaData' => $result['metadata']
            );
            return $this->respond($data2);
        }
        $key = $data . $secretKey . (string)$tStamp;
        return $this->respond($this->stringDecrypt($key, $result));
        return $this->respond($result);
    }
    public function DashboardPerTgl(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        $encodedSignature = base64_encode($signature);
        // return($request['tanggal']);
        // die();
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            // CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."RencanaKontrol/ListRencanaKontrol/tglAwal/".$request['tglAwal']."/tglAkhir/".$request['tglAkhir']."/filter/".$request['jenis'],
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "dashboard/waktutunggu/tanggal/" . $request['tanggal'] . "/waktu/" . $request['waktu'],
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
                "X-cons-id: " .  $data,
                "X-timestamp: " . (string)$tStamp,
                "X-signature: " . (string)$encodedSignature,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            return ($response);
            die;
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function DashboardPerBln(Request $request)
    {
        $data = $this->getIdConsumerAntrol();
        $secretKey = $this->getPasswordConsumerAntrol();
        $userKey = $this->getUserKeyAntrol();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);
        $encodedSignature = base64_encode($signature);
        // return($request['bulan']);
        // die();
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            // CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."RencanaKontrol/ListRencanaKontrol/tglAwal/".$request['tglAwal']."/tglAkhir/".$request['tglAkhir']."/filter/".$request['jenis'],
            CURLOPT_URL => $this->getUrlBrigdingAntrol() . "dashboard/waktutunggu/bulan/" . $request['bulan'] . "/tahun/" . $request['tahun'] . "/waktu/" . $request['waktu'],
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
                "X-cons-id: " .  $data,
                "X-timestamp: " . (string)$tStamp,
                "X-signature: " . (string)$encodedSignature,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            return ($response);
            die;
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function GetSisaAntrianMjknAles(Request $request)
    {
        $status = "";
        $kdbooking = $request['kodebooking'];
        $nomorantrean = "";
        $namapoli = "";
        $namadokter = "";
        $sisaantrean = "";
        $antreanpanggil = "";
        $waktutunggu = "";
        $keterangan = "";
        $tanggal = "";
        $statusAnrian = "";
        $koderuangan = "";
        // date_default_timezone_set('UTC');
        // $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));



        $dataSlotingJkn = DB::select(DB::raw("select apd.namahafis || '-' || apd.noantrian as noantrianpoli,
                        rk.namaruangan AS namapoli,pg.nama as namadokter,apd.namahafis from pasiendaftar_t as pd 
                        join antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk and pd.objectruanganlastfk=apd.objectruanganfk
                        join ruangankiosk_m as rk on apd.objectruanganfk::varchar=rk.kodeexternal
                        join pegawai_m as pg on pg.namahafis=apd.namahafis
                        where pd.statusschedule='$kdbooking'
                        and pd.statusenabled = true limit 1"));

        if (!empty($dataSlotingJkn)) {
            foreach ($dataSlotingJkn as $paramSlot) {
                $nomorantrean = $paramSlot->noantrianpoli;
                $namapoli = $paramSlot->namapoli;
                $namadokter = $paramSlot->namadokter;
                $namahafis = $paramSlot->namahafis;
            }
            $dataTask3 = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd 
                        join antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk and pd.objectruanganlastfk=apd.objectruanganfk
                        join ruangankiosk_m as rk on apd.objectruanganfk::varchar=rk.kodeexternal
                        join pegawai_m as pg on pg.namahafis=apd.namahafis
                        join antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule
                        where apd.namahafis='$namahafis' and apr.tglcekinjkn is not null 
                        and pd.statusenabled = true limit 1"));
            foreach ($dataTask3 as $paramSlot) {
                $dataTask3 = $paramSlot->jml;
            }

            $dataTask4 = DB::select(DB::raw("select apd.namahafis || '-' || apd.noantrian as noantrianpoli,
                        apd.noantrian from pasiendaftar_t as pd 
                        join antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk and pd.objectruanganlastfk=apd.objectruanganfk
                        join ruangankiosk_m as rk on apd.objectruanganfk::varchar=rk.kodeexternal
                        join pegawai_m as pg on pg.namahafis=apd.namahafis
                        join antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule
                        where apd.namahafis='$namahafis' and apr.tglcekinjkn is not null and pd.istaskantrol=4
                        and pd.statusenabled = true order by apd.noantrian desc limit 1"));
            if (!empty($dataTask4)) {
                foreach ($dataTask4 as $paramSlot) {
                    $dataTask4 = $paramSlot->noantrianpoli;
                    $estimasidilayani = 1800 * ((int)$paramSlot->noantrian - 1);
                }
            } else {
                $dataTask4 = 0;
                $estimasidilayani = 1800 * 1;
            }

            $dataAntrianPost = array(
                'nomorantrean' => $nomorantrean,
                'namapoli' => $namapoli,
                'namadokter' =>  $namadokter,
                'sisaantrean' =>  (float)$dataTask3,
                'antreanpanggil' => (string)$dataTask4,
                'waktutunggu' => $estimasidilayani,
                'keterangan' => "sisa antrean",

            );

            $respon  = $dataAntrianPost;
            $message = array(
                'message' => 'ok',
                'code' => '200',
            );

            $result = array(
                'response' => $respon,
                'metadata' => $message,
            );
        } else {
            $message = array(
                'message' => 'status panggil Kode Boking kosong Data Tidak Ditemukan',
                'code' => 201,
            );
            $result = array(
                'metadata' => $message,
            );
        }


        return $this->respond($result);
    }
    public function GetSisaAntrianMjkn(Request $request)
    {
        $status = "";
        $kdbooking = $request['kodebooking'];
        $nomorantrean = "";
        $namapoli = "";
        $namadokter = "";
        $sisaantrean = "";
        $antreanpanggil = "";
        $waktutunggu = "";
        $keterangan = "";
        $tanggal = "";
        $statusAnrian = "";
        $koderuangan = "";
        // date_default_timezone_set('UTC');
        // $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));



        $dataSlotingJkn = DB::select(DB::raw("SELECT antrianpasienregistrasi_t.statuspanggil, antrianpasienregistrasi_t.statusenabled ,
               antrianpasienregistrasi_t.jenis || '-' || antrianpasienregistrasi_t.noantrian::char as noantrian,
               antrianpasienregistrasi_t.noreservasi AS nobooking, ruangankiosk_m.namaruangan AS namapoli, pegawai_m.namahafis AS namadokter,
               to_char(antrianpasienregistrasi_t.tanggalreservasi,'yyyy-MM-dd') as tanggalreservasi,antrianpasienregistrasi_t.keterangan,
               ruangankiosk_m.kodeexternal
               FROM            antrianpasienregistrasi_t FULL OUTER JOIN
                                        pegawai_m ON antrianpasienregistrasi_t.objectpegawaifk = pegawai_m.id FULL OUTER JOIN
                                        ruangankiosk_m ON antrianpasienregistrasi_t.objectruanganfk::varchar = ruangankiosk_m.kodeexternal
               WHERE        antrianpasienregistrasi_t.noreservasi ='$kdbooking' and antrianpasienregistrasi_t.statusenabled = true limit 1"));

        if (!empty($dataSlotingJkn)) {
            foreach ($dataSlotingJkn as $paramSlot) {
                $nomorantrean = $paramSlot->noantrian;
                $namapoli = $paramSlot->namapoli;
                $namadokter = $paramSlot->namadokter;
                $waktutunggu = $paramSlot->noantrian;
                $tStamp = $timewaktu = strtotime($paramSlot->tanggalreservasi) * 1000; //strval(time($paramSlot->tanggalreservasi)-strtotime('1970-01-01 00:00:00'));
                $tanggal = $paramSlot->tanggalreservasi;
                $keterangan = $paramSlot->keterangan;
                $statusAnrian = $paramSlot->statuspanggil;
                $koderuangan = $paramSlot->kodeexternal;
            }
            if ($statusAnrian <= 1) {
                $dataAntrianDipanggil = DB::select(DB::raw("select jenis || '-' || noantrian as antreanpanggil from antrianpasienregistrasi_t
                 WHERE jenis ='B' and tanggalreservasi='$tanggal'  order by noantrian desc limit 1"));
                if (!empty($dataAntrianDipanggil)) {
                    foreach ($dataAntrianDipanggil as $paramSlot) {
                        $dataAntrianDipanggil = $paramSlot->antreanpanggil;
                    }
                } else {
                    $dataAntrianDipanggil  = "B-000000";
                }

                $dataJmlSisaAntrianDipanggil = DB::select(DB::raw("select count(apd.noantrian) as jml from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                                    pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                                    apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                                    where pd.objectruanganlastfk='$koderuangan' and pd.statusschedule is not null and pd.statusenabled=true
                                    and apr.istaskantrol is not null and apr.tanggalreservasi='$tanggal'"));
                foreach ($dataJmlSisaAntrianDipanggil as $paramSlot) {
                    $dataJmlSisaAntrianDipanggil = $paramSlot->jml;
                }
                $dataJmlAntrianDipanggil = DB::select(DB::raw("select apr.jenis || '-' || apd.noantrian::char as noantrian,apd.noantrian as nomer
                     from pasiendaftar_t as pd join antrianpasienregistrasi_t as apr ON
                                    pd.statusschedule=apr.noreservasi join antrianpasiendiperiksa_t as apd ON
                                    apd.noregistrasifk=pd.norec and apd.objectruanganfk=pd.objectruanganlastfk
                                    where pd.objectruanganlastfk='$koderuangan' and pd.statusschedule is not null and pd.statusenabled=true
                                    and apr.tanggalreservasi='$tanggal' and apr.istaskantrol=3 order by apd.noantrian desc limit 1"));
                if (!empty($dataJmlAntrianDipanggil)) {
                    foreach ($dataJmlAntrianDipanggil as $paramSlot) {
                        $dataJmlAntrianDipanggil = $paramSlot->noantrian;
                        $estimasidilayani = 1800 * ((int)$paramSlot->nomer - 1);
                    }
                } else {
                    $dataJmlAntrianDipanggil = 0;
                    $estimasidilayani = 1800 * 1;
                }


                $dataAntrianPost = array(
                    'nomorantrean' => $nomorantrean,
                    'namapoli' => $namapoli,
                    'namadokter' =>  $namadokter,
                    'sisaantrean' =>  $dataJmlSisaAntrianDipanggil,
                    'antreanpanggil' => $dataJmlAntrianDipanggil,
                    'waktutunggu' => $estimasidilayani,
                    'keterangan' => "sisa antrean",

                );


                $status = "A";
                $respon  = $dataAntrianPost;
                $message = array(
                    'message' => 'ok',
                    'code' => '200',
                );

                if ($status == "A") {
                    $result = array(
                        'response' => $respon,
                        'metadata' => $message,
                    );
                } else {
                    $result = array(
                        'metadata' => $message,
                    );
                }
            } else {
                $message = array(
                    'message' => 'status panggil kosong Data Tidak Ditemukan',
                    'code' => 201,
                );
                $result = array(
                    'metadata' => $message,
                );
            }
        } else {
            $message = array(
                'message' => 'status panggil Kode Boking kosong Data Tidak Ditemukan',
                'code' => 201,
            );
            $result = array(
                'metadata' => $message,
            );
        }


        return $this->respond($result);
    }
    public function BatalAntrianMjkn(Request $request)
    {
        $kdbooking = $request['kodebooking'];
        $keterangan = $request['keterangan'];
        // return($request['data']['kodebooking']);
        // die();


        $dataSlotingJkn = DB::select(DB::raw("select pd.norec,pd.istaskantrol,pd.statusenabled from pasiendaftar_t as pd 
                        join antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk and pd.objectruanganlastfk=apd.objectruanganfk
                        join ruangankiosk_m as rk on apd.objectruanganfk::varchar=rk.kodeexternal
                        join pegawai_m as pg on pg.namahafis=apd.namahafis
                        where pd.statusschedule='$kdbooking'
                        and pd.statusenabled = true limit 1"));

        if (!empty($dataSlotingJkn)) {


            foreach ($dataSlotingJkn as $paramSlot) {
                $noregitrasifk = $paramSlot->norec;
                $istaskantrol = $paramSlot->istaskantrol;
                $statusenabled = $paramSlot->statusenabled;
            }
            if ($istaskantrol != null) {
                $message = array(
                    'message' => 'Pasien Sudah Dilayani, Antrean Tidak Dapat Dibatalkan',
                    'code' => 201,
                );
            } elseif ($statusenabled == 0) {
                $message = array(
                    'message' => 'Pasien Sudah Di batalkan',
                    'code' => 201,
                );
            } else {
                $newBR = new BatalRegistrasi();
                $norec = $newBR->generateNewId();
                $newBR->norec = $norec;
                $newBR->kdprofile = 0;
                $newBR->statusenabled = true;
                $newBR->alasanpembatalan = $keterangan;
                $newBR->pasiendaftarfk = $noregitrasifk;
                // $newBR->pegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
                $newBR->pembatalanfk = 1;
                $newBR->tanggalpembatalan = date('Y-m-d H:i:s');
                $newBR->save();

                $data2 = PasienDaftar::where('norec', $noregitrasifk)
                    ->update([
                        'kdprofile' => 0,
                        'statusenabled' => false
                    ]);
                AntrianPasienDiperiksa::where('noregistrasifk', $noregitrasifk)
                    ->update([
                        'statusenabled' => false,
                        'tglkeluar' => date('Y-m-d H:i:s'),
                    ]);
                $data2 = AntrianPasienRegistrasi::where('noreservasi', $kdbooking)
                    ->update([
                        'statusenabled' => false
                    ]);

                $message = array(
                    'message' => 'ok',
                    'code' => 200,
                );
            }
        } else {
            $message = array(
                'message' => 'Antrean Tidak Ditemukan',
                'code' => 201,
            );
        }

        $result = array(
            'metadata' => $message,
        );
        return $this->respond($result);
    }
    public function GetJadwalOprasiSatu(Request $request)
    {
        $nopeserta = $request['nopeserta'];
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $saha = false;

        if (strlen($nopeserta) != 13) {
            $message = array(
                'message' => 'Format Nomor Kartu Tidak Sesuai',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }

        $data = DB::select(DB::raw("select kodebooking,to_char(tanggaloperasi,'yyyy-MM-dd') as tanggaloperasi,jenistindakan,kodepoli,namapoli,
               CASE WHEN terlaksana=TRUE then '1' else '0' end as terlaksana,nopeserta,lastupdate||'000' as lastupdate  from jadwaloperasijkn_t WHERE nopeserta='$nopeserta' "));


        if (!empty($data)) {
            $data2 = [];
            foreach ($data as $item) {
                $data2[] = array(
                    'kodebooking' => $item->kodebooking,
                    'tanggaloperasi' => $item->tanggaloperasi,
                    'jenistindakan' => $item->jenistindakan,
                    'kodepoli' => $item->kodepoli,
                    'namapoli' => $item->namapoli,
                    'terlaksana' => (float)$item->terlaksana,
                    'nopeserta' => $item->nopeserta,
                    'lastupdate' => (float)$item->lastupdate,
                );
            };
            $saha = true;
            $respon  =  $data2;
            $message = array(
                'message' => 'ok',
                'code' => '200',
            );
        } else {
            $message = array(
                'message' => 'tidak ditemukan',
                'code' => '202',
            );
        }

        // return($dataAntrianPost);
        // die;

        if ($saha == true) {
            $result = array(
                'response' => array(
                    'list' => $respon
                ),
                'metadata' => $message,
            );
        } else {
            $result = array(

                'metadata' => $message,
            );
        }
        return $this->respond($result);
    }
    public function GetJadwalOprasiAll(Request $request)
    {
        // return($request['tanggalawal'].' '.'00:00:00');
        // die;

        $tglawal = ($request['tanggalawal'] . ' ' . '00:00:00');
        $tglakhir = ($request['tanggalakhir'] . ' ' . '23:59:59');
        // $tglawal=date_format($tglawal,"Y-m-d 00:00:00");
        // $tglakhir=date_format($tglakhir,"Y-m-d 23:59:59");
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $status = "";
        $respon = [];

        //   
        //    $data = DB::select(DB::raw("select kodebooking,format(tanggaloperasi,'yyyy-MM-dd') as tanggaloperasi,jenistindakan,kodepoli,namapoli,terlaksana,nopeserta,lastupdate from jadwaloperasijkn_t WHERE tanggaloperasi between '$tglawal' and '$tglakhir'"));
        $data = DB::select(DB::raw("select kodebooking,to_char(tanggaloperasi,'yyyy-MM-dd') as tanggaloperasi,jenistindakan,kodepoli,namapoli,
            CASE WHEN terlaksana=TRUE then '1' else '0' end as terlaksana,nopeserta,lastupdate||'000' as lastupdate from jadwaloperasijkn_t WHERE statusenabled=true and tanggaloperasi between '$tglawal' and '$tglakhir'"));


        if (!empty($data)) {
            $data2 = [];
            foreach ($data as $item) {
                $data2[] = array(
                    'kodebooking' => $item->kodebooking,
                    'tanggaloperasi' => $item->tanggaloperasi,
                    'jenistindakan' => $item->jenistindakan,
                    'kodepoli' => $item->kodepoli,
                    'namapoli' => $item->namapoli,
                    'terlaksana' => (float)$item->terlaksana,
                    'nopeserta' => $item->nopeserta,
                    'lastupdate' => (float)$item->lastupdate,
                );
            };
            $status = "A";
            $respon  = $data2;
            $message = array(
                'message' => 'ok',
                'code' => '200',
            );
        } else {
            $status = "B";
            $message = array(
                'message' => 'tidak ditemukan',
                'code' => '200',
            );
        }



        if ($status == "A") {

            $result = array(
                'response' => array(
                    'list' => $respon
                ),
                'metadata' => $message,
            );
        } else {
            $result = array(
                'metadata' => $message,
            );
        }

        return $this->respond($result);
    }
    public function SavePasienMjkn(Request $request)
    {
        // $token = $request['x-token'];
        // $message =array(  'message' => 'Gagal, Tidak ada data. Hanya berlaku untuk pasien lama, pasien baru silahkan berkunjung ke RSB Cianjur terlebih dahulu',
        //     'code' => 201,);
        //         $result = array(

        //             'metadata' => $message
        //         );

        // return $this->respond($result);

        //save log mjkn
        $logmjkn = new MjknLog();
        $logmjkn->norec = $logmjkn->generateNewId();
        $logmjkn->type = 'savepasien';
        $logmjkn->data = $request;
        $logmjkn->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
        $logmjkn->save();
        //-----------------------

        $nomorkartu = $request['nomorkartu'];
        $nik = $request['nik'];
        $nama = $request['nama'];
        $jeniskelamin = $request['jeniskelamin'];
        $jeniskelamin1 = $request['jeniskelamin'];
        $tanggallahir = $request['tanggallahir'];
        $nohp = $request['nohp'];
        $alamat = $request['alamat'];
        $alamat1 = $request['alamat'];
        $kodeprop = $request['kodeprop'];
        $namaprop = $request['namaprop'];
        $kodedati2 = $request['kodedati2'];
        $namadati2 = $request['namadati2'];
        $kodekec = $request['kodekec'];
        $namakec = $request['namakec'];
        $kodekel = $request['kodekel'];
        $namakel = $request['namakel'];
        $nomorkk = $request['nomorkk'];
        $rw = $request['rw'];
        $rt = $request['rt'];
        $tglSkrng = date('Y-m-d H:i:s');
        $alamat = $alamat . ', RW ' . $rw . '/' . $rt . ', kel. ' . $namakel . ', kec. ' . $namakec . ',Kota/kab. ' . $namadati2 . ', prov. ' . $namaprop;
        $cm = "";
        $idPsn = 0;
        $isian = "";
        if ($jeniskelamin == "L") {
            $jeniskelamin = 1;
        } else {
            $jeniskelamin = 2;
        }
        $tglFormat = $this->date_extract_format($tanggallahir);
        // return(date('Y-m-d'));
        // die;
        if ($tanggallahir > date('Y-m-d')) {
            $message = array(
                'message' => 'Format Tanggal Lahir Tidak Sesuai',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($tglFormat != 'Y-m-d') {
            $message = array(
                'message' => 'Format Tanggal Lahir Tidak Sesuai',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($rw == "") {
            $message = array(
                'message' => 'RW Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($rt == "") {
            $message = array(
                'message' => 'rt Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($kodekel == "") {
            $message = array(
                'message' => 'Kode Kelurahan Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($namakel == "") {
            $message = array(
                'message' => 'Nama Kelurahan Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($namakec == "") {
            $message = array(
                'message' => 'Nama Kecamatan Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($kodekec == "") {
            $message = array(
                'message' => 'Kode Kecamatan Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($namadati2 == "") {
            $message = array(
                'message' => 'Nama Dati2 Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($kodedati2 == "") {
            $message = array(
                'message' => 'Kode Dati2 Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($namaprop == "") {
            $message = array(
                'message' => 'Nama Propinsi Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($kodeprop == "") {
            $message = array(
                'message' => 'Kode Propinsi Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($alamat1 == "") {
            $message = array(
                'message' => 'Alamat Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($tanggallahir == "") {
            $message = array(
                'message' => 'Tanggal Lahir Belum Dipilih',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($jeniskelamin1 == "") {
            $message = array(
                'message' => 'jeniskelamin Belum Dipilih',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($nomorkartu == "") {
            $message = array(
                'message' => 'Nomor Kartu Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($nama == "") {
            $message = array(
                'message' => 'Nama Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }

        if ($nik == "") {
            $message = array(
                'message' => 'NIK Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if ($nomorkk == "") {
            $message = array(
                'message' => 'Nomor KK Belum Diisi',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if (strlen($nomorkartu) != 13) {
            $message = array(
                'message' => 'Format Nomor Kartu Tidak Sesuai',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if (strlen($nik) != 16) {

            $message = array(
                'message' => 'Format NIK Tidak Sesuai',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );

            return $this->respond($result);
        }
        if (!preg_match("/^([0-9]+)$/", $nik)) {
            $message = array(
                'message' => 'Format NIK Tidak Sesuai Harus Berikan Numeric',
                'code' => 201,
            );
            $result = array(

                'metadata' => $message
            );
            return $this->respond($result);
        }
        $idPsnAda =  DB::select(DB::raw("select * from pasien_m where nobpjs='$nomorkartu'"));
        if (!empty($idPsnAda)) {
            foreach ($idPsnAda as $asulah) {

                $message = array(
                    'message' => 'Data Sudah Terdaftar dengan norm =' . $asulah->nocm,
                    'code' => '205',
                );
                $result = array(

                    'metadata' => $message
                );

                return $this->respond($result);
            }
        }
        $idPsn =  DB::select(DB::raw("select max(id) + 1 as id from pasien_m "));
        foreach ($idPsn as $asu) {
            // return($asu->id);
            // die;
            $isian = $asu->id;
        }
        // $getcm =  DB::select(DB::raw("select top 1 nocm + 1 as id from pasien_m where nocm not like '%p%' and nocm not like '%j%' order by tgldaftar desc"));
        // foreach( $getcm as $asu){
        //     // return($asu->id);
        //     // die;
        //     if(strlen($asu->id) == 7)
        //     {
        //         $cm = '0'.$asu->id;
        //     }
        //     else{
        //         $cm = $asu->id;  
        //     }
        // }

        // $save= DB::insert(DB::raw("INSERT INTO antrianpasienregistrasi_t
        // (id, kdprofile, norec, namapasien, nocm, objectjeniskelaminfk, tgllahir, nobpjs, nohp, notelepon, noidentitas,tgldaftar)
        //  VALUES        ($isian,0,'$norec','$nama', '$cm',$jeniskelamin,'$tanggallahir','$nomorkartu','$nohp','$nohp','$nik',' $tglSkrng')"));
        // $updateRN = RunningNumber::where('id', 1745)
        //     ->update(
        //         [
        //             'nomer_terbaru' => $noCmTerakhir
        //         ]
        //     );

        $newptp = new AntrianPasienRegistrasiPasienBaruMjkn();
        $newptp->norec = $newptp->generateNewId();;
        $newptp->kdprofile = 0;
        $newptp->statusenabled = true;
        $newptp->nomorkartu = $jeniskelamin;
        $newptp->nik = $nik;
        $newptp->nomorkk = $nomorkk;
        $newptp->nama = $nama;
        $newptp->jeniskelamin = $jeniskelamin;
        $newptp->tanggallahir = $tanggallahir;
        $newptp->nohp = $nohp;
        $newptp->alamat = $alamat;
        $newptp->kodeprop = $kodeprop;
        $newptp->namaprop = $namaprop;
        $newptp->kodedati2 = $kodedati2;
        $newptp->namadati2 = $namadati2;
        $newptp->kodekec = $kodekec;
        $newptp->namakec = $namakec;
        $newptp->kodekel = $kodekel;
        $newptp->namakel = $namakel;
        $newptp->rw = $rw;
        $newptp->rt = $rt;
        DB::beginTransaction();
        try {
            $newptp->save();
            $transStatus = 'true';

            $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh" . $e;
        }


        $statusSimpan = true;
        $respon = array('norm' => "12345678");
        $message = array(
            'message' => 'ok',
            'code' => '200',
        );


        if ($statusSimpan == false) {
            $message = array(
                'message' => 'Gagal',
                'code' => 201,
            );
            $result = array(
                'metadata' => $message,
            );
        } else {

            $result = array(
                'response' => $respon,
                'metadata' => $message,
            );
        }

        return $this->respond($result);
        // $encodedSignature = base64_encode($signature);
        // return $this->respond($result);

    }
    public function CekinAntrianMjkn(Request $request)
    {
        $kdbooking = $request['kodebooking'];
        $tgl = $request['waktu'];
        date_default_timezone_set('UTC');
        // $tgl = date("Y-m-d H:i:s", time($tgl));
        $tgl = date('Y-m-d H:i:s', $tgl / 1000);

        $dataSlotingJkn = DB::select(DB::raw("SELECT antrianpasienregistrasi_t.statuspanggil, antrianpasienregistrasi_t.statusenabled ,
        antrianpasienregistrasi_t.jenis || '-' || antrianpasienregistrasi_t.noantrian::varchar as noantrian,antrianpasienregistrasi_t.noreservasi AS nobooking,
         ruangankiosk_m.namaruangan AS namapoli, pegawai_m.namahafis AS namadokter, to_char(antrianpasienregistrasi_t.tanggalreservasi,'yyyy-MM-dd') as tanggalreservasi,antrianpasienregistrasi_t.keterangan
        FROM            antrianpasienregistrasi_t FULL OUTER JOIN
                                 pegawai_m ON antrianpasienregistrasi_t.objectpegawaifk = pegawai_m.id FULL OUTER JOIN
                                 ruangankiosk_m ON antrianpasienregistrasi_t.objectruanganfk::varchar = ruangankiosk_m.kodeexternal
        WHERE        antrianpasienregistrasi_t.noreservasi ='$kdbooking' and antrianpasienregistrasi_t.statusenabled = true limit 1"));

        if (!empty($dataSlotingJkn)) {

            $dataSlotingJkn = DB::update(DB::raw("update antrianpasienregistrasi_t set tglcekinjkn = '$tgl' 
               WHERE        noreservasi ='$kdbooking'"));


            $message = array(
                'message' => 'ok',
                'code' => 200,
            );
        } else {
            $message = array(
                'message' => 'cekin antrianData Tidak Di Temukan',
                'code' => 201,
            );
        }
        $result = array(
            'metadata' => $message,
        );
        return $this->respond($result);
    }



    public function getDokterDPJPLokal(Request $request)
    {


        $dokter = DB::select(DB::raw("SELECT       namalengkap as namahafis, idhafis
        FROM            pegawai_m where statusenabled = 1 and idhafis is not null"));



        return $this->respond($dokter);
    }
    public function saveReservasi($request)
    {

        DB::beginTransaction();
        try {
            $tipepembayaran = "";
            $tgl = $request['tglReservasiFix'];
            $bulanregis = date_create($tgl);
            $tglAwal = date_format($bulanregis, "Y-m-d 00:00:00");
            $tglAkhir = date_format($bulanregis, "Y-m-d 23:59:59");

            $tglA = $request['tglReservasiFix'];
            $tglA = date_create($tglA);
            $tglA = date_format($tglA, "Y-m-d");
            $isBaru = true;
            $namaPasien = "";
            $tglLahir = "";
            $tipepembayaran = 2;


            // $pasien  = Pasien::where('nocm',$request['noCm'])->first();
            $pasien  = Pasien::where('noidentitas', $request['nik'])->first();
            if (!empty($pasien)) {
                $isBaru = false;
            } else {
                $pasien  = Pasien::where('nobpjs', $request['nomorkartu'])->first();    
                if (!empty($pasien)) {
                    $isBaru = false;
                }
            }
            //ash 2024-01-04
            if (isset($pasien) && !empty($pasien)) {
                $tglAwal = Carbon::now()->format('Y-m-d 00:00:00');

                $ceksudahdaftar = \DB::table('antrianpasienregistrasi_t as apr')
                    ->select('apr.norec', 'apr.tanggalreservasi')
                    ->whereNotNull('apr.noreservasi')
                    ->where('apr.nocmfk', $pasien->id)
                    ->where('apr.statusenabled', true);
                $ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '>=', $tglAwal);
                //$ceksudahdaftar = $ceksudahdaftar->where('apr.tanggalreservasi', '<=', $tglAB);
                $ceksudahdaftar = $ceksudahdaftar->get();
                if (count($ceksudahdaftar) > 0) {
                    $result = array(
                        "status" => 201,
                        "message" => 'Anda sudah melakukan reservasi. Silakan cek kembali jadwal reservasi Anda',
                    );
                    return ($result);
                }
            }

            if ($request['sex'] == 'P') {
                $jk = 1;
            } else {
                $jk = 2;
            }

            if ($isBaru) {
                $newId = Pasien::max('id') + 1;
                $dataPS = new Pasien();
                $dataPS->id = $newId;
                $dataPS->kdprofile = 12;
                $dataPS->statusenabled = true;
                $dataPS->kodeexternal = $newId;
                $dataPS->norec =  $dataPS->generateNewId();
                $dataPS->namapasien = $request['nama'];

                $dataPS->tgldaftar = date('Y-m-d H:i:s');
                $dataPS->tgllahir = $request['tgllahir'];
                $dataPS->jamlahir = $request['tgllahir'];
                $dataPS->objectjeniskelaminfk = $jk;
                $dataPS->noidentitas = $request['nik'];
                $dataPS->nohp = $request['nohp'];
                $dataPS->nocm = 0;
                $dataPS->save();


                $idAlamat = Alamat::max('id') + 1;
                $dataAL = new Alamat();
                $dataAL->id = $idAlamat;
                $dataAL->nocmfk = $newId;
                $dataAL->kdprofile = 12;
                $dataAL->alamatlengkap = '-';

                $dataAL->statusenabled = true;
                $dataAL->kodeexternal = $idAlamat;
                $dataAL->norec = $dataAL->generateNewId();

                $dataAL->save();


                //cek pasien
                $pasien  = Pasien::where('id', $newId)->first();
            }





            $newptp = new AntrianPasienRegistrasi();
            $nontrian = AntrianPasienRegistrasi::where('jenis', 'M')
                ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
                ->max('noantrian') + 1;
            $newptp->norec = $newptp->generateNewId();;
            $newptp->kdprofile = 0;
            $newptp->statusenabled = true;
            $newptp->ismobilejkn = true;
            $newptp->isasalreservasi = 2;
            $newptp->objectruanganfk = $request['poliKlinik'];
            $newptp->objectjeniskelaminfk = $pasien->objectjeniskelaminfk;
            $newptp->noantrian = $nontrian;
            $newptp->noreservasi = substr(Uuid::generate(), 0, 7);
            $noreservasi = $newptp->noreservasi;
            $newptp->tanggalreservasi = $request['tglReservasiFix'];
            // $newptp->tgllahir = $tglLahir;
            $newptp->objectkelompokpasienfk = $tipepembayaran;
            $newptp->objectpendidikanfk = 0;
            $newptp->namapasien =  $namaPasien;
            $newptp->noidentitas =  $request['nik'];
            $newptp->tglinput = date('Y-m-d H:i:s');
            $newptp->objectasalrujukanfk = $request['asalRujukan'];
            if ($tipepembayaran == 2) {
                $newptp->nobpjs = $request['nomorkartu'];
                $newptp->norujukan = $request['nomorreferensi'];
            } else {
                $newptp->noasuransilain = $request['nomorreferensi'];
            }
            $newptp->notelepon = $request['noTelpon'];
            $newptp->objectpegawaifk =  ($request['dokter'] ? $request['dokter'] : null);
            // return(isBaru );
            // die;
            if ($isBaru == true) {
                $newptp->tipepasien = "BARU";
                $newptp->type = "BARU";
            } else {
                // if( $request ['isTelemedicine'] == true) {
                //     $newptp->tipepasien = "LAMA";
                //     $newptp->type = "LAMA";
                //     $newptp->istelemedicine = 1;
                // }else{
                $newptp->tipepasien = "LAMA";
                $newptp->type = "LAMA";
                // }
            }
            //            $newptp->objectasalrujukanfk = 0;
            //            $newptp->objectstrukreturfk= 0;
            //            $newptp->objecttitlefk= 0;
            //            $newptp->isconfirm= 0;
            $newptp->jenis = 'M';
            $newptp->statuspanggil = 1;
            if (isset($pasien) && !empty($pasien)) {
                $newptp->objectagamafk = $pasien->objectagamafk;
                $alamat = Alamat::where('nocmfk', $pasien->id)->first();
                if (!empty($alamat)) {
                    $newptp->alamatlengkap = $alamat->alamatlengkap;
                    $newptp->objectdesakelurahanfk = $alamat->objectdesakelurahanfk;
                    $newptp->negara = $alamat->objectnegarafk;
                }
                // return( $alamat->alamatlengkap);
                // die;
                $newptp->objectgolongandarahfk =  $pasien->objectgolongandarahfk;
                $newptp->kebangsaan = $pasien->objectkebangsaanfk;
                $newptp->namaayah = $pasien->namaayah;
                $newptp->namaibu = $pasien->namaibu;
                $newptp->namasuamiistri = $pasien->namasuamiistri;

                $newptp->noaditional = $pasien->noaditional;
                //                $newptp->noantrian= 0;
                $newptp->noidentitas = $pasien->noidentitas;
                $newptp->nocmfk =  $pasien->id;
                $newptp->paspor =  $pasien->paspor;
                $newptp->objectpekerjaanfk =  $pasien->objectpekerjaanfk;
                $newptp->objectpendidikanfk = $pasien->objectpendidikanfk != null ? $pasien->objectpendidikanfk  : 0;
                $newptp->objectstatusperkawinanfk =  $pasien->objectstatusperkawinanfk;
                $newptp->tempatlahir = $pasien->tempatlahir;
            }
            // $newptp->save();
            $pasiendaftar = array(
                'tglregistrasi' => $request['tglReservasiFix'],
                'tglregistrasidate' => date('Y-m-d', strtotime($request['tglReservasiFix'])),
                'nocmfk' => $pasien->id,
                'objectruanganfk' => $request['poliKlinik'],
                'objectdepartemenfk' => 18,
                'objectkelasfk' => 6, //nonkelas
                'objectkelompokpasienlastfk' => 2, //umum
                'objectrekananfk' => 581367,
                'tipelayanan' => 1, //reguler
                'objectpegawaifk' => 1,
                'noregistrasi' => '',
                'norec_pd' => '',
                'israwatinap' => 'false',
                'statusschedule' => $noreservasi,
                'istelemedicine' => 'false',
                'jaminankhusus' => '',
                'catatan' => null,
                'objectruanganasalfk' => $request['poliKlinik'],
                'statuspasien' => 'LAMA',
                'objectkasuspenyakitlastfk' => '1',
                'sensus' => null
            );
            $antrianpasiendiperiksa = array(
                'norec_apd' => '',
                'tglregistrasi' => $request['tglReservasiFix'],
                'objectruanganfk' => $request['poliKlinik'],
                'objectkelasfk' => 6, //nonkelas
                'objectpegawaifk' => 1,
                'objectkamarfk' => null,
                'nobed' => null,
                'objectdepartemenfk' => 18,
                'objectasalrujukanfk' => 5, //Datang Sendiri
                'israwatgabung' => 0,
                'namahafis' => $request['namahafis'],
                'dokter' => $request['dokter'] ? $request['dokter'] : null
            );
            $objSave = array(
                'pasiendaftar' => $pasiendaftar,
                'antrianpasiendiperiksa' => $antrianpasiendiperiksa
            );
            $Parsing = $this->saveRegistrasiPasien($objSave);
            //  return($Parsing);
            //  die();
            if ($Parsing['status'] == 201) {
                $transStatus = 'false';
                $transMessage = $Parsing['message'];
                $e = "";
            } else {
                $newptp->save();
                $push = array(
                    'noregistrasi' => $Parsing['dataPD']['noregistrasi'],
                    'jenispasien' => 2,
                    'idruangan' => $request['poliKlinik'],
                    'norec_apd' => $Parsing['dataAPD']['norec'],
                    'idpegawai' => $request['dokter'],
                    'isDaftarKeDua' => false
                );
                $karcis = $this->saveBiayaKarcis($push);
                $transStatus = 'true';
                $transMessage = "Simpan Reservasi";
            }

            // $transStatus = 'true';

            // $transMessage = "Simpan Reservasi";
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Reservasi Slotting Penuh" . $e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 200,
                "message" => $transMessage,
                "noreservasi" => $noreservasi,
                "noAntrianJam" => $Parsing['dataAPD']['noantrian'],
                "nocm" => $pasien->nocm,
                "as" => 'ramdan@epic',
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 201,
                "message" => $transMessage . " " . $e,
            );
        }
        return $result;
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
            if ($idruangan == '322222') {
                $transStatus = 'true';
            } else {
                if ($statuspasien == 'LAMA') {
                    if ($idruangan == '27' || $idruangan == '31') {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090231,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090789,
                            'pegawaifk' => $idpegawai,
                            'objectjenispetugaspefk' => 4
                        );
                    } else if (
                        $idruangan == '462' || $idruangan == '12' || $idruangan == '20'
                        || $idruangan == '796' || $idruangan == '255' || $idruangan == '447'
                    ) {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090231,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                    } else if ($idruangan == '569') {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090233,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090237,
                            'pegawaifk' => $idpegawai,
                            'objectjenispetugaspefk' => 4
                        );
                    } else {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090231,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090251,
                            'pegawaifk' => $idpegawai,
                            'objectjenispetugaspefk' => 4
                        );
                    }
                } else {
                    if ($idruangan == '27' || $idruangan == '31') {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090230,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090789,
                            'pegawaifk' => $idpegawai,
                            'objectjenispetugaspefk' => 4
                        );
                    } else if (
                        $idruangan == '462' || $idruangan == '12' || $idruangan == '20'
                        || $idruangan == '796' || $idruangan == '255' || $idruangan == '447'
                    ) {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090230,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                    } else if ($idruangan == '569') {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090232,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090237,
                            'pegawaifk' => $idpegawai,
                            'objectjenispetugaspefk' => 4
                        );
                    } else {
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090230,
                            'pegawaifk' => 4000442,
                            'objectjenispetugaspefk' => 2
                        );
                        $arrayProdukPegawai[] = array(
                            'produkfk' => 5090251,
                            'pegawaifk' => $idpegawai,
                            'objectjenispetugaspefk' => 4
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

        return ($result);
    }
    function saveRegistrasiPasien($request)
    {
        // return($request['pasiendaftar']);
        // die();
        $noRegistrasiSeq = $this->generateCodeBySeqTable(new PasienDaftar, 'noregistrasi', 10, date('ym'));
        $noAntrian = 0;
        if ($noRegistrasiSeq == '') {
            $transMessage = 201;
            DB::rollBack();
            $result = array(
                "status" => 201,
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
                    "status" => 201,
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
                            "status" => 201,
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
            $dataPD->catatan =  $catatan;


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
                    // ->where('statusenabled', true)
                    ->where('namahafis', $r_NewAPD['namahafis'])
                    ->max('noantrian');
                $noAntrian = $countNoAntrian + 1;
                //                    return $noAntrian;
                $dataAPD = new AntrianPasienDiperiksa;
                $dataAPD->norec = $dataAPD->generateNewId();
                $dataAPD->kdprofile = 1;
                $dataAPD->statusenabled = true;
                $dataAPD->noantrian = $noAntrian;
                $dataAPD->namahafis = $r_NewAPD['namahafis'];
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
            $dataAPD->objectpegawaifk = $r_NewAPD['dokter'];
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
                'status' => 201,
                'message'  => $transMessage,
                'as' => 'ramdanegie',
            );
        } else if ($transStatus == 'true') {
            $transMessage = 'SUKSES';
            DB::commit();
            $result = array(
                'status' => 200,
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
                'status' => 201,
                'message' => $transMessage,
                'dataPD' => $dataPD,
                'as' => 'ramdanegie',
            );
        }
        return ($result);
        // return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    function date_extract_format($d, $null = '')
    {
        // check Day -> (0[1-9]|[1-2][0-9]|3[0-1])
        // check Month -> (0[1-9]|1[0-2])
        // check Year -> [0-9]{4} or \d{4}
        $patterns = array(
            '/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3,8}Z\b/' => 'Y-m-d\TH:i:s.u\Z', // format DATE ISO 8601
            '/\b\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\b/' => 'Y-m-d',
            '/\b\d{4}-(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])\b/' => 'Y-d-m',
            '/\b(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}\b/' => 'd-m-Y',
            '/\b(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-\d{4}\b/' => 'm-d-Y',

            '/\b\d{4}\/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\b/' => 'Y/d/m',
            '/\b\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\b/' => 'Y/m/d',
            '/\b(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}\b/' => 'd/m/Y',
            '/\b(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}\b/' => 'm/d/Y',

            '/\b\d{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[1-2][0-9]|3[0-1])\b/' => 'Y.m.d',
            '/\b\d{4}\.(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\b/' => 'Y.d.m',
            '/\b(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.\d{4}\b/' => 'd.m.Y',
            '/\b(0[1-9]|1[0-2])\.(0[1-9]|[1-2][0-9]|3[0-1])\.\d{4}\b/' => 'm.d.Y',

            // for 24-hour | hours seconds
            '/\b(?:2[0-3]|[01][0-9]):[0-5][0-9](:[0-5][0-9])\.\d{3,6}\b/' => 'H:i:s.u',
            '/\b(?:2[0-3]|[01][0-9]):[0-5][0-9](:[0-5][0-9])\b/' => 'H:i:s',
            '/\b(?:2[0-3]|[01][0-9]):[0-5][0-9]\b/' => 'H:i',

            // for 12-hour | hours seconds
            '/\b(?:1[012]|0[0-9]):[0-5][0-9](:[0-5][0-9])\.\d{3,6}\b/' => 'h:i:s.u',
            '/\b(?:1[012]|0[0-9]):[0-5][0-9](:[0-5][0-9])\b/' => 'h:i:s',
            '/\b(?:1[012]|0[0-9]):[0-5][0-9]\b/' => 'h:i',

            '/\.\d{3}\b/' => '.v'
        );
        //$d = preg_replace('/\b\d{2}:\d{2}\b/', 'H:i',$d);
        $d = preg_replace(array_keys($patterns), array_values($patterns), $d);

        return preg_match('/\d/', $d) ? $null : $d;
    }
    function stringDecrypt($key, $string)
    {

        $bahan = $string['response'];
        $metadata = $string['metadata'];

        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        $x = \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = (array) json_decode($x);
        if ($metadata->code != 200) {
            if ($metadata->code != 1) {
                $result = null;
            }
        }
        $data2 = array(
            'status' => 'ok',
            'metaData' => $metadata,
            'response' => $result,
        );
        return $data2;
    }

    function stringDecryptVclaim($key, $string)
    {

        $bahan = $string['response'];
        $metadata = $string['metaData'];
        //    return($bahan);
        //    die();
        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        $x = \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = (array) json_decode($x);
        // return($metadata);
        // die();
        if ($metadata->code != 200) {
            $result = null;
        }
        $data2 = array(
            'metaData' => $metadata,
            'response' => $result,
        );
        return $data2;
    }
    public function carijumlahsep(Request $request)
    {
        // return($request['noRujukanKontrol']);
        // die();
        ini_set('max_execution_time', 200);
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "Rujukan/JumlahSEP/" . $request['jenis'].'/'. $request['norujukan'],
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key:" . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);


        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return  $result;
    }
}
