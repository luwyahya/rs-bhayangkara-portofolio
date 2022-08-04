<?php
/**
 * Created by PhpStorm.
 * User: Sany
 * Date: 11/28/2017
 * Time: 8:35 PM
 */

namespace App\Http\Controllers\SysAdmin\Master;
use App\Http\Controllers\ApiController;
use App\Master\MapKelompokPasientoPenjamin;
use App\Master\Rekanan;
use App\Master\SettingDataFixed;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Traits\CrudMaster;
use App\Traits\Valet;

use App\Master\ChartOfAccount;
use DB;
use App\Traits\Dev\Designation;
use Date;

class SettingDataFixedController extends ApiController
{
    use CrudMaster;
    use Designation;
    use Valet;

    public function __construct() {
        parent::__construct($skip_authentication=true);
    }

    public function getDataFixed(Request $request) {

        $dataDataFixed = \DB::table('settingdatafixed_m as sf')
            ->select('sf.id', 'sf.keteranganfungsi','sf.namafield' ,'sf.nilaifield', 'sf.tabelrelasi',
                'sf.typefield','sf.statusenabled')
//            ->where('sf.statusenabled',true)
            ->orderBy('sf.id','desc')
            ->take(50);

        if (isset($request['idDataFixed']) && $request['idDataFixed'] != "" && $request['idDataFixed'] != "undefined") {
            $dataDataFixed = $dataDataFixed->where('sf.id', '=', $request['idDataFixed']);
        }
        if (isset($request['ketFungsi']) && $request['ketFungsi'] != "" && $request['ketFungsi'] != "undefined") {
            $dataDataFixed = $dataDataFixed->where('sf.keteranganfungsi', 'like', '%'. $request['ketFungsi'].'%');
        }
        if (isset($request['namaFild']) && $request['namaFild'] != "" && $request['namaFild'] != "undefined") {
            $dataDataFixed = $dataDataFixed->where('sf.namafield', 'like','%'. $request['namaFild'].'%');
        }
        if (isset($request['nilaiField']) && $request['nilaiField'] != "" && $request['nilaiField'] != "undefined") {
            $dataDataFixed = $dataDataFixed->where('sf.nilaifield', 'like','%'. $request['nilaiField'].'%');
        }

        $dataDataFixed  =$dataDataFixed -> get();
        $result = array(
            'settingdatafixed' => $dataDataFixed,
            'message' => 'Hidayat',
        );

        return $this->respond($result);
    }



    public function getSettingById($id){
//        $data = \DB::table('setting as rek')
//            ->select('rek.*','jr.jenisrekanan','mp.id as idmap','mp.objectkelompokpasienfk')
//            ->where('rek.id','=',$id)
//            ->get();

        $datas= DB::select(DB::raw("select * from settingdatafixed_m
              where id='$id'
              and statusenabled=true"));

        return $this->respond($datas);
    }

    public function SaveSettingDataFixed(Request $request) {

        DB::beginTransaction();

        $idDataFixed = SettingDataFixed::max('id');
        $idDataFixed = $idDataFixed + 1;

        if ($request['datafixed']['iddatafixed']==''){
            $newDF = new SettingDataFixed();
            $newDF->id = $idDataFixed;
            $newDF->norec = $idDataFixed;
            $newDF->kodeexternal = $idDataFixed;
        }else{
            $newDF =  SettingDataFixed::where('id',$request['datafixed']['iddatafixed'])->first();
        }
        $newDF->kdprofile = 0;
        $newDF->statusenabled = true;
        $newDF->kodeexternal = str_limit( $request['datafixed']['kodeexternal'],10);
        $newDF->namaexternal = $request['datafixed']['namaexternal'];
        $newDF->reportdisplay = $request['datafixed']['reportdisplay'];
        $newDF->fieldkeytabelrelasi = $request['datafixed']['fieldkeytabelrelasi'];
        $newDF->fieldreportdisplaytabelrelasi = $request['datafixed']['fieldreportdisplaytabelrelasi'];
        $newDF->keteranganfungsi = $request['datafixed']['keteranganfungsi'];
        $newDF->namafield = $request['datafixed']['namafield'];
        $newDF->nilaifield = $request['datafixed']['nilai'];
        $newDF->tabelrelasi = $request['datafixed']['tabelrelasi'];
        $newDF->typefield = $request['datafixed']['typefield'];
        if(isset($request['datafixed']['kelompok'])){
            $newDF->kelompok = $request['datafixed']['kelompok'];
        }
        try {
            $newDF->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Data Fixed Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "result" => $newDF,//$noResep,,//$noResep,
                "as" => 'uhman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "SaveSettingDataFixed" => $newDF,//$noResep,
                "as" => 'uhman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function HapusSettingDataFixed(Request $request) {

        DB::beginTransaction();

        try {
            $newDF = SettingDataFixed::where('id',$request['iddatafixed'])
                ->update(['statusenabled' => 'f']);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Data Fixed Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "datRekanan" => $newDF,//$noResep,,//$noResep,
                "as" => 'hidayat',
            );
        } else {
            $transMessage = "Hapus Data Fixed Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datRekanan" => $newDF,//$noResep,
                "as" => 'hidayat',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

	public function deleteSetting(Request $request) {
		DB::beginTransaction();
		try {
			$newDF = SettingDataFixed::where('id',$request['id'])->delete();
			$transStatus = 'true';
		} catch (\Exception $e) {
			$transStatus = 'false';

		}
		if ($transStatus == 'true') {
			$transMessage = "Hapus Data Fixed Berhasil";
			DB::commit();
			$result = array(
				"status" => 201,
				"message" => $transMessage,
				"as" => 'inhuman@epic',
			);
		} else {
			$transMessage = "Hapus Data Fixed Gagal";
			DB::rollBack();
			$result = array(
				"status" => 400,
				"message"  => $transMessage,
				"as" => 'inhuman@epic',
			);
		}
		return $this->setStatusCode($result['status'])->respond($result, $transMessage);
	}
    public function updateStatuEnabled(Request $request) {
        DB::beginTransaction();
        try {
            $newDF = SettingDataFixed::where('id',$request['id'])->update(
                ['statusenabled' => $request['statusenabled'] ]
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
                "as" => 'inhuman@epic',
            );
        } else {
            $transMessage = "Terjadi Kesalahan";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getKelompokSettingDataFix(Request $request){
        $data = DB::table('settingdatafixed_m')
            ->select(DB::raw("case when kelompok is null then 'Lain-lain' else kelompok end as kelompok"))
            ->groupBy('kelompok')
            ->orderBy('kelompok')
            ->get();
        $result = array(
          'data' => $data,
          'as' => 'inhuman@epic'
        );
        return $this->respond($result);
    }
    public function getSettingDetail(Request $request) {
        if($request['kelompok'] == 'Lain-lain'){
            $request['kelompok']  = null;
        }
        $dataRaw = \DB::table('settingdatafixed_m')
            ->where('kelompok', $request['kelompok'])
            ->select('*','keteranganfungsi as caption','nilaifield')
            ->orderBy('id');
        $dataRaw = $dataRaw->get();
        $dataraw3A =[];

        foreach ($dataRaw as $dataRaw2) {
            $head = '';
            $type =  $dataRaw2->typefield;
            if(stripos( $dataRaw2->typefield, 'Str') !== FALSE
                || stripos( $dataRaw2->typefield, 'Int') !== FALSE
                    ||stripos( $dataRaw2->typefield, 'Char') !== FALSE ){
                if($dataRaw2->tabelrelasi != null){
                    $type = 'combobox';
                }else{
                    $type = 'textbox';
                }
            }elseif($dataRaw2->typefield == 'combobox') {
                $type = 'combobox';
            }else{
                $type = 'textbox';
            }

            $dataraw3A[] = array(
                'kdprofile' => $dataRaw2->kdprofile,
                'statusenabled' => $dataRaw2->statusenabled,
                'kodeexternal'=> $dataRaw2->kodeexternal,
                'namaexternal' => $dataRaw2->namaexternal,
                'reportdisplay' => $dataRaw2->reportdisplay,
                'fieldkeytabelrelasi' => $dataRaw2->fieldkeytabelrelasi,
                'caption' => $head . $dataRaw2->caption  ,

                'cbotable' => $dataRaw2->tabelrelasi,
                'fieldreportdisplaytabelrelasi' => $dataRaw2->fieldreportdisplaytabelrelasi,
                'keteranganfungsi' => $dataRaw2->keteranganfungsi,
                'namafield' => $dataRaw2->namafield,
                'id' => $dataRaw2->id ,
                'nilaifield' => $dataRaw2->nilaifield ,
                'tabelrelasi' => $dataRaw2->tabelrelasi,
                'typefield' => $dataRaw2->typefield,
                'type' =>$type ,
                'kelompok' => $dataRaw2->kelompok,
                'value' => $dataRaw2->nilaifield ,
                'text' => $dataRaw2->reportdisplay,
            );
        }

        $result = array(
            'kolom1' => $dataraw3A,
            'message' => 'inhuman@epic',
        );

        return $this->respond($result);
    }
    public function getComboPart(Request $request) {
        $id = $request['id'];
        $req= $request->all();
        $setting = DB::table('settingdatafixed_m')
            ->select('*')
            ->where('id',$id)
            ->get();

        $table =  $setting[0]->tabelrelasi;
        $namaField = strtolower ($setting[0]->fieldreportdisplaytabelrelasi);
        $keyField = strtolower ($setting[0]->fieldkeytabelrelasi);
        $table = strtolower ($table);
        $data  = \DB::table("$table")
            ->select("$namaField as text" ,"$keyField as value")
            ->where('statusenabled',true)
            ->orderBy("$keyField");

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
                $data = $data->where("$namaField",'like','%'. $req['filter']['filters'][0]['value'].'%' );

        };
        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }
    public function updateSettingDataFix(Request $request) {
        DB::beginTransaction();
        $dataReq = $request->all();

        $data = $dataReq['data'];

        try {

            $i=0;
            foreach ($data as $item) {
                if (is_array($item['values'])){
                    $value = $item['values']['value'] ;
                    $text = $item['values']['text'] ;
                }else{
                    $value = $item['values'];
                    $text = '';
                }

                $EMRD =  SettingDataFixed::where('id',$item['id'])->first();
                $EMRD->statusenabled = $dataReq['head'];
                $EMRD->nilaifield = $value;
                $EMRD->reportdisplay = $text;
                $EMRD->save();
                $i = $i + 1;
            }



            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Update Setting ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman@epic',
            );
        }else{
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getTable(Request $request){
        $req= $request->all();
        $data  = \DB::table("information_schema.tables")
            ->select("table_name")
            ->where('table_schema','=','public')
            ->where('table_type','=','BASE TABLE')
            ->orderBy("table_name");

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $data = $data->where("table_name",'like','%'. $req['filter']['filters'][0]['value'].'%' );

        };
        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }
    public function getFieldTable(Request $request){;
        $table = $request['tablename'];
        $data  = DB::select(DB::raw("SELECT
            COLUMN_NAME
            FROM
            information_schema.COLUMNS
            WHERE
            TABLE_NAME = '$table';"));
        $result = array(
            "data" => $data,
            "as" => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getDataFromTable(Request $request){;
        $table = $request['table_name'];
        $column = $request['column_name'];
        $data  = DB::select(DB::raw("
            select $column as name from $table
             "));
        $result = array(
            "data" => $data,
            "as" => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getReportDisplayTable(Request $request){;
        $table = $request['table_name'];
        $column = $request['column_name'];
        $nilai = $request['nilai'];
        $data  = DB::select(DB::raw("
            select $column as id from $table
             "));
        $result = array(
            "data" => $data,
            "as" => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getReport(Request $request){
        $namareport = $request['namareport'];
        $nosep=$request['namareport'];
        // return($namareport);
        // die();
        // $datax = DB::select(DB::raw(
        //     "
        //         SELECT top 1 template from templatereport_t where 
        //         namareport = '$namareport'

        //     "
        // ));
        // $data = "$data";
        if($namareport == 'sep'){
            $noregistrasi=$request['norec'];
            $data = DB::select(DB::raw(
                "      select pd.objectjenispasienfk, pa.namadjpjpmelayani,pa.polirujukannama as namaruangan,pa.nosep,pd.tglregistrasi as tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, 
                       pa.norujukan,ap.namapeserta || '('||jk.jeniskelamin||')' as namapeserta,ap.tgllahir,jk.jeniskelamin, 
                       rp.namaruangan as namaruangans,rp.kdinternal as namapolibpjs,pa.ppkrujukan, 
                       (CASE WHEN rp.objectdepartemenfk=16 AND pd.objectjenispasienfk=1 OR  rp.objectdepartemenfk=16 AND pd.objectjenispasienfk IS NULL then 'R. Inap' else 'R. Jalan' END) as jenisrawat, 
                       dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , 
                       ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, 
                       (case when rp.objectdepartemenfk=16 then kls2.namakelas else '-' end) as namakelas, 
                       (case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, 
                       kls.namakelas as namakelashak, 
                       ap.notelpmobile,pa.penjaminlaka,
                       (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' 
                       when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' 
                       when pa.penjaminlaka='3' then 'TASPEN PT' 
                       when pa.penjaminlaka='4' then 'ASABRI PT' 
                       Else '-' end) as penjaminlakalantas,case when pa.prolanisprb is null then '-' else pa.prolanisprb end as prolanisprb , tp.namaexternal as titlepasien , (kls.namakelas ) as namakelasDitanggung
                       ,case when pa.polirujukannama is null then rp.namaruangan||'('||rp.kdinternal||')' else pa.polirujukannama end as namaruanganfix
                       from pemakaianasuransi_t pa 
                       LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id 
                       LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk 
                       LEFT JOIN pasien_m pi on pi.id=pd.nocmfk 
                       LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk 
                       LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk 
                       LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id
                       LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk 
                       LEFT JOIN kelas_m kls2 on kls2.id=pd.objectkelasfk 
                       LEFT JOIN titlepasien_m tp on pi.objecttitlefk=tp.id 
                       where pd.noregistrasi = '$noregistrasi' 
                        and pa.nosep is not null  
                "
            ));
            
        }
        if($namareport == 'kwitansitotal'){
            $noregistrasi=$request['noregistrasi'];
            $totalbiling =  $request['totalbiling'];
            $data = DB::select(DB::raw(
               "select pd.noregistrasi as noregistrasi, $totalbiling  as totaldibayar,  ps.namapasien,'-' as keteranganlainnya,ru.namaruangan as namaruangan,ps.nocm,pd.tglregistrasi,pd.tglpulang,'' as tanggal from pasiendaftar_t as pd left join ruangan_m as ru on ru.id=pd.objectruanganlastfk left join pasien_m as ps on ps.id=pd.nocmfk where pd.noregistrasi=$noregistrasi"
            ));
            
        }

        if($namareport == 'sjp'){
            $noregistrasi=$request['norec'];
            $data = DB::select(DB::raw(
                "     select * ,'BPJS KESEHATAN' as judul from V_CetakSJPRS 
                       where noregistrasi = '$noregistrasi'  
                "
            ));
            if ($data ==[]){
                $data = DB::select(DB::raw(
                "     select * ,'UMUM' as judul from V_CetakSJPRSumum 
                       where noregistrasi = '$noregistrasi'  
                "
            ));
            }
        }

        if($namareport == 'kwitansirincian'){
            $norec=$request['norec'];
            $strIdPegawai=$request['strIdPegawai'];
            $data = DB::select(DB::raw(
                 "select  pd.noregistrasi,ps.nocm,ps.tgllahir,tit.namaexternal +' '+ ps.namapasien as namapasien,  
                        apdp.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir,  
                        (select pg.namalengkap from pegawai_m as pg INNER JOIN pelayananpasienpetugas_t p3 on p3.objectpegawaifk=pg.id  
                       where p3.pelayananpasien=tp.norec and p3.objectjenispetugaspefk=4) AS namadokter,kp.kelompokpasien,tp.produkfk,  
                        pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan, 
                        (case when tp.hargadiscount is null then 0 else tp.hargadiscount end) as diskon, (case when tp.jasa is null then 0 else tp.jasa end) as jasa,  
                        (hargasatuan-(case when tp.hargadiscount is null then 0 else tp.hargadiscount end) )*tp.jumlah+ (case when tp.jasa is null then 0 else tp.jasa end)   as total,ks.namakelas,ar.asalrujukan,tp.tglpelayanan,  
                        CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar  
                        FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id  
                        INNER JOIN titlepasien_m AS tit ON ps.objecttitlefk = tit.id  
                        INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id  
                        INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id  
                        INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec  
                        INNER JOIN ruangan_m AS ru ON pd.objectruanganlastfk= ru.id  
                        LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec  
                        LEFT JOIN pegawai_m AS pp ON apdp.objectpegawaifk = pp.id  
                        LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id  
                        LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id  
                        LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id  
                        left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk  
                        left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id  
                        INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk  
                        where tp.strukfk = '$norec' and pro.id <> 402611  " 
            ));
            
        }

        if($namareport == 'postklaim'){
            $noregistrasi=$request['norec'];
            $data = DB::select(DB::raw(
                "select pd.norec, sum(((pp.hargajual - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah)+ case when pp.jasa is null then 0 else pp.jasa end) as ttl,kpb.namaexternal
                from pasiendaftar_t as pd
                inner join pasien_m as ps on ps.id = pd.nocmfk
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                INNER JOIN produk_m as pr on pr.id=pp.produkfk
                INNER JOIN kelompokprodukbpjs_m as kpb on kpb.id=pr.objectkelompokprodukbpjsfk
                left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                where br.norec is null  and 
                pd.noregistrasi='$noregistrasi'
                group  by pd.norec,kpb.namaexternal order by pd.norec
                "
            ));
        }
        $result = array(
            'data' => $data,
            'as' => 'as@snaps'
        );
        return $this->respond($result);
    }
    protected function getSettingDataFixedGeneric($namaField){
        $set = SettingDataFixed::where('namafield', $namaField)->first();
        return $set->nilaifield;
    }
};