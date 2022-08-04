<?php

namespace App\Http\Controllers\CSSD;

use App\Http\Controllers\ApiController;
use App\Master\LoginUser;
use App\Transaksi\PelayananPasienDetail;
use Illuminate\Http\Request;
use DB;
//use App\Pegawai\ModulAplikasi;
//use App\Pegawai\MapObjekModulToKelompokUser;
//use App\Pegawai\MapObjekModulAplikasiToModulAplikasi;
//use App\Pegawai\ObjekModulAplikasi;
use App\Master\Bundel;
use App\Transaksi\StrukOrder;
use App\Transaksi\PermintaanSterilisasi;
use App\Transaksi\PermintaanSterilisasidetail;
use App\Master\Mappakettoproduk;
use App\Traits\Valet;
use App\Transaksi\CssdPengemasan;
use App\Transaksi\CssdSterilisasiAlat;
use App\Transaksi\StrukKirim;
use App\Transaksi\CssdDistribusi;
use App\Transaksi\CssdPenyimpanan;

class transaksiController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function SimpanBundel(Request $request) {
    	$norec = $request['norec'];
    	$data = \DB::table('bundel_m as b')
            ->select('b.namabundel')
            ->where('b.norec',$norec)
            ->get();
        try{
          DB::beginTransaction();
          if (empty($data)){
          	  $newB = new Bundel();
	          $norecB = $newB->generateNewId();
	          $newB->namabundel = $request['namaExternal'];         
	          $newB->statusenabled = 1;
	          $newB->save();

          }else{
          	Bundel::where('norec',$norec)
                   ->update([
                             'namabundel' => $request['namaExternal']]
                            );
          }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function getBundel(Request $request) {

    	$data = \DB::table('bundel_m as b')
            ->select('b.norec','b.namabundel','b.statusenabled')
            ->where('b.statusenabled',1)
            ->get();
       

            $result = array(
            'data' => $data,
            'message' => 'iphe@gm',
        );

        return $this->respond($result);
    }
    public function hapusBundel(Request $request) {
		$norec = $request['norec'];
    	
        // try{
          DB::beginTransaction();        
          	Bundel::where('norec',$norec)
                   ->update([
                             'statusenabled' => 0]
                            );
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getCombo(Request $request){
        $dataLogin = $request->all();        
        $jenispaket = DB::table('jenispaket_m')
            // ->select(DB::raw("id, UPPER(jenispaket) as jenispaket"))
            ->where('statusenabled',true)
            ->get();
        $paket = DB::table('paket_m')
            // ->select(DB::raw("id, UPPER(namapaket) as namapaket"))
            ->where('statusenabled',true)
            ->get();


        $result = array(
            'jenispaket' => $jenispaket,
            'paket' => $paket,
            'message' => 'iphe',
        );

        return $this->respond($result);
    }

    public function getComboPaket(Request $request){
        $dataLogin = $request->all();


        $paket = DB::table('paket_m')
            // ->select(DB::raw("id, UPPER(jenispaket) as jenispaket"))
            // ->where('statusenabled',true)        
            ->where('objectjenispaketfk','like','%'. $request['idJenisPaket'].'%')
            ->get();


        $result = array(
            'data' => $paket,
            'message' => 'iphe',
        );

        return $this->respond($result);
    }

     public function getJenisPaket(Request $request){
        $dataLogin = $request->all();


        $paket = DB::table('jenispaket_m as pr')
            // ->join('satuanstandar_m as ss','pr.objectsatuanfk','=','ss.id')
            // ->join('paket_m as pp','pr.objectpaketfk','=','pp.id')
            // ->where('pr.statusenabled',true)      
            ->where('id',$request['idPaket'])
            ->get();


        $result = array(
            'data' => $paket,
            'message' => 'iphe',
        );

        return $this->respond($result);
    }

     public function getMapPaket(Request $request){
        $dataLogin = $request->all();


        $paket = DB::table('mappakettoproduk_m as pr')
            ->join('satuanstandar_m as ss','pr.objectsatuanfk','=','ss.id')
            ->join('paket_m as pp','pr.objectpaketfk','=','pp.id')
            ->select(DB::raw("pr.objectprodukfk as id, UPPER(pr.reportdisplay) as namaProduk, pr.qtyproduk as qty,ss.satuanstandar as satuanStandar,pp.namapaket as namaPaket, objectsatuanfk as satuanId"))
            ->where('pr.statusenabled',true)      
            ->where('objectpaketfk',$request['idPaket'])
            ->get();


        $result = array(
            'data' => $paket,
            'message' => 'iphe',
        );

        return $this->respond($result);
    }
    public function getProdukCssd(Request $request){
        $dataLogin = $request->all();


        $paket = DB::table('produk_m as pr')
            ->join('satuanstandar_m as ss','pr.objectsatuanstandarfk','=','ss.id')
            ->select(DB::raw("pr.id, UPPER(namaproduk) as namaProduk, 0 as qty,ss.satuanstandar as satuanStandar,pr.objectsatuanstandarfk as satuanId "))
            // ->where('pr.statusenabled',true)      
            ->where('objectdetailjenisprodukfk','450')
            ->get();


        $result = array(
            'data' => $paket,
            'message' => 'iphe',
        );

        return $this->respond($result);
    }
    public function unMapping(Request $request){
        $dataLogin = $request->all();

        try{
            Mappakettoproduk::where('id',$request['id'])
                   ->update([
                             'statusenabled' => 0]
                            );
            $transStatus = 'true';
         } catch (\Exception $e) {
            $transStatus = 'false';
        }
        

       if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function SimpanMapping(Request $request) {
        $paketid = $request[0]['paketId'];

        DB::beginTransaction();
        $HapusPPD = Mappakettoproduk::where('objectprodukfk', $paketid)->delete();

        try{
          $r_mp=$request['data'];
            foreach ($r_mp as $r_mploop) {  
                $newB = new Mappakettoproduk();
                $norecB = $newB->generateNewId();

                $newB->kdprofile = 15;         
                $newB->statusenabled = 1;
                $newB->namaexternal = $r_mploop['namaProduk'];
                $newB->norec = $norecB;
                $newB->reportdisplay = $r_mploop['namaProduk'];
                $newB->objectpaketfk = $r_mploop['paketId'];
                $newB->objectprodukfk = $r_mploop['produkId'];
                $newB->qtyproduk = $r_mploop['qtyProduk'];
                $newB->objectsatuanfk = $r_mploop['satuanId'];
                $newB->save();
               
            }


         

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function getCarasterilisasi(Request $request){
        $dataLogin = $request->all();


        $data = DB::table('cssdcarasterilisasi_m')
            // ->select(DB::raw("id as id2, namaexternal"))
            // ->where('pr.astatusenabled',true)      
            ->where('statusenabled',1);

        $data = $data->get();

        // $result = array(
        //     'data' => $paket,
        //     'message' => 'iphe',
        // );

        return $this->respond($data);
    }
    public function getProsessterilisasi(Request $request){
        $dataLogin = $request->all();


        $data = DB::table('cssdprosessterilisasi_m')
            ->where('statusenabled',1);
        $data = $data->get();
        // $result = array(
        //     'data' => $paket,
        //     'message' => 'iphe',
        // );

        return $this->respond($data);
    }

    public function SimpanPermintaanSterilisasi(Request $request) {
        DB::beginTransaction();
        // try{
            $newSO = new StrukOrder();
            $norecSO = $newSO->generateNewId();
            $newId = StrukOrder::where('noorder','like',$this->getDateTime()->format('ym').'%')->max('noorder');
            $newId = substr(trim($newId),4);
            $newId = (int)$newId + 1;
            $noOrder =  $this->getDateTime()->format('ym'). str_pad($newId, 6, "0", STR_PAD_LEFT);
            $newSO->norec = $norecSO;
            $newSO->kdprofile = 0;
            $newSO->statusenabled = true;
            $newSO->objectjenisorderfk = 15;
            $newSO->isdelivered = 0;
            $newSO->objectkelompoktransaksifk = 23;
            $newSO->keteranganorder =  'Order Sterilisasi';
            $newSO->noorder =  $noOrder;
            $newSO->objectpegawaiorderfk =  $request['petugasYangMenyerahkan']['id'];
            $newSO->qtyproduk =   0;
            $newSO->qtyjenisproduk =   0;
            $newSO->objectruanganfk =  $request['ruanganAsalId'];
            $newSO->objectruangantujuanfk = 34 ;
            $newSO->statusorder =  0;
            $newSO->tglorder =  date('Y-m-d H:i:s');
            $newSO->totalbeamaterai =  0;
            $newSO->totalbiayakirim =  0;
            $newSO->totalbiayatambahan =  0;
            $newSO->totaldiscount =  0;
            $newSO->totalhargasatuan =  0;
            $newSO->totalharusdibayar =  0;
            $newSO->totalpph =  0;
            $newSO->totalppn =  0;

            // try {
                $newSO->save();
            //     $transStatus = 'true';
            // } catch (\Exception $e) {
            //     $transStatus = 'false';
            //     $transMessage = "Simpan StrukOrder";
            // }

            $newPS = new PermintaanSterilisasi();
            $norecPS = $newPS->generateNewId();
            $newPS->norec = $norecPS;
            $newPS->kdprofile = 15;
            $newPS->statusenabled = true;
            $newPS->objectstrukorderfk = $newSO->norec;
            $newPS->carasterilisasi = $request['idcarasterilisasi'];
            $newPS->prosessterilisasi = $request['cssdProsesSterilisasi'];
            $newPS->spesifikasi =  $request['spesifikasi'];
            $newPS->linenB =  $request['linenB'];
            $newPS->linenBs =  $request['linenBs'];
            $newPS->linenK =  $request['linenK'];
            $newPS->linenS =  $request['linenS'];
            $newPS->poucesB =  $request['poucesB'];
            $newPS->poucesBs =  $request['poucesBs'];
            $newPS->poucesK =  $request['poucesK'];
            $newPS->poucesS =  $request['poucesS'];
            $newPS->issuhupanas = $request['cssCaraSterilisasiSuhutinggi'];
            $newPS->issuhurendah = $request['cssCaraSterilisasiSuhurendah'];
            
            // try {
                $newPS->save();
            //     $transStatus = 'true';
            // } catch (\Exception $e) {
            //     $transStatus = 'false';
            //     $transMessage = "Simpan StrukOrder";
            // }
          $a=$request['cssdSterilisasiDetail'];
            foreach ($a as $detaillop) { 
                // return($detaillop);
                // die(); 
                $newPSD = new PermintaanSterilisasidetail();
                $norecPSD = $newPSD->generateNewId();
                $newPSD->objectpermintaansterilisasi = $newPS->norec;         
                $newPSD->produkid = $detaillop['produkId'];
                $newPSD->qty = $detaillop['qty'];
                $newPSD->satuanid = $detaillop['satuanId'];                
                $newPSD->save();
            }


         

            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
     public function getPermintaanSterilisasiDetail(Request $request){
        $dataLogin = $request->all();
        $head = DB::table('v_permintaansterilisasi as vp')
            ->leftjoin('cssdpengemasan_t as cp','vp.noorder','=','cp.noorder') 
            ->leftjoin('cssdsterilisasialat_t as ca','vp.norecpermintaan','=','ca.objectcssdpermintaansterilisasifk')
            ->leftjoin('cssddistribusi_t as cd','vp.norecpermintaan','=','cd.objectcssdsterilisasiinternalfk')
            ->leftjoin('StrukKirim_t as sk','cd.objectstrukkirimfk','=','sk.norec')
            ->leftjoin('pegawai_m as p','vp.objectpetugaspenerimafk','=','p.id')
            ->select(DB::raw("distinct vp.noorder as noOrder,tglorder as tanggalOrder,vp.JenisSterilisasi as caraSterilisisasi,prosessterilisasi as prosesSterilisasi ,namaruangan as namaRuangan, vp.namalengkap as petugasPenerima,vp.noorder as strukPelayananId,vp.noorder as noKirim,cp.tanggal,cp.jammulai,cp.jamakhir,vp.namalengkap as petugas,vp.norecpermintaan as norec, ca.jammulai as jammulaisterilisasi, ca.jamselesai as jamakhirsterilisasi, ca.tanggal as tanggalsterilisasi,vp.objectruanganfk, p.namalengkap as menyerahkan , vp.objectruangantujuanfk ,sk.tglkirim,sk.nokirim,cd.status"))
            ->where('vp.noorder', $request['strukPelayananId'])->get();


            foreach ($head as $headloop) {
                $pelayananPasien = array(
                    'noOrder' => $headloop->noOrder,
                    'tanggalOrder' => $headloop->tanggalOrder,
                    'caraSterilisisasi' => $headloop->caraSterilisisasi,
                    'prosesSterilisasi' => $headloop->prosesSterilisasi,
                    'ruanganAsal' => $headloop->namaRuangan,
                    'strukPelayananId' => $headloop->strukPelayananId,
                    'noKirim' => $headloop->noKirim,
                    'tanggal' => $headloop->tanggal,
                    'jammulai' => $headloop->jammulai,
                    'jamakhir' => $headloop->jamakhir,
                    'petugas' => $headloop->menyerahkan,
                    'norec' => $headloop->norec,
                    'jammulaisterilisasi' => $headloop->jammulaisterilisasi,
                    'jamakhirsterilisasi' => $headloop->jamakhirsterilisasi,
                    'tanggalsterilisasi' => $headloop->tanggalsterilisasi,
                    'jenissterilisasi' => $headloop->caraSterilisisasi,
                    'objectruanganfk' => $headloop->objectruanganfk,
                    'objectruangantujuanfk' => $headloop->objectruangantujuanfk,
                    'tglkirim'=>$headloop->tglkirim,
                    'nokirim' => $headloop->nokirim,
                    'status'=> $headloop->status


                );
            }

      


        $detail = DB::table('v_permintaansterilisasi as vp')
            ->leftjoin('cssdhasilindikator_t as ch','vp.noorder','=','ch.noorder') 
            ->select(DB::raw("namaproduk as namaProduk, satuanstandar as satuanStandar,qty as qtyProduk,kodisi as kondisi,Expr1,ch.attest,ch.autoclave as autoClaveId,ch.bowidick as bowidickId,ch.indikatorinternal as indikatorInternalId,ch.kemasan as kemasanId,ch.label as labelId,produkid as produkId"))
            ->where('vp.noorder', $request['strukPelayananId'])->get();
            

        $result = array(
            'header' => $pelayananPasien,
            'detail' => $detail,
            'message' => 'iphe',
        );

        return $this->respond($result);
    }

    public function getPermintaanSterilisasi(Request $request){
        $dataLogin = $request->all();


        $paket = DB::table('v_permintaansterilisasi as vp')
            ->leftjoin('cssdpengemasan_t as cp','vp.noorder','=','cp.noorder')
            ->leftjoin('cssdpenyimpanan_t as ct','vp.norecpermintaan','=','ct.norec')
            ->leftjoin('cssddistribusi_t as cd','vp.norecpermintaan','=','cd.objectcssdsterilisasiinternalfk')
            ->leftjoin('cssdsterilisasialat_t as cs','vp.norecpermintaan','=','cs.objectcssdpermintaansterilisasifk')
            ->leftjoin('pegawai_m as p','vp.objectpetugaspenerimafk','=','p.id')
            ->select(DB::raw("distinct vp.noorder as noOrder,tglorder as tanggalOrder, vp.JenisSterilisasi as caraSterilisisasi, vp.prosessterilisasi as prosesSterilisasi ,vp.namaruangan as namaRuangan, vp.namalengkap as petugasPenerima,vp.noorder as strukPelayananId,vp.noorder as noKirim, cp.tanggal,cp.jammulai as pengemasanjammulai,cp.jamakhir as pengemasanjamakhir, vp.namalengkap as petugas, cs.jammulai as sterilisasiJamMulai, cs.jamselesai as sterilisasiJamAhir, cs.jenissterilisasi as jnsSterilisasi, vp.jammulai as penyimpananJamMulai, vp.jamselesai as penyimpananJamAkhir, cd.status, p.namalengkap as menyerahkan"))
            // ->where('pr.astatusenabled',true)      
            // ->where('objectdetailjenisprodukfk','450')
            ->whereBetween('tglorder', [$request['tglawal'], $request['tglakhir']])->get();
            // ->get();


        $result = array(
            'data' => $paket,
            'message' => 'iphe',
        );

        return $this->respond($result);
    }

    public function getPengemasanDetail(Request $request){
        $dataLogin = $request->all();
        $header = DB::table('v_permintaansterilisasi')
                ->leftjoin('cssdsterilisasialat_t','v_permintaansterilisasi.norec','=','cssdsterilisasialat_t.norec')
                ->leftjoin('cssddistribusi_t as d','v_permintaansterilisasi.norecpermintaan','=','d.norec')
                ->leftjoin('pegawai_m as p','v_permintaansterilisasi.objectpetugaspenerimafk','=','p.id')
                ->select(DB::raw("DISTINCT 
                         v_permintaansterilisasi.norec, v_permintaansterilisasi.jenispermintaanfk, v_permintaansterilisasi.objectruanganfk, v_permintaansterilisasi.objectruangantujuanfk, v_permintaansterilisasi.isdelivered, 
                         v_permintaansterilisasi.objectjenisorderfk, v_permintaansterilisasi.noorder, v_permintaansterilisasi.issuhurendah, v_permintaansterilisasi.issuhupanas, v_permintaansterilisasi.poucesS, v_permintaansterilisasi.poucesK, 
                         v_permintaansterilisasi.poucesBS, v_permintaansterilisasi.poucesB, v_permintaansterilisasi.linenS, v_permintaansterilisasi.linenK, v_permintaansterilisasi.linenBs, v_permintaansterilisasi.linenB, 
                         v_permintaansterilisasi.spesifikasi, v_permintaansterilisasi.prosessterilisasi, v_permintaansterilisasi.carasterilisasi, v_permintaansterilisasi.objectstrukorderfk, v_permintaansterilisasi.qty, v_permintaansterilisasi.satuanid, 
                         v_permintaansterilisasi.Expr1, v_permintaansterilisasi.namaruangan, v_permintaansterilisasi.produkid, v_permintaansterilisasi.namaproduk, v_permintaansterilisasi.tglorder, v_permintaansterilisasi.JenisSterilisasi, 
                         v_permintaansterilisasi.objectpegawaiorderfk, v_permintaansterilisasi.namalengkap, v_permintaansterilisasi.ruangantujuan, v_permintaansterilisasi.satuanstandar, v_permintaansterilisasi.norecpermintaan, 
                         cssdsterilisasialat_t.tanggal, cssdsterilisasialat_t.jamselesai, cssdsterilisasialat_t.jammulai, d.status,p.namalengkap as menyerahkan"))
                ->where('noorder',$request['strukPelayananId'])
                ->get();

        foreach ($header as $hloop) {
            $hder = array(
                'noorder' => $hloop->noorder,
                'namaruangan' =>$hloop->namaruangan,
                'namalengkap' =>$hloop->menyerahkan,
                'tanggal' =>$hloop->tanggal,
                'jammulai' =>$hloop->jammulai,
                'jamakhir' =>$hloop->jamselesai,
                'nokirim' => $hloop->noorder,
                'norec' =>$hloop->norecpermintaan,
                'status'=>$hloop->status
            );
        }

        $detail = DB::table('v_permintaansterilisasi')
                ->where('noorder',$request['strukPelayananId'])
                ->get();

        $result = array(
            'header' => $hder,
            'detail' => $detail
        );

        return $this->respond($result); 
    }

    public function getPenyimpananDetail(Request $request){
        $dataLogin = $request->all();
        $header = DB::table('v_permintaansterilisasi')
                ->leftjoin('cssdsterilisasialat_t','v_permintaansterilisasi.norec','=','cssdsterilisasialat_t.norec')
                ->leftjoin('pegawai_m as p','v_permintaansterilisasi.objectpetugaspenerimafk','=','p.id')
                ->select(DB::raw("DISTINCT 
                         v_permintaansterilisasi.norec, v_permintaansterilisasi.jenispermintaanfk, v_permintaansterilisasi.objectruanganfk, v_permintaansterilisasi.objectruangantujuanfk, v_permintaansterilisasi.isdelivered, 
                         v_permintaansterilisasi.objectjenisorderfk, v_permintaansterilisasi.noorder, v_permintaansterilisasi.issuhurendah, v_permintaansterilisasi.issuhupanas, v_permintaansterilisasi.poucesS, v_permintaansterilisasi.poucesK, 
                         v_permintaansterilisasi.poucesBS, v_permintaansterilisasi.poucesB, v_permintaansterilisasi.linenS, v_permintaansterilisasi.linenK, v_permintaansterilisasi.linenBs, v_permintaansterilisasi.linenB, 
                         v_permintaansterilisasi.spesifikasi, v_permintaansterilisasi.prosessterilisasi, v_permintaansterilisasi.carasterilisasi, v_permintaansterilisasi.objectstrukorderfk, v_permintaansterilisasi.qty, v_permintaansterilisasi.satuanid, 
                         v_permintaansterilisasi.Expr1, v_permintaansterilisasi.namaruangan, v_permintaansterilisasi.produkid, v_permintaansterilisasi.namaproduk, v_permintaansterilisasi.tglorder, v_permintaansterilisasi.JenisSterilisasi, 
                         v_permintaansterilisasi.objectpegawaiorderfk, v_permintaansterilisasi.namalengkap, v_permintaansterilisasi.ruangantujuan, v_permintaansterilisasi.satuanstandar, v_permintaansterilisasi.norecpermintaan, 
                         cssdsterilisasialat_t.tanggal, cssdsterilisasialat_t.jamselesai, cssdsterilisasialat_t.jammulai,p.namalengkap as menyerahkan"))
                ->where('noorder',$request['strukPelayananId'])
                ->get();

        foreach ($header as $hloop) {
            $hder = array(
                'noorder' => $hloop->noorder,
                'namaruangan' =>$hloop->namaruangan,
                'namalengkap' =>$hloop->menyerahkan,
                'tanggal' =>$hloop->tanggal,
                'jammulai' =>$hloop->jammulai,
                'jamakhir' =>$hloop->jamselesai,
                'nokirim' => $hloop->noorder,
                'norec' =>$hloop->norecpermintaan
            );
        }

        $detail = DB::table('v_permintaansterilisasi')
                ->where('noorder',$request['strukPelayananId'])
                ->get();

        $result = array(
            'header' => $hder,
            'detail' => $detail
        );

        return $this->respond($result); 
    }
    public function SimpanPenyimpanan(Request $request){
        $norec = $request['noRec'];
        $all = $request->all();
        $data = \DB::table('cssdpenyimpanan_t')
            // ->select('b.namabundel')
            ->where('objectcssdpermintaansterilisasifk',$norec)
            ->get();    

        $abc = $request['cssdPenyimpananDetail'];
        // return $all;
        // die();
        // try{
          DB::beginTransaction();

          if (empty($data)){
             foreach($abc as $p){
              $a = new CssdPenyimpanan();
              $norecA = $a->generateNewId();
              $a->norec = $norecA;
              $a->kdprofile = 15;
              $a->statusenabled = 1;
              $a->objectcssdpermintaansterilisasifk = $all['noRec'];         
              $a->jammulai = $all['jammulai'];
              $a->jamselesai = $all['jamakhir'];              
              // $a->tanggal = $all['tanggal'];              
              $a->autoclavetape = $p['autoclavetape'];          
              $a->bowidick = $p['bowidick'];              
              $a->label = $p['label'];              
              $a->attest = $p['attest'];              
              $a->kemasan = $p['kemasan'];              
              $a->indikatorinternal = $p['indikatorinternal'];
              $a->indikatorexternal = $p['indikatorexternal']; 
              $a->autoclavetapename = $p['autoclavetapename']; 
              $a->bowidickname = $p['bowidickname'];              
              $a->labelname = $p['labelname'];              
              $a->attestname = $p['attestname'];              
              $a->kemasanname = $p['kemasanname'];              
              $a->indikatorinternalname = $p['indikatorinternalname'];              
              
              $a->save();
              // return($abc);
              // die();
            }
          }else{
            // return($request['jamakhir']);
            //   die();
            foreach($abc as $p){
            CssdPenyimpanan::where('objectcssdpermintaansterilisasifk',$norec)
                   ->update([
                             'jammulai' => $request['jammulai'],
                             'jamselesai' => $request['jamakhir'],
                             // 'tanggal' => $request['tanggal'],
                             // 'jenissterilisasi' => $request['jenisSterilisasi'],  
                             'statusenabled' => true,
                             'autoclavetape' => $p['autoclavetape'],
                             'bowidick' => $p['bowidick'],
                             'label' => $p['label'],
                             'attest' => $p['attest'],
                             'kemasan' => $p['kemasan'],
                             'indikatorinternal' => $p['indikatorinternal'],
                             'autoclavetapename' => $p['autoclavetapename'],
                             'bowidickname' => $p['bowidickname'],
                             'labelname' => $p['labelname'],
                             'attestname' => $p['attestname'],
                             'kemasanname' => $p['kemasanname'],
                             'indikatorinternalname' => $p['indikatorinternalname'],
                            ]
                            );
                }
            }
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Sterilisasi Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Sterilisasi Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }
        return $this->respond($result);    
    }

    public function SimpanPengemasan(Request $request) {
        $norec = $request['noorder'];
        $data = \DB::table('cssdpengemasan_t')
            // ->select('b.namabundel')
            ->where('noorder',$norec)
            ->get();
        try{
          DB::beginTransaction();
          
          if (empty($data)){

            
              $a = new CssdPengemasan();

              $a->noorder = $request['noorder'];

              $a->jammulai = $request['jammulai'];
              $a->jamakhir = $request['jamakhir'];
              $a->tanggal = $request['tanggal'];    
              $a->objectpetugaspenerimafk = $request['petugaspenerima'];
              $a->statusenabled = true;              
              $a->save();
              // return($request['noorder']);
              // die();

          }else{
            // return($request['jamakhir']);
            //   die();
            CssdPengemasan::where('noorder',$norec)
                   ->update([
                             'jammulai' => $request['jammulai'],
                             'jamakhir' => $request['jamakhir'],
                             'tanggal' => $request['tanggal'],
                             'objectpetugaspenerimafk' => $request['petugaspenerima'],
                             'statusenabled' => true
                            ]
                            );
          }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Pengemasan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Pengemasan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }
        return $this->respond($result);
    }

    public function SimpanSterilisasi(Request $request) {
        $norec = $request['norec'];
        $data = \DB::table('cssdsterilisasialat_t')
            // ->select('b.namabundel')
            ->where('objectcssdpermintaansterilisasifk',$norec)
            ->get();
        try{
          DB::beginTransaction();
          
          if (empty($data)){
              $a = new CssdSterilisasiAlat();
              $norecA = $a->generateNewId();
              $a->norec = $norecA;
              $a->kdprofile = 15;
              $a->statusenabled = 1;
              $a->objectcssdpermintaansterilisasifk = $request['norec'];         
              $a->jammulai = $request['jammulai'];
              $a->jamselesai = $request['jamakhir'];              
              $a->tanggal = $request['tanggal'];
              $a->tanggalexpired = $request['tanggalexpired'];                 
              $a->jenissterilisasi = $request['jenisSterilisasi'];              
              
              $a->save();
              // return($request['noorder']);
              // die();

          }else{
            // return($request['jamakhir']);
            //   die();
            CssdSterilisasiAlat::where('objectcssdpermintaansterilisasifk',$norec)
                   ->update([
                             'jammulai' => $request['jammulai'],
                             'jamselesai' => $request['jamakhir'],
                             'tanggal' => $request['tanggal'],
                             'tanggalexpired' => $request['tanggalexpired'],
                             'jenissterilisasi' => $request['jenisSterilisasi'],  
                             'statusenabled' => true
                            ]
                            );
          }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Sterilisasi Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Sterilisasi Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }
        return $this->respond($result);
    }

    public function UpdateKondisi(Request $request){
//        
        DB::beginTransaction();
        $transMessage = '';

        try {
            $dataSP = PermintaanSterilisasidetail::where('norec',$request['norec'])
            ->update([
                'kodisi' => $request['kondisi']
            ]);

            $transStatus = 'true';
                
        } catch (\Exception $e) {
            $transStatus = 'false';
        };

        if ($transStatus == 'true') {
            $transMessage = "Update kondisi berhasil";
            DB::commit();

            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@eka',
            );
        } else {
           $transMessage = "Update kondisi gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
//                "data" => $SP,
//                "kartustok" => $kartuStok,
//                "stokdetail" => $stokdetail,
                "as" => 'as@eka',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function SimpanDistribusi(Request $request) {
        DB::beginTransaction();
        // try{
        $a = StrukKirim::where('nokirim',$request['noKirim'])
                ->get();
         if (!empty($a)){
                $newSK = new StrukKirim();
                $noKirim = $this->generateCode(new StrukKirim, 'nokirim', 14, 'CSD-' . $this->getDateTime()->format('ym'));
                $dataSK = new StrukKirim;
                $dataSK->norec = $dataSK->generateNewId();
                $dataSK->nokirim = $noKirim;
                $dataSK->kdprofile = 0;
                $dataSK->statusenabled = true;
                $dataSK->qtyproduk=0;
                $dataSK->tglkirim=$request['tanggal'];
                $dataSK->totalbeamaterai=0;
                $dataSK->totalbiayakirim=0;
                $dataSK->totalbeamaterai=0;
                $dataSK->totalbiayatambahan=0;
                $dataSK->totaldiscount=0;
                $dataSK->totalhargasatuan=0;
                $dataSK->totalharusdibayar=0;
                $dataSK->totalpph=0;
                $dataSK->totalppn=0;
                $dataSK->qtydetailjenisproduk=0;
                $dataSK->objectpegawaipengirimfk=$request['idpegawai'];
                $dataSK->objectruanganasalfk=$request['objectruanganfk'];
                $dataSK->objectruangantujuanfk=$request['objectruangantujuanfk'];
                $dataSK->jenispermintaanfk=1;
                $dataSK->objectkelompoktransaksifk = 23;
                $dataSK->save();

                $newCD = new CssdDistribusi();
                $norecCD = $newCD->generateNewId();
                $newCD->norec = $norecCD;            
                $newCD->kdprofile = 15;
                $newCD->statusenabled = true;
                $newCD->objectcssdsterilisasiinternalfk = $request['noRec'];
                $newCD->objectstrukkirimfk = $dataSK['norec']; 
                $newCD->status = $request['status'];
                $newCD->save();

                // return $newCD;
                // die();
        }else{
            StrukKirim::where('nokirim',$request['noKirim'])
                   ->update([
                             'tglkirim' => $request['tanggal']]
                            );
            CssdDistribusi::where ('objectcssdsterilisasiinternalfk',$request['noRec'])
                    ->update([
                             'status'=>  $request['status']]
                            );
                // return $request->all();
                // die();
        }

            
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'iphe@gm',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'iphe@gm',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

}
