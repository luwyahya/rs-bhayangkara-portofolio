<?php

/**
 * Created by PhpStorm.
 * User: Agus Sustian
 * Date: 9/11/2019
 * Time: 10:54 AM
 */

/**
 * Powered by .
 * User: Egie Ramdan
 * Date: 9/11/2019
 * Time: 10:54 AM
 */

namespace App\Http\Controllers\Remunerasi;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Traits\Valet;
use App\Transaksi\StrukPagu;
use App\Transaksi\StrukDetailPagu;
use App\Transaksi\MapJenisPaguToPegawai;
use App\Transaksi\DetailPegawaiPagu;
use App\Transaksi\StrukClosing;
use App\Transaksi\PotonganRemun;
use App\Transaksi\JasaPelayananDokter;
use App\Transaksi\Pasiendaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\LoggingUser;

use App\Master\SettingDataFixed;

use Webpatser\Uuid\Uuid;
use DB;

class RemunerasiController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getCombo(Request $request)
    {

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
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



        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,

            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getRemunerasiJP1_rev2(Request $request)
    {
        //TODO : CARI PAGU
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $nama = $request['nama'];
        $produk = $request['produk'];
        $dtdtdt2 = [];
        $dataPersen3 = [];

        $SCSC = StrukPagu::where('periodeawal', $request['tglAwal'])->get();
        $StrukPagu = false;
        if (count($SCSC) > 0) {
            $StrukPagu = true;
        }
        //        $data = DB::select(DB::raw(
        //            "
        //				select pp.tglpelayanan,pr.namaproduk,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)  as jasapelayanan,
        //				pgpj.namalengkap as dokterpj ,pgpj.id as dokterpjid ,
        //                apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,
        //                (case when ppd.jasa is null then 0 else ppd.jasa end)*pp.jumlah as jasa
        //                from pelayananpasiendetail_t as ppd
        //                inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                left join produk_m as pr on pr.id =ppd.produkfk
        //                left join ruangan_m as ru on ru.id=apd.objectruanganfk
        //                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pgpj.namalengkap like '%$nama%'
        //                and pr.namaproduk like '%$produk%'
        //                and ppd.komponenhargafk=35 and ppp.objectjenispetugaspefk=4 and pp.isparamedis is null
        //
        //                union ALL
        //
        //                select pp.tglpelayanan,pr.namaproduk,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah) as jasapelayanan,
        //                pgpj.namalengkap as dokterpj ,pgpj.id as dokterpjid ,
        //                apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,
        //                (case when ppd.jasa is null then 0 else ppd.jasa end)*pp.jumlah as jasa
        //                from pelayananpasiendetail_t as ppd
        //                inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                left join produk_m as pr on pr.id =ppd.produkfk
        //                left join ruangan_m as ru on ru.id=apd.objectruanganfk
        //                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'  and pgpj.namalengkap like '%$nama%'
        //                and pr.namaproduk like '%$produk%'
        //                and ppd.komponenhargafk=25 and ppp.objectjenispetugaspefk=4 and pp.isparamedis = 1
        //
        //
        //			"
        //        ));
        $data = DB::select(DB::raw(
            "
				--select pp.tglpelayanan,pr.namaproduk,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)  as jasapelayanan,
				--pgpj.namalengkap as dokterpj ,pgpj.id as dokterpjid ,
                --apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,
                --(case when ppd.jasa is null then 0 else ppd.jasa end)*pp.jumlah as jasa,ru.namaruangan
                --from pelayananpasiendetail_t as ppd
                --inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
                --inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
                --left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                --inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                --left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
                --left join produk_m as pr on pr.id =ppd.produkfk
                --left join ruangan_m as ru on ru.id=apd.objectruanganfk
                --where pd.tglpulang between '$tglAwal' and '$tglAkhir' and pgpj.namalengkap like '%$nama%'
               -- and pr.namaproduk like '%$produk%'
                --and ppd.komponenhargafk=94 and ppp.objectjenispetugaspefk=4
                 --and pp.isparamedis is null
                
                select sp.nostruk,sbm.nosbm,pp.tglpelayanan,pr.namaproduk,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)  as jasapelayanan,
                pgpj.namalengkap as dokterpj ,pgpj.id as dokterpjid ,
                apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,
                (case when ppd.jasa is null then 0 else ppd.jasa end)*pp.jumlah as jasa,ru.namaruangan
                from pelayananpasiendetail_t as ppd
                inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
                left join produk_m as pr on pr.id =ppd.produkfk
                left join ruangan_m as ru on ru.id=apd.objectruanganfk
                inner join strukpelayanan_t as sp on sp.norec=pp.strukfk
                inner join strukbuktipenerimaan_t as sbm  on sp.nosbmlastfk = sbm.norec
                where pd.tglpulang between '$tglAwal' and '$tglAkhir' and pgpj.namalengkap like '%$nama%'
                and pr.namaproduk like '%$produk%'
                and ppd.komponenhargafk=94 and ppp.objectjenispetugaspefk=4 
                and pd.objectkelompokpasienlastfk not in (2,4,10)
                 and sbm.statusenabled =1
                union all
                
                select sp.nostruk,sbm.nosbm,pp.tglpelayanan,pr.namaproduk,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)  as jasapelayanan,
                pgpj.namalengkap as dokterpj ,pgpj.id as dokterpjid ,
                apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,
                (case when ppd.jasa is null then 0 else ppd.jasa end)*pp.jumlah as jasa,ru.namaruangan
                from pelayananpasiendetail_t as ppd
                inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
                left join produk_m as pr on pr.id =ppd.produkfk
                left join ruangan_m as ru on ru.id=apd.objectruanganfk
                inner join strukpelayanan_t as sp on sp.norec=pp.strukfk
                inner join strukbuktipenerimaan_t as sbm  on sp.norec = sbm.nostrukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir' and pgpj.namalengkap like '%$nama%'
                and pr.namaproduk like '%$produk%'
                and ppd.komponenhargafk=94 and ppp.objectjenispetugaspefk=4 
                and sbm.statusenabled =1
                and pd.objectkelompokpasienlastfk in (2,4,10)

			"
        ));
        //        $dataDokterAnestesi = DB::select(DB::raw(
        //            "
        //				select pp.tglpelayanan,ppp.objectpegawaifk as dokterpjid ,
        //                pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,pp.isparamedis,pgpj.namalengkap as dokterpj
        //                from  pelayananpasien_t as pp
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'  and pgpj.namalengkap like '%$nama%'
        //                and ppp.objectjenispetugaspefk=6 and pp.isparamedis is null
        //
        //
        //			"
        //        ));
        $dataDokterAnestesi = [];
        //        $dataDokterAnestesi = DB::select(DB::raw(
        //            "
        //				select pp.tglpelayanan,ppp.objectpegawaifk as dokterpjid ,
        //                pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,pp.isparamedis,pgpj.namalengkap as dokterpj
        //                from  pelayananpasien_t as pp
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                where pd.tglpulang between '$tglAwal' and '$tglAkhir'  and pgpj.namalengkap like '%$nama%'
        //                and ppp.objectjenispetugaspefk=6 and pp.isparamedis is null
        //
        //
        //			"
        //        ));
        $newData = [];
        $sama = false;
        $iddokter = '';
        $nmdokter = '';
        foreach ($data as $dt) {
            $sama = false;
            $iddokter = '';
            $nmdokter = '';
            foreach ($dataDokterAnestesi as $da) {
                if ($dt->norec_pp == $da->norec_pp) {
                    $sama = true;
                    $iddokter = $da->objectpegawaifk;
                    $nmdokter = $da->dokterpj;
                }
            }
            if ((float)$dt->jasapelayanan > 0) {
                if ($sama == true) {
                    //                    $newData[] = array(
                    //                        'tglpelayanan' => $dt->tglpelayanan,
                    //                        'namaproduk' => $dt->namaproduk,
                    //                        'jasapelayanan' => ((float)$dt->jasapelayanan /100)*75,
                    //                        'dokterpj' => $dt->dokterpj,
                    //                        'dokterpjid' => $dt->dokterpjid,
                    //                        'norec_apd' => $dt->norec_apd,
                    //                        'jumlah' => $dt->jumlah,
                    //                        'norec_pp' => $dt->norec_pp,
                    //                        'produkfk' => $dt->produkfk,
                    //                        'objectpegawaifk' => $dt->objectpegawaifk,
                    //                        'objectdepartemenfk' => $dt->objectdepartemenfk,
                    //                        'objectruanganfk' => $dt->objectruanganfk,
                    //                        'isparamedis' => $dt->isparamedis,
                    //                        'jasa' => ((float)$dt->jasa /100)*75,//$dt->jasa,
                    //                        'tipedokter' => 'Medis',
                    //                    );
                    //                    $newData[] = array(
                    //                        'tglpelayanan' => $dt->tglpelayanan,
                    //                        'namaproduk' => $dt->namaproduk,
                    //                        'jasapelayanan' => ((float)$dt->jasapelayanan /100)*25,
                    //                        'dokterpj' => $nmdokter,
                    //                        'dokterpjid' => $iddokter,
                    //                        'norec_apd' => $dt->norec_apd,
                    //                        'jumlah' => $dt->jumlah,
                    //                        'norec_pp' => $dt->norec_pp,
                    //                        'produkfk' => $dt->produkfk,
                    //                        'objectpegawaifk' => $dt->objectpegawaifk,
                    //                        'objectdepartemenfk' => $dt->objectdepartemenfk,
                    //                        'objectruanganfk' => $dt->objectruanganfk,
                    //                        'isparamedis' => $dt->isparamedis,
                    //                        'jasa' => ((float)$dt->jasa /100)*25,//$dt->jasa,
                    //                        'tipedokter' => 'Anestesi',
                    //                    );
                } else {
                    $newData[] = array(
                        'tglpelayanan' => $dt->tglpelayanan,
                        'namaproduk' => $dt->namaproduk,
                        'jasapelayanan' => (float)$dt->jasapelayanan,
                        'dokterpj' => $dt->dokterpj,
                        'dokterpjid' => $dt->dokterpjid,
                        'norec_apd' => $dt->norec_apd,
                        'jumlah' => $dt->jumlah,
                        'norec_pp' => $dt->norec_pp,
                        'produkfk' => $dt->produkfk,
                        'objectpegawaifk' => $dt->objectpegawaifk,
                        'objectdepartemenfk' => $dt->objectdepartemenfk,
                        'objectruanganfk' => $dt->objectruanganfk,
                        'isparamedis' => $dt->isparamedis,
                        'jasa' => $dt->jasa,
                        'tipedokter' => 'Medis',
                        'namaruangan' => $dt->namaruangan,
                    );
                }
            }
        }
        //        $data2 = DB::select(DB::raw(
        //            "
        //
        //				select pp.tglpelayanan,pr.namaproduk,
        //                case when pp.isparamedis = 1 then
        //                    sum(case when ppd.komponenhargafk = 35 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                else
        //                    sum(case when ppd.komponenhargafk = 25 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                end as rc,
        //                case when pp.isparamedis = 1 then
        //                    sum(case when ppd.komponenhargafk = 25 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                else
        //                    sum(case when ppd.komponenhargafk = 35 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                end as rcdokter,
        //                sum(case when ppd.komponenhargafk = 88 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as postremun,
        //                sum(case when ppd.komponenhargafk in (86) then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as ccdireksi,
        //                sum(case when ppd.komponenhargafk in (87) then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as ccstaffdireksi,
        //                sum(case when ppd.komponenhargafk in (90) then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as ccmanajemen,
        //                pgpj.namalengkap as dokter ,pgpj.id as dokterid ,
        //                apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis
        //                from pelayananpasiendetail_t as ppd
        //                inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                left join produk_m as pr on pr.id =ppd.produkfk
        //                left join ruangan_m as ru on ru.id=apd.objectruanganfk
        //                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        //                and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (86,87,90,25,88,35)
        //                group by pp.tglpelayanan,pr.namaproduk,
        //                pgpj.namalengkap ,pgpj.id  ,
        //                apd.norec ,pp.jumlah,pp.norec ,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis
        //                order by pp.norec
        //
        //			"
        //        ));

        //
        //        $data2 = DB::select(DB::raw(
        //            "
        //
        //				select pp.tglpelayanan,pr.namaproduk,
        //                case when pp.isparamedis = 1 then
        //                    sum(case when ppd.komponenhargafk = 35 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                else
        //                    sum(case when ppd.komponenhargafk = 25 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                end as rc,
        //                case when pp.isparamedis = 1 then
        //                    sum(case when ppd.komponenhargafk = 25 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                else
        //                    sum(case when ppd.komponenhargafk = 35 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end)
        //                end as rcdokter,
        //                sum(case when ppd.komponenhargafk = 88 then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as postremun,
        //                sum(case when ppd.komponenhargafk in (86) then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as ccdireksi,
        //                sum(case when ppd.komponenhargafk in (87) then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as ccstaffdireksi,
        //                sum(case when ppd.komponenhargafk in (90) then (((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) else 0 end) as ccmanajemen,
        //                pgpj.namalengkap as dokter ,pgpj.id as dokterid ,
        //                apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis
        //                from pelayananpasiendetail_t as ppd
        //                inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                left join produk_m as pr on pr.id =ppd.produkfk
        //                left join ruangan_m as ru on ru.id=apd.objectruanganfk
        //                where pd.tglpulang between '$tglAwal' and '$tglAkhir'
        //                and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (86,87,90,25,88,35)
        //                group by pp.tglpelayanan,pr.namaproduk,
        //                pgpj.namalengkap ,pgpj.id  ,
        //                apd.norec ,pp.jumlah,pp.norec ,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis
        //                order by pp.norec
        //
        //			"
        //        ));
        $data2 = DB::select(DB::raw(
            "  
  
				select  x.*,
                    (x.jaspel*7.5)/100 as direksi,
                    (x.jaspel*5)/100 as struktural,
                    (x.jaspel*1)/100 as administrasi,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*30)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*35)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*28)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*40)/100
                    else (x.jaspel*45)/100 end as jpl,
                    (x.jaspel*8.5)/100 as jptl,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*48)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*43)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*50)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*38)/100
                    else (x.jaspel*33)/100  end as gabungan
                    from 
                    (select pp.tglpelayanan,pr.namaproduk,                
                    sum((((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) ) as jaspel,
                    pgpj.namalengkap as dokter ,pgpj.id as dokterid ,
                    apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,ru.namaruangan
                    from pelayananpasiendetail_t as ppd
                    inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
                    inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
                    left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                    inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                    left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
                    left join produk_m as pr on pr.id =ppd.produkfk
                    left join ruangan_m as ru on ru.id=apd.objectruanganfk
                    inner join strukpelayanan_t as sp on sp.norec=pp.strukfk
                    inner join strukbuktipenerimaan_t as sbm  on sp.norec = sbm.nostrukfk 
                    where pd.tglpulang between '$tglAwal' and '$tglAkhir'
                    and pgpj.namalengkap like '%$nama%'
                    and pr.namaproduk like '%$produk%'
                    and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (94)
                    and sbm.statusenabled =1
                    and pd.objectkelompokpasienlastfk not in (2,4,10)
                    group by pp.tglpelayanan,pr.namaproduk,ru.namaruangan,
                    pgpj.namalengkap ,pgpj.id  ,
                    apd.norec ,pp.jumlah,pp.norec ,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis) as x

                union all 
                
             select  x.*,
                    (x.jaspel*7.5)/100 as direksi,
                    (x.jaspel*5)/100 as struktural,
                    (x.jaspel*1)/100 as administrasi,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*30)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*35)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*28)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*40)/100
                    else (x.jaspel*45)/100 end as jpl,
                    (x.jaspel*8.5)/100 as jptl,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*48)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*43)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*50)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*38)/100
                    else (x.jaspel*33)/100  end as gabungan
                    from 
                    (select pp.tglpelayanan,pr.namaproduk,                
                    sum((((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) ) as jaspel,
                    pgpj.namalengkap as dokter ,pgpj.id as dokterid ,
                    apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,ru.namaruangan
                    from pelayananpasiendetail_t as ppd
                    inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
                    inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
                    left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                    inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                    left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
                    left join produk_m as pr on pr.id =ppd.produkfk
                    left join ruangan_m as ru on ru.id=apd.objectruanganfk
                     inner join strukpelayanan_t as sp on sp.norec=pp.strukfk
                    inner join strukbuktipenerimaan_t as sbm  on sp.norec = sbm.nostrukfk
                    where pd.tglpulang between '$tglAwal' and '$tglAkhir'
                    and pgpj.namalengkap like '%$nama%'
                    and pr.namaproduk like '%$produk%'
                    and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (94)
                     and sbm.statusenabled =1
                     and pd.objectkelompokpasienlastfk in (2,4,10)
                    group by pp.tglpelayanan,pr.namaproduk,ru.namaruangan,
                    pgpj.namalengkap ,pgpj.id  ,
                    apd.norec ,pp.jumlah,pp.norec ,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis) as x

			"
        ));
        $newData2 = [];
        $sama = false;
        $iddokter = '';
        $nmdokter = '';
        foreach ($data2 as $dt) {
            $sama = false;
            $iddokter = '';
            $nmdokter = '';
            foreach ($dataDokterAnestesi as $da) {
                if ($dt->norec_pp == $da->norec_pp) {
                    $sama = true;
                    $iddokter = $da->objectpegawaifk;
                    $nmdokter = $da->dokterpj;
                }
            }
            if ($sama == true) { //dokter pemeriksa dan dokter anestesi
                //                $newData2[] = array(
                //                    'tglpelayanan' => $dt->tglpelayanan,
                //                    'namaproduk' => $dt->namaproduk,
                //                    'rc' => $dt->rc,
                //                    'rcdokter' => ((float)$dt->rcdokter /100)*75,
                //                    'postremun' => $dt->postremun,
                //                    'ccdireksi' => $dt->ccdireksi,
                //                    'ccstaffdireksi' => $dt->ccstaffdireksi,
                //                    'ccmanajemen' => $dt->ccmanajemen,
                //                    'dokter' => $dt->dokter,
                //                    'dokterid' => $dt->dokterid,
                //                    'norec_apd' => $dt->norec_apd,
                //                    'jumlah' => $dt->jumlah,
                //                    'norec_pp' => $dt->norec_pp,
                //                    'produkfk' => $dt->produkfk,
                //                    'objectdepartemenfk' => $dt->objectdepartemenfk,
                //                    'objectruanganfk' => $dt->objectruanganfk,
                //                    'isparamedis' => $dt->isparamedis,
                //                    'tipedokter' => 'RCD Medis',
                //                );
                //                $newData2[] = array(
                //                    'tglpelayanan' => $dt->tglpelayanan,
                //                    'namaproduk' => $dt->namaproduk,
                //                    'rc' => $dt->rc,
                //                    'rcdokter' => ((float)$dt->rcdokter /100)*25,
                //                    'postremun' => 0,
                //                    'ccdireksi' => 0,
                //                    'ccstaffdireksi' => 0,
                //                    'ccmanajemen' => 0,
                //                    'dokter' => $nmdokter,
                //                    'dokterid' => $iddokter,
                //                    'norec_apd' => $dt->norec_apd,
                //                    'jumlah' => $dt->jumlah,
                //                    'norec_pp' => $dt->norec_pp,
                //                    'produkfk' => $dt->produkfk,
                //                    'objectdepartemenfk' => $dt->objectdepartemenfk,
                //                    'objectruanganfk' => $dt->objectruanganfk,
                //                    'isparamedis' => $dt->isparamedis,
                //                    'tipedokter' => 'RDC anestesi',
                //                );
            } else {
                if ($dt->objectdepartemenfk == 28) { //jasa paramedis 60% ke CC direksi
                    //                    $newData2[] = array(
                    //                        'tglpelayanan' => $dt->tglpelayanan,
                    //                        'namaproduk' => $dt->namaproduk,
                    //                        'rc' =>  0,
                    //                        'rcdokter' => 0,
                    //                        'postremun' => 0,
                    //                        'ccdireksi' => (((float)$dt->rc)/100)* 60,
                    //                        'ccstaffdireksi' =>0,
                    //                        'ccmanajemen' => 0,
                    //                        'dokter' => $dt->dokter,
                    //                        'dokterid' => $dt->dokterid,
                    //                        'norec_apd' => $dt->norec_apd,
                    //                        'jumlah' => $dt->jumlah,
                    //                        'norec_pp' => $dt->norec_pp,
                    //                        'produkfk' => $dt->produkfk,
                    //                        'objectdepartemenfk' => $dt->objectdepartemenfk,
                    //                        'objectruanganfk' => $dt->objectruanganfk,
                    //                        'isparamedis' => $dt->isparamedis,
                    //                        'tipedokter' => 'RC Paramedis to CC Direksi 60%',
                    //                    );
                    //                    $newData2[] = array(
                    //                        'tglpelayanan' => $dt->tglpelayanan,
                    //                        'namaproduk' => $dt->namaproduk,
                    //                        'rc' => (((float)$dt->rc)/100)* 40  ,
                    //                        'rcdokter' => $dt->rcdokter,
                    //                        'postremun' => $dt->postremun,
                    //                        'ccdireksi' => $dt->ccdireksi,
                    //                        'ccstaffdireksi' => $dt->ccstaffdireksi,
                    //                        'ccmanajemen' => $dt->ccmanajemen,
                    //                        'dokter' => $dt->dokter,
                    //                        'dokterid' => $dt->dokterid,
                    //                        'norec_apd' => $dt->norec_apd,
                    //                        'jumlah' => $dt->jumlah,
                    //                        'norec_pp' => $dt->norec_pp,
                    //                        'produkfk' => $dt->produkfk,
                    //                        'objectdepartemenfk' => $dt->objectdepartemenfk,
                    //                        'objectruanganfk' => $dt->objectruanganfk,
                    //                        'isparamedis' => $dt->isparamedis,
                    //                        'tipedokter' => 'RC Paramedis to RC 40%',
                    //                    );
                } else {
                    $newData2[] = array(
                        'tglpelayanan' => $dt->tglpelayanan,
                        'namaproduk' => $dt->namaproduk,
                        'rc' => (float)$dt->jptl,
                        'rcdokter' => $dt->jpl,
                        'postremun' => $dt->gabungan,
                        'ccdireksi' => $dt->direksi,
                        'ccstaffdireksi' => $dt->struktural,
                        'ccmanajemen' => $dt->administrasi,
                        'dokter' => $dt->dokter,
                        'dokterid' => $dt->dokterid,
                        'norec_apd' => $dt->norec_apd,
                        'jumlah' => $dt->jumlah,
                        'norec_pp' => $dt->norec_pp,
                        'produkfk' => $dt->produkfk,
                        'objectdepartemenfk' => $dt->objectdepartemenfk,
                        'objectruanganfk' => $dt->objectruanganfk,
                        'isparamedis' => $dt->isparamedis,
                        'tipedokter' => 'Medis',
                        'namaruangan' =>  $dt->namaruangan,
                    );
                }
            }
        }

        $result = array(
            //            'data1' => $data,
            'data1' => $newData,
            //            'data2' => $data2,
            'data2' => $newData2,
            'data3' => $dataDokterAnestesi,
            'strukpagu' => $StrukPagu,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function saveStrukPaguWithDetailRev2(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        ini_set('max_execution_time', 500); //6 minutes
        try {
            $dataPegawai = \DB::table('loginuser_s as lu')
                ->select('lu.objectpegawaifk')
                ->where('lu.id', $dataReq['userData']['id'])
                ->first();
            $SCSC = StrukPagu::where('periodeawal', $dataReq['head']['periodeawal'])
                ->select('norec')
                ->first();

            if (!empty($SCSC)) {
                $delSCSC = StrukPagu::where('norec', $SCSC->norec)
                    ->delete();
                $delSCSC2 = StrukDetailPagu::where('strukpagufk', $SCSC->norec)
                    ->delete();
            }


            $nostrukpagu = $this->generateCode(new StrukPagu(), 'nostrukpagu', 10, 'PGU/' . $this->getDateTime()->format('ym'));

            $dataSC = new StrukPagu();
            $dataSC->norec = $dataSC->generateNewId();
            $dataSC->kdprofile = 0;
            $dataSC->statusenabled = true;
            $dataSC->nostrukpagu = $nostrukpagu;
            $dataSC->tglstrukpagu = date('Y-m-d H:i:s');
            $dataSC->periodeawal = $dataReq['head']['periodeawal'];
            $dataSC->periodeakhir = null;
            $dataSC->pegawaiuserid = $dataPegawai->objectpegawaifk;
            //            $dataSC->totaljasalayanan = $dataReq['head']['totaljasalayanan'];
            //            $dataSC->totaljasaremun = $dataReq['head']['totaljasaremun'];
            //            $dataSC->totaljasamanajemen = $dataReq['head']['totaljasamanajemen'];
            $dataSC->totalrcdokter = $dataReq['head']['rcdokter'];
            $dataSC->totalpostrm = $dataReq['head']['postremun'];
            $dataSC->totalrc = $dataReq['head']['rc'];
            $dataSC->totalccdireksi = $dataReq['head']['ccdireksi'];
            $dataSC->totalccstaffdireksi = $dataReq['head']['ccstaffdireksi'];
            $dataSC->totalccmanajemen = $dataReq['head']['ccmanajemen'];
            $dataSC->save();

            $norecSC = $dataSC->norec;

            foreach ($dataReq['data'] as $item) {
                if ((float)$item['rcdokter'] > 0) {
                    $dataSPD = new StrukDetailPagu();
                    $dataSPD->norec = $dataSPD->generateNewId();
                    $dataSPD->kdprofile = 0;
                    $dataSPD->statusenabled = true;
                    $dataSPD->strukpagufk = $norecSC;
                    $dataSPD->pelayananpasienfk = $item['norec_pp'];
                    $dataSPD->jenispagufk = 7; //RC DOKTER
                    $dataSPD->jenispagupersen = null;
                    $dataSPD->jenispagunilai = $item['rcdokter'];
                    $dataSPD->produkfk = $item['produkfk'];
                    $dataSPD->dokterid = $item['dokterid'];
                    $dataSPD->tglpelayanan = $item['tglpelayanan'];
                    $dataSPD->jumlah = $item['jumlah'];
                    $dataSPD->ruanganfk = $item['objectruanganfk'];
                    $dataSPD->namaexternal = $item['tipedokter'];
                    $dataSPD->save();
                }

                //                'tipedokter' => 'RDC anestesi',
                if ((float)$item['rc'] > 0) {
                    if ($item['tipedokter'] != 'RDC anestesi') {
                        $dataSPD = new StrukDetailPagu();
                        $dataSPD->norec = $dataSPD->generateNewId();
                        $dataSPD->kdprofile = 0;
                        $dataSPD->statusenabled = true;
                        $dataSPD->strukpagufk = $norecSC;
                        $dataSPD->pelayananpasienfk = $item['norec_pp'];
                        $dataSPD->jenispagufk = 8; //RC
                        $dataSPD->jenispagupersen = null;
                        $dataSPD->jenispagunilai = $item['rc'];
                        $dataSPD->produkfk = $item['produkfk'];
                        //                $dataSPD->dokterid = $item['dokterid'];
                        $dataSPD->tglpelayanan = $item['tglpelayanan'];
                        $dataSPD->jumlah = $item['jumlah'];
                        $dataSPD->ruanganfk = $item['objectruanganfk'];
                        $dataSPD->namaexternal = $item['tipedokter'];
                        $dataSPD->save();
                    }
                }

                if ((float)$item['postremun'] > 0) {
                    if ($item['tipedokter'] != 'RDC anestesi') {
                        $dataSPD = new StrukDetailPagu();
                        $dataSPD->norec = $dataSPD->generateNewId();
                        $dataSPD->kdprofile = 0;
                        $dataSPD->statusenabled = true;
                        $dataSPD->strukpagufk = $norecSC;
                        $dataSPD->pelayananpasienfk = $item['norec_pp'];
                        $dataSPD->jenispagufk = 9; //POST REMUN
                        $dataSPD->jenispagupersen = null;
                        $dataSPD->jenispagunilai = $item['postremun'];
                        $dataSPD->produkfk = $item['produkfk'];
                        //                $dataSPD->dokterid = $item['dokterid'];
                        $dataSPD->tglpelayanan = $item['tglpelayanan'];
                        $dataSPD->jumlah = $item['jumlah'];
                        $dataSPD->ruanganfk = $item['objectruanganfk'];
                        $dataSPD->namaexternal = $item['tipedokter'];
                        $dataSPD->save();
                    }
                }

                if ((float)$item['ccdireksi'] > 0) {
                    if ($item['tipedokter'] != 'RDC anestesi') {
                        $dataSPD = new StrukDetailPagu();
                        $dataSPD->norec = $dataSPD->generateNewId();
                        $dataSPD->kdprofile = 0;
                        $dataSPD->statusenabled = true;
                        $dataSPD->strukpagufk = $norecSC;
                        $dataSPD->pelayananpasienfk = $item['norec_pp'];
                        $dataSPD->jenispagufk = 10; //CC DIREKSI
                        $dataSPD->jenispagupersen = null;
                        $dataSPD->jenispagunilai = $item['ccdireksi'];
                        $dataSPD->produkfk = $item['produkfk'];
                        //                $dataSPD->dokterid = $item['dokterid'];
                        $dataSPD->tglpelayanan = $item['tglpelayanan'];
                        $dataSPD->jumlah = $item['jumlah'];
                        $dataSPD->ruanganfk = $item['objectruanganfk'];
                        $dataSPD->namaexternal = $item['tipedokter'];
                        $dataSPD->save();
                    }
                }

                if ((float)$item['ccstaffdireksi'] > 0) {
                    if ($item['tipedokter'] != 'RDC anestesi') {
                        $dataSPD = new StrukDetailPagu();
                        $dataSPD->norec = $dataSPD->generateNewId();
                        $dataSPD->kdprofile = 0;
                        $dataSPD->statusenabled = true;
                        $dataSPD->strukpagufk = $norecSC;
                        $dataSPD->pelayananpasienfk = $item['norec_pp'];
                        $dataSPD->jenispagufk = 11; //CC STAFF DIREKSI
                        $dataSPD->jenispagupersen = null;
                        $dataSPD->jenispagunilai = $item['ccstaffdireksi'];
                        $dataSPD->produkfk = $item['produkfk'];
                        //                $dataSPD->dokterid = $item['dokterid'];
                        $dataSPD->tglpelayanan = $item['tglpelayanan'];
                        $dataSPD->jumlah = $item['jumlah'];
                        $dataSPD->ruanganfk = $item['objectruanganfk'];
                        $dataSPD->namaexternal = $item['tipedokter'];
                        $dataSPD->save();
                    }
                }

                if ((float)$item['ccmanajemen'] > 0) {
                    if ($item['tipedokter'] != 'RDC anestesi') {
                        $dataSPD = new StrukDetailPagu();
                        $dataSPD->norec = $dataSPD->generateNewId();
                        $dataSPD->kdprofile = 0;
                        $dataSPD->statusenabled = true;
                        $dataSPD->strukpagufk = $norecSC;
                        $dataSPD->pelayananpasienfk = $item['norec_pp'];
                        $dataSPD->jenispagufk = 12; //CC MANAJEMEN
                        $dataSPD->jenispagupersen = null;
                        $dataSPD->jenispagunilai = $item['ccmanajemen'];
                        $dataSPD->produkfk = $item['produkfk'];
                        //                $dataSPD->dokterid = $item['dokterid'];
                        $dataSPD->tglpelayanan = $item['tglpelayanan'];
                        $dataSPD->jumlah = $item['jumlah'];
                        $dataSPD->ruanganfk = $item['objectruanganfk'];
                        $dataSPD->namaexternal = $item['tipedokter'];
                        $dataSPD->save();
                    }
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Pagu Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getHitungJP1Rev2(Request $request)
    {
        // : hitung remun
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $dataJasaPelayanan = DB::select(DB::raw(
            "
				select DISTINCT x.jpid,x.jenispagu,x.dokter as namalengkap,x.dokterid as pgid from
                (select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sdp.jenispagunilai as jenispaginilaitotal,sdp.tglpelayanan,
                case when jp.id=7 then sdp.dokterid else null end as dokterid,
                sdp.norec as norec_sdp,pg.namalengkap as dokter,pg2.namalengkap as paramedis
                from  jenispagu_t as jp 
                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                left JOIN pegawai_m as pg on pg.id=sdp.dokterid
                left JOIN pegawai_m as pg2 on pg2.id=sdp.paramedisid
                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0 and jp.id=7 and pg.statusenabled =1 ) as x
			"
        ));

        //        $dataRemunLangsung = DB::select(DB::raw(
        //            "
        //				select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sdp.jenispagunilai as jenispaginilaitotal,sdp.tglpelayanan,
        //                case when jp.id=7 then sdp.dokterid else null end as dokterid,
        //                sdp.norec as norec_sdp,pr.namaproduk
        //                from  jenispagu_t as jp
        //                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
        //                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
        //                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
        //                INNER JOIN produk_m as pr on pr.id=pp.produkfk
        //                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
        //                and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0
        //--                group by jp.kelompokpaguid, jp.id ,jp.jenispagu,sdp.dokterid,sdp.paramedisid,sdp.tglpelayanan;
        //			"
        //        ));
        $dataRemunLangsung = DB::select(DB::raw(
            "
				select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as jenispaginilaitotal,
                case when jp.id=7 then sdp.dokterid else null end as dokterid,sdp.norec as norec_sdp,sdp.tglpelayanan,
                pr.namaproduk
                from  jenispagu_t as jp 
                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                INNER JOIN produk_m as pr on pr.id=pp.produkfk
                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0 
                group by jp.kelompokpaguid, jp.id ,jp.jenispagu,sdp.norec,sdp.tglpelayanan,
                case when jp.id=7 then sdp.dokterid else null end ,
                pr.namaproduk
			"
        ));
        $dtRLangsung = [];
        foreach ($dataRemunLangsung as $itmLangsung) {
            if ($itmLangsung->jpid == 7 && $itmLangsung->dokterid != null) {
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$itmLangsung->dokterid,
                    'jenispaginilaitotal' => (float)$itmLangsung->jenispaginilaitotal,
                    'jpid' => (int)$itmLangsung->jpid,
                    'tglpelayanan' => $itmLangsung->tglpelayanan,
                    'norec_sdp' => $itmLangsung->norec_sdp,
                    'jenis' => 'RC DOKTER',
                    'namaproduk' => $itmLangsung->namaproduk,
                    'jenispagu' => $itmLangsung->jenispagu
                );
            }
        }

        //POST REMUN
        $dataRemunTidakLangsung = DB::select(DB::raw(
            "
				select x.kelompokpaguid,x.jpid,x.jenispagu,x.jenispaginilaitotal,y.totalindex ,
                (x.jenispaginilaitotal / y.totalindex) as jmlRemunperpoint
                from 
                (select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as jenispaginilaitotal,pg.namakaryawan
                from  jenispagu_t as jp 
                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                left JOIN remundetailpegawai_t as pg on pg.idpegawai=sdp.dokterid
                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                and jp.id =9 
                group by jp.kelompokpaguid, jp.id ,jp.jenispagu,sdp.dokterid,sdp.paramedisid,pg.namakaryawan) as x
                INNER JOIN
                (select sum(totalindex2) totalindex,9 as jpid from remundetailpegawai_t)as y on x.jpid=y.jpid
			"
        ));
        $dataPegawaiRemunTidakLangsung = DB::select(DB::raw(
            "	
                select distinct pg.idpegawai  as pgid, pg2.namalengkap,pg.totalindex2
                from mapjenispagutopegawai_t as mp
                INNER JOIN remundetailpegawai_t as pg on pg.idpegawai=mp.pegawaifk
                INNER JOIN pegawai_m as pg2 on pg2.id=pg.idpegawai
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                where jp.kodeexternal <> 'langsung';
			"
        ));
        foreach ($dataPegawaiRemunTidakLangsung as $itm) {
            foreach ($dataRemunTidakLangsung as $itm2) {
                //                if ($itm->jpid == $itm2->jpid){
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$itm->pgid,
                    'jenispaginilaitotal' => (float)$itm2->jmlRemunperpoint * (float)$itm->totalindex2,
                    'jpid' => (int)7,
                    'kelompokpaguid' => (int)$itm2->kelompokpaguid,
                    'tglpelayanan' => null,
                    'norec_sdp' => null,
                    'jenis' => 'POST REMUN',
                    'namaproduk' => round($itm2->jmlRemunperpoint, 3) . ' x ' . $itm->totalindex2,
                    'jenispagu' => $itm2->jenispagu
                );
                //                }
            }
        }
        // END POST REMUN

        $dataRemunTidakLangsungRC = DB::select(DB::raw(
            "
				select (w.totalperruangan/x.ttlpointruangan) as nilaiperpoint,x.ruanganfk,x.namaruangan from
                (select sum(djp.point) as ttlpointruangan,djp.ruanganfk,ru.namaruangan 
                from detailjenispagu_t as djp
                INNER JOIN mapjenispagutopegawai_t as mp on mp.detailjenispagufk=djp.id
                INNER JOIN ruangan_m as ru on ru.id=djp.ruanganfk
                where djp.statusenabled=1
                group by djp.ruanganfk,ru.namaruangan) as x
                LEFT JOIN 
                (select sum(jenispagunilai ) as totalperruangan,ruanganfk 
                from strukdetailpagu_t 
                where jenispagufk=8 and tglpelayanan between '$tglAwal' and '$tglAkhir'
                group by ruanganfk ) as w
                on x.ruanganfk=w.ruanganfk;
			"
        ));
        $dataPegawaiRemunTidakLangsungRC = DB::select(DB::raw(
            "	
                select rdp.namakaryawan, rdp.idpegawai,djp.point,djp.ruanganfk,djp.objectruanganfkarr,jp.jenispagu,jp.id as jpid,djp.detailjenispagu
                from remundetailpegawai_t as rdp
                INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                INNER JOIN jenispagu_t as jp on jp.id=djp.jenispaguid
                where djp.jenispaguid=8;
			"
        ));
        $arrRuanganfk = [];
        foreach ($dataPegawaiRemunTidakLangsungRC as $itm) {
            foreach ($dataRemunTidakLangsungRC as $itm2) {
                $arrRuanganfk = explode(",", $itm->objectruanganfkarr);
                foreach ($arrRuanganfk as $tm) {
                    if ($itm2->ruanganfk == (int)$tm) {
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itm->idpegawai,
                            'jenispaginilaitotal' => (float)$itm->point * (float)$itm2->nilaiperpoint,
                            'kelompokpaguid' => (int)$itm->jpid,
                            'jpid' => (int)8,
                            'tglpelayanan' => null,
                            'norec_sdp' => null,
                            'jenis' => 'RC',
                            'namaproduk' => $itm->detailjenispagu,
                            'jenispagu' => $itm->jenispagu
                        );
                    }
                }
            }
        }
        $dataRemunCCManajemen = DB::select(DB::raw(
            "
				select (w.totalpagu/x.ttlpointmanajemen) as nilaiperpoint,x.jenispaguid from
                (select sum(djp.point) as ttlpointmanajemen,djp.jenispaguid
                from detailjenispagu_t as djp
                INNER JOIN mapjenispagutopegawai_t as mp on mp.detailjenispagufk=djp.id
                where djp.statusenabled=1 and djp.jenispaguid in (12) 
								group by djp.jenispaguid) as x
                LEFT JOIN 
                (select sum(jenispagunilai ) as totalpagu, 12 as jpid
                from strukdetailpagu_t 
                where jenispagufk in (12,11) and tglpelayanan between '$tglAwal' and '$tglAkhir' ) as w
                on x.jenispaguid=w.jpid;
			"
        ));
        $dataPegawaiCCManajemen = DB::select(DB::raw(
            "	
                select rdp.namakaryawan, rdp.idpegawai,djp.point,djp.ruanganfk,djp.objectruanganfkarr,jp.jenispagu,jp.id as jpid,djp.detailjenispagu
                from remundetailpegawai_t as rdp
                INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                INNER JOIN jenispagu_t as jp on jp.id=djp.jenispaguid
                where djp.jenispaguid=12;
			"
        ));
        foreach ($dataPegawaiCCManajemen as $itm) {
            foreach ($dataRemunCCManajemen as $itm2) {
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$itm->idpegawai,
                    'jenispaginilaitotal' => (float)$itm2->nilaiperpoint * (float)$itm->point,
                    'kelompokpaguid' => (int)$itm->jpid,
                    'jpid' => (int)12,
                    'tglpelayanan' => null,
                    'norec_sdp' => null,
                    'jenis' => 'CC MANAJEMEN',
                    'namaproduk' => $itm->detailjenispagu,
                    'jenispagu' => $itm->jenispagu
                );
            }
        }


        $dataSave = $dtRLangsung;
        $result = array(
            //            '$dataRemunTidakLangsungRC' => $arrRuanganfk,
            //            '$dataPegawaiRemunTidakLangsungRC' => $dataPegawaiRemunTidakLangsungRC,
            'dataPegawaiRemunTidakLangsung' => $dataPegawaiRemunTidakLangsung,
            'pegawaijasapelayanan' => $dataJasaPelayanan,
            'datasave' => $dataSave,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDetailJP1(Request $request)
    {
        $noStrukPagu = $request['nostrukpagu'];
        $data = DB::select(DB::raw(
            "
				select x.namaproduk,x.produkfk,
                sum(x.remunDokter) as ttlremunDokter,sum(x.remunParamedis) as ttlremunParamedis,sum(x.remunRekamMedis) as ttlremunRekamMedis,
                sum(x.jasaSDM) as ttljasaSDM,sum(x.jasaManajemen) as ttljasaManajemen,sum(x.jasaNonStruktural) as ttljasaNonStruktural
                from (select pr.namaproduk,pr.id as produkfk,
                case when sdp.jenispagufk = 1 then sdp.jenispagunilai else 0 end as 'remunDokter',
                case when sdp.jenispagufk = 2 then sdp.jenispagunilai else 0 end as 'remunParamedis',
                case when sdp.jenispagufk = 3 then sdp.jenispagunilai else 0 end as 'remunRekamMedis',
                case when sdp.jenispagufk = 4 then sdp.jenispagunilai else 0 end as 'jasaSDM',
                case when sdp.jenispagufk = 5 then sdp.jenispagunilai else 0 end as 'jasaManajemen',
                case when sdp.jenispagufk = 6 then sdp.jenispagunilai else 0 end as 'jasaNonStruktural'
                from strukdetailpagu_t as sdp 
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispagufk
                INNER JOIN produk_m as pr on pr.id=sdp.produkfk
                where sp.nostrukpagu = '$noStrukPagu') as x
                group by x.namaproduk,x.produkfk
			"
        ));

        $data2 = DB::select(DB::raw(
            "
				select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,count(mp.pegawaifk) as jml
                from mapjenispagutopegawai_t as mp
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                group by jp.kelompokpaguid,jp.id ,jp.jenispagu
			"
        ));
        $result = array(
            'data' => $data,
            'datakelompokpegawai' => $data2,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function saveClosingPOSTREMUN(Request $request)
    {
        //TODO : Closing POST Remun
        //        ini_set('max_execution_time', 500); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            //POST REMUN
            $dataPostremunTotal = DB::select(DB::raw(
                "
                        select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as jenispaginilaitotal--,pg.namakaryawan
                        from  jenispagu_t as jp 
                        INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                        --INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                        INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                        --left JOIN remundetailpegawai_t as pg on pg.idpegawai=sdp.dokterid
                        where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                        and jp.id =9 
                        group by jp.kelompokpaguid, jp.id ,jp.jenispagu--,sdp.dokterid,sdp.paramedisid,pg.namakaryawan
                    "
            ));
            $dtPostRemunQTY = DB::select(DB::raw(
                "
                        select 
                        sum(case when case when pr.remunfixed is null then 0 else pr.remunfixed end > 0 then 0 else ((cast(totalindex as float)/100)*(100 -case when pr.potpersen is null then 0 else pr.potpersen end)) end ) as totalindex,
                        9 as jpid 
                        from remundetailpegawai_t as rdp
                        LEFT JOIN potonganremun_t as pr on pr.objectpegawaifk=rdp.idpegawai
                    "
            ));
            $dtPostRemunPotongan = DB::select(DB::raw(
                "
                       select sum(remunfixed) as potfixed from  potonganremun_t where objectjenispagufk=9;
                    "
            ));
            $remunPerPointPostRemun =  ((float)$dataPostremunTotal[0]->jenispaginilaitotal - (float)$dtPostRemunPotongan[0]->potfixed) / (float)$dtPostRemunQTY[0]->totalindex;
            $kelompokpaguPostRemun = $dataPostremunTotal[0]->kelompokpaguid;
            $jenispaguPostRemun = $dataPostremunTotal[0]->jenispagu;
            $dataPegawaiRemunTidakLangsung = DB::select(DB::raw(
                "	
                        select distinct pg.idpegawai  as pgid, --pg2.namalengkap,
                        pg.totalindex,mp.detailjenispagufk,
                        case when pr.potpersen is null then 0 else pr.potpersen end as potpersen,
                        case when pr.remunfixed is null then 0 else pr.remunfixed end as remunfixed
                        from mapjenispagutopegawai_t as mp
                        INNER JOIN remundetailpegawai_t as pg on pg.idpegawai=mp.pegawaifk
                        --INNER JOIN pegawai_m as pg2 on pg2.id=pg.idpegawai
                        INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                          left JOIN potonganremun_t as PR on pr.objectjenispagufk=jp.id and pr.objectpegawaifk=pg.idpegawai
                        where jp.kodeexternal <> 'langsung' and mp.jenispagufk=9;
                    "
            ));
            foreach ($dataPegawaiRemunTidakLangsung as $itm) {
                //                foreach ($dataRemunTidakLangsung as $itm2){
                //                if ($itm->jpid == $itm2->jpid){
                $potpersen = (float)$itm->potpersen;
                if ($remunPerPointPostRemun * (float)$itm->totalindex != 0) {
                    if ($itm->remunfixed == 0) {
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itm->pgid,
                            'jenispaginilaitotal' => $remunPerPointPostRemun * (((float)$itm->totalindex / 100) * (100 - $potpersen)),
                            'jpid' => (int)9,
                            'kelompokpaguid' => (int)$kelompokpaguPostRemun,
                            'tglpelayanan' => null,
                            'norec_sdp' => null,
                            'jenis' => 'POST REMUN',
                            'namaproduk' => round($remunPerPointPostRemun, 3) . ' x ' . $itm->totalindex . '/-' . $potpersen . '%',
                            'jenispagu' => $jenispaguPostRemun,
                            'detailjenispagufk' => $itm->detailjenispagufk,
                            'potpersen' => (100 - $potpersen)
                        );
                    } else {
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itm->pgid,
                            'jenispaginilaitotal' => (float)$itm->remunfixed,
                            'jpid' => (int)9,
                            'kelompokpaguid' => (int)$kelompokpaguPostRemun,
                            'tglpelayanan' => null,
                            'norec_sdp' => null,
                            'jenis' => 'POST REMUN',
                            'namaproduk' => round($itm->remunfixed, 3) . ' x ' . $itm->remunfixed,
                            'jenispagu' => $jenispaguPostRemun,
                            'detailjenispagufk' => $itm->detailjenispagufk,
                            'potpersen' => 'fix ' . $itm->remunfixed
                        );
                    }
                }
                //                }
                //                }
            }
            // END POST REMUN



            $dataSave = $dtRLangsung;
            //        $dataReq = $request->all();
            //        ini_set('max_execution_time', 500); //6 minutes

            $dataPegawai = \DB::table('loginuser_s as lu')
                ->select('lu.objectpegawaifk')
                ->where('lu.id', $rq['userData']['id'])
                ->first();
            $SCSC = StrukClosing::where('tglawal', '>=', $rq['head']['periodeawal'])
                ->where('tglakhir', '<=', $rq['head']['periodeakhir'])
                //                ->where('keteranganlainnya','=','PR')
                ->select('norec')
                ->update([
                    'statusenabled' => 0,
                ]);


            $nostrukClosing = $this->generateCode(new StrukClosing(), 'noclosing', 10, 'RC/' . $this->getDateTime()->format('ym'));

            $dataSC = new StrukClosing();
            $dataSC->norec = $dataSC->generateNewId();
            $dataSC->kdprofile = 0;
            $dataSC->statusenabled = true;
            $dataSC->noclosing = $nostrukClosing;
            $dataSC->tglclosing = date('Y-m-d H:i:s');
            $dataSC->tglawal = $rq['head']['periodeawal'];
            $dataSC->tglakhir = $rq['head']['periodeakhir'];
            $dataSC->objectpegawaidiclosefk = $dataPegawai->objectpegawaifk;
            $dataSC->objectkelompoktransaksifk = 118;
            //            $dataSC->keteranganlainnya = 'PR';
            $dataSC->save();

            $norecSC = $dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                //                $dataSPD->kelompokpaguid = $item['kelompokpaguid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu POST REMUN";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "norecsc" => $norecSC,
                "request" => $rq,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingRCDokter(Request $request)
    {
        //TODO : Closing RC DOKTER
        //        ini_set('max_execution_time', 1000); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            $dataJasaPelayanan = DB::select(DB::raw(
                "
                        select DISTINCT x.jpid,x.jenispagu,--x.dokter as namalengkap,
                        x.dokterid as pgid from
                        (select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sdp.jenispagunilai as jenispaginilaitotal,sdp.tglpelayanan,
                        case when jp.id=7 then sdp.dokterid else null end as dokterid,
                        sdp.norec as norec_sdp--,pg.namalengkap as dokter,pg2.namalengkap as paramedis
                        from  jenispagu_t as jp 
                        INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                        INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                        --left JOIN pegawai_m as pg on pg.id=sdp.dokterid
                        --left JOIN pegawai_m as pg2 on pg2.id=sdp.paramedisid
                        where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                        and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0 and jp.id=7 
                        --and pg.statusenabled =1 
                        ) as x
                    "
            ));

            //            $dataRemunLangsung = DB::select(DB::raw(
            //                "
            //                        select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as jenispaginilaitotal,
            //                        case when jp.id=7 then sdp.dokterid else null end as dokterid,sdp.norec as norec_sdp,sdp.tglpelayanan,
            //                        pr.namaproduk
            //                        from  jenispagu_t as jp
            //                        INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
            //                        INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
            //                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
            //                        INNER JOIN produk_m as pr on pr.id=pp.produkfk
            //                        where sp.periodeawal between '$tglAwal' and '$tglAkhir'
            //                        and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0
            //                        group by jp.kelompokpaguid, jp.id ,jp.jenispagu,sdp.norec,sdp.tglpelayanan,
            //                        case when jp.id=7 then sdp.dokterid else null end ,
            //                        pr.namaproduk
            //                    "
            //            ));
            $dataRemunLangsung = DB::select(DB::raw(
                "
                        select  sum(sdp.jenispagunilai) as jenispaginilaitotal,
                    sdp.dokterid  as dokterid
                    from   strukdetailpagu_t as sdp
                    INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                    where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                    and sdp.dokterid <> 0
                    group by sdp.dokterid
                "
            ));
            $dtRLangsung = [];
            foreach ($dataRemunLangsung as $itmLangsung) {
                if ($itmLangsung->dokterid != null) {
                    if ((float)$itmLangsung->jenispaginilaitotal != 0) {
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itmLangsung->dokterid,
                            'jenispaginilaitotal' => (float)$itmLangsung->jenispaginilaitotal,
                            'jpid' => 7, //(int)$itmLangsung->jpid,
                            'tglpelayanan' => null, //$itmLangsung->tglpelayanan,
                            'norec_sdp' => null, //$itmLangsung->norec_sdp,
                            'jenis' => 'RC DOKTER',
                            'namaproduk' => '', //$itmLangsung->namaproduk,
                            'jenispagu' => 'RC DOKTER', //$itmLangsung->jenispagu,
                            'detailjenispagufk' => 1,
                            'potpersen' => 0,
                        );
                    }
                }
            }
            //            foreach ($dataRemunLangsung as $itmLangsung ){
            //                if ($itmLangsung->jpid == 7 && $itmLangsung->dokterid != null){
            //                    if ((float)$itmLangsung->jenispaginilaitotal != 0){
            //                        $dtRLangsung[] = array(
            //                            'pegawaiid' => (int)$itmLangsung->dokterid,
            //                            'jenispaginilaitotal' => (float)$itmLangsung->jenispaginilaitotal,
            //                            'jpid' => (int)$itmLangsung->jpid,
            //                            'tglpelayanan' => $itmLangsung->tglpelayanan,
            //                            'norec_sdp' => $itmLangsung->norec_sdp,
            //                            'jenis' => 'RC DOKTER',
            //                            'namaproduk' => $itmLangsung->namaproduk,
            //                            'jenispagu' => $itmLangsung->jenispagu,
            //                            'detailjenispagufk' => 1,
            //                            'potpersen' => 0,
            //                        );
            //                    }
            //                }
            //
            //            }

            $dataSave = $dtRLangsung;

            //            $dataPegawai = \DB::table('loginuser_s as lu')
            //                ->select('lu.objectpegawaifk')
            //                ->where('lu.id',$rq['userData']['id'])
            //                ->first();
            //            $SCSC = StrukClosing::where('tglawal','>=',$rq['head']['periodeawal'])
            //                ->where('tglakhir','<=',$rq['head']['periodeakhir'])
            //                ->where('keteranganlainnya','=','RCD')
            //                ->select('norec')
            //                ->update([
            //                    'statusenabled' => 0,
            //                ]);
            //
            //
            //            $nostrukClosing = $this->generateCode(new StrukClosing(), 'noclosing', 10, 'RC/' . $this->getDateTime()->format('ym'));
            //
            //            $dataSC = new StrukClosing();
            //            $dataSC->norec = $dataSC->generateNewId();
            //            $dataSC->kdprofile = 0;
            //            $dataSC->statusenabled = true;
            //            $dataSC->noclosing = $nostrukClosing;
            //            $dataSC->tglclosing = date('Y-m-d H:i:s');
            //            $dataSC->tglawal = $rq['head']['periodeawal'];
            //            $dataSC->tglakhir = $rq['head']['periodeakhir'];
            //            $dataSC->objectpegawaidiclosefk = $dataPegawai->objectpegawaifk;
            //            $dataSC->objectkelompoktransaksifk = 118;
            //            $dataSC->keteranganlainnya = 'RCD';
            //            $dataSC->save();

            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                //                $dataSPD->kelompokpaguid = $item['kelompokpaguid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu RC DOKTER";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "request" => $rq,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingRC(Request $request)
    {
        //TODO : Closing RC
        //        ini_set('max_execution_time', 500); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            $dataRC = DB::select(DB::raw(
                "
                        select agus.ruanganfk,
                        (epic.totalperruangan-case when epic.potperruangan is null then 0 else epic.potperruangan end)/agus.ttlpointruangan as nilaiperpoint 
                        from 
                        (select sum(
                        case when case when pr.remunfixed is null then 0 else pr.remunfixed end  > 0 then 0 else((cast((djp.point) as float)/100)*(100-case when pr.potpersen is null then 0 else pr.potpersen end)) end) as ttlpointruangan, 
                        djp.ruanganfk
                        from detailjenispagu_t as djp
                        INNER JOIN mapjenispagutopegawai_t as mp on mp.detailjenispagufk=djp.id
                        left JOIN potonganremun_t as pr on pr.objectjenispagufk=djp.jenispaguid and pr.objectpegawaifk=mp.pegawaifk
                        where djp.statusenabled=1 --and mp.pegawaifk=22994
                        group by djp.ruanganfk) as agus
                        INNER JOIN
                        (select x.totalperruangan,x.ruanganfk,y.potperruangan from 
                        (select sum(sdp.jenispagunilai ) as totalperruangan,sdp.ruanganfk 
                        from strukdetailpagu_t as sdp
                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                        INNER JOIN produk_m as pr on pr.id=pp.produkfk 
                        where sdp.jenispagufk=8 and sdp.tglpelayanan between '$tglAwal' and '$tglAkhir' 
                        and pr.namaproduk not like '%eeg%'
                        group by sdp.ruanganfk) as x
                        left JOIN 
                        (select sum(pr.remunfixed) as potperruangan,djp.ruanganfk from potonganremun_t as pr 
                        INNER JOIN detailjenispagu_t as djp on djp.id=pr.objectdetailjenispagufk
                        where pr.objectjenispagufk=8 and pr.remunfixed >0
                        group by djp.ruanganfk ) as y on x.ruanganfk=y.ruanganfk) as epic
                        on agus.ruanganfk=epic.ruanganfk
                    "
            ));

            $dataPegawaiRemunTidakLangsungRC = DB::select(DB::raw(
                "	
                        select rdp.namakaryawan, rdp.idpegawai,(cast(djp.point as float)/100) *(100-case when pr.potpersen is null then 0 else pr.potpersen end) as point,
                        djp.ruanganfk,djp.objectruanganfkarr,jp.jenispagu,jp.id as jpid,djp.detailjenispagu,
                        mp.detailjenispagufk,(100-case when pr.potpersen is null then 0 else pr.potpersen end) as potpersen,
                        case when pr.remunfixed is null then 0 else pr.remunfixed end as remunfixed
                        from remundetailpegawai_t as rdp
                        INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                        INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                        INNER JOIN jenispagu_t as jp on jp.id=djp.jenispaguid
                        LEFT JOIN potonganremun_t as pr on pr.objectjenispagufk=jp.id and pr.objectpegawaifk=rdp.idpegawai
                        where djp.jenispaguid=8
                    "
            ));

            $dataEEGMasukKeKaruUnitStroke = DB::select(DB::raw(
                "	
                    select sdp.* from strukdetailpagu_t  as sdp
                    INNER JOIN produk_m as pr on pr.id=sdp.produkfk
                    where  pr.namaproduk like '%eeg%' 
                    and sdp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                    and sdp.jenispagufk=8;
                "
            ));

            $dataPegawaiKaruUnitStroke = DB::select(DB::raw(
                "	
                    select pegawaifk from mapjenispagutopegawai_t where detailjenispagufk=41;
                "
            ));
            foreach ($dataEEGMasukKeKaruUnitStroke as $tuyul) {
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$dataPegawaiKaruUnitStroke[0]->pegawaifk,
                    'jenispaginilaitotal' => (float)$tuyul->jenispagunilai,
                    'kelompokpaguid' => (int)1,
                    'jpid' => (int)8,
                    'tglpelayanan' => null,
                    'norec_sdp' => $tuyul->norec,
                    'jenis' => 'RC',
                    'namaproduk' => 'eeg',
                    'jenispagu' => 'RC',
                    'detailjenispagufk' => 41,
                    'potpersen' => 0,
                );
            }
            $arrRuanganfk = [];
            foreach ($dataPegawaiRemunTidakLangsungRC as $itm) {
                foreach ($dataRC as $itm2) {
                    $arrRuanganfk = $itm->ruanganfk; //explode (",", $itm->objectruanganfkarr);
                    //                    foreach ($arrRuanganfk as $tm){
                    if ($itm2->ruanganfk == (int)$arrRuanganfk) {
                        if ((float)$itm->point * (float)$itm2->nilaiperpoint != 0) {
                            if ($itm->remunfixed == 0) {
                                $dtRLangsung[] = array(
                                    'pegawaiid' => (int)$itm->idpegawai,
                                    'jenispaginilaitotal' => (float)$itm->point * (float)$itm2->nilaiperpoint,
                                    'kelompokpaguid' => (int)$itm->jpid,
                                    'jpid' => (int)8,
                                    'tglpelayanan' => null,
                                    'norec_sdp' => null,
                                    'jenis' => 'RC',
                                    'namaproduk' => $itm->detailjenispagu,
                                    'jenispagu' => $itm->jenispagu,
                                    'detailjenispagufk' => $itm->detailjenispagufk,
                                    'potpersen' => $itm->potpersen,
                                );
                            } else {
                                $dtRLangsung[] = array(
                                    'pegawaiid' => (int)$itm->idpegawai,
                                    'jenispaginilaitotal' => (float)$itm->remunfixed,
                                    'kelompokpaguid' => (int)$itm->jpid,
                                    'jpid' => (int)8,
                                    'tglpelayanan' => null,
                                    'norec_sdp' => null,
                                    'jenis' => 'RC',
                                    'namaproduk' => $itm->detailjenispagu,
                                    'jenispagu' => $itm->jenispagu,
                                    'detailjenispagufk' => $itm->detailjenispagufk,
                                    'potpersen' => 'fix ' .  $itm->remunfixed,
                                );
                            }
                        }
                    }
                    //                    }
                }
            }

            $dataSave = $dtRLangsung;
            //        $dataReq = $request->all();
            //        ini_set('max_execution_time', 500); //6 minutes

            //            $dataPegawai = \DB::table('loginuser_s as lu')
            //                ->select('lu.objectpegawaifk')
            //                ->where('lu.id',$rq['userData']['id'])
            //                ->first();
            //            $SCSC = StrukClosing::where('tglawal','>=',$rq['head']['periodeawal'])
            //                ->where('tglakhir','<=',$rq['head']['periodeakhir'])
            //                ->where('keteranganlainnya','=','RC')
            //                ->select('norec')
            //                ->update([
            //                    'statusenabled' => 0,
            //                ]);
            //
            //
            //            $nostrukClosing = $this->generateCode(new StrukClosing(), 'noclosing', 10, 'RC/' . $this->getDateTime()->format('ym'));
            //
            //            $dataSC = new StrukClosing();
            //            $dataSC->norec = $dataSC->generateNewId();
            //            $dataSC->kdprofile = 0;
            //            $dataSC->statusenabled = true;
            //            $dataSC->noclosing = $nostrukClosing;
            //            $dataSC->tglclosing = date('Y-m-d H:i:s');
            //            $dataSC->tglawal = $rq['head']['periodeawal'];
            //            $dataSC->tglakhir = $rq['head']['periodeakhir'];
            //            $dataSC->objectpegawaidiclosefk = $dataPegawai->objectpegawaifk;
            //            $dataSC->objectkelompoktransaksifk = 118;
            //            $dataSC->keteranganlainnya = 'RC';
            //            $dataSC->save();

            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                $dataSPD->namaexternal = $item['namaproduk'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu RC";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "request" => $rq,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingCC(Request $request)
    {
        //TODO : Closing CC
        //        ini_set('max_execution_time', 500); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            //            $dataRemunCCManajemen = DB::select(DB::raw(
            //                "
            //                        select (w.totalpagu/x.ttlpointmanajemen) as nilaiperpoint,x.jenispaguid from
            //                        (select sum(djp.point) as ttlpointmanajemen,djp.jenispaguid
            //                        from detailjenispagu_t as djp
            //                        INNER JOIN mapjenispagutopegawai_t as mp on mp.detailjenispagufk=djp.id
            //                        where djp.statusenabled=1 and djp.jenispaguid in (12,10)
            //                                        group by djp.jenispaguid) as x
            //                        LEFT JOIN
            //                        (select sum(sdp.jenispagunilai ) as totalpagu, 10 as jpid
            //                        from strukdetailpagu_t as sdp
            //                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
            //                        where sdp.jenispagufk in (12,10) and sdp. tglpelayanan between '$tglAwal' and '$tglAkhir' ) as w
            //                        on x.jenispaguid=w.jpid;
            //                    "
            //            ));
            $dataRemunCCDIREKDITOTAL = DB::select(DB::raw(
                "
                        select sum(sdp.jenispagunilai ) as totalpagu, 10 as jpid
                        from strukdetailpagu_t as sdp
                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                        where sdp.jenispagufk in (12,10) and sdp. tglpelayanan between '$tglAwal' and '$tglAkhir'
                    "
            ));
            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;
            $dataRemunCCKABID19 = DB::select(DB::raw(
                "
                    select sum(dpp.jenispaginilaitotal) as totalPRCCSTAFF from strukclosing_t as sc
                    INNER JOIN detailpegawaipagu_t as dpp on dpp.strukclosingfk=sc.norec
                    INNER JOIN mapjenispagutopegawai_t as mp on  mp.pegawaifk=dpp.pegawaiid
                    where sc.norec= '$norecSC' and dpp.jpid in (10,9) and mp.jenispagufk=10;
                 "
            ));
            //            $dataRemunCCPOint = DB::select(DB::raw(
            //                "
            //                        select sum(djp.point) as ttlpointmanajemen,djp.jenispaguid
            //                        from detailjenispagu_t as djp
            //                        INNER JOIN mapjenispagutopegawai_t as mp on mp.detailjenispagufk=djp.id
            //                        where djp.statusenabled=1 and djp.jenispaguid in (12,10)
            //                        group by djp.jenispaguid
            //                    "
            //            ));
            $dataPegawaiCCManajemen = DB::select(DB::raw(
                "	
                        select rdp.namakaryawan, rdp.idpegawai,djp.point,djp.ruanganfk,djp.objectruanganfkarr,jp.jenispagu,jp.id as jpid,djp.detailjenispagu,
                        mp.detailjenispagufk
                        from remundetailpegawai_t as rdp
                        INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                        INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                        INNER JOIN jenispagu_t as jp on jp.id=djp.jenispaguid
                        where djp.jenispaguid=10;
                    "
            ));
            $remunTotal = (float)$dataRemunCCKABID19[0]->totalPRCCSTAFF + (float)$dataRemunCCDIREKDITOTAL[0]->totalpagu;
            $dir112 = ($remunTotal / 100) * 30; //30%
            $wadir113 = ($remunTotal / 100) * 8; //8%
            $kabid114 = ($remunTotal / 100) * 22; //22%
            $kasubag115 = ($remunTotal / 100) * 40; //40%
            foreach ($dataPegawaiCCManajemen as $itm) {
                if ($itm->detailjenispagufk == 112) { //1
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->idpegawai,
                        'jenispaginilaitotal' => ((float)$dir112),
                        'kelompokpaguid' => (int)$itm->jpid,
                        'jpid' => (int)10,
                        'tglpelayanan' => null,
                        'norec_sdp' => null,
                        'jenis' => 'CC DIREKSI',
                        'namaproduk' => $itm->detailjenispagu,
                        'jenispagu' => $itm->jenispagu,
                        'detailjenispagufk' => $itm->detailjenispagufk,
                        'potpersen' => 0,
                    );
                }
                if ($itm->detailjenispagufk == 113) { //2
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->idpegawai,
                        'jenispaginilaitotal' => ((float)$wadir113 / 2),
                        'kelompokpaguid' => (int)$itm->jpid,
                        'jpid' => (int)10,
                        'tglpelayanan' => null,
                        'norec_sdp' => null,
                        'jenis' => 'CC DIREKSI',
                        'namaproduk' => $itm->detailjenispagu,
                        'jenispagu' => $itm->jenispagu,
                        'detailjenispagufk' => $itm->detailjenispagufk,
                        'potpersen' => 0,
                    );
                }
                if ($itm->detailjenispagufk == 114) { //6
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->idpegawai,
                        'jenispaginilaitotal' => ((float)$kabid114 / 6),
                        'kelompokpaguid' => (int)$itm->jpid,
                        'jpid' => (int)10,
                        'tglpelayanan' => null,
                        'norec_sdp' => null,
                        'jenis' => 'CC DIREKSI',
                        'namaproduk' => $itm->detailjenispagu,
                        'jenispagu' => $itm->jenispagu,
                        'detailjenispagufk' => $itm->detailjenispagufk,
                        'potpersen' => 0,
                    );
                }
                if ($itm->detailjenispagufk == 115) { //13
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->idpegawai,
                        'jenispaginilaitotal' => ((float)$kasubag115 / 13),
                        'kelompokpaguid' => (int)$itm->jpid,
                        'jpid' => (int)10,
                        'tglpelayanan' => null,
                        'norec_sdp' => null,
                        'jenis' => 'CC DIREKSI',
                        'namaproduk' => $itm->detailjenispagu,
                        'jenispagu' => $itm->jenispagu,
                        'detailjenispagufk' => $itm->detailjenispagufk,
                        'potpersen' => 0,
                    );
                }
            }


            $dataSave = $dtRLangsung;
            $dt = DB::raw(
                "
                        update detailpegawaipagu_t set statusenabled = 0
                        where strukclosingfk='$norecSC';
                     "
            );
            //        $dataReq = $request->all();
            //        ini_set('max_execution_time', 500); //6 minutes

            //            $dataPegawai = \DB::table('loginuser_s as lu')
            //                ->select('lu.objectpegawaifk')
            //                ->where('lu.id',$rq['userData']['id'])
            //                ->first();
            //            $SCSC = StrukClosing::where('tglawal','>=',$rq['head']['periodeawal'])
            //                ->where('tglakhir','<=',$rq['head']['periodeakhir'])
            //                ->where('keteranganlainnya','=','CC')
            //                ->select('norec')
            //                ->update([
            //                    'statusenabled' => 0,
            //                ]);
            //
            //
            //            $nostrukClosing = $this->generateCode(new StrukClosing(), 'noclosing', 10, 'RC/' . $this->getDateTime()->format('ym'));
            //
            //            $dataSC = new StrukClosing();
            //            $dataSC->norec = $dataSC->generateNewId();
            //            $dataSC->kdprofile = 0;
            //            $dataSC->statusenabled = true;
            //            $dataSC->noclosing = $nostrukClosing;
            //            $dataSC->tglclosing = date('Y-m-d H:i:s');
            //            $dataSC->tglawal = $rq['head']['periodeawal'];
            //            $dataSC->tglakhir = $rq['head']['periodeakhir'];
            //            $dataSC->objectpegawaidiclosefk = $dataPegawai->objectpegawaifk;
            //            $dataSC->objectkelompoktransaksifk = 118;
            //            $dataSC->keteranganlainnya = 'CC';
            //            $dataSC->save();

            //            $norecSC = $rq['head']['norecsc'];//$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                //                $dataSPD->kelompokpaguid = $item['kelompokpaguid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu CC";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "request" => $rq,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingCCStaff(Request $request)
    {
        //TODO : Closing CC Staff
        //        ini_set('max_execution_time', 500); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            $dataRemunCCManajemen = DB::select(DB::raw(
                "
                        select (w.totalpagu/x.ttlpointmanajemen) as nilaiperpoint,x.jenispaguid from
                        (select sum(djp.point) as ttlpointmanajemen,djp.jenispaguid
                        from detailjenispagu_t as djp
                        INNER JOIN mapjenispagutopegawai_t as mp on mp.detailjenispagufk=djp.id
                        where djp.statusenabled=1 and djp.jenispaguid in (11) 
                                        group by djp.jenispaguid) as x
                        LEFT JOIN 
                        (select sum(sdp.jenispagunilai ) as totalpagu, 11 as jpid
                        from strukdetailpagu_t as sdp
                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                        where sdp.jenispagufk in (11) and sdp. tglpelayanan between '$tglAwal' and '$tglAkhir' ) as w
                        on x.jenispaguid=w.jpid;
                    "
            ));
            $dataPegawaiCCManajemen = DB::select(DB::raw(
                "	
                        select rdp.namakaryawan, rdp.idpegawai,djp.point,djp.ruanganfk,djp.objectruanganfkarr,jp.jenispagu,jp.id as jpid,djp.detailjenispagu,
                        mp.detailjenispagufk
                        from remundetailpegawai_t as rdp
                        INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                        INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                        INNER JOIN jenispagu_t as jp on jp.id=djp.jenispaguid
                        where djp.jenispaguid=11;
                    "
            ));
            foreach ($dataPegawaiCCManajemen as $itm) {
                foreach ($dataRemunCCManajemen as $itm2) {
                    if ((float)$itm2->nilaiperpoint * (float)$itm->point  != 0) {
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itm->idpegawai,
                            'jenispaginilaitotal' => (float)$itm2->nilaiperpoint * (float)$itm->point,
                            'kelompokpaguid' => (int)$itm->jpid,
                            'jpid' => (int)11,
                            'tglpelayanan' => null,
                            'norec_sdp' => null,
                            'jenis' => 'CC MANAJEMEN',
                            'namaproduk' => $itm->detailjenispagu,
                            'jenispagu' => $itm->jenispagu,
                            'detailjenispagufk' => $itm->detailjenispagufk,
                            'potpersen' => 0,
                        );
                    }
                }
            }


            $dataSave = $dtRLangsung;
            //        $dataReq = $request->all();
            //        ini_set('max_execution_time', 500); //6 minutes

            //            $dataPegawai = \DB::table('loginuser_s as lu')
            //                ->select('lu.objectpegawaifk')
            //                ->where('lu.id',$rq['userData']['id'])
            //                ->first();
            //            $SCSC = StrukClosing::where('tglawal','>=',$rq['head']['periodeawal'])
            //                ->where('tglakhir','<=',$rq['head']['periodeakhir'])
            //                ->where('keteranganlainnya','=','CC')
            //                ->select('norec')
            //                ->update([
            //                    'statusenabled' => 0,
            //                ]);
            //
            //
            //            $nostrukClosing = $this->generateCode(new StrukClosing(), 'noclosing', 10, 'RC/' . $this->getDateTime()->format('ym'));
            //
            //            $dataSC = new StrukClosing();
            //            $dataSC->norec = $dataSC->generateNewId();
            //            $dataSC->kdprofile = 0;
            //            $dataSC->statusenabled = true;
            //            $dataSC->noclosing = $nostrukClosing;
            //            $dataSC->tglclosing = date('Y-m-d H:i:s');
            //            $dataSC->tglawal = $rq['head']['periodeawal'];
            //            $dataSC->tglakhir = $rq['head']['periodeakhir'];
            //            $dataSC->objectpegawaidiclosefk = $dataPegawai->objectpegawaifk;
            //            $dataSC->objectkelompoktransaksifk = 118;
            //            $dataSC->keteranganlainnya = 'CC';
            //            $dataSC->save();

            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                //                $dataSPD->kelompokpaguid = $item['kelompokpaguid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu CC Staff";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "request" => $rq,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarJP1Rev2(Request $request)
    {
        //        $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        //        $data = DB::select(DB::raw(
        //            "
        //				select sp.norec,sp.nostrukpagu,sp.tglstrukpagu,sp.periodeawal,sp.periodeakhir,
        //                sp.totalrcdokter as totalrcdokter, sp.totalpostrm as totalpostrm, sp.totalrc as totalrc,
        //                sp.totalccdireksi as totalccdireksi, sp.totalccstaffdireksi as totalccstaffdireksi, sp.totalccmanajemen as totalccmanajemen
        //                 from strukpagu_t as sp
        //                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
        //			"
        //        ));

        /**
         * Ambil reguler aja
         */
        $data = DB::select(DB::raw(
            "
            select x.norec,x.nostrukpagu,x.tglstrukpagu,x.periodeawal,x.periodeakhir,
            sum(x.totalrcdokter) as totalrcdokter,sum(x.totalrc) as totalrc,sum(x.totalpostrm) as totalpostrm,
            sum(x.totalccdireksi) as totalccdireksi,sum(x.totalccstaffdireksi) as totalccstaffdireksi,
            sum(x.totalccmanajemen) as totalccmanajemen
            from (
                select sp.norec,sp.nostrukpagu,sp.tglstrukpagu,sp.periodeawal,sp.periodeakhir,
                    case when sdp.jenispagufk  = 13 then sum(sdp.jenispagunilai) else 0 end as totalrcdokter,
                    case when sdp.jenispagufk  = 14 then sum(sdp.jenispagunilai) else 0 end as totalrc,
                    case when sdp.jenispagufk  = 15 then sum(sdp.jenispagunilai) else 0 end as totalpostrm,
                    case when sdp.jenispagufk  = 16 then sum(sdp.jenispagunilai) else 0 end as totalccdireksi,
                    case when sdp.jenispagufk  = 17 then sum(sdp.jenispagunilai) else 0 end as totalccstaffdireksi,
                    case when sdp.jenispagufk  = 18 then sum(sdp.jenispagunilai) else 0 end as totalccmanajemen
                    from strukdetailpagu_t as sdp
                    INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                    INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk
                    -- INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispagufk
                    where sp.periodeawal BETWEEN '$tglAwal' and '$tglAkhir'
                    and sdp.tglpelayanan  > '2019-05-31 23:59'
                   -- and ru.iseksekutif = 0
                    group by sp.norec,sp.nostrukpagu,sp.tglstrukpagu,sp.periodeawal,sp.periodeakhir,sdp.jenispagufk
            )as x
            group by x.norec,x.nostrukpagu,x.tglstrukpagu,x.periodeawal,x.periodeakhir
        "
        ));

        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getListPegawai(Request $request)
    {
        $teks = $request['teks'];
        $field = $request['field'];
        $jenispaguid = $request['jenispagufk'];
        //        if ($jenispaguid == '-'){
        //            $data = DB::select(DB::raw(
        //                "
        //				select pg.id , pg.namalengkap,jb.namajabatan,kj.namakelompokjabatan ,jp.jenispegawai
        //                from pegawai_m as pg
        //                left JOIN kelompokjabatan_m as kj on kj.id=pg.objectkelompokjabatanfk
        //                left JOIN jabatan_m as jb on jb.id=pg.objectjabatanstrukturalfk
        //                left JOIN jenispegawai_m as jp on jp.id=pg.objectjenispegawaifk
        //                where $field like '%$teks%'
        //			"
        //            ));
        //        }else{
        //            $data = DB::select(DB::raw(
        //                "
        //				select pg.id , pg.namalengkap,jb.namajabatan,kj.namakelompokjabatan ,jp.jenispegawai
        //                from pegawai_m as pg
        //                left JOIN kelompokjabatan_m as kj on kj.id=pg.objectkelompokjabatanfk
        //                left JOIN jabatan_m as jb on jb.id=pg.objectjabatanstrukturalfk
        //                left JOIN jenispegawai_m as jp on jp.id=pg.objectjenispegawaifk
        //                where $field like '%$teks%'
        //                and pg.id not in (select pegawaifk from  mapjenispagutopegawai_t where jenispagufk=$jenispaguid)
        //			"
        //            ));
        //        }
        //        if ($jenispaguid == '-'){
        if ($field == 'namakaryawan') {
            $datastr = " and pg.namalengkap like '%$teks%'";
        } else if ($field == 'jabatan') {
            $datastr = " and jab.namajabatan like '%$teks%'";
        } else if ($field == 'golongan') {
            $datastr = " and gol.name like '%$teks%'";
        }

        //        }else{
        //            $datastr = "and $field like '%$teks%'
        //                and idpegawai not in (select pegawaifk from  mapjenispagutopegawai_t where jenispagufk=$jenispaguid)";
        //        }
        if ($teks == '') {
            $datastr = '';
        }
        $data = DB::select(DB::raw(
            "
            SELECT pg.id AS idpegawai, pg.namalengkap AS namakaryawan, gol.namaexternal AS golongan, jab.reportdisplay AS jabatan 
            FROM pegawai_m AS pg
            LEFT JOIN sdm_golongan_m AS gol ON gol.id = pg.objectgolonganfk
            LEFT JOIN jabatan_m AS jab ON jab.id = pg.objectjabatanfungsionalfk
            WHERE pg.statusenabled = 1
                
            " . $datastr .
                "ORDER BY pg.namalengkap ASC"
        ));
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDataCombo(Request $request)
    {
        $data = DB::select(DB::raw(
            "
				select * from jenispagu_t where 
				statusenabled = 1
				--statusenabled = true
			"
        ));
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDetailPotonganRemunPegawai(Request $request)
    {
        $idpegawai = '';
        if ($request['pegawaifk'] != '') {
            $idpegawai = " where pot.objectpegawaifk=" . $request['pegawaifk'];
        }
        $data = DB::select(DB::raw(
            "
                SELECT
                    jp.jenispagu,
                    pg.namalengkap,
                    pot.*, jp.id AS jpid,
                    djp.detailjenispagu
                FROM
                    potonganremun_t AS pot
                LEFT JOIN jenispagu_t AS jp ON jp.id = pot.objectjenispagufk
                LEFT JOIN detailjenispagu_t AS djp ON djp.id = pot.objectdetailjenispagufk
                INNER JOIN pegawai_m AS pg ON pg.id = pot.objectpegawaifk
                $idpegawai
			"
        ));
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function savePotonganRemun(Request $request)
    {
        DB::beginTransaction();
        $idpot = $request['idpot'];
        try {
            if ($request['method'] == 'save') {
                if ($idpot == '') {
                    $cek = PotonganRemun::where('objectpegawaifk', $request['objectpegawaifk'])->delete();
                    $newId = PotonganRemun::max('id');
                    $newId = $newId + 1;
                    $dataSC = new PotonganRemun();
                    $dataSC->id = $newId;
                    $dataSC->norec = $dataSC->generateNewId();
                    $dataSC->kdprofile = 11;
                    $dataSC->statusenabled = true;
                } else {
                    $dataSC = PotonganRemun::where('id', '=', $idpot)->first();
                }
                $dataSC->objectpegawaifk = $request['objectpegawaifk'];
                $dataSC->potpersen = $request['potpersen'];
                $dataSC->remunfixed = $request['remunfixed'];
                $dataSC->objectjenispagufk = $request['objectjenispagufk'];
                $dataSC->objectdetailjenispagufk = $request['objectdetailjenispagufk'];
                $dataSC->save();
                $transMessage = 'Save Potongan Remun';
            } else {
                $transMessage = 'Delete Potongan Remun';
                PotonganRemun::where('id', '=', $idpot)->delete();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        //        $transMessage = 'Save Potongan Remun';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $norec,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                //                "data" => $data,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveMapJenisPaguToPegawai(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();
        try {

            foreach ($dataReq['data'] as $item) {
                $dataSPD = new MapJenisPaguToPegawai();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->jenispagufk = $dataReq['jenispaguid'];
                $dataSPD->detailjenispagufk = $dataReq['detailjenispaguid'];
                $dataSPD->pegawaifk = (int)$item['idpegawai'];
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Map Jenis Pagu to Pegawai";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPegawaiByJenisPagu(Request $request)
    {
        $jpid = $request['jpid'];
        $data = DB::select(DB::raw(
            "
				select mp.norec, pg.id, pg.namalengkap,jp.id as jpid,jp.jenispagu 
                from mapjenispagutopegawai_t as mp
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
                where jp.id=$jpid
                and pg.statusenabled=1
			"
        ));
        $dataDetailJenisPagu = DB::select(DB::raw(
            "	
            select id,detailjenispagu,objectruanganfkarr,jumlahorg 
            from detailjenispagu_t 
            where jenispaguid = $jpid 
            and statusenabled = 1
            -- and statusenabled = true
            order by id
            
			"
        ));
        $dataRuangan = DB::select(DB::raw(
            "	
            select id,namaruangan from ruangan_m where 
            statusenabled = 1
            -- statusenabled = true
            
			"
        ));
        $arrRuanganfk = [];
        $namaruangan = '';
        $dataHasil = [];
        foreach ($dataDetailJenisPagu as $item) {
            $arrRuanganfk = [];
            $arrRuanganfk = explode(",", $item->objectruanganfkarr);
            $namaruangan = '';
            foreach ($arrRuanganfk as $tm) {
                foreach ($dataRuangan as $itm) {
                    if ($tm ==  $itm->id) {
                        $namaruangan = $itm->namaruangan . ', ' . $namaruangan;
                        break;
                    }
                }
            }
            $dataHasil[] = array(
                'id' => $item->id,
                'detailjenispagu' => $namaruangan . ' - ' . $item->detailjenispagu . ' - ' . $item->jumlahorg,
                //                'namaruangan' => $namaruangan,
            );
        }
        $result = array(
            'data' => $data,
            'detailjenispagu' => $dataHasil,
            //            'ruangan' =>$dataRuangan,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getPegawaiByDetailJenisPagu(Request $request)
    {
        $jpid = $request['jpid'];
        $djpid = $request['djpid'];
        $data = DB::select(DB::raw(
            "
            select mp.norec, pg.id, pg.namalengkap,jp.id as jpid,jp.jenispagu
            from mapjenispagutopegawai_t as mp
            INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
            INNER JOIN pegawai_m as pg on pg.id = mp.pegawaifk
            where jp.id=$jpid and mp.detailjenispagufk = $djpid  order by pg.namalengkap
			"
        ));
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function hapusMapJenisPagutoPegawai(Request $request)
    {
        DB::beginTransaction();
        $norec = $request['norec'];
        try {

            $EMR = MapJenisPaguToPegawai::where('norec', $norec)->delete();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Hapus map pegawai ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $norec,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                //                "data" => $data,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getHitungJP1(Request $request)
    {

        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];

        $dataJasaPelayanan = DB::select(DB::raw(
            "
				select DISTINCT x.jpid,x.jenispagu,x.dokter as namalengkap,x.dokterid as pgid from
                (select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sdp.jenispagunilai as jenispaginilaitotal,sdp.tglpelayanan,
                case when jp.id=1 then sdp.dokterid else null end as dokterid,
                case when jp.id=2 then sdp.paramedisid else null end as paramedisid,
                sdp.norec as norec_sdp,pg.namalengkap as dokter,pg2.namalengkap as paramedis
                from  jenispagu_t as jp 
                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                left JOIN pegawai_m as pg on pg.id=sdp.dokterid
                left JOIN pegawai_m as pg2 on pg2.id=sdp.paramedisid
                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0 and jp.id=1) as x
                union all
                select DISTINCT x.jpid,x.jenispagu,x.paramedis as namalengkap,x.paramedisid as pgid from
                (select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sdp.jenispagunilai as jenispaginilaitotal,sdp.tglpelayanan,
                case when jp.id=1 then sdp.dokterid else null end as dokterid,
                case when jp.id=2 then sdp.paramedisid else null end as paramedisid,
                sdp.norec as norec_sdp,pg.namalengkap as dokter,pg2.namalengkap as paramedis
                from  jenispagu_t as jp 
                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                left JOIN pegawai_m as pg on pg.id=sdp.dokterid
                left JOIN pegawai_m as pg2 on pg2.id=sdp.paramedisid
                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0 and jp.id=2) as x
			"
        ));

        $dataRemunLangsung = DB::select(DB::raw(
            "
				select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sdp.jenispagunilai as jenispaginilaitotal,sdp.tglpelayanan,
                case when jp.id=1 then sdp.dokterid else null end as dokterid,
                sdp.norec as norec_sdp,pr.namaproduk
                from  jenispagu_t as jp 
                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                INNER JOIN produk_m as pr on pr.id=pp.produkfk
                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                and jp.kodeexternal = 'langsung' and sdp.dokterid <> 0 
--                group by jp.kelompokpaguid, jp.id ,jp.jenispagu,sdp.dokterid,sdp.paramedisid,sdp.tglpelayanan;
			"
        ));
        $dtRLangsung = [];
        foreach ($dataRemunLangsung as $itmLangsung) {
            if ($itmLangsung->jpid == 1 && $itmLangsung->dokterid != null) {
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$itmLangsung->dokterid,
                    'jenispaginilaitotal' => (float)$itmLangsung->jenispaginilaitotal,
                    'jpid' => (int)$itmLangsung->jpid,
                    'kelompokpaguid' => (int)$itmLangsung->kelompokpaguid,
                    'tglpelayanan' => $itmLangsung->tglpelayanan,
                    'norec_sdp' => $itmLangsung->norec_sdp,
                    'jenis' => 'remuntindakan',
                    'namaproduk' => $itmLangsung->namaproduk,
                    'jenispagu' => $itmLangsung->jenispagu
                );
            }
            if ($itmLangsung->jpid == 2 && $itmLangsung->paramedisid != null) {
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$itmLangsung->paramedisid,
                    'jenispaginilaitotal' => (float)$itmLangsung->jenispaginilaitotal,
                    'jpid' => (int)$itmLangsung->jpid,
                    'kelompokpaguid' => (int)$itmLangsung->kelompokpaguid,
                    'tglpelayanan' => $itmLangsung->tglpelayanan,
                    'norec_sdp' => $itmLangsung->norec_sdp,
                    'jenis' => 'remuntindakanlangsung',
                    'namaproduk' => $itmLangsung->namaproduk,
                    'jenispagu' => $itmLangsung->jenispagu
                );
            }
        }

        $dataRemunTidakLangsung = DB::select(DB::raw(
            "
				select x.kelompokpaguid,x.jpid,x.jenispagu,x.jenispaginilaitotal,y.jmlpegawai ,
                (x.jenispaginilaitotal / y.jmlpegawai) as jmlRemun,x.tglpelayanan
                from 
                (select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as jenispaginilaitotal,sdp.tglpelayanan
                from  jenispagu_t as jp 
                INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                INNER JOIN pegawai_m as pg on pg.id=sdp.dokterid
                where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                and jp.kodeexternal <> 'langsung' and sdp.dokterid <> 0 
                group by jp.kelompokpaguid, jp.id ,jp.jenispagu,sdp.dokterid,sdp.paramedisid,pg.namalengkap,sdp.tglpelayanan) as x
                INNER JOIN
                (select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,count(mp.pegawaifk) as jmlpegawai
                from mapjenispagutopegawai_t as mp
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                where  jp.kodeexternal <> 'langsung'
                group by jp.kelompokpaguid, jp.id ,jp.jenispagu)as y on x.jpid=y.jpid
			"
        ));
        $dataPegawaiRemunTidakLangsung = DB::select(DB::raw(
            "	
                select pg.id as pgid, pg.namalengkap,jp.id as jpid,jp.jenispagu 
                from mapjenispagutopegawai_t as mp
                INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                where jp.kodeexternal <> 'langsung';
			"
        ));
        foreach ($dataPegawaiRemunTidakLangsung as $itm) {
            foreach ($dataRemunTidakLangsung as $itm2) {
                if ($itm->jpid == $itm2->jpid) {
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->pgid,
                        'jenispaginilaitotal' => (float)$itm2->jmlRemun,
                        'jpid' => (int)$itm->jpid,
                        'kelompokpaguid' => (int)$itm2->kelompokpaguid,
                        'tglpelayanan' => $itm2->tglpelayanan,
                        'norec_sdp' => null,
                        'jenis' => 'remuntindakantidaklangsung',
                        'namaproduk' => null,
                        'jenispagu' => $itm2->jenispagu
                    );
                }
            }
        }
        $dataSave = $dtRLangsung;
        $result = array(
            //            'dataRemunLangsung' => $dataRemunLangsung,
            //            'dataRemunTidakLangsung' => $dataRemunTidakLangsung,
            'dataPegawaiRemunTidakLangsung' => $dataPegawaiRemunTidakLangsung,
            'pegawaijasapelayanan' => $dataJasaPelayanan,
            'datasave' => $dataSave,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDaftarRemunPegawai(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $namapeg = '';
        $row = '';
        if ($request['namalengkap'] != '') {
            $namapeg = " and pg.namalengkap like '%" . $request['namalengkap'] . "%'";
        }
        $ruangan = '';
        if ($request['namaruangan'] != '') {
            $ruangan = " and ru.namaruangan like '%" . $request['namaruangan'] . "%'";
        }
        $noclosing = '';
        if ($request['noclosing'] != '') {
            $noclosing = " and sc.noclosing like '%" . $request['noclosing'] . "%'";
        }
        if ($request['jmlRows'] != '') {
            //            $rowss = (float)$request['jmlRows'] /2;
            $row = "TOP " . $request['jmlRows'];
        }

        $data2 = "
                    select $row  pg.id as pgid, pg.namalengkap as namakaryawan,sc.noclosing,sc.tglawal,sc.tglakhir,
                    jb.namajabatan as jabatan,gol.name as golongan,format(pg.tglmasuk,'yyyy-MM-dd') as skpertamamasukrs,
                    sum(dpp.jenispaginilaitotal) as total
                    from detailpegawaipagu_t as dpp
                    INNER JOIN pegawai_m as pg on pg.id=dpp.pegawaiid
                    left JOIN pendidikan_m as pdd on pdd.id=pg.objectpendidikanterakhirfk
                    left JOIN sdm_golongan_m as gol on gol.id=pg.objectgolonganfk
                    left JOIN jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
                    left JOIN ruangan_m as ru on ru.id=pg.objectruangankerjafk
                    left JOIN petugasdiklat_m as pet on pet.id=pg.objectpetugasdiklatfk
                    INNER JOIN strukclosing_t as sc on sc.norec=dpp.strukclosingfk
                    where sc.tglclosing between '$tglAwal' and '$tglAkhir'  $namapeg
                    $noclosing
                    -- and sc.statusenabled = true
                    and sc.statusenabled = 1
                    and pg.statusenabled = 1
                    and dpp.ruanganfk is null and dpp.djpid <> 142
                    and dpp.statusenabled = 1
                    group by pg.id , pg.namalengkap,
                    jb.namajabatan,gol.name,pg.tglmasuk,sc.noclosing,sc.tglawal,sc.tglakhir
                     
                      
			";
        $data3 = "
                
                select  $row ru.id as pgid, ru.namaruangan as namakaryawan,sc.noclosing,sc.tglawal,sc.tglakhir,
                djp.detailjenispagu as jabatan,'-' as golongan,'-' as skpertamamasukrs,
                sum(dpp.jenispaginilaitotal) as total
                from detailpegawaipagu_t as dpp
                INNER JOIN pegawai_m as pg on pg.id=dpp.pegawaiid
                left JOIN ruangan_m as ru on ru.id=dpp.ruanganfk
                left JOIN detailjenispagu_t as djp on djp.id=dpp.djpid
                INNER JOIN strukclosing_t as sc on sc.norec=dpp.strukclosingfk
                where sc.tglclosing between '$tglAwal' and '$tglAkhir'
                $ruangan
                $noclosing
                -- and sc.statusenabled = true
                and sc.statusenabled = 1
                and pg.statusenabled = 1
                and dpp.statusenabled = 1
                and dpp.ruanganfk is not  null and dpp.djpid = 142
                group by ru.id , ru.namaruangan,
                djp.detailjenispagu,sc.noclosing,sc.tglawal,sc.tglakhir
                
                   ";
        if ($request['iskelompokpenghasil'] == 'true') {
            $datasss = $data3;
        } else {
            $datasss = $data2 . " union all " . $data3;
        }
        $data = DB::select(DB::raw(
            $datasss
        ));
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function saveDetailPegawaiPagu(Request $request)
    {
        //         : CLOSING REMUN old
        DB::beginTransaction();
        $dataReq = $request->all();
        ini_set('max_execution_time', 500); //6 minutes
        try {
            $dataPegawai = \DB::table('loginuser_s as lu')
                ->select('lu.objectpegawaifk')
                ->where('lu.id', $dataReq['userData']['id'])
                ->first();
            $SCSC = StrukClosing::where('tglawal', '>=', $dataReq['head']['periodeawal'])
                ->where('tglakhir', '<=', $dataReq['head']['periodeakhir'])
                ->select('norec')
                ->update([
                    'statusenabled' => 0,
                ]);
            //            if (!empty($SCSC)){
            //                $delSCSC = StrukClosing::where('norec',$SCSC->norec)
            //                    ->delete();
            //                $delDetail = DetailPegawaiPagu::where('strukclosingfk',$SCSC->norec)
            //                    ->delete();
            //            }


            $nostrukClosing = $this->generateCode(new StrukClosing(), 'noclosing', 10, 'RC/' . $this->getDateTime()->format('ym'));

            $dataSC = new StrukClosing();
            $dataSC->norec = $dataSC->generateNewId();
            $dataSC->kdprofile = 0;
            $dataSC->statusenabled = true;
            $dataSC->noclosing = $nostrukClosing;
            $dataSC->tglclosing = date('Y-m-d H:i:s');
            $dataSC->tglawal = $dataReq['head']['periodeawal'];
            $dataSC->tglakhir = $dataReq['head']['periodeakhir'];
            $dataSC->objectpegawaidiclosefk = $dataPegawai->objectpegawaifk;
            $dataSC->objectkelompoktransaksifk = 118;
            $dataSC->save();

            $norecSC = $dataSC->norec;

            foreach ($dataReq['data'] as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                //                $dataSPD->kelompokpaguid = $item['kelompokpaguid'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataClosing(Request $request)
    {
        $dataLogin = $request->all();
        $idpegawai = $dataLogin['userData']['id'];
        $data = DB::select(DB::raw(
            "

                select pg.id, pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on pg.id=lu.objectpegawaifk
                where lu.id=$idpegawai;

			"
        ));
        $data2 = DB::select(DB::raw(
            "   
               SELECT
                noclosing + ', ' + format (tglawal, 'yyyy-MM-dd') + ' s/d ' + format (tglakhir, 'yyyy-MM-dd') AS namaclosing,
                noclosing,
                tglawal,
                tglakhir,
                norec
            FROM
                strukclosing_t
            WHERE
                objectkelompoktransaksifk = 118
            AND statusenabled = 1

			"
        ));
        $result = array(
            'data' => $data,
            'data2' => $data2,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDetailRemunRCCC(Request $request)
    {
        //TODO : DETAIL PELAYANAN REMUN
        $jenispaguid = $request['jenispaguid'];
        $noclosing = $request['noclosing'];
        $pegawaiid = $request['pegawaiid'];
        $detailjenispaguid = $request['detailjenispaguid'];
        $namapasien = '';
        if ($request['namapasien'] != '') {
            $namapasien = "and ps.namapasien like '%" .  $request['namapasien'] . "%'";
        }
        if ($jenispaguid == 8) {
            $data2 = DB::select(DB::raw(
                "
				select djp.*,ru.namaruangan,case when pr.potpersen is null then 0 else pr.potpersen end as potpersen  from mapjenispagutopegawai_t as mp 
                INNER JOIN detailjenispagu_t as djp   on djp.id=mp.detailjenispagufk
                INNER JOIN ruangan_m as ru on ru.id=djp.ruanganfk
                LEFT JOIN potonganremun_t as pr on pr.objectpegawaifk=mp.pegawaifk and pr.objectjenispagufk=djp.jenispaguid
                where mp.pegawaifk=$pegawaiid and djp.jenispaguid=$jenispaguid
                
			"
            ));
            $ruanganfk = 'and sdp.ruanganfk=' . $data2[0]->ruanganfk;
            $ruanganfk2 = 'and sdp.ruanganfk=' . $data2[0]->ruanganfk;
            $jenispaguidid =  'sdp.jenispagufk in (8)';
            $jenispaguidid2 =  'sdp.jenispaguid in (8)';
            $data = DB::select(DB::raw(
                "
                select  sum(sdp.jenispagunilai) as jenispagunilai,sdp.produkfk,pp.hargasatuan ,pr.namaproduk,
                sum(pp.jumlah) as jumlah, pp.isparamedis,pp.iscito,ru.namaruangan
                FROM strukclosing_t AS sp
                INNER JOIN  strukdetailpagu_t AS sdp ON sdp.tglpelayanan between sp.tglawal and sp.tglakhir
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                INNER JOIN produk_m as pr on pr.id=pp.produkfk
                INNER JOIN ruangan_m as ru on ru.id= sdp.ruanganfk
                where sp.noclosing='$noclosing'  $ruanganfk and sdp.jenispagunilai>0
                group by sdp.produkfk,pp.hargasatuan ,pr.namaproduk, pp.isparamedis,pp.iscito,ru.namaruangan
                
			"
            ));
            $data3 = DB::select(DB::raw(
                "
				
                select sum(sdp.point) as pointtotal,count( rdp.idpegawai) as jml
                from remundetailpegawai_t as rdp
                INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                INNER JOIN detailjenispagu_t as sdp on sdp.id=mp.detailjenispagufk
                INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispaguid
                where  $jenispaguidid2 $ruanganfk2
                --and mp.pegawaifk=$pegawaiid
                --and mp.detailjenispagufk=$detailjenispaguid
                
			"
            ));
        }
        if ($jenispaguid == 10) {
            $data2 = DB::select(DB::raw(
                "
				select djp.*,'' as namaruangan  from mapjenispagutopegawai_t as mp 
                INNER JOIN detailjenispagu_t as djp   on djp.id=mp.detailjenispagufk
                where mp.pegawaifk=$pegawaiid  and mp.detailjenispagufk=$detailjenispaguid
                
			"
            ));

            $ruanganfk = '';
            $ruanganfk2 = '';
            $jenispaguidid =  'sdp.jenispagufk in (10,12)';
            $jenispaguidid2 =  'sdp.jenispaguid in (10,12)';
            $data = DB::select(DB::raw(
                "
                select  sum(sdp.jenispagunilai) as jenispagunilai,sdp.produkfk,pp.hargasatuan ,pr.namaproduk,
                sum(pp.jumlah) as jumlah, pp.isparamedis,pp.iscito,ru.namaruangan
                FROM strukclosing_t AS sp
                INNER JOIN  strukdetailpagu_t AS sdp ON sdp.tglpelayanan between sp.tglawal and sp.tglakhir
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                INNER JOIN produk_m as pr on pr.id=pp.produkfk
                INNER JOIN ruangan_m as ru on ru.id= sdp.ruanganfk
                where sp.noclosing='$noclosing'  $ruanganfk and sdp.jenispagunilai>0
                group by sdp.produkfk,pp.hargasatuan ,pr.namaproduk, pp.isparamedis,pp.iscito,ru.namaruangan
                
			"
            ));
            $data3 = DB::select(DB::raw(
                "
				
                select sum(sdp.point) as pointtotal,count( rdp.idpegawai) as jml
                from remundetailpegawai_t as rdp
                INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                INNER JOIN detailjenispagu_t as sdp on sdp.id=mp.detailjenispagufk
                INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispaguid
                where  $jenispaguidid2 $ruanganfk2
                --and mp.pegawaifk=$pegawaiid
                --and mp.detailjenispagufk=$detailjenispaguid
                
			"
            ));
        }
        if ($jenispaguid == 11) {
            $data2 = DB::select(DB::raw(
                "
				select djp.*,'' as namaruangan  from mapjenispagutopegawai_t as mp 
                INNER JOIN detailjenispagu_t as djp   on djp.id=mp.detailjenispagufk
                where mp.pegawaifk=$pegawaiid  and mp.detailjenispagufk=$detailjenispaguid
                
			"
            ));

            $ruanganfk = '';
            $ruanganfk2 = '';
            $jenispaguidid =  'sdp.jenispagufk in (11)';
            $jenispaguidid2 =  'sdp.jenispaguid in (11)';
            $data = DB::select(DB::raw(
                "
                select  sum(sdp.jenispagunilai) as jenispagunilai,sdp.produkfk,pp.hargasatuan ,pr.namaproduk,
                sum(pp.jumlah) as jumlah, pp.isparamedis,pp.iscito,ru.namaruangan
                FROM strukclosing_t AS sp
                INNER JOIN  strukdetailpagu_t AS sdp ON sdp.tglpelayanan between sp.tglawal and sp.tglakhir
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                INNER JOIN produk_m as pr on pr.id=pp.produkfk
                INNER JOIN ruangan_m as ru on ru.id= sdp.ruanganfk
                where sp.noclosing='$noclosing'  $ruanganfk and sdp.jenispagunilai>0
                group by sdp.produkfk,pp.hargasatuan ,pr.namaproduk, pp.isparamedis,pp.iscito,ru.namaruangan
                
			"
            ));
            $data3 = DB::select(DB::raw(
                "
				
                select sum(sdp.point) as pointtotal,count( rdp.idpegawai) as jml
                from remundetailpegawai_t as rdp
                INNER JOIN mapjenispagutopegawai_t as mp on mp.pegawaifk=rdp.idpegawai
                INNER JOIN detailjenispagu_t as sdp on sdp.id=mp.detailjenispagufk
                INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispaguid
                where  $jenispaguidid2 $ruanganfk2
                --and mp.pegawaifk=$pegawaiid
                --and mp.detailjenispagufk=$detailjenispaguid
                
			  "
            ));
        }






        $result = array(
            'data' => $data,
            'data2' => $data2,
            'data3' => $data3,
            'message' => 'ea@epc',
        );
        return $this->respond($result);
    }
    public function getKomponenHargaPelayanan(Request $request)
    {
        $data4 = \DB::table('jasapelayanan_t as jp')
            // ->join('pelayananpasiendetail_t as ppd', 'pp.norec', '=', 'ppd.pelayananpasien')
            ->join('komponenharga_m as kh', 'kh.id', '=', 'jp.jeniskomponen')
            ->select(
                'jp.norecpp as norec_pp',
                'jp.norecppd',
                'kh.komponenharga',
                'jp.jumlah',
                'jp.tarif',
                'jp.bruto',
                'jp.pph',
                'jp.netto'
            )
            ->where('jp.norecpp', $request['norec_pp'])
            ->get();


        $result = array(
            'data' => $data4,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getKomponenHargaPelayananKeuangan(Request $request)
    {
        $data4 = \DB::table('pelayananpasiendetail_t as jp')
            // ->join('pelayananpasiendetail_t as ppd', 'pp.norec', '=', 'ppd.pelayananpasien')
            ->join('komponenharga_m as kh', 'kh.id', '=', 'jp.komponenhargafk')
            ->select(
                'jp.pelayananpasien as norec_pp',
                'jp.norec as norecppd',
                'kh.komponenharga',
                'jp.jumlah',
                'jp.hargasatuan as tarif'
                // 'jp.bruto',
                // 'jp.pph',
                // 'jp.netto'
            )
            ->where('jp.pelayananpasien', $request['norec_pp'])
            ->get();
        $data5 = \DB::table('jasapelayanan_t as jp')
            // ->join('pelayananpasiendetail_t as ppd', 'pp.norec', '=', 'ppd.pelayananpasien')
            ->join('komponenharga_m as kh', 'kh.id', '=', 'jp.jeniskomponen')
            ->select(
                'jp.norecpp as norec_pp',
                'jp.norecppd',
                'kh.komponenharga',
                'jp.jumlah',
                'jp.tarif',
                'jp.bruto',
                'jp.pph',
                'jp.netto'
            )
            ->where('jp.norecpp', $request['norec_pp'])
            ->get();
        // $data1[]="";
        foreach ($data4 as $item) {
            foreach ($data5 as $item1) {
                if ($item->komponenharga == $item1->komponenharga) {
                    $data1[] = array(
                        'norec_pp' => $item->norec_pp,
                        'norecppd' => $item->norecppd,
                        'komponenharga' => $item->komponenharga,
                        'tarif' => $item->tarif,
                        'tarifhitung' => $item1->tarif,
                        'bruto' => $item1->bruto,
                        'pph' => $item1->pph,
                        'netto' => $item1->netto
                    );
                }
            }
        }


        $result = array(
            'data' => $data1,
            'message' => 'noname',
        );
        return $this->respond($result);
    }
    public function getPelayananjasa(Request $request)
    {
        $data4 = \DB::table('v_detailjasapelayanandetail')
            ->where('noregistrasi', $request['noregistrasi'])
            ->get();

        $result = array(
            'data' => $data4,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getRuanganPelayananjasa(Request $request)
    {
        $data4 =  DB::select(DB::raw("SELECT        antrianpasiendiperiksa_t.norec as norecAPD, antrianpasiendiperiksa_t.objectruanganfk AS id, ruangan_m.namaruangan, pasiendaftar_t.norec AS norecPD,antrianpasiendiperiksa_t.tglmasuk
        FROM            pasiendaftar_t INNER JOIN
          antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN
          ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id  where pasiendaftar_t.noregistrasi='$request[noregistrasi]'"));

        $result = array(
            'data' => $data4,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getPelayananjasapenjamin(Request $request)
    {
        $data4 = \DB::table('v_detailjasapelayanan as pp')
            ->where('pp.noregistrasi', $request['noregistrasi'])
            // ->where('namaproduk', 'not like', "%administrasi%")
            // ->where('namaproduk', 'not like', "%eeg%")
            ->whereNull('namaexternal')
            // ->where('namaexternal', '!=','dl')
            ->whereNotIn('ruanganfk', [41])
            ->get();
        $total = 0;
        // foreach ($data4 as $item) {
        //     $total = $total + float
        // }

        $result = array(
            'data' => $data4,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }




    public function getRekapPelayananAll(Request $request)
    {
        $total = 0;
        $details = DB::select(
            DB::raw(
                " select  tglpelayanan, TotalBayar, namaproduk from V_RekapTarifPelayananAll where noregistrasi =$request[noregistrasi] and isRajal ='$request[isRajal]'"

            )
        );
        // return($details);
        // die;
        foreach ($details as $itm) {
            $total = $total + $itm->TotalBayar;
        }
        //  return($total);
        // die;
        $totalbayar = array('TotalBayar' => $total);
        $result = array(
            'data' => $totalbayar,
            'message' => 'all',
        );
        return $this->respond($result);
    }
    public function getDetailPelayananAll(Request $request)
    {
        $details = DB::select(
            DB::raw(
                " select distinct * from V_RekapTarifPelayananAll where noregistrasi =$request[noregistrasi] and isRajal ='$request[isRajal]'"
            )
        );

        $result = array(
            'data' => $details,
            'message' => 'all',
        );
        return $this->respond($result);
    }
    public function getDetailPelayananAllnodistinct(Request $request)
    {
        $details = DB::select(
            DB::raw(
                " select  * from v_tarifAkumulasinodistinct where noregistrasi =$request[noregistrasi] and isRajal ='$request[isRajal]'"
            )
        );

        $result = array(
            'data' => $details,
            'message' => 'all',
        );
        return $this->respond($result);
    }
    
    public function simpanUpdateDiskonKomponen(Request $request)
    {
        $dataLog = $request->all();
        DB::beginTransaction();
        $transStatus = 'true';
        $nilaiCito = 0;
        $totalJasa = 0;
        $tarif = (float)$request['tarifrs'];
        $bruto = (float)$request['bruto'];
        // $jumlah=(float)$request['jumlah'];
        $norecpp = $request['norecpp'];
        $norec = $request['norec'];
        try {


            $data = DB::select(
                DB::raw(
                    "select jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk,jasadokter.objectjenispetugaspefk, jasadokter.objectruanganfk, jasadokter.norecpp,jasadokter.objectdetailjenisprodukfk,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                  jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE (jasadokter.norecppd = '$norec') and jasadokter.objectruanganfk <> 44"
                )
            );


            foreach ($data as $itm) {
                // $bruto = $itm->jumlah * round($tarif,0);
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                // if ($itm->objectdetailjenisprodukfk == '2016'){
                //     // if($itm->produkfk == '4056952'){
                //     if($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25'){
                //         if($itm->objectkelompokpasienlastfk == 2){
                //             $pengali = 0.9;   
                //         }else{
                //             $pengali = 0.8;
                //         }
                //         if($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25'){
                //             if(stripos($itm->namaproduk, 'PEMERIKSAAN') !== false ){
                //                $tarif = $bruto;
                //                 $bruto = ($itm->jumlah * $bruto) * $pengali;
                //             }
                //             if(stripos($itm->namaproduk, 'KONSUL') !== false ){
                //                $tarif = $bruto;
                //                 $bruto = ($itm->jumlah * $bruto) * $pengali;
                //                 if($itm->objectbahanprodukfk == 1){
                //                     if($itm->objectpajakpegawai == 1){
                //                         $tarif = 18000;
                //                         $bruto = 18000;
                //                     }else{
                //                         $tarif = 16000;
                //                         $bruto = 16000;
                //                     }
                //                 }
                //             }else{
                //                 $itm->tarifrs = $bruto;
                //                 $bruto = $bruto;
                //             }
                //             if(stripos($itm->namaproduk, 'PENDAFTARAN') !== false ){
                //                $tarif = $bruto;
                //                 $bruto = ($itm->jumlah * $bruto) * $pengali;
                //             } 
                //         } 
                //     }

                // }elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118' ) {
                //     $bruto = $itm->jumlah * 50000;
                // }
                // if($itm->objectruanganfk == '44'){
                //     if(stripos($itm->namakelas, 'vip') !== false ){
                //         $bruto = ($itm->jumlah * $tarif) * 0.9;                        
                //     }else{
                //         $bruto = ($itm->jumlah *  $tarif) * 0.8;
                //     }
                // }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                $data = JasaPelayananDokter::where('norecppd', $request['norec'])
                    ->update(
                        [
                            'tarif' => $tarif * $itm->jumlah,
                            'bruto' => $bruto * $itm->jumlah,
                            'pph' => $pph,
                            'netto' => $netto
                        ]
                    );
            }

            $data2 = DB::select(
                DB::raw(
                    "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal,jasadokterbedah.objectbahanprodukfk, jasadokterbedah.objectdetailjenisprodukfk, jasadokterbedah.objectjenispetugaspefk,jasadokterbedah.norecpp,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                      jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                      case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                      golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                      WHERE jasadokterbedah.norecppd = '$norec' and jasadokterbedah.objectruanganfk in  (44,277)"
                )
            );
            foreach ($data2 as $itm) {
                $bruto = $itm->jumlah * round($tarif, 0);
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    if ($itm->objectkelompokpasienlastfk == 2) {
                        if ($itm->id != 1) {
                            $pengali = 0.8;
                        } else {
                            $pengali = 0.9;
                        }
                    } else {
                        $pengali = 0.8;
                    }
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                            $tarif = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                        if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                            $tarif = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                            if ($itm->objectbahanprodukfk == 1) {
                                if ($itm->objectpajakpegawai == 1) {
                                    $tarif = 18000;
                                    $bruto = 18000;
                                } else {
                                    $tarif = 16000;
                                    $bruto = 16000;
                                }
                            }
                        } else {
                            $itm->tarifrs = $bruto;
                            $bruto = $bruto;
                        }
                        if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                            $tarif = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    // $tarif = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $tarif) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah * $tarif) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                // return($tarif);
                // die();
                $data = JasaPelayananDokter::where('norecppd', $request['norec'])
                    ->update(
                        [
                            'tarif' => $tarif * $itm->jumlah,
                            'bruto' => $bruto,
                            'pph' => $pph,
                            'netto' => $netto
                        ]
                    );
            }






            $transMessage = "Update Diskon Komponen berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Diskon Komponen gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                // "data" => $dataaa,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataLog,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function kembalikanHargaKomponen(Request $request)
    {
        $dataLog = $request->all();
        DB::beginTransaction();
        $transStatus = 'true';
        $nilaiCito = 0;
        $totalJasa = 0;
        $tarif = (float)$request['tarifrs'];
        $bruto = (float)$request['bruto'];
        // $jumlah=(float)$request['jumlah'];
        $norecpp = $request['norecpp'];
        $norec = $request['norec'];
        $pengali =  $request['persen'] / 100;
        try {


            $data = DB::select(
                DB::raw(
                    "SELECT  v_jasapelayanan.norec , jasapelayanan_t.tarif  , jasapelayanan_t.tarif * ($pengali) AS bruto, CASE WHEN jasapelayanan_t.objectpajakfk = 1 THEN ((jasapelayanan_t.tarif * ($pengali))) 
                            * 0.15 WHEN jasapelayanan_t.objectpajakfk = 2 THEN ((jasapelayanan_t.tarif * ($pengali)) ) * 0.05 WHEN jasapelayanan_t.objectpajakfk = 3 THEN ((jasapelayanan_t.tarif * ($pengali)) 
                            ) * 0.025 END AS ppn, CASE WHEN jasapelayanan_t.objectpajakfk = 1 THEN ((jasapelayanan_t.tarif * $pengali) ) - (((jasapelayanan_t.tarif * $pengali) 
                            ) * 0.15) WHEN jasapelayanan_t.objectpajakfk = 2 THEN (((jasapelayanan_t.tarif * $pengali) )) - (((jasapelayanan_t.tarif * $pengali) 
                            ) * 0.05) WHEN jasapelayanan_t.objectpajakfk = 3 THEN (((jasapelayanan_t.tarif * $pengali))) - (((jasapelayanan_t.tarif * $pengali) 
                            ) * 0.025) END AS netto
                        FROM            v_jasapelayanan INNER JOIN
                                pasiendaftar_t ON v_jasapelayanan.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN
                                pelayananpasiendetail_t ON v_jasapelayanan.norecppd = pelayananpasiendetail_t.norec INNER JOIN
                                pelayananpasien_t ON pelayananpasiendetail_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN
                                jasapelayanan_t ON v_jasapelayanan.norec = jasapelayanan_t.norec
                        WHERE    (v_jasapelayanan.reportdisplay LIKE '%bpjs%') AND (pasiendaftar_t.persenJasaLast IS NOT NULL) 
                        and (pelayananpasiendetail_t.norec = '$norec') "
                )
            );

            foreach ($data as $itm) {


                $tarif = $itm->tarif;
                $bruto =   $itm->bruto;
                $pph = $itm->ppn;
                $netto = $itm->netto;
                $data = JasaPelayananDokter::where('norec', $itm->norec)
                    ->update(
                        [
                            'tarif' => $tarif,
                            'bruto' => $bruto,
                            'pph' => $pph,
                            'netto' => $netto
                        ]
                    );
            }


            $transMessage = "Data Berhasil Dikembalikan!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Data Gagal Dikembalikan";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                // "data" => $dataaa,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataLog,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }



    public function kembalikanHargaKomponenPertanggal(Request $request)
    {
        $dataLog = $request->all();
        DB::beginTransaction();
        $transStatus = 'true';
        $nilaiCito = 0;
        $totalJasa = 0;
        $tarif = (float)$request['tarifrs'];
        $bruto = (float)$request['bruto'];
        // $jumlah=(float)$request['jumlah'];
        $norecpp = $request['norecpp'];
        $norec = $request['norec'];
        $tgl = $request['tgl'];
        $produkfk = $request['produkfk'];
        $komponen = $request['komponen'];
        try {


            $data = DB::select(
                DB::raw(
                    "SELECT   v_jasapelayanan.norec , jasapelayanan_t.tarif , jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) AS bruto, CASE WHEN jasapelayanan_t.objectpajakfk = 1 THEN ((jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end))) 
                            * 0.15 WHEN jasapelayanan_t.objectpajakfk = 2 THEN ((jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end)) ) * 0.05 WHEN jasapelayanan_t.objectpajakfk = 3 THEN ((jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end)) 
                            ) * 0.025 END AS ppn, CASE WHEN jasapelayanan_t.objectpajakfk = 1 THEN ((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) ) - (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) 
                            ) * 0.15) WHEN jasapelayanan_t.objectpajakfk = 2 THEN (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) )) - (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) 
                            ) * 0.05) WHEN jasapelayanan_t.objectpajakfk = 3 THEN (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end))) - (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) 
                            ) * 0.025) END AS netto
                        FROM            v_jasapelayanan INNER JOIN
                                pasiendaftar_t ON v_jasapelayanan.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN
                                pelayananpasiendetail_t ON v_jasapelayanan.norecppd = pelayananpasiendetail_t.norec INNER JOIN
                                pelayananpasien_t ON pelayananpasiendetail_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN
                                jasapelayanan_t ON v_jasapelayanan.norec = jasapelayanan_t.norec
                        WHERE    (v_jasapelayanan.reportdisplay LIKE '%bpjs%') AND (pasiendaftar_t.persenJasaLast IS NOT NULL) 
                        and (v_jasapelayanan.tglverif = '$tgl')  and v_jasapelayanan.produkfk =$produkfk  AND (v_jasapelayanan.reportdisplay LIKE '%bpjs%') AND (pasiendaftar_t.persenJasaLast IS NOT NULL) AND (v_jasapelayanan.jeniskomponen =  $komponen)"
                )
            );

            foreach ($data as $itm) {


                $tarif = $itm->tarif;
                $bruto =   $itm->bruto;
                $pph = $itm->ppn;
                $netto = $itm->netto;
                $data = JasaPelayananDokter::where('norec', $itm->norec)
                    ->update(
                        [
                            'tarif' => $tarif,
                            'bruto' => $bruto,
                            'pph' => $pph,
                            'netto' => $netto
                        ]
                    );
            }


            $transMessage = "Data Berhasil Dikembalikan!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Data Gagal Dikembalikan";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                // "data" => $dataaa,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataLog,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function kembalikanHargaKomponenPertanggalget(Request $request)
    {
        $dataLog = $request->all();
        DB::beginTransaction();
        $transStatus = 'true';
        $nilaiCito = 0;
        $totalJasa = 0;
        $tarif = (float)$request['tarifrs'];
        $bruto = (float)$request['bruto'];
        // $jumlah=(float)$request['jumlah'];
        $norecpp = $request['norecpp'];
        $norec = $request['norec'];
        $tgl = $request['tgl'];
        $produkfk = $request['produkfk'];
        try {


            $data = DB::select(
                DB::raw(
                    "SELECT   v_jasapelayanan.norec , jasapelayanan_t.tarif , jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) AS bruto, CASE WHEN jasapelayanan_t.objectpajakfk = 1 THEN ((jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end))) 
                            * 0.15 WHEN jasapelayanan_t.objectpajakfk = 2 THEN ((jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end)) ) * 0.05 WHEN jasapelayanan_t.objectpajakfk = 3 THEN ((jasapelayanan_t.tarif * (case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end)) 
                            ) * 0.025 END AS ppn, CASE WHEN jasapelayanan_t.objectpajakfk = 1 THEN ((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) ) - (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) 
                            ) * 0.15) WHEN jasapelayanan_t.objectpajakfk = 2 THEN (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) )) - (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) 
                            ) * 0.05) WHEN jasapelayanan_t.objectpajakfk = 3 THEN (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end))) - (((jasapelayanan_t.tarif * case when v_jasapelayanan.kelasfk in (4,5,8,6) then 0.9 else 0.8 end) 
                            ) * 0.025) END AS netto
                        FROM            v_jasapelayanan INNER JOIN
                                pasiendaftar_t ON v_jasapelayanan.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN
                                pelayananpasiendetail_t ON v_jasapelayanan.norecppd = pelayananpasiendetail_t.norec INNER JOIN
                                pelayananpasien_t ON pelayananpasiendetail_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN
                                jasapelayanan_t ON v_jasapelayanan.norec = jasapelayanan_t.norec
                        WHERE    (v_jasapelayanan.reportdisplay LIKE '%bpjs%') AND (pasiendaftar_t.persenJasaLast IS NOT NULL) 
                        and (v_jasapelayanan.tglverif = '$tgl')  and v_jasapelayanan.produkfk =$produkfk  AND (v_jasapelayanan.reportdisplay LIKE '%bpjs%') AND (pasiendaftar_t.persenJasaLast IS NOT NULL)"
                )
            );

            // foreach ($data as $itm) {


            //     $tarif = $itm->tarif;
            //     $bruto =   $itm->bruto;
            //     $pph = $itm->ppn;
            //     $netto = $itm->netto;
            //     $data = JasaPelayananDokter::where('norec', $itm->norec)
            //         ->update(
            //             [
            //                 'tarif' => $tarif,
            //                 'bruto' => $bruto,
            //                 'pph' => $pph,
            //                 'netto' => $netto
            //             ]
            //         );
            // }


            $transMessage = "Data Berhasil Dikembalikan!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Data Gagal Dikembalikan";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $data,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataLog,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function loadHargaKomponen(Request $request)
    {

        $data = DB::select(
            DB::raw("select id,komponenharga from komponenharga_m where statusenabled=1")
        );



        $result =  array(
            'data' => $data,
        );

        return $this->respond($result);
    }
    public function GetDetailRemunPegawai(Request $request)
    {
        //TODO : daftar jenis remun
        //        $tgl = $request['tglAwal'];
        //       $data = \DB::table('strukclosing_t as sp')
        //           ->join ('detailpegawaipagu_t as dpp','dpp.strukclosingfk','=','sp.norec')
        //           ->leftJoin ('strukdetailpagu_t as sdp','sdp.norec','=','dpp.norec_sdp')
        //           ->leftJoin ('pelayananpasien_t as pp','pp.norec','=','sdp.pelayananpasienfk')
        //           ->leftJoin ('antrianpasiendiperiksa_t as apd','apd.norec','=','pp.noregistrasifk')
        //           ->leftJoin ('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
        //           ->leftJoin ('produk_m as pro','pro.id','=','sdp.produkfk')
        //           ->leftJoin ('pasien_m as pm','pm.id','=','pd.nocmfk')
        //           ->leftJoin ('pegawai_m as pg','pg.id','=','sdp.dokterid')
        //           ->leftJoin ('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
        //           ->leftJoin ('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
        //           ->leftJoin ('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
        //           ->leftJoin ('detailjenispagu_t as djp','djp.id','=','dpp.djpid')
        //           ->select(DB::raw("case when pp.tglpelayanan is null then sp.tglclosing else pp.tglpelayanan end as tglpelayanan,
        //                           case when pm.nocm is null then '-' else pm.nocm end as nocm,
        //                           case when pd.noregistrasi is null then '-' else pd.noregistrasi end as noregistrasi,
        //                           case when pm.namapasien is null then '-' else pm.namapasien end as namapasien,
        //                           sdp.produkfk,pp.jumlah,
        //                           case when pro.namaproduk is null then dpp.jenis else pro.namaproduk end as namaproduk,
        //                           case when pp.hargasatuan is null then 0 else pp.hargasatuan * pp.jumlah end as hargasatuan,
        //                            apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk,dept.namadepartemen,
        //                            dpp.jenispaginilaitotal as jenispagunilai,sdp.dokterid,pg.namalengkap as dokter,
        //                            br.pasiendaftarfk as norec_batal,pp.isparamedis,pp.iscito,dpp.jpid,pp.norec as norec_pp,
        //                            dpp.djpid,djp.detailjenispagu"));
        //
        //       if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //           $data = $data->where('sp.tglclosing', '>=', $request['tglAwal']);
        //       }
        //       if (isset($request['tglAkhir']) && $request['tglAkhir']  != "" && $request['tglAkhir'] != "undefined") {
        //           $tgl = $request['tglAkhir'];//." 23:59:59";
        //           $data = $data->where('sp.tglclosing', '<=', $tgl);
        //       }
        //       if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
        //           $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        //       }
        //       if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
        //           $data = $data->where('apd.objectruanganfk', '=', $request['idRuangan']);
        //       }
        //       if (isset($request['noclosing']) && $request['noclosing'] != "" && $request['noclosing'] != "undefined") {
        //           $data = $data->where('sp.noclosing', '=', $request['noclosing']);
        //       }
        //       if (isset($request['IdDokter']) && $request['IdDokter'] != "" && $request['IdDokter'] != "undefined") {
        //           $data = $data->where('dpp.pegawaiid', '=', $request['IdDokter']);
        //       }
        //          $data = $data->get();
        $noclosing = $request['noclosing'];
        $dokterid = $request['IdDokter'];
        $ruanganfk = DB::select(DB::raw("select djp.ruanganfk from mapjenispagutopegawai_t as mp
                     INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                     where mp.pegawaifk=$dokterid and mp.jenispagufk=8;"));
        $RC = "";
        $RCEEG = "";
        for ($i = 0; $i < count($ruanganfk); $i++) {
            $ruu = $ruanganfk[$i]->ruanganfk;
            $RC = $RC . " union all select  pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,pr.namaproduk,
                 pp.jumlah,pp.isparamedis,pp.iscito,pp.hargasatuan,sdp.jenispagunilai,pp.norec as norec_pp,sdp.jenispagufk as jpid,
                 ru.namaruangan
                 from strukclosing_t as sc
                 INNER JOIN strukdetailpagu_t as sdp on sdp.tglpelayanan BETWEEN sc.tglawal and sc.tglakhir
                 INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk 
                 INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                 INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                 INNER JOIN produk_m as pr on pr.id=sdp.produkfk
                 INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                 INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                  
                 where sc.noclosing='$noclosing' and sdp.ruanganfk=$ruu and sdp.jenispagufk=8 ";
            $RCEEG = $RCEEG . " union all select pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,pr.namaproduk,
                 pp.jumlah,pp.isparamedis,pp.iscito,pp.hargasatuan,sdp.jenispagunilai,pp.norec as norec_pp,sdp.jenispagufk as jpid,
                 ru.namaruangan
                 from strukclosing_t as sc
                 INNER JOIN detailpegawaipagu_t as ddp on ddp.strukclosingfk=sc.norec
                 INNER JOIN strukdetailpagu_t as sdp on sdp.norec=ddp.norec_sdp
                 INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk 
                 INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                 INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                 INNER JOIN produk_m as pr on pr.id=sdp.produkfk
                 INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                 INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                 where sc.noclosing='$noclosing' and ddp.namaexternal='eeg' and pegawaiid=$dokterid ";
        }

        $REMUN = "select  sc.tglclosing as tglpelayanan,'-' as nocm,'-' as noregistrasi,'-' as namapasien,dpp.jenis as  namaproduk,
                 0 as jumlah,0 as isparamedis,0 as iscito,0 as hargasatuan,dpp.jenispaginilaitotal as jenispagunilai,'' as norec_pp,dpp.jpid as jpid,
                 '' as namaruangan,djp.detailjenispagu
                 from strukclosing_t as sc
                 INNER JOIN detailpegawaipagu_t as dpp on dpp.strukclosingfk=sc.norec
                 INNER JOIN detailjenispagu_t as djp on djp.id=dpp.djpid
                 where sc.noclosing='$noclosing' and dpp.pegawaiid = $dokterid and dpp.jpid in (13 ,14, 15,  17, 18,19,20) and dpp.statusenabled = 1";

        //         $RCDOKTER = "select  pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,pr.namaproduk,
        //                 pp.jumlah,pp.isparamedis,pp.iscito,pp.hargasatuan,sdp.jenispagunilai,pp.norec as norec_pp,sdp.jenispagufk as jpid,
        //                 ru.namaruangan
        //                 from strukclosing_t as sc
        //                 INNER JOIN strukdetailpagu_t as sdp on sdp.tglpelayanan BETWEEN sc.tglawal and sc.tglakhir
        //                 INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
        //                 INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                 INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        //                 INNER JOIN produk_m as pr on pr.id=sdp.produkfk
        //                 INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
        //                 INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        //                 where sc.noclosing='$noclosing' and sdp.dokterid= $dokterid and sdp.jenispagufk=16";
        if ($request['jenis'] == 'KELOMPOK PENGHASIL') {
            $JPLINDIVIDU = "select   pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,pr.namaproduk,
                pp.jumlah,pp.isparamedis,pp.iscito,pp.hargasatuan,
                dpp.jenispaginilaitotal as jenispaginilai,pp.norec as norec_pp,sdp.jenispagufk as jpid,
                ru.namaruangan,djp.detailjenispagu
                from strukclosing_t as sc
                INNER JOIN detailpegawaipagu_t AS dpp ON dpp.strukclosingfk = sc.norec
                INNER JOIN strukdetailpagu_t AS sdp ON sdp.norec = dpp.norec_sdp
                INNER JOIN detailjenispagu_t as djp on djp.id=dpp.djpid
               -- INNER JOIN detailpegawaipagu_t as dpp on dpp.strukclosingfk=sc.norec 
                --INNER JOIN strukdetailpagu_t as sdp on sdp.tglpelayanan BETWEEN sc.tglawal and sc.tglakhir and sdp.norec=dpp.norec_sdp
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk 
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN produk_m as pr on pr.id=sdp.produkfk
                INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
           
                where sc.noclosing='$noclosing'  and sdp.jenispagufk=16
                --and sdp.dokterid= $dokterid
                and dpp.djpid=142 and dpp.ruanganfk =$dokterid
                and dpp.statusenabled = 1
                ";
        } else {
            $JPLINDIVIDU = "select   pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,pr.namaproduk,
                pp.jumlah,pp.isparamedis,pp.iscito,pp.hargasatuan,
                dpp.jenispaginilaitotal as jenispaginilai,pp.norec as norec_pp,sdp.jenispagufk as jpid,
                ru.namaruangan,djp.detailjenispagu
                from strukclosing_t as sc
                INNER JOIN detailpegawaipagu_t AS dpp ON dpp.strukclosingfk = sc.norec
                INNER JOIN strukdetailpagu_t AS sdp ON sdp.norec = dpp.norec_sdp
                INNER JOIN detailjenispagu_t as djp on djp.id=dpp.djpid
               -- INNER JOIN detailpegawaipagu_t as dpp on dpp.strukclosingfk=sc.norec 
                --INNER JOIN strukdetailpagu_t as sdp on sdp.tglpelayanan BETWEEN sc.tglawal and sc.tglakhir and sdp.norec=dpp.norec_sdp
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk 
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN produk_m as pr on pr.id=sdp.produkfk
                INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
           
                where sc.noclosing='$noclosing' and sdp.dokterid= $dokterid and sdp.jenispagufk=16
                and dpp.djpid in (141,143) and dpp.pegawaiid =$dokterid
                --and dpp.djpid not in (142) and dpp.pegawaiid =$dokterid
                and dpp.statusenabled = 1
                ";
        }



        $data = DB::select(DB::raw(
            $REMUN . "  " . $RC  . " union all " . $JPLINDIVIDU  . " " . $RCEEG
        ));

        //        $data = $data->whereNull('br.pasiendaftarfk');
        //        $data = $data->where('sp.statusenabled','=',1);
        ////        $data = $data->where('pd.noregistrasi','=','1905009532');//
        //        $data = $data->orderBy('pp.tglpelayanan','Asc');
        //        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ea@epc',
        );
        return $this->respond($result);
    }
    public function getDaftarPerhitunganIndexPegawai(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $namapeg = '';
        $limit = '';
        if ($request['namalengkap'] != '') {
            $namapeg = " and pg.namalengkap like '%" . $request['namalengkap'] . "%' ";
        }
        if ($request['jmlRows'] != '') {
            $limit = " top " . $request['jmlRows'];
        }

        $data = DB::select(DB::raw(
            "
				--select $limit * from remundetailpegawai_t where statusenabled=1 $namapeg order by unitbagianinstalasi,no 
				
				select $limit pg.namalengkap, pg.id as idpegawai ,
                isnull((pdd.point),0) + isnull((gol.point),0) + isnull((jb.point),0)
                + isnull((ru.point),0) + isnull((pet.point),0) +  (case when pg.tglmasuk is not null then (case 
                when  (DATEDIFF(month, pg.tglmasuk, GETDATE())) < 12 then 1 
                else  (DATEDIFF(year, pg.tglmasuk, GETDATE())) 
                end) else 0 end) as totalindex,pg.poinjpt as poinjpu,pg.tglmasuk,
                pdd.pendidikan,gol.name as golongan,jb.namajabatan,ru.namaruangan,un.name as unitkerja,
                pet.petugasdiklat,pdd.point as poinpdd, gol.point as poingol, jb.point as poinjb, 
                ru.point as poinru, pet.point as poindiklat, (case when pg.tglmasuk is not null then (case 
                when  (DATEDIFF(month, pg.tglmasuk, GETDATE())) < 12 then 1 
                else  (DATEDIFF(year, pg.tglmasuk, GETDATE())) 
                end) else 0 end) as poinmasakerja
                from  pegawai_m as pg 
                left JOIN pendidikan_m as pdd on pdd.id=pg.objectpendidikanterakhirfk
                left JOIN sdm_golongan_m as gol on gol.id=pg.objectgolonganfk
                left JOIN jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
                left JOIN ruangan_m as ru on ru.id=pg.objectruangankerjafk
                left JOIN unitkerjapegawai_m as un on un.id=pg.objectunitkerjapegawaifk
                left JOIN petugasdiklat_m as pet on pet.id=pg.objectpetugasdiklatfk
                where   pg.statusenabled=1
                $namapeg
                order by pg.namalengkap
			"
        ));
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getDataComboLaporanRemun(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawaiLogin = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', [3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35])
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
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


        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'user' => $dataPegawaiLogin,
            'message' => 'as@',
        );

        return $this->respond($result);
    }
    public function getDataDetailLaporanRemunerasi(Request $request)
    {
        $data = [];
        $data2 = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $isEksekutif = $request['isExsekutif'];

        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramEksekutif = ' ';
        if (isset($isEksekutif) && $isEksekutif != "" && $isEksekutif != "undefined") {
            if ($isEksekutif == "true") {
                $paramEksekutif = ' and ru.iseksekutif = 1';
            } else if ($isEksekutif == "false") {
                $paramEksekutif = ' and ru.iseksekutif = 0';
            }
        }

        //        $data = DB::select(DB::raw("select x.namaruangan, sum(x.JasaDr) as JasaDr,sum(x.Paramedis) as Paramedis,sum(x.PostRemun) as PostRemun,
        //                            sum(x.Direksi) as Direksi,sum(x.StaffDireksi) as StaffDireksi,sum(x.Manajemen) as Manajemen from
        //                            (select ru.namaruangan,jp.id as jpid,jp.jenispagu,
        //                            case when jp.id = 7 then sum(sdp.jenispagunilai) else 0 end as 'JasaDr',
        //                            case when jp.id = 8 then sum(sdp.jenispagunilai) else 0 end as 'Paramedis',
        //                            case when jp.id = 9 then sum(sdp.jenispagunilai) else 0 end as 'PostRemun',
        //                            case when jp.id = 10 then sum(sdp.jenispagunilai) else 0 end as 'Direksi',
        //                            case when jp.id = 11 then sum(sdp.jenispagunilai) else 0 end as 'StaffDireksi',
        //                            case when jp.id = 12 then sum(sdp.jenispagunilai) else 0 end as 'Manajemen'
        //                            from strukdetailpagu_t as sdp
        //                            INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk
        //                            INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispagufk
        //                            where tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
        //                            $paramDep
        //                            $paramRuangan
        //                            $paramEksekutif
        //                            group by ru.namaruangan,jp.jenispagu,jp.id)as x
        //                            group by x.namaruangan;"));

        $data = DB::select(DB::raw("select x.namaruangan, sum(x.direksi) as direksi,sum(x.struktural) as struktural,sum(x.administrasi) as administrasi,
                        sum(x.jpl) as jpl,sum(x.jptl) as jptl,sum(x.gabungan) as gabungan from
                        (select ru.namaruangan,
                        case when sdp.jenispagufk = 13 then sum(sdp.jenispagunilai) else 0 end as direksi,
                        case when sdp.jenispagufk = 14 then sum(sdp.jenispagunilai) else 0 end as struktural,
                        case when sdp.jenispagufk = 15 then sum(sdp.jenispagunilai) else 0 end as administrasi,
                        case when sdp.jenispagufk = 16 then sum(sdp.jenispagunilai) else 0 end as jpl,
                        case when sdp.jenispagufk = 17 then sum(sdp.jenispagunilai) else 0 end as jptl,
                        case when sdp.jenispagufk = 18 then sum(sdp.jenispagunilai) else 0 end as gabungan
                            from strukdetailpagu_t as sdp
                            INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk
                            inner join strukpagu_t as sp on sp.norec =sdp.strukpagufk
                            --  INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispagufk 
                            where sp.periodeawal BETWEEN '$tglAwal' and '$tglAkhir'
                            and sdp.tglpelayanan  > '2019-05-31 23:59'
                            $paramDep
                            $paramRuangan
                            $paramEksekutif
                            group by ru.namaruangan,sdp.jenispagufk )as x
                            group by x.namaruangan"));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataRekapLaporanRemunerasi(Request $request)
    {
        $data = [];
        $data2 = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $dokterId = $request['IdDokter'];
        $isEksekutif = $request['isExsekutif'];

        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramDokter = ' ';
        if (isset($dokterId) && $dokterId != "" && $dokterId != "undefined") {
            $paramDokter = ' and pg.id = ' . $dokterId;
        }

        $paramEksekutif = ' ';
        if (isset($isEksekutif) && $isEksekutif != "" && $isEksekutif != "undefined") {
            if ($isEksekutif == "true") {
                $paramEksekutif = ' and ru.iseksekutif = 1';
            } else if ($isEksekutif == "false") {
                $paramEksekutif = ' and ru.iseksekutif = 0';
            }
        }

        //        $data = DB::select(DB::raw("select x.namalengkap, sum(x.JasaDr) as JasaDr,sum(x.Paramedis) as Paramedis,sum(x.PostRemun) as PostRemun,
        //                            sum(x.Direksi) as Direksi,sum(x.StaffDireksi) as StaffDireksi,sum(x.Manajemen) as Manajemen from
        //                            (select pg.namalengkap,jp.id as jpid,jp.jenispagu,
        //                            case when jp.id = 7 then sum(sdp.jenispagunilai) else 0 end as 'JasaDr',
        //                            case when jp.id = 8 then sum(sdp.jenispagunilai) else 0 end as 'Paramedis',
        //                            case when jp.id = 9 then sum(sdp.jenispagunilai) else 0 end as 'PostRemun',
        //                            case when jp.id = 10 then sum(sdp.jenispagunilai) else 0 end as 'Direksi',
        //                            case when jp.id = 11 then sum(sdp.jenispagunilai) else 0 end as 'StaffDireksi',
        //                            case when jp.id = 12 then sum(sdp.jenispagunilai) else 0 end as 'Manajemen'
        //                            from strukdetailpagu_t as sdp
        //                            INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk
        //                            INNER JOIN jenispagu_t as jp on jp.id=sdp.jenispagufk
        //                            INNER JOIN pegawai_m as pg on pg.id=sdp.dokterid
        //                            where tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
        //                            $paramDokter
        //                            $paramEksekutif
        //                            group by pg.namalengkap,jp.jenispagu,jp.id)as x
        //                            group by x.namalengkap;"));


        $data = DB::select(DB::raw("select x.namalengkap, sum(x.direksi) as direksi,sum(x.struktural) as struktural,sum(x.administrasi) as administrasi,
                        sum(x.jpl) as jpl,sum(x.jptl) as jptl,sum(x.gabungan) as gabungan from
                        (select pg.namalengkap,
                        case when sdp.jenispagufk = 13 then sum(sdp.jenispagunilai) else 0 end as direksi,
                        case when sdp.jenispagufk = 14 then sum(sdp.jenispagunilai) else 0 end as struktural,
                        case when sdp.jenispagufk = 15 then sum(sdp.jenispagunilai) else 0 end as administrasi,
                        case when sdp.jenispagufk = 16 then sum(sdp.jenispagunilai) else 0 end as jpl,
                        case when sdp.jenispagufk = 17 then sum(sdp.jenispagunilai) else 0 end as jptl,
                        case when sdp.jenispagufk = 18 then sum(sdp.jenispagunilai) else 0 end as gabungan
                        from strukdetailpagu_t as sdp
                        INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk
                        inner join strukpagu_t as sp on sp.norec =sdp.strukpagufk
                        INNER JOIN pegawai_m as pg on pg.id=sdp.dokterid 
                        where sp.periodeawal BETWEEN '$tglAwal' and '$tglAkhir'
                         and sdp.tglpelayanan  > '2019-05-31 23:59'
                        $paramDokter
                        $paramEksekutif
                        group by pg.namalengkap,sdp.jenispagufk)as x
                        group by x.namalengkap;"));
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataDetailLaporanRemunerasiDokter(Request $request)
    {
        $data = [];
        $data2 = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $dokterid = $request['dokterid'];
        $isEksekutif = $request['isExsekutif'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];

        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramDokter = ' ';
        if (isset($dokterid) && $dokterid != "" && $dokterid != "undefined") {
            $paramDokter = ' and sdp.dokterid = ' . $dokterid;
        }

        $paramEksekutif = ' ';
        if (isset($isEksekutif) && $isEksekutif != "" && $isEksekutif != "undefined") {
            if ($isEksekutif == "true") {
                $paramEksekutif = ' and ru.iseksekutif = 1';
            } else if ($isEksekutif == "false") {
                $paramEksekutif = ' and ru.iseksekutif = 0';
            }
        }

        $data = DB::select(DB::raw("select 
                     x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan,
                     x.namaproduk,x.isparamedis,x.iscito,x.hargasatuan,
                     --sum
                     (x.jumlah) as qty,sum(x.jenispagunilai) as total
                from
                (select pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,ru.namaruangan,
                        pr.namaproduk,pp.jumlah,pp.isparamedis,pp.iscito,pp.hargasatuan,
                        sdp.jenispagunilai
                from strukdetailpagu_t as sdp 
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN produk_m as pr on sdp.produkfk=pr.id
                INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk
              -- where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                 where pd.tglpulang between '$tglAwal' and '$tglAkhir'
                   and pp.tglpelayanan  > '2019-05-31 23:59'
                $paramDep 
                $paramRuangan
                $paramDokter
                $paramEksekutif) as x
                group by  x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan,
 				          x.namaproduk,x.isparamedis,x.iscito,x.hargasatuan,
 				          x.jumlah
                "));
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDataDetailLaporanRemunerasiParamedis(Request $request)
    {
        $data = [];
        $data2 = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $dokterid = $request['dokterid'];
        $isEksekutif = $request['isExsekutif'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];

        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramDokter = ' ';
        if (isset($dokterid) && $dokterid != "" && $dokterid != "undefined") {
            $paramDokter = ' and sdp.dokterid = ' . $dokterid;
        }

        $paramEksekutif = ' ';
        if (isset($isEksekutif) && $isEksekutif != "" && $isEksekutif != "undefined") {
            if ($isEksekutif == "true") {
                $paramEksekutif = ' and ru.iseksekutif = 1';
            } else if ($isEksekutif == "false") {
                $paramEksekutif = ' and ru.iseksekutif = 0';
            }
        }

        $data = DB::select(DB::raw("select 
                     x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan,
                     x.namaproduk,x.isparamedis,x.iscito,x.hargasatuan,
                     sum(x.jumlah) as qty,sum(x.jenispagunilai) as total
                from
                (select pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,ru.namaruangan,
                        pr.namaproduk,pp.jumlah,pp.isparamedis,pp.iscito,pp.hargasatuan,
                        sdp.jenispagunilai
                from strukdetailpagu_t as sdp 
                INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN produk_m as pr on sdp.produkfk=pr.id
                INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk
                --where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' 
                  where pd.tglpulang between '$tglAwal' and '$tglAkhir' 
                       and pp.tglpelayanan  > '2019-05-31 23:59'
                and sdp.jenispagufk = 8
                $paramDep 
                $paramRuangan
                $paramDokter
                $paramEksekutif) as x
                group by  x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan,
 				          x.namaproduk,x.isparamedis,x.iscito,x.hargasatuan
                "));
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function saveRemunerasiJP1_rev3_2020(Request $request)
    {
        //TODO : CARI PAGU
        //        ini_set('memory_limit', '256M');
        //        ini_set('max_execution_time', 500); //6 minutes


        $dataReq = $request->all();
        $tglAwal = $dataReq['head']['periodeawal'];
        $tglAkhir = $dataReq['head']['periodeakhir'];

        //        $kdJenisPetugas = $dataReq['head']['kdjenispetugas'];
        //        $kdKomponen = $dataReq['head']['kdkomponen'];
        $nama = ''; //$dataReq['nama'];
        $produk = ''; //$dataReq['produk'];
        $dtdtdt2 = [];
        $dataPersen3 = [];

        $SCSC = StrukPagu::where('periodeawal', $request['tglAwal'])->get();
        $StrukPagu = false;
        if (count($SCSC) > 0) {
            $StrukPagu = true;
        }
        $dataDokterAnak = [];
        //        $dataDokterAnak = DB::select(DB::raw(
        //            "
        //				select pp.tglpelayanan,ppp.objectpegawaifk as dokterpjid ,
        //                pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,pp.isparamedis,pgpj.namalengkap as dokterpj
        //                from  pelayananpasien_t as pp
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                where pd.tglpulang between '$tglAwal' and '$tglAkhir'  and pgpj.namalengkap like '%$nama%'
        //                and ppp.objectjenispetugaspefk=15 and pp.isparamedis is null
        //
        //			"
        //        ));
        $dataDokterAnestesi = [];
        //        $dataDokterAnestesi = DB::select(DB::raw(
        //            "
        //				select pp.tglpelayanan,ppp.objectpegawaifk as dokterpjid ,
        //                pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ppp.objectpegawaifk,pp.isparamedis,pgpj.namalengkap as dokterpj
        //                from  pelayananpasien_t as pp
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                where pd.tglpulang between '$tglAwal' and '$tglAkhir'  and pgpj.namalengkap like '%$nama%'
        //                and ppp.objectjenispetugaspefk=6 and pp.isparamedis is null
        //
        //
        //			"
        //        ));
        //        $data2 = DB::select(DB::raw(
        //            "
        //
        //				select  x.*,
        //                (x.jaspel*7.5)/100 as direksi,
        //                (x.jaspel*5)/100 as struktural,
        //                (x.jaspel*1)/100 as administrasi,
        //                case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*30)/100
        //                        when x.objectruanganfk in (575) then  (x.jaspel*35)/100
        //                        when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*28)/100
        //                        when x.objectruanganfk in (571,579) then  (x.jaspel*40)/100
        //                else (x.jaspel*45)/100 end as jpl,
        //                (x.jaspel*8.5)/100 as jptl,
        //                case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*48)/100
        //                        when x.objectruanganfk in (575) then  (x.jaspel*43)/100
        //                        when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*50)/100
        //                        when x.objectruanganfk in (571,579) then  (x.jaspel*38)/100
        //                else (x.jaspel*33)/100  end as gabungan
        //                from
        //                (select pp.tglpelayanan,pr.namaproduk,
        //                sum((((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) ) as jaspel,
        //                pgpj.namalengkap as dokter ,pgpj.id as dokterid ,
        //                apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis
        //                from pelayananpasiendetail_t as ppd
        //                inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
        //                inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
        //                left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        //                left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
        //                left join produk_m as pr on pr.id =ppd.produkfk
        //                left join ruangan_m as ru on ru.id=apd.objectruanganfk
        //                where pd.tglpulang between '$tglAwal' and '$tglAkhir'
        //                --and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (86,87,90,25,88,35,93)
        //                and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (94)
        //                and ppd.hargajual >0
        //                group by pp.tglpelayanan,pr.namaproduk,
        //                pgpj.namalengkap ,pgpj.id  ,
        //                apd.norec ,pp.jumlah,pp.norec ,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis) AS x
        //
        //
        //			"
        //        ));
        $data2 = DB::select(DB::raw(
            "  
  
				select  x.*,
                    (x.jaspel*7.5)/100 as direksi,
                    (x.jaspel*5)/100 as struktural,
                    (x.jaspel*1)/100 as administrasi,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*30)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*35)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*28)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*40)/100
                    else (x.jaspel*45)/100 end as jpl,
                    (x.jaspel*8.5)/100 as jptl,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*48)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*43)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*50)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*38)/100
                    else (x.jaspel*33)/100  end as gabungan
                    from 
                    (select pp.tglpelayanan,pr.namaproduk,                
                    sum((((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) ) as jaspel,
                    pgpj.namalengkap as dokter ,pgpj.id as dokterid ,
                    apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,ru.namaruangan
                    from pelayananpasiendetail_t as ppd
                    inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
                    inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
                    left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                    inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                    left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
                    left join produk_m as pr on pr.id =ppd.produkfk
                    left join ruangan_m as ru on ru.id=apd.objectruanganfk
                    inner join strukpelayanan_t as sp on sp.norec=pp.strukfk
                    inner join strukbuktipenerimaan_t as sbm  on sp.norec = sbm.nostrukfk 
                    where pd.tglpulang between '$tglAwal' and '$tglAkhir'
                    and pgpj.namalengkap like '%$nama%'
                    and pr.namaproduk like '%$produk%'
                    and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (94)
                    and sbm.statusenabled =1
                    and pd.objectkelompokpasienlastfk not in (2,4,10)
                    and ppd.hargajual >0
                    group by pp.tglpelayanan,pr.namaproduk,ru.namaruangan,
                    pgpj.namalengkap ,pgpj.id  ,
                    apd.norec ,pp.jumlah,pp.norec ,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis) as x

                union all 
                
             select  x.*,
                    (x.jaspel*7.5)/100 as direksi,
                    (x.jaspel*5)/100 as struktural,
                    (x.jaspel*1)/100 as administrasi,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*30)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*35)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*28)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*40)/100
                    else (x.jaspel*45)/100 end as jpl,
                    (x.jaspel*8.5)/100 as jptl,
                    case when x.objectruanganfk in (535,577,580,576) then  (x.jaspel*48)/100
                            when x.objectruanganfk in (575) then  (x.jaspel*43)/100
                            when x.objectruanganfk in (125,94,116,59) then  (x.jaspel*50)/100
                            when x.objectruanganfk in (571,579) then  (x.jaspel*38)/100
                    else (x.jaspel*33)/100  end as gabungan
                    from 
                    (select pp.tglpelayanan,pr.namaproduk,                
                    sum((((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end)+(case when ppd.jasa is null then 0 else ppd.jasa end))*pp.jumlah)) ) as jaspel,
                    pgpj.namalengkap as dokter ,pgpj.id as dokterid ,
                    apd.norec as norec_apd,pp.jumlah,pp.norec  as norec_pp,pp.produkfk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis,ru.namaruangan
                    from pelayananpasiendetail_t as ppd
                    inner join pelayananpasien_t as pp on pp.norec=ppd.pelayananpasien
                    inner join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=ppd.pelayananpasien
                    left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                    inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                    left join pegawai_m as pgpj on pgpj.id=ppp.objectpegawaifk
                    left join produk_m as pr on pr.id =ppd.produkfk
                    left join ruangan_m as ru on ru.id=apd.objectruanganfk
                     inner join strukpelayanan_t as sp on sp.norec=pp.strukfk
                    inner join strukbuktipenerimaan_t as sbm  on sp.norec = sbm.nostrukfk
                    where pd.tglpulang between '$tglAwal' and '$tglAkhir'
                    and pgpj.namalengkap like '%$nama%'
                    and pr.namaproduk like '%$produk%'
                    and  ppp.objectjenispetugaspefk=4 and ppd.komponenhargafk in (94)
                     and sbm.statusenabled =1
                     and pd.objectkelompokpasienlastfk in (2,4,10)
                     and ppd.hargajual >0
                    group by pp.tglpelayanan,pr.namaproduk,ru.namaruangan,
                    pgpj.namalengkap ,pgpj.id  ,
                    apd.norec ,pp.jumlah,pp.norec ,pp.produkfk,ppp.objectpegawaifk,ru.objectdepartemenfk,apd.objectruanganfk,pp.isparamedis) as x

			"
        ));
        $newData2 = [];
        $sama = false;
        $iddokter = '';
        $nmdokter = '';
        foreach ($data2 as $dt) {
            $newData2[] = array(
                'tglpelayanan' => $dt->tglpelayanan,
                'namaproduk' => $dt->namaproduk,

                'direksi' => (float)$dt->direksi,
                'struktural' => $dt->struktural,
                'administrasi' => $dt->administrasi,
                'jpl' => $dt->jpl,
                'jptl' => $dt->jptl,
                'gabungan' => $dt->gabungan,

                'dokter' => $dt->dokter,
                'dokterid' => $dt->dokterid,
                'norec_apd' => $dt->norec_apd,
                'jumlah' => $dt->jumlah,
                'norec_pp' => $dt->norec_pp,
                'produkfk' => $dt->produkfk,
                'objectdepartemenfk' => $dt->objectdepartemenfk,
                'objectruanganfk' => $dt->objectruanganfk,
                'isparamedis' => $dt->isparamedis,
                'tipedokter' => 'Medis',
                //                'rcanak' => $dt->rcanak,
                //                'rcnicu' => $dt->rcnicu,
                //                'rcigd' => $dt->rcigd,
                //                'rcvk' => $dt->rcvk,
                //                'rcnifas' => $dt->rcnifas,
            );
        }
        //        if($dataReq['head']['norecsc'] == '-') {
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataReq['userData']['id'])
            ->first();
        //            if ($kdKomponen == 86) {
        $SCSC = StrukPagu::where('periodeawal', $dataReq['head']['periodeawal'])
            ->select('norec')
            ->get();


        if (count($SCSC) > 0) {
            $norecDel = [];
            foreach ($SCSC as $itemAkuh) {
                $norecDel[] = $itemAkuh->norec;
            }
            // return $this->respond($norecDel);
            $delSCSC = StrukPagu::whereIn('norec', $norecDel)
                ->delete();
            $delSCSC2 = StrukDetailPagu::whereIn('strukpagufk', $norecDel)
                ->delete();
        }
        //            }


        $nostrukpagu = $this->generateCode(new StrukPagu(), 'nostrukpagu', 10, 'PGU/' . $this->getDateTime()->format('ym'));

        $dataSC = new StrukPagu();
        $dataSC->norec = $dataSC->generateNewId();
        $dataSC->kdprofile = 0;
        $dataSC->statusenabled = true;
        $dataSC->nostrukpagu = $nostrukpagu;
        $dataSC->tglstrukpagu = date('Y-m-d H:i:s');
        $dataSC->periodeawal = $dataReq['head']['periodeawal'];
        $dataSC->periodeakhir = null;
        $dataSC->pegawaiuserid = $dataPegawai->objectpegawaifk;
        //            $dataSC->totaljasalayanan = $dataReq['head']['totaljasalayanan'];
        //            $dataSC->totaljasaremun = $dataReq['head']['totaljasaremun'];
        //            $dataSC->totaljasamanajemen = $dataReq['head']['totaljasamanajemen'];
        $dataSC->totalrcdokter = $dataReq['head']['rcdokter'];
        $dataSC->totalpostrm = $dataReq['head']['postremun'];
        $dataSC->totalrc = $dataReq['head']['rc'];
        $dataSC->totalccdireksi = $dataReq['head']['ccdireksi'];
        $dataSC->totalccstaffdireksi = $dataReq['head']['ccstaffdireksi'];
        $dataSC->totalccmanajemen = $dataReq['head']['ccmanajemen'];
        $dataSC->save();

        $norecSC = $dataSC->norec;
        //        }else{
        //            $norecSC = $dataReq['head']['norecsc'];
        //        }
        $dataInsert = [];
        foreach ($newData2 as $item) {
            if ((float)$item['direksi'] > 0) {
                $dataInsert[] = array(
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile' => 0,
                    'statusenabled' => true,
                    'strukpagufk' => $norecSC,
                    'pelayananpasienfk' => $item['norec_pp'],
                    'jenispagufk' => 13,
                    'jenispagupersen' => null,
                    'jenispagunilai' => $item['direksi'],
                    'produkfk' => $item['produkfk'],
                    'dokterid' => $item['dokterid'],
                    'tglpelayanan' => $item['tglpelayanan'],
                    'jumlah' => $item['jumlah'],
                    'ruanganfk' => $item['objectruanganfk'],
                    'namaexternal' => $item['tipedokter']
                );
            }
            if ((float)$item['struktural'] > 0) {
                $dataInsert[] = array(
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile' => 0,
                    'statusenabled' => true,
                    'strukpagufk' => $norecSC,
                    'pelayananpasienfk' => $item['norec_pp'],
                    'jenispagufk' => 14,
                    'jenispagupersen' => null,
                    'jenispagunilai' => $item['struktural'],
                    'produkfk' => $item['produkfk'],
                    'dokterid' => $item['dokterid'],
                    'tglpelayanan' => $item['tglpelayanan'],
                    'jumlah' => $item['jumlah'],
                    'ruanganfk' => $item['objectruanganfk'],
                    'namaexternal' => $item['tipedokter']
                );
            }
            if ((float)$item['administrasi'] > 0) {
                $dataInsert[] = array(
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile' => 0,
                    'statusenabled' => true,
                    'strukpagufk' => $norecSC,
                    'pelayananpasienfk' => $item['norec_pp'],
                    'jenispagufk' => 15,
                    'jenispagupersen' => null,
                    'jenispagunilai' => $item['administrasi'],
                    'produkfk' => $item['produkfk'],
                    'dokterid' => $item['dokterid'],
                    'tglpelayanan' => $item['tglpelayanan'],
                    'jumlah' => $item['jumlah'],
                    'ruanganfk' => $item['objectruanganfk'],
                    'namaexternal' => $item['tipedokter']
                );
            }
            if ((float)$item['jpl'] > 0) {
                $dataInsert[] = array(
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile' => 0,
                    'statusenabled' => true,
                    'strukpagufk' => $norecSC,
                    'pelayananpasienfk' => $item['norec_pp'],
                    'jenispagufk' => 16,
                    'jenispagupersen' => null,
                    'jenispagunilai' => $item['jpl'],
                    'produkfk' => $item['produkfk'],
                    'dokterid' => $item['dokterid'],
                    'tglpelayanan' => $item['tglpelayanan'],
                    'jumlah' => $item['jumlah'],
                    'ruanganfk' => $item['objectruanganfk'],
                    'namaexternal' => $item['tipedokter']
                );
            }
            if ((float)$item['jptl'] > 0) {
                $dataInsert[] = array(
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile' => 0,
                    'statusenabled' => true,
                    'strukpagufk' => $norecSC,
                    'pelayananpasienfk' => $item['norec_pp'],
                    'jenispagufk' => 17,
                    'jenispagupersen' => null,
                    'jenispagunilai' => $item['jptl'],
                    'produkfk' => $item['produkfk'],
                    'dokterid' => $item['dokterid'],
                    'tglpelayanan' => $item['tglpelayanan'],
                    'jumlah' => $item['jumlah'],
                    'ruanganfk' => $item['objectruanganfk'],
                    'namaexternal' => $item['tipedokter']
                );
            }
            if ((float)$item['gabungan'] > 0) {
                $dataInsert[] = array(
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile' => 0,
                    'statusenabled' => true,
                    'strukpagufk' => $norecSC,
                    'pelayananpasienfk' => $item['norec_pp'],
                    'jenispagufk' => 18,
                    'jenispagupersen' => null,
                    'jenispagunilai' => $item['gabungan'],
                    'produkfk' => $item['produkfk'],
                    'dokterid' => $item['dokterid'],
                    'tglpelayanan' => $item['tglpelayanan'],
                    'jumlah' => $item['jumlah'],
                    'ruanganfk' => $item['objectruanganfk'],
                    'namaexternal' => $item['tipedokter']
                );
            }
            //
            //            if ((float)$item['rcanestesi'] >0){
            //                $dataInsert[] = array(
            //                    'norec' => substr(Uuid::generate(), 0, 32),
            //                    'kdprofile' => 12,
            //                    'statusenabled' => true,
            //                    'strukpagufk' => $norecSC,
            //                    'pelayananpasienfk' => $item['norec_pp'],
            //                    'jenispagufk' => 7,//RC DOKTER,
            //                    'jenispagupersen' => null,
            //                    'jenispagunilai' => $item['rcanestesi'],
            //                    'produkfk' => $item['produkfk'],
            //                    'dokterid' => $item['dokterid'],
            //                    'tglpelayanan' => $item['tglpelayanan'],
            //                    'jumlah' => $item['jumlah'],
            //                    'ruanganfk' => $item['objectruanganfk'],
            //                    'namaexternal' => $item['tipedokter']
            //                );
            //            }
            //            if ((float)$item['rcanak'] >0){
            //                $dataInsert[] = array(
            //                    'norec' => substr(Uuid::generate(), 0, 32),
            //                    'kdprofile' => 12,
            //                    'statusenabled' => true,
            //                    'strukpagufk' => $norecSC,
            //                    'pelayananpasienfk' => $item['norec_pp'],
            //                    'jenispagufk' => 7,//RC DOKTER,
            //                    'jenispagupersen' => null,
            //                    'jenispagunilai' => $item['rcanak'],
            //                    'produkfk' => $item['produkfk'],
            //                    'dokterid' => $item['dokterid'],
            //                    'tglpelayanan' => $item['tglpelayanan'],
            //                    'jumlah' => $item['jumlah'],
            //                    'ruanganfk' => $item['objectruanganfk'],
            //                    'namaexternal' => $item['tipedokter']
            //                );
            //            }
            //
            ////                'tipedokter' => 'RDC anestesi',
            //            if ((float)$item['rc'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi'){
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 8,//RC
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['rc'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => $item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //
            //            if ((float)$item['postremun'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi') {
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 9,//POST REMUN
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['postremun'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => $item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //
            //            if ((float)$item['ccdireksi'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi') {
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 10,//CC DIREKSI
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['ccdireksi'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => $item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //
            //            if ((float)$item['ccstaffdireksi'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi') {
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 11,//CC STAFF DIREKSI
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['ccstaffdireksi'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => $item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //
            //            if ((float)$item['ccmanajemen'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi') {
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 12,//CC MANAJEMEN
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['ccmanajemen'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => $item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //            if ((float)$item['rcok'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi'){
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 8,//RC
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['rcok'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => 44,//$item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //            if ((float)$item['rcnicu'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi'){
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 8,//RC
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['rcnicu'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => 65,//$item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //            if ((float)$item['rcigd'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi'){
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 8,//RC
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['rcigd'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => 29,//$item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //            if ((float)$item['rcvk'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi'){
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 8,//RC
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['rcvk'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => 454,//$item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            //            if ((float)$item['rcnifas'] >0) {
            //                if  ($item['tipedokter'] != 'RDC anestesi'){
            //                    $dataInsert[] = array(
            //                        'norec' => substr(Uuid::generate(), 0, 32),
            //                        'kdprofile' => 0,
            //                        'statusenabled' => true,
            //                        'strukpagufk' => $norecSC,
            //                        'pelayananpasienfk' => $item['norec_pp'],
            //                        'jenispagufk' => 8,//RC
            //                        'jenispagupersen' => null,
            //                        'jenispagunilai' => $item['rcnifas'],
            //                        'produkfk' => $item['produkfk'],
            //                        'dokterid' => $item['dokterid'],
            //                        'tglpelayanan' => $item['tglpelayanan'],
            //                        'jumlah' => $item['jumlah'],
            //                        'ruanganfk' => 80,//$item['objectruanganfk'],
            //                        'namaexternal' => $item['tipedokter']
            //                    );
            //                }
            //            }
            if (count($dataInsert) > 100) {
                StrukDetailPagu::insert($dataInsert);
                $dataInsert = [];
            }
        }
        StrukDetailPagu::insert($dataInsert);

        $result = array(
            //            'data1' => $newData,
            //            'data2' => $newData2,
            'data3' => $dataDokterAnak,
            'strukpagu' => $StrukPagu,
            'norecsc' => $norecSC,
            'message' => 'as@epic',
            'messages' => 'Sukses',
        );

        return $this->respond($result);
    }
    public function saveClosingDireksi(Request $request)
    {
        //TODO : Closing DIREKSI
        //        ini_set('max_execution_time', 500); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            //DIREKSI
            $dataDireksiTotal = collect(DB::select(
                "
                    select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as totalpagu
                    from  jenispagu_t as jp 
                    INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                    INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                    
                    where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                    and jp.id =13
                    
                    group by jp.kelompokpaguid, jp.id ,jp.jenispagu
                   
                    "
            ))->first();
            //            return $this->respond($dataDireksiTotal);
            $dataDireksiPegawai = DB::select(DB::raw("
                 select distinct pg.id as idpegawai ,pg.namalengkap, jp.jenispagu,
                pg.poinjpt as  totalindex,mp.detailjenispagufk,djp.detailjenispagu,mp.jenispagufk
                from mapjenispagutopegawai_t as mp
                INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                where  mp.jenispagufk=13 and pg.statusenabled=1
            "));
            $totalRemunDir = $dataDireksiTotal->totalpagu;
            $totalPoint = 0;
            foreach ($dataDireksiPegawai as $it) {
                if ($it->totalindex != null) {
                    $totalPoint = $totalPoint + (float)$it->totalindex;
                }
            }
            $ttl = 0;
            $dtRLangsung = [];
            foreach ($dataDireksiPegawai as $itm) {
                if ($it->totalindex != null) {
                    $jenispaginilaitotal = $totalRemunDir * ((float)$itm->totalindex / (float)$totalPoint);
                    //                return $jenispaginilaitotal;
                    $ttl = $ttl + $jenispaginilaitotal;
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->idpegawai,
                        'jenispaginilaitotal' => (float)$jenispaginilaitotal,
                        'kelompokpaguid' => (int)$itm->jenispagufk,
                        'jpid' => (int)13,
                        'tglpelayanan' => null,
                        'norec_sdp' => null,
                        'jenis' => 'DIREKSI',
                        'namaproduk' => $itm->detailjenispagu,
                        'jenispagu' => $itm->jenispagu,
                        'detailjenispagufk' => $itm->detailjenispagufk,
                        'potpersen' => 0,
                        //                    'index'=>(float)$itm->totalindex,
                        //                    'point'=> $totalPoint,

                    );
                }
            }
            // END DIREKSI

            //            return  $this->respond($ttl);
            //        return $this->setStatusCode(400)->respond($dtRLangsung, '');
            $dataSave = $dtRLangsung;

            $dataPegawai = \DB::table('loginuser_s as lu')
                ->select('lu.objectpegawaifk')
                ->where('lu.id', $rq['userData']['id'])
                ->first();
            $SCSC = StrukClosing::where('tglawal', '>=', $rq['head']['periodeawal'])
                ->where('tglakhir', '<=', $rq['head']['periodeakhir'])
                ->select('norec')
                ->update([
                    'statusenabled' => 0,
                ]);

            $SCSCS = StrukClosing::where('tglawal', '>=', $rq['head']['periodeawal'])
                ->where('tglakhir', '<=', $rq['head']['periodeakhir'])
                ->select('norec')
                ->first();
            if (!empty($SCSCS)) {
                $SCSCDet = DetailPegawaiPagu::where('strukclosingfk', $SCSCS->norec)->update([
                    'statusenabled' => 0,
                ]);
            }


            $nostrukClosing = $this->generateCode(new StrukClosing(), 'noclosing', 10, 'RC/' . $this->getDateTime()->format('ym'));

            $dataSC = new StrukClosing();
            $dataSC->norec = $dataSC->generateNewId();
            $dataSC->kdprofile = 0;
            $dataSC->statusenabled = true;
            $dataSC->noclosing = $nostrukClosing;
            $dataSC->tglclosing = date('Y-m-d H:i:s');
            $dataSC->tglawal = $rq['head']['periodeawal'];
            $dataSC->tglakhir = $rq['head']['periodeakhir'];
            $dataSC->objectpegawaidiclosefk = $dataPegawai->objectpegawaifk;
            $dataSC->objectkelompoktransaksifk = 118;
            //            $dataSC->keteranganlainnya = 'PR';
            $dataSC->save();

            $norecSC = $dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }
            //
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu DIREKSI";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "norecsc" => $norecSC,
                "total" => $ttl,
                "request" => $rq,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                //                "e" => $e,
                "by" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingJPL(Request $request)
    {
        //TODO : Closing JPL
        //        ini_set('max_execution_time', 1000); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            //            $dataRemunLangsung = DB::select(DB::raw(
            //                "
            //                       select  x.norec as norec_sdp,sum(x.totalkelompok) as totalkelompok,
            //                         sum(x.totalindividu) as totalindividu,
            //                         sum(x.totalpengirim) as totalpengirim,
            //                        x.dokterid   ,x.ruanganfk,x.dokterorder
            //                         from (select
            //                        case when sdp.ruanganfk in (535) then  (sdp.jenispagunilai*50)/100
            //                         --HD
            //                        when sdp.ruanganfk in (569,584,588,587,585,589,593,568) then  (sdp.jenispagunilai*30)/100
            //                        --IGD ,ARJUNA, ABIMANYU, SENA, LARASATI, NAKULA, BISMA,GIGI
            //                        when sdp.ruanganfk in (586,582,592,596,583,581) then  (sdp.jenispagunilai*40)/100
            //                        --SUMBADRA, PUNTODEWO,DEWI KUNTI,Samba,Wisanggeni,Kresna
            //                        when sdp.ruanganfk in (577,580) then  sdp.jenispagunilai
            //                        -- INSTALAS REHAB
            //                        when sdp.ruanganfk in (570) then  (sdp.jenispagunilai*90)/100
            //                        --PSIKOLOGI
            //                        when sdp.ruanganfk in (575) and so.objectpegawaiorderfk is not null then  (sdp.jenispagunilai*80)/100
            //                        when sdp.ruanganfk in (575) and so.objectpegawaiorderfk is null then  (sdp.jenispagunilai*90)/100
            //                        --LAB
            //                        when sdp.ruanganfk in (576) and so.objectpegawaiorderfk is not null then  (sdp.jenispagunilai*50)/100
            //                        when sdp.ruanganfk in (576) and so.objectpegawaiorderfk is null then  (sdp.jenispagunilai*70)/100
            //                        --RAD
            //                        when sdp.ruanganfk in (125,94,116,59) then  (sdp.jenispagunilai*90)/100
            //                         --FARMASI
            //                        when sdp.ruanganfk in (571) and so.objectpegawaiorderfk is not  null then  (sdp.jenispagunilai*60)/100
            //                        when sdp.ruanganfk in (571) and so.objectpegawaiorderfk is null then  (sdp.jenispagunilai*70)/100
            //                         --ELEKRO
            //                        else (sdp.jenispagunilai*30)/100 end as totalkelompok,
            //                        -------------------------
            //                        case when sdp.ruanganfk in (535) then  (sdp.jenispagunilai*50)/100
            //                        --HD
            //                        when sdp.ruanganfk in (569,584,588,587,585,589,593,568) then  (sdp.jenispagunilai*70)/100
            //                        --IGD ,ARJUNA, ABIMANYU, SENA, LARASATI, NAKULA, BISMA GIGI
            //                        when sdp.ruanganfk in (586,582,592,596,583,581)then  (sdp.jenispagunilai*60)/100
            //                        --SUMBADRA, PUNTODEWO,DEWI KUNTI,Samba,Wisanggeni,Kresna
            //                        when sdp.ruanganfk in (577,580) then  0
            //                        --INSTALASI REHAB
            //                        when sdp.ruanganfk in (570) then  (sdp.jenispagunilai*10)/100
            //                         --PSIKOLOGI
            //                        when sdp.ruanganfk in (575) then  (sdp.jenispagunilai*10)/100
            //                         --LAB
            //                        when sdp.ruanganfk in (576 ) then  (sdp.jenispagunilai*30)/100
            //                         --RAD
            //                        when sdp.ruanganfk in (125,94,116,59) then  (sdp.jenispagunilai*10)/100
            //                         --FARMASI
            //                        when sdp.ruanganfk in (571) then  (sdp.jenispagunilai*30)/100
            //                         --ELEKRO
            //                        else (sdp.jenispagunilai*70)/100 end as totalindividu,
            //                        ----------------
            //                        case when sdp.ruanganfk in (575,571) and so.objectpegawaiorderfk is not null  then (sdp.jenispagunilai*10)/100
            //                        when sdp.ruanganfk in (576) and so.objectpegawaiorderfk is not null then (sdp.jenispagunilai*20)/100
            //                        ELSE
            //                        0 end as totalpengirim,sdp.pelayananpasienfk,
            //                        sdp.dokterid  as dokterid,sdp.ruanganfk,so.objectpegawaiorderfk as dokterorder,sdp.norec
            //                        from   strukdetailpagu_t as sdp
            //                        INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
            //                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
            //                        left JOIN strukorder_t as so on so.norec=pp.strukorderfk
            //                        where sp.periodeawal between '$tglAwal' and '$tglAkhir'
            //                        and sdp.dokterid not in (0) and sdp.jenispagufk=16 ) as x
            //                        group by x.dokterid,x.ruanganfk,x.dokterorder,x.norec;
            //                "
            //            ));
            $dataRemunLangsung = DB::select(DB::raw(
                "
                        select  x.norec as norec_sdp,sum(x.totalkelompok) as totalkelompok,
                        sum(x.totalindividu) as totalindividu,
                        sum(x.totalpengirim) as totalpengirim,
                        x.dokterid   ,x.ruanganfk,x.dokterorder,x.persen_kelompok,
                        x.persen_individu ,x.persen_pengirim,
                        x.jenispagunilai
                        from (select 
                        case 
                        when sdp.ruanganfk in (575,576,571) and so.objectpegawaiorderfk is not null then  (sdp.jenispagunilai*60)/100
                        when sdp.ruanganfk in (575,576,571) and so.objectpegawaiorderfk is null then  (sdp.jenispagunilai*70)/100
                        --LAB -RAD --ELEKRO
                        else (sdp.jenispagunilai* (
                        case
                        when prd.persen_kelompok  is null  and prd.persen_individu is null  then 50 
                        when prd.persen_kelompok  is not null  and prd.persen_individu is  null  then prd.persen_kelompok 
                        when prd.persen_kelompok  is  null  and prd.persen_individu is not null  then 0
                        when prd.persen_kelompok  is not null  and prd.persen_individu is not null  then prd.persen_kelompok 
                        end
                        )
                        )/100 end as totalkelompok,
                        -------------------------
                        case 
                        when sdp.ruanganfk in (575,571,576) then  (sdp.jenispagunilai*30)/100
                        --LAB--RAD--ELEKRO
                        else (sdp.jenispagunilai*
                        (
                        case 
                        when prd.persen_kelompok  is null  and prd.persen_individu is null  then 50 
                        when prd.persen_kelompok  is null  and prd.persen_individu is not null  then prd.persen_individu 
                        when prd.persen_kelompok  is not null  and prd.persen_individu is  null  then 0
                        when prd.persen_kelompok  is not null  and prd.persen_individu is not null  then prd.persen_individu 
                         end
                        )
                        )/100 end as totalindividu,
                        ----------------
                        case when sdp.ruanganfk in (575,571,576) and so.objectpegawaiorderfk is not null 
                        then (sdp.jenispagunilai*10)/100 
                        ELSE
                        0 end as totalpengirim,sdp.pelayananpasienfk,
                        sdp.dokterid  as dokterid,sdp.ruanganfk,so.objectpegawaiorderfk as dokterorder,sdp.norec,
                        case when sdp.ruanganfk in (575,571,576) and so.objectpegawaiorderfk is not null 
                        then 10 end as persen_pengirim,
                        case when sdp.ruanganfk in (575,571,576) then 30 else prd.persen_individu end as persen_individu,
                        case when sdp.ruanganfk in (575,576,571) and so.objectpegawaiorderfk is not null then 60
                        when sdp.ruanganfk in (575,576,571) and so.objectpegawaiorderfk is null then  70 ELSE
                          prd.persen_kelompok end as persen_kelompok,
                        sdp.jenispagunilai
                        from   strukdetailpagu_t as sdp
                        INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                        INNER JOIN produk_m as prd on pp.produkfk=prd.id
                        left JOIN strukorder_t as so on so.norec=pp.strukorderfk
                        where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                        and sdp.dokterid not in (0) and sdp.jenispagufk=16 ) as x 
                        group by x.dokterid,x.ruanganfk,x.dokterorder,x.norec,
                        x.persen_individu ,x.persen_kelompok,
                        x.jenispagunilai,x.persen_pengirim
                "
            ));

            // return $this->respond( $pegawai);
            $dtRLangsung = [];
            $ttl = 0;
            foreach ($dataRemunLangsung as $itmLangsung) {
                if ($itmLangsung->dokterid != null) {
                    if ((float)$itmLangsung->totalindividu != 0) {
                        $ttl  = $ttl + (float)$itmLangsung->totalindividu;
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itmLangsung->dokterid,
                            'jenispaginilaitotal' => (float)$itmLangsung->totalindividu,
                            'jpid' => 16, //(int)$itmLangsung->jpid,
                            'tglpelayanan' => null, //$itmLangsung->tglpelayanan,
                            'norec_sdp' => $itmLangsung->norec_sdp,
                            'jenis' => 'JPL',
                            'namaproduk' => 'INDIVIDU PENGHASIL',
                            'jenispagu' => 'JPL', //$itmLangsung->jenispagu,
                            'detailjenispagufk' => 141, //INDIVIDU PENGHASIL
                            'potpersen' => 0,
                        );
                    }
                    if ((float)$itmLangsung->totalkelompok != 0) {
                        $ttl  = $ttl + (float)$itmLangsung->totalkelompok;
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itmLangsung->dokterid,
                            'jenispaginilaitotal' => (float)$itmLangsung->totalkelompok,
                            'jpid' => 16, //(int)$itmLangsung->jpid,
                            'tglpelayanan' => null, //$itmLangsung->tglpelayanan,
                            'norec_sdp' => $itmLangsung->norec_sdp,
                            'jenis' => 'JPL',
                            'namaproduk' => 'KELOMPOK PENGHASIL', //$itmLangsung->namaproduk,
                            'jenispagu' => 'JPL', //$itmLangsung->jenispagu,
                            'detailjenispagufk' => 142, //KELOMPOK PENGHASIL
                            'ruanganfk' => $itmLangsung->ruanganfk,
                            'potpersen' => 0,
                        );
                    }
                    if ((float)$itmLangsung->totalpengirim != 0) {
                        $ttl  = $ttl + (float)$itmLangsung->totalpengirim;
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$itmLangsung->dokterorder,
                            'jenispaginilaitotal' => (float)$itmLangsung->totalpengirim,
                            'jpid' => 16, //(int)$itmLangsung->jpid,
                            'tglpelayanan' => null, //$itmLangsung->tglpelayanan,
                            'norec_sdp' => $itmLangsung->norec_sdp,
                            'jenis' => 'JPL',
                            'namaproduk' => 'PENGIRIM', //$itmLangsung->namaproduk,
                            'jenispagu' => 'JPL', //$itmLangsung->jenispagu,
                            'detailjenispagufk' => 143, //KELOMPOK PENGIRIM
                            //                            'ruanganfk' => $itmLangsung->ruanganfk,
                            'potpersen' => 0,
                        );
                    }
                    $ruanganId =   $itmLangsung->ruanganfk;
                    //                $kelompokPenghasil = DB::select(DB::raw("
                    //                        select distinct pg.idpegawai ,pg.namakaryawan, jp.jenispagu,pg.ruanganfk,
                    //                        pg.totalindex,mp.detailjenispagufk,djp.detailjenispagu,mp.jenispagufk
                    //                        from mapjenispagutopegawai_t as mp
                    //                        INNER JOIN remundetailpegawai_t as pg on pg.idpegawai=mp.pegawaifk
                    //                        INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                    //                        INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                    //                        where  mp.jenispagufk=16 and mp.detailjenispagufk=142 and pg.statusenabled=1
                    //                        and pg.ruanganfk=$ruanganId
                    //                "));

                    //                 foreach ($kelompokPenghasil as $key => $v) {
                    //                    if($v->ruanganfk ==  $itmLangsung->ruanganfk){
                    //                        $ttl  = $ttl + ((float)$itmLangsung->totalkelompok /count( $kelompokPenghasil));
                    //                        $dtRLangsung[] = array(
                    //                            'pegawaiid' => (int)$v->idpegawai,
                    //                            'jenispaginilaitotal' => (float)$itmLangsung->totalkelompok /count( $kelompokPenghasil) ,
                    //                            'jpid' => 16,//(int)$itmLangsung->jpid,
                    //                            'tglpelayanan' => null,//$itmLangsung->tglpelayanan,
                    //                            'norec_sdp' => null,//$itmLangsung->norec_sdp,
                    //                            'jenis' => 'JPL',
                    //                            'namaproduk' => '',//$itmLangsung->namaproduk,
                    //                            'jenispagu' => 'JPL',//$itmLangsung->jenispagu,
                    //                            'detailjenispagufk' => $v->detailjenispagufk,
                    //                            'potpersen' => 0,
                    //                         );
                    //                      }
                    //                   }
                }
            }
            //            return  $this->respond($ttl);
            //            return  $this->respond($dtRLangsung);
            $dataSave = $dtRLangsung;
            // return $this->respond($dataSave);


            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                //                $dataSPD->kelompokpaguid = $item['kelompokpaguid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                if (isset($item['ruanganfk'])) {
                    $dataSPD->ruanganfk = $item['ruanganfk'];
                }
                if (isset($item['persen_individu'])) {
                    $dataSPD->persen_individu = $item['persen_individu'];
                }
                if (isset($item['persen_kelompok'])) {
                    $dataSPD->persen_kelompok = $item['persen_kelompok'];
                }
                if (isset($item['persen_pengirim'])) {
                    $dataSPD->persen_pengirim = $item['persen_pengirim'];
                }
                $dataSPD->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu JPL";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "total" => $ttl,
                "request" => $rq,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingStruktural(Request $request)
    {
        //TODO : Closing Struktural
        //        ini_set('max_execution_time', 1000); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            //DIREKSI
            $dataDireksiTotal = collect(DB::select(
                "
                    select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as totalpagu
                    from  jenispagu_t as jp 
                    INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                    INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                    where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                    and jp.id =14
                    
                    group by jp.kelompokpaguid, jp.id ,jp.jenispagu
                   
                    "
            ))->first();
            $dataDireksiPegawai = DB::select(DB::raw("
                 select distinct pg.id as idpegawai , jp.jenispagu,
                    pg.poinjpt as totalindex,mp.detailjenispagufk,djp.detailjenispagu,mp.jenispagufk
                    from mapjenispagutopegawai_t as mp
                    INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
                    INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                    INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                    where  mp.jenispagufk=14 and pg.statusenabled=1
                    
            "));
            $totalRemunDir = $dataDireksiTotal->totalpagu;
            $totalPoint = 0;
            foreach ($dataDireksiPegawai as $it) {
                if ($it->totalindex != null) {
                    $totalPoint = $totalPoint + (float)$it->totalindex;
                }
            }
            $ttl = 0;
            $dtRLangsung = [];
            foreach ($dataDireksiPegawai as $itm) {
                if ($it->totalindex != null) {
                    $jenispaginilaitotal =  ((float)$itm->totalindex / (float)$totalPoint) * $totalRemunDir;
                    $ttl = $ttl + $jenispaginilaitotal;
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->idpegawai,
                        'jenispaginilaitotal' => (float)$jenispaginilaitotal,
                        'kelompokpaguid' => (int)$itm->jenispagufk,
                        'jpid' => (int)14,
                        'tglpelayanan' => null,
                        'norec_sdp' => null,
                        'jenis' => 'STRUKTURAL',
                        'namaproduk' => $itm->detailjenispagu,
                        'jenispagu' => $itm->jenispagu,
                        'detailjenispagufk' => $itm->detailjenispagufk,
                        'potpersen' => 0,
                    );
                }
            }
            // END DIREKSI

            //            return  $this->respond($ttl);

            $dataSave = $dtRLangsung;

            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu STRUKTURAL";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "total" => $ttl,
                "request" => $rq,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingJPTL(Request $request)
    {
        //TODO : Closing JPTL & Administrasi
        //        ini_set('max_execution_time', 1000); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];

            //AMDINISTRASI


            $administrasi = collect(DB::select(
                "
                       select sum(sdp.jenispagunilai ) as totalpagu, 15 as jpid
                        from strukdetailpagu_t as sdp
                        INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                        INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk
                        where sdp.jenispagufk in (15) and sp.periodeawal between '$tglAwal' and '$tglAkhir'
                    "
            ))->first();

            $dataPegawaiAdmin = DB::select(DB::raw("
                 select distinct pg.id as idpegawai , jp.jenispagu,djp.point,
                    pg.poinjpt as totalindex,mp.detailjenispagufk,djp.detailjenispagu,mp.jenispagufk
                    from mapjenispagutopegawai_t as mp
                    INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
                    INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                    INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                    where  mp.jenispagufk=15 and pg.statusenabled=1
                    
            "));

            $pointAdmin = collect(DB::select(
                "
                     select sum(point) as point from detailjenispagu_t where jenispaguid=15 and statusenabled=1
                    "
            ))->first();

            $totalRemunAdmin = $administrasi->totalpagu;
            $totalPointAdmin = 0;
            foreach ($dataPegawaiAdmin as $tm) {
                $totalPointAdmin = (float) $tm->point +  $totalPointAdmin;
            }
            // return  $this->respond($totalRemunAdmin);

            $dtRLangsung = [];
            $ttl = 0;
            foreach ($dataPegawaiAdmin as $itm) {
                $jenispaginilaitotal = ((float)$itm->point / $totalPointAdmin) *  (float)$totalRemunAdmin;
                // return $jenispaginilaitotal;
                $ttl = $ttl + $jenispaginilaitotal;
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$itm->idpegawai,
                    'jenispaginilaitotal' => (float) $jenispaginilaitotal,
                    'kelompokpaguid' => (int)$itm->jenispagufk,
                    'jpid' => (int)15, //ADMIN
                    'tglpelayanan' => null,
                    'norec_sdp' => null,
                    'jenis' => 'AMDINISTRASI',
                    'namaproduk' => $itm->detailjenispagu,
                    'jenispagu' => $itm->jenispagu,
                    'detailjenispagufk' => $itm->detailjenispagufk,
                    'potpersen' => 0,
                );
            }

            // END Admin


            //JPTL
            $JPTL = collect(DB::select(
                "
                    select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as totalpagu
                    from  jenispagu_t as jp 
                    INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                    INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                    where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                    and jp.id =17
                    group by jp.kelompokpaguid, jp.id ,jp.jenispagu
                    "
            ))->first();

            //            $dataPegawaiJPTL = DB::select(DB::raw("
            //               select distinct pg.id as idpegawai , jp.jenispagu,
            //                mp.detailjenispagufk,djp.detailjenispagu,mp.jenispagufk,
            //                isnull((pdd.point),0) + isnull((gol.point),0) + isnull((jb.point),0)
            //                + isnull((ru.point),0) + isnull((pet.point),0) +  (case when pg.tglmasuk is not null then (case
            //                when  (DATEDIFF(month, pg.tglmasuk, GETDATE())) < 12 then 1
            //                else  (DATEDIFF(year, pg.tglmasuk, GETDATE()))
            //                end) else 0 end) as totalindex,
            //                pdd.pendidikan,gol.name as golongan,jb.namajabatan,ru.namaruangan,
            //                pet.petugasdiklat,pdd.point as poin1, gol.point as poin2, jb.point as poin3,
            //                ru.point as poin4, pet.point as poin5, (case when pg.tglmasuk is not null then (case
            //                when  (DATEDIFF(month, pg.tglmasuk, GETDATE())) < 12 then 1
            //                else  (DATEDIFF(year, pg.tglmasuk, GETDATE()))
            //                end) else 0 end) as poin6
            //                from mapjenispagutopegawai_t as mp
            //                INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
            //                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
            //                left JOIN pendidikan_m as pdd on pdd.id=pg.objectpendidikanterakhirfk
            //                left JOIN sdm_golongan_m as gol on gol.id=pg.objectgolonganfk
            //                left JOIN jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
            //                left JOIN ruangan_m as ru on ru.id=pg.objectruangankerjafk
            //                left JOIN petugasdiklat_m as pet on pet.id=pg.objectpetugasdiklatfk
            //                INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
            //                where  mp.jenispagufk=17 and pg.statusenabled=1
            //
            //
            //            "));
            $dataPegawaiJPTL = DB::select(DB::raw("
                select distinct pg.id as idpegawai , jp.jenispagu,
                mp.detailjenispagufk,djp.detailjenispagu,mp.jenispagufk
                from mapjenispagutopegawai_t as mp
                INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                where  mp.jenispagufk=17 and pg.statusenabled=1
            "));

            $totalPointJPTL = 0;
            $totalRemunJPTL = $JPTL->totalpagu;
            $remunJPTLperorang = (float)$totalRemunJPTL / count($dataPegawaiJPTL);
            //             foreach ($dataPegawaiJPTL as $tm){
            //                 if((float) $tm->totalindex != 0) {
            //                     $totalPointJPTL = (float)$tm->totalindex + $totalPointJPTL;
            //                 }
            //             }
            $ttlJPTL = 0;
            foreach ($dataPegawaiJPTL as $itm) {
                //                 if((float) $tm->totalindex != 0) {
                //$jenispaginilaitotal = ((float)$itm->totalindex / $totalPointJPTL) * (float)$totalRemunJPTL;
                $ttlJPTL = $ttlJPTL + $remunJPTLperorang;
                $dtRLangsung[] = array(
                    'pegawaiid' => (int)$itm->idpegawai,
                    'jenispaginilaitotal' => (float) $remunJPTLperorang,
                    'kelompokpaguid' => (int)$itm->jenispagufk,
                    'jpid' => (int)17,
                    'tglpelayanan' => null,
                    'norec_sdp' => null,
                    'jenis' => 'JPTL',
                    'namaproduk' => $itm->detailjenispagu,
                    'jenispagu' => $itm->jenispagu,
                    'detailjenispagufk' => $itm->detailjenispagufk,
                    'potpersen' => 0,
                );
                //                 }
            }
            //END JPTL  return  $this->respond($ttl+$ttlJPTL);
            //

            $dataSave = $dtRLangsung;

            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu ADMINISTRASI & JPTL";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "request" => $rq,
                "ttl" => $ttl + $ttlJPTL,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveClosingGabungan(Request $request)
    {
        //TODO : Closing Gabungan pake point per pendidikan jabatan dll
        //        ini_set('max_execution_time', 1000); //6 minutes
        DB::beginTransaction();
        try {
            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];



            //JPTL
            $JPTL = collect(DB::select(
                "
                    select jp.kelompokpaguid, jp.id as jpid,jp.jenispagu,sum(sdp.jenispagunilai) as totalpagu
                    from  jenispagu_t as jp 
                    INNER JOIN strukdetailpagu_t as sdp on sdp.jenispagufk=jp.id
                    INNER JOIN strukpagu_t as sp on sp.norec=sdp.strukpagufk
                    where sp.periodeawal between '$tglAwal' and '$tglAkhir'
                    and jp.id =18
                    group by jp.kelompokpaguid, jp.id ,jp.jenispagu
                    "
            ))->first();

            $dataPegawaiJPTL = DB::select(DB::raw("
               select distinct pg.id as idpegawai , jp.jenispagu,
                mp.detailjenispagufk,djp.detailjenispagu,mp.jenispagufk,
                isnull((pdd.point),0) + isnull((gol.point),0) + isnull((jb.point),0)
                + isnull((ru.point),0) + isnull((pet.point),0) +  (case when pg.tglmasuk is not null then (case 
                when  (DATEDIFF(month, pg.tglmasuk, GETDATE())) < 12 then 1 
                else  (DATEDIFF(year, pg.tglmasuk, GETDATE())) 
                end) else 0 end) as totalindex,
                pdd.pendidikan,gol.name as golongan,jb.namajabatan,ru.namaruangan,
                pet.petugasdiklat,pdd.point as poin1, gol.point as poin2, jb.point as poin3, 
                ru.point as poin4, pet.point as poin5, (case when pg.tglmasuk is not null then (case 
                when  (DATEDIFF(month, pg.tglmasuk, GETDATE())) < 12 then 1 
                else  (DATEDIFF(year, pg.tglmasuk, GETDATE())) 
                end) else 0 end) as poin6
                from mapjenispagutopegawai_t as mp
                INNER JOIN pegawai_m as pg on pg.id=mp.pegawaifk
                INNER JOIN jenispagu_t as jp on jp.id=mp.jenispagufk
                left JOIN pendidikan_m as pdd on pdd.id=pg.objectpendidikanterakhirfk
                left JOIN sdm_golongan_m as gol on gol.id=pg.objectgolonganfk
                left JOIN jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
                left JOIN ruangan_m as ru on ru.id=pg.objectruangankerjafk
                left JOIN petugasdiklat_m as pet on pet.id=pg.objectpetugasdiklatfk
                INNER JOIN detailjenispagu_t as djp on djp.id=mp.detailjenispagufk
                where  mp.jenispagufk=18 and pg.statusenabled=1
            "));

            $totalPointJPTL = 0;
            $totalRemunJPTL = $JPTL->totalpagu;
            $dtRLangsung = [];
            foreach ($dataPegawaiJPTL as $tm) {
                if ((float) $tm->totalindex != 0) {
                    $totalPointJPTL = (float) $tm->totalindex +  $totalPointJPTL;
                }
            }
            $ttlJPTL = 0;
            foreach ($dataPegawaiJPTL as $itm) {
                if ((float) $tm->totalindex != 0) {
                    $jenispaginilaitotal = ((float)$itm->totalindex / $totalPointJPTL) *  (float)$totalRemunJPTL;
                    // return $jenispaginilaitotal;
                    $ttlJPTL = $ttlJPTL + $jenispaginilaitotal;
                    $dtRLangsung[] = array(
                        'pegawaiid' => (int)$itm->idpegawai,
                        'jenispaginilaitotal' => (float) $jenispaginilaitotal,
                        'kelompokpaguid' => (int)$itm->jenispagufk,
                        'jpid' => (int)18,
                        'tglpelayanan' => null,
                        'norec_sdp' => null,
                        'jenis' => 'GABUNGAN',
                        'namaproduk' => $itm->detailjenispagu,
                        'jenispagu' => $itm->jenispagu,
                        'detailjenispagufk' => $itm->detailjenispagufk,
                        'potpersen' => 0,
                    );
                }
            }
            //END JPTL
            //            return  $this->respond($ttlJPTL);
            //            return  $this->respond($dtRLangsung);

            $dataSave = $dtRLangsung;

            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;

            foreach ($dataSave as $item) {
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing Pagu GABUNGAN";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "ttl" => $ttlJPTL,
                "request" => $rq,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveClosingPotongan(Request $request)
    {
        //TODO : Closing Ptongan di bagi ke setiap bagian ptongannya
        //        ini_set('max_execution_time', 1000); //6 minutes
        DB::beginTransaction();
        try {

            $rq = $request->all();
            $tglAwal = $rq['head']['periodeawal'];
            $tglAkhir = $rq['head']['periodeakhir'];
            $norecSC = $rq['head']['norecsc'];
            //JPTL
            $potongan = DB::select(DB::raw(
                "
                select *,case when x.potfix > 0 and   x.jmlremun > x.potfix 
                then x.jmlremun - x.potfix else (
                case when x.potpersen > 0 and  x.jmlremun >(x.potpersen /100 *x.jmlremun )  
                then x.jmlremun - (x.potpersen /100 *x.jmlremun ) else 0 end
                ) end potongan
                from (SELECT
                    jp.jenispagu,
                    pg.namalengkap,
                    pot.objectpegawaifk,               
                    jp.id AS jpid,
                    djp.detailjenispagu,
                pg.objectkelompokjabatanfk,
                (select count(nn.id) as jml
                        from pegawai_m as pg2
                        join nilaikelompokjabatan_m as nn on nn.id=pg2.objectkelompokjabatanfk
                        where pg2.statusenabled =1 
                        and nn.statusenabled =1 
                        and nn.detailkelompokjabatan <> '-'
                and nn.id =pg.objectkelompokjabatanfk) as jmlorang,
                (select sum(dpp.jenispaginilaitotal) as jmlremun 
                from strukclosing_t as sc
                INNER JOIN detailpegawaipagu_t as dpp on dpp.strukclosingfk=sc.norec
                where sc.norec= '$norecSC'
                and dpp.pegawaiid=pot.objectpegawaifk
                and dpp.statusenabled=1)  as jmlremun,
                (case when 
                (case when pot.remunfixed is null then 0 else pot.remunfixed end )
                > 0 then pot.remunfixed else 0 end) as  potfix,
                (case when (case when pot.potpersen is null then 0 else pot.potpersen end )
                > 0 then pot.potpersen else 0 end) as  potpersen    
                
                FROM
                    potonganremun_t AS pot
                LEFT JOIN jenispagu_t AS jp ON jp.id = pot.objectjenispagufk
                LEFT JOIN detailjenispagu_t AS djp ON djp.id = pot.objectdetailjenispagufk
                INNER JOIN pegawai_m AS pg ON pg.id = pot.objectpegawaifk
                WHERE
                    pg.statusenabled = 1)
                as x


                    "
            ));
            $dtRLangsung = [];
            if (count($potongan) > 0) {
                foreach ($potongan as $p) {
                    $idPeg = $p->objectpegawaifk;
                    $idKelJabatan = $p->objectkelompokjabatanfk;
                    if ((float)$p->potongan > 0) {

                        $dataUp =  DB::select(DB::raw("
                            select dpp.*
                            from strukclosing_t as sc
                            INNER JOIN detailpegawaipagu_t as dpp on dpp.strukclosingfk=sc.norec
                            where sc.norec= '$norecSC'
                            and dpp.pegawaiid=$idPeg
                            and dpp.statusenabled=1"));
                        foreach ($dataUp as $d) {
                            $update = DB::table('detailpegawaipagu_t')
                                ->where('norec', $d->norec)
                                ->update([
                                    'jenispaginilaitotal' =>  (float)$d->jenispaginilaitotal  -
                                        (((float)$d->jenispaginilaitotal / (float)$p->jmlremun) * $p->potfix)
                                ]);
                        }

                        $orang2Na = DB::select(DB::raw("
                            select pg.id as idpegawai, pg.namalengkap,nn.detailkelompokjabatan,pg.objectkelompokjabatanfk
                            from pegawai_m as pg
                            join nilaikelompokjabatan_m as nn on nn.id=pg.objectkelompokjabatanfk
                            where pg.statusenabled =1 
                            and nn.statusenabled =1 
                            and nn.detailkelompokjabatan <> '-'
                            and nn.id =$idKelJabatan
                        "));
                        $dtRLangsung[] = array(
                            'pegawaiid' => (int)$idPeg,
                            'jenispaginilaitotal' => -(float) $p->potfix,
                            'kelompokpaguid' => 20, //Potongan
                            'jpid' => (int)20,
                            'tglpelayanan' => null,
                            'norec_sdp' => null,
                            'jenis' => 'POTONGAN',
                            'namaproduk' => 'POTONGAN',
                            'jenispagu' => 'POTONGAN',
                            'detailjenispagufk' => 150, //Potongan
                            'potpersen' => (float)$p->potfix,
                            'keteranganpot' => '',
                        );
                        foreach ($orang2Na as $o) {
                            $jenispaginilaitotal = ((float) $p->potfix / (float)$p->jmlorang);
                            $dtRLangsung[] = array(
                                'pegawaiid' => (int)$o->idpegawai,
                                'jenispaginilaitotal' => (float) $jenispaginilaitotal,
                                'kelompokpaguid' => 19, //Potongan
                                'jpid' => (int)19,
                                'tglpelayanan' => null,
                                'norec_sdp' => null,
                                'jenis' => 'PENERIMAAN POTONGAN',
                                'namaproduk' => 'PENERIMAAN POTONGAN',
                                'jenispagu' => 'PENERIMAAN POTONGAN',
                                'detailjenispagufk' => 149, //Potongan
                                'potpersen' => (float)$p->potfix,
                                'keteranganpot' => 'Penerimaan dari ' . $idPeg . ' ' . $p->namalengkap . ' pot : ' . (float)$p->potfix .
                                    ' ,' . $p->jmlorang . ' org , terima : ' . $jenispaginilaitotal,
                            );
                        }
                    }
                }
            }
            //            return $this->respond($dtRLangsung);
            $dataSave = $dtRLangsung;

            $norecSC = $rq['head']['norecsc']; //$dataSC->norec;
            $ttlJPTL = 0;
            foreach ($dataSave as $item) {
                $ttlJPTL = $ttlJPTL + $item['jenispaginilaitotal'];
                $dataSPD = new DetailPegawaiPagu();
                $dataSPD->norec = $dataSPD->generateNewId();
                $dataSPD->kdprofile = 0;
                $dataSPD->statusenabled = true;
                $dataSPD->strukclosingfk = $norecSC;
                $dataSPD->jenis = $item['jenis'];
                $dataSPD->jenispaginilaitotal = $item['jenispaginilaitotal'];
                $dataSPD->jpid = $item['jpid'];
                $dataSPD->kodeexternal = $item['potpersen'];
                $dataSPD->namaexternal = $item['keteranganpot'];
                $dataSPD->norec_sdp = $item['norec_sdp'];
                $dataSPD->pegawaiid = $item['pegawaiid'];
                $dataSPD->tglpelayanan = $item['tglpelayanan'];
                $dataSPD->djpid = $item['detailjenispagufk'];
                $dataSPD->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Closing POTONGAN REMUN";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => count($dataSave),
                "ttl" => $ttlJPTL,
                "request" => $rq,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarRemunKelompok(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $namapeg = '';
        $row = '';
        if ($request['namalengkap'] != '') {
            $namapeg = " and pg.namalengkap like '%" . $request['namalengkap'] . "%'";
        }
        $ruangan = '';
        if ($request['namaruangan'] != '') {
            $ruangan = " and ru.namaruangan like '%" . $request['namaruangan'] . "%'";
        }
        $noclosing = '';
        if ($request['noclosing'] != '') {
            $noclosing = " and sc.noclosing like '%" . $request['noclosing'] . "%'";
        }
        if ($request['jmlRows'] != '') {
            //            $rowss = (float)$request['jmlRows'] /2;
            $row = "TOP " . $request['jmlRows'];
        }

        $data3 = "
                
                select  $row ru.id as ruid, ru.namaruangan ,sc.noclosing,sc.tglawal,sc.tglakhir,
                djp.detailjenispagu as jabatan,'-' as golongan,'-' as skpertamamasukrs,dpp.djpid,dpp.jpid,
                dpp.strukclosingfk,
                sum(dpp.jenispaginilaitotal) as total
                from detailpegawaipagu_t as dpp
                INNER JOIN pegawai_m as pg on pg.id=dpp.pegawaiid
                left JOIN ruangan_m as ru on ru.id=dpp.ruanganfk
                left JOIN detailjenispagu_t as djp on djp.id=dpp.djpid
                INNER JOIN strukclosing_t as sc on sc.norec=dpp.strukclosingfk
                where sc.tglclosing between '$tglAwal' and '$tglAkhir'
                $ruangan
                $noclosing
                -- and sc.statusenabled = true
                and sc.statusenabled = 1
                and pg.statusenabled = 1
                and dpp.statusenabled = 1
                and dpp.ruanganfk is not  null and dpp.djpid = 142
                group by ru.id , ru.namaruangan,
                djp.detailjenispagu,sc.noclosing,sc.tglawal,sc.tglakhir,dpp.djpid,dpp.jpid,
                dpp.strukclosingfk
                
                   ";
        $data = DB::select(DB::raw(
            $data3
        ));
        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function getComboRem(Request $request)
    {
        $peg = \DB::table('pegawai_m as dp')
            ->select('id', 'namalengkap')
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namalengkap')
            ->get();
        $res['pegawai'] = $peg;

        return $this->respond($res);
    }
    public function saveDetailKelompok(Request $request)
    {
        DB::beginTransaction();
        try {
            $sc = StrukClosing::where('noclosing', $request['noclosing'])
                ->where('statusenabled', true)
                ->first();
            $del = DB::table('detailkelompokpenghasil_t')
                ->where('strukclosingfk', $sc->norec)
                ->where('ruanganfk', $request['ruid'])
                ->delete();
            foreach ($request['details'] as $v) {
                $dataInsert[] = array(
                    'norec' => substr(Uuid::generate(), 0, 32),
                    'kdprofile' => 0,
                    'statusenabled' => true,
                    'strukclosingfk' => $sc->norec,
                    'jenis' => null,
                    'pagunilai' => $v['pagunilai'],
                    'norec_sdp' => null,
                    'pegawaiid' => $v['pegawaiid'],
                    'tglpelayanan' => date('Y-m-d H:i'),
                    'djpid' => $request['djpid'],
                    'jpid' => $request['jpid'],
                    'ruanganfk' => $request['ruid'],

                );
            }
            DB::table('detailkelompokpenghasil_t')
                ->insert($dataInsert);
            $dataInsert = [];
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                //                "e" => $e,
                "by" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDetailKelompok(Request $request)
    {
        $peg = \DB::table('detailkelompokpenghasil_t as dp')
            ->join('pegawai_m as pg', 'pg.id', '=', 'dp.pegawaiid')
            ->select('dp.*', 'pg.namalengkap')
            ->where('dp.ruanganfk',  $request['ruid'])
            ->where('dp.strukclosingfk', $request['noclosing'])
            ->orderBy('pg.namalengkap')
            ->get();
        $res['data'] = $peg;

        return $this->respond($res);
    }
    public function saveJasaPelayananNew(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        ini_set('max_execution_time', 500); //6 minutes
        if (stripos($request['penjamin'], 'bpjs') !== false) {
            $persenbruto = 90;
        } else {
            $persenbruto = 80;
        }
        $persenpph = 15;
        try {
            // $nostrukpagu = $this->generateCode(new StrukPagu(), 'nostrukpagu', 10, 'PGUN/' . $this->getDateTime()->format('ym'));
            foreach ($request['data'] as $itm) {
                $bruto = $itm['tarif'] * $persenbruto / 100;
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;

                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm['idpetugas'];
                $jaspel->produkfk = $itm['produkfk'];
                $jaspel->tarif = $itm['hargakomponen'];
                $jaspel->jeniskomponen = $itm['komponenhargafk'];
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm['ruanganfk'];
                $jaspel->tglpelayanan = $itm['tglPelayanan'];
                $jaspel->tglverif = date('Y-m-d H:i:s');
                $jaspel->jumlah = $itm['jumlah'];
                $jaspel->kelasfk = $itm['tglPelayanan'];

                $jaspel->namakelas = $itm['tglPelayanan'];
                $jaspel->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewSatuan(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        $produkfk = $request['produkfk'];
        $tglpelayanan = $request['tglpelayanan'];

        ini_set('max_execution_time', 500); //6 minutes



        try {
            //non bedah                       
            $data = DB::select(
                DB::raw(
                    "select  golonganpajakpegawai_m.id, jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk,jasadokter.objectjenispetugaspefk, jasadokter.objectruanganfk, jasadokter.norecpp,jasadokter.objectdetailjenisprodukfk,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                  jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE jasadokter.noregistrasi = $noregistrasi and jasadokter.produkfk=$produkfk and tglpelayanan='$tglpelayanan' and jasadokter.tarifrs>0 and jasadokter.hargajual>0 and jasadokter.objectruanganfk not in (44,277)"
                )
            );
            $datax = DB::select(
                DB::raw(
                    "select tglclosing from pasiendaftar_t WHERE  noregistrasi = $noregistrasi"
                )
            );
            // $tglclosing = date('Y-m-d H:i:s');
            // $tglclosing = $request['tglclosing'];

            if (!empty($datax)) {
                foreach ($datax as $itmx) {
                    $tglclosing = $itmx->tglclosing;
                }
            }


            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    // if($itm->produkfk == '4056952'){
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }
                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                    if ($itm->objectbahanprodukfk == 1) {
                                        if ($itm->objectpajakpegawai == 1) {
                                            $itm->tarifrs = 18000;
                                            $bruto = 18000;
                                        } else {
                                            $itm->tarifrs = 16000;
                                            $bruto = 16000;
                                        }
                                    }
                                } else {
                                    if ($itm->objectbahanprodukfk == 1) {
                                        $istrueberkasrs = 1;
                                    }
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }
                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah *  $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;

                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->save();
            }

            //bedah
            $data = DB::select(
                DB::raw(
                    "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal,jasadokterbedah.objectjenispetugaspefk, jasadokterbedah.objectruanganfk, jasadokterbedah.norecpp,jasadokterbedah.objectdetailjenisprodukfk,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                  jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE  jasadokterbedah.noregistrasi = $noregistrasi and jasadokterbedah.produkfk=$produkfk and tglpelayanan='$tglpelayanan' and jasadokterbedah.tarifrs>0 and jasadokterbedah.objectruanganfk in  (44,277)"
                )
            );
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                                if ($itm->objectbahanprodukfk == 1) {
                                    if ($itm->objectpajakpegawai == 1) {
                                        $itm->tarifrs = 18000;
                                        $bruto = 18000;
                                    } else {
                                        $itm->tarifrs = 16000;
                                        $bruto = 16000;
                                    }
                                }
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = $bruto;
                            }
                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;

                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->save();
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updatetindakanjasa(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $pegawaifk =  $request['pegawaifk'];
        $produkfkawal = $request['produkfkawal'];
        $produkfkupdate = $request['produkfkupdate'];
        $tglawal = $request['tglawal'];
        $tglakhir = $request['tglakhir'];

        ini_set('max_execution_time', 500); //6 minutes



        try {
            //non bedah                       
            // $data = DB::select(
            //     DB::raw(
            //         "select distinct produkfk,kelasfk,tglverif from jasapelayanan_t where tglverif between 
            //         $tglawal and $tglakhir and produkfk=$produkfkawal and idpetugas=$pegawaifk order by tglverif desc"
            //     )
            // );

            $data = DB::select(
                DB::raw(
                    "select distinct produkfk,kelasfk from jasapelayanan_t where tglverif between 
                    '$tglawal' and '$tglakhir' and produkfk=$produkfkawal and idpetugas=$pegawaifk "
                )
            );

            foreach ($data as $itm) {
                $datax = DB::select(
                    DB::raw(
                        "select * from harganettoprodukbykelasd_m where objectprodukfk=$produkfkupdate and objectkelasfk=$itm->kelasfk "
                    )
                );
                if (count($datax) <= 0) {
                    $transMessage = "Silahkan Periksa Tindakan yang akan di update cek kelasnya";
                    $result = array(
                        "status" => 400,
                        "by" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }
            DB::insert("insert into jasapelayanan_t_updatetindakan  select * from jasapelayanan_t where tglverif between 
                '$tglawal' and '$tglakhir' and produkfk=$produkfkawal and idpetugas=$pegawaifk");

            $data2 = DB::select(
                DB::raw(
                    "select distinct  j.idpetugas,j.produkfk,j.petugasverif,j.noregistrasi,j.ruanganfk,j.tglpelayanan,j.tglverif,j.jumlah,j.kelasfk,j.objectpajakfk,j.norecpp,j.objectjenispetugaspefk,j.objectpajakfk,golonganpajakpegawai_m.nilaigolongan ,pasiendaftar_t.objectkelompokpasienlastfk FROM   jasapelayanan_t AS j INNER JOIN
                    golonganpajakpegawai_m ON j.objectpajakfk = golonganpajakpegawai_m.id INNER JOIN
                    pasiendaftar_t ON j.noregistrasi = pasiendaftar_t.noregistrasi where j.tglverif between 
                    '$tglawal' and '$tglakhir' and j.produkfk=$produkfkawal and j.idpetugas=$pegawaifk order by tglverif desc"
                )
            );

            foreach ($data2 as $itm) {
                $datax = DB::select(
                    DB::raw(
                        "select harganettoprodukbykelasd_m.* , produk_m.objectdetailjenisprodukfk ,produk_m.namaproduk FROM   harganettoprodukbykelasd_m INNER JOIN
                        produk_m ON harganettoprodukbykelasd_m.objectprodukfk = produk_m.id where objectprodukfk=$produkfkupdate and objectkelasfk=$itm->kelasfk "
                    )
                );
                $datax2 = DB::select(
                    DB::raw(
                        "select harganettoprodukbykelas_m.harganetto1 FROM   harganettoprodukbykelas_m where objectprodukfk=$produkfkupdate and objectkelasfk=$itm->kelasfk "
                    )
                );
                foreach ($datax2 as $itmx) {
                    $tarifrs = $itmx->harganetto1;
                }
                foreach ($datax as $itmx) {
                    $persenpph = 0;
                    $persenpph = $itm->nilaigolongan;
                    $bruto = $itm->jumlah * round($itmx->harganetto1, 0);
                    if ($itmx->objectdetailjenisprodukfk == '2016') {
                        if ($itmx->objectkomponenhargafk !== '98' || $itmx->objectkomponenhargafk !== '100' || $itmx->objectkomponenhargafk !== '25') {
                            if ($itm->objectkelompokpasienlastfk == 2) {
                                if ($itm->id != 1) {
                                    $pengali = 0.8;
                                } else {
                                    $pengali = 0.9;
                                }
                            } else {
                                $pengali = 0.8;
                            }
                            if ($itmx->objectkomponenhargafk !== '98' || $itmx->objectkomponenhargafk !== '100' || $itmx->objectkomponenhargafk !== '25') {
                                if (stripos($itmx->namaproduk, 'PEMERIKSAAN') !== false) {
                                    if ($itmx->objectkomponenhargafk == 94) {
                                        $tarifrs = $bruto;
                                        $bruto = ($itm->jumlah * $bruto) * $pengali;
                                    } else {
                                        $tarifrs = $bruto;
                                        $bruto = ($itm->jumlah * $bruto);
                                    }
                                }
                                if (stripos($itmx->namaproduk, 'KONSUL') !== false) {
                                    if ($itmx->objectkomponenhargafk == 94) {
                                        $tarifrs = $bruto;
                                        $bruto = ($itm->jumlah * $bruto) * $pengali;
                                        if ($itm->objectbahanprodukfk == 1) {

                                            $itm->tarifrs = $tarifrs;
                                            $bruto = $bruto;
                                        }
                                    } else {
                                        $itm->tarifrs = $bruto;
                                        $bruto = ($itm->jumlah * $bruto);
                                    }
                                }
                                if (stripos($itmx->namaproduk, 'PENDAFTARAN') !== false) {
                                    $tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                }
                            }
                        }
                    } elseif ($itmx->objectdetailjenisprodukfk == '2143' || $itmx->objectdetailjenisprodukfk == '2142' || $itmx->objectdetailjenisprodukfk == '118') {
                        $bruto = $itm->jumlah * 50000;
                    }
                    if ($itm->ruanganfk == '44') {

                        $itm->tarifrs = $itmx->harganetto1;
                        if (stripos($itm->namakelas, 'vip') !== false) {
                            $bruto = ($itm->jumlah * $tarifrs) * 0.9;
                        } else {
                            $bruto = ($itm->jumlah *  $tarifrs) * 0.8;
                        }
                    }

                    $pph = $bruto * $persenpph / 100;
                    $netto = $bruto - $pph;

                    $jaspel = new JasaPelayananDokter();
                    $norecjaspel = $jaspel->generateNewId();
                    $jaspel->norec = $norecjaspel;
                    $jaspel->idpetugas = $itm->idpetugas;
                    $jaspel->produkfk = $produkfkupdate;
                    $jaspel->tarif = $tarifrs * $itm->jumlah;
                    $jaspel->jeniskomponen = $itmx->objectkomponenhargafk;
                    $jaspel->bruto = $bruto;
                    $jaspel->pph = $pph;
                    $jaspel->netto = $netto;
                    $jaspel->petugasverif = $itm->petugasverif;
                    $jaspel->noregistrasi = $itm->noregistrasi;
                    $jaspel->ruanganfk = $itm->ruanganfk;
                    $jaspel->tglpelayanan = $itm->tglpelayanan;
                    // $jaspel->tglverif = $itm->tglpelayanan;
                    $jaspel->tglverif =  $itm->tglverif;
                    $jaspel->jumlah = (float)$itm->jumlah;
                    $jaspel->kelasfk = $itm->kelasfk;
                    $jaspel->norecpp = $itm->norecpp;
                    $jaspel->norecppd = 'updatetindakan';
                    $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                    $jaspel->objectpajakfk = $itm->objectpajakfk;
                    $jaspel->save();
                }
            }

            DB::delete("delete from jasapelayanan_t where tglverif between 
            '$tglawal' and '$tglakhir' and produkfk=$produkfkawal and idpetugas=$pegawaifk");

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveJasaPelayananNewSatuanKeuangan(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        $produkfk = $request['produkfk'];
        $tglpelayanan = $request['tglpelayanan'];

        ini_set('max_execution_time', 500); //6 minutes



        try {
            //non bedah                       
            $data = DB::select(
                DB::raw(
                    "select jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk,jasadokter.objectjenispetugaspefk, jasadokter.objectruanganfk, jasadokter.norecpp,jasadokter.objectdetailjenisprodukfk,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                  jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE jasadokter.noregistrasi = $noregistrasi and jasadokter.produkfk=$produkfk and tglpelayanan='$tglpelayanan' and jasadokter.tarifrs>0 and jasadokter.hargajual>0 and jasadokter.objectruanganfk not in (44,277)"
                )
            );
            $datax = DB::select(
                DB::raw(
                    "select tglclosing from pasiendaftar_t WHERE  noregistrasi = $noregistrasi"
                )
            );
            // $tglclosing = date('Y-m-d H:i:s');
            // $tglclosing = $request['tglclosing'];

            if (!empty($datax)) {
                foreach ($datax as $itmx) {
                    $tglclosing = $itmx->tglclosing;
                }
            }


            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    // if($itm->produkfk == '4056952'){
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }
                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                    if ($itm->objectbahanprodukfk == 1) {

                                        $itm->tarifrs = $itm->tarifrs;
                                        $bruto = $bruto;
                                    }
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }
                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah *  $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;

                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->save();
            }

            //bedah
            $data = DB::select(
                DB::raw(
                    "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal,jasadokterbedah.objectjenispetugaspefk, jasadokterbedah.objectruanganfk, jasadokterbedah.norecpp,jasadokterbedah.objectdetailjenisprodukfk,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                  jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE  jasadokterbedah.noregistrasi = $noregistrasi and jasadokterbedah.produkfk=$produkfk and tglpelayanan='$tglpelayanan' and jasadokterbedah.tarifrs>0 and jasadokterbedah.objectruanganfk in  (44,277)"
                )
            );
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                $itm->tarifrs = $bruto;

                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                                if ($itm->objectbahanprodukfk == 1) {
                                    $itm->tarifrs = $itm->tarifrs;
                                    $bruto = $bruto;
                                }
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = $bruto;
                            }
                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;

                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->save();
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    // public function saveJasaPelayananNewSatuanubah(Request $request) {
    //     //TODO : SAVE PAGU
    //     DB::beginTransaction();
    //     $dataReq = $request->all();
    //     $noregistrasi =  $request['noregistrasi'];
    //     $produkfk = $request['produkfk'];
    //     $tglpelayanan = $request['tglpelayanan'];
    //     $norecpp = $request['norecpp'];
    //     $kelasfk= $request['kelasfk'];
    //     $jumlah = $request['jumlah'];
    //     $kelompokasienlast = $request['kelompokpasien']
    //     ini_set('max_execution_time', 500); //6 minutes



    //     try{ 
    //         //non bedah
    //         $dataawal = DB::select(DB::raw("select * from jasapelayanan_t where norecpp = $norecpp"))
    //         foreach ($dataa as $itmx) {
    //              $nocm = $itmx->nocm; 
    //              $idpetugas = $itmx->idpetugas;
    //              $norecpp = $itmx->norecpp;
    //              $norecppd = $itmx->norecppd   
    //                                   # code...
    //         }
    //         $SCSC = JasaPelayananDokter::where('norecpp',$norecpp)
    //             ->delete();


    //         $datax = DB::select(DB::raw(
    //             "select tglclosing from pasiendaftar_t WHERE  noregistrasi = $noregistrasi")
    //             );

    //         if(!empty($datax)){
    //             foreach ($datax as $itmx){
    //                 $tglclosing = $itmx->tglclosing;
    //             }                
    //         }

    //        $datanilaigoglonga = DB::select(DB::raw("select golonganpajakpegawai_m.nilaigolongan,golonganpajakpegawai_m.id FROM pegawai_m INNER JOIN
    //                      golonganpajakpegawai_m ON pegawai_m.objectpajakpegawai = golonganpajakpegawai_m.id where pegawai_m.id = $idpetugas"))

    //         if(!empty($datanilaigoglonga)){
    //             foreach ($datanilaigoglonga as $itmx2){
    //                 $nilaigolongan = $itmx2->nilaigolongan;
    //                 $golonganfk = $itmx->id;
    //             }                
    //         }

    //        $tarifrsx = DB::select(DB::raw("select objectprodukfk,harganetto2,objectkelasfk from harganettoprodukbykelas_m where objectprodukfk = $produkfk and objectkelasfk=$kelasfk"))

    //         if(!empty($tarifrsx)){
    //             foreach ($tarifrsx as $itmx3){
    //                 $tarifrs = $itmx3->harganetto2;
    //             }                
    //         }


    //         $data = DB::select(DB::raw(
    //             "select harganettoprodukbykelasd_m.objectprodukfk,produk_m.objectbahanprodukfk,  produk_m.namaproduk,produk_m.objectdetailjenisprodukfk, harganettoprodukbykelasd_m.hargasatuan as harganetto,harganettoprodukbykelasd_m.objectkomponenhargafk as komponenhargafk FROM harganettoprodukbykelasd_m INNER JOIN produk_m ON harganettoprodukbykelasd_m.objectprodukfk = produk_m.id where harganettoprodukbykelasd_m.objectprodukfk = $produkfk and objectkelasfk=$kelasfk order by objectprodukfk")
    //         );


    //         foreach ($data as $itm){
    //            $persenpph =0;
    //            $persenpph = $nilaigolongan;
    //            $bruto = $jumlah * round($itm->harganetto,0);
    //             if ($itm->objectdetailjenisprodukfk == '2016'){
    //                 // if($itm->produkfk == '4056952'){
    //                 if($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25'){
    //                     if($kelompokasienlast == 2){
    //                         $pengali = 0.9;   
    //                     }else{
    //                         $pengali = 0.8;
    //                     }
    //                     if($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25'){
    //                         if(stripos($itm->namaproduk, 'PEMERIKSAAN') !== false ){
    //                            $itm->tarifrs = $bruto;
    //                             $bruto = ($jumlah * $bruto) * $pengali;
    //                         }
    //                         if(stripos($itm->namaproduk, 'KONSUL') !== false ){
    //                            $tarifrs = $bruto;
    //                             $bruto = ($jumlah * $bruto) * $pengali;
    //                             if($itm->objectbahanprodukfk == 1){
    //                                 if($golonganfk  == 1){
    //                                     $tarifrs = 18000;
    //                                     $bruto = 18000;
    //                                 }else{
    //                                     $tarifrs = 16000;
    //                                     $bruto = 16000;
    //                                 }
    //                             }
    //                         }
    //                         if(stripos($itm->namaproduk, 'PENDAFTARAN') !== false ){
    //                            $tarifrs = $bruto;
    //                             $bruto = ($jumlah * $bruto) * $pengali;
    //                         } 
    //                     } 
    //                 }

    //             }elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118' ) {
    //                 $bruto = $jumlah * 50000;
    //             }

    //             if($itm->objectruanganfk == '44'){

    //                 $tarifrs = $itm->harganetto;
    //                 if(stripos($kelasfk, 'vip') !== false ){
    //                     $bruto = ($jumlah * $tarifrs) * 0.9;                        
    //                 }else{
    //                     $bruto = ($jumlah *  $tarifrs) * 0.8;
    //                 }
    //                 // return($bruto);
    //                 // die();
    //             }
    //            //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

    //            // $bruto = $itm->tarif * $persenbruto /100;
    //            if($itm->namaexternal == "dl"){
    //                 $bruto=$tarifrs* $jumlah;
    //            }
    //            $pph = $bruto * $persenpph /100;
    //            $netto = $bruto - $pph;

    //            $jaspel = new JasaPelayananDokter();
    //            $norecjaspel = $jaspel->generateNewId();
    //            $jaspel->norec = $norecjaspel;
    //            $jaspel->idpetugas = $itm->objectpegawaifk;               
    //            $jaspel->produkfk = $itm->produkfk;
    //            $jaspel->tarif = $itm->tarifrs* $itm->jumlah;
    //            $jaspel->jeniskomponen = $itm->komponenhargafk;
    //            $jaspel->bruto = $bruto;
    //            $jaspel->pph = $pph;
    //            $jaspel->netto = $netto;
    //            $jaspel->petugasverif= $request['pegawaiverif'];
    //            $jaspel->noregistrasi = $request['noregistrasi'];
    //            $jaspel->ruanganfk = $itm->objectruanganfk;
    //            $jaspel->tglpelayanan = $itm->tglpelayanan;
    //            // $jaspel->tglverif = $itm->tglpelayanan;
    //            $jaspel->tglverif =  $tglclosing;
    //            $jaspel->jumlah = (float)$itm->jumlah;
    //            $jaspel->kelasfk = $itm->idkelas;
    //            $jaspel->norecpp = $itm->norecpp;
    //            $jaspel->norecppd = $itm->norecppd;
    //            $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
    //            $jaspel->objectpajakfk = $itm->objectpajakpegawai;
    //            $jaspel->save();
    //         }

    //         //bedah
    //         $data = DB::select(DB::raw(
    //             "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal,jasadokterbedah.objectjenispetugaspefk, jasadokterbedah.objectruanganfk, jasadokterbedah.norecpp,jasadokterbedah.objectdetailjenisprodukfk,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
    //               jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
    //               case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
    //               golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
    //               WHERE  jasadokterbedah.noregistrasi = $noregistrasi and jasadokterbedah.produkfk=$produkfk and tglpelayanan='$tglpelayanan' and jasadokterbedah.tarifrs>0 and jasadokterbedah.objectruanganfk in  (44,277)")
    //             );
    //         foreach ($data as $itm){
    //            $persenpph =0;
    //            $persenpph = $itm->nilaigolongan;
    //            $bruto = $itm->jumlah * round($itm->harganetto,0);
    //             if ($itm->objectdetailjenisprodukfk == '2016'){
    //                 if($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25'){
    //                     if($itm->objectkelompokpasienlastfk == 2){
    //                         $pengali = 0.9;   
    //                     }else{
    //                         $pengali = 0.8;
    //                     }
    //                     if($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25'){
    //                         if(stripos($itm->namaproduk, 'PEMERIKSAAN') !== false ){
    //                            $itm->tarifrs = $bruto;
    //                             $bruto = ($itm->jumlah * $bruto) * $pengali;
    //                         }
    //                         if(stripos($itm->namaproduk, 'KONSUL') !== false ){
    //                            $itm->tarifrs = $bruto;
    //                             $bruto = ($itm->jumlah * $bruto) * $pengali;
    //                             if($itm->objectbahanprodukfk == 1){
    //                                 if($itm->objectpajakpegawai == 1){
    //                                     $itm->tarifrs = 18000;
    //                                     $bruto = 18000;
    //                                 }else{
    //                                     $itm->tarifrs = 16000;
    //                                     $bruto = 16000;
    //                                 }
    //                             }
    //                         }
    //                         if(stripos($itm->namaproduk, 'PENDAFTARAN') !== false ){
    //                            $itm->tarifrs = $bruto;
    //                             $bruto = ($itm->jumlah * $bruto) * $pengali;
    //                         } 
    //                     } 
    //                 }
    //             }elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118' ) {
    //                 $bruto = $itm->jumlah * 50000;
    //             }
    //             if($itm->objectruanganfk == '44'){

    //                 $itm->tarifrs = $itm->harganetto;
    //                 if(stripos($itm->namakelas, 'vip') !== false ){
    //                     $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;                        
    //                 }else{
    //                     $bruto = ($itm->jumlah * $itm->tarifrs) * 0.8;
    //                 }
    //                 // return($bruto);
    //                 // die();
    //             }
    //            //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

    //            // $bruto = $itm->tarif * $persenbruto /100;
    //            if($itm->namaexternal == "dl"){
    //                 $bruto=$itm->tarifrs* $itm->jumlah;
    //            }
    //            $pph = $bruto * $persenpph /100;
    //            $netto = $bruto - $pph;

    //            $jaspel = new JasaPelayananDokter();
    //            $norecjaspel = $jaspel->generateNewId();
    //            $jaspel->norec = $norecjaspel;
    //            $jaspel->idpetugas = $itm->objectpegawaifk;               
    //            $jaspel->produkfk = $itm->produkfk;
    //            $jaspel->tarif = $itm->tarifrs* $itm->jumlah;
    //            $jaspel->jeniskomponen = $itm->komponenhargafk;
    //            $jaspel->bruto = $bruto;
    //            $jaspel->pph = $pph;
    //            $jaspel->netto = $netto;
    //            $jaspel->petugasverif= $request['pegawaiverif'];
    //            $jaspel->noregistrasi = $request['noregistrasi'];
    //            $jaspel->ruanganfk = $itm->objectruanganfk;
    //            $jaspel->tglpelayanan = $itm->tglpelayanan;
    //            // $jaspel->tglverif = $itm->tglpelayanan;
    //            $jaspel->tglverif =  $tglclosing;
    //            $jaspel->jumlah = (float)$itm->jumlah;
    //            $jaspel->kelasfk = $itm->idkelas;
    //            $jaspel->norecpp = $itm->norecpp;
    //            $jaspel->norecppd = $itm->norecppd;
    //            $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
    //            $jaspel->objectpajakfk = $itm->objectpajakpegawai;
    //            $jaspel->save();
    //         }


    //         $transStatus = 'true';
    //     } catch (\Exception $e) {
    //         $transStatus = 'false';
    //     }
    //     $transMessage = "Remunerasi";

    //     if ($transStatus == 'true') {
    //         $transMessage = $transMessage . " Berhasil";
    //         DB::commit();
    //         $result = array(
    //             "status" => 201,
    //             "by" => 'as@epic',
    //         );
    //     } else {
    //         $transMessage = $transMessage . " Gagal!!";
    //         DB::rollBack();
    //         $result = array(
    //             "status" => 400,
    //             "by" => 'as@epic',
    //         );
    //     }
    //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    // }
    public function saveTindakan(Request $request)
    {

        //TODO : SAVE TINDAKAN
        DB::beginTransaction();

        // try{

        $antrian = AntrianPasienDiperiksa::where('norec', $request['pelayananpasien'][0]['noregistrasifk'])
            ->update([
                'ispelayananpasien' => true
            ]);
        $totalJasa = 0;
        $totJasa = 0;
        $penjumlahanJasa = 0;
        $penjumlahanJasaTuslah = 0;
        foreach ($request['pelayananpasien'] as $item) {
            $totJasa = 0;
            $totalJasa = 0;
            $penjumlahanJasa = 0;
            $penjumlahanJasaTuslah = 0;
            //            return $this->respond($item);
            $PelPasien = new PelayananPasien();
            $PelPasien->norec = $PelPasien->generateNewId();
            $PelPasien->kdprofile = 0;
            $PelPasien->statusenabled = true;
            //        $noRegistrasi = $this->generateCode(new PasienDaftar(), 'noregistrasi', 10, $this->getDateTime()->format('ym'));
            $PelPasien->noregistrasifk =  $item['noregistrasifk'];
            $PelPasien->tglregistrasi = $item['tglregistrasi'];
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
            if (isset($item['keterangan'])) {
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

            if (isset($item['isparamedis'])) {
                $PelPasien->isparamedis =  $item['isparamedis'];
            }
            if (isset($item['jenispelayananfk'])) {
                $PelPasien->jenispelayananfk =  $item['jenispelayananfk'];
            }
            $PelPasien->objectpegawaipengirimfk =  $item['idpengirim'];


            $PelPasien->save();
            $PPnorec = $PelPasien->norec;

            $new_PPP = $item['pelayananpetugas'];
            foreach ($new_PPP as $itemPPP) {
                $detailItemPPP = $itemPPP['listpegawai'];
                foreach ($detailItemPPP as $detailItemPPPz) {
                    $PelPasienPetugas = new PelayananPasienPetugas();
                    $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                    $PelPasienPetugas->kdprofile = 0;
                    $PelPasienPetugas->statusenabled = true;
                    $PelPasienPetugas->nomasukfk = $item['noregistrasifk'];
                    $PelPasienPetugas->objectjenispetugaspefk = $itemPPP['objectjenispetugaspefk'];
                    //            $PelPasienPetugas->objectasalprodukfk = $itemPPP['objectasalprodukfk'];
                    if ($detailItemPPPz == 'undefined') {
                        $PelPasienPetugas->objectpegawaifk = null;
                    } else {

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
            $dataTuslah = SettingDataFixed::where('id', 1222)->get();
            //END TARIFF UP TUSLAH
            foreach ($item['komponenharga'] as $itemKomponen) {
                $PelPasienDetail = new PelayananPasienDetail();
                $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                $PelPasienDetail->kdprofile = 0;
                $PelPasienDetail->statusenabled = false;
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
                if ($itemKomponen['iscito'] == "1") {
                    //                        return $this->respond($item['nilaicito']);
                    if ($dataTuslah[0]->nilaifield > 0) {
                        $penjumlahanJasa = ($itemKomponen['hargasatuan'] - $item['diskon']) * $item['nilaicito']; //$New_PPP['jasa'];
                        $penjumlahanJasaTuslah =  (((float)$itemKomponen['hargasatuan'] * (int)$dataTuslah[0]->nilaifield) / 100);
                        $totalJasa = $totalJasa +  $penjumlahanJasa + $penjumlahanJasaTuslah;

                        $PelPasienDetail->jasa = $penjumlahanJasa + $penjumlahanJasaTuslah;
                    } else {
                        $penjumlahanJasa = ($itemKomponen['hargasatuan'] - $item['diskon']) * $item['nilaicito']; //$New_PPP['jasa'];
                        $PelPasienDetail->jasa = $penjumlahanJasa;
                        $totalJasa = $totalJasa +  $penjumlahanJasa;
                    }
                } else {
                    if ($dataTuslah[0]->nilaifield > 0) {
                        $penjumlahanJasaTuslah = ((float)$itemKomponen['hargasatuan'] * (int)$dataTuslah[0]->nilaifield) / 100;
                        $PelPasienDetail->jasa = $penjumlahanJasaTuslah;
                        $totalJasa = $totalJasa +  $penjumlahanJasaTuslah;
                    } else {
                        $penjumlahanJasa = 0;
                        $PelPasienDetail->jasa = $penjumlahanJasa;
                        $totalJasa = $totalJasa +  $penjumlahanJasa;
                    }
                }

                $PelPasienDetail->save();
                $PPDnorec = $PelPasienDetail->norec;
                $transStatus = 'true';
            }


            if ($item['iscito'] == 1) {
                $dataaa = PelayananPasienDetail::where('pelayananpasien', $PPnorec)->get();
                foreach ($dataaa as $itemss) {
                    $totJasa = $totJasa + $itemss->jasa;
                }
                $dataJasa = PelayananPasien::where('norec', $PPnorec)
                    ->update([
                        'jasa' => $totalJasa
                    ]);
            }


            if ($dataTuslah[0]->nilaifield > 0) {
                $dataJasa = PelayananPasien::where('norec', $PPnorec)
                    ->update([
                        'istuslah' => 1,
                        'jasa' => $totalJasa
                    ]);
            }

            if (isset($item['diskon'])) {
                if ($item['diskon'] != 0) {
                    $data = PelayananPasienDetail::where('pelayananpasien', $PPnorec)
                        ->where('komponenhargafk', 35)
                        ->update(
                            [
                                'hargadiscount' => $item['diskon']
                            ]
                        );

                    $data2 = PelayananPasien::where('norec', $PPnorec)
                        ->update(
                            [
                                'hargadiscount' => $item['diskon']
                            ]
                        );
                }
            }
        }


        //     $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = "simpan PelPasien";
        // }

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

    public function ubahrekanan(Request $request)
    {
        $noregistrasi =  $request['noregistrasi'];
        try {
            $SCSC = Pasiendaftar::where('noregistrasi', '=', $noregistrasi)
                ->update([
                    'objectrekananfk' => $request['rekanan'],
                    'objectkelompokpasienlastfk' => $request['kelompokpasien']
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Update Rekanan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updatetglverif(Request $request)
    {
        $noregistrasi =  $request['noregistrasi'];
        $norecpp = $request['norecpp'];
        $tglverif = $request['tglverif'];
        try {
            $SCSC = JasaPelayananDokter::where('noregistrasi', '=', $noregistrasi)
                ->where('norecpp', '=', $norecpp)
                ->update([
                    'tglverif' => $tglverif,
                    'status' => 1
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Update Tanggal Verifikasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updatediskon(Request $request)
    {
        // $noregistrasi=  $request['noregistrasi'];
        $norecpp = $request['norecpp'];
        $diskon = $request['diskon'];
        try {
            $SCSC = PelayananPasien::where('norec', '=', $norecpp)
                // ->where('norecpp','=',$norecpp)
                ->update([
                    'diskontagihan' => $diskon,
                    // 'status' =>1
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Update Diskon Tagihan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updatediskonptt(Request $request)
    {
        // $noregistrasi=  $request['noregistrasi'];
        $noregistrasi = $request['noregistrasi'];
        $diskon = $request['diskon'] / 100;
        try {

            DB::beginTransaction();
            $SCSC = JasaPelayananDokter::where('noregistrasi', '=', $noregistrasi)
                ->get();
            foreach ($SCSC as $item) {
                if ($item->diskonpersen != NULL) {
                    $transMessage = "Persen sudah diisi " . $item->diskonpersen . "% Silahkan unverif terus Verifikasi lagi untuk ubah diiskon!!";
                    // DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "by" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
                $bruto = $item->bruto * $diskon;
                $pph = $item->pph * $diskon;
                $netto = $item->netto * $diskon;
                $SCSC = JasaPelayananDokter::where('norec', '=', $item->norec)
                    // ->where('norecpp','=',$norecpp)
                    ->update([
                        'bruto' => $bruto,
                        'pph' => $pph,
                        'netto' => $netto,
                        'diskonpersen' => $request['diskon']
                        // 'status' =>1
                    ]);
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Update Diskon Tagihan";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewLoop(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        ini_set('max_execution_time', 500); //6 minutes

        $peg = \DB::table('jasapelayanan_t')
            ->where('noregistrasi',  $noregistrasi)
            ->get();

        foreach ($peg as $x) {
            return ("Data Sudah Pernah DI Verifikasi");
            # code...
        }

        try {
            //non bedah                       
            $data = DB::select(
                DB::raw(
                    "select golonganpajakpegawai_m.id, jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk,jasadokter.objectjenispetugaspefk, jasadokter.objectruanganfk, jasadokter.norecpp,jasadokter.objectdetailjenisprodukfk,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                  jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE (jasadokter.noregistrasi = $noregistrasi)and jasadokter.tarifrs>0 and jasadokter.hargajual>0 and jasadokter.objectruanganfk not in (44,277)"
                )
            );
            $datax = DB::select(
                DB::raw(
                    "select pasiendaftar_t.nosbmlastfk, cast(strukbuktipenerimaan_t.tglsbm as datetime) as tglsbm FROM pasiendaftar_t INNER JOIN strukbuktipenerimaan_t ON pasiendaftar_t.nosbmlastfk = strukbuktipenerimaan_t.norec WHERE  pasiendaftar_t.noregistrasi = $noregistrasi"
                )
            );
            // $tglclosing = date('Y-m-d H:i:s');
            $tglclosing = $request['tglclosing'];
            $tglnk = $request['tglnk'];
            // if(!empty($datax)){
            //     foreach ($datax as $itmx){
            //         $tglclosing = $itmx->tglsbm;
            //     }                
            // }
            $datax2 = DB::select(
                DB::raw(
                    "select isclosing from pasiendaftar_t WHERE  pasiendaftar_t.noregistrasi = $noregistrasi"
                )
            );
            if (!empty($datax2)) {
                if ($tglclosing != null) {
                    $SCSC = Pasiendaftar::where('noregistrasi', '=', $noregistrasi)
                        ->update([
                            'isclosing' => 1,
                            'tglclosing' => $tglclosing,
                            'tanggalnk' => $tglnk
                        ]);
                }
            }
            $berkasrs = false;
            $istrueberkasrs = NULL;
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    // if($itm->produkfk == '4056952'){
                    if ($itm->objectkelompokpasienlastfk == 2) {
                        if ($itm->id != 1) {
                            $pengali = 0.8;
                        } else {
                            $pengali = 0.9;
                        }
                    } else {
                        $pengali = 0.8;
                    }
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto);
                            }
                        }

                        if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                                $istrueberkasrs = NULL;

                                if ($itm->objectbahanprodukfk == 1) {
                                    $berkasrs = true;
                                    $kodetindakankonsul = $itm->produkfk;
                                    $namatindakankonsul = $itm->namaruangan;
                                    $ruangankoknsul = $itm->objectruanganfk;
                                    if ($itm->objectpajakpegawai == 1) {
                                        $itm->tarifrs = 18000;
                                        $bruto = 18000;
                                    } else {
                                        $itm->tarifrs = 16000;
                                        $bruto = 16000;
                                    }
                                    $istrueberkasrs = 1;
                                }
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto);
                                if ($itm->objectbahanprodukfk == 1) {
                                    $istrueberkasrs = 1;
                                }
                            }
                        }
                        if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = $bruto;
                            }
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah *  $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                if ($tglclosing  == "") {
                    $tglclosing =  $itm->tglpelayanan;
                }
                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->isberkasrs = $istrueberkasrs;
                $jaspel->save();

                $istrueberkasrs = NULL;
            }
            if ($berkasrs == true) {
                if (stripos($namatindakankonsul, 'Eksekutif') == false) {
                    $SCSC = JasaPelayananDokter::where('noregistrasi', $request['noregistrasi'])
                        ->where('produkfk', '!=', $kodetindakankonsul)
                        ->where('ruanganfk', $ruangankoknsul)
                        ->delete();
                }
            }

            //bedah
            $data = DB::select(
                DB::raw(
                    "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal, jasadokterbedah.objectjenispetugaspefk, jasadokterbedah.objectruanganfk, jasadokterbedah.norecpp,jasadokterbedah.objectdetailjenisprodukfk,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                  jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE (jasadokterbedah.noregistrasi = $noregistrasi)and jasadokterbedah.tarifrs>0 and jasadokterbedah.objectruanganfk in  (44,277)"
                )
            );
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {

                    if ($itm->objectkelompokpasienlastfk == 2) {
                        if ($itm->id != 1) {
                            $pengali = 0.8;
                        } else {
                            $pengali = 0.9;
                        }
                    } else {
                        $pengali = 0.8;
                    }
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                        if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                            if ($itm->objectbahanprodukfk == 1) {
                                if ($itm->objectpajakpegawai == 1) {
                                    $itm->tarifrs = 18000;
                                    $bruto = 18000;
                                } else {
                                    $itm->tarifrs = 16000;
                                    $bruto = 16000;
                                }
                            }
                        } else {
                            $itm->tarifrs = $bruto;
                            $bruto = $bruto;
                        }
                        if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                if ($tglclosing  == "") {
                    $tglclosing =  $itm->tglpelayanan;
                }
                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->save();
            }

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 0;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'VERIFIKASI JASA';
            $logUser->noreff = $request['noregistrasi'];
            $logUser->referensi = 'noregistrasi';
            $logUser->objectloginuserfk =  $request['pegawaiverif'];
            $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            $logUser->keterangan = 'VERIFIKASI JASA';
            $logUser->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewLoop2(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        ini_set('max_execution_time', 500); //6 minutes

        // $peg = \DB::table('jasapelayanan_t')
        //     ->where('noregistrasi',  $noregistrasi)
        //     ->get();

        // foreach ($peg as $x) {
        //     return("Data Sudah Pernah DI Verifikasi");
        //     # code...
        // }

        $SCSC = JasaPelayananDokter::where('noregistrasi', $noregistrasi)
            ->delete();
        try {
            //non bedah                       
            $data = DB::select(
                DB::raw(
                    "select jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk,jasadokter.objectjenispetugaspefk, jasadokter.objectruanganfk, jasadokter.norecpp,jasadokter.objectdetailjenisprodukfk,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                  jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE (jasadokter.noregistrasi = $noregistrasi)and jasadokter.tarifrs>0 and jasadokter.hargajual>0 and jasadokter.objectruanganfk not in (44,277)"
                )
            );
            $datax = DB::select(
                DB::raw(
                    "select pasiendaftar_t.nosbmlastfk, cast(strukbuktipenerimaan_t.tglsbm as datetime) as tglsbm FROM pasiendaftar_t INNER JOIN strukbuktipenerimaan_t ON pasiendaftar_t.nosbmlastfk = strukbuktipenerimaan_t.norec WHERE  pasiendaftar_t.noregistrasi = $noregistrasi"
                )
            );
            // $tglclosing = date('Y-m-d H:i:s');
            $tglclosing = $request['tglclosing'];
            $tglnk = $request['tglnk'];
            // if(!empty($datax)){
            //     foreach ($datax as $itmx){
            //         $tglclosing = $itmx->tglsbm;
            //     }                
            // }
            $datax2 = DB::select(
                DB::raw(
                    "select isclosing from pasiendaftar_t WHERE  pasiendaftar_t.noregistrasi = $noregistrasi"
                )
            );
            if (!empty($datax2)) {
                if ($tglclosing != null) {
                    $SCSC = Pasiendaftar::where('noregistrasi', '=', $noregistrasi)
                        ->update([
                            'isclosing' => 1,
                            'tglclosing' => $tglclosing,
                            'tanggalnk' => $tglnk
                        ]);
                }
            }
            $berkasrs = false;
            $istrueberkasrs = NULL;
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    // if($itm->produkfk == '4056952'){
                    if ($itm->objectkelompokpasienlastfk == 2) {
                        if ($itm->id != 1) {
                            $pengali = 0.8;
                        } else {
                            $pengali = 0.9;
                        }
                    } else {
                        $pengali = 0.8;
                    }
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto);
                            }
                        }

                        if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;


                                if ($itm->objectbahanprodukfk == 1) {
                                    $berkasrs = true;
                                    $kodetindakankonsul = $itm->produkfk;
                                    $namatindakankonsul = $itm->namaruangan;
                                    $ruangankoknsul = $itm->objectruanganfk;
                                    if ($itm->objectpajakpegawai == 1) {
                                        $itm->tarifrs = 18000;
                                        $bruto = 18000;
                                    } else {
                                        $itm->tarifrs = 16000;
                                        $bruto = 16000;
                                    }
                                    $istrueberkasrs = 1;
                                }
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto);
                                if ($itm->objectbahanprodukfk == 1) {
                                    $istrueberkasrs = 1;
                                }
                            }
                        }
                        if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = $bruto;
                            }
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah *  $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                if ($tglclosing  == "") {
                    $tglclosing =  $itm->tglpelayanan;
                }
                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->isberkasrs = $istrueberkasrs;
                $jaspel->save();

                $istrueberkasrs = NULL;
            }
            if ($berkasrs == true) {
                if (stripos($namatindakankonsul, 'Eksekutif') == false) {
                    $SCSC = JasaPelayananDokter::where('noregistrasi', $request['noregistrasi'])
                        ->where('produkfk', '!=', $kodetindakankonsul)
                        ->where('ruanganfk', $ruangankoknsul)
                        ->delete();
                }
            }

            //bedah
            $data = DB::select(
                DB::raw(
                    "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal, jasadokterbedah.objectjenispetugaspefk, jasadokterbedah.objectruanganfk, jasadokterbedah.norecpp,jasadokterbedah.objectdetailjenisprodukfk,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                  jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE (jasadokterbedah.noregistrasi = $noregistrasi)and jasadokterbedah.tarifrs>0 and jasadokterbedah.objectruanganfk in  (44,277)"
                )
            );
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->harganetto, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {

                    if ($itm->objectkelompokpasienlastfk == 2) {
                        if ($itm->id != 1) {
                            $pengali = 0.8;
                        } else {
                            $pengali = 0.9;
                        }
                    } else {
                        $pengali = 0.8;
                    }
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                        if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                            if ($itm->objectbahanprodukfk == 1) {
                                if ($itm->objectpajakpegawai == 1) {
                                    $itm->tarifrs = 18000;
                                    $bruto = 18000;
                                } else {
                                    $itm->tarifrs = 16000;
                                    $bruto = 16000;
                                }
                            }
                        } else {
                            $itm->tarifrs = $bruto;
                            $bruto = $bruto;
                        }
                        if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                if ($tglclosing  == "") {
                    $tglclosing =  $itm->tglpelayanan;
                }
                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->save();
            }

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 0;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'VERIFIKASI JASA';
            $logUser->noreff = $request['noregistrasi'];
            $logUser->referensi = 'noregistrasi';
            $logUser->objectloginuserfk =  $request['pegawaiverif'];
            $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            $logUser->keterangan = 'VERIFIKASI JASA';
            $logUser->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewLoopKeuangan(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        ini_set('max_execution_time', 500); //6 minutes

        $peg = \DB::table('jasapelayanan_t')
            ->where('noregistrasi',  $noregistrasi)
            ->get();

        foreach ($peg as $x) {
            return ("Data Sudah Pernah DI Verifikasi");
            # code...
        }

        try {
            //non bedah                       
            $data = DB::select(
                DB::raw(
                    "select golonganpajakpegawai_m.id,jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk,jasadokter.objectjenispetugaspefk, jasadokter.objectruanganfk, jasadokter.norecpp,jasadokter.objectdetailjenisprodukfk,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                  jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE (jasadokter.noregistrasi = $noregistrasi)and jasadokter.tarifrs>0 and jasadokter.hargajual>0 and jasadokter.objectruanganfk not in (44,277)"
                )
            );
            $datax = DB::select(
                DB::raw(
                    "select pasiendaftar_t.nosbmlastfk, cast(strukbuktipenerimaan_t.tglsbm as datetime) as tglsbm FROM pasiendaftar_t INNER JOIN strukbuktipenerimaan_t ON pasiendaftar_t.nosbmlastfk = strukbuktipenerimaan_t.norec WHERE  pasiendaftar_t.noregistrasi = $noregistrasi"
                )
            );
            // $tglclosing = date('Y-m-d H:i:s');
            $tglclosing = $request['tglclosing'];
            $tglnk = $request['tglnk'];
            // if (!empty($datax)) {
            //     foreach ($datax as $itmx) {
            //         $tglclosing = $itmx->tglsbm;
            //     }
            // }
            $datax2 = DB::select(
                DB::raw(
                    "select isclosing from pasiendaftar_t WHERE  pasiendaftar_t.noregistrasi = $noregistrasi"
                )
            );
            if (!empty($datax2)) {
                if ($tglclosing != null) {
                    $SCSC = Pasiendaftar::where('noregistrasi', '=', $noregistrasi)
                        ->update([
                            'isclosing' => 1,
                            'tglclosing' => $tglclosing,
                            'tanggalnk' => $tglnk
                        ]);
                }
            }
            $berkasrs = false;
            $istrueberkasrs = NULL;
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->hargajual, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {
                    // if($itm->produkfk == '4056952'){

                    $dataMapp = \DB::table('mapPelayananToJasa')
                        ->get();
                    foreach ($dataMapp  as $map) {
                        if ($map->produkfk == $itm->produkfk) {
                            $pengali = 0.8;
                        } else {
                            if ($itm->objectkelompokpasienlastfk == 2) {
                                if ($itm->id != 1) {
                                    $pengali = 0.8;
                                } else {
                                    $pengali = 0.9;
                                }
                            } else {
                                $pengali = 0.8;
                            }
                        }
                    }







                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto);
                            }
                        }

                        if (stripos($itm->namaproduk, 'KONSUL') !== false) {

                            // if($itm->komponenhargafk == 94 ){
                            //     $itm->tarifrs = $bruto;
                            //     $bruto = ($itm->jumlah * $bruto) * $pengali;
                            //     $istrueberkasrs = 1 ;

                            //     if($itm->objectbahanprodukfk == 1){
                            //         $berkasrs = true;
                            //         $kodetindakankonsul = $itm->produkfk;
                            //         $ruangankoknsul = $itm->objectruanganfk;
                            //         $itm->tarifrs =$itm->tarifrs ;
                            //         $bruto = $bruto;

                            //     }    
                            // }
                            // else{
                            //     $itm->tarifrs = $bruto;
                            //     $bruto = ($itm->jumlah * $bruto);
                            //     $istrueberkasrs = 1 ;
                            // }
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;


                                if ($itm->objectbahanprodukfk == 1) {
                                    $berkasrs = true;
                                    $kodetindakankonsul = $itm->produkfk;
                                    $ruangankoknsul = $itm->objectruanganfk;
                                    if ($itm->objectpajakpegawai == 1) {
                                        $itm->tarifrs = 18000;
                                        $bruto = 18000;
                                    } else {
                                        $itm->tarifrs = 16000;
                                        $bruto = 16000;
                                    }
                                    $istrueberkasrs = 1;
                                }
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto);
                                if ($itm->objectbahanprodukfk == 1) {
                                    $istrueberkasrs = 1;
                                }
                            }
                        }
                        if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                            if ($itm->komponenhargafk == 94) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            } else {
                                $itm->tarifrs = $bruto;
                                $bruto = $bruto;
                            }
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah *  $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                if ($tglclosing  == "") {
                    $tglclosing =  $itm->tglpelayanan;
                }
                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->isberkasrs = $istrueberkasrs;
                $jaspel->save();

                $istrueberkasrs = NULL;
            }
            //gara2 ini gak muncul si pemeriksaan dokter
            // if ($berkasrs == true) {
            //     $SCSC = JasaPelayananDokter::where('noregistrasi', $request['noregistrasi'])
            //         ->where('produkfk', '!=', $kodetindakankonsul)
            //         ->where('ruanganfk', $ruangankoknsul)
            //         ->delete();
            // }

            //bedah
            $data = DB::select(
                DB::raw(
                    "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal, jasadokterbedah.objectjenispetugaspefk, jasadokterbedah.objectruanganfk, jasadokterbedah.norecpp,jasadokterbedah.objectdetailjenisprodukfk,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                  jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                  case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                  golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                  WHERE (jasadokterbedah.noregistrasi = $noregistrasi)and jasadokterbedah.tarifrs>0 and jasadokterbedah.objectruanganfk in  (44,277)"
                )
            );
            foreach ($data as $itm) {
                $persenpph = 0;
                $persenpph = $itm->nilaigolongan;
                $bruto = $itm->jumlah * round($itm->hargajual, 0);
                if ($itm->objectdetailjenisprodukfk == '2016') {

                    $dataMapp = \DB::table('mapPelayananToJasa')
                        ->get();
                    foreach ($dataMapp  as $map) {
                        if ($map->produkfk == $itm->produkfk) {
                            $pengali = 0.8;
                        } else {

                            if ($itm->objectkelompokpasienlastfk == 2) {
                                $pengali = 0.9;
                            } else {
                                $pengali = 0.8;
                            }
                        }
                    }
                    if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                        if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                        if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        } else {
                            $itm->tarifrs = $bruto;
                            $bruto = $bruto;
                        }
                        if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                            $itm->tarifrs = $bruto;
                            $bruto = ($itm->jumlah * $bruto) * $pengali;
                        }
                    }
                } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                    $bruto = $itm->jumlah * 50000;
                }
                if ($itm->objectruanganfk == '44') {

                    $itm->tarifrs = $itm->harganetto;
                    if (stripos($itm->namakelas, 'vip') !== false) {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                    } else {
                        $bruto = ($itm->jumlah * $itm->tarifrs) * 0.8;
                    }
                    // return($bruto);
                    // die();
                }
                //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                // $bruto = $itm->tarif * $persenbruto /100;
                if ($itm->namaexternal == "dl") {
                    $bruto = $itm->tarifrs * $itm->jumlah;
                }
                $pph = $bruto * $persenpph / 100;
                $netto = $bruto - $pph;
                if ($tglclosing  == "") {
                    $tglclosing =  $itm->tglpelayanan;
                }
                $jaspel = new JasaPelayananDokter();
                $norecjaspel = $jaspel->generateNewId();
                $jaspel->norec = $norecjaspel;
                $jaspel->idpetugas = $itm->objectpegawaifk;
                $jaspel->produkfk = $itm->produkfk;
                $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                $jaspel->jeniskomponen = $itm->komponenhargafk;
                $jaspel->bruto = $bruto;
                $jaspel->pph = $pph;
                $jaspel->netto = $netto;
                $jaspel->petugasverif = $request['pegawaiverif'];
                $jaspel->noregistrasi = $request['noregistrasi'];
                $jaspel->ruanganfk = $itm->objectruanganfk;
                $jaspel->tglpelayanan = $itm->tglpelayanan;
                // $jaspel->tglverif = $itm->tglpelayanan;
                $jaspel->tglverif =  $tglclosing;
                $jaspel->jumlah = (float)$itm->jumlah;
                $jaspel->kelasfk = $itm->idkelas;
                $jaspel->norecpp = $itm->norecpp;
                $jaspel->norecppd = $itm->norecppd;
                $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                $jaspel->save();
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewLoopKeuangancopy(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $noregistrasi =  $request['noregistrasi'];
        ini_set('max_execution_time', 500); //6 minutes


        // try {
        $data = DB::select(
            DB::raw(
                "select * from jasapelayanan_t where noregistrasi = $noregistrasi"
            )
        );
        foreach ($data as $itm) {
            $jaspel = new JasaPelayananDokter();
            $norecjaspel = $jaspel->generateNewId();
            $jaspel->norec = $norecjaspel;
            $jaspel->idpetugas = $itm->idpetugas;
            $jaspel->produkfk = $itm->produkfk;
            $jaspel->tarif = $itm->tarif;
            $jaspel->jeniskomponen = $itm->jeniskomponen;
            $jaspel->bruto = $itm->bruto;
            $jaspel->pph = $itm->pph;
            $jaspel->netto = $itm->netto;
            $jaspel->petugasverif = $itm->petugasverif;
            $jaspel->noregistrasi = $itm->noregistrasi;
            $jaspel->ruanganfk = $itm->ruanganfk;
            $jaspel->tglpelayanan = $itm->tglpelayanan;
            // $jaspel->tglverif = $itm->tglpelayanan;
            $jaspel->tglverif =  $request['tglverif'];
            $jaspel->jumlah = (float)$itm->jumlah;
            $jaspel->kelasfk = $itm->kelasfk;
            $jaspel->norecpp = $itm->norecpp;
            $jaspel->norecppd = $itm->norecppd;
            $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
            $jaspel->objectpajakfk = $itm->objectpajakfk;
            $jaspel->isberkasrs = $itm->isberkasrs;
            $jaspel->save();
        }
        $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewLoopEclaim(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        ini_set('max_execution_time', 500); //6 minutes
        $brutoGet = "";
        $diskonpersen = $dataReq['persen'];
        // $tglverif = '';
        $tglverif = $request['tglverif'];
        try {

            $cekPasien = $data = DB::select(
                DB::raw("select * from pasiendaftar_t where noregistrasi = $noregistrasi and  tarifINACBLast is not null ")
            );

            if (!empty($cekPasien)) {

                $result = array(
                    $transMessage = "Data Telah Dihitung Sebelumnya",
                    "status" => 400,
                    "by" => 'all',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            if ($tglverif == '') {
                $datajasa = \DB::table('v_jasapelayanan')
                    ->where('noregistrasi',  $noregistrasi)
                    // ->where('namaproduk', 'OCT')
                    ->get();
            } else {
                $datajasa = \DB::table('v_jasapelayanan')
                    ->where('noregistrasi',  $noregistrasi)
                    // ->where('namaproduk', 'OCT')
                    ->where('tglverif', $tglverif)
                    ->get();
            }
            $potong = 'ya';
            $datajasax = \DB::table('v_jasapelayanan')
                ->where('noregistrasi',  $noregistrasi)
                ->select('namadepartemen')
                ->distinct()
                ->get();
            foreach ($datajasax as $x) {
                if ($x->namadepartemen == 'Instalasi Rawat Inap' && $request['isRajal'] == "T") {
                    $potong = 'tidak';
                }
            }
            if (empty($datajasa) || $datajasa == "") {
                // $massage=[];
                // $keterangan = "Data Belum Terverivikasi";
                $result = array(
                    $transMessage = "Data Belum Terverivikasi",
                    "status" => 400,
                    "by" => 'all',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            //  return($potong);
            //  die(); 
            foreach ($datajasa as $item) {
                
                $dataMapp = \DB::table('mapPelayananToJasa')
                    ->where('statusenabled', '=', 1)
                    ->get();
                foreach ($dataMapp  as $map) {
                    $diskonpersen = $dataReq['persen'];
                    $nilaigolonganP = \DB::table('golonganpajakpegawai_m')
                        ->where('id', '=', $item->objectpajakfk)
                        ->get();
                    $hargaPatokLah = 1000000;
                    $hargaPatokLahTake = 500000;

                    $dicari = "konsul";
                    $cov = "COV";
                    
                    //israjal = T

                    //pendaftaran full
                    if ($item->iddetailjenisproduk == '2016' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {
                  
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        //akomodasi rawatinap full
                    } else if ($item->iddetailjenisproduk == '476') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        //visite ruagn vip
                    } else if ($item->iddetailjenisproduk == '481' && $item->jeniskomponen === '94'  &&  $request['isRajal'] == "Y") {
                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {
                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {

                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {
                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$tarifGet * 0.9;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                        //visite    
                    } else if ($item->iddetailjenisproduk == '1433'  && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {
                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$tarifGet * 0.8;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                        //visite    
                    } else if ($item->iddetailjenisproduk == '1433'  && $item->jeniskomponen === '94' &&  $request['isRajal'] == "T") {
                        $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                        $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if (preg_match("/$dicari/i", $item->namaproduk)   && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {
                        if ((float)$dataReq['persen'] < 50) {
                            if ($item->kelasfk == 4 || $item->kelasfk == 8 || $item->kelasfk == 5) {
                                foreach ($nilaigolonganP as $hijiken) {
                                    if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                        $brutoGet =   (float)$hargaPatokLahTake * 0.9;
                                        $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                        $tarifGet = (float)$hargaPatokLahTake;
                                    } else {
                                        $tarifGet = (float)$item->tarif * 0.5;
                                        $brutoGet =  (float)$tarifGet * 0.9;
                                        $pphGet =  $brutoGet *  $hijiken->nilaigolongan  / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    }
                                }
                            } else {
                                foreach ($nilaigolonganP as $hijiken) {
                                    if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                        $brutoGet =   (float)$hargaPatokLahTake * 0.8;
                                        $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                        $tarifGet = (float)$hargaPatokLahTake;
                                    } else {
                                        $tarifGet = (float)$item->tarif * 0.5;
                                        $brutoGet =  (float)$tarifGet * 0.8;
                                        $pphGet =  $brutoGet *  $hijiken->nilaigolongan  / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    }
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else if (preg_match("/$cov/i", $item->namaproduk) && ($potong == 'ya' || $request['isRajal'] == "Y")) {


                        // if ((float)$dataReq['persen'] < 50) {
                        foreach ($nilaigolonganP as $hijiken) {


                            $tarifGet = (float)$item->tarif;
                            $brutoGet =  (float)$item->bruto;
                            $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $diskonpersen = null;
                        }
                        // }
                    } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Administrasi Rawat Inap') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Keperawatan'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Kebidanan'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Gizi'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->ruanganfk == '12' || $item->ruanganfk == "320" || $item->ruanganfk == "447" || $item->ruanganfk == "72") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->produkfk == $map->produkfk && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        break;
                        // } else if ($item->iddetailjenisproduk == '2092' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {
                        //     return ('d');
                        //     die();
                        //     $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                        //     $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                        //     $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        //     $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    } else if ($item->namadepartemen == "Instalasi Rawat Jalan") {

                        if ((float)$dataReq['persen'] < 50) {

                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else if ($request['isRajal'] == "T" && $potong == "ya") {
                        
                        if ((float)$dataReq['persen'] < 50) {
                            
                            foreach ($nilaigolonganP as $hijiken) {
                                // return($item->bruto);
                                // die();
                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                                // return($brutoGet);
                                // die();
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else if ($request['isRajal'] == "Y") {
                        
                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else {

                        $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                        $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    }
                    //  else {

                    //     if ((float)$dataReq['persen'] < 50) {
                    //         foreach ($nilaigolonganP as $hijiken) {

                    //             if ((float)$item->bruto>=  (float)$hargaPatokLah) {
                    //                 $brutoGet =   (float)$hargaPatokLahTake;
                    //                 $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                    //                 $nettoGet = (float)$brutoGet -  (float)$pphGet;
                    //                 $tarifGet = (float)$hargaPatokLahTake;
                    //             } else {

                    //                 $tarifGet = (float)$item->tarif * 0.5;
                    //                 $brutoGet =  (float)$item->bruto * 0.5;
                    //                 $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                    //                 $nettoGet = (float)$brutoGet -  (float)$pphGet;
                    //             }
                    //         }
                    //     } else {
                    //         $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                    //         $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                    //         $nettoGet = (float)$brutoGet -  (float)$pphGet;
                    //         $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    //     }
                    // }
                }

                // if($item->iddetailjenisproduk == '1433')
                // {
                //     $Kel = \DB::table('jasapelayanan_t')
                //     ->where('norec', $item->norec)
                //     ->where('jeniskomponen',$item->jeniskomponen)
                //     ->update([
                //         'bruto' =>  $brutoGet,
                //         'pph' => $pphGet,
                //         'netto' => $nettoGet,
                //         'tarif' => $tarifGet
                //     ]);
                // }
                // else{

                $Kel = \DB::table('jasapelayanan_t')
                    ->where('norec', $item->norec)
                    ->update([
                        'bruto' =>  $brutoGet,
                        'pph' => $pphGet,
                        'netto' => $nettoGet,
                        'tarif' => $tarifGet,
                        'diskonpersen' => $diskonpersen
                    ]);

                // }

            }

            $Kel1 = Pasiendaftar::where('noregistrasi', '=', $noregistrasi)
                ->update([
                    'tarifINACBLast' => (float)$dataReq['tarifINACBG'],
                    'persenJasaLast' => (float)$dataReq['persen'],
                    'tarifRsLast' => (float)$dataReq['tarifRS'],
                    // 'tglclosing' => null
                    // tarifRsLast
                    // tarifRS

                ]);
            $Kel1 = JasaPelayananDokter::where('noregistrasi', '=', $noregistrasi)
                ->where('ruanganfk', '=', '496')
                ->update([
                    'bruto' => 0,
                    // 'persenJasaLast' => (float)$dataReq['persen'] ,
                    // 'tarifRsLast' => (float)$dataReq['tarifRS'] ,
                    // 'tglclosing' => null
                    // tarifRsLast
                    // tarifRS

                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";
        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'noname',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'noname',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewLoopEclaimri(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        ini_set('max_execution_time', 500); //6 minutes
        $brutoGet = "";
        $diskonpersen = $dataReq['persen'];
        // $tglverif = '';
        $tglverif = $request['tglverif'];
        try {

            $cekPasien = $data = DB::select(
                DB::raw("select * from pasiendaftar_t where noregistrasi = $noregistrasi and  tarifINACBLast is not null ")
            );

            if (!empty($cekPasien)) {

                $result = array(
                    $transMessage = "Data Telah Dihitung Sebelumnya",
                    "status" => 400,
                    "by" => 'all',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            if ($tglverif == '') {
                $datajasa = \DB::table('v_jasapelayanan')
                    ->where('noregistrasi',  $noregistrasi)
                    // ->where('namaproduk', 'OCT')
                    ->get();
            } else {
                $datajasa = \DB::table('v_jasapelayanan')
                    ->where('noregistrasi',  $noregistrasi)
                    // ->where('namaproduk', 'OCT')
                    ->where('tglverif', $tglverif)
                    ->get();
            }
            $potong = 'ya';
            $datajasax = \DB::table('v_jasapelayanan')
                ->where('noregistrasi',  $noregistrasi)
                ->select('namadepartemen')
                ->distinct()
                ->get();
            foreach ($datajasax as $x) {
                if ($x->namadepartemen == 'Instalasi Rawat Inap' && $request['isRajal'] == "T") {
                    $potong = 'tidak';
                }
            }
            if (empty($datajasa) || $datajasa == "") {

                $result = array(
                    $transMessage = "Data Belum Terverivikasi",
                    "status" => 400,
                    "by" => 'all',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            //  return($potong);
            //  die(); 
            foreach ($datajasa as $item) {
                $dataMapp = \DB::table('mapPelayananToJasa')
                    ->where('statusenabled', '=', 1)
                    ->get();
                foreach ($dataMapp  as $map) {
                    $diskonpersen = $dataReq['persen'];
                    $nilaigolonganP = \DB::table('golonganpajakpegawai_m')
                        ->where('id', '=', $item->objectpajakfk)
                        ->get();
                    $hargaPatokLah = 1000000;
                    $hargaPatokLahTake = 500000;

                    $dicari = "konsul";
                    $cov = "COV";

                    //israjal = T

                    //pendaftaran full
                    if ($item->iddetailjenisproduk == '2016' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        //akomodasi rawatinap full
                    } else if ($item->iddetailjenisproduk == '476') {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        //visite ruagn vip
                    } else if ($item->iddetailjenisproduk == '481' && $item->jeniskomponen === '94'  &&  $request['isRajal'] == "Y") {

                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {
                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {

                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {
                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$tarifGet * 0.9;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                        //visite    
                    } else if ($item->iddetailjenisproduk == '1433'  && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {

                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$tarifGet * 0.8;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                        //visite    
                    } else if ($item->iddetailjenisproduk == '1433'  && $item->jeniskomponen === '94' &&  $request['isRajal'] == "T") {

                        $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                        $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if (preg_match("/$dicari/i", $item->namaproduk)   && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {
                        return('a');
                        die();
                        if ((float)$dataReq['persen'] < 50) {
                            if ($item->kelasfk == 4 || $item->kelasfk == 8 || $item->kelasfk == 5) {
                                foreach ($nilaigolonganP as $hijiken) {
                                    if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                        $brutoGet =   (float)$hargaPatokLahTake * 0.9;
                                        $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                        $tarifGet = (float)$hargaPatokLahTake;
                                    } else {
                                        $tarifGet = (float)$item->tarif * 0.5;
                                        $brutoGet =  (float)$tarifGet * 0.9;
                                        $pphGet =  $brutoGet *  $hijiken->nilaigolongan  / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    }
                                }
                            } else {
                                foreach ($nilaigolonganP as $hijiken) {
                                    if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                        $brutoGet =   (float)$hargaPatokLahTake * 0.8;
                                        $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                        $tarifGet = (float)$hargaPatokLahTake;
                                    } else {
                                        $tarifGet = (float)$item->tarif * 0.5;
                                        $brutoGet =  (float)$tarifGet * 0.8;
                                        $pphGet =  $brutoGet *  $hijiken->nilaigolongan  / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    }
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else if (preg_match("/$cov/i", $item->namaproduk) && $potong == 'ya' || $request['isRajal'] == "Y") {


                        // if ((float)$dataReq['persen'] < 50) {
                        foreach ($nilaigolonganP as $hijiken) {


                            $tarifGet = (float)$item->tarif;
                            $brutoGet =  (float)$item->bruto;
                            $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $diskonpersen = null;
                        }
                        // }
                    } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {


                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Administrasi Rawat Inap') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Keperawatan'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Kebidanan'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Gizi'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->ruanganfk == '12' || $item->ruanganfk == "320" || $item->ruanganfk == "447" || $item->ruanganfk == "72") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->produkfk == $map->produkfk && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        break;
                    } else if ($item->namadepartemen == "Instalasi Rawat Jalan") {
                        return('b');
                        die();
                        if ((float)$dataReq['persen'] < 50) {

                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else if ($request['isRajal'] == "T" && $potong == "ya") {
                                                return('c');
                        die();
                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else if ($request['isRajal'] == "Y") {
                        return('d');
                        die();
                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        } else {
                            $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                            $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                        }
                    } else {

                        $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                        $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    }

                }
                        return('x');
                        die();
                $Kel = \DB::table('jasapelayanan_t')
                    ->where('norec', $item->norec)
                    ->update([
                        'bruto' =>  $brutoGet,
                        'pph' => $pphGet,
                        'netto' => $nettoGet,
                        'tarif' => $tarifGet,
                        'diskonpersen' => $diskonpersen
                    ]);

                // }

            }

            $Kel1 = Pasiendaftar::where('noregistrasi', '=', $noregistrasi)
                ->update([
                    'tarifINACBLast' => (float)$dataReq['tarifINACBG'],
                    'persenJasaLast' => (float)$dataReq['persen'],
                    'tarifRsLast' => (float)$dataReq['tarifRS'],
                    // 'tglclosing' => null
                    // tarifRsLast
                    // tarifRS

                ]);
            $Kel1 = JasaPelayananDokter::where('noregistrasi', '=', $noregistrasi)
                ->where('ruanganfk', '=', '496')
                ->update([
                    'bruto' => 0,

                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";
        return ('lll');
        die();
        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'noname',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'noname',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJasaPelayananNewLoopEclaimv2(Request $request)
    {
        //TODO : SAVE PAGU
        DB::beginTransaction();
        $dataReq = $request->all();
        $noregistrasi =  $request['noregistrasi'];
        $tglverif =  $request['tglverif'];
        $diskonpersen =  $dataReq['persen'];

        ini_set('max_execution_time', 500); //6 minutes
        $brutoGet = "";

        try {

            $cekPasien = $data = DB::select(
                DB::raw("select * from pasiendaftar_t where noregistrasi = $noregistrasi and  tarifINACBLast is not null ")
            );

            // if (!empty($cekPasien)) {

            //     $result = array(
            //         $transMessage = "Data Telah Dihitung Sebelumnya",
            //         "status" => 400,
            //         "by" => 'all',
            //     );
            //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            // }
            $datajasa = \DB::table('v_jasapelayanan')
                ->where('noregistrasi',  $noregistrasi)
                ->where('tglverif', $tglverif)
                ->get();
            if (empty($datajasa) || $datajasa == "") {
                // $massage=[];
                // $keterangan = "Data Belum Terverivikasi";
                $result = array(
                    $transMessage = "Data Belum Terverivikasi",
                    "status" => 400,
                    "by" => 'all',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            // foreach ($datajasa as $item) {
            //     $dataMapp = \DB::table('mapPelayananToJasa')
            //         ->where('statusenabled', '=', 1)
            //         ->get();
            //     foreach ($dataMapp  as $map) {
            //         $diskonpersen = $dataReq['persen'];
            //         $nilaigolonganP = \DB::table('golonganpajakpegawai_m')
            //             ->where('id', '=', $item->objectpajakfk)
            //             ->get();
            //         $hargaPatokLah = 1000000;
            //         $hargaPatokLahTake = 500000;

            //         $dicari = "konsul";
            //         $cov = "COV";
            //         if ($item->iddetailjenisproduk == '2016' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {

            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->iddetailjenisproduk == '476') {

            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->iddetailjenisproduk == '481' && $item->jeniskomponen === '94'  &&  $request['isRajal'] == "Y") {

            //             if ((float)$dataReq['persen'] < 50) {
            //                 foreach ($nilaigolonganP as $hijiken) {
            //                     if ((float)$item->bruto>=  (float)$hargaPatokLah) {

            //                         $brutoGet =   (float)$hargaPatokLahTake;
            //                         $pphGet = $brutoGet *  $hijiken->nilaigolongan;
            //                         $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //                         $tarifGet = (float)$hargaPatokLahTake;
            //                     } else {
            //                         $tarifGet = (float)$item->bruto * 0.5;
            //                         $brutoGet =  (float)$tarifGet * 0.9;
            //                         $pphGet =  $brutoGet *  $hijiken->nilaigolongan;
            //                         $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //                     }
            //                 }
            //             }
            //         } else if ($item->iddetailjenisproduk == '1433'  && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {

            //             if ((float)$dataReq['persen'] < 50) {
            //                 foreach ($nilaigolonganP as $hijiken) {

            //                     if ((float)$item->bruto>=  (float)$hargaPatokLah) {
            //                         $brutoGet =   (float)$hargaPatokLahTake;
            //                         $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
            //                         $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //                         $tarifGet = (float)$hargaPatokLahTake;
            //                     } else {

            //                         $tarifGet = (float)$item->bruto * 0.5;
            //                         $brutoGet =  (float)$tarifGet * 0.8;
            //                         $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
            //                         $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //                     }
            //                 }
            //             }
            //         } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {

            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if (preg_match("/$dicari/i", $item->namaproduk)   && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {

            //             foreach ($nilaigolonganP as $hijiken) {
            //                 if ((float)$item->bruto>=  (float)$hargaPatokLah) {
            //                     $brutoGet =   (float)$hargaPatokLahTake * 0.8;
            //                     $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
            //                     $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //                     $tarifGet = (float)$hargaPatokLahTake;
            //                 } else {
            //                     $tarifGet = (float)$item->bruto * 0.5;
            //                     $brutoGet =  (float)$tarifGet * 0.8;
            //                     $pphGet =  $brutoGet *  $hijiken->nilaigolongan  / 100;
            //                     $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //                 }
            //             }
            //         } else if (preg_match("/$cov/i", $item->namaproduk)    &&  $request['isRajal'] == "Y") {

            //             // return ($item->namaproduk);
            //             // die();
            //             // if ((float)$dataReq['persen'] < 50) {
            //             foreach ($nilaigolonganP as $hijiken) {


            //                 $tarifGet = (float)$item->tarif;
            //                 $brutoGet =  (float)$item->bruto;
            //                 $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
            //                 $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //                 // $diskonpersen = null;
            //             }
            //             // }
            //         } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {


            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->namaproduk == 'Administrasi Rawat Inap') {
            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->namaproduk == 'Asuhan Keperawatan'  && $item->jeniskomponen == '25') {
            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->namaproduk == 'Asuhan Kebidanan'  && $item->jeniskomponen == '25') {
            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->namaproduk == 'Asuhan Gizi'  && $item->jeniskomponen == '25') {
            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->ruanganfk == '12' || $item->ruanganfk == "320" || $item->ruanganfk == "447" || $item->ruanganfk == "72") {

            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //         } else if ($item->produkfk == $map->produkfk && $request['isRajal'] == "T") {

            //             $brutoGet =  (float)$item->bruto;
            //             $pphGet = (float)$item->pph;
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = (float)$item->tarif;
            //             break;
            //             //     $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
            //         } else {


            //             $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
            //             $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
            //             $nettoGet = (float)$brutoGet -  (float)$pphGet;
            //             $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
            //         }
            //     }

            foreach ($datajasa as $item) {
                $dataMapp = \DB::table('mapPelayananToJasa')
                    ->where('statusenabled', '=', 1)
                    ->get();
                foreach ($dataMapp  as $map) {
                    $diskonpersen = $dataReq['persen'];
                    $nilaigolonganP = \DB::table('golonganpajakpegawai_m')
                        ->where('id', '=', $item->objectpajakfk)
                        ->get();
                    $hargaPatokLah = 1000000;
                    $hargaPatokLahTake = 500000;

                    $dicari = "konsul";
                    $cov = "COV";

                    //israjal = T

                    //pendaftaran full
                    if ($item->iddetailjenisproduk == '2016' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        //akomodasi rawatinap full
                    } else if ($item->iddetailjenisproduk == '476') {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        //visite ruagn vip
                    } else if ($item->iddetailjenisproduk == '481' && $item->jeniskomponen === '94'  &&  $request['isRajal'] == "Y") {

                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {
                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {

                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {
                                    $tarifGet = (float)$item->bruto * 0.5;
                                    $brutoGet =  (float)$tarifGet * 0.9;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        }
                        //visite    
                    } else if ($item->iddetailjenisproduk == '1433'  && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {

                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->bruto * 0.5;
                                    $brutoGet =  (float)$tarifGet * 0.8;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        }
                        //visite    
                    } else if ($item->iddetailjenisproduk == '1433'  && $item->jeniskomponen === '94' &&  $request['isRajal'] == "T") {

                        $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                        $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if (preg_match("/$dicari/i", $item->namaproduk)   && $item->jeniskomponen === '94' &&  $request['isRajal'] == "Y") {

                        if ((float)$dataReq['persen'] < 50) {
                            if ($item->kelasfk == 4 || $item->kelasfk == 8 || $item->kelasfk == 5) {
                                foreach ($nilaigolonganP as $hijiken) {
                                    if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                        $brutoGet =   (float)$hargaPatokLahTake * 0.9;
                                        $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                        $tarifGet = (float)$hargaPatokLahTake;
                                    } else {
                                        $tarifGet = (float)$item->bruto * 0.5;
                                        $brutoGet =  (float)$tarifGet * 0.9;
                                        $pphGet =  $brutoGet *  $hijiken->nilaigolongan  / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    }
                                }
                            } else {
                                foreach ($nilaigolonganP as $hijiken) {
                                    if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                        $brutoGet =   (float)$hargaPatokLahTake * 0.8;
                                        $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                        $tarifGet = (float)$hargaPatokLahTake;
                                    } else {
                                        $tarifGet = (float)$item->bruto * 0.5;
                                        $brutoGet =  (float)$tarifGet * 0.8;
                                        $pphGet =  $brutoGet *  $hijiken->nilaigolongan  / 100;
                                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    }
                                }
                            }
                        }
                    } else if (preg_match("/$cov/i", $item->namaproduk)    &&  $request['isRajal'] == "Y") {
                        foreach ($nilaigolonganP as $hijiken) {
                            $tarifGet = (float)$item->tarif;
                            $brutoGet =  (float)$item->bruto;
                            $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                            $nettoGet = (float)$brutoGet -  (float)$pphGet;
                            $diskonpersen = null;
                        }
                        // }
                    } else if ($item->iddetailjenisproduk == '2137' && $item->namadepartemen == "Instalasi Rawat Jalan" && $request['isRajal'] == "T") {


                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Administrasi Rawat Inap') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Keperawatan'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Kebidanan'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->namaproduk == 'Asuhan Gizi'  && $item->jeniskomponen == '25') {
                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->ruanganfk == '12' || $item->ruanganfk == "320" || $item->ruanganfk == "447" || $item->ruanganfk == "72") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                    } else if ($item->produkfk == $map->produkfk && $request['isRajal'] == "T") {

                        $brutoGet =  (float)$item->bruto;
                        $pphGet = (float)$item->pph;
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = (float)$item->tarif;
                        break;
                    } else if ($item->namadepartemen == "Instalasi Rawat Jalan") {

                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        }
                    } else if ($request['isRajal'] == "Y" && $item->namadepartemen != "Instalasi Rawat Jalan") {

                        if ((float)$dataReq['persen'] < 50) {
                            foreach ($nilaigolonganP as $hijiken) {

                                if ((float)$item->bruto >=  (float)$hargaPatokLah) {
                                    $brutoGet =   (float)$hargaPatokLahTake;
                                    $pphGet = $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                    $tarifGet = (float)$hargaPatokLahTake;
                                } else {

                                    $tarifGet = (float)$item->tarif * 0.5;
                                    $brutoGet =  (float)$item->bruto * 0.5;
                                    $pphGet =  $brutoGet *  $hijiken->nilaigolongan / 100;
                                    $nettoGet = (float)$brutoGet -  (float)$pphGet;
                                }
                            }
                        }
                    } else {

                        $brutoGet = ((float)$dataReq['persen'] / 100) * (float)$item->bruto;
                        $pphGet = (float)$item->pph * ((float)$dataReq['persen'] / 100);
                        $nettoGet = (float)$brutoGet -  (float)$pphGet;
                        $tarifGet = ((float)$dataReq['persen'] / 100) * (float)$item->tarif;
                    }
                }

                $Kel = \DB::table('jasapelayanan_t')
                    ->where('norec', $item->norec)
                    ->update([
                        'bruto' =>  $brutoGet,
                        'pph' => $pphGet,
                        'netto' => $nettoGet,
                        'tarif' => $tarifGet,
                        'diskonpersen' => $diskonpersen
                    ]);

                // }

            }

            $Kel1 = Pasiendaftar::where('noregistrasi', '=', $noregistrasi)
                ->update([
                    'tarifINACBLast' => (float)$dataReq['tarifINACBG'],
                    'persenJasaLast' => (float)$dataReq['persen'],
                    'tarifRsLast' => (float)$dataReq['tarifRS'],
                    // 'tglclosing' => null
                    // tarifRsLast
                    // tarifRS

                ]);
            $Kel1 = JasaPelayananDokter::where('noregistrasi', '=', $noregistrasi)
                ->where('ruanganfk', '=', '496')
                ->update([
                    'bruto' => 0,
                    // 'persenJasaLast' => (float)$dataReq['persen'] ,
                    // 'tarifRsLast' => (float)$dataReq['tarifRS'] ,
                    // 'tglclosing' => null
                    // tarifRsLast
                    // tarifRS

                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'noname',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'noname',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deletejasapelayanan(Request $request)
    {
        $SCSC = JasaPelayananDokter::where('noregistrasi', $request['noregistrasi'])
            ->delete();
        $Kel1 = Pasiendaftar::where('noregistrasi', '=', $request['noregistrasi'])
            ->update([
                'tarifINACBLast' => NULL,
                'persenJasaLast' => NULL,
                'tglclosing' => NULL,
                'isclosing' => NULL

            ]);
        //## Logging User
        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'HAPUS VERIFIKASI JASA';
        $logUser->noreff = $request['noregistrasi'];
        $logUser->referensi = 'noregistrasi';
        $logUser->objectloginuserfk =  $request['pegawaiverif'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'HAPUS VERIFIKASI JASA';
        $logUser->save();

        $result[] = array(
            'noRegistrasi'  => $request['noregistrasi'],

        );

        return $this->respond($result);
    }
    public function deletejasapelayanannorec(Request $request)
    {
        $SCSC = JasaPelayananDokter::where('norecpp', $request['norec'])
            ->delete();
    }
    public function deletejasapelayanannorecbanyak(Request $request)
    {
        $datax = $request['dataDel'];
        try {
            foreach ($datax as $itmx) {
                $SCSC = JasaPelayananDokter::where('norecpp', $itmx['norec_pp'])
                    ->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editjumlah(Request $request)
    {
        try {
            DB::beginTransaction();

            $norecpp = $request['norec'];
            $jumlah = $request['jumlah'];
            $SCSC = JasaPelayananDokter::where('norecpp', $norecpp);
            $data = DB::select(
                DB::raw(
                    "select * from jasapelayanan_t
                  WHERE norecpp = '$norecpp' "
                )
            );
            if (!empty($data)) {

                foreach ($data as $itm) {

                    $norec = $itm->norec;
                    $jumlahlama = $itm->jumlah;

                    $brutolama = $itm->bruto / $jumlahlama;
                    $pphlama = $itm->pph / $jumlahlama;
                    $nettolama = $itm->netto / $jumlahlama;
                    $tariflama = $itm->tarif / $jumlahlama;

                    $brutobaru = $brutolama * $jumlah;
                    $pphbaru = $pphlama * $jumlah;
                    $nettobaru = $nettolama * $jumlah;
                    $tarifbaru = $tariflama * $jumlah;
                    $SCSC = JasaPelayananDokter::where('norec', '=', $norec)
                        ->update([
                            'tarif' => $tarifbaru,
                            'bruto' => $brutobaru,
                            'pph' => $pphbaru,
                            'netto' => $nettobaru,
                            'jumlah' => $jumlah
                        ]);
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveupdatejasapelayanan(Request $request)
    {
        //TODO : SAVE PAGU
        try {
            DB::beginTransaction();
            $new_PPP = $request['pelayananpasienpetugas'];
            $noregistrasi = $request['noregistrasi'];
            // return($new_PPP);
            // die();
            $norecpp = $new_PPP['norec_pp'];
            $SCSC = JasaPelayananDokter::where('norecpp', $norecpp);
            if (!empty($SCSC)) {
                $SCSCx = JasaPelayananDokter::where('norecpp', $norecpp)
                    ->delete();
                ini_set('max_execution_time', 500); //6 minutes
                $data = DB::select(
                    DB::raw(
                        "select golonganpajakpegawai_m.id,jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk, jasadokter.objectdetailjenisprodukfk, jasadokter.objectjenispetugaspefk,jasadokter.norecpp,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                      jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                      case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                      golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                      WHERE jasadokter.norecpp = '$norecpp' and jasadokter.objectruanganfk not in (44,277)"
                    )
                );
                $datax = DB::select(
                    DB::raw(
                        "select tglclosing from pasiendaftar_t WHERE  noregistrasi = $noregistrasi"
                    )
                );
                // $tglclosing = date('Y-m-d H:i:s');
                // $tglclosing = $request['tglclosing'];

                if (!empty($datax)) {
                    foreach ($datax as $itmx) {
                        $tglclosing = $itmx->tglclosing;
                    }
                }

                foreach ($data as $itm) {
                    $persenpph = 0;
                    $persenpph = $itm->nilaigolongan;
                    $bruto = $itm->jumlah * round($itm->harganetto, 0);
                    if ($itm->objectdetailjenisprodukfk == '2016') {
                        // if($itm->produkfk == '4056952'){
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }
                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                                if ($itm->komponenhargafk == 94) {
                                    if ($itm->objectbahanprodukfk == 1) {
                                        if ($itm->objectpajakpegawai == 1) {
                                            $itm->tarifrs = 18000;
                                            $bruto = 18000;
                                        } else {
                                            $itm->tarifrs = 16000;
                                            $bruto = 16000;
                                        }
                                    }
                                } else {
                                    if ($itm->objectbahanprodukfk == 1) {
                                        $istrueberkasrs = 1;
                                    }
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }

                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                        }
                    } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                        $bruto = $itm->jumlah * 50000;
                    }
                    if ($itm->objectruanganfk == '44') {

                        $itm->tarifrs = $itm->harganetto;
                        if (stripos($itm->namakelas, 'vip') !== false) {
                            $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                        } else {
                            $bruto = ($itm->jumlah *  $itm->tarifrs) * 0.8;
                        }
                        // return($bruto);
                        // die();
                    }
                    //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                    // $bruto = $itm->tarif * $persenbruto /100;
                    if ($itm->namaexternal == "dl") {
                        $bruto = $itm->tarifrs * $itm->jumlah;
                    }
                    $pph = $bruto * $persenpph / 100;
                    $netto = $bruto - $pph;
                    if ($tglclosing  == "") {
                        $tglclosing =  $itm->tglpelayanan;
                    }
                    // return($tglclosing);
                    $jaspel = new JasaPelayananDokter();
                    $norecjaspel = $jaspel->generateNewId();
                    $jaspel->norec = $norecjaspel;
                    $jaspel->idpetugas = $itm->objectpegawaifk;
                    $jaspel->produkfk = $itm->produkfk;
                    $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                    $jaspel->jeniskomponen = $itm->komponenhargafk;
                    $jaspel->bruto = $bruto;
                    $jaspel->pph = $pph;
                    $jaspel->netto = $netto;
                    $jaspel->petugasverif = $request['pegawaiverif'];
                    $jaspel->noregistrasi = $request['noregistrasi'];
                    $jaspel->ruanganfk = $itm->objectruanganfk;
                    $jaspel->tglpelayanan = $itm->tglpelayanan;
                    // $jaspel->tglverif = $itm->tglpelayanan;
                    $jaspel->tglverif =  $tglclosing;
                    $jaspel->jumlah = (float)$itm->jumlah;
                    $jaspel->kelasfk = $itm->idkelas;
                    $jaspel->norecpp = $itm->norecpp;
                    $jaspel->norecppd = $itm->norecppd;
                    $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                    $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                    $jaspel->save();
                }

                $data2 = DB::select(
                    DB::raw(
                        "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal,jasadokterbedah.objectbahanprodukfk, jasadokterbedah.objectdetailjenisprodukfk, jasadokterbedah.objectjenispetugaspefk,jasadokterbedah.norecpp,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                      jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                      case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                      golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                      WHERE jasadokterbedah.norecpp = '$norecpp' and jasadokterbedah.objectruanganfk in  (44,277)"
                    )
                );
                foreach ($data2 as $itm) {
                    $persenpph = 0;
                    $persenpph = $itm->nilaigolongan;
                    $bruto = $itm->jumlah * round($itm->harganetto, 0);
                    if ($itm->objectdetailjenisprodukfk == '2016') {
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }
                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                                if ($itm->objectbahanprodukfk == 1) {
                                    if ($itm->objectpajakpegawai == 1) {
                                        $itm->tarifrs = 18000;
                                        $bruto = 18000;
                                    } else {
                                        $itm->tarifrs = 16000;
                                        $bruto = 16000;
                                    }
                                }
                            } else {
                                if ($itm->objectbahanprodukfk == 1) {
                                    $istrueberkasrs = 1;
                                }
                                $itm->tarifrs = $bruto;
                                $bruto = $bruto;
                            }
                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                $itm->tarifrs = $bruto;
                                $bruto = ($itm->jumlah * $bruto) * $pengali;
                            }
                        }
                    } elseif ($itm->objectdetailjenisprodukfk == '2143' || $itm->objectdetailjenisprodukfk == '2142' || $itm->objectdetailjenisprodukfk == '118') {
                        $bruto = $itm->jumlah * 50000;
                    }
                    if ($itm->objectruanganfk == '44') {

                        $itm->tarifrs = $itm->harganetto;
                        if (stripos($itm->namakelas, 'vip') !== false) {
                            $bruto = ($itm->jumlah * $itm->tarifrs) * 0.9;
                        } else {
                            $bruto = ($itm->jumlah * $itm->tarifrs) * 0.8;
                        }
                        // return($bruto);
                        // die();
                    }
                    //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                    // $bruto = $itm->tarif * $persenbruto /100;
                    $pph = $bruto * $persenpph / 100;
                    $netto = $bruto - $pph;
                    if ($tglclosing  == "") {
                        $tglclosing =  $itm->tglpelayanan;
                    }
                    $jaspel = new JasaPelayananDokter();
                    $norecjaspel = $jaspel->generateNewId();
                    $jaspel->norec = $norecjaspel;
                    $jaspel->idpetugas = $itm->objectpegawaifk;
                    $jaspel->produkfk = $itm->produkfk;
                    $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                    $jaspel->jeniskomponen = $itm->komponenhargafk;
                    $jaspel->bruto = $bruto;
                    $jaspel->pph = $pph;
                    $jaspel->netto = $netto;
                    $jaspel->petugasverif = $request['pegawaiverif'];
                    $jaspel->noregistrasi = $request['noregistrasi'];
                    $jaspel->ruanganfk = $itm->objectruanganfk;
                    $jaspel->tglpelayanan = $itm->tglpelayanan;
                    // $jaspel->tglverif = $itm->tglpelayanan;
                    $jaspel->tglverif =  $tglclosing;
                    $jaspel->jumlah = (float)$itm->jumlah;
                    $jaspel->kelasfk = $itm->idkelas;
                    $jaspel->norecpp = $itm->norecpp;
                    $jaspel->norecppd = $itm->norecppd;
                    $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                    $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                    $jaspel->save();
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function berkasrs(Request $request)
    {
        //TODO : SAVE PAGU
        try {
            DB::beginTransaction();
            $new_PPP = $request['pelayananpasienpetugas'];
            $noregistrasi = $request['noregistrasi'];
            $tipe = $request['tipe'];
            // return($new_PPP);
            // die();
            $norecpp = $new_PPP['norec_pp'];
            $SCSC = JasaPelayananDokter::where('norecpp', $norecpp);
            if (!empty($SCSC)) {
                $SCSCx = JasaPelayananDokter::where('norecpp', $norecpp)
                    ->delete();
                ini_set('max_execution_time', 500); //6 minutes
                $data = DB::select(
                    DB::raw(
                        "select golonganpajakpegawai_m.id,jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk, jasadokter.objectdetailjenisprodukfk, jasadokter.objectjenispetugaspefk,jasadokter.norecpp,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                      jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                      case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                      golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                      WHERE jasadokter.norecpp = '$norecpp' and jasadokter.objectruanganfk not in (44,277)"
                    )
                );
                $datax = DB::select(
                    DB::raw(
                        "select tglclosing from pasiendaftar_t WHERE  noregistrasi = $noregistrasi"
                    )
                );
                // $tglclosing = date('Y-m-d H:i:s');
                $tglclosing = $request['tglclosing'];

                // if(!empty($datax)){
                //     foreach ($datax as $itmx){
                //         $tglclosing = $itmx->tglclosing;
                //     }                
                // }

                foreach ($data as $itm) {
                    $persenpph = 0;
                    $persenpph = $itm->nilaigolongan;
                    $bruto = $itm->jumlah * round($itm->harganetto, 0);


                    if ($itm->objectdetailjenisprodukfk == '2016') {
                        // if($itm->produkfk == '4056952'){
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;

                                    $berkasrs = true;
                                    if ($itm->objectpajakpegawai == 1) {
                                        $itm->tarifrs = 18000;
                                        $bruto = 18000;
                                    } else {
                                        $itm->tarifrs = 16000;
                                        $bruto = 16000;
                                    }
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }

                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;


                                    if ($itm->objectbahanprodukfk == 1) {
                                        $berkasrs = true;
                                        $kodetindakankonsul = $itm->produkfk;
                                        $ruangankoknsul = $itm->objectruanganfk;
                                        if ($itm->objectpajakpegawai == 1) {
                                            $itm->tarifrs = 18000;
                                            $bruto = 18000;
                                        } else {
                                            $itm->tarifrs = 16000;
                                            $bruto = 16000;
                                        }
                                        $istrueberkasrs = 1;
                                    }
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                    if ($itm->objectbahanprodukfk == 1) {
                                        $istrueberkasrs = 1;
                                    }
                                }
                            }
                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = $bruto;
                                }
                            }
                        }
                    }

                    //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                    // $bruto = $itm->tarif * $persenbruto /100;
                    $pph = $bruto * $persenpph / 100;
                    $netto = $bruto - $pph;
                    if ($tglclosing  == "") {
                        $tglclosing =  $itm->tglpelayanan;
                    }
                    $jaspel = new JasaPelayananDokter();
                    $norecjaspel = $jaspel->generateNewId();
                    $jaspel->norec = $norecjaspel;
                    $jaspel->idpetugas = $itm->objectpegawaifk;
                    $jaspel->produkfk = $itm->produkfk;
                    $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                    $jaspel->jeniskomponen = $itm->komponenhargafk;
                    $jaspel->bruto = $bruto;
                    $jaspel->pph = $pph;
                    $jaspel->netto = $netto;
                    $jaspel->petugasverif = $request['pegawaiverif'];
                    $jaspel->noregistrasi = $request['noregistrasi'];
                    $jaspel->ruanganfk = $itm->objectruanganfk;
                    $jaspel->tglpelayanan = $itm->tglpelayanan;
                    // $jaspel->tglverif = $itm->tglpelayanan;
                    $jaspel->tglverif =  $tglclosing;
                    $jaspel->jumlah = (float)$itm->jumlah;
                    $jaspel->kelasfk = $itm->idkelas;
                    $jaspel->norecpp = $itm->norecpp;
                    $jaspel->norecppd = $itm->norecppd;
                    $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                    $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                    $jaspel->isberkasrs = $tipe;
                    $jaspel->save();
                }

                $data2 = DB::select(
                    DB::raw(
                        "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal,jasadokterbedah.objectbahanprodukfk, jasadokterbedah.objectdetailjenisprodukfk, jasadokterbedah.objectjenispetugaspefk,jasadokterbedah.norecpp,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                      jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                      case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                      golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                      WHERE jasadokterbedah.norecpp = '$norecpp' and jasadokterbedah.objectruanganfk in  (44,277)"
                    )
                );
                foreach ($data2 as $itm) {
                    $persenpph = 0;
                    $persenpph = $itm->nilaigolongan;
                    $bruto = $itm->jumlah * round($itm->harganetto, 0);

                    if ($itm->objectbahanprodukfk == 1) {
                        if ($itm->objectpajakpegawai == 1) {
                            $itm->tarifrs = 18000;
                            $bruto = 18000;
                        } else {
                            $itm->tarifrs = 16000;
                            $bruto = 16000;
                        }
                    }

                    //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                    // $bruto = $itm->tarif * $persenbruto /100;
                    if ($itm->namaexternal == "dl") {
                        $bruto = $itm->tarifrs * $itm->jumlah;
                    }
                    $pph = $bruto * $persenpph / 100;
                    $netto = $bruto - $pph;

                    $jaspel = new JasaPelayananDokter();
                    $norecjaspel = $jaspel->generateNewId();
                    $jaspel->norec = $norecjaspel;
                    $jaspel->idpetugas = $itm->objectpegawaifk;
                    $jaspel->produkfk = $itm->produkfk;
                    $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                    $jaspel->jeniskomponen = $itm->komponenhargafk;
                    $jaspel->bruto = $bruto;
                    $jaspel->pph = $pph;
                    $jaspel->netto = $netto;
                    $jaspel->petugasverif = $request['pegawaiverif'];
                    $jaspel->noregistrasi = $request['noregistrasi'];
                    $jaspel->ruanganfk = $itm->objectruanganfk;
                    $jaspel->tglpelayanan = $itm->tglpelayanan;
                    // $jaspel->tglverif = $itm->tglpelayanan;
                    $jaspel->tglverif =  $tglclosing;
                    $jaspel->jumlah = (float)$itm->jumlah;
                    $jaspel->kelasfk = $itm->idkelas;
                    $jaspel->norecpp = $itm->norecpp;
                    $jaspel->norecppd = $itm->norecppd;
                    $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                    $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                    $jaspel->isberkasrs = $tipe;
                    $jaspel->save();
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function berkasrsKeuangan(Request $request)
    {
        //TODO : SAVE PAGU
        try {
            DB::beginTransaction();
            $new_PPP = $request['pelayananpasienpetugas'];
            $noregistrasi = $request['noregistrasi'];
            $tipe = $request['tipe'];
            // return($new_PPP);
            // die();
            $norecpp = $new_PPP['norec_pp'];
            $SCSC = JasaPelayananDokter::where('norecpp', $norecpp);
            if (!empty($SCSC)) {
                $SCSCx = JasaPelayananDokter::where('norecpp', $norecpp)
                    ->delete();
                ini_set('max_execution_time', 500); //6 minutes
                $data = DB::select(
                    DB::raw(
                        "select golonganpajakpegawai_m.id,jasadokter.objectkelompokpasienlastfk,jasadokter.namaexternal,jasadokter.objectbahanprodukfk, jasadokter.objectdetailjenisprodukfk, jasadokter.objectjenispetugaspefk,jasadokter.norecpp,jasadokter.norecppd,jasadokter.tarifrs,jasadokter.objectpegawaifk, jasadokter.produkfk,jasadokter.objectpajakpegawai,jasadokter.nocm, jasadokter.namalengkap, jasadokter.namaproduk, jasadokter.noregistrasi, jasadokter.komponenharga,  
                      jasadokter.hargajual, jasadokter.jumlah, jasadokter.namaruangan, jasadokter.tglpelayanan, jasadokter.jenispetugaspe, jasadokter.namadepartemen, jasadokter.namarekanan, jasadokter.idkelas, jasadokter.namakelas, 
                      case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokter.harganetto ,jasadokter.komponenhargafk , jasadokter.objectruanganfk FROM jasadokter LEFT OUTER JOIN
                      golonganpajakpegawai_m ON jasadokter.objectpajakpegawai = golonganpajakpegawai_m.id
                      WHERE jasadokter.norecpp = '$norecpp' and jasadokter.objectruanganfk not in (44,277)"
                    )
                );
                $datax = DB::select(
                    DB::raw(
                        "select tglclosing from pasiendaftar_t WHERE  noregistrasi = $noregistrasi"
                    )
                );
                // $tglclosing = date('Y-m-d H:i:s');
                $tglclosing = $request['tglclosing'];

                // if(!empty($datax)){
                //     foreach ($datax as $itmx){
                //         $tglclosing = $itmx->tglclosing;
                //     }                
                // }

                foreach ($data as $itm) {
                    $persenpph = 0;
                    $persenpph = $itm->nilaigolongan;
                    $bruto = $itm->jumlah * round($itm->harganetto, 0);


                    if ($itm->objectdetailjenisprodukfk == '2016') {
                        // if($itm->produkfk == '4056952'){
                        if ($itm->objectkelompokpasienlastfk == 2) {
                            if ($itm->id != 1) {
                                $pengali = 0.8;
                            } else {
                                $pengali = 0.9;
                            }
                        } else {
                            $pengali = 0.8;
                        }
                        if ($itm->komponenhargafk !== '98' || $itm->komponenhargafk !== '100' || $itm->komponenhargafk !== '25') {
                            if (stripos($itm->namaproduk, 'PEMERIKSAAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;

                                    $berkasrs = true;
                                    if ($itm->objectpajakpegawai == 1) {
                                        $itm->tarifrs = 18000;
                                        $bruto = 18000;
                                    } else {
                                        $itm->tarifrs = 16000;
                                        $bruto = 16000;
                                    }
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                }
                            }

                            if (stripos($itm->namaproduk, 'KONSUL') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;


                                    if ($itm->objectbahanprodukfk == 1) {
                                        $berkasrs = true;
                                        $kodetindakankonsul = $itm->produkfk;
                                        $ruangankoknsul = $itm->objectruanganfk;
                                        if ($itm->objectpajakpegawai == 1) {
                                            $itm->tarifrs = 18000;
                                            $bruto = 18000;
                                        } else {
                                            $itm->tarifrs = 16000;
                                            $bruto = 16000;
                                        }
                                        $istrueberkasrs = 1;
                                    }
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto);
                                    if ($itm->objectbahanprodukfk == 1) {
                                        $istrueberkasrs = 1;
                                    }
                                }
                            }
                            if (stripos($itm->namaproduk, 'PENDAFTARAN') !== false) {
                                if ($itm->komponenhargafk == 94) {
                                    $itm->tarifrs = $bruto;
                                    $bruto = ($itm->jumlah * $bruto) * $pengali;
                                } else {
                                    $itm->tarifrs = $bruto;
                                    $bruto = $bruto;
                                }
                            }
                        }
                    }

                    //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                    // $bruto = $itm->tarif * $persenbruto /100;
                    $pph = $bruto * $persenpph / 100;
                    $netto = $bruto - $pph;
                    if ($tglclosing  == "") {
                        $tglclosing =  $itm->tglpelayanan;
                    }
                    $jaspel = new JasaPelayananDokter();
                    $norecjaspel = $jaspel->generateNewId();
                    $jaspel->norec = $norecjaspel;
                    $jaspel->idpetugas = $itm->objectpegawaifk;
                    $jaspel->produkfk = $itm->produkfk;
                    $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                    $jaspel->jeniskomponen = $itm->komponenhargafk;
                    $jaspel->bruto = $bruto;
                    $jaspel->pph = $pph;
                    $jaspel->netto = $netto;
                    $jaspel->petugasverif = $request['pegawaiverif'];
                    $jaspel->noregistrasi = $request['noregistrasi'];
                    $jaspel->ruanganfk = $itm->objectruanganfk;
                    $jaspel->tglpelayanan = $itm->tglpelayanan;
                    // $jaspel->tglverif = $itm->tglpelayanan;
                    $jaspel->tglverif =  $tglclosing;
                    $jaspel->jumlah = (float)$itm->jumlah;
                    $jaspel->kelasfk = $itm->idkelas;
                    $jaspel->norecpp = $itm->norecpp;
                    $jaspel->norecppd = $itm->norecppd;
                    $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                    $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                    $jaspel->isberkasrs = $tipe;
                    $jaspel->save();
                }

                $data2 = DB::select(
                    DB::raw(
                        "select jasadokterbedah.objectkelompokpasienlastfk,jasadokterbedah.namaexternal,jasadokterbedah.objectbahanprodukfk, jasadokterbedah.objectdetailjenisprodukfk, jasadokterbedah.objectjenispetugaspefk,jasadokterbedah.norecpp,jasadokterbedah.norecppd,jasadokterbedah.tarifrs,jasadokterbedah.objectpegawaifk, jasadokterbedah.produkfk,jasadokterbedah.objectpajakpegawai,jasadokterbedah.nocm, jasadokterbedah.namalengkap, jasadokterbedah.namaproduk, jasadokterbedah.noregistrasi, jasadokterbedah.komponenharga,  
                      jasadokterbedah.hargajual, jasadokterbedah.jumlah, jasadokterbedah.namaruangan, jasadokterbedah.tglpelayanan, jasadokterbedah.jenispetugaspe, jasadokterbedah.namadepartemen, jasadokterbedah.namarekanan, jasadokterbedah.idkelas, jasadokterbedah.namakelas, 
                      case when golonganpajakpegawai_m.nilaigolongan is null then 100 else golonganpajakpegawai_m.nilaigolongan end as nilaigolongan, golonganpajakpegawai_m.golonganpajakpegawai ,jasadokterbedah.harganetto ,jasadokterbedah.komponenhargafk , jasadokterbedah.objectruanganfk FROM jasadokterbedah LEFT OUTER JOIN
                      golonganpajakpegawai_m ON jasadokterbedah.objectpajakpegawai = golonganpajakpegawai_m.id
                      WHERE jasadokterbedah.norecpp = '$norecpp' and jasadokterbedah.objectruanganfk in  (44,277)"
                    )
                );
                foreach ($data2 as $itm) {
                    $persenpph = 0;
                    $persenpph = $itm->nilaigolongan;
                    $bruto = $itm->jumlah * round($itm->harganetto, 0);

                    if ($itm->objectbahanprodukfk == 1) {
                        if ($itm->objectpajakpegawai == 1) {
                            $itm->tarifrs = 18000;
                            $bruto = 18000;
                        } else {
                            $itm->tarifrs = 16000;
                            $bruto = 16000;
                        }
                    }

                    //persen pph disimpen disini karena tindakanya dilooping tiap dokter beda persen pphnya

                    // $bruto = $itm->tarif * $persenbruto /100;
                    if ($itm->namaexternal == "dl") {
                        $bruto = $itm->tarifrs * $itm->jumlah;
                    }
                    $pph = $bruto * $persenpph / 100;
                    $netto = $bruto - $pph;
                    $tipe = 1;
                    $jaspel = new JasaPelayananDokter();
                    $norecjaspel = $jaspel->generateNewId();
                    $jaspel->norec = $norecjaspel;
                    $jaspel->idpetugas = $itm->objectpegawaifk;
                    $jaspel->produkfk = $itm->produkfk;
                    $jaspel->tarif = $itm->tarifrs * $itm->jumlah;
                    $jaspel->jeniskomponen = $itm->komponenhargafk;
                    $jaspel->bruto = $bruto;
                    $jaspel->pph = $pph;
                    $jaspel->netto = $netto;
                    $jaspel->petugasverif = $request['pegawaiverif'];
                    $jaspel->noregistrasi = $request['noregistrasi'];
                    $jaspel->ruanganfk = $itm->objectruanganfk;
                    $jaspel->tglpelayanan = $itm->tglpelayanan;
                    // $jaspel->tglverif = $itm->tglpelayanan;
                    $jaspel->tglverif =  $tglclosing;
                    $jaspel->jumlah = (float)$itm->jumlah;
                    $jaspel->kelasfk = $itm->idkelas;
                    $jaspel->norecpp = $itm->norecpp;
                    $jaspel->norecppd = $itm->norecppd;
                    $jaspel->objectjenispetugaspefk = $itm->objectjenispetugaspefk;
                    $jaspel->objectpajakfk = $itm->objectpajakpegawai;
                    $jaspel->isberkasrs = $tipe;
                    $jaspel->save();
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Remunerasi";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updateHargaKomponenJaspel(Request $request) {
        try{
            DB::beginTransaction();
            $data = \DB::table('jasapelayanan_t as jp')
                    ->select('jp.*')
                    ->where('produkfk', $request['idProduk'])
                    ->where('jeniskomponen', $request['idKomponen'])
                    ->where('bruto', $request['hargaLama'])
                    ->where('tglverif', '>=', $request['tglAwal'])
                    ->where('tglverif', '<=', $request['tglAkhir'])
                    ->get();
            

            foreach($data as $item) {
                
                if($item->objectpajakfk == 1) {
                    JasaPelayananDokter::where('norec', $item->norec)
                    ->update([
                        'pph' => $request['hargaBaru'] * 0.15,
                        'netto' => $request['hargaBaru'] - ($request['hargaBaru'] * 0.15)
                    ]);
                };
                if($item->objectpajakfk == 2) {
                    JasaPelayananDokter::where('norec', $item->norec)
                    ->update([
                        'pph' => $request['hargaBaru'] * 0.05,
                        'netto' => $request['hargaBaru'] - ($request['hargaBaru'] * 0.05)
                    ]);
                };
                if($item->objectpajakfk == 3) {
                    JasaPelayananDokter::where('norec', $item->norec)
                    ->update([
                        'pph' => $request['hargaBaru'] * 0.025,
                        'netto' => $request['hargaBaru'] - ($request['hargaBaru'] * 0.025)
                    ]);
                }
            }

            JasaPelayananDokter::where('produkfk', $request['idProduk'])
                    ->where('jeniskomponen', $request['idKomponen'])
                    ->where('bruto', $request['hargaLama'])
                    ->where('tglverif', '>=', $request['tglAwal'])
                    ->where('tglverif', '<=', $request['tglAkhir'])
                    ->update([
                        'bruto' => $request['hargaBaru']
                    ]);


            $transStatus = 'true';
            $transMessage = 'Update Harga Berhasil !';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Update Harga Gagal';
        }

        if ($transStatus == 'true') {
            DB::commit();
            $result = array (
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array (
                "status" => 400,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}
