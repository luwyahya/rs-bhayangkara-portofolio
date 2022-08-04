<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 13/08/2019
 * Time: 20.53
 */
namespace App\Http\Controllers\Registrasi;


use App\Http\Controllers\ApiController;
use App\Transaksi\DetailDiagnosaPasien;

use App\Transaksi\DetailDiagnosaTindakanPasien;
use App\Transaksi\DiagnosaPasien;

use App\Transaksi\DiagnosaTindakanPasien;
use App\Transaksi\KendaliDokumenRekamMedis;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
//use Carbon\Carbon;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;

use App\Master\Pasien;
use App\Master\Alamat;
use App\Master\Tracer;
use App\Transaksi\PasienDaftar;
use App\Transaksi\AntrianPasienDiperiksa;

class KendaliDokumenRMController extends  ApiController
{

    use Valet;
    public function __construct() {
        parent::__construct($skip_authentication=false);
    }
    public function getPasienByNoCm( Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->select('ps.id as nocmfk','ps.nocm','ps.namapasien','ps.nohp','ps.notelepon','ps.namakeluarga','ps.namaibu',
                'ps.namaayah','ps.tempatlahir','ps.tgllahir','alm.alamatlengkap','ps.foto')
            ->leftJoin('alamat_m as alm','alm.nocmfk','=','ps.id');
//            ->leftJoin('agama_m as ag','ag.id','=','ps.objectagamafk')
//            ->leftJoin('pendidikan_m pnd','pnd.id','=','ps.objectpendidikanfk')
//            ->leftJoin('negara_m as ng','ng.id','=','ps.objectnegarafk')
//            ->leftJoin('kebangsaan_m as kb','kb.id','=','ps.objectkebangsaanfk');

        if(isset($request['noCm']) && $request['noCm']!="" && $request['noCm']!="undefined"){
            $data = $data->where('ps.nocm', '=', $request['noCm']);
//            $data = $data->where('ps.nocm', 'ilike', '%'. $request['noCm']);
        };
        $data=$data->where('ps.statusenabled',true);
        $data=$data->first();
        if($data->foto != null){
            $data->foto = "data:image/jpeg;base64," . base64_encode($data->foto);
        }
        $result = array(
            'datas' => $data,
            'message' => 'cepot',
        );
        return $this->respond($data);
    }

    public function getPasienDaftar( Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('pd.nocmfk','pd.noregistrasi','pd.tglregistrasi','pd.objectruanganlastfk','ru.namaruangan')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk');

        if(isset($request['nocmfk']) && $request['nocmfk']!="" && $request['nocmfk']!="undefined"){
            $data = $data->where('pd.nocmfk', '=',  $request['nocmfk']);
        };
        $data=$data->orderBy('pd.tglregistrasi', 'desc');
        $data=$data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }


    public function getDaftarKendaliDokumen( Request $request) {
        $data = \DB::table('kendalidokumenrekammedis_t as kdr')
            ->join('pasien_m as ps','ps.id','=','kdr.nocmfk')
            ->leftJoin('statuskendalidokumen_m as skd','skd.id','=','kdr.objectstatuskendalidokumenfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','kdr.objectruanganasalfk')
            ->leftJoin('ruangan_m as ru1','ru1.id','=','kdr.objectruangantujuanfk')
            ->select('kdr.norec as norec_kdr','kdr.nocmfk','kdr.tglupdate','ps.nocm', 'kdr.dariunit','kdr.keunit','skd.name','kdr.tglkembali',
                     'kdr.objectstatuskendalidokumenfk','kdr.objectruanganasalfk','ru.namaruangan as ruanganasal','kdr.objectruangantujuanfk','kdr.tglkeluar',
                     'ru1.namaruangan as ruangantujuan','kdr.catatan',
                DB::raw('case when kdr.tglkembali is NULL then \'Belum\' else \'Sudah\' end as kembali')
            )
            ->orderBy('kdr.tglupdate','desc');

        if(isset($request['nocmfk']) && $request['nocmfk']!="" && $request['nocmfk']!="undefined"){
            $data = $data->where('kdr.nocmfk', '=',  $request['nocmfk']);
        };
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('kdr.tglupdate', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('kdr.tglupdate', '<=', $tgl);
        }
        if(isset($request['noCm']) && $request['noCm']!="" && $request['noCm']!="undefined"){
            $data = $data->where('ps.nocm', 'ilike', '%'. $request['noCm']);
        };
        if(isset($request['unit']) && $request['unit']!="" && $request['unit']!="undefined"){
            $data = $data->where('kdr.dariunit', 'ilike', '%'. $request['unit'] .'%')
                 ->Orwhere('kdr.keunit', 'ilike', '%'. $request['unit'] .'%');;
        };
        if(isset($request['statusId']) && $request['statusId']!="" && $request['statusId']!="undefined"){
            $data = $data->where('kdr.objectstatuskendalidokumenfk', '=',  $request['statusId']);
        };
//        $data=$data->orderBy('kdr.tglupdate');
        $data=$data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
   }
    public function saveKendaliDokRMOld(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();

        try{
        if ($request['norec_kdr']=='') {
            $newKDR = new KendaliDokumenRekamMedis();
            $norec = $newKDR->generateNewId();
            $newKDR->norec = $norec;
            $newKDR->kdprofile = 0;
            $newKDR->statusenabled =true;
        }else{
            $newKDR =  KendaliDokumenRekamMedis::where('norec',$request['norec_kdr'])->first();
        }
//            $newKDR->dariunit = $request['dariunit'];
//            $newKDR->keunit = $request['keunit'];
            if($request['objectstatuskendalidokumenfk'] == 3){
                $newKDR->objectruanganasalfk = $request['objectruanganasalfk'];
                $newKDR->objectruangantujuanfk = $request['objectruangantujuanfk'];
                $newKDR->nocmfk = $request['nocmfk'];
                $newKDR->objectstatuskendalidokumenfk = $request['objectstatuskendalidokumenfk'];
                $newKDR->tglupdate = $request['tglupdate'];
                $newKDR->tglkembali = $request['tglkembali'];
                $newKDR->catatan = $request['catatan'];
                $newKDR->save();
            }
            elseif($request['objectstatuskendalidokumenfk'] != 3){
                $newKDR->objectruanganasalfk = $request['objectruanganasalfk'];
                $newKDR->objectruangantujuanfk = $request['objectruangantujuanfk'];
                $newKDR->nocmfk = $request['nocmfk'];
                $newKDR->objectstatuskendalidokumenfk = $request['objectstatuskendalidokumenfk'];
                $newKDR->tglupdate = $request['tglupdate'];
                $newKDR->tglkembali = $request['tglkembali'];
                $newKDR->tglkeluar = $request['tglkeluar'];
                $newKDR->catatan = $request['catatan'];
                $newKDR->save();
            }


        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
          $transMessage = "simpan";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $newKDR,
                'as' => 'ramdanegie@Cepot',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'data' =>$newKDR,
                'as' => 'ramdanegie@Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateKendaliDokRM(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
            
        try{
            // return($request['nocmfk']);
            // die();
             KendaliDokumenRekamMedis::where('noregistrasifk',$request['noregistrasifk'])
                // ->where('tglkembali',null)
                ->update(['tglupdate'=>date('Y-m-d H:i:s'),
                          'objectstatuskendalidokumenfk' => '9']);

            // PasienDaftar::where('statusschedule',$request['statusschedule'])
            //     ->update([
            //               'istaskantrol' => '3']);
               

        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
          $transMessage = "simpan";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ramdanegie@Cepot',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ramdanegie@Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKendaliDokRM(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        
        try{
        if ($request['norec_kdr']=='') {
            $newKDR = new KendaliDokumenRekamMedis();
            $norec = $newKDR->generateNewId();
            $newKDR->norec = $norec;
            $newKDR->kdprofile = 0;
            $newKDR->statusenabled =true;
        }else if ($request['norec_kdr']==1){
            $newKDR =  KendaliDokumenRekamMedis::where('nocmfk',$request['nocmfk'])
                    ->where('tglkembali',null)
                    ->first();
            // foreach ($ruangasal as $Hit){
             KendaliDokumenRekamMedis::where('nocmfk',$request['nocmfk'])
                ->where('tglkembali',null)
                ->update(['tglkembali'=>$request['tglkembali'],'objectstatuskendalidokumenfk'=>$request['objectstatuskendalidokumenfk']]);
            // }
           
                    // ->first();
        }else{
            $newKDR =  KendaliDokumenRekamMedis::where('norec',$request['norec_kdr'])->first();
        }
//            $newKDR->dariunit = $request['dariunit'];
//            $newKDR->keunit = $request['keunit'];

            // if($request['objectstatuskendalidokumenfk'] == 3){
            //     $newKDR->objectruanganasalfk = $request['objectruanganasalfk'];
            //     $newKDR->objectruangantujuanfk = $request['objectruangantujuanfk'];
            //     $newKDR->nocmfk = $request['nocmfk'];
            //     $newKDR->objectstatuskendalidokumenfk = $request['objectstatuskendalidokumenfk'];
            //     $newKDR->tglupdate = $request['tglupdate'];
            //     $newKDR->tglkembali = $request['tglkembali'];
            //     $newKDR->catatan = $request['catatan'];
            //     $newKDR->save();
            // }
            // else
            if($request['objectstatuskendalidokumenfk'] != 3){
                $newKDR->objectruanganasalfk = $request['objectruanganasalfk'];
                $newKDR->objectruangantujuanfk = $request['objectruangantujuanfk'];
                $newKDR->nocmfk = $request['nocmfk'];
                $newKDR->objectstatuskendalidokumenfk = $request['objectstatuskendalidokumenfk'];
                $newKDR->tglupdate = $request['tglupdate'];
                $newKDR->tglkembali = $request['tglkembali'];
                $newKDR->tglkeluar = $request['tglkeluar'];
                $newKDR->catatan = $request['catatan'];
                $newKDR->noregistrasifk = $request['noregistrasifk'];
                $newKDR->save();
            }


        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
          $transMessage = "simpan";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $newKDR,
                'as' => 'ramdanegie@Cepot',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'data' =>$newKDR,
                'as' => 'ramdanegie@Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
   public function saveDokumenRekamMedis(Request $request) {

        DB::beginTransaction();
        try{
            
            $status = \DB::table('statuskendalidokumen_m')
                ->where('name','ilike','%'.$request['statuskendali'].'%')->first();
            if($request['statuskendali'] == 'pinjam'){
                foreach ( $request['pasien']  as $item){
                    if ($request['norec_kdr']=='') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled =true;
                    }else{
                        $newKDR =  KendaliDokumenRekamMedis::where('norec',$request['norec_kdr'])->first();
                    }

                    $newKDR->objectruanganasalfk = $item['objectruanganlastfk'];
                    $newKDR->objectruangantujuanfk = $item['objectruanganlastfk'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    if(isset($request['tglkeluar'])){
                        $newKDR->tglkeluar = $request['tglkeluar'];
                    }
                    if(isset($request['tglkembali'])){
                        $newKDR->tglkembali = $request['tglkembali'];
                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->pegawaifk = $request['pegawaifk'];
                    $newKDR->save();
                }
            }
            if($request['statuskendali'] == 'kirim'){
                foreach ( $request['pasien']  as $item){
                    if ($request['norec_kdr']=='') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled =true;
                    }else{
                        $newKDR =  KendaliDokumenRekamMedis::where('norec',$request['norec_kdr'])->first();
                    }

                    // $newKDR->objectruanganasalfk = $item['objectruanganlastfk'];
                    $newKDR->objectruanganasalfk = $request['ruanganasalfk'];
                    $newKDR->objectruangantujuanfk = $request['ruangantujuanfk'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    if(isset($request['tglkeluar'])){
                        $newKDR->tglkeluar = $request['tglkeluar'];
                    }
                    if(isset($request['tglkembali'])){
                        $newKDR->tglkembali = $request['tglkembali'];
                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->pegawaifk = $request['pegawaifk'];
                    $newKDR->save();
                    PasienDaftar::where('noregistrasi', $item['noregistrasi'])->update(
                        ['statuskirimdokumen' => 1]
                    );
                }
            }

            if($request['statuskendali'] == 'terima'){
                foreach ( $request['pasien']  as $item){
                    if ($request['norec_kdr']=='') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled =true;
                    }else{
                        $newKDR =  KendaliDokumenRekamMedis::where('norec',$request['norec_kdr'])->first();
                    }

                    $newKDR->objectruanganasalfk = $item['objectruanganlastfk'];
                    $newKDR->objectruangantujuanfk = $request['ruanganterimafk'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    if(isset($request['tglkeluar'])){
                        $newKDR->tglkeluar = $request['tglkeluar'];
                    }
                    if(isset($request['tglkembali'])){
                        $newKDR->tglkembali = $request['tglkembali'];
                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->pegawaifk = $request['pegawaifk'];
                    $newKDR->save();
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'data' =>$newKDR,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataCombo(Request $request) {
        $details=$request->all();
        $dataRuanganTujuan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            //->wherein('ru.objectdepartemenfk',[16,17,18,24,27,28,35,30,43,34,26,45])
            // ->wherein('ru.id',[581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,569,566,573,563,570,576,571,580,597,665])
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataRuanganKendali = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
//            ->wherein('ru.objectdepartemenfk',[16,17,18,24,27,28,35,30])
            ->where('ru.id',469)
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataStatusKendali = \DB::table('statuskendalidokumen_m as skd')
            ->select('skd.id','skd.name')
            ->where('skd.statusenabled',true)
            ->orderBy('skd.name')
            ->get();

        $data=array(
            'ruangan' => $dataRuanganTujuan,
            'dataRuanganKendali' => $dataRuanganKendali,
            'dataStatusKendali' => $dataStatusKendali,
            'message' => 'Cepot'
        );
        return $this->respond($data);
    }

    public function getDataTambahKendali(Request $request) {
//        $details=$request->all();
        $data= \DB::table('pasiendaftar_t as pd')
            ->leftJoin('kendalidokumenrekammedis_t as kdrm','kdrm.nocmfk','=','pd.nocmfk')
            ->join('pasien_m as pm','pm.id','=','pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->leftJoin('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftJoin('ruangan_m as ru1','ru1.id','=','kdrm.objectruanganasalfk')
            ->leftJoin('ruangan_m as ru2','ru2.id','=','kdrm.objectruangantujuanfk')
            ->leftJoin('statuskendalidokumen_m as skd','skd.id','=','kdrm.objectstatuskendalidokumenfk')
            ->select('apd.norec as noregistrasifk','pd.noregistrasi','pm.nocm','pm.namapasien','pd.objectruanganlastfk as kdruangan','ru.namaruangan as ruangdaftar',
			         'kdrm.objectruanganasalfk','ru1.namaruangan as ruangasaldokumen','kdrm.objectruangantujuanfk',
                     'ru2.namaruangan as ruangtujuan','kdrm.tglkeluar','kdrm.tglkembali','kdrm.tglupdate','kdrm.catatan'
//                DB::raw('COUNT(pd.objectruanganasalfk)')
                )
            ->groupBy('apd.norec','pd.noregistrasi','pm.nocm','pm.namapasien','pd.objectruanganlastfk','ru.id','ru.namaruangan','kdrm.objectruanganasalfk','ru1.namaruangan',
                      'kdrm.objectruangantujuanfk','ru2.namaruangan','kdrm.tglkeluar','kdrm.tglkembali','kdrm.tglupdate','kdrm.catatan');

        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('pm.nocm','=',$request['nocm']);
        };
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        $data=$data->orderBy('pd.noregistrasi', 'desc');
        $data=$data->take(1);
        $data=$data->get();

        $dataRuanganKendali = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.id',469)
            // ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();

        $data=array(
            'datakendali' => $data,
            'rak' => $dataRuanganKendali,
            'message' => 'Cepot'
        );
        return $this->respond($data);
    }
    public function getDataKendali(Request $request) {
        $details=$request->all();
        $dataKendali = \DB::table('kendalidokumenrekammedis_t as kdrm')
            ->leftJoin('ruangan_m as ru','ru.id','=','kdrm.objectruanganasalfk')
            ->leftJoin('ruangan_m as ru1','ru1.id','=','kdrm.objectruangantujuanfk')
            ->leftJoin('statuskendalidokumen_m as skd','skd.id','=','kdrm.objectstatuskendalidokumenfk')
            ->select('kdrm.norec','kdrm.nocmfk','kdrm.objectruanganasalfk',
                     'ru.namaruangan as ruanganasal','kdrm.objectruangantujuanfk',
			         'ru1.namaruangan as ruangantujuan','kdrm.objectstatuskendalidokumenfk','skd.name',
                     'kdrm.tglupdate','kdrm.tglkeluar','kdrm.tglkembali','kdrm.catatan')
            ->where('kdrm.statusenabled',true)
            ->orderBy('kdrm.tglupdate');

        if(isset($request['norec']) && $request['norec']!="" && $request['norec']!="undefined"){
            $dataKendali = $dataKendali->where('kdrm.norec', '=',  $request['norec']);
        };
        $dataKendali=$dataKendali->get();

        $data=array(
            'datakendali' => $dataKendali,
            'message' => 'Cepot'
        );
        return $this->respond($data);
    }
    public function getLaporanTracer(Request $request) {
        $data= \DB::table('pasiendaftar_t as pd')
            ->join ('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->join ('kendalidokumenrekammedis_t as kdrm','kdrm.nocmfk','=','ps.id')
           ->join ('antrianpasiendiperiksa_t as apd',function($join)
           {
               $join->on('apd.noregistrasifk','=','pd.norec');
               $join->on('kdrm.noregistrasifk','=','apd.norec');
           })
            ->join ('ruangan_m as ru1','ru1.id','=','kdrm.objectruanganasalfk')
            ->join ('ruangan_m as ru2','ru2.id','=','kdrm.objectruangantujuanfk')
            ->leftjoin ('statuskendalidokumen_m as skd','skd.id','=','kdrm.objectstatuskendalidokumenfk')
            ->leftJoin('rekanan_m as rm','pd.objectrekananfk','=','rm.id')
            ->select('pd.noregistrasi','pd.tglregistrasi',
                        'ps.nocm','ps.namapasien', 'ru1.namaruangan as unitasal', 'ru2.namaruangan as unittujuan',
                        'kdrm.tglkeluar','kdrm.objectstatuskendalidokumenfk','skd.name as status',
                        'kdrm.dariunit','kdrm.keunit','skd.namaexternal',

                DB::raw('case when rm.namarekanan is NULL then \'Umum\' else rm.namarekanan end as rekanan')
            );
            // ->where('kdrm.objectstatuskendalidokumenfk','1'); #dipinjam
//            ->groupBy('pd.noregistrasi','pd.tglregistrasi',
//                'ps.nocm','ps.namapasien', 'ru1.namaruangan', 'ru2.namaruangan',
//                'kdrm.tglkeluar','kdrm.objectstatuskendalidokumenfk','skd.name',
//                'kdrm.dariunit','kdrm.keunit');

        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike', '%'.$request['nocm'].'%');
        };
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namaPasien'].'%');
        };
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%'.$request['noReg'].'%');
        }
        if (isset($request['unit']) && $request['unit'] != "" && $request['unit'] != "undefined") {
            $data = $data->where('ru2.id', '=', $request['unit']);
        }
        if (isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined") {
            $data = $data->where('kdrm.objectstatuskendalidokumenfk', '=', $request['status']);
        }
        $data=$data->orderBy('kdrm.tglkeluar', 'desc');
        $data=$data->get();
        // return($data);
        // die();
        $dataFix = [];
        foreach ($data as $item){
            $samateu = false;
            foreach ($dataFix as $itemsss){
                if ($item->nocm == $itemsss['nocm']){
                    $samateu = true;
                    if (date($item->tglkeluar) > date($itemsss['tglkeluar']))
                        $itemsss['tglkeluar'] = $item->tglkeluar;
                        $itemsss['unittujuan'] = $item->unittujuan;
                        break;
                    }
                }
            // if ($samateu == false){
                $dataFix[] = array(
                    'selisih' => $this->getSelisih($item->tglregistrasi,$item->tglkeluar) ,
                    'noregistrasi' => $item->noregistrasi,
                    'tglregistrasi' => $item->tglregistrasi,
                    'tglkeluar' => $item->tglkeluar,
                    'nocm' => $item->nocm,
                    'namapasien' => $item->namapasien,
                    'unitasal' => $item->unitasal,
                    'unittujuan' => $item->unittujuan,
                    'status' => $item->status,
                    'dariunit' => $item->dariunit,
                    'keunit' => $item->keunit,
                    'rekanan' => $item->rekanan,
                    'namaexternal' => $item->namaexternal
                );
            // }
        }
        $data = array(
            'data' => $dataFix,
            'message' => 'Inhuman'
        );
        return $this->respond($data);
    }
    public function getSelisih($dateAwal, $dateAkhir){
        $datetime = new \DateTime(date($dateAwal));
        return $datetime->diff(new \DateTime(date($dateAkhir)))
            ->format('%dhr %hjam %imnt');
    }

    public function getCekNorm(Request $request){
        $data = \DB::table('kendalidokumenrekammedis_t as kdr')
            ->join('pasien_m as ps','ps.id','=','kdr.nocmfk')
            ->leftJoin('statuskendalidokumen_m as skd','skd.id','=','kdr.objectstatuskendalidokumenfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','kdr.objectruanganasalfk')
            ->leftJoin('ruangan_m as ru1','ru1.id','=','kdr.objectruangantujuanfk')
            ->select('kdr.norec as norec_kdr','kdr.nocmfk','kdr.tglupdate','ps.nocm', 'kdr.dariunit','kdr.keunit','skd.name','kdr.tglkembali',
                     'kdr.objectstatuskendalidokumenfk','kdr.objectruanganasalfk','ru.namaruangan as ruanganasal','kdr.objectruangantujuanfk','kdr.tglkeluar',
                     'ru1.namaruangan as ruangantujuan','kdr.catatan'
       
             )
            ->where('kdr.tglkembali',null)
            ->orderBy('kdr.tglkeluar','desc');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('kdr.tglkeluar ', '>=', $request['tglAwal']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            // $data = $data->where('ps.nocm', 'ilike', '%'. $request['noCm'] .'%');
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        };
        $data=$data->get();

        $result = array(
            'data' => $data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }
    public function getDaftarDokumenRekamMedis(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            // ->join('antrianpasiendiperiksa_t as apd','apd.objectruanganasalfk','=', 'pd.objectruanganasalfk')
            ->join('antrianpasiendiperiksa_t as apd', function ($join) {
                    $join->on('apd.noregistrasifk', '=', 'pd.norec')
                         ->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
                })
            ->leftjoin('statuspulang_m as ssp', 'ssp.id','=','apd.objectstatuspulangfk' )
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
//          ->leftjoin('kendalidokumenrekammedis_t as ken', 'ken.noregistrasifk', '=', 'pd.norec')
//          ->leftjoin('statuskendalidokumen_m as ss', 'ss.id', '=', 'ken.objectstatuskendalidokumenfk')
            ->select('apd.norec','apd.noantrian','pd.norec as norecpd', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
                'kp.kelompokpasien', 'pg.namalengkap as namadokter', 'pd.tglpulang', 'pd.statuspasien',
                'pd.objectpegawaifk as pgid', 'pd.objectruanganlastfk',
                 'br.norec as norec_br', 'pd.nostruklastfk','jk.jeniskelamin','alm.alamatlengkap',
                'ps.tgllahir','ssp.statuspulang','pd.catatan','pd.statusschedule',
                DB::raw('case when pd.statusschedule = \'Kios-K\' then \'Kios-K\' when pd.statusschedule=\'\' then \'Loket\' else \'Registrasi Antrol Online\' end as statuspelayanan')
            )
            ->whereNull('br.norec')
            ->whereNotIn('ru.id',['322','251','545'])
            ->wherein('ru.objectdepartemenfk',[18,28,24,73,74,75]); 
            // ->wherein('ru.objectdepartemenfk','=','18');        
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<', $filter['tglAkhir']);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            if($filter['status'] == 'NULL'){
                $data = $data->whereNull('pd.statuskirimdokumen');
            }else{
                $data = $data->where('pd.statuskirimdokumen', '=',  $filter['status'] );
            }
        }


        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
            'kp.kelompokpasien', 'pg.namalengkap', 'pd.tglpulang', 'pd.statuspasien',
            'pd.objectpegawaifk', 'pd.objectruanganlastfk',
            'br.norec', 'pd.nostruklastfk','jk.jeniskelamin','alm.alamatlengkap',
            'ps.tgllahir','apd.noantrian','apd.norec','ssp.statuspulang','pd.catatan','pd.statusschedule');
        $data = $data->orderBy('pd.tglregistrasi')
                ->get();

       $data2 = \DB::table('v_daftardokumenrekammedis as v_ddr')
            ->whereNull('v_ddr.tglkembali');
        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined"){
                $data2 = $data2->whereBetween('v_ddr.tglupdate', [$request['tglAwal'],$request['tglAkhir']]);
        }
        if(isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined"){
                $data2 = $data2->where('v_ddr.objectruangantujuanfk',$filter['ruangId']);
        }
        if(isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined"){
                $data2 = $data2->where('v_ddr.nocm', 'ilike','%'.$filter['noCm'].'%');
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined"){
                $data2 = $data2->where('v_ddr.namapasien', 'ilike','%'.$filter['namaPasien'].'%');
        }
        // if(isset($filter['objectruanganasalfk']) && $filter['objectruanganasalfk'] != "" && $filter['objectruanganasalfk'] != "undefined"){
        $data2 = $data2->where('v_ddr.objectruanganasalfk', '<>','469');
        // }
        $data2 = $data2->orderBy('v_ddr.tglkeluar','asc')
                ->get();

        $datafix = [];
        
        foreach ($data  as $item){
            $kendali = \DB::table('kendalidokumenrekammedis_t as ken')
                ->join('statuskendalidokumen_m as ss','ss.id','=','ken.objectstatuskendalidokumenfk')
                ->join ('ruangan_m as r','r.id','=','ken.objectruangantujuanfk')
                ->select('ken.*','ss.name','r.namaruangan')
                ->where('noregistrasifk',$item->norec);
            // if (isset($filter['diterima']) && $filter['diterima'] != "" && $filter['diterima'] != "undefined" && $filter['diterima'] != "false") {
            //     $kendali = $kendali->where('ss.name', 'ilike', '%terima%');
            // }
            // if (isset($filter['dikirim']) && $filter['dikirim'] != "" && $filter['dikirim'] != "undefined" && $filter['dikirim'] != "false") {
            //     $kendali = $kendali->where('ss.name', 'ilike', '%kirim%');
            // }

            // $kendali2= $kendali->whereNull('tglkembali');
            // $kendali= $kendali->get();
            $kendali2 =$kendali->get();
            $tglkeluar="";
            $tglupdate="";
            $tglkembali ="";
            foreach ($kendali2 as $key) {
                $tglkeluar = $key->tglkeluar;
                $tglupdate = $key->tglupdate;
                $tglkembali = $key->tglkembali;
            }

            // foreach ($datafix  as $item){          
                $ruangantujuanx = '';
                foreach ($data2  as $item2){
                    
                    if($item->noregistrasi == $item2->noregistrasi){
                        if( $ruangantujuanx == ''){
                          
                            $ruangantujuanx =  $item2->ruangantujuan;
                        }else{   

                            $ruangantujuanx= $ruangantujuanx .' , ' .$item2->ruangantujuan; 
                        }
                       
                    }
                }                  
                
            // }
          
            $datafix [] = array(
                'norec' => $item->norec,
                'norecpd' => $item->norecpd,
                'tglregistrasi' => $item->tglregistrasi,
                'nocm' => $item->nocm,
                'nocmfk' => $item->nocmfk,
                'noregistrasi' => $item->noregistrasi,
                'namaruangan' => $item->namaruangan,
                'namapasien' => $item->namapasien,
                'kelompokpasien' => $item->kelompokpasien,
                'namadokter' => $item->namadokter,
                'tglpulang' => $item->tglpulang,
                'statuspasien' => $item->statuspasien,
                'pgid' => $item->pgid,
                'objectruanganlastfk' => $item->objectruanganlastfk,
                'norec_br' => $item->norec_br,
                'jeniskelamin' => $item->jeniskelamin,
                'alamatlengkap' => $item->alamatlengkap,
                'tgllahir' => $item->tgllahir,
                'kendali2'=> $kendali2,
                'ruangantujuanx'=> $ruangantujuanx,
                'noantrian'=> $item->noantrian,
                'norecapd' => $item->norec,
                'tglupdate' => $tglupdate,
                'tglkeluar' => $tglkeluar,
                'tglkembali' => $tglkembali,
                'selisih' => $this->getSelisih($item->tglregistrasi,$tglkeluar),
                'statuspulang' => $item->statuspulang,
                'catatan' => $item->catatan,
                'statuspelayanan' => $item->statuspelayanan,
                'statusschedule' => $item->statusschedule
            );


        }



         

        return $this->respond($datafix);
    }
    public function getDaftarDokumenRekamMedisRjRi(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            // ->join('antrianpasiendiperiksa_t as apd','apd.objectruanganasalfk','=', 'pd.objectruanganasalfk')
            ->join('antrianpasiendiperiksa_t as apd', function ($join) {
                    $join->on('apd.noregistrasifk', '=', 'pd.norec');
                        //  ->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
                })
            ->leftjoin('statuspulang_m as ssp', 'ssp.id','=','apd.objectstatuspulangfk' )
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
//          ->leftjoin('kendalidokumenrekammedis_t as ken', 'ken.noregistrasifk', '=', 'pd.norec')
//          ->leftjoin('statuskendalidokumen_m as ss', 'ss.id', '=', 'ken.objectstatuskendalidokumenfk')
            ->select('apd.norec','apd.noantrian','pd.norec as norecpd', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
                'kp.kelompokpasien', 'pg.namalengkap as namadokter', 'pd.tglpulang', 'pd.statuspasien',
                'pd.objectpegawaifk as pgid', 'pd.objectruanganlastfk',
                 'br.norec as norec_br', 'pd.nostruklastfk','jk.jeniskelamin','alm.alamatlengkap',
                'ps.tgllahir','ssp.statuspulang','pd.catatan','pd.statusschedule',
                DB::raw('case when pd.statusschedule = \'Kios-K\' then \'Kios-K\' when pd.statusschedule=\'\' then \'Loket\' else \'Registrasi Online\' end as statuspelayanan'))
            ->whereNull('br.norec')
            ->whereNotIn('ru.id',['322','251','545'])
            ->wherein('ru.objectdepartemenfk',[18,28,16]); 
            // ->wherein('ru.objectdepartemenfk','=','18');        
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            if($filter['status'] == 'NULL'){
                $data = $data->whereNull('pd.statuskirimdokumen');
            }else{
                $data = $data->where('pd.statuskirimdokumen', '=',  $filter['status'] );
            }
        }


        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
            'kp.kelompokpasien', 'pg.namalengkap', 'pd.tglpulang', 'pd.statuspasien',
            'pd.objectpegawaifk', 'pd.objectruanganlastfk',
            'br.norec', 'pd.nostruklastfk','jk.jeniskelamin','alm.alamatlengkap',
            'ps.tgllahir','apd.noantrian','apd.norec','ssp.statuspulang','pd.catatan','pd.statusschedule');
        $data = $data->orderBy('pd.tglregistrasi')
                ->get();

       $data2 = \DB::table('v_daftardokumenrekammedis as v_ddr')
            ->whereNull('v_ddr.tglkembali');
        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined"){
                $data2 = $data2->whereBetween('v_ddr.tglupdate', [$request['tglAwal'],$request['tglAkhir']]);
        }
        if(isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined"){
                $data2 = $data2->where('v_ddr.objectruangantujuanfk',$filter['ruangId']);
        }
        if(isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined"){
                $data2 = $data2->where('v_ddr.nocm', 'ilike','%'.$filter['noCm'].'%');
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined"){
                $data2 = $data2->where('v_ddr.namapasien', 'ilike','%'.$filter['namaPasien'].'%');
        }
        // if(isset($filter['objectruanganasalfk']) && $filter['objectruanganasalfk'] != "" && $filter['objectruanganasalfk'] != "undefined"){
        $data2 = $data2->where('v_ddr.objectruanganasalfk', '<>','469');
        // }
        $data2 = $data2->orderBy('v_ddr.tglkeluar','asc')
                ->get();

        $datafix = [];
        
        foreach ($data  as $item){
            $kendali = \DB::table('kendalidokumenrekammedis_t as ken')
                ->join('statuskendalidokumen_m as ss','ss.id','=','ken.objectstatuskendalidokumenfk')
                ->join ('ruangan_m as r','r.id','=','ken.objectruangantujuanfk')
                ->select('ken.*','ss.name','r.namaruangan')
                ->where('noregistrasifk',$item->norec);
                
            // if (isset($filter['diterima']) && $filter['diterima'] != "" && $filter['diterima'] != "undefined" && $filter['diterima'] != "false") {
            //     $kendali = $kendali->where('ss.name', 'ilike', '%terima%');
            // }
            // if (isset($filter['dikirim']) && $filter['dikirim'] != "" && $filter['dikirim'] != "undefined" && $filter['dikirim'] != "false") {
            //     $kendali = $kendali->where('ss.name', 'ilike', '%kirim%');
            // }

            // $kendali2= $kendali->whereNull('tglkembali');
            // $kendali= $kendali->get();
            $kendali2 =$kendali->get();
            // return($kendali2);
            //     die();
            $tglkeluar="";
            $tglupdate="";
            $tglkembali ="";
            foreach ($kendali2 as $key) {
                $tglkeluar = $key->tglkeluar;
                $tglupdate = $key->tglupdate;
                $tglkembali = $key->tglkembali;
            }

            // foreach ($datafix  as $item){          
                $ruangantujuanx = '';
                foreach ($data2  as $item2){
                    
                    if($item->norec == $item2->noregistrasifk){
                        if( $ruangantujuanx == ''){
                          
                            $ruangantujuanx =  $item2->ruangantujuan;
                        }else{   

                            $ruangantujuanx= $ruangantujuanx .' , ' .$item2->ruangantujuan; 
                        }
                       
                    }
                }                  
                
            // }
            if($tglkembali!=''){
                $datafix [] = array(
                    'norec' => $item->norec,
                    'norecpd' => $item->norecpd,
                    'tglregistrasi' => $item->tglregistrasi,
                    'nocm' => $item->nocm,
                    'nocmfk' => $item->nocmfk,
                    'noregistrasi' => $item->noregistrasi,
                    'namaruangan' => $item->namaruangan,
                    'namapasien' => $item->namapasien,
                    'kelompokpasien' => $item->kelompokpasien,
                    'namadokter' => $item->namadokter,
                    'tglpulang' => $item->tglpulang,
                    'statuspasien' => $item->statuspasien,
                    'pgid' => $item->pgid,
                    'objectruanganlastfk' => $item->objectruanganlastfk,
                    'norec_br' => $item->norec_br,
                    'jeniskelamin' => $item->jeniskelamin,
                    'alamatlengkap' => $item->alamatlengkap,
                    'tgllahir' => $item->tgllahir,
                    'kendali2'=> $kendali2,
                    'ruangantujuanx'=> $ruangantujuanx,
                    'noantrian'=> $item->noantrian,
                    'norecapd' => $item->norec,
                    'tglupdate' => $tglupdate,
                    'tglkeluar' => $tglkeluar,
                    'tglkembali' => $tglkembali,
                    'selisih' => $this->getSelisih($item->tglregistrasi,$tglkeluar),
                    'statuspulang' => $item->statuspulang,
                    'catatan' => $item->catatan,
                    'statuspelayanan' => $item->statuspelayanan
                );
            }
            


        }



         

        return $this->respond($datafix);
    }
    public function getDaftarDokumenRekamMedisRjRi2(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minutes
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            // ->join('antrianpasiendiperiksa_t as apd','apd.objectruanganasalfk','=', 'pd.objectruanganasalfk')
            ->join('antrianpasiendiperiksa_t as apd', function ($join) {
                    $join->on('apd.noregistrasifk', '=', 'pd.norec');
                        //  ->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
                })
            ->leftjoin('statuspulang_m as ssp', 'ssp.id','=','apd.objectstatuspulangfk' )
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as ken', 'ken.noregistrasifk', '=', 'apd.norec')
//          ->leftjoin('statuskendalidokumen_m as ss', 'ss.id', '=', 'ken.objectstatuskendalidokumenfk')
            ->select('apd.norec','apd.noantrian','pd.norec as norecpd', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
                'kp.kelompokpasien', 'pg.namalengkap as namadokter', 'pd.tglpulang', 'pd.statuspasien',
                'pd.objectpegawaifk as pgid', 'pd.objectruanganlastfk',
                 'br.norec as norec_br', 'pd.nostruklastfk','jk.jeniskelamin','alm.alamatlengkap',
                'ps.tgllahir','ssp.statuspulang','pd.catatan','ken.tglkembali','ken.tglupdate','ken.tglkeluar')
            ->whereNull('br.norec')
            ->whereNotIn('ru.id',['322','251','545'])
            ->wherein('ru.objectdepartemenfk',[18,28,16]); 
            // ->wherein('ru.objectdepartemenfk','=','18');        
        // if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
        //     $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        // }
        // if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
        //     $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        // }
        if (isset($filter['tglkembaliawal']) && $filter['tglkembaliawal'] != "" && $filter['tglkembaliawal'] != "undefined") {
            $data = $data->where('ken.tglkembali', '>=', $filter['tglkembaliawal']);
        }
        if (isset($filter['tglkembaliakhir']) && $filter['tglkembaliakhir'] != "" && $filter['tglkembaliakhir'] != "undefined") {
            $data = $data->where('ken.tglkembali', '<=', $filter['tglkembaliakhir']);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            if($filter['status'] == 'NULL'){
                $data = $data->whereNull('pd.statuskirimdokumen');
            }else{
                $data = $data->where('pd.statuskirimdokumen', '=',  $filter['status'] );
            }
        }

        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
            'kp.kelompokpasien', 'pg.namalengkap ', 'pd.tglpulang', 'pd.statuspasien',
            'pd.objectpegawaifk', 'pd.objectruanganlastfk',
            'br.norec', 'pd.nostruklastfk','jk.jeniskelamin','alm.alamatlengkap',
            'ps.tgllahir','apd.noantrian','apd.norec','ssp.statuspulang','pd.catatan','ken.tglkembali','ken.tglupdate','ken.tglkeluar');
        $data = $data->orderBy('pd.tglregistrasi')
                ->get();

       $data2 = \DB::table('v_daftardokumenrekammedis as v_ddr')
            ->whereNull('v_ddr.tglkembali');
        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined"){
                $data2 = $data2->whereBetween('v_ddr.tglupdate', [$request['tglAwal'],$request['tglAkhir']]);
        }
        if(isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined"){
                $data2 = $data2->where('v_ddr.objectruangantujuanfk',$filter['ruangId']);
        }
        if(isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined"){
                $data2 = $data2->where('v_ddr.nocm', 'ilike','%'.$filter['noCm'].'%');
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined"){
                $data2 = $data2->where('v_ddr.namapasien', 'ilike','%'.$filter['namaPasien'].'%');
        }
        // if(isset($filter['objectruanganasalfk']) && $filter['objectruanganasalfk'] != "" && $filter['objectruanganasalfk'] != "undefined"){
        $data2 = $data2->where('v_ddr.objectruanganasalfk', '<>','469');
        // }
        $data2 = $data2->orderBy('v_ddr.tglkeluar','asc')
                ->get();

        $datafix = [];
        
        foreach ($data  as $item){
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $kendali = \DB::table('kendalidokumenrekammedis_t as ken')
        //         ->join('statuskendalidokumen_m as ss','ss.id','=','ken.objectstatuskendalidokumenfk')
        //         ->join ('ruangan_m as r','r.id','=','ken.objectruangantujuanfk')
        //         ->select('ken.*','ss.name','r.namaruangan')
        //         ->where('noregistrasifk',$item->norec);
                
            // if (isset($filter['diterima']) && $filter['diterima'] != "" && $filter['diterima'] != "undefined" && $filter['diterima'] != "false") {
            //     $kendali = $kendali->where('ss.name', 'ilike', '%terima%');
            // }
            // if (isset($filter['dikirim']) && $filter['dikirim'] != "" && $filter['dikirim'] != "undefined" && $filter['dikirim'] != "false") {
            //     $kendali = $kendali->where('ss.name', 'ilike', '%kirim%');
            // }

            // $kendali2= $kendali->whereNull('tglkembali');
            // $kendali= $kendali->get();
            // $kendali2 =$kendali->get();
            // // return($kendali2);
            // //     die();
            // $tglkeluar="";
            // $tglupdate="";
            // $tglkembali ="";
            // foreach ($kendali2 as $key) {
            //     $tglkeluar = $key->tglkeluar;
            //     $tglupdate = $key->tglupdate;
            //     $tglkembali = $key->tglkembali;
            // }

            // foreach ($datafix  as $item){          
                $ruangantujuanx = '';
                foreach ($data2  as $item2){
                    
                    if($item->norec == $item2->noregistrasifk){
                        if( $ruangantujuanx == ''){
                          
                            $ruangantujuanx =  $item2->ruangantujuan;
                        }else{   

                            $ruangantujuanx= $ruangantujuanx .' , ' .$item2->ruangantujuan; 
                        }
                       
                    }
                }                  
                
            // }
            // if($tglkembali!=''){
                $datafix [] = array(
                    'norec' => $item->norec,
                    'norecpd' => $item->norecpd,
                    'tglregistrasi' => $item->tglregistrasi,
                    'nocm' => $item->nocm,
                    'nocmfk' => $item->nocmfk,
                    'noregistrasi' => $item->noregistrasi,
                    'namaruangan' => $item->namaruangan,
                    'namapasien' => $item->namapasien,
                    'kelompokpasien' => $item->kelompokpasien,
                    'namadokter' => $item->namadokter,
                    'tglpulang' => $item->tglpulang,
                    'statuspasien' => $item->statuspasien,
                    'pgid' => $item->pgid,
                    'objectruanganlastfk' => $item->objectruanganlastfk,
                    'norec_br' => $item->norec_br,
                    'jeniskelamin' => $item->jeniskelamin,
                    'alamatlengkap' => $item->alamatlengkap,
                    'tgllahir' => $item->tgllahir,
                    // 'kendali2'=> $kendali2,
                    'ruangantujuanx'=> $ruangantujuanx,
                    'noantrian'=> $item->noantrian,
                    'norecapd' => $item->norec,
                    'tglupdate' => $item->tglupdate,
                    'tglkeluar' => $item->tglkeluar,
                    'tglkembali' => $item->tglkembali,
                    'selisih' => $this->getSelisih($item->tglregistrasi,$item->tglkeluar),
                    'statuspulang' => $item->statuspulang,
                    'catatan' => $item->catatan
                );
            // }
            


        }



         

        return $this->respond($datafix);
    }
    public function getRekapDokumenRekamMedis(Request $request)
    {
        $data = \DB::table('v_daftardokumenrekammedis')
            ->whereBetween('tglupdate', [$request['tglAwal'],$request['tglAkhir']])
            ->orderBy('tglupdate','desc');
        $a='';
        $b='';
        $c='';
        if(isset($request['dikirim']) &&  $request['dikirim']!="" && $request['dikirim']!="undefined"){
            // $data = $data
            //     ->orWhere('name','dikirim' );
            $a='dikirim';
        }
        if(isset($request['diterima']) &&  $request['diterima']!="" && $request['diterima']!="undefined"){
            // $data = $data
            //     ->orWhere('name','diterima' );
            $b='diterima';
        }
        if(isset($request['dipinjam']) &&  $request['dipinjam']!="" && $request['dipinjam']!="undefined"){
            // $data = $data
            //     ->orWhere('name','dipinjam');
            $c='dipinjam';
        }
        // if ($a!="" && $b!="" && $c!=""){
           $data = $data
                ->wherein('name',[$a,$b,$c]); 
        // }
        
       

        $data=$data->get();


        $result = array(
            'data' => $data,
        );

        return $this->respond($result);
    }
    public function getDaftarDokumenRekamMedisBelumKembaliold(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('v_daftardokumenrekammedis as v_ddr')
            ->whereNull('v_ddr.tglkembali');
        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined"){
                $data = $data->whereBetween('v_ddr.tglupdate', [$request['tglAwal'],$request['tglAkhir']]);
        }
        if(isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined"){
                $data = $data->where('v_ddr.objectruangantujuanfk',$filter['ruangId']);
        }
        if(isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined"){
                $data = $data->where('v_ddr.nocm', 'ilike','%'.$filter['noCm'].'%');
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined"){
                $data = $data->where('v_ddr.namapasien', 'ilike','%'.$filter['namaPasien'].'%');
        }

        $data = $data->get();
       
        $res = array(
            'data' => $data,
        );
        return $this->respond($res);
    }
     public function getDaftarDokumenRekamMedisBelumKembali(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('v_daftardokumenrekammedis as v_ddr')
            ->join('antrianpasiendiperiksa_t as apd','apd.norec','=','v_ddr.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'apd.noregistrasifk','=','pd.norec')
            ->leftjoin('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftjoin('statuspulang_m as ssp', 'ssp.id','=','apd.objectstatuspulangfk' )
            ->whereNull('v_ddr.tglkembali');
        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined"){
                $data = $data->whereBetween('pd.tglregistrasi', [$request['tglAwal'],$request['tglAkhir']]);
        }
        // if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined"){
        //         $data = $data->whereBetween('v_ddr.tglupdate', [$request['tglAwal'],$request['tglAkhir']]);
        // }
        if(isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined"){
                $data = $data->where('v_ddr.objectruangantujuanfk',$filter['ruangId']);
        }
        if(isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined"){
                $data = $data->where('v_ddr.nocm', 'ilike','%'.$filter['noCm'].'%');
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined"){
                $data = $data->where('v_ddr.namapasien', 'ilike','%'.$filter['namaPasien'].'%');
        }
        if(isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined"){
            $data = $data->where('v_ddr.depttujuan', 'ilike','%'.$filter['deptId'].'%');
        }
        // if(isset($filter['objectruanganasalfk']) && $filter['objectruanganasalfk'] != "" && $filter['objectruanganasalfk'] != "undefined"){
        $data = $data->where('v_ddr.objectruanganasalfk', '=','469');
        // }

        $data = $data->select('v_ddr.*','ssp.statuspulang','apd.noregistrasifk','kp.kelompokpasien');
        $data = $data->get();

         $data2 = \DB::table('v_daftardokumenrekammedis as v_ddr')
            ->whereNull('v_ddr.tglkembali');
        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined"){
                $data2 = $data2->whereBetween('v_ddr.tglupdate', [$request['tglAwal'],$request['tglAkhir']]);
        }
        if(isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined"){
                $data2 = $data2->where('v_ddr.objectruangantujuanfk',$filter['ruangId']);
        }
        if(isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined"){
                $data2 = $data2->where('v_ddr.nocm', 'ilike','%'.$filter['noCm'].'%');
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined"){
                $data2 = $data2->where('v_ddr.namapasien', 'ilike','%'.$filter['namaPasien'].'%');
        }

        // if(isset($filter['objectruanganasalfk']) && $filter['objectruanganasalfk'] != "" && $filter['objectruanganasalfk'] != "undefined"){
        $data2 = $data2->where('v_ddr.objectruanganasalfk', '<>','469')
                    ->orderBy('v_ddr.tglkeluar','asc');
        // }
        $data2 = $data2->get();


        foreach ($data  as $item){          
             $item->ruangantujuanx = '';
            foreach ($data2  as $item2){
                if($item->noregistrasi == $item2->noregistrasi){
                    if( $item->ruangantujuanx == ''){
                        $item->ruangantujuanx =  $item2->ruangantujuan;
                    }else{                        
                        $item->ruangantujuanx = $item->ruangantujuanx .' , ' .$item2->ruangantujuan; 
                    }
                   
                }
            }                  
            
        }
        $res = array(
            'data' => $data,
        );
        return $this->respond($res);
    }

    
    public function getHistoriDokumenRekmed(Request $request,$nocm)
    {
        $data = \DB::table('kendalidokumenrekammedis_t as ken')
            ->leftJoin('pasiendaftar_t as pd','pd.norec','=','ken.noregistrasifk')
            ->leftJoin('ruangan_m as ru','ru.id','=','ken.objectruanganasalfk')
            ->leftJoin('ruangan_m as ru2','ru2.id','=','ken.objectruangantujuanfk')
            ->leftJoin('statuskendalidokumen_m as st','st.id','=','ken.objectstatuskendalidokumenfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','ken.pegawaifk')
            ->leftJoin('pasien_m as ps','ps.id','=','ken.nocmfk')
            ->select('ken.*','ru.namaruangan as ruanganasal','ru2.namaruangan as ruangantujuan','st.name as status','pg.namalengkap',
                'pd.noregistrasi')
            ->where('ken.statusenabled', true)
            ->where('ps.nocm','=', $nocm)
            ->orderBy('ken.tglupdate','desc')
            ->get();


        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function updateDokumenTerima(Request $request) {

        DB::beginTransaction();
        try{
           
            $tglkembali=$request['tglkembali'];

        // return( $request['loop']);
        // die();
            if ($request['loop']=='y'){
                foreach ( $request['pasien'] as $item){
                    // foreach ($item['kendali2'] as $item2) {
                    // return($item2['norec']);
                    // die();
                    KendaliDokumenRekamMedis::where('norec', $item['norec'])->update(
                        ['tglkembali' => $tglkembali]
                    );}
                    PasienDaftar::where('norec', $item['noregistrasifk'])->update(
                        ['statuskirimdokumen' => 2]
                    );    
                // }
            }else if($request['loop']=='t'){
                foreach ($request['pasien']  as $item2 ) {

                     KendaliDokumenRekamMedis::where('norec', $item2['norec'])->update(
                        ['tglkembali' => $tglkembali]
                    );
                }                   
            }else{  
               
                     KendaliDokumenRekamMedis::where('noregistrasifk', $request['pasien']['norec'])->update(
                        ['tglkembali' => $tglkembali]
                    );
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                // 'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                // 'data' =>$newKDR,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function cetakTracer(Request $request) {

        DB::beginTransaction();
        try{
            Tracer::where('noregistrasi', $request['noregistrasi'])
            ->delete();
            

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                // 'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                // 'data' =>$newKDR,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapuskendali(Request $request) {

        DB::beginTransaction();
        try{
           
            KendaliDokumenRekamMedis::where('norec', $request['norec_kdr'])
            ->delete();
            PasienDaftar::where('noregistrasi',$request['noregistrasi'])
            ->update([
                    'statuskirimdokumen' => NULL,
                ]);
            

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                // 'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                // 'data' =>$newKDR,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

     public function perbaikanalamat(Request $request)
    {
         ini_set('max_execution_time', 60000);
        // $data = \DB::table('alamat_m')
        //     ->get();

        // $data2 = \DB::table('pasien_m')
        //     ->get();

        //     foreach ($data as $item) {
        //         foreach ($data2 as $item2) {
        //            if($item->nocmfk == $item2->nocm){
        //                 $ada='a';
        //                  $Kel = Alamat::where('norec', $item->norec)
        //                     ->update([
        //                         'nocmfk' => $item2->id,
        //                     ]);
        //                 continue;
        //            }
        //         }
        //     }
            $data2 = \DB::table('alamat_m')
            ->get();
            foreach ($data2 as $item) {
                    $data = \DB::table('pasien_m')
                    ->where('nocm',$item->nocmfk)
                    ->get();
                    
                    $data = \DB::table('pasien_m')
                    ->get();

                    foreach ($data as $item2) {
                        # code...
                    }
                    $Kel = Alamat::where('norec', $item->norec)
                            ->update([
                                'nocmfk' => $item->id,
                            ]);
            }


        $result = array(
            // 'data' => $ada,
            //             'data2' => $data2,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
     public function perbaikannocm(Request $request)
    {
         ini_set('max_execution_time', 60000);
        $seats = "";
        $num_cols = 14000000;
        $num_rows = ''; // assume you don't validate the request, so this can receive empty string too
        // $num_rows = 0; // will output the same as above
        for($i = 1400000;$i<=($num_cols);$i++)
        {
             // $data = \DB::raw("insert into pasien_m_copy values ($i,1)");
            DB::insert("insert into pasien_m_copy (nocm, ket)  values ('".$i ."',1)");

        }


        $result = array(
            'data' => $data,
                        // 'data2' => $data2,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
}