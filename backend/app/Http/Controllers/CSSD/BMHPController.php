<?php

namespace App\Http\Controllers\Transaksi\CSSD;

use App\Master\LoginUser;
use App\Transaksi\PelayananPasienDetail;
use Illuminate\Http\Request;
use DB;
//use App\Pegawai\ModulAplikasi;
//use App\Pegawai\MapObjekModulToKelompokUser;
//use App\Pegawai\MapObjekModulAplikasiToModulAplikasi;
//use App\Pegawai\ObjekModulAplikasi;
// use App\Master\MappingBMHPToSetAlat;
use App\Transaksi\MappingBMHPToSetAlat;
use App\Traits\Valet;

class BMHPController extends Transaksi
{
	 use Valet;

    public function __construct()
    {
        parent::__construct();
    }

    public function getBundel(Request $request){
    	$dataLogin = $request->all();
    	$databundel = \DB::table('bundlesetalat_m')
    			->get();
 		$result = array(
            'data' => $databundel,
            'by' => 'as@epic',
        );
        return $this->respond($result);		
    }

    public function getAlat(Request $request){
    	$dataLogin = $request->all();
    	$dataalat = \DB::table('produk_m')
    			->JOIN('satuanstandar_m','produk_m.objectsatuanstandarfk','=','satuanstandar_m.id')
    			// ->selectRaw('produk_m.id', 'produk_m.kdprofile', 'produk_m.statusenabled', 'produk_m.kodeexternal', "produk_m.namaexternal", 'produk_m.norec', 'produk_m.reportdisplay', 'produk_m.objectaccountfk', 'produk_m.objectbahanprodukfk', 
       //                   'produk_m.objectbentukprodukfk', 'produk_m.objectdepartemenfk', 'produk_m.objectdetailgolonganprodukfk', 'produk_m.objectdetailjenisprodukfk', 'produk_m.objectfungsiprodukfk', 'produk_m.objectgprodukfk', 
       //                   'produk_m.objectgolonganprodukfk', 'produk_m.objectjenisperiksafk', 'produk_m.objectkategoryprodukfk', 'produk_m.objectlevelprodukfk', 'produk_m.objectprodusenprodukfk', 'produk_m.objectsatuanbesarfk', 
       //                   'produk_m.objectsatuankecilfk', 'produk_m.objectsatuanstandarfk', "produk_m.objectstatusprodukfk", 'produk_m.objecttypeprodukfk', 'produk_m.objectunitlaporanfk', 'produk_m.objectwarnaprodukfk', 'produk_m.deskripsiproduk', 
       //                   'produk_m.isprodukintern', 'produk_m.kdbarcode', 'produk_m.kdproduk', 'produk_m.kdproduk_intern', 'produk_m.kekuatan', 'produk_m.namaproduk', 'produk_m.nilainormal', 'produk_m.qproduk', 'produk_m.qtyjualterkecil', 
       //                   'produk_m.qtykalori', 'produk_m.qtykarbohidrat', 'produk_m.qtylemak', 'produk_m.qtyporsi', 'produk_m.qtyprotein', 'produk_m.qtysatukemasan', 'produk_m.qtyterkecil', 'produk_m.kdprodukintern', 
       //                   'produk_m.objectjenisperiksapenunjangfk', 'produk_m.bahansamplefk', 'produk_m.objectdetailobatfk', 'produk_m.objectgenerikfk', 'produk_m.objectmerkprodukfk', 'produk_m.objectrekananfk', 'produk_m.objectsediaanfk', 
       //                   'produk_m.objectstatusbarangfk', 'produk_m.golongandarahfk', 'produk_m.rhesusfk', 'produk_m.kodebmn', 'produk_m.spesifikasi', 'produk_m.tglproduksi', 'produk_m.status', 'produk_m.verifikasianggaran', 'produk_m.isarvdonasi', 
       //                   'produk_m.isnarkotika', 'produk_m.ispsikotropika', 'produk_m.isonkologi', 'produk_m.isoot', 'produk_m.isprekusor', 'produk_m.isvaksindonasi', 'produk_m.objectjenisgenerikfk', 'produk_m.keterangan', 'produk_m.poinmedis', 
       //                   'produk_m.isgeneric', 'produk_m.objectkelompokprodukbpjsfk', 'produk_m.isantibiotik', 'satuanstandar_m.satuanstandar','0 as jumlah')
          ->selectRaw('0 AS jumlah, produk_m.id, produk_m.namaexternal, produk_m.norec, produk_m.objectsatuanstandarfk, satuanstandar_m.satuanstandar')

//     	lect('id','kdprofile','statusenabled','kodeexternal','namaexternal','norec','reportdisplay','nama')
       				->where('produk_m.namaexternal','like','%-BHP')
				->get();

 		$result = array(
            'data' => $dataalat,
        );
        return $this->respond($result);		
    }

    public function SaveAllMapping(Request $request){
         // try{
          // $bundleid = $request[0]['bundleSetAlat'];
          DB::beginTransaction();
          // $dataLogin = $request->all();
          // $HapusPPD = MappingBMHPToSetAlat::where('objectbundlesetalatfk', $bundleid)->delete();
          $r_bmhp = $request['RevMappingBMHPToSetAlat'];
          // return($request['RevMappingBMHPToSetAlat']);
          // die();
          $rows = $request['RevMappingBMHPToSetAlat'];   
          // foreach ($rows as $key) {
            
          //   return $key;
          // }
          // // return $rows[1];
          // die();
          // foreach($rows as $rloop){
          //   return $rloop;
          // }
          // d
         
            foreach ($rows as $rloop){
               // \DB::statement('SET IDENTITY_INSERT mappingbmhptosetalat_m ON;');
                if($rloop['statusenabled'] == true){
                  $rloop['statusenabled'] = 1;
                }else{
                  $rloop['statusenabled'] = 0;
                }
                $newB = new MappingBMHPToSetAlat();

                $newB->kdprofile = 15;         
                $newB->norec = $newB->generateNewId();
                $newB->statusenabled = $rloop['statusenabled'];
                // $newB->id = $rloop['id'];
                $newB->namaexternal = $rloop['namaProduk'];
                $newB->kodeexternal = $rloop['namaProduk'];
                $newB->reportdisplay = $rloop['namaProduk'];
                $newB->jumlah = $rloop['jumlah'];
                $newB->objectbmhpfk = $rloop['bmhp'];
                $newB->objectbundlesetalatfk = $rloop['bundleSetAlat'];
                $newB->save();
              }
        // }
            $transStatus = 'true';
        // } catch (\Exception $e) {
            // $transStatus = 'false';
        // }
        if ($transStatus == 'true') {
            $transMessage = "Simpan bundel Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSR,//$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan bundel Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'as@epic',
            );
        }
      
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getById(Request $request){
    	$dataLogin = $request->all();
   		$dbundel = \DB::table('mappingbmhptosetalat_m')
            ->join('bundlesetalat_m','mappingbmhptosetalat_m.objectbundlesetalatfk','=','bundlesetalat_m.id')
            ->select('mappingbmhptosetalat_m.id','mappingbmhptosetalat_m.kdprofile','mappingbmhptosetalat_m.statusenabled', 'mappingbmhptosetalat_m.kodeexternal','mappingbmhptosetalat_m.namaexternal','mappingbmhptosetalat_m.norec', 'mappingbmhptosetalat_m.reportdisplay','mappingbmhptosetalat_m.objectbmhpfk','mappingbmhptosetalat_m.objectbundlesetalatfk','mappingbmhptosetalat_m.jumlah','mappingbmhptosetalat_m.satuan','bundlesetalat_m.namaexternal as Expr1')
    //       ->join('mappingbmhptosetalat_m','bundlesetalat_m.id', '=', 'mappingbmhptosetalat_m.objectbundlesetalatfk')
				// //->select('id','kdprofile','statusenabled','kodeexternal','namaexternal','norec','reportdisplay','nama')
    //       ->select('bundlesetalat_m.id', 'bundlesetalat_m.kdprofile', 'bundlesetalat_m.statusenabled','bundlesetalat_m.kodeexternal', 'bundlesetalat_m.namaexternal', 'bundlesetalat_m.norec', 'bundlesetalat_m.reportdisplay', 'bundlesetalat_m.nama', 'mappingbmhptosetalat_m.objectbundlesetalatfk', 'mappingbmhptosetalat_m.namaexternal AS Expr1', 'mappingbmhptosetalat_m.jumlah')
   				->where('mappingbmhptosetalat_m.objectbundlesetalatfk','=',$request['idBundle'])
				->get();
//         SELECT        bundlesetalat_m.id, bundlesetalat_m.kdprofile, bundlesetalat_m.statusenabled,
//          bundlesetalat_m.kodeexternal, bundlesetalat_m.namaexternal, bundlesetalat_m.norec, bundlesetalat_m.reportdisplay, 
//          bundlesetalat_m.nama, 
//                          mappingbmhptosetalat_m.objectbundlesetalatfk, mappingbmhptosetalat_m.namaexternal AS Expr1, 
//                          mappingbmhptosetalat_m.jumlah
// FROM            bundlesetalat_m INNER JOIN
//                          mappingbmhptosetalat_m ON bundlesetalat_m.id = mappingbmhptosetalat_m.objectbundlesetalatfk
 		$result = array(
            'data' => $dbundel,
            'by' => 'as@epic',
        );
         return $this->respond($result);	
	}

    public function unMapping(Request $request){
      $dataLogin = $request->all();
         DB::beginTransaction();
        try{
            // return ($request['id']);
            // die();
            MappingBMHPToSetAlat::where('id',$request['id'])->delete();
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
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                // "noresep" => $newSR,//$noResep,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}