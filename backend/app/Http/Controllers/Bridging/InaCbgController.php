<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 19/02/2019
 * Time: 14.54
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\DiagnosaKeperawatan;
use App\Master\KelompokTransaksi;
use App\Transaksi\InformasiTanggungan;
use App\Transaksi\DiagnosaBeratBadanBayi;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\PelayananPasien;
use App\Transaksi\HasilGrouping;
use App\Transaksi\PasienDaftar;
use DB;
use Illuminate\Http\Request;
use App\Traits\Valet;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;


class InaCbgController   extends ApiController
{

    use Valet;

    public function __construct() {
    parent::__construct($skip_authentication=false);
}
    public function saveBridgingINACBG(Request $request)
    {
        ini_set('max_execution_time', 1000); //6 minutes
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
//        return $data;
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
        }

//        $key = "1fa5106f46eedd6d536bb816f4dc23728e0ca1dee3db20904e634134b205b28d";//        $url = "localhost/E-Klaim/ws.php";

        $dataReq = $request['data'];
        $responseArr = [];
        foreach ($dataReq as $dataLoop){
            $json_request = json_encode($dataLoop);
            $payload = $this->inacbg_encrypt($json_request,$key);
            $header = array("Content-Type: application/x-www-form-urlencoded", "Access-Control-Allow-Origin: *");
            

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER,$header);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            $response = curl_exec($ch);
            $err = curl_error($ch);
            if ($err) {
                return $this->setStatusCode(400)->respond($err, $err);
            }
            $first  = strpos($response, "\n")+1;
            $last   = strrpos($response, "\n")-1;
            $response  = substr($response,
                $first,
                strlen($response) - $first - $last);
            $response = $this->inacbg_decrypt($response,$key);
            $responseArr[] =array(
                'datarequest' => $dataLoop,
                'dataresponse' =>   $response
            );
        }
        $result = array(
            "status" => 201,
            "dataresponse" => $responseArr,
            "as" => 'as@epic',
        );
//        return $this->respond($responseArr);
        return $this->setStatusCode($result['status'])->respond($result, "Bridging InaCBG");
    }
    // Encryption Function
    function inacbg_encrypt($data, $key) {
        /// make binary representasion of $key
        $key = hex2bin($key);
        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
          throw new Exception("Needs a 256-bit key!");
        }
        /// create initialization vector
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");
        $iv = openssl_random_pseudo_bytes($iv_size);
        // dengan catatan dibawah
        /// encrypt
        $encrypted = openssl_encrypt($data,
            "aes-256-cbc",
            $key,
            OPENSSL_RAW_DATA,
            $iv );
        /// create signature, against padding oracle attacks
        $signature = mb_substr(hash_hmac("sha256",
            $encrypted,
            $key,
            true),0,10,"8bit");
        /// combine all, encode, and format
        $encoded = chunk_split(base64_encode($signature.$iv.$encrypted));
        return $encoded;
    }
    // Decryption Function
    function inacbg_decrypt($str, $strkey){
        /// make binary representation of $key
        $key = hex2bin($strkey);
        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
            throw new Exception("Needs a 256-bit key!");
        }
        /// calculate iv size
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");
        /// breakdown parts
        $decoded = base64_decode($str);
        $signature = mb_substr($decoded,0,10,"8bit");
        $iv = mb_substr($decoded,10,$iv_size,"8bit");
        $encrypted = mb_substr($decoded,$iv_size+10,NULL,"8bit");
        /// check signature, against padding oracle attack
        $calc_signature = mb_substr(hash_hmac("sha256",
            $encrypted,
            $key,
            true),0,10,"8bit");
        if($this->inacbg_compare($signature,$calc_signature)) {
//            return "SIGNATURE_NOT_MATCH"; /// signature doesn't match
        }
        $decrypted = openssl_decrypt($encrypted,
            "aes-256-cbc",
            $key,
            OPENSSL_RAW_DATA,
            $iv);
        $dtdtd = json_decode($decrypted);
        return $dtdtd;
    }
    /// Compare Function
    function inacbg_compare($a, $b) {
        /// compare individually to prevent timing attacks
        /// compare length
        if (strlen($a) !== strlen($b)) return false;
        /// compare individual
        $result = 0;
        for($i = 0; $i < strlen($a); $i ++) {
            $result |= ord($a[$i]) ^ ord($b[$i]);
        }
        return $result == 0;
    }
    public function getDaftarPurifMandiri(Request $request)
    {
        $data = \DB::table('purifmandiri_t')
        ->select('nosep','status')
        ->get();
        return $this->respond($data);
    }
    public function getDaftarPasien(Request $request)
    {
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            // ->leftjoin('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pas.objectasuransipasienfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('strukpelayananpenjamin_t as spp', 'sp.norec', '=', 'spp.nostrukfk')
            ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('diagnosaberatbadanbayi_t as dbb', 'dbb.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('jenispasien_m as jp', 'jp.id', '=', 'pd.objectjenispasienfk')
            ->select('jk.jeniskelamin', 'pd.norec', 'pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien',
                'pd.tglpulang', 'pd.statuspasien', 'sp.nostruk', 'sbm.nosbm', 'sbm.totaldibayar', 'pg.id as pgid', 'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir','pd.objectruanganlastfk as ruanganid','pas.nosep','pas.norec as norec_pa','br.norec as norec_br',
                'pas.nokepesertaan','ps.tgllahir','ps.objectjeniskelaminfk','dept.id as deptid','kls.nourut as nokelasdaftar','kls2.nourut as nokelasdijamin',
                'kls.reportdisplay as namakelasdaftar','kls2.reportdisplay as namakelas', 'kls2.namakelas as namakelasini','pd.objectstatuspulangfk','spp.noverifikasi',
                'hg.biayanaikkelas','dbb.beratbadan','rk.id as idrekanan','pas.statuscovid','ps.noidentitas','pas.loscovid','ru.kdinternal','jp.jenispasien',
                DB::raw("case when hg.totalpiutangpenjamin is null then 0 else hg.totalpiutangpenjamin end as totalpiutangpenjamin, case when pd.isclaim='1' then 'ReView' else '' end as isclaim,
                case when hg.status is null then 'BELUM' else hg.status end as statusgrouping,case when pd.objectjenispasienfk is null then  1 else pd.objectjenispasienfk end as statuskemo"))
            ->whereNull('br.norec')
            // ->where('pas.nosep','<>','') //ini di lepasin atas permintaan bg jho
            // ->whereNotNull('pas.nosep')// ini di lepasin atas permintaan bg jho
            ->whereNotNull('pd.tglpulang');

//            ->where('apd.objectruanganasalfk',null);

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
//        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
//            $data = $data->where('kp.id', '=', $filter['kelId']);
//        }
        $paramKel  ='';
        if(isset($request['kelId']) && $request['kelId']!="" && $request['kelId']!="undefined"){
            $arrKel = explode(',',$request['kelId']) ;
            $kodeKel = [];
            foreach ( $arrKel as $item){
                $kodeKel[] = (int) $item;
            }
            $paramKel = ' and kp.id in ('.$request['kelId'].')';
            $data = $data->whereIn('kp.id',$kodeKel);
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
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            $data = $data->where('pas.nosep', '=', $filter['nosep']);
        }
        if (isset($filter['grouping']) && $filter['grouping'] != "" && $filter['grouping'] != "undefined") {
            $data = $data->whereNotNull('hg.status');
        }
//        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
//            $data = $data->take($filter['jmlRows']);
//        }
        $data = $data->orderBy('pd.noregistrasi');

        $data = $data->get();
        // return($data);
        // die();
        $i = 0 ;
        $dtdt = '';
        $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosa','apd.objectasalrujukanfk','pd.norec')
//            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->wherein('dp.objectjenisdiagnosafk',array(1,2))
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
			->orderBy('dp.objectjenisdiagnosafk', 'asc')
            ->get();
        foreach ($data as $item){
            $dtdt = '';
            $asalRujukan = '';
            $covid19_status_cd = '';
            foreach ($dataDiagnosa as $item2){
                if ($item2->norec == $data[$i]->norec){
                    $dtdt = $dtdt . '#' .  $item2->kddiagnosa;
                    $asalRujukan = $item2->objectasalrujukanfk;
                }
            }
            $data[$i]->icd10 = substr($dtdt,1,strlen($dtdt)-1);
            $data[$i]->codernik = $codernik;
            $data[$i]->objectasalrujukanfk = $asalRujukan;
            $data[$i]->kodetarif = $kodetarif;
            $i= $i + 1 ;
        }

        $i = 0 ;
        $dtdt = '';
        $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosatindakan','pd.norec')
//            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->get();
        foreach ($data as $item){
            $dtdt = '';
//            $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
//                ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
//                ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
//                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
//                ->select('dg.kddiagnosatindakan')
//                ->where('apd.noregistrasifk',$data[$i]->norec)
//                ->get();
            foreach ($dataICD9 as $item2){
                if ($item2->norec == $data[$i]->norec) {
                    $dtdt = $dtdt . '#' . $item2->kddiagnosatindakan;
                }
            }
            $data[$i]->icd9 = substr($dtdt,1,strlen($dtdt)-1);
            $i= $i + 1 ;
        }

        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        $dataTarif16 = DB::select(DB::raw("select pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal, kamar.namakamar
            from pasiendaftar_t as pd
            inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            LEFT OUTER JOIN kamar_m as kamar on kamar.id=apd.objectkamarfk
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
            left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
            where br.norec is null  and 
            pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir'  
            $paramKel
            group  by pd.norec,kpb.namaexternal, kamar.namakamar, apd.tglmasuk order by apd.tglmasuk")
        );
        $i = 0 ;
        $prosedur_non_bedah ='';
        $prosedur_bedah ='';
        $konsultasi ='';
        $tenaga_ahli ='';
        $keperawatan ='';
        $penunjang ='';
        $radiologi ='';
        $laboratorium ='';
        $pelayanan_darah ='';
        $rehabilitasi ='';
        $kamar ='';
        $rawat_intensif ='';
        $obat ='';
        $obat_kronis ='';
        $obat_kemoterapi ='';
        $alkes ='';
        $bmhp ='';
        $sewa_alat ='';
        $noregistrasi = '';

        // return($data);
        // die();
        
        foreach ($data as $item){
            
            $riwayatinap = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
                ->select( 'ru.namaruangan','apd.tglmasuk','apd.tglkeluar','pd.noregistrasi','kamar.namakamar')
                ->where('pd.noregistrasi', $item->noregistrasi)
                ->where('ru.objectdepartemenfk','16')
                ->where('apd.statusenabled', true)
                ->orderBy('apd.tglmasuk')
                ->get();
                $isi="";
                $namakamar ='';
                foreach ($riwayatinap as $x) {
                    $isi=$isi.' '.$x->namaruangan.' Tgl.Masuk '.$x->tglmasuk.' \ '.$x->tglkeluar.' # ';
                    if ($x->namakamar != null) {
                        $namakamar = $x->namakamar;
                    }
                    // return($namakamar);
                    // die();
                }

                // $sudahBayar = DB::select(DB::raw("
                // select sum(sbm.totaldibayar) sudahbayar from strukbuktipenerimaan_t as sbm
                // join strukpelayanan_t as sp on sbm.nostrukfk=sp.norec
                // join pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                // where pd.noregistrasi=:noregistrasi;
                // "),
                //     array(
                //         'noregistrasi' => $item->noregistrasi,
                //     )
                // );
                // $sudahbayar = '0';
                // foreach ($sudahBayar as $sb) {
                //     (float)$sudahbayar = $sudahbayar+$sb->sudahbayar;
                // }
                // // return($sudahbayar);
                // // die();

            $billing ='';
            $deposit = '0';
            // if ($item->produkfk == $this->getProdukIdDeposit()) {
            //     continue;
            // }
            $norecpd= $data[$i]->norec;
            $totaldibayar = $data[$i]->totaldibayar;
            (float)$deposit = $deposit + $totaldibayar;
            (float)$billing = 0;
            foreach ($dataTarif16 as $itm){
                // if ($itm->namakamar != null) {
                //     $namakamar = $itm->namakamar;
                // }
                
                if ($itm->norec == $norecpd){
//                    $data[$i]->tarif_rs->($dataTarif16[0]->namaexternal) => (float)$dataTarif16[0]->ttl,

                    if ($itm->namaexternal == 'prosedur_non_bedah'){
                        $prosedur_non_bedah = (float)$prosedur_non_bedah+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'prosedur_bedah'){
                        $prosedur_bedah = (float)$prosedur_bedah+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'konsultasi'){
                        $konsultasi = (float)$konsultasi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'tenaga_ahli'){
                        $tenaga_ahli = (float)$tenaga_ahli+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'keperawatan'){
                        $keperawatan = (float)$keperawatan+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'penunjang'){
                        $penunjang = (float)$penunjang+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'radiologi'){
                        $radiologi = (float)$radiologi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'laboratorium'){
                        $laboratorium = (float)$laboratorium+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'pelayanan_darah'){
                        $pelayanan_darah = (float)$pelayanan_darah+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rehabilitasi'){
                        $rehabilitasi = (float)$rehabilitasi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'kamar'){
                        $kamar = (float)$kamar+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rawat_intensif'){
                        $rawat_intensif = (float)$rawat_intensif+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat'){
                        $obat = (float)$obat+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kronis'){
                        $obat_kronis = (float)$obat_kronis+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kemoterapi'){
                        $obat_kemoterapi = (float)$obat_kemoterapi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'alkes'){
                        $alkes = (float)$alkes+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'bmhp'){
                        $bmhp = (float)$bmhp+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'sewa_alat'){
                        $sewa_alat = (float)$sewa_alat+(float)$itm->ttl;
                    }
                    // $billing = $prosedur_non_bedah+$prosedur_bedah+$konsultasi+$tenaga_ahli+$keperawatan+$penunjang+$radiologi+$laboratorium+$pelayanan_darah+$rehabilitasi+$kamar+$rawat_intensif+$obat+$obat_kronis+$obat_kemoterapi+$alkes+$bmhp+$sewa_alat;
                    (float)$billing = (float)$billing+(float)$itm->ttl;
                    // return($itm->ttl);
                    // die();
                }
                // else{
                //         $prosedur_non_bedah = 0;
                //         $prosedur_bedah = 0;
                //         $konsultasi = 0;
                //         $tenaga_ahli = 0;
                //         $keperawatan = 0;                    
                //         $penunjang = 0;
                //         $radiologi = 0;
                //         $laboratorium = 0;
                //                         $pelayanan_darah = 0;
                //                         $rehabilitasi = 0;
                //                         $kamar = 0;                                        
                //                         $rawat_intensif = 0;                                        
                //                         $obat = 0;
                //                         $obat_kronis = 0;                                        
                //                         $obat_kemoterapi = 0;
                //                         $alkes = 0;
                //                         $bmhp = 0;
                //                         $sewa_alat = 0;
                //                         (float)$billing = 0;
                //                         // return($itm->ttl);
                //                         // die();
                //                     }
            }
            $datatatat = array(
                'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                'prosedur_bedah' => (float)$prosedur_bedah,
                'konsultasi' => (float)$konsultasi,
                'tenaga_ahli' => (float)$tenaga_ahli,
                'keperawatan' => (float)$keperawatan,
                'penunjang' => (float)$penunjang,
                'radiologi' => (float)$radiologi,
                'deposit' => (float)$deposit,
                'billing' => (float)$billing,
                // 'billing' => $this->getDepositPasien($pelayanan[0]->noregistrasi),
                // 'sudahbayar' => (float)$sudahbayar,
                'laboratorium' => (float)$laboratorium,
                'pelayanan_darah' => (float)$pelayanan_darah,
                'rehabilitasi' => (float)$rehabilitasi,
                'kamar' => (float)$kamar,
                'rawat_intensif' => (float)$rawat_intensif,
                'obat' => (float)$obat,
                'obat_kronis' => (float)$obat_kronis,
                'obat_kemoterapi' => (float)$obat_kemoterapi,
                'alkes' => (float)$alkes,
                'bmhp' => (float)$bmhp,
                'sewa_alat' => (float)$sewa_alat,
                'namakamar' => $namakamar,
                'terbilang' => ucwords($this->makeTerbilang($billing, ' rupiah')),
                'isi' => $isi,
            );
            $prosedur_non_bedah =0;
            $prosedur_bedah =0;
            $konsultasi =0;
            $tenaga_ahli =0;
            $keperawatan =0;
            $penunjang =0;
            $radiologi =0;
            $laboratorium =0;
            $pelayanan_darah =0;
            $rehabilitasi =0;
            $kamar =0;
            $rawat_intensif =0;
            $obat =0;
            $obat_kronis =0;
            $obat_kemoterapi =0;
            $alkes =0;
            $bmhp =0;
            $sewa_alat =0;
            $data[$i]->tarif_rs = $datatatat;
            
            $cpt = '';
            $cppt = '';
            $emrigd = '';
            $datacptandcppt = \DB::table('emrpasien_t as emrp')
                ->select('emrp.jenisemr', 'emrp.noemr')
                ->where('emrp.noregistrasifk', $item->noregistrasi)
                ->whereIn('emrp.jenisemr', ['catatandokter', 'catatankeperawatan', 'emrigd'])
                ->get();

            foreach ($datacptandcppt as $itemcptandcppt) {
                if($itemcptandcppt->jenisemr == 'catatankeperawatan') {
                    $cpt = $itemcptandcppt->noemr;
                } else if($itemcptandcppt->jenisemr == 'catatandokter') {
                    $cppt = $itemcptandcppt->noemr;
                } else if($itemcptandcppt->jenisemr == 'emrigd') {
                    $emrigd = $itemcptandcppt->noemr;
                }
            }
            $data[$i]->cpt = $cpt;
            $data[$i]->cppt = $cppt;
            $data[$i]->emrigd = $emrigd;

            $i= $i + 1 ;
//            $dataTarif16 = DB::select(DB::raw("select kpb.id,kpb.namaexternal,sum(x.total) as ttl
//                from kelompokprodukbpjs_m kpb
//                left JOIN
//                (select (pp.hargajual - pp.hargadiscount) * pp.jumlah as total ,pr.objectkelompokprodukbpjsfk
//                from produk_m as pr
//                INNER JOIN pelayananpasien_t as pp on pr.id=pp.produkfk
//                INNER JOIN antrianpasiendiperiksa_t as apd on pp.noregistrasifk=apd.norec
//                INNER JOIN pasiendaftar_t as pd on apd.noregistrasifk=pd.norec
//                where pd.norec='$norecpd' ) as x
//                on x.objectkelompokprodukbpjsfk=kpb.id
//                where kpb.id <> 0
//                group by kpb.id,kpb.namaexternal
//                order by kpb.id")
//            );



        }
        return($data);
        die();

//        return $this->respond(array(
//            'data1' => $dataTarif16,
//            'data2' =>$data,
//        ));
        return $this->respond($data);
    }
    public function getCariSetFormInacbg(Request $request)
    {
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }
        $data = \DB::table('pasiendaftar_t as pd')
                ->join('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
                ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                // ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pas.objectasuransipasienfk')
                ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
                ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('diagnosaberatbadanbayi_t as dbb', 'dbb.noregistrasifk', '=', 'pd.norec')
                ->select('pd.norec as noregistrasifk','pas.nosep','hg.cbgcode','pas.nokepesertaan','pd.noregistrasi',
                'kls2.reportdisplay as namakelas','ps.tgllahir','pg.namalengkap as namadokter',
                'pd.objectstatuspulangfk','pd.objectruanganlastfk','pd.nocmfk',
                'dbb.beratbadan','hg.cbgdescription','ps.nocm','ps.namapasien','ps.objectjeniskelaminfk',
                'kls2.nourut as nokelasdijamin',
                'ps.noidentitas',
                DB::raw("pd.tglregistrasi,
                        pd.tglpulang,
                        case when pd.objectkelompokpasienlastfk=2 then 'JKN' else 'Belum Dimapping' end as jaminan,
                        case when pd.objectkelompokpasienlastfk=2 then '3' else 'Belum Dimapping' end as kodejaminan,
                        case when ru.objectdepartemenfk=16 then 'RI' else 'RJ' end as tipe,
                        case when ru.objectdepartemenfk=16 then '1' else '2' end as jenisrawat,
                        hg.status as statusgrouping,case when hg.totalpiutangpenjamin is null then 0 else hg.totalpiutangpenjamin end as totalpiutangpenjamin,
                        hg.biayanaikkelas"))
                ->whereNull('br.norec')
                ->where('pd.objectrekananfk','<>','5906')
                ->whereNotNull('pd.tglpulang');
        $filter = $request->all();
    
        $data = $data->where('pd.noregistrasi', '=', $filter['nosep']);
        
        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->take(1);
        $data = $data->get();

        // return($data[0]->noregistrasifk);
        // die();
        $noregistrasifk= $data[0]->noregistrasifk;
        $hakkelas= $data[0]->namakelas;

        if($hakkelas=='Non Kelas'){
            $b=0;
        }else if($hakkelas=='kelas_3'){
            $b=1;
        }else if($hakkelas=='kelas_2'){
            $b=2;
        }else if($hakkelas=='kelas_1'){
            $b=3;
        }else if($hakkelas=='vip') {
            $b = 4;
        }else if($hakkelas==''){
            $b=0;
        }

        $datas = DB::select(DB::raw("
          select * from ( select tglmasuk,tglkeluar,kelas_m.reportdisplay,	
            CASE antrianpasiendiperiksa_t.objectkelasfk WHEN 6 THEN  0
            WHEN 1 THEN  1  WHEN 2 THEN 2 WHEN 3 THEN 3  WHEN 4 THEN  4
            WHEN 7 THEN  0 WHEN 5 THEN  0
            ELSE 1 END AS derajatkelas ,israwattitipan
            from 
                antrianpasiendiperiksa_t
            INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id
            INNER JOIN ruangan_m as ru on ru.id=antrianpasiendiperiksa_t.objectruanganfk
            where antrianpasiendiperiksa_t.noregistrasifk ='$noregistrasifk' and antrianpasiendiperiksa_t.statusenabled=true and ru.objectdepartemenfk=16  ) as x where  x.derajatkelas>$b order by x.derajatkelas asc 
            ")
        );

        $datass = DB::select(DB::raw("select tglmasuk,tglkeluar from antrianpasiendiperiksa_t where objectruanganfk in ('905','740','904') and 
                noregistrasifk='$noregistrasifk' and tglkeluar is not null order by tglmasuk asc"));

        $statusrawatintensiv='0';
        $lamarawatintensivaa=0;
        foreach($datass as $item){

            $statusrawatintensiv='1';
            $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
            $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
            if($tglmasuk==$tglkeluar){
                $lamarawatintensiv = '1';
            }else{
                $tglmasuk = strtotime($tglmasuk);
                $tglkeluar = strtotime($tglkeluar);
                $diffs= $tglkeluar-$tglmasuk;
                $dayss = floor($diffs / (3600 * 24));;
                $lamarawatintensiv = $dayss;

            }
            $lamarawatintensivaa= $lamarawatintensivaa + $lamarawatintensiv;
        }

        $statusnaikkelas='0';
        $kelastertinggi='';
        $lamarawatnaikkelass=0;
        // return($datas);
        // die();
        foreach($datas as $item){
            if($item->israwattitipan==false){
                $statusnaikkelas = '1';
            }
            

            $kelastertinggi = $item->reportdisplay;
            $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
            $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
            if($tglmasuk==$tglkeluar){
                $lamarawatnaikkelas = '1';
            }else{
                $tglmasuk = strtotime($tglmasuk);
                $tglkeluar = strtotime($tglkeluar);
                $diff= $tglkeluar-$tglmasuk;
                $days = floor($diff / (3600 * 24));;
                $lamarawatnaikkelas = $days;

            }
            $lamarawatnaikkelass= $lamarawatnaikkelass + $lamarawatnaikkelas;
        }

        $datanaikkelas []= array(
            'statusnaikkelas' => $statusnaikkelas,
            'kelastertinggi' => $kelastertinggi,
            'lamarawatnaikkelas' => $lamarawatnaikkelass,
            'statusrawatintensiv' =>$statusrawatintensiv,
            'lamarawatintensiv' =>$lamarawatintensivaa,
        );

        $dataTarif16 = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select('kpb.namaexternal', 'kamar.namakamar',DB::raw("pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl"))
            ->where('pd.norec',$noregistrasifk)
            ->whereNull('br.norec')
            ->where('kp.id', 2)
            ->groupBy('pd.norec','kpb.namaexternal', 'kamar.namakamar', 'apd.tglmasuk')
            ->orderBy('apd.tglmasuk')
            ->get();
        
        $riwayatinap = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->select( 'ru.namaruangan','apd.tglmasuk','apd.tglkeluar','pd.noregistrasi','kamar.namakamar')
            ->where('pd.norec', $noregistrasifk)
            ->where('ru.objectdepartemenfk','16')
            ->where('apd.statusenabled', true)
            ->orderBy('apd.tglmasuk')
            ->get();
            $isi="";
            $namakamar ='';
            
            foreach ($riwayatinap as $x) {
                $isi=$isi.' '.$x->namaruangan.' Tgl.Masuk '.$x->tglmasuk.' \ '.$x->tglkeluar.' # ';
                if ($x->namakamar != null) {
                    $namakamar = $x->namakamar;
                }
            }

        $prosedur_non_bedah ='';
        $prosedur_bedah ='';
        $konsultasi ='';
        $tenaga_ahli ='';
        $keperawatan ='';
        $penunjang ='';
        $radiologi ='';
        $laboratorium ='';
        $pelayanan_darah ='';
        $rehabilitasi ='';
        $kamar ='';
        $rawat_intensif ='';
        $obat ='';
        $obat_kronis ='';
        $obat_kemoterapi ='';
        $alkes ='';
        $bmhp ='';
        $sewa_alat ='';
        (float)$billing = 0;

        foreach ($dataTarif16 as $itm){
            if ($itm->namaexternal == 'prosedur_non_bedah'){
                $prosedur_non_bedah = (float)$prosedur_non_bedah+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'prosedur_bedah'){
                $prosedur_bedah = (float)$prosedur_bedah+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'konsultasi'){
                $konsultasi = (float)$konsultasi+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'tenaga_ahli'){
                $tenaga_ahli = (float)$tenaga_ahli+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'keperawatan'){
                $keperawatan = (float)$keperawatan+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'penunjang'){
                $penunjang = (float)$penunjang+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'radiologi'){
                $radiologi = (float)$radiologi+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'laboratorium'){
                $laboratorium = (float)$laboratorium+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'pelayanan_darah'){
                $pelayanan_darah = (float)$pelayanan_darah+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'rehabilitasi'){
                $rehabilitasi = (float)$rehabilitasi+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'kamar'){
                $kamar = (float)$kamar+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'rawat_intensif'){
                $rawat_intensif = (float)$rawat_intensif+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'obat'){
                $obat = (float)$obat+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'obat_kronis'){
                $obat_kronis = (float)$obat_kronis+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'obat_kemoterapi'){
                $obat_kemoterapi = (float)$obat_kemoterapi+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'alkes'){
                $alkes = (float)$alkes+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'bmhp'){
                $bmhp = (float)$bmhp+(float)$itm->ttl;
            }
            if ($itm->namaexternal == 'sewa_alat'){
                $sewa_alat = (float)$sewa_alat+(float)$itm->ttl;
            }
            (float)$billing = (float)$billing+(float)$itm->ttl;
        }
        $dataTarif = array(
            'prosedur_non_bedah' => (float)$prosedur_non_bedah,
            'prosedur_bedah' => (float)$prosedur_bedah,
            'konsultasi' => (float)$konsultasi,
            'tenaga_ahli' => (float)$tenaga_ahli,
            'keperawatan' => (float)$keperawatan,
            'penunjang' => (float)$penunjang,
            'radiologi' => (float)$radiologi,
            // 'deposit' => (float)$deposit,
            'billing' => (float)$billing,
            'laboratorium' => (float)$laboratorium,
            'pelayanan_darah' => (float)$pelayanan_darah,
            'rehabilitasi' => (float)$rehabilitasi,
            'kamar' => (float)$kamar,
            'rawat_intensif' => (float)$rawat_intensif,
            'obat' => (float)$obat,
            'obat_kronis' => (float)$obat_kronis,
            'obat_kemoterapi' => (float)$obat_kemoterapi,
            'alkes' => (float)$alkes,
            'bmhp' => (float)$bmhp,
            'sewa_alat' => (float)$sewa_alat,
            'namakamar' => $namakamar,
            'terbilang' => ucwords($this->makeTerbilang($billing, ' rupiah')),
            'isi' => $isi,
        );
        // return($dataTarif16);
        // die();
        $dataDiagnosa10 = \DB::table('pasiendaftar_t as pd')
            ->select(
                'dg.id',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddp.objectdiagnosafk',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'ddp.objectjenisdiagnosafk',
                'jd.jenisdiagnosa',
                'dp.norec as norec_diagnosapasien',
                'ddp.norec as norec_detaildpasien',
                'dp.ketdiagnosis',
                'ddp.keterangan',
                'ddp.tglinputdiagnosa',
                'apd.tglkeluar'
            )
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftJoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->whereIn('ru.objectdepartemenfk', [18, 16, 24,28,73,74])
            ->where('pd.norec', $noregistrasifk)
            ->orderBy('jd.jenisdiagnosa','asc');

        $dataDiagnosa10 = $dataDiagnosa10->get();
        $dataDiagnosa10Inacbg = '';
        foreach ($dataDiagnosa10 as $item2){
                $dataDiagnosa10Inacbg = $dataDiagnosa10Inacbg . '#' .  $item2->kddiagnosa;
            }

        $dataDiagnosa9 = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddt.objectdiagnosatindakanfk',
                'dt.kddiagnosatindakan',
                'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien',
                'ddt.norec as norec_detaildpasien',
                'dt.*',
                'ddt.keterangantindakan',
                'pg.namalengkap',
                'ddt.tglinputdiagnosa'
            )
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosatindakanpasien_t as dtp', 'dtp.objectpasienfk', '=', 'apd.norec')
            ->join('detaildiagnosatindakanpasien_t as ddt', 'ddt.objectdiagnosatindakanpasienfk', '=', 'dtp.norec')
            ->join('diagnosatindakan_m as dt', 'dt.id', '=', 'ddt.objectdiagnosatindakanfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddt.objectpegawaifk')
            ->where('pd.norec', $noregistrasifk);
        
        $dataDiagnosa9 = $dataDiagnosa9->get();
        $dataDiagnosa9Inacbg = '';
        foreach ($dataDiagnosa9 as $item2){
            $dataDiagnosa9Inacbg = $dataDiagnosa9Inacbg . '#' . $item2->kddiagnosatindakan;
        }

        $dataDiagnosaInacbg10 = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'dtp.norec as norec_diagnosapasien',
                'pg.namalengkap',
                'dtp.tglinputdiagnosa',
                'dtp.code',
                'dtp.description',
                'jd.jenisdiagnosa'
            )
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosainacbg_t as dtp', 'dtp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'dtp.objectpegawaifk')
            ->leftjoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'dtp.objectjenisdiagnosafk')
            ->where('dtp.jenisdiagnosainacbgfk','=','10')
            ->where('pd.norec', $noregistrasifk);
        $dataDiagnosaInacbg10 = $dataDiagnosaInacbg10->get();
        $dataDiagnosaInacbg10Inacbg = '';
        foreach ($dataDiagnosaInacbg10 as $item2){
            $dataDiagnosaInacbg10Inacbg = $dataDiagnosaInacbg10Inacbg . '#' . $item2->code;
        }

        $dataDiagnosaInacbg9 = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'dtp.norec as norec_diagnosapasien',
                'pg.namalengkap',
                'dtp.tglinputdiagnosa',
                'dtp.code',
                'dtp.description',
                'dtp.jumlah'
            )
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosainacbg_t as dtp', 'dtp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'dtp.objectpegawaifk')
            ->where('dtp.jenisdiagnosainacbgfk','=','9')
            ->where('pd.norec', $noregistrasifk);
        $dataDiagnosaInacbg9 = $dataDiagnosaInacbg9->get();
        $dataDiagnosaInacbg9Inacbg = '';
        foreach ($dataDiagnosaInacbg9 as $item2){
            if($item2->jumlah > 1){
                $dataDiagnosaInacbg9Inacbg = $dataDiagnosaInacbg9Inacbg . '#' . $item2->code.'+'.$item2->jumlah;
            }else{
                $dataDiagnosaInacbg9Inacbg = $dataDiagnosaInacbg9Inacbg . '#' . $item2->code;
            }
        }

        $result = array(
            'data' => $data,
            'datanaikkelas' => $datanaikkelas,
            'dataTarif'=>$dataTarif,
            'dataDiagnosa10'=>$dataDiagnosa10,
            'dataDiagnosa9'=>$dataDiagnosa9,
            'dataDiagnosa10Inacbg'=>substr($dataDiagnosa10Inacbg,1,strlen($dataDiagnosa10Inacbg)-1),
            'dataDiagnosa9Inacbg'=>substr($dataDiagnosa9Inacbg,1,strlen($dataDiagnosa9Inacbg)-1),
            'dataDiagnosaInacbg10'=>$dataDiagnosaInacbg10,
            'dataDiagnosaInacbg10Inacbg'=>substr($dataDiagnosaInacbg10Inacbg,1,strlen($dataDiagnosaInacbg10Inacbg)-1),
            'dataDiagnosaInacbg9'=>$dataDiagnosaInacbg9,
            'dataDiagnosaInacbg9Inacbg'=>substr($dataDiagnosaInacbg9Inacbg,1,strlen($dataDiagnosaInacbg9Inacbg)-1),
        );

        return $this->respond($result);
    }
    public function getCariHistoryDaftarPasien(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
                ->join('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
                ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                // ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
                ->select('pas.nosep','hg.cbgcode','pas.nokepesertaan','pd.noregistrasi',
                DB::raw("to_char( pd.tglregistrasi, 'DD/TMMon/YYYY' ) as tglmasuk,
                        to_char( pd.tglpulang, 'DD/TMMon/YYYY' ) as tglpulang,
                        case when pd.objectkelompokpasienlastfk=2 then 'JKN' else 'Belum Dimapping' end as jaminan,
                        case when ru.objectdepartemenfk=16 then 'RI' else 'RJ' end as tipe,
                        hg.status as statusgrouping"))
                ->whereNull('br.norec')
                ->where('pd.objectrekananfk','<>','5906')
                ->whereNotNull('pd.tglpulang');
        $filter = $request->all();
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            if(strlen($filter['nosep'])<9){
                $data = $data->where('ps.nocm', '=', $filter['nosep']);
            }else if(strlen($filter['nosep'])<11){
                $data = $data->where('pd.noregistrasi', '=', $filter['nosep']);
            }else {
                $data = $data->where('pas.nokepesertaan', '=', $filter['nosep']);
            }
        }
        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->take(50);
        $data = $data->get();

        return $this->respond($data);
    }
    public function getCariDaftarPasien(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
                ->join('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
                ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->select('ps.namapasien','ps.nocm','pas.nokepesertaan',
                DB::raw("to_char( ps.tgllahir, 'DD/TMMon/YYYY' ) as tgllahir"))
                ->whereNull('br.norec')
                ->where('pd.objectrekananfk','<>','5906')
                ->whereNotNull('pd.tglpulang');
        $filter = $request->all();
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            if(strlen($filter['nosep'])<9){
                $data = $data->where('ps.nocm', '=', $filter['nosep']);
            }else if(strlen($filter['nosep'])<11){
                $data = $data->where('pd.noregistrasi', '=', $filter['nosep']);
            }else {
                $data = $data->where('pas.nokepesertaan', '=', $filter['nosep']);
            }
        }
        $data = $data->orderBy('ps.nocm');
        $data =$data->groupBy('ps.nocm','ps.namapasien','ps.tgllahir','pas.nokepesertaan');
        $data = $data->take(5);
        $data = $data->get();
        $arr = [];
        foreach ($data as $item) {
            $arr[] = array(
                'nama' => $item->namapasien,
                'norm' => $item->nocm,
                'nokartu' => 'NOKARTU : ' . $item->nokepesertaan,
                'lahir' => 'TGLLAHIR : ' .$item->tgllahir,
            );
        }
        return $this->respond($arr);
    }
    public function getDaftarPasienV2(Request $request)
    {
        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            // ->leftjoin('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pas.objectasuransipasienfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('strukpelayananpenjamin_t as spp', 'sp.norec', '=', 'spp.nostrukfk')
            ->leftjoin('hasilgrouping_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('diagnosaberatbadanbayi_t as dbb', 'dbb.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('jenispasien_m as jp', 'jp.id', '=', 'pd.objectjenispasienfk')
            ->select('jk.jeniskelamin', 'pd.norec', 'pd.tglregistrasi', 'ps.id as nocmfk','ps.nocm', 'pd.noregistrasi','ru.id as idruangan', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien',
                'pd.tglpulang', 'pd.statuspasien', 'sp.nostruk', 'sbm.nosbm', 'sbm.totaldibayar', 'pg.id as pgid', 'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir','pd.objectruanganlastfk as ruanganid','pas.nosep','pas.norec as norec_pa','br.norec as norec_br',
                'pas.nokepesertaan','ps.tgllahir','ps.objectjeniskelaminfk','dept.id as deptid','kls.nourut as nokelasdaftar','kls2.nourut as nokelasdijamin',
                'kls.reportdisplay as namakelasdaftar','kls2.reportdisplay as namakelas', 'kls2.namakelas as namakelasini','pd.objectstatuspulangfk','spp.noverifikasi',
                'hg.biayanaikkelas','dbb.beratbadan','rk.id as idrekanan','pas.statuscovid','ps.noidentitas','pas.loscovid','ru.kdinternal','jp.jenispasien',
                'hg.cbgcode','hg.cbgdescription',
                DB::raw("case when hg.totalpiutangpenjamin is null then 0 else hg.totalpiutangpenjamin end as totalpiutangpenjamin, case when pd.isclaim='1' then 'ReView' else '' end as isclaim,
                case when hg.status is null then 'BELUM' else hg.status end as statusgrouping,case when pd.objectjenispasienfk is null then  1 else pd.objectjenispasienfk end as statuskemo"))
            ->whereNull('br.norec')
            ->where('pd.objectrekananfk','<>','5906')
            // ->where('pas.nosep','<>','') //ini di lepasin atas permintaan bg jho
            // ->whereNotNull('pas.nosep')// ini di lepasin atas permintaan bg jho
            ->whereNotNull('pd.tglpulang');

//            ->where('apd.objectruanganasalfk',null);

        $filter = $request->all();
        // return($filter['tglAwal']);
        // die();
        // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
        //     $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        // }
        // if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
        //     $tgl = $filter['tglAkhir'];//." 23:59:59";
        //     $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        // }
        if (isset($filter['noSep']) && $filter['noSep'] != "" && $filter['noSep'] != "undefined") {
            if(strlen($filter['noSep'])<9){
                $data = $data->where('ps.nocm', '=', $filter['noSep']);
            }else if(strlen($filter['noSep'])<11){
                $data = $data->where('pd.noregistrasi', '=', $filter['noSep']);
            }else if(strlen($filter['noSep'])<14){
                $data = $data->where('pas.nokepesertaan', '=', $filter['noSep']);
            }else{
                $data = $data->where('pas.nosep', '=', $filter['noSep']);
            }
        }
       
        // $paramKel  ='';
        // if(isset($request['kelId']) && $request['kelId']!="" && $request['kelId']!="undefined"){
        //     $arrKel = explode(',',$request['kelId']) ;
        //     $kodeKel = [];
        //     foreach ( $arrKel as $item){
        //         $kodeKel[] = (int) $item;
        //     }
            $paramKel = ' and kp.id in (2)';
            $data = $data->where('kp.id',2);
        // }
        // if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
        //     $data = $data->where('pg.id', '=', $filter['dokId']);
        // }
        // if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
        //     $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        // }
        // if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
        //     $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%');
        // }
        // if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
        //     $data = $data->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        // }
        // if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
        //     $data = $data->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        // }
        // if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
        //     $data = $data->where('pas.nosep', '=', $filter['nosep']);
        // }
        // if (isset($filter['grouping']) && $filter['grouping'] != "" && $filter['grouping'] != "undefined") {
        //     $data = $data->whereNotNull('hg.status');
        // }
       
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->take(10);
        $data = $data->get();
        if(count($data)==0){
            return($data);
            die();    
        }

        // return($data);
        // die();
        $i = 0 ;
        $dtdt = '';
        
        foreach ($data as $dataPasien) {
            $inNorecPd[] = $dataPasien->norec;
            $inNorecPdRaw[] = $dataPasien->noregistrasi;
        }
        // return($inNorecPdRaw);
        // die();
        
        $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosa','apd.objectasalrujukanfk','pd.norec')
           ->whereIn('apd.noregistrasifk',$inNorecPd)
            ->wherein('dp.objectjenisdiagnosafk',array(1,2))
            // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
			->orderBy('dp.objectjenisdiagnosafk', 'asc')
            ->get();
        //     return($dataDiagnosa);
        // die();
        foreach ($data as $item){
            $dtdt = '';
            $asalRujukan = '';
            $covid19_status_cd = '';
            foreach ($dataDiagnosa as $item2){
                if ($item2->norec == $item->norec){
                    $dtdt = $dtdt . '#' .  $item2->kddiagnosa;
                    $asalRujukan = $item2->objectasalrujukanfk;
                }
            }
            $data[$i]->icd10 = substr($dtdt,1,strlen($dtdt)-1);
            $data[$i]->codernik = $codernik;
            $data[$i]->objectasalrujukanfk = $asalRujukan;
            $data[$i]->kodetarif = $kodetarif;
            $i= $i + 1 ;
        }

        $i = 0 ;
        $dtdt = '';
        $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosatindakan','pd.norec')
           ->whereIn('apd.noregistrasifk',$inNorecPd)
            // ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            // ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->get();
        foreach ($data as $item){
            $dtdt = '';

            foreach ($dataICD9 as $item2){
                if ($item2->norec == $data[$i]->norec) {
                    $dtdt = $dtdt . '#' . $item2->kddiagnosatindakan;
                }
            }
            $data[$i]->icd9 = substr($dtdt,1,strlen($dtdt)-1);
            $i= $i + 1 ;
        }

        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        // $dataTarif16 = DB::select(DB::raw("select pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal, kamar.namakamar
        //     from pasiendaftar_t as pd
        //     inner join pasien_m as ps on ps.id = pd.nocmfk
        //     INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        //     LEFT OUTER JOIN kamar_m as kamar on kamar.id=apd.objectkamarfk
        //     INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
        //     INNER JOIN produk_m as pr on pr.id=pp.produkfk
        //     INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
        //     left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
        //     left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //     where br.norec is null  and pd.noregistrasi in ($inNorecPdRaw)
        //     --pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir'  
        //     $paramKel
        //     group  by pd.norec,kpb.namaexternal, kamar.namakamar, apd.tglmasuk order by apd.tglmasuk")
        // );
        $dataTarif16 = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select('kpb.namaexternal', 'kamar.namakamar',DB::raw("pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl"))
            ->whereIn('pd.noregistrasi',$inNorecPdRaw)
            ->whereNull('br.norec')
            ->where('kp.id', 2)
            ->groupBy('pd.norec','kpb.namaexternal', 'kamar.namakamar', 'apd.tglmasuk')
            ->orderBy('apd.tglmasuk')
            ->get();
        // return($dataTarif16);
        // die();
        $i = 0 ;
        $prosedur_non_bedah ='';
        $prosedur_bedah ='';
        $konsultasi ='';
        $tenaga_ahli ='';
        $keperawatan ='';
        $penunjang ='';
        $radiologi ='';
        $laboratorium ='';
        $pelayanan_darah ='';
        $rehabilitasi ='';
        $kamar ='';
        $rawat_intensif ='';
        $obat ='';
        $obat_kronis ='';
        $obat_kemoterapi ='';
        $alkes ='';
        $bmhp ='';
        $sewa_alat ='';
        $noregistrasi = '';

        // return($data);
        // die();
        
        foreach ($data as $item){
            
            $riwayatinap = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
                ->select( 'ru.namaruangan','apd.tglmasuk','apd.tglkeluar','pd.noregistrasi','kamar.namakamar')
                ->where('pd.noregistrasi', $item->noregistrasi)
                ->where('ru.objectdepartemenfk','16')
                ->where('apd.statusenabled', true)
                ->orderBy('apd.tglmasuk')
                ->get();
                $isi="";
                $namakamar ='';
                
                foreach ($riwayatinap as $x) {
                    $isi=$isi.' '.$x->namaruangan.' Tgl.Masuk '.$x->tglmasuk.' \ '.$x->tglkeluar.' # ';
                    if ($x->namakamar != null) {
                        $namakamar = $x->namakamar;
                    }
                }

             
            $billing ='';
            $deposit = '0';
        
            $norecpd= $data[$i]->norec;
            $totaldibayar = $data[$i]->totaldibayar;
            (float)$deposit = $deposit + $totaldibayar;
            (float)$billing = 0;
            foreach ($dataTarif16 as $itm){
               
                
                if ($itm->norec == $norecpd){

                    if ($itm->namaexternal == 'prosedur_non_bedah'){
                        $prosedur_non_bedah = (float)$prosedur_non_bedah+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'prosedur_bedah'){
                        $prosedur_bedah = (float)$prosedur_bedah+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'konsultasi'){
                        $konsultasi = (float)$konsultasi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'tenaga_ahli'){
                        $tenaga_ahli = (float)$tenaga_ahli+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'keperawatan'){
                        $keperawatan = (float)$keperawatan+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'penunjang'){
                        $penunjang = (float)$penunjang+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'radiologi'){
                        $radiologi = (float)$radiologi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'laboratorium'){
                        $laboratorium = (float)$laboratorium+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'pelayanan_darah'){
                        $pelayanan_darah = (float)$pelayanan_darah+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rehabilitasi'){
                        $rehabilitasi = (float)$rehabilitasi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'kamar'){
                        $kamar = (float)$kamar+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rawat_intensif'){
                        $rawat_intensif = (float)$rawat_intensif+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat'){
                        $obat = (float)$obat+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kronis'){
                        $obat_kronis = (float)$obat_kronis+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kemoterapi'){
                        $obat_kemoterapi = (float)$obat_kemoterapi+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'alkes'){
                        $alkes = (float)$alkes+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'bmhp'){
                        $bmhp = (float)$bmhp+(float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'sewa_alat'){
                        $sewa_alat = (float)$sewa_alat+(float)$itm->ttl;
                    }
                    (float)$billing = (float)$billing+(float)$itm->ttl;
                }
                
            }
            $datatatat = array(
                'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                'prosedur_bedah' => (float)$prosedur_bedah,
                'konsultasi' => (float)$konsultasi,
                'tenaga_ahli' => (float)$tenaga_ahli,
                'keperawatan' => (float)$keperawatan,
                'penunjang' => (float)$penunjang,
                'radiologi' => (float)$radiologi,
                'deposit' => (float)$deposit,
                'billing' => (float)$billing,
                // 'billing' => $this->getDepositPasien($pelayanan[0]->noregistrasi),
                // 'sudahbayar' => (float)$sudahbayar,
                'laboratorium' => (float)$laboratorium,
                'pelayanan_darah' => (float)$pelayanan_darah,
                'rehabilitasi' => (float)$rehabilitasi,
                'kamar' => (float)$kamar,
                'rawat_intensif' => (float)$rawat_intensif,
                'obat' => (float)$obat,
                'obat_kronis' => (float)$obat_kronis,
                'obat_kemoterapi' => (float)$obat_kemoterapi,
                'alkes' => (float)$alkes,
                'bmhp' => (float)$bmhp,
                'sewa_alat' => (float)$sewa_alat,
                'namakamar' => $namakamar,
                'terbilang' => ucwords($this->makeTerbilang($billing, ' rupiah')),
                'isi' => $isi,
            );
            $prosedur_non_bedah =0;
            $prosedur_bedah =0;
            $konsultasi =0;
            $tenaga_ahli =0;
            $keperawatan =0;
            $penunjang =0;
            $radiologi =0;
            $laboratorium =0;
            $pelayanan_darah =0;
            $rehabilitasi =0;
            $kamar =0;
            $rawat_intensif =0;
            $obat =0;
            $obat_kronis =0;
            $obat_kemoterapi =0;
            $alkes =0;
            $bmhp =0;
            $sewa_alat =0;
            $data[$i]->tarif_rs = $datatatat;
            
            $cpt = '';
            $cppt = '';
            $emrigd = '';
            $datacptandcppt = \DB::table('emrpasien_t as emrp')
                ->select('emrp.jenisemr', 'emrp.noemr')
                ->where('emrp.noregistrasifk', $item->noregistrasi)
                ->whereIn('emrp.jenisemr', ['catatandokter', 'catatankeperawatan', 'emrigd'])
                ->get();

            foreach ($datacptandcppt as $itemcptandcppt) {
                if($itemcptandcppt->jenisemr == 'catatankeperawatan') {
                    $cpt = $itemcptandcppt->noemr;
                } else if($itemcptandcppt->jenisemr == 'catatandokter') {
                    $cppt = $itemcptandcppt->noemr;
                } else if($itemcptandcppt->jenisemr == 'emrigd') {
                    $emrigd = $itemcptandcppt->noemr;
                }
            }
            $data[$i]->cpt = $cpt;
            $data[$i]->cppt = $cppt;
            $data[$i]->emrigd = $emrigd;

            $i= $i + 1 ;




        }
        return($data);
        die();


        return $this->respond($data);
    }
    public function getComboInaCbg(Request $request)
    {
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $darah = \DB::table('ruangan_m as ru')
            ->where('ru.kdruangan', '41')
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->orderBy('dept.namadepartemen')
            ->get();

        $departemen = \DB::table('departemen_m as dept')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [18, 16])
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->whereIn('ru.objectdepartemenfk',[16,17,25,35])
//            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled',true)
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
            ->select('kl.id', 'kl.reportdisplay','kl.namakelas')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();

        $pembatalan = \DB::table('pembatal_m as p')
            ->select('p.id', 'p.name')
            ->where('p.statusenabled', true)
            ->orderBy('p.name')
            ->get();

        $kdPelayananRanap = \DB::table('settingdatafixed_m as p')
            ->select('p.nilaifield')
            ->where('p.statusenabled', true)
            ->where('p.namafield','kddeptlayananRI')
            ->first();

        $kdPelayananOk = \DB::table('settingdatafixed_m as p')
            ->select('p.nilaifield')
            ->where('p.statusenabled', true)
            ->where('p.namafield','KdPelayananOk')
            ->first();

        $dataKelompokTanpaUmum = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->where('kp.id', '<>', 1)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataJenisPasien = \DB::table('jenispasien_m as kp')
            ->select('kp.id', 'kp.jenispasien as name')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.jenispasien')
            ->get();

        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'darah' => $darah,
            'dept' => $dept,
            'ruanganRi' => $ruanganRi,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'pembatalan' => $pembatalan,
            'deptt' => $departemen,
//            'rekanan' => $dataRekanan,
            'kelompokpasiensatu' => $dataKelompokTanpaUmum,
            'kddeptlayananranap' => $kdPelayananRanap,
            'kddeptlayananok' => $kdPelayananOk,
            'dataJenisPasien' => $dataJenisPasien,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarPasienInformasiTanggungan(Request $request)
    {

        $data  = \DB::table('settingdatafixed_m')
            ->select('namafield','nilaifield')
            ->where('keteranganfungsi','inacbg')
            ->get();
        foreach ($data as $item){
            if ($item->namafield == 'codernik'){
                $codernik = $item->nilaifield;
            }
            if ($item->namafield == 'key'){
                $key = $item->nilaifield;
            }
            if ($item->namafield == 'url'){
                $url = $item->nilaifield;
            }
            if ($item->namafield == 'kodetarif'){
                $kodetarif = $item->nilaifield;
            }
        }

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
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pas.objectasuransipasienfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('informasitanggungansementara_t as hg', 'hg.noregistrasifk', '=', 'pd.norec')
//            ->leftjoin('diagnosaberatbadanbayi_t as dbb', 'dbb.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->select('pd.norec', 'pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien',
                'pd.tglpulang', 'pd.statuspasien', 'sp.nostruk', 'sbm.nosbm', 'pg.id as pgid', 'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir','pd.objectruanganlastfk as ruanganid','pas.nosep','pas.norec as norec_pa','br.norec as norec_br',
                'pas.nokepesertaan','ps.tgllahir','ps.objectjeniskelaminfk','dept.id as deptid','kls.nourut as nokelasdaftar','kls2.nourut as nokelasdijamin',
                'kls.reportdisplay as namakelasdaftar','kls2.reportdisplay as namakelas','pd.objectstatuspulangfk','hg.totalpiutangpenjamin','hg.biayanaikkelas',
//                'dbb.beratbadan',
                'rk.id as idrekanan')
            ->whereNull('br.norec')
            ->where('pas.nosep','<>','')
            ->whereNotNull('pas.nosep')
            ->whereNull('pd.tglpulang');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $arr = explode(',',$filter['kelId']);

            $kode = [];
            foreach ($arr as $itm){
                $kode[]= $itm;
            }

            $data = $data->whereIn('kp.id', $kode);
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
        if (isset($filter['nosep']) && $filter['nosep'] != "" && $filter['nosep'] != "undefined") {
            $data = $data->where('pas.nosep', '=', $filter['nosep']);
        }
        if (isset($filter['kelasId']) && $filter['kelasId'] != "" && $filter['kelasId'] != "undefined") {
            $data = $data->where('kls.id', '=', $filter['kelasId']);
        }

        $data = $data->orderBy('pd.noregistrasi');

        $data = $data->get();
//        return $this->respond($data);
        // return($data);
        // die();
        $i = 0 ;
        $dtdt = '';

        $dataDiagnosa = \DB::table('detaildiagnosapasien_t as dp')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'dp.objectdiagnosafk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosa','apd.objectasalrujukanfk','pd.norec')
            ->wherein('dp.objectjenisdiagnosafk',array(1,2))
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->get();
        foreach ($data as $item){
            $dtdt = '';
            $asalRujukan = '';

            foreach ($dataDiagnosa as $item2){
                if ($item2->norec == $data[$i]->norec){
                    $dtdt = $dtdt . '#' .  $item2->kddiagnosa;
                    $asalRujukan = $item2->objectasalrujukanfk;
                }
            }
            $data[$i]->icd10 = substr($dtdt,1,strlen($dtdt)-1);
            $data[$i]->codernik = $codernik;
            $data[$i]->objectasalrujukanfk = $asalRujukan;
            $data[$i]->kodetarif = $kodetarif;
            $i= $i + 1 ;
        }


        $i = 0 ;
        $dtdt = '';
        $dataICD9 = \DB::table('diagnosatindakanpasien_t as dpa')
            ->join('detaildiagnosatindakanpasien_t as dp', 'dpa.norec', '=', 'dp.objectdiagnosatindakanpasienfk')
            ->join('diagnosatindakan_m as dg', 'dg.id', '=', 'dp.objectdiagnosatindakanfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'dpa.objectpasienfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('dg.kddiagnosatindakan','pd.norec')
            //            ->where('apd.noregistrasifk',$data[$i]->norec)
            ->where('pd.tglregistrasi', '>=', $filter['tglAwal'])
            ->where('pd.tglregistrasi', '<=', $filter['tglAkhir'])
            ->get();
        foreach ($data as $item){
            $dtdt = '';
            foreach ($dataICD9 as $item2){
                if ($item2->norec == $data[$i]->norec) {
                    $dtdt = $dtdt . '#' . $item2->kddiagnosatindakan;
                }
            }
            $data[$i]->icd9 = substr($dtdt,1,strlen($dtdt)-1);
            $i= $i + 1 ;
        }

        $tglawalawal = $filter['tglAwal'];
        $tglakhirakhir = $filter['tglAkhir'];
        $kelompokPasien=$filter['kelId'];
        $dataTarif16 = DB::select(DB::raw("select pd.norec, 
            sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal
            from pasiendaftar_t as pd
            inner join pasien_m as ps on ps.id = pd.nocmfk
            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            INNER JOIN produk_m as pr on pr.id=pp.produkfk
            INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
            left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
            left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
            where br.norec is null  and 
            pd.tglregistrasi >= '$tglawalawal' and pd.tglregistrasi <= '$tglakhirakhir' and kp.id in ($kelompokPasien)
            group  by pd.norec,kpb.namaexternal order by pd.norec")
        );

//        return $this->respond($dataTarif16);
        $i = 0 ;
        $prosedur_non_bedah ='';
        $prosedur_bedah ='';
        $konsultasi ='';
        $tenaga_ahli ='';
        $keperawatan ='';
        $penunjang ='';
        $radiologi ='';
        $laboratorium ='';
        $pelayanan_darah ='';
        $rehabilitasi ='';
        $kamar ='';
        $rawat_intensif ='';
        $obat ='';
        $obat_kronis ='';
        $obat_kemoterapi ='';
        $alkes ='';
        $bmhp ='';
        $sewa_alat ='';
        foreach ($data as $item){
            $norecpd= $data[$i]->norec;
            $data[$i]->totaltagihan = $this->getTotalBiaya($data[$i]->noregistrasi);
            foreach ($dataTarif16 as $itm){
                if ($itm->norec == $norecpd){
                    if ($itm->namaexternal == 'prosedur_non_bedah'){
                        $prosedur_non_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'prosedur_bedah'){
                        $prosedur_bedah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'konsultasi'){
                        $konsultasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'tenaga_ahli'){
                        $tenaga_ahli = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'keperawatan'){
                        $keperawatan = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'penunjang'){
                        $penunjang = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'radiologi'){
                        $radiologi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'laboratorium'){
                        $laboratorium = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'pelayanan_darah'){
                        $pelayanan_darah = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rehabilitasi'){
                        $rehabilitasi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'kamar'){
                        $kamar = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'rawat_intensif'){
                        $rawat_intensif = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat'){
                        $obat = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kronis'){
                        $obat_kronis = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'obat_kemoterapi'){
                        $obat_kemoterapi = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'alkes'){
                        $alkes = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'bmhp'){
                        $bmhp = (float)$itm->ttl;
                    }
                    if ($itm->namaexternal == 'sewa_alat'){
                        $sewa_alat = (float)$itm->ttl;
                    }
                }
            }

            $datatatat = array(
                'prosedur_non_bedah' => (float)$prosedur_non_bedah,
                'prosedur_bedah' => (float)$prosedur_bedah,
                'konsultasi' => (float)$konsultasi,
                'tenaga_ahli' => (float)$tenaga_ahli,
                'keperawatan' => (float)$keperawatan,
                'penunjang' => (float)$penunjang,
                'radiologi' => (float)$radiologi,
                'laboratorium' => (float)$laboratorium,
                'pelayanan_darah' => (float)$pelayanan_darah,
                'rehabilitasi' => (float)$rehabilitasi,
                'kamar' => (float)$kamar,
                'rawat_intensif' => (float)$rawat_intensif,
                'obat' => (float)$obat,
                'obat_kronis' => (float)$obat_kronis,
                'obat_kemoterapi' => (float)$obat_kemoterapi,
                'alkes' => (float)$alkes,
                'bmhp' => (float)$bmhp,
                'sewa_alat' => (float)$sewa_alat,
            );
            $prosedur_non_bedah =0;
            $prosedur_bedah =0;
            $konsultasi =0;
            $tenaga_ahli =0;
            $keperawatan =0;
            $penunjang =0;
            $radiologi =0;
            $laboratorium =0;
            $pelayanan_darah =0;
            $rehabilitasi =0;
            $kamar =0;
            $rawat_intensif =0;
            $obat =0;
            $obat_kronis =0;
            $obat_kemoterapi =0;
            $alkes =0;
            $bmhp =0;
            $sewa_alat =0;
            $data[$i]->tarif_rs = $datatatat;

            $i= $i + 1 ;
        }
            return $this->respond($data);

    }
    protected  function getTotalBiaya ($noregis){
        $data = DB::select(DB::raw("SELECT 
            sum((((pp.hargasatuan - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end ) 
            -(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah)) as total
            FROM
            pelayananpasien_t AS pp
            INNER JOIN antrianpasiendiperiksa_t AS apd ON pp.noregistrasifk= apd.norec
            INNER JOIN pasiendaftar_t AS pd ON apd.noregistrasifk = pd.norec
            WHERE pd.noregistrasi='$noregis'"));
        $total = 0;
        if(count($data )> 0){
            $total = (float) $data[0]->total;
        }
        return $total;
    }
    protected  function getTotalBiayaRS ($norec_pd){
        $data = DB::select(DB::raw("SELECT 
            sum((((pp.hargasatuan - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end ) 
            -(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah)) as total
            FROM
            pelayananpasien_t AS pp
            INNER JOIN antrianpasiendiperiksa_t AS apd ON pp.noregistrasifk= apd.norec
            INNER JOIN pasiendaftar_t AS pd ON apd.noregistrasifk = pd.norec
            WHERE pd.norec='$norec_pd'"));
        $total = 0;
        if(count($data )> 0){
            $total = (float) $data[0]->total;
        }
        return $total;
    }
    public function getStatusNaikKelas(Request $request)
    {
        $data =[];
        // return($request['noreg']);
        // die();
        // foreach ($request['data'] as $items){

            $noregistrasifk= $request['noreg'] ;//$request['noreg'];
            $hakkelas= $request['namakelas'];///$request['namakelas'];

            if($hakkelas=='Non Kelas'){
                $b=0;
            }else if($hakkelas=='kelas_3'){
                $b=1;
            }else if($hakkelas=='kelas_2'){
                $b=2;
            }else if($hakkelas=='kelas_1'){
                $b=3;
            }else if($hakkelas=='vip') {
                $b = 4;
            }else if($hakkelas==''){
                $b=0;
            }

        $datas = DB::select(DB::raw("
          select * from ( select tglmasuk,tglkeluar,reportdisplay,	
            CASE antrianpasiendiperiksa_t.objectkelasfk WHEN 6 THEN  0
            WHEN 1 THEN  1  WHEN 2 THEN 2 WHEN 3 THEN 3  WHEN 4 THEN  4
            WHEN 7 THEN  0 WHEN 5 THEN  0
            ELSE 1 END AS derajatkelas ,israwattitipan
            from 
                antrianpasiendiperiksa_t
            INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id
            where noregistrasifk ='$noregistrasifk'  ) as x where  x.derajatkelas>$b order by x.derajatkelas asc 
            ")
        );

        $datass = DB::select(DB::raw("select tglmasuk,tglkeluar from antrianpasiendiperiksa_t where objectruanganfk in ('905','740','904') and 
                noregistrasifk='$noregistrasifk' order by tglmasuk asc"));

        $statusrawatintensiv='0';
        $lamarawatintensivaa=0;
        foreach($datass as $item){

            $statusrawatintensiv='1';
            $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
            $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
            if($tglmasuk==$tglkeluar){
                $lamarawatintensiv = '1';
            }else{
                $tglmasuk = strtotime($tglmasuk);
                $tglkeluar = strtotime($tglkeluar);
                $diffs= $tglkeluar-$tglmasuk;
                $dayss = floor($diffs / (3600 * 24));;
                $lamarawatintensiv = $dayss;

            }
            $lamarawatintensivaa= $lamarawatintensivaa + $lamarawatintensiv;
        }

        $statusnaikkelas='0';
        $kelastertinggi='';
        $lamarawatnaikkelass=0;
        // return($datas);
        // die();
        foreach($datas as $item){
            if($item->israwattitipan==false){
                $statusnaikkelas = '1';
            }
            

            $kelastertinggi = $item->reportdisplay;
            $tglmasuk =date_format(date_create($item->tglmasuk),'Y-m-d');
            $tglkeluar =date_format(date_create($item->tglkeluar),'Y-m-d');
            if($tglmasuk==$tglkeluar){
                $lamarawatnaikkelas = '1';
            }else{
                $tglmasuk = strtotime($tglmasuk);
                $tglkeluar = strtotime($tglkeluar);
                $diff= $tglkeluar-$tglmasuk;
                $days = floor($diff / (3600 * 24));;
                $lamarawatnaikkelas = $days;

            }
            $lamarawatnaikkelass= $lamarawatnaikkelass + $lamarawatnaikkelas;
        }

            $data []= array(
                'nosep' => $request['nosep'],
                'norec_pd' => $request['noreg'] ,
                // 'deptid' => $items['deptid'] ,
                'statusnaikkelas' => $statusnaikkelas,
                'kelastertinggi' => $kelastertinggi,
                'lamarawatnaikkelas' => $lamarawatnaikkelass,
                'statusrawatintensiv' =>$statusrawatintensiv,
                'lamarawatintensiv' =>$lamarawatintensivaa,
            );
        // }
        return $this->respond($data);

    }
    public function updateStatusBridgingINACBG(Request $request){
        DB::beginTransaction();
        try{
               
                $hg=HasilGrouping::where('noregistrasifk',$request['noregistrasifk'])
                ->update([
                    // 'status' => "SEND CLAIM"
                    'status' => $request['status']
                ]);

                $transStatus = 'true';
                $transMessage = "Simpan Catatan Klaim Berhasil...! ";
        }catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Data ...! ";
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

             // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateStatusKondisiKhusus(Request $request){
        DB::beginTransaction();
        try{
               
                $hg=Pasiendaftar::where('noregistrasi',$request['noregistrasi'])
                ->update([
                    // 'status' => "SEND CLAIM"
                    'objectjenispasienfk' => $request['jenispasien']
                ]);

                $transStatus = 'true';
                $transMessage = "Simpan Kondisi Khusus Berhasil...! ";
        }catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Data ...! ";
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

             // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function savePengajuanKlaim(Request $request){
        DB::beginTransaction();
        try {
            return($request);
            die();
            $dt=PemakaianAsuransi::where('norec', $request['norec_pa'])
                        // ->where('statusenabled')
                        ->update([
                                'nosep' => $request['claim_number'],
                                'statuscovid' => 1,
                                'loscovid' => $request['loscovid']]
                        );
            
            $transStatus = 'true';
            $transMessage = "Simpan Nomor Pengajuan Klaim Berhasil...! ";

        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Pengajuan Klaim ...! ";
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

             // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveBeratBadan(Request $request)
    {
        DB::beginTransaction();
        try {
                $cek =  DiagnosaBeratBadanBayi::where('noregistrasifk',$request['noregistrasifk'])->first();
                
                if(empty($cek)){
                    $dbb = new DiagnosaBeratBadanBayi();
                    $dbb->norec =  $dbb->generateNewId();
                    $dbb->noregistrasifk = $request['noregistrasifk'];
                }else{
                    $dbb=$cek;
                }
                $dbb->beratbadan = $request['beratbadan'];
                $dbb->save();

            $transStatus = 'true';
            $transMessage = "Simpan Berat Badan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal  ";
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
    public function saveInformasiTanggungan(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request['proporsi'] as $item){
                $noregistrasifk = $item['noregistrasifk'];
                $totaldijamin = $item['totalDijamin'];
                $biayanaikkelas = $item['biayaNaikkelas'];

                $delete = DB::table('informasitanggungansementara_t')
                    ->where("noregistrasifk",$item['noregistrasifk'])
                    ->delete();

                $new = new InformasiTanggungan();
                $new->norec =  $new->generateNewId();
                $new->noregistrasifk = $noregistrasifk;
                $new->totalbiayars = $this->getTotalBiayaRS($noregistrasifk);
                $new->totalpiutangpenjamin = $totaldijamin;
                $new->biayanaikkelas = $biayanaikkelas;
                $new->save();
            }

            $transStatus = 'true';
            $transMessage = "Simpan Informasi Tanggungan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal  ";
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
    public function saveProposiBridgingINACBG(Request $request)
    {
        DB::beginTransaction();
        try {


            $noregistrasifk=$request['noregistrasifk'];
            $totaldijamin=$request['totalDijamin'];
            $biayanaikkelas=$request['biayaNaikkelas'];
            $cbgdescription=$request['cbgdescription'];
            $cbgcode=$request['cbgcode'];
            $b="";
            $c="";
            $d=[];
            $delete = DB::table('hasilgrouping_t')
                ->where("noregistrasifk",$request['noregistrasifk'])
                ->delete();



            $noregistrasifk_apd = AntrianPasiendiperiksa::where('noregistrasifk', $request['noregistrasifk'])->first();
            $noregistrasifk_apd=$noregistrasifk_apd['norec'];
            //     return($noregistrasifk_apd);
            //    die();
            $TotalBiayaRS = DB::select(DB::raw("select sum(pelayananpasien_t.hargasatuan) as totalbiayars
            FROM pasiendaftar_t INNER JOIN antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN pelayananpasien_t ON antrianpasiendiperiksa_t.norec = pelayananpasien_t.noregistrasifk
            where pasiendaftar_t.norec = '$noregistrasifk'")
            );
    
            foreach ($TotalBiayaRS as $item){
                $TotalBiayaRS = $item->totalbiayars;

            }

            $TotalBiayaPerTindakan = DB::select(DB::raw("select pelayananpasien_t.norec, CASE WHEN hargasatuan <> 0 THEN hargasatuan * jumlah ELSE 0 END AS totalbiayapertindakan, pelayananpasien_t.noregistrasifk, pelayananpasien_t.piutangpenjamin
            FROM pelayananpasien_t INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec
            where pasiendaftar_t.norec = '$noregistrasifk'")
            );
            //  return($TotalBiayaPerTindakan);
            //  die();
            foreach ($TotalBiayaPerTindakan as $item){
                if ($item->totalbiayapertindakan<>0){

                    $piutangpenjamin = ($item->totalbiayapertindakan / $TotalBiayaRS)*$totaldijamin;

                    $a=ceil($piutangpenjamin);

                    $dt=PelayananPasien::where('norec', $item->norec)
                        // ->where('statusenabled')
                        ->update([
                                'piutangpenjamin' => $a]
                        );
                }

                $TotalPiutangPenjamin = DB::select(DB::raw("select SUM(pelayananpasien_t.piutangpenjamin) AS totalpiutangpenjamin FROM pelayananpasien_t INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec
                where pasiendaftar_t.norec = '$noregistrasifk'")
                );
                foreach ($TotalPiutangPenjamin as $item){
                    $TotalPiutangPenjamin = $item->totalpiutangpenjamin;
                }
                $norecupdate = DB::select(DB::raw("select pelayananpasien_t.piutangpenjamin, pelayananpasien_t.norec FROM pelayananpasien_t INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec
                where pasiendaftar_t.norec = '$noregistrasifk' ORDER BY pelayananpasien_t.piutangpenjamin desc limit 1")
                );
                foreach ($norecupdate as $item){
                    $norecupdate = $item->norec;
                    $piutangpenjamintindakan = ceil($item->piutangpenjamin);
                }

                if($TotalPiutangPenjamin>$totaldijamin){
                    $d=$TotalPiutangPenjamin-$totaldijamin;
                    $piutangpenjamintindakan=$piutangpenjamintindakan-$d;

                    $dt=PelayananPasien::where('norec',$norecupdate)
                        ->update([
                            'piutangpenjamin' => $piutangpenjamintindakan
                        ]);
                }
                if($TotalPiutangPenjamin<$totaldijamin){
                    $d=$totaldijamin-$TotalPiutangPenjamin;
                    $piutangpenjamintindakan=$piutangpenjamintindakan+$d;

                    $dt=PelayananPasien::where('norec',$norecupdate)
                        ->update([
                            'piutangpenjamin' => $piutangpenjamintindakan
                        ]);
                }

                $transStatus = 'true';
                $transMessage = "Simpan Proposi Berhasil...! ";
            }
            $new = new HasilGrouping();
            $new->norec =  $new->generateNewId();
            $new->noregistrasifk = $noregistrasifk;
            $new->totalbiayars = $TotalBiayaRS;
            $new->totalpiutangpenjamin = $totaldijamin;
            $new->biayanaikkelas = $biayanaikkelas;
            $new->status = "GROUPING";
            $new->cbgcode = $cbgcode;
            $new->cbgdescription = $cbgdescription;
            // return($newRujukan);
            // die();
            $new->save();
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Data ...! ";
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

        // return 'sukses';
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

}