<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 9/4/2019
 * Time: 4:53 PM
 */

namespace App\Http\Controllers\Radiologi;

use App\Http\Controllers\ApiController;
use App\Master\JenisPetugasPelaksana;
use App\Master\Produk;
use App\Master\FileDna;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\HasilPemeriksaan;
use App\Transaksi\HasilRadiologi;
use App\Transaksi\HasilRadiologiBeforeEdit;
use App\Transaksi\LisOrder;
use App\Transaksi\LisOrderTmp;
use App\Transaksi\LoggingUser;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDelete;
use App\Transaksi\PelayananPasienDetail;
use App\Master\Ruangan;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\AlasanHapus;
use App\Transaksi\RisOrder;
use App\Transaksi\StrukHasilPemeriksaan;
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
use Carbon\Carbon;
class RadiologiController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getDataComboLabRab(Request $request) {

        $dataDokter = \DB::table('pegawai_m as dp')
            ->select('dp.id','dp.namalengkap')
            ->whereIn('dp.objectjenispegawaifk',array(1))
            ->where('dp.statusenabled',true)
            ->orderBy('dp.namalengkap')
            ->get();

        $golonganDarah = \DB::table('golongandarah_m')
            ->select('id','golongandarah')
            ->where('statusenabled',true)
            ->orderBy('golongandarah')
            ->get();
         $dataruangan = \DB::table('ruangan_m as ru')           
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
           ->where('ru.statusenabled',true)
            ->get();
        $datatemplet = \DB::table('templethasil as t')           
            // ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
        //    ->where('ru.statusenabled',true)
            ->get();

        $result = array(
            'ruangan' => $dataruangan,
            'dokter' => $dataDokter,
            'golongandarah' =>   $golonganDarah,
            'datatemplet' =>   $datatemplet,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    public function getRincianPelayananLab(Request $request) {
        $pelayanan=[];
        $result=[];
        $pelayanan = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                    // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
                    //     DB::raw("so.noorder AND
                    //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
                    //     "))
            ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                    'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                    'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                    'ru.objectdepartemenfk', 'so.noorder',
                     // 'lis.no_lab as idbridging',
                    'lis.ono as idbridging',
                    'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
                    ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa, DATEDIFF(d, ps.tgllahir, GETDATE()) as umur,'Z' as flag")
                )
//                    ->where('pp.kdprofile',$idProfile)
                    ->where('ru.objectdepartemenfk', 3)
                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                        'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
                    ->orderBy('pp.tglpelayanan');
                    if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                        $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                    }
                    if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                        $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
                    }
                    if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                        $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
                    }
                    if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                        $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
                    }
                    $pelayanan = $pelayanan->get();

                    if (count($pelayanan) > 0) {
                    $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
//                    ->where('pd.kdprofile',$idProfile)
                    ->where('ptu.objectjenispetugaspefk', 4)
                    ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                    ->get();
                    $result = [];

                    // foreach ($data as $itemdata) {
                    //     // return(strpos($itemdata->hasil,","));
                    //     // die();

                    //     if(strpos($itemdata->hasil,"+") >= 0) {
                    //         // return($itemdata->hasil);
                    //         // die();
                    //         if($itemdata->nilaitext == "positif") {
                    //             $flag = '0';
                    //         } else {
                    //             $flag = '1';
                    //         }
                    //     } else if(strpos($itemdata->hasil,"-") >= 0){
                    //         if($itemdata->nilaitext == "negatif") {
                    //             $flag = '0';
                    //         } else {
                    //             $flag = '1';
                    //         }
                    //     } else if(strpos($itemdata->hasil,"<") >= 0){
                    //         $hslAr = explode('<',$itemdata->hasil);
                    //         $hsl = floatval($hslAr[1]);
                    //         if($hsl >= $itemdata->nilaimin && $hsl <= $itemdata->nilaimax) {
                    //             $flag = '0';
                    //         } else {
                    //             $flag = '1';
                    //         }
                    //     } else if(strpos($itemdata->hasil,">") >= 0){
                    //         $hslAr = explode('>',$itemdata->hasil);
                    //         $hsl = floatval($hslAr[1]);
                    //         if($hsl >= $itemdata->nilaimin  && $hsl <= $itemdata->nilaimax) {
                    //             $flag = '0';
                    //         } else {
                    //             $flag = '1';
                    //         }
                    //     } else if(strpos($itemdata->hasil,"-") >= 0){
                    //         $hslAr = explode('-',$itemdata->hasil);
                    //         $hsl0 = floatval($hslAr[0]);
                    //         $hsl1 = floatval($hslAr[1]);
                    //         if($hsl0 >= $itemdata->nilaimin && $itemdata->nilaimax <= $hsl) {
                    //             $flag = '0';
                    //         } else {
                    //             $flag = '1';
                    //         }
                    //     } else if($itemdata->nilaimin == null){
                    //         $flag = '0';
                    //     } else if($itemdata->nilaimin == ""){
                    //         $flag = '0';
                    //     } else {
                    //         if ($itemdata->nilaimin != null)
                    //     }
                    // } 

                    if (isset($request['noregistrasifk'])) {
                        $diskon = $item->hargadiscount;
                    } else {
                        $diskon = 0;
                    }
                    $NamaDokter = '-';
                    $DokterId = '';
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            $NamaDokter = $hahaha->namalengkap;
                            $DokterId = $hahaha->id;
                        }
                    }
                    $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
                //    $noorder =$item->noorder;
                //    if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))) {
                //        $order_lab = DB::select(DB::raw("
                //            select  top 1 * from order_lab where no_lab='$noorder'
                //        "));
                //        if(count($order_lab) > 0){
                //            $item->statusbridging = 'Sudah Dikirim';
                //        }else{
                //            $item->statusbridging = '-';
                //        }
                //    }
                    $result[] = array(
                        'nocm' => $item->nocm,
                        'namapasien' => $item->namapasien,
                        'jeniskelamin' => $item->jeniskelamin,
                        'tglpelayanan' => $item->tglpelayanan,
                        'produkfk' => $item->produkfk,
                        'umur' => $item->umur,
                        'namaproduk' => $item->namaproduk,
                        'jumlah' => (float)$item->jumlah,
                        'hargasatuan' => (float)$item->hargasatuan,
                        'hargadiscount' => (float)$diskon,
                        'total' => (float)$total,
                        'nostruk' => $item->nostruk,
                        'noregistrasi' => $item->noregistrasi,
                        'ruangan' => $item->namaruangan,
                        'objectruanganfk' => $item->objectruanganfk,
                        'departemen' => $item->namadepartemen,
                        'objectdepartemenfk' => $item->objectdepartemenfk,
                        'norec_apd' => $item->norec_apd,
                        'norec_sp' => $item->norec_sp,
                        'norec_pp' => $item->norec_pp,
                        'flag' => $item->flag,
                        'dokter' => $NamaDokter,
                        'dokterid' => $DokterId,
                        'noorder' => $item->noorder,
                        'idbridging' => $item->idbridging,
                        'statusbridging' => $item->statusbridging,
                        'iscito' => $item->iscito,
                        'jasa' => (float)$item->jasa,
                        'hr_norec' => $item->hr_norec,
                        'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                        'tgllahir' => $item->tgllahir,
                        'dokterpengirim' => $item->dokterpengirim,
                        'iddokterpengirim' => $item->iddokterpengirim,
                        'statusperiksa' => $item->statusperiksa,
                        'nofoto' => $item->nofoto,
                    );
                }
                
                $dataTea =array(
                    'data' => $result,
                    'message' => 'Inhuman'
                );
                return $this->respond($dataTea);
            }

            // public function getRincianPelayananLabInaCbg(Request $request) {
            //     $pelayanan=[];
            //     $result=[];
            //     $pelayanan = \DB::table('pelayananpasien_t as pp')
            //         ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            //         ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            //         ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //         ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            //         ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            //         ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            //         ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            //         ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            //         ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            //         ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
            //         ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
            //         ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
            //                 'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
            //                 'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
            //                 'ru.objectdepartemenfk', 'so.noorder',
            //                 'lis.ono as idbridging',
            //                 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
            //                 ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa, DATEDIFF(d, ps.tgllahir, GETDATE()) as umur,'Z' as flag")
            //             )
            //                 ->where('ru.objectdepartemenfk', 3)
            //                 ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
            //                     'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
            //                     'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
            //                     'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
            //                 ->orderBy('pp.tglpelayanan');
            //                 if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
            //                     $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
            //                 }
            //                 if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            //                     $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
            //                 }
            //                 if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            //                     $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
            //                 }
            //                 if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            //                     $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
            //                 }
            //                 $pelayanan = $pelayanan->get();
        
            //                 if (count($pelayanan) > 0) {
            //                 $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            //                 ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            //                 ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            //                 ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            //                 ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
            //                 ->where('ptu.objectjenispetugaspefk', 4)
            //                 ->where('pd.noregistrasi', $request['noregistrasi'])
            //                 ->get();
            //                 $result = [];
            //             foreach ($pelayanan as $item) { 
                            
            //                 $data = DB::select(DB::raw("SELECT distinct pp.noregistrasifk as norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk  ,maps.detailpemeriksaan,maps.memohasil,
            //                 maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.tipedata,nn.nilaimin,nn.nilaimax,hh.hasil,
            //                 maps.id as map_id,hh.norec as norec_hasil,maps.nourutjenispemeriksaan,maps.nourutdetail,pp.norec as norecpp,nn.nilaimin + '-' + nn.nilaimax as nilainormalstr,
            //                 hh.flag,nn.id as idnn,maps2.jeniskelaminfk,nn.metode as Metode,pp.tglpelayanan,hh.tglhasil,pg.id,pg.namalengkap,hh.hasil_s,hh.hasil_i,hh.catatan,hh.catatancetak
            //                 FROM pelayananpasien_t  as pp
            //                 inner join produk_m as prd on prd.id = pp.produkfk
            //                 inner join detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk
            //                 inner join maphasillab_m  as maps on maps.produkfk = prd.id
            //                 inner join maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id 
            //                 and maps2.jeniskelaminfk = '$item->objectjeniskelaminfk'
            //                 and maps2.kelompokumurfk in (select id from kelompokumur_m  kuu where '$item->umur' BETWEEN kuu.umurmin and kuu.umurmax)
            //                 inner join nilainormal_m  as nn on nn.id = maps2.nilainormalfk
            //                 LEFT JOIN pegawai_m AS pg ON pg.id = pp.objectpegawaipengirimfk
            //                 left join satuanstandar_m  as ss on ss.id = maps.satuanstandarfk
            //                 left join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
            //                 and pp.noregistrasifk=hh.noregistrasifk
            //                  and maps.detailpemeriksaan =hh.detailpemeriksaan  and maps.id =hh.maphasilfk 
            //                 where   pp.norec = '$item->norec_pp'  
            //                 order by  maps.nourutjenispemeriksaan,maps.nourutdetail asc"));
                            
            //                 $resultp =  array(
            //                     'data' => $data,
            //                 );
        
        
            //                 if (isset($request['noregistrasifk'])) {
            //                     $diskon = $item->hargadiscount;
            //                 } else {
            //                     $diskon = 0;
            //                 }
            //                 $NamaDokter = '-';
            //                 $DokterId = '';
            //                 foreach ($pelayananpetugas as $hahaha) {
            //                     if ($hahaha->pelayananpasien == $item->norec_pp) {
            //                         $NamaDokter = $hahaha->namalengkap;
            //                         $DokterId = $hahaha->id;
            //                     }
            //                 }
            //                 $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
        
            //                 $result[] = array(
            //                     'nocm' => $item->nocm,
            //                     'namapasien' => $item->namapasien,
            //                     'jeniskelamin' => $item->jeniskelamin,
            //                     'tglpelayanan' => $item->tglpelayanan,
            //                     'produkfk' => $item->produkfk,
            //                     'umur' => $item->umur,
            //                     'namaproduk' => $item->namaproduk,
            //                     'jumlah' => (float)$item->jumlah,
            //                     'hargasatuan' => (float)$item->hargasatuan,
            //                     'hargadiscount' => (float)$diskon,
            //                     'total' => (float)$total,
            //                     'nostruk' => $item->nostruk,
            //                     'noregistrasi' => $item->noregistrasi,
            //                     'ruangan' => $item->namaruangan,
            //                     'objectruanganfk' => $item->objectruanganfk,
            //                     'departemen' => $item->namadepartemen,
            //                     'objectdepartemenfk' => $item->objectdepartemenfk,
            //                     'norec_apd' => $item->norec_apd,
            //                     'norec_sp' => $item->norec_sp,
            //                     'norec_pp' => $item->norec_pp,
            //                     'flag' => $item->flag,
            //                     'pp' => $resultp,
            //                     'dokter' => $NamaDokter,
            //                     'dokterid' => $DokterId,
            //                     'noorder' => $item->noorder,
            //                     'idbridging' => $item->idbridging,
            //                     'statusbridging' => $item->statusbridging,
            //                     'iscito' => $item->iscito,
            //                     'jasa' => (float)$item->jasa,
            //                     'hr_norec' => $item->hr_norec,
            //                     'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
            //                     'tgllahir' => $item->tgllahir,
            //                     'dokterpengirim' => $item->dokterpengirim,
            //                     'iddokterpengirim' => $item->iddokterpengirim,
            //                     'statusperiksa' => $item->statusperiksa,
            //                     'nofoto' => $item->nofoto,
            //                 );
            //             }
            //         }
                        
            //             $dataTea =array(
            //                 'data' => $result,
            //                 'message' => 'Inhuman'
            //             );
            //             return $this->respond($dataTea);
            //         }
                     
            public function getRincianPelayananLabInaCbg(Request $request) {
                $pelayanan=[];
                $result=[];
                
                $pelayanan = \DB::table('antrianpasiendiperiksa_t as apd1')
                ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->JOIN('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganasalfk')
                ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
                //     DB::raw("so.noorder AND
                //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
                //     "))
                ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
                    'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                    'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                    'ru.objectdepartemenfk', 'so.noorder', 'ru1.namaruangan as namaruanganasal', 'pd.norec as noregistrasifk', 'pp.isclaim',
                    // 'lis.no_lab as idbridging',
                    'lis.ono as idbridging',
                    'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
                    ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa, to_char( now( ), TO_CHAR(age( now( ),  ps.tgllahir), 'YY Tahun mm Bulan DD Hari')) as umur, 'Z' as flag, case when pp.isclaim=true then 'UnClaim' else 'Claim' end as claim")
                )
        //                    ->where('pp.kdprofile',$idProfile)
                ->where('ru.objectdepartemenfk', 3)
                // ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))
                ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
                    'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan', 'pp.isclaim', 'ru1.namaruangan',
                    'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                    'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id', 'pd.norec')
                ->orderBy('pp.tglpelayanan')
                ->orderBy('pp.produkfk');
        
        
                // $pelayanan = \DB::table('antrianpasiendiperiksa_t as apd1')
                //     ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
                //     ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                //     ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                //     ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                //     ->JOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                //     ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                //     ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                //     ->JOIN('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganasalfk')
                //     ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                //     ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
                //     // ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
                //     ->leftjoin('pegawai_m as pg1', 'pg1.id', '=', 'ptu.objectpegawaifk')
                //     ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                //     ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                //     ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                //     ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                //     ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                //             'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                //             'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                //             'ru.objectdepartemenfk', 'so.noorder', 'ru1.namaruangan as namaruanganasal',
                //             'lis.ono as idbridging', 'pp.isclaim', 'pd.norec as noregistrasifk',
                //             'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim', 'pg1.namalengkap as dokterpemeriksa','pg.id as iddokterpengirim',
                //             DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa, DATEDIFF(d, ps.tgllahir, GETDATE()) as umur,'Z' as flag, case when pp.isclaim=1 then 'UnClaim' else 'Claim' end as claim")
                //         )
                //             ->where('ru.objectdepartemenfk', 3)
                //             // ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                //             //     'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan', 'ru1.namaruangan', 'pp.isclaim', 'pd.norec',
                //             //     'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                //             //     'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap', 'pg1.namalengkap','pg.id')
                //             ->where('apd.statusenabled', true)
                //             ->where('pp.statusenabled', true)
                //             ->orderBy('pp.tglpelayanan')
                //             ->orderBy('pp.produkfk');
                            if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                                $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                            }
                            if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                                $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
                            }
                            if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                                $pelayanan = $pelayanan->where('apd1.norec', '=', $request['noregistrasifk']);
                            }
                            if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                                $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
                            }
                            if (isset($request['ruid']) && $request['ruid'] != "" && $request['ruid'] != "undefined") {
                                $pelayanan = $pelayanan->where('ru.id', '=', $request['ruid']);
                            }
                            $pelayanan = $pelayanan->get();
                            
                // return($pelayanan);
                // die();
        
                            if (count($pelayanan) > 0) {
                            // $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                            // ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                            // ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                            // ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                            // ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
                            // ->where('ptu.objectjenispetugaspefk', 4)
                            // ->where('pd.noregistrasi', $request['noregistrasi'])
                            // ->get();
                            // $result = [];
                            
        
                            $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                            ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
        //                    ->where('pd.kdprofile',$idProfile)
                            ->where('ptu.objectjenispetugaspefk', 4)
                            ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                            ->get();
                            // return($pelayananpetugas);
                            // die();
                        foreach ($pelayanan as $item) { 
                            $flaglab = 'N';
                            $tglhasil = '';
                            $tglcetak = '';
                            $data = DB::select(DB::raw("SELECT distinct hh.flag, hh.tglhasil, hh.tglcetak
                            FROM pelayananpasien_t  as pp
                            left join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
                            where   pp.norec = '$item->norec_pp'"));
        
                            foreach ($data as $pp) {
                                if($pp->flag == 'Y'){
                                    $flaglab = $pp->flag;
                                    $tglhasil = $pp->tglhasil;
                                    $tglcetak = $pp->tglcetak;
                                } else {
                                    $tglhasil = $pp->tglhasil;
                                    $tglcetak = $pp->tglcetak;
                                }
                            }
                            
                            $resultp =  array(
                                'data' => $data,
                            );
        
        
                            if (isset($request['noregistrasifk'])) {
                                $diskon = $item->hargadiscount;
                            } else {
                                $diskon = 0;
                            }
                            $NamaDokter = '-';
                            $DokterId = '';
                            foreach ($pelayananpetugas as $hahaha) {
                                if ($hahaha->pelayananpasien == $item->norec_pp) {
                                    $NamaDokter = $hahaha->namalengkap;
                                    $DokterId = $hahaha->id;
                                }
                            }
                            $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
        
                            $result[] = array(
                                'nocm' => $item->nocm,
                                'namapasien' => $item->namapasien,
                                'jeniskelamin' => $item->jeniskelamin,
                                'tglpelayanan' => $item->tglpelayanan,
                                'produkfk' => $item->produkfk,
                                'umur' => $item->umur,
                                'namaproduk' => $item->namaproduk,
                                'jumlah' => (float)$item->jumlah,
                                'hargasatuan' => (float)$item->hargasatuan,
                                'hargadiscount' => (float)$diskon,
                                'total' => (float)$total,
                                'nostruk' => $item->nostruk,
                                'noregistrasi' => $item->noregistrasi,
                                'ruangan' => $item->namaruangan,
                                'namaruanganasal' => $item->namaruanganasal,
                                'objectruanganfk' => $item->objectruanganfk,
                                'departemen' => $item->namadepartemen,
                                'objectdepartemenfk' => $item->objectdepartemenfk,
                                'norec_apd' => $item->norec_apd,
                                'tglhasil' => $tglhasil,
                                'tglcetak' => $tglcetak,
                                'norec_sp' => $item->norec_sp,
                                'norec_pp' => $item->norec_pp,
                                'flag' => $item->flag,
                                'flaglab' => $flaglab, 
                                'pp' => $resultp,
                                'noregistrasifk' => $item->noregistrasifk,
                                'dokter' => $NamaDokter,
                                'dokterid' => $DokterId,
                                'noorder' => $item->noorder,
                                'idbridging' => $item->idbridging,
                                'statusbridging' => $item->statusbridging,
                                'iscito' => $item->iscito,
                                'jasa' => (float)$item->jasa,
                                'hr_norec' => $item->hr_norec,
                                'isclaim' => $item->isclaim,
                                'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                                'tgllahir' => $item->tgllahir,
                                'dokterpengirim' => $item->dokterpengirim,
                                'dokterpemeriksa' => $NamaDokter,
                                'iddokterpengirim' => $item->iddokterpengirim,
                                'statusperiksa' => $item->statusperiksa,
                                'nofoto' => $item->nofoto,
                                'claim' => $item->claim,
                            );
                        }
                    }
                        
                    $dataTea =array(
                        'data' => $result,
                        'message' => 'Inhuman'
                    );
                    return $this->respond($dataTea);
                }
                             
    public function getRincianPelayananLabAnaInaCbg(Request $request) {

        $pelayanan=[];
        $result=[];
        
        $pelayanan = \DB::table('antrianpasiendiperiksa_t as apd1')
        ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->JOIN('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganasalfk')
        ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
        ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
        // ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
        ->leftjoin('pegawai_m as pg1', 'pg1.id', '=', 'ptu.objectpegawaifk')
        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
        ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
        ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
        ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
            'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
            'ru.objectdepartemenfk', 'so.noorder',
            'lis.ono as idbridging',
            'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
            ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa")
        )
        ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))
        ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
            'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
            'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
        ->orderBy('pp.tglpelayanan')
        ->orderBy('pp.produkfk');

            if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
            }
            if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
            }
            if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                $pelayanan = $pelayanan->where('apd1.norec', '=', $request['noregistrasifk']);
            }
            if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
            }
            if (isset($request['ruid']) && $request['ruid'] != "" && $request['ruid'] != "undefined") {
                $pelayanan = $pelayanan->where('ru.id', '=', $request['ruid']);
            }
            $pelayanan = $pelayanan->get();

            if (count($pelayanan) > 0) {
                $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
                    ->where('ptu.objectjenispetugaspefk', 4)
                    ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                    ->get();


                $result = [];
                foreach ($pelayanan as $item) {
                    if (isset($request['noregistrasifk'])) {
                        $diskon = $item->hargadiscount;
                    } else {
                        $diskon = 0;
                    }
                    $NamaDokter = '-';
                    $DokterId = '';
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            $NamaDokter = $hahaha->namalengkap;
                            $DokterId = $hahaha->id;
                        }
                    }
                    $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
                    $result[] = array(
                        'nocm' => $item->nocm,
                        'namapasien' => $item->namapasien,
                        'jeniskelamin' => $item->jeniskelamin,
                        'tglpelayanan' => $item->tglpelayanan,
                        'produkfk' => $item->produkfk,
                        'namaproduk' => $item->namaproduk,
                        'namaexternal' => $item->namaexternal,
                        'jumlah' => (float)$item->jumlah,
                        'hargasatuan' => (float)$item->hargasatuan,
                        'hargadiscount' => (float)$diskon,
                        'total' => (float)$total,
                        'nostruk' => $item->nostruk,
                        'noregistrasi' => $item->noregistrasi,
                        'ruangan' => $item->namaruangan,
                        'objectruanganfk' => $item->objectruanganfk,
                        'departemen' => $item->namadepartemen,
                        'objectdepartemenfk' => $item->objectdepartemenfk,
                        'norec_apd' => $item->norec_apd,
                        'norec_sp' => $item->norec_sp,
                        'norec_pp' => $item->norec_pp,
                        'dokter' => $NamaDokter,
                        'dokterid' => $DokterId,
                        'noorder' => $item->noorder,
                        'idbridging' => $item->idbridging,
                        'statusbridging' => $item->statusbridging,
                        'iscito' => $item->iscito,
                        'jasa' => (float)$item->jasa,
                        'hr_norec' => $item->hr_norec,
                        'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                        'tgllahir' => $item->tgllahir,
                        'dokterpengirim' => $item->dokterpengirim,
                        'iddokterpengirim' => $item->iddokterpengirim,
                        'statusperiksa' => $item->statusperiksa,
                        'nofoto' => $item->nofoto,
                    );
                }
            } else {
                $result = [];
            }

            $dataTea =array(
                'data' => $result,
                'message' => 'Inhuman'
            );
            return $this->respond($dataTea);
        }

        public function getLabInaCbgGridClaim(Request $request) {
            // return($request['objectruanganfk']);
            // die();
            $data = \DB::table('antrianpasiendiperiksa_t as apd')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->select('pp.tglpelayanan', 'pp.isclaim', 'pp.isrm', DB::raw("case when pp.isclaim=true then 'UnClaim' else 'Claim' end as claim, case when pp.isrm=true then 'YES' else 'NO' end as rm"))
                ->where('pp.statusenabled', true)
                ->orderBy('pp.tglpelayanan')
                ->orderBy('pp.produkfk');
                if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                }
                if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                    $data = $data->where('ps.nocm', '=', $request['nocm']);
                }
                if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                    $data = $data->where('apd.noregistrasifk', '=', $request['noregistrasifk']);
                }
                if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                    $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
                }
                if (isset($request['objectruanganfk']) && $request['objectruanganfk'] != "" && $request['objectruanganfk'] != "undefined") {
                    $data = $data->where('apd.objectruanganfk', '=', $request['objectruanganfk']);
                }
                $data = $data->get();
            
            $result =array(
                'data' => $data,
                'message' => 'Inhuman'
            );
            return $this->respond($result);
        }

        public function getLabInaCbgGridRM(Request $request) {
            // return($request['objectruanganfk']);
            // die();
            $data = \DB::table('antrianpasiendiperiksa_t as apd')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->select('pp.tglpelayanan',   DB::raw("pp.isrm as rm,case when pp.isrm=true then 'Hapus' else 'Tambah' end as rm"))
                ->where('pp.statusenabled', true)
                ->orderBy('pp.tglpelayanan')
                ->orderBy('pp.produkfk');
                if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                }
                if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                    $data = $data->where('ps.nocm', '=', $request['nocm']);
                }
                if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                    $data = $data->where('apd.noregistrasifk', '=', $request['noregistrasifk']);
                }
                if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                    $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
                }
                if (isset($request['objectruanganfk']) && $request['objectruanganfk'] != "" && $request['objectruanganfk'] != "undefined") {
                    $data = $data->where('apd.objectruanganfk', '=', $request['objectruanganfk']);
                }
                $data = $data->get();
            
            $result =array(
                'data' => $data,
                'message' => 'Inhuman'
            );
            return $this->respond($result);
        }
        public function getRincianPelayananEMRAll(Request $request)
        {
            $result = [];
            $pelayanan = \DB::table('pelayananpasien_t as pp')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                ->leftJOIN(
                    'ris_order as ris',
                    'ris.order_no',
                    '=',
                    DB::raw('so.noorder AND ris.order_code=pp.produkfk')
                )
                ->leftJOIN(
                    'hasilradiologi_t AS hr',
                    'hr.pelayananpasienfk',
                    '=',
                    DB::raw("pp.norec AND hr.statusenabled = true ")
                )
                ->select(
                    'ps.nocm',
                    'ps.namapasien',
                    'jk.jeniskelamin',
                    'pp.tglpelayanan',
                    'pp.produkfk',
                    'pr.namaproduk',
                    'pr.namaexternal',
                    'pp.jumlah',
                    'pp.hargasatuan',
                    'pp.hargadiscount',
                    'sp.nostruk',
                    'pd.noregistrasi',
                    'ru.namaruangan',
                    'dp.namadepartemen',
                    'ps.id as psid',
                    'apd.norec as norec_apd',
                    'sp.norec as norec_sp',
                    'pp.norec as norec_pp',
                    'ru.objectdepartemenfk',
                    'so.noorder',
                    'ris.order_key as idbridging',
                    'apd.objectruanganfk',
                    'pp.iscito',
                    'pp.jasa',
                    'ps.objectjeniskelaminfk',
                    'ps.tgllahir',
                    'pg.namalengkap as dokterpengirim',
                    'pg.id as iddokterpengirim',
                    DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                    DB::raw("case when hr.nofoto is not null then hr.nofoto else '-' end as nofoto"),
                    DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                )
                ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                ->groupBy(
                    'ps.nocm',
                    'ps.namapasien',
                    'jk.jeniskelamin',
                    'pp.tglpelayanan',
                    'pp.produkfk',
                    'pr.namaproduk',
                    'pr.namaexternal',
                    'pp.jumlah',
                    'pp.hargasatuan',
                    'pp.hargadiscount',
                    'sp.nostruk',
                    'pd.noregistrasi',
                    'ru.namaruangan',
                    'dp.namadepartemen',
                    'ps.id',
                    'apd.norec',
                    'sp.norec',
                    'pp.norec',
                    'ps.objectjeniskelaminfk',
                    'ps.tgllahir',
                    'pg.namalengkap',
                    'ru.objectdepartemenfk',
                    'so.noorder',
                    'ris.order_key',
                    'apd.objectruanganfk',
                    'pp.iscito',
                    'pp.jasa',
                    'hr.norec',
                    'hr.nofoto',
                    'pg.id'
                )
                ->orderBy('pp.tglpelayanan');
            if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
            }
            if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
            }
            if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
            }
            if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
            }
            $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
            $pelayanan = $pelayanan->get();
            if (count($pelayanan) > 0) {
                $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
                    ->where('ptu.objectjenispetugaspefk', 4)
                    ->where('pd.noregistrasi', $pelayanan[0]->nocm)
                    ->get();
    
    
                $result = [];
                foreach ($pelayanan as $item) {
                    if (isset($request['noregistrasifk'])) {
                        $diskon = $item->hargadiscount;
                    } else {
                        $diskon = 0;
                    }
                    $NamaDokter = '-';
                    $DokterId = '';
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            $NamaDokter = $hahaha->namalengkap;
                            $DokterId = $hahaha->id;
                        }
                    }
                    $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah) + (float)$item->jasa;
                    $result[] = array(
                        'nocm' => $item->nocm,
                        'namapasien' => $item->namapasien,
                        'jeniskelamin' => $item->jeniskelamin,
                        'tglpelayanan' => $item->tglpelayanan,
                        'produkfk' => $item->produkfk,
                        'namaproduk' => $item->namaproduk,
                        'namaexternal' => $item->namaexternal,
                        'jumlah' => (float)$item->jumlah,
                        'hargasatuan' => (float)$item->hargasatuan,
                        'hargadiscount' => (float)$diskon,
                        'total' => (float)$total,
                        'nostruk' => $item->nostruk,
                        'noregistrasi' => $item->noregistrasi,
                        'ruangan' => $item->namaruangan,
                        'objectruanganfk' => $item->objectruanganfk,
                        'departemen' => $item->namadepartemen,
                        'objectdepartemenfk' => $item->objectdepartemenfk,
                        'norec_apd' => $item->norec_apd,
                        'norec_sp' => $item->norec_sp,
                        'norec_pp' => $item->norec_pp,
                        'dokter' => $NamaDokter,
                        'dokterid' => $DokterId,
                        'noorder' => $item->noorder,
                        'idbridging' => $item->idbridging,
                        'statusbridging' => $item->statusbridging,
                        'iscito' => $item->iscito,
                        'jasa' => (float)$item->jasa,
                        'hr_norec' => $item->hr_norec,
                        'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                        'tgllahir' => $item->tgllahir,
                        'dokterpengirim' => $item->dokterpengirim,
                        'iddokterpengirim' => $item->iddokterpengirim,
                        'statusperiksa' => $item->statusperiksa,
                        'nofoto' => $item->nofoto,
                    );
                }
            } else {
                $result = [];
            }
            $dataTea = array(
                'data' => $result,
                'message' => 'Inhuman'
            );
            return $this->respond($dataTea);
        }
        public function getLabInaCbgGridBedah(Request $request) {
            // return($request['objectruanganfk']);
            // die();
            $data = \DB::table('antrianpasiendiperiksa_t as apd')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->select('pp.tglpelayanan', 'pp.isbedah', DB::raw("case when pp.isbedah=1 then 'Hapus' else 'Tambah' end as rm"))
                ->where('pp.statusenabled', true)
                ->orderBy('pp.tglpelayanan')
                ->orderBy('pp.produkfk');
                if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                    $data = $data->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                }
                if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                    $data = $data->where('ps.nocm', '=', $request['nocm']);
                }
                if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                    $data = $data->where('apd.noregistrasifk', '=', $request['noregistrasifk']);
                }
                if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                    $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
                }
                if (isset($request['objectruanganfk']) && $request['objectruanganfk'] != "" && $request['objectruanganfk'] != "undefined") {
                    $data = $data->where('apd.objectruanganfk', '=', $request['objectruanganfk']);
                }
                $data = $data->get();
            
            $result =array(
                'data' => $data,
                'message' => 'Inhuman'
            );
            return $this->respond($result);
        }
            
    public function getRincianPelayananRad(Request $request) {
        $pelayanan=[];
        $result=[];
        $pelayanan = \DB::table('pelayananpasien_t as pp')
                    ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                    ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                    ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                    ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                    ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                    ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                    ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                        DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                    ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                        DB::raw("pp.norec AND hr.statusenabled = 'y' "))
                    // ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                    // DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                    ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                        'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key as idbridging', 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim',
                        DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                        DB::raw("case when hr.nofoto is not null then hr.nofoto else '-' end as nofoto"),
                        DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                        
                        
                        
                        )
//                    ->where('pp.kdprofile',$idProfile)

                    ->where('ru.id', 576)
                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap',
                        'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key', 'apd.objectruanganfk','pp.iscito','pp.jasa', 'hr.norec','hr.nofoto','pg.id')
                    ->orderBy('pp.tglpelayanan');
                    // if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                    //     $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                    // }
                    // if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                    //     $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
                    // }
                    if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                        $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
                    }
                    // if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                    //     $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
                    // }
                    $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
                    $pelayanan = $pelayanan->get();
                    if (count($pelayanan) > 0) {
                    $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
//                    ->where('pd.kdprofile',$idProfile)
                    ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                    ->get();
                    $result = [];
                foreach ($pelayanan as $item) {
                    if (isset($request['noregistrasifk'])) {
                        $diskon = $item->hargadiscount;
                    } else {
                        $diskon = 0;
                    }
                    $NamaDokter = '-';
                    $DokterId = '';
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            $NamaDokter = $hahaha->namalengkap;
                            $DokterId = $hahaha->id;
                        }
                    }
                    $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
                //    $noorder =$item->noorder;
                //    if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))) {
                //        $order_lab = DB::select(DB::raw("
                //            select  top 1 * from order_lab where no_lab='$noorder'
                //        "));
                //        if(count($order_lab) > 0){
                //            $item->statusbridging = 'Sudah Dikirim';
                //        }else{
                //            $item->statusbridging = '-';
                //        }
                //    }
                    $result[] = array(
                        'nocm' => $item->nocm,
                        'noregistrasi' => $item->noregistrasi,
                        'namapasien' => $item->namapasien,
                        'jeniskelamin' => $item->jeniskelamin,
                        'tglpelayanan' => $item->tglpelayanan,
                        'produkfk' => $item->produkfk,
                        'namaproduk' => $item->namaproduk,
                        'jumlah' => (float)$item->jumlah,
                        'hargasatuan' => (float)$item->hargasatuan,
                        'hargadiscount' => (float)$diskon,
                        'total' => (float)$total,
                        'nostruk' => $item->nostruk,
                        'noregistrasi' => $item->noregistrasi,
                        'ruangan' => $item->namaruangan,
                        'objectruanganfk' => $item->objectruanganfk,
                        'departemen' => $item->namadepartemen,
                        'objectdepartemenfk' => $item->objectdepartemenfk,
                        'norec_apd' => $item->norec_apd,
                        'norec_sp' => $item->norec_sp,
                        'norec_pp' => $item->norec_pp,
                        'dokter' => $NamaDokter,
                        'dokterid' => $DokterId,
                        'noorder' => $item->noorder,
                        'idbridging' => $item->idbridging,
                        'statusbridging' => $item->statusbridging,
                        'iscito' => $item->iscito,
                        'jasa' => (float)$item->jasa,
                        'hr_norec' => $item->hr_norec,
                        'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                        'tgllahir' => $item->tgllahir,
                        'dokterpengirim' => $item->dokterpengirim,
                        'iddokterpengirim' => $item->iddokterpengirim,
                        'statusperiksa' => $item->statusperiksa,
                        'nofoto' => $item->nofoto,
                    );
                }
            }
                
                $dataTea =array(
                    'data' => $result,
                    'message' => 'Inhuman'
                );
                return $this->respond($dataTea);
    }
    public function getRincianPelayanan(Request $request) {
//        $kdProfile = $this->getDataKdProfile($request);
//        $idProfile = (int) $kdProfile;
        $dataLogin=$request->all();
        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
            ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
//            ->where('mlu.kdprofile',$idProfile)
            ->where('objectloginuserfk',$dataLogin['userData']['id'])
            ->get();
        $pelayanan=[];
        $departemenfk = [];
        if(count($dataruangan) > 0 ){
            foreach ($dataruangan as $item){
                $departemenfk []  =$item->objectdepartemenfk ;
            }
        }
        $result = [];
        if(count($departemenfk) > 0 ) {
            if (in_array($this->settingDataFixed('KdDepartemenInstalasiRadiologi'), $departemenfk)) {
                $pelayanan = \DB::table('pelayananpasien_t as pp')
                    ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                    ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                    ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                    ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                    ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                    ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                    ->leftJOIN('pegawai_m as pg2', 'pg2.id', '=', 'apd.objectpegawaifk')
                    ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                        DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                    ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                        DB::raw("pp.norec AND hr.statusenabled = 'y' "))
                    // ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                    // DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                    ->select('apd.tanggalbacaradiologi','ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                        'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key as idbridging', 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir',
                    DB::raw("case when pg.id is not null then pg.id else pg2.id end as iddokterpengirim,case when pg.namalengkap is not null then pg.namalengkap  else pg2.namalengkap  end as dokterpengirim "),
                        DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                        DB::raw("case when hr.nofoto is not null then hr.nofoto when pp.nofoto is not null then pp.nofoto else '-' end as nofoto"),
                        DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                        
                        
                        
                        )
//                    ->where('pp.kdprofile',$idProfile)

                    ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap',
                        'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key', 'apd.objectruanganfk','pp.iscito','pp.jasa', 'hr.norec','hr.nofoto',
                    'pg.id',
                    'pg2.id','apd.tanggalbacaradiologi')
                    ->orderBy('pp.tglpelayanan');

            }
            if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
                $pelayanan = \DB::table('pelayananpasien_t as pp')
                    ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                    ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                    ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                    ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                    ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                    ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                    ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                    // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
                    //     DB::raw("so.noorder AND
                    //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
                    //     "))
                    ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                        'ru.objectdepartemenfk', 'so.noorder',
                        // 'lis.no_lab as idbridging',
                        'lis.ono as idbridging',
                        'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
                        ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa")
                    )
//                    ->where('pp.kdprofile',$idProfile)
                    ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))
                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                        'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
                    ->orderBy('pp.tglpelayanan');
                    //  $hasillab = \DB::table('hasillaboratorium as hs')
                    // ->where('hs.noregistrasifk', '=', $request['noregistrasifk'])->get();

                // foreach ($pelayanan as $pel) {
                //     foreach ($hasillab as $has) {
                //         if ($pel->norec == $item->norecpelayanan) {
                //             $NamaDokter = $hahaha->namalengkap;
                //             $DokterId = $hahaha->id;
                //         }
                //     }
                   
                // }

            }

            if (in_array($this->settingDataFixed('kdDepartemenElektromedik'), $departemenfk)) {
                $pelayanan = \DB::table('pelayananpasien_t as pp')
                    ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                    ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                    ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                    ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                    ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                    ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
//                    ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                    ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                        'ru.objectdepartemenfk', 'so.noorder', 'apd.objectruanganfk','pp.iscito','pp.jasa',
                        'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim',
                        DB::raw(" '-' as statusbridging,null as idbridging,'' as hr_norec,'' as nofoto,'' as statusperiksa"))
//                    ->where('pp.kdprofile',$idProfile)
                    ->where('ru.objectdepartemenfk', $this->settingDataFixed('kdDepartemenElektromedik'))
                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                        'apd.objectruanganfk','pp.iscito','pp.jasa',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
                    ->orderBy('pp.tglpelayanan');
            }

            if (in_array($this->settingDataFixed('KdDepartemenBankDarah'), $departemenfk)) {
                $pelayanan = \DB::table('pelayananpasien_t as pp')
                    ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                    ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                    ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                    ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                    ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                    ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                    ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                    ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                    ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                    // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
                    //     DB::raw("so.noorder AND
                    //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
                    //     "))
                    ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                        'ru.objectdepartemenfk', 'so.noorder',
                        // 'lis.no_lab as idbridging',
                        'lis.ono as idbridging',
                        'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
                        ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa")
                    )
//                    ->where('pp.kdprofile',$idProfile)
                    ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenBankDarah'))
                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                        'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
                    ->orderBy('pp.tglpelayanan');
            }

            if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
            }
            if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
            }
            if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
            }
            if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
            }
            $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
            $pelayanan = $pelayanan->get();
            if (count($pelayanan) > 0) {
                $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id','ptu.objectjenispetugaspefk')
//                    ->where('pd.kdprofile',$idProfile)
                    // ->where('ptu.objectjenispetugaspefk', 4)
                    ->whereIn('ptu.objectjenispetugaspefk', array(4,10))
                    ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                    // ->take(1)
                    ->get();


                $result = [];
                foreach ($pelayanan as $item) {
                    if (isset($request['noregistrasifk'])) {
                        $diskon = $item->hargadiscount;
                    } else {
                        $diskon = 0;
                    }
                    $NamaDokter = '-';
                    $DokterId = '';
                    $NamaAnalisLab = '-';
                    $AnalisLabId = '';
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            if($hahaha->objectjenispetugaspefk==4){
                                $NamaDokter = $hahaha->namalengkap;
                                $DokterId = $hahaha->id;
                            }else if($hahaha->objectjenispetugaspefk==10){
                                $NamaAnalisLab = $hahaha->namalengkap;
                                $AnalisLabId = $hahaha->id;
                            }
                        }
                    }
                    $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
                    //                    $noorder =$item->noorder;
                    //                    if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
                    //                        $order_lab = DB::select(DB::raw("
                    //                            select  top 1 * from order_lab where no_lab='$noorder'
                    //                        "));
                    //                        if(count($order_lab) > 0){
                    //                            $item->statusbridging = 'Sudah Dikirim';
                    //                        }else{
                    //                            $item->statusbridging = '-';
                    //                        }
                    //        
                 if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
                        $hasillab = \DB::table('hasillaboratorium_t as hs')
                        ->where('hs.noregistrasifk', '=', $request['noregistrasifk'])->get();
                        foreach ($hasillab as $has) {
                            if ($has->norecpelayanan == $item->norec_pp) {
                                $item->statusperiksa = 1;                               
                            }
                        }
                      }
                    
                   
                    $result[] = array(
                        'nocm' => $item->nocm,
                        'namapasien' => $item->namapasien,
                        'jeniskelamin' => $item->jeniskelamin,
                        'tglpelayanan' => $item->tglpelayanan,
                        'produkfk' => $item->produkfk,
                        'namaproduk' => $item->namaproduk,
                        'namaexternal' => $item->namaexternal,
                        'jumlah' => (float)$item->jumlah,
                        'hargasatuan' => (float)$item->hargasatuan,
                        'hargadiscount' => (float)$diskon,
                        'total' => (float)$total,
                        'nostruk' => $item->nostruk,
                        'noregistrasi' => $item->noregistrasi,
                        'ruangan' => $item->namaruangan,
                        'objectruanganfk' => $item->objectruanganfk,
                        'departemen' => $item->namadepartemen,
                        'objectdepartemenfk' => $item->objectdepartemenfk,
                        'norec_apd' => $item->norec_apd,
                        'norec_sp' => $item->norec_sp,
                        'norec_pp' => $item->norec_pp,
                        'dokter' => $NamaDokter,
                        'dokterid' => $DokterId,
                        'noorder' => $item->noorder,
                        'idbridging' => $item->idbridging,
                        'statusbridging' => $item->statusbridging,
                        'iscito' => $item->iscito,
                        'jasa' => (float)$item->jasa,
                        'hr_norec' => $item->hr_norec,
                        'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                        'tgllahir' => $item->tgllahir,
                        'dokterpengirim' => $item->dokterpengirim,
                        'iddokterpengirim' => $item->iddokterpengirim,
                        'statusperiksa' => $item->statusperiksa,
                        'nofoto' => $item->nofoto,
                        'NamaAnalisLab' => $NamaAnalisLab
                    );
                }
                if (in_array($this->settingDataFixed('KdDepartemenInstalasiRadiologi'), $departemenfk)) {
                   
                    $datahasil = \DB::table('hasilradiologi_t as hr')
                        // ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'hr.noregristrasifk')
                        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'hr.norecapd')
                       
                        ->where('hr.norecapd','=', $request['noregistrasifk'])
                        ->whereNotNull('hr.tanggalbacaradiologi')
                        ->select(                            
                            DB::raw("hr.tanggalbacaradiologi ")
                        )
                        
                        ->get();
                    foreach ($datahasil as $item) {
                        $tanggalbaca = $item->tanggalbacaradiologi;
                       
                    }
                    // return(count($datahasil));
                    // die();
                       if(count($pelayanan) ==  count($datahasil)){
                    //     return('ya');
                    // die();
                        $dataPD =  AntrianPasienDiperiksa::where('norec', $request['noregistrasifk'])->first();
                        $dataPD->tanggalbacaradiologi = $tanggalbaca;
                        $dataPD->save();
                       } else{
// return('kosong');
//                     die();
                    
                        $dataPD =  AntrianPasienDiperiksa::where('norec', $request['noregistrasifk'])->first();
                        $dataPD->tanggalbacaradiologi = null;
                        $dataPD->save();
                       }
                       
              
                    // }
                   
                }
               
            } else {
                $result = [];
            }
        }
        $dataTea =array(
            'data' => $result,
            'detaillogin' => $dataLogin,
            'message' => 'Inhuman'
        );
        return $this->respond($dataTea);
    }


    public function getWaktuPelayananRadiologi(Request $request) {
        //        $kdProfile = $this->getDataKdProfile($request);
        //        $idProfile = (int) $kdProfile;
                $dataLogin=$request->all();
                $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                    ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                    ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                    ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
        //            ->where('mlu.kdprofile',$idProfile)
                    ->where('objectloginuserfk',$dataLogin['userData']['id'])
                    ->get();
                $pelayanan=[];
                $departemenfk = [];
                if(count($dataruangan) > 0 ){
                    foreach ($dataruangan as $item){
                        $departemenfk []  =$item->objectdepartemenfk ;
                    }
                }
                $result = [];
                if(count($departemenfk) > 0 ) {
                    if (in_array($this->settingDataFixed('KdDepartemenInstalasiRadiologi'), $departemenfk)) {
                        $pelayanan = \DB::table('pelayananpasien_t as pp')
                            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                            ->JOIN('ruangan_m as ru1','ru1.id','=','apd.objectruanganasalfk')
                            // 'ru1.namaruangan as namaruanganasal',
                            ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                            ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                            ->leftJOIN('pegawai_m as pg2', 'pg2.id', '=', 'apd.objectpegawaifk')
                            ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                                DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                            ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                                DB::raw("pp.norec AND hr.statusenabled = 'y' "))
                            // ->leftJOIN('ris_order as ris', 'ris.order_no', '=',masuk
                            // DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                            ->select('apd.tglmasuk', 'hr.tanggal', 'apd.tanggalbacaradiologi','ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                                'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan', 'ru1.namaruangan as ruanganasal',
                                'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                                'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key as idbridging', 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir', 'hr.tanggalbacaradiologi', 'hr.tanggalcetak',
                            DB::raw("case when pg.id is not null then pg.id else pg2.id end as iddokterpengirim,case when pg.namalengkap is not null then pg.namalengkap  else pg2.namalengkap  end as dokterpengirim "),
                                DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                                DB::raw("case when hr.nofoto is not null then hr.nofoto when pp.nofoto is not null then pp.nofoto else '-' end as nofoto"),
                                DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                                
                                
                                
                                )
        //                    ->where('pp.kdprofile',$idProfile)
        
                            ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                            ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                                'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan', 'ru1.namaruangan',
                                'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap',
                                'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key', 'apd.objectruanganfk','pp.iscito','pp.jasa', 'hr.norec','hr.nofoto',
                            'pg.id',
                            'pg2.id','apd.tanggalbacaradiologi')
                            ->orderBy('pp.tglpelayanan');
        
                    }
                    
                    if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
                        $pelayanan = $pelayanan->where('pp.tglpelayanan','>=', $request['tglAwal']);
                    }
                    if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
                        $tgl= $request['tglAkhir'];
                        $pelayanan = $pelayanan->where('pp.tglpelayanan','<=', $tgl);
                    }

                    if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined"){
                        $pelayanan = $pelayanan->where('ps.namapasien','ilike','%'. $request['namaPasien'].'%');
                    }

                    
                    
        
                
                    $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
                    $pelayanan = $pelayanan->get();
                    if (count($pelayanan) > 0) {
                        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                            ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
        //                    ->where('pd.kdprofile',$idProfile)
                            ->where('ptu.objectjenispetugaspefk', 4)
                            ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                            // ->take(1)
                            ->get();
        
        
                        $result = [];
                        foreach ($pelayanan as $item) {
                            $diskon = 0;
                            // if (isset($request['noregistrasifk'])) {
                            //     $diskon = $item->hargadiscount;
                            // } else {
                            //     $diskon = 0;
                            // }
                            // $NamaDokter = '-';
                            // $DokterId = '';
                            // foreach ($pelayananpetugas as $hahaha) {
                            //     if ($hahaha->pelayananpasien == $item->norec_pp) {
                            //         $NamaDokter = $hahaha->namalengkap;
                            //         $DokterId = $hahaha->id;
                            //     }
                            // }
                            // $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
                            //                    $noorder =$item->noorder;
                            //                    if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
                            //                        $order_lab = DB::select(DB::raw("
                            //                            select  top 1 * from order_lab where no_lab='$noorder'
                            //                        "));
                            //                        if(count($order_lab) > 0){
                            //                            $item->statusbridging = 'Sudah Dikirim';
                            //                        }else{
                            //                            $item->statusbridging = '-';
                            //                        }
                            //        
                        //  if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
                        //         $hasillab = \DB::table('hasillaboratorium_t as hs')
                        //         ->where->get();
                        //         foreach ($hasillab as $has) {
                        //             if ($has->norecpelayanan == $item->norec_pp) {
                        //                 $item->statusperiksa = 1;                               
                        //             }
                        //         }
                            // }
                           
                            $tglpend = '';
                            if( $item->tglmasuk !='' ||  $item->tglmasuk !=null){
                                $tglpendaftaran = explode(" ", $item->tglmasuk);
                                $tglpend = $tglpendaftaran[0];
                                $jampend = $tglpendaftaran[1];
                                // tglmasuk
                            }
                           $bacaradiologi = '';
                           $tglcet = '';
                            if( $item->tanggalbacaradiologi !='' ||  $item->tanggalbacaradiologi !=null){
                                $tglbacaradiologi = explode(" ", $item->tanggalbacaradiologi);
                                $bacaradiologi = $tglbacaradiologi[1];
                                $tglcet = $tglbacaradiologi[0];
                            }
                            $tglpel = '';
                            if( $item->tglpelayanan !='' ||  $item->tglpelayanan !=null){
                                $tglpelayanan = explode(" ", $item->tglpelayanan);
                                $tglpel = $tglpelayanan[1];
                            }
                            
                            
                            // if( $item->tanggalcetak !='' ||  $item->tanggalcetak !=null){
                            //     $tanggalcetak = explode(" ", $item->tanggalcetak);
                            //     $tglcet = $tanggalcetak[0];
                            // }
                            

                            
                           
                            $result[] = array(
                                'nocm' => $item->nocm,
                                'namapasien' => $item->namapasien,
                                'jeniskelamin' => $item->jeniskelamin,
                                // 'tglpel' => $item->tglpelayanan,
                                'jampelayanan' => $tglpel,
                                'tglpendaftaran' => $tglpend,
                                
                                'jampendaftaran' =>  $jampend,
                                'produkfk' => $item->produkfk,
                                'namaproduk' => $item->namaproduk,
                                'namaexternal' => $item->namaexternal,
                                'jumlah' => (float)$item->jumlah,
                                'hargasatuan' => (float)$item->hargasatuan,
                                'hargadiscount' => (float)$diskon,
                                // 'total' => (float)$total,
                                'nostruk' => $item->nostruk,
                                'noregistrasi' => $item->noregistrasi,
                                'ruangan' => $item->namaruangan,
                                'ruanganasal' => $item->ruanganasal,
                                	
                                        // hh:mm:ss
                                'tanggalbacaradiologi' =>  $item->tanggalbacaradiologi,
                                'jamekpertise' =>  $bacaradiologi,
                               
                                // 'tanggalcetak' => $item->tanggalcetak,
                                'objectruanganfk' => $item->objectruanganfk,
                                'namaruangan' => $item->namaruangan,
                                'departemen' => $item->namadepartemen,
                                'objectdepartemenfk' => $item->objectdepartemenfk,
                                'norec_apd' => $item->norec_apd,
                                'norec_sp' => $item->norec_sp,
                                'norec_pp' => $item->norec_pp,
                                // 'dokter' => $NamaDokter,
                                // 'dokterid' => $DokterId,
                                'noorder' => $item->noorder,
                                'idbridging' => $item->idbridging,
                                'statusbridging' => $item->statusbridging,
                                'iscito' => $item->iscito,
                                'jasa' => (float)$item->jasa,
                                'hr_norec' => $item->hr_norec,
                                'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                                'tgllahir' => $item->tgllahir,
                                'dokterpengirim' => $item->dokterpengirim,
                                'iddokterpengirim' => $item->iddokterpengirim,
                                'statusperiksa' => $item->statusperiksa,
                                'nofoto' => $item->nofoto,
                            );
                        }
                       
                    } else {
                        $result = [];
                    }
                }
                $dataTea =array(
                    'data' => $result,
                    'detaillogin' => $dataLogin,
                    'message' => 'Inhuman'
                );
                return $this->respond($dataTea);
            }
            
            public function getLaporanDokterBaca(Request $request) {
                        $dataLogin=$request->all();
                        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                            ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                            ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
                            ->where('objectloginuserfk',$dataLogin['userData']['id'])
                            ->get();
                        $pelayanan=[];
                        $departemenfk = [];
                        if(count($dataruangan) > 0 ){
                            foreach ($dataruangan as $item){
                                $departemenfk []  =$item->objectdepartemenfk ;
                            }
                        }
                        $result = [];
                        if(count($departemenfk) > 0 ) {
                            if (in_array($this->settingDataFixed('KdDepartemenInstalasiRadiologi'), $departemenfk)) {
                                $pelayanan = \DB::table('pelayananpasien_t as pp')
                                    ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                                    ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                                    ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                                    ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                                    ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                                    ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                                    ->JOIN('ruangan_m as ru1','ru1.id','=','apd.objectruanganasalfk')
                                    ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                                    ->leftJoin('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
                                    ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                                    ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                                    ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                                    ->leftJOIN('pegawai_m as pg2', 'pg2.id', '=', 'apd.objectpegawaifk')
                                    ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                                        DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                                    ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                                        DB::raw("pp.norec AND hr.statusenabled = 'y' "))
                                    ->JOIN('pegawai_m as pg3', 'pg3.id', '=', 'hr.pegawaifk')
                                    ->select('pg3.namalengkap as dokterbaca','kp.kelompokpasien','hr.nofoto', 'apd.tglmasuk', 'hr.tanggal', 'apd.tanggalbacaradiologi','ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan', 'ru1.namaruangan as ruanganasal',
                                        'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                                        'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key as idbridging', 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir', 'hr.tanggalbacaradiologi', 'hr.tanggalcetak',
                                    DB::raw("case when pg.id is not null then pg.id else pg2.id end as iddokterpengirim,case when pg.namalengkap is not null then pg.namalengkap  else pg2.namalengkap  end as dokterpengirim "),
                                        DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                                        // DB::raw("case when hr.nofoto is not null then hr.nofoto when pp.nofoto is not null then pp.nofoto else '-' end as nofoto"),
                                        DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                                        
                                        
                                        
                                        )
                                    ->whereNotNull('hr.nofoto')
                                    ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan', 'ru1.namaruangan',
                                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap',
                                        'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key', 'apd.objectruanganfk','pp.iscito','pp.jasa', 'hr.norec','hr.nofoto',
                                    'pg.id', 'kp.id', 'pg3.id',
                                    'pg2.id','apd.tanggalbacaradiologi')
                                    ->orderBy('pp.tglpelayanan');
                
                            }
        
                            if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
                                $pelayanan = $pelayanan->where('apd.tanggalbacaradiologi','>=', $request['tglAwal']);
                            }
                            if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
                                $tgl= $request['tglAkhir'];
                                $pelayanan = $pelayanan->where('apd.tanggalbacaradiologi','<=', $tgl);
                            }
        
                            if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined"){
                                $pelayanan = $pelayanan->where('ps.namapasien','ilike','%'. $request['namaPasien'].'%');
                            }
        
                            
                            
                
                        
                            $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
                            $pelayanan = $pelayanan->get();
                            if (count($pelayanan) > 0) {
                                $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
                                    ->where('ptu.objectjenispetugaspefk', 4)
                                    ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                                    ->get();
                
                
                                $result = [];
                                $num = 1;
                                foreach ($pelayanan as $item) {
                                    // $diskon = 0;
                                    // $tglpend = '';
                                    // if( $item->tglmasuk !='' ||  $item->tglmasuk !=null){
                                    //     $tglpendaftaran = explode(" ", $item->tglmasuk);
                                    //     $tglpend = $tglpendaftaran[0];
                                    //     $jampend = $tglpendaftaran[1];
                                    //     // tglmasuk
                                    // }
                                //    $bacaradiologi = '';
                                   $tglcet = '';
                                    if( $item->tanggalbacaradiologi !='' ||  $item->tanggalbacaradiologi !=null){
                                        $tglbacaradiologi = explode(" ", $item->tanggalbacaradiologi);
                                        // $bacaradiologi = $tglbacaradiologi[1];
                                        $tglcet = $tglbacaradiologi[0];
                                    }
                                    // $tglpel = '';
                                    // if( $item->tglpelayanan !='' ||  $item->tglpelayanan !=null){
                                    //     $tglpelayanan = explode(" ", $item->tglpelayanan);
                                    //     $tglpel = $tglpelayanan[1];
                                    // }
                                    
                                    
                                    // if( $item->tanggalcetak !='' ||  $item->tanggalcetak !=null){
                                    //     $tanggalcetak = explode(" ", $item->tanggalcetak);
                                    //     $tglcet = $tanggalcetak[0];
                                    // }
                                    
        
                                    
                                   
                                    $result[] = array(
                                        'no' => $num,
                                        'nocm' => $item->nocm,
                                        'namapasien' => $item->namapasien,
                                        'kelompokpasien' => $item->kelompokpasien,
                                        'tanggalekpertise' =>  $tglcet,
                                        'dokterbaca' => $item->dokterbaca,
                                        'nofoto' => $item->nofoto,
                                    );
                                    $num++;
                                }
                               
                            } else {
                                $result = [];
                            }
                        }
                        $dataTea =array(
                            'data' => $result,
                            'detaillogin' => $dataLogin,
                            'message' => 'Inhuman'
                        );
                        return $this->respond($dataTea);
            }

            public function getLaporanTindakanUSG(Request $request) {
                $dataLogin=$request->all();
                // $pelayanan = \DB::table('pelayananpasien_t as pp')
                // ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                // ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                // ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                // ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                // ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                // ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                // ->JOIN('ruangan_m as ru1','ru1.id','=','apd.objectruanganasalfk')
                // ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                // ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                // ->leftJOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                // ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                // ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                // ->leftJOIN('pegawai_m as pg2', 'pg2.id', '=', 'apd.objectpegawaifk')
                // ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                //     DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                // ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                //     DB::raw("pp.norec AND hr.statusenabled = 'y' "))
                // ->leftJOIN('pegawai_m as pg3', 'pg3.id', '=', 'hr.pegawaifk')
                // ->select('pg3.namalengkap', 'pr.namaexternal as tindakan', 'ps.namapasien', 'pp.tglpelayanan','hr.tanggalbacaradiologi', 'hr.tanggalcetak',
                // DB::raw("case when pg.id is not null then pg.id else pg2.id end as iddokterpengirim,case when pg.namalengkap is not null then pg.namalengkap  else pg2.namalengkap  end as dokterpengirim "),
                //     DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                //     DB::raw("case when hr.nofoto is not null then hr.nofoto when pp.nofoto is not null then pp.nofoto else '-' end as nofoto"),
                //     DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                //     )
                // ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                // ->whereNotNull('hr.nofoto')
                // ->whereNotNull('hr.tanggalbacaradiologi')
                // ->where('ps.statusenabled', true)
                // ->where('pp.statusenabled', true)
                // ->where('pr.namaexternal', 'ilike', '%usg%')
                // ->orderBy('pp.tglpelayanan');


                // if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
                //     $pelayanan = $pelayanan->where('pp.tglpelayanan','>=', $request['tglAwal']);
                // }
                // if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
                //     $tgl= $request['tglAkhir'];
                //     $pelayanan = $pelayanan->where('pp.tglpelayanan','<=', $tgl);
                // }

                // if(isset($request['namaDokter']) && $request['namaDokter']!="" && $request['namaDokter']!="undefined"){
                //     $pelayanan = $pelayanan->where('pg3.namalengkap','ilike','%'. $request['namaDokter'].'%');
                // }
                
                // $pelayanan = $pelayanan->get();

                $tglAwal=$request['tglAwal'];
                $tglAkhir=$request['tglAkhir'];
                $pelayanan = DB::select(DB::raw("
                            select sum(x.jumlah) as jumlah,x.namalengkap,x.tindakan,x.jenispetugaspe
                FROM(
                SELECT
                    pp.jumlah,
                    jpp.jenispetugaspe,
                    pg4.namalengkap,
                    pr.namaexternal AS tindakan
                FROM
                    pelayananpasien_t AS pp
                    INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                    INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                    INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                    INNER JOIN produk_m AS pr ON pr.id = pp.produkfk
                    INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    INNER JOIN ruangan_m AS ru1 ON ru1.id = apd.objectruanganasalfk
                    INNER JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                    LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
                    LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                    LEFT JOIN strukorder_t AS so ON so.norec = pp.strukorderfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = pp.objectpegawaipengirimfk
                    LEFT JOIN pegawai_m AS pg2 ON pg2.id = apd.objectpegawaifk
                    LEFT JOIN ris_order AS ris ON ris.order_no = so.noorder 
                    AND ris.order_code = pp.produkfk
                    LEFT JOIN hasilradiologi_t AS hr ON hr.pelayananpasienfk = pp.norec 
                    AND hr.statusenabled = 'y'
                    LEFT JOIN pegawai_m AS pg3 ON pg3.id = hr.pegawaifk
                    LEFT JOIN pelayananpasienpetugas_t AS ppp ON ppp.pelayananpasien = pp.norec
                    LEFT JOIN pegawai_m AS pg4 ON pg4.id = ppp.objectpegawaifk
                    LEFT JOIN jenispetugaspelaksana_m AS jpp ON jpp.id = ppp.objectjenispetugaspefk
                WHERE
                    ru.objectdepartemenfk = 27 
                    AND hr.nofoto IS NOT NULL 
                    AND hr.tanggalbacaradiologi IS NOT NULL 
                    AND pp.tglpelayanan >= '$tglAwal' 
                    AND pp.tglpelayanan <= '$tglAkhir' 
                    and pr.namaexternal ilike '%usg%'
                    ) as x
                    GROUP BY
                    x.jumlah,
                    x.namalengkap,
                    x.tindakan,
                    x.jenispetugaspe
                "));
            //    return($pelayanan);
            //    die();
            $result=[];

                // if (count($pelayanan)> 0){
                //     $num = 1;
                    foreach ($pelayanan as $item) {
                        $result[] = array(
                            // 'no' => $num,
                            'jumlah' => $item->jumlah,
                            'namalengkap' => $item->namalengkap,
                            'jenispetugaspe' => $item->jenispetugaspe,
                            'tindakan' => $item->tindakan,
                        );
                        // $num++;
                    }
                // }else{
                //     $result = [];
                // }                
                    
                
                $dataTea =array(
                    'data' => $result,
                    'detaillogin' => $dataLogin,
                    'message' => 'Inhuman'
                );
                return $this->respond($dataTea);
            }

        public function getLaporanKinerjaPelaksanaPertindakan(Request $request) {
            $dataLogin=$request->all();
            $result = [];
            // $pelayanan = \DB::table('pelayananpasien_t as pp')
            //     ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            //     ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            //     ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //     ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            //     ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            //     ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            //     ->JOIN('ruangan_m as ru1','ru1.id','=','apd.objectruanganasalfk')
            //     ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            //     ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            //     ->leftJOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            //     ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            //     ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
            //     ->leftJOIN('pegawai_m as pg2', 'pg2.id', '=', 'apd.objectpegawaifk')
            //     ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
            //         DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
            //     ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
            //         DB::raw("pp.norec AND hr.statusenabled = 'y' "))
            //     ->leftJOIN('pegawai_m as pg3', 'pg3.id', '=', 'hr.pegawaifk')
            //     ->leftJOIN('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
            //     ->leftJOIN('pegawai_m as pg4', 'pg4.id', '=', 'ppp.objectpegawaifk')
            //     ->leftJOIN('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ppp.objectjenispetugaspefk')
            //     ->select('pp.jumlah','jpp.jenispetugaspe','pg4.namalengkap', 'pr.namaexternal as tindakan', 'ps.namapasien', 'pp.tglpelayanan','hr.tanggalbacaradiologi', 'hr.tanggalcetak',
            //     DB::raw("case when pg.id is not null then pg.id else pg2.id end as iddokterpengirim,case when pg.namalengkap is not null then pg.namalengkap  else pg2.namalengkap  end as dokterpengirim "),
            //         DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
            //         DB::raw("case when hr.nofoto is not null then hr.nofoto when pp.nofoto is not null then pp.nofoto else '-' end as nofoto"),
            //         DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
            //         )
            //     ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
            //     ->whereNotNull('hr.nofoto')
            //     ->whereNotNull('hr.tanggalbacaradiologi')
            //     ->where('ps.statusenabled', true)
            //     ->where('pp.statusenabled', true)
            //     // ->where('pr.namaexternal', 'ilike', '%usg%')
            //     ->orderBy('pp.tglpelayanan');


            //     if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            //         $pelayanan = $pelayanan->where('pp.tglpelayanan','>=', $request['tglAwal']);
            //     }
            //     if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            //         $tgl= $request['tglAkhir'];
            //         $pelayanan = $pelayanan->where('pp.tglpelayanan','<=', $tgl);
            //     }

            //     if(isset($request['namaDokter']) && $request['namaDokter']!="" && $request['namaDokter']!="undefined"){
            //         $pelayanan = $pelayanan->where('pg3.namalengkap','ilike','%'. $request['namaDokter'].'%');
            //     }
            $tglAwal=$request['tglAwal'];
            $tglAkhir=$request['tglAkhir'];
            $pelayanan = DB::select(DB::raw("
                        select sum(x.jumlah) as jumlah,x.namalengkap,x.tindakan,x.jenispetugaspe
            FROM(
            SELECT
                pp.jumlah,
                jpp.jenispetugaspe,
                pg4.namalengkap,
                pr.namaexternal AS tindakan
            FROM
                pelayananpasien_t AS pp
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                INNER JOIN produk_m AS pr ON pr.id = pp.produkfk
                INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                INNER JOIN ruangan_m AS ru1 ON ru1.id = apd.objectruanganasalfk
                INNER JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
                LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                LEFT JOIN strukorder_t AS so ON so.norec = pp.strukorderfk
                LEFT JOIN pegawai_m AS pg ON pg.id = pp.objectpegawaipengirimfk
                LEFT JOIN pegawai_m AS pg2 ON pg2.id = apd.objectpegawaifk
                LEFT JOIN ris_order AS ris ON ris.order_no = so.noorder 
                AND ris.order_code = pp.produkfk
                LEFT JOIN hasilradiologi_t AS hr ON hr.pelayananpasienfk = pp.norec 
                AND hr.statusenabled = 'y'
                LEFT JOIN pegawai_m AS pg3 ON pg3.id = hr.pegawaifk
                LEFT JOIN pelayananpasienpetugas_t AS ppp ON ppp.pelayananpasien = pp.norec
                LEFT JOIN pegawai_m AS pg4 ON pg4.id = ppp.objectpegawaifk
                LEFT JOIN jenispetugaspelaksana_m AS jpp ON jpp.id = ppp.objectjenispetugaspefk
            WHERE
                ru.objectdepartemenfk = 27 
                AND hr.nofoto IS NOT NULL 
                AND hr.tanggalbacaradiologi IS NOT NULL 
                AND pp.tglpelayanan >= '$tglAwal' 
                AND pp.tglpelayanan <= '$tglAkhir' 
                ) as x
                GROUP BY
                x.jumlah,
                x.namalengkap,
                x.tindakan,
                x.jenispetugaspe
            "));
                // return($pelayanan);
                // die();
                    // $pelayanan = $pelayanan->get();
                    // if (count($pelayanan)> 0){
                    //     $num = 1;
                        foreach ($pelayanan as $item) {
                            $result[] = array(
                                // 'no' => $num,
                                // 'tglpelayanan' => $item->tglpelayanan,
                                'namalengkap' => $item->namalengkap,
                                // 'namapasien' => $item->namapasien,
                                'tindakan' => $item->tindakan,
                                'jenispetugaspe' => $item->jenispetugaspe,
                                'jumlah' => $item->jumlah,
                            );
                            // $num++;
                        }
                    // }else{
                    //     $result = [];
                    // }         
                
                $dataTea =array(
                    'data' => $result,
                    'detaillogin' => $dataLogin,
                    'message' => 'Inhuman'
                );
                return $this->respond($dataTea);
        }

        public function getRincianPelayananEMR(Request $request) {
        //        $kdProfile = $this->getDataKdProfile($request);
        //        $idProfile = (int) $kdProfile;
        //         $dataLogin=$request->all();
        //         $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
        //             ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
        //             ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
        //             ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
        // //            ->where('mlu.kdprofile',$idProfile)
        //             ->where('objectloginuserfk',$dataLogin['userData']['id'])
        //             ->get();
        //         $pelayanan=[];
        //         $departemenfk = [];
        //         if(count($dataruangan) > 0 ){
        //             foreach ($dataruangan as $item){
        //                 $departemenfk []  =$item->objectdepartemenfk ;
        //             }
        //         }
                $result = [];
                // if(count($departemenfk) > 0 ) {
                    // if (in_array($this->settingDataFixed('KdDepartemenInstalasiRadiologi'), $departemenfk)) {
                        $pelayanan = \DB::table('pelayananpasien_t as pp')
                            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                            ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                            ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                            ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                                DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                            ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                                DB::raw("pp.norec AND hr.statusenabled = true "))
                            // ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                            // DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                            ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                                'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                                'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                                'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key as idbridging', 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim',
                                DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                                DB::raw("case when hr.nofoto is not null then hr.nofoto else '-' end as nofoto"),
                                DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                                
                                
                                
                                )
        //                    ->where('pp.kdprofile',$idProfile)
        
                            ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                            ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
                                'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                                'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap',
                                'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key', 'apd.objectruanganfk','pp.iscito','pp.jasa', 'hr.norec','hr.nofoto','pg.id')
                            ->orderBy('pp.tglpelayanan');
        
        //             }
        //             if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
        //                 $pelayanan = \DB::table('pelayananpasien_t as pp')
        //                     ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        //                     ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
        //                     ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        //                     ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        //                     ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        //                     ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //                     ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
        //                     ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        //                     ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
        //                     ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
        //                     ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
        //                     // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
        //                     //     DB::raw("so.noorder AND
        //                     //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
        //                     //     "))
        //                     ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
        //                         'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
        //                         'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
        //                         'ru.objectdepartemenfk', 'so.noorder',
        //                         // 'lis.no_lab as idbridging',
        //                         'lis.ono as idbridging',
        //                         'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
        //                         ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa")
        //                     )
        // //                    ->where('pp.kdprofile',$idProfile)
        //                     ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))
        //                     ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',  'pr.namaexternal',
        //                         'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
        //                         'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
        //                         'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
        //                     ->orderBy('pp.tglpelayanan');
        //             }
        
        //             if (in_array($this->settingDataFixed('kdDepartemenElektromedik'), $departemenfk)) {
        //                 $pelayanan = \DB::table('pelayananpasien_t as pp')
        //                     ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        //                     ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
        //                     ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        //                     ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        //                     ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        //                     ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //                     ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
        //                     ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        //                     ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
        //                     ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
        // //                    ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
        //                     ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
        //                         'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
        //                         'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
        //                         'ru.objectdepartemenfk', 'so.noorder', 'apd.objectruanganfk','pp.iscito','pp.jasa',
        //                         'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim',
        //                         DB::raw(" '-' as statusbridging,null as idbridging,'' as hr_norec,'' as nofoto,'' as statusperiksa"))
        // //                    ->where('pp.kdprofile',$idProfile)
        //                     ->where('ru.objectdepartemenfk', $this->settingDataFixed('kdDepartemenElektromedik'))
        //                     ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
        //                         'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
        //                         'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
        //                         'apd.objectruanganfk','pp.iscito','pp.jasa',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
        //                     ->orderBy('pp.tglpelayanan');
        //             }
        
        //             if (in_array($this->settingDataFixed('KdDepartemenBankDarah'), $departemenfk)) {
        //                 $pelayanan = \DB::table('pelayananpasien_t as pp')
        //                     ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        //                     ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
        //                     ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        //                     ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        //                     ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        //                     ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //                     ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
        //                     ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        //                     ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
        //                     ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
        //                     ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
        //                     // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
        //                     //     DB::raw("so.noorder AND
        //                     //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
        //                     //     "))
        //                     ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
        //                         'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
        //                         'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
        //                         'ru.objectdepartemenfk', 'so.noorder',
        //                         // 'lis.no_lab as idbridging',
        //                         'lis.ono as idbridging',
        //                         'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
        //                         ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa")
        //                     )
        // //                    ->where('pp.kdprofile',$idProfile)
        //                     ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenBankDarah'))
        //                     ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pr.namaexternal',
        //                         'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
        //                         'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
        //                         'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
        //                     ->orderBy('pp.tglpelayanan');
        //             }
        
                    if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                        $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                    }
                    if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                        $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
                    }
                    if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                        $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
                    }
                    if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                        $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
                    }
                    $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
                    $pelayanan = $pelayanan->get();
                    if (count($pelayanan) > 0) {
                        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                            ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
        //                    ->where('pd.kdprofile',$idProfile)
                            ->where('ptu.objectjenispetugaspefk', 4)
                            ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                            // ->take(1)
                            ->get();
        
        
                        $result = [];
                        foreach ($pelayanan as $item) {
                            if (isset($request['noregistrasifk'])) {
                                $diskon = $item->hargadiscount;
                            } else {
                                $diskon = 0;
                            }
                            $NamaDokter = '-';
                            $DokterId = '';
                            foreach ($pelayananpetugas as $hahaha) {
                                if ($hahaha->pelayananpasien == $item->norec_pp) {
                                    $NamaDokter = $hahaha->namalengkap;
                                    $DokterId = $hahaha->id;
                                }
                            }
                            $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
        //                    $noorder =$item->noorder;
        //                    if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
        //                        $order_lab = DB::select(DB::raw("
        //                            select  top 1 * from order_lab where no_lab='$noorder'
        //                        "));
        //                        if(count($order_lab) > 0){
        //                            $item->statusbridging = 'Sudah Dikirim';
        //                        }else{
        //                            $item->statusbridging = '-';
        //                        }
        //                    }
                            $result[] = array(
                                'nocm' => $item->nocm,
                                'namapasien' => $item->namapasien,
                                'jeniskelamin' => $item->jeniskelamin,
                                'tglpelayanan' => $item->tglpelayanan,
                                'produkfk' => $item->produkfk,
                                'namaproduk' => $item->namaproduk,
                                'namaexternal' => $item->namaexternal,
                                'jumlah' => (float)$item->jumlah,
                                'hargasatuan' => (float)$item->hargasatuan,
                                'hargadiscount' => (float)$diskon,
                                'total' => (float)$total,
                                'nostruk' => $item->nostruk,
                                'noregistrasi' => $item->noregistrasi,
                                'ruangan' => $item->namaruangan,
                                'objectruanganfk' => $item->objectruanganfk,
                                'departemen' => $item->namadepartemen,
                                'objectdepartemenfk' => $item->objectdepartemenfk,
                                'norec_apd' => $item->norec_apd,
                                'norec_sp' => $item->norec_sp,
                                'norec_pp' => $item->norec_pp,
                                'dokter' => $NamaDokter,
                                'dokterid' => $DokterId,
                                'noorder' => $item->noorder,
                                'idbridging' => $item->idbridging,
                                'statusbridging' => $item->statusbridging,
                                'iscito' => $item->iscito,
                                'jasa' => (float)$item->jasa,
                                'hr_norec' => $item->hr_norec,
                                'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                                'tgllahir' => $item->tgllahir,
                                'dokterpengirim' => $item->dokterpengirim,
                                'iddokterpengirim' => $item->iddokterpengirim,
                                'statusperiksa' => $item->statusperiksa,
                                'nofoto' => $item->nofoto,
                            );
                        }
                    } else {
                        $result = [];
                    }
                // }
                $dataTea =array(
                    'data' => $result,
                    // 'detaillogin' => $dataLogin,
                    'message' => 'Inhuman'
                );
                return $this->respond($dataTea);
            }

                         
    public function getRincianPelayananLabRM(Request $request) {
        ini_set('max_execution_time', 500); //6 minutes
        $pelayanan=[];
        $result=[];
        // $pelayanan = \DB::table('antrianpasiendiperiksa_t as apd1')
        //     ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganasalfk')
            ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
            // ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
            ->leftjoin('pegawai_m as pg1', 'pg1.id', '=', 'ptu.objectpegawaifk')
            ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
            ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                    'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                    'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                    'ru.objectdepartemenfk', 'so.noorder', 'ru1.namaruangan as namaruanganasal',
                    'lis.ono as idbridging', 'pp.isclaim', 'pd.norec as norec_pd',
                    'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim', 'pg1.namalengkap as dokterpemeriksa','pg.id as iddokterpengirim'
                    ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa, (CURRENT_DATE - ps.tgllahir::date) as umur,'Z' as flag")
                )
                    // ->where('ru.objectdepartemenfk', 3)
                    ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                        'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan', 'ru1.namaruangan', 'pp.isclaim', 'pd.norec',
                        'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                        'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap', 'pg1.namalengkap','pg.id')
                    ->orderBy('pp.tglpelayanan')
                    ->orderBy('pp.produkfk');
                    if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                        $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                    }
                    if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                        $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
                    }
                    // if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                    //     $pelayanan = $pelayanan->where('apd1.norec', '=', $request['noregistrasifk']);
                    // }
                    if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                        $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
                    }
                    if (isset($request['ruid']) && $request['ruid'] != "" && $request['ruid'] != "undefined") {
                        $pelayanan = $pelayanan->where('ru.id', '=', $request['ruid']);
                    }
                    $pelayanan = $pelayanan->get();

                    if (count($pelayanan) > 0) {
                    $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                    ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
                    ->where('ptu.objectjenispetugaspefk', 4)
                    ->where('pd.noregistrasi', $request['noregistrasi'])
                    ->get();
                    $result = [];
                foreach ($pelayanan as $item) { 
                    $flaglab = 'N';
                    $tglhasil = '';
                    $tglcetak = '';
                    $data = DB::select(DB::raw("SELECT distinct hh.flag, hh.tglhasil, hh.tglcetak
                    FROM pelayananpasien_t  as pp
                    left join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
                    where   pp.norec = '$item->norec_pp'"));

                    foreach ($data as $pp) {
                        if($pp->flag == 'Y'){
                            $flaglab = $pp->flag;
                            $tglhasil = $pp->tglhasil;
                            $tglcetak = $pp->tglcetak;
                        } else {
                            $tglhasil = $pp->tglhasil;
                            $tglcetak = $pp->tglcetak;
                        }
                    }
                    
                    $resultp =  array(
                        'data' => $data,
                    );


                    if (isset($request['noregistrasifk'])) {
                        $diskon = $item->hargadiscount;
                    } else {
                        $diskon = 0;
                    }
                    $NamaDokter = '-';
                    $DokterId = '';
                    foreach ($pelayananpetugas as $hahaha) {
                        if ($hahaha->pelayananpasien == $item->norec_pp) {
                            $NamaDokter = $hahaha->namalengkap;
                            $DokterId = $hahaha->id;
                        }
                    }
                    $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;

                    $result[] = array(
                        'nocm' => $item->nocm,
                        'namapasien' => $item->namapasien,
                        'jeniskelamin' => $item->jeniskelamin,
                        'tglpelayanan' => $item->tglpelayanan,
                        'produkfk' => $item->produkfk,
                        'umur' => $item->umur,
                        'namaproduk' => $item->namaproduk,
                        'jumlah' => (float)$item->jumlah,
                        'hargasatuan' => (float)$item->hargasatuan,
                        'hargadiscount' => (float)$diskon,
                        'total' => (float)$total,
                        'nostruk' => $item->nostruk,
                        'noregistrasi' => $item->noregistrasi,
                        'ruangan' => $item->namaruangan,
                        'namaruanganasal' => $item->namaruanganasal,
                        'objectruanganfk' => $item->objectruanganfk,
                        'departemen' => $item->namadepartemen,
                        'objectdepartemenfk' => $item->objectdepartemenfk,
                        'norec_apd' => $item->norec_apd,
                        'tglhasil' => $tglhasil,
                        'tglcetak' => $tglcetak,
                        'norec_sp' => $item->norec_sp,
                        'norec_pp' => $item->norec_pp,
                        'norec_pd' => $item->norec_pd,
                        'flag' => $item->flag,
                        'flaglab' => $flaglab, 
                        'pp' => $resultp,
                        'dokter' => $NamaDokter,
                        'dokterid' => $DokterId,
                        'noorder' => $item->noorder,
                        'idbridging' => $item->idbridging,
                        'statusbridging' => $item->statusbridging,
                        'iscito' => $item->iscito,
                        'jasa' => (float)$item->jasa,
                        'hr_norec' => $item->hr_norec,
                        'isclaim' => $item->isclaim,
                        'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                        'tgllahir' => $item->tgllahir,
                        'dokterpengirim' => $item->dokterpengirim,
                        'dokterpemeriksa' => $item->dokterpemeriksa,
                        'iddokterpengirim' => $item->iddokterpengirim,
                        'statusperiksa' => $item->statusperiksa,
                        'nofoto' => $item->nofoto,
                    );
                }
            }
                
        $dataTea =array(
            'data' => $result,
            'message' => 'Inhuman'
        );
        return $this->respond($dataTea);
    }
    public function getRincianPelayananLabRM2(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minutes
        $pelayanan = [];
        $result = [];
        // $pelayanan = \DB::table('antrianpasiendiperiksa_t as apd1')
        //     ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
        $pelayanan = \DB::table('pasiendaftar_t as pd')
        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->JOIN('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganasalfk')
        ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
        ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
        // ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
        ->leftjoin('pegawai_m as pg1', 'pg1.id', '=', 'ptu.objectpegawaifk')
        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
        ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
        ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
        ->select(
            'ps.nocm',
            'ps.namapasien',
            'jk.jeniskelamin',
            'pp.tglpelayanan',
            'pp.produkfk',
            'pr.namaproduk',
            'pp.jumlah',
            'pp.hargasatuan',
            'pp.hargadiscount',
            'sp.nostruk',
            'pd.noregistrasi',
            'ru.namaruangan',
            'dp.namadepartemen',
            'ps.id as psid',
            'apd.norec as norec_apd',
            'sp.norec as norec_sp',
            'pp.norec as norec_pp',
            'ru.objectdepartemenfk',
            'so.noorder',
            'ru1.namaruangan as namaruanganasal',
            'lis.ono as idbridging',
            'pp.isclaim',
            'pd.norec as norec_pd',
            'apd.objectruanganfk',
            'pp.iscito',
            'pp.jasa',
            'ps.objectjeniskelaminfk',
            'ps.tgllahir',
            'pg.namalengkap as dokterpengirim',
            'pg1.namalengkap as dokterpemeriksa',
            'pg.id as iddokterpengirim',
            DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa, DATE_PART('day', ps.tgllahir-NOW()) as umur,'Z' as flag")
        )
            // ->where('ru.objectdepartemenfk', 3)
            ->groupBy(
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'pp.jumlah',
                'pp.hargasatuan',
                'pp.hargadiscount',
                'sp.nostruk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ru1.namaruangan',
                'pp.isclaim',
                'pd.norec',
                'dp.namadepartemen',
                'ps.id',
                'apd.norec',
                'sp.norec',
                'pp.norec',
                'ru.objectdepartemenfk',
                'so.noorder',
                'apd.objectruanganfk',
                'pp.iscito',
                'pp.jasa',
                'lis.ono',
                'ps.objectjeniskelaminfk',
                'ps.tgllahir',
                'pg.namalengkap',
                'pg1.namalengkap',
                'pg.id'
            )
            ->orderBy('pp.tglpelayanan')
            ->orderBy('pp.produkfk');
        if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
            $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
        }
        // if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
        //     $pelayanan = $pelayanan->where('apd1.norec', '=', $request['noregistrasifk']);
        // }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['ruid']) && $request['ruid'] != "" && $request['ruid'] != "undefined") {
            $pelayanan = $pelayanan->where('ru.id', '=', $request['ruid']);
        }
        $pelayanan = $pelayanan->get();

        if (count($pelayanan) > 0) {
            $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
            ->where('ptu.objectjenispetugaspefk', 4)
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->get();
            $result = [];
            foreach ($pelayanan as $item) {
                $flaglab = 'N';
                $tglhasil = '';
                $tglcetak = '';
                // $data = DB::select(DB::raw("SELECT distinct hh.flag, hh.tglhasil, hh.tglcetak
                //     FROM pelayananpasien_t  as pp
                //     left join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
                //     where   pp.norec = '$item->norec_pp'"));

                // foreach ($data as $pp) {
                //     if ($pp->flag == 'Y') {
                // $flaglab = $pp->flag;
                // $tglhasil = $pp->tglhasil;
                // $tglcetak = $pp->tglcetak;
                //     } else {
                //         $tglhasil = $pp->tglhasil;
                //         $tglcetak = $pp->tglcetak;
                //     }
                // }
                // $data='';
                $data[] = array(
                    'flaglab' => "",
                    'tglhasil' => "",
                    'tglcetak' => ""
                );
                $resultp =  array(
                    'data' => $data,
                );


                if (isset($request['noregistrasifk'])) {
                    $diskon = $item->hargadiscount;
                } else {
                    $diskon = 0;
                }
                $NamaDokter = '-';
                $DokterId = '';
                foreach ($pelayananpetugas as $hahaha) {
                    if ($hahaha->pelayananpasien == $item->norec_pp) {
                        $NamaDokter = $hahaha->namalengkap;
                        $DokterId = $hahaha->id;
                    }
                }
                $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah) + (float)$item->jasa;

                $result[] = array(
                    'nocm' => $item->nocm,
                    'namapasien' => $item->namapasien,
                    'jeniskelamin' => $item->jeniskelamin,
                    'tglpelayanan' => $item->tglpelayanan,
                    'produkfk' => $item->produkfk,
                    'umur' => $item->umur,
                    'namaproduk' => $item->namaproduk,
                    'jumlah' => (float)$item->jumlah,
                    'hargasatuan' => (float)$item->hargasatuan,
                    'hargadiscount' => (float)$diskon,
                    'total' => (float)$total,
                    'nostruk' => $item->nostruk,
                    'noregistrasi' => $item->noregistrasi,
                    'ruangan' => $item->namaruangan,
                    'namaruanganasal' => $item->namaruanganasal,
                    'objectruanganfk' => $item->objectruanganfk,
                    'departemen' => $item->namadepartemen,
                    'objectdepartemenfk' => $item->objectdepartemenfk,
                    'norec_apd' => $item->norec_apd,
                    'tglhasil' => $tglhasil,
                    'tglcetak' => $tglcetak,
                    'norec_sp' => $item->norec_sp,
                    'norec_pp' => $item->norec_pp,
                    'norec_pd' => $item->norec_pd,
                    'flag' => $item->flag,
                    'flaglab' => $flaglab,
                    'pp' => $resultp,
                    'dokter' => $NamaDokter,
                    'dokterid' => $DokterId,
                    'noorder' => $item->noorder,
                    'idbridging' => $item->idbridging,
                    'statusbridging' => $item->statusbridging,
                    'iscito' => $item->iscito,
                    'jasa' => (float)$item->jasa,
                    'hr_norec' => $item->hr_norec,
                    'isclaim' => $item->isclaim,
                    'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                    'tgllahir' => $item->tgllahir,
                    'dokterpengirim' => $item->dokterpengirim,
                    'dokterpemeriksa' => $item->dokterpemeriksa,
                    'iddokterpengirim' => $item->iddokterpengirim,
                    'statusperiksa' => $item->statusperiksa,
                    'nofoto' => $item->nofoto,
                );
            }
        }

        $dataTea = array(
            'data' => $result,
            'message' => 'Inhuman'
        );
        return $this->respond($dataTea);
    }
    public function getRincianPelayananLabRM2hasil(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minutes


        if (isset($request->nocm) && $request->nocm != "" && $request->nocm != "undefined") {
            $data = DB::select(DB::raw("SELECT DISTINCT hh.flag, hh.tglhasil, hh.tglcetak, pasiendaftar_t.noregistrasi, pp.norec,antrianpasiendiperiksa_t.objectruanganfk
            FROM            pelayananpasien_t AS pp INNER JOIN
                                    antrianpasiendiperiksa_t ON pp.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN
                                    pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec inner JOIN
                                    hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec
                                    inner join pasien_m as ps on ps.id = pasiendaftar_t.nocmfk
            WHERE        (ps.nocm = '$request->nocm') and antrianpasiendiperiksa_t.objectruanganfk='575'
            order by pp.norec,hh.flag "));
        } else {
            $data = DB::select(DB::raw("SELECT DISTINCT hh.flag, hh.tglhasil, hh.tglcetak, pasiendaftar_t.noregistrasi, pp.norec,antrianpasiendiperiksa_t.objectruanganfk
            FROM            pelayananpasien_t AS pp INNER JOIN
                                    antrianpasiendiperiksa_t ON pp.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN
                                    pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec inner JOIN
                                    hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec
            WHERE        (pasiendaftar_t.noregistrasi = '$request->noregistrasi') and antrianpasiendiperiksa_t.objectruanganfk='575'
            order by pp.norec,hh.flag "));
        }


        $dataTea = array(
            'data' => $data,
            'message' => 'Inhuman'
        );
        return $this->respond($dataTea);
    }
    public function getRincianPelayananInaCbg(Request $request) {
    //        $kdProfile = $this->getDataKdProfile($request);
    //        $idProfile = (int) $kdProfile;
            $dataLogin=$request->all();
            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
    //            ->where('mlu.kdprofile',$idProfile)
                ->where('objectloginuserfk',$dataLogin['userData']['id'])
                ->get();
            $pelayanan=[];
            $departemenfk = [];
            if(count($dataruangan) > 0 ){
                foreach ($dataruangan as $item){
                    $departemenfk []  =$item->objectdepartemenfk ;
                }
            }
            $result = [];
            if(count($departemenfk) > 0 ) {
                if (in_array($this->settingDataFixed('KdDepartemenInstalasiRadiologi'), $departemenfk)) {
                    $pelayanan = 
                        // \DB::table('pelayananpasien_t as pp')
                        // ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                        // ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                        // ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        \DB::table('antrianpasiendiperiksa_t as apd1')
                        ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
                        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                        ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                        ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                        ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                        ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                            DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                        ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                            DB::raw("pp.norec AND hr.statusenabled = 1 "))
                        // ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                        // DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                        ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                            'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                            'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key as idbridging', 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim', 'pp.isclaim', 'pd.norec as noregistrasifk',
                            DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                            DB::raw("case when hr.nofoto is not null then hr.nofoto else '-' end as nofoto"),
                            DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                            
                            
                            
                            )
    //                    ->where('pp.kdprofile',$idProfile)
    
                        ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                        ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                            'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap', 'pp.isclaim', 'pd.norec',
                            'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key', 'apd.objectruanganfk','pp.iscito','pp.jasa', 'hr.norec','hr.nofoto','pg.id')
                        ->orderBy('pp.tglpelayanan')
                        ->orderBy('pp.produkfk');
    
                }
                // return($pelayanan);
                // die();
                if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
                    $pelayanan = 
                        // \DB::table('pelayananpasien_t as pp')
                        // ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                        // ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                        // ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        \DB::table('antrianpasiendiperiksa_t as apd1')
                        ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
                        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                        ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                        ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                        ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                        ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                        // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
                        //     DB::raw("so.noorder AND
                        //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
                        //     "))
                        ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                            'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                            'ru.objectdepartemenfk', 'so.noorder','pp.isclaim', 'pd.norec as noregistrasifk',
                            // 'lis.no_lab as idbridging',
                            'lis.ono as idbridging',
                            'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
                            ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa")
                        )
    //                    ->where('pp.kdprofile',$idProfile)
                        ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))
                        ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan','pp.isclaim', 'pd.norec',
                            'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                            'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
                        ->orderBy('pp.tglpelayanan')
                        ->orderBy('pp.produkfk');
                }
    
                if (in_array($this->settingDataFixed('kdDepartemenElektromedik'), $departemenfk)) {
                    $pelayanan = 
                        // \DB::table('pelayananpasien_t as pp')
                        // ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                        // ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                        // ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        \DB::table('antrianpasiendiperiksa_t as apd1')
                        ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
                        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                        ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                        ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                        ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
    //                    ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                        ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pd.norec as noregistrasifk',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                            'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                            'ru.objectdepartemenfk', 'so.noorder', 'apd.objectruanganfk','pp.iscito','pp.jasa','pp.isclaim',
                            'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim',
                            DB::raw(" '-' as statusbridging,null as idbridging,'' as hr_norec,'' as nofoto,'' as statusperiksa"))
    //                    ->where('pp.kdprofile',$idProfile)
                        ->where('ru.objectdepartemenfk', $this->settingDataFixed('kdDepartemenElektromedik'))
                        ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk', 'pd.norec',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan','pp.isclaim',
                            'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                            'apd.objectruanganfk','pp.iscito','pp.jasa',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
                        ->orderBy('pp.tglpelayanan')
                        ->orderBy('pp.produkfk');
                }
    
                if (in_array($this->settingDataFixed('KdDepartemenBankDarah'), $departemenfk)) {
                    $pelayanan = 
                        // \DB::table('pelayananpasien_t as pp')
                        // ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
                        // ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                        // ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        \DB::table('antrianpasiendiperiksa_t as apd1')
                        ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
                        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                        ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                        ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                        ->leftJOIN('lisorder as lis', 'lis.ono', '=', 'so.noorder')
                        ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                        // ->leftJOIN('order_lab as lis', 'lis.no_lab', '=',
                        //     DB::raw("so.noorder AND
                        //     lis.kode_test =(case when pr.kodeexternal = 'SOLO' or pr.kodeexternal ='LAB PAKET' then cast (pr.id as VARCHAR) else pr.kodeexternal END)
                        //     "))
                        ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                            'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                            'ru.objectdepartemenfk', 'so.noorder','pp.isclaim', 'pd.norec as noregistrasifk',
                            // 'lis.no_lab as idbridging',
                            'lis.ono as idbridging',
                            'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim'
                            ,DB::raw("case when lis.ono is not null then 'Sudah Dikirim' else '-' end as statusbridging,'' as hr_norec ,'' as nofoto,'' as statusperiksa")
                        )
    //                    ->where('pp.kdprofile',$idProfile)
                        ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenBankDarah'))
                        ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk','pp.isclaim', 'pd.norec',
                            'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                            'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec', 'ru.objectdepartemenfk', 'so.noorder',
                            'apd.objectruanganfk','pp.iscito','pp.jasa','lis.ono',   'ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap','pg.id')
                        ->orderBy('pp.tglpelayanan')
                        ->orderBy('pp.produkfk');
                }
    
                if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                    $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                }
                if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                    $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
                }
                if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                    $pelayanan = $pelayanan->where('apd1.norec', '=', $request['noregistrasifk']);
                }
                if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                    $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
                }
                if (isset($request['ruid']) && $request['ruid'] != "" && $request['ruid'] != "undefined") {
                    $pelayanan = $pelayanan->where('ru.id', '=', $request['ruid']);
                }
                $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
                $pelayanan = $pelayanan->get();
                if (count($pelayanan) > 0) {
                    $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                        ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                        ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
    //                    ->where('pd.kdprofile',$idProfile)
                        ->where('ptu.objectjenispetugaspefk', 4)
                        ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                        // ->take(1)
                        ->get();
    
    
                    $result = [];
                    foreach ($pelayanan as $item) {
                        if (isset($request['noregistrasifk'])) {
                            $diskon = $item->hargadiscount;
                        } else {
                            $diskon = 0;
                        }
                        $NamaDokter = '-';
                        $DokterId = '';
                        foreach ($pelayananpetugas as $hahaha) {
                            if ($hahaha->pelayananpasien == $item->norec_pp) {
                                $NamaDokter = $hahaha->namalengkap;
                                $DokterId = $hahaha->id;
                            }
                        }
                        $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
    //                    $noorder =$item->noorder;
    //                    if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
    //                        $order_lab = DB::select(DB::raw("
    //                            select  top 1 * from order_lab where no_lab='$noorder'
    //                        "));
    //                        if(count($order_lab) > 0){
    //                            $item->statusbridging = 'Sudah Dikirim';
    //                        }else{
    //                            $item->statusbridging = '-';
    //                        }
    //                    }
                        $result[] = array(
                            'nocm' => $item->nocm,
                            'namapasien' => $item->namapasien,
                            'jeniskelamin' => $item->jeniskelamin,
                            'tglpelayanan' => $item->tglpelayanan,
                            'produkfk' => $item->produkfk,
                            'namaproduk' => $item->namaproduk,
                            'jumlah' => (float)$item->jumlah,
                            'hargasatuan' => (float)$item->hargasatuan,
                            'hargadiscount' => (float)$diskon,
                            'total' => (float)$total,
                            'nostruk' => $item->nostruk,
                            'noregistrasi' => $item->noregistrasi,
                            'noregistrasifk' => $item->noregistrasifk,
                            'ruangan' => $item->namaruangan,
                            'objectruanganfk' => $item->objectruanganfk,
                            'departemen' => $item->namadepartemen,
                            'objectdepartemenfk' => $item->objectdepartemenfk,
                            'norec_apd' => $item->norec_apd,
                            'norec_sp' => $item->norec_sp,
                            'norec_pp' => $item->norec_pp,
                            'dokter' => $NamaDokter,
                            'dokterid' => $DokterId,
                            'noorder' => $item->noorder,
                            'idbridging' => $item->idbridging,
                            'statusbridging' => $item->statusbridging,
                            'iscito' => $item->iscito,
                            'jasa' => (float)$item->jasa,
                            'hr_norec' => $item->hr_norec,
                            'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                            'tgllahir' => $item->tgllahir,
                            'dokterpengirim' => $item->dokterpengirim,
                            'isclaim' => $item->isclaim,
                            'iddokterpengirim' => $item->iddokterpengirim,
                            'statusperiksa' => $item->statusperiksa,
                            'nofoto' => $item->nofoto,
                        );
                    }
                } else {
                    $result = [];
                }
            }
            $dataTea =array(
                'data' => $result,
                'detaillogin' => $dataLogin,
                'message' => 'Inhuman'
            );
            return $this->respond($dataTea);
        }

        public function getRincianPelayananRadInaCbg(Request $request) {
            $dataLogin=$request->all();
    //         $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
    //             ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
    //             ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
    //             ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
    // //            ->where('mlu.kdprofile',$idProfile)
    //             ->where('objectloginuserfk',$dataLogin['userData']['id'])
    //             ->get();
    //         $pelayanan=[];
    //         $departemenfk = [];
    //         if(count($dataruangan) > 0 ){
    //             foreach ($dataruangan as $item){
    //                 $departemenfk []  =$item->objectdepartemenfk ;
    //             }
    //         }
            $result = [];
            $pelayanan = 
                \DB::table('antrianpasiendiperiksa_t as apd1')
                ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd1.noregistrasifk')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
                ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
                ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
                    DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
                ->leftJOIN('hasilradiologi_t AS hr','hr.pelayananpasienfk','=',
                    DB::raw("pp.norec AND hr.statusenabled = 1 "))
                ->select('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                    'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                    'dp.namadepartemen', 'ps.id as psid', 'apd.norec as norec_apd', 'sp.norec as norec_sp', 'pp.norec as norec_pp',
                    'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key as idbridging', 'apd.objectruanganfk','pp.iscito','pp.jasa','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap as dokterpengirim','pg.id as iddokterpengirim', 'pp.isclaim', 'pd.norec as noregistrasifk',
                    DB::raw("case when ris.order_key is not null then 'Sudah Dikirim' else '-' end as statusbridging,hr.norec AS hr_norec"),
                    DB::raw("case when hr.nofoto is not null then hr.nofoto else '-' end as nofoto"),
                    DB::raw("case when hr.nofoto is not null then 1 else 0 end as statusperiksa")
                    )

                ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                ->groupBy('ps.nocm', 'ps.namapasien', 'jk.jeniskelamin', 'pp.tglpelayanan', 'pp.produkfk', 'pr.namaproduk',
                    'pp.jumlah', 'pp.hargasatuan', 'pp.hargadiscount', 'sp.nostruk', 'pd.noregistrasi', 'ru.namaruangan',
                    'dp.namadepartemen', 'ps.id', 'apd.norec', 'sp.norec', 'pp.norec','ps.objectjeniskelaminfk','ps.tgllahir','pg.namalengkap', 'pp.isclaim', 'pd.norec',
                    'ru.objectdepartemenfk', 'so.noorder', 'ris.order_key', 'apd.objectruanganfk','pp.iscito','pp.jasa', 'hr.norec','hr.nofoto','pg.id')
                ->orderBy('pp.tglpelayanan')
                ->orderBy('pp.produkfk');
    
                if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
                    $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
                }
                if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
                    $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
                }
                if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
                    $pelayanan = $pelayanan->where('apd1.norec', '=', $request['noregistrasifk']);
                }
                if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
                    $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
                }
                if (isset($request['ruid']) && $request['ruid'] != "" && $request['ruid'] != "undefined") {
                    $pelayanan = $pelayanan->where('ru.id', '=', $request['ruid']);
                }
                $pelayanan = $pelayanan->whereNull('pp.strukresepfk');
                $pelayanan = $pelayanan->get();
                if (count($pelayanan) > 0) {
                    $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                        ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                        ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
    //                    ->where('pd.kdprofile',$idProfile)
                        ->where('ptu.objectjenispetugaspefk', 4)
                        ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                        // ->take(1)
                        ->get();
    
    
                    $result = [];
                    foreach ($pelayanan as $item) {
                        if (isset($request['noregistrasifk'])) {
                            $diskon = $item->hargadiscount;
                        } else {
                            $diskon = 0;
                        }
                        $NamaDokter = '-';
                        $DokterId = '';
                        foreach ($pelayananpetugas as $hahaha) {
                            if ($hahaha->pelayananpasien == $item->norec_pp) {
                                $NamaDokter = $hahaha->namalengkap;
                                $DokterId = $hahaha->id;
                            }
                        }
                        $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah ) + (float)$item->jasa ;
    //                    $noorder =$item->noorder;
    //                    if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
    //                        $order_lab = DB::select(DB::raw("
    //                            select  top 1 * from order_lab where no_lab='$noorder'
    //                        "));
    //                        if(count($order_lab) > 0){
    //                            $item->statusbridging = 'Sudah Dikirim';
    //                        }else{
    //                            $item->statusbridging = '-';
    //                        }
    //                    }
                        $result[] = array(
                            'nocm' => $item->nocm,
                            'namapasien' => $item->namapasien,
                            'jeniskelamin' => $item->jeniskelamin,
                            'tglpelayanan' => $item->tglpelayanan,
                            'produkfk' => $item->produkfk,
                            'namaproduk' => $item->namaproduk,
                            'jumlah' => (float)$item->jumlah,
                            'hargasatuan' => (float)$item->hargasatuan,
                            'hargadiscount' => (float)$diskon,
                            'total' => (float)$total,
                            'nostruk' => $item->nostruk,
                            'noregistrasi' => $item->noregistrasi,
                            'noregistrasifk' => $item->noregistrasifk,
                            'ruangan' => $item->namaruangan,
                            'objectruanganfk' => $item->objectruanganfk,
                            'departemen' => $item->namadepartemen,
                            'objectdepartemenfk' => $item->objectdepartemenfk,
                            'norec_apd' => $item->norec_apd,
                            'norec_sp' => $item->norec_sp,
                            'norec_pp' => $item->norec_pp,
                            'dokter' => $NamaDokter,
                            'dokterid' => $DokterId,
                            'noorder' => $item->noorder,
                            'idbridging' => $item->idbridging,
                            'statusbridging' => $item->statusbridging,
                            'iscito' => $item->iscito,
                            'jasa' => (float)$item->jasa,
                            'hr_norec' => $item->hr_norec,
                            'objectjeniskelaminfk' => $item->objectjeniskelaminfk,
                            'tgllahir' => $item->tgllahir,
                            'dokterpengirim' => $item->dokterpengirim,
                            'isclaim' => $item->isclaim,
                            'iddokterpengirim' => $item->iddokterpengirim,
                            'statusperiksa' => $item->statusperiksa,
                            'nofoto' => $item->nofoto,
                        );
                    }
                } else {
                    $result = [];
                }
            $dataTea =array(
                'data' => $result,
                'detaillogin' => $dataLogin,
                'message' => 'Inhuman'
            );
            return $this->respond($dataTea);
        }
        
    public function saveFileDna(Request $request)
    {
        DB::beginTransaction();
        try {
            // return($request['data']);
            // die();
            // foreach ($request['data'] as $item) {
                
            if ($request['id'] == '') {
                $id = FileDna::max('id');
                $dataFileDna = new FileDna();
                $dataFileDna->id = $id + 1;
                $dataFileDna->norec = $dataFileDna->generateNewId();
                $dataFileDna->statusenabled = true;

            } else {
                $dataFileDna = FileDna::where('id', $request['id'])->first();
            }
            $dataFileDna->file = $request['data'];
            $dataFileDna->filename = $request['file_name'];
            $dataFileDna->noregistrasi = $request['noregistrasi'];
            $dataFileDna->save();
            // }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Upload File";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Upload File Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function getFileDna(Request $request)
    {
        // $dataLogin=$request->all();
        // return($request['noregistrasi']);
        // die();

        $data = \DB::table('filedna_t as fd')
            ->where('fd.noregistrasi',$request['noregistrasi'])
            ->orderBy('fd.id','desc')
            ->take(1);
        $data = $data->get();
                
        return $this->respond($data);
    }

    public function saveOrderPelayananLabRad(Request $request) {
        $detLogin =$request->all();
        if( $request['pegawaiorderfk']==""){
            $dokter2 = null;
        }else{
            $dokter2 = $request['pegawaiorderfk'];
        }


        DB::beginTransaction();
        try{
            if ($request['departemenfk'] == 3){
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'L' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 27){
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'R' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 25){
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'OK' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 5){
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'PJ' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 31){
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'ABM' . $this->getDateTime()->format('ym'));
            }

            $dataPD = PasienDaftar::where('norec',$request['norec_pd'])->first();
            if ($request['norec_so']=="") {
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
                $dataSO->nocmfk = $dataPD->nocmfk;//$dataPD;
//            $dataSO->cito = '0';
//            $dataSO->objectdiagnosafk = true;
                $dataSO->isdelivered = 1;
                $dataSO->noorder = $noOrder;
                $dataSO->noorderintern = $noOrder;
                $dataSO->noregistrasifk = $dataPD->norec;//$dataAPD['noregistrasifk'];
                $dataSO->objectpegawaiorderfk = $dokter2;//$request['pegawaiorderfk'];
                $dataSO->qtyjenisproduk = 1;
                $dataSO->keteranganlainnya = $request['keterangan'];
                $dataSO->qtyproduk = $request['qtyproduk'];
                $dataSO->objectruanganfk = $request['objectruanganfk'];
                $dataSO->objectruangantujuanfk = $request['objectruangantujuanfk'];
                if ($request['departemenfk'] == 3) {
                    $dataSO->keteranganorder = 'Order Laboratorium';
                    $dataSO->objectkelompoktransaksifk = 93;
                }
                if ($request['departemenfk'] == 27) {
                    $dataSO->keteranganorder = 'Order Radiologi';
                    $dataSO->objectkelompoktransaksifk = 94;
                }
                if ($request['departemenfk'] == 25) {
                    $dataSO->keteranganorder = 'Pesan Jadwal Operasi';
                    $dataSO->objectkelompoktransaksifk = 22;
                    $dataSO->tglpelayananakhir = $request['tgloperasi'];
                    $dataSO->tglpelayananawal = $request['tgloperasi'];
                }
                if ($request['departemenfk'] == 5) {
                    $dataSO->keteranganorder = 'Pelayanan Pemulasaraan Jenazah';
                    $dataSO->objectkelompoktransaksifk = 99;
                }
                if ($request['departemenfk'] == 31) {
                    $dataSO->keteranganorder = 'Pesan Ambulan';
                    $dataSO->objectkelompoktransaksifk = 9;
                    $dataSO->tglrencana = $request['tglrencana'];
                }
                $dataSO->tglorder = date('Y-m-d H:i:s');
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


                foreach ($request['details'] as $item) {
                    if ($request['status']== 'bridinglangsung'){
                        $updatePP=PelayananPasien::where('norec',$item['norec_pp'])
                            ->update([
                                    'strukorderfk' => $dataSOnorec
                                ]
                            );
                    }

                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = 0;
                    $dataOP->statusenabled = true;
                    if(isset($item['iscito'])){
                        $dataOP->iscito =(float) $item['iscito'];
                    }else{
                        $dataOP->iscito = 0;
                    }

                    $dataOP->noorderfk = $dataSOnorec;
                    $dataOP->objectprodukfk = $item['produkfk'];
                    $dataOP->qtyproduk = $item['qtyproduk'];
                    $dataOP->objectkelasfk = $item['objectkelasfk'];
                    $dataOP->qtyprodukretur = 0;
                    $dataOP->objectruanganfk = $request['objectruanganfk'];
                    $dataOP->objectruangantujuanfk = $request['objectruangantujuanfk'];
                    $dataOP->strukorderfk = $dataSOnorec;
                    if(isset( $item['pemeriksaanluar'])){
                        if($item['pemeriksaanluar'] == 1){
                            $dataOP->keteranganlainnya =  'isPemeriksaanKeluar';
                        }
                    }

                    if (isset($item['tglrencana'])){
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    }else{
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    $dataOP->strukorderfk = $dataSOnorec;
                    if (isset($item['dokterid']) && $item['dokterid']!=""){
                        $dataOP->objectnamapenyerahbarangfk = $item['dokterid'];
                    }
                    $dataOP->save();
                }

            }else {

                foreach ($request['details'] as $item) {
                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = 0;
                    $dataOP->statusenabled = true;
                    if(isset($item['iscito'])){
                        $dataOP->iscito =(float) $item['iscito'];
                    }else{
                        $dataOP->iscito = 0;
                    }

                    $dataOP->noorderfk = $request['norec_so'];
                    $dataOP->objectprodukfk = $item['produkfk'];
                    $dataOP->qtyproduk = $item['qtyproduk'];
                    $dataOP->objectkelasfk = $item['objectkelasfk'];
                    $dataOP->qtyprodukretur = 0;
                    $dataOP->objectruanganfk = $request['objectruanganfk'];
                    $dataOP->objectruangantujuanfk = $request['objectruangantujuanfk'];
                    $dataOP->strukorderfk = $request['norec_so'];

                    if (isset($item['tglrencana'])){
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    }else{
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    if (isset($item['dokterid']) && $item['dokterid']!=""){
                        $dataOP->objectnamapenyerahbarangfk = $item['dokterid'];
                    }
                    $dataOP->save();
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan OrderPelayanan";
        }

        if ($transStatus == 'true') {
            if ($request['norec_so']=="") {
                $transMessage = "Simpan Order Pelayanan";
                DB::commit();
                $result = array(
                    "status" => 201,
                    "message" => $transMessage,
                    "strukorder" => $dataSO,
                    "as" => 'inhuman',
                );
            }else{
                $transMessage = "Simpan Order Pelayanan";
                DB::commit();
                $result = array(
                    "status" => 201,
                    "message" => $transMessage,
//                    "strukorder" => $dataSO,
                    "as" => 'inhuman',
                );
            }
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
    public function deletePelayananPasien(Request $request) {

        DB::beginTransaction();
        // try{
            foreach ($request['dataDel'] as $item) {
                $HapusPP = PelayananPasien::where('norec', $item['norec_pp'])->get();
                foreach ($HapusPP as $pp) {
                    $newHis = new AlasanHapus();
                    $newHis->norec = $newHis->generateNewId();
                    $newHis->noregistrasi = $request['noregistrasi'] ;
                    $newHis->produkfk = $pp['produkfk'];
                    $newHis->alasan = $request['alasan'];
                    $newHis->jumlah = (float)$pp['jumlah'];
                    $newHis->namauser = $request['pegawai'];
                    $newHis->tglhapus = Carbon::now();
                    $newHis->tglpelayanan = $pp['tglpelayanan'];
                    $newHis->save();
                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->delete();
                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->delete();
                }
                $Edit = PelayananPasien::where('norec', $item['norec_pp'])->delete();
            }
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = " PP PPD PPP";
        // }
        if ($transStatus == 'true') {
            $transMessage = "Delete Pelayanan Pasien";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                "nokirim" => $dataSO,//$noResep,,//$noResep,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Delete Pelayanan Pasien Gagal";
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
    public function getAccNumberRadiologi( Request $request) {
        $data = \DB::table('ris_order as ro')
            ->select('ro.*')
            ->where('ro.order_no',$request['noOrder']);

        $data=$data->get();

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getComboRad(Request $request) {
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id',array(3,14,16,17,18,19,24,25,26,27,28,35))
            ->where('dp.statusenabled',true)
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled',true)
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
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id','kp.kelompokpasien')
            ->where('kp.statusenabled',true)
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();
        $golonganDarah = \DB::table('golongandarah_m')
            ->select('id','golongandarah')
            ->where('statusenabled',true)
            ->orderBy('golongandarah')
            ->get();
        $dokter = \DB::table('pegawai_m')
            ->select('id','namalengkap')
            ->where('statusenabled',true)
            ->where('objectjenispegawaifk',1)
            ->orderBy('namalengkap')
            ->get();
        $deptRanap = explode (',',$this->settingDataFixed('kdDepartemenRanapFix'));
        $kdDepartemenRawatInap = [];
        foreach ($deptRanap as $itemRanap){
            $kdDepartemenRawatInap []=  (int)$itemRanap;
        }
        $dataRuanganInap = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatInap)
            ->orderBy('ru.namaruangan')
            ->get();
        $result = array(
            'golongandarah' => $golonganDarah,
            'departemen' => $dataDepartemen,
            'kelompokpasien' =>   $dataKelompok,
            'ruangan' => $dataRuangan,
            'jeniskelamin' => $dataJenisKelamin,
            'ruanganinap' =>   $dataRuanganInap,
            'dokter' =>   $dokter,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarPasienPenunjang(Request $request) {
        $dataLogin = $request->all();

        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
            ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
            ->where('objectloginuserfk',$dataLogin['userData']['id'])
            ->get();

            $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftJoin('kelas_m as kl', 'kl.id', '=', 'pd.objectkelasfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftJoin('golongandarah_m as gol', 'gol.id', '=', 'ps.objectgolongandarahfk')
            ->leftJoin('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganasalfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('detaildiagnosapasien_t as ddp', function($join) {
                $join->on('ddp.noregistrasifk', '=', 'apd.norec')
                     ->where('ddp.objectjenisdiagnosafk', '=', 1);
            })
            ->leftJoin('diagnosapasien_t as dp', 'dp.norec', '=', 'ddp.objectdiagnosapasienfk')
            ->leftJoin('diagnosa_m as dm', 'dm.id', '=', 'ddp.objectdiagnosafk')
            ->select(
                'apd.norec as norec_apd', 
                'ru.id as ruid',
                'apd.objectruanganasalfk as idruanganasal', 
                'ru.namaruangan', 
                'pd.noregistrasi', 
                'ps.nocm', 
                'ps.namapasien', 
                'jk.jeniskelamin', 
                'pg.nama', 
                'kp.kelompokpasien', 
                'rk.namarekanan', 
                'kl.namakelas', 
                'kl.id as klid',
                'pd.tglregistrasi', 
                'pd.tglpulang', 
                'ps.tgllahir', 
                'apd.norec', 
                'pd.norec as norec_pd',
                'sp.tglstruk', 
                'pd.nostruklastfk', 
                'alm.alamatlengkap', 
                'gol.golongandarah', 
                'apd.tglmasuk', 
                'apd.tglkeluar', 
                'ru1.namaruangan as namaruanganasal', 
                'ru2.objectdepartemenfk',
                \DB::raw("CASE WHEN ddp.noregistrasifk IS NOT NULL THEN CONCAT(dm.kddiagnosa, ', ', dm.namadiagnosa) ELSE '-' END as namadiagnosa")
            )
            ->where('ru.objectdepartemenfk', $dataruangan[0]->objectdepartemenfk)
            ->where('apd.statusenabled', True)
            //->where('apd.objectruanganfk', $dataruangan[0]->id) // Uncomment jika perlu
            ->orderBy('apd.tglregistrasi', 'desc');
        
        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('apd.tglmasuk','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('apd.tglmasuk','<=', $tgl);
        }
//        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
//            $data = $data->where('so.tglorder','>=', $request['tglAwal']);
//        }
//        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
//            $tgl= $request['tglAkhir'];
//            $data = $data->where('so.tglorder','<=', $tgl);
//        }
        if(isset($request['deptId']) && $request['deptId']!="" && $request['deptId']!="undefined"){
            $data = $data->where('dept.id','=', $request['deptId']);
        }
        if(isset($request['ruangId']) && $request['ruangId']!="" && $request['ruangId']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangId']);
        }
        if(isset($request['kelId']) && $request['kelId']!="" && $request['kelId']!="undefined"){
            $data = $data->where('kp.id','=', $request['kelId']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }
        if(isset($request['jmlRow']) && $request['jmlRow']!="" && $request['jmlRow']!="undefined"){
            $data = $data->take($request['jmlRow']);
        }
        if (isset($request['filter']) && $request['filter'] != "" && $request['filter'] != "undefined") {
            if($request['filter'] == "1"){
                $data = $data-> whereNotNull('tanggalbacaradiologi');
            }else{
                $data = $data->whereNull('tanggalbacaradiologi');
            }                
        }
//        $data = $data->orderBy('apd.tglregistrasi');
        $data = $data->get();
        $result = array(
            "data" => $data,
            "ruanganlogin" => $dataruangan,
            "as" => 'er@epic',
        );
        return $this->respond($result);
    }
    public function updateJenisKelaminPasien(Request $request){
        try {

            $dataApr = Pasien::where('nocm', $request['norm'])
                ->update([
                    'objectjeniskelaminfk' => $request['jeniskelamin'],
                ]);

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateGolonganDarah(Request $request){
        try {

            $dataApr = Pasien::where('nocm', $request['norm'])
                ->update([
                    'objectgolongandarahfk' => $request['golongandarahfk'],
                ]);

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getComboRegs(Request $request)
    {

        $dataInstalasi = \DB::table('departemen_m as dp')
//            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();


        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();
        foreach ($dataInstalasi as $item) {
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
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();
        $golonganDarah = \DB::table('golongandarah_m')
            ->select('id','golongandarah')
            ->where('statusenabled',true)
            ->orderBy('golongandarah')
            ->get();
        $jk = \DB::table('jeniskelamin_m')
            ->select('id','jeniskelamin')
            ->where('statusenabled',true)
            ->orderBy('jeniskelamin')
            ->get();



        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'golongandarah' => $golonganDarah,
            'dept' => $dept,
            'ruanganall' => $dataRuangan,
            'jeniskelamin' => $jk,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarRegistrasiPasienLabRad(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //            ->leftjoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            // ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            // ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            // ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            // ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')

//            ->leftJoin('jenispelayanan_m as jp','pd.jenispelayanan','=',
//                DB::raw('cast(jp.id as text)'))
            ->leftJoin('jenispelayanan_m as jp',   DB::raw('jp.id::VARCHAR'),'=','pd.jenispelayanan')
            ->leftJoin('golongandarah_m as gol','gol.id','=','ps.objectgolongandarahfk')
            ->select('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
                'kp.kelompokpasien', 'rek.namarekanan', 'pg.namalengkap as namadokter', 'pd.tglpulang', 'pd.statuspasien',
                // 'pa.norec as norec_pa', 'pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid', 'pd.objectruanganlastfk',
                // 'pa.nosep as nosep',
                'br.norec as norec_br', 'pd.nostruklastfk','pd.objectkelasfk','kls.namakelas',
                'ps.tgllahir','ps.objectjeniskelaminfk','jk.jeniskelamin','alm.alamatlengkap','pd.jenispelayanan as idjenispelayanan','jp.jenispelayanan',
                'gol.golongandarah','ru.objectdepartemenfk')
            ->whereNull('br.norec');
        //            ->where('pd.statusenabled', null);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        $data = $data->orderBy('pd.noregistrasi');
        // $data = $data->groupBy('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi',
        //     'ru.namaruangan', 'ps.namapasien',
        //     'br.norec',
        //     'kp.kelompokpasien', 'rek.namarekanan', 'pg.namalengkap', 'pd.tglpulang', 'pd.statuspasien',
        //     // 'pa.nosep', ', 'pa.norec', 'pa.objectasuransipasienfk',
        //      'pd.objectpegawaifk', 'pd.objectruanganlastfk',
        //     'pd.nostruklastfk', 'ps.tgllahir','pd.objectkelasfk','kls.namakelas','ps.objectjeniskelaminfk','jk.jeniskelamin',
        //     'alm.alamatlengkap','pd.jenispelayanan','jp.jenispelayanan','gol.golongandarah');
//        $data = $data->take($filter['jmlRows']);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarRegistrasiPasienLabRadLab(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            // ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            // ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            // ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            // ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            

//            ->leftJoin('jenispelayanan_m as jp','pd.jenispelayanan','=',
//                DB::raw('cast(jp.id as text)'))
            ->leftJoin('jenispelayanan_m as jp','jp.id','=','pd.jenispelayanan')
            ->leftJoin('golongandarah_m as gol','gol.id','=','ps.objectgolongandarahfk')
            ->select('pd.norec', 'pd.statusenabled', 'pd.tglregistrasi', 'ps.nocm', 'pd.nocmfk', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien',
                'kp.kelompokpasien', 'rek.namarekanan', 'pg.namalengkap as namadokter', 'pd.tglpulang', 'pd.statuspasien',
                // 'pa.norec as norec_pa', 'pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid', 'pd.objectruanganlastfk',
                // 'pa.nosep as nosep',
                'br.norec as norec_br', 'pd.nostruklastfk','pd.objectkelasfk','kls.namakelas',
                'ps.tgllahir','ps.objectjeniskelaminfk','jk.jeniskelamin','alm.alamatlengkap','pd.jenispelayanan as idjenispelayanan','jp.jenispelayanan',
                'gol.golongandarah','ru.objectdepartemenfk')
            ->whereIn('ru.objectdepartemenfk', [16,24,18])
            ->whereNull('br.norec');
        //            ->where('pd.statusenabled', null);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['deptId']);
        }
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelId']);
        }
        if (isset($filter['dokId']) && $filter['dokId'] != "" && $filter['dokId'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['dokId']);
        }
        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noreg']);
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        $data = $data->orderby('pd.noregistrasi');
        $data = $data->get();

        return $this->respond($data);
    }

    public function getAPD(Request $request)
    {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->select('apd.norec as norec_apd', 'ps.nocm', 'ps.id as nocmfk', 'ps.namapasien', 'pd.noregistrasi',
                'apd.objectruanganfk as id','ru.objectdepartemenfk',
                'ru.namaruangan', 'apd.tglregistrasi', 'kls.namakelas', 'apd.objectruanganasalfk')
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->orderBy('pd.objectruanganlastfk')
            ->get();

        $result = array(
            'ruangan' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }


    public function getLaporanRekapPemeriksaan(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
       $data = \DB::select(DB::raw("SELECT        namaproduk, SUM(jmlPasienUmum) AS jmlPasienUmum, SUM(jmlPasienPol) AS jmlPasienPol, SUM(jmlPasienNonPol) AS jmlPasienNonPol, SUM(jmlPasienTag) AS jmlPasienTag, SUM(jmlPasienPtt) AS jmlPasienPtt                                     FROM            V_LaporanRekapPemeriksaanRadiologi
                                        where tglpelayanan between '$tglAwal' and '$tglAkhir '
                                        GROUP BY namaproduk
                                        order by namaproduk

         "));
         $datamcu = \DB::select(DB::raw("SELECT        namaproduk, SUM(jmlPasienUmum) AS jmlPasienUmum, SUM(jmlPasienPol) AS jmlPasienPol, SUM(jmlPasienNonPol) AS jmlPasienNonPol, SUM(jmlPasienTag) AS jmlPasienTag, SUM(jmlPasienPtt) AS jmlPasienPtt                                     FROM            V_LaporanRekapPemeriksaanRadiologi
                                    where tglpelayanan between '$tglAwal' and '$tglAkhir ' and objectruanganasalfk = 322
                                    GROUP BY namaproduk
                                    order by namaproduk

                                    "));
        $datauangan = \DB::select(DB::raw("SELECT        instalasi, SUM(jmlPasienUmum) AS jmlPasienUmum, SUM(jmlPasienPol) AS jmlPasienPol, SUM(jmlPasienNonPol) AS jmlPasienNonPol, SUM(jmlPasienTag) AS jmlPasienTag, SUM(jmlPasienPtt) AS jmlPasienPtt
                                                FROM            V_LaporanRekapKunjunganRadiologi
                                                where tglRegistrasi between '$tglAwal' and '$tglAkhir '
                                                GROUP BY instalasi
                                                order by instalasi

                                        "));
                                        // objectruanganasalfk

        $result = array(
            'data' => $data,
            'data1' => $datauangan,
            'data2' => $datamcu,
            'message' => 'allz',
        );
        return $this->respond($result);
    }
    public function saveAntrianPasien(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk',$request['objectruanganasalfk'])
                ->where('tglregistrasi', '>=', $request['tglregistrasidate'].' 00:00')
                ->where('tglregistrasi', '<=', $request['tglregistrasidate'].' 23:59')
                ->count('norec');
            $pd = PasienDaftar::where('norec',$request['norec_pd'])->first();
            $noAntrian = $countNoAntrian + 1;
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = 0;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $request['asalrujukanfk'];
            $dataAPD->objectkelasfk = $request['kelasfk'];//6;
            $dataAPD->noantrian = $noAntrian;
            $dataAPD->noregistrasifk = $request['norec_pd'];
            $dataAPD->objectpegawaifk = $request['dokterfk'];
            $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuspasien = 1;
            $dataAPD->statuskunjungan = 'LAMA';
            $dataAPD->statuspenyakit = 'BARU';
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];;
            $dataAPD->tglregistrasi = $pd->tglregistrasi;//date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = date('Y-m-d H:i:s');
            $dataAPD->tglmasuk = date('Y-m-d H:i:s');
            $dataAPD->save();

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan AntrianPasienDiperiksa";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getAntrian(Request $request) {
        $dataLogin = $request->all();
        $apd = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
            ->leftjoin('strukorder_t as so','so.norec','=','apd.objectstrukorderfk')
            ->select('apd.norec','so.noorder','apd.objectstrukorderfk','apd.objectruanganfk','pd.noregistrasi')
            ->where('pd.noregistrasi',$request['noregistrasi'])
            ->where('so.noorder',$request['noorder'])
            ->get();
        if (count($apd) < 1){
            $apd = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->leftjoin('strukorder_t as so','so.norec','=','apd.objectstrukorderfk')
                ->select('apd.norec','so.noorder','apd.objectstrukorderfk','apd.objectruanganfk','pd.noregistrasi')
                ->where('pd.noregistrasi',$request['noregistrasi'])
                ->where('apd.objectruanganfk',$request['idruangan'])
                ->get();
        }
        $result = array(
            'data' => $apd,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDaftarOrderPenunjang(Request $request) {
        $dataLogin = $request->all();
        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
            ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
            ->where('objectloginuserfk',$dataLogin['userData']['id'])
            ->get();
        $departemenfk = [];
        if(count($dataruangan) > 0 ){
            foreach ($dataruangan as $item){
                $departemenfk []  =$item->objectdepartemenfk ;
            }
        }
        $result = [];
        if (in_array($this->settingDataFixed('KdDepartemenInstalasiLaboratorium'), $departemenfk)) {
            $data = \DB::table('strukorder_t as so')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
                // ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('strukpelayanan_t as sps', 'sps.norec', '=', 'pd.nostruklastfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
                ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
                ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                ->join('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
                ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
//                ->leftJoin('lisorder as pp', 'pp.ono', '=', 'so.noorder')
                ->select('so.norec as norec_so', 'pd.norec as norec_pd', 'so.noorder', 'pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'ps.nocm', 'ps.namapasien',
                    'klm.jeniskelamin', 'ps.tgllahir',
                    'kps.kelompokpasien', 'dp.namadepartemen', 'pd.objectkelasfk', 'kls.namakelas','kls.id as klsid', 'so.objectruangantujuanfk',
                    'so.objectruanganfk', 'pd.objectkelompokpasienlastfk', 'ru.objectdepartemenfk', 'ru2.objectdepartemenfk as iddeptujuan',
                    'so.objectpegawaiorderfk', 'pg.namalengkap as pegawaiorder',
//                    'pp.norec as norec_pp',
                    'ru.namaruangan','ru.id as ruid', 'ru2.namaruangan as ruangantujuan','so.tglorder','sps.nostruk',
                    // 'apd.norec as norec_apd',
                    'so.keteranganlainnya',
//                    (DB::raw("case when pp.ono is null then 'MASUK' else
//                                    'SELESAI' end as status")))
                    (DB::raw("case when so.statusorder is null then 'MASUK' else
                                    'SELESAI' end as status")))
                ->where('ru2.objectdepartemenfk',$this->settingDataFixed('KdDepartemenInstalasiLaboratorium'))
                ->where('so.statusenabled',true) ;
            if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
                if ($request['isNotVerif'] == true) {
                    $data = $data->whereNull('so.statusorder');
                }
            }
//            if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
//                if ($request['isNotVerif'] == true) {
//                    $data = $data->whereNull('pp.ono');
//                }
//            }
        }

        if (in_array($this->settingDataFixed('KdDepartemenInstalasiRadiologi'), $departemenfk)) {
            if(isset($request['ruanganTujuanId']) && $request['ruanganTujuanId']!=''){
                $data = \DB::table('strukorder_t as so')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
//                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    // ->join('antrianpasiendiperiksa_t as apd',function($join)
                    // {
                    //     $join->on('apd.noregistrasifk','=','pd.norec')
                    //         ->where('apd.objectruanganfk','=', 576);
                    //     //                $join->on('spp.keteranganlainnya','=','Setoran Kasir');
                    // })
                    ->leftjoin('strukpelayanan_t as sps', 'sps.norec', '=', 'pd.nostruklastfk')
                    ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
                    ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
                    ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                    ->join('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
                    ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                    ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
                    ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
//                    ->leftJoin('ris_order as pp', 'pp.order_no', '=', 'so.noorder')
                    ->select('so.norec as norec_so', 'pd.norec as norec_pd', 'so.noorder', 'pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'ps.nocm', 'ps.namapasien',
                        'klm.jeniskelamin', 'ps.tgllahir',
                        'kps.kelompokpasien', 'dp.namadepartemen', 'pd.objectkelasfk', 'kls.namakelas', 'so.objectruangantujuanfk',
                        'so.objectruanganfk', 'pd.objectkelompokpasienlastfk', 'ru.objectdepartemenfk', 'ru2.objectdepartemenfk as iddeptujuan',
                        'so.objectpegawaiorderfk', 'pg.namalengkap as pegawaiorder', 'so.tglorder', 'sps.nostruk',
                        'ru.namaruangan', 'ru2.namaruangan as ruangantujuan',     'so.keteranganlainnya',
                        // 'apd.norec as norec_apd',
                        'ru.id as ruid',
                        (DB::raw("case when so.statusorder is null then 'MASUK' else
                                    'SELESAI' end as status")))
                    ->where('ru2.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                    ->where('so.statusenabled', true)
                    ->where('so.objectruangantujuanfk',$request['ruanganTujuanId']);
                if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
                    if ($request['isNotVerif'] == true) {
                        $data = $data->whereNull('so.statusorder');
                    }
                }
            }else{
                $data = \DB::table('strukorder_t as so')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
//                    ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    // ->join('antrianpasiendiperiksa_t as apd',function($join)
                    // {
                    //     $join->on('apd.noregistrasifk','=','pd.norec')
                    //         ->where('apd.objectruanganfk','=', 576);
                    //     //                $join->on('spp.keteranganlainnya','=','Setoran Kasir');
                    // })
                    ->leftjoin('strukpelayanan_t as sps', 'sps.norec', '=', 'pd.nostruklastfk')
                    ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                    ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
                    ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
                    ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                    ->join('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
                    ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                    ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
                    ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
                    ->leftJoin('ris_order as pp', 'pp.order_no', '=', 'so.noorder')
                    ->select('so.norec as norec_so', 'pd.norec as norec_pd', 'so.noorder', 'pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'ps.nocm', 'ps.namapasien',
                        'klm.jeniskelamin', 'ps.tgllahir',
                        'kps.kelompokpasien', 'dp.namadepartemen', 'pd.objectkelasfk', 'kls.namakelas', 'so.objectruangantujuanfk',
                        'so.objectruanganfk', 'pd.objectkelompokpasienlastfk', 'ru.objectdepartemenfk', 'ru2.objectdepartemenfk as iddeptujuan',
                        'so.objectpegawaiorderfk', 'pg.namalengkap as pegawaiorder', 'so.tglorder', 'sps.nostruk',
                        // 'apd.norec as norec_apd',
                        'ru.namaruangan', 'ru2.namaruangan as ruangantujuan',
                             'so.keteranganlainnya',
                        (DB::raw("case when pp.order_no is null then 'MASUK' else
                                    'SELESAI' end as status")))
                    ->where('ru2.objectdepartemenfk', $this->settingDataFixed('KdDepartemenInstalasiRadiologi'))
                    ->where('so.statusenabled', true)
                    ->whereNotIn('so.objectruangantujuanfk',[$this->settingDataFixed('kdRuanganElektromedik')]);
                if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
                    if ($request['isNotVerif'] == true) {
                        $data = $data->whereNull('pp.order_no');
                    }
                }
            }



        }
        if (in_array($this->settingDataFixed('kdDepartemenElektromedik'), $departemenfk)) {
            // $ruangani = Ruangan::where('objectdepartemenfk',$this->settingDataFixed('kdDepartemenElektromedik'))->get();
            // $ruanganiAr=[];
            // foreach ($ruangani as $key => $value) {
            //     $ruanganiAr[]=$value->id;
            //     # code...
            // }
            // return $ruanganiAr;
            $data = \DB::table('strukorder_t as so')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
//                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
 //                 ->leftjoin('antrianpasiendiperiksa_t as apd',function($join)
 //                 {
 //                     $join->on('apd.noregistrasifk','=','pd.norec')
 //                         ->where('apd.objectruanganfk','=', 571);
 // //                $join->on('spp.keteranganlainnya','=','Setoran Kasir');
 //                 })
                ->leftjoin('strukpelayanan_t as sps', 'sps.norec', '=', 'pd.nostruklastfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
                ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
                ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                ->join('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
                ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
//                    ->leftJoin('ris_order as pp', 'pp.order_no', '=', 'so.noorder')
                ->select('so.norec as norec_so', 'pd.norec as norec_pd', 'so.noorder', 'pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'ps.nocm', 'ps.namapasien',
                    'klm.jeniskelamin', 'ps.tgllahir',
                    'kps.kelompokpasien', 'dp.namadepartemen', 'pd.objectkelasfk', 'kls.namakelas', 'so.objectruangantujuanfk',
                    'so.objectruanganfk', 'pd.objectkelompokpasienlastfk', 'ru.objectdepartemenfk', 'ru2.objectdepartemenfk as iddeptujuan',
                    'so.objectpegawaiorderfk', 'pg.namalengkap as pegawaiorder', 'so.tglorder', 'sps.nostruk', 
                    // 'apd.norec as norec_apd',
                    // 'apd.norec as norec_apd',
                    'ru.namaruangan', 'ru2.namaruangan as ruangantujuan',
                         'so.keteranganlainnya',
                    (DB::raw("case when so.statusorder is null then 'MASUK' else
                                    'SELESAI' end as status")))
                ->where('ru2.objectdepartemenfk', $this->settingDataFixed('kdDepartemenElektromedik'))
                ->where('so.statusenabled', true)
                ->where('so.objectkelompoktransaksifk', '!=', '108');
//                ->where('so.objectruangantujuanfk', $request['ruanganTujuanId']);
            if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
                if ($request['isNotVerif'] == true) {
                    $data = $data->whereNull('so.statusorder');
                }
            }
        }

        if (in_array($this->settingDataFixed('KdInstalasiBedahSentral'), $departemenfk)) {
            $data = \DB::table('strukorder_t as so')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
                ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
                ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
                ->join('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
                ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
                ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'pd.objectpegawaifk')
                ->leftJoin('pelayananpasien_t as pp', 'pp.strukorderfk', '=', 'so.norec')
                ->leftJoin('jadwaloperasijkn_t as jdopn', 'jdopn.noregistrasi2', '=', 'pd.noregistrasi')
                ->leftJoin('pegawai_m as pg3', 'jdopn.dokteroperatorfk', '=', 'pg3.id')
                ->leftJoin('pegawai_m as pg4', 'jdopn.dokteranestesi', '=', 'pg4.id')
                            // ->select('so.norec as norec_so','jdopn.norec as norec_jadwal', 'pd.norec as norec_pd', 'so.noorder', 'pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'ps.nocm', 'ps.namapasien',
                //     'klm.jeniskelamin', 'ps.tgllahir',
                //     'kps.kelompokpasien', 'dp.namadepartemen', 'pd.objectkelasfk', 'kls.namakelas', 'so.objectruangantujuanfk',
                //     'so.objectruanganfk', 'pd.objectkelompokpasienlastfk', 'ru.objectdepartemenfk', 'ru2.objectdepartemenfk as iddeptujuan',
                //     'so.objectpegawaiorderfk', 'pg.namalengkap as pegawaiorder','so.tglorder',
                //     'ru.namaruangan', 'ru2.namaruangan as ruangantujuan','so.tglpelayananakhir','pg2.namalengkap as dpjp',
                //     (DB::raw("case when pp.strukorderfk is null then 'MASUK' else
                //                     'Sudah Verifikasi' end as status,case when jdopn.terlaksana = 0 and 
                // pp.strukorderfk is not null then 'ANTREAN' when jdopn.terlaksana is null and  pp.strukorderfk is null then 'MENUNGGU' else 'Selesai' end as statusantrianjkn")))
                ->select(
                'pg3.namalengkap as dokter',
                'pg4.namalengkap as anastesi','so.norec as norec_so','jdopn.norec as norec_jadwal', 'pd.norec as norec_pd', 'so.noorder', 'pd.noregistrasi', 'pd.tglregistrasi', 'pd.tglpulang', 'ps.nocm', 'ps.namapasien',
                    'klm.jeniskelamin', 'ps.tgllahir',
                    'kps.kelompokpasien', 'dp.namadepartemen', 'pd.objectkelasfk', 'kls.namakelas', 'so.objectruangantujuanfk',
                    'so.objectruanganfk', 'pd.objectkelompokpasienlastfk', 'ru.objectdepartemenfk', 'ru2.objectdepartemenfk as iddeptujuan',
                    'so.objectpegawaiorderfk', 'pg.namalengkap as pegawaiorder','so.tglorder',
                    'ru.namaruangan', 'ru2.namaruangan as ruangantujuan','so.tglpelayananakhir','pg2.namalengkap as dpjp','jdopn.jenistindakan',
                (DB::raw("CASE WHEN so.status IS NULL 
                         THEN 'MASUK' ELSE 'Sudah Verifikasi' END AS status,                       
						 CASE WHEN so.status IS NULL 
                         THEN 'MENUNGGU'
                         WHEN jdopn.terlaksana = false THEN 'ANTREAN' ELSE 'Selesai'
                         END AS statusantrianjkn")))
                ->where('ru2.objectdepartemenfk', $this->settingDataFixed('KdInstalasiBedahSentral'))
                ->where('so.statusenabled',true);

            if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
                if ($request['isNotVerif'] == true) {
                    // $data = $data->whereNull('pp.strukorderfk');
                    $data = $data->whereNull('so.status');
                   
                }
            }
        }
//        if($dataruangan[0]->objectdepartemenfk != 27 && $dataruangan[0]->objectdepartemenfk != 3 && $dataruangan[0]->objectdepartemenfk != 25){
//            $tgltgltgl= date('Y-m-d H:i:s');
//            $data = $data->where('so.tglpelayananakhir','>=', $tgltgltgl);
//        }

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('so.tglorder','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
          
            $tgl= $request['tglAkhir'];
            $data = $data->where('so.tglorder','<=', $tgl);
        }
        if(isset($request['tglAwalOperasi']) && $request['tglAwalOperasi']!="" && $request['tglAwalOperasi']!="undefined"){
            $data = $data->where('so.tglpelayananakhir','>=', $request['tglAwalOperasi']);
        }
        if(isset($request['tglAkhirOperasi']) && $request['tglAkhirOperasi']!="" && $request['tglAkhirOperasi']!="undefined"){
            $tgl= $request['tglAkhirOperasi'];
            $data = $data->where('so.tglpelayananakhir','<=', $tgl);
        }
        if(isset($request['deptId']) && $request['deptId']!="" && $request['deptId']!="undefined"){
            $data = $data->where('ru.objectdepartemenfk','=', $request['deptId']);
        }

        if(isset($request['pegId']) && $request['pegId']!="" && $request['pegId']!="undefined"){
            $data = $data->where('so.objectpegawaiorderfk','=', $request['pegId']);
        }
        if(isset($request['ruangId']) && $request['ruangId']!="" && $request['ruangId']!="undefined"){
            $data = $data->where('so.objectruanganfk','=', $request['ruangId']);
        }
        if(isset($request['kelId']) && $request['kelId']!="" && $request['kelId']!="undefined"){
            $data = $data->where('pd.objectkelompokpasienlastfk','=', $request['kelId']);
        }
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi','ilike','%'. $request['noregistrasi'].'%');
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','ilike','%'. $request['nocm'].'%');
        }
        if(isset($request['namapasien']) && $request['namapasien']!="" && $request['namapasien']!="undefined"){
            $data = $data->where('ps.namapasien','ilike','%'. $request['namapasien'].'%');
        }
        if(isset($request['noOrders']) && $request['noOrders']!="" && $request['noOrders']!="undefined"){
            $data = $data->where('so.noorder','ilike','%'. $request['noOrders'].'%');
        }
        if(isset($request['jmlRow']) && $request['jmlRow']!="" && $request['jmlRow']!="undefined"){
            $data = $data->take($request['jmlRow']);
        }
        $data = $data->orderBy('so.noorder','desc');
//        $data = $data->take(100);
        $data = $data->distinct();
        $data = $data->get();
        if (in_array($this->settingDataFixed('KdInstalasiBedahSentral'), $departemenfk)) {

            foreach ($data as $item) {
                $detail = [];
                $lab = 'Belum diisi';
                $rad = 'Belum diisi';
                $pelayananpasien = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->select('apd.objectruanganfk', 'apd.norec')
                ->where('pd.noregistrasi', $item->noregistrasi)
                    ->whereIn('apd.objectruanganfk', [575, 576])
                    ->distinct()
                    ->get();
                if (count($pelayananpasien) > 0) {
                    foreach ($pelayananpasien as $ppitem) {
                        if ($ppitem->objectruanganfk == 575) {
                            $lab = 'Sudah diisi';
                            $detail[] = array(
                                'path' => "RekamMedis.TransaksiPelayananLaboratoriumDokterRev",
                                'name' => "Laboratorium",
                                'norec' => $ppitem->norec
                            );
                        } else if ($ppitem->objectruanganfk == 576) {
                            $rad = 'Sudah diisi';
                            $detail[] = array(
                                'path' => "RekamMedis.TransaksiPelayananRadiologiDokterRev",
                                'name' => "Radiologi",
                                'norec' => $ppitem->norec
                            );
                        }
                    }
                }
                $item->detail = $detail;
                
                $tindakan = \DB::table('orderpelayanan_t as op')
                ->where('op.strukorderfk', $item->norec_so)
                ->distinct()
                ->get();
                if (count($tindakan) > 0) {
                    $namatindakan ='';
                    $keterangantindakan='';
                    $diagnosa='';
                    foreach ($tindakan as $itemx) {
                        if($namatindakan == ''){
                            $namatindakan = $itemx->keteranganlainnya;
                        }else{
                            $namatindakan = $namatindakan .','. $itemx->keteranganlainnya;
                        }
                        if($keterangantindakan == ''){
                            $keterangantindakan = $itemx->keteranganlainnya_quo;
                        }else{
                            $keterangantindakan = $keterangantindakan .','. $itemx->keteranganlainnya_quo;
                        }
                         if($diagnosa == ''){
                            $diagnosa = $itemx->diagnosa;
                        }else{
                            $diagnosa = $diagnosa .','. $itemx->diagnosa;
                        }
                    }
                }
                $item->namatindakan= $namatindakan;
                $item->keterangantindakan= $keterangantindakan;
                $item->kddiagnosa= $diagnosa;
            }
        }

        $dataResult=array(
            'message' =>  'inhuman',
            'data' =>  $data,
            'dataruangan' => $dataruangan
        );
        return $this->respond($dataResult);
    }
    public function getDaftarOrderPenunjangverifRincian(Request $request)
    {
        $dataLogin = $request->all();
        
        $departemenfk = [25];
        
        $result = [];
        if (in_array($this->settingDataFixed('KdInstalasiBedahSentral'), $departemenfk)) {
            $data = \DB::table('strukorder_t as so')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->join('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('pelayananpasien_t as pp', 'pp.strukorderfk', '=', 'so.norec')
            ->leftJoin('jadwaloperasijkn_t as jdopn', 'jdopn.noregistrasi2', '=', 'pd.noregistrasi')
            ->leftJoin('pegawai_m as pg3', 'jdopn.dokteroperatorfk', '=', 'pg3.id')
            ->leftJoin('pegawai_m as pg4', 'jdopn.dokteranestesi', '=', 'pg4.id')
            ->select(
                'so.diagnosa as diagnosa',
                'pg3.namalengkap as dokter',
                'pg4.namalengkap as anastesi',                
                'jdopn.*',
                'so.norec as norec_so',
                'jdopn.norec as norec_jadwal',
                'pd.norec as norec_pd',
                'so.noorder',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.tglpulang',
                'ps.nocm',
                'ps.namapasien',
                'klm.jeniskelamin',
                'ps.tgllahir',
                'kps.kelompokpasien',
                'dp.namadepartemen',
                'pd.objectkelasfk',
                'kls.namakelas',
                'so.objectruangantujuanfk',
                'so.objectruanganfk',
                'pd.objectkelompokpasienlastfk',
                'ru.objectdepartemenfk',
                'ru2.objectdepartemenfk as iddeptujuan',
                'so.objectpegawaiorderfk',
                'pg.namalengkap as pegawaiorder',
                'so.tglorder',
                'ru.namaruangan',
                'ru2.namaruangan as ruangantujuan',
                'so.tglpelayananakhir',
                'pg2.namalengkap as dpjp',
                (DB::raw("CASE WHEN so.status IS NULL 
                         THEN 'MASUK' ELSE 'Sudah Verifikasi' END AS status,                       
						 CASE WHEN so.status IS NULL 
                         THEN 'MENUNGGU'
                         WHEN jdopn.terlaksana = false THEN 'ANTREAN' ELSE 'Selesai'
                         END AS statusantrianjkn,
                         --CONCAT(DATEDIFF(YYYY,ps.[tgllahir], GETDATE()), ' tahun') as umur
                         to_char( ps.tgllahir, TO_CHAR(age( ps.tgllahir,  now( )), 'YY Tahun mm Bulan DD Hari')) AS umur"))
            )
            ->where('ru2.objectdepartemenfk', $this->settingDataFixed('KdInstalasiBedahSentral'))
            
            ->where('so.statusenabled', true);
            $data = $data->whereNotNull('so.status');
            
        }


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglorder', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglorder', '<=', $tgl);
        }
        if (isset($request['tglAwalOperasi']) && $request['tglAwalOperasi'] != "" && $request['tglAwalOperasi'] != "undefined") {
            $data = $data->where('so.tglpelayananakhir', '>=', $request['tglAwalOperasi']);
        }
        if (isset($request['tglAkhirOperasi']) && $request['tglAkhirOperasi'] != "" && $request['tglAkhirOperasi'] != "undefined") {
            $tgl = $request['tglAkhirOperasi'];
            $data = $data->where('so.tglpelayananakhir', '<=', $tgl);
        }
        if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['deptId']);
        }

        if (isset($request['pegId']) && $request['pegId'] != "" && $request['pegId'] != "undefined") {
            $data = $data->where('so.objectpegawaiorderfk', '=', $request['pegId']);
        }
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $data = $data->where('so.objectruanganfk', '=', $request['ruangId']);
        }
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['kelId']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $request['noregistrasi'] . '%');
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        if (isset($request['noOrders']) && $request['noOrders'] != "" && $request['noOrders'] != "undefined") {
            $data = $data->where('so.noorder', 'ilike', '%' . $request['noOrders'] . '%');
        }
        if (isset($request['jmlRow']) && $request['jmlRow'] != "" && $request['jmlRow'] != "undefined") {
            $data = $data->take($request['jmlRow']);
        }
        $data = $data->orderBy('jdopn.ok', 'asc');
        //        $data = $data->take(100);
        $data = $data->distinct();
        $data = $data->get();
        foreach ($data as $item) {
            $detail = [];
            $lab = 'Belum diisi';
            $rad = 'Belum diisi';
            $pelayananpasien = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->select('apd.objectruanganfk','apd.norec')
                ->where('pd.noregistrasi', $item->noregistrasi)
                ->whereIn('apd.objectruanganfk', [575, 576])
                ->distinct()
                ->get();
            if (count($pelayananpasien) > 0) {
                foreach ($pelayananpasien as $ppitem) {
                    if ($ppitem->objectruanganfk == 575) {
                        $lab = 'Sudah diisi';
                        $detail[] = array(
                            'path' => "RekamMedis.TransaksiPelayananLaboratoriumDokterRev",
                            'name' => "Laboratorium",
                            'norec' => $ppitem->norec
                        );
                    } else if ($ppitem->objectruanganfk == 576) {
                        $rad = 'Sudah diisi';
                        $detail[] = array(
                            'path' => "RekamMedis.TransaksiPelayananRadiologiDokterRev",
                            'name' => "Radiologi",
                            'norec' => $ppitem->norec
                        );
                    }
                }
            }
             $item->detail= $detail;
            $tindakan = \DB::table('orderpelayanan_t as op')
                ->where('op.strukorderfk', $item->norec_so)
                ->distinct()
                ->get();
             if (count($tindakan) > 0) {
                    $namatindakan ='';
                    $keterangantindakan='';
                    $diagnosa='';
                    foreach ($tindakan as $itemx) {
                        if($namatindakan == ''){
                            $namatindakan = $itemx->keteranganlainnya;
                        }else{
                            $namatindakan = $namatindakan .','. $itemx->keteranganlainnya;
                        }
                        if($keterangantindakan == ''){
                            $keterangantindakan = $itemx->keteranganlainnya_quo;
                        }else{
                            $keterangantindakan = $keterangantindakan .','. $itemx->keteranganlainnya_quo;
                        }
                         if($diagnosa == ''){
                            $diagnosa = $itemx->diagnosa;
                        }else{
                            $diagnosa = $diagnosa .','. $itemx->diagnosa;
                        }
                    }
                }
                $item->namatindakan= $namatindakan;
                $item->keterangantindakan= $keterangantindakan;
                $item->kddiagnosa= $diagnosa;

            // $datass[] = array(
            //     'data'=> $item,
            //     'radiologi' => $rad,
            //     'laboratorium' => $lab,
            // );
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $data,
            // 'dataruangan' => $dataruangan
        );
        return $this->respond($dataResult);
    }
    public function getDaftarOrderPenunjangverif(Request $request)
    {
        $dataLogin = $request->all();
        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
        ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
        ->leftjoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
        ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
        ->where('objectloginuserfk', $dataLogin['userData']['id'])
            ->get();
        $departemenfk = [];
        if (count($dataruangan) > 0) {
            foreach ($dataruangan as $item) {
                $departemenfk[]  = $item->objectdepartemenfk;
            }
        }
        $result = [];
        if (in_array($this->settingDataFixed('KdInstalasiBedahSentral'), $departemenfk)) {
            $data = \DB::table('strukorder_t as so')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->join('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('pelayananpasien_t as pp', 'pp.strukorderfk', '=', 'so.norec')
            ->leftJoin('jadwaloperasijkn_t as jdopn', 'jdopn.noregistrasi2', '=', 'pd.noregistrasi')
            ->leftJoin('pegawai_m as pg3', 'jdopn.dokteroperatorfk', '=', 'pg3.id')
            ->leftJoin('pegawai_m as pg4', 'jdopn.dokteranestesi', '=', 'pg4.id')
            ->select(
                'so.diagnosa as diagnosa',
                'pg3.namalengkap as dokter',
                'pg4.namalengkap as anastesi',                
                'jdopn.*',
                'so.norec as norec_so',
                'jdopn.norec as norec_jadwal',
                'pd.norec as norec_pd',
                'so.noorder',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.tglpulang',
                'ps.nocm',
                'ps.namapasien',
                'klm.jeniskelamin',
                'ps.tgllahir',
                'kps.kelompokpasien',
                'dp.namadepartemen',
                'pd.objectkelasfk',
                'kls.namakelas',
                'so.objectruangantujuanfk',
                'so.objectruanganfk',
                'pd.objectkelompokpasienlastfk',
                'ru.objectdepartemenfk',
                'ru2.objectdepartemenfk as iddeptujuan',
                'so.objectpegawaiorderfk',
                'pg.namalengkap as pegawaiorder',
                'so.tglorder',
                'ru.namaruangan',
                'ru2.namaruangan as ruangantujuan',
                'so.tglpelayananakhir',
                'pg2.namalengkap as dpjp',
                (DB::raw("CASE WHEN so.status IS NULL 
                         THEN 'MASUK' ELSE 'Sudah Verifikasi' END AS status,                       
						 CASE WHEN so.status IS NULL 
                         THEN 'MENUNGGU'
                         WHEN jdopn.terlaksana = false THEN 'ANTREAN' ELSE 'Selesai'
                         END AS statusantrianjkn,
                         --CONCAT(DATEDIFF(YYYY,ps.[tgllahir], GETDATE()), ' tahun') as umur
                         to_char( ps.tgllahir, TO_CHAR(age( ps.tgllahir,  now( )), 'YY Tahun mm Bulan DD Hari')) AS umur"))
            )
            ->where('ru2.objectdepartemenfk', $this->settingDataFixed('KdInstalasiBedahSentral'))
            
            ->where('so.statusenabled', true);
            $data = $data->whereNotNull('so.status');
            
        }


        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglorder', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglorder', '<=', $tgl);
        }
        if (isset($request['tglAwalOperasi']) && $request['tglAwalOperasi'] != "" && $request['tglAwalOperasi'] != "undefined") {
            $data = $data->where('so.tglpelayananakhir', '>=', $request['tglAwalOperasi']);
        }
        if (isset($request['tglAkhirOperasi']) && $request['tglAkhirOperasi'] != "" && $request['tglAkhirOperasi'] != "undefined") {
            $tgl = $request['tglAkhirOperasi'];
            $data = $data->where('so.tglpelayananakhir', '<=', $tgl);
        }
        if (isset($request['deptId']) && $request['deptId'] != "" && $request['deptId'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['deptId']);
        }

        if (isset($request['pegId']) && $request['pegId'] != "" && $request['pegId'] != "undefined") {
            $data = $data->where('so.objectpegawaiorderfk', '=', $request['pegId']);
        }
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $data = $data->where('so.objectruanganfk', '=', $request['ruangId']);
        }
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['kelId']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $request['noregistrasi'] . '%');
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        if (isset($request['noOrders']) && $request['noOrders'] != "" && $request['noOrders'] != "undefined") {
            $data = $data->where('so.noorder', 'ilike', '%' . $request['noOrders'] . '%');
        }
        if (isset($request['jmlRow']) && $request['jmlRow'] != "" && $request['jmlRow'] != "undefined") {
            $data = $data->take($request['jmlRow']);
        }
        $data = $data->orderBy('jdopn.ok', 'asc');
        //        $data = $data->take(100);
        $data = $data->distinct();
        $data = $data->get();
        foreach ($data as $item) {
            $detail = [];
            $lab = 'Belum diisi';
            $rad = 'Belum diisi';
            $pelayananpasien = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->select('apd.objectruanganfk','apd.norec')
                ->where('pd.noregistrasi', $item->noregistrasi)
                ->whereIn('apd.objectruanganfk', [575, 576])
                ->distinct()
                ->get();
            if (count($pelayananpasien) > 0) {
                foreach ($pelayananpasien as $ppitem) {
                    if ($ppitem->objectruanganfk == 575) {
                        $lab = 'Sudah diisi';
                        $detail[] = array(
                            'path' => "RekamMedis.TransaksiPelayananLaboratoriumDokterRev",
                            'name' => "Laboratorium",
                            'norec' => $ppitem->norec
                        );
                    } else if ($ppitem->objectruanganfk == 576) {
                        $rad = 'Sudah diisi';
                        $detail[] = array(
                            'path' => "RekamMedis.TransaksiPelayananRadiologiDokterRev",
                            'name' => "Radiologi",
                            'norec' => $ppitem->norec
                        );
                    }
                }
            }
             $item->detail= $detail;
            $tindakan = \DB::table('orderpelayanan_t as op')
                ->where('op.strukorderfk', $item->norec_so)
                ->distinct()
                ->get();
             if (count($tindakan) > 0) {
                    $namatindakan ='';
                    $keterangantindakan='';
                    $diagnosa='';
                    foreach ($tindakan as $itemx) {
                        if($namatindakan == ''){
                            $namatindakan = $itemx->keteranganlainnya;
                        }else{
                            $namatindakan = $namatindakan .','. $itemx->keteranganlainnya;
                        }
                        if($keterangantindakan == ''){
                            $keterangantindakan = $itemx->keteranganlainnya_quo;
                        }else{
                            $keterangantindakan = $keterangantindakan .','. $itemx->keteranganlainnya_quo;
                        }
                         if($diagnosa == ''){
                            $diagnosa = $itemx->diagnosa;
                        }else{
                            $diagnosa = $diagnosa .','. $itemx->diagnosa;
                        }
                    }
                }
                $item->namatindakan= $namatindakan;
                $item->keterangantindakan= $keterangantindakan;
                $item->kddiagnosa= $diagnosa;

            // $datass[] = array(
            //     'data'=> $item,
            //     'radiologi' => $rad,
            //     'laboratorium' => $lab,
            // );
        }

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $data,
            'dataruangan' => $dataruangan
        );
        return $this->respond($dataResult);
    }
    public function getDiagnosaRad( Request $request) {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('pd.noregistrasi','pd.tglregistrasi','apd.objectruanganfk','ru.namaruangan','apd.norec as norec_apd',
                'ddp.objectdiagnosafk','dg.kddiagnosa','dg.namadiagnosa','ddp.tglinputdiagnosa','ddp.objectjenisdiagnosafk',
                'jd.jenisdiagnosa','dp.norec as norec_diagnosapasien','ddp.norec as norec_detaildpasien','ddp.tglinputdiagnosa',
                'pg.namalengkap',
                'dp.ketdiagnosis','ddp.keterangan','dg.*','dp.iskasusbaru','dp.iskasuslama')
            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
            ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->join ('diagnosapasien_t as dp','dp.noregistrasifk','=','apd.norec')
            ->join ('detaildiagnosapasien_t as ddp','ddp.objectdiagnosapasienfk','=','dp.norec')
            ->join ('diagnosa_m as dg','dg.id','=','ddp.objectdiagnosafk')
            ->join ('jenisdiagnosa_m as jd','jd.id','=','ddp.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg','pg.id','=','ddp.objectpegawaifk');
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        };

        $data=$data->get();

        $result = array(
            'datas' => $data,
            'message' => 'giw',
        );
        return $this->respond($result);
    }
    public function getOrderPelayanan(Request $request) {
//        $dataLogin = $request->all();
        $idkelas = $request['objectkelasfk'];
        $norec_so = $request['norec_so'];
        $dataOrderPelayanan = DB::select(DB::raw("select DISTINCT op.keteranganlainnya_quo as keterangantindakan,op.norec as norec_op,pr.id as prid,pr.namaproduk,
                op.tglpelayanan,op.qtyproduk ,ru.namaruangan as ruangantujuan,ru.objectdepartemenfk,op.strukorderfk,so.objectruangantujuanfk,
                hnp.hargasatuan ,kls.namakelas,dpm.namadepartemen,
                pps.norec as norec_pp, so.keteranganlainnya, op.keteranganlainnya as keterangandetail
                from orderpelayanan_t op
                left join strukorder_t as so on so.norec=op.strukorderfk
                INNER JOIN produk_m as pr on pr.id=op.objectprodukfk
                left JOIN harganettoprodukbykelas_m as hnp on pr.id=hnp.objectprodukfk
                        and '$idkelas' =hnp.objectkelasfk
                        and hnp.statusenabled=true
                --and op.objectkelasfk=hnp.objectkelasfk
                left join kelas_m as kls on kls.id = '$idkelas'
                --op.objectkelasfk
                left join ruangan_m as ru on ru.id =so.objectruangantujuanfk
                left join departemen_m as dpm on dpm.id=ru.objectdepartemenfk
                left JOIN pelayananpasien_t as pps on pps.strukorderfk=so.norec
                      and op.objectprodukfk =pps.produkfk
                where op.strukorderfk='$norec_so'
                and kls.id='$idkelas'
                ORDER by op.tglpelayanan")
        );

        $result=[];
        foreach ($dataOrderPelayanan as $item){
            $dataz =  DB::select(DB::raw("select DISTINCT hnp.objectkomponenhargafk,kh.komponenharga,hnp.hargasatuan,
                hnp.objectprodukfk
                from harganettoprodukbykelasd_m as hnp   
                inner join produk_m as prd on prd.id=hnp.objectprodukfk
                inner join komponenharga_m as kh on kh.id=hnp.objectkomponenhargafk
                inner join kelas_m as kls on kls.id = hnp.objectkelasfk
                where hnp.objectkelasfk='$idkelas'
                and prd.id='$item->prid'
                and hnp.statusenabled =true"));

            $result[] = array(
                'norec_op' => $item->norec_op,
                'norec_pp' => $item->norec_pp,
                'prid' => $item->prid,
                'namaproduk' => $item->namaproduk,
                'keterangandetail' => $item->keterangandetail,
                'qtyproduk' => $item->qtyproduk,
                'tglpelayanan' => $item->tglpelayanan,
                'idruangan' => $item->objectruangantujuanfk,
                'ruangantujuan' => $item->ruangantujuan,
                'hargasatuan' => $item->hargasatuan,
                'namakelas' => $item->namakelas,
                'objectdepartemenfk' => $item->objectdepartemenfk,
                'namadepartemen' => $item->namadepartemen,
                'keterangan' => $item->keteranganlainnya,
                'keterangantindakan' => $item->keterangantindakan,
                'details' => $dataz,
            );
        }

        $result=array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($result);
    }
    public function savePelayananPasien(Request $request) {
        DB::beginTransaction();
        try{

            StrukOrder::where('norec', $request['norec_so'])->update(
                [
                    'statusorder' => 1
                ]
            );

//            if($request['norec_pp']=='') {
                $pd = PasienDaftar::where('norec',$request['norec_pd'])->first();
                $apd = AntrianPasienDiperiksa::where('noregistrasifk',$pd->norec)
                    ->where('objectruanganfk',$request['objectruangantujuanfk'])
                    ->where('statusenabled',true)
                    ->first();
                if(empty($apd)){
                    $dataAPD = new AntrianPasienDiperiksa;
                    $dataAPD->norec = $dataAPD->generateNewId();
                    $dataAPD->kdprofile = 0;
                    $dataAPD->objectasalrujukanfk = 1;
                    $dataAPD->statusenabled = true;
                    $dataAPD->objectkelasfk = 6;// $request['objectkelasfk'];
                    $dataAPD->noantrian = 1;
                    $dataAPD->noregistrasifk = $request['norec_pd'];
                    $dataAPD->objectpegawaifk = $request['objectpegawaiorderfk'];
                    $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
                    $dataAPD->statusantrian = 0;
                    $dataAPD->statuspasien = 1;
                    $dataAPD->objectstrukorderfk = $request['norec_so'];
                    $dataAPD->tglregistrasi = $pd->tglregistrasi;// date('Y-m-d H:i:s');
                    $dataAPD->tglmasuk = date('Y-m-d H:i:s');
                    $dataAPD->tglkeluar = date('Y-m-d H:i:s');
                    $dataAPD->save();

                    $dataAPDnorec = $dataAPD->norec;
                    $dataAPDtglPel = $dataAPD->tglregistrasi;
                }else{
                    $dataAPDnorec  = $apd->norec;
                    $dataAPDtglPel = $apd->tglregistrasi;
                }
//            else{
//                $dataAPD =  PelayananPasien::where('norec',$request['norec_pp'])->first();
//                $dataAPDnorec = $dataAPD->noregistrasifk;
//                $dataAPDtglPel = $dataAPD->tglregistrasi;
//
//                $HapusPP = PelayananPasien::where('strukorderfk', $request['norec_so'])->get();
//                foreach ($HapusPP as $pp){
//                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->delete();
//                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->delete();
//                }
//                $Edit = PelayananPasien::where('strukorderfk', $request['norec_so'])->delete();
//            }

            $antrian = AntrianPasienDiperiksa::where('norec',$dataAPDnorec)
                ->update([
                    'ispelayananpasien' => true
                ]);

            foreach ($request['bridging'] as $item){
                $PelPasien = new PelayananPasien();
                $PelPasien->norec = $PelPasien->generateNewId();
                $PelPasien->kdprofile = 0;
                $PelPasien->statusenabled = true;
                $PelPasien->noregistrasifk =  $dataAPDnorec;
                $PelPasien->tglregistrasi = $dataAPDtglPel;
                $PelPasien->hargadiscount = 0;
                $PelPasien->hargajual =  $item['hargasatuan'];
                $PelPasien->hargasatuan =  $item['hargasatuan'];
                $PelPasien->jumlah =  $item['qtyproduk'];
                $PelPasien->kelasfk =  $request['objectkelasfk'];
                $PelPasien->kdkelompoktransaksi =  1;
                $PelPasien->piutangpenjamin =  0;
                $PelPasien->piutangrumahsakit = 0;
                $PelPasien->produkfk =  $item['produkid'];
                $PelPasien->stock =  1;
                $PelPasien->strukorderfk =  $request['norec_so'];
                $PelPasien->tglpelayanan = date('Y-m-d H:i:s');
                $PelPasien->harganetto =  $item['hargasatuan'];

                $PelPasien->save();
                $PPnorec = $PelPasien->norec;


                $PelPasienPetugas = new PelayananPasienPetugas();
                $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                $PelPasienPetugas->kdprofile = 0;
                $PelPasienPetugas->statusenabled = true;
                $PelPasienPetugas->nomasukfk = $dataAPDnorec;
                $PelPasienPetugas->objectpegawaifk = $request['iddokterverif'];//$request['objectpegawaiorderfk'];

                $PelPasienPetugas->objectjenispetugaspefk = 4;//$jenisPetugasPe->objectjenispetugaspefk;
                $PelPasienPetugas->pelayananpasien = $PPnorec;
                $PelPasienPetugas->save();
                $PPPnorec = $PelPasienPetugas->norec;


                foreach ($item['komponenharga'] as $itemKomponen) {

                    $PelPasienDetail = new PelayananPasienDetail();
                    $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                    $PelPasienDetail->kdprofile = 0;
                    $PelPasienDetail->statusenabled = true;
                    $PelPasienDetail->noregistrasifk = $dataAPDnorec;
                    $PelPasienDetail->aturanpakai = '-';
                    $PelPasienDetail->hargadiscount = 0;
                    $PelPasienDetail->hargajual = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->hargasatuan = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->jumlah = 1;
                    $PelPasienDetail->keteranganlain = '-';
                    $PelPasienDetail->keteranganpakai2 = '-';
                    $PelPasienDetail->komponenhargafk = $itemKomponen['objectkomponenhargafk'];
                    $PelPasienDetail->pelayananpasien = $PPnorec;
                    $PelPasienDetail->piutangpenjamin = 0;
                    $PelPasienDetail->piutangrumahsakit = 0;
                    $PelPasienDetail->produkfk =  $item['produkid'];
                    $PelPasienDetail->stock = 1;
                    $PelPasienDetail->strukorderfk =  $request['norec_so'];
                    $PelPasienDetail->tglpelayanan =$dataAPDtglPel;
                    $PelPasienDetail->harganetto = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->save();
                    $PPDnorec = $PelPasienDetail->norec;
                    $transStatus = 'true';
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan PelayananPasien Sukses";
            DB::commit();
            
            // $ihs = null;
            // if ($request['objectruangantujuanfk'] != 576) {
            //     $objetoRequest = new \Illuminate\Http\Request();
            //     $objetoRequest['noorder'] = $request['noorder'];
            //     $ihs = app('App\Http\Controllers\Bridging\IHSController')->Specimen($objetoRequest, true);
            // }
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPP' => $PelPasien,
//                'dataPPP' => $PelPasienPetugas,
                'dataPPD' => $PelPasienDetail,
                // 'Specimen' => $ihs,
                'as' => 'ramdanegie',
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
//        return $this->respond();
    }
    public function deleteOrderPelayanan(Request $request) {

        DB::beginTransaction();
        try{
            $dataOP = OrderPelayanan::where('norec',$request['norec_op'])->delete();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " OrderPelayanan";
        }
        if ($transStatus == 'true') {
            $transMessage = "Delete Order Pelayanan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
//                "nokirim" => $dataSO,//$noResep,,//$noResep,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Delete Order Pelayanan gagal!!";
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
    public function hapusOrderPenunjang(Request $request) {

        DB::beginTransaction();
        try{
            StrukOrder::where('norec',$request['norec'])->update(
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
            $transMessage = "Hapus Order Gagal";
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


    public function saveHasilRadiologi(Request $request) {

        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilRadiologi();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilRadiologi::where('norec',$request['norec'])->first();
            }
            $dataSO->tanggal =$request['tglinput'];
            $dataSO->pegawaifk = $request['dokterid'];
            if(isset( $request['nofoto'])){
                $dataSO->nofoto = $request['nofoto'];
            }
            $dataSO->keterangan = $request['keterangan'];
            $dataSO->pelayananpasienfk = $request['pelayananpasienfk'];
            $dataSO->noregristrasifk = $request['norec_pd'];
            $dataSO->acc_number = $request['acc_number'];
            $dataSO->tanggalcetak =$request['tglinputcetak'];
            $dataSO->dokterperujuk = $request['dokterperujukid'];
            $dataSO->ruanganperujukfk =$request['ruanganperujukid'];
            $dataSO->petugasekspertise =$request['petugasekspertise'];
            $dataSO->norecapd = $request['norecapd'];
            if (isset($request['tglbaca'])) {
                $dataSO->tanggalbacaradiologi = $request['tglbaca'];
            }
           
            $dataSO->save();

            $dataPD =  AntrianPasienDiperiksa::where('norec', $request['norecapd'])->first();
            if (isset($request['tglbaca'])) {
                $dataPD->tanggalbacaradiologi = $request['tglbaca'];
            }
            $dataPD->save();
//
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveHasilRadiologiBeforeEdit(Request $request) {

        DB::beginTransaction();
        try{

            if ($request['norec']=="") {
                $dataSO = new HasilRadiologiBeforeEdit();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilRadiologiBeforeEdit::where('norec',$request['norec'])->first();
            }
            // return($request['petugasekspertise']);
            // die();
            $dataSO->tanggal =$request['tglinput'];
            $dataSO->pegawaifk = $request['dokterid'];
            if(isset( $request['nofoto'])){
                $dataSO->nofoto = $request['nofoto'];
            }
            $dataSO->keterangan = $request['keterangan'];
            $dataSO->pelayananpasienfk = $request['pelayananpasienfk'];
            $dataSO->noregristrasifk = $request['norec_pd'];
            $dataSO->acc_number = $request['acc_number'];
            $dataSO->tanggalcetak =$request['tglinputcetak'];
            $dataSO->dokterperujuk = $request['dokterperujukid'];
            $dataSO->ruanganperujukfk =$request['ruanganperujukid'];
            $dataSO->petugasekspertise =$request['petugasekspertise'];
            $dataSO->save();

//
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getHasilRadiologi(Request $request) {
        $data = DB::table('hasilradiologi_t as ar')
            ->leftjoin('pelayananpasien_t as pp', 'pp.norec', '=', 'ar.pelayananpasienfk')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->leftjoin('produk_m as pdk', 'pdk.id', '=', 'pp.produkfk')
            // ->leftjoin('pasiendiperiksa_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->leftjoin('antrianpasiendiperiksa_t as apd1', 'apd1.objectruanganfk', '=', 'apd.objectruanganasalfk', 'pd.norec', '=', 'apd1.noregistrasifk')
            // ->leftjoin('antrianpasiendiperiksa_t as apd1', 'apd1.noregistrasifk', '=', 'apd.noregistrasifk', 'apd1.objectruanganfk', '=', 'apd.objectruanganasalfk')
            ->leftJoin('antrianpasiendiperiksa_t as apd1',function($join)
            {
                $join->on('apd1.noregistrasifk', '=', 'apd.noregistrasifk');
                $join->on('apd1.objectruanganfk', '=', 'apd.objectruanganasalfk');
            })
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ar.pegawaifk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'ar.dokterperujuk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'ar.ruanganperujukfk')
            -> select('ar.*','pg.namalengkap','pg2.namalengkap as namadokterperujuk','ru.namaruangan', 'pp.isclaim', 'ru.objectdepartemenfk', 'apd1.tglmasuk', 'apd1.tglkeluar', 'apd1.objectruanganfk', 'apd.objectruanganasalfk', 'pdk.mintime', 'pdk.maxtime', 'ar.petugasekspertise')
            ->where('ar.statusenabled',true)
            ->where('ar.pelayananpasienfk',$request['norec_pp'])
            ->orderBy('apd1.tglmasuk', 'desc')
            ->get(1);
        // if ($data == null || $data ='')
        // {
        //     $data = DB::table('templethasil')
        //     ->select('*');
        //     if(isset($request['produkfk']) && $request['produkfk']!=''){
        //         $data=$data->where('produkfk', $request['produkfk']) ;
        //     }
        //     if(isset($request['objectpegawaifk']) && $request['objectpegawaifk']!=''  && $request['objectpegawaifk'] !=  'undefined'){
        //         $data=$data->where('objectpegawaifk','=',$request['objectpegawaifk']) ;
        //     }
            

        //     $res['data'] =$data->get();
        //     return $this->respond($res);
        // }
        return $this->respond($data);
    }
    
    public function getHasilRadiologiClaim(Request $request) {
        $data = DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('hasilradiologi_t as ar', 'ar.pelayananpasienfk', '=', 'pp.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ar.pegawaifk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'ar.dokterperujuk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'ar.ruanganperujukfk')
            ->select('ar.*','pg.namalengkap','pg2.namalengkap as namadokterperujuk','ru.namaruangan', 'pp.isclaim')
            ->where('apd.objectruanganfk', 576)
            ->where('pp.isclaim',true)
            ->where('pd.statusenabled',true)
            ->where('apd.statusenabled',true)
            ->where('pp.statusenabled',true)
            ->where('ar.statusenabled',true)
            ->where('pd.noregistrasi', $request['noregistrasi'] )
            ->get();
        return $this->respond($data);
    }

    public function getHasilLabClaim(Request $request) {
        $data = DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pp.objectpegawaipengirimfk')
            ->leftjoin('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
            ->leftjoin('pegawai_m as pg1', 'pg1.id', '=', 'ptu.objectpegawaifk')
            ->leftjoin('hasillaboratorium_t as hl', 'hl.norecpelayanan', '=', 'pp.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganasalfk')
            ->select('pp.isclaim', 'pd.norec as norec_pd', 'apd.norec as norec_apd', 'pp.norec as norec_pp', 'pp.tglpelayanan', 'pg.id as iddokterpengirim', 'pg.namaexternal as dokterpengirim', 'pg1.id as iddokterpemeriksa', 'pg1.namaexternal as dokterpemeriksa', 'hl.tglhasil', 'ru.namaruangan')
            ->where('apd.objectruanganfk', 575)
            ->where('pp.isclaim',true)
            ->where('pd.statusenabled',true)
            ->where('apd.statusenabled',true)
            ->where('pp.statusenabled',true)
            ->where('pd.noregistrasi', $request['noregistrasi'] )
            ->distinct()
            ->get();
        return $this->respond($data);
    }

     public function getnokantong(Request $request) {
        $data = DB::table('kantongdarah_t as ar')          
            -> select('nokantong')
            // ->where('ar.statusenabled',true)
            ->where('norecpp',$request['norec_pp'])
            ->get();
        return $this->respond($data);
    }
    // ini yg asli 7-5 asar
    // public function getHasilRadiologi(Request $request) {
    //     $data = DB::table('hasilradiologi_t as ar')
    //         ->leftjoin('pelayananpasien_t as pp', 'pp.norec', '=', 'ar.pelayananpasienfk')
    //         ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ar.pegawaifk')
    //         ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'ar.dokterperujuk')
    //         ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'ar.ruanganperujukfk')
    //         -> select('ar.*','pg.namalengkap','pg2.namalengkap as namadokterperujuk','ru.namaruangan', 'pp.isclaim')
    //         ->where('ar.statusenabled',true)
    //         ->where('ar.pelayananpasienfk',$request['norec_pp'])
    //         ->get();
    //     // if ($data == null || $data ='')
    //     // {
    //     //     $data = DB::table('templethasil')
    //     //     ->select('*');
    //     //     if(isset($request['produkfk']) && $request['produkfk']!=''){
    //     //         $data=$data->where('produkfk', $request['produkfk']) ;
    //     //     }
    //     //     if(isset($request['objectpegawaifk']) && $request['objectpegawaifk']!=''  && $request['objectpegawaifk'] !=  'undefined'){
    //     //         $data=$data->where('objectpegawaifk','=',$request['objectpegawaifk']) ;
    //     //     }
            

    //     //     $res['data'] =$data->get();
    //     //     return $this->respond($res);
    //     // }
    //     return $this->respond($data);
    // }

    //  public function getnokantong(Request $request) {
    //     $data = DB::table('kantongdarah_t as ar')          
    //         -> select('nokantong')
    //         // ->where('ar.statusenabled',true)
    //         ->where('norecpp',$request['norec_pp'])
    //         ->get();
    //     return $this->respond($data);
    // }

    public function savenokantong(Request $request) {

        DB::beginTransaction();
        try{

            
            $norecupdate2 = DB::select(DB::raw("select TOP (1) * from kantongdarah_t where norecpp =  '".$request['norecpp']."' "));
                $x=1;
                foreach ($norecupdate2 as $itemc){
                    $x=0;
                   
                }
                if($x!=0){
                     $insertcuy = DB::insert("insert into  kantongdarah_t values ('".$request['norecpp']."','".$request['nokantong']."')"
            
                    );    
                }else{
                     $updatecuy = DB::update("update  kantongdarah_t set nokantong ='".$request['nokantong']."'  where norecpp='".$request['norecpp']."' ");

            

                }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
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
    public function saveHasilRadiologiDokter(Request $request) {

        DB::beginTransaction();
        try{

            if ($request['nofoto']=="") {
                $dataSO = new HasilRadiologi();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
            }else {
                $dataSO =  HasilRadiologi::where('nofoto',$request['nofoto'])->first();
            }
            $dataSO->tanggal =$request['tglinput'];
            $dataSO->pegawaifk = $request['dokterid'];
            $dataSO->nofoto = $request['nofoto'];
            $dataSO->keterangan = $request['keterangan'];
            $dataSO->pelayananpasienfk = $request['pelayananpasienfk'];
            $dataSO->noregristrasifk = $request['norec_pd'];
            $dataSO->save();

//
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';

        }

        if ($transStatus == 'true') {

            $transMessage = "Simpan";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );

        } else {
            $transMessage = "Simpan  gagal!!";
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
    public function getPelPasienRad(Request $r){
        $data = PelayananPasien::where('strukorderfk',$r['norec'])
        ->where('produkfk',$r['produkfk'])
        ->first();
        return $this->respond($data);
    }
     public function getDetailVerifLabRad(Request $r){
        // $kdProfile = $this->getDataKdProfile($r);
        $data= DB::select(DB::raw("select 
            pp.tglpelayanan,pp.jumlah,pp.hargasatuan,(pp.jumlah*pp.hargasatuan) as total,
            prd.namaproduk
            from pelayananpasien_t as pp
            join produk_m as prd on prd.id=pp.produkfk
            where pp.strukorderfk='$r[norec_so]'"));
        $res = array(
            "data" => $data,
            "as" => 'er@epic'
        );
        return $this->respond($res);

    }

    public function updatemodality(Request $request){
        

    }
}
