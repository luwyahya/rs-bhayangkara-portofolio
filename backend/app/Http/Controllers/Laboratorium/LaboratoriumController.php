<?php
/**
 * Created by PhpStorm.
 * User: Egie RAmdan
 * Date: 9/5/2019
 * Time: 1:42 PM
 */


namespace App\Http\Controllers\Laboratorium;

use App\Http\Controllers\ApiController;
use App\Master\DetailJenisProduk;
use App\Master\JenisPetugasPelaksana;
use App\Master\MapHasilLab;
use App\Master\MapHasilLabDetail;
use App\Master\NilaiNormal;
use App\Master\Produk;
use App\Master\SatuanStandar;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\HasilLaboratorium;
use App\Transaksi\HasilPemeriksaan;
use App\Transaksi\HasilPemeriksaanLab;
use App\Transaksi\HasilPemeriksaanMcu;
use App\Master\NilaiKritis;
use App\Transaksi\LisOrder;
use App\Transaksi\LisOrderTmp;
use App\Transaksi\LoggingUser;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDelete;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\JadwalOperasiBpjs;

use App\Transaksi\PelayananPasienPetugas;

use App\Transaksi\RisOrder;
use App\Transaksi\StrukHasilPemeriksaan;
use Illuminate\Http\Request;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\OrderProduk;
use App\Master\Pegawai;
use App\Master\Pasien;
use App\Traits\Valet;
use Carbon\Carbon;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;
class LaboratoriumController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getComboDiagnosa(Request $request)
    {
        $diagnosa = \DB::table('diagnosa_m as dm')
        ->select('dm.id','dm.kddiagnosa')
        ->orderBy('dm.kddiagnosa')
        ->get();
        $result = array(
            'diagnosa' => $diagnosa
        );
        return $this->respond($result);
    }
    public function getAllPermintaanOperasiJkn4(Request $request) {
        $dataLogin = $request->all();
        // return($request);
        // die();
        $tglAkhir =Carbon::now()->format('Y-m-d');

        $terlayani = DB::select(DB::raw("select count(jo.norec)as terlayani
                from jadwaloperasijkn_t as jo
                where  jo.terlaksana=true and jo.statusenabled=true 
                and (to_char( jo.tanggaloperasi,'YYYY-MM-DD' )::TIMESTAMP = '$tglAkhir'::TIMESTAMP )
            "),
            array(
                // 'noregistrasi' => $noRegister ,
            )
        );
        $rencana = DB::select(DB::raw("select count(jo.norec)as rencana
                from jadwaloperasijkn_t as jo
                where  jo.terlaksana=false and jo.statusenabled=true
            "),
            array(
                // 'noregistrasi' => $noRegister ,
            )
        );
        $terlayanih = 0;
        $rencanah = 0;
        foreach ($terlayani as $item){
            $terlayanih  =$item->terlayani ;
        }
        foreach ($rencana as $item){
            $rencanah  =$item->rencana ;
        }
        $data[] = array(
            "terlayani" => $terlayanih,
            "rencana" => $rencanah,
        );
        // return($data);
        // die();
                // return $this->respond($result);
                return $this->respond($data);
    }
    public function updateJadwalOperasi(Request $request) {
        $dataLogin = $request->all();
        

        DB::beginTransaction();
        $noRec=$request['norec'];
        $tglAyeuna = date('Y-m-d H:i:s');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // return($request['norec']);
        // die();
        try {
            $newptp = JadwalOperasiBpjs::where('norec',$request['norec'])
                    ->update(
                        [
                            'terlaksana' => 1
                        ]
                );
            


            $transMessage = "update Jadwal Operasi";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update Jadwal Operasi Gagal";
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
    public function hapusJadwalOperasi(Request $request) {
        $dataLogin = $request->all();
        

        DB::beginTransaction();
        $noRec=$request['norec'];
        $tglAyeuna = date('Y-m-d H:i:s');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // return($request['norec']);
        // die();
        try {
            $newptp = JadwalOperasiBpjs::where('norec',$request['norec'])
                    ->update(
                        [
                            'statusenabled' => 0
                        ]
                );
            


            $transMessage = "hapus Jadwal Operasi";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "hapus Jadwal Operasi Gagal";
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
    public function getAllPermintaanOperasiJkn5(Request $request) {
        $dataLogin = $request->all();

        $data = \DB::table('jadwaloperasijkn_t as jo')
            ->select('jo.norec','jo.kodebooking',
                'jo.jenistindakan', 'jo.kodepoli','jo.namapoli','jo.terlaksana','jo.nopeserta',
                'jo.lastupdate','nocm',
            DB::raw("'-' as namapeserta,  to_char( jo.tanggaloperasi,'yyyy-MM-dd HH:mm') as tanggaloperasi"))
            ->where('jo.terlaksana',false)
            ->where('jo.statusenabled',true);
      
            $data = $data->orderBy('jo.kodebooking','desc');
                $data = $data->distinct();
                $data = $data->get();
                return $this->respond($data);
    }
    public function getPoliBpjs(){
        $datas = \DB::table('polibpjs_m as pb')
            ->select('pb.kdpoli', 'pb.nmpoli')
            ->where('pb.statusenabled',true);

                $datas = $datas->orderBy('pb.nmpoli','desc');
                $datas = $datas->distinct();
                $datas = $datas->get();
         
            
                // $data[] = array(
                //     'kdpoli' => $datas->kdpoli,
                //     'nmpoli' => $datas->nmpoli,
                // );

        return $this->respond($datas);
    }
    public function saveJadwalOperasi(Request $request) {
        $dataLogin = $request->all();
        

        DB::beginTransaction();
        $noRec='';
        $tglAyeuna = date('Y-m-d H:i:s');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        
        try {
            $newptp = new JadwalOperasiBpjs();
            $norec = $newptp->generateNewId();
            // $nontrian= JadwalOperasiBpjs::where('jenis',$request['jenis'])
            //         ->whereBetween('tanggalreservasi',[$tglAwal,$tglAkhir])
            //         ->max('noantrian')+1;
            $kodebooking = "OK".$request['tanggaloperasi'].$request['kdpoli'].$request['nopeserta'];
            // return($kodebooking);
            // die();
            $newptp->norec = $norec;
            $newptp->kodebooking = $kodebooking;
            $newptp->tanggaloperasi = $request['tanggaloperasi'];
            $newptp->jenistindakan = $request['jenistindakan'];
            $newptp->kodepoli = $request['kdpoli'];
            $newptp->namapoli = $request['nmpoli'];
            $newptp->terlaksana = 0;
            $newptp->nopeserta =  $request['nopeserta'];
            $newptp->lastupdate =  $tStamp;
            $newptp->statusenabled = true;
            $newptp->nocm =  $request['nocm'];
            $newptp->namapeserta =  $request['namaPeserta'];
            $newptp->save();
            $noRec=$newptp->norec;


            $transMessage = "Simpan Jadwal Operasi";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Jadwal Operasi Gagal";
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
     public function delete(Request $request){
        $dataLogin = $request->all();
        
        if (!empty($request['norec_so'])) {
            $data2=StrukOrder::where('norec',$request['norec_so'] )
                    ->update(
                        [
                            'statusenabled' => false
                        ]
                    ); 
                $transMessage = "Data Berhasil Di Delete";
            }else{
                $transMessage = "Data Gagal Di Delete";
            }
            $result = array(
                "data2" =>$data2,
                "status" => 201,
                "message" => $transMessage,
            );

            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function unVerif(Request $request) {
        $dataLogin = $request->all();
        

        DB::beginTransaction();
        $noRec='';
        $tglAyeuna = date('Y-m-d H:i:s');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        
        try {
            $data = \DB::table('jadwaloperasijkn_t as pa')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','pa.noregistrasifk')
            ->select('pa.norec')
            ->where('pa.statusenabled',true)
            ->where('pd.noregistrasi','=',$request['noregistrasi'] )
            ->get();
          
            if(!empty($data))
            {
                foreach($data as  $itil)
                {
                    // return ( $itil->norec);
                    // die;
                    $updatePP=StrukOrder::where('norec',$request['norec_so'] )
                    ->update(
                        [
                            'status' => NULL
                        ]
                    ); 
                    $deletAh=JadwalOperasiBpjs::where('norec', $itil->norec)
                    ->delete();
                }
                
                
            $transMessage = "Unverif Jadwal Operasi";
            }
            else{
                
            $transMessage = "Data Tidak Ditemukan";
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Jadwal Operasi Gagal";
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
    public function saveJadwalOperasiGabung(Request $request) {
        $dataLogin = $request->all();
  
        
        DB::beginTransaction();
        $noRec='';
        $tglAyeuna = date('Y-m-d H:i:s');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        
        try {
        $nopesertakep='';
        $norecTake='';
        // $data = \DB::table('jadwaloperasijkn_t as pa')
        // ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','pa.noregistrasifk')
        // ->select('pa.norec')
        // ->where('pa.statusenabled',true)
        // ->where('pd.noregistrasi','=',$request['noregistrasi'] )
        // ->get();
        // if(!empty($data))
        //     {   $transMessage = "Data Sudah Terjadwalkan";  
        //         $result = array(
                  
        //             "status" => 201,
        //             "message" => $transMessage,
        //         );
        //         return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //     }

        $datas = \DB::table('pemakaianasuransi_t as pa')
        ->LEFTJOIN('pasiendaftar_t as pd','pd.norec','=','pa.noregistrasifk')
        ->select('pa.nokepesertaan','pd.norec')
        ->where('pa.statusenabled',true)
        ->where('pd.noregistrasi','=',$request['noregistrasi'] )
        ->get();
        if($request['kelompokpasien'] == 'BPJS')
        {   
            if(!empty($datas))
            {
                foreach($datas as $itil)
                {
                    // return($itil->nokepesertaan);
                    // die;
                    $nopesertakep=$itil->nokepesertaan;
                    $norecTake=$itil->norec;
                }
               
            }else{
                $nopesertakep=$request['noregistrasi'] ;
            }

        }
            // return($norecTake);
            // die;
            if ($request['norecjkn'] == '') {
                $newptp = new JadwalOperasiBpjs();
                $norec = $newptp->generateNewId();
            // $nontrian= JadwalOperasiBpjs::where('jenis',$request['jenis'])
            //         ->whereBetween('tanggalreservasi',[$tglAwal,$tglAkhir])
            //         ->max('noantrian')+1;
            $kodebooking = "OK" . $request['tanggaloperasi'] . $request['kdpoli'] . $nopesertakep;
            $newptp->kodebooking = $kodebooking;
            // return($kodebooking);
            // die();
            $newptp->norec = $norec;            
            } else {
                $newptp =  JadwalOperasiBpjs::where('norec', $request['norecjkn'])->first();
            }


            $newptp->tanggaloperasi = $request['tanggaloperasi'];
            $newptp->jenistindakan = $request['jenistindakan'];
            $newptp->kodepoli = $request['kdpoli'];
            $newptp->namapoli = $request['nmpoli'];
            $newptp->terlaksana = 0;
            $newptp->nopeserta =  $nopesertakep;
            $newptp->lastupdate =  $tStamp;
            $newptp->statusenabled = true;
            $newptp->nocm =  $request['nocm'];
            $newptp->namapeserta =  $request['namaPeserta'];
            $newptp->jam =  $request['jam'];
            $newptp->ok =  $request['ok'];
            $newptp->petugasok =  $request['petugasok'];
            $newptp->dokteroperatorfk = $request['dokteroperatorfk'];
            $newptp->dokteranestesi =  $request['dokteranestesi'];
            $newptp->mulaiop =  $request['tglmulai'];
            $newptp->selesaiop =  $request['tglselesai'];
            $newptp->noregistrasifk =  $norecTake;
            $newptp->noregistrasi2 =  $request['noregistrasi'];
            $newptp->keteranganverif =  $request['keteranganverif'];

            
            $newptp->save();
            $noRec=$newptp->norec;
            $updatePP=PelayananPasien::where('norec',$request['norec_pp'])
            ->update([
                    'strukorderfk' => $request['norec_so']
                ]
            ); 
            $updatePP=StrukOrder::where('norec',$request['norec_so'])
            ->update([
                    'status' => 1,
                    'tglpelayananakhir' =>$request['tanggaloperasi'],
                    'tglpelayananawal' =>$request['tanggaloperasi']
                ]
            );

            $transMessage = "Simpan Jadwal Operasi";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Jadwal Operasi Gagal";
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
    public function getAllPermintaanOperasiJkn3(Request $request) {
        $dataLogin = $request->all();
        // return($request);
        // die();

        $data = \DB::table('jadwaloperasijkn_t as jo')
            ->select('jo.norec','jo.kodebooking', 'jo.tanggaloperasi',
                'jo.jenistindakan', 'jo.kodepoli','jo.namapoli','jo.terlaksana','jo.nopeserta',
                'jo.lastupdate','nocm','namapeserta')
            // ->where('jo.terlaksana',0)
            ->where('jo.statusenabled',true);

                
            

                $data = $data->orderBy('jo.kodebooking','desc');
//          $data = $data->take(100);
                $data = $data->distinct();
                $data = $data->get();
                // return($data);
                // die();
               

                $res = array(
                    "list" => $data
                );
                $metadata = array(
                    'message'=>"Ok",
                    'code'=>200
                );

            
                $result = array(
                    'response'=>$res,
                    'metadata'=>$metadata
                );
                return $this->respond($result);
    }
    public function getAllPermintaanOperasidetail(Request $request) {
        $dataLogin = $request->all();
        // return($request);
        // die();

        $data = \DB::table('jadwaloperasijkn_t as jo')
            ->leftjoin('pegawai_m as pdokter', 'pdokter.id', '=', 'jo.dokteroperatorfk')
            ->leftjoin('pegawai_m as panastesi', 'panastesi.id', '=', 'jo.dokteranestesi')            
            ->select('jo.*',
            'pdokter.namalengkap as namadokter',
            'panastesi.namalengkap as namadokteranestesi')
            ->where('jo.norec',$request['norec'])
            ->where('jo.statusenabled',true);
                $data = $data->orderBy('jo.kodebooking','desc');
                $data = $data->distinct();
                $data = $data->get();
               

                $res = array(
                    "list" => $data
                );
                $metadata = array(
                    'message'=>"Ok",
                    'code'=>200
                );

            
                $result = array(
                    'response'=>$res,
                    'metadata'=>$metadata
                );
                return $this->respond($result);
    }
    public function getHasilLab(Request $request) {
        $noOrders = $request['noorder'];
        $lisOrder = DB::table('lisorder as lis')
            ->select('lis.ono as noLab',  'lis.order_testid as ordertestid','lis.pid as rm', 'lis.request_dt as dt')
            ->where('lis.ono',$noOrders)
            ->get();
        $dataResultDetail = [];
        if(count($lisOrder) > 0){
            $dataResultDetail = DB::table('resdt as dt')
                ->select('dt.ono as idLab', 'dt.test_cd as kdtesext',
                    'dt.his_detil as kdDetail', 'dt.test_nm as namaPemeriksaan', 'dt.result_value as hasilPemeriksaan', 'dt.validate_by as validator',
                    'dt.result_ft as hasilft', 'dt.unit as satuan', 'dt.ref_range as nilaiNormal','dt.test_comment as keterangan',
                    'dt.disp_seq as urutan' , 'dt.test_group as paket', 'dt.flag')
                ->where('dt.ono',$lisOrder[0]->noLab)
                ->get();
        }
        $result = array(
            'data' => $dataResultDetail,
            'message' => 'ramdanegie'
        );
        return $this->respond($result);

    }
    public function getDaftarRIlabRad(Request $request)
    {
        $filter = $request->all();
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
            ->leftJOIN('rekanan_m as rek','rek.id','=','pd.objectrekananfk')
            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk as rpp','pd.nostruklastfk','apd.norec as norec_apd','pd.norec',
                'pd.objectkelasfk','pd.objectruanganlastfk','pd.objectpegawaifk as pgid','rek.namarekanan as rekanan')
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
            'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk','pd.nostruklastfk','apd.norec',
            'pd.norec',
            'pd.objectkelasfk','pd.objectruanganlastfk','pd.objectpegawaifk','rek.namarekanan');
        $data = $data->where('dp.id','=',16);
        $data = $data->whereNull('pd.tglpulang');
        $data = $data->whereNull('apd.tglkeluar');
        $data = $data->where('pd.tglregistrasi','>','2019-05-25 00:00');
        $data = $data->take(50);
        $data = $data->get();
        return $this->respond($data);


    }
    public function getDetailRegLabRad(Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->join('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
//            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
//            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
//            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
//            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->leftjoin('kelas_m as kl','kl.id','=','apd.objectkelasfk')
//            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
//                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
//                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk as rpp','pd.nostruklastfk')

            ->select('ru.namaruangan','pd.noregistrasi','pd.norec as norec_pd',
                'pd.tglregistrasi','pg.namalengkap as namadokter','kl.namakelas','apd.tglmasuk','apd.tglkeluar','apd.norec','pg.id as pgid',
                'apd.objectruanganfk')
            ->orderBy('apd.tglmasuk');

        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
//        $data = $data->where('dp.id','=',16);
//        $data = $data->whereNull('pd.tglpulang');
//        $data = $data->where('pd.tglregistrasi','>','2019-05-25 00:00');
//        $data = $data->take(50);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getHasilLaborat(Request $request) {
        $noOrders = $request['noorder'];
        $data = DB::table('lab_hasil as lis')
            ->select('*')
            ->where('lis.no_lab',$noOrders)
            ->get();
        $lab_hasil_teks = DB::table('lab_hasil_teks as lis')
            ->select('*')
            ->where('lis.no_lab',$noOrders)
            ->get();

        $result = array(
            'data' => $data,
            'lab_hasil_teks' => $lab_hasil_teks,
            "as" => 'er@epic',
        );
        return $this->respond($result);

    }
     public function getHasilLabVans(Request $request) {
        $noOrders = $request['noorder'];
        $data = \DB::connection('firebird')
        ->table('KUNJUNGANPASIEN as kp')
        ->join('pasien as p', 'p.KD_PASIEN', '=', 'kp.KPKD_PASIEN')                                    
        ->join('DOKTER as dok', 'dok.FMDDOKTER_ID', '=', 'kp.KPKD_DOKTER')   
        ->join('CUSTOMER as cus', 'cus.CUSID', '=', 'kp.KD_CUSTOMER')       
        ->join('POLIKLINIK as pol', 'pol.FMPKLINIK_ID', '=', 'kp.KPKD_POLY') 
        ->limit('10') 
        ->select('kp.KPKD_PASIEN as norec','p.NAMAPASIEN as namapasien', 'kp.KPTGL_PERIKSA as tglregistrasi',
                'kp.KPNO_TRANSAKSI as notransaksi','pol.FMPKLINIKN as poliklinik'
                ,'dok.FMDDOKTERN as namadokter','cus.NAME as carabayar','kp.KPJAM_MASUK as jam_masuk')
        ->where('kp.KPKD_POLY','!=','PK011');

        $result = array(
            'data' => $data,
            'lab_hasil_teks' => $lab_hasil_teks,
            "as" => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getHasilLabManual(Request $r){
        $umur =$r['umur'];
        //    return(substr($r['tglP'],5,2) );
        //    die;
        if (substr($r['tglP'], 5, 2) == '01') {

            $data = DB::select(DB::raw("select DISTINCT  '' as hasilpemeriksaanterakhir,
                                            pp.noregistrasifk AS norec_apd, djp.detailjenisproduk, pp.produkfk, prd.namaproduk, maps.detailpemeriksaan, maps.memohasil, maps.nourutdetail, maps.satuanstandarfk, ss.satuanstandar, nn.nilaitext, nn.tipedata, nn.nilaimin,
                                            nn.nilaimax, hh.hasil, maps.id AS map_id, hh.norec AS norec_hasil, maps.nourutjenispemeriksaan, maps.nourutdetail AS Expr1, pp.norec AS norecpp, nn.nilaimin || '-' || nn.nilaimax AS nilainormalstr, hh.flag, nn.id AS idnn, 
                                            maps2.jeniskelaminfk, nn.metode AS Metode, pp.tglpelayanan, hh.tglhasil, pg.id, pg.namalengkap, hh.hasil_s, hh.hasil_i, hh.catatan, hh.catatancetak, hh.tglcetak, pp.isclaim, prd.maxtime, prd.mintime, hh.skor, nk.nilaimin as nilaiminkritis, nk.nilaimax as nilaimaxkritis
                                FROM            pelayananpasien_t AS pp LEFT OUTER JOIN
                                            produk_m AS prd ON prd.id = pp.produkfk LEFT OUTER JOIN
                                            detailjenisproduk_m AS djp ON djp.id = prd.objectdetailjenisprodukfk LEFT OUTER JOIN
                                            maphasillab_m AS maps ON maps.produkfk = prd.id LEFT OUTER JOIN
                                            maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.id AND maps2.jeniskelaminfk = '$r[objectjeniskelaminfk]' AND maps2.kelompokumurfk IN
                                                (SELECT        id
                                                FROM            kelompokumur_m AS kuu
                                                WHERE        ($umur BETWEEN umurmin AND umurmax)) INNER JOIN
                                            nilainormal_m AS nn ON nn.id = maps2.nilainormalfk LEFT OUTER JOIN
                                             nilaikritis_m AS nk ON nk.id = maps2.nilaikritisfk LEFT OUTER JOIN
                                            pegawai_m AS pg ON pg.id = pp.objectpegawaipengirimfk LEFT OUTER JOIN
                                            satuanstandar_m AS ss ON ss.id = maps.satuanstandarfk LEFT OUTER JOIN
                                            hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec AND pp.noregistrasifk = hh.noregistrasifk AND maps.detailpemeriksaan = hh.detailpemeriksaan
                                WHERE        (pp.norec IN ($r[norec]) and maps2.statusenabled=true  )
                                ORDER BY maps.nourutjenispemeriksaan, maps.nourutdetail"));
        } else {
            $data = DB::select(DB::raw("select distinct '' as hasilpemeriksaanterakhir, pp.noregistrasifk as norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk  ,maps.detailpemeriksaan,maps.memohasil,
                maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.tipedata,nn.nilaimin,nn.nilaimax,hh.hasil,
                maps.id as map_id,hh.norec as norec_hasil,maps.nourutjenispemeriksaan,maps.nourutdetail,pp.norec as norecpp,nn.nilaimin || '-' || nn.nilaimax as nilainormalstr,
                hh.flag,nn.id as idnn,maps2.jeniskelaminfk,nn.metode as Metode,pp.tglpelayanan,hh.tglhasil,pg.id,pg.namalengkap,hh.hasil_s,hh.hasil_i,hh.catatan,hh.catatancetak,hh.tglcetak, pp.isclaim, prd.maxtime, prd.mintime,hh.skor, nk.nilaimin as nilaiminkritis, nk.nilaimax as nilaimaxkritis
                FROM pelayananpasien_t  as pp
                LEFT join produk_m as prd on prd.id = pp.produkfk
                LEFT join detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk
                LEFT join maphasillab_m  as maps on maps.produkfk = prd.id
                LEFT join maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id 
                and maps2.jeniskelaminfk ='$r[objectjeniskelaminfk]'
                and maps2.kelompokumurfk in (select id from kelompokumur_m  kuu where $umur BETWEEN kuu.umurmin and kuu.umurmax) 
                inner join nilainormal_m  as nn on nn.id = maps2.nilainormalfk
                LEFT OUTER JOIN nilaikritis_m AS nk ON nk.id = maps2.nilaikritisfk
                LEFT JOIN pegawai_m AS pg ON pg.id = pp.objectpegawaipengirimfk
                left join satuanstandar_m  as ss on ss.id = maps.satuanstandarfk
                left join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
                and pp.noregistrasifk=hh.noregistrasifk
                 and maps.detailpemeriksaan =hh.detailpemeriksaan  and maps.id =hh.maphasilfk 
                where   pp.norec in ($r[norec])   and maps2.statusenabled=true
                order by  maps.nourutjenispemeriksaan,maps.nourutdetail asc"));
        }
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }

    public function getHasilLabManuallast(Request $r)
    {
        
          
            $data = DB::select(DB::raw("select hasillaboratorium_t.produkfk,hasil,hasillaboratorium_t.tglhasil,hasillaboratorium_t.detailpemeriksaan,pp.tglpelayanan from hasillaboratorium_t 
            inner join antrianpasiendiperiksa_t as apd on apd.norec = hasillaboratorium_t.noregistrasifk
            inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
            inner join pasien_m as ps on ps.id = pd.nocmfk
            inner join pelayananpasien_t as pp on pp.norec = hasillaboratorium_t.norecpelayanan 
            where nocm='$r[nocm]' and pp.tglpelayanan < '$r[tglpelayanan]' order by pp.tglpelayanan
            "));
                
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }

    public function getRiwayatHasil(Request $r){
        // $umur =$r['umur'];
        // $dataPasien = DB::select(DB::raw("SELECT id from pasien_m where nocm= '$r[nocmfk]'"));
//        $kdProfile = $this->getDataKdProfile($r);
//        $idProfile = (int) $kdProfile;
        $filter ="";
        $filterPelayanan ="";
        $dataPasien = DB::select(DB::raw("SELECT id from pasien_m where nocm= '$r[nocmfk]' and statusenabled = true"));

        $noRmGet = 1;
        foreach ($dataPasien as $key => $value) {
            $noRmGet = $value -> id;
        }
        if($r['tglAwal'] != "")
        {
            $filter ="  and pp.tglpelayanan BETWEEN '$r[tglAwal]'  and  '$r[tglAkhir]' ";
            // $filter ="  and pp.tglpelayanan = '$r[tglAwal]'";
        }
        if($r['produkfk'] != "")
        {
            $filterPelayanan ="  and pp.produkfk = '$r[produkfk]' ";
            // $filter ="  and pp.tglpelayanan = '$r[tglAwal]'";
        }

        $data = DB::select(DB::raw("SELECT pp.tglpelayanan ,pp.noregistrasifk as norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk  ,maps.detailpemeriksaan,maps.memohasil,
                maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.tipedata,nn.nilaimin,nn.nilaimax,hh.hasil,
                maps.id as map_id,hh.norec as norec_hasil,maps.nourutjenispemeriksaan,maps.nourutdetail,pp.norec as norecpp,nn.nilaimin || '-' || nn.nilaimax as nilainormalstr,
                hh.flag,nn.id as idnn,maps2.jeniskelaminfk
                FROM pelayananpasien_t  as pp
                inner join produk_m as prd on prd.id = pp.produkfk
                inner join detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk
                inner join maphasillab_m  as maps on maps.produkfk = prd.id
                inner join maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id 
                and maps2.jeniskelaminfk ='$r[objectjeniskelaminfk]'
                inner join nilainormal_m  as nn on nn.id = maps2.nilainormalfk
                inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk
                inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
                left join satuanstandar_m  as ss on ss.id = maps.satuanstandarfk
                left join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
                and pp.noregistrasifk=hh.noregistrasifk
                and maps.detailpemeriksaan =hh.detailpemeriksaan 
                where pd.nocmfk = $noRmGet  $filter $filterPelayanan
                group by pp.tglpelayanan ,pp.noregistrasifk ,djp.detailjenisproduk,pp.produkfk,prd.namaproduk ,maps.detailpemeriksaan,maps.memohasil,
                maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.tipedata,nn.nilaimin,nn.nilaimax,hh.hasil,
                maps.id ,hh.norec ,maps.nourutjenispemeriksaan,maps.nourutdetail,pp.norec ,
                hh.flag,nn.id ,maps2.jeniskelaminfk
                order by   maps.nourutjenispemeriksaan,maps.nourutdetail asc"));
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }
    public function getDokter(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
//        $idProfile = (int) $kdProfile;
        $kdJenisPegawaiDokter =(int) $this->settingDataFixed('kdJenisPegawaiDokter');
        // $detail = DB::select(DB::raw("select id,namalengkap from pegawai_m WHERE id=$kdJenisPegawaiDokter and statusenabled=true"));
        $detail = DB::select(DB::raw("select id,namalengkap from pegawai_m WHERE statusenabled=true"));
        // ->where('djp.objectdepartemenfk',$this->settingDataFixed('KdDepartemenInstalasiLaboratorium'));
        return ($detail);
    }
    public function getForUpdateNilaiNormal(Request $r){
        $produkfk = $r['produkfk'];
        $mpid = $r['mpid'];
        $data = DB::select(DB::raw("
            select nn.id as nnid,ku.id as kuid, ku.kelompokumur,jk.id as jkid,jk.jeniskelamin,  nn.nilaimin,nilaimax,nn.nilaitext from maphasillab_m as mp
            INNER JOIN maphasillabdetail_m as mp2 on mp2.maphasilfk=mp.id
            INNER JOIN nilainormal_m as nn on nn.id=mp2.nilainormalfk
            INNER JOIN kelompokumur_m as ku on ku.id=nn.kelompokumurfk
            INNER JOIN jeniskelamin_m as jk on jk.id=nn.objectjeniskelaminfk
            where mp.produkfk=$produkfk and mp.id=$mpid"));
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }
    public function getRiwayatBayar(Request $r){

//        $kdProfile = $this->getDataKdProfile($r);
//        $idProfile = (int) $kdProfile;
        $filter ="";
        $filterPelayanan ="";
        $data = DB::select(DB::raw("SELECT pasiendaftar_t.nostruklastfk FROM  pasiendaftar_t
                                     INNER JOIN antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk 
                                     where antrianpasiendiperiksa_t.norec ='$r[norec]' and 
                                      pasiendaftar_t.objectkelompokpasienlastfk in (1)"));
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }


    public function getDataPsn(Request $r){
        $kdProfile = $this->getDataKdProfile($r);
        $idProfile = (int) $kdProfile;
        $dataPasien = DB::select(DB::raw("SELECT id from pasien_m where nocm= '$r[nocmfk]' and kdprofile=$idProfile and statusenabled = true"));

        return $dataPasien;
    }




    public function getTempleting(Request $r){
        $umur =$r['umur'];
        $data = DB::select(DB::raw("select * from maptempletlab_m where idprodukfk='$r.id'"));

        return $data ;
    }

    // @all
    public function getLaporanTindakan(Request $r){
        $umur =$r['umur'];
        $filter ="";
        $filterRuangan="";
        if($r['kelId'] == ""){
            $filter ="";
        }else
        {
            $filter ="and pd.objectkelompokpasienlastfk =$r[kelId]";
        };
        if($r['idRuangan'] == ""){
            $filterRuangan ="";
        }else
        {
            $filterRuangan ="and apd.objectruanganfk =$r[idRuangan]";
        };
        $data = DB::select(DB::raw("SELECT distinct
        pd.noregistrasi,
        pd.tglregistrasi,
        ps.nocm,
        ps.namapasien,
        kp.kelompokpasien,
        pp.tglpelayanan,
        dp.detailjenisproduk,
        pk.namaproduk,
        ((pp.hargajual - pp.hargadiscount) * pp.jumlah) AS totalbiaya,
        pp.jumlah,pp.hargajual
        -- (hh.tglhasil - pp.tglpelayanan) as tat,
        -- hh.tglhasil
    FROM
        (
            (
                (
                    (
                        (
                            (
                                (
                                    pelayananpasien_t pp
                                    JOIN antrianpasiendiperiksa_t apd ON (
                                        (
                                            pp.noregistrasifk = apd.norec
                                        )
                                    )
                                    join hasillaboratorium_t hh on(
                                         hh.norecpelayanan = pp.norec
                                        )
                                )
                                JOIN pasiendaftar_t pd ON (
                                    (
                                        apd.noregistrasifk = pd.norec
                                    )
                                )
                            )
                            JOIN produk_m pk ON ((pp.produkfk = pk. ID))
                        )
                        JOIN pasien_m ps ON ((pd.nocmfk = ps. ID))
                        JOIN kelompokpasien_m kp ON (
                             pd.objectkelompokpasienlastfk = kp. ID
                        )
                    )
                    JOIN ruangan_m rm ON (
                        (apd.objectruanganfk = rm. ID)
                    )
                )
                JOIN departemen_m dm ON (
                    (
                        rm.objectdepartemenfk = dm. ID
                    )
                )
            )
            JOIN detailjenisproduk_m dp ON (
                (
                    pk.objectdetailjenisprodukfk = dp. ID
                )

            )
        )
    WHERE
        (
            (dm. ID = 3)
            -- AND (
            --     pk.kdprofile = '0' :: SMALLINT
            -- )
            and (pp.tglpelayanan between '$r[tglAwal]' and '$r[tglAkhir]')
            and pp.isobat IS NULL
            $filter 
            $filterRuangan
            
        )"));
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }
    public function getLaporanTAT(Request $r){
        $umur =$r['umur'];
        $filter ="";
        $fiter1="";
        if($r['kelId'] == ""){
            $filter ="";
        }else
        {
            $filter ="and pd.objectkelompokpasienlastfk =$r[kelId]";
        };
        if($r['idPk'] == ""){
            $filter1 ="";
        }else
        {
            $filter1 ="and  pk.ID =$r[idPk]";
        };
        $data = DB::select(DB::raw("SELECT distinct noregistrasi,
            tglregistrasi,nocm,namapasien,kelompokpasien,detailjenisproduk,namaproduk,tglpelayanan,tat,tglhasil from (select
            pd.noregistrasi,
            pd.tglregistrasi,
            ps.nocm,
            ps.namapasien,
            kp.kelompokpasien,
            dp.detailjenisproduk,
            pk.namaproduk,
            pp.tglpelayanan,       
            (hh.tglhasil - pp.tglpelayanan) as tat,
            hh.tglhasil
            FROM
                (
                    (
                        (
                            (
                                (
                                    (
                                        (
                                            pelayananpasien_t pp
                                            JOIN antrianpasiendiperiksa_t apd ON (
                                                (
                                                    pp.noregistrasifk = apd.norec
                                                )
                                            )
                                            join hasillaboratorium_t hh on(
                                                hh.norecpelayanan = pp.norec
                                                )
                                        )
                                        JOIN pasiendaftar_t pd ON (
                                            (
                                                apd.noregistrasifk = pd.norec
                                            )
                                        )
                                    )
                                    JOIN produk_m pk ON ((pp.produkfk = pk. ID))
                                )
                                JOIN pasien_m ps ON ((pd.nocmfk = ps. ID))
                                JOIN kelompokpasien_m kp ON (
                                    pd.objectkelompokpasienlastfk = kp. ID
                                )
                            )
                            JOIN ruangan_m rm ON (
                                (apd.objectruanganfk = rm. ID)
                            )
                        )
                        JOIN departemen_m dm ON (
                            (
                                rm.objectdepartemenfk = dm. ID
                            )
                        )
                    )
                    JOIN detailjenisproduk_m dp ON (
                        (
                            pk.objectdetailjenisprodukfk = dp. ID
                        )

                    )
                )
            WHERE
                (
                    (dm. ID = 3)
                    AND (
                        pk.kdprofile = '0' :: SMALLINT
                    )
                    and (pp.tglpelayanan between '$r[tglAwal]' and '$r[tglAkhir]')
                    and pp.isobat IS NULL
                    $filter 
                    $filter1
                    
                ) ) as TAT"));
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }


    public function getLaporanRekapTindakan(Request $r){
        // $umur =$r['umur'];
        $filter ="";
        if($r['kelId'] == ""){
            $filter ="";
        }else
        {
            $filter ="and pd.objectkelompokpasienlastfk =$r[kelId]";
        };
        $data = DB::select(DB::raw("SELECT        kp.kelompokpasien, dp.detailjenisproduk, pk.namaproduk,  SUM(pp.jumlah) AS jumlah
        FROM            pelayananpasien_t AS pp INNER JOIN
                                 antrianpasiendiperiksa_t AS apd ON pp.noregistrasifk = apd.norec INNER JOIN
                                 pasiendaftar_t AS pd ON apd.noregistrasifk = pd.norec INNER JOIN
                                 produk_m AS pk ON pp.produkfk = pk.id INNER JOIN
                                 pasien_m AS ps ON pd.nocmfk = ps.id INNER JOIN
                                 ruangan_m AS rm ON apd.objectruanganfk = rm.id INNER JOIN
                                 departemen_m AS dm ON rm.objectdepartemenfk = dm.id INNER JOIN
                                 kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id INNER JOIN
                                 detailjenisproduk_m AS dp ON pk.objectdetailjenisprodukfk = dp.id
        WHERE        (dm.id = 3) AND (pk.kdprofile = '0') AND (pp.tglpelayanan BETWEEN '$r[tglAwal]'  AND '$r[tglAkhir]') AND (pp.isobat IS NULL) $filter
        GROUP BY kp.kelompokpasien, dp.detailjenisproduk, pk.namaproduk
           "));
        $result =  array(
            'data' => $data,
        );
        return $this->respond($result);
    }
    public function saveHasilLabManual(Request $request) {
        //        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = 0;//(int) $kdProfile;
        DB::beginTransaction();
        // try{
            foreach ($request['hasil'] as $key => $value) {
                $noregistrasifk = str_pad($value['noregistrasifk'], 32, ' ', STR_PAD_RIGHT);
                $norecpelayanan = str_pad($value['norecpelayanan'], 32, ' ', STR_PAD_RIGHT);
                $cek =  HasilLaboratorium::where([
                    // 'noregistrasifk',$request['hasil'][0]['noregistrasifk']
                    // 'norecpelayanan',$value['norecpelayanan']
                    'noregistrasifk' => $noregistrasifk,
                    'norecpelayanan' => $norecpelayanan,
                    'produkfk' => $value['produkfk'],
                    // 'detailpemeriksaan' => $value['detailpemeriksaan'],
                    'norec' => $value['norec_hasil'],
                    'maphasilfk' => $value['maphasilfk'],
                    // detailpemeriksaan 
                ])->first();
                if(!empty($cek)){
                    $norec[] = $value['norec_hasil'];
                   if($value['hasil'] == '' && $value['produkfk'] != 4082520)  //4082520 itu untuk kondisi "Pembacaan BMP"
                   {
                       $hapus = HasilLaboratorium::where(
                            [
                                'noregistrasifk' => $value['noregistrasifk'],
                                'norecpelayanan' => $value['norecpelayanan'],
                                'produkfk' => $value['produkfk'],
                                'detailpemeriksaan' => $value['detailpemeriksaan'],
                                'maphasilfk' => $value['maphasilfk'],
                                
                            ]
                        )->delete();
                   }else
                   {
                        $update = HasilLaboratorium::where([
                            // 'noregistrasifk',$request['hasil'][0]['noregistrasifk']
                            // 'norecpelayanan',$value['norecpelayanan']
                            'noregistrasifk' => $value['noregistrasifk'],
                            'norecpelayanan' => $value['norecpelayanan'],
                            'produkfk' => $value['produkfk'],
                            'detailpemeriksaan' => $value['detailpemeriksaan'],
                            'maphasilfk' => $value['maphasilfk'],
                            
                        ])->update(
                            [
                                'hasil' => $value['hasil'],
                                'flag' => $value['flag'],
                                'maphasilfk' => $value['maphasilfk'],
                                'hasil_s' => $value['hasil_s'],
                                'hasil_i' => $value['hasil_i'],
                                'catatan' => $value['catatan'],
                                'catatancetak' => $value['catatancetak'],
                                'skor' => $value['skor'],
                                'satuan' => $value['satuan'],
                                'nilainormal' => $value['nilainormal'],
                            ]
                        ); 
                    }
                }else
                {
                    $h = new HasilLaboratorium();
                    $noreclah =  $h->generateNewId();
                    $h->norec = $noreclah;
                    $h->kdprofile = $idProfile;
                    $h->statusenabled = true;
                    $h->tglhasil = date('Y-m-d H:i:s');
                    $h->pegawaifk = $this->getCurrentUserID();
                    $h->hasil = $value['hasil'];
                    $h->noregistrasifk = $value['noregistrasifk'];
                    $h->produkfk = $value['produkfk'];
                    $h->flag = $value['flag'];
                    $h->detailpemeriksaan = $value['detailpemeriksaan'];
                    $h->norecpelayanan = $value['norecpelayanan'];
                    $h->maphasilfk = $value['maphasilfk'];
                    $h->hasil_s = $value['hasil_s'];
                    $h->hasil_i = $value['hasil_i'];
                    $h->catatan = $value['catatan'];
                    $h->catatancetak = $value['catatancetak'];
                    $h->skor = $value['skor'];
                    $h->satuan = $value['satuan'];
                    $h->nilainormal = $value['nilainormal'];
                    $h->save();
                    $norec[] = $h->norec;
                      //loging
                   
                }

                # code...
                $dataResistrasi = DB::select(DB::raw(" SELECT        pasiendaftar_t.noregistrasi
                                                         FROM            pasiendaftar_t INNER JOIN
                                                        antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk
                                                        where antrianpasiendiperiksa_t.norec ='$value[noregistrasifk]'"));     
                $newId = LoggingUser::max('id');
                $newId = $newId +1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile= 11;
                $logUser->statusenabled=true;
                $logUser->jenislog = 'Save Hasil Lab';
                $logUser->noreff = $request['norec_pd'];
                $logUser->referensi='Save Hasil Lab';
                $logUser->objectloginuserfk = $this->getCurrentUserID();
                $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                if(!empty($dataResistrasi))
                {
                    foreach($dataResistrasi as $asup)
                    {
                        $logUser->keterangan = 'No Registrasi'.$asup->noregistrasi .' / detailpemeriksaan : '.$value['detailpemeriksaan']   .' / Hasil : '.$value['hasil'];
             
                    }
                  
                }
                else
                {
                    $logUser->keterangan = 'No Registrasi f '.$value['noregistrasifk'] .' / detailpemeriksaan : '.$value['detailpemeriksaan']   .' / Hasil : '.$value['hasil'];
             
                }
               
                //            try {
        
                $logUser->save();

            }



            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';

        // }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $ihs = null;

            foreach ($norec as $it) {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['norec_hasil'] = $it;
                $ihs = app('App\Http\Controllers\Bridging\IHSController')->ObservationLab($objetoRequest, true);
            }
            $ihs2 = null;

            $objetoRequest2 = new \Illuminate\Http\Request();
            $objetoRequest2['norec_hasil'] = $it;
            $objetoRequest2['norec_arr'] = $norec;

            $ihs2 = app('App\Http\Controllers\Bridging\IHSController')->DiagnosticReport($objetoRequest2, true);


            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "Observation" => $ihs,
                "DiagnosticReport" => $ihs2,
                "norec" => $norec,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            // dd($result);
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function saveTAT(Request $request) {

        //$kdProfile = $this->getDataKdProfile($request);
        //$idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            $cek =  HitungTAT::where([
                'noregistrasifk' => $request['noregistrasifk']
            ])->first();
            if(!empty($cek)){
                HitungTAT::where('noregistrasifk',$request['noregistrasifk'])->delete();
            }

            $tat = new HitungTAT();
            $tat->id  =HitungTAT::max('id') + 1;
            $tat->noregistrasifk= $request['noregistrasifk'];
            $tat->tglawal=  date('Y-m-d H:i:s');
            $tat->tglakhir=  date('Y-m-d H:i:s');
            $tat->statusenabled = 1;
            $tat->save();
            # code...
            $produk = DB::table('hasillaboratorium_t')->where([
                'noregistrasifk' => $request['noregistrasifk']

            ])->update(
                [
                    'idtatfk' =>  HitungTAT::max('id')
                ]
            );


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
     public function deleteMapHasilLab(Request $request)
    {
        DB::beginTransaction();
        try {
           
            $dataSO =  MapHasilLabDetail::where('id', $request['iddetail'])->first();          
            $dataSO->statusenabled = false; //$request['statusenabled'];          
            $dataSO->save();           
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
      public function saveMapHasilLab2(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request['details'] as $d) {
                if(isset($d['index']) ){
                    if( $d['id']!= 0){
                    $id = $d['id'];
                    $dataSO =  Produk::where('id', $d['id'])->first();
                    $dataSO->detailjenispemeriksaanlabfk = $request['id'];
                    $dataSO->nourutdetailjenispemeriksaanlab = $request['nourut'];

                    $dataSO->save();  
                    }
                    
                }
                
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteMapHasilLab2(Request $request)
    {
        DB::beginTransaction();
        try {
        foreach ($request['details'] as $d) {
            if (isset($d['checked'])) {
                if ($d['checked'] == true) {
                    $id = $d['id'];
                    $dataSO =  Produk::where('id', $d['id'])->first();
                    $dataSO->detailjenispemeriksaanlabfk = null;
                    $dataSO->nourutdetailjenispemeriksaanlab = null;

                    $dataSO->save();
                }
            }
        }
        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveMapHasilLab(Request $request)
    {
        $kdProfile = 0;
        $idProfile = 0;
        $tempnourutdetail = "";
        DB::beginTransaction();
        try {
            $detailpemeriksaan = $request['detailpemeriksaan'];
            foreach ($request['dataspasi'] as $d) {
                $detailpemeriksaan = ' ' . $detailpemeriksaan;
            }
            if ($request['id'] == "") {
                $dataSO = new MapHasilLab();
                $id = MapHasilLab::max('id') + 1;
                $dataSO->id = $id;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
            } else {
                $dataSO =  MapHasilLab::where('id', $request['id'])->first();
            }

            $dataSO->statusenabled = true; //$request['statusenabled'];
            $dataSO->produkfk = $request['produkfk'];
            $dataSO->detailpemeriksaan = $detailpemeriksaan;
            $dataSO->nourutdetail = $request['nourutdetail'];
            $dataSO->satuanstandarfk = $request['satuanstandarfk'];
            $dataSO->memohasil = $request['memohasil'];
            $dataSO->nourutjenispemeriksaan = $request['nourutjenis'];
            $dataSO->spasi = $request['spasi'];
            $iddet =  $dataSO->id;
            $dataSO->save();                      
            foreach ($request['details'] as $d) {
             
                if (isset($d['iddetail'] ) && $d['iddetail']  != 'undefined' && $d['iddetail']  != '') {
                  
                    $dataSO2 =  MapHasilLabDetail::where('id', $d['iddetail'])->first();                   
                } else {
                    $dataSO2 = new MapHasilLabDetail();
                    $dataSO2->id = MapHasilLabDetail::max('id') + 1;
                }
                $dataSO2->kdprofile = $idProfile;
                $dataSO2->statusenabled = true; //$request['statusenabled'];
                $dataSO2->jeniskelaminfk = $d['jeniskelaminfk'];
                $dataSO2->nilainormalfk = $d['nilainormalfk'];
                $dataSO2->kelompokumurfk = $d['kelompokumurfk'];
                $dataSO2->maphasilfk = $iddet;
                $dataSO2->save();
            }

            foreach ($request['detailkritis'] as $k) {
                MapHasilLabDetail::where('maphasilfk', $k['id'])
                    ->update([
                        'nilaikritisfk' => $k['nilaikritisfk']
                    ]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }



    public function saveUpdateMapHasilLabVB(Request $request) {
        //        $kdProfile = $this->getDataKdProfile($request);
                $idProfile = 0;//(int) $kdProfile;
                DB::beginTransaction();
                try{
                    $pd = MapHasilLab::where('id',$request['id'])->first();
                    $pd->satuanstandarfk = $request['satuanstandarfk'];
                    $pd->save();
                    $transStatus = 'true';
                } catch (\Exception $e) {
                    $transStatus = 'false';
        
                }
        
                if ($transStatus == 'true') {
                    $transMessage = "Simpan";
                    DB::commit();
                    $result = array(
                        "status" => 201,
                        "message" => $transMessage,
                        "as" => 'er@epic',
                    );
        
                } else {
                    $transMessage = "Simpan  gagal!!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message"  => $transMessage,
                        "e"=>$e,
                        "as" =>'er@epic',
                    );
                }
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
    public function saveMapHasilLabVB(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = 0;//(int) $kdProfile;
        DB::beginTransaction();
        try{
            // return $this->respond($request['data'] );
            foreach ($request['data'] as $key => $v) {
                if($v['produkfk'] != null && $v['ssfk']  ){

                    $dataSO = new MapHasilLab();
                    $id =MapHasilLab::max('id') + 1;
                    $dataSO->id =$id ;
                    $dataSO->norec = $dataSO->generateNewId();
                    $dataSO->kdprofile = $idProfile;
                    $dataSO->statusenabled = true;//$request['statusenabled'];
                    $dataSO->produkfk =$v['produkfk'];
                    $dataSO->detailpemeriksaan = $v['NamaDetailPeriksa'];
                    // $dataSO->nourutdetail = $request['nourutdetail'];
                    $dataSO->satuanstandarfk = $v['ssfk'];
                    // $dataSO->memohasil = $request['memohasil'];
                    $dataSO->save();
                    $iddet =  $dataSO->id;
                    foreach ($v['details'] as $d) {
                        if($d['jkid'] !=null&&$d['nilainormalfk'] !=null&& $d['nilainormalfk']!=null ){
                            $dataSO2 = new MapHasilLabDetail();
                            $dataSO2->id =MapHasilLabDetail::max('id') + 1;
                            $dataSO2->kdprofile = $idProfile;
                            $dataSO2->statusenabled = true;//$request['statusenabled'];
                            $dataSO2->jeniskelaminfk =$d['jkid'];
                            $dataSO2->nilainormalfk = $d['nilainormalfk'];
                            $dataSO2->kelompokumurfk = $d['kuid'];
                            $dataSO2->maphasilfk = $iddet;
                            $dataSO2->save();
                        }


                    }
                }

            }



            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getMapLabBantu(Request $r){
        $data = DB::select(DB::raw("SELECT * from maphasillabbantu"));
        $head = DB::select(DB::raw('SELECT NamaPelayanan,NamaDetailPeriksa,SatuanHasil
            FROM maphasillabbantu GROUP BY NamaPelayanan,NamaDetailPeriksa ,SatuanHasil
            order by NamaPelayanan'));
        foreach ($head as $key => $v) {
            if($v->NamaPelayanan == 'BTA Sputum ( Dahak )'){
                $v->NamaPelayanan ='BTA Sputum';
            }
            $produk = Produk::where('namaproduk','ilike','%'.$v->NamaPelayanan.'%')
                ->where('statusenabled',true)
//                ->where('kdprofile',16)
                ->first();
            $ss = SatuanStandar::where('satuanstandar','ilike','%'.$v->SatuanHasil.'%')
                ->where('statusenabled',true)
//                ->where('kdprofile',16)
                ->where('objectdepartemenfk',3)->first();
            if(!empty( $produk )){
                $v->produkfk =   $produk->id;
                $v->namaproduk =   $produk->namaproduk;
            }else{
                $v->produkfk = null;
                $v->namaproduk =  null;
            }
            if(!empty( $ss )){
                $v->ssfk =   $ss->id;
                $v->satuanstandar =   $ss->satuanstandar;
            }else{
                $v->ssfk = null;
                $v->satuanstandar =  null;
            }
            $nama = $v->NamaDetailPeriksa;
            $det =  DB::table('maphasillabbantu as mm')
                ->select('mm.NamaPelayanan','mm.NamaDetailPeriksa','mm.JK','mm.rangeStandar','mm.RangeUmur',
                    'jk.id as jkid','nn.id as nilainormalfk','ku.id as kuid')
                ->leftjoin('jeniskelamin_m as jk','jk.reportdisplay','=','mm.JK')
                ->leftjoin('kelompokumur_m as ku','ku.kelompokumur','=','mm.RangeUmur')
                // ->leftjoin('nilainormal_m as nn','nn.nilaitext','=','mm.rangeStandar')
                // ->leftJoin('nilainormal_m as nn',DB::raw('nn.nilaitext=mm.rangeStandar and nn.kelompokumurfk=kp.id and nn.jeniskelaminfk=jk.id'))
                ->leftjoin('nilainormal_m as nn', function ($join) {
                    $join->on('nn.nilaitext', '=', 'mm.rangeStandar')
                        ->On('nn.kelompokumurfk','=','ku.id')
                        ->On('nn.objectjeniskelaminfk','=','jk.id');
                })
                ->where('mm.NamaDetailPeriksa',$nama)
                ->get();
            $v->details =$det ;

            # code...
        }
        $result =  array(
            'data' => $head,
        );
        return $this->respond($result);
    }

    public function saveAntrianPasienDarah(Request $request){

        $idProfile = 0;//(int) $kdProfile;
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk',$request['objectruanganasalfk'])
                ->where('kdprofile', $idProfile)
                ->where('tglregistrasi', '>=', $request['tglregistrasidate'].' 00:00')
                ->where('tglregistrasi', '<=', $request['tglregistrasidate'].' 23:59')
                ->count('norec');
            $pd = PasienDaftar::where('norec',$request['norec_pd'])->first();
            $noAntrian = $countNoAntrian + 1;
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = $idProfile;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $request['asalrujukanfk'];
            $dataAPD->objectkelasfk = 6;
            $dataAPD->noantrian = $noAntrian;
            $dataAPD->noregistrasifk = $request['norec_pd'];
            $dataAPD->objectpegawaifk = $request['dokterfk'];
            $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuspasien = 1;
            $dataAPD->statuskunjungan = 'LAMA';
            $dataAPD->statuspenyakit = 'BARU';
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];;
            $dataAPD->tglregistrasi = $pd->tglregistrasi;//date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = date('Y-m-d H:i:s');
            $dataAPD->tglmasuk = date('Y-m-d H:i:s');
            $dataAPD->save();

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan AntrianPasienDiperiksa";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveUpdateNilaiNormal(Request $request){

        DB::beginTransaction();
        $pd = "";
        $pd2 ="";
        try {
            //   if($request['p'] != "" )
            //   {
            //     $transStatus = 'false';
            //     $transMessage = "simpan errrorrrrr"; 
            //     return  $transMessage;
            //     die;
            //   }
        if ( $request['l'] != "")
          {
              if($request['l']['id'] !="")
              {
              
                $pd = NilaiNormal::where('id',$request['l']['id'])->first();
                $pd->nilaimax = $request['l']['nilaimax'];
                $pd->nilaimin = $request['l']['nilaimin'];
                $pd->nilaitext = $request['l']['nilaitext'];
                $pd->save();
                $transStatus = 'true';
                $transMessage = "simpan Nilai Normal";
              }
          }
          if ($request['p'] != "" )
          {
              if($request['p']['id'] != "")
              {
               
                $pd2 = NilaiNormal::where('id',$request['p']['id'])->first();
                $pd2->nilaimax = $request['p']['nilaimax'];
                $pd2->nilaimin = $request['p']['nilaimin'];
                $pd2->nilaitext = $request['p']['nilaitext'];
                $pd2->save();
                $transStatus = 'true';
                $transMessage = "simpan Nilai Normal";
              }
          }
           


            $transStatus = 'true';
            $transMessage = "simpan Nilai Normal";
        } catch (\Exception $e) {
       
            $transStatus = 'false';
            $transMessage = "simpan Nilai Normal gagal";
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
                    "pd" => $pd,
                    "pd2" => $pd2,
                    "message" => $transMessage,
                );
          
            
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboMapLab(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $jenis  = DB::table('jenisproduk_m')
            ->select('id','jenisproduk')
//            ->where('kdprofile', $kdProfile  )
            ->where('statusenabled',true)
            ->get();
        $jk  = DB::table('jeniskelamin_m')
            ->select('id','jeniskelamin')
//            ->where('kdprofile', $kdProfile  )
            ->where('statusenabled',true)
            ->get();
        $ku  = DB::table('kelompokumur_m')
            ->select('*')
//            ->where('kdprofile', $kdProfile  )
            ->where('statusenabled',true)
            ->get();
        // $jenisproduk  = DB::table('jenisproduk_m')
        //          ->select('*')
        //          ->where('kdprofile', $kdProfile  )
        //          ->where('statusenabled',true)
        //          ->get();
        $djenisproduk  = DB::table('detailjenisproduk_m')
            ->select('*')
//            ->where('kdprofile', $kdProfile  )
            ->where('statusenabled',true)
            ->get();
        $ss  = DB::table('satuanstandar_m')
            ->select('*')
//            ->where('kdprofile', $kdProfile  )
            ->where('objectdepartemenfk',$this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))
            ->where('statusenabled',true)
            ->get();
        $kdjenisobat = explode (',',$this->settingDataFixed('kdJenisProdukObat'));
        $arrkdjenisobat = [];
        foreach ($kdjenisobat as $it){
            $arrkdjenisobat []=  (int)$it;
        }

        $dataProduk = \DB::table('produk_m as pr')
            ->leftJOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->leftJOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->select('pr.id','pr.namaexternal as namaproduk')
//            ->where('pr.kdprofile', $kdProfile)
            ->where('pr.statusenabled',true)
            ->where('pr.objectdepartemenfk',3)
            // ->where('pr.kodeexternal','<>','BTN 2 TN') teuing naon ieu
            ->groupBy('pr.id','pr.namaexternal')
            ->orderBy('pr.namaexternal')
            ->get();

        $result =  array(
            'jenisproduk' => $jenis,
            'jeniskelamin' => $jk,
            'kelompokumur'=>$ku,
            'produk'=>$dataProduk,
            'satuanstandar' =>$ss,
            // 'jenisproduk'=>$jenisproduk,
            'detailjenisproduk'=>$djenisproduk
        );
        return $this->respond($result);

    }
    public function getJenisPemeriksaan(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $jenis  = DB::table('detailjenisproduk_m as djp')
            ->leftjoin('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftjoin('departemen_m as dp','dp.id','=','djp.objectdepartemenfk')
            ->select('djp.*','jp.jenisproduk','dp.namadepartemen')
//            ->where('djp.kdprofile', $kdProfile  )
            ->where('djp.statusenabled',true)
            ->where('djp.objectdepartemenfk',$this->settingDataFixed('KdDepartemenInstalasiLaboratorium'));
        if(isset($request['nama']) && $request['nama']!='undefined' && $request['nama']!=''){
            $jenis = $jenis->where('djp.detailjenisproduk','ilike','%'.$request['nama'].'%');
        }
        $jenis=  $jenis->limit(50);
        $jenis=  $jenis->get();
        $result =  array(
            'data' => $jenis,
        );
        return $this->respond($result);

    }
    public function getMapHasillab2(Request $request)
    {
        $produk = \DB::table('produk_m as d')
        ->select('*')
            ->where('d.objectdetailjenisprodukfk', '=', $request['kdjenisproduk'])
            ->orderBy('namaproduk')
            ->get();

        $child = [];
        foreach ($produk as $dptmn) {

            $result[] = array(
                'id' =>   $dptmn->id,
                'title' => $dptmn->namaproduk,
                'child' => $child
            );
        }

        $data = $result;

        return $this->respond($data);
    }
    public function getMapHasillab2a(Request $request)
    {
        $produk = \DB::table('produk_m as d')
        ->select('*')
            ->where('d.detailjenispemeriksaanlabfk', '=', $request['kdjenisproduk'])
            ->orderBy('namaproduk')
            ->get();

        $child = [];
        $result[] = array(
            'id' =>  0,
            'title' => '--------Drag Produk Ke Bawah Sini (BUKAN DI DALAM SINI)-----------',
            'child' => $child
        );
        foreach ($produk as $dptmn) {

            $result[] = array(
                'id' =>   $dptmn->id,
                'title' => $dptmn->namaproduk,
                'child' => $child,
                'nourut' => $dptmn->nourutdetailjenispemeriksaanlab
            );
        }

        $data = $result;

        return $this->respond($data);
    }
    
    public function saveDetailJenis(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = 0;//(int) $kdProfile;
        DB::beginTransaction();
        try{
            if($request['method']=='save'){
                if ($request['id']=="") {
                    $dataSO = new DetailJenisProduk();
                    $id =DetailJenisProduk::max('id') + 1;
                    $dataSO->id =$id ;
                    $dataSO->qdetailjenisproduk =$id ;
                    $dataSO->norec = $dataSO->generateNewId();
                    $dataSO->kdprofile = $idProfile;

                }else {
                    $dataSO =  DetailJenisProduk::where('id',$request['id'])->first();
                }
                $dataSO->statusenabled = true;
                $dataSO->kodeexternal =$request['kodeexternal'];
                $dataSO->namaexternal = $request['namaexternal'];
                $dataSO->detailjenisproduk = $request['detailjenisproduk'];
                $dataSO->objectjenisprodukfk = $request['objectjenisprodukfk'];
                $dataSO->objectdepartemenfk =$this->settingDataFixed('KdDepartemenInstalasiLaboratorium', $idProfile);
                $dataSO->save();
            }else{
                DetailJenisProduk::where('id',$request['id'])->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getSatuanHasil(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $jenis  = DB::table('satuanstandar_m as djp')
            ->leftjoin('departemen_m as dp','dp.id','=','djp.objectdepartemenfk')
            ->select('djp.*','dp.namadepartemen')
//            ->where('djp.kdprofile', $kdProfile  )
            ->where('djp.statusenabled',true)
            ->where('djp.objectdepartemenfk',$this->settingDataFixed('KdDepartemenInstalasiLaboratorium'));
        if(isset($request['nama']) && $request['nama']!='undefined' && $request['nama']!=''){
            $jenis = $jenis->where('djp.satuanstandar','ilike','%'.$request['nama'].'%');
        }
        $jenis=  $jenis->limit(50);
        $jenis=  $jenis->get();
        $result =  array(
            'data' => $jenis,
        );
        return $this->respond($result);

    }

    public function saveSatuanHasil(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = 0;// (int) $kdProfile;
        DB::beginTransaction();
        try{
            if($request['method']=='save'){
                if ($request['id']=="") {
                    $dataSO = new SatuanStandar();
                    $id =SatuanStandar::max('id') + 1;
                    $dataSO->id =$id ;
                    $dataSO->norec = $dataSO->generateNewId();
                    $dataSO->kdprofile = $idProfile;

                }else {
                    $dataSO =  SatuanStandar::where('id',$request['id'])->first();
                }
                $dataSO->statusenabled = true;// $request['statusenabled'];
                $dataSO->kodeexternal =$request['satuanstandar'];
                $dataSO->namaexternal = $request['satuanstandar'];
                $dataSO->satuanstandar = $request['satuanstandar'];
                $dataSO->objectdepartemenfk =$this->settingDataFixed('KdDepartemenInstalasiLaboratorium');
                $dataSO->save();
            }else{
                SatuanStandar::where('id',$request['id'])->delete();
            }
             $transStatus = 'true';
        } catch (\Exception $e) {
             $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getNilaiNormal(Request $request) {
//        $kdProfile = 0;// $this->getDataKdProfile($request);
        $jenis  = DB::table('nilainormal_m as djp')
            ->leftjoin('jeniskelamin_m as dp','dp.id','=','djp.objectjeniskelaminfk')
            ->leftjoin('kelompokumur_m as ku','ku.id','=','djp.kelompokumurfk')
            ->select('djp.*','dp.jeniskelamin','ku.kelompokumur','ku.umurmax','ku.umurmin','ku.statusumur')
//            ->where('djp.kdprofile', $kdProfile  )
            ->where('djp.statusenabled',true);
        // ->where('djp.objectdepartemenfk',$this->settingDataFixed('KdDepartemenInstalasiLaboratorium', $kdProfile));
        if(isset($request['nama']) && $request['nama']!='undefined' && $request['nama']!=''){
            $jenis = $jenis->where('djp.nilaitext','ilike','%'.$request['nama'].'%')
                ->orwhere('djp.metode','ilike','%'.$request['nama'].'%');
        }
        if(isset($request['jeniskelaminfk']) && $request['jeniskelaminfk']!='undefined' && $request['jeniskelaminfk']!='' && $request['jeniskelaminfk']!='-'  && $request['jeniskelaminfk']!=0){
            $jenis = $jenis->where('djp.objectjeniskelaminfk','=',$request['jeniskelaminfk']);
        }
        if(isset($request['kelompokfk']) && $request['kelompokfk']!='undefined' && $request['kelompokfk']!=''&& $request['kelompokfk']!='-'){
            $jenis = $jenis->where('djp.kelompokumurfk','=',$request['kelompokfk']);
        }
         $jenis=  $jenis->limit(1000);
        $jenis=  $jenis->get();
        $result =  array(
            'data' => $jenis,
        );
        return $this->respond($result);

    }

    public function saveNilaiNormal(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $idProfile =0;// (int) $kdProfile;
        $id ="";
        DB::beginTransaction();
        try{
            if($request['method']=='save'){
                if ($request['id']=="") {
                    $dataSO = new NilaiNormal();
                    $id =NilaiNormal::max('id') + 1;
                    $dataSO->id =$id ;
                    $dataSO->norec = $dataSO->generateNewId();
                    $dataSO->kdprofile = $idProfile;

                }else {
                    // $dataSO =  NilaiNormal::where('id',$request['id'])->first();
                    $dataSO =  NilaiNormal::where('id',$request['id'])->delete();
                    $dataSO = new NilaiNormal();
                    $dataSO->id =$request['id'] ;
                    $dataSO->norec = $dataSO->generateNewId();
                    $dataSO->kdprofile = $idProfile;
                }
                $dataSO->statusenabled = true;//$request['statusenabled'];
                $dataSO->objectjeniskelaminfk =$request['objectjeniskelaminfk'];
                $dataSO->nilaimax = $request['nilaimax'];
                $dataSO->nilaimin = $request['nilaimin'];
                $dataSO->nilaitext = $request['nilaitext'];
                $dataSO->kelompokumurfk = $request['kelompokumurfk'];
                $dataSO->metode = $request['metode'];
                $dataSO->tipedata = $request['tipedata'];
                $dataSO->save();
            }else{
                NilaiNormal::where('id',$request['id'])->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getMapHasilLab(Request $request)
    {
        $kdProfile = 0; // $this->getDataKdProfile($request);
        $jenis  = DB::table('maphasillab_m as map')
        ->join('produk_m as prd', 'prd.id', '=', 'map.produkfk')
        ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'prd.objectdetailjenisprodukfk')
        ->leftjoin('satuanstandar_m as ss', 'ss.id', '=', 'map.satuanstandarfk')
        ->select('map.*', 'prd.namaexternal as namaproduk', 'ss.satuanstandar', 'djp.detailjenisproduk')
        ->where('map.kdprofile', $kdProfile)
            ->where('map.statusenabled', true)
            ->orderBy('map.nourutjenispemeriksaan');
        if (isset($request['nama']) && $request['nama'] != 'undefined' && $request['nama'] != '') {
            $jenis = $jenis->where('prd.namaexternal', 'ilike', '%' . $request['nama'] . '%');
        }
        if (isset($request['nourutjenispemeriksaan']) && $request['nourutjenispemeriksaan'] != 'undefined' && $request['nourutjenispemeriksaan'] != '') {
            $jenis = $jenis->where('map.nourutjenispemeriksaan', 'ilike', '%' . $request['nourutjenispemeriksaan'] . '%');
        }
        if (isset($request['nourutdetail']) && $request['nourutdetail'] != 'undefined' && $request['nourutdetail'] != '') {
            $jenis = $jenis->where('map.nourutdetail', 'ilike', '%' . $request['nourutdetail'] . '%');
        }

        $jenis =  $jenis->limit(50);
        $jenis =  $jenis->get();

        foreach ($jenis as $key => $value) {
            $id =  $value->id;
            $detail = DB::select(DB::raw("select maps.*,jk.jeniskelamin,ku.kelompokumur,nn.nilaitext,nk.nilaitext as nilaitextkritis
                 from maphasillabdetail_m as maps
                join jeniskelamin_m as jk on jk.id =maps.jeniskelaminfk
                join kelompokumur_m as ku on ku.id =maps.kelompokumurfk
                join nilainormal_m as nn on nn.id =maps.nilainormalfk
                left join nilaikritis_m as nk on nk.id = maps.nilaikritisfk
                where maps.maphasilfk ='$id' and maps.statusenabled=true"));
            $value->details = $detail;
        }
        foreach ($jenis as $key => $value) {
            $id =  $value->id;
            $detailkritis = DB::select(DB::raw("select maps.*,ku.kelompokumur,nk.nilaitext as nilaitextkritis
                 from maphasillabdetail_m as maps
                join kelompokumur_m as ku on ku.id =maps.kelompokumurfk
                join nilaikritis_m as nk on nk.id = maps.nilaikritisfk
                where maps.maphasilfk ='$id' and maps.statusenabled=true"));
            $value->detailkritis = $detailkritis;
        }
        $result =  array(
            'data' => $jenis,
        );
        return $this->respond($result);

    }
    public function getNoUrutJenis(Request $request) {
        $kdProfile =0;// $this->getDataKdProfile($request);
        $detail = DB::select(DB::raw("select max(nourutjenispemeriksaan) as no from maphasillab_m"));
        $aku = MapHasilLab::max('nourutjenispemeriksaan') + 1;

        // $result =  $jenis;
        return  $aku;

    }
    public function getMasterProduk(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $jenis  = DB::table('produk_m as prd')
            ->leftjoin('detailjenisproduk_m as djp','djp.id','=','prd.objectdetailjenisprodukfk')
            ->leftJOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->select('prd.id','prd.namaproduk','prd.objectdetailjenisprodukfk','djp.detailjenisproduk',
                'djp.objectjenisprodukfk','jp.jenisproduk')
//            ->where('prd.kdprofile', $kdProfile  )
            ->where('prd.statusenabled',true)
            ->whereIn('djp.objectjenisprodukfk',[1549,1548,1419,327]);

        if(isset($request['nama']) && $request['nama']!='undefined' && $request['nama']!=''){
            $jenis = $jenis->where('prd.namaproduk','ilike','%'.$request['nama'].'%');
        }
        $jenis=  $jenis->take(100);
        $jenis=  $jenis->get();
        $result =  array(
            'data' => $jenis,
        );
        return $this->respond($result);

    }
    public function updateProduk(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
//        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{

            $produk = DB::table('produk_m')->where('id',$request['id'])->update(
                [
                    'objectdetailjenisprodukfk' => $request['detailjenisprodukfk']
                ]
            );


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Hapus  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function hapusMapHasilLab(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
//        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try{
            MapHasilLabDetail::where('maphasilfk',$request['id'])->delete();
            MapHasilLab::where('id',$request['id'])->delete();


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Hapus  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilLabPA(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
        $idProfile =0;// (int) $kdProfile;
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanLab();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanLab::where('norec',$request['norec'])->first();
            }
//            if ($request['isDokterLuar'] == true) {
//                $dataSO->dokterluar = $request['dokterpengirim2'];
//                $dataSO->dokterpengirimfk = NULL;
//            }
//            else {
//                $dataSO->dokterluar = NULL;
//                $dataSO->dokterpengirimfk = $request['dokterpengirim1'];
//            }
//            $dataSO->nomorpa = $request['nomor'];
            $dataSO->tanggal = $request['tgltransaksi'];
            // $dataSO->tanggal = date('Y-m-d H:i:s');//$request['tglinput'];
            $dataSO->pegawaifk = $request['pegawaifk'];
//            $dataSO->jenis = $request['jenis'];
            $dataSO->pelayananpasienfk = $request['pelayananpasienfk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->tanggal_terima = $request['tglterima'];
            $dataSO->tanggal_jawab = $request['tgljawab'];
            $dataSO->topologi = $request['topografi'];
            $dataSO->morfologi = $request['morfologi'];
            $dataSO->nomorpa = $request['nopa'];
            $dataSO->dokterperujuk = $request['dokterperujuk'];
            $dataSO->dokterperujukluar = $request['dokterperujukluar'];
//            $dataSO->diagnosaklinik = $request['diagnosaklinik'];
//            $dataSO->keteranganklinik = $request['keteranganklinik'];
//            $dataSO->diagnosapb = $request['diagnosapb'];
//            $dataSO->keteranganpb = $request['keteranganpb'];
//            $dataSO->topografi = $request['topografi'];
//            $dataSO->morfologi = $request['morfologi'];
//            $dataSO->makroskopik = $request['makroskopik'];
//            $dataSO->mikroskopik = $request['mikroskopik'];
//            $dataSO->kesimpulan = $request['kesimpulan'];
//            $dataSO->anjuran = $request['anjuran'];
//            $dataSO->jaringanasal = $request['jaringanasal'];
            $dataSO->expertise = $request['expertise'];
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveHasilLabGDT(Request $request) {
        //        $kdProfile = $this->getDataKdProfile($request);
                $idProfile =0;// (int) $kdProfile;
                DB::beginTransaction();
                try{
        
                    if ($request['norec']=="") {
                        $dataSO = new HasilPemeriksaanLab();
                        $dataSO->norec = $dataSO->generateNewId();
                        $dataSO->kdprofile = $idProfile;
                        $dataSO->statusenabled = true;
                    }else {
                        $dataSO =  HasilPemeriksaanLab::where('norec',$request['norec'])->first();
                    }
        //            if ($request['isDokterLuar'] == true) {
        //                $dataSO->dokterluar = $request['dokterpengirim2'];
        //                $dataSO->dokterpengirimfk = NULL;
        //            }
        //            else {
        //                $dataSO->dokterluar = NULL;
        //                $dataSO->dokterpengirimfk = $request['dokterpengirim1'];
        //            }
        //            $dataSO->nomorpa = $request['nomor'];
                    $dataSO->tanggal = $request['tgltransaksi'];
                    // $dataSO->tanggal = date('Y-m-d H:i:s');//$request['tglinput'];
                    $dataSO->pegawaifk = $request['pegawaifk'];
        //            $dataSO->jenis = $request['jenis'];
                    $dataSO->pelayananpasienfk = $request['pelayananpasienfk'];
                    $dataSO->noregistrasifk = $request['norec_pd'];
                    $dataSO->tanggal_terima = $request['tglterima'];
                    $dataSO->tanggal_jawab = $request['tgljawab'];
                    // $dataSO->topologi = $request['topografi'];
                    // $dataSO->morfologi = $request['morfologi'];
                    // $dataSO->nomorpa = $request['nopa'];
                    $dataSO->dokterperujuk = $request['dokterperujuk'];
                    // $dataSO->dokterperujukluar = $request['dokterperujukluar'];
                   $dataSO->diagnosaklinik = $request['diagnosaklinik'];
        //            $dataSO->keteranganklinik = $request['keteranganklinik'];
        //            $dataSO->diagnosapb = $request['diagnosapb'];
        //            $dataSO->keteranganpb = $request['keteranganpb'];
        //            $dataSO->topografi = $request['topografi'];
        //            $dataSO->morfologi = $request['morfologi'];
        //            $dataSO->makroskopik = $request['makroskopik'];
        //            $dataSO->mikroskopik = $request['mikroskopik'];
        //            $dataSO->kesimpulan = $request['kesimpulan'];
        //            $dataSO->anjuran = $request['anjuran'];
        //            $dataSO->jaringanasal = $request['jaringanasal'];
                    $dataSO->expertise = $request['expertise'];
                    $dataSO->save();
        
        // //
                    $transStatus = 'true';
                } 
                catch (\Exception $e) {
                    $transStatus = 'false';
        
                }
        
                if ($transStatus == 'true') {
        
                    $transMessage = "Simpan";
                    DB::commit();
                    $result = array(
                        "status" => 201,
                        "message" => $transMessage,
                        "strukorder" => $dataSO,
                        "as" => 'inhuman',
                    );
        
                } else {
                    $transMessage = "Simpan  gagal!!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message"  => $transMessage,
        //                "nokirim" => $dataSO,//$noResep,
                        "as" => 'inhuman',
                    );
                }
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            
    public function saveHasilBadanSehat(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->tinggibadan = $request['tinggibadan'];
            $dataSO->beratbadan = $request['beratbadan'];
            $dataSO->tensidarah = $request['tensidarah'];
            $dataSO->suhutubuh = $request['suhutubuh'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Hasil Badan Sehat';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->nomor2 = $Nomor . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilKeteranganMedis(Request $request){
        $idProfile =0;// (int) $kdProfile;
        // $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            }
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->pegawaifk = $request['pegawai1'];
            $dataSO->pegawai2fk = $request['pegawai2'];
            $dataSO->pegawai3fk = $request['pegawai3'];
            $dataSO->jabatanfk = $request['jabatan'];
            $dataSO->stakes1 = $request['stakes1'];
            $dataSO->stakes2 = $request['stakes2'];
            $dataSO->tinggibadan = $request['tinggibadan'];
            $dataSO->beratbadan = $request['beratbadan'];
            $dataSO->komposisitubuh = $request['komposisitubuh'];
            $dataSO->lingkarperut = $request['lingkarperut'];
            $dataSO->tensisist = $request['tensisist'];
            $dataSO->tensidias = $request['tensidias'];
            $dataSO->nadi = $request['nadi'];
            $dataSO->gigi = $request['gigi'];
            $dataSO->mata = $request['mata'];
            $dataSO->laboratorium = $request['laboratorium'];
            $dataSO->ekg = $request['ekg'];
            $dataSO->treadmill = $request['treadmill'];
            $dataSO->rontgent = $request['rontgent'];
            $dataSO->kesimpulan = $request['kesimpulan'];
            $dataSO->saran = $request['saran'];
            $dataSO->nomor3 = $request['nomor'];
            $dataSO->nomorurut = $request['nomorurut'];
            $dataSO->keterangan = 'Surat Keterangan Medis';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->nomor2 = $request['nomor'] . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilPemeriksaanBerkala(Request $request){
        $idProfile =0;// (int) $kdProfile;
        // $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->pegawaifk = $request['pegawai1'];
            $dataSO->tinggibadan = $request['tinggibadan'];
            $dataSO->beratbadan = $request['beratbadan'];
            $dataSO->tensidarah = $request['tensi'];
            $dataSO->nadi = $request['nadi'];
            $dataSO->ekg = $request['ekg'];
            $dataSO->treadmill = $request['treadmill'];
            $dataSO->rontgent = $request['rontgent'];
            $dataSO->tht = $request['tht'];
            $dataSO->gigi = $request['gigimulut'];
            $dataSO->jantung = $request['jantung'];
            $dataSO->abdomendanvincera = $request['abdomendanvincera'];
            $dataSO->anusrectum = $request['anusrectum'];
            $dataSO->badanatas = $request['badanatas'];
            $dataSO->badanbawah = $request['badanbawah'];
            $dataSO->sgu = $request['sgu'];
            $dataSO->darah = $request['darah'];
            $dataSO->hb = $request['hb'];
            $dataSO->led = $request['led'];
            $dataSO->trombosit = $request['trombosit'];
            $dataSO->hematokrit = $request['hematokrit'];
            $dataSO->kolesterol = $request['kolesterol'];
            $dataSO->hdl = $request['hdl'];
            $dataSO->ldl = $request['ldl'];
            $dataSO->trigeliterid = $request['trigeliterid'];
            $dataSO->urine = $request['urine'];
            $dataSO->ph = $request['ph'];
            $dataSO->protein = $request['protein'];
            $dataSO->glukosa = $request['glukosa'];
            $dataSO->uroblinogen = $request['uroblinogen'];
            $dataSO->leko = $request['leko'];
            $dataSO->ba = $request['ba'];
            $dataSO->eos = $request['eos'];
            $dataSO->bt = $request['bt'];
            $dataSO->seg = $request['seg'];
            $dataSO->lim = $request['lim'];
            $dataSO->mon = $request['mon'];
            $dataSO->erithosit2 = $request['erithosit2'];
            $dataSO->bilirobintotal = $request['bilirobintotal'];
            $dataSO->bilirobindirek = $request['bilirobindirek'];
            $dataSO->bilirobinindirek = $request['bilirobinindirek'];
            $dataSO->sgot = $request['sgot'];
            $dataSO->sgpt = $request['sgpt'];
            $dataSO->selepitel = $request['selepitel'];
            $dataSO->darahhb = $request['darahhb'];
            $dataSO->lekosit = $request['lekosit'];
            $dataSO->sedimenlekosit = $request['sedimenlekosit'];
            $dataSO->ureum = $request['ureum'];
            $dataSO->creatin = $request['creatin'];
            $dataSO->asamurat = $request['asamurat'];
            $dataSO->guladarahpuasa = $request['guladarahpuasa'];
            $dataSO->gd2pp = $request['gd2pp'];
            $dataSO->hbsag = $request['hbsag'];
            $dataSO->antihiv = $request['antihiv'];
            $dataSO->erithosit = $request['erithosit'];
            $dataSO->keton = $request['keton'];
            $dataSO->kristal = $request['kristal'];
            $dataSO->silinder = $request['silinder'];
            $dataSO->lainlain = $request['lainlain'];
            $dataSO->saran = $request['anjuran'];
            $dataSO->keluhan = $request['keluhan'];
            $dataSO->keterangan = 'Surat Hasil Pemeriksaan Berkala';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->nomor2 = $request['nomor'] . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilPemeriksaanCovid(Request $request){
        $idProfile =0;// (int) $kdProfile;
        // $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->tinggibadan = $request['tinggibadan'];
            $dataSO->beratbadan = $request['beratbadan'];
            $dataSO->tensidarah = $request['tensidarah'];
            $dataSO->suhutubuh = $request['suhutubuh'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->jenispemeriksaan = $request['jenispemeriksaan'];
            $dataSO->keterangan = 'Surat Hasil Pemeriksaan Covid';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->nomor2 = $request['nomor'] . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan Sukses !";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilPemeriksaanCovidLN(Request $request){
        $idProfile =0;// (int) $kdProfile;
        // $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->tglregistrasi = $request['tglregis'];
            $dataSO->tglambil = $request['tglambil'];
            $dataSO->nopasspor = $request['passpor'];
            $dataSO->keterangan = 'Surat Hasil Pemeriksaan Covid Luar Negeri';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan Sukses !";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editHasilBadanSehat(Request $request){
        $idProfile =0;// (int) $kdProfile;
        // $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            }
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->tinggibadan = $request['tinggibadan'];
            $dataSO->beratbadan = $request['beratbadan'];
            $dataSO->tensidarah = $request['tensidarah'];
            $dataSO->suhutubuh = $request['suhutubuh'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Hasil Badan Sehat';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->nomor2 = $request['nomorsurat'];
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilKesehatanJiwa(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 2);
        // $date = $this->getDateRomawi(new HasilPemeriksaanMcu,(date('Y-m')));
        DB::beginTransaction();
        // try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Dokter Kesehatan Jiwa';
            $dataSO->nomor2 = 'Sket-R / '. $Nomor . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->save();

// //
            $transStatus = 'true';
        // } 
        // catch (\Exception $e) {
        //     $transStatus = 'false';

        // }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilBebasNarkoba(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->pegawaifk = '27689';
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->keterangan = 'Surat Keterangan Bebas Narkoba';
            $dataSO->nomor2 = 'B / '. $Nomor . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editHasilBebasNarkoba(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            }
            $dataSO->pegawaifk = '27689';
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->keterangan = 'Surat Keterangan Bebas Narkoba';
            $dataSO->nomor2 = $request['nomorsurat'];
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilBebasNarkobav2(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        $date = $this->getDateRomawi(date('Y-m'));
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->pegawaifk = '27689';
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->keterangan = 'Surat Keterangan Bebas Narkoba v2';
            $dataSO->nomor2 = 'B / '. $Nomor . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editHasilKesehatanJiwa(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Dokter Kesehatan Jiwa';
            $dataSO->nomor2 = $request['nomorsurat'];
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilPenyakitMenular(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Bebas Penyakit Menular';
            $dataSO->nomor2 = 'B - '. $Nomor . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editHasilPenyakitMenular(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Bebas Penyakit Menular';
            $dataSO->nomor2 = $request['nomorsurat'];
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilBebasHIV(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Bebas HIV';
            $dataSO->nomor2 = 'B - '. $Nomor . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editHasilBebasHIV(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Bebas HIV';
            $dataSO->nomor2 = $request['nomorsurat'];
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveHasilTidakHamil(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            // if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            // }else {
            //     $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            // }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Tidak Hamil';
            $dataSO->nomor2 = 'B - '. $Nomor . $this->getDateRomawi(date('Y-m')) . ' / ' . 'Inst.MCU';
            $dataSO->tglcetak = date('Y-m-d H:i:s');
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editHasilTidakHamil(Request $request){
        $idProfile =0;// (int) $kdProfile;
        $Nomor = $this->generateCodeBySeqTable(new HasilPemeriksaanMcu, 'nomor', 3, '0');
        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilPemeriksaanMcu();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilPemeriksaanMcu::where('norec',$request['norec'])->first();
            }
            $dataSO->pegawaifk = $request['pegawaifk'];
            $dataSO->noregistrasifk = $request['norec_pd'];
            $dataSO->persyaratan = $request['persyaratan'];
            $dataSO->keterangan = 'Surat Keterangan Tidak Hamil';
            $dataSO->nomor2 = $request['nomorsurat'];
            $dataSO->save();

// //
            $transStatus = 'true';
        } 
        catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getHasilLabPA(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
//        $idProfile = (int) $kdProfile;
        $data = DB::table('hasilpemeriksaanlab_t as ar')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ar.pegawaifk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'ar.dokterperujuk')
//            ->leftjoin('pegawai_m as dokterpengirim', 'dokterpengirim.id', '=', 'ar.dokterpengirimfk')
            ->select('ar.*','pg.namalengkap','pg2.id as iddokterperujuk', 'pg2.namalengkap as dokterperujuk')
//            ->where('ar.kdprofile', $idProfile)
            ->where('ar.statusenabled',true)
            ->where('ar.pelayananpasienfk',$request['norec_pp'])
            ->get();

        return $this->respond($data);
    }

    public function getHasilLabGDT(Request $request) {
        //        $kdProfile = $this->getDataKdProfile($request);
        //        $idProfile = (int) $kdProfile;
                $data = DB::table('hasilpemeriksaanlab_t as ar')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ar.pegawaifk')
                    ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'ar.dokterperujuk')
        //            ->leftjoin('pegawai_m as dokterpengirim', 'dokterpengirim.id', '=', 'ar.dokterpengirimfk')
                    ->select('ar.*','pg.namalengkap','pg2.id as iddokterperujuk', 'pg2.namalengkap as dokterperujuk')
        //            ->where('ar.kdprofile', $idProfile)
                    ->where('ar.statusenabled',true)
                    ->where('ar.pelayananpasienfk',$request['norec_pp'])
                    ->get();
        
                return $this->respond($data);
            }

    public function getNomorSurat(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hpm')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'hpm.noregistrasifk')
            ->select('hpm.nomor3', 'pd.tglregistrasi')
            ->where('hpm.nomor3',$request['nomor'])
            ->whereYear('pd.tglregistrasi','=', $request['tahun'])
            ->get();

        return $this->respond($data);
    }
    public function getHasilPenyakitMenular(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Bebas Penyakit Menular')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilBebasHIV(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Bebas HIV')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilTidakHamil(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Tidak Hamil')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilBadanSehat(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Hasil Badan Sehat')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilKeteranganMedis(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled', true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Medis')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getNomor(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hpm')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'hpm.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('ps.namapasien', 'pd.noregistrasi' ,'hpm.*')
            ->where('hpm.statusenabled', true)
            ->whereNotNull('hpm.nomorurut');
            if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
                $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            $data = $data->orderBy('hpm.nomorurut');
            $data = $data->get();

            return $this->respond($data);
    }
    public function getHasilPemeriksaanBerkala(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Hasil Pemeriksaan Berkala')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilPemeriksaanCovid(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Hasil Pemeriksaan Covid')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilPemeriksaanCovidLN(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            // ->where('hbs.nomor2',$request['nomorsurat'])
            ->Where('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Hasil Pemeriksaan Covid Luar Negeri')
            ->orderBy('hbs.tglregistrasi','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilKesehatanJiwa(Request $request) {
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Dokter Kesehatan Jiwa')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilBebasNarkoba(Request $request) {
        // ini_set('min_execution_time', 8);
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Bebas Narkoba')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getHasilBebasNarkobav2(Request $request) {
        // ini_set('min_execution_time', 8);
        $data = DB::table('hasilpemeriksaanmcu_t as hbs')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'hbs.pegawaifk')
            ->select('hbs.*','pg.namalengkap','pg.id')
            ->where('hbs.statusenabled',true)
            ->where('hbs.nomor2',$request['nomorsurat'])
            ->orWhere('hbs.noregistrasifk',$request['norec_pd'])
            ->where('hbs.keterangan','Surat Keterangan Bebas Narkoba v2')
            ->orderBy('hbs.nomor2','DESC')
            ->get();
        
            return $this->respond($data);
    }
    public function getemr(Request $request){
        $data = DB::table('emrpasien_t as ep')
            ->JOIN('pasiendaftar_t as pd', 'pd.noregistrasi', '=', 'ep.noregistrasifk')
            ->LEFTJOIN('emrpasiend_t as epd', 'epd.emrpasienfk', '=', 'ep.noemr')
            ->WHERE('ep.noregistrasifk',$request['noregistrasi'])
            ->GET();

            return $this->respond($data);
    }
    public function getRiwayatPemeriksaanMcu(Request $request){
        $data = DB::table('hasilpemeriksaanmcu_t as hpm')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'hpm.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('pd.norec as norec_pd','hpm.norec as norec_hpm','pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'hpm.tglcetak', 'hpm.nomor2 as nomorsurat', 'hpm.keterangan');

            if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
                $data = $data->where('pd.tglregistrasi','>=', $request['tglAwal']);
            }
            if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
                $data = $data->where('pd.tglregistrasi','<=', $request['tglAkhir']);
            }
            if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
                $data = $data->where('pd.noregistrasi', '=', $request['noreg']);
            }
            if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
                $data = $data->where('ps.nocm', 'ilike', '%' . $request['norm'] . '%');
            }
            if (isset($request['np']) && $request['np'] != "" && $request['np'] != "undefined") {
                $data = $data->where('ps.namapasien', 'ilike', '%' . $request['np'] . '%');
            }
            // if(isset($request['ruid']) && $request['ruid']!="" && $request['ruid']!="undefined"){
            //     $data = $data->where('ru.id', $request['ruid']);
            // }

            $data = $data->orderBy('pd.tglregistrasi');
            $data = $data->get();

            return $this->respond($data);
    }
    public function getNilaiKritis(Request $request) {
        //        $kdProfile = 0;// $this->getDataKdProfile($request);
                $jenis  = DB::table('nilaikritis_m as djp')
                    ->leftjoin('kelompokumur_m as ku','ku.id','=','djp.kelompokumurfk')
                    ->select('djp.*','ku.kelompokumur','ku.umurmax','ku.umurmin','ku.statusumur')
        //            ->where('djp.kdprofile', $kdProfile  )
                    ->where('djp.statusenabled',true);
                // ->where('djp.objectdepartemenfk',$this->settingDataFixed('KdDepartemenInstalasiLaboratorium', $kdProfile));
                if(isset($request['nama']) && $request['nama']!='undefined' && $request['nama']!=''){
                    $jenis = $jenis->where('djp.nilaitext','ilike','%'.$request['nama'].'%')
                        ->orwhere('djp.metode','ilike','%'.$request['nama'].'%');
                }
                if(isset($request['kelompokfk']) && $request['kelompokfk']!='undefined' && $request['kelompokfk']!=''&& $request['kelompokfk']!='-'){
                    $jenis = $jenis->where('djp.kelompokumurfk','=',$request['kelompokfk']);
                }
                 $jenis=  $jenis->limit(1000);
                $jenis=  $jenis->get();
                $result =  array(
                    'data' => $jenis,
                );
                return $this->respond($result);
        
            }
            public function saveNilaiKritis(Request $request) {
                //        $kdProfile = $this->getDataKdProfile($request);
                        $idProfile =0;// (int) $kdProfile;
                        $id ="";
                        DB::beginTransaction();
                        try{
                            if($request['method']=='save'){
                                if ($request['id']=="") {
                                    $dataSO = new NilaiKritis();
                                    $id =NilaiKritis::max('id') + 1;
                                    $dataSO->id =$id ;
                                    $dataSO->norec = $dataSO->generateNewId();
                                    $dataSO->kdprofile = $idProfile;
                
                                }else {
                                    // $dataSO =  NilaiKritis::where('id',$request['id'])->first();
                                    $dataSO =  NilaiKritis::where('id',$request['id'])->delete();
                                    $dataSO = new NilaiKritis();
                                    $dataSO->id =$request['id'] ;
                                    $dataSO->norec = $dataSO->generateNewId();
                                    $dataSO->kdprofile = $idProfile;
                                }
                                $dataSO->statusenabled = true;//$request['statusenabled'];
                                $dataSO->nilaimax = $request['nilaimax'];
                                $dataSO->nilaimin = $request['nilaimin'];
                                $dataSO->nilaitext = $request['nilaitext'];
                                $dataSO->kelompokumurfk = $request['kelompokumurfk'];
                                $dataSO->metode = $request['metode'];
                                $dataSO->tipedata = $request['tipedata'];
                                $dataSO->save();
                            }else{
                                NilaiKritis::where('id',$request['id'])->delete();
                            }
                            $transStatus = 'true';
                        } catch (\Exception $e) {
                            $transStatus = 'false';
                
                        }
                
                        if ($transStatus == 'true') {
                
                            $transMessage = "Simpan";
                            DB::commit();
                            $result = array(
                                "status" => 201,
                                "message" => $transMessage,
                                "as" => 'er@epic',
                            );
                
                        } else {
                            $transMessage = "Simpan  gagal!!";
                            DB::rollBack();
                            $result = array(
                                "status" => 400,
                                "message"  => $transMessage,
                                "e"=>$e,
                                "as" =>'er@epic',
                            );
                        }
                        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                    }
    public function deleteNilaiKritis(Request $request) {
        DB::beginTransaction();
        try {
            $kritis = NilaiKritis::where('id', $request['id'])
                ->delete();
                $transStatus = 'true';
        } catch(\Exception $e) {
            $transMessage = 'Gagal';
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Berhasil';
            DB::commit();
            $result = array (
                "status" => 201,
                "message" => $transMessage,
                "as" => "gas delete"
            );
        } else {
            $transMessage = 'Gagal';
            DB::rollBack();
            $result = array (
                "status" => 400,
                "message" => $transMessage,
                "as" => "gagal delete gan"
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function updateTanggalPengambilanHasilLab (Request $request){
        try{
            HasilLaboratorium::where('norecpelayanan',$request['norecpelayanan'])
            ->update([
                 'tglpengambilan' => $request->tglpengambilan
             ]);
             $transMessage = 'Sukses';
             $transStatus = 'true';
        }catch(\Exception $e) {
            $transMessage = 'Gagal';
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            // dd($result);
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e"=>$e,
                "as" =>'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function getTanggalPengambilan(Request $request)
    {   
        $norecpelayanan = $request['norecpelayanan'];
        // hasillaboratorium_t
        $x = \DB::table('hasillaboratorium_t as h')
        ->select('h.tglpengambilan', 'h.norecpelayanan')
        ->where('h.norecpelayanan', $norecpelayanan)
        ->take(1)
        ->get();

        // =DB::table('hasillaboratorium_t')
        // ->where('norecpelayanan', $norecpelayanan)
        // ->pluck('tglpengambilan', 'norecpelayanan');

        
        $result = array(
            'b' => $x,
            'message' => 'Sukses',
        );
        return $this->respond($result);
    }
            
}