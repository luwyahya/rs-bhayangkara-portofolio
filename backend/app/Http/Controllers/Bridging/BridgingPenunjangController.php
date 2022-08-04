<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 9/5/2019
 * Time: 1:44 PM
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\HargaNettoProdukByKelas1;
use App\Master\JenisPetugasPelaksana;
use App\Master\Produk;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\HasilPemeriksaan;
use App\Transaksi\LisOrder;
use App\Transaksi\LisOrderTmp;
use App\Transaksi\LoggingUser;
use App\Transaksi\OrderLab;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDelete;
use App\Transaksi\PelayananPasienDetail;

use App\Transaksi\PelayananPasienPetugas;

use App\Transaksi\RisOrder;
use App\Transaksi\StrukHasilPemeriksaan;
use App\Transaksi\VansLab;
use Illuminate\Http\Request;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\OrderProduk;
use App\Master\Pegawai;
use App\Master\Pasien;
use App\Traits\Valet;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;
class BridgingPenunjangController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function saveBridgingSysmex(Request $request) {

        DB::beginTransaction();
        $noorder = $request['noorder'];

        $raw = DB::select(DB::raw("select op.norec, 
		     op.iscito as cito,  op.tglpelayanan, prd.id as produkid ,  prd.namaproduk,
             ps.nocm,  so.noorderintern, so.noorder as noorder, ps.namapasien,  ps.tgllahir,  jk.jeniskelamin, 
             alm.alamatlengkap, ru.id as ruanganid, ru.namaruangan, 
             case when alm.alamatlengkap is null then '' else alm.alamatlengkap end as alamat, 
             case when ds.namadesakelurahan is null then '' else ds.namadesakelurahan end as kelurahan, 
             case when kc.namakecamatan is null then '' else kc.namakecamatan end as kecamatan, 
             case when kk.namakotakabupaten is null then '' else kk.namakotakabupaten end as kota,    
             pd.noregistrasi, pg.id as pgid,pg.namalengkap,
             dp.id as departemenid  ,lis.id as lisorderid
             FROM orderpelayanan_t as op
			 left join produk_m as prd on prd.id=op.objectprodukfk
			 left join strukorder_t as so on so.norec=op.strukorderfk
			 left join pasien_m as ps on ps.id =so.nocmfk
			 left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk 
			 left join alamat_m as alm on alm.nocmfk=ps.id
			 left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
			 left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
			 left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
			 left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
			 left join ruangan_m as ru on ru.id=pd.objectruanganlastfk
			 left join pegawai_m as pg on pg.id=op.objectnamapenyerahbarangfk
			 left join departemen_m as dp on dp.id=ru.objectdepartemenfk
			 left join lisorder as lis on lis.ono=so.noorder
			 where 
			 so.noorder= '$noorder' "));

        $loopProduk=[];
        $sama=false;
        foreach ($request['bridging'] as $dataA) {
            $i=0;
            $sama=false;
            foreach ($loopProduk as $hideung){
//                if ($dataA->noorder != null){
                $sama=true;
                $loopProduk[$i]['produkid']=$loopProduk[$i]['produkid']. '~'.($dataA['produkid']);
//                }
                $i=$i+1;
            }
            if ($sama==false){
                $loopProduk[]=array(
                    'produkid'=>$dataA['produkid'],
                );
            }
        }

//            try {
        if (is_null($raw[0]->lisorderid)) {
            $newBRG = new LisOrder();
            $newId = LisOrder::max('id');
            $newId = $newId + 1;
            $newBRG->id = $newId;
        }else {
            $newBRG = LisOrder::where('id',$raw[0]->lisorderid)->first();
        }
        $newBRG->address1 = (string) $raw[0]->alamat . ',' . (string)$raw[0]->kelurahan ;
        $newBRG->address2 = (string) $raw[0]->kecamatan . ',' . (string)$raw[0]->kota;
        $newBRG->address3 = '';
        $newBRG->address4 = '';
        $newBRG->birth_dt = (string)date('YmdHis',strtotime($raw[0]->tgllahir));
//                $newBRG->clinician = (string) $raw[0]->pgid . '^' . $raw[0]->namalengkap ;
        $newBRG->clinician = (string) $request['iddokterorder'] . '^' . $request['namadokterorder'] ;
        $newBRG->comment = '';
        $newBRG->flag = 0;
        $newBRG->message_dt =(string)date('YmdHis');
        $newBRG->ono = $raw[0]->noorderintern ;
        /*
         * NW : Transaksi baru RP : Update transaksi CA : Batal Transaksi
         */
        $newBRG->order_control = 'NW';
        $newBRG->order_testid = $loopProduk[0]['produkid']; //produkid
        $newBRG->pname = $raw[0]->namapasien;
        /*
         * - IN : Rawat inap - OP : Rawat jalan
         */
        if ($raw[0]->departemenid == 16 ) {
            $pType = 'IN';
        } else {
            $pType = 'OP';
        }
        $newBRG->ptype = $pType;
        $newBRG->pid = $raw[0]->nocm;
        /*- R : Rutin
        - U : Cito	*/
        if ($raw[0]->cito == '1') {
            $priority = 'U';
        } else {
            $priority = 'R';
        }
        $newBRG->priority = $priority;
        $newBRG->request_dt = (string)date('YmdHis'); //tglpelayanan
        $newBRG->room_no = '';
        /*
         * - 1 : Laki-laki - 2 : Perempuan - 0 : Tidak diketahui
         */
        if ($raw[0]->jeniskelamin == 'Laki-laki'){
            $jk = '1';
        }else if($raw[0]->jeniskelamin == 'Perempuan'){
            $jk = '2';
        }else{
            $jk = '0';
        }

        $newBRG->sex = $jk;
        $newBRG->source = (string)$raw[0]->ruanganid .'^'.$raw[0]->namaruangan ;
        $newBRG->visitno = $raw[0]->noregistrasi;

        $newBRG->save();

        /* save ke TMP juga
        */
        if (is_null($raw[0]->lisorderid)) {
            $newBRGTmp = new LisOrderTmp();
            $newIds = LisOrderTmp::max('id');
            $newIds = $newIds + 1;
            $newBRGTmp->id = $newIds;
        }else{
            $newBRG = LisOrderTmp::where('ono',$raw[0]->noorder)->first();
        }
        $newBRGTmp->address1 = (string) $raw[0]->alamat . ',' . (string)$raw[0]->kelurahan ;
        $newBRGTmp->address2 = (string) $raw[0]->kecamatan . ',' . (string)$raw[0]->kota;
        $newBRGTmp->address3 = '';
        $newBRGTmp->address4 = '';
        $newBRGTmp->birth_dt = (string)date('YmdHis',strtotime($raw[0]->tgllahir));
        $newBRGTmp->clinician = (string) $request['iddokterorder'] . '^' . $request['namadokterorder'] ;
//                $newBRGTmp->clinician = (string) $raw[0]->pgid . '^' . $raw[0]->namalengkap ;
        $newBRGTmp->comment = '';
        $newBRGTmp->flag = 0;
        $newBRGTmp->message_dt =(string)date('YmdHis');
        $newBRGTmp->ono = $raw[0]->noorderintern ;
        $newBRGTmp->order_control = 'NW';
        $newBRGTmp->order_testid = $loopProduk[0]['produkid']; //produkid
        $newBRGTmp->pname = $raw[0]->namapasien;
        $newBRGTmp->ptype = $pType;
        $newBRGTmp->pid = $raw[0]->nocm;
        $newBRGTmp->priority = $priority;
        $newBRGTmp->request_dt = (string)date('YmdHis'); //tglpelayanan
        $newBRGTmp->room_no = '';
        $newBRGTmp->sex = $jk;
        $newBRGTmp->source = (string)$raw[0]->ruanganid .'^'.$raw[0]->namaruangan ;
        $newBRGTmp->visitno = $raw[0]->noregistrasi;

        $newBRGTmp->save();


        $transStatus = 'true';
//            } catch (\Exception $e) {
//                $transStatus = 'false';
//                $transMessage = "Simpan Bridging";
//            }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Bridging Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "sysmex" => $newBRG,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Bridging Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "sysmex" => $newBRG,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//        return $this->respond($noorder);
    }
    public function saveBridgingZeta(Request $request)
    {
        $dataLogin =$request->all();

        DB::beginTransaction();
        $noorder = $request['noorder'];

        try {
            StrukOrder::where('noorder',$noorder)->update(
                [
                    'statusorder' => 1
                ]
            );
            $raw = DB::select(DB::raw("select op.norec, 
		     op.iscito as cito,  op.tglpelayanan, prd.id as produkid ,  prd.namaproduk,
             ps.nocm,  so.noorderintern, so.noorder as noorder, ps.namapasien,  ps.tgllahir,  jk.jeniskelamin, 
             alm.alamatlengkap, ru.id as ruanganid, ru.namaruangan, pd.noregistrasi,
         
             pd.noregistrasi, pg.id as pgid,pg.namalengkap,
             dp.id as departemenid ,prd.objectdetailjenisprodukfk,
			 djp.detailjenisproduk,djp.kodeexternal as kodeexternaldjp ,djp.objectjenisprodukfk,
			 jp.jenisproduk,jp.namaexternal as namaexternaljp,kps.kelompokpasien,so.tglorder,
			 gdr.golongandarah,ris.order_key
             FROM orderpelayanan_t as op
			 left join produk_m as prd on prd.id=op.objectprodukfk
			 left join detailjenisproduk_m as djp on djp.id=prd.objectdetailjenisprodukfk
             left join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk
			 left join strukorder_t as so on so.norec=op.strukorderfk
			 left join pasien_m as ps on ps.id =so.nocmfk
			 left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk 
			 left join alamat_m as alm on alm.nocmfk=ps.id

			 left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
			 left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk
			 left join ruangan_m as ru on ru.id=pd.objectruanganlastfk
			 left join pegawai_m as pg on pg.id=so.objectpegawaiorderfk
			 left join departemen_m as dp on dp.id=ru.objectdepartemenfk
			 left join golongandarah_m as gdr on gdr.id=ps.objectgolongandarahfk
			 left join ris_order as ris on ris.order_no=so.noorder  and ris.order_code= op.objectprodukfk 
			 where so.noorder = '$noorder' "));

//            try {
            foreach ($raw as $item) {
                $getAccNumber = $this->getAccNumber($item->kodeexternaldjp , $item->namaexternaljp);



                if($item->namaexternaljp == null){
                    $modality = null;
//                    return $this->setStatusCode(400)->respond('', 'Kode External Bridging Produk '.$item->namaproduk. ' Kosong');
                }else{
                    $modality = str_limit($item->namaexternaljp, 5);
                }

//                    if (is_null($item->order_key)) {
                $newBRG = new RisOrder();

                $newId = RisOrder::max('order_key');
                $newId = $newId + 1;
                $newBRG->order_key = $newId;
//                    }else{
//                        $newBRG = RisOrder::where('order_key',$item->order_key)->first();
//                    }
                $newBRG->accession_num = $getAccNumber;
                $newBRG->aetitle = '-';
                $newBRG->charge_doc_id = $request['iddokterverif']; //dokter rad
                $newBRG->charge_doc_name =  $request['namadokterverif']; //dokter rad
                $newBRG->consult_doc_id =  $item->pgid;
                $newBRG->consult_doc_name =  $item->namalengkap ;
                $newBRG->create_date = (string)date('YmdHi');
                $newBRG->extension1 = $item->noregistrasi;
                /*
               * if JenisDiagnosa==1 : isi namadiagnosa ke extension2 & extension4
               */
                $newBRG->extension2 = '-';
                $newBRG->extension4 = '-';
                /*
               * if JenisDiagnosa==2 : isi namadiagnosa ke eextension3
               */
                $newBRG->extension3 = '-';
                $newBRG->extension5 = $item->kelompokpasien;
                $newBRG->extension6 = $dataLogin['userData']['id'];
                $newBRG->extension7 = '-';
                $newBRG->extension8 = '-';
                $newBRG->extension9 = '-';
                $newBRG->extension10 = '-';
                //            $newBRG->first_name = '';
                $newBRG->flag = 'Y';
                $newBRG->group1 = '-';
                $newBRG->group2 = '-';
                $newBRG->group3 = '-';
                /*
                * - 18 : R. Jalan - 16 : R. Inap
                */
                if ($raw[0]->departemenid == 18) {
                    $io_date = 'O';
                } else{
                    $io_date = 'I';
                }
                $newBRG->io_date = $io_date;
                //            $newBRG->last_name = '';
                $newBRG->middle_name = '-';
                $newBRG->order_bodypart = '-';
                $newBRG->order_cnt = 0;
                $newBRG->order_code = $item->produkid;
                $newBRG->order_comment = '-';
                $newBRG->order_date = (string)date('YmdHi',strtotime($item->tglorder));;
                $newBRG->order_dept = $request['objectruangantujuanfk'];
                //            $newBRG->order_diag = $item->namaexternaljp;

                $newBRG->order_modality = $modality;
                $newBRG->order_name = $item->namaproduk;
                $newBRG->order_no = $request['noorder'];
                $newBRG->order_reason ='-';
                $newBRG->order_status = 'NW';
                $newBRG->patient_birth_date = (string)date('Ymd',strtotime($item->tgllahir));
                $newBRG->patient_blood = $item->golongandarah;
                $newBRG->patient_id = $item->nocm;
                /*- E: Cito
                  -	*/
                if ($item->cito == '1') {
                    $patient_io = 'E';
                } else {
                    $patient_io = 'I';
                }
                $newBRG->patient_io = $patient_io;
                $newBRG->patient_name = $item->namapasien;
                /*
                   * - M : Laki-laki - F : Perempuan - O : Tidak diketahui
                   */
                if ($item->jeniskelamin == 'Laki-laki'){
                    $jk = 'M';
                }else if($item->jeniskelamin == 'Perempuan'){
                    $jk = 'F';
                }else{
                    $jk = 'O';
                }
                $newBRG->patient_sex = $jk;
                $newBRG->patient_uid = '-';
                $newBRG->patient_ward = $item->namaruangan;
                $newBRG->study_remark = '-';
                $newBRG->study_reserv_date = (string)date('YmdHi',strtotime($item->tglpelayanan));
                $newBRG->kelas = $request['objectkelasfk'];

                $newBRG->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Bridging Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "zeta" => $newBRG,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Bridging Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                // "zeta" => $newBRG,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//            return $this->respond($getAccNumber);
    }
    public function getAccNumber($kdExternal, $namaExternal)
    {
        $kode='';
        if($namaExternal == null){
            $kode="5";
        }
        else if($namaExternal== "CR"){
            if($kdExternal == "1") {
                $kode="1";
            } else {
                $kode="2";
            }
        }else if ($namaExternal == "US"){
            $kode="3";
        }else if ($namaExternal == "CT"){
            $kode="4";
        }else if ($namaExternal == "MR"){
            $kode="5";
        }else{
            $kode="5";
        }

        if (!empty($kode)){
            $month=(string)date('m');
            $year=(string)date('Y');
            $accessNum = DB::select(DB::raw("select max(a.accession_num) as max
                            from ris_order a where 
                            substring(a.accession_num, 1, 1)= '$kode' and 
                            substring(a.create_date, 5, 2) = '$month' and 
                            substring(a.create_date, 1, 4)= '$year'"));

            if($accessNum[0]!= null){
                $accessNum=$accessNum[0]->max;
                $yearNow=(string)date('y');

                $digit = null;
                $number = null;
                if(!empty($accessNum)) {
                    $number =  (substr($accessNum, 5))+1;
                } else {
                    $number = 1;
                }

                if(strlen($number) == 1){
                    $digit="000";
                }
                else if(strlen($number) == 2){
                    $digit="00";
                }
                else if(strlen($number) == 3){
                    $digit="0";
                }
                if(strlen($month) == 1)
                    $month = "0".$month;

                if($kode == "1") {
                    $noUsulan = "1" . $yearNow . $month . $digit . $number;
                } else if($kode =="2") {
                    $noUsulan = "2" . $yearNow . $month . $digit . $number;
                } else if($kode =="3") {
                    $noUsulan = "3" . $yearNow . $month . $digit . $number;
                } else if($kode == "4") {
                    $noUsulan = "4" . $yearNow . $month . $digit . $number;
                } else if($kode == "5") {
                    $noUsulan = "5" . $yearNow . $month . $digit . $number;
                }
            }

        }

        return $noUsulan;
    }
    public function saveBridgingVansLab(Request $request) {

        DB::beginTransaction();
        $noorder = $request['noorder'];

        $raw = DB::select(DB::raw("SELECT
                        op.norec,
                        op.iscito AS cito,
                        so.tglorder,
                        to_char(so.tglorder, 'HH:mm') AS jamorder,
                        prd.id AS produkid,
                        prd.namaproduk,
                        ps.nocm,
                        so.noorder AS noorder,
                        ps.namapasien,
                        ps.tgllahir,
                        jk.id as jkid,
                        jk.jeniskelamin,
                        alm.alamatlengkap,
                        ru.id AS ruanganid,
                        ru.namaruangan,
                        pd.noregistrasi,
                        pg.id AS pgid,
                        pg.namalengkap,
                        dp.id AS departemenid,
                        lis.no_lab AS lisorderid,
                        EXTRACT(year from AGE(CURRENT_DATE, ps.tgllahir)) AS usia,
                        kp.id AS kode_cara_bayar,
                        kp.kelompokpasien AS cara_bayar,
                        ru2.id as ideuangantujuan,ru2.namaruangan as ruangantujuan,
                        CASE WHEN pd.objectdokterpemeriksafk::char = null THEN '-' ELSE pg2.id::char END AS iddpjp,
                        CASE WHEN pd.objectdokterpemeriksafk::char = null THEN '-' ELSE pg2.namalengkap END AS namadpjp
                    FROM
                        orderpelayanan_t AS op
                    INNER JOIN produk_m AS prd ON prd.id = op.objectprodukfk
                    INNER JOIN strukorder_t AS so ON so.norec = op.strukorderfk
                    INNER JOIN pasien_m AS ps ON ps.id = so.nocmfk
                    INNER JOIN pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk
                    INNER JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                    INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                    INNER JOIN ruangan_m AS ru2 ON ru2.id = so.objectruangantujuanfk
                    LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                    LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                    LEFT JOIN pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk
                    LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                    LEFT JOIN order_lab AS lis ON lis.no_lab = so.noorder
                    LEFT JOIN pegawai_m AS pg2 ON pg2.id = pd.objectdokterpemeriksafk
                    WHERE
                        so.noorder = '$noorder'
                                "));
        try {


            StrukOrder::where('noorder',$noorder)->update(
                [
                    'statusorder' => 1
                ]
            );

            foreach($raw as $item ){
                if ($item->jkid == 1){
                    $jk = 'L';
                }else if($item->jkid == 2){
                    $jk = 'P';
                }
                if ($item->cito == '1') {
                    $priority = 'U';
                } else {
                    $priority = 'R';
                }
                $deptRanap = explode (',',$this->settingDataFixed('kdDepartemenRanapFix'));
                $jenisRawat = '';
                foreach ($deptRanap as $itemRanap){
                    if((int)$itemRanap == $item->departemenid){
                        $jenisRawat = 'RI';
                        break;
                    }else{
                        $jenisRawat = 'RJ';
                        break;
                    }
                }
                $harga =  HargaNettoProdukByKelas1::where('objectprodukfk',$item->produkid)
                    ->where('objectkelasfk',6)
                    ->where('statusenabled',true)
                    ->first();
//                return $harga;
                $newBRG = new OrderLab();
                $newBRG->asal_lab = 'L'.$jenisRawat;
                $newBRG->no_lab = $item->noorder;
                $newBRG->no_registrasi = $item->noregistrasi;
                $newBRG->nama_pas = $item->namapasien;
                $newBRG->no_rm = $item->nocm;
                $newBRG->tgl_order = $item->tglorder;
                $newBRG->jam_order = $item->jamorder;
                $newBRG->jenis_kel = $jk;
                $newBRG->tgl_lahir = $item->tgllahir;
                $newBRG->usia = $item->usia;
                $newBRG->alamat = $item->alamatlengkap;
                $newBRG->kode_dok_kirim = $item->iddpjp; //$item->pgid;//$request['iddokterverif'];//$request['iddokterorder'];
                $newBRG->nama_dok_kirim = $item->namadpjp; //$item->namalengkap;//$request['namadokterverif'];//  $request['namadokterorder'];
                $newBRG->kode_ruang = $item->ruanganid;
                $newBRG->nama_ruang = $item->namaruangan;
                $newBRG->kode_cara_bayar = $item->kode_cara_bayar;
                $newBRG->cara_bayar = $item->cara_bayar;
                $newBRG->ket_klinis = '';

                $produk= Produk::where('statusenabled',true)
                    ->where('id',$item->produkid)
                    ->first();

                $newBRG->kode_test = $produk->kodeexternal != 'SOLO' && $produk->kodeexternal != 'LAB PAKET'  ? $produk->kodeexternal : $item->produkid;
                $newBRG->nama_test = $item->namaproduk;
                $newBRG->waktu_kirim = date('Y-m-d H:i:s');
                $newBRG->jns_rawat = $jenisRawat;
                $newBRG->dok_jaga = $item->pgid;
                $newBRG->prioritas = $item->cito;
                $newBRG->hargasatuan = (float)$harga->hargasatuan;
//                $newBRG->status = $item->id;
                $newBRG->norec = $newBRG->generateNewId();
                $newBRG->save();
            }


            $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
            }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $newBRG,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Gagal Menyimpan Data";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "sysmex" => $newBRG,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


}