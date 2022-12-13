<?php
/**
 * Created by PhpStorm.
 * PiutangController
 * User: Efan Andrian (ea@epic)
 * Date: 02/10/2019
 * Time: 16:14 PM
 */

namespace App\Http\Controllers\Piutang;


use App\Http\Controllers\ApiController;
use App\Master\LoginUser;
use App\Traits\Valet;
use App\Transaksi\BPJSGagalKlaimTxt;
use App\Transaksi\BPJSKlaimTxt;
use App\Transaksi\PostingHutangPiutang;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukPelayananPenjamin;
use App\Transaksi\StrukPosting;
use App\Transaksi\SetoranPiutangJurnal;
use Ramsey\Uuid\Uuid;
use DB;
use Illuminate\Http\Request;

class PiutangController extends ApiController{
    use Valet;
    public function __construct(){
        parent::__construct($skip_authentication=false);
    }

    public function getDataComboPiutang(Request $request) {
        $dataLogin = $request->all();

        $dataKelompokPasien = \DB::table('kelompokpasien_m as ru')
            ->select('ru.id','ru.kelompokpasien')
            ->where('ru.statusenabled',true)
            ->orderBy('ru.kelompokpasien')
            ->get();

        $dataRekanan = \DB::table('rekanan_m as ru')
            ->where('ru.statusenabled',true)
            ->select('ru.id','ru.namarekanan')
            ->orderBy('ru.namarekanan')
            ->get();

        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id',[3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35])
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
            'kelompokpasien' => $dataKelompokPasien,
            'detaillogin' => $dataPegawaiUser,
            'rekanan' => $dataRekanan,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function gridJurnal(Request $request){
        $data = \DB::table('maptipelayanan_m as mp')
                ->join('mapjurnal_m as mj','mp.objectkelompokfk','=','mj.objectkelompoktransaksifk')
                ->join('chartofaccount_m as cf','cf.id','=','mj.objectcoadebitfk')
                ->join('chartofaccount_m as cf2','cf2.id','=','mj.objectcoakreditfk')
                ->select('mj.objectcoadebitfk','mj.objectcoakreditfk','cf.namaaccount as namaaccountdebit',
                    'cf2.namaaccount as namaaccountkredit',
                    'cf.noaccount as noaccountdebit',
                    'cf2.noaccount as noaccountkredit')
                ->where('mp.id','=',6);
                $data =$data->get();
        return ($data);
    }   
    public function daftarPiutang(Request $request){
        $filter = $request->all();

        $dataPiutang= \DB::table('strukpelayananpenjamin_t as spp')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'spp.nostrukfk')
            ->join('pasien_m as p', 'p.id', '=', 'sp.nocmfk')
            ->join('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('rekanan_m as rkn', 'rkn.id', '=', 'pd.objectrekananfk')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('postinghutangpiutang_t as php', 'php.nostrukfk', '=', 'spp.norec')
            ->leftjoin('strukposting_t as spt', 'spt.noposting', '=', 'php.noposting')
            ->select('kp.kelompokpasien', 'spp.norec','pd.tglpulang as tglstruk', 'pd.noregistrasi', 'pd.tglregistrasi','p.nocm',
                'p.namapasien','ru.namaruangan','spp.totalppenjamin','spp.totalharusdibayar',
                'spp.totalsudahdibayar',  'spp.totalbiaya', 'spp.noverifikasi','rkn.namarekanan','php.noposting','spt.statusenabled',
                'pd.norec as norec_pd','php.statusenabled as sttts','spp.setoranpiutangjurnalfk')
            ->whereNotNull('spp.noverifikasi')
            ->whereNull('sp.statusenabled');
//            ->where('spt.statusenabled',1);

        if(isset($filter['tglAwal']) && $filter['tglAwal']!=""){
            $dataPiutang = $dataPiutang->where('pd.tglpulang','>=', $filter['tglAwal']);
        }

        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!=""){
            $tgl= $filter['tglAkhir']." 23:59:59";
            $dataPiutang = $dataPiutang->where('pd.tglpulang','<=', $tgl);
        }

        if(isset($filter['kelompokpasienfk']) && $filter['kelompokpasienfk']!=""){
            $dataPiutang = $dataPiutang->where('pd.objectkelompokpasienlastfk','=', $filter['kelompokpasienfk']);
        }

        if(isset($filter['penjaminID']) && $filter['penjaminID']!=""){
            $dataPiutang = $dataPiutang->where('pd.objectkelompokpasienlastfk','=', $filter['penjaminID']);
        }
        if(isset($filter['rekananfk']) && $filter['rekananfk']!=""){
            $dataPiutang = $dataPiutang->where('pd.objectrekananfk','=', $filter['rekananfk']);
        }

        if(isset($filter['ruanganId']) && $filter['ruanganId']!=""){
            $dataPiutang = $dataPiutang->where('ru.id','=', $filter['ruanganId']);
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien']!=""){
            $dataPiutang = $dataPiutang->where('p.namapasien','like', '%'.$filter['namaPasien'].'%');
        }
        if(isset($filter['noregistrasi']) && $filter['noregistrasi']!=""){
            $dataPiutang = $dataPiutang->where('pd.noregistrasi','like', '%'.$filter['noregistrasi'].'');
        }
        if(isset($filter['nocm']) && $filter['nocm']!=""){
            $dataPiutang = $dataPiutang->where('p.nocm','=', $filter['nocm']);
        }
//        if(isset($filter['statuscollectingPiutang

        $dataPiutang =$dataPiutang->get();
        $result = array();
        foreach ($dataPiutang as $item) {
            if ($item->statusenabled ==  1 || is_null($item->statusenabled)) {
                if ($item->sttts == 1 || is_null($item->sttts)) {
                    if ($item->totalppenjamin >= $item->totalsudahdibayar) {
                        if (!isset($item->noposting)) {
                            $status = 'Piutang';
                        } else {
                            $status = 'Collecting';
                        }
                    } else {
                        $status = 'Lunas';
                    }

                    $result[] = array(
                        'noRec' => $item->norec,
                        'tglTransaksi' => $item->tglstruk,
                        'noRegistrasi' => $item->noregistrasi,
                        'namaPasien' => $item->namapasien,
                        'ruangan'=>$item->namaruangan,
                        'kelasRawat' => $item->kelompokpasien,
                        'jenisPasien' => $item->kelompokpasien,
                        'umur' => $this->hitungUmur($item->tglstruk),
                        'kelasPenjamin' => "-",
                        'totalBilling' => $item->totalbiaya,
                        'totalKlaim' => $item->totalppenjamin,
                        'totalBayar' => $item->totalsudahdibayar,
                        'rekanan' => $item->namarekanan,
                        'status' => $status,
                        'norec_pd' => $item->norec_pd,
                        'noposting' => $item->noposting,
                        'stts' => $item->statusenabled,
                        'setoranpiutangjurnalfk' => $item->setoranpiutangjurnalfk,
                    );
                }
            }
        }
        return $this->respond($result, 'Data Piutang Layanan');
    }

    public function daftarCollectedPiutang(Request $request){
        $filter = $request->all();
        $dataCollector = \DB::table('postinghutangpiutang_t as php')
            ->join('strukpelayananpenjamin_t as spp', 'spp.norec', '=', 'php.nostrukfk')
            ->join('strukpelayanan_t as spy', 'spy.norec', '=', 'spp.nostrukfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'spy.noregistrasifk')
            ->join('rekanan_m as rkn', 'rkn.id', '=', 'pd.objectrekananfk')
            ->join('strukposting_t as sp', 'sp.noposting', '=', 'php.noposting')
            ->join('loginuser_s as lu', 'sp.kdhistorylogins', '=', 'lu.id')
            ->join('pegawai_m as p', 'lu.objectpegawaifk', '=', 'p.id')
            ->select('sp.norec', 'sp.tglposting', 'php.noposting','rkn.id as idrekanan','rkn.namarekanan',
                'php.statusenabled','p.namalengkap',
                \DB::raw('SUM(spp.totalppenjamin) as totalpenjamin'), \DB::raw('sum(spp.totalsudahdibayar) as sumtotalsudahdibayar'), \DB::raw('count(php.noposting) as jlhpasien'));

        if(isset($filter['tglAwal']) && $filter['tglAwal']!=""){
            $dataCollector = $dataCollector->where('sp.tglposting','>=', $filter['tglAwal']);
        }

        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!=""){
            $tgl= $filter['tglAkhir']." 23:59:59";
            $dataCollector = $dataCollector->where('sp.tglposting','<=', $tgl);
        }

        if(isset($filter['status']) && $filter['status'] == "Collecting"){
            $dataCollector = $dataCollector->where('spp.totalsudahdibayar','=',0);
        }
        if(isset($filter['status']) && $filter['status'] == "Lunas"){
            $dataCollector = $dataCollector->where('spp.totalsudahdibayar','>', 0);
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien'] != ""){
            $dataCollector = $dataCollector->where('p.namalengkap','like', '%'.$filter['namaPasien'].'%');
        }
        if(isset($filter['noposting']) && $filter['noposting'] != ""){
            $dataCollector = $dataCollector->where('php.noposting','like', '%'.$filter['noposting'].'');
        }
        $dataCollector = $dataCollector->where('sp.statusenabled','=','1');
        $dataCollector = $dataCollector->where('php.statusenabled',1);

        $dataCollector=$dataCollector->groupBy('sp.norec', 'php.noposting', 'sp.tglposting','rkn.id','rkn.namarekanan','php.statusenabled',
            'p.namalengkap');
        $dataCollector =$dataCollector->get();

        $result = array();
        foreach ($dataCollector as $item) {
            $SP = StrukPosting::find($item->norec);
            $status='-';
            if($item->sumtotalsudahdibayar < $item->totalpenjamin ){
                $status = "Collecting";
            }elseif($item->sumtotalsudahdibayar == $item->totalpenjamin or $item->sumtotalsudahdibayar > $item->totalpenjamin){
                $status = "Lunas";
            }
            $result[] = array(
                'noPosting' => $item->noposting,
                'tglTransaksi' => $item->tglposting,
                'collector' => $item->namalengkap,//@$SP->login_user->pegawai->namalengkap,
                'jlhPasien' => $item->jlhpasien,
                'totalKlaim' => $item->totalpenjamin ,
                'status' => $status,
                'totalSudahDibayar' => $item->sumtotalsudahdibayar,
                'kelompokpasien' => "Perusahaan/Asuransi",
                'idrekanan' => $item->idrekanan,
                'namarekanan' => $item->namarekanan,
                'statusenabled' => $item->statusenabled,
            );
        }
        return $this->respond($result, 'Data Piutang yang sudah tercollecting');
    }

    public function collectedPiutang(Request $request, $noPosting){
        $dataSpp = \DB::table('strukpelayananpenjamin_t as spp')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'spp.nostrukfk')
            ->join('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            ->join('antrianpasiendiperiksa_t as ap', 'ap.norec', '=', 'pp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'ap.noregistrasifk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'sp.noregistrasifk')
            ->leftjoin('bpjsklaimtxt_t as bpjs', 'bpjs.sep', '=', 'pa.nosep')
            ->leftjoin('bpjsgagalklaimtxt_t as gagalbpjs', 'gagalbpjs.nosep', '=', 'pa.nosep')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('postinghutangpiutang_t as php', 'php.nostrukfk', '=', 'spp.norec')
            ->join('strukposting_t as stp', 'stp.noposting', '=', 'php.noposting')
            ->leftJoin('rekanan_m as r', 'r.id', '=', 'pd.objectrekananfk')
            ->leftJoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->select('kp.id as kpid','kp.kelompokpasien', 'spp.norec','stp.tglposting', 'pd.noregistrasi', 'pd.tglregistrasi','p.nocm',
                'p.namapasien','spp.totalppenjamin','spp.totalharusdibayar as tarifklaim','bpjs.TARIF_INACBG as tarifklaimbpjs',
                'spp.totalsudahdibayar','r.id as rknid', 'r.namarekanan', 'spp.totalbiaya', 'spp.noverifikasi', 'php.noposting','stp.kdhistorylogins',
                'kls.namakelas','stp.tglposting','p.tgllahir','gagalbpjs.keterangan')
            ->whereNotNull('spp.noverifikasi')
            ->where('php.statusenabled',1)   ;
        $dataSpp = $dataSpp->where('php.noposting', $noPosting);
        $dataSpp=$dataSpp->groupBy('kp.kelompokpasien', 'spp.norec','stp.tglposting', 'pd.noregistrasi', 'pd.tglregistrasi','p.nocm','p.namapasien','spp.totalppenjamin','spp.totalharusdibayar',
            'spp.totalsudahdibayar', 'r.namarekanan', 'spp.totalbiaya', 'spp.noverifikasi', 'php.noposting','stp.kdhistorylogins','kls.namakelas','stp.tglposting','bpjs.TARIF_INACBG',
            'r.namarekanan','p.tgllahir','r.id','kp.id','gagalbpjs.keterangan');
        $dataSpp = $dataSpp->orderBy('p.namapasien');
        $dataSpp =$dataSpp->get();


        $result = array();
        foreach ($dataSpp as $item) {
            $namaUser = LoginUser::where('id',$item->kdhistorylogins)->first();
            $SPP = StrukPelayananPenjamin::find($item->norec);
            if ($item->tarifklaimbpjs == null){
                $tarifklaim = (float)$item->totalppenjamin;
                $selisihKlaim = 0;
            }else{
                $tarifklaim = (float)$item->tarifklaimbpjs;
                $selisihKlaim = (float)$item->tarifklaimbpjs - (float)$item->totalppenjamin;
            }
            $result[] = array(
                'noRec' => $item->norec,
                'noPosting' => $item->noposting,
                'tglPosting' => $item->tglposting,
                'tglTransaksi' => $item->tglregistrasi,
                'noRegistrasi' => $item->noregistrasi,
                'namaPasien' => $item->namapasien,
                'kelasRawat' => $item->namakelas,
                'collector' =>  $namaUser->pegawai->namalengkap,
                'kpid' => $item->kpid,
                'jenisPasien' => $item->kelompokpasien,
                'kelasPenjamin' => $item->namakelas,
                'umur' => $this->hitungUmur($item->tgllahir),
                'totalBilling' => $item->totalbiaya,
                'totalKlaim' => $item->totalppenjamin ,
                'totalBayar' => $item->totalsudahdibayar ,
                'status' => $SPP->StatusCollectingPiutang,
                'rknid' => $item->rknid,
                'namarekanan' => $item->namarekanan,
                'tarifselisihklaim' => $selisihKlaim,
                'tarifinacbgs' => $tarifklaim,
                'keterangan' => $item->keterangan,
            );
        }

        return $this->respond($result, 'Data Piutang yang sudah tercollecting');
    }

    public function CollectingFromTxtInaCbgs(Request $request){

        $txtFileName = $request['txtFileName'];
        $dataSpp = DB::select(DB::raw(
            "select case when spp.noverifikasi is null then null else spp.norec end as norec, pd.tglregistrasi,case 
                  when pd.noregistrasi is null then 'Register NOSEP : ' + bpjs.sep 
                  when sp.norec is null then 'Null Verif Tarek ' + pd.noregistrasi 
                  when spp.noverifikasi is null then 'Null Verif Piutang ' + pd.noregistrasi 
                  else pd.noregistrasi end as noregistrasi,
                case when ps.namapasien is null then bpjs.\"MRN\" + ' ' + bpjs.\"NAMA_PASIEN\" else ps.namapasien end as namapasien,kls.namakelas,kp.id as kpid,kp.kelompokpasien ,
                kls2.namakelas as kelasdijamin,bpjs.\"TARIF_RS\" as totalbiaya,bpjs.\"TARIF_INACBG\" as totalppenjamin,rkn.namarekanan,rkn.id as rknid,
                bpjs.\"TARIF_RS\" - bpjs.\"TARIF_INACBG\" as tarifselisihklaim,bpjs.\"TARIF_INACBG\" as tarifinacbgs,'' as keterangan,bpjs.sep
                from bpjsklaimtxt_t as bpjs
                LEFT JOIN pemakaianasuransi_t as pa on pa.nosep=bpjs.sep
                LEFT JOIN pasiendaftar_t as pd on pd.norec=pa.noregistrasifk
                LEFT JOIN pasien_m as ps on ps.id=pd.nocmfk
                LEFT JOIN kelas_m as kls on kls.id=pd.objectkelasfk
                LEFT JOIN asuransipasien_m as ap on ap.id=pa.objectasuransipasienfk
                LEFT JOIN kelas_m as kls2 on kls2.id=ap.objectkelasdijaminfk
                LEFT JOIN rekanan_m as rkn on rkn.id=pd.objectrekananfk
                LEFT JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
                left JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec
                left JOIN strukpelayananpenjamin_t as spp on spp.nostrukfk=sp.norec
                 where bpjs.txtfilename='$txtFileName' and sp.statusenabled is null;
              ")
        );


        $result = array();
        foreach ($dataSpp as $item) {
//            $namaUser = LoginUser::where('id',$item->kdhistorylogins)->first();
//            $SPP = StrukPelayananPenjamin::find($item->norec);
//            if ($item->tarifklaimbpjs == null){
//                $tarifklaim = (float)$item->totalppenjamin;
//                $selisihKlaim = 0;
//            }else{
//                $tarifklaim = (float)$item->tarifklaimbpjs;
//                $selisihKlaim = (float)$item->tarifklaimbpjs - (float)$item->totalppenjamin;
//            }
            $result[] = array(
                'noRec' => $item->norec,
                'noPosting' => '',
                'tglPosting' => '',
                'tglTransaksi' => $item->tglregistrasi,
                'noRegistrasi' => $item->noregistrasi,
                'namaPasien' => $item->namapasien,
                'kelasRawat' => $item->namakelas,
                'collector' =>  '',
                'kpid' => $item->kpid,
                'jenisPasien' => $item->kelompokpasien,
                'kelasPenjamin' => $item->namakelas,
                'umur' => 0,
                'totalBilling' => $item->totalbiaya,
                'totalKlaim' => $item->totalppenjamin ,
                'totalBayar' => 0 ,
                'status' => 'Piutang',
                'rknid' => $item->rknid,
                'namarekanan' => $item->namarekanan,
                'tarifselisihklaim' => $item->tarifselisihklaim,
                'tarifinacbgs' => $item->tarifinacbgs,
                'keterangan' => $item->keterangan,
                'sep' => $item->sep,
            );
        }

        return $this->respond($result, 'Data Piutang yang sudah tercollecting');
    }
     public function collectingPiutangJurnal(Request $request){
        DB::beginTransaction();
            $setoran= new SetoranPiutangJurnal();
            $norec =$setoran->generateNewId();
            $setoran->norec = $norec;
            try{
                $setoran->save();
                $transStatus = true;
            }
            catch(\Exception $e){
                $this->transStatus = false;
                $this->transMessage = "Posting Piutang Gagal{1}";
            }
        
        if($this->transStatus){
            foreach ($request['strukPenjamin'] as $item){
                if ($item['norec'] == null){
                    $this->transStatus = false;
                    $this->transMessage = "Posting gagal perbaiki data !";
                    break;
                }else {
                    $strukPelayananPenjamin = StrukPelayananPenjamin::where('norec', $item['norec'])->update([
                        'setoranpiutangjurnalfk' =>  $setoran->norec,
                    ]);
                }
            }
        }

        if($this->transStatus){
            DB::commit();
            $this->transMessage = "Posting Piutang Berhasil";
            $result = array(
                'status' => 201,
                'message' => $this->transMessage,
                'norecposting' => $setoran->norec,
                'as' => 'er@epic',
            );
            return $this->setStatusCode(201)->respond($result);
        }else{
            DB::rollBack();
            return $this->setStatusCode(400)->respond([],$this->transMessage);
        }
    }
    public function collectingPiutang(Request $request){
        DB::beginTransaction();
        if ($request['nopostings'] == '') {
            $strukPosting = new StrukPosting();
            $strukPosting->norec = $strukPosting->generateNewId();
            $noPosting = $this->generateCode(new StrukPosting, 'noposting', 16, $this->getDateTime()->format('dm-y').'-PI'  );
            $strukPosting->noposting=$noPosting;

//            $newSR = new StrukResep();
//            $norecSR = $newSR->generateNewId();
//            $noResep = $this->generateCode(new StrukResep, 'noresep', 12, 'O/' . $this->getDateTime()->format('ym') . '/');
//            $newSR->norec = $norecSR;
        }else{
            $strukPosting = StrukPosting::where('noposting',$request['nopostings'])->first();
            $delPhp = PostingHutangPiutang::where('noposting',$request['nopostings'])->delete();
//                ->update([
//                    'statusenabled' => 0,
//                ]);
        }

        $strukPosting->kdprofile = $this->getKdProfile();
        //$strukPosting->noposting= $this->generateCode(new StrukPosting, 'noposting', 10, 'C');
        $strukPosting->objectkelompoktransaksifk = 1; ///ambil dari datafixed pastinya
        $strukPosting->kdhistorylogins= $this->getCurrentLoginID();
        $strukPosting->keteranganlainnya = "Collecting Piutang Penjamin";
        $strukPosting->tglposting= $this->getDateTime();
        $strukPosting->objectruanganfk= 10;
        try{
            $strukPosting->save();
        }
        catch(\Exception $e){
            $this->transStatus = false;
//            throw new \Exception($e);
            $this->transMessage = "Collecting Piutang Gagal{1}";
        }

        if($this->transStatus){
            //foreach ($request['strukPenjamin'] as $norec){
            foreach ($request['strukPenjamin'] as $norec){
                if ($norec['norec'] == null){
                    $this->transStatus = false;
                    $this->transMessage = "Collecting gagal perbaiki data !";
                    break;
                }else {
                    //$this->transStatus = false;
                    //return $this->respond($norec);
                    //$strukPelayananPenjamin = StrukPelayananPenjamin::where('norec', $norec)->first();
                    $strukPelayananPenjamin = StrukPelayananPenjamin::where('norec', $norec['norec'])->first();
                    if ($strukPelayananPenjamin) {
                        $postingHutang = new PostingHutangPiutang();
                        $postingHutang->norec = $postingHutang->generateNewId();
                        $postingHutang->kdprofile = $this->getKdProfile();
                        $postingHutang->noposting = $strukPosting->noposting;
                        $postingHutang->nostrukfk = $strukPelayananPenjamin->norec;
                        $postingHutang->keteranganlainnya = "Colecting Piutang Penjamin";
                        $postingHutang->totalpiutang = $norec['totalKlaim'];

                        try {
                            $postingHutang->save();
                        } catch (\Exception $e) {
                            $this->transStatus = false;
                            $this->transMessage = "Collecting Piutang Gagal{2}";
                            break;
                        }

                    }
                }
            }
        }

        if($this->transStatus){
            DB::commit();
//            DB::rollBack();
            $this->transMessage = "Collecting Piutang Berhasil";
            return $this->setStatusCode(201)->respond([],$this->transMessage);
        }else{
            DB::rollBack();
//            $this->transMessage = "Collecting Piutang Gagal";
            return $this->setStatusCode(400)->respond([],$this->transMessage);
        }
    }

    public function batalCollectingPiutang(Request $request){
        DB::beginTransaction();
        $this->transStatus = true;
        try{
            $data = StrukPosting::where('noposting',$request['noposting'])
                ->update([
                    'statusenabled' => 0,
                ]);
            $data2 = PostingHutangPiutang::where('noposting',$request['noposting'])
                ->delete();
        }
        catch(\Exception $e){
            $this->transStatus = false;
//            throw new \Exception($e);
            $this->transMessage = "Gagal!";
        }

        if($this->transStatus){
            DB::commit();
            $this->transMessage = "Berhasil!!";
            return $this->setStatusCode(201)->respond([$data],$this->transMessage);
        }else{
            DB::rollBack();
            return $this->setStatusCode(400)->respond([$data],$this->transMessage);
        }
    }

    public function detailPiutangPasienCollecting($noPosting){
        $php = DB::select(DB::raw("select top 1 norec,noposting,nostrukfk from postinghutangpiutang_t 
                  where noposting='$noPosting' order by nostrukfk ")
        );
//        $php = DB::select(DB::raw("select norec,noposting,nostrukfk from postinghutangpiutang_t
//                  where noposting='$noPosting' order by nostrukfk limit 1")
//        );
        foreach ($php as $item){
            $phps = $item->nostrukfk;
        };
        $spp = StrukPelayananPenjamin::where('norec', $phps)->first();
//        $sp = StrukPelayanan::where('norec', $spp->nostrukfk)->first();
        $sbp = StrukBuktiPenerimaan::where('nostrukfk', $spp->nostrukfk)->where ('objectkelompoktransaksifk', 76)->orderBy('nosbm')->get();

        $detailPembayaran = array();
        foreach ($sbp as $item){
            $detailPembayaran[] = array(
                'noSbm' => $item->nosbm,
                'tglPembayaran' => $item->tglsbm,
                'jlhPembayaran' => $item->totaldibayar
            );
        }
        $data = array(
            "noRecSPP" => $spp->norec,
            "detailPembayaran" => $detailPembayaran
        );

        return $this->respond($data);
    }

    public function daftarKartuPiutang (Request $request){
        $filter = $request->all();
        $dataCollector = DB::table('postinghutangpiutang_t as php')
            ->join('strukpelayananpenjamin_t as spp', 'spp.norec', '=', 'php.nostrukfk')
            ->join('strukpelayanan_t as spy', 'spy.norec', '=', 'spp.nostrukfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'spy.noregistrasifk')
            ->join('rekanan_m as rkn', 'rkn.id', '=', 'pd.objectrekananfk')
            ->join('strukposting_t as sp', 'sp.noposting', '=', 'php.noposting')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('pasien_m as p','p.id','=','pd.nocmfk')
            ->select(DB::raw('spy.tglstruk,p.nocm,pd.noregistrasi,p.namapasien,ru.id as ruanganid,ru.namaruangan,rkn.id as idrekanan,rkn.namarekanan,
                             spy.totalprekanan as piutang,spp.totalsudahdibayar,0 as administrasi,
                             (CASE WHEN spy.totalprekanan = spp.totalsudahdibayar THEN 0
                             WHEN spy.totalprekanan <> spp.totalsudahdibayar THEN spy.totalprekanan - spp.totalsudahdibayar 
                             ELSE spp.totalsisapiutang end) as sistagihan'))
            ->orderBy('spy.tglstruk','asc');

        if(isset($filter['tglAwal']) && $filter['tglAwal']!=""){
            $dataCollector = $dataCollector->where('spy.tglstruk','>=', $filter['tglAwal']);
        }
        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!=""){
            $dataCollector = $dataCollector->where('spy.tglstruk','<=', $filter['tglAkhir']);
        }
        if(isset($filter['noPosting']) && $filter['noPosting']!=""){
            $dataCollector = $dataCollector->where('pd.noregistrasi','like', '%'.$filter['noPosting'].'');
        }
        if(isset($filter['idPerusahaan']) && $filter['idPerusahaan']!=""){
            $dataCollector = $dataCollector->where('rkn.id','=', $filter['idPerusahaan']);
        }
        $dataCollector = $dataCollector->where('sp.statusenabled','=','1');
        $dataCollector =$dataCollector->get();

        $totalsaldo=0;
        $saldo=0;
        $dataz=array();
        $terbilang='';
        foreach ($dataCollector as $value) {
            $dataz[] = array(
                'tglstruk' => $value->tglstruk,
                'nocm' => $value->nocm,
                'noregistrasi' => $value->noregistrasi,
                'pasien' => $value->nocm . ' / ' . $value->noregistrasi,
                'namapasien' => $value->namapasien,
                'ruanganid' => $value->ruanganid,
                'namaruangan' => $value->namaruangan,
                'idrekanan' => $value->idrekanan,
                'namarekanan' => $value->namarekanan,
                'piutang' => $value->piutang,
                'totalsudahdibayar' => $value->totalsudahdibayar,
                'administrasi' => $value->administrasi,
                'sistagihan' => $value->sistagihan,
            );


            foreach ($dataz as $t) {
                $saldo = $totalsaldo + $t['sistagihan'];
                $totalsaldo = $saldo;
                $terbilang = $this->terbilang($totalsaldo);
            }
        }
        $result[] = array(
            'data' => $dataz,
            'saldopiutang' => $totalsaldo,
            'terbilang' => $terbilang
        );
        return $this->respond($result);
    }

    public function daftarPembayaranPiutangPeriode(Request $request){
        $filter = $request->all();
        $dataCollector = DB::table('postinghutangpiutang_t as php')
            ->join('strukpelayananpenjamin_t as spp', 'spp.norec', '=', 'php.nostrukfk')
            ->join('strukbuktipenerimaan_t as sbm', 'sbm.nostrukfk', '=', 'spp.nostrukfk')
            ->join('strukpelayanan_t as spy', 'spy.norec', '=', 'spp.nostrukfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'spy.noregistrasifk')
            ->join('rekanan_m as rkn', 'rkn.id', '=', 'pd.objectrekananfk')
            ->join('strukposting_t as sp', 'sp.noposting', '=', 'php.noposting')
            ->join('loginuser_s as lu', 'sp.kdhistorylogins', '=', 'lu.id')
            ->select('sbm.tglsbm', 'php.noposting','rkn.id as idRekanan','rkn.namarekanan','php.statusenabled','sbm.keteranganlainnya',
                DB::raw('sum(sbm.totaldibayar) as totaldibayar')
            );

        //return $this->respond($filter, 'Data Piutang yang sudah tercollecting');
        if(isset($filter['tglAwal']) && $filter['tglAwal']!=""){
            $dataCollector = $dataCollector->where('sbm.tglsbm','>=', $filter['tglAwal']);
        }
        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!=""){
            $dataCollector = $dataCollector->where('sbm.tglsbm','<=', $filter['tglAkhir']);
        }
        if(isset($filter['noPosting']) && $filter['noPosting']!=""){
            $dataCollector = $dataCollector->where('sp.noposting','like', '%'.$filter['noPosting'].'');
        }
        if(isset($filter['idPerusahaan']) && $filter['idPerusahaan']!=""){
            $dataCollector = $dataCollector->where('rkn.id','=', $filter['idPerusahaan']);
        }
        $dataCollector = $dataCollector->where('sp.statusenabled','=','1');
        $dataCollector = $dataCollector->where('sbm.objectkelompoktransaksifk',76);
        $dataCollector=$dataCollector->groupBy('sbm.tglsbm','php.noposting','rkn.id','rkn.namarekanan','php.statusenabled','sbm.keteranganlainnya');
        $dataCollector=$dataCollector->orderBy('sbm.tglsbm','php.noposting');
        $dataCollector =$dataCollector->get();

        $result1 = array();
        foreach ($dataCollector as $item) {
            $bayar=0;
            $totalbayar=0;
            foreach ($dataCollector as $itemd) {
                $bayar = $totalbayar + $itemd->totaldibayar;
                $totalbayar = $bayar;
                $terbilang = $this->terbilang($totalbayar);
            }
            $result1[] = array(
                'noPosting' => $item->noposting,
                'tglBayar' => $item->tglsbm,
                'totalBayar' => $item->totaldibayar,
                'terbilang' => $terbilang,
                'idrekanan' => $item->idRekanan,
                'namarekanan' => $item->namarekanan,
                'statusenabled' => $item->statusenabled,
                'keterangan' => $item->keteranganlainnya
            );
        }
        $tglawal = $filter['tglAwal'];
        $tglakhir= $filter['tglAkhir'];
        $idPerusahaan= $filter['idPerusahaan'];
        if(isset($idPerusahaan) && $idPerusahaan!=""){
//            $dataRekap = DB::select(DB::raw("SELECT x.tglbayar, x.adm, sum(x.totaldibayar)as totaldibayar from
//                        (select to_char(sbm.tglsbm,'dd-MM-yyyy') as tglbayar,  0 as adm,
//                        sbm.totaldibayar
//                         from postinghutangpiutang_t as php
//                         inner join strukpelayananpenjamin_t as spp on spp.norec = php.nostrukfk
//                         inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk
//                         inner join strukpelayanan_t as spy on spy.norec = spp.nostrukfk
//                         inner join strukposting_t as sp on sp.noposting = php.noposting
//                         inner join pasiendaftar_t as pd on pd.norec = spy.noregistrasifk
//                         inner join rekanan_m as rkn on rkn.id = pd.objectrekananfk
//                         where sbm.tglsbm >= '$tglawal' and sbm.tglsbm <= '$tglakhir'
//                         and rkn.id='$idPerusahaan'
//                         and sp.statusenabled = 1 and sbm.objectkelompoktransaksifk = 76)as x
//                        group by x.tglbayar,x.adm
//                        order by x.tglbayar")
//            );

            $dataRekap = DB::select(DB::raw("SELECT x.tglbayar, x.adm, sum(x.totaldibayar)as totaldibayar from
                        (select convert(varchar, sbm.tglsbm, 5) as tglbayar,  0 as adm,
                        sbm.totaldibayar
                         from postinghutangpiutang_t as php
                         inner join strukpelayananpenjamin_t as spp on spp.norec = php.nostrukfk
                         inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk
                         inner join strukpelayanan_t as spy on spy.norec = spp.nostrukfk
                         inner join strukposting_t as sp on sp.noposting = php.noposting
                         inner join pasiendaftar_t as pd on pd.norec = spy.noregistrasifk
                         inner join rekanan_m as rkn on rkn.id = pd.objectrekananfk
                         where sbm.tglsbm >= '$tglawal' and sbm.tglsbm <= '$tglakhir'
                         and rkn.id='$idPerusahaan'
                         and sp.statusenabled = 1 and sbm.objectkelompoktransaksifk = 76)as x
                        group by x.tglbayar,x.adm
                        order by x.tglbayar")
            );

        }else{
//            $dataRekap = DB::select(DB::raw("SELECT x.tglbayar, x.adm, sum(x.totaldibayar)as totaldibayar from
//                        (select to_char(sbm.tglsbm,'dd-MM-yyyy') as tglbayar,  0 as adm,
//                        sbm.totaldibayar
//                         from postinghutangpiutang_t as php
//                         inner join strukpelayananpenjamin_t as spp on spp.norec = php.nostrukfk
//                         inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk
//                         inner join strukpelayanan_t as spy on spy.norec = spp.nostrukfk
//                         inner join strukposting_t as sp on sp.noposting = php.noposting
//                         inner join pasiendaftar_t as pd on pd.norec = spy.noregistrasifk
//                         inner join rekanan_m as rkn on rkn.id = pd.objectrekananfk
//                         where sbm.tglsbm >= '$tglawal' and sbm.tglsbm <= '$tglakhir'
//                         and sp.statusenabled = 1 and sbm.objectkelompoktransaksifk = 76)as x
//                        group by x.tglbayar,x.adm
//                        order by x.tglbayar")
//            );

            $dataRekap = DB::select(DB::raw("SELECT x.tglbayar, x.adm, sum(x.totaldibayar)as totaldibayar from
                        (select convert(varchar, sbm.tglsbm, 5) as tglbayar,  0 as adm,
                        sbm.totaldibayar
                         from postinghutangpiutang_t as php
                         inner join strukpelayananpenjamin_t as spp on spp.norec = php.nostrukfk
                         inner join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk
                         inner join strukpelayanan_t as spy on spy.norec = spp.nostrukfk
                         inner join strukposting_t as sp on sp.noposting = php.noposting
                         inner join pasiendaftar_t as pd on pd.norec = spy.noregistrasifk
                         inner join rekanan_m as rkn on rkn.id = pd.objectrekananfk
                         where sbm.tglsbm >= '$tglawal' and sbm.tglsbm <= '$tglakhir'
                         and sp.statusenabled = 1 and sbm.objectkelompoktransaksifk = 76)as x
                        group by x.tglbayar,x.adm
                        order by x.tglbayar")
            );
        }


        $result2 = array();
        foreach ($dataRekap as $data) {
            $result2[] = array(
                'tglBayar' => $data->tglbayar,
                'adm' => $data->adm,
                'totalBayar' => $data->totaldibayar
            );
        }
        $result[] = array(
            'data' => $result1,
            'rekap' => $result2
        );

        return $this->respond($result, 'Pembayaran Piutang Perusahaan');
    }

    public function getDaftarHistoriPiutang(Request $request) {
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

//        $data = \DB::table('pasiendaftar_t as pd')
//            ->JOIN('pasien_m as p','p.id','=','pd.nocmfk')
//            ->JOIN('kelompokpasien_m as kp','kp.id','=', 'pd.objectkelompokpasienlastfk')
//            ->LEFTJOIN('rekanan_m as rkn','rkn.id', '=','pd.objectrekananfk')
//            ->LEFTJOIN('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
//            ->select(
//                DB::raw('pd.norec,pd.tglregistrasi,pd.tglpulang,p.nocm || \' / \' || pd.noregistrasi as noregistrasi,p.namapasien,kp.id as kpid,kp.kelompokpasien,
//			            case when rkn.namarekanan is null then \'Umum/Pribadi\' else rkn.namarekanan end as penjamin,ru.namaruangan')
//            );

        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('pasien_m as p','p.id','=','pd.nocmfk')
            ->JOIN('kelompokpasien_m as kp','kp.id','=', 'pd.objectkelompokpasienlastfk')
            ->LEFTJOIN('rekanan_m as rkn','rkn.id', '=','pd.objectrekananfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->select(
                DB::raw('pd.norec,pd.tglregistrasi,pd.tglpulang,p.nocm + \' / \' + pd.noregistrasi as noregistrasi,p.namapasien,kp.id as kpid,kp.kelompokpasien,
			            case when rkn.namarekanan is null then \'Umum/Pribadi\' else rkn.namarekanan end as penjamin,ru.namaruangan')
            );

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('pd.tglpulang','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('pd.tglpulang','<=', $tgl);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
        if(isset($request['kpid']) && $request['kpid']!="" && $request['kpid']!="undefined"){
            $data = $data->where('kp.id','=',$request['kpid']);
        }
        if(isset($request['rknid']) && $request['rknid']!="" && $request['rknid']!="undefined"){
            $data = $data->where('rkn.id','=', $request['rknid']);
        }
        if(isset($request['dpid']) && $request['dpid']!="" && $request['dpid']!="undefined"){
            $data = $data->where('ru.objectdepartemenfk','=',$request['dpid']);
        }
        if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            $data = $data->where('ru.id','=',$request['ruid']);
        }

        $data = $data->orderBy('pd.tglpulang');
        $data = $data->get();

        $results =array();
        foreach ($data as $item){
            $details = DB::select(DB::raw("SELECT sp.tglstruk as tglveriftr,sv.tglverifikasi as tglverifpiutang,spt.tglposting as tglposting,sbm.tglsbm as tglsbm,			
                       sp.nostruk as noveriftr,sv.noverifikasi as noverifpiutang,spt.noposting,sbm.nosbm,
                       spp.totalppenjamin,spp.totalharusdibayar,case when bpjs.\"TARIF_INACBG\" is null then 0 else bpjs.\"TARIF_INACBG\" end as tarifklaimbpjs,
                       case when sbm.nosbm is null then spp.totalsudahdibayar else sbm.totaldibayar end totalsudahdibayar,
                       spp.totalbiaya
                       from strukpelayanan_t as sp
                       inner join strukpelayananpenjamin_t as spp on sp.norec = spp.nostrukfk
                       left join strukverifikasi_t as sv on sv.noverifikasi = spp.noverifikasi
                       left join pemakaianasuransi_t as pa on pa.noregistrasifk = sp.noregistrasifk
                       left join bpjsklaimtxt_t as bpjs on bpjs.sep = pa.nosep   
                       left join postinghutangpiutang_t as php on php.nostrukfk = spp.norec
                       left join strukposting_t as spt on spt.noposting = php.noposting
                       left join strukbuktipenerimaan_t as sbm on sbm.nostrukfk = spp.nostrukfk
                       where sp.noregistrasifk =:norec and sp.statusenabled is null;"),
                array(
                    'norec' => $item->norec,
                )
            );

            $results[] = array(

                'tglregistrasi' => $item->tglregistrasi,
                'tglpulang' => $item->tglpulang,
                'norec' => $item->norec,
                'noregistrasi' => $item->noregistrasi,
                'namapasien' => $item->namapasien,
                'kpid' => $item->kpid,
                'kelompokpasien' => $item->kelompokpasien,
                'penjamin' => $item->penjamin,
                'namaruangan' => $item->namaruangan,
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

    public function RekapKlainDiagnosaTXT(Request $request){
        if  ($request['ptd'] == '1'){
            $data = DB::select(DB::raw(
                "select  x.diaglist[1],diag.namadiagnosa,sum(x.tarif) as total,count(x.sep) as qty  from
                    (select DISTINCT regexp_split_to_array(\"DIAGLIST\", ';' ) as diaglist,\"TARIF_INACBG\" as tarif,sep from bpjsklaimtxt_t 
                    where \"PTD\"='1') as x
                    INNER JOIN diagnosa_m as diag on x.diaglist[1]=diag.kddiagnosa
                    group by diag.namadiagnosa,x.diaglist[1]
                    order by count(x.sep) desc;
              ")
            );
        }elseif($request['ptd'] == '2'){
            $data = DB::select(DB::raw(
                "select  x.diaglist[1],diag.namadiagnosa,sum(x.tarif) as total,count(x.sep) as qty  from
                    (select DISTINCT regexp_split_to_array(\"DIAGLIST\", ';' ) as diaglist,\"TARIF_INACBG\" as tarif,sep from bpjsklaimtxt_t 
                    where \"PTD\"='2') as x
                    INNER JOIN diagnosa_m as diag on x.diaglist[1]=diag.kddiagnosa
                    group by diag.namadiagnosa,x.diaglist[1]
                    order by count(x.sep) desc;
              ")
            );
        }


        $hasilna = array(
            'data' => $data,
            'by' => 'as@epic'
        );
        return $hasilna;
    }

    public function simpanGagalHitungBpjsKlaim(Request $request){
//        ini_set('max_execution_time', 100);
        DB::beginTransaction();
        try {
            $data2 = BPJSGagalKlaimTxt::where('txtfilename', $request['filename'])->delete();
            foreach ($request['data'] as $item){
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

    public function simpanBpjsKlaim(Request $request){
//        ini_set('max_execution_time', 100);
        DB::beginTransaction();
        try {
            $data2 = BPJSKlaimTxt::where('txtfilename', $request['filename'])->delete();
            foreach ($request['data'] as $item){
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

    public function getChecklistKlaim(Request $request) {
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
        $aingMacan = DB::select(DB::raw("select tgl,
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
                'tglAwal' => $request['tglAwal'] ,
                'tglAkhir' => $request['tglAkhir']
            )
        );
        $result = array(
            'dat' => $aingMacan,
            'by' => 'as@epic'
        );
        return $this->respond($result);
    }

}