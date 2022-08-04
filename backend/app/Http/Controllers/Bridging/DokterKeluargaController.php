<?php

namespace App\Http\Controllers\Bridging;
use App\Http\Controllers\ApiController;
use App\Master\Agama;
use App\Master\Pegawai;
use App\Traits\CrudMaster;
use App\Traits\Valet;
use App\Transaksi\LoggingUser;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Web\LoginUser;
use App\Web\Token;
// use App\Web\Admin\ProfileHistoriAwards as ProfileHistoriAwards;
// use App\Web\Admin\Awards as Awards_M;
// use App\Web\Asal as Asal_M;
// use App\Transaksi\StrukHistori as StrukHistori_T;
use DB;
use Illuminate\Support\Facades\Hash;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;
use Namshi\JOSE\JWT;
use Namshi\JOSE\JWS;
use Namshi\JOSE\Base64\Encoder;
use Webpatser\Uuid\Uuid;

use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Parser;


class DokterKeluargaController extends ApiController
{
    use Valet;

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }
    public function getDetailPasien(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin('agama_m as ag','ag.id','=','ps.objectagamafk')
            ->leftjoin('golongandarah_m as gd','gd.id','=','ps.objectgolongandarahfk')
            ->leftjoin('pekerjaan_m as pk','pk.id','=','ps.objectpekerjaanfk')
            ->leftjoin('pendidikan_m as pdd','pdd.id','=','ps.objectpendidikanfk')
            ->leftjoin('statusperkawinan_m as spkw','spkw.id','=','ps.objectstatusperkawinanfk')
            ->leftjoin('alamat_m as al','al.nocmfk','=','ps.id')
            ->leftjoin('suku_m as sk','sk.id','=','ps.objectsukufk')
            ->select(DB::raw("ps.id,ps.nocm,
    ps.noidentitas as nik,	ps.namapasien,	ps.tgllahir,	ps.nohp AS telepon,	sk.suku as etnis,
	ps.bahasa,	jk.jeniskelamin,	ag.agama,	gd.golongandarah,	al.alamatlengkap,	al.alamatemail as email,
	ps.namaayah as wali,	'Orang Tua' as hubunganwali,	null as alamatwali,
	null as teleponwali,	null as faksesbpjs,	null as alamatfaskes,	null as teleponfaskes,	pk.pekerjaan,
	pdd.pendidikan,	spkw.statusperkawinan,ps.nobpjs"))
            ->where('ps.statusenabled',true);
        $stt = false;
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
            $stt = true;
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
            $stt = true;
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
             $stt = true;
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
            $stt = true;
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        // $data = $data->take(50);
        $data = $data->first();
        if(!empty($data ) && $stt==true){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getPerawatan(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select(DB::raw("ps.noidentitas as nik,pd.tglregistrasi,ps.id as idpasien,ps.nocm,pd.noregistrasi,
                            ps.namapasien,ru.namaruangan,
			               pg.namalengkap as namadokter,pd.tglpulang,
			               CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap,'' AS kddiagnosa,pd.norec"))
            ->whereNull('br.pasiendaftarfk');
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data = $data->where('ps.statusenabled', true);
        $data = $data->orderBy('pd.tglregistrasi', 'desc');
        $data = $data->get();
        $norecaPd = '';
        $diagnosa = '';
//        return $this->respond($data);
        foreach ($data as $ob){
            $norecaPd = $norecaPd.",'".$ob->norec . "'";
//                        $ob->kddiagnosa = [];
        }
        $norecaPd = substr($norecaPd, 1, strlen($norecaPd)-1);
//                    $diagnosa = [];
        if($norecaPd!= ''){
            $diagnosa = DB::select(DB::raw("
                           select dg.kddiagnosa + ': ' + dg.namadiagnosa AS diagnosa,ddp.noregistrasifk as norec_apd,apd.noregistrasifk AS norec_pd
                           from antrianpasiendiperiksa_t AS apd 
                           inner join detaildiagnosapasien_t as ddp ON ddp.noregistrasifk = apd.norec
                           left join diagnosapasien_t as dp on dp.norec=ddp.objectdiagnosapasienfk
                           left join diagnosa_m as dg on ddp.objectdiagnosafk=dg.id
                           where ddp.objectjenisdiagnosafk = 1 and apd.noregistrasifk in ($norecaPd) "));
            $i = 0;
            foreach ($data as $h){
                foreach ($diagnosa as $d){
                    if($data[$i]->norec == $d->norec_pd){
//                        return $this->respond($d);
                        if ($d->diagnosa != null){
//                            return $this->respond($data[$i]->diagnosa);
                            $data[$i]->kddiagnosa = $data[$i]->kddiagnosa . ', ' . $d->diagnosa;
                        }
                    }
                }
                $i++;
            }
        }
        $d=0;
        $result=[];
        foreach ($data as $hideung){
            if ($hideung->kddiagnosa != ""){
                $data[$d]->kddiagnosa = substr($data[$d]->kddiagnosa,1);
                $result [] = $data[$d];
            }
            $d = $d + 1;
        }

        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getObservasiKesehatan(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join ('detaildiagnosapasien_t as ddp','ddp.noregistrasifk','=','apd.norec')
            ->leftjoin ('diagnosapasien_t as dp','dp.norec','=','ddp.objectdiagnosapasienfk')
            ->leftjoin ('diagnosa_m as dg','ddp.objectdiagnosafk','=','dg.id')
            ->select(DB::raw("ddp.tglinputdiagnosa as tanggal, dg.kddiagnosa + ': ' + dg.namadiagnosa AS observasi,
                        ddp.keterangan,'' as status,
                        ps.nocm,ps.namapasien,pd.tglregistrasi,
                        pd.noregistrasi,ps.noidentitas as nik
                     "))
            ->where('pd.statusenabled',true)
            ->where('ps.statusenabled', true)
            ->where('ddp.objectjenisdiagnosafk',1);
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        $data = $data->orderBy('pd.tglregistrasi', 'desc');
        $data = $data->get();


        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getProsedur(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join ('diagnosatindakanpasien_t as dp','dp.objectpasienfk','=','apd.norec')
            ->leftjoin ('detaildiagnosatindakanpasien_t as ddp','ddp.objectdiagnosatindakanpasienfk','=','dp.norec')
            ->leftjoin ('diagnosatindakan_m as dg','ddp.objectdiagnosatindakanfk','=','dg.id')
            ->leftjoin ('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk')
            ->select(DB::raw("ddp.tglinputdiagnosa AS tanggal,
                        dg.kddiagnosatindakan  + ' : ' + dg.namadiagnosatindakan AS prosedur,	ddp.keterangantindakan as keterangan,
                    pg.namalengkap as penyedia,ps.nocm,	ps.namapasien,	pd.tglregistrasi,	pd.noregistrasi,
                        ps.noidentitas AS nik
                     "))
            ->where('pd.statusenabled',true)
            ->where('ps.statusenabled', true);
//            ->where('ddp.objectjenisdiagnosafk',1);
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        $data = $data->orderBy('pd.tglregistrasi', 'desc');
        $data = $data->get();


        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }

    public function getKesehatanUmum(Request $request) {

        $data = \DB::table('emrpasiend_t as emrdp')
            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            ->leftjoin('pasien_m as ps', 'ps.nocm', '=', 'emrp.nocm')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            ->select(DB::raw("emrp.noregistrasifk as noregistrasi,emrp.tglregistrasi, emrp.noemr,
            emrp.tglemr as tglemr,emrd.caption as namaemr,emrdp.value as nilai,emrp.namaruangan,
                emrdp.emrdfk"))
            ->where('emrdp.statusenabled', true)
            ->whereIn('emrdp.emrdfk',[4241,4242,4243,4244,4245,4246])
            ->orderBy('emrp.tglemr');

        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        // $data = $data->orderBy('tr.tgltransaksi','desc');
        $data = $data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getAlergi2(Request $request) {

        $data = \DB::table('emrpasiend_t as emrdp')
            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            ->leftjoin('pasien_m as ps', 'ps.nocm', '=', 'emrp.nocm')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            ->select(DB::raw("emrp.noregistrasifk as noregistrasi,emrp.tglregistrasi, emrp.noemr,
            emrp.tglemr as tglemr,emrd.caption as namaemr,emrdp.value as nilai,emrp.namaruangan,
                emrdp.emrdfk"))
            ->where('emrdp.statusenabled', true)
            ->whereIn('emrdp.emrdfk',[4263,4262,4261])
            ->orderBy('emrp.tglemr');

        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        // $data = $data->orderBy('tr.tgltransaksi','desc');
        $data = $data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
        // return $this->respond($data);
    }
    public function getAlergi(Request $request) {

        $data=[];
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getPengobatan(Request $request) {
        $data = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->JOIN('produk_m as pr','pr.id','=','pp.produkfk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->leftJoin('satuanstandar_m as ss','ss.id','=','pp.satuanviewfk')
            ->leftJOIN('strukresep_t as sr','sr.norec','=','pp.strukresepfk')
            ->leftJOIN('pegawai_m as dok','dok.id','=','sr.penulisresepfk')
            ->JOIN('jeniskemasan_m as jkm','jkm.id','=','pp.jeniskemasanfk')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk')
            ->select(DB::raw("pd.noregistrasi,pd.tglregistrasi,sr.tglresep,sr.noresep,
                pr.namaproduk,pp.jumlah,pp.dosis,  pp.aturanpakai,ru.namaruangan,ss.satuanstandar as satuan,jkm.jeniskemasan,
                dok.namalengkap as pemberiresep,jp.jenisproduk,djp.detailjenisproduk,ru2.namaruangan as ruangandepo
          
            "))
            ->where('pd.statusenabled',true)
            ->whereNotNull('pp.strukresepfk');
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        // $data = $data->orderBy('tr.tgltransaksi','desc');
        $data = $data->get();
//        $data = collect($data);
        if(count($data) > 0){
            $result = array(
                "response" => $data,//  $data->groupBy('noresep'),
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getPertemuanMendatang(Request $request) {
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm','pm.id','=','apr.nocmfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps','kps.id','=','apr.objectkelompokpasienfk')
            ->select(
                DB::raw("
                apr.noreservasi,apr.tanggalreservasi as tanggal,
                ru.namaruangan,pg.namalengkap as dokter,
                apr.notelepon,pm.nohp,
                (case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien,pm.nocm,
                '' as informasi,'Reservasi' as jenis")

            )
            ->where('apr.noreservasi','<>','-')
            ->where('apr.statusenabled',true)
            ->whereNotNull('apr.noreservasi');
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('pm.noidentitas','=', $request['nik']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('pm.nocm','like', '%'.$request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $nama = $request['namapasien'];
            $data = $data->whereRaw("(pm.namapasien like'%$nama%' or apr.namapasien like'%$nama%') " );
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('pm.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('pm.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('pm.namapasien','ilike', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }

        $data = $data->orderBy('apr.tanggalreservasi', 'desc');
        $data = $data->get();


        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getRadiologi(Request $request) {
        $data = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            ->select(
                DB::raw("
               format(pp.tglpelayanan,'dd-MM-yyyy') as tgllayanan,
                format(pp.tglpelayanan,'HH:mm') as jamlayanan,pp.tglpelayanan as tanggal, pr.namaproduk,pp.jumlah,pp.hargasatuan,ps.nohp as notelpon,
                ru.namaruangan,ps.nocm,ps.namapasien,ps.noidentitas as nik,pd.noregistrasi, pd.tglregistrasi,pp.norec as norec_pp")
            )
            ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
            ->whereNull('pp.strukresepfk')
            ->orderBy('pp.tglpelayanan','desc');
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        }
   

        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data = $data->get();
        if(count($data) > 0){
                $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
//                    ->where('pd.kdprofile',$idProfile)
                    ->where('ptu.objectjenispetugaspefk', 4)
                    ->where('pd.noregistrasi', $data[0]->noregistrasi)
                    ->get();

                foreach ($data as $item) {
                    $NamaDokter = '-';
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            $NamaDokter = $hahaha->namalengkap;
                        }
                    }
                    $item->penyedia = $NamaDokter;
                }
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getHasilLab(Request $request)
    {
        $p_NIK ='';
        $p_nocm ='';
        $p_id ='';
        $p_nobpjs ='';
        $p_namaPasien ='';
        $page = '';
        $limit = '';
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $p_NIK =" and ps.noidentitas='".$request['nik']."'";
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $p_nocm =  " and ps.nocm like '%".$request['nocm']."%'";
        }
        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $p_id =' and ps.id='. $request['id_pasien'];
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $p_nobpjs = " and ps.nobpjs='".$request['nobpjs']."'";
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $p_namaPasien = " and ps.namapasien like '%".$request['namapasien']."%'";
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $limit = (int)$request['limit'];
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $page = (int)$request['page'];
        }
        $pasien = collect(DB::select( "select ps.* from pasien_m as ps where ps.statusenabled=1  $p_NIK
                 $p_nocm 
                 $p_id "))->first();

        $jk = 0;
        if(!empty($pasien)){
            $jk = $pasien->objectjeniskelaminfk;
        }
        $data = DB::select(DB::raw("SELECT pp.tglpelayanan as tanggal ,djp.detailjenisproduk as jenispemeriksaan,prd.namaproduk as namapemeriksaan ,
                maps.detailpemeriksaan,maps.memohasil as memohasilperiksa,
                maps.nourutdetail,hh.hasil as hasilpemeriksaan,ss.satuanstandar as satuan,nn.nilaitext as batasnormal,nn.tipedata,
                nn.nilaimin,nn.nilaimax,
                maps.nourutjenispemeriksaan,
                hh.flag,pd.noregistrasi,pd.tglregistrasi,pd.tglpulang
                FROM pelayananpasien_t  as pp
                inner join produk_m as prd on prd.id = pp.produkfk
                inner join detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk
                inner join maphasillab_m  as maps on maps.produkfk = prd.id
                inner join maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id 
                and maps2.jeniskelaminfk ='$jk'
                inner join nilainormal_m  as nn on nn.id = maps2.nilainormalfk
                inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk
                inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
                inner join pasien_m as ps on ps.id = pd.nocmfk
                left join satuanstandar_m  as ss on ss.id = maps.satuanstandarfk
                 join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
                and pp.noregistrasifk=hh.noregistrasifk
                and maps.detailpemeriksaan =hh.detailpemeriksaan 
                where pd.statusenabled=1  
                 $p_NIK
                 $p_nocm 
                 $p_id 
                 $p_nobpjs 
                 $p_namaPasien 
                group by pp.tglpelayanan ,pp.noregistrasifk ,djp.detailjenisproduk,pp.produkfk,prd.namaproduk ,maps.detailpemeriksaan,maps.memohasil,
                maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.tipedata,nn.nilaimin,nn.nilaimax,hh.hasil,
                maps.id ,hh.norec ,maps.nourutjenispemeriksaan,maps.nourutdetail,pp.norec ,
                hh.flag,nn.id ,maps2.jeniskelaminfk,pd.noregistrasi,pd.tglregistrasi,pd.tglpulang
                order by  maps.nourutjenispemeriksaan,maps.nourutdetail asc"));
        if( $page != '' && $limit != '' ){
            $data  = collect($data)->forPage($page, $limit);
        }
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);

    }
    public function getECG(Request $request)
    {
        $data = \DB::table('eecg_t as emr')
            ->leftJoin('pasien_m as ps','ps.nocm','=','emr.customerid')
            ->select('emr.*','ps.nocm','ps.namapasien','ps.noidentitas as nik')
            ->orderBy('emr.urut');
       if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('emr.customerid','like', '%'.$request['nocm'].'%');
        
        }
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
//        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
//            $data = $data->where('ps.nocm','=', $request['nocm']);
//        }

        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if (isset($request['date_send']) && $request['date_send'] != '') {
            $data = $data->where('emr.norec', 'like', $request['date_send'] . '%');
        }
        if (isset($request['vis']) && $request['vis'] != '') {
            if ($request['vis'] == 'true') {
                $data = $data->where('emr.statusenabled', $request['vis']);
            } else {
                $data = $data->whereNull('emr.statusenabled');
            }
        }
        $data =$data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }
    public function getRencanaRekomen(Request $request)
    {
        $data = \DB::table('rencana_t as rm')
            ->select('rm.rencana', 'rm.tanggalinput as tglinput',
                'pg.namalengkap as petugas',  'ru.namaruangan', 'pd.noregistrasi', 'pd.tglregistrasi', 'ps.nocm',
                'ps.namapasien','ps.noidentitas as nik')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.objectpetugas')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.objectruanganfk')
            ->where('rm.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
        
        }

        if(isset($request['id_pasien']) && $request['id_pasien']!="" && $request['id_pasien']!="undefined"){
            $data = $data->where('ps.id','=', $request['id_pasien']);
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
        }
        if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data =$data->get();
        if(count($data) > 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok"
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }
        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }
    public function getDaftarPasienDK(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin('agama_m as ag','ag.id','=','ps.objectagamafk')
            ->leftjoin('golongandarah_m as gd','gd.id','=','ps.objectgolongandarahfk')
            ->leftjoin('pekerjaan_m as pk','pk.id','=','ps.objectpekerjaanfk')
            ->leftjoin('pendidikan_m as pdd','pdd.id','=','ps.objectpendidikanfk')
            ->leftjoin('statusperkawinan_m as spkw','spkw.id','=','ps.objectstatusperkawinanfk')
            ->join('alamat_m as al','al.nocmfk','=','ps.id')
            ->leftjoin('suku_m as sk','sk.id','=','ps.objectsukufk')
            ->select(DB::raw("ps.id,ps.nocm,
    ps.noidentitas as nik,	ps.namapasien,	ps.tgllahir,	ps.nohp AS telepon,	sk.suku as etnis,
	ps.bahasa,	jk.jeniskelamin,	ag.agama,	gd.golongandarah,	al.alamatlengkap,	al.alamatemail as email,
	ps.namaayah as wali,	'Orang Tua' as hubunganwali,	null as alamatwali,
	null as teleponwali,	null as faksesbpjs,	null as alamatfaskes,	null as teleponfaskes,	pk.pekerjaan,
	pdd.pendidikan,	spkw.statusperkawinan,ps.nobpjs"))
            ->where('ps.statusenabled',true)
            ->where('ps.namapasien','!=','-');
        $stt = false;
        if(isset($request['nik']) && $request['nik']!="" && $request['nik']!="undefined"){
            $data = $data->where('ps.noidentitas','=', $request['nik']);
            $stt = true;
        }
        if(isset($request['nobpjs']) && $request['nobpjs']!="" && $request['nobpjs']!="undefined"){
            $data = $data->where('ps.nobpjs','=', $request['nobpjs']);
            $stt = true;
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like', '%'.$request['nocm'].'%');
            $stt = true;
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','like', '%'.$request['namapasien'].'%');
            $stt = true;
        }
        if(isset($request['nokk']) && $request['nokk']!="" && $request['nokk']!="undefined"){
//            $data = $data->where('ps.nokk','=', $request['nokk']);
        }
         if(isset($request['limit']) && $request['limit']!="" && $request['limit']!="undefined"){
            $data = $data->limit( $request['limit']);
        }
        if(isset($request['page']) && $request['page']!="" && $request['page']!="undefined"){
            $data = $data->offset($request['page']);
        }
        $data = $data->orderBy('ps.namapasien');
        $data = $data->get();
        if(count($data)> 0){
            $result = array(
                "response" =>  $data,
                "metadata" => array(
                    "code" => "200",
                    "message" => "Ok",
                    "count" => count($data)
                )
            );
        }else{
            $result = array(
                "response" =>  null,
                "metadata" => array(
                    "code" => "400",
                    "message" => "Data tidak ditemukan"
                )
            );
        }


        return $this->setStatusCode($result['metadata']['code'])->respond($result);
    }
}