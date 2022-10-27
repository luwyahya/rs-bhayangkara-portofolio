<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 12/2/2019
 * Time: 9:52 PM
 */

namespace App\Http\Controllers\IPSRS;

use App\Http\Controllers\ApiController;
use App\Notifications\MerryChristmas;
use App\Traits\Valet;

use Illuminate\Http\Request;
use App\Transaksi\StrukPlanning;
use DB;
use Nexmo\Laravel\Facade\Nexmo;
use Nexmo\Notifications\WhatsApp;
use NotificationChannels\ChatAPI\ChatAPI;
use NotificationChannels\ChatAPI\ChatAPIMessage;
use Twilio\Rest\Client;
class IPSRSController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDaftarIPSRS(Request $request){
        $dataLogin = $request->all();
        $tgl="";
        $jenisalat="";
        $idRuangan="";
        $idPegawai ='';

        if ((isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") && (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined"))
        {
            $tgl = "AND stp.tglplanning BETWEEN '".$request['tglAwal']."' AND '".$request['tglAkhir']."' ";
        }

        if (isset($request['jenisalat']) && $request['jenisalat'] != "" && $request['jenisalat'] != "undefined")
        {
            $jenisalat = "AND stp.objectjenisalatfk = '".$request['jenisalat']."' ";
        }

        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined")
        {
            $idRuangan = "AND (stp.objectruanganfk in (".$request['idRuangan'].") ";
        }

        if (isset($request['idPegawai']) && $request['idPegawai'] != "" && $request['idPegawai'] != "undefined")
        {
            $idPegawai = "OR stp.objectpegawaipjawabfk = ".$request['idPegawai'].") ";
        }

        $data = DB::select(DB::raw("
        SELECT stp.norec, rg.namaruangan, stp.tglplanning, pg.nama, stp.startdate, stp.duedate, stp.rincianexecuteplanning_askep, stp.pelapor, stp.deskripsiplanning, stp.keteranganverifikasi, sttp.namaexternal,stp.signdate, stp.worklist, stp.keteranganverifikasi, pg2.nama as namainspektor, pg3.nama as namapelapor,
                sttp.reportdisplay as statuspekerjaan, jpk.reportdisplay as jeniskerusakan, jpk2.reportdisplay as jenisalat,stp.nomerlaporan, stp.listpegawai
            FROM strukplanning_t as stp
            INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk
            LEFT JOIN pegawai_m as pg on pg.id = stp.objectpegawaipjawabfk
            LEFT JOIN pegawai_m as pg2 on pg2.id = stp.objectpegawaipjawabevaluasifk
            LEFT JOIN pegawai_m as pg3 on pg3.id = stp.narasumberfk 
            LEFT JOIN statuspekerjaan_m as sttp on sttp.id = stp.objectstatuspekerjaanfk
			LEFT JOIN jenispekerjaan_m as jpk on jpk.id = stp.objectjenispekerjaanfk
			LEFT JOIN jenispekerjaan_m as jpk2 on jpk2.id = stp.objectjenisalatfk
			WHERE stp.objectkelompoktransaksifk=122
			AND stp.statusenabled = true 
			$tgl
			$jenisalat
			$idRuangan
			$idPegawai
            ORDER BY stp.tglplanning DESC"));

        return $this->respond($data);

//        $arrru = $request['arrru'];
//
//        $data= \DB::table('strukplanning_t as spl')
//            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'spl.objectruanganfk')
//            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'spl.objectpegawaipjawabfk')
//            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'spl.objectpegawaipjawabevaluasifk')
//            ->select('ru.namaruangan',
//                'spl.tglplanning','spl.objectpegawaipjawabfk','spl.startdate','spl.duedate','spl.deskripsiplanning',
//                'spl.objectpegawaipjawabevaluasifk','spl.keteranganverifikasi','spl.norec'
//                ,'pg.namalengkap','pg2.namalengkap as pegawaipj','spl.pelapor','spl.rincianexecuteplanning_askep as rincian'
//            )
////            ->whereIn('ru.objectdepartemenfk',array($arrru))
////            ->where('ru.statusenabled',true)
//            ->where('spl.objectkelompoktransaksifk',122);
//
//        if(isset($request['desc']) && $request['desc']!="" && $request['desc']!="undefined"){
//            $data = $data->where('ru.rincianexecuteplanning_askep','like','%'. $request['desc'] .'%');
//        };
//        if (isset($request['manage']) && $request['manage'] != "" && $request['manage'] != "undefined") {
////            $data = $data->where('spl.tglplanning','>', date('Y-m-d 00:00:00'));
//            $data = $data->whereNull('spl.objectpegawaipjawabfk');
//            $data = $data->whereNull('spl.objectpegawaipjawabevaluasifk');
//        }else{
//            $data = $data->whereNotNull('spl.objectpegawaipjawabfk');
//            $data = $data->whereNotNull('spl.objectpegawaipjawabevaluasifk');
//        }
//        $data = $data->whereBetween('spl.tglplanning', [ $request['tglAwal'],$request['tglAkhir'] ]);
//        $data = $data->get();
//
//
//        return $this->respond($data);
    }
    public function SavePermohonan(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();

        try {
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
            $newCOA->objectkelompoktransaksifk = 122;
            $newCOA->rincianexecuteplanning_askep = $request['rincian'];
            $newCOA->narasumberfk = $request['pelapor'];
            $newCOA->objectjenisalatfk = $request['jenisKerusakan'];
            $newCOA->tempat = 'IPSRS';
            $newCOA->nohppelapor = $nohp;
            $newCOA->save();

            // $norecHead2 = $newCOA->norec;

            // $sid    = "ACc6ac08ce1cc9096e0fd57a0c38801118";
            // $token  = "cada716b5a36721fd86832662bbd06fe";
            // $twilio = new Client($sid, $token);
            // $array =[
            //     "whatsapp:+6282110191673",
            //     "whatsapp:+6282211333013",
            //     "whatsapp:+6283838339887",
            //     "whatsapp:+6281649111417",
            //     "whatsapp:+628975067661",
            //     "whatsapp:+6281228566017",
            //     "whatsapp:+628179477786",
            //     "whatsapp:+6281227201398",
            //     "whatsapp:+6285725001919",
            //     "whatsapp:+6285728315115",
            //     "whatsapp:+6285647501891",
            //     "whatsapp:+6281226244357",
            //     "whatsapp:+6285655794928",
            //     "whatsapp:+62816676375",
            //     "whatsapp:+6285702501576",
            //     "whatsapp:+6281283757854",
            //     "whatsapp:+628562982228"
            // ];
            // $i = 0;
            // foreach ($array as $arr){
            //     $message = $twilio->messages
            //         ->create($array[$i], // to
            //             array(
            //                 "from" => "whatsapp:+14155238886",
            //                 "body" => "Permohonan Baru IPSRS dari ruangan ".$request['namaruangan']." oleh ".$request['namapelapor']." : ".$request['rincian'].". Link: https://bit.ly/3dxT1YS"
            //             )
            //         );
            //     $i = $i+1;
            // }


            $secret_token = "1298249516:AAEJsI61Wt23U6OO6z2rCF4dI8ifApQ0pTY";
            $telegram_id = '-1001330810883';
            $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $telegram_id;
            $url = $url . "&text=" . urlencode("Laporan Baru: <b>IPSRS</b> \n\n Ruangan: <b>".$request['namaruangan']."</b>  \n Pelapor: <b>".$request['namapelapor']."</b>  \n Laporan: <b>".$request['rincian']."</b> \n Jenis Alat: <b>".$request['jenisAlat']."</b>  \n No HP Pelapor: <b>".$nohp."</b> \n\n https://bit.ly/transmedikrsjd");
            $ch = curl_init();
            $optArray = array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true
            );
            curl_setopt_array($ch, $optArray);
            $result = curl_exec($ch);
            curl_close($ch);
            //echo $result;


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
            $newCOA->listpegawai = $request['listAlokasiStaff'];
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

    public function SaveDataIdentifikasi(Request $request) {
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
            $newCOA->keteranganverifikasi = $request['identifikasi'];
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

    public function SaveDataJenisKerusakan(Request $request) {
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

    public function getJenisPekerjaan(Request $request){
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM jenispekerjaan_m
			WHERE jenispekerjaan='IPSRS' AND namaexternal='Status Jenis'"));

        return $this->respond($data);

    }

    public function getStatusPekerjaan(Request $request){
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM statuspekerjaan_m
			WHERE kodeexternal = 'IPSRS'"));

        return $this->respond($data);

    }

    public function SaveDataStatus(Request $request) {
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
            $newCOA->objectstatuspekerjaanfk = $request['objectstatuspekerjaanfk'];
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
    public function sendNotifWhatsapp(Request $request)
    {
        //https://www.twilio.com/console/sms/whatsapp/sandbox
        //composer require twilio/sdk
        $sid    = "ACc6ac08ce1cc9096e0fd57a0c38801118";
        $token  = "cada716b5a36721fd86832662bbd06fe";
        $twilio = new Client($sid, $token);
        $array =[
            "whatsapp:+6282110191673",
            "whatsapp:+6282211333013",
            "whatsapp:+6285702501576",
            "whatsapp:+6283838339887",
            "whatsapp:+6281649111417",
            ];
        $i = 0;
        foreach ($array as $arr){
            $message = $twilio->messages
                ->create($array[$i], // to
                    array(
                        "from" => "whatsapp:+14155238886",
                        "body" => "Brisik woy!!! "
                    )
                );
           $i = $i+1;
        }
        $result = array(
           'respond' => 'success',
           'as' => 'er@epic'
        );
        return $this->respond($result);

    }

    public function getJenisAlat(Request $request){
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("
        SELECT *
            FROM jenispekerjaan_m
			WHERE jenispekerjaan='IPSRS' AND namaexternal='Jenis Alat'"));

        return $this->respond($data);

    }

    public function SaveDataJenisAlat(Request $request) {
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
            $newCOA->objectjenisalatfk = $request['jenisAlat'];
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

    public function HapusPermohonanIPSRS(Request $request){
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

    public function SaveDataNomorHasilPekerjaan(Request $request) {
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
            $newCOA->nomerlaporan = $request['nomerlaporan'];
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
                "data" => $norecHead2,
                "dy" => 'ea@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $norecHead2,
                "dy" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

}