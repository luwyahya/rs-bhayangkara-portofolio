<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 9/30/2019
 * Time: 9:25 AM
 */

namespace App\Http\Controllers\Gizi;

use App\Http\Controllers\ApiController;
use App\Master\SiklusGizi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
use Webpatser\Uuid\Uuid;
use App\Master\Pegawai;
use App\Master\Pasien;
use App\Master\Ruangan;
use App\Transaksi\StokProdukDetail;
use App\Transaksi\KartuStok;
use App\Transaksi\StrukKirim;
use App\Transaksi\KirimProduk;
use App\Transaksi\StrukClosing;
use App\Transaksi\StokProdukDetailOpname;
use App\Transaksi\StrukOrder;
use App\Transaksi\MenuGizi;
use App\Transaksi\OrderPelayanan;
use App\Master\JenisDiet;
use App\Master\JenisWaktu;
use App\Master\KategoryDiet;
use App\Transaksi\PasienDaftar;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\menugizidetail;


class GiziController extends ApiController
{
    use Valet;
    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getProdukMenu(Request $request)
    {
        $siklusKe = $request['siklusKe'];
        $kelasId = $request['kelasId'];
        $jenisDietId = $request['jenisDietId'];
        $jenisWaktuId = $request['jenisWaktuId'];
        $kat = $request['kategoryDiet'];
        $norec_pd = $request['norec_pd'];
        $data = DB::select(DB::raw("select  prd.id,sm.objectprodukfk as produkfk, prd.namaproduk,
                    sm.sikluske,sm.objectjeniswaktufk,jw.jeniswaktu,sm.objectjenisdietfk,jd.jenisdiet ,
                    sm.objectkelasfk,kls.namakelas
                    from siklusgizi_m as sm
                    inner join produk_m as prd on prd.id=sm.objectprodukfk
                    inner join jeniswaktu_m as jw on jw.id=sm.objectjeniswaktufk
                    inner join jenisdiet_m as jd on jd.id=sm.objectjenisdietfk
                    inner join kelas_m as kls on kls.id=sm.objectkelasfk
                        INNER JOIN kategorydiet_m kat on kat.id=sm.objectkategoryprodukfk
                    where 
                    sm.statusenabled =1 
                    and sm.sikluske = '$siklusKe' 
                    and kat.id='$kat'
                    and
                     sm.objectjeniswaktufk in (0,1,2,3,4) and --pagi siang sore
                --    sm.objectjeniswaktufk = '$jenisWaktuId'::integer and --pagi siang sore
                    sm.objectjenisdietfk= '$jenisDietId' and
                    sm.objectkelasfk = '$kelasId';
                    "));
        $results = [];
        if (count($data) > 0) {
            foreach ($data as $item) {
                $results[] = array(
                    'id' => $item->id,
                    'produkfk' => $item->produkfk,
                    'namaproduk' => $item->namaproduk,
                    'sikluske' => $item->sikluske,
                    'objectjeniswaktufk' => $item->objectjeniswaktufk,
                    'jeniswaktu' => $item->jeniswaktu,
                    'objectjenisdietfk' => $item->objectjenisdietfk,
                    'jenisdiet' => $item->jenisdiet,
                    'objectkelasfk' => $item->objectkelasfk,
                    'namakelas' => $item->namakelas,
                    'qtyproduk' => 1,
                    'norec_op' => $request['norec_op'],
                );
            }
        }

        $result = array(
            'data' => $results,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    
    public function getPertanyaanPMKP(Request $request)
    {
        $data = DB::table('orderpelayanan_t as op')
            ->select('op.noregistrasifk', 'op.norec as norec_op')
            ->where('op.tglpelayanan', '>=', date("Y-m-d 00:00:00"))
            ->where('op.tglpelayanan', '<=', date("Y-m-d 23:59:59"))
            ->where('op.statusenabled',true)
            ->where('op.keteranganlainnya_quo', '=', 'Order Gizi')
            ->where('op.objectjeniswaktufk', 1)
            ->whereIn('op.objectjenisdietfk', [0,1])
            ->whereIn('op.objectjenisdietfk1', [0,1])
            ->whereIn('op.objectjenisdietfk2', [0,1])
            ->where('op.noregistrasifk', $request['norec_pd'])
            ->get();
        
        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    
    public function savePertanyaanPMKP(Request $request)
    {
        // return($request['norec_op']);
        // die();
        DB::beginTransaction();

        try {
            OrderPelayanan::where('norec', $request['norec_op'])
                ->update([
                    'ispmkp' => $request['status']
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus != 'false') {
            $transMessage = "Update Status PMKP";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Status PMKP Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getMappingMenu(Request $request)
    {
        return ($request['menu']);
        die;
        $menu = $request['menu'];
        $data = DB::select(DB::raw("select * from V_GetMappingMenu where menu like '% $menu  %';
                    "));
        $results = [];
        if (count($data) > 0) {
            foreach ($data as $item) {
                $results[] = array(
                    'id' => $item->id,
                    'Menu' => $item->menu,
                    'Bahan' => $item->bahan,
                    'produkdetailfk' => $item->produkdetailfk,
                    'produkheadfk' => $item->produkheadfk,
                    // menu, bahan
                );
            }
        }

        $result = array(
            'data' => $results,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }



    public function saveSiklusGizi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            foreach ($request['details'] as $item) {
                $kode[] = (float) $item['produkfk'];
                $kelasfk[] = (float) $item['kelasfk'];
            }

            $hapus = SiklusGizi::where('statusenabled', true)
                ->where('kdprofile', $kdProfile)
                ->where('sikluske', $request['sikluske'])
                ->where('objectjenisdietfk', $request['objectjenisdietfk'])
                ->whereIn('objectkelasfk', $kelasfk)
                ->where('objectjeniswaktufk', $request['objectjeniswaktufk'])
                ->whereIn('objectprodukfk', $kode)
                ->where('objectkategoryprodukfk', $request['objectkategoryprodukfk'])
                ->where('objectbentukprodukfk', $request['objectbentukprodukfk'])
                ->delete();

            foreach ($request['details'] as $item) {
                $SG = new SiklusGizi();
                $SG->id =  SiklusGizi::max('id') + 1;
                $SG->kdprofile = $kdProfile;
                $SG->statusenabled = true;
                $SG->kodeexternal = 'GIZI';
                $SG->norec =  $SG->generateNewId();
                $SG->sikluske = $request['sikluske'];
                $SG->objectjeniswaktufk = $request['objectjeniswaktufk'];
                $SG->objectjenisdietfk =  $request['objectjenisdietfk'];
                $SG->objectkelasfk = $item['kelasfk'];
                $SG->objectprodukfk =  $item['produkfk'];
                $SG->objectbentukprodukfk = $request['objectbentukprodukfk'];
                $SG->objectkategoryprodukfk = $request['objectkategoryprodukfk'];

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




    public function saveMenuGizi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            // foreach ( $request['details'] as $item){
            //     // $kode[] = (double) $item['produkfk'];
            //     $hapus = menugizidetail::where('statusenabled',true)
            //     ->where('produkdetailfk',$item['produkfk'])
            //     ->where('produkheadfk',$request['produkdetailfk'])
            //     ->delete();

            // }


            // id, satatusenabled, kodeexternal, namaexternal, produkdetailfk, produkheadfk
            foreach ($request['details'] as $item) {

                $SG = new menugizidetail();
                $SG->id =  menugizidetail::max('id') + 1;
                $SG->satatusenabled = 1;
                $SG->kodeexternal = 'GIZI';
                $SG->namaexternal = 'GIZI';
                $SG->produkdetailfk = (float)$item['produkfk'];
                $SG->produkheadfk =  (float)$request['produkdetailfk'];
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
                // "siklus" => $SG,
                "as" => 'noname',
            );
        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'noname',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteSiklusGizi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $hapus = SiklusGizi::where('id', $request['id'])
                ->where('kdprofile', $kdProfile)
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

    public function deleteMenuGizi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $hapus = menugizidetail::where('id', $request['id'])
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

    public function SimpanMenuGizi(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $hapus = SiklusGizi::where('id', $request['id'])
                ->where('kdprofile', $kdProfile)
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
    public function saveOrderGizi(Request $request)
    {

        DB::beginTransaction();
        try {
            // return($request);
            // die;
            $item = $request['strukorder'];
            //            foreach ($request['strukorder'] as $item){
            if ($item['norec_so'] == '') {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'G' . $this->getDateTime()->format('ym'));
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
                $dataSO->isdelivered = 1;
                $dataSO->noorder = $noOrder;
                $dataSO->noorderintern = $noOrder;
            } else {
                $dataSO = StrukOrder::where('norec', $item['norec_so'])->first();
                $del = OrderPelayanan::where('strukorderfk', $item['norec_so'])->delete();
            }
            //            $dataSO->noregistrasifk = $items['noregistrasifk'];
            $dataSO->objectpegawaiorderfk = $this->getCurrentUserID();
            $dataSO->qtyjenisproduk = 1;
            $dataSO->qtyproduk = $item['qtyproduk'];
            $dataSO->objectruangantujuanfk = $this->settingDataFixed('kdRuanganGizi');
            $dataSO->keteranganorder = 'Order Gizi';
            $dataSO->objectkelompoktransaksifk = 8; /* Pelayanan Gizi*/
            $dataSO->tglorder = $item['tglorder']; // date('Y-m-d H:i:s');
            $dataSO->tglpelayananawal = $item['tglmenu']; //$item['tglorder'];
            $dataSO->totalbeamaterai = 0;
            $dataSO->totalbiayakirim = 0;
            $dataSO->totalbiayatambahan = 0;
            $dataSO->totaldiscount = 0;
            $dataSO->totalhargasatuan = 0;
            $dataSO->totalharusdibayar = 0;
            $dataSO->totalpph = 0;
            $dataSO->totalppn = 0;
            $dataSO->save();
            $dataSOnorec = $dataSO->norec;

            foreach ($item['details'] as $itemDetails) {
                $dataOP = new OrderPelayanan;
                $dataOP->norec = $dataOP->generateNewId();
                $dataOP->kdprofile = 0;
                $dataOP->statusenabled = true;
                $dataOP->iscito = 0;
                $dataOP->objectjenisdietfk = $itemDetails['objectjenisdietfk'];
                $dataOP->objectjenisdietfk1 = $itemDetails['objectjenisdietfk1'];
                $dataOP->objectjenisdietfk2 = $itemDetails['objectjenisdietfk2'];

                if (isset($item['jeniswaktufk'])) {
                    $dataOP->objectjeniswaktufk = $item['jeniswaktufk'];
                }

                $dataOP->objectkategorydietfk = $itemDetails['objectkategorydietfk'];
                //                    $dataOP->objectketerangandietfk =$itemDetails['objectprodukfk'];
                $dataOP->pagi = $itemDetails['pagi'];
                $dataOP->siang = $itemDetails['siang'];
                $dataOP->malam = $itemDetails['malam'];
                $dataOP->kalori = $itemDetails['kalori'];
                $dataOP->makanantambahan = $itemDetails['makananTambahan'];
                $dataOP->keteranganlainnya = $itemDetails['keterangan']; //'Order Gizi';
                $dataOP->keteranganlainnya_quo = 'Order Gizi';
                $dataOP->statusgizi = $item['jenisorder'];
                $dataOP->nocmfk = $itemDetails['nocmfk'];
                $dataOP->noregistrasifk = $itemDetails['norec_pd'];
                $dataOP->noorderfk = $dataSOnorec;
                $dataOP->qtyproduk = 1;
                $dataOP->qtyprodukinuse = $itemDetails['cc'];
                $dataOP->jumlah = $itemDetails['volume'];
                $dataOP->objectkelasfk = $itemDetails['objectkelasfk'];
                $dataOP->qtyprodukretur = 0;
                $dataOP->objectruanganfk =  $itemDetails['objectruanganlastfk'];
                $dataOP->objectruangantujuanfk = $this->settingDataFixed('kdRuanganGizi');;
                $dataOP->strukorderfk = $dataSOnorec;
                $dataOP->tglpelayanan = $item['tglorder'];
                $dataOP->save();
            }
            //            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Order Pelayanan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Order Pelayanan gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveOrderGiziEdit(Request $request)
    {

        DB::beginTransaction();
        try {
            // return($request);
            // die;
            $item = $request['strukorder'];
            //            foreach ($request['strukorder'] as $item){
            if ($item['norec_so'] == '') {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'G' . $this->getDateTime()->format('ym'));
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
                $dataSO->isdelivered = 1;
                $dataSO->noorder = $noOrder;
                $dataSO->noorderintern = $noOrder;
            } else {
                $dataSO = StrukOrder::where('norec', $item['norec_so'])->first();
                $norec='';
                foreach ($item['details'] as $itemDetailsx) {
                    // if($norec==''){
                    //     $norec = "'".$itemDetailsx['norecop']."'";
                    // }else{
                    //       $norec = $norec . ",'" . $itemDetailsx['norecop'] ."'";
                    // }
                    $del = OrderPelayanan::where('norec', $itemDetailsx['norecop'])->delete();
                }
                // foreach ($item['details'] as $item) {
                //     return($item['norecop']);
                //     die();
                //     $norec[] = $item['norecop'];
                //     // $kelasfk[] = (float) $item['kelasfk'];
                // }
                // return ($norec);
                // die();
                // $del = OrderPelayanan::whereIn('norec', array($norec) )->delete();
                
            }
            //            $dataSO->noregistrasifk = $items['noregistrasifk'];
            $dataSO->objectpegawaiorderfk = $this->getCurrentUserID();
            $dataSO->qtyjenisproduk = 1;
            $dataSO->qtyproduk = $item['qtyproduk'];
            $dataSO->objectruangantujuanfk = $this->settingDataFixed('kdRuanganGizi');
            $dataSO->keteranganorder = 'Order Gizi';
            $dataSO->objectkelompoktransaksifk = 8; /* Pelayanan Gizi*/
            $dataSO->tglorder = $item['tglorder']; // date('Y-m-d H:i:s');
            $dataSO->tglpelayananawal = $item['tglmenu']; //$item['tglorder'];
            $dataSO->totalbeamaterai = 0;
            $dataSO->totalbiayakirim = 0;
            $dataSO->totalbiayatambahan = 0;
            $dataSO->totaldiscount = 0;
            $dataSO->totalhargasatuan = 0;
            $dataSO->totalharusdibayar = 0;
            $dataSO->totalpph = 0;
            $dataSO->totalppn = 0;
            $dataSO->save();
            $dataSOnorec = $dataSO->norec;

            foreach ($item['details'] as $itemDetails) {
                $dataOP = new OrderPelayanan;
                $dataOP->norec = $dataOP->generateNewId();
                $dataOP->kdprofile = 0;
                $dataOP->statusenabled = true;
                $dataOP->iscito = 0;
                $dataOP->objectjenisdietfk = $itemDetails['objectjenisdietfk'];
                $dataOP->objectjenisdietfk1 = $itemDetails['objectjenisdietfk1'];
                $dataOP->objectjenisdietfk2 = $itemDetails['objectjenisdietfk2'];

                if (isset($item['jeniswaktufk'])) {
                    $dataOP->objectjeniswaktufk = $item['jeniswaktufk'];
                }

                $dataOP->objectkategorydietfk = $itemDetails['objectkategorydietfk'];
                //                    $dataOP->objectketerangandietfk =$itemDetails['objectprodukfk'];
                $dataOP->keteranganlainnya = $itemDetails['keterangan']; //'Order Gizi';
                $dataOP->keteranganlainnya_quo = 'Order Gizi';
                $dataOP->statusgizi = $item['jenisorder'];
                $dataOP->nocmfk = $itemDetails['nocmfk'];
                $dataOP->noregistrasifk = $itemDetails['norec_pd'];
                $dataOP->noorderfk = $dataSOnorec;
                $dataOP->qtyproduk = 1;
                $dataOP->pagi = $itemDetails['pagi'];
                $dataOP->siang = $itemDetails['siang'];
                $dataOP->malam = $itemDetails['malam'];
                $dataOP->kalori = $itemDetails['kalori'];
                $dataOP->makanantambahan = $itemDetails['makananTambahan'];
                $dataOP->qtyprodukinuse = $itemDetails['cc'];
                $dataOP->jumlah = $itemDetails['volume'];
                $dataOP->objectkelasfk = $itemDetails['objectkelasfk'];
                $dataOP->qtyprodukretur = 0;
                $dataOP->objectruanganfk =  $itemDetails['objectruanganlastfk'];
                $dataOP->objectruangantujuanfk = $this->settingDataFixed('kdRuanganGizi');;
                $dataOP->strukorderfk = $dataSOnorec;
                $dataOP->tglpelayanan = $item['tglorder'];
                $dataOP->save();
            }
            //            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Order Pelayanan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Order Pelayanan gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataComboBox(Request $request)
    {
        $dataLogin = $request->all();
        $dataProdukResult = [];
        $dataRuangGizi = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.id', 54)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $ruanganInap = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', [16, 35, 17])
            ->orderBy('ru.namaruangan')
            ->get();

        $dataJenisDiet = \DB::table('jenisdiet_m as jd')
            ->select('jd.id', 'jd.jenisdiet')
            ->where('jd.statusenabled', true)
            ->get();

        $dataJenisWaktu = \DB::table('jeniswaktu_m as jw')
            ->select('jw.id', 'jw.jeniswaktu')
            ->where('jw.statusenabled', true)
            ->get();

        $departemen = \DB::table('departemen_m as dept')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $dataKategoryDiet = \DB::table('kategorydiet_m as kd')
            ->select('kd.id', 'kd.kategorydiet')
            ->where('kd.statusenabled', true)
            ->get();

        $dataKelas = \DB::table('kelas_m as kls')
            ->select('kls.id', 'kls.namakelas')
            ->where('kls.statusenabled', true)
            ->get();
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->JOIN('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            //            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar')
            ->where('pr.statusenabled', true)
            ->where('kp.id', (int)$this->settingDataFixed('kdKelasNonKelasRegistrasi'))
            //            ->where('spd.qtyproduk','>',0)
            ->groupBy('pr.id', 'pr.namaproduk', 'ss.id', 'ss.satuanstandar')
            ->orderBy('pr.namaproduk')
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


        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        foreach ($departemen as $item) {
            $detail = [];
            foreach ($dataRuangan as $item2) {
                if ($item->id == $item2->objectdepartemenfk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'ruangan' => $item2->namaruangan,
                    );
                }
            }

            $dataDepartemen[] = array(
                'id' => $item->id,
                'departemen' => $item->namadepartemen,
                'ruangan' => $detail,
            );
        }
        foreach ($dataProduk as $item) {
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
            );
        }
        $dataSatuan = \DB::table('satuanstandar_m as kls')
            ->select('kls.id', 'kls.satuanstandar')
            ->where('kls.statusenabled', true)
            ->get();


        $result = array(
            'ruangGizi' => $dataRuangGizi,
            'ruanginap' => $ruanganInap,
            'kelas' => $dataKelas,
            'kelompokpasien' => $dataKelompok,
            'departemen' => $dataDepartemen,
            'jenisdiet' => $dataJenisDiet,
            'jeniswaktu' => $dataJenisWaktu,
            'kategorydiet' => $dataKategoryDiet,
            'produkkonversi' => $dataProdukResult,
            'produk' => $dataProduk,
            'satuanstandar' => $dataSatuan,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function getDataComboBox2(Request $request)
    {



        $dataLogin = $request->all();


        $ayeuna = Carbon::now()->format('H-i-s');

        $pagiawal = Carbon::now()->format('04-00-00');
        $pagiakhir = Carbon::now()->format('11-00-00');

        $malamawal = Carbon::now()->format('11-00-00');
        $malamakhir = Carbon::now()->format('23-00-00');



        $pagiawalsusulan = Carbon::now()->format('08-00-00');
        $pagiakhirsusulan = Carbon::now()->format('11-00-00');



        $malamawalsusulan = Carbon::now()->format('15-00-00');
        $malamakhirsusulan = Carbon::now()->format('16-00-00');

        $ayeuna = date($ayeuna);
        $pagiawal = date($pagiawal);
        $pagiakhir = date($pagiakhir);
        $malamawal = date($malamawal);
        $malamakhir = date($malamakhir);

        $pagiawalsusulan = date($pagiawalsusulan);
        $pagiakhirsusulan = date($pagiakhirsusulan);
        $malamawalsusulan = date($malamawalsusulan);
        $malamakhirsusulan = date($malamakhirsusulan);

        // if ($ayeuna > $pagiawal and $ayeuna < $pagiakhir) {
            $dataJenisWaktu = \DB::table('jeniswaktu_m as jw')
                ->select('jw.id', 'jw.jeniswaktu')
                ->where('jw.statusenabled', true)
                // ->where('jw.id', 1)
                ->get();
        // } elseif ($ayeuna > $malamawal and $ayeuna < $malamakhir) {
        //     $dataJenisWaktu = \DB::table('jeniswaktu_m as jw')
        //         ->select('jw.id', 'jw.jeniswaktu')
        //         ->where('jw.statusenabled', true)
        //         ->where('jw.id', 0)
        //         ->get();
        // }
        // elseif ($ayeuna > $pagiawalsusulan and $ayeuna < $pagiakhirsusulan) {
        //     $dataJenisWaktu = \DB::table('jeniswaktu_m as jw')
        //         ->select('jw.id', 'jw.jeniswaktu')
        //         ->where('jw.statusenabled', true)
        //         ->where('jw.id', 2)
        //         ->get();
        // } elseif ($ayeuna > $malamawalsusulan and $ayeuna < $malamakhirsusulan) {
        //     $dataJenisWaktu = \DB::table('jeniswaktu_m as jw')
        //         ->select('jw.id', 'jw.jeniswaktu')
        //         ->where('jw.statusenabled', true)
        //         ->where('jw.id', 3)
        //         ->get();
        // } 
        // else {
            // $result = array(
            //     'jeniswaktu' => '',
            // );

        //     return $this->respond($result);
        // }




        $result = array(
            // 'ruangGizi' => $dataRuangGizi,
            // 'ruanginap' => $ruanganInap,
            // 'kelas' => $dataKelas,
            // 'kelompokpasien' => $dataKelompok,
            // 'departemen' => $dataDepartemen,
            // 'jenisdiet' => $dataJenisDiet,
            'jeniswaktu' => $dataJenisWaktu,
            // 'kategorydiet' => $dataKategoryDiet,
            // 'produkkonversi' => $dataProdukResult,
            // 'produk' => $dataProduk,
            // 'satuanstandar' => $dataSatuan,
            // 'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function gettransaksigizi(Request $request)
    {
        // return($request['menu']);
        // die;
        // date('d-m-Y', strtotime($user->from_date));
        $tglawal =
        date('Y-m-d', strtotime($request['tglAwal']));
        
        $tglakhir =
            date('Y-m-d', strtotime($request['tglAkhir']));
  
        $data = DB::select(DB::raw(" select MenuGizi_t.norec, MenuGizi_t.tglmenu, MenuGizi_t.idproduk, MenuGizi_t.jumlah, MenuGizi_t.idjammakan, MenuGizi_t.statusenabled, MenuGizi_t.keterangan, produk_m.namaproduk, MenuGizi_t.produkfkbahan, produk_m_1.namaproduk AS bahan
FROM MenuGizi_t INNER JOIN produk_m ON MenuGizi_t.idproduk = produk_m.id INNER JOIN produk_m AS produk_m_1 ON MenuGizi_t.produkfkbahan = produk_m_1.id where MenuGizi_t.tglmenu  between '$tglawal' and '$tglakhir';                    "));
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

    public function gettransaksigizi2(Request $request)
    {
        // return($request['menu']);
        // die;
        // date('d-m-Y', strtotime($user->from_date));
        $tglawal =
            date('Y-m-d', strtotime($request['tglAwal']));

        $tglakhir =
            date('Y-m-d', strtotime($request['tglAkhir']));

        $data = DB::select(DB::raw(" select MenuGizi_t.norec, MenuGizi_t.tglmenu, MenuGizi_t.idproduk, MenuGizi_t.jumlah, MenuGizi_t.idjammakan, MenuGizi_t.statusenabled, MenuGizi_t.keterangan, produk_m.namaproduk, MenuGizi_t.produkfkbahan, produk_m_1.namaproduk AS bahan
                FROM MenuGizi_t INNER JOIN produk_m ON MenuGizi_t.idproduk = produk_m.id INNER JOIN produk_m AS produk_m_1 ON MenuGizi_t.produkfkbahan = produk_m_1.id where MenuGizi_t.tglmenu  between '$tglawal' and '$tglakhir';                    "));
        $results = [];
        $results2 = [];
        $results3 = [];
        if (count($data) > 0) {
            foreach ($data as $item) {
                if($item->idjammakan == 1){
                    $results[] = array(
                        'namaproduk' => $item->namaproduk,
                        'bahan' => $item->bahan,
                        'jumlah' => $item->jumlah,                   
                    );
                }elseif ($item->idjammakan == 2) {
                    $results2[] = array(
                        'namaproduk' => $item->namaproduk,
                        'bahan' => $item->bahan,
                        'jumlah' => $item->jumlah,
                    );
                }else{
                    $results3[] = array(
                        'namaproduk' => $item->namaproduk,
                        'bahan' => $item->bahan,
                        'jumlah' => $item->jumlah,
                    );
                }
               
            }
        }
        
        $result = array(
            "status" => 201,
            "arr" => $results,
            "arr2" => $results2,
            "ar3r" => $results3,
            "as" => 'inhuman',
        );
       
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        // return $this->respond($data);
        // $result = array(
        //     'data' => $data,
        //     'message' => '@Noname',
        // );
        // return $this->respond($result);
    }
    public function saveTindakan(Request $request)
    {

        //TODO : SAVE TINDAKAN
        DB::beginTransaction();

        try {

            foreach ($request['pelayananpasien'] as $item) {
                $PelPasien = new MenuGizi();
                $PelPasien->norec = $PelPasien->generateNewId();
                $PelPasien->tglmenu =  $item['tglpelayanan'];
                $PelPasien->idproduk =  $item['produkfk'];
                $PelPasien->jumlah =  $item['jumlah'];
                $PelPasien->idjammakan =  $item['jammakan'];
                $PelPasien->keterangan =  $item['keterangan'];
                $PelPasien->produkfkbahan =  $item['produkfkbahan'];
                $PelPasien->berat =  $item['berat'];
                $PelPasien->statusenabled = true;
                $PelPasien->save();
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
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarOrderGizi(Request $request)
    {

        $data = \DB::table('orderpelayanan_t as op')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'op.noregistrasifk')
            ->join ('antrianpasiendiperiksa_t as apd', function($join){
                $join->on('apd.noregistrasifk','=','pd.norec');
                $join->on('pd.objectruanganlastfk','=','apd.objectruanganfk');
                })
            ->join('ruangan_m as ru', 'ru.id', '=', 'op.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'op.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('strukorder_t as so', 'so.norec', '=', 'op.strukorderfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->leftjoin('strukkirim_t as sk', 'sk.norec', '=', 'op.strukkirimfk')
            ->leftjoin('jeniswaktu_m as jw', 'jw.id', '=', 'op.objectjeniswaktufk')
            ->leftjoin('jenisdiet_m as jd', 'jd.id', '=', 'op.objectjenisdietfk')
            ->leftjoin('jenisdiet_m as jd1', 'jd1.id', '=', 'op.objectjenisdietfk1')
            ->leftjoin('jenisdiet_m as jd2', 'jd2.id', '=', 'op.objectjenisdietfk2')
            ->leftjoin('kategorydiet_m as kd', 'kd.id', '=', 'op.objectkategorydietfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'op.objectkelasfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->select(
                'so.norec as norec_so',
                'op.norec as norec_op',
                'so.noorder',
                'so.tglorder',
                'so.tglpelayananawal as tglmenu',
                'pd.tglregistrasi',
                'ps.tgllahir',
                'ps.namapasien',
                'ps.nocm',
                'ps.id as nocmfk',
                'ru.namaruangan as ruanganasal',
                'jk.jeniskelamin',
                'op.objectruanganfk',
                'jw.jeniswaktu',
                'jd.jenisdiet',
                'op.strukorderfk',
                'op.objectkategorydietfk',
                'kd.kategorydiet',
                'op.qtyproduk',
                'op.objectjeniswaktufk',
                'op.objectjenisdietfk',
                'op.keteranganlainnya',
                'op.statusgizi as jenisorder',
                'op.qtyprodukinuse as cc',
                'op.jumlah as volume',
                'op.objectkelasfk',
                'kls.namakelas',
                'pd.noregistrasi',
                'so.objectpegawaiorderfk',
                'pg.namalengkap as pegawaiorder',
                'apd.nobed',
                'sk.nokirim',
                'sk.qtyproduk',
                'pd.norec as norec_pd',
                'so.objectruangantujuanfk',
                'op.strukkirimfk',
                'sk.nokirim',
                'ru2.namaruangan as ruangantujuan',
                'jw.jeniswaktu',
                // 'op.objectjeniswaktufk',
                'pd.tglpulang',
                'op.objectjenisdietfk1',
                'op.objectjenisdietfk2',
                'op.pagi',
                'op.siang',
                'op.malam',
                'op.kalori',
                'op.makanantambahan'
                // DB::raw("case when op.strukkirimfk is not null then 'Sudah Dikirim'  else '-' end as statuskirim,case when (select top (1) namadiagnosa from v_diagnosaPasien where noregistrasi = pd.noregistrasi and idjd= 1) is null then '-' else (select top (1) namadiagnosa from v_diagnosaPasien where noregistrasi = pd.noregistrasi and idjd= 1) end  as diagnosa,jd1.jenisdiet as jenisdiet1,jd2.jenisdiet as jenisdiet2 ")
            )

            ->where('so.statusenabled', true)
            ->where('so.objectkelompoktransaksifk', 8);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglpelayananawal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglpelayananawal', '<=', $tgl);
        }
        if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['deptId']);
        }

        if (isset($request['pegId']) && $request['pegId'] != "" && $request['pegId'] != "undefined") {
            $data = $data->where('so.objectpegawaiorderfk', '=', $request['pegId']);
        }
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['ruangId']);
        }
        if (isset($request['jenisDietId']) && $request['jenisDietId'] != "" && $request['jenisDietId'] != "undefined") {
            $data = $data->where('op.objectjenisdietfk', '=', $request['jenisDietId']);
        }
        if (isset($request['jenisWaktuId']) && $request['jenisWaktuId'] != "" && $request['jenisWaktuId'] != "undefined") {
            $data = $data->where('op.objectjeniswaktufk', '=', $request['jenisWaktuId']);
        }
        if (isset($request['kategoriDietId']) && $request['kategoriDietId'] != "" && $request['kategoriDietId'] != "undefined") {
            $data = $data->where('op.objectkategorydietfk', '=', $request['kategoriDietId']);
        }

        if (isset($request['noorder']) && $request['noorder'] != "" && $request['noorder'] != "undefined") {
            $data = $data->where('so.noorder', 'like', '%' . $request['noorder'] . '%');
        }

        if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'like', '%' . $request['noreg'] . '%');
        }
        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'LIKE', '%' . $request['norm'] . '%');
        }
        if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $request['nama'] . '%');
        }
        if (isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined") {
            $data = $data->take($request['jmlRows']);
        }
        // if (isset($request['isPulang']) == true) {
        //     $data = $data->whereNotNull('pd.tglpulang');
        // }

        // $data = $data->whereNull('pd.tglpulang');
        $data = $data->orderBy('so.noorder', 'ru.namaruangan');
        $data = $data->get();
        $datas = [];
        foreach ($data as $item) {
            $item->umur = $this->getAge($item->tgllahir, $item->tglregistrasi);
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $data,

        );
        return $this->respond($dataResult);
    }
    public function getDaftarOrderGizi2(Request $request)
    {
        $tglawal = $request['tglAwal'];
        $tglakhir = $request['tglAkhir'];
        $datas = [];


        $data = DB::select(
            DB::raw("
            SELECT        count(pasiendaftar_t.objectruanganlastfk) as jumlah, ruangan_m.namaruangan,pasiendaftar_t.objectruanganlastfk as objectruanganfk
            FROM            pasiendaftar_t INNER JOIN
                                     ruangan_m ON pasiendaftar_t.objectruanganlastfk = ruangan_m.id
            WHERE        (pasiendaftar_t.tglpulang IS NULL) group by ruangan_m.namaruangan,pasiendaftar_t.objectruanganlastfk")
        );
        $datapagi = DB::select(
            DB::raw("
            SELECT DISTINCT COUNT(so.norec) AS jumlah, op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            FROM            strukorder_t AS so INNER JOIN
                                     orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                                     ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                                     jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8)and objectjeniswaktufk=1 AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir') 
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            order by namaruangan")
        );
        $datamalam = DB::select(
            DB::raw("
            SELECT DISTINCT COUNT(so.norec) AS jumlah, op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            FROM            strukorder_t AS so INNER JOIN
                                     orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                                     ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                                     jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8)and objectjeniswaktufk=0  AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir')
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            order by namaruangan")
        );
        foreach ($data as $item) {
            $pagi = 0;
            $malam = 0;
            $statuspagi = 'BELUM';
            $statusmalam = 'BELUM';
            $ruangan = $item->objectruanganfk;
            foreach ($datapagi as $itemx) {
                // return ($ruangan);
                // die();
                if ($ruangan == $itemx->objectruanganfk) {

                    $pagi = $itemx->jumlah;
                }
            }
            foreach ($datamalam as $itemxx) {
                if ($ruangan == $itemxx->objectruanganfk) {
                    $malam = $itemxx->jumlah;
                }
            }
            if ($pagi == 0) {
                $statuspagi = 'BELUM';
            } elseif ($pagi >= $item->jumlah) {
                $statuspagi = 'SUDAH';
            } elseif ($pagi < $item->jumlah and $pagi != 0) {
                $statuspagi = 'KURANG';
            }

            if ($malam == 0) {
                $statusmalam = 'BELUM';
            } elseif ($malam >= $item->jumlah) {
                $statusmalam = 'SUDAH';
            } elseif ($malam < $item->jumlah and $malam != 0) {
                $statusmalam = 'KURANG';
            } else {
                $statusmalam = 'BELUM';
            };

            $result[] = array(
                'objectruanganfk' => $item->objectruanganfk,
                'namaruangan' => $item->namaruangan,
                'pagi' => $pagi,
                'malam' =>  $malam,
                'pasien' => $item->jumlah,
                'statuspagi' => $statuspagi,
                'statusmalam' => $statusmalam,

            );
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($result);
    }

    public function getDaftarOrderGizi2x(Request $request)
    {
        $tglawal = $request['tglAwal'];
        $tglakhir = $request['tglAkhir'];
        $datas = [];


        $data = DB::select(
            DB::raw("
            SELECT        count(pasiendaftar_t.objectruanganlastfk) as jumlah, ruangan_m.namaruangan,pasiendaftar_t.objectruanganlastfk as objectruanganfk
            FROM            pasiendaftar_t INNER JOIN
                                     ruangan_m ON pasiendaftar_t.objectruanganlastfk = ruangan_m.id
            WHERE        (pasiendaftar_t.tglpulang IS NULL) group by ruangan_m.namaruangan,pasiendaftar_t.objectruanganlastfk")
        );
        $datapagi = DB::select(
            DB::raw("
            SELECT DISTINCT COUNT(so.norec) AS jumlah, op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            FROM            strukorder_t AS so INNER JOIN
                                     orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                                     ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                                     jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8)and objectjeniswaktufk=2 AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir') 
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            order by namaruangan")
        );
        $datamalam = DB::select(
            DB::raw("
            SELECT DISTINCT COUNT(so.norec) AS jumlah, op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            FROM            strukorder_t AS so INNER JOIN
                                     orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                                     ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                                     jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8)and objectjeniswaktufk=3  AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir')
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu
            order by namaruangan")
        );
        foreach ($data as $item) {
            $pagi = 0;
            $malam = 0;
            $statuspagi = 'BELUM';
            $statusmalam = 'BELUM';
            $ruangan = $item->objectruanganfk;
            foreach ($datapagi as $itemx) {
                // return ($ruangan);
                // die();
                if ($ruangan == $itemx->objectruanganfk) {

                    $pagi = $itemx->jumlah;
                }
            }
            foreach ($datamalam as $itemxx) {
                if ($ruangan == $itemxx->objectruanganfk) {
                    $malam = $itemxx->jumlah;
                }
            }
            if ($pagi == 0) {
                $statuspagi = 'BELUM';
            } elseif ($pagi >= $item->jumlah) {
                $statuspagi = 'SUDAH';
            } elseif ($pagi < $item->jumlah and $pagi != 0) {
                $statuspagi = 'KURANG';
            }

            if ($malam == 0) {
                $statusmalam = 'BELUM';
            } elseif ($malam >= $item->jumlah) {
                $statusmalam = 'SUDAH';
            } elseif ($malam < $item->jumlah and $malam != 0) {
                $statusmalam = 'KURANG';
            } else {
                $statusmalam = 'BELUM';
            };

            $result[] = array(
                'objectruanganfk' => $item->objectruanganfk,
                'namaruangan' => $item->namaruangan,
                'pagi' => $pagi,
                'malam' =>  $malam,
                'pasien' => $item->jumlah,
                'statuspagi' => $statuspagi,
                'statusmalam' => $statusmalam,

            );
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($result);
    }
    public function getDaftarOrderGizi3(Request $request)
    {
        $tglawal = $request['tglAwal'];
        $tglakhir = $request['tglAkhir'];
        $objectruanganfk = $request['objectruanganfk'];
        $datas = [];
        $data = DB::select(
            DB::raw("
            SELECT        ruangan_m.namaruangan, pasien_m.namapasien, pasien_m.nocm,pasiendaftar_t.objectruanganlastfk as objectruanganfk,pasiendaftar_t.tglpulang
            FROM            pasiendaftar_t INNER JOIN
                                     ruangan_m ON pasiendaftar_t.objectruanganlastfk = ruangan_m.id INNER JOIN
                                     pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id
            WHERE        (pasiendaftar_t.tglpulang IS NULL or pasiendaftar_t.tglpulang >= '$tglawal' and pasiendaftar_t.tglpulang<= '$tglakhir') and pasiendaftar_t.objectruanganlastfk = '$objectruanganfk'
            GROUP BY ruangan_m.namaruangan, pasien_m.namapasien, pasien_m.nocm,pasiendaftar_t.objectruanganlastfk ,pasiendaftar_t.tglpulang
            ")
        );
        $datapagi = DB::select(
            DB::raw("
            SELECT DISTINCT  op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
FROM            pasien_m INNER JOIN
                         pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN
                         strukorder_t AS so INNER JOIN
                         orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                         ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                         jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id ON pasiendaftar_t.norec = op.noregistrasifk
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8) AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir') and objectjeniswaktufk=1 and ruangan_m.id='$objectruanganfk'
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu,pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
            order by namaruangan")
        );
        $datamalam = DB::select(
            DB::raw("
            SELECT DISTINCT COUNT(so.norec) AS jumlah, op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
FROM            pasien_m INNER JOIN
                         pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN
                         strukorder_t AS so INNER JOIN
                         orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                         ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                         jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id ON pasiendaftar_t.norec = op.noregistrasifk
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8) AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir') and objectjeniswaktufk=0
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
            order by namaruangan")
        );
        foreach ($data as $item) {
            $pagi = 0;
            $malam = 0;
            $statuspagi = 'BELUM';
            $statusmalam = 'BELUM';
            $ruangan = $item->objectruanganfk;
            $nocm = $item->nocm;
            $tglpelayananawalpagi = "-";
            $tglpelayananawamalam = "-";

            foreach ($datapagi as $itemx) {
                if ($nocm == $itemx->nocm) {
                    $statuspagi = 'SUDAH';
                    $tglpelayananawalpagi = $itemx->tglpelayananawal;
                };
            }
            foreach ($datamalam as $itemxx) {
                if ($nocm == $itemxx->nocm) {
                    $statusmalam = 'SUDAH';
                    $tglpelayananawamalam = $itemxx->tglpelayananawal;
                };
            }

            $tglpulang = '';
            if ($item->tglpulang != null) {
                $tglpulang = 'Sudah Pulang Jam ' . $item->tglpulang;
            }

            $result[] = array(
                'objectruanganfk' => $item->objectruanganfk,
                'namaruangan' => $item->namaruangan,
                'tglpelayananawalpagi' =>  $tglpelayananawalpagi,
                'tglpelayananawamalam' =>  $tglpelayananawamalam,
                // 'pasien' => $item->jumlah,
                'statuspagi' => $statuspagi,
                'statusmalam' => $statusmalam,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'tglpulang' => $tglpulang

            );
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($result);
    }
    public function getDaftarOrderGizi3x(Request $request)
    {
        $tglawal = $request['tglAwal'];
        $tglakhir = $request['tglAkhir'];
        $objectruanganfk = $request['objectruanganfk'];
        $datas = [];
        $data = DB::select(
            DB::raw("
            SELECT        ruangan_m.namaruangan, pasien_m.namapasien, pasien_m.nocm,pasiendaftar_t.objectruanganlastfk as objectruanganfk,pasiendaftar_t.tglpulang
            FROM            pasiendaftar_t INNER JOIN
                                     ruangan_m ON pasiendaftar_t.objectruanganlastfk = ruangan_m.id INNER JOIN
                                     pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id
            WHERE        (pasiendaftar_t.tglpulang IS NULL or pasiendaftar_t.tglpulang >= '$tglawal' and pasiendaftar_t.tglpulang<= '$tglakhir') and pasiendaftar_t.objectruanganlastfk = '$objectruanganfk'
            GROUP BY ruangan_m.namaruangan, pasien_m.namapasien, pasien_m.nocm,pasiendaftar_t.objectruanganlastfk ,pasiendaftar_t.tglpulang
            ")
        );
        $datapagi = DB::select(
            DB::raw("
            SELECT DISTINCT  op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
FROM            pasien_m INNER JOIN
                         pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN
                         strukorder_t AS so INNER JOIN
                         orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                         ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                         jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id ON pasiendaftar_t.norec = op.noregistrasifk
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8) AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir') and objectjeniswaktufk=2 and ruangan_m.id='$objectruanganfk'
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu,pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
            order by namaruangan")
        );
        $datamalam = DB::select(
            DB::raw("
            SELECT DISTINCT COUNT(so.norec) AS jumlah, op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
FROM            pasien_m INNER JOIN
                         pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN
                         strukorder_t AS so INNER JOIN
                         orderpelayanan_t AS op ON so.norec = op.noorderfk INNER JOIN
                         ruangan_m ON op.objectruanganfk = ruangan_m.id INNER JOIN
                         jeniswaktu_m ON op.objectjeniswaktufk = jeniswaktu_m.id ON pasiendaftar_t.norec = op.noregistrasifk
            WHERE        (so.statusenabled = 1) AND (so.objectkelompoktransaksifk = 8) AND (so.tglpelayananawal >= '$tglawal') AND (so.tglpelayananawal <= '$tglakhir') and objectjeniswaktufk=3
            GROUP BY op.objectruanganfk, ruangan_m.namaruangan, op.objectjeniswaktufk, jeniswaktu_m.jeniswaktu, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi,so.tglpelayananawal
            order by namaruangan")
        );
        foreach ($data as $item) {
            $pagi = 0;
            $malam = 0;
            $statuspagi = 'BELUM';
            $statusmalam = 'BELUM';
            $ruangan = $item->objectruanganfk;
            $nocm = $item->nocm;
            $tglpelayananawalpagi = "-";
            $tglpelayananawamalam = "-";

            foreach ($datapagi as $itemx) {
                if ($nocm == $itemx->nocm) {
                    $statuspagi = 'SUDAH';
                    $tglpelayananawalpagi = $itemx->tglpelayananawal;
                };
            }
            foreach ($datamalam as $itemxx) {
                if ($nocm == $itemxx->nocm) {
                    $statusmalam = 'SUDAH';
                    $tglpelayananawamalam = $itemx->tglpelayananawal;
                };
            }

            $tglpulang = '';
            if ($item->tglpulang != null) {
                $tglpulang = 'Sudah Pulang Jam ' . $item->tglpulang;
            }

            $result[] = array(
                'objectruanganfk' => $item->objectruanganfk,
                'namaruangan' => $item->namaruangan,
                'tglpelayananawalpagi' =>  $tglpelayananawalpagi,
                'tglpelayananawamalam' =>  $tglpelayananawamalam,
                // 'pasien' => $item->jumlah,
                'statuspagi' => $statuspagi,
                'statusmalam' => $statusmalam,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'tglpulang' => $tglpulang

            );
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($result);
    }
    public function deleteOrderPelayananGizi(Request $request)
    {

        DB::beginTransaction();
        try {

            if ($request['norec_op'] != 'undefined') {
                $del = OrderPelayanan::where('norec', $request['norec_op'])
                    ->delete();
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
                "message" => $transMessage,
                // "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKirimMenuGizi(Request $request)
    {
        DB::beginTransaction();
        try {
            if ($request['strukkirim']['norec_sk'] == '') {
                $noKirim = $this->generateCode(new StrukKirim, 'nokirim', 14, 'KM-' . $this->getDateTime()->format('ym'));
                $dataSK = new StrukKirim();
                $dataSK->norec = $dataSK->generateNewId();
                $dataSK->nokirim = $noKirim;
                $dataSK->kdprofile = 0;
                $dataSK->statusenabled = true;
                $dataSK->tglkirim = date('Y-m-d H:i:s');
            } else {
                $dataSK = StrukKirim::where('norec', $request['strukkirim']['norec_sk'])->first();
                $delKP = KirimProduk::where('nokirimfk', $request['strukkirim']['norec_sk'])->delete();
            }
            $dataSK->objectpegawaipengirimfk = $this->getCurrentUserID();
            $dataSK->objectruanganasalfk = $request['strukkirim']['objectruanganasalfk']; /*ruang gizi */
            $dataSK->objectruanganfk = $request['strukkirim']['objectruanganasalfk'];
            //            $dataSK->objectruangantujuanfk = $request['strukkirim']['objectruangantujuanfk'];
            $dataSK->jenispermintaanfk = 1; /*transfer */
            $dataSK->objectkelompoktransaksifk = 98;
            $dataSK->keteranganlainnyakirim = $request['strukkirim']['keterangan'];
            $dataSK->qtydetailjenisproduk = 0;
            $dataSK->qtyproduk = $request['strukkirim']['qtyproduk'];
            $dataSK->totalbeamaterai = 0;
            $dataSK->totalbiayakirim = 0;
            $dataSK->totalbiayatambahan = 0;
            $dataSK->totaldiscount = 0;
            $dataSK->totalhargasatuan = 0;
            $dataSK->totalharusdibayar = 0;
            $dataSK->totalpph = 0;
            $dataSK->totalppn = 0;
            if (isset($request['strukkirim']['norec_pd'])) {
                $dataSK->noregistrasifk = $request['strukkirim']['norec_pd'];
            }
            //            $dataSK->noregistrasifk = $request['strukkirim']['norec_pd'];
            $dataSK->save();

            $norecSK = $dataSK->norec;
            foreach ($request['strukkirim']['details'] as $items) {
                $dataKP = new KirimProduk;
                $dataKP->norec = $dataKP->generateNewId();
                $dataKP->kdprofile = 0;
                $dataKP->statusenabled = true;
                //                    $dataKP->objectasalprodukfk = $items->asalprodukfk;
                $dataKP->hargadiscount = 0;
                $dataKP->harganetto = 0;
                $dataKP->hargapph = 0;
                $dataKP->hargappn = 0;
                $dataKP->hargasatuan = 0;
                $dataKP->hargatambahan = 0;
                //                    $dataKP->hasilkonversi = $jumlah;
                $dataKP->objectprodukfk = $items['produkfk'];
                $dataKP->objectprodukkirimfk = $items['produkfk'];
                $dataKP->nokirimfk = $norecSK;
                $dataKP->persendiscount = 0;
                $dataKP->qtyproduk = $items['qtyproduk'];
                $dataKP->qtyprodukkonfirmasi = $items['qtyproduk'];
                $dataKP->qtyprodukretur = 0;
                $dataKP->qtyprodukterima = $items['qtyproduk'];
                //                    $dataKP->nostrukterimafk = $items->nostrukterimafk;
                //                    $dataKP->objectruanganfk = $request['strukkirim']['objectruangantujuanfk'];
                $dataKP->objectruanganpengirimfk = $request['strukkirim']['objectruanganasalfk'];
                $dataKP->satuan = '-';
                //                    $dataKP->objectsatuanstandarfk = $satuanstandarfk;//$item['satuanstandarfk'];
                //                    $dataKP->satuanviewfk = $item['satuanviewfk'];
                $dataKP->tglpelayanan = date('Y-m-d H:i:s');
                $dataKP->qtyprodukterimakonversi = $items['qtyproduk'];
                $dataKP->save();
            }
            if (isset($request['strukkirim']['datapasien'])) {
                foreach ($request['strukkirim']['datapasien'] as $itempasien) {
                    if (isset($itempasien['norec_op'])) {
                        $updateOp = OrderPelayanan::where('noregistrasifk', $itempasien['norec_pd'])
                            ->where('norec', $itempasien['norec_op'])
                            ->update(
                                [
                                    'strukkirimfk' => $norecSK,
                                    //                                    'objectjeniswaktufk' =>  $request['strukkirim']['objectjeniswaktufk']
                                ]
                            );
                    }
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Struk Kirim";
            DB::commit();
            $result = array(
                "status" => 201,
                "nokirim" => $dataSK,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarKirim(Request $request)
    {
        $data = \DB::table('strukkirim_t as sk')
            ->leftjoin('pasiendaftar_t as pd', 'pd.norec', '=', 'sk.noregistrasifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'sk.objectruanganasalfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'sk.objectruangantujuanfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'sk.objectpegawaipengirimfk')
            ->select(
                'sk.norec as norec_sk',
                'sk.nokirim',
                'pg.namalengkap as pegawaikirim',
                'ru2.namaruangan as ruangantujuan',
                'sk.tglkirim',
                'ru.namaruangan as ruanganasal',
                'sk.objectruangantujuanfk',
                'sk.objectruanganasalfk',
                'sk.objectpegawaipengirimfk',
                'pd.noregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'sk.keteranganlainnyakirim',
                'sk.qtyproduk'
            )
            ->where('sk.statusenabled', true)
            ->where('sk.objectkelompoktransaksifk', 98);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('sk.tglkirim', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('sk.tglkirim', '<=', $tgl);
        }

        if (isset($request['pegId']) && $request['pegId'] != "" && $request['pegId'] != "undefined") {
            $data = $data->where('sk.objectpegawaipengirimfk', '=', $request['pegId']);
        }
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $data = $data->where('sk.objectruangantujuanfk', '=', $request['ruangId']);
        }
        if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'like', '%' . $request['noreg'] . '%');
        }
        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $request['norm'] . '%');
        }
        if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $request['nama'] . '%');
        }

        if (isset($request['nokirim']) && $request['nokirim'] != "" && $request['nokirim'] != "undefined") {
            $data = $data->where('sk.nokirim', 'like', '%' . $request['nokirim'] . '%');
        }

        $data = $data->orderBy('sk.nokirim', 'desc');
        $data = $data->get();
        $result = [];
        foreach ($data as $item) {
            $details2 = DB::select(
                DB::raw("
                    select  pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk,spd.objectprodukfk as produkfk
                    from kirimproduk_t as spd
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where nokirimfk=:norec_sk and spd.qtyproduk <> 0"),
                array(
                    'norec_sk' => $item->norec_sk,
                )
            );
            $details = DB::select(
                DB::raw("
                    select  pd.nocmfk,pd.noregistrasi,ps.namapasien,ps.nocm,
                    kd.kategorydiet,jd.jenisdiet,ru.namaruangan
                  ,jw.jeniswaktu
                    from orderpelayanan_t as op 
                     JOIN pasiendaftar_t as pd on pd.norec=op.noregistrasifk
                    left JOIN pasien_m as ps on ps.id=pd.nocmfk
                    left JOIN kategorydiet_m as kd on kd.id=op.objectkategorydietfk
                    left JOIN jenisdiet_m as jd on jd.id=op.objectjenisdietfk
                    left JOIN jeniswaktu_m as jw on jw.id=op.objectjeniswaktufk
                     left JOIN ruangan_m as ru on ru.id=op.objectruanganfk
                    
                    where op.strukkirimfk=:norec_sk "),
                array(
                    'norec_sk' => $item->norec_sk,
                )
            );

            $result[] = array(
                'norec_sk' => $item->norec_sk,
                'nokirim' => $item->nokirim,
                'pegawaikirim' => $item->pegawaikirim,
                'ruangantujuan' => $item->ruangantujuan,
                'tglkirim' => $item->tglkirim,
                'ruanganasal' => $item->ruanganasal,
                'objectruangantujuanfk' => $item->objectruangantujuanfk,
                'objectruanganasalfk' =>  $item->objectruanganasalfk,
                'objectpegawaipengirimfk' => $item->objectpegawaipengirimfk,
                'noregistrasi' => $item->noregistrasi,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'keterangan' => $item->keteranganlainnyakirim,
                'qtyproduk' => $item->qtyproduk,
                'details' => $details,
                'details2' => $details2,
            );
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($dataResult);
    }
    public function updateOrderPelayananGizi(Request $request)
    {
        $detLogin = $request->all();
        DB::beginTransaction();
        try {

            if ($request['norec_op'] != 'undefined') {
                $update = OrderPelayanan::where('norec', $request['norec_op'])
                    ->update(
                        [
                            'tglpelayanan' => $request['tglpelayanan'],
                            'objectjeniswaktufk' => $request['objectjeniswaktufk'],
                            'objectprodukfk' => $request['objectprodukfk'],
                            'qtyproduk' => $request['qtyproduk'],
                            'objectjenisdietfk' => $request['objectjenisdietfk'],
                            'objectkategorydietfk' => $request['objectkategorydietfk'],
                        ]
                    );
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
                "message" => $transMessage,
                //                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteKirimMenu(Request $request)
    {
        DB::beginTransaction();
        try {
            //            $delKP = KirimProduk::where('nokirimfk',$request['norec'])->delete();
            $hapus = StrukKirim::where('norec', $request['norec'])->update(
                ['statusenabled' => false]
            );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses Batal Kirim";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Gagal Batal Kirim";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarOrderGiziDetail(Request $request)
    {

        $data = DB::table('strukorder_t as so')
            ->join('orderpelayanan_t as op', 'op.noorderfk', '=', 'so.norec')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'op.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruangantujuanfk')
            ->join('ruangan_m as ru1', 'ru1.id', '=', 'op.objectruanganfk')
            ->select(
                'so.norec',
                'so.noorder',
                'so.qtyproduk',
                'so.objectruangantujuanfk',
                'ru.namaruangan as ruangantujuan',
                'so.keteranganorder',
                'so.tglorder',
                'so.tglpelayananawal',
                'so.objectpegawaiorderfk',
                'pg.namalengkap'
            )
            ->where('so.objectkelompoktransaksifk', 8)
            ->where('so.statusenabled', true)
            ->distinct();
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            // $ruangId = ' and ru.id='.$request['ruangId'];
            $data->where('op.objectruanganfk', '=', $request['ruangId']);
        }
        if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
            // $deptId = ' and ru.objectdepartemenfk ='. $request['deptId'];
            $data->where('ru1.objectdepartemenfk', '=', $request['deptId']);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglpelayananawal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglpelayananawal', '<=', $tgl);
        }

        if (isset($request['pegId']) && $request['pegId'] != "" && $request['pegId'] != "undefined") {
            $data = $data->where('so.objectpegawaiorderfk', '=', $request['pegId']);
        }

        if (isset($request['jenisDietId']) && $request['jenisDietId'] != "" && $request['jenisDietId'] != "undefined") {
            $data = $data->where('op.objectjenisdietfk', '=', $request['jenisDietId']);
        }
        if (isset($request['jenisWaktuId']) && $request['jenisWaktuId'] != "" && $request['jenisWaktuId'] != "undefined") {
            $data = $data->where('op.objectjeniswaktufk', '=', $request['jenisWaktuId']);
        }

        if (isset($request['noorder']) && $request['noorder'] != "" && $request['noorder'] != "undefined") {
            $data = $data->where('so.noorder', 'like', '%' . $request['noorder'] . '%');
        }


        if (isset($request['pengorderId']) && $request['pengorderId'] != "" && $request['pengorderId'] != "undefined") {
            $data = $data->where('pg.id', '=', $request['pengorderId']);
        }

        if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noreg']);
        }

        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $request['norm'] . '%');
        }

        if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $request['nama'] . '%');
        }

        if (isset($request['jmlRows']) && $request['jmlRows'] != "" && $request['jmlRows'] != "undefined") {
            $data = $data->take($request['jmlRows']);
        }
        $data = $data->orderBy('so.noorder');
        $data = $data->get();
        $datas = [];
        foreach ($data as $item) {
            $norec = $item->norec;
            $deptId = '';
            $ruangId = '';
            $noreg = '';
            $norm = '';
            $nama = '';
            if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
                $deptId = ' and ru.objectdepartemenfk =' . $request['deptId'];
            }

            if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
                $ruangId = ' and ru.id=' . $request['ruangId'];
            }
            if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
                $noreg = " and pd.noregistrasi like '%" . $request['noreg']. "%'";
            }
            if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
                $norm = " and ps.nocm like '%" . $request['norm'] . "%'";
            }

            if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
                $nama = " and ps.namapasien like '%" . $request['nama'] . "%'";
            }
            $detail = DB::select(DB::raw("
                    SELECT        op.noorderfk, op.pagi,op.siang, op.malam, op.kalori, op.makanantambahan, op.objectjenisdietfk, jd.jenisdiet, op.objectjeniswaktufk, jw.jeniswaktu, op.objectkategorydietfk, kt.kategorydiet, op.keteranganlainnya, op.statusgizi AS jenisorder, op.qtyprodukinuse AS cc, op.jumlah AS volume, 
                                            op.objectkelasfk, kls.namakelas, ru.namaruangan AS ruangorder, op.objectruanganfk, ps.nocm, pd.noregistrasi, ps.namapasien, sk.nokirim, pd.norec AS norec_pd, ps.id AS nocmfk, op.norec AS norec_op, op.objectjenisdietfk1, 
                                            op.objectjenisdietfk2, jenisdiet_m.jenisdiet AS jenisdiet1, jenisdiet_m_1.jenisdiet AS jenisdiet2
                    FROM            orderpelayanan_t AS op INNER JOIN
                                     jenisdiet_m AS jd ON jd.id = op.objectjenisdietfk INNER JOIN
                                     jeniswaktu_m AS jw ON jw.id = op.objectjeniswaktufk LEFT OUTER JOIN
                                     kategorydiet_m AS kt ON kt.id = op.objectkategorydietfk INNER JOIN
                                     pasiendaftar_t AS pd ON pd.norec = op.noregistrasifk INNER JOIN
                                     antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec and pd.objectruanganlastfk = apd.objectruanganfk INNER JOIN
                                     pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
                                     kelas_m AS kls ON kls.id = op.objectkelasfk INNER JOIN
                                     ruangan_m AS ru ON ru.id = op.objectruanganfk LEFT OUTER JOIN
                                     jenisdiet_m AS jenisdiet_m_1 ON op.objectjenisdietfk2 = jenisdiet_m_1.id LEFT OUTER JOIN
                                     jenisdiet_m ON op.objectjenisdietfk1 = jenisdiet_m.id LEFT OUTER JOIN
                                     strukkirim_t AS sk ON sk.norec = op.strukkirimfk
                    where op.noorderfk='$norec'
                    $deptId
                    $ruangId
                    $norm
                     $noreg
                     $nama
                    "));
            if (count($detail) > 0) {
                $datas[] = array(
                    'norec' =>  $item->norec,
                    'noorder' =>  $item->noorder,
                    'tglorder' => $item->tglorder,
                    'objectruangantujuanfk' =>  $item->objectruangantujuanfk,
                    'ruangantujuan' =>  $item->ruangantujuan,
                    'keteranganorder' =>  $item->keteranganorder,
                    'tglmenu' =>  $item->tglpelayananawal,
                    'objectpegawaiorderfk' =>  $item->objectpegawaiorderfk,
                    'pengorder' =>  $item->namalengkap,
                    'details' => $detail
                );
            }
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $datas,

        );
        return $this->respond($dataResult);
    }
    public function updateberatgizi(Request $request)
    {
        // return($request['berat']);
        // die();

        DB::beginTransaction();
        try {

          
            menugizidetail::where('id', $request['id'])->update(
                [
                    'berat' => (float)$request['berat'],
               
                ]
            );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Order Pelayanan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function hapusOrderGzi(Request $request)
    {

        DB::beginTransaction();
        try {
            StrukOrder::where('norec', $request['norec'])->update(
                [
                    'statusenabled' => false
                ]
            );
            $transStatus = 'true';
        } catch (Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Order ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Order Pelayana";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusOrderGziPeritem(Request $request)
    {

        DB::beginTransaction();
        try {
            foreach ($request['orderpelayanan'] as $item) {
                OrderPelayanan::where('norec', $item['norec_op'])->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Order ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Order Pelayanan";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusOrderGziMenugizi(Request $request)
    {

        DB::beginTransaction();
        try {
            foreach ($request['hapus'] as $item) {
                MenuGizi::where('norec', $item['norec'])->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Menu Gizi ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Menu Gizi";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateOrderGizi(Request $request)
    {

        DB::beginTransaction();
        try {

            StrukOrder::where('norec', $request['strukorder']['norec'])->update(
                [
                    'tglpelayananawal' => $request['strukorder']['tglmenu'],
                ]
            );
            OrderPelayanan::where('norec', $request['orderpelayanan']['norec'])->update(
                [
                    'objectjeniswaktufk' => $request['orderpelayanan']['objectjeniswaktufk'],
                    'objectkategorydietfk' => $request['orderpelayanan']['objectkategorydietfk'],
                    'keteranganlainnya' => $request['orderpelayanan']['keterangan'],
                    'objectjenisdietfk' => $request['orderpelayanan']['objectjenisdietfk'],
                    'objectjenisdietfk1' => $request['orderpelayanan']['objectjenisdietfk1'],
                    'objectjenisdietfk2' => $request['orderpelayanan']['objectjenisdietfk2'],
                    'pagi' => $request['orderpelayanan']['pagi'],
                    'siang' => $request['orderpelayanan']['siang'],
                    'malam' => $request['orderpelayanan']['malam'],
                    'kalori' => $request['orderpelayanan']['kalori'],
                    'makanantambahan' => $request['orderpelayanan']['makananTambahan'],
                ]
            );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Order ";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Order Pelayanan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}
