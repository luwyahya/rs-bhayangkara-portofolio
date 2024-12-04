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
use App\Master\PaketObat;
use App\Master\PaketObatDetail;
use App\Master\Produk;
use App\Master\Diagnosa;
use App\Traits\Valet;
use DB;
use Faker\Provider\Uuid;
use Illuminate\Http\Request;

class SysAdminPaketController  extends ApiController
{

    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getlistCombo(Request $request)
    {
        // $jenis = DB::table('jenisruangan_m')
        //     ->select('*')
        //     ->where('statusenabled',true)
        //     ->get();
        $ruangan = DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->where('objectdepartemenfk', 18)
            ->orderBy('namaruangan')
            ->get();
        $navigasi = \DB::table('emr_t')
            ->select('id', 'caption')
            ->where('namaemr', 'navigasi')
            ->get();
        $jenisPegawai = JenisPegawai::where('statusenabled', true)->get();
        $result = array(
            // 'jenisruangan' => $jenis,
            'ruangan' => $ruangan,
            'jenispegawai' => $jenisPegawai,
            'navigasi' => $navigasi,
        );
        return $this->respond($result);
    }

    public function getDataMapping(Request $request)
    {
        $data = DB::table('mapruangantojenisruangan_m as map')
            ->join('ruangan_m as ru', 'map.objectruanganfk', '=', 'ru.id')
            ->join('jenisruangan_m as jr', 'map.objectjenisruanganfk', '=', 'jr.id')
            ->select('map.*', 'ru.namaruangan', 'jr.jenisruangan')
            ->where('map.statusenabled', true)
            ->where('map.objectjenisruanganfk', $request['idjenis'])
            ->get();
        $result = array(
            'data' => $data,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }
    public function getComboPaket(Request $request)
    {
        $paket = Paket::where('statusenabled', true)->get();
        //$produk = Produk::where('statusenabled',true)->get();
        $produk = DB::table('harganettoprodukbykelas_m as hnp')
            ->join('produk_m as prd', 'prd.id', '=', 'hnp.objectprodukfk')
            ->select('prd.id', 'prd.namaproduk')
            ->where('hnp.statusenabled', true)
            ->where('prd.statusenabled', true)
            ->orderBy('prd.namaproduk')
            ->distinct()
            ->get();

        /*$obat = \DB::table('produk_m as pr')
        ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
        ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
        // ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
        // ->JOIN('stokprodukdetail_t as spd', 'spd.objectprodukfk', '=', 'pr.id')
        ->select('pr.id', 'pr.namaproduk')
        ->where('pr.statusenabled', true)
        ->where('jp.objectdepartemenfk', '=', 14)
        ->groupBy('pr.id', 'pr.namaproduk')
        ->orderBy('pr.namaproduk')
        ->get();*/


        $obat = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd', 'spd.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar', 'pr.objectkelompokprodukbpjsfk')
            ->where('pr.statusenabled', true)
            // ->whereIn('jp.id',[97,283])
            ->where('spd.qtyproduk', '>', 0)
            ->where('jp.objectdepartemenfk', '=', 14)
            ->groupBy('pr.id', 'pr.namaproduk', 'ss.id', 'ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();


        $JenisKemasan = \DB::table('jeniskemasan_m as jk')
            ->select('jk.id', 'jk.jeniskemasan')
            ->where('jk.statusenabled', true)
            ->get();

        $Signa = \DB::table('stigma as st')
            ->select('st.id', 'st.name')
            ->where('st.statusenabled', true)
            ->orderBy('st.name', 'asc')
            ->get();

        $waktuminum = \DB::table('waktuminum_m as wm')
            ->select('wm.id', 'wm.waktuminum')
            ->where('wm.statusenabled', true)
            ->orderBy('wm.waktuminum', 'asc')
            ->get();

        $sediaanobat = \DB::table('sediaanobat_m as so')
            ->select('so.id', 'so.sediaanobat')
            ->where('so.statusenabled', true)
            ->orderBy('so.sediaanobat', 'asc')
            ->get();

        $satuan = \DB::table('satuanstandar_m as ss')
            ->select('ss.id', 'ss.satuanstandar')
            ->where('ss.statusenabled', true)
            ->orderBy('ss.satuanstandar', 'asc')
            ->get();

        $ruangan = DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        /*$ruangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id', 'ru.namaruangan')
            ->where('mlu.objectloginuserfk', $request['userData']['id'])
            ->get();*/


        $jenisracikan = DB::table('jenisracikan_m as jr')
            ->select('jr.id', 'jr.jenisracikan')
            ->where('jr.statusenabled', true)
            ->orderBy('jr.jenisracikan')
            ->get();


        $dataRoute = \DB::table('routefarmasi as rt')
            ->select('rt.id', 'rt.name')
            ->where('rt.statusenabled', true)
            ->orderBy('rt.id')
            ->get();


        $dataKonversiProduk = \DB::table('konversisatuan_t as ks')
            ->JOIN('satuanstandar_m as ss', 'ss.id', '=', 'ks.satuanstandar_asal')
            ->JOIN('satuanstandar_m as ss2', 'ss2.id', '=', 'ks.satuanstandar_tujuan')
            ->select(
                'ks.objekprodukfk',
                'ks.satuanstandar_asal',
                'ss.satuanstandar',
                'ks.satuanstandar_tujuan',
                'ss2.satuanstandar as satuanstandar2',
                'ks.nilaikonversi'
            )
            ->where('ks.statusenabled', true)
            ->get();


        $dataProdukResult = [];
        foreach ($obat as $item) {
            $satuanKonversi = [];
            foreach ($dataKonversiProduk  as $item2) {
                if ($item->id == $item2->objekprodukfk) {
                    $satuanKonversi[] = array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult[] = array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
                'objectkelompokprodukbpjsfk' => $item->objectkelompokprodukbpjsfk
            );
        }

        $result = array(
            'paket' => $paket,
            'route' => $dataRoute,
            'produk' => $produk,
            'obat' => $dataProdukResult,
            'jeniskemasan' => $JenisKemasan,
            'signa' => $Signa,
            'waktuminum' => $waktuminum,
            'sediaanobat' => $sediaanobat,
            'satuan' => $satuan,
            'ruangan' => $ruangan,
            'jenisracikan' => $jenisracikan,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }
    public function getMappingPaket(Request $request)
    {
        $paket = DB::table('mappakettoproduk_m as maps')
            ->join('paket_m as pak', 'pak.id', '=', 'maps.objectpaketfk')
            ->join('produk_m as prd', 'prd.id', '=', 'maps.objectprodukfk')
            ->select('maps.*', 'pak.namapaket', 'prd.namaproduk')
            ->where('maps.statusenabled', true);

        if (isset($request['paketId']) && $request['paketId'] != '') {
            $paket = $paket->where('maps.objectpaketfk', $request['paketId']);
        }
        if (isset($request['namaProduk']) && $request['namaProduk'] != '') {
            $paket = $paket->where('prd.namaproduk', 'like', '%' . $request['namaProduk'] . '%');
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
            foreach ($request['details'] as $item) {
                $kode[] = (float) $item['id'];
            }

            $hapus = MapPaketToProduk::where('statusenabled', true)
                ->where('objectpaketfk', $request['paketId'])
                ->whereIn('objectprodukfk', $kode)
                ->delete();
            foreach ($request['details'] as $item) {
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
            foreach ($request['data'] as $item) {
                MapPaketToProduk::where('id', $item['id'])->delete();
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
    public function getComboMKTTBKU(Request $request)
    {
        $produk = KelompokTransaksi::where('statusenabled', true)->get();
        $paket = Bku::where('statusenabled', true)->get();
        $result = array(
            'paket' => $paket,
            'produk' => $produk,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }
    public function getMappingMKTTBKU(Request $request)
    {
        $paket = DB::table('mapbkutokelompoktransaksi_m as mp')
            ->join('bku_m as bku', 'bku.id', '=', 'mp.idbku')
            ->join('kelompoktransaksi_m as kt', 'kt.id', '=', 'mp.kelompoktransaksifk')
            ->select('mp.id', 'mp.kelompoktransaksifk', 'mp.idbku', 'bku.bku', 'kt.kelompoktransaksi')
            ->where('mp.statusenabled', true);

        if (isset($request['idBku']) && $request['idBku'] != '') {
            $paket = $paket->where('mp.idbku', $request['idBku']);
        }
        if (isset($request['idTransaksi']) && $request['idTransaksi'] != '') {
            $paket = $paket->where('mp.kelompoktransaksifk', $request['idTransaksi']);
        }
        $paket = $paket->get();
        $result = array(
            'data' => $paket,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }

    public function saveMapMKTTBKU(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request['details'] as $item) {
                $kode[] = (float) $item['id'];
            }

            $hapus = MapBkutoKelompokTransaksi::where('statusenabled', true)
                ->where('idbku', $request['idBku'])
                ->whereIn('kelompoktransaksifk', $kode)
                ->delete();

            foreach ($request['details'] as $item) {
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

    public function DeleteMapMKTTBKU(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item) {
                MapBkutoKelompokTransaksi::where('id', $item['id'])->delete();
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

    public function getDataPaketObat(Request $request)
    {
        // $kdProfile = (int) $this->getDataKdProfile($request);
        $result = [];
        $data = \DB::table('paketobat_m as sp')
            ->select('sp.id as paketId', 'sp.namapaket', 'sp.objectruanganfk')
            // ->where('sp.kdprofile', $kdProfile)
            ->where('sp.statusenabled', true);

        if (isset($request['objectruanganfk']) && $request['objectruanganfk'] != '') {
            $data = $data->where('sp.objectruanganfk', $request['objectruanganfk']);
        }
        if (isset($request['paketId']) && $request['paketId'] != '') {
            $data = $data->where('sp.id', $request['paketId']);
        }
        if (isset($request['namaPaket']) && $request['namaPaket'] != '') {
            $data = $data->where('sp.namapaket', 'ilike', '%' . $request['namaPaket'] . '%');
        }
        if (isset($request['userLogin']) && $request['userLogin'] != '') {
            $data = $data->where('sp.loginuserfk', '=', $request['userLogin']);
        }
        $data = $data->orderBy('sp.namapaket');
        $data = $data->get();
        foreach ($data as $item) {
            $details = \DB::select(
                DB::raw("SELECT pkd.*,pro.namaproduk,pro.objectsatuanstandarfk,ss.satuanstandar,
                         pkd.qty as jumlah, jk.jeniskemasan, wm.waktuminum
                    FROM paketobatdetail_m as pkd
                    INNER JOIN produk_m As pro ON pro.id = pkd.produkfk
                    LEFT JOIN satuanstandar_m AS ss ON ss.id = pro.objectsatuanstandarfk
                    LEFT JOIN jeniskemasan_m as jk on jk.id = pkd.jeniskemasanfk
                    LEFT JOIN waktuminum_m as wm on wm.id = pkd.waktuminumfk


                    -- LEFT JOIN satuanresep_m AS sn ON sn.id = pkd.satuanresepfk
                    where pkd.paketobatfk=:norec"),
                array(
                    'norec' => $item->paketId,
                )
            );
            $result[] = array(
                'paketId' => $item->paketId,
                'namapaket' => $item->namapaket,
                'objectruanganfk' => $item->objectruanganfk,
                'details' => $details,
            );
        }
        $result = array(
            'data' => $result,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }

    public function savePaketObat(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            if ($request['idPaket'] == '') {
                $data = new PaketObat();
                $newId = PaketObat::max('id') + 1;
                $data->id = $newId;
                // $data->kdpaket = $newId;
                // $data->norec = $data->generateNewId();
                $data->kdprofile = $kdProfile;
                $data->statusenabled = true;
                $data->namapaket = $request['namapaket'];
                //$data->objectruanganfk = $request['namaruangan'];
            } else {
                $data = PaketObat::where('id', $request['idPaket'])->where('kdprofile', $kdProfile)->first();
                $dataDetail = PaketObatDetail::where('paketobatfk', $request['idPaket'])->where('kdprofile', $kdProfile)->delete();
                $newId = $data->id;
                // return($newId);
                // die;
            }
            // $data->reportdisplay = $request['namapaket'];
            $data->loginuserfk = $request['loginuserfk'];
            $data->namapaket = $request['namapaket'];
            //$data->objectruanganfk = $request['namaruangan'];
            $data->save();
            $idPaket = $data->id;

            foreach ($request['paketobat'] as $item) {
                $map = new PaketObatDetail();
                $map->id = PaketObatDetail::max('id') + 1;
                $map->kdprofile = $kdProfile; //12;
                $map->statusenabled = true;
                $map->norec =  $data->generateNewId();
                $map->paketobatfk = $newId;
                $map->produkfk = $item['produkfk'];
                $map->waktuminumfk = $item['waktuminumfk'];
                // $map->qpaket = 0;
                // $map->harga = 0;
                // $map->ispagi = $item['ispagi'];
                // $map->issiang = $item['issiang'];
                // $map->ismalam = $item['ismalam'];
                // $map->issore = $item['issore'];
                // if (isset($item['satuanresepfk'])){
                //     $map->satuanresepfk = $item['satuanresepfk'];
                // }

                // $map->satuanfk = $item['satuanviewfk'];
                if (isset($item['satuanviewfk'])) {
                    $map->satuanfk = $item['satuanviewfk'];
                }
                $map->routefk = $item['routefk'];

                $map->qty = $item['qty'];
                $map->rke = $item['rke'];
                $map->jeniskemasanfk = $item['jeniskemasanfk'];
                // $map->aturanpakai = $item['aturanpakai'];
                if (isset($item['aturanpakai']) && $item['aturanpakai'] != "undefined") {
                    $map->aturanpakai = $item['aturanpakai'];
                }
                //$map->satuanfk = NULL;
                //$map->waktuminumfk = NULL;
                $map->sediaanobatfk = NULL;
                if (isset($item['dosis']) && $item['dosis'] != "" && $item['dosis'] != "undefined") {
                    $map->dosis = $item['dosis'];
                }
                if (isset($item['jumlah']) && $item['jumlah'] != "" && $item['jumlah'] != "undefined") {
                    $map->jumlah = $item['jumlah'];
                }
                if (isset($item['kekuatan']) && $item['jumlah'] != "" && $item['jumlah'] != "undefined") {
                    $map->kekuatan = $item['jumlah'];
                }

                // if (isset($item['keterangan'])){
                //     $map->keterangan = $item['keterangan'];
                // }
                $map->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();

            $result = array(
                'status' => 201,
                'data' => $data,
                'detail' => $map,
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

    public function DeletePaketObat(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {

            $data = PaketObat::where('id', $request['idPaket'])->where('kdprofile', $kdProfile)
                ->update(['statusenabled' => 'false',]);
            $data = PaketObatDetail::where('paketobatfk', $request['idPaket'])->where('kdprofile', $kdProfile)
                ->update(['statusenabled' => 'false',]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();

            $result = array(
                'status' => 201,
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


    public function getDetailMasterPaket(Request $request)
    {
        $where = "";
        if (isset($request['objectresepmaster']) && $request['objectresepmaster'] != "" && $request['objectresepmaster'] != "undefined") {
            $where = $request['objectresepmaster'];
        }
        $ruangan = "";
        if (isset($request['objectruangan']) && $request['objectruangan'] != "" && $request['objectruangan'] != "undefined") {
            $ruangan = $request['objectruangan'];
        }

        $dataDetailResepMaster = \DB::table('paketobatdetail_m')
            ->join('produk_m', 'produk_m.id', '=', 'paketobatdetail_m.produkfk')
            ->join('waktuminum_m', 'waktuminum_m.id', '=', 'paketobatdetail_m.waktuminumfk')
            ->join('jeniskemasan_m', 'jeniskemasan_m.id', '=', 'paketobatdetail_m.jeniskemasanfk')
            ->join('satuanstandar_m', 'satuanstandar_m.id', '=', 'produk_m.objectsatuanstandarfk')
            ->join('routefarmasi', 'routefarmasi.id', '=', 'paketobatdetail_m.routefk')
            //->join('stockprodukdetail_t','stockprodukdetail_t.objectruanganfk','=',$ruangan)

            ->select(
                'paketobatdetail_m.*',
                'produk_m.id as idproduk',
                'produk_m.namaproduk',
                'waktuminum_m.waktuminum',
                'jeniskemasan_m.jeniskemasan',
                'satuanstandar_m.satuanstandar',
                'produk_m.objectsatuanstandarfk',
                'routefarmasi.name as route',
                'routefarmasi.id as routefk'
            )
            ->where('paketobatdetail_m.paketobatfk', $where)
            //->where('stokprodukdetail_t.objectruanganfk', $ruangan)
            // ->groupBy('paketobatdetail_m.*','produk_m.id as idproduk','produk_m.namaproduk','waktuminum_m.waktuminum','jeniskemasan_m.jeniskemasan','satuanstandar_m.satuanstandar','produk_m.objectsatuanstandarfk','routefarmasi.name','routefarmasi.id')
            ->get();


        //-----------------------------------------------

        $jenisTransaksi = \DB::table('jenistransaksi_m as jt')
            ->where('jt.id', 5)
            ->where('jt.statusenabled', true)
            ->first();

        if ($this->getCountArray($jenisTransaksi) == 0) {
            return $this->respond(array(
                'Error' => 'Setting jenistransaksi_m dulu',
                'message' => 'as@epic',
            ));
        }
        $strMetodeAmbilHargaNetto = $jenisTransaksi->metodeambilharganetto;
        //        $strMetodeHargaNetto = $jenisTransaksi->metodeharganetto; //ketika penerimaan saja
        $strMetodeStokHargaNetto = $jenisTransaksi->metodestokharganetto;
        $strSistemHargaNetto = $jenisTransaksi->sistemharganetto;
        // return($request['kelompokpasien']);
        // die();
        if (isset($request['kelompokpasien']) && $request['kelompokpasien'] != "" && $request['kelompokpasien'] != "undefined") {
            $kelompokpasien = $request['kelompokpasien'];
        } else {
            $kelompokpasien = 1;
        }


        $persenHargaJualProduk = \DB::table('persenhargajualproduk_m as phjp')
            ->JOIN('range_m as rg', 'rg.id', '=', 'phjp.objectrangefk')
            ->select('rg.rangemin', 'rg.rangemax', 'phjp.persenuphargasatuan')
            ->where('phjp.objectjenistransaksifk', 5)
            ->where('phjp.statusenabled', true)
            ->where('phjp.objectkelompokpasienfk', $kelompokpasien)
            ->get();
        if (count($persenHargaJualProduk) == 0) {
            return $this->respond(array(
                'Error' => 'Setting persenhargajualproduk_m dulu',
                'message' => 'as@epic',
            ));
        }



        $no = 0;

        foreach ($dataDetailResepMaster as $datamaster) {
            //        $persenUpHargaSatuan = $persenHargaJualProduk->persenuphargasatuan;
            $strHN = '';
            $strMSHT = '';
            $SistemHargaNetto = '';
            $MetodeAmbilHargaNetto = '';
            $MetodeStokHargaNetto = '';

            // ### FIFO ### //
            if ($strSistemHargaNetto == 1) {

                $SistemHargaNetto = 'FIFO';

                if ($strMetodeAmbilHargaNetto == 1) { //HN1
                    $strHN = 'spd.harganetto1';
                    $MetodeAmbilHargaNetto = 'HN1';
                }
                if ($strMetodeAmbilHargaNetto == 2) { //HN2
                    $strHN = 'spd.harganetto2';
                    $MetodeAmbilHargaNetto = 'HN2';
                }

                if ($strMetodeStokHargaNetto == 1) { //FIFO
                    $strMSHT = 'sk.tglstruk';
                    $MetodeStokHargaNetto = 'FIFO';
                }
                if ($strMetodeStokHargaNetto == 2) { //LIFO
                    $strMSHT = '';
                    $MetodeStokHargaNetto = 'LIFO';
                }
                if ($strMetodeStokHargaNetto == 3) { //FEFO
                    $strMSHT = 'spd.tglkadaluarsa';
                    $MetodeStokHargaNetto = 'FEFO';
                }
                if ($strMetodeStokHargaNetto == 4) { //LEFO
                    $strMSHT = '';
                    $MetodeStokHargaNetto = 'LEFO';
                }
                if ($strMetodeStokHargaNetto == 5) { //Summary
                    $strMSHT = '';
                    $MetodeStokHargaNetto = 'Summary';
                }
                $result = DB::select(
                    DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$strHN as harganetto ,
                        spd.hargadiscount,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                    where spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid
                    group by sk.norec,spd.objectprodukfk, $strMSHT,spd.objectasalprodukfk, 
                            $strHN,spd.hargadiscount,
                    spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                    order By $strMSHT limit 1"),
                    array(
                        'produkId' => $datamaster->idproduk,
                        'ruanganid' => $ruangan,
                    )
                );
                // return($result);

                $persenUpHargaSatuan = 0;
                foreach ($result as $item) {
                    foreach ($persenHargaJualProduk as $hitem) {
                        if ((float)$hitem->rangemin <= (float)$item->harganetto && (float)$hitem->rangemax >= (float)$item->harganetto) {

                            $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                        }
                    }
                    $resultProduk[] = array(
                        'norec' => $item->norec,
                        'objectprodukfk' => $item->objectprodukfk,
                        'tgl' => $item->tgl,
                        'objectasalprodukfk' => $item->objectasalprodukfk,
                        'asalproduk' => $item->asalproduk,
                        'harganetto' => $item->harganetto,
                        'hargadiscount' => $item->hargadiscount,
                        'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan) / 100),
                        'persenhargajualproduk' => $persenUpHargaSatuan,
                        'qtyproduk' => $item->qtyproduk,
                        'objectruanganfk' => $item->objectruanganfk,
                        'nostrukterimafk' => $item->nostrukterimafk,
                        'aturanpakai' => $datamaster->aturanpakai,
                        'dosis' => $datamaster->dosis,
                        'id' => $datamaster->id,
                        'idproduk' => $datamaster->idproduk,
                        'jeniskemasan' => $datamaster->jeniskemasan,
                        'jeniskemasanfk' => $datamaster->jeniskemasanfk,
                        'jumlah' => $datamaster->jumlah,
                        'kdprofile' => $datamaster->kdprofile,
                        'kekuatan' => $datamaster->kekuatan,
                        'namaproduk' => $datamaster->namaproduk,
                        'objectsatuanstandarfk' => $datamaster->objectsatuanstandarfk,
                        'paketobatfk' => $datamaster->paketobatfk,
                        'produkfk' => $datamaster->produkfk,
                        'qty' => $datamaster->qty,
                        'rke' => $datamaster->rke,
                        'satuanfk' => $datamaster->satuanfk,
                        'satuanstandar' => $datamaster->satuanstandar,
                        'sediaanobatfk' => $datamaster->sediaanobatfk,
                        'statusenabled' => $datamaster->statusenabled,
                        'waktuminum' => $datamaster->waktuminum,
                        'waktuminumfk' => $datamaster->waktuminumfk,
                        'route' => $datamaster->route,
                        'routefk' => $datamaster->routefk,
                    );
                    if ($datamaster->qty > 0) {
                        foreach ($persenHargaJualProduk as $hitem) {
                            if ((float)$hitem->rangemin <= (float)$item->harganetto && (float)$hitem->rangemax >= (float)$item->harganetto) {

                                $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                            }
                        }
                        // return($persenUpHargaSatuan);

                        $results[] = array(
                            'norec' => $item->norec,
                            'objectprodukfk' => $item->objectprodukfk,
                            'tgl' => $item->tgl,
                            'objectasalprodukfk' => $item->objectasalprodukfk,
                            'asalproduk' => $item->asalproduk,
                            'harganetto' => $item->harganetto,
                            'hargadiscount' => $item->hargadiscount,
                            'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan) / 100),
                            'persenhargajualproduk' => $persenUpHargaSatuan,
                            'qtyproduk' => $item->qtyproduk,
                            'objectruanganfk' => $item->objectruanganfk,
                            'nostrukterimafk' => $item->nostrukterimafk,

                            'aturanpakai' => $datamaster->aturanpakai,
                            'dosis' => $datamaster->dosis,
                            'id' => $datamaster->id,
                            'idproduk' => $datamaster->idproduk,
                            'jeniskemasan' => $datamaster->jeniskemasan,
                            'jeniskemasanfk' => $datamaster->jeniskemasanfk,
                            'jumlah' => $datamaster->jumlah,
                            'kdprofile' => $datamaster->kdprofile,
                            'kekuatan' => $datamaster->kekuatan,
                            'namaproduk' => $datamaster->namaproduk,
                            'objectsatuanstandarfk' => $datamaster->objectsatuanstandarfk,
                            'paketobatfk' => $datamaster->paketobatfk,
                            'produkfk' => $datamaster->produkfk,
                            'qty' => $datamaster->qty,
                            'rke' => $datamaster->rke,
                            'satuanfk' => $datamaster->satuanfk,
                            'satuanstandar' => $datamaster->satuanstandar,
                            'sediaanobatfk' => $datamaster->sediaanobatfk,
                            'statusenabled' => $datamaster->statusenabled,
                            'waktuminum' => $datamaster->waktuminum,
                            'waktuminumfk' => $datamaster->waktuminumfk,
                            'route' => $datamaster->route,
                            'routefk' => $datamaster->routefk,
                        );
                    }
                }
            }
            // ### END-FIFO ### //

            // ### Harga Tertinggi ### //
            if ($strSistemHargaNetto == 3) {

                $SistemHargaNetto = 'Harga Tertinggi';
                if ($strMetodeAmbilHargaNetto == 1) { //HN1
                    $strHN = 'spd.harganetto1';
                    $MetodeAmbilHargaNetto = 'HN1';
                }
                if ($strMetodeAmbilHargaNetto == 2) { //HN2
                    $strHN = 'spd.harganetto2';
                    $MetodeAmbilHargaNetto = 'HN2';
                }

                if ($strMetodeStokHargaNetto == 1) { //FIFO
                    $strMSHT = 'sk.tglstruk';
                    $MetodeStokHargaNetto = 'FIFO';
                }
                if ($strMetodeStokHargaNetto == 2) { //LIFO
                    $strMSHT = '';
                    $MetodeStokHargaNetto = 'LIFO';
                }
                if ($strMetodeStokHargaNetto == 3) { //FEFO
                    $strMSHT = 'spd.tglkadaluarsa';
                    $MetodeStokHargaNetto = 'FEFO';
                }
                if ($strMetodeStokHargaNetto == 4) { //LEFO
                    $strMSHT = '';
                    $MetodeStokHargaNetto = 'LEFO';
                }
                if ($strMetodeStokHargaNetto == 5) { //Summary
                    $strMSHT = '';
                    $MetodeStokHargaNetto = 'Summary';
                }
                $maxHarga = DB::select(
                    DB::raw("select $strHN as harga
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where spd.objectprodukfk = $datamaster->idproduk and spd.objectruanganfk = $ruangan"),
                    array(
                        'produkId' => $datamaster->idproduk,
                        'ruanganid' => $ruangan,
                    )
                );
                $hargaTertinggi = 0;
                foreach ($maxHarga as $item) {
                    if ($hargaTertinggi < (float)$item->harga) {
                        $hargaTertinggi = (float)$item->harga;
                    }
                }

                $result = DB::select(
                    DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$hargaTertinggi as harganetto ,
                            $hargaTertinggi  as hargajual,spd.hargadiscount,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                    where spd.objectprodukfk = $datamaster->idproduk and spd.objectruanganfk = $ruangan
                    group by sk.norec,spd.objectprodukfk, $strMSHT,spd.objectasalprodukfk, 
                            spd.hargadiscount,
                    spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                    order By $strMSHT"),
                    array(
                        'produkId' => $datamaster->idproduk,
                        'ruanganid' => $ruangan,
                    )
                );

                $persenUpHargaSatuan = 0;
                foreach ($result as $item) {
                    // foreach ($persenHargaJualProduk as $hitem){
                    if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto) {
                        $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                    }
                    // }
                    $results[] = array(
                        'norec' => $item->norec,
                        'objectprodukfk' => $item->objectprodukfk,
                        'tgl' => $item->tgl,
                        'objectasalprodukfk' => $item->objectasalprodukfk,
                        'asalproduk' => $item->asalproduk,
                        'harganetto' => $item->harganetto,
                        'hargadiscount' => $item->hargadiscount,
                        'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan) / 100),
                        'persenhargajualproduk' => $persenUpHargaSatuan,
                        'qtyproduk' => $item->qtyproduk,
                        'objectruanganfk' => $item->objectruanganfk,
                        'nostrukterimafk' => $item->nostrukterimafk,



                        'aturanpakai' => $datamaster->aturanpakai,
                        'dosis' => $datamaster->dosis,
                        'id' => $datamaster->id,
                        'idproduk' => $datamaster->idproduk,
                        'jeniskemasan' => $datamaster->jeniskemasan,
                        'jeniskemasanfk' => $datamaster->jeniskemasanfk,
                        'jumlah' => $datamaster->jumlah,
                        'kdprofile' => $datamaster->kdprofile,
                        'kekuatan' => $datamaster->kekuatan,
                        'namaproduk' => $datamaster->namaproduk,
                        'objectsatuanstandarfk' => $datamaster->objectsatuanstandarfk,
                        'paketobatfk' => $datamaster->paketobatfk,
                        'produkfk' => $datamaster->produkfk,
                        'qty' => $datamaster->qty,
                        'rke' => $datamaster->rke,
                        'satuanfk' => $datamaster->satuanfk,
                        'satuanstandar' => $datamaster->satuanstandar,
                        'sediaanobatfk' => $datamaster->sediaanobatfk,
                        'statusenabled' => $datamaster->statusenabled,
                        'waktuminum' => $datamaster->waktuminum,
                        'waktuminumfk' => $datamaster->waktuminumfk,
                        'route' => $datamaster->route,
                        'routefk' => $datamaster->routefk,

                    );
                }
            }
            // ### END-Harga Tertinggi ### //

            // ### Harga Terakhir ### //
            if ($strSistemHargaNetto == 7) {

                $SistemHargaNetto = 'Harga Terakhir';
                if ($strMetodeAmbilHargaNetto == 1) { //HN1
                    $strHN = 'spd.harganetto1';
                    $MetodeAmbilHargaNetto = 'HN1';
                }
                if ($strMetodeAmbilHargaNetto == 2) { //HN2
                    $strHN = 'spd.harganetto2';
                    $MetodeAmbilHargaNetto = 'HN2';
                }

                if ($strMetodeStokHargaNetto == 1) { //FIFO
                    $strMSHT = 'sk.tglstruk';
                    $MetodeStokHargaNetto = 'FIFO';
                }
                if ($strMetodeStokHargaNetto == 2) { //LIFO
                    $strMSHT = 'sk.tglstruk desc';
                    $MetodeStokHargaNetto = 'LIFO';
                }
                if ($strMetodeStokHargaNetto == 3) { //FEFO
                    $strMSHT = 'spd.tglkadaluarsa';
                    $MetodeStokHargaNetto = 'FEFO';
                }
                if ($strMetodeStokHargaNetto == 4) { //LEFO
                    $strMSHT = 'spd.tglkadaluarsa desc';
                    $MetodeStokHargaNetto = 'LEFO';
                }
                if ($strMetodeStokHargaNetto == 5) { //Summary
                    $strMSHT = '';
                    $MetodeStokHargaNetto = 'Summary';
                }
                $maxHarga = DB::select(
                    DB::raw("select spd.tglpelayanan, $strHN as harga
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where spd.objectprodukfk = $datamaster->idproduk "),
                    array(
                        'produkId' => $datamaster->idproduk,
                    )
                );
                $hargaTerakhir = 0;
                $tgl = date('2000-01-01 00:00');
                foreach ($maxHarga as $item) {
                    if ($tgl < $item->tglpelayanan) {
                        $tgl = $item->tglpelayanan;
                        $hargaTerakhir = (float)$item->harga;
                    }
                }
                $result = [];
                $result = DB::select(
                    DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$hargaTerakhir as harganetto ,
                            $hargaTerakhir  as hargajual,spd.hargadiscount,spd.nostrukterimafk,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                    where spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid and spd.qtyproduk > 0
                    group by sk.norec,spd.objectprodukfk, $strMSHT, spd.objectasalprodukfk, 
                            spd.hargadiscount,
                    spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                    order By $strMSHT"),
                    array(
                        'produkId' => $datamaster->idproduk,
                        'ruanganid' => $ruangan,
                    )
                );
                $results = [];
                $persenUpHargaSatuan = 0;
                foreach ($result as $item) {

                    foreach ($persenHargaJualProduk as $hitem) {

                        // if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto){
                        $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;

                        // }
                    }
                    // return('a');
                    // die();
                    $results[] = array(
                        'norec' => $item->norec,
                        'objectprodukfk' => $item->objectprodukfk,
                        'tgl' => $item->tgl,
                        'objectasalprodukfk' => $item->objectasalprodukfk,
                        'asalproduk' => $item->asalproduk,
                        'harganetto' => (float)$item->harganetto, //$item->harganetto,
                        'hargadiscount' => $item->hargadiscount,
                        'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan) / 100),
                        'persenhargajualproduk' => $persenUpHargaSatuan,
                        'qtyproduk' => $item->qtyproduk,
                        'objectruanganfk' => $item->objectruanganfk,
                        'nostrukterimafk' => $item->nostrukterimafk,


                        'aturanpakai' => $datamaster->aturanpakai,
                        'dosis' => $datamaster->dosis,
                        'id' => $datamaster->id,
                        'idproduk' => $datamaster->idproduk,
                        'jeniskemasan' => $datamaster->jeniskemasan,
                        'jeniskemasanfk' => $datamaster->jeniskemasanfk,
                        'jumlah' => $datamaster->jumlah,
                        'kdprofile' => $datamaster->kdprofile,
                        'kekuatan' => $datamaster->kekuatan,
                        'namaproduk' => $datamaster->namaproduk,
                        'objectsatuanstandarfk' => $datamaster->objectsatuanstandarfk,
                        'paketobatfk' => $datamaster->paketobatfk,
                        'produkfk' => $datamaster->produkfk,
                        'qty' => $datamaster->qty,
                        'rke' => $datamaster->rke,
                        'satuanfk' => $datamaster->satuanfk,
                        'satuanstandar' => $datamaster->satuanstandar,
                        'sediaanobatfk' => $datamaster->sediaanobatfk,
                        'statusenabled' => $datamaster->statusenabled,
                        'waktuminum' => $datamaster->waktuminum,
                        'waktuminumfk' => $datamaster->waktuminumfk,
                        'route' => $datamaster->route,
                        'routefk' => $datamaster->routefk,
                    );
                }

                $no++;
            }
            // ### END-Harga Terakhir ### //
        }

        //-----------------------------------------------
        if (empty($results)) $results = 0;

        $result = array(
            'data' => $dataDetailResepMaster,
            'message' => 'as@epic1',
            'msg' => 'ruangan ' . $ruangan,
            'results' => $results,
            'resultProduk' => $resultProduk,
        );

        return $this->respond($result);
    }


    public function getProdukDetail(Request $request)
    {
        //        namafield	nilaifield	keteranganfungsi
        //        MetodeAmbilHargaNetto	0	KOSONG .: pengambilan hn1 atau hn2

        //        MetodeHargaNetto	2	AVG
        //        MetodeHargaNetto	3	Harga Tertinggi
        //        MetodeHargaNetto	1	Harga Netto #

        //        MetodeStokHargaNetto	2	LIFO
        //        MetodeStokHargaNetto	3	FEFO #
        //        MetodeStokHargaNetto	4	LEFO
        //        MetodeStokHargaNetto	1	FIFO
        //        MetodeStokHargaNetto	5	Summary

        //        SistemHargaNetto	7	Harga Terakhir #
        //        SistemHargaNetto	6	LEFO
        //        SistemHargaNetto	2	LIFO
        //        SistemHargaNetto	3	Harga Tertinggi
        //        SistemHargaNetto	4	AVG
        //        SistemHargaNetto	5	FEFO
        //        SistemHargaNetto	1	FIFO

        //bucat : # setting yg dipakai


        //        select * from settingdatafixed_m where namafield  in ('SistemHargaNetto','MetodeHargaNetto','MetodeStokHargaNetto','MetodeAmbilHargaNetto') order by namafield;
        //        select * from jenistransaksi_m where id=5;
        //        select * from persenhargajualproduk_m where objectjenistransaksifk =5; .:25%


        $jenisTransaksi = \DB::table('jenistransaksi_m as jt')
            ->where('jt.id', 5)
            ->where('jt.statusenabled', true)
            ->first();

        if ($this->getCountArray($jenisTransaksi) == 0) {
            return $this->respond(array(
                'Error' => 'Setting jenistransaksi_m dulu',
                'message' => 'as@epic',
            ));
        }
        $strMetodeAmbilHargaNetto = $jenisTransaksi->metodeambilharganetto;
        //        $strMetodeHargaNetto = $jenisTransaksi->metodeharganetto; //ketika penerimaan saja
        $strMetodeStokHargaNetto = $jenisTransaksi->metodestokharganetto;
        $strSistemHargaNetto = $jenisTransaksi->sistemharganetto;
        // return($request['kelompokpasien']);
        // die();
        if (isset($request['kelompokpasien']) && $request['kelompokpasien'] != "" && $request['kelompokpasien'] != "undefined") {
            $kelompokpasien = $request['kelompokpasien'];
        } else {
            $kelompokpasien = 1;
        }


        $persenHargaJualProduk = \DB::table('persenhargajualproduk_m as phjp')
            ->JOIN('range_m as rg', 'rg.id', '=', 'phjp.objectrangefk')
            ->select('rg.rangemin', 'rg.rangemax', 'phjp.persenuphargasatuan')
            ->where('phjp.objectjenistransaksifk', 5)
            ->where('phjp.statusenabled', true)
            ->where('phjp.objectkelompokpasienfk', $kelompokpasien)
            ->get();
        if (count($persenHargaJualProduk) == 0) {
            return $this->respond(array(
                'Error' => 'Setting persenhargajualproduk_m dulu',
                'message' => 'as@epic',
            ));
        }

        //        $persenUpHargaSatuan = $persenHargaJualProduk->persenuphargasatuan;
        $strHN = '';
        $strMSHT = '';
        $SistemHargaNetto = '';
        $MetodeAmbilHargaNetto = '';
        $MetodeStokHargaNetto = '';

        // ### FIFO ### //
        if ($strSistemHargaNetto == 1) {

            $SistemHargaNetto = 'FIFO';

            if ($strMetodeAmbilHargaNetto == 1) { //HN1
                $strHN = 'spd.harganetto1';
                $MetodeAmbilHargaNetto = 'HN1';
            }
            if ($strMetodeAmbilHargaNetto == 2) { //HN2
                $strHN = 'spd.harganetto2';
                $MetodeAmbilHargaNetto = 'HN2';
            }

            if ($strMetodeStokHargaNetto == 1) { //FIFO
                $strMSHT = 'sk.tglstruk';
                $MetodeStokHargaNetto = 'FIFO';
            }
            if ($strMetodeStokHargaNetto == 2) { //LIFO
                $strMSHT = '';
                $MetodeStokHargaNetto = 'LIFO';
            }
            if ($strMetodeStokHargaNetto == 3) { //FEFO
                $strMSHT = 'spd.tglkadaluarsa';
                $MetodeStokHargaNetto = 'FEFO';
            }
            if ($strMetodeStokHargaNetto == 4) { //LEFO
                $strMSHT = '';
                $MetodeStokHargaNetto = 'LEFO';
            }
            if ($strMetodeStokHargaNetto == 5) { //Summary
                $strMSHT = '';
                $MetodeStokHargaNetto = 'Summary';
            }
            $result = DB::select(
                DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$strHN as harganetto ,
                      spd.hargadiscount,
                sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                where spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid
                group by sk.norec,spd.objectprodukfk, $strMSHT,spd.objectasalprodukfk, 
                        $strHN,spd.hargadiscount,
                spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                order By $strMSHT"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );
            // return($result);

            $persenUpHargaSatuan = 0;
            foreach ($result as $item) {
                if ($item->qtyproduk > 0) {
                    foreach ($persenHargaJualProduk as $hitem) {
                        if ((float)$hitem->rangemin <= (float)$item->harganetto && (float)$hitem->rangemax >= (float)$item->harganetto) {

                            $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                        }
                    }
                    // return($persenUpHargaSatuan);

                    $results[] = array(
                        'norec' => $item->norec,
                        'objectprodukfk' => $item->objectprodukfk,
                        'tgl' => $item->tgl,
                        'objectasalprodukfk' => $item->objectasalprodukfk,
                        'asalproduk' => $item->asalproduk,
                        'harganetto' => $item->harganetto,
                        'hargadiscount' => $item->hargadiscount,
                        'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan) / 100),
                        'persenhargajualproduk' => $persenUpHargaSatuan,
                        'qtyproduk' => $item->qtyproduk,
                        'objectruanganfk' => $item->objectruanganfk,
                        'nostrukterimafk' => $item->nostrukterimafk,
                    );
                }
            }
        }
        // ### END-FIFO ### //

        // ### Harga Tertinggi ### //
        if ($strSistemHargaNetto == 3) {

            $SistemHargaNetto = 'Harga Tertinggi';
            if ($strMetodeAmbilHargaNetto == 1) { //HN1
                $strHN = 'spd.harganetto1';
                $MetodeAmbilHargaNetto = 'HN1';
            }
            if ($strMetodeAmbilHargaNetto == 2) { //HN2
                $strHN = 'spd.harganetto2';
                $MetodeAmbilHargaNetto = 'HN2';
            }

            if ($strMetodeStokHargaNetto == 1) { //FIFO
                $strMSHT = 'sk.tglstruk';
                $MetodeStokHargaNetto = 'FIFO';
            }
            if ($strMetodeStokHargaNetto == 2) { //LIFO
                $strMSHT = '';
                $MetodeStokHargaNetto = 'LIFO';
            }
            if ($strMetodeStokHargaNetto == 3) { //FEFO
                $strMSHT = 'spd.tglkadaluarsa';
                $MetodeStokHargaNetto = 'FEFO';
            }
            if ($strMetodeStokHargaNetto == 4) { //LEFO
                $strMSHT = '';
                $MetodeStokHargaNetto = 'LEFO';
            }
            if ($strMetodeStokHargaNetto == 5) { //Summary
                $strMSHT = '';
                $MetodeStokHargaNetto = 'Summary';
            }
            $maxHarga = DB::select(
                DB::raw("select $strHN as harga
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                where spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );
            $hargaTertinggi = 0;
            foreach ($maxHarga as $item) {
                if ($hargaTertinggi < (float)$item->harga) {
                    $hargaTertinggi = (float)$item->harga;
                }
            }

            $result = DB::select(
                DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$hargaTertinggi as harganetto ,
                        $hargaTertinggi  as hargajual,spd.hargadiscount,
                sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                where spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid
                group by sk.norec,spd.objectprodukfk, $strMSHT,spd.objectasalprodukfk, 
                        spd.hargadiscount,
                spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                order By $strMSHT"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );

            $persenUpHargaSatuan = 0;
            foreach ($result as $item) {
                // foreach ($persenHargaJualProduk as $hitem){
                if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto) {
                    $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                }
                // }
                $results[] = array(
                    'norec' => $item->norec,
                    'objectprodukfk' => $item->objectprodukfk,
                    'tgl' => $item->tgl,
                    'objectasalprodukfk' => $item->objectasalprodukfk,
                    'asalproduk' => $item->asalproduk,
                    'harganetto' => $item->harganetto,
                    'hargadiscount' => $item->hargadiscount,
                    'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan) / 100),
                    'persenhargajualproduk' => $persenUpHargaSatuan,
                    'qtyproduk' => $item->qtyproduk,
                    'objectruanganfk' => $item->objectruanganfk,
                    'nostrukterimafk' => $item->nostrukterimafk,
                );
            }
        }
        // ### END-Harga Tertinggi ### //

        // ### Harga Terakhir ### //
        if ($strSistemHargaNetto == 7) {

            $SistemHargaNetto = 'Harga Terakhir';
            if ($strMetodeAmbilHargaNetto == 1) { //HN1
                $strHN = 'spd.harganetto1';
                $MetodeAmbilHargaNetto = 'HN1';
            }
            if ($strMetodeAmbilHargaNetto == 2) { //HN2
                $strHN = 'spd.harganetto2';
                $MetodeAmbilHargaNetto = 'HN2';
            }

            if ($strMetodeStokHargaNetto == 1) { //FIFO
                $strMSHT = 'sk.tglstruk';
                $MetodeStokHargaNetto = 'FIFO';
            }
            if ($strMetodeStokHargaNetto == 2) { //LIFO
                $strMSHT = 'sk.tglstruk desc';
                $MetodeStokHargaNetto = 'LIFO';
            }
            if ($strMetodeStokHargaNetto == 3) { //FEFO
                $strMSHT = 'spd.tglkadaluarsa';
                $MetodeStokHargaNetto = 'FEFO';
            }
            if ($strMetodeStokHargaNetto == 4) { //LEFO
                $strMSHT = 'spd.tglkadaluarsa desc';
                $MetodeStokHargaNetto = 'LEFO';
            }
            if ($strMetodeStokHargaNetto == 5) { //Summary
                $strMSHT = '';
                $MetodeStokHargaNetto = 'Summary';
            }
            $maxHarga = DB::select(
                DB::raw("select spd.tglpelayanan, $strHN as harga
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                where spd.objectprodukfk =:produkId "),
                array(
                    'produkId' => $request['produkfk'],
                )
            );
            $hargaTerakhir = 0;
            $tgl = date('2000-01-01 00:00');
            foreach ($maxHarga as $item) {
                if ($tgl < $item->tglpelayanan) {
                    $tgl = $item->tglpelayanan;
                    $hargaTerakhir = (float)$item->harga;
                }
            }
            $result = [];
            $result = DB::select(
                DB::raw("select sk.norec,spd.objectprodukfk, $strMSHT as tgl,spd.objectasalprodukfk,$hargaTerakhir as harganetto ,
                        $hargaTerakhir  as hargajual,spd.hargadiscount,spd.nostrukterimafk,
                sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk,ap.asalproduk
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                where spd.objectprodukfk =:produkId and spd.objectruanganfk =:ruanganid and spd.qtyproduk > 0
                group by sk.norec,spd.objectprodukfk, $strMSHT, spd.objectasalprodukfk, 
                        spd.hargadiscount,
                spd.objectruanganfk,ap.asalproduk,spd.nostrukterimafk
                order By $strMSHT"),
                array(
                    'produkId' => $request['produkfk'],
                    'ruanganid' => $request['ruanganfk'],
                )
            );
            $results = [];
            $persenUpHargaSatuan = 0;
            foreach ($result as $item) {

                foreach ($persenHargaJualProduk as $hitem) {

                    // if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto){
                    $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;

                    // }
                }
                // return('a');
                // die();
                $results[] = array(
                    'norec' => $item->norec,
                    'objectprodukfk' => $item->objectprodukfk,
                    'tgl' => $item->tgl,
                    'objectasalprodukfk' => $item->objectasalprodukfk,
                    'asalproduk' => $item->asalproduk,
                    'harganetto' => (float)$item->harganetto, //$item->harganetto,
                    'hargadiscount' => $item->hargadiscount,
                    'hargajual' => (float)$item->harganetto + (((float)$item->harganetto * (float)$persenUpHargaSatuan) / 100),
                    'persenhargajualproduk' => $persenUpHargaSatuan,
                    'qtyproduk' => $item->qtyproduk,
                    'objectruanganfk' => $item->objectruanganfk,
                    'nostrukterimafk' => $item->nostrukterimafk,
                );
            }
        }
        // ### END-Harga Terakhir ### //

        $jmlstok = 0;
        foreach ($result as $item) {
            $jmlstok = $jmlstok + $item->qtyproduk;
        }

        $cekConsis = DB::select(
            DB::raw("select * from his_obat_ms_t where hobatid=:produkfk;"),
            array(
                'produkfk' =>  $request['produkfk'],
            )
        );
        $cekKekuatanSupranatural = DB::select(
            DB::raw("

            select pr.kekuatan,sdn.name as sediaan from produk_m as pr 
            left join rm_sediaan_m as sdn on sdn.id=pr.objectsediaanfk
            where pr.id=:produkfk;
            
            "),
            array(
                'produkfk' =>  $request['produkfk'],
            )
        );
        $kekuatan = 0;
        $sediaan = 0;
        if (count($cekKekuatanSupranatural) > 0) {
            $kekuatan = (float)$cekKekuatanSupranatural[0]->kekuatan;
            $sediaan = $cekKekuatanSupranatural[0]->sediaan;
            if ($kekuatan == null) {
                $kekuatan = 0;
            }
        }
        $cekdosisobat = DB::select(
            DB::raw("
            select pr.dosisobat from produk_m as pr
            where pr.id=:produkfk;
            "),
            array(
                'produkfk' =>  $request['produkfk'],
            )
        );
        $dosiscoy = $cekdosisobat[0]->dosisobat;
        if ($dosiscoy == null) {
            $dosiscoy = '';
        };

        $result = array(
            'detail' => $results,
            'jmlstok' => $jmlstok,
            'kekuatan' => $kekuatan,
            'sediaan' => $sediaan,
            'sistemharganetto' => $SistemHargaNetto,
            'metodeambilharganetto' => $MetodeAmbilHargaNetto,
            'metodestokharganetto' => $MetodeStokHargaNetto,
            'consis' => count($cekConsis),
            'dosisobat' => $dosiscoy,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }


    public function saveMapPaketToProdukRuangan(Request $request)
    {
        DB::beginTransaction();
        // return($request['ruanganfk']);
        // die;
        try {
            if ($request['status'] == false) {

                $hapus = MapPaketToProduk::where('objectpaketfk', $request['paketId'])
                    ->where('objectruanganfk', $request['ruanganfk'])
                    ->where('objectprodukfk', $request['produkfk'])
                    ->delete();
                $map = '';
            } else {

                $map = new MapPaketToProduk();
                $map->id = MapPaketToProduk::max('id') + 1;
                $map->kdprofile = 12;
                $map->statusenabled = true;
                $map->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $map->objectpaketfk = $request['paketId'];
                $map->objectprodukfk = $request['produkfk'];
                $map->objectruanganfk = $request['ruanganfk'];
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

    public function getMasterDiagnosa(Request $request)
    {
        $data = \DB::table('diagnosa_m as dm')
            ->select('dm.id', 'dm.kddiagnosa', 'dm.norec', 'dm.namadiagnosa')
            ->where('dm.statusenabled', true);

        if (isset($request['namadiagnosa']) && $request['namadiagnosa'] != '') {
            $data = $data->where('dm.namadiagnosa', 'like', '%' . $request['namadiagnosa'] . '%');
        }
        if (isset($request['kodediagnosa']) && $request['kodediagnosa'] != '') {
            $data = $data->where('dm.kddiagnosa', 'like', '%' . $request['kodediagnosa'] . '%');
        }
        $data = $data->orderBy('dm.kddiagnosa', 'asc');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }

    public function UpdateMasterDiagnosa(Request $request)
    {
        DB::beginTransaction();
        // $data=$request['data'];
        try {

            $dataOP = Diagnosa::where('kddiagnosa', $request['kddiagnosa'])
                ->update([
                    'namadiagnosa' => $request['namadiagnosa'],
                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Diagnosa Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Update Diagnosa Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getIdUserLogin(Request $request, $id)
    {
        $idPegawai = $id;

        try {
            $getData = \DB::table('loginuser_s as lu')
                ->select('lu.id')
                ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
                ->where('pg.id', $idPegawai)
                ->first();
            $response = [
                "message" => "Oke!",
                "messageCode" => 200,
                "data" => $getData
            ];
        } catch (\Exception $e) {
            $response = [
                "message" => $e->errorInfo,
                "messageCode" => 500
            ];
        }

        return $this->respond($response);
    }
}
