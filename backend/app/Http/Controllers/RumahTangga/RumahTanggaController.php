<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 11/22/2019
 * Time: 10:42 AM
 */
namespace App\Http\Controllers\RumahTangga;

use App\Http\Controllers\ApiController;
use App\Traits\Valet;
use Illuminate\Http\Request;
use App\Transaksi\StrukPlanning;
use DB;

use App\Notifications\MerryChristmas;
use Nexmo\Laravel\Facade\Nexmo;
use Nexmo\Notifications\WhatsApp;
use NotificationChannels\ChatAPI\ChatAPI;
use NotificationChannels\ChatAPI\ChatAPIMessage;
use Twilio\Rest\Client;

class RumahTanggaController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
//    public function getComboSanitasi(Request $request)
//    {
//
//        $deptRanap = explode (',',$this->settingDataFixed('kdDepartemenRanapFix'));
//        $kdDepartemenRawatInap = [];
//        foreach ($deptRanap as $itemRanap){
//            $kdDepartemenRawatInap []=  (int)$itemRanap;
//        }
//
//        $deptJalan = explode (',',$this->settingDataFixed('kdDepartemenRawatJalanFix'));
//        $kdDepartemenRawatJalan = [];
//        foreach ($deptJalan as $item){
//            $kdDepartemenRawatJalan []=  (int)$item;
//        }
//
//        $dataInstalasi = \DB::table('departemen_m as dp')
//            ->where('dp.statusenabled', true)
//            ->orderBy('dp.namadepartemen')
//            ->get();
//        $dataRuangan = \DB::table('ruangan_m as ru')
//            ->where('ru.statusenabled', true)
//            ->orderBy('ru.namaruangan')
//            ->get();
//        foreach ($dataInstalasi as $item) {
//            $detail = [];
//            foreach ($dataRuangan as $item2) {
//                if ($item->id == $item2->objectdepartemenfk) {
//                    $detail[] = array(
//                        'id' => $item2->id,
//                        'ruangan' => $item2->namaruangan,
//                    );
//                }
//            }
//
//            $dataDepartemen[] = array(
//                'id' => $item->id,
//                'departemen' => $item->namadepartemen,
//                'ruangan' => $detail,
//            );
//        }
//        $ruangRJ = \DB::table('ruangan_m as ru')
//            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
//            ->whereIn('ru.id', $kdDepartemenRawatJalan)
//            ->where('ru.statusenabled', true)
//            ->orderBy('ru.namaruangan')
//            ->get();
//        $ruangRI = \DB::table('ruangan_m as ru')
//            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
//            ->whereIn('ru.id', $kdDepartemenRawatInap)
//            ->where('ru.statusenabled', true)
//            ->orderBy('ru.namaruangan')
//            ->get();
//        $dataKelas = \DB::table('kelas_m as kl')
//            ->select('kl.id', 'kl.namakelas')
//            ->where('kl.statusenabled', true)
//            ->orderBy('kl.namakelas')
//            ->get();
//
//        $dataKelasKamar = \DB::table('kelas_m as kl')
//            ->select('kl.id', 'kl.namakelas')
//            ->where('kl.statusenabled', true)
//            ->orderBy('kl.namakelas')
//            ->get();
//        $datadept = \DB::table('departemen_m as dp')
//            ->select('dp.id', 'dp.namadepartemen')
//            ->where('dp.statusenabled', true)
//            ->orderBy('dp.namadepartemen')
//            ->get();
//
//        $result = array(
//            'ruangan' => $dataRuangan,
//            'rawatinap' => $ruangRI,
//            'kelas' => $dataKelas,
//            'kelaskamar' => $dataKelasKamar,
//            'departemen' => $datadept,
//            'rawatjalan' => $ruangRJ,
//            'datadept' => $dataDepartemen,
//            'dataruangan' => $dataRuangan,
//            'message' => 'cepot',
//        );
//
//        return $this->respond($result);
//    }

    public function getComboRumahTangga(Request $request) {
        $dataSumberDana = \DB::table('asalproduk_m as lu')
            ->select('lu.id','lu.asalproduk as asalProduk')
            ->where('lu.statusenabled', true)
            ->get();

        $dataRuanganAll = \DB::table('ruangan_m as lu')
            ->select('lu.id','lu.namaruangan')
            ->where('lu.statusenabled',true)
            ->get();

        $ruanganRumahTangga = \DB::table('ruangan_m as lu')
            ->select('lu.id','lu.namaruangan')
            ->where('lu.statusenabled',true)
            ->where('lu.objectdepartemenfk','11')
            ->get();

        $dataJenisProduk = \DB::table('jenisproduk_m as lu')
            ->select('lu.id','lu.jenisproduk as jenisProduk')
            ->get();


        $jenisProduk =  \DB::table('jenisproduk_m as jp')
            ->select('jp.id','jp.jenisproduk')
            ->where('jp.statusenabled',true)
            ->get();

        $detailJenis =  \DB::table('detailjenisproduk_m as djp')
            ->select('djp.id','djp.detailjenisproduk','objectjenisprodukfk')
            ->where('djp.statusenabled',true)
            ->get();


        $dataKelompokProduk2 = \DB::table('kelompokproduk_m as jk')
            ->select('jk.id','jk.kelompokproduk')
            ->where('jk.statusenabled',true)
            ->get();



        foreach ($jenisProduk as $item) {
            $detail = [];
            foreach ($detailJenis as $item2) {
                if ($item->id == $item2->objectjenisprodukfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'detailjenisproduk' => $item2->detailjenisproduk,
                    );
                }
            }
            $dataJenisProduk[] = array(
                'id' => $item->id,
                'jenisproduk' => $item->jenisproduk,
                'detailjenisproduk' => $detail,
            );
        }

        $dataProduk = \DB::table('produk_m as pr')
            ->leftJOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->leftJOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
//            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.kdproduk as kdsirs','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.statusenabled',true)
            ->where('pr.objectdepartemenfk',$this->settingDataFixed('KdDepartemenLaundry'))
//            ->where('jp.id',97)
//            ->where('spd.qtyproduk','>',0)
            ->groupBy('pr.id','pr.kdproduk','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();
//        return $dataProduk;

        $dataKonversiProduk = \DB::table('konversisatuan_t as ks')
            ->JOIN('satuanstandar_m as ss','ss.id','=','ks.satuanstandar_asal')
            ->JOIN('satuanstandar_m as ss2','ss2.id','=','ks.satuanstandar_tujuan')
            ->select('ks.objekprodukfk','ks.satuanstandar_asal','ss.satuanstandar','ks.satuanstandar_tujuan','ss2.satuanstandar as satuanstandar2',
                'ks.nilaikonversi')
            ->where('ks.statusenabled',true)
            ->get();

        foreach ($dataProduk as $item){
            $satuanKonversi=[];
            foreach ($dataKonversiProduk  as $item2){
                if ($item->id == $item2->objekprodukfk){
                    $satuanKonversi[] =array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult[]=array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'kdsirs' => $item->kdsirs,
                'kdproduk' => $item->kdsirs,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }


        $dataSatuan = \DB::table('satuanstandar_m as ss')
            ->where('ss.statusenabled', true)
            ->orderBy('ss.satuanstandar')
            ->get();

        $dataJenisProduk = \DB::table('jenisproduk_m as jp')
            ->where('jp.statusenabled', true)
            ->orderBy('jp.jenisproduk')
            ->get();

        $result = array(
            'jenisbarang' => $dataJenisProduk,
            'asalproduk' => $dataSumberDana,
            'ruanganall' => $dataRuanganAll,
            'kelompokproduk' =>$dataKelompokProduk2,
            'produk' => $dataProdukResult,
            'satuan' => $dataSatuan,
            'ruanganlaundry' => $ruanganRumahTangga,
            'by' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getTempatTidur(Request $request){
        $arrru = $request['arrru'];

        $data= \DB::table('ruangansanitasi_m as ru')
            ->leftjoin('strukplanning_t as spl', 'ru.id', '=', 'spl.objectruanganfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'spl.objectpegawaipjawabfk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'spl.objectpegawaipjawabevaluasifk')
            ->select('ru.id as idruangan','ru.namaruangan',
                'spl.tglplanning','spl.objectpegawaipjawabfk','spl.startdate','spl.duedate','spl.deskripsiplanning',
                'spl.objectpegawaipjawabevaluasifk','spl.keteranganverifikasi','spl.norec'
                ,'pg.namalengkap','pg2.namalengkap as pegawaipj'
            )
            ->whereIn('ru.objectdepartemenfk',array($arrru))
            ->where('ru.statusenabled',true);
//            ->where('spl.objectkelompoktransaksifk',121);

        if(isset($request['desc']) && $request['desc']!="" && $request['desc']!="undefined"){
            $data = $data->where('ru.namaruangan','like','%'. $request['desc'] .'%');
        };
        if (isset($request['manage']) && $request['manage'] != "" && $request['manage'] != "undefined") {
//            $data = $data->where('spl.tglplanning','>', date('Y-m-d 00:00:00'));
        }else{
            $data = $data->whereBetween('spl.tglplanning', [ $request['tglAwal'],$request['tglAkhir'] ]);
        }
        $data = $data->get();


        return $this->respond($data);
    }
    public function SaveDataSignDate(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{
                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
//            $newCOA->signdate = $request['signdate'];
            $newCOA->objectruanganfk = $request['objectruanganfk'];
            $newCOA->deskripsiplanning = $request['deskripsiplanning'];
            //$newCOA->objectkelompoktransaksifk = 121;
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataAlokasiStaff(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->objectpegawaipjawabfk = $request['objectpegawaipjawabfk'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataWorkList(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->deskripsiplanning = $request['deskripsiplanning'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataInspeksi(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->keteranganverifikasi = $request['keteranganverifikasi'];
            $newCOA->objectpegawaipjawabevaluasifk = $request['objectpegawaipjawabevaluasifk'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataStartDate(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->startdate = date('Y-m-d H:i:s');
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveDataDueDate(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->duedate = date('Y-m-d H:i:s');
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getDataPegawaiGeneral(Request $request) {
        $req=$request->all();
        $dataProduk=[];
        $dataProduk  = \DB::table('pegawai_m as st')
            ->select('st.id','st.namalengkap')
            ->where('st.statusenabled',true)
            ->orderBy('st.namalengkap');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('st.namalengkap','like','%'. $req['filter']['filters'][0]['value'].'%' );
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        foreach ($dataProduk as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }

        return $this->respond($dataPenulis2);
    }

    public function getDataCombo(Request $request)
    {
        $req=$request->all();
        $dataProduk  = \DB::table('jenispekerjaan_m')
            ->select('id as value','namaexternal as text','namaexternal')
            ->where('statusenabled',true)
            ->whereIn('id', [4,5,6,7])
            ->orderBy('id');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('namaexternal','like','%'. $req['filter']['filters'][0]['value'].'%' );
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
//        $dataLogin = $request->all();
//        $dataJenisPek = \DB::table('jenispekerjaan_m as jp')
//            ->select('jp.id', 'jp.namaexternal')
//            ->whereIn('jp.id', [4,5,6,7])
//            ->where('st.statusenabled',true)
//            ->orderBy('jp.id')
//            ->get();
//
//        $result = array(
//            'namaexternal' => $dataJenisPek,
//            'message' => 'as@khris',
//        );
//
//        return $this->respond($result);
    }

    public function saveTambahKegiatan(Request $request) {
        DB::beginTransaction();
        $dataReq = $request->all();

        try {

            if ($dataReq['norec'] == '') {
                $dataSave = new StrukPlanning();
                $dataSave->norec = $dataSave->generateNewId();
                $dataSave->kdprofile = 0;
                $dataSave->statusenabled = true;
                # code...
            }else{

                $dataSave= StrukPlanning::where('norec',$dataReq['norec'])->first();

            }
            $dataSave->tglplanning = $dataReq['tglplanning'];
            $dataSave->objectruanganasalfk = $dataReq['objectruanganasalfk'];
            $dataSave->objectjenispekerjaanfk = $dataReq['objectjenispekerjaanfk'];
            $dataSave->objectruanganfk = $dataReq['objectruanganfk'];
            $dataSave->objectpegawaipjawabfk = $dataReq['objectpegawaipjawabfk'];
            $dataSave->deskripsiplanning = $dataReq['deskripsiplanning'];


            $dataSave->save();


            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataSave,
                "as" => 'khris@epic',
            );
        }else{
            $transMessage =" Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'khris@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataRumahTangga(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $tempjenisPek = $request['tempjenisPek'];

        $paramTgl = ' ';
        if ((isset($tglAwal) && $tglAwal != "" && $tglAwal != "undefined")&&(isset($tglAkhir) && $tglAkhir != "" && $tglAkhir != "undefined") ){
            $paramTgl = "WHERE stp.tglplanning BETWEEN '".$tglAwal."' AND '".$tglAkhir."'";
        }
        $paramJenis = '';
        if (isset($tempjenisPek) && $tempjenisPek != "" && $tempjenisPek != "undefined") {
            $paramJenis = ' and jpk.id = ' . $tempjenisPek;
        }


        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT stp.norec, rg.namaruangan, stp.tglplanning, pg.nama, stp.startdate, stp.duedate, stp.deskripsiplanning, sttp.namaexternal,stp.signdate, jpk.namaexternal as napek, stp.worklist, 
        stp.keteranganverifikasi, pg2.nama as namaevaluasi

            FROM strukplanning_t as stp
            INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk
            LEFT JOIN pegawai_m as pg on pg.id = stp.objectpegawaipjawabfk
            LEFT JOIN pegawai_m as pg2 on pg2.id = stp.objectpegawaipjawabevaluasifk
            LEFT JOIN statuspekerjaan_m as sttp on sttp.id = stp.objectstatuspekerjaanfk
			LEFT JOIN jenispekerjaan_m as jpk on jpk.id = stp.objectjenispekerjaanfk
			$paramTgl $paramJenis
            ORDER BY stp.tglplanning DESC"));

        return $this->respond($data);
    }

    public function SaveSignDate(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
                $newCOA =  StrukPlanning::where('norec',$request['norec'])
                    ->update([
                            'signdate' => $request['signdate']
                        ]

                    );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function SaveAlokasistaff(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
            $newCOA =  StrukPlanning::where('norec',$request['norec'])
                ->update([
                        'objectpegawaipjawabfk' => $request['objectpegawaipjawabfk']
                    ]

                );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SaveWorklist(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
            $newCOA =  StrukPlanning::where('norec',$request['norec'])
                ->update([
                        'worklist' => $request['worklist']
                    ]

                );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function SaveStartDate(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
//        return $this->respond($request['signdate']);
        try {
//            if ($request['norec'] == ''){
            $newCOA =  StrukPlanning::where('norec',$request['norec'])
                ->update([
                        'startdate' => $request['startdate']
                    ]

                );
//            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newCOA,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newCOA,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getJenisLayananRumahTangga(Request $request){
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM jenispekerjaan_m
			WHERE jenispekerjaan='Rumah Tangga' AND namaexternal='Layanan Rumah Tangga'"));

        return $this->respond($data);

    }

    public function SavePermohonanRumahTangga(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

//        try {
            $nohp = ($request['nohppelapor']!=null?$request['nohppelapor']:'-');
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->tglplanning = $request['tglplanning'];
            $newCOA->objectruanganfk = $request['ruangandesc'];
            $newCOA->objectkelompoktransaksifk = 161;
            $newCOA->rincianexecuteplanning_askep = $request['rincian'];
            $newCOA->narasumberfk = $request['pelapor'];
            $newCOA->objectjenispekerjaanfk = $request['jenisKerusakan'];
            $newCOA->nohppelapor = $nohp;
            $newCOA->save();

            // $norecHead2 = $newCOA->norec;

            // $sid    = "ACc6ac08ce1cc9096e0fd57a0c38801118";
            // $token  = "cada716b5a36721fd86832662bbd06fe";
            // $twilio = new Client($sid, $token);
            // $array =[
            //     "whatsapp:+6282110191673",
            //     "whatsapp:+6282211333013",
            //     "whatsapp:+6285702501576",
            //     "whatsapp:+6283838339887",
            //     "whatsapp:+6281649111417",
            //     "whatsapp:+628563637731",
            //     "whatsapp:+6285746169422",
            //     "whatsapp:+628563637731",
            //     "whatsapp:+6281346568936",
            //     "whatsapp:+6287758626737",
            //     "whatsapp:+6285641367387",
            //     "whatsapp:+6285727301273",
            //     "whatsapp:+6285702501576",
            //     "whatsapp:+6281283757854"
            // ];
            // $i = 0;
            // foreach ($array as $arr){
            //     $message = $twilio->messages
            //         ->create($array[$i], // to
            //             array(
            //                 "from" => "whatsapp:+14155238886",
            //                 "body" => "Laporan Baru Sanitasi dari ruangan ".$request['namaruangan']." oleh ".$request['namapelapor']." : ".$request['rincian'].". Link: https://bit.ly/3dxT1YS"
            //             )
            //         );
            //     $i = $i+1;
            // }



            $secret_token = "1298249516:AAEJsI61Wt23U6OO6z2rCF4dI8ifApQ0pTY";
            $telegram_id = '-432873925'; //Id Group Telegram Rumah Tangga
            $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $telegram_id;
            $url = $url . "&text=" . urlencode("Laporan Baru: <b>Rumah Tangga </b> \n\n Ruangan: <b>".$request['namaruangan']."</b>  \n Pelapor: <b>".$request['namapelapor']."</b>  \n Laporan: <b>".$request['rincian']."</b> \n Jenis Layanan: <b>".$request['layanan']."</b>  \n No HP Pelapor: <b>".$nohp."</b> \n\n Link: https://bit.ly/transmedikrsjd");
            $ch = curl_init();
            $optArray = array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true
            );
            curl_setopt_array($ch, $optArray);
            $result = curl_exec($ch);
            curl_close($ch);

            $transStatus = 'true';
//        } catch (\Exception $e) {
//            $transStatus = 'false';
//        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getDaftarPermohonanRumahTangga(Request $request){
        $dataLogin = $request->all();
        
        $tgl="";
        $jenisKerusakan="";
        $idRuangan="";
        $idPegawai="";

        if ((isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") && (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined"))
        {
            $tgl = "AND stp.tglplanning BETWEEN '".$request['tglAwal']."' AND '".$request['tglAkhir']."' ";
        }

        if (isset($request['jenisKerusakan']) && $request['jenisKerusakan'] != "" && $request['jenisKerusakan'] != "undefined")
        {
            $jenisKerusakan = "AND stp.objectjenispekerjaanfk = '".$request['jenisKerusakan']."' ";
        }

        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined")
        {
            $idRuangan = "AND stp.objectruanganfk = '".$request['idRuangan']."' ";
        }
        if (isset($request['idPegawai']) && $request['idPegawai'] != "" && $request['idPegawai'] != "undefined")
        {
            $idPegawai = "OR stp.objectpegawaipjawabfk = ".$request['idPegawai'].") ";
        }


        $data = DB::select(DB::raw("
        SELECT stp.norec, rg.namaruangan, stp.tglplanning, pg.nama, stp.startdate, stp.duedate, stp.rincianexecuteplanning_askep, stp.pelapor, stp.deskripsiplanning, stp.keteranganverifikasi, sttp.namaexternal,stp.signdate, jpk.reportdisplay, stp.worklist, stp.keteranganverifikasi, pg2.nama as namainspektor, pg3.nama as namapelapor,
                sttp.reportdisplay as statuspekerjaan
            FROM strukplanning_t as stp
            INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk
            LEFT JOIN pegawai_m as pg on pg.id = stp.objectpegawaipjawabfk
            LEFT JOIN pegawai_m as pg2 on pg2.id = stp.objectpegawaipjawabevaluasifk
            LEFT JOIN pegawai_m as pg3 on pg3.id = stp.narasumberfk 
            LEFT JOIN statuspekerjaan_m as sttp on sttp.id = stp.objectstatuspekerjaanfk
			LEFT JOIN jenispekerjaan_m as jpk on jpk.id = stp.objectjenispekerjaanfk
			WHERE stp.objectkelompoktransaksifk=161
			AND stp.statusenabled=1 
			$tgl
			$jenisKerusakan
            $idRuangan
            $idPegawai
            ORDER BY stp.tglplanning DESC"));

        return $this->respond($data);

    }

    public function HapusPermohonanRumahTangga(Request $request){
        DB::beginTransaction();
        try {
            StrukPlanning::where('norec', $request['norec'])->update(
                ['statusenabled' => false]
            );
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'dy@epic',
            );
        } else {
            $transMessage = " Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function SaveDataJenisLayananRumahTangga(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
            if ($request['norec'] == ''){
                $newCOA = new StrukPlanning();
                $norecHead = $newCOA->generateNewId();
                $newCOA->kdprofile = 1;
                $newCOA->norec = $norecHead;
                $newCOA->statusenabled = 1;
            }else{

                $newCOA =  StrukPlanning::where('norec',$request['norec'])->first();
            }
            $newCOA->objectjenispekerjaanfk = $request['jenisKerusakan'];
            $newCOA->save();

            $norecHead2 = $newCOA->norec;

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "";


        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil" ;
            DB::commit();
            $result = array(
                "status" => 201,
//                "data" => $newPJT,
                "dy" => 'dy@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "data" => $newPJT,
                "dy" => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getStatusPekerjaanRumahTangga(Request $request){
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM statuspekerjaan_m
			WHERE kodeexternal = 'Rumah Tangga'"));

        return $this->respond($data);

    }
}