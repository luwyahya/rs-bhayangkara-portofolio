<?php
/**
 * Created by PhpStorm.
 * User: efan (ea@epic)
 * Date: 12/09/2019
 * Time:09:58
 */
namespace App\Http\Controllers\SysAdmin;


use App\Http\Controllers\ApiController;
use App\Master\Bku;
use App\Master\JenisPegawai;
use App\Master\KelompokTransaksi;
use App\Master\MapBkutoKelompokTransaksi;
use App\Master\MapPaketToProduk;
use App\Master\Paket;
use App\Master\Produk;
use App\Traits\Valet;
use DB;
use Faker\Provider\Uuid;
use Illuminate\Http\Request;

class SysAdminController  extends ApiController {

    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getlistCombo (Request $request){
        $jenis = DB::table('jenisruangan_m')
            ->select('*')
            ->where('statusenabled',true)
            ->get();
        $ruangan = DB::table('ruangan_m')
            ->select('id','namaruangan')
            ->where('statusenabled',true)
            ->where('objectdepartemenfk',18)
            ->orderBy('namaruangan')
            ->get();
        $jenisPegawai = JenisPegawai::where('statusenabled',true)->get();
        $result = array(
            'jenisruangan' => $jenis,
            'ruangan' => $ruangan,
            'jenispegawai' => $jenisPegawai,
        );
        return $this->respond($result);
    }

    public function getDataMapping (Request $request){
        $data = DB::table('mapruangantojenisruangan_m as map')
            ->join('ruangan_m as ru','map.objectruanganfk','=','ru.id')
            ->join('jenisruangan_m as jr','map.objectjenisruanganfk','=','jr.id')
            ->select('map.*','ru.namaruangan','jr.jenisruangan')
            ->where('map.statusenabled',true)
            ->where('map.objectjenisruanganfk',$request['idjenis'])
            ->get();
        $result = array(
            'data' => $data,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }
    public function getComboPaket (Request $request){
        $paket = Paket::where('statusenabled',true)->get();
        //$produk = Produk::where('statusenabled',true)->get();
        $produk = DB::table('harganettoprodukbykelas_m as hnp')
            ->join('produk_m as prd','prd.id','=','hnp.objectprodukfk')
            ->select('prd.id','prd.namaproduk')
            ->where('hnp.statusenabled',true)
            ->where('prd.statusenabled',true)
            ->orderBy('prd.namaproduk')
            ->distinct()
            ->get();
        $result = array(
            'paket' => $paket,
            'produk' => $produk,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }
    public function getMappingPaket (Request $request){
        $paket = DB::table('mappakettoproduk_m as maps')
            ->join('paket_m as pak','pak.id','=','maps.objectpaketfk')
            ->join('produk_m as prd','prd.id','=','maps.objectprodukfk')
            ->select('maps.*','pak.namapaket','prd.namaproduk')
            ->where('maps.statusenabled',true);

        if(isset($request['paketId']) && $request['paketId'] !='' ){
            $paket = $paket->where('maps.objectpaketfk',$request['paketId']);
        }
        if(isset($request['namaProduk']) && $request['namaProduk'] !='' ){
            $paket = $paket->where('prd.namaproduk','like','%'.$request['namaProduk'].'%');
        }
        $paket = $paket->get();
        $result = array(
            'data' => $paket,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }
    public function saveMapPaketToProduk(Request $request)
    {

        DB::beginTransaction();
        try {
            foreach ( $request['details'] as $item){
                $kode[] = (double) $item['id'];

            }

            $hapus = MapPaketToProduk::where('statusenabled',true)
                ->where('objectpaketfk',$request['paketId'])
                ->whereIn('objectprodukfk',$kode)
                ->delete();
            foreach ( $request['details'] as $item){
                $map = new MapPaketToProduk();
                $map->id = MapPaketToProduk::max('id') + 1;
                $map->kdprofile = 12;
                $map->statusenabled = true;
                $map->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $map->objectpaketfk = $request['paketId'];
                $map->objectprodukfk = $item['id'];
                $map->save();
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
                'data' => $map,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function DeleteMapPaketToProduk(Request $request)
    {

        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item){
                MapPaketToProduk::where('id',$item['id'])->delete();
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
//                'data' => $map,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboMKTTBKU (Request $request){
        $produk = KelompokTransaksi::where('statusenabled',true)->get();
        $paket = Bku::where('statusenabled',true)->get();
        $result = array(
            'paket' => $paket,
            'produk' => $produk,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }
    public function getMappingMKTTBKU (Request $request){
        $paket = DB::table('mapbkutokelompoktransaksi_m as mp')
            ->join('bku_m as bku','bku.id','=','mp.idbku')
            ->join('kelompoktransaksi_m as kt','kt.id','=','mp.kelompoktransaksifk')
            ->select('mp.id','mp.kelompoktransaksifk','mp.idbku','bku.bku','kt.kelompoktransaksi')
            ->where('mp.statusenabled',true);

        if(isset($request['idBku']) && $request['idBku'] !='' ){
            $paket = $paket->where('mp.idbku',$request['idBku']);
        }
        if(isset($request['idTransaksi']) && $request['idTransaksi'] !='' ){
            $paket = $paket->where('mp.kelompoktransaksifk',$request['idTransaksi']);
        }
        $paket = $paket->get();
        $result = array(
            'data' => $paket,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }

    public function saveMapMKTTBKU(Request $request){
        DB::beginTransaction();
       try {
            foreach ( $request['details'] as $item){
                $kode[] = (double) $item['id'];
            }

            $hapus = MapBkutoKelompokTransaksi::where('statusenabled',true)
                ->where('idbku',$request['idBku'])
                ->whereIn('kelompoktransaksifk',$kode)
                ->delete();

            foreach ( $request['details'] as $item){
                $map = new MapBkutoKelompokTransaksi();
                $map->id = MapBkutoKelompokTransaksi::max('id') + 1;
                $map->kdprofile = 12;
                $map->statusenabled = true;
                $map->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $map->idbku = $request['idBku'];
                $map->kelompoktransaksifk = $item['id'];
                $map->save();
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
                'data' => $map,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function DeleteMapMKTTBKU(Request $request){
        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item){
                MapBkutoKelompokTransaksi::where('id',$item['id'])->delete();
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
//                'data' => $map,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}