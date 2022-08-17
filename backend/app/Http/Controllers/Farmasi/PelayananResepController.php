<?php
//“Great men are not born great, they grow great . . .”
//― Mario Puzo, The Godfather
/**
 * FarmasiController
 * Created by PhpStorm.
 * User: as@epic
 * Date: 08/08/2017
 * Time: 12:48
 */
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 09/08/2019
 * Time: 10:27
 */

namespace App\Http\Controllers\Farmasi;

use App\Http\Controllers\ApiController;
use App\Transaksi\LoggingUser;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasienObatKronis;
use App\Transaksi\StokProdukAdjusment;
use App\Transaksi\StrukClosing;
use App\Transaksi\StrukOrderBatalVerif;
use App\Transaksi\StrukOrderBatalVerifDetail;
// use App\Transaksi\PelayananPasien;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;

use App\Transaksi\PelayananObatTap;
use App\Transaksi\StrukOrder;
use App\Transaksi\StrukResep;
use App\Master\Pegawai;
use App\Master\LoginUser;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\StokProdukDetail;
use App\Transaksi\KartuStok;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\StrukRetur;
use App\Transaksi\PelayananPasienRetur;
use App\Transaksi\AntrianApotik;
use App\Transaksi\CetakEtiket;
use App\Master\Produk;
use App\Transaksi\AntrianPasienRegistrasi;



class PelayananResepController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataPengkajian(Request $request)
    {
        $dataLogin = $request->all();
        $results = DB::select(
            DB::raw("select pd.norec as norec_pd,pd.noregistrasi,kp.kelompokpasien,rk.namarekanan,pv.beratbadan,
            pg.id as pgid, pg.namalengkap as namadokterdpjp, kls.namakelas ,kls2.namakelas as kelasrawat,kmr.namakamar
            from pasiendaftar_t as pd
            left JOIN kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
            left JOIN rekanan_m as rk on rk.id=pd.objectrekananfk
            left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            left JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk
            left JOIN paptandavital_t as pv on pv.objectpasienfk=apd.norec
            left join pemakaianasuransi_t as pa on pa.noregistrasifk = pd.norec
            left join asuransipasien_m as asu on asu.id = pa.objectasuransipasienfk
            left join kelas_m as kls on kls.id = asu.objectkelasdijaminfk
            left join kelas_m as kls2 on kls2.id = apd.objectkelasfk
            left join kamar_m as kmr on kmr.id = apd.objectkamarfk
            where apd.norec=:norec_apd;"),
            array(
                'norec_apd' => $request['norec_apd'],
            )
        );




        $result = array(
            'detailPD' => $results,
            //            'datalogin' => $dataPegawaiUser,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getTransaksiPelayananApotik(Request $request)
    {
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $regEtiket =  $request['noReg'];
        }
        $etiket = DB::select(DB::raw("select v_cetaketiket.jeniskemasanfk,v_cetaketiket.rke,v_cetaketiket.norec,v_cetaketiket.noresep,v_cetaketiket.nocm,v_cetaketiket.namaruangan,v_cetaketiket.waktu,v_cetaketiket.jumlah,v_cetaketiket.dokterresep,v_cetaketiket.carapemberian,
            v_cetaketiket.waktuminum,case when ppok.jumlah is null then v_cetaketiket.jumlah else  ppok.jumlah+v_cetaketiket.jumlah end as jumlahtotal,  v_cetaketiket.tanggal,v_cetaketiket.tgllahir,v_cetaketiket.namapasien,v_cetaketiket.namaproduk,
            v_cetaketiket.aturanpakai,v_cetaketiket.keteranganpakai,v_cetaketiket.ispagi,v_cetaketiket.issiang,v_cetaketiket.issore,
            v_cetaketiket.ismalam,v_cetaketiket.satuanstandar,v_cetaketiket.tglkadaluarsa from v_cetaketiket  
            left join pelayananpasienobatkronis_t as ppok on v_cetaketiket.strukresepfk = ppok.strukresepfk 
            and v_cetaketiket.produkfk = ppok.produkfk
            where v_cetaketiket.noregistrasi='$regEtiket'  and tt=1  
            order by v_cetaketiket.namaproduk"));
        
        
        $data10 = [];
        foreach ($etiket as $itemEtiket) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($itemEtiket->noresep==$data10[$i]['noresep']  && $itemEtiket->rke==$data10[$i]['rke'] && $itemEtiket->jeniskemasanfk==$data10[$i]['jeniskemasanfk']) {
                    $sama = true;
                    $data10[$i]['namaproduk']=$data10[$i]['namaproduk'].','.$itemEtiket->namaproduk;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                 $data10[] = array(
                    'noresep' => $itemEtiket->noresep,
                    'nocm' => $itemEtiket->nocm,
                    'namaruangan' => $itemEtiket->namaruangan,
                    'waktu' => $itemEtiket->waktu,
                    'jumlah' => $itemEtiket->jumlah,
                    'dokterresep' => $itemEtiket->dokterresep,
                    'carapemberian' => $itemEtiket->carapemberian,
                    'waktuminum' => $itemEtiket->waktuminum,
                    'jumlahtotal' => $itemEtiket->jumlahtotal,
                    'tglpelayanan' => $itemEtiket->tanggal,
                    'tgllahir' => $itemEtiket->tgllahir,
                    'namapasien' => $itemEtiket->namapasien,
                    'namaproduk' => $itemEtiket->namaproduk,
                    'ismalam' => $itemEtiket->ismalam,
                    'satuanstandar' => $itemEtiket->satuanstandar,
                    'tglkadaluarsa' => $itemEtiket->tglkadaluarsa,
                    'rke' => $itemEtiket->rke,
                    'ispagi' => $itemEtiket->ispagi,
                    'issore' => $itemEtiket->issore,
                    'issiang' => $itemEtiket->issiang,
                    'noregistrasi'=> $regEtiket,
                    'norecpp'=> $itemEtiket->norec,
                    'keteranganpakai'=> $itemEtiket->keteranganpakai,
                    'aturanpakai'=> $itemEtiket->aturanpakai,
                    'jeniskemasanfk'=> $itemEtiket->jeniskemasanfk,
                    'hargasatuan'=> '0',
                    'hargadiscount'=> '0',
                    'jasa'=> '0',
                    'total'=> '0',
                    'kadaluarsa'=>''
                );
            }
        }
        if(count($data10)>0){
            $HapusPPD = CetakEtiket::where('noregistrasi', $regEtiket)->delete();
            foreach ($data10 as $simpan) {
                $dataPD = new CetakEtiket();
                $dataPD->norec = $dataPD->generateNewId();
                $dataPD->noresep = $simpan['noresep'];
                $dataPD->nocm = $simpan['nocm'];
                $dataPD->namaruangan = $simpan['namaruangan'];
                $dataPD->waktu = $simpan['waktu'];
                $dataPD->jumlah = $simpan['jumlah'];
                $dataPD->dokterresep = $simpan['dokterresep'];
                $dataPD->carapemberian = $simpan['carapemberian'];
                $dataPD->waktuminum = $simpan['waktuminum'];
                $dataPD->jumlahtotal = $simpan['jumlahtotal'];
                $dataPD->tanggal = $simpan['tglpelayanan'];
                $dataPD->tgllahir = $simpan['tgllahir'];
                $dataPD->namapasien = $simpan['namapasien'];
                $dataPD->namaproduk = $simpan['namaproduk'];
                $dataPD->ismalam = $simpan['ismalam'];
                $dataPD->satuanstandar = $simpan['satuanstandar'];
                $dataPD->tglkadaluarsa = $simpan['tglkadaluarsa'];
                $dataPD->rke = $simpan['rke'];
                $dataPD->ispagi = $simpan['ispagi'];
                $dataPD->issore = $simpan['issore'];
                $dataPD->issiang = $simpan['issiang'];
                $dataPD->noregistrasi = $simpan['noregistrasi'];
                $dataPD->norecpp = $simpan['norecpp'];
                $dataPD->keteranganpakai = $simpan['keteranganpakai'];
                $dataPD->aturanpakai = $simpan['aturanpakai'];
                $dataPD->save();
            }
        }
        return $this->respond($data10);
        $detail = $request->all();
        $result = [];
        $data = \DB::table('pelayananpasien_t as pp')
        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->JOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->JOIN('jeniskemasan_m as jkm', 'jkm.id', '=', 'pp.jeniskemasanfk')
        ->leftJoin('jenisracikan_m as jra', 'jra.id', '=', 'pp.jenisobatfk')
        ->leftJoin('satuanstandar_m as ss', 'ss.id', '=', 'pp.satuanviewfk')
        ->leftJoin('satuanstandar_m as ss2', 'ss2.id', '=', 'pr.objectsatuanstandarfk')
        ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
        ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        ->leftJOIN('konversisatuan_t as ks', function ($join) {
            $join->on('ks.objekprodukfk', '=', 'pr.id')
            ->on('ks.satuanstandar_tujuan', '=', 'pp.satuanviewfk');
        })
            ->leftJOIN('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            // ->leftjoin('logginguser_t as lu','lu.noreff','=','sr.norec')
            // ->leftjoin('loginuser_s as log','log.id','=','lu.objectloginuserfk')
            // ->leftjoin('pegawai_m as pm','pm.id','=','log.objectpegawaifk')
            ->leftJOIN('ruangan_m as ru2', 'ru2.id', '=', 'sr.ruanganfk')
            ->leftJOIN('ruangan_m as ru3', 'ru3.id', '=', 'apd.objectruanganfk')
            ->leftJOIN('departemen_m as dp', 'dp.id', '=', 'ru3.objectdepartemenfk')
            ->leftJOIN('pegawai_m as dok', 'dok.id', '=', 'sr.penulisresepfk')
            ->leftJOIN('rm_sediaan_m AS rs', 'rs.id', '=', 'pr.objectsediaanfk')
            ->leftJOIN('strukorder_t AS so', 'so.norec', '=', 'sr.orderfk')
            ->select(
                'pp.keteranganpakai',
                'pp.norec',
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'ss.satuanstandar',
                'pp.jumlah',
                'pp.hargasatuan',
                'pp.hargadiscount',
                'sp.nostruk',
                'pd.noregistrasi',
                'ks.nilaikonversi',
                'ss2.satuanstandar as satuanstandar2',
                'sr.noresep',
                'sr.norec as norec_resep',
                'pp.rke',
                'jkm.jeniskemasan',
                'jk.id as jkid',
                'pp.jenisobatfk',
                'jra.jenisracikan',
                'pp.jasa',
                'ru2.id as ruangandepoid',
                'ru2.namaruangan as ruangandepo',
                'pp.aturanpakai',
                'ru.namaruangan',
                'dok.namalengkap as dokter',
                'pp.ispagi',
                'pp.issiang',
                'pp.ismalam',
                'pp.issore',
                'sr.isreseppulang',
                'so.tglorder',
                'pp.dosisobat',
                'pp.objectwaktuminumfk',
                'ru3.objectdepartemenfk',
                DB::raw("CASE WHEN pr.kekuatan IS NOT NULL AND rs.name IS NOT NULL THEN pr.kekuatan || ' ' || rs.name ELSE '' END AS kekuatan")
            )
            // ->where('jp.id',97)
            ->whereNotNull('pp.isobat')
            ->orderBy('pp.tglpelayanan', 'pp.rke');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data = $data->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norec_resep']);
        }
        if (isset($request['ruanganfk']) && $request['ruanganfk'] != "" && $request['ruanganfk'] != "undefined") {
            $data = $data->where('sr.ruanganfk', '=', $request['ruanganfk']);
        }
        $data = $data->get();

        $data2 = \DB::table('pelayananpasien_t as pp')
        ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
        ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
        ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->JOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->JOIN('jeniskemasan_m as jkm', 'jkm.id', '=', 'pp.jeniskemasanfk')
        ->leftJoin('jenisracikan_m as jra', 'jra.id', '=', 'pp.jenisobatfk')
        ->leftJoin('satuanstandar_m as ss', 'ss.id', '=', 'pp.satuanviewfk')
        ->leftJoin('satuanstandar_m as ss2', 'ss2.id', '=', 'pr.objectsatuanstandarfk')
        ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
        ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
        ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        ->leftJOIN('konversisatuan_t as ks', function ($join) {
            $join->on('ks.objekprodukfk', '=', 'pr.id')
            ->on('ks.satuanstandar_tujuan', '=', 'pp.satuanviewfk');
        })
            ->leftJOIN('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            // ->leftjoin('logginguser_t as lu','lu.noreff','=','sr.norec')
            // ->leftjoin('loginuser_s as log','log.id','=','lu.objectloginuserfk')
            // ->leftjoin('pegawai_m as pm','pm.id','=','log.objectpegawaifk')
            ->leftJOIN('ruangan_m as ru2', 'ru2.id', '=', 'sr.ruanganfk')
            ->leftJOIN('ruangan_m as ru3', 'ru3.id', '=', 'apd.objectruanganfk')
            ->leftJOIN('pegawai_m as dok', 'dok.id', '=', 'sr.penulisresepfk')
            ->leftJOIN('rm_sediaan_m AS rs', 'rs.id', '=', 'pr.objectsediaanfk')
            ->leftJOIN('strukorder_t AS so', 'so.norec', '=', 'sr.orderfk')
            ->join('stokprodukdetail_t as spd',  function ($join) {
                $join->on('spd.objectprodukfk', '=', 'pp.produkfk')
                ->on('spd.nostrukterimafk', '=', 'pp.strukterimafk');
            })
            ->select(
                'spd.tglkadaluarsa',
                'pp.keteranganpakai',
                'pp.norec',
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'ss.satuanstandar',
                'pp.jumlah',
                'pp.hargasatuan',
                'pp.hargadiscount',
                'sp.nostruk',
                'pd.noregistrasi',
                'ks.nilaikonversi',
                'ss2.satuanstandar as satuanstandar2',
                'sr.noresep',
                'sr.norec as norec_resep',
                'pp.rke',
                'jkm.jeniskemasan',
                'jk.id as jkid',
                'pp.jenisobatfk',
                'jra.jenisracikan',
                'pp.jasa',
                'ru2.id as ruangandepoid',
                'ru2.namaruangan as ruangandepo',
                'pp.aturanpakai',
                'ru.namaruangan',
                'dok.namalengkap as dokter',
                'pp.ispagi',
                'pp.issiang',
                'pp.ismalam',
                'pp.issore',
                'sr.isreseppulang',
                'so.tglorder',
                'pp.dosisobat',
                'pp.objectwaktuminumfk',
                'ru3.objectdepartemenfk',
                DB::raw("CASE WHEN pr.kekuatan IS NOT NULL AND rs.name IS NOT NULL THEN pr.kekuatan || ' ' || rs.name ELSE '' END AS kekuatan,
                	EXTRACT(Day from spd.tglkadaluarsa- now()) AS DateDifference,
                    case 
                    when EXTRACT(Day from spd.tglkadaluarsa- now()) < 30 then 'sebulan' 
                    when EXTRACT(Day from spd.tglkadaluarsa- now()) < 60 then 'lebihsebulan'
                    else 'lebihsebulan' 
                    end as kadaluarsa")
            )
            // ->where('jp.id',97)
            ->whereNotNull('pp.isobat')
            ->orderBy('pp.tglpelayanan', 'pp.rke');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data2 = $data2->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data2 = $data2->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data2 = $data2->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data2 = $data2->where('sr.norec', '=', $request['norec_resep']);
        }
        if (isset($request['ruanganfk']) && $request['ruanganfk'] != "" && $request['ruanganfk'] != "undefined") {
            $data2 = $data2->where('sr.ruanganfk', '=', $request['ruanganfk']);
        }
        $data2 = $data2->get();

        $rke = 0;
        foreach ($data as $item) {
            if (isset($item->nilaikonversi)) {
                $nKonversi = $item->nilaikonversi;
            } else {
                $nKonversi = 1;
            }
            if (isset($item->satuanstandar)) {
                $ss = $item->satuanstandar;
            } else {
                $ss = $item->satuanstandar2;
            }
            $JenisKemasan = $item->jeniskemasan;
            if (isset($item->jenisracikan)) {
                $JenisKemasan = $item->jeniskemasan . '/' . $item->jenisracikan;
            }
            //            $tarifjasa =0;
            //            $qty20 =0;
            //            if ($item->jkid == 2){
            //                $tarifjasa = 800;
            //            }
            ////            $rke = 0;
            //            if ($item->rke != $rke) {
            //                if ($item->jkid == 1) {
            //                    $rke=$item->rke;
            //                    $qty20 = number_format($item->jumlah / 20, 0);
            //                    if ($item->jumlah % 20 == 0) {
            //                        $qty20 = $qty20;
            //                    } else {
            //                        $qty20 = $qty20 + 1;
            //                    }
            //
            //                    $tarifjasa = 800 * $qty20;
            //                }
            //            }
            $jasa = 0;
            if (isset($item->jasa) && $item->jasa != "" && $item->jasa != "undefined") {
                $jasa = $item->jasa;
            }
            $tglkadaluarsa = '';
            $kadaluarsa = '';
            foreach ($data2 as $item2) {
                if ($item->produkfk == $item2->produkfk) {
                    $tglkadaluarsa = $item2->tglkadaluarsa;
                    $kadaluarsa = $item2->kadaluarsa;
                    break;
                }
            }
            $result[] = array(
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'tglpelayanan' => $item->tglpelayanan,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'satuanstandar' => $ss,
                'jumlah' => (float)$item->jumlah / (float)$nKonversi,
                'hargasatuan' => $item->hargasatuan,
                'hargadiscount' => $item->hargadiscount,
                'nostruk' => $item->nostruk,
                'noregistrasi' => $item->noregistrasi,
                'noresep' => $item->noresep, // .'/'.$item->noregistrasi,
                'rke' => $item->rke,
                'jeniskemasan' => $JenisKemasan,
                'norec_resep' =>  $item->norec_resep,
                'detail' => $detail,
                'jasa' => $jasa,
                'depoid' => $item->ruangandepoid,
                'namaruangandepo' => $item->ruangandepo,
                'aturanpakai' => $item->aturanpakai,
                'dokter' => $item->dokter,
                'namaruangan' => $item->namaruangan,
                'kekuatan' => $item->kekuatan,
                'ispagi' => $item->ispagi,
                'issiang' => $item->issiang,
                'ismalam' => $item->ismalam,
                'issore' => $item->issore,
                'reseppulang' => $item->isreseppulang,
                'tglorder' => $item->tglorder,
                // 'namauser' => $item->namaLengkap
                'namauser' => '',
                'dosisobat' => $item->dosisobat,
                'ispagi' => $item->ispagi,
                'issiang' => $item->issiang,
                'ismalam' => $item->ismalam,
                'issore' => $item->issore,
                'norecpp' => $item->norec,
                'keteranganpakai' => $item->keteranganpakai,
                'tglkadaluarsa' => $tglkadaluarsa,
                'kadaluarsa' => $kadaluarsa,
                'objectdepartemenfk' =>  $item->objectdepartemenfk

            );
        }
        return $this->respond($result);
    }

    // <<<<<<< HEAD

    //     public function getDetailRegApotik(Request $request)
    //     {
    // =======

    public function getTransaksiDosisRM(Request $request)
    {
        $detail = $request->all();
        $result = [];
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->select('pp.produkfk', 'pr.namaproduk', 'pp.dosisobat',
            DB::raw("CASE WHEN pp.isrm is null THEN 'Tambah' ELSE 'Hapus' END AS isrm, 
            case when pp.frekuensi is null then pp.aturanpakai else pp.frekuensi end as frekuensi"))
            ->whereIn('pr.objectkelompokprodukbpjsfk', [13, 14, 15])
            ->whereNotNull('pp.isobat')
            ->where('pp.isrm',true)
            ->orderBy('pp.produkfk');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data = $data->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norec_resep']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $rke = 0;
        $dosisobat = '';
        $produkfk = '';
        foreach ($data as $item) {
            if ($produkfk != $item->produkfk) {
                $produkfk = $item->produkfk;
                $dosisobat = $item->dosisobat;
                $result[] = array(
                    'produkfk' => $item->produkfk,
                    'dosisobat' => $dosisobat,
                    'namaproduk' => $item->namaproduk,
                    'isrm' => $item->isrm,
                    'frekuensi' => $item->frekuensi,
                );
            }
        }
        return $this->respond($result);
    }

    public function getTransaksiDosisPulangRM(Request $request)
    {
        $detail = $request->all();
        $result = [];
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->LEFTJOIN('routefarmasi AS rt', 'rt.id', '=', 'pp.routefk')
            ->select('pp.norec', 'pp.produkfk', 'pr.namaproduk', 'pp.dosisobat', 'pp.jumlah',
            DB::raw("CASE WHEN pp.ispulang=true THEN 'Hapus' ELSE 'Tambah' END AS ispulang, 
            case when pp.frekuensi is null then pp.aturanpakai else pp.frekuensi end as frekuensi, 
            case when rt.name is null then pp.carapemberian else rt.name end as carapemberian "))
            ->whereIn('pr.objectkelompokprodukbpjsfk', [13, 14, 15,16,17])
            ->where('pp.ispulang', true)
            ->whereNotNull('pp.isobat')
            ->orderBy('pp.produkfk');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data = $data->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norec_resep']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $rke = 0;
        $dosisobat = '';
        $produkfk = '';
        foreach ($data as $item) {
            if ($produkfk != $item->produkfk) {
                $produkfk = $item->produkfk;
                $dosisobat = $item->dosisobat;
                $result[] = array(
                    'produkfk' => $item->produkfk,
                    'norec_pp' => $item->norec,
                    'dosisobat' => $dosisobat,
                    'namaproduk' => $item->namaproduk,
                    'jumlah' => $item->jumlah,
                    'frekuensi' => $item->frekuensi,
                    'ispulang' => $item->ispulang,
                    'carapemberian' => $item->carapemberian,
                );
            }
        }
        return $this->respond($result);
    }
    public function getTransaksiDosisPulangRMPop(Request $request)
    {
        $detail = $request->all();
        $result = [];
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->LEFTJOIN('routefarmasi AS rt', 'rt.id', '=', 'pp.routefk')
            ->select('pp.norec','pr.objectkelompokprodukbpjsfk', 'pp.produkfk', 'pr.namaproduk', 'pp.dosisobat', 'pp.jumlah',
            DB::raw("CASE WHEN pp.ispulang=true THEN 'Hapus' ELSE 'Tambah' END AS ispulang, 
            case when pp.frekuensi is null then pp.aturanpakai else pp.frekuensi end as frekuensi, 
            case when rt.name is null then '-' else rt.name end as carapemberian "))
            ->whereIn('pr.objectkelompokprodukbpjsfk', [13, 14, 15,16,17])
            ->whereNull('pp.ispulang')
            ->whereNotNull('pp.isobat')
            ->orderBy('pp.produkfk');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data = $data->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norec_resep']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $rke = 0;
        $dosisobat = '';
        $produkfk = '';
        foreach ($data as $item) {
            if ($produkfk != $item->produkfk) {
                $produkfk = $item->produkfk;
                $dosisobat = $item->dosisobat;
                $result[] = array(
                    'produkfk' => $item->produkfk,
                    'norec_pp' => $item->norec,
                    'dosisobat' => $dosisobat,
                    'namaproduk' => $item->namaproduk,
                    'jumlah' => $item->jumlah,
                    'frekuensi' => $item->frekuensi,
                    'ispulang' => $item->ispulang,
                    'carapemberian' => $item->carapemberian,
                    'kelompok'=> $item->objectkelompokprodukbpjsfk
                );
            }
        }
        return $this->respond($result);
    }
    
    public function getTransaksiDosisRMPop(Request $request)
    {
        $detail = $request->all();
        $result = [];
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->select('pp.produkfk', 'pr.namaproduk', 'pp.dosisobat',
            DB::raw("CASE WHEN pp.isrm is null THEN 'Tambah' ELSE 'Hapus' END AS isrm,  
            case when pp.frekuensi is null then pp.aturanpakai else pp.frekuensi end as frekuensi"))
            ->whereIn('pr.objectkelompokprodukbpjsfk', [13, 14, 15])
            ->whereNotNull('pp.isobat')
            ->where('pp.isrm', null)
            ->orderBy('pp.produkfk');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data = $data->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norec_resep']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $rke = 0;
        $dosisobat = '';
        $produkfk = '';
        foreach ($data as $item) {
            if ($produkfk != $item->produkfk) {
                $produkfk = $item->produkfk;
                $dosisobat = $item->dosisobat;
                $result[] = array(
                    'produkfk' => $item->produkfk,
                    'dosisobat' => $dosisobat,
                    'namaproduk' => $item->namaproduk,
                    'isrm' => $item->isrm,
                    'frekuensi' => $item->frekuensi,
                );
            }
        }
        return $this->respond($result);
    }
    
    public function getTransaksiStatusDosisRM(Request $request)
    {
        $detail = $request->all();
        $result = [];
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->select('pp.produkfk',
            DB::raw("CASE WHEN pp.isrm=1 THEN 'Tambah' ELSE 'Hapus' END AS isrm")
            )
            ->whereIn('pr.objectkelompokprodukbpjsfk', [13, 14, 15])
            ->whereNotNull('pp.isobat')
            ->orderBy('pp.produkfk');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data = $data->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norec_resep']);
        }
        $data = $data->distinct();
        $data = $data->get();

        $rke = 0;
        $produkfk = '';
        foreach ($data as $item) {
            if ($produkfk != $item->produkfk) {
                $produkfk = $item->produkfk;
                $result[] = array(
                    'produkfk' => $item->produkfk,
                    'isrm' => $item->isrm
                );
            }
        }
        return $this->respond($result);
    }

    public function getObatRM(Request $request)
    {
        return ($request['noregistrasi']);
        die();
        $noregistrasi = $request['noregistrasi'];

        $datapp = DB::select(DB::raw("SELECT DISTINCT pdk.namaproduk, pp.aturanpakai
        FROM pasiendaftar_t AS pd
        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec
        INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk=apd.norec
        INNER JOIN produk_m AS pdk ON pdk.id = pp.produkfk
        WHERE pd.noregistrasi = $noregistrasi AND pp.isobat=1 AND pdk.objectkelompokprodukbpjsfk IN ('13','14','15')
        "));

        $obatobat = '';
        if (count($datapp) != 0) {
            foreach ($datapp as $itempp) {
                if ($obatobat == '') {
                    $obatobat = $itempp->namaproduk . '(' . $itempp->aturanpakai . ')';
                } else {
                    $obatobat = $obatobat . ', ' . $itempp->namaproduk . '(' . $itempp->aturanpakai . ')';
                }
            }
        }
        return $this->respond($obatobat);
    }

    public function saveTransaksiDosisRM(Request $request)
    {
        //        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = 0; //(int) $kdProfile;
        DB::beginTransaction();
        // try{
        // return($request['dosisobat']);
        // die();
        foreach ($request['dosisobat'] as $key => $value) {
            $dataPP = DB::select(DB::raw(" SELECT        pp.norec as norecPP
                    FROM            pasiendaftar_t AS pd
                    INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                    INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                WHERE pd.noregistrasi = '$request[noregistrasi]' AND pp.produkfk = '$value[produkfk]'"));

            // return($dataPP);
            // die();
            foreach ($dataPP as $key => $valuePP) {
                // return($valuePP->norecPP);
                // die();
                $data = PelayananPasien::where('norec', $valuePP->norecpp)
                    ->update([
                        'dosisobat' => $value['dosisobat'],
                        'frekuensi' => $value['frekuensi'],
                    ]);
            }
        }

        $transStatus = 'true';
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            // dd($result);
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function saveTransaksiDosisPulangRM(Request $request)
    {
        //        $kdProfile = $this->getDataKdProfile($request);
        // $idProfile = 0; //(int) $kdProfile;
        DB::beginTransaction();
        // try{
        foreach ($request['dosisobat'] as $key => $value) {
            // return($value['carapemberians']);
            // die();
            // $dataPP = DB::select(DB::raw(" SELECT        pp.norec as norecPP
            //         FROM            pasiendaftar_t AS pd
            //         INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
            //         INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            //     WHERE pd.noregistrasi = '$request[noregistrasi]' AND pp.produkfk = '$value[produkfk]'"));

            // // return($dataPP);
            // // die();
            // foreach ($dataPP as $key => $valuePP) {
                // return($valuePP->norecPP);
                // die();
                $data = PelayananPasien::where('norec', $value['norec_pp'])
                    ->update([
                        'carapemberian' => $value['carapemberian'],
                        'frekuensi' => $value['frekuensi'],
                        'dosisobat' => $value['dosisobat'],
                    ]);
            }
        // }

        $transStatus = 'true';
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan  gagal!!";
            DB::rollBack();
            // dd($result);
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "e" => $e,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDetailRegApotik(Request $request)
    {
        // >>>>>>> 848949c7795e6bc79732dcfb31b4db07bcbb90f5
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            //            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
            //            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            //            ->JOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            //            ->leftJoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->JOIN('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            //            ->select('ru.namaruangan','pd.noregistrasi','ps.nocm','ps.namapasien','jk.jeniskelamin',
            //                'kp.id as kpid','kp.kelompokpasien','rk.namarekanan','kl.namakelas','kl.id as klid',
            //                'pd.tglregistrasi','pd.tglpulang','ps.tgllahir','rpp.noregistrasifk as rpp','pd.nostruklastfk')

            ->select(
                'ru.namaruangan',
                'pd.noregistrasi',
                'ru.objectdepartemenfk',
                'pd.tglregistrasi',
                'pg.namalengkap as namadokter',
                'kl.namakelas',
                'apd.tglmasuk',
                'apd.tglkeluar',
                'apd.norec',
                'pg.id as pgid'
            )
            ->orderBy('apd.tglmasuk');

        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $request['noregistrasi'] . '%');
        }
        //        $data = $data->where('dp.id','=',16);
        //        $data = $data->whereNull('pd.tglpulang');
        //        $data = $data->where('pd.tglregistrasi','>','2019-05-25 00:00');
        //        $data = $data->take(50);
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarPaketObatPasien(Request $request)
    {
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk', $dataLogin['userData']['id'])
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic) {
            $strRuangan[] = $epic->id;
        }
        $data = [];
        $data = \DB::table('strukkirim_t as sp')
            ->LEFTJOIN('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaipengirimfk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'sp.objectruanganasalfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'sp.objectruangantujuanfk')
            ->LEFTJOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'sp.noregistrasifk')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select(
                'sp.norec',
                'sp.tglkirim',
                'sp.nokirim',
                'sp.jenispermintaanfk',
                'pg.namalengkap',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'sp.keteranganlainnyakirim',
                'ps.namapasien',
                'pd.noregistrasi',
                'sp.noregistrasifk'
            );

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('sp.tglkirim', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('sp.tglkirim', '<=', $tgl);
        }
        if (isset($request['nokirim']) && $request['nokirim'] != "" && $request['nokirim'] != "undefined") {
            $data = $data->where('sp.nokirim', 'ilike', '%' . $request['nokirim']);
        }
        if (isset($request['ruangantujuanfk']) && $request['ruangantujuanfk'] != "" && $request['ruangantujuanfk'] != "undefined") {
            $data = $data->where('ru2.id', '=', $request['ruangantujuanfk']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        $data = $data->where('sp.statusenabled', true);
        $data = $data->where('sp.objectkelompoktransaksifk', 34);
        //        $data = $data->wherein('sp.objectruanganasalfk',$strRuangan);
        $data = $data->wherenotnull('sp.noregistrasifk');
        $data = $data->where('sp.noregistrasifk', '<>', '0');
        $data = $data->orderBy('sp.nokirim');
        $data = $data->get();

        $results = array();
        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("
                     select  pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk
                     from kirimproduk_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where nokirimfk=:norec and spd.qtyproduk <> 0"),
                array(
                    'norec' => $item->norec,
                )
            );
            $jeniskirim = '';
            if ($item->jenispermintaanfk == 1) {
                $jeniskirim = 'Amprahan';
            }
            if ($item->jenispermintaanfk == 2) {
                $jeniskirim = 'Transfer';
            }
            $results[] = array(
                'status' => 'Kirim Barang',
                'tglstruk' => $item->tglkirim,
                'nostruk' => $item->nokirim,
                'jeniskirim' => $jeniskirim,
                'norec' => $item->norec,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'petugas' => $item->namalengkap,
                'keterangan' => $item->keteranganlainnyakirim,
                'namapasien' => $item->namapasien,
                'noregistrasi' => $item->noregistrasi,
                'norec_apd' => $item->noregistrasifk,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
            'str' => $strRuangan,
        );

        return $this->respond($result);
    }
    public function DeletePelayananObatPerItem(Request $request)
    {
        //## StrukResep
        DB::beginTransaction();
        $r_SR = $request->all();
        try {

            $namauser = $request['datalogin']['namauser'];



            foreach ($r_SR['produk'] as $item) {

                $dataPasien = \DB::table('strukresep_t as sr')
                    ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'sr.pasienfk')
                    ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->JOIN('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
                    ->select('pm.namapasien', 'sr.noresep', 'pm.nocm')
                    ->where('sr.norec', $item['norec_resep'])
                    ->first();


                // $dataKs = KartuStok::where('keterangan', 'ilike', 'Pelayanan Obat Alkes '.' '. $dataPasien->noresep .' '. $dataPasien->nocm .' '. $dataPasien->namapasien .'%' )
                //     ->where('produkfk',$item['produkfk'])
                //     // ->first()
                //     ->update([
                //         'flagfk' => null
                //     ]);              
                //            return $this->respond($dataKs);

                $newSR = StrukResep::where('norec', $item['norec_resep'])->first();

                $norec_SR = $newSR->norec;
                $tgl_SR = $newSR->tglresep;
                $idRuangan_SR = $newSR->ruanganfk;


                //## PelayananPasien

                $newPP = PelayananPasien::where('strukresepfk', $norec_SR)
                    ->where('produkfk', $item['produkfk'])
                    ->get();
                $newPP2 = $newPP;
                foreach ($newPP as $r_PPL) {
                    $norec_PP = $r_PPL->norec;

                    $newPPD = PelayananPasienDetail::where('pelayananpasien', $norec_PP)->delete();
                    $newP3 = PelayananPasienPetugas::where('pelayananpasien', $norec_PP)->delete();

                    $qtyJumlah = (float)$item['jumlah'];

                    $produk = $r_PPL['produkfk'];
                    $GetNorec = StokProdukDetail::where('nostrukterimafk', $r_PPL['strukterimafk'])
                        ->where('objectruanganfk', $idRuangan_SR)
                        ->where('objectprodukfk', $produk)
                        ->orderBy('tglpelayanan', 'desc')
                        ->first();
                    $dataSPD = $GetNorec;
                    $saldo = (float)$GetNorec->qtyproduk + (float)$qtyJumlah;
                    $GetNorec->qtyproduk = $saldo;
                    $GetNorec->save();

                    $dataSaldoAwal = DB::select(
                        DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                            where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                        array(
                            'ruanganfk' => $idRuangan_SR,
                            'produkfk' => $item['produkfk'],
                        )
                    );
                    foreach ($dataSaldoAwal as $item2) {
                        $saldoAwal = (float)$item2->qty;
                    }
                    $newKS = new KartuStok();
                    $norecKS = $newKS->generateNewId();
                    $newKS->norec = $norecKS;
                    $newKS->kdprofile = 0;
                    $newKS->statusenabled = true;
                    $newKS->jumlah = $qtyJumlah;
                    $newKS->keterangan = 'Hapus Resep Pelayanan Obat Alkes ' . $dataPasien->noresep . ' ' . $dataPasien->nocm . ' ' . $dataPasien->namapasien . ' dihapus oleh ' . $namauser;
                    $newKS->produkfk = $r_PPL['produkfk'];
                    $newKS->ruanganfk = $idRuangan_SR;
                    $newKS->saldoawal = (float)$saldoAwal; // 0 (float)$qtyJumlah;
                    $newKS->status = 1;
                    $newKS->tglinput = date('Y-m-d H:i:s');
                    $newKS->tglkejadian = date('Y-m-d H:i:s');
                    $newKS->nostrukterimafk =  $r_PPL['strukterimafk'];
                    $newKS->norectransaksi = $norec_PP;
                    $newKS->tabletransaksi = 'pelayananpasien_t';
                    $newKS->save();
                    $transStatus = 'false';
                    $newPP = PelayananPasien::where('strukresepfk', $norec_SR)
                        // ->where('produkfk', $r_PPL['produkfk'])
                        ->where('norec', $norec_PP)
                        ->delete();
                    $transStatus = 'true';
                }
            }
        } catch (\Exception $e) {
            $transStatus = 'false';
//            $transMessage = "Simpan Pelayanan Pasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "stokprodukdetail" => $GetNorec, //$noResep,,//$noResep,
                "kartustok" => $newKS, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function DeletePelayananObatPerItemtap(Request $request)
    {
        //## StrukResep
        DB::beginTransaction();
        $r_SR = $request->all();
        try {
            $namauser = $request['datalogin']['namaLengkap'];
            foreach ($r_SR['produk'] as $item) {


                // foreach ($newPP as $r_PPL){

                $newPP = PelayananObatTap::where('norec', $item['norec_resep'])
                    ->delete();
                $transStatus = 'true';
                // }
            }
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Pelayanan Pasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "stokprodukdetail" => $GetNorec,//$noResep,,//$noResep,
                // "kartustok" => $newKS,//$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function DeletePelayananObatPerItem23(Request $request)
    {
        //## StrukResep
        DB::beginTransaction();
        $r_SR = $request->all();
        try {
            // $namauser = $request['datalogin']['namaLengkap'];
            foreach ($r_SR['produk'] as $item) {
 
                $newPP = PelayananPasienObatKronis::where('strukresepfk', $item['norec_resep'])
                ->where('produkfk',$item['produkfk'])
                    ->delete();
                $transStatus = 'true';
 
            }
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Pelayanan Pasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function DeletePelayananObat(Request $request)
    {
        //## StrukResep
        DB::beginTransaction();
        $r_SR = $request->all();
        try {

            $dataPasien = \DB::table('strukresep_t as sr')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'sr.pasienfk')
                ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->JOIN('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
                ->select('pm.namapasien', 'sr.noresep', 'pm.nocm')
                ->where('sr.norec', $r_SR['norec'])
                ->first();

            $dataKs = KartuStok::where('keterangan',  'Pelayanan Obat Alkes ' . ' ' . $dataPasien->noresep . ' ' . $dataPasien->nocm . ' ' . $dataPasien->namapasien)
                ->update([
                    'flagfk' => null
                ]);
            $dataKs = KartuStok::where('keterangan',  'Pelayanan Obat Alkes Kronis ' . ' ' . $dataPasien->noresep . ' ' . $dataPasien->nocm . ' ' . $dataPasien->namapasien)
                ->update([
                    'flagfk' => null
                ]);


            $newSR = StrukResep::where('norec', $r_SR['norec'])->first();
            if (isset($request['norec_order'])) {
                $newSR->orderfk = null;
            }
            $newSR->statusenabled = false;
            $newSR->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan StrukResep Pasien";
        }
        $norec_SR = $newSR->norec;
        $tgl_SR = $newSR->tglresep;
        $idRuangan_SR = $newSR->ruanganfk;


        //## PelayananPasien

        $newPP = PelayananPasien::where('strukresepfk', $norec_SR)->get();
        $newPP2 = $newPP;
        foreach ($newPP as $r_PPL) {
            $norec_PP = $r_PPL->norec;
            try {
                $newPPD = PelayananPasienDetail::where('pelayananpasien', $norec_PP)->delete();
                $newP3 = PelayananPasienPetugas::where('pelayananpasien', $norec_PP)->delete();

                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "delete PelayananPasienDetail & PelayananPasienPetugas";
            }


            $qtyJumlah = (float)$r_PPL['jumlah'] * (float)$r_PPL['nilaikonversi'];

            //## StokProdukDetail
            try {
                $produk = $r_PPL['produkfk'];
                $GetNorec = StokProdukDetail::where('nostrukterimafk', $r_PPL['strukterimafk'])
                    ->where('objectruanganfk', $idRuangan_SR)
                    ->where('objectprodukfk', $produk)
                    ->orderBy('tglpelayanan', 'desc')
                    ->first();
                $dataSPD = $GetNorec;
                $saldo = (float)$GetNorec->qtyproduk + (float)$qtyJumlah;
                $GetNorec->qtyproduk = $saldo; //$r_PPL['jumlah'];
                $GetNorec->save();
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "update Stok obat";
            }

            // $dataSaldoAwal = DB::select(DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
            //       where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
            //     array(
            //         'ruanganfk' => $idRuangan_SR,
            //         'produkfk' => $r_PPL['produkfk'],
            //     )
            // );

            // foreach ($dataSaldoAwal as $item){
            //     $saldoAwal = (float)$item->qty;
            // }
            //            $jmlPengurang =(float)$qtyJumlah;
            //            foreach ($GetNorec as $item){
            //                if ($item->qtyproduk > 0){
            //                    $newSPD = StokProdukDetail::where('norec',$item->norec)
            //                        ->first();
            //                    $kurangStok = (float)$jmlPengurang;
            //                    $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
            //                    $saldo = (float)$newSPD->qtyproduk + (float)$kurangStok;
            //                    $newSPD->qtyproduk = $saldo;//$r_PPL['jumlah'];
            //                    try {
            //                    $newSPD->save();
            //                        $transStatus = 'true';
            //                    } catch (\Exception $e) {
            //                        $transStatus = 'false';
            //                        $transMessage = "update Stok obat";
            //                    }
            //                }
            //            }

            $dataSaldoAwal = DB::select(
                DB::raw("select saldoawal,jumlah,status from KartuStok_t
                                  where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                array(
                    'ruanganfk' => $idRuangan_SR,
                    'produkfk' => $r_PPL['produkfk'],
                )
            );
            $saldoAwal = 0;
            foreach ($dataSaldoAwal as $item) {
                $saldoAwal = (float)$item->saldoawal + $qtyJumlah;
            }
            $tglnow1 =  date('Y-m-d H:i:s');
            $datastoknoterima =  KartuStok::where('produkfk', $r_PPL['produkfk'])
                ->where('ruanganfk', $idRuangan_SR)
                ->where('created_at', '<', $tglnow1)
                ->where('nostrukterimafk', $r_PPL['strukterimafk'])
                ->whereNotNull('saldonoterima')
                ->orderBy('tglinput', 'desc')
                ->take(1)
                ->get();

            $stoknoterima = NULL;
            foreach ($datastoknoterima as $itemz) {
                if ($itemz->status == false) {
                    $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                } else {
                    $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                }
            }

            //## KartuStok
            $newKS = new KartuStok();
            $norecKS = $newKS->generateNewId();
            $newKS->norec = $norecKS;
            $newKS->kdprofile = 0;
            $newKS->statusenabled = true;
            $newKS->jumlah = $qtyJumlah;
            $newKS->keterangan = 'Hapus Resep Pelayanan Obat Alkes ' . $dataPasien->noresep . ' ' . $dataPasien->nocm . ' ' . $dataPasien->namapasien;;
            $newKS->produkfk = $r_PPL['produkfk'];
            $newKS->ruanganfk = $idRuangan_SR;
            $newKS->saldoawal = (float)$saldoAwal; // 0 (float)$qtyJumlah;
            $newKS->status = 1;
            $newKS->tglinput = date('Y-m-d H:i:s');
            $newKS->tglkejadian = date('Y-m-d H:i:s');
            $newKS->nostrukterimafk =  $r_PPL['strukterimafk'];
            $newKS->norectransaksi = $norec_PP;
            $newKS->tabletransaksi = 'pelayananpasien_t';
            $newKS->saldonoterima = $stoknoterima;
            try {
                $newKS->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "Kartu Stok";
            }
        }

        if (isset($request['norec_order'])) {
            $sOrder = StrukOrder::where('norec', $request['norec_order'])->update(
                [
                    'statusorder' => null,
                    'namapengambilorder' => null,
                    'tglambilorder' => null
                ]
            );
            $antrianApotik = AntrianApotik::where('noresep', $newSR->noresep)->delete();
        }

        $newPPx = PelayananPasienObatKronis::where('strukresepfk', $norec_SR)->get();
        $newPP3 = $newPPx;

        foreach ($newPPx as $r_PPLx) {
            $qtyJumlah = (float)$r_PPLx['jumlah'] * (float)$r_PPLx['nilaikonversi'];

            //## StokProdukDetail
            try {
                $produk = $r_PPLx['produkfk'];
                $GetNorec = StokProdukDetail::where('nostrukterimafk', $r_PPLx['strukterimafk'])
                    ->where('objectruanganfk', $idRuangan_SR)
                    ->where('objectprodukfk', $produk)
                    ->orderBy('tglpelayanan', 'desc')
                    ->first();

                $dataSPD = $GetNorec;
                $saldo = (float)$GetNorec->qtyproduk + (float)$qtyJumlah;

                $GetNorec->qtyproduk = $saldo; //$r_PPL['jumlah'];
                $GetNorec->save();
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "update Stok obat";
            }
            $dataSaldoAwal = DB::select(
                DB::raw("select saldoawal,jumlah,status from KartuStok_t
                                  where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                array(
                    'ruanganfk' => $idRuangan_SR,
                    'produkfk' => $r_PPLx['produkfk'],
                )
            );
            $saldoAwal = 0;
            foreach ($dataSaldoAwal as $item) {
                $saldoAwal = (float)$item->saldoawal + $qtyJumlah;
            }
            $tglnow1 =  date('Y-m-d H:i:s');
            $datastoknoterima =  KartuStok::where('produkfk', $r_PPLx['produkfk'])
                ->where('ruanganfk', $idRuangan_SR)
                ->where('created_at', '<', $tglnow1)
                ->where('nostrukterimafk', $r_PPLx['strukterimafk'])
                ->whereNotNull('saldonoterima')
                ->orderBy('tglinput', 'desc')
                ->take(1)
                ->get();

            $stoknoterima = NULL;
            foreach ($datastoknoterima as $itemz) {
                if ($itemz->status == false) {
                    $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                } else {
                    $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                }
            }

            //## KartuStok
            $newKS = new KartuStok();
            $norecKS = $newKS->generateNewId();
            $newKS->norec = $norecKS;
            $newKS->kdprofile = 0;
            $newKS->statusenabled = true;
            $newKS->jumlah = $qtyJumlah;
            $newKS->keterangan = 'Hapus Resep Pelayanan Obat Alkes Kronis ' . $dataPasien->noresep . ' ' . $dataPasien->nocm . ' ' . $dataPasien->namapasien;;
            $newKS->produkfk = $r_PPLx['produkfk'];
            $newKS->ruanganfk = $idRuangan_SR;
            $newKS->saldoawal = (float)$saldoAwal; // 0 (float)$qtyJumlah;
            $newKS->status = 1;
            $newKS->tglinput = date('Y-m-d H:i:s');
            $newKS->tglkejadian = date('Y-m-d H:i:s');
            $newKS->nostrukterimafk =  $r_PPLx['strukterimafk'];
            $newKS->norectransaksi = $norec_PP;
            $newKS->tabletransaksi = 'pelayananpasien_t';
            $newKS->saldonoterima = $stoknoterima;
            try {
                $newKS->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "Kartu Stok";
            }
        }

        $newPPOK = PelayananPasienObatKronis::where('strukresepfk', $norec_SR)->get();
        if ($newPPOK != '') {
            $PPOK = PelayananPasienObatKronis::where('strukresepfk', $norec_SR)->delete();
        }

        try {
            $newPP = PelayananPasien::where('strukresepfk', $norec_SR)->delete();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Pelayanan Pasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "stokprodukdetail" => $GetNorec, //$noResep,,//$noResep,
                "kartustok" => $newKS, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "noresep" => $newSR,//$noResep,
                //                "stokprodukdetail" => $dataSPD,//$noResep,,//$noResep,
                //                "kartustok" => $newKS,//$noResep,,//$noResep,
                //                "pelayananpasien" => $newPP2,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataCombo(Request $request)
    {
        $dataLogin = $request->all();
        $dataPenulis = Pegawai::where('statusenabled', true)
            ->where('objectjenispegawaifk', 1)
            ->get();
        foreach ($dataPenulis as $item) {
            $dataPenulis2[] = array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }
        $dataSigna = \DB::table('stigma as st')
            ->select('st.id', 'st.name')
            ->orderBy('st.name')
            ->get();
        $dataRuangan = [];
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id', 'ru.namaruangan')
            ->where('mlu.objectloginuserfk', $request['userData']['id'])
            ->get();
        $dataRuanganFamasi = [];
        $dataRuanganFamasi = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.objectdepartemenfk', 14)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataRuanganFamasiall = [];
        $dataRuanganFamasiall = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            // ->where('ru.objectdepartemenfk',14)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataJenisKemasan = \DB::table('jeniskemasan_m as jk')
            ->select('jk.id', 'jk.jeniskemasan')
            ->where('jk.statusenabled', true)
            ->get();
        $dataJenisRacikan = \DB::table('jenisracikan_m as jk')
            ->select('jk.id', 'jk.jenisracikan')
            ->where('jk.statusenabled', true)
            ->get();

        //        foreach ($dataRuangan as $lalala){
        //            $ruFilter[]=array($lalala->id);
        //        }
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd', 'spd.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar')
            ->where('pr.statusenabled', true)
            // ->whereIn('jp.id',[97,283])
            ->where('spd.qtyproduk', '>', 0)
            ->where('jp.objectdepartemenfk', '=', 14)
            ->groupBy('pr.id', 'pr.namaproduk', 'ss.id', 'ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        $dataProduk1 = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd', 'spd.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar')
            ->where('pr.statusenabled', true)
            ->whereIn('jp.id', [97, 283])
            //	         ->where('spd.qtyproduk','>',0)
            ->groupBy('pr.id', 'pr.namaproduk', 'ss.id', 'ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->JOIN('stokprodukdetail_t as spd', 'spd.objectasalprodukfk', '=', 'ap.id')
            ->select('ap.id', 'ap.asalproduk')
            ->where('ap.statusenabled', true)
            ->orderBy('ap.id')
            ->groupBy('ap.id', 'ap.asalproduk')
            ->get();

        $dataRoute = \DB::table('routefarmasi as rt')
            ->select('rt.id', 'rt.name')
            ->where('rt.statusenabled', true)
            ->orderBy('rt.id')
            ->get();
        $datawaktuminum = \DB::table('waktuminum_m as wm')
            ->select('wm.id', 'wm.waktuminum')
            ->where('wm.statusenabled', true)
            ->get();
        $dataKelas = \DB::table('kelas_m as rt')
            ->select('rt.id', 'rt.namakelas')
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

        $dataTarifAdminResep = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield', 'rt.nilaifield')
            ->where('rt.statusenabled', true)
            ->where('rt.namafield', 'tarifadminresep')
            ->orderBy('rt.id')
            ->first();
        $dataJasaResepRacikan= \DB::table('settingdatafixed_m as rt')
        ->select('rt.namafield', 'rt.nilaifield')
        ->where('rt.statusenabled', true)
        ->where('rt.namafield', 'tarifadminresepracikan')
        ->orderBy('rt.id')
            ->first();
        $dataJasaResepNon = \DB::table('settingdatafixed_m as rt')
        ->select('rt.namafield', 'rt.nilaifield')
        ->where('rt.statusenabled', true)
        ->where('rt.namafield', 'tarifadminresepnonracikan')
        ->orderBy('rt.id')
            ->first();



        $dataProdukResult = [];
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
        $dataProdukResult1 = [];
        foreach ($dataProduk1 as $item) {
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

            $dataProdukResult1[] = array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }

        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();

        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $result = array(
            'produk' => $dataProdukResult,
            'produk1' => $dataProdukResult1,
            'penulisresep' =>   $dataPenulis2,
            'ruangan' => $dataRuangan,
            'ruanganfarmasi' => $dataRuanganFamasi,
            'ruanganfarmasiall' => $dataRuanganFamasiall,
            'jeniskemasan' => $dataJenisKemasan,
            'asalproduk' => $dataAsalProduk,
            'route' => $dataRoute,
            'kelas' => $dataKelas,
            'signa' => $dataSigna,
            'waktuminum' => $datawaktuminum,
            'jenisracikan' => $dataJenisRacikan,
            'detaillogin' => $dataPegawaiUser,
            'tarifadminresep' => $dataTarifAdminResep,
            'tarifjasaresepracikan' => $dataJasaResepRacikan,
            'tarifjasaresepnonracikan' => $dataJasaResepNon,
            'dokter' => $dataDokter,
            'kelompokpasien' => $dataKelompok,
            'message' => 'as@epic',
            //            'asdas' => $ruFilter,
        );

        return $this->respond($result);
    }
    public function getDetailResep(Request $request)
    {
        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->select('ap.id', 'ap.asalproduk')
            ->get();
        $dataSigna = \DB::table('stigma as st')
            ->select('st.id', 'st.name')
            ->get();
        $dataStruk = \DB::table('strukresep_t as sr')
            ->JOIN('pegawai_m as pg', 'pg.id', '=', 'sr.penulisresepfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'sr.ruanganfk')
            ->select('sr.noresep', 'pg.id as pgid', 'pg.namalengkap', 'ru.id', 'ru.namaruangan', 'sr.isreseppulang');

        if (isset($request['norecResep']) && $request['norecResep'] != "" && $request['norecResep'] != "undefined") {
            $dataStruk = $dataStruk->where('sr.norec', '=', $request['norecResep']);
        }
        $dataStruk = $dataStruk->first();
        $ruanganResep = $dataStruk->id;

        $data = \DB::table('strukresep_t as sr')
            ->JOIN('pelayananpasien_t as pp', 'pp.strukresepfk', '=', 'sr.norec')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('jeniskemasan_m as jk', 'jk.id', '=', 'pp.jeniskemasanfk')
            ->LeftJOIN('routefarmasi as rt', 'rt.id', '=', 'pp.routefk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('satuanstandar_m as ss2', 'ss2.id', '=', 'pp.satuanviewfk')
            ->orderby('pp.rke','asc')
            ->select(
                'sr.noresep',
                'pp.hargasatuan',
                'pp.stock',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'pp.rke',
                'pp.jeniskemasanfk',
                'jk.id as jkid',
                'jk.jeniskemasan',
                'pp.aturanpakai',
                'pp.routefk',
                'rt.name as route',
                'pp.produkfk',
                'pr.namaproduk',
                'pp.nilaikonversi',
                'pr.objectsatuanstandarfk',
                'ss.satuanstandar',
                'pp.satuanviewfk',
                'ss2.satuanstandar as ssview',
                'pp.jumlah',
                'pp.hargadiscount',
                'pp.dosis',
                'pp.jenisobatfk',
                'pp.jasa',
                'pp.hargajual',
                'pp.hargasatuan',
                'pp.strukterimafk',
                'pp.qtydetailresep',
                'pp.ispagi',
                'pp.issiang',
                'pp.ismalam',
                'pp.issore',
                'pr.kekuatan',
                'pp.keteranganpakai',
                'sr.isreseppulang',
                'pp.dosisobat'
            );

        if (isset($request['norecResep']) && $request['norecResep'] != "" && $request['norecResep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norecResep']);
        }
        $data = $data->get();

        $data2 = \DB::table('strukresep_t as sr')
            ->JOIN('pelayananpasienobatkronis_t as pp', 'pp.strukresepfk', '=', 'sr.norec')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('jeniskemasan_m as jk', 'jk.id', '=', 'pp.jeniskemasanfk')
            ->LeftJOIN('routefarmasi as rt', 'rt.id', '=', 'pp.routefk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('satuanstandar_m as ss2', 'ss2.id', '=', 'pp.satuanviewfk')
            ->orderby('pp.rke', 'asc')
            ->select(
                'sr.noresep',
                'pp.hargasatuan',
                'pp.stock',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'pp.rke',
                'pp.jeniskemasanfk',
                'jk.id as jkid',
                'jk.jeniskemasan',
                'pp.aturanpakai',
                'pp.routefk',
                'rt.name as route',
                'pp.produkfk',
                'pr.namaproduk',
                'pp.nilaikonversi',
                'pr.objectsatuanstandarfk',
                'ss.satuanstandar',
                'pp.satuanviewfk',
                'ss2.satuanstandar as ssview',
                'pp.jumlah as jumlahcetak',
                'pp.jumlah',
            'pp.strukterimafk',
            'pp.hargajual',
            'pp.hargadiscount',
            'pp.dosis',
            'pr.kekuatan',
            'pp.jenisobatfk',
            'pp.jumlah as qtydetailresep',
            'pp.jasa',
            DB::raw("'' as ispagi,'' as issore,'' as ismalam,'' as issiang, '' as keteranganpakai,'' as isreseppulang,'' as dosisobat")
        
                // 'pp.dosisobat'
            );

        if (isset($request['norecResep']) && $request['norecResep'] != "" && $request['norecResep'] != "undefined") {
            $data2 = $data2->where('sr.norec', '=', $request['norecResep']);
        }
        $data2 = $data2->get();

        $pelayananPasien = [];
        $pelayananPasien2 = [];
        $i = 0;
        $dataStok = DB::select(
            DB::raw("select sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2 as hargajual,spd.harganetto2 as harganetto,spd.hargadiscount,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where  spd.objectruanganfk =:ruanganid
                    group by sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2,spd.hargadiscount,
                    spd.objectruanganfk
                    order By sk.tglstruk"),
            array(
                'ruanganid' => $dataStruk->id
            )
        );
        $hargajual = 0;
        $harganetto = 0;
        $nostrukterimafk = '';
        $asalprodukfk = 0;
        $asalproduk = '';
        $jmlstok = 0;
        $hargasatuan = 0;
        $hargadiscount = 0;
        $total = 0;
        $aturanpakaifk = 0;
        $jumlah = 0;
        $qtydetail = 0;

        // foreach ($data2 as $itez) {
        //     $i = $i + 1;
        //     $pelayananPasien2[] = array(
        //         'no' => $i,
        //         'produkfk' => $itez->produkfk,
        //         'jumlah' => $itez->jumlah / $itez->nilaikonversi,

        //     );
        // }

        foreach ($data as $item) {
            $i = $i + 1;

            //            $tarifjasa =0;
            //            $qty20 =0;
            //            if ($item->jkid == 2){
            //                $tarifjasa = 800;
            //            }
            //            if ($item->jkid == 1){
            ////                $qty20 = Math.floor(parseFloat($scope.item.jumlah)/20)
            //                $qty20 = number_format($item->jumlah/20,0);
            //                if ($item->jumlah % 20 == 0) {
            //                    $qty20 = $qty20;
            //                }else{
            //                    $qty20 = $qty20 + 1;
            //                }
            //                $tarifjasa = 800 * $qty20;
            //            }
            $jumlah  =  $item->jumlah;
            $qtydetail = $item->qtydetailresep;
            // foreach ($pelayananPasien2 as $item99) {
            //     if ($item->produkfk == $item99['produkfk']) {
            //         $jumlah =  $jumlah + $item99['jumlah'];
            //         $jumlah =  $jumlah / $item->nilaikonversi;

            //         $qtydetail = $qtydetail + $item99['jumlah'];
            //     }
            // }
            foreach ($dataStok as $item2) {
                if ($item2->objectprodukfk == $item->produkfk) {
                    //                    if ($item2->qtyproduk+($item->jumlah*$item->nilaikonversi) > $item->jumlah*$item->nilaikonversi){
                    if ($item2->norec == $item->strukterimafk) {

                        $hargajual = $item->hargajual;
                        $harganetto = $item->hargasatuan;

                        $nostrukterimafk = $item2->norec;
                        $asalprodukfk = $item2->objectasalprodukfk;
                        $jmlstok = $item2->qtyproduk;
                        $hargasatuan = $harganetto;
                        $hargadiscount = $item->hargadiscount;
                        $total = (((float)$item->jumlah * ((float)$hargasatuan - (float)$hargadiscount)));
                        break;
                    }
                }
            }
            foreach ($dataAsalProduk as $item3) {
                if ($asalprodukfk == $item3->id) {
                    $asalproduk = $item3->asalproduk;
                }
            }
            foreach ($dataSigna as $item4) {
                if ($item->aturanpakai == $item4->id) {
                    $aturanpakaifk = $item4->id;
                }
            }

            if ($item->dosis == null) {
                $item->dosis = 1;
            }

            $jmlxMakan = (((float)$item->jumlah / (float)$item->nilaikonversi) / (float)$item->dosis) * (float)$item->kekuatan;
            $pelayananPasien[] = array(
                'no' => $i,
                'noregistrasifk' => '',
                'tglregistrasi' => '',
                'generik' => null,
                'hargajual' => $hargajual,
                'jenisobatfk' => $item->jenisobatfk,
                'kelasfk' => '',
                'stock' => (float)$jmlstok,
                'harganetto' => $harganetto,
                'nostrukterimafk' => $nostrukterimafk,
                'ruanganfk' => $ruanganResep, //$item->objectruanganfk,
                'rke' => $item->rke,
                'jeniskemasanfk' => $item->jeniskemasanfk,
                'jeniskemasan' => $item->jeniskemasan,
                'aturanpakaifk' => $aturanpakaifk,
                'aturanpakai' => $item->aturanpakai,
                'routefk' => $item->routefk,
                'route' => $item->route,
                'asalprodukfk' => $asalprodukfk,
                'asalproduk' => $asalproduk,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'nilaikonversi' => (float) $item->nilaikonversi,
                'satuanstandarfk' => $item->satuanviewfk, //objectsatuanstandarfk,
                'satuanstandar' => $item->ssview, //satuanstandar,
                'satuanviewfk' => $item->satuanviewfk,
                'satuanview' => $item->ssview,
                'jmlstok' => (float)$item->stock,
                'jumlahx' => $item->jumlah / $item->nilaikonversi,
                'jumlahobatx' => (float) $item->qtydetailresep,
                'jumlah' => $jumlah,
                'jumlahobat' => $qtydetail,
                'dosis' => $item->dosis,
                'hargasatuan' => $hargasatuan,
                'hargadiscount' => $hargadiscount,
                'total' => $total + $item->jasa,
                'jmldosis' => (string)$jmlxMakan . '/' . (string)$item->dosis . '/' . $item->kekuatan,
                //                'jmldosis' => (String)($item->jumlah/$item->nilaikonversi)/$item->dosis . '/' . (String)$item->dosis,
                'jasa' => $item->jasa,
                'ispagi'  => $item->ispagi,
                'issiang' => $item->issiang,
                'ismalam' => $item->ismalam,
                'issore' => $item->issore,
                'keterangan' => $item->keteranganpakai,
                'isreseppulang' => $item->isreseppulang,
                'dosisobat' => $item->dosisobat
            );
        }
        $i = 0;
        foreach ($data2 as $item) {
            $i = $i + 1;

            //            $tarifjasa =0;
            //            $qty20 =0;
            //            if ($item->jkid == 2){
            //                $tarifjasa = 800;
            //            }
            //            if ($item->jkid == 1){
            ////                $qty20 = Math.floor(parseFloat($scope.item.jumlah)/20)
            //                $qty20 = number_format($item->jumlah/20,0);
            //                if ($item->jumlah % 20 == 0) {
            //                    $qty20 = $qty20;
            //                }else{
            //                    $qty20 = $qty20 + 1;
            //                }
            //                $tarifjasa = 800 * $qty20;
            //            }
            $jumlah  =  $item->jumlah;
            $qtydetail = $item->jumlah;
            // foreach ($pelayananPasien2 as $item99) {
            //     if ($item->produkfk == $item99['produkfk']) {
            //         $jumlah =  $jumlah + $item99['jumlah'];
            //         $jumlah =  $jumlah / $item->nilaikonversi;

            //         $qtydetail = $qtydetail + $item99['jumlah'];
            //     }
            // }
            foreach ($dataStok as $item2) {
                if ($item2->objectprodukfk == $item->produkfk) {
                    //                    if ($item2->qtyproduk+($item->jumlah*$item->nilaikonversi) > $item->jumlah*$item->nilaikonversi){
                    if ($item2->norec == $item->strukterimafk) {

                        $hargajual = $item->hargajual;
                        $harganetto = $item->hargasatuan;

                        $nostrukterimafk = $item2->norec;
                        $asalprodukfk = $item2->objectasalprodukfk;
                        $jmlstok = $item2->qtyproduk;
                        $hargasatuan = $harganetto;
                        $hargadiscount = $item->hargadiscount;
                        $total = (((float)$item->jumlah * ((float)$hargasatuan - (float)$hargadiscount)));
                        break;
                    }
                }
            }
         
            $jmlxMakan = (((float)$item->jumlah / (float)$item->nilaikonversi) / (float)$item->dosis) * (float)$item->kekuatan;
            $pelayananPasien2[] = array(
                'no' => $i,
                'noregistrasifk' => '',
                'tglregistrasi' => '',
                'generik' => null,
                'hargajual' => $hargajual,
                'jenisobatfk' => $item->jenisobatfk,
                'kelasfk' => '',
                'stock' => (float)$jmlstok,
                'harganetto' => $harganetto,
                'nostrukterimafk' => $nostrukterimafk,
                'ruanganfk' => $ruanganResep, //$item->objectruanganfk,
                'rke' => $item->rke,
                'jeniskemasanfk' => $item->jeniskemasanfk,
                'jeniskemasan' => $item->jeniskemasan,
                'aturanpakaifk' => $aturanpakaifk,
                'aturanpakai' => $item->aturanpakai,
                'routefk' => $item->routefk,
                'route' => $item->route,
                'asalprodukfk' => $asalprodukfk,
                'asalproduk' => $asalproduk,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'nilaikonversi' => (float) $item->nilaikonversi,
                'satuanstandarfk' => $item->satuanviewfk, //objectsatuanstandarfk,
                'satuanstandar' => $item->ssview, //satuanstandar,
                'satuanviewfk' => $item->satuanviewfk,
                'satuanview' => $item->ssview,
                'jmlstok' => (float)$item->stock,
                'jumlahx' => $item->jumlah / $item->nilaikonversi,
                'jumlahobatx' => (float) $item->qtydetailresep,
                'jumlah' => $jumlah,
                'jumlahobat' => $qtydetail,
                'dosis' => $item->dosis,
                'hargasatuan' => $hargasatuan,
                'hargadiscount' => $hargadiscount,
                'total' => $total + $item->jasa,
                'jmldosis' => (string)$jmlxMakan . '/' . (string)$item->dosis . '/' . $item->kekuatan,
                //                'jmldosis' => (String)($item->jumlah/$item->nilaikonversi)/$item->dosis . '/' . (String)$item->dosis,
                'jasa' => $item->jasa,
                'ispagi'  => $item->ispagi,
                'issiang' => $item->issiang,
                'ismalam' => $item->ismalam,
                'issore' => $item->issore,
                'keterangan' => $item->keteranganpakai,
                'isreseppulang' => $item->isreseppulang,
                'dosisobat' => $item->dosisobat,
                'jumlahcetak' => $item->jumlahcetak
            );
        }



        $result = array(
            'detailresep' => $dataStruk,
            'pelayananPasien' => $pelayananPasien,
            'pelayananPasienkronis' => $pelayananPasien2,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDetailOrder(Request $request)
    {
        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->select('ap.id', 'ap.asalproduk')
            ->get();
        $dataSigna = \DB::table('stigma as st')
            ->select('st.id', 'st.name')
            ->get();
        $dataStruk = \DB::table('strukorder_t as so')
            ->JOIN('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruangantujuanfk')
            ->select('so.noorder', 'pg.id as pgid', 'pg.namalengkap', 'ru.id', 'ru.namaruangan', 'so.tglorder', 'so.isreseppulang');

        if (isset($request['noorder']) && $request['noorder'] != "" && $request['noorder'] != "undefined") {
            $dataStruk = $dataStruk->where('so.noorder', '=', $request['noorder']);
        }
        $dataStruk = $dataStruk->first();
        $data = \DB::table('strukorder_t as so')
            ->JOIN('orderpelayanan_t as op', 'op.strukorderfk', '=', 'so.norec')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruangantujuanfk')
            ->leftJOIN('jeniskemasan_m as jk', 'jk.id', '=', 'op.jeniskemasanfk')
            ->leftJOIN('routefarmasi as rt', 'rt.id', '=', 'op.routefk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'op.objectprodukfk')
            ->leftJOIN('rm_sediaan_m as sdn', 'sdn.id', '=', 'pr.objectsediaanfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'op.objectsatuanstandarfk')
            ->leftJOIN('satuanstandar_m as ss2', 'ss2.id', '=', 'op.satuanviewfk')
            ->select(
                'so.noorder',
                'op.hargasatuan',
                'op.qtystokcurrent',
                'so.objectruangantujuanfk',
                'ru.namaruangan',
                'op.rke',
                'op.jeniskemasanfk',
                'jk.id as jkid',
                'jk.jeniskemasan',
                'op.aturanpakai',
                'op.routefk',
                'rt.name as namaroute',
                'op.objectprodukfk',
                'pr.namaproduk',
                'op.hasilkonversi',
                'op.objectsatuanstandarfk',
                'ss.satuanstandar',
                'op.satuanviewfk',
                'ss2.satuanstandar as ssview',
                'op.qtyproduk',
                'op.hargadiscount',
                'op.hasilkonversi',
                'op.qtystokcurrent',
                'op.dosis',
                'op.jenisobatfk',
                'op.hargasatuan',
                'op.hargadiscount',
                'pr.kekuatan',
                'sdn.name as sediaan',
                'op.ispagi',
                'op.issiang',
                'op.ismalam',
                'op.issore',
                'op.keteranganpakai',
                'so.isreseppulang',
                'pr.isobatkronis'
            );

        if (isset($request['noorder']) && $request['noorder'] != "" && $request['noorder'] != "undefined") {
            $data = $data->where('so.noorder', '=', $request['noorder']);
        }
        $data = $data->get();

        $orderPelayanan = [];
        $i = 0;
        $dataStok = DB::select(
            DB::raw("select sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2 as hargajual,spd.harganetto2 as harganetto,spd.hargadiscount,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk
                    from stokprodukdetail_t as spd
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where  spd.objectruanganfk =:ruanganid
                    group by sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk,
                            spd.harganetto2,spd.hargadiscount,
                    spd.objectruanganfk
                    order By sk.tglstruk"),
            array(
                'ruanganid' => $dataStruk->id
            )
        );

        $hargajual = 0;
        $harganetto = 0;
        $nostrukterimafk = '';
        $asalprodukfk = 0;
        $asalproduk = '';
        $jmlstok = 0;
        $hargasatuan = 0;
        $hargadiscount = 0;
        $total = 0;
        $aturanpakaifk = 0;
        $rke = '0';
        $dataTarifAdminResep = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield', 'rt.nilaifield')
            ->where('rt.statusenabled', true)
            ->where('rt.namafield', 'tarifadminresep')
            ->orderBy('rt.id')
            ->get();
        foreach ($data as $item) {
            $i = $i + 1;
            $hargajual = 0;
            $harganetto = 0;
            $jmlstok = 0;
            $hargasatuan = 0;
            $hargadiscount = 0;
            $total = 0;



            $tarifadminjasa = $dataTarifAdminResep[0]->nilaifield;
            $tarifjasa = 0;
            $qty20 = 0;
            if ($item->jkid == 2) {
                $tarifjasa = $tarifadminjasa; //800;
            }
            if ($item->jkid == 1) {
                if ($rke != $item->rke) {
                    if ($item->qtyproduk > 20) {
                        $qty20 = number_format($item->qtyproduk / 20, 0);
                        if ($item->qtyproduk % 20 == 0) {
                            $qty20 = $qty20;
                        } else {
                            $qty20 = $qty20 + 1;
                        }

                        //                        $tarifjasa = 800 * $qty20;
                        $tarifjasa = $tarifadminjasa * $qty20;
                    } else {
                        //                        $tarifjasa = 800;
                        $tarifjasa = $tarifadminjasa;
                    }
                    $rke = $item->rke;
                }
            }
            $hargajual = round($item->hargasatuan, 0);
            $hargasatuan = round($item->hargasatuan, 0);
            $harganetto = round($item->hargadiscount, 0);

            foreach ($dataStok as $item2) {
                if ($item2->objectprodukfk == $item->objectprodukfk) {
                    if ($item2->qtyproduk > $item->qtyproduk * $item->hasilkonversi) {
                        //                        $hargajual =round($item2->hargajual+(($item2->hargajual*25)/100),0);
                        //                        $harganetto =round( $item2->harganetto+(($item2->harganetto*25)/100),0);//$item2->harganetto;



                        $nostrukterimafk = $item2->norec;
                        $asalprodukfk = $item2->objectasalprodukfk;
                        //                        $asalproduk = $item2->objectasalprodukfk;
                        $jmlstok = $item2->qtyproduk;
                        //                        $hargasatuan = $harganetto;//$item2->harganetto;
                        $hargadiscount = $item2->hargadiscount;
                        $total = (((float)ceil($item->qtyproduk) * ((float)$hargasatuan - (float)$hargadiscount)) * $item->hasilkonversi) + $tarifjasa;
                        break;
                    }
                }
            }
            foreach ($dataAsalProduk as $item3) {
                if ($asalprodukfk == $item3->id) {
                    $asalproduk = $item3->asalproduk;
                }
            }
            foreach ($dataSigna as $item4) {
                if ($item->aturanpakai == $item4->id) {
                    $aturanpakaifk = $item4->id;
                }
            }
            if ((float)$item->dosis == 0) {
                $item->dosis = 1;
            }
            // return $this->respond($item->qtyproduk);
            $orderPelayanan[] = array(
                'no' => $i,
                'noregistrasifk' => '',
                'tglregistrasi' => '',
                'generik' => null,
                'hargajual' => $hargajual,
                'jenisobatfk' => $item->jenisobatfk,
                'kelasfk' => '',
                'stock' => $jmlstok,
                'harganetto' => $harganetto,
                'nostrukterimafk' => $nostrukterimafk,
                'ruanganfk' => $item->objectruangantujuanfk,
                'rke' => $item->rke,
                'jeniskemasanfk' => $item->jeniskemasanfk,
                'jeniskemasan' => $item->jeniskemasan,
                'aturanpakaifk' => $aturanpakaifk,
                'aturanpakai' => $item->aturanpakai,
                'routefk' => $item->routefk,
                'route' => $item->namaroute,
                'asalprodukfk' => $asalprodukfk,
                'asalproduk' => $asalproduk,
                'produkfk' => $item->objectprodukfk,
                'namaproduk' => $item->namaproduk,
                'nilaikonversi' => $item->hasilkonversi,
                'satuanstandarfk' => $item->satuanviewfk, //objectsatuanstandarfk,
                'satuanstandar' => $item->ssview, //satuanstandar,
                'satuanviewfk' => $item->satuanviewfk,
                'satuanview' => $item->ssview,
                'jmlstok' => $item->qtystokcurrent,
                'jumlah' => $item->qtyproduk, //ceil($item->qtyproduk),
                'jumlahobat' => $item->qtyproduk,
                'dosis' => $item->dosis,
                'kekuatan' => $item->kekuatan,
                'hargasatuan' => $hargasatuan,
                'hargadiscount' => $hargadiscount,
                'total' => $total,
                'sediaan' => $item->sediaan,
                'jmldosis' => (string)$item->qtyproduk / $item->dosis . '/' . (string)$item->dosis,
                //                'jmldosis' => (String)$item->qtyproduk,
                'jasa' => $tarifjasa,
                'ispagi' => $item->ispagi,
                'issiang' =>  $item->issiang,
                'ismalam' =>  $item->ismalam,
                'issore' =>  $item->issore,
                "keterangan" => $item->keteranganpakai,
                'obatkronis' => $item->isobatkronis,
            );
        }

        $result = array(
            'strukorder' => $dataStruk,
            'orderpelayanan' => $orderPelayanan,
        );
        return $this->respond($result);
    }
    public function getInformasiStok(Request $request)
    {

        $results = DB::select(
            DB::raw("select sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk, 
                            spd.harganetto2,spd.hargadiscount,ru.namaruangan,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk as kdruangan
                    from stokprodukdetail_t as spd
                    inner JOIN ruangan_m as ru on ru.id=spd.objectruanganfk
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where spd.objectprodukfk =:produkId 
                    and ru.statusenabled = 'y'                     
                    -- and ru.statusenabled = true
                    --and spd.objectruanganfk =:ruanganid
                    group by sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk, 
                            spd.harganetto2,spd.hargadiscount,ru.namaruangan,
                    spd.objectruanganfk
                    order By sk.tglstruk"),
            array(
                'produkId' => $request['produkfk'],
                //                'ruanganid' => $request['ruanganfk'],
            )
        );
        $jmlstok = 0;
        foreach ($results as $item) {
            $jmlstok = $jmlstok + $item->qtyproduk;
        }
        $a = [];
        foreach ($results as $nenden) {
            $i = 0;
            $sama = false;
            foreach ($a as $hideung) {
                if ($nenden->kdruangan == $a[$i]['kdruangan']) {
                    $sama = true;
                    $a[$i]['qtyproduk'] = $a[$i]['qtyproduk'] + $nenden->qtyproduk;
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                $a[] = array(
                    'qtyproduk' => $nenden->qtyproduk,
                    'kdruangan' => $nenden->kdruangan,
                    'namaruangan' => $nenden->namaruangan,
                );
            }
        }

        $result = array(
            'jmlstok' => $jmlstok,
            'infostok' => $a,
            'detail' => $results,
            'message' => 'inhuman@epic',
        );
        return $this->respond($result);
    }
    // get stok show
    public function getInformasiStokByNoterima(Request $request)
    {

        $results = DB::select(
            DB::raw("select sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk, 
                            spd.harganetto2,spd.hargadiscount,ru.namaruangan,
                    sum(spd.qtyproduk) as qtyproduk,spd.objectruanganfk as kdruangan, sk.noterima
                    from stokprodukdetail_t as spd
                    inner JOIN ruangan_m as ru on ru.id=spd.objectruanganfk
                    inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                    where spd.objectprodukfk =  $request[produkfk]
                    and ru.statusenabled = 1                     
                    and ru.statusenabled = 1
                    and spd.objectruanganfk =$request[ruangan]
                    group by sk.norec,spd.objectprodukfk, sk.tglstruk,spd.objectasalprodukfk, 
                            spd.harganetto2,spd.hargadiscount,ru.namaruangan,
                    spd.objectruanganfk, sk.noterima
                    order By sk.tglstruk")
            // array(
            //     'produkId' => $request['produkfk'],
            //    'ruanganid' => $request['ruanganfk'],
            // )
        );
        $jmlstok = 0;
        foreach ($results as $item) {
            $jmlstok = $jmlstok + $item->qtyproduk;
        }
        $a = [];
        foreach ($results as $nenden) {
            $a[] = array(
                'qtyproduk' => $nenden->qtyproduk,
                'noterima' => $nenden->noterima,
                'harganetto2' => $nenden->harganetto2,
                'tglstruk' => $nenden->tglstruk,
            );
        }

        $result = array(
            'jmlstok' => $jmlstok,
            'infostok' => $a,
            'detail' => $results,
            'message' => 'inhuman@epic',
        );
        return $this->respond($result);
    }




    // 
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

            $persenUpHargaSatuan = 0;
            foreach ($result as $item) {
                if($item->qtyproduk>0){
                foreach ($persenHargaJualProduk as $hitem) {
                    if ((float)$hitem->rangemin < (float)$item->harganetto && (float)$hitem->rangemax > (float)$item->harganetto){

                        $persenUpHargaSatuan = (float)$hitem->persenuphargasatuan;
                    }
                }

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
    public function updateAntrianclear(Request $request)
    {

        $norec = $request['norec'];
        $statuspanggil = $request['status'];
        // return($statuspanggil);
        // die();
        try {
            DB::beginTransaction();
            $updateantrian = AntrianPasienRegistrasi::where('statuspanggil', 3)
                ->where('jenis', $request['jenis'])
                // ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
                ->where('objectruanganfk', $request['objectruanganfk'])
                ->update(['statuspanggil' => 8]);
            $updateantrian = AntrianPasienRegistrasi::where('norec', $norec)
                ->update(['statuspanggil' => null]);
            // $updateantrian = AntrianPasienRegistrasi::where('norec',$norec)
            //             ->update(['statuspanggil' => 3]);

            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {

            DB::commit();
            $result = array(
                // "noRec" => $noRec,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                // "noRec" => $noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateAntrian(Request $request)
    {

        $norec = $request['norec'];
        $statuspanggil = $request['status'];
        $cek = $request['statuspanggil'];
        // return($statuspanggil);
        // die();
        try {
            DB::beginTransaction();
            //  $updateantrian = AntrianPasienRegistrasi::where('statuspanggil',2)
            //         ->where('jenis', $request['jenis'] )
            //             // ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
            //             ->where('objectruanganfk',$request['objectruanganfk'])
            //             ->update(['statuspanggil' => 6]);
            // $updateantrian = AntrianPasienRegistrasi::where('norec',$norec)
            //             ->update(['statuspanggil' => null]);

            $updateantrian = AntrianPasienRegistrasi::where('norec', $norec)
                ->update(['statuspanggil' => $statuspanggil]);



            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {

            DB::commit();
            $result = array(
                // "noRec" => $noRec,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                // "noRec" => $noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanantrian(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        $noRec = '';
        // return($request['jenis'] );
        // die();
        // if($request['jenis'] == 'Racikan'){
        //     $jenis='R';
        // }else{
        //     $jenis='NR';        
        // }

        // return($jenis);
        // die();
        $tglAyeuna = date('Y-m-d H:i:s');
        $tglAwal = date('Y-m-d 00:00:00');
        $tglAkhir = date('Y-m-d 23:59:59');

        $nontrianx = AntrianPasienRegistrasi::where('jenis', $request['jenis'])
            ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
            ->where('norecapd', $request['norecapd'])
            ->where('objectruanganfk', $request['ruanganfk'])
            // ->where('objectruanganfk',$request['ruanganfk'])
            ->get();
        // return($nontrianx);
        // die();
        foreach ($nontrianx as $item) {
            // return('x');
            // die();
            $result = 'Pasien sudah mendapatkan antrian';
            $transMessage = $result;
            // die();
            return $this->setStatusCode(201)->respond($result, $transMessage);
        }

        try {
            // $kdRuanganTPP = $this->settingDataFixed('idRuanganTPP1');

            $newptp = new AntrianPasienRegistrasi();
            $norec = $newptp->generateNewId();
            $nontrian = AntrianPasienRegistrasi::where('jenis', $request['jenis'])
                ->where('objectruanganfk', $request['ruanganfk'])
                ->whereBetween('tanggalreservasi', [$tglAwal, $tglAkhir])
                ->max('noantrian') + 1;
            $newptp->norec = $norec;
            $newptp->kdprofile = 17;
            $newptp->statusenabled = true;
            $newptp->objectruanganfk = $request['ruanganfk']; //$kdRuanganTPP;
            $newptp->objectjeniskelaminfk = 0;
            $newptp->noantrian = $nontrian;
            $newptp->tanggalreservasi = $tglAyeuna;
            $newptp->tipepasien = "APOTIK";
            $newptp->type = "APOTIK";
            $newptp->jenis = $request['jenis'];
            $newptp->nocmfk = $request['nocmfk'];
            $newptp->statuspanggil = 1;
            $newptp->norecapd = $request['norecapd'];
            $newptp->noreservasi = "-";
            $newptp->objectpendidikanfk = 0;
            $newptp->tempatlahir = $request['loket'];
            $newptp->save();
            $noRec = $newptp->norec;


            $transMessage = "Simpan Antrian";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Antrian Gagal";
        }

        if ($transStatus != 'false') {

            DB::commit();
            $result = array(
                "noRec" => $noRec,
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "noRec" => $noRec,
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function StokMerger(Request $request)
    {
        DB::beginTransaction();
        $r_all = $request->all();
        try {
            $data = StokProdukDetail::where('objectprodukfk', $r_all['produkfk'])
                ->where('objectruanganfk', $r_all['ruanganfk'])
                ->where('qtyproduk', '>', 0)
                ->orderby('tglkadaluarsa', 'desc')
                ->select('norec', 'qtyproduk')
                ->get();
            $qtyTotal = 0;
            foreach ($data as $item) {
                $qtyTotal = $qtyTotal + $item->qtyproduk;
                $data2 = StokProdukDetail::where('norec', $item->norec)
                    ->first();
                $data2->qtyproduk = 0;
                $data2->save();
            }
            $data2 = StokProdukDetail::where('norec', $data[0]->norec)->first();
            $data2->qtyproduk = $qtyTotal;
            $data2->save();

            $data3 = StokProdukDetail::where('objectprodukfk', $r_all['produkfk'])
                ->where('objectruanganfk', $r_all['ruanganfk'])
                ->where('qtyproduk', '>', 0)
                ->orderby('tglkadaluarsa', 'desc')
                ->select('norec', 'qtyproduk')
                ->get();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Stock Merger";

        if ($transStatus == 'true') {
            $transMessage = $transMessage .  " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage .  " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data3,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getJenisObat(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('jenisracikan_m as jr')
            ->select('jr.id', 'jr.jenisracikan');

        if (isset($request['jrid']) && $request['jrid'] != "" && $request['jrid'] != "undefined") {
            $data = $data->where('jr.id', $request['jrid']);
        }
        $data = $data->get();



        $result = array(
            'data' => $data,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function updateTanggalResep(Request $request)
    {
        DB::beginTransaction();
        // return($request['norec']);
        $transStatus = 'true';
        try {
            $data = StrukResep::where('noresep', $request['noresep'])
                ->update([
                    'tglresep' => $request['tglresep'],
                    'pasienfk' => $request['norec_to']
                ]);
            $dataPP = PelayananPasien::where('strukresepfk', $request['norec'])
                ->update([
                    'tglpelayanan' => $request['tglresep'],
                    'noregistrasifk' => $request['norec_to'],
                ]);
            $transMessage = "Ganti Tanggal Resep Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Ganti Tanggal Resep Gagal";
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
    public function SimpanDiskonObat(Request $request)
    {
        try{
            foreach ($request['detail'] as $item) {
                $data = PelayananPasien::where('norec', $item['norecpp'])
                    ->first();
                $data->hargadiscount = $item['hargadiscount'];
                $data->save();
            }
            $transStatus = 'true';
            $transMessage = "Simpan Diskon Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Diskon Gagal";
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
    public function SimpanPelayananObat(Request $request)
    {

        ini_set('max_execution_time', 50000); //6 minutes
        $dataApd = DB::select(
            DB::raw("select  pd.noregistrasi from pasiendaftar_t as pd 
                   inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                   where apd.norec=:norec_pd limit 1"),
            array(
                'norec_pd' => $request['strukresep']['pasienfk'],
            )
        );
        $noRegistrasi = "";
        foreach ($dataApd as $Datas) {
            $noRegistrasi = $Datas->noregistrasi;
        }

        //TODO : SAVE INPUT RESEP OBAT
        if (isset($request['strukresep']['isobatalkes']) && $request['strukresep']['isobatalkes'] == true) {
            $noResep = $this->generateCodeBySeqTable(new StrukResep, 'noresep', 12, 'OA/' . $this->getDateTime()->format('ym') . '/');
        } else {
            $noResep = $this->generateCodeBySeqTable(new StrukResep, 'noresep', 12, 'O/' . $this->getDateTime()->format('ym') . '/');
        }
        if ($noResep == '') {
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }
        //## StrukResep
        DB::beginTransaction();

        try {

            $racikanORnonracikan = 'N';
            //region @SIMPAN PELAYANAN OBAT IEU
            $dataLogin = $request->all();
            $r_SR = $request['strukresep'];
            if ($r_SR['noorder'] != '' && $r_SR['noorder'] != 'EditResep') {
                $dataOrder = StrukOrder::where('noorder', $r_SR['noorder'])->first();
                $dataOrder->statusorder = 5;
                $dataOrder->save();

                $newId = LoggingUser::max('id');
                $newId = $newId + 1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = 12;
                $logUser->statusenabled = true;
                $logUser->jenislog = "Verifikasi Order Resep Elektronik";
                $logUser->noreff = $r_SR['noorder'];
                $logUser->referensi = 'No Order Struk Order';
                $logUser->objectloginuserfk =  $request['userData']['id'];
                $logUser->tanggal = date('Y-m-d H:i:s');
                $logUser->keterangan = "Verifikasi Order Resep Elektronik No Order : " . $r_SR['noorder'] . "/ Noregistrasi : " . $noRegistrasi;
                $logUser->save();
            }
            $namaPasien = $r_SR['nocm'] . ' ' . $r_SR['namapasien'];
            $resepOld = StrukResep::where('noresep', $r_SR['noresep'])->first();
            if ($r_SR['noresep'] == '-') {
                $newSR = new StrukResep();
                $norecSR = $newSR->generateNewId();
                $newSR->norec = $norecSR;
            } else {
                $newSR = StrukResep::where('norec', $r_SR['norecResep'])->first();
                //            $norecSR = $r_SR['norecResep'];
                $noResep = $newSR->noresep;
            }

            $newSR->noresep = $noResep;
            $newSR->pasienfk = $r_SR['pasienfk'];
            $newSR->penulisresepfk = $r_SR['penulisresepfk'];
            $newSR->ruanganfk = $r_SR['ruanganfk'];
            $newSR->status = 0; //$r_SR['status'];;
            $newSR->tglresep =  $r_SR['tglresep']; //->format('Y-m-d H:i:s');

            if (isset($r_SR['isreseppulang'])) {
                $newSR->isreseppulang =  $r_SR['isreseppulang'];
            }
            $newSR->save();
            $norec_SR = $newSR->norec;
            $dokterPenulis =  $newSR->penulisresepfk;
            $isRetur = false;

            if ($r_SR['noorder'] != '' && $r_SR['noorder'] != 'EditResep') {
                $DataOrder = StrukOrder::where('noorder', $r_SR['noorder'])->first();
                $norecOrder = $DataOrder->norec;

                $dataResep = StrukResep::where('norec', $norec_SR)
                    ->update(['orderfk' => $norecOrder]);
            }
            // }

            $isRetur = false;
            if ($r_SR['noresep'] != '-') {

                if ($r_SR['retur'] != '-') {
                    $isRetur = true;
                    $newSRetur = new StrukRetur();
                    $norecSRetur = $newSRetur->generateNewId();
                    $noRetur = $this->generateCode(new StrukRetur, 'noretur', 12, 'Ret/' . $this->getDateTime()->format('ym') . '/');
                    $newSRetur->norec = $norecSRetur;
                    $newSRetur->kdprofile = 0;
                    $newSRetur->statusenabled = true;
                    $newSRetur->objectkelompoktransaksifk = 50;
                    $newSRetur->keteranganalasan = $r_SR['alasan'];
                    $newSRetur->keteranganlainnya = 'RETUR OBAT ALKES';
                    $newSRetur->noretur = $noRetur;
                    $newSRetur->objectruanganfk = $r_SR['ruanganfk'];
                    $newSRetur->objectpegawaifk = $r_SR['pegawairetur'];
                    $newSRetur->tglretur = $this->getDateTime()->format('Y-m-d H:i:s');
                    $newSRetur->strukresepfk = $norec_SR;
                    $newSRetur->save();
                    $transStatus = 'false';

                    $norec_retur = $newSRetur->norec;

                    $r_PP = $request['pelayananpasien'];
                    foreach ($r_PP as $r_PPLXXXX) {
                        if ((int)$r_PPLXXXX['jmlretur'] != 0) {
                            $newPPR = new PelayananPasienRetur();
                            $norecPPR = $newPPR->generateNewId();
                            $newPPR->norec = $norecPPR;
                            $newPPR->kdprofile = 0;
                            $newPPR->statusenabled = true;
                            $newPPR->noregistrasifk = $r_PPLXXXX['noregistrasifk'];
                            $newPPR->tglregistrasi = $r_PPLXXXX['tglregistrasi'];
                            $newPPR->aturanpakai = $r_PPLXXXX['aturanpakai'];
                            $newPPR->generik = $r_PPLXXXX['generik'];
                            $newPPR->hargadiscount = $r_PPLXXXX['hargadiscount'];
                            $newPPR->hargajual = $r_PPLXXXX['hargajual'];
                            $newPPR->hargasatuan = $r_PPLXXXX['hargasatuan'];
                            $newPPR->jenisobatfk = $r_PPLXXXX['jenisobatfk'];
                            $newPPR->jumlah = $r_PPLXXXX['jmlretur'];
                            $newPPR->kelasfk = $r_PPLXXXX['kelasfk'];
                            $newPPR->kdkelompoktransaksi = 1;
                            $newPPR->produkfk = $r_PPLXXXX['produkfk'];
                            if (isset($r_PPLXXXX['routefk'])) {
                                $newPPR->routefk = $r_PPLXXXX['routefk'];
                            }
                            $newPPR->stock = $r_PPLXXXX['stock'];
                            $newPPR->tglpelayanan = $r_SR['tglresep']; //$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newPPR->harganetto = $r_PPLXXXX['harganetto'];
                            $newPPR->jeniskemasanfk = $r_PPLXXXX['jeniskemasanfk'];
                            $newPPR->rke = $r_PPLXXXX['rke'];
                            $newPPR->strukresepfk = $norec_SR;
                            $newPPR->satuanviewfk = $r_PPLXXXX['satuanviewfk'];
                            $newPPR->nilaikonversi = $r_PPLXXXX['nilaikonversi'];
                            $newPPR->strukterimafk = $r_PPLXXXX['nostrukterimafk'];
                            $newPPR->dosis = $r_PPLXXXX['dosis'];
                            if ((int)$r_PPLXXXX['jumlah'] == 0) {
                                $newPPR->jasa = $r_PPLXXXX['jasa'];
                            } else {
                                $newPPR->jasa = 0;
                            }
                            $newPPR->strukreturfk = $norec_retur;
                            $newPPR->save();

                            //## TAMBAH STOK DARI RETUR
                            $TambahStok = (float)$r_PPLXXXX['jmlretur'] * (float)$r_PPLXXXX['nilaikonversi']; //$r_PPLXXXX['jmlretur'];
                            $newSPD = StokProdukDetail::where('nostrukterimafk', $r_PPLXXXX['nostrukterimafk'])
                                ->where('objectruanganfk', $r_SR['ruanganfk'])
                                ->where('objectprodukfk', $r_PPLXXXX['produkfk'])
                                ->where('qtyproduk', '>', 0)
                                ->orderby('tglkadaluarsa', 'desc')
                                ->first();
                            $newSPD->qtyproduk = (float)$newSPD->qtyproduk + (float)$TambahStok;
                            $newSPD->save();
                            $dataSaldoAwal = DB::select(
                                DB::raw("select saldoawal,jumlah,status from KartuStok_t
                                  where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1" ),
                                array(
                                    'ruanganfk' => $r_SR['ruanganfk'],
                                    'produkfk' => $r_PPLXXXX['produkfk'],
                                )
                            );

                            $saldoAwal = 0;
                            if ($dataSaldoAwal == []) {
                                $dataSaldoAwal = DB::select(
                                    DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                                      where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                                    array(
                                        'ruanganfk' => $r_SR['ruanganfk'], //$r_PPL['ruanganfk'],
                                        'produkfk' => $r_PPLXXXX['produkfk'],
                                    )
                                );
                                //            $saldoAwal = (float)$r_PPL['jmlstok'] ;
                                foreach ($dataSaldoAwal as $item) {
                                    $saldoAwal = (float)$item->qty;
                                }
                            } else {
                                foreach ($dataSaldoAwal as $item) {
                                    $saldoAwal = (float)$item->saldoawal + $TambahStok;
                                }
                            }
                            $tglnow1 =  date('Y-m-d H:i:s');
                            $datastoknoterima =  KartuStok::where('produkfk', $r_PPLXXXX['produkfk'])
                                ->where('ruanganfk', $r_SR['ruanganfk'])
                                ->where('created_at', '<', $tglnow1)
                                ->where('nostrukterimafk', $newSPD->nostrukterimafk)
                                ->whereNotNull('saldonoterima')
                                ->orderBy('tglinput', 'desc')
                                ->take(1)
                                ->get();

                            $stoknoterima = NULL;
                            foreach ($datastoknoterima as $itemz) {
                                if ($itemz->status == false) {
                                    $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                                } else {
                                    $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                                }
                            }

                            $newKS = new KartuStok();
                            $norecKS = $newKS->generateNewId();
                            $newKS->norec = $norecKS;
                            $newKS->kdprofile = 0;
                            $newKS->statusenabled = true;
                            $newKS->jumlah = $TambahStok; //$r_PPL['jumlah'];
                            $newKS->keterangan = 'Retur Resep No. ' . $noResep;
                            $newKS->produkfk = $r_PPLXXXX['produkfk'];
                            $newKS->ruanganfk = $r_SR['ruanganfk'];
                            $newKS->saldoawal = (float)$saldoAwal; //- (float)$qtyJumlah;
                            $newKS->status = 1;
                            $newKS->tglinput = date('Y-m-d H:i:s'); //$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->tglkejadian = date('Y-m-d H:i:s'); //$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->nostrukterimafk =  $newSPD->nostrukterimafk;
                            $newKS->flagfk = 3;

                            $newKS->saldonoterima = $stoknoterima;
                            $newKS->save();

                            //##TAMBAH STOK DARI DELETE PELAYANANPASIEN_T
                            $TambahStok = 0;
                            $TambahStok = (float)$r_PPLXXXX['jumlah'] * (float)$r_PPLXXXX['nilaikonversi']; //$r_PPLXXXX['jmlretur'];
                            $newSPD = StokProdukDetail::where('nostrukterimafk', $r_PPLXXXX['nostrukterimafk'])
                                ->where('objectruanganfk', $r_SR['ruanganfk'])
                                ->where('objectprodukfk', $r_PPLXXXX['produkfk'])
                                ->where('qtyproduk', '>', 0)
                                ->orderby('tglkadaluarsa', 'desc')
                                //                        ->where('qtyproduk','>',0)
                                ->first();
                            $newSPD->qtyproduk = (float)$newSPD->qtyproduk + (float)$TambahStok;
                            $newSPD->save();

                            $dataSaldoAwal = DB::select(
                                DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                            where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                                array(
                                    'ruanganfk' => $r_SR['ruanganfk'],
                                    'produkfk' =>  $r_PPLXXXX['produkfk'],
                                )
                            );
                            $saldoAwal = 0;
                            if ($dataSaldoAwal == []) {
                                $dataSaldoAwal = DB::select(
                                    DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                                      where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                                    array(
                                        'ruanganfk' => $r_SR['ruanganfk'], //$r_PPL['ruanganfk'],
                                        'produkfk' =>  $r_PPLXXXX['produkfk'],
                                    )
                                );
                                foreach ($dataSaldoAwal as $item) {
                                    $saldoAwal = (float)$item->qty;
                                }
                            } else {
                                foreach ($dataSaldoAwal as $itemss) {
                                    $saldoAwal = (float)$itemss->qty;
                                }
                            }
                        }
                    }

                    $HapusPP = PelayananPasien::where('strukresepfk', $norec_SR)->get();
                    foreach ($HapusPP as $pp) {
                        $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->delete();
                        $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->delete();
                    }
                    $Edit = PelayananPasien::where('strukresepfk', $norec_SR)->delete();
                } else {


                    KartuStok::where('keterangan',  'Pelayanan Obat Alkes ' . ' ' . $noResep . ' ' . $namaPasien)
                        ->update([
                            'flagfk' => null
                        ]);
                    KartuStok::where('keterangan',  'Pelayanan Obat Alkes Kronis ' . ' ' . $noResep . ' ' . $namaPasien)
                        ->update([
                            'flagfk' => null
                        ]);
                    $tglnow =  date('Y-m-d H:i:s');
                    $tglUbah = date('Y-m-d H:i:s', strtotime('-1 minutes', strtotime($tglnow)));
                    //##PENAMBAHAN KEMBALI STOKPRODUKDETAIL

                    $dataKembaliStok = DB::select(
                        DB::raw("select pp.strukterimafk,pp.jumlah,pp.nilaikonversi,sr.ruanganfk,pp.produkfk
                            from pelayananpasien_t as pp
                            INNER JOIN strukresep_t sr on sr.norec=pp.strukresepfk
                            where sr.norec=:strukresepfk"),
                        array(
                            'strukresepfk' => $norec_SR,
                        )
                    );

                    //                    return $this->respond($dataKembaliStok);
                    if ($r_SR['ruanganfk'] == $resepOld->ruanganfk && !empty($dataKembaliStok)) {
                        $as = 0;

                        foreach ($dataKembaliStok as $item5) {

                            $as = $as + 1;


                            $TambahStok = (float)$item5->jumlah; //*(float)$item5->nilaikonversi;
                            $newSPD = StokProdukDetail::where('nostrukterimafk', $item5->strukterimafk)
                                ->where('objectruanganfk', $item5->ruanganfk)
                                ->where('objectprodukfk', $item5->produkfk)
                                // ->where('qtyproduk','>',0)
                                ->orderby('tglkadaluarsa', 'desc')
                                //->where('qtyproduk','>',0)
                                ->first();
                            // return($item5->produkfk);
                            if (!empty($newSPD)) {
                                StokProdukDetail::where('norec', $newSPD->norec)
                                    ->update(
                                        [
                                            'qtyproduk' => (float)$newSPD->qtyproduk + (float)$TambahStok
                                        ]
                                    );


                                $dataSaldoAwal = DB::select(
                                    DB::raw("select  saldoawal,jumlah,status from KartuStok_t
                                      where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                                    array(
                                        'ruanganfk' => $r_SR['ruanganfk'],
                                        'produkfk' =>  $item5->produkfk,
                                    )
                                );

                                $saldoAwal = 0;
                                if ($dataSaldoAwal == []) {
                                    $dataSaldoAwal = DB::select(
                                        DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                                          where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                                        array(
                                            'ruanganfk' => $r_SR['ruanganfk'], //$r_PPL['ruanganfk'],
                                            'produkfk' => $item5->produkfk,
                                        )
                                    );
                                    //            $saldoAwal = (float)$r_PPL['jmlstok'] ;
                                    foreach ($dataSaldoAwal as $item) {
                                        $saldoAwal = (float)$item->qty;
                                    }
                                } else {

                                    foreach ($dataSaldoAwal as $item) {

                                        $saldoAwal = (float)$item->saldoawal + $TambahStok;
                                    }
                                }
                                // $tglnow1 =  date('Y-m-d H:i:s');

                                // $datastoknoterima =  KartuStok::where('produkfk', $item5->produkfk)
                                //             ->where('ruanganfk',$r_SR['ruanganfk'])
                                //             ->where('created_at','<',$tglnow1)
                                //             ->where('nostrukterimafk',$newSPD->nostrukterimafk)
                                //              ->whereNotNull('saldonoterima')
                                //             ->orderBy('tglinput','desc')
                                //             ->take(1)
                                //             ->get();

                                // $stoknoterima=NULL;
                                // foreach ($datastoknoterima as $itemz) {

                                //     if($itemz->status == false){
                                //         $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                                //     }else{
                                //         $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                                //     }
                                // }

                                $newKS = new KartuStok();
                                $norecKS = $newKS->generateNewId();
                                $newKS->norec = $norecKS;
                                $newKS->kdprofile = 0;
                                $newKS->statusenabled = true;
                                $newKS->jumlah = $TambahStok; //$r_PPL['jumlah'];
                                $newKS->keterangan = 'Ubah Resep No. ' . $noResep;
                                $newKS->produkfk = $item5->produkfk;
                                $newKS->ruanganfk = $r_SR['ruanganfk']; //$item->ruanganfk;
                                $newKS->saldoawal = (float)$saldoAwal; //- (float)$qtyJumlah;
                                $newKS->status = 1;
                                $newKS->tglinput = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                                $newKS->tglkejadian = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                                $newKS->nostrukterimafk =  $newSPD->nostrukterimafk;
                                $newKS->norectransaksi = $newSPD->norec;
                                $newKS->tabletransaksi = 'stokprodukdetail_t';

                                // $newKS->saldonoterima = $stoknoterima;
                                $newKS->save();
                                //tanda

                            }
                        }
                    } else {

                        foreach ($dataKembaliStok as $item5) {

                            $TambahStok = (float)$item5->jumlah; //*(float)$item5->nilaikonversi;
                            $newSPD = StokProdukDetail::where('nostrukterimafk', $item5->strukterimafk)
                                ->where('objectruanganfk', $resepOld->ruanganfk)
                                ->where('objectprodukfk', $item5->produkfk)
                                ->orderby('tglkadaluarsa', 'desc')
                                // ->where('qtyproduk','>',0)
                                ->first();

                            StokProdukDetail::where('norec', $newSPD->norec)
                                ->update(
                                    [
                                        'qtyproduk' => (float)$newSPD->qtyproduk + (float)$TambahStok
                                    ]
                                );

                            $dataSaldoAwal = DB::select(
                                DB::raw("select  saldoawal,jumlah,status from KartuStok_t
                                  where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                                array(
                                    'ruanganfk' => $resepOld->ruanganfk,
                                    'produkfk' => $r_PPLXXXX['produkfk'],
                                )
                            );

                            $saldoAwal = 0;
                            if ($dataSaldoAwal == []) {
                                $dataSaldoAwal = DB::select(
                                    DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                                      where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                                    array(
                                        'ruanganfk' => $resepOld->ruanganfk, //$r_PPL['ruanganfk'],
                                        'produkfk' => $r_PPLXXXX['produkfk'],
                                    )
                                );
                                foreach ($dataSaldoAwal as $item) {
                                    $saldoAwal = (float)$item->qty;
                                }
                            } else {
                                foreach ($dataSaldoAwal as $item) {
                                    $saldoAwal = (float)$item->saldoawal + $TambahStok;
                                }
                            }
                            $tglnow1 =  date('Y-m-d H:i:s');
                            $datastoknoterima =  KartuStok::where('produkfk', $item5->produkfk)
                                ->where('ruanganfk', $resepOld->ruanganfk)
                                ->where('created_at', '<', $tglnow1)
                                ->where('nostrukterimafk', $newSPD->nostrukterimafk)
                                ->whereNotNull('saldonoterima')
                                ->orderBy('tglinput', 'desc')
                                ->take(1)
                                ->get();

                            $stoknoterima = NULL;
                            foreach ($datastoknoterima as $itemz) {
                                if ($itemz->status == false) {
                                    $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                                } else {
                                    $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                                }
                            }

                            $newKS = new KartuStok();
                            $norecKS = $newKS->generateNewId();
                            $newKS->norec = $norecKS;
                            $newKS->kdprofile = 0;
                            $newKS->statusenabled = true;
                            $newKS->jumlah = $TambahStok; //$r_PPL['jumlah'];
                            $newKS->keterangan = 'Ubah Resep No. ' . $noResep;
                            $newKS->produkfk = $item5->produkfk;
                            $newKS->ruanganfk = $resepOld->ruanganfk;
                            $newKS->saldoawal = (float)$saldoAwal; //- (float)$qtyJumlah;
                            $newKS->status = 1;
                            $newKS->tglinput = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->tglkejadian = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->nostrukterimafk = $newSPD->nostrukterimafk;
                            $newKS->norectransaksi = $newSPD->norec;
                            $newKS->tabletransaksi = 'stokprodukdetail_t';
                            $newKS->saldonoterima = $stoknoterima;
                            $newKS->save();
                        }
                    }
                    $dataKembaliStok2 = DB::select(
                        DB::raw("select pp.strukterimafk,pp.jumlah,pp.nilaikonversi,sr.ruanganfk,pp.produkfk
                            from pelayananpasienobatkronis_t as pp
                            INNER JOIN strukresep_t sr on sr.norec=pp.strukresepfk
                            where sr.norec=:strukresepfk"),
                        array(
                            'strukresepfk' => $norec_SR,
                        )
                    );

                    //                    return $this->respond($dataKembaliStok);
                    if ($r_SR['ruanganfk'] == $resepOld->ruanganfk) {

                        foreach ($dataKembaliStok2 as $item5) {

                            $TambahStok = (float)$item5->jumlah; //*(float)$item5->nilaikonversi;
                            $newSPD = StokProdukDetail::where('nostrukterimafk', $item5->strukterimafk)
                                ->where('objectruanganfk', $item5->ruanganfk)
                                ->where('objectprodukfk', $item5->produkfk)
                                ->orderby('tglkadaluarsa', 'desc')
                                // ->where('qtyproduk','>',0)
                                ->first();
                            if (!empty($newSPD)) {
                                StokProdukDetail::where('norec', $newSPD->norec)
                                    ->update(
                                        [
                                            'qtyproduk' => (float)$newSPD->qtyproduk + (float)$TambahStok
                                        ]
                                    );
                                $dataSaldoAwal = DB::select(
                                    DB::raw("select saldoawal,jumlah,status from KartuStok_t
                                  where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                                    array(
                                        'ruanganfk' => $r_SR['ruanganfk'],
                                        'produkfk' =>  $item5->produkfk,
                                    )
                                );

                                $saldoAwal = 0;
                                if ($dataSaldoAwal == []) {
                                    $dataSaldoAwal = DB::select(
                                        DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                                      where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                                        array(
                                            'ruanganfk' => $r_SR['ruanganfk'], //$r_PPL['ruanganfk'],
                                            'produkfk' => $item5->produkfk,
                                        )
                                    );
                                    //            $saldoAwal = (float)$r_PPL['jmlstok'] ;
                                    foreach ($dataSaldoAwal as $item) {
                                        $saldoAwal = (float)$item->qty;
                                    }
                                } else {
                                    foreach ($dataSaldoAwal as $item) {
                                        $saldoAwal = (float)$item->saldoawal + $TambahStok;
                                    }
                                }

                                $tglnow1 =  date('Y-m-d H:i:s');
                                $datastoknoterima =  KartuStok::where('produkfk', $item5->produkfk)
                                    ->where('ruanganfk', $r_SR['ruanganfk'])
                                    ->where('created_at', '<', $tglnow1)
                                    ->where('nostrukterimafk', $newSPD->nostrukterimafk)
                                    ->whereNotNull('saldonoterima')
                                    ->orderBy('tglinput', 'desc')
                                    ->take(1)
                                    ->get();

                                $stoknoterima = NULL;
                                foreach ($datastoknoterima as $itemz) {
                                    if ($itemz->status == false) {
                                        $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                                    } else {
                                        $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                                    }
                                }

                                $newKS = new KartuStok();
                                $norecKS = $newKS->generateNewId();
                                $newKS->norec = $norecKS;
                                $newKS->kdprofile = 0;
                                $newKS->statusenabled = true;
                                $newKS->jumlah = $TambahStok; //$r_PPL['jumlah'];
                                $newKS->keterangan = 'Ubah Resep No. ' . $noResep;
                                $newKS->produkfk = $item5->produkfk;
                                $newKS->ruanganfk = $r_SR['ruanganfk']; //$item->ruanganfk;
                                $newKS->saldoawal = (float)$saldoAwal; //- (float)$qtyJumlah;
                                $newKS->status = 1;
                                $newKS->tglinput = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                                $newKS->tglkejadian = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                                $newKS->nostrukterimafk =  $newSPD->nostrukterimafk;
                                $newKS->norectransaksi = $newSPD->norec;
                                $newKS->tabletransaksi = 'stokprodukdetail_t';

                                $newKS->saldonoterima = $stoknoterima;
                                $newKS->save();
                            }
                        }
                    } else {

                        foreach ($dataKembaliStok2 as $item5) {
                            $TambahStok = (float)$item5->jumlah; //*(float)$item5->nilaikonversi;
                            $newSPD = StokProdukDetail::where('nostrukterimafk', $item5->strukterimafk)
                                ->where('objectruanganfk', $resepOld->ruanganfk)
                                ->where('objectprodukfk', $item5->produkfk)
                                ->orderby('tglkadaluarsa', 'desc')
                                // ->where('qtyproduk','>',0)
                                ->first();

                            StokProdukDetail::where('norec', $newSPD->norec)
                                ->update(
                                    [
                                        'qtyproduk' => (float)$newSPD->qtyproduk + (float)$TambahStok
                                    ]
                                );
                            $dataSaldoAwal = DB::select(
                                DB::raw("select saldoawal,jumlah,status from KartuStok_t
                                  where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                                array(
                                    'ruanganfk' => $resepOld->ruanganfk,
                                    'produkfk' => $r_PPLXXXX['produkfk'],
                                )
                            );

                            $saldoAwal = 0;
                            if ($dataSaldoAwal == []) {
                                $dataSaldoAwal = DB::select(
                                    DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                                      where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                                    array(
                                        'ruanganfk' => $resepOld->ruanganfk, //$r_PPL['ruanganfk'],
                                        'produkfk' => $r_PPLXXXX['produkfk'],
                                    )
                                );
                                //            $saldoAwal = (float)$r_PPL['jmlstok'] ;
                                foreach ($dataSaldoAwal as $item) {
                                    $saldoAwal = (float)$item->qty;
                                }
                            } else {
                                foreach ($dataSaldoAwal as $item) {
                                    $saldoAwal = (float)$item->saldoawal + $TambahStok;
                                }
                            }
                            $tglnow1 =  date('Y-m-d H:i:s');
                            $datastoknoterima =  KartuStok::where('produkfk', $item5->produkfk)
                                ->where('ruanganfk', $resepOld->ruanganfk)
                                ->where('created_at', '<', $tglnow1)
                                ->where('nostrukterimafk', $newSPD->nostrukterimafk)
                                ->whereNotNull('saldonoterima')
                                ->orderBy('tglinput', 'desc')
                                ->take(1)
                                ->get();

                            $stoknoterima = NULL;
                            foreach ($datastoknoterima as $itemz) {
                                if ($itemz->status == false) {
                                    $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                                } else {
                                    $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                                }
                            }

                            $newKS = new KartuStok();
                            $norecKS = $newKS->generateNewId();
                            $newKS->norec = $norecKS;
                            $newKS->kdprofile = 0;
                            $newKS->statusenabled = true;
                            $newKS->jumlah = $TambahStok; //$r_PPL['jumlah'];
                            $newKS->keterangan = 'Ubah Resep No. ' . $noResep;
                            $newKS->produkfk = $item5->produkfk;
                            $newKS->ruanganfk = $resepOld->ruanganfk;
                            $newKS->saldoawal = (float)$saldoAwal; //- (float)$qtyJumlah;
                            $newKS->status = 1;
                            $newKS->tglinput = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->tglkejadian = $tglUbah; //date('Y-m-d H:i:s');//$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                            $newKS->nostrukterimafk = $newSPD->nostrukterimafk;
                            $newKS->norectransaksi = $newSPD->norec;
                            $newKS->tabletransaksi = 'stokprodukdetail_t';
                            $newKS->saldonoterima = $stoknoterima;
                            $newKS->save();
                        }
                    }

                    //END##PENAMBAHAN KEMBALI STOKPRODUKDETAIL
                    $HapusPP = PelayananPasien::where('strukresepfk', $norec_SR)->get();

                    foreach ($HapusPP as $pp) {
                        $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->delete();
                        $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->delete();
                    }

                    $Edit = PelayananPasien::where('strukresepfk', $norec_SR)->delete();
                    $EDIT2 = PelayananPasienObatKronis::where('strukresepfk', $norec_SR)->delete();
                }

                //### LOGACC untuk penjurnalan blm ada
            }

            // return("kadie");
            // die;

            //## PelayananPasien
            $r_PP = $request['pelayananpasien'];
            foreach ($r_PP as $r_PPL) {

                $qtyJumlah = (float)$r_PPL['jumlah'] * (float)$r_PPL['nilaikonversi'];

                //            if ($r_PPL['norec'] == '-') {
                $newPP = new PelayananPasien();
                $norecPP = $newPP->generateNewId();
                //            } else {
                //                $newPP = PelayananPasien::where('norec', $r_PPL['norec'])->first();
                //                $norecPP = $r_PPL['norec'];
                //            }
                //
                //            $transStatus == 'false';
                //            return $this->respond($norecPP);
                $newPP->norec = $norecPP;
                $newPP->kdprofile = 0;
                $newPP->statusenabled = true;
                $newPP->noregistrasifk = $r_PPL['noregistrasifk'];
                $newPP->tglregistrasi = $r_PPL['tglregistrasi'];
                $newPP->aturanpakai = $r_PPL['aturanpakai'];
                $newPP->generik = $r_PPL['generik'];
                $newPP->hargadiscount = $r_PPL['hargadiscount'];
                $newPP->hargajual = $r_PPL['hargajual'];
                $newPP->hargasatuan = $r_PPL['hargasatuan'];
                $newPP->jenisobatfk = $r_PPL['jenisobatfk'];
                $newPP->jumlah = $qtyJumlah; //$r_PPL['jumlah'];
                $newPP->kelasfk = $r_PPL['kelasfk'];
                $newPP->kdkelompoktransaksi = 1;
                $newPP->produkfk = $r_PPL['produkfk'];
                if ($r_PPL['routefk']) {
                    $newPP->routefk = $r_PPL['routefk'];
                }
                $newPP->stock = $r_PPL['stock'];
                $newPP->tglpelayanan = $r_SR['tglresep']; //$r_SR['tglresep']->format('Y-m-d H:i:s');
                $newPP->harganetto = $r_PPL['harganetto'];
                $newPP->jeniskemasanfk = $r_PPL['jeniskemasanfk'];
                $newPP->rke = $r_PPL['rke'];
                $newPP->strukresepfk = $norec_SR;
                $newPP->satuanviewfk = $r_PPL['satuanviewfk'];
                $newPP->nilaikonversi = $r_PPL['nilaikonversi'];
                $newPP->strukterimafk = $r_PPL['nostrukterimafk'];
                $newPP->dosis = $r_PPL['dosis'];
                $newPP->jasa = $r_PPL['jasa']; //$r_PPL['jasa'];
                $newPP->qtydetailresep = $r_PPL['jumlahobat'];
                $newPP->isobat = 1;
                $newPP->ispagi = $r_PPL['ispagi'];
                $newPP->issiang = $r_PPL['issiang'];
                $newPP->ismalam = $r_PPL['ismalam'];
                $newPP->issore = $r_PPL['issore'];
                // $newPP->keteranganpakai = $r_PPL['keterangan'];
                $newPP->dosisobat = $r_PPL['dosis'];
                if(isset($r_PPL['objectwaktuminumfk']) && $r_PPL['objectwaktuminumfk']!="" && $r_PPL['objectwaktuminumfk']!="undefined"){
                    $newPP->objectwaktuminumfk = $r_PPL['objectwaktuminumfk'];
                }
                if(isset($r_PPL['keterangan']) && $r_PPL['keterangan']!="" && $r_PPL['keterangan']!="undefined"){
                    $newPP->keteranganpakai = $r_PPL['keterangan'];
                }
                //            try {
                $newPP->save();

                if ((int)$r_PPL['jeniskemasanfk'] == 1) {
                    $racikanORnonracikan = 'R';
                }


                $dataPP[] = $newPP;
                //                $transStatus = 'true';
                //            } catch (\Exception $e) {
                //                    $transStatus = 'false';
                //                $transMessage = "Simpan Pelayanan Pasien";
                //            }
                $norec_PP = $newPP->norec;
                //### PelayananPasienDetail
                $dataKomponen = [];
                $dataKomponen[] = array(
                    'komponenfk' => '9',
                    'komponen' => 'Harga Netto',
                    'harga' => (float)$r_PPL['harganetto']
                );
                $dataKomponen[] = array(
                    'komponenfk' => '12',
                    'komponen' => 'Profit',
                    'harga' => (float)$r_PPL['hargasatuan'] - (float)$r_PPL['harganetto']
                );
                //tandapareum
                foreach ($dataKomponen as $itemKomponen) {

                    //                if ($r_PPL['norec'] == '-') {
                    $newPPD = new PelayananPasienDetail();
                    $norecPPD = $newPPD->generateNewId();
                    //                } else {
                    //                    $newPPD = PelayananPasienDetail::where('norec', $r_PPL['norec'])->first();
                    //                    $norecPPD = $r_PPL['norec'];
                    //                }
                    $newPPD->norec = $norecPPD;
                    $newPPD->kdprofile = 0;
                    $newPPD->statusenabled = true;
                    $newPPD->noregistrasifk = $r_PPL['noregistrasifk'];
                    $newPPD->tglregistrasi = $r_PPL['tglregistrasi'];
                    $newPPD->aturanpakai = $r_PPL['aturanpakai'];
                    $newPPD->generik = $r_PPL['generik'];
                    $newPPD->hargadiscount = 0;
                    $newPPD->hargajual = $itemKomponen['harga'];
                    $newPPD->hargasatuan = $itemKomponen['harga'];
                    $newPPD->jenisobatfk = $r_PPL['jenisobatfk'];
                    $newPPD->jumlah = $qtyJumlah; //$r_PPL['jumlah'];
                    $newPPD->komponenhargafk = $itemKomponen['komponenfk'];
                    $newPPD->pelayananpasien = $norec_PP;
                    $newPPD->produkfk = $r_PPL['produkfk'];
                    if (isset($r_PPL['routefk']))
                        $newPPD->routefk = $r_PPL['routefk'];
                    $newPPD->stock = 0;
                    $newPPD->tglpelayanan =  $r_SR['tglresep']; //$r_SR['tglresep']->format('Y-m-d H:i:s');
                    $newPPD->harganetto = $itemKomponen['harga'];
                    $newPP->jasa =  $r_PPL['jasa'];
                    //            $newPPD->jeniskemasanfk = $r_PPL['jeniskemasanfk'];
                    //            $newPPD->rke = $r_PPL['rke'];
                    //            $newPPD->strukresepfk = $r_PPL['strukresepfk'];

                    //                try {
                    $newPPD->save();
                    //                    $transStatus = 'true';
                    //                } catch (\Exception $e) {
                    //                        $transStatus = 'false';
                    //                    $transMessage = "Simpan Pelayanan Pasien";
                    //                }

                }

                //## StokProdukDetail
                //$r_SPD=$request['stokprodukdetail'];
                // return("kadie");
                // die;
                $GetNorec = StokProdukDetail::where('nostrukterimafk', $r_PPL['nostrukterimafk'])
                    //                    ->where('objectruanganfk',$r_PPL['ruanganfk'])
                    ->where('objectruanganfk', $r_SR['ruanganfk'])
                    ->where('objectasalprodukfk', $r_PPL['asalprodukfk'])
                    ->where('objectprodukfk', $r_PPL['produkfk'])
                    // ->where('qtyproduk','>',0)
                    ->select('norec')
                    ->get();
                //                return $this->respond($r_SR['ruanganfk']);
                // return($GetNorec);
                // die;
                $jmlPengurang = (float)$qtyJumlah;
                $kurangStok = (float)0;
                foreach ($GetNorec as $item) {

                    $newSPD = StokProdukDetail::where('nostrukterimafk', $r_PPL['nostrukterimafk'])
                        //                        ->where('objectruanganfk',$r_PPL['ruanganfk'])
                        ->where('objectruanganfk', $r_SR['ruanganfk'])
                        ->where('objectasalprodukfk', $r_PPL['asalprodukfk'])
                        ->where('objectprodukfk', $r_PPL['produkfk'])
                        ->where('norec', $item->norec)
                        // ->where('qtyproduk','>',0)
                        ->first();
                    //$dadada[]=$newSPD;

                    //                $dadada[]=array('kurangStok' => (float)$kurangStok,'jmlPengurang' => (float)$jmlPengurang,'stok'=>(float)$newSPD->qtyproduk);
                    if ((float)$newSPD->qtyproduk <= (float)$jmlPengurang) {
                        $kurangStok = (float)$newSPD->qtyproduk;
                        $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                    } else {
                        $kurangStok = (float)$jmlPengurang;
                        $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                    }

                    //                if ((float)$newSPD->qtyproduk = (float)$jmlPengurang){
                    //                    $kurangStok = (float)$jmlPengurang;
                    //                    $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                    //                }
                    //                if ((float)$newSPD->qtyproduk > (float)$jmlPengurang){
                    //                    $kurangStok = (float)$jmlPengurang;
                    //                    $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                    //                }

                    //                $dadada[]=array('kurangStok' => (float)$kurangStok,'jmlPengurang' => (float)$jmlPengurang,'stok'=>(float)$newSPD->qtyproduk);
                    $newSPD->qtyproduk = (float)$newSPD->qtyproduk - (float)$kurangStok; //$r_PPL['jumlah'];
                    //                    $dadada[]=array('kurangStok' => (float)$kurangStok,'jmlPengurang' => (float)$jmlPengurang,'stok'=>(float)$newSPD->qtyproduk);
                    //                try {
                    $newSPD->save();
                    //                    $transStatus = 'true';
                    //                } catch (\Exception $e) {
                    //                    $transStatus = 'false';
                    //                    $transMessage = "update Stok obat";
                    //                }

                }

                // $dataSaldoAwal = DB::select(DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                //       where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                //     array(
                //         'ruanganfk' => $r_SR['ruanganfk'],//$r_PPL['ruanganfk'],
                //         'produkfk' => $r_PPL['produkfk'],
                //     )
                // );
                // //            $saldoAwal = (float)$r_PPL['jmlstok'] ;
                // foreach ($dataSaldoAwal as $item){
                //     $saldoAwal = (float)$item->qty;
                // }



                //            //## StokProdukGlobal
                //            $newSPG = StokProdukGlobal::where('objectruanganfk',$r_PPL['ruanganfk'])
                //                ->where('objectasalprodukfk',$r_PPL['asalprodukfk'])
                //                ->where('objectprodukfk',$r_PPL['produkfk'])
                //                ->first();
                //            $newSPG->qtyproduk = (float)$newSPG['qtyproduk'] - (float)$qtyJumlah;//$r_PPL['jumlah'];
                ////            try {
                //                $newSPG->save();
                ////                $transStatus = 'true';
                ////            } catch (\Exception $e) {
                //                $transStatus = 'false';
                //                $transMessage = "update Stok Pasien";
                ////            }
                $dataSaldoAwal = DB::select(
                    DB::raw("select  saldoawal,jumlah,status from KartuStok_t
                      where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                    array(
                        'ruanganfk' => $r_SR['ruanganfk'],
                        'produkfk' => $r_PPL['produkfk'],
                    )
                );

                $saldoAwal = 0;
                if ($dataSaldoAwal == []) {
                    $dataSaldoAwal = DB::select(
                        DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                          where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                        array(
                            'ruanganfk' => $r_SR['ruanganfk'], //$r_PPL['ruanganfk'],
                            'produkfk' => $r_PPL['produkfk'],
                        )
                    );
                    //            $saldoAwal = (float)$r_PPL['jmlstok'] ;
                    foreach ($dataSaldoAwal as $item) {
                        $saldoAwal = (float)$item->qty;
                    }
                } else {
                    foreach ($dataSaldoAwal as $item) {
                        $saldoAwal = (float)$item->saldoawal - $qtyJumlah;
                    }
                }


                $dataKS[] = [];
                $tglnow1 =  date('Y-m-d H:i:s');
                $tglnow1 = date('Y-m-d H:i:s', strtotime('+1 minutes', strtotime($tglnow1)));;
                $datastoknoterima =  KartuStok::where('produkfk', $r_PPL['produkfk'])
                    ->where('ruanganfk', $r_SR['ruanganfk'])
                    ->where('created_at', '<', $tglnow1)
                    ->where('nostrukterimafk', $r_PPL['nostrukterimafk'])
                    ->whereNotNull('saldonoterima')
                    ->orderBy('tglinput', 'desc')
                    ->take(1)
                    ->get();

                $stoknoterima = NULL;
                foreach ($datastoknoterima as $itemz) {
                    if ($itemz->status == false) {
                        $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                    } else {
                        $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                    }
                }
                if ($isRetur == true) {
                } else {

                    //## KartuStok
                    $newKS = new KartuStok();
                    $norecKS = $newKS->generateNewId();
                    $newKS->norec = $norecKS;
                    $newKS->kdprofile = 0;
                    $newKS->statusenabled = true;
                    $newKS->jumlah = $qtyJumlah; //$r_PPL['jumlah'];
                    $newKS->keterangan = 'Pelayanan Obat Alkes ' . ' ' . $noResep . ' ' . $namaPasien;
                    $newKS->produkfk = $r_PPL['produkfk'];
                    $newKS->ruanganfk = $r_SR['ruanganfk']; //$r_PPL['ruanganfk'];
                    $newKS->saldoawal = (float)$saldoAwal; //- (float)$qtyJumlah;
                    $newKS->status = 0;
                    $newKS->tglinput = date('Y-m-d H:i:s'); //$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                    $newKS->tglkejadian = date('Y-m-d H:i:s'); //$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                    $newKS->nostrukterimafk =  $r_PPL['nostrukterimafk'];
                    $newKS->norectransaksi = $norec_PP;
                    $newKS->tabletransaksi = 'pelayananpasien_t';
                    $newKS->flagfk = 7;
                    $newKS->saldonoterima = $stoknoterima;
                    $newKS->save();

                    $dataKS[] = $newKS;
                    //                $transStatus = 'true';
                    //            } catch (\Exception $e) {
                    //                $transStatus = 'false';
                    //                $transMessage = "Kartu Stok Pasien";
                    //            }
                }
                //tandapareum
                //## Petugas
                $newP3 = new PelayananPasienPetugas();
                $norecKS = $newP3->generateNewId();
                $newP3->norec = $norecKS;
                $newP3->kdprofile = 0;
                $newP3->statusenabled = true;
                $newP3->nomasukfk = $r_PPL['noregistrasifk'];
                $newP3->objectasalprodukfk = $r_PPL['asalprodukfk'];
                $newP3->objectjenispetugaspefk = 3; //Dokter Penanggung Jawab
                $newP3->objectprodukfk = $r_PPL['produkfk'];
                $newP3->objectruanganfk = $r_SR['ruanganfk']; //$r_PPL['ruanganfk'];
                $newP3->pelayananpasien = $norec_PP;
                $newP3->tglpelayanan = $r_SR['tglresep']; //$r_SR['tglresep']->format('Y-m-d H:i:s');
                $newP3->objectpegawaifk = $dokterPenulis;
                //            try {
                $newP3->save();

                //                $transStatus = 'true';
                //            } catch (\Exception $e) {
                //                $transStatus = 'false';
                //                $transMessage = "Kartu Stok Pasien";
                //            }

            }
            //tandapateum
            //             $kdRuanganDepoRajal = $this->settingDataFixed('kdRuanganDepoRajal');
            //             if ($r_SR['noorder'] != 'EditResep') {

            // //                return $this->respond($r_SR['noorder'] != 'EditResep' && $r_SR['noorder'] != '');
            //                 if ($r_SR['noorder'] != 'EditResep' && $r_SR['noorder'] != '') {
            //                     $historyOrder = StrukOrder::where('noorder', $r_SR['noorder'])->first();
            //                     if ($historyOrder->noantri != "" || $historyOrder->noantri != null) {
            //                         //                $updateAntrian = AntrianApotik::where('noantri',$historyOrder->noantri)
            // //                                ->where('keterangan', $namaPasien)
            // //                                ->where('jenis', $racikanORnonracikan)
            // //                                ->update([
            // //                                    'tglresep' => date('Y-m-d H:i:s'),
            // //                                    'noresep' => $noResep
            // //                                ]);
            //                         $newAA = new AntrianApotik();
            //                         $norecAA = $newAA->generateNewId();
            //                         $newAA->norec = $norecAA;
            //                         $newAA->kdprofile = 0;
            //                         $newAA->statusenabled = true;
            //                         $newAA->noantri = $historyOrder->noantri; //(int)$countAntrian + 1;//substr($noResep,-4);
            //                         $newAA->keterangan = $namaPasien;
            //                         $newAA->jenis = $racikanORnonracikan;
            //                         $newAA->tglresep = date('Y-m-d H:i:s');
            //                         $newAA->noresep = $noResep;
            //                         $newAA->save();

            //                     }elseif ($r_SR['noresep'] == '-'
            //                         && $r_SR['ruanganfk'] == $kdRuanganDepoRajal) {

            //                         $countAntrian = AntrianApotik::where('jenis', $racikanORnonracikan)
            //                             ->whereBetween('tglresep', [date('Y-m-d 00:00'), date('Y-m-d 23:59')])
            //                             ->max('noantri');

            //                         $noAntriApotik = (str_pad((int)$countAntrian + 1, 4, "0", STR_PAD_LEFT));
            //                         $newAA = new AntrianApotik();
            //                         $norecAA = $newAA->generateNewId();
            //                         $newAA->norec = $norecAA;
            //                         $newAA->kdprofile = 0;
            //                         $newAA->statusenabled = true;
            //                         $newAA->noantri = $noAntriApotik; //(int)$countAntrian + 1;//substr($noResep,-4);
            //                         $newAA->keterangan = $namaPasien;
            //                         $newAA->jenis = $racikanORnonracikan;
            //                         $newAA->tglresep = date('Y-m-d H:i:s');
            //                         $newAA->noresep = $noResep;
            //                         $newAA->save();

            //                         if ($r_SR['noorder'] != 'EditResep' && $r_SR['noorder'] != '') {
            //                             $dataOrder = StrukOrder::where('noorder', $r_SR['noorder'])
            //                                 ->update([
            //                                     'noantri' => $noAntriApotik,
            //                                     'jenis' => $racikanORnonracikan,
            //                                     'keterangaantrian' => $namaPasien,
            //                                 ]);
            //                         }
            //                     }
            //                 }
            //             }
            // return($datastoknoterima );
            // die;
            // endregion
            $transStatus = 'true';
        } catch (\Exception $e) {
            // return($request['pelayananpasien']);
            // die;
            return ($e);
            die;
            $transStatus = 'false';
        }

        //        $transMessage = "Kartu Stok Pasien";
        //        $transStatus = 'false';
        //
        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Apotik Berhasil";
            // return($transMessage );
            //             die;
            DB::commit();
            //            $cekSR = StrukResep::where('noresep',$newSR->noresep)->get();
            //            if (count($cekSR) > 1){
            //                if (isset($r_SR['isobatalkes']) && $r_SR['isobatalkes'] == true){
            //                    $noResep = $this->generateCode(new StrukResep, 'noresep', 12, 'OA/' . $this->getDateTime()->format('ym') . '/');
            //                }else{
            //                    $noResep = $this->generateCode(new StrukResep, 'noresep', 12, 'O/' . $this->getDateTime()->format('ym') . '/');
            //                }
            //                $updateSR = StrukResep::where('norec',$norec_SR)->update([
            //                        'noresep' => $noResep]
            //                );
            //            }
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newSR, //$noResep,,//$noResep,
                "dataPP" => $dataPP,
                "dataKS" => $dataKS,
                "R_PPL" => $r_PPL,
                //                "double" => count($cekSR),
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Pelayanan Apotik Gagal!!";
            // return($transMessage );
            // die;
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newSR, //$noResep,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataWaktuMinum(Request $request)
    {
        $detail = $request->all();
        $Norec = $request['Norec_sr'];
        $data = DB::select(DB::raw("SELECT ps.nocm,ps.namapasien,CONVERT (VARCHAR, ps.tgllahir, 105) AS tgllahir,sr.noresep,CONVERT (VARCHAR, sr.tglresep, 105) AS tglresep,
                             pr.namaproduk,pp.aturanpakai,pp.rke,CASE WHEN alm.alamatlengkap IS NULL THEN '-' ELSE alm.alamatlengkap END AS alamat,
                             ps.notelepon,ss.satuanstandar,pp.jumlah,CASE WHEN pp.ispagi = 1 THEN 'Pagi : 07:00 - 07:30' ELSE '-' END AS pagi,
                             CASE WHEN pp.issiang = 1 THEN 'Siang : 13:00 - 13:30' ELSE '-' END AS siang,
                             CASE WHEN pp.issore = 1 THEN 'Sore : 13:00 - 13:30' ELSE '-' END AS sore,
                             CASE WHEN pp.ismalam = 1 THEN 'Malam : 19:00 - 20:00' ELSE '-' END AS malam,
                             pp.keteranganpakai
                             FROM pelayananpasien_t AS pp
                             INNER JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                             INNER JOIN produk_m AS pr ON pr.id = pp.produkfk
                             INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                             INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                             INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                             LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                             INNER JOIN satuanstandar_m AS ss ON ss.id = pp.satuanviewfk
                             WHERE pp.jeniskemasanfk = 2 AND sr.norec = '$Norec'            
                             UNION ALL                
                             SELECT DISTINCT ps.nocm,ps.namapasien,CONVERT (VARCHAR, ps.tgllahir, 105) AS tgllahir,sr.noresep,CONVERT (VARCHAR, sr.tglresep, 105) AS tglresep,
                             'rke-' + pp.rke + ' Racikan' AS namaproduk,pp.aturanpakai,pp.rke,CASE WHEN alm.alamatlengkap IS NULL THEN '-' ELSE alm.alamatlengkap END AS alamat,
                             ps.notelepon,CASE WHEN jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,((pp.qtydetailresep / pp.dosis) * pro.kekuatan) AS jumlah,
                             CASE WHEN pp.ispagi = 1 THEN 'Pagi : 07:00 - 07:30' ELSE '-' END AS pagi,
                             CASE WHEN pp.issiang = 1 THEN 'Siang : 13:00 - 13:30' ELSE '-' END AS siang,
                             CASE WHEN pp.issore = 1 THEN 'Sore : 13:00 - 13:30' ELSE '-' END AS sore,
                             CASE WHEN pp.ismalam = 1 THEN 'Malam : 19:00 - 20:00' ELSE '-' END AS malam,
                             pp.keteranganpakai
                             FROM strukresep_t AS sr
                             INNER JOIN pelayananpasien_t AS pp ON sr.norec = pp.strukresepfk
                             INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = sr.pasienfk
                             INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                             INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                             LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                             INNER JOIN produk_m AS pro ON pro.id = pp.produkfk
                             INNER JOIN satuanstandar_m AS ss ON ss.id = pp.satuanviewfk
                             INNER JOIN jenisracikan_m AS jr ON jr.id = pp.jenisobatfk
                             WHERE pp.jeniskemasanfk = 1 AND sr.norec = '$Norec'"));
        return $this->respond($data);
    }

    public function getNoStrukKasir(Request $request)
    {
        $norecresep = "";
        if (isset($request['norecresep']) && $request['norecresep'] != "" && $request['norecresep'] != "undefined") {
            $norecresep = " WHERE sr.norec = '" . $request['norecresep'] . "' ";
        }
        $data = DB::select(DB::raw("SELECT  sp.nostruk
            FROM pelayananpasien_t AS pp
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
            LEFT JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
            LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
            $norecresep limit 1"));
        return $this->respond($data);
    }

    public function saveBatalVerifikasiResep(Request $request)
    {
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $request['userData']['id'])
            ->first();
        \DB::beginTransaction();
        try {
            $newSOV = StrukOrder::where('norec', $request['norec_order'])->first();
            $newSOVD = OrderPelayanan::where('noorderfk', $request['norec_order'])->get();
            $dataPD = PasienDaftar::where('norec', $newSOV->noregistrasifk)->first();

            $newSO = new StrukOrderBatalVerif();
            $norecSO = $newSO->generateNewId();
            $newSO->norec = $norecSO;
            $newSO->kdprofile = 0;
            $newSO->statusenabled = true;
            $newSO->isreseppulang = $newSOV->isreseppulang;
            $newSO->nocmfk = $newSOV->nocmfk;
            $newSO->kddokter = $newSOV->kddokter;
            $newSO->objectjenisorderfk = $newSOV->objectjenisorderfk;
            $newSO->isdelivered = $newSOV->isdelivered;
            $newSO->objectkelompoktransaksifk = $newSOV->objectkelompoktransaksifk;
            $newSO->keteranganorder = 'Batal Verifikasi Order Farmasi';
            $newSO->noorder = $newSOV->noorder;
            $newSO->noregistrasifk = $newSOV->noregistrasifk;
            $newSO->qtyproduk = $newSOV->qtyproduk;
            $newSO->qtyjenisproduk = $newSOV->qtyjenisproduk;
            $newSO->objectruanganfk = $newSOV->objectruanganfk;
            $newSO->objectruangantujuanfk = $newSOV->objectruangantujuanfk;
            $newSO->statusorder = $newSOV->statusorder;
            $newSO->tglorder = $newSOV->tglorder;
            $newSO->totalbeamaterai = $newSOV->totalbeamaterai;
            $newSO->totalbiayakirim = $newSOV->totalbiayakirim;
            $newSO->totalbiayatambahan = $newSOV->totalbiayatambahan;
            $newSO->totaldiscount =  $newSOV->totaldiscount;
            $newSO->totalhargasatuan = $newSOV->totalhargasatuan;
            $newSO->totalharusdibayar = $newSOV->totalharusdibayar;
            $newSO->totalpph = $newSOV->totalpph;
            $newSO->totalppn = $newSOV->totalppn;
            $newSO->nourutruangan = $newSOV->nourutruangan;
            $newSO->norecorderfk = $newSOV->norec;
            $newSO->objectpegawaibatalfk = $dataPegawai->objectpegawaifk;
            $newSO->tglbatalverifikasi =  date('Y-m-d H:i:s');
            $newSO->save();
            $norecSO = $newSO->norec;

            foreach ($newSOVD as $r_PPL) {
                $newPP = new StrukOrderBatalVerifDetail();
                $norecPP = $newPP->generateNewId();
                $newPP->norec = $norecPP;
                $newPP->kdprofile = 0;
                $newPP->statusenabled = true;
                $newPP->aturanpakai = $r_PPL['aturanpakai'];
                $newPP->isreadystok = $r_PPL['isreadystok'];
                $newPP->kddokter = $r_PPL['kddokter'];
                $newPP->objectkelasfk = $r_PPL['objectkelasfk'];
                $newPP->nocmfk = $r_PPL['nocmfk'];
                $newPP->noorderfk = $r_PPL['noorderfk'];
                $newPP->noregistrasifk = $r_PPL['noregistrasifk'];
                $newPP->objectprodukfk = $r_PPL['objectprodukfk'];
                $newPP->qtyproduk = $r_PPL['qtyproduk'];
                $newPP->qtystokcurrent = $r_PPL['qtystokcurrent'];
                $newPP->racikanke = $r_PPL['racikanke'];
                $newPP->objectruanganfk = $r_PPL['objectruanganfk'];
                $newPP->objectruangantujuanfk = $r_PPL['objectruangantujuanfk'];
                $newPP->objectsatuanstandarfk = $r_PPL['objectsatuanstandarfk'];
                $newPP->strukorderfk = $r_PPL['strukorderfk'];
                $newPP->tglpelayanan = $r_PPL['tglpelayanan'];
                $newPP->jenisobatfk = $r_PPL['jenisobatfk'];
                $newPP->jumlah = $r_PPL['jumlah'];;
                $newPP->iscito =  $r_PPL['iscito'];;
                $newPP->hargasatuan = $r_PPL['hargasatuan'];
                $newPP->hargadiscount = $r_PPL['hargadiscount'];
                $newPP->qtyprodukretur =  $r_PPL['qtyprodukretur'];;
                $newPP->hasilkonversi = $r_PPL['hasilkonversi'];;
                $newPP->jeniskemasanfk = $r_PPL['jeniskemasanfk'];
                $newPP->dosis = $r_PPL['dosis'];
                $newPP->rke = $r_PPL['rke'];
                $newPP->satuanviewfk = $r_PPL['satuanviewfk'];
                $newPP->ispagi = $r_PPL['ispagi'];
                $newPP->issiang = $r_PPL['issiang'];
                $newPP->ismalam = $r_PPL['ismalam'];
                $newPP->issore = $r_PPL['issore'];
                $newPP->keteranganpakai = $r_PPL['keteranganpakai'];
                $newPP->norecdetailbatal = $r_PPL['norec'];
                $newPP->strukbatalfk = $norecSO;
                $newPP->save();
            }

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 12;
            $logUser->statusenabled = true;
            $logUser->jenislog = "Batal Verifikasi Order Resep Elektronik";
            $logUser->keterangan = "Batal Verifikasi Order Resep Elektronik No. Order : " . $newSOV->noorder . " / Noregistrasi : " . $dataPD->noregistrasi;
            $logUser->noreff = $newSOV->norec;
            $logUser->referensi = 'Norec Struk Order';
            $logUser->objectloginuserfk =  $request['userData']['id'];
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Batal Verifikasi Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Batal Verifikasi Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function ubahdokter(Request $request)
    {
        DB::beginTransaction();
        try {
            // return($request['norec']);
            // die();
            $dataResep = StrukResep::where('norec', $request['norec'])
                ->update(['penulisresepfk' => $request['pegawaifk']]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Ubah resep berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Ubah resep berhasil Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newPP, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function SimpanPelayananObatKronis(Request $request)
    {
        ini_set('max_execution_time', 50000); //6 minutes
        DB::beginTransaction();
        $r_SR = $request['strukresep'];
        try {
            $dataPPOK = PelayananPasienObatKronis::where('strukresepfk', $request['norecresep'])->first();
            foreach ($request['pelayananpasienobatkronis'] as $item) {
                if ($dataPPOK == '') {
                    $newPP = new PelayananPasienObatKronis();
                    $norecPPOK = $newPP->generateNewId();
                    $newPP->norec = $norecPPOK;
                    $newPP->kdprofile = 0;
                    $newPP->statusenabled = true;
                } else {
                    $delPP = PelayananPasienObatKronis::where('strukresepfk', $request['norecresep'])->delete();
                }
                $qtyJumlah = $item['jumlahcetak'];
                $newPP->noregistrasifk = $item['noregistrasifk'];
                $newPP->aturanpakai = $item['aturanpakai'];
                if (isset($item['generik'])) {
                    $newPP->generik = $item['generik'];
                }
                $newPP->hargadiscount = $item['hargadiscount'];
                $newPP->hargajual = $item['hargajual'];
                $newPP->hargasatuan = $item['hargasatuan'];
                $newPP->jenisobatfk = $item['jenisobatfk'];
                $newPP->jumlah = $qtyJumlah;
                $newPP->kelasfk = $item['kelasfk'];
                $newPP->kdkelompoktransaksi = 1;
                $newPP->produkfk = $item['produkfk'];
                if (isset($item['routefk'])) {
                    $newPP->routefk = $item['routefk'];
                }
                $newPP->stock = $item['stock'];
                $newPP->tglpelayanan = $r_SR['tglresep'];
                $newPP->harganetto = $item['harganetto'];
                $newPP->jeniskemasanfk = $item['jeniskemasanfk'];
                $newPP->rke = $item['rke'];
                $newPP->strukresepfk = $request['norecresep'];
                $newPP->satuanviewfk = $item['satuanviewfk'];
                $newPP->nilaikonversi = $item['nilaikonversi'];
                $newPP->strukterimafk = $item['nostrukterimafk'];
                $newPP->dosis = $item['dosis'];
                $newPP->jasa =  $item['jasa'];
                $newPP->isobat = 1;
                $newPP->save();

                $getNoresep = StrukResep::where('norec', $request['norecresep'])
                    ->select('noresep')
                    ->get();
                foreach ($getNoresep as $itn) {
                    $noResep = $itn->noresep;
                }
                $GetNorec = StokProdukDetail::where('nostrukterimafk', $item['nostrukterimafk'])
                    ->where('objectruanganfk', $request['strukresep']['ruanganfk'])
                    // ->where('objectasalprodukfk',$request['asalprodukfk'])
                    ->where('objectprodukfk', $item['produkfk'])
                    ->select('norec')
                    ->get();
                $jmlPengurang = (float)$qtyJumlah;
                $kurangStok = (float)0;
                $namaPasien = $request['strukresep']['nocm'] . ' ' . $request['strukresep']['namapasien'];

                foreach ($GetNorec as $itemx) {

                    $newSPD = StokProdukDetail::where('nostrukterimafk', $item['nostrukterimafk'])
                        ->where('objectruanganfk', $request['strukresep']['ruanganfk'])
                        // ->where('objectasalprodukfk',$request['asalprodukfk'])
                        ->where('objectprodukfk', $item['produkfk'])
                        ->where('norec', $itemx->norec)
                        ->first();

                    if ((float)$newSPD->qtyproduk <= (float)$jmlPengurang) {
                        $kurangStok = (float)$newSPD->qtyproduk;
                        $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                    } else {
                        $kurangStok = (float)$jmlPengurang;
                        $jmlPengurang = (float)$jmlPengurang - (float)$kurangStok;
                    }
                    $newSPD->qtyproduk = (float)$newSPD->qtyproduk - (float)$kurangStok; //$r_PPL['jumlah'];
                    $newSPD->save();
                }


                $dataSaldoAwal = DB::select(
                    DB::raw("select  saldoawal,jumlah,status from KartuStok_t
                      where ruanganfk=:ruanganfk and produkfk=:produkfk order by created_at desc limit 1"),
                    array(
                        'ruanganfk' => $request['strukresep']['ruanganfk'],
                        'produkfk' => $item['produkfk'],
                    )
                );
                // return($dataSaldoAwal);
                // die();
                $saldoAwal = 0;
                if ($dataSaldoAwal == []) {
                    $dataSaldoAwal = DB::select(
                        DB::raw("select sum(qtyproduk) as qty from stokprodukdetail_t 
                          where objectruanganfk=:ruanganfk and objectprodukfk=:produkfk"),
                        array(
                            'ruanganfk' => $request['strukresep']['ruanganfk'], //$r_PPL['ruanganfk'],
                            'produkfk' => $item['produkfk'],
                        )
                    );
                    //            $saldoAwal = (float)$r_PPL['jmlstok'] ;
                    foreach ($dataSaldoAwal as $itemr) {
                        $saldoAwal = (float)$itemr->qty;
                    }
                } else {
                    foreach ($dataSaldoAwal as $itemr) {
                        $saldoAwal = (float)$itemr->saldoawal - $qtyJumlah;
                    }
                }
                // return($saldoAwal);
                // die();
                $tglnow1 =  date('Y-m-d H:i:s');
                // return( $item['produkfk']);
                // die();
                $datastoknoterima =  KartuStok::where('produkfk', $item['produkfk'])
                    ->where('ruanganfk', $request['strukresep']['ruanganfk'])
                    ->where('created_at', '<', $tglnow1)
                    ->where('nostrukterimafk', $item['nostrukterimafk'])
                    ->whereNotNull('saldonoterima')
                    ->orderBy('tglinput', 'desc')
                    ->take(1)
                    ->get();

                $stoknoterima = NULL;
                foreach ($datastoknoterima as $itemz) {
                    if ($itemz->status == false) {
                        $stoknoterima = $itemz->saldonoterima - $itemz->jumlah;
                    } else {
                        $stoknoterima = $itemz->saldonoterima + $itemz->jumlah;
                    }
                }

                $newKS = new KartuStok();
                $norecKS = $newKS->generateNewId();
                $newKS->norec = $norecKS;
                $newKS->kdprofile = 0;
                $newKS->statusenabled = true;
                $newKS->jumlah = $qtyJumlah; //$r_PPL['jumlah'];
                $newKS->keterangan = 'Pelayanan Obat Alkes Kronis ' . ' ' . $noResep . ' ' . $namaPasien;
                $newKS->produkfk =  $item['produkfk'];
                $newKS->ruanganfk = $request['strukresep']['ruanganfk']; //$item->ruanganfk;
                $newKS->saldoawal = (float)$saldoAwal; //- (float)$qtyJumlah;
                $newKS->status = 0;
                $newKS->tglinput = date('Y-m-d H:i:s'); //$r_SR['tglresep'];//$r_SR['tglresep']->format('Y-m-d H:i:s');
                $newKS->tglkejadian = date('Y-m-d H:i:s'); //$r_SR['tglresep'];// $r_SR['tglresep']->format('Y-m-d H:i:s');
                $newKS->nostrukterimafk =  $item['nostrukterimafk'];
                $newKS->norectransaksi = $norecPPOK;
                $newKS->tabletransaksi = 'pelayananpasien_t';
                $newKS->flagfk = 7;
                $newKS->saldonoterima = $stoknoterima;
                $newKS->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Pelayanan Obat Kronis Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newPP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Pelayanan Obat Kronis Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newPP, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getTransaksiPelayananObatKronis(Request $request)
    {
        $detail = $request->all();
        $data = \DB::table('pelayananpasienobatkronis_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->JOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('jeniskemasan_m as jkm', 'jkm.id', '=', 'pp.jeniskemasanfk')
            ->leftJoin('jenisracikan_m as jra', 'jra.id', '=', 'pp.jenisobatfk')
            ->leftJoin('satuanstandar_m as ss', 'ss.id', '=', 'pp.satuanviewfk')
            ->leftJoin('satuanstandar_m as ss2', 'ss2.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftJOIN('konversisatuan_t as ks', function ($join) {
                $join->on('ks.objekprodukfk', '=', 'pr.id')
                    ->on('ks.satuanstandar_tujuan', '=', 'pp.satuanviewfk');
            })
            ->leftJOIN('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftJOIN('ruangan_m as ru2', 'ru2.id', '=', 'sr.ruanganfk')
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'ss.satuanstandar',
                'pp.jumlah',
                'pp.hargasatuan',
                'pp.hargadiscount',
                'sp.nostruk',
                'pd.noregistrasi',
                'ks.nilaikonversi',
                'ss2.satuanstandar as satuanstandar2',
                'sr.noresep',
                'sr.norec as norec_resep',
                'pp.rke',
                'jkm.jeniskemasan',
                'jk.id as jkid',
                'pp.jenisobatfk',
                'jra.jenisracikan',
                'pp.jasa',
                'ru2.id as ruangandepoid',
                'ru2.namaruangan as ruangandepo',
                DB::raw("sr.noresep || '/23' as noresepok")
            )
            ->where('jp.id', 97)
            ->orderBy('pp.tglpelayanan', 'pp.rke');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        // if(isset($request['noregistrasifk']) && $request['noregistrasifk']!="" && $request['noregistrasifk']!="undefined"){
        //     $data = $data->where('pp.noregistrasifk','=', $request['noregistrasifk']);
        // }
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        }
        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('sr.norec', '=', $request['norec_resep']);
        }
        $data = $data->get();
        // return($data);
        // die();
        $rke = 0;
        foreach ($data as $item) {
            if (isset($item->nilaikonversi)) {
                $nKonversi = $item->nilaikonversi;
            } else {
                $nKonversi = 1;
            }
            if (isset($item->satuanstandar)) {
                $ss = $item->satuanstandar;
            } else {
                $ss = $item->satuanstandar2;
            }
            $JenisKemasan = $item->jeniskemasan;
            if (isset($item->jenisracikan)) {
                $JenisKemasan = $item->jeniskemasan . '/' . $item->jenisracikan;
            }
            //            $tarifjasa =0;
            //            $qty20 =0;
            //            if ($item->jkid == 2){
            //                $tarifjasa = 800;
            //            }
            ////            $rke = 0;
            //            if ($item->rke != $rke) {
            //                if ($item->jkid == 1) {
            //                    $rke=$item->rke;
            //                    $qty20 = number_format($item->jumlah / 20, 0);
            //                    if ($item->jumlah % 20 == 0) {
            //                        $qty20 = $qty20;
            //                    } else {
            //                        $qty20 = $qty20 + 1;
            //                    }
            //
            //                    $tarifjasa = 800 * $qty20;
            //                }
            //            }
            $jasa = 0;
            if (isset($item->jasa) && $item->jasa != "" && $item->jasa != "undefined") {
                $jasa = $item->jasa;
            }

            $result[] = array(
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'tglpelayanan' => $item->tglpelayanan,
                'produkfk' => $item->produkfk,
                'namaproduk' => $item->namaproduk,
                'satuanstandar' => $ss,
                'jumlah' => (float)$item->jumlah / (float)$nKonversi,
                'hargasatuan' => $item->hargasatuan,
                'hargadiscount' => $item->hargadiscount,
                'nostruk' => $item->nostruk,
                'noregistrasi' => $item->noregistrasi,
                'noresep' => $item->noresep, // .'/'.$item->noregistrasi,
                'rke' => $item->rke,
                'jeniskemasan' => $JenisKemasan,
                'norec_resep' =>  $item->norec_resep,
                'detail' => $detail,
                'jasa' => $jasa,
                'depoid' => $item->ruangandepoid,
                'namaruangandepo' => $item->ruangandepo,
                'noresepok' => $item->noresepok
            );
        }
        return $this->respond($result);
    }

    public function cekObatPsikotropika(Request $request)
    {
        $data = Produk::where('id', $request['idproduk'])->select('namaproduk', 'ispsikotropika', 'isnarkotika')->first();

        $result = array(
            'data' => $data,
            'by' => 'dy'
        );

        return $this->respond($result);
    }
    public function getTransaksiPelayananObatTap(Request $request)
    {
        $detail = $request->all();
        $data = \DB::table('pelayananobattap_t as pp')
            ->JOIN('pasien_m as ps', 'ps.nocm', '=', 'pp.nocm')
            ->JOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.objectprodukfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'pp.objectruangan')
            ->leftJoin('satuanstandar_m as ss2', 'ss2.id', '=', 'pr.objectsatuanstandarfk')
            ->select(
                DB::raw("0 as no"),
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'pp.tglpelayanan',
                'pp.objectprodukfk',
                'pr.namaproduk',
                'ss2.satuanstandar',
                'pp.qty',
                'pp.harga',
                'ru.id as ruangandepoid',
                'ru.namaruangan as ruangandepo',
                'pp.noresep',
                'pp.norec',
                DB::raw("pp.harga * pp.qty as total")
            )

            ->orderBy('pp.tglpelayanan');
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['nocm']);
        }
        // if(isset($request['noregistrasifk']) && $request['noregistrasifk']!="" && $request['noregistrasifk']!="undefined"){
        //     $data = $data->where('pp.noregistrasifk','=', $request['noregistrasifk']);
        // }

        if (isset($request['norec_resep']) && $request['norec_resep'] != "" && $request['norec_resep'] != "undefined") {
            $data = $data->where('pp.norec', '=', $request['norec_resep']);
        }
        $data = $data->get();
        // return($data);
        // die();
        $rke = 0;
        foreach ($data as $item) {

            if (isset($item->satuanstandar)) {
                $ss = $item->satuanstandar;
            } else {
                $ss = $item->satuanstandar2;
            }


            $result[] = array(
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'tglpelayanan' => $item->tglpelayanan,
                'produkfk' => $item->objectprodukfk,
                'namaproduk' => $item->namaproduk,
                'satuanstandar' => $ss,
                'jumlah' => (float)$item->qty,
                'harga' => $item->harga,
                'norec_resep' =>  $item->norec,
                'detail' => $detail,
                'depoid' => $item->ruangandepoid,
                'namaruangandepo' => $item->ruangandepo,
                'noresep' => $item->noresep,
                'total' => $item->total,
                'no' => $item->no,
            );
        }
        return $this->respond($result);
    }
}
