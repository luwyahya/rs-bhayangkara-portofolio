<?php
/**
 * Created by PhpStorm.
 * User: Efan Andrian(ea@epic)
 * Date: 14-Aug-19
 * Time: 16:35
 */
namespace App\Http\Controllers\SysAdmin\Master;

use App\Http\Controllers\ApiController;
use App\Master\HargaNettoProdukByKelas1;
use App\Master\HargaNettoProdukByKelasD;
use App\Master\JenisDiet;
use App\Master\JenisWaktu;
use App\Master\Kamar;
use App\Master\KategoryDiet;
use App\Master\Kelas;
use App\Master\KomponenHarga;
use App\Master\MapKelompokPasientoPenjamin;
use App\Master\MapRuanganToProduk;
use App\Master\Produk;
use App\Master\Rekanan;
use App\Master\Ruangan;
use App\Master\SiklusGizi;
use App\Master\SlottingOnline;
use App\Master\StatusBed;
use App\Master\TempatTidur;
use App\Traits\Valet;
use App\Transaksi\KonversiSatuan;
use App\Transaksi\OrderPelayanan;
use DB;
use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;

class MasterController extends ApiController{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication=false);
    }

    public function getListProduk(Request $request,$limit=null){
        //get request
        $filter = $request->all();

        //get data
        $data = \DB::table('produk_m as p')
            ->select('p.id','p.kdproduk','p.kdbarcode','p.deskripsiproduk','p.namaproduk as namaproduk','dj.detailjenisproduk','p.statusenabled')
            ->leftJoin('rm_sediaan_m as rm','rm.id','=','p.objectsediaanfk')
            ->leftJoin('merkproduk_m as mp','mp.id','=','objectmerkprodukfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','p.objectrekananfk')
            ->leftJoin('golongandarah_m as gd','gd.id','=','p.golongandarahfk')
            ->leftJoin('status_barang_m as sb','sb.id','=','p.objectstatusbarangfk')
            ->leftJoin('rhesus_m as rh','rh.id','=','p.rhesusfk')
            ->leftJoin('rm_generik_m as rg','rg.id','=','p.objectgenerikfk')
            ->leftJoin('rm_detail_obat_m as rd','rd.id','=','p.objectdetailobatfk')
            ->leftJoin('bahansample_m as bs','bs.id','=','p.bahansamplefk')
            ->leftJoin('chartofaccount_m as ch','ch.id','=','p.objectaccountfk')
            ->leftJoin('bahanproduk_m as bh','bh.id','=','p.objectbahanprodukfk')
            ->leftJoin('bentukproduk_m as bp','bp.id','=','p.objectbentukprodukfk')
            ->leftJoin('departemen_m as dp','dp.id','=','p.objectdepartemenfk')
            ->leftJoin('detailgolonganproduk_m as dg','dg.id','=','p.objectdetailgolonganprodukfk')
            ->leftJoin('detailjenisproduk_m as dj','dj.id','=','p.objectdetailjenisprodukfk')
            ->leftJoin('jenisproduk_m as jsm','jsm.id','=','dj.objectjenisprodukfk');

        if(isset($filter['kdProduk']) && !empty($filter['kdProduk'])){
            $data = $data->where('p.id','=',$filter['kdProduk']);
        }elseif (isset($filter['kdInternal']) && !empty($filter['kdInternal'])) {
            $data = $data->where('p.kdproduk','=',$filter['kdInternal']);
        }elseif (isset($filter['kdBarcode']) && !empty($filter['kdBarcode'])) {
            $data = $data->where('p.kdbarcode','=',$filter['kdBarcode']);
        }elseif (isset($filter['kdBmn']) && !empty($filter['kdBmn'])) {
            $data = $data->where('p.kodebmn','=',$filter['kdBmn']);
        }elseif (isset($filter['nmProduk']) && !empty($filter['nmProduk'])) {
            $data = $data->where('p.namaproduk','ilike','%'.$filter['nmProduk'].'%');
        }elseif (isset($filter['nmProduk']) && !empty($filter['nmProduk'])) {
            $data = $data->where('p.namaproduk','ilike','%'.$filter['nmProduk'].'%');
        }elseif (isset($filter['nmDepart']) && !empty($filter['nmDepart'])) {
            if($filter['nmDepart'] == 16)
            {
                $data = $data->where('jsm.id','=',97);
            }else{
            // $data = $data->where('jsm.id','=',277);
            }
        }
        if(isset($filter['detailJenis']) && !empty($filter['detailJenis'])){
            $data = $data->where('p.objectdetailjenisprodukfk','=',$filter['detailJenis']);
        }


       
        $data = $data->orderBy('p.namaexternal');
        $data = $data->take($filter['jmlRows']);
        $data = $data->get();
        return $this->respond($data);
    }

    public function UpdateStatusEnabledProduk(Request $request){
        DB::beginTransaction();
        $data=$request['data'];
        try {

                $dataOP = Produk::where('id', $request['id'])
                    ->update([
                        'statusenabled' => $request['status'],
                ]);

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveDataProduk(Request $request){
        DB::beginTransaction();
        $data = $request->all();

        // return($data['maxtime']);
        // die();
        try {
            if ($data['id'] == null || $data['id'] == ''){
                $newId = Produk::max('id');
                $newId = $newId + 1;
                $prod = new Produk();
                $prod->id = $newId;
                $prod->kdprofile = 0;
            }else{
                $prod =  Produk::where('id',$data['id'])->first();
            }
            $prod->statusenabled =  $data['statusenabled'];
            $prod->kodeexternal = $data['kodeexternal'];
            $prod->namaexternal = $data['namaexternal'];
            $prod->norec = $prod->generateNewId();
            $prod->reportdisplay = $data['reportdisplay'];
            $prod->objectaccountfk = $data['objectaccountfk'];
            $prod->objectbahanprodukfk = $data['objectbahanprodukfk'];
            $prod->objectbentukprodukfk = $data['objectbentukprodukfk'];
            $prod->objectdepartemenfk = $data['objectdepartemenfk'];
            $prod->objectdetailgolonganprodukfk = $data['objectdetailgolonganprodukfk'];
            $prod->objectsediaanfk = $data['objectsediaanfk'];
            $prod->objectdetailjenisprodukfk = $data['objectdetailjenisprodukfk'];
            $prod->objectfungsiprodukfk = $data['objectfungsiprodukfk'];
            $prod->objectgprodukfk = $data['objectgprodukfk'];
            $prod->objectgolonganprodukfk = $data['objectgolonganprodukfk'];
            $prod->objectjenisperiksafk = $data['objectjenisperiksafk'];
            $prod->objectkategoryprodukfk = $data['objectkategoryprodukfk'];
            $prod->objectlevelprodukfk = $data['objectlevelprodukfk'];
            $prod->objectkelompokprodukbpjsfk = $data['objectkelompokprodukbpjsfk'];
            $prod->objectprodusenprodukfk = $data['objectprodusenprodukfk'];
            $prod->objectsatuanbesarfk = $data['objectsatuanbesarfk'];
            $prod->objectsatuankecilfk = $data['objectsatuankecilfk'];
            $prod->objectsatuanstandarfk = $data['objectsatuanstandarfk'];
            $prod->objectstatusprodukfk = $data['objectstatusprodukfk'];
            $prod->objecttypeprodukfk = $data['objecttypeprodukfk'];
            $prod->objectunitlaporanfk = $data['objectunitlaporanfk'];
            $prod->objectwarnaprodukfk = $data['objectwarnaprodukfk'];
            $prod->deskripsiproduk = $data['deskripsiproduk'];
            $prod->kdbarcode = $data['kdbarcode'];
            $prod->kdproduk = $data['kdproduk'];
            $prod->kdproduk_intern = $data['kdproduk_intern'];
            $prod->kekuatan = $data['kekuatan'];
            $prod->namaproduk = $data['namaproduk'];
            $prod->nilainormal = $data['nilainormal'];
            $prod->qproduk = $data['qproduk'];
            $prod->qtyjualterkecil = $data['qtyjualterkecil'];
            $prod->maxhari = $data['maxhari'];
            $prod->maxqty = $data['maxqty'];
            $prod->mintime = $data['mintime'];
            $prod->maxtime = $data['maxtime'];
            $prod->qtylemak = $data['qtylemak'];
            $prod->qtyporsi = $data['qtyporsi'];
            $prod->qtyprotein = $data['qtyprotein'];
            $prod->qtysatukemasan = $data['qtysatukemasan'];
            $prod->qtyterkecil = $data['qtyterkecil'];
            $prod->qtykalori = $data['qtykalori'];
            $prod->qtykarbohidrat = $data['qtykarbohidrat'];
            $prod->kdprodukintern = $data['kdprodukintern'];
            $prod->objectjenisperiksapenunjangfk = $data['objectjenisperiksapenunjangfk'];
            $prod->bahansamplefk = $data['bahansamplefk'];
            $prod->objectdetailobatfk = $data['objectdetailobatfk'];
            $prod->objectgenerikfk = $data['objectgenerikfk'];
            $prod->objectmerkprodukfk = $data['objectmerkprodukfk'];
            $prod->objectrekananfk = $data['objectrekananfk'];
            $prod->objectsediaanfk = $data['objectsediaanfk'];
            $prod->objectstatusbarangfk = $data['objectstatusbarangfk'];
            $prod->golongandarahfk = $data['golongandarahfk'];
            $prod->rhesusfk = $data['rhesusfk'];
            $prod->kodebmn = $data['kodebmn'];
            $prod->spesifikasi = $data['spesifikasi'];
            $prod->tglproduksi = $data['tglproduksi'];
            $prod->status = $data['status'];
            $prod->verifikasianggaran = $data['verifikasianggaran'];
            if (isset($request['isprodukintern'] )&& $request['isprodukintern'] != "" && $request['isprodukintern'] != "undefined" && $request['isprodukintern'] != 'null'){
                $prod->isprodukintern = $data['isprodukintern'];
            }
            if (isset($request['isarvdonasi']) && $request['isarvdonasi'] != "" && $request['isarvdonasi'] != "undefined" && $request['isarvdonasi'] != 'null'){
                $prod->isarvdonasi = $data['isarvdonasi'];
            }
            if (isset($request['isnarkotika'])&& $request['isnarkotika'] != "" && $request['isnarkotika'] != "undefined" && $request['isnarkotika'] != 'null'){
                $prod->isnarkotika = $data['isnarkotika'];
            }
            if (isset($request['ispsikotropika'])&& $request['ispsikotropika'] != "" && $request['ispsikotropika'] != "undefined" && $request['ispsikotropika'] != 'null'){
                $prod->ispsikotropika = $data['ispsikotropika'];
            }
            if (isset($request['isonkologi'])&& $request['isonkologi'] != "" && $request['isonkologi'] != "undefined" && $request['isonkologi'] != 'null'){
                $prod->isonkologi = $data['isonkologi'];
            }
            if (isset($request['isoot'])&& $request['isoot'] != "" && $request['isoot'] != "undefined" && $request['isoot'] != 'null'){
                $prod->isoot = $data['isoot'];
            }
            if (isset($request['isprekusor']) && $request['isprekusor'] != "" && $request['isprekusor'] != "undefined" && $request['isprekusor'] != 'null'){
                $prod->isprekusor = $data['isprekusor'];
            }
            if (isset($request['isvaksindonasi']) && $request['isvaksindonasi'] != "" && $request['isvaksindonasi'] != "undefined" && $request['isvaksindonasi'] != 'null'){
                $prod->isvaksindonasi = $data['isvaksindonasi'];
            }
            if (isset($request['objectjenisgenerikfk'])&& $request['objectjenisgenerikfk'] != "" && $request['objectjenisgenerikfk'] != "undefined" && $request['objectjenisgenerikfk'] != 'null'){
                $prod->objectjenisgenerikfk = $data['objectjenisgenerikfk'];
            }
            if (isset($request['keterangan'])&& $request['keterangan'] != "" && $request['keterangan'] != "undefined" && $request['keterangan'] != 'null'){
                $prod->keterangan = $data['keterangan'];
            }
            if (isset($request['poinmedis'])&& $request['poinmedis'] != "" && $request['poinmedis'] != "undefined" && $request['poinmedis'] != 'null'){
                $prod->poinmedis = $data['poinmedis'];
            }
            // if (isset($request['persen_individu'])){
            //     $prod->persen_individu = $data['persen_individu'];
            // }
            // if (isset($request['persen_kelompok'])){
            //     $prod->persen_kelompok = $data['persen_kelompok'];
            // }
            // if (isset($request['persen_pengirim'])){
            //     $prod->persen_pengirim = $data['persen_pengirim'];
            // }
            $prod->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updatekekuatan(Request $request){
        DB::beginTransaction();
        $data = $request->all();

        try {
            // return($data['id']);
            $prod =  Produk::where('id',$data['id'])->first();                    
            $prod->kekuatan = $data['kekuatan'];
            $prod->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();

        }

    }

    public function getProdukbyId(Request $request){
        $id = $request['idProduk'];
        $data = \DB::table('produk_m as p')
            ->select('p.*','dj.objectjenisprodukfk','dj.detailjenisproduk','dj.objectjenisprodukfk',
                'jp.jenisproduk','jp.objectkelompokprodukfk','kp.kelompokproduk','ss.satuanstandar',
                'kategory.kategoryproduk','rg.name as rm_generikname','gnr.namagproduk','level.levelproduk',
                'dp.namadepartemen','fungsi.fungsiproduk','bentuk.namabentukproduk','bhn.namabahanproduk',
                'type.typeproduk','warna.warnaproduk','merk.merkproduk','rd.name as detailobat','golongan.golonganproduk',
                'dg.detailgolonganproduk')
            ->leftJoin('rm_sediaan_m as rm','rm.id','=','p.objectsediaanfk')
            ->leftJoin('merkproduk_m as merk','merk.id','=','objectmerkprodukfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','p.objectrekananfk')
            ->leftJoin('golongandarah_m as gd','gd.id','=','p.golongandarahfk')
            ->leftJoin('status_barang_m as sb','sb.id','=','p.objectstatusbarangfk')
            ->leftJoin('rhesus_m as rh','rh.id','=','p.rhesusfk')
            ->leftJoin('rm_generik_m as rg','rg.id','=','p.objectgenerikfk')
            ->leftJoin('rm_detail_obat_m as rd','rd.id','=','p.objectdetailobatfk')
            ->leftJoin('bahansample_m as bs','bs.id','=','p.bahansamplefk')
            ->leftJoin('chartofaccount_m as ch','ch.id','=','p.objectaccountfk')
            ->leftJoin('bahanproduk_m as bhn','bhn.id','=','p.objectbahanprodukfk')
            ->leftJoin('bentukproduk_m as bentuk','bentuk.id','=','p.objectbentukprodukfk')
            ->leftJoin('departemen_m as dp','dp.id','=','p.objectdepartemenfk')
            ->leftJoin('detailgolonganproduk_m as dg','dg.id','=','p.objectdetailgolonganprodukfk')
            ->leftJoin('detailjenisproduk_m as dj','dj.id','=','p.objectdetailjenisprodukfk')
            ->leftJoin('jenisproduk_m as jp','jp.id','=','dj.objectjenisprodukfk')
            ->leftJoin('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
            ->leftJoin('satuanstandar_m as ss','ss.id','=','p.objectsatuanstandarfk')
            ->leftJoin('kategoryproduk_m as kategory','kategory.id','=','p.objectkategoryprodukfk')
            ->leftJoin('generalproduk_m as gnr','gnr.id','=','p.objectgprodukfk')
            ->leftJoin('levelproduk_m as level','level.id','=','p.objectlevelprodukfk')
            ->leftJoin('fungsiproduk_m as fungsi','fungsi.id','=','p.objectfungsiprodukfk')
            ->leftJoin('typeproduk_m as type','type.id','=','p.objecttypeprodukfk')
            ->leftJoin('warnaproduk_m as warna','warna.id','=','p.objectwarnaprodukfk')
            ->leftJoin('golonganproduk_m as golongan','golongan.id','=','p.objectgolonganprodukfk')
            ->where('p.id','=',$id)
            ->get();

        $id_jenisproduk = $data[0]->objectjenisprodukfk;
        if(!empty($id_jenisproduk)){
            $data_jenisproduk = DB::table('jenisproduk_m')
                ->select('objectkelompokprodukfk')
                ->where('id',$id_jenisproduk)
                ->get();

            //add field to obj
            $data[0]->objectkelompokprodukfk = $data_jenisproduk[0]->objectkelompokprodukfk;
        }
        return $this->respond($data);
    }

    public function getjenisproduk(Request $request){
        $idkp = $request['kelompokProdukfk'];
        // return($idkp);
        // die();
        $data = \DB::table('jenisproduk_m')
            ->select('id','objectkelompokprodukfk as id_kelompokproduk','jenisproduk');

        if($idkp !== null){
            $data = $data->where('objectkelompokprodukfk','=',$idkp);
        }
        $data = $data->get();
        return $this->respond($data);
    }

    public function getDetailjenisprodukbyIdjenisproduk(Request $request){
        $id = $request['jenisProdukId'];
        $data = DB::table('detailjenisproduk_m')
            ->select('id','detailjenisproduk')
            ->where('objectjenisprodukfk','=',$id)
            ->get();

        return $this->respond($data);
    }

    public function getDataComboMaster(Request $request){
        $kelompokProdukfk = $request['kelompokProdukfk'];
        $JenisProdukfk = $request['objectjenisprodukfk'];
        $dataLogin = $request->all();
        $dataPegawaiUser = \DB::select(\Illuminate\Support\Facades\DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        // Kategory Produk //
            $kategori = DB::table('kategoryproduk_m')
                ->select('id','kategoryproduk')
                ->where('statusenabled', true)
                ->get();

            $generik = DB::table('rm_generik_m')
                ->select('id','name')
                ->where('statusenabled', true)
                ->get();

            $gproduk = $data = DB::table('generalproduk_m')
                ->select('id','namagproduk')
                ->where('statusenabled', true)
                ->get();

            $levelproduk = $data = DB::table('levelproduk_m')
                ->select('id','levelproduk')
                ->where('statusenabled', true)
                ->get();

            $detailjenis = \DB::table('detailjenisproduk_m')
                ->select('id','objectjenisprodukfk as id_jenisproduk','detailjenisproduk')
                ->where('statusenabled', true)
                ->get();
        // Kategory Produk //

        // Spesifikasi Produk //
            $fungsiproduk = DB::table('fungsiproduk_m')
                ->select('id','fungsiproduk')
                ->where('statusenabled', true)
                ->get();

            $golonganproduk = DB::table('golonganproduk_m')
                ->select('id','golonganproduk')
                ->where('statusenabled', true)
                ->get();

            $bentukproduk = DB::table('bentukproduk_m')
                ->select('id','namabentukproduk')
                ->where('statusenabled', true)
                ->get();

            $bahanproduk = DB::table('bahanproduk_m')
                ->select('id','namabahanproduk')
                ->where('statusenabled', true)
                ->get();

            $typeproduk =  DB::table('typeproduk_m')
                ->select('id','typeproduk')
                ->where('statusenabled', true)
                ->get();

            $warnaproduk = DB::table('warnaproduk_m')
                ->select('id','warnaproduk')
                ->where('statusenabled', true)
                ->get();

            $merkproduk = DB::table('merkproduk_m')
                ->select('id','merkproduk')
                ->where('statusenabled', true)
                ->get();

            $detailobat = $data = DB::table('rm_detail_obat_m')
                ->select('id','name')
                ->where('statusenabled', true)
                ->get();

            $detailgolonganproduk = DB::table('detailgolonganproduk_m')
                ->select('id','detailgolonganproduk')
                ->where('statusenabled', true)
                ->get();
        // Spesifikasi Produk //

        // Satuan Produk //
            $satuanbesar =  DB::table('satuanbesar_m')
                ->select('id','satuanbesar')
                ->where('statusenabled', true)
                ->get();

            $satuankecil = DB::table('satuankecil_m')
                ->select('id','satuankecil')
                ->where('statusenabled', true)
                ->get();

            $satuanstandar =  DB::table('satuanstandar_m')
                ->select('id','satuanstandar')
                ->where('statusenabled', true)
                ->get();
        // Satuan Produk //

        // Bahan Sample Produk //
            $jenisperiksa = DB::table('jenisperiksapenunjang_m')
                ->select('id','jenisperiksa')
                ->where('statusenabled', true)
                ->get();

            $jenisperiksapenunjang = DB::table('jenisperiksapenunjang_m')
                ->select('id','jenisperiksa')
                ->where('statusenabled', true)
                ->get();

            $bahansample = DB::table('bahansample_m')
                ->select('id','namabahansample')
                ->where('statusenabled', true)
                ->get();
        // Bahan Sample Produk //

        // Bank Darah //
            $rhesus = $data = DB::table('rhesus_m')
                ->select('id','rhesus')
                ->where('statusenabled', true)
                ->get();

            $golongandarah =  DB::table('golongandarah_m')
                ->select('id','golongandarah')
                ->where('statusenabled', true)
                ->get();
        // Bank Darah //
            $kelompokproduk = \DB::table('kelompokproduk_m')
                ->select('id','kelompokproduk')
                ->where('statusenabled', true)
                ->get();

            $jenisproduk = \DB::table('jenisproduk_m')
                ->select('id','objectkelompokprodukfk as id_kelompokproduk','jenisproduk')
                ->where('statusenabled', true);
            if (isset($kelompokProdukfk) && $kelompokProdukfk != "" && $kelompokProdukfk != "undefined" && $kelompokProdukfk != 'null') {
                $jenisproduk = $jenisproduk->where('objectkelompokprodukfk', $kelompokProdukfk);
            }
            $jenisproduk = $jenisproduk->get();

            $detailjenisProduk = DB::table('detailjenisproduk_m')
                ->select('id','detailjenisproduk')
                ->where('statusenabled', true);
                if (isset($JenisProdukfk) && $JenisProdukfk != "" && $JenisProdukfk != "undefined" && $JenisProdukfk != 'null') {
                    $detailjenisProduk = $detailjenisProduk->where('objectjenisprodukfk', $JenisProdukfk);
                }
            $detailjenisProduk = $detailjenisProduk->get();

            $dataInstalasi = \DB::table('departemen_m as dp')
                ->where('dp.statusenabled', true)
                ->orderBy('dp.namadepartemen')
                ->get();

            $produsenproduk = DB::table('produsenproduk_m')
                ->select('id','namaprodusenproduk')
                ->where('statusenabled', true)
                ->get();

            $statusproduk = DB::table('statusproduk_m')
                ->where('statusenabled', true)
                ->select('id','statusproduk')
                ->get();

            $chartofaccount = DB::table('chartofaccount_m')
                ->where('statusenabled', true)
                ->select('id','namaaccount')
                ->get();

            $kelompokprodukbpjs = \DB::table('kelompokprodukbpjs_m as djp')
                ->select('djp.id','djp.kelompokprodukbpjs')
                ->where('djp.statusenabled',true)->get();

            //////
            $dataRuangan = \DB::table('ruangan_m as ru')
                ->where('ru.statusenabled',true)
                ->orderBy('ru.namaruangan')
                ->get();

            $sediaan = \DB::table('rm_sediaan_m as sed')
                ->where('sed.statusenabled',true)
                ->orderBy('sed.reportdisplay')
                ->get();

            foreach ($dataInstalasi as $item){
                $detail=[];
                foreach ($dataRuangan  as $item2){
                    if ($item->id == $item2->objectdepartemenfk){
                        $detail[] =array(
                            'id' =>   $item2->id,
                            'ruangan' =>   $item2->namaruangan,
                        );
                    }
                }

                $dataDepartemen[]=array(
                    'id' =>   $item->id,
                    'departemen' =>   $item->namadepartemen,
                    'ruangan' => $detail,
                );
            }
            $dataModulAplikasi = \DB::table('modulaplikasi_s as ma')
                ->select('ma.id','ma.modulaplikasi')
                ->where('ma.statusenabled',true)
                ->orderBy('ma.modulaplikasi')
                ->take(100)
                ->get();

            $dataJenisRekanan = \DB::table('jenisrekanan_m as jr')
                ->select('jr.id','jr.jenisrekanan')
                ->where('jr.statusenabled',true)
                ->orderBy('jr.jenisrekanan')
                ->take(100)
                ->get();

            $dataKelompok = \DB::table('kelompokpasien_m as kp')
                ->select('kp.id', 'kp.kelompokpasien')
                ->where('kp.statusenabled', true)
                ->orderBy('kp.kelompokpasien')
                ->get();

            $dataKelas = \DB::table('kelas_m as kl')
                ->select('kl.id', 'kl.namakelas')
                ->where('kl.statusenabled', true)
                ->orderBy('kl.namakelas')
                ->get();

            $ruanganRajal = Ruangan::where('statusenabled',true)
            ->select('id','namaruangan','objectdepartemenfk')
            ->whereIn('objectdepartemenfk',[18])
            ->orderBy('namaruangan')
            ->get();
        $dataMappingrekanan = \DB::table('mapkelompokpasientopenjamin_m as mp')
        ->JOIN('rekanan_m as rk', 'mp.kdpenjaminpasien', '=', 'rk.id')
            ->select('rk.id', 'rk.reportdisplay', 'mp.objectkelompokpasienfk')
            ->where('rk.statusenabled', true)
            ->orderBy('rk.reportdisplay')
            ->get();
        $dataKelompokpasien = \DB::table('kelompokpasien_m as kp')
        ->select('kp.id', 'kp.kelompokpasien')
        ->where('kp.statusenabled', true)
        ->orderBy('kp.kelompokpasien')
        ->get();
        foreach ($dataKelompokpasien as $item) {
            $detail = [];
            foreach ($dataMappingrekanan  as $item2) {
                if ($item->id == $item2->objectkelompokpasienfk) {
                    $detail[] = array(
                        'id' =>   $item2->id,
                        'rekanan' =>   $item2->reportdisplay,
                    );
                }
            }

            $dataKelompokpasienfix[] = array(
                'id' =>   $item->id,
                'kelompokpasien' =>   $item->kelompokpasien,
                'rekanan' => $detail,
            );
        }
        $data = array(
            "datalogin" => $dataLogin,
            "detailuser" => $dataPegawaiUser,
            "kelompokproduk" => $kelompokproduk,
            "jenisproduk" => $jenisproduk,
            "detailjenisproduk" => $detailjenisProduk,
            "departemen" => $dataInstalasi,
            "produsenproduk" => $produsenproduk,
            "statusproduk" => $statusproduk,
            "chartofaccount" => $chartofaccount,
            'kelompokprodukbpjs' => $kelompokprodukbpjs,
            'departemen' => $dataDepartemen,
            'modulaplikasi' =>   $dataModulAplikasi,
            'jenisrekanan' => $dataJenisRekanan,
            'kelompokpasien' => $dataKelompok,
            "kategori" => array(
                "kategori" => $kategori,
                "generik" => $generik,
                "gproduk" => $gproduk,
                "level" => $levelproduk,
                "detailjenis" => $detailjenis,
            ),
            "spesifikasi" => array(
                "fungsiproduk" => $fungsiproduk,
                "bentukproduk" => $bentukproduk,
                "bahanproduk" => $bahanproduk,
                "typeproduk" => $typeproduk,
                "warnaproduk" => $warnaproduk,
                "merkproduk" => $merkproduk,
                "detailobat" => $detailobat,
                "golonganproduk" => $golonganproduk,
                "detailgolonganproduk" => $detailgolonganproduk,
                "sediaan" => $sediaan
            ),
            "satuan" => array(
                "standar" => $satuanstandar,
                "besar" => $satuanbesar,
                "kecil" => $satuankecil
            ),
            "penunjang" => array(
                "jenisperiksa" => $jenisperiksa,
                "jenisperiksapenunjang" => $jenisperiksapenunjang,
                "bahansample" => $bahansample
            ),
            "labdarah" => array(
                "golongandarah" => $golongandarah,
                "rhesus" => $rhesus
            ),

            "kelompokpasien" => $dataKelompokpasienfix,
            "kelas" => $dataKelas,
            "ruanganrajal" => $ruanganRajal,
            "ruangan" => $dataRuangan,
            "as" => "ea@epic"
        );
        return $this->respond($data);
    }

    public function getDataRekananMaster(Request $request) {
        $req=$request->all();
        $dataProduk=[];
        $dataProduk  = \DB::table('rekanan_m as st')
            ->select('st.id','st.namarekanan','st.alamatlengkap','st.telepon','st.faksimile')
            ->where('st.statusenabled',true)
            ->orderBy('st.namarekanan');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('st.namarekanan','ilike','%'. $req['filter']['filters'][0]['value'].'%' );
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();
        return $this->respond($dataProduk);
    }

    public function getDataProdukbyDetailProduk(Request $request) {
//        $req=$request->all();
        $dataProduk = \DB::table('produk_m as pr')
            ->select('pr.id','pr.namaproduk')
            ->where('pr.statusenabled',true)
            ->orderBy('pr.namaproduk');

        if(isset($request['namaproduk']) && $request['namaproduk']!="" && $request['namaproduk']!="undefined"){
            $dataProduk = $dataProduk->where('pr.namaproduk','ilike','%'. $request['namaproduk'].'%' );
        };

        if(isset($request['detailjenisprodukfk']) && $request['detailjenisprodukfk']!="" && $request['detailjenisprodukfk']!="undefined"){
            $dataProduk = $dataProduk->where('pr.objectdetailjenisprodukfk','=',$request['detailjenisprodukfk'] );
        };

        if(isset($request['kelompokBPJS']) && $request['kelompokBPJS']!="" && $request['kelompokBPJS']!="undefined"){
            $dataProduk = $dataProduk->where('pr.objectkelompokprodukbpjsfk','=',$request['kelompokBPJS']);
        };

//        $dataProduk = $dataProduk->take(200);
        $dataProduk = $dataProduk->get();

        $result = array(
            'produk' => $dataProduk,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getDataKelompok(Request $request) {
        $dataProduk = \DB::table('produk_m as pr')
            ->select('pr.id','pr.namaproduk')
            ->where('pr.statusenabled',true)
            ->orderBy('pr.namaproduk');
        if(isset($request['kelompokprodukbpjsfk']) && $request['kelompokprodukbpjsfk']!="" && $request['kelompokprodukbpjsfk']!="undefined"){
            $dataProduk = $dataProduk->where('pr.objectkelompokprodukbpjsfk','=', $request['kelompokprodukbpjsfk'] );
        };
        $dataProduk = $dataProduk->get();

        $result = array(
            'produk' => $dataProduk,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function SaveKelompokProduk(Request $request) {
        $req = $request['0'];
        try {
            foreach ($req['data'] as $item){
                $newKS = Produk::where('id',$item['produkId'])->first();
                $newKS->objectkelompokprodukbpjsfk = $item['kelompokprodukbpjsfk'];
                $newKS->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Simpan Kelompok";
        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "produk" => $newKS,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "produk" => $newKS,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataProdukPerKode(Request $request) {
        $req=$request->all();
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->select('pr.id', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar','pr.kdproduk')
            ->where('pr.statusenabled', true)
            ->orderBy('pr.namaproduk');

        if(isset($req['namaproduk']) &&
            $req['namaproduk']!="" &&
            $req['namaproduk']!="undefined"){
            $dataProduk = $dataProduk->where('pr.namaproduk','ilike','%'. $req['namaproduk'] .'%' );
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('pr.namaproduk','ilike','%'. $req['filter']['filters'][0]['value'].'%' );
        };
        $dataProduk = $dataProduk->take(20);
        $dataProduk = $dataProduk->get();

        $dataKonversiProduk = \DB::table('konversisatuan_t as ks')
            ->JOIN('satuanstandar_m as ss','ss.id','=','ks.satuanstandar_asal')
            ->JOIN('satuanstandar_m as ss2','ss2.id','=','ks.satuanstandar_tujuan')
            ->select('ks.objekprodukfk','ks.satuanstandar_asal','ss.satuanstandar',
                'ks.satuanstandar_tujuan','ss2.satuanstandar as satuanstandar2',
                'ks.nilaikonversi')
            ->where('ks.statusenabled',true)
            ->get();


        $dataProdukResult=[];
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
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
                'kdproduk' => $item->kdproduk,
            );
        }

        return $this->respond($dataProdukResult);
    }

    public function getKonversiSatuan(Request $request) {
        $data = \DB::table('produk_m as pr')
            ->leftJOIN('konversisatuan_t as ks','pr.id','=','ks.objekprodukfk')
            ->JOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->leftJOIN('satuanstandar_m as ss2','ss2.id','=','ks.satuanstandar_tujuan')
            ->select('ks.norec','ks.nilaikonversi','ks.objekprodukfk','ss.id as ssidasal','ss.satuanstandar as satuanstandar_asal',
                'ss2.id as ssidtujuan','ss2.satuanstandar as satuanstandar_tujuan');
//            ->where('ks.statusenabled',true);
        if(isset($request['produkfk']) && $request['produkfk']!="" && $request['produkfk']!="undefined"){
            $data = $data->where('pr.id', $request['produkfk'] );
        };
        $data = $data->get();

        return $this->respond($data);
    }

    public function SaveKonversiSatuan(Request $request) {
        $req = $request['0'];

        //## KartuStok
        $newKS2 = KonversiSatuan::where('objekprodukfk', $req['objekprodukfk'])->get();

        if (count($newKS2) < 1) {
            // return (count($newKS2));
            $x = new KonversiSatuan();
            $norecKS = $x->generateNewId();
            $x->kdprofile = 0;
            $x->statusenabled = true;
            $x->nilaikonversi = 1;
            $x->objekprodukfk = $req['objekprodukfk'];
            $x->satuanstandar_asal = $req['satuanstandar_asal'];
            $x->satuanstandar_tujuan = $req['satuanstandar_asal'];
            $x->save();
        }
        if ($req['norec'] == '-') {
            $newKS = new KonversiSatuan();
            $norecKS = $newKS->generateNewId();
        }else{
            $newKS = KonversiSatuan::where('norec',$req['norec'])->first();
            $norecKS = $req['norec'];
        }
        $newKS->norec = $norecKS;
        $newKS->kdprofile = 0;
        $newKS->statusenabled = true;
        $newKS->nilaikonversi = $req['nilaikonversi'];
        $newKS->objekprodukfk = $req['objekprodukfk'];
        $newKS->satuanstandar_asal = $req['satuanstandar_asal'];
        $newKS->satuanstandar_tujuan = $req['satuanstandar_tujuan'];
        try {
            $newKS->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Konversi Satuan";
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Konversi Satuan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newKS,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Konversi Satuan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newKS,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function hapusKonversiSatuan(Request $request) {
        $req = $request['0'];
        try {
            $newKS = KonversiSatuan::where('norec',$req['norec'])->delete();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Konversi Satuan";
        }
        if ($transStatus == 'true') {
            $transMessage = "Hapus Konversi Satuan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newKS,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Konversi Satuan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newKS,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getBarangKonversi(Request $request) {
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.statusenabled',true)
            ->orderBy('pr.namaproduk');

        if(isset($request['namaproduk']) && $request['namaproduk']!="" && $request['namaproduk']!="undefined"){
            $dataProduk = $dataProduk->where('pr.namaproduk','ilike','%'. $request['namaproduk'].'%' );
        };
        $dataProduk = $dataProduk->take(100);
        $dataProduk = $dataProduk->get();

        $dataDetailJenisProduk = \DB::table('detailjenisproduk_m as djp')
            ->select('djp.id','djp.detailjenisproduk','djp.objectjenisprodukfk')
            ->where('djp.statusenabled',true)->get();

        $dataJenisProduk = \DB::table('jenisproduk_m as jp')
            ->select('jp.id','jp.jenisproduk')
            ->where('jp.id',97)
            ->where('jp.statusenabled',true)->get();

        $dataSatuanStandar = \DB::table('satuanstandar_m as ss')
            ->select('ss.id','ss.satuanstandar')
            ->where('ss.statusenabled',true)->get();

//        $dataHIS = DB::select(DB::raw("
//             select ho.barcodeid,ho.hobatid,pr.namaproduk,ho.packageunit,ho.dosageform,ss.id as ssid,ss.satuanstandar,ho.statusenabled
//             from his_obat_ms_t as ho inner join produk_m as pr on cast(ho.hobatid as INTEGER) = pr.id
//             inner join satuanstandar_m as ss on ss.id = pr.objectsatuanstandarfk
//            where ho.statusenabled = :statusenabled order by ho.barcodeid"),
//            array(
//                'statusenabled' => true,
//            )
//        );

        foreach ($dataJenisProduk as $item){
            $detailjenisproduk=[];
            foreach ($dataDetailJenisProduk  as $item2){
                if ($item->id == $item2->objectjenisprodukfk){
                    $detailjenisproduk[] =array(
                        'id' =>   $item2->id,
                        'detailjenisproduk' =>   $item2->detailjenisproduk,
                    );
                }
            }

            $dataJenisProduk[]=array(
                'id' =>   $item->id,
                'jenisproduk' =>   $item->jenisproduk,
                'detailjenisproduk' => $detailjenisproduk,
            );
        }

        $result = array(
            'jenisproduk' => $dataJenisProduk,
            'produk' => $dataProduk,
            'satuanstandar' => $dataSatuanStandar,
//            'dataHIS' => $dataHIS,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function UpdateStatusEnabledRekanan(Request $request){
        DB::beginTransaction();
        $data=$request['data'];
        try {

            $dataOP = Rekanan::where('id', $request['id'])
                ->update([
                    'statusenabled' => $request['status'],
                ]);

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataRekanan(Request $request) {
        $dataLogin = $request->all();

        $dataRekanan = \DB::table('rekanan_m as r')
            ->JOIN ('jenisrekanan_m as jr','jr.id','=','r.objectjenisrekananfk')
            ->select('r.id', 'r.kdrekanan','r.kodeexternal' ,'r.namarekanan', 'jr.jenisrekanan',
                     'r.statusenabled','r.objectjenisrekananfk')
//            ->where('r.statusenabled',true)
            ->orderBy('r.id','ASC');
//            ->get();

        if (isset($request['kdrekanan']) && $request['kdrekanan'] != "" && $request['kdrekanan'] != "undefined") {
            $dataRekanan = $dataRekanan->where('r.kdrekanan', '=', $request['kdrekanan']);
        }
        if (isset($request['id']) && $request['id'] != "" && $request['id'] != "undefined") {
            $dataRekanan = $dataRekanan->where('r.id', '=', $request['id']);
        }
        if (isset($request['namarekanan']) && $request['namarekanan'] != "" && $request['namarekanan'] != "undefined") {
            $dataRekanan = $dataRekanan->where('r.namarekanan', 'ilike','%'. $request['namarekanan'].'%');
        }
        if (isset($request['objectjenisrekananfk']) && $request['objectjenisrekananfk'] != "" && $request['objectjenisrekananfk'] != "undefined") {
            $dataRekanan = $dataRekanan->where('r.objectjenisrekananfk', '=', $request['objectjenisrekananfk']);
        }
        if (isset($request['kodeexternal']) && $request['kodeexternal'] != "" && $request['kodeexternal'] != "undefined") {
            $dataRekanan = $dataRekanan->where('r.kodeexternal', '=', $request['kodeexternal']);
        }
        $dataRekanan = $dataRekanan -> take($request['jmlRows']);
        $dataRekanan = $dataRekanan -> get();
        $result = array(
            'rekanan' => $dataRekanan,
            'datalogin' => $dataLogin,
            'message' => 'ramdan@mithyc',
        );

        return $this->respond($result);
    }

    public function getRekananById(Request $request){
        $idRekanan = $request['idRekanan'];
        $data = \DB::table('rekanan_m as rek')
            ->select('rek.*','jr.jenisrekanan','mp.id as idmap','mp.objectkelompokpasienfk')
            ->leftJoin('chartofaccount_m as coa','coa.id','=','rek.objectaccountfk')
            ->leftJoin('desakelurahan_m as dk','dk.id','=','rek.objectdesakelurahanfk')
            ->leftJoin('jenisrekanan_m as jr','jr.id','=','rek.objectjenisrekananfk')
            ->leftJoin('kecamatan_m as kc','kc.id','=','rek.objectkecamatanfk')
            ->leftJoin('kotakabupaten_m as kk','kk.id','=','rek.objectkotakabupatenfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','rek.objectpegawaifk')
            ->leftJoin('propinsi_m as pr','pr.id','=','rek.objectpropinsifk')
            ->leftJoin('mapkelompokpasientopenjamin_m as mp','mp.kdpenjaminpasien','=','rek.id')
            ->where('rek.id','=', $idRekanan)
            ->get();
        return $this->respond($data);
    }

    public function saveDataRekanan(Request $request) {
        DB::beginTransaction();
        $dataLogin = $request->all();
        //## RUANGAN
        $r_R=$request['rekanan'];
        try{
            if ($request['rekanan']['idrekanan']==''){
                $newR = new Rekanan();
                $idRekanan = Rekanan::max('id');
                $idRekanan = $idRekanan + 1;
                $newR->id = $idRekanan;
                $newR->kdrekanan = $idRekanan;
                $newR->kdprofile = 0;
                $newR->norec = $idRekanan;
                $newR->kodeexternal = $idRekanan;
                $newR->statusenabled = true;


            }else{
                $newR =  Rekanan::where('id',$request['rekanan']['idrekanan'])->first();
            }
            // $newR->norec = $newR->generateNewId();
            $newR->namaexternal = $r_R['namarekanan'];
            $newR->reportdisplay = $r_R['namarekanan'];
            $newR->namarekanan = $r_R['namarekanan'];
    //        $newR->objectaccountfk = $r_R['objectaccountfk'];
            $newR->objectdesakelurahanfk = $r_R['desakelurahan']['id'];//$r_R['objectdesakelurahanfk'];
            $newR->objectjenisrekananfk = $r_R['objectjenisrekananfk'];
            $newR->objectkecamatanfk = $r_R['desakelurahan']['objectkecamatanfk'];
            $newR->objectkotakabupatenfk = $r_R['desakelurahan']['objectkotakabupatenfk'];
            $newR->objectpegawaifk = $r_R['objectpegawaifk'];
            $newR->objectpropinsifk = $r_R['desakelurahan']['objectpropinsifk'];
    //        $newR->objectrekananheadfk = $r_R['objectrekananheadfk'];
            $newR->alamatlengkap = $r_R['alamatlengkap'];
            $newR->bankrekeningnama = $r_R['bankrekeningnama'];
            $newR->bankrekeningnomor = $r_R['bankrekeningnomor'];
            $newR->contactperson = $r_R['contactperson'];
            $newR->desakelurahan = $r_R['desakelurahan']['namadesakelurahan'];
            $newR->email = $r_R['email'];
            $newR->faksimile = $r_R['faksimile'];
            $newR->kodepos = $r_R['kodepos'];
            $newR->kotakabupaten = $r_R['kotakabupaten']['namakotakabupaten'];
            $newR->nopkp = $r_R['nopkp'];
            $newR->npwp = $r_R['npwp'];
            $newR->rtrw = $r_R['rtrw'];
            $newR->telepon = $r_R['telepon'];
            $newR->website = $r_R['website'];
            $newR->namadirektur = $r_R['namadirektur'];
            $newR->jabatan = $r_R['jabatan'];
            $newR->namadesakelurahan = $r_R['desakelurahan']['namadesakelurahan'];
            $newR->namakecamatan = $r_R['desakelurahan']['namakecamatan'];
            $newR->namakotakabupaten = $r_R['desakelurahan']['namakotakabupaten'];
            $newR->rekananmoupksfk = $r_R['rekananmoupksfk'];
            $newR->perjanjiankerjasama = $r_R['perjanjiankerjasama'];
            $newR->qrekanan = 0;
            $newR->save();

            $idMap = MapKelompokPasientoPenjamin::max('id');
            $idMap = $idMap + 1;
                $r_R=$request['rekanan'];

            if ($request['rekanan']['idMap']==''){
                $newM = new MapKelompokPasientoPenjamin();
                $newM->id = $idMap;
                $newM->norec = $idMap;
                $newM->kodeexternal = $idMap;
                if($request['rekanan']['idrekanan'] == ''){
                    $newM->kdpenjaminpasien = $idRekanan;
                }else{
                    $newM->kdpenjaminpasien = $request['rekanan']['idrekanan'];
                }

            }else{
                $newM =  MapKelompokPasientoPenjamin::where('id',$request['rekanan']['idMap'])->first();
            }
            // $newR->norec = $newR->generateNewId();
            $newM->kdprofile = 0;
            $newM->statusenabled = true;
            $newM->namaexternal = '';
            $newM->reportdisplay = '';
            $newM->objectkelompokpasienfk = $r_R['objectkelompokpasienfk'];
            $newM->save();

        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "datRekanan" => $newR,
                "as" => 'egie@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datRekanan" => $newR,
                "as" => 'egie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getKelompokTableMaster(Request $request){
//        $data = DB::table('settingdatafixed_m')
//            ->select(DB::raw("case when kelompok is null then 'Lain-lain' else kelompok end as kelompok"))
//            ->groupBy('kelompok')
//            ->orderBy('kelompok')
//            ->get();
        $namaTable = $request['namatable'];
        $data = DB::select(DB::raw(
            "SELECT
                table_name as kelompok FROM information_schema.tables WHERE 
                --table_type = 'base table' and 
                table_name ilike '%_m'
                and table_name ilike '%$namaTable%'
                 order by table_name limit 50" 
        ));
        $result = array(
            'data' => $data,
            'as' => 'as@epic'
        );
        return $this->respond($result);
    }

    public function getTableRowDetail(Request $request) {
        $id = $request['id'];
        $table = $request['table'];
        $value = $request['value'];
        $text = $request['text'];
        $idid = $request['idid'];

        $dataRaw = DB::select(DB::raw(
            "
                SELECT $value as value,$text as text,$idid as idid
                FROM $table
                WHERE $value  = $id

            "
        ));


        return $this->respond($dataRaw);
    }

    public function saveTable(Request $request) {
        $table = $request['table'];
        $data = $request['data'];
        $id = $request['id'];

        $field = '';
        $values = '';
        if ($id != '-'){
            //update row data
            foreach ($data as $itm){
                if ($itm['id'] != 'id'){
                    if ($itm['data_type'] == 'nvarchar'){
                        $values = $values . "," . $itm['id'] . "='" . $itm['values'] . "'";
                    }elseif ($itm['data_type'] == 'nchar'){
                        $values = $values . "," . $itm['id'] . "='" . $itm['values'] . "'";
                    }else{
                        $values = $values . "," . $itm['id'] . "=" . (float)$itm['values'] ;
                    }
                }
            }

            $values = substr($values, 1, strlen($values)-1);;
            $queryStr = "
                update $table
                set " . $values . "
                where id = $id
            
            ";
        }else{
            //insert new row
            $maxID = DB::select(DB::raw(
                "
                SELECT max(id)
                FROM $table

            "
            ));
            $maxid = (int)$maxID[0] + 1;
            $field  = $field . "," . $itm['id'] ;
            $values = $values . "," . $itm['values'] . "'";
            foreach ($data as $itm){
                if ($itm['id'] != 'id'){
                    if ($itm['data_type'] == 'nvarchar'){
                        $field  = $field . "," . $itm['id'] ;
                        $values = $values . "," . $itm['values'] . "'";
                    }elseif ($itm['data_type'] == 'nchar'){
                        $field  = $field . "," . $itm['id'] ;
                        $values = $values . "," . $itm['values'] . "'";
                    }else{
                        $field  = $field . "," . $itm['id'] ;
                        $values = $values . "," . (float)$itm['values'] ;
                    }
                }
            }

            $values = substr($values, 1, strlen($values)-1);;
            $queryStr = "
                insert into $table
                 (" . $values . ")
                
                
            ";
        }

        $dataRaw = DB::statement(
            $queryStr
        );
        return $queryStr;
    }

    public function getTableDetail(Request $request) {
//        if($request['kelompok'] == 'Lain-lain'){
//            $request['kelompok']  = null;
//        }
//        $dataRaw = \DB::table('settingdatafixed_m')
//            ->where('kelompok', $request['kelompok'])
//            ->select('*','keteranganfungsi as caption','nilaifield')
//            ->orderBy('id');
//        $dataRaw = $dataRaw->get();
        $namaTable = $request['kelompok'];
        $filterField = $request['filterfield'];
        $filter = $request['filter'];

        $dataRaw = DB::select(DB::raw(
            "
                SELECT *
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME  ='$namaTable'

            "
        ));
        if  ($filterField == '-'){
            $dataTable = DB::select(DB::raw(
                "
                SELECT  *
                FROM $namaTable LIMIT 100

            "
            ));
        }else{
            $dataTable = DB::select(DB::raw(
                "
                SELECT  *
                FROM $namaTable
                WHERE $filterField ilike '%$filter%' LIMIT 100

            "
            ));
        }

        $setting = DB::table('mastertable_m')
            ->select('*')
            ->get();
        $dataraw3A =[];
        $dataColumn = [];
//        $i = 0 ;
        foreach ($dataRaw as $dataRaw2) {
            $head = '';

            $tipe ='';
            $idTabel = '';
            $textTabel = '';
            $tableRelasi = '';
            $column_name = '';
            foreach ($setting as $epan){
                if ($epan->namafield == $dataRaw2->column_name){
                    $tipe = 'combobox';
//                    $column_name = $epan->namafield;
//                    $idTabel = $epan->fieldkeytabelrelasi;
//                    $textTabel = $epan->fieldreportdisplaytabelrelasi;
//                    $tableRelasi = $epan->tabelrelasi;
                }
            }
            if ($tipe == ''){
                $type =  $dataRaw2->data_type;
            }else{
                $type =  $tipe;
            }





            $width = 0;
            if  ((float)$dataRaw2->character_maximum_length== null){
                $width =11 * 5;
            }else{
                $width = (float)$dataRaw2->character_maximum_length * 5;
            }
            $hide = false;
            if ($dataRaw2->column_name == 'kodeexternal'){
                $hide =true;
            }
            if ($dataRaw2->column_name == 'namaexternal'){
                $hide =true;
            }
            if ($dataRaw2->column_name == 'norec'){
                $hide =true;
            }
            if ($dataRaw2->column_name == 'reportdisplay'){
                $hide =true;
            }
            if (strpos($dataRaw2->column_name, 'object') !== false) {
                $hide =true;
            }
            $dataColumn[] = array(
                'field' => $dataRaw2->column_name,
                'title' => $dataRaw2->column_name,
                'width' => $width ,
                'hidden' => $hide
            );


            $dataraw3A[] = array(
                'table_catalog' => $dataRaw2->table_catalog,
                'table_schema' => $dataRaw2->table_schema,
                'table_name' => $dataRaw2->table_name,
                'column_name' => $dataRaw2->column_name,
                'ordinal_position' => $dataRaw2->ordinal_position,
                'is_nullable' => $dataRaw2->is_nullable,
                'data_type' => $dataRaw2->data_type,
                'caption' => $dataRaw2->column_name ,
                'character_maximum_length' => $dataRaw2->character_maximum_length ,

//                'cbotable' => $dataRaw2->tabelrelasi,
//                'fieldreportdisplaytabelrelasi' => $dataRaw2->fieldreportdisplaytabelrelasi,
//                'keteranganfungsi' => $dataRaw2->keteranganfungsi,
//                'namafield' => $dataRaw2->namafield,
                'id' => $dataRaw2->ordinal_position ,
//                'nilaifield' => $dataRaw2->nilaifield ,
//                'tabelrelasi' => $dataRaw2->tabelrelasi,
//                'typefield' => $dataRaw2->typefield,
                'type' =>$type ,
//                'kelompok' => $dataRaw2->kelompok,
                'value' => NULL ,
//                'text' => $dataRaw2->reportdisplay,

//                'kdprofile' => $dataRaw2->kdprofile,
//                'statusenabled' => $dataRaw2->statusenabled,
//                'kodeexternal'=> $dataRaw2->kodeexternal,
//                'namaexternal' => $dataRaw2->namaexternal,
//                'reportdisplay' => $dataRaw2->reportdisplay,
//                'fieldkeytabelrelasi' => $dataRaw2->fieldkeytabelrelasi,
//                'caption' => $head . $dataRaw2->caption ,
//
//                'cbotable' => $dataRaw2->tabelrelasi,
//                'fieldreportdisplaytabelrelasi' => $dataRaw2->fieldreportdisplaytabelrelasi,
//                'keteranganfungsi' => $dataRaw2->keteranganfungsi,
//                'namafield' => $dataRaw2->namafield,
//                'id' => $dataRaw2->id ,
//                'nilaifield' => $dataRaw2->nilaifield ,
//                'tabelrelasi' => $dataRaw2->tabelrelasi,
//                'typefield' => $dataRaw2->typefield,
//                'type' =>$type ,
//                'kelompok' => $dataRaw2->kelompok,
//                'value' => $dataRaw2->nilaifield ,
//                'text' => $dataRaw2->reportdisplay,
            );
//            $i = $i + 1;
        }



        $result = array(
            'kolom1' => $dataraw3A,
            'data' => $dataTable,
            'kolomsetting' => $dataColumn,
            'comboboxorigin' => $setting,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getComboPartTable(Request $request) {
        $id = $request['columnName'];
        $req= $request->all();
        $setting = DB::table('mastertable_m')
            ->select('*')
            ->where('namafield',$id)
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
            $data = $data->where("$namaField",'ilike','%'. $req['filter']['filters'][0]['value'].'%' );

        };
        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getKelompokUser(Request $request){
        $detailLogin = $request->all();
        $data = \DB::table('kelompokuser_s as ku')
            ->join('loginuser_s as lu','lu.objectkelompokuserfk','=','ku.id')
            ->select('ku.id','ku.kelompokuser','lu.namauser')
            ->where('lu.id',$request['luId'])
            ->first();
        $result = array(
            "data" => $data,
            "as" => 'as@rmdn',
        );
        return $this->respond($result);
    }

    public function view_harganettoprodukbykelas(Request $request){
        // return($request['namaproduk']);
        // die();
        $data= \DB::table('harganettoprodukbykelas_m as ht')
            ->leftjoin('asalproduk_m as ap', 'ap.id', '=', 'ht.objectasalprodukfk')
            ->leftjoin('jenistarif_m as jt', 'jt.id', '=', 'ht.objectjenistariffk')
            ->leftjoin('matauang_m as mu', 'mu.id', '=', 'ht.objectmatauangfk')
            ->join('produk_m as pr', 'pr.id', '=', 'ht.objectprodukfk')
            ->join('kelas_m as kl', 'kl.id', '=', 'ht.objectkelasfk')
            ->join('jenispelayanan_m as jp', 'jp.id', '=', 'ht.objectjenispelayananfk')
            ->select('ht.id','ht.kdprofile','ht.statusenabled','ht.kodeexternal','ht.namaexternal',
                'ht.norec','ht.reportdisplay','ht.objectasalprodukfk','ap.asalproduk','ht.objectjenistariffk','jt.jenistarif',
                'ht.objectkelasfk','kl.namakelas','ht.objectmatauangfk','mu.matauang','ht.objectprodukfk','pr.namaexternal as namaproduk',
                'ht.factorrate','ht.hargadiscount','ht.harganetto1','ht.harganetto2','ht.hargasatuan','ht.persendiscount',
                'ht.qtycurrentstok','ht.tglberlakuakhir','ht.tglberlakuawal','ht.tglkadaluarsalast','ht.id as id_hn_m','ht.objectjenispelayananfk','jp.jenispelayanan')
            ->where('ht.statusenabled',true)
        ;

        if(isset($request['namaproduk']) && $request['namaproduk']!="" && $request['namaproduk']!="undefined"){
            $data = $data->where('pr.namaexternal','ilike','%'. $request['namaproduk'] .'%');
        }
        if(isset($request['objectasalprodukfk']) && $request['objectasalprodukfk']!="" && $request['objectasalprodukfk']!="undefined"){
            $data = $data->where('ht.objectasalprodukfk', $request['objectasalprodukfk'] );
        }
        if(isset($request['objectjenistariffk']) && $request['objectjenistariffk']!="" && $request['objectjenistariffk']!="undefined"){
            $data = $data->where('ht.objectjenistariffk', $request['objectjenistariffk'] );
        }
        if(isset($request['objectkelasfk']) && $request['objectkelasfk']!="" && $request['objectkelasfk']!="undefined"){
            $data = $data->where('ht.objectkelasfk', $request['objectkelasfk']);
        }
        if(isset($request['objectmatauangfk']) && $request['objectmatauangfk']!="" && $request['objectmatauangfk']!="undefined"){
            $data = $data->where('ht.objectmatauangfk', $request['objectmatauangfk'] );
        }
        if(isset($request['objectprodukfk']) && $request['objectprodukfk']!="" && $request['objectprodukfk']!="undefined"){
            $data = $data->where('ht.objectprodukfk', $request['objectprodukfk']);
        }
        if(isset($request['id']) && $request['id']!="" && $request['id']!="undefined"){
            $data = $data->where('ht.id', $request['id']);
        }

        $data = $data->take(50)->get();

        return $this->respond($data);
    }

    public function GetTarifProduk(Request $request)
    {
        $hal = $request['page'];
        $skp = 10 * $hal;
        $produk = Produk::where('statusenabled',true);
        if(isset($request['namaproduk']) && $request['namaproduk']!="" && $request['namaproduk']!="undefined") {
            $produk = $produk->where('namaproduk','ilike','%'. $request->namaproduk .'%');
        }
        if ($skp < $produk->count()){
            $produk = $produk->take(10)->skip($skp);
        }
        $produk = $produk->get();

        foreach ($produk as $item){
            $list[] = array("id" => $item->id,
                "namaProduk" => $item->namaproduk,
            );
        }

        return $this->respond($list);
    }

    public function hapusHargaNettoByKelas(Request $request) {
        DB::beginTransaction();
        try{
            $JD = HargaNettoProdukByKelas1::where('id',$request['id'])
                ->update([
                    'statusenabled' => false
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function view_harganettoprodukbykelasD(Request $request){
        $data= \DB::table('harganettoprodukbykelasd_m as ht')
            ->join('komponenharga_m as kh', 'kh.id', '=', 'ht.objectkomponenhargafk')
//            ->join('jenistarif_m as jt', 'jt.id', '=', 'ht.objectjenistariffk')
//            ->join('matauang_m as mu', 'mu.id', '=', 'ht.objectmatauangfk')
//            ->join('produk_m as pr', 'pr.id', '=', 'ht.objectprodukfk')
//            ->join('kelas_m as kl', 'kl.id', '=', 'ht.objectkelasfk')
            ->select('ht.id','ht.kdprofile','ht.statusenabled','ht.kodeexternal','ht.namaexternal',
                'ht.norec','ht.reportdisplay','ht.objectasalprodukfk','ht.objectjenistariffk',
                'ht.objectkelasfk','ht.objectmatauangfk','ht.objectkomponenhargafk',
                'ht.factorrate','ht.hargadiscount','ht.harganetto1','ht.harganetto2','ht.hargasatuan','ht.persendiscount',
                'ht.qtycurrentstok','ht.tglberlakuakhir','ht.tglberlakuawal','ht.tglkadaluarsalast','kh.komponenharga',
                'ht.id as id_hn_d')
        ;

        if(isset($request['objectprodukfk']) && $request['objectprodukfk']!="" && $request['objectprodukfk']!="undefined"){
            $data = $data->where('ht.objectprodukfk',$request['objectprodukfk'] );
        }
        if(isset($request['objectkelasfk']) && $request['objectkelasfk']!="" && $request['objectkelasfk']!="undefined"){
            $data = $data->where('ht.objectkelasfk', $request['objectkelasfk'] );
        }
        if(isset($request['objectasalprodukfk']) && $request['objectasalprodukfk']!="" && $request['objectasalprodukfk']!="undefined" && $request['objectasalprodukfk']!='null'){
            $data = $data->where('ht.objectasalprodukfk', $request['objectasalprodukfk'] );
        }
        if(isset($request['objectjenistariffk']) && $request['objectjenistariffk']!="" && $request['objectjenistariffk']!="undefined" &&  $request['objectjenistariffk']!='null'){
            $data = $data->where('ht.objectjenistariffk', $request['objectjenistariffk']);
        }
        if(isset($request['objectmatauangfk']) && $request['objectmatauangfk']!="" && $request['objectmatauangfk']!="undefined" &&  $request['objectmatauangfk'] != 'null'){
            $data = $data->where('ht.objectmatauangfk', $request['objectmatauangfk'] );
        }
        if(isset($request['objectjenispelayananfk']) && $request['objectjenispelayananfk']!="" && $request['objectjenispelayananfk']!="undefined" && $request['objectjenispelayananfk']!='null'){
            $data = $data->where('ht.objectjenispelayananfk', $request['objectjenispelayananfk'] );
        }

        $data = $data->get();
        //return $this->respond(array($request['namaproduk']));
        return $this->respond($data);
    }

    public function getComboHargaNetto(Request $request){
        $jenisTarif = \DB::table('jenistarif_m')
            ->select('id','jenistarif as jenisTarif')
            ->where('statusenabled',true)
            ->orderBy('jenistarif')
            ->get();
        $asalProduk = \DB::table('asalproduk_m')
            ->select('id','asalproduk as asalProduk')
            ->where('statusenabled',true)
            // ->where('id',1)
            ->orderBy('asalproduk')
            ->get();

        $kelas = \DB::table('kelas_m')
            ->select('id','namakelas as namaKelas')
            ->where('statusenabled',true)
            ->orderBy('namakelas')
            ->get();
        $matauang = \DB::table('matauang_m')
            ->select('id','matauang as mataUang')
            ->where('statusenabled',true)
            ->orderBy('matauang')
            ->get();
        $sk = \DB::table('suratkeputusan_m')
            ->select('id','namask','nosk')
            ->where('statusenabled',true)
            ->orderBy('id')
            ->get();
        $jp = \DB::table('jenispelayanan_m')
            ->select('id','jenispelayanan as jenisPelayanan')
            ->where('statusenabled',true)
            ->orderBy('id')
            ->get();
        $sks =[];
        foreach ($sk as $item){
            $sks []= array(
                'id' => $item->id,
                'namask' => $item->namask,
                'nosk' => $item->nosk,
                'sk' => $item->nosk.' - '. $item->namask,
            );
        }
        $result = array(
            'jenistarif' => $jenisTarif,
            'asalproduk' => $asalProduk,
            'kelas' => $kelas,
            'matauang' => $matauang,
            'suratkeputusan' => $sks,
            'jenispelayanan' => $jp
        );
        return $this->respond($result);
    }

    public function ListMaster(Request $request){
        if(isset($request['jenis']) && $request['jenis']!="" && $request['jenis']!="undefined"){
            if ($request['jenis'] == 'ruangan'){
                $R = Ruangan::where('statusenabled',true)->get();
                foreach ($R as $item){
                    $data[] = ['id' =>  $item->id,
                        'namaruangan' => $item->namaruangan,
                    ];
                }
            }
            if ($request['jenis'] == 'kamar'){
                $R = Kamar::where('statusenabled',true)->get();
                foreach ($R as $item){
                    $data[] = ['id' =>  $item->id,
                        'namakamar' => $item->namakamar,
                    ];
                }
            }
            if ($request['jenis'] == 'statusbed'){
                $R = StatusBed::where('statusenabled',true)->get();
                foreach ($R as $item){
                    $data[] = ['id' =>  $item->id,
                        'statusbed' => $item->statusbed,
                    ];
                }
            }
            if ($request['jenis'] == 'kelas'){
                $R = Kelas::where('statusenabled',true)->get();
                foreach ($R as $item){
                    $data[] = ['id' =>  $item->id,
                        'namakelas' => $item->namakelas,
                    ];
                }
            }
            if ($request['jenis'] == 'komponenharga'){
                $R = KomponenHarga::where('statusenabled',true)->get();
                foreach ($R as $item){
                    $data[] = ['id' =>  $item->id,
                        'komponenharga' => $item->komponenharga,
                        'factorrate' => $item->factorrate,
                    ];
                }
            }
        }
        return $this->respond($data);
    }

    public function saveharganettoprodukbykelas_kelasD(Request $request){
        $idIdAn = 0;
        $input=$request->all();
        //return $this->respond(array($input['head']['idHead']));
        $transStatus = true;
        $transMsg =null;
        DB::beginTransaction();

        if ($input['jenis'] == 'simpan'){
            $h1 = 0;
            $h2 = 0;
            $h3 = 0;
            $h4 = 0;

            $newId = HargaNettoProdukByKelas1::max('id');
            $newId = $newId + 1;

            $HHHH = new HargaNettoProdukByKelas1();
            $HHHH->id = $newId;
            $idIdAn=$newId;
            $HHHH->hargadiscount = (float)$h1;
            $HHHH->harganetto1 = (float)$h2;
            $HHHH->harganetto2 = (float)$h3;
            $HHHH->hargasatuan = (float)$h4;
            $HHHH->objectprodukfk = $input['head']['objectprodukfk'];
            $HHHH->objectjenistariffk = $input['head']['objectjenistariffk'];
            $HHHH->objectasalprodukfk = $input['head']['objectasalprodukfk'];
            $HHHH->objectkelasfk = $input['head']['objectkelasfk'];
            $HHHH->objectmatauangfk = $input['head']['objectmatauangfk'];
            $HHHH->persendiscount = (float)$input['head']['persendiscount'];
            $HHHH->factorrate = (float)$input['head']['factorrate'];
            $HHHH->qtycurrentstok = (float)$input['head']['qtycurrentstok'];
            if(isset($input['head']['tglberlakuakhir']) && $input['head']['tglberlakuakhir']!="" && $input['head']['tglberlakuakhir']!="undefined"){
                $HHHH->tglberlakuakhir = $input['head']['tglberlakuakhir'];
            }
            if(isset($input['head']['tglberlakuawal']) && $input['head']['tglberlakuawal']!="" && $input['head']['tglberlakuawal']!="undefined"){
                $HHHH->tglberlakuawal = $input['head']['tglberlakuawal'];
            }
            if(isset($input['head']['tglkadaluarsalast']) && $input['head']['tglkadaluarsalast']!="" && $input['head']['tglkadaluarsalast']!="undefined"){
                $HHHH->tglkadaluarsalast = $input['head']['tglkadaluarsalast'];
            }
            $HHHH->reportdisplay = $input['head']['reportdisplay'];
            $HHHH->kodeexternal = $input['head']['kodeexternal'];
            $HHHH->namaexternal = $input['head']['namaexternal'];
            $HHHH->statusenabled = true;

            try {
                $HHHH->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Simpan New HargaNettoProdukByKelas Gagal";
            }
        }//end simpan head
        if ($input['jenis'] == 'update'){
            if ($input['detail']['idDetail'] != '') {
                $hhhh_D = HargaNettoProdukByKelasD::where('id', $input['detail']['idDetail'])->first();
                $hhhh_D->objectkomponenhargafk = $input['detail']['objectkomponenhargafk'];
                $hhhh_D->factorrate = $input['detail']['factorrate'];
                $hhhh_D->hargadiscount = $input['detail']['hargadiscount'];
                $hhhh_D->harganetto1 = $input['detail']['harganetto1'];
                $hhhh_D->harganetto2 = $input['detail']['harganetto2'];
                $hhhh_D->hargasatuan = $input['detail']['hargasatuan'];
                $hhhh_D->persendiscount = $input['detail']['persendiscount'];
                if(isset($input['head']['tglberlakuakhir']) && $input['head']['tglberlakuakhir']!="" && $input['head']['tglberlakuakhir']!="undefined"){
                    $hhhh_D->tglberlakuakhir = $input['head']['tglberlakuakhir'];
                }
                if(isset($input['head']['tglberlakuawal']) && $input['head']['tglberlakuawal']!="" && $input['head']['tglberlakuawal']!="undefined"){
                    $hhhh_D->tglberlakuawal = $input['head']['tglberlakuawal'];
                }
                if(isset($input['head']['tglkadaluarsalast']) && $input['head']['tglkadaluarsalast']!="" && $input['head']['tglkadaluarsalast']!="undefined"){
                    $hhhh_D->tglkadaluarsalast = $input['head']['tglkadaluarsalast'];
                }
                try {
                    $hhhh_D->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Update HargaNettoProdukByKelasD Gagal";
                    //break;
                }
            }
            if ($input['detail']['idDetail'] == '' && $input['detail']['objectkomponenhargafk'] != 0) {
                $ID_id_an = $this->getSequence('harganettoprodukbykelasd_m_id_seq');

                $hhhh_D = new  HargaNettoProdukByKelasD;
                $hhhh_D->id = $ID_id_an;
                $hhhh_D->kdprofile = 0;
                $hhhh_D->statusenabled = 1;
                //$hhhh_D->kodeexternal = '';
                //$hhhh_D->namaexternal = '';
                $hhhh_D->norec = $hhhh_D->generateNewId();
                //$hhhh_D->reportdisplay = '';
                $hhhh_D->objectasalprodukfk = $input['head']['objectasalprodukfk'];
                $hhhh_D->objectjenistariffk = $input['head']['objectjenistariffk'];
                $hhhh_D->objectkelasfk = $input['head']['objectkelasfk'];
                $hhhh_D->objectkomponenhargafk = $input['detail']['objectkomponenhargafk'];
                $hhhh_D->objectmatauangfk = $input['head']['objectmatauangfk'];
                $hhhh_D->objectprodukfk = $input['head']['objectprodukfk'];
                $hhhh_D->factorrate = $input['detail']['factorrate'];
                $hhhh_D->hargadiscount = $input['detail']['hargadiscount'];
                $hhhh_D->harganetto1 = $input['detail']['harganetto1'];
                $hhhh_D->harganetto2 = $input['detail']['harganetto2'];
                $hhhh_D->hargasatuan = $input['detail']['hargasatuan'];
                $hhhh_D->persendiscount = $input['detail']['persendiscount'];
                //$hhhh_D->qtycurrentstok = 0;
//                $hhhh_D->tglberlakuakhir = null;
//                $hhhh_D->tglberlakuawal = null;
//                $hhhh_D->tglkadaluarsalast = null;
                if ($transStatus) {
                    try {
                        $hhhh_D->save();
                    } catch (\Exception $e) {
                        $transStatus = false;
                        $transMsg = "Add HargaNettoProdukByKelasD Gagal";
                    }
                }
            }

            try{
                $HD = HargaNettoProdukByKelasD::where('objectprodukfk',$input['head']['objectprodukfk'])
                    ->where('objectjenistariffk',$input['head']['objectjenistariffk'])
                    ->where('objectasalprodukfk',$input['head']['objectasalprodukfk'])
                    ->where('objectkelasfk',$input['head']['objectkelasfk'])
                    ->where('objectmatauangfk',$input['head']['objectmatauangfk'])->get();
            }
            catch(\Exception $e){
                $transStatus = false;
                $transMsg = "Get sum HargaNettoProdukByKelasD Gagal";
                //break;
            }

            if ($transStatus) {
                $h1 = 0;
                $h2 = 0;
                $h3 = 0;
                $h4 = 0;
                foreach ($HD as $item) {
                    $h1 = $h1 + $item->hargadiscount;
                    $h2 = $h2 + $item->harganetto1;
                    $h3 = $h3 + $item->harganetto2;
                    $h4 = $h4 + $item->hargasatuan;
                }

                $HHHH = HargaNettoProdukByKelas1::where('id', $input['head']['idHead'])->first();
                $HHHH->hargadiscount = (float)$h1;
                $HHHH->harganetto1 = (float)$h2;
                $HHHH->harganetto2 = (float)$h3;
                $HHHH->hargasatuan = (float)$h4;
                //klo di update relasi ke komponen jd rusak
                //                $HHHH->objectjenistariffk = $input['head']['objectjenistariffk'];
                //                $HHHH->objectasalprodukfk = $input['head']['objectasalprodukfk'];
                //                $HHHH->objectkelasfk = $input['head']['objectkelasfk'];
                //                $HHHH->objectmatauangfk = $input['head']['objectmatauangfk'];
                //end#### klo di update relasi ke komponen jd rusak
                $HHHH->persendiscount = (float)$input['head']['persendiscount'];
                $HHHH->factorrate = (float)$input['head']['factorrate'];
                $HHHH->qtycurrentstok = (float)$input['head']['qtycurrentstok'];
                //                if(isset($input['head']['tglberlakuakhir']) && $input['head']['tglberlakuakhir']!="" && $input['head']['tglberlakuakhir']!="undefined"){
                //                    $HHHH->tglberlakuakhir = $input['head']['tglberlakuakhir'];
                //                }
                //                if(isset($input['head']['tglberlakuawal']) && $input['head']['tglberlakuawal']!="" && $input['head']['tglberlakuawal']!="undefined"){
                //                    $HHHH->tglberlakuawal = $input['head']['tglberlakuawal'];
                //                }
                //                if(isset($input['head']['tglkadaluarsalast']) && $input['head']['tglkadaluarsalast']!="" && $input['head']['tglkadaluarsalast']!="undefined"){
                //                    $HHHH->tglkadaluarsalast = $input['head']['tglkadaluarsalast'];
                //                }
                $HHHH->reportdisplay = $input['head']['reportdisplay'];
                $HHHH->kodeexternal = $input['head']['kodeexternal'];
                $HHHH->namaexternal = $input['head']['namaexternal'];
                //                $transStatus = false;
                //                $HHHH->save();

                try {
                    $HHHH->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Update HargaNettoProdukByKelas Gagal";
                    //return $this->respond($HD);
                    //break;
                }
            }

        }//end jenis update
        if ($input['jenis'] == 'delete'){
            if ($input['detail']['idDetail'] != '') {
                try {
                    $hhhh_D = HargaNettoProdukByKelasD::where('id', $input['detail']['idDetail'])->delete();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Delete HargaNettoProdukByKelasD Gagal";
                    //break;
                }
            }


            try{
                $HD = HargaNettoProdukByKelasD::where('objectprodukfk',$input['head']['objectprodukfk'])
                    ->where('objectjenistariffk',$input['head']['objectjenistariffk'])
                    ->where('objectasalprodukfk',$input['head']['objectasalprodukfk'])
                    ->where('objectkelasfk',$input['head']['objectkelasfk'])
                    ->where('objectmatauangfk',$input['head']['objectmatauangfk'])->get();
            }
            catch(\Exception $e){
                $transStatus = false;
                $transMsg = "Get sum HargaNettoProdukByKelasD Gagal";
                //break;
            }

            if ($transStatus) {
                $h1 = 0;
                $h2 = 0;
                $h3 = 0;
                $h4 = 0;
                foreach ($HD as $item) {
                    $h1 = $h1 + $item->hargadiscount;
                    $h2 = $h2 + $item->harganetto1;
                    $h3 = $h3 + $item->harganetto2;
                    $h4 = $h4 + $item->hargasatuan;
                }

                $HHHH = HargaNettoProdukByKelas1::where('id', $input['head']['idHead'])->first();
                $HHHH->hargadiscount = (float)$h1;
                $HHHH->harganetto1 = (float)$h2;
                $HHHH->harganetto2 = (float)$h3;
                $HHHH->hargasatuan = (float)$h4;
                //klo di update relasi ke komponen jd rusak
                //                $HHHH->objectjenistariffk = $input['head']['objectjenistariffk'];
                //                $HHHH->objectasalprodukfk = $input['head']['objectasalprodukfk'];
                //                $HHHH->objectkelasfk = $input['head']['objectkelasfk'];
                //                $HHHH->objectmatauangfk = $input['head']['objectmatauangfk'];
                //end#### klo di update relasi ke komponen jd rusak
                $HHHH->persendiscount = (float)$input['head']['persendiscount'];
                $HHHH->factorrate = (float)$input['head']['factorrate'];
                $HHHH->qtycurrentstok = (float)$input['head']['qtycurrentstok'];
                //                if(isset($input['head']['tglberlakuakhir']) && $input['head']['tglberlakuakhir']!="" && $input['head']['tglberlakuakhir']!="undefined"){
                //                    $HHHH->tglberlakuakhir = $input['head']['tglberlakuakhir'];
                //                }
                //                if(isset($input['head']['tglberlakuawal']) && $input['head']['tglberlakuawal']!="" && $input['head']['tglberlakuawal']!="undefined"){
                //                    $HHHH->tglberlakuawal = $input['head']['tglberlakuawal'];
                //                }
                //                if(isset($input['head']['tglkadaluarsalast']) && $input['head']['tglkadaluarsalast']!="" && $input['head']['tglkadaluarsalast']!="undefined"){
                //                    $HHHH->tglkadaluarsalast = $input['head']['tglkadaluarsalast'];
                //                }
                $HHHH->reportdisplay = $input['head']['reportdisplay'];
                $HHHH->kodeexternal = $input['head']['kodeexternal'];
                $HHHH->namaexternal = $input['head']['namaexternal'];
                //                $transStatus = false;
                //                $HHHH->save();

                try {
                    $HHHH->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Update HargaNettoProdukByKelas Gagal";
                    //return $this->respond($HD);
                    //break;
                }
            }

        }//end jenis Delete
        if($transStatus){
            $this->setStatusCode(201);
            $transMsg = "Transaksi Berhasil";
            //DB::rollBack();
            DB::commit();
        }else{
            $this->setStatusCode(400);
            DB::rollBack();
        }
        return $this->respond(['id'=>$idIdAn], $transMsg);
    }

    public function getDataMapRuanganToProduk(Request $request) {
        $data = \DB::table('mapruangantoproduk_m as mp')
            ->JOIN('produk_m as pr','pr.id','=','mp.objectprodukfk')
            ->JOIN('ruangan_m as ru','ru.id','=','mp.objectruanganfk')
            ->join ('departemen_m as dpt','dpt.id','=','ru.objectdepartemenfk')
            ->select('mp.id','mp.norec','mp.kodeexternal','pr.id as idproduk','pr.namaproduk','ru.id as ruanganid','ru.namaruangan','mp.statusenabled','dpt.namadepartemen');

        if(isset($request['deptId']) && $request['deptId']!="" && $request['deptId']!="undefined"){
            $data = $data->where('dpt.id','=',$request['deptId']);
        }
        if(isset($request['kdproduk']) && $request['kdproduk']!="" && $request['kdproduk']!="undefined"){
            $data = $data->where('pr.namaproduk','ilike', '%'.$request['kdproduk'].'%');
        }
        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangan']);
        }
        if(isset($request['isExsekutif']) && $request['isExsekutif']!="" && $request['isExsekutif']!="undefined"){
            $data = $data->where('pr.namaproduk','ilike', '%'.$request['isExsekutif']);
        }

        $data = $data->take(2000);
        $data = $data->orderBy('mp.id');
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );

        return $this->respond($result);
    }

    public function deleteMapRuanganToKelas(Request $request)
    {
        DB::beginTransaction();
        try {
            $idMap=$request['id'];
            $delete = DB::delete("delete from mapruangantokelas_m where id='$idMap'");

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateMapRuanganToKelas(Request $request)
    {
        DB::beginTransaction();
        try {
            // return($request['statusenabled']);
            // die();
            $idMap=$request['id'];
            $statusenabled=$request['statusenabled'];
            $delete = DB::delete("update mapruangantokelas_m set statusenabled='$statusenabled' where id='$idMap'");

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Update gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveMapRuanganToKelas(Request $request)
    {
        DB::beginTransaction();
        try {
            $maxId = DB::table('mapruangantokelas_m')->find(DB::table('mapruangantokelas_m')->max('id'));
            $nextId = $maxId->id+1;
            $rowDataforInsert[] = array(
                        "id" => (int)$nextId,
                        "statusenabled" => (bool)"t",
                        "kodeexternal" => "UNAND",
                        "namaexternal" => $request['namaruangan'],
                        "norec" => (int)$nextId,
                        "reportdisplay" => $request['namaruangan'],
                        "objectkelasfk" => (int)$request['idKelas'],
                        "objectruanganfk" => (int)$request['idRuangan'],

                    );
            $is_saved = DB::table('mapruangantokelas_m')
                    ->insert($rowDataforInsert);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getMapRuanganToKelas(Request $request) {
        $data = \DB::table('mapruangantokelas_m as mp')
            ->JOIN('kelas_m as kl','kl.id','=','mp.objectkelasfk')
            ->JOIN('ruangan_m as ru','ru.id','=','mp.objectruanganfk')
            ->join ('departemen_m as dpt','dpt.id','=','ru.objectdepartemenfk')
            ->select('mp.id','mp.norec','mp.kodeexternal','ru.id as ruanganid','ru.namaruangan','mp.statusenabled','dpt.namadepartemen','kl.namakelas');

        if(isset($request['deptId']) && $request['deptId']!="" && $request['deptId']!="undefined"){
            $data = $data->where('dpt.id','=',$request['deptId']);
        }
        if(isset($request['kdkelas']) && $request['kdkelas']!="" && $request['kdkelas']!="undefined"){
            $data = $data->where('kl.id','=', $request['kdkelas']);
        }
        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangan']);
        }
       

        $data = $data->take(20);
        $data = $data->orderBy('mp.id');
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );

        return $this->respond($result);
    }
    public function getDataRuangan(Request $request) {
        $data = DB::table('ruangan_m as ru')
            ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk','dp.namadepartemen','ru.statusenabled')
            ->whereIn('ru.objectdepartemenfk', [3, 18, 16, 24, 28, 27]);

        if(isset($request['kdInstalasi']) && $request['kdInstalasi']!="" && $request['kdInstalasi']!="undefined"){
            $data = $data->where('dp.id','=',$request['kdInstalasi']);
        }
       
        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangan']);
        }
       

        $data = $data->take(5);
        $data = $data->orderBy('ru.namaruangan');
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );

        return $this->respond($result);
    }
    public function updateRuangan(Request $request)
    {
        DB::beginTransaction();
        try {
            // return($request['statusenabled']);
            // die();
            $idMap=$request['id'];
            $statusenabled=$request['statusenabled'];
            $namaruangan=$request['namaruangan'];
            $delete = DB::delete("update ruangan_m set statusenabled='$statusenabled',namaruangan='$namaruangan' where id='$idMap'");

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Update gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveRuangan(Request $request)
    {
        DB::beginTransaction();
        try {
            $maxId = DB::table('ruangan_m')->find(DB::table('ruangan_m')->max('id'));
            $nextId = $maxId->id+1;
            $rowDataforInsert[] = array(
                        "id" => (int)$nextId,
                        "statusenabled" => (bool)"t",
                        "kodeexternal" => "UNAND",
                        "kdinternal" => $request['kodeBPJS'],
                        "namaexternal" => $request['namaruangan'],
                        "namaruangan" => $request['namaruangan'],
                        "norec" => (int)$nextId,
                        "reportdisplay" => $request['namaruangan'],
                        "objectdepartemenfk" => (int)$request['instalasi'],
                        "objectruanganfk" => (int)$request['idRuangan'],
                        "qruangan" => (int)$nextId,
                        "tanggal" => date('Y-m-d H:i:s'),
                        "statusviewdata" => (bool)"t",

                    );
            $is_saved = DB::table('ruangan_m')
                    ->insert($rowDataforInsert);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataKamar(Request $request) {
        $data = DB::table('kamar_m as kr')
            ->join('ruangan_m as ru', 'ru.id', '=', 'kr.objectruanganfk')
            ->join('kelas_m as km','km.id','=','kr.objectkelasfk')
            ->select('ru.objectruanganfk', 'ru.namaruangan', 'kr.namakamar','kr.id','kr.statusenabled','km.namakelas','kr.qtybed');

       
        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangan']);
        }
        if(isset($request['kdkelas']) && $request['kdkelas']!="" && $request['kdkelas']!="undefined"){
            $data = $data->where('km.id','=', $request['kdkelas']);
        }
         if(isset($request['kamarId']) && $request['kamarId']!="" && $request['kamarId']!="undefined"){
            $data = $data->where('kr.id','=', $request['kamarId']);
        }
       

        $data = $data->take(5);
        $data = $data->orderBy('ru.namaruangan');
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );

        return $this->respond($result);
    }
    public function updateKamar(Request $request)
    {
        DB::beginTransaction();
        try {
            // return($request['statusenabled']);
            // die();
            $idMap=$request['id'];
            $statusenabled=$request['statusenabled'];
            $namakamar=$request['namakamar'];
            $delete = DB::delete("update kamar_m set statusenabled='$statusenabled',namakamar='$namakamar' where id='$idMap'");

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Update gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKamar(Request $request)
    {
        DB::beginTransaction();
        try {
            $maxId = DB::table('kamar_m')->find(DB::table('kamar_m')->max('id'));
            $nextId = $maxId->id+1;
            $rowDataforInsert[] = array(
                        "id" => (int)$nextId,
                        "statusenabled" => (bool)"t",
                        "kdprofile" => "18",
                        "kodeexternal" => "Cianjur",
                        "namaexternal" => $request['namaKamar'],
                        "namakamar" => $request['namaKamar'],
                        "norec" => (int)$nextId,
                        "reportdisplay" => $request['namaKamar'],
                        "objectruanganfk" => (int)$request['namaruangan'],
                        "objectkelasfk" => (int)$request['kelas'],
                        "kdkamar" => (int)$nextId,
                        "qkamar" => (int)$nextId,
                        // "tanggal" => date('Y-m-d H:i:s'),
                        "qtybed" => (int)$request['qtyBed'],
                        "jumlakamarisi" => (int)$request['jmlKamarIsi'],
                        "jumlakamarkosong" => (int)$request['jmlKamarKosong'],

                    );
            $is_saved = DB::table('kamar_m')
                    ->insert($rowDataforInsert);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateTipeLayanan(Request $request){
        DB::beginTransaction();
        try {
            $objectkelompokfk=$request['objectkelompokfk'];
            $id=$request['id'];
            $data = DB::update(DB::raw("update maptipelayanan_m set objectkelompokfk='$objectkelompokfk'
                    WHERE id ='$id'"));
                     $message = array(
                         'message' => 'ok',
                         'code' => 200,
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
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveMapAccountBank(Request $request){
        DB::beginTransaction();
        try {
            $maxId = DB::table('mapaccountbank_m')->find(DB::table('mapaccountbank_m')->max('id'));
            $nextId = $maxId->id+1;
            $rowDataforInsert[] = array(
                        "id" => (int)$nextId,
                        "statusenabled" => (bool)"t",
                        "kdprofile" => "18",
                        "kodeexternal" => "Cianjur",
                        "objectcoafk" => $request['objectcoafk'],
                        "norec" => (int)$nextId,
                        "objectbankfk" => $request['objectbankfk']
                    );
            $is_saved = DB::table('mapaccountbank_m')
                    ->insert($rowDataforInsert);
              $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusMapAccountBank(Request $request){
        DB::beginTransaction();
        try {
            $idMap=$request['id'];
            $delete = DB::delete("delete from mapaccountbank_m where id='$idMap'");

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataAccountBank(Request $request) {
        $data = DB::table('mapaccountbank_m as kr')
            ->join('bank_m as ba', 'ba.id', '=', 'kr.objectbankfk')
            ->join('chartofaccount_m as coa','coa.id','=','kr.objectcoafk')
            ->select('kr.id','ba.nama', 'coa.namaaccount','coa.noaccount');

       
        
       

        $data = $data->take(5);
        $data = $data->orderBy('ba.nama');
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );

        return $this->respond($result);
    }
    public function getDataMapTipeLayanan(Request $request) {
        $data = DB::table('maptipelayanan_ as kr')
            ->leftjoin('kelompoktransaksi_m as ba', 'ba.id', '=', 'kr.objectkelompokfk')
            ->leftjoin('mapbkutokelompoktransaksi_m as mkt', 'mkt.kelompoktransaksifk', '=', 'kr.objectkelompokfk')
            ->select('kr.id','kr.tipelayanan', 'ba.kelompoktransaksi','kr.objectkelompokfk','mkt.id as mktid');

        $data = $data->take(10);
        $data = $data->orderBy('kr.id');
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );

        return $this->respond($result);
    }

    public function getProdukbyIdformap(Request $request){
        $ids = $request->all();

        $data = \DB::table('produk_m')
            ->select('id','namaproduk');

        if(isset($ids['iddjenis']) && !empty($ids['iddjenis'])){
            $data = $data->where('objectdetailjenisprodukfk',$ids['iddjenis']);
        }elseif (isset($ids['idruang']) && !empty($ids['idruang'])) {
            $ids_produk = DB::table('mapruangantoproduk_m')
                ->select('objectprodukfk')
                ->where('objectruanganfk',$ids['idruang'])
                ->get();

            foreach ($ids_produk as $idproduk) {
                $idsproduk[] = (int)$idproduk->objectprodukfk;
            }

            if(!empty($idsproduk)){
                $data = $data->whereIn('id',$idsproduk);
            }else{
                $data = $data->where('id','=',intval(''));
            }

        }

        $data = $data->orderBy('namaproduk')
            ->get();

        return $this->respond($data);
    }

    public function tombolDisable (Request $request) {
        $data=$request['data'];
        \Illuminate\Support\Facades\DB::beginTransaction();
        try{
            #region savePegawaiFormPensiun
            foreach ($data as $item) {
                $disableProduk = MapRuanganToProduk::where('id', $item['id'])->first();
                $disableProduk->statusenabled = $item['statusenabled'];
                $disableProduk->save();
            }

            #endregion savePegawaiFormPensiun
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "dataproduk" => $disableProduk,
                "as" => 'ridwan',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "dataproduk" => $disableProduk,
                "as" => 'ridwan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function DeleteMappingProdukToRuangan (Request $request) {
        $data=$request['data'];
        \Illuminate\Support\Facades\DB::beginTransaction();
        try {

            foreach ($data as $item) {
                $dataOP = MapRuanganToProduk::where('id', $item['id'])
                    ->update(['statusenabled' => false]);
            }

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan";
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'cepot',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRuanganbyIddepartemen($id){
        $data = DB::table('ruangan_m')
            ->select('id','namaruangan')
            ->where('statusenabled',true)
            ->where('objectdepartemenfk','=',$id)
            ->get();

        return $this->respond($data);

    }

    public function getListProdukMap(Request $request,$limit=null){
        //get request
        $filter = $request->all();

        //get data
        $data = \DB::table('produk_m as p')
            ->select('p.id','p.kdproduk','p.kdbarcode','p.deskripsiproduk','p.namaproduk','dj.detailjenisproduk','dp.namadepartemen','p.statusenabled')
            ->leftJoin('rm_sediaan_m as rm','rm.id','=','p.objectsediaanfk')
            ->leftJoin('merkproduk_m as mp','mp.id','=','objectmerkprodukfk')
            ->leftJoin('rekanan_m as rk','rk.id','=','p.objectrekananfk')
            ->leftJoin('golongandarah_m as gd','gd.id','=','p.golongandarahfk')
            ->leftJoin('status_barang_m as sb','sb.id','=','p.objectstatusbarangfk')
            ->leftJoin('rhesus_m as rh','rh.id','=','p.rhesusfk')
            ->leftJoin('rm_generik_m as rg','rg.id','=','p.objectgenerikfk')
            ->leftJoin('rm_detail_obat_m as rd','rd.id','=','p.objectdetailobatfk')
            ->leftJoin('bahansample_m as bs','bs.id','=','p.bahansamplefk')
            ->leftJoin('chartofaccount_m as ch','ch.id','=','p.objectaccountfk')
            ->leftJoin('bahanproduk_m as bh','bh.id','=','p.objectbahanprodukfk')
            ->leftJoin('bentukproduk_m as bp','bp.id','=','p.objectbentukprodukfk')
            ->leftJoin('departemen_m as dp','dp.id','=','p.objectdepartemenfk')
            ->leftJoin('detailgolonganproduk_m as dg','dg.id','=','p.objectdetailgolonganprodukfk')
            ->leftJoin('detailjenisproduk_m as dj','dj.id','=','p.objectdetailjenisprodukfk')
            ->where('p.statusenabled',true);


        if(isset($filter['kdProduk']) && !empty($filter['kdProduk'])){
            $data = $data->where('p.id','=',$filter['kdProduk']);
        }elseif (isset($filter['kdInternal']) && !empty($filter['kdInternal'])) {
            $data = $data->where('p.kdproduk','=',$filter['kdInternal']);
        }elseif (isset($filter['kdBarcode']) && !empty($filter['kdBarcode'])) {
            $data = $data->where('p.kdbarcode','=',$filter['kdBarcode']);
        }elseif (isset($filter['kdBmn']) && !empty($filter['kdBmn'])) {
            $data = $data->where('p.kodebmn','=',$filter['kdBmn']);
        }elseif (isset($filter['nmProduk']) && !empty($filter['nmProduk'])) {
            $data = $data->where('p.namaproduk','ilike','%'.$filter['nmProduk'].'%');
        }
        if(isset($filter['dpt']) && !empty($filter['dpt'])) {
            $data = $data->where('p.objectdepartemenfk','=',$filter['dpt']);
        }
        if (isset($filter['stts']) && !empty($filter['stts'])) {
            $data = $data->where('p.statusenabled','=',$filter['stts']);
        }

        $data = $data->orderBy('p.namaproduk');
        $data = $data->take(500);
        if($limit !== null){
            $data = $data->limit($limit)->get();
        }else{
            $data = $data->get();
        }
        return $this->respond($data);
    }

    public function getkelompokproduk(Request $request){
        $id = $request['idKlmpokProduk'];
        $data = \DB::table('kelompokproduk_m')
            ->select('id','kelompokproduk')
            ->where('statusenabled',true);
        if (isset($request['idKlmpokProduk']) && $request['idKlmpokProduk'] != "" && $request['idKlmpokProduk'] != "undefined") {
            $data = $data->where('id','=',$request['idKlmpokProduk']);
        }
        $data = $data->get();
        return $this->respond($data);
    }

    public function addProdukToRuangan(Request $request){
        $is_search=$request['is_search'];
        $data = $request['data'];
        $id = $this->getMapRuanganToProdId();
        $cData = count($data);
        DB::beginTransaction();
        try{
            for ($i=0; $i < $cData; $i++) {

                if ($is_search == 0 || empty($is_search)) { // is_serach is false

                    $filterD = DB::table('mapruangantoproduk_m')
                        ->select('objectprodukfk as idproduk','objectruanganfk as idruangan')
                        ->where('objectruanganfk','=',(int)$data[$i]['idruangan'])
                        ->get();
                }

                $filter[] = DB::table('mapruangantoproduk_m')
                    ->select(DB::raw('count(*) as jml, id'))
                    ->where([
                        ['objectprodukfk','=',(int)$data[$i]['idproduk']],
                        ['objectruanganfk','=',(int)$data[$i]['idruangan']]
                    ])
                    ->groupBy('id')
                    ->get();

                //remove null array vlaue
                $newfilter = array_filter($filter);

                if ($is_search == 0 || empty($is_search)) { // is_serach is false

                    if(!empty($data) && !empty($filterD)){
                        //convert obj to array
                        $newfilterD = json_decode(json_encode($filterD), true);

                        // Compare all values by a json_encode
                        $diff = array_diff(array_map('json_encode', $newfilterD), array_map('json_encode', $data));

                        // Json decode the result
                        $rowDataforDelete = array_map('json_decode', $diff);

                        //reset index of array
                        $rowDataforDelete_ = array_values($rowDataforDelete);
                    }
                }

                if($filter[$i] == null){ //if not exist on table

                    $id = $id+$i;

                    $rowDataforInsert[] = array(
                        "id" => (int)$id,
                        "kdprofile" => intval(''),
                        "statusenabled" => (bool)"t",
                        "kodeexternal" => 2017,//$data[$i]['kodeexternal'],
                        "namaexternal" => "tes",
                        "norec" => substr(Uuid::generate(), 0, 32),
                        "reportdisplay" => "tes",
                        "objectprodukfk" => (int)$data[$i]['idproduk'],
                        "objectruanganfk" => (int)$data[$i]['idruangan'],
                        "status" => ""

                    );
                }elseif ($newfilter[$i][0]->jml == 1) { //if exist on table
//                    return 'a';

                    $rowDataforUpdate[] = array(
                        "id" => (int)$newfilter[$i][0]->id,
                        "statusenabled" => (bool)"t",
                        "kodeexternal" =>2017,// $data[$i]['kodeexternal'],
                        "namaexternal" => "tes update",
                        "reportdisplay" => "tes update",
                        "objectprodukfk" => (int)$data[$i]['idproduk'],
                        "objectruanganfk" => (int)$data[$i]['idruangan'],
                        "status" => ""
                    );
                }

            }

            if ($is_search == 0 || empty($is_search)) {// is_serach is false

                if (!empty($rowDataforDelete_)) {
                    for ($i=0; $i < count($rowDataforDelete_); $i++) {

                        //rename property name
                        $rowDataforDelete_[$i]->objectprodukfk = $rowDataforDelete_[$i]->idproduk;
                        unset($rowDataforDelete_[$i]->idproduk);

                        $rowDataforDelete_[$i]->objectruanganfk = $rowDataforDelete_[$i]->idruangan;
                        unset($rowDataforDelete_[$i]->idruangan);

                        //convert obj to array
                        $rowDataforDeleted_ = json_encode($rowDataforDelete_);
                        $data = json_decode($rowDataforDeleted_,true);


                        // $is_delete[] = DB::table('mapruangantoproduk_m')
                        //     ->where([
                        //         ['objectprodukfk','=',(int)$data[$i]['objectprodukfk']],
                        //         ['objectruanganfk','=',(int)$data[$i]['objectruanganfk']]
                        //     ])
                        //     ->delete();
                    }
                }
            }


            if(!empty($rowDataforInsert)){
                //insert all data in array
                $is_saved = DB::table('mapruangantoproduk_m')
                    ->insert($rowDataforInsert);

            }

            if (!empty($rowDataforUpdate)) {

                for ($i=0; $i < count($rowDataforUpdate); $i++) {
                    $is_update = DB::table('mapruangantoproduk_m')
                        ->where('id',$rowDataforUpdate[$i]['id']);

                    unset($rowDataforUpdate[$i]['id']); //remove id, for not update id

                    $is_update  = $is_update->update($rowDataforUpdate[$i]);
                }

            }

//
//            if(isset($is_saved) || isset($is_update) || isset($is_delete)){
//                $message = "SUKSES";
//            }else{
//                $message = "GAGAL";
//            }
//
//            $result = array(
//                "data" => array(
//                    "message" => array(
//                        "label-success" => $message
//                    )
//                )
//            );
//
//            return $this->respond($result);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal Berhasil";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                "data" => $rowDataforUpdate,
                "as" => 'epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "data" => $rowDataforUpdate,
                "as" => 'epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveBed(Request $request)
    {

        $input = $request->all();
        $transStatus = true;
        $transMsg = null;
        DB::beginTransaction();
        if (isset($request['idtempattidur']) && $request['idtempattidur'] != "" && $request['idtempattidur'] != "undefined") {
            $TT = TempatTidur::where('id', $input['idtempattidur'])->first();
        } else {
            $idTT = TempatTidur::max('id');
            $idTT = $idTT + 1;
            $TT = new TempatTidur();
            $TT->norec = $TT->generateNewId();
            $TT->id = $idTT;
            $TT->objectstatusbedfktriger = 5;
            $TT->namaexternal = $input['namakamar'];
            $TT->kodeexternal = $input['namakamar'];
            $TT->statusenabled = true;
        }
        $TT->objectkamarfk = $input['idkamar'];
        $TT->objectstatusbedfk = $input['idstatusbed'];
        $TT->nomorbed = $input['nomorbed'];
        $TT->reportdisplay = $input['namabed'];
        try {
            $TT->save();
        } catch (\Exception $e) {
            $transStatus = false;
            $transMsg = "Update Tempat Tidur Gagal";
            //break;
        }
        $kosong = 0;
        $isi = 0;
        $TTqtyStatus = $TT = TempatTidur::where('objectkamarfk', $input['idkamar'])->get();
        foreach ($TTqtyStatus as $item) {
            if ($item->objectstatusbedfk == 1) {
                $isi = $isi + 1;
            }
            if ($item->objectstatusbedfk == 2) {
                $kosong = $kosong + 1;
            }
        }

        $KMR = Kamar::where('id', $input['idkamar'])->first();
        // $KMR->objectruanganfk = $input['idruangan'];
        $KMR->jumlakamarisi = $isi;
        $KMR->jumlakamarkosong = $kosong;
        try {
            $KMR->save();
        } catch (\Exception $e) {
            $transStatus = false;
            $transMsg = "Update Kamar Gagal";
            //break;
        }

        if ($transStatus) {
            $this->setStatusCode(201);
            $transMsg = "Transaksi Berhasil";
            //DB::rollBack();
            DB::commit();
        } else {
            $this->setStatusCode(400);
            DB::rollBack();
        }
        return $this->respond([], $transMsg);
    }
    public function getDaftarJenisDiet(Request $request) {
        $data = \DB::table('jenisdiet_m as jd')
            ->leftjoin ('kelompokproduk_m as kp','kp.id','=','jd.objectkelompokprodukfk')
            ->select('jd.*','kp.kelompokproduk')
            ->where('jd.statusenabled', true);

        if(isset($request['id']) && $request['id']!="" && $request['id']!="undefined"){
            $data = $data->where('jd.id','=', $request['id']);
        }
        if(isset($request['kdJenis']) && $request['kdJenis']!="" && $request['kdJenis']!="undefined"){
            $data = $data->where('jd.kdjenisdiet','=', $request['kdJenis']);
        }
        if(isset($request['jenisDiet']) && $request['jenisDiet']!="" && $request['jenisDiet']!="undefined"){
            $data = $data->where('jd.jenisdiet','Iilike', '%'.$request['jenisDiet'].'%');
        }
        if(isset($request['kelompokProdukId']) && $request['kelompokProdukId']!="" && $request['kelompokProdukId']!="undefined"){
            $data = $data->where('jd.objectkelompokprodukfk','=', $request['kelompokProdukId']);
        }
        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    public function saveJenisDiet(Request $request) {
        DB::beginTransaction();
        try{
            $idJenis = JenisDiet::max('id');
            $idJenis= $idJenis +1;
            if ($request['id'] == "") {

                $JD = new JenisDiet();
                $JD->norec = $JD->generateNewId();
                $JD->id = $idJenis;
                $JD->kdprofile = 0;
                $JD->statusenabled = true;
            }else{
                $JD = JenisDiet::where('id',$request['id'])->first();

            }
            $JD->kodeexternal = $idJenis;
            $JD->namaexternal = $request['jenisdiet'];
            $JD->reportdisplay = $request['jenisdiet'];
            $JD->jenisdiet = $request['jenisdiet'];
            $JD->qjenisdiet = $idJenis;
            $JD->keterangan = $request['keterangan'];
            $JD->kdjenisdiet =  $request['kdjenisdiet'];
            $JD->objectkelompokprodukfk = $request['objectkelompokprodukfk'];
            $JD->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Jenis Diet";
            DB::commit();
            $result = array(
                "status" => 201,
                "jenisdiet" => $JD,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteJenisDiet(Request $request) {
        DB::beginTransaction();
        try{
            $JD = JenisDiet::where('id',$request['id'])
                ->update([
                    'statusenabled' => false
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "jenisdiet" => $JD,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarJenisWaktu(Request $request) {
        $data = \DB::table('jeniswaktu_m as jw')
            ->leftjoin ('kelompokproduk_m as kp','kp.id','=','jw.objectkelompokprodukfk')
            ->leftjoin ('departemen_m as dp','dp.id','=','jw.objectdepartemenfk')
            ->select('jw.*','kp.kelompokproduk','dp.namadepartemen')
            ->where('jw.statusenabled', true);

        if(isset($request['id']) && $request['id']!="" && $request['id']!="undefined"){
            $data = $data->where('jw.id','=', $request['id']);
        }
        if(isset($request['kdJenis']) && $request['kdJenis']!="" && $request['kdJenis']!="undefined"){
            $data = $data->where('jw.kdjenisdiet','=', $request['kdJenis']);
        }
        if(isset($request['jenisWaktu']) && $request['jenisWaktu']!="" && $request['jenisWaktu']!="undefined"){
            $data = $data->where('jw.jeniswaktu','Iilike', '%'.$request['jenisWaktu'].'%');
        }
        if(isset($request['kelompokProdukId']) && $request['kelompokProdukId']!="" && $request['kelompokProdukId']!="undefined"){
            $data = $data->where('jw.objectkelompokprodukfk','=', $request['kelompokProdukId']);
        }
        if(isset($request['departemenId']) && $request['departemenId']!="" && $request['departemenId']!="undefined"){
            $data = $data->where('jw.objectdepartemenfk','=', $request['departemenId']);
        }
        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    public function saveJenisWaktu(Request $request) {
        DB::beginTransaction();
        try{
            $idJenis = JenisWaktu::max('id');
            $idJenis= $idJenis +1;
            if ($request['id'] == "") {
                $JD = new JenisWaktu();
                $JD->norec = $JD->generateNewId();
                $JD->id = $idJenis;
                $JD->kdprofile = 0;
                $JD->statusenabled = true;
            }else{
                $JD = JenisWaktu::where('id',$request['id'])->first();

            }
            $JD->kodeexternal = $idJenis;
            $JD->namaexternal = $request['jeniswaktu'];
            $JD->reportdisplay = $request['jeniswaktu'];
            $JD->jeniswaktu = $request['jeniswaktu'];
            $JD->jamakhir = $request['jamakhir'];
            $JD->jamawal = $request['jamawal'];
            $JD->kdjeniswaktu =  $request['kdjeniswaktu'];
            $JD->objectkelompokprodukfk = $request['objectkelompokprodukfk'];
            $JD->objectdepartemenfk = $request['objectdepartemenfk'];
//            $JD->nourut = $request['objectkelompokprodukfk'];
            $JD->qjeniswaktu =$idJenis;
            $JD->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Jenis Waktu";
            DB::commit();
            $result = array(
                "status" => 201,
                "jenisdiet" => $JD,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteJenisWaktu(Request $request) {
        DB::beginTransaction();
        try{
            $JD = JenisWaktu::where('id',$request['id'])
                ->update([
                    'statusenabled' => false
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "jenisdiet" => $JD,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDepartemen(Request $request){
        $id = $request['idDep'];
        $data = \DB::table('departemen_m')
            ->select('id','namadepartemen')
            ->where('statusenabled',true);
        if (isset($request['idDep']) && $request['idDep'] != "" && $request['idDep'] != "undefined") {
            $data = $data->where('id','=',$request['idDep']);
        }
        $data = $data->get();
        return $this->respond($data);
    }
    public function getKategoryDiet(Request $request) {
        $data = \DB::table('kategorydiet_m as kd')
            ->leftjoin ('kelompokproduk_m as kp','kp.id','=','kd.objectkelompokprodukfk')
            ->select('kd.*','kp.kelompokproduk')
            ->where('kd.statusenabled', true);

        if(isset($request['id']) && $request['id']!="" && $request['id']!="undefined"){
            $data = $data->where('kd.id','=', $request['id']);
        }
        if(isset($request['kdKat']) && $request['kdKat']!="" && $request['kdKat']!="undefined"){
            $data = $data->where('kd.kdkategorydiet','=', $request['kdKat']);
        }
        // if(isset($request['namaexternal']) && $request['namaexternal']!="" && $request['namaexternal']!="undefined"){
        //     $data = $data->where('kd.namaexternal','=', $request['namaexternal']);
        // }
        if(isset($request['kategoryDiet']) && $request['kategoryDiet']!="" && $request['kategoryDiet']!="undefined"){
            $data = $data->where('kd.kategorydiet','Iilike', '%'.$request['kategoryDiet'].'%');
        }
        if(isset($request['kelompokProdukId']) && $request['kelompokProdukId']!="" && $request['kelompokProdukId']!="undefined"){
            $data = $data->where('jw.objectkelompokprodukfk','=', $request['kelompokProdukId']);
        }

        $data = $data->get();
        $result = array(
            'data'=> $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    public function saveKategoryDiet(Request $request) {
        DB::beginTransaction();
        try{
            $idJenis = KategoryDiet::max('id');
            $idJenis= $idJenis +1;
            if ($request['id'] == "") {
                $JD = new KategoryDiet();
                $JD->norec = $JD->generateNewId();
                $JD->id = $idJenis;
                $JD->kdprofile = 0;
                $JD->statusenabled = true;
            }else{
                $JD = KategoryDiet::where('id',$request['id'])->first();

            }
            $JD->kodeexternal = $idJenis;
            $JD->namaexternal = $request['namaexternal'];
            $JD->reportdisplay = $request['kategorydiet'];
            $JD->kategorydiet = $request['kategorydiet'];
            $JD->kdkategorydiet =$JD->kodeexternal;
            $JD->objectkelompokprodukfk = $request['objectkelompokprodukfk'];
            $JD->qkategorydiet =$JD->kodeexternal;
            $JD->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Kategory Diet";
            DB::commit();
            $result = array(
                "status" => 201,
                "jenisdiet" => $JD,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteKategoryDiet(Request $request) {
        DB::beginTransaction();
        try{
            $JD = KategoryDiet::where('id',$request['id'])
                ->update([
                    'statusenabled' => false
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "jenisdiet" => $JD,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboSiklus(Request $request)
    {

        $dataJenisDiet = \DB::table('jenisdiet_m as jd')
            ->select('jd.id', 'jd.jenisdiet')
            ->where('jd.statusenabled', true)
            ->get();

        $dataJenisWaktu = \DB::table('jeniswaktu_m as jw')
            ->select('jw.id', 'jw.jeniswaktu')
            ->where('jw.statusenabled', true)
            ->get();

        $dataKategoryDiet = \DB::table('kategorydiet_m as kd')
            ->select('kd.id', 'kd.kategorydiet')
            ->where('kd.statusenabled', true)
            ->get();
        $bentuk = \DB::table('bentukproduk_m as kd')
            ->select('kd.id', 'kd.namabentukproduk')
            ->where('kd.statusenabled', true)
            ->get();

        $dataKelas = \DB::table('kelas_m as kls')
            ->select('kls.id','kls.namakelas')
            ->where('kls.statusenabled',true)
            ->get();
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->JOIN('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
//            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.statusenabled',true)
            ->where('djp.objectjenisprodukfk',44)
            ->where('kp.id',(int)$this->settingDataFixed('kdKelasNonKelasRegistrasi'))
            ->groupBy('pr.id','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

     $dataProdukMenu = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->JOIN('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
//            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.statusenabled',true)
            ->whereIn('pr.objectdetailjenisprodukfk',[127,128])
            ->groupBy('pr.id','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();
        $result = array(
            'jenisdiet' => $dataJenisDiet,
            'jeniswaktu' => $dataJenisWaktu,
            'kategorydiet' => $dataKategoryDiet,
            'bentukproduk' => $bentuk,
            'kelas' => $dataKelas,
            'produk' => $dataProduk,
            'produkmenu' => $dataProdukMenu,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function getMappingMenu(Request $request)
    {
        // return($request['menu']);
        // die;
        $menu = $request['menu'];
        $data = DB::select(DB::raw("select  id, satatusenabled, kodeexternal, namaexternal, produkdetailfk, produkheadfk, menu, bahan, berat, satuankecil from V_GetMappingMenu where menu ilike '%$menu%';                    "));
        $results=[];
        if (count($data) > 0) {
            foreach ($data as $item) {
                $results[] = array(
                    'id' => $item->id,
                    'Menu' => $item->menu,
                    'Bahan' => $item->bahan,
                    'berat' => (float)$item->berat,
                    'Satuan' => $item->satuankecil,
                    'produkdetailfk' => $item->produkdetailfk,
                    'produkheadfk' => $item->produkheadfk,
                    // menu, bahan
                );
            }
        }
       
        $result = array(
            'data' => $results,
            'message' => '@Noname',
        );
        return $this->respond($result);
    }
    public function getbahan(Request $request)
    {
        $menu = $request['idprodukfk'];
        $data = DB::select(DB::raw("select  id, satatusenabled, kodeexternal, namaexternal, produkdetailfk, produkheadfk, menu, bahan, berat from V_GetMappingMenu where produkheadfk = '$menu';                    "));
        $results = [];
        if (count($data) > 0) {
            foreach ($data as $item) {
                $results[] = array(
                    'id' => $item->id,
                    'Menu' => $item->menu,
                    'Bahan' => $item->bahan,
                    'produkdetailfk' => $item->produkdetailfk,
                    'produkheadfk' => $item->produkheadfk,
                    'berat' => $item->berat,
                    // menu, bahan
                );
            }
        }

        $result = array(
            'data' => $results,
            'message' => '@Noname',
        );
        return $this->respond($result);
    }
    public function getmenugizi(Request $request)
    {
        // return($request['menu']);
        // die;
        $menu = $request['menu'];
        $data = DB::select(DB::raw(" select distinct idproduk,menu from V_GetMappingMenu where menu ilike '%$menu%';                    "));
        // $results = [];
        // if (count($data) > 0) {
        //     foreach ($data as $item) {
        //         $results[] = array(
        //             'idproduk' => $item->idproduk,
        //             'Menu' => $item->menu,
        //             // 'Bahan' => $item->bahan,
        //             // 'produkdetailfk' => $item->produkdetailfk,
        //             // 'produkheadfk' => $item->produkheadfk,
        //             // menu, bahan
        //         );
        //     }
        // }

        return $this->respond($data);
        // $result = array(
        //     'data' => $data,
        //     'message' => '@Noname',
        // );
        // return $this->respond($result);
    }
    public function getDaftarSiklusGizi (Request $request){
        $siklusKe = $request['siklusKe'];
        $kelasId = $request['kelasId'];
        $jenisDietId = $request['jenisDietId'];
        $kategoryDietId = $request['kategoryDiet'];
        $jenisWaktuId = $request['jenisWaktuId'];
        $namaProduk = $request['namaProduk'];
        $row = $request['jmlRow'];
        $arrJenisWaktu = explode(',',$jenisWaktuId);

//        return $this->respond($arrJenisWaktu);
        $data = DB::table('siklusgizi_m as sm')
            ->join ('produk_m as prd','prd.id','=','sm.objectprodukfk')
            ->join ('jeniswaktu_m as jw','jw.id','=','sm.objectjeniswaktufk')
            ->join ('jenisdiet_m as jd','jd.id','=','sm.objectjenisdietfk')
            ->join ('kelas_m as kls','kls.id','=','sm.objectkelasfk')
            ->join ('kategorydiet_m as kd','kd.id','=','sm.objectkategoryprodukfk')
            ->leftjoin ('bentukproduk_m as bp','bp.id','=','sm.objectbentukprodukfk')
            ->select('sm.id','prd.id as objectprodukfk', 'prd.namaproduk',
                'sm.sikluske','sm.objectjeniswaktufk','jw.jeniswaktu','sm.objectjenisdietfk','jd.jenisdiet' ,
                'sm.objectkelasfk','kls.namakelas','kd.kategorydiet','bp.namabentukproduk')
            ->where('sm.statusenabled',true);

        if(isset($siklusKe) && $siklusKe!=''){
            $data = $data->where('sm.sikluske',$siklusKe);
        }
        if(isset($kelasId) && $kelasId!=''){
            $data = $data->where('kls.id',$kelasId);
        }
        if(isset($jenisDietId) && $jenisDietId!=''){
            $data = $data->where('jd.id',$jenisDietId);
        }
        if(isset($kategoryDietId) && $kategoryDietId!=''){
            $data = $data->where('kd.id',$kategoryDietId);
        }
//        if(isset($jenisWaktuId) && $jenisWaktuId!=''){
//            $data = $data->where('jw.id',$jenisWaktuId);
//        }
        if(isset($jenisWaktuId) && $jenisWaktuId!=''){
            $data = $data->whereIn('jw.id',$arrJenisWaktu);
        }
        if(isset($namaProduk) && $namaProduk!=''){
            $data = $data->where('prd.namaproduk','ilike','%'.$namaProduk.'%');
        }

        if(isset($row) && $row !=''){
            $data = $data->limit($row);
        }
        $data = $data->get();
        $result = array(
            'data'=>$data
        );
        return $this->respond($result);
    }
    public function saveSiklusGizi(Request $request) {
        DB::beginTransaction();
        try{
            foreach ( $request['details'] as $item){
                $kode[] = (double) $item['produkfk'];
                $kelasfk[] = (double) $item['kelasfk'];
            }

            $hapus = SiklusGizi::where('statusenabled',true)
                ->where('sikluske',$request['sikluske'])
                ->where('objectjenisdietfk',$request['objectjenisdietfk'])
                ->whereIn('objectkelasfk',$kelasfk)
                ->where('objectjeniswaktufk',$request['objectjeniswaktufk'])
                ->whereIn('objectprodukfk',$kode)
                ->where('objectkategoryprodukfk',$request['objectkategoryprodukfk'])
                ->where('objectbentukprodukfk',$request['objectbentukprodukfk'])
                ->delete();

            foreach ($request['details'] as $item ){
                $SG = new SiklusGizi();
                $SG->id =  SiklusGizi::max('id')+1;
                $SG->kdprofile = 11;
                $SG->statusenabled = true;
                $SG->kodeexternal = 'GIZI';
                $SG->norec =  $SG->generateNewId();
                $SG->sikluske = $request['sikluske'];
                $SG->objectjeniswaktufk = $request['objectjeniswaktufk'];
                $SG->objectjenisdietfk =  $request['objectjenisdietfk'];
                $SG->objectkelasfk =$item['kelasfk'];
                $SG->objectprodukfk =  $item['produkfk'];
                $SG->objectbentukprodukfk = $request['objectbentukprodukfk'];
                $SG->objectkategoryprodukfk = $request['objectkategoryprodukfk'];
//                $SG->namaexternal =  $item[''];
//                $SG->reportdisplay =  $item[''];
                $SG->save();
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
                "siklus" => $SG,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function deleteSiklusGizi(Request $request) {
        DB::beginTransaction();
        try{
            $hapus = SiklusGizi::where('id',$request['id'])
                ->update(
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
                "status" => 201,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getMapRuanganToProdId(){
        $maxId = DB::table('mapruangantoproduk_m')->find(DB::table('mapruangantoproduk_m')->max('id'));

        $nextId = $maxId->id+1;

        return $nextId;
    }
    public function saveharganettoprodukbykelasM_D(Request $request)
    {
        $idIdAn = 0;
        $idIdAnD = 0;
        $input=$request->all();
        //return $this->respond(array($input['head']['idHead']));
        $transStatus = true;
        $transMsg =null;
        DB::beginTransaction();

        if ($input['jenis'] == 'simpan'){
            try {
            $h1 = 0;
            $h2 = 0;
            $h3 = 0;
            $h4 = 0;
            if ($input['head']['id_hn_m']=='') {
                $newId = HargaNettoProdukByKelas1::max('id');
                $newId = $newId + 1;

                $HHHH = new HargaNettoProdukByKelas1();
                $HHHH->id = $newId;
                $idIdAn=$newId;
            }else{
                $HHHH =  HargaNettoProdukByKelas1::where('id',$input['head']['id_hn_m'])->first();
                $del = HargaNettoProdukByKelasD::where('objectprodukfk',$input['head']['objectprodukfk'])
                    ->where('objectjenistariffk',$input['head']['objectjenistariffk'])
                    ->where('objectasalprodukfk',$input['head']['objectasalprodukfk'])
                    ->where('objectkelasfk',$input['head']['objectkelasfk'])
                    ->where('objectjenispelayananfk',$input['head']['objectjenispelayananfk'])
                    ->delete();

            }
            $HHHH->hargadiscount = (float)$input['head']['hargadiscount'];;
            $HHHH->harganetto1 = (float)$input['head']['harganetto1'];
            $HHHH->harganetto2 = (float)$input['head']['harganetto2'];
            $HHHH->hargasatuan = (float)$input['head']['hargasatuan'];
            $HHHH->objectprodukfk = $input['head']['objectprodukfk'];
            $HHHH->objectjenistariffk = $input['head']['objectjenistariffk'];
            $HHHH->objectasalprodukfk = $input['head']['objectasalprodukfk'];
            $HHHH->objectkelasfk = $input['head']['objectkelasfk'];
            $HHHH->objectmatauangfk = $input['head']['objectmatauangfk'];
            $HHHH->persendiscount = (float)$input['head']['persendiscount'];
            $HHHH->factorrate = (float)$input['head']['factorrate'];
            $HHHH->qtycurrentstok = (float)$input['head']['qtycurrentstok'];
            if(isset($input['head']['tglberlakuakhir']) && $input['head']['tglberlakuakhir']!="" && $input['head']['tglberlakuakhir']!="undefined"){
                $HHHH->tglberlakuakhir = $input['head']['tglberlakuakhir'];
            }
            if(isset($input['head']['tglberlakuawal']) && $input['head']['tglberlakuawal']!="" && $input['head']['tglberlakuawal']!="undefined"){
                $HHHH->tglberlakuawal = $input['head']['tglberlakuawal'];
            }
            if(isset($input['head']['tglkadaluarsalast']) && $input['head']['tglkadaluarsalast']!="" && $input['head']['tglkadaluarsalast']!="undefined"){
                $HHHH->tglkadaluarsalast = $input['head']['tglkadaluarsalast'];
            }
            $HHHH->reportdisplay = $input['head']['reportdisplay'];
//                if($input['head']['kodeexternal']== ''){
//                  $input['head']['kodeexternal'] =2017;
//                }
            $HHHH->kdprofile =12;
            $HHHH->kodeexternal = date('Y');
            $HHHH->namaexternal = $input['head']['namaexternal'];
            $HHHH->statusenabled = true;
            $HHHH->suratkeputusanfk = $input['head']['suratkeputusanfk'];;
            $HHHH->objectjenispelayananfk = $input['head']['objectjenispelayananfk'];
//            try {
                $HHHH->save();
//            } catch (\Exception $e) {
//                $transStatus = false;
//                $transMsg = "Simpan New HargaNettoProdukByKelas Gagal";
//            }

            $r_Detail =$input['detail'];
            foreach ($r_Detail as $r_Detail)
            {

//                if ($r_Detail['id_hn_d']=='' || $r_Detail['id_hn_d']=='undefined') {
                $newIdD = HargaNettoProdukByKelasD::max('id');
                $newIdD = $newIdD + 1;

                $DDDD = new HargaNettoProdukByKelasD();
                $DDDD->id = $newIdD;
                $idIdAnD=$newIdD;
//
//                }else{
//                    $DDDD =  HargaNettoProdukByKelasD::where('id',$r_Detail['id_hn_d'])->first();
//
//                }
                $DDDD->factorrate = (float)$input['head']['factorrate'];
                $DDDD->objectkomponenhargafk = $r_Detail['objectkomponenhargafk'];
                $DDDD->hargadiscount = (float)$r_Detail['hargadiscount'];;
                $DDDD->harganetto1 = (float)$r_Detail['hargasatuan'];
                $DDDD->harganetto2 = (float)$r_Detail['hargasatuan'];
                $DDDD->hargasatuan = (float)$r_Detail['hargasatuan'];
                $DDDD->objectprodukfk = $input['head']['objectprodukfk'];
                $DDDD->objectjenistariffk = $input['head']['objectjenistariffk'];
                $DDDD->objectasalprodukfk = $input['head']['objectasalprodukfk'];
                $DDDD->objectkelasfk = $input['head']['objectkelasfk'];
                $DDDD->objectmatauangfk = $input['head']['objectmatauangfk'];
                $DDDD->persendiscount = (float)$r_Detail['persendiscount'];

                $DDDD->qtycurrentstok = (float)$input['head']['qtycurrentstok'];
                if(isset($input['head']['tglberlakuakhir']) && $input['head']['tglberlakuakhir']!="" && $input['head']['tglberlakuakhir']!="undefined"){
                    $DDDD->tglberlakuakhir = $input['head']['tglberlakuakhir'];
                }
                if(isset($input['head']['tglberlakuawal']) && $input['head']['tglberlakuawal']!="" && $input['head']['tglberlakuawal']!="undefined"){
                    $DDDD->tglberlakuawal = $input['head']['tglberlakuawal'];
                }
                if(isset($input['head']['tglkadaluarsalast']) && $input['head']['tglkadaluarsalast']!="" && $input['head']['tglkadaluarsalast']!="undefined"){
                    $DDDD->tglkadaluarsalast = $input['head']['tglkadaluarsalast'];
                }
                $DDDD->reportdisplay = $input['head']['reportdisplay'];
                $DDDD->kodeexternal = $input['head']['kodeexternal'];
                $DDDD->namaexternal = $input['head']['namaexternal'];
                $DDDD->statusenabled = true;
                $DDDD->objectjenispelayananfk = $input['head']['objectjenispelayananfk'];
//                try {
                    $DDDD->save();
//                } catch (\Exception $e) {
//                    $transStatus = false;
//                    $transMsg = "Simpan New HargaNettoProdukByKelas_D Gagal";
//                }
             }
                $transStatus = true;
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        //end simpan head

        if($transStatus){
            $this->setStatusCode(201);
            $transMsg = "Simpan Harga Netto Produk Berhasil";
            //DB::rollBack();
            DB::commit();
        }else{
            $this->setStatusCode(400);
            $transMsg = "Simpan New HargaNettoProdukByKelas Gagal";
            DB::rollBack();
        }
        return $this->respond(['id_harganettobykelas_m'=>$idIdAn], $transMsg);
    }

    public function getCekHargaProduk(Request $request){
        //get request

        //get data
        $data = DB::select(DB::raw(
            "SELECT 
                    COUNT(*) AS cekHarga
                    FROM stokprodukdetail_t AS spd
                    WHERE spd.objectprodukfk=".$request['idProduk'].";"
                ));

        $result = array(
            'data' => $data,
            'as' => 'dy@epic'
        );
        return $this->respond($result);
    }

    public function saveHargaProduk(Request $request){
        DB::beginTransaction();
        $data = $request->all();

        try {
            if ($data['id'] == null || $data['id'] == ''){
                $newId = Produk::max('id');
                $newId = $newId + 1;
                $prod = new Produk();
                $prod->id = $newId;
                $prod->kdprofile = 0;
            }else{
                $prod =  Produk::where('id',$data['id'])->first();
            }
            $prod->statusenabled =  $data['statusenabled'];
            $prod->kodeexternal = $data['kodeexternal'];
            $prod->namaexternal = $data['namaexternal'];
            $prod->norec = $prod->generateNewId();
            $prod->reportdisplay = $data['reportdisplay'];
            $prod->objectaccountfk = $data['objectaccountfk'];
            $prod->objectbahanprodukfk = $data['objectbahanprodukfk'];
            $prod->objectbentukprodukfk = $data['objectbentukprodukfk'];
            $prod->objectdepartemenfk = $data['objectdepartemenfk'];
            $prod->objectdetailgolonganprodukfk = $data['objectdetailgolonganprodukfk'];
            $prod->objectdetailjenisprodukfk = $data['objectdetailjenisprodukfk'];
            $prod->objectfungsiprodukfk = $data['objectfungsiprodukfk'];
            $prod->objectgprodukfk = $data['objectgprodukfk'];
            $prod->objectgolonganprodukfk = $data['objectgolonganprodukfk'];
            $prod->objectjenisperiksafk = $data['objectjenisperiksafk'];
            $prod->objectkategoryprodukfk = $data['objectkategoryprodukfk'];
            $prod->objectlevelprodukfk = $data['objectlevelprodukfk'];
            $prod->objectprodusenprodukfk = $data['objectprodusenprodukfk'];
            $prod->objectsatuanbesarfk = $data['objectsatuanbesarfk'];
            $prod->objectsatuankecilfk = $data['objectsatuankecilfk'];
            $prod->objectsatuanstandarfk = $data['objectsatuanstandarfk'];
            $prod->objectstatusprodukfk = $data['objectstatusprodukfk'];
            $prod->objecttypeprodukfk = $data['objecttypeprodukfk'];
            $prod->objectunitlaporanfk = $data['objectunitlaporanfk'];
            $prod->objectwarnaprodukfk = $data['objectwarnaprodukfk'];
            $prod->deskripsiproduk = $data['deskripsiproduk'];
            $prod->kdbarcode = $data['kdbarcode'];
            $prod->kdproduk = $data['kdproduk'];
            $prod->kdproduk_intern = $data['kdproduk_intern'];
            $prod->kekuatan = $data['kekuatan'];
            $prod->namaproduk = $data['namaproduk'];
            $prod->nilainormal = $data['nilainormal'];
            $prod->qproduk = $data['qproduk'];
            $prod->qtyjualterkecil = $data['qtyjualterkecil'];
            $prod->qtylemak = $data['qtylemak'];
            $prod->qtyporsi = $data['qtyporsi'];
            $prod->qtyprotein = $data['qtyprotein'];
            $prod->qtysatukemasan = $data['qtysatukemasan'];
            $prod->qtyterkecil = $data['qtyterkecil'];
            $prod->qtykalori = $data['qtykalori'];
            $prod->qtykarbohidrat = $data['qtykarbohidrat'];
            $prod->kdprodukintern = $data['kdprodukintern'];
            $prod->objectjenisperiksapenunjangfk = $data['objectjenisperiksapenunjangfk'];
            $prod->bahansamplefk = $data['bahansamplefk'];
            $prod->objectdetailobatfk = $data['objectdetailobatfk'];
            $prod->objectgenerikfk = $data['objectgenerikfk'];
            $prod->objectmerkprodukfk = $data['objectmerkprodukfk'];
            $prod->objectrekananfk = $data['objectrekananfk'];
            $prod->objectsediaanfk = $data['objectsediaanfk'];
            $prod->objectstatusbarangfk = $data['objectstatusbarangfk'];
            $prod->golongandarahfk = $data['golongandarahfk'];
            $prod->rhesusfk = $data['rhesusfk'];
            $prod->kodebmn = $data['kodebmn'];
            $prod->spesifikasi = $data['spesifikasi'];
            $prod->tglproduksi = $data['tglproduksi'];
            $prod->status = $data['status'];
            $prod->verifikasianggaran = $data['verifikasianggaran'];
            if (isset($request['isprodukintern'])){
                $prod->isprodukintern = $data['isprodukintern'];
            }
            if (isset($request['isarvdonasi'])){
                $prod->isprodukintern = $data['isarvdonasi'];
            }
            if (isset($request['isnarkotika'])){
                $prod->isprodukintern = $data['isnarkotika'];
            }
            if (isset($request['ispsikotropika'])){
                $prod->isprodukintern = $data['ispsikotropika'];
            }
            if (isset($request['isonkologi'])){
                $prod->isprodukintern = $data['isonkologi'];
            }
            if (isset($request['isoot'])){
                $prod->isprodukintern = $data['isoot'];
            }
            if (isset($request['isprekusor'])){
                $prod->isprodukintern = $data['isprekusor'];
            }
            if (isset($request['isvaksindonasi'])){
                $prod->isprodukintern = $data['isvaksindonasi'];
            }
            if (isset($request['objectjenisgenerikfk'])){
                $prod->isprodukintern = $data['objectjenisgenerikfk'];
            }
            if (isset($request['keterangan'])){
                $prod->isprodukintern = $data['keterangan'];
            }
            if (isset($request['poinmedis'])){
                $prod->isprodukintern = $data['poinmedis'];
            }
            $prod->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $data,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataTempattidur(Request $request)
    {
        $data = DB::table('tempattidur_m as tt')
        ->join('kamar_m as kr', 'kr.id', '=', 'tt.objectkamarfk')
        ->join('ruangan_m as ru', 'ru.id', '=', 'kr.objectruanganfk')
        ->join('kelas_m as km', 'km.id', '=', 'kr.objectkelasfk')
        ->join('statusbed_m as sm', 'sm.id', '=', 'tt.objectstatusbedfk')
        ->select(DB::raw('tt.*,sm.id as idbed,ru.namaruangan,kr.namakamar,km.namakelas,sm.reportdisplay as statusbed'));

        if (isset($request['ruangan']) && $request['ruangan'] != "" && $request['ruangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['ruangan']);
        }
        if (isset($request['kdkelas']) && $request['kdkelas'] != "" && $request['kdkelas'] != "undefined") {
            $data = $data->where('km.id', '=', $request['kdkelas']);
        }
        if (isset($request['kamarId']) && $request['kamarId'] != "" && $request['kamarId'] != "undefined") {
            $data = $data->where('kr.id', '=', $request['kamarId']);
        }
        if (isset($request['namabed']) && $request['namabed'] != "" && $request['namabed'] != "undefined") {
            $data = $data->where('tt.reportdisplay', 'like', $request['namabed']);
        }

        if (isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined") {
            $data = $data->where('tt.statusenabled', $request['status']);
        }


        $data = $data->take(100);
        $data = $data->orderBy('ru.namaruangan');
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'Cepot',
        );

        return $this->respond($result);
    }
    public function deletebed(Request $request)
    {
        DB::beginTransaction();
        try {
            $idMap = $request['id'];
            $status = $request['status'];

            $delete = DB::delete("update tempattidur_m set statusenabled=$status where id='$idMap' ");

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getListProdukMapPenjamin(Request $request, $limit = null)
    {
        //get request
        $filter = $request->all();

        //get data
        $data = \DB::table('produk_m as p')
        ->select('p.id', 'p.kdproduk', 'p.kdbarcode', 'hn.harganetto1', 'p.deskripsiproduk', 'p.namaproduk', 'dj.detailjenisproduk', 'dp.namadepartemen', 'p.statusenabled')
        ->leftJoin('rm_sediaan_m as rm', 'rm.id', '=', 'p.objectsediaanfk')
        ->leftJoin('merkproduk_m as mp', 'mp.id', '=', 'objectmerkprodukfk')
        ->leftJoin('rekanan_m as rk', 'rk.id', '=', 'p.objectrekananfk')
        ->leftJoin('golongandarah_m as gd', 'gd.id', '=', 'p.golongandarahfk')
        ->leftJoin('status_barang_m as sb', 'sb.id', '=', 'p.objectstatusbarangfk')
        ->leftJoin('rhesus_m as rh', 'rh.id', '=', 'p.rhesusfk')
        ->leftJoin('rm_generik_m as rg', 'rg.id', '=', 'p.objectgenerikfk')
        ->leftJoin('rm_detail_obat_m as rd', 'rd.id', '=', 'p.objectdetailobatfk')
        ->leftJoin('bahansample_m as bs', 'bs.id', '=', 'p.bahansamplefk')
        ->leftJoin('chartofaccount_m as ch', 'ch.id', '=', 'p.objectaccountfk')
        ->leftJoin('bahanproduk_m as bh', 'bh.id', '=', 'p.objectbahanprodukfk')
        ->leftJoin('bentukproduk_m as bp', 'bp.id', '=', 'p.objectbentukprodukfk')
        ->leftJoin('departemen_m as dp', 'dp.id', '=', 'p.objectdepartemenfk')
        ->leftJoin('detailgolonganproduk_m as dg', 'dg.id', '=', 'p.objectdetailgolonganprodukfk')
        ->leftJoin('detailjenisproduk_m as dj', 'dj.id', '=', 'p.objectdetailjenisprodukfk')
        ->leftJoin('harganettoprodukbykelas_m as hn', 'hn.objectprodukfk', '=', 'p.id')
        ->where('p.statusenabled', true);


        if (isset($filter['kdProduk']) && !empty($filter['kdProduk'])) {
            $data = $data->where('p.id', '=', $filter['kdProduk']);
        } elseif (isset($filter['kdInternal']) && !empty($filter['kdInternal'])) {
            $data = $data->where('p.kdproduk', '=', $filter['kdInternal']);
        } elseif (isset($filter['kdBarcode']) && !empty($filter['kdBarcode'])) {
            $data = $data->where('p.kdbarcode', '=', $filter['kdBarcode']);
        } elseif (isset($filter['kdBmn']) && !empty($filter['kdBmn'])) {
            $data = $data->where('p.kodebmn', '=', $filter['kdBmn']);
        } elseif (isset($filter['nmProduk']) && !empty($filter['nmProduk'])) {
            $data = $data->where('p.namaproduk', 'ilike', '%' . $filter['nmProduk'] . '%');
        }
        if (isset($filter['dpt']) && !empty($filter['dpt'])) {
            $data = $data->where('p.objectdepartemenfk', '=', $filter['dpt']);
        }
        if (isset($filter['stts']) && !empty($filter['stts'])) {
            $data = $data->where('p.statusenabled', '=', $filter['stts']);
        }
        if (isset($filter['kelas']) && !empty($filter['kelas'])) {
            $data = $data->where('hn.objectkelasfk', '=', $filter['kelas']);
        }


        $data = $data->orderBy('p.namaproduk');
        $data = $data->take(10000);
        if ($limit !== null) {
            $data = $data->limit($limit)->get();
        } else {
            $data = $data->get();
        }
        return $this->respond($data);
    }
    public function getListProdukMapPenjaminisi(Request $request, $limit = null)
    {
        //get request
        $filter = $request->all();

        //get data
        $data = \DB::table('produk_m as p')
        ->select('p.id', 'mps.potongan', 'p.kdproduk', 'p.kdbarcode', 'hn.harganetto1', 'p.deskripsiproduk', 'p.namaproduk', 'dj.detailjenisproduk', 'dp.namadepartemen', 'p.statusenabled')
        ->leftJoin('rm_sediaan_m as rm', 'rm.id', '=', 'p.objectsediaanfk')
        ->leftJoin('merkproduk_m as mp', 'mp.id', '=', 'objectmerkprodukfk')
        ->leftJoin('rekanan_m as rk', 'rk.id', '=', 'p.objectrekananfk')
        ->leftJoin('golongandarah_m as gd', 'gd.id', '=', 'p.golongandarahfk')
        ->leftJoin('status_barang_m as sb', 'sb.id', '=', 'p.objectstatusbarangfk')
        ->leftJoin('rhesus_m as rh', 'rh.id', '=', 'p.rhesusfk')
        ->leftJoin('rm_generik_m as rg', 'rg.id', '=', 'p.objectgenerikfk')
        ->leftJoin('rm_detail_obat_m as rd', 'rd.id', '=', 'p.objectdetailobatfk')
        ->leftJoin('bahansample_m as bs', 'bs.id', '=', 'p.bahansamplefk')
        ->leftJoin('chartofaccount_m as ch', 'ch.id', '=', 'p.objectaccountfk')
        ->leftJoin('bahanproduk_m as bh', 'bh.id', '=', 'p.objectbahanprodukfk')
        ->leftJoin('bentukproduk_m as bp', 'bp.id', '=', 'p.objectbentukprodukfk')
        ->leftJoin('departemen_m as dp', 'dp.id', '=', 'p.objectdepartemenfk')
        ->leftJoin('detailgolonganproduk_m as dg', 'dg.id', '=', 'p.objectdetailgolonganprodukfk')
        ->leftJoin('detailjenisproduk_m as dj', 'dj.id', '=', 'p.objectdetailjenisprodukfk')
        ->leftJoin('harganettoprodukbykelas_m as hn', 'hn.objectprodukfk', '=', 'p.id')
        ->leftJoin('mappenjamintoproduk_s as mps', 'mps.idprodukfk', '=', 'p.id')
        ->where('p.statusenabled', true);


        if (isset($filter['kdProduk']) && !empty($filter['kdProduk'])) {
            $data = $data->where('p.id', '=', $filter['kdProduk']);
        } elseif (isset($filter['kdInternal']) && !empty($filter['kdInternal'])) {
            $data = $data->where('p.kdproduk', '=', $filter['kdInternal']);
        } elseif (isset($filter['kdBarcode']) && !empty($filter['kdBarcode'])) {
            $data = $data->where('p.kdbarcode', '=', $filter['kdBarcode']);
        } elseif (isset($filter['kdBmn']) && !empty($filter['kdBmn'])) {
            $data = $data->where('p.kodebmn', '=', $filter['kdBmn']);
        } elseif (isset($filter['nmProduk']) && !empty($filter['nmProduk'])) {
            $data = $data->where('p.namaproduk', 'ilike', '%' . $filter['nmProduk'] . '%');
        }
        if (isset($filter['dpt']) && !empty($filter['dpt'])) {
            $data = $data->where('p.objectdepartemenfk', '=', $filter['dpt']);
        }
        if (isset($filter['stts']) && !empty($filter['stts'])) {
            $data = $data->where('p.statusenabled', '=', $filter['stts']);
        }
        if (isset($filter['kelas']) && !empty($filter['kelas'])) {
            $data = $data->where('hn.objectkelasfk', '=', $filter['kelas']);
        }
        if (isset($filter['kelas']) && !empty($filter['kelas'])) {
            $data = $data->where('mps.idkelasfk', '=', $filter['kelas']);
        }
        if (isset($filter['kelompokpasien']) && !empty($filter['kelompokpasien'])) {
            $data = $data->where('mps.idkelompokpasienfk', '=', $filter['kelompokpasien']);
        }
        if (isset($filter['rekanan']) && !empty($filter['rekanan'])) {
            $data = $data->where('mps.idrekananfk', '=', $filter['rekanan']);
        }

        $data = $data->orderBy('p.namaproduk');
        $data = $data->take(10000);
        if ($limit !== null) {
            $data = $data->limit($limit)->get();
        } else {
            $data = $data->get();
        }
        return $this->respond($data);
    }
    public function deletemappenjamintoproduk(Request $request)
    {
        DB::beginTransaction();
        try {
            $is_update = DB::table('mappenjamintoproduk_s as mps')
            ->where('mps.idkelasfk', '=', $request['idkelasfk'])
            ->where('mps.idkelompokpasienfk', '=', $request['idkelompokpasienfk'])
            ->where('mps.idrekananfk', '=', $request['idrekananfk'])
            ->where('mps.idprodukfk', '=', $request['idprodukfk'])
            ->delete();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function addProdukToPenjamin(Request $request)
    {
        $is_search = $request['is_search'];
        $data = $request['data'];
        $cData = count($data);
        DB::beginTransaction();
        // try {
        for ($i = 0; $i < $cData; $i++) {



            $filterD = DB::table('mappenjamintoproduk_s')
            // ->select('idprodukfk as idproduk', 'objectruanganfk as idruangan')
            ->where('idkelompokpasienfk', '=', (int)$data[$i]['idkelompokpasienfk'])
            ->where('idrekananfk', '=', (int)$data[$i]['idrekananfk'])
            ->where('idkelasfk', '=', (int)$data[$i]['idkelasfk'])
            ->where('idprodukfk', '=', (int)$data[$i]['idprodukfk'])
            ->get();

            $newfilter = array_filter($filterD);

            if (!empty($data) && !empty($filterD)) {
                //convert obj to array
                $newfilterD = json_decode(json_encode($filterD), true);

                // Compare all values by a json_encode
                $diff = array_diff(array_map('json_encode', $newfilterD), array_map('json_encode', $data));

                // Json decode the result
                $rowDataforDelete = array_map('json_decode', $diff);

                //reset index of array
                $rowDataforDelete_ = array_values($rowDataforDelete);
            }
            if (empty($filterD)) {
                $rowDataforInsert[] = array(
                    "norec" => substr(Uuid::generate(), 0, 32),
                    "idprodukfk" => (int)$data[$i]['idprodukfk'],
                    "potongan" => (int)$data[$i]['potongan'],
                    "idkelompokpasienfk" => (int)$data[$i]['idkelompokpasienfk'],
                    "idrekananfk" => (int)$data[$i]['idrekananfk'],
                    "idkelasfk" => (int)$data[$i]['idkelasfk'],
                    "potongan" => (float)$data[$i]['potongan'],
                );
            } else {
                // dd($newfilter);
                $rowDataforUpdate[] = array(
                    "norec" =>  $newfilter[0]->norec,
                    "idprodukfk" => (int)$data[$i]['idprodukfk'],
                    "potongan" => (int)$data[$i]['potongan'],
                    "idkelompokpasienfk" => (int)$data[$i]['idkelompokpasienfk'],
                    "idrekananfk" => (int)$data[$i]['idrekananfk'],
                    "idkelasfk" => (int)$data[$i]['idkelasfk'],
                    "potongan" => (float)$data[$i]['potongan'],
                );
            }
        }



        if (!empty($rowDataforInsert)) {
            //insert all data in array
            $is_saved = DB::table('mappenjamintoproduk_s')
            ->insert($rowDataforInsert);
        }

        if (!empty($rowDataforUpdate)) {

            for ($i = 0; $i < count($rowDataforUpdate); $i++) {

                $is_update = DB::table('mappenjamintoproduk_s')
                ->where('norec', $rowDataforUpdate[$i]['norec']);

                // unset($rowDataforUpdate[$i]['norec']); //remove id, for not update id
                // return($rowDataforUpdate[$i]);
                $is_update  = $is_update->update($rowDataforUpdate[$i]);
            }
        }

        $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = "Simpan Gagal Berhasil";
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "data" => $rowDataforUpdate,
                "as" => 'epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "data" => $rowDataforUpdate,
                "as" => 'epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}