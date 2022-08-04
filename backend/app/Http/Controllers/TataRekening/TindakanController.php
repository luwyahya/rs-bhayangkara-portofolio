<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 12/07/2019
 * Time: 10:40 AM
 */
namespace App\Http\Controllers\TataRekening;

use App\Http\Controllers\ApiController;
use App\Master\SettingDataFixed;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\LoggingUser;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDelete;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\PelayananPasienTidakTerklaim;
use App\Transaksi\PelayananPasienTidakTerklaimDelete;
use App\Transaksi\IndikatorPelayananPasien;
use App\Transaksi\DetailIPP;
use App\Transaksi\SasaranMutu;
use Illuminate\Http\Request;
use DB;
//use App\Pegawai\ModulAplikasi;
//use App\Pegawai\MapObjekModulToKelompokUser;
//use App\Pegawai\MapObjekModulAplikasiToModulAplikasi;
//use App\Pegawai\ObjekModulAplikasi;
//use App\Master\KelompokUser;

use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\OrderProduk;
use App\Master\Pegawai;
use App\Master\Ruangan;
use App\Traits\Valet;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;
use Carbon\Carbon;

class TindakanController extends ApiController
{

    use Valet;

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

    public function getTindakan(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('harganettoprodukbykelas_m as hnp')
            ->join ('mapruangantoproduk_m as mpr ','mpr.objectprodukfk','=','hnp.objectprodukfk')
//            ->join ('harganettoprodukbykelasd_m as hnpd','hnpd.objectprodukfk','=','mpr.objectprodukfk')
            ->join ('produk_m as prd','prd.id','=','mpr.objectprodukfk')
            ->join ('kelas_m as kls','kls.id','=','hnp.objectkelasfk')
            ->join ('ruangan_m as ru', 'ru.id','=','mpr.objectruanganfk')
	        ->join ('suratkeputusan_m as sk', 'hnp.suratkeputusanfk','=','sk.id')
            ->select('mpr.objectprodukfk','prd.id','prd.namaproduk','hnp.hargasatuan','hnp.objectkelasfk',
                'kls.namakelas','mpr.objectruanganfk','ru.namaruangan',
            'prd.namaproduk1'
            )

            ->where('mpr.objectruanganfk',$request['idRuangan'])
            ->where('hnp.objectkelasfk',$request['idKelas'])
//            ->where('hnp.objectjenispelayananfk',$request['idJenisPelayanan'])
            ->where('mpr.statusenabled',true)
            ->where('hnp.statusenabled',true)
            ->where('sk.statusenabled',true)
            ->where('prd.statusenabled',true)
            // ->where('mpr.kodeexternal','2017')
            // ->where('hnp.kodeexternal', '2017')
        ;

        $data = $data->orderBy('prd.namaproduk', 'ASC');
//        $data=$data->groupBy('mpr.objectprodukfk','prd.id','prd.namaproduk','hnp.hargasatuan','hnp.objectkelasfk',
//            'kls.namakelas','mpr.objectruanganfk','ru.namaruangan');
        $data = $data->distinct();
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getCombo(Request $request)
    {
        $detailLog = $request->all();
        $jenisPelaksana = \DB::table('jenispetugaspelaksana_m as jpp')
            ->where('jpp.statusenabled', true)
            ->orderBy('jpp.jenispetugaspe')
            ->get();
        $pegawai = \DB::table('pegawai_m as pg')
            ->where('pg.statusenabled', true)
            ->orderBy('pg.namalengkap')
            ->get();

        $dataTarifAdminCito = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield','rt.nilaifield')
            ->where('rt.statusenabled',true)
            ->where('rt.namafield','tarifadmincito')
            ->orderBy('rt.id')
            ->first();

        $result = array(
            'detaillogin' =>$detailLog,
            'jenispelaksana' => $jenisPelaksana,
            'pegawai' => $pegawai,
            'tarifcito' => $dataTarifAdminCito,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getComboMap(Request $request)
    {
        $detailLog = $request->all();
        // return($request->objectkelompokprodukbpjsfk);
        // die();
        $jenisPelaksana = \DB::table('mappetugaspelaksanabpjs_t as mppb')
            ->leftjoin('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mppb.objectpetugaspelaksanafk')
            ->select('jpp.id', 'jpp.statusenabled', 'jpp.kodeexternal', 'jpp.norec', 'jpp.reportdisplay', 'jpp.jenispetugaspe', 'jpp.namaexternal')
            ->where('jpp.statusenabled', true)
            ->where('mppb.statusenabled', true)
            ->where('mppb.objectkelompokprodukbpjsfk', $request->objectkelompokprodukbpjsfk)
            ->orderBy('jpp.jenispetugaspe')
            ->distinct()
            ->get();
        $pegawai = \DB::table('mappetugaspelaksanabpjs_t as mppb')
            ->select('pg.namalengkap', '*')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'mppb.objectpegawaifk')
            ->where('pg.statusenabled', true)
            ->where('mppb.statusenabled', true)
            ->where('mppb.objectkelompokprodukbpjsfk', $request->objectkelompokprodukbpjsfk)
            ->orderBy('pg.namalengkap')
            ->distinct()
            ->get();

        $dataTarifAdminCito = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield','rt.nilaifield')
            ->where('rt.statusenabled',true)
            ->where('rt.namafield','tarifadmincito')
            ->orderBy('rt.id')
            ->first();

        $result = array(
            'detaillogin' =>$detailLog,
            'jenispelaksana' => $jenisPelaksana,
            'pegawai' => $pegawai,
            'tarifcito' => $dataTarifAdminCito,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getPegawaiByJenisPetugasPe(Request $request)
    {
            $data = \DB::table('mapjenispetugasptojenispegawai_m as mpp')
                ->join('jenispegawai_m as jp', 'jp.id', '=', 'mpp.objectjenispegawaifk')
                ->join('pegawai_m as pg', 'pg.objectjenispegawaifk', '=', 'jp.id')
                ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mpp.objectjenispetugaspefk')
                ->leftJoin('loginuser_s as lg', 'lg.objectpegawaifk', '=', 'pg.id')
                ->select('mpp.objectjenispegawaifk', 'jp.jenispegawai', 'mpp.objectjenispetugaspefk', 'jpp.jenispetugaspe',
                    'pg.namalengkap', 'pg.id'
//                    ,'lg.id as idloginuser','lg.namauser'
                )
                ->groupBy('mpp.objectjenispegawaifk', 'jp.jenispegawai', 'mpp.objectjenispetugaspefk', 'jpp.jenispetugaspe',
                    'pg.namalengkap','pg.id'
//                    ,'lg.id','lg.namauser'
                )
                ->where('mpp.objectjenispetugaspefk', $request['idJenisPetugas'])
                ->where('mpp.statusenabled', true)
                ->where('pg.statusenabled', true)
                ->where('jpp.statusenabled', true);
        $data = $data->orderBy('pg.namalengkap', 'ASC');
        $data = $data->get();

        $result = array(
            'jenispelaksana' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    
    public function hapusFlagTindakan(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $status = true;
            $msg = '';
            $tglTutupFaktur = date('Y-m-d H:i:s');
            if ($request['close'] == false) {
                // return($request['noregistrasi']);
                // die();
                $status = false;
                $tglTutupFaktur = null;
                $msg = 'status';
            }
            $data = IndikatorPelayananPasien::where('norec', $request['norec_ipp'])
                ->update([
                    'flag' => $status,
                ]);
            $transMessage = $msg . " Simpan Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
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
    
    public function getPegawaiByJenisPetugasPeMap(Request $request)
    {
            $detailLog = $request->all();
            // return($detailLog);
            // die();

            $data = \DB::table('mapjenispetugasptojenispegawai_m as mpp')
                ->join('jenispegawai_m as jp', 'jp.id', '=', 'mpp.objectjenispegawaifk')
                ->join('pegawai_m as pg', 'pg.objectjenispegawaifk', '=', 'jp.id')
                // ->join('mappetugaspelaksanabpjs_t as mppb', 'mppb.objectpegawaifk', '=', 'pg.id')
                ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mpp.objectjenispetugaspefk')
                ->leftJoin('loginuser_s as lg', 'lg.objectpegawaifk', '=', 'pg.id')
                ->select('mpp.objectjenispegawaifk', 'jp.jenispegawai', 'mpp.objectjenispetugaspefk', 'jpp.jenispetugaspe',
                    'pg.namalengkap', 'pg.id'
//                    ,'lg.id as idloginuser','lg.namauser'
                )
                ->groupBy('mpp.objectjenispegawaifk', 'jp.jenispegawai', 'mpp.objectjenispetugaspefk', 'jpp.jenispetugaspe',
                    'pg.namalengkap','pg.id'
//                    ,'lg.id','lg.namauser'
                )
                ->where('mpp.objectjenispetugaspefk', $request['idJenisPetugas'])
                // ->where('mppb.objectkelompokprodukbpjsfk', $request['objectkelompokprodukbpjsfk'])
                // ->where('mppb.statusenabled', true)
                ->where('mpp.statusenabled', true)
                ->where('pg.statusenabled', true)
                ->where('jpp.statusenabled', true);
        $data = $data->orderBy('pg.namalengkap', 'ASC');
        $data = $data->get();

        $result = array(
            'jenispelaksana' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function saveTindakanEmbalase(Request $request) {

        //TODO : SAVE TINDAKAN
        DB::beginTransaction();

        try{

        $antrian = AntrianPasienDiperiksa::where('norec',$request['pelayananpasien'][0]['noregistrasifk'])
            ->update([
                'ispelayananpasien' => true
            ]);
        $totalJasa=0;
        $totJasa=0;
        $penjumlahanJasa=0;
        $penjumlahanJasaTuslah=0;
        foreach ($request['pelayananpasien'] as $item){
            $totJasa=0;
            $totalJasa=0;
            $penjumlahanJasa=0;
            $penjumlahanJasaTuslah=0;
//            return $this->respond($item);
            $PelPasien = new PelayananPasien();
            $PelPasien->norec = $PelPasien->generateNewId();
            $PelPasien->kdprofile = 0;
            $PelPasien->statusenabled = true;
            $PelPasien->noregistrasifk =  $item['noregistrasifk'];
            $PelPasien->tglregistrasi = $item['tglregistrasi'];
            $PelPasien->hargajual =  $item['hargajual'];
            $PelPasien->hargasatuan =  $item['hargasatuan'];
            $PelPasien->jumlah =  $item['jumlah'];
            $PelPasien->kelasfk =  $item['kelasfk'];
            $PelPasien->kdkelompoktransaksi =  1;
            if(isset( $item['keterangan'])){
                $PelPasien->keteranganlain =  $item['keterangan'];
            }
            $PelPasien->piutangpenjamin =  0;
            $PelPasien->piutangrumahsakit = 0;
            $PelPasien->produkfk =  $item['produkfk'];
            $PelPasien->stock =  1;
            $PelPasien->tglpelayanan =  $item['tglpelayanan'];
            $PelPasien->harganetto =  $item['harganetto'];
           $PelPasien->strukresepfk =  $New_PP['strukresepfk'];
            $PelPasien->iscito =  $item['iscito'];

            if(isset( $item['isparamedis'])){
                $PelPasien->isparamedis =  $item['isparamedis'];
            }
            if(isset( $item['jenispelayananfk'])){
                $PelPasien->jenispelayananfk =  $item['jenispelayananfk'];
            }

            
            $PelPasien->save();
            $PPnorec = $PelPasien->norec;

            $new_PPP=$item['pelayananpetugas'];
            foreach ($new_PPP as $itemPPP) {
                $detailItemPPP=$itemPPP['listpegawai'];
                foreach ($detailItemPPP as $detailItemPPPz){
                    $PelPasienPetugas = new PelayananPasienPetugas();
                    $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                    $PelPasienPetugas->kdprofile = 0;
                    $PelPasienPetugas->statusenabled = true;
                    $PelPasienPetugas->nomasukfk = $item['noregistrasifk'];
                    $PelPasienPetugas->objectjenispetugaspefk = $itemPPP['objectjenispetugaspefk'];
        //            $PelPasienPetugas->objectasalprodukfk = $itemPPP['objectasalprodukfk'];
                     if ($detailItemPPPz=='undefined'){
                         $PelPasienPetugas->objectpegawaifk = null;
                     }else{

                         $PelPasienPetugas->objectpegawaifk = $detailItemPPPz['id'];
                     }
        //            $PelPasienPetugas->objectprodukfk = $itemPPP['objectprodukfk'];
        //            $PelPasienPetugas->objectruanganfk = $itemPPP['objectruanganfk'];
        //            $PelPasienPetugas->deskripsitugasfungsi = $itemPPP['deskripsitugasfungsi'];
        //            $PelPasienPetugas->ispetugaspepjawab = $itemPPP['ispetugaspepjawab'];
                    $PelPasienPetugas->pelayananpasien = $PPnorec;
        //            $PelPasienPetugas->tglpelayanan = $itemPPP['tglpelayanan'];
                    $PelPasienPetugas->save();
                    $PPPnorec = $PelPasienPetugas->norec;
               }
            }
            //TODO : TARIFF UP TUSLAH
            $dataTuslah = SettingDataFixed::where('id',1222)->get();
            //END TARIFF UP TUSLAH
            foreach ($item['komponenharga'] as $itemKomponen) {
                     $PelPasienDetail = new PelayananPasienDetail();
                     $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                     $PelPasienDetail->kdprofile = 0;
                     $PelPasienDetail->statusenabled =true;
                     $PelPasienDetail->noregistrasifk = $item['noregistrasifk'];
                     //            $PelPasienDetail->tglregistrasi = $New_PPP['tglregistrasi'];
                     $PelPasienDetail->aturanpakai = '-';
                     //            $PelPasienDetail->generik =  $New_PPP['generik'];
                     $PelPasienDetail->hargadiscount = $item['diskon']; //0;
                     $PelPasienDetail->hargajual = $itemKomponen['hargasatuan'];
                     $PelPasienDetail->hargasatuan = $itemKomponen['hargasatuan'];
                     //            $PelPasienDetail->jenisobatfk =  $New_PPP['jenisobatfk'];
                     $PelPasienDetail->jumlah = 1;
                     $PelPasienDetail->keteranganlain = '-';
                     $PelPasienDetail->keteranganpakai2 = '-';
                     //            $PelPasienDetail->keteranganpakaifk =  $New_PPP['keteranganpakaifk'];
                     $PelPasienDetail->komponenhargafk = $itemKomponen['objectkomponenhargafk'];
                     //            $PelPasienDetail->nilainormal =  $New_PPP['nilainormal'];
                     $PelPasienDetail->pelayananpasien = $PPnorec;
                     $PelPasienDetail->piutangpenjamin = 0;
                     $PelPasienDetail->piutangrumahsakit = 0;
                     $PelPasienDetail->produkfk = $item['produkfk'];
                     //            $PelPasienDetail->routefk =  $New_PPP['routefk'];
                     //            $PelPasienDetail->statusorder =  $New_PPP['statusorder'];
                     $PelPasienDetail->stock = 1;
                     //            $PelPasienDetail->strukorderfk =  $New_PPP['strukorderfk'];
                     $PelPasienDetail->tglpelayanan = $item['tglpelayanan'];
                     $PelPasienDetail->harganetto = $itemKomponen['hargasatuan'];
                     //            $PelPasienDetail->strukfk =  $New_PPP['strukfk'];
                     //            $PelPasienDetail->norectriger =  $New_PPP['norectriger'];
                    If($itemKomponen['iscito'] == "1"){
//                        return $this->respond($item['nilaicito']);
                        if ($dataTuslah[0]->nilaifield > 0){
                            $penjumlahanJasa = ($itemKomponen['hargasatuan'] - $item['diskon']) * $item['nilaicito'] ;//$New_PPP['jasa'];
                            $penjumlahanJasaTuslah =  (((float)$itemKomponen['hargasatuan'] * (int)$dataTuslah[0]->nilaifield) /100) ;
                            $totalJasa = $totalJasa +  $penjumlahanJasa + $penjumlahanJasaTuslah;

                            $PelPasienDetail->jasa = $penjumlahanJasa + $penjumlahanJasaTuslah;
                        }else{
                            $penjumlahanJasa = ($itemKomponen['hargasatuan'] - $item['diskon']) * $item['nilaicito'] ;//$New_PPP['jasa'];
                            $PelPasienDetail->jasa = $penjumlahanJasa;
                            $totalJasa = $totalJasa +  $penjumlahanJasa;
                        }
                    }else{
                        if ($dataTuslah[0]->nilaifield > 0){
                            $penjumlahanJasaTuslah = ((float)$itemKomponen['hargasatuan'] * (int)$dataTuslah[0]->nilaifield) /100 ;
                            $PelPasienDetail->jasa = $penjumlahanJasaTuslah;
                            $totalJasa = $totalJasa +  $penjumlahanJasaTuslah;
                        }else{
                            $penjumlahanJasa=0;
                            $PelPasienDetail->jasa = $penjumlahanJasa;
                            $totalJasa = $totalJasa +  $penjumlahanJasa;
                        }
                    }

                     $PelPasienDetail->save();
                     $PPDnorec = $PelPasienDetail->norec;
                     $transStatus = 'true';
                 }


                 if ($item['iscito'] == 1){
                     $dataaa= PelayananPasienDetail::where('pelayananpasien', $PPnorec)->get();
                     foreach ($dataaa as $itemss){
                         $totJasa=$totJasa+$itemss->jasa;
                     }
                     $dataJasa= PelayananPasien::where('norec',$PPnorec)
                         ->update([
                             'jasa' => $totalJasa
                     ]);
                 }


                 if ($dataTuslah[0]->nilaifield > 0){
                     $dataJasa= PelayananPasien::where('norec',$PPnorec)
                         ->update([
                             'istuslah' => 1,
                             'jasa' => $totalJasa
                         ]);
                 }

                 if(isset($item['diskon'])){
                    if ($item['diskon'] != 0){
                        $data= PelayananPasienDetail::where('pelayananpasien', $PPnorec)
                            ->where('komponenhargafk',35)
                            ->update([
                                    'hargadiscount' => $item['diskon']]
                            );

                        $data2= PelayananPasien::where('norec', $PPnorec)
                            ->update([
                                    'hargadiscount' => $item['diskon']]
                            );
                    }
                }
            }


                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "simpan PelPasien";
            }

        if ($transStatus == 'true') {
            $transMessage = "Simpan PelayananPasien Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPP' => $PelPasien,
//                'dataPPP' => $PelPasienPetugas,
                'dataPPD' => $PelPasienDetail,
                'dataTuslah' => $dataTuslah,
                'as' => 'ramdanegie',
                'edited' => 'ea@epic',
                'as' => 'as@epic',
            );
        } else {
            $transMessage = "Simpan PelayananPasien Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'dataPP' => $PelPasien,
//                'dataPPP' => $PelPasienPetugas,
//                'dataPPD' => $PelPasienDetail,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//        return $this->respond($requestAll);
    }
    public function saveTindakan(Request $request) {

        //TODO : SAVE TINDAKAN
        DB::beginTransaction();

        // try{

        $antrian = AntrianPasienDiperiksa::where('norec',$request['pelayananpasien'][0]['noregistrasifk'])
            ->update([
                'ispelayananpasien' => true
            ]);
        $totalJasa=0;
        $totJasa=0;
        $penjumlahanJasa=0;
        $penjumlahanJasaTuslah=0;
        $PP = [];
        // return($request['pelayananpasien']);
        // die();
        foreach ($request['pelayananpasien'] as $item){
            // return($item['id_indikator']);
            // die();
            // return(array($item['arrayIndikator']));
            // die();
            $totJasa=0;
            $totalJasa=0;
            $penjumlahanJasa=0;
            $penjumlahanJasaTuslah=0;
//            return $this->respond($item);
            $PelPasien = new PelayananPasien();
            $PelPasien->norec = $PelPasien->generateNewId();
            $PelPasien->kdprofile = 0;
            $PelPasien->statusenabled = true;
    //        $noRegistrasi = $this->generateCode(new PasienDaftar(), 'noregistrasi', 10, $this->getDateTime()->format('ym'));
            $PelPasien->noregistrasifk =  $item['noregistrasifk'];
            $PelPasien->tglregistrasi = $item['tglregistrasi'];
            
            if(isset($item['nofoto'])){
                $PelPasien->nofoto = $item['nofoto'];
            }
            
    //        $PelPasien->aturanpakai = $New_PP['aturanpakai'];
    //        $PelPasien->generik =  $New_PP['generik'];
            $PelPasien->hargadiscount =  $item['diskon']; //0;
            $PelPasien->hargajual =  $item['hargajual'];
            $PelPasien->hargasatuan =  $item['hargasatuan'];
    //        $PelPasien->isdokumentasi =  $New_PP['isdokumentasi'];
    //        $PelPasien->isdosis =  $New_PP['isdosis'];
    //        $PelPasien->isinformasi =  $New_PP['isinformasi'];
    //        $PelPasien->isobat =  $New_PP['isobat'];
    //        $PelPasien->ispasien =  $New_PP['ispasien'];
    //        $PelPasien->isroute =  $New_PP['isroute'];
    //        $PelPasien->iswaktu =  $New_PP['iswaktu'];
    //        $PelPasien->jenisobatfk =  $New_PP['jenisobatfk'];
            $PelPasien->jumlah =  $item['jumlah'];
            $PelPasien->kelasfk =  $item['kelasfk'];
            $PelPasien->kdkelompoktransaksi =  1;
            if(isset( $item['keterangan'])){
                $PelPasien->keteranganlain =  $item['keterangan'];
            }
            //        $PelPasien->keteranganpakai2 =  $New_PP['keteranganpakai2'];
    //        $PelPasien->keteranganpakaifk =  $New_PP['keteranganpakaifk'];
    //        $PelPasien->nilainormal =  $New_PP['nilainormal'];
    //        $PelPasien->nobatch =  $New_PP['nobatch'];
            $PelPasien->piutangpenjamin =  0;
            $PelPasien->piutangrumahsakit = 0;
            $PelPasien->produkfk =  $item['produkfk'];
    //        $PelPasien->routefk =  $New_PP['routefk'];
    //        $PelPasien->status =  $New_PP['status'];
    //        $PelPasien->statusorder =  $New_PP['statusorder'];
            $PelPasien->stock =  1;
    //        $PelPasien->strukorderfk =  $New_PP['strukorderfk'];
            $PelPasien->tglpelayanan =  $item['tglpelayanan'];
            $PelPasien->harganetto =  $item['harganetto'];
    //        $PelPasien->strukfk =  $New_PP['strukfk'];
    //        $PelPasien->isbenar =  $New_PP['isbenar'];
    //        $PelPasien->norectriger =  $New_PP['norectriger'];
    //        $PelPasien->jeniskemasanfk =  $New_PP['jeniskemasanfk'];
    //        $PelPasien->rke =  $New_PP['rke'];
    //        $PelPasien->strukresepfk =  $New_PP['strukresepfk'];
    //        $PelPasien->satuanviewfk =  $New_PP['satuanviewfk'];
    //        $PelPasien->nilaikonversi =  $New_PP['nilaikonversi'];
    //        $PelPasien->strukterimafk =  $New_PP['strukterimafk'];
    //        $PelPasien->dosis =  $New_PP['dosis'];

//            $PelPasien->jasa =  $item['jasacito'];
            $PelPasien->iscito =  $item['iscito'];

            if(isset( $item['isparamedis'])){
                $PelPasien->isparamedis =  $item['isparamedis'];
            }
            if(isset( $item['jenispelayananfk'])){
                $PelPasien->jenispelayananfk =  $item['jenispelayananfk'];
            }
            $PelPasien->objectpegawaipengirimfk =  $item['idpengirim'];

            
            // return($item['id_indikator']);
            // die();
            // return(array($item['arrayIndikator']));
            // die();
            $PelPasien->save();
            $PPnorec = $PelPasien->norec;
            
            if(isset( $item['id_indikator'])){
            //     return('asd');
            //     die();
                if($item['id_indikator'] != null) {
                    // $PelPasien->arrayIndikator = [];
                    // $PelPasien->statIndikator = $item['statIndikator'];
                    $PelPasien->norec_pp = $PPnorec;
                    $PelPasien->indikator = $item['indikator'];
                    $PelPasien->id_indikator = $item['id_indikator'];
                    $PelPasien->objectruanganfk = $item['objectruanganfk'];
                    $PelPasien->objectdepartemenfk = $item['objectdepartemenfk'];
                    $PelPasien->mipfk = $item['mipfk'];
                    $PelPasien->arrayIndikator = $item['arrayIndikator'];
                    $PelPasien->statVariable = $item['statVariable'];
                    $PP[] = $PelPasien;
                }
            }

            // return($PP);
            // die();

            $new_PPP=$item['pelayananpetugas'];
            foreach ($new_PPP as $itemPPP) {
                $detailItemPPP=$itemPPP['listpegawai'];
                foreach ($detailItemPPP as $detailItemPPPz){
                    $PelPasienPetugas = new PelayananPasienPetugas();
                    $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                    $PelPasienPetugas->kdprofile = 0;
                    $PelPasienPetugas->statusenabled = true;
                    $PelPasienPetugas->nomasukfk = $item['noregistrasifk'];
                    $PelPasienPetugas->objectjenispetugaspefk = $itemPPP['objectjenispetugaspefk'];
        //            $PelPasienPetugas->objectasalprodukfk = $itemPPP['objectasalprodukfk'];
                     if ($detailItemPPPz=='undefined'){
                         $PelPasienPetugas->objectpegawaifk = null;
                     }else{

                         $PelPasienPetugas->objectpegawaifk = $detailItemPPPz['id'];
                     }
        //            $PelPasienPetugas->objectprodukfk = $itemPPP['objectprodukfk'];
        //            $PelPasienPetugas->objectruanganfk = $itemPPP['objectruanganfk'];
        //            $PelPasienPetugas->deskripsitugasfungsi = $itemPPP['deskripsitugasfungsi'];
        //            $PelPasienPetugas->ispetugaspepjawab = $itemPPP['ispetugaspepjawab'];
                    $PelPasienPetugas->pelayananpasien = $PPnorec;
        //            $PelPasienPetugas->tglpelayanan = $itemPPP['tglpelayanan'];
                    $PelPasienPetugas->save();
                    $PPPnorec = $PelPasienPetugas->norec;
               }
            }
            //TODO : TARIFF UP TUSLAH
            $dataTuslah = SettingDataFixed::where('id',1222)->get();
            //END TARIFF UP TUSLAH
            foreach ($item['komponenharga'] as $itemKomponen) {
                     $PelPasienDetail = new PelayananPasienDetail();
                     $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                     $PelPasienDetail->kdprofile = 0;
                     $PelPasienDetail->statusenabled =true;
                     $PelPasienDetail->noregistrasifk = $item['noregistrasifk'];
                     //            $PelPasienDetail->tglregistrasi = $New_PPP['tglregistrasi'];
                     $PelPasienDetail->aturanpakai = '-';
                     //            $PelPasienDetail->generik =  $New_PPP['generik'];
                     $PelPasienDetail->hargadiscount = $item['diskon']; //0;
                     $PelPasienDetail->hargajual = $itemKomponen['hargasatuan'];
                     $PelPasienDetail->hargasatuan = $itemKomponen['hargasatuan'];
                     //            $PelPasienDetail->jenisobatfk =  $New_PPP['jenisobatfk'];
                     $PelPasienDetail->jumlah = 1;
                     $PelPasienDetail->keteranganlain = '-';
                     $PelPasienDetail->keteranganpakai2 = '-';
                     //            $PelPasienDetail->keteranganpakaifk =  $New_PPP['keteranganpakaifk'];
                     $PelPasienDetail->komponenhargafk = $itemKomponen['objectkomponenhargafk'];
                     //            $PelPasienDetail->nilainormal =  $New_PPP['nilainormal'];
                     $PelPasienDetail->pelayananpasien = $PPnorec;
                     $PelPasienDetail->piutangpenjamin = 0;
                     $PelPasienDetail->piutangrumahsakit = 0;
                     $PelPasienDetail->produkfk = $item['produkfk'];
                     //            $PelPasienDetail->routefk =  $New_PPP['routefk'];
                     //            $PelPasienDetail->statusorder =  $New_PPP['statusorder'];
                     $PelPasienDetail->stock = 1;
                     //            $PelPasienDetail->strukorderfk =  $New_PPP['strukorderfk'];
                     $PelPasienDetail->tglpelayanan = $item['tglpelayanan'];
                     $PelPasienDetail->harganetto = $itemKomponen['hargasatuan'];
                     //            $PelPasienDetail->strukfk =  $New_PPP['strukfk'];
                     //            $PelPasienDetail->norectriger =  $New_PPP['norectriger'];
                    If($itemKomponen['iscito'] == "1"){
//                        return $this->respond($item['nilaicito']);
                        if ($dataTuslah[0]->nilaifield > 0){
                            $penjumlahanJasa = ($itemKomponen['hargasatuan'] - $item['diskon']) * $item['nilaicito'] ;//$New_PPP['jasa'];
                            $penjumlahanJasaTuslah =  (((float)$itemKomponen['hargasatuan'] * (int)$dataTuslah[0]->nilaifield) /100) ;
                            $totalJasa = $totalJasa +  $penjumlahanJasa + $penjumlahanJasaTuslah;

                            $PelPasienDetail->jasa = $penjumlahanJasa + $penjumlahanJasaTuslah;
                        }else{
                            $penjumlahanJasa = ($itemKomponen['hargasatuan'] - $item['diskon']) * $item['nilaicito'] ;//$New_PPP['jasa'];
                            $PelPasienDetail->jasa = $penjumlahanJasa;
                            $totalJasa = $totalJasa +  $penjumlahanJasa;
                        }
                    }else{
                        if ($dataTuslah[0]->nilaifield > 0){
                            $penjumlahanJasaTuslah = ((float)$itemKomponen['hargasatuan'] * (int)$dataTuslah[0]->nilaifield) /100 ;
                            $PelPasienDetail->jasa = $penjumlahanJasaTuslah;
                            $totalJasa = $totalJasa +  $penjumlahanJasaTuslah;
                        }else{
                            $penjumlahanJasa=0;
                            $PelPasienDetail->jasa = $penjumlahanJasa;
                            $totalJasa = $totalJasa +  $penjumlahanJasa;
                        }
                    }

                     $PelPasienDetail->save();
                     $PPDnorec = $PelPasienDetail->norec;
                     $transStatus = 'true';
                 }


                 if ($item['iscito'] == 1){
                     $dataaa= PelayananPasienDetail::where('pelayananpasien', $PPnorec)->get();
                     foreach ($dataaa as $itemss){
                         $totJasa=$totJasa+$itemss->jasa;
                     }
                     $dataJasa= PelayananPasien::where('norec',$PPnorec)
                         ->update([
                             'jasa' => $totalJasa
                     ]);
                 }


                 if ($dataTuslah[0]->nilaifield > 0){
                     $dataJasa= PelayananPasien::where('norec',$PPnorec)
                         ->update([
                             'istuslah' => 1,
                             'jasa' => $totalJasa
                         ]);
                 }

                 if(isset($item['diskon'])){
	                if ($item['diskon'] != 0){
		                $data= PelayananPasienDetail::where('pelayananpasien', $PPnorec)
			                ->where('komponenhargafk',35)
			                ->update([
					                'hargadiscount' => $item['diskon']]
			                );

		                $data2= PelayananPasien::where('norec', $PPnorec)
			                ->update([
					                'hargadiscount' => $item['diskon']]
			                );
	                }
                }
            }


            //     $transStatus = 'true';
            // } catch (\Exception $e) {
            //     $transStatus = 'false';
            //     $transMessage = "simpan PelPasien";
            // }
//        try{
//            foreach ($request['pelayananpasien'] as $itemzz){
//                 foreach ($itemzz['komponenharga'] as $itemKomponen) {
//                     $PelPasienDetail = new PelayananPasienDetail();
//                     $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
//                     $PelPasienDetail->kdprofile = 0;
//                     $PelPasienDetail->statusenabled = true;
//                     $PelPasienDetail->noregistrasifk = $itemzz['noregistrasifk'];
//                     //            $PelPasienDetail->tglregistrasi = $New_PPP['tglregistrasi'];
//                     $PelPasienDetail->aturanpakai = '-';
//                     //            $PelPasienDetail->generik =  $New_PPP['generik'];
//                     $PelPasienDetail->hargadiscount = 0;
//                     $PelPasienDetail->hargajual = $itemKomponen['hargasatuan'];
//                     $PelPasienDetail->hargasatuan = $itemKomponen['hargasatuan'];
//                     //            $PelPasienDetail->jenisobatfk =  $New_PPP['jenisobatfk'];
//                     $PelPasienDetail->jumlah = 1;
//                     $PelPasienDetail->keteranganlain = '-';
//                     $PelPasienDetail->keteranganpakai2 = '-';
//                     //            $PelPasienDetail->keteranganpakaifk =  $New_PPP['keteranganpakaifk'];
//                     $PelPasienDetail->komponenhargafk = $itemKomponen['objectkomponenhargafk'];
//                     //            $PelPasienDetail->nilainormal =  $New_PPP['nilainormal'];
//                     $PelPasienDetail->pelayananpasien = $PPnorec;
//                     $PelPasienDetail->piutangpenjamin = 0;
//                     $PelPasienDetail->piutangrumahsakit = 0;
//                     $PelPasienDetail->produkfk = $itemzz['produkfk'];
//                     //            $PelPasienDetail->routefk =  $New_PPP['routefk'];
//                     //            $PelPasienDetail->statusorder =  $New_PPP['statusorder'];
//                     $PelPasienDetail->stock = 1;
//                     //            $PelPasienDetail->strukorderfk =  $New_PPP['strukorderfk'];
//                     $PelPasienDetail->tglpelayanan = $itemzz['tglpelayanan'];
//                     $PelPasienDetail->harganetto = $itemKomponen['hargasatuan'];
//                     //            $PelPasienDetail->strukfk =  $New_PPP['strukfk'];
//                     //            $PelPasienDetail->norectriger =  $New_PPP['norectriger'];
//                     //            $PelPasienDetail->jasa =  $New_PPP['jasa'];
//                     $PelPasienDetail->save();
//                     $PPDnorec = $PelPasienDetail->norec;
//                     $transStatus = 'true';
//                 }

//            }
//                $transStatus = 'true';
//        } catch (\Exception $e) {
//                $transStatus = 'false';
//                $transMessage = "simpan Pel Petugas";
//        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan PelayananPasien Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPP' => $PelPasien,
                'PP' => $PP,
//                'dataPPP' => $PelPasienPetugas,
                'dataPPD' => $PelPasienDetail,
                'dataTuslah' => $dataTuslah,
                'as' => 'ramdanegie',
                'edited' => 'ea@epic',
                'as' => 'as@epic',
            );
        } else {
            $transMessage = "Simpan PelayananPasien Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'dataPP' => $PelPasien,
//                'dataPPP' => $PelPasienPetugas,
//                'dataPPD' => $PelPasienDetail,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//        return $this->respond($requestAll);
    }

    public function getIndikatorDaily(Request $request) 
    {

        $room = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('indikatorpelayananpasien_t as ipp', 'ipp.norec_apd', '=', 'apd.norec')
            ->join('mappingindikatortoproduk_m as mip', 'mip.id', '=', 'ipp.objectmappingindikatortoprodukfk')
            ->join('indikatorrensar_m as ind', 'ind.id', '=', 'mip.objectindikatorrensarfk')
            ->select('ind.id')
            ->where('pd.noregistrasi', '=', $request['noregistrasi'])
            ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->groupBy('ind.id')
            ->get();

        // $room = Ruangan::where('id', $request['idruangan'])
        // ->select('namaruangan', 'objectdepartemenfk')
        // ->where('pd.statusenabled', true)
        // ->get();
        // return($room[0]->objectdepartemenfk);
        // die();
        // return($room);
        // die();
        $array = [];
        // if($room[0]->objectdepartemenfk == 16) {
        foreach($room as $roomitem) {

            // return($roomitem->objectruanganfk);
            // die();
        // }
            $date = date('Y-m-d');
            $datas = \DB::table('pasiendaftar_t as pd')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->join('indikatorpelayananpasien_t as ipp', 'ipp.norec_apd', '=', 'apd.norec')
                ->join('mappingindikatortoproduk_m as mip', 'mip.id', '=', 'ipp.objectmappingindikatortoprodukfk')
                ->join('indikatorrensar_m as ind', 'ind.id', '=', 'mip.objectindikatorrensarfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                // ->join('detail_ipp_t as dipp', 'dipp.ippfk', '=', 'ipp.norec')
                ->select('ipp.norec', 'ipp.norec_apd', 'ipp.norec_pp', 'ipp.objectmappingindikatortoprodukfk', 'ipp.objectsasaranmutufk', 'ind.indikator', 'mip.id as mipfk', 'ind.id as id_indikator', 'apd.objectruanganfk as asalruanganfk', 'ipp.tgl_indikator', 'ipp.flag', 'ru.objectdepartemenfk'
                // , 'dipp.ippfk as ippfk'
                )
                ->where('pd.noregistrasi', '=', $request['noregistrasi'])
                ->where('ind.id', $roomitem->id)
                ->where('pd.statusenabled', true)
                ->where('apd.statusenabled', true)
                // ->where('apd.objectruanganfk', $request['idruangan'])
                // ->wherein('apd.objectruanganfk', [$request['idruangan'], 44, 277, 309])
                // ->where('ipp.flag', true)
                ->orderBy('ipp.objectmappingindikatortoprodukfk', 'DESC')
                ->orderBy('ipp.tgl_indikator', 'DESC')
                ->orderBy('ru.objectdepartemenfk', 'ASC')
                ->orderBy('ipp.flag', 'ASC')
                // ->orderBy('dipp.norec', 'ASC')
                ->get();
            // return($datas);
            // die();
    
                $no = 0;
                $id_indikator = 0;
                $nofk = 0;
                $flag = 1;
                foreach ($datas as $items) {
                    // return($items->norec);
                    // die();
                    // if($flag == $items->flag) {
                    // if ($id_indikator != $items->id_indikator) {
                    //     $flag = 1;
                    // } else {
                    //     $flag = 0;
                    // }
                    $flag = 1;
                    if ($id_indikator != $items->id_indikator) {
                        $id_indikator = $items->id_indikator;
                        if($flag == $items->flag) {
                            $data = \DB::table('indikatorpelayananpasien_t as ipp')
                                // ->join('indikatorpelayananpasien_t as ipp', 'ipp.norec_apd', '=', 'apd.norec')
                                ->join('detail_ipp_t as dipp', 'dipp.ippfk', '=', 'ipp.norec')
                                ->select('dipp.*')
                                ->where('ipp.norec_apd', '=', $items->norec_apd)
                                ->whereRaw("format( dipp.tgl_indikator, 'yyyy-MM-dd')  = '$date' ")
                                ->get();
                                // return($data);
                                // die();
            
                            // $array1[] = array(
                            //     'norec_ipp' => $items->norec,
                            //     'mipfk' => $items->mipfk
                            // );
                            if(COUNT($data) == 0) {
                                    // return($datas);
                                    // die();
                                // if($no == 1) {
                                    $array[] = array(
                                        'norec_ipp' => $items->norec,
                                        'norec_pp' => $items->norec_pp,
                                        'norec_apd' => $items->norec_apd,
                                        'objectmappingindikatortoprodukfk' => $items->objectmappingindikatortoprodukfk,
                                        'objectsasaranmutufk' => $items->objectsasaranmutufk,
                                        'indikator' => $items->indikator,
                                        'id_indikator' => $items->id_indikator,
                                        'asalruanganfk' => $items->asalruanganfk,
                                        'objectdepartemenfk' => $items->objectdepartemenfk,
                                        'date' => $date
                                    );
                                    $no = 0;
                                // } else {
                                //     $no = $no + 1;
                                // }
                                // return($items->norec);
                                // die();
                                // $array[] = array(
                                //     'norec_ipp' => $items->norec,
                                //     'norec_pp' => $items->noregistrasifk,
                                //     'objectmappingindikatortoprodukfk' => $items->objectmappingindikatortoprodukfk,
                                //     'objectsasaranmutufk' => $items->objectsasaranmutufk,
                                //     'indikator' => $items->indikator,
                                //     'id_indikator' => $items->id_indikator,
                                //     'asalruanganfk' => $items->asalruanganfk,
                                //     'date' => $date
                                // );
                            }
                            // $flag = 0;
                        } else {
                            $flag = 0;
                        }
                    }
                }
        }
        
            // return($array);
            // die();

            
            $result = array(
                'data' => $array,
                'message' => 'egie@epic'
            );
            return $this->respond($result);

        // $data = \DB::table('pasiendaftar_t as pd')
        //     ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        //     ->join('indikatorpelayananpasien_t as ipp', 'ipp.norec_apd', '=', 'apd.norec')
        //     ->join('mappingindikatortoproduk_m as mip', 'mip.id', '=', 'ipp.objectmappingindikatortoprodukfk')
        //     ->join('detail_ipp_t as dipp', 'dipp.ippfk', '=', 'ipp.norec')
        //     ->join('indikatorrensar_m as ind', 'ind.id', '=', 'mip.objectindikatorrensarfk')
        //     ->select('dipp.*')
        //     ->where('pd.noregistrasi', '=', $request['noregistrasi'])
        //     ->where('apd.objectruanganfk', $request['idruangan'])
        //     ->whereRaw("format( dipp.tgl_indikator, 'yyyy-MM-dd')  = '$date' ");
        // //            ->where('rm.kodeexternal','igd');
        // if (isset($request['riwayatfk']) && $request['riwayatfk'] != '') {
        //     $data = $data->where('rm.riwayatpapfk', '=', $request['riwayatfk']);
        // }
        // if (isset($request['Nocm']) && $request['Nocm'] != '') {
        //     $data = $data->where('rm.nocm', '=', $request['Nocm']);
        // }
        // if (isset($request['kodeExt']) && $request['kodeExt'] != '') {
        //     $data = $data->where('rm.jenisskrining', '=', $request['kodeExt']);
        // }

        // $data = $data->get();
    }
    
    public function saveTindakanPPI(Request $request)
    {
        DB::beginTransaction();
        // $dataReq = $request->all();
        // return($dataReq);
        // die();

        // try {
            // return($request['datas']);
            // die();
            foreach ($request['datas'] as $key => $value) {
                // $data = \DB::table('indikatorpelayananpasien_t as ipp')
                //     ->join('mappingindikatortoproduk_m as mip', 'mip.id', '=', 'ipp.objectmappingindikatortoprodukfk')
                //     ->select('mip.id', 'ipp.flag', 'ipp.norec')
                //     ->where('mip.id', $value['mipfk'])
                //     ->where('ipp.norec_apd', $request['norec_apd'])
                //     ->where('ipp.flag', true)
                //     ->distinct()
                //     ->get();
                //     return($data);
                //     die();
                //     foreach ($data as $item) {
                //         $indikatorPP->norec = $item->norec;
                //     }
                    // return(count($data));
                    // die();
                $date = date_format(date_create($value['tglpelayanan']), "Y-m-d");
                $dates = date_format(date_create($value['tglpelayanan']), "Y-m-d 00:00:00");
                // return($value['arrayIndikator']);
                // die();
                $dataSave = SasaranMutu::where('indikatorfk', $value['id_indikator'])
                ->where('departemenfk', $value['objectdepartemenfk'])
                ->where('ruanganfk', $value['objectruanganfk'])
                ->where('tgl', $date)
                ->get();
                // return($dataSave);
                // die();
                // return($value['norec']);
                // die();
                if(count($dataSave) > 1) {
                    foreach ($dataSave as $itemSave) {

                        if($itemSave->keterangan == 'NUM' && $value['statVariable'] == true) {
                            $nilai = $itemSave->nilai + 1;
                            if($value['objectdepartemenfk'] == 25) {
                            } else {
                                $dataSaveInd = SasaranMutu::where('norec', $itemSave->norec)
                                ->update([
                                    'nilai' => $nilai
                                ]);
                            }

                            // $dataSave = IndikatorPelayananPasien::where('ruanganfk', $value['objectruanganfk'])
                            // ->join('mappingindikatortoproduk_m as mip', 'mip.norec', '=', '')
                            // ->where('indikatorfk', $value['id_indikator'])
                            // ->where('tgl', $date)
                            // ->get();
                            $indikatorPP = new IndikatorPelayananPasien();
                            $indikatorPP->norec = $indikatorPP->generateNewId();
                            $indikatorPP->kdprofile = 12;
                            $indikatorPP->statusenabled = true;
                            if($value['objectdepartemenfk'] == 25) {
                                $indikatorPP->tgl_indikator = NULL;
                            } else {
                                $indikatorPP->tgl_indikator = $value['tglpelayanan'];
                            }
                            $indikatorPP->norec_pp = $value['norec_pp'];
                            $indikatorPP->objectmappingindikatortoprodukfk = $value['mipfk'];
                            $indikatorPP->objectsasaranmutufk = $itemSave->norec;
                            $indikatorPP->norec_apd = $request['norec_apd'];
                            $indikatorPP->ruanganfk = $value['objectruanganfk'];
                            $indikatorPP->flag = true;
                            $indikatorPP->save();
                        } else if($itemSave->keterangan == 'DENUM'){
                        // if($itemSave->keterangan == 'NUM' && $value['statIndikator'] == true) {
                            // return('Masuk CUyy');
                            // die();
                            // if($value['statIndikator'] == true) {
                            $nilai = $itemSave->nilai + 1;
                            // $denum = $dataSave->denum + 1;
                            if($value['objectdepartemenfk'] == 25) {
                            } else {
                                $dataSaveInd = SasaranMutu::where('norec', $itemSave->norec)
                                ->update([
                                    'nilai' => $nilai
                                ]);
                            }
                            
                            $indikatorPP = new IndikatorPelayananPasien();
                            $indikatorPP->norec = $indikatorPP->generateNewId();
                            $indikatorPP->kdprofile = 12;
                            $indikatorPP->statusenabled = true;
                            if($value['objectdepartemenfk'] == 25) {
                                $indikatorPP->tgl_indikator = NULL;
                            } else {
                                $indikatorPP->tgl_indikator = $value['tglpelayanan'];
                            }
                            $indikatorPP->norec_pp = $value['norec_pp'];
                            $indikatorPP->objectmappingindikatortoprodukfk = $value['mipfk'];
                            $indikatorPP->objectsasaranmutufk = $itemSave->norec;
                            $indikatorPP->norec_apd = $request['norec_apd'];
                            $indikatorPP->ruanganfk = $value['objectruanganfk'];
                            $indikatorPP->flag = true;
                            $indikatorPP->save();
                                
                        }
                        
                        //  else if($itemSave->keterangan == 'DENUM' && $value['statIndikator'] == false) {
                        //     return('Masuk CUyy');
                        //     die();
                        //     $nilai = $itemSave->nilai + 1;
                        //     // $denum = $dataSave->denum + 1;
                        //     $dataSaveInd = SasaranMutu::where('norec', $itemSave->norec)
                        //     ->update([
                        //         'nilai' => $nilai
                        //     ]);
                        // }
                    }
                    
                    if($value['objectdepartemenfk'] == 25) {
                        $indikatorPP->tgl_indikator = NULL;
                    } else {
                        foreach ($value['arrayIndikator'] as $valueInd) {
                            // return($valueInd);
                            // die();
                            # code...
                            $detailIPP = new DetailIPP();
                            $detailIPP->norec = $detailIPP->generateNewId();
                            $detailIPP->statusenabled = true;
                            $detailIPP->tgl_indikator = $value['tglpelayanan'];
                            $detailIPP->ippfk = $indikatorPP->norec;
                            $detailIPP->num = $valueInd['status'];
                            $detailIPP->dirfk = $valueInd['id_dir'];
                            $detailIPP->save();
                        }
                    }
                } else {
                    if($value['statVariable'] == true) {
                        $sasaranMutuNum = new SasaranMutu();
                        $sasaranMutuNum->norec = $sasaranMutuNum->generateNewId();
                        $sasaranMutuNum->kdprofile = 0;
                        $sasaranMutuNum->statusenabled = true;
                        $sasaranMutuNum->indikatorfk = $value['id_indikator'];
                        $sasaranMutuNum->tglnilai = $dates;
                        if($value['objectdepartemenfk'] == 25) {
                            $sasaranMutuNum->nilai = 0;
                        } else {
                            $sasaranMutuNum->nilai = 1;
                        }
                        $sasaranMutuNum->num = 0;
                        $sasaranMutuNum->denum = 0;
                        $sasaranMutuNum->capaian = 1;
                        $sasaranMutuNum->tgl = $date;
                        $sasaranMutuNum->keterangan = 'NUM';
                        $sasaranMutuNum->ruanganfk = $value['objectruanganfk'];
                        $sasaranMutuNum->departemenfk = $value['objectdepartemenfk'];
                        $sasaranMutuNum->statusVerif = NULL;
                        $sasaranMutuNum->save();
                        
                        $sasaranMutuDenum = new SasaranMutu();
                        $sasaranMutuDenum->norec = $sasaranMutuDenum->generateNewId();
                        $sasaranMutuDenum->kdprofile = 0;
                        $sasaranMutuDenum->statusenabled = true;
                        $sasaranMutuDenum->indikatorfk = $value['id_indikator'];
                        $sasaranMutuDenum->tglnilai = $dates;
                        if($value['objectdepartemenfk'] == 25) {
                            $sasaranMutuDenum->nilai = 0;
                        } else {
                            $sasaranMutuDenum->nilai = 1;
                        }
                        $sasaranMutuDenum->num = 0;
                        $sasaranMutuDenum->denum = 0;
                        $sasaranMutuDenum->capaian = 1;
                        $sasaranMutuDenum->tgl = $date;
                        $sasaranMutuDenum->keterangan = 'DENUM';
                        $sasaranMutuDenum->ruanganfk = $value['objectruanganfk'];
                        $sasaranMutuDenum->departemenfk = $value['objectdepartemenfk'];
                        $sasaranMutuDenum->statusVerif = NULL;
                        $sasaranMutuDenum->save();
                        
                        
                        $indikatorPP = new IndikatorPelayananPasien();
                        $indikatorPP->norec = $indikatorPP->generateNewId();
                        $indikatorPP->kdprofile = 12;
                        $indikatorPP->statusenabled = true;
                        
                        if($value['objectdepartemenfk'] == 25) {
                            $indikatorPP->tgl_indikator = NULL;
                        } else {
                            $indikatorPP->tgl_indikator = $value['tglpelayanan'];
                        }
                        $indikatorPP->norec_pp = $value['norec_pp'];
                        $indikatorPP->objectmappingindikatortoprodukfk = $value['mipfk'];
                        $indikatorPP->objectsasaranmutufk = $sasaranMutuNum->norec;
                        $indikatorPP->norec_apd = $request['norec_apd'];
                        $indikatorPP->ruanganfk = $value['objectruanganfk'];
                        $indikatorPP->flag = true;
                        $indikatorPP->save(); 

                        $indikatorPP = new IndikatorPelayananPasien();
                        $indikatorPP->norec = $indikatorPP->generateNewId();
                        $indikatorPP->kdprofile = 12;
                        $indikatorPP->statusenabled = true;
                        if($value['objectdepartemenfk'] == 25) {
                            $indikatorPP->tgl_indikator = NULL;
                        } else {
                            $indikatorPP->tgl_indikator = $value['tglpelayanan'];
                        }
                        $indikatorPP->norec_pp = $value['norec_pp'];
                        $indikatorPP->objectmappingindikatortoprodukfk = $value['mipfk'];
                        $indikatorPP->objectsasaranmutufk = $sasaranMutuDenum->norec;
                        $indikatorPP->norec_apd = $request['norec_apd'];
                        $indikatorPP->ruanganfk = $value['objectruanganfk'];
                        $indikatorPP->flag = true;
                        $indikatorPP->save();
                        
                    
                        if($value['objectdepartemenfk'] == 25) {
                            $indikatorPP->tgl_indikator = NULL;
                        } else {
                            foreach ($value['arrayIndikator'] as $valueInd) {
                                // return($valueInd);
                                // die();
                                # code...
                                $detailIPP = new DetailIPP();
                                $detailIPP->norec = $detailIPP->generateNewId();
                                $detailIPP->statusenabled = true;
                                $detailIPP->tgl_indikator = $value['tglpelayanan'];
                                $detailIPP->ippfk = $indikatorPP->norec;
                                $detailIPP->num = $valueInd['status'];
                                $detailIPP->dirfk = $valueInd['id_dir'];
                                $detailIPP->save();
                            }
                        }
                        // $detailIPP = new DetailIPP();
                        // $detailIPP->norec = $detailIPP->generateNewId();
                        // $detailIPP->statusenabled = true;
                        // $detailIPP->tgl_indikator = $value['tglpelayanan'];
                        // $detailIPP->ippfk = $indikatorPP->norec;
                        // $detailIPP->num = $value['statVariable'];
                        // $detailIPP->save();
                    } else if($value['statVariable'] == false) {
                        $sasaranMutuNum = new SasaranMutu();
                        $sasaranMutuNum->norec = $sasaranMutuNum->generateNewId();
                        $sasaranMutuNum->kdprofile = 0;
                        $sasaranMutuNum->statusenabled = true;
                        $sasaranMutuNum->indikatorfk = $value['id_indikator'];
                        $sasaranMutuNum->tglnilai = $dates;
                        if($value['objectdepartemenfk'] == 25) {
                            $sasaranMutuNum->nilai = 0;
                        } else {
                            $sasaranMutuNum->nilai = 0;
                        }
                        $sasaranMutuNum->num = 0;
                        $sasaranMutuNum->denum = 0;
                        $sasaranMutuNum->capaian = 1;
                        $sasaranMutuNum->tgl = $date;
                        $sasaranMutuNum->keterangan = 'NUM';
                        $sasaranMutuNum->ruanganfk = $value['objectruanganfk'];
                        $sasaranMutuNum->departemenfk = $value['objectdepartemenfk'];
                        $sasaranMutuNum->statusVerif = NULL;
                        $sasaranMutuNum->save();
                        
                        $sasaranMutuDenum = new SasaranMutu();
                        $sasaranMutuDenum->norec = $sasaranMutuDenum->generateNewId();
                        $sasaranMutuDenum->kdprofile = 0;
                        $sasaranMutuDenum->statusenabled = true;
                        $sasaranMutuDenum->indikatorfk = $value['id_indikator'];
                        $sasaranMutuDenum->tglnilai = $dates;
                        if($value['objectdepartemenfk'] == 25) {
                            $sasaranMutuDenum->nilai = 0;
                        } else {
                            $sasaranMutuDenum->nilai = 1;
                        }
                        $sasaranMutuDenum->num = 0;
                        $sasaranMutuDenum->denum = 0;
                        $sasaranMutuDenum->capaian = 1;
                        $sasaranMutuDenum->tgl = $date;
                        $sasaranMutuDenum->keterangan = 'DENUM';
                        $sasaranMutuDenum->ruanganfk = $value['objectruanganfk'];
                        $sasaranMutuDenum->departemenfk = $value['objectdepartemenfk'];
                        $sasaranMutuDenum->statusVerif = NULL;
                        $sasaranMutuDenum->save();
                        
                        $indikatorPP = new IndikatorPelayananPasien();
                        $indikatorPP->norec = $indikatorPP->generateNewId();
                        $indikatorPP->kdprofile = 12;
                        $indikatorPP->statusenabled = true;
                        if($value['objectdepartemenfk'] == 25) {
                            $indikatorPP->tgl_indikator = NULL;
                        } else {
                            $indikatorPP->tgl_indikator = $value['tglpelayanan'];
                        }
                        $indikatorPP->norec_pp = $value['norec_pp'];
                        $indikatorPP->objectmappingindikatortoprodukfk = $value['mipfk'];
                        $indikatorPP->objectsasaranmutufk = $sasaranMutuDenum->norec;
                        $indikatorPP->norec_apd = $request['norec_apd'];
                        $indikatorPP->ruanganfk = $value['objectruanganfk'];
                        $indikatorPP->flag = true;
                        $indikatorPP->save();
                        
                        $indikatorPP = new IndikatorPelayananPasien();
                        $indikatorPP->norec = $indikatorPP->generateNewId();
                        $indikatorPP->kdprofile = 12;
                        $indikatorPP->statusenabled = true;
                        if($value['objectdepartemenfk'] == 25) {
                            $indikatorPP->tgl_indikator = NULL;
                        } else {
                            $indikatorPP->tgl_indikator = $value['tglpelayanan'];
                        }
                        $indikatorPP->norec_pp = $value['norec_pp'];
                        $indikatorPP->objectmappingindikatortoprodukfk = $value['mipfk'];
                        $indikatorPP->objectsasaranmutufk = $sasaranMutuNum->norec;
                        $indikatorPP->norec_apd = $request['norec_apd'];
                        $indikatorPP->ruanganfk = $value['objectruanganfk'];
                        $indikatorPP->flag = true;
                        $indikatorPP->save();
                    
                        
                        if($value['objectdepartemenfk'] == 25) {
                            $indikatorPP->tgl_indikator = NULL;
                        } else {
                            foreach ($value['arrayIndikator'] as $valueInd) {
                                // return($valueInd);
                                // die();
                                # code...
                                $detailIPP = new DetailIPP();
                                $detailIPP->norec = $detailIPP->generateNewId();
                                $detailIPP->statusenabled = true;
                                $detailIPP->tgl_indikator = $value['tglpelayanan'];
                                $detailIPP->ippfk = $indikatorPP->norec;
                                $detailIPP->num = $valueInd['status'];
                                $detailIPP->dirfk = $valueInd['id_dir'];
                                $detailIPP->save();
                            }
                        }
                        // $detailIPP = new DetailIPP();
                        // $detailIPP->norec = $detailIPP->generateNewId();
                        // $detailIPP->statusenabled = true;
                        // $detailIPP->tgl_indikator = $value['tglpelayanan'];
                        // $detailIPP->ippfk = $indikatorPP->norec;
                        // $detailIPP->num = $value['statVariable'];
                        // $detailIPP->save();
                    }
                }




                // if ($value['norec'] == '') {
                //     $dataSave = new KepatuhanHandHygiene();
                //     $dataSave->norec = $dataSave->generateNewId();
                //     $dataSave->kdprofile = 0;
                //     $dataSave->statusenabled = true;
                //     # code...
                // } else {
    
                //     // return($value['tanggal']);
                //     // die();
                //     $dataSave = KepatuhanHandHygiene::where('norec', $value['norec'])->first();
                // }
                // $dataSave->tanggal = $value['tanggal'];
                // $dataSave->objectjenispegawaifk = $value['objectjenispegawaifk'];
                // $dataSave->objectpegawaifk = $value['objectpegawaifk'];
                // $dataSave->objectindikasifk = $value['objectindikasifk'];
                // $dataSave->objecthygienefk = $value['objecthygienefk'];
                // $dataSave->langkah = $value['langkah'];
                // $dataSave->objectruanganfk = $value['objectruanganfk'];
                // $dataSave->kesempatan = $value['kesempatan'];
    
                // $dataSave->save();
    
    
                // $transStatus = 1;
            }
        // } catch (\Exception $e) {
        //     $transStatus = false;
        // }

        $transStatus = 'true';
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataSave,
                "as" => 'afd@epic',
            );
        } else {
            $transMessage = " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'afd@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    
    public function updateTanggalPPI(Request $request)
    {
        // return($request['norec_ipp']);
        // die();
        DB::beginTransaction();
        try {
            // return($request['objectsasaranmutufk'])
            // $so = StrukOrder::where('norec', $request['norec'])->first();
            // if ($so->statusorder == 5) {
            //     $transMessage = "Tidak Bisa dihapus sudah Di Verifikasi";
            //     $result = array(
            //         "status" => 400,
            //         "message" => $transMessage,
            //         "as" => 'er@epic',
            //     );
            //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            // }
            // return($request['norec_apd']);
            // die();
            $data = IndikatorPelayananPasien::where('norec', $request['norec_ipp'])->update([
                'tgl_indikator' => $request['tgl_indikator'],
                'flag' => false
            ]);
            
            
            $dat = IndikatorPelayananPasien::where('norec', $request['norec_ipp'])
            ->get();
            // return($dat);
            // die();

            foreach ($dat as $value) {
                foreach ($request['arrayIndikator'] as $valueInd) {
                    // return($valueInd);
                    // die();
                    # code...
                    $detailIPP = new DetailIPP();
                    $detailIPP->norec = $detailIPP->generateNewId();
                    $detailIPP->statusenabled = true;
                    $detailIPP->tgl_indikator = $request['tgl_indikator'];
                    $detailIPP->ippfk = $value['norec'];
                    $detailIPP->num = $valueInd['status'];
                    $detailIPP->dirfk = $valueInd['id_dir'];
                    $detailIPP->save();
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terupdate";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                    "strukorder" => $dataSO,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getKomponenHarga(Request $request)
    {
        // return($request['norecApd']);
        // die();
        //TODO :GET HARGA & HARGA KOMPONEN
//        $dataLogin = $request->all();
        $data = \DB::table('harganettoprodukbykelasd_m as hnp')
            ->join ('mapruangantoproduk_m as mpr ','mpr.objectprodukfk','=','hnp.objectprodukfk')
//            ->join ('harganettoprodukbykelasd_m as hnpd','hnpd.objectprodukfk','=','mpr.objectprodukfk')
            ->join ('produk_m as prd','prd.id','=','mpr.objectprodukfk')
            ->join ('komponenharga_m as kh','kh.id','=','hnp.objectkomponenhargafk')
            ->join ('kelas_m as kls','kls.id','=','hnp.objectkelasfk')
            ->join ('ruangan_m as ru', 'ru.id','=','mpr.objectruanganfk')
            ->select('hnp.objectkomponenhargafk','kh.komponenharga','hnp.hargasatuan','mpr.objectprodukfk','kh.iscito')

            ->where('mpr.objectruanganfk',$request['idRuangan'])
            ->where('hnp.objectkelasfk',$request['idKelas'])
            ->where('mpr.objectprodukfk',$request['idProduk'])
           ->where('hnp.objectjenispelayananfk',$request['idJenisPelayanan'])
            ->where('mpr.statusenabled',true)
            ->where('hnp.statusenabled',true)
            // ->where('sk.statusenabled',true)
            ->where('prd.statusenabled',true)
//            ->where('mpr.statusenabled',true)
//            ->where('hnp.statusenabled',true)
//            ->where('prd.statusenabled',true)
            // ->where('mpr.kodeexternal','2017')
//            ->where('hnp.kodeexternal', '2017')
//            ->where('prd.kodeexternal','2017')
            ;

//        $data = $data->groupBy('prd.namaproduk','hnp.objectkomponenhargafk','kh.komponenharga','hnp.hargasatuan','mpr.objectprodukfk');
        $data = $data->distinct();
        $data = $data->get();


        $data2 = \DB::table('harganettoprodukbykelas_m as hnp')
            ->join ('mapruangantoproduk_m as mpr ','mpr.objectprodukfk','=','hnp.objectprodukfk')
//            ->join ('harganettoprodukbykelasd_m as hnpd','hnpd.objectprodukfk','=','mpr.objectprodukfk')
            ->join ('produk_m as prd','prd.id','=','mpr.objectprodukfk')
            ->join ('kelas_m as kls','kls.id','=','hnp.objectkelasfk')
            ->join ('ruangan_m as ru', 'ru.id','=','mpr.objectruanganfk')
            ->join ('suratkeputusan_m as sk', 'hnp.suratkeputusanfk','=','sk.id')
            ->select('mpr.objectprodukfk','prd.id','prd.namaproduk','hnp.hargasatuan','hnp.objectkelasfk',
                'kls.namakelas','mpr.objectruanganfk','ru.namaruangan',
                'prd.namaproduk'
            )
            ->where('mpr.objectruanganfk',$request['idRuangan'])
            ->where('hnp.objectkelasfk',$request['idKelas'])
            ->where('mpr.objectprodukfk',$request['idProduk'])
           ->where('hnp.objectjenispelayananfk',$request['idJenisPelayanan'])
            ->where('hnp.statusenabled',true)
            ->where('sk.statusenabled',true)
            ->where('mpr.statusenabled',true)
            ->where('prd.statusenabled',true);
        $data2 = $data2->distinct();
        $data2 = $data2->get();

        $data3 = \DB::table('mappingindikatortoproduk_m as mip')
            ->Join('indikatorrensar_m as ir', 'ir.id', '=', 'mip.objectindikatorrensarfk')
            ->Join('detailindikatorrensar_m as dir', 'dir.irfk', '=', 'ir.id')
            ->select('ir.indikator', 'ir.id as id_indikator', 'mip.id as mipfk', 'dir.id as id_dir', 'dir.pertanyaan', 'dir.type', 'dir.nourut', 'dir.bobot', 'dir.flag', 'mip.objectindikatorrensarfk', DB::raw(" '' as status, '' as flagtrue, '' as flagfalse"))
            ->where('mip.objectprodukfk',$request['idProduk'])
            ->where('mip.objectdepartemenfk',$request['idDepartemen'])
            ->get();

        $data4 =  \DB::table('antrianpasiendiperiksa_t as apd')
            ->Join('indikatorpelayananpasien_t as ipp', 'ipp.norec_apd', '=', 'apd.norec')
            ->Join('mappingindikatortoproduk_m as mip', 'mip.id', '=', 'ipp.objectmappingindikatortoprodukfk')
            ->select('mip.objectindikatorrensarfk', 'ipp.tgl_indikator', 'ipp.flag')
            ->where('apd.norec',$request['norecApd'])
            // ->where('mip.objectindikatorrensarfk', $data3[0]->objectindikatorrensarfk)
            // ->where('mip.objectprodukfk',$request['idProduk'])
            ->orderBy('mip.objectindikatorrensarfk', 'DESC')
            ->orderBy('ipp.tgl_indikator', 'DESC')
            ->orderBy('ipp.flag', 'ASC')
            // ->orderBy('ipp.flag',true)
            // ->take(1)
            ->get();

        // return($data4);
        // die();
        if(count($data3) > 0) {
            // return($data4);
            // die();
            $id_indikator = $data3[0]->id_indikator;
            $objectindikatorrensarfk = $data3[0]->objectindikatorrensarfk;
            // return($objectindikatorrensarfk);
            // die();
            // if ($mipfk == $items->mipfk) {
            //     $mipfk = $items->mipfk;
            // if($data4[0]->flag == 1) {
                // $stat = false;
                foreach ($data4 as $item4) {
                    // if($mipfk == $item4->mipfk) {
                        // return($item4);
                        // die();
                        if($id_indikator == $item4->objectindikatorrensarfk && $item4->flag == '0') {
                            // if($id_indikator == $item4->objectindikatorrensarfk){
                                $data3 = [];
                            // }
                        }
                        // return($item4->objectindikatorrensarfk);
                        // die();
                    // }
                }
            // } else {
            //     $data3 = [];
            }
            // }
        // }



        $result = array(
            'data' => $data,
            'data2' => $data2,
            'data3' => $data3,
            'message' => 'ramdanegie',
            'edited' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getListPertanyaan(Request $request)
    {
        $data =  \DB::table('mappingindikatortoproduk_m as mip')
        ->Join('indikatorrensar_m as ir', 'ir.id', '=', 'mip.objectindikatorrensarfk')
        ->Join('detailindikatorrensar_m as dir', 'dir.irfk', '=', 'ir.id')
        ->select('ir.indikator', 'ir.id as id_indikator', 'mip.id as mipfk', 'dir.id as id_dir', 'dir.pertanyaan', 'dir.type', 'dir.nourut', 'dir.bobot', 'dir.flag', DB::raw(" '' as status, '' as flagtrue, '' as flagfalse"))
        ->where('mip.id',$request['objectmappingindikatortoprodukfk'])
        ->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
            'edited' => 'as@epic',
        );

        return $this->respond($result);
    }

    //  public function cektindakan(Request $request)
    // {
    //     //TODO :GET HARGA & HARGA KOMPONEN
    //    $dataLogin = $request->all();
        
    //     foreach ($request['pelayananpasien'] as $item) {
    //         $datax = \DB::table('pasiendaftar_t as pd')
    //             // ->leftjoin ('rekanan_m as rk','pd.objectrekananfk','=','rk.id')
    //             ->select('pd.objectkelompokpasienlastfk')
    //             ->where('pd.noregistrasi',$item['noregistrasi'])
    //             ->get();

    //             //BPJS bisa input berkali"
    //         // foreach ($datax as $item2x) {
    //         //     if($item2x->objectkelompokpasienlastfk != 2) {
    //         //         // return('a');
    //         //         // die();
    //         //             $result = array(
    //         //                 'data' => 'lolos',
    //         //             );
    //         //             return $this->respond($result);

    //         //     }   
    //         // }
    //         $data = \DB::table('produk_m as pr')
    //             ->where('pr.id',$item['produkfk'])
    //             ->get();
    //         foreach ($data as $item2) {
    //             $maxqty = $item2->maxqty;
    //             $maxhari = $item2->maxhari;
    //             $namapelayanan = $item2->namaproduk;
    //         }
    //         // return($item['tglpelayanan']);
    //         // die();
    //         if($maxqty < $item['jumlah']){
    //             $result = array(
    //                 'data' => 'Pelayanan ' . $namapelayanan . ' Hanya Bisa Diinput Dengan Jumlah Maksimal Sebanyak ' . $maxqty .' dalam Satu Kali Penginputan'
    //             );

    //             return $this->respond($result);
    //         }

    //         // $jumlahdatatindakan = PelayananPasien::where('noregistrasifk',$request['noregistrasifk'])
    //         //             ->where('produkfk',$item['produkfk'])
    //         //             ->orderBy('tglpelayanan','desc')
    //         //             ->get();

    //         $datatindakan = collect(DB::select("
    //                 select top 1 tglpelayanan from pelayananpasien_t WHERE  produkfk= '".$item['produkfk']."' and noregistrasifk='".$item['noregistrasifk']."' order by tglpelayanan desc
    //             "))->first();
    //             // return($datatindakan->tglpelayanan);

                
    //         // $jml = collect(DB::select("
    //         // select count(".$item['produkfk'].") as jml from pelayananpasien_t WHERE  produkfk= '".$item['produkfk']."' and noregistrasifk='".$item['noregistrasifk']."' and tglpelayanan='".$datatindakan->tglpelayanan."' order by ".$item['produkfk']."
    //         // "))->first();
            
    //         if(!empty($datatindakan)){
    //             $tglmasuk =date_format(date_create($datatindakan->tglpelayanan),'Y-m-d');
    //             $tglpelayanan =date_format(date_create($item['tglpelayanan']),'Y-m-d');
    //             $tglkeluar =date_format(date_create( date('Y-m-d H:i:s')),'Y-m-d');
                
    //             $tglmasuk1 = strtotime($tglmasuk);
    //             $tglkeluar1 = strtotime($tglkeluar);
    //             $diffs= $tglkeluar1-$tglmasuk1;
    //             $dayss = floor($diffs / (3600 * 24));;
    //             $selisih = $dayss;
    //             // return($datatindakan->tglpelayanan);
    //             // return($tglpelayanan);
                
    //             $jmldata = collect(DB::select("
    //             select count(produkfk) AS jumlah from pelayananpasien_t WHERE  produkfk= '".$item['produkfk']."' and noregistrasifk='".$item['noregistrasifk']."' and convert(date, tglpelayanan)='".$tglpelayanan."' group by produkfk
    //             "))->first();
                
                
    //             if(!empty($jmldata)){
    //                 $jml = $jmldata->jumlah;
    //                 // return($selisih);
    //                 // if ($selisih > '0'){
    //                 //     $result = array(
    //                 //         'data' => 'lolos',
    //                 //     );
                
    //                 //     return $this->respond($result);
    //                 // } else 
    //                 if ($maxhari > $jml) {
    //                     $result = array(
    //                         'data' => 'lolos',
    //                     );
    //                     return $this->respond($result);
    //                 } else {
    //                     $result = array(
    //                         'data' => 'Pelayanan ' . $namapelayanan . ' Hanya Bisa Di input ' .$maxhari.'x dalam 1 hari'
    //                     );
    //                     return $this->respond($result);
    //                 }                        
    //             } else {
    //                 $result = array(
    //                     'data' => 'lolos',
    //                 );
            
    //                 return $this->respond($result);
    //             }
    //         } else {
    //             $result = array(
    //                 'data' => 'lolos',
    //             );
        
    //             return $this->respond($result);
    //         }                     
    //     }
    // }
    public function cektindakan(Request $request)
    {
        //TODO :GET HARGA & HARGA KOMPONEN
       $dataLogin = $request->all();
        // return ('x');
        // die();
        foreach ($request['pelayananpasien'] as $item) {
            // return($item['objectkelompokpasien']);
            // die();
         
            if($item['objectkelompokpasien'] != '1') {

                $datax = \DB::table('pasiendaftar_t as pd')
                    // ->leftjoin ('rekanan_m as rk','pd.objectrekananfk','=','rk.id')
                    ->select('pd.objectkelompokpasienlastfk')
                    ->where('pd.noregistrasi',$item['noregistrasi'])
                    ->get();
    
                    //BPJS bisa input berkali"
                // foreach ($datax as $item2x) {
                //     if($item2x->objectkelompokpasienlastfk != 2) {
                //         // return('a');
                //         // die();
                //             $result = array(
                //                 'data' => 'lolos',
                //             );
                //             return $this->respond($result);
    
                //     }   
                // }
                $data = \DB::table('produk_m as pr')
                    ->where('pr.id',$item['produkfk'])
                    ->get();
                foreach ($data as $item2) {
                    $maxqty = $item2->maxqty;
                    $maxhari = $item2->maxhari;
                    $namapelayanan = $item2->namaproduk;
                }
                // return($item['tglpelayanan']);
                // die();
                if($maxqty < $item['jumlah']){
                    $result = array(
                        'data' => 'Pelayanan ' . $namapelayanan . ' Hanya Bisa Diinput Dengan Jumlah Maksimal Sebanyak ' . $maxqty .'.'
                    );
    
                    return $this->respond($result);
                }

                // $jumlahdatatindakan = PelayananPasien::where('noregistrasifk',$request['noregistrasifk'])
                //             ->where('produkfk',$item['produkfk'])
                //             ->orderBy('tglpelayanan','desc')
                //             ->get();
               
                $datatindakan = collect(DB::select("
                        select  tglpelayanan from pelayananpasien_t WHERE  produkfk= '".$item['produkfk']."' and noregistrasifk='".$item['noregistrasifk']. "' order by tglpelayanan desc limit 1 
                    "))->first();
                // return($datatindakan->tglpelayanan);


                // $jml = collect(DB::select("
                // select count(".$item['produkfk'].") as jml from pelayananpasien_t WHERE  produkfk= '".$item['produkfk']."' and noregistrasifk='".$item['noregistrasifk']."' and tglpelayanan='".$datatindakan->tglpelayanan."' order by ".$item['produkfk']."
                // "))->first();
             
                if(!empty($datatindakan)){
                    $tglmasuk =date_format(date_create($datatindakan->tglpelayanan),'Y-m-d');
                    $tglpelayanan =date_format(date_create($item['tglpelayanan']),'Y-m-d');
                    $tglkeluar =date_format(date_create( date('Y-m-d H:i:s')),'Y-m-d');
                    
                    
    
                    $tglmasuk1 = strtotime($tglmasuk);
                    $tglkeluar1 = strtotime($tglkeluar);
                    $diffs= $tglkeluar1-$tglmasuk1;
                    $dayss = floor($diffs / (3600 * 24));;
                    $selisih = $dayss + 1;
                    // return($datatindakan->tglpelayanan);
                    // return($selisih);
                    // die();
    
                    if($selisih < $maxhari) {
                        $result = array(
                            'data' => 'Pelayanan ' . $namapelayanan . ' Hanya Bisa Diinput  1x Dalam ' . $maxhari . ' Hari.'
                        );
                        return $this->respond($result);
                    }
                    
                    $jmldata = collect(DB::select("
                    select count(produkfk) AS jumlah from pelayananpasien_t WHERE  produkfk= '".$item['produkfk']."' and noregistrasifk='".$item['noregistrasifk']. "' and 	to_char(tglpelayanan , 'yyyy-mm-dd' )='".$tglpelayanan."' group by produkfk
                    "))->first();
                    
                    
                    if(!empty($jmldata)){
                        
                        $jml = $jmldata->jumlah;
                        // return($selisih);
                        // if ($selisih > '0'){
                        //     $result = array(
                        //         'data' => 'lolos',
                        //     );
                    
                        //     return $this->respond($result);
                        // } else 
                        if ($maxqty > $jml) {
                            $result = array(
                                'data' => 'lolos',
                            );
                            return $this->respond($result);
                        } else {
                            $result = array(
                                'data' => 'Pelayanan ' . $namapelayanan . ' Hanya Bisa Diinput Dengan Jumlah Maksimal Sebanyak ' .$maxqty.' .'
                            );
                            return $this->respond($result);
                        }                        
                    } else {
                        $result = array(
                            'data' => 'lolos',
                        );
                
                        return $this->respond($result);
                    }
                } else {
                    $result = array(
                        'data' => 'lolos',
                    );
            
                    return $this->respond($result);
                }                     
            } else {
                $produkfk = $item['produkfk'];
                if($produkfk === '4053652' || $produkfk === '4053683' || $produkfk === '4075406' || $produkfk === '4075408' || $produkfk === '4075409' || $produkfk === '4075410' ) {
                    $data = \DB::table('produk_m as pr')
                    ->where('pr.id',$item['produkfk'])
                    ->get();
                    foreach ($data as $item2) {
                        $maxqty = $item2->maxqty;
                        $maxhari = $item2->maxhari;
                        $namapelayanan = $item2->namaproduk;
                    }
                    
                    $result = array(
                        'data' => 'Pasien Umum Tidak Bisa Mendapatkan Pelayanan ' . $namapelayanan . ' .'
                    );
                } else {
                    $result = array(
                        'data' => 'lolos',
                    );
                }
        
                return $this->respond($result);
            }
        }
    }

    public function updateDokterAll(Request $request) {
        DB::beginTransaction();
        $noRegis = $request['noregistrasi'];
        $pelayananPasien = DB::select(DB::raw("select pp.norec,pp.tglpelayanan, prd.namaproduk,
                ppp.objectpegawaifk,apd.norec as norec_apd,pp.produkfk,  apd.objectruanganfk,ru.namaruangan
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
                INNER JOIN pelayananpasien_t as pp on apd.norec =pp.noregistrasifk
                inner join produk_m as prd on prd.id=pp.produkfk
                inner join detailjenisproduk_m as djp on djp.id=prd.objectdetailjenisprodukfk
                inner join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk
                inner join ruangan_m as ru on ru.id=apd.objectruanganfk
                LEFT JOIN pelayananpasienpetugas_t as ppp on ppp.pelayananpasien =pp.norec
                where ppp.objectpegawaifk is null 
                and pp.produkfk<>395 --karcis
                and ru.objectdepartemenfk in (18,28,24) --rajal
                and jp.id <> 97 --obat
                and pd.noregistrasi='$noRegis'"));

        try{
            foreach ($pelayananPasien as $item) {
                $PelPasienPetugas = new PelayananPasienPetugas();
                $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                $PelPasienPetugas->kdprofile = 0;
                $PelPasienPetugas->statusenabled = true;
                $PelPasienPetugas->nomasukfk = $item->norec_apd;
                $PelPasienPetugas->objectjenispetugaspefk = 4; //dokter pemeriksa
                $PelPasienPetugas->objectpegawaifk = $request['objectpegawaifk'];
                $PelPasienPetugas->objectprodukfk = $item->produkfk;
                $PelPasienPetugas->objectruanganfk = $item->objectruanganfk;
                //            $PelPasienPetugas->deskripsitugasfungsi = $itemPPP['deskripsitugasfungsi'];
                //            $PelPasienPetugas->ispetugaspepjawab = $itemPPP['ispetugaspepjawab'];
                $PelPasienPetugas->pelayananpasien = $item->norec;
                $PelPasienPetugas->tglpelayanan = $item->tglpelayanan;
                $PelPasienPetugas->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan PelPasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Petugas Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $PelPasienPetugas,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Pelayanan Petugas Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
//                'result' => $PelPasienPetugas,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updateDokterppp(Request $request) {
        DB::beginTransaction();
        $noRegis = $request['noregistrasi'];
        $pelayanan = DB::select(DB::raw("select pp.norec,pp.tglpelayanan, prd.namaproduk,
                ppp.objectpegawaifk,apd.norec as norec_apd,pp.produkfk,  apd.objectruanganfk,ru.namaruangan
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
                INNER JOIN pelayananpasien_t as pp on apd.norec =pp.noregistrasifk
                inner join produk_m as prd on prd.id=pp.produkfk
                inner join detailjenisproduk_m as djp on djp.id=prd.objectdetailjenisprodukfk
                inner join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk
                inner join ruangan_m as ru on ru.id=apd.objectruanganfk
                LEFT JOIN pelayananpasienpetugas_t as ppp on ppp.pelayananpasien =pp.norec
                where ppp.objectpegawaifk = 320272 
                and pp.produkfk<>395 --karcis
                and ru.objectdepartemenfk in (18,28,24) --rajal
                and jp.id <> 97 --obat
                and pd.noregistrasi='$noRegis'"));

        try{
            foreach ($pelayanan as $item1) {
                $data = PelayananPasienPetugas::where('pelayananpasien', $item1->norec)
                    ->update([
                        'objectpegawaifk' => $request['objectpegawaifk'],
                    ]);
            }

//
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update PelPasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Pelayanan Petugas Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Update Pelayanan Petugas Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPegawaiByJnsPetugasByAPD(Request $request)
    {
        if ($request['idJenisPetugas']==4){
            $data = \DB::table('mapjenispetugasptojenispegawai_m as mpp')
                ->join ('jenispegawai_m as jp','jp.id','=','mpp.objectjenispegawaifk')
                ->join ('pegawai_m as pg','pg.objectjenispegawaifk','=','jp.id')
                ->join ('antrianpasiendiperiksa_t as apd','apd.objectpegawaifk','=','pg.id')//pake pegawai antrian
                ->join ('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join ('jenispetugaspelaksana_m as jpp','jpp.id','=','mpp.objectjenispetugaspefk')
                ->leftJoin('loginuser_s as lg','lg.objectpegawaifk','=','pg.id')
                ->select( 'mpp.objectjenispegawaifk','jp.jenispegawai','mpp.objectjenispetugaspefk' ,'jpp.jenispetugaspe',
                    'pg.namalengkap','pg.id','lg.id as idloginuser','lg.namauser'
                )
                ->where('mpp.objectjenispetugaspefk',$request['idJenisPetugas'])
                ->where('pd.noregistrasi',$request['noregistrasi'])
                ->where('mpp.statusenabled',true)
                ->where('pg.statusenabled',true)
                ->where('jpp.statusenabled',true);
        }else {
            $data = \DB::table('mapjenispetugasptojenispegawai_m as mpp')
                ->join('jenispegawai_m as jp', 'jp.id', '=', 'mpp.objectjenispegawaifk')
                ->join('pegawai_m as pg', 'pg.objectjenispegawaifk', '=', 'jp.id')
                ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mpp.objectjenispetugaspefk')
                ->leftJoin('loginuser_s as lg', 'lg.objectpegawaifk', '=', 'pg.id')
                ->select('mpp.objectjenispegawaifk', 'jp.jenispegawai', 'mpp.objectjenispetugaspefk', 'jpp.jenispetugaspe',
                    'pg.namalengkap', 'pg.id', 'lg.id as idloginuser', 'lg.namauser'
                )
                ->where('mpp.objectjenispetugaspefk', $request['idJenisPetugas'])
                ->where('mpp.statusenabled', true)
                ->where('pg.statusenabled', true)
                ->where('jpp.statusenabled', true);
        }
        $data = $data->orderBy('pg.namalengkap', 'ASC');
        $data = $data->get();

        $result = array(
            'jenispelaksana' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getKomponenHargaJasaMedis(Request $request)
    {
        $data = \DB::table('harganettoprodukbykelasd_m as hnp')
            ->join ('mapruangantoproduk_m as mpr ','mpr.objectprodukfk','=','hnp.objectprodukfk')
            ->join ('produk_m as prd','prd.id','=','mpr.objectprodukfk')
            ->join ('komponenharga_m as kh','kh.id','=','hnp.objectkomponenhargafk')
            ->join ('kelas_m as kls','kls.id','=','hnp.objectkelasfk')
            ->join ('ruangan_m as ru', 'ru.id','=','mpr.objectruanganfk')
            ->select('hnp.objectkomponenhargafk','kh.komponenharga','hnp.hargasatuan','mpr.objectprodukfk')

            ->where('mpr.objectruanganfk',$request['idRuangan'])
            ->where('hnp.objectkelasfk',$request['idKelas'])
            ->where('mpr.objectprodukfk',$request['idProduk'])
            ->where('hnp.objectjenispelayananfk',$request['idJenisPelayanan'])
            ->where('hnp.objectkomponenhargafk',35)
            ->where('mpr.kodeexternal','2017');
        $data = $data->distinct();
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'andrian',
        );

        return $this->respond($result);
    }

    public function getDataLogin(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap,lu.objectkelompokuserfk from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $request['userData']['id'],
            )
        );

        $Dokter = SettingDataFixed::where('id',1171)
                  ->where('statusenabled',true)
                  ->select('nilaifield')
                  ->first();

        $Suster = SettingDataFixed::where('id',1170)
                ->where('statusenabled',true)
                ->select('nilaifield')
                ->first();

        $result = array(
            'data' => $dataPegawaiUser,
            'idlogindokter' => $Dokter['nilaifield'],
            'idloginsuster' => $Suster['nilaifield'],
            'message' => 'andrian',
        );

        return $this->respond($result);
    }
	public function getPelayananPasienNonDetail(Request $request)
	{
		$data = \DB::table('pelayananpasien_t as pp')
			->join ('antrianpasiendiperiksa_t as apd ','pp.noregistrasifk','=','apd.norec')
			->join ('pasiendaftar_t as pd','apd.noregistrasifk','=','pd.norec')
			->join ('produk_m as pr','pp.produkfk','=','pr.id')
			->leftjoin ('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
			->join ('ruangan_m as ru', 'ru.id','=','apd.objectruanganfk')
			->select('pp.norec as noRec','pp.strukfk as noRecStruk','pp.tglpelayanan as tglPelayanan',
				'pr.id as produkId','pp.hargasatuan as hargaSatuan','pp.harganetto as hargaNetto','pr.namaproduk as namaProduk',
				'djp.detailjenisproduk as detailJenisProduk','pp.jumlah','ru.namaruangan as namaRuangan')
			->where('pd.norec',$request['norec_pd']);
		$data = $data->get();

		$result = array(
			'data' => $data,
			'message' => 'inhuman',
		);

		return $this->respond($result);
	}
	public function hapusPelayananPasien(Request $request) {

		DB::beginTransaction();
		try{
			foreach ($request['dataDel'] as $item) {
				PelayananPasienDetail::where('pelayananpasien', $item['norec_pp'])->delete();
				PelayananPasienPetugas::where('pelayananpasien', $item['norec_pp'])->delete();
				PelayananPasien::where('norec', $item['norec_pp'])->delete();
			}
			$transStatus = 'true';
		} catch (\Exception $e) {
			$transStatus = 'false';
		}
		if ($transStatus == 'true') {
			$transMessage = "Data Terhapus";
			DB::commit();
			$result = array(
				"status" => 201,
				"as" => 'inhuman',
			);
		} else {
			$transMessage = "Delete Pelayanan Pasien Gagal";
			DB::rollBack();
			$result = array(
				"status" => 400,
				"as" => 'inhuman',
			);
		}
		return $this->setStatusCode($result['status'])->respond($result, $transMessage);
	}

    public function hapusPelayananPasienTidakTerklaim(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        $PPnorec='';
        try{
            foreach ($request['pelayananpasiendelete'] as $item) {
                $dataAwal = PelayananPasienTidakTerklaim::where('norec', $item['norec_pptk'])->first();
//                return $this->respond($dataAwal->hargadiscount);
                $PelPasien = new PelayananPasienTidakTerklaimDelete();
                $PelPasien->norec = $PelPasien->generateNewId();
                $PelPasien->kdprofile = 0;
                $PelPasien->statusenabled = true;
                $PelPasien->objectloginuserfk =  $dataLogin['userData']['id'];
                $PelPasien->noregistrasifk = $item['norec_apd'];
                $PelPasien->tglregistrasi = $request['tglregistrasi'];
                $PelPasien->hargadiscount = (float)$dataAwal->hargadiscount;
                $PelPasien->hargajual = (float)$dataAwal->hargajual;
                $PelPasien->hargasatuan =(float)$dataAwal->hargasatuan;
                if (isset($dataAwal->jeniskemasanfk)) {
                    $PelPasien->jeniskemasanfk = $dataAwal->jeniskemasanfk;
                }
                if (isset($dataAwal->jasa)) {
                    $PelPasien->jasa = $dataAwal->jasa;
                }
                if (isset($PelPasien->rke)) {
                    $PelPasien->rke = $PelPasien->rke;
                }
                if (isset($PelPasien->strukresepfk)) {
                    $PelPasien->strukresepfk = $PelPasien->strukresepfk;
                }
                if (isset($PelPasien->satuanviewfk)) {
                    $PelPasien->satuanviewfk = $PelPasien->satuanviewfk;
                }
                if (isset($PelPasien->nilaikonversi)) {
                    $PelPasien->nilaikonversi = $PelPasien->nilaikonversi;
                }
                if (isset($PelPasien->strukterimafk)) {
                    $PelPasien->strukterimafk =  $PelPasien->strukterimafk;
                }
                if (isset($PelPasien->dosis)) {
                    $PelPasien->dosis = $PelPasien->dosis;
                }
                if (isset($PelPasien->nilaikonversi)) {
                    $PelPasien->nilaikonversi = $PelPasien->nilaikonversi;
                }
                if (isset($PelPasien->strukterimafk)) {
                    $PelPasien->strukterimafk =  $PelPasien->strukterimafk;
                }
                $PelPasien->jumlah = $item['jumlah'];
                $PelPasien->kelasfk = $dataAwal->kelasfk;
                $PelPasien->kdkelompoktransaksi = 124;
                if (isset($dataAwal->keteranganlain)) {
                    $PelPasien->keteranganlain = $dataAwal->keteranganlain;
                }
                $PelPasien->piutangpenjamin = 0;
                $PelPasien->piutangrumahsakit = 0;
                $PelPasien->produkfk = $dataAwal->produkfk;
                $PelPasien->stock = 1;
                $PelPasien->tglpelayanan = $item['tglPelayanan'];
                $PelPasien->harganetto = (float)$dataAwal->harganetto;
                $PelPasien->pelayananpasientidakterklaim = $item['norec_pptk'];
                $PelPasien->nomasukfk = $item['norec_pd'];
                $PelPasien->tgldelete = $tglAyeuna;
                $PelPasien->save();
                $PPnorec = $PelPasien->norec;

                PelayananPasienTidakTerklaim::where('norec', $item['norec_pptk'])->delete();
            }

                $dataLogin = $request->all();
                $newId = LoggingUser::max('id');
                $newId = $newId +1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile= 0;
                $logUser->statusenabled=true;
                $logUser->jenislog ='Hapus Layanan Tidak Terklaim';
                $logUser->noreff = $PPnorec;
                $logUser->referensi='norec PelayananPasienTidakTerklaimDelete';
//                $logUser->keterangan=$request['keterangan'];
                $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                $logUser->tanggal = $tglAyeuna;
                $logUser->save();


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Delete Pelayanan Pasien Tidak Terklaim Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveTindakanTidakTerklaim(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try{
            $PPnorec ="";
            $TeuKasep=0;
            foreach ($request['pelayananpasien'] as $item) {
                $dataAwal = PelayananPasien::where('norec', $item['norec'])->first();
//
                $dataPelayananTakTerklaim = PelayananPasienTidakTerklaim::where('pelayananpasien', $item['norec'])->first();

//                return $this->respond($dataPelayananTakTerklaim == '');

                if ($dataPelayananTakTerklaim == '' || $dataPelayananTakTerklaim == null){
                    $PelPasien = new PelayananPasienTidakTerklaim();
                    $PelPasien->norec = $PelPasien->generateNewId();
                    $PelPasien->kdprofile = 0;
                    $PelPasien->statusenabled = true;
                    $PelPasien->noregistrasifk = $item['norec_apd'];
                    $PelPasien->tglregistrasi = $request['tglregistrasi'];
                    $PelPasien->hargadiscount = $dataAwal->hargadiscount;
                    $PelPasien->hargajual = $dataAwal->hargajual;
                    $PelPasien->hargasatuan =$dataAwal->hargasatuan;
                    if (isset($dataAwal->jeniskemasanfk)) {
                        $PelPasien->jeniskemasanfk = $dataAwal->jeniskemasanfk;
                    }
                    if (isset($dataAwal->jasa)) {
                        $PelPasien->jasa = $dataAwal->jasa;
                    }
                    if (isset($PelPasien->rke)) {
                        $PelPasien->rke = $PelPasien->rke;
                    }
                    if (isset($PelPasien->strukresepfk)) {
                        $PelPasien->strukresepfk = $PelPasien->strukresepfk;
                    }
                    if (isset($PelPasien->satuanviewfk)) {
                        $PelPasien->satuanviewfk = $PelPasien->satuanviewfk;
                    }
                    if (isset($PelPasien->nilaikonversi)) {
                        $PelPasien->nilaikonversi = $PelPasien->nilaikonversi;
                    }
                    if (isset($PelPasien->strukterimafk)) {
                        $PelPasien->strukterimafk =  $PelPasien->strukterimafk;
                    }
                    if (isset($PelPasien->dosis)) {
                        $PelPasien->dosis = $PelPasien->dosis;
                    }
                    if (isset($PelPasien->nilaikonversi)) {
                        $PelPasien->nilaikonversi = $PelPasien->nilaikonversi;
                    }
                    if (isset($PelPasien->strukterimafk)) {
                        $PelPasien->strukterimafk =  $PelPasien->strukterimafk;
                    }
                    $PelPasien->jumlah = $item['jumlah'];
                    $PelPasien->kelasfk = $dataAwal->kelasfk;
                    $PelPasien->kdkelompoktransaksi = 124;
                    if (isset($dataAwal->keteranganlain)) {
                        $PelPasien->keteranganlain = $dataAwal->keteranganlain;
                    }
                    $PelPasien->piutangpenjamin = 0;
                    $PelPasien->piutangrumahsakit = 0;
                    $PelPasien->produkfk = $dataAwal->produkfk;
                    $PelPasien->stock = 1;
                    $PelPasien->tglpelayanan = $item['tglPelayanan'];
                    $PelPasien->harganetto = $dataAwal->harganetto;
                    $PelPasien->pelayananpasien = $item['norec'];
                    $PelPasien->nomasukfk = $item['norec_pd'];
                    $PelPasien->save();
                    $PPnorec = $PelPasien->norec;

                    //## Logging User
                    $newId = LoggingUser::max('id');
                    $newId = $newId +1;
                    $logUser = new LoggingUser();
                    $logUser->id = $newId;
                    $logUser->norec = $logUser->generateNewId();
                    $logUser->kdprofile= 0;
                    $logUser->statusenabled=true;
                    $logUser->jenislog = 'Klaim Tindakan Tidak Terklaim';
                    $logUser->noreff =$PPnorec;
                    $logUser->referensi='norec pelayananpasientidakterklaim';
                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                    $logUser->tanggal = $tglAyeuna;
                    $logUser->save();

                }else{
                    $TeuKasep=$TeuKasep+1;
                }

            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan PelPasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPP' => $PPnorec,
                'datataktersimpan' => $TeuKasep,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'dataPP' => $PPnorec,
                'datataktersimpan' => $TeuKasep,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRiwayarRuanganPerAntrian(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join ('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->join ('produk_m as pr','pp.produkfk','=','pr.id')
            ->leftJoin('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->join ('ruangan_m as ru', 'ru.id','=','apd.objectruanganfk')
            ->select(DB::raw("pd.noregistrasi,pd.tglregistrasi,
                     pp.tglpelayanan,pp.produkfk,pr.namaproduk,pp.jumlah,pp.hargajual,
                     case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon,
                     ru.namaruangan,(pp.hargajual - (case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) as subtotal"))
            ->whereNotIn('djp.objectjenisprodukfk',[97])
            ->where('ru.namaruangan','like','%'.  $request['NamaRuangan'].'%')
            ->where('pd.noregistrasi',$request['NoRegistrasi'])
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function GetPegawaiPenginputTindakan(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();

        $data = \DB::table('pasiendaftar_t as pd')
            ->join ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join ('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
            ->leftJoin('logginguser_t as lg','lg.noreff','=','pp.norec')
            ->join ('loginuser_s as lu','lu.id','=','lg.objectloginuserfk')
            ->join ('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->select(DB::raw("lu.objectpegawaifk,pg.namalengkap"))
            ->where('pp.norec',$request['norec_pp'])
            ->get();

        $result = array(
            'data' => $data,
            'datalogin'=>$dataPegawai,
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }
    public function getTindakanPart(Request $request)
    {
        //TODO : GET LIST TINDAKAN
        $req = $request->all();
         $data = \DB::table('mapruangantoproduk_m as mpr')
//            ->join ('harganettoprodukbykelasd_m as hnpd','hnpd.objectprodukfk','=','mpr.objectprodukfk')
            ->join ('produk_m as prd','prd.id','=','mpr.objectprodukfk')
//            ->join ('kelas_m as kls','kls.id','=','hnp.objectkelasfk')
//            ->join ('ruangan_m as ru', 'ru.id','=','mpr.objectruanganfk')
//            ->join ('suratkeputusan_m as sk', 'hnp.suratkeputusanfk','=','sk.id')
//            ->select('mpr.objectprodukfk','prd.id','prd.namaproduk','hnp.hargasatuan','hnp.objectkelasfk',
//                'kls.namakelas','mpr.objectruanganfk','ru.namaruangan',
             ->select('mpr.objectprodukfk as id','prd.namaexternal as namaproduk',
                 'mpr.objectruanganfk', 'prd.objectkelompokprodukbpjsfk'
            )

            ->where('mpr.objectruanganfk',$request['idRuangan'])
//            ->where('hnp.objectkelasfk',$request['idKelas'])
//           ->where('hnp.objectjenispelayananfk',$request['idJenisPelayanan'])
//            ->where('mpr.statusenabled',true)
//            ->where('hnp.statusenabled',true)
//            ->where('sk.statusenabled',true)
            ->where('mpr.statusenabled',true)
       
            // ->where('sk.statusenabled',true)
            ->where('prd.statusenabled',true)
            // ->where('mpr.kodeexternal','2017')
            // ->where('hnp.kodeexternal', '2017')
        ;


      
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $data = $data
                ->where('prd.namaproduk','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        }
        $data = $data->orderBy('prd.namaproduk', 'ASC');
        $data = $data->take(25);
        $data = $data->get();
        // $result = array(
        //     'data' => $data,
        //     'message' => 'ramdanegie',
        // );

     
        return $this->respond($data);
    }
    public function getJenisPelayananByNorecPd($norec_pd)
    {
   
         $data = \DB::table('pasiendaftar_t as pd')
            ->select('pd.*')
            ->where('pd.norec',$norec_pd)
            ->first();

     
        return $this->respond($data);
    }
    public function getPostingTgl(Request $request)
    {
//        $data = DB::select(DB::raw("
//              select max(pjt.tglbuktitransaksi)   + interval '-30' day as max from postingjurnal_t as pj
//                INNER JOIN postingjurnaltransaksi_t as pjt on pjt.nojurnal_intern=pj.norecrelated
//                 where pj.norecrelated like '%PN%' and  RIGHT(pj.norecrelated,5) in ('00001','00002')
//          ")
//        );
        $data = DB::select(DB::raw("
              select now()  + interval '-40' day as max
             --      SELECT  DATEADD(month, -12, GETDATE()) AS max
          ")
        );
        $data1 = DB::select(DB::raw("
               select now()  + interval '-40' day as max
              --     SELECT  DATEADD(month, -1, GETDATE()) AS max
          ")
        );
        $tgl = $data[0]->max;
        $tgl = $data[0]->max;
        $datadate = DB::select(DB::raw("

            --select distinct DAY( pjt.tglbuktitransaksi) as tgl  from postingjurnal_t as pj
            --INNER JOIN postingjurnaltransaksi_t as pjt on pjt.nojurnal_intern=pj.norecrelated
            --where pj.norecrelated like '%PN%' and RIGHT(pj.norecrelated,5) in ('00001','00002') 
            --and pjt.tglbuktitransaksi >  '$tgl';;
             
               select distinct to_char(pjt.tglbuktitransaksi,'dd') as tgl   from postingjurnal_t as pj
               INNER JOIN postingjurnaltransaksi_t as pjt on pjt.nojurnal_intern=pj.norecrelated
               where pj.norecrelated like '%PN%' and  RIGHT(pj.norecrelated,5) in ('00001','00002') 
              and pjt.tglbuktitransaksi > '$tgl';
          ")
        );

        $arrtgl = [] ;
        foreach ($datadate as $item){
            $arrtgl[] = (int)$item->tgl;
        }

        $status=array(
            'mindatee' => $data1,
            'mindate' => $data,
            'datedate' => $arrtgl,
        );

        return $this->respond($status);
    }
//     public function getHeaderInputTindakan($norec_pd,$norec_apd){
//         $data = \DB::table('pasiendaftar_t as pd')
//             ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
//             ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
//             ->leftjoin('pasiendaftar_t as pd1','pd1.norec','=','apd.noregistrasifk')
//             // ->leftjoin('antrianpasiendiperiksa_t as apd1','apd1.noregistrasifk','=','pd1.norec')
//             ->leftjoin('antrianpasiendiperiksa_t as apd1',function($join)
//             {
//                 $join->on('apd1.noregistrasifk','=','pd1.norec');
//                 $join->on('apd1.objectruanganfk','=','apd.objectruanganasalfk');
//             })
//             ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
//             ->leftjoin('alamat_m as alm','alm.nocmfk','=','ps.id')
//             ->leftjoin('pendidikan_m as pdd','pdd.id','=','ps.objectpendidikanfk')
//             ->leftjoin('pekerjaan_m as pk','pk.id','=','ps.objectpekerjaanfk')
//             ->leftjoin('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
//             ->leftjoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
//             ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
//             ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
//             ->leftjoin('ruangan_m as ru3', 'ru3.id', '=', 'apd1.objectruanganfk')
//             ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
//             ->leftjoin('departemen_m as dpm2', 'dpm2.id', '=', 'ru2.objectdepartemenfk')
//             ->leftjoin('pegawai_m as peg','peg.id','=','pd.objectpegawaifk')
//             ->join('kelas_m as kls','kls.id','=','apd.objectkelasfk')
//             ->LEFTjoin('jenispelayanan_m as jpl','jpl.kodeinternal','=','pd.jenispelayanan')
//             ->leftjoin('pemakaianasuransi_t as pa','pa.noregistrasifk','=','pd.norec')
//             ->leftjoin('asuransipasien_m as asu','asu.id','=','pa.objectasuransipasienfk')
//             ->leftjoin('kelas_m as klstg','klstg.id','=','asu.objectkelasdijaminfk')
//             ->select('ps.nocm','ps.id as nocmfk','ps.noidentitas','ps.namapasien','pd.noregistrasi', 'pd.tglregistrasi','jk.jeniskelamin',
//                 'ps.tgllahir','alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.nohp as notelepon','ps.objectjeniskelaminfk',
//                 'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd','pd.norec as norec_pd',
//                 'kps.kelompokpasien','kls.namakelas','apd.objectkelasfk','pd.objectkelompokpasienlastfk','pd.objectrekananfk',
//                 'rk.namarekanan','pd.objectruanganlastfk','jpl.jenispelayanan','apd.objectasalrujukanfk', 
//                 'ru3.objectdepartemenfk as objectdepartemenfk_asal', 'ru3.namaruangan as namaruangan_asal', 'apd1.tglmasuk as tgl_masuk', 'apd1.tglkeluar as tgl_keluar',
//                 'ru.kdinternal','jpl.kodeinternal as objectjenispelayananfk','pd.objectpegawaifk','pd.statuspasien',
//                 'ps.nobpjs','pd.statuspasien','klstg.id as kelastanggunganfk','ru.objectdepartemenfk','ru2.objectdepartemenfk as objectdepartemenlastfk',
//                 DB::raw('case when ru.objectdepartemenfk in (16,35,17) then \'true\' else \'false\' end as israwatinap')
//             )
//             ->where('pd.norec','=',$norec_pd)
//             ->where('apd.norec','=',$norec_apd)
//             ->distinct()
//             ->get();
// //           try {
// //                   $umur = $this->hitungUmur($data->tgllahir);
// //               } catch (\Exception $e) {
// //                   $umur = '-';
// //               }
//         return $this->respond($data);


//     }
    public function getHeaderInputTindakan($norec_pd,$norec_apd){
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftjoin('pasiendaftar_t as pd1','pd1.norec','=','apd.noregistrasifk')
            // ->leftjoin('antrianpasiendiperiksa_t as apd1','apd1.noregistrasifk','=','pd1.norec')
            ->leftjoin('antrianpasiendiperiksa_t as apd1',function($join)
            {
                $join->on('apd1.noregistrasifk','=','pd1.norec');
                $join->on('apd1.objectruanganfk','=','apd.objectruanganasalfk');
            })
            ->leftjoin('antrianpasiendiperiksa_t as apd2',function($join) // 8-5 magrib
            {
                $join->on('apd2.noregistrasifk','=','pd1.norec');
                $join->on('apd2.objectruanganfk','=','apd.objectruanganfk');
            })
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftjoin('alamat_m as alm','alm.nocmfk','=','ps.id')
            ->leftjoin('pendidikan_m as pdd','pdd.id','=','ps.objectpendidikanfk')
            ->leftjoin('pekerjaan_m as pk','pk.id','=','ps.objectpekerjaanfk')
            ->leftjoin('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('ruangan_m as ru3', 'ru3.id', '=', 'apd1.objectruanganfk')
            ->join('departemen_m as dpm','dpm.id','=','ru.objectdepartemenfk')
            ->leftjoin('departemen_m as dpm2', 'dpm2.id', '=', 'ru2.objectdepartemenfk')
            ->leftjoin('pegawai_m as peg','peg.id','=','pd.objectpegawaifk')
            ->leftjoin('pegawai_m as peg2', 'peg2.id', '=', 'apd.objectpegawaifk')
            ->join('kelas_m as kls','kls.id','=','apd.objectkelasfk')
            ->LEFTjoin('jenispelayanan_m as jpl','jpl.kodeinternal','=','pd.jenispelayanan')
            ->leftjoin('pemakaianasuransi_t as pa','pa.noregistrasifk','=','pd.norec')
            ->leftjoin('asuransipasien_m as asu','asu.id','=','pa.objectasuransipasienfk')
            ->leftjoin('kelas_m as klstg','klstg.id','=','asu.objectkelasdijaminfk')
            ->select(
            'apd.israwattitipan',
            'klstg.namakelas as namakelastanggungan','ps.nocm','ps.id as nocmfk','ps.noidentitas','ps.namapasien','pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang','jk.jeniskelamin',
                'ps.tgllahir','alm.alamatlengkap','pdd.pendidikan','pk.pekerjaan','ps.nohp as notelepon','ps.objectjeniskelaminfk',
                'apd.objectruanganfk', 'ru.namaruangan', 'apd.norec as norec_apd','pd.norec as norec_pd',
                'kps.kelompokpasien','kls.namakelas','apd.objectkelasfk','pd.objectkelompokpasienlastfk','pd.objectrekananfk',
                'rk.namarekanan','pd.objectruanganlastfk','jpl.jenispelayanan','apd.objectasalrujukanfk',  'apd.tglmasuk', 'apd.tglkeluar',
                'ru3.objectdepartemenfk as objectdepartemenfk_asal', 'ru3.namaruangan as namaruangan_asal', 'apd1.tglmasuk as tgl_masuk', 'apd1.tglkeluar as tgl_keluar',
                'ru.kdinternal','jpl.kodeinternal as objectjenispelayananfk','pd.objectpegawaifk','pd.statuspasien',
                'ps.nobpjs','pd.statuspasien','klstg.id as kelastanggunganfk','ru.objectdepartemenfk','ru2.objectdepartemenfk as objectdepartemenlastfk', 'apd1.objectstatuspulangfk',
                DB::raw('case when ru.objectdepartemenfk in (16,35,17) then \'true\' else \'false\' end as israwatinap , apd.objectpegawaifk as iddokterperujuk, peg2.namalengkap as dokterperujuk'),
                DB::raw('case when ru.objectdepartemenfk in (16) then apd2.tglmasuk end as tgl_masuk2'), // 8-5 magrib
                DB::raw('case when ru.objectdepartemenfk in (16) then apd2.tglkeluar end as tgl_keluar2')
                // DB::raw('case when ru2.objectdepartemenfk in (16,35,17) then \'true\' else \'false\' end as israwatinap_asal')
            )
            ->where('pd.norec','=',$norec_pd)
            ->where('apd.norec','=',$norec_apd)
            // ->where('apd1.statusenabled', true)
            ->where('apd2.statusenabled', true)
            ->orderBy('apd.tglmasuk', 'DESC')
            ->distinct()
            // ->take(1)
            ->get();
//           try {
//                   $umur = $this->hitungUmur($data->tgllahir);
//               } catch (\Exception $e) {
//                   $umur = '-';
//               }
        return $this->respond($data);


    }

}
