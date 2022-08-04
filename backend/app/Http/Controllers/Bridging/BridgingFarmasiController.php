<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 9/22/2017
 * Time: 2:55 AM
 */
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 09/08/2019
 * Time: 10:34
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;

use App\Transaksi\BridgingMiniR45;
use App\Transaksi\HIS_Obat_MS;
use App\Transaksi\HIS_Trans_HD;
use App\Transaksi\HIS_Trans_IT;
use App\Traits\PelayananPasienTrait;


class BridgingFarmasiController extends ApiController
{
    use Valet,PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function SimpanBridgingConsisD(Request $request) {
        DB::beginTransaction();
        $data = DB::select(DB::raw("
             select pp.produkfk ,sr.norec, sr.noresep, sr.tglresep, ps.id as psid, pd.noregistrasi, ps.nocm, ps.namapasien, ru.id as ruid, ru.namaruangan, pg.id as pgid, 
            pg.namalengkap as dokter, jk.jeniskelamin, ps.tgllahir, pd.tglregistrasi, ala.alamatlengkap, ps.tgllahir, pp.jumlah, pp.dosis, pp.aturanpakai, 
            pp.produkfk, pr.namaproduk, pp.rke
             from strukresep_t as sr inner join pelayananpasien_t as pp on pp.strukresepfk = sr.norec 
            inner join antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk 
            inner join pasien_m as ps on ps.id = pd.nocmfk inner join produk_m as pr on pr.id = pp.produkfk left join alamat_m as ala on ala.nocmfk = pd.nocmfk 
            inner join pegawai_m as pg on pg.id = sr.penulisresepfk inner join ruangan_m as ru on ru.id = apd.objectruanganfk 
            inner join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join his_obat_ms_t as ho on cast(ho.hobatid as INTEGER) = pp.produkfk 
            where pp.strukresepfk = :norec_resep and ho.statusenabled =true and pp.jeniskemasanfk=2"),
            array(
                'norec_resep' => $request['strukresep'],
            )
        );

        $statusCounter = 'Kosong';
//        $dataCounterLast = DB::select(DB::raw("
//            select max(counterid) as maxcounterid from his_trans_hd_t where status=:status and cast(counterid as INTEGER)<9"),
//            array(
//                'status' => '0',
//            )
//        );
//            if ((int)$dataCounterLast[0]->maxcounterid < 8){
//                $counterid=1+(int)$dataCounterLast[0]->maxcounterid;
//            }else{
//                $dataCounterKosong = DB::select(DB::raw("
//                    select counterid  from his_trans_hd_t where status=:status"),
//                    array(
//                        'status' => '1',
//                    )
//                );
//                if (count($dataCounterKosong) == 0){
//                    $statusCounter = 'Penuh';
//                }else{
//                    $counterid=(int)$dataCounterKosong[0]->counterid;
//                    $update = DB::select(DB::raw("
//                    update  his_trans_hd_t set status='2' where counterid=:counterid"),
//                        array(
//                            'counterid' => $counterid,
//                        )
//                    );
//                }
//            }
        if ($statusCounter == 'Kosong') {
            if ($data[0]->jeniskelamin == 'Perempuan') {
                $jk = 'F';
            } else {
                $jk = 'M';
            };
            $nmpasien = $data[0]->namapasien;#
            $alamat = str_limit($data[0]->alamatlengkap, 100);#
            $transactionCode = $data[0]->noresep;#
            $umur = $this->hitungUmur($data[0]->tgllahir);

            $umur = str_replace('Tahun', true, $umur);
            $umur = str_replace('Bulan', 'b', $umur);
            $umur = str_replace('Hari', 'h', $umur);
            $umur = str_replace(' ', '', $umur);
            $umur = str_replace(',', '', $umur);
            $umur = str_replace('.', '', $umur);
            $umur = str_limit($umur, 9);

            $nmpasien = str_replace(',', '', $nmpasien);
            $nmpasien = str_replace('\'', '', $nmpasien);
            $nmpasien = str_replace('"', '', $nmpasien);
            $nmpasien = str_replace('/', '', $nmpasien);
            $nmpasien = str_replace('\\', '', $nmpasien);

            $alamat = str_replace(',', '', $alamat);
            $alamat = str_replace('\'', '', $alamat);
            $alamat = str_replace('"', '', $alamat);
            $alamat = str_replace('/', '', $alamat);
            $alamat = str_replace('\\', '', $alamat);

            $transactionCode = str_replace(',', '', $transactionCode);
            $transactionCode = str_replace('\'', '', $transactionCode);
            $transactionCode = str_replace('"', '', $transactionCode);
            $transactionCode = str_replace('/', '', $transactionCode);
            $transactionCode = str_replace('\\', '', $transactionCode);


            try {
                $newBRG = new HIS_Trans_HD();#
                $norecBRG = $newBRG->generateNewId();#
                $norecHIS = $this->generateCode(new HIS_Trans_HD, 'transaksiid', 13, $transactionCode . '/');
                $newBRG->norec = $norecBRG;#
                $newBRG->kdprofile = 0;#
                $newBRG->statusenabled = true;#
                $newBRG->transaksiid = $norecHIS;//$transactionCode;#
                $newBRG->counterid = $request['counterid'];#
                $newBRG->mrn = $data[0]->nocm;#
                $newBRG->nama = $nmpasien;#
                $newBRG->umur = $umur;#
                $newBRG->alamat = $alamat;#
                $newBRG->jeniskelamin = $jk;#
                $newBRG->status = '0';#

                $newBRG->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "Simpan Bridging";
            }

            foreach ($data as $item) {
                try {
                    $dataobat = DB::select(DB::raw("
                            select packageunit from his_obat_ms_t where hobatid=:hobatid"),
                        array(
                            'hobatid' => $item->produkfk,
                        )
                    );
                    $qtypack = (int)$dataobat[0]->packageunit;
                    if ((int)$item->jumlah % $qtypack > 0) {
                        $qty = (int)((int)$item->jumlah / $qtypack) + 1;
                    } else {
                        $qty = (int)((int)$item->jumlah / $qtypack);
                    }


                    $newIT = new HIS_Trans_IT();#
                    $norecIT = $newIT->generateNewId();#
                    $newIT->norec = $norecIT;#
                    $newIT->kdprofile = 0;#
                    $newIT->statusenabled = true;#
                    $newIT->obatid = $item->produkfk;#
                    $newIT->qty = $qty;#
                    $newIT->transaksiid =$norecHIS;// $transactionCode;#

                    $newIT->save();
                    $transStatus = 'true';
                } catch (\Exception $e) {
                    $transStatus = 'false';
                    $transMessage = "Simpan Bridging";
                }
            }
        }

//
        $transMessage = "Simpan Bridging Gagal!!";
        if ($statusCounter == 'Penuh'){
            $transStatus = 'false';
            $transMessage = "CounterID Full";
            $newBRG ='penuh';
        }
        if ($transStatus == 'true' ) {
            $transMessage = "Simpan Bridging Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newBRG,
                "as" => 'as@epic',
            );
        } else {

            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newBRG,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getRefDPHO(Request $request) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // return   $this->getPasswordConsumerBPJS();
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."referensi/dpho",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }

    public function getFaskes($jenis,$nama) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."referensi/ppk/".$jenis."/".$nama,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
    public function getSpesialistik() {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."referensi/spesialistik",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
    
    public function getKunjunganSEP($sep) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."referensi/sep/".$sep,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
    public function getDatfarPelObat($sep) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."pelayanan/obat/daftar/".$sep,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
    public function getMonitoringDataKlaim($bln,$tahun,$jenisobat,$status) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."monitoring/klaim/".$bln."/".$tahun."/".$jenisobat."/".$status,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
    public function hapusPelObat(Request $request) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        $json = array(
          "nosepapotek" => "1801A00104190000005", 
          "noresep" => "00001",
          "kodeobat"  => "25180404057", 
          "tipeobat" => "N" 
        );
       
        $dataJsonSend = json_encode($json);

        // base64 encode�
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  '',
                CURLOPT_URL=> $this->getUrlApotik()."pelayanan/obat/hapus",
//                CURLOPT_URL => "https://dvlp.bpjs-kesehatan.go.id/VClaim-rest/SEP/1.1/insert",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "DELETE",
                CURLOPT_POSTFIELDS => $dataJsonSend,


                CURLOPT_HTTPHEADER => array(
                    "Content-Type: Application/x-www-form-urlencoded",
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp
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
        return $this->respond($result);
      
    }
     public function getRiwayatPelObat($tglawal,$tglakhir,$nokartu) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."riwayatobat/".$tglawal."/".$tglakhir."/".$nokartu,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
    public function getCariObat($jenis,$tgl,$namakode) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."referensi/obat/".$jenis."/".$tgl."/".$namakode,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
     public function simpanSEPResep(Request $request) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        $json = [ 
             "TGLSJP" => "2019-04-02 11:13:33.000",
             "REFASALSJP" => "0112R0340418V004961", 
             "POLIRSP" => "BED", 
             "KDJNSOBAT" => "2", 
             "NORESEP" => "01236", 
             "IDUSERSJP" => "apt-user-2209A001",
             "TGLRSP" => "2019-03-19 00:00:00.000", 
             "TGLPELRSP" => "2019-03-19 00:00:00.000"
         ];
       
        $dataJsonSend = json_encode($json);

        // base64 encode�
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  '',
                CURLOPT_URL=> $this->getUrlApotik()."sjpresep/insert",
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
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp
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
        return $this->respond($result);
      
    }
     public function simpanObatNonRacikan(Request $request) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        $json = [ 
             "NOSJP" => "0112A01704190000001", 
             "NORESEP"=>  "01236", 
             "KDOBT" =>  "123456", 
             "NMOBAT"=>  "IVAN", 
             "SIGNA1OBT"=>  1,  
             "SIGNA2OBT"=>  1, 
             "JMLOBT"=>  1, 
             "JHO"=>  1, 
             "CatKhsObt"=>  "TES" 
         ];
       
        $dataJsonSend = json_encode($json);

        // base64 encode�
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  '',
                CURLOPT_URL=> $this->getUrlApotik()."obatnonracikan/insert",
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
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp
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
        return $this->respond($result);
      
    }
    public function simpanObatRacikan(Request $request) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

       // { "NOSJP": "0112A01704190000001", "NORESEP": "01236", "JNSROBT": "R.01", "KDOBT": "012131", "NMOBAT": "OBAT SOA 1", "SIGNA1OBT": 1, "SIGNA2OBT": 1, "PERMINTAAN":1, "JMLOBT": 1, "JHO": 1, "CatKhsObt": "SOA RACIKAN 1" }
       
        $dataJsonSend = json_encode($request['data']);

        // base64 encode
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  '',
                CURLOPT_URL=> $this->getUrlApotik()."obatracikan/insert",
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
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp
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
        return $this->respond($result);
      
    }
   public function daftarResep(Request $request) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

       // { "kdppk": "0112A017", "KdJnsObat": "0", "JnsTgl": "TGLPELSJP", "TglMulai": "2019-03-01 08:49:45", "TglAkhir": "2019-03-31 06:18:33" }
       
        $dataJsonSend = json_encode($request['data']);

        // base64 encode
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  '',
                CURLOPT_URL=> $this->getUrlApotik()."daftarresep",
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
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp
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
        return $this->respond($result);
      
    }
     public function hapusResep(Request $request) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

// { "NOSJP": "0112A01704190000001", "REFASALSJP": "0112R0340418V004961", "NORESEP": "01236" }
       
        $dataJsonSend = json_encode($request['data']);

        // base64 encode
        $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_PORT =>  '',
                CURLOPT_URL=> $this->getUrlApotik()."hapusresep",
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
                    "X-cons-id: ".  (string)$data,
                    "X-signature: ". (string)$encodedSignature,
                    "X-timestamp: ". (string)$tStamp
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
        return $this->respond($result);
      
    }
     public function refSettingApotik($kode) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."referensi/settingppk/read/".$kode,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
     public function refPoli($kodenama) {
        $data = $this->getIdConsumerBPJS();
        $secretKey = $this->getPasswordConsumerBPJS();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode�
        $encodedSignature = base64_encode($signature);

        $curl = curl_init();
        // p1 : jenis faskes (1 fktp, 2 fkrtl, 3 apotek), p2 : kode atau nama faskes (minimal 3 digit)
        curl_setopt_array($curl, array(
            CURLOPT_PORT =>'',
            CURLOPT_URL=> $this->getUrlApotik()."referensi/poli/".$kodenama,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp
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

        return $this->respond($result);
    }
}